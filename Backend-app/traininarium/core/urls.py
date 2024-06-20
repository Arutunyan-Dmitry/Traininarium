from django.contrib.auth import get_user_model
from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import CustomUserViewSet

router = DefaultRouter()
router.register("users", CustomUserViewSet)

User = get_user_model()

urlpatterns = [
    path('auth/', include(router.urls)),
    path('auth/', include('djoser.urls.jwt')),
]
