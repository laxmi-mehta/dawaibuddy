from rest_framework import serializers

from .models import Reminder


class ReminderSerializer(serializers.ModelSerializer):
    is_taken = serializers.BooleanField(read_only=True)

    class Meta:
        model = Reminder
        fields = [
            "id",
            "medicine_name",
            "dosage",
            "scheduled_time",
            "bucket",
            "instruction",
            "is_taken",
            "taken_at",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "taken_at", "created_at", "updated_at"]
