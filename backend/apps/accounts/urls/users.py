"""
/api/v1/users/ routes
"""
from django.urls import path

from apps.accounts import views

urlpatterns = [
    path("", views.UserListView.as_view(), name="user-list"),
    path("me/", views.UserMeView.as_view(), name="user-me"),
    path("me/dashboard/", views.DashboardView.as_view(), name="user-dashboard"),
    path("me/profile/", views.ProfileView.as_view(), name="user-profile"),
    path("family/", views.FamilyListCreateView.as_view(), name="family-list"),
    path("family/<uuid:pk>/", views.FamilyDetailView.as_view(), name="family-detail"),
]
