from rest_framework import generics, permissions, status
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.response import Response
from rest_framework.views import APIView

from . import ocr
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


class PrescriptionOcrView(APIView):
    """Scan a prescription image and return a draft for OcrReviewPage.

    Doesn't persist anything — the client reviews/edits the draft, then
    POSTs the confirmed data to `PrescriptionListCreateView` to save it.
    """

    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        image = request.data.get("image")
        if not image:
            return Response(
                {"detail": "No image file provided (expected multipart field 'image')."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        raw_text = ocr.extract_text(image)
        medicines = ocr.parse_medicines(raw_text) if raw_text else []

        return Response(
            {
                "ocr_available": ocr.ocr_available(),
                "raw_text": raw_text or "",
                "doctor_name": "",
                "speciality": "",
                "clinic": "",
                "prescribed_on": None,
                "medicines": medicines,
            }
        )
