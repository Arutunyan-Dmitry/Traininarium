# Generated by Django 5.0.2 on 2024-06-12 13:08

import django.contrib.postgres.fields
import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Exercise',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('slug', models.SlugField(max_length=255, unique=True)),
                ('name', models.CharField(max_length=255, unique=True)),
                ('picture', models.ImageField(upload_to='')),
                ('description', models.CharField()),
                ('time', models.IntegerField(blank=True, null=True)),
                ('amount', models.IntegerField(blank=True, null=True)),
                ('rest_time', models.IntegerField()),
            ],
            options={
                'ordering': ['name'],
                'get_latest_by': 'name',
                'indexes': [models.Index(fields=['name', 'slug'], name='fitness_exe_name_a0ef6f_idx')],
            },
        ),
        migrations.CreateModel(
            name='Plan',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('slug', models.SlugField(max_length=255, unique=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('name', models.CharField(max_length=255)),
                ('picture', models.ImageField(upload_to='')),
                ('intensity', models.CharField(choices=[('Low', 'Low'), ('Medium', 'Medium'), ('High', 'High')])),
                ('health_group', models.IntegerField()),
                ('training_amount', models.IntegerField()),
                ('is_filled', models.BooleanField(default=False)),
                ('equipment', models.CharField()),
                ('owner', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'ordering': ['name'],
                'get_latest_by': 'name',
            },
        ),
        migrations.CreateModel(
            name='PlanFollower',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('follower', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('plan', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='fitness.plan')),
            ],
            options={
                'db_table': 'fitness_plan_follower',
                'ordering': ['created_at'],
                'get_latest_by': 'created_at',
            },
        ),
        migrations.AddField(
            model_name='plan',
            name='followers',
            field=models.ManyToManyField(related_name='followers', through='fitness.PlanFollower', to=settings.AUTH_USER_MODEL),
        ),
        migrations.CreateModel(
            name='Training',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('slug', models.SlugField(max_length=255, unique=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('plan', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='fitness.plan')),
            ],
            options={
                'ordering': ['slug'],
                'get_latest_by': 'slug',
            },
        ),
        migrations.CreateModel(
            name='TrainingExercise',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('slug', models.SlugField(max_length=255, unique=True)),
                ('exercise', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='fitness.exercise')),
                ('training', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='fitness.training')),
            ],
            options={
                'db_table': 'fitness_training_exercise',
                'ordering': ['slug'],
                'get_latest_by': 'slug',
            },
        ),
        migrations.CreateModel(
            name='TrainingPerformance',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('slug', models.SlugField(max_length=255, unique=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('pulse', django.contrib.postgres.fields.ArrayField(base_field=models.FloatField(), size=None)),
                ('mid_fatigue', models.BooleanField(default=False)),
                ('short_breath', models.BooleanField(default=False)),
                ('heart_ace', models.BooleanField(default=False)),
                ('training_risk_g', models.FloatField()),
                ('training', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='fitness.training')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'db_table': 'fitness_training_performance',
                'ordering': ['created_at'],
                'get_latest_by': 'created_at',
            },
        ),
        migrations.AddIndex(
            model_name='planfollower',
            index=models.Index(fields=['created_at', 'plan', 'follower'], name='fitness_pla_created_47ae5b_idx'),
        ),
        migrations.AddIndex(
            model_name='plan',
            index=models.Index(fields=['slug', 'name', 'health_group', 'owner'], name='fitness_pla_slug_2afb2f_idx'),
        ),
        migrations.AddIndex(
            model_name='training',
            index=models.Index(fields=['slug', 'plan'], name='fitness_tra_slug_1d9db6_idx'),
        ),
        migrations.AddIndex(
            model_name='trainingexercise',
            index=models.Index(fields=['slug', 'training', 'exercise'], name='fitness_tra_slug_650d77_idx'),
        ),
        migrations.AddIndex(
            model_name='trainingperformance',
            index=models.Index(fields=['slug', 'created_at', 'user', 'training'], name='fitness_tra_slug_2a8667_idx'),
        ),
    ]
