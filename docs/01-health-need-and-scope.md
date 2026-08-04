# 01 · Health / Health System Need & Scope

> **Assignment:** *“Describe the health / health system need — briefly describe the rationale for the CDSS — what problem will it seek to address?"*

---

## 1.1 The problem

### How common is it?

Surgical site infections (**SSI**) are among the most frequent healthcare-associated infections. European surveillance puts the cumulative incidence between **0.5 % and 10.1 % of operations depending on the procedure** — ECDC recorded 10,149 SSIs in 648,512 monitored procedures across 13 countries in 2017 [1]. The WHO reports the same pattern by procedure type: **9.5 % after colon surgery**, 3.5 % after coronary artery bypass grafting, 2.9 % after caesarean section, 1.0 % after hip replacement and 0.75 % after knee replacement [2]. Switzerland runs a national SSI surveillance programme through Swissnoso, in which more than 170 hospitals and clinics participate [3].

### The decisive figure for our use case

A systematic review of **1,432,293 operations across 15 countries** found that of 141,347 recorded SSIs, **84,984 — 60.1 % — occurred after discharge from hospital** (range across studies 13.5–94.8 %) [4].

> **The majority of surgical site infections therefore appear precisely when no health professional is looking at the wound any more.**

That matches the CDC/NHSN surveillance definition, which sets a window of **30 days** after the procedure (90 days for implant-related procedures) [5] — a period the patient spends almost entirely at home.

### What goes wrong at home

Two opposing errors arise:

| Type of error | What happens | Consequence |
|---|---|---|
| **Recognised too late** | The patient reads warning signs as normal and waits | The infection progresses; in the extreme, sepsis. Longer treatment, readmission, revision surgery |
| **Alarm raised too early** | Normal signs of healing — a scab, erythema on day 2, slight swelling — are read as a problem | Unnecessary consultations; telephone triage ties up practice staff; the patient is left anxious |

Both burden patients and the health system. And the gap between them is **not a knowledge gap among health professionals — it is an observation gap in the home setting**, combined with the inability of lay people to distinguish "normal" from "abnormal".

## 1.2 Why a knowledge-based CDSS?

Alternatives considered, and why they do not solve the problem:

| Alternative | Why it is not sufficient |
|---|---|
| **Information leaflet on discharge** | Already exists almost everywhere. Text-heavy, is not consulted daily, gives no feedback on the *specific* findings. Persona 1 names exactly this as a frustration |
| **Telephone follow-up by the practice** | Staff-intensive, not feasible on a daily basis, "the wound looks odd" is not usable as information |
| **Photo-based ML system** | Requires training data, image quality varies greatly (light, angle, skin type), considerably more demanding from a regulatory point of view, decisions not explainable |
| **Knowledge-based CDSS** ✅ | Rules can be derived from guidelines, are comprehensible, verifiable and **maintainable by clinical staff**. No training data set needed. The decision can be justified to the patient and to the practice |

The last point is decisive: in a safety-critical, patient-facing context, **explainability** is more important than predictive accuracy. A patient has to understand *why* they should call today.

## 1.3 The solution approach

A self-check that can be completed daily in 2–3 minutes and that

1. collects **structured information** (temperature, pain, wound appearance, discharge, systemic signs),
2. classifies it on a rule basis according to established SSI criteria,
3. returns a **traffic-light recommendation with a concrete instruction for action**, and
4. transmits the course of healing in structured form to the patient record.

**The central design idea:** instead of free text or a photo, the patient selects their wound appearance via **clickable graphics** ("This is what it looks like today"). This generates structured, comparable data and also works with low health literacy and across language barriers — both a reality in postoperative follow-up care.

## 1.4 Requirements

### Functional requirements

| ID | Requirement |
|---|---|
| FR-1 | The system records structured wound and general findings daily, entered by the patient themselves |
| FR-2 | The system classifies the findings on a rule basis into four levels of urgency (green / yellow / orange / red) |
| FR-3 | For every classification, the system outputs a concrete recommendation for action that is understandable to lay people |
| FR-4 | The system recognises normal signs of healing and actively reassures, instead of only warning |
| FR-5 | The system transmits every completed check to the patient record in structured form (FHIR) |
| FR-6 | On ORANGE/RED, the system triggers an alert to the practice providing care |
| FR-7 | The system represents the course over several days and can detect deterioration |

### Non-functional requirements

| ID | Requirement | Rationale |
|---|---|---|
| NFR-1 | Operable without prior knowledge, without installation, without an account | Target group has heterogeneous tech literacy; barriers reduce use |
| NFR-2 | Fully operable offline | Network coverage at home is not guaranteed; an outage must not prevent the check |
| NFR-3 | A daily check takes ≤ 3 minutes | Daily use is only realistic if the effort is low |
| NFR-4 | Clinical logic modifiable without programming skills | Guidelines change; maintenance must not depend on developers |
| NFR-5 | Low-barrier: large type, high contrast, images instead of technical terms | Persona 1 wears reading glasses; health literacy varies |
| NFR-6 | Health data are transmitted only with explicit consent | GDPR / CH-DSG; special category of personal data |
| NFR-7 | Every recommendation is traceable to a documented rule and its source | Traceability, verifiability, liability |

## 1.5 Scope

**Covered:**
Surgical wounds with **primary wound closure** (sutures, staples, tissue adhesive) in **adults** after **elective procedures**, irrespective of the body region (head/neck, thorax, abdomen, back, upper and lower extremity).

**Deliberately not covered:**

| Excluded | Rationale |
|---|---|
| Chronic wounds (ulcer, pressure sore) | Completely different normal findings and healing dynamics — our inflammation logic would be clinically wrong |
| Burns | Have their own classification and care systems |
| Secondarily healing / openly treated wounds | "Open wound edges" is the normal state there, whereas for us it is an emergency criterion |
| Children | Different normal values for vital parameters, self-assessment not possible |
| Contaminated emergency procedures | Considerably higher baseline risks, closer medical monitoring required |

The delimitation is deliberate and justified: the assignment places quality above completeness. A correct, narrowly defined logic is worth more than a broad one that becomes clinically wrong at the margins.

> ⚠️ **WundCheck does not replace medical assessment.** It triages and documents. In case of doubt, the rule is always: contact the practice or the emergency service.

---

**Related documents:** [02 Personas](02-personas-and-scenarios.md) · [03 L1 sources](03-l1-guidelines-and-evidence.md) · [12 Impact](12-impact-and-regulation.md)

---

## Sources

1. **ECDC.** *Healthcare-associated infections: surgical site infections — Annual Epidemiological Report for 2017.* European Centre for Disease Prevention and Control. 10,149 SSIs in 648,512 procedures, 13 reporting countries, 0.5–10.1 % depending on procedure. https://www.ecdc.europa.eu/en/publications-data/healthcare-associated-infections-surgical-site-infections-annual-1
2. **WHO.** *Global Guidelines for the Prevention of Surgical Site Infection.* World Health Organization, 2nd edition. Cumulative incidence in Europe by procedure: colon surgery 9.5 %, CABG 3.5 %, caesarean section 2.9 %, cholecystectomy 1.4 %, hip prosthesis 1.0 %, laminectomy 0.8 %, knee prosthesis 0.75 % per 100 operations. https://www.ncbi.nlm.nih.gov/books/NBK536433/
3. **Swissnoso / Federal Office of Public Health.** *SSI Surveillance* — national Swiss surveillance programme; more than 170 participating hospitals, clinics and facilities. https://www.bag.admin.ch/en/ssi-surveillance-4
4. **Woelber E, Schrick EJ, Gessner BD, Evans HL.** *Proportion of Surgical Site Infections Occurring after Hospital Discharge: A Systematic Review.* Surgical Infections. 2016;17(5):510–519. doi:10.1089/sur.2015.241 — 55 studies, 1,432,293 operations, 141,347 SSIs, of which 60.1 % post-discharge.
5. **CDC/NHSN.** *Surgical Site Infection Event (SSI).* Patient Safety Component Manual — 30-day surveillance window, 90 days for implant-related procedures. https://www.cdc.gov/nhsn/pdfs/pscmanual/9pscssicurrent.pdf
6. **NICE.** *Surgical site infections: prevention and treatment.* NICE guideline NG125, 11 April 2019, last updated 19 August 2020 — recommendation 1.1.3 on patient education. https://www.nice.org.uk/guidance/ng125
