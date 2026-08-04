# 03 · L1 — Guidelines & Evidence

> **Assignment:** *“Guidelines and Evidence — identify relevant clinical guidelines and evidence and briefly describe the rationale for selection."*

---

## 3.1 L1 architecture: three roles, four sources

We deliberately distinguish between the **normative basis** (what constitutes an infection, when action is required), the **assessment instrument** (how the wound appearance is described) and the **evidence on instrument choice** (how well these instruments actually perform).

| Role | Source | What it provides | Type of evidence |
|---|---|---|---|
| **Normative — definition** | **CDC/NHSN Surgical Site Infection Event** | Definition of superficial / deep incisional SSI, time windows, clinical criteria | International surveillance definition, consensus-based, updated annually |
| **Normative — action** | **NICE NG125** *Surgical site infections: prevention and treatment* (11 April 2019, last updated 19 August 2020) | Postoperative wound care, patient education on signs of infection, treatment in case of suspicion | Evidence-based guideline with systematic appraisal of the evidence |
| **Instrument** | **Southampton Wound Scoring System** (Bailey et al.) | Visual grading of the wound appearance in stages 0–V with sub-grades | Validated, published assessment instrument |
| **Evidence** | **Campwala, Unsell & Gupta (2019)** | Comparison of the predictive value of CDC, ASEPSIS and Southampton | Retrospective cohort study, **n = 22** |

---

## 3.2 Rationale for the selection

### CDC/NHSN SSI criteria — why

The CDC/NHSN definition is the international reference standard for SSI surveillance. It provides three things that no other source specifies with comparable precision:

1. **The time window:** 30 days after the procedure (90 days for implant-related procedures) — this justifies the duration of our follow-up period.
2. **The cardinal clinical signs** of superficial incisional SSI: *“new or worsening localized pain or tenderness; localized swelling; erythema; or heat"* as well as *“purulent drainage from the superficial incision"*. These five signs form the backbone of our data dictionary.
3. **The distinction** between superficial and deep incisional SSI — relevant for us in differentiating ORANGE (superficial suspicion) from RED (dehiscence, deep involvement).

**Deliberate limitation:** The CDC definition partly presupposes a medical examination, culture results or active reopening of the wound. These criteria cannot be captured during self-monitoring at home. We therefore adopt **only the clinical and visual criteria** and derive a *suspicion* from them — not a diagnosis. See Challenge [C-05](07-l2-l1-to-l2-challenges.md).

### NICE NG125 — why

NG125 is a methodologically rigorous, evidence-based guideline with a systematic appraisal of the evidence and is current (2019, updated 2020). Particularly relevant for us:

- **Recommendation 1.1.3** explicitly requires that patients and their relatives receive guidance on *“how to recognise a surgical site infection and who to contact if they are concerned"*. **This is the guideline-based legitimation of our entire use case** — WundCheck operationalises a recommendation that NICE already makes, but whose implementation in practice usually remains a leaflet.
- **Recommendations 1.4.1–1.4.3** on postoperative wound care — aseptic non-touch technique for dressing changes (1.4.1), sterile saline for cleansing up to 48 h (1.4.2), showering permitted from 48 h (1.4.3) — feed into our information rules.
- **Recommendation 1.4.9** on treatment in suspected cellulitis justifies why a spreading erythema is treated as a warning criterion in its own right.

### Southampton Wound Scoring System — why

The decisive reason: **Southampton is a visual grading system.** Our central interaction is an image selection. Without an established instrument, our staging would be a purely self-devised construct without a source — with Southampton it is anchored to a published system that is widely used in SSI research.

In addition, Southampton provides a meaningful ordinal scale with a clear severity gradient (0 → V) that maps directly onto a traffic light, as well as sub-grades for extent and duration that structure our follow-up questions.

### Campwala et al. 2019 — why, and with which limitation

**Full citation:** Campwala I, Unsell K, Gupta S. *A Comparative Analysis of Surgical Wound Infection Methods: Predictive Values of the CDC, ASEPSIS, and Southampton Scoring Systems in Evaluating Breast Reconstruction Surgical Site Infections.* Plastic Surgery (Oakville). 2019. PMID 31106164.

| Characteristic | Value |
|---|---|
| Study design | Retrospective, single-centre |
| Sample | **n = 22** cases with postoperative wound complications |
| Population | Implant-based breast reconstruction, 01/2013–06/2016 |
| Endpoint | Failure of the implant-based reconstruction |

**Results:**

- An ASEPSIS score **> 30** correlated with a **> 50 %** failure rate (p = .022)
- Southampton class B: **60 %** failure · class C: **23 %** · class D: **0 %**
- **CDC scoring had no predictive value** for success vs. failure

**Authors' conclusion:** ASEPSIS demonstrated substantial predictive value; the CDC criteria and Southampton scoring showed limited clinical utility.

---

## 3.3 Appraisal of the evidence

> *Day 2 of the module explicitly requires an appraisal of the L1 sources and their level of evidence. This section is our response to that requirement.*

| Source | Level of evidence | Strengths | Limitations for our use case |
|---|---|---|---|
| CDC/NHSN | Consensus-based surveillance definition, no GRADE rating | Internationally established, precisely operationalised, updated regularly | Designed for **surveillance**, not for point-of-care triage. Presupposes professional judgement and, in part, laboratory diagnostics |
| NICE NG125 | Evidence-based guideline, systematic appraisal of the evidence | Methodologically rigorous, current, contains an explicit patient-education recommendation | British care context; recommendations are addressed to health professionals, not to patients |
| Southampton | Validated instrument, moderate evidence base | Visual, ordinal, suitable for image selection | Developed for **clinical assessment**, not for lay self-assessment |
| Campwala et al. | Retrospective, n = 22, single-centre — **low level of evidence** | Direct comparison of the three instruments | Very small sample; the population (implant-based breast reconstruction) differs substantially from our scope; the endpoint is implant failure, not detection of infection |

### The critical appraisal

> Campwala et al. (2019) show that the three common instruments perform differently — with Southampton showing only limited predictive value. The study is retrospective and single-centre, with n = 22 implant-based breast reconstructions. Its transferability to our broader population (all elective wounds with primary closure, all body regions) is correspondingly limited.
>
> **We therefore deliberately use Southampton not as a prognostic instrument, but as a visual communication and triage grid.** For our objective — timely contact with a health professional rather than prediction of the healing course — comprehensibility for lay users matters more than predictive accuracy. An instrument that predicts the healing course well but cannot be applied by patients would be of no value to us.
>
> We **deliberately rejected ASEPSIS**, even though it performed best in this study: ASEPSIS requires the recording of antibiotic administration, drainage, wound debridement, hospital stay and culture results over several days — none of which patients can capture at home. This is a decision against the statistically superior option in favour of the **applicable** option, and we state it openly.

---

## 3.4 Southampton Mapping

Assignment of the Southampton grades to our wound images and to the traffic-light classification. This table is the bridge between L1 and L2.

| Grade | Southampton definition (original) | Our image | Data elements | Traffic light |
|---|---|---|---|---|
| **0** | Normal healing | `wunde_1_reizlos` | `wound_state = 1` | 🟢 GREEN |
| **I** | Normal healing with mild bruising and/or erythema<br>*Ia: some bruising · Ib: considerable bruising · Ic: mild erythema* | `wunde_2_leicht_geroetet` | `wound_state = 2` | 🟢 GREEN (day 1–3)<br>🟡 YELLOW (from day 4) |
| **II** | Erythema **plus** other signs of inflammation<br>*IIa: at one point · IIb: around sutures · IIc: along wound · IId: around wound* | `wunde_3_stark_geroetet` | `wound_state = 3`, `redness_extent`, `swelling`, `warmth` | 🟡 YELLOW / 🟠 ORANGE |
| **III** | Clear / serous / bloody discharge<br>*IIIa: ≤ 2 cm · IIIb: > 2 cm along wound · IIIc: large volume · IIId: prolonged > 3 days* | `sekret_1_klar`, `sekret_2_blutig` | `secretion = 1\|2`, `discharge_extent`, `discharge_duration_days` | 🟠 ORANGE |
| **IV** | **Pus**<br>*IVa: ≤ 2 cm · IVb: > 2 cm along wound* | `sekret_3_eitrig`, `wunde_4_offen_eiter` | `secretion = 3` | 🟠 ORANGE |
| **V** | Deep / severe wound infection ± tissue breakdown | `wunde_4_offen_eiter` | `wound_state = 4`, `wound_open = 2` | 🔴 RED |

> Grades **IV** and **V** count as **major complications** in the Southampton system.

> ⚠️ **Correction after the test run (bug [B-06](10-qa-testing.md)):** grade IV was originally mapped to RED here, while the decision table classified isolated purulent discharge as ORANGE (R4). The rules are authoritative: purulent discharge requires contact **today**, not the emergency service tonight. RED remains reserved for systemic signs (R1), lymphangitis (R2) and dehiscence or the “open / pus” wound image (R3). Rationale: challenge [C-09](07-l2-l1-to-l2-challenges.md).

The derived data element **`southampton_grade`** ([DE-030](05-l2-data-dictionary.md)) computes the grade from `wound_state`, `redness_extent`, `swelling`, `secretion` and `wound_open` — making it our most clinically informative derived element.

---

## 3.5 Adaptation decisions

Three decisions were necessary to make Southampton usable for lay self-assessment. All three are documented in full in [07 L1→L2 challenges](07-l2-l1-to-l2-challenges.md):

**1 · Sub-grades without centimetre measurements** *(→ C-02)*
Southampton distinguishes “≤ 2 cm" from “> 2 cm along the wound". Patients do not measure at home. Instead we ask: *"At one small spot or along the whole wound?"* (“An einer kleinen Stelle oder entlang der ganzen Wunde?") — semantically close, but without measurement. The price: lower precision and possible systematic underestimation.

**2 · Grade I is time-dependent** *(→ C-03)*
Mild erythema on day 2 is a physiological inflammatory response; on day 8 it is a warning sign. Southampton does not account for this temporal dimension. We link Grade I to `days_post_op` with day 3 as the cut-off. The price: the threshold is set by us, not derived from the source.

**3 · Professional instrument → lay instrument** *(→ C-01)*
The most fundamental decision: Southampton was developed for assessment by trained personnel. We translate it into an image selection for lay users. This is the core of our project — and at the same time our greatest untested risk, because the reliability of lay image matching has not been validated. See the residual-risk statement in [10 QA testing](10-qa-testing.md).

---

## 3.6 Sources

- **CDC/NHSN.** *Surgical Site Infection Event (SSI).* Patient Safety Component Manual. https://www.cdc.gov/nhsn/pdfs/pscmanual/9pscssicurrent.pdf
- **NICE.** *Surgical site infections: prevention and treatment.* NICE guideline NG125, 11 April 2019, last updated 19 August 2020. https://www.nice.org.uk/guidance/ng125
- **Bailey IS et al.** Southampton Wound Scoring System. — Table reproduced in: *Use of Southampton Scoring for Wound Healing in Post-surgical Patients.* https://cdn.fortunejournals.com/articles/use-of-southampton-scoring-for-wound-healing-in-postsurgical-patients.pdf
- **Campwala I, Unsell K, Gupta S.** *A Comparative Analysis of Surgical Wound Infection Methods: Predictive Values of the CDC, ASEPSIS, and Southampton Scoring Systems in Evaluating Breast Reconstruction Surgical Site Infections.* Plastic Surgery. 2019. PMID 31106164. https://journals.sagepub.com/doi/10.1177/2292550319826095

---

**Related documents:** [05 Data Dictionary](05-l2-data-dictionary.md) · [06 Decision Logic](06-l2-decision-logic.md) · [07 L1→L2 Challenges](07-l2-l1-to-l2-challenges.md)
