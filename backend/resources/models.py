from django.db import models
from autoslug import AutoSlugField


class Resource(models.Model):
    """
    Represents a markdown resource/note within a project.
    Resources are used for documentation, notes, and reference materials.
    """

    # Relationships
    project = models.ForeignKey(
        "projects.Project", on_delete=models.CASCADE, related_name="resources"
    )

    # Basic info
    resource_title = models.CharField(max_length=255)
    slug = AutoSlugField(
        populate_from="resource_title", unique_with="project", always_update=False
    )

    # Content
    content = models.TextField()  # Markdown content

    # Categorization
    resource_type = models.CharField(max_length=100)  # Free text

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-updated_at"]  # Recently updated first
        verbose_name = "Resource"
        verbose_name_plural = "Resources"

    def __str__(self):
        return self.resource_title
