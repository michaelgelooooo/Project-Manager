from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from .models import Resource
from .serializers import ResourceSerializer


class ResourceViewSet(viewsets.ModelViewSet):
    serializer_class = ResourceSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Resource.objects.filter(project__user=self.request.user)

    def perform_create(self, serializer):
        project = serializer.validated_data.get("project")

        if project.user != self.request.user:
            raise PermissionDenied(
                "You can only create resources for your own projects."
            )

        serializer.save()
