import os
import re

src_dir = r"c:\good_bee\client\src"
files = []
for root, dirs, filenames in os.walk(src_dir):
    for f in filenames:
        if f.endswith(('.jsx', '.js', '.css')):
            files.append(os.path.join(root, f))

purple_patterns = [
    r'#5B0868',
    r'#480653',
    r'purple-[0-9]+(/[0-9]+)?',
    r'text-purple-[0-9]+',
    r'bg-purple-[0-9]+',
    r'border-purple-[0-9]+',
]

findings = {}
for fpath in files:
    with open(fpath, 'r', encoding='utf-8') as f:
        content = f.read()
    matches = re.findall(r'(#5B0868|#480653|[a-z:-]*purple[a-z0-9/-]*)', content, re.IGNORECASE)
    if matches:
        findings[os.path.relpath(fpath, src_dir)] = set(matches)

for k, v in sorted(findings.items()):
    print(f"{k}: {sorted(v)}")
