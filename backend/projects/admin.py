from django.contrib import admin
from .models import Project


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ["project_name", "project_type", "status", "deadline", "created_at"]
    list_filter = ["status", "project_type", "created_at"]
    search_fields = ["project_name", "description"]
    readonly_fields = ["slug", "created_at", "updated_at"]
