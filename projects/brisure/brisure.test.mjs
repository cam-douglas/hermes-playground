import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ALARM,
  BACKUPS,
  BOOTH_STATIONS,
  BRISURE_WALK,
  BUILD,
  CHIPS,
  CODE_BUILD,
  COUSINS,
  DESKTOP_BUILD,
  DISTRIBUTION,
  EXPECTED,
  FEATURED_ISSUE,
  FIELD_MARKS,
  FINGERPRINT_LINES,
  FORBIDDEN_IDLE,
  FORBIDDEN_SEED,
  FORKED_COUNT,
  HOLD,
  HOLD_ALIASES,
  HOST,
  IDLE_WORD,
  ISSUE_URL,
  LABELS,
  LEDGER_NAMES,
  NOT_PRODUCTS,
  ORDINARY_COUNT,
  PATH_WORD,
  PHRASE,
  PLATFORM,
  POSITIVE_CONTROL_WALK,
  PRODUCT_WORD,
  RULED_OUT,
  SAMPLE_BRISURE_PROOF,
  SCHEDULED_COUNT,
  SEEDED_WORD,
  SESSION_TOTAL,
  STATE,
  SURFACE,
  TITLE,
  VERDICTS,
  analyze,
  armEligibility,
  classify,
  decide,
  emptyTicket,
  enrollCadet,
  fingerprint,
  handle,
  inspectBridge,
  inspectCadet,
  inspectColdResume,
  inspectMobile,
  inspectOmitted,
  mapBrisure,
  policyCovers,
  readBooth,
  score,
  scoreForkResume,
  scoreGate,
  scoreWalk,
  seedBrisure,
  seedCadet,
  seedEnrolled,
  seedForkResume,
  seedOmitted,
  seedProduct,
  seedRollcall,
} from "./brisure.mjs";

function readData(name) {
  return JSON.parse(
    readFileSync(fileURLToPath(new URL(`./data/${name}`, import.meta.url)), "utf8"),
  );
}

function readPage() {
  return readFileSync(fileURLToPath(new URL("./index.html", import.meta.url)), "utf8");
}

function readReadme() {
  return readFileSync(fileURLToPath(new URL("./README.md", import.meta.url)), "utf8");
}

function readCatalog() {
  return JSON.parse(
    readFileSync(fileURLToPath(new URL("../../catalog.json", import.meta.url)), "utf8"),
  );
}

function readHubCatalog() {
  return JSON.parse(
    readFileSync(fileURLToPath(new URL("../../hub/catalog.json", import.meta.url)), "utf8"),
  );
}

function readVercel() {
  return JSON.parse(
    readFileSync(fileURLToPath(new URL("../../vercel.json", import.meta.url)), "utf8"),
  );
}

function modelPath() {
  return fileURLToPath(new URL("./brisure.mjs", import.meta.url));
}

const CATALOG_SUMMARY =
  "19:50 brisure: a herald's college / armorial roll / cadency desk / lacquered shield rack booth for #94396. Forked sessions never become Remote Control eligible so they never appear in the mobile Code tab. Idle enrolled / seeded brisure / path fork-resume. Score brisure or admit enrolled.";

test("idle enrolled is a hold; parent on the main roll; first_turn armed eligible", () => {
  const result = analyze(seedEnrolled());
  assert.equal(result.verdict, "enrolled");
  assert.equal(result.idleWord, "enrolled");
  assert.equal(IDLE_WORD, "enrolled");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.enrolled, true);
  assert.equal(result.phrase, "admit enrolled");
  assert.equal(result.brisure, false);
  assert.equal(result.forkResume, false);
  assert.ok(HOLD_ALIASES.includes("lineal"));
  assert.ok(HOLD_ALIASES.includes("registered"));
  assert.ok(HOLD_ALIASES.includes("parent"));
  assert.ok(HOLD_ALIASES.includes("rollcall"));
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(result.idleWord, word);
    assert.notEqual(result.verdict, word);
  }
  assert.notEqual(IDLE_WORD, "single");
  assert.notEqual(IDLE_WORD, "pledged");
  assert.notEqual(IDLE_WORD, "brisk");
  assert.notEqual(IDLE_WORD, "cadence");
  assert.notEqual(IDLE_WORD, "released");
  assert.notEqual(IDLE_WORD, "verbatim");
  assert.notEqual(IDLE_WORD, "quiet");
  assert.notEqual(IDLE_WORD, "intact");
  assert.notEqual(IDLE_WORD, "cleared");
});

test("empty ticket and empty stdin classify enrolled", () => {
  assert.equal(classify(emptyTicket()), "enrolled");
  assert.equal(classify(""), "enrolled");
  assert.equal(classify(null), "enrolled");
  assert.equal(decide({}), "enrolled");
});

test("#94396 seeded path scores brisure when the cadet never receives its mark", () => {
  const result = analyze(seedBrisure());
  assert.equal(result.verdict, "brisure");
  assert.equal(result.seededWord, "brisure");
  assert.equal(SEEDED_WORD, "brisure");
  assert.equal(PRODUCT_WORD, "brisure");
  assert.equal(result.hold, false);
  assert.equal(result.alarm, true);
  assert.equal(result.brisure, true);
  assert.equal(result.phrase, "score brisure");
  assert.equal(result.forkResume, true);
  assert.equal(result.cadetOmitted, true);
  for (const word of FORBIDDEN_SEED) {
    assert.notEqual(result.seededWord, word);
    assert.notEqual(result.verdict, word);
  }
  assert.notEqual(SEEDED_WORD, "diptych");
  assert.notEqual(SEEDED_WORD, "vizard");
  assert.notEqual(SEEDED_WORD, "cancellans");
  assert.notEqual(SEEDED_WORD, "forksink");
  assert.notEqual(PATH_WORD, "brief-echo");
  assert.notEqual(PATH_WORD, "deferred-delta");
});

test("educational eligibility helper encodes published enrolled vs fork-resume paths", () => {
  assert.equal(ORDINARY_COUNT, 18);
  assert.equal(SCHEDULED_COUNT, 2);
  assert.equal(FORKED_COUNT, 5);
  assert.equal(SESSION_TOTAL, 25);
  assert.equal(DESKTOP_BUILD, "1.52386.6");
  assert.equal(CODE_BUILD, "2.1.266");
  const first = armEligibility({ path: "first_turn" });
  assert.equal(first.autoEligible, true);
  const cold = armEligibility({ path: "cold_resume" });
  assert.equal(cold.autoEligible, false);
  const cleared = armEligibility({ path: "clear" });
  assert.equal(cleared.autoEligible, true);
  const prewarm = armEligibility({ path: "prewarm" });
  assert.equal(prewarm.autoEligible, true);
  assert.equal(policyCovers({ autoEligible: true, scheduledTaskId: false }), true);
  assert.equal(policyCovers({ autoEligible: true, scheduledTaskId: true }), false);
  assert.equal(policyCovers({ autoEligible: false }), false);
  assert.equal(policyCovers({ userRequested: true }), true);
  const dropped = enrollCadet({ enrolled: false, forked: true });
  assert.equal(dropped.enrolled, false);
  assert.equal(dropped.visible, false);
  const control = enrollCadet({ enrolled: true, forked: false });
  assert.equal(control.enrolled, true);
  assert.equal(control.visible, true);
  const scored = scoreForkResume({
    brisure: true,
    forkResume: true,
    cadetOmitted: true,
  });
  assert.equal(scored.brisure, true);
  assert.equal(scored.forkResume, true);
  const intactPath = scoreForkResume({ enrolled: true });
  assert.equal(intactPath.brisure, false);
  assert.equal(intactPath.enrolled, true);
});

test("inspectors mark cadet vacancy and cold-resume skip", () => {
  const cadet = inspectCadet({ brisure: true, cadetOmitted: true });
  assert.equal(cadet.stamp, "cadet");
  assert.equal(cadet.omitted, true);
  const cold = inspectColdResume({ brisure: true, coldResume: true });
  assert.equal(cold.stamp, "cold-resume");
  assert.equal(cold.cold, true);
  const scored = scoreGate({
    brisure: true,
    forkResume: true,
    cadetOmitted: true,
    cue: "brisure",
  });
  assert.equal(scored.verdict, "brisure");
  const open = inspectCadet({ enrolled: true, brisure: false });
  assert.equal(open.stamp, "lineal");
});

test("path word is fork-resume; booth seed holds the path", () => {
  assert.equal(PATH_WORD, "fork-resume");
  const result = analyze(seedForkResume());
  assert.equal(result.verdict, "fork-resume");
  assert.equal(result.pathWord, "fork-resume");
  assert.equal(result.hold, false);
  assert.equal(
    classify({
      seed: "fork-resume",
      preferSeed: true,
      brisure: true,
    }),
    "fork-resume",
  );
  assert.equal(classify({ seed: "cadet", preferSeed: true }), "cadet");
  assert.equal(score(seedForkResume()), "brisure");
});

test("HOLD includes enrolled; aliases classify when preferSeed", () => {
  assert.ok(HOLD.includes("enrolled"));
  const roll = analyze(seedRollcall());
  assert.equal(roll.verdict, "rollcall");
  assert.equal(classify({ seed: "lineal", preferSeed: true }), "lineal");
  assert.equal(classify({ seed: "registered", preferSeed: true }), "registered");
  assert.equal(classify({ seed: "parent", preferSeed: true }), "parent");
});

test("alarm chips: cadet, omitted, brisure", () => {
  assert.equal(classify({ seed: "cadet", preferSeed: true }), "cadet");
  assert.equal(classify(seedForkResume()), "fork-resume");
  assert.equal(classify(seedProduct()), "brisure");
  assert.equal(classify(seedCadet()), "cadet");
  assert.equal(classify(seedOmitted()), "omitted");
});

test("booth fixtures flip enrolled vs brisure vs fork-resume", () => {
  const idle = scoreGate(seedEnrolled());
  const seeded = scoreGate(seedBrisure());
  const enrolled = readData("enrolled.json");
  const brisure = readData("brisure.json");
  const issued = readData("94396.json");
  const path = readData("fork-resume.json");
  assert.equal(idle.verdict, "enrolled");
  assert.equal(seeded.verdict, "brisure");
  assert.notEqual(idle.verdict, seeded.verdict);
  assert.equal(score(seedEnrolled()), "enrolled");
  assert.equal(score(seedBrisure()), "brisure");
  assert.equal(score({ seed: "fork-resume", preferSeed: true }), "brisure");
  assert.equal(enrolled.forkResume, false);
  assert.equal(enrolled.enrolled, true);
  assert.equal(scoreGate(enrolled).verdict, "enrolled");
  assert.equal(brisure.forkResume, true);
  assert.equal(brisure.cadetOmitted, true);
  assert.equal(classify(brisure), "brisure");
  assert.equal(issued.issue, 94396);
  assert.equal(classify(issued), "brisure");
  assert.equal(path.paths.length, 3);
  assert.match(path.paths[0].rule, /enrolled|lineal|registered|parent|rollcall/i);
  assert.match(path.paths[1].result, /fork-resume|cadet|omitted|cold-resume/i);
  assert.equal(classify(path), "fork-resume");
  assert.equal(brisure.hubCount, "BRISURE");
  assert.equal(brisure.issue, 94396);
  assert.equal(brisure.brisure, true);
  assert.equal(classify(readData("lineal.json")), "lineal");
  assert.equal(classify(readData("registered.json")), "registered");
  assert.equal(classify(readData("parent.json")), "parent");
  assert.equal(classify(readData("rollcall.json")), "rollcall");
  assert.equal(classify(readData("cadet.json")), "cadet");
  assert.equal(classify(readData("omitted.json")), "omitted");
  assert.equal(classify(readData("cold-resume.json")), "cold-resume");
  assert.equal(classify(readData("first-turn.json")), "first-turn");
  assert.equal(classify(readData("auto-eligible.json")), "auto-eligible");
  assert.equal(classify(readData("user-requested.json")), "user-requested");
  assert.equal(classify(readData("scheduled.json")), "scheduled");
  assert.equal(classify(readData("bridge-absent.json")), "bridge-absent");
  assert.equal(classify(readData("mobile-absent.json")), "mobile-absent");
  assert.equal(classify(readData("landing.json")), "landing");
  assert.equal(classify(readData("cousins.json")), "cousins");
  assert.deepEqual(readData("cousins.json").issues, [94400, 94397, 93458]);
  assert.equal(classify(readData("backups.json")), "backups");
  assert.equal(classify(readData("walk.json")), "walk");
  assert.equal(classify(readData("has-repro.json")), "has-repro");
  assert.equal(classify(readData("fixtures.json")), "fixtures");
  assert.equal(classify(readData("closed.json")), "closed");
});

test("chips include idle, seeded, path, and walk", () => {
  assert.ok(CHIPS.includes("enrolled"));
  assert.ok(CHIPS.includes("brisure"));
  assert.ok(CHIPS.includes("fork-resume"));
  assert.ok(CHIPS.includes("cadet"));
  assert.ok(CHIPS.includes("omitted"));
  assert.ok(CHIPS.includes("cold-resume"));
  assert.ok(CHIPS.includes("rollcall"));
  assert.ok(CHIPS.includes("fixtures"));
  assert.ok(CHIPS.includes("walk"));
  assert.ok(ALARM.includes("brisure"));
  assert.ok(ALARM.includes("fork-resume"));
  assert.ok(ALARM.includes("cadet"));
  assert.ok(ALARM.includes("omitted"));
  assert.ok(VERDICTS.includes("walk"));
  assert.equal(classify({ seed: "fixtures", preferSeed: true }), "fixtures");
  assert.equal(classify({ seed: "walk", preferSeed: true }), "walk");
});

test("published brisure walk scores brisure after the idle hold", () => {
  const booth = scoreWalk({ rows: BRISURE_WALK });
  assert.equal(booth.verdict, "brisure");
  assert.ok(booth.brisureCount >= 1);
  const idle = booth.rows.find((row) => row.event === "rollcall");
  assert.equal(idle.enrolled, true);
  assert.equal(idle.verdict, "enrolled");
  const cut = booth.rows.find((row) => row.event === "fork-resume");
  assert.equal(cut.forkResume, true);
  const path = booth.rows.find(
    (row) => row.event === "fork-resume" && row.t === "path",
  );
  assert.equal(path.verdict, "fork-resume");
});

test("BRISURE_WALK constant matches the issue college walk", () => {
  assert.equal(BRISURE_WALK[0].event, "rollcall");
  const cut = BRISURE_WALK.find((row) => row.event === "fork-resume");
  assert.equal(cut.forkResume || cut.cadetOmitted, true);
  const path = BRISURE_WALK.find((row) => row.t === "path");
  assert.equal(path.brisure, true);
  const scoreRow = BRISURE_WALK.find((row) => row.event === "brisure");
  assert.equal(scoreRow.brisure, true);
  assert.equal(scoreRow.coldResume, true);
});

test("positive control rollcall folio stays enrolled", () => {
  const walk = scoreWalk({ rows: POSITIVE_CONTROL_WALK });
  assert.equal(walk.verdict, "enrolled");
  const ok = walk.rows.find((row) => row.t === "hold");
  assert.equal(ok.verdict, "enrolled");
  const hold = walk.rows.find((row) => row.event === "rollcall");
  assert.equal(hold.enrolled, true);
  assert.equal(hold.verdict, "enrolled");
});

test("issue constants encode only #94396 published facts", () => {
  assert.equal(FEATURED_ISSUE, 94396);
  assert.ok(ISSUE_URL.includes("94396"));
  assert.match(TITLE, /Forked sessions|Remote Control|mobile Code tab/i);
  assert.equal(STATE, "OPEN");
  assert.match(PLATFORM, /macos/i);
  assert.match(HOST, /1\.52386\.6|2\.1\.266/i);
  assert.equal(BUILD, "Claude desktop 1.52386.6; Claude Code CLI 2.1.266; Claude mobile Code tab");
  assert.equal(SURFACE, "fork-resume");
  assert.deepEqual(
    [...LABELS],
    ["bug", "has repro", "platform:macos", "area:core"],
  );
  assert.equal(FIELD_MARKS.length, 6);
  assert.equal(LEDGER_NAMES.length, 6);
  assert.ok(RULED_OUT.some((row) => /Cancellans|#94400/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /Diptych|#94397/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /Forksink|#93458/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /Vizard|#94398/i.test(row)));
  assert.ok(EXPECTED.some((row) => /ordinary local session|Remote Control bridge|brisure/i.test(row)));
  assert.match(
    DISTRIBUTION,
    /cold_resume|remoteControlAutoEligible|forkedFromSessionId|18|5 forks|never appear/i,
  );
  assert.equal(BOOTH_STATIONS.length, 6);
  assert.ok(FINGERPRINT_LINES.includes("fork-resume"));
  assert.ok(FINGERPRINT_LINES.includes("brisure"));
  assert.equal(PHRASE, "Score brisure or admit enrolled.");
  assert.equal(SAMPLE_BRISURE_PROOF.forkResume, true);
  assert.equal(SAMPLE_BRISURE_PROOF.names.length, 6);
});

test("has-repro fingerprints encode the published brisure proof", () => {
  const result = handle(seedBrisure());
  assert.equal(result.published.platform, "macos");
  assert.equal(result.published.surface, "fork-resume");
  assert.equal(result.published.host, HOST);
  assert.match(
    fingerprint(seedBrisure()),
    /brisure\|kind=fork-resume\|ref=cadet\|path=fork-resume\|cue=fork-resume/,
  );
  assert.equal(classify({ seed: "has-repro", preferSeed: true }), "has-repro");
});

test("forbidden idle list includes prior catalog words and single/pledged/intact", () => {
  const required = [
    "single",
    "pledged",
    "brisk",
    "cadence",
    "released",
    "verbatim",
    "quiet",
    "intact",
    "cleared",
    "diptych",
    "vizard",
    "treacle",
    "somnus",
    "cresset",
    "dictabelt",
    "lemure",
    "cancellans",
    "arras",
    "brief-echo",
    "background-reset",
    "streaming-stall",
    "device-absent",
    "hold-leak",
    "segment-drop",
    "orphan-tick",
    "deferred-delta",
    "phantom-prompt",
  ];
  for (const word of required) {
    assert.ok(FORBIDDEN_IDLE.includes(word), `missing forbidden idle ${word}`);
  }
});

test("enrolled booth flips brisure back when the college admits enrolled", () => {
  const tape = {
    enrolled: true,
    brisure: false,
    forkResume: false,
    cue: "enrolled",
  };
  assert.equal(scoreGate(tape).verdict, "enrolled");
  tape.enrolled = false;
  tape.brisure = true;
  tape.forkResume = true;
  tape.cue = "brisure";
  assert.equal(scoreGate(tape).verdict, "brisure");
  tape.enrolled = true;
  tape.brisure = false;
  tape.forkResume = false;
  tape.cue = "enrolled";
  assert.equal(scoreGate(tape).verdict, "enrolled");
});

test("cadet, omitted, cold, and readBooth mark the brisure proof", () => {
  const cadet = inspectCadet({ brisure: true });
  assert.equal(cadet.stamp, "cadet");
  const omitted = inspectOmitted({ brisure: true, silentOmit: true });
  assert.equal(omitted.stamp, "omitted");
  assert.equal(omitted.silent, true);
  const booth = readBooth({
    brisure: true,
    forkResume: true,
    cadetOmitted: true,
  });
  assert.equal(booth.brisure, true);
  assert.equal(booth.mark, "brisure");
  const open = readBooth({
    enrolled: true,
    brisure: false,
    forkResume: false,
  });
  assert.equal(open.brisure, false);
  assert.equal(open.mark, "enrolled");
  assert.equal(inspectColdResume({ brisure: true, coldResume: true }).stamp, "cold-resume");
  assert.equal(inspectBridge({ brisure: true, bridgeAbsent: true }).stamp, "bridge-absent");
  assert.equal(inspectMobile({ brisure: true, mobileAbsent: true }).stamp, "mobile-absent");
});

test("mapBrisure encodes the published fork-resume", () => {
  const miss = mapBrisure({ brisure: true, forkResume: true });
  assert.equal(miss.stamp, "fork-resume");
  assert.equal(miss.holdingLane, "cadet-vacancy");
  assert.equal(miss.ribbon, "brisure");
  const clear = mapBrisure({ enrolled: true, brisure: false });
  assert.equal(clear.stamp, "rollcall");
  assert.equal(clear.kindLane, "parent-shield");
  assert.equal(clear.holdingLane, "rollcall");
});

test("cousins stay cite-only; products stay distinct; backups stay data-only", () => {
  assert.equal(COUSINS.length, 3);
  assert.deepEqual(COUSINS.map((row) => row.issue), [94400, 94397, 93458]);
  assert.ok(COUSINS.every((row) => row.citeOnly === true));
  assert.ok(NOT_PRODUCTS.includes("diptych"));
  assert.ok(NOT_PRODUCTS.includes("vizard"));
  assert.ok(NOT_PRODUCTS.includes("cancellans"));
  assert.ok(NOT_PRODUCTS.includes("forksink"));
  assert.ok(NOT_PRODUCTS.includes("arras"));
  assert.ok(NOT_PRODUCTS.includes("diplopia"));
  assert.equal(BACKUPS.length, 12);
  assert.equal(BACKUPS[0].issue, 94393);
  assert.equal(BACKUPS[11].issue, 94151);
  assert.ok(BACKUPS.every((row) => row.citeOnly === true));
  assert.ok(!BACKUPS.some((row) => row.issue === 94396));
  assert.ok(!COUSINS.some((row) => row.issue === 94396));
  assert.equal(classify({ seed: "cousins", preferSeed: true }), "cousins");
  assert.equal(classify({ seed: "backups", preferSeed: true }), "backups");
});

test("CLI scores fixtures without a server", () => {
  const idle = spawnSync(process.execPath, [modelPath()], { encoding: "utf8" });
  const seeded = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/brisure.json", import.meta.url))],
    { encoding: "utf8" },
  );
  const enrolledFix = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/enrolled.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(idle.status, 0, idle.stderr);
  assert.equal(seeded.status, 0, seeded.stderr);
  assert.equal(enrolledFix.status, 0, enrolledFix.stderr);
  const idleOut = JSON.parse(idle.stdout);
  const seededOut = JSON.parse(seeded.stdout);
  const enrolledOut = JSON.parse(enrolledFix.stdout);
  assert.equal(idleOut.verdict, "enrolled");
  assert.equal(idleOut.hold, true);
  assert.equal(seededOut.verdict, "brisure");
  assert.equal(seededOut.alarm, true);
  assert.equal(enrolledOut.verdict, "enrolled");
  assert.equal(enrolledOut.hold, true);
  assert.match(enrolledOut.phrase, /admit enrolled/);
});

test("handle exposes published hypothesis and #94396 headline", () => {
  const result = handle(seedBrisure());
  assert.equal(result.published.issue, 94396);
  assert.equal(result.published.platform, "macos");
  assert.deepEqual(result.published.cousins, [94400, 94397, 93458]);
  assert.ok(result.published.backups.includes(94393));
  assert.ok(result.published.backups.includes(94151));
  assert.ok(!result.published.backups.includes(94396));
  assert.match(
    result.published.hypothesis,
    /cold_resume|remoteControlAutoEligible|NON-BINDING|#94396/i,
  );
  assert.match(result.published.hypothesis, /NON-BINDING/);
  assert.match(result.published.hypothesis, /#94396/);
  assert.equal(result.published.build, BUILD);
});

test("model has no static node: imports so the enrolled page can score in-browser", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /^import .* from "node:/m);
  assert.match(source, /import\("node:fs"\)/);
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
});

test("enrolled page is a herald college, not diptych wax-tablet or cancellans binder", () => {
  const page = readPage();
  assert.match(page, /family=Cinzel|Cinzel/);
  assert.match(page, /family=Sora|Sora/);
  assert.match(page, /IBM\+Plex\+Mono|IBM Plex Mono/);
  assert.match(
    page,
    /brisure|enrolled|fork-resume|herald-college|armorial-roll|cadency-desk|shield-rack|parent-shield|cadet-vacancy/i,
  );
  assert.match(page, /#7B1224|#F3EBDC|#0E0B09|#D6B45A|#1F4F8F|#24160F/i);
  assert.match(page, /\benrolled\b/);
  assert.match(page, /\bbrisure\b/);
  assert.match(page, /fork-resume/);
  assert.match(page, /Score brisure or admit enrolled/i);
  assert.match(page, /#378/);
  assert.match(page, /#94396/);
  assert.match(page, /Admit enrolled/);
  assert.match(page, /Score brisure/);
  assert.match(page, /Walk fork-resume/);
  assert.match(page, /Compare enrolled \/ brisure/);
  assert.match(page, /Pin idle enrolled/);
  assert.match(page, /Pin seeded brisure/);
  assert.match(page, /Pin fork-resume/);
  assert.match(page, /Stamp cadet/);
  assert.match(page, /Score booth/);
  assert.match(page, /brisure-score/);
  assert.match(
    page,
    /remoteControlAutoEligible|cold_resume|first_turn|forkedFromSessionId|Code tab/i,
  );
  assert.match(page, /parent-shield|cadet-vacancy|first-turn-path|cold-resume-path|bridge-gap|mobile-roll/i);
  assert.match(
    page,
    /<svg[\s\S]*class="parent-shield"|class="cadet-vacancy"|class="cadency-desk"|class="armorial-roll"|class="herald-college"|class="shield-rack"/i,
  );
  assert.doesNotMatch(page, /family=Spectral|Spectral/);
  assert.doesNotMatch(page, /family=Source\+Sans\+3|Source Sans 3/);
  assert.doesNotMatch(page, /JetBrains\+Mono|JetBrains Mono/);
  assert.doesNotMatch(page, /family=Lora|Lora/);
  assert.doesNotMatch(page, /family=Public\+Sans|Public Sans/);
  assert.doesNotMatch(page, /family=Cormorant|Cormorant/);
  assert.doesNotMatch(page, /family=Nunito|Nunito/);
  assert.doesNotMatch(page, /family=Bodoni|Bodoni/);
  assert.doesNotMatch(page, /family=Figtree|Figtree/);
  assert.doesNotMatch(page, /family=Playfair|Playfair/);
  assert.doesNotMatch(page, /family=Manrope|Manrope/);
  assert.doesNotMatch(page, /#E8DCC8|#24356B|#C4A35A|#4A6B52/);
  assert.doesNotMatch(page, /hinged wax-tablet|illuminated choir|oxidized hinge|reminder rubric/i);
  assert.doesNotMatch(page, /masque-ball|looking-glass|gilt-edge vizard/i);
  assert.doesNotMatch(page, /copper kettle|treacle-well|sticky-ladle/i);
  assert.doesNotMatch(page, /night-nursery|moon-watch|sleep-clinic/i);
  assert.doesNotMatch(page, /binder-cloth|cancelled-stamp|folio-press/i);
  assert.doesNotMatch(page, /admit single|Score diptych|idle single/i);
  assert.doesNotMatch(page, /admit pledged|Score vizard|idle pledged/i);
  assert.doesNotMatch(page, /admit intact|Score cancellans|idle intact/i);
  assert.doesNotMatch(page, /\bdiptych\b/);
  assert.doesNotMatch(page, /\bvizard\b/);
  assert.doesNotMatch(page, /\btreacle\b/);
  assert.doesNotMatch(page, /\bsomnus\b/);
  assert.doesNotMatch(page, /\bcresset\b/);
  assert.doesNotMatch(page, /\bdictabelt\b/);
  assert.doesNotMatch(page, /\blemure\b/);
  assert.doesNotMatch(page, /\bcancellans\b/);
  assert.doesNotMatch(page, /\barras\b/);
  assert.doesNotMatch(page, /brief-echo/);
  assert.doesNotMatch(page, /background-reset/);
  assert.doesNotMatch(page, /streaming-stall/);
  assert.doesNotMatch(page, /device-absent/);
  assert.doesNotMatch(page, /hold-leak/);
  assert.doesNotMatch(page, /segment-drop/);
  assert.doesNotMatch(page, /orphan-tick/);
  assert.doesNotMatch(page, /deferred-delta/);
  assert.doesNotMatch(page, /phantom-prompt/);
  assert.match(page, /NOT Cancellans/i);
  assert.match(page, /NOT Forksink/i);
  assert.match(page, /NOT Diptych/i);
  assert.match(page, /NOT Vizard/i);
  assert.match(page, /#94400/);
  assert.match(page, /#94397/);
  assert.match(page, /#93458/);
  assert.doesNotMatch(page, /fetch\(/);
  assert.match(page, /body\.embed/);
});

test("README states the thesis, anti-clone, and how to score", () => {
  const readme = readReadme();
  assert.match(readme, /Brisure/);
  assert.match(readme, /#94396/);
  assert.match(readme, /\benrolled\b/);
  assert.match(readme, /\bbrisure\b/);
  assert.match(readme, /fork-resume/);
  assert.match(readme, /Cinzel/);
  assert.match(readme, /Sora/);
  assert.match(readme, /IBM Plex Mono/);
  assert.doesNotMatch(readme, /Spectral/);
  assert.doesNotMatch(readme, /Source Sans 3/);
  assert.doesNotMatch(readme, /JetBrains Mono/);
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /Research brief/i);
  assert.match(readme, /remoteControlAutoEligible|cold_resume|first_turn|forkedFromSessionId/i);
  assert.match(readme, /NOT Cancellans\/#94400/);
  assert.match(readme, /NOT Forksink\/#93458/);
  assert.match(readme, /NOT Diptych\/#94397/);
  assert.match(readme, /NOT Vizard\/#94398/);
  assert.match(readme, /NOT Treacle\/#94344/);
  assert.match(readme, /NOT Somnus\/#94415/);
  assert.match(readme, /NOT Cresset\/#94420/);
  assert.match(readme, /NOT Diplopia/);
  assert.match(readme, /#94400/);
  assert.match(readme, /#94397/);
  assert.match(readme, /do NOT rebuild|do not conflate/i);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/brisure/);
  assert.match(readme, /node --test projects\/brisure\/brisure\.test\.mjs/);
  assert.match(readme, /NON-BINDING/);
  assert.match(readme, /herald|armorial|cadency|shield rack|roll-call/i);
  assert.match(readme, /Score brisure or admit enrolled/);
  assert.match(readme, /#94393|#94458|#94151/);
  assert.doesNotMatch(readme, /backup #94396|#94396 as next/);
  assert.match(readme, /19:50/);
  assert.match(readme, /Do NOT implement a fix/i);
  assert.doesNotMatch(readme, /\bdiptych\b/);
  assert.doesNotMatch(readme, /\bvizard\b/);
  assert.doesNotMatch(readme, /\bcancellans\b/);
  const runLog = readFileSync(
    fileURLToPath(new URL("../../RUN_LOG.md", import.meta.url)),
    "utf8",
  );
  assert.match(runLog, /## 2026-09-15 — Brisure/);
  assert.match(runLog, /19:50/);
});

test("catalog features Brisure only; Diptych unfeatured; product count 378", () => {
  const catalog = readCatalog();
  const hub = readHubCatalog();
  assert.equal(catalog.products.length, 378);
  assert.equal(hub.products.length, 378);
  assert.equal(catalog.products[0].name, "Brisure");
  assert.equal(catalog.products[0].slug, "brisure");
  assert.equal(catalog.products[0].featured, true);
  assert.equal(catalog.products[0].href, "/brisure/");
  assert.equal(catalog.products[0].day, "2026-09-15");
  assert.equal(catalog.products[0].summary, CATALOG_SUMMARY);
  assert.equal(hub.products[0].summary, catalog.products[0].summary);
  assert.match(catalog.products[0].summary, /\benrolled\b/);
  assert.match(catalog.products[0].summary, /\bbrisure\b/);
  assert.match(catalog.products[0].summary, /fork-resume/);
  assert.match(catalog.products[0].summary, /Score brisure or admit enrolled/);
  assert.match(catalog.products[0].summary, /#94396/);
  assert.match(catalog.products[0].summary, /19:50/);
  assert.equal(hub.products[0].slug, "brisure");
  assert.equal(hub.products[0].featured, true);
  const diptych = catalog.products.find((row) => row.slug === "diptych");
  assert.ok(diptych);
  assert.equal(diptych.featured, false);
  const vizard = catalog.products.find((row) => row.slug === "vizard");
  assert.ok(vizard);
  assert.equal(vizard.featured, false);
  const treacle = catalog.products.find((row) => row.slug === "treacle");
  assert.ok(treacle);
  assert.equal(treacle.featured, false);
  assert.equal(catalog.products.filter((row) => row.featured).length, 1);
  assert.equal(
    catalog.products.filter((row) => row.slug === "brisure" && row.featured).length,
    1,
  );
  assert.ok(
    !catalog.products.some(
      (row) => String(row.summary || "").includes("94396") && row.slug !== "brisure",
    ),
  );
});

test("vercel rewrites brisure to the project folder at the top", () => {
  const vercel = readVercel();
  assert.equal(vercel.rewrites[0].source, "/brisure");
  assert.equal(vercel.rewrites[0].destination, "/projects/brisure");
  assert.equal(vercel.rewrites[1].source, "/brisure/");
  assert.equal(vercel.rewrites[1].destination, "/projects/brisure");
  assert.equal(vercel.rewrites[2].source, "/brisure/:path*");
  assert.equal(vercel.rewrites[2].destination, "/projects/brisure/:path*");
  assert.equal(vercel.rewrites[3].source, "/diptych");
  assert.equal(vercel.rewrites[3].destination, "/projects/diptych");
});

test("no leftover clone / wax-tablet / binder / kettle content", () => {
  const page = readPage();
  const readme = readReadme();
  const source = readFileSync(modelPath(), "utf8");
  for (const blob of [page, readme]) {
    assert.doesNotMatch(blob, /copper-kettle|treacle-well|sticky-ladle|moon-watch|iron-basket|wax-belt|stenotype|masque-ball|looking-glass|gilt-edge-vizard|hinged wax-tablet|oxidized hinge/i);
  }
  assert.doesNotMatch(source, /copper jam kettle|moon-watch desk|iron fire-basket|wax-belt stenotype|gilt-edge vizard|hinged wax-tablet/i);
});

test("no network calls in the model or tests", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
  assert.doesNotMatch(source, /https?:\/\/[^\s"']*anthropic\.com\/v1/);
});
