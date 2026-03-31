from django.contrib import admin
from .models import Task


@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ['task_name', 'project', 'status', 'priority', 'due_date', 'created_at']
    list_filter = ['status', 'priority', 'project', 'created_at']
    search_fields = ['task_name', 'description']
    readonly_fields = ['slug', 'created_at', 'updated_at']