from django.conf import settings
from django.db import models

from apps.common.models import BaseModel


class Prescription(BaseModel):
    """A scanned/imported prescription belonging to a user."""

    class Status(models.TextChoices):
        PROCESSING = "processing", "Processing"
        READY = "ready", "Ready"

    class Source(models.TextChoices):
        SCAN = "scan", "Scan"
        CAMERA = "camera", "Camera"
        PDF = "pdf", "PDF"
        MANUAL = "manual", "Manual"

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="prescriptions",
    )
    doctor_name = models.CharField(max_length=255, blank=True)
    speciality = models.CharField(max_length=255, blank=True)
    clinic = models.CharField(max_length=255, blank=True)
    prescribed_on = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.READY)
    source = models.CharField(max_length=20, choices=Source.choices, default=Source.SCAN)
    notes = models.TextField(blank=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"Prescription {self.id} — {self.user}"


class PrescriptionMedicine(BaseModel):
    """A medicine extracted from a prescription (OCR review row)."""

    prescription = models.ForeignKey(
        Prescription, on_delete=models.CASCADE, related_name="medicines"
    )
    name = models.CharField(max_length=255)
    salt = models.CharField(max_length=255, blank=True)
    dosage = models.CharField(max_length=100, blank=True, help_text="e.g. 500 mg")
    frequency = models.CharField(max_length=100, blank=True, help_text="e.g. 1-0-1")
    timing = models.CharField(max_length=100, blank=True, help_text="e.g. After food")
    duration = models.CharField(max_length=100, blank=True, help_text="e.g. 90 days")
    confidence = models.PositiveIntegerField(null=True, blank=True)

    class Meta:
        ordering = ["created_at"]

    def __str__(self) -> str:
        return self.name
