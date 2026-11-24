import subprocess
import os
import sys

chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"

views = [
    ("hero", "http://127.0.0.1:5173/", "screenshot_purple_1_hero.png"),
    ("routine", "http://127.0.0.1:5173/?only=routine", "screenshot_purple_2_routine.png"),
    ("ailab", "http://127.0.0.1:5173/?only=ailab", "screenshot_purple_3_ailab.png"),
    ("catalog", "http://127.0.0.1:5173/?only=formulations", "screenshot_purple_4_catalog.png"),
    ("surprise", "http://127.0.0.1:5173/?modal=surprise", "screenshot_purple_5_surprise.png"),
]

prefix = sys.argv[1] if len(sys.argv) > 1 else "purple"

for name, url, default_fn in views:
    out_name = f"screenshot_{prefix}_{name}.png"
    out_path = os.path.join(r"c:\good_bee", out_name)
    cmd = [
        chrome_path,
        "--headless",
        "--disable-gpu",
        "--hide-scrollbars",
        "--window-size=1440,950",
        "--virtual-time-budget=2000",
        f"--screenshot={out_path}",
        url
    ]
    subprocess.run(cmd, check=True)
    print(f"Captured {out_name}: {os.path.getsize(out_path)} bytes")
