from rest_framework import serializers

from .models import Reminder


class ReminderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reminder
        fields = [
            "id",
            "user",
            "message",
            "scheduled_at",
            "is_sent",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "user", "is_sent", "created_at", "updated_at"]
