from django.urls import path

from . import views

urlpatterns = [
    path("", views.PrescriptionListCreateView.as_view(), name="prescription-list"),
    path("<uuid:pk>/", views.PrescriptionDetailView.as_view(), name="prescription-detail"),
]
