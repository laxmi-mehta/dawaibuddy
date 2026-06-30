from django.urls import path

from . import views

urlpatterns = [
    path("", views.MedicineListView.as_view(), name="medicine-list"),
    path("categories/", views.MedicineCategoriesView.as_view(), name="medicine-categories"),
    path("popular/", views.PopularMedicinesView.as_view(), name="medicine-popular"),
    path("<uuid:pk>/", views.MedicineDetailView.as_view(), name="medicine-detail"),
]
