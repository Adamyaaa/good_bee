import os
import re

src_dir = r"c:\good_bee\client\src"

replacements = [
    (r'#5B0868', '#8F6421'),
    (r'#480653', '#765117'),
    (r'bg-purple-700', 'bg-[#8F6421]'),
    (r'bg-purple-100', 'bg-amber-100'),
    (r'bg-purple-50/50', 'bg-amber-50/50'),
    (r'bg-purple-50/40', 'bg-amber-50/40'),
    (r'bg-purple-50', 'bg-amber-50'),
    (r'border-purple-400/30', 'border-amber-400/30'),
    (r'border-purple-900/30', 'border-amber-900/30'),
    (r'border-purple-200', 'border-amber-200'),
    (r'border-purple-100', 'border-amber-100'),
    (r'hover:border-purple-200', 'hover:border-amber-200'),
    (r'hover:bg-purple-50', 'hover:bg-amber-50'),
    (r'hover:bg-purple-100', 'hover:bg-amber-100'),
    (r'text-purple-100/90', 'text-amber-100/90'),
    (r'text-purple-200/50', 'text-amber-200/50'),
    (r'text-purple-200', 'text-amber-200'),
    (r'text-purple-300/80', 'text-amber-300/80'),
    (r'text-purple-900', 'text-amber-950'),
    (r'text-purple-950', 'text-amber-950'),
    (r'group-hover:text-purple-200', 'group-hover:text-amber-200'),
]

files_changed = 0
for root, dirs, filenames in os.walk(src_dir):
    for f in filenames:
        if f.endswith(('.jsx', '.js', '.css')):
            fpath = os.path.join(root, f)
            with open(fpath, 'r', encoding='utf-8') as file:
                content = file.read()
            original = content
            for p, r in replacements:
                content = re.sub(p, r, content)
            if content != original:
                with open(fpath, 'w', encoding='utf-8') as file:
                    file.write(content)
                files_changed += 1
                print(f"Updated {os.path.relpath(fpath, src_dir)}")

print(f"Total files updated to GOLD: {files_changed}")
