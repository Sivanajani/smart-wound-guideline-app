#!/usr/bin/env python3
"""Embed l3/wundcheck-l3.json into l4/wundcheck-app.html so the app runs offline from file://.
Run after every L3 change:  python3 tools/embed-l3.py"""
import json, re, pathlib
root = pathlib.Path(__file__).resolve().parent.parent
l3 = json.loads((root/"l3/wundcheck-l3.json").read_text(encoding="utf-8"))
html = (root/"l4/wundcheck-app.html").read_text(encoding="utf-8")
payload = json.dumps(l3, ensure_ascii=False, separators=(",", ":"))
html = re.sub(r"/\*__L3_START__\*/.*?/\*__L3_END__\*/",
              lambda m: "/*__L3_START__*/" + payload.replace("</", "<\\/") + "/*__L3_END__*/",
              html, flags=re.S)
(root/"l4/wundcheck-app.html").write_text(html, encoding="utf-8")
print("embedded L3 v%s (%d elements, %d rules) -> l4/wundcheck-app.html"
      % (l3["meta"]["version"], len(l3["elements"]), len(l3["decision_rules"])))
