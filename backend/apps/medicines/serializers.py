from rest_framework import serializers

from .models import GenericAlternative, Medicine


class GenericAlternativeSerializer(serializers.ModelSerializer):
    class Meta:
        model = GenericAlternative
        fields = ["id", "name", "manufacturer", "price", "save_percent"]
        read_only_fields = ["id"]


class MedicineSerializer(serializers.ModelSerializer):
    alternatives = GenericAlternativeSerializer(many=True, read_only=True)

    class Meta:
        model = Medicine
        fields = [
            "id",
            "name",
            "generic_name",
            "manufacturer",
            "form",
            "strength",
            "category",
            "rx_required",
            "in_stock",
            "price",
            "how_it_works",
            "uses",
            "side_effects",
            "warnings",
            "alternatives",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]
