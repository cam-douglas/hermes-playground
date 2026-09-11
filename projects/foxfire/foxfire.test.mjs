import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ABSORBED_AT,
  ABSORB_REASON,
  ABSORB_SECONDS,
  ALARM,
  ASSISTANT_ENDED,
  AUTHOR,
  BACKUPS,
  CHIPS,
  CLAUDE_CODE_VERSION,
  CLIENT,
  COUSINS,
  FEATURED_ISSUE,
  FILED,
  FINGERPRINT_LINES,
  FORBIDDEN_IDLE,
  FORBIDDEN_SEED,
  FOXFIRE_WALK,
  HOLD,
  HOOK_CONTINUE_AT,
  HOOK_EMPTY_AT,
  IDLE_WORD,
  ISSUE_URL,
  LABELS,
  LANTERN_STATIONS,
  NOT_PRODUCTS,
  OS,
  PAINT_AT,
  PAINT_LAG_SECONDS,
  PATH_WORD,
  PHRASE,
  POSITIVE_CONTROL_WALK,
  PRODUCT_WORD,
  QUEUE_ENQUEUE_AT,
  REMOTE_MESSAGE,
  SEEDED_WORD,
  SESSION_KIND,
  STATE,
  STOP_SUMMARY_AT,
  TITLE,
  VERDICTS,
  analyze,
  classify,
  decide,
  emptyTicket,
  fingerprint,
  handle,
  inspectComposer,
  inspectHooks,
  inspectQueue,
  inspectTranscript,
  inspectTurn,
  readLantern,
  score,
  scoreGate,
  scoreWalk,
  seedAbsorbedMidTurn,
  seedComposerPaint,
  seedContinueTrue,
  seedDimText,
  seedF831,
  seedFoxfire,
  seedHold,
  seedIdleAfterStop,
  seedKindled,
  seedMidTurnAbsorbed,
  seedNeverTurns,
  seedNoDeliveryFailure,
  seedNoPtyInput,
  seedNoQueue,
  seedNoTranscript,
  seedPainted,
  seedPreventedFalse,
  seedQueueEnqueue,
  seedStopClean,
  seedWorkaround,
} from "./foxfire.mjs";

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
  return fileURLToPath(new URL("./foxfire.mjs", import.meta.url));
}

test("idle kindled is a hold; remote message became a real user turn; transcript user row + turn started", () => {
  const result = analyze(seedKindled());
  assert.equal(result.verdict, "kindled");
  assert.equal(result.idleWord, "kindled");
  assert.equal(IDLE_WORD, "kindled");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.kindled, true);
  assert.equal(result.phrase, "admit kindled");
  assert.equal(result.painted, false);
  assert.equal(result.neverTurns, false);
  assert.equal(result.turnStarted, true);
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(result.idleWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("empty ticket and empty stdin classify kindled", () => {
  assert.equal(classify(emptyTicket()), "kindled");
  assert.equal(classify(""), "kindled");
  assert.equal(classify(null), "kindled");
  assert.equal(decide({}), "kindled");
});

test("#93502 seeded path scores painted when dim composer text has no transcript, no queue, and no turn", () => {
  const result = analyze(seedPainted());
  assert.equal(result.verdict, "painted");
  assert.equal(result.seededWord, "painted");
  assert.equal(SEEDED_WORD, "painted");
  assert.equal(PRODUCT_WORD, "foxfire");
  assert.equal(result.hold, false);
  assert.equal(result.alarm, true);
  assert.equal(result.painted, true);
  assert.equal(result.phrase, "score foxfire");
  assert.equal(result.composerPaint, true);
  assert.equal(result.noTranscript, true);
  assert.equal(result.noQueue, true);
  assert.equal(result.neverTurns, true);
  assert.equal(result.sessionIdle, true);
  assert.equal(result.turnStarted, false);
  for (const word of FORBIDDEN_SEED) {
    assert.notEqual(result.seededWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("dim composer plus no transcript plus no queue is the #93502 foxfire", () => {
  const composer = inspectComposer({
    painted: true,
    composerPaint: true,
    dimComposer: true,
    remoteMessage: REMOTE_MESSAGE,
  });
  assert.equal(composer.stamp, "painted");
  assert.equal(composer.dim, true);
  const scored = scoreGate({
    painted: true,
    composerPaint: true,
    noTranscript: true,
    noQueue: true,
    neverTurns: true,
    sessionIdle: true,
    cue: "painted",
  });
  assert.equal(scored.verdict, "painted");
  assert.equal(scored.neverTurns, true);
  const calm = inspectComposer({ kindled: true, turnStarted: true, transcriptUserRow: true });
  assert.equal(calm.stamp, "kindled");
});

test("path word is never-turns; named path seed holds the path", () => {
  assert.equal(PATH_WORD, "never-turns");
  const result = analyze(seedNeverTurns());
  assert.equal(result.verdict, "never-turns");
  assert.equal(result.pathWord, "never-turns");
  assert.equal(result.hold, false);
  assert.equal(
    classify({ seed: "never-turns", preferSeed: true, painted: true }),
    "never-turns",
  );
  assert.equal(classify(seedComposerPaint()), "composer-paint");
});

test("HOLD includes kindled / hold", () => {
  assert.ok(HOLD.includes("kindled"));
  assert.ok(HOLD.includes("hold"));
  const hold = analyze(seedHold());
  assert.equal(hold.verdict, "hold");
  assert.equal(hold.hold, true);
  assert.equal(classify({ seed: "hold", preferSeed: true }), "hold");
});

test("alarm chips: composer-paint, no-transcript, no-queue, dim-text, f-831, never-turns", () => {
  assert.equal(classify(seedComposerPaint()), "composer-paint");
  assert.equal(classify(seedNoTranscript()), "no-transcript");
  assert.equal(classify(seedNoQueue()), "no-queue");
  assert.equal(classify(seedNoPtyInput()), "no-pty-input");
  assert.equal(classify(seedStopClean()), "stop-clean");
  assert.equal(classify(seedMidTurnAbsorbed()), "mid-turn-absorbed");
  assert.equal(classify(seedQueueEnqueue()), "queue-enqueue");
  assert.equal(classify(seedAbsorbedMidTurn()), "absorbed-mid-turn");
  assert.equal(classify(seedPreventedFalse()), "prevented-false");
  assert.equal(classify(seedContinueTrue()), "continue-true");
  assert.equal(classify(seedDimText()), "dim-text");
  assert.equal(classify(seedF831()), "f-831");
  assert.equal(classify(seedIdleAfterStop()), "idle-after-stop");
  assert.equal(classify(seedNoDeliveryFailure()), "no-delivery-failure");
  assert.equal(classify(seedWorkaround()), "workaround");
  assert.equal(classify(seedFoxfire()), "foxfire");
});

test("booth fixtures flip kindled vs painted vs never-turns", () => {
  const idle = scoreGate(seedKindled());
  const seeded = scoreGate(readData("painted.json"));
  const kindled = readData("kindled.json");
  const painted = readData("painted.json");
  const path = readData("never-turns.json");
  const product = readData("foxfire.json");
  assert.equal(idle.verdict, "kindled");
  assert.equal(seeded.verdict, "painted");
  assert.notEqual(idle.verdict, seeded.verdict);
  assert.equal(score(seedKindled()), "kindled");
  assert.equal(score(readData("painted.json")), "painted");
  assert.equal(kindled.turnStarted, true);
  assert.equal(kindled.kindled, true);
  assert.equal(scoreGate(kindled).verdict, "kindled");
  assert.equal(painted.remoteMessage, REMOTE_MESSAGE);
  assert.equal(painted.paintLagSeconds, PAINT_LAG_SECONDS);
  assert.equal(painted.composerPaint, true);
  assert.equal(painted.noTranscript, true);
  assert.equal(classify(painted), "painted");
  assert.equal(path.paths.length, 3);
  assert.match(path.paths[0].rule, /Stop hooks/);
  assert.match(path.paths[2].result, /never-turns/);
  assert.equal(classify(path), "never-turns");
  assert.equal(classify(product), "foxfire");
  assert.equal(painted.issue, 93502);
  assert.equal(painted.sessionIdle, true);
});

test("chips include idle, seeded, path, and walk", () => {
  assert.ok(CHIPS.includes("kindled"));
  assert.ok(CHIPS.includes("painted"));
  assert.ok(CHIPS.includes("foxfire"));
  assert.ok(CHIPS.includes("never-turns"));
  assert.ok(CHIPS.includes("chips"));
  assert.ok(CHIPS.includes("fingerprints"));
  assert.ok(CHIPS.includes("walk"));
  assert.ok(ALARM.includes("painted"));
  assert.ok(ALARM.includes("never-turns"));
  assert.ok(VERDICTS.includes("walk"));
  assert.equal(classify({ seed: "chips", preferSeed: true }), "chips");
  assert.equal(classify({ seed: "fingerprints", preferSeed: true }), "fingerprints");
  assert.equal(classify({ seed: "walk", preferSeed: true }), "walk");
});

test("published foxfire walk scores painted after the idle hold", () => {
  const lantern = scoreWalk({ rows: FOXFIRE_WALK });
  assert.equal(lantern.verdict, "painted");
  assert.ok(lantern.paintedCount >= 1);
  const idle = lantern.rows.find((row) => row.event === "cue-kindled");
  assert.equal(idle.kindled, true);
  assert.equal(idle.verdict, "kindled");
  const stop = lantern.rows.find((row) => row.event === "stop-clean");
  assert.equal(stop.stopClean, true);
  const remote = lantern.rows.find((row) => row.event === "remote-submit");
  assert.equal(remote.painted, true);
  const paint = lantern.rows.find((row) => row.event === "painted-composer");
  assert.equal(paint.composerPaint, true);
  const peat = lantern.rows.find((row) => row.event === "no-transcript");
  assert.equal(peat.noTranscript, true);
  const mist = lantern.rows.find((row) => row.event === "no-queue");
  assert.equal(mist.noQueue, true);
  const path = lantern.rows.find((row) => row.event === "never-turns");
  assert.equal(path.verdict, "never-turns");
});

test("FOXFIRE_WALK constant matches the issue lantern walk", () => {
  assert.equal(FOXFIRE_WALK[0].event, "cue-kindled");
  const paint = FOXFIRE_WALK.find((row) => row.event === "painted-composer");
  assert.equal(paint.composerPaint, true);
  const path = FOXFIRE_WALK.find((row) => row.event === "never-turns");
  assert.equal(path.painted, true);
  const scoreRow = FOXFIRE_WALK.find((row) => row.event === "foxfire");
  assert.equal(scoreRow.painted, true);
});

test("positive control mid-turn enqueue stays kindled", () => {
  const walk = scoreWalk({ rows: POSITIVE_CONTROL_WALK });
  assert.equal(walk.verdict, "kindled");
  const enqueue = walk.rows.find((row) => row.event === "queue-enqueue");
  assert.equal(enqueue.verdict, "kindled");
  const absorb = walk.rows.find((row) => row.event === "absorbed-mid-turn");
  assert.equal(absorb.absorbedMidTurn, true);
  assert.equal(absorb.verdict, "kindled");
});

test("issue constants encode only #93502 published facts", () => {
  assert.equal(FEATURED_ISSUE, 93502);
  assert.ok(ISSUE_URL.includes("93502"));
  assert.match(TITLE, /paints in idle CLI composer/);
  assert.equal(STATE, "OPEN");
  assert.ok(LABELS.includes("bug"));
  assert.ok(LABELS.includes("has repro"));
  assert.ok(LABELS.includes("platform:macos"));
  assert.ok(LABELS.includes("area:tui"));
  assert.equal(AUTHOR, "kschzt");
  assert.equal(FILED, "2026-09-11T01:14:36Z");
  assert.equal(CLAUDE_CODE_VERSION, "2.1.267");
  assert.equal(OS, "macOS");
  assert.equal(CLIENT, "claude.ai/code from another device");
  assert.equal(
    SESSION_KIND,
    "Remote Control attached to an otherwise idle Claude Code CLI after a completed turn",
  );
  assert.equal(REMOTE_MESSAGE, "build the F-831 control");
  assert.equal(ASSISTANT_ENDED, "2026-09-10T21:38:01.662Z");
  assert.equal(HOOK_CONTINUE_AT, "2026-09-10T21:38:02.014Z");
  assert.equal(HOOK_EMPTY_AT, "2026-09-10T21:38:02.195Z");
  assert.equal(STOP_SUMMARY_AT, "2026-09-10T21:38:02.199Z");
  assert.equal(PAINT_AT, "2026-09-10T21:38:03.640Z");
  assert.equal(PAINT_LAG_SECONDS, 1.44);
  assert.equal(QUEUE_ENQUEUE_AT, "2026-09-10T21:47:05.062Z");
  assert.equal(ABSORBED_AT, "2026-09-10T21:47:17.234Z");
  assert.equal(ABSORB_SECONDS, 12.172);
  assert.equal(ABSORB_REASON, "absorbed_mid_turn");
  assert.equal(LANTERN_STATIONS.length, 4);
  assert.ok(FINGERPRINT_LINES.includes("never-turns"));
  assert.ok(FINGERPRINT_LINES.includes("painted"));
  assert.match(PHRASE, /score foxfire or admit kindled/);
});

test("has-repro fingerprints encode the published idle paint stall", () => {
  const result = handle(readData("painted.json"));
  assert.equal(result.published.claudeCodeVersion, "2.1.267");
  assert.equal(result.published.author, "kschzt");
  assert.equal(
    result.published.sessionKind,
    "Remote Control attached to an otherwise idle Claude Code CLI after a completed turn",
  );
  assert.equal(result.published.remoteMessage, "build the F-831 control");
  assert.match(
    fingerprint(seedPainted()),
    /painted\|composer=dim\|transcript=none\|queue=none\|turn=idle\|path=never-turns\|cue=painted/,
  );
  assert.equal(classify({ seed: "has-repro", preferSeed: true }), "has-repro");
});

test("forbidden idle list includes recent catalog words including Pentimento and Vinculum", () => {
  const required = [
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
  ];
  for (const word of required) {
    assert.ok(FORBIDDEN_IDLE.includes(word), `missing forbidden idle ${word}`);
  }
});

test("kindled lantern flips painted back when the remote message starts a turn", () => {
  const tape = {
    kindled: true,
    painted: false,
    turnStarted: true,
    transcriptUserRow: true,
    queueOperation: true,
    neverTurns: false,
    cue: "kindled",
  };
  assert.equal(scoreGate(tape).verdict, "kindled");
  tape.kindled = false;
  tape.painted = true;
  tape.composerPaint = true;
  tape.noTranscript = true;
  tape.noQueue = true;
  tape.neverTurns = true;
  tape.sessionIdle = true;
  tape.turnStarted = false;
  tape.cue = "painted";
  assert.equal(scoreGate(tape).verdict, "painted");
  tape.kindled = true;
  tape.painted = false;
  tape.composerPaint = false;
  tape.noTranscript = false;
  tape.noQueue = false;
  tape.neverTurns = false;
  tape.sessionIdle = false;
  tape.turnStarted = true;
  tape.transcriptUserRow = true;
  tape.cue = "kindled";
  assert.equal(scoreGate(tape).verdict, "kindled");
});

test("composer, transcript, queue, turn, and lantern mark painted after idle remote submit", () => {
  const idle = inspectComposer({ kindled: true, turnStarted: true, transcriptUserRow: true });
  assert.equal(idle.stamp, "kindled");
  assert.equal(idle.live, true);
  const composer = inspectComposer({
    painted: true,
    composerPaint: true,
    dimComposer: true,
    remoteMessage: REMOTE_MESSAGE,
  });
  assert.equal(composer.stamp, "painted");
  assert.equal(composer.dim, true);
  const transcript = inspectTranscript({
    painted: true,
    noTranscript: true,
    transcriptUserRow: false,
  });
  assert.equal(transcript.stamp, "painted");
  assert.equal(transcript.missing, true);
  const queue = inspectQueue({
    painted: true,
    noQueue: true,
    queueOperation: false,
  });
  assert.equal(queue.stamp, "painted");
  assert.equal(queue.missing, true);
  const turn = inspectTurn({
    painted: true,
    neverTurns: true,
    sessionIdle: true,
    turnStarted: false,
  });
  assert.equal(turn.stamp, "painted");
  assert.equal(turn.idle, true);
  const hooks = inspectHooks({
    stopClean: true,
    continueTrue: true,
    preventedFalse: true,
  });
  assert.equal(hooks.clean, true);
  const lantern = readLantern({
    painted: true,
    composerPaint: true,
    noTranscript: true,
    noQueue: true,
    neverTurns: true,
    sessionIdle: true,
  });
  assert.equal(lantern.painted, true);
  assert.equal(lantern.mark, "painted");
  const calm = readLantern({
    kindled: true,
    painted: false,
    turnStarted: true,
    transcriptUserRow: true,
    queueOperation: true,
  });
  assert.equal(calm.painted, false);
  assert.equal(calm.mark, "kindled");
});

test("cousins are cite-only; products stay distinct; backups stay data-only", () => {
  assert.equal(COUSINS.length, 9);
  assert.equal(COUSINS[0].issue, 78177);
  assert.equal(COUSINS[1].issue, 51267);
  assert.equal(COUSINS[2].issue, 93288);
  assert.equal(COUSINS[3].issue, 92596);
  assert.equal(COUSINS[4].issue, 92694);
  assert.equal(COUSINS[5].issue, 90881);
  assert.equal(COUSINS[6].issue, 93012);
  assert.equal(COUSINS[7].issue, 92966);
  assert.equal(COUSINS[8].issue, 92249);
  assert.ok(COUSINS.every((row) => row.citeOnly === true));
  assert.ok(NOT_PRODUCTS.includes("pentimento"));
  assert.ok(NOT_PRODUCTS.includes("vinculum"));
  assert.ok(NOT_PRODUCTS.includes("cachet"));
  assert.ok(NOT_PRODUCTS.includes("pontoon"));
  assert.ok(NOT_PRODUCTS.includes("afterimage"));
  assert.ok(NOT_PRODUCTS.includes("espagnolette"));
  assert.ok(NOT_PRODUCTS.includes("trompe"));
  assert.ok(NOT_PRODUCTS.includes("diplopia"));
  assert.ok(NOT_PRODUCTS.includes("shibboleth"));
  assert.ok(NOT_PRODUCTS.includes("deadlight"));
  assert.ok(NOT_PRODUCTS.includes("procrustes"));
  assert.equal(BACKUPS.length, 8);
  assert.equal(BACKUPS[0].issue, 93458);
  assert.equal(BACKUPS[1].issue, 93475);
  assert.equal(BACKUPS[2].issue, 93439);
  assert.equal(BACKUPS[3].issue, 93438);
  assert.equal(BACKUPS[4].issue, 93466);
  assert.equal(BACKUPS[5].issue, 93495);
  assert.equal(BACKUPS[6].issue, 93469);
  assert.equal(BACKUPS[7].issue, 93474);
  assert.ok(BACKUPS.every((row) => row.citeOnly === true));
  assert.equal(classify({ seed: "cousins", preferSeed: true }), "cousins");
  assert.equal(classify({ seed: "backups", preferSeed: true }), "backups");
});

test("CLI scores fixtures without a server", () => {
  const idle = spawnSync(process.execPath, [modelPath()], { encoding: "utf8" });
  const seeded = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/painted.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(idle.status, 0, idle.stderr);
  assert.equal(seeded.status, 0, seeded.stderr);
  assert.equal(JSON.parse(idle.stdout).verdict, "kindled");
  assert.equal(JSON.parse(seeded.stdout).verdict, "painted");
});

test("handle exposes published hypothesis and #93502 headline", () => {
  const result = handle(readData("painted.json"));
  assert.equal(result.published.issue, 93502);
  assert.equal(result.published.claudeCodeVersion, "2.1.267");
  assert.equal(result.published.author, "kschzt");
  assert.deepEqual(result.published.cousins, [
    78177, 51267, 93288, 92596, 92694, 90881, 93012, 92966, 92249,
  ]);
  assert.ok(result.published.backups.includes(93458));
  assert.ok(result.published.backups.includes(93495));
  assert.ok(result.published.backups.includes(93469));
  assert.ok(result.published.backups.includes(93474));
  assert.match(result.published.hypothesis, /paint PTY composer/);
  assert.match(result.published.hypothesis, /NON-BINDING/);
});

test("model has no static node: imports so the living page can score in-browser", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /^import .* from "node:/m);
  assert.match(source, /import\("node:fs"\)/);
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
});

test("living page is a marsh foxfire booth, not an atelier or chain-forge", () => {
  const page = readPage();
  assert.match(page, /Eczar/);
  assert.match(page, /Work Sans/);
  assert.match(page, /Inconsolata/);
  assert.match(page, /foxfire|marsh|peat|lantern|biolumines/i);
  assert.match(page, /#0e1a14|#2a3428|#7CFF9A|#3DFF8A|#a8c4b0|#c9e8d4|#06100c/i);
  assert.match(page, /\bkindled\b/);
  assert.match(page, /painted/);
  assert.match(page, /never-turns/);
  assert.match(page, /score foxfire or admit kindled/i);
  assert.match(page, /cousin-not-primary/);
  assert.match(page, /11:50/);
  assert.match(page, /#283/);
  assert.match(page, /#93502/);
  assert.match(page, /kschzt/);
  assert.match(page, /2\.1\.267/);
  assert.match(page, /F-831/);
  assert.match(page, /Remote Control/);
  assert.match(page, /Kindle the lantern/);
  assert.match(page, /Score foxfire/);
  assert.match(page, /Sweep the mist/);
  assert.match(page, /Compare lantern \/ peat/);
  assert.match(page, /Pin idle kindled/);
  assert.match(page, /Pin seeded painted/);
  assert.match(page, /Pin never-turns/);
  assert.match(page, /Clear the lantern/);
  assert.doesNotMatch(page, /Fraunces/);
  assert.doesNotMatch(page, /Source Sans 3/);
  assert.doesNotMatch(page, /IBM Plex Mono/);
  assert.doesNotMatch(page, /Libre Baskerville/);
  assert.doesNotMatch(page, /Karla/);
  assert.doesNotMatch(page, /Source Code Pro/);
  assert.doesNotMatch(page, /Cormorant Infant/);
  assert.doesNotMatch(page, /Figtree/);
  assert.doesNotMatch(page, /Newsreader/);
  assert.doesNotMatch(page, /Red Hat Mono/);
  assert.doesNotMatch(page, /Outfit/);
  assert.doesNotMatch(page, /Space Mono/);
  assert.doesNotMatch(page, /Source Serif 4/);
  assert.doesNotMatch(page, /Alegreya/);
  assert.doesNotMatch(page, /Cormorant Garamond/);
  assert.doesNotMatch(page, /Nunito Sans/);
  assert.doesNotMatch(page, /JetBrains Mono/);
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
  assert.doesNotMatch(page, /hangar beacon|flash capacitor|cheque-counter|camera-lucida atelier|culture dish|pulse-damper|earthwork fosse|wax-cachet blotter|chain-forge|nlink gauge|underpainting atelier|stretcher bars/i);
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
  assert.doesNotMatch(page, /\baccreted\b/);
  assert.match(page, /NOT Pentimento/i);
  assert.match(page, /NOT Vinculum/i);
  assert.match(page, /NOT Cachet/i);
  assert.match(page, /NOT Pontoon/i);
  assert.match(page, /NOT Afterimage/i);
  assert.match(page, /NOT Espagnolette/i);
  assert.match(page, /NOT Trompe/i);
  assert.match(page, /NOT Diplopia/i);
  assert.match(page, /NOT Shibboleth/i);
  assert.match(page, /NOT Deadlight/i);
});

test("README states the thesis, anti-clone, and how to score", () => {
  const readme = readReadme();
  assert.match(readme, /Foxfire/);
  assert.match(readme, /#93502/);
  assert.match(readme, /\bkindled\b/);
  assert.match(readme, /painted/);
  assert.match(readme, /never-turns/);
  assert.match(readme, /Eczar/);
  assert.match(readme, /Work Sans/);
  assert.match(readme, /Inconsolata/);
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /NOT Pentimento/i);
  assert.match(readme, /NOT Vinculum/i);
  assert.match(readme, /NOT Cachet/i);
  assert.match(readme, /NOT Pontoon/i);
  assert.match(readme, /NOT Afterimage/i);
  assert.match(readme, /NOT Espagnolette/i);
  assert.match(readme, /NOT Trompe/i);
  assert.match(readme, /NOT Diplopia/i);
  assert.match(readme, /NOT Shibboleth/i);
  assert.match(readme, /NOT Deadlight/i);
  assert.match(readme, /2\.1\.267/);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/foxfire/);
  assert.match(readme, /node --test projects\/foxfire\/foxfire\.test\.mjs/);
  assert.match(readme, /NON-BINDING/);
  assert.match(readme, /paint PTY composer|biolumines|marsh/i);
  assert.match(readme, /#78177/);
  assert.match(readme, /#51267/);
  assert.match(readme, /#93288/);
  assert.match(readme, /Remote Control/);
});

test("catalog features Foxfire only; Pentimento unfeatured", () => {
  const catalog = readCatalog();
  const hub = readHubCatalog();
  assert.equal(catalog.products.length, 283);
  assert.equal(hub.products.length, 283);
  assert.equal(catalog.products[0].name, "Foxfire");
  assert.equal(catalog.products[0].slug, "foxfire");
  assert.equal(catalog.products[0].featured, true);
  assert.equal(catalog.products[0].href, "/foxfire/");
  assert.equal(catalog.products[0].day, "2026-09-11");
  assert.match(catalog.products[0].summary, /11:50/);
  assert.match(catalog.products[0].summary, /foxfire/);
  assert.match(catalog.products[0].summary, /#93502/);
  assert.match(catalog.products[0].summary, /\bkindled\b/);
  assert.match(catalog.products[0].summary, /painted/);
  assert.match(catalog.products[0].summary, /never-turns/);
  assert.equal(hub.products[0].slug, "foxfire");
  assert.equal(hub.products[0].featured, true);
  const pentimento = catalog.products.find((row) => row.slug === "pentimento");
  assert.ok(pentimento);
  assert.equal(pentimento.featured, false);
  const vinculum = catalog.products.find((row) => row.slug === "vinculum");
  assert.ok(vinculum);
  assert.equal(vinculum.featured, false);
  const cachet = catalog.products.find((row) => row.slug === "cachet");
  assert.ok(cachet);
  assert.equal(cachet.featured, false);
  assert.equal(catalog.products.filter((row) => row.featured).length, 1);
  assert.equal(catalog.products.filter((row) => row.slug === "foxfire").length, 1);
  assert.ok(!catalog.products.some((row) => String(row.summary || "").includes("93502") && row.slug !== "foxfire"));
});

test("vercel rewrites foxfire to the project folder at the top", () => {
  const vercel = readVercel();
  assert.equal(vercel.rewrites[0].source, "/foxfire");
  assert.equal(vercel.rewrites[0].destination, "/projects/foxfire");
  assert.equal(vercel.rewrites[1].source, "/foxfire/");
  assert.equal(vercel.rewrites[1].destination, "/projects/foxfire");
  assert.equal(vercel.rewrites[2].source, "/foxfire/:path*");
  assert.equal(vercel.rewrites[2].destination, "/projects/foxfire/:path*");
});

test("no network calls in the model or tests", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /\bcurl\b/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
  assert.doesNotMatch(source, /https?:\/\/[^\s"']*anthropic\.com\/v1/);
});
