import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Import base dictionary files if present
const enBase = JSON.parse(fs.readFileSync(path.join(rootDir, 'assets', 'i18n', 'en.json'), 'utf-8'));
const teBase = JSON.parse(fs.readFileSync(path.join(rootDir, 'assets', 'i18n', 'te.json'), 'utf-8'));
const hiBase = JSON.parse(fs.readFileSync(path.join(rootDir, 'assets', 'i18n', 'hi.json'), 'utf-8'));
const arBase = JSON.parse(fs.readFileSync(path.join(rootDir, 'assets', 'i18n', 'ar.json'), 'utf-8'));

// Master Additions covering Chatbot, Modals, Service Pages, Blogs, and All UI elements
const masterAdditions = {
  en: {
    // Chatbot
    "chatbot.title": "Dr. Suhail",
    "chatbot.subtitle": "Chief Dental Surgeon & Assistant",
    "chatbot.badge": "ONLINE ASSISTANT",
    "chatbot.greeting": "Hello! I am Dr. Suhail's virtual assistant. How can I assist you with your dental health today?",
    "chatbot.searchPlaceholder": "Search dental questions or treatments...",
    "chatbot.cat.all": "All Questions",
    "chatbot.cat.appointments": "Appointments",
    "chatbot.cat.services": "Services",
    "chatbot.cat.treatments": "Treatments",
    "chatbot.cat.support": "Emergency & Support",
    "chatbot.cat.clinic": "About Clinic",
    "chatbot.cat.costs": "Pricing & Costs",
    "chatbot.btn.bookAppointment": "Book Appointment",
    "chatbot.btn.requestCallback": "Request Callback",
    "chatbot.btn.exploreServices": "Explore Services",
    "chatbot.btn.callClinic": "Call Clinic (+91 7780-245-307)",
    "chatbot.btn.chatWhatsApp": "Chat on WhatsApp",
    "chatbot.btn.askAnother": "Ask Another Question",
    "chatbot.btn.startOver": "Start Over",
    "chatbot.noResults": "No matching questions found. Try another search or contact our front desk.",
    "chatbot.disclaimer": "This virtual assistant provides general dental information and is not a substitute for clinical examination.",

    // Chatbot 24 Questions & Answers
    "chatbot.q.book_appointment": "How can I book an appointment?",
    "chatbot.a.book_appointment": "Booking an appointment is easy! You can use our online appointment form to select your preferred date and time, and our patient coordinator will confirm your visit promptly.",
    "chatbot.q.request_callback": "Can I request a quick callback?",
    "chatbot.a.request_callback": "Certainly! Submit your name and phone number through our callback request form, and our dental team will call you back within 15 minutes.",
    "chatbot.q.dental_services": "What dental services do you provide?",
    "chatbot.a.dental_services": "Redesign Dental Clinics provides comprehensive specialist care, including preventive dentistry, cosmetic smile design, porcelain veneers, dental implants, painless root canals, orthodontics / aligners, periodontal care, and emergency treatments.",
    "chatbot.q.dental_implants": "Do you provide dental implants?",
    "chatbot.a.dental_implants": "Yes! We specialize in advanced titanium and zirconia dental implants, including single tooth replacement, implant bridges, and full-arch All-on-4 restorations with 3D CBCT guided precision.",
    "chatbot.q.dental_emergency": "I have an urgent dental emergency",
    "chatbot.a.dental_emergency": "For severe tooth pain, acute swelling, bleeding, or dental trauma, we provide same-day priority emergency appointments. Please call our emergency helpline or request an immediate callback.",
    "chatbot.q.tooth_pain": "I have severe tooth pain. What should I do?",
    "chatbot.a.tooth_pain": "Severe toothache often indicates deep decay, pulp inflammation, or infection. Avoid placing aspirin directly on gums. Rinse gently with warm saltwater and book an immediate clinical evaluation.",
    "chatbot.q.root_canal": "Do you provide pain-free root canal treatment?",
    "chatbot.a.root_canal": "Yes! We perform modern rotary endodontic root canal treatments, typically completed in a single comfortable visit under computerized local anesthesia.",
    "chatbot.q.teeth_cleaning": "How often should I get my teeth cleaned?",
    "chatbot.a.teeth_cleaning": "Professional ultrasonic scaling and polishing is recommended every 6 months to remove hardened tartar and prevent gum disease and bad breath.",
    "chatbot.q.cosmetic_dentistry": "What cosmetic dentistry treatments do you offer?",
    "chatbot.a.cosmetic_dentistry": "We offer custom E-Max porcelain veneers, composite bonding, in-office laser teeth whitening, aesthetic crown lengthening, and full digital smile makeovers.",
    "chatbot.q.smile_makeover": "Can I get a personalized smile makeover?",
    "chatbot.a.smile_makeover": "Yes! Using Digital Smile Design, we analyze your facial aesthetics to craft a tailored smile makeover combining veneers, whitening, and gum contouring.",
    "chatbot.q.teeth_whitening": "How effective is professional teeth whitening?",
    "chatbot.a.teeth_whitening": "Our in-office LED laser whitening can brighten your smile up to 8 shades in a single 45-minute appointment safely and comfortably.",
    "chatbot.q.clear_aligners": "Do you offer clear invisible aligners?",
    "chatbot.a.clear_aligners": "Yes, we provide custom clear aligners for discreet, wire-free orthodontic straightening for both teens and adults.",
    "chatbot.q.wisdom_tooth": "When does a wisdom tooth need removal?",
    "chatbot.a.wisdom_tooth": "Wisdom tooth extraction is recommended if the tooth is impacted, causing recurrent pain, swelling, cyst formation, or damaging adjacent molars.",
    "chatbot.q.gum_disease": "What are the signs of gum disease?",
    "chatbot.a.gum_disease": "Common warning signs include bleeding gums during brushing, persistent bad breath, gum recession, and tooth mobility. Early periodontal treatment stops progression.",
    "chatbot.q.clinic_location": "Where is Redesign Dental Clinics located?",
    "chatbot.a.clinic_location": "We are located on the 6th Floor, Reliance Classic Enclave, Road No. 1, Banjara Hills, Hyderabad (Telangana - 500034) with dedicated valet parking.",
    "chatbot.q.clinic_hours": "What are your clinic operating hours?",
    "chatbot.a.clinic_hours": "We are open Monday to Saturday from 10:00 AM to 8:00 PM IST, and Sunday from 10:00 AM to 2:00 PM IST (by prior appointment).",
    "chatbot.q.treatment_costs": "How much do dental treatments cost?",
    "chatbot.a.treatment_costs": "We maintain 100% transparent pricing. Following a comprehensive clinical evaluation and digital X-ray, we provide a detailed, itemized estimate before starting any treatment.",
    "chatbot.q.painless_dentistry": "Are dental treatments painful?",
    "chatbot.a.painless_dentistry": "Patient comfort is our top priority. We use computerized local anesthesia with micro-fine needles and gentle sedation techniques for virtually pain-free visits.",
    "chatbot.q.sterilization": "What sterilization standards do you follow?",
    "chatbot.a.sterilization": "We follow hospital-grade Class-B vacuum autoclave sterilization protocols with strict 6-step monitoring and vacuum-sealed instrument pouches.",
    "chatbot.q.doctor_profile": "Who is the chief dental surgeon?",
    "chatbot.a.doctor_profile": "Dr. Suhail A. Syed is our Chief Dental Surgeon and Periodontist with 20+ years of clinical experience (BDS, MDS - Periodontics, Fellow AAID USA).",
    "chatbot.q.child_dentistry": "Do you provide pediatric dental care for children?",
    "chatbot.a.child_dentistry": "Yes, we provide gentle, child-friendly dental care including preventive checkups, fluoride varnish, pit & fissure sealants, and cavity treatments.",
    "chatbot.q.crowns_bridges": "What types of dental crowns do you offer?",
    "chatbot.a.crowns_bridges": "We offer premium metal-free monolithic Zirconia and E-Max lithium disilicate ceramic crowns with lifetime durability and natural translucency.",
    "chatbot.q.full_mouth_rehab": "What is full mouth rehabilitation?",
    "chatbot.a.full_mouth_rehab": "Full mouth rehabilitation is a comprehensive multi-disciplinary treatment to rebuild worn, broken, or missing teeth across both jaws for optimal chewing and aesthetics.",
    "chatbot.q.whatsapp_contact": "Can I connect with the clinic on WhatsApp?",
    "chatbot.a.whatsapp_contact": "Yes! Click the button below to start a direct WhatsApp chat with our clinic reception at +91 7780-245-307.",

    // Modals & Forms Additional Keys
    "booking.selectTimeSlot": "Select Time Slot",
    "booking.morning": "Morning (10:00 AM - 1:00 PM)",
    "booking.afternoon": "Afternoon (2:00 PM - 5:00 PM)",
    "booking.evening": "Evening (5:00 PM - 8:00 PM)",
    "booking.sundayNote": "Sunday appointments available from 10:00 AM - 2:00 PM IST",
    "booking.customPlaceholder": "Please describe your symptoms or reason for visit...",
    "booking.submitting": "Submitting Request...",
    "booking.successRef": "Reference ID: {ref}",
    "booking.doneBtn": "Done",

    // Service Detail Generic Keys
    "serviceDetail.breadcrumbHome": "Home",
    "serviceDetail.breadcrumbServices": "Services",
    "serviceDetail.overviewHeading": "Clinical Overview",
    "serviceDetail.whoBenefitHeading": "Who May Benefit From This Treatment",
    "serviceDetail.keyBenefitsHeading": "Key Treatment Benefits",
    "serviceDetail.processHeading": "Step-by-Step Treatment Process",
    "serviceDetail.techHeading": "Advanced Clinical Technology",
    "serviceDetail.faqHeading": "Frequently Asked Questions",
    "serviceDetail.bookConsultation": "Book Consultation",
    "serviceDetail.requestCallback": "Request Callback",
    "serviceDetail.speakToDoctor": "Speak With Specialist",
    "serviceDetail.sidebarCardTitle": "Personalized Dental Evaluation",
    "serviceDetail.sidebarCardDesc": "Schedule your consultation with Dr. Suhail and our dental specialists in Banjara Hills, Hyderabad.",
    "serviceDetail.guaranteeBadge": "Specialist-Led Treatment",
    "serviceDetail.guaranteeDesc": "All treatments performed by MDS specialists adhering to strict global sterilization standards.",
    "serviceDetail.callForAppointment": "Call for Immediate Appointment:",

    // Doctors Page Specifics
    "doctors.heroBadge": "✦ OUR DENTAL SPECIALISTS",
    "doctors.heroTitle": "Meet Our Specialist Dental Team",
    "doctors.heroSubtitle": "Led by MDS Periodontist & Implantologist Dr. Suhail A. Syed, our multi-specialty team delivers precision dental care with gentle patient comfort.",
    "doctors.experience": "20+ Years Clinical Experience",
    "doctors.qualifications": "BDS, MDS (Periodontics), Fellow AAID (USA)",
    "doctors.specialtiesTitle": "Clinical Focus Areas",
    "doctors.consultationCta": "Book Appointment With Dr. Suhail",

    // Video Tour / Carousel
    "videoCarousel.heading": "Take a Virtual Tour of Our Clinic",
    "videoCarousel.subheading": "Experience the calm, modern, and hygienic clinical environment designed for patient comfort.",
    "videoCarousel.slide1Title": "Advanced 3D CBCT Diagnostic Suite",
    "videoCarousel.slide1Desc": "High-precision digital 3D scans for flawless implant and surgical planning.",
    "videoCarousel.slide2Title": "Ergonomic Treatment Suites",
    "videoCarousel.slide2Desc": "Equipped with motorized European dental chairs for maximum relaxation.",
    "videoCarousel.slide3Title": "Class-B Medical Sterilization Station",
    "videoCarousel.slide3Desc": "Multi-stage automated autoclaving ensuring 100% sterile safety.",

    // Gallery Additional Keys
    "gallery.viewFull": "View Full Image",
    "gallery.caseStudy": "Clinical Case Study",

    // Blog Additional Keys
    "blog.allPosts": "All Articles",
    "blog.filterByCategory": "Filter by Category",
    "blog.minRead": "min read"
  },

  te: {
    // Chatbot
    "chatbot.title": "డాక్టర్ సుహైల్",
    "chatbot.subtitle": "చీఫ్ డెంటల్ సర్జన్ & అసిస్టెంట్",
    "chatbot.badge": "ఆన్‌లైన్ అసిస్టెంట్",
    "chatbot.greeting": "నమస్కారం! నేను డాక్టర్ సుహైల్ వర్చువల్ అసిస్టెంట్‌ని. మీ దంత సంరక్షణలో నేను మీకు ఎలా సహాయపడగలను?",
    "chatbot.searchPlaceholder": "దంత ప్రశ్నలు లేదా చికిత్సలను వెతకండి...",
    "chatbot.cat.all": "అన్ని ప్రశ్నలు",
    "chatbot.cat.appointments": "అపాయింట్‌మెంట్‌లు",
    "chatbot.cat.services": "సేవలు",
    "chatbot.cat.treatments": "చికిత్సలు",
    "chatbot.cat.support": "అత్యవసర & మద్దతు",
    "chatbot.cat.clinic": "క్లినిక్ గురించి",
    "chatbot.cat.costs": "ఖర్చులు & ఫీజులు",
    "chatbot.btn.bookAppointment": "అపాయింట్‌మెంట్ బుక్ చేయండి",
    "chatbot.btn.requestCallback": "కాల్‌బ్యాక్ అభ్యర్థించండి",
    "chatbot.btn.exploreServices": "సేవలను చూడండి",
    "chatbot.btn.callClinic": "క్లినిక్‌కి కాల్ చేయండి (+91 7780-245-307)",
    "chatbot.btn.chatWhatsApp": "WhatsApp లో చాట్ చేయండి",
    "chatbot.btn.askAnother": "మరొక ప్రశ్న అడగండి",
    "chatbot.btn.startOver": "మొదటి నుండి ప్రారంభించండి",
    "chatbot.noResults": "సరిపోలే ప్రశ్నలు కనుగొనబడలేదు. మరొక శోధన ప్రయత్నించండి లేదా మా రిసెప్షన్‌ను సంప్రదించండి.",
    "chatbot.disclaimer": "ఈ వర్చువల్ అసిస్టెంట్ సాధారణ దంత సమాచారాన్ని అందిస్తుంది మరియు ఇది క్లినికల్ పరీక్షకు ప్రత్యామ్నాయం కాదు.",

    // Chatbot 24 Questions & Answers
    "chatbot.q.book_appointment": "నేను అపాయింట్‌మెంట్ ఎలా బుక్ చేసుకోవాలి?",
    "chatbot.a.book_appointment": "అపాయింట్‌మెంట్ బుక్ చేసుకోవడం చాలా సులభం! మా ఆన్‌లైన్ అపాయింట్‌మెంట్ ఫారమ్ ద్వారా మీ తేదీ మరియు సమయాన్ని ఎంచుకోండి, మా బృందం వెంటనే నిర్ధారిస్తుంది.",
    "chatbot.q.request_callback": "నేను త్వరిత కాల్‌బ్యాక్ అభ్యర్థించవచ్చా?",
    "chatbot.a.request_callback": "ఖచ్చితంగా! మీ పేరు మరియు ఫోన్ నంబర్‌ను మా కాల్‌బ్యాక్ ఫారమ్‌లో సమర్పించండి, మా దంత బృందం 15 నిమిషాల్లో మిమ్మల్ని సంప్రదిస్తుంది.",
    "chatbot.q.dental_services": "మీరు ఏ దంత సేవలను అందిస్తున్నారు?",
    "chatbot.a.dental_services": "రీడిజైన్ డెంటల్ క్లినిక్స్ ప్రివెంటివ్ డెంటిస్ట్రీ, కాస్మెటిక్ స్మైల్ డిజైన్, డెంటల్ ఇంప్లాంట్లు, నొప్పిలేని రూట్ కెనాల్, ఆర్థోడాంటిక్స్ / ఎలైసర్స్ మరియు అత్యవసర చికిత్సలను అందిస్తుంది.",
    "chatbot.q.dental_implants": "మీరు డెంటల్ ఇంప్లాంట్స్ చికిత్స చేస్తారా?",
    "chatbot.a.dental_implants": "అవును! మేము అత్యాధునిక టైటానియం మరియు జిర్కోనియా డెంటల్ ఇంప్లాంట్లను 3D CBCT గైడెడ్ ప్రెసిషన్‌తో అందిస్తున్నాము.",
    "chatbot.q.dental_emergency": "నాకు అత్యవసర దంత సమస్య ఉంది",
    "chatbot.a.dental_emergency": "తీవ్రమైన దంత నొప్పి, వాపు లేదా రక్తస్రావం కోసం మేము అదే రోజు అత్యవసర అపాయింట్‌మెంట్‌లను అందిస్తాము. దయచేసి మా హెల్ప్‌లైన్‌కు కాల్ చేయండి.",
    "chatbot.q.tooth_pain": "నాకు తీవ్రమైన పంటి నొప్పి ఉంది, నేను ఏమి చేయాలి?",
    "chatbot.a.tooth_pain": "తీవ్రమైన పంటి నొప్పి ఇన్ఫెక్షన్ లేదా లోతైన పుప్పిపన్ను వల్ల కావచ్చు. గోరువెచ్చని ఉప్పు నీటితో పుక్కిలించి, వెంటనే మా క్లినిక్‌లో అపాయింట్‌మెంట్ బుక్ చేసుకోండి.",
    "chatbot.q.root_canal": "మీరు నొప్పిలేని రూట్ కెనాల్ చికిత్స చేస్తారా?",
    "chatbot.a.root_canal": "అవును! ఆధునిక రోటరీ ఎండోడొంటిక్స్ మరియు కంప్యూటరైజ్డ్ అనస్థీషియాతో సింగిల్ విజిట్‌లోనే నొప్పిలేని రూట్ కెనాల్ చికిత్స అందిస్తున్నాము.",
    "chatbot.q.teeth_cleaning": "దంతాల క్లీనింగ్ ఎంత తరచుగా చేయించుకోవాలి?",
    "chatbot.a.teeth_cleaning": "చిగుళ్ల వ్యాధులు రాకుండా ఉండటానికి మరియు నోటి ఆరోగ్యాన్ని కాపాడుకోవడానికి ప్రతి 6 నెలలకు ఒకసారి అల్ట్రాసోనిక్ క్లీనింగ్ చేయించుకోవడం మంచిది.",
    "chatbot.q.cosmetic_dentistry": "మీరు కాస్మెటిక్ డెంటిస్ట్రీ సేవలు అందిస్తారా?",
    "chatbot.a.cosmetic_dentistry": "అవును, మేము E-Max పోర్సలీన్ వెనీర్స్, కాంపోజిట్ బాండింగ్, లేజర్ టీత్ వైట్నింగ్ మరియు పూర్తి స్మైల్ మేకోవర్ చికిత్సలను అందిస్తున్నాము.",
    "chatbot.q.smile_makeover": "నేను స్మైల్ మేకోవర్ పొందవచ్చా?",
    "chatbot.a.smile_makeover": "అవును! డిజిటల్ స్మైల్ డిజైన్ ద్వారా మీ ముఖ సౌందర్యానికి తగిన విధంగా వ్యక్తిగతీకరించిన స్మైల్ మేకోవర్ అందిస్తాము.",
    "chatbot.q.teeth_whitening": "టీత్ వైట్నింగ్ ఎంత ప్రభావవంతంగా ఉంటుంది?",
    "chatbot.a.teeth_whitening": "మా ఇన్-ఆఫీస్ LED లేజర్ వైట్నింగ్ కేవలం 45 నిమిషాల వ్యవధిలోనే మీ పళ్ళను 8 షేడ్స్ వరకు తెల్లగా మరియు ప్రకాశవంతంగా మారుస్తుంది.",
    "chatbot.q.clear_aligners": "మీరు క్లియర్ అలైన్లర్లను అందిస్తున్నారా?",
    "chatbot.a.clear_aligners": "అవును, తీగలు లేకుండా దంతాలను సరిచేయడానికి మేము సౌకర్యవంతమైన పారదర్శక క్లియర్ అలైన్లర్లను అందిస్తున్నాము.",
    "chatbot.q.wisdom_tooth": "జ్ఞాన దంతాన్ని ఎప్పుడు తొలగించాలి?",
    "chatbot.a.wisdom_tooth": "జ్ఞాన దంతం ఇరుక్కుపోయి నొప్పి, వాపు లేదా పక్క దంతాలను దెబ్బతీస్తున్నప్పుడు దానిని తొలగించడం మంచిది.",
    "chatbot.q.gum_disease": "చిగుళ్ల వ్యాధి లక్షణాలు ఏమిటి?",
    "chatbot.a.gum_disease": "బ్రష్ చేసేటప్పుడు రక్తం రావడం, నోటి దుర్వాసన, చిగుళ్ళు వెనక్కి తగ్గడం మరియు పళ్ళు కదలడం చిగుళ్ల వ్యాధి ముఖ్య లక్షణాలు.",
    "chatbot.q.clinic_location": "రీడిజైన్ డెంటల్ క్లినిక్స్ ఎక్కడ ఉంది?",
    "chatbot.a.clinic_location": "మా క్లినిక్ 6వ అంతస్తు, రిలయన్స్ క్లాసిక్ ఎన్‌క్లేవ్, రోడ్ నెం. 1, బంజారా హిల్స్, హైదరాబాద్ (తెలంగాణ - 500034) వద్ద ఉంది. వ్యాలెట్ పార్కింగ్ సదుపాయం కలదు.",
    "chatbot.q.clinic_hours": "క్లినిక్ పని వేళలు ఏమిటి?",
    "chatbot.a.clinic_hours": "సోమవారం నుండి శనివారం వరకు ఉదయం 10:00 నుండి రాత్రి 8:00 వరకు, ఆదివారం ఉదయం 10:00 నుండి మధ్యాహ్నం 2:00 వరకు తెరిచి ఉంటుంది.",
    "chatbot.q.treatment_costs": "దంత చికిత్సల ఖర్చు ఎంత అవుతుంది?",
    "chatbot.a.treatment_costs": "మేము 100% పారదర్శక ధరలను పాటిస్తాము. పూర్తి పరీక్ష మరియు డిజిటల్ ఎక్స్-రే తర్వాత చికిత్సకు అయ్యే ఖర్చును ముందే స్పష్టంగా వివరిస్తాము.",
    "chatbot.q.painless_dentistry": "దంత చికిత్సలు నొప్పితో కూడుకున్నవా?",
    "chatbot.a.painless_dentistry": "రోగుల సౌకర్యమే మా ప్రాధాన్యత. ఆధునిక కంప్యూటరైజ్డ్ లోకల్ అనస్థీషియాతో పూర్తి నొప్పిలేని చికిత్సను అందిస్తున్నాము.",
    "chatbot.q.sterilization": "మీరు ఎలాంటి స్టెరిలైజేషన్ ప్రమాణాలను పాటిస్తున్నారు?",
    "chatbot.a.sterilization": "మేము హాస్పిటల్-గ్రేడ్ క్లాస్-బి వాక్యూమ్ ఆటోక్లేవ్ మరియు 6-దశల కఠినమైన స్టెరిలైజేషన్ ప్రోటోకాల్‌లను పాటిస్తాము.",
    "chatbot.q.doctor_profile": "చీఫ్ డెంటల్ సర్జన్ ఎవరు?",
    "chatbot.a.doctor_profile": "డాక్టర్ సుహైల్ ఎ. సయ్యద్ 20+ సంవత్సరాల అనుభవం కలిగిన ప్రముఖ చీఫ్ డెంటల్ సర్జన్ మరియు పీరియాడెంటిస్ట్ (BDS, MDS - Periodontics, Fellow AAID USA).",
    "chatbot.q.child_dentistry": "మీరు పిల్లల దంత సంరక్షణ అందిస్తారా?",
    "chatbot.a.child_dentistry": "అవును, పిల్లల కోసం సురక్షితమైన మరియు స్నేహపూర్వక వాతావరణంలో ప్రివెంటివ్ చెకప్‌లు మరియు చికిత్సలను అందిస్తున్నాము.",
    "chatbot.q.crowns_bridges": "మీరు ఎలాంటి డెంటల్ క్రౌన్స్ అందిస్తున్నారు?",
    "chatbot.a.crowns_bridges": "మేము అత్యుత్తమ నాణ్యత కలిగిన మెటల్-ఫ్రీ జిర్కోనియా మరియు E-Max సిరామిక్ క్రౌన్‌లను అందిస్తున్నాము.",
    "chatbot.q.full_mouth_rehab": "ఫుల్ మౌత్ రిహాబిలిటేషన్ అంటే ఏమిటి?",
    "chatbot.a.full_mouth_rehab": "విరిగిన లేదా ఊడిపోయిన దంతాలను సరిచేసి, నమలడం మరియు ముఖ సౌందర్యాన్ని తిరిగి తీసుకొచ్చే సమగ్ర చికిత్స.",
    "chatbot.q.whatsapp_contact": "నేను WhatsApp లో క్లినిక్‌ను సంప్రదించవచ్చా?",
    "chatbot.a.whatsapp_contact": "అవును! మా రిసెప్షన్‌తో నేరుగా WhatsApp లో మాట్లాడటానికి క్రింది బటన్‌పై క్లిక్ చేయండి (+91 7780-245-307).",

    // Modals & Forms Additional Keys
    "booking.selectTimeSlot": "సమయం స్లాట్‌ను ఎంచుకోండి",
    "booking.morning": "ఉదయం (10:00 AM - 1:00 PM)",
    "booking.afternoon": "మధ్యాహ్నం (2:00 PM - 5:00 PM)",
    "booking.evening": "సాయంత్రం (5:00 PM - 8:00 PM)",
    "booking.sundayNote": "ఆదివారం అపాయింట్‌మెంట్‌లు ఉదయం 10:00 నుండి మధ్యాహ్నం 2:00 వరకు అందుబాటులో ఉంటాయి",
    "booking.customPlaceholder": "మీ సమస్య లేదా కారణాన్ని ఇక్కడ వివరించండి...",
    "booking.submitting": "సమర్పిస్తోంది...",
    "booking.successRef": "రిఫరెన్స్ ID: {ref}",
    "booking.doneBtn": "పూర్తయింది",

    // Service Detail Generic Keys
    "serviceDetail.breadcrumbHome": "హోమ్",
    "serviceDetail.breadcrumbServices": "సేవలు",
    "serviceDetail.overviewHeading": "క్లినికల్ వివరాలు",
    "serviceDetail.whoBenefitHeading": "ఈ చికిత్స ఎవరికి ప్రయోజనకరం",
    "serviceDetail.keyBenefitsHeading": "ముఖ్య ప్రయోజనాలు",
    "serviceDetail.processHeading": "దశలవారీ చికిత్స విధానం",
    "serviceDetail.techHeading": "అధునాతన క్లినికల్ టెక్నాలజీ",
    "serviceDetail.faqHeading": "తరచుగా అడిగే ప్రశ్నలు",
    "serviceDetail.bookConsultation": "కన్సల్టేషన్ బుక్ చేయండి",
    "serviceDetail.requestCallback": "కాల్‌బ్యాక్ అభ్యర్థించండి",
    "serviceDetail.speakToDoctor": "నిపుణులతో మాట్లాడండి",
    "serviceDetail.sidebarCardTitle": "వ్యక్తిగతీకరించిన దంత పరీక్ష",
    "serviceDetail.sidebarCardDesc": "హైదరాబాద్‌లోని బంజారా హిల్స్‌లో డాక్టర్ సుహైల్ మరియు మా నిపుణులతో మీ కన్సల్టేషన్‌ను షెడ్యూల్ చేసుకోండి.",
    "serviceDetail.guaranteeBadge": "స్పెషలిస్ట్ నేతృత్వంలోని చికిత్స",
    "serviceDetail.guaranteeDesc": "అన్ని చికిత్సలు గ్లోబల్ స్టెరిలైజేషన్ ప్రమాణాలను పాటిస్తూ MDS నిపుణులచే నిర్వహించబడతాయి.",
    "serviceDetail.callForAppointment": "తక్షణ అపాయింట్‌మెంట్ కోసం కాల్ చేయండి:",

    // Doctors Page Specifics
    "doctors.heroBadge": "✦ మా దంత నిపుణులు",
    "doctors.heroTitle": "మా స్పెషలిస్ట్ దంత బృందాన్ని కలవండి",
    "doctors.heroSubtitle": "MDS పీరియాడెంటిస్ట్ & ఇంప్లాంటాలజిస్ట్ డాక్టర్ సుహైల్ ఎ. సయ్యద్ నేతృత్వంలోని మా బృందం ఖచ్చితమైన మరియు సౌకర్యవంతమైన దంత సంరక్షణను అందిస్తుంది.",
    "doctors.experience": "20+ సంవత్సరాల క్లినికల్ అనుభవం",
    "doctors.qualifications": "BDS, MDS (Periodontics), Fellow AAID (USA)",
    "doctors.specialtiesTitle": "క్లినికల్ స్పెషలైజేషన్స్",
    "doctors.consultationCta": "డాక్టర్ సుహైల్‌తో అపాయింట్‌మెంట్ బుక్ చేయండి",

    // Video Tour / Carousel
    "videoCarousel.heading": "మా క్లినిక్ వర్చువల్ టూర్ చూడండి",
    "videoCarousel.subheading": "రోగుల సౌకర్యార్థం రూపొందించిన ప్రశాంతమైన, పరిశుభ్రమైన వాతావరణాన్ని అనుభవించండి.",
    "videoCarousel.slide1Title": "అధునాతన 3D CBCT డయాగ్నస్టిక్ సూట్",
    "videoCarousel.slide1Desc": "ఖచ్చితమైన ఇంప్లాంట్ మరియు శస్త్రచికిత్స ప్రణాళిక కోసం డిజిటల్ 3D స్కాన్లు.",
    "videoCarousel.slide2Title": "ఎర్గోనామిక్ ట్రీట్‌మెంట్ సూట్లు",
    "videoCarousel.slide2Desc": "పూర్తి విశ్రాంతి కోసం మోటరైజ్డ్ యూరోపియన్ డెంటల్ కుర్చీలు.",
    "videoCarousel.slide3Title": "క్లాస్-బి మెడికల్ స్టెరిలైజేషన్ స్టేషన్",
    "videoCarousel.slide3Desc": "100% క్రిమిరహిత భద్రతను నిర్ధారించే మల్టీ-స్టేజ్ ఆటోక్లేవింగ్.",

    // Gallery Additional Keys
    "gallery.viewFull": "పూర్తి చిత్రాన్ని చూడండి",
    "gallery.caseStudy": "క్లినికల్ కేస్ స్టడీ",

    // Blog Additional Keys
    "blog.allPosts": "అన్ని వ్యాసాలు",
    "blog.filterByCategory": "వర్గం వారీగా ఫిల్టర్ చేయండి",
    "blog.minRead": "నిమిషాల పఠనం"
  },

  hi: {
    // Chatbot
    "chatbot.title": "डॉ. सुहैल",
    "chatbot.subtitle": "मुख्य दंत शल्य चिकित्सक और सहायक",
    "chatbot.badge": "ऑनलाइन सहायक",
    "chatbot.greeting": "नमस्ते! मैं डॉ. सुहैल का वर्चुअल सहायक हूँ। आज मैं आपकी दंत स्वास्थ्य में कैसे सहायता कर सकता हूँ?",
    "chatbot.searchPlaceholder": "दंत प्रश्न या उपचार खोजें...",
    "chatbot.cat.all": "सभी प्रश्न",
    "chatbot.cat.appointments": "अपॉइंटमेंट",
    "chatbot.cat.services": "सेवाएं",
    "chatbot.cat.treatments": "उपचार",
    "chatbot.cat.support": "आपातकालीन और सहायता",
    "chatbot.cat.clinic": "क्लिनिक के बारे में",
    "chatbot.cat.costs": "शुल्क और लागत",
    "chatbot.btn.bookAppointment": "अपॉइंटमेंट बुक करें",
    "chatbot.btn.requestCallback": "कॉल बैक का अनुरोध करें",
    "chatbot.btn.exploreServices": "सेवाएं देखें",
    "chatbot.btn.callClinic": "क्लिनिक को कॉल करें (+91 7780-245-307)",
    "chatbot.btn.chatWhatsApp": "WhatsApp पर चैट करें",
    "chatbot.btn.askAnother": "अन्य प्रश्न पूछें",
    "chatbot.btn.startOver": "पुनः आरंभ करें",
    "chatbot.noResults": "कोई संबंधित प्रश्न नहीं मिला। कृपया पुनः खोजें या हमारे रिसेप्शन से संपर्क करें।",
    "chatbot.disclaimer": "यह वर्चुअल सहायक सामान्य दंत जानकारी प्रदान करता है और यह नैदानिक परीक्षण का विकल्प नहीं है।",

    // Chatbot 24 Questions & Answers
    "chatbot.q.book_appointment": "मैं अपॉइंटमेंट कैसे बुक कर सकता हूँ?",
    "chatbot.a.book_appointment": "अपॉइंटमेंट बुक करना बहुत आसान है! आप हमारे ऑनलाइन फॉर्म का उपयोग करके अपनी पसंदीदा तारीख और समय चुन सकते हैं, और हमारी टीम तुरंत पुष्टि करेगी।",
    "chatbot.q.request_callback": "क्या मैं त्वरित कॉलबैक का अनुरोध कर सकता हूँ?",
    "chatbot.a.request_callback": "बिल्कुल! कॉलबैक फॉर्म में अपना नाम और मोबाइल नंबर दर्ज करें, हमारी दंत टीम 15 मिनट के भीतर आपसे संपर्क करेगी।",
    "chatbot.q.dental_services": "आप कौन सी दंत सेवाएं प्रदान करते हैं?",
    "chatbot.a.dental_services": "रीडिजाइन डेंटल क्लिनिक्स प्रिवेंटिव डेंटिस्ट्री, कॉस्मेटिक स्माइल डिजाइन, डेंटल इंप्लांट्स, दर्द रहित रूट कैनाल, ऑर्थोडॉन्टिक्स / एलाइनर्स और आपातकालीन देखभाल प्रदान करता है।",
    "chatbot.q.dental_implants": "क्या आप डेंटल इंप्लांट्स की सुविधा देते हैं?",
    "chatbot.a.dental_implants": "हाँ! हम 3D CBCT निर्देशित सटीकता के साथ प्रीमियम टाइटेनियम और ज़िरकोनिया डेंटल इंप्लांट्स प्रदान करते हैं।",
    "chatbot.q.dental_emergency": "मुझे आपातकालीन दंत समस्या है",
    "chatbot.a.dental_emergency": "अत्यधिक दांत दर्द, सूजन या चोट के मामलों में हम उसी दिन आपातकालीन अपॉइंटमेंट प्रदान करते हैं। कृपया हमारी हेल्पलाइन पर संपर्क करें।",
    "chatbot.q.tooth_pain": "मुझे दांत में तेज दर्द है, मुझे क्या करना चाहिए?",
    "chatbot.a.tooth_pain": "तेज दांत दर्द संक्रमण या गहरी कैविटी का संकेत हो सकता है। गुनगुने नमक के पानी से कुल्ला करें और तुरंत हमारे क्लिनिक में परामर्श बुक करें।",
    "chatbot.q.root_canal": "क्या आप दर्द रहित रूट कैनाल उपचार करते हैं?",
    "chatbot.a.root_canal": "हाँ! आधुनिक रोटरी एंडोडॉन्टिक्स और कम्प्यूटरीकृत एनेस्थीसिया के साथ हम सिंगल विजिट में दर्द रहित रूट कैनाल उपचार प्रदान करते हैं।",
    "chatbot.q.teeth_cleaning": "दांतों की सफाई कितनी बार करानी चाहिए?",
    "chatbot.a.teeth_cleaning": "मसूड़ों की बीमारियों से बचाव और मौखिक स्वच्छता बनाए रखने के लिए हर 6 महीने में एक बार अल्ट्रासोनिक स्केलिंग करानी चाहिए।",
    "chatbot.q.cosmetic_dentistry": "क्या आप कॉस्मेटिक डेंटिस्ट्री सेवाएं प्रदान करते हैं?",
    "chatbot.a.cosmetic_dentistry": "हाँ, हम E-Max पोर्सिलेन विनियर, कम्पोजिट बॉन्डिंग, लेजर टीथ वाइटनिंग और पूर्ण स्माइल मेकओवर उपचार प्रदान करते हैं।",
    "chatbot.q.smile_makeover": "क्या मुझे स्माइल मेकओवर मिल सकता है?",
    "chatbot.a.smile_makeover": "हाँ! डिजिटल स्माइल डिजाइन के माध्यम से हम आपके चेहरे के सौंदर्य के अनुरूप व्यक्तिगत स्माइल मेकओवर तैयार करते हैं।",
    "chatbot.q.teeth_whitening": "टीथ वाइटनिंग कितनी प्रभावी है?",
    "chatbot.a.teeth_whitening": "हमारी इन-क्लिनिक LED लेजर वाइटनिंग केवल 45 मिनट में आपके दांतों को 8 शेड्स तक चमकदार और सफेद बना सकती है।",
    "chatbot.q.clear_aligners": "क्या आप इनविजिबल एलाइनर्स प्रदान करते हैं?",
    "chatbot.a.clear_aligners": "हाँ, बिना तार के दांतों को सीधा करने के लिए हम कस्टम पारदर्शी क्लियर एलाइनर्स प्रदान करते हैं।",
    "chatbot.q.wisdom_tooth": "अकल दाढ़ को कब निकालना पड़ता है?",
    "chatbot.a.wisdom_tooth": "यदि अकल दाढ़ फंसी हुई हो, दर्द, सूजन या आस-पास के दांतों को नुकसान पहुंचा रही हो, तो उसे निकालना आवश्यक होता है।",
    "chatbot.q.gum_disease": "मसूड़ों की बीमारी के क्या लक्षण हैं?",
    "chatbot.a.gum_disease": "ब्रश करते समय खून आना, सांसों की बदबू, मसूड़ों का सिकुड़ना और दांतों का हिलना मसूड़ों की बीमारी के मुख्य लक्षण हैं।",
    "chatbot.q.clinic_location": "रीडिजाइन डेंटल क्लिनिक्स कहाँ स्थित है?",
    "chatbot.a.clinic_location": "हमारा क्लिनिक छठी मंजिल, रिलायंस क्लासिक एन्क्लेव, रोड नं. 1, बंजारा हिल्स, हैदराबाद (तेलंगाना - 500034) में स्थित है। वैले पार्किंग उपलब्ध है।",
    "chatbot.q.clinic_hours": "क्लिनिक का समय क्या है?",
    "chatbot.a.clinic_hours": "हम सोमवार से शनिवार सुबह 10:00 से रात 8:00 बजे तक और रविवार को सुबह 10:00 से दोपहर 2:00 बजे तक खुले रहते हैं।",
    "chatbot.q.treatment_costs": "दंत उपचार का खर्च कितना होता है?",
    "chatbot.a.treatment_costs": "हम 100% पारदर्शी मूल्य निर्धारण का पालन करते हैं। पूरी जांच और डिजिटल एक्स-रे के बाद हम इलाज से पहले विस्तृत लागत विवरण प्रदान करते हैं।",
    "chatbot.q.painless_dentistry": "क्या दंत उपचार में दर्द होता है?",
    "chatbot.a.painless_dentistry": "मरीजों का आराम हमारी प्राथमिकता है। हम कम्प्यूटरीकृत लोकल एनेस्थीसिया के साथ लगभग दर्द रहित उपचार सुनिश्चित करते हैं।",
    "chatbot.q.sterilization": "आप किस प्रकार के नसबंदी मानकों का पालन करते हैं?",
    "chatbot.a.sterilization": "हम अस्पताल-ग्रेड क्लास-बी वैक्यूम ऑटोक्लेव और 6-चरणीय सख्त नसबंदी प्रोटोकॉल का पालन करते हैं।",
    "chatbot.q.doctor_profile": "मुख्य दंत शल्य चिकित्सक कौन हैं?",
    "chatbot.a.doctor_profile": "डॉ. सुहैल ए. सैयद हमारे मुख्य दंत शल्य चिकित्सक और पेरियोडोंटोलॉजिस्ट हैं, जिनके पास 20+ वर्षों का अनुभव है (BDS, MDS, Fellow AAID USA)।",
    "chatbot.q.child_dentistry": "क्या आप बच्चों की दंत चिकित्सा प्रदान करते हैं?",
    "chatbot.a.child_dentistry": "हाँ, हम बच्चों के लिए सुरक्षित, सौम्य और मैत्रीपूर्ण वातावरण में दंत चिकित्सा और निवारक जांच प्रदान करते हैं।",
    "chatbot.q.crowns_bridges": "आप किस प्रकार के डेंटल क्राउन प्रदान करते हैं?",
    "chatbot.a.crowns_bridges": "हम प्राकृतिक चमक और अधिकतम मजबूती वाले मेटल-फ्री ज़िरकोनिया और E-Max सिरेमिक क्राउन प्रदान करते हैं।",
    "chatbot.q.full_mouth_rehab": "फुल माउथ रिहैबिलिटेशन क्या है?",
    "chatbot.a.full_mouth_rehab": "यह दोनों जबड़ों के घिसे या टूटे हुए दांतों को पुनः स्थापित करने और चबाने की क्षमता को सुधारने का एक व्यापक उपचार है।",
    "chatbot.q.whatsapp_contact": "क्या मैं क्लिनिक से WhatsApp पर संपर्क कर सकता हूँ?",
    "chatbot.a.whatsapp_contact": "हाँ! हमारे रिसेप्शन से सीधे WhatsApp पर बातचीत करने के लिए नीचे दिए गए बटन पर क्लिक करें (+91 7780-245-307)।",

    // Modals & Forms Additional Keys
    "booking.selectTimeSlot": "समय स्लॉट चुनें",
    "booking.morning": "सुबह (10:00 AM - 1:00 PM)",
    "booking.afternoon": "दोपहर (2:00 PM - 5:00 PM)",
    "booking.evening": "शाम (5:00 PM - 8:00 PM)",
    "booking.sundayNote": "रविवार को अपॉइंटमेंट सुबह 10:00 से दोपहर 2:00 बजे तक उपलब्ध हैं",
    "booking.customPlaceholder": "कृपया अपने लक्षण या परामर्श का कारण यहाँ लिखें...",
    "booking.submitting": "जमा किया जा रहा है...",
    "booking.successRef": "संदर्भ आईडी: {ref}",
    "booking.doneBtn": "पूर्ण",

    // Service Detail Generic Keys
    "serviceDetail.breadcrumbHome": "होम",
    "serviceDetail.breadcrumbServices": "सेवाएं",
    "serviceDetail.overviewHeading": "नैदानिक विवरण",
    "serviceDetail.whoBenefitHeading": "यह उपचार किसके लिए उपयोगी है",
    "serviceDetail.keyBenefitsHeading": "मुख्य लाभ",
    "serviceDetail.processHeading": "चरण-दर-चरण उपचार प्रक्रिया",
    "serviceDetail.techHeading": "उन्नत क्लिनिकल तकनीक",
    "serviceDetail.faqHeading": "अक्सर पूछे जाने वाले प्रश्न",
    "serviceDetail.bookConsultation": "परामर्श बुक करें",
    "serviceDetail.requestCallback": "कॉल बैक का अनुरोध करें",
    "serviceDetail.speakToDoctor": "विशेषज्ञ से बात करें",
    "serviceDetail.sidebarCardTitle": "व्यक्तिगत दंत मूल्यांकन",
    "serviceDetail.sidebarCardDesc": "बंजारा हिल्स, हैदराबाद में डॉ. सुहैल और हमारे विशेषज्ञों के साथ अपना परामर्श निर्धारित करें।",
    "serviceDetail.guaranteeBadge": "विशेषज्ञ-नेतृत्व वाला उपचार",
    "serviceDetail.guaranteeDesc": "सभी उपचार वैश्विक नसबंदी मानकों का पालन करते हुए MDS विशेषज्ञों द्वारा किए जाते हैं।",
    "serviceDetail.callForAppointment": "तत्काल अपॉइंटमेंट के लिए कॉल करें:",

    // Doctors Page Specifics
    "doctors.heroBadge": "✦ हमारे दंत विशेषज्ञ",
    "doctors.heroTitle": "हमारी विशेषज्ञ दंत टीम से मिलें",
    "doctors.heroSubtitle": "MDS पेरियोडॉन्टिस्ट और इंप्लांटोलॉजिस्ट डॉ. सुहैल ए. सैयद के नेतृत्व में हमारी टीम सौम्य और सटीक दंत देखभाल प्रदान करती है।",
    "doctors.experience": "20+ वर्षों का नैदानिक अनुभव",
    "doctors.qualifications": "BDS, MDS (Periodontics), Fellow AAID (USA)",
    "doctors.specialtiesTitle": "विशेषज्ञता के मुख्य क्षेत्र",
    "doctors.consultationCta": "डॉ. सुहैल के साथ अपॉइंटमेंट बुक करें",

    // Video Tour / Carousel
    "videoCarousel.heading": "हमारे क्लिनिक का वर्चुअल टूर देखें",
    "videoCarousel.subheading": "मरीजों के आराम और स्वच्छता के लिए तैयार किए गए आधुनिक वातावरण का अनुभव करें।",
    "videoCarousel.slide1Title": "उन्नत 3D CBCT डायग्नोस्टिक सुइट",
    "videoCarousel.slide1Desc": "सटीक इंप्लांट और सर्जिकल योजना के लिए उच्च-सटीक 3D स्कैन।",
    "videoCarousel.slide2Title": "एर्गोनोमिक ट्रीटमेंट सुइट्स",
    "videoCarousel.slide2Desc": "पूर्ण विश्राम के लिए आधुनिक मोटराइज्ड यूरोपीय डेंटल चेयर।",
    "videoCarousel.slide3Title": "क्लास-बी मेडिकल नसबंदी स्टेशन",
    "videoCarousel.slide3Desc": "100% कीटाणु-मुक्त सुरक्षा सुनिश्चित करने वाला मल्टी-स्टेज ऑटोक्लेविंग।",

    // Gallery Additional Keys
    "gallery.viewFull": "पूरी छवि देखें",
    "gallery.caseStudy": "क्लिनिकल केस स्टडी",

    // Blog Additional Keys
    "blog.allPosts": "सभी लेख",
    "blog.filterByCategory": "श्रेणी के अनुसार फ़िल्टर करें",
    "blog.minRead": "मिनट का पठन"
  },

  ar: {
    // Chatbot
    "chatbot.title": "د. سهيل",
    "chatbot.subtitle": "كبير جراحي الأسنان والمساعد الافتراضي",
    "chatbot.badge": "مساعد مباشر",
    "chatbot.greeting": "مرحباً بكم! أنا المساعد الافتراضي للدكتور سهيل. كيف يمكنني مساعدتكم في العناية بأسنانكم اليوم؟",
    "chatbot.searchPlaceholder": "ابحث عن الأسئلة أو العلاجات السنية...",
    "chatbot.cat.all": "جميع الأسئلة",
    "chatbot.cat.appointments": "المواعيد",
    "chatbot.cat.services": "الخدمات",
    "chatbot.cat.treatments": "العلاجات",
    "chatbot.cat.support": "الطوارئ والدعم",
    "chatbot.cat.clinic": "عن العيادة",
    "chatbot.cat.costs": "الأسعار والتكاليف",
    "chatbot.btn.bookAppointment": "حجز موعد",
    "chatbot.btn.requestCallback": "طلب إعادة اتصال",
    "chatbot.btn.exploreServices": "استكشاف الخدمات",
    "chatbot.btn.callClinic": "الاتصال بالعيادة (+91 7780-245-307)",
    "chatbot.btn.chatWhatsApp": "المحادثة عبر WhatsApp",
    "chatbot.btn.askAnother": "طرح سؤال آخر",
    "chatbot.btn.startOver": "البدء من جديد",
    "chatbot.noResults": "لم يتم العثور على نتائج مطابقة. يرجى تجربة بحث آخر أو التواصل مع الاستقبال.",
    "chatbot.disclaimer": "يقدم هذا المساعد معلومات سنية عامة ولا يعتبر بديلاً عن الفحص السريري المباشر.",

    // Chatbot 24 Questions & Answers
    "chatbot.q.book_appointment": "كيف يمكنني حجز موعد؟",
    "chatbot.a.book_appointment": "حجز الموعد سهل للغاية! يمكنك استخدام نموذج الحجز الإلكتروني لاختيار التاريخ والوقت المناسبين، وسيقوم فريقنا بتأكيد موعدك فوراً.",
    "chatbot.q.request_callback": "هل يمكنني طلب إعادة الاتصال بي سريعاً؟",
    "chatbot.a.request_callback": "بالتأكيد! أرسل اسمك ورقم هاتفك عبر نموذج طلب الاتصال، وسيتواصل معك فريقنا الطبي خلال 15 دقيقة.",
    "chatbot.q.dental_services": "ما هي خدمات طب الأسنان التي تقدمونها؟",
    "chatbot.a.dental_services": "تقدم عيادات ريديزاين لطب الأسنان رعاية تخصصية شاملة تشمل طب الأسنان الوقائي، تجميل الابتسامة، الفينير، زراعة الأسنان، علاج العصب بدون ألم، وتقويم الأسنان الشفاف.",
    "chatbot.q.dental_implants": "هل تقدمون خدمات زراعة الأسنان؟",
    "chatbot.a.dental_implants": "نعم! نحن متخصصون في زراعة الأسنان المتقدمة باستخدام التيتانيوم والزيركونيا بدقة موجهة عبر الأشعة المقطعية ثلاثية الأبعاد 3D CBCT.",
    "chatbot.q.dental_emergency": "لدي حالة طوارئ سنية عاجلة",
    "chatbot.a.dental_emergency": "في حالات ألم الأسنان الحاد، التورم، النزيف، أو الحوادث، نوفر مواعيد طوارئ في نفس اليوم. يرجى الاتصال بخط الطوارئ مباشرة.",
    "chatbot.q.tooth_pain": "أعاني من ألم شديد في أسناني، ماذا أفعل؟",
    "chatbot.a.tooth_pain": "ألم الأسنان الحاد يشير غالباً إلى تسوس عميق أو التهاب في العصب. تمضمض بماء دافئ وملح وتجنب وضع المسكنات مباشرة على اللثة، واحجز فحصاً عاجلاً.",
    "chatbot.q.root_canal": "هل تقدمون علاج عصب الأسنان بدون ألم؟",
    "chatbot.a.root_canal": "نعم! نستخدم أحدث أجهزة علاج العصب الآلية Rotary والتخدير الموضعي المحوسب لإجراء العلاج في جلسة واحدة مريحة وبدون ألم.",
    "chatbot.q.teeth_cleaning": "كم مرة يجب تنظيف الأسنان لدى الطبيب؟",
    "chatbot.a.teeth_cleaning": "يوصى بإجراء تنظيف الأسنان وإزالة الجير بالموجات فوق الصوتية كل 6 أشهر للحفاظ على صحة اللثة ومنع الرائحة الكريهة.",
    "chatbot.q.cosmetic_dentistry": "ما هي علاجات تجميل الأسنان المتاحة لديكم؟",
    "chatbot.a.cosmetic_dentistry": "نوفر عدسات الفينير الخزفية E-Max، الحشوات التجميلية، تبييض الأسنان بالليزر، وتصميم الابتسامة الرقمي المتكامل.",
    "chatbot.q.smile_makeover": "هل يمكنني الحصول على ابتسامة هوليوود مخصصة؟",
    "chatbot.a.smile_makeover": "نعم! نقوم بتصميم ابتسامتك رقمياً بما يتناسب مع ملامح وجهك واحتياجاتك الجمالية بأعلى معايير الدقة.",
    "chatbot.q.teeth_whitening": "ما مدى فاعلية تبييض الأسنان الاحترافي؟",
    "chatbot.a.teeth_whitening": "يمنحك تبييض الأسنان بالليزر في العيادة ابتسامة أكثر بياضاً حتى 8 درجات خلال جلسة واحدة آمنة تستغرق 45 دقيقة فقط.",
    "chatbot.q.clear_aligners": "هل تقدمون التقويم الشفاف غير المرئي؟",
    "chatbot.a.clear_aligners": "نعم، نوفر قوالب التقويم الشفاف المخصصة لتقويم الأسنان بسلاسة وسرية تامة دون الحاجة إلى الأسلاك المعدنية.",
    "chatbot.q.wisdom_tooth": "متى يجب خلع ضرس العقل؟",
    "chatbot.a.wisdom_tooth": "يوصى بخلع ضرس العقل جراحياً إذا كان منطمراً جزئياً أو كلياً ويسبب ألماً متكرراً، التهاباً، أو يضغط على الأسنان المجاورة.",
    "chatbot.q.gum_disease": "ما هي علامات وأعراض أمراض اللثة؟",
    "chatbot.a.gum_disease": "تشمل العلامات الشائعة نزيف اللثة أثناء تنظيف الأسنان، انبعاث رائحة فم مزمنة، انحسار اللثة، وتخلخل الأسنان.",
    "chatbot.q.clinic_location": "أين تقع عيادات ريديزاين لطب الأسنان؟",
    "chatbot.a.clinic_location": "تقع عيادتنا في الطابق السادس، ريلاينس كلاسيك إنكليف، طريق رقم 1، بانجارا هيلز، حيدر أباد (تيلانجانا - 500034) مع توفر خدمة صف السيارات.",
    "chatbot.q.clinic_hours": "ما هي أوقات عمل العيادة؟",
    "chatbot.a.clinic_hours": "نستقبلكم من الاثنين إلى السبت من الساعة 10:00 صباحاً حتى 8:00 مساءً بتوقيت الهند، والأحد من 10:00 صباحاً حتى 2:00 ظهراً (بموعد مسبق).",
    "chatbot.q.treatment_costs": "كم تبلغ تكلفة العلاجات السنية؟",
    "chatbot.a.treatment_costs": "نلتزم بالشفافية الكاملة في الأسعار. بعد الفحص السريري والأشعة الرقمية، نقدم خطة علاجية مفصلة مع التكلفة قبل البدء.",
    "chatbot.q.painless_dentistry": "هل العلاجات السنية مؤلمة؟",
    "chatbot.a.painless_dentistry": "راحة المريض هي غايتنا الأولى. نعتمد تقنيات التخدير المحوسب بإبر فائقة الدقة لتجربة علاجية مريحة وخالية من الألم تماماً.",
    "chatbot.q.sterilization": "ما هي معايير التعقيم المتبعة في العيادة؟",
    "chatbot.a.sterilization": "نطبق بروتوكولات التعقيم الطبي بأجهزة الأوتوكلاف المفرغة Class-B وفق 6 مراحل معتمدة لضمان أقصى درجات الأمان والوقاية.",
    "chatbot.q.doctor_profile": "من هو كبير جراحي الأسنان في العيادة؟",
    "chatbot.a.doctor_profile": "الدكتور سهيل أ. سيد هو كبير جراحي الأسنان وأخصائي اللثة وزراعة الأسنان بخبرة سريرية تتجاوز 20 عاماً (BDS, MDS, Fellow AAID USA).",
    "chatbot.q.child_dentistry": "هل تقدمون علاج أسنان الأطفال؟",
    "chatbot.a.child_dentistry": "نعم، نقدم رعاية سنية وقائية وعلاجية لطيفة ومخصصة للأطفال في بيئة مريحة ومرحبة تمنحهم الطمأنينة.",
    "chatbot.q.crowns_bridges": "ما هي أنواع تيجان وجسور الأسنان المتوفرة؟",
    "chatbot.a.crowns_bridges": "نوفر تيجان الزيركونيا النقية وتيجان E-Max الخزفية الخالية من المعادن والتي تتميز بالمتانة العالية والشفافية الطبيعية.",
    "chatbot.q.full_mouth_rehab": "ما هي إعادة تأهيل الفم الكاملة؟",
    "chatbot.a.full_mouth_rehab": "إعادة تأهيل الفم الكاملة هي خطة علاجية متعددة التخصصات لترميم الأسنان المتآكلة أو المفقودة واستعادة القدرة على المضغ وجمال الابتسامة.",
    "chatbot.q.whatsapp_contact": "هل يمكنني التواصل مع العيادة عبر واتساب؟",
    "chatbot.a.whatsapp_contact": "نعم! اضغط على الزر أدناه لبدء محادثة مباشرة عبر واتساب مع استقبال العيادة على الرقم (+91 7780-245-307).",

    // Modals & Forms Additional Keys
    "booking.selectTimeSlot": "اختر الوقت المناسب",
    "booking.morning": "صباحاً (10:00 صباحاً - 1:00 ظهراً)",
    "booking.afternoon": "ظهراً (2:00 ظهراً - 5:00 مساءً)",
    "booking.evening": "مساءً (5:00 مساءً - 8:00 مساءً)",
    "booking.sundayNote": "مواعيد يوم الأحد متوفرة من 10:00 صباحاً حتى 2:00 ظهراً بتوقيت الهند",
    "booking.customPlaceholder": "يرجى كتابة سبب الزيارة أو الأعراض التي تشعر بها...",
    "booking.submitting": "جاري إرسال الطلب...",
    "booking.successRef": "الرقم المرجعي: {ref}",
    "booking.doneBtn": "تم",

    // Service Detail Generic Keys
    "serviceDetail.breadcrumbHome": "الرئيسية",
    "serviceDetail.breadcrumbServices": "الخدمات",
    "serviceDetail.overviewHeading": "نظرة عامة سريرية",
    "serviceDetail.whoBenefitHeading": "الفئات المستفيدة من هذا العلاج",
    "serviceDetail.keyBenefitsHeading": "المزايا العلاجية الأساسية",
    "serviceDetail.processHeading": "مراحل العلاج خطوة بخطوة",
    "serviceDetail.techHeading": "التكنولوجيا السريرية المتقدمة",
    "serviceDetail.faqHeading": "الأسئلة الشائعة",
    "serviceDetail.bookConsultation": "حجز استشارة",
    "serviceDetail.requestCallback": "طلب إعادة اتصال",
    "serviceDetail.speakToDoctor": "التحدث مع الطبيب الأخصائي",
    "serviceDetail.sidebarCardTitle": "تقييم سني مخصص",
    "serviceDetail.sidebarCardDesc": "احجز موعد استشارتك مع الدكتور سهيل وفريق أطباء الأسنان الأخصائيين في بانجارا هيلز، حيدر أباد.",
    "serviceDetail.guaranteeBadge": "علاج بقيادة استشاريين",
    "serviceDetail.guaranteeDesc": "تُجرى جميع العلاجات بواسطة أطباء أخصائيين بدرجة ماجستير MDS وفق معايير التعقيم العالمية الصارمة.",
    "serviceDetail.callForAppointment": "للحجز الفوري يرجى الاتصال على:",

    // Doctors Page Specifics
    "doctors.heroBadge": "✦ أطباؤنا الأخصائيون",
    "doctors.heroTitle": "تعرف على فريق أطباء الأسنان المتخصصين",
    "doctors.heroSubtitle": "بقيادة استشاري اللثة وزراعة الأسنان الدكتور سهيل أ. سيد، يقدم فريقنا متعدد التخصصات رعاية سنية دقيقة ومريحة للمرضى.",
    "doctors.experience": "أكثر من 20 عاماً من الخبرة السريرية",
    "doctors.qualifications": "BDS, MDS (Periodontics), Fellow AAID (USA)",
    "doctors.specialtiesTitle": "مجالات التخصص السريري",
    "doctors.consultationCta": "حجز موعد مع الدكتور سهيل",

    // Video Tour / Carousel
    "videoCarousel.heading": "جولة افتراضية داخل عيادتنا",
    "videoCarousel.subheading": "استكشف بيئتنا السريرية الهادئة والنظيفة والمجهزة بأحدث المعدات لراحة المرضى.",
    "videoCarousel.slide1Title": "جناح الأشعة المقطعية الرقمية 3D CBCT",
    "videoCarousel.slide1Desc": "تصوير ثلاثي الأبعاد فائق الدقة للتخطيط الجراحي وزراعة الأسنان بدقة متناهية.",
    "videoCarousel.slide2Title": "أجنحة العلاج المريحة والمجهزة",
    "videoCarousel.slide2Desc": "كراسي علاج أوروبية ذكية ومصممة هندسياً لمنح المريض أقصى درجات الاسترخاء.",
    "videoCarousel.slide3Title": "محطة التعقيم الطبي المعتمدة Class-B",
    "videoCarousel.slide3Desc": "نظام تعقيم مفرغ متعدد المراحل يضمن بيئة سريرية معقمة وآمنة بنسبة 100%.",

    // Gallery Additional Keys
    "gallery.viewFull": "عرض الصورة كاملة",
    "gallery.caseStudy": "دراسة حالة سريرية",

    // Blog Additional Keys
    "blog.allPosts": "جميع المقالات",
    "blog.filterByCategory": "تصفية حسب التخصص",
    "blog.minRead": "دقائق قراءة"
  }
};

// Merge base dictionaries with master additions
const mergedEn = { ...enBase, ...masterAdditions.en };
const mergedTe = { ...teBase, ...masterAdditions.te };
const mergedHi = { ...hiBase, ...masterAdditions.hi };
const mergedAr = { ...arBase, ...masterAdditions.ar };

// Ensure 100% key parity
const allKeys = new Set([
  ...Object.keys(mergedEn),
  ...Object.keys(mergedTe),
  ...Object.keys(mergedHi),
  ...Object.keys(mergedAr)
]);

allKeys.forEach(key => {
  if (!mergedEn[key]) mergedEn[key] = key;
  if (!mergedTe[key]) mergedTe[key] = mergedEn[key];
  if (!mergedHi[key]) mergedHi[key] = mergedEn[key];
  if (!mergedAr[key]) mergedAr[key] = mergedEn[key];
});

console.log(`Total Unified Keys: ${allKeys.size}`);

// Write JSON dictionaries
fs.writeFileSync(path.join(rootDir, 'assets', 'i18n', 'en.json'), JSON.stringify(mergedEn, null, 2), 'utf-8');
fs.writeFileSync(path.join(rootDir, 'assets', 'i18n', 'te.json'), JSON.stringify(mergedTe, null, 2), 'utf-8');
fs.writeFileSync(path.join(rootDir, 'assets', 'i18n', 'hi.json'), JSON.stringify(mergedHi, null, 2), 'utf-8');
fs.writeFileSync(path.join(rootDir, 'assets', 'i18n', 'ar.json'), JSON.stringify(mergedAr, null, 2), 'utf-8');

// Write translations.js with window.__RC_TRANSLATIONS__
const translationsJsContent = `// Redesign Dental Clinics — Master Unified Translations
// Supported Languages: en (English, default), te (Telugu), hi (Hindi), ar (Arabic)
window.__RC_TRANSLATIONS__ = {
  en: ${JSON.stringify(mergedEn)},
  te: ${JSON.stringify(mergedTe)},
  hi: ${JSON.stringify(mergedHi)},
  ar: ${JSON.stringify(mergedAr)}
};
window.RC_TRANSLATIONS = window.__RC_TRANSLATIONS__;
`;

fs.writeFileSync(path.join(rootDir, 'assets', 'i18n', 'translations.js'), translationsJsContent, 'utf-8');
console.log('✓ Successfully wrote assets/i18n/translations.js and JSON dictionaries with 100% key parity!');
