"""
Local development settings.
"""
from .base import *  # noqa: F401, F403

DEBUG = True

# Allow all hosts locally
ALLOWED_HOSTS = ["*"]

# Django Debug Toolbar
INSTALLED_APPS += ["debug_toolbar"]  # noqa: F405
MIDDLEWARE += ["debug_toolbar.middleware.DebugToolbarMiddleware"]  # noqa: F405
INTERNAL_IPS = ["127.0.0.1"]

# Relaxed email backend for development
EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"

# Disable password complexity locally
AUTH_PASSWORD_VALIDATORS = []
