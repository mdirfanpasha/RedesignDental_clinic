import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');
const serviceFilePath = path.join(rootDir, 'service.html');

let content = fs.readFileSync(serviceFilePath, 'utf-8');

// Replace the services script block in service.html
const oldScriptStart = '<!-- ===== SERVICES DATA & REAL-TIME FILTER ENGINE ===== -->';
const newServicesScript = `<!-- ===== SERVICES DATA & REAL-TIME FILTER ENGINE ===== -->
        <script>
            (function() {
                'use strict';

                // Category Definitions with i18n keys
                const categories = [
                    { id: 'endodontics', name: 'Endodontics', key: 'services.cat.endodontics' },
                    { id: 'preventive', name: 'Preventive & General Dentistry', key: 'services.cat.preventive' },
                    { id: 'cosmetic', name: 'Cosmetic Dentistry', key: 'services.cat.cosmetic' },
                    { id: 'restorative', name: 'Restorative Dentistry', key: 'services.cat.restorative' },
                    { id: 'oral-surgery', name: 'Oral Surgery', key: 'services.cat.surgery' },
                    { id: 'periodontics', name: 'Periodontics / Gum Care', key: 'services.cat.periodontics' },
                    { id: 'advanced', name: 'Advanced Dentistry', key: 'services.cat.advanced' },
                    { id: 'pediatric', name: 'Pediatric Dentistry', key: 'services.cat.pediatric' },
                    { id: 'emergency', name: 'Emergency Dental Care', key: 'services.cat.emergency' }
                ];

                // Complete Approved Services List (All 37 Services with exact i18n keys)
                const servicesData = [
                    // --- ENDODONTICS ---
                    {
                        key: "service.rootCanal",
                        name: "Root Canal Treatment",
                        category: "endodontics",
                        description: "Treatment designed to remove infection from inside a tooth and help preserve the natural tooth.",
                        image: "assets/img/gen_service-thumbnail-image.jpg"
                    },
                    {
                        key: "service.rootCanal",
                        name: "Root Canals",
                        category: "endodontics",
                        description: "A procedure that cleans and protects an infected or damaged tooth from further complications.",
                        image: "assets/img/699c52f336cd1c03293a16d6_service-thumbnail-image-p-500.jpg"
                    },
                    {
                        key: "service.endodonticRetreatment",
                        name: "Endodontic Retreatment",
                        category: "endodontics",
                        description: "A repeat root canal procedure for teeth that require additional endodontic care.",
                        image: "assets/img/gen_service-thumbnail-image-3.jpg"
                    },
                    {
                        key: "service.endodonticSurgery",
                        name: "Endodontic Surgery",
                        category: "endodontics",
                        description: "Specialized surgical treatment used when conventional root canal treatment requires additional intervention.",
                        image: "assets/img/gen_service-thumbnail-image-4.jpg"
                    },

                    // --- PREVENTIVE & GENERAL DENTISTRY ---
                    {
                        key: "service.teethCleaning",
                        name: "Teeth Cleaning",
                        category: "preventive",
                        description: "Professional cleaning that helps remove plaque, tartar, and surface buildup for healthier teeth and gums.",
                        image: "assets/img/gen_dentist-examining-patients-teeth-close-up_1.jpg"
                    },
                    {
                        key: "service.checkups",
                        name: "Check-ups",
                        category: "preventive",
                        description: "Routine dental examinations designed to monitor oral health and identify concerns early.",
                        image: "assets/img/gen_home-value-image.jpg"
                    },
                    {
                        key: "service.fillings",
                        name: "Fillings & Sealants",
                        category: "preventive",
                        description: "Protective and restorative treatments that help repair teeth and protect vulnerable surfaces.",
                        image: "assets/img/69ddaeb6ae6fea2f56ab02f9_home-value-image-p-500.webp"
                    },
                    {
                        key: "service.fillings",
                        name: "Fillings",
                        category: "preventive",
                        description: "Restorative treatment used to repair teeth affected by decay or minor damage.",
                        image: "assets/img/gen_our-story-image-1.jpg"
                    },
                    {
                        key: "service.preventiveCare",
                        name: "Preventive Care",
                        category: "preventive",
                        description: "Proactive dental care focused on maintaining oral health and reducing the risk of future problems.",
                        image: "assets/img/gen_about-hero-image.jpg"
                    },
                    {
                        key: "service.digitalXray",
                        name: "X-Ray",
                        category: "preventive",
                        description: "Dental imaging used to help evaluate areas that may not be visible during a routine examination.",
                        image: "assets/img/gen_our-story-image-3.jpg"
                    },

                    // --- COSMETIC DENTISTRY ---
                    {
                        key: "service.teethWhitening",
                        name: "Teeth Whitening",
                        category: "cosmetic",
                        description: "A cosmetic treatment designed to brighten teeth and improve the appearance of your smile.",
                        image: "assets/img/gen_service-thumbnail-image-2.jpg"
                    },
                    {
                        key: "service.teethWhitening",
                        name: "Teeth Whitening & Smile Makeovers",
                        category: "cosmetic",
                        description: "Personalized cosmetic care combining whitening and smile-enhancing treatments.",
                        image: "assets/img/69dde4c6be5aa13c0c8ac8bd_service-thumbnail-image-2-p-500.jpg"
                    },
                    {
                        key: "service.teethReshaping",
                        name: "Teeth Reshaping",
                        category: "cosmetic",
                        description: "Carefully reshaping selected teeth to improve their appearance, symmetry, or contours.",
                        image: "assets/img/gen_our-story-image-2.jpg"
                    },
                    {
                        key: "service.bonding",
                        name: "Bonding",
                        category: "cosmetic",
                        description: "A tooth-colored material can be applied to improve the shape or appearance of selected teeth.",
                        image: "assets/img/gen_story-image-1.jpg"
                    },
                    {
                        key: "service.veneers",
                        name: "Veneers",
                        category: "cosmetic",
                        description: "Thin custom-made coverings designed to improve the appearance of selected teeth.",
                        image: "assets/img/gen_story-image-2.jpg"
                    },
                    {
                        key: "service.cosmeticProcedures",
                        name: "Cosmetic Procedures",
                        category: "cosmetic",
                        description: "Smile-focused treatments designed to improve the appearance of teeth while supporting natural-looking results.",
                        image: "assets/img/gen_story-image-3.jpg"
                    },

                    // --- RESTORATIVE DENTISTRY ---
                    {
                        key: "service.dentalImplants",
                        name: "Dental Implants",
                        category: "restorative",
                        description: "A long-term tooth replacement option designed to restore function and the appearance of missing teeth.",
                        image: "assets/img/gen_story-image-4.jpg"
                    },
                    {
                        key: "service.dentalImplants",
                        name: "Dental Implants & Crowns",
                        category: "restorative",
                        description: "A combined restorative approach using implants and crowns to replace and restore missing teeth.",
                        image: "assets/img/gen_story-image-5.jpg"
                    },
                    {
                        key: "service.denturesBridges",
                        name: "Dentures & Bridges",
                        category: "restorative",
                        description: "Restorative solutions designed to replace missing teeth and support everyday function.",
                        image: "assets/img/gen_our-story-image-4.jpg"
                    },
                    {
                        key: "service.fullMouthRehab",
                        name: "Full Mouth Rehabilitation & Dentures",
                        category: "restorative",
                        description: "Comprehensive restorative care designed around the needs of patients requiring extensive dental rehabilitation.",
                        image: "assets/img/gen_our-story-image-5.jpg"
                    },

                    // --- ORAL SURGERY ---
                    {
                        key: "service.extractions",
                        name: "Extractions",
                        category: "oral-surgery",
                        description: "Professional removal of teeth when extraction is clinically necessary.",
                        image: "assets/img/69e041cad257c10b1176cd81_success-item-image-1-p-500.webp"
                    },
                    {
                        key: "service.wisdomTooth",
                        name: "Wisdom Tooth Extraction",
                        category: "oral-surgery",
                        description: "Specialized removal of wisdom teeth when they cause or are likely to cause dental problems.",
                        image: "assets/img/69e041cb0a159b45d163a9ea_success-item-image-2-p-500.webp"
                    },
                    {
                        key: "service.oralSurgery",
                        name: "Oral Surgery",
                        category: "oral-surgery",
                        description: "Surgical dental procedures performed to address specific oral and dental conditions.",
                        image: "assets/img/69e04a22703503e46c521e06_job-image-1-p-500.webp"
                    },
                    {
                        key: "service.ridgePreservation",
                        name: "Ridge Preservation",
                        category: "oral-surgery",
                        description: "A restorative procedure designed to help maintain the shape and condition of the jaw ridge after tooth removal.",
                        image: "assets/img/69e04a224235a048c0681b59_job-image-2-p-500.webp"
                    },

                    // --- PERIODONTICS / GUM CARE ---
                    {
                        key: "service.gumTreatment",
                        name: "Gum Treatment",
                        category: "periodontics",
                        description: "Care focused on improving gum health and managing periodontal concerns.",
                        image: "assets/img/69e04a223f433596d3d0395e_job-image-5-p-500.webp"
                    },
                    {
                        key: "service.gumGrafting",
                        name: "Gum Grafting",
                        category: "periodontics",
                        description: "A periodontal procedure designed to address areas of gum recession and support gum health.",
                        image: "assets/img/69e04a22189ced06cbe03360_job-image-3-p-500.webp"
                    },
                    {
                        key: "service.nonSurgicalPerio",
                        name: "Non-Surgical Periodontal Therapy",
                        category: "periodontics",
                        description: "Non-surgical treatment designed to manage gum disease and improve periodontal health.",
                        image: "assets/img/69e04a22dc5ccb1bff991531_job-image-4-p-500.webp"
                    },
                    {
                        key: "service.pocketReduction",
                        name: "Periodontal Pocket Reduction",
                        category: "periodontics",
                        description: "Treatment focused on reducing deep periodontal pockets and supporting healthier gums.",
                        image: "assets/img/69e1254bc12dfcfe31c2c09e_location-image-1-p-500.webp"
                    },
                    {
                        key: "service.scalingRootPlaning",
                        name: "Scaling & Root Planing",
                        category: "periodontics",
                        description: "Deep cleaning treatment designed to remove deposits around the teeth and smooth affected root surfaces.",
                        image: "assets/img/69e1254b5bfb8519af35c271_location-image-2-p-500.webp"
                    },

                    // --- ADVANCED DENTISTRY ---
                    {
                        key: "service.laserDentistry",
                        name: "Laser Dentistry",
                        category: "advanced",
                        description: "Modern dental techniques using laser technology for selected procedures and treatments.",
                        image: "assets/img/69e1254a118093ebd39a1ec4_location-image-3-p-500.webp"
                    },
                    {
                        key: "service.clearBraces",
                        name: "Clear & Invisible Braces",
                        category: "advanced",
                        description: "Discreet orthodontic options designed to gradually improve tooth alignment.",
                        image: "assets/img/gen_blog-image-1.jpg"
                    },
                    {
                        key: "service.sedation",
                        name: "Sedation",
                        category: "advanced",
                        description: "Sedation options that may help suitable patients feel more relaxed during selected dental procedures.",
                        image: "assets/img/gen_blog-image-2.jpg"
                    },

                    // --- PEDIATRIC DENTISTRY ---
                    {
                        key: "service.pediatricCare",
                        name: "Pediatric Dental Care / Paediatrics",
                        category: "pediatric",
                        description: "Dental care tailored to the oral health needs of children at different stages of development.",
                        image: "assets/img/gen_blog-image-3.jpg"
                    },
                    {
                        key: "service.mouthGuards",
                        name: "Mouth Guards",
                        category: "pediatric",
                        description: "Protective dental appliances designed to help safeguard teeth during activities such as sports or nighttime grinding.",
                        image: "assets/img/gen_blog-image-4.jpg"
                    },

                    // --- EMERGENCY DENTISTRY ---
                    {
                        key: "service.emergencyCare",
                        name: "Emergency Care",
                        category: "emergency",
                        description: "Prompt dental attention for urgent problems such as severe pain, injury, or unexpected dental concerns.",
                        image: "assets/img/gen_hero-2.jpg"
                    },
                    {
                        key: "service.painManagement",
                        name: "Pain Management",
                        category: "emergency",
                        description: "Approaches focused on helping patients manage dental discomfort before, during, and after treatment.",
                        image: "assets/img/gen_hero-3.jpg"
                    },
                    {
                        key: "service.toothacheRelief",
                        name: "Toothache Relief",
                        category: "emergency",
                        description: "Assessment and appropriate treatment aimed at identifying and addressing the cause of tooth pain.",
                        image: "assets/img/gen_hero-4.jpg"
                    }
                ];

                let currentCategory = 'all';
                let searchQuery = '';

                const containerEl = document.getElementById('services-output-container');
                const searchInputEl = document.getElementById('service-search-input');
                const searchClearEl = document.getElementById('service-search-clear');
                const pillsContainerEl = document.getElementById('category-pills-container');

                function getLocalizedText(key, fallback) {
                    if (window.i18n && typeof window.i18n.t === 'function') {
                        const val = window.i18n.t(key);
                        if (val && val !== key) return val;
                    }
                    return fallback;
                }

                function renderCardHTML(item) {
                    const categoryObj = categories.find(c => c.id === item.category);
                    const categoryName = categoryObj ? getLocalizedText(categoryObj.key, categoryObj.name) : 'Dental Service';
                    const itemName = getLocalizedText(item.key + '.name', item.name);
                    const itemDesc = getLocalizedText(item.key + '.desc', item.description);
                    const ctaText = getLocalizedText('nav.bookAppointment', 'Book Appointment');

                    return \`
                        <article class="glass-service-card-light">
                            <div class="card-image-wrap">
                                <span class="card-tag-light">\${categoryName}</span>
                                <img src="\${item.image}" alt="\${itemName} — Redesign Clinics" loading="lazy" />
                            </div>
                            <div class="card-body">
                                <h3 class="card-title-light">\${itemName}</h3>
                                <p class="card-desc-light">\${itemDesc}</p>
                            </div>
                            <div class="card-footer-light">
                                <a href="#book" class="card-cta-btn-light" aria-label="\${ctaText} for \${itemName}">
                                    <span>\${ctaText}</span>
                                    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M6 12L10 8L6 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                </a>
                            </div>
                        </article>
                    \`;
                }

                function updateCategoryPillsText() {
                    if (!pillsContainerEl) return;
                    pillsContainerEl.querySelectorAll('.category-pill-light').forEach(btn => {
                        const catId = btn.getAttribute('data-category');
                        if (catId === 'all') {
                            btn.textContent = getLocalizedText('services.allTab', 'All Services (37)');
                        } else {
                            const catObj = categories.find(c => c.id === catId);
                            if (catObj) {
                                btn.textContent = getLocalizedText(catObj.key, catObj.name);
                            }
                        }
                    });
                }

                function renderServices() {
                    updateCategoryPillsText();
                    const query = searchQuery.trim().toLowerCase();

                    const filtered = servicesData.filter(item => {
                        const matchesCategory = (currentCategory === 'all' || item.category === currentCategory);
                        const itemName = getLocalizedText(item.key + '.name', item.name).toLowerCase();
                        const itemDesc = getLocalizedText(item.key + '.desc', item.description).toLowerCase();
                        const matchesSearch = query === '' || 
                            itemName.includes(query) || 
                            itemDesc.includes(query) ||
                            item.name.toLowerCase().includes(query) ||
                            item.description.toLowerCase().includes(query);
                        return matchesCategory && matchesSearch;
                    });

                    if (filtered.length === 0) {
                        const noResultsText = getLocalizedText('services.noResults', 'No matching dental services found. Try clearing your search query or selecting a different category filter.');
                        containerEl.innerHTML = \`
                            <div class="no-results-box-light">
                                <h3 class="no-results-title-light">\${noResultsText}</h3>
                            </div>
                        \`;
                        return;
                    }

                    let html = '';
                    
                    if (currentCategory === 'all' && query === '') {
                        categories.forEach(cat => {
                            const catItems = filtered.filter(item => item.category === cat.id);
                            if (catItems.length > 0) {
                                const catTitle = getLocalizedText(cat.key, cat.name);
                                html += \`
                                    <div class="service-category-group">
                                        <div class="service-category-header-light">
                                            <h2 class="service-category-title-light">\${catTitle}</h2>
                                            <span class="service-category-badge-light">\${catItems.length}</span>
                                        </div>
                                        <div class="services-grid">
                                            \${catItems.map(renderCardHTML).join('')}
                                        </div>
                                    </div>
                                \`;
                            }
                        });
                    } else {
                        const catObj = categories.find(c => c.id === currentCategory);
                        const headerTitle = query ? \`\${getLocalizedText('common.search', 'Search')}: "\${searchQuery}"\` : (catObj ? getLocalizedText(catObj.key, catObj.name) : 'Filtered Services');
                        html += \`
                            <div class="service-category-group">
                                <div class="service-category-header-light">
                                    <h2 class="service-category-title-light">\${headerTitle}</h2>
                                    <span class="service-category-badge-light">\${filtered.length}</span>
                                </div>
                                <div class="services-grid">
                                    \${filtered.map(renderCardHTML).join('')}
                                </div>
                            </div>
                        \`;
                    }

                    containerEl.innerHTML = html;

                    if (window.bindLumoraImageGuard) {
                        document.querySelectorAll('#services-output-container img').forEach(window.bindLumoraImageGuard);
                    }
                }

                if (searchInputEl) {
                    searchInputEl.addEventListener('input', function(e) {
                        searchQuery = e.target.value;
                        if (searchClearEl) {
                            searchClearEl.style.display = searchQuery ? 'block' : 'none';
                        }
                        renderServices();
                    });
                }

                if (searchClearEl) {
                    searchClearEl.addEventListener('click', function() {
                        if (searchInputEl) searchInputEl.value = '';
                        searchQuery = '';
                        searchClearEl.style.display = 'none';
                        renderServices();
                        if (searchInputEl) searchInputEl.focus();
                    });
                }

                if (pillsContainerEl) {
                    pillsContainerEl.addEventListener('click', function(e) {
                        const btn = e.target.closest('.category-pill-light');
                        if (!btn) return;
                        pillsContainerEl.querySelectorAll('.category-pill-light').forEach(b => {
                            b.classList.remove('is-active');
                            b.setAttribute('aria-selected', 'false');
                        });
                        btn.classList.add('is-active');
                        btn.setAttribute('aria-selected', 'true');
                        currentCategory = btn.getAttribute('data-category') || 'all';
                        renderServices();
                    });
                }

                // Listen to global language change
                window.addEventListener('rcLanguageChanged', function() {
                    renderServices();
                });

                // Initial Render
                renderServices();
            })();
        </script>`;

const scriptIdx = content.indexOf(oldScriptStart);
if (scriptIdx !== -1) {
  content = content.substring(0, scriptIdx) + newServicesScript + '\n    </body>\n</html>';
  fs.writeFileSync(serviceFilePath, content, 'utf-8');
  console.log('✓ Successfully injected localized services engine into service.html');
} else {
  console.error('Could not find script start marker in service.html');
}
