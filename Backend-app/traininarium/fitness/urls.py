from django.urls import path, include
from rest_framework.routers import DefaultRouter

from fitness.views import PlanViewSet, ExerciseViewSet, TrainingViewSet

router = DefaultRouter()
router.register("plan", PlanViewSet)
router.register("exercise", ExerciseViewSet)
router.register("training", TrainingViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
