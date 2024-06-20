from io import BytesIO

from PIL import Image
from rest_framework import serializers

from blog.models import Article
from fitness.serializers import SlugSerializer
from traininarium.settings import MEDIA_ROOT


class ArticleSerializer(serializers.ModelSerializer):
    owner = serializers.SerializerMethodField()

    @staticmethod
    def get_owner(obj):
        if obj.owner.is_staff:
            return "traininarium"
        return obj.owner.username

    class Meta:
        model = Article
        exclude = ["id"]
        read_only_fields = [field.name for field in Article._meta.fields]
        lookup_field = "slug"


class CreateOrUpdateArticleSerializer(ArticleSerializer, SlugSerializer):
    owner = serializers.HiddenField(default=serializers.CurrentUserDefault())
    slug = serializers.CharField(read_only=True)
    title = serializers.CharField()
    picture = serializers.ImageField(required=False)
    body = serializers.CharField()

    class Meta:
        model = Article
        fields = ["title", "picture", "body", "slug", "owner"]
        read_only_fields = ["slug", "created_at"]

    def validate(self, attrs):
        self.model = self.Meta.model
        self.beg_slug = "traininarium"
        self.end_slug = attrs.get("title")
        validated_data = super().validate(attrs)
        if validated_data.get("picture") is not None:
            image_data = BytesIO(validated_data["picture"].read())
            image = Image.open(image_data)
            image_name = 'article/' + validated_data["slug"] + "." + image.format.lower()
            image_path = MEDIA_ROOT + image_name
            image.save(image_path)
            validated_data["picture"] = image_name
        return validated_data
