import subprocess
import os

chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
if not os.path.exists(chrome_path):
    chrome_path = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"

out_png = r"c:\good_bee\test_screen.png"
if os.path.exists(out_png):
    os.remove(out_png)

cmd = [
    chrome_path,
    "--headless",
    "--disable-gpu",
    "--hide-scrollbars",
    "--window-size=1440,1080",
    f"--screenshot={out_png}",
    "http://127.0.0.1:5173"
]

res = subprocess.run(cmd, capture_output=True, text=True, timeout=15)
print("Return code:", res.returncode)
print("File exists:", os.path.exists(out_png))
if os.path.exists(out_png):
    print("File size:", os.path.getsize(out_png))
