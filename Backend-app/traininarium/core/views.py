from djoser import signals
from djoser.conf import settings
from djoser.views import UserViewSet
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.response import Response

from core.models import User
from core.services.email import ActivationEmail, PasswordResetEmail


class CustomUserViewSet(UserViewSet):
    def get_permissions(self):
        if self.action == "reset_password_verify":
            self.permission_classes = settings.PERMISSIONS.activation
        elif self.action == "ban" or self.action == "unban":
            self.permission_classes = settings.PERMISSIONS.ban
        return super().get_permissions()

    def get_serializer_class(self):
        if self.action == "reset_password_verify":
            self.serializer_class = settings.SERIALIZERS.password_reset_verify
        elif self.action == "ban" or self.action == "unban":
            self.serializer_class = settings.SERIALIZERS.ban
        return super().get_serializer_class()

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response({"uid": getattr(user, 'id'), "email": getattr(user, 'email')},
                        status=status.HTTP_201_CREATED, headers=headers)

    def perform_create(self, serializer, *args, **kwargs):
        user = serializer.save(*args, **kwargs)
        signals.user_registered.send(
            sender=self.__class__, user=user, request=self.request
        )
        context = {"user": user}
        to = [getattr(user, "email", None)]
        ActivationEmail(self.request, context).send(to)
        return user

    @action(["post"], detail=False)
    def resend_activation(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.get_user(is_active=False)

        if user:
            context = {"user": user}
            to = [getattr(user, "email", None)]
            ActivationEmail(self.request, context).send(to)
            return Response({"uid": getattr(user, 'id')},
                            status=status.HTTP_202_ACCEPTED)

        return Response({"user": "User does no exist or had already been activated"},
                        status=status.HTTP_400_BAD_REQUEST)

    @action(["post"], detail=False)
    def activation(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.user
        user.is_active = True
        user.save()

        signals.user_activated.send(
            sender=self.__class__, user=user, request=self.request
        )

        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(["post"], detail=False)
    def reset_password(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.get_user()

        if user:
            context = {"user": user}
            to = [getattr(user, "email", None)]
            PasswordResetEmail(self.request, context).send(to)
            return Response({"uid": getattr(user, 'id')},
                            status=status.HTTP_202_ACCEPTED)

        return Response({"user": "User does no exist or had not been activated"},
                        status=status.HTTP_400_BAD_REQUEST)

    @action(["post"], detail=False)
    def reset_password_verify(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        return Response(status=status.HTTP_202_ACCEPTED)

    @action(["post"], detail=False)
    def reset_password_confirm(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.user.set_password(serializer.data["new_password"])
        serializer.user.save()

        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(["post"], detail=False, url_path=f"reset_{User.USERNAME_FIELD}")
    def reset_username(self, request, *args, **kwargs):
        return Response(status=status.HTTP_404_NOT_FOUND)

    @action(["post"], detail=False, url_path=f"reset_{User.USERNAME_FIELD}_confirm")
    def reset_username_confirm(self, request, *args, **kwargs):
        return Response(status=status.HTTP_404_NOT_FOUND)

    @action(["post"], detail=False)
    def ban(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.user.is_banned = True
        serializer.user.save()

        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(["post"], detail=False)
    def unban(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.user.is_banned = False
        serializer.user.save()

        return Response(status=status.HTTP_204_NO_CONTENT)
