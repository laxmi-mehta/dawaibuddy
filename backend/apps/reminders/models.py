from django.conf import settings
from django.db import models

from apps.common.models import BaseModel


class Reminder(BaseModel):
    """Placeholder — business logic TBD."""

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="reminders",
    )
    message = models.TextField()
    scheduled_at = models.DateTimeField()
    is_sent = models.BooleanField(default=False)

    class Meta:
        ordering = ["scheduled_at"]

    def __str__(self) -> str:
        return f"Reminder for {self.user} at {self.scheduled_at}"
