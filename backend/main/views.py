from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from projects.models import Project
from tasks.models import Task
from resources.models import Resource
from projects.serializers import ProjectSerializer
from tasks.serializers import TaskSerializer
from resources.serializers import ResourceSerializer


class DashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        # Get 6 most urgent projects
        urgent_projects = Project.objects.filter(
            user=user, status__in=["ongoing", "completed"], deadline__isnull=False
        ).order_by("deadline")[:6]

        # Get 5 most urgent tasks (uses model's default ordering)
        urgent_tasks = Task.objects.filter(project__user=user)[:5]

        # Get 5 recently updated resources
        recent_resources = Resource.objects.filter(project__user=user).order_by(
            "-updated_at"
        )[:5]

        # Serialize the data
        data = {
            "urgent_projects": ProjectSerializer(urgent_projects, many=True).data,
            "urgent_tasks": TaskSerializer(urgent_tasks, many=True).data,
            "recent_resources": ResourceSerializer(recent_resources, many=True).data,
        }

        return Response(data)
