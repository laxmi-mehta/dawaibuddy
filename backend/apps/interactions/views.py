from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import DrugInteraction
from .serializers import DrugInteractionSerializer, InteractionCheckSerializer


class DrugInteractionListView(generics.ListAPIView):
    serializer_class = DrugInteractionSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = DrugInteraction.objects.select_related("medicine_a", "medicine_b").all()
    filterset_fields = ["severity"]


class DrugInteractionDetailView(generics.RetrieveAPIView):
    serializer_class = DrugInteractionSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = DrugInteraction.objects.select_related("medicine_a", "medicine_b").all()


class InteractionCheckView(APIView):
    """POST a list of medicine IDs → every known interaction among them."""

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        payload = InteractionCheckSerializer(data=request.data)
        payload.is_valid(raise_exception=True)
        ids = payload.validated_data["medicine_ids"]

        interactions = (
            DrugInteraction.objects.select_related("medicine_a", "medicine_b")
            .filter(medicine_a__in=ids)
            .filter(medicine_b__in=ids)
        )
        data = DrugInteractionSerializer(interactions, many=True).data
        counts: dict[str, int] = {}
        for item in data:
            counts[item["severity"]] = counts.get(item["severity"], 0) + 1
        return Response({"count": len(data), "by_severity": counts, "interactions": data})
