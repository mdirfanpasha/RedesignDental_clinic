import os
import glob
from PIL import Image

files = sorted(glob.glob("ourdoctors/*"))
print("Found files:", len(files))

os.makedirs("assets/img/doctors", exist_ok=True)

# Copy and optimize each doctor image
# Doctor 1: Dr. Suhail (we already have his official purple scrub portrait in dr-suhail.webp / assets/img/doctors/dr-suhail.jpg)
# We also have the 6 photos in ourdoctors/

for idx, f in enumerate(files, 1):
    img = Image.open(f).convert("RGB")
    w, h = img.size
    print(f"Doctor {idx}: {f} -> {w}x{h}")
    # Save optimized JPEG and WEBP
    out_jpg = f"assets/img/doctors/doctor-0{idx}.jpg"
    out_webp = f"assets/img/doctors/doctor-0{idx}.webp"
    img.save(out_jpg, format="JPEG", quality=90)
    img.save(out_webp, format="WEBP", quality=90)

print("All doctor images saved into assets/img/doctors/")
