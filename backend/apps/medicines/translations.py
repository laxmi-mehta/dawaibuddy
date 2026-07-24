"""Static hi/mr translations for the closed-vocabulary Medicine.category / .form labels.

Category and form values repeat across many medicines, so they're translated once
here rather than as a per-record DB column. Unknown values fall back to English.
"""

CATEGORY_TRANSLATIONS = {
    "Anti-diabetic": {"hi": "मधुमेह-रोधी", "mr": "मधुमेह-विरोधी"},
    "Anti-hypertensive": {"hi": "उच्च रक्तचाप-रोधी", "mr": "उच्च रक्तदाब-विरोधी"},
    "Lipid-lowering": {"hi": "लिपिड-कम करने वाली", "mr": "लिपिड-कमी करणारी"},
    "Acid reducer": {"hi": "एसिड कम करने वाली", "mr": "आम्ल कमी करणारी"},
    "Antibiotic": {"hi": "एंटीबायोटिक", "mr": "प्रतिजैविक"},
    "Anti-allergic": {"hi": "एलर्जी-रोधी", "mr": "ऍलर्जी-विरोधी"},
    "Analgesic": {"hi": "दर्द निवारक", "mr": "वेदनाशामक"},
    "NSAID": {"hi": "एनएसएआईडी (सूजन-रोधी)", "mr": "एनएसएआयडी (दाहशामक)"},
    "Antiplatelet": {"hi": "एंटीप्लेटलेट", "mr": "प्रतिप्लेटलेट"},
    "Anticonvulsant": {"hi": "मिर्गी-रोधी", "mr": "फेफरे-विरोधी"},
    "Diuretic": {"hi": "मूत्रवर्धक", "mr": "लघवीचे प्रमाण वाढवणारे"},
    "Beta-blocker": {"hi": "बीटा-ब्लॉकर", "mr": "बीटा-ब्लॉकर"},
    "Bronchodilator": {"hi": "श्वसनी-विस्तारक", "mr": "श्वासनलिका-विस्तारक"},
    "Anticoagulant": {"hi": "रक्त पतला करने वाली", "mr": "रक्त पातळ करणारी"},
}

FORM_TRANSLATIONS = {
    "Tablet": {"hi": "टैबलेट", "mr": "गोळी"},
    "Tablet (SR)": {"hi": "टैबलेट (एसआर)", "mr": "गोळी (एसआर)"},
    "Capsule": {"hi": "कैप्सूल", "mr": "कॅप्सूल"},
    "Inhaler": {"hi": "इनहेलर", "mr": "इनहेलर"},
}


def translate_category(value: str, language: str) -> str:
    return CATEGORY_TRANSLATIONS.get(value, {}).get(language) or value


def translate_form(value: str, language: str) -> str:
    return FORM_TRANSLATIONS.get(value, {}).get(language) or value
