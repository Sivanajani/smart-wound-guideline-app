# 11 · Implementation, Monitoring & Evaluation

> **Assignment:** *“Briefly outline the plan for CDSS implementation — how will the CDSS be provided to users and maintained? Consider factors such as integration with existing systems and user training. Briefly describe an approach to monitoring and evaluation — what are the objectives at different stages of maturity? What methods will be used?"*

---

# Part A — Implementation

## 11.1 Provision

| Aspect | Implementation |
|---|---|
| **Distribution** | QR code and short link on the discharge sheet. No app store, no account, no installation |
| **Devices** | Any smartphone, tablet or desktop with a modern browser. No minimum operating system |
| **Connectivity** | Fully usable offline after the initial load. Transmission to the record takes place as soon as network coverage is available again |
| **Hosting** | Static hosting of a single HTML file — minimal infrastructure, low operating costs |
| **Patient ↔ case assignment** | Manual in the prototype. In the rollout: token-based link without password, issued at hospital discharge |

## 11.2 Integration into Existing Systems

```
WundCheck (patient)
   │  FHIR R4
   ├── QuestionnaireResponse ──▶ HIS / EPD  (daily check, all answers)
   ├── Observation ────────────▶ HIS / EPD  (traffic-light classification, as a trend curve)
   └── Communication ──────────▶ practice inbox (only for ORANGE/RED)
```

| Level | Implementation | Fallback |
|---|---|---|
| HIS connection | FHIR R4 **transaction bundle**, POSTed to `meta.fhir.endpoint`. Switching servers is a configuration change in the L3, not a code change | Outbound queue in the app; `Download FHIR bundle` as a manual fallback |
| Swiss context | Connection to the **EPD** (electronic patient dossier) via FHIR | — |
| Alert delivery | `Communication` resource in the same bundle, `priority: urgent` (ORANGE) / `stat` (RED), generated **only** from ORANGE upwards | E-mail notification with structured attachment |
| Terminology | SNOMED CT, LOINC, ICD-10 | **Open:** the SNOMED CT licensing situation in Switzerland still needs to be clarified |

**Interoperability level achieved:** structural ✅ · semantic ⚠️ partial · organisational ❌ — see [09 L4](09-l4-implementation-ux.md#interoperability-level-achieved).

## 11.3 Training

| Target group | Format | Duration | Content |
|---|---|---|---|
| **Patient** | Explanation during the discharge consultation + illustrated information leaflet | 5 min | Scan QR code, carry out the first wound check together, explain the traffic light, name the scope limits (“when in doubt, always call") |
| **Medical practice assistant / nursing staff** | Training on the practice dashboard | 30 min | Reading an alert, interpreting the trend, escalation process, acknowledgement |
| **Medical management** | Short briefing | 15 min | Trend display in the HIS, limits of the system, handling discrepancies between classification and clinical findings |
| **New staff members** | Onboarding module | 15 min | Because of the high staff turnover in the practice: not a one-off training session, but a fixed part of onboarding |

**Critical point:** Patient training takes place on the day of hospital discharge — a moment of high cognitive load. Carrying out the first wound check together is therefore more important than any explanation. At the same time, this is an opportunity to check the image assignment once against the medical findings (addresses residual risk (b) from [10 QA](10-qa-testing.md)).

## 11.4 Maintenance & Content Governance

| Question | Answer |
|---|---|
| Who owns the clinical content? | The operating specialist department — not IT |
| Who is allowed to change a rule? | Change made by the clinically responsible person at L2, sign-off under the four-eyes principle |
| How long from guideline update to going live? | Target: **≤ 4 weeks** — L2 adaptation (1 wk) → clinical review (1 wk) → transfer to L3 + regression test (1 wk) → release (1 wk) |
| What happens in the event of an incident? | Incident process: report → reconstruction via the L3 version carried in the FHIR export → rule review → hotfix if required + unscheduled regression test |
| Who operates the technology? | Static hosting — minimal operating effort. No application server, no database on the application side |

The change process in detail: [08 L3 — Versioning & Update Management](08-l3-architecture.md#86-versioning--update-management).

## 11.5 Stakeholders

| Stakeholder | Interest | Risk |
|---|---|---|
| Patient | Safety, orientation | Data protection concerns; feeling overwhelmed |
| Medical practice assistant / nursing staff | Relief for telephone triage | An additional channel = additional work if alerts are too frequent |
| Operating physicians | Early complication detection, quality data | Liability questions in the event of misclassification |
| Hospital management | Fewer readmissions, quality indicators | Investment without proven benefit |
| HIS vendor | — | Effort for the FHIR interface |
| Data protection officer | Legal compliance | Health data in the hands of patients |

**The critical group is the practice.** If Sandra experiences the alerts as a burden, the implementation fails — regardless of the quality of the classification. Therefore: alerts only for ORANGE/RED, structured instead of free text, and measurement of the alert load as an explicit monitoring indicator.

## 11.6 Phase Plan

| Phase | Scope | Duration | Success criterion for the next phase |
|---|---|---|---|
| **0 Preparation** | Clinical review of all thresholds and rules; revision of the graphics | 4 weeks | Sign-off by a clinical specialist |
| **1 Pilot** | 1 hospital, 1 specialty, ~30 patients | 3 months | Usability demonstrated; no serious misclassification |
| **2 Evaluation & adaptation** | Analysis, rule revision, UX rework | 2 months | Target values for adherence and agreement achieved |
| **3 Expansion** | Several specialties, HIS integration in productive use | 6 months | Stable operation; alert load bearable for the practice |
| **4 Scaling** | Further sites, multilingualism | open | Proof of effectiveness from phase 3 |

---

# Part B — Monitoring & Evaluation

We follow the maturity-stage framework of the WHO (*Monitoring and Evaluating Digital Health Interventions: A practical guide*, 2016) and the monitoring systematics from Lecture Day 6.

## 11.7 Monitoring Components

| Component | Definition (Lecture Day 6) | Our indicators | Target value |
|---|---|---|---|
| **Functionality** | *Whether a system provides functions that meet stated and implied needs under specified conditions* (ISO/IEC 25000) | Loading time; error rate in rule evaluation; success rate of the FHIR export; proportion of completed runs without a technical error | > 99 % error-free runs |
| **Stability** | *Whether the system consistently works as intended — including under normal and stress conditions* | Availability of the hosting; behaviour when the network drops in the middle of data entry; data loss rate | 0 data losses |
| **Fidelity** | *Whether the intervention is delivered as intended* — implementation realities may alter functionality and stability | Proportion of patients with a daily wound check; `check_streak_days`; drop-out rate and drop-out point; proportion of alerts acknowledged within 4 h | > 70 % of days with a wound check; > 90 % of alerts < 4 h |
| **Data Quality** | | Completeness of the mandatory fields; rate of constraint violations; plausibility of the time series | < 5 % incomplete entries |

**ISO/IEC 25000** distinguishes three levels of software quality — we position ourselves as follows: *internal quality* (during development) ✅ through our desk-based testing · *external quality* (simulated environment) ⚠️ partial · *quality in use* ❌ not yet achieved.

## 11.8 Evaluation by Maturity Stage

| Stage | M&E-Objective | Method | Instrument | Success criterion |
|---|---|---|---|---|
| **Prototype** | Does the logic work as specified? | Desk-based testing, L2 verification | Test cases T1–T19, hazard analysis | All high-risk test cases passed |
| **Pilot** | Can patients operate it correctly? Is the image assignment reliable? | Usability test; **parallel assessment** patient vs. specialist | **SUS** questionnaire; Cohen's Kappa for agreement; task completion rate; time-on-task | SUS > 70; Kappa > 0.6 |
| **Pilot** | Is it accepted? | Semi-structured interviews, focus groups | Topic guide; **TAM/UTAUT** constructs | Intention to use positive among patients and the practice |
| **Demonstration** | Does it shorten the time to treatment? | Chart review against a historical cohort | Time from first symptom to medical contact | Reduction by ≥ 1 day |
| **Demonstration** | Does it reduce unnecessary contacts? | Analysis of practice contact data | Number of contacts without clinical consequence | Measurable reduction |
| **Scale-up** | Is it clinically effective? | **Stepped-wedge cluster design** across several wards | SSI rate; proportion of late-detected infections; readmission rate | Non-inferiority at minimum; superiority aimed for |
| **Scale-up** | Is it worth it? | Cost survey | Cost per avoided late diagnosis; cost per patient and follow-up care episode | — |
| **Integration** | Does it remain effective in routine operation? | Implementation research (**RE-AIM**) | Reach, Effectiveness, Adoption, Implementation, Maintenance | — |

**Why stepped-wedge and not an RCT:** All wards receive the intervention, only at different points in time. This is easier to implement ethically and organisationally than a control group that permanently remains without support — and it is methodologically well suited to staggered rollouts in a care setting.

## 11.9 Actively Measuring Adverse Effects

An M&E plan that measures only success is incomplete. The following indicators explicitly capture the downsides:

| Indicator | Why | Alarm threshold |
|---|---|---|
| **Cases with a GREEN classification that presented to a physician within 72 h** | ⭐ **The single most important safety indicator of all.** It directly measures false reassurance — the risk we rate as more serious than false alarms | every case is reviewed individually |
| False alarm rate (ORANGE/RED without clinical consequence) | Alert fatigue in the practice; loss of trust among patients | > 40 % → rule revision |
| Average consultation duration in the practice | Does the system shift work instead of reducing it? | Increase → process analysis |
| Proportion of patients without a smartphone/internet access | Digital divide — do only the already better-off benefit? | Surveyed at every hospital discharge |
| Alert override rate in the practice | Are alerts routinely clicked away? | > 30 % → review alert criteria |
| Discontinuation of use by day (drop-off curve) | On which day do we lose patients? | — |

**Relation to residual risk:** The first indicator directly addresses the untested points (b) and (d) from [10 QA](10-qa-testing.md). What we could not test before deployment must be monitored during deployment — this is the bridge between residual risk documentation and monitoring plan that Lecture Day 5 requires.

---

**Related documents:** [08 L3](08-l3-architecture.md) · [09 L4](09-l4-implementation-ux.md) · [10 QA](10-qa-testing.md) · [12 Impact](12-impact-and-regulation.md)
