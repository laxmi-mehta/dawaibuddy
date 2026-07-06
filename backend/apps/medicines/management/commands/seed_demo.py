"""Seed demo medicines, generic alternatives and drug interactions.

Idempotent — safe to run multiple times. Usage: ``python manage.py seed_demo``.
"""
from django.core.management.base import BaseCommand

from apps.interactions.models import DrugInteraction
from apps.medicines.models import GenericAlternative, Medicine
from apps.medicines.smiles_data import lookup_smiles

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
    # More real medicines (valid SMILES) for interaction-checker testing.
    {"name": "Dolo 650", "generic_name": "Paracetamol", "manufacturer": "Micro Labs", "form": "Tablet", "strength": "650 mg", "category": "Analgesic", "rx_required": False, "price": "31.00", "smiles": "CC(=O)Nc1ccc(O)cc1"},
    {"name": "Brufen 400", "generic_name": "Ibuprofen", "manufacturer": "Abbott", "form": "Tablet", "strength": "400 mg", "category": "NSAID", "rx_required": False, "price": "28.00", "smiles": "CC(C)Cc1ccc(cc1)C(C)C(=O)O"},
    {"name": "Ecosprin 75", "generic_name": "Aspirin", "manufacturer": "USV", "form": "Tablet", "strength": "75 mg", "category": "Antiplatelet", "rx_required": False, "price": "10.00", "smiles": "CC(=O)Oc1ccccc1C(=O)O"},
    {"name": "Omez", "generic_name": "Omeprazole", "manufacturer": "Dr. Reddy's", "form": "Capsule", "strength": "20 mg", "category": "Acid reducer", "rx_required": False, "price": "58.00", "smiles": "COc1ccc2[nH]c(S(=O)Cc3ncc(C)c(OC)c3C)nc2c1"},
    {"name": "Ciplox 500", "generic_name": "Ciprofloxacin", "manufacturer": "Cipla", "form": "Tablet", "strength": "500 mg", "category": "Antibiotic", "rx_required": True, "price": "72.00", "smiles": "OC(=O)C1=CN(C2CC2)c2cc(N3CCNCC3)c(F)cc2C1=O"},
    {"name": "Losar 50", "generic_name": "Losartan", "manufacturer": "Unichem", "form": "Tablet", "strength": "50 mg", "category": "Anti-hypertensive", "rx_required": True, "price": "45.00", "smiles": "CCCCc1nc(Cl)c(CO)n1Cc1ccc(-c2ccccc2-c2nnn[nH]2)cc1"},
    {"name": "Metolar 50", "generic_name": "Metoprolol", "manufacturer": "Cipla", "form": "Tablet", "strength": "50 mg", "category": "Beta-blocker", "rx_required": True, "price": "40.00", "smiles": "CC(C)NCC(O)COc1ccc(CCOC)cc1"},
    {"name": "Mox 500", "generic_name": "Amoxicillin", "manufacturer": "Sun Pharma", "form": "Capsule", "strength": "500 mg", "category": "Antibiotic", "rx_required": True, "price": "65.00", "smiles": "CC1(C)SC2C(NC(=O)C(N)c3ccc(O)cc3)C(=O)N2C1C(=O)O"},
    {"name": "Voveran 50", "generic_name": "Diclofenac", "manufacturer": "Novartis", "form": "Tablet", "strength": "50 mg", "category": "NSAID", "rx_required": True, "price": "22.00", "smiles": "OC(=O)Cc1ccccc1Nc1c(Cl)cccc1Cl"},
    {"name": "Deplatt 75", "generic_name": "Clopidogrel", "manufacturer": "Torrent", "form": "Tablet", "strength": "75 mg", "category": "Antiplatelet", "rx_required": True, "price": "88.00", "smiles": "COC(=O)C(c1ccccc1Cl)N1CCc2sccc2C1"},
    {"name": "Lasix 40", "generic_name": "Furosemide", "manufacturer": "Sanofi", "form": "Tablet", "strength": "40 mg", "category": "Diuretic", "rx_required": True, "price": "18.00", "smiles": "NS(=O)(=O)c1cc(C(=O)O)c(NCc2ccco2)cc1Cl"},
    {"name": "Gabapin 300", "generic_name": "Gabapentin", "manufacturer": "Intas", "form": "Capsule", "strength": "300 mg", "category": "Anticonvulsant", "rx_required": True, "price": "96.00", "smiles": "OC(=O)CC1(CN)CCCCC1"},
    {"name": "Asthalin", "generic_name": "Salbutamol", "manufacturer": "Cipla", "form": "Inhaler", "strength": "100 mcg", "category": "Bronchodilator", "rx_required": True, "price": "130.00", "smiles": "CC(C)(C)NCC(O)c1ccc(O)c(CO)c1"},
    {"name": "Warf 5", "generic_name": "Warfarin", "manufacturer": "Cipla", "form": "Tablet", "strength": "5 mg", "category": "Anticoagulant", "rx_required": True, "price": "42.00", "smiles": "CC(=O)CC(c1ccccc1)c1c(O)c2ccccc2oc1=O"},
]

INTERACTIONS = [
    ("Atorva 10", "Azithral 500", "moderate", "Possible muscle-related effects",
     "Azithromycin may raise the risk of statin-related muscle pain (myopathy). Watch for unexplained muscle aches and tell your doctor."),
    ("Atorva 10", "Amlong 5", "mild", "Minor — monitor",
     "Amlodipine can slightly increase atorvastatin levels. Usually fine at standard doses; report muscle pain."),
    ("Azithral 500", "Amlong 5", "moderate", "Heart-rhythm caution",
     "Combination may affect heart rhythm (QT) in susceptible people. Mention any palpitations or dizziness."),
    ("Ecosprin 75", "Warf 5", "severe", "High bleeding risk",
     "Aspirin with warfarin greatly increases bleeding risk. Use only under close medical supervision."),
    ("Warf 5", "Voveran 50", "severe", "Bleeding risk",
     "NSAIDs like diclofenac raise the risk of bleeding when combined with warfarin."),
    ("Ecosprin 75", "Brufen 400", "moderate", "Reduced antiplatelet effect",
     "Ibuprofen can blunt aspirin's heart-protective effect. Separate the doses or ask your doctor."),
    ("Deplatt 75", "Omez", "moderate", "Reduced clopidogrel effect",
     "Omeprazole may lower how well clopidogrel works. A different acid reducer may be preferred."),
    ("Lasix 40", "Voveran 50", "moderate", "Reduced diuretic effect",
     "NSAIDs can weaken furosemide and affect kidney function. Monitor if used together."),
]


class Command(BaseCommand):
    help = "Seed demo medicines, alternatives and interactions."

    def handle(self, *args, **options):
        index = {}
        for data in MEDICINES:
            alternatives = data.pop("alternatives", [])
            data.setdefault("smiles", lookup_smiles(data.get("generic_name", "")))
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
