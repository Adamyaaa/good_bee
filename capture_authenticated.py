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
    "--remote-debugging-port=9224",
    "--remote-allow-origins=*",
    "--window-size=1440,950",
    "http://127.0.0.1:5173"
])

time.sleep(2)
try:
    with urllib.request.urlopen("http://127.0.0.1:9224/json") as resp:
        tabs = json.loads(resp.read().decode())
    ws_url = tabs[0]["webSocketDebuggerUrl"]
    ws = websocket.create_connection(ws_url)

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

    time.sleep(1)

    # 1. Login as Admin
    login_admin = """
    (async () => {
        const res = await fetch('/api/v1/auth/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ email: 'admin@goodbee.com', password: 'admin' })
        });
        const data = await res.json();
        localStorage.setItem('goodbee_token', data.token);
        localStorage.setItem('goodbee_user', JSON.stringify(data.user));
        window.location.hash = '#portal=ADMIN';
        window.location.reload();
    })()
    """
    send("Runtime.evaluate", {"expression": login_admin, "awaitPromise": True})
    time.sleep(2)

    # Make sure modal is open with ADMIN
    send("Runtime.evaluate", {"expression": "window.location.hash = '#portal=ADMIN';"})
    time.sleep(1)

    res = send("Page.captureScreenshot")
    with open(r"c:\good_bee\screenshot_admin_authenticated.png", "wb") as f:
        f.write(base64.b64decode(res["result"]["data"]))
    print("Saved admin authenticated screenshot")

finally:
    proc.terminate()
