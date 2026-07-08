from django.urls import path

from . import views

urlpatterns = [
    path("", views.ReminderListCreateView.as_view(), name="reminder-list"),
    path("today/", views.ReminderTodayView.as_view(), name="reminder-today"),
    path("<uuid:pk>/", views.ReminderDetailView.as_view(), name="reminder-detail"),
    path("<uuid:pk>/mark-taken/", views.ReminderMarkTakenView.as_view(), name="reminder-mark-taken"),
]
