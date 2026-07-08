from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Reminder
from .serializers import ReminderSerializer


class ReminderListCreateView(generics.ListCreateAPIView):
    serializer_class = ReminderSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ["bucket"]

    def get_queryset(self):
        qs = Reminder.objects.filter(user=self.request.user)
        is_taken = self.request.query_params.get("is_taken")
        if is_taken is not None:
            today = timezone.localdate()
            taken_today = str(is_taken).lower() not in ("false", "0")
            qs = qs.filter(taken_at__date=today) if taken_today else qs.exclude(
                taken_at__date=today
            )
        return qs

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
        today = timezone.localdate()
        qs = Reminder.objects.filter(user=request.user)
        total = qs.count()
        taken = qs.filter(taken_at__date=today).count()
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
                    "taken": items.filter(taken_at__date=today).count(),
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
        reminder.taken_at = timezone.now() if taken else None
        reminder.save(update_fields=["taken_at", "updated_at"])
        return Response(ReminderSerializer(reminder).data)
