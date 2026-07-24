from django.shortcuts import get_object_or_404
from drf_spectacular.utils import extend_schema
from rest_framework import generics, permissions, serializers
from rest_framework.response import Response
from rest_framework.views import APIView

from . import engine
from .models import Conversation, Message
from .serializers import AskResponseSerializer, ConversationSerializer, MessageSerializer


class ConversationListCreateView(generics.ListCreateAPIView):
    serializer_class = ConversationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Conversation.objects.filter(user=self.request.user).prefetch_related("messages")

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class ConversationDetailView(generics.RetrieveDestroyAPIView):
    serializer_class = ConversationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Conversation.objects.filter(user=self.request.user).prefetch_related("messages")


class MessageCreateView(generics.CreateAPIView):
    """Append a message to one of the user's conversations.

    Persistence only — the assistant reply is generated once the ML model is wired.
    """

    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        conversation = get_object_or_404(
            Conversation, pk=self.kwargs["pk"], user=self.request.user
        )
        serializer.save(conversation=conversation)


class AskSerializer(serializers.Serializer):
    message = serializers.CharField()
    conversation_id = serializers.UUIDField(required=False)


class AskView(APIView):
    """Send a question; stores the user message and a catalog-grounded assistant reply.

    `engine.answer()` matches medicine names in the message against our
    Medicine/DrugInteraction tables — no external LLM call.
    """

    permission_classes = [permissions.IsAuthenticated]

    @extend_schema(request=AskSerializer, responses=AskResponseSerializer)
    def post(self, request):
        payload = AskSerializer(data=request.data)
        payload.is_valid(raise_exception=True)
        text = payload.validated_data["message"]
        conv_id = payload.validated_data.get("conversation_id")

        if conv_id:
            conversation = get_object_or_404(Conversation, pk=conv_id, user=request.user)
        else:
            conversation = Conversation.objects.create(
                user=request.user, title=text[:60]
            )

        Message.objects.create(conversation=conversation, role="user", content=text)
        reply = Message.objects.create(
            conversation=conversation,
            role="assistant",
            content=engine.answer(text, language=request.LANGUAGE_CODE),
        )

        return Response(
            {
                "conversation_id": str(conversation.id),
                "reply": MessageSerializer(reply).data,
            }
        )
