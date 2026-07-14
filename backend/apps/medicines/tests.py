from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from apps.accounts.models import User

from .models import Medicine


class MedicineAPITests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="a@b.com", email="a@b.com", password="secret12345"
        )
        self.client.force_authenticate(user=self.user)
        self.metformin = Medicine.objects.create(
            name="Glycomet 500 SR",
            generic_name="Metformin",
            category="Anti-diabetic",
            price="42.00",
        )
        self.pantoprazole = Medicine.objects.create(
            name="Pan 40",
            generic_name="Pantoprazole",
            category="Acid reducer",
            price="30.00",
        )

    def test_requires_auth(self):
        self.client.force_authenticate(user=None)
        response = self.client.get(reverse("v1:medicine-list"))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_list_medicines(self):
        response = self.client.get(reverse("v1:medicine-list"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["count"], 2)

    def test_search_medicines_by_name(self):
        response = self.client.get(reverse("v1:medicine-list"), {"search": "Glycomet"})
        self.assertEqual(response.data["count"], 1)
        self.assertEqual(response.data["results"][0]["name"], "Glycomet 500 SR")

    def test_search_medicines_by_generic_name(self):
        response = self.client.get(reverse("v1:medicine-list"), {"search": "Pantoprazole"})
        self.assertEqual(response.data["count"], 1)

    def test_medicine_detail(self):
        response = self.client.get(reverse("v1:medicine-detail", args=[self.metformin.id]))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["generic_name"], "Metformin")

    def test_categories_are_distinct(self):
        response = self.client.get(reverse("v1:medicine-categories"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("Anti-diabetic", response.data)
        self.assertIn("Acid reducer", response.data)

    def test_popular_returns_medicines(self):
        response = self.client.get(reverse("v1:medicine-popular"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
