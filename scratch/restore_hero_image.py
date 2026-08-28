import os
from PIL import Image

hero_src = "heroimage/phototune.ai_1787829139.png"
if not os.path.exists(hero_src):
    hero_src = "heroimage/1787828075785-adjusted.png"

img = Image.open(hero_src)
print("Using hero source:", hero_src, img.size)

os.makedirs("assets/img/hero", exist_ok=True)
img.save("assets/img/hero/dr-suhail-redesign-dental.webp", format="WEBP", quality=92)
img.save("assets/img/hero/dr-suhail-redesign-dental.png", format="PNG")
print("Restored hero image assets successfully!")
