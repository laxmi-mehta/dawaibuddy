from django.conf import settings
from django.db import models

from apps.common.models import BaseModel


class Reminder(BaseModel):
    """A scheduled medicine dose for a user."""

    class Bucket(models.TextChoices):
        MORNING = "morning", "Morning"
        AFTERNOON = "afternoon", "Afternoon"
        EVENING = "evening", "Evening"
        NIGHT = "night", "Night"

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="reminders",
    )
    medicine_name = models.CharField(max_length=255)
    dosage = models.CharField(max_length=100, blank=True, help_text="e.g. 500 mg")
    scheduled_time = models.TimeField()
    bucket = models.CharField(max_length=20, choices=Bucket.choices)
    instruction = models.CharField(max_length=255, blank=True, help_text="e.g. after breakfast")
    is_taken = models.BooleanField(default=False)

    class Meta:
        ordering = ["scheduled_time"]

    def __str__(self) -> str:
        return f"{self.medicine_name} @ {self.scheduled_time} ({self.user})"
