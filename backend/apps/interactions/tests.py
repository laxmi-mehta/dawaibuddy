from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from apps.accounts.models import User
from apps.medicines.models import Medicine

from .models import DrugInteraction


class InteractionAPITests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="a@b.com", email="a@b.com", password="secret12345"
        )
        self.client.force_authenticate(user=self.user)
        self.metformin = Medicine.objects.create(name="Glycomet 500 SR")
        self.pantoprazole = Medicine.objects.create(name="Pan 40")
        self.unrelated = Medicine.objects.create(name="Atorva 10")
        self.interaction = DrugInteraction.objects.create(
            medicine_a=self.metformin,
            medicine_b=self.pantoprazole,
            severity=DrugInteraction.Severity.MILD,
            title="Minor B12 interaction",
        )

    def test_requires_auth(self):
        self.client.force_authenticate(user=None)
        response = self.client.get(reverse("v1:interaction-list"))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_list_interactions(self):
        response = self.client.get(reverse("v1:interaction-list"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["count"], 1)

    def test_check_finds_known_interaction_either_direction(self):
        response = self.client.post(
            reverse("v1:interaction-check"),
            {"medicine_ids": [str(self.pantoprazole.id), str(self.metformin.id)]},
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["count"], 1)
        self.assertEqual(response.data["by_severity"], {"mild": 1})

    def test_check_with_unrelated_medicines_finds_nothing(self):
        response = self.client.post(
            reverse("v1:interaction-check"),
            {"medicine_ids": [str(self.unrelated.id), str(self.metformin.id)]},
        )
        self.assertEqual(response.data["count"], 0)

    def test_check_requires_at_least_two_ids(self):
        response = self.client.post(
            reverse("v1:interaction-check"), {"medicine_ids": [str(self.metformin.id)]}
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
