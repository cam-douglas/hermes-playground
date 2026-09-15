import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ALARM,
  BACKUPS,
  BATCH_CONTROL,
  BELT_NAMES,
  BOOTH_STATIONS,
  BUILD,
  CHIPS,
  COUSINS,
  DESKTOP_BUILD,
  DICTABELT_WALK,
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
  INPUT_LEVEL,
  ISSUE_URL,
  LABELS,
  LANGUAGES,
  LIMITS_ISSUE,
  MIC,
  MODES,
  NOT_PRODUCTS,
  PATH_WORD,
  PHRASE,
  PLATFORM,
  POSITIVE_CONTROL_WALK,
  PRODUCT_WORD,
  RULED_OUT,
  SAMPLE_DICTABELT_PROOF,
  SAMPLE_RATE,
  SEEDED_WORD,
  SILENCE_AUTOSTOP_S,
  STATE,
  SURFACE,
  SYNTHETIC_FRAGMENTS,
  SYNTHETIC_SPOKEN,
  TITLE,
  TWO_MINUTE_CAP_S,
  VERDICTS,
  analyze,
  classify,
  decide,
  emptyTicket,
  fingerprint,
  handle,
  inspectBilingual,
  inspectGapSpread,
  inspectHoldAndTap,
  inspectSilenceCap,
  inspectStreaming,
  inspectTwoMinuteCap,
  joinBelt,
  mapDictabelt,
  readBooth,
  score,
  scoreGate,
  scoreSegmentDrop,
  scoreWalk,
  seedDictabelt,
  seedFragment,
  seedHold,
  seedProduct,
  seedSegmentDrop,
  seedVerbatim,
} from "./dictabelt.mjs";

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
  return fileURLToPath(new URL("./dictabelt.mjs", import.meta.url));
}

const CATALOG_SUMMARY =
  "12:50 dictabelt: a dictabelt / wax-belt / stenotype / belt-dictation booth for #94406. Desktop voice dictation (v2.1.237, macOS) drops words throughout the recording — output is fragments not a transcript; same mic/sentence ChatGPT batch is essentially verbatim; en and de; hold and tap both fail; loss spread across whole take (not only hold warmup); 15s silence auto-stop and 2m max compound. Idle verbatim / seeded dictabelt / path segment-drop. Score dictabelt or admit verbatim.";

test("idle verbatim is a hold; continuous speech lands as one joined transcript", () => {
  const result = analyze(seedVerbatim());
  assert.equal(result.verdict, "verbatim");
  assert.equal(result.idleWord, "verbatim");
  assert.equal(IDLE_WORD, "verbatim");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.verbatim, true);
  assert.equal(result.phrase, "admit verbatim");
  assert.equal(result.dictabelt, false);
  assert.equal(result.segmentDrop, false);
  assert.ok(HOLD_ALIASES.includes("continuous"));
  assert.ok(HOLD_ALIASES.includes("joined"));
  assert.ok(HOLD_ALIASES.includes("seamless"));
  assert.ok(HOLD_ALIASES.includes("fluent"));
  assert.ok(HOLD_ALIASES.includes("batch-ok"));
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(result.idleWord, word);
    assert.notEqual(result.verdict, word);
  }
  assert.notEqual(IDLE_WORD, "quiet");
  assert.notEqual(IDLE_WORD, "intact");
  assert.notEqual(IDLE_WORD, "cleared");
  assert.notEqual(IDLE_WORD, "armed");
  assert.notEqual(IDLE_WORD, "affixed");
  assert.notEqual(IDLE_WORD, "unpacked");
  assert.notEqual(IDLE_WORD, "scoped");
  assert.notEqual(IDLE_WORD, "enrolled");
  assert.notEqual(IDLE_WORD, "equated");
  assert.notEqual(IDLE_WORD, "penned");
});

test("empty ticket and empty stdin classify verbatim", () => {
  assert.equal(classify(emptyTicket()), "verbatim");
  assert.equal(classify(""), "verbatim");
  assert.equal(classify(null), "verbatim");
  assert.equal(decide({}), "verbatim");
});

test("#94406 seeded path scores dictabelt when the belt comes off as fragments", () => {
  const result = analyze(seedDictabelt());
  assert.equal(result.verdict, "dictabelt");
  assert.equal(result.seededWord, "dictabelt");
  assert.equal(SEEDED_WORD, "dictabelt");
  assert.equal(PRODUCT_WORD, "dictabelt");
  assert.equal(result.hold, false);
  assert.equal(result.alarm, true);
  assert.equal(result.dictabelt, true);
  assert.equal(result.phrase, "score dictabelt");
  assert.equal(result.segmentDrop, true);
  assert.equal(result.fragment, true);
  for (const word of FORBIDDEN_SEED) {
    assert.notEqual(result.seededWord, word);
    assert.notEqual(result.verdict, word);
  }
  assert.notEqual(SEEDED_WORD, "lemure");
  assert.notEqual(SEEDED_WORD, "cancellans");
  assert.notEqual(SEEDED_WORD, "arras");
  assert.notEqual(SEEDED_WORD, "anarthria");
  assert.notEqual(PATH_WORD, "orphan-tick");
  assert.notEqual(PATH_WORD, "deferred-delta");
  assert.notEqual(PATH_WORD, "phantom-prompt");
  assert.notEqual(PATH_WORD, "chmod-failopen");
  assert.notEqual(PATH_WORD, "header-rename");
  assert.notEqual(PATH_WORD, "subst-nest");
  assert.notEqual(PATH_WORD, "root-find");
});

test("educational belt helper encodes published verbatim vs segment-drop paths", () => {
  assert.equal(SYNTHETIC_SPOKEN.includes("project folder"), true);
  assert.deepEqual([...SYNTHETIC_FRAGMENTS], [
    "Please open",
    "summarize",
    "commits",
  ]);
  assert.equal(DESKTOP_BUILD, "2.1.237");
  assert.equal(MIC, "built-in MacBook Pro microphone");
  assert.equal(SAMPLE_RATE, "48 kHz");
  assert.equal(INPUT_LEVEL, "~57%");
  assert.deepEqual([...LANGUAGES], ["en", "de"]);
  assert.deepEqual([...MODES], ["hold", "tap"]);
  assert.equal(SILENCE_AUTOSTOP_S, 15);
  assert.equal(TWO_MINUTE_CAP_S, 120);
  assert.equal(LIMITS_ISSUE, 74534);
  assert.match(BATCH_CONTROL, /ChatGPT|verbatim/i);
  const dropped = joinBelt({ verbatim: false });
  assert.equal(dropped.dropped, true);
  assert.ok(dropped.chunks.includes("Please open"));
  assert.equal(dropped.synthetic, true);
  const control = joinBelt({ verbatim: true });
  assert.equal(control.dropped, false);
  assert.equal(control.joined, SYNTHETIC_SPOKEN);
  const scored = scoreSegmentDrop({
    dictabelt: true,
    segmentDrop: true,
    fragment: true,
  });
  assert.equal(scored.dictabelt, true);
  assert.equal(scored.segmentDrop, true);
  const quietPath = scoreSegmentDrop({ verbatim: true });
  assert.equal(quietPath.dictabelt, false);
  assert.equal(quietPath.verbatim, true);
});

test("inspectors mark live stylus and gap-spread", () => {
  const stream = inspectStreaming({ dictabelt: true, fragment: true });
  assert.equal(stream.stamp, "live-stylus");
  assert.equal(stream.streaming, true);
  const gaps = inspectGapSpread({ dictabelt: true, gapSpread: true });
  assert.equal(gaps.stamp, "gap-spread");
  assert.equal(gaps.spread, true);
  const scored = scoreGate({
    dictabelt: true,
    segmentDrop: true,
    fragment: true,
    cue: "dictabelt",
  });
  assert.equal(scored.verdict, "dictabelt");
  const open = inspectStreaming({ verbatim: true, dictabelt: false });
  assert.equal(open.stamp, "batch-joined");
});

test("path word is segment-drop; booth seed holds the path", () => {
  assert.equal(PATH_WORD, "segment-drop");
  const result = analyze(seedSegmentDrop());
  assert.equal(result.verdict, "segment-drop");
  assert.equal(result.pathWord, "segment-drop");
  assert.equal(result.hold, false);
  assert.equal(
    classify({
      seed: "segment-drop",
      preferSeed: true,
      dictabelt: true,
    }),
    "segment-drop",
  );
  assert.equal(classify({ seed: "fragment", preferSeed: true }), "fragment");
  assert.equal(score(seedSegmentDrop()), "dictabelt");
});

test("HOLD includes verbatim / hold", () => {
  assert.ok(HOLD.includes("verbatim"));
  assert.ok(HOLD.includes("hold"));
  const hold = analyze(seedHold());
  assert.equal(hold.verdict, "hold");
  assert.equal(hold.hold, true);
  assert.equal(classify({ seed: "hold", preferSeed: true }), "hold");
});

test("alarm chips: fragment, segment-drop, dictabelt", () => {
  assert.equal(classify({ seed: "fragment", preferSeed: true }), "fragment");
  assert.equal(classify(seedSegmentDrop()), "segment-drop");
  assert.equal(classify(seedProduct()), "dictabelt");
  assert.equal(classify(seedFragment()), "fragment");
  assert.equal(classify({ seed: "gap-spread", preferSeed: true }), "gap-spread");
});

test("booth fixtures flip verbatim vs dictabelt vs segment-drop", () => {
  const idle = scoreGate(seedVerbatim());
  const seeded = scoreGate(seedDictabelt());
  const verbatim = readData("verbatim.json");
  const dictabelt = readData("dictabelt.json");
  const issued = readData("94406.json");
  const path = readData("segment-drop.json");
  const holdFix = readData("hold.json");
  assert.equal(idle.verdict, "verbatim");
  assert.equal(seeded.verdict, "dictabelt");
  assert.notEqual(idle.verdict, seeded.verdict);
  assert.equal(score(seedVerbatim()), "verbatim");
  assert.equal(score(seedDictabelt()), "dictabelt");
  assert.equal(score({ seed: "segment-drop", preferSeed: true }), "dictabelt");
  assert.equal(verbatim.segmentDrop, false);
  assert.equal(verbatim.verbatim, true);
  assert.equal(scoreGate(verbatim).verdict, "verbatim");
  assert.equal(dictabelt.segmentDrop, true);
  assert.equal(dictabelt.fragment, true);
  assert.equal(classify(dictabelt), "dictabelt");
  assert.equal(issued.issue, 94406);
  assert.equal(classify(issued), "dictabelt");
  assert.equal(path.paths.length, 3);
  assert.match(path.paths[0].rule, /verbatim|continuous|joined|seamless|fluent|batch-ok/i);
  assert.match(path.paths[1].result, /segment-drop|fragment|gap/i);
  assert.equal(classify(path), "segment-drop");
  assert.equal(dictabelt.hubCount, "DICTABELT");
  assert.equal(dictabelt.issue, 94406);
  assert.equal(dictabelt.dictabelt, true);
  assert.equal(classify(holdFix), "hold");
  assert.equal(classify(readData("continuous.json")), "continuous");
  assert.equal(classify(readData("joined.json")), "joined");
  assert.equal(classify(readData("seamless.json")), "seamless");
  assert.equal(classify(readData("fluent.json")), "fluent");
  assert.equal(classify(readData("batch-ok.json")), "batch-ok");
  assert.equal(classify(readData("fragment.json")), "fragment");
  assert.equal(classify(readData("gap-spread.json")), "gap-spread");
  assert.equal(classify(readData("hold-and-tap.json")), "hold-and-tap");
  assert.equal(classify(readData("bilingual.json")), "bilingual");
  assert.equal(classify(readData("silence-autostop.json")), "silence-autostop");
  assert.equal(classify(readData("two-minute-cap.json")), "two-minute-cap");
  assert.equal(classify(readData("landing.json")), "landing");
  assert.equal(classify(readData("cousins.json")), "cousins");
  assert.deepEqual(readData("cousins.json").issues, [93782, 94031, 94041, 94251, 93193]);
  assert.equal(classify(readData("backups.json")), "backups");
  assert.equal(classify(readData("walk.json")), "walk");
  assert.equal(classify(readData("has-repro.json")), "has-repro");
  assert.equal(classify(readData("fixtures.json")), "fixtures");
  assert.equal(classify(readData("closed.json")), "closed");
});

test("chips include idle, seeded, path, and walk", () => {
  assert.ok(CHIPS.includes("verbatim"));
  assert.ok(CHIPS.includes("dictabelt"));
  assert.ok(CHIPS.includes("segment-drop"));
  assert.ok(CHIPS.includes("fragment"));
  assert.ok(CHIPS.includes("gap-spread"));
  assert.ok(CHIPS.includes("batch-ok"));
  assert.ok(CHIPS.includes("fixtures"));
  assert.ok(CHIPS.includes("walk"));
  assert.ok(ALARM.includes("dictabelt"));
  assert.ok(ALARM.includes("segment-drop"));
  assert.ok(ALARM.includes("fragment"));
  assert.ok(ALARM.includes("gap-spread"));
  assert.ok(VERDICTS.includes("walk"));
  assert.equal(classify({ seed: "fixtures", preferSeed: true }), "fixtures");
  assert.equal(classify({ seed: "walk", preferSeed: true }), "walk");
});

test("published dictabelt walk scores dictabelt after the idle hold", () => {
  const booth = scoreWalk({ rows: DICTABELT_WALK });
  assert.equal(booth.verdict, "dictabelt");
  assert.ok(booth.dictabeltCount >= 1);
  const idle = booth.rows.find((row) => row.event === "batch-ok");
  assert.equal(idle.verbatim, true);
  assert.equal(idle.verdict, "verbatim");
  const cut = booth.rows.find((row) => row.event === "segment-drop");
  assert.equal(cut.segmentDrop, true);
  const path = booth.rows.find(
    (row) => row.event === "segment-drop" && row.t === "path",
  );
  assert.equal(path.verdict, "segment-drop");
});

test("DICTABELT_WALK constant matches the issue belt walk", () => {
  assert.equal(DICTABELT_WALK[0].event, "batch-ok");
  const cut = DICTABELT_WALK.find((row) => row.event === "segment-drop");
  assert.equal(cut.segmentDrop || cut.fragment, true);
  const path = DICTABELT_WALK.find((row) => row.t === "path");
  assert.equal(path.dictabelt, true);
  const scoreRow = DICTABELT_WALK.find((row) => row.event === "dictabelt");
  assert.equal(scoreRow.dictabelt, true);
  assert.equal(scoreRow.holdAndTap, true);
});

test("positive control batch-ok belt stays verbatim", () => {
  const walk = scoreWalk({ rows: POSITIVE_CONTROL_WALK });
  assert.equal(walk.verdict, "verbatim");
  const ok = walk.rows.find((row) => row.t === "hold");
  assert.equal(ok.verdict, "verbatim");
  const hold = walk.rows.find((row) => row.event === "batch-ok");
  assert.equal(hold.verbatim, true);
  assert.equal(hold.verdict, "verbatim");
});

test("issue constants encode only #94406 published facts", () => {
  assert.equal(FEATURED_ISSUE, 94406);
  assert.ok(ISSUE_URL.includes("94406"));
  assert.match(TITLE, /Voice dictation|fragments|v2\.1\.237/i);
  assert.equal(STATE, "OPEN");
  assert.match(PLATFORM, /macos/i);
  assert.match(HOST, /2\.1\.237|Darwin 25\.6\.0|48 kHz/i);
  assert.equal(BUILD, "Claude Code desktop app v2.1.237; macOS Darwin 25.6.0");
  assert.equal(SURFACE, "segment-drop");
  assert.deepEqual(
    [...LABELS],
    ["bug", "has repro", "platform:macos", "area:desktop"],
  );
  assert.equal(FIELD_MARKS.length, 6);
  assert.equal(BELT_NAMES.length, 6);
  assert.ok(RULED_OUT.some((row) => /Anarthria|#93782/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /Souffleur|#94031/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /Palilalia|#94041/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /Agraphia|#94251/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /Mondegreen|#93193/i.test(row)));
  assert.ok(EXPECTED.some((row) => /complete transcript|manual repair|batch/i.test(row)));
  assert.match(
    DISTRIBUTION,
    /fragments|ChatGPT|hold and tap|15s silence|2 minute/i,
  );
  assert.equal(BOOTH_STATIONS.length, 6);
  assert.ok(FINGERPRINT_LINES.includes("segment-drop"));
  assert.ok(FINGERPRINT_LINES.includes("dictabelt"));
  assert.equal(PHRASE, "Score dictabelt or admit verbatim.");
  assert.equal(SAMPLE_DICTABELT_PROOF.segmentDrop, true);
  assert.equal(SAMPLE_DICTABELT_PROOF.names.length, 6);
  assert.equal(SAMPLE_DICTABELT_PROOF.synthetic, true);
});

test("has-repro fingerprints encode the published dictabelt proof", () => {
  const result = handle(seedDictabelt());
  assert.equal(result.published.platform, "macos");
  assert.equal(result.published.surface, "segment-drop");
  assert.equal(result.published.host, HOST);
  assert.match(
    fingerprint(seedDictabelt()),
    /dictabelt\|kind=segment-drop\|ref=fragment\|path=segment-drop\|cue=segment-drop/,
  );
  assert.equal(classify({ seed: "has-repro", preferSeed: true }), "has-repro");
});

test("forbidden idle list includes prior catalog words", () => {
  const required = [
    "quiet",
    "intact",
    "cleared",
    "armed",
    "affixed",
    "unpacked",
    "scoped",
    "enrolled",
    "equated",
    "penned",
    "lemure",
    "cancellans",
    "arras",
    "frangible",
    "nameplate",
    "matryoshka",
    "dragnet",
    "anarthria",
    "souffleur",
    "palilalia",
    "agraphia",
    "mondegreen",
    "orphan-tick",
    "phantom-prompt",
    "chmod-failopen",
    "header-rename",
    "subst-nest",
    "root-find",
    "deferred-delta",
  ];
  for (const word of required) {
    assert.ok(FORBIDDEN_IDLE.includes(word), `missing forbidden idle ${word}`);
  }
});

test("verbatim booth flips dictabelt back when the belt admits verbatim", () => {
  const tape = {
    verbatim: true,
    dictabelt: false,
    segmentDrop: false,
    cue: "verbatim",
  };
  assert.equal(scoreGate(tape).verdict, "verbatim");
  tape.verbatim = false;
  tape.dictabelt = true;
  tape.segmentDrop = true;
  tape.cue = "dictabelt";
  assert.equal(scoreGate(tape).verdict, "dictabelt");
  tape.verbatim = true;
  tape.dictabelt = false;
  tape.segmentDrop = false;
  tape.cue = "verbatim";
  assert.equal(scoreGate(tape).verdict, "verbatim");
});

test("streaming, gaps, modes, and readBooth mark the dictabelt proof", () => {
  const stream = inspectStreaming({ dictabelt: true });
  assert.equal(stream.stamp, "live-stylus");
  const gaps = inspectGapSpread({ dictabelt: true, gapSpread: true });
  assert.equal(gaps.stamp, "gap-spread");
  assert.equal(gaps.spread, true);
  const booth = readBooth({
    dictabelt: true,
    segmentDrop: true,
    fragment: true,
  });
  assert.equal(booth.dictabelt, true);
  assert.equal(booth.mark, "dictabelt");
  const open = readBooth({
    verbatim: true,
    dictabelt: false,
    segmentDrop: false,
  });
  assert.equal(open.dictabelt, false);
  assert.equal(open.mark, "verbatim");
  assert.equal(inspectHoldAndTap({ dictabelt: true, holdAndTap: true }).stamp, "hold-and-tap");
  assert.equal(inspectBilingual({ dictabelt: true, bilingual: true }).stamp, "bilingual");
  assert.equal(inspectSilenceCap({ dictabelt: true, silenceAutostop: true }).stamp, "silence-autostop");
  assert.equal(inspectTwoMinuteCap({ dictabelt: true, twoMinuteCap: true }).stamp, "two-minute-cap");
});

test("mapDictabelt encodes the published segment-drop", () => {
  const miss = mapDictabelt({ dictabelt: true, segmentDrop: true });
  assert.equal(miss.stamp, "segment-drop");
  assert.equal(miss.holdingLane, "fragment");
  assert.equal(miss.ribbon, "dictabelt");
  const clear = mapDictabelt({ verbatim: true, dictabelt: false });
  assert.equal(clear.stamp, "batch-ok");
  assert.equal(clear.kindLane, "wax-drum");
  assert.equal(clear.holdingLane, "batch-ok");
});

test("cousins stay cite-only; products stay distinct; backups stay data-only", () => {
  assert.equal(COUSINS.length, 5);
  assert.deepEqual(COUSINS.map((row) => row.issue), [93782, 94031, 94041, 94251, 93193]);
  assert.ok(COUSINS.every((row) => row.citeOnly === true));
  assert.ok(NOT_PRODUCTS.includes("anarthria"));
  assert.ok(NOT_PRODUCTS.includes("souffleur"));
  assert.ok(NOT_PRODUCTS.includes("palilalia"));
  assert.ok(NOT_PRODUCTS.includes("agraphia"));
  assert.ok(NOT_PRODUCTS.includes("mondegreen"));
  assert.ok(NOT_PRODUCTS.includes("lemure"));
  assert.ok(NOT_PRODUCTS.includes("cancellans"));
  assert.ok(NOT_PRODUCTS.includes("arras"));
  assert.ok(NOT_PRODUCTS.includes("frangible"));
  assert.ok(NOT_PRODUCTS.includes("nameplate"));
  assert.equal(BACKUPS.length, 14);
  assert.equal(BACKUPS[0].issue, 94344);
  assert.equal(BACKUPS[13].issue, 94415);
  assert.ok(BACKUPS.every((row) => row.citeOnly === true));
  assert.ok(!BACKUPS.some((row) => row.issue === 94406));
  assert.ok(!COUSINS.some((row) => row.issue === 94406));
  assert.equal(classify({ seed: "cousins", preferSeed: true }), "cousins");
  assert.equal(classify({ seed: "backups", preferSeed: true }), "backups");
});

test("CLI scores fixtures without a server", () => {
  const idle = spawnSync(process.execPath, [modelPath()], { encoding: "utf8" });
  const seeded = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/dictabelt.json", import.meta.url))],
    { encoding: "utf8" },
  );
  const verbatimFix = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/verbatim.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(idle.status, 0, idle.stderr);
  assert.equal(seeded.status, 0, seeded.stderr);
  assert.equal(verbatimFix.status, 0, verbatimFix.stderr);
  const idleOut = JSON.parse(idle.stdout);
  const seededOut = JSON.parse(seeded.stdout);
  const verbatimOut = JSON.parse(verbatimFix.stdout);
  assert.equal(idleOut.verdict, "verbatim");
  assert.equal(idleOut.hold, true);
  assert.equal(seededOut.verdict, "dictabelt");
  assert.equal(seededOut.alarm, true);
  assert.equal(verbatimOut.verdict, "verbatim");
  assert.equal(verbatimOut.hold, true);
  assert.match(verbatimOut.phrase, /admit verbatim/);
});

test("handle exposes published hypothesis and #94406 headline", () => {
  const result = handle(seedDictabelt());
  assert.equal(result.published.issue, 94406);
  assert.equal(result.published.platform, "macos");
  assert.deepEqual(result.published.cousins, [93782, 94031, 94041, 94251, 93193]);
  assert.ok(result.published.backups.includes(94344));
  assert.ok(result.published.backups.includes(94415));
  assert.ok(!result.published.backups.includes(94406));
  assert.match(
    result.published.hypothesis,
    /streaming|segment|NON-BINDING|#94406/i,
  );
  assert.match(result.published.hypothesis, /NON-BINDING/);
  assert.match(result.published.hypothesis, /#94406/);
  assert.equal(result.published.build, BUILD);
});

test("model has no static node: imports so the wax page can score in-browser", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /^import .* from "node:/m);
  assert.match(source, /import\("node:fs"\)/);
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
});

test("wax page is a dictabelt booth, not lararium / binder / tapestry / clinic", () => {
  const page = readPage();
  assert.match(page, /family=Playfair\+Display|Playfair Display/);
  assert.match(page, /family=Manrope|Manrope/);
  assert.match(page, /IBM\+Plex\+Mono|IBM Plex Mono/);
  assert.match(
    page,
    /dictabelt|verbatim|segment-drop|wax-drum|live-stylus|gap-groove|stenotype/i,
  );
  assert.match(page, /#C9893A|#F4EFE4|#1A1612|#D64545|#4A5560|#2F6B4F/i);
  assert.match(page, /\bverbatim\b/);
  assert.match(page, /\bdictabelt\b/);
  assert.match(page, /segment-drop/);
  assert.match(page, /Score dictabelt or admit verbatim/i);
  assert.match(page, /#372/);
  assert.match(page, /#94406/);
  assert.match(page, /Admit verbatim/);
  assert.match(page, /Score dictabelt/);
  assert.match(page, /Walk segment-drop/);
  assert.match(page, /Compare verbatim \/ dictabelt/);
  assert.match(page, /Pin idle verbatim/);
  assert.match(page, /Pin seeded dictabelt/);
  assert.match(page, /Pin segment-drop/);
  assert.match(page, /Stamp fragment/);
  assert.match(page, /Score booth/);
  assert.match(page, /dictabelt-score/);
  assert.match(
    page,
    /2\.1\.237|Darwin 25\.6\.0|ChatGPT|hold and tap|15s|2 minute|48 kHz/i,
  );
  assert.match(page, /wax-drum|live-stylus|gap-groove|hold-and-tap|bilingual-belt|silence-cap/i);
  assert.match(
    page,
    /<svg[\s\S]*class="wax-belt"|class="steel-drum"|class="gooseneck-mic"|class="stenotype-bank"|class="live-stylus"/i,
  );
  assert.doesNotMatch(page, /family=Bodoni\+Moda|Bodoni Moda/);
  assert.doesNotMatch(page, /family=Figtree|Figtree/);
  assert.doesNotMatch(page, /Fira\+Code|Fira Code/);
  assert.doesNotMatch(page, /family=Fraunces|Fraunces/);
  assert.doesNotMatch(page, /family=Karla|Karla/);
  assert.doesNotMatch(page, /JetBrains\+Mono|JetBrains Mono/);
  assert.doesNotMatch(page, /family=Cinzel|Cinzel/);
  assert.doesNotMatch(page, /family=Libre\+Baskerville|Libre Baskerville/);
  assert.doesNotMatch(page, /#A39888|#F7F4EC|#120E0C|#C17A3A|#16182F|#E24A32/);
  assert.doesNotMatch(page, /#1B2430|#C23B22|#F4ECD8|#0D0C0A|#E0A100|#2A9D8F/);
  assert.doesNotMatch(page, /#1A0F1C|#C9A227|#F3EDE0|#8B1E3F|#4ECDC4/);
  assert.doesNotMatch(page, /#1E1740|#E09A3A|#F6EFD8|#3DD6D0|#120E28/);
  assert.doesNotMatch(page, /binder-cloth|cancelled-stamp|folio-press|sewing-thread|replacement-leaf/);
  assert.doesNotMatch(page, /salt-circle|bean-rite|ember-tick|ashlar-wall/i);
  assert.doesNotMatch(page, /groove-re-fire/i);
  assert.doesNotMatch(page, /theater|tapestry|curtain-aisle|gallery-wing|Polonius|proscenium/i);
  assert.doesNotMatch(page, /laryngology|glottis|voice-clinic|ENT clinic/i);
  assert.doesNotMatch(page, /millimeter-slider|leftover-instrument|woodworking|dovetail/i);
  assert.doesNotMatch(page, /hotel door-plate|mahogany door|front-desk ledger/i);
  assert.doesNotMatch(page, /admit quiet|Score lemure|idle quiet/i);
  assert.doesNotMatch(page, /admit intact|Score cancellans|idle intact/i);
  assert.doesNotMatch(page, /admit cleared|Score arras|idle cleared/i);
  assert.doesNotMatch(page, /admit penned|Score agraphia|idle penned/i);
  assert.doesNotMatch(page, /\blemure\b/);
  assert.doesNotMatch(page, /\bcancellans\b/);
  assert.doesNotMatch(page, /\barras\b/);
  assert.doesNotMatch(page, /\bfrangible\b/);
  assert.doesNotMatch(page, /\banarthria\b/);
  assert.doesNotMatch(page, /\bsouffleur\b/);
  assert.doesNotMatch(page, /\bpalilalia\b/);
  assert.doesNotMatch(page, /orphan-tick/);
  assert.doesNotMatch(page, /phantom-prompt/);
  assert.doesNotMatch(page, /deferred-delta/);
  assert.match(page, /NOT Anarthria/i);
  assert.match(page, /NOT Souffleur/i);
  assert.match(page, /NOT Palilalia/i);
  assert.match(page, /NOT Agraphia/i);
  assert.match(page, /NOT Mondegreen/i);
  assert.match(page, /#93782/);
  assert.match(page, /#94031/);
  assert.match(page, /#94041/);
  assert.match(page, /#94251/);
  assert.match(page, /#93193/);
  assert.doesNotMatch(page, /fetch\(/);
  assert.match(page, /body\.embed/);
});

test("README states the thesis, anti-clone, and how to score", () => {
  const readme = readReadme();
  assert.match(readme, /Dictabelt/);
  assert.match(readme, /#94406/);
  assert.match(readme, /\bverbatim\b/);
  assert.match(readme, /\bdictabelt\b/);
  assert.match(readme, /segment-drop/);
  assert.match(readme, /Playfair Display/);
  assert.match(readme, /Manrope/);
  assert.match(readme, /IBM Plex Mono/);
  assert.doesNotMatch(readme, /Bodoni Moda/);
  assert.doesNotMatch(readme, /Figtree/);
  assert.doesNotMatch(readme, /Fraunces/);
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /Research brief/i);
  assert.match(readme, /2\.1\.237|ChatGPT|hold and tap|15s|Darwin 25\.6\.0/i);
  assert.match(readme, /NOT Anarthria\/#93782/);
  assert.match(readme, /NOT Souffleur\/#94031/);
  assert.match(readme, /NOT Palilalia\/#94041/);
  assert.match(readme, /NOT Agraphia\/#94251/);
  assert.match(readme, /NOT Mondegreen\/#93193/);
  assert.match(readme, /NOT Lemure\/#94410/);
  assert.match(readme, /NOT Cancellans\/#94400/);
  assert.match(readme, /NOT Arras\/#94348/);
  assert.match(readme, /#93782/);
  assert.match(readme, /#94031/);
  assert.match(readme, /#94041/);
  assert.match(readme, /#94251/);
  assert.match(readme, /#93193/);
  assert.match(readme, /do NOT rebuild|do not conflate/i);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/dictabelt/);
  assert.match(readme, /node --test projects\/dictabelt\/dictabelt\.test\.mjs/);
  assert.match(readme, /NON-BINDING/);
  assert.match(readme, /wax-belt|stenotype|belt-dictation|dictabelt/i);
  assert.match(readme, /Score dictabelt or admit verbatim/);
  assert.match(readme, /#94344|#94398|#94415/);
  assert.match(readme, /12:50/);
  assert.match(readme, /Do NOT implement a fix/i);
  assert.doesNotMatch(readme, /millimeter-slider|leftover-instrument|woodworking|dovetail/);
  const runLog = readFileSync(
    fileURLToPath(new URL("../../RUN_LOG.md", import.meta.url)),
    "utf8",
  );
  assert.match(runLog, /## 2026-09-15 — Dictabelt/);
  assert.match(runLog, /12:50/);
});

test("catalog features Dictabelt only; Lemure unfeatured; product count 372", () => {
  const catalog = readCatalog();
  const hub = readHubCatalog();
  assert.equal(catalog.products.length, 372);
  assert.equal(hub.products.length, 372);
  assert.equal(catalog.products[0].name, "Dictabelt");
  assert.equal(catalog.products[0].slug, "dictabelt");
  assert.equal(catalog.products[0].featured, true);
  assert.equal(catalog.products[0].href, "/dictabelt/");
  assert.equal(catalog.products[0].day, "2026-09-15");
  assert.equal(catalog.products[0].summary, CATALOG_SUMMARY);
  assert.equal(hub.products[0].summary, catalog.products[0].summary);
  assert.match(catalog.products[0].summary, /\bverbatim\b/);
  assert.match(catalog.products[0].summary, /\bdictabelt\b/);
  assert.match(catalog.products[0].summary, /segment-drop/);
  assert.match(catalog.products[0].summary, /Score dictabelt or admit verbatim/);
  assert.match(catalog.products[0].summary, /#94406/);
  assert.equal(hub.products[0].slug, "dictabelt");
  assert.equal(hub.products[0].featured, true);
  const lemure = catalog.products.find((row) => row.slug === "lemure");
  assert.ok(lemure);
  assert.equal(lemure.featured, false);
  const cancellans = catalog.products.find((row) => row.slug === "cancellans");
  assert.ok(cancellans);
  assert.equal(cancellans.featured, false);
  assert.equal(catalog.products.filter((row) => row.featured).length, 1);
  assert.equal(catalog.products.filter((row) => row.slug === "dictabelt").length, 1);
  assert.ok(
    !catalog.products.some(
      (row) => String(row.summary || "").includes("94406") && row.slug !== "dictabelt",
    ),
  );
});

test("vercel rewrites dictabelt to the project folder at the top", () => {
  const vercel = readVercel();
  assert.equal(vercel.rewrites[0].source, "/dictabelt");
  assert.equal(vercel.rewrites[0].destination, "/projects/dictabelt");
  assert.equal(vercel.rewrites[1].source, "/dictabelt/");
  assert.equal(vercel.rewrites[1].destination, "/projects/dictabelt");
  assert.equal(vercel.rewrites[2].source, "/dictabelt/:path*");
  assert.equal(vercel.rewrites[2].destination, "/projects/dictabelt/:path*");
  assert.equal(vercel.rewrites[3].source, "/lemure");
  assert.equal(vercel.rewrites[3].destination, "/projects/lemure");
});

test("no leftover clone / millimeter-slider / woodworking content", () => {
  const page = readPage();
  const readme = readReadme();
  const source = readFileSync(modelPath(), "utf8");
  for (const blob of [page, readme, source]) {
    assert.doesNotMatch(blob, /millimeter-slider|leftover instrument|dovetail jig|marking gauge/i);
  }
});

test("no network calls in the model or tests", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
  assert.doesNotMatch(source, /https?:\/\/[^\s"']*anthropic\.com\/v1/);
});
