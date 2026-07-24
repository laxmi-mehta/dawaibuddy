from rest_framework import serializers

from apps.common.i18n import get_request_language, localized_field

from .models import GenericAlternative, Medicine
from .translations import translate_category, translate_form


class GenericAlternativeSerializer(serializers.ModelSerializer):
    class Meta:
        model = GenericAlternative
        fields = ["id", "name", "manufacturer", "price", "save_percent"]
        read_only_fields = ["id"]


class MedicineSerializer(serializers.ModelSerializer):
    alternatives = GenericAlternativeSerializer(many=True, read_only=True)
    category = serializers.SerializerMethodField()
    form = serializers.SerializerMethodField()
    how_it_works = serializers.SerializerMethodField()
    uses = serializers.SerializerMethodField()
    side_effects = serializers.SerializerMethodField()
    warnings = serializers.SerializerMethodField()

    class Meta:
        model = Medicine
        fields = [
            "id",
            "name",
            "generic_name",
            "smiles",
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

    def get_category(self, obj: Medicine) -> str:
        return translate_category(obj.category, get_request_language(self.context))

    def get_form(self, obj: Medicine) -> str:
        return translate_form(obj.form, get_request_language(self.context))

    def get_how_it_works(self, obj: Medicine) -> str:
        return localized_field(obj, "how_it_works", get_request_language(self.context))

    def get_uses(self, obj: Medicine) -> list:
        return localized_field(obj, "uses", get_request_language(self.context))

    def get_side_effects(self, obj: Medicine) -> list:
        return localized_field(obj, "side_effects", get_request_language(self.context))

    def get_warnings(self, obj: Medicine) -> list:
        return localized_field(obj, "warnings", get_request_language(self.context))
