import os

from django.db.models.signals import post_save, post_migrate
from django.dispatch import receiver
from pandas import DataFrame

from health.models import DynamicInfo
from health.services.prediction import PREDICTION_ATTRIBUTE_LIST
from traininarium import settings


@receiver(post_save, sender=DynamicInfo)
def dynamic_info_created(sender, instance, created, **kwargs):
    """
    Приёмник сигнала после создания сущности DynamicInfo для
    отслеживания количества записей
    :param sender: DynamicInfo
    :param created: is instance created
    :param instance: DynamicInfo
    """
    if created:
        if DynamicInfo.objects.filter(user=instance.user).count() >= settings.MAX_USER_DYNAMIC_INFO_TABLES:
            DynamicInfo.objects.filter(user=instance.user).earliest().delete()


@receiver(post_migrate)
def create_statistic_file_on_startup(sender, **kwargs):
    """
    Создание .csv файла для хранения статистической информации
    по опросам пользователей
    :param sender: migration manager
    """
    csv_path = settings.BASE_DIR / settings.STATIC_URL / 'csv'
    file_path = os.path.join(csv_path, 'user-statistic-info.csv')
    if not os.path.exists(csv_path):
        os.makedirs(csv_path)
    if not os.path.exists(file_path):
        with open(file_path, 'w'):
            pass
        DataFrame(columns=['risk_group_kp', 'verified'] + PREDICTION_ATTRIBUTE_LIST).to_csv(file_path, sep=',', index=False)


