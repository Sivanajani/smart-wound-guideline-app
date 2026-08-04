<img src="assets/logo.png" alt="" width="112" align="right">

# WundCheck — Mini-CDSS for daily wound checks after surgery

> **FHNW MSc Medical Informatics · Clinical Decision Support Systems Module 2026**

> Group project: knowledge-based CDSS following the WHO SMART Guidelines layer approach (L1 → L2 → L3 → L4)

**Repository:** https://github.com/Sivanajani/smart-wound-guideline-app  

**DEMO:** https://sivanajani.github.io/smart-wound-guideline-app/l4/wundcheck-app.html

**Authors:** Feline Weger · Sivanajani Sivakumar

Group 5

---

## What it is about

Postoperative wound infections (Surgical Site Infections, SSI) predominantly occur **after discharge from hospital** — that is, precisely when no health professional looks at the wound on a daily basis any more. Patients often recognise warning signs too late, or call unnecessarily because of normal signs of healing.

**WundCheck** is a daily self-check: in 2–3 minutes, patients answer structured questions and select their wound appearance via **clickable graphics** instead of free text or a photo. A rule-based system classifies the result according to established SSI criteria into a traffic light and states specifically what needs to be done.

| | | |
|---|---|---|
| 🟢 **GREEN** | healing normal | check again tomorrow |
| 🟡 **YELLOW** | abnormal | observe, raise it at the next appointment |
| 🟠 **ORANGE** | suspected infection | contact the practice today |
| 🔴 **RED** | emergency | practice / emergency service immediately |

---

## The layer architecture

```
L1  Guidelines & Evidence         CDC/NHSN SSI criteria · NICE NG125 · Southampton Wound Score
      │                            ↓ human interpretation, documented decisions
L2  Human-readable Algorithm      BPMN workflow · Data Dictionary · Decision Table
      │                            ↓ translation into machine readability
L3  Machine-readable Layer        wundcheck-l3.json (elements, rules, constraints)
      │                            ↓ generic execution
L4  Executable Layer              single-file web app (vanilla JS), renders the L3 dynamically
```

**The central design decision:** the app contains **no** clinical logic. Questions, visibility rules, calculations, thresholds and decision rules reside entirely in the L3 JSON. A change to a guideline is a change to *one file* — no rebuild, no developer.

---

## Repository structure

| Path | Content |
|---|---|
| **[`docs/`](docs/)** | The complete project documentation — one document per assignment item |
| **[`l3/`](l3/)** | Machine-readable CDSS definition (JSON) + schema documentation |
| **[`l4/`](l4/)** | Executable app — one self-contained HTML file, no build step, no dependencies |
| **[`diagrams/`](diagrams/)** | BPMN diagrams (`.bpmn` editable, `.svg`/`.png` for embedding) |
| **[`assets/`](assets/)** | Wound and discharge graphics for the image selection |
| **[`submission/`](submission/)** | Submission package: slides, demo recording, every document as PDF, L3 + L4 |
| `_archive/` | Earlier file versions from before the restructuring |

---

## Documentation

The documents follow the structure of the assignment exactly:

| # | Document | Assignment item |
|---|---|---|
| 01 | [Health Need & Scope](docs/01-health-need-and-scope.md) | Describe the health / health system need |
| 02 | [Personas & Scenarios](docs/02-personas-and-scenarios.md) | User Personas and Scenarios |
| 03 | [L1 — Guidelines & Evidence](docs/03-l1-guidelines-and-evidence.md) | Guidelines and Evidence |
| 04 | [L2 — Workflow (BPMN)](docs/04-l2-workflow-bpmn.md) | L2: High-level workflow |
| 05 | [L2 — Data Dictionary](docs/05-l2-data-dictionary.md) | L2: Data dictionary |
| 06 | [L2 — Decision Logic](docs/06-l2-decision-logic.md) | L2: Decision logic |
| 07 | [L2 — L1→L2 challenges](docs/07-l2-l1-to-l2-challenges.md) | Challenges in translation of L1 to L2 |
| 08 | [L3 — Architecture & Schema](docs/08-l3-architecture.md) | Develop the machine-readable code |
| 09 | [L4 — Implementation & UX](docs/09-l4-implementation-ux.md) | Implement the executable layer |
| 10 | [QA — Risk-based testing](docs/10-qa-testing.md) | Quality Assurance Testing |
| 11 | [Implementation, Monitoring & Evaluation](docs/11-implementation-monitoring-evaluation.md) | Implementation, monitoring and evaluation strategy |
| 12 | [Expected Impact & Regulation](docs/12-impact-and-regulation.md) | Describe expected impact |

---

## Starting the app

```bash
# No server, no build, no installation
open l4/wundcheck-app.html        # macOS
start l4\wundcheck-app.html       # Windows
```

The app opens on an **access code** screen — in the care model the code arrives with the discharge papers, so the daily check can be filed against one person without an account, a password or an app store (see [09 §9.5](docs/09-l4-implementation-ux.md#95-access-code--binding-a-check-to-a-person)).

| Code | Patient | Scenario |
|---|---|---|
| `WC-2026-0417` | Peter Brunner | Persona 1 — knee replacement, day 4, no risk factors |
| `WC-2026-0862` | Rita Baumann | Day 6 after abdominal surgery — diabetes, smoker, on anticoagulants |

Both codes are also listed on the screen itself and fill in with one click. Entering one pre-fills the surgery details and risk factors, so a demo starts at the daily check instead of at a blank form. **The codes are checked in the browser and are therefore public — this identifies a patient, it does not authenticate one.** The reasoning and what a production system would do differently are in [09 §9.5](docs/09-l4-implementation-ux.md#95-access-code--binding-a-check-to-a-person).

The app is bilingual (EN/DE, English by default) and loads the embedded L3. Via **"Load L3 file"** ("L3-Datei laden"), any other JSON can be loaded — which makes the separation of layers demonstrable live.

**Running the tests**

```bash
node tools/run-tests.mjs     # 21 decision-logic test cases against l3/wundcheck-l3.json
node tools/check-fhir.mjs    # 21 FHIR R4 conformance checks on the generated bundle
node tools/check-hardcoding.mjs  # proves the L4 contains no clinical content
node tools/build-presentation.js # rebuilds the 26-slide deck incl. speaker notes and QR code
python3 tools/qr_test.py         # validates the QR encoder (RS vector, BCH, round-trip)
python3 tools/embed-l3.py    # re-embed the L3 into the app after an L3 change
```

The app has **no build step and no dependencies**. Editing the L3 changes the CDSS; editing the HTML changes the rendering. Nothing else is required.


---

## Traceability

Every artefact carries the same IDs. A rule can be traced back seamlessly:

```
DE-xxx  Data element   → Data Dictionary → L3 elements[] → app question
R-xx    Decision Rule  → Decision Table  → L3 decision_rules[] → traffic-light output
C-xx    L1→L2 challenge → Challenges doc → affected rule
H-xx    Hazard          → Risk analysis   → test case
T-xx    Test case       → Test protocol   → bug ID
B-xx    Bug             → Bug log         → fix → retest
```

---

## Scope

**Covered:** surgical wounds with primary wound closure (sutures, staples, tissue adhesive) in adults after elective procedures, **any body region**.

**Not covered:** chronic wounds, burns, secondarily healing and open wounds, children, contaminated emergency procedures.

> ⚠️ **Study prototype.** Not for clinical use. WundCheck does not replace medical assessment — it triages and documents.

---

## Use of AI

We used AI assistance in this project and declare it here in full. The tool used was **Claude (Anthropic)**, largely through **Claude Code** in the development environment.

**Where AI was used**

| Area | What it did |
|---|---|
| **Research and orientation** | Locating and summarising the guidelines and the comparative study, drafting the argument for the choice of instrument, sorting terminology and FHIR resource types |
| **Presentation** | The generator [`tools/build-presentation.js`](tools/build-presentation.js) that builds the deck, the layout of the slides, and the drafts of the speaker notes |
| **Documentation** | Drafting, restructuring and editing the documents in [`docs/`](docs/) — including the English wording, since neither author writes English as a first language |
| **L3 and L4** | Implementing the machine-readable definition and the application, the rule and expression engine, the FHIR bundle builder, the access code, the step flow and the wound graphics |
| **Quality assurance** | The test harnesses in [`tools/`](tools/), the multi-day rule simulation, and finding several of the defects in the bug log — B-09 to B-12 were found this way |

**Where the decisions remained ours**

The use case, the scope and its boundaries, the choice of the four traffic-light levels, the *worst-first* principle, the thresholds not taken from a guideline (`fever_red`, `normal_healing_days` — documented as group decisions in [07](docs/07-l2-l1-to-l2-challenges.md)), the decision to reject ASEPSIS in favour of an instrument laypersons can actually use, and the division of work between the two authors.

**How we checked the output**

Every guideline statement in [03](docs/03-l1-guidelines-and-evidence.md) was verified against the primary source, which is why each one carries a citation and a URL. The decision logic is covered by 21 automated test cases and the FHIR interface by 21 conformance checks, all reproducible with the commands above — AI-written code that is wrong fails these checks in the same way as anything else. Defects we found this way are documented in the bug log rather than quietly corrected.

**Responsibility.** AI accelerated the work and improved the writing; it did not make the clinical decisions and does not carry them. The authors are responsible for the content of this submission, including any errors that remain in it.
