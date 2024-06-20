from django.contrib.auth import get_user_model
from django.db import models
from django.urls import reverse

User = get_user_model()


class Article(models.Model):
    slug = models.SlugField(max_length=255, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    title = models.CharField(max_length=100, unique=True)
    picture = models.ImageField()
    body = models.CharField()
    owner = models.ForeignKey(User, on_delete=models.CASCADE)

    class Meta:
        get_latest_by = "created_at"
        ordering = ["created_at", ]
        indexes = [models.Index(fields=[
            "slug",
            "created_at",
            "owner"
        ])]

    def get_absolute_url(self):
        return reverse("article_detail", kwargs={"slug": self.slug})

    @staticmethod
    def get_user_field_name():
        return "owner"

    def __str__(self):
        return self.title
