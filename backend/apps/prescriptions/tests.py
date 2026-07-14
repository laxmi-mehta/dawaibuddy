from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from apps.accounts.models import User
from apps.medicines.models import Medicine
from apps.reminders.models import Reminder

from .models import Prescription


class PrescriptionAPITests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="a@b.com", email="a@b.com", password="secret12345"
        )
        self.client.force_authenticate(user=self.user)
        Medicine.objects.create(name="Glycomet 500 SR", generic_name="Metformin")

    def test_requires_auth(self):
        self.client.force_authenticate(user=None)
        response = self.client.get(reverse("v1:prescription-list"))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_create_prescription_with_medicines(self):
        response = self.client.post(
            reverse("v1:prescription-list"),
            {
                "doctor_name": "Dr. Test",
                "status": "ready",
                "source": "manual",
                "medicines": [
                    {"name": "Glycomet 500 SR", "dosage": "500mg", "frequency": "1-0-1"}
                ],
            },
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(len(response.data["medicines"]), 1)

    def test_create_matches_catalog_medicine_by_exact_name(self):
        response = self.client.post(
            reverse("v1:prescription-list"),
            {
                "medicines": [{"name": "Glycomet 500 SR", "frequency": "1-0-1"}],
            },
            format="json",
        )
        med = response.data["medicines"][0]
        self.assertIsNotNone(med["medicine_id"])

    def test_create_does_not_match_unknown_medicine(self):
        response = self.client.post(
            reverse("v1:prescription-list"),
            {"medicines": [{"name": "Totally Unknown Drug XYZ", "frequency": "1-0-1"}]},
            format="json",
        )
        med = response.data["medicines"][0]
        self.assertIsNone(med["medicine_id"])

    def test_create_auto_creates_reminders_from_frequency(self):
        self.client.post(
            reverse("v1:prescription-list"),
            {
                "medicines": [
                    {"name": "Glycomet 500 SR", "dosage": "500mg", "frequency": "1-0-1"}
                ]
            },
            format="json",
        )
        reminders = Reminder.objects.filter(user=self.user, medicine_name="Glycomet 500 SR")
        self.assertEqual(reminders.count(), 2)  # morning + night
        self.assertEqual(
            set(reminders.values_list("bucket", flat=True)), {"morning", "night"}
        )

    def test_create_skips_reminders_for_unparseable_frequency(self):
        self.client.post(
            reverse("v1:prescription-list"),
            {"medicines": [{"name": "Glycomet 500 SR", "frequency": "SOS"}]},
            format="json",
        )
        self.assertEqual(Reminder.objects.filter(user=self.user).count(), 0)

    def test_update_replaces_nested_medicines(self):
        prescription = Prescription.objects.create(user=self.user, doctor_name="Dr. Old")
        prescription.medicines.create(name="Old Med", frequency="1-0-0")

        response = self.client.patch(
            reverse("v1:prescription-detail", args=[prescription.id]),
            {
                "doctor_name": "Dr. New",
                "medicines": [{"name": "New Med", "frequency": "0-0-1"}],
            },
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["doctor_name"], "Dr. New")
        self.assertEqual(len(response.data["medicines"]), 1)
        self.assertEqual(response.data["medicines"][0]["name"], "New Med")

    def test_list_only_shows_own_prescriptions(self):
        other = User.objects.create_user(
            username="other@x.com", email="other@x.com", password="pw12345678"
        )
        Prescription.objects.create(user=other, doctor_name="Not mine")
        response = self.client.get(reverse("v1:prescription-list"))
        self.assertEqual(response.data["count"], 0)


class PrescriptionOcrTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="a@b.com", email="a@b.com", password="secret12345"
        )
        self.client.force_authenticate(user=self.user)

    def test_ocr_without_image_returns_400(self):
        response = self.client.post(reverse("v1:prescription-ocr"), {}, format="multipart")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_ocr_gracefully_degrades_without_tesseract(self):
        from io import BytesIO

        from PIL import Image

        buf = BytesIO()
        Image.new("RGB", (10, 10), color="white").save(buf, format="PNG")
        buf.seek(0)
        buf.name = "test.png"

        response = self.client.post(
            reverse("v1:prescription-ocr"), {"image": buf}, format="multipart"
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("ocr_available", response.data)
        self.assertEqual(response.data["medicines"], [])
