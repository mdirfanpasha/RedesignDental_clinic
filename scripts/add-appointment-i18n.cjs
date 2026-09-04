const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const i18nDir = path.join(rootDir, 'assets', 'i18n');
const localesDir = path.join(rootDir, 'scripts', 'locales');

const newTranslations = {
  en: {
    "apt.pill": "✦ Specialist Dental Appointment",
    "apt.title": "Book Your Appointment",
    "apt.subtitle": "Choose your preferred date and time, share your details, and request an appointment with Redesign Dental Clinics.",
    "apt.cardTitle": "Select Date, Time & Details",
    "apt.serviceLabel": "Dental Service",
    "apt.selectService": "-- Select Dental Service (Optional) --",
    "apt.srv.ortho": "1. Orthodontics (Braces / Clear Aligners)",
    "apt.srv.endo": "2. Endodontics (Root Canal Treatment)",
    "apt.srv.prev": "3. Preventive & General Dentistry",
    "apt.srv.cosmetic": "4. Cosmetic Dentistry & Smile Makeover",
    "apt.srv.resto": "5. Restorative Dentistry (Crowns / Bridges)",
    "apt.srv.surgery": "6. Oral Surgery & Tooth Extractions",
    "apt.srv.perio": "7. Periodontics & Gum Care",
    "apt.srv.laser": "8. Advanced Laser Dentistry",
    "apt.srv.pedia": "9. Pediatric Dental Care",
    "apt.srv.emergency": "10. Emergency Dental Care",
    "apt.srv.consult": "General Dental Consultation",
    "apt.selectDate": "Select Preferred Appointment Date *",
    "apt.selectSlot": "Select Preferred 30-Minute Time Slot *",
    "apt.submitWhatsApp": "Request Appointment via WhatsApp",
    "apt.submitNote": "Your appointment request will be prepared and sent to Redesign Dental Clinics for confirmation.",
    "apt.successTitle": "Appointment Request Prepared!",
    "apt.returnHome": "Return to Homepage",
    "apt.howItWorksTitle": "How Booking Works",
    "apt.howItWorksSubtitle": "A seamless, transparent 3-step appointment experience designed for your convenience.",
    "apt.step1Tag": "STEP 1",
    "apt.step1Title": "Select Slot & Details",
    "apt.step1Desc": "Pick your required dental service, preferred date on the open calendar, and exact 30-minute time slot.",
    "apt.step2Tag": "STEP 2",
    "apt.step2Title": "WhatsApp Confirmation",
    "apt.step2Desc": "Your request opens in WhatsApp pre-filled with all details. Simply press Send.",
    "apt.step3Tag": "STEP 3",
    "apt.step3Title": "Visit Clinic",
    "apt.step3Desc": "Receive fast confirmation from our front desk and visit us at Banjara Hills Road No. 1.",
    "apt.errName": "Please enter your full name.",
    "apt.errPhone": "Please enter a valid 10-digit mobile number.",
    "apt.errEmail": "Please enter a valid email address.",
    "apt.errDate": "Please select an appointment date.",
    "apt.errSlot": "Please select a preferred 30-minute time slot.",
    "apt.selectedDatePrefix": "Selected Date: "
  },
  te: {
    "apt.pill": "✦ స్పెషలిస్ట్ డెంటల్ అపాయింట్‌మెంట్",
    "apt.title": "మీ అపాయింట్‌మెంట్‌ను బుక్ చేసుకోండి",
    "apt.subtitle": "మీకు నచ్చిన తేదీ మరియు సమయాన్ని ఎంచుకోండి, మీ వివరాలను పంచుకోండి మరియు రీడిజైన్ డెంటల్ క్లినిక్స్‌తో అపాయింట్‌మెంట్‌ను అభ్యర్థించండి.",
    "apt.cardTitle": "తేదీ, సమయం & వివరాలను ఎంచుకోండి",
    "apt.serviceLabel": "డెంటల్ సర్వీస్",
    "apt.selectService": "-- డెంటల్ సర్వీస్‌ను ఎంచుకోండి (ఐచ్ఛికం) --",
    "apt.srv.ortho": "1. ఆర్థోడాంటిక్స్ (బ్రేసెస్ / క్లియర్ అలైన్ర్స్)",
    "apt.srv.endo": "2. ఎండోడాంటిక్స్ (రూట్ కెనాల్ చికిత్స)",
    "apt.srv.prev": "3. ప్రివెంటివ్ & జనరల్ డెంటిస్ట్రీ",
    "apt.srv.cosmetic": "4. కాస్మెటిక్ డెంటిస్ట్రీ & స్మైల్ మేకోవర్",
    "apt.srv.resto": "5. రెస్టోరేటివ్ డెంటిస్ట్రీ (క్రౌన్స్ / బ్రిడ్జెస్)",
    "apt.srv.surgery": "6. ఓరల్ సర్జరీ & దంతాల తొలగింపు",
    "apt.srv.perio": "7. పెరియోడాంటిక్స్ & చిగుళ్ల సంరక్షణ",
    "apt.srv.laser": "8. అధునాతన లేజర్ డెంటిస్ట్రీ",
    "apt.srv.pedia": "9. పీడియాట్రిక్ డెంటల్ కేర్",
    "apt.srv.emergency": "10. ఎమర్జెన్సీ డెంటల్ కేర్",
    "apt.srv.consult": "జనరల్ డెంటల్ కన్సల్టేషన్",
    "apt.selectDate": "ప్రాధాన్యత గల అపాయింట్‌మెంట్ తేదీని ఎంచుకోండి *",
    "apt.selectSlot": "ప్రాధాన్యత గల 30 నిమిషాల సమయ స్లాట్‌ను ఎంచుకోండి *",
    "apt.submitWhatsApp": "వాట్సాప్ ద్వారా అపాయింట్‌మెంట్ అభ్యర్థించండి",
    "apt.submitNote": "మీ అపాయింట్‌మెంట్ అభ్యర్థన సిద్ధం చేయబడి, నిర్ధారణ కోసం రీడిజైన్ డెంటల్ క్లినిక్స్‌కు పంపబడుతుంది.",
    "apt.successTitle": "అపాయింట్‌మెంట్ అభ్యర్థన సిద్ధమైంది!",
    "apt.returnHome": "హోమ్‌పేజీకి తిరిగి వెళ్లండి",
    "apt.howItWorksTitle": "బుకింగ్ ఎలా పనిచేస్తుంది",
    "apt.howItWorksSubtitle": "మీ సౌలభ్యం కోసం రూపొందించబడిన సులభమైన, పారదర్శక 3-దశల అపాయింట్‌మెంట్ అనుభవం.",
    "apt.step1Tag": "దశ 1",
    "apt.step1Title": "స్లాట్ & వివరాలను ఎంచుకోండి",
    "apt.step1Desc": "మీకు అవసరమైన డెంటల్ సర్వీస్, క్యాలెండర్‌లో నచ్చిన తేదీ మరియు ఖచ్చితమైన 30 నిమిషాల సమయ స్లాట్‌ను ఎంచుకోండి.",
    "apt.step2Tag": "దశ 2",
    "apt.step2Title": "వాట్సాప్ నిర్ధారణ",
    "apt.step2Desc": "మీ అభ్యర్థన అన్ని వివరాలతో వాట్సాప్‌లో సిద్ధంగా తెరవబడుతుంది. కేవలం పంపండి (Send) బటన్ నొక్కండి.",
    "apt.step3Tag": "దశ 3",
    "apt.step3Title": "క్లినిక్‌ను సందర్శించండి",
    "apt.step3Desc": "మా ఫ్రంట్ డెస్క్ నుండి త్వరిత నిర్ధారణను అందుకోండి మరియు బంజారా హిల్స్ రోడ్ నం. 1 వద్ద మమ్మల్ని సందర్శించండి.",
    "apt.errName": "దయచేసి మీ పూర్తి పేరును నమోదు చేయండి.",
    "apt.errPhone": "దయచేసి చెల్లుబాటు అయ్యే 10 అంకెల మొబైల్ నంబర్‌ను నమోదు చేయండి.",
    "apt.errEmail": "దయచేసి చెల్లుబాటు అయ్యే ఇమెయిల్ చిరునామాను నమోదు చేయండి.",
    "apt.errDate": "దయచేసి అపాయింట్‌మెంట్ తేదీని ఎంచుకోండి.",
    "apt.errSlot": "దయచేసి 30 నిమిషాల సమయ స్లాట్‌ను ఎంచుకోండి.",
    "apt.selectedDatePrefix": "ఎంచుకున్న తేదీ: "
  },
  hi: {
    "apt.pill": "✦ विशेषज्ञ दंत चिकित्सा अपॉइंटमेंट",
    "apt.title": "अपना अपॉइंटमेंट बुक करें",
    "apt.subtitle": "अपनी पसंदीदा तिथि और समय चुनें, अपना विवरण साझा करें और रीडिजाइन डेंटल क्लिनिक्स के साथ अपॉइंटमेंट का अनुरोध करें।",
    "apt.cardTitle": "तिथि, समय और विवरण चुनें",
    "apt.serviceLabel": "दंत सेवा",
    "apt.selectService": "-- दंत सेवा चुनें (वैकल्पिक) --",
    "apt.srv.ortho": "1. ऑर्थोडॉन्टिक्स (ब्रेसेस / क्लियर एलाइनर्स)",
    "apt.srv.endo": "2. एंडोडॉन्टिक्स (रूट कैनाल उपचार)",
    "apt.srv.prev": "3. प्रिवेंटिव और सामान्य दंत चिकित्सा",
    "apt.srv.cosmetic": "4. कॉस्मेटिक डेंटिस्ट्री और स्माइल मेकओवर",
    "apt.srv.resto": "5. रेस्टोरेटिव डेंटिस्ट्री (क्राउन / ब्रिज)",
    "apt.srv.surgery": "6. ओरल सर्जरी और दांत निकालना",
    "apt.srv.perio": "7. पेरियोडॉन्टिक्स और मसूड़ों की देखभाल",
    "apt.srv.laser": "8. एडवांस्ड लेजर डेंटिस्ट्री",
    "apt.srv.pedia": "9. पीडियाट्रिक डेंटल केयर",
    "apt.srv.emergency": "10. आपातकालीन दंत चिकित्सा",
    "apt.srv.consult": "सामान्य दंत परामर्श",
    "apt.selectDate": "पसंदीदा अपॉइंटमेंट तिथि चुनें *",
    "apt.selectSlot": "पसंदीदा 30-मिनट का समय स्लॉट चुनें *",
    "apt.submitWhatsApp": "व्हाट्सएप के माध्यम से अपॉइंटमेंट का अनुरोध करें",
    "apt.submitNote": "आपका अपॉइंटमेंट अनुरोध तैयार किया जाएगा और पुष्टि के लिए रीडिजाइन डेंटल क्लिनिक्स को भेजा जाएगा।",
    "apt.successTitle": "अपॉइंटमेंट अनुरोध तैयार है!",
    "apt.returnHome": "होमपेज पर वापस जाएं",
    "apt.howItWorksTitle": "बुकिंग कैसे काम करती है",
    "apt.howItWorksSubtitle": "आपकी सुविधा के लिए डिज़ाइन किया गया एक सहज, पारदर्शी 3-चरणीय अपॉइंटमेंट अनुभव।",
    "apt.step1Tag": "चरण 1",
    "apt.step1Title": "स्लॉट और विवरण चुनें",
    "apt.step1Desc": "अपनी आवश्यक दंत सेवा, कैलेंडर पर पसंदीदा तिथि और सटीक 30-मिनट का समय स्लॉट चुनें।",
    "apt.step2Tag": "चरण 2",
    "apt.step2Title": "व्हाट्सएप पुष्टि",
    "apt.step2Desc": "आपका अनुरोध सभी विवरणों के साथ व्हाट्सएप में खुल जाएगा। बस सेंड (Send) दबाएं।",
    "apt.step3Tag": "चरण 3",
    "apt.step3Title": "क्लिनिक आएं",
    "apt.step3Desc": "हमारे फ्रंट डेस्क से त्वरित पुष्टि प्राप्त करें और बंजारा हिल्स रोड नंबर 1 पर हमसे मिलें।",
    "apt.errName": "कृपया अपना पूरा नाम दर्ज करें।" ,
    "apt.errPhone": "कृपया एक मान्य 10-अंकीय मोबाइल नंबर दर्ज करें।",
    "apt.errEmail": "कृपया एक मान्य ईमेल पता दर्ज करें।",
    "apt.errDate": "कृपया अपॉइंटमेंट तिथि चुनें।",
    "apt.errSlot": "कृपया पसंदीदा 30-मिनट का समय स्लॉट चुनें।",
    "apt.selectedDatePrefix": "चुनी गई तिथि: "
  },
  ar: {
    "apt.pill": "✦ موعد مع أخصائي طب الأسنان",
    "apt.title": "احجز موعدك",
    "apt.subtitle": "اختر التاريخ والوقت المفضلين لديك، وشارك تفاصيلك، واطلب موعداً مع عيادات ريديزاين لطب الأسنان.",
    "apt.cardTitle": "حدد التاريخ والوقت والتفاصيل",
    "apt.serviceLabel": "خدمة الأسنان",
    "apt.selectService": "-- اختر خدمة الأسنان (اختياري) --",
    "apt.srv.ortho": "1. تقويم الأسنان (الأقواس / التقويم الشفاف)",
    "apt.srv.endo": "2. علاج جذور الأسنان (سحب العصب)",
    "apt.srv.prev": "3. طب الأسنان الوقائي والعام",
    "apt.srv.cosmetic": "4. طب الأسنان التجميلي وابتسامة هوليوود",
    "apt.srv.resto": "5. تركيبات الأسنان (التيجان / الجسور)",
    "apt.srv.surgery": "6. جراحة الفم وخلع الأسنان",
    "apt.srv.perio": "7. علاج اللثة وأنسجة الفم",
    "apt.srv.laser": "8. طب الأسنان بالليزر المتقدم",
    "apt.srv.pedia": "9. طب أسنان الأطفال",
    "apt.srv.emergency": "10. طوارئ طب الأسنان",
    "apt.srv.consult": "استشارة عامة لطب الأسنان",
    "apt.selectDate": "اختر تاريخ الموعد المفضل *",
    "apt.selectSlot": "اختر الفترة الزمنية المفضلة (30 دقيقة) *",
    "apt.submitWhatsApp": "طلب موعد عبر واتساب",
    "apt.submitNote": "سيتم تجهيز طلب موعدك وإرساله إلى عيادات ريديزاين لطب الأسنان للتأكيد.",
    "apt.successTitle": "تم تجهيز طلب الموعد!",
    "apt.returnHome": "العودة إلى الصفحة الرئيسية",
    "apt.howItWorksTitle": "كيف يعمل الحجز",
    "apt.howItWorksSubtitle": "تجربة حجز مواعيد سلسة وشفافة من 3 خطوات مصممة لراحتك.",
    "apt.step1Tag": "الخطوة 1",
    "apt.step1Title": "اختر الوقت والتفاصيل",
    "apt.step1Desc": "اختر خدمة الأسنان المطلوبة، والتاريخ المفضل في التقويم، والفترة الزمنية المحددة (30 دقيقة).",
    "apt.step2Tag": "الخطوة 2",
    "apt.step2Title": "التأكيد عبر واتساب",
    "apt.step2Desc": "يفتح طلبك في تطبيق واتساب معبأً بجميع التفاصيل. فقط اضغط على إرسال.",
    "apt.step3Tag": "الخطوة 3",
    "apt.step3Title": "زيارة العيادة",
    "apt.step3Desc": "احصل على تأكيد سريع من مكتب الاستقبال وقم بزيارتنا في بنجارا هيلز طريق رقم 1.",
    "apt.errName": "يرجى إدخال اسمك الكامل.",
    "apt.errPhone": "يرجى إدخال رقم هاتف محمول صالح مكون من 10 أرقام.",
    "apt.errEmail": "يرجى إدخال عنوان بريد إلكتروني صالح.",
    "apt.errDate": "يرجى اختيار تاريخ الموعد.",
    "apt.errSlot": "يرجى اختيار فترة زمنية مفضلة مدتها 30 دقيقة.",
    "apt.selectedDatePrefix": "التاريخ المحدد: "
  }
};

const locales = ['en', 'te', 'hi', 'ar'];

// 1. Update assets/i18n/*.json
const dictionaries = {};
locales.forEach(loc => {
  const jsonPath = path.join(i18nDir, `${loc}.json`);
  const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  Object.assign(data, newTranslations[loc]);
  fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2), 'utf8');
  dictionaries[loc] = data;
  console.log(`✓ Updated ${loc}.json (now ${Object.keys(data).length} keys)`);
});

// 2. Update assets/i18n/translations.js
const bundleJs = `/**
 * Redesign Clinics — Complete Multilingual Dictionary Bundle
 * Embedded for instantaneous zero-flash loading across static HTML pages.
 */
window.__RC_TRANSLATIONS__ = {
  en: ${JSON.stringify(dictionaries.en)},
  te: ${JSON.stringify(dictionaries.te)},
  hi: ${JSON.stringify(dictionaries.hi)},
  ar: ${JSON.stringify(dictionaries.ar)}
};
`;
fs.writeFileSync(path.join(i18nDir, 'translations.js'), bundleJs, 'utf8');
console.log('✓ Updated assets/i18n/translations.js');

// 3. Minify translations.min.js
const minBundleJs = `window.__RC_TRANSLATIONS__={en:${JSON.stringify(dictionaries.en)},te:${JSON.stringify(dictionaries.te)},hi:${JSON.stringify(dictionaries.hi)},ar:${JSON.stringify(dictionaries.ar)}};`;
fs.writeFileSync(path.join(i18nDir, 'translations.min.js'), minBundleJs, 'utf8');
console.log('✓ Updated assets/i18n/translations.min.js');

console.log('Done updating translations!');
