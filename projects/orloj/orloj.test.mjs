import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ALARM,
  BACKUPS,
  BOOTH_STATIONS,
  BUILD,
  CHIPS,
  CODE_BUILD,
  CONFIRMATION,
  COUSINS,
  DISTRIBUTION,
  EXPECTED,
  FEATURED_ISSUE,
  FIELD_MARKS,
  FINGERPRINT_LINES,
  FORBIDDEN_IDLE,
  FORBIDDEN_SEED,
  HOLD,
  HOLD_ALIASES,
  HOST,
  HONORED_MINUTES,
  IDLE_WORD,
  ISSUE_URL,
  LABELS,
  LEDGER_NAMES,
  NOT_PRODUCTS,
  ORLOJ_WALK,
  PATH_WORD,
  PHRASE,
  PLATFORM,
  POSITIVE_CONTROL_WALK,
  PRODUCT_WORD,
  RULED_OUT,
  SAMPLE_ORLOJ_PROOF,
  SCHEMA_MAX_MS,
  SEEDED_WORD,
  STATE,
  SURFACE,
  TITLE,
  VALIDATION_MESSAGE,
  VERDICTS,
  analyze,
  classify,
  decide,
  emptyTicket,
  fingerprint,
  handle,
  honorHour,
  inspectActive,
  inspectPersistent,
  inspectRearm,
  inspectSchemaCap,
  inspectThirty,
  mapOrloj,
  observeLifetime,
  persistFlag,
  readBooth,
  rearmWatch,
  score,
  scoreGate,
  scoreHalfLife,
  scoreWalk,
  seedCalendar,
  seedHalfLife,
  seedLasting,
  seedOrloj,
  seedProduct,
  seedSchemaCap,
  seedThirty,
  validateTimeoutMs,
} from "./orloj.mjs";

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
  return fileURLToPath(new URL("./orloj.mjs", import.meta.url));
}

const CATALOG_SUMMARY =
  "19:50 orloj: a prague orloj / astronomical clock / zodiac dial / automaton tower booth for #94393. Monitor tool schema caps timeout_ms at 3600000 and ignores persistent; even at the allowed max the tool reports expires in 30m and dies ~30 minutes during an active session — perpetual re-arm. Idle lasting / seeded orloj / path half-life. Score orloj or admit lasting.";

test("idle lasting is a hold; schema-promised hour honored during active use", () => {
  const result = analyze(seedLasting());
  assert.equal(result.verdict, "lasting");
  assert.equal(result.idleWord, "lasting");
  assert.equal(IDLE_WORD, "lasting");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.lasting, true);
  assert.equal(result.phrase, "admit lasting");
  assert.equal(result.orloj, false);
  assert.equal(result.halfLife, false);
  assert.ok(HOLD_ALIASES.includes("hourlong"));
  assert.ok(HOLD_ALIASES.includes("promised"));
  assert.ok(HOLD_ALIASES.includes("diurnal"));
  assert.ok(HOLD_ALIASES.includes("calendar"));
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(result.idleWord, word);
    assert.notEqual(result.verdict, word);
  }
  assert.notEqual(IDLE_WORD, "enrolled");
  assert.notEqual(IDLE_WORD, "single");
  assert.notEqual(IDLE_WORD, "pledged");
  assert.notEqual(IDLE_WORD, "brisk");
  assert.notEqual(IDLE_WORD, "cadence");
  assert.notEqual(IDLE_WORD, "suspend");
  assert.notEqual(IDLE_WORD, "verbatim");
  assert.notEqual(IDLE_WORD, "quiet");
  assert.notEqual(IDLE_WORD, "intact");
  assert.notEqual(IDLE_WORD, "cleared");
  assert.notEqual(IDLE_WORD, "armed");
});

test("empty ticket and empty stdin classify lasting", () => {
  assert.equal(classify(emptyTicket()), "lasting");
  assert.equal(classify(""), "lasting");
  assert.equal(classify(null), "lasting");
  assert.equal(decide({}), "lasting");
});

test("#94393 seeded path scores orloj when the face promises an hour and the mechanism dies at half-life", () => {
  const result = analyze(seedOrloj());
  assert.equal(result.verdict, "orloj");
  assert.equal(result.seededWord, "orloj");
  assert.equal(SEEDED_WORD, "orloj");
  assert.equal(PRODUCT_WORD, "orloj");
  assert.equal(result.hold, false);
  assert.equal(result.alarm, true);
  assert.equal(result.orloj, true);
  assert.equal(result.phrase, "score orloj");
  assert.equal(result.halfLife, true);
  assert.equal(result.thirtyMinute, true);
  for (const word of FORBIDDEN_SEED) {
    assert.notEqual(result.seededWord, word);
    assert.notEqual(result.verdict, word);
  }
  assert.notEqual(SEEDED_WORD, "brisure");
  assert.notEqual(SEEDED_WORD, "diptych");
  assert.notEqual(SEEDED_WORD, "vizard");
  assert.notEqual(PATH_WORD, "fork-resume");
  assert.notEqual(PATH_WORD, "brief-echo");
});

test("educational timeout helper encodes published lasting vs half-life paths", () => {
  assert.equal(SCHEMA_MAX_MS, 3600000);
  assert.equal(HONORED_MINUTES, 30);
  assert.equal(CODE_BUILD, "2.1.270");
  const ok = validateTimeoutMs(3600000);
  assert.equal(ok.ok, true);
  const reject = validateTimeoutMs(86400000);
  assert.equal(reject.ok, false);
  assert.equal(reject.message, VALIDATION_MESSAGE);
  assert.equal(reject.code, "too_big");
  const persist = persistFlag(true);
  assert.equal(persist.honored, false);
  assert.equal(persist.rejected, true);
  const observed = observeLifetime({ timeoutMs: 3600000 });
  assert.equal(observed.lifetimeMin, 30);
  assert.match(observed.reported, /30m/);
  assert.match(CONFIRMATION, /expires in 30m/);
  const rearm = rearmWatch();
  assert.equal(rearm.lifetimeMin, 30);
  assert.equal(rearm.again, true);
  const dropped = honorHour({ lasting: false });
  assert.equal(dropped.lasting, false);
  const control = honorHour({ lasting: true });
  assert.equal(control.lasting, true);
  const scored = scoreHalfLife({
    orloj: true,
    halfLife: true,
    thirtyMinute: true,
  });
  assert.equal(scored.orloj, true);
  assert.equal(scored.halfLife, true);
  const intactPath = scoreHalfLife({ lasting: true });
  assert.equal(intactPath.orloj, false);
  assert.equal(intactPath.lasting, true);
});

test("inspectors mark schema-cap and thirty-minute confirmation", () => {
  const cap = inspectSchemaCap({ orloj: true, schemaCap: true });
  assert.equal(cap.stamp, "schema-cap");
  assert.equal(cap.capped, true);
  const thirty = inspectThirty({ orloj: true, thirtyMinute: true });
  assert.equal(thirty.stamp, "thirty-minute");
  assert.equal(thirty.thirty, true);
  const scored = scoreGate({
    orloj: true,
    halfLife: true,
    thirtyMinute: true,
    cue: "orloj",
  });
  assert.equal(scored.verdict, "orloj");
  const open = inspectSchemaCap({ lasting: true, orloj: false });
  assert.equal(open.stamp, "hourlong");
});

test("path word is half-life; booth seed holds the path", () => {
  assert.equal(PATH_WORD, "half-life");
  const result = analyze(seedHalfLife());
  assert.equal(result.verdict, "half-life");
  assert.equal(result.pathWord, "half-life");
  assert.equal(result.hold, false);
  assert.equal(
    classify({
      seed: "half-life",
      preferSeed: true,
      orloj: true,
    }),
    "half-life",
  );
  assert.equal(classify({ seed: "schema-cap", preferSeed: true }), "schema-cap");
  assert.equal(score(seedHalfLife()), "orloj");
});

test("HOLD includes lasting; aliases classify when preferSeed", () => {
  assert.ok(HOLD.includes("lasting"));
  const cal = analyze(seedCalendar());
  assert.equal(cal.verdict, "calendar");
  assert.equal(classify({ seed: "hourlong", preferSeed: true }), "hourlong");
  assert.equal(classify({ seed: "promised", preferSeed: true }), "promised");
  assert.equal(classify({ seed: "diurnal", preferSeed: true }), "diurnal");
});

test("alarm chips: schema-cap, thirty-minute, orloj", () => {
  assert.equal(classify({ seed: "schema-cap", preferSeed: true }), "schema-cap");
  assert.equal(classify(seedHalfLife()), "half-life");
  assert.equal(classify(seedProduct()), "orloj");
  assert.equal(classify(seedSchemaCap()), "schema-cap");
  assert.equal(classify(seedThirty()), "thirty-minute");
});

test("booth fixtures flip lasting vs orloj vs half-life", () => {
  const idle = scoreGate(seedLasting());
  const seeded = scoreGate(seedOrloj());
  const lasting = readData("lasting.json");
  const orloj = readData("orloj.json");
  const issued = readData("94393.json");
  const path = readData("half-life.json");
  assert.equal(idle.verdict, "lasting");
  assert.equal(seeded.verdict, "orloj");
  assert.notEqual(idle.verdict, seeded.verdict);
  assert.equal(score(seedLasting()), "lasting");
  assert.equal(score(seedOrloj()), "orloj");
  assert.equal(score({ seed: "half-life", preferSeed: true }), "orloj");
  assert.equal(lasting.halfLife, false);
  assert.equal(lasting.lasting, true);
  assert.equal(scoreGate(lasting).verdict, "lasting");
  assert.equal(orloj.halfLife, true);
  assert.equal(orloj.thirtyMinute, true);
  assert.equal(classify(orloj), "orloj");
  assert.equal(issued.issue, 94393);
  assert.equal(classify(issued), "orloj");
  assert.equal(path.paths.length, 3);
  assert.match(path.paths[0].rule, /lasting|hourlong|promised|diurnal|calendar/i);
  assert.match(path.paths[1].result, /half-life|schema-cap|thirty-minute|persistent-reject/i);
  assert.equal(classify(path), "half-life");
  assert.equal(orloj.hubCount, "ORLOJ");
  assert.equal(orloj.issue, 94393);
  assert.equal(orloj.orloj, true);
  assert.equal(classify(readData("hourlong.json")), "hourlong");
  assert.equal(classify(readData("promised.json")), "promised");
  assert.equal(classify(readData("diurnal.json")), "diurnal");
  assert.equal(classify(readData("calendar.json")), "calendar");
  assert.equal(classify(readData("schema-cap.json")), "schema-cap");
  assert.equal(classify(readData("thirty-minute.json")), "thirty-minute");
  assert.equal(classify(readData("persistent-reject.json")), "persistent-reject");
  assert.equal(classify(readData("re-arm.json")), "re-arm");
  assert.equal(classify(readData("active-session.json")), "active-session");
  assert.equal(classify(readData("docs-promise.json")), "docs-promise");
  assert.equal(classify(readData("landing.json")), "landing");
  assert.equal(classify(readData("cousins.json")), "cousins");
  assert.deepEqual(readData("cousins.json").issues, [63023, 65968]);
  assert.equal(classify(readData("backups.json")), "backups");
  assert.equal(classify(readData("walk.json")), "walk");
  assert.equal(classify(readData("has-repro.json")), "has-repro");
  assert.equal(classify(readData("fixtures.json")), "fixtures");
  assert.equal(classify(readData("closed.json")), "closed");
});

test("chips include idle, seeded, path, and walk", () => {
  assert.ok(CHIPS.includes("lasting"));
  assert.ok(CHIPS.includes("orloj"));
  assert.ok(CHIPS.includes("half-life"));
  assert.ok(CHIPS.includes("schema-cap"));
  assert.ok(CHIPS.includes("thirty-minute"));
  assert.ok(CHIPS.includes("persistent-reject"));
  assert.ok(CHIPS.includes("calendar"));
  assert.ok(CHIPS.includes("fixtures"));
  assert.ok(CHIPS.includes("walk"));
  assert.ok(ALARM.includes("orloj"));
  assert.ok(ALARM.includes("half-life"));
  assert.ok(ALARM.includes("schema-cap"));
  assert.ok(ALARM.includes("thirty-minute"));
  assert.ok(VERDICTS.includes("walk"));
  assert.equal(classify({ seed: "fixtures", preferSeed: true }), "fixtures");
  assert.equal(classify({ seed: "walk", preferSeed: true }), "walk");
});

test("published orloj walk scores orloj after the idle hold", () => {
  const booth = scoreWalk({ rows: ORLOJ_WALK });
  assert.equal(booth.verdict, "orloj");
  assert.ok(booth.orlojCount >= 1);
  const idle = booth.rows.find((row) => row.event === "calendar");
  assert.equal(idle.lasting, true);
  assert.equal(idle.verdict, "lasting");
  const cut = booth.rows.find((row) => row.event === "half-life");
  assert.equal(cut.halfLife, true);
  const path = booth.rows.find(
    (row) => row.event === "half-life" && row.t === "path",
  );
  assert.equal(path.verdict, "half-life");
});

test("ORLOJ_WALK constant matches the issue tower walk", () => {
  assert.equal(ORLOJ_WALK[0].event, "calendar");
  const cut = ORLOJ_WALK.find((row) => row.event === "half-life");
  assert.equal(cut.halfLife || cut.thirtyMinute, true);
  const path = ORLOJ_WALK.find((row) => row.t === "path");
  assert.equal(path.orloj, true);
  const scoreRow = ORLOJ_WALK.find((row) => row.event === "orloj");
  assert.equal(scoreRow.orloj, true);
  assert.equal(scoreRow.thirtyMinute, true);
});

test("positive control calendar folio stays lasting", () => {
  const walk = scoreWalk({ rows: POSITIVE_CONTROL_WALK });
  assert.equal(walk.verdict, "lasting");
  const ok = walk.rows.find((row) => row.t === "hold");
  assert.equal(ok.verdict, "lasting");
  const hold = walk.rows.find((row) => row.event === "calendar");
  assert.equal(hold.lasting, true);
  assert.equal(hold.verdict, "lasting");
});

test("issue constants encode only #94393 published facts", () => {
  assert.equal(FEATURED_ISSUE, 94393);
  assert.ok(ISSUE_URL.includes("94393"));
  assert.match(TITLE, /Monitor tool|persistent|timeout_ms|30 minutes/i);
  assert.equal(STATE, "OPEN");
  assert.match(PLATFORM, /linux/i);
  assert.match(HOST, /2\.1\.270|Ubuntu/i);
  assert.equal(BUILD, "Claude Code 2.1.270");
  assert.equal(SURFACE, "half-life");
  assert.deepEqual(
    [...LABELS],
    ["bug", "has repro", "platform:linux", "area:tools"],
  );
  assert.equal(FIELD_MARKS.length, 6);
  assert.equal(LEDGER_NAMES.length, 6);
  assert.ok(RULED_OUT.some((row) => /#63023/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /#65968/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /Brisure|#94396/i.test(row)));
  assert.ok(EXPECTED.some((row) => /24h|honored lifetime|30 minutes/i.test(row)));
  assert.match(
    DISTRIBUTION,
    /3600000|86400000|expires in 30m|InputValidationError|task-notification/i,
  );
  assert.equal(BOOTH_STATIONS.length, 6);
  assert.ok(FINGERPRINT_LINES.includes("half-life"));
  assert.ok(FINGERPRINT_LINES.includes("orloj"));
  assert.equal(PHRASE, "Score orloj or admit lasting.");
  assert.equal(SAMPLE_ORLOJ_PROOF.halfLife, true);
  assert.equal(SAMPLE_ORLOJ_PROOF.names.length, 6);
});

test("has-repro fingerprints encode the published orloj proof", () => {
  const result = handle(seedOrloj());
  assert.equal(result.published.platform, "linux");
  assert.equal(result.published.surface, "half-life");
  assert.equal(result.published.host, HOST);
  assert.match(
    fingerprint(seedOrloj()),
    /orloj\|kind=half-life\|ref=thirty-minute\|path=half-life\|cue=half-life/,
  );
  assert.equal(classify({ seed: "has-repro", preferSeed: true }), "has-repro");
});

test("forbidden idle list includes prior catalog words and enrolled/single/pledged", () => {
  const required = [
    "enrolled",
    "single",
    "pledged",
    "brisk",
    "cadence",
    "suspend",
    "verbatim",
    "quiet",
    "intact",
    "cleared",
    "armed",
    "brisure",
    "diptych",
    "vizard",
    "treacle",
    "somnus",
    "cresset",
    "dictabelt",
    "lemure",
    "cancellans",
    "arras",
    "fork-resume",
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

test("lasting booth flips orloj back when the tower admits lasting", () => {
  const tape = {
    lasting: true,
    orloj: false,
    halfLife: false,
    cue: "lasting",
  };
  assert.equal(scoreGate(tape).verdict, "lasting");
  tape.lasting = false;
  tape.orloj = true;
  tape.halfLife = true;
  tape.cue = "orloj";
  assert.equal(scoreGate(tape).verdict, "orloj");
  tape.lasting = true;
  tape.orloj = false;
  tape.halfLife = false;
  tape.cue = "lasting";
  assert.equal(scoreGate(tape).verdict, "lasting");
});

test("schema, thirty, persist, and readBooth mark the orloj proof", () => {
  const cap = inspectSchemaCap({ orloj: true });
  assert.equal(cap.stamp, "schema-cap");
  const thirty = inspectThirty({ orloj: true, thirtyMinute: true });
  assert.equal(thirty.stamp, "thirty-minute");
  assert.equal(thirty.thirty, true);
  const booth = readBooth({
    orloj: true,
    halfLife: true,
    thirtyMinute: true,
  });
  assert.equal(booth.orloj, true);
  assert.equal(booth.mark, "orloj");
  const open = readBooth({
    lasting: true,
    orloj: false,
    halfLife: false,
  });
  assert.equal(open.orloj, false);
  assert.equal(open.mark, "lasting");
  assert.equal(inspectPersistent({ orloj: true, persistentReject: true }).stamp, "persistent-reject");
  assert.equal(inspectRearm({ orloj: true, rearmLoop: true }).stamp, "re-arm");
  assert.equal(inspectActive({ orloj: true, activeSession: true }).stamp, "active-session");
});

test("mapOrloj encodes the published half-life", () => {
  const miss = mapOrloj({ orloj: true, halfLife: true });
  assert.equal(miss.stamp, "half-life");
  assert.equal(miss.holdingLane, "thirty-chime");
  assert.equal(miss.ribbon, "orloj");
  const clear = mapOrloj({ lasting: true, orloj: false });
  assert.equal(clear.stamp, "calendar");
  assert.equal(clear.kindLane, "hour-dial");
  assert.equal(clear.holdingLane, "calendar");
});

test("cousins stay cite-only; products stay distinct; backups stay data-only", () => {
  assert.equal(COUSINS.length, 2);
  assert.deepEqual(COUSINS.map((row) => row.issue), [63023, 65968]);
  assert.ok(COUSINS.every((row) => row.citeOnly === true));
  assert.ok(NOT_PRODUCTS.includes("brisure"));
  assert.ok(NOT_PRODUCTS.includes("diptych"));
  assert.ok(NOT_PRODUCTS.includes("vizard"));
  assert.ok(NOT_PRODUCTS.includes("cancellans"));
  assert.ok(NOT_PRODUCTS.includes("arras"));
  assert.equal(BACKUPS.length, 11);
  assert.equal(BACKUPS[0].issue, 94392);
  assert.equal(BACKUPS[10].issue, 94151);
  assert.ok(BACKUPS.every((row) => row.citeOnly === true));
  assert.ok(!BACKUPS.some((row) => row.issue === 94393));
  assert.ok(!COUSINS.some((row) => row.issue === 94393));
  assert.equal(classify({ seed: "cousins", preferSeed: true }), "cousins");
  assert.equal(classify({ seed: "backups", preferSeed: true }), "backups");
});

test("CLI scores fixtures without a server", () => {
  const idle = spawnSync(process.execPath, [modelPath()], { encoding: "utf8" });
  const seeded = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/orloj.json", import.meta.url))],
    { encoding: "utf8" },
  );
  const lastingFix = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/lasting.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(idle.status, 0, idle.stderr);
  assert.equal(seeded.status, 0, seeded.stderr);
  assert.equal(lastingFix.status, 0, lastingFix.stderr);
  const idleOut = JSON.parse(idle.stdout);
  const seededOut = JSON.parse(seeded.stdout);
  const lastingOut = JSON.parse(lastingFix.stdout);
  assert.equal(idleOut.verdict, "lasting");
  assert.equal(idleOut.hold, true);
  assert.equal(seededOut.verdict, "orloj");
  assert.equal(seededOut.alarm, true);
  assert.equal(lastingOut.verdict, "lasting");
  assert.equal(lastingOut.hold, true);
  assert.match(lastingOut.phrase, /admit lasting/);
});

test("handle exposes published hypothesis and #94393 headline", () => {
  const result = handle(seedOrloj());
  assert.equal(result.published.issue, 94393);
  assert.equal(result.published.platform, "linux");
  assert.deepEqual(result.published.cousins, [63023, 65968]);
  assert.ok(result.published.backups.includes(94392));
  assert.ok(result.published.backups.includes(94151));
  assert.ok(!result.published.backups.includes(94393));
  assert.match(
    result.published.hypothesis,
    /schema max|30m|NON-BINDING|#94393/i,
  );
  assert.match(result.published.hypothesis, /NON-BINDING/);
  assert.match(result.published.hypothesis, /#94393/);
  assert.equal(result.published.build, BUILD);
});

test("model has no static node: imports so the lasting page can score in-browser", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /^import .* from "node:/m);
  assert.match(source, /import\("node:fs"\)/);
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
});

test("lasting page is a Prague orloj, not herald college or wax-tablet", () => {
  const page = readPage();
  assert.match(page, /family=Bodoni\+Moda|Bodoni Moda/);
  assert.match(page, /family=Karla|Karla/);
  assert.match(page, /family=Source\+Code\+Pro|Source Code Pro/);
  assert.match(
    page,
    /orloj|lasting|half-life|clock-face|zodiac-dial|automaton|calendar-dial|clock-tower/i,
  );
  assert.match(page, /#0C1228|#C9A24A|#F6EAD4|#A63A28/i);
  assert.match(page, /\blasting\b/);
  assert.match(page, /\borloj\b/);
  assert.match(page, /half-life/);
  assert.match(page, /Score orloj or admit lasting/i);
  assert.match(page, /#379/);
  assert.match(page, /#94393/);
  assert.match(page, /Admit lasting/);
  assert.match(page, /Score orloj/);
  assert.match(page, /Walk half-life/);
  assert.match(page, /Compare lasting \/ orloj/);
  assert.match(page, /Pin idle lasting/);
  assert.match(page, /Pin seeded orloj/);
  assert.match(page, /Pin half-life/);
  assert.match(page, /Stamp thirty-minute/);
  assert.match(page, /Score booth/);
  assert.match(page, /orloj-score/);
  assert.match(
    page,
    /timeout_ms|3600000|expires in 30m|InputValidationError|persistent/i,
  );
  assert.match(page, /hour-dial|zodiac-ring|persistent-gate|thirty-chime|active-tower|rearm-walk/i);
  assert.match(
    page,
    /<svg[\s\S]*class="clock-face"|class="zodiac-dial"|class="calendar-dial"|class="automaton-walk"|class="clock-tower"/i,
  );
  assert.doesNotMatch(page, /family=Cinzel|Cinzel/);
  assert.doesNotMatch(page, /family=Sora|Sora/);
  assert.doesNotMatch(page, /IBM\+Plex\+Mono|IBM Plex Mono/);
  assert.doesNotMatch(page, /family=Spectral|Spectral/);
  assert.doesNotMatch(page, /family=Source\+Sans\+3|Source Sans 3/);
  assert.doesNotMatch(page, /JetBrains\+Mono|JetBrains Mono/);
  assert.doesNotMatch(page, /family=Lora|Lora/);
  assert.doesNotMatch(page, /family=Public\+Sans|Public Sans/);
  assert.doesNotMatch(page, /family=Cormorant|Cormorant/);
  assert.doesNotMatch(page, /family=Nunito|Nunito/);
  assert.doesNotMatch(page, /family=Figtree|Figtree/);
  assert.doesNotMatch(page, /family=Playfair|Playfair/);
  assert.doesNotMatch(page, /#7B1224|#F3EBDC|#0E0B09|#D6B45A|#1F4F8F|#24160F/);
  assert.doesNotMatch(page, /herald's college|armorial roll|cadency desk|lacquered shield/i);
  assert.doesNotMatch(page, /hinged wax-tablet|illuminated choir|oxidized hinge/i);
  assert.doesNotMatch(page, /masque-ball|looking-glass|gilt-edge vizard/i);
  assert.doesNotMatch(page, /copper kettle|treacle-well|sticky-ladle/i);
  assert.doesNotMatch(page, /night-nursery|moon-watch|sleep-clinic/i);
  assert.doesNotMatch(page, /binder-cloth|cancelled-stamp|folio-press/i);
  assert.doesNotMatch(page, /admit enrolled|Score brisure|idle enrolled/i);
  assert.doesNotMatch(page, /admit single|Score diptych|idle single/i);
  assert.doesNotMatch(page, /admit pledged|Score vizard|idle pledged/i);
  assert.doesNotMatch(page, /\bbrisure\b/);
  assert.doesNotMatch(page, /\bdiptych\b/);
  assert.doesNotMatch(page, /\bvizard\b/);
  assert.doesNotMatch(page, /\btreacle\b/);
  assert.doesNotMatch(page, /\bsomnus\b/);
  assert.doesNotMatch(page, /\bcresset\b/);
  assert.doesNotMatch(page, /\bdictabelt\b/);
  assert.doesNotMatch(page, /\blemure\b/);
  assert.doesNotMatch(page, /\bcancellans\b/);
  assert.doesNotMatch(page, /\barras\b/);
  assert.doesNotMatch(page, /fork-resume/);
  assert.doesNotMatch(page, /brief-echo/);
  assert.doesNotMatch(page, /background-reset/);
  assert.doesNotMatch(page, /streaming-stall/);
  assert.doesNotMatch(page, /device-absent/);
  assert.doesNotMatch(page, /hold-leak/);
  assert.doesNotMatch(page, /segment-drop/);
  assert.doesNotMatch(page, /orphan-tick/);
  assert.doesNotMatch(page, /deferred-delta/);
  assert.doesNotMatch(page, /phantom-prompt/);
  assert.match(page, /NOT Brisure/i);
  assert.match(page, /NOT #63023/i);
  assert.match(page, /NOT #65968/i);
  assert.match(page, /#63023/);
  assert.match(page, /#65968/);
  assert.doesNotMatch(page, /fetch\(/);
  assert.match(page, /body\.embed/);
});

test("README states the thesis, anti-clone, and how to score", () => {
  const readme = readReadme();
  assert.match(readme, /Orloj/);
  assert.match(readme, /#94393/);
  assert.match(readme, /\blasting\b/);
  assert.match(readme, /\borloj\b/);
  assert.match(readme, /half-life/);
  assert.match(readme, /Bodoni Moda/);
  assert.match(readme, /Karla/);
  assert.match(readme, /Source Code Pro/);
  assert.doesNotMatch(readme, /Cinzel/);
  assert.doesNotMatch(readme, /Sora/);
  assert.doesNotMatch(readme, /IBM Plex Mono/);
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /Research brief/i);
  assert.match(readme, /timeout_ms|3600000|expires in 30m|InputValidationError|persistent/i);
  assert.match(readme, /NOT #63023/);
  assert.match(readme, /NOT #65968/);
  assert.match(readme, /NOT Brisure\/#94396/);
  assert.match(readme, /NOT Diptych\/#94397/);
  assert.match(readme, /NOT Vizard\/#94398/);
  assert.match(readme, /NOT Treacle\/#94344/);
  assert.match(readme, /#63023/);
  assert.match(readme, /#65968/);
  assert.match(readme, /do NOT rebuild|do not conflate/i);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/orloj/);
  assert.match(readme, /node --test projects\/orloj\/orloj\.test\.mjs/);
  assert.match(readme, /NON-BINDING/);
  assert.match(readme, /Prague|astronomical clock|zodiac|automaton|calendar dial/i);
  assert.match(readme, /Score orloj or admit lasting/);
  assert.match(readme, /#94392|#94458|#94151/);
  assert.doesNotMatch(readme, /backup #94393|#94393 as next/);
  assert.match(readme, /19:50/);
  assert.match(readme, /Do NOT implement a fix/i);
  assert.doesNotMatch(readme, /\bbrisure\b/);
  assert.doesNotMatch(readme, /\bdiptych\b/);
  assert.doesNotMatch(readme, /\bvizard\b/);
  const runLog = readFileSync(
    fileURLToPath(new URL("../../RUN_LOG.md", import.meta.url)),
    "utf8",
  );
  assert.match(runLog, /## 2026-09-15 — Orloj/);
  assert.match(runLog, /19:50/);
});

test("catalog features Orloj only; Brisure unfeatured; product count 379", () => {
  const catalog = readCatalog();
  const hub = readHubCatalog();
  assert.equal(catalog.products.length, 379);
  assert.equal(hub.products.length, 379);
  assert.equal(catalog.products[0].name, "Orloj");
  assert.equal(catalog.products[0].slug, "orloj");
  assert.equal(catalog.products[0].featured, true);
  assert.equal(catalog.products[0].href, "/orloj/");
  assert.equal(catalog.products[0].day, "2026-09-15");
  assert.equal(catalog.products[0].summary, CATALOG_SUMMARY);
  assert.equal(hub.products[0].summary, catalog.products[0].summary);
  assert.match(catalog.products[0].summary, /\blasting\b/);
  assert.match(catalog.products[0].summary, /\borloj\b/);
  assert.match(catalog.products[0].summary, /half-life/);
  assert.match(catalog.products[0].summary, /Score orloj or admit lasting/);
  assert.match(catalog.products[0].summary, /#94393/);
  assert.match(catalog.products[0].summary, /19:50/);
  assert.equal(hub.products[0].slug, "orloj");
  assert.equal(hub.products[0].featured, true);
  const brisure = catalog.products.find((row) => row.slug === "brisure");
  assert.ok(brisure);
  assert.equal(brisure.featured, false);
  const diptych = catalog.products.find((row) => row.slug === "diptych");
  assert.ok(diptych);
  assert.equal(diptych.featured, false);
  assert.equal(catalog.products.filter((row) => row.featured).length, 1);
  assert.equal(
    catalog.products.filter((row) => row.slug === "orloj" && row.featured).length,
    1,
  );
  assert.ok(
    !catalog.products.some(
      (row) => String(row.summary || "").includes("94393") && row.slug !== "orloj",
    ),
  );
});

test("vercel rewrites orloj to the project folder at the top", () => {
  const vercel = readVercel();
  assert.equal(vercel.rewrites[0].source, "/orloj");
  assert.equal(vercel.rewrites[0].destination, "/projects/orloj");
  assert.equal(vercel.rewrites[1].source, "/orloj/");
  assert.equal(vercel.rewrites[1].destination, "/projects/orloj");
  assert.equal(vercel.rewrites[2].source, "/orloj/:path*");
  assert.equal(vercel.rewrites[2].destination, "/projects/orloj/:path*");
  assert.equal(vercel.rewrites[3].source, "/brisure");
  assert.equal(vercel.rewrites[3].destination, "/projects/brisure");
});

test("no leftover clone / herald / wax-tablet / kettle content", () => {
  const page = readPage();
  const readme = readReadme();
  const source = readFileSync(modelPath(), "utf8");
  for (const blob of [page, readme]) {
    assert.doesNotMatch(blob, /copper-kettle|treacle-well|sticky-ladle|moon-watch|iron-basket|wax-belt|stenotype|masque-ball|looking-glass|gilt-edge-vizard|hinged wax-tablet|cadency-desk|shield-rack/i);
  }
  assert.doesNotMatch(source, /copper jam kettle|moon-watch desk|iron fire-basket|wax-belt stenotype|gilt-edge vizard|hinged wax-tablet|lacquered shield rack/i);
});

test("no network calls in the model or tests", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
  assert.doesNotMatch(source, /https?:\/\/[^\s"']*anthropic\.com\/v1/);
});
