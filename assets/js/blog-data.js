/**
 * Redesign Dental Clinics — Centralized Blog Data Repository
 * Contains metadata, categories, slugs, image assets, reading times,
 * authoritative sources, and related article relationships for 15 fact-checked dental articles.
 */

(function () {
  'use strict';

  var BLOG_CATEGORIES = [
    { id: 'all', key: 'blog.category.all', name: 'All Articles' },
    { id: 'implants', key: 'blog.category.implants', name: 'Dental Implants' },
    { id: 'restorative', key: 'blog.category.restorative', name: 'Restorative Dentistry' },
    { id: 'cosmetic', key: 'blog.category.cosmetic', name: 'Cosmetic Dentistry' },
    { id: 'preventive', key: 'blog.category.preventive', name: 'Preventive Dentistry' },
    { id: 'gum', key: 'blog.category.gum', name: 'Gum Health' },
    { id: 'pediatric', key: 'blog.category.pediatric', name: 'Pediatric Dentistry' },
    { id: 'orthodontics', key: 'blog.category.orthodontics', name: 'Orthodontics' },
    { id: 'surgery', key: 'blog.category.surgery', name: 'Oral Surgery' },
    { id: 'emergency', key: 'blog.category.emergency', name: 'Emergency Dental Care' }
  ];

  var BLOG_ARTICLES = [
    {
      id: 'post-1',
      slug: 'dental-implants-guide',
      category: 'implants',
      categoryName: 'Dental Implants',
      categoryKey: 'blog.category.implants',
      image: 'assets/img/69e08934027da1962be46dc7_blog-image-3.jpg',
      alt: 'Dental implant model with titanium post and zirconia crown restoration',
      publishedAt: 'June 15, 2026',
      readingTime: 6,
      author: 'Redesign Dental Clinics',
      titleKey: 'blog.post1.title',
      excerptKey: 'blog.post1.excerpt',
      serviceLink: '/services',
      serviceTextKey: 'service.dentalImplants.name',
      sources: [
        {
          name: 'American Dental Association (ADA)',
          title: 'Dental Implants: Overview & Research',
          url: 'https://www.ada.org/resources/research/science-and-research-institute/oral-health-topics/dental-implants'
        },
        {
          name: 'National Institute of Dental and Craniofacial Research (NIDCR)',
          title: 'Tooth Loss and Replacement Options',
          url: 'https://www.nidcr.nih.gov/health-info/tooth-loss'
        }
      ],
      relatedSlugs: ['dental-crowns-guide', 'full-mouth-rehabilitation', 'gum-disease-warning-signs']
    },
    {
      id: 'post-2',
      slug: 'root-canal-treatment-guide',
      category: 'restorative',
      categoryName: 'Restorative Dentistry',
      categoryKey: 'blog.category.restorative',
      image: 'assets/img/69e15ed5f04ff9636a17e1e8_blog-image-4.jpg',
      alt: 'Specialist dentist discussing root canal treatment and dental radiograph',
      publishedAt: 'June 20, 2026',
      readingTime: 5,
      author: 'Redesign Dental Clinics',
      titleKey: 'blog.post2.title',
      excerptKey: 'blog.post2.excerpt',
      serviceLink: '/services',
      serviceTextKey: 'service.rootCanal.name',
      sources: [
        {
          name: 'American Association of Endodontists (AAE)',
          title: 'What is a Root Canal? Treatment Overview',
          url: 'https://www.aae.org/patients/root-canal-treatment/what-is-a-root-canal/'
        },
        {
          name: 'American Dental Association (ADA)',
          title: 'Root Canals Information Guide',
          url: 'https://www.mouthhealthy.org/all-topics-a-z/root-canals'
        }
      ],
      relatedSlugs: ['dental-crowns-guide', 'emergency-dental-care-guide', 'oral-hygiene-tips']
    },
    {
      id: 'post-3',
      slug: 'dental-crowns-guide',
      category: 'restorative',
      categoryName: 'Restorative Dentistry',
      categoryKey: 'blog.category.restorative',
      image: 'assets/img/69e15ff64495113a87fc8c93_blog-image-5.jpg',
      alt: 'High precision ceramic and zirconia dental crown restoration',
      publishedAt: 'June 28, 2026',
      readingTime: 5,
      author: 'Redesign Dental Clinics',
      titleKey: 'blog.post3.title',
      excerptKey: 'blog.post3.excerpt',
      serviceLink: '/services',
      serviceTextKey: 'service.crownsBridges.name',
      sources: [
        {
          name: 'National Institute of Dental and Craniofacial Research (NIDCR)',
          title: 'Restorative Materials and Oral Health',
          url: 'https://www.nidcr.nih.gov/health-info/restorative-materials'
        },
        {
          name: 'American Dental Association (ADA)',
          title: 'Dental Crowns Overview',
          url: 'https://www.mouthhealthy.org/all-topics-a-z/crowns'
        }
      ],
      relatedSlugs: ['root-canal-treatment-guide', 'dental-implants-guide', 'full-mouth-rehabilitation']
    },
    {
      id: 'post-4',
      slug: 'full-mouth-rehabilitation',
      category: 'restorative',
      categoryName: 'Restorative Dentistry',
      categoryKey: 'blog.category.restorative',
      image: 'assets/img/69e088e30997df57b27b8a2a_blog-image-2.jpg',
      alt: 'Full mouth dental reconstruction and comprehensive smile restoration planning',
      publishedAt: 'July 4, 2026',
      readingTime: 7,
      author: 'Redesign Dental Clinics',
      titleKey: 'blog.post4.title',
      excerptKey: 'blog.post4.excerpt',
      serviceLink: '/services',
      serviceTextKey: 'service.fullMouthRehab.name',
      sources: [
        {
          name: 'American College of Prosthodontists (ACP)',
          title: 'Prosthodontic Treatment & Rehabilitation',
          url: 'https://www.prosthodontics.org/about-prosthodontics/'
        },
        {
          name: 'American Dental Association (ADA)',
          title: 'Comprehensive Oral Care Practice',
          url: 'https://www.ada.org/resources/research/science-and-research-institute/oral-health-topics'
        }
      ],
      relatedSlugs: ['dental-implants-guide', 'dental-crowns-guide', 'veneers-and-smile-makeovers']
    },
    {
      id: 'post-5',
      slug: 'oral-hygiene-tips',
      category: 'preventive',
      categoryName: 'Preventive Dentistry',
      categoryKey: 'blog.category.preventive',
      image: 'assets/img/69e15ed5f04ff9636a17e1e8_blog-image-4.jpg',
      alt: 'Dental professional demonstrating proper brushing and daily oral hygiene techniques',
      publishedAt: 'July 10, 2026',
      readingTime: 5,
      author: 'Redesign Dental Clinics',
      titleKey: 'blog.post5.title',
      excerptKey: 'blog.post5.excerpt',
      serviceLink: '/services',
      serviceTextKey: 'service.teethCleaning.name',
      sources: [
        {
          name: 'World Health Organization (WHO)',
          title: 'Global Oral Health Fact Sheet & Guidelines',
          url: 'https://www.who.int/news-room/fact-sheets/detail/oral-health'
        },
        {
          name: 'National Institute of Dental and Craniofacial Research (NIDCR)',
          title: 'Taking Care of Your Teeth and Mouth',
          url: 'https://www.nidcr.nih.gov/health-info/oral-hygiene'
        },
        {
          name: 'American Dental Association (ADA)',
          title: 'Brushing and Flossing Recommendations',
          url: 'https://www.mouthhealthy.org/all-topics-a-z/brushing-your-teeth'
        }
      ],
      relatedSlugs: ['why-bleeding-gums-matter', 'fluoride-and-cavity-prevention', 'dental-checkup-frequency']
    },
    {
      id: 'post-6',
      slug: 'teeth-whitening-guide',
      category: 'cosmetic',
      categoryName: 'Cosmetic Dentistry',
      categoryKey: 'blog.category.cosmetic',
      image: 'assets/img/69e08597f8fc3a0c6881b0b3_blog-image-1.jpg',
      alt: 'Professional teeth whitening and cosmetic smile enhancement procedure',
      publishedAt: 'July 16, 2026',
      readingTime: 5,
      author: 'Redesign Dental Clinics',
      titleKey: 'blog.post6.title',
      excerptKey: 'blog.post6.excerpt',
      serviceLink: '/services',
      serviceTextKey: 'service.teethWhitening.name',
      sources: [
        {
          name: 'American Dental Association (ADA)',
          title: 'Tooth Whitening / Bleaching: Treatment Considerations',
          url: 'https://www.ada.org/resources/research/science-and-research-institute/oral-health-topics/whitening'
        },
        {
          name: 'National Institute of Dental and Craniofacial Research (NIDCR)',
          title: 'Cosmetic Dental Procedures',
          url: 'https://www.nidcr.nih.gov/health-info'
        }
      ],
      relatedSlugs: ['veneers-and-smile-makeovers', 'oral-hygiene-tips', 'dental-crowns-guide']
    },
    {
      id: 'post-7',
      slug: 'gum-disease-warning-signs',
      category: 'gum',
      categoryName: 'Gum Health',
      categoryKey: 'blog.category.gum',
      image: 'assets/img/69e1602ff6439f6075d47037_blog-image-6.jpg',
      alt: 'Periodontal gum examination evaluating gingival health and pocket depth',
      publishedAt: 'July 22, 2026',
      readingTime: 6,
      author: 'Redesign Dental Clinics',
      titleKey: 'blog.post7.title',
      excerptKey: 'blog.post7.excerpt',
      serviceLink: '/services',
      serviceTextKey: 'service.gumTreatment.name',
      sources: [
        {
          name: 'National Institute of Dental and Craniofacial Research (NIDCR)',
          title: 'Periodontal (Gum) Disease: Causes, Symptoms, and Treatments',
          url: 'https://www.nidcr.nih.gov/health-info/gum-disease'
        },
        {
          name: 'Centers for Disease Control and Prevention (CDC)',
          title: 'Periodontal Disease Overview',
          url: 'https://www.cdc.gov/oral-health/conditions/periodontal-disease.html'
        }
      ],
      relatedSlugs: ['why-bleeding-gums-matter', 'oral-hygiene-tips', 'dental-checkup-frequency']
    },
    {
      id: 'post-8',
      slug: 'fluoride-and-cavity-prevention',
      category: 'preventive',
      categoryName: 'Preventive Dentistry',
      categoryKey: 'blog.category.preventive',
      image: 'assets/img/gen_service-thumbnail-image-3.jpg',
      alt: 'Dental fluoride application protecting tooth enamel from decay',
      publishedAt: 'July 28, 2026',
      readingTime: 5,
      author: 'Redesign Dental Clinics',
      titleKey: 'blog.post8.title',
      excerptKey: 'blog.post8.excerpt',
      serviceLink: '/services',
      serviceTextKey: 'service.preventiveCare.name',
      sources: [
        {
          name: 'Centers for Disease Control and Prevention (CDC)',
          title: 'Community Water Fluoridation & Fluoride Varnish 2026 Evidence',
          url: 'https://www.cdc.gov/oral-health/prevention-strategies/fluoride-varnish.html'
        },
        {
          name: 'American Dental Association (ADA)',
          title: 'Fluoride in Dental Care',
          url: 'https://www.ada.org/resources/research/science-and-research-institute/oral-health-topics/fluoride-topical-and-systemic-supplements'
        }
      ],
      relatedSlugs: ['children-dental-care-guide', 'oral-hygiene-tips', 'dental-checkup-frequency']
    },
    {
      id: 'post-9',
      slug: 'dental-checkup-frequency',
      category: 'all',
      categoryName: 'Dental Care',
      categoryKey: 'blog.category.all',
      image: 'assets/img/gen_dentist-examining-patients-teeth-close-up_1.jpg',
      alt: 'Dentist conducting comprehensive oral examination and digital assessment',
      publishedAt: 'August 3, 2026',
      readingTime: 5,
      author: 'Redesign Dental Clinics',
      titleKey: 'blog.post9.title',
      excerptKey: 'blog.post9.excerpt',
      serviceLink: '/services',
      serviceTextKey: 'service.checkups.name',
      sources: [
        {
          name: 'American Dental Association (ADA)',
          title: 'Frequency of Dental Visits',
          url: 'https://www.mouthhealthy.org/all-topics-a-z/dental-visit-frequency'
        },
        {
          name: 'Cochrane Oral Health',
          title: 'Recall Intervals for Routine Dental Care',
          url: 'https://www.cochrane.org/CD004338/ORAL_recall-intervals-for-routine-dental-care'
        }
      ],
      relatedSlugs: ['oral-hygiene-tips', 'gum-disease-warning-signs', 'emergency-dental-care-guide']
    },
    {
      id: 'post-10',
      slug: 'emergency-dental-care-guide',
      category: 'emergency',
      categoryName: 'Emergency Dental Care',
      categoryKey: 'blog.category.emergency',
      image: 'assets/img/gen_blog-image-1.jpg',
      alt: 'Emergency dental care consultation for acute toothache and trauma',
      publishedAt: 'August 8, 2026',
      readingTime: 5,
      author: 'Redesign Dental Clinics',
      titleKey: 'blog.post10.title',
      excerptKey: 'blog.post10.excerpt',
      serviceLink: '/services',
      serviceTextKey: 'service.emergencyCare.name',
      sources: [
        {
          name: 'American Dental Association (ADA)',
          title: 'Dental Emergencies Guide',
          url: 'https://www.mouthhealthy.org/all-topics-a-z/dental-emergencies'
        },
        {
          name: 'American Association of Endodontists (AAE)',
          title: 'Traumatic Dental Injuries',
          url: 'https://www.aae.org/patients/dental-symptoms/traumatic-dental-injuries/'
        }
      ],
      relatedSlugs: ['root-canal-treatment-guide', 'wisdom-tooth-removal-guide', 'dental-checkup-frequency']
    },
    {
      id: 'post-11',
      slug: 'veneers-and-smile-makeovers',
      category: 'cosmetic',
      categoryName: 'Cosmetic Dentistry',
      categoryKey: 'blog.category.cosmetic',
      image: 'assets/img/gen_blog-image-2.jpg',
      alt: 'Custom porcelain veneers and smile makeover aesthetic design',
      publishedAt: 'August 12, 2026',
      readingTime: 6,
      author: 'Redesign Dental Clinics',
      titleKey: 'blog.post11.title',
      excerptKey: 'blog.post11.excerpt',
      serviceLink: '/services',
      serviceTextKey: 'service.veneers.name',
      sources: [
        {
          name: 'American Academy of Cosmetic Dentistry (AACD)',
          title: 'Dental Veneers Overview',
          url: 'https://aacd.com/veneers'
        },
        {
          name: 'American Dental Association (ADA)',
          title: 'Veneers and Aesthetic Dental Options',
          url: 'https://www.mouthhealthy.org/all-topics-a-z/veneers'
        }
      ],
      relatedSlugs: ['teeth-whitening-guide', 'clear-invisible-braces-guide', 'full-mouth-rehabilitation']
    },
    {
      id: 'post-12',
      slug: 'clear-invisible-braces-guide',
      category: 'orthodontics',
      categoryName: 'Orthodontics',
      categoryKey: 'blog.category.orthodontics',
      image: 'assets/img/gen_blog-image-3.jpg',
      alt: 'Transparent clear aligners for discreet orthodontic tooth alignment',
      publishedAt: 'August 14, 2026',
      readingTime: 6,
      author: 'Redesign Dental Clinics',
      titleKey: 'blog.post12.title',
      excerptKey: 'blog.post12.excerpt',
      serviceLink: '/services',
      serviceTextKey: 'service.clearBraces.name',
      sources: [
        {
          name: 'American Association of Orthodontists (AAO)',
          title: 'Clear Aligners Information Guide',
          url: 'https://aaoinfo.org/treatments/clear-aligners/'
        },
        {
          name: 'American Dental Association (ADA)',
          title: 'Orthodontics & Aligners',
          url: 'https://www.mouthhealthy.org/all-topics-a-z/braces'
        }
      ],
      relatedSlugs: ['veneers-and-smile-makeovers', 'oral-hygiene-tips', 'dental-checkup-frequency']
    },
    {
      id: 'post-13',
      slug: 'wisdom-tooth-removal-guide',
      category: 'surgery',
      categoryName: 'Oral Surgery',
      categoryKey: 'blog.category.surgery',
      image: 'assets/img/gen_blog-image-4.jpg',
      alt: 'Oral surgeon reviewing digital panoramic X-ray of impacted wisdom teeth',
      publishedAt: 'August 16, 2026',
      readingTime: 5,
      author: 'Redesign Dental Clinics',
      titleKey: 'blog.post13.title',
      excerptKey: 'blog.post13.excerpt',
      serviceLink: '/services',
      serviceTextKey: 'service.wisdomTooth.name',
      sources: [
        {
          name: 'American Association of Oral and Maxillofacial Surgeons (AAOMS)',
          title: 'Management of Third Molar Wisdom Teeth',
          url: 'https://www.aaoms.org/practice-management/clinical-resources/wisdom-teeth'
        },
        {
          name: 'American Dental Association (ADA)',
          title: 'Wisdom Teeth Removal and Care',
          url: 'https://www.mouthhealthy.org/all-topics-a-z/wisdom-teeth'
        }
      ],
      relatedSlugs: ['emergency-dental-care-guide', 'root-canal-treatment-guide', 'dental-checkup-frequency']
    },
    {
      id: 'post-14',
      slug: 'why-bleeding-gums-matter',
      category: 'gum',
      categoryName: 'Gum Health',
      categoryKey: 'blog.category.gum',
      image: 'assets/img/gen_blog-image-5.jpg',
      alt: 'Clinical assessment of bleeding gums and gingival tissue inflammation',
      publishedAt: 'August 18, 2026',
      readingTime: 5,
      author: 'Redesign Dental Clinics',
      titleKey: 'blog.post14.title',
      excerptKey: 'blog.post14.excerpt',
      serviceLink: '/services',
      serviceTextKey: 'service.gumTreatment.name',
      sources: [
        {
          name: 'National Institute of Dental and Craniofacial Research (NIDCR)',
          title: 'Gum Disease: Symptoms and Risk Factors',
          url: 'https://www.nidcr.nih.gov/health-info/gum-disease'
        },
        {
          name: 'American Dental Association (ADA)',
          title: 'Bleeding Gums: Causes & Prevention',
          url: 'https://www.mouthhealthy.org/all-topics-a-z/bleeding-gums'
        }
      ],
      relatedSlugs: ['gum-disease-warning-signs', 'oral-hygiene-tips', 'dental-checkup-frequency']
    },
    {
      id: 'post-15',
      slug: 'children-dental-care-guide',
      category: 'pediatric',
      categoryName: 'Pediatric Dentistry',
      categoryKey: 'blog.category.pediatric',
      image: 'assets/img/gen_blog-image-6.jpg',
      alt: 'Pediatric dental consultation educating a child on brushing habits and smile care',
      publishedAt: 'August 20, 2026',
      readingTime: 5,
      author: 'Redesign Dental Clinics',
      titleKey: 'blog.post15.title',
      excerptKey: 'blog.post15.excerpt',
      serviceLink: '/services',
      serviceTextKey: 'service.pediatricCare.name',
      sources: [
        {
          name: 'Centers for Disease Control and Prevention (CDC)',
          title: "Children's Oral Health & Early Childhood Caries",
          url: 'https://www.cdc.gov/oral-health/prevention-strategies/children-oral-health.html'
        },
        {
          name: 'American Academy of Pediatric Dentistry (AAPD)',
          title: 'Perinatal & Infant Oral Health Care Recommendations',
          url: 'https://www.aapd.org/research/oral-health-policies--recommendations/'
        }
      ],
      relatedSlugs: ['fluoride-and-cavity-prevention', 'oral-hygiene-tips', 'dental-checkup-frequency']
    }
  ];

  window.__RC_BLOG_DATA__ = {
    categories: BLOG_CATEGORIES,
    articles: BLOG_ARTICLES,
    getArticleBySlug: function (slug) {
      return BLOG_ARTICLES.find(function (a) { return a.slug === slug; });
    },
    getRelatedArticles: function (slug) {
      var current = this.getArticleBySlug(slug);
      if (!current || !current.relatedSlugs) return [];
      return current.relatedSlugs.map(function (s) {
        return BLOG_ARTICLES.find(function (a) { return a.slug === s; });
      }).filter(Boolean);
    }
  };
})();
