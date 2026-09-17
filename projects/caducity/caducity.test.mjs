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
  CADUCITY_WALK,
  PATH_WORD,
  PHRASE,
  PLATFORM,
  POSITIVE_CONTROL_WALK,
  PRODUCT_WORD,
  RULED_OUT,
  SAMPLE_LAPSED_PROOF,
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
  mapCaducity,
  observeLifetime,
  persistFlag,
  readBooth,
  rearmWatch,
  score,
  scoreGate,
  scoreThirtyCap,
  scoreWalk,
  seedSessionLong,
  seedThirtyCap,
  seedAbiding,
  seedLapsed,
  seedProduct,
  seedSchemaCap,
  seedThirty,
  validateTimeoutMs,
} from "./caducity.mjs";

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
  return fileURLToPath(new URL("./caducity.mjs", import.meta.url));
}

const CATALOG_SUMMARY =
  "21:10 caducity: a caducity / lease lapse / false-persistence / thirty-cap booth for #94553. Since ~2.1.268/2.1.272 Monitor with persistent:true is capped at 30m despite timeout_ms; tool says expires in 30m then Monitor expired after 30m — mail/webhook watches must re-arm. Idle abiding / seeded lapsed / path thirty-cap. Score caducity or admit abiding.";

test("idle abiding is a hold; schema-tenured hour honored during active use", () => {
  const result = analyze(seedAbiding());
  assert.equal(result.verdict, "abiding");
  assert.equal(result.idleWord, "abiding");
  assert.equal(IDLE_WORD, "abiding");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.abiding, true);
  assert.equal(result.phrase, "admit abiding");
  assert.equal(result.lapsed, false);
  assert.equal(result.thirtyCap, false);
  assert.ok(HOLD_ALIASES.includes("perennial"));
  assert.ok(HOLD_ALIASES.includes("tenured"));
  assert.ok(HOLD_ALIASES.includes("enduring"));
  assert.equal(HOLD_ALIASES.length, 3);
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

test("empty ticket and empty stdin classify abiding", () => {
  assert.equal(classify(emptyTicket()), "abiding");
  assert.equal(classify(""), "abiding");
  assert.equal(classify(null), "abiding");
  assert.equal(decide({}), "abiding");
});

test("#94553 seeded path scores lapsed when the face promises an hour and the mechanism dies at thirty-cap", () => {
  const result = analyze(seedLapsed());
  assert.equal(result.verdict, "lapsed");
  assert.equal(result.seededWord, "lapsed");
  assert.equal(SEEDED_WORD, "lapsed");
  assert.equal(PRODUCT_WORD, "caducity");
  assert.equal(result.hold, false);
  assert.equal(result.alarm, true);
  assert.equal(result.lapsed, true);
  assert.equal(result.phrase, "score caducity");
  assert.equal(result.thirtyCap, true);
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

test("educational timeout helper encodes published abiding vs thirty-cap paths", () => {
  assert.equal(SCHEMA_MAX_MS, 3600000);
  assert.equal(HONORED_MINUTES, 30);
  assert.equal(CODE_BUILD, "2.1.272");
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
  const dropped = honorHour({ abiding: false });
  assert.equal(dropped.abiding, false);
  const control = honorHour({ abiding: true });
  assert.equal(control.abiding, true);
  const scored = scoreThirtyCap({
    lapsed: true,
    thirtyCap: true,
    thirtyMinute: true,
  });
  assert.equal(scored.lapsed, true);
  assert.equal(scored.thirtyCap, true);
  const intactPath = scoreThirtyCap({ abiding: true });
  assert.equal(intactPath.lapsed, false);
  assert.equal(intactPath.abiding, true);
});

test("inspectors mark schema-cap and thirty-minute confirmation", () => {
  const cap = inspectSchemaCap({ lapsed: true, schemaCap: true });
  assert.equal(cap.stamp, "schema-cap");
  assert.equal(cap.capped, true);
  const thirty = inspectThirty({ lapsed: true, thirtyMinute: true });
  assert.equal(thirty.stamp, "thirty-minute");
  assert.equal(thirty.thirty, true);
  const scored = scoreGate({
    lapsed: true,
    thirtyCap: true,
    thirtyMinute: true,
    cue: "lapsed",
  });
  assert.equal(scored.verdict, "lapsed");
  const open = inspectSchemaCap({ abiding: true, lapsed: false });
  assert.equal(open.stamp, "perennial");
});

test("path word is thirty-cap; booth seed holds the path", () => {
  assert.equal(PATH_WORD, "thirty-cap");
  const result = analyze(seedThirtyCap());
  assert.equal(result.verdict, "thirty-cap");
  assert.equal(result.pathWord, "thirty-cap");
  assert.equal(result.hold, false);
  assert.equal(
    classify({
      seed: "thirty-cap",
      preferSeed: true,
      lapsed: true,
    }),
    "thirty-cap",
  );
  assert.equal(classify({ seed: "schema-cap", preferSeed: true }), "schema-cap");
  assert.equal(score(seedThirtyCap()), "caducity");
});

test("HOLD includes abiding; aliases classify when preferSeed", () => {
  assert.ok(HOLD.includes("abiding"));
  const cal = analyze(seedSessionLong());
  assert.equal(cal.verdict, "session-long");
  assert.equal(classify({ seed: "perennial", preferSeed: true }), "perennial");
  assert.equal(classify({ seed: "tenured", preferSeed: true }), "tenured");
  assert.equal(classify({ seed: "enduring", preferSeed: true }), "enduring");
});

test("alarm chips: schema-cap, thirty-minute, lapsed", () => {
  assert.equal(classify({ seed: "schema-cap", preferSeed: true }), "schema-cap");
  assert.equal(classify(seedThirtyCap()), "thirty-cap");
  assert.equal(classify(seedProduct()), "lapsed");
  assert.equal(classify(seedSchemaCap()), "schema-cap");
  assert.equal(classify(seedThirty()), "thirty-minute");
});

test("booth fixtures flip abiding vs lapsed vs thirty-cap", () => {
  const idle = scoreGate(seedAbiding());
  const seeded = scoreGate(seedLapsed());
  const abiding = readData("abiding.json");
  const lapsed = readData("lapsed.json");
  const issued = readData("94553.json");
  const path = readData("thirty-cap.json");
  assert.equal(idle.verdict, "abiding");
  assert.equal(seeded.verdict, "lapsed");
  assert.notEqual(idle.verdict, seeded.verdict);
  assert.equal(score(seedAbiding()), "abiding");
  assert.equal(score(seedLapsed()), "caducity");
  assert.equal(score({ seed: "thirty-cap", preferSeed: true }), "caducity");
  assert.equal(abiding.thirtyCap, false);
  assert.equal(abiding.abiding, true);
  assert.equal(scoreGate(abiding).verdict, "abiding");
  assert.equal(lapsed.thirtyCap, true);
  assert.equal(lapsed.thirtyMinute, true);
  assert.equal(classify(lapsed), "lapsed");
  assert.equal(issued.issue, 94553);
  assert.equal(classify(issued), "lapsed");
  assert.equal(path.paths.length, 3);
  assert.match(path.paths[0].rule, /abiding|perennial|tenured|enduring|session-long/i);
  assert.match(path.paths[1].result, /thirty-cap|schema-cap|thirty-minute|persistent-reject/i);
  assert.equal(classify(path), "thirty-cap");
  assert.equal(lapsed.hubCount, "LAPSED");
  assert.equal(lapsed.issue, 94553);
  assert.equal(lapsed.lapsed, true);
  assert.equal(classify(readData("perennial.json")), "perennial");
  assert.equal(classify(readData("tenured.json")), "tenured");
  assert.equal(classify(readData("enduring.json")), "enduring");
  assert.equal(classify(readData("session-long.json")), "session-long");
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
  assert.ok(CHIPS.includes("abiding"));
  assert.ok(CHIPS.includes("lapsed"));
  assert.ok(CHIPS.includes("thirty-cap"));
  assert.ok(CHIPS.includes("schema-cap"));
  assert.ok(CHIPS.includes("thirty-minute"));
  assert.ok(CHIPS.includes("persistent-reject"));
  assert.ok(CHIPS.includes("session-long"));
  assert.ok(CHIPS.includes("fixtures"));
  assert.ok(CHIPS.includes("walk"));
  assert.ok(ALARM.includes("lapsed"));
  assert.ok(ALARM.includes("thirty-cap"));
  assert.ok(ALARM.includes("schema-cap"));
  assert.ok(ALARM.includes("thirty-minute"));
  assert.ok(VERDICTS.includes("walk"));
  assert.equal(classify({ seed: "fixtures", preferSeed: true }), "fixtures");
  assert.equal(classify({ seed: "walk", preferSeed: true }), "walk");
});

test("published caducity walk scores lapsed after the idle hold", () => {
  const booth = scoreWalk({ rows: CADUCITY_WALK });
  assert.equal(booth.verdict, "lapsed");
  assert.ok(booth.lapsedCount >= 1);
  const idle = booth.rows.find((row) => row.event === "session-long");
  assert.equal(idle.abiding, true);
  assert.equal(idle.verdict, "abiding");
  const cut = booth.rows.find((row) => row.event === "thirty-cap");
  assert.equal(cut.thirtyCap, true);
  const path = booth.rows.find(
    (row) => row.event === "thirty-cap" && row.t === "path",
  );
  assert.equal(path.verdict, "thirty-cap");
});

test("CADUCITY_WALK constant matches the issue tower walk", () => {
  assert.equal(CADUCITY_WALK[0].event, "session-long");
  const cut = CADUCITY_WALK.find((row) => row.event === "thirty-cap");
  assert.equal(cut.thirtyCap || cut.thirtyMinute, true);
  const path = CADUCITY_WALK.find((row) => row.t === "path");
  assert.equal(path.lapsed, true);
  const scoreRow = CADUCITY_WALK.find((row) => row.event === "lapsed");
  assert.equal(scoreRow.lapsed, true);
  assert.equal(scoreRow.thirtyMinute, true);
});

test("positive control session-long folio stays abiding", () => {
  const walk = scoreWalk({ rows: POSITIVE_CONTROL_WALK });
  assert.equal(walk.verdict, "abiding");
  const ok = walk.rows.find((row) => row.t === "hold");
  assert.equal(ok.verdict, "abiding");
  const hold = walk.rows.find((row) => row.event === "session-long");
  assert.equal(hold.abiding, true);
  assert.equal(hold.verdict, "abiding");
});

test("issue constants encode only #94553 published facts", () => {
  assert.equal(FEATURED_ISSUE, 94553);
  assert.ok(ISSUE_URL.includes("94553"));
  assert.match(TITLE, /Monitor tool|persistent|timeout_ms|30 minutes/i);
  assert.equal(STATE, "OPEN");
  assert.match(PLATFORM, /linux/i);
  assert.match(HOST, /2\.1\.272|Arch|persistent/i);
  assert.equal(BUILD, "Claude Code 2.1.272");
  assert.equal(SURFACE, "thirty-cap");
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
  assert.ok(FINGERPRINT_LINES.includes("thirty-cap"));
  assert.ok(FINGERPRINT_LINES.includes("lapsed"));
  assert.equal(PHRASE, "Score caducity or admit abiding.");
  assert.equal(SAMPLE_LAPSED_PROOF.thirtyCap, true);
  assert.equal(SAMPLE_LAPSED_PROOF.names.length, 6);
});

test("has-repro fingerprints encode the published lapsed proof", () => {
  const result = handle(seedLapsed());
  assert.equal(result.published.platform, "linux");
  assert.equal(result.published.surface, "thirty-cap");
  assert.equal(result.published.host, HOST);
  assert.match(
    fingerprint(seedLapsed()),
    /lapsed\|kind=thirty-cap\|ref=thirty-minute\|path=thirty-cap\|cue=thirty-cap/,
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

test("abiding booth flips lapsed back when the tower admits abiding", () => {
  const tape = {
    abiding: true,
    lapsed: false,
    thirtyCap: false,
    cue: "abiding",
  };
  assert.equal(scoreGate(tape).verdict, "abiding");
  tape.abiding = false;
  tape.lapsed = true;
  tape.thirtyCap = true;
  tape.cue = "lapsed";
  assert.equal(scoreGate(tape).verdict, "lapsed");
  tape.abiding = true;
  tape.lapsed = false;
  tape.thirtyCap = false;
  tape.cue = "abiding";
  assert.equal(scoreGate(tape).verdict, "abiding");
});

test("schema, thirty, persist, and readBooth mark the lapsed proof", () => {
  const cap = inspectSchemaCap({ lapsed: true });
  assert.equal(cap.stamp, "schema-cap");
  const thirty = inspectThirty({ lapsed: true, thirtyMinute: true });
  assert.equal(thirty.stamp, "thirty-minute");
  assert.equal(thirty.thirty, true);
  const booth = readBooth({
    lapsed: true,
    thirtyCap: true,
    thirtyMinute: true,
  });
  assert.equal(booth.lapsed, true);
  assert.equal(booth.mark, "lapsed");
  const open = readBooth({
    abiding: true,
    lapsed: false,
    thirtyCap: false,
  });
  assert.equal(open.lapsed, false);
  assert.equal(open.mark, "abiding");
  assert.equal(inspectPersistent({ lapsed: true, persistentReject: true }).stamp, "persistent-reject");
  assert.equal(inspectRearm({ lapsed: true, rearmLoop: true }).stamp, "re-arm");
  assert.equal(inspectActive({ lapsed: true, activeSession: true }).stamp, "active-session");
});

test("mapCaducity encodes the published thirty-cap", () => {
  const miss = mapCaducity({ lapsed: true, thirtyCap: true });
  assert.equal(miss.stamp, "thirty-cap");
  assert.equal(miss.holdingLane, "thirty-chime");
  assert.equal(miss.ribbon, "lapsed");
  const clear = mapCaducity({ abiding: true, lapsed: false });
  assert.equal(clear.stamp, "session-long");
  assert.equal(clear.kindLane, "hour-dial");
  assert.equal(clear.holdingLane, "session-long");
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
  assert.equal(BACKUPS.length, 5);
  assert.equal(BACKUPS[0].issue, 94560);
  assert.equal(BACKUPS[4].issue, 94151);
  assert.ok(BACKUPS.every((row) => row.citeOnly === true));
  assert.ok(!BACKUPS.some((row) => row.issue === 94553));
  assert.ok(!COUSINS.some((row) => row.issue === 94553));
  assert.equal(classify({ seed: "cousins", preferSeed: true }), "cousins");
  assert.equal(classify({ seed: "backups", preferSeed: true }), "backups");
});

test("CLI scores fixtures without a server", () => {
  const idle = spawnSync(process.execPath, [modelPath()], { encoding: "utf8" });
  const seeded = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/lapsed.json", import.meta.url))],
    { encoding: "utf8" },
  );
  const abidingFix = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/abiding.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(idle.status, 0, idle.stderr);
  assert.equal(seeded.status, 0, seeded.stderr);
  assert.equal(abidingFix.status, 0, abidingFix.stderr);
  const idleOut = JSON.parse(idle.stdout);
  const seededOut = JSON.parse(seeded.stdout);
  const abidingOut = JSON.parse(abidingFix.stdout);
  assert.equal(idleOut.verdict, "abiding");
  assert.equal(idleOut.hold, true);
  assert.equal(seededOut.verdict, "lapsed");
  assert.equal(seededOut.alarm, true);
  assert.equal(abidingOut.verdict, "abiding");
  assert.equal(abidingOut.hold, true);
  assert.match(abidingOut.phrase, /admit abiding/);
});

test("handle exposes published hypothesis and #94553 headline", () => {
  const result = handle(seedLapsed());
  assert.equal(result.published.issue, 94553);
  assert.equal(result.published.platform, "linux");
  assert.deepEqual(result.published.cousins, [63023, 65968]);
  assert.ok(result.published.backups.includes(94560));
  assert.ok(result.published.backups.includes(94151));
  assert.ok(!result.published.backups.includes(94553));
  assert.match(
    result.published.hypothesis,
    /30m|persistent|NON-BINDING|#94553/i,
  );
  assert.match(result.published.hypothesis, /NON-BINDING/);
  assert.match(result.published.hypothesis, /#94553/);
  assert.equal(result.published.build, BUILD);
});

test("model has no static node: imports so the abiding page can score in-browser", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /^import .* from "node:/m);
  assert.match(source, /import\("node:fs"\)/);
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
});

test("abiding page is a lease watch desk, not Efface or Apocope", () => {
  const page = readPage();
  assert.match(page, /family=Newsreader|Newsreader/);
  assert.match(page, /family=Figtree|Figtree/);
  assert.match(page, /family=Source\+Code\+Pro|Source Code Pro/);
  assert.match(
    page,
    /caducity|abiding|lapsed|thirty-cap|lease-ledger|watch-desk|persistent-seal|thirty-cap-gauge/i,
  );
  assert.match(page, /#142018|#3d5a45|#c9892b|#9b3d2e|#f2ebe0/i);
  assert.match(page, /\babiding\b/);
  assert.match(page, /\blapsed\b/);
  assert.match(page, /thirty-cap/);
  assert.match(page, /Score caducity or admit abiding/i);
  assert.match(page, /#392/);
  assert.match(page, /#94553/);
  assert.match(page, /Admit abiding/);
  assert.match(page, /Score caducity/);
  assert.match(page, /Walk thirty-cap/);
  assert.match(page, /caducity-score/);
  assert.match(page, /persistent|expires in 30m|Monitor expired after 30m/i);
  assert.match(page, /body\.abiding|body\.lapsed/);
  assert.doesNotMatch(page, /Fraunces|Sora|JetBrains|Bodoni|Karla/i);
  assert.match(page, /NOT Efface|NOT Apocope|NOT Orloj/i);
  assert.doesNotMatch(page, /fetch\s*\(\s*["'`]/);
  assert.match(page, /body\.embed/);
});

test("README states the thesis, anti-clone, and how to score", () => {
  const readme = readReadme();
  assert.match(readme, /Caducity/);
  assert.match(readme, /#94553/);
  assert.match(readme, /\babiding\b/);
  assert.match(readme, /\blapsed\b/);
  assert.match(readme, /thirty-cap/);
  assert.match(readme, /Newsreader/);
  assert.match(readme, /Figtree/);
  assert.match(readme, /Source Code Pro/);
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /Research brief/i);
  assert.match(readme, /persistent|expires in 30m|2\.1\.272/i);
  assert.match(readme, /Efface|Apocope|Precis|Detent/);
  assert.match(readme, /#94560|#93924|#94151/);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/caducity/);
  assert.match(readme, /node --test projects\/caducity\/caducity\.test\.mjs/);
  assert.match(readme, /NON-BINDING/);
  assert.match(readme, /Score caducity or admit abiding/);
  assert.match(readme, /21:10/);
  assert.match(readme, /Do NOT implement a fix/i);
  const runLog = readFileSync(
    fileURLToPath(new URL("../../RUN_LOG.md", import.meta.url)),
    "utf8",
  );
  assert.match(runLog, /## 2026-09-18 — Caducity/);
  assert.match(runLog, /21:10/);
});

test("catalog features Caducity only; Apocope unfeatured; product count 391", () => {
  const catalog = readCatalog();
  const hub = readHubCatalog();
  assert.equal(catalog.products.length, 391);
  assert.equal(hub.products.length, 391);
  assert.equal(catalog.products[0].name, "Caducity");
  assert.equal(catalog.products[0].slug, "caducity");
  assert.equal(catalog.products[0].featured, true);
  assert.equal(catalog.products[0].href, "/caducity/");
  assert.equal(catalog.products[0].day, "2026-09-18");
  assert.equal(catalog.products[0].summary, CATALOG_SUMMARY);
  assert.equal(hub.products[0].summary, catalog.products[0].summary);
  assert.match(catalog.products[0].summary, /\babiding\b/);
  assert.match(catalog.products[0].summary, /\blapsed\b/);
  assert.match(catalog.products[0].summary, /thirty-cap/);
  assert.match(catalog.products[0].summary, /Score caducity or admit abiding/);
  assert.match(catalog.products[0].summary, /#94553/);
  assert.match(catalog.products[0].summary, /21:10/);
  assert.equal(hub.products[0].slug, "caducity");
  assert.equal(hub.products[0].featured, true);
  const apocope = catalog.products.find((row) => row.slug === "apocope");
  assert.ok(apocope);
  assert.equal(apocope.featured, false);
  assert.equal(catalog.products.filter((row) => row.featured).length, 1);
  assert.equal(
    catalog.products.filter((row) => row.slug === "caducity" && row.featured).length,
    1,
  );
  assert.ok(
    !catalog.products.some(
      (row) => String(row.summary || "").includes("94553") && row.slug !== "caducity",
    ),
  );
});

test("vercel rewrites caducity to the project folder at the top", () => {
  const vercel = readVercel();
  assert.equal(vercel.rewrites[0].source, "/caducity");
  assert.equal(vercel.rewrites[0].destination, "/projects/caducity");
  assert.equal(vercel.rewrites[1].source, "/caducity/");
  assert.equal(vercel.rewrites[1].destination, "/projects/caducity");
  assert.equal(vercel.rewrites[2].source, "/caducity/:path*");
  assert.equal(vercel.rewrites[2].destination, "/projects/caducity/:path*");
  const apocope = vercel.rewrites.find((row) => row.source === "/apocope");
  assert.ok(apocope);
  assert.equal(apocope.destination, "/projects/apocope");
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
