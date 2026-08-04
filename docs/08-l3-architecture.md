# 08 · L3 — Machine-readable Layer: Architecture & Schema

> **Assignment:** *“Develop the machine-readable code (L3) — translate the L2 into an L3 … Consider user experience (e.g. sequence and grouping of your questions), maintainability of your code and data quality (e.g. constrain rules)."*

---

## 8.1 The Architecture Decision

**We author the L3 in our own, clinically readable JSON format and speak standards at the interface.**

Lecture Day 3 explicitly calls for this discussion: *“Even aspects that could sound straightforward such as having a L3 based on software neutral standard should be discussed."* Here is our rationale.

### Options Compared

| Option | Advantages | Disadvantages | Decision |
|---|---|---|---|
| **XLSForm / ODK** | Established standard, executable by existing engines (ODK Collect, Enketo), covered in the course | Standard widgets represent our core interaction (large-format image cards for laypersons, traffic-light presentation of results) only to a limited extent — the L4 would have dictated the UX | ❌ |
| **FHIR Questionnaire + CQL** | Full interoperability standard, WHO SMART compliant, future-proof | *“FHIR resources are not human readable, making review and maintenance challenging"* (slide, Day 3). In a 6-day project without FHIR expertise, not reviewable by the clinically responsible person | ❌ |
| **Hardcoding in the app** | Fastest route to a prototype | Explicitly named by the assignment as the inferior option; every rule change requires a developer plus a rebuild | ❌ |
| **Custom JSON + FHIR at the interface** | Reads almost like the L2 — every rule is one line, clinically reviewable. Full control over the UX. Standards where they count: in data exchange | No ecosystem of existing engines can execute it directly. The expression language is JS-like rather than CQL | ✅ |

### Why This Is Legitimate

The lecture explicitly permits this route:

> *“Authored L3 could be tailored for human authoring while not being fully machine-readable [standard]"*
> *“L3 might be used as-is in the L4, **or might be translated** to match the target application"*

That is exactly what we do: **authoring in the simple format, translation into the standard at the boundary.** Conceptually, our L3 corresponds one to one to a FHIR `Questionnaire`:

| Our L3 | FHIR Questionnaire |
|---|---|
| `elements[]` | `item[]` |
| `relevant` | `enableWhen` |
| `options[]` | `answerOption[]` |
| `constraint` | `item.extension[maxValue/minValue]` |
| `sections[]` | `item[type=group]` |

### Limits We Disclose

- No existing CDSS ecosystem can execute our L3 directly. An automatic conversion to FHIR Questionnaire would be a possible next step.
- Our expression language is not CQL. For a national rollout the WHO SMART route (FHIR + CQL) would be the right one — for a prototype it would have been overengineering.
- The software neutrality that Day 3 names as a target criterion is **not** something we achieve fully. This is a deliberate trade-off in favour of maintainability and available skills.

**One sentence for the slide:**
> *“We author in simple, clinically reviewable JSON and speak standards at the interface — a deliberate trade-off between software neutrality and maintainability, discussed as required in the lecture."*

---

## 8.2 Assessment Against the L3 Requirements from Day 3

| Requirement | WundCheck L3 | Status |
|---|---|---|
| **Structured** | JSON schema: `meta` / `sections` / `elements` / `decision_rules` | ✅ |
| **Contains workflow rules** | `relevant`, `calculation`, `constraint`, `when` rules in worst-first order | ✅ |
| **Machine readable** | JSON, consumed directly by the L4; L3 can be swapped without a code change | ✅ |
| **Software neutral** | Proprietary format — not executable by ODK/CHT/FHIR engines | ⚠️ deliberate trade-off |
| **Rely on terminology** | SNOMED CT / LOINC / ICD-10 bindings per data element (21 of 48) | ✅ partly |
| **Use interoperability standards** | Export as FHIR R4 `QuestionnaireResponse` + `Observation` + `Communication` | ✅ at the interface |

---

## 8.3 Schema

```jsonc
{
  "meta": {
    "title":      "WundCheck — Daily wound check after surgery",
    "version":    "0.3.3",
    "languages":  ["en", "de"],
    "default_language": "en",
    "language":   "de",
    "l1_sources": [ /* CDC/NHSN, NICE NG125, Southampton, Campwala et al. */ ],
    "disclaimer": "Study prototype FHNW MSc MI – not for clinical use.",
    "thresholds": {
      "fever_orange":            38.0,
      "fever_red":               39.0,
      "pain_high":               7,
      "normal_healing_days":     3,
      "discharge_prolonged_days": 3,
      "bmi_risk":                30
    },
    "changelog": [ { "version": "...", "date": "...", "changes": "..." } ]
  },

  "sections": [
    { "id": "stamm",     "title": "1 · Details of the operation (once)" },
    { "id": "risiko",    "title": "2 · Risk factors (once)" },
    { "id": "allgemein", "title": "3 · Daily check — general condition" },
    { "id": "wunde",     "title": "4 · Daily check — wound" }
  ],

  "elements": [
    {
      "id":          "temp",
      "de_id":       "DE-020",
      "section":     "allgemein",
      "type":        "decimal",
      "label":       { "en": "Body temperature today",
                     "de": "Körpertemperatur heute" },
      "required":    true,
      "constraint":  { "expr": "temp >= 34 and temp <= 43",
                       "message": { "en": "Plausible temperature: 34–43 °C.",
                                    "de": "Plausible Temperatur: 34–43 °C." } },
      "terminology": { "loinc": "8310-5" },
      "fhir":        "Observation.valueQuantity",
      "l1_source":   "CDC/NHSN — deep incisional SSI, fever >38 °C"
    },
    {
      "id":          "fever",
      "de_id":       "DE-021",
      "type":        "calculated",
      "calculation": "temp >= meta.thresholds.fever_orange",
      "label":       "Fever"
    },
    {
      "id":       "discharge_extent",
      "de_id":    "DE-037",
      "type":     "select_one",
      "relevant": "secretion >= 1",
      "label":    "Is the fluid coming from a small spot or along the whole wound?",
      "options":  [ { "value": 1, "label": "Small spot", "image": "assets/…" },
                    { "value": 2, "label": "Along the whole wound" } ]
    }
  ],

  "decision_rules": [
    {
      "id":         "R1",
      "decision":   "Wundstatus",
      "priority":   "red",
      "exclusive":  true,
      "when":       "temp >= meta.thresholds.fever_red or chills = 1",
      "output":     "EMERGENCY — High fever or chills: … (NOTFALL — Hohes Fieber oder Schüttelfrost: …)",
      "annotation": "Systemic signs of infection have the highest priority (worst-first).",
      "reference":  "CDC/NHSN SSI · sepsis red flags"
    }
  ]
}
```

### Field Semantics

| Field | Meaning |
|---|---|
| `de_id` / `id` | Traceability ID, identical to the [Data Dictionary](05-l2-data-dictionary.md) |
| `relevant` | Visibility condition — controls the conditional logic |
| `calculation` | Only for `type: calculated`; defines the derived element |
| `constraint` | Plausibility check with an error message understandable by laypersons; runs **before** rule evaluation |
| `terminology` | Code bindings (SNOMED CT / LOINC / ICD-10) |
| `fhir` | Target resource and element for the export |
| `l1_source` | Back-reference to the passage in the guideline |
| *label objects* | Every user-facing string is an object keyed by language code (`{ "en": …, "de": … }`). `meta.languages` lists the available languages, `meta.default_language` the default. Adding a language means adding a key — no code change |
| `exclusive` | `true` = part of the worst-first cascade · `false` = informational rule, fires in addition |

---

## 8.4 Naming Conventions

| Prefix / pattern | Use | Examples |
|---|---|---|
| `pat_*` | Patient master data | `pat_name`, `pat_dob`, `pat_age` |
| `op_*` | Details of the procedure | `op_date`, `op_site`, `op_duration_min` |
| `wound_*` | Wound findings | `wound_state`, `wound_open`, `wound_class` |
| `R1…R12` | Classification rules (exclusive) | worst-first |
| `I1…I5` | Informational rules (non-exclusive) | fire in addition |
| `DE-xxx` | Data element traceability | Data Dictionary ↔ L3 ↔ test |

Snake_case throughout. Every ID in the L3 is identical to the ID in the Data Dictionary — this is **binding**, because otherwise traceability breaks.

---

## 8.5 The L3 Implementation Package

Day 3 defines the L3 more broadly than just the form file. Mapping of our artefacts:

| Package component (Day 3) | Our artefact |
|---|---|
| **Documentation** — Process, Persona, Use Cases | [01 Health Need](01-health-need-and-scope.md) · [02 Personas](02-personas-and-scenarios.md) · [04 BPMN](04-l2-workflow-bpmn.md) |
| **Content / Workflow** — Sequencing, Logic Library | [`l3/wundcheck-l3.json`](../l3/wundcheck-l3.json) — `sections`, `relevant`, `decision_rules` |
| **Terminology** — ad-hoc concepts, external code systems | Terminology columns in the [Data Dictionary](05-l2-data-dictionary.md) and in the L3 |
| **Validation** — Tests, test data, Conformance Rules | [10 QA Testing](10-qa-testing.md) · test cases T1–T18 |
| **Interfaces / Interoperability** — Standard, Mapping, Transformation | FHIR export (`QuestionnaireResponse` + `Observation` + `Communication`) |
| **UI/UX** — Interfaces, Translations | Image answer options, traffic-light presentation, grouping into sections ([09 L4](09-l4-implementation-ux.md)) |

---

## 8.6 Versioning & Update Management

> Lecture Day 3: *“Navigating L3 updates"*

- The L3 carries a **version number** (`meta.version`) and a **changelog** (`meta.changelog`). The app displays the loaded version in the header.
- The FHIR export references the version (`questionnaire = "WundCheck-L3-v0.3.3"`) — this makes it traceable **which version of the rules** produced a recommendation. In the event of an incident, this is the decisive piece of information.

### Downstream Effects of Changes

| Change | What additionally has to be adapted |
|---|---|
| Data element removed | All `relevant`, `calculation` and `when` expressions that reference it |
| Data element added | Data Dictionary, possibly new rules, possibly new test cases |
| Threshold changed | Only `meta.thresholds` — **but**: full regression test T1–T18 |
| Rule added | Determine its position in the worst-first cascade, add a test case |

### Change Process

```
Guideline update
  └─▶ Adaptation in the L2 (Data Dictionary / Decision Table)
        └─▶ Review by the clinically responsible person
              └─▶ Transfer into the L3 JSON
                    └─▶ Regression test T1–T18
                          └─▶ Increment version + changelog
                                └─▶ Release
```

**This is the core of our maintainability argument:** a content change requires **no** developer and **no** rebuild. Only the step “transfer into the L3 JSON" touches a technical file — and that file is deliberately built so that a clinical professional with basic knowledge can read and change it.

---

## 8.7 What Lives in the L3 — and Why That Is Testable

Everything that could conceivably be called clinical or configurational sits in the L3:

| In the L3 | Consequence |
|---|---|
| Questions, answer options, images, visibility conditions | A new question is a JSON entry |
| Thresholds (`meta.thresholds`) with their sources | A guideline change is one line |
| Decision rules with priority, annotation and L1 reference | A new rule is a JSON entry |
| Terminology bindings **and** the code system URIs (`meta.terminology_systems`) | Switching from SNOMED to a national code system is configuration |
| FHIR endpoint, patient reference, canonical, alert recipient (`meta.fhir`) | Redirecting to a hospital server is one line |
| `Observation.code`, alert prefix, Observation components | The interface payload is declared, not coded |
| Which extras appear on the result badge (`meta.display`) | Presentation of derived values is declared |
| Which sections are captured once (`once` flag) | The app does not know which section is clinical |

The L4 knows only *types* (`select_one`, `calculated`, `date`), *structure* (sections, elements, rules) and *mechanics* (worst-first, two-pass, constraints before evaluation).

**And this is enforced, not merely claimed.** [`tools/check-hardcoding.mjs`](../tools/check-hardcoding.mjs) scans the application source for every element id, section id, rule id, threshold, code system URI, the endpoint and a clinical vocabulary list, and fails if any of them appears. See [10 §10.6](10-qa-testing.md) — the check found two genuine leaks on its first run.

---

## 8.8 Multilingualism

Every user-facing string in the L3 — labels, answer options, constraint messages, rule outputs, section titles, scope and disclaimer — is a language-keyed object:

```jsonc
"label": { "en": "Does a red streak run away from the wound?",
           "de": "Zieht ein roter Streifen von der Wunde weg?" }
```

`meta.languages: ["en", "de"]` declares which languages exist, `meta.default_language: "en"` sets the default. The app renders a language switch from this list and falls back to `en` for any missing key.

**A further language is a pure content change:** add the key to each string, add the code to `meta.languages`. No code change, no rebuild — the same argument as for the thresholds. For the target population (patients with language barriers) this is not a nice-to-have but a prerequisite for equitable access, see [12 Impact](12-impact-and-regulation.md).

*Current status: `en` complete, `de` complete. The clinical annotations, `reference` fields and `l1_source` remain English only — they are aimed at the maintaining team, not at patients.*

---

## 8.9 Open Points

- [x] All new elements (DE-006, DE-008–011, DE-016–018, DE-025, DE-027–028, DE-031–032, DE-037–038, DE-043–049) transferred into the L3
- [x] `meta.thresholds` introduced; every rule references a named constant
- [x] `southampton_grade` implemented as `calculated`
- [x] Rules R6a/R6b, R9–R12 and I5 added
- [x] `meta.l1_sources` replaced with the four actual sources
- [x] Bilingual labels (en/de), English as the default
- [x] `meta.fhir` — endpoint, canonical, alert recipient, Observation code — declared as configuration
- [x] Version `0.3.3`, changelog complete
- [ ] Automatic conversion to a FHIR `Questionnaire` — the route to full software neutrality, out of scope for the prototype

---

**Related documents:** [05 Data Dictionary](05-l2-data-dictionary.md) · [06 Decision Logic](06-l2-decision-logic.md) · [09 L4](09-l4-implementation-ux.md) · [11 Implementation](11-implementation-monitoring-evaluation.md)
