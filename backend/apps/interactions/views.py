from itertools import combinations

from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.medicines.models import Medicine

from . import ddi
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

        # Model predictions: score every pair (with SMILES) using the DDI classifier.
        model_predictions = []
        if ddi.model_available():
            meds = {
                str(m.id): m
                for m in Medicine.objects.filter(id__in=ids).exclude(smiles="")
            }
            for id_a, id_b in combinations([i for i in map(str, ids) if i in meds], 2):
                a, b = meds[id_a], meds[id_b]
                prob = ddi.predict(a.smiles, b.smiles)
                if prob is None:
                    continue
                model_predictions.append(
                    {
                        "medicine_a": id_a,
                        "medicine_b": id_b,
                        "medicine_a_name": a.name,
                        "medicine_b_name": b.name,
                        "probability": round(prob, 3),
                        "severity": ddi.severity_from_prob(prob),
                    }
                )

        return Response(
            {
                "count": len(data),
                "by_severity": counts,
                "interactions": data,
                "model_available": ddi.model_available(),
                "model_predictions": model_predictions,
            }
        )
