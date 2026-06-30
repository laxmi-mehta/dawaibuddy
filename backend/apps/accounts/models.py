from django.conf import settings
from django.contrib.auth.models import AbstractUser
from django.db import models

from apps.common.models import BaseModel, TimeStampedModel


class User(AbstractUser, TimeStampedModel):
    """
    Custom user model. Extend with profile fields here.
    """

    email = models.EmailField(unique=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    class Meta:
        verbose_name = "User"
        verbose_name_plural = "Users"
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return self.email


class Profile(TimeStampedModel):
    """Health profile for a user (1:1)."""

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="profile"
    )
    age = models.PositiveIntegerField(null=True, blank=True)
    blood_group = models.CharField(max_length=5, blank=True)
    height_cm = models.PositiveIntegerField(null=True, blank=True)
    weight_kg = models.PositiveIntegerField(null=True, blank=True)
    conditions = models.JSONField(default=list, blank=True)
    allergies = models.JSONField(default=list, blank=True)

    def __str__(self) -> str:
        return f"Profile of {self.user}"


class FamilyMember(BaseModel):
    """A family member managed under a user's account."""

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="family_members"
    )
    name = models.CharField(max_length=255)
    relation = models.CharField(max_length=100, blank=True)
    age = models.PositiveIntegerField(null=True, blank=True)

    class Meta:
        ordering = ["created_at"]

    def __str__(self) -> str:
        return f"{self.name} ({self.relation})"
