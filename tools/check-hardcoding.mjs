/* Machine-enforces the central claim of this project: the L4 contains no
   clinical content. Fails the build if any clinical term, threshold, code
   system, endpoint or L3 section id appears in the application source.
   Run: node tools/check-hardcoding.mjs */
import fs from "fs";
const html = fs.readFileSync(new URL("../l4/wundcheck-app.html", import.meta.url), "utf8");
const L3   = JSON.parse(fs.readFileSync(new URL("../l3/wundcheck-l3.json", import.meta.url)));

// application source only — strip the embedded L3 payload and the file header
let src = html.slice(html.indexOf("/* ====="));
src = src.split("const EMBEDDED_L3")[0].replace(/\/\* =+[\s\S]*?=+ \*\//, "");

const forbidden = [
  ...L3.elements.map(e => e.id).filter(id => id.length > 4),
  ...L3.sections.map(s => s.id),
  ...L3.decision_rules.map(r => r.id).filter(r => r.length > 2),
  ...Object.keys(L3.meta.thresholds),
  ...Object.values(L3.meta.thresholds).map(String).filter(v => v.length > 2),
  ...Object.values(L3.meta.terminology_systems),
  L3.meta.fhir.endpoint,
  L3.meta.fhir.observation_code.code,
  "Southampton", "southampton", "SSI", "wound infection", "purulent", "erythema"
];
const hits = [...new Set(forbidden.filter(term => term && src.includes(term)))];

console.log("| Check | Result |");
console.log("|---|---|");
console.log(`| Application source scanned | \`${src.split("\n").length}\` lines |`);
console.log(`| Terms tested (element ids, section ids, rule ids, thresholds, code systems, endpoint, clinical vocabulary) | ${forbidden.length} |`);
console.log(`| Clinical content found in the L4 | ${hits.length ? "❌ " + hits.join(", ") : "✅ none"} |`);
if (hits.length){ console.error("\nFAILED — the L4 is not free of clinical content."); process.exit(1); }
console.log("\nPASSED — the L4 contains no clinical content. Every question, threshold, rule, code system and endpoint lives in the L3.");
