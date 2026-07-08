"""Rule-based assistant — answers from the medicine/interaction catalog we already have.

No LLM call: it matches medicine names mentioned in the message against the
`Medicine` table, then either describes one medicine or checks the pair for a
known/predicted interaction (reusing `apps.interactions`). Good enough for a
useful answer without adding a new ML dependency.
"""
import re

from apps.interactions import ddi
from apps.interactions.models import DrugInteraction
from apps.medicines.models import Medicine

GREETING_RE = re.compile(r"^\s*(hi|hello|hey)\b", re.IGNORECASE)
DISCLAIMER = "This is general information, not medical advice — confirm with your doctor or pharmacist."


def _find_medicines(message: str) -> list[Medicine]:
    found = []
    seen_ids = set()
    candidates = sorted(
        Medicine.objects.only("id", "name", "generic_name", "smiles"),
        key=lambda m: len(m.name),
        reverse=True,
    )
    for med in candidates:
        for term in filter(None, [med.name, med.generic_name]):
            if re.search(rf"\b{re.escape(term)}\b", message, re.IGNORECASE):
                if med.id not in seen_ids:
                    found.append(med)
                    seen_ids.add(med.id)
                break
    return found


def _describe(medicine: Medicine) -> str:
    parts = [f"{medicine.name} ({medicine.generic_name or 'generic name unknown'})."]
    if medicine.how_it_works:
        parts.append(medicine.how_it_works)
    if medicine.uses:
        parts.append("Used for: " + ", ".join(medicine.uses[:3]) + ".")
    if medicine.side_effects:
        parts.append("Common side effects: " + ", ".join(medicine.side_effects[:3]) + ".")
    if medicine.rx_required:
        parts.append("Prescription required.")
    return " ".join(parts)


def _describe_interaction(a: Medicine, b: Medicine) -> str:
    known = DrugInteraction.objects.filter(medicine_a=a, medicine_b=b).first() or (
        DrugInteraction.objects.filter(medicine_a=b, medicine_b=a).first()
    )
    if known:
        return (
            f"{a.name} + {b.name}: {known.get_severity_display()} interaction. "
            f"{known.description or known.title}".strip()
        )

    prob = ddi.predict(a.smiles, b.smiles) if a.smiles and b.smiles else None
    if prob is not None:
        severity = ddi.severity_from_prob(prob)
        return (
            f"{a.name} + {b.name}: our model estimates a {severity} interaction risk "
            f"({round(prob * 100)}% probability). No entry in our known-interactions table yet."
        )

    return (
        f"No known interaction found between {a.name} and {b.name} in our records. "
        "Still, always check with your pharmacist before combining medicines."
    )


def answer(message: str) -> str:
    medicines = _find_medicines(message)

    if len(medicines) >= 2:
        reply = _describe_interaction(medicines[0], medicines[1])
    elif len(medicines) == 1:
        reply = _describe(medicines[0])
    elif GREETING_RE.match(message):
        return (
            'Hi! Ask me about a medicine (e.g. "What is Glycomet for?") or check an '
            'interaction (e.g. "Can I take Pan 40 with Glycomet?").'
        )
    else:
        reply = (
            "I couldn't find a medicine name I recognize in your message. "
            "Try naming a specific medicine from our catalog, e.g. "
            '"What are the side effects of Atorva 10?"'
        )

    return f"{reply} {DISCLAIMER}"
