from django.contrib import admin
from .models import Resource


@admin.register(Resource)
class ResourceAdmin(admin.ModelAdmin):
    list_display = [
        "resource_title",
        "project",
        "resource_type",
        "created_at",
        "updated_at",
    ]
    list_filter = ["resource_type", "project", "created_at"]
    search_fields = ["resource_title", "content"]
    readonly_fields = ["slug", "created_at", "updated_at"]
