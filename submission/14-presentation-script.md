# 14 · Presentation Script — word for word, slide by slide

> **Assignment:** *"Duration: 10 minutes for presentation, 10 minutes for questions."*
> This document is the spoken text for `WundCheck_CDSS_Presentation.pptx`. It is written to be **said**, not read out — short sentences, no sub-clauses, no numbers that the audience cannot hold in their head.

---

## 14.1 How to use this script

| | |
|---|---|
| **Target length** | **9 min 45 s** of the 10 minutes — the buffer is deliberate |
| **Pace** | ~2.3 words per second. That is slower than it feels. If you finish a slide early, pause; do not add words |
| **Rule 1** | Never read a slide out loud. The slide is the evidence, you are the argument |
| **Rule 2** | Every handover has one sentence that belongs to the *incoming* speaker, not the outgoing one — it is printed below |
| **Rule 3** | Bold text = say it exactly like that. It is either a number, a claim we have to be able to defend, or the thread |

**The thread — say it on slide 1 and again on slide 15:**

> **"We translated a guideline written for health professionals into an instrument for laypersons — and we learned where that translation becomes dangerous."**

### Timing plan

| Slide | Speaker | Time | Running total |
|---|---|---|---|
| 1 · Title | Clinical lead | 0:12 | 0:12 |
| 2 · Health system need | Clinical lead | 0:45 | 0:57 |
| 3 · Personas & Scenario A | Clinical lead | 0:35 | 1:32 |
| 4 · L1 & evidence appraisal | Clinical lead | 0:45 | 2:17 |
| 5 · Southampton mapping | Clinical lead | 0:45 | 3:02 |
| 6 · BPMN high-level | L2 lead | 0:30 | 3:32 |
| 7 · Data dictionary | L2 lead | 0:25 | 3:57 |
| 8 · Decision logic | L2 lead | 0:40 | 4:37 |
| 9 · L1 → L2 challenges | Clinical lead | 0:40 | 5:17 |
| 10 · L3 architecture | Tech lead | 0:30 | 5:47 |
| 11 · **Demo (video 1:46)** | Tech lead | 1:55 | 7:42 |
| 12 · QA & residual risk | QA lead | 0:45 | 8:27 |
| 13 · Implementation & M&E | QA lead | 0:38 | 9:05 |
| 14 · Impact & regulation | QA lead | 0:30 | 9:35 |
| 15 · Contributions | Clinical lead | 0:10 | **9:45** |

### If you are running late — cut in this order

1. Slide 7, the sample rows — say only the four numbers (saves 12 s)
2. Slide 13, the phase strip — say only "pilot, evaluate, expand" (saves 12 s)
3. Slide 2, the alternatives box — say only the last line (saves 15 s)
4. Slide 5, the "what this buys us" column (saves 12 s)
5. Slide 14, the standards list (saves 10 s)

**Never cut:** slide 5 (the hinge), slide 9 (critical thinking), the threshold change in the demo, the residual risk on slide 12.

---

## SLIDE 1 · Title — *Clinical lead · 0:12*

**On screen:** WundCheck · 48 / 18 / 9 / 8

**Say:**

> Good afternoon. Most surgical wound infections do not appear in the hospital. They appear at home, after discharge — **exactly when nobody is looking at the wound**.
>
> Our project is called WundCheck. In one sentence: **we translated a guideline written for health professionals into an instrument for laypersons — and we learned where that translation becomes dangerous.**

**Do:** do not read the four numbers. They are there so the audience sees the scale while you talk.

---

## SLIDE 2 · Health system need — *Clinical lead · 0:45*

**On screen:** 60.1 % · Too late · Too early · alternatives · scope

**Say:**

> The number on the left is the whole problem. **Sixty per cent of surgical site infections occur after discharge** — that is a systematic review of one point four million operations. The CDC surveillance window is thirty days, ninety for implants. Almost all of that time the patient is at home.
>
> And the observation gap cuts both ways. **Too late**: a warning sign gets read as normal healing, and treatment starts days later than it could. **Too early**: a scab or day-two redness triggers a call that costs practice time and frightens the patient.
>
> We looked at the alternatives. A leaflet already exists everywhere and gives us no feedback. Telephone follow-up is not deliverable daily. Photo-based machine learning fails on light, angle and skin tone, and it cannot explain itself. **In a patient-facing safety context, explainability beats predictive accuracy** — so: a rule-based CDSS, traceable to a guideline, maintainable by clinicians.
>
> Scope: adults, elective surgery, primary closure, any body region. Not chronic wounds, not burns, not children.

**Do:** point at "60.1 %" once. Point at the green "Rule-based CDSS" row once.

---

## SLIDE 3 · Personas & Scenario A — *Clinical lead · 0:35*

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

## SLIDE 4 · L1 & evidence appraisal — *Clinical lead · 0:45*

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

## SLIDE 5 · Southampton mapping — *Clinical lead · 0:45* — **the hinge of the talk**

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

> ### 🔄 Handover — Clinical lead → L2 lead
> **The incoming speaker says:** *"So that is the knowledge. My part is turning it into something a machine can execute."*

---

## SLIDE 6 · BPMN high-level — *L2 lead · 0:30*

**On screen:** the four-lane BPMN diagram, full width

**Say:**

> This is real BPMN two-point-zero, editable in bpmn dot io — not a flowchart with diamonds.
>
> Four lanes, so responsibility is explicit: patient, app, decision logic, practice. **The one thing to notice is the business rule task.** The app does not decide anything. It executes the L3 decision table. That is why the next four slides are about the table and not about the code.
>
> Two more things. **Every completed check is written to the record — including the green ones**, because without that baseline there is no trajectory. And there are two end events: check completed, or case handed to the practice.

**Do:** trace the lane boundaries with your hand once, then point at the business rule task and leave your hand there while you say that sentence.

---

## SLIDE 7 · Data dictionary — *L2 lead · 0:25*

**On screen:** 48 / 9 / 38 / 47 · five sample rows

**Say:**

> **Forty-eight data elements. Nine are calculated. Thirty-eight carry a terminology binding — SNOMED, LOINC, ICD-10. Forty-seven have a FHIR mapping.**
>
> The column that matters is the last one: every element names the L1 source it comes from. And **the element ID is the same string in the data dictionary, the L3, the test protocol and the FHIR export** — that is what makes traceability demonstrable instead of claimed.
>
> One design note: the sequence follows the patient, not the guideline. Baseline data once, then how do I feel, then the wound — **because looking at the wound means opening the dressing**.

---

## SLIDE 8 · Decision logic — *L2 lead · 0:40*

**On screen:** the worst-first cascade · why worst-first · two-pass

**Say:**

> Eighteen rules. Thirteen are exclusive and evaluated in this order, worst first. Five are information rules that fire alongside the classification.
>
> **Worst-first means a reassuring finding can never overwrite a warning.** That is a deliberate asymmetry: a false alarm costs a phone call, false reassurance can delay an infection by days. **We accept a higher false-alarm rate on purpose**, and we say so in the risk section.
>
> The box on the right is a real finding. One rule needs the classification as its own input — persistence, two yellow days in a row. That is circular. So the rules run twice, and **the worse of the two results wins: a second pass can escalate, never de-escalate**. We only discovered that when we executed the table, not when we wrote it.
>
> And every threshold on this slide is a named constant in the L3 with its source attached. **A guideline change is one line, not a release.** You will see that in the demo.

---

> ### 🔄 Handover — L2 lead → Clinical lead
> **The incoming speaker says:** *"What that table hides is how many judgement calls are inside it. Nine of them."*

---

## SLIDE 9 · L1 → L2 challenges — *Clinical lead · 0:40*

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

> ### 🔄 Handover — Clinical lead → Tech lead
> **The incoming speaker says:** *"Which brings us to the question of where all of that knowledge actually lives."*

---

## SLIDE 10 · L3 architecture — *Tech lead · 0:30*

**On screen:** four options compared · the no-hardcoding claim

**Say:**

> We compared four ways to make the L2 machine-readable. XLSForm is executable by existing engines, but its standard widgets cannot carry our image cards — **the tooling would have dictated our UX**, and the images are the whole idea. FHIR Questionnaire plus CQL is the full standard, but the lecture's own point stands: FHIR resources are not human-readable, and our clinical lead had to be able to review this in six days. Hardcoding is fastest and needs a developer for every rule change.
>
> So: **we author in a custom JSON that reads like the L2, and we speak standards at the interface.** We do not achieve full software neutrality. That is a stated trade-off, not an oversight.
>
> And the claim at the bottom is not a promise, it is **a check that fails the build**. It scans the app source for every element ID, every rule ID, every threshold, every code system and the endpoint. **It found two real leaks the first time we ran it.**

---

## SLIDE 11 · Demo — *Tech lead · 1:55 (video 1:46)*

**On screen:** dark demo slide · then the video

**Before you start the video — 10 s:**

> One patient, two days, and then one change that is the actual point. This is a screen recording of the running app — no slides, no mock-ups.

**Do:** start the video. **Then be quiet.** The video has its own captions. Speak only at the three moments below, and only if the room is silent.

| At | Say |
|---|---|
| ~0:35, when GREEN appears | *"Green — and it says why. That is against automation bias."* |
| ~1:05, when ORANGE appears | *"Rule R4. Purulent discharge is a primary CDC criterion."* |
| ~1:20, the FHIR send | *"A FHIR R4 transaction bundle straight into the record — QuestionnaireResponse, Observation, and a Communication alert because this one is orange."* |

**After the video — 10 s:**

> The last thirty seconds are the part I would ask you to remember. **We changed one threshold in the L3 — thirty-eight degrees to thirty-seven-point-five — and the same patient with the same answers came out differently. No rebuild. No developer. Not one line of code.** That is what the layer model is for.

**If the video does not start:** do not troubleshoot. Say *"I have the screenshots here"*, walk the three numbered steps on the slide (25 s), and add: *"the file is in the submission package and the app itself is a single HTML file you can open offline."*

---

> ### 🔄 Handover — Tech lead → QA lead
> **The incoming speaker says:** *"And that demo is the friendly version. My job was to find where it breaks."*

---

## SLIDE 12 · Quality assurance — *QA lead · 0:45*

**On screen:** eight defects · 19/19 · 20/20 · 6 hazards · residual risk

**Say:**

> We used the risk-based approach from day five: identify hazards, rank them by risk, test the critical paths first, then **document what is left over**.
>
> Six hazards ranked, nineteen decision-logic test cases, twenty FHIR conformance checks. All passing — but that is not the interesting part. **Eight defects. And three of them could not have been found by reading our own documents.**
>
> B-zero-seven: the trend rule referenced its own result, so it could never fire. B-zero-eight: after we fixed that, the rule turned out to be unreachable behind the worst-first cascade anyway. **Both only surfaced when the rules were actually executed** — that is exactly the L2-to-L4 translation problem the assignment asks about. B-zero-six was a contradiction between two of our own documents: Southampton four was red in one and orange in the other.
>
> And the box on the right is the honest one. **We never tested the one thing our whole approach rests on — whether laypeople pick the right picture.** We cannot test that without patients. So it becomes a monitoring indicator: **green cases who still present to a physician within seventy-two hours.**

---

## SLIDE 13 · Implementation, monitoring & evaluation — *QA lead · 0:38*

**On screen:** five-phase strip · three columns

**Say:**

> Delivery is a **QR code on the discharge sheet** — no app store, no account, no installation. Five minutes of training at discharge, with the first check done together.
>
> **The content is owned by the clinical department, not by us.** Four-eyes sign-off, and a target of a guideline update being live in **under four weeks**.
>
> Monitoring is the four ISO categories: functionality, stability, fidelity, data quality — with a number against each. Evaluation scales with the phase: usability and patient-versus-clinician agreement in the pilot; **time to medical contact** as the primary outcome in a chart review; a stepped-wedge design and SSI rate only at scale-up.
>
> The stakeholder who decides whether this survives is **the practice**. If the alerts feel like a burden, the implementation fails no matter how good the classification is. That is why alerts start at orange, and why alert load is a monitoring indicator in its own right.

---

## SLIDE 14 · Impact & regulation — *QA lead · 0:30*

**On screen:** benefits vs risks · IMDRF matrix

**Say:**

> Benefits: earlier treatment, fewer contacts without consequence, a complete trajectory, structured follow-up data. Risks, and we take them seriously: automation bias, alert fatigue, **scaling our own errors consistently and at volume**, and a digital divide that this may widen rather than close.
>
> Is it a medical device? **Yes. Software as a medical device, IMDRF Category two.** The condition is serious — an untreated infection is not self-limiting. The information drives clinical management: we neither diagnose nor treat, but we determine whether and when someone seeks care.
>
> **You could argue for Category three via sepsis risk.** We chose two because the category describes the typical condition, not the rare extreme — and we would rather defend the reasoning than the label.

---

## SLIDE 15 · Individual contributions — *Clinical lead · 0:10*

**On screen:** four roles, four names

**Say:**

> Four roles, and the artefacts each of us owns are listed. **Every one of us can answer questions on the whole project, not only on our own part.** Thank you — we are happy to take questions.

**Do:** stay standing as a group. Do not sit down.

---

# 14.2 Q&A — which backup slide to jump to

Backup slides are 16–25 and are **after** slide 15. In presenter mode, type the number and press Enter.

| If they ask… | Jump to | One-line answer to open with |
|---|---|---|
| "Show me the full rule set" | **16** | "Thirteen exclusive, five information rules, in priority order." |
| "What exactly did you test?" | **17** | "Nineteen cases, chosen by hazard rank — three of them found defects." |
| "How did you rank the risks?" | **18** | "Severity times likelihood; the two reds drove the test order." |
| "What happens inside the app?" | **19** | "The detail process — the gateway cascade is the decision table one-to-one." |
| "How do you connect to a hospital system?" | **20** | "FHIR R4 transaction bundle; the endpoint is L3 configuration, not code." |
| "Can you trace one finding end to end?" | **21** | "CDC criterion, data element, rule, FHIR resource — one screen." |
| "What does your L3 actually look like?" | **22** | "This file *is* the CDSS. The app is a renderer." |
| "Did you produce a proper data dictionary?" | **23** | "All four required columns, forty-eight rows." |
| "What would you do with more time?" | **24** | "Validate the image assignment. Everything else is second." |
| "Where are your sources?" | **25** | — |

| If they ask… | Answer from | Core answer |
|---|---|---|
| Why these guidelines and not others? | slide 4 | Three roles: definition, management, instrument. |
| Why Southampton if the study says it is weak? | slide 5 | Triage grid, not prognosis — and the study is n = 22 in a different population. |
| Why not ASEPSIS? | slide 4 | Requires data a patient cannot produce. |
| Your hardest translation decision? | slide 9 | C-01 and C-03 — both high risk, both ours. |
| Where is the logic most fragile? | slide 12 → 18 | Image assignment by laypeople. Untested, monitored. |
| Why not XLSForm? | slide 10 | Standard widgets cannot carry the image cards. |
| How long does a guideline update take? | slide 13 → 22 | Target under four weeks; technically one line in the L3. |
| What did you *not* test? | slide 12 | Named explicitly as residual risk (a)–(d). |
| Is this a medical device? | slide 14 | SaMD, IMDRF II, with the rationale — and the argument for III. |
| How do you prevent automation bias? | slide 11 / 14 | The result always names its reason; green never means "do nothing". |
| A case that matches no rule? | slide 16 | Catch-all R8 — never "everything is fine" without a contact hint. |
| Which interoperability level? | slide 13 footer | Structural yes, semantic partly, organisational no. |
| Primary outcome in an evaluation? | slide 13 | Time to medical contact. |
| Who is liable for a wrong recommendation? | slide 14 | An open question — say that it is open, do not invent an answer. |

**Two answers to have ready that are not on a slide:**

- *"Did you use AI to build this?"* — Yes, for drafting and for the tooling. The clinical decisions, the source appraisal and the nine translation calls are ours, and every threshold names the source it came from.
- *"Would you deploy this?"* — No. Not without clinical sign-off on all nine translation decisions and a validation study on the image assignment. It is a study prototype.

---

# 14.3 Rehearsal checklist

- [ ] Run it twice with a stopwatch. First run will be long — cut in the order given in §14.1, not by speeding up
- [ ] The person on slides 12–14 speaks last and is most likely to be rushed. Rehearse *that* section under time pressure
- [ ] Play the video once on the presentation laptop, from the local file, with sound off
- [ ] Practise the four handover sentences — they are the only place the talk can visibly stall
- [ ] Names entered on slide 15
- [ ] Backup slide numbers 16–25 memorised by at least two people
