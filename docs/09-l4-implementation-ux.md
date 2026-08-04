# 09 · L4 — Executable Layer & UX

> **Assignment:** *“Implement the executable (end-user) layer (L4): Choose appropriate technology for implementation compatible with the L3 developed. Think about user interface considerations — what will make the system more or less acceptable and usable to end-users."*

---

## 9.1 Technology Decision

| Option | Offline | Installation | Image UI freely designable | Cost | Effort | Decision |
|---|---|---|---|---|---|---|
| **ODK Collect** (Android) | ✅ | app store required | ⚠️ limited | free | low | ❌ |
| **Enketo / web form** | ⚠️ partly | none | ⚠️ limited | free | low | ❌ |
| **Native app** (iOS/Android) | ✅ | app store required | ✅ | free | high | ❌ |
| **Self-contained web app** (single HTML file, no framework) | ✅ | **none** | ✅ | free | medium | ✅ |

### Rationale

**No installation.** Persona 1 (58 years old, medium tech literacy, recently operated on) should be able to scan a QR code at hospital discharge and start using the app immediately. Every obstacle — app store, account, update — costs adherence, and adherence is the critical variable for a *daily* check.

**Full control over the image interaction.** The large-format wound appearance cards are not decoration but the central clinical solution to the translation problem ([C-01](07-l2-l1-to-l2-challenges.md)). With standard ODK widgets, the L4 would have dictated the UX — precisely the anti-pattern that Day 3 describes under “L4 constraints on L3".

**Offline as the default state, not as a feature.** The app is a single HTML file with the L3 and all graphics embedded — no framework, no bundle, no network fetch. After the first load it runs without any network connection at all. For home-based aftercare this is not an optimisation but a prerequisite (NFR-2).

**The price:** we forgo an existing ecosystem (server infrastructure, user management, synchronisation mechanisms of ODK Central). For a prototype this is acceptable; for a rollout a synchronisation layer would have to be added ([11 Implementation](11-implementation-monitoring-evaluation.md)).

---

## 9.2 How the L4 Executes the L3

```
wundcheck-app.html          (single file, ~56 KB, no dependencies, no build step)
   ├── L3 loader ──────────► embedded L3, or any JSON via "Load L3 file"
   ├── Access gate ────────► validates the code and seeds the baseline from meta.access
   ├── Renderer ───────────► builds the questions from elements[], grouped by sections[]
   ├── i18n ───────────────► language switch from meta.languages, label[lang]
   ├── Expression engine ──► evaluates relevant / calculation / constraint
   ├── Rule engine ────────► evaluates decision_rules[] worst-first, in two passes
   ├── L3 inspector ───────► version, editable thresholds, derived values, history
   └── FHIR export ────────► QuestionnaireResponse + Observation as a bundle
```

**The app contains not a single clinical statement.** No threshold, no question and no recommendation is hard-coded. Using the **“Load L3 file"** (“L3-Datei laden") button, any other L3 can be loaded — the app would then represent an entirely different CDSS.

> **Demo proof:** change `meta.thresholds.fever_orange` from `38.0` to `37.5`, reload the app, enter the same case → the result switches from GREEN to ORANGE. Without a rebuild, without a developer, without a single line of code.

---

## 9.3 UX Decisions

| Decision | Rationale | Persona |
|---|---|---|
| **Image selection instead of description** for wound appearance and discharge | Overcomes language and educational barriers; produces structured, comparable data instead of free text | Peter |
| **One question per screen**, large touch targets | Small screens, reading glasses, possibly impaired fine motor skills after surgery | Peter |
| **Baseline data only on first use** (gateway “First use?" / “Erste Nutzung?") | Daily use must stay under 3 minutes (NFR-3), otherwise adherence collapses | Peter |
| **Sequence follows patient logic**, not guideline structure | First “how am I feeling", then “what does the wound look like" — inspecting the wound requires opening the dressing and therefore comes last | Peter |
| **Colour-coded traffic light + plain-language action** | Colour alone is neither accessible (colour vision deficiency) nor action-guiding. Every colour is accompanied by a concrete sentence: “Contact your practice **today**" (“Kontaktieren Sie **heute** Ihre Praxis") | Peter |
| **The result states the reason**, not just the level | Counteracts automation bias: the patient should be able to follow the reasoning behind the recommendation rather than obey it blindly. “Because of the erythema extending beyond the wound edge…" (“Wegen der Rötung über den Wundrand hinaus…") | Peter |
| **Reassurance carries equal weight** to warning | A CDSS that only warns forfeits half of its benefit ([Scenario A](02-personas-and-scenarios.md)) | Peter |
| **Constraint messages in everyday language** | “Plausible temperature: 34–43 °C" (“Plausible Temperatur: 34–43 °C") instead of “Validation error: value out of range" | Peter |
| **The alert contains context, not just a status** | Sandra must be able to triage within 10 seconds: classification, triggering rule, vital signs, 7-day trend | Sandra |
| **Alerts only for ORANGE/RED** | An alert for every submission would cause alert fatigue in the practice — and then nothing at all gets read | Sandra |
| **Version visible in the header** | It remains traceable which rule version produced a given recommendation | Anna |

### What We Deliberately Did *Not* Build

| Omitted | Why |
|---|---|
| **Photo upload / image analysis** | Image quality, lighting and skin type vary considerably; ML decisions require explanation; regulatory demands are considerably higher. Structured image selection delivers comparable data without these problems |
| **User accounts / passwords** | An obstacle at first use. Replaced by the access code described in [9.5](#95-access-code--binding-a-check-to-a-person) — a token-based assignment without a password, without an account and without an app store |
| **Push notifications** | Requires a native app or a service worker plus server. In the prototype this is replaced by the reminder given during the discharge consultation |
| **Multilingual support** | Provided for in the L3 (`meta.language`, label structure), but only `de` is populated. Essential for a rollout, not for the prototype |
| **A real HIS connection** | The FHIR export produces a valid bundle as a download — the interface is demonstrated without a hospital information system being required |

**This is scope discipline, not a gap.** The assignment explicitly places quality above completeness.

---

## 9.4 FHIR Interface

The interface is **not** a file download. The app builds an R4 **transaction bundle** and POSTs it to the endpoint configured in the L3.

| Artefact | FHIR resource | Purpose | When |
|---|---|---|---|
| Form definition | `Questionnaire` *(conceptually — our L3)* | Structure, questions, visibility logic | — |
| Daily check | **`QuestionnaireResponse`** | All answers, typed (`valueInteger`, `valueDecimal`, `valueDate`, `valueCoding`), canonical reference carries the L3 version | every run |
| Classification | **`Observation`** | Traffic-light result, Southampton grade, triggering rule, L3 version, days post-op — displayable in the HIS as a trend curve without opening the individual answers | every run |
| Alert | **`Communication`** | Structured notification to the practice, `priority: urgent` (ORANGE) or `stat` (RED) | **only** ORANGE/RED |

```jsonc
// meta.fhir in the L3 — configuration, not code
"fhir": {
  "version": "R4",
  "endpoint": "https://hapi.fhir.org/baseR4",      // point at the hospital server or the EPD gateway
  "questionnaire_canonical": "http://wundcheck.example/Questionnaire/wundcheck",
  "patient_reference": "Patient/example",
  "alert_recipient": "Organization/practice",
  "send_mode": "transaction"
}
```

**The endpoint is a piece of L3 configuration.** Redirecting WundCheck from the test server to a hospital FHIR server or the Swiss EPD gateway means editing one line of JSON — not a single line of app code changes. That is the same argument as for the thresholds, applied to the interface.

**Offline first.** *Send to patient record* posts the bundle. If the endpoint is unreachable, the bundle goes into an outbound queue, the queue length is visible in the L3 inspector, and *Retry queue* flushes it. The classification and the recommendation are shown to the patient regardless — transmission failure must never block care advice. *Download FHIR bundle* remains available as a fallback and for the demo.

**Alerts only from ORANGE upwards.** A `Communication` is generated only for ORANGE and RED. GREEN and YELLOW are written into the record but do not notify anyone — this is the alert-fatigue mitigation from [12](12-impact-and-regulation.md), implemented in code rather than merely promised in prose.

**Conformance-tested.** [`tools/check-fhir.mjs`](../tools/check-fhir.mjs) extracts the bundle builder from the app and checks 20 R4 shape rules — see [10 §10.5](10-qa-testing.md). A sample bundle is in [`submission/example-fhir-bundle.json`](../submission/example-fhir-bundle.json).

### Why no framework at all

The first version used React with an esbuild bundle. We replaced it with plain JavaScript for three reasons:

1. **No build step.** A content change to the L3 was already rebuild-free — but changing the *rendering* required Node, npm and a bundler. The whole L4 is now one file that opens in any editor.
2. **Reviewability.** The application is roughly 480 lines of readable JavaScript. A maintainer can verify for themselves that it holds no clinical logic — which is exactly the claim we make in [08](08-l3-architecture.md), and which [`tools/check-hardcoding.mjs`](../tools/check-hardcoding.mjs) enforces automatically.
3. **Longevity.** No dependency can go stale, become vulnerable or disappear. For a tool meant to be maintained by a clinical department rather than a software team, that outweighs developer convenience.

The price: no component ecosystem, everything hand-written. At this size that is a good trade.

---

### Interoperability level achieved

Measured against the four levels from Lecture Day 4:

| Level | Achieved? | Reasoning |
|---|---|---|
| **1 Foundational** | ✅ | Data exchange is technically possible — the app POSTs a bundle to a FHIR endpoint |
| **2 Structural** | ✅ | FHIR R4 resources with a defined structure; typed answers; versioned canonical |
| **3 Semantic** | ⚠️ **partial** | 38 of 48 elements carry a terminology binding. Full semantics would require complete mapping and a resolved SNOMED CT licensing position |
| **4 Organisational** | ❌ | Governance, consent management, the legal framework and process integration are not addressed |

The honest answer: **structurally yes, semantically partly, organisationally no.**

---

## 9.5 Access Code — Binding a Check to a Person

Up to L3 v0.3.4 the app was anonymous: anyone opening the file got an empty form. That is fine for a rendering demo but wrong as a care model — a wound check that is not tied to a person cannot be filed in a record, and an alert without a sender cannot be triaged by Sandra.

### The design constraint

Persona 1 rules out the obvious answer. Peter Brunner has **“no willingness to install an app or create an account"** ([02](02-personas-and-scenarios.md)), and NFR-1 turns that into a requirement. A login with e-mail and password would buy identification at the cost of the very adherence the whole project depends on.

**The access code resolves this tension.** The practice issues a code with the discharge papers — the same moment at which the QR code for the app is handed over. The patient types it in once. There is no account to create, no password to remember, no app store, no e-mail address.

| | Login | Access code |
|---|---|---|
| Registration step | ✅ required | ❌ none |
| Password to remember | ✅ | ❌ |
| Works from a printed discharge letter | ❌ | ✅ |
| Binds the check to a person | ✅ | ✅ |
| Withstands a determined attacker | ✅ | ❌ *(see below)* |

### What the code does

```jsonc
// meta.access in the L3 — configuration, exactly like the FHIR endpoint
"access": {
  "enabled": true,
  "codes": [{
    "code": "WC-2026-0417",
    "name": "Peter Brunner",
    "prefill": { "pat_name": "Peter Brunner", "op_date": "today-4", "diabetes": 0, … }
  }]
}
```

Each code carries a **`prefill` map from element id to value**. On unlock, the app writes those values into the answers — which is how the once-only sections (surgery details, risk factors) arrive pre-filled from the practice rather than being retyped by a patient four days after an operation. The L4 iterates the map generically; it still knows no element by name, and [`tools/check-hardcoding.mjs`](../tools/check-hardcoding.mjs) still passes.

Dates in a `prefill` may be written **relative to the current day** (`"today-4"`). A fixed date would silently drift: presented three weeks later, `days_post_op` would be 25 instead of 4, and the day-dependent rules R6a and R5 would no longer demonstrate what they are supposed to demonstrate.

Locking clears the answers as well. The prototype is shown on a shared laptop, and leaving one person's entries on screen for the next user is the wrong default.

### The honest limitation

> **This is identification, not authentication.** The codes live in the L3 and are checked in the browser. Anyone who opens the page source can read every valid code. It binds a check to a person; it does not defend that binding against someone who wants to break it.

For the prototype this is a deliberate and stated trade-off — the demo has to run offline from a single file, with no server to ask. A production system would change three things: the code is issued **per episode of care** and expires with it, it is verified **server-side** so the list never reaches the client, and it is paired with a second factor for anything beyond the patient's own record. None of that changes the L4: `meta.access` would point at a verification endpoint the same way `meta.fhir` points at a FHIR server today.

The regulatory consequence is covered in [12 Impact & Regulation](12-impact-and-regulation.md).

---

## 9.6 Open Points

- [x] New elements and rules from [05](05-l2-data-dictionary.md)/[06](06-l2-decision-logic.md) implemented in the L3 and tested (19/19)
- [x] Outbound queue for pending FHIR transmissions implemented
- [x] Application rebuilt without a framework — no build step, no dependencies
- [ ] Wound graphics are schematic placeholders; they should be redrawn against the Southampton grades and for more than one skin tone
- [ ] A graphic for `redness_extent` (5 levels) is still missing — the question is currently text-only
- [ ] Third language for the pilot population

---

**Related documents:** [08 L3](08-l3-architecture.md) · [10 QA](10-qa-testing.md) · [11 Implementation](11-implementation-monitoring-evaluation.md)
