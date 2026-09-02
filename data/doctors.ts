export interface Doctor {
  id: string;
  name: string;
  title: string;
  qualification: string;
  specialty: string;
  experience: string;
  image: string;
  featured: boolean;
  bio: string;
}

export interface FloatingDoctorAsset {
  id: string;
  name: string;
  illustration: string;
  fallbackIllustration: string;
  ariaLabel: string;
  targetAnchor: string;
}

export const floatingDoctorAsset: FloatingDoctorAsset = {
  id: "dr-suhail-floating",
  name: "Dr. Suhail A. Syed",
  illustration: "assets/img/dr-suhail-floating-icon.png",
  fallbackIllustration: "assets/img/suhail_icon-removebg-preview.png",
  ariaLabel: "Meet Dr. Suhail A. Syed",
  targetAnchor: "#doctor-profile"
};

export const doctors: Doctor[] = [
  {
    id: "dr-suhail-a-syed",
    name: "Dr. Suhail A. Syed",
    title: "Chief Dental Surgeon & Implantologist",
    qualification: "BDS, MDS - Periodontics, MS (Strategic Implantology)",
    specialty: "Dental Implants & Periodontics",
    experience: "20+ Years Experience",
    image: "assets/img/dr-suhail.webp",
    featured: true,
    bio: "Chief Dental Surgeon leading Redesign Dental Clinics with over two decades of clinical excellence in advanced implantology, periodontics, and complete smile makeovers."
  },
  {
    id: "dr-bilal-ahmed-asaq",
    name: "Dr. Bilal Ahmed Asaq",
    title: "Consultant Orthodontist & Dentofacial Orthopedics",
    qualification: "BDS, MDS - Orthodontics",
    specialty: "Clear Aligners & Invisible Braces",
    experience: "10+ Years Experience",
    image: "assets/img/doctors/doctor-04.webp",
    featured: false,
    bio: "Specializing in contemporary orthodontics, customized clear aligners, and aesthetic smile alignment for adults and teens."
  },
  {
    id: "dr-ahmed-ali-khan",
    name: "Dr. Ahmed Ali Khan",
    title: "Consultant Endodontist & Conservative Dentist",
    qualification: "BDS, MDS - Endodontics",
    specialty: "Painless Root Canal & Restorations",
    experience: "12+ Years Experience",
    image: "assets/img/doctors/doctor-03.webp",
    featured: false,
    bio: "Expert in single-sitting painless root canal treatments, rotary endodontics, and microscopic tooth-saving restorative procedures."
  },
  {
    id: "dr-nooruddin-talha",
    name: "Dr. Nooruddin Talha",
    title: "Consultant Prosthodontist & Implantologist",
    qualification: "BDS, MDS - Prosthodontics",
    specialty: "Veneers, Crowns & Full Mouth Rehab",
    experience: "9+ Years Experience",
    image: "assets/img/doctors/doctor-02.webp",
    featured: false,
    bio: "Dedicated to precision ceramic veneers, zirconia crowns, full arch restorations, and aesthetic rehabilitation."
  },
  {
    id: "dr-specialist-surgeon",
    name: "Consultant Dental Specialist",
    title: "Aesthetic Dentistry & Oral Surgery",
    qualification: "BDS, MDS",
    specialty: "Aesthetic Dentistry & Preventive Care",
    experience: "8+ Years Experience",
    image: "assets/img/doctors/doctor-05.webp",
    featured: false,
    bio: "Specialist in painless restorative dentistry, cosmetic smile aesthetics, and preventive dental therapies."
  }
];
