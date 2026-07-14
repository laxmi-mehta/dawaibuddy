from django.core.cache import cache
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from .models import FamilyMember, User


class ThrottleSafeAPITestCase(APITestCase):
    """Base test case: clears the throttle cache before each test so the
    per-test-run request volume doesn't trip the real 'auth' rate limit
    (10/min) that's meant for production abuse, not test suites."""

    def setUp(self):
        cache.clear()
        super().setUp()


class RegisterTests(ThrottleSafeAPITestCase):
    def test_register_creates_user(self):
        url = reverse("v1:register")
        response = self.client.post(
            url,
            {"email": "new@example.com", "password": "supersecret1", "first_name": "New"},
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(email="new@example.com").exists())

    def test_register_rejects_duplicate_email(self):
        User.objects.create_user(username="dup", email="dup@example.com", password="pw12345678")
        url = reverse("v1:register")
        response = self.client.post(
            url, {"email": "dup@example.com", "password": "supersecret1"}
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class AuthenticatedAPITestCase(ThrottleSafeAPITestCase):
    """Base class: creates a user and logs the test client in via JWT."""

    def setUp(self):
        super().setUp()
        self.user = User.objects.create_user(
            username="a@b.com", email="a@b.com", password="secret12345"
        )
        token_url = reverse("v1:token-obtain")
        response = self.client.post(
            token_url, {"email": "a@b.com", "password": "secret12345"}
        )
        self.access_token = response.data["access"]
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.access_token}")


class DashboardTests(AuthenticatedAPITestCase):
    def test_dashboard_requires_auth(self):
        self.client.credentials()
        response = self.client.get(reverse("v1:user-dashboard"))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_dashboard_returns_stats_shape(self):
        response = self.client.get(reverse("v1:user-dashboard"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        for key in [
            "active_medicines",
            "doses_taken_today",
            "doses_total_today",
            "adherence_percent",
            "prescriptions_count",
            "recent_prescriptions",
        ]:
            self.assertIn(key, response.data)


class ProfileTests(AuthenticatedAPITestCase):
    def test_get_profile_auto_creates(self):
        response = self.client.get(reverse("v1:user-profile"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_patch_profile(self):
        response = self.client.patch(reverse("v1:user-profile"), {"age": 30, "blood_group": "O+"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["age"], 30)
        self.assertEqual(response.data["blood_group"], "O+")


class FamilyMemberTests(AuthenticatedAPITestCase):
    def test_create_list_update_delete_family_member(self):
        create = self.client.post(
            reverse("v1:family-list"), {"name": "Kid", "relation": "Son", "age": 8}
        )
        self.assertEqual(create.status_code, status.HTTP_201_CREATED)
        member_id = create.data["id"]

        listed = self.client.get(reverse("v1:family-list"))
        self.assertEqual(listed.data["count"], 1)

        updated = self.client.patch(
            reverse("v1:family-detail", args=[member_id]), {"age": 9}
        )
        self.assertEqual(updated.status_code, status.HTTP_200_OK)
        self.assertEqual(updated.data["age"], 9)

        deleted = self.client.delete(reverse("v1:family-detail", args=[member_id]))
        self.assertEqual(deleted.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(FamilyMember.objects.filter(id=member_id).exists())

    def test_cannot_see_other_users_family_members(self):
        other = User.objects.create_user(
            username="other@x.com", email="other@x.com", password="pw12345678"
        )
        FamilyMember.objects.create(user=other, name="Not mine", relation="Friend")
        response = self.client.get(reverse("v1:family-list"))
        self.assertEqual(response.data["count"], 0)


class PasswordResetTests(ThrottleSafeAPITestCase):
    def setUp(self):
        super().setUp()
        self.user = User.objects.create_user(
            username="reset@x.com", email="reset@x.com", password="oldpassword1"
        )

    def test_request_reset_is_generic_for_unknown_email(self):
        known = self.client.post(reverse("v1:password-reset"), {"email": "reset@x.com"})
        unknown = self.client.post(reverse("v1:password-reset"), {"email": "nobody@x.com"})
        self.assertEqual(known.status_code, status.HTTP_200_OK)
        self.assertEqual(unknown.status_code, status.HTTP_200_OK)
        self.assertEqual(known.data["detail"], unknown.data["detail"])

    def test_confirm_with_bad_token_rejected(self):
        from django.utils.http import urlsafe_base64_encode
        from django.utils.encoding import force_bytes

        uid = urlsafe_base64_encode(force_bytes(self.user.pk))
        response = self.client.post(
            reverse("v1:password-reset-confirm"),
            {"uid": uid, "token": "bogus", "new_password": "newpassword1"},
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_confirm_with_real_token_changes_password(self):
        from django.contrib.auth.tokens import default_token_generator
        from django.utils.http import urlsafe_base64_encode
        from django.utils.encoding import force_bytes

        uid = urlsafe_base64_encode(force_bytes(self.user.pk))
        token = default_token_generator.make_token(self.user)
        response = self.client.post(
            reverse("v1:password-reset-confirm"),
            {"uid": uid, "token": token, "new_password": "newpassword1"},
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        login = self.client.post(
            reverse("v1:token-obtain"),
            {"email": "reset@x.com", "password": "newpassword1"},
        )
        self.assertEqual(login.status_code, status.HTTP_200_OK)
