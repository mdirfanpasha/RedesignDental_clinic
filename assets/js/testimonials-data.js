/**
 * testimonials-data.js
 * Centralized data source for Redesign Dental Clinics hybrid testimonial carousel.
 * 
 * Items 1-4: Flip-enabled with authentic real patient videos (t1.mp4, t2.mp4, t3.mp4, t4.mp4)
 * Items 5-10: Authentic text-only patient testimonials
 */

const testimonialsData = [
  {
    id: "testimonial-1",
    type: "video",
    author: "Syed Mohammed",
    designation: "Practo Patient Story",
    quote: "Dr Suhail is very professional and patient. He explained the root canal procedure clearly before starting and made sure I felt no pain throughout the treatment. I am extremely satisfied with the care provided.",
    video: "assets/video/t1.mp4",
    logo: "assets/img/redesign-dental-clinics-logo.png"
  },
  {
    id: "testimonial-2",
    type: "video",
    author: "Verified Patient",
    designation: "Practo Patient Story",
    quote: "I had a tooth extraction done by Dr Suhail. I was very anxious before the procedure, but Dr Suhail and the staff were very reassuring and gentle. The entire extraction process was smooth and comfortable.",
    video: "assets/video/t2.mp4",
    logo: "assets/img/redesign-dental-clinics-logo.png"
  },
  {
    id: "testimonial-3",
    type: "video",
    author: "Ali",
    designation: "Practo Patient Story",
    quote: "Very friendly, soft spoken and professional team at Redesign Dental Clinics. The clinic is clean and well maintained with modern equipment. Highly recommend for any dental treatment.",
    video: "assets/video/t3.mp4",
    logo: "assets/img/redesign-dental-clinics-logo.png"
  },
  {
    id: "testimonial-4",
    type: "video",
    author: "Rahul",
    designation: "Practo Patient Story",
    quote: "Dr Suhail took time to explain my dental condition and treatment options clearly. He was considerate and professional during the implant procedure. Excellent doctor and clinic.",
    video: "assets/video/t4.mp4",
    logo: "assets/img/redesign-dental-clinics-logo.png"
  },
  {
    id: "testimonial-5",
    type: "text",
    author: "Verified Patient",
    designation: "Practo Patient Story",
    quote: "Clean, well maintained and hygienic clinic in Banjara Hills. Dr Suhail is soft spoken and gives honest advice without unnecessary procedures. Very good dental experience.",
    logo: "assets/img/redesign-dental-clinics-logo.png"
  },
  {
    id: "testimonial-6",
    type: "text",
    author: "Umar Khan",
    designation: "Justdial Review",
    quote: "Brought my son for dental treatment here. Everything was done smoothly and perfectly by Dr Suhail and his team. Very caring doctors and friendly staff.",
    logo: "assets/img/redesign-dental-clinics-logo.png"
  },
  {
    id: "testimonial-7",
    type: "text",
    author: "Shy",
    designation: "Justdial Review",
    quote: "Reasonable treatment costs and high quality modern dental facilities. The doctors and staff are soft spoken and professional. Very happy with the service.",
    logo: "assets/img/redesign-dental-clinics-logo.png"
  },
  {
    id: "testimonial-8",
    type: "text",
    author: "Verified Patient",
    designation: "Google Review",
    quote: "I was nervous about my dental checkup, but the doctor made me feel completely comfortable and explained every step of the treatment clearly. Great experience at Redesign Dental Clinics.",
    logo: "assets/img/redesign-dental-clinics-logo.png"
  },
  {
    id: "testimonial-9",
    type: "text",
    author: "Verified Patient",
    designation: "Google Review",
    quote: "Exceptional patient care and state of the art equipment. Dr Suhail and his team provide comfortable and gentle dental care in Banjara Hills.",
    logo: "assets/img/redesign-dental-clinics-logo.png"
  },
  {
    id: "testimonial-10",
    type: "text",
    author: "Verified Patient",
    designation: "Google Review",
    quote: "Highly recommend Redesign Dental Clinics for professional dental care in Banjara Hills. Friendly staff, welcoming environment, and excellent doctor.",
    logo: "assets/img/redesign-dental-clinics-logo.png"
  }
];

if (typeof window !== 'undefined') {
  window.testimonialsData = testimonialsData;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = testimonialsData;
}
