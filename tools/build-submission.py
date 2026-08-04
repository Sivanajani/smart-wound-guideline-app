#!/usr/bin/env python3
"""Builds the submission package: every document as a PDF, plus the machine-readable
artefacts. Run from the repository root:  python3 tools/build-submission.py"""
import pathlib, subprocess, shutil, os, sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT  = ROOT / "submission"
HTML = OUT / "_html"
CHROME = os.environ.get("CHROME", "/opt/pw-browsers/chromium-1194/chrome-linux/chrome")
OUT.mkdir(exist_ok=True); HTML.mkdir(exist_ok=True)

CSS = """
@page { size: A4; margin: 18mm 14mm; }
body { font: 10.5pt/1.5 "Calibri","Segoe UI",system-ui,sans-serif; color:#12202e; }
h1 { font-size:19pt; border-bottom:2px solid #12202e; padding-bottom:5px; margin-top:0; }
h2 { font-size:14pt; margin-top:20px; }
h3 { font-size:11.5pt; margin-top:14px; }
table { border-collapse:collapse; width:100%; margin:10px 0; font-size:8.4pt; }
th,td { border:1px solid #dde5ee; padding:4px 6px; text-align:left; vertical-align:top; }
th { background:#f5f7fa; font-weight:600; }
tr { page-break-inside:avoid; }
code { background:#f5f7fa; padding:1px 4px; border-radius:3px; font:9pt Consolas,monospace; }
pre { background:#f5f7fa; padding:8px; border-radius:5px; font-size:8.4pt; white-space:pre-wrap; }
blockquote { border-left:3px solid #dde5ee; margin:10px 0; padding:2px 12px; color:#5d7186; }
img { max-width:100%; } a { color:#12202e; text-decoration:none; }
"""

docs = sorted((ROOT/"docs").glob("*.md")) + [ROOT/"README.md"]
made = []
for md in docs:
    name = md.stem
    body = subprocess.run(["pandoc", str(md), "-f", "gfm", "-t", "html5"],
                          capture_output=True, text=True, check=True).stdout
    page = (f"<!DOCTYPE html><html lang='en'><head><meta charset='utf-8'>"
            f"<title>{name}</title><style>{CSS}</style><base href='file://{ROOT}/docs/'>"
            f"</head><body>{body}</body></html>")
    h = HTML / f"{name}.html"; h.write_text(page, encoding="utf-8")
    pdf = OUT / f"{name}.pdf"
    subprocess.run([CHROME, "--headless=new", "--disable-gpu", "--no-sandbox",
                    "--allow-file-access-from-files", "--virtual-time-budget=6000",
                    "--no-pdf-header-footer", "--print-to-pdf-no-header",
                    f"--print-to-pdf={pdf}", h.as_uri()],
                   capture_output=True)
    made.append(pdf.name)

shutil.copy(ROOT/"l3/wundcheck-l3.json", OUT/"L3_wundcheck-l3.json")
shutil.copy(ROOT/"l4/wundcheck-app.html", OUT/"L4_wundcheck-app.html")
for d in ("workflow-highlevel", "workflow-app-detail"):
    for ext in (".png", ".svg", ".bpmn"):
        src = ROOT/"diagrams"/f"{d}{ext}"
        if src.exists(): shutil.copy(src, OUT/f"BPMN_{d}{ext}")
shutil.rmtree(HTML, ignore_errors=True)
print(f"{len(made)} PDFs + L3 + L4 + diagrams -> submission/")
