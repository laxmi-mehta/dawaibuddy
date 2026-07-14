from django.conf import settings
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.utils import timezone
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.throttling import ScopedRateThrottle
from rest_framework.views import APIView

from apps.prescriptions.models import Prescription
from apps.prescriptions.serializers import PrescriptionSerializer
from apps.reminders.models import Reminder

from .models import FamilyMember, Profile, User
from .serializers import (
    FamilyMemberSerializer,
    PasswordResetConfirmSerializer,
    PasswordResetRequestSerializer,
    ProfileSerializer,
    RegisterSerializer,
    UserSerializer,
)


class RegisterView(generics.CreateAPIView):
    """Public endpoint to create a new account."""

    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "auth"
    queryset = User.objects.all()


class ProfileView(generics.RetrieveUpdateAPIView):
    """Get or update the current user's health profile (auto-created)."""

    serializer_class = ProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        profile, _ = Profile.objects.get_or_create(user=self.request.user)
        return profile


class FamilyListCreateView(generics.ListCreateAPIView):
    serializer_class = FamilyMemberSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return FamilyMember.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class FamilyDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = FamilyMemberSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return FamilyMember.objects.filter(user=self.request.user)


class UserMeView(generics.RetrieveUpdateAPIView):
    """Retrieve or update the currently authenticated user."""

    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user


class UserListView(generics.ListAPIView):
    """List all users (admin only)."""

    serializer_class = UserSerializer
    permission_classes = [permissions.IsAdminUser]
    queryset = User.objects.all()


class DashboardView(APIView):
    """Aggregated stats for the current user's dashboard."""

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        today = timezone.localdate()
        reminders = Reminder.objects.filter(user=user)
        prescriptions = Prescription.objects.filter(user=user)
        taken = reminders.filter(taken_at__date=today).count()
        total = reminders.count()

        return Response(
            {
                "active_medicines": reminders.values("medicine_name").distinct().count(),
                "doses_taken_today": taken,
                "doses_total_today": total,
                "adherence_percent": round(taken / total * 100) if total else 0,
                "prescriptions_count": prescriptions.count(),
                "recent_prescriptions": PrescriptionSerializer(
                    prescriptions.prefetch_related("medicines")[:3], many=True
                ).data,
            }
        )


class PasswordResetRequestView(APIView):
    """Request a password reset email. Always returns 200 — never reveals
    whether the email exists, to avoid account enumeration."""

    permission_classes = [permissions.AllowAny]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "auth"

    def post(self, request):
        payload = PasswordResetRequestSerializer(data=request.data)
        payload.is_valid(raise_exception=True)
        email = payload.validated_data["email"]

        user = User.objects.filter(email__iexact=email).first()
        if user:
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            token = default_token_generator.make_token(user)
            reset_link = f"{settings.FRONTEND_URL}/reset-password?uid={uid}&token={token}"
            send_mail(
                subject="Reset your DawaiBuddy password",
                message=(
                    f"Hi {user.first_name or user.email},\n\n"
                    f"Click the link below to reset your password:\n{reset_link}\n\n"
                    "If you didn't request this, ignore this email."
                ),
                from_email=None,
                recipient_list=[user.email],
            )

        return Response(
            {"detail": "If that email is registered, a reset link has been sent."}
        )


class PasswordResetConfirmView(APIView):
    """Confirm a password reset using the uid/token from the emailed link."""

    permission_classes = [permissions.AllowAny]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "auth"

    def post(self, request):
        payload = PasswordResetConfirmSerializer(data=request.data)
        payload.is_valid(raise_exception=True)
        uid = payload.validated_data["uid"]
        token = payload.validated_data["token"]
        new_password = payload.validated_data["new_password"]

        try:
            user_id = force_str(urlsafe_base64_decode(uid))
            user = User.objects.get(pk=user_id)
        except (User.DoesNotExist, ValueError, TypeError, OverflowError):
            return Response(
                {"detail": "Invalid or expired reset link."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not default_token_generator.check_token(user, token):
            return Response(
                {"detail": "Invalid or expired reset link."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user.set_password(new_password)
        user.save(update_fields=["password"])
        return Response({"detail": "Password has been reset."})
