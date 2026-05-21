from datetime import date, timedelta
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response
from django.db.models import Count, Q
from .models import Task
from .serializers import TaskSerializer


class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        project_slug = self.kwargs.get('project_slug')
        
        if project_slug:
            return Task.objects.filter(
                project__user=self.request.user,
                project__slug=project_slug,
            )
        
        return Task.objects.filter(
            project__user=self.request.user,
            project__status__in=["planned", "ongoing"],
        )

    def perform_create(self, serializer):
        project = serializer.validated_data.get("project")

        if project.user != self.request.user:
            raise PermissionDenied("You can only create tasks for your own projects.")

        serializer.save()

    @action(detail=False, methods=["get"], url_path="stats")
    def stats(self, request):
        today = date.today()
        start_of_week = today - timedelta(days=(today.weekday() + 1) % 7)
        end_of_week = start_of_week + timedelta(days=6)

        if today.month == 12:
            end_of_month = today.replace(month=12, day=31)
        else:
            end_of_month = today.replace(month=today.month + 1, day=1) - timedelta(
                days=1
            )

        tasks = Task.objects.filter(
            project__user=request.user,
            project__status__in=["planned", "ongoing"],
        )

        agg = tasks.aggregate(
            active=Count("id", filter=Q(status__in=["planned", "ongoing"])),
            completed=Count("id", filter=Q(status="completed")),
            overdue=Count(
                "id",
                filter=Q(
                    due_date__isnull=False,
                    due_date__lt=today,
                    status__in=["planned", "ongoing"],
                ),
            ),
            due_this_week=Count(
                "id",
                filter=Q(
                    due_date__isnull=False,
                    due_date__gte=start_of_week,
                    due_date__lte=end_of_week,
                    status__in=["planned", "ongoing"],
                ),
            ),
            due_this_month=Count(
                "id",
                filter=Q(
                    due_date__isnull=False,
                    due_date__gte=today.replace(day=1),
                    due_date__lte=end_of_month,
                    status__in=["planned", "ongoing"],
                ),
            ),
        )

        total = agg["active"] + agg["completed"]
        agg["completion_rate"] = round(agg["completed"] / total * 100) if total else 0

        return Response(agg, status=status.HTTP_200_OK)
