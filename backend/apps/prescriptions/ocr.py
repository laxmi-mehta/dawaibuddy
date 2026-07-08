"""Prescription OCR — extract raw text from a scanned image and parse dose rows.

Heavy imports (pytesseract, PIL) are lazy so the module always imports cleanly;
if tesseract isn't installed on the host, extract_text() returns None and the
view falls back to an empty draft the user fills in manually.
"""
import functools
import re

DOSAGE_RE = re.compile(r"\b\d+(?:\.\d+)?\s?(?:mg|mcg|ml|g|iu)\b", re.IGNORECASE)
FREQUENCY_RE = re.compile(r"\b[01]-[01]-[01]\b")
DURATION_RE = re.compile(r"\b\d+\s?(?:day|days|week|weeks|month|months)\b", re.IGNORECASE)
TIMING_KEYWORDS = {
    "before food": ["before food", "before meal", "before breakfast"],
    "after food": ["after food", "after meal", "after breakfast", "after dinner", "after lunch"],
    "empty stomach": ["empty stomach"],
}
NOISE_PREFIXES = ("dr.", "dr ", "date", "clinic", "hospital", "age", "patient", "sex", "id:")


@functools.lru_cache(maxsize=1)
def _tesseract_available() -> bool:
    try:
        import pytesseract

        pytesseract.get_tesseract_version()
        return True
    except Exception:
        return False


def ocr_available() -> bool:
    return _tesseract_available()


def extract_text(image_file) -> str | None:
    """Run OCR on an uploaded image file. Returns None if OCR isn't available."""
    if not _tesseract_available():
        return None
    try:
        import pytesseract
        from PIL import Image

        image = Image.open(image_file)
        return pytesseract.image_to_string(image)
    except Exception:
        return None


def _extract_timing(line: str) -> tuple[str, str]:
    """Return (timing_label, matched_substring) so the caller can strip it from name."""
    lowered = line.lower()
    for label, keywords in TIMING_KEYWORDS.items():
        for kw in keywords:
            idx = lowered.find(kw)
            if idx != -1:
                return label, line[idx : idx + len(kw)]
    return "", ""


def parse_medicines(raw_text: str) -> list[dict]:
    """Best-effort heuristic parse of OCR'd prescription text into dose rows.

    No ML/NER model backs this — it's regex-driven, so confidence reflects how
    many expected fields (dosage/frequency/duration) a line actually matched.
    """
    rows = []
    for line in raw_text.splitlines():
        line = line.strip()
        if not line or line.lower().startswith(NOISE_PREFIXES):
            continue

        dosage_match = DOSAGE_RE.search(line)
        frequency_match = FREQUENCY_RE.search(line)
        duration_match = DURATION_RE.search(line)
        if not (dosage_match or frequency_match):
            continue

        timing_label, timing_text = _extract_timing(line)

        name = line
        for text in (
            dosage_match.group(0) if dosage_match else "",
            frequency_match.group(0) if frequency_match else "",
            duration_match.group(0) if duration_match else "",
            timing_text,
        ):
            if text:
                name = name.replace(text, "")
        name = re.sub(r"\s{2,}", " ", name)
        name = re.sub(r"[-:,]+$", "", name).strip(" -:,\t")
        if not name:
            continue

        matched = sum(1 for m in (dosage_match, frequency_match, duration_match) if m)
        rows.append(
            {
                "name": name,
                "salt": "",
                "dosage": dosage_match.group(0) if dosage_match else "",
                "frequency": frequency_match.group(0) if frequency_match else "",
                "timing": timing_label,
                "duration": duration_match.group(0) if duration_match else "",
                "confidence": round(40 + matched * 20),
            }
        )
    return rows
