/* Spoken script for every slide, injected into the PowerPoint speaker notes.
   Source of truth: docs/14-presentation-script.md — keep the two in sync.
   Key: slide number (1-26). */

const L = "──────────────────────────────────────────────";

const SCRIPT = {

1: `SLIDE 1 · TITLE — FELINE · 0:15
${L}
SAY:
Good afternoon. We are Feline Weger and Sivanajani Sivakumar.

Most surgical wound infections do not appear in the hospital. They appear at home, after discharge — exactly when nobody is looking at the wound.

Our project is called WundCheck. In one sentence: we translated a guideline written for health professionals into an instrument for laypersons — and we learned where that translation becomes dangerous.

DO: do not read the four numbers out loud. They are there so the audience sees the scale while you talk.`,

2: `SLIDE 2 · HEALTH SYSTEM NEED — FELINE · 0:42
${L}
SAY:
The number on the left is the whole problem. Sixty per cent of surgical site infections occur AFTER discharge — a systematic review of one point four million operations. The CDC surveillance window is thirty days, ninety for implants. Almost all of that time the patient is at home.

And the observation gap cuts both ways. TOO LATE: a warning sign gets read as normal healing, and treatment starts days later than it could. TOO EARLY: a scab or day-two redness triggers a call that costs practice time and frightens the patient.

We looked at the alternatives. A leaflet already exists everywhere and gives us no feedback. Telephone follow-up is not deliverable daily. Photo-based machine learning fails on light, angle and skin tone, and it cannot explain itself. In a patient-facing safety context, explainability beats predictive accuracy — so: a rule-based CDSS, traceable to a guideline, maintainable by clinicians.

Scope: adults, elective surgery, primary closure, any body region. Not chronic wounds, not burns, not children.

DO: point at "60.1 %" once. Point at the green "Rule-based CDSS" row once.
CUT IF LATE: the alternatives box — say only the last line (saves 15 s).`,

3: `SLIDE 3 · PERSONAS & SCENARIO A — FELINE · 0:35
${L}
SAY:
Three users on three levels — and only one of them operates the app. Peter, fifty-eight, four days after a knee replacement, little medical knowledge. Sandra in the practice, who triages messages all day. And Dr Keller, who wants the trajectory, not a recollection.

Each persona produced a design decision. Images instead of clinical terms — that is Peter. Alerts only from orange upwards — that is Sandra. The classification as its own FHIR Observation — that is Dr Keller.

Scenario A is the one people underestimate. Day six, a brown scab. Peter's brother once had a wound infection, so he is worried. WundCheck says green and says WHY: a scab is a normal sign of healing. He does not call. But the entry still goes into the record — otherwise the surgeon has no trajectory at suture removal.

The call that is avoided is worth as much as the one that is triggered.`,

4: `SLIDE 4 · L1 & EVIDENCE APPRAISAL — FELINE · 0:42
${L}
SAY:
Four sources, and we gave each of them one role. CDC defines what an infection is. NICE says when to act. Southampton says how to describe a wound visually.

NICE is also our legitimation. Recommendation one-point-one-point-three already requires that patients be taught to recognise a surgical site infection. That recommendation normally ends its life as a leaflet. We operationalise it.

The box on the left is a decision we want to be asked about. ASEPSIS is the better-performing instrument in the literature. It needs antibiotic days, drainage, debridement, inpatient days, culture results — none of which a patient at home can give us. We chose the usable instrument over the statistically better one, and we say so out loud.

And on the right we grade our own evidence rather than citing it. Campwala: twenty-two patients, retrospective, single-centre, breast reconstruction — a population far from ours, with implant failure as the endpoint. Southampton showed only limited predictive value there. So we use it as a triage and communication grid, not as a prognostic instrument.

DO: this is the slide where you sound like a clinician, not a student. Slow down on the last sentence.`,

5: `SLIDE 5 · SOUTHAMPTON MAPPING — FELINE · 0:42  ← THE HINGE OF THE TALK
${L}
SAY:
This is the hinge of the whole project, so I will stay here a moment.

Our core interaction is that the patient picks a PICTURE of their wound. The obvious objection is that we invented those pictures to make a nice interface. We did not. Every image card is a published Southampton grade. Grade zero, normal healing, is "calm and dry". Grade two, erythema plus other signs of inflammation, is "markedly reddened and swollen". Grade four, pus, is "cloudy discharge". Grade five is "open".

That buys us three things: a citable source for our central interaction, a non-trivial derived element — the grade is calculated, not asked — and an honest limitation.

Because the mapping is not clean. Southampton grades redness as "more than two centimetres along the wound". Patients do not measure. So we ask: one small spot, or the whole wound? Closer to usable, further from precise. That trade-off is documented, and it is the single most important thing we would want validated.

NEVER CUT THIS SLIDE.`,

6: `SLIDE 6 · BPMN HIGH-LEVEL — FELINE · 0:30
${L}
SAY:
This is real BPMN two-point-zero, editable in bpmn dot io — not a flowchart with diamonds.

Four lanes, so responsibility is explicit: patient, app, decision logic, practice. The one thing to notice is the business rule task. The app does not decide anything. It executes the L3 decision table. That is why the next two slides are about the table and not about the code.

Two more things. Every completed check is written to the record — INCLUDING the green ones, because without that baseline there is no trajectory. And there are two end events: check completed, or case handed to the practice.

DO: trace the lane boundaries with your hand once, then point at the business rule task and leave your hand there while you say that sentence.`,

7: `SLIDE 7 · DATA DICTIONARY — FELINE · 0:25
${L}
SAY:
Forty-eight data elements. Nine are calculated. Thirty-eight carry a terminology binding — SNOMED, LOINC, ICD-10. Forty-seven have a FHIR mapping.

The column that matters is the last one: every element names the L1 source it comes from. And the element ID is the same string in the data dictionary, the L3, the test protocol and the FHIR export — that is what makes traceability demonstrable instead of claimed.

One design note: the sequence follows the patient, not the guideline. Baseline data once, then how do I feel, then the wound — because looking at the wound means opening the dressing.

CUT IF LATE (first): drop the sample rows, say only the four numbers (saves 12 s).`,

8: `SLIDE 8 · DECISION LOGIC — FELINE · 0:38
${L}
SAY:
Eighteen rules. Thirteen are exclusive and evaluated in this order, worst first. Five are information rules that fire alongside the classification.

Worst-first means a reassuring finding can never overwrite a warning. That is a deliberate asymmetry: a false alarm costs a phone call, false reassurance can delay an infection by days. We accept a higher false-alarm rate on purpose, and we say so in the risk section.

The box on the right is a real finding. One rule needs the classification as its own input — persistence, two yellow days in a row. That is circular. So the rules run twice, and the worse of the two results wins: a second pass can escalate, never de-escalate. We only discovered that when we executed the table, not when we wrote it.

And every threshold on this slide is a named constant in the L3 with its source attached. A guideline change is one line, not a release. You will see that live in a moment.`,

9: `SLIDE 9 · L1 → L2 CHALLENGES — FELINE · 0:38
${L}
SAY:
Nine places where the guideline stopped and left us on our own. Each one is documented with its type, our decision, the rationale, the implication and a risk level. Two of them are marked high, and they sit in the same place.

C-01: Southampton was built for trained staff. We turned it into an image selection for laypeople. That is our core idea — and it is unvalidated.

C-03: no source we found defines the day on which redness stops being physiological. We set day three. Too early means false alarms. Too late means delayed detection. It is a defensible number, but it is our number, not the guideline's.

All nine would need clinical sign-off before this touched a patient. We do not have it, and we list that as a limitation rather than hiding it.

NEVER CUT THIS SLIDE.

>>> HANDOVER — Feline hands to Sivanajani. Sivanajani opens slide 10.`,

10: `SLIDE 10 · L3 ARCHITECTURE — SIVANAJANI · 0:30
${L}
OPENING LINE (this sentence belongs to Sivanajani, not Feline):
"Which brings us to where all of that knowledge actually lives — because it is deliberately not in the app."

SAY:
We compared four ways to make the L2 machine-readable. XLSForm is executable by existing engines, but its standard widgets cannot carry our image cards — the tooling would have dictated our UX, and the images are the whole idea. FHIR Questionnaire plus CQL is the full standard, but the point from the lecture stands: FHIR resources are not human-readable, and Feline had to be able to review this in six days. Hardcoding is fastest and needs a developer for every rule change.

So: we author in a custom JSON that reads like the L2, and we speak standards at the interface. We do not achieve full software neutrality. That is a stated trade-off, not an oversight.

And the claim at the bottom is not a promise, it is a check that FAILS THE BUILD. It scans the app source for every element ID, every rule ID, every threshold, every code system and the endpoint. It found two real leaks the first time we ran it.`,

11: `SLIDE 11 · LIVE DEMO — SIVANAJANI · 1:50
${L}
SET UP BEFORE THE TALK: app open in a second window, baseline section already
completed, day-6 answers already entered except the three you click on stage,
zoom 125-150 %, language English, L3 inspector located once. Full checklist in
docs/14 §14.5.

FRAMING (10 s, still on this slide):
This is the running application — one HTML file, no server, no installation, it works offline. One patient, two days, and then one change that is the actual point.

>>> SWITCH TO THE BROWSER

STEP 1 — DAY 6, GREEN (~30 s)
CLICK: wound picture "Calm & dry" · fluid "None" · scab "Yes" · Evaluate check
SAY:
Day six after a knee replacement. Temperature thirty-six point nine, pain two out of ten and improving. The patient picks the picture — not a clinical term, a picture. No discharge. But a scab has formed, and that is exactly the thing laypeople read as a problem.
(after Evaluate) Green — and it says why. "A scab is a normal sign of healing, do not pick it off." The reason is always shown next to the colour; that is our answer to automation bias. No call to the clinic — and the entry still goes into the record.

STEP 2 — DAY 7, ORANGE + FHIR (~35 s)
CLICK: New day · wound picture "Markedly reddened" · fluid "Cloudy" · Evaluate check · Send to patient record
SAY:
Next day. Thirty-eight point three degrees, pain up to six and worsening, the wound markedly reddened — and now cloudy discharge.
(after Evaluate) Orange, suspected infection, contact your practice today. That is rule R4: purulent discharge is a primary CDC criterion for a superficial incisional infection, and it fires regardless of anything else.
(clicking Send to patient record) And this goes straight into the record — a FHIR R4 transaction bundle: the QuestionnaireResponse, an Observation carrying the classification, and — because this case is orange — a Communication alert to the practice. The endpoint is configuration in the L3, not a line of code.

STEP 3 — THE THRESHOLD CHANGE (~35 s) — THIS IS THE POINT
CLICK: New day, day-8 borderline case 37.6 °C · Evaluate check → GREEN
THEN: open the L3 inspector · fever_orange 38.0 → 37.5 · apply · Evaluate check again
SAY:
One more day. Thirty-seven point six degrees, nothing else remarkable. Green — because thirty-seven point six is below our thirty-eight degree threshold. The rule is right. But is the threshold?
Every threshold lives in the L3, and each one names its source. Suppose a guideline update lowers it. (changing the value) Thirty-eight point zero becomes thirty-seven point five. Re-evaluate.
Same patient. Same answers. Different result. No rebuild, no deployment, no developer — not one line of code was touched. That is what the layer model is actually for: the app renders and executes, and every piece of clinical knowledge sits in a file a clinician can read.

>>> SWITCH BACK TO THE SLIDES

IF ANYTHING HANGS: stop clicking. Walk the three numbered steps from the two
screenshots on this slide (25 s) and add: "the recorded walkthrough is in the
submission package, and the app is a single HTML file you can open yourselves."
CUT IF LATE: skip the FHIR send in step 2, go straight to the threshold change.
NEVER CUT: step 3.`,

12: `SLIDE 12 · QUALITY ASSURANCE — SIVANAJANI · 0:45
${L}
SAY:
We used the risk-based approach from the testing lecture: identify hazards, rank them by risk, test the critical paths first, then document what is left over.

Six hazards ranked, nineteen decision-logic test cases, twenty FHIR conformance checks. All passing — but that is not the interesting part. Eight defects. And three of them could not have been found by reading our own documents.

B-zero-seven: the trend rule referenced its own result, so it could never fire. B-zero-eight: after we fixed that, the rule turned out to be unreachable behind the worst-first cascade anyway. Both only surfaced when the rules were actually executed — that is exactly the L2-to-L4 translation problem. B-zero-six was a contradiction between two of our own documents: Southampton four was red in one and orange in the other.

And the box on the right is the honest one. We never tested the one thing our whole approach rests on — whether laypeople pick the right picture. We cannot test that without patients. So it becomes a monitoring indicator: green cases who still present to a physician within seventy-two hours.

NEVER CUT the residual risk.`,

13: `SLIDE 13 · IMPLEMENTATION, MONITORING & EVALUATION — SIVANAJANI · 0:35
${L}
SAY:
Delivery is a QR code on the discharge sheet — no app store, no account, no installation. Five minutes of training at discharge, with the first check done together.

The content is owned by the clinical department, not by us. Four-eyes sign-off, and a target of a guideline update being live in under four weeks.

Monitoring is the four ISO categories — functionality, stability, fidelity, data quality — each with a number against it. Evaluation scales with the phase: usability and patient-versus-clinician agreement in the pilot; time to medical contact as the primary outcome in a chart review; a stepped-wedge design and SSI rate only at scale-up.

The stakeholder who decides whether this survives is the practice. If the alerts feel like a burden, the implementation fails no matter how good the classification is.

CUT IF LATE: the phase strip — say only "pilot, evaluate, expand" (saves 12 s).`,

14: `SLIDE 14 · IMPACT & REGULATION — SIVANAJANI · 0:28
${L}
SAY:
Benefits: earlier treatment, fewer contacts without consequence, a complete trajectory, structured follow-up data. Risks, and we take them seriously: automation bias, alert fatigue, scaling our own errors consistently and at volume, and a digital divide that this may widen rather than close.

Is it a medical device? Yes. Software as a medical device, IMDRF Category two. The condition is serious — an untreated infection is not self-limiting. The information drives clinical management: we neither diagnose nor treat, but we determine whether and when someone seeks care.

You could argue for Category three via sepsis risk. We chose two because the category describes the typical condition, not the rare extreme — and we would rather defend the reasoning than the label.

CUT IF LATE: the standards list (saves 10 s).`,

15: `SLIDE 15 · INDIVIDUAL CONTRIBUTIONS — SIVANAJANI · 0:15
${L}
SAY:
Feline owned the clinical layers: the sources, the evidence appraisal, the personas, and the whole L2 — BPMN, data dictionary, decision table. I owned the L3, the application, the FHIR interface and the quality assurance, plus implementation and regulation.

We cross-assigned the testing on purpose: neither of us signed off our own layer. And both of us can answer questions on the whole project.

DO: stay standing as a pair. Do not sit down.`,

16: `SLIDE 16 · REPOSITORY & QR CODE — SIVANAJANI · 0:12
${L}
SAY:
Everything is in the repository — the documents, the BPMN sources, the L3, the running app and the test scripts. Scan the code and you can re-run every check we just claimed.

Thank you. We are happy to take questions.

DO: leave this slide up for the ENTIRE question round. The QR code stays on
screen and the repository answers half the possible questions by itself.

BACKUP SLIDES FOLLOW (17-26). In presenter mode, type the number and press Enter.
 17 decision table  ·  18 test protocol  ·  19 hazard matrix  ·  20 BPMN detail
 21 FHIR interface  ·  22 traceability   ·  23 the L3 in one screen
 24 data dictionary ·  25 what did not fit ·  26 sources`,

17: `BACKUP 17 · DECISION TABLE — ALL 18 RULES
${L}
JUMP HERE WHEN ASKED: "show me the full rule set" / "what happens with a case that matches no rule?"

SAY:
Here is the complete table. Thirteen exclusive rules in priority order, five information rules that fire alongside. Each row carries the condition AND the source it came from — CDC for the discharge and dehiscence rules, NICE one-point-four-point-nine for the red streak, Southampton for the grading rules. R8 at the bottom is the catch-all: it always matches, so no input can ever fall through without an answer — and even R8 never says "everything is fine" without a hint about when to make contact.`,

18: `BACKUP 18 · TEST PROTOCOL — 19 CASES
${L}
JUMP HERE WHEN ASKED: "what exactly did you test?"

SAY:
Nineteen cases, and they are not arbitrary — they are chosen against the hazard ranking. T1 to T3 are the red paths. T5 and T14 are the counter-checks: cases that MUST NOT escalate, because over-triage is a real failure mode too. T13, T11, T12 and T16 are the retests for the defects we fixed. T15, T17 and T19 are the three that failed on first run and produced defects B-06, B-07 and B-08. T19 is the threshold change you saw in the demo, as an automated test.`,

19: `BACKUP 19 · HAZARD ANALYSIS AND RISK MATRIX
${L}
JUMP HERE WHEN ASKED: "how did you rank the risks?" / "where is your logic most fragile?"

SAY:
Six hazards, scored severity times likelihood. The two in the red zone are H-01, a missed infection classified green, and H-03, an emergency rule that is unreachable. Both drove the test order — we tested the red paths before we tested anything cosmetic. The matrix is also our argument for worst-first: it moves risk from the severe corner into the tolerable one, at the cost of more false alarms.`,

20: `BACKUP 20 · BPMN — DETAIL PROCESS INSIDE THE APP
${L}
JUMP HERE WHEN ASKED: "what actually happens inside the app?"

SAY:
This is the process one level down: input validation, the two-pass evaluation, the worst-first cascade as explicit gateways, and the write-back. The gateway chain is the decision table one to one — the same rule IDs. That is deliberate: the diagram and the executable file cannot drift apart, because they are generated from the same rule set.`,

21: `BACKUP 21 · THE FHIR INTERFACE
${L}
JUMP HERE WHEN ASKED: "how do you connect to a hospital system / an EHR?"

SAY:
One check produces three resources in a single transaction bundle. The QuestionnaireResponse holds the raw answers against a versioned canonical Questionnaire. The Observation carries the classification, coded in SNOMED, with the Southampton grade and the fired rule as components. And the Communication is the alert to the practice, created only from orange upwards — that is Sandra's persona turned into a technical rule. The endpoint, the patient reference and the alert recipient are all L3 configuration.`,

22: `BACKUP 22 · TRACEABILITY — ONE FINDING, ALL THE WAY THROUGH
${L}
JUMP HERE WHEN ASKED: "can you trace one finding end to end?"

SAY:
This is one finding traced end to end: the CDC criterion "purulent drainage" becomes data element DE-035 with a SNOMED code, which is used by rule R4 at orange priority, which produces an Observation component in the FHIR bundle, and which is verified by test case T15. Five artefacts, one identifier. If you change the element, everything downstream of it is findable in seconds.`,

23: `BACKUP 23 · THE L3 IN ONE SCREEN
${L}
JUMP HERE WHEN ASKED: "what does your L3 actually look like?" / "how do you roll out a guideline update?"

SAY:
This file IS the CDSS. Metadata with the thresholds and their sources, the elements with their labels in two languages and their terminology bindings, and the decision rules with their conditions and outputs. The app that renders it contains none of this. Hand this file to a different renderer and you have the same clinical system — that is the property we were actually trying to buy.`,

24: `BACKUP 24 · DATA DICTIONARY — THE FOUR REQUIRED COLUMNS
${L}
JUMP HERE WHEN ASKED: "did you produce a proper data dictionary?"

SAY:
The full dictionary has forty-eight rows; this is an excerpt showing the four columns the assignment asks for — the element, its type and permitted values, its terminology binding, and its FHIR mapping — plus a fifth we added, the L1 source. Nine elements are calculated rather than asked, eight carry plausibility constraints, and four are conditional on an earlier answer.`,

25: `BACKUP 25 · DEPTH THAT DID NOT FIT INTO TEN MINUTES
${L}
JUMP HERE WHEN ASKED: "what would you do differently with more time?" / "which interoperability level?"

SAY:
A pointer slide. It lists the testing types we applied, the versioning and update path for the L3, the multilingualism approach, the interoperability level we reach — structural yes, semantic partly, organisational no — and what we would do differently with more time. The honest answer to that last one is: validate the image assignment. Everything else is second.`,

26: `BACKUP 26 · SOURCES
${L}
JUMP HERE WHEN ASKED: "where are your sources?"

SAY:
Ten sources. Woelber for the sixty per cent, ECDC and WHO for incidence, CDC for the definition, NICE for the management recommendations, Bailey for the Southampton system, Campwala for the comparison, WHO for the M&E framework and the SMART layer model, IMDRF for the risk categorisation, and HL7 for the FHIR resources.

TWO ANSWERS THAT ARE ON NO SLIDE:
· "Did you use AI to build this?" — Yes, for drafting and for the tooling. The
  clinical decisions, the source appraisal and the nine translation calls are
  ours, and every threshold names the source it came from.
· "Would you deploy this?" — No. Not without clinical sign-off on all nine
  translation decisions and a validation study on the image assignment. It is a
  study prototype.`

};

module.exports = SCRIPT;
