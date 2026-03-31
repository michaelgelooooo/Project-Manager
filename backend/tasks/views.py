from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from .models import Task
from .serializers import TaskSerializer


class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Task.objects.filter(project__user=self.request.user)

    def perform_create(self, serializer):
        project = serializer.validated_data.get("project")

        if project.user != self.request.user:
            raise PermissionDenied("You can only create tasks for your own projects.")
        
        serializer.save()
