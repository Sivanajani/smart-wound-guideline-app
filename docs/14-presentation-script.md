# 14 · Presentation Script — word for word, every slide

> **Assignment:** *"Duration: 10 minutes for presentation, 10 minutes for questions."*
> This document is the spoken text for `WundCheck_CDSS_Presentation.pptx` — **26 slides**: 1–16 are the talk, 17–26 are backup slides for the question round. Every slide has a script, including the backups.
> Two speakers: **Feline Weger** (slides 1–9) and **Sivanajani Sivakumar** (slides 10–16).

---

## 14.1 How to use this script

| | |
|---|---|
| **Target length** | **9 min 42 s** of the 10 minutes — the buffer is deliberate |
| **Pace** | ~2.3 words per second. That is slower than it feels. If you finish a slide early, pause; do not add words |
| **Rule 1** | Never read a slide out loud. The slide is the evidence, you are the argument |
| **Rule 2** | There is exactly one handover, after slide 9. The sentence that opens slide 10 belongs to **Sivanajani**, not to Feline |
| **Rule 3** | Bold text = say it exactly like that. It is either a number, a claim we have to be able to defend, or the thread |

**The thread — Feline says it on slide 1, Sivanajani echoes it on slide 16:**

> **"We translated a guideline written for health professionals into an instrument for laypersons — and we learned where that translation becomes dangerous."**

### Timing plan

| Slide | Speaker | Time | Running total |
|---|---|---|---|
| 1 · Title | **Feline** | 0:15 | 0:15 |
| 2 · Health system need | Feline | 0:42 | 0:57 |
| 3 · Personas & Scenario A | Feline | 0:35 | 1:32 |
| 4 · L1 & evidence appraisal | Feline | 0:42 | 2:14 |
| 5 · Southampton mapping | Feline | 0:42 | 2:56 |
| 6 · BPMN high-level | Feline | 0:30 | 3:26 |
| 7 · Data dictionary | Feline | 0:25 | 3:51 |
| 8 · Decision logic | Feline | 0:38 | 4:29 |
| 9 · L1 → L2 challenges | Feline | 0:38 | 5:07 |
| 10 · L3 architecture | **Sivanajani** | 0:30 | 5:37 |
| 11 · **Live demo** | Sivanajani | 1:50 | 7:27 |
| 12 · QA & residual risk | Sivanajani | 0:45 | 8:12 |
| 13 · Implementation & M&E | Sivanajani | 0:35 | 8:47 |
| 14 · Impact & regulation | Sivanajani | 0:28 | 9:15 |
| 15 · Individual contributions | Sivanajani | 0:15 | 9:30 |
| 16 · Repository & QR code | Sivanajani | 0:12 | **9:42** |

Slides **17–26 are not presented**. They stay up your sleeve for the question round — scripts for them are in §14.3.

### If you are running late — cut in this order

1. Slide 7, the sample rows — say only the four numbers (saves 12 s)
2. Slide 13, the phase strip — say only "pilot, evaluate, expand" (saves 12 s)
3. Slide 2, the alternatives box — say only the last line (saves 15 s)
4. Slide 5, the "what this buys us" column (saves 12 s)
5. Slide 14, the standards list (saves 10 s)
6. In the demo: skip the FHIR send and go straight to the threshold change (saves 20 s)

**Never cut:** slide 5 (the hinge), slide 9 (critical thinking), the threshold change in the demo, the residual risk on slide 12.

---

# PART 1 — Feline Weger · slides 1–9

## SLIDE 1 · Title — *0:15*

**On screen:** WundCheck · both names · 48 / 18 / 9 / 8

**Say:**

> Good afternoon. We are Feline Weger and Sivanajani Sivakumar.
>
> Most surgical wound infections do not appear in the hospital. They appear at home, after discharge — **exactly when nobody is looking at the wound**.
>
> Our project is called WundCheck. In one sentence: **we translated a guideline written for health professionals into an instrument for laypersons — and we learned where that translation becomes dangerous.**

**Do:** do not read the four numbers. They are there so the audience sees the scale while you talk.

---

## SLIDE 2 · Health system need — *0:42*

**On screen:** 60.1 % · Too late · Too early · alternatives · scope

**Say:**

> The number on the left is the whole problem. **Sixty per cent of surgical site infections occur after discharge** — a systematic review of one point four million operations. The CDC surveillance window is thirty days, ninety for implants. Almost all of that time the patient is at home.
>
> And the observation gap cuts both ways. **Too late**: a warning sign gets read as normal healing, and treatment starts days later than it could. **Too early**: a scab or day-two redness triggers a call that costs practice time and frightens the patient.
>
> We looked at the alternatives. A leaflet already exists everywhere and gives us no feedback. Telephone follow-up is not deliverable daily. Photo-based machine learning fails on light, angle and skin tone, and it cannot explain itself. **In a patient-facing safety context, explainability beats predictive accuracy** — so: a rule-based CDSS, traceable to a guideline, maintainable by clinicians.
>
> Scope: adults, elective surgery, primary closure, any body region. Not chronic wounds, not burns, not children.

**Do:** point at "60.1 %" once. Point at the green "Rule-based CDSS" row once.

---

## SLIDE 3 · Personas & Scenario A — *0:35*

**On screen:** three personas · Scenario A "Day 6 — the scab"

**Say:**

> Three users on three levels — and **only one of them operates the app**. Peter, fifty-eight, four days after a knee replacement, little medical knowledge. Sandra in the practice, who triages messages all day. And Dr Keller, who wants the trajectory, not a recollection.
>
> Each persona produced a design decision. **Images instead of clinical terms — that is Peter. Alerts only from orange upwards — that is Sandra. The classification as its own FHIR Observation — that is Dr Keller.**
>
> Scenario A is the one people underestimate. Day six, a brown scab. Peter's brother once had a wound infection, so he is worried. WundCheck says green and says *why*: a scab is a normal sign of healing. He does not call. But **the entry still goes into the record** — otherwise the surgeon has no trajectory at suture removal.
>
> **The call that is avoided is worth as much as the one that is triggered.**

---

## SLIDE 4 · L1 & evidence appraisal — *0:42*

**On screen:** four sources · ASEPSIS discarded · how good is our evidence

**Say:**

> Four sources, and we gave each of them one role. **CDC defines what an infection is. NICE says when to act. Southampton says how to describe a wound visually.**
>
> NICE is also our legitimation. Recommendation one-point-one-point-three already requires that patients be taught to recognise a surgical site infection. **That recommendation normally ends its life as a leaflet. We operationalise it.**
>
> The box on the left is a decision we want to be asked about. ASEPSIS is the better-performing instrument in the literature. It needs antibiotic days, drainage, debridement, inpatient days, culture results — **none of which a patient at home can give us**. We chose the usable instrument over the statistically better one, and we say so out loud.
>
> And on the right we grade our own evidence rather than citing it. Campwala: **twenty-two patients**, retrospective, single-centre, breast reconstruction — a population far from ours, with implant failure as the endpoint. Southampton showed only limited predictive value there. **So we use it as a triage and communication grid, not as a prognostic instrument.**

**Do:** this is the slide where you sound like a clinician, not a student. Slow down on the last sentence.

---

## SLIDE 5 · Southampton mapping — *0:42* — **the hinge of the talk**

**On screen:** grades 0–V mapped to image cards · the adaptation problem

**Say:**

> This is the hinge of the whole project, so I will stay here a moment.
>
> Our core interaction is that the patient picks a **picture** of their wound. The obvious objection is that we invented those pictures to make a nice interface. We did not. **Every image card is a published Southampton grade.** Grade zero, normal healing, is "calm and dry". Grade two, erythema plus other signs of inflammation, is "markedly reddened and swollen". Grade four, pus, is "cloudy discharge". Grade five is "open".
>
> That buys us three things: a citable source for our central interaction, a non-trivial derived element — **the grade is calculated, not asked** — and an honest limitation.
>
> Because the mapping is not clean. Southampton grades redness as **"more than two centimetres along the wound"**. Patients do not measure. So we ask: one small spot, or the whole wound? **Closer to usable, further from precise.** That trade-off is documented, and it is the single most important thing we would want validated.

---

## SLIDE 6 · BPMN high-level — *0:30*

**On screen:** the four-lane BPMN diagram, full width

**Say:**

> This is real BPMN two-point-zero, editable in bpmn dot io — not a flowchart with diamonds.
>
> Four lanes, so responsibility is explicit: patient, app, decision logic, practice. **The one thing to notice is the business rule task.** The app does not decide anything. It executes the L3 decision table. That is why the next two slides are about the table and not about the code.
>
> Two more things. **Every completed check is written to the record — including the green ones**, because without that baseline there is no trajectory. And there are two end events: check completed, or case handed to the practice.

**Do:** trace the lane boundaries with your hand once, then point at the business rule task and leave your hand there while you say that sentence.

---

## SLIDE 7 · Data dictionary — *0:25*

**On screen:** 48 / 9 / 38 / 47 · five sample rows

**Say:**

> **Forty-eight data elements. Nine are calculated. Thirty-eight carry a terminology binding — SNOMED, LOINC, ICD-10. Forty-seven have a FHIR mapping.**
>
> The column that matters is the last one: every element names the L1 source it comes from. And **the element ID is the same string in the data dictionary, the L3, the test protocol and the FHIR export** — that is what makes traceability demonstrable instead of claimed.
>
> One design note: the sequence follows the patient, not the guideline. Baseline data once, then how do I feel, then the wound — **because looking at the wound means opening the dressing**.

---

## SLIDE 8 · Decision logic — *0:38*

**On screen:** the worst-first cascade · why worst-first · two-pass

**Say:**

> Eighteen rules. Thirteen are exclusive and evaluated in this order, worst first. Five are information rules that fire alongside the classification.
>
> **Worst-first means a reassuring finding can never overwrite a warning.** That is a deliberate asymmetry: a false alarm costs a phone call, false reassurance can delay an infection by days. **We accept a higher false-alarm rate on purpose**, and we say so in the risk section.
>
> The box on the right is a real finding. One rule needs the classification as its own input — persistence, two yellow days in a row. That is circular. So the rules run twice, and **the worse of the two results wins: a second pass can escalate, never de-escalate**. We only discovered that when we executed the table, not when we wrote it.
>
> And every threshold on this slide is a named constant in the L3 with its source attached. **A guideline change is one line, not a release.** You will see that live in a moment.

---

## SLIDE 9 · L1 → L2 challenges — *0:38*

**On screen:** nine challenge cards · C-01 and C-03 detail

**Say:**

> Nine places where the guideline stopped and left us on our own. Each one is documented with its type, our decision, the rationale, the implication and a risk level. Two of them are marked high, and **they sit in the same place**.
>
> **C-01**: Southampton was built for trained staff. We turned it into an image selection for laypeople. That is our core idea — **and it is unvalidated**.
>
> **C-03**: no source we found defines the day on which redness stops being physiological. We set **day three**. Too early means false alarms. Too late means delayed detection. It is a defensible number, but it is our number, not the guideline's.
>
> All nine would need clinical sign-off before this touched a patient. **We do not have it, and we list that as a limitation rather than hiding it.**

---

> ### 🔄 Handover — Feline → Sivanajani
> **Sivanajani opens slide 10 with:** *"Which brings us to where all of that knowledge actually lives — because it is deliberately not in the app."*

---

# PART 2 — Sivanajani Sivakumar · slides 10–16

## SLIDE 10 · L3 architecture — *0:30*

**On screen:** four options compared · the no-hardcoding claim

**Say:**

> We compared four ways to make the L2 machine-readable. XLSForm is executable by existing engines, but its standard widgets cannot carry our image cards — **the tooling would have dictated our UX**, and the images are the whole idea. FHIR Questionnaire plus CQL is the full standard, but the point from the lecture stands: FHIR resources are not human-readable, and Feline had to be able to review this in six days. Hardcoding is fastest and needs a developer for every rule change.
>
> So: **we author in a custom JSON that reads like the L2, and we speak standards at the interface.** We do not achieve full software neutrality. That is a stated trade-off, not an oversight.
>
> And the claim at the bottom is not a promise, it is **a check that fails the build**. It scans the app source for every element ID, every rule ID, every threshold, every code system and the endpoint. **It found two real leaks the first time we ran it.**

---

## SLIDE 11 · Live demo — *1:50*

**On screen:** dark demo slide → **switch to the browser**

> ### ⚙️ Set this up *before* the talk — see the checklist in §14.4
> The app must already be open in a second window with the **baseline section completed and the day-6 answers entered**. On stage you click only the interesting answers. Filling forty-eight fields live will cost you three minutes you do not have.

**Framing — 10 s, still on the slide:**

> This is the running application — one HTML file, no server, no installation, it works offline. One patient, two days, and then one change that is the actual point.

**Do:** switch to the browser.

### Step 1 — Day 6, GREEN · ~30 s

**Click:** wound picture → **"Calm & dry"** · fluid → **"None"** · scab → **"Yes"** · **Evaluate check**

> Day six after a knee replacement. Temperature thirty-six point nine, pain two out of ten and improving. The patient picks the picture — **not a clinical term, a picture**. No discharge. But a scab has formed, and that is exactly the thing laypeople read as a problem.
>
> *(after clicking Evaluate)* **Green — and it says why.** "A scab is a normal sign of healing, do not pick it off." The reason is always shown next to the colour; that is our answer to automation bias. No call to the clinic — and the entry still goes into the record.

### Step 2 — Day 7, ORANGE + FHIR · ~35 s

**Click:** **New day** · wound picture → **"Markedly reddened"** · fluid → **"Cloudy"** · **Evaluate check** · then **Send to patient record**

> Next day. Thirty-eight point three degrees, pain up to six and worsening, the wound markedly reddened — and now cloudy discharge.
>
> *(after clicking Evaluate)* **Orange, suspected infection, contact your practice today.** That is rule R4: **purulent discharge is a primary CDC criterion for a superficial incisional infection**, and it fires regardless of anything else.
>
> *(clicking Send to patient record)* And this goes straight into the record — **a FHIR R4 transaction bundle**: the QuestionnaireResponse, an Observation carrying the classification, and — because this case is orange — a **Communication** alert to the practice. The endpoint is configuration in the L3, not a line of code.

### Step 3 — the threshold change · ~35 s — **this is the point**

**Click:** **New day**, day-8 borderline case (37.6 °C, everything else unremarkable) → **Evaluate check** → GREEN
**Then:** open the **L3 inspector** at the foot of the page → change **`fever_orange` 38.0 → 37.5** → **apply** → **Evaluate check** again

> One more day. Thirty-seven point six degrees, nothing else remarkable. **Green — because thirty-seven point six is below our thirty-eight degree threshold.** The rule is right. But is the threshold?
>
> Every threshold lives in the L3, and each one names its source. Suppose a guideline update lowers it. *(changing the value)* Thirty-eight point zero becomes thirty-seven point five. Re-evaluate.
>
> **Same patient. Same answers. Different result.** No rebuild, no deployment, no developer — **not one line of code was touched.** That is what the layer model is actually for: the app renders and executes, and every piece of clinical knowledge sits in a file a clinician can read.

**Do:** switch back to the slides.

**If anything hangs or misbehaves:** stop clicking immediately. Go back to the slide and walk the three numbered steps from the screenshots — 25 s — and add: *"the recorded walkthrough is in the submission package, and the app is a single HTML file you can open yourselves."*

---

## SLIDE 12 · Quality assurance — *0:45*

**On screen:** eight defects · 19/19 · 20/20 · 6 hazards · residual risk

**Say:**

> We used the risk-based approach from the testing lecture: identify hazards, rank them by risk, test the critical paths first, then **document what is left over**.
>
> Six hazards ranked, nineteen decision-logic test cases, twenty FHIR conformance checks. All passing — but that is not the interesting part. **Eight defects. And three of them could not have been found by reading our own documents.**
>
> B-zero-seven: the trend rule referenced its own result, so it could never fire. B-zero-eight: after we fixed that, the rule turned out to be unreachable behind the worst-first cascade anyway. **Both only surfaced when the rules were actually executed** — that is exactly the L2-to-L4 translation problem. B-zero-six was a contradiction between two of our own documents: Southampton four was red in one and orange in the other.
>
> And the box on the right is the honest one. **We never tested the one thing our whole approach rests on — whether laypeople pick the right picture.** We cannot test that without patients. So it becomes a monitoring indicator: **green cases who still present to a physician within seventy-two hours.**

---

## SLIDE 13 · Implementation, monitoring & evaluation — *0:35*

**On screen:** five-phase strip · three columns

**Say:**

> Delivery is a **QR code on the discharge sheet** — no app store, no account, no installation. Five minutes of training at discharge, with the first check done together.
>
> **The content is owned by the clinical department, not by us.** Four-eyes sign-off, and a target of a guideline update being live in **under four weeks**.
>
> Monitoring is the four ISO categories — functionality, stability, fidelity, data quality — each with a number against it. Evaluation scales with the phase: usability and patient-versus-clinician agreement in the pilot; **time to medical contact** as the primary outcome in a chart review; a stepped-wedge design and SSI rate only at scale-up.
>
> The stakeholder who decides whether this survives is **the practice**. If the alerts feel like a burden, the implementation fails no matter how good the classification is.

---

## SLIDE 14 · Impact & regulation — *0:28*

**On screen:** benefits vs risks · IMDRF matrix

**Say:**

> Benefits: earlier treatment, fewer contacts without consequence, a complete trajectory, structured follow-up data. Risks, and we take them seriously: automation bias, alert fatigue, **scaling our own errors consistently and at volume**, and a digital divide that this may widen rather than close.
>
> Is it a medical device? **Yes. Software as a medical device, IMDRF Category two.** The condition is serious — an untreated infection is not self-limiting. The information drives clinical management: we neither diagnose nor treat, but we determine whether and when someone seeks care.
>
> **You could argue for Category three via sepsis risk.** We chose two because the category describes the typical condition, not the rare extreme — and we would rather defend the reasoning than the label.

---

## SLIDE 15 · Individual contributions — *0:15*

**On screen:** the two roles

**Say:**

> Feline owned the clinical layers: the sources, the evidence appraisal, the personas, and the whole L2 — BPMN, data dictionary, decision table. I owned the L3, the application, the FHIR interface and the quality assurance, plus implementation and regulation.
>
> **We cross-assigned the testing on purpose: neither of us signed off our own layer.** And both of us can answer questions on the whole project.

---

## SLIDE 16 · Repository & QR code — *0:12*

**On screen:** QR code · github.com/Sivanajani/smart-wound-guideline-app

**Say:**

> Everything is in the repository — the documents, the BPMN sources, the L3, the running app and the test scripts. **Scan the code and you can re-run every check we just claimed.**
>
> Thank you. We are happy to take questions.

**Do:** leave this slide up for the entire question round. The QR code stays on screen and the repository answers half the possible questions by itself.

---

# 14.3 Backup slides 17–26 — script for each

These are **not** presented. Jump to one only when a question calls for it: in presenter mode type the number and press Enter. Each block below is 20–30 s — say it, then stop and return to slide 16.

## SLIDE 17 · Decision table — all 18 rules

> Here is the complete table. Thirteen exclusive rules in priority order, five information rules that fire alongside. Each row carries the condition **and the source it came from** — CDC for the discharge and dehiscence rules, NICE one-point-four-point-nine for the red streak, Southampton for the grading rules. **R8 at the bottom is the catch-all**: it always matches, so no input can ever fall through without an answer — and even R8 never says "everything is fine" without a hint about when to make contact.

## SLIDE 18 · Test protocol — 19 cases

> Nineteen cases, and they are not arbitrary — they are chosen against the hazard ranking. T1 to T3 are the red paths. T5 and T14 are the counter-checks: cases that **must not** escalate, because over-triage is a real failure mode too. T13, T11, T12 and T16 are the retests for the defects we fixed. **T15, T17 and T19 are the three that failed on first run** and produced defects B-06, B-07 and B-08. T19 is the threshold change you saw in the demo, as an automated test.

## SLIDE 19 · Hazard analysis and risk matrix

> Six hazards, scored severity times likelihood. The two in the red zone are **H-01, a missed infection classified green**, and H-03, an emergency rule that is unreachable. Both drove the test order — we tested the red paths before we tested anything cosmetic. The matrix is also our argument for worst-first: **it moves risk from the severe corner into the tolerable one**, at the cost of more false alarms.

## SLIDE 20 · BPMN — detail process inside the app

> This is the process one level down: input validation, the two-pass evaluation, the worst-first cascade as explicit gateways, and the write-back. **The gateway chain is the decision table one to one** — the same rule IDs. That is deliberate: the diagram and the executable file cannot drift apart, because they are generated from the same rule set.

## SLIDE 21 · The FHIR interface

> One check produces **three resources in a single transaction bundle**. The QuestionnaireResponse holds the raw answers against a versioned canonical Questionnaire. The Observation carries the classification, coded in SNOMED, with the Southampton grade and the fired rule as components. And the Communication is the alert to the practice, **created only from orange upwards** — that is Sandra's persona turned into a technical rule. The endpoint, the patient reference and the alert recipient are all L3 configuration.

## SLIDE 22 · Traceability — one finding, all the way through

> This is one finding traced end to end: the **CDC criterion "purulent drainage"** becomes data element DE-035 with a SNOMED code, which is used by rule R4 at orange priority, which produces an Observation component in the FHIR bundle, and which is verified by test case T15. **Five artefacts, one identifier.** If you change the element, everything downstream of it is findable in seconds.

## SLIDE 23 · The L3 in one screen

> This file **is** the CDSS. Metadata with the thresholds and their sources, the elements with their labels in two languages and their terminology bindings, and the decision rules with their conditions and outputs. The app that renders it contains none of this. **Hand this file to a different renderer and you have the same clinical system** — that is the property we were actually trying to buy.

## SLIDE 24 · Data dictionary — the four required columns

> The full dictionary has forty-eight rows; this is an excerpt showing the four columns the assignment asks for — **the element, its type and permitted values, its terminology binding, and its FHIR mapping** — plus a fifth we added, the L1 source. Nine elements are calculated rather than asked, eight carry plausibility constraints, and four are conditional on an earlier answer.

## SLIDE 25 · Depth that did not fit into ten minutes

> A pointer slide. It lists the testing types we applied, the versioning and update path for the L3, the multilingualism approach, the interoperability level we reach — **structural yes, semantic partly, organisational no** — and what we would do differently with more time. **The honest answer to that last one is: validate the image assignment. Everything else is second.**

## SLIDE 26 · Sources

> Ten sources. Woelber for the sixty per cent, ECDC and WHO for incidence, CDC for the definition, NICE for the management recommendations, Bailey for the Southampton system, Campwala for the comparison, WHO for the M&E framework and the SMART layer model, IMDRF for the risk categorisation, and HL7 for the FHIR resources.

---

# 14.4 Q&A — which slide to jump to

| If they ask… | Jump to | One-line answer to open with |
|---|---|---|
| "Show me the full rule set" | **17** | "Thirteen exclusive, five information rules, in priority order." |
| "What exactly did you test?" | **18** | "Nineteen cases, chosen by hazard rank — three of them found defects." |
| "How did you rank the risks?" | **19** | "Severity times likelihood; the two reds drove the test order." |
| "What happens inside the app?" | **20** | "The gateway cascade is the decision table one to one." |
| "How do you connect to a hospital system?" | **21** | "FHIR R4 transaction bundle; the endpoint is L3 configuration, not code." |
| "Can you trace one finding end to end?" | **22** | "CDC criterion, data element, rule, FHIR resource, test case — one screen." |
| "What does your L3 actually look like?" | **23** | "This file *is* the CDSS. The app is a renderer." |
| "Did you produce a proper data dictionary?" | **24** | "All four required columns, forty-eight rows." |
| "What would you do with more time?" | **25** | "Validate the image assignment. Everything else is second." |
| "Where are your sources?" | **26** | — |

| If they ask… | Answer from | Core answer |
|---|---|---|
| Why these guidelines and not others? | slide 4 | Three roles: definition, management, instrument. |
| Why Southampton if the study says it is weak? | slide 5 | Triage grid, not prognosis — and the study is n = 22 in a different population. |
| Why not ASEPSIS? | slide 4 | Requires data a patient cannot produce. |
| Your hardest translation decision? | slide 9 | C-01 and C-03 — both high risk, both ours. |
| Where is the logic most fragile? | slide 12 → 19 | Image assignment by laypeople. Untested, monitored. |
| Why not XLSForm? | slide 10 | Standard widgets cannot carry the image cards. |
| How long does a guideline update take? | slide 13 → 23 | Target under four weeks; technically one line in the L3. |
| What did you *not* test? | slide 12 | Named explicitly as residual risk (a)–(d). |
| Is this a medical device? | slide 14 | SaMD, IMDRF II, with the rationale — and the argument for III. |
| How do you prevent automation bias? | slide 11 / 14 | The result always names its reason; green never means "do nothing". |
| A case that matches no rule? | slide 17 | Catch-all R8 — never "everything is fine" without a contact hint. |
| Which interoperability level? | slide 13 footer / 25 | Structural yes, semantic partly, organisational no. |
| Primary outcome in an evaluation? | slide 13 | Time to medical contact. |
| Who is liable for a wrong recommendation? | slide 14 | An open question — say that it is open, do not invent an answer. |

**Two answers to have ready that are not on a slide:**

- *"Did you use AI to build this?"* — Yes, for drafting and for the tooling. The clinical decisions, the source appraisal and the nine translation calls are ours, and every threshold names the source it came from.
- *"Would you deploy this?"* — No. Not without clinical sign-off on all nine translation decisions and a validation study on the image assignment. It is a study prototype.

---

# 14.5 Before you walk in

### Live-demo setup — do this at least 15 minutes before

- [ ] `l4/wundcheck-app.html` open in a browser window, **from the local file**, not from a cloud drive
- [ ] Browser zoom at **125–150 %** — the projector is further away than your laptop
- [ ] **Baseline section already completed** (patient, date of birth, operation date and site, closure, duration, prophylaxis, drainage, risk factors, height, weight). It is asked once and it is not part of the story
- [ ] **Day-6 answers already entered** except the three you click on stage: wound picture, fluid, scab
- [ ] Language set to **English**
- [ ] The **L3 inspector** at the foot of the page opened once and scrolled to, so you know where it is
- [ ] Test the whole click-through once, end to end, including the threshold change — then **reload the page and re-enter the baseline** so you start clean
- [ ] Slides and browser on the same screen, `Alt`+`Tab` order checked
- [ ] Screen saver and notifications off

### Rehearsal

- [ ] Run it twice with a stopwatch. The first run will be long — cut in the order given in §14.1, do not speed up
- [ ] Rehearse the demo **twice as often as the slides**. It is the only part that can fail in public
- [ ] Practise the one handover sentence after slide 9 — it is the only place the talk can visibly stall
- [ ] Sivanajani's block ends the talk and is the one most likely to be rushed. Rehearse slides 12–16 under time pressure
- [ ] Backup slide numbers 17–26: both of you should know at least 17, 18, 21 and 23 by number
- [ ] Demo video in the submission folder as the emergency fallback — know where it is
