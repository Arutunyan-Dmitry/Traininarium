from typing import Dict, Any

from djoser.serializers import (
    PasswordRetypeSerializer, PasswordSerializer, UserSerializer,
    UserCreatePasswordRetypeSerializer
)
from pytils.translit import slugify
from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from core.models import User, UserCode
from core.services.email_code import (
    verify_activation_code, verify_lifetime, verify_reset_password_code,
    is_code_verification_passed, clean_user_code
)
from djoser.conf import settings


class UserSerializer(UserSerializer):
    """
    Кастомный сериализатор пользователя
    (с выводом is_admin, is_active, is_banned)
    """
    is_admin = serializers.SerializerMethodField()
    is_active = serializers.SerializerMethodField()
    is_banned = serializers.SerializerMethodField()

    @staticmethod
    def get_is_admin(obj):
        return obj.is_staff

    @staticmethod
    def get_is_active(obj):
        return obj.is_active

    @staticmethod
    def get_is_banned(obj):
        return obj.is_banned

    class Meta:
        model = User
        fields = tuple(User.REQUIRED_FIELDS) + (
            settings.USER_ID_FIELD,
            settings.LOGIN_FIELD,
            "is_admin",
            "is_active",
            "is_banned"
        )
        read_only_fields = (settings.LOGIN_FIELD, "is_admin", "is_active", "is_banned")


class UserCreatePasswordRetypeSerializer(UserCreatePasswordRetypeSerializer):
    """
    Кастомный сериализатор создания пользователя
    (с полем date_of_birth)
    """
    date_of_birth = serializers.DateField(input_formats=['%d.%m.%Y', ])

    default_error_messages = {
        "username": "Невозможно создать пользователя с таким именем."
    }

    def validate(self, attrs):
        validated_data = super().validate(attrs)
        if slugify(validated_data["username"].lower()) == "traininarium":
            key_error = "username"
            raise ValidationError({"username": [self.error_messages[key_error]]}, code=key_error)
        return validated_data


class UidCodeSerializer(serializers.Serializer):
    """
    Базовый сериализатор uid и кода
    """
    uid = serializers.IntegerField()
    code = serializers.CharField()
    user = serializers.SkipField(serializers.ModelField(model_field=User, read_only=True))
    user_code = serializers.SkipField(serializers.ModelField(model_field=UserCode, read_only=True))

    default_error_messages = {
        "invalid_uid": "Пользователь не найден.",
        "stale_code": "Время жизни кода активации истекло."
    }

    def validate(self, attrs):
        validated_data = super().validate(attrs)

        try:
            uid = self.initial_data.get("uid")
            validated_data["user"] = User.objects.get(pk=uid)
            validated_data["user_code"] = UserCode.objects.get(user_id=uid)
        except (User.DoesNotExist, UserCode.DoesNotExist, ValueError, TypeError, OverflowError):
            key_error = "invalid_uid"
            raise ValidationError({"uid": [self.error_messages[key_error]]}, code=key_error)

        if not verify_lifetime(validated_data["user_code"]):
            key_error = "stale_code"
            raise ValidationError({"code": [self.error_messages[key_error]]}, code=key_error)

        return validated_data


class ActivationSerializer(UidCodeSerializer):
    """
    Сериализатор активации учётной записи
    по коду и id пользователя
    """
    default_error_messages = {
        "error": "Что-то пошло не так. Возможно, был нарушен порядок выполнения операций.",
        "mismatch_code": "Данный код не соответствует требуемому."
    }

    def validate(self, attrs):
        validated_data = super().validate(attrs)

        try:
            self.user = validated_data["user"]
            self.user_code = validated_data["user_code"]
        except (AttributeError, TypeError):
            key_error = "error"
            raise ValidationError({"user": [self.error_messages[key_error]]}, code=key_error)

        if not verify_activation_code(self.user_code, self.initial_data.get("code")):
            key_error = "mismatch_code"
            raise ValidationError({"code": [self.error_messages[key_error]]}, code=key_error)

        return validated_data


class PasswordResetVerifySerializer(UidCodeSerializer):
    """
    Сериализатор сброса пароля учётной записи
    по коду и id пользователя
    """
    default_error_messages = {
        "error": "Что-то пошло не так. Возможно, был нарушен порядок выполнения операций.",
        "mismatch_code": "Данный код не соответствует требуемому."
    }

    def validate(self, attrs):
        validated_data = super().validate(attrs)

        try:
            self.user = validated_data["user"]
            self.user_code = validated_data["user_code"]
        except (AttributeError, TypeError):
            key_error = "error"
            raise ValidationError({"user": [self.error_messages[key_error]]}, code=key_error)

        if not verify_reset_password_code(self.user_code, self.initial_data.get("code")):
            key_error = "mismatch_code"
            raise ValidationError({"code": [self.error_messages[key_error]]}, code=key_error)

        return validated_data


class BasePasswordResetConfirmSerializer(UidCodeSerializer):
    """
    Базовый сериализатор подтверждения сброса пароля
    """
    code = serializers.SkipField(serializers.CharField(required=False))

    default_error_messages = {
        "error": "Что-то пошло не так. Возможно, был нарушен порядок выполнения операций.",
        "code_verify": "Код смены пароля не был подтверждён."
    }

    def validate(self, attrs):
        validated_data = super().validate(attrs)

        try:
            self.user = validated_data["user"]
            self.user_code = validated_data["user_code"]
        except (AttributeError, TypeError):
            key_error = "error"
            raise ValidationError({"user": [self.error_messages[key_error]]}, code=key_error)

        if not is_code_verification_passed(self.user_code):
            key_error = "code_verify"
            raise ValidationError({"code": [self.error_messages[key_error]]}, code=key_error)

        return validated_data


class PasswordResetConfirmRetypeSerializer(BasePasswordResetConfirmSerializer, PasswordRetypeSerializer):
    pass


class PasswordResetConfirmSerializer(BasePasswordResetConfirmSerializer, PasswordSerializer):
    pass


class BanSerializer(serializers.Serializer):
    """
    Сериализатор блокировки / разблокировки
    пользователя в системе
    """
    username = serializers.CharField()
    user = serializers.SkipField(serializers.ModelField(model_field=User, read_only=True))

    default_error_messages = {
        "invalid_username": "Пользователь не найден.",
        "admin_usage": "Больше никогда не пытайтесь блокировать администратора."
    }

    def validate(self, attrs):
        validated_data = super().validate(attrs)

        try:
            username = self.initial_data.get("username")
            self.user = User.objects.get(username=username)
        except (User.DoesNotExist, ValueError, TypeError, OverflowError):
            key_error = "invalid_username"
            raise ValidationError({"username": [self.error_messages[key_error]]}, code=key_error)

        if self.user.is_staff:
            key_error = "admin_usage"
            raise ValidationError({"admin": [self.error_messages[key_error]]}, code=key_error)

        return validated_data


class TokenObtainPairCleanSerializer(TokenObtainPairSerializer):
    """
    Сериализатор очистки мусора после
    авторизации пользователя в системе
    """
    def validate(self, attrs: Dict[str, Any]) -> Dict[str, str]:
        validated_data = super().validate(attrs)
        try:
            user = User.objects.get(username=attrs["username"])
            clean_user_code(user)
            validated_data["username"] = attrs["username"]
            validated_data["date_of_birth"] = user.date_of_birth.strftime("%d.%m.%Y")
            validated_data["is_admin"] = user.is_staff
        except(User.DoesNotExist, AttributeError, ValueError, TypeError):
            raise ValidationError({"user": "Пользователь не найден."}, code="user")

        if user.is_banned:
            raise ValidationError({"user": "Пользователь заблокирован."}, code="user")

        return validated_data

