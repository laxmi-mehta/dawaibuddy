from rest_framework import generics, permissions

from .models import Prescription
from .serializers import PrescriptionSerializer


class PrescriptionListCreateView(generics.ListCreateAPIView):
    serializer_class = PrescriptionSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ["status", "source"]
    search_fields = ["doctor_name", "speciality", "clinic"]

    def get_queryset(self):
        return (
            Prescription.objects.filter(user=self.request.user)
            .prefetch_related("medicines")
        )

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class PrescriptionDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = PrescriptionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Prescription.objects.filter(user=self.request.user).prefetch_related("medicines")
