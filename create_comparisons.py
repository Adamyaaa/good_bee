import os
from PIL import Image, ImageDraw, ImageFont

def make_comparison(img1_path, img2_path, out_path, title="THEME COMPARISON"):
    im1 = Image.open(img1_path)
    im2 = Image.open(img2_path)
    
    w, h = im1.size
    banner_h = 70
    comp_w = w * 2 + 30
    comp_h = h + banner_h + 30
    
    comp = Image.new("RGB", (comp_w, comp_h), "#FAF7F2")
    draw = ImageDraw.Draw(comp)
    
    # Try to load a nice font or default
    try:
        font_large = ImageFont.truetype("arialbd.ttf", 24)
        font_label = ImageFont.truetype("arialbd.ttf", 18)
        font_sub = ImageFont.truetype("arial.ttf", 14)
    except:
        font_large = ImageFont.load_default()
        font_label = font_large
        font_sub = font_large
        
    # Header banner
    draw.rectangle([(0, 0), (comp_w, banner_h)], fill="#1A1918")
    draw.text((30, 15), f"GOOD BEE SKINCARE  •  {title.upper()}", fill="#C5A880", font=font_large)
    draw.text((30, 44), "Design Evaluation for Client Review: Current Purple vs Proposed Royal Honey Gold", fill="#E8DDCF", font=font_sub)
    
    # Left Label: Purple
    draw.rectangle([(10, banner_h + 10), (10 + w, banner_h + 40)], fill="#5B0868")
    draw.text((25, banner_h + 15), "CURRENT: PLUM / BERRY PURPLE (#5B0868)", fill="#FFFFFF", font=font_label)
    comp.paste(im1, (10, banner_h + 45))
    
    # Right Label: Gold
    draw.rectangle([(w + 20, banner_h + 10), (w + 20 + w, banner_h + 40)], fill="#8F6421")
    draw.text((w + 35, banner_h + 15), "PROPOSED: ROYAL HONEY GOLD (#8F6421)", fill="#FFFFFF", font=font_label)
    comp.paste(im2, (w + 20, banner_h + 45))
    
    comp.save(out_path, quality=92)
    print(f"Generated {out_path} ({os.path.getsize(out_path)} bytes)")

pairs = [
    (r"c:\good_bee\screenshot_purple_hero.png", r"c:\good_bee\screenshot_gold_hero.png", r"c:\good_bee\comparison_1_hero.png", "HERO & HEADER ACCENTS"),
    (r"c:\good_bee\screenshot_purple_routine.png", r"c:\good_bee\screenshot_gold_routine.png", r"c:\good_bee\comparison_2_routine.png", "SKINCARE ROUTINE GUIDE & PILLS"),
    (r"c:\good_bee\screenshot_purple_ailab.png", r"c:\good_bee\screenshot_gold_ailab.png", r"c:\good_bee\comparison_3_ailab.png", "AI FORMULATION LAB & DIAGNOSTICS"),
    (r"c:\good_bee\screenshot_purple_surprise.png", r"c:\good_bee\screenshot_gold_surprise.png", r"c:\good_bee\comparison_4_surprise.png", "CONCIERGE & SURPRISE GIFT MODAL"),
]

for p1, p2, out, title in pairs:
    make_comparison(p1, p2, out, title)
