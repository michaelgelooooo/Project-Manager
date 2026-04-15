from datetime import date, timedelta
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db.models import Count, Q
from .models import Project
from .serializers import ProjectSerializer


class ProjectViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'slug'

    def get_queryset(self):
        return Project.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=["get"], url_path="stats")
    def stats(self, request):
        today = date.today()
        start_of_week = today - timedelta(days=(today.weekday() + 1) % 7)
        end_of_week = start_of_week + timedelta(days=6)
        if today.month == 12:
            end_of_month = today.replace(month=12, day=31)
        else:
            end_of_month = today.replace(month=today.month + 1, day=1) - timedelta(days=1)

        projects = Project.objects.filter(user=request.user)

        agg = projects.aggregate(
            active=Count("id", filter=Q(status__in=["planned", "ongoing"])),
            completed=Count("id", filter=Q(status="completed")),
            overdue=Count("id", filter=Q(
                deadline__lt=today,
                status__in=["planned", "ongoing"]
            )),
            due_this_week=Count("id", filter=Q(
                deadline__gte=start_of_week,
                deadline__lte=end_of_week,
                status__in=["planned", "ongoing"]
            )),
            due_this_month=Count("id", filter=Q(
                deadline__gte=today.replace(day=1),
                deadline__lte=end_of_month,
                status__in=["planned", "ongoing"]
            )),
        )

        total = agg["active"] + agg["completed"]
        agg["completion_rate"] = round(agg["completed"] / total * 100) if total else 0

        return Response(agg, status=status.HTTP_200_OK)