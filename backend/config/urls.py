"""
Root URL configuration.
"""
from django.contrib import admin
from django.urls import include, path
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularRedocView,
    SpectacularSwaggerView,
)

# API v1 routes
api_v1_patterns = [
    path("auth/", include("apps.accounts.urls.auth")),
    path("users/", include("apps.accounts.urls.users")),
    path("prescriptions/", include("apps.prescriptions.urls")),
    path("medicines/", include("apps.medicines.urls")),
    path("interactions/", include("apps.interactions.urls")),
    path("reminders/", include("apps.reminders.urls")),
    path("assistant/", include("apps.ai_assistant.urls")),
]

urlpatterns = [
    # Admin
    path("admin/", admin.site.urls),

    # API v1
    path("api/v1/", include((api_v1_patterns, "v1"), namespace="v1")),

    # OpenAPI schema & docs
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path("api/docs/", SpectacularSwaggerView.as_view(url_name="schema"), name="swagger-ui"),
    path("api/redoc/", SpectacularRedocView.as_view(url_name="schema"), name="redoc"),
]
