from django.conf import settings
from django.db import models
from django.utils import timezone

from apps.common.models import BaseModel


class Reminder(BaseModel):
    """A recurring daily medicine dose slot for a user.

    `taken_at` (not a plain boolean) is what makes "today" self-resetting:
    a dose is "taken today" only while `taken_at` falls on the current date,
    so adherence naturally rolls over at midnight with no cron/reset job.
    """

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
    taken_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ["scheduled_time"]

    def __str__(self) -> str:
        return f"{self.medicine_name} @ {self.scheduled_time} ({self.user})"

    @property
    def is_taken(self) -> bool:
        return bool(self.taken_at and self.taken_at.date() == timezone.localdate())
