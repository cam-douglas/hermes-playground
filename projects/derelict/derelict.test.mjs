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
  COUSINS,
  DERELICT_WALK,
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
  IDLE_WORD,
  ISSUE_URL,
  LABELS,
  NOT_PRODUCTS,
  PATH_WORD,
  PHRASE,
  PLATFORM,
  POSITIVE_CONTROL_WALK,
  PRODUCT_WORD,
  RULED_OUT,
  SAMPLE_DERELICT_PROOF,
  SEEDED_WORD,
  STATE,
  SURFACE,
  TITLE,
  VERDICTS,
  analyze,
  classify,
  decide,
  emptyTicket,
  fingerprint,
  handle,
  inspectCargo,
  inspectHull,
  inspectPpid,
  inspectTeardown,
  mapPier,
  readBooth,
  score,
  scoreGate,
  scoreWalk,
  seedPpidOne,
  seedDerelict,
  seedBerthed,
  seedHold,
  seedSessionKillOrphan,
  seedProduct,
  seedTscOrphan,
} from "./derelict.mjs";

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
  return fileURLToPath(new URL("./derelict.mjs", import.meta.url));
}

test("idle berthed is a hold; process-group shepherded", () => {
  const result = analyze(seedBerthed());
  assert.equal(result.verdict, "berthed");
  assert.equal(result.idleWord, "berthed");
  assert.equal(IDLE_WORD, "berthed");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.berthed, true);
  assert.equal(result.phrase, "admit berthed");
  assert.equal(result.derelict, false);
  assert.equal(result.sessionKillOrphan, false);
  assert.ok(HOLD_ALIASES.includes("berthed"));
  assert.ok(HOLD_ALIASES.includes("moored"));
  assert.ok(HOLD_ALIASES.includes("reaped"));
  assert.ok(HOLD_ALIASES.includes("shepherded"));
  assert.ok(HOLD_ALIASES.includes("process-group"));
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(result.idleWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("empty ticket and empty stdin classify berthed", () => {
  assert.equal(classify(emptyTicket()), "berthed");
  assert.equal(classify(""), "berthed");
  assert.equal(classify(null), "berthed");
  assert.equal(decide({}), "berthed");
});

test("#93996 seeded path scores derelict when session teardown leaves a PID-1 hulk", () => {
  const result = analyze(seedDerelict());
  assert.equal(result.verdict, "derelict");
  assert.equal(result.seededWord, "derelict");
  assert.equal(SEEDED_WORD, "derelict");
  assert.equal(PRODUCT_WORD, "derelict");
  assert.equal(result.hold, false);
  assert.equal(result.alarm, true);
  assert.equal(result.derelict, true);
  assert.equal(result.phrase, "score derelict");
  assert.equal(result.sessionKillOrphan, true);
  assert.equal(result.ppidOne, true);
  for (const word of FORBIDDEN_SEED) {
    assert.notEqual(result.seededWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("inspectors mark adrift hull and ppid-one", () => {
  const hull = inspectHull({ derelict: true, sessionKillOrphan: true });
  assert.equal(hull.stamp, "hull-adrift");
  assert.equal(hull.adrift, true);
  const ppid = inspectPpid({ derelict: true, ppidOne: true });
  assert.equal(ppid.stamp, "ppid-one");
  assert.equal(ppid.orphan, true);
  const cargo = inspectCargo({ derelict: true, tscOrphan: true });
  assert.equal(cargo.stamp, "cargo-smoking");
  const scored = scoreGate({
    derelict: true,
    sessionKillOrphan: true,
    ppidOne: true,
    tscOrphan: true,
    cue: "derelict",
  });
  assert.equal(scored.verdict, "derelict");
  const open = inspectHull({ berthed: true, derelict: false });
  assert.equal(open.stamp, "hull-berthed");
});

test("path word is session-kill-orphan; booth seed holds the path", () => {
  assert.equal(PATH_WORD, "session-kill-orphan");
  const result = analyze(seedSessionKillOrphan());
  assert.equal(result.verdict, "session-kill-orphan");
  assert.equal(result.pathWord, "session-kill-orphan");
  assert.equal(result.hold, false);
  assert.equal(
    classify({ seed: "session-kill-orphan", preferSeed: true, derelict: true }),
    "session-kill-orphan",
  );
  assert.equal(classify(seedPpidOne()), "ppid-one");
});

test("HOLD includes berthed / hold", () => {
  assert.ok(HOLD.includes("berthed"));
  assert.ok(HOLD.includes("hold"));
  const hold = analyze(seedHold());
  assert.equal(hold.verdict, "hold");
  assert.equal(hold.hold, true);
  assert.equal(classify({ seed: "hold", preferSeed: true }), "hold");
});

test("alarm chips: ppid-one, tsc-orphan, derelict", () => {
  assert.equal(classify(seedPpidOne()), "ppid-one");
  assert.equal(classify(seedTscOrphan()), "tsc-orphan");
  assert.equal(classify(seedProduct()), "derelict");
});

test("booth fixtures flip berthed vs derelict vs session-kill-orphan", () => {
  const idle = scoreGate(seedBerthed());
  const seeded = scoreGate(seedDerelict());
  const berthed = readData("berthed.json");
  const derelict = readData("derelict.json");
  const path = readData("session-kill-orphan.json");
  const holdFix = readData("hold.json");
  assert.equal(idle.verdict, "berthed");
  assert.equal(seeded.verdict, "derelict");
  assert.notEqual(idle.verdict, seeded.verdict);
  assert.equal(score(seedBerthed()), "berthed");
  assert.equal(score(seedDerelict()), "derelict");
  assert.equal(berthed.sessionKillOrphan, false);
  assert.equal(berthed.berthed, true);
  assert.equal(scoreGate(berthed).verdict, "berthed");
  assert.equal(derelict.sessionKillOrphan, true);
  assert.equal(derelict.ppidOne, true);
  assert.equal(derelict.tscOrphan, true);
  assert.equal(classify(derelict), "derelict");
  assert.equal(path.paths.length, 3);
  assert.match(path.paths[0].rule, /berthed|moored|reaped|shepherded|process-group/i);
  assert.match(path.paths[1].result, /PID 1|tsc|vitest|5h32m|isRunning|process-group/i);
  assert.equal(classify(path), "session-kill-orphan");
  assert.equal(derelict.hubCount, "DERELICT");
  assert.equal(derelict.issue, 93996);
  assert.equal(derelict.derelict, true);
  assert.equal(classify(holdFix), "hold");
  assert.equal(classify(readData("moored.json")), "moored");
  assert.equal(classify(readData("reaped.json")), "reaped");
  assert.equal(classify(readData("shepherded.json")), "shepherded");
  assert.equal(classify(readData("process-group.json")), "process-group");
  assert.equal(classify(readData("ppid-one.json")), "ppid-one");
  assert.equal(classify(readData("tsc-orphan.json")), "tsc-orphan");
  assert.equal(classify(readData("vitest-orphan.json")), "vitest-orphan");
  assert.equal(classify(readData("swap-hot.json")), "swap-hot");
  assert.equal(classify(readData("is-running-false.json")), "is-running-false");
  assert.equal(classify(readData("teardown-signal.json")), "teardown-signal");
  assert.equal(classify(readData("landing.json")), "landing");
  assert.equal(classify(readData("cousins.json")), "cousins");
  assert.equal(classify(readData("backups.json")), "backups");
  assert.equal(classify(readData("walk.json")), "walk");
  assert.equal(classify(readData("has-repro.json")), "has-repro");
  assert.equal(classify(readData("fixtures.json")), "fixtures");
});

test("chips include idle, seeded, path, and walk", () => {
  assert.ok(CHIPS.includes("berthed"));
  assert.ok(CHIPS.includes("derelict"));
  assert.ok(CHIPS.includes("session-kill-orphan"));
  assert.ok(CHIPS.includes("ppid-one"));
  assert.ok(CHIPS.includes("tsc-orphan"));
  assert.ok(CHIPS.includes("moored"));
  assert.ok(CHIPS.includes("shepherded"));
  assert.ok(CHIPS.includes("fixtures"));
  assert.ok(CHIPS.includes("walk"));
  assert.ok(ALARM.includes("derelict"));
  assert.ok(ALARM.includes("session-kill-orphan"));
  assert.ok(ALARM.includes("ppid-one"));
  assert.ok(ALARM.includes("tsc-orphan"));
  assert.ok(ALARM.includes("vitest-orphan"));
  assert.ok(ALARM.includes("swap-hot"));
  assert.ok(ALARM.includes("is-running-false"));
  assert.ok(ALARM.includes("teardown-signal"));
  assert.ok(VERDICTS.includes("walk"));
  assert.equal(classify({ seed: "fixtures", preferSeed: true }), "fixtures");
  assert.equal(classify({ seed: "walk", preferSeed: true }), "walk");
});

test("published derelict walk scores derelict after the idle hold", () => {
  const booth = scoreWalk({ rows: DERELICT_WALK });
  assert.equal(booth.verdict, "derelict");
  assert.ok(booth.derelictCount >= 1);
  const idle = booth.rows.find((row) => row.event === "cue-berthed");
  assert.equal(idle.berthed, true);
  assert.equal(idle.verdict, "berthed");
  const cut = booth.rows.find((row) => row.event === "session-kill-orphan");
  assert.equal(cut.sessionKillOrphan, true);
  const path = booth.rows.find((row) => row.event === "session-kill-orphan" && row.t === "path");
  assert.equal(path.verdict, "session-kill-orphan");
});

test("DERELICT_WALK constant matches the issue salvage walk", () => {
  assert.equal(DERELICT_WALK[0].event, "cue-berthed");
  const cut = DERELICT_WALK.find((row) => row.event === "session-kill-orphan");
  assert.equal(cut.sessionKillOrphan || cut.ppidOne, true);
  const path = DERELICT_WALK.find((row) => row.t === "path");
  assert.equal(path.derelict, true);
  const scoreRow = DERELICT_WALK.find((row) => row.event === "derelict");
  assert.equal(scoreRow.derelict, true);
});

test("positive control berthed pier stays berthed", () => {
  const walk = scoreWalk({ rows: POSITIVE_CONTROL_WALK });
  assert.equal(walk.verdict, "berthed");
  const ok = walk.rows.find((row) => row.t === "hold");
  assert.equal(ok.verdict, "berthed");
  const hold = walk.rows.find((row) => row.event === "cue-berthed");
  assert.equal(hold.berthed, true);
  assert.equal(hold.verdict, "berthed");
});

test("issue constants encode only #93996 published facts", () => {
  assert.equal(FEATURED_ISSUE, 93996);
  assert.ok(ISSUE_URL.includes("93996"));
  assert.match(TITLE, /Orphaned Bash-tool|tsc|vitest|unsupervised|terminated session/i);
  assert.equal(STATE, "OPEN");
  assert.equal(PLATFORM, "macos");
  assert.match(HOST, /Bash tool/);
  assert.equal(BUILD, "unspecified");
  assert.equal(SURFACE, "session-kill-orphan");
  assert.deepEqual([...LABELS], ["bug", "has-repro", "platform:macos", "area:bash"]);
  assert.equal(FIELD_MARKS.length, 5);
  assert.ok(RULED_OUT.some((row) => /Gleaner|#93794/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /Foundling|#93889/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /Vestry|#94008/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /Surfeit|#94012/i.test(row)));
  assert.ok(EXPECTED.some((row) => /process.group|session|tsc|vitest|PID 1|teardown/i.test(row)));
  assert.match(DISTRIBUTION, /5h32m|472|PPID|isRunning|tsc|vitest|23\.2|24\.5/i);
  assert.equal(BOOTH_STATIONS.length, 5);
  assert.ok(FINGERPRINT_LINES.includes("session-kill-orphan"));
  assert.ok(FINGERPRINT_LINES.includes("derelict"));
  assert.equal(PHRASE, "Score derelict or admit berthed.");
  assert.equal(SAMPLE_DERELICT_PROOF.sessionKillOrphan, true);
});

test("has-repro fingerprints encode the published derelict proof", () => {
  const result = handle(seedDerelict());
  assert.equal(result.published.platform, "macos");
  assert.equal(result.published.surface, "session-kill-orphan");
  assert.equal(result.published.host, HOST);
  assert.match(
    fingerprint(seedDerelict()),
    /derelict\|kind=session-kill-orphan\|tsc=5h32m\|path=session-kill-orphan\|cue=session-kill-orphan/,
  );
  assert.equal(classify({ seed: "has-repro", preferSeed: true }), "has-repro");
});

test("forbidden idle list includes pegged/tempered/quiescent/gleaned and recent catalog words", () => {
  const required = [
    "pegged",
    "vestry",
    "mount-refcount-race",
    "tempered",
    "surfeit",
    "quota-spawn-cascade",
    "quiescent",
    "phosphene",
    "layer-tree-walk",
    "diplomatic",
    "parablepsis",
    "latin1-edit-wipe",
    "demesned",
    "demesne",
    "home-bind-overreach",
    "diagrammed",
    "cartouche",
    "section-poster",
    "unattainted",
    "attaint",
    "session-attainder",
    "reflowed",
    "oriel",
    "plan-no-reflow",
    "articulate",
    "anarthria",
    "dictation-paste-drop",
    "limber",
    "trismus",
    "notif-xpc-deadlock",
    "filiated",
    "foundling",
    "subagent-bash-outlive",
    "injective",
    "crased",
    "crasis",
    "unitary",
    "tessellated",
    "verbatim",
    "mojibaked",
    "afterimage",
    "scotoma",
    "followspot",
    "thrash",
    "solvent",
    "frugal",
    "circuit-held",
    "no-spawn",
    "vested",
    "plenary",
    "gleaned",
    "gleaner",
    "unreaped-ampersand",
    "swept",
    "live",
  ];
  for (const word of required) {
    assert.ok(FORBIDDEN_IDLE.includes(word), `missing forbidden idle ${word}`);
  }
});

test("berthed booth flips derelict back when the pier is berthed", () => {
  const tape = {
    berthed: true,
    derelict: false,
    sessionKillOrphan: false,
    cue: "berthed",
  };
  assert.equal(scoreGate(tape).verdict, "berthed");
  tape.berthed = false;
  tape.derelict = true;
  tape.sessionKillOrphan = true;
  tape.ppidOne = true;
  tape.cue = "derelict";
  assert.equal(scoreGate(tape).verdict, "derelict");
  tape.berthed = true;
  tape.derelict = false;
  tape.sessionKillOrphan = false;
  tape.ppidOne = false;
  tape.cue = "berthed";
  assert.equal(scoreGate(tape).verdict, "berthed");
});

test("hull, ppid, cargo, and readBooth mark the derelict proof", () => {
  const idle = inspectHull({
    berthed: true,
  });
  assert.equal(idle.stamp, "hull-berthed");
  const ppid = inspectPpid({ derelict: true, ppidOne: true });
  assert.equal(ppid.stamp, "ppid-one");
  assert.equal(ppid.orphan, true);
  const teardown = inspectTeardown({ derelict: true, teardownSignal: true });
  assert.equal(teardown.stamp, "teardown-signal");
  const booth = readBooth({
    derelict: true,
    sessionKillOrphan: true,
    ppidOne: true,
  });
  assert.equal(booth.derelict, true);
  assert.equal(booth.mark, "derelict");
  const open = readBooth({
    berthed: true,
    derelict: false,
    sessionKillOrphan: false,
  });
  assert.equal(open.derelict, false);
  assert.equal(open.mark, "berthed");
});

test("mapPier encodes the published adrift hull", () => {
  const miss = mapPier({ derelict: true, sessionKillOrphan: true });
  assert.equal(miss.stamp, "session-kill-orphan");
  assert.equal(miss.holdingLane, "adrift");
  assert.equal(miss.ribbon, "derelict");
  const clear = mapPier({ berthed: true, derelict: false });
  assert.equal(clear.stamp, "berthed-pier");
  assert.equal(clear.kindLane, "moored");
  assert.equal(clear.holdingLane, "shepherded");
});

test("cousins cite #93794 #93889 only; products stay distinct; backups stay data-only", () => {
  assert.equal(COUSINS.length, 2);
  assert.equal(COUSINS[0].issue, 93794);
  assert.equal(COUSINS[1].issue, 93889);
  assert.ok(COUSINS.every((row) => row.citeOnly === true));
  assert.ok(NOT_PRODUCTS.includes("vestry"));
  assert.ok(NOT_PRODUCTS.includes("surfeit"));
  assert.ok(NOT_PRODUCTS.includes("phosphene"));
  assert.ok(NOT_PRODUCTS.includes("parablepsis"));
  assert.ok(NOT_PRODUCTS.includes("demesne"));
  assert.ok(NOT_PRODUCTS.includes("cartouche"));
  assert.ok(NOT_PRODUCTS.includes("attaint"));
  assert.ok(NOT_PRODUCTS.includes("oriel"));
  assert.ok(NOT_PRODUCTS.includes("anarthria"));
  assert.ok(NOT_PRODUCTS.includes("trismus"));
  assert.ok(NOT_PRODUCTS.includes("foundling"));
  assert.ok(NOT_PRODUCTS.includes("gleaner"));
  assert.ok(NOT_PRODUCTS.includes("crasis"));
  assert.ok(NOT_PRODUCTS.includes("tessera"));
  assert.ok(NOT_PRODUCTS.includes("mojibake"));
  assert.ok(NOT_PRODUCTS.includes("afterimage"));
  assert.ok(NOT_PRODUCTS.includes("scotoma"));
  assert.ok(NOT_PRODUCTS.includes("thrash"));
  assert.ok(NOT_PRODUCTS.includes("ashpan"));
  assert.equal(BACKUPS.length, 7);
  assert.equal(BACKUPS[0].issue, 93987);
  assert.equal(BACKUPS[6].issue, 93777);
  assert.ok(BACKUPS.every((row) => row.citeOnly === true));
  assert.ok(!BACKUPS.some((row) => row.issue === 93996));
  assert.ok(!BACKUPS.some((row) => row.issue === 93794));
  assert.equal(classify({ seed: "cousins", preferSeed: true }), "cousins");
  assert.equal(classify({ seed: "backups", preferSeed: true }), "backups");
});

test("CLI scores fixtures without a server", () => {
  const idle = spawnSync(process.execPath, [modelPath()], { encoding: "utf8" });
  const seeded = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/derelict.json", import.meta.url))],
    { encoding: "utf8" },
  );
  const berthedFix = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/berthed.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(idle.status, 0, idle.stderr);
  assert.equal(seeded.status, 0, seeded.stderr);
  assert.equal(berthedFix.status, 0, berthedFix.stderr);
  const idleOut = JSON.parse(idle.stdout);
  const seededOut = JSON.parse(seeded.stdout);
  const berthedOut = JSON.parse(berthedFix.stdout);
  assert.equal(idleOut.verdict, "berthed");
  assert.equal(idleOut.hold, true);
  assert.equal(seededOut.verdict, "derelict");
  assert.equal(seededOut.alarm, true);
  assert.equal(berthedOut.verdict, "berthed");
  assert.equal(berthedOut.hold, true);
  assert.match(berthedOut.phrase, /admit berthed/);
});

test("handle exposes published hypothesis and #93996 headline", () => {
  const result = handle(seedDerelict());
  assert.equal(result.published.issue, 93996);
  assert.equal(result.published.platform, "macos");
  assert.deepEqual(result.published.cousins, [93794, 93889]);
  assert.ok(result.published.backups.includes(93987));
  assert.ok(result.published.backups.includes(93777));
  assert.ok(!result.published.backups.includes(93996));
  assert.match(result.published.hypothesis, /session teardown|process-group|PID 1|NON-BINDING|#93996/i);
  assert.match(result.published.hypothesis, /NON-BINDING/);
  assert.match(result.published.hypothesis, /#93996/);
  assert.equal(result.published.build, BUILD);
  assert.equal(inspectTeardown({ derelict: true, teardownSignal: true }).missed, true);
});

test("model has no static node: imports so the living page can score in-browser", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /^import .* from "node:/m);
  assert.match(source, /import\("node:fs"\)/);
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
});

test("living page is a maritime abandoned-hulk booth, not sacristy or gleaner field or foundling ward", () => {
  const page = readPage();
  assert.match(page, /family=Spectral|Spectral/);
  assert.match(page, /family=Nunito\+Sans|Nunito Sans/);
  assert.match(page, /Fira\+Code|Fira Code/);
  assert.match(page, /derelict|berthed|session-kill-orphan|hulk|pier|lantern|bilge|salvage/i);
  assert.match(page, /#8B3A2A|#C5D0D4|#1A2428|#D4A017|#2A6F6A|#F3F1EA|#4A4E52|#121618/i);
  assert.match(page, /\bberthed\b/);
  assert.match(page, /\bderelict\b/);
  assert.match(page, /session-kill-orphan/);
  assert.match(page, /Score derelict or admit berthed/i);
  assert.match(page, /#344/);
  assert.match(page, /#93996/);
  assert.match(page, /Admit berthed/);
  assert.match(page, /Score derelict/);
  assert.match(page, /Walk session-kill-orphan/);
  assert.match(page, /Compare berthed \/ derelict/);
  assert.match(page, /Pin idle berthed/);
  assert.match(page, /Pin seeded derelict/);
  assert.match(page, /Pin session-kill-orphan/);
  assert.match(page, /Berth the hulk/);
  assert.match(page, /Score booth/);
  assert.match(page, /derelict-score/);
  assert.match(page, /5h32m|472|PPID|tsc|vitest|isRunning|23\.2|24\.5/i);
  assert.match(page, /hulk|pier|lantern|bilge|mast|hatch|salvage|fog|tide/i);
  assert.doesNotMatch(page, /Cormorant Upright|Cormorant\+Upright/);
  assert.doesNotMatch(page, /family=Karla|Karla/);
  assert.doesNotMatch(page, /IBM Plex Mono|IBM\+Plex\+Mono/);
  assert.doesNotMatch(page, /Fraunces|family=Fraunces/);
  assert.doesNotMatch(page, /Manrope|family=Manrope/);
  assert.doesNotMatch(page, /DM Mono|DM\+Mono/);
  assert.doesNotMatch(page, /Syne|family=Syne/);
  assert.doesNotMatch(page, /Sora|family=Sora/);
  assert.doesNotMatch(page, /JetBrains Mono|JetBrains\+Mono/);
  assert.doesNotMatch(page, /family=Cormorant\+Garamond|Cormorant Garamond/);
  assert.doesNotMatch(page, /family=UnifrakturMaguntia|UnifrakturMaguntia/);
  assert.doesNotMatch(page, /Epilogue/);
  assert.doesNotMatch(page, /Inconsolata/);
  assert.doesNotMatch(page, /family=Cinzel/);
  assert.doesNotMatch(page, /Outfit/);
  assert.doesNotMatch(page, /Figtree/);
  assert.doesNotMatch(page, /Libre Baskerville|Libre\+Baskerville/);
  assert.doesNotMatch(page, /Instrument Serif|Instrument\+Serif/);
  assert.doesNotMatch(page, /Plus Jakarta|Plus\+Jakarta/);
  assert.doesNotMatch(page, /Yrsa|family=Yrsa/);
  assert.doesNotMatch(page, /Mulish|family=Mulish/);
  assert.doesNotMatch(page, /#C8C2B4/);
  assert.doesNotMatch(page, /#2C3A6E/);
  assert.doesNotMatch(page, /#F4F0E6/);
  assert.doesNotMatch(page, /#B08D57/);
  assert.doesNotMatch(page, /#6E2432/);
  assert.doesNotMatch(page, /#3B0F1A/);
  assert.doesNotMatch(page, /#E6B84D/);
  assert.doesNotMatch(page, /#8B7CFF/);
  assert.doesNotMatch(page, /#E8FF6A/);
  assert.doesNotMatch(page, /sacristy|peg-rail|stole|acolyte|vestment|robe-rail/i);
  assert.doesNotMatch(page, /gleaner's field|wheat stubble|sickle basket/i);
  assert.doesNotMatch(page, /foundling-hospital|parish-ward|foundling-wheel|rose ribbon/i);
  assert.doesNotMatch(page, /manor charter|oak post|heraldic green|demesned/i);
  assert.doesNotMatch(page, /false door|hieroglyph|name-oval|lapis|limestone/i);
  assert.doesNotMatch(page, /court roll|wax seal|corruption of blood|attainder/i);
  assert.doesNotMatch(page, /collation-desk|apparatus criticus|oxblood lemma/i);
  assert.doesNotMatch(page, /entoptic|vitreous|isopter|sclera/i);
  assert.doesNotMatch(page, /banquet cellar|empty cask|quota-spawn/i);
  assert.doesNotMatch(page, /\bdiplomatic\b/);
  assert.doesNotMatch(page, /\bdemesned\b/);
  assert.doesNotMatch(page, /\bdemesne\b/);
  assert.doesNotMatch(page, /\bquiescent\b/);
  assert.doesNotMatch(page, /\bphosphene\b/);
  assert.doesNotMatch(page, /\btempered\b/);
  assert.doesNotMatch(page, /\bsurfeit\b/);
  assert.doesNotMatch(page, /\bvestry\b/);
  assert.doesNotMatch(page, /\bpegged\b/);
  assert.doesNotMatch(page, /\bgleaner\b/);
  assert.doesNotMatch(page, /\bfounding\b/);
  assert.doesNotMatch(page, /home-bind-overreach/);
  assert.doesNotMatch(page, /latin1-edit-wipe/);
  assert.doesNotMatch(page, /layer-tree-walk/);
  assert.doesNotMatch(page, /quota-spawn-cascade/);
  assert.doesNotMatch(page, /mount-refcount-race/);
  assert.doesNotMatch(page, /\bparablepsis\b/);
  assert.match(page, /NOT Gleaner/i);
  assert.match(page, /NOT Foundling/i);
  assert.match(page, /NOT Vestry/i);
  assert.match(page, /NOT Surfeit/i);
  assert.match(page, /NOT Phosphene/i);
  assert.match(page, /NOT Demesne/i);
  assert.match(page, /NOT Ashpan/i);
});

test("README states the thesis, anti-clone, and how to score", () => {
  const readme = readReadme();
  assert.match(readme, /Derelict/);
  assert.match(readme, /#93996/);
  assert.match(readme, /\bberthed\b/);
  assert.match(readme, /\bderelict\b/);
  assert.match(readme, /session-kill-orphan/);
  assert.match(readme, /Spectral/);
  assert.match(readme, /Nunito Sans/);
  assert.match(readme, /Fira Code/);
  assert.doesNotMatch(readme, /Cormorant Upright/);
  assert.doesNotMatch(readme, /IBM Plex Mono/);
  assert.doesNotMatch(readme, /Fraunces/);
  assert.doesNotMatch(readme, /Manrope/);
  assert.doesNotMatch(readme, /DM Mono/);
  assert.doesNotMatch(readme, /Syne/);
  assert.doesNotMatch(readme, /Sora/);
  assert.doesNotMatch(readme, /JetBrains Mono/);
  assert.doesNotMatch(readme, /Cormorant Garamond/);
  assert.doesNotMatch(readme, /UnifrakturMaguntia/);
  assert.doesNotMatch(readme, /Figtree/);
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /Research brief/i);
  assert.match(readme, /SESSION TEARDOWN DOES NOT KILL|SESSION-KILL-ORPHAN/i);
  assert.match(readme, /NOT Gleaner\/#93794/);
  assert.match(readme, /NOT Foundling\/#93889/);
  assert.match(readme, /NOT Vestry\/#94008/);
  assert.match(readme, /NOT Surfeit\/#94012/);
  assert.match(readme, /NOT Phosphene\/#94003/);
  assert.match(readme, /NOT Demesne\/#93989/);
  assert.match(readme, /NOT Ashpan\/#93780/);
  assert.match(readme, /#93794|#93889/);
  assert.match(readme, /5h32m|472|PPID|tsc|vitest|isRunning/i);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/derelict/);
  assert.match(readme, /node --test projects\/derelict\/derelict\.test\.mjs/);
  assert.match(readme, /NON-BINDING/);
  assert.match(readme, /hulk|pier|salvage|derelict/i);
  assert.match(readme, /Score derelict or admit berthed/);
  assert.match(readme, /#93987|#93924|#93925|#93967|#93957|#93770|#93777/);
  assert.match(readme, /03:50/);
  assert.match(readme, /Do NOT implement a fix/i);
  const runLog = readFileSync(fileURLToPath(new URL("../../RUN_LOG.md", import.meta.url)), "utf8");
  assert.match(runLog, /## 2026-09-13 — Derelict/);
  assert.match(runLog, /03:50/);
});

test("catalog features Derelict only; Vestry unfeatured; product count 344", () => {
  const catalog = readCatalog();
  const hub = readHubCatalog();
  assert.equal(catalog.products.length, 344);
  assert.equal(hub.products.length, 344);
  assert.equal(catalog.products[0].name, "Derelict");
  assert.equal(catalog.products[0].slug, "derelict");
  assert.equal(catalog.products[0].featured, true);
  assert.equal(catalog.products[0].href, "/derelict/");
  assert.equal(catalog.products[0].day, "2026-09-13");
  assert.equal(
    catalog.products[0].summary,
    "03:50 derelict: a maritime abandoned-hulk / derelict-ship / salvage booth for #93996. Bash-tool subprocesses (tsc/vitest) survive session stop/crash/clear, reparent to PID 1, run unsupervised for hours. Idle berthed / seeded derelict / path session-kill-orphan. Score derelict or admit berthed.",
  );
  assert.equal(hub.products[0].summary, catalog.products[0].summary);
  assert.match(catalog.products[0].summary, /\bberthed\b/);
  assert.match(catalog.products[0].summary, /\bderelict\b/);
  assert.match(catalog.products[0].summary, /session-kill-orphan/);
  assert.match(catalog.products[0].summary, /Score derelict or admit berthed/);
  assert.equal(hub.products[0].slug, "derelict");
  assert.equal(hub.products[0].featured, true);
  const vestry = catalog.products.find((row) => row.slug === "vestry");
  assert.ok(vestry);
  assert.equal(vestry.featured, false);
  const surfeit = catalog.products.find((row) => row.slug === "surfeit");
  assert.ok(surfeit);
  assert.equal(surfeit.featured, false);
  const phosphene = catalog.products.find((row) => row.slug === "phosphene");
  assert.ok(phosphene);
  assert.equal(phosphene.featured, false);
  const gleaner = catalog.products.find((row) => row.slug === "gleaner");
  assert.ok(gleaner);
  assert.equal(gleaner.featured, false);
  const foundling = catalog.products.find((row) => row.slug === "foundling");
  assert.ok(foundling);
  assert.equal(foundling.featured, false);
  assert.equal(catalog.products.filter((row) => row.featured).length, 1);
  assert.equal(catalog.products.filter((row) => row.slug === "derelict").length, 1);
  assert.ok(!catalog.products.some((row) => String(row.summary || "").includes("93996") && row.slug !== "derelict"));
});

test("vercel rewrites derelict to the project folder at the top", () => {
  const vercel = readVercel();
  assert.equal(vercel.rewrites[0].source, "/derelict");
  assert.equal(vercel.rewrites[0].destination, "/projects/derelict");
  assert.equal(vercel.rewrites[1].source, "/derelict/");
  assert.equal(vercel.rewrites[1].destination, "/projects/derelict");
  assert.equal(vercel.rewrites[2].source, "/derelict/:path*");
  assert.equal(vercel.rewrites[2].destination, "/projects/derelict/:path*");
});

test("no network calls in the model or tests", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
  assert.doesNotMatch(source, /https?:\/\/[^\s"']*anthropic\.com\/v1/);
});
