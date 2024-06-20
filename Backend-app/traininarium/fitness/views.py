from django.contrib.auth import get_user_model
from django.http import Http404
from pytils.translit import slugify
from rest_framework import viewsets, status, generics, mixins
from rest_framework.decorators import action
from rest_framework.exceptions import MethodNotAllowed
from rest_framework.generics import get_object_or_404
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet

from fitness.models import Plan, Exercise, TrainingPerformance
from fitness.permissions import AdminOrRespondedUser, IsOwnerOrAdmin, IsOwner, RespondedUserOnly
from fitness.serializers import (
    PlanSerializer, CreatePlanSerializer, ExerciseSerializer, FillPlanSerializer, TrainingExercisesSerializer,
    TrainingExerciseSerializer, FollowPlanSerializer, ListPlanSerializer, CreateTrainingPerformanceSerializer,
    TrainingPerformanceSerializer, TrainingPerformancesSerializer,
)

User = get_user_model()


class PlanViewSet(viewsets.ModelViewSet):
    serializer_class = PlanSerializer
    permission_classes = [IsAuthenticated, ]
    queryset = Plan.objects.all()
    lookup_field = "slug"

    def get_permissions(self):
        if self.action in ["list", "retrieve", "get_training", "get_exercise"]:
            self.permission_classes = [AllowAny, ]
        if self.action in ["create"]:
            self.permission_classes = [AdminOrRespondedUser, ]
        if self.action in ["follow"]:
            self.permission_classes = [RespondedUserOnly, ]
        if self.action in ["fill"]:
            self.permission_classes = [IsOwner, ]
        if self.action in ["destroy"]:
            self.permission_classes = [IsOwnerOrAdmin, ]
        return super().get_permissions()

    def get_serializer_class(self):
        if self.action in ["list"]:
            return ListPlanSerializer
        if self.action in ["create"]:
            return CreatePlanSerializer
        if self.action in ["fill"]:
            return FillPlanSerializer
        if self.action in ["follow"]:
            return FollowPlanSerializer
        if self.action in ["get_training"]:
            return TrainingExercisesSerializer
        if self.action in ["get_exercise"]:
            return TrainingExerciseSerializer
        return self.serializer_class

    def get_queryset(self):
        admins = User.objects.filter(is_staff=True)
        if not self.request.user.is_authenticated:
            return Plan.objects.filter(owner__in=admins)
        else:
            if not self.request.user.is_staff:
                current_user = User.objects.filter(pk=self.request.user.pk)
                return Plan.objects.filter(owner__in=admins | current_user)
            else:
                return Plan.objects.all()

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(queryset)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(queryset)
        return Response(serializer.data)

    def update(self, request, *args, **kwargs):
        raise MethodNotAllowed('PUT')

    def partial_update(self, request, *args, **kwargs):
        raise MethodNotAllowed('PATCH')

    @action(detail=True, methods=["POST"])
    def fill(self, request, slug=None):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.fill(serializer.validated_data)
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=True, methods=["POST", "DELETE"])
    def follow(self, request, slug=None):
        instance = self.get_object()
        queryset = self.filter_queryset(self.get_queryset())
        if instance not in queryset:
            raise Http404()
        serializer = self.get_serializer(instance, data=request.data)
        serializer.is_valid(raise_exception=True)
        if request.method == "POST":
            serializer.start_following()
        elif request.method == "DELETE":
            serializer.stop_following()
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=False, methods=['GET'], url_path=r'(?P<slug>[-\w]+)/(?P<training_tag>training-\d+)')
    def get_training(self, request, slug, training_tag):
        instance = self.get_object()
        serializer = self.get_serializer(data={'slug': instance.slug, 'tag': training_tag})
        serializer.is_valid(raise_exception=True)
        return Response(serializer.data)

    @action(detail=False, methods=['GET'], url_path=r'(?P<slug>[-\w]+)/(?P<training_tag>training-\d+)/(?P<exercise_tag>exercise-\d+)')
    def get_exercise(self, request, slug, training_tag, exercise_tag):
        instance = self.get_object()
        serializer = self.get_serializer(data={
            'slug': instance.slug,
            'training_tag': training_tag,
            'exercise_tag': exercise_tag
        })
        serializer.is_valid(raise_exception=True)
        return Response(serializer.data)


class TrainingViewSet(mixins.CreateModelMixin,
                      mixins.RetrieveModelMixin,
                      GenericViewSet):
    serializer_class = TrainingPerformanceSerializer
    permission_classes = [IsAuthenticated, ]
    queryset = TrainingPerformance.objects.all()
    lookup_field = "slug"

    def get_permissions(self):
        if self.action in ["create"]:
            self.permission_classes = [RespondedUserOnly, ]
        if self.action in ["retrieve"]:
            self.permission_classes = [IsOwner, ]
        return super().get_permissions()

    def get_serializer_class(self):
        if self.action in ["create"]:
            return CreateTrainingPerformanceSerializer
        if self.action in ["get_trainings_by_plan"]:
            return TrainingPerformancesSerializer
        return self.serializer_class

    def get_object(self):
        queryset = self.filter_queryset(self.get_queryset())
        lookup_url_kwarg = self.lookup_url_kwarg or self.lookup_field
        assert lookup_url_kwarg in self.kwargs, (
            'Expected view %s to be called with a URL keyword argument '
            'named "%s". Fix your URL conf, or set the `.lookup_field` '
            'attribute on the view correctly.' %
            (self.__class__.__name__, lookup_url_kwarg)
        )
        filter_kwargs = {self.lookup_field: slugify(self.request.user.username) + "-" + self.kwargs[lookup_url_kwarg]}
        obj = get_object_or_404(queryset, **filter_kwargs)
        self.check_object_permissions(self.request, obj)
        return obj

    @action(detail=False, methods=['GET'], url_path=r'all/(?P<slug>[-\w]+)')
    def get_trainings_by_plan(self, request, slug):
        serializer = self.get_serializer(data={"slug": slug})
        serializer.is_valid(raise_exception=True)
        return Response(serializer.to_representation(serializer.validated_data))


class ExerciseViewSet(viewsets.ModelViewSet):
    serializer_class = ExerciseSerializer
    permission_classes = [IsAuthenticated, ]
    queryset = Exercise.objects.all()
    lookup_field = "slug"

    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            self.permission_classes = [AllowAny, ]
        if self.action in ["create", "update", "partial_update", "destroy"]:
            self.permission_classes = [IsAdminUser, ]
        return super().get_permissions()

