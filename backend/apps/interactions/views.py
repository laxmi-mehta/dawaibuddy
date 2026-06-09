from rest_framework import generics, permissions

from .models import DrugInteraction
from .serializers import DrugInteractionSerializer


class DrugInteractionListView(generics.ListAPIView):
    serializer_class = DrugInteractionSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = DrugInteraction.objects.all()


class DrugInteractionDetailView(generics.RetrieveAPIView):
    serializer_class = DrugInteractionSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = DrugInteraction.objects.all()
