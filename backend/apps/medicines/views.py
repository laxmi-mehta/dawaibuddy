from rest_framework import generics, permissions

from .models import Medicine
from .serializers import MedicineSerializer


class MedicineListView(generics.ListAPIView):
    serializer_class = MedicineSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Medicine.objects.all()
    search_fields = ["name", "generic_name"]


class MedicineDetailView(generics.RetrieveAPIView):
    serializer_class = MedicineSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Medicine.objects.all()
