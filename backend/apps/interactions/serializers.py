from rest_framework import serializers

from .models import DrugInteraction


class DrugInteractionSerializer(serializers.ModelSerializer):
    medicine_a_name = serializers.CharField(source="medicine_a.name", read_only=True)
    medicine_b_name = serializers.CharField(source="medicine_b.name", read_only=True)

    class Meta:
        model = DrugInteraction
        fields = [
            "id",
            "medicine_a",
            "medicine_b",
            "medicine_a_name",
            "medicine_b_name",
            "severity",
            "title",
            "description",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]


class InteractionCheckSerializer(serializers.Serializer):
    """Input: a list of medicine IDs to check pairwise."""

    medicine_ids = serializers.ListField(
        child=serializers.UUIDField(), min_length=2, allow_empty=False
    )
