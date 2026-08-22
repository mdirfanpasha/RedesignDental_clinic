import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const localesDir = path.join(__dirname, 'locales');

const files = ['en.js', 'te.js', 'hi.js', 'ar.js'];

files.forEach(file => {
  let content = fs.readFileSync(path.join(localesDir, file), 'utf-8');

  // Replace Redesign Clinics / Redesign Dental with Redesign Dental Clinics
  content = content.replace(/Redesign Clinics/g, 'Redesign Dental Clinics');
  content = content.replace(/REDESIGN CLINICS/g, 'REDESIGN DENTAL CLINICS');
  content = content.replace(/Redesign Dental\b(?! Clinics)/g, 'Redesign Dental Clinics');

  // Doctor Dr. Suhail updates
  if (file === 'en.js') {
    content = content.replace(/"doctor\.badge":\s*"[^"]+"/, '"doctor.badge": "CHIEF DENTAL SURGEON"');
    content = content.replace(/"doctor\.title":\s*"[^"]+"/, '"doctor.title": "Meet Dr. Suhail, BDS, MDS"');
    content = content.replace(/"doctor\.designation":\s*"[^"]+"/, '"doctor.designation": "Chief Dental Surgeon | Periodontics & Implantology"');
    content = content.replace(/"doctor\.bio":\s*"[^"]+"/, '"doctor.bio": "With over 20+ years of clinical expertise, Dr. Suhail (BDS, MDS - Periodontics, Fellow AAID USA) specializes in advanced periodontal care, dental implants, aesthetic dentistry, and fixed partial dentures with gentle precision."');
    content = content.replace(/"doctor\.spec1":\s*"[^"]+"/, '"doctor.spec1": "Periodontics & Gum Care"');
    content = content.replace(/"doctor\.spec2":\s*"[^"]+"/, '"doctor.spec2": "Dental Implantology"');
    content = content.replace(/"doctor\.spec3":\s*"[^"]+"/, '"doctor.spec3": "Aesthetic Dentistry"');
    content = content.replace(/"doctor\.spec4":\s*"[^"]+"/, '"doctor.spec4": "Fixed Partial Dentures"');
  } else if (file === 'te.js') {
    content = content.replace(/"doctor\.badge":\s*"[^"]+"/, '"doctor.badge": "ప్రధాన దంత వైద్య నిపుణులు"');
    content = content.replace(/"doctor\.title":\s*"[^"]+"/, '"doctor.title": "డాక్టర్ సుహైల్, BDS, MDS"');
    content = content.replace(/"doctor\.designation":\s*"[^"]+"/, '"doctor.designation": "చీఫ్ డెంటల్ సర్జన్ | పీరియాడాంటిక్స్ & ఇంప్లాంటాలజీ"');
    content = content.replace(/"doctor\.bio":\s*"[^"]+"/, '"doctor.bio": "20+ ఏళ్లకు పైగా విశేష అనుభవం కలిగిన డాక్టర్ సుహైల్ (BDS, MDS - పీరియాడాంటిక్స్, ఫెలో AAID USA), పీరియాడాంటిక్స్, డెంటల్ ఇంప్లాంట్స్, ఎస్తెటిక్ డెంటిస్ట్రీ మరియు ఫిక్స్‌డ్ పార్షియల్ డెంచర్లలో విశిష్ట నిపుణులు."');
    content = content.replace(/"doctor\.spec1":\s*"[^"]+"/, '"doctor.spec1": "పీరియాడాంటిక్స్ & చిగుళ్ల సంరక్షణ"');
    content = content.replace(/"doctor\.spec2":\s*"[^"]+"/, '"doctor.spec2": "డెంటల్ ఇంప్లాంటాలజీ"');
    content = content.replace(/"doctor\.spec3":\s*"[^"]+"/, '"doctor.spec3": "ఎస్తెటిక్ డెంటిస్ట్రీ"');
    content = content.replace(/"doctor\.spec4":\s*"[^"]+"/, '"doctor.spec4": "ఫిక్స్‌డ్ పార్షియల్ డెంచర్లు"');
  } else if (file === 'hi.js') {
    content = content.replace(/"doctor\.badge":\s*"[^"]+"/, '"doctor.badge": "मुख्य दंत शल्य चिकित्सक"');
    content = content.replace(/"doctor\.title":\s*"[^"]+"/, '"doctor.title": "मिलिए डॉ. सुहैल, BDS, MDS से"');
    content = content.replace(/"doctor\.designation":\s*"[^"]+"/, '"doctor.designation": "मुख्य डेंटल सर्जन | पेरियोडॉन्टिक्स एवं इंप्लांटोलॉजी"');
    content = content.replace(/"doctor\.bio":\s*"[^"]+"/, '"doctor.bio": "18 से अधिक वर्षों के समृद्ध अनुभव के साथ, डॉ. सुहैल (BDS, MDS - पेरियोडॉन्टिक्स, फेलो AAID USA) पेरियोडॉन्टिक्स, डेंटल इंप्लांट्स, एस्थेटिक डेंटिस्ट्री एवं फिक्स्ड पार्शियल डेंचर में विशेषज्ञता रखते हैं।"');
    content = content.replace(/"doctor\.spec1":\s*"[^"]+"/, '"doctor.spec1": "पेरियोडॉन्टिक्स एवं मसूड़ों की देखभाल"');
    content = content.replace(/"doctor\.spec2":\s*"[^"]+"/, '"doctor.spec2": "डेंटल इंप्लांटोलॉजी"');
    content = content.replace(/"doctor\.spec3":\s*"[^"]+"/, '"doctor.spec3": "एस्थेटिक डेंटिस्ट्री"');
    content = content.replace(/"doctor\.spec4":\s*"[^"]+"/, '"doctor.spec4": "फिक्स्ड पार्शियल डेंचर"');
  } else if (file === 'ar.js') {
    content = content.replace(/"doctor\.badge":\s*"[^"]+"/, '"doctor.badge": "كبير جراحي الأسنان"');
    content = content.replace(/"doctor\.title":\s*"[^"]+"/, '"doctor.title": "تعرف على د. سهيل، BDS, MDS"');
    content = content.replace(/"doctor\.designation":\s*"[^"]+"/, '"doctor.designation": "كبير جراحي الأسنان | أمراض اللثة وزراعة الأسنان"');
    content = content.replace(/"doctor\.bio":\s*"[^"]+"/, '"doctor.bio": "بخبرة سريرية تتجاوز 18 عاماً، يتخصص د. سهيل (BDS, MDS - جراحة اللثة، زميل الجمعية الأمريكية لزراعة الأسنان AAID) في زراعة الأسنان وعلاج اللثة المتقدم وطب الأسنان التجميلي."');
    content = content.replace(/"doctor\.spec1":\s*"[^"]+"/, '"doctor.spec1": "أمراض وجراحة اللثة"');
    content = content.replace(/"doctor\.spec2":\s*"[^"]+"/, '"doctor.spec2": "زراعة الأسنان المتقدمة"');
    content = content.replace(/"doctor\.spec3":\s*"[^"]+"/, '"doctor.spec3": "طب الأسنان التجميلي"');
    content = content.replace(/"doctor\.spec4":\s*"[^"]+"/, '"doctor.spec4": "التركيبات الثابتة والجسور"');
  }

  // Update testimonials author mentions of Mohammed -> Dr. Suhail
  content = content.replace(/Dr\. Mohammed/g, 'Dr. Suhail');
  content = content.replace(/డాక్టర్ మొహమ్మద్/g, 'డాక్టర్ సుహైల్');
  content = content.replace(/डॉ\. मोहम्मद/g, 'डॉ. सुहैल');
  content = content.replace(/د\. محمد/g, 'د. سهيل');

  fs.writeFileSync(path.join(localesDir, file), content, 'utf-8');
  console.log(`✓ Updated ${file}`);
});
