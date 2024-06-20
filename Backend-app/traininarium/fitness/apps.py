from django.apps import AppConfig


class FitnessConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'fitness'

    def ready(self):
        from . import signals   # регистрация сигналов по готовности сборки

