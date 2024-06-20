from django.contrib.auth import get_user_model
from django.db import models

User = get_user_model()

HEALTH_CONDITIONS_MULTIPLE_CHOICE = (
    ('Poor', 'Poor'),
    ('Fair', 'Fair'),
    ('Good', 'Good'),
    ('Very good', 'Very good'),
    ('Excellent', 'Excellent')
)


class StateInfo(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_heart_diseased = models.BooleanField(blank=True, null=True)
    is_diabetic = models.BooleanField(blank=True, null=True)
    is_diabetic_with_diseases = models.BooleanField(default=False)
    diabetic_period = models.IntegerField(default=0)                    # года
    is_kidney_diseased = models.BooleanField(blank=True, null=True)
    is_kidney_disease_chronic = models.BooleanField(default=False)
    is_cholesterol = models.BooleanField(blank=True, null=True)
    is_stroked = models.BooleanField(blank=True, null=True)
    height = models.IntegerField()
    is_physical_activity = models.BooleanField(default=False)
    is_smoker = models.BooleanField(default=False)
    is_alcoholic = models.BooleanField(default=False)
    is_asthmatic = models.BooleanField(default=False)
    is_skin_cancer = models.BooleanField(default=False)

    class Meta:
        db_table = 'health_state_info'
        indexes = [models.Index(fields=[
            "user",
        ])]


class DynamicInfo(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    risk_group_kp = models.FloatField()
    weight = models.FloatField()
    physical_health = models.IntegerField()            # дней в месяц
    mental_health = models.IntegerField()              # дней в месяц
    is_difficult_to_walk = models.BooleanField(default=False)
    is_blood_pressure = models.BooleanField(blank=True, null=True)
    general_health = models.CharField(choices=HEALTH_CONDITIONS_MULTIPLE_CHOICE)
    sleep_time = models.IntegerField()                 # часов в день
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    class Meta:
        db_table = 'health_dynamic_info'
        get_latest_by = "created_at"
        ordering = ["created_at", ]
        indexes = [models.Index(fields=[
            "created_at",
            "user",
        ])]
