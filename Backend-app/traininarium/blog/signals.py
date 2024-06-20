import json

from django.contrib.auth import get_user_model
from django.dispatch import receiver, Signal
from pytils.translit import slugify

from blog.models import Article
from traininarium.settings import BASE_DIR, STATIC_URL

User = get_user_model()
initial_article_formatter = Signal()


@receiver(initial_article_formatter)
def create_initial_articles(sender, **kwargs):
    with open(BASE_DIR / STATIC_URL / 'json/blog_initial.json', encoding='utf-8') as f:
        data = json.load(f)
    admin = User.objects.get(is_staff=True)

    for item in data['articles']:
        Article.objects.create(
            slug=slugify(item["title"]),
            title=item["title"],
            picture='article/' + slugify(item["title"]) + '.png',
            body=item["body"],
            owner=admin
        )



