import subprocess
import time
import json
import urllib.request
import base64
import websocket

chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
proc = subprocess.Popen([
    chrome_path,
    "--headless",
    "--disable-gpu",
    "--remote-debugging-port=9222",
    "--remote-allow-origins=*",
    "--window-size=1440,900",
    "http://127.0.0.1:5173"
])

time.sleep(2)
try:
    with urllib.request.urlopen("http://127.0.0.1:9222/json") as resp:
        tabs = json.loads(resp.read().decode())
    ws_url = tabs[0]["webSocketDebuggerUrl"]
    print("Connected to:", ws_url)
    ws = websocket.create_connection(ws_url)

    # Function to run expression
    msg_id = 1
    def send(method, params=None):
        global msg_id
        payload = {"id": msg_id, "method": method, "params": params or {}}
        ws.send(json.dumps(payload))
        msg_id += 1
        while True:
            res = json.loads(ws.recv())
            if res.get("id") == payload["id"]:
                return res

    # Wait for page load
    time.sleep(1)

    # Take Hero screenshot
    res = send("Page.captureScreenshot")
    with open(r"c:\good_bee\view_purple_hero.png", "wb") as f:
        f.write(base64.b64decode(res["result"]["data"]))
    print("Saved hero")

    # Scroll to routine guide
    send("Runtime.evaluate", {"expression": "document.getElementById('how-to-apply').scrollIntoView();"})
    time.sleep(0.5)
    res = send("Page.captureScreenshot")
    with open(r"c:\good_bee\view_purple_routine.png", "wb") as f:
        f.write(base64.b64decode(res["result"]["data"]))
    print("Saved routine")

    # Scroll to formulations
    send("Runtime.evaluate", {"expression": "document.getElementById('formulations').scrollIntoView();"})
    time.sleep(0.5)
    res = send("Page.captureScreenshot")
    with open(r"c:\good_bee\view_purple_formulations.png", "wb") as f:
        f.write(base64.b64decode(res["result"]["data"]))
    print("Saved formulations")

    # Scroll to ai-formulation-lab
    send("Runtime.evaluate", {"expression": "document.getElementById('ai-formulation-lab').scrollIntoView();"})
    time.sleep(0.5)
    res = send("Page.captureScreenshot")
    with open(r"c:\good_bee\view_purple_ailab.png", "wb") as f:
        f.write(base64.b64decode(res["result"]["data"]))
    print("Saved ailab")

    ws.close()
finally:
    proc.terminate()
