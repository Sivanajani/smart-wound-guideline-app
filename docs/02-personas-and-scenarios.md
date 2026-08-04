# 02 · User Personas & Scenarios

> **Assignment:** *“User Personas and Scenarios — describe the different users that will interact with the CDSS, and provide 2 user scenarios that illustrate examples of how the user will interact with the system."*

---

## 2.1 Overview of the user groups

WundCheck has three user groups at three levels of the care system. Only one of them actively operates the app — the other two consume its output.

| Persona | Role | Interaction | Level |
|---|---|---|---|
| **Peter Brunner** | Patient | Records data daily, receives a recommendation | Primary user |
| **Sandra Meier** | Medical practice assistant / nurse | Receives alerts, triages, organises appointments | Secondary user |
| **Dr. Anna Keller** | Surgeon | Reads the course in the hospital information system, uses aggregated data | Tertiary user |

---

## 2.2 Persona 1 — Peter Brunner, patient *(primary user)*

| | |
|---|---|
| **Profile** | 58, commercial employee, total knee replacement 4 days ago (implant surgery), lives with his wife, little medical background knowledge, wears reading glasses, uses his smartphone for everyday apps |
| **Goals** | To be sure that healing is progressing normally · not to call the hospital about "trivialities" · not to jeopardise the suture removal appointment |
| **Frustrations** | Does not know what "normal" looks like after surgery · finds the hospital's brochure too text-heavy · afraid of overlooking warning signs (his brother had a wound infection) |
| **Tech literacy** | Medium — WhatsApp, online banking, but no willingness to install an app or create an account |
| **Relation to the CDSS** | Completes the daily check in the evening, selects the wound appearance via a graphic, follows the traffic-light recommendation |
| **Success criterion from his point of view** | "In the evening I know whether everything is fine — without having to call anyone." |

**→ Design consequences:**
Images instead of technical terms (NFR-5) · no login, no app store (NFR-1) · reassuring feedback for normal findings is just as important as the warning (FR-4) · large type, high contrast.

---

## 2.3 Persona 2 — Sandra Meier, medical practice assistant *(secondary user)*

| | |
|---|---|
| **Profile** | 34, medical practice assistant in the orthopaedic outpatient clinic, triages telephone calls and messages daily, high workload |
| **Goals** | To recognise and prioritise serious cases quickly · to reduce unnecessary calls · clear, structured information instead of vague patient descriptions |
| **Frustrations** | Telephone triage eats up time · "the wound looks odd" is not usable information · lack of documentation of the course of healing |
| **Relation to the CDSS** | Receives orange/red alerts with a structured wound score and course, triages and organises a call-back or an appointment, sees the data in the record |
| **Success criterion from her point of view** | "Within 10 seconds I can see whether this case needs an appointment today." |

**→ Design consequences:**
The alert contains the classification, the triggering rule, vital values and the 7-day course — not just "patient reports a problem" · alerts only for ORANGE/RED, otherwise alert fatigue · structured data instead of free text.

---

## 2.4 Persona 3 — Dr. med. Anna Keller, surgeon *(tertiary user)*

| | |
|---|---|
| **Profile** | 45, specialist in orthopaedics, operates and carries out follow-up examinations |
| **Goals** | To see the course of healing at a glance at the suture removal appointment · to detect complications early · to monitor the SSI rate of her procedures |
| **Frustrations** | The course between discharge from hospital and the follow-up examination is a black box · retrospective patient recall is unreliable |
| **Relation to the CDSS** | Reads the daily wound score course directly in the hospital information system (via the FHIR interface), uses aggregated data for quality monitoring |
| **Success criterion from her point of view** | "I see the complete course without having to open every single answer." |

**→ Design consequences:**
Additionally store the classification as a **FHIR `Observation`**, so that the course can be displayed as a curve without opening the `QuestionnaireResponse` · data must also be transmitted for GREEN, otherwise the baseline is missing.

---

## 2.5 Scenario A — Normal healing with a scab *(green path)*

**Day 6 after the knee surgery.**

Peter receives the daily reminder at 18:00. He measures **36.9 °C**, reports **pain 2/10** (better than yesterday) and sees a brownish scab on the wound — this worries him, his brother had "something like that too" at the time.

In the app he selects **"Calm & dry"** ("Ruhig & trocken") for the wound appearance and answers the question *"Has a scab / crust formed?" ("Hat sich Wundschorf / eine Kruste gebildet?")* with **Yes**.

WundCheck displays **🟢 GREEN** with the note:

> "A scab is a normal sign of healing — do not scratch it off, keep the wound dry." (“Wundschorf ist ein normales Zeichen der Heilung — nicht abkratzen, Wunde trocken halten.")

Peter is reassured and does **not** call the hospital. The daily entry is transmitted to the patient record as a FHIR data set. At the suture removal appointment on day 12, Dr. Keller sees the complete, unremarkable course.

> **What this scenario shows:** the reassuring function is not a side effect but a goal in its own right. A CDSS that only warns would not have created any benefit here — the avoided unnecessary call *is* the benefit. Clinically represented in rule **I4** (scab = information, not a warning sign) and documented as challenge **C-04**.

---

## 2.6 Scenario B — Suspected infection with an alert *(orange path)*

**Day 7.**

Peter's wound has been distinctly more reddened since yesterday, and he measures **38.3 °C**. In the app he selects the wound appearance **"Distinctly reddened & swollen"** (“Deutlich gerötet & geschwollen"), for the erythema **"extending beyond the wound edge"** (“über den Wundrand hinaus") and for the discharge **"cloudy/yellowish"** (“trüb/gelblich").

WundCheck classifies **🟠 ORANGE**:

> "Suspected infection — contact your practice today." (“Infektionsverdacht — kontaktieren Sie heute Ihre Praxis.")

At the same time, a structured alert goes to the practice. **Sandra** sees it at 08:10 in the dashboard: classification, triggering rule, temperature, wound appearance and the 7-day course are immediately visible — no guessing game on the telephone. She calls Peter back within 30 minutes and gives him an appointment the same afternoon.

**Dr. Keller** confirms a superficial wound infection and starts treatment **two days earlier** than would probably have been the case without WundCheck.

> **What this scenario shows:** the benefit does not arise in the app but at the interface. The classification alone would only have prompted Peter to call — the structured alert additionally shortens the triage time in the practice.

---

## 2.7 Scenario C — Borderline case *(stress test, not part of the compulsory submission)*

**Day 2, late in the evening, no mobile network coverage in the holiday home.**

Peter feels **"really ill"**, but measures only **37.4 °C**; the wound itself looks unremarkable. He completes the check offline.

WundCheck classifies **🟠 ORANGE** via rule **R9** (severe subjective feeling of illness even without measurable fever) and points out that transmission to the practice is pending until network coverage is available again — the recommendation for action nevertheless applies immediately.

> **What this scenario shows:** rule R9 has only existed since bug **B-02** — in the first version, `wellbeing` was collected but was not used in any rule. A patient with a severe feeling of illness but without fever would have received **GREEN**. This exact pattern is dangerous in early sepsis. See [10 QA testing](10-qa-testing.md).

---

**Related documents:** [01 Health Need](01-health-need-and-scope.md) · [06 Decision Logic](06-l2-decision-logic.md) · [09 L4 & UX](09-l4-implementation-ux.md)
