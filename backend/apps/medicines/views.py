from rest_framework import generics, permissions

from .models import Medicine
from .serializers import MedicineSerializer


class MedicineListView(generics.ListAPIView):
    serializer_class = MedicineSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Medicine.objects.prefetch_related("alternatives").all()
    search_fields = ["name", "generic_name", "category"]
    filterset_fields = ["category", "rx_required", "in_stock"]
    ordering_fields = ["name", "price"]


class MedicineDetailView(generics.RetrieveAPIView):
    serializer_class = MedicineSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Medicine.objects.prefetch_related("alternatives").all()
