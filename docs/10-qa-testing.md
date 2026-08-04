# 10 · Quality Assurance — Risk-Based Testing

> **Assignment:** *“Quality Assurance Testing: Design an approach to risk-based testing. Conduct tests to identify L2 – L4 translation issues. Address any bugs or issues identified during testing."*

> **Lecture Day 5:** *“We cannot test everything, so we test what matters most."*
> 1. Identify Hazards → 2. Rank by Risk → 3. Test Critical Paths First → 4. **Document Residual Risk**

---

## 10.1 Testing Approach

We follow the four-step risk-based procedure from Day 5. The depth of testing is determined by the **potential for clinical harm**, not by the number of rules.

### Types of Testing Used

| Type (Day 5) | In our project |
|---|---|
| **L2 Verification** | Reconciliation of decision table ↔ BPMN gateway cascade ↔ L3 rules: do the conditions, the ordering and the outputs match? |
| **Functional Testing** | Individual rules, exclusions, severity ordering, boundary values |
| **Integration Testing** | Interplay: derived elements → rules → output; conditional logic → rule reachability; trend rules across several days |
| **Usability Testing** | Image assignment by non-clinical persons — **not yet carried out** (see residual risk) |

---

## 10.2 Steps 1 & 2 — Hazard Analysis and Prioritisation

| ID | Hazard | Origin | Severity<br>(1–5) | Likelih.<br>(1–5) | Score | Mitigation | Covered by |
|---|---|---|---|---|---|---|---|
| **H-01** | An infection is classified as GREEN | The rule does not fire; the question is not asked because of conditional logic | 5 | 3 | **15** | Worst-first cascade; safety-critical questions ungated; catch-all only as the final rule | T1–T5, T11–T13 |
| **H-02** | An emergency is classified as ORANGE instead of RED | Prioritisation incorrect; rule order transposed | 5 | 2 | **10** | Fixed worst-first ordering, documented and tested | T4, T15 |
| **H-03** | The patient abandons the check, leaving a gap in the trend | Too many questions; excessive duration | 3 | 3 | **9** | Baseline data collected only once; conditional logic reduces the number of questions; ≤ 3 min | T6 |
| **H-04** | False alarm during normal healing | Threshold set too low; time window not taken into account | 2 | 4 | **8** | Time-dependent rule R6a; information rules actively reassure | T5, T9, T14 |
| **H-05** | An implausible input is processed | Constraint missing or applied too late | 3 | 2 | **6** | Constraints run before rule evaluation (validation loop in the BPMN) | T7 |
| **H-06** | The practice overlooks an alert | Alert fatigue caused by too many notifications | 4 | 2 | **8** | Alerts only for ORANGE/RED; structured content instead of free text; no repeat escalation for an unchanged finding | T20, T21 |

### Risk Matrix

```
Severity
  5 │                    H-02(10)   H-01(15)
  4 │           H-06(8)
  3 │                    H-05(6)    H-03(9)
  2 │                               H-04(8)
  1 │
    └───────────────────────────────────────
      1        2         3          4      5   Likelihood
```

### Step 3 — Prioritisation

- **H-01 and H-02** (score ≥ 10): **full coverage**. Every rule at the red and orange level has at least one test case, and all boundary values are checked from both sides.
- **H-03 to H-06** (score 6–9): **sample-based coverage** with 1–2 representative test cases each.
- The green catch-all rule is only tested indirectly — through cases that are *not* supposed to escalate.

---

## 10.3 Defects Found

> All findings originate from **desk-based testing**, a systematic review of the decision table against the L3, and a multi-day simulation of the rules.
> **Seven of the twelve defects arose in the L2 and only became apparent once the rules were executed — exactly the “L2–L4 translation issues" that the assignment asks about.** The last two, [B-09](#b-09--r12-escalated-two-unrelated-minor-findings) and [B-10](#b-10--r12-re-fired-every-second-day-indefinitely), needed more than execution: they only appear when several days are evaluated **in sequence**.

### B-01 · Marked signs of inflammation on days 1–2 are classified as GREEN

| | |
|---|---|
| **Severity** | 🔴 high |
| **Originating layer** | **L2** — decision table |
| **Description** | R6 was gated with `days_post_op >= 3`. A patient on day 2 with a markedly reddened, swollen, overheated wound received **GREEN** via the catch-all rule R8 — provided there was neither fever nor pus |
| **Root Cause** | The time-based exception for *mild* post-operative erythema was inadvertently applied to **all** signs of inflammation. Related to challenge [C-03](07-l2-l1-to-l2-challenges.md) |
| **Aggravating factor** | Test case T5 originally recorded this behaviour as *expected* — the test would never have found the defect |
| **Fix** | R6 split: **R6a** (mild signs, Southampton I) remains time-dependent · **R6b** (marked signs, Southampton II or `swelling = 3`) fires **from day 1**. T5 corrected |
| **Retest** | T13, T14 |

### B-02 · “I feel really unwell" triggers nothing

| | |
|---|---|
| **Severity** | 🔴 high |
| **Originating layer** | **L2** — decision table |
| **Description** | `wellbeing` was collected (`0=Gut · 1=Müde · 2=Richtig krank` — 0=well · 1=tired · 2=really unwell) but appeared in **not a single rule**. A patient with `wellbeing = 2`, 37.6 °C and an unremarkable wound received **GREEN** |
| **Root Cause** | The data element was defined but never carried over into the logic. Clinically relevant: a severe subjective sense of illness can **precede** measurable fever — in early sepsis this is precisely the dangerous pattern |
| **Fix** | New rule **R9**: `wellbeing = 2 OR nausea_vomiting = 2` → ORANGE |
| **Retest** | T11 |

### B-03 · Emergency rule R2 was unreachable because of conditional logic

| | |
|---|---|
| **Severity** | 🔴 high |
| **Originating layer** | **L2/L3** — conditional logic |
| **Description** | The question about the extent of erythema was gated with `relevant: wound_state >= 2`. R2 (spreading erythema / red streak → RED, suspected lymphangitis) could only fire if the patient rated the wound appearance as at least “slightly reddened" (“leicht gerötet"). If they selected “Calm & dry" (“Ruhig & trocken") — plausible when the wound itself is unremarkable but a red streak runs towards the trunk — **the question was never asked and the emergency rule was never reached** |
| **Root Cause** | The conditional logic was set from a UX perspective (fewer questions) without checking the reachability of safety-critical rules. **A textbook case of an L2→L4 translation issue** |
| **Fix** | New, **ungated** data element `red_streak` (DE-032): *“Does a red streak run away from the wound?"* (*“Zieht ein roter Streifen von der Wunde weg?"*). R2 changed to `red_streak = 1 OR redness_extent = 4` |
| **Retest** | T12 |
| **Rule derived from this** | Safety-critical questions must **never** sit behind conditional logic. Adopted as a convention in the L3 |

### B-04 · Duplicated source of truth for the fever threshold

| | |
|---|---|
| **Severity** | 🟡 medium (maintainability) |
| **Originating layer** | **L3** |
| **Description** | The derived element `fever = temp >= 38` existed but was used nowhere; R5 checked `temp >= 38` again directly. If a guideline change moved the value to 37.8, two places would have had to be changed — with a high probability of overlooking one of them |
| **Root Cause** | A contradiction of our own maintainability claim from [08](08-l3-architecture.md) |
| **Fix** | All thresholds as named constants in `meta.thresholds`; rules reference `fever` instead of `temp` |
| **Retest** | T2, T19 |

### B-05 · `anticoag` was collected but never used

| | |
|---|---|
| **Severity** | 🟢 low (design/data protection) |
| **Originating layer** | **L2** |
| **Description** | The anticoagulant status fed into no rule at all — even though it is clinically relevant for assessing bleeding |
| **Root Cause** | Collection without a purpose of use. In addition a data protection problem: personal health data collected without a purpose contradict data minimisation |
| **Decision** | Build it in rather than remove it — the clinical value justifies collecting it |
| **Fix** | New rule **R10**: `bleeding >= 1 AND anticoag = 1` → YELLOW |
| **Retest** | T16 |

---

### B-06 · Southampton grade IV mapped to RED in the L1 table but to ORANGE in the rules

| | |
|---|---|
| **Severity** | 🟡 medium (inconsistency) |
| **Originating layer** | **L2** — inconsistency between the L1 mapping table and the decision table |
| **Found by** | Test run T15 |
| **Description** | The Southampton mapping in [03](03-l1-guidelines-and-evidence.md) assigned grade **IV (pus)** to RED. The implemented rules, however, escalate to RED only for `wound_state = 4` (the "open / pus" image) or dehiscence (R3); isolated purulent discharge (`secretion = 3`) triggers R4 → ORANGE. Two documents made different statements about the same finding |
| **Root Cause** | The mapping table was derived from the Southampton severity scale ("grades IV and V are major complications"), the rules from the clinical urgency of the action required. Both are defensible — but they were never reconciled |
| **Decision** | The **rules** are authoritative; the mapping table has been corrected. Purulent discharge is the primary criterion of a superficial incisional SSI and requires contact **today** (ORANGE) — not the emergency service tonight. RED remains reserved for systemic signs (R1), lymphangitis (R2) and dehiscence or the "open / pus" wound image (R3) |
| **Fix** | Mapping table in [03 §3.4](03-l1-guidelines-and-evidence.md) corrected; rationale documented as challenge [C-09](07-l2-l1-to-l2-challenges.md) |
| **Retest** | T10, T15 |

### B-07 · Trend rule R12 could never fire — circular dependency

| | |
|---|---|
| **Severity** | 🔴 high (rule without effect) |
| **Originating layer** | **L3/L4** — evaluation order |
| **Found by** | Test run T17 |
| **Description** | The derived element `trend_worsening` compares today's classification with yesterday's. But today's classification is only known **after** the rules have been evaluated — while the derived elements are computed **before**. `classification` was therefore always `null`, `trend_worsening` always `0`, and rule R12 could never fire |
| **Root Cause** | A classic circular dependency: a rule needs its own result as an input. Only visible once the tests were actually executed — a review of the decision table alone would never have found it |
| **Fix** | **Two-pass evaluation** in the L4: the rules run once, the provisional classification is fed back into the scope, the rules run a second time. The worse of the two results wins, so a second pass can escalate but never de-escalate — worst-first also applies across passes |
| **Retest** | T17 |

### B-08 · R12 was unreachable as originally specified

| | |
|---|---|
| **Severity** | 🟡 medium (dead rule) |
| **Originating layer** | **L2** — decision table |
| **Found by** | Test run T17, after B-07 had been fixed |
| **Description** | Even with a working two-pass evaluation, R12 ("deterioration compared with yesterday, yesterday YELLOW") remained unreachable: any deterioration beyond YELLOW already triggers a higher-priority orange or red rule. The condition could only be satisfied in a state that never occurs |
| **Root Cause** | The rule was formulated from the clinical intent ("things are getting worse") without checking against the worst-first cascade whether that state is reachable at all |
| **Fix** | R12 rewritten as a **persistence rule**: `classification = 'yellow' AND last_classification = 'yellow'` → ORANGE. A single abnormal day is tolerable, a persisting abnormal finding is not |
| **Retest** | T17 |
| **Lesson learned** | Every new rule must be checked for reachability against the cascade — added to the L3 review checklist |

### B-09 · R12 escalated two unrelated minor findings

| | |
|---|---|
| **Severity** | 🟠 high (false alarm to the practice) |
| **Originating layer** | **L2** — decision table |
| **Found by** | Multi-day simulation of the rules, after B-08 had been fixed |
| **Description** | R12 compared only the **traffic-light colour** of the two days. A patient reporting numbness on day 1 (R7) and slight bleeding under anticoagulation on day 2 (R10) was told to contact the practice for a suspected infection — two unrelated, individually harmless findings, neither of which had persisted or worsened |
| **Root Cause** | "Second abnormal day in a row" was translated literally as "yellow twice". The colour is an aggregate over eleven different findings; equality of the aggregate says nothing about equality of the cause |
| **Fix** | R12 additionally requires `current_rule = last_rule` — the same triggering rule as yesterday. New derived element `last_rule` (DE-050) with the helper `previousRule()`; the check history now also records the **first-pass** rule of each day |
| **Retest** | T20 |
| **Lesson learned** | A rule about *persistence* must compare the finding, not the classification. Aggregated outputs are lossy inputs |

### B-10 · R12 re-fired every second day, indefinitely

| | |
|---|---|
| **Severity** | 🔴 high (alert fatigue — attacks hazard **H-06** directly) |
| **Originating layer** | **L2** — decision table |
| **Found by** | Multi-day simulation of the rules |
| **Description** | R12 required yesterday to be **exactly** YELLOW. Once it had fired, the day was ORANGE, so the next day fell back to YELLOW, and the day after that R12 fired again. A patient with stable post-operative numbness produced the course `YELLOW · ORANGE · YELLOW · ORANGE …` and **four alerts to the practice in eight days**, for a finding that never changed |
| **Root Cause** | The rule read its own output as its input for the following day. Neither the single-day test T17 nor a document review can expose this — only running a course of several days does |
| **Fix** | `severityRank(last_classification) >= 1` ("yellow **or worse** yesterday") instead of `= 'yellow'`, and `last_rule` stores the **first-pass** rule rather than the winning one, so R12 still sees the finding underneath its own escalation. The course now escalates once and stays escalated |
| **Retest** | T21 |
| **Lesson learned** | Any rule that reads the previous day's result must be tested over a **course**, not a single day. Added to the L3 review checklist |
| **Follow-up** | The classification is now correct, but the alert layer notifies on every ORANGE day, so a persistent finding produces a daily notification. Notifying on *escalation* instead of on *state* is an open point — see [11 Implementation](11-implementation-monitoring-evaluation.md) |

### B-11 · The FHIR transaction was rejected — but only for ORANGE and RED

| | |
|---|---|
| **Severity** | 🟠 high (the alert never arrives — and only in the cases where it matters) |
| **Originating layer** | **L3** — interface configuration |
| **Found by** | Posting the generated bundle to the live HAPI test server, rather than only checking its shape |
| **Description** | `Communication.recipient` was the literal reference `Organization/practice`. That resource does not exist on the target server, so the server refused the **entire transaction** with `HTTP 400 · HAPI-1094: Resource Organization/practice not found`. Since a `Communication` is only generated for ORANGE and RED, GREEN and YELLOW submissions went through normally — the interface looked healthy and failed silently in exactly the two cases that require an alert |
| **Root Cause** | A literal reference is a promise that the target resource exists on the receiving server. We wrote one for a resource we never created. `tools/check-fhir.mjs` validated the **shape** of the bundle, which was correct throughout — no shape check can catch a broken promise about someone else's database |
| **Fix** | `meta.fhir.alert_recipient` is now a `Reference` **object** used verbatim, rather than a string that the app wrapped in `reference`. For the prototype it carries only a `display`, which is valid R4 and asserts nothing about the receiving server. A hospital deployment replaces it with `{"reference": "Organization/<id>", "display": "…"}` pointing at the practice record that exists there — a configuration change, not a code change |
| **Retest** | F18, F21 · verified against the live endpoint: `HTTP 200`, all three resources created including the `Communication` |
| **Lesson learned** | Conformance checking is not the same as interoperability. A bundle can satisfy every structural rule and still be rejected by the server it is addressed to — the only test that proves an interface works is sending it somewhere real |

### B-12 · Hiding an element had no effect where the app styled it

| | |
|---|---|
| **Severity** | 🟡 medium (usability — the interface contradicted its own flow) |
| **Originating layer** | **L4** — presentation |
| **Found by** | First hands-on use of the step flow, by a team member rather than by any automated check |
| **Description** | The step navigation and the action bar (*evaluate · send to record · download bundle · new day*) were shown at all times. During the step flow the patient saw a blank blue button — *Next*, which is only given its label inside the step branch — and was offered *Send to patient record* on question 1, before anything had been evaluated |
| **Root Cause** | Both elements are shown and hidden through the `hidden` attribute, but `[hidden] { display: none }` comes from the **browser** stylesheet, and both carried an author rule setting `display: flex`. Author rules win, so the attribute did nothing. The JavaScript was correct throughout — it set `hidden` exactly when it should |
| **Fix** | One global rule, `[hidden] { display: none !important }`, which settles the whole class of bug rather than the two instances of it. Additionally the *Evaluate* button is hidden on the result screen, where the form it would re-read is no longer displayed |
| **Retest** | Cross-check of every element toggled via `hidden` against the stylesheet: exactly two carried a competing `display` rule, both now neutralised |
| **Lesson learned** | Our checks read the L3, the rules and the bundle — nothing looked at the rendered interface. A logic test suite cannot see a button that is on screen when it should not be. Usability testing was already listed as *not yet carried out*; this is the first defect to come out of that gap, and it took thirty seconds of real use to find |

## 10.4 Test Protocol

> **Last executed on 4 August 2026** against `l3/wundcheck-l3.json` v0.3.6 using the harness [`tools/run-tests.mjs`](../tools/run-tests.mjs), which uses the same expression engine as the L4 app.
> Reproduce with `node tools/run-tests.mjs`.

| ID | Checks | Hazard | Expected | Observed | Status |
|---|---|---|---|---|---|
| T1 | R1 fever | H-01 | RED (R1) | `RED (R1) · SG 0` | ✅ passed |
| T2 | R1 boundary | H-01 | RED (>= inclusive) | `RED (R1) · SG 0` | ✅ passed |
| T3 | R3 safety rule | H-01 | RED (image alone escalates) | `RED (R3) · SG V` | ✅ passed |
| T4 | R5 before R6 | H-02 | ORANGE (R5 wins) | `ORANGE (R5) · SG II` | ✅ passed |
| T5 | mild signs, day 2 | H-04 | GREEN | `GREEN (R8) · SG I` | ✅ passed |
| T6 | conditional logic | H-03 | 3 follow-ups hidden | `hidden: true` | ✅ passed |
| T7 | constraint temp | H-05 | input rejected | `rejected: true` | ✅ passed |
| T8 | info rules non-exclusive | — | GREEN + I1 + I2 + I3 | `GREEN (R8) + I1, I2, I3 · SG 0` | ✅ passed |
| T9 | scab reassures | H-04 | GREEN + I4 | `GREEN (R8) + I4 · SG 0` | ✅ passed |
| T10 | worst-first vs reassurance | H-02 | ORANGE (R4) + I4 — warning beats reassurance | `ORANGE (R4) + I4 · SG IV` | ✅ passed |
| T11 | B-02 fixed | H-01 | ORANGE (R9) | `ORANGE (R9) · SG 0` | ✅ passed |
| T12 | B-03 fixed | H-01 | RED (R2) | `RED (R2) · SG 0` | ✅ passed |
| T13 | B-01 fixed | H-01 | YELLOW (R6b), not green | `YELLOW (R6b) · SG II` | ✅ passed |
| T14 | B-01 counter-check | H-04 | GREEN (R6a does not fire) | `GREEN (R8) · SG I` | ✅ passed |
| T15 | Southampton derivation | H-02 | grade IV -> ORANGE (R4) — see B-06 | `ORANGE (R4) · SG IV` | ✅ passed |
| T16 | B-05 fixed | — | YELLOW (R10) | `YELLOW (R10) · SG 0` | ✅ passed |
| T17 | persistence rule R12 | H-01 | ORANGE (R12) after the same finding yesterday | `ORANGE (R12)` | ✅ passed |
| T18 | discharge duration R11 | H-01 | ORANGE (R11) | `ORANGE (R11) · SG III` | ✅ passed |
| T19 | threshold maintainability | — | ORANGE after threshold change | `GREEN -> ORANGE (R5)` | ✅ passed |
| T20 | B-09 fixed — R12 needs the same finding | H-06 | day 2 stays YELLOW, no escalation | `YELLOW(R7) YELLOW(R10) GREEN(R8) · 0 alerts` | ✅ passed |
| T21 | B-10 fixed — R12 escalates once, then holds | H-06 | one escalation, no yellow/orange ping-pong | `YELLOW(R7) ORANGE(R12) ORANGE(R12) ORANGE(R12) ORANGE(R12) ORANGE(R12) · 5 alerts` | ✅ passed |

**21 passed, 0 failed, 21 total**

Boundary values are covered from both sides: `temp` 38.9/39.0/39.1 · `days_post_op` 2/3/4 · `pain` 6/7 · `discharge_duration_days` 2/3.

**The first run failed 3 of 19 test cases.** All three were genuine defects, not harness errors — they became bugs [B-06](#b-06--southampton-grade-iv-mapped-to-red-in-the-l1-table-but-to-orange-in-the-rules), [B-07](#b-07--trend-rule-r12-could-never-fire--circular-dependency) and [B-08](#b-08--r12-was-unreachable-as-originally-specified). Two of them (B-07, B-08) were invisible to a pure document review and only surfaced once the rules were actually executed — which is precisely the point of the exercise.

### Course-based tests (T20, T21)

T1–T19 each evaluate a **single** day. That is sufficient for every rule that reads only the current answers — and structurally blind to a rule that reads yesterday's result. R12 is the only such rule, and both defects hiding in it ([B-09](#b-09--r12-escalated-two-unrelated-minor-findings), [B-10](#b-10--r12-re-fired-every-second-day-indefinitely)) were invisible to T17, which supplies a hand-written history and then checks one day.

T20 and T21 therefore run a **course**: several consecutive checks, each one feeding its result into the history exactly as the app's *New day* button does. T21 is the regression guard for the ping-pong — it fails if any day after the first escalation drops back to YELLOW.

> **Lesson for the test strategy:** a test case must span at least as much time as the rule it tests. Stateful rules need course-based tests, and the test protocol now says so.

**Boundary value tests** cover both sides: `temp` 38.9/39.0/39.1 · `days_post_op` 2/3/4 · `pain` 6/7 · `discharge_duration_days` 2/3.

---

## 10.5 FHIR Conformance Checks

The decision logic is not the only thing that has to be correct — so does the interface. [`tools/check-fhir.mjs`](../tools/check-fhir.mjs) extracts the bundle builder straight out of the L4 and checks the generated transaction bundle against the R4 shape rules we depend on. Reproduce with `node tools/check-fhir.mjs`.

| # | Check | Result |
|---|---|---|
| F01 | Bundle.resourceType = Bundle | ✅ |
| F02 | Bundle.type = transaction — `transaction` | ✅ |
| F03 | every entry has request.method + url | ✅ |
| F04 | QuestionnaireResponse present | ✅ |
| F05 | QR.status = completed | ✅ |
| F06 | QR.questionnaire is versioned canonical — `http://wundcheck.example/Questionnaire/wundcheck|0.3.2` | ✅ |
| F07 | QR.subject set — `Patient/example` | ✅ |
| F08 | QR items all have exactly one answer | ✅ |
| F09 | QR answers are typed (not all valueString) — `valueString, valueDate, valueCoding, valueInteger, valueDecimal` | ✅ |
| F10 | QR item count matches answered elements — `33 / 33` | ✅ |
| F11 | Observation present | ✅ |
| F12 | Observation.status = final | ✅ |
| F13 | Observation.code has a SNOMED coding | ✅ |
| F14 | Observation carries the L3 version — `0.3.2` | ✅ |
| F15 | Observation carries the triggering rule | ✅ |
| F16 | Communication generated for ORANGE | ✅ |
| F17 | Communication.priority = urgent for ORANGE — `urgent` | ✅ |
| F18 | Communication has a recipient — `Organization/practice` | ✅ |
| F19 | endpoint comes from the L3, not the code | ✅ |
| F20 | no Communication when GREEN | ✅ |

**20 passed, 0 failed, 20 total**

Check F19 is the interesting one: it asserts that the endpoint URL appears **only** in the L3, not in the app source. Should anyone ever hardcode an endpoint into the L4, this test fails — the maintainability claim is thereby machine-enforced rather than merely asserted in prose.

---

## 10.6 No-Hardcoding Check

The central claim of this project — *the L4 contains no clinical content* — is easy to assert and easy to break. We therefore made it a test. [`tools/check-hardcoding.mjs`](../tools/check-hardcoding.mjs) scans the application source (with the embedded L3 payload stripped out) for every element id, section id, rule id, threshold name and value, code system URI, the FHIR endpoint, and a list of clinical vocabulary. Any hit fails the check.

| Check | Result |
|---|---|
| Application source scanned | `479` lines |
| Terms tested (element ids, section ids, rule ids, thresholds, code systems, endpoint, clinical vocabulary) | 72 |
| Clinical content found in the L4 | ✅ none |

**The check found two real leaks when first run**, both of which have been fixed:

| Leak | Fix |
|---|---|
| `Observation.code` carried SNOMED 225552003 “Assessment of wound” directly in the app, and the result badge read `derived.southampton_grade` by name | Both declared in the L3 (`meta.fhir.observation_code`, `meta.display.result_badge`); the app now iterates over the declaration |
| The “New day” function reset the sections `general` and `wound` by their ids — the app knew which sections were clinical | Reset now derives from the sections' `once` flag; the app no longer knows any section by name |
| Terminology system URIs (`http://snomed.info/sct` …) were a lookup table in the app | Moved to `meta.terminology_systems` |

This is the same pattern as [B-06](#b-06--southampton-grade-iv-mapped-to-red-in-the-l1-table-but-to-orange-in-the-rules): a claim made in prose that the implementation did not actually keep. The difference is that this one can no longer drift silently — the check runs with the test suite.

---

## 10.7 Step 4 — Residual Risk

> Day 5 explicitly names as a characteristic of sufficient validation: *“Explicit acknowledgment of residual risk and monitoring strategy."*

**What we have not tested:**

**(a) Behaviour with real patients.** All tests are desk-based. We have not had a single real wound assessed.

**(b) The reliability of image assignment by medical laypersons.** This is the **greatest untested risk of our entire approach**. The translation of a clinical grading into an image selection ([C-01](07-l2-l1-to-l2-challenges.md)) is the central design idea — and it is unvalidated. In particular: erythema appears visually very different on different skin types; our graphics depict only one skin type.

**(c) Offline and synchronisation behaviour across several days.** The trend rule R12 and the derived elements `last_classification` / `trend_worsening` presuppose an uninterrupted data history. What happens when there are gaps has not been tested.

**(d) Transferability to all body regions.** The scope covers all elective wounds with primary closure — yet our graphics show only one generic wound type. An abdominal wound looks different from a wound on a finger.

**(e) Clinical sign-off.** All eight L1→L2 decisions were taken by a group of students, not by clinical professionals.

### How We Address This

| Residual risk | Measure |
|---|---|
| (a), (b) | Usability study during the pilot phase; parallel assessment by the patient and a healthcare professional to determine agreement |
| (b), (d) | **Most important safety indicator in post-deployment monitoring:** follow-up of all cases that presented to a physician within 72 hours despite a GREEN classification |
| (c) | Explicit tests of the trend logic with data gaps before the pilot |
| (d) | Extension of the graphics with body-region-specific variants; until then a scope notice in the app |
| (e) | Clinical review of all `meta.thresholds` and decision rules as a precondition for the pilot |

Details: [11 Monitoring & Evaluation](11-implementation-monitoring-evaluation.md)

---

## 10.8 “Good enough validation" — Self-Assessment

Day 5 names six characteristics. Where we stand:

| Characteristic | Status |
|---|---|
| Documented risk analysis identifying highest-harm scenarios | ✅ Hazard table H-01…H-06 |
| Evidence of testing on critical clinical paths | ✅ 21 of 21 test cases executed and passed; 12 defects found and fixed |
| Clinical expert sign-off on rule logic and edge cases | ❌ **missing — documented as a limitation** |
| Usability evidence that users can act correctly | ❌ **missing — greatest residual risk** |
| Post-deployment monitoring plan with incident response | ✅ [11 M&E](11-implementation-monitoring-evaluation.md) |
| Explicit acknowledgment of residual risk | ✅ Section 10.7 |

**Four out of six.** The two missing points are exactly those that separate a student prototype from a deployable system — and both require access to clinical staff and to real patients.

---

**Related documents:** [06 Decision Logic](06-l2-decision-logic.md) · [07 Challenges](07-l2-l1-to-l2-challenges.md) · [11 M&E](11-implementation-monitoring-evaluation.md)
