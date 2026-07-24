from django.db import models

from apps.common.models import BaseModel
from apps.medicines.models import Medicine


class DrugInteraction(BaseModel):
    """A known interaction between two medicines."""

    class Severity(models.TextChoices):
        NONE = "none", "No interaction"
        MILD = "mild", "Mild"
        MODERATE = "moderate", "Moderate"
        SEVERE = "severe", "Severe"

    medicine_a = models.ForeignKey(
        Medicine, on_delete=models.CASCADE, related_name="interactions_as_a"
    )
    medicine_b = models.ForeignKey(
        Medicine, on_delete=models.CASCADE, related_name="interactions_as_b"
    )
    severity = models.CharField(
        max_length=20, choices=Severity.choices, default=Severity.MILD
    )
    title = models.CharField(max_length=255, blank=True)
    description = models.TextField(blank=True)

    # Hindi / Marathi translations. Blank means "no translation yet" — the API
    # falls back to the English value.
    title_hi = models.CharField(max_length=255, blank=True)
    title_mr = models.CharField(max_length=255, blank=True)
    description_hi = models.TextField(blank=True)
    description_mr = models.TextField(blank=True)

    class Meta:
        unique_together = [["medicine_a", "medicine_b"]]
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"{self.medicine_a} ↔ {self.medicine_b} ({self.severity})"
