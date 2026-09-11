import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ALARM,
  AUTHOR,
  BACKUPS,
  CHIPS,
  CLAUDE_CODE_VERSION,
  CLIENT,
  COUSINS,
  DRAIN_STATIONS,
  EMITTED_CHARS,
  FEATURED_ISSUE,
  FILED,
  FINGERPRINT_LINES,
  FORBIDDEN_IDLE,
  FORBIDDEN_SEED,
  FORK_SESSION,
  FORKSINK_WALK,
  HOLD,
  HOOK_TRACE,
  HOOK_TRACE_AT,
  IDLE_WORD,
  ISSUE_URL,
  LABELS,
  MARKER_REWIND,
  MARKER_START,
  MODEL,
  NOT_PRODUCTS,
  OS,
  PATH_WORD,
  PHRASE,
  PLATFORM,
  POSITIVE_CONTROL_WALK,
  PRODUCT_WORD,
  RESUME_SESSION_AT,
  REWIND_AT,
  REWIND_COUNT,
  REWIND_LOG,
  SEEDED_WORD,
  SESSION_KIND,
  SHELL,
  STATE,
  TITLE,
  VERDICTS,
  analyze,
  classify,
  decide,
  emptyTicket,
  fingerprint,
  handle,
  inspectHook,
  inspectJson,
  inspectModel,
  inspectSink,
  inspectStreet,
  readBasin,
  score,
  scoreGate,
  scoreWalk,
  seedCompactLodged,
  seedDropped,
  seedEmitted2430,
  seedExitZero,
  seedForksink,
  seedHold,
  seedHookRan,
  seedLodged,
  seedMarkerAbc,
  seedMarkerXyz,
  seedNoAlarm,
  seedNoModelText,
  seedSelfTrace,
  seedSessionEndLive,
  seedSilentDrop,
  seedSourceFork,
  seedStaleInherit,
  seedStartupLodged,
  seedValidJson,
  seedRewindFork,
} from "./forksink.mjs";

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
  return fileURLToPath(new URL("./forksink.mjs", import.meta.url));
}

test("idle lodged is a hold; additionalContext reached the model on fork the same way it does on startup/compact", () => {
  const result = analyze(seedLodged());
  assert.equal(result.verdict, "lodged");
  assert.equal(result.idleWord, "lodged");
  assert.equal(IDLE_WORD, "lodged");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.lodged, true);
  assert.equal(result.phrase, "admit lodged");
  assert.equal(result.dropped, false);
  assert.equal(result.sourceFork, false);
  assert.equal(result.modelReceived, true);
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(result.idleWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("empty ticket and empty stdin classify lodged", () => {
  assert.equal(classify(emptyTicket()), "lodged");
  assert.equal(classify(""), "lodged");
  assert.equal(classify(null), "lodged");
  assert.equal(decide({}), "lodged");
});

test("#93458 seeded path scores dropped when hook ran, exit 0, valid JSON, but model never received additionalContext on source=fork", () => {
  const result = analyze(seedDropped());
  assert.equal(result.verdict, "dropped");
  assert.equal(result.seededWord, "dropped");
  assert.equal(SEEDED_WORD, "dropped");
  assert.equal(PRODUCT_WORD, "forksink");
  assert.equal(result.hold, false);
  assert.equal(result.alarm, true);
  assert.equal(result.dropped, true);
  assert.equal(result.phrase, "score forksink");
  assert.equal(result.hookRan, true);
  assert.equal(result.exitZero, true);
  assert.equal(result.validJson, true);
  assert.equal(result.sourceFork, true);
  assert.equal(result.noModelText, true);
  assert.equal(result.modelReceived, false);
  for (const word of FORBIDDEN_SEED) {
    assert.notEqual(result.seededWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("hook ran plus valid JSON plus no model text is the #93458 forksink", () => {
  const hook = inspectHook({
    dropped: true,
    hookRan: true,
    selfTrace: true,
    exitZero: true,
  });
  assert.equal(hook.stamp, "ran");
  assert.equal(hook.ran, true);
  const scored = scoreGate({
    dropped: true,
    hookRan: true,
    exitZero: true,
    validJson: true,
    sourceFork: true,
    noModelText: true,
    cue: "dropped",
  });
  assert.equal(scored.verdict, "dropped");
  assert.equal(scored.sourceFork, true);
  const calm = inspectModel({ lodged: true, modelReceived: true });
  assert.equal(calm.stamp, "lodged");
});

test("path word is source-fork; named path seed holds the path", () => {
  assert.equal(PATH_WORD, "source-fork");
  const result = analyze(seedSourceFork());
  assert.equal(result.verdict, "source-fork");
  assert.equal(result.pathWord, "source-fork");
  assert.equal(result.hold, false);
  assert.equal(
    classify({ seed: "source-fork", preferSeed: true, dropped: true }),
    "source-fork",
  );
  assert.equal(classify(seedHookRan()), "hook-ran");
});

test("HOLD includes lodged / hold", () => {
  assert.ok(HOLD.includes("lodged"));
  assert.ok(HOLD.includes("hold"));
  const hold = analyze(seedHold());
  assert.equal(hold.verdict, "hold");
  assert.equal(hold.hold, true);
  assert.equal(classify({ seed: "hold", preferSeed: true }), "hold");
});

test("alarm chips: hook-ran, exit-zero, valid-json, no-model-text, silent-drop, source-fork", () => {
  assert.equal(classify(seedHookRan()), "hook-ran");
  assert.equal(classify(seedExitZero()), "exit-zero");
  assert.equal(classify(seedValidJson()), "valid-json");
  assert.equal(classify(seedNoModelText()), "no-model-text");
  assert.equal(classify(seedSilentDrop()), "silent-drop");
  assert.equal(classify(seedRewindFork()), "rewind-fork");
  assert.equal(classify(seedStartupLodged()), "startup-lodged");
  assert.equal(classify(seedCompactLodged()), "compact-lodged");
  assert.equal(classify(seedMarkerAbc()), "marker-abc");
  assert.equal(classify(seedMarkerXyz()), "marker-xyz");
  assert.equal(classify(seedStaleInherit()), "stale-inherit");
  assert.equal(classify(seedNoAlarm()), "no-alarm");
  assert.equal(classify(seedSessionEndLive()), "session-end-live");
  assert.equal(classify(seedSelfTrace()), "self-trace");
  assert.equal(classify(seedEmitted2430()), "emitted-2430");
  assert.equal(classify(seedForksink()), "forksink");
});

test("booth fixtures flip lodged vs dropped vs source-fork", () => {
  const idle = scoreGate(seedLodged());
  const seeded = scoreGate(readData("dropped.json"));
  const lodged = readData("lodged.json");
  const dropped = readData("dropped.json");
  const path = readData("source-fork.json");
  const product = readData("forksink.json");
  assert.equal(idle.verdict, "lodged");
  assert.equal(seeded.verdict, "dropped");
  assert.notEqual(idle.verdict, seeded.verdict);
  assert.equal(score(seedLodged()), "lodged");
  assert.equal(score(readData("dropped.json")), "dropped");
  assert.equal(lodged.modelReceived, true);
  assert.equal(lodged.lodged, true);
  assert.equal(scoreGate(lodged).verdict, "lodged");
  assert.equal(dropped.marker, MARKER_REWIND);
  assert.equal(dropped.emittedChars, EMITTED_CHARS);
  assert.equal(dropped.hookRan, true);
  assert.equal(dropped.noModelText, true);
  assert.equal(classify(dropped), "dropped");
  assert.equal(path.paths.length, 3);
  assert.match(path.paths[0].rule, /startup/);
  assert.match(path.paths[2].result, /source-fork/);
  assert.equal(classify(path), "source-fork");
  assert.equal(classify(product), "forksink");
  assert.equal(dropped.issue, 93458);
  assert.equal(dropped.sourceFork, true);
});

test("chips include idle, seeded, path, and walk", () => {
  assert.ok(CHIPS.includes("lodged"));
  assert.ok(CHIPS.includes("dropped"));
  assert.ok(CHIPS.includes("forksink"));
  assert.ok(CHIPS.includes("source-fork"));
  assert.ok(CHIPS.includes("chips"));
  assert.ok(CHIPS.includes("fingerprints"));
  assert.ok(CHIPS.includes("walk"));
  assert.ok(ALARM.includes("dropped"));
  assert.ok(ALARM.includes("source-fork"));
  assert.ok(VERDICTS.includes("walk"));
  assert.equal(classify({ seed: "chips", preferSeed: true }), "chips");
  assert.equal(classify({ seed: "fingerprints", preferSeed: true }), "fingerprints");
  assert.equal(classify({ seed: "walk", preferSeed: true }), "walk");
});

test("published forksink walk scores dropped after the idle hold", () => {
  const basin = scoreWalk({ rows: FORKSINK_WALK });
  assert.equal(basin.verdict, "dropped");
  assert.ok(basin.droppedCount >= 1);
  const idle = basin.rows.find((row) => row.event === "cue-lodged");
  assert.equal(idle.lodged, true);
  assert.equal(idle.verdict, "lodged");
  const startup = basin.rows.find((row) => row.event === "startup-lodged");
  assert.equal(startup.startupLodged, true);
  const rewind = basin.rows.find((row) => row.event === "rewind-fork");
  assert.equal(rewind.dropped, true);
  const grate = basin.rows.find((row) => row.event === "hook-ran");
  assert.equal(grate.hookRan, true);
  const json = basin.rows.find((row) => row.event === "valid-json");
  assert.equal(json.validJson, true);
  const sink = basin.rows.find((row) => row.event === "no-model-text");
  assert.equal(sink.noModelText, true);
  const path = basin.rows.find((row) => row.event === "source-fork");
  assert.equal(path.verdict, "source-fork");
});

test("FORKSINK_WALK constant matches the issue grate walk", () => {
  assert.equal(FORKSINK_WALK[0].event, "cue-lodged");
  const grate = FORKSINK_WALK.find((row) => row.event === "hook-ran");
  assert.equal(grate.hookRan, true);
  const path = FORKSINK_WALK.find((row) => row.event === "source-fork");
  assert.equal(path.dropped, true);
  const scoreRow = FORKSINK_WALK.find((row) => row.event === "forksink");
  assert.equal(scoreRow.dropped, true);
});

test("positive control startup/compact/session-end stays lodged", () => {
  const walk = scoreWalk({ rows: POSITIVE_CONTROL_WALK });
  assert.equal(walk.verdict, "lodged");
  const startup = walk.rows.find((row) => row.event === "startup-lodged");
  assert.equal(startup.verdict, "lodged");
  const compact = walk.rows.find((row) => row.event === "compact-lodged");
  assert.equal(compact.compactLodged, true);
  assert.equal(compact.verdict, "lodged");
  const end = walk.rows.find((row) => row.event === "session-end-live");
  assert.equal(end.sessionEndLive, true);
});

test("issue constants encode only #93458 published facts", () => {
  assert.equal(FEATURED_ISSUE, 93458);
  assert.ok(ISSUE_URL.includes("93458"));
  assert.match(TITLE, /additionalContext silently dropped when source=fork/);
  assert.equal(STATE, "OPEN");
  assert.ok(LABELS.includes("bug"));
  assert.ok(LABELS.includes("has repro"));
  assert.ok(LABELS.includes("platform:windows"));
  assert.ok(LABELS.includes("area:hooks"));
  assert.ok(LABELS.includes("area:desktop"));
  assert.equal(AUTHOR, "turtleziv");
  assert.equal(FILED, "2026-09-10T19:50:08Z");
  assert.equal(CLAUDE_CODE_VERSION, "2.1.263");
  assert.equal(OS, "Windows 10 (10.0.19045)");
  assert.equal(CLIENT, "Claude Code desktop app, Code tab");
  assert.equal(SHELL, "Git Bash");
  assert.equal(MODEL, "Opus 5 (claude-opus-5)");
  assert.equal(PLATFORM, "Anthropic API (Claude subscription)");
  assert.equal(
    SESSION_KIND,
    "Claude Code desktop app Code tab; SessionStart hook via Git Bash; rewind creates source=fork",
  );
  assert.equal(MARKER_START, "MARKER_ABC123");
  assert.equal(MARKER_REWIND, "MARKER_XYZ789");
  assert.equal(REWIND_AT, "2026-09-11 03:36:24");
  assert.equal(HOOK_TRACE_AT, "2026-09-11 03:36:25");
  assert.equal(RESUME_SESSION_AT, "80b720a2-3ec9-4011-a5a2-c6e516465920");
  assert.equal(FORK_SESSION, "local_8021f6c5-e5fc-405e-8bc0-802d8729512b");
  assert.equal(EMITTED_CHARS, 2430);
  assert.equal(REWIND_COUNT, 5);
  assert.match(REWIND_LOG, /forkSession/);
  assert.match(HOOK_TRACE, /source=fork/);
  assert.equal(DRAIN_STATIONS.length, 4);
  assert.ok(FINGERPRINT_LINES.includes("source-fork"));
  assert.ok(FINGERPRINT_LINES.includes("dropped"));
  assert.match(PHRASE, /score forksink or admit lodged/);
});

test("has-repro fingerprints encode the published fork drop", () => {
  const result = handle(readData("dropped.json"));
  assert.equal(result.published.claudeCodeVersion, "2.1.263");
  assert.equal(result.published.author, "turtleziv");
  assert.equal(
    result.published.sessionKind,
    "Claude Code desktop app Code tab; SessionStart hook via Git Bash; rewind creates source=fork",
  );
  assert.equal(result.published.markerRewind, "MARKER_XYZ789");
  assert.match(
    fingerprint(seedDropped()),
    /dropped\|hook=ran\|json=valid\|street=dry\|sink=dropped\|model=none\|path=source-fork\|cue=dropped/,
  );
  assert.equal(classify({ seed: "has-repro", preferSeed: true }), "has-repro");
});

test("forbidden idle list includes recent catalog words including Foxfire and Pentimento", () => {
  const required = [
    "kindled",
    "painted",
    "foxfire",
    "never-turns",
    "flushed",
    "lagged",
    "one-behind",
    "pentimento",
    "solitary",
    "twinlinked",
    "bridge-refuse",
    "vinculum",
    "hit",
    "flattened",
    "string-carrier",
    "cachet",
    "steady",
    "strobing",
    "off-label",
    "strobe",
    "matched",
    "skewed",
    "headers-hash",
    "counterfoil",
    "traced",
    "pathless",
    "image-cache",
    "lucida",
    "scrubbed",
    "contaminated",
    "fomite",
    "damped",
    "spinning",
    "mux",
    "snubber",
    "mounted",
    "fossed",
    "plan9",
    "fosse",
    "warm",
    "paged-out",
    "majflt",
    "hibernacle",
    "sealed",
    "mismatched",
    "issuer",
    "paraph",
    "sterling",
    "debased",
    "hallmark",
    "remanent",
    "collimated",
    "diopter",
    "hysteresis",
    "banked",
    "ephemera",
    "afloat",
    "washed",
    "pontoon",
    "oubliette",
    "vernier",
    "procrustes",
    "drained",
    "gated",
  ];
  for (const word of required) {
    assert.ok(FORBIDDEN_IDLE.includes(word), `missing forbidden idle ${word}`);
  }
});

test("lodged grate flips dropped back when additionalContext reaches the model on fork", () => {
  const tape = {
    lodged: true,
    dropped: false,
    modelReceived: true,
    startupLodged: true,
    compactLodged: true,
    sourceFork: false,
    cue: "lodged",
  };
  assert.equal(scoreGate(tape).verdict, "lodged");
  tape.lodged = false;
  tape.dropped = true;
  tape.hookRan = true;
  tape.exitZero = true;
  tape.validJson = true;
  tape.sourceFork = true;
  tape.noModelText = true;
  tape.modelReceived = false;
  tape.cue = "dropped";
  assert.equal(scoreGate(tape).verdict, "dropped");
  tape.lodged = true;
  tape.dropped = false;
  tape.hookRan = true;
  tape.sourceFork = false;
  tape.noModelText = false;
  tape.modelReceived = true;
  tape.cue = "lodged";
  assert.equal(scoreGate(tape).verdict, "lodged");
});

test("hook, json, street, sink, model, and basin mark dropped after rewind fork", () => {
  const idle = inspectStreet({ lodged: true, startupLodged: true, compactLodged: true });
  assert.equal(idle.stamp, "lodged");
  assert.equal(idle.lodged, true);
  const hook = inspectHook({
    dropped: true,
    hookRan: true,
    selfTrace: true,
    exitZero: true,
  });
  assert.equal(hook.stamp, "ran");
  assert.equal(hook.ran, true);
  const json = inspectJson({
    dropped: true,
    validJson: true,
    emittedChars: EMITTED_CHARS,
  });
  assert.equal(json.stamp, "valid");
  assert.equal(json.chars, 2430);
  const street = inspectStreet({
    dropped: true,
    sourceFork: true,
  });
  assert.equal(street.stamp, "dry");
  const sink = inspectSink({
    dropped: true,
    sourceFork: true,
    silentDrop: true,
  });
  assert.equal(sink.stamp, "dropped");
  assert.equal(sink.vanished, true);
  const model = inspectModel({
    dropped: true,
    noModelText: true,
    modelReceived: false,
  });
  assert.equal(model.stamp, "dropped");
  assert.equal(model.missing, true);
  const basin = readBasin({
    dropped: true,
    hookRan: true,
    validJson: true,
    sourceFork: true,
    noModelText: true,
    silentDrop: true,
  });
  assert.equal(basin.dropped, true);
  assert.equal(basin.mark, "dropped");
  const calm = readBasin({
    lodged: true,
    dropped: false,
    modelReceived: true,
    startupLodged: true,
    compactLodged: true,
  });
  assert.equal(calm.dropped, false);
  assert.equal(calm.mark, "lodged");
});

test("cousins are cite-only; products stay distinct; backups stay data-only", () => {
  assert.equal(COUSINS.length, 2);
  assert.equal(COUSINS[0].issue, 69848);
  assert.equal(COUSINS[1].issue, 88086);
  assert.ok(COUSINS.every((row) => row.citeOnly === true));
  assert.ok(NOT_PRODUCTS.includes("foxfire"));
  assert.ok(NOT_PRODUCTS.includes("pentimento"));
  assert.ok(NOT_PRODUCTS.includes("vinculum"));
  assert.ok(NOT_PRODUCTS.includes("cachet"));
  assert.ok(NOT_PRODUCTS.includes("sump"));
  assert.ok(NOT_PRODUCTS.includes("spillway"));
  assert.ok(NOT_PRODUCTS.includes("quietus"));
  assert.ok(NOT_PRODUCTS.includes("rubric"));
  assert.ok(NOT_PRODUCTS.includes("recension"));
  assert.ok(NOT_PRODUCTS.includes("afterimage"));
  assert.equal(BACKUPS.length, 8);
  assert.equal(BACKUPS[0].issue, 93475);
  assert.equal(BACKUPS[1].issue, 93439);
  assert.equal(BACKUPS[2].issue, 93438);
  assert.equal(BACKUPS[3].issue, 93466);
  assert.equal(BACKUPS[4].issue, 93495);
  assert.equal(BACKUPS[5].issue, 93507);
  assert.equal(BACKUPS[6].issue, 93512);
  assert.equal(BACKUPS[7].issue, 93508);
  assert.ok(BACKUPS.every((row) => row.citeOnly === true));
  assert.equal(classify({ seed: "cousins", preferSeed: true }), "cousins");
  assert.equal(classify({ seed: "backups", preferSeed: true }), "backups");
});

test("CLI scores fixtures without a server", () => {
  const idle = spawnSync(process.execPath, [modelPath()], { encoding: "utf8" });
  const seeded = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/dropped.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(idle.status, 0, idle.stderr);
  assert.equal(seeded.status, 0, seeded.stderr);
  assert.equal(JSON.parse(idle.stdout).verdict, "lodged");
  assert.equal(JSON.parse(seeded.stdout).verdict, "dropped");
});

test("handle exposes published hypothesis and #93458 headline", () => {
  const result = handle(readData("dropped.json"));
  assert.equal(result.published.issue, 93458);
  assert.equal(result.published.claudeCodeVersion, "2.1.263");
  assert.equal(result.published.author, "turtleziv");
  assert.deepEqual(result.published.cousins, [69848, 88086]);
  assert.ok(result.published.backups.includes(93475));
  assert.ok(result.published.backups.includes(93495));
  assert.ok(result.published.backups.includes(93507));
  assert.ok(result.published.backups.includes(93508));
  assert.match(result.published.hypothesis, /inherit the parent's context snapshot/);
  assert.match(result.published.hypothesis, /NON-BINDING/);
});

test("model has no static node: imports so the living page can score in-browser", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /^import .* from "node:/m);
  assert.match(source, /import\("node:fs"\)/);
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
});

test("living page is a municipal storm-drain grate booth, not a marsh lantern or atelier", () => {
  const page = readPage();
  assert.match(page, /Syne/);
  assert.match(page, /Figtree/);
  assert.match(page, /IBM Plex Mono/);
  assert.match(page, /forksink|storm-drain|catch-basin|grate|sodium/i);
  assert.match(page, /#12151a|#2a3038|#FFB020|#3ECFBF|#9ab0b8|#0a0c10/i);
  assert.match(page, /\blodged\b/);
  assert.match(page, /dropped/);
  assert.match(page, /source-fork/);
  assert.match(page, /score forksink or admit lodged/i);
  assert.match(page, /cousin-not-primary/);
  assert.match(page, /12:50/);
  assert.match(page, /#284/);
  assert.match(page, /#93458/);
  assert.match(page, /turtleziv/);
  assert.match(page, /2\.1\.263/);
  assert.match(page, /MARKER_ABC123/);
  assert.match(page, /MARKER_XYZ789/);
  assert.match(page, /SessionStart/);
  assert.match(page, /additionalContext/);
  assert.match(page, /Lift the grate/);
  assert.match(page, /Score forksink/);
  assert.match(page, /Sound the basin/);
  assert.match(page, /Compare street \/ sink/);
  assert.match(page, /Pin idle lodged/);
  assert.match(page, /Pin seeded dropped/);
  assert.match(page, /Pin source-fork/);
  assert.match(page, /Clear the grate/);
  assert.doesNotMatch(page, /Eczar/);
  assert.doesNotMatch(page, /Work Sans/);
  assert.doesNotMatch(page, /Inconsolata/);
  assert.doesNotMatch(page, /Fraunces/);
  assert.doesNotMatch(page, /Source Sans 3/);
  assert.doesNotMatch(page, /Libre Baskerville/);
  assert.doesNotMatch(page, /Karla/);
  assert.doesNotMatch(page, /Source Code Pro/);
  assert.doesNotMatch(page, /Cormorant Infant/);
  assert.doesNotMatch(page, /Newsreader/);
  assert.doesNotMatch(page, /Red Hat Mono/);
  assert.doesNotMatch(page, /Outfit/);
  assert.doesNotMatch(page, /Space Mono/);
  assert.doesNotMatch(page, /Source Serif 4/);
  assert.doesNotMatch(page, /Alegreya/);
  assert.doesNotMatch(page, /Cormorant Garamond/);
  assert.doesNotMatch(page, /Nunito Sans/);
  assert.doesNotMatch(page, /JetBrains Mono/);
  assert.doesNotMatch(page, /Space Grotesk/);
  assert.doesNotMatch(page, /Teko/);
  assert.doesNotMatch(page, /#eadfcb/);
  assert.doesNotMatch(page, /#6e4a28/);
  assert.doesNotMatch(page, /#1e4d8c/);
  assert.doesNotMatch(page, /#c9841a/);
  assert.doesNotMatch(page, /#2a241c/);
  assert.doesNotMatch(page, /#1a1f2a/);
  assert.doesNotMatch(page, /#b8956c/);
  assert.doesNotMatch(page, /#e8dfd0/);
  assert.doesNotMatch(page, /#5c0a1a/);
  assert.doesNotMatch(page, /#f3e6c8/);
  assert.doesNotMatch(page, /#c9a227/);
  assert.doesNotMatch(page, /#0b1220/);
  assert.doesNotMatch(page, /#3de0ff/);
  assert.doesNotMatch(page, /#7c5cff/);
  assert.doesNotMatch(page, /#0d3b2e/);
  assert.doesNotMatch(page, /#f4efe6/);
  assert.doesNotMatch(page, /#f7f0e4/);
  assert.doesNotMatch(page, /#5c4d8a/);
  assert.doesNotMatch(page, /#0e1a14/);
  assert.doesNotMatch(page, /#7CFF9A/);
  assert.doesNotMatch(page, /#3DFF8A/);
  assert.doesNotMatch(page, /hangar beacon|flash capacitor|cheque-counter|camera-lucida atelier|culture dish|pulse-damper|earthwork fosse|wax-cachet blotter|chain-forge|nlink gauge|underpainting atelier|stretcher bars|marsh lantern|peat bank|biolumines/i);
  assert.doesNotMatch(page, /\bkindled\b/);
  assert.doesNotMatch(page, /\bpainted\b/);
  assert.doesNotMatch(page, /\bnever-turns\b/);
  assert.doesNotMatch(page, /\bflushed\b/);
  assert.doesNotMatch(page, /\blagged\b/);
  assert.doesNotMatch(page, /\bone-behind\b/);
  assert.doesNotMatch(page, /\bsolitary\b/);
  assert.doesNotMatch(page, /\btwinlinked\b/);
  assert.doesNotMatch(page, /\bbridge-refuse\b/);
  assert.doesNotMatch(page, /\bflattened\b/);
  assert.doesNotMatch(page, /\bstring-carrier\b/);
  assert.doesNotMatch(page, /\bsteady\b/);
  assert.doesNotMatch(page, /\bstrobing\b/);
  assert.doesNotMatch(page, /\boff-label\b/);
  assert.doesNotMatch(page, /\bmatched\b/);
  assert.doesNotMatch(page, /\bskewed\b/);
  assert.doesNotMatch(page, /\btraced\b/);
  assert.doesNotMatch(page, /\bpathless\b/);
  assert.match(page, /NOT Foxfire/i);
  assert.match(page, /NOT Pentimento/i);
  assert.match(page, /NOT Vinculum/i);
  assert.match(page, /NOT Cachet/i);
  assert.match(page, /NOT Sump/i);
  assert.match(page, /NOT Spillway/i);
  assert.match(page, /NOT Quietus/i);
  assert.match(page, /NOT Rubric/i);
  assert.match(page, /NOT Recension/i);
  assert.match(page, /NOT Afterimage/i);
});

test("README states the thesis, anti-clone, and how to score", () => {
  const readme = readReadme();
  assert.match(readme, /Forksink/);
  assert.match(readme, /#93458/);
  assert.match(readme, /\blodged\b/);
  assert.match(readme, /dropped/);
  assert.match(readme, /source-fork/);
  assert.match(readme, /Syne/);
  assert.match(readme, /Figtree/);
  assert.match(readme, /IBM Plex Mono/);
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /NOT Foxfire/i);
  assert.match(readme, /NOT Pentimento/i);
  assert.match(readme, /NOT Vinculum/i);
  assert.match(readme, /NOT Cachet/i);
  assert.match(readme, /NOT Sump/i);
  assert.match(readme, /NOT Spillway/i);
  assert.match(readme, /NOT Quietus/i);
  assert.match(readme, /NOT Rubric/i);
  assert.match(readme, /NOT Recension/i);
  assert.match(readme, /NOT Afterimage/i);
  assert.match(readme, /2\.1\.263/);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/forksink/);
  assert.match(readme, /node --test projects\/forksink\/forksink\.test\.mjs/);
  assert.match(readme, /NON-BINDING/);
  assert.match(readme, /storm-drain|catch-basin|grate|sodium/i);
  assert.match(readme, /#69848/);
  assert.match(readme, /#88086/);
  assert.match(readme, /SessionStart/);
  assert.match(readme, /additionalContext/);
});

test("catalog features Forksink only; Foxfire unfeatured", () => {
  const catalog = readCatalog();
  const hub = readHubCatalog();
  assert.equal(catalog.products.length, 284);
  assert.equal(hub.products.length, 284);
  assert.equal(catalog.products[0].name, "Forksink");
  assert.equal(catalog.products[0].slug, "forksink");
  assert.equal(catalog.products[0].featured, true);
  assert.equal(catalog.products[0].href, "/forksink/");
  assert.equal(catalog.products[0].day, "2026-09-11");
  assert.match(catalog.products[0].summary, /12:50/);
  assert.match(catalog.products[0].summary, /forksink/);
  assert.match(catalog.products[0].summary, /#93458/);
  assert.match(catalog.products[0].summary, /\blodged\b/);
  assert.match(catalog.products[0].summary, /dropped/);
  assert.match(catalog.products[0].summary, /source-fork/);
  assert.equal(hub.products[0].slug, "forksink");
  assert.equal(hub.products[0].featured, true);
  const foxfire = catalog.products.find((row) => row.slug === "foxfire");
  assert.ok(foxfire);
  assert.equal(foxfire.featured, false);
  const pentimento = catalog.products.find((row) => row.slug === "pentimento");
  assert.ok(pentimento);
  assert.equal(pentimento.featured, false);
  const vinculum = catalog.products.find((row) => row.slug === "vinculum");
  assert.ok(vinculum);
  assert.equal(vinculum.featured, false);
  assert.equal(catalog.products.filter((row) => row.featured).length, 1);
  assert.equal(catalog.products.filter((row) => row.slug === "forksink").length, 1);
  assert.ok(!catalog.products.some((row) => String(row.summary || "").includes("93458") && row.slug !== "forksink"));
});

test("vercel rewrites forksink to the project folder at the top", () => {
  const vercel = readVercel();
  assert.equal(vercel.rewrites[0].source, "/forksink");
  assert.equal(vercel.rewrites[0].destination, "/projects/forksink");
  assert.equal(vercel.rewrites[1].source, "/forksink/");
  assert.equal(vercel.rewrites[1].destination, "/projects/forksink");
  assert.equal(vercel.rewrites[2].source, "/forksink/:path*");
  assert.equal(vercel.rewrites[2].destination, "/projects/forksink/:path*");
});

test("no network calls in the model or tests", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /\bcurl\b/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
  assert.doesNotMatch(source, /https?:\/\/[^\s"']*anthropic\.com\/v1/);
});
