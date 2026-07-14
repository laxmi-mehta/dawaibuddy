from django.urls import reverse
from django.utils import timezone
from rest_framework import status
from rest_framework.test import APITestCase

from apps.accounts.models import User

from .models import Reminder


class ReminderAPITests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="a@b.com", email="a@b.com", password="secret12345"
        )
        self.client.force_authenticate(user=self.user)
        self.reminder = Reminder.objects.create(
            user=self.user,
            medicine_name="Glycomet 500 SR",
            dosage="500 mg",
            scheduled_time="08:00:00",
            bucket=Reminder.Bucket.MORNING,
            instruction="after breakfast",
        )

    def test_requires_auth(self):
        self.client.force_authenticate(user=None)
        response = self.client.get(reverse("v1:reminder-list"))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_new_reminder_is_not_taken(self):
        response = self.client.get(reverse("v1:reminder-detail", args=[self.reminder.id]))
        self.assertFalse(response.data["is_taken"])
        self.assertIsNone(response.data["taken_at"])

    def test_only_own_reminders_listed(self):
        other = User.objects.create_user(
            username="other@x.com", email="other@x.com", password="pw12345678"
        )
        Reminder.objects.create(
            user=other,
            medicine_name="Not mine",
            scheduled_time="09:00:00",
            bucket=Reminder.Bucket.MORNING,
        )
        response = self.client.get(reverse("v1:reminder-list"))
        self.assertEqual(response.data["count"], 1)

    def test_create_reminder(self):
        response = self.client.post(
            reverse("v1:reminder-list"),
            {
                "medicine_name": "Pan 40",
                "dosage": "40 mg",
                "scheduled_time": "07:30:00",
                "bucket": "morning",
                "instruction": "before breakfast",
            },
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertFalse(response.data["is_taken"])

    def test_mark_taken_sets_taken_at_today(self):
        response = self.client.post(
            reverse("v1:reminder-mark-taken", args=[self.reminder.id]), {"taken": "true"}
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data["is_taken"])
        self.reminder.refresh_from_db()
        self.assertEqual(self.reminder.taken_at.date(), timezone.localdate())

    def test_mark_untaken_clears_taken_at(self):
        self.reminder.taken_at = timezone.now()
        self.reminder.save()
        response = self.client.post(
            reverse("v1:reminder-mark-taken", args=[self.reminder.id]), {"taken": "false"}
        )
        self.assertFalse(response.data["is_taken"])
        self.reminder.refresh_from_db()
        self.assertIsNone(self.reminder.taken_at)

    def test_taken_at_from_yesterday_shows_not_taken_today(self):
        self.reminder.taken_at = timezone.now() - timezone.timedelta(days=1)
        self.reminder.save()
        response = self.client.get(reverse("v1:reminder-detail", args=[self.reminder.id]))
        self.assertFalse(response.data["is_taken"])

    def test_today_view_groups_by_bucket_and_computes_progress(self):
        self.client.post(
            reverse("v1:reminder-mark-taken", args=[self.reminder.id]), {"taken": "true"}
        )
        response = self.client.get(reverse("v1:reminder-today"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["progress"], {"taken": 1, "total": 1, "percent": 100})
        self.assertEqual(len(response.data["buckets"]), 1)
        self.assertEqual(response.data["buckets"][0]["bucket"], "morning")

    def test_is_taken_query_filter(self):
        untaken = self.client.get(reverse("v1:reminder-list"), {"is_taken": "false"})
        self.assertEqual(untaken.data["count"], 1)
        taken = self.client.get(reverse("v1:reminder-list"), {"is_taken": "true"})
        self.assertEqual(taken.data["count"], 0)
