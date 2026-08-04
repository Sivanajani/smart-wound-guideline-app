# CDSS Mini-Projekt — Starterpaket & Projektplan

**FHNW MSc Medical Informatics · CDSS Modul · Abgabe & Präsentation: Di 4.8.2026**

---

## 1. Architektur-Entscheid (Vorschlag für die Gruppe)

Wir bauen eine **selbst programmierte React-Web-App (L4)**, die ihre komplette Logik aus einer
**L3-JSON-Datei** einliest. Das heisst:

- **Kein Hard-Coding** der Fragen/Logik in der App → erfüllt die explizite Empfehlung des Assignments
  („Hard coded application will be accepted, but are ideally avoided")
- Fragen, Antwortoptionen, Conditional Logic (`relevant`), Berechnungen (`calculation`),
  Constraints und Decision Rules stehen **alle im JSON** "SDK FOR FHIR with the gudiliens"
- **Killer-Argument für die Q&A:** Live zeigen, dass eine Änderung im L3-JSON die App
  verändert, ohne eine Zeile Code anzufassen. Genau das ist der Punkt des Layer-Modells.

```
L1 (Guideline, z.B. WHO)  →  L2 (BPMN + Data Dictionary + Decision Table, Excel)
                          →  L3 (cdss-definition.json — maschinenlesbar)
                          →  L4 (React-App, rendert L3 dynamisch)
```

Das mitgelieferte L3 ist bereits ein **Entwurf für euren Use Case „WundCheck"**:
tägliche Wundkontrolle durch den Patienten nach OP mit Nahtverschluss (Ampel:
normal / Infektionsverdacht / Notfall). Besonderheit: Der Patient wählt den Wundzustand
über **anklickbare Grafiken** („so sieht es heute aus") statt Foto-Analyse — strukturierte
Daten statt ML, funktioniert auch bei Sprachbarrieren / geringer Gesundheitskompetenz.
Die Grafiken in `06_Grafiken/` sind schematische Platzhalter zum Ersetzen durch eigene
Zeichnungen (im L3 als Data-URLs eingebettet).

---

## 2. Use Case wählen — Entscheidungshilfe

### Kriterien für einen guten (eigenen) Use Case

Ein Use Case funktioniert für dieses Assignment, wenn er ALLE fünf Kriterien erfüllt:

1. **Es existiert eine klare, zitierfähige Leitlinie (L1)** — WHO, nationale Guideline oder
   Fachgesellschaft. Ohne dokumentiertes L1 könnt ihr die geforderte L1→L2-Reflexion nicht schreiben.
2. **30–50 Datenelemente sind natürlich erreichbar** — Anamnese + Vitalzeichen + Symptome
   + abgeleitete Werte. Nicht zu klein (Fieberthermometer-App) und nicht zu gross (ganze Onkologie).
3. **Echte Entscheidungslogik** — mindestens eine Klassifikation/Empfehlung mit mehreren
   Regeln (Decision Table), nicht nur Datensammlung.
4. **Abgeleitete Elemente möglich** — z.B. BMI, Score, Alter aus Geburtsdatum, Risikokategorie.
5. **In 10 Minuten demonstrierbar** — ein Durchlauf Patient→Empfehlung in < 2 Minuten.

### Shortlist (bewährt, wenig Risiko)

| Use Case | L1-Quelle | Stärken | Risiko |
|---|---|---|---|
| IMCI: Kind mit Husten/Fieber | WHO IMCI Chart Booklet | Im Kurs geübt (Tag 2), klare Klassifikationen (pink/gelb/grün) | Umfang begrenzen! |
| Hypertonie-Screening | WHO HEARTS | Einfache Messlogik, viele derived elements (BMI, CVD-Risiko) | evtl. „zu einfach" → mit Risiko-Score anreichern |
| Schwangerschaftsvorsorge (ANC) | WHO ANC + offizielles SMART DAK | Fertige Decision Tables als Vorlage (DAK kopierbar) | Umfang begrenzen |
| Notfall-Triage | WHO/ICRC Triage-Systeme | Dankbare Demo (Rot/Gelb/Grün) | Datenelemente evtl. knapp unter 30 |

### Eigener Use Case?

Gerne — prüft ihn gegen die 5 Kriterien oben. Typische Ideen, die funktionieren:
Diabetes-Screening (WHO PEN), Depression-Screening (PHQ-9 + Behandlungspfad),
Antibiotika-Auswahl bei Harnwegsinfekt (nationale Guideline), Sturz-Risiko-Assessment
im Spital (Morse Fall Scale + Massnahmen), Impf-Empfehlung nach Alter/Vorerkrankung.

Ideen, die NICHT passen: Drug Discovery, reine Datenanalyse/ML ohne Guideline,
alles ohne klaren Point-of-Care-Entscheid.

**→ Entscheidet den Use Case spätestens morgen (Mi 29.7.) in der Gruppe.**
Jeder Tag ohne Entscheid frisst L2-Zeit.

---

## 3. Zeitplan bis zur Abgabe

Der Kursplan hilft euch: Die Vorlesungsthemen passen jeweils genau zu dem, was ihr an dem Tag
fürs Projekt braucht.

| Tag | Kurs-Thema | Projekt-Todo (abends, ~2h p.P.) |
|---|---|---|
| **Di 28.7.** (heute) | Clinical algorithm development | Gruppe bilden, Starterpaket teilen, Use-Case-Kandidaten sammeln |
| **Mi 29.7.** | Digitalisierung (L3!) | **Use Case fixieren.** Health need + Personas + 2 Szenarien schreiben. L1-Guideline besorgen |
| **Do 30.7.** | Standards & FHIR | L2: Data Dictionary füllen (30–50 Elemente), Standards-Mapping (LOINC/SNOMED/ICD-10), BPMN-Workflow zeichnen |
| **Fr 31.7.** | Testing & Regulation | L2: Decision Table fertig. L3-JSON aus L2 ableiten. App rendert ersten echten Inhalt |
| **Sa/So 1.–2.8.** | — | L4 fertigstellen, QA-Testing (Testfälle L2→L4), Bugs fixen, L1→L2-Challenges dokumentieren |
| **Mo 3.8.** | Implementation & M&E | Implementierungs-/M&E-Strategie schreiben (Input aus Vorlesung!), Folien bauen, Demo aufnehmen (Backup) |
| **Di 4.8. vormittags** | Praktikum/Tutorial | Feinschliff mit Tutoren, Präsentation proben (10 Min hart timen!) |
| **Di 4.8. 14:00** | **Assessment** | Präsentation + Q&A |

### Rollenvorschlag (4 Personen — anpassen bei 3)

| Rolle | Verantwortung | Präsentiert |
|---|---|---|
| Clinical Lead | L1-Guideline, Health Need, Personas/Szenarien, L1→L2-Challenges | Need, Personas, L1 |
| L2 Lead | BPMN, Data Dictionary, Decision Table, Standards-Mapping | L2 + Challenges |
| Tech Lead (du?) | L3-JSON-Schema, React-App, Demo | L3/L4 + Demo |
| QA & Implementation Lead | Testkonzept, Testfälle, Bugfixing-Doku, Implementation/M&E, Impact | QA + M&E + Impact |

Alle Rollen liefern zu; die Aufteilung dient v.a. der „individual contribution"-Folie (20% der Note!).

---

## 4. Abgabe-Checkliste (4.8.)

- [ ] Präsentationsfolien (10 Min, alle präsentieren, letzte Folie: individuelle Beiträge)
- [ ] L2: BPMN-Workflow-Diagramm
- [ ] L2: Data Dictionary (30–50 Elemente, Conditional Logic, derived elements, Standards-Mapping)
- [ ] L2: Decision Table (WHO-DAK-Stil)
- [ ] L2: Doku der L1→L2-Übersetzungs-Challenges
- [ ] L3: JSON-Datei + kurze Doku des Schemas
- [ ] L4: App-Zugang ODER aufgezeichnete Demo (Backup-Video immer machen!)
- [ ] QA: Testkonzept + durchgeführte Testfälle + behobene Issues
- [ ] Implementation-, Monitoring- & Evaluationsstrategie
- [ ] Expected Impact (positiv UND negativ)

---

## 5. Dateien in diesem Paket

| Datei | Inhalt |
|---|---|
| `01_Projektplan_und_UseCase.md` | Dieses Dokument |
| `02_L2_Vorlagen.xlsx` | Data Dictionary + Decision Table + Testfälle (Excel, mit Beispielzeilen) |
| `03_L3_definition.json` | L3: Maschinenlesbare CDSS-Definition (Beispiel: Hypertonie-Screening) |
| `04_L4_cdss_app.html` | L4: React-App (selbst-enthaltend, React eingebettet) — einfach im Browser öffnen |
| `05_L4_source_app.jsx` | Lesbarer React-Quellcode der App (zum Weiterentwickeln) |
| `06_Grafiken/` | Wundzustands- und Sekret-Grafiken (SVG) — Platzhalter, durch eigene Zeichnungen ersetzen |
| `07_BPMN_Workflow.*` | High-Level-Workflow (BPMN): Patient / App / Praxis / EHR — .bpmn editierbar in bpmn.io/Camunda |
| `08_Personas_Szenarien_Schnittstellen.docx` | Health Need, 3 Personas, 2 Szenarien, FHIR-Schnittstellen-Konzept |
| `09_BPMN_App_Detailprozess.*` | Detail-BPMN in der App: Validierungsschleife + worst-first Gateway-Kaskade (= Decision Logic diagrammatisch) |

**App starten:** `04_L4_cdss_app.html` doppelklicken (lädt eingebettetes L3) oder über
„L3-Datei laden" ein eigenes JSON laden. Kein Server, kein Build nötig — läuft überall,
auch komplett offline (low-resource friendly, gutes Argument für die Präsentation).

**App weiterentwickeln:** `05_L4_source_app.jsx` bearbeiten, dann neu bündeln mit
`npx esbuild 05_L4_source_app.jsx --bundle --minify --define:process.env.NODE_ENV='"production"' --outfile=bundle.js`
(benötigt Node.js; React 18/19 via `npm install react react-dom`) und den `<script>`-Block
in der HTML-Datei durch den neuen Bundle-Inhalt ersetzen. Für reine **Inhalts**-Änderungen
(neue Fragen, Regeln, Use Case) müsst ihr NICHT neu bauen — nur das L3-JSON anpassen.
Das ist der Kern des Layer-Arguments für eure Präsentation.
