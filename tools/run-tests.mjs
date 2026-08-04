/* Test harness for the WundCheck decision logic.
   Uses the same expression engine as the L4 app, runs the test protocol
   T1–T19 from docs/10-qa-testing.md against l3/wundcheck-l3.json. */
import fs from "fs";
const L3 = JSON.parse(fs.readFileSync(new URL("../l3/wundcheck-l3.json", import.meta.url)));
const T = L3.meta.thresholds;

const compile = e => String(e)
  .replace(/\band\b/g,"&&").replace(/\bor\b/g,"||").replace(/\bnot\b/g,"!")
  .replace(/(?<![<>=!])=(?!=)/g,"==");

function makeCtx(answers, history){
  let derived = {}, lastResult = null;
  const HELP = {
    today: () => Date.now(),
    ageYears: d => d ? Math.floor((Date.now()-d)/31557600000) : null,
    daysSince: d => d ? Math.floor((Date.now()-d)/86400000) : null,
    round1: x => x==null?null:Math.round(x*10)/10,
    severityRank: p => ({green:0,yellow:1,orange:2,red:3})[p] ?? -1,
    previousClassification: () => history.length ? history[history.length-1] : null,
    consecutiveDays: () => history.length+1
  };
  const scope = () => {
    const s = Object.create(null);
    for (const e of L3.elements){
      let v = e.type==="calculated" ? derived[e.id] : answers[e.id];
      if (e.type==="date" && v) v = new Date(v).getTime();
      if (v===""||v===undefined) v = null;
      s[e.id]=v;
    }
    s.classification = lastResult;
    return s;
  };
  const evaluate = expr => {
    const s = scope(), n = Object.keys(s), v = n.map(k=>s[k]);
    const hn = Object.keys(HELP), hv = hn.map(k=>HELP[k]);
    try { return new Function(...n,...hn,"T","return ("+compile(expr)+");")(...v,...hv,T); }
    catch(err){ return null; }
  };
  const recalc = () => { derived={}; for(let i=0;i<3;i++) for(const e of L3.elements)
    if(e.type==="calculated"&&e.calculation) derived[e.id]=evaluate(e.calculation); };
  return { evaluate, recalc, setLast:p=>{lastResult=p;}, get derived(){return derived;} };
}

const RANK={green:0,yellow:1,orange:2,red:3};
function classify(answers, history=[]){
  const c = makeCtx(answers, history);
  const pass = () => { c.recalc();
    let main=null;
    for (const r of L3.decision_rules){ if(!r.exclusive) continue;
      if (c.evaluate(r.when)===true){ main=r; break; } }
    const notes = L3.decision_rules.filter(r=>!r.exclusive && c.evaluate(r.when)===true).map(r=>r.id);
    return { rule: main?main.id:null, priority: main?main.priority:null,
             notes, grade: c.derived.southampton_grade };
  };
  const first = pass();
  c.setLast(first.priority);
  const second = pass();
  c.setLast(null);
  return (RANK[second.priority] > RANK[first.priority]) ? second : first;
}
function visible(id, answers){
  const e = L3.elements.find(x=>x.id===id);
  const c = makeCtx(answers, []); c.recalc();
  return !e.relevant || c.evaluate(e.relevant)===true;
}
function constraintOk(id, answers){
  const e = L3.elements.find(x=>x.id===id);
  const c = makeCtx(answers, []); c.recalc();
  return !e.constraint || c.evaluate(e.constraint.expr)===true;
}
const dPost = d => new Date(Date.now()-d*86400000).toISOString().slice(0,10);
const BASE = { op_date:dPost(5), temp:36.8, chills:0, pain:2, pain_trend:0, wellbeing:0,
  nausea_vomiting:0, meds_taken:1, wound_state:1, redness_extent:0, red_streak:0, swelling:0,
  warmth:0, secretion:0, bleeding:0, wound_open:0, crust:0, numbness:0, mobility_change:0,
  diabetes:0, smoker:0, immunosuppr:0, anticoag:0, height:178, weight:80, wound_class:1 };
const A = o => Object.assign({}, BASE, o);

const TESTS = [
 ["T1","R1 fever","H-01", A({temp:39.2}), r=>r.priority==="red"&&r.rule==="R1", "RED (R1)"],
 ["T2","R1 boundary","H-01", A({temp:39.0}), r=>r.priority==="red", "RED (>= inclusive)"],
 ["T3","R3 safety rule","H-01", A({wound_state:4}), r=>r.priority==="red"&&r.rule==="R3", "RED (image alone escalates)"],
 ["T4","R5 before R6","H-02", A({temp:38.2,wound_state:3,op_date:dPost(5)}), r=>r.priority==="orange"&&r.rule==="R5", "ORANGE (R5 wins)"],
 ["T5","mild signs, day 2","H-04", A({wound_state:2,redness_extent:1,op_date:dPost(2)}), r=>r.priority==="green", "GREEN"],
 ["T6","conditional logic","H-03", A({secretion:0}), ()=>!visible("secretion_smell",A({secretion:0}))&&!visible("discharge_extent",A({secretion:0}))&&!visible("discharge_duration_days",A({secretion:0})), "3 follow-ups hidden"],
 ["T7","constraint temp","H-05", A({temp:45}), ()=>constraintOk("temp",A({temp:45}))===false, "input rejected"],
 ["T8","info rules non-exclusive","—", A({smoker:1,diabetes:1,immunosuppr:1,meds_taken:0}), r=>r.priority==="green"&&["I1","I2","I3"].every(i=>r.notes.includes(i)), "GREEN + I1 + I2 + I3"],
 ["T9","scab reassures","H-04", A({crust:1}), r=>r.priority==="green"&&r.notes.includes("I4"), "GREEN + I4"],
 ["T10","worst-first vs reassurance","H-02", A({crust:1,secretion:3}), r=>r.priority==="orange"&&r.rule==="R4"&&r.notes.includes("I4"), "ORANGE (R4) + I4 — warning beats reassurance"],
 ["T11","B-02 fixed","H-01", A({wellbeing:2,temp:37.4}), r=>r.priority==="orange"&&r.rule==="R9", "ORANGE (R9)"],
 ["T12","B-03 fixed","H-01", A({wound_state:1,red_streak:1}), r=>r.priority==="red"&&r.rule==="R2", "RED (R2)"],
 ["T13","B-01 fixed","H-01", A({wound_state:3,op_date:dPost(2)}), r=>r.priority==="yellow"&&r.rule==="R6b"&&r.grade==="II", "YELLOW (R6b), not green"],
 ["T14","B-01 counter-check","H-04", A({wound_state:2,op_date:dPost(2)}), r=>r.priority==="green"&&r.grade==="I", "GREEN (R6a does not fire)"],
 ["T15","Southampton derivation","H-02", A({secretion:3}), r=>r.grade==="IV"&&r.priority==="orange"&&r.rule==="R4", "grade IV -> ORANGE (R4) — see B-06"],
 ["T16","B-05 fixed","—", A({bleeding:1,anticoag:1}), r=>r.priority==="yellow"&&r.rule==="R10", "YELLOW (R10)"],
 ["T17","persistence rule R12","H-01", A({wound_state:2,redness_extent:1,op_date:dPost(4)}), null, "ORANGE (R12) after a yellow yesterday"],
 ["T18","discharge duration R11","H-01", A({secretion:1,discharge_duration_days:4,secretion_smell:0,discharge_extent:1}), r=>r.priority==="orange"&&r.rule==="R11", "ORANGE (R11)"],
 ["T19","threshold maintainability","—", A({temp:37.6}), null, "ORANGE after threshold change"],
];

let pass=0, fail=0; const rows=[];
for (const [id,name,haz,ans,check,expected] of TESTS){
  let r, ok, obs;
  if (id==="T17"){
    r = classify(ans, ["yellow"]);
    ok = r.priority==="orange" && r.rule==="R12";
    obs = r.priority.toUpperCase()+" ("+r.rule+")";
  } else if (id==="T19"){
    const before = classify(ans).priority;
    T.fever_orange = 37.5;
    const after = classify(ans);
    T.fever_orange = 38.0;
    ok = before==="green" && after.priority==="orange" && after.rule==="R5";
    obs = before.toUpperCase()+" -> "+after.priority.toUpperCase()+" ("+after.rule+")";
  } else {
    r = classify(ans);
    ok = check(r);
    obs = (id==="T6") ? "hidden: "+(!visible("secretion_smell",ans))
        : (id==="T7") ? "rejected: "+(!constraintOk("temp",ans))
        : (r.priority?r.priority.toUpperCase():"none")+(r.rule?" ("+r.rule+")":"")
          +(r.notes.length?" + "+r.notes.join(", "):"")
          +(r.grade!==undefined?" · SG "+r.grade:"");
  }
  ok?pass++:fail++;
  rows.push({id,name,haz,expected,observed:obs,status:ok?"PASS":"FAIL"});
}
console.log("| ID | Checks | Hazard | Expected | Observed | Status |");
console.log("|---|---|---|---|---|---|");
for (const r of rows)
  console.log(`| ${r.id} | ${r.name} | ${r.haz} | ${r.expected} | \`${r.observed}\` | ${r.status==="PASS"?"✅ passed":"❌ FAILED"} |`);
console.log(`\n${pass} passed, ${fail} failed, ${TESTS.length} total`);
process.exit(fail?1:0);
