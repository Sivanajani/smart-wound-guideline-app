# 06 · L2 — Decision Logic

> **Assignment:** *“Decision logic: specify decision logic. This can be done diagrammatically (BPMN), or in a decision table (e.g. as per WHO SMART Guideline DAK)."*

We document the decision logic **in both forms**: as a decision table here and diagrammatically in the [detailed app process](04-l2-workflow-bpmn.md#43-app-detail-process). The table states *what* is decided, the diagram shows *in which order*.

---

## 6.1 Object of the Decision

| | |
|---|---|
| **Decision ID** | `DEC-01 Wundstatus` |
| **Trigger** | Completion of a daily wound check |
| **Business Rule** | Classify the current wound findings into one of four urgency levels and provide a concrete recommendation for action |
| **Outputs** | 🔴 RED (emergency) · 🟠 ORANGE (suspected infection) · 🟡 YELLOW (abnormal) · 🟢 GREEN (normal) |
| **Additional output** | `DEC-02 Hinweise` — non-exclusive informational messages that fire in addition to the classification |

---

## 6.2 Evaluation Principle: worst-first

The rules are evaluated **in a fixed order from severe to mild**. The **first matching rule wins**, and the cascade ends. Informational rules (I1–I5) are exempt from this and fire in addition.

```
R1 → R2 → R3          🔴 RED
R9 → R4 → R5 → R11 → R12   🟠 ORANGE
R6b → R6a → R7 → R10       🟡 YELLOW
R8 (Catch-all)             🟢 GREEN
────────────────────────────────
I1 … I5                    ℹ️ additional, non-exclusive
```

**Rationale:** For a triage tool in the hands of patients, false reassurance weighs more heavily than a false alarm. The cascade guarantees that reassuring findings can never override a warning finding. In exchange, we deliberately accept a higher false-alarm rate — see [12 Impact](12-impact-and-regulation.md).

---

## 6.3 Decision Table — Wound Status

*Rules R6a/R6b, R9–R12 and I5 were added in L3 v0.3.x as a result of the defects found during testing — see [10 QA](10-qa-testing.md).*

### 🔴 RED — Emergency

| ID | Condition | Output | Rationale | L1 reference |
|---|---|---|---|---|
| **R1** | `temp >= 39` **OR** `chills = 1` | **EMERGENCY** — High fever or chills: contact your practice or the emergency service **immediately**. | Systemic signs of infection have the highest priority. Chills are a sepsis warning sign and may precede the fever | CDC (fever >38 °C as a criterion) · sepsis red flags |
| **R2** | `red_streak = 1` **OR** `redness_extent = 4` | **EMERGENCY** — Erythema is spreading / red streak: seek medical assessment today (suspected lymphangitis). | A red streak tracking away from the wound is a classic sign of lymphangitis and requires prompt antibiotic therapy | NICE NG125 §1.4.9 (cellulitis) |
| **R3** | `wound_open = 2` **OR** `bleeding = 2` **OR** `wound_state = 4` | **EMERGENCY** — Open wound, pus or heavy bleeding: contact your practice / emergency service immediately. Cover the wound with a clean compress. | Wound dehiscence and purulent discharge are criteria of deep incisional SSI. The wound appearance "open/pus" **always** escalates, even if all other entries are unremarkable | CDC deep incisional SSI · Southampton IV–V |

### 🟠 ORANGE — Suspected Infection

| ID | Condition | Output | Rationale | L1 reference |
|---|---|---|---|---|
| **R9** | `wellbeing = 2` **OR** `nausea_vomiting = 2` | **SUSPECTED INFECTION** — You feel distinctly unwell: contact your practice today, even if the wound looks unremarkable. | A severe subjective feeling of illness may **precede** measurable fever. The element was collected but originally not used in any rule — see [Bug B-02](10-qa-testing.md) | Systemic signs of infection |
| **R4** | `secretion = 3` **OR** `secretion_smell = 1` | **SUSPECTED INFECTION** — Purulent or foul-smelling discharge: contact your practice today for an appointment. | Purulent discharge is a **main criterion** of superficial incisional SSI (“purulent drainage from the superficial incision") | **CDC** superficial incisional SSI · Southampton IV |
| **R5** | `fever = true` **OR** (`pain >= 7` **AND** `pain_trend = 2` **AND** `days_post_op >= 3`) | **SUSPECTED INFECTION** — Fever or increasing severe pain: contact your practice today. | Pain should be decreasing from day 3 onwards. An increase is a warning sign — the CDC explicitly names *“new or worsening localized pain"* | **CDC** · NICE NG125 |
| **R11** | `secretion >= 1` **AND** `discharge_duration_days >= 3` | **SUSPECTED INFECTION** — Persistent wound discharge for several days: contact your practice today. | Southampton lists “prolonged discharge > 3 days" as a separate sub-grade (IIId) — persistent discharge requires treatment even in the absence of pus | **Southampton IIId** |
| **R12** | `classification = 'yellow'` **AND** `severityRank(last_classification) >= 1` **AND** `current_rule = last_rule` | **SUSPECTED INFECTION** — The same abnormal finding as yesterday: contact your practice today. | A single abnormal day is tolerable, **the same finding persisting** is not. Three corrections: unreachable as first specified ([B-08](10-qa-testing.md)), escalating on colour alone ([B-09](10-qa-testing.md)), and re-firing every second day ([B-10](10-qa-testing.md)). Requires two-pass evaluation ([B-07](10-qa-testing.md)) | CDC/NHSN — new or worsening · persistence criterion |

### 🟡 YELLOW — Abnormal

| ID | Condition | Output | Rationale | L1 reference |
|---|---|---|---|---|
| **R6b** | `southampton_grade = II` **OR** `swelling = 3` | **ABNORMAL** — Distinct signs of inflammation: observe the wound closely and contact your practice if it has not improved by tomorrow. | **Applies from day 1.** Pronounced signs of inflammation are not normal even early after surgery — correction of [Bug B-01](10-qa-testing.md) | Southampton II · CDC (erythema, swelling, heat) |
| **R6a** | (`southampton_grade = I`) **AND** `days_post_op >= 3` | **ABNORMAL** — Increasing signs of inflammation: observe and check again tomorrow. | Mild erythema/swelling is a physiological inflammatory response during the first 2–3 days. From day 4 onwards it is no longer | Wound healing phases · Southampton I |
| **R7** | `wound_open = 1` **OR** `numbness = 1` **OR** `mobility_change = 1` | **ABNORMAL** — Small wound gap, numbness or restricted movement: raise this at your next follow-up appointment; contact your practice if it worsens. | Minor dehiscence and nerve irritation are not emergencies, but they must be documented and observed | Follow-up care standards |
| **R10** | `bleeding >= 1` **AND** `anticoag = 1` | **ABNORMAL** — Bleeding while on blood thinners: observe the dressing and report any increase. | Bleeding must be assessed differently under anticoagulation than without it. The element `anticoag` was collected but originally not used — see [Bug B-05](10-qa-testing.md) | Bleeding assessment |

### 🟢 GREEN — Normal

| ID | Condition | Output | Rationale |
|---|---|---|---|
| **R8** | *(Catch-all — none of the rules above applies)* | **ALL CLEAR** — Wound healing is progressing normally. Perform the next check tomorrow. | Explicit else rule. Guarantees that **every** combination of inputs receives a defined result — there is no hole in the logic |

---

## 6.4 Decision Table — Notices *(non-exclusive)*

These rules fire **in addition** to the classification and may overlap with one another.

| ID | Condition | Output |
|---|---|---|
| **I1** | `risk_count >= 2` | You have several risk factors for impaired wound healing — please attend all of your follow-up appointments. |
| **I2** | `meds_taken = 0` | Please take your prescribed medication — it protects wound healing. |
| **I3** | `smoker = 1` | Smoking slows wound healing — now would be a good moment for a break. |
| **I4** | `crust = 1` | A scab (crust) is a normal sign of healing — do not scratch it off, keep the wound dry. |
| **I5** | `bmi >= 30` **OR** `wound_class >= 3` | Your procedure carried an elevated risk of wound infection — pay particular attention to the daily check. |

**I4 is a deliberate design decision.** A scab is a normal sign of healing, but patients frequently interpret it as a problem (see [Scenario A](02-personas-and-scenarios.md)). Instead of omitting the question, we collect it and actively give the all-clear. At the same time, worst-first applies: if purulent discharge is present simultaneously, R4 wins — the scab notice then appears *alongside* the warning, not instead of it. Tested in [T10](10-qa-testing.md).

---

### Evaluation in two passes

Rule R12 references `classification` — its own result. The rules are therefore evaluated **twice**: the first pass produces a provisional classification, which is fed back into the scope; the second pass may then fire R12. **The worse of the two results wins**, so a second pass can only escalate, never de-escalate — worst-first applies across passes as well.

This mechanism was added after [bug B-07](10-qa-testing.md), in which R12 could never fire because of a circular dependency.

### What a persistence rule has to compare

A rule about persistence needs two things the other rules do not: *what* was found yesterday, and whether it is the **same** thing today. Two derived elements supply them, and both read from the check history rather than from the questionnaire:

| Element | Value |
|---|---|
| `last_classification` (DE-047) | Yesterday's traffic light |
| `last_rule` (DE-050) | **The rule that opened yesterday's evaluation** — the first-pass rule, before any escalation |

`last_rule` deliberately stores the *first-pass* rule, not the rule that finally won the day. If it stored the winner, R12 would compare itself against its own output the following day, never see the finding underneath, and fall back to yellow — which is precisely [bug B-10](10-qa-testing.md).

The condition `severityRank(last_classification) >= 1` ("yellow or worse yesterday") rather than `= 'yellow'` serves the same purpose: once R12 has escalated a course to orange, the following day still counts as a continuing abnormal course instead of resetting the count.

> **This is a classification, not a notification.** R12 keeps a course in ORANGE for as long as the finding persists, which is clinically the honest answer — but it means an alert layer that notifies on every ORANGE day will notify daily. Notifying on *escalation* rather than on *state* is an open point, see [11 Implementation](11-implementation-monitoring-evaluation.md).

---

## 6.5 Completeness and Consistency Check

| Check | Result |
|---|---|
| Every combination of inputs reaches a defined result | ✅ guaranteed by catch-all R8 |
| Prioritisation defined for multiple matches | ✅ worst-first cascade, order documented |
| Every data element with warning relevance feeds into at least one rule | ✅ after fixing B-02 and B-05 |
| Every rule references an L1 source | ✅ except R8 (catch-all, by definition without a source) |
| Every rule has at least one test case | ✅ see [10 QA Testing](10-qa-testing.md) |
| No unreachable rule | ✅ after fixing B-03 (`red_streak` no longer gated) and B-08 (R12 rewritten as a persistence rule) |

### Truth Table for the Critical Rule Group

Systemic signs (R1, R5, R9) — the group with the highest potential for harm in the event of misclassification:

| `temp` | `chills` | `wellbeing` | Result | Rule |
|---|---|---|---|---|
| 39.2 | 0 | 0 | 🔴 RED | R1 |
| 38.0 | 1 | 0 | 🔴 RED | R1 *(chills override temperature)* |
| 39.0 | 0 | 0 | 🔴 RED | R1 *(threshold inclusive)* |
| 38.5 | 0 | 0 | 🟠 ORANGE | R5 |
| 38.0 | 0 | 0 | 🟠 ORANGE | R5 *(threshold inclusive)* |
| 37.4 | 0 | 2 | 🟠 ORANGE | **R9** *(without R9 this would be GREEN → Bug B-02)* |
| 37.4 | 0 | 1 | 🟢 GREEN | R8 |
| 36.9 | 0 | 0 | 🟢 GREEN | R8 |

---

## 6.6 Thresholds

All threshold values are stored as named constants in the L3 (`meta.thresholds`) and are referenced by the rules — **not** hard-coded into the rule expressions. A change in a guideline is therefore a change to a single line.

| Constant | Value | Meaning | Origin |
|---|---|---|---|
| `fever_orange` | 38.0 °C | Fever threshold for suspected infection | CDC deep incisional SSI |
| `fever_red` | 39.0 °C | Fever threshold for emergency | Group decision → [C-07](07-l2-l1-to-l2-challenges.md) |
| `pain_high` | 7 | Severe pain (NRS) | NRS convention |
| `normal_healing_days` | 3 | End of the physiological inflammatory phase | Group decision → [C-03](07-l2-l1-to-l2-challenges.md) |
| `discharge_prolonged_days` | 3 | Persistent discharge | Southampton IIId |
| `bmi_risk` | 30 | Obesity as an SSI risk factor | WHO definition |

> **Demo moment for the presentation:** change `fever_orange` from 38.0 to 37.5, reload the app — the same test case now comes out ORANGE instead of GREEN. Without a single line of code. That is the proof that the separation of layers is real.

---

**Related documents:** [03 L1](03-l1-guidelines-and-evidence.md) · [05 Data Dictionary](05-l2-data-dictionary.md) · [07 Challenges](07-l2-l1-to-l2-challenges.md) · [10 QA](10-qa-testing.md)
