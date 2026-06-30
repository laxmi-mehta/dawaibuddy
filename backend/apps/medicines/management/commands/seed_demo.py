"""Seed demo medicines, generic alternatives and drug interactions.

Idempotent — safe to run multiple times. Usage: ``python manage.py seed_demo``.
"""
from django.core.management.base import BaseCommand

from apps.interactions.models import DrugInteraction
from apps.medicines.models import GenericAlternative, Medicine

MEDICINES = [
    {
        "name": "Glycomet 500 SR",
        "generic_name": "Metformin",
        "manufacturer": "USV Pvt Ltd",
        "form": "Tablet (SR)",
        "strength": "500 mg",
        "category": "Anti-diabetic",
        "rx_required": True,
        "price": "42.00",
        "how_it_works": "Lowers glucose production in the liver and helps your body respond to insulin more effectively.",
        "uses": ["Type 2 diabetes mellitus", "Improves insulin sensitivity", "PCOS (off-label)"],
        "side_effects": ["Nausea or upset stomach", "Metallic taste", "Low vitamin B12 over long-term use"],
        "warnings": ["Tell your doctor about kidney issues", "Avoid excess alcohol", "Pause before contrast scans"],
        "alternatives": [
            {"name": "Metformin (generic)", "manufacturer": "Generic", "price": "12.00", "save_percent": 71},
            {"name": "Okamet 500", "manufacturer": "Cipla", "price": "38.00", "save_percent": 10},
            {"name": "Glyciphage", "manufacturer": "Franco-Indian", "price": "35.00", "save_percent": 17},
        ],
    },
    {"name": "Amlong 5", "generic_name": "Amlodipine", "manufacturer": "Micro Labs", "form": "Tablet", "strength": "5 mg", "category": "Anti-hypertensive", "rx_required": True, "price": "28.00"},
    {"name": "Atorva 10", "generic_name": "Atorvastatin", "manufacturer": "Zydus", "form": "Tablet", "strength": "10 mg", "category": "Lipid-lowering", "rx_required": True, "price": "55.00"},
    {"name": "Pan 40", "generic_name": "Pantoprazole", "manufacturer": "Alkem", "form": "Tablet", "strength": "40 mg", "category": "Acid reducer", "rx_required": False, "price": "95.00"},
    {"name": "Azithral 500", "generic_name": "Azithromycin", "manufacturer": "Alembic", "form": "Tablet", "strength": "500 mg", "category": "Antibiotic", "rx_required": True, "price": "118.00"},
    {"name": "Cetzine 10", "generic_name": "Cetirizine", "manufacturer": "Dr. Reddy's", "form": "Tablet", "strength": "10 mg", "category": "Anti-allergic", "rx_required": False, "price": "30.00"},
]

INTERACTIONS = [
    ("Atorva 10", "Azithral 500", "moderate", "Possible muscle-related effects",
     "Azithromycin may raise the risk of statin-related muscle pain (myopathy). Watch for unexplained muscle aches and tell your doctor."),
    ("Atorva 10", "Amlong 5", "mild", "Minor — monitor",
     "Amlodipine can slightly increase atorvastatin levels. Usually fine at standard doses; report muscle pain."),
    ("Azithral 500", "Amlong 5", "moderate", "Heart-rhythm caution",
     "Combination may affect heart rhythm (QT) in susceptible people. Mention any palpitations or dizziness."),
]


class Command(BaseCommand):
    help = "Seed demo medicines, alternatives and interactions."

    def handle(self, *args, **options):
        index = {}
        for data in MEDICINES:
            alternatives = data.pop("alternatives", [])
            med, _ = Medicine.objects.update_or_create(name=data["name"], defaults=data)
            index[med.name] = med
            for alt in alternatives:
                GenericAlternative.objects.get_or_create(
                    medicine=med, name=alt["name"], defaults=alt
                )

        for a_name, b_name, severity, title, desc in INTERACTIONS:
            a, b = index.get(a_name), index.get(b_name)
            if a and b:
                DrugInteraction.objects.update_or_create(
                    medicine_a=a,
                    medicine_b=b,
                    defaults={"severity": severity, "title": title, "description": desc},
                )

        self.stdout.write(
            self.style.SUCCESS(
                f"Seeded {Medicine.objects.count()} medicines, "
                f"{GenericAlternative.objects.count()} alternatives, "
                f"{DrugInteraction.objects.count()} interactions."
            )
        )
