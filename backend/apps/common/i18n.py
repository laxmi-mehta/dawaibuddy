"""Shared helpers for serving DB content in the user's chosen language.

Translated content lives on the model as ``<field>_hi`` / ``<field>_mr`` sibling
columns next to the original (English) field, populated for hi/mr only where a
translation exists. Falls back to the English value when a translation is
missing, so partially-translated data never renders blank.
"""

SUPPORTED_LANGUAGES = ("hi", "mr")


def get_request_language(context: dict) -> str:
    """Read the active language off the request (set by LocaleMiddleware from Accept-Language)."""
    request = context.get("request")
    if request is not None:
        lang = getattr(request, "LANGUAGE_CODE", "en")
        if lang in SUPPORTED_LANGUAGES:
            return lang
    return "en"


def localized_field(obj, base_field: str, language: str):
    """Return obj.<base_field>_<language> if set, else obj.<base_field>."""
    if language not in SUPPORTED_LANGUAGES:
        return getattr(obj, base_field)
    translated = getattr(obj, f"{base_field}_{language}", None)
    return translated or getattr(obj, base_field)
