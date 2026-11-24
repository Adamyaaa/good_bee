import subprocess

subprocess.run(["git", "checkout", "--", "client/src/"], check=True)
print("Reverted client/src/ to original purple via git")
