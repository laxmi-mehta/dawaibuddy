from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.prescriptions.models import Prescription
from apps.prescriptions.serializers import PrescriptionSerializer
from apps.reminders.models import Reminder

from .models import FamilyMember, Profile, User
from .serializers import (
    FamilyMemberSerializer,
    ProfileSerializer,
    RegisterSerializer,
    UserSerializer,
)


class RegisterView(generics.CreateAPIView):
    """Public endpoint to create a new account."""

    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]
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
        reminders = Reminder.objects.filter(user=user)
        prescriptions = Prescription.objects.filter(user=user)
        taken = reminders.filter(is_taken=True).count()
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
