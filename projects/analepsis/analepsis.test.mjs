import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ALARM,
  ANALEPSIS_WALK,
  BACKUPS,
  CHIPS,
  CLAUDE_CODE_VERSION,
  CLIENT,
  COUSINS,
  DESKTOP_BUILD,
  DISTRIBUTION,
  FEATURED_ISSUE,
  FINGERPRINT_LINES,
  FLASHBACK_END,
  FLASHBACK_ENTRY_END,
  FLASHBACK_ENTRY_START,
  FLASHBACK_START,
  FORBIDDEN_IDLE,
  FORBIDDEN_SEED,
  HOLD,
  IDLE_WORD,
  ISSUE_URL,
  LABELS,
  LISTENER_WARN,
  MARKER_STRING,
  MARKER_SUBTYPE,
  MARKER_TYPE,
  MODEL,
  MOVED_ROWS,
  NOT_PRODUCTS,
  OS,
  PATH_WORD,
  PHRASE,
  PLATFORM,
  POSITIVE_CONTROL_WALK,
  PRESENT_END,
  PRODUCT_WORD,
  QUIRE_STATIONS,
  REDELIVERED_BLOCK_END,
  RENDERED_ENTRIES,
  SAMPLE_DISK,
  SAMPLE_FEED,
  SAMPLE_LOG,
  SAMPLE_MARKER,
  SAMPLE_TREE,
  SEEDED_WORD,
  SESSION_ID,
  SESSION_KIND,
  SOURCE_EVENT,
  SOURCE_TIME,
  STATE,
  STREAM_ROWS,
  TITLE,
  TRANSCRIPT_PAGE_START,
  VERDICTS,
  analyze,
  classify,
  collateQuires,
  decide,
  emptyTicket,
  fingerprint,
  handle,
  inspectDisk,
  inspectFeed,
  inspectLog,
  inspectMarker,
  inspectTree,
  score,
  scoreGate,
  scoreWalk,
  seedAnalepsis,
  seedCompactThenIdle,
  seedDiskIntact,
  seedFeedBottomEarly,
  seedHold,
  seedIpcOnly,
  seedMainProcessBuilt,
  seedMarkerMisorder,
  seedMarkerNoStamp,
  seedMidTurnUnfocus,
  seedMovedNotCopied,
  seedNoUuidDup,
  seedNotCli,
  seedOrdered,
  seedPopoutInherited,
  seedRedelivered,
  seedReloadFixes,
  seedSourcePreCompact,
  seedTreeSpliced,
  seedWorkingStuck,
} from "./analepsis.mjs";

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
  return fileURLToPath(new URL("./analepsis.mjs", import.meta.url));
}

test("idle ordered is a hold; disk, tree, and feed agree on chronology", () => {
  const result = analyze(seedOrdered());
  assert.equal(result.verdict, "ordered");
  assert.equal(result.idleWord, "ordered");
  assert.equal(IDLE_WORD, "ordered");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.ordered, true);
  assert.equal(result.phrase, "admit ordered");
  assert.equal(result.redelivered, false);
  assert.equal(result.markerMisorder, false);
  assert.equal(result.diskIntact, true);
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(result.idleWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("empty ticket and empty stdin classify ordered", () => {
  assert.equal(classify(emptyTicket()), "ordered");
  assert.equal(classify(""), "ordered");
  assert.equal(classify(null), "ordered");
  assert.equal(decide({}), "ordered");
});

test("#93569 seeded path scores redelivered when the tree is spliced after the marker", () => {
  const result = analyze(seedRedelivered());
  assert.equal(result.verdict, "redelivered");
  assert.equal(result.seededWord, "redelivered");
  assert.equal(SEEDED_WORD, "redelivered");
  assert.equal(PRODUCT_WORD, "analepsis");
  assert.equal(result.hold, false);
  assert.equal(result.alarm, true);
  assert.equal(result.redelivered, true);
  assert.equal(result.phrase, "score analepsis");
  assert.equal(result.treeSpliced, true);
  assert.equal(result.feedBottomEarly, true);
  assert.equal(result.workingStuck, true);
  assert.equal(result.movedNotCopied, true);
  assert.equal(result.markerPresent, true);
  assert.equal(result.markerMisorder, true);
  assert.equal(result.sourcePreCompact, true);
  for (const word of FORBIDDEN_SEED) {
    assert.notEqual(result.seededWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("tree splice plus early feed bottom is the #93569 analepsis", () => {
  const tree = inspectTree({ tree: SAMPLE_TREE });
  assert.equal(tree.stamp, "flashback");
  assert.equal(tree.spliced, true);
  assert.equal(tree.movedNotCopied, true);
  assert.equal(tree.lastBefore, "22:30:16");
  assert.equal(tree.firstAfter, "18:32:26");
  const scored = scoreGate({
    redelivered: true,
    treeSpliced: true,
    feedBottomEarly: true,
    workingStuck: true,
    markerPresent: true,
    markerMisorder: true,
    cue: "redelivered",
    tree: SAMPLE_TREE,
    feed: SAMPLE_FEED,
  });
  assert.equal(scored.verdict, "redelivered");
  assert.equal(scored.markerMisorder, true);
  const calm = inspectDisk({ disk: SAMPLE_DISK, diskIntact: true });
  assert.equal(calm.stamp, "chronological");
});

test("path word is marker-misorder; named path seed holds the path", () => {
  assert.equal(PATH_WORD, "marker-misorder");
  const result = analyze(seedMarkerMisorder());
  assert.equal(result.verdict, "marker-misorder");
  assert.equal(result.pathWord, "marker-misorder");
  assert.equal(result.hold, false);
  assert.equal(
    classify({ seed: "marker-misorder", preferSeed: true, redelivered: true }),
    "marker-misorder",
  );
  assert.equal(classify(seedTreeSpliced()), "tree-spliced");
});

test("HOLD includes ordered / hold", () => {
  assert.ok(HOLD.includes("ordered"));
  assert.ok(HOLD.includes("hold"));
  const hold = analyze(seedHold());
  assert.equal(hold.verdict, "hold");
  assert.equal(hold.hold, true);
  assert.equal(classify({ seed: "hold", preferSeed: true }), "hold");
});

test("alarm chips: tree-spliced, feed-bottom-early, working-stuck, marker-no-stamp", () => {
  assert.equal(classify(seedDiskIntact()), "disk-intact");
  assert.equal(classify(seedTreeSpliced()), "tree-spliced");
  assert.equal(classify(seedFeedBottomEarly()), "feed-bottom-early");
  assert.equal(classify(seedWorkingStuck()), "working-stuck");
  assert.equal(classify(seedMovedNotCopied()), "moved-not-copied");
  assert.equal(classify(seedNoUuidDup()), "no-uuid-dup");
  assert.equal(classify(seedMarkerNoStamp()), "marker-no-stamp");
  assert.equal(classify(seedSourcePreCompact()), "source-pre-compact");
  assert.equal(classify(seedMainProcessBuilt()), "main-process-built");
  assert.equal(classify(seedNotCli()), "not-cli");
  assert.equal(classify(seedReloadFixes()), "reload-fixes");
  assert.equal(classify(seedPopoutInherited()), "popout-inherited");
  assert.equal(classify(seedIpcOnly()), "ipc-only");
  assert.equal(classify(seedCompactThenIdle()), "compact-then-idle");
  assert.equal(classify(seedMidTurnUnfocus()), "mid-turn-unfocus");
  assert.equal(classify(seedAnalepsis()), "analepsis");
});

test("booth fixtures flip ordered vs redelivered vs marker-misorder vs analepsis", () => {
  const idle = scoreGate(seedOrdered());
  const seeded = scoreGate(readData("redelivered.json"));
  const ordered = readData("ordered.json");
  const redelivered = readData("redelivered.json");
  const path = readData("marker-misorder.json");
  const product = readData("analepsis.json");
  const disk = readData("disk-transcript.json");
  const tree = readData("react-tree.json");
  const feed = readData("rendered-feed.json");
  const marker = readData("marker.json");
  const stuck = readData("working-stuck.json");
  const moved = readData("moved-not-copied.json");
  assert.equal(idle.verdict, "ordered");
  assert.equal(seeded.verdict, "redelivered");
  assert.notEqual(idle.verdict, seeded.verdict);
  assert.equal(score(seedOrdered()), "ordered");
  assert.equal(score(readData("redelivered.json")), "redelivered");
  assert.equal(ordered.diskIntact, true);
  assert.equal(ordered.ordered, true);
  assert.equal(scoreGate(ordered).verdict, "ordered");
  assert.equal(redelivered.treeSpliced, true);
  assert.equal(redelivered.feedBottomEarly, true);
  assert.equal(redelivered.markerPresent, true);
  assert.equal(classify(redelivered), "redelivered");
  assert.equal(path.paths.length, 3);
  assert.match(path.paths[0].rule, /background_tasks_redelivered/);
  assert.match(path.paths[2].result, /moved, not duplicated/);
  assert.equal(classify(path), "marker-misorder");
  assert.equal(classify(product), "analepsis");
  assert.equal(product.hubCount, "ANALEPSIS");
  assert.equal(redelivered.issue, 93569);
  assert.equal(redelivered.redelivered, true);
  assert.equal(classify(disk), "disk-intact");
  assert.equal(disk.disk[disk.disk.length - 1].ts, "22:30:16");
  assert.equal(classify(tree), "tree-spliced");
  assert.equal(tree.movedRows, 477);
  assert.equal(classify(feed), "feed-bottom-early");
  assert.equal(classify(marker), "marker-no-stamp");
  assert.equal(marker.marker.subtype, "background_tasks_redelivered");
  assert.equal(classify(stuck), "working-stuck");
  assert.equal(classify(moved), "moved-not-copied");
});

test("chips include idle, seeded, path, and walk", () => {
  assert.ok(CHIPS.includes("ordered"));
  assert.ok(CHIPS.includes("redelivered"));
  assert.ok(CHIPS.includes("analepsis"));
  assert.ok(CHIPS.includes("marker-misorder"));
  assert.ok(CHIPS.includes("chips"));
  assert.ok(CHIPS.includes("fingerprints"));
  assert.ok(CHIPS.includes("walk"));
  assert.ok(ALARM.includes("redelivered"));
  assert.ok(ALARM.includes("marker-misorder"));
  assert.ok(VERDICTS.includes("walk"));
  assert.equal(classify({ seed: "chips", preferSeed: true }), "chips");
  assert.equal(classify({ seed: "fingerprints", preferSeed: true }), "fingerprints");
  assert.equal(classify({ seed: "walk", preferSeed: true }), "walk");
});

test("published analepsis walk scores redelivered after the idle hold", () => {
  const quires = scoreWalk({ rows: ANALEPSIS_WALK });
  assert.equal(quires.verdict, "redelivered");
  assert.ok(quires.redeliveredCount >= 1);
  const idle = quires.rows.find((row) => row.event === "cue-ordered");
  assert.equal(idle.ordered, true);
  assert.equal(idle.verdict, "ordered");
  const splice = quires.rows.find((row) => row.event === "tree-spliced");
  assert.equal(splice.treeSpliced, true);
  const path = quires.rows.find((row) => row.event === "marker-misorder");
  assert.equal(path.verdict, "marker-misorder");
});

test("ANALEPSIS_WALK constant matches the issue collation walk", () => {
  assert.equal(ANALEPSIS_WALK[0].event, "cue-ordered");
  const splice = ANALEPSIS_WALK.find((row) => row.event === "marker-splice");
  assert.equal(splice.markerPresent, true);
  const path = ANALEPSIS_WALK.find((row) => row.event === "marker-misorder");
  assert.equal(path.redelivered, true);
  const scoreRow = ANALEPSIS_WALK.find((row) => row.event === "analepsis");
  assert.equal(scoreRow.redelivered, true);
});

test("positive control reload-fixes stays ordered", () => {
  const walk = scoreWalk({ rows: POSITIVE_CONTROL_WALK });
  assert.equal(walk.verdict, "ordered");
  const reload = walk.rows.find((row) => row.event === "reload-fixes");
  assert.equal(reload.verdict, "ordered");
  const disk = walk.rows.find((row) => row.event === "disk-intact");
  assert.equal(disk.diskIntact, true);
  assert.equal(disk.verdict, "ordered");
});

test("issue constants encode only #93569 published facts", () => {
  assert.equal(FEATURED_ISSUE, 93569);
  assert.ok(ISSUE_URL.includes("93569"));
  assert.match(TITLE, /background_tasks_redelivered/);
  assert.match(TITLE, /hours earlier/);
  assert.equal(STATE, "OPEN");
  assert.ok(LABELS.includes("bug"));
  assert.ok(LABELS.includes("has repro"));
  assert.ok(LABELS.includes("platform:macos"));
  assert.ok(LABELS.includes("area:desktop"));
  assert.equal(CLAUDE_CODE_VERSION, "2.1.260");
  assert.equal(OS, "macOS");
  assert.equal(CLIENT, "Desktop Code tab");
  assert.match(DESKTOP_BUILD, /1\.49585\.0/);
  assert.equal(MODEL, "Opus");
  assert.equal(PLATFORM, "Anthropic API");
  assert.equal(SESSION_ID, "local_09ef21f1");
  assert.equal(STREAM_ROWS, 4438);
  assert.equal(MOVED_ROWS, 477);
  assert.equal(RENDERED_ENTRIES, 161);
  assert.equal(FLASHBACK_ENTRY_START, 145);
  assert.equal(FLASHBACK_ENTRY_END, 160);
  assert.equal(PRESENT_END, "22:30:16");
  assert.equal(FLASHBACK_START, "18:32:26");
  assert.equal(FLASHBACK_END, "19:24:37");
  assert.equal(MARKER_SUBTYPE, "background_tasks_redelivered");
  assert.equal(MARKER_TYPE, "system");
  assert.equal(SOURCE_EVENT, "background_tasks_changed");
  assert.equal(SOURCE_TIME, "17:01:26");
  assert.equal(TRANSCRIPT_PAGE_START, "19:24:37.438");
  assert.equal(REDELIVERED_BLOCK_END, "19:24:37.435");
  assert.equal(LISTENER_WARN, 11);
  assert.equal(MARKER_STRING, "background_tasks_redelivered");
  assert.match(DISTRIBUTION, /2\.1\.260/);
  assert.match(SESSION_KIND, /background_tasks_redelivered/);
  assert.equal(QUIRE_STATIONS.length, 5);
  assert.ok(FINGERPRINT_LINES.includes("marker-misorder"));
  assert.ok(FINGERPRINT_LINES.includes("redelivered"));
  assert.match(PHRASE, /Score analepsis or admit ordered/);
  assert.equal(SAMPLE_DISK[SAMPLE_DISK.length - 1].ts, "22:30:16");
  assert.equal(SAMPLE_TREE.find((row) => row.subtype).subtype, MARKER_SUBTYPE);
  assert.equal(SAMPLE_FEED[SAMPLE_FEED.length - 1].kind, "task_notification");
  assert.ok(SAMPLE_LOG.some((row) => /22:58/.test(row.t)));
  assert.equal(SAMPLE_MARKER.inCliBinary, false);
});

test("has-repro fingerprints encode the published flashback splice", () => {
  const result = handle(readData("redelivered.json"));
  assert.equal(result.published.claudeCodeVersion, "2.1.260");
  assert.match(result.published.sessionKind, /background_tasks_redelivered/);
  assert.equal(result.published.markerSubtype, "background_tasks_redelivered");
  assert.match(
    fingerprint(seedRedelivered()),
    /redelivered\|disk=chronological\|tree=flashback\|feed=past\|quill=stuck\|gutter=splice\|path=marker-misorder\|cue=marker-misorder/,
  );
  assert.equal(classify({ seed: "has-repro", preferSeed: true }), "has-repro");
});

test("forbidden idle list includes recent catalog words including Monstrance and Compline", () => {
  const required = [
    "viewed",
    "withheld",
    "monstrance",
    "phantom-deny",
    "compline",
    "lingering",
    "unrung",
    "closed",
    "sealed",
    "blanked",
    "cipherlock",
    "concurrent-write",
    "untainted",
    "attainted",
    "attainder",
    "voiced",
    "muted",
    "sourdine",
    "kindled",
    "painted",
    "foxfire",
    "lodged",
    "dropped",
    "forksink",
    "flushed",
    "lagged",
    "pentimento",
    "solitary",
    "twinlinked",
    "vinculum",
    "hit",
    "flattened",
    "cachet",
    "washed",
    "pontoon",
    "quietus",
    "reaped",
    "revenant",
    "hawser",
    "imprimatur",
    "ukase",
    "understudy",
    "fetch",
  ];
  for (const word of required) {
    assert.ok(FORBIDDEN_IDLE.includes(word), `missing forbidden idle ${word}`);
  }
});

test("ordered gathering flips redelivered back when the tree is restacked", () => {
  const tape = {
    ordered: true,
    redelivered: false,
    diskIntact: true,
    treeSpliced: false,
    cue: "ordered",
  };
  assert.equal(scoreGate(tape).verdict, "ordered");
  tape.ordered = false;
  tape.redelivered = true;
  tape.treeSpliced = true;
  tape.feedBottomEarly = true;
  tape.workingStuck = true;
  tape.cue = "redelivered";
  assert.equal(scoreGate(tape).verdict, "redelivered");
  tape.ordered = true;
  tape.redelivered = false;
  tape.treeSpliced = false;
  tape.feedBottomEarly = false;
  tape.workingStuck = false;
  tape.cue = "ordered";
  assert.equal(scoreGate(tape).verdict, "ordered");
});

test("disk, tree, feed, log, marker, and collateQuires mark the flashback splice", () => {
  const idle = inspectDisk({ ordered: true, diskIntact: true, disk: SAMPLE_DISK });
  assert.equal(idle.stamp, "chronological");
  const tree = inspectTree({ redelivered: true, tree: SAMPLE_TREE });
  assert.equal(tree.stamp, "flashback");
  assert.equal(tree.spliced, true);
  const feed = inspectFeed({ feed: SAMPLE_FEED });
  assert.equal(feed.stamp, "past");
  assert.equal(feed.workingStuck, true);
  const log = inspectLog({ log: SAMPLE_LOG });
  assert.equal(log.lateWarm, true);
  assert.equal(log.compact, true);
  const marker = inspectMarker({ marker: SAMPLE_MARKER });
  assert.equal(marker.stamp, "splice");
  assert.equal(marker.missingUuid, true);
  assert.equal(marker.missingTimestamp, true);
  assert.equal(marker.notCli, true);
  const quires = collateQuires({
    redelivered: true,
    treeSpliced: true,
    feedBottomEarly: true,
    tree: SAMPLE_TREE,
    feed: SAMPLE_FEED,
    marker: SAMPLE_MARKER,
  });
  assert.equal(quires.redelivered, true);
  assert.equal(quires.mark, "redelivered");
  const calm = collateQuires({
    ordered: true,
    redelivered: false,
    diskIntact: true,
    treeSpliced: false,
    disk: SAMPLE_DISK,
    tree: SAMPLE_DISK,
  });
  assert.equal(calm.redelivered, false);
  assert.equal(calm.mark, "ordered");
});

test("cousins are cite-only; products stay distinct; backups stay data-only", () => {
  assert.equal(COUSINS.length, 6);
  assert.equal(COUSINS[0].issue, 92197);
  assert.equal(COUSINS[1].issue, 92089);
  assert.equal(COUSINS[2].issue, 88428);
  assert.equal(COUSINS[3].issue, 84858);
  assert.equal(COUSINS[4].issue, 83247);
  assert.equal(COUSINS[5].issue, 92610);
  assert.ok(COUSINS.every((row) => row.citeOnly === true));
  assert.ok(NOT_PRODUCTS.includes("monstrance"));
  assert.ok(NOT_PRODUCTS.includes("compline"));
  assert.ok(NOT_PRODUCTS.includes("cipherlock"));
  assert.ok(NOT_PRODUCTS.includes("attainder"));
  assert.ok(NOT_PRODUCTS.includes("sourdine"));
  assert.ok(NOT_PRODUCTS.includes("forksink"));
  assert.ok(NOT_PRODUCTS.includes("foxfire"));
  assert.ok(NOT_PRODUCTS.includes("pentimento"));
  assert.ok(NOT_PRODUCTS.includes("vinculum"));
  assert.ok(NOT_PRODUCTS.includes("pontoon"));
  assert.ok(NOT_PRODUCTS.includes("quietus"));
  assert.ok(NOT_PRODUCTS.includes("imprimatur"));
  assert.ok(NOT_PRODUCTS.includes("ukase"));
  assert.ok(NOT_PRODUCTS.includes("understudy"));
  assert.ok(NOT_PRODUCTS.includes("fetch"));
  assert.equal(BACKUPS.length, 7);
  assert.equal(BACKUPS[0].issue, 93574);
  assert.equal(BACKUPS[1].issue, 93576);
  assert.equal(BACKUPS[6].issue, 93570);
  assert.ok(BACKUPS.every((row) => row.citeOnly === true));
  assert.equal(classify({ seed: "cousins", preferSeed: true }), "cousins");
  assert.equal(classify({ seed: "backups", preferSeed: true }), "backups");
});

test("CLI scores fixtures without a server", () => {
  const idle = spawnSync(process.execPath, [modelPath()], { encoding: "utf8" });
  const seeded = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/redelivered.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(idle.status, 0, idle.stderr);
  assert.equal(seeded.status, 0, seeded.stderr);
  assert.equal(JSON.parse(idle.stdout).verdict, "ordered");
  assert.equal(JSON.parse(seeded.stdout).verdict, "redelivered");
});

test("handle exposes published hypothesis and #93569 headline", () => {
  const result = handle(readData("redelivered.json"));
  assert.equal(result.published.issue, 93569);
  assert.equal(result.published.claudeCodeVersion, "2.1.260");
  assert.deepEqual(result.published.cousins, [
    92197, 92089, 88428, 84858, 83247, 92610,
  ]);
  assert.ok(result.published.backups.includes(93574));
  assert.ok(result.published.backups.includes(93576));
  assert.ok(result.published.backups.includes(93570));
  assert.match(result.published.hypothesis, /background_tasks_redelivered/);
  assert.match(result.published.hypothesis, /NON-BINDING/);
});

test("model has no static node: imports so the living page can score in-browser", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /^import .* from "node:/m);
  assert.match(source, /import\("node:fs"\)/);
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
});

test("living page is a manuscript flashback / collation-desk booth, not sanctuary or cloister", () => {
  const page = readPage();
  assert.match(page, /Libre Baskerville/);
  assert.match(page, /Figtree/);
  assert.match(page, /IBM Plex Mono/);
  assert.match(page, /analepsis|quire|gutter|verso|recto|flashback|vellum/i);
  assert.match(page, /#F3E6CE|#2A1A14|#C17A45|#3E2C38|#6A4556|#9A4034/i);
  assert.match(page, /\bordered\b/);
  assert.match(page, /redelivered/);
  assert.match(page, /marker-misorder/);
  assert.match(page, /Score analepsis or admit ordered/i);
  assert.match(page, /cousin-not-primary/);
  assert.match(page, /18:50/);
  assert.match(page, /#290/);
  assert.match(page, /#93569/);
  assert.match(page, /2\.1\.260/);
  assert.match(page, /1\.49585\.0/);
  assert.match(page, /background_tasks_redelivered/);
  assert.match(page, /Collate the quires/);
  assert.match(page, /Score analepsis/);
  assert.match(page, /Open the splice/);
  assert.match(page, /Compare disk \/ tree/);
  assert.match(page, /Pin idle ordered/);
  assert.match(page, /Pin seeded redelivered/);
  assert.match(page, /Pin marker-misorder/);
  assert.match(page, /Restack the gathering/);
  assert.doesNotMatch(page, /Gilda Display/);
  assert.doesNotMatch(page, /Mulish/);
  assert.doesNotMatch(page, /Anonymous Pro/);
  assert.doesNotMatch(page, /Cinzel/);
  assert.doesNotMatch(page, /Source Sans 3/);
  assert.doesNotMatch(page, /Old Standard TT/);
  assert.doesNotMatch(page, /Public Sans/);
  assert.doesNotMatch(page, /Cormorant Garamond/);
  assert.doesNotMatch(page, /Outfit/);
  assert.doesNotMatch(page, /#140E18/);
  assert.doesNotMatch(page, /#D4A84B/);
  assert.doesNotMatch(page, /#8C6A2F/);
  assert.doesNotMatch(page, /#F4EBD8/);
  assert.doesNotMatch(page, /#8B1E2D/);
  assert.doesNotMatch(page, /#1A1528/);
  assert.doesNotMatch(page, /#E8C872/);
  assert.doesNotMatch(page, /#0E1218/);
  assert.doesNotMatch(page, /#C8A15A/);
  assert.doesNotMatch(page, /sanctuary monstrance|luna glass|gilt rays|altar step|sacristy shelf/i);
  assert.doesNotMatch(page, /bank vault|combination dial|steel door|keycard/i);
  assert.doesNotMatch(page, /municipal|storm-drain|catch-basin|sodium-vapor/i);
  assert.doesNotMatch(page, /concert-hall|practice mute|brass mute|velvet curtain/i);
  assert.doesNotMatch(page, /parchment bill-of-attainder|wax seal|iron stamp|clerk desk/i);
  assert.doesNotMatch(page, /cloister|choir stall|evening-office|closing bell/i);
  assert.doesNotMatch(page, /hangar beacon|flash capacitor|cheque-counter|camera-lucida atelier|culture dish|pulse-damper|earthwork fosse|wax-cachet blotter|chain-forge|nlink gauge|underpainting atelier|stretcher bars|marsh lantern|peat bank|biolumines|scapegoat altar/i);
  assert.doesNotMatch(page, /\bviewed\b/);
  assert.doesNotMatch(page, /\bwithheld\b/);
  assert.doesNotMatch(page, /\bphantom-deny\b/);
  assert.doesNotMatch(page, /\bsealed\b/);
  assert.doesNotMatch(page, /\bblanked\b/);
  assert.doesNotMatch(page, /\buntainted\b/);
  assert.doesNotMatch(page, /\battainted\b/);
  assert.doesNotMatch(page, /\bvoiced\b/);
  assert.doesNotMatch(page, /\bmuted\b/);
  assert.doesNotMatch(page, /\blingering\b/);
  assert.doesNotMatch(page, /\bunrung\b/);
  assert.match(page, /NOT Monstrance/i);
  assert.match(page, /NOT Compline/i);
  assert.match(page, /NOT Cipherlock/i);
  assert.match(page, /NOT Attainder/i);
  assert.match(page, /NOT Sourdine/i);
  assert.match(page, /NOT Forksink/i);
  assert.match(page, /NOT Foxfire/i);
});

test("README states the thesis, anti-clone, and how to score", () => {
  const readme = readReadme();
  assert.match(readme, /Analepsis/);
  assert.match(readme, /#93569/);
  assert.match(readme, /\bordered\b/);
  assert.match(readme, /redelivered/);
  assert.match(readme, /marker-misorder/);
  assert.match(readme, /Libre Baskerville/);
  assert.match(readme, /Figtree/);
  assert.match(readme, /IBM Plex Mono/);
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /NOT Monstrance/i);
  assert.match(readme, /NOT Compline/i);
  assert.match(readme, /NOT Cipherlock/i);
  assert.match(readme, /NOT Attainder/i);
  assert.match(readme, /NOT Sourdine/i);
  assert.match(readme, /NOT Forksink/i);
  assert.match(readme, /NOT Foxfire/i);
  assert.match(readme, /2\.1\.260/);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/analepsis/);
  assert.match(readme, /node --test projects\/analepsis\/analepsis\.test\.mjs/);
  assert.match(readme, /NON-BINDING/);
  assert.match(readme, /manuscript|flashback|quire|gutter|vellum/i);
  assert.match(readme, /#92197/);
  assert.match(readme, /#92610/);
  assert.match(readme, /background_tasks_redelivered/);
  assert.match(readme, /Score analepsis or admit ordered/);
});

test("catalog features Analepsis only; Monstrance unfeatured", () => {
  const catalog = readCatalog();
  const hub = readHubCatalog();
  assert.equal(catalog.products.length, 290);
  assert.equal(hub.products.length, 290);
  assert.equal(catalog.products[0].name, "Analepsis");
  assert.equal(catalog.products[0].slug, "analepsis");
  assert.equal(catalog.products[0].featured, true);
  assert.equal(catalog.products[0].href, "/analepsis/");
  assert.equal(catalog.products[0].day, "2026-09-11");
  assert.match(catalog.products[0].summary, /18:50/);
  assert.match(catalog.products[0].summary, /analepsis/);
  assert.match(catalog.products[0].summary, /#93569/);
  assert.match(catalog.products[0].summary, /\bordered\b/);
  assert.match(catalog.products[0].summary, /redelivered/);
  assert.match(catalog.products[0].summary, /marker-misorder/);
  assert.equal(hub.products[0].slug, "analepsis");
  assert.equal(hub.products[0].featured, true);
  const monstrance = catalog.products.find((row) => row.slug === "monstrance");
  assert.ok(monstrance);
  assert.equal(monstrance.featured, false);
  const compline = catalog.products.find((row) => row.slug === "compline");
  assert.ok(compline);
  assert.equal(compline.featured, false);
  assert.equal(catalog.products.filter((row) => row.featured).length, 1);
  assert.equal(catalog.products.filter((row) => row.slug === "analepsis").length, 1);
  assert.ok(!catalog.products.some((row) => String(row.summary || "").includes("93569") && row.slug !== "analepsis"));
});

test("vercel rewrites analepsis to the project folder at the top", () => {
  const vercel = readVercel();
  assert.equal(vercel.rewrites[0].source, "/analepsis");
  assert.equal(vercel.rewrites[0].destination, "/projects/analepsis");
  assert.equal(vercel.rewrites[1].source, "/analepsis/");
  assert.equal(vercel.rewrites[1].destination, "/projects/analepsis");
  assert.equal(vercel.rewrites[2].source, "/analepsis/:path*");
  assert.equal(vercel.rewrites[2].destination, "/projects/analepsis/:path*");
});

test("no network calls in the model or tests", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /\bcurl\b/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
  assert.doesNotMatch(source, /https?:\/\/[^\s"']*anthropic\.com\/v1/);
});
