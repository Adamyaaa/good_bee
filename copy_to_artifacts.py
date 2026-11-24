import shutil
import os

artifact_dir = r"C:\Users\aadi\.gemini\antigravity\brain\67edd82c-b621-40bc-be1e-c68a181016ba"
os.makedirs(artifact_dir, exist_ok=True)

files_to_copy = [
    "comparison_1_hero.png",
    "comparison_2_routine.png",
    "comparison_3_ailab.png",
    "comparison_4_surprise.png",
    "screenshot_gold_hero.png",
    "screenshot_purple_hero.png",
    "screenshot_gold_routine.png",
    "screenshot_purple_routine.png",
    "screenshot_gold_ailab.png",
    "screenshot_purple_ailab.png",
    "screenshot_gold_surprise.png",
    "screenshot_purple_surprise.png",
]

for fname in files_to_copy:
    src = os.path.join(r"c:\good_bee", fname)
    dst = os.path.join(artifact_dir, fname)
    if os.path.exists(src):
        shutil.copy2(src, dst)
        print(f"Copied {fname} -> artifacts")
