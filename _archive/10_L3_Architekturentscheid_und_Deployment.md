# WundCheck — L3-Architekturentscheid & Deployment-Überlegungen

**Reaktion auf Tag 3 (Digitalisation – L3 development, Delcroix/Pereira, Swiss TPH).**
Dieses Dokument begründet unsere L3-Formatwahl gegen die Kriterien aus der Vorlesung und
sammelt die Deployment-Punkte für die Implementation-/M&E-Strategie. → In die Präsentation
gehört davon: 1 Folie Architektur-Entscheid, 1–2 Folien Implementation.

---

## 1. Unser L3 gegen die Anforderungen aus Tag 3

Die Vorlesung definiert: Ein L3 muss *structured*, *containing workflow rules*, *machine readable*
sein und *sollte* software-neutral sein, auf Terminologie beruhen und Interoperabilitäts-Standards
nutzen. So schneidet unser L3 (JSON) ab:

| Anforderung (Tag 3) | WundCheck-L3 | Status |
|---|---|---|
| Structured | JSON-Schema: elements / sections / decision_rules | ✅ |
| Workflow rules / "code" | relevant, calculation, constraint, when-Regeln (worst-first) | ✅ |
| Machine readable | JSON, direkt vom L4 konsumiert; L3-Wechsel ohne Code-Änderung | ✅ |
| Software neutral | **Eigenformat** — nicht direkt von ODK/CHT/FHIR-Engines ausführbar | ⚠️ bewusster Trade-off (Kap. 2) |
| Rely on terminology | LOINC/SNOMED/ICD-10-Mappings pro Datenelement | ✅ (teilweise, Codes z.T. offen) |
| Interoperability standards | Export als FHIR R4 QuestionnaireResponse + Observation | ✅ an der Schnittstelle |

## 2. Der Architektur-Entscheid: Warum Custom-JSON statt XLSForm/FHIR?

Die Vorlesung fordert genau diese Diskussion ein („Even aspects that could sound straightforward
such as having a L3 based on software neutral standard **should be discussed**"). Unser Entscheid:

**Custom-JSON als Authoring-Format, FHIR an der Schnittstelle.**

Begründung (Argumente aus den Folien selbst):

- **Human-readable Authoring:** Die Folien nennen als FHIR-Schwäche: „FHIR resources are not
  human readable making review and maintenance challenging". Unser JSON liest sich fast wie das
  L2-Excel — jede Regel ist eine Zeile, klinisch reviewbar. Bei einem 6-Tage-Projekt mit
  Nicht-FHIR-Experten ist das der entscheidende Faktor (vgl. Folie „Available skill sets").
- **XLSForm passt nicht ganz auf unseren Fall:** Die Folien zeigen ein reales XLSForm mit der
  Frage „Wrong tool for the purpose?". Unsere Kern-Interaktion (anklickbare Wundbild-Karten für
  Laien, eingebettete Grafiken, patientengerechtes Ampel-Layout) ist in ODK-Standard-Widgets
  nur eingeschränkt abbildbar — das L4 hätte das UX diktiert (vgl. „L4 constraints on L3").
- **Die Folien erlauben das explizit:** „Authored L3 could be tailored for human authoring while
  not being fully machine-readable [standard]" und „L3 might be used as-is in the L4, **or might be
  translated** to match the target application". Genau das tun wir: Authoring im einfachen Format,
  **Übersetzung in den Standard an der Grenze** (FHIR-Bundle-Export = QuestionnaireResponse +
  Observation). Konzeptionell entspricht unser L3 1:1 einer FHIR Questionnaire
  (elements→item, relevant→enableWhen, options→answerOption).
- **Grenzen, die wir transparent benennen (Q&A!):** Kein Ökosystem vorhandener Engines kann
  unser L3 direkt ausführen; Konvertierung nach FHIR Questionnaire wäre ein späterer Schritt
  („automatic conversion", vgl. pyFHIR-SDC-Folie). Unsere Expression-Sprache ist JS-nah statt
  CQL. Für ein nationales Rollout würden wir auf den WHO-SMART-IG-Weg (FHIR + CQL) migrieren —
  für den Prototyp wäre das Overengineering gewesen.

**Ein-Satz-Zusammenfassung für die Folie:** *„Wir authoren im einfachen, klinisch reviewbaren
JSON und sprechen Standards an der Schnittstelle — bewusster Trade-off zwischen
Software-Neutralität und Wartbarkeit/Skills, wie in der Vorlesung gefordert diskutiert."*

## 3. Unsere Artefakte im Vokabular des „L3 Implementation Package"

Tag 3 definiert das L3-Paket breiter als nur die Formulardatei. Mapping auf unsere Deliverables
(so in der Präsentation benennen!):

| Package-Komponente (Tag 3) | Unser Artefakt |
|---|---|
| Documentation (Process, Persona, Use cases) | 08_Personas_Szenarien_Schnittstellen.docx, 07/09 BPMN |
| Content / Workflow (Sequencing, Logic) | 03_L3_definition.json (sections, relevant, Regeln worst-first) |
| Terminology | Standards-Mappings im Data Dictionary + L3 (LOINC/SNOMED/ICD-10) |
| Validation (Tests, Testdata, Conformance) | Blatt „Testfaelle" (T1–T10) + automatisierte Browser-Tests |
| Interfaces / Interoperability | FHIR-Export (QuestionnaireResponse + Observation), Alert-Konzept |
| UI/UX | Bild-Antwortoptionen, Ampel-Darstellung, Sektionen-Gruppierung |

## 4. L3-Updates & Versionierung (Folie „Navigating L3 updates")

- L3 trägt eine **Versionsnummer** (meta.version) + neu ein **Changelog** (meta.changelog);
  die App zeigt die geladene Version im Header — Nachvollziehbarkeit, welche Regelversion
  eine Empfehlung erzeugt hat (auch im FHIR-Export: questionnaire = "WundCheck-L3-vX").
- Downstream-Effekte bei Änderungen (aus der Vorlesung, auf uns gemünzt): Ein entferntes
  Datenelement muss aus allen relevant/calculation/when-Ausdrücken entfernt werden; neue
  Elemente brauchen ggf. neue Regeln; geänderte Grenzwerte erfordern erneutes Durchlaufen
  der Testfälle T1–T10 (**Regressionstest = unser QA-Blatt**).
- Prozessvorschlag: Änderung im L2-Excel → Review durch „Clinical Lead" → Übertrag ins L3 →
  Testfälle ausführen → Version hochzählen + Changelog-Eintrag.

## 5. Deployment-Überlegungen (Input für Implementation-/M&E-Strategie, Montag)

Externe Faktoren aus Tag 3, konkretisiert für WundCheck:

- **Regulation on health technology:** Patientengerichtete Triage-App = Software als
  Medizinprodukt (CH: MepV/MDR-Logik; Klasse abhängig von Claim). Für den Prototyp:
  Disclaimer + „nicht für klinische Anwendung"; im echten Rollout: Konformitätsbewertung,
  Risikomanagement (ISO 14971), klinische Bewertung. → passt zu Freitag (Regulation).
- **National terminology / Share medical record:** CH-Kontext: Anbindung ans EPD
  (elektronisches Patientendossier) via FHIR; SNOMED-CT-Lizenzlage beachten.
- **Interoperability requirements:** KIS-seitig FHIR-R4-Endpunkt oder Inbox für
  Communication-Alerts; Fallback: täglicher Export als PDF/CSV an die Praxis.
- **Infrastructure available:** App ist ein einzelnes HTML-File, läuft offline im Browser —
  bewusst low-resource-tauglich; Verteilung z.B. als Link/QR-Code bei Entlassung;
  Offline-Queue für FHIR-Übermittlung nötig (Diskussionspunkt).
- **Available skill sets:** Wartung des L3 durch klinisches Personal mit Excel/JSON-Basiskenntnissen
  möglich (genau dafür das einfache Format); kein FHIR-Spezialist für Inhalts-Updates nötig.
- **Stakeholder-Kollaboration** (Folie „each must be slightly out of their comfort zone"):
  in unserer Gruppe gespiegelt durch die Rollen Clinical Lead ↔ L2 Lead ↔ Tech Lead ↔ QA Lead —
  der L1→L2→L3-Übergabeprozess ist unser Mini-Beispiel dieser Zusammenarbeit.

## 6. Offene Punkte für die Gruppe

1. Kruste-SNOMED-Code nachschlagen und eintragen (L2 + L3).
2. 1–2 weitere Datenelemente ergänzen (Ziel 30–50; aktuell 29).
3. Entscheid dokumentieren, ob wir zusätzlich eine FHIR-Questionnaire-Konvertierung als
   „Ausblick" zeigen (nice-to-have, kein Muss).
4. Heutige Gruppenarbeit (Pseudo-Code Dehydration + ODK-Übung) ist Kurs-Übung — Erkenntnisse
   daraus ggf. als Vergleich XLSForm vs. unser JSON in die Präsentation einbauen.
