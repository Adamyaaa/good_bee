import subprocess
import os

chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
out_png = r"c:\good_bee\screenshot_purple_sections.png"

cmd = [
    chrome_path,
    "--headless",
    "--disable-gpu",
    "--hide-scrollbars",
    "--window-size=1440,5500",
    f"--screenshot={out_png}",
    "http://127.0.0.1:5173"
]

subprocess.run(cmd, check=True)
print("Saved sections:", os.path.exists(out_png), os.path.getsize(out_png))
