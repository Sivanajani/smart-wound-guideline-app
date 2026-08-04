# WundCheck — Submission package

**FHNW MSc Medical Informatics · Clinical Decision Support Systems 2026 · 4 August 2026**

A mini knowledge-based CDSS for the daily self-check of post-operative wounds, developed along the WHO SMART Guidelines layer model (L1 → L2 → L3 → L4).

---

## What the assignment asks for, and where it is

| Assignment requirement | File |
|---|---|
| **Presentation materials** | `WundCheck_CDSS_Presentation.pptx` · `.pdf` (15 slides + 10 backup slides, with speaker notes) · speaking script: `14-presentation-script.pdf` |
| **L2 — high-level workflow (BPMN)** | `BPMN_workflow-highlevel.bpmn` / `.svg` / `.png` · documented in `04-l2-workflow-bpmn.pdf` |
| **L2 — data dictionary** | `05-l2-data-dictionary.pdf` — 48 elements |
| **L2 — decision logic** | `06-l2-decision-logic.pdf` — 18 rules · additionally as a BPMN gateway cascade in `BPMN_workflow-app-detail.bpmn` |
| **L3 documentation** | `08-l3-architecture.pdf` · machine-readable file: `L3_wundcheck-l3.json` |
| **Pre-recorded demo** | `WundCheck_L4_Demo.mp4` — 1:46, 1920×1080, a screen recording of the running application: the full patient journey plus the threshold change |
| **Access to the L4** | `L4_wundcheck-app.html` — open in any browser, no installation, works offline |

## Everything else

| # | Document | Assignment item |
|---|---|---|
| 01 | `01-health-need-and-scope.pdf` | Health / health system need |
| 02 | `02-personas-and-scenarios.pdf` | User personas and scenarios |
| 03 | `03-l1-guidelines-and-evidence.pdf` | Guidelines and evidence |
| 04 | `04-l2-workflow-bpmn.pdf` | L2 — high-level workflow |
| 05 | `05-l2-data-dictionary.pdf` | L2 — data dictionary |
| 06 | `06-l2-decision-logic.pdf` | L2 — decision logic |
| 07 | `07-l2-l1-to-l2-challenges.pdf` | L1 → L2 translation challenges |
| 08 | `08-l3-architecture.pdf` | L3 — machine-readable code |
| 09 | `09-l4-implementation-ux.pdf` | L4 — executable layer and UI considerations |
| 10 | `10-qa-testing.pdf` | Quality assurance testing |
| 11 | `11-implementation-monitoring-evaluation.pdf` | Implementation, monitoring and evaluation |
| 12 | `12-impact-and-regulation.pdf` | Expected impact (and regulatory classification) |
| 13 | `13-project-plan-and-contributions.pdf` | Project plan, presentation outline, contributions |
| 14 | `14-presentation-script.pdf` | Speaking script for all 25 slides — timings, handovers, Q&A jump targets |
| — | `README.pdf` | Repository overview |
| — | `example-fhir-bundle.json` | Example FHIR R4 transaction bundle produced by the L4 |

---

## Running the L4

Open `L4_wundcheck-app.html` in any modern browser. No server, no installation, no dependencies; it works fully offline. The application is bilingual (English by default, German switchable in the header).

The **L3 inspector** at the foot of the page shows the loaded L3 version, the derived values, the FHIR endpoint and the outbound queue — and it lets you edit the thresholds live. Changing `fever_orange` from 38.0 to 37.5 and re-evaluating the same case changes the classification without a rebuild. That is the clearest demonstration of the layer separation.

`Load L3 file` accepts any other L3 JSON; the app renders whatever it is given.

---

## Key figures

| | |
|---|---|
| Data elements | **48** (9 derived · 38 with a terminology binding · 47 with a FHIR mapping) |
| Decision rules | **18** (13 exclusive, worst-first · 5 non-exclusive information rules) |
| Documented L1 → L2 challenges | **9** |
| Hazards identified and ranked | **6** |
| Automated checks | **19** decision-logic tests · **20** FHIR R4 conformance checks · 1 no-hardcoding check — all passing |
| Defects found and fixed | **8** |

---

## Two things worth knowing before reading

**Three of the eight defects were invisible to a document review.** B-07 and B-08 only surfaced once the rules were actually executed: a trend rule referenced its own result and could never fire, and after that was fixed the rule turned out to be unreachable against the worst-first cascade. B-06 was a contradiction between two of our own documents. All three are documented with root cause, fix and retest in `10-qa-testing.pdf`.

**The claim “the L4 contains no clinical content” is machine-enforced.** A check scans the application source for every element id, section id, rule id, threshold, code system URI and the FHIR endpoint, and fails if any of them appears. It found two real leaks on its first run, both of which were fixed by moving the content into the L3.

---

## Reproducing the checks

From the repository root:

```bash
node tools/run-tests.mjs          # 19 decision-logic test cases
node tools/check-fhir.mjs         # 20 FHIR R4 conformance checks
node tools/check-hardcoding.mjs   # proves the L4 holds no clinical content
python3 tools/embed-l3.py         # re-embed the L3 into the app after an L3 change
python3 tools/build-submission.py    # rebuild this package
node    tools/build-presentation.js  # rebuild the slide deck
python3 tools/build-demo-video.py    # rebuild the demo video
```

---

> ⚠️ **Study prototype — not for clinical use.** WundCheck triages and documents; it does not replace medical assessment.
