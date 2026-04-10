from django.db import models
from django.contrib.auth.models import User
from autoslug import AutoSlugField


class Project(models.Model):
    STATUS_CHOICES = [
        ("planned", "Planned"),
        ("ongoing", "Ongoing"),
        ("completed", "Completed"),
        ("paused", "Paused"),
        ("cancelled", "Cancelled"),
        ("archived", "Archived"),
    ]

    COVER_IMAGE_CHOICES = [
        ("default", "Default"),
        # Neutrals
        ("white", "White"),
        ("gray", "Gray"),
        ("black", "Black"),
        # Warm colors
        ("red", "Red"),
        ("orange", "Orange"),
        ("yellow", "Yellow"),
        # Cool colors
        ("green", "Green"),
        ("blue", "Blue"),
        ("purple", "Purple"),
        # Extra common main colors
        ("pink", "Pink"),
        ("brown", "Brown"),
        ("cyan", "Cyan"),
    ]

    # Relationships
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="projects")

    # Basic info
    project_name = models.CharField(max_length=255)
    slug = AutoSlugField(populate_from="project_name", unique=True, always_update=False)
    description = models.TextField(blank=True)

    # Categorization
    project_type = models.CharField(max_length=100)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="planned")
    cover_image = models.CharField(
        max_length=20, choices=COVER_IMAGE_CHOICES, default="default"
    )

    # Optional fields
    deadline = models.DateField(null=True, blank=True)

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Project"
        verbose_name_plural = "Projects"

    def __str__(self):
        return self.project_name
