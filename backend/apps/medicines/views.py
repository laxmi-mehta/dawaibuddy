from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.common.i18n import get_request_language

from .models import Medicine
from .serializers import MedicineSerializer
from .translations import translate_category


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
    """Distinct, non-empty medicine categories (for filter chips).

    Returns ``{value, label}`` pairs — ``value`` is the raw English category
    stored on Medicine (used for filtering), ``label`` is translated for display.
    """

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        categories = (
            Medicine.objects.exclude(category="")
            .values_list("category", flat=True)
            .distinct()
            .order_by("category")
        )
        language = get_request_language({"request": request})
        return Response(
            [
                {"value": category, "label": translate_category(category, language)}
                for category in categories
            ]
        )


class PopularMedicinesView(generics.ListAPIView):
    """A short list of medicines for quick-search suggestions."""

    serializer_class = MedicineSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = None

    def get_queryset(self):
        return Medicine.objects.prefetch_related("alternatives").all()[:8]
