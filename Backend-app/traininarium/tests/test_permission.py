import datetime

from django.contrib.auth import get_user_model
from django.urls import reverse

from rest_framework import status
from rest_framework.test import APITestCase


User = get_user_model()

AUTHORIZATION_REQUIRED = [
    {'url': reverse('plan-list'), 'method': 'POST'},
    {'url': reverse('plan-fill', args=['traininarium-podgotovitelnyij-plan-na-vsyo-telo-i']), 'method': 'POST'},
    {'url': reverse('plan-detail', kwargs={"slug": 'traininarium-podgotovitelnyij-plan-na-vsyo-telo-i'}),
     'method': 'DELETE'},
    {'url': reverse('plan-detail', kwargs={"slug": 'traininarium-podgotovitelnyij-plan-na-vsyo-telo-i'}),
     'method': 'DELETE'},
    {'url': reverse('exercise-list'), 'method': 'POST'},
    {'url': reverse('exercise-detail', kwargs={"slug": 'prostaya-hodba'}), 'method': 'PUT'},
    {'url': reverse('exercise-detail', kwargs={"slug": 'prostaya-hodba'}), 'method': 'PATCH'},
    {'url': reverse('exercise-detail', kwargs={"slug": 'prostaya-hodba'}), 'method': 'DELETE'},
    {'url': reverse('article-list'), 'method': 'POST'},
    {'url': reverse('article-detail', kwargs={"slug": 'sport-nashe-vsyo'}), 'method': 'PUT'},
    {'url': reverse('article-detail', kwargs={"slug": 'sport-nashe-vsyo'}), 'method': 'PATCH'},
    {'url': reverse('article-detail', kwargs={"slug": 'sport-nashe-vsyo'}), 'method': 'DELETE'},
    {'url': reverse('static-info'), 'method': 'GET'},
    {'url': reverse('static-info'), 'method': 'PUT'},
    {'url': reverse('static-info'), 'method': 'PATCH'},
    {'url': reverse('dynamic-info-list'), 'method': 'GET'},
    {'url': reverse('dynamic-info-latest'), 'method': 'GET'},
    {'url': reverse('dynamic-info-list'), 'method': 'POST'},
]
ADMIN_ROLE_REQUIRED = [
    {'url': reverse('article-list'), 'method': 'POST'},
    {'url': reverse('article-detail', kwargs={"slug": 'sport-nashe-vsyo'}), 'method': 'PUT'},
    {'url': reverse('article-detail', kwargs={"slug": 'sport-nashe-vsyo'}), 'method': 'PATCH'},
    {'url': reverse('article-detail', kwargs={"slug": 'sport-nashe-vsyo'}), 'method': 'DELETE'},
]


class PermissionsTests(APITestCase):
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

    @staticmethod
    def _provide_fake_token():
        return 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxMjM0NTY3ODkwMH0.fBxNNcRe6KTyMNNSjYw-R_zSV3is2MW4f2vvqwR-zAg'

    def test_authorisation_requirements(self):
        for item in AUTHORIZATION_REQUIRED:
            response = self.client.generic(
                method=item.get("method"),
                path=item.get("url"),
                format='json'
            )
            self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
            response = self.client.generic(
                method=item.get("method"),
                path=item.get("url"),
                headers={
                    'Authorization': f'Bearer {self._provide_fake_token()}'
                },
                format='json'
            )
            self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_admin_role_requirements(self):
        for item in ADMIN_ROLE_REQUIRED:
            self.client.force_authenticate(user=self.user)
            response = self.client.generic(
                method=item.get("method"),
                path=item.get("url"),
                format='json'
            )
            self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
