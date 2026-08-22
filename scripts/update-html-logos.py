import os
import re

dark_nav_pages = [
    'index.html',
    'about.html',
    'services.html',
    'service.html',
    'gallery.html',
    'blog.html',
    'contact.html'
]

light_nav_pages = [
    'privacy.html',
    'terms.html',
    'cookies.html',
    'licenses.html',
    '404.html'
]

# 1. Update dark nav pages
for filename in dark_nav_pages:
    if not os.path.exists(filename):
        continue
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()

    # Navbar logo -> white logo for contrast on dark navbar
    content = re.sub(
        r'(<a[^>]*class="[^"]*navbar_logo[^"]*"[^>]*>\s*<img[^>]*src=")assets/img/[^"]+(")',
        r'\1assets/img/redesign-dental-clinics-logo-white.png\2',
        content
    )

    # Footer logo -> white logo
    content = re.sub(
        r'(<a[^>]*class="[^"]*footer_brand[^"]*"[^>]*>\s*<img[^>]*src=")assets/img/[^"]+(")',
        r'\1assets/img/redesign-dental-clinics-logo-white.png\2',
        content
    )

    # Standardize all logo alt text to "Redesign Dental Clinics"
    content = re.sub(
        r'alt="(?:Redesign Clinics logo|Lumora logo|Redesign Dental Clinics logo|Lumora|Redesign Clinics)"',
        'alt="Redesign Dental Clinics"',
        content
    )

    with open(filename, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Updated dark-nav page: {filename}")

# 2. Update light nav pages
for filename in light_nav_pages:
    if not os.path.exists(filename):
        continue
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()

    # Nav logo -> black logo for contrast on white background
    content = re.sub(
        r'(<img[^>]*src=")assets/img/[^"]+(")',
        r'\1assets/img/redesign-dental-clinics-logo.png\2',
        content
    )

    content = re.sub(
        r'alt="(?:Redesign Clinics logo|Lumora logo|Redesign Dental Clinics logo|Lumora|Redesign Clinics)"',
        'alt="Redesign Dental Clinics"',
        content
    )

    with open(filename, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Updated light-nav page: {filename}")
