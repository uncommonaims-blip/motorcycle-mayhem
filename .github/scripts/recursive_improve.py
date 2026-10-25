#!/usr/bin/env python3
"""One bounded AI improvement pass. Runs only on the bot branch."""
import json, os, pathlib, subprocess, urllib.request
p=pathlib.Path("index.html")
source=p.read_text()
prompt="""You are improving a mobile Three.js motorcycle arcade game.
Choose ONE small, useful improvement to reliability, mobile UX, accessibility, or gameplay.
Do not change monetization, network calls, or security settings.
Return ONLY a valid unified diff against index.html, starting with --- a/index.html and +++ b/index.html.
Keep the change under 100 lines. No Markdown fences.
Do not add dependencies or new files.
Current index.html:
"""+source
payload=json.dumps({"model":"openai/gpt-4.1","messages":[{"role":"user","content":prompt}],"temperature":0.3,"max_tokens":3000}).encode()
req=urllib.request.Request("https://models.github.ai/inference/chat/completions",data=payload,headers={"Authorization":"Bearer "+os.environ["GH_TOKEN"],"Content-Type":"application/json","Accept":"application/vnd.github+json"},method="POST")
with urllib.request.urlopen(req,timeout=90) as response:
    data=json.load(response)
diff=data["choices"][0]["message"]["content"].strip()
if diff.startswith("```"):
    diff="\n".join(diff.splitlines()[1:-1])
if not diff.startswith("--- a/index.html\n+++ b/index.html\n"):
    raise ValueError("AI did not return an index.html unified diff")
if len(diff)>12000 or any(line.startswith(("--- ","+++ ")) and "index.html" not in line for line in diff.splitlines()):
    raise ValueError("Patch outside allowed size or file")
pathlib.Path("/tmp/improvement.patch").write_text(diff+"\n")
subprocess.run(["git","apply","--check","/tmp/improvement.patch"],check=True)
subprocess.run(["git","apply","/tmp/improvement.patch"],check=True)
if p.read_text()==source:
    raise ValueError("No changes made")
subprocess.run(["python3","-c","import re,pathlib; s=pathlib.Path('index.html').read_text(); m=re.search(r'<script type=\"module\">(.*?)</script>',s,re.S); assert m; pathlib.Path('/tmp/motorcycle-check.mjs').write_text(m.group(1))"],check=True)
subprocess.run(["node","--check","/tmp/motorcycle-check.mjs"],check=True)
subprocess.run(["git","diff","--check"],check=True)
subprocess.run(["git","add","index.html"],check=True)
subprocess.run(["git","commit","-m","bot: one bounded arcade improvement"],check=True)
subprocess.run(["git","push","origin","HEAD:bot/recursive-improvements"],check=True)
