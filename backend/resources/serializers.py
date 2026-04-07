from rest_framework import serializers
from .models import Resource


class ResourceSerializer(serializers.ModelSerializer):
    project_name = serializers.CharField(source='project.project_name', read_only=True)

    class Meta:
        model = Resource
        fields = [
            "id",
            "project",
            "project_name",
            "resource_title",
            "slug",
            "content",
            "resource_type",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "slug", "created_at", "updated_at"]
