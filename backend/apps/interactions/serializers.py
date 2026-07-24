from rest_framework import serializers

from apps.common.i18n import get_request_language, localized_field

from .models import DrugInteraction


class DrugInteractionSerializer(serializers.ModelSerializer):
    medicine_a_name = serializers.CharField(source="medicine_a.name", read_only=True)
    medicine_b_name = serializers.CharField(source="medicine_b.name", read_only=True)
    title = serializers.SerializerMethodField()
    description = serializers.SerializerMethodField()

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

    def get_title(self, obj: DrugInteraction) -> str:
        return localized_field(obj, "title", get_request_language(self.context))

    def get_description(self, obj: DrugInteraction) -> str:
        return localized_field(obj, "description", get_request_language(self.context))


class InteractionCheckSerializer(serializers.Serializer):
    """Input: a list of medicine IDs to check pairwise."""

    medicine_ids = serializers.ListField(
        child=serializers.UUIDField(), min_length=2, allow_empty=False
    )
