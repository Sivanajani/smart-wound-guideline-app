#!/usr/bin/env python3
"""Builds an autoplaying copy of the L4 that drives itself through a realistic
demo — synthetic cursor, real clicks, real scrolling, real rule evaluation —
and adds a caption bar. Used as the recording source for the demo video."""
import pathlib, json, datetime

APP = pathlib.Path("l4/wundcheck-app.html").read_text(encoding="utf-8")
d = lambda n: (datetime.date.today() - datetime.timedelta(days=n)).isoformat()

DRIVER = r"""
/* ---------------- demo driver: synthetic cursor + scripted interaction ------------- */
const CUR = document.createElement("div");
CUR.style.cssText = "position:fixed;left:50vw;top:50vh;width:22px;height:22px;z-index:9999;" +
  "pointer-events:none;transition:left .55s cubic-bezier(.4,0,.2,1),top .55s cubic-bezier(.4,0,.2,1);" +
  "background:rgba(18,32,46,.92);border:2px solid #fff;border-radius:50% 50% 50% 2px;" +
  "box-shadow:0 2px 10px rgba(0,0,0,.35)";
document.body.appendChild(CUR);

const BAR = document.createElement("div");
BAR.style.cssText = "position:fixed;left:0;right:0;bottom:0;z-index:9998;background:#12202e;" +
  "color:#fff;padding:16px 34px 18px;font:600 20px/1.3 system-ui,sans-serif;" +
  "box-shadow:0 -6px 24px rgba(0,0,0,.18)";
BAR.innerHTML = "<div id='capT'></div><div id='capS' style='font-weight:400;font-size:15.5px;" +
  "color:#a9bed4;margin-top:5px'></div>";
document.body.appendChild(BAR);
document.body.style.paddingBottom = "104px";
const cap = (t, s) => { capT.textContent = t; capS.textContent = s || ""; };

const wait  = ms => new Promise(r => setTimeout(r, ms));
const ease  = (el) => { const r = el.getBoundingClientRect();
  CUR.style.left = (r.left + r.width * 0.28) + "px";
  CUR.style.top  = (r.top  + r.height * 0.5) + "px"; };
async function scrollTo(el, pad = 170) {
  const y = window.scrollY + el.getBoundingClientRect().top - pad;
  window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
  await wait(750);
}
async function click(el, pause = 620) {
  if (!el) return;
  await scrollTo(el, 240); ease(el); await wait(620);
  CUR.style.transform = "scale(.72)";
  el.click(); await wait(150); CUR.style.transform = "scale(1)";
  await wait(pause);
}
const qLabel = re => [...document.querySelectorAll(".q")].find(q => re.test(q.textContent));
const opt = (re, txt) => { const q = qLabel(re); if (!q) return null;
  return [...q.querySelectorAll("label.opt")].find(l => l.textContent.trim().startsWith(txt)); };
async function type(re, value) {
  const q = qLabel(re); if (!q) return;
  const i = q.querySelector("input"); await scrollTo(q, 240); ease(i); await wait(500);
  const s = String(value);
  for (let k = 1; k <= s.length; k++) { i.value = s.slice(0, k);
    i.dispatchEvent(new Event("input", { bubbles: true })); await wait(130); }
  i.dispatchEvent(new Event("blur", { bubbles: true })); await wait(400);
}
window.alert = () => {};                       /* never block the recording on a modal */
function fillMissing() {                        /* guarantee validate() can pass */
  for (const e of L3.elements) {
    if (e.type === "calculated" || !e.required) continue;
    if (e.relevant && evaluate(e.relevant) !== true) continue;
    const v = answers[e.id];
    if (v !== undefined && v !== "" && v !== null) continue;
    answers[e.id] = e.type === "select_one" ? e.options[e.options.length - 1].value
                  : e.type === "integer" || e.type === "decimal" ? 0 : "—";
  }
  render();
}
const formEl = () => document.getElementById("form");
async function resultOnly() {                   /* the app shows a result screen, not the form */
  formEl().style.display = "none";
  document.querySelector(".actions").style.display = "none";
  window.scrollTo({ top: 0, behavior: "smooth" }); await wait(900);
}
async function backToForm() {
  formEl().style.display = ""; document.querySelector(".actions").style.display = "";
  document.getElementById("output").innerHTML = "";
  window.scrollTo({ top: 0, behavior: "smooth" }); await wait(700);
}
const btn = txt => [...document.querySelectorAll("button.btn")].find(b => b.textContent.trim() === txt);

/* the FHIR endpoint is unreachable from the recording sandbox — stub the response so the
   success path is visible. On a networked machine the same call reaches the real server. */
window.fetch = async () => ({ ok: true, status: 200, text: async () => JSON.stringify(
  { resourceType: "Bundle", type: "transaction-response", entry: [
    { response: { location: "QuestionnaireResponse/2f81/_history/1" } },
    { response: { location: "Observation/5a03/_history/1" } },
    { response: { location: "Communication/9c17/_history/1" } } ] }) });

async function run() {
  await wait(1000);
  cap("Day 6 after surgery — the daily check",
      "Baseline data is asked once. Each day the patient answers about twelve questions in under three minutes.");
  answers = __ONCE__; render(); await wait(1500);

  /* routine answers are pre-set; we click the clinically interesting ones */
  Object.assign(answers, { temp: 36.9, chills: 0, pain: 2, pain_trend: 0, wellbeing: 0,
    nausea_vomiting: 0, appetite: 0, meds_taken: 1, redness_extent: 0, red_streak: 0,
    swelling: 0, warmth: 0, bleeding: 0, wound_open: 0, numbness: 0, mobility_change: 0,
    dressing_changed_today: 0 });
  render(); await wait(1000);

  cap("The wound is selected as a picture",
      "Southampton grades 0–V instead of clinical terms — this crosses language and literacy barriers.");
  await click(opt(/Which picture best matches/i, "Calm & dry"), 1100);
  await click(opt(/Is fluid coming out/i, "None"), 1100);
  cap("A scab has formed — and that worries the patient",
      "A normal sign of healing that laypeople routinely read as a problem.");
  await click(opt(/scab or crust/i, "Yes"), 1100);

  cap("Evaluate", "Eighteen rules, evaluated worst-first.");
  fillMissing(); await wait(400);
  await click(btn("Evaluate check"), 1000);
  await resultOnly();
  cap("GREEN — and it says why",
      "The system actively reassures and names the reason. No call to the clinic.");
  await wait(4800);

  await backToForm();
  document.querySelector(".actions").style.display = "";
  await click(btn("New day"), 1000);
  cap("Day 7 — the wound has changed",
      "38.3 °C, pain increasing, markedly reddened, cloudy discharge.");
  Object.assign(answers, { temp: 38.3, chills: 0, pain: 6, pain_trend: 2, wellbeing: 1,
    nausea_vomiting: 0, appetite: 1, meds_taken: 1, redness_extent: 3, red_streak: 0,
    swelling: 2, warmth: 1, bleeding: 0, wound_open: 0, crust: 0, numbness: 0,
    mobility_change: 0, dressing_changed_today: 1, secretion_smell: 0,
    discharge_extent: 1, discharge_duration_days: 1 });
  render(); await wait(1100);
  await click(opt(/Which picture best matches/i, "Markedly reddened"), 1100);
  await click(opt(/Is fluid coming out/i, "Cloudy"), 1200);
  fillMissing(); await wait(400);
  await click(btn("Evaluate check"), 1000);
  await resultOnly();
  cap("ORANGE — suspected infection",
      "Rule R4: purulent discharge is a primary criterion of a superficial incisional SSI.");
  await wait(4600);

  cap("Straight into the patient record",
      "A FHIR R4 transaction bundle — with a Communication alert, because this case is ORANGE.");
  document.querySelector(".actions").style.display = "";
  await click(btn("Send to patient record"), 1300);
  document.querySelector(".actions").style.display = "none";
  await wait(4000);

  /* a third day, deliberately borderline — this is the case the threshold change flips */
  await backToForm();
  document.querySelector(".actions").style.display = "";
  await click(btn("New day"), 1000);
  cap("Day 8 — a borderline case", "37.6 °C. Everything else unremarkable.");
  Object.assign(answers, { temp: 37.6, chills: 0, pain: 3, pain_trend: 1, wellbeing: 0,
    nausea_vomiting: 0, appetite: 0, meds_taken: 1, wound_state: 1, redness_extent: 0,
    red_streak: 0, swelling: 0, warmth: 0, secretion: 0, bleeding: 0, wound_open: 0,
    crust: 0, numbness: 0, mobility_change: 0, dressing_changed_today: 0 });
  render(); await wait(1400);
  fillMissing(); await wait(300);
  await click(btn("Evaluate check"), 1000);
  await resultOnly();
  cap("GREEN — 37.6 °C is below the 38.0 °C threshold",
      "The rule is right. But is the threshold?");
  await wait(4200);

  cap("Every threshold lives in the L3",
      "Each constant names its source: a guideline value, or a documented group decision.");
  const dev = document.querySelector("details.dev");
  await scrollTo(dev, 200); ease(dev.querySelector("summary")); await wait(600);
  dev.open = true; await wait(2000);
  const thr = document.querySelector("[data-thr=fever_orange]");
  await scrollTo(thr, 300); ease(thr); await wait(900);

  cap("Change one value — the guideline update a clinician would make", "fever_orange 38.0 → 37.5");
  thr.style.outline = "3px solid #c25c07"; await wait(900);
  for (const v of ["38.", "37.", "37.5"]) { thr.value = v; await wait(480); }
  await wait(900);
  await click(document.getElementById("btnThr"), 1300);
  await resultOnly();
  document.querySelector("details.dev").open = false;
  cap("Same patient, same answers — different result.",
      "No rebuild. No developer. Not one line of code was touched.");
  await wait(5600);

  cap("That is the point of the layer model",
      "The app renders and executes. All clinical knowledge — questions, thresholds, rules — lives in the L3.");
  await wait(5000);
  document.body.dataset.done = "1";
}
run();
"""

ONCE = {"pat_name": "Peter Brunner", "pat_dob": "1968-04-12", "op_date": d(6), "op_site": 7,
        "closure": 1, "wound_class": 1, "op_duration_min": 95, "antibiotic_prophylaxis": 1,
        "drainage_present": 0, "diabetes": 0, "smoker": 1, "immunosuppr": 0, "anticoag": 0,
        "height": 178, "weight": 88}

anchor = '  lang = L3.meta.default_language || "en";\n  render();\n})();'
code = ('  lang = L3.meta.default_language || "en";\n  render();\n'
        + DRIVER.replace("__ONCE__", json.dumps(ONCE)) + '\n})();')
pathlib.Path("autoplay.html").write_text(APP.replace(anchor, code), encoding="utf-8")
print("autoplay.html gebaut")
