"""Rule-based assistant — answers from the medicine catalog plus a small set of
general-health topic templates.

No LLM call: it first matches medicine names against the `Medicine` table
(description or pairwise interaction, reusing `apps.interactions`), then falls
back to keyword-matched general-health guidance (symptoms, first aid,
wellness) so it isn't limited to only questions naming a catalog medicine.
"""
import re

from apps.interactions import ddi
from apps.interactions.models import DrugInteraction
from apps.medicines.models import Medicine

GREETING_RE = re.compile(r"^\s*(hi|hello|hey)\b", re.IGNORECASE)
DISCLAIMER = "This is general information, not medical advice — confirm with your doctor or pharmacist."

# Keyword-matched general-health topics — a fallback tier for questions that
# don't name a catalog medicine. Order matters: first match wins, so more
# specific keywords should come before broader ones.
HEALTH_TOPICS: list[tuple[list[str], str]] = [
    (
        ["headache", "migraine"],
        "For an occasional headache: rest in a dim, quiet room, stay hydrated, and "
        "an OTC pain reliever (e.g. paracetamol) can help. See a doctor if it's "
        "severe, sudden ('worst headache of your life'), comes with fever/stiff neck, "
        "or happens frequently.",
    ),
    (
        ["fever", "temperature"],
        "For a mild fever: rest, drink fluids, and dress lightly. Paracetamol can "
        "reduce discomfort. See a doctor if fever is above 39.4°C (103°F), lasts "
        "more than 3 days, or comes with severe symptoms (rash, difficulty breathing, "
        "confusion).",
    ),
    (
        ["cold", "flu", "runny nose", "congestion"],
        "For a cold/flu: rest, fluids, and steam inhalation can ease congestion. "
        "OTC decongestants or antihistamines may help symptoms. See a doctor if "
        "symptoms last beyond 10 days or worsen suddenly.",
    ),
    (
        ["cough"],
        "For a cough: warm fluids, honey (not for infants under 1), and staying "
        "hydrated can help. See a doctor if it lasts more than 2-3 weeks, brings up "
        "blood, or comes with chest pain or breathlessness.",
    ),
    (
        ["sore throat"],
        "For a sore throat: warm salt-water gargles, warm fluids, and lozenges can "
        "help. See a doctor if it's severe, lasts more than a week, or comes with "
        "high fever or difficulty swallowing.",
    ),
    (
        ["stomach ache", "stomach pain", "indigestion", "acidity"],
        "For mild stomach discomfort or indigestion: smaller meals, avoiding "
        "spicy/fatty food, and staying upright after eating can help. See a doctor "
        "for severe, persistent, or worsening pain, or if it comes with vomiting "
        "blood or black stools.",
    ),
    (
        ["diarrhea", "diarrhoea", "loose motion"],
        "For diarrhea: stay hydrated (oral rehydration solution is ideal), eat "
        "bland food (rice, banana, toast), and avoid dairy/caffeine. See a doctor "
        "if it lasts more than 2 days, or comes with high fever, severe pain, or "
        "signs of dehydration.",
    ),
    (
        ["constipation"],
        "For constipation: more fiber, water, and physical activity usually help. "
        "See a doctor if it lasts more than a couple of weeks or comes with "
        "severe pain, blood in stool, or unexplained weight loss.",
    ),
    (
        ["allergy", "allergic", "rash", "itching"],
        "For a mild allergic reaction or rash: an antihistamine and avoiding the "
        "trigger can help. Seek emergency care immediately for swelling of the "
        "face/throat, difficulty breathing, or dizziness — that can be anaphylaxis.",
    ),
    (
        ["cut", "wound", "bleeding"],
        "For a minor cut: clean with water, apply gentle pressure with a clean "
        "cloth to stop bleeding, then cover with a sterile bandage. Seek medical "
        "care for deep wounds, heavy bleeding that won't stop, or signs of infection.",
    ),
    (
        ["burn"],
        "For a minor burn: cool it under running water for 10-20 minutes, don't "
        "apply ice or butter, and cover loosely with a clean, non-stick dressing. "
        "Seek medical care for large, deep, or blistering burns, or burns on the "
        "face/hands/genitals.",
    ),
    (
        ["sleep", "insomnia"],
        "For better sleep: keep a consistent sleep schedule, limit screens/caffeine "
        "before bed, and keep the room dark and cool. See a doctor if poor sleep "
        "persists for weeks or affects daily functioning.",
    ),
    (
        ["hydration", "water intake", "dehydration", "dehydrated"],
        "Most adults should aim for roughly 2-3 liters of fluids a day, more in "
        "hot weather or with exercise. Signs of dehydration include dark urine, "
        "dizziness, and dry mouth.",
    ),
    (
        ["exercise", "fitness", "workout"],
        "General guidance is about 150 minutes of moderate exercise a week, plus "
        "strength training twice a week. Start gradually if you're new to it, and "
        "check with a doctor first if you have an existing heart or joint condition.",
    ),
    (
        ["stress", "anxiety", "anxious"],
        "For everyday stress: regular exercise, sleep, and relaxation techniques "
        "(deep breathing, short breaks) can help. If anxiety is persistent, "
        "overwhelming, or affecting daily life, it's worth speaking to a doctor or "
        "mental health professional.",
    ),
    (
        ["diet", "nutrition", "weight loss", "weight gain"],
        "General nutrition guidance: balanced meals with vegetables, whole grains, "
        "and lean protein, controlled portions, and limiting processed sugar. For a "
        "specific weight or medical goal, a doctor or dietitian can personalize this.",
    ),
    (
        ["blood pressure", "hypertension", "bp"],
        "General blood pressure guidance: reduce salt intake, stay active, maintain "
        "a healthy weight, and limit alcohol. If you're on medication or have been "
        "diagnosed with hypertension, follow your doctor's specific plan.",
    ),
    (
        ["diabetes", "blood sugar", "sugar level"],
        "General blood sugar guidance: consistent meal timing, limiting refined "
        "sugar/carbs, and regular activity all help. If you have diagnosed diabetes, "
        "follow your doctor's monitoring and medication plan rather than general tips.",
    ),
]


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


def _find_health_topic(message: str) -> str | None:
    for keywords, response in HEALTH_TOPICS:
        for kw in keywords:
            if re.search(rf"\b{re.escape(kw)}\b", message, re.IGNORECASE):
                return response
    return None


def answer(message: str) -> str:
    medicines = _find_medicines(message)

    if len(medicines) >= 2:
        reply = _describe_interaction(medicines[0], medicines[1])
    elif len(medicines) == 1:
        reply = _describe(medicines[0])
    else:
        topic_reply = _find_health_topic(message)
        if topic_reply:
            reply = topic_reply
        elif GREETING_RE.match(message):
            return (
                'Hi! Ask me about a medicine (e.g. "What is Glycomet for?"), a symptom '
                '(e.g. "I have a headache"), or check an interaction (e.g. "Can I take '
                'Pan 40 with Glycomet?").'
            )
        else:
            reply = (
                "I couldn't match that to a medicine or a common symptom I know about. "
                'Try naming a specific medicine (e.g. "What are the side effects of '
                'Atorva 10?") or a symptom (e.g. "I have a sore throat").'
            )

    return f"{reply} {DISCLAIMER}"
