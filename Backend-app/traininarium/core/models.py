from django.contrib.auth.models import AbstractUser
from django.db import models

RACE_MULTIPLE_CHOICE = (
    ('European', 'European'),
    ('African', 'African'),
    ('Asian', 'Asian'),
    ('Indian', 'Indian'),
    ('American', 'American'),
    ('Other', 'Other')
)

GENDER_MULTIPLE_CHOICE = (
    ('Male', 'Male'),
    ('Female', 'Female')
)


class User(AbstractUser):
    """
    Изменённая модель пользователя.

    Модель, предоставляющая уникальное поле e-mail,
    поле date_of_birth, gender, race.
    """
    email = models.EmailField(unique=True, blank=False)
    is_banned = models.BooleanField(default=False)
    date_of_birth = models.DateField()
    gender = models.CharField(choices=GENDER_MULTIPLE_CHOICE)
    race = models.CharField(choices=RACE_MULTIPLE_CHOICE)

    REQUIRED_FIELDS = ["email", "date_of_birth", "gender", "race"]


class UserCode(models.Model):
    """
    Связующая модель для кода активации / кода сброса
    пароля пользователя.
    """
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    code = models.CharField()
    is_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'core_user_code'
        indexes = [models.Index(fields=[
            "user",
        ])]

    def __str__(self):
        return f'Code for {self.user.username}'
