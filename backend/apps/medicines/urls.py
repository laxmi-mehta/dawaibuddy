from django.urls import path

from . import views

urlpatterns = [
    path("", views.MedicineListView.as_view(), name="medicine-list"),
    path("<uuid:pk>/", views.MedicineDetailView.as_view(), name="medicine-detail"),
]
