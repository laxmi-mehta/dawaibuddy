from rest_framework import serializers

from .models import Prescription, PrescriptionMedicine


class PrescriptionMedicineSerializer(serializers.ModelSerializer):
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
        ]
        read_only_fields = ["id"]


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
            PrescriptionMedicine.objects.create(prescription=prescription, **med)
        return prescription
