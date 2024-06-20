from django.contrib.auth import get_user_model
from django.contrib.postgres.fields import ArrayField
from django.db import models
from django.urls import reverse

User = get_user_model()

INTENSITIES_MULTIPLE_CHOICE = (
    ('Low', 'Low'),
    ('Medium', 'Medium'),
    ('High', 'High')
)


class Plan(models.Model):
    slug = models.SlugField(max_length=255, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    name = models.CharField(max_length=255)
    picture = models.ImageField()
    intensity = models.CharField(choices=INTENSITIES_MULTIPLE_CHOICE)
    health_group = models.IntegerField()
    training_amount = models.IntegerField()
    is_filled = models.BooleanField(default=False)
    equipment = models.CharField()
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    followers = models.ManyToManyField(User, related_name='followers', through='PlanFollower')

    class Meta:
        get_latest_by = "name"
        ordering = ["name", ]
        indexes = [models.Index(fields=[
            "slug",
            "name",
            "health_group",
            "owner"
        ])]

    def get_absolute_url(self):
        return reverse("plan_detail", kwargs={"slug": self.slug})

    @staticmethod
    def get_user_field_name():
        return "owner"

    def __str__(self):
        return self.name


class PlanFollower(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    plan = models.ForeignKey(Plan, on_delete=models.CASCADE)
    follower = models.ForeignKey(User, on_delete=models.CASCADE)

    class Meta:
        db_table = 'fitness_plan_follower'
        get_latest_by = "created_at"
        ordering = ["created_at", ]
        indexes = [models.Index(fields=[
            "created_at",
            "plan",
            "follower"
        ])]

    @staticmethod
    def get_user_field_name():
        return "follower"


class Training(models.Model):
    slug = models.SlugField(max_length=255, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    plan = models.ForeignKey(Plan, on_delete=models.CASCADE)

    class Meta:
        get_latest_by = "slug"
        ordering = ["slug", ]
        indexes = [models.Index(fields=[
            "slug",
            "plan"
        ])]

    def get_absolute_url(self):
        return reverse("training_detail", kwargs={"slug": self.slug})

    def __str__(self):
        return self.slug


class TrainingPerformance(models.Model):
    user = models.ForeignKey(User, on_delete=models.PROTECT)
    training = models.ForeignKey(Training, on_delete=models.PROTECT)
    slug = models.SlugField(max_length=255, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    pulse = ArrayField(models.FloatField())
    mid_fatigue = models.BooleanField(default=False)
    short_breath = models.BooleanField(default=False)
    heart_ace = models.BooleanField(default=False)
    training_risk_g = models.FloatField()

    class Meta:
        db_table = 'fitness_training_performance'
        get_latest_by = "created_at"
        ordering = ["created_at", ]
        indexes = [models.Index(fields=[
            "slug",
            "created_at",
            "user",
            "training"
        ])]

    @staticmethod
    def get_user_field_name():
        return "user"


class Exercise(models.Model):
    slug = models.SlugField(max_length=255, unique=True)
    name = models.CharField(max_length=255, unique=True)
    picture = models.ImageField()
    description = models.CharField()
    time = models.IntegerField(null=True, blank=True)      # seconds
    amount = models.IntegerField(null=True, blank=True)    # repeats
    rest_time = models.IntegerField()                      # seconds

    class Meta:
        get_latest_by = "name"
        ordering = ["name", ]
        indexes = [models.Index(fields=[
            "name",
            "slug"
        ])]

    def __str__(self):
        return self.name


class TrainingExercise(models.Model):
    training = models.ForeignKey(Training, on_delete=models.CASCADE)
    exercise = models.ForeignKey(Exercise, on_delete=models.PROTECT)
    slug = models.SlugField(max_length=255, unique=True)

    class Meta:
        db_table = 'fitness_training_exercise'
        get_latest_by = "slug"
        ordering = ["slug", ]
        indexes = [models.Index(fields=[
            "slug",
            "training",
            "exercise"
        ])]

    def get_absolute_url(self):
        return reverse("training_exercise_detail", kwargs={"slug": self.slug})
