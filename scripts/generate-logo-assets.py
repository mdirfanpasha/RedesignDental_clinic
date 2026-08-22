import os
import base64
from PIL import Image
import numpy as np

src_path = r"C:\Users\Mohammed irfan pasha\.gemini\antigravity-ide\brain\7a5189fe-cb55-4b7a-87a5-e930213f8079\.user_uploaded\media_1787328733564.png"
out_dir = r"assets\img"
os.makedirs(out_dir, exist_ok=True)

orig_im = Image.open(src_path).convert("RGBA")
bbox = orig_im.getbbox()
print("Original bbox:", bbox)

# 1. Trim transparent borders with 4px margin
margin = 4
crop_box = (
    max(0, bbox[0] - margin),
    max(0, bbox[1] - margin),
    min(orig_im.width, bbox[2] + margin),
    min(orig_im.height, bbox[3] + margin)
)
trimmed_logo = orig_im.crop(crop_box)
print("Trimmed logo size:", trimmed_logo.size)

# Save standard black logo
logo_black_path = os.path.join(out_dir, "redesign-dental-clinics-logo.png")
trimmed_logo.save(logo_black_path, "PNG", optimize=True)
print("Saved:", logo_black_path)

# 2. Create white logo for dark backgrounds
arr = np.array(trimmed_logo)
arr[:, :, 0] = 255
arr[:, :, 1] = 255
arr[:, :, 2] = 255
white_logo = Image.fromarray(arr, "RGBA")
logo_white_path = os.path.join(out_dir, "redesign-dental-clinics-logo-white.png")
white_logo.save(logo_white_path, "PNG", optimize=True)
print("Saved:", logo_white_path)

# 3. Create Favicon and Webclip
# Extract D symbol
d_symbol = orig_im.crop((116, 59, 175, 130))
d_arr = np.array(d_symbol)
d_arr[:, :, 0] = 255
d_arr[:, :, 1] = 255
d_arr[:, :, 2] = 255
d_white = Image.fromarray(d_arr, "RGBA")

fav_size = (128, 128)
fav_bg = Image.new("RGBA", fav_size, (5, 38, 42, 255)) # #05262a
target_h = 88
target_w = int(d_symbol.width * (target_h / d_symbol.height))
d_resized = d_white.resize((target_w, target_h), Image.Resampling.LANCZOS)
paste_x = (fav_size[0] - target_w) // 2
paste_y = (fav_size[1] - target_h) // 2
fav_bg.paste(d_resized, (paste_x, paste_y), d_resized)

fav_bg.save(os.path.join(out_dir, "webclip.png"), "PNG")
fav_bg.save(os.path.join(out_dir, "favicon.png"), "PNG")
fav_bg.save(os.path.join(out_dir, "69f299c6d1e5464b411df9d3_smilifye-favicon.png"), "PNG")
fav_bg.save(os.path.join(out_dir, "69f29956ef2b38d211e7fc17_smilifye-webclip.png"), "PNG")

# Update favicon.svg
with open(os.path.join(out_dir, "favicon.png"), "rb") as f:
    b64_fav = base64.b64encode(f.read()).decode("utf-8")

svg_fav = f"""<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="14" fill="#05262a"/>
  <image href="data:image/png;base64,{b64_fav}" x="0" y="0" width="64" height="64"/>
</svg>"""

with open(os.path.join(out_dir, "favicon.svg"), "w", encoding="utf-8") as f:
    f.write(svg_fav)

# 4. Overwrite legacy lumora-logo.svg and lumora-logo-dark.svg with clean wrappers of the official logo
with open(logo_black_path, "rb") as f:
    b64_dark = base64.b64encode(f.read()).decode("utf-8")

with open(logo_white_path, "rb") as f:
    b64_white = base64.b64encode(f.read()).decode("utf-8")

w, h = trimmed_logo.size
svg_logo_dark = f"""<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}">
  <image href="data:image/png;base64,{b64_dark}" x="0" y="0" width="{w}" height="{h}"/>
</svg>"""

svg_logo_white = f"""<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}">
  <image href="data:image/png;base64,{b64_white}" x="0" y="0" width="{w}" height="{h}"/>
</svg>"""

with open(os.path.join(out_dir, "lumora-logo.svg"), "w", encoding="utf-8") as f:
    f.write(svg_logo_dark)

with open(os.path.join(out_dir, "lumora-logo-dark.svg"), "w", encoding="utf-8") as f:
    f.write(svg_logo_white)

print("All logo and branding assets generated successfully!")
