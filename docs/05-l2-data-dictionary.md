# 05 · L2 — Data Dictionary

> **Assignment:** *“Data dictionary: specify data elements … at a minimum this should include the data element labels, type, response options and conditional logic. Where possible, map to standards. As a guide, the CDSS should include between 30–50 data elements, with at least some conditional logic, and some derived data elements."*

---

## 5.1 Key figures

| | |
|---|
| **Total data elements** | **48** |
| of which **derived** (`calculated`) | **9** |
| of which with **conditional logic** (`relevant`) | **4** |
| of which with a **constraint** | **8** |
| of which with a **terminology binding** | **38** |
| of which with a **FHIR mapping** | **48** (all) |
| Sections | 5 |

**Key to types:** `text` · `integer` · `decimal` · `date` · `select_one` · `calculated`

---

## 5.2 Section 1 — Surgery details *(once only)*

| ID | Variable | Label | Type | Response options | Condition | Constraint | Terminology | FHIR | L1 source |
|---|---|---|---|---|---|---|---|---|
| DE-001 | `pat_name` | Name ("Name") | text | — | — | — | — | `Patient.name` | — |
| DE-002 | `pat_dob` | Date of birth ("Geburtsdatum") | date | — | — | not in the future | LOINC 21112-8 | `Patient.birthDate` | — |
| DE-003 | `pat_age` | Age in years ("Alter (Jahre)") | **calculated** | `ageYears(pat_dob)` | — | — | LOINC 30525-0 | `Patient.birthDate` (derived) | — |
| DE-004 | `op_date` | Date of surgery ("Datum der Operation") | date | — | — | not in the future | SNOMED 387713003 | `Procedure.performedDateTime` | CDC (time window) |
| DE-005 | `days_post_op` | Days since surgery ("Tage seit der Operation") | **calculated** | `daysSince(op_date)` | — | — | — | `Observation.effectiveDateTime` (derived) | CDC 30/90-day window |
| DE-006 | `op_site` | Body site of the wound ("Körperstelle der Wunde") | select_one | 1=Head/neck ("Kopf/Hals") · 2=Thorax ("Thorax") · 3=Abdomen ("Abdomen") · 4=Back ("Rücken") · 5=Shoulder/arm ("Schulter/Arm") · 6=Hand ("Hand") · 7=Hip/leg ("Hüfte/Bein") · 8=Foot ("Fuss") · 9=Other ("Andere") | — | — | SNOMED 442083009 | `Procedure.bodySite` | — |
| DE-007 | `closure` | Wound closure ("Wundverschluss") | select_one | 1=Sutures ("Naht") · 2=Staples ("Klammern") · 3=Glue/Steri-Strips ("Kleber/Steristrips") | — | — | SNOMED 129287005 | `Procedure.focalDevice` | — |
| DE-008 | `wound_class` | CDC wound classification ("CDC-Wundklassifikation") | select_one | 1=Clean · 2=Clean-contaminated · 3=Contaminated · 4=Dirty | — | — | SNOMED 255215009 | `Procedure.category` | **CDC/NHSN** |
| DE-009 | `op_duration_min` | Duration of surgery in minutes ("Dauer der Operation (Minuten)") | integer | — | — | 1–1440 | — | `Procedure.performedPeriod` | SSI risk factor |
| DE-010 | `antibiotic_prophylaxis` | Did you receive an antibiotic before/during surgery? ("Antibiotikum vor/während der OP erhalten?") | select_one | 1=Yes ("Ja") · 0=No ("Nein") · 9=Don't know ("Weiss nicht") | — | — | SNOMED 428264007 | `MedicationAdministration` | NICE NG125 |
| DE-011 | `drainage_present` | Is a drain in place? ("Liegt eine Drainage?") | select_one | 1=Yes ("Ja") · 0=No ("Nein") | — | — | SNOMED 257803006 | `Device.type` | — |

## 5.3 Section 2 — Risk factors *(once only)*

| ID | Variable | Label | Type | Response options | Condition | Constraint | Terminology | FHIR | L1 source |
|---|---|---|---|---|---|---|---|---|
| DE-012 | `diabetes` | Do you have diabetes? ("Haben Sie Diabetes?") | select_one | 1=Yes ("Ja") · 0=No ("Nein") · 9=Don't know ("Weiss nicht") | — | — | ICD-10 E10–E14 | `Condition.code` | SSI risk factors |
| DE-013 | `smoker` | Do you smoke? ("Rauchen Sie?") | select_one | 1=Yes ("Ja") · 0=No ("Nein") | — | — | SNOMED 77176002 | `Observation` (social history) | SSI risk factors |
| DE-014 | `immunosuppr` | Do you take any medication that weakens the immune system? ("Nehmen Sie Medikamente, die das Immunsystem schwächen?") | select_one | 1=Yes ("Ja") · 0=No ("Nein") · 9=Don't know ("Weiss nicht") | — | — | SNOMED 373847000 | `MedicationStatement` | SSI risk factors |
| DE-015 | `anticoag` | Do you take blood thinners? ("Nehmen Sie Blutverdünner?") | select_one | 1=Yes ("Ja") · 0=No ("Nein") · 9=Don't know ("Weiss nicht") | — | — | SNOMED 372862008 | `MedicationStatement` | Bleeding assessment |
| DE-016 | `height` | Height in cm ("Körpergrösse (cm)") | integer | — | — | 100–230 | LOINC 8302-2 | `Observation.valueQuantity` | — |
| DE-017 | `weight` | Weight in kg ("Gewicht (kg)") | decimal | — | — | 30–300 | LOINC 29463-7 | `Observation.valueQuantity` | — |
| DE-018 | `bmi` | BMI | **calculated** | `weight / (height/100)^2` | — | — | LOINC 39156-5 | `Observation.valueQuantity` | SSI risk factor |
| DE-019 | `risk_count` | Number of risk factors | **calculated** | `(diabetes=1) + (smoker=1) + (immunosuppr=1) + (bmi>=30)` | — | — | — | `RiskAssessment.prediction` | SSI risk factors | ✅ *(extended)* |

## 5.4 Section 3 — Daily check: general condition

| ID | Variable | Label | Type | Response options | Condition | Constraint | Terminology | FHIR | L1 source |
|---|---|---|---|---|---|---|---|---|
| DE-020 | `temp` | Body temperature today in °C ("Körpertemperatur heute (°C)") | decimal | — | — | 34–43 · *"Plausible temperature: 34–43 °C." (“Plausible Temperatur: 34–43 °C.")* | LOINC 8310-5 | `Observation.valueQuantity` | **CDC** (fever >38 °C) |
| DE-021 | `fever` | Fever (from 38.0 °C) ("Fieber (ab 38.0 °C)") | **calculated** | `temp >= thresholds.fever_orange` | — | — | SNOMED 386661006 | `Observation.interpretation` | **CDC** deep incisional SSI |
| DE-022 | `chills` | Have you had chills? ("Hatten Sie Schüttelfrost?") | select_one | 1=Yes ("Ja") · 0=No ("Nein") | — | — | SNOMED 43724002 | `Observation.valueCodeableConcept` | Sepsis warning sign |
| DE-023 | `pain` | How severe is your pain? (0–10) ("Wie stark sind Ihre Schmerzen? (0–10)") | integer | NRS 0–10 | — | 0–10 · *"Please enter a value between 0 and 10." (“Bitte Wert zwischen 0 und 10.")* | LOINC 72514-3 | `Observation.valueQuantity` | **CDC** (“pain or tenderness") |
| DE-024 | `pain_trend` | Pain compared with yesterday ("Schmerzen im Vergleich zu gestern") | select_one | 0=Better ("Besser") · 1=The same ("Gleich") · 2=Worse ("Schlechter") | — | — | — | `Observation.valueCodeableConcept` | **CDC** (“new or worsening") |
| DE-025 | `sleep_disturbed_by_pain` | Did the pain disturb your sleep? ("Haben die Schmerzen den Schlaf gestört?") | select_one | 1=Yes ("Ja") · 0=No ("Nein") | `pain >= 4` | — | SNOMED 301345002 | `Observation.valueCodeableConcept` | Pain proxy |
| DE-026 | `wellbeing` | How do you feel overall? ("Wie fühlen Sie sich insgesamt?") | select_one | 0=Well ("Gut") · 1=Tired ("Müde") · 2=Really ill ("Richtig krank") | — | — | SNOMED 386661006 | `Observation.valueCodeableConcept` | Systemic sign |
| DE-027 | `nausea_vomiting` | Nausea or vomiting? ("Übelkeit oder Erbrechen?") | select_one | 0=No ("Nein") · 1=Nausea ("Übelkeit") · 2=Vomiting ("Erbrechen") | — | — | SNOMED 422587007 | `Observation.valueCodeableConcept` | Systemic sign |
| DE-028 | `appetite` | Appetite today ("Appetit heute") | select_one | 0=Normal ("Normal") · 1=Reduced ("Vermindert") · 2=No appetite ("Kein Appetit") | — | — | SNOMED 79890006 | `Observation.valueCodeableConcept` | Systemic sign |
| DE-029 | `meds_taken` | Prescribed medication taken today? ("Verordnete Medikamente heute eingenommen?") | select_one | 1=Yes ("Ja") · 0=No ("Nein") · 2=None prescribed ("Keine verordnet") | — | — | SNOMED 182840001 | `MedicationStatement.status` | Adherence |

## 5.5 Section 4 — Daily check: the wound

| ID | Variable | Label | Type | Response options | Condition | Constraint | Terminology | FHIR | L1 source |
|---|---|---|---|---|---|---|---|---|
| DE-030 | `wound_state` | **Which image best matches your wound today?** ("Welches Bild passt am besten zu Ihrer Wunde heute?") 🖼️ | select_one | 1=Calm & dry ("Ruhig & trocken") · 2=Slightly reddened ("Leicht gerötet") · 3=Markedly reddened & swollen ("Stark gerötet & geschwollen") · 4=Open / pus ("Offen / Eiter") | — | — | SNOMED 225552003 | `Observation.valueCodeableConcept` | **Southampton 0–V** |
| DE-031 | `redness_extent` | How far does the erythema extend? ("Wie weit geht die Rötung?") | select_one | 0=None ("Keine") · 1=Only at the wound edge ("Nur am Wundrand") · 2=Around the suture ("Um die Naht herum") · 3=Along the whole wound ("Entlang der ganzen Wunde") · 4=Beyond the wound ("Über die Wunde hinaus") | — | — | SNOMED 247441003 | `Observation.valueCodeableConcept` | **Southampton IIa–IId** |
| DE-032 | `red_streak` | **Is a red streak spreading away from the wound?** ("Zieht ein roter Streifen von der Wunde weg?") | select_one | 1=Yes ("Ja") · 0=No ("Nein") | *(none — deliberately always visible)* | — | SNOMED 46117009 | `Observation.valueCodeableConcept` | **NICE NG125 1.4.9** (cellulitis/lymphangitis) |
| DE-033 | `swelling` | Is the area around the wound swollen? ("Ist die Umgebung der Wunde geschwollen?") | select_one | 0=No ("Nein") · 1=Slightly ("Leicht") · 2=Markedly ("Deutlich") · 3=Severely ("Stark") | — | — | SNOMED 65124004 | `Observation.valueCodeableConcept` | **CDC** (“localized swelling") |
| DE-034 | `warmth` | Does the skin around the wound feel hot? ("Fühlt sich die Haut um die Wunde heiss an?") | select_one | 1=Yes ("Ja") · 0=No ("Nein") | — | — | SNOMED 707793005 | `Observation.valueCodeableConcept` | **CDC** (“heat") |
| DE-035 | `secretion` | **Is fluid coming out of the wound? Which image matches?** ("Kommt Flüssigkeit aus der Wunde? Welches Bild passt?") 🖼️ | select_one | 0=None ("Keine") · 1=Clear ("Klar") · 2=Bloody ("Blutig") · 3=Cloudy / purulent ("Trüb / eitrig") | — | — | SNOMED 449736006 | `Observation.valueCodeableConcept` | **CDC** (“purulent drainage") · **Southampton III–IV** |
| DE-036 | `secretion_smell` | Does the wound discharge smell unpleasant? ("Riecht das Wundsekret unangenehm?") | select_one | 1=Yes ("Ja") · 0=No ("Nein") | `secretion >= 1` | — | SNOMED 288227007 | `Observation.valueCodeableConcept` | Sign of infection |
| DE-037 | `discharge_extent` | Is the fluid coming from one small spot or along the whole wound? ("Kommt die Flüssigkeit an einer kleinen Stelle oder entlang der ganzen Wunde?") | select_one | 1=Small spot ("Kleine Stelle") · 2=Along the whole wound ("Entlang der ganzen Wunde") | `secretion >= 1` | — | — | `Observation.valueCodeableConcept` | **Southampton IIIa/b, IVa/b** |
| DE-038 | `discharge_duration_days` | For how many days has fluid been coming out? ("Seit wie vielen Tagen kommt Flüssigkeit?") | integer | — | `secretion >= 1` | 0–60 | — | `Observation.valueQuantity` | **Southampton IIId** (>3 days) |
| DE-039 | `bleeding` | Is the wound bleeding? ("Blutet die Wunde?") | select_one | 0=No ("Nein") · 1=Slightly ("Leicht") · 2=Heavily, dressing soaked through ("Stark (Verband durchtränkt)") | — | — | SNOMED 131148009 | `Observation.valueCodeableConcept` | Aftercare standard |
| DE-040 | `wound_open` | Are the wound edges closed? ("Sind die Wundränder geschlossen?") | select_one | 0=Closed ("Geschlossen") · 1=Small gap ("Kleine Lücke") · 2=Gaping open ("Klaffend offen") | — | — | SNOMED 225553008 | `Observation.valueCodeableConcept` | **CDC** deep incisional (dehiscence) |
| DE-041 | `crust` | Has a scab / crust formed? ("Hat sich Wundschorf / eine Kruste gebildet?") | select_one | 1=Yes ("Ja") · 0=No ("Nein") | — | — | SNOMED 262074001 | `Observation.valueCodeableConcept` | Phases of wound healing |
| DE-042 | `numbness` | New numbness or tingling at the wound? ("Neues Taubheitsgefühl oder Kribbeln an der Wunde?") | select_one | 1=Yes ("Ja") · 0=No ("Nein") | — | — | SNOMED 44077006 | `Observation.valueCodeableConcept` | Nerve irritation |
| DE-043 | `mobility_change` | New restriction of movement at the operated site? ("Neue Bewegungseinschränkung an der operierten Stelle?") | select_one | 1=Yes ("Ja") · 0=No ("Nein") | — | — | SNOMED 105504002 | `Observation.valueCodeableConcept` | Functional warning sign |
| DE-044 | `dressing_changed_today` | Dressing changed today? ("Verband heute gewechselt?") | select_one | 1=Yes ("Ja") · 0=No ("Nein") · 2=No dressing ("Kein Verband") | — | — | SNOMED 182531007 | `Procedure.code` | **NICE NG125 1.4.1** |

## 5.6 Section 5 — Derived classification *(not visible to users)*

| ID | Variable | Label | Type | Calculation | Terminology | FHIR | L1 source |
|---|---|---|---|---|---|---|---|
| DE-045 | `southampton_grade` | Southampton grade | **calculated** | see below | SNOMED 225552003 | `Observation.valueCodeableConcept` | **Southampton** |
| DE-046 | `classification` | Traffic-light classification | **calculated** | Result of the decision table (R1–R12) | — | `Observation.valueCodeableConcept` | — |
| DE-047 | `last_classification` | Yesterday's classification | **calculated** | `previous(classification)` | — | `Observation` (previous day) | — |
| DE-048 | `trend_worsening` | Deterioration compared with yesterday | **calculated** | `severity(classification) > severity(last_classification)` | — | `Observation.interpretation` | **CDC** (“new or worsening") |
| DE-049 | `check_streak_days` | Consecutive days with a completed check | **calculated** | `countConsecutiveDays()` | — | — | Fidelity indicator ([M&E](11-implementation-monitoring-evaluation.md)) |
| DE-050 | `last_rule` | Yesterday's triggering rule | **calculated** | `previousRule()` — the rule that **opened** yesterday's evaluation, before any escalation | — | `Observation` (previous day) | Persistence criterion ([B-09](10-qa-testing.md), [B-10](10-qa-testing.md)) |

> *Note: `check_streak_days` (DE-049) is a purely monitoring-related indicator without any effect on the clinical rules. If it is not counted among the clinical data elements, the total is 48.*
>
> *`last_rule` (DE-050) exists because [R12](06-l2-decision-logic.md) asks whether the **same** finding persists, not merely whether the colour repeats. It deliberately holds the first-pass rule: storing the winning rule would make R12 compare against its own escalation the next day — see [B-10](10-qa-testing.md).*

---

## 5.7 Calculation of `southampton_grade`

```
southampton_grade =
    V     if wound_open = 2 or wound_state = 4
    IV    if secretion = 3
    III   if secretion in (1, 2)
    II    if wound_state = 3
                or redness_extent >= 3
                or swelling >= 2
                or warmth = 1
    I     if wound_state = 2 or redness_extent in (1, 2)
    0     otherwise
```

The order is **descending** — the first matching case wins. The worst-first principle therefore applies here as well: a patient with purulent discharge (IV) and mild erythema (I) at the same time receives Grade IV.

Mapping table and derivation: [03 L1 — Southampton Mapping](03-l1-guidelines-and-evidence.md#34-southampton-mapping)

---

## 5.8 Design principles

**Sequence and grouping (UX)**
The assignment explicitly mentions *“sequence and grouping of your questions"*. Our sections follow **not** the structure of the guideline, but the sequence a patient naturally works through at home: first the one-off details (only on the first occasion), then "how am I feeling" (general condition), then "what does the wound look like" (inspection). The wound inspection comes last because it requires removing the dressing and involves the greatest effort.

**Conditional logic**
4 elements are tied to a condition. The basic rule: questions that only make sense given a particular finding are only asked in that case (`discharge_extent` only when discharge is present). **Exception for safety reasons:** `red_streak` (DE-032) is deliberately *not* gated — see [Bug B-03](10-qa-testing.md), in which an emergency rule was rendered unreachable by conditional logic.

**Constraints and data quality**
8 elements have plausibility checks with an error message that lay users can understand. Constraints run **before** the rules are evaluated (validation loop in the [BPMN detail process](04-l2-workflow-bpmn.md)), so that no classification is based on implausible data.

**Terminology binding**
38 elements carry SNOMED CT, LOINC or ICD-10 codes. Deliberately not mapped are: purely administrative fields (`pat_name`), app-internal counter variables and elements for which no unambiguous concept exists. For a production system, the SNOMED CT licensing situation in Switzerland would need to be clarified — see [11 Implementation](11-implementation-monitoring-evaluation.md).

**FHIR mapping**
All elements are assigned to a FHIR R4 resource. Conceptually, the L3 corresponds to a `Questionnaire`; each daily check is transmitted as a `QuestionnaireResponse`, and the classification additionally as an `Observation`. Details: [08 L3 architecture](08-l3-architecture.md).

---

**Related documents:** [03 L1](03-l1-guidelines-and-evidence.md) · [06 Decision Logic](06-l2-decision-logic.md) · [08 L3](08-l3-architecture.md)
