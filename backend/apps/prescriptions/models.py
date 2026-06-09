from django.conf import settings
from django.db import models

from apps.common.models import BaseModel


class Prescription(BaseModel):
    """Placeholder — business logic TBD."""

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="prescriptions",
    )
    notes = models.TextField(blank=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"Prescription {self.id} — {self.user}"
