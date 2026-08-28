import os
from PIL import Image

src_path = r"C:\Users\Mohammed irfan pasha\.gemini\antigravity-ide\brain\ad671b37-cb65-44c6-bd9e-653ac28832a0\.user_uploaded\media_1787850468611.jpg"

if not os.path.exists(src_path):
    print("Source image not found:", src_path)
    exit(1)

img = Image.open(src_path).convert("RGB")
w, h = img.size
print(f"Loaded source image: {w}x{h}")

# Target destinations
targets = [
    ("assets/img/dr-suhail.jpg", "JPEG", 95),
    ("assets/img/dr-suhail.webp", "WEBP", 92),
    ("assets/img/69de3a2ffad0bdd1136a1bcd_team-image-1.jpg", "JPEG", 95),
    ("assets/video/dr-suhail-poster.jpg", "JPEG", 95),
    ("assets/img/hero/dr-suhail-redesign-dental.webp", "WEBP", 92),
    ("assets/img/hero/dr-suhail-redesign-dental.png", "PNG", None),
]

for out_path, fmt, q in targets:
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    if q:
        img.save(out_path, format=fmt, quality=q)
    else:
        img.save(out_path, format=fmt)
    print(f"Saved {out_path} ({fmt})")

# Note: Floating Dr. Suhail icon uses dedicated illustration (assets/img/dr-suhail-floating-icon.png)
# and must never be overwritten with real portrait photos.

