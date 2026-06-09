from rest_framework import serializers

from .models import Prescription


class PrescriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Prescription
        fields = ["id", "user", "notes", "created_at", "updated_at"]
        read_only_fields = ["id", "user", "created_at", "updated_at"]
