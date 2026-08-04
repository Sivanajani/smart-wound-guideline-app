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
| L2 — data dictionary | [05](05-l2-data-dictionary.md) | ✅ 48 elements |
| L2 — decision logic | [06](06-l2-decision-logic.md) | ✅ 18 rules |
| L2 — L1→L2 challenges | [07](07-l2-l1-to-l2-challenges.md) | ✅ 9 documented |
| L3 — machine-readable code | [08](08-l3-architecture.md) + `l3/` | ✅ v0.3.4, bilingual, FHIR configured, graphics embedded |
| L4 — executable layer | [09](09-l4-implementation-ux.md) + `l4/` | ✅ single file, no build step, bilingual |
| QA — risk-based testing | [10](10-qa-testing.md) | ✅ 19/19 logic · 20/20 FHIR · no-hardcoding check · 8 defects fixed |
| Implementation, M&E strategy | [11](11-implementation-monitoring-evaluation.md) | ✅ |
| Expected impact | [12](12-impact-and-regulation.md) | ✅ incl. SaMD classification |
| Presentation | `submission/` | ✅ 15 slides + 10 backup slides, with speaker notes |
| Presentation script | [14](14-presentation-script.md) | ✅ word for word, with timings, handovers and Q&A jump targets |
| Pre-recorded demo | `submission/WundCheck_L4_Demo.mp4` | ✅ 1:46, 1920×1080, screen recording of the running app |
| Submission package | `submission/` | ✅ 16 PDFs + L3 + L4 + BPMN sources + demo video + index |

---

## 13.2 Remaining Work

Three items, none of which we can close without the group:

| # | Task | Why it cannot be automated | Time |
|---|---|---|---|
| 1 | **Enter the names on slide 15** | The individual-contributions slide is explicitly required and 20 % of the grade is individual | 5 min |
| 2 | **Rehearse twice with a stopwatch** | Following [14](14-presentation-script.md); the first run will overrun — cut in the given order, do not speed up | 40 min |
| 3 | **Clarify the submission channel** | Ask the lecturers during Tuesday morning's practical | 5 min |

**Optional, if time allows:** redraw the wound graphics against the Southampton grades and for more than one skin tone (the current set is schematic and shows a single skin tone — this is named as residual risk (b) and (d) in [10](10-qa-testing.md)); add a graphic for `redness_extent`.

---

## 13.3 Presentation — 15 Slides

| # | Slide | Key message | Source | Time |
|---|---|---|---|---|
| 1 | Title | WundCheck — wound check in the hands of the patient | | 15 s |
| 2 | Health Need & Scope | SSIs occur after hospital discharge — exactly when nobody is looking | [01](01-health-need-and-scope.md) | 55 s |
| 3 | Personas & Scenario A | The call that is avoided is just as valuable as the one that is triggered | [02](02-personas-and-scenarios.md) | 55 s |
| 4 | L1 & evidence appraisal | We deliberately discarded the statistically better instrument — it cannot be captured by laypersons | [03](03-l1-guidelines-and-evidence.md) | 55 s |
| 5 | **Southampton mapping** | Our choice of images is not a UI whim, but a published grading | [03 §3.4](03-l1-guidelines-and-evidence.md#34-southampton-mapping) | 60 s |
| 6 | BPMN high-level | Four lanes, one business rule task — the logic does not sit in the app | [04](04-l2-workflow-bpmn.md) | 50 s |
| 7 | Data dictionary — key figures | 48 elements · 9 derived · 38 with terminology · 47 with FHIR mapping | [05](05-l2-data-dictionary.md) | 40 s |
| 8 | Decision table & worst-first | False reassurance weighs more heavily than a false alarm | [06](06-l2-decision-logic.md) | 55 s |
| 9 | **L1→L2 challenges** | Nine places where the guideline left us on our own | [07](07-l2-l1-to-l2-challenges.md) | 60 s |
| 10 | L3 architecture decision | Author custom JSON, speak standards at the interface — and we can *prove* the app has no clinical content | [08](08-l3-architecture.md) | 50 s |
| 11 | **Demo** | Green · orange · changing a threshold without a rebuild | `submission/` | 100 s |
| 12 | QA: hazards, 8 bugs, residual risk | Two defects were invisible to document review and only surfaced when the rules were actually executed | [10](10-qa-testing.md) | 60 s |
| 13 | Implementation & M&E | What we could not test, we monitor in deployment | [11](11-implementation-monitoring-evaluation.md) | 55 s |
| 14 | Impact & SaMD | IMDRF Category II — with a rationale | [12](12-impact-and-regulation.md) | 45 s |
| 15 | Individual contributions | | | 15 s |

**Total: ~10:10** as planned. The delivered script in [14](14-presentation-script.md) is timed to **9:45** — including the 1:46 demo video — and names, in order, what to cut if the talk runs long.

### Backup slides 16–25 *(after slide 15, for the Q&A)*

16 complete decision table · 17 test protocol T1–T19 · 18 hazard analysis and risk matrix · 19 BPMN detail process · 20 FHIR interface · 21 traceability L1 → FHIR · 22 the L3 in one screen · 23 data dictionary columns · 24 depth that did not fit into ten minutes · 25 sources

Jump targets per likely question are tabulated in [14 §14.2](14-presentation-script.md).

### The key figures line for slide 7

> **48 data elements · 9 derived · 38 with terminology binding · 47 with FHIR mapping · 18 decision rules · 9 documented L1→L2 challenges · 6 hazards · 39 automated checks (19 decision logic + 20 FHIR conformance) plus a machine-enforced no-hardcoding check, all passing · 8 defects found and fixed**

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

**Every person must be able to explain the entire project — the question round is addressed to everyone and accounts for 20 % of the grade.**

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

> *To be filled in before submission. Be specific and reference artefacts — “everyone worked together" is the worst possible wording.*

| Person | Area of responsibility | Artefacts | Presents |
|---|---|---|---|
| | Clinical Lead — L1 research, evidence appraisal, health need, personas, L1→L2 challenges | [01](01-health-need-and-scope.md), [02](02-personas-and-scenarios.md), [03](03-l1-guidelines-and-evidence.md), [07](07-l2-l1-to-l2-challenges.md) | Slides 2–5, 9 |
| | L2 Lead — BPMN, data dictionary, decision table, terminology mapping | [04](04-l2-workflow-bpmn.md), [05](05-l2-data-dictionary.md), [06](06-l2-decision-logic.md), `diagrams/` | Slides 6–8 |
| | Tech Lead — L3 schema, app, FHIR export, demo | [08](08-l3-architecture.md), [09](09-l4-implementation-ux.md), `l3/`, `l4/` | Slides 10–11 |
| | QA & Implementation Lead — hazard analysis, test cases, bug log, M&E, impact, regulation | [10](10-qa-testing.md), [11](11-implementation-monitoring-evaluation.md), [12](12-impact-and-regulation.md) | Slides 12–14 |

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
