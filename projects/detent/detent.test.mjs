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
  CODE_BUILD_OK,
  CODE_BUILD_STILL,
  COMMAND,
  COUSINS,
  DETENT_WALK,
  DISTRIBUTION,
  EVIDENCE_ROWS,
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
  LEDGER_NAMES,
  NOT_PRODUCTS,
  PATH_WORD,
  PHRASE,
  PLATFORM,
  POSITIVE_CONTROL_WALK,
  PRODUCT_WORD,
  ROW_KINDS,
  RULED_OUT,
  SAMPLE_DEAF_CLICK_PROOF,
  SEEDED_WORD,
  SETTINGS_KEY,
  STATE,
  SURFACE,
  TERM,
  TERMINAL,
  TITLE,
  TUI_MODE,
  VERDICTS,
  WORKAROUND,
  analyze,
  classify,
  decide,
  emptyTicket,
  fingerprint,
  handle,
  inspectDeafClick,
  inspectElementKeyMark,
  inspectFullscreenMark,
  inspectFullscreenTui,
  inspectHitTest,
  inspectHitTestMark,
  inspectHoverScope,
  inspectHoverScopeMark,
  inspectKeyboardOk,
  inspectRowOnclick,
  inspectRowOnclickMark,
  inspectSharedDispatch,
  mapDetent,
  observeMouseDead,
  readBooth,
  score,
  scoreGate,
  scoreMouseDead,
  scoreWalk,
  seedDeafClick,
  seedElementKey,
  seedEngaged,
  seedHitTest,
  seedHoverScope,
  seedIndexed,
  seedMouseDead,
  seedNotched,
  seedProduct,
  seedSeatedClick,
} from "./detent.mjs";

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
  return fileURLToPath(new URL("./detent.mjs", import.meta.url));
}

const CATALOG_SUMMARY =
  "21:10 detent: a mechanical detent / ratchet / hit-test / notched-wheel atelier booth for #94565. After 2.1.271 shared mouse dispatch, claude agents session-row left-clicks land but selection does nothing — hit-test/detent feedback gone on fullscreen macOS Terminal.app. Idle notched / seeded deaf-click / path mouse-dead. Score detent or admit notched.";

test("idle notched is a hold; click seats in the detent and the session opens", () => {
  const result = analyze(seedNotched());
  assert.equal(result.verdict, "notched");
  assert.equal(result.idleWord, "notched");
  assert.equal(IDLE_WORD, "notched");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.notched, true);
  assert.equal(result.phrase, "admit notched");
  assert.equal(result.deafClick, false);
  assert.equal(result.mouseDead, false);
  assert.ok(HOLD_ALIASES.includes("engaged"));
  assert.ok(HOLD_ALIASES.includes("indexed"));
  assert.ok(HOLD_ALIASES.includes("seated-click"));
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(result.idleWord, word);
    assert.notEqual(result.verdict, word);
  }
  assert.notEqual(IDLE_WORD, "seated");
  assert.notEqual(IDLE_WORD, "ascribed");
  assert.notEqual(IDLE_WORD, "moored");
  assert.notEqual(IDLE_WORD, "buoyed");
  assert.notEqual(IDLE_WORD, "mended");
  assert.notEqual(IDLE_WORD, "homed");
  assert.notEqual(IDLE_WORD, "shared");
  assert.notEqual(IDLE_WORD, "contiguous");
  assert.notEqual(IDLE_WORD, "stationed");
  assert.notEqual(IDLE_WORD, "pledged");
});

test("empty ticket and empty stdin classify notched", () => {
  assert.equal(classify(emptyTicket()), "notched");
  assert.equal(classify(""), "notched");
  assert.equal(classify(null), "notched");
  assert.equal(decide({}), "notched");
});

test("#94565 seeded path scores deaf-click when the pin never seats", () => {
  const result = analyze(seedDeafClick());
  assert.equal(result.verdict, "deaf-click");
  assert.equal(result.seededWord, "deaf-click");
  assert.equal(SEEDED_WORD, "deaf-click");
  assert.equal(PRODUCT_WORD, "detent");
  assert.equal(result.hold, false);
  assert.equal(result.alarm, true);
  assert.equal(result.deafClick, true);
  assert.equal(result.phrase, "score detent");
  assert.equal(result.mouseDead, true);
  assert.equal(result.hitTest, true);
  for (const word of FORBIDDEN_SEED) {
    assert.notEqual(result.seededWord, word);
    assert.notEqual(result.verdict, word);
  }
  assert.notEqual(SEEDED_WORD, "miscast");
  assert.notEqual(SEEDED_WORD, "slipped");
  assert.notEqual(SEEDED_WORD, "freshet");
  assert.notEqual(PATH_WORD, "advisor-shadow");
  assert.notEqual(PATH_WORD, "iface-swap");
  assert.notEqual(PATH_WORD, "ptmx-race");
});

test("educational mouse-dead helpers encode published notched vs deaf-click paths", () => {
  assert.equal(CODE_BUILD, "2.1.271");
  assert.equal(CODE_BUILD_OK, "2.1.270");
  assert.equal(CODE_BUILD_STILL, "2.1.272");
  assert.equal(TERMINAL, "Apple Terminal.app");
  assert.equal(TERM, "xterm-256color");
  assert.equal(TUI_MODE, "fullscreen");
  assert.equal(SETTINGS_KEY, "tui");
  assert.equal(COMMAND, "claude agents");
  assert.equal(WORKAROUND, "DISABLE_AUTOUPDATER=1");
  assert.deepEqual([...ROW_KINDS], ["Pinned", "Ready for review", "Working", "Completed"]);
  const wet = observeMouseDead({ clickLanded: true, selectionOpened: false });
  assert.equal(wet.dead, true);
  const shut = observeMouseDead({ notched: true });
  assert.equal(shut.dead, false);
  const hit = inspectHitTest({});
  assert.equal(hit.missed, true);
  const held = inspectHitTest({ notched: true });
  assert.equal(held.missed, false);
  const hover = inspectHoverScope({});
  assert.equal(hover.missed, true);
  const clean = inspectHoverScope({ notched: true });
  assert.equal(clean.missed, false);
  const deaf = inspectDeafClick({});
  assert.equal(deaf.deaf, true);
  const keys = inspectKeyboardOk({});
  assert.equal(keys.stillWorks, true);
  const full = inspectFullscreenTui({});
  assert.equal(full.flagged, true);
  const row = inspectRowOnclick({});
  assert.equal(row.flagged, true);
  const dispatch = inspectSharedDispatch({});
  assert.equal(dispatch.flagged, true);
  const scored = scoreMouseDead({
    deafClick: true,
    mouseDead: true,
    hitTest: true,
  });
  assert.equal(scored.deafClick, true);
  assert.equal(scored.mouseDead, true);
  const intactPath = scoreMouseDead({ notched: true });
  assert.equal(intactPath.deafClick, false);
  assert.equal(intactPath.notched, true);
});

test("inspectors mark hit-test and hover-scope", () => {
  const hit = inspectHitTestMark({ deafClick: true, hitTest: true });
  assert.equal(hit.stamp, "hit-test");
  assert.equal(hit.flagged, true);
  const hover = inspectHoverScopeMark({ deafClick: true, hoverScope: true });
  assert.equal(hover.stamp, "hover-scope");
  assert.equal(hover.missed, true);
  const scored = scoreGate({
    deafClick: true,
    mouseDead: true,
    hitTest: true,
    cue: "deaf-click",
  });
  assert.equal(scored.verdict, "deaf-click");
  const open = inspectHitTestMark({ notched: true, deafClick: false });
  assert.equal(open.stamp, "engaged");
});

test("path word is mouse-dead; booth seed holds the path", () => {
  assert.equal(PATH_WORD, "mouse-dead");
  const result = analyze(seedMouseDead());
  assert.equal(result.verdict, "mouse-dead");
  assert.equal(result.pathWord, "mouse-dead");
  assert.equal(result.hold, false);
  assert.equal(
    classify({
      seed: "mouse-dead",
      preferSeed: true,
      deafClick: true,
    }),
    "mouse-dead",
  );
  assert.equal(classify({ seed: "hit-test", preferSeed: true }), "hit-test");
  assert.equal(score(seedMouseDead()), "detent");
});

test("HOLD includes notched; aliases classify when preferSeed", () => {
  assert.ok(HOLD.includes("notched"));
  const engaged = analyze(seedEngaged());
  assert.equal(engaged.verdict, "engaged");
  assert.equal(classify({ seed: "indexed", preferSeed: true }), "indexed");
  assert.equal(classify({ seed: "seated-click", preferSeed: true }), "seated-click");
});

test("alarm chips: hit-test, hover-scope, deaf-click", () => {
  assert.equal(classify({ seed: "hit-test", preferSeed: true }), "hit-test");
  assert.equal(classify(seedMouseDead()), "mouse-dead");
  assert.equal(classify(seedProduct()), "deaf-click");
  assert.equal(classify(seedHoverScope()), "hover-scope");
  assert.equal(classify({ seed: "element-key", preferSeed: true }), "element-key");
});

test("booth fixtures flip notched vs deaf-click vs mouse-dead", () => {
  const idle = scoreGate(seedNotched());
  const seeded = scoreGate(seedDeafClick());
  const notched = readData("notched.json");
  const deaf = readData("deaf-click.json");
  const issued = readData("94565.json");
  const path = readData("mouse-dead.json");
  assert.equal(idle.verdict, "notched");
  assert.equal(seeded.verdict, "deaf-click");
  assert.notEqual(idle.verdict, seeded.verdict);
  assert.equal(score(seedNotched()), "notched");
  assert.equal(score(seedDeafClick()), "detent");
  assert.equal(score({ seed: "mouse-dead", preferSeed: true }), "detent");
  assert.equal(notched.mouseDead, false);
  assert.equal(notched.notched, true);
  assert.equal(scoreGate(notched).verdict, "notched");
  assert.equal(deaf.mouseDead, true);
  assert.equal(deaf.hitTest, true);
  assert.equal(classify(deaf), "deaf-click");
  assert.equal(issued.issue, 94565);
  assert.equal(classify(issued), "deaf-click");
  assert.equal(path.paths.length, 3);
  assert.match(path.paths[0].rule, /notched|engaged|indexed|seated-click/i);
  assert.match(path.paths[1].result, /mouse-dead|hit-test|hover-scope|element-key|deaf-click/i);
  assert.equal(classify(path), "mouse-dead");
  assert.equal(deaf.hubCount, "DEAF-CLICK");
  assert.equal(deaf.issue, 94565);
  assert.equal(deaf.deafClick, true);
  assert.equal(classify(readData("engaged.json")), "engaged");
  assert.equal(classify(readData("indexed.json")), "indexed");
  assert.equal(classify(readData("seated-click.json")), "seated-click");
  assert.equal(classify(readData("hit-test.json")), "hit-test");
  assert.equal(classify(readData("hover-scope.json")), "hover-scope");
  assert.equal(classify(readData("element-key.json")), "element-key");
  assert.equal(classify(readData("fullscreen-tui.json")), "fullscreen-tui");
  assert.equal(classify(readData("row-onclick.json")), "row-onclick");
  assert.equal(classify(readData("keyboard-ok.json")), "keyboard-ok");
  assert.equal(classify(readData("shared-dispatch.json")), "shared-dispatch");
  assert.equal(classify(readData("landing.json")), "landing");
  assert.equal(classify(readData("cousins.json")), "cousins");
  assert.deepEqual(readData("cousins.json").issues, []);
  assert.equal(classify(readData("backups.json")), "backups");
  assert.equal(classify(readData("walk.json")), "walk");
  assert.equal(classify(readData("has-repro.json")), "has-repro");
  assert.equal(classify(readData("fixtures.json")), "fixtures");
  assert.equal(classify(readData("closed.json")), "closed");
  assert.equal(classify(readData("ratchet.json")), "hit-test");
});

test("chips include idle, seeded, path, and walk", () => {
  assert.ok(CHIPS.includes("notched"));
  assert.ok(CHIPS.includes("deaf-click"));
  assert.ok(CHIPS.includes("mouse-dead"));
  assert.ok(CHIPS.includes("hit-test"));
  assert.ok(CHIPS.includes("hover-scope"));
  assert.ok(CHIPS.includes("element-key"));
  assert.ok(CHIPS.includes("seated-click"));
  assert.ok(CHIPS.includes("fixtures"));
  assert.ok(CHIPS.includes("walk"));
  assert.ok(ALARM.includes("deaf-click"));
  assert.ok(ALARM.includes("mouse-dead"));
  assert.ok(ALARM.includes("hit-test"));
  assert.ok(ALARM.includes("hover-scope"));
  assert.ok(VERDICTS.includes("walk"));
  assert.equal(classify({ seed: "fixtures", preferSeed: true }), "fixtures");
  assert.equal(classify({ seed: "walk", preferSeed: true }), "walk");
});

test("published detent walk scores deaf-click after the notched hold", () => {
  const booth = scoreWalk({ rows: DETENT_WALK });
  assert.equal(booth.verdict, "deaf-click");
  assert.ok(booth.deafClickCount >= 1);
  const idle = booth.rows.find((row) => row.event === "atelier-bench");
  assert.equal(idle.notched, true);
  assert.equal(idle.verdict, "notched");
  const cut = booth.rows.find((row) => row.event === "mouse-dead");
  assert.equal(cut.mouseDead, true);
  const path = booth.rows.find(
    (row) => row.event === "mouse-dead" && row.t === "path",
  );
  assert.equal(path.verdict, "mouse-dead");
});

test("DETENT_WALK constant matches the issue core walk", () => {
  assert.equal(DETENT_WALK[0].event, "atelier-bench");
  const cut = DETENT_WALK.find((row) => row.event === "mouse-dead");
  assert.equal(cut.mouseDead || cut.hitTest, true);
  const path = DETENT_WALK.find((row) => row.t === "path");
  assert.equal(path.deafClick, true);
  const scoreRow = DETENT_WALK.find((row) => row.event === "deaf-click");
  assert.equal(scoreRow.deafClick, true);
  assert.equal(scoreRow.hitTest, true);
});

test("positive control atelier-bench stays notched", () => {
  const walk = scoreWalk({ rows: POSITIVE_CONTROL_WALK });
  assert.equal(walk.verdict, "notched");
  const ok = walk.rows.find((row) => row.t === "hold");
  assert.equal(ok.verdict, "notched");
  const hold = walk.rows.find((row) => row.event === "atelier-bench");
  assert.equal(hold.notched, true);
  assert.equal(hold.verdict, "notched");
});

test("issue constants encode only #94565 published facts", () => {
  assert.equal(FEATURED_ISSUE, 94565);
  assert.ok(ISSUE_URL.includes("94565"));
  assert.match(TITLE, /claude agents|2\.1\.271|fullscreen|Terminal\.app/i);
  assert.equal(STATE, "OPEN");
  assert.match(PLATFORM, /macos/i);
  assert.match(HOST, /2\.1\.271|Darwin 25\.5\.0|Terminal\.app|fullscreen/i);
  assert.equal(BUILD, "Claude Code 2.1.271");
  assert.equal(SURFACE, "mouse-dead");
  assert.deepEqual(
    [...LABELS],
    ["bug", "has repro", "platform:macos", "area:tui", "regression", "area:agent-view"],
  );
  assert.equal(FIELD_MARKS.length, 6);
  assert.equal(LEDGER_NAMES.length, 6);
  assert.equal(EVIDENCE_ROWS.length, 4);
  assert.equal(EVIDENCE_ROWS[0].lane, "Pinned");
  assert.equal(EVIDENCE_ROWS[1].lane, "Ready for review");
  assert.equal(EVIDENCE_ROWS[2].lane, "Working");
  assert.equal(EVIDENCE_ROWS[3].lane, "Completed");
  assert.ok(RULED_OUT.some((row) => /#94564/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /#94575|Prosopon/i.test(row)));
  assert.ok(EXPECTED.some((row) => /session row|opens|detent/i.test(row)));
  assert.match(
    DISTRIBUTION,
    /2\.1\.271|2\.1\.272|2\.1\.270|claude agents|elementKey|DISABLE_AUTOUPDATER|fullscreen/i,
  );
  assert.equal(BOOTH_STATIONS.length, 6);
  assert.ok(FINGERPRINT_LINES.includes("mouse-dead"));
  assert.ok(FINGERPRINT_LINES.includes("detent"));
  assert.equal(PHRASE, "Score detent or admit notched.");
  assert.equal(SAMPLE_DEAF_CLICK_PROOF.mouseDead, true);
  assert.equal(SAMPLE_DEAF_CLICK_PROOF.names.length, 6);
  assert.equal(seedSeatedClick().seed, "seated-click");
  assert.equal(seedIndexed().seed, "indexed");
  assert.equal(seedHitTest().seed, "hit-test");
  assert.equal(seedHoverScope().seed, "hover-scope");
  assert.equal(seedElementKey().seed, "element-key");
});

test("has-repro fingerprints encode the published detent proof", () => {
  const result = handle(seedDeafClick());
  assert.equal(result.published.platform, "macos");
  assert.equal(result.published.surface, "mouse-dead");
  assert.equal(result.published.host, HOST);
  assert.match(
    fingerprint(seedDeafClick()),
    /deaf-click\|kind=mouse-dead\|ref=hit-test\|path=mouse-dead\|cue=mouse-dead/,
  );
  assert.equal(classify({ seed: "has-repro", preferSeed: true }), "has-repro");
});

test("forbidden idle list includes prior catalog words and seated/ascribed/moored", () => {
  const required = [
    "ascribed",
    "seated",
    "moored",
    "lashed",
    "warped",
    "fendered",
    "slipped",
    "iface-swap",
    "buoyed",
    "mended",
    "homed",
    "shared",
    "contiguous",
    "stationed",
    "lasting",
    "enrolled",
    "single",
    "pledged",
    "brisk",
    "cadence",
    "released",
    "lit",
    "primed",
    "raised",
    "preserved",
    "tokenized",
    "blazoned",
    "tabard",
    "freshet",
    "kintsugi",
    "cenotaph",
    "stratum",
    "tmesis",
    "vedette",
    "orloj",
    "brisure",
    "diptych",
    "vizard",
    "treacle",
    "init-flood",
    "heal-abort",
    "dead-install",
    "layer-unsealed",
    "mid-inject",
    "idle-exit",
    "half-life",
    "fork-resume",
    "brief-echo",
    "background-reset",
    "advisor-shadow",
    "ptmx-race",
    "ungloved",
  ];
  for (const word of required) {
    assert.ok(FORBIDDEN_IDLE.includes(word), `missing forbidden idle ${word}`);
  }
});

test("notched booth flips deaf-click back when the ratchet admits notched", () => {
  const tape = {
    notched: true,
    deafClick: false,
    mouseDead: false,
    cue: "notched",
  };
  assert.equal(scoreGate(tape).verdict, "notched");
  tape.notched = false;
  tape.deafClick = true;
  tape.mouseDead = true;
  tape.cue = "deaf-click";
  assert.equal(scoreGate(tape).verdict, "deaf-click");
  tape.notched = true;
  tape.deafClick = false;
  tape.mouseDead = false;
  tape.cue = "notched";
  assert.equal(scoreGate(tape).verdict, "notched");
});

test("inspectors and readBooth mark the deaf-click proof", () => {
  const hit = inspectHitTestMark({ deafClick: true });
  assert.equal(hit.stamp, "hit-test");
  const hover = inspectHoverScopeMark({ deafClick: true, hoverScope: true });
  assert.equal(hover.stamp, "hover-scope");
  assert.equal(hover.missed, true);
  const booth = readBooth({
    deafClick: true,
    mouseDead: true,
    hitTest: true,
  });
  assert.equal(booth.deafClick, true);
  assert.equal(booth.mark, "deaf-click");
  const open = readBooth({
    notched: true,
    deafClick: false,
    mouseDead: false,
  });
  assert.equal(open.deafClick, false);
  assert.equal(open.mark, "notched");
  assert.equal(inspectElementKeyMark({ deafClick: true, elementKey: true }).stamp, "element-key");
  assert.equal(inspectFullscreenMark({ deafClick: true, fullscreenTui: true }).stamp, "fullscreen-tui");
  assert.equal(inspectRowOnclickMark({ deafClick: true, rowOnclick: true }).stamp, "row-onclick");
});

test("mapDetent encodes the published mouse-dead", () => {
  const miss = mapDetent({ deafClick: true, mouseDead: true });
  assert.equal(miss.stamp, "mouse-dead");
  assert.equal(miss.holdingLane, "deaf-click");
  assert.equal(miss.ribbon, "deaf-click");
  const clear = mapDetent({ notched: true, deafClick: false });
  assert.equal(clear.stamp, "atelier-bench");
  assert.equal(clear.kindLane, "ratchet-wheel");
  assert.equal(clear.holdingLane, "atelier-bench");
});

test("cousins stay empty; products stay distinct; backups stay data-only", () => {
  assert.equal(COUSINS.length, 0);
  assert.ok(NOT_PRODUCTS.includes("prosopon"));
  assert.ok(NOT_PRODUCTS.includes("slipway"));
  assert.ok(NOT_PRODUCTS.includes("freshet"));
  assert.ok(NOT_PRODUCTS.includes("kintsugi"));
  assert.ok(NOT_PRODUCTS.includes("vizard"));
  assert.ok(NOT_PRODUCTS.includes("gauntlet"));
  assert.ok(NOT_PRODUCTS.includes("cathead"));
  assert.equal(BACKUPS.length, 7);
  assert.equal(BACKUPS[0].issue, 94564);
  assert.equal(BACKUPS[6].issue, 94151);
  assert.ok(BACKUPS.every((row) => row.citeOnly === true));
  assert.ok(!BACKUPS.some((row) => row.issue === 94565));
  assert.ok(!BACKUPS.some((row) => row.issue === 94336));
  assert.equal(classify({ seed: "cousins", preferSeed: true }), "cousins");
  assert.equal(classify({ seed: "backups", preferSeed: true }), "backups");
});

test("CLI scores fixtures without a server", () => {
  const idle = spawnSync(process.execPath, [modelPath()], { encoding: "utf8" });
  const seeded = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/deaf-click.json", import.meta.url))],
    { encoding: "utf8" },
  );
  const notchedFix = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/notched.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(idle.status, 0, idle.stderr);
  assert.equal(seeded.status, 0, seeded.stderr);
  assert.equal(notchedFix.status, 0, notchedFix.stderr);
  const idleOut = JSON.parse(idle.stdout);
  const seededOut = JSON.parse(seeded.stdout);
  const notchedOut = JSON.parse(notchedFix.stdout);
  assert.equal(idleOut.verdict, "notched");
  assert.equal(idleOut.hold, true);
  assert.equal(seededOut.verdict, "deaf-click");
  assert.equal(seededOut.alarm, true);
  assert.equal(notchedOut.verdict, "notched");
  assert.equal(notchedOut.hold, true);
  assert.match(notchedOut.phrase, /admit notched/);
});

test("handle exposes published hypothesis and #94565 headline", () => {
  const result = handle(seedDeafClick());
  assert.equal(result.published.issue, 94565);
  assert.equal(result.published.platform, "macos");
  assert.deepEqual(result.published.cousins, []);
  assert.ok(result.published.backups.includes(94564));
  assert.ok(result.published.backups.includes(94151));
  assert.ok(!result.published.backups.includes(94565));
  assert.ok(!result.published.backups.includes(94336));
  assert.match(
    result.published.hypothesis,
    /hit-test|elementKey|hover scope|NON-BINDING|#94565/i,
  );
  assert.match(result.published.hypothesis, /NON-BINDING/);
  assert.match(result.published.hypothesis, /#94565/);
  assert.equal(result.published.build, BUILD);
  assert.equal(result.published.evidence.length, 4);
});

test("model has no static node: imports so the notched page can score in-browser", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /^import .* from "node:/m);
  assert.match(source, /import\("node:fs"\)/);
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
});

test("notched page is a mechanical detent atelier, not a Greek theatre or dry-dock", () => {
  const page = readPage();
  assert.match(page, /family=Fraunces|Fraunces/);
  assert.match(page, /family=Figtree|Figtree/);
  assert.match(page, /family=JetBrains\+Mono|JetBrains Mono/);
  assert.match(
    page,
    /detent|notched|deaf-click|mouse-dead|ratchet-wheel|detent-pin|click-pawl|hit-plate|notched-dial|index-seat/i,
  );
  assert.match(page, /#101418|#DBA046|#245E62|#FF6B35|#F3EDE2|#6E2C3A/i);
  assert.match(page, /\bnotched\b/);
  assert.match(page, /deaf-click/);
  assert.match(page, /mouse-dead/);
  assert.match(page, /Score detent or admit notched/i);
  assert.match(page, /#388/);
  assert.match(page, /#94565/);
  assert.match(page, /Admit notched/);
  assert.match(page, /Score detent/);
  assert.match(page, /Walk mouse-dead/);
  assert.match(page, /Compare notched \/ deaf-click/);
  assert.match(page, /Pin idle notched/);
  assert.match(page, /Pin seeded deaf-click/);
  assert.match(page, /Pin mouse-dead/);
  assert.match(page, /Stamp hit-test/);
  assert.match(page, /Score booth/);
  assert.match(page, /detent-score/);
  assert.match(
    page,
    /claude agents|2\.1\.271|elementKey|hover scope|Terminal\.app|DISABLE_AUTOUPDATER|fullscreen/i,
  );
  assert.match(page, /ratchet-wheel|detent-pin|click-pawl|hit-plate|notched-dial|index-seat/i);
  assert.match(
    page,
    /<svg[\s\S]*class="ratchet-wheel"|class="detent-pin"|class="click-pawl"|class="hit-plate"|class="notched-dial"|class="mouse-dead"/i,
  );
  assert.match(page, /body\.notched|body\.deaf-click|body\.mouse-dead/);
  assert.match(page, /evidence-table|Pinned|Ready for review|Working|Completed/i);
  assert.doesNotMatch(page, /family=Cormorant\+Infant|Cormorant Infant/);
  assert.doesNotMatch(page, /family=Sora|Sora/);
  assert.doesNotMatch(page, /family=IBM\+Plex\+Mono|IBM Plex Mono/);
  assert.doesNotMatch(page, /family=Spectral|Spectral/);
  assert.doesNotMatch(page, /family=Manrope|Manrope/);
  assert.doesNotMatch(page, /family=Source\+Code\+Pro|Source Code Pro/);
  assert.doesNotMatch(page, /family=DM\+Sans|DM Sans/);
  assert.doesNotMatch(page, /family=Libre\+Baskerville|Libre Baskerville/);
  assert.doesNotMatch(page, /family=Outfit|Outfit/);
  assert.doesNotMatch(page, /family=Newsreader|Newsreader/);
  assert.doesNotMatch(page, /family=Karla|Karla/);
  assert.doesNotMatch(page, /family=Cinzel|Cinzel/);
  assert.doesNotMatch(page, /#0B0A0F|#C4A574|#3F5E3A|#E2B457|#6B1E2A|#E8E0D4/);
  assert.doesNotMatch(page, /#06141F|#A34428|#EFA31A|#B7C2CC|#1E5346|#0C1C22/);
  assert.doesNotMatch(page, /#110C09|#C47A4A|#C9A227|#9E1B1B|#E8C9A8|#3A1C14|#E4C04A/);
  assert.doesNotMatch(page, /#1F2328|#8A9199|#8B1E2D|#E8E0D0|#B8953A|#2C3138/);
  assert.doesNotMatch(page, /staff-gauge|flood-crest|event-spool|window-viewport|no-messages-plaque/i);
  assert.doesNotMatch(page, /urushi|gold seam|cracked bowl|kiln-mouth|repair bench/i);
  assert.doesNotMatch(page, /vacant sarcophagus|Portland-stone|memorial yard/i);
  assert.doesNotMatch(page, /keel-cradle|sodium-lamp|eth-dock|wifi-fairway|undock-cut|bg-idle-hull/i);
  assert.doesNotMatch(page, /clay-mask|olive-wreath|marble-plinth|night amphitheatre/i);
  assert.doesNotMatch(page, /admit ascribed|Score prosopon|idle ascribed/i);
  assert.doesNotMatch(page, /admit moored|Score slipway|idle moored/i);
  assert.doesNotMatch(page, /admit seated|Score cathead|idle seated/i);
  assert.doesNotMatch(page, /\bprosopon\b/);
  assert.doesNotMatch(page, /\bslipway\b/);
  assert.doesNotMatch(page, /\bfreshet\b/);
  assert.doesNotMatch(page, /\bkintsugi\b/);
  assert.doesNotMatch(page, /\bcenotaph\b/);
  assert.doesNotMatch(page, /\bstratum\b/);
  assert.doesNotMatch(page, /\btmesis\b/);
  assert.doesNotMatch(page, /\bvedette\b/);
  assert.doesNotMatch(page, /\borloj\b/);
  assert.doesNotMatch(page, /\bvizard\b/);
  assert.doesNotMatch(page, /\bbrisure\b/);
  assert.doesNotMatch(page, /\bgauntlet\b/);
  assert.doesNotMatch(page, /\bcathead\b/);
  assert.doesNotMatch(page, /advisor-shadow/);
  assert.doesNotMatch(page, /iface-swap/);
  assert.doesNotMatch(page, /init-flood/);
  assert.doesNotMatch(page, /heal-abort/);
  assert.doesNotMatch(page, /ptmx-race/);
  assert.doesNotMatch(page, /tabard|blazon|herald/i);
  assert.match(page, /NOT Prosopon/i);
  assert.match(page, /NOT Slipway/i);
  assert.match(page, /NOT Cathead/i);
  assert.match(page, /NOT #94575/i);
  assert.match(page, /NOT #94458/i);
  assert.doesNotMatch(page, /fetch\(/);
  assert.match(page, /body\.embed/);
});

test("README states the thesis, anti-clone, and how to score", () => {
  const readme = readReadme();
  assert.match(readme, /Detent/);
  assert.match(readme, /#94565/);
  assert.match(readme, /\bnotched\b/);
  assert.match(readme, /deaf-click/);
  assert.match(readme, /mouse-dead/);
  assert.match(readme, /Fraunces/);
  assert.match(readme, /Figtree/);
  assert.match(readme, /JetBrains Mono/);
  assert.doesNotMatch(readme, /Cormorant Infant/);
  assert.doesNotMatch(readme, /Sora/);
  assert.doesNotMatch(readme, /IBM Plex Mono/);
  assert.doesNotMatch(readme, /Spectral/);
  assert.doesNotMatch(readme, /Libre Baskerville/);
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /Research brief/i);
  assert.match(readme, /claude agents|2\.1\.271|elementKey|hover scope|Terminal\.app|fullscreen/i);
  assert.match(readme, /NOT Prosopon/);
  assert.match(readme, /NOT Slipway/);
  assert.match(readme, /NOT Cathead/);
  assert.match(readme, /NOT #94575/);
  assert.match(readme, /do NOT rebuild|do not conflate/i);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/detent/);
  assert.match(readme, /node --test projects\/detent\/detent\.test\.mjs/);
  assert.match(readme, /NON-BINDING/);
  assert.match(readme, /mechanical detent|ratchet|hit-test|notched-wheel|atelier/i);
  assert.match(readme, /Score detent or admit notched/);
  assert.match(readme, /#94564|#94151|#94553|#94560/);
  assert.doesNotMatch(readme, /backup #94565|#94565 as next/);
  assert.match(readme, /21:10/);
  assert.match(readme, /Do NOT implement a fix/i);
  assert.doesNotMatch(readme, /\bprosopon\b/);
  assert.doesNotMatch(readme, /\bslipway\b/);
  assert.doesNotMatch(readme, /\bkintsugi\b/);
  const runLog = readFileSync(
    fileURLToPath(new URL("../../RUN_LOG.md", import.meta.url)),
    "utf8",
  );
  assert.match(runLog, /## 2026-09-16 — Detent/);
  assert.match(runLog, /21:10/);
});

test("catalog features Detent only; Prosopon unfeatured; product count 388", () => {
  const catalog = readCatalog();
  const hub = readHubCatalog();
  assert.equal(catalog.products.length, 388);
  assert.equal(hub.products.length, 388);
  assert.equal(catalog.products[0].name, "Detent");
  assert.equal(catalog.products[0].slug, "detent");
  assert.equal(catalog.products[0].featured, true);
  assert.equal(catalog.products[0].href, "/detent/");
  assert.equal(catalog.products[0].day, "2026-09-16");
  assert.equal(catalog.products[0].summary, CATALOG_SUMMARY);
  assert.equal(hub.products[0].summary, catalog.products[0].summary);
  assert.match(catalog.products[0].summary, /\bnotched\b/);
  assert.match(catalog.products[0].summary, /deaf-click/);
  assert.match(catalog.products[0].summary, /mouse-dead/);
  assert.match(catalog.products[0].summary, /Score detent or admit notched/);
  assert.match(catalog.products[0].summary, /#94565/);
  assert.match(catalog.products[0].summary, /21:10/);
  assert.equal(hub.products[0].slug, "detent");
  assert.equal(hub.products[0].featured, true);
  const prosopon = catalog.products.find((row) => row.slug === "prosopon");
  assert.ok(prosopon);
  assert.equal(prosopon.featured, false);
  const slipway = catalog.products.find((row) => row.slug === "slipway");
  assert.ok(slipway);
  assert.equal(slipway.featured, false);
  assert.equal(catalog.products.filter((row) => row.featured).length, 1);
  assert.equal(
    catalog.products.filter((row) => row.slug === "detent" && row.featured).length,
    1,
  );
  assert.ok(
    !catalog.products.some(
      (row) => String(row.summary || "").includes("94565") && row.slug !== "detent",
    ),
  );
});

test("vercel rewrites detent to the project folder at the top", () => {
  const vercel = readVercel();
  assert.equal(vercel.rewrites[0].source, "/detent");
  assert.equal(vercel.rewrites[0].destination, "/projects/detent");
  assert.equal(vercel.rewrites[1].source, "/detent/");
  assert.equal(vercel.rewrites[1].destination, "/projects/detent");
  assert.equal(vercel.rewrites[2].source, "/detent/:path*");
  assert.equal(vercel.rewrites[2].destination, "/projects/detent/:path*");
  assert.equal(vercel.rewrites[3].source, "/prosopon");
  assert.equal(vercel.rewrites[3].destination, "/projects/prosopon");
});

test("no leftover clone / theatre / dry-dock / masque content", () => {
  const page = readPage();
  const readme = readReadme();
  const source = readFileSync(modelPath(), "utf8");
  for (const blob of [page, readme]) {
    assert.doesNotMatch(blob, /staff-gauge|flood-crest|event-spool|window-viewport|no-messages-plaque|copper-kettle|treacle-well|vacant sarcophagus|cracked-bowl|urushi-pot|kiln-mouth|gold-seam|hemp-rope winch|bollard-post|gangway-plank|keel-cradle|sodium-lamp|clay-mask|olive-wreath|marble-plinth/i);
  }
  assert.doesNotMatch(source, /staff gauge overtopped|floodplain plaque|urushi pot|cracked bowl|vacant sarcophagus|keel cradle|clay mask/i);
});

test("no network calls in the model or tests", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
  assert.doesNotMatch(source, /https?:\/\/[^\s"']*anthropic\.com\/v1/);
});
