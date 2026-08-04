const pptxgen = require("pptxgenjs");
const fs = require("fs");

/* ---------- palette: severity is the only saturated colour in the deck ---------- */
const INK    = "12202E", INK2 = "1D3148", SOFT = "F5F7FA", LINE = "DDE5EE",
      MUTED  = "5D7186", WHITE = "FFFFFF", PALE = "8FA3B8",
      GREEN  = "1A7F4B", YELLOW = "9C6D00", ORANGE = "C25C07", RED = "C0281C",
      GREENB = "E8F6EE", YELLOWB = "FBF2DC", ORANGEB = "FCEADB", REDB = "FBE7E5";

const HEAD = "Cambria", BODY = "Calibri";
const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE";                     // 13.33 x 7.5
pres.author = "FHNW MSc Medical Informatics";
pres.title  = "WundCheck — a mini CDSS for post-operative wound self-checks";

const W = 13.33, H = 7.5, M = 0.62;

/* ---------- motif: the L1→L4 layer chain, current layer filled ---------- */
function chain(s, active, dark) {
  const labels = ["L1", "L2", "L3", "L4"];
  const x0 = W - M - 2.55, y = 0.52, w = 0.52, gap = 0.16;
  labels.forEach((L, i) => {
    const on = active === i + 1;
    s.addShape(pres.ShapeType.roundRect, {
      x: x0 + i * (w + gap), y, w, h: 0.3, rectRadius: 0.14,
      fill: { color: on ? (dark ? WHITE : INK) : (dark ? INK2 : SOFT) },
      line: { color: on ? (dark ? WHITE : INK) : (dark ? INK2 : LINE), width: 1 }
    });
    s.addText(L, {
      x: x0 + i * (w + gap), y, w, h: 0.3, align: "center", valign: "middle",
      fontFace: BODY, fontSize: 10.5, bold: true, margin: 0,
      color: on ? (dark ? INK : WHITE) : (dark ? PALE : MUTED)
    });
    if (i < 3) s.addText("›", {
      x: x0 + i * (w + gap) + w, y, w: gap, h: 0.3, align: "center", valign: "middle",
      fontFace: BODY, fontSize: 11, margin: 0, color: dark ? PALE : LINE
    });
  });
}

function light(title, kicker, layer) {
  const s = pres.addSlide();
  s.background = { color: WHITE };
  if (kicker) s.addText(kicker.toUpperCase(), {
    x: M, y: 0.42, w: 8.4, h: 0.24, fontFace: BODY, fontSize: 10.5, bold: true,
    charSpacing: 1.6, color: MUTED, margin: 0
  });
  s.addText(title, {
    x: M, y: kicker ? 0.70 : 0.52, w: layer ? 9.2 : 11.6, h: 0.72, fontFace: HEAD,
    fontSize: 27, bold: true, color: INK, margin: 0, valign: "top"
  });
  if (layer) chain(s, layer, false);
  return s;
}
function dark(title) {
  const s = pres.addSlide();
  s.background = { color: INK };
  return s;
}

/* card helper */
function card(s, x, y, w, h, fill, line) {
  s.addShape(pres.ShapeType.roundRect, {
    x, y, w, h, rectRadius: 0.09,
    fill: { color: fill || WHITE }, line: { color: line || LINE, width: 1 }
  });
}
function chip(s, x, y, w, txt, fg, bg) {
  s.addShape(pres.ShapeType.roundRect, { x, y, w, h: 0.28, rectRadius: 0.14,
    fill: { color: bg }, line: { color: bg, width: 1 } });
  s.addText(txt, { x, y, w, h: 0.28, align: "center", valign: "middle", margin: 0,
    fontFace: BODY, fontSize: 9.5, bold: true, color: fg });
}
function body(s, txt, x, y, w, h, opt) {
  s.addText(txt, Object.assign({ x, y, w, h, fontFace: BODY, fontSize: 13,
    color: INK, margin: 0, valign: "top", lineSpacing: 18 }, opt || {}));
}
function note(s, t) { s.addNotes(t); }

/* ============================ 1 · TITLE ============================ */
{
  const s = dark();
  s.addText("WundCheck", { x: M, y: 1.72, w: 9, h: 0.95, fontFace: HEAD, fontSize: 52,
    bold: true, color: WHITE, margin: 0 });
  s.addText("A mini CDSS that puts the daily wound check in the hands of the patient",
    { x: M, y: 2.72, w: 8.6, h: 0.6, fontFace: BODY, fontSize: 17, color: "C9D6E4", margin: 0 });
  s.addText("We translated a guideline written for health professionals into an instrument for laypersons —\nand learned where that translation becomes dangerous.",
    { x: M, y: 3.5, w: 8.8, h: 0.9, fontFace: BODY, fontSize: 13.5, italic: true,
      color: PALE, margin: 0, lineSpacing: 20 });

  const stats = [["48", "data elements"], ["18", "decision rules"], ["9", "L1→L2 challenges"], ["8", "defects fixed"]];
  stats.forEach(([n, l], i) => {
    const x = M + i * 2.55;
    s.addText(n, { x, y: 5.05, w: 2.3, h: 0.62, fontFace: HEAD, fontSize: 34, bold: true,
      color: WHITE, margin: 0 });
    s.addText(l, { x, y: 5.68, w: 2.3, h: 0.3, fontFace: BODY, fontSize: 11, color: PALE, margin: 0 });
  });

  s.addText("FHNW  ·  MSc Medical Informatics  ·  Clinical Decision Support Systems 2026",
    { x: M, y: 6.66, w: 9, h: 0.3, fontFace: BODY, fontSize: 11, color: PALE, margin: 0 });
  note(s, "Opening line: postoperative wound infections mostly appear AFTER discharge — exactly when nobody is looking at the wound. Our thread for the next ten minutes is the translation problem.");
}

/* ============================ 2 · HEALTH NEED ============================ */
{
  const s = light("Surgical site infections appear after discharge — when nobody is looking",
                  "Health system need", 0);
  const boxes = [
    ["60.1 %", "of surgical site infections occur **after** discharge — systematic review of 1.4 million operations. The CDC surveillance window runs 30 days, 90 for implants.", INK],
    ["Too late", "Warning signs are read as normal. The infection progresses; treatment starts days later than it could.", ORANGE],
    ["Too early", "Normal healing signs — a scab, day-2 redness — trigger calls that bind practice staff and worry patients.", ORANGE]
  ];
  boxes.forEach(([h, t, col], i) => {
    const x = M + i * 4.06;
    card(s, x, 1.86, 3.8, 1.72);
    s.addText(h, { x: x + 0.28, y: 2.02, w: 3.3, h: 0.42, fontFace: HEAD, fontSize: i === 0 ? 26 : 19,
      bold: true, color: col, margin: 0 });
    body(s, t.replace(/\*\*/g, ""), x + 0.28, i === 0 ? 2.5 : 2.5, 3.3, 1.0,
      { fontSize: 11, color: MUTED, lineSpacing: 14 });
  });

  s.addText("SSI incidence in Europe 0.5–10.1 % depending on procedure (ECDC 2017: 10,149 SSIs in 648,512 operations) · 9.5 % after colon surgery, 1.0 % after hip replacement (WHO) · Switzerland: > 170 hospitals in the Swissnoso surveillance programme",
    { x: M, y: 3.66, w: 12.1, h: 0.34, fontFace: BODY, fontSize: 9.5, color: MUTED, margin: 0 });

  card(s, M, 4.12, 7.5, 2.42, SOFT, LINE);
  s.addText("Why a knowledge-based CDSS — and not the alternatives", { x: M + 0.3, y: 4.32,
    w: 6.9, h: 0.32, fontFace: BODY, fontSize: 13, bold: true, color: INK, margin: 0 });
  const alts = [
    ["Information leaflet", "already exists everywhere; no feedback on the actual finding"],
    ["Telephone follow-up", "not deliverable daily; “the wound looks odd” is not usable data"],
    ["Photo-based ML", "light, angle and skin tone vary; decisions not explainable"],
    ["Rule-based CDSS", "traceable to a guideline, reviewable, maintainable by clinicians"]
  ];
  alts.forEach(([a, b], i) => {
    const y = 4.76 + i * 0.44;
    s.addText(a, { x: M + 0.3, y, w: 2.1, h: 0.3, fontFace: BODY, fontSize: 11.5,
      bold: true, color: i === 3 ? GREEN : INK, margin: 0, valign: "middle" });
    s.addText(b, { x: M + 2.45, y, w: 4.75, h: 0.3, fontFace: BODY, fontSize: 11,
      color: MUTED, margin: 0, valign: "middle" });
  });

  card(s, M + 7.86, 4.12, 4.24, 2.42);
  s.addText("Scope", { x: M + 8.14, y: 4.32, w: 3.7, h: 0.3, fontFace: BODY, fontSize: 13,
    bold: true, color: INK, margin: 0 });
  body(s, "Adults · elective surgery · wounds with primary closure · any body region.",
    M + 8.14, 4.72, 3.7, 0.8, { fontSize: 11.5, lineSpacing: 16 });
  s.addText("Not covered", { x: M + 8.14, y: 5.5, w: 3.7, h: 0.26, fontFace: BODY,
    fontSize: 10.5, bold: true, color: RED, margin: 0 });
  body(s, "Chronic wounds · burns · secondary healing · children · contaminated emergencies",
    M + 8.14, 5.8, 3.7, 0.75, { fontSize: 11, color: MUTED, lineSpacing: 15 });
  s.addText("Woelber et al., Surg Infect 2016;17(5):510–19  ·  ECDC Annual Epidemiological Report 2017  ·  WHO Global Guidelines for the Prevention of SSI  ·  CDC/NHSN SSI Event",
    { x: M, y: 6.66, w: 12.1, h: 0.3, fontFace: BODY, fontSize: 8.5, italic: true, color: MUTED, margin: 0 });
  note(s, "The gap is not a knowledge gap in professionals — it is an observation gap at home, plus laypeople being unable to tell normal from abnormal. Explainability beats predictive accuracy in a patient-facing safety context.");
}

/* ============================ 3 · PERSONAS ============================ */
{
  const s = light("Three users on three levels — only one of them operates the app", "Personas & scenarios", 0);
  const ps = [
    ["Peter Brunner, 58", "Patient · primary user",
     "Knee replacement 4 days ago. Little medical knowledge, reading glasses, uses everyday apps.",
     "“I want to know it is fine — without calling anyone.”"],
    ["Sandra Meier, 34", "Practice assistant · secondary",
     "Triages calls and messages all day. High workload, no time for guessing games.",
     "“I need to see in 10 seconds whether this needs an appointment today.”"],
    ["Dr Anna Keller, 45", "Surgeon · tertiary",
     "Operates and runs follow-ups. Wants the trajectory, not a retrospective recollection.",
     "“I want the full trend without opening every single answer.”"]
  ];
  ps.forEach(([n, r, d, q], i) => {
    const x = M + i * 4.06;
    card(s, x, 1.82, 3.8, 2.32);
    s.addShape(pres.ShapeType.ellipse, { x: x + 0.28, y: 2.04, w: 0.46, h: 0.46,
      fill: { color: INK }, line: { color: INK, width: 1 } });
    s.addText(String(i + 1), { x: x + 0.28, y: 2.04, w: 0.46, h: 0.46, align: "center",
      valign: "middle", margin: 0, fontFace: BODY, fontSize: 12, bold: true,
      color: WHITE });
    s.addText(n, { x: x + 0.86, y: 2.04, w: 2.75, h: 0.28, fontFace: BODY, fontSize: 13,
      bold: true, color: INK, margin: 0 });
    s.addText(r, { x: x + 0.86, y: 2.3, w: 2.75, h: 0.24, fontFace: BODY, fontSize: 10,
      color: MUTED, margin: 0 });
    body(s, d, x + 0.28, 2.72, 3.28, 0.95, { fontSize: 11, color: MUTED, lineSpacing: 15 });
    s.addText(q, { x: x + 0.28, y: 3.42, w: 3.28, h: 0.6, fontFace: BODY, fontSize: 11,
      italic: true, color: INK, margin: 0, lineSpacing: 15 });
  });

  card(s, M, 4.72, 12.1, 1.86, GREENB, "A8D9BF");
  chip(s, M + 0.3, 4.96, 1.5, "SCENARIO A", GREEN, WHITE);
  s.addText("Day 6 — the scab", { x: M + 1.95, y: 4.96, w: 3, h: 0.28, fontFace: BODY,
    fontSize: 12.5, bold: true, color: GREEN, margin: 0, valign: "middle" });
  body(s, "36.9 °C, pain 2/10 and better than yesterday — but a brown scab has formed, and Peter's brother once had a wound infection. WundCheck returns GREEN with “a scab is a normal sign of healing — do not pick it off”. Peter does not call the clinic. The entry still goes into the record, so Dr Keller sees an unbroken trajectory at the suture removal appointment.",
    M + 0.3, 5.34, 11.5, 1.05, { fontSize: 12, lineSpacing: 17 });
  s.addText("The call that is avoided is worth as much as the one that is triggered.",
    { x: M + 0.3, y: 6.28, w: 11.5, h: 0.28, fontFace: BODY, fontSize: 11.5, italic: true,
      bold: true, color: GREEN, margin: 0 });
  note(s, "Personas drive design decisions: images instead of terminology because of Peter; alerts only from ORANGE upwards because of Sandra; classification as a separate FHIR Observation because of Dr Keller.");
}

/* ============================ 4 · L1 ============================ */
{
  const s = light("Four sources, three roles — and one we deliberately discarded", "Guidelines & evidence", 1);
  const rows = [
    ["CDC / NHSN", "Normative — definition", "Superficial vs. deep incisional SSI, 30/90-day window, the five clinical signs", "Surveillance definition"],
    ["NICE NG125", "Normative — management", "Post-operative wound care; §1.1.3 requires patients be taught to recognise an SSI", "Evidence-based guideline"],
    ["Southampton score", "Instrument", "Visual grading 0–V — the anchor for our image selection", "Validated instrument"],
    ["Campwala et al. 2019", "Evidence", "Compares CDC, ASEPSIS and Southampton", "Retrospective, n = 22"]
  ];
  rows.forEach(([a, b, c, d], i) => {
    const y = 1.82 + i * 0.83;
    card(s, M, y, 12.1, 0.72, i === 3 ? SOFT : WHITE);
    s.addText(a, { x: M + 0.26, y: y + 0.08, w: 2.15, h: 0.56, fontFace: BODY, fontSize: 12.5,
      bold: true, color: INK, margin: 0, valign: "middle" });
    s.addText(b, { x: M + 2.45, y: y + 0.08, w: 1.95, h: 0.56, fontFace: BODY, fontSize: 10.5,
      color: MUTED, margin: 0, valign: "middle" });
    s.addText(c, { x: M + 4.5, y: y + 0.08, w: 5.6, h: 0.56, fontFace: BODY, fontSize: 11.5,
      color: INK, margin: 0, valign: "middle" });
    s.addText(d, { x: M + 10.2, y: y + 0.08, w: 1.7, h: 0.56, fontFace: BODY, fontSize: 10,
      italic: true, color: i === 3 ? RED : MUTED, margin: 0, valign: "middle", align: "right" });
  });

  /* left: why we rejected the statistically better instrument */
  card(s, M, 5.24, 5.95, 1.66, INK, INK);
  s.addText("Why we discarded ASEPSIS — the best performer", { x: M + 0.28, y: 5.4,
    w: 5.4, h: 0.28, fontFace: BODY, fontSize: 12, bold: true, color: WHITE, margin: 0 });
  body(s, "It needs antibiotic administration, drainage, debridement, inpatient days and culture results. None of that is obtainable by a patient at home. We chose the usable instrument over the statistically better one — and we say so.",
    M + 0.28, 5.72, 5.4, 1.05, { fontSize: 11, color: "C9D6E4", lineSpacing: 15 });

  /* right: our own evidence, graded honestly */
  card(s, M + 6.15, 5.24, 5.95, 1.66, REDB, "F0ACA6");
  s.addText("How good is our evidence? Not very — and that shapes the use", { x: M + 6.43, y: 5.4,
    w: 5.4, h: 0.28, fontFace: BODY, fontSize: 12, bold: true, color: RED, margin: 0 });
  body(s, "Campwala et al.: n = 22, retrospective, single-centre, implant-based breast reconstruction — a population far from ours, and the endpoint is implant failure, not detection of infection. Southampton showed only limited predictive value there.\n\nSo we use it as a communication and triage grid, not as a prognostic instrument.",
    M + 6.43, 5.72, 5.4, 1.05, { fontSize: 10.5, color: INK, lineSpacing: 13 });

  note(s, "Three roles, deliberately separated: CDC defines WHAT an SSI is, NICE says WHEN to act, Southampton says HOW to describe the wound visually. NICE 1.1.3 is the legitimation of the whole use case — it already requires that patients be taught to recognise an SSI; we operationalise a recommendation that usually ends up as a leaflet. And we grade our own evidence rather than citing it uncritically.");
}

/* ============================ 5 · SOUTHAMPTON ============================ */
{
  const s = light("Our image selection is a published grading, not a UI whim", "L1 → L2 · Southampton mapping", 2);
  const g = [
    ["0",  "Normal healing", "Calm & dry", GREEN, GREENB],
    ["I",  "Mild bruising and/or erythema", "Slightly reddened", GREEN, GREENB],
    ["II", "Erythema plus other signs of inflammation", "Markedly reddened & swollen", YELLOW, YELLOWB],
    ["III","Clear / serous / bloody discharge", "Clear or bloody discharge", ORANGE, ORANGEB],
    ["IV", "Pus", "Cloudy / purulent discharge", ORANGE, ORANGEB],
    ["V",  "Deep infection ± tissue breakdown", "Open / pus", RED, REDB]
  ];
  g.forEach(([grade, def, img, fg, bg], i) => {
    const y = 1.8 + i * 0.74;
    card(s, M, y, 8.5, 0.62, i % 2 ? SOFT : WHITE, LINE);
    s.addShape(pres.ShapeType.roundRect, { x: M + 0.16, y: y + 0.14, w: 0.5, h: 0.34,
      rectRadius: 0.08, fill: { color: bg }, line: { color: bg, width: 1 } });
    s.addText(grade, { x: M + 0.16, y: y + 0.14, w: 0.5, h: 0.34, align: "center",
      valign: "middle", margin: 0, fontFace: BODY, fontSize: 11.5, bold: true, color: fg });
    s.addText(def, { x: M + 0.8, y, w: 4.5, h: 0.62, fontFace: BODY, fontSize: 11.5,
      color: INK, margin: 0, valign: "middle" });
    s.addText("→  " + img, { x: M + 5.4, y, w: 3, h: 0.62, fontFace: BODY, fontSize: 11,
      color: MUTED, margin: 0, valign: "middle" });
  });

  card(s, M + 8.8, 1.8, 3.3, 2.3);
  s.addText("What this buys us", { x: M + 9.05, y: 1.98, w: 2.8, h: 0.28, fontFace: BODY,
    fontSize: 12, bold: true, color: INK, margin: 0 });
  s.addText([
    { text: "a citable source for our core interaction", options: { bullet: { indent: 14 }, breakLine: true } },
    { text: "a non-trivial derived element", options: { bullet: { indent: 14 }, breakLine: true } },
    { text: "an honest, evidenced limitation", options: { bullet: { indent: 14 } } }
  ], { x: M + 9.05, y: 2.3, w: 2.8, h: 1.55, fontFace: BODY, fontSize: 11, color: MUTED,
       margin: 0, valign: "top", paraSpaceAfter: 7, lineSpacing: 15 });

  card(s, M + 8.8, 4.3, 3.3, 1.94, REDB, "F0ACA6");
  s.addText("The adaptation problem", { x: M + 9.05, y: 4.48, w: 2.8, h: 0.28, fontFace: BODY,
    fontSize: 12, bold: true, color: RED, margin: 0 });
  body(s, "Southampton grades “> 2 cm along the wound”. Patients do not measure. We ask “one small spot or the whole wound?” — closer to usable, further from precise.",
    M + 9.05, 4.84, 2.8, 1.3, { fontSize: 10.5, color: INK, lineSpacing: 14 });
  note(s, "This slide is the hinge of the whole talk: the image selection is the answer to the translation problem, and it is anchored in a published instrument rather than invented by us.");
}

/* ============================ 6 · BPMN ============================ */
{
  const s = light("The logic sits in a business rule task — not in the app", "L2 · High-level workflow (BPMN)", 2);
  const w = 10.7, h = w / 1.986;                      // native aspect 2320 × 1168
  s.addImage({ path: "workflow-highlevel.png", x: (W - w) / 2, y: 1.64, w, h });
  note(s, "Say out loud: four lanes, so responsibility is explicit. One business rule task — the app decides nothing itself, it executes the L3 decision table. Every completed check is written to the record, INCLUDING green: without that baseline the surgeon has no trajectory at the follow-up appointment. Two end events: check completed, or case handed to the practice. Real BPMN 2.0, editable in bpmn.io — not a flowchart with diamonds.");
}

/* ============================ 7 · DATA DICTIONARY ============================ */
{
  const s = light("48 data elements — every one traceable to a guideline", "L2 · Data dictionary", 2);
  const nums = [["48", "data elements"], ["9", "derived"], ["38", "terminology-bound"], ["47", "FHIR-mapped"]];
  nums.forEach(([n, l], i) => {
    const x = M + i * 3.05;
    card(s, x, 1.78, 2.85, 1.28, SOFT, LINE);
    s.addText(n, { x: x + 0.26, y: 1.92, w: 2.3, h: 0.66, fontFace: HEAD, fontSize: 36,
      bold: true, color: INK, margin: 0 });
    s.addText(l, { x: x + 0.26, y: 2.6, w: 2.3, h: 0.3, fontFace: BODY, fontSize: 11,
      color: MUTED, margin: 0 });
  });

  const cols = ["ID", "Element", "Type", "Terminology", "FHIR", "L1 source"];
  const wds  = [0.85, 2.55, 1.35, 1.85, 2.45, 2.9];
  let x = M;
  cols.forEach((c, i) => {
    s.addText(c.toUpperCase(), { x, y: 3.36, w: wds[i], h: 0.26, fontFace: BODY, fontSize: 9,
      bold: true, charSpacing: 1, color: MUTED, margin: 0 });
    x += wds[i] + 0.06;
  });
  const rows = [
    ["DE-020", "Body temperature", "decimal", "LOINC 8310-5", "Observation.valueQuantity", "CDC — fever > 38 °C"],
    ["DE-030", "Wound appearance", "select_one", "SNOMED 225552003", "Observation.valueCodeable", "Southampton 0–V"],
    ["DE-032", "Red streak", "select_one", "SNOMED 46117009", "Observation.valueCodeable", "NICE NG125 §1.4.9"],
    ["DE-035", "Discharge", "select_one", "SNOMED 449736006", "Observation.valueCodeable", "CDC — purulent drainage"],
    ["DE-045", "Southampton grade", "calculated", "SNOMED 225552003", "Observation.valueCodeable", "Southampton"]
  ];
  rows.forEach((r, i) => {
    const y = 3.68 + i * 0.5;
    card(s, M, y, 12.1, 0.42, i % 2 ? WHITE : SOFT, i % 2 ? WHITE : LINE);
    let cx = M + 0.02;
    r.forEach((cell, j) => {
      s.addText(cell, { x: cx, y, w: wds[j], h: 0.42, fontFace: BODY, fontSize: 10,
        bold: j === 0, color: j === 0 ? INK : (j >= 3 ? MUTED : INK), margin: 0, valign: "middle" });
      cx += wds[j] + 0.06;
    });
  });

  card(s, M, 6.36, 12.1, 0.72, INK, INK);
  s.addText("Sequence follows the patient, not the guideline: baseline data once, then “how do I feel”, then the wound — because inspecting it means opening the dressing.",
    { x: M + 0.3, y: 6.36, w: 11.5, h: 0.72, fontFace: BODY, fontSize: 11.5, color: "C9D6E4",
      margin: 0, valign: "middle" });
  note(s, "Every element carries a DE-ID that is identical in the data dictionary, the L3, the test protocol and the FHIR export. That is what makes traceability demonstrable rather than claimed.");
}

/* ============================ 8 · DECISION LOGIC ============================ */
{
  const s = light("Worst-first: a reassuring finding can never overwrite a warning", "L2 · Decision logic", 2);
  const casc = [
    [RED,    REDB,    "RED · emergency",        "R1  R2  R3",              "Systemic signs · lymphangitis · dehiscence or pus"],
    [ORANGE, ORANGEB, "ORANGE · suspected",     "R9  R4  R5  R11  R12",    "Feeling unwell · purulent discharge · fever · persistence"],
    [YELLOW, YELLOWB, "YELLOW · abnormal",      "R6b  R6a  R7  R10",       "Inflammation · wound gap · bleeding on anticoagulants"],
    [GREEN,  GREENB,  "GREEN · all clear",      "R8",                      "Catch-all — never “everything is fine” without a contact hint"]
  ];
  casc.forEach(([fg, bg, label, ids, desc], i) => {
    const y = 1.8 + i * 1.02;
    card(s, M, y, 8.3, 0.86, bg, bg);
    s.addText(label, { x: M + 0.3, y: y + 0.08, w: 2.5, h: 0.32, fontFace: BODY, fontSize: 13,
      bold: true, color: fg, margin: 0 });
    s.addText(ids, { x: M + 0.3, y: y + 0.44, w: 2.5, h: 0.3, fontFace: BODY, fontSize: 10.5,
      color: fg, margin: 0 });
    s.addText(desc, { x: M + 3.0, y, w: 5.1, h: 0.86, fontFace: BODY, fontSize: 11.5,
      color: INK, margin: 0, valign: "middle" });
    if (i < 3) s.addText("▼", { x: M + 3.9, y: y + 0.86, w: 0.4, h: 0.16, align: "center",
      margin: 0, fontFace: BODY, fontSize: 8, color: MUTED });
  });

  card(s, M + 8.6, 1.8, 3.5, 1.9, SOFT, LINE);
  s.addText("Why worst-first", { x: M + 8.86, y: 1.98, w: 3, h: 0.28, fontFace: BODY,
    fontSize: 12, bold: true, color: INK, margin: 0 });
  body(s, "A false alarm costs a phone call. False reassurance can delay an infection by days. We accept a higher false-alarm rate on purpose.",
    M + 8.86, 2.34, 3, 1.35, { fontSize: 11, color: MUTED, lineSpacing: 15 });

  card(s, M + 8.6, 3.9, 3.5, 1.92);
  s.addText("Two-pass evaluation", { x: M + 8.86, y: 4.08, w: 3, h: 0.28, fontFace: BODY,
    fontSize: 12, bold: true, color: INK, margin: 0 });
  body(s, "One rule needs the classification as its own input. The rules run twice — the worse result wins, so a second pass can escalate but never de-escalate.",
    M + 8.86, 4.44, 3, 1.3, { fontSize: 11, color: MUTED, lineSpacing: 15 });

  s.addText("All thresholds are named constants in the L3 with their source — a guideline change is one line, not a release.",
    { x: M, y: 6.1, w: 12.1, h: 0.4, fontFace: BODY, fontSize: 11.5, italic: true,
      color: MUTED, margin: 0 });
  note(s, "Priority order is explicit and tested. Information rules I1–I5 are non-exclusive and fire alongside the classification — a scab note appears next to a warning, never instead of it.");
}

/* ============================ 9 · CHALLENGES ============================ */
{
  const s = light("Nine places where the guideline left us on our own", "L1 → L2 · Translation challenges", 2);
  const ch = [
    ["C-01", "Professional instrument → layperson instrument", "high"],
    ["C-02", "Sub-grades without centimetres", "med"],
    ["C-03", "When does redness stop being normal?", "high"],
    ["C-04", "Scab: warning or reassurance?", "low"],
    ["C-05", "CDC criteria assume a clinical examination", "med"],
    ["C-06", "Southampton as triage, not prognosis", "med"],
    ["C-07", "Two fever thresholds instead of one", "med"],
    ["C-08", "No trajectory on the first day", "low"],
    ["C-09", "Severity scale ≠ urgency of action", "med"]
  ];
  ch.forEach(([id, t, sev], i) => {
    const col = i % 3, row = Math.floor(i / 3);
    const x = M + col * 4.06, y = 1.8 + row * 0.82;
    const hi = sev === "high";
    card(s, x, y, 3.8, 0.7, hi ? REDB : WHITE, hi ? "F0ACA6" : LINE);
    s.addText(id, { x: x + 0.22, y: y + 0.06, w: 0.7, h: 0.28, fontFace: BODY, fontSize: 10,
      bold: true, color: hi ? RED : MUTED, margin: 0 });
    s.addText(t, { x: x + 0.22, y: y + 0.3, w: 3.4, h: 0.34, fontFace: BODY, fontSize: 11,
      color: INK, margin: 0 });
  });

  card(s, M, 4.42, 12.1, 1.98, INK, INK);
  s.addText("The two highest-risk decisions sit in the same place", { x: M + 0.32, y: 4.6,
    w: 11.4, h: 0.3, fontFace: BODY, fontSize: 13, bold: true, color: WHITE, margin: 0 });
  const two = [
    ["C-01", "Southampton was built for trained staff. We turned it into an image selection for laypersons. That is our core idea — and it is unvalidated."],
    ["C-03", "No source defines the day on which redness stops being physiological. We set day 3. Too early means false alarms; too late means delayed detection."]
  ];
  two.forEach(([id, t], i) => {
    const y = 4.9 + i * 0.66;
    s.addText([{ text: id + "   ", options: { bold: true, color: WHITE } },
               { text: t, options: { color: "C9D6E4" } }],
      { x: M + 0.32, y, w: 11.4, h: 0.66, fontFace: BODY, fontSize: 11.5,
        margin: 0, valign: "top", lineSpacing: 16 });
  });
  s.addText("All nine would need clinical sign-off. We do not have it — and we list that as a limitation.",
    { x: M, y: 6.56, w: 12.1, h: 0.3, fontFace: BODY, fontSize: 11.5, italic: true,
      color: MUTED, margin: 0 });
  note(s, "This is the slide that shows critical thinking. Each challenge has a type, a decision, a rationale, an implication and a risk level in the documentation.");
}

/* ============================ 10 · L3 ARCHITECTURE ============================ */
{
  const s = light("Author in readable JSON, speak standards at the interface", "L3 · Architecture decision", 3);
  const opts = [
    ["XLSForm / ODK", "Established, executable by existing engines", "Standard widgets cannot carry our image cards — the L4 would dictate the UX", false],
    ["FHIR Questionnaire + CQL", "Full standard, WHO SMART compliant", "“FHIR resources are not human readable” — not reviewable by our clinical lead in six days", false],
    ["Hardcoding in the app", "Fastest to a prototype", "Every rule change needs a developer and a rebuild", false],
    ["Custom JSON + FHIR at the edge", "Reads like the L2; full control of the UX; standards where they count", "No existing engine runs it directly; expression language is not CQL", true]
  ];
  opts.forEach(([n, pro, con, win], i) => {
    const y = 1.8 + i * 0.94;
    card(s, M, y, 12.1, 0.82, win ? GREENB : WHITE, win ? "A8D9BF" : LINE);
    s.addText(n, { x: M + 0.26, y, w: 2.9, h: 0.82, fontFace: BODY, fontSize: 12,
      bold: true, color: win ? GREEN : INK, margin: 0, valign: "middle" });
    s.addText(pro, { x: M + 3.3, y, w: 3.65, h: 0.82, fontFace: BODY, fontSize: 10.5,
      color: MUTED, margin: 0, valign: "middle" });
    s.addText(con, { x: M + 7.55, y, w: 4.0, h: 0.82, fontFace: BODY, fontSize: 10.5,
      color: MUTED, margin: 0, valign: "middle" });
    if (win) s.addText("✓", { x: M + 11.6, y, w: 0.4, h: 0.82, align: "center", valign: "middle",
      margin: 0, fontFace: BODY, fontSize: 16, bold: true, color: GREEN });
  });
  card(s, M, 5.6, 12.1, 1.05, INK, INK);
  s.addText("And we can prove it: a check scans the app source for every element id, threshold, code system and endpoint. Any clinical content in the L4 fails the build.",
    { x: M + 0.32, y: 5.6, w: 11.5, h: 1.05, fontFace: BODY, fontSize: 12.5, color: WHITE,
      margin: 0, valign: "middle" });
  note(s, "The lecture explicitly permits authoring in a tailored format and translating at the boundary. We disclose that we do not achieve full software neutrality — a deliberate trade-off for maintainability and available skills.");
}

/* ============================ 11 · DEMO ============================ */
{
  const s = dark();
  s.addText("DEMO", { x: M, y: 0.42, w: 6, h: 0.3, fontFace: BODY, fontSize: 10.5, bold: true,
    charSpacing: 1.6, color: PALE, margin: 0 });
  s.addText("One patient, two days — and a threshold change with no rebuild",
    { x: M, y: 0.70, w: 11.5, h: 0.5, fontFace: HEAD, fontSize: 25, bold: true, color: WHITE, margin: 0 });
  s.addImage({ path: "result-green.png",  x: M, y: 1.62, w: 5.9, h: 5.9 / 2.297 });
  s.addImage({ path: "result-orange.png", x: M, y: 4.42, w: 5.9, h: 5.9 / 2.449 });

  const steps = [
    ["Day 6 — GREEN · Scenario A", "A scab worries the patient. The system reassures and names the reason. No call to the clinic."],
    ["Day 7 — ORANGE · Scenario B", "Purulent discharge, 38.3 °C. R4 fires, the patient is told to contact the practice today, a FHIR Communication goes out."],
    ["Threshold change", "fever_orange 38.0 → 37.5 in the L3 inspector. Same case, different result. No rebuild, no developer, not a line of code."]
  ];
  steps.forEach(([h, t], i) => {
    const y = 1.66 + i * 1.24;
    s.addShape(pres.ShapeType.ellipse, { x: M + 6.5, y, w: 0.38, h: 0.38,
      fill: { color: INK2 }, line: { color: PALE, width: 1 } });
    s.addText(String(i + 1), { x: M + 6.5, y, w: 0.38, h: 0.38, align: "center", valign: "middle",
      margin: 0, fontFace: BODY, fontSize: 11, bold: true, color: WHITE });
    s.addText(h, { x: M + 7.02, y: y + 0.01, w: 4.7, h: 0.28, fontFace: BODY, fontSize: 13,
      bold: true, color: WHITE, margin: 0 });
    s.addText(t, { x: M + 7.02, y: y + 0.31, w: 4.7, h: 0.8, fontFace: BODY, fontSize: 10.5,
      color: "C9D6E4", margin: 0, lineSpacing: 14 });
  });

  /* interface considerations — an explicit assignment requirement for the L4 */
  s.addShape(pres.ShapeType.roundRect, { x: M + 6.5, y: 5.46, w: 5.22, h: 1.66, rectRadius: 0.09,
    fill: { color: INK2 }, line: { color: INK2, width: 1 } });
  s.addText("Why the interface looks like this", { x: M + 6.76, y: 5.6, w: 4.8, h: 0.26,
    fontFace: BODY, fontSize: 12, bold: true, color: WHITE, margin: 0 });
  s.addText([
    { text: "Images, not clinical terms — crosses language and literacy barriers", options: { bullet: { indent: 12 }, breakLine: true } },
    { text: "The result names its reason, not just a colour — against automation bias", options: { bullet: { indent: 12 }, breakLine: true } },
    { text: "Reassurance is a first-class output, not a leftover", options: { bullet: { indent: 12 }, breakLine: true } },
    { text: "Baseline data once only — a daily check has to stay under 3 minutes", options: { bullet: { indent: 12 } } }
  ], { x: M + 6.76, y: 5.9, w: 4.8, h: 1.1, fontFace: BODY, fontSize: 9.5, color: "C9D6E4",
       margin: 0, valign: "top", paraSpaceAfter: 3, lineSpacing: 12 });

  s.addText("▶  Demo video: submission/WundCheck_L4_Demo.mp4 · 1:46   ·   Single HTML file · offline · no installation · EN / DE",
    { x: M, y: 7.06, w: 6.0, h: 0.3, fontFace: BODY, fontSize: 9.5, italic: true,
      color: PALE, margin: 0, align: "center" });
  note(s, "PLAY THE VIDEO HERE — submission/WundCheck_L4_Demo.mp4, 1 min 46 s, 1920×1080, screen recording of the running app. Start it, then stay silent until the threshold change; only narrate over the last part. The screenshots on this slide are the fallback if the video does not start. Step 3 is the important one — it is the live proof that the layer separation is real.");
}

/* ============================ 12 · QA ============================ */
{
  const s = light("Two defects were invisible until the rules actually ran", "Quality assurance", 0);
  const bugs = [
    ["B-01", "Marked inflammation on day 1–2 classified GREEN", "L2", RED],
    ["B-02", "“I feel really unwell” triggered nothing at all", "L2", RED],
    ["B-03", "Emergency rule unreachable behind conditional logic", "L2/L3", RED],
    ["B-04", "Fever threshold duplicated in two places", "L3", YELLOW],
    ["B-05", "Anticoagulant status collected but never used", "L2", GREEN],
    ["B-06", "Southampton IV mapped RED in one doc, ORANGE in another", "L2", YELLOW],
    ["B-07", "Trend rule could never fire — circular dependency", "L3/L4", RED],
    ["B-08", "That same rule was unreachable even after the fix", "L2", YELLOW]
  ];
  bugs.forEach(([id, t, layer, col], i) => {
    const y = 1.78 + i * 0.6;
    card(s, M, y, 7.8, 0.5, i % 2 ? SOFT : WHITE, i % 2 ? LINE : WHITE);
    s.addShape(pres.ShapeType.ellipse, { x: M + 0.2, y: y + 0.17, w: 0.16, h: 0.16,
      fill: { color: col }, line: { color: col, width: 1 } });
    s.addText(id, { x: M + 0.5, y, w: 0.65, h: 0.5, fontFace: BODY, fontSize: 10.5,
      bold: true, color: INK, margin: 0, valign: "middle" });
    s.addText(t, { x: M + 1.2, y, w: 5.8, h: 0.5, fontFace: BODY, fontSize: 11,
      color: INK, margin: 0, valign: "middle" });
    s.addText(layer, { x: M + 6.9, y, w: 0.75, h: 0.5, fontFace: BODY, fontSize: 9.5,
      color: MUTED, margin: 0, valign: "middle", align: "right" });
  });

  const kp = [["19/19", "decision-logic tests"], ["20/20", "FHIR conformance checks"], ["6", "hazards ranked"]];
  kp.forEach(([n, l], i) => {
    const y = 1.78 + i * 1.0;
    card(s, M + 8.45, y, 3.65, 0.86, SOFT, LINE);
    s.addText(n, { x: M + 8.71, y, w: 1.5, h: 0.86, fontFace: HEAD, fontSize: 22,
      bold: true, color: INK, margin: 0, valign: "middle" });
    s.addText(l, { x: M + 10.2, y, w: 1.85, h: 0.86, fontFace: BODY, fontSize: 10.5,
      color: MUTED, margin: 0, valign: "middle" });
  });
  card(s, M + 8.45, 4.78, 3.65, 1.82, INK, INK);
  s.addText("Residual risk", { x: M + 8.71, y: 4.96, w: 3.1, h: 0.28, fontFace: BODY,
    fontSize: 12, bold: true, color: WHITE, margin: 0 });
  body(s, "We never tested the one thing our whole approach rests on: whether laypeople assign the images correctly. That is monitored after deployment — GREEN cases that still present to a physician within 72 h.",
    M + 8.71, 5.3, 3.1, 1.2, { fontSize: 10.5, color: "C9D6E4", lineSpacing: 14 });

  s.addText("Risk-based testing per Day 5: identify hazards → rank by risk → test critical paths first → document residual risk.",
    { x: M, y: 6.66, w: 7.8, h: 0.3, fontFace: BODY, fontSize: 11, italic: true, color: MUTED, margin: 0 });
  note(s, "B-07 and B-08 could not have been found by reading the decision table — only by executing it. That is exactly what the assignment means by L2–L4 translation issues.");
}

/* ============================ 13 · IMPLEMENTATION & M&E ============================ */
{
  const s = light("How it reaches users, how it is maintained, how we would know it works",
                  "Implementation, monitoring & evaluation", 0);

  /* phase strip */
  const ph = [["0","Preparation","clinical sign-off","4 wk"], ["1","Pilot","1 hospital, 30 patients","3 mo"],
              ["2","Evaluation","rule revision, UX rework","2 mo"], ["3","Expansion","HIS integration live","6 mo"],
              ["4","Scaling","further sites, languages","open"]];
  ph.forEach(([n, t, d, dur], i) => {
    const x = M + i * 2.49;
    card(s, x, 1.76, 2.14, 1.06, i === 1 ? INK : WHITE, i === 1 ? INK : LINE);
    s.addText(n + " · " + t, { x: x + 0.18, y: 1.84, w: 1.85, h: 0.28, fontFace: BODY, fontSize: 11.5,
      bold: true, color: i === 1 ? WHITE : INK, margin: 0 });
    s.addText(d, { x: x + 0.18, y: 2.1, w: 1.85, h: 0.42, fontFace: BODY, fontSize: 9.5,
      color: i === 1 ? "C9D6E4" : MUTED, margin: 0, lineSpacing: 12 });
    s.addText(dur, { x: x + 0.18, y: 2.52, w: 1.85, h: 0.22, fontFace: BODY, fontSize: 9,
      italic: true, color: i === 1 ? PALE : MUTED, margin: 0 });
  });

  /* three columns: implementation · monitoring · evaluation */
  const cols = [
    ["Implementation", [
      ["Provision", "QR code on the discharge sheet — no app store, no account, no install"],
      ["Training", "Patient 5 min at discharge (first check done together) · practice 30 min · onboarding module for new staff"],
      ["Maintenance", "Clinical department owns the content; four-eyes sign-off; guideline update to live in ≤ 4 weeks"],
      ["Integration", "FHIR R4 to the HIS / Swiss EPD; endpoint is L3 configuration"]
    ], INK],
    ["Monitoring", [
      ["Functionality", "> 99 % error-free runs"],
      ["Stability", "zero data loss on network drop"],
      ["Fidelity", "> 70 % of days checked"],
      ["Data quality", "< 5 % incomplete entries"]
    ], MUTED],
    ["Evaluation", [
      ["Pilot", "SUS + patient-vs-clinician agreement (κ)"],
      ["Demonstration", "chart review — time to medical contact"],
      ["Scale-up", "stepped-wedge; SSI rate, readmissions"],
      ["Adverse effects", "false alarms, alert overrides, equity"]
    ], MUTED]
  ];
  cols.forEach(([title, items, col], c) => {
    const x = M + c * 4.06;
    s.addText(title, { x, y: 3.06, w: 3.8, h: 0.3, fontFace: BODY, fontSize: 13, bold: true,
      color: c === 0 ? INK : MUTED, margin: 0 });
    items.forEach(([h, t], i) => {
      const y = 3.44 + i * 0.82;
      card(s, x, y, 3.87, 0.72, c === 0 ? SOFT : WHITE, LINE);
      s.addText(h, { x: x + 0.22, y: y + 0.05, w: 3.4, h: 0.24, fontFace: BODY, fontSize: 11,
        bold: true, color: INK, margin: 0 });
      s.addText(t, { x: x + 0.22, y: y + 0.28, w: 3.4, h: 0.42, fontFace: BODY, fontSize: 9.5,
        color: MUTED, margin: 0, lineSpacing: 12 });
    });
  });

  s.addText("Interoperability reached: structural yes · semantic partly · organisational no.  ·  Most important safety indicator: GREEN cases that still present to a physician within 72 h.",
    { x: M, y: 6.76, w: 12.1, h: 0.3, fontFace: BODY, fontSize: 10, italic: true, color: MUTED, margin: 0 });
  note(s, "The critical stakeholder group is the practice: if the alerts are experienced as a burden, the implementation fails regardless of how good the classification is. Hence alerts only from ORANGE upwards, and alert load as an explicit monitoring indicator.");
}

/* ============================ 14 · IMPACT & REGULATION ============================ */
{
  const s = light("False reassurance weighs more than a false alarm", "Expected impact & regulation", 0);
  const good = ["Earlier treatment when an infection develops", "Fewer contacts without clinical consequence",
                "Complete trajectory for the follow-up appointment", "Structured, standardised follow-up data"];
  const bad  = ["Automation bias — the patient stops observing", "Alert fatigue in the practice",
                "Scaling our own errors consistently, at volume", "Digital divide — the gap may widen"];
  card(s, M, 1.8, 5.9, 2.6, GREENB, "A8D9BF");
  s.addText("Benefits", { x: M + 0.28, y: 1.98, w: 3, h: 0.28, fontFace: BODY, fontSize: 13,
    bold: true, color: GREEN, margin: 0 });
  s.addText(good.map((t, i) => ({ text: t, options: { bullet: { indent: 14 }, breakLine: i < good.length - 1 } })),
    { x: M + 0.28, y: 2.28, w: 5.35, h: 1.95, fontFace: BODY, fontSize: 11.5, color: INK,
      margin: 0, valign: "top", paraSpaceAfter: 6, lineSpacing: 15 });
  card(s, M + 6.2, 1.8, 5.9, 2.6, REDB, "F0ACA6");
  s.addText("Risks", { x: M + 6.48, y: 1.98, w: 3, h: 0.28, fontFace: BODY, fontSize: 13,
    bold: true, color: RED, margin: 0 });
  s.addText(bad.map((t, i) => ({ text: t, options: { bullet: { indent: 14 }, breakLine: i < bad.length - 1 } })),
    { x: M + 6.48, y: 2.28, w: 5.35, h: 1.95, fontFace: BODY, fontSize: 11.5, color: INK,
      margin: 0, valign: "top", paraSpaceAfter: 6, lineSpacing: 15 });

  s.addText("Is WundCheck a medical device?  Yes — SaMD, IMDRF Category II", { x: M, y: 4.62,
    w: 7.4, h: 0.34, fontFace: BODY, fontSize: 14, bold: true, color: INK, margin: 0 });
  body(s, "State of the healthcare situation = serious: an untreated SSI is not self-limiting and can lead to sepsis or revision surgery. Significance of information = drive clinical management: we neither diagnose nor treat, but we determine whether and when clinical action is taken.\n\nStandards that would apply: ISO 14971 · IEC 62304 · IEC 62366 · ISO 13485. The EU AI Act does not — the system is rule-based, a deliberate consequence of avoiding image analysis.",
    M, 5.02, 7.4, 1.7, { fontSize: 11.5, color: MUTED, lineSpacing: 16 });

  const grid = [["", "Inform", "Drive", "Treat/dx"], ["Critical", "IV", "III", "II"],
                ["Serious", "III", "II", "I"], ["Non-serious", "II", "I", "I"]];
  grid.forEach((row, r) => row.forEach((cell, c) => {
    const x = M + 7.9 + c * 1.06, y = 4.62 + r * 0.42;
    const hit = (r === 2 && c === 2);
    if (r > 0 && c > 0) s.addShape(pres.ShapeType.rect, { x, y, w: 1.02, h: 0.38,
      fill: { color: hit ? INK : SOFT }, line: { color: hit ? INK : LINE, width: 1 } });
    s.addText(cell, { x, y, w: 1.02, h: 0.38, align: c === 0 ? "left" : "center", valign: "middle",
      margin: 0, fontFace: BODY, fontSize: r === 0 || c === 0 ? 9.5 : 11,
      bold: hit || r === 0 || c === 0, color: hit ? WHITE : (r === 0 || c === 0 ? MUTED : INK) });
  }));
  s.addText("IMDRF risk categorisation", { x: M + 7.9, y: 6.3, w: 4.2, h: 0.26, fontFace: BODY,
    fontSize: 10, italic: true, color: MUTED, margin: 0 });
  note(s, "One could argue for Category III via sepsis risk. We chose II because the IMDRF category describes the typical condition, not the rare extreme. The reasoning matters more than the answer.");
}

/* ============================ 15 · CONTRIBUTIONS ============================ */
{
  const s = dark();
  s.addText("Individual contributions", { x: M, y: 0.72, w: 9, h: 0.6, fontFace: HEAD,
    fontSize: 30, bold: true, color: WHITE, margin: 0 });
  const roles = [
    ["Clinical lead", "L1 sources & evidence appraisal · health need · personas · L1→L2 challenges", "Slides 2–5, 9"],
    ["L2 lead", "BPMN · data dictionary · decision table · terminology mapping", "Slides 6–8"],
    ["Tech lead", "L3 schema · application · FHIR interface · demo", "Slides 10–11"],
    ["QA & implementation lead", "hazard analysis · test protocol · bug log · M&E · impact · regulation", "Slides 12–14"]
  ];
  roles.forEach(([r, w, p], i) => {
    const y = 1.72 + i * 1.14;
    s.addShape(pres.ShapeType.roundRect, { x: M, y, w: 12.1, h: 0.96, rectRadius: 0.09,
      fill: { color: INK2 }, line: { color: INK2, width: 1 } });
    s.addText(r, { x: M + 0.32, y: y + 0.12, w: 2.9, h: 0.34, fontFace: BODY, fontSize: 13, bold: true,
      color: WHITE, margin: 0, valign: "middle" });
    s.addText("Name  ______________", { x: M + 0.32, y: y + 0.46, w: 2.9, h: 0.3, fontFace: BODY,
      fontSize: 10, color: "8FA3B8", margin: 0, valign: "middle" });
    s.addText(w, { x: M + 3.4, y, w: 6.6, h: 0.96, fontFace: BODY, fontSize: 11.5,
      color: "D6E2EE", margin: 0, valign: "middle" });
    s.addText(p, { x: M + 10.1, y, w: 1.68, h: 0.96, fontFace: BODY, fontSize: 10.5,
      color: "AFC2D6", margin: 0, valign: "middle", align: "right" });
  });
  s.addText("Every member can answer questions on the whole project, not only their own part.",
    { x: M, y: 6.42, w: 12.1, h: 0.3, fontFace: BODY, fontSize: 11.5, italic: true,
      color: PALE, margin: 0 });
  note(s, "Fill in the names before submission. Keep it concrete — 'we all worked together' is the weakest possible formulation.");
}

/* ============================ BACKUP SLIDES ============================ */
function backup(title, kicker) {
  const s = light(title, "Backup · " + kicker, 0);
  return s;
}

/* B1 — decision table */
{
  const s = backup("Decision table — all 18 rules", "L2");
  const R = [
    ["R1","red","temp ≥ 39 OR chills = 1","CDC · sepsis red flags"],
    ["R2","red","red_streak = 1 OR redness_extent = 4","NICE NG125 §1.4.9"],
    ["R3","red","wound_open = 2 OR bleeding = 2 OR wound_state = 4","CDC deep incisional"],
    ["R9","orange","wellbeing = 2 OR nausea_vomiting = 2","systemic signs"],
    ["R4","orange","secretion = 3 OR secretion_smell = 1","CDC superficial incisional"],
    ["R5","orange","fever OR (pain ≥ 7 AND worsening AND day ≥ 3)","CDC · NICE"],
    ["R11","orange","secretion ≥ 1 AND discharge ≥ 3 days","Southampton IIId"],
    ["R12","orange","classification = yellow AND yesterday = yellow","persistence"],
    ["R6b","yellow","Southampton II OR swelling = 3 (from day 1)","Southampton II"],
    ["R6a","yellow","Southampton I AND day ≥ 3","wound healing phases"],
    ["R7","yellow","wound_open = 1 OR numbness OR mobility change","follow-up standards"],
    ["R10","yellow","bleeding ≥ 1 AND anticoagulants","bleeding assessment"],
    ["R8","green","catch-all","—"],
    ["I1–I5","info","risk factors · medication · smoking · scab · high-risk procedure","non-exclusive"]
  ];
  const COL = { red: RED, orange: ORANGE, yellow: YELLOW, green: GREEN, info: MUTED };
  R.forEach(([id, p, cond, ref], i) => {
    const y = 1.72 + i * 0.37;
    s.addShape(pres.ShapeType.rect, { x: M, y, w: 0.08, h: 0.32, fill: { color: COL[p] }, line: { color: COL[p], width: 1 } });
    s.addText(id, { x: M + 0.22, y, w: 0.8, h: 0.32, fontFace: BODY, fontSize: 10, bold: true, color: INK, margin: 0, valign: "middle" });
    s.addText(cond, { x: M + 1.05, y, w: 7.8, h: 0.32, fontFace: BODY, fontSize: 10, color: INK, margin: 0, valign: "middle" });
    s.addText(ref, { x: M + 9.0, y, w: 3.05, h: 0.32, fontFace: BODY, fontSize: 9.5, color: MUTED, margin: 0, valign: "middle" });
  });
}

/* B2 — test protocol */
{
  const s = backup("Test protocol — 19 decision-logic cases, all passing", "QA");
  const T = [
    ["T1","R1 fever · temp 39.2","RED (R1)"],["T2","R1 boundary · temp 39.0","RED — inclusive"],
    ["T3","R3 safety · image “open/pus” alone","RED (R3)"],["T4","R5 before R6","ORANGE (R5)"],
    ["T5","mild signs on day 2","GREEN"],["T6","conditional logic","3 follow-ups hidden"],
    ["T7","constraint · temp 45","input rejected"],["T8","info rules non-exclusive","GREEN + I1 + I2 + I3"],
    ["T9","scab reassures","GREEN + I4"],["T10","worst-first vs reassurance","ORANGE (R4) + I4"],
    ["T11","B-02 fixed · feeling unwell","ORANGE (R9)"],["T12","B-03 fixed · red streak","RED (R2)"],
    ["T13","B-01 fixed · grade II on day 2","YELLOW (R6b)"],["T14","B-01 counter-check","GREEN"],
    ["T15","Southampton derivation","grade IV → ORANGE"],["T16","B-05 fixed · bleeding + anticoag","YELLOW (R10)"],
    ["T17","persistence rule","ORANGE (R12)"],["T18","discharge ≥ 3 days","ORANGE (R11)"],
    ["T19","threshold change without rebuild","GREEN → ORANGE"]
  ];
  T.forEach(([id, what, exp], i) => {
    const col = i % 2, row = i % 10;
    const x = M + col * 6.15, y = 1.72 + row * 0.48;
    if (i >= 20) return;
    const xx = i < 10 ? M : M + 6.15, yy = 1.72 + (i % 10) * 0.48;
    s.addShape(pres.ShapeType.roundRect, { x: xx, y: yy, w: 5.95, h: 0.4, rectRadius: 0.06,
      fill: { color: i % 2 ? WHITE : SOFT }, line: { color: LINE, width: 1 } });
    s.addText(id, { x: xx + 0.16, y: yy, w: 0.6, h: 0.4, fontFace: BODY, fontSize: 10, bold: true, color: INK, margin: 0, valign: "middle" });
    s.addText(what, { x: xx + 0.78, y: yy, w: 3.0, h: 0.4, fontFace: BODY, fontSize: 9.5, color: INK, margin: 0, valign: "middle" });
    s.addText(exp, { x: xx + 3.82, y: yy, w: 1.8, h: 0.4, fontFace: BODY, fontSize: 9.5, color: MUTED, margin: 0, valign: "middle" });
    s.addText("✓", { x: xx + 5.6, y: yy, w: 0.3, h: 0.4, align: "center", valign: "middle", margin: 0, fontFace: BODY, fontSize: 11, bold: true, color: GREEN });
  });
  s.addText("Reproduce: node tools/run-tests.mjs   ·   node tools/check-fhir.mjs   ·   node tools/check-hardcoding.mjs",
    { x: M, y: 6.66, w: 12.1, h: 0.3, fontFace: BODY, fontSize: 10.5, italic: true, color: MUTED, margin: 0 });
}

/* B3 — hazard matrix */
{
  const s = backup("Hazard analysis and risk matrix", "QA");
  const HZ = [
    ["H-01","An infection is classified GREEN",5,3,15,RED],
    ["H-02","An emergency is classified ORANGE",5,2,10,ORANGE],
    ["H-03","The patient abandons the check",3,3,9,YELLOW],
    ["H-04","False alarm during normal healing",2,4,8,YELLOW],
    ["H-06","The practice overlooks an alert",4,2,8,YELLOW],
    ["H-05","An implausible input is processed",3,2,6,GREEN]
  ];
  HZ.forEach(([id, t, sev, lik, sc, col], i) => {
    const y = 1.9 + i * 0.66;
    s.addShape(pres.ShapeType.roundRect, { x: M, y, w: 7.1, h: 0.56, rectRadius: 0.06,
      fill: { color: i % 2 ? WHITE : SOFT }, line: { color: LINE, width: 1 } });
    s.addText(id, { x: M + 0.2, y, w: 0.7, h: 0.56, fontFace: BODY, fontSize: 10.5, bold: true, color: INK, margin: 0, valign: "middle" });
    s.addText(t, { x: M + 0.95, y, w: 4.3, h: 0.56, fontFace: BODY, fontSize: 11, color: INK, margin: 0, valign: "middle" });
    s.addText("sev " + sev + " · lik " + lik, { x: M + 5.3, y, w: 0.95, h: 0.56, fontFace: BODY, fontSize: 8.5, color: MUTED, margin: 0, valign: "middle" });
    chip(s, M + 6.42, y + 0.14, 0.5, String(sc), WHITE, col);
  });

  /* matrix with axes */
  const gx = M + 8.35, gy = 1.9, cw = 0.66, ch = 0.62;
  s.addText("Severity", { x: gx - 1.42, y: gy + 1.2, w: 1.2, h: 0.3, fontFace: BODY, fontSize: 10,
    bold: true, color: MUTED, margin: 0, align: "right", rotate: 270 });
  for (let r = 5; r >= 1; r--) {
    const y = gy + (5 - r) * ch;
    s.addText(String(r), { x: gx - 0.42, y, w: 0.32, h: ch, align: "right", valign: "middle",
      margin: 0, fontFace: BODY, fontSize: 9.5, bold: true, color: MUTED });
    for (let c = 1; c <= 5; c++) {
      const x = gx + (c - 1) * cw, score = r * c;
      const col = score >= 15 ? REDB : score >= 9 ? ORANGEB : score >= 5 ? YELLOWB : GREENB;
      s.addShape(pres.ShapeType.rect, { x, y, w: cw - 0.04, h: ch - 0.04,
        fill: { color: col }, line: { color: WHITE, width: 2 } });
      const hit = HZ.find(h => h[2] === r && h[3] === c);
      s.addText(hit ? hit[0] : String(score), { x, y, w: cw - 0.04, h: ch - 0.04, align: "center",
        valign: "middle", margin: 0, fontFace: BODY, fontSize: hit ? 9 : 8.5,
        bold: !!hit, color: hit ? INK : "667788" });
    }
  }
  for (let c = 1; c <= 5; c++)
    s.addText(String(c), { x: gx + (c - 1) * cw, y: gy + 5 * ch, w: cw - 0.04, h: 0.26,
      align: "center", margin: 0, fontFace: BODY, fontSize: 9.5, bold: true, color: MUTED });
  s.addText("Likelihood", { x: gx, y: gy + 5 * ch + 0.28, w: 5 * cw, h: 0.28, align: "center",
    margin: 0, fontFace: BODY, fontSize: 10, bold: true, color: MUTED });
  s.addText("Score \u2265 10 → full test coverage.  Score 6–9 → sample-based coverage.",
    { x: M, y: 6.34, w: 12.1, h: 0.3, fontFace: BODY, fontSize: 11, italic: true, color: MUTED, margin: 0 });
}

/* B4 — app detail BPMN */
{
  const s = backup("Detailed process inside the app", "L2 · validation loop and worst-first cascade");
  s.addImage({ path: "workflow-app-detail.png", x: (W - 11.5) / 2, y: 1.68, w: 11.5, h: 11.5 / 2.157 });
}

/* B5 — FHIR */
{
  const s = backup("The FHIR interface — a real transaction bundle, not a download", "L3 / L4");
  const res = [
    ["QuestionnaireResponse", "every answer, typed and terminology-coded; canonical carries the L3 version", "every run"],
    ["Observation", "traffic light, Southampton grade, triggering rule, L3 version, days post-op", "every run"],
    ["Communication", "structured alert, priority urgent (ORANGE) or stat (RED)", "ORANGE / RED only"]
  ];
  res.forEach(([n, d, w], i) => {
    const y = 1.78 + i * 0.94;
    card(s, M, y, 12.1, 0.82, i === 2 ? ORANGEB : WHITE, i === 2 ? "F0C19A" : LINE);
    s.addText(n, { x: M + 0.28, y, w: 3.1, h: 0.82, fontFace: BODY, fontSize: 12.5, bold: true,
      color: i === 2 ? ORANGE : INK, margin: 0, valign: "middle" });
    s.addText(d, { x: M + 3.5, y, w: 6.5, h: 0.82, fontFace: BODY, fontSize: 11, color: MUTED, margin: 0, valign: "middle" });
    s.addText(w, { x: M + 9.95, y, w: 1.85, h: 0.82, fontFace: BODY, fontSize: 10, italic: true, color: MUTED, margin: 0, valign: "middle", align: "right" });
  });
  card(s, M, 4.68, 12.1, 1.9, INK, INK);
  s.addText("The endpoint is configuration, not code", { x: M + 0.32, y: 4.88, w: 11.4, h: 0.3,
    fontFace: BODY, fontSize: 13, bold: true, color: WHITE, margin: 0 });
  s.addText('"fhir": { "endpoint": "https://…/baseR4", "patient_reference": "Patient/example",\n          "alert_recipient": "Organization/practice", "send_mode": "transaction" }',
    { x: M + 0.32, y: 5.24, w: 11.4, h: 0.7, fontFace: "Courier New", fontSize: 11, color: "C9D6E4", margin: 0, lineSpacing: 16 });
  s.addText("Redirecting to a hospital FHIR server or the Swiss EPD gateway is one line of JSON. If the endpoint is unreachable the bundle queues — the patient still gets the recommendation.",
    { x: M + 0.32, y: 6.0, w: 11.4, h: 0.45, fontFace: BODY, fontSize: 11, color: PALE, margin: 0, lineSpacing: 15 });
}

/* B6 — traceability */
{
  const s = backup("Traceability — one finding, all the way through", "Method");
  const chainRows = [
    ["L1", "CDC/NHSN — “purulent drainage from the superficial incision”", INK],
    ["L2", "DE-035 discharge · SNOMED 449736006 · rule R4 → ORANGE", INK],
    ["L3", '"when": "secretion = 3 or secretion_smell = 1"', INK],
    ["L4", "image selection “cloudy / purulent” → SUSPECTED INFECTION", ORANGE],
    ["QA", "T10, T15 — passed · challenge C-09 documents the severity/urgency split", GREEN],
    ["FHIR", "QuestionnaireResponse.item[secretion] + Observation.component", INK]
  ];
  chainRows.forEach(([l, t, col], i) => {
    const y = 1.8 + i * 0.78;
    s.addShape(pres.ShapeType.roundRect, { x: M, y, w: 0.9, h: 0.6, rectRadius: 0.08,
      fill: { color: col === INK ? SOFT : col }, line: { color: col === INK ? LINE : col, width: 1 } });
    s.addText(l, { x: M, y, w: 0.9, h: 0.6, align: "center", valign: "middle", margin: 0,
      fontFace: BODY, fontSize: 12, bold: true, color: col === INK ? MUTED : WHITE });
    s.addText(t, { x: M + 1.15, y, w: 10.9, h: 0.6, fontFace: BODY, fontSize: 13.5, color: INK, margin: 0, valign: "middle" });
    if (i < 5) s.addText("▼", { x: M + 0.35, y: y + 0.6, w: 0.2, h: 0.18, align: "center", margin: 0, fontFace: BODY, fontSize: 8, color: MUTED });
  });
  s.addText("Every element, rule, challenge, hazard, test and defect carries an ID that is identical in all artefacts.",
    { x: M, y: 6.5, w: 12.1, h: 0.3, fontFace: BODY, fontSize: 11.5, italic: true, color: MUTED, margin: 0 });
}

/* B-L3 — the machine-readable layer shown, not just described */
{
  const s = backup("The L3 in one screen — this file is the CDSS", "L3 · wundcheck-l3.json v0.3.3");
  const CODE = "Consolas";
  const lines = [
    ['{ "meta": {', 0, MUTED],
    ['    "version": "0.3.3",  "languages": ["en","de"],  "default_language": "en",', 0, INK],
    ['    "l1_sources": [ CDC/NHSN · NICE NG125 · Southampton · Campwala 2019 ],', 0, INK],
    ['    "thresholds": { "fever_orange": 38.0,   // CDC — deep incisional SSI', 0, GREEN],
    ['                    "fever_red":    39.0,   // group decision — challenge C-07', 0, GREEN],
    ['                    "normal_healing_days": 3 },  // group decision — C-03', 0, GREEN],
    ['    "fhir": { "endpoint": "…/baseR4", "send_mode": "transaction" } },', 0, ORANGE],
    ['', 0, MUTED],
    ['  "elements": [ {', 0, MUTED],
    ['      "id": "secretion",  "de_id": "DE-035",  "type": "select_one",', 0, INK],
    ['      "label":   { "en": "Is fluid coming out of the wound?",', 0, INK],
    ['                   "de": "Kommt Flüssigkeit aus der Wunde?" },', 0, INK],
    ['      "options": [ 0 = none · 1 = clear · 2 = bloody · 3 = purulent, each with an image ],', 0, INK],
    ['      "terminology": { "snomed": "449736006" },', 0, INK],
    ['      "fhir": "Observation.valueCodeableConcept",', 0, INK],
    ['      "l1_source": "CDC/NHSN — purulent drainage · Southampton III–IV" } ],', 0, INK],
    ['', 0, MUTED],
    ['  "decision_rules": [ {', 0, MUTED],
    ['      "id": "R4",  "priority": "orange",  "exclusive": true,', 0, INK],
    ['      "when":   "secretion = 3 or secretion_smell = 1",', 0, RED],
    ['      "output": { "en": "SUSPECTED INFECTION — contact your practice today…" },', 0, INK],
    ['      "annotation": "Purulent drainage is a primary criterion of superficial SSI.",', 0, INK],
    ['      "reference":  "CDC/NHSN superficial incisional SSI · Southampton IV" } ] }', 0, INK]
  ];
  card(s, M, 1.7, 8.55, 5.05, SOFT, LINE);
  lines.forEach(([t, , col], i) => {
    s.addText(t, { x: M + 0.26, y: 1.84 + i * 0.208, w: 8.1, h: 0.2, fontFace: CODE,
      fontSize: 9, color: col, margin: 0, valign: "middle" });
  });

  const notes = [
    ["Bilingual by construction", "Every user-facing string is a language-keyed object. A further language is a content change, not a code change."],
    ["Thresholds carry their source", "Each constant names where it comes from — a guideline value or a documented group decision."],
    ["Rules carry their reference", "Every rule states its L1 source and an annotation, so a clinician can review it without reading code."],
    ["The endpoint is configuration", "Redirecting to a hospital FHIR server is one line — no code change, no rebuild."]
  ];
  notes.forEach(([h, t], i) => {
    const y = 1.7 + i * 1.29;
    card(s, M + 8.85, y, 3.25, 1.16);
    s.addText(h, { x: M + 9.08, y: y + 0.12, w: 2.8, h: 0.26, fontFace: BODY, fontSize: 10.5,
      bold: true, color: INK, margin: 0 });
    s.addText(t, { x: M + 9.08, y: y + 0.4, w: 2.8, h: 0.68, fontFace: BODY, fontSize: 9,
      color: MUTED, margin: 0, lineSpacing: 11 });
  });
  s.addText("48 elements · 18 rules · 54 KB · read by the L4 at runtime — swap this file and the app becomes a different CDSS.",
    { x: M, y: 6.9, w: 12.1, h: 0.3, fontFace: BODY, fontSize: 10, italic: true, color: MUTED, margin: 0 });
}

/* B0 — data dictionary excerpt with the columns the assignment names as the minimum */
{
  const s = backup("Data dictionary — the four required columns", "L2 · excerpt of 48 elements");
  const cols = ["ID", "Label", "Type", "Response options", "Conditional logic", "Constraint", "Terminology"];
  const wds  = [0.78, 2.35, 1.05, 3.15, 1.75, 1.55, 1.47];
  let x = M;
  cols.forEach((c, i) => {
    s.addText(c.toUpperCase(), { x, y: 1.72, w: wds[i], h: 0.24, fontFace: BODY, fontSize: 8.5,
      bold: true, charSpacing: 0.8, color: MUTED, margin: 0 });
    x += wds[i] + 0.05;
  });
  const rows = [
    ["DE-020","Body temperature today","decimal","free numeric input, °C","—","34–43 °C","LOINC 8310-5"],
    ["DE-023","Pain 0–10","integer","NRS 0–10","—","0–10","LOINC 72514-3"],
    ["DE-026","How do you feel overall?","select_one","0 = well · 1 = tired · 2 = really unwell","—","—","SNOMED 386661006"],
    ["DE-030","Which picture matches your wound?","select_one","1 = calm & dry · 2 = slightly red · 3 = markedly red & swollen · 4 = open / pus","—","—","SNOMED 225552003"],
    ["DE-032","Does a red streak run away?","select_one","1 = yes · 0 = no","none — deliberately ungated (B-03)","—","SNOMED 46117009"],
    ["DE-035","Is fluid coming out?","select_one","0 = none · 1 = clear · 2 = bloody · 3 = cloudy / purulent","—","—","SNOMED 449736006"],
    ["DE-036","Does the discharge smell?","select_one","1 = yes · 0 = no","secretion ≥ 1","—","SNOMED 288227007"],
    ["DE-037","One spot or the whole wound?","select_one","1 = small spot · 2 = along the wound","secretion ≥ 1","—","—"],
    ["DE-038","For how many days?","integer","free numeric input, days","secretion ≥ 1","0–60","—"],
    ["DE-025","Did pain disturb your sleep?","select_one","1 = yes · 0 = no","pain ≥ 4","—","SNOMED 301345002"],
    ["DE-045","Southampton grade","calculated","0 · I · II · III · IV · V","derived from 5 elements","—","SNOMED 225552003"]
  ];
  rows.forEach((r, i) => {
    const y = 2.02 + i * 0.44;
    card(s, M, y, 12.1, 0.38, i % 2 ? WHITE : SOFT, i % 2 ? WHITE : LINE);
    let cx = M + 0.02;
    r.forEach((cell, j) => {
      s.addText(cell, { x: cx, y, w: wds[j], h: 0.38, fontFace: BODY, fontSize: 8,
        bold: j === 0, color: j === 0 ? INK : (j >= 5 ? MUTED : INK), margin: 0, valign: "middle" });
      cx += wds[j] + 0.05;
    });
  });
  s.addText("48 elements in total · 9 derived · 4 with conditional logic · 8 with constraints · 38 with a terminology binding · 47 with a FHIR mapping.  Full table: docs/05.",
    { x: M, y: 6.94, w: 12.1, h: 0.3, fontFace: BODY, fontSize: 10, italic: true, color: MUTED, margin: 0 });
}

/* B7 — depth that did not fit into 10 minutes */
{
  const s = backup("Depth that did not fit into ten minutes", "Documentation");
  const blocks = [
    ["Testing types applied (Day 5 vocabulary)", [
      "L2 verification — decision table ↔ BPMN cascade ↔ L3 rules reconciled",
      "Functional testing — individual rules, exclusions, severity order, boundary values",
      "Integration testing — derived elements → rules → output; conditional logic → rule reachability",
      "Usability testing — image assignment by lay people: NOT carried out, our largest residual risk"
    ]],
    ["The L3 implementation package (Day 3)", [
      "Documentation — health need, personas, BPMN",
      "Content / workflow — sections, relevant, decision rules",
      "Terminology — SNOMED CT / LOINC / ICD-10 bindings",
      "Validation — 19 test cases, test data, conformance checks",
      "Interfaces — FHIR export · UI/UX — image options, traffic light"
    ]],
    ["Stakeholders and where it could fail", [
      "The critical group is the practice, not the patient",
      "If Sandra experiences the alerts as a burden, the rollout fails — however good the classification is",
      "Hence: alerts only from ORANGE upwards, structured instead of free text, alert load measured explicitly"
    ]],
    ["What we would do with three more months", [
      "1 · Clinical sign-off on every threshold and rule — it settles all nine L1→L2 decisions at once",
      "2 · Usability study on the image assignment — validates the central design idea",
      "3 · Graphics for several skin tones and body regions",
      "4 · Convert the L3 to a FHIR Questionnaire — the software neutrality we consciously gave up"
    ]]
  ];
  blocks.forEach(([title, items], i) => {
    const x = M + (i % 2) * 6.15, y = 1.74 + Math.floor(i / 2) * 2.56;
    card(s, x, y, 5.95, 2.34, i % 3 === 0 ? SOFT : WHITE, LINE);
    s.addText(title, { x: x + 0.26, y: y + 0.16, w: 5.4, h: 0.3, fontFace: BODY, fontSize: 12.5,
      bold: true, color: INK, margin: 0 });
    s.addText(items.map((t, j) => ({ text: t,
        options: { bullet: { indent: 14 }, breakLine: j < items.length - 1 } })),
      { x: x + 0.26, y: y + 0.52, w: 5.4, h: 1.7, fontFace: BODY, fontSize: 10,
        color: MUTED, margin: 0, paraSpaceAfter: 5, lineSpacing: 13 });
  });
}

/* B7 — sources */
{
  const s = backup("Sources", "References");
  const src = [
    ["Woelber E et al.", "Proportion of Surgical Site Infections Occurring after Hospital Discharge: A Systematic Review. Surg Infect 2016;17(5):510–19.", "60.1 % post-discharge"],
    ["ECDC", "Healthcare-associated infections: surgical site infections — Annual Epidemiological Report 2017.", "0.5–10.1 % by procedure"],
    ["CDC / NHSN", "Surgical Site Infection Event (SSI). Patient Safety Component Manual.", "30 / 90-day window"],
    ["NICE", "Surgical site infections: prevention and treatment. NG125, 11 Apr 2019, upd. 19 Aug 2020.", "nice.org.uk/guidance/ng125"],
    ["Bailey IS et al.", "Southampton Wound Scoring System.", "grades 0–V"],
    ["Campwala I, Unsell K, Gupta S", "A Comparative Analysis of Surgical Wound Infection Methods: CDC, ASEPSIS and Southampton in breast reconstruction SSI. Plastic Surgery, 2019.", "PMID 31106164"],
    ["WHO", "Monitoring and Evaluating Digital Health Interventions: a practical guide. 2016.", "maturity stages"],
    ["WHO", "SMART Guidelines — the L1–L5 knowledge layers.", "who.int"],
    ["IMDRF", "Software as a Medical Device: possible framework for risk categorisation.", "categories I–IV"],
    ["HL7", "FHIR R4 — QuestionnaireResponse, Observation, Communication.", "hl7.org/fhir/R4"]
  ];
  src.forEach(([a, t, r], i) => {
    const y = 1.7 + i * 0.52;
    s.addShape(pres.ShapeType.roundRect, { x: M, y, w: 12.1, h: 0.46, rectRadius: 0.06,
      fill: { color: i % 2 ? WHITE : SOFT }, line: { color: LINE, width: 1 } });
    s.addText(a, { x: M + 0.24, y, w: 2.6, h: 0.46, fontFace: BODY, fontSize: 11, bold: true, color: INK, margin: 0, valign: "middle" });
    s.addText(t, { x: M + 2.95, y, w: 7.0, h: 0.46, fontFace: BODY, fontSize: 10, color: MUTED, margin: 0, valign: "middle" });
    s.addText(r, { x: M + 10.1, y, w: 1.85, h: 0.46, fontFace: BODY, fontSize: 9.5, italic: true, color: MUTED, margin: 0, valign: "middle", align: "right" });
  });
}

pres.writeFile({ fileName: "WundCheck_CDSS_Presentation.pptx" })
  .then(f => console.log("written:", f));
