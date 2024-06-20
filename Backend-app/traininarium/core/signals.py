from django.utils import timezone

from blog.signals import initial_article_formatter
from fitness.signals import initial_plan_formatter
from .models import User
from django.db.models.signals import post_migrate
from django.dispatch import receiver


@receiver(post_migrate)
def create_initial_users(sender, **kwargs):
    """
    Метод первоначального создания администратора и тестового пользователя
    после миграции

    WARNING: Изменение начальных значений администратора и тестового
    пользователя может привести к непредвиденным ошибкам и
    блокировки системы
    :param sender: менеджер миграций
    """
    if not User.objects.filter(is_superuser=True).exists():
        User.objects.create_superuser(
            username='ADMIN',
            email='Retr073@yandex.ru',
            password='admin',
            date_of_birth=timezone.now()
        )
    if not User.objects.filter(username='test').exists():
        User.objects.create_user(
            username='test',
            email='test@test.test',
            password='test',
            is_active=True,
            date_of_birth=timezone.now(),
            gender='Male',
            race='European'
        )
        initial_plan_formatter.send(sender=sender)
        initial_article_formatter.send(sender=sender)
