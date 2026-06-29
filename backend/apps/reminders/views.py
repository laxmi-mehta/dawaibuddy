from django.shortcuts import get_object_or_404
from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Reminder
from .serializers import ReminderSerializer


class ReminderListCreateView(generics.ListCreateAPIView):
    serializer_class = ReminderSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ["bucket", "is_taken"]

    def get_queryset(self):
        return Reminder.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class ReminderDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ReminderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Reminder.objects.filter(user=self.request.user)


class ReminderTodayView(APIView):
    """Today's reminders grouped by time bucket, with adherence progress."""

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        qs = Reminder.objects.filter(user=request.user)
        total = qs.count()
        taken = qs.filter(is_taken=True).count()
        percent = round(taken / total * 100) if total else 0

        buckets = []
        for value, label in Reminder.Bucket.choices:
            items = qs.filter(bucket=value)
            if not items:
                continue
            buckets.append(
                {
                    "bucket": value,
                    "label": label,
                    "taken": items.filter(is_taken=True).count(),
                    "total": items.count(),
                    "reminders": ReminderSerializer(items, many=True).data,
                }
            )

        return Response(
            {
                "progress": {"taken": taken, "total": total, "percent": percent},
                "buckets": buckets,
            }
        )


class ReminderMarkTakenView(APIView):
    """Mark a single dose as taken (or untaken via ?taken=false)."""

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        reminder = get_object_or_404(Reminder, pk=pk, user=request.user)
        taken = str(request.data.get("taken", "true")).lower() != "false"
        reminder.is_taken = taken
        reminder.save(update_fields=["is_taken", "updated_at"])
        return Response(ReminderSerializer(reminder).data)
