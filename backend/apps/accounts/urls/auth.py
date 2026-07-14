"""
/api/v1/auth/ routes
"""
from django.urls import path
from rest_framework.throttling import ScopedRateThrottle
from rest_framework_simplejwt.views import (
    TokenBlacklistView,
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)

from apps.accounts.views import (
    PasswordResetConfirmView,
    PasswordResetRequestView,
    RegisterView,
)


class ThrottledTokenObtainPairView(TokenObtainPairView):
    """Login, rate-limited to slow down credential-stuffing/brute-force attempts."""

    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "auth"


urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("token/", ThrottledTokenObtainPairView.as_view(), name="token-obtain"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token-refresh"),
    path("token/verify/", TokenVerifyView.as_view(), name="token-verify"),
    path("token/blacklist/", TokenBlacklistView.as_view(), name="token-blacklist"),
    path("password-reset/", PasswordResetRequestView.as_view(), name="password-reset"),
    path(
        "password-reset/confirm/",
        PasswordResetConfirmView.as_view(),
        name="password-reset-confirm",
    ),
]
