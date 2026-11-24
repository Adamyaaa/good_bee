import subprocess
import os

chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
out_png = r"c:\good_bee\screenshot_purple_full.png"

cmd = [
    chrome_path,
    "--headless",
    "--disable-gpu",
    "--hide-scrollbars",
    "--window-size=1440,3000",
    f"--screenshot={out_png}",
    "http://127.0.0.1:5173"
]

subprocess.run(cmd, check=True)
print("Saved:", os.path.getsize(out_png))
