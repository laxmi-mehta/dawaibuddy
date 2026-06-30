from django.db import models

from apps.common.models import BaseModel


class Medicine(BaseModel):
    """A medicine / drug entry."""

    name = models.CharField(max_length=255, unique=True)
    generic_name = models.CharField(max_length=255, blank=True, help_text="Salt / composition")
    manufacturer = models.CharField(max_length=255, blank=True)
    form = models.CharField(max_length=100, blank=True, help_text="e.g. Tablet (SR)")
    strength = models.CharField(max_length=100, blank=True, help_text="e.g. 500 mg")
    category = models.CharField(max_length=100, blank=True, help_text="e.g. Anti-diabetic")
    rx_required = models.BooleanField(default=False)
    in_stock = models.BooleanField(default=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    how_it_works = models.TextField(blank=True)
    uses = models.JSONField(default=list, blank=True)
    side_effects = models.JSONField(default=list, blank=True)
    warnings = models.JSONField(default=list, blank=True)

    class Meta:
        ordering = ["name"]

    def __str__(self) -> str:
        return self.name


class GenericAlternative(BaseModel):
    """A cheaper generic equivalent of a medicine."""

    medicine = models.ForeignKey(
        Medicine, on_delete=models.CASCADE, related_name="alternatives"
    )
    name = models.CharField(max_length=255)
    manufacturer = models.CharField(max_length=255, blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    save_percent = models.PositiveIntegerField(null=True, blank=True)

    class Meta:
        ordering = ["price"]

    def __str__(self) -> str:
        return f"{self.name} (alt of {self.medicine.name})"
