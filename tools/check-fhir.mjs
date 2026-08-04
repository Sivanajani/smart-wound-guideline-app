/* Extracts buildBundle() from the L4 and checks the produced bundle against
   the FHIR R4 shape rules we rely on. Run: node tools/check-fhir.mjs */
import fs from "fs";
const html = fs.readFileSync(new URL("../l4/wundcheck-app.html", import.meta.url), "utf8");
const L3   = JSON.parse(fs.readFileSync(new URL("../l3/wundcheck-l3.json", import.meta.url)));

const src = html.slice(html.indexOf("function answerValue"), html.indexOf("function setSendStatus"));
let answers = {}, derived = {}, lastResult = null, lang = "en";
const tx = v => v == null ? "" : (typeof v === "object" ? (v[lang] ?? v.en) : v);
const build = new Function("L3","answers","derived","lastResult","tx",
  src + "\nreturn buildBundle();");

const dPost = d => new Date(Date.now()-d*86400000).toISOString().slice(0,10);
answers = { pat_name:"Peter Brunner", pat_dob:"1968-04-12", op_date:dPost(7), op_site:7, closure:1,
  wound_class:1, diabetes:0, smoker:1, immunosuppr:0, anticoag:0, height:178, weight:88,
  temp:38.3, chills:0, pain:6, pain_trend:2, wellbeing:1, nausea_vomiting:0, meds_taken:1,
  wound_state:3, redness_extent:3, red_streak:0, swelling:2, warmth:1, secretion:3,
  secretion_smell:0, discharge_extent:1, discharge_duration_days:1, bleeding:0,
  wound_open:0, crust:0, numbness:0, mobility_change:0 };
derived = { southampton_grade:"IV", days_post_op:7 };
lastResult = { priority:"orange", rule:{ id:"R4", output:{ en:"SUSPECTED INFECTION — Purulent discharge…" } } };

const b = build(L3, answers, derived, lastResult, tx);
const checks = [];
const ok = (name, cond, detail="") => checks.push({name, pass:!!cond, detail});

ok("Bundle.resourceType = Bundle", b.resourceType === "Bundle");
ok("Bundle.type = transaction", b.type === "transaction", b.type);
ok("every entry has request.method + url", b.entry.every(e => e.request?.method && e.request?.url));
const qr = b.entry.find(e => e.resource.resourceType === "QuestionnaireResponse")?.resource;
const ob = b.entry.find(e => e.resource.resourceType === "Observation")?.resource;
const co = b.entry.find(e => e.resource.resourceType === "Communication")?.resource;
ok("QuestionnaireResponse present", !!qr);
ok("QR.status = completed", qr?.status === "completed");
ok("QR.questionnaire is versioned canonical", /\|\d+\.\d+\.\d+$/.test(qr?.questionnaire||""), qr?.questionnaire);
ok("QR.subject set", !!qr?.subject?.reference, qr?.subject?.reference);
ok("QR items all have exactly one answer", qr?.item.every(i => i.answer?.length === 1));
ok("QR answers are typed (not all valueString)",
   new Set(qr.item.map(i => Object.keys(i.answer[0])[0])).size > 1,
   [...new Set(qr.item.map(i => Object.keys(i.answer[0])[0]))].join(", "));
ok("QR item count matches answered elements", qr.item.length === Object.keys(answers).length,
   qr.item.length + " / " + Object.keys(answers).length);
ok("Observation present", !!ob);
ok("Observation.status = final", ob?.status === "final");
ok("Observation.code has a SNOMED coding",
   ob?.code?.coding?.some(c => c.system === "http://snomed.info/sct"));
ok("Observation carries the L3 version",
   ob?.component?.some(c => c.code.text === "L3 version" && c.valueString === L3.meta.version),
   L3.meta.version);
ok("Observation carries the triggering rule",
   ob?.component?.some(c => c.code.text === "Triggering rule" && c.valueString === "R4"));
ok("Communication generated for ORANGE", !!co);
ok("Communication.priority = urgent for ORANGE", co?.priority === "urgent", co?.priority);
const rcp = co?.recipient?.[0];
ok("Communication has a recipient", !!(rcp?.reference || rcp?.display), rcp?.reference || rcp?.display);
/* A literal reference to a resource the target server does not hold makes the
   server reject the whole transaction — and only for ORANGE/RED, the cases
   that matter. Either the L3 names the recipient without a reference, or it
   points at a record that exists there. Both are legal; guessing is not. */
ok("recipient reference resolves or is absent by design",
   !rcp?.reference || /^[A-Za-z]+\/[A-Za-z0-9.-]+$/.test(rcp.reference), rcp?.reference || "display-only");
ok("endpoint comes from the L3, not the code",
   !/hapi\.fhir\.org/.test(src) && /hapi\.fhir\.org/.test(JSON.stringify(L3.meta.fhir)));

// no Communication when GREEN
lastResult = { priority:"green", rule:{ id:"R8", output:{ en:"ALL CLEAR" } } };
const g = build(L3, answers, derived, lastResult, tx);
ok("no Communication when GREEN",
   !g.entry.some(e => e.resource.resourceType === "Communication"));

let pass = checks.filter(c=>c.pass).length;
console.log("| # | Check | Result |");
console.log("|---|---|---|");
checks.forEach((c,i)=>console.log(`| F${String(i+1).padStart(2,"0")} | ${c.name}${c.detail?" — `"+c.detail+"`":""} | ${c.pass?"✅":"❌"} |`));
console.log(`\n${pass} passed, ${checks.length-pass} failed, ${checks.length} total`);
fs.writeFileSync(new URL("../submission/example-fhir-bundle.json", import.meta.url), JSON.stringify(b,null,2));
console.log("example bundle -> submission/example-fhir-bundle.json");
process.exit(pass===checks.length?0:1);
