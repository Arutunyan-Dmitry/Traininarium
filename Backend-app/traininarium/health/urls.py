from django.urls import path, include
from rest_framework.routers import DefaultRouter

from health.views import SurveyViewSet, StateInfoViewSet, DynamicInfoViewSet

router = DefaultRouter()
router.register("dynamic-info", DynamicInfoViewSet, basename='dynamic-info')

urlpatterns = [
    path('', include(router.urls)),
    path('state-info/', StateInfoViewSet.as_view({'get': 'retrieve', 'put': 'update', 'patch': 'update'}), name='static-info'),
    path('survey/', SurveyViewSet.as_view({'post': 'survey'}), name='survey'),
]
