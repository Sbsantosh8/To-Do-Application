from django.db import models
from django.core.exceptions import ValidationError


class Task(models.Model):
    title = models.CharField(max_length=255, blank=False, null=False)
    description = models.TextField(blank=False, null=False)
    completed = models.BooleanField(default=False)

    def __str__(self):
        return self.title

    # Custom validation
    def clean(self):
        # Ensure title and description are provided
        if not self.title:
            raise ValidationError("Title is required.")
        if not self.description:
            raise ValidationError("Description is required.")

        # You can add additional validation here if necessary
