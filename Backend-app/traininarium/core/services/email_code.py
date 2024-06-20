import hashlib
from random import randint

from django.utils import timezone

from core.models import UserCode
from traininarium import settings


def generate_code(user):
    """
    Генератор кода верификации
    :param user: пользователь
    :return: шестизначный код
    """
    if not UserCode.objects.filter(user=user).exists():
        code = randint(100000, 999999)
        UserCode.objects.create(user=user, code=hashlib.sha256(str(code).encode()).hexdigest())
    else:
        instance = UserCode.objects.get(user=user)
        code = randint(100000, 999999)
        instance.code = hashlib.sha256(str(code).encode()).hexdigest()
        instance.created_at = timezone.now()
        instance.save()
    return code


def verify_lifetime(model):
    """
    Проверка актуальности кода верификации
    :param model: связующая модель кода и пользователя
    """
    if abs(model.created_at - timezone.now()).total_seconds() > settings.CODE_LIFETIME:
        print(abs(model.created_at - timezone.now()).total_seconds())
        return False
    return True


def verify_activation_code(user_activation, code):
    """
    Проверка кода активации на соответствие
    :param user_activation: модель активации с исходным кодом
    :param code: предоставляемый код
    """
    if user_activation.code == hashlib.sha256(str(code).encode()).hexdigest():
        user_activation.delete()
        return True
    return False


def verify_reset_password_code(password_reset_model, code):
    """
    Проверка кода сброса пароля на соответствие
    :param password_reset_model: модель сброса пароля с исходным кодом
    :param code: предоставляемый код
    """
    if password_reset_model.code == hashlib.sha256(str(code).encode()).hexdigest():
        password_reset_model.is_verified = True
        password_reset_model.created_at = timezone.now()
        password_reset_model.save()
        return True
    return False


def is_code_verification_passed(password_reset_model):
    """
    Проверка прохождения верификации кода
    :param password_reset_model: модель сброса пароля с исходным кодом
    """
    if password_reset_model.is_verified:
        password_reset_model.delete()
        return True
    return False


def clean_user_code(user):
    """
    Сборщик мусора связующих сущностей после авторизации
    :param user: пользователь
    """
    if UserCode.objects.filter(user=user).exists():
        user_codes = UserCode.objects.filter(user=user)
        for uc in user_codes:
            uc.delete()
