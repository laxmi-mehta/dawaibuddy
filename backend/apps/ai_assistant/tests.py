from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from apps.accounts.models import User
from apps.medicines.models import Medicine

from . import engine
from .models import Conversation, Message


class AssistantEngineTests(APITestCase):
    """Pure unit tests for the rule-based engine — no HTTP involved."""

    def setUp(self):
        Medicine.objects.create(
            name="Glycomet 500 SR",
            generic_name="Metformin",
            uses=["Type 2 diabetes"],
            side_effects=["Nausea"],
            rx_required=True,
        )

    def test_describes_known_medicine(self):
        reply = engine.answer("What is Glycomet 500 SR for?")
        self.assertIn("Metformin", reply)
        self.assertIn("Type 2 diabetes", reply)

    def test_matches_health_topic_for_symptom(self):
        reply = engine.answer("I have a headache")
        self.assertIn("headache", reply.lower())

    def test_greeting_gets_greeting_reply(self):
        reply = engine.answer("hi there")
        self.assertIn("Hi!", reply)

    def test_unknown_message_gets_fallback(self):
        reply = engine.answer("asdkjalksdj random text")
        self.assertIn("couldn't match", reply)

    def test_always_includes_disclaimer(self):
        # Greetings are excluded — they carry no medical content, so the
        # engine skips the disclaimer for those (see engine.answer).
        for message in ["headache", "Glycomet 500 SR", "gibberish"]:
            self.assertIn("not medical advice", engine.answer(message))


class AssistantAPITests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="a@b.com", email="a@b.com", password="secret12345"
        )
        self.client.force_authenticate(user=self.user)

    def test_requires_auth(self):
        self.client.force_authenticate(user=None)
        response = self.client.post(reverse("v1:assistant-ask"), {"message": "hi"})
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_ask_creates_conversation_and_messages(self):
        response = self.client.post(
            reverse("v1:assistant-ask"), {"message": "I have a headache"}
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        conv_id = response.data["conversation_id"]
        conversation = Conversation.objects.get(id=conv_id, user=self.user)
        self.assertEqual(conversation.messages.count(), 2)
        self.assertEqual(conversation.messages.first().role, "user")
        self.assertEqual(conversation.messages.last().role, "assistant")

    def test_ask_reuses_existing_conversation(self):
        first = self.client.post(reverse("v1:assistant-ask"), {"message": "hi"})
        conv_id = first.data["conversation_id"]
        self.client.post(
            reverse("v1:assistant-ask"),
            {"message": "headache", "conversation_id": conv_id},
        )
        conversation = Conversation.objects.get(id=conv_id)
        self.assertEqual(conversation.messages.count(), 4)

    def test_list_conversations_scoped_to_user(self):
        other = User.objects.create_user(
            username="other@x.com", email="other@x.com", password="pw12345678"
        )
        other_conv = Conversation.objects.create(user=other, title="not mine")
        Message.objects.create(conversation=other_conv, role="user", content="hi")

        response = self.client.get(reverse("v1:conversation-list"))
        self.assertEqual(response.data["count"], 0)
