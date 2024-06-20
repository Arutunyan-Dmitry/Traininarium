import datetime

from django.contrib.auth import get_user_model
from django.urls import reverse
from django.utils import timezone

from rest_framework import status
from rest_framework.test import APITestCase

from blog.models import Article
from fitness.models import Plan, Exercise, Training, TrainingExercise
from health.models import StateInfo, DynamicInfo

User = get_user_model()


class PlanAPITests(APITestCase):
    """
    Интеграционное тестирование внешнего интерфейса взаимодействия с планами
    тренировок
    """

    @staticmethod
    def _get_superuser():
        return User.objects.get(username='ADMIN')

    def _create_plan(self, name):
        user = self._get_superuser()
        url = reverse('plan-list')
        data = {
            'name': name,
            'intensity': 'Low',
            'health_group': 1,
            'training_amount': 20
        }
        self.client.force_authenticate(user=user)
        return self.client.post(path=url, data=data, format='json')

    """ Позитивные тесты"""

    def test_list(self):
        user = self._get_superuser()
        url = reverse('plan-list')
        self.client.force_authenticate(user=user)
        response = self.client.get(path=url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertNotEquals(len(response.data.get("other")), 0)

    def test_retrieve(self):
        plan_slug = "traininarium-podgotovitelnyij-plan-na-vsyo-telo-i"
        user = self._get_superuser()
        url = reverse('plan-detail', kwargs={"slug": plan_slug})
        self.client.force_authenticate(user=user)
        response = self.client.get(path=url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data.get('slug'), plan_slug)

    def test_create(self):
        response = self._create_plan("test-plan")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(Plan.objects.filter(slug__contains="test-plan").exists())

    def test_destroy(self):
        plan_slug = self._create_plan("test-plan").data.get('slug')
        user = self._get_superuser()
        url = reverse('plan-detail', kwargs={"slug": plan_slug})
        self.client.force_authenticate(user=user)
        response = self.client.delete(path=url, format='json')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Plan.objects.filter(slug=plan_slug).exists())

    def test_fill(self):
        plan_slug = self._create_plan("test-plan").data.get('slug')
        exercises_data = {'exercises': [
            'prostaya-hodba', 'hodba-na-pyatkah', 'hodba-na-noskah', 'hodba-lyizhnyim-shagom',
            'hodba-s-vyisoko-podnyatyimi-kolenyami', 'prostaya-hodba', 'hodba-na-pyatkah',
            'hodba-na-noskah', 'hodba-lyizhnyim-shagom', 'hodba-s-vyisoko-podnyatyimi-kolenyami',
            'prostaya-hodba', 'hodba-na-pyatkah', 'hodba-na-noskah', 'hodba-lyizhnyim-shagom',
            'hodba-s-vyisoko-podnyatyimi-kolenyami',
        ]}
        user = self._get_superuser()
        url = reverse('plan-fill', args=[plan_slug])
        self.client.force_authenticate(user=user)
        response = self.client.post(path=url, data=exercises_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertTrue(
            Training.objects.filter(slug__startswith=plan_slug).exists() and
            TrainingExercise.objects.filter(slug__startswith=plan_slug).exists()
        )

    def test_training_retrieve(self):
        plan_slug = "traininarium-podgotovitelnyij-plan-na-vsyo-telo-i"
        user = self._get_superuser()
        url = reverse('plan-get-training', kwargs={
            'slug': plan_slug,
            'training_tag': 'training-1'
        })
        self.client.force_authenticate(user=user)
        response = self.client.get(path=url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data.get('number'), 1)

    def test_exercise_retrieve(self):
        plan_slug = "traininarium-podgotovitelnyij-plan-na-vsyo-telo-i"
        user = self._get_superuser()
        url = reverse('plan-get-exercise', kwargs={
            'slug': plan_slug,
            'training_tag': 'training-1',
            'exercise_tag': 'exercise-1'
        })
        self.client.force_authenticate(user=user)
        response = self.client.get(path=url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data.get('number'), 1)

    """ Негативные тесты"""

    def test_update(self):
        plan_slug = self._create_plan("test-plan").data.get('slug')
        data = {
            'name': 'test-plan-1',
            'intensity': 'High',
            'health_group': 2,
            'training_amount': 25
        }
        user = self._get_superuser()
        url = reverse('plan-detail', kwargs={"slug": plan_slug})
        self.client.force_authenticate(user=user)
        response = self.client.put(path=url, data=data, format='json')
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

    def test_partial_update(self):
        plan_slug = self._create_plan("test-plan").data.get('slug')
        data = {
            'intensity': 'High',
        }
        user = self._get_superuser()
        url = reverse('plan-detail', kwargs={"slug": plan_slug})
        self.client.force_authenticate(user=user)
        response = self.client.patch(path=url, data=data, format='json')
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)


class ExerciseAPITests(APITestCase):
    """
    Интеграционное тестирование внешнего интерфейса взаимодействия с упражнениями
    """

    @staticmethod
    def _get_superuser():
        return User.objects.get(username='ADMIN')

    def _create_exercise(self, name):
        user = self._get_superuser()
        url = reverse('exercise-list')
        data = {
            'name': name,
            'description': name,
            'time': 20,
            'rest_time': 20
        }
        self.client.force_authenticate(user=user)
        return self.client.post(path=url, data=data, format='json')

    """ Позитивные тесты"""

    def test_list(self):
        user = self._get_superuser()
        url = reverse('exercise-list')
        self.client.force_authenticate(user=user)
        response = self.client.get(path=url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertNotEquals(len(response.data), 0)

    def test_retrieve(self):
        exercise_slug = "prostaya-hodba"
        user = self._get_superuser()
        url = reverse('exercise-detail', kwargs={"slug": exercise_slug})
        self.client.force_authenticate(user=user)
        response = self.client.get(path=url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data.get('slug'), exercise_slug)

    def test_create(self):
        response = self._create_exercise("test-exercise")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(Exercise.objects.filter(slug__contains="test-exercise").exists())

    def test_update(self):
        exercise_slug = self._create_exercise("test-exercise").data.get('slug')
        data = {
            'name': 'test-exercise-1',
            'description': 'test-exercise-1',
            'time': 25,
            'rest_time': 30
        }
        user = self._get_superuser()
        url = reverse('exercise-detail', kwargs={"slug": exercise_slug})
        self.client.force_authenticate(user=user)
        response = self.client.put(path=url, data=data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(Exercise.objects.filter(
            name='test-exercise-1',
            description='test-exercise-1',
            time=25,
            rest_time=30
        ).exists())

    def test_partial_update(self):
        exercise_slug = self._create_exercise("test-exercise").data.get('slug')
        data = {
            'description': 'test-exercise-1',
        }
        user = self._get_superuser()
        url = reverse('exercise-detail', kwargs={"slug": exercise_slug})
        self.client.force_authenticate(user=user)
        response = self.client.patch(path=url, data=data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(Exercise.objects.filter(description='test-exercise-1').exists())

    def test_destroy(self):
        exercise_slug = self._create_exercise("test-exercise").data.get('slug')
        user = self._get_superuser()
        url = reverse('exercise-detail', kwargs={"slug": exercise_slug})
        self.client.force_authenticate(user=user)
        response = self.client.delete(path=url, format='json')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Exercise.objects.filter(slug=exercise_slug).exists())


class ArticleAPITests(APITestCase):
    """
    Интеграционное тестирование внешнего интерфейса взаимодействия с сущностью
    статей
    """

    @staticmethod
    def _get_superuser():
        return User.objects.get(username='ADMIN')

    def _create_article(self, name):
        user = self._get_superuser()
        url = reverse('article-list')
        data = {
            'title': name,
            'body': name,
        }
        self.client.force_authenticate(user=user)
        return self.client.post(path=url, data=data, format='json')

    """ Позитивные тесты"""

    def test_list(self):
        user = self._get_superuser()
        url = reverse('article-list')
        self.client.force_authenticate(user=user)
        response = self.client.get(path=url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertNotEquals(len(response.data), 0)

    def test_retrieve(self):
        article_slug = "sport-nashe-vsyo"
        user = self._get_superuser()
        url = reverse('article-detail', kwargs={"slug": article_slug})
        self.client.force_authenticate(user=user)
        response = self.client.get(path=url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data.get('slug'), article_slug)

    def test_create(self):
        response = self._create_article("test-article")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(Article.objects.filter(slug__contains="test-article").exists())

    def test_update(self):
        article_slug = self._create_article("test-article").data.get('slug')
        data = {
            'title': "test-article-1",
            'body': "test-article-1",
        }
        user = self._get_superuser()
        url = reverse('article-detail', kwargs={"slug": article_slug})
        self.client.force_authenticate(user=user)
        response = self.client.put(path=url, data=data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(Article.objects.filter(
            title='test-article-1',
            body='test-article-1'
        ).exists())

    def test_partial_update(self):
        article_slug = self._create_article("test-article").data.get('slug')
        data = {
            'body': 'test-article-1',
        }
        user = self._get_superuser()
        url = reverse('article-detail', kwargs={"slug": article_slug})
        self.client.force_authenticate(user=user)
        response = self.client.patch(path=url, data=data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(Article.objects.filter(body='test-article-1').exists())

    def test_destroy(self):
        article_slug = self._create_article("test-article").data.get('slug')
        user = self._get_superuser()
        url = reverse('article-detail', kwargs={"slug": article_slug})
        self.client.force_authenticate(user=user)
        response = self.client.delete(path=url, format='json')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Article.objects.filter(slug=article_slug).exists())


class HealthAPITests(APITestCase):
    """
    Интеграционное тестирование внешнего интерфейса взаимодействия с сущностями
    физических и медицинских показателей пользователя
    """

    def setUp(self):
        self.user = User.objects.create(
            username='test-user',
            password='test-user',
            is_active=True,
            email='alisho.ru@mail.ru',
            date_of_birth=datetime.datetime.strptime("2002-06-24", '%Y-%m-%d').date(),
            gender='Male',
            race='European'
        )
        self.static_info = StateInfo.objects.create(
            is_heart_diseased=False,
            is_diabetic=False,
            is_kidney_diseased=False,
            is_cholesterol=False,
            is_stroked=False,
            height=170,
            user=self.user
        )
        self.dynamic_info = DynamicInfo.objects.create(
            risk_group_kp=0.12,
            weight=65.2,
            physical_health=0,
            mental_health=0,
            is_blood_pressure=False,
            general_health='Good',
            sleep_time=8,
            user=self.user
        )

    """ Позитивные тесты"""

    def test_retrieve_static(self):
        url = reverse('static-info')
        self.client.force_authenticate(user=self.user)
        response = self.client.get(path=url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_static(self):
        data = {
            "is_diabetic": True,
            "is_diabetic_with_diseases": False,
            "diabetic_period": 5,
            "height": 177
        }
        url = reverse('static-info')
        self.client.force_authenticate(user=self.user)
        response = self.client.put(path=url, data=data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(StateInfo.objects.filter(
            is_diabetic=True,
            is_diabetic_with_diseases=False,
            diabetic_period=5,
            height=177,
            user=self.user
        ).exists())

    def test_list_dynamic(self):
        url = reverse('dynamic-info-list')
        self.client.force_authenticate(user=self.user)
        response = self.client.get(path=url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertNotEquals(len(response.data), 0)

    def test_retrieve_dynamic_latest(self):
        url = reverse('dynamic-info-latest')
        self.client.force_authenticate(user=self.user)
        response = self.client.get(path=url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response.data.get('created_at')[slice(0, 10)],
            timezone.now().date().strftime('%d.%m.%Y')
        )

    def test_create_dynamic(self):
        data = {
            "weight": 65.5,
            "physical_health": 5,
            "mental_health": 15,
            "general_health": "Good",
            "sleep_time": 8
        }
        url = reverse('dynamic-info-list')
        self.client.force_authenticate(user=self.user)
        response = self.client.post(path=url, data=data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(DynamicInfo.objects.filter(
            weight=65.5,
            physical_health=5,
            mental_health=15,
            general_health="Good",
            sleep_time=8,
            user=self.user
        ).exists())

    """ Негативные тесты"""

    def test_create_static(self):
        url = reverse('static-info')
        self.client.force_authenticate(user=self.user)
        response = self.client.post(path=url, data=None, format='json')
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

    def test_destroy_static(self):
        url = reverse('static-info')
        self.client.force_authenticate(user=self.user)
        response = self.client.delete(path=url, format='json')
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

    def test_update_dynamic(self):
        url = reverse('dynamic-info-list')
        self.client.force_authenticate(user=self.user)
        response = self.client.put(path=url, data=None, format='json')
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

    def test_destroy_dynamic(self):
        url = reverse('dynamic-info-list')
        self.client.force_authenticate(user=self.user)
        response = self.client.delete(path=url, format='json')
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

