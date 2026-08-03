/* ================================================================
   L4: Ausführbare Schicht des Mini-CDSS
   FHNW MSc Medical Informatics · CDSS Modul 2026

   WICHTIG: Diese App enthält KEINE klinische Logik im Code.
   Fragen, Conditional Logic, Berechnungen, Constraints und
   Entscheidungsregeln kommen vollständig aus der L3-Definition
   (JSON im HTML eingebettet, per "L3-Datei laden" austauschbar).
   ================================================================ */
import React, { useState, useMemo } from "react";
import { createRoot } from "react-dom/client";

/* ---------------------------------------------------------------
   Expression-Engine
   Wertet die Ausdrücke aus dem L3 aus (relevant / calculation /
   constraint / when). Erlaubt eine L2-nahe Syntax:
     and, or, not, =   →   &&, ||, !, ==
   Hilfsfunktionen: ageYears(datum), round(x, stellen), today()
   Hinweis für die Doku: Für ein Produktivsystem würde man einen
   echten Parser (bzw. CQL) verwenden – für den Prototyp genügt
   eine kontrollierte Auswertung.
--------------------------------------------------------------- */
const HELPERS = {
  ageYears: (dob) => {
    if (!dob) return null;
    const d = new Date(dob), now = new Date();
    let a = now.getFullYear() - d.getFullYear();
    const m = now.getMonth() - d.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < d.getDate())) a--;
    return isNaN(a) ? null : a;
  },
  round: (x, n = 0) => (x == null || isNaN(x)) ? null : Math.round(x * 10 ** n) / 10 ** n,
  today: () => new Date().toISOString().slice(0, 10),
  // Tage seit einem Datum (z.B. Tage seit OP) — heute = 0
  daysSince: (d) => {
    if (!d) return null;
    const a = new Date(d); a.setHours(0, 0, 0, 0);
    const b = new Date(); b.setHours(0, 0, 0, 0);
    const days = Math.round((b - a) / 86400000);
    return isNaN(days) ? null : days;
  },
};

function translateExpr(expr) {
  return expr
    .replace(/\band\b/gi, "&&")
    .replace(/\bor\b/gi, "||")
    .replace(/\bnot\b/gi, "!")
    // einzelnes "=" zu "==" (aber >=, <=, !=, == unangetastet lassen)
    .replace(/(?<![><!=])=(?!=)/g, "==");
}

function evalExpr(expr, values) {
  if (!expr) return null;
  // Sicherheits-Check: nur harmlose Zeichen zulassen
  if (/[;{}`]|=>/.test(expr)) { console.warn("Ausdruck abgelehnt:", expr); return null; }
  const names = Object.keys(values);
  const helperNames = Object.keys(HELPERS);
  try {
    const fn = new Function(...names, ...helperNames, `"use strict"; return (${translateExpr(expr)});`);
    const result = fn(...names.map(n => values[n]), ...helperNames.map(h => HELPERS[h]));
    return (typeof result === "number" && isNaN(result)) ? null : result;
  } catch (e) {
    return null; // unvollständige Eingaben → Ausdruck (noch) nicht auswertbar
  }
}

/* --------------------------------------------------------------
   Werte-Kontext: Rohwerte + berechnete (derived) Elemente.
   Berechnete Elemente können aufeinander aufbauen (2 Durchläufe).
-------------------------------------------------------------- */
function buildContext(def, raw) {
  const ctx = {};
  def.elements.forEach(el => { ctx[el.id] = raw[el.id] !== undefined && raw[el.id] !== "" ? raw[el.id] : null; });
  for (let pass = 0; pass < 2; pass++) {
    def.elements.filter(e => e.type === "calculated").forEach(el => {
      ctx[el.id] = evalExpr(el.calculation, ctx);
    });
  }
  return ctx;
}

function isRelevant(el, ctx) {
  if (!el.relevant) return true;
  return evalExpr(el.relevant, ctx) === true;
}

function constraintError(el, ctx) {
  const v = ctx[el.id];
  if (v == null || !el.constraint) return null;
  const ok = evalExpr(el.constraint.expr, ctx);
  return ok === true ? null : (el.constraint.message || "Ungültiger Wert.");
}

/* --------------------------------------------------------------
   Decision Engine: Regeln in L3-Reihenfolge prüfen.
   Pro "decision"-Gruppe gewinnt die erste zutreffende Regel
   (exclusive, Default) – Regeln mit exclusive:false feuern alle.
-------------------------------------------------------------- */
function runRules(def, ctx) {
  const fired = [], decided = new Set();
  (def.decision_rules || []).forEach(r => {
    const exclusive = r.exclusive !== false;
    if (exclusive && decided.has(r.decision)) return;
    if (evalExpr(r.when, ctx) === true) {
      fired.push(r);
      if (exclusive) decided.add(r.decision);
    }
  });
  return fired;
}

/* --------------------------------------------------------------
   FHIR-Export (Demo der Schnittstelle zur Patientenakte):
   Baut aus der Tageskontrolle ein FHIR-R4-Bundle aus
   - QuestionnaireResponse (alle Antworten, linkId = element_id)
   - Observation (Wundscore = höchste gefeuerte Ampel-Stufe)
   In Produktion würde das Bundle an einen FHIR-Server (KIS) gesendet;
   im Prototyp wird es als JSON-Datei heruntergeladen.
-------------------------------------------------------------- */
const PRIO_ORDER = { red: 4, orange: 3, yellow: 2, green: 1, info: 0 };
const PRIO_LABEL = { red: "Notfall", orange: "Infektionsverdacht", yellow: "Auffällig — beobachten", green: "Normalbefund" };

function buildFhirBundle(def, ctx, recs) {
  const now = new Date().toISOString();
  const items = def.elements
    .filter(el => el.type !== "note" && ctx[el.id] != null && isRelevant(el, ctx))
    .map(el => {
      const v = ctx[el.id];
      let answer;
      if (el.type === "select_one") {
        const opt = (el.options || []).find(o => o.value === v);
        answer = { valueCoding: { code: String(v), display: opt ? opt.label : String(v) } };
      } else if (el.type === "integer") answer = { valueInteger: v };
      else if (el.type === "decimal") answer = { valueDecimal: v };
      else if (el.type === "date") answer = { valueDate: v };
      else answer = { valueString: String(v) };
      return { linkId: el.id, text: el.label + (el.mapping ? ` [${el.mapping}]` : ""), answer: [answer] };
    });

  const worst = recs.filter(r => r.priority in PRIO_LABEL)
    .sort((a, b) => PRIO_ORDER[b.priority] - PRIO_ORDER[a.priority])[0];

  return {
    resourceType: "Bundle",
    type: "collection",
    timestamp: now,
    entry: [
      { resource: {
          resourceType: "QuestionnaireResponse",
          status: "completed",
          questionnaire: `WundCheck-L3-v${def.meta.version}`,
          authored: now,
          item: items,
      }},
      { resource: {
          resourceType: "Observation",
          status: "final",
          category: [{ coding: [{ system: "http://terminology.hl7.org/CodeSystem/observation-category", code: "survey" }] }],
          code: { text: "WundCheck Wundscore (Ampel-Klassifikation)" },
          effectiveDateTime: now,
          valueCodeableConcept: {
            coding: [{ code: worst ? worst.priority : "green", display: worst ? PRIO_LABEL[worst.priority] : PRIO_LABEL.green }],
            text: worst ? worst.output : "",
          },
          note: recs.map(r => ({ text: `${r.id}: ${r.output}` })),
      }},
    ],
  };
}

function downloadFhir(def, ctx, recs) {
  const bundle = buildFhirBundle(def, ctx, recs);
  const blob = new Blob([JSON.stringify(bundle, null, 2)], { type: "application/fhir+json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "wundcheck_fhir_bundle.json";
  a.click();
  URL.revokeObjectURL(a.href);
}

/* ------------------------------- UI ------------------------------- */
function Field({ el, ctx, raw, setRaw }) {
  const err = constraintError(el, ctx);
  const set = v => setRaw(prev => ({ ...prev, [el.id]: v }));

  if (el.type === "calculated") {
    const v = ctx[el.id];
    return (
      <div className="field">
        <label className="q">{el.label}</label>
        <span className="calc">{v == null ? "—" : <b>{v}</b>} {v != null && el.unit ? el.unit : ""}</span>
        {el.mapping && <div className="mapping">{el.mapping} · automatisch berechnet</div>}
      </div>
    );
  }
  if (el.type === "note") return <div className="field"><em>{el.label}</em></div>;

  return (
    <div className="field">
      <label className="q">{el.label}{el.unit ? ` (${el.unit})` : ""} {el.required && <span className="req">*</span>}</label>
      {el.type === "select_one" ? (
        el.options.some(o => o.image) ? (
          /* Bild-Antwortoptionen: Patient klickt "so sieht es heute aus" */
          <div className="img-row" role="radiogroup" aria-label={el.label}>
            {el.options.map(o => (
              <div key={String(o.value)} role="radio" tabIndex={0}
                   aria-checked={raw[el.id] === o.value}
                   className={"img-opt" + (raw[el.id] === o.value ? " sel" : "")}
                   onClick={() => set(o.value)}
                   onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); set(o.value); } }}>
                {o.image && <img src={o.image} alt={o.label} />}
                <div className="img-label">{o.label}</div>
              </div>
            ))}
          </div>
        ) : (
        <div className="radio-row">
          {el.options.map(o => (
            <label key={String(o.value)}>
              <input type="radio" name={el.id} checked={raw[el.id] === o.value}
                     onChange={() => set(o.value)} /> {o.label}
            </label>
          ))}
        </div>
        )
      ) : (
        <input
          type={el.type === "date" ? "date" : el.type === "text" ? "text" : "number"}
          step={el.type === "decimal" ? "0.1" : "1"}
          className={err ? "invalid" : ""}
          value={raw[el.id] ?? ""}
          onChange={e => {
            const v = e.target.value;
            set(el.type === "integer" || el.type === "decimal" ? (v === "" ? "" : Number(v)) : v);
          }} />
      )}
      {err && <div className="err">⚠ {err}</div>}
      {el.mapping && <div className="mapping">{el.mapping}</div>}
    </div>
  );
}

function App() {
  const embedded = JSON.parse(document.getElementById("l3-definition").textContent);
  const [def, setDef] = useState(embedded);
  const [raw, setRaw] = useState({});
  const [showRec, setShowRec] = useState(false);

  const ctx = useMemo(() => buildContext(def, raw), [def, raw]);
  const visible = def.elements.filter(el => isRelevant(el, ctx));
  const missing = visible.filter(el => el.required && (ctx[el.id] == null));
  const anyConstraintError = visible.some(el => constraintError(el, ctx));
  const recs = showRec ? runRules(def, ctx) : [];

  const loadFile = e => {
    const f = e.target.files[0];
    if (!f) return;
    f.text().then(t => {
      try { setDef(JSON.parse(t)); setRaw({}); setShowRec(false); }
      catch { alert("Ungültige L3-JSON-Datei."); }
    });
  };

  return (
    <React.Fragment>
      <header className="app"><div className="wrap">
        <h1>{def.meta.title}</h1>
        <div className="sub">Mini-CDSS · L4-Prototyp · L3 v{def.meta.version} · L1: {def.meta.l1_guideline}</div>
      </div></header>

      <div className="wrap">
        <div className="toolbar">
          <span className="pill">{def.elements.length} Datenelemente aus L3 geladen</span>
          <span className="spacer" />
          <label className="filebtn">
            L3-Datei laden<input type="file" accept=".json" hidden onChange={loadFile} />
          </label>
          <button className="secondary" onClick={() => { setRaw({}); setShowRec(false); }}>Zurücksetzen</button>
        </div>

        {def.sections.map(sec => {
          const els = visible.filter(el => el.section === sec.id);
          if (!els.length) return null;
          return (
            <div className="card" key={sec.id}>
              <h2>{sec.title}</h2>
              {els.map(el => <Field key={el.id} el={el} ctx={ctx} raw={raw} setRaw={setRaw} />)}
            </div>
          );
        })}

        <div className="card">
          <h2>Empfehlung</h2>
          {missing.length > 0 && (
            <p className="missing">Noch {missing.length} Pflichtfeld(er) offen: {missing.map(m => m.label).join(", ")}</p>
          )}
          <button disabled={missing.length > 0 || anyConstraintError} onClick={() => setShowRec(true)}>
            Empfehlungen anzeigen
          </button>
          {showRec && recs.length === 0 && <p>Keine Regel zutreffend — Eingaben prüfen.</p>}
          {recs.map(r => (
            <div key={r.id} className={"rec " + (r.priority || "info")} style={{ marginTop: 12 }}>
              <span className="tag">{r.decision} · {r.id} · {r.priority}</span>
              <div className="out">{r.output}</div>
              {r.annotation && <div className="note">{r.annotation}</div>}
              {r.reference && <div className="ref">Quelle (L1): {r.reference}</div>}
            </div>
          ))}
          {showRec && recs.length > 0 && (
            <div style={{ marginTop: 14 }}>
              <button className="secondary" onClick={() => downloadFhir(def, ctx, recs)}>
                ⇩ In Patientenakte übermitteln (FHIR-Export, Demo)
              </button>
            </div>
          )}
        </div>

        <p className="disclaimer">{def.meta.disclaimer}</p>
      </div>
    </React.Fragment>
  );
}

createRoot(document.getElementById("root")).render(<App />);
