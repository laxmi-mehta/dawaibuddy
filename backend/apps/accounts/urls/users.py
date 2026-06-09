"""
/api/v1/users/ routes
"""
from django.urls import path

from apps.accounts import views

urlpatterns = [
    path("", views.UserListView.as_view(), name="user-list"),
    path("me/", views.UserMeView.as_view(), name="user-me"),
]
