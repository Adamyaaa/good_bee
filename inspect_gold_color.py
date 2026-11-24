from PIL import Image

im = Image.open(r"c:\good_bee\client\public\assets\goodbee-bee-mark-gold.png").convert("RGBA")
colors = im.getcolors(maxcolors=100000)
# filter transparent
opaque = [c for c in colors if c[1][3] > 200]
opaque.sort(reverse=True, key=lambda x: x[0])
for count, (r, g, b, a) in opaque[:8]:
    print(f"#{r:02x}{g:02x}{b:02x} ({count} pixels)")
