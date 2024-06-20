from django.http import Http404
from rest_framework import status, mixins
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import viewsets

from core.permissions import NoBanUser, NoAdminUser
from health.models import StateInfo, DynamicInfo
from health.serializers import (
    AnonymousPredictionSerializer, UserPredictionSerializer, StateInfoSerializer,
    DynamicInfoSerializer
)
from health.utils import is_user_info_exists


class SurveyViewSet(viewsets.GenericViewSet):
    serializer_class = AnonymousPredictionSerializer
    permission_classes = [AllowAny, ]

    def get_permissions(self):
        if self.request.user.is_authenticated:
            self.permission_classes = [NoBanUser, NoAdminUser, ]
        return super().get_permissions()

    def get_serializer_class(self):
        if self.request.user.is_authenticated:
            return UserPredictionSerializer
        return self.serializer_class

    @action(["POST"], detail=False)
    def survey(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        response = serializer.survey()
        return Response(response, status=status.HTTP_200_OK)


class StateInfoViewSet(viewsets.GenericViewSet):
    serializer_class = StateInfoSerializer
    permission_classes = [NoBanUser, NoAdminUser, ]

    def get_object(self):
        if not is_user_info_exists(self.request.user):
            raise Http404
        return StateInfo.objects.get(user=self.request.user)

    @action(["GET"], detail=False)
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    @action(["PUT", "PATCH"], detail=False)
    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.update(instance, serializer.validated_data)
        return Response(serializer.data)


class DynamicInfoViewSet(mixins.ListModelMixin,
                         mixins.CreateModelMixin,
                         viewsets.GenericViewSet):
    serializer_class = DynamicInfoSerializer
    permission_classes = [NoBanUser, NoAdminUser, ]
    queryset = DynamicInfo.objects.all()

    def get_queryset(self):
        if not is_user_info_exists(self.request.user):
            raise Http404
        return DynamicInfo.objects.filter(user=self.request.user)

    @action(methods=['GET'], detail=False)
    def latest(self, request, *args, **kwargs):
        instance = self.filter_queryset(self.get_queryset()).latest()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)
