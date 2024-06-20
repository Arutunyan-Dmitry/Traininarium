import re
from io import BytesIO

from PIL import Image
from django.forms import model_to_dict
from pytils.translit import slugify
from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _
from rest_framework.fields import empty
from rest_framework.utils.serializer_helpers import ReturnList

from fitness.models import (
    Plan, INTENSITIES_MULTIPLE_CHOICE, Exercise, Training, TrainingExercise, PlanFollower, TrainingPerformance
)
from fitness.utils import (
    generate_slug, slug_valid_upd, slug_valid, risk_group_provider
)
from health.models import DynamicInfo
from traininarium.settings import MEDIA_ROOT


class SlugSerializer(serializers.Serializer):
    """
    Сериализатор создания двусоставных слагов

    Параметры инициализации `__init__()`
     * `model` - класс модели в бд, для объекта которого создаётся слаг
     * `beg-slug` - 1-я составляющая слага
     * `end_slug` - 2-я составляющая слага
    """
    default_error_messages = {
        "data": _("Данные переданы некорректно."),
        "unique": _("Элемент с таким именем уже существует.")
    }

    def __init__(self, instance=None, data=empty, **kwargs):
        super().__init__(instance, data, **kwargs)
        self.model = None
        self.beg_slug = None
        self.end_slug = None

    def validate(self, attrs):
        validated_data = super().validate(attrs)
        if self.model is not None and self.beg_slug is not None and self.end_slug is not None:
            try:
                slug = generate_slug(self.beg_slug, self.end_slug)                 # генерация слага
            except AttributeError:
                key_error = "data"
                raise ValidationError(
                    {"data": [self.error_messages[key_error]]}, code=key_error
                )
            if self.context["request"].method in ["PUT", "PATCH"]:
                if not slug_valid_upd(self.model, slug, self.instance):            # проверка валидности слага (обновление)
                    key_error = "unique"
                    raise ValidationError(
                        {"title": [self.error_messages[key_error]]}, code=key_error
                    )
            else:
                if not slug_valid(self.model, slug):                               # проверка валидности слага (создание)
                    key_error = "unique"
                    raise ValidationError(
                        {"title": [self.error_messages[key_error]]}, code=key_error
                    )
            validated_data["slug"] = slug
        return validated_data


class ListPlanSerializer(serializers.Serializer):
    def __return_default(self, data, instance):
        for plan in list(instance.values()):
            nat_plan = Plan.objects.get(pk=plan.pop("id"))
            plan.pop("owner_id")
            plan["created_at"] = plan["created_at"].strftime("%d.%m.%Y %H:%M:%S")
            plan["picture"] = self.context["request"].build_absolute_uri(nat_plan.picture.url)
            plan["enabled"] = False
            data["other"].append(plan)
        return data

    def to_representation(self, instance):
        data = {
            "following": [],
            "recommended": [],
            "my": [],
            "other": []
        }
        if self.context["request"].user.is_authenticated:
            if DynamicInfo.objects.filter(user=self.context["request"].user).exists():
                risk_group = risk_group_provider(DynamicInfo.objects.filter(user=self.context["request"].user).latest().risk_group_kp)
                for plan in list(instance.filter(slug__startswith="traininarium-").values()):
                    nat_plan = Plan.objects.get(pk=plan.pop("id"))
                    plan.pop("owner_id")
                    plan["created_at"] = plan["created_at"].strftime("%d.%m.%Y %H:%M:%S")
                    plan["picture"] = self.context["request"].build_absolute_uri(nat_plan.picture.url)
                    if plan["health_group"] > risk_group:
                        plan["enabled"] = True
                        data["other"].append(plan)
                    elif plan["health_group"] == risk_group:
                        data["recommended"].append(plan)
                    else:
                        plan["enabled"] = False
                        data["other"].append(plan)

                if PlanFollower.objects.filter(follower=self.context["request"].user).exists():
                    for plan in list(
                            Plan.objects.filter(
                                pk__in=list(PlanFollower.objects.filter(
                                    follower=self.context["request"].user
                                ).values_list('plan', flat=True)
                                           )
                            ).values()
                    ):
                        nat_plan = Plan.objects.get(pk=plan.pop("id"))
                        plan.pop("owner_id")
                        plan["created_at"] = plan["created_at"].strftime("%d.%m.%Y %H:%M:%S")
                        plan["picture"] = self.context["request"].build_absolute_uri(nat_plan.picture.url)
                        if plan["health_group"] >= risk_group:
                            plan["enabled"] = True
                        else:
                            plan["enabled"] = False
                        data["following"].append(plan)

                if instance.filter(slug__startswith=slugify(self.context["request"].user.username) + "-").exists():
                    for plan in list(instance.filter(slug__startswith=slugify(self.context["request"].user.username) + "-").values()):
                        nat_plan = Plan.objects.get(pk=plan.pop("id"))
                        plan.pop("owner_id")
                        plan["created_at"] = plan["created_at"].strftime("%d.%m.%Y %H:%M:%S")
                        plan["picture"] = self.context["request"].build_absolute_uri(nat_plan.picture.url)
                        if plan["health_group"] >= risk_group:
                            plan["enabled"] = True
                        else:
                            plan["enabled"] = False
                        data["my"].append(plan)
            else:
                data = self.__return_default(data, instance)
        else:
            data = self.__return_default(data, instance)
        return data


class PlanSerializer(serializers.ModelSerializer):
    owner = serializers.SerializerMethodField()

    @staticmethod
    def get_owner(obj):
        if obj.owner.is_staff:
            return "traininarium"
        return obj.owner.username

    class Meta:
        model = Plan
        exclude = ["followers", "id"]
        read_only_fields = [field.name for field in Plan._meta.fields]
        lookup_field = "slug"

    def to_representation(self, instance):
        repr_obj = super().to_representation(instance)
        if self.context["request"].user.is_authenticated:
            if PlanFollower.objects.filter(plan=instance, follower=self.context["request"].user).exists():
                repr_obj["i_follow"] = True
            else:
                repr_obj["i_follow"] = False
        return repr_obj


class CreatePlanSerializer(PlanSerializer, SlugSerializer):
    owner = serializers.HiddenField(default=serializers.CurrentUserDefault())
    picture = serializers.ImageField(required=False)
    health_group = serializers.IntegerField(min_value=1, max_value=3, required=False)
    training_amount = serializers.IntegerField(min_value=10, max_value=30)
    intensity = serializers.ChoiceField(choices=INTENSITIES_MULTIPLE_CHOICE)
    equipment = serializers.CharField(required=False)
    slug = serializers.CharField(read_only=True)

    default_error_messages = {
        "health_group": _("Группа риска не была указана."),
    }

    class Meta:
        model = Plan
        fields = ["name", "picture", "intensity", "health_group", "training_amount", "owner", "equipment", "slug"]
        read_only_fields = ["slug", "created_at"]

    def validate(self, attrs):
        self.model = self.Meta.model                                      # Генерация слага
        if attrs.get("owner").is_staff:
            self.beg_slug = "traininarium"
        else:
            self.beg_slug = attrs.get("owner").username
        self.end_slug = attrs.get("name")
        validated_data = super().validate(attrs)
        if validated_data.get("owner").is_staff:                          # Добавление группы риска
            if "health_group" not in validated_data:
                key_error = "health_group"
                raise ValidationError(
                    {"health_group": [self.error_messages[key_error]]}, code=key_error
                )
        else:
            di = DynamicInfo.objects.filter(user=validated_data.get('owner')).latest()
            validated_data["health_group"] = risk_group_provider(di.risk_group_kp)
        validated_data["is_filled"] = False
        if validated_data.get("picture") is not None:
            image_data = BytesIO(validated_data["picture"].read())
            image = Image.open(image_data)
            image_name = 'custom/' + validated_data["slug"] + "." + image.format.lower()
            image_path = MEDIA_ROOT + image_name
            width, height = image.size
            aspect_ratio = width / height
            if aspect_ratio > 1000 / 700:
                new_width = round(aspect_ratio * 700)
                image = image.crop(((width - new_width) // 2, 0, (width + new_width) // 2, height))
            else:
                new_height = round(1000 / aspect_ratio)
                image = image.crop((0, (height - new_height) // 2, width, (height + new_height) // 2))
            image.save(image_path)
            validated_data["picture"] = image_name
        else:
            validated_data["picture"] = "plan/default-plan-image.jpg"
        return validated_data


class FillPlanSerializer(serializers.Serializer):
    exercises = serializers.ListField(child=serializers.CharField())

    default_error_messages = {
        "exercise": _("Были переданы несуществующие упражнения."),
        "exercises": _("Кол-во упражнений в тренировке должно быть от 10 до 30."),
        "filled": _("Этот план уже заполнен."),
    }

    def validate(self, attrs):
        validated_data = super().validate(attrs)
        if self.instance.is_filled:
            key_error = "filled"
            raise ValidationError(
                {"filled": [self.error_messages[key_error]]}, code=key_error
            )
        if len(validated_data["exercises"]) < 10 or len(validated_data["exercises"]) > 30:
            key_error = "exercises"
            raise ValidationError(
                {"exercises": [self.error_messages[key_error]]}, code=key_error
            )
        for exercise_slug in validated_data["exercises"]:
            if not Exercise.objects.filter(slug=exercise_slug).exists():
                key_error = "exercise"
                raise ValidationError(
                    {"exercise": [self.error_messages[key_error]]}, code=key_error
                )
        return validated_data

    def fill(self, validated_data):
        for i in range(self.instance.training_amount):
            training = Training.objects.create(slug=f'{self.instance.slug}-training-{i + 1}', plan=self.instance)
            counter = 0
            for exercise_slug in validated_data["exercises"]:
                counter += 1
                TrainingExercise.objects.create(
                    slug=f'{training.slug}-exercise-{counter}',
                    exercise=Exercise.objects.get(slug=exercise_slug),
                    training=training
                )
        self.instance.is_filled = True
        self.instance.save()


class FollowPlanSerializer(serializers.Serializer):
    default_error_messages = {
        "filled": _("Этот план ещё не заполнен."),
        "risk": _("Ваша группа риска не позволяет отслеживать данный план."),
        "amount": _("Нельзя отслеживать более 3х планов сразу."),
        "following": _("Вы уже отслеживаете данный план."),
        "not_following": _("Вы не отслеживали данный план."),
    }

    def validate(self, attrs):
        validated_data = super().validate(attrs)
        if not self.instance.is_filled:
            key_error = "filled"
            raise ValidationError(
                {"filled": [self.error_messages[key_error]]}, code=key_error
            )
        if self.context["request"].method == "POST":
            if risk_group_provider(DynamicInfo.objects.filter(user=self.context["request"].user).latest().risk_group_kp) > self.instance.health_group:
                key_error = "risk"
                raise ValidationError(
                    {"risk": [self.error_messages[key_error]]}, code=key_error
                )
            if PlanFollower.objects.filter(follower=self.context["request"].user).count() >= 3:
                key_error = "amount"
                raise ValidationError(
                    {"amount": [self.error_messages[key_error]]}, code=key_error
                )
            if PlanFollower.objects.filter(follower=self.context["request"].user, plan=self.instance).exists():
                key_error = "following"
                raise ValidationError(
                    {"following": [self.error_messages[key_error]]}, code=key_error
                )
        if self.context["request"].method == "DELETE":
            if not PlanFollower.objects.filter(follower=self.context["request"].user, plan=self.instance).exists():
                key_error = "not_following"
                raise ValidationError(
                    {"not_following": [self.error_messages[key_error]]}, code=key_error
                )
        return validated_data

    def start_following(self):
        PlanFollower.objects.create(follower=self.context["request"].user, plan=self.instance)

    def stop_following(self):
        PlanFollower.objects.get(follower=self.context["request"].user, plan=self.instance).delete()
        TrainingPerformance.objects.filter(slug__startswith=self.context["request"].user.username + "-" + self.instance.slug + "-training-").delete()


class TrainingPerformanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrainingPerformance
        exclude = ["id", "user", "training"]
        read_only_fields = [field.name for field in TrainingPerformance._meta.fields]
        lookup_field = "slug"


class TrainingPerformancesSerializer(serializers.Serializer):
    slug = serializers.CharField(write_only=True)

    default_error_messages = {
        "plan": _("Вы не отслеживаете данный план или его не существует."),
    }

    def validate(self, attrs):
        if not PlanFollower.objects.filter(plan__slug=attrs.get("slug"), follower=self.context["request"].user).exists():
            key_error = "plan"
            raise ValidationError(
                {"plan": [self.error_messages[key_error]]}, code=key_error
            )
        validated_data = list(
            TrainingPerformance.objects.filter(slug__startswith=slugify(self.context["request"].user.username) + "-" + attrs.get("slug") + "-training-").values()
        )
        return validated_data

    def to_representation(self, instance):
        for i in range(len(instance)):
            instance[i]["created_at"] = instance[i]["created_at"].strftime("%d.%m.%Y %H:%M:%S")
        return ReturnList(instance, serializer=self)


class CreateTrainingPerformanceSerializer(TrainingPerformanceSerializer, SlugSerializer):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    training_slug = serializers.CharField(write_only=True)

    default_error_messages = {
        "training": _("Такой тренировки не существует."),
        "plan": _("Вы не отслеживаете данный план."),
        "risk": _("Ваша группа риска больше не позволяет выполнять тренировки этого плана."),
    }

    class Meta:
        model = TrainingPerformance
        fields = ["training_slug", "pulse", "mid_fatigue", "short_breath", "heart_ace", "training_risk_g", "created_at", "user"]
        read_only_fields = ["created_at"]

    def validate(self, attrs):
        if Training.objects.filter(slug=attrs.get("training_slug")).exists():
            attrs["training"] = Training.objects.get(slug=attrs.get("training_slug"))
            plan = Plan.objects.get(slug=re.sub(r'-training-\d+', '', attrs.get("training_slug")))
            if not PlanFollower.objects.filter(follower=attrs.get("user"), plan=plan).exists():
                key_error = "plan"
                raise ValidationError(
                    {"plan": [self.error_messages[key_error]]}, code=key_error
                )
            if plan.health_group < risk_group_provider(DynamicInfo.objects.filter(user=attrs.get("user")).latest().risk_group_kp):
                key_error = "risk"
                raise ValidationError(
                    {"risk": [self.error_messages[key_error]]}, code=key_error
                )
        else:
            key_error = "training"
            raise ValidationError(
                {"training": [self.error_messages[key_error]]}, code=key_error
            )
        self.model = self.Meta.model                                      # Генерация слага
        self.beg_slug = attrs.get("user").username
        self.end_slug = attrs.get("training_slug")
        attrs.pop("training_slug")
        return super().validate(attrs)


class ExerciseSerializer(serializers.ModelSerializer, SlugSerializer):
    picture = serializers.ImageField(read_only=True)
    time = serializers.IntegerField(required=False)
    amount = serializers.IntegerField(required=False)

    default_error_messages = {
        "exercise": _("У упражнения обязательно должно быть указано время или кол-во подходов."),
    }

    class Meta:
        model = Exercise
        exclude = ["id"]
        read_only_fields = ["slug"]
        lookup_field = "slug"

    def validate(self, attrs):
        if self.context["request"].method in ["POST", "PUT", "PATCH"]:
            if 'name' in attrs:
                self.model = self.Meta.model
                self.beg_slug = attrs.get("name")
                self.end_slug = ''
        validated_data = super().validate(attrs)
        if self.context["request"].method in ["POST", "PUT"]:
            if "time" not in validated_data and "amount" not in validated_data:
                key_error = "exercise"
                raise ValidationError(
                    {"exercise": [self.error_messages[key_error]]}, code=key_error
                )
        if self.context["request"].method in ["PUT", "PATCH"]:
            if "time" in validated_data:
                validated_data["amount"] = None
            elif "amount" in validated_data:
                validated_data["time"] = None
        return validated_data


class TrainingExercisesSerializer(serializers.Serializer):
    slug = serializers.CharField(write_only=True)
    tag = serializers.CharField(write_only=True)
    name = serializers.CharField(read_only=True)
    number = serializers.IntegerField(read_only=True)
    exercises = serializers.ListField(read_only=True)

    default_error_messages = {
        "training": _("Такой тренировки не существует у данного плана."),
    }

    def validate(self, attrs):
        training = Training.objects.filter(slug=attrs.get("slug") + "-" + attrs.get("tag"))
        if not training.exists():
            key_error = "training"
            raise ValidationError(
                {"training": [self.error_messages[key_error]]}, code=key_error
            )
        validated_data = {
            'name': "Тренировка " + re.search(r'\d+$', attrs.get("tag")).group(),
            'number': re.search(r'\d+$', attrs.get("tag")).group(),
            'exercises': []
        }
        for te in TrainingExercise.objects.filter(training=training[0]):
            item = model_to_dict(Exercise.objects.get(slug=te.exercise.slug))
            item.pop("id")
            item["picture"] = self.context["request"].build_absolute_uri(item.pop("picture").url)
            validated_data["exercises"].append(item)
        return validated_data


class TrainingExerciseSerializer(serializers.Serializer):
    number = serializers.IntegerField(read_only=True)
    slug = serializers.CharField()
    training_tag = serializers.CharField(write_only=True)
    exercise_tag = serializers.CharField(write_only=True)
    name = serializers.CharField(read_only=True)
    picture = serializers.ImageField(read_only=True)
    description = serializers.CharField(read_only=True)
    time = serializers.IntegerField(read_only=True)
    amount = serializers.IntegerField(read_only=True)
    rest_time = serializers.IntegerField(read_only=True)

    default_error_messages = {
        "exercise": _("Такого упражнения не существует у данной тренировки."),
    }

    def validate(self, attrs):
        training_exercise = TrainingExercise.objects.filter(
            slug=attrs.get("slug") + "-" +
            attrs.get("training_tag") + "-" +
            attrs.get("exercise_tag")
        )
        if not training_exercise.exists():
            key_error = "exercise"
            raise ValidationError(
                {"exercise": [self.error_messages[key_error]]}, code=key_error
            )
        exercise = Exercise.objects.get(id=training_exercise[0].exercise_id)
        validated_data = {
            'number': re.search(r'\d+$', attrs.get("exercise_tag")).group(),
            'slug': exercise.slug,
            'name': exercise.name,
            'picture': exercise.picture,
            'description': exercise.description,
            'time': exercise.time,
            'amount': exercise.amount,
            'rest_time': exercise.rest_time
        }
        return validated_data


