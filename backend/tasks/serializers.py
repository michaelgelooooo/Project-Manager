from rest_framework import serializers
from .models import Task


class TaskSerializer(serializers.ModelSerializer):
    project_name = serializers.CharField(source='project.project_name', read_only=True)

    class Meta:
        model = Task
        fields = [
            "id",
            "project",
            "project_name",  # add this
            "task_name",
            "slug",
            "description",
            "status",
            "priority",
            "due_date",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "slug", "created_at", "updated_at"]
