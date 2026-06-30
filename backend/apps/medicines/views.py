from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView

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


class MedicineCategoriesView(APIView):
    """Distinct, non-empty medicine categories (for filter chips)."""

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        categories = (
            Medicine.objects.exclude(category="")
            .values_list("category", flat=True)
            .distinct()
            .order_by("category")
        )
        return Response(list(categories))


class PopularMedicinesView(generics.ListAPIView):
    """A short list of medicines for quick-search suggestions."""

    serializer_class = MedicineSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = None

    def get_queryset(self):
        return Medicine.objects.prefetch_related("alternatives").all()[:8]
