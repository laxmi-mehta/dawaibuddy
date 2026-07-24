"""Rule-based assistant — answers from the medicine catalog plus a small set of
general-health topic templates.

No LLM call: it first matches medicine names against the `Medicine` table
(description or pairwise interaction, reusing `apps.interactions`), then falls
back to keyword-matched general-health guidance (symptoms, first aid,
wellness) so it isn't limited to only questions naming a catalog medicine.

Every reply is available in English, Hindi and Marathi — `language` threads
through from the request (see `apps.ai_assistant.views.AskView`).
"""
import re

from apps.common.i18n import SUPPORTED_LANGUAGES, localized_field
from apps.interactions import ddi
from apps.interactions.models import DrugInteraction
from apps.medicines.models import Medicine

GREETING_RE = re.compile(r"^\s*(hi|hello|hey)\b", re.IGNORECASE)

DISCLAIMER = {
    "en": "This is general information, not medical advice — confirm with your doctor or pharmacist.",
    "hi": "यह सामान्य जानकारी है, चिकित्सा सलाह नहीं — अपने डॉक्टर या फार्मासिस्ट से पुष्टि करें।",
    "mr": "ही सर्वसाधारण माहिती आहे, वैद्यकीय सल्ला नाही — तुमच्या डॉक्टर किंवा फार्मासिस्टकडून पुष्टी करा.",
}

GREETING_REPLY = {
    "en": (
        'Hi! Ask me about a medicine (e.g. "What is Glycomet for?"), a symptom '
        '(e.g. "I have a headache"), or check an interaction (e.g. "Can I take '
        'Pan 40 with Glycomet?").'
    ),
    "hi": (
        'नमस्ते! मुझसे किसी दवा के बारे में पूछें (जैसे "Glycomet किसलिए है?"), किसी लक्षण के बारे में '
        '(जैसे "मुझे सिरदर्द है"), या इंटरैक्शन जांचें (जैसे "क्या मैं Pan 40 को Glycomet के साथ ले सकता हूं?")।'
    ),
    "mr": (
        'नमस्कार! मला एखाद्या औषधाबद्दल विचारा (उदा. "Glycomet कशासाठी आहे?"), एखाद्या लक्षणाबद्दल '
        '(उदा. "मला डोकेदुखी आहे"), किंवा परस्परसंवाद तपासा (उदा. "मी Pan 40 सोबत Glycomet घेऊ शकतो का?").'
    ),
}

FALLBACK_REPLY = {
    "en": (
        "I couldn't match that to a medicine or a common symptom I know about. "
        'Try naming a specific medicine (e.g. "What are the side effects of '
        'Atorva 10?") or a symptom (e.g. "I have a sore throat").'
    ),
    "hi": (
        "मैं इसे किसी दवा या सामान्य लक्षण से मिला नहीं सका। किसी विशिष्ट दवा का नाम लेकर देखें "
        '(जैसे "Atorva 10 के साइड इफेक्ट्स क्या हैं?") या कोई लक्षण बताएं (जैसे "मुझे गले में खराश है")।'
    ),
    "mr": (
        "मला हे कोणत्याही औषधाशी किंवा सामान्य लक्षणाशी जुळवता आले नाही. एखाद्या विशिष्ट औषधाचे नाव "
        'सांगून पहा (उदा. "Atorva 10 चे दुष्परिणाम काय आहेत?") किंवा लक्षण सांगा (उदा. "मला घसा खवखवत आहे").'
    ),
}

# Connector phrases used when assembling a medicine description.
GENERIC_NAME_UNKNOWN = {"en": "generic name unknown", "hi": "जेनेरिक नाम अज्ञात", "mr": "जेनेरिक नाव अज्ञात"}
USED_FOR = {"en": "Used for", "hi": "उपयोग", "mr": "उपयोग"}
COMMON_SIDE_EFFECTS = {"en": "Common side effects", "hi": "सामान्य साइड इफेक्ट्स", "mr": "सामान्य दुष्परिणाम"}
PRESCRIPTION_REQUIRED = {
    "en": "Prescription required.",
    "hi": "प्रिस्क्रिप्शन आवश्यक है।",
    "mr": "प्रिस्क्रिप्शन आवश्यक आहे.",
}
SEVERITY_LABELS = {
    "none": {"en": "No interaction", "hi": "कोई इंटरैक्शन नहीं", "mr": "कोणताही परस्परसंवाद नाही"},
    "mild": {"en": "Mild", "hi": "हल्का", "mr": "सौम्य"},
    "moderate": {"en": "Moderate", "hi": "मध्यम", "mr": "मध्यम"},
    "severe": {"en": "Severe", "hi": "गंभीर", "mr": "गंभीर"},
}

# Keyword-matched general-health topics — a fallback tier for questions that
# don't name a catalog medicine. Order matters: first match wins, so more
# specific keywords should come before broader ones. Keywords stay
# English-only (users type symptoms in English regardless of UI language,
# same as medicine names) — only the reply text is translated.
HEALTH_TOPICS: list[tuple[list[str], dict[str, str]]] = [
    (
        ["headache", "migraine"],
        {
            "en": (
                "For an occasional headache: rest in a dim, quiet room, stay hydrated, and "
                "an OTC pain reliever (e.g. paracetamol) can help. See a doctor if it's "
                "severe, sudden ('worst headache of your life'), comes with fever/stiff neck, "
                "or happens frequently."
            ),
            "hi": (
                "कभी-कभार सिरदर्द के लिए: किसी शांत, मंद रोशनी वाले कमरे में आराम करें, पर्याप्त पानी पिएं, "
                "और एक ओटीसी दर्द निवारक (जैसे पैरासिटामोल) मदद कर सकता है। यदि यह गंभीर, अचानक "
                "('जीवन का सबसे भयंकर सिरदर्द'), बुखार/गर्दन में अकड़न के साथ हो, या बार-बार होता है तो डॉक्टर से मिलें।"
            ),
            "mr": (
                "अधूनमधून होणाऱ्या डोकेदुखीसाठी: शांत, मंद प्रकाश असलेल्या खोलीत आराम करा, पुरेसे पाणी प्या, "
                "आणि ओटीसी वेदनाशामक (उदा. पॅरासिटामॉल) मदत करू शकते. जर ते तीव्र, अचानक "
                "('आयुष्यातील सर्वात भयंकर डोकेदुखी'), ताप/मान आखडण्यासह असेल, किंवा वारंवार होत असेल तर डॉक्टरांना भेटा."
            ),
        },
    ),
    (
        ["fever", "temperature"],
        {
            "en": (
                "For a mild fever: rest, drink fluids, and dress lightly. Paracetamol can "
                "reduce discomfort. See a doctor if fever is above 39.4°C (103°F), lasts "
                "more than 3 days, or comes with severe symptoms (rash, difficulty breathing, "
                "confusion)."
            ),
            "hi": (
                "हल्के बुखार के लिए: आराम करें, तरल पदार्थ पिएं, और हल्के कपड़े पहनें। पैरासिटामोल असुविधा "
                "कम कर सकता है। यदि बुखार 39.4°C (103°F) से अधिक है, 3 दिनों से अधिक रहता है, या गंभीर लक्षणों "
                "(चकत्ते, सांस लेने में कठिनाई, भ्रम) के साथ है तो डॉक्टर से मिलें।"
            ),
            "mr": (
                "सौम्य तापासाठी: आराम करा, द्रव पदार्थ प्या, आणि हलके कपडे घाला. पॅरासिटामॉल त्रास कमी करू शकते. "
                "जर ताप 39.4°C (103°F) पेक्षा जास्त असेल, 3 दिवसांपेक्षा जास्त काळ राहिला, किंवा गंभीर लक्षणांसह "
                "(पुरळ, श्वास घेण्यास त्रास, गोंधळ) असेल तर डॉक्टरांना भेटा."
            ),
        },
    ),
    (
        ["cold", "flu", "runny nose", "congestion"],
        {
            "en": (
                "For a cold/flu: rest, fluids, and steam inhalation can ease congestion. "
                "OTC decongestants or antihistamines may help symptoms. See a doctor if "
                "symptoms last beyond 10 days or worsen suddenly."
            ),
            "hi": (
                "सर्दी/फ्लू के लिए: आराम, तरल पदार्थ, और भाप लेने से जमाव कम हो सकता है। ओटीसी डिकंजेस्टेंट या "
                "एंटीहिस्टामाइन लक्षणों में मदद कर सकते हैं। यदि लक्षण 10 दिनों से अधिक रहते हैं या अचानक बिगड़ते हैं तो डॉक्टर से मिलें।"
            ),
            "mr": (
                "सर्दी/फ्लूसाठी: आराम, द्रव पदार्थ, आणि वाफ घेतल्याने गर्दी कमी होऊ शकते. ओटीसी डिकंजेस्टंट किंवा "
                "अँटीहिस्टामाइन लक्षणांमध्ये मदत करू शकतात. जर लक्षणे 10 दिवसांपेक्षा जास्त राहिली किंवा अचानक बिघडली तर डॉक्टरांना भेटा."
            ),
        },
    ),
    (
        ["cough"],
        {
            "en": (
                "For a cough: warm fluids, honey (not for infants under 1), and staying "
                "hydrated can help. See a doctor if it lasts more than 2-3 weeks, brings up "
                "blood, or comes with chest pain or breathlessness."
            ),
            "hi": (
                "खांसी के लिए: गर्म तरल पदार्थ, शहद (1 वर्ष से कम उम्र के शिशुओं के लिए नहीं), और पर्याप्त पानी "
                "पीना मदद कर सकता है। यदि यह 2-3 सप्ताह से अधिक रहती है, खून आता है, या सीने में दर्द या सांस "
                "फूलने के साथ है तो डॉक्टर से मिलें।"
            ),
            "mr": (
                "खोकल्यासाठी: गरम द्रव पदार्थ, मध (1 वर्षाखालील बाळांसाठी नाही), आणि पुरेसे पाणी पिणे मदत करू शकते. "
                "जर तो 2-3 आठवड्यांपेक्षा जास्त राहिला, रक्त येत असेल, किंवा छातीत दुखणे किंवा श्वास घेण्यास त्रास "
                "होत असेल तर डॉक्टरांना भेटा."
            ),
        },
    ),
    (
        ["sore throat"],
        {
            "en": (
                "For a sore throat: warm salt-water gargles, warm fluids, and lozenges can "
                "help. See a doctor if it's severe, lasts more than a week, or comes with "
                "high fever or difficulty swallowing."
            ),
            "hi": (
                "गले की खराश के लिए: गर्म नमक-पानी से गरारे, गर्म तरल पदार्थ, और लोज़ेंज मदद कर सकते हैं। "
                "यदि यह गंभीर है, एक सप्ताह से अधिक रहती है, या तेज़ बुखार या निगलने में कठिनाई के साथ है तो डॉक्टर से मिलें।"
            ),
            "mr": (
                "घसा खवखवण्यासाठी: कोमट मीठ-पाण्याने गुळण्या, कोमट द्रव पदार्थ, आणि लोझेंज मदत करू शकतात. "
                "जर ते तीव्र असेल, आठवड्यापेक्षा जास्त राहिले, किंवा तीव्र ताप किंवा गिळण्यास त्रास होत असेल तर डॉक्टरांना भेटा."
            ),
        },
    ),
    (
        ["stomach ache", "stomach pain", "indigestion", "acidity"],
        {
            "en": (
                "For mild stomach discomfort or indigestion: smaller meals, avoiding "
                "spicy/fatty food, and staying upright after eating can help. See a doctor "
                "for severe, persistent, or worsening pain, or if it comes with vomiting "
                "blood or black stools."
            ),
            "hi": (
                "हल्के पेट दर्द या अपच के लिए: छोटे भोजन, मसालेदार/वसायुक्त भोजन से बचना, और खाने के बाद सीधे "
                "रहना मदद कर सकता है। गंभीर, लगातार, या बिगड़ते दर्द के लिए, या यदि उल्टी में खून या काला मल आता है तो डॉक्टर से मिलें।"
            ),
            "mr": (
                "सौम्य पोटदुखी किंवा अपचनासाठी: लहान जेवण, तिखट/तेलकट अन्न टाळणे, आणि जेवणानंतर ताठ बसणे मदत "
                "करू शकते. तीव्र, सतत, किंवा वाढत जाणाऱ्या वेदनांसाठी, किंवा उलटीत रक्त किंवा काळी विष्ठा असल्यास डॉक्टरांना भेटा."
            ),
        },
    ),
    (
        ["diarrhea", "diarrhoea", "loose motion"],
        {
            "en": (
                "For diarrhea: stay hydrated (oral rehydration solution is ideal), eat "
                "bland food (rice, banana, toast), and avoid dairy/caffeine. See a doctor "
                "if it lasts more than 2 days, or comes with high fever, severe pain, or "
                "signs of dehydration."
            ),
            "hi": (
                "दस्त के लिए: पर्याप्त पानी पिएं (ओरल रिहाइड्रेशन सॉल्यूशन आदर्श है), सादा भोजन करें (चावल, केला, "
                "टोस्ट), और डेयरी/कैफीन से बचें। यदि यह 2 दिनों से अधिक रहता है, या तेज़ बुखार, गंभीर दर्द, या "
                "डिहाइड्रेशन के लक्षणों के साथ है तो डॉक्टर से मिलें।"
            ),
            "mr": (
                "जुलाबासाठी: पुरेसे पाणी प्या (ओरल रिहायड्रेशन सोल्यूशन आदर्श आहे), साधे अन्न खा (भात, केळे, "
                "टोस्ट), आणि दुग्धजन्य पदार्थ/कॅफिन टाळा. जर तो 2 दिवसांपेक्षा जास्त राहिला, किंवा तीव्र ताप, तीव्र "
                "वेदना, किंवा डिहायड्रेशनची लक्षणे असतील तर डॉक्टरांना भेटा."
            ),
        },
    ),
    (
        ["constipation"],
        {
            "en": (
                "For constipation: more fiber, water, and physical activity usually help. "
                "See a doctor if it lasts more than a couple of weeks or comes with "
                "severe pain, blood in stool, or unexplained weight loss."
            ),
            "hi": (
                "कब्ज के लिए: अधिक फाइबर, पानी, और शारीरिक गतिविधि आमतौर पर मदद करते हैं। यदि यह कुछ हफ्तों "
                "से अधिक रहती है या गंभीर दर्द, मल में खून, या अस्पष्टीकृत वज़न घटने के साथ है तो डॉक्टर से मिलें।"
            ),
            "mr": (
                "बद्धकोष्ठतेसाठी: अधिक फायबर, पाणी, आणि शारीरिक हालचाल सहसा मदत करतात. जर ती काही आठवड्यांपेक्षा "
                "जास्त राहिली किंवा तीव्र वेदना, विष्ठेत रक्त, किंवा अस्पष्ट वजन घट असेल तर डॉक्टरांना भेटा."
            ),
        },
    ),
    (
        ["allergy", "allergic", "rash", "itching"],
        {
            "en": (
                "For a mild allergic reaction or rash: an antihistamine and avoiding the "
                "trigger can help. Seek emergency care immediately for swelling of the "
                "face/throat, difficulty breathing, or dizziness — that can be anaphylaxis."
            ),
            "hi": (
                "हल्की एलर्जी प्रतिक्रिया या चकत्ते के लिए: एक एंटीहिस्टामाइन और ट्रिगर से बचना मदद कर सकता है। "
                "चेहरे/गले में सूजन, सांस लेने में कठिनाई, या चक्कर आने पर तुरंत आपातकालीन देखभाल लें — यह एनाफिलैक्सिस हो सकता है।"
            ),
            "mr": (
                "सौम्य ऍलर्जी प्रतिक्रिया किंवा पुरळसाठी: अँटीहिस्टामाइन आणि ट्रिगर टाळणे मदत करू शकते. चेहरा/घसा "
                "सुजणे, श्वास घेण्यास त्रास, किंवा चक्कर आल्यास ताबडतोब आपत्कालीन काळजी घ्या — हे अॅनाफिलॅक्सिस असू शकते."
            ),
        },
    ),
    (
        ["cut", "wound", "bleeding"],
        {
            "en": (
                "For a minor cut: clean with water, apply gentle pressure with a clean "
                "cloth to stop bleeding, then cover with a sterile bandage. Seek medical "
                "care for deep wounds, heavy bleeding that won't stop, or signs of infection."
            ),
            "hi": (
                "छोटे कट के लिए: पानी से साफ करें, खून रोकने के लिए साफ कपड़े से हल्का दबाव डालें, फिर एक "
                "स्टेराइल बैंडेज से ढकें। गहरे घावों, न रुकने वाले भारी रक्तस्राव, या संक्रमण के लक्षणों के लिए चिकित्सा सहायता लें।"
            ),
            "mr": (
                "लहान जखमेसाठी: पाण्याने स्वच्छ करा, रक्तस्राव थांबवण्यासाठी स्वच्छ कापडाने हलका दाब द्या, नंतर "
                "निर्जंतुक पट्टीने झाका. खोल जखमा, न थांबणारा जास्त रक्तस्राव, किंवा संसर्गाच्या लक्षणांसाठी वैद्यकीय मदत घ्या."
            ),
        },
    ),
    (
        ["burn"],
        {
            "en": (
                "For a minor burn: cool it under running water for 10-20 minutes, don't "
                "apply ice or butter, and cover loosely with a clean, non-stick dressing. "
                "Seek medical care for large, deep, or blistering burns, or burns on the "
                "face/hands/genitals."
            ),
            "hi": (
                "छोटी जलन के लिए: 10-20 मिनट तक बहते पानी के नीचे ठंडा करें, बर्फ या मक्खन न लगाएं, और साफ, "
                "नॉन-स्टिक ड्रेसिंग से ढीला ढकें। बड़ी, गहरी, या फफोले वाली जलन, या चेहरे/हाथों/गुप्तांगों पर जलने के लिए "
                "चिकित्सा सहायता लें।"
            ),
            "mr": (
                "लहान भाजण्यासाठी: 10-20 मिनिटे वाहत्या पाण्याखाली थंड करा, बर्फ किंवा लोणी लावू नका, आणि स्वच्छ, "
                "नॉन-स्टिक ड्रेसिंगने सैलपणे झाका. मोठ्या, खोल, किंवा फोड येणाऱ्या भाजण्यासाठी, किंवा चेहरा/हात/गुप्तांगांवर "
                "भाजल्यास वैद्यकीय मदत घ्या."
            ),
        },
    ),
    (
        ["sleep", "insomnia"],
        {
            "en": (
                "For better sleep: keep a consistent sleep schedule, limit screens/caffeine "
                "before bed, and keep the room dark and cool. See a doctor if poor sleep "
                "persists for weeks or affects daily functioning."
            ),
            "hi": (
                "बेहतर नींद के लिए: एक नियमित नींद कार्यक्रम रखें, सोने से पहले स्क्रीन/कैफीन सीमित करें, और कमरे "
                "को अंधेरा और ठंडा रखें। यदि खराब नींद हफ्तों तक बनी रहती है या दैनिक कामकाज को प्रभावित करती है तो डॉक्टर से मिलें।"
            ),
            "mr": (
                "चांगल्या झोपेसाठी: नियमित झोपेचे वेळापत्रक ठेवा, झोपण्यापूर्वी स्क्रीन/कॅफिन मर्यादित करा, आणि खोली "
                "अंधारी आणि थंड ठेवा. जर खराब झोप आठवडे टिकली किंवा दैनंदिन कामकाजावर परिणाम करत असेल तर डॉक्टरांना भेटा."
            ),
        },
    ),
    (
        ["hydration", "water intake", "dehydration", "dehydrated"],
        {
            "en": (
                "Most adults should aim for roughly 2-3 liters of fluids a day, more in "
                "hot weather or with exercise. Signs of dehydration include dark urine, "
                "dizziness, and dry mouth."
            ),
            "hi": (
                "अधिकांश वयस्कों को प्रतिदिन लगभग 2-3 लीटर तरल पदार्थ का लक्ष्य रखना चाहिए, गर्म मौसम या व्यायाम "
                "में अधिक। डिहाइड्रेशन के लक्षणों में गहरा पेशाब, चक्कर आना, और मुंह सूखना शामिल हैं।"
            ),
            "mr": (
                "बहुतेक प्रौढांनी दररोज साधारण 2-3 लिटर द्रव पदार्थांचे लक्ष्य ठेवावे, उष्ण हवामानात किंवा व्यायामादरम्यान "
                "अधिक. डिहायड्रेशनच्या लक्षणांमध्ये गडद लघवी, चक्कर येणे, आणि तोंड कोरडे पडणे यांचा समावेश होतो."
            ),
        },
    ),
    (
        ["exercise", "fitness", "workout"],
        {
            "en": (
                "General guidance is about 150 minutes of moderate exercise a week, plus "
                "strength training twice a week. Start gradually if you're new to it, and "
                "check with a doctor first if you have an existing heart or joint condition."
            ),
            "hi": (
                "सामान्य मार्गदर्शन है सप्ताह में लगभग 150 मिनट मध्यम व्यायाम, साथ ही सप्ताह में दो बार स्ट्रेंथ "
                "ट्रेनिंग। यदि आप इसमें नए हैं तो धीरे-धीरे शुरू करें, और यदि आपको पहले से हृदय या जोड़ों की समस्या है तो पहले डॉक्टर से जांच कराएं।"
            ),
            "mr": (
                "सर्वसाधारण मार्गदर्शन आहे आठवड्यातून सुमारे 150 मिनिटे मध्यम व्यायाम, तसेच आठवड्यातून दोनदा "
                "स्ट्रेंथ ट्रेनिंग. जर तुम्ही यात नवीन असाल तर हळूहळू सुरुवात करा, आणि तुम्हाला आधीपासून हृदय किंवा सांधेदुखीची "
                "समस्या असल्यास आधी डॉक्टरांशी संपर्क साधा."
            ),
        },
    ),
    (
        ["stress", "anxiety", "anxious"],
        {
            "en": (
                "For everyday stress: regular exercise, sleep, and relaxation techniques "
                "(deep breathing, short breaks) can help. If anxiety is persistent, "
                "overwhelming, or affecting daily life, it's worth speaking to a doctor or "
                "mental health professional."
            ),
            "hi": (
                "रोज़मर्रा के तनाव के लिए: नियमित व्यायाम, नींद, और आराम तकनीकें (गहरी सांस लेना, छोटे ब्रेक) मदद "
                "कर सकती हैं। यदि चिंता लगातार, भारी है, या दैनिक जीवन को प्रभावित कर रही है, तो डॉक्टर या मानसिक स्वास्थ्य "
                "विशेषज्ञ से बात करना बेहतर होगा।"
            ),
            "mr": (
                "रोजच्या तणावासाठी: नियमित व्यायाम, झोप, आणि विश्रांती तंत्रे (दीर्घ श्वास घेणे, लहान विश्रांती) मदत "
                "करू शकतात. जर चिंता सतत, जबरदस्त असेल, किंवा दैनंदिन जीवनावर परिणाम करत असेल, तर डॉक्टर किंवा मानसिक "
                "आरोग्य तज्ज्ञांशी बोलणे योग्य ठरेल."
            ),
        },
    ),
    (
        ["diet", "nutrition", "weight loss", "weight gain"],
        {
            "en": (
                "General nutrition guidance: balanced meals with vegetables, whole grains, "
                "and lean protein, controlled portions, and limiting processed sugar. For a "
                "specific weight or medical goal, a doctor or dietitian can personalize this."
            ),
            "hi": (
                "सामान्य पोषण मार्गदर्शन: सब्जियों, साबुत अनाज, और लीन प्रोटीन के साथ संतुलित भोजन, नियंत्रित मात्रा, "
                "और प्रोसेस्ड चीनी को सीमित करना। किसी विशिष्ट वज़न या चिकित्सा लक्ष्य के लिए, डॉक्टर या डाइटीशियन इसे व्यक्तिगत बना सकते हैं।"
            ),
            "mr": (
                "सर्वसाधारण पोषण मार्गदर्शन: भाज्या, संपूर्ण धान्य, आणि लीन प्रोटीनसह संतुलित जेवण, नियंत्रित प्रमाण, "
                "आणि प्रक्रिया केलेली साखर मर्यादित करणे. विशिष्ट वजन किंवा वैद्यकीय ध्येयासाठी, डॉक्टर किंवा आहारतज्ज्ञ हे वैयक्तिकृत करू शकतात."
            ),
        },
    ),
    (
        ["blood pressure", "hypertension", "bp"],
        {
            "en": (
                "General blood pressure guidance: reduce salt intake, stay active, maintain "
                "a healthy weight, and limit alcohol. If you're on medication or have been "
                "diagnosed with hypertension, follow your doctor's specific plan."
            ),
            "hi": (
                "सामान्य रक्तचाप मार्गदर्शन: नमक का सेवन कम करें, सक्रिय रहें, स्वस्थ वज़न बनाए रखें, और शराब सीमित "
                "करें। यदि आप दवा ले रहे हैं या उच्च रक्तचाप का निदान हुआ है, तो अपने डॉक्टर की विशिष्ट योजना का पालन करें।"
            ),
            "mr": (
                "सर्वसाधारण रक्तदाब मार्गदर्शन: मिठाचे सेवन कमी करा, सक्रिय रहा, निरोगी वजन राखा, आणि दारू मर्यादित "
                "करा. जर तुम्ही औषध घेत असाल किंवा उच्च रक्तदाबाचे निदान झाले असेल, तर तुमच्या डॉक्टरांच्या विशिष्ट योजनेचे पालन करा."
            ),
        },
    ),
    (
        ["diabetes", "blood sugar", "sugar level"],
        {
            "en": (
                "General blood sugar guidance: consistent meal timing, limiting refined "
                "sugar/carbs, and regular activity all help. If you have diagnosed diabetes, "
                "follow your doctor's monitoring and medication plan rather than general tips."
            ),
            "hi": (
                "सामान्य ब्लड शुगर मार्गदर्शन: नियमित भोजन का समय, रिफाइंड चीनी/कार्ब्स को सीमित करना, और नियमित "
                "गतिविधि सभी मदद करते हैं। यदि आपको मधुमेह का निदान हुआ है, तो सामान्य सुझावों के बजाय अपने डॉक्टर की निगरानी "
                "और दवा योजना का पालन करें।"
            ),
            "mr": (
                "सर्वसाधारण रक्तशर्करा मार्गदर्शन: नियमित जेवणाच्या वेळा, शुद्ध साखर/कार्ब्स मर्यादित करणे, आणि "
                "नियमित हालचाल हे सर्व मदत करते. जर तुम्हाला मधुमेहाचे निदान झाले असेल, तर सर्वसाधारण सूचनांऐवजी तुमच्या "
                "डॉक्टरांच्या देखरेख आणि औषध योजनेचे पालन करा."
            ),
        },
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


def _describe(medicine: Medicine, language: str) -> str:
    generic = medicine.generic_name or GENERIC_NAME_UNKNOWN[language]
    parts = [f"{medicine.name} ({generic})."]

    how_it_works = localized_field(medicine, "how_it_works", language)
    if how_it_works:
        parts.append(how_it_works)

    uses = localized_field(medicine, "uses", language)
    if uses:
        parts.append(f"{USED_FOR[language]}: " + ", ".join(uses[:3]) + ".")

    side_effects = localized_field(medicine, "side_effects", language)
    if side_effects:
        parts.append(f"{COMMON_SIDE_EFFECTS[language]}: " + ", ".join(side_effects[:3]) + ".")

    if medicine.rx_required:
        parts.append(PRESCRIPTION_REQUIRED[language])

    return " ".join(parts)


def _describe_interaction(a: Medicine, b: Medicine, language: str) -> str:
    known = DrugInteraction.objects.filter(medicine_a=a, medicine_b=b).first() or (
        DrugInteraction.objects.filter(medicine_a=b, medicine_b=a).first()
    )
    if known:
        detail = localized_field(known, "description", language) or localized_field(
            known, "title", language
        )
        severity_label = SEVERITY_LABELS.get(known.severity, {}).get(language, known.severity)
        return f"{a.name} + {b.name}: {severity_label} interaction. {detail}".strip()

    prob = ddi.predict(a.smiles, b.smiles) if a.smiles and b.smiles else None
    if prob is not None:
        severity = SEVERITY_LABELS.get(ddi.severity_from_prob(prob), {}).get(
            language, ddi.severity_from_prob(prob)
        )
        if language == "hi":
            return (
                f"{a.name} + {b.name}: हमारा मॉडल {severity} इंटरैक्शन जोखिम का अनुमान लगाता है "
                f"({round(prob * 100)}% संभावना)। हमारी ज्ञात-इंटरैक्शन तालिका में अभी कोई प्रविष्टि नहीं है।"
            )
        if language == "mr":
            return (
                f"{a.name} + {b.name}: आमचे मॉडेल {severity} परस्परसंवाद जोखमीचा अंदाज लावते "
                f"({round(prob * 100)}% शक्यता). आमच्या ज्ञात-परस्परसंवाद तक्त्यात अद्याप कोणतीही नोंद नाही."
            )
        return (
            f"{a.name} + {b.name}: our model estimates a {severity} interaction risk "
            f"({round(prob * 100)}% probability). No entry in our known-interactions table yet."
        )

    if language == "hi":
        return (
            f"हमारे रिकॉर्ड में {a.name} और {b.name} के बीच कोई ज्ञात इंटरैक्शन नहीं मिला। फिर भी, दवाओं को "
            "मिलाने से पहले हमेशा अपने फार्मासिस्ट से जांच करें।"
        )
    if language == "mr":
        return (
            f"आमच्या नोंदींमध्ये {a.name} आणि {b.name} दरम्यान कोणताही ज्ञात परस्परसंवाद आढळला नाही. तरीही, "
            "औषधे एकत्र करण्यापूर्वी नेहमी तुमच्या फार्मासिस्टकडून तपासा."
        )
    return (
        f"No known interaction found between {a.name} and {b.name} in our records. "
        "Still, always check with your pharmacist before combining medicines."
    )


def _find_health_topic(message: str, language: str) -> str | None:
    for keywords, responses in HEALTH_TOPICS:
        for kw in keywords:
            if re.search(rf"\b{re.escape(kw)}\b", message, re.IGNORECASE):
                return responses.get(language, responses["en"])
    return None


def answer(message: str, language: str = "en") -> str:
    if language not in SUPPORTED_LANGUAGES and language != "en":
        language = "en"

    medicines = _find_medicines(message)

    if len(medicines) >= 2:
        reply = _describe_interaction(medicines[0], medicines[1], language)
    elif len(medicines) == 1:
        reply = _describe(medicines[0], language)
    else:
        topic_reply = _find_health_topic(message, language)
        if topic_reply:
            reply = topic_reply
        elif GREETING_RE.match(message):
            return GREETING_REPLY[language]
        else:
            reply = FALLBACK_REPLY[language]

    return f"{reply} {DISCLAIMER[language]}"
