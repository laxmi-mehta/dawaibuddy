from django.db import models

from apps.common.models import BaseModel


class Medicine(BaseModel):
    """Placeholder — business logic TBD."""

    name = models.CharField(max_length=255, unique=True)
    generic_name = models.CharField(max_length=255, blank=True)
    description = models.TextField(blank=True)

    class Meta:
        ordering = ["name"]

    def __str__(self) -> str:
        return self.name
