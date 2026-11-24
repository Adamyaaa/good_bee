import subprocess
import time
import os

chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
out_admin = r"c:\good_bee\screenshot_admin_fixed.png"

# Inject login as Admin via dev server URL with token or query
# Let's open Chrome with user-data-dir or run script
script = """
(() => {
    const user = {
        id: 'usr_admin_1',
        name: 'Good Bee Administrator',
        email: 'admin@goodbee.com',
        role: 'ADMIN'
    };
    localStorage.setItem('goodbee_token', 'mock_token_admin');
    localStorage.setItem('goodbee_user', JSON.stringify(user));
})()
"""

# We can use cdp or direct headless chrome
print("Testing capture...")
