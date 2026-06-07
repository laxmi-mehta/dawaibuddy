from django.db import models

from apps.common.models import BaseModel
from apps.medicines.models import Medicine


class DrugInteraction(BaseModel):
    """Placeholder — business logic TBD."""

    medicine_a = models.ForeignKey(
        Medicine, on_delete=models.CASCADE, related_name="interactions_as_a"
    )
    medicine_b = models.ForeignKey(
        Medicine, on_delete=models.CASCADE, related_name="interactions_as_b"
    )
    severity = models.CharField(max_length=50, blank=True)
    description = models.TextField(blank=True)

    class Meta:
        unique_together = [["medicine_a", "medicine_b"]]
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"{self.medicine_a} ↔ {self.medicine_b}"
