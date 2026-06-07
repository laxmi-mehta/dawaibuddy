from django.urls import path

from . import views

urlpatterns = [
    path("", views.DrugInteractionListView.as_view(), name="interaction-list"),
    path("<uuid:pk>/", views.DrugInteractionDetailView.as_view(), name="interaction-detail"),
]
