from django.db import models
from autoslug import AutoSlugField


class Task(models.Model):
    PRIORITY_CHOICES = [
        ("high", "High"),
        ("medium", "Medium"),
        ("low", "Low"),
    ]

    STATUS_CHOICES = [
        ("planned", "Planned"),
        ("ongoing", "Ongoing"),
        ("completed", "Completed"),
    ]

    # Relationships
    project = models.ForeignKey(
        "projects.Project",
        on_delete=models.CASCADE,
        related_name="tasks",
    )

    # Basic info
    task_name = models.CharField(max_length=255)
    slug = AutoSlugField(
        populate_from="task_name",
        unique_with="project",
        always_update=False,
    )
    description = models.TextField(blank=True)

    # Categorization
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="planned")
    priority = models.CharField(
        max_length=20, choices=PRIORITY_CHOICES, default="medium"
    )

    # Dates
    due_date = models.DateField(null=True, blank=True)

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = [
            "due_date",
            "-priority",
            "-created_at",
        ]
        verbose_name = "Task"
        verbose_name_plural = "Tasks"

    def __str__(self):
        return self.task_name
