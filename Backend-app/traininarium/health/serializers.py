from django.utils.translation import gettext_lazy as _
from django.utils import timezone
from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from core.models import GENDER_MULTIPLE_CHOICE, RACE_MULTIPLE_CHOICE
from health.models import StateInfo, HEALTH_CONDITIONS_MULTIPLE_CHOICE, DynamicInfo
from health.services.prediction import Predictor

predictor = Predictor()


class SurveySerializer(serializers.Serializer):
    """
    Базовый сериализатор для валидации данных опроса
    """
    default_error_messages = {
        "diabetic": _("Данные о диабете не были указаны."),
        "kidney_diseased": _("Данные о ХБП не были указаны."),
    }

    def validate(self, attrs):
        validated_data = super().validate(attrs)
        is_diabetic = validated_data.get('is_diabetic')
        if is_diabetic is not None:
            if is_diabetic:
                if validated_data.get('diabetic_period') is None or validated_data.get('is_diabetic_with_diseases') is None:
                    key_error = "diabetic"
                    raise ValidationError(
                        {"diabetic": [self.error_messages[key_error]]}, code=key_error
                    )
            else:
                validated_data['is_diabetic_with_diseases'] = False
                validated_data['diabetic_period'] = 0
        else:
            validated_data['is_diabetic_with_diseases'] = False
            validated_data['diabetic_period'] = 0
        is_kidney_diseased = validated_data.get('is_kidney_diseased')
        if is_kidney_diseased is not None:
            if is_kidney_diseased:
                if validated_data.get('is_kidney_disease_chronic') is None:
                    key_error = "kidney_diseased"
                    raise ValidationError(
                        {"kidney_diseased": [self.error_messages[key_error]]}, code=key_error
                    )
            else:
                validated_data['is_kidney_disease_chronic'] = False
        else:
            validated_data['is_kidney_disease_chronic'] = False
        return validated_data


class AnonymousPredictionSerializer(SurveySerializer):
    """
    Сериализатор опроса анонимных пользователей
    """
    is_using_data_agreed = serializers.BooleanField()
    date_of_birth = serializers.DateField(input_formats=['%d.%m.%Y', ])
    height = serializers.IntegerField(min_value=0, max_value=300)
    gender = serializers.ChoiceField(choices=GENDER_MULTIPLE_CHOICE)
    race = serializers.ChoiceField(choices=RACE_MULTIPLE_CHOICE)
    is_heart_diseased = serializers.BooleanField(allow_null=True)
    is_diabetic = serializers.BooleanField(allow_null=True)
    is_diabetic_with_diseases = serializers.BooleanField(allow_null=True)
    diabetic_period = serializers.IntegerField(min_value=0, max_value=100, allow_null=True)
    is_kidney_diseased = serializers.BooleanField(allow_null=True)
    is_kidney_disease_chronic = serializers.BooleanField(allow_null=True)
    is_cholesterol = serializers.BooleanField(allow_null=True)
    is_stroked = serializers.BooleanField(allow_null=True)
    is_blood_pressure = serializers.BooleanField(allow_null=True)
    is_physical_activity = serializers.BooleanField()
    is_smoker = serializers.BooleanField()
    is_alcoholic = serializers.BooleanField()
    is_asthmatic = serializers.BooleanField()
    is_skin_cancer = serializers.BooleanField()
    weight = serializers.FloatField(min_value=0, max_value=500)
    physical_health = serializers.IntegerField(min_value=0, max_value=30)
    mental_health = serializers.IntegerField(min_value=0, max_value=30)
    is_difficult_to_walk = serializers.BooleanField()
    general_health = serializers.ChoiceField(choices=HEALTH_CONDITIONS_MULTIPLE_CHOICE)
    sleep_time = serializers.IntegerField(min_value=0, max_value=24)

    default_error_messages = {
        "date": _("Дата рождения указана неверно."),
    }

    def validate(self, attrs):
        validated_data = super().validate(attrs)
        if 'user' not in attrs:
            max_year = timezone.now().date().year
            min_year = timezone.now().date().year - 100
            if max_year <= validated_data.get("date_of_birth").year or validated_data.get("date_of_birth").year <= min_year:
                key_error = "date"
                raise ValidationError(
                    {"date_of_birth": [self.error_messages[key_error]]}, code=key_error
                )
        return validated_data

    def survey(self):
        """
        Метод получения ГОФН
        """
        data = predictor.perform_prediction(self.validated_data)
        return {"verified": bool(data[0]), "risk_group_kp": data[1]}


class UserPredictionSerializer(AnonymousPredictionSerializer):
    """
    Сериализатор опроса авторизованных пользователей
    """
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    date_of_birth = None
    gender = None
    race = None

    def validate(self, attrs):
        validated_data = super().validate(attrs)
        validated_data["date_of_birth"] = attrs.get('user').date_of_birth
        validated_data["gender"] = attrs.get('user').gender
        validated_data["race"] = attrs.get('user').race
        validated_data["user_id"] = attrs.get('user').pk
        return validated_data

    def survey(self):
        """
        Метод получения результатов опроса и
        сохранения данных о пользователе
        """
        response = super().survey()
        self.validated_data["risk_group_kp"] = response.get('risk_group_kp')
        si = StateInfo()
        di = DynamicInfo()
        if StateInfo.objects.filter(user=self.validated_data.get("user")).exists():
            si = StateInfo.objects.get(user=self.validated_data.get("user"))
        for key, value in self.validated_data.items():
            if hasattr(si, key) and value is not None:
                setattr(si, key, value)
            if hasattr(di, key):
                setattr(di, key, value)
        si.save()
        di.save()
        return response


class StateInfoSerializer(serializers.ModelSerializer, SurveySerializer):
    """
    Сериализатор статичных данных авторизованных пользователей
    """
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    height = serializers.IntegerField(min_value=0, max_value=300)
    diabetic_period = serializers.IntegerField(min_value=0, max_value=100, allow_null=True)

    class Meta:
        model = StateInfo
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at', )

    def update(self, instance, validated_data):
        """
        Метод обновления статических данных и пересчёта ГОФН
        """
        si = super().update(instance, validated_data)
        di = DynamicInfo.objects.filter(user=validated_data.get('user')).latest()
        data_dict = {
            **si.__dict__,
            **di.__dict__,
            "date_of_birth": validated_data.get('user').date_of_birth,
            "gender": validated_data.get('user').gender,
            "race": validated_data.get('user').race
        }
        data = predictor.perform_prediction(data_dict)
        di.risk_group_kp = data[1]
        di.save()
        return si


class DynamicInfoSerializer(serializers.ModelSerializer):
    """
    Сериализатор динамических данных авторизованных пользователей
    """
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    weight = serializers.FloatField(min_value=0, max_value=500)
    physical_health = serializers.IntegerField(min_value=0, max_value=30)
    mental_health = serializers.IntegerField(min_value=0, max_value=30)
    sleep_time = serializers.IntegerField(min_value=0, max_value=24)

    class Meta:
        model = DynamicInfo
        fields = '__all__'
        read_only_fields = ('created_at', 'risk_group_kp', )

    def validate(self, attrs):
        validated_data = super().validate(attrs)
        if 'is_difficult_to_walk' not in validated_data:
            validated_data['is_difficult_to_walk'] = False
        if 'is_blood_pressure' not in validated_data:
            validated_data['is_blood_pressure'] = None
        return validated_data

    def create(self, validated_data):
        """
        Метод создания таблицы динамических данных и
        пересчёта ГОФН
        """
        si = StateInfo.objects.get(user=validated_data.get('user'))
        data_dict = {
            **si.__dict__,
            **dict(validated_data),
            "date_of_birth": validated_data.get('user').date_of_birth,
            "gender": validated_data.get('user').gender,
            "race": validated_data.get('user').race
        }
        data = predictor.perform_prediction(data_dict)
        validated_data['risk_group_kp'] = data[1]
        return super().create(validated_data)
