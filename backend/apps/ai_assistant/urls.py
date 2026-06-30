from django.urls import path

from . import views

urlpatterns = [
    path("ask/", views.AskView.as_view(), name="assistant-ask"),
    path("conversations/", views.ConversationListCreateView.as_view(), name="conversation-list"),
    path(
        "conversations/<uuid:pk>/",
        views.ConversationDetailView.as_view(),
        name="conversation-detail",
    ),
    path(
        "conversations/<uuid:pk>/messages/",
        views.MessageCreateView.as_view(),
        name="message-create",
    ),
]
