from rest_framework import serializers

from apps.medicines.models import Medicine

from .models import Prescription, PrescriptionMedicine
from .reminders_sync import create_reminders_for_medicine


def match_catalog_medicine(name: str) -> Medicine | None:
    """Best-effort link to the medicine catalog by exact name/generic-name match.

    No fuzzy matching — a wrong link is worse than no link, so this only
    matches when the extracted name is an exact (case-insensitive) hit.
    """
    name = (name or "").strip()
    if not name:
        return None
    return (
        Medicine.objects.filter(name__iexact=name).first()
        or Medicine.objects.filter(generic_name__iexact=name).first()
    )


class PrescriptionMedicineSerializer(serializers.ModelSerializer):
    medicine_id = serializers.SerializerMethodField()
    medicine_category = serializers.SerializerMethodField()

    class Meta:
        model = PrescriptionMedicine
        fields = [
            "id",
            "name",
            "salt",
            "dosage",
            "frequency",
            "timing",
            "duration",
            "confidence",
            "medicine_id",
            "medicine_category",
        ]
        read_only_fields = ["id", "medicine_id", "medicine_category"]

    def get_medicine_id(self, obj: PrescriptionMedicine) -> str | None:
        return str(obj.medicine_id) if obj.medicine_id else None

    def get_medicine_category(self, obj: PrescriptionMedicine) -> str | None:
        return obj.medicine.category if obj.medicine_id else None


class PrescriptionSerializer(serializers.ModelSerializer):
    medicines = PrescriptionMedicineSerializer(many=True, required=False)

    class Meta:
        model = Prescription
        fields = [
            "id",
            "doctor_name",
            "speciality",
            "clinic",
            "prescribed_on",
            "status",
            "source",
            "notes",
            "medicines",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]

    def create(self, validated_data: dict) -> Prescription:
        medicines = validated_data.pop("medicines", [])
        prescription = Prescription.objects.create(**validated_data)
        for med in medicines:
            catalog_match = match_catalog_medicine(med.get("name", ""))
            medicine = PrescriptionMedicine.objects.create(
                prescription=prescription, medicine=catalog_match, **med
            )
            create_reminders_for_medicine(prescription.user, medicine)
        return prescription

    def update(self, instance: Prescription, validated_data: dict) -> Prescription:
        medicines = validated_data.pop("medicines", None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if medicines is not None:
            instance.medicines.all().delete()
            for med in medicines:
                catalog_match = match_catalog_medicine(med.get("name", ""))
                PrescriptionMedicine.objects.create(
                    prescription=instance, medicine=catalog_match, **med
                )

        return instance
