# 13 · Project Plan, Presentation & Contributions

> **Assignment:** *“Include a final slide describing individual contributions."* · *“Duration: 10 minutes for presentation, 10 minutes for questions."*

---

## 13.1 Status

| Assignment item | Artefact | Status |
|---|---|---|
| Health / health system need | [01](01-health-need-and-scope.md) | ✅ |
| User personas & scenarios | [02](02-personas-and-scenarios.md) | ✅ 3 personas · 2 required scenarios + 1 stress case |
| Guidelines and evidence (L1) | [03](03-l1-guidelines-and-evidence.md) | ✅ 4 sources, appraised |
| L2 — high-level workflow (BPMN) | [04](04-l2-workflow-bpmn.md) + `diagrams/` | ✅ 2 diagrams, typed tasks, English |
| L2 — data dictionary | [05](05-l2-data-dictionary.md) | ✅ 49 elements |
| L2 — decision logic | [06](06-l2-decision-logic.md) | ✅ 18 rules |
| L2 — L1→L2 challenges | [07](07-l2-l1-to-l2-challenges.md) | ✅ 9 documented |
| L3 — machine-readable code | [08](08-l3-architecture.md) + `l3/` | ✅ v0.3.4, bilingual, FHIR configured, graphics embedded |
| L4 — executable layer | [09](09-l4-implementation-ux.md) + `l4/` | ✅ single file, no build step, bilingual |
| QA — risk-based testing | [10](10-qa-testing.md) | ✅ 21/21 logic · 20/20 FHIR · no-hardcoding check · 10 defects fixed |
| Implementation, M&E strategy | [11](11-implementation-monitoring-evaluation.md) | ✅ |
| Expected impact | [12](12-impact-and-regulation.md) | ✅ incl. SaMD classification |
| Presentation | `submission/` | ✅ 16 slides + 10 backup slides, with speaker notes |
| Presentation script | [14](14-presentation-script.md) | ✅ word for word, with timings, handovers and Q&A jump targets |
| Demo | live click-through of the L4 on slide 11 | ✅ choreography in [14 §SLIDE 11](14-presentation-script.md) · `submission/WundCheck_L4_Demo.mp4` (1:46) kept as the emergency fallback |
| Submission package | `submission/` | ✅ 16 PDFs + L3 + L4 + BPMN sources + demo video + index |

---

## 13.2 Remaining Work

Three items, none of which we can close without the group:

| # | Task | Why it cannot be automated | Time |
|---|---|---|---|
| 1 | **Set up the live demo on the presentation laptop** | The click-through must be rehearsed on the actual machine — see the checklist in [14 §14.5](14-presentation-script.md) | 20 min |
| 2 | **Rehearse twice with a stopwatch** | Following [14](14-presentation-script.md); the first run will overrun — cut in the given order, do not speed up | 40 min |
| 3 | **Clarify the submission channel** | Ask the lecturers during Tuesday morning's practical | 5 min |

**Optional, if time allows:** redraw the wound graphics against the Southampton grades and for more than one skin tone (the current set is schematic and shows a single skin tone — this is named as residual risk (b) and (d) in [10](10-qa-testing.md)); add a graphic for `redness_extent`.

---

## 13.3 Presentation — 16 Slides, two speakers

Full spoken text for every slide, including the backups: **[14 · Presentation script](14-presentation-script.md)**.

| # | Slide | Speaker | Key message | Time |
|---|---|---|---|---|
| 1 | Title | Feline | WundCheck — wound check in the hands of the patient | 0:15 |
| 2 | Health need & scope | Feline | SSIs occur after discharge — exactly when nobody is looking | 0:42 |
| 3 | Personas & Scenario A | Feline | The call that is avoided is worth as much as the one that is triggered | 0:35 |
| 4 | L1 & evidence appraisal | Feline | We discarded the statistically better instrument — it cannot be captured by laypersons | 0:42 |
| 5 | **Southampton mapping** | Feline | Our choice of images is a published grading, not a UI whim | 0:42 |
| 6 | BPMN high-level | Feline | Four lanes, one business rule task — the logic is not in the app | 0:30 |
| 7 | Data dictionary | Feline | 49 elements · 10 derived · 38 with terminology · 48 FHIR-mapped | 0:25 |
| 8 | Decision table & worst-first | Feline | False reassurance weighs more than a false alarm | 0:38 |
| 9 | **L1→L2 challenges** | Feline | Nine places where the guideline left us on our own | 0:38 |
| 10 | L3 architecture decision | Sivanajani | Author custom JSON, speak standards at the interface — and *prove* the app holds no clinical content | 0:30 |
| 11 | **Live demo** | Sivanajani | Green · orange + FHIR · changing a threshold without a rebuild | 1:50 |
| 12 | QA: hazards, 8 defects, residual risk | Sivanajani | Three defects were invisible to document review | 0:45 |
| 13 | Implementation & M&E | Sivanajani | What we could not test, we monitor in deployment | 0:35 |
| 14 | Impact & SaMD | Sivanajani | IMDRF Category II — with a rationale | 0:28 |
| 15 | Individual contributions | Sivanajani | Testing was cross-assigned; neither signed off their own layer | 0:15 |
| 16 | Repository & QR code | Sivanajani | Everything is reproducible — scan and re-run the checks | 0:12 |

**Total: 9:42**, inside the 10-minute limit. [14 §14.1](14-presentation-script.md) lists, in order, what to cut if the talk runs long.

### Backup slides 17–26 *(not presented — for the Q&A)*

17 complete decision table · 18 test protocol T1–T19 · 19 hazard analysis and risk matrix · 20 BPMN detail process · 21 FHIR interface · 22 traceability L1 → FHIR · 23 the L3 in one screen · 24 data dictionary columns · 25 depth that did not fit into ten minutes · 26 sources

Each has its own 20–30 s script in [14 §14.3](14-presentation-script.md); jump targets per likely question are tabulated in [14 §14.4](14-presentation-script.md).

### The key figures line for slide 7

> **49 data elements · 10 derived · 38 with terminology binding · 48 with FHIR mapping · 18 decision rules · 9 documented L1→L2 challenges · 6 hazards · 39 automated checks (19 decision logic + 20 FHIR conformance) plus a machine-enforced no-hardcoding check, all passing · 8 defects found and fixed**

---

## 13.4 The Narrative Thread

> **“We translated a guideline written for health professionals into an instrument for laypersons — and in doing so learned where that translation becomes dangerous."**

This line carries all 10 minutes:

- **L1** — CDC and Southampton are written for clinicians who examine the wound. Campwala et al. show that no instrument is perfect, and that the best one is unusable for us
- **L2** — Every rule had to be rebuilt so that a 58-year-old patient can answer it at home. Eight of these translations are documented decisions that come at a price
- **L3/L4** — The choice of images is the *answer* to the translation problem, not a UI gimmick. And the logic stays in the L3 so that clinical staff can maintain it without developers
- **QA** — The errors lay exactly where translation had taken place: conditional logic made an emergency rule unreachable, a captured symptom fed into nothing
- **Impact** — A triage tool in the hands of patients is regulatorily delicate. False reassurance weighs more heavily than a false alarm. Hence worst-first, hence the residual risk statement, hence the monitoring indicator “GREEN despite presentation to a physician"

---

## 13.5 Q&A Preparation

**Both of us must be able to explain the entire project — the question round is addressed to everyone and accounts for 20 % of the grade.** Backup-slide jump targets per question: [14 §14.4](14-presentation-script.md).

| Question | Where the answer is |
|---|---|
| Why these guidelines and not others? | [03 §3.2](03-l1-guidelines-and-evidence.md) |
| Why Southampton, when the study attests only limited value to it? | [03 §3.3](03-l1-guidelines-and-evidence.md) — triage vs. prognosis |
| Why not ASEPSIS, which performed better? | [07 C-06](07-l2-l1-to-l2-challenges.md) — cannot be captured by laypersons |
| What was your most difficult translation decision? | [07 C-01](07-l2-l1-to-l2-challenges.md) and [C-03](07-l2-l1-to-l2-challenges.md) |
| Where is your logic most fragile? | Image assignment by laypersons — residual risk (b), [10 §10.5](10-qa-testing.md) |
| Why no XLSForm? | [08 §8.1](08-l3-architecture.md) — comparison table |
| How do you roll out a guideline update? How long does that take? | [08 §8.6](08-l3-architecture.md) and [11 §11.4](11-implementation-monitoring-evaluation.md) — target ≤ 4 weeks |
| What did you **not** test, and why? | [10 §10.5](10-qa-testing.md) — residual risk statement |
| Is this a medical device? Which category? | [12 §12.4](12-impact-and-regulation.md) — SaMD, IMDRF II, with a rationale |
| How do you prevent automation bias? | [12 §12.3](12-impact-and-regulation.md) — the result always states the reason |
| What happens with a case that fits no rule? | Catch-all R8 — never phrases things as “everything is fine" without a note to make contact |
| How do you connect to a HIS? | [11 §11.2](11-implementation-monitoring-evaluation.md) — FHIR R4 |
| Which interoperability level do you achieve? | [09 §9.4](09-l4-implementation-ux.md) — structural yes, semantic partially, organisational no |
| What would be your primary outcome in an evaluation? | [11 §11.8](11-implementation-monitoring-evaluation.md) — time to medical contact |
| Who is liable for an incorrect recommendation? | [12 §12.3](12-impact-and-regulation.md) — an open question, to be named honestly |
| What would you do differently given more time? | [12 §12.5](12-impact-and-regulation.md) |

---

## 13.6 Individual Contributions

| Person | Area of responsibility | Artefacts | Presents |
|---|---|---|---|
| **Feline Weger** · Biomedical Engineer | Clinical lead & L2 — L1 source research and evidence appraisal, health need and scope, personas and scenarios, Southampton → image mapping, the nine L1→L2 translation decisions, BPMN, data dictionary, decision table, terminology mapping | [01](01-health-need-and-scope.md), [02](02-personas-and-scenarios.md), [03](03-l1-guidelines-and-evidence.md), [04](04-l2-workflow-bpmn.md), [05](05-l2-data-dictionary.md), [06](06-l2-decision-logic.md), [07](07-l2-l1-to-l2-challenges.md), `diagrams/` | Slides 2–9 |
| **Sivanajani Sivakumar** · MSc Medical Informatics | Technical lead & QA — L3 schema and authoring, the L4 application and expression engine, FHIR R4 interface, hazard analysis, test protocol, no-hardcoding check, bug log, implementation and M&E strategy, impact and regulatory classification | [08](08-l3-architecture.md), [09](09-l4-implementation-ux.md), [10](10-qa-testing.md), [11](11-implementation-monitoring-evaluation.md), [12](12-impact-and-regulation.md), `l3/`, `l4/`, `tools/` | Slides 10–16 |

**Testing was cross-assigned on purpose: neither of us signed off the layer we wrote.** Both of us can answer questions on the whole project — the question round is addressed to everyone and accounts for 20 % of the grade.

---

## 13.7 Submission Package

```
submission/
├── 00_SUBMISSION_INDEX.md / .pdf
├── WundCheck_CDSS_Presentation.pptx / .pdf   (15 slides + 10 backup slides, speaker notes)
├── WundCheck_L4_Demo.mp4                     (1:46, screen recording of the running app)
├── L3_wundcheck-l3.json                      (the machine-readable L3)
├── L4_wundcheck-app.html                     (single file, offline, EN/DE)
├── BPMN_workflow-highlevel.bpmn / .svg / .png
├── BPMN_workflow-app-detail.bpmn / .svg / .png
├── example-fhir-bundle.json
├── README.pdf
└── 01 … 14 — every document as PDF
```

All documents additionally as PDF — do not rely on the lecturers having a Markdown viewer or bpmn.io at hand. The repository itself is the long version, the PDF package is the submission.

- [ ] **Clarify the submission route** — ask directly in the practical session on Tuesday morning
- [ ] Demo video stored **locally** on the presentation laptop, not only in the cloud
- [ ] Backup: screenshots of the demo in the slides in case the video does not start
