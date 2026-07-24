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
        "how_it_works_hi": "लीवर में ग्लूकोज़ उत्पादन को कम करता है और आपके शरीर को इंसुलिन के प्रति बेहतर प्रतिक्रिया देने में मदद करता है।",
        "uses_hi": ["टाइप 2 मधुमेह", "इंसुलिन संवेदनशीलता में सुधार", "PCOS (ऑफ-लेबल)"],
        "side_effects_hi": ["मतली या पेट खराब होना", "मुंह में धातु जैसा स्वाद", "लंबे समय तक उपयोग से विटामिन B12 की कमी"],
        "warnings_hi": ["अपने डॉक्टर को किडनी की समस्याओं के बारे में बताएं", "अधिक शराब से बचें", "कॉन्ट्रास्ट स्कैन से पहले रोकें"],
        "how_it_works_mr": "यकृतातील ग्लुकोज उत्पादन कमी करते आणि तुमच्या शरीराला इन्सुलिनला अधिक प्रभावीपणे प्रतिसाद देण्यास मदत करते.",
        "uses_mr": ["टाइप 2 मधुमेह", "इन्सुलिन संवेदनशीलता सुधारते", "PCOS (ऑफ-लेबल)"],
        "side_effects_mr": ["मळमळ किंवा पोट बिघडणे", "तोंडाला धातूसारखी चव", "दीर्घकाळ वापराने व्हिटॅमिन B12 ची कमतरता"],
        "warnings_mr": ["तुमच्या डॉक्टरांना किडनीच्या समस्यांबद्दल सांगा", "जास्त दारू टाळा", "कॉन्ट्रास्ट स्कॅनपूर्वी थांबा"],
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
    {
        "a": "Atorva 10", "b": "Azithral 500", "severity": "moderate",
        "title": "Possible muscle-related effects",
        "description": "Azithromycin may raise the risk of statin-related muscle pain (myopathy). Watch for unexplained muscle aches and tell your doctor.",
        "title_hi": "संभावित मांसपेशी-संबंधी प्रभाव",
        "description_hi": "एज़िथ्रोमाइसिन स्टैटिन-संबंधी मांसपेशी दर्द (मायोपैथी) के जोखिम को बढ़ा सकता है। अस्पष्टीकृत मांसपेशी दर्द पर ध्यान दें और अपने डॉक्टर को बताएं।",
        "title_mr": "संभाव्य स्नायू-संबंधित परिणाम",
        "description_mr": "अझिथ्रोमायसिन स्टॅटिन-संबंधित स्नायू दुखण्याचा (मायोपॅथी) धोका वाढवू शकते. अस्पष्ट स्नायू दुखण्याकडे लक्ष द्या आणि तुमच्या डॉक्टरांना सांगा.",
    },
    {
        "a": "Atorva 10", "b": "Amlong 5", "severity": "mild",
        "title": "Minor — monitor",
        "description": "Amlodipine can slightly increase atorvastatin levels. Usually fine at standard doses; report muscle pain.",
        "title_hi": "मामूली — निगरानी करें",
        "description_hi": "एम्लोडिपिन एटोरवास्टेटिन के स्तर को थोड़ा बढ़ा सकता है। सामान्य खुराक पर आमतौर पर ठीक है; मांसपेशी दर्द की सूचना दें।",
        "title_mr": "किरकोळ — लक्ष ठेवा",
        "description_mr": "अ‍ॅम्लोडिपिन अ‍ॅटोरवास्टॅटिनची पातळी थोडी वाढवू शकते. मानक डोसमध्ये सहसा ठीक असते; स्नायू दुखण्याची तक्रार करा.",
    },
    {
        "a": "Azithral 500", "b": "Amlong 5", "severity": "moderate",
        "title": "Heart-rhythm caution",
        "description": "Combination may affect heart rhythm (QT) in susceptible people. Mention any palpitations or dizziness.",
        "title_hi": "हृदय-लय सावधानी",
        "description_hi": "यह संयोजन संवेदनशील लोगों में हृदय की लय (QT) को प्रभावित कर सकता है। किसी भी धड़कन या चक्कर आने का उल्लेख करें।",
        "title_mr": "हृदय-तालाची काळजी",
        "description_mr": "हे संयोजन संवेदनशील लोकांमध्ये हृदयाच्या तालावर (QT) परिणाम करू शकते. कोणतीही धडधड किंवा चक्कर आल्यास नमूद करा.",
    },
    {
        "a": "Ecosprin 75", "b": "Warf 5", "severity": "severe",
        "title": "High bleeding risk",
        "description": "Aspirin with warfarin greatly increases bleeding risk. Use only under close medical supervision.",
        "title_hi": "उच्च रक्तस्राव जोखिम",
        "description_hi": "एस्पिरिन के साथ वारफारिन रक्तस्राव के जोखिम को बहुत बढ़ा देता है। केवल करीबी चिकित्सा निगरानी में उपयोग करें।",
        "title_mr": "उच्च रक्तस्रावाचा धोका",
        "description_mr": "अ‍ॅस्पिरिनसोबत वॉरफेरिन रक्तस्रावाचा धोका मोठ्या प्रमाणात वाढवते. फक्त जवळच्या वैद्यकीय देखरेखीखाली वापरा.",
    },
    {
        "a": "Warf 5", "b": "Voveran 50", "severity": "severe",
        "title": "Bleeding risk",
        "description": "NSAIDs like diclofenac raise the risk of bleeding when combined with warfarin.",
        "title_hi": "रक्तस्राव जोखिम",
        "description_hi": "डाइक्लोफेनाक जैसे NSAIDs वारफारिन के साथ मिलाने पर रक्तस्राव के जोखिम को बढ़ाते हैं।",
        "title_mr": "रक्तस्रावाचा धोका",
        "description_mr": "डायक्लोफेनाकसारखे NSAIDs वॉरफेरिनसोबत एकत्र केल्यास रक्तस्रावाचा धोका वाढवतात.",
    },
    {
        "a": "Ecosprin 75", "b": "Brufen 400", "severity": "moderate",
        "title": "Reduced antiplatelet effect",
        "description": "Ibuprofen can blunt aspirin's heart-protective effect. Separate the doses or ask your doctor.",
        "title_hi": "कम एंटीप्लेटलेट प्रभाव",
        "description_hi": "इबुप्रोफेन एस्पिरिन के हृदय-सुरक्षात्मक प्रभाव को कम कर सकता है। खुराकों को अलग करें या अपने डॉक्टर से पूछें।",
        "title_mr": "कमी अँटीप्लेटलेट परिणाम",
        "description_mr": "आयबुप्रोफेन अ‍ॅस्पिरिनचा हृदय-संरक्षणात्मक परिणाम कमी करू शकते. डोस वेगळे करा किंवा तुमच्या डॉक्टरांना विचारा.",
    },
    {
        "a": "Deplatt 75", "b": "Omez", "severity": "moderate",
        "title": "Reduced clopidogrel effect",
        "description": "Omeprazole may lower how well clopidogrel works. A different acid reducer may be preferred.",
        "title_hi": "कम क्लोपिडोग्रेल प्रभाव",
        "description_hi": "ओमेप्राज़ोल क्लोपिडोग्रेल के काम करने के तरीके को कम कर सकता है। एक अलग एसिड कम करने वाली दवा बेहतर हो सकती है।",
        "title_mr": "कमी क्लोपिडोग्रेल परिणाम",
        "description_mr": "ओमेप्राझोल क्लोपिडोग्रेल किती चांगले काम करते हे कमी करू शकते. वेगळी आम्ल कमी करणारी औषध पसंत केली जाऊ शकते.",
    },
    {
        "a": "Lasix 40", "b": "Voveran 50", "severity": "moderate",
        "title": "Reduced diuretic effect",
        "description": "NSAIDs can weaken furosemide and affect kidney function. Monitor if used together.",
        "title_hi": "कम मूत्रवर्धक प्रभाव",
        "description_hi": "NSAIDs फ्यूरोसेमाइड को कमज़ोर कर सकते हैं और किडनी के कार्य को प्रभावित कर सकते हैं। साथ उपयोग करने पर निगरानी रखें।",
        "title_mr": "कमी लघवीचे प्रमाण वाढवणारा परिणाम",
        "description_mr": "NSAIDs फ्युरोसेमाइड कमकुवत करू शकतात आणि किडनीच्या कार्यावर परिणाम करू शकतात. एकत्र वापरल्यास लक्ष ठेवा.",
    },
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

        for item in INTERACTIONS:
            a, b = index.get(item["a"]), index.get(item["b"])
            if a and b:
                DrugInteraction.objects.update_or_create(
                    medicine_a=a,
                    medicine_b=b,
                    defaults={
                        "severity": item["severity"],
                        "title": item["title"],
                        "description": item["description"],
                        "title_hi": item["title_hi"],
                        "description_hi": item["description_hi"],
                        "title_mr": item["title_mr"],
                        "description_mr": item["description_mr"],
                    },
                )

        self.stdout.write(
            self.style.SUCCESS(
                f"Seeded {Medicine.objects.count()} medicines, "
                f"{GenericAlternative.objects.count()} alternatives, "
                f"{DrugInteraction.objects.count()} interactions."
            )
        )
