from django.utils.functional import empty
from pytils.translit import slugify


def generate_slug(beg_pt, end_pt):
    """
    Генератор двусоставного слага сущности
    :param beg_pt: 1-я часть слага
    :param end_pt: 2-я часть слага
    :return: слаг (транслит)
    """
    if beg_pt == '':
        return slugify(end_pt)
    elif end_pt == '':
        return slugify(beg_pt)
    return slugify(beg_pt + '-' + end_pt)


def slug_valid(model, slug):
    """
    Проверка валидности слагов
    :param model: Модель бд сущности
    :param slug: слаг сущности
    :return: True / False
    """
    return not model.objects.filter(slug=slug).exists()


def slug_valid_upd(model, slug, instance):
    """
    Проверка валидности слагов (при обновлении сущности)
    :param model: Модель бд сущности
    :param slug: слаг сущности
    :param instance: экземпляр модели (сущность)
    :return: True / False
    """
    if not model.objects.filter(slug=slug).exists():
        return True
    qs = model.objects.filter(slug=slug)
    if qs.count() == 1 and qs.first() == instance:
        return True
    return False


def risk_group_provider(kp):
    if kp < 0.4:
        return 1
    elif 0.4 <= kp < 0.6:
        return 2
    else:
        return 3
