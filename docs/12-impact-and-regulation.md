# 12 · Expected Impact & Regulation

> **Assignment:** *“Describe expected impact — what is the potential impact (positive and negative) of the CDSS? What benefits and challenges does the group anticipate?"*

---

## 12.1 The Guiding Principle

> **For a triage tool in the hands of patients, false reassurance weighs considerably more heavily than a false alarm.**
>
> A false alarm costs a phone call. False reassurance can delay an infection by days. For this reason our logic is consistently designed **worst-first** and deliberately accepts a higher false alarm rate — and for this reason the proportion of GREEN cases that nevertheless present to a physician is our most important safety indicator.

This asymmetry runs through all design decisions: through the order of the rules ([06](06-l2-decision-logic.md)), through the decision not to place safety-critical questions behind conditional logic ([B-03](10-qa-testing.md)), and through the prioritisation of the test cases ([10](10-qa-testing.md)).

---

## 12.2 Expected Benefits

| Level | Benefit | Mechanism of action |
|---|---|---|
| **Patient** | Earlier treatment in the event of infection | Structured daily data capture detects deterioration that goes unnoticed in everyday life |
| | Less unnecessary worry and fewer calls | Active all-clear for normal signs of healing (scab, slight redness) — [Scenario A](02-personas-and-scenarios.md) |
| | Orientation instead of uncertainty | Concrete instructions for action instead of “report anything unusual" |
| **Health Worker** | Triage in seconds instead of minutes | A structured alert with classification, vital signs and trend replaces reconstructing the situation over the phone |
| | Fewer contacts without clinical consequence | Normal signs of healing do not reach the practice in the first place |
| **Hospital / practice** | Complete trend record for the follow-up examination | Daily data points instead of retrospective patient recollection |
| | Quality data on the practice's own SSI rate | Aggregated analysis across procedures and surgeons |
| **Health system** | Potentially fewer readmissions and revision surgeries | Earlier intervention in superficial SSI prevents progression |
| | Structured, standardised follow-up care data | FHIR-based, bound to terminology, analysable |

---

## 12.3 Expected Harm and Risks

| Risk | Mechanism | Mitigation |
|---|---|---|
| **False reassurance** | The patient accepts GREEN even though an infection is present — for instance because the image assignment failed ([C-01](07-l2-l1-to-l2-challenges.md)) | Worst-first logic; ungated safety questions; the note “when in doubt, always call" in every result; monitoring of GREEN cases that present to a physician |
| **Automation bias / deskilling** | The patient relies entirely on the app and no longer observes the wound personally | The result always states the **reason** for the classification, not just the colour — this preserves the patient's own observation |
| **Alert fatigue** | Too many ORANGE notifications → the practice skims or ignores them | Alerts only from ORANGE upwards; override rate as a monitoring indicator with an alarm threshold |
| **Systematic exclusion** | Patients with findings outside the algorithm (scope limits) receive worse care than before because the system suggests safety | Scope note in the app; rule R8 never phrases things as “everything is fine" without the addition that patients should get in touch if worried |
| **Scaling of one's own errors** | An incorrect rule is now applied **consistently** incorrectly — to hundreds of patients. A CDSS-specific risk: systematisation amplifies errors instead of averaging them out | Versioning in the FHIR export makes it reconstructible which rule version produced which recommendation; incident process; regression tests with every change |
| **Digital divide** | Anyone without a smartphone, without internet or without reading literacy does not benefit — the care gap grows rather than shrinks | Image-based operation lowers the language and reading barrier; surveying the proportion without access as an equity indicator; conventional follow-up care must continue to exist in parallel |
| **Data protection** | Health data are transmitted by the patient into the record — consent, transmission security, purpose limitation | Explicit consent; no data collection without a purpose of use (the reason for fixing [B-05](10-qa-testing.md)); encryption |
| **More work instead of relief** | An additional channel that has to be serviced — without phone calls decreasing | Consultation duration and contact numbers are measured explicitly; if both increase, the intervention has failed |
| **Expectation of permanent availability** | An ORANGE at 23:00 creates the expectation of an immediate response | Communicate the time window for alert processing during the discharge consultation; RED always additionally refers to the emergency service |
| **Amplification of anxiety** | Daily confrontation with one's own wound increases worry in some people instead of reducing it | Collect this as an outcome in the pilot evaluation; offer an opt-out option |
| **Liability** | Who is responsible for an incorrect recommendation — the manufacturer, the hospital, the treating physician? | Disclaimer; positioning as a triage instrument, not a diagnostic one; regulatory clarification before any deployment |
| **Sustainability** | What happens after the end of the project if nobody maintains the L3? | Content governance with named clinical responsibility ([11](11-implementation-monitoring-evaluation.md)); deliberately minimal technical infrastructure |

---

## 12.4 Regulatory Classification

> Lecture Day 5: *“Most CDSS tools fit in the definition of SaMD."*

### Is WundCheck a medical device?

**Yes.** According to the IMDRF definition, *Software as a Medical Device* (SaMD) is software that is intended for one or more medical purposes and fulfils these purposes without being part of a hardware medical device. WundCheck serves the **detection and monitoring** of a disease (postoperative wound infection) and therefore falls under the definition.

The lecture names exceptions — national laws that exclude certain low-risk CDSS, a missing SaMD regulation, or a lack of enforcement. None of these plausibly applies to a patient-facing triage tool with emergency outputs.

### IMDRF risk categorisation

| | Inform clinical management | Drive clinical management | Treat or diagnose |
|---|---|---|---|
| **Critical** | IV | III | II |
| **Serious** | III | **II** ← | I |
| **Non-serious** | II | I | I |

**Our classification: Category II.**

*Rationale — the reasoning counts for more than the result:*

- **State of healthcare situation = serious.** A postoperative wound infection is not self-limiting without treatment and can lead to sepsis, revision surgery or implant loss. It is not “critical" in the sense of an immediately life-threatening situation, but clearly more than “non-serious".
- **Significance of information = drive clinical management.** WundCheck does not make a diagnosis and does not propose a therapy — it triggers a contact and thereby directly influences *whether and when* clinical action is taken. That is more than “inform" (mere information), but less than “treat or diagnose".

*Discussion point for the Q&A:* One could argue for “critical", because a delayed infection carries the risk of sepsis — that would yield Category III. We decided against this because the IMDRF category describes the *typical* condition, not the rare extreme course. What matters is this: the lecture makes clear that regulators assess **each function individually** and that a single high-risk function raises the entire product into the stricter class.

### Relevant standards

| Standard | Subject | Relation to our project |
|---|---|---|
| **ISO 14971** | Risk management for medical devices | Our hazard analysis ([10](10-qa-testing.md)) is a simplified precursor |
| **IEC 62304** | Software life cycle | Our versioning and the change process ([08](08-l3-architecture.md)) are first building blocks |
| **IEC 62366** | Usability engineering | The untested area — residual risk (b) |
| **ISO 13485** | Quality management system | Not addressed |
| **GDPR / CH-DSG** | Data protection | Health data are a special category; consent, purpose limitation and a deletion concept are required |
| **EU AI Act** | — | **Not applicable**: WundCheck is rule-based, not an AI system within the meaning of the regulation. A deliberate consequence of forgoing image analysis |

### What would be required for real-world deployment

- Conformity assessment and CE marking under MDR (CH: MepV)
- Quality management system according to ISO 13485
- Risk management file according to ISO 14971
- Clinical evaluation
- Usability engineering file according to IEC 62366
- Post-market surveillance

**For our prototype the following applies:** a disclaimer in the L3 (`meta.disclaimer`) and in the app — *“Study prototype FHNW MSc MI — not for clinical use."*

---

## 12.5 What We Would Do Differently Given More Time

| Priority | Measure | Why |
|---|---|---|
| 1 | Clinical sign-off of all thresholds and rules | The single point that safeguards all eight L1→L2 decisions at once |
| 2 | Usability study on image assignment with laypersons | Validates the central design idea — currently the largest residual risk |
| 3 | Graphics for different skin types and body regions | Erythema looks different on dark skin; the current set depicts only one case |
| 4 | Conversion of the L3 to FHIR Questionnaire | Would establish the software neutrality that we deliberately forwent ([08](08-l3-architecture.md)) |
| 5 | Multilingualism | Provided for in the L3 schema, but only `de` is populated — essential for the target group with language barriers |
| 6 | Offline queue with secured synchronisation | Currently only a manual FHIR download |

---

**Related documents:** [07 Challenges](07-l2-l1-to-l2-challenges.md) · [10 QA](10-qa-testing.md) · [11 Implementation & M&E](11-implementation-monitoring-evaluation.md)
