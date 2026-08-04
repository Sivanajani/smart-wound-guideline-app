# 07 · L1 → L2 — Translation Challenges

> **Assignment:** *“Identify challenges in translation of the L1 to the L2: where did decisions have to be taken / gaps filled? What are the potential implications of these decisions?"*

> **Lecture Day 2:** *“Insufficient clarity of L1 … Choices to be made when translating — aim of fidelity with underlying recommendations, but gaps to be filled / decisions to be taken. Need for clear documentation for validation + transparency."*

---

## 7.1 Why This Document Exists

No guideline is written in such a way that it can be translated into code without interpretation. Between L1 and L2 we had to take decisions at **nine points** that the source does not prescribe. Each of these decisions has clinical consequences — and is therefore a risk that ought to be disclosed.

We classify the gaps by type:

| Type | Meaning |
|---|---|
| **Context gap** | The source presupposes conditions that are not given in our setting |
| **Missing threshold** | The source names no criterion, so we had to set one |
| **Implicit knowledge** | The source presupposes clinical judgement that software does not have |
| **Vagueness** | The source is phrased indeterminately |
| **Evidence gap** | The available evidence supports our application only to a limited extent |

---

## 7.2 The Nine Challenges

### C-01 · A Professional Instrument Becomes a Lay Instrument

| | |
|---|---|
| **Type** | Context gap |
| **Gap in L1** | Both the CDC criteria and the Southampton grading were developed for assessment by **trained personnel**. Our users are medical laypersons assessing their own wound |
| **Our decision** | Translation of the visual grading into an **image selection** (“Which picture fits best?") instead of descriptive questions |
| **Rationale** | Images overcome language and educational barriers. A patient can answer “my wound looks like picture 3" more reliably than “is there erythema with signs of inflammation?" |
| **Implication** | Loss of granularity compared with the original. The assignment depends on the quality and representativeness of the graphics — particularly for different skin types, in which erythema appears visually very different |
| **Risk** | 🔴 **high** — the largest untested risk of the entire approach |
| **Affected** | DE-030, DE-035, R3, R4, R6a, R6b |
| **Mitigation** | Worst-first logic; the wound appearance “open/pus" **always** escalates; residual risk explicitly documented ([10 QA](10-qa-testing.md)) |

### C-02 · Southampton Sub-Grades Without Centimetre Measurements

| | |
|---|---|
| **Type** | Implicit knowledge |
| **Gap in L1** | Southampton distinguishes “≤ 2 cm" from “> 2 cm along the wound" (sub-grades IIIa/b, IVa/b). Patients do not measure their wound at home |
| **Our decision** | Replaced by the qualitative question *“At a small spot or along the whole wound?"* (DE-037) |
| **Rationale** | A semantically close approximation without a measuring instrument. The relative assessment “localised vs. extensive" can also be made reliably by laypersons |
| **Implication** | Lower precision than the original. Possible systematic **underestimation**, because “small" is interpreted generously in subjective terms |
| **Risk** | 🟡 **medium** |
| **Affected** | DE-037, R11 |

### C-03 · From What Point Is Erythema No Longer “Normal Post-Operatively"?

| | |
|---|---|
| **Type** | Missing threshold |
| **Gap in L1** | Neither the CDC nor NICE nor Southampton define from which post-operative day erythema is considered pathological. Southampton has no time dimension at all |
| **Our decision** | **Day 3** as the boundary: mild signs of inflammation (Southampton I) are GREEN up to and including day 3, and YELLOW from day 4 onwards (R6a). **Pronounced** signs (grade II) are YELLOW from day 1 onwards (R6b) |
| **Rationale** | The physiological inflammatory phase of wound healing lasts about 2–3 days. The value is based on wound healing physiology, but was set by us |
| **Implication** | Chosen too early → false alarms during the normal inflammatory phase, loss of trust, alert fatigue in the practice. Chosen too late → delayed detection of early infections |
| **Risk** | 🔴 **high** |
| **Affected** | `normal_healing_days`, R6a, R6b |
| **Note** | The split into R6a/R6b only came about through [Bug B-01](10-qa-testing.md) — originally the entire rule was gated, with the result that even **pronounced** signs of inflammation on days 1–2 came out GREEN |

### C-04 · Scab — Warning Sign or Reassurance?

| | |
|---|---|
| **Type** | Vagueness |
| **Gap in L1** | A scab/crust is not listed as a warning sign in any of our sources — but neither is it explicitly named as normal. Patients regularly interpret it as a problem |
| **Our decision** | A dedicated data element (DE-041) with a **reassuring informational rule** I4. Not a warning sign |
| **Rationale** | Avoids unnecessary contacts and addresses a real concern documented in Persona 1. A CDSS that only warns gives away half of its value |
| **Implication** | Risk of false reassurance if the scab is part of an infectious process. Safeguarded by worst-first: warning rules always override the notice |
| **Risk** | 🟢 **low** |
| **Affected** | DE-041, I4 |
| **Verified in** | [T9, T10](10-qa-testing.md) |

### C-05 · CDC Criteria Presuppose a Medical Examination

| | |
|---|---|
| **Type** | Context gap |
| **Gap in L1** | The CDC/NHSN definition rests in part on criteria that cannot be collected at home: culture results, active reopening of the wound by the physician, imaging procedures, diagnosis by a physician |
| **Our decision** | Adoption of **the clinical-visual criteria only**: purulent drainage, localized pain/tenderness, swelling, erythema, heat |
| **Rationale** | Only these can be captured through self-observation |
| **Implication** | **WundCheck cannot diagnose an SSI** — it detects a suspicion and triages. All outputs are accordingly phrased as recommendations for action (“contact your…"), not as a diagnosis. Cases that manifest primarily through laboratory values or imaging are systematically not captured |
| **Risk** | 🟡 **medium** |
| **Affected** | the entire output logic, all output wordings |

### C-06 · The Evidence Base Supports Our Instrument Only to a Limited Extent

| | |
|---|---|
| **Type** | Evidence gap |
| **Gap in L1** | Campwala et al. (2019) found only **limited predictive value** for Southampton (n = 22, retrospective, implant-based breast reconstruction) — a population that deviates markedly from our scope. ASEPSIS performed better |
| **Our decision** | Southampton is used as a **communication and triage grid**, not as a prognostic instrument. ASEPSIS was **rejected** despite its better figures |
| **Rationale** | ASEPSIS requires antibiotic administration, drainage, debridement, hospital stay and culture results over several days — entirely uncollectable for patients at home. We choose the applicable option over the statistically better one |
| **Implication** | We can make **no statement about the course of healing**, only about the current need for action. The transferability of the study results to our population is limited in any case |
| **Risk** | 🟡 **medium** |
| **Affected** | the entire L1 selection, communication of the value proposition |

### C-07 · Fever Thresholds for Two Urgency Levels

| | |
|---|---|
| **Type** | Missing threshold |
| **Gap in L1** | For deep incisional SSI the CDC names “fever (>38 °C)" — but **one** threshold. We need **two**, because we distinguish between “contact the practice today" (orange) and “emergency immediately" (red) |
| **Our decision** | `fever_orange = 38.0` (adopted from the CDC) · `fever_red = 39.0` (set by us). In addition: chills trigger RED independently of the temperature |
| **Rationale** | 39 °C as the emergency threshold follows common clinical convention. Chills were added because they can precede measurable fever and are a sepsis warning sign |
| **Implication** | The 39 °C limit is **not source-based**. In older or immunosuppressed patients a severe infection can run its course without a high fever — these cases are partly caught by R9 (feeling of illness) |
| **Risk** | 🟡 **medium** |
| **Affected** | `fever_red`, R1, R5 |

### C-08 · No Trajectory on the First Day

| | |
|---|---|
| **Type** | Context gap |
| **Gap in L1** | The CDC phrases criteria as *“new or **worsening** localized pain or tenderness"* — deterioration presupposes a prior finding. On first use there is no previous day |
| **Our decision** | Trajectory-dependent rules (the R5 sub-condition, R12) only become active from the second check day. On the first day `pain_trend` is collected, but interpreted as a self-assessment relative to the day of surgery |
| **Rationale** | Without a baseline, a statement about a trend is not possible. The alternative — dispensing with trajectory rules — would have rendered a substantial part of the CDC criteria unusable |
| **Implication** | On the first day of use, sensitivity is lower. Patients who only start using WundCheck late additionally lose trajectory information. This increases the importance of adherence to use (`check_streak_days` as a monitoring indicator) |
| **Risk** | 🟢 **low** |
| **Affected** | DE-024, DE-047, DE-048, R5, R12 |

---

### C-09 · Severity scale ≠ urgency of action

| | |
|---|---|
| **Type** | Vagueness |
| **Gap in L1** | The Southampton system grades the **severity of the finding** (grades IV and V are “major complications”). It says nothing about **how quickly** anyone has to act. Our traffic light, however, encodes exactly that: urgency |
| **Our decision** | Severity and urgency are decoupled. Isolated purulent discharge (grade IV) is ORANGE — “contact your practice today” — not RED. RED is reserved for systemic signs (R1), lymphangitis (R2) and dehiscence or the “open / pus” wound image (R3) |
| **Rationale** | Purulent discharge is the primary criterion of a superficial incisional SSI and does require treatment — but usually not the emergency service at night. A RED classification that sends every superficial SSI to A&E would overload emergency care and devalue the RED level for the cases that genuinely need it |
| **Implication** | Our traffic light is **not** a Southampton grade. Anyone reading “grade IV” in the FHIR export must not infer “emergency”. Both values are therefore exported separately |
| **Risk** | 🟡 medium |
| **Found by** | Test case T15 — see [bug B-06](10-qa-testing.md) |

---

## 7.3 Overview Table

| ID | Short description | Type | Risk | Affected rules |
|---|---|---|---|---|
| C-01 | Professional instrument → lay instrument | Context gap | 🔴 high | R3, R4, R6a, R6b |
| C-02 | Sub-grades without centimetres | Implicit knowledge | 🟡 medium | R11 |
| C-03 | Boundary of “normal" erythema = day 3 | Missing threshold | 🔴 high | R6a, R6b |
| C-04 | Scab as a notice, not as a warning | Vagueness | 🟢 low | I4 |
| C-05 | Only visual CDC criteria usable | Context gap | 🟡 medium | all outputs |
| C-06 | Southampton as triage, not prognosis | Evidence gap | 🟡 medium | L1 selection |
| C-07 | Two fever thresholds instead of one | Missing threshold | 🟡 medium | R1, R5 |
| C-08 | No trajectory on the first day | Context gap | 🟢 low | R5, R12 |
| C-09 | Severity scale ≠ urgency of action | Vagueness | 🟡 medium | R3, R4 |

---

## 7.4 What Follows From This

**Two of the three high-risk decisions concern the same point:** the translation of a clinical finding into a lay assessment. That is precisely where our tests also found the most serious errors ([B-01](10-qa-testing.md), [B-03](10-qa-testing.md)). This is no coincidence — it is the structural weak point of every patient-facing CDSS.

**All eight decisions would require clinical sign-off.** Lecture Day 5 names *“clinical expert sign-off on rule logic and edge cases"* as a characteristic of adequate validation. In our prototype it is absent — the decisions were taken by a group of students. We list this as a **limitation**, not as a completed item.

**The documented thresholds are the lever for a review.** Because all threshold values reside as named constants in the L3 (`meta.thresholds`), a clinical professional can review and change them without understanding the code. The documentation of these challenges is therefore not merely a submission requirement, but the concrete working basis for precisely this review.

---

**Related documents:** [03 L1](03-l1-guidelines-and-evidence.md) · [06 Decision Logic](06-l2-decision-logic.md) · [10 QA](10-qa-testing.md)
