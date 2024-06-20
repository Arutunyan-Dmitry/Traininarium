import json

from django.contrib.auth import get_user_model
from django.dispatch import receiver, Signal
from pytils.translit import slugify

from fitness.models import Exercise, Plan, Training, TrainingExercise
from traininarium.settings import BASE_DIR, STATIC_URL

User = get_user_model()
initial_plan_formatter = Signal()


@receiver(initial_plan_formatter)
def create_initial_plans(sender, **kwargs):
    with open(BASE_DIR / STATIC_URL / 'json/fitness_initial.json', encoding='utf-8') as f:
        data = json.load(f)
    admin = User.objects.get(is_staff=True)

    for e_item in data['exercises']:
        Exercise.objects.create(
            slug=slugify(e_item["name"]),
            name=e_item["name"],
            picture='exercise/' + slugify(e_item["name"]) + '.png',
            description=e_item["description"],
            time=e_item["time"],
            amount=e_item["amount"],
            rest_time=e_item["rest_time"]
        )

    for p_item in data['plans']:
        Plan.objects.create(
            slug=slugify("traininarium-" + p_item["name"]),
            name=p_item["name"],
            picture='plan/' + "traininarium-" + slugify(p_item["name"]) + '.jpg',
            intensity=p_item["intensity"],
            health_group=p_item["health_group"],
            training_amount=p_item["training_amount"],
            equipment=p_item["equipment"],
            owner=admin
        )

    for pe_item in data['plans_exercises']:
        plan = Plan.objects.get(name=pe_item["plan_name"])
        for i in range(plan.training_amount):
            training = Training.objects.create(
                slug=f'{plan.slug}-training-{i + 1}', plan=plan)
            counter = 0
            for e_name in pe_item["plan_exercises"]:
                counter += 1
                TrainingExercise.objects.create(
                    slug=f'{training.slug}-exercise-{counter}',
                    exercise=Exercise.objects.get(name=e_name),
                    training=training
                )
        plan.is_filled = True
        plan.save()

