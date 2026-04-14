from rest_framework import serializers
from .models import Project


class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = [
            "id",
            "user",
            "project_name",
            "slug",
            "description",
            "project_type",
            "status",
            "cover_image",
            "deadline",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "user", "slug", "created_at", "updated_at"]
