from health.models import StateInfo, DynamicInfo


def is_user_info_exists(user):
    """
    Проверка, что пользователь проходил опрос хотя бы
    один раз
    :param user: пользователь
    :return: True / False
    """
    return StateInfo.objects.filter(user=user).exists() and DynamicInfo.objects.filter(user=user).exists()
