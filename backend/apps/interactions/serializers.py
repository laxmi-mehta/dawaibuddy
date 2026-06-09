from rest_framework import serializers

from .models import DrugInteraction


class DrugInteractionSerializer(serializers.ModelSerializer):
    class Meta:
        model = DrugInteraction
        fields = [
            "id",
            "medicine_a",
            "medicine_b",
            "severity",
            "description",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]
