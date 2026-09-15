import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ALARM,
  ALSO_233,
  ALSO_251,
  ALSO_270,
  BACKUPS,
  BOOTH_STATIONS,
  BUILD,
  CHIPS,
  CODE_BUILD,
  COUSINS,
  DISTRIBUTION,
  DURATION_MS,
  EVIDENCE_ROWS,
  EVENT_CONN,
  EVENT_DISC,
  EXPECTED,
  FEATURED_ISSUE,
  FIELD_MARKS,
  FINGERPRINT_LINES,
  FORBIDDEN_IDLE,
  FORBIDDEN_SEED,
  HOLD,
  HOLD_ALIASES,
  HOST,
  IDLE_HOURS,
  IDLE_WORD,
  ISSUE_URL,
  LABELS,
  LEDGER_NAMES,
  NIC_WIFI,
  NIC_WIRED,
  NODE_VERSION,
  NOT_PRODUCTS,
  OCCURRENCES,
  PATH_BACK_SEC,
  PATH_WORD,
  PHRASE,
  PLATFORM,
  POSITIVE_CONTROL_WALK,
  PRODUCT_WORD,
  QUEUED_MIN,
  RULED_OUT,
  SAMPLE_SLIPPED_PROOF,
  SEEDED_WORD,
  SESSION_KIND,
  SLIPWAY_WALK,
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
  inspectBgIdle,
  inspectBgOnly,
  inspectConnectionLost,
  inspectEthernetDrop,
  inspectMidStreamCut,
  inspectMidStreamMark,
  inspectNicHandoff,
  inspectNicHandoffMark,
  inspectNoRetry,
  inspectNoRetryMark,
  inspectTurnAbandoned,
  mapSlipway,
  observeIfaceSwap,
  readBooth,
  score,
  scoreGate,
  scoreIfaceSwap,
  scoreWalk,
  seedFendered,
  seedIfaceSwap,
  seedLashed,
  seedMidStreamCut,
  seedMoored,
  seedNicHandoff,
  seedNoRetry,
  seedProduct,
  seedSlipped,
  seedWarped,
} from "./slipway.mjs";

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
  return fileURLToPath(new URL("./slipway.mjs", import.meta.url));
}

const CATALOG_SUMMARY =
  "00:50 slipway: a slipway / pier / undock / NIC-handoff booth for #94458. Windows Ethernet→Wi-Fi undock ends mid-stream turn with no retry; background sessions silently idle. Idle moored / seeded slipped / path iface-swap. Score slipway or admit moored.";

test("idle moored is a hold; turn survives iface swap via retry", () => {
  const result = analyze(seedMoored());
  assert.equal(result.verdict, "moored");
  assert.equal(result.idleWord, "moored");
  assert.equal(IDLE_WORD, "moored");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.moored, true);
  assert.equal(result.phrase, "admit moored");
  assert.equal(result.slipped, false);
  assert.equal(result.ifaceSwap, false);
  assert.ok(HOLD_ALIASES.includes("lashed"));
  assert.ok(HOLD_ALIASES.includes("warped"));
  assert.ok(HOLD_ALIASES.includes("fendered"));
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(result.idleWord, word);
    assert.notEqual(result.verdict, word);
  }
  assert.notEqual(IDLE_WORD, "buoyed");
  assert.notEqual(IDLE_WORD, "mended");
  assert.notEqual(IDLE_WORD, "homed");
  assert.notEqual(IDLE_WORD, "shared");
  assert.notEqual(IDLE_WORD, "contiguous");
  assert.notEqual(IDLE_WORD, "stationed");
});

test("empty ticket and empty stdin classify moored", () => {
  assert.equal(classify(emptyTicket()), "moored");
  assert.equal(classify(""), "moored");
  assert.equal(classify(null), "moored");
  assert.equal(decide({}), "moored");
});

test("#94458 seeded path scores slipped when the hull slides off", () => {
  const result = analyze(seedSlipped());
  assert.equal(result.verdict, "slipped");
  assert.equal(result.seededWord, "slipped");
  assert.equal(SEEDED_WORD, "slipped");
  assert.equal(PRODUCT_WORD, "slipway");
  assert.equal(result.hold, false);
  assert.equal(result.alarm, true);
  assert.equal(result.slipped, true);
  assert.equal(result.phrase, "score slipway");
  assert.equal(result.ifaceSwap, true);
  assert.equal(result.ethernetDrop, true);
  for (const word of FORBIDDEN_SEED) {
    assert.notEqual(result.seededWord, word);
    assert.notEqual(result.verdict, word);
  }
  assert.notEqual(SEEDED_WORD, "freshet");
  assert.notEqual(SEEDED_WORD, "kintsugi");
  assert.notEqual(SEEDED_WORD, "cenotaph");
  assert.notEqual(PATH_WORD, "init-flood");
  assert.notEqual(PATH_WORD, "heal-abort");
  assert.notEqual(PATH_WORD, "dead-install");
});

test("educational iface-swap helpers encode published moored vs slipped paths", () => {
  assert.equal(CODE_BUILD, "2.1.272");
  assert.equal(ALSO_270, "2.1.270");
  assert.equal(ALSO_251, "2.1.251");
  assert.equal(ALSO_233, "2.1.233");
  assert.equal(PATH_BACK_SEC, 2);
  assert.equal(OCCURRENCES, 6);
  assert.equal(IDLE_HOURS, 16);
  assert.equal(QUEUED_MIN, 25);
  assert.equal(EVENT_DISC, 10001);
  assert.equal(EVENT_CONN, 10000);
  assert.equal(DURATION_MS, 52967);
  assert.equal(NODE_VERSION, "v24.20.0");
  assert.equal(NIC_WIRED, "Realtek USB 2.5GbE");
  assert.equal(NIC_WIFI, "Intel Wi-Fi 7 BE211");
  assert.equal(SESSION_KIND, "bg");
  const wet = observeIfaceSwap({ ethernet: true, wifiUp: true });
  assert.equal(wet.swapped, true);
  assert.equal(wet.retried, false);
  const shut = observeIfaceSwap({ moored: true });
  assert.equal(shut.retried, true);
  const cut = inspectMidStreamCut({});
  assert.equal(cut.cut, true);
  const held = inspectMidStreamCut({ moored: true });
  assert.equal(held.cut, false);
  const miss = inspectNoRetry({});
  assert.equal(miss.missing, true);
  const ok = inspectNoRetry({ moored: true });
  assert.equal(ok.missing, false);
  const silent = inspectBgIdle({});
  assert.equal(silent.silent, true);
  const crewed = inspectBgIdle({ moored: true });
  assert.equal(crewed.silent, false);
  const corr = inspectNicHandoff({});
  assert.equal(corr.correlated, true);
  const quiet = inspectNicHandoff({ moored: true });
  assert.equal(quiet.correlated, false);
  const lie = inspectConnectionLost({});
  assert.equal(lie.lie, true);
  const honest = inspectConnectionLost({ moored: true });
  assert.equal(honest.lie, false);
  const abandoned = inspectTurnAbandoned({});
  assert.equal(abandoned.abandoned, true);
  const reseized = inspectTurnAbandoned({ moored: true });
  assert.equal(reseized.abandoned, false);
  const scored = scoreIfaceSwap({
    slipped: true,
    ifaceSwap: true,
    ethernetDrop: true,
  });
  assert.equal(scored.slipped, true);
  assert.equal(scored.ifaceSwap, true);
  const intactPath = scoreIfaceSwap({ moored: true });
  assert.equal(intactPath.slipped, false);
  assert.equal(intactPath.moored, true);
});

test("inspectors mark nic-handoff and mid-stream-cut", () => {
  const handoff = inspectNicHandoffMark({ slipped: true, nicHandoff: true });
  assert.equal(handoff.stamp, "nic-handoff");
  assert.equal(handoff.flagged, true);
  const cut = inspectMidStreamMark({ slipped: true, midStreamCut: true });
  assert.equal(cut.stamp, "mid-stream-cut");
  assert.equal(cut.missed, true);
  const scored = scoreGate({
    slipped: true,
    ifaceSwap: true,
    ethernetDrop: true,
    cue: "slipped",
  });
  assert.equal(scored.verdict, "slipped");
  const open = inspectNicHandoffMark({ moored: true, slipped: false });
  assert.equal(open.stamp, "lashed");
});

test("path word is iface-swap; booth seed holds the path", () => {
  assert.equal(PATH_WORD, "iface-swap");
  const result = analyze(seedIfaceSwap());
  assert.equal(result.verdict, "iface-swap");
  assert.equal(result.pathWord, "iface-swap");
  assert.equal(result.hold, false);
  assert.equal(
    classify({
      seed: "iface-swap",
      preferSeed: true,
      slipped: true,
    }),
    "iface-swap",
  );
  assert.equal(classify({ seed: "nic-handoff", preferSeed: true }), "nic-handoff");
  assert.equal(score(seedIfaceSwap()), "slipway");
});

test("HOLD includes moored; aliases classify when preferSeed", () => {
  assert.ok(HOLD.includes("moored"));
  const lashed = analyze(seedLashed());
  assert.equal(lashed.verdict, "lashed");
  assert.equal(classify({ seed: "warped", preferSeed: true }), "warped");
  assert.equal(classify({ seed: "fendered", preferSeed: true }), "fendered");
});

test("alarm chips: nic-handoff, mid-stream-cut, slipped", () => {
  assert.equal(classify({ seed: "nic-handoff", preferSeed: true }), "nic-handoff");
  assert.equal(classify(seedIfaceSwap()), "iface-swap");
  assert.equal(classify(seedProduct()), "slipped");
  assert.equal(classify(seedMidStreamCut()), "mid-stream-cut");
  assert.equal(classify({ seed: "no-retry", preferSeed: true }), "no-retry");
});

test("booth fixtures flip moored vs slipped vs iface-swap", () => {
  const idle = scoreGate(seedMoored());
  const seeded = scoreGate(seedSlipped());
  const moored = readData("moored.json");
  const slipped = readData("slipped.json");
  const issued = readData("94458.json");
  const path = readData("iface-swap.json");
  assert.equal(idle.verdict, "moored");
  assert.equal(seeded.verdict, "slipped");
  assert.notEqual(idle.verdict, seeded.verdict);
  assert.equal(score(seedMoored()), "moored");
  assert.equal(score(seedSlipped()), "slipway");
  assert.equal(score({ seed: "iface-swap", preferSeed: true }), "slipway");
  assert.equal(moored.ifaceSwap, false);
  assert.equal(moored.moored, true);
  assert.equal(scoreGate(moored).verdict, "moored");
  assert.equal(slipped.ifaceSwap, true);
  assert.equal(slipped.ethernetDrop, true);
  assert.equal(classify(slipped), "slipped");
  assert.equal(issued.issue, 94458);
  assert.equal(classify(issued), "slipped");
  assert.equal(path.paths.length, 3);
  assert.match(path.paths[0].rule, /moored|lashed|warped|fendered/i);
  assert.match(path.paths[1].result, /iface-swap|nic-handoff|mid-stream-cut|no-retry|bg-idle/i);
  assert.equal(classify(path), "iface-swap");
  assert.equal(slipped.hubCount, "SLIPPED");
  assert.equal(slipped.issue, 94458);
  assert.equal(slipped.slipped, true);
  assert.equal(classify(readData("lashed.json")), "lashed");
  assert.equal(classify(readData("warped.json")), "warped");
  assert.equal(classify(readData("fendered.json")), "fendered");
  assert.equal(classify(readData("nic-handoff.json")), "nic-handoff");
  assert.equal(classify(readData("mid-stream-cut.json")), "mid-stream-cut");
  assert.equal(classify(readData("no-retry.json")), "no-retry");
  assert.equal(classify(readData("bg-idle.json")), "bg-idle");
  assert.equal(classify(readData("ethernet-drop.json")), "ethernet-drop");
  assert.equal(classify(readData("wifi-reseize.json")), "wifi-reseize");
  assert.equal(classify(readData("connection-lost.json")), "connection-lost");
  assert.equal(classify(readData("turn-abandoned.json")), "turn-abandoned");
  assert.equal(classify(readData("landing.json")), "landing");
  assert.equal(classify(readData("cousins.json")), "cousins");
  assert.deepEqual(readData("cousins.json").issues, [87987, 89552]);
  assert.equal(classify(readData("backups.json")), "backups");
  assert.equal(classify(readData("walk.json")), "walk");
  assert.equal(classify(readData("has-repro.json")), "has-repro");
  assert.equal(classify(readData("fixtures.json")), "fixtures");
  assert.equal(classify(readData("closed.json")), "closed");
  assert.equal(classify(readData("cradle.json")), "mid-stream-cut");
});

test("chips include idle, seeded, path, and walk", () => {
  assert.ok(CHIPS.includes("moored"));
  assert.ok(CHIPS.includes("slipped"));
  assert.ok(CHIPS.includes("iface-swap"));
  assert.ok(CHIPS.includes("nic-handoff"));
  assert.ok(CHIPS.includes("mid-stream-cut"));
  assert.ok(CHIPS.includes("no-retry"));
  assert.ok(CHIPS.includes("fendered"));
  assert.ok(CHIPS.includes("fixtures"));
  assert.ok(CHIPS.includes("walk"));
  assert.ok(ALARM.includes("slipped"));
  assert.ok(ALARM.includes("iface-swap"));
  assert.ok(ALARM.includes("nic-handoff"));
  assert.ok(ALARM.includes("mid-stream-cut"));
  assert.ok(VERDICTS.includes("walk"));
  assert.equal(classify({ seed: "fixtures", preferSeed: true }), "fixtures");
  assert.equal(classify({ seed: "walk", preferSeed: true }), "walk");
});

test("published slipway walk scores slipped after the moored hold", () => {
  const booth = scoreWalk({ rows: SLIPWAY_WALK });
  assert.equal(booth.verdict, "slipped");
  assert.ok(booth.slippedCount >= 1);
  const idle = booth.rows.find((row) => row.event === "slipway-yard");
  assert.equal(idle.moored, true);
  assert.equal(idle.verdict, "moored");
  const cut = booth.rows.find((row) => row.event === "iface-swap");
  assert.equal(cut.ifaceSwap, true);
  const path = booth.rows.find(
    (row) => row.event === "iface-swap" && row.t === "path",
  );
  assert.equal(path.verdict, "iface-swap");
});

test("SLIPWAY_WALK constant matches the issue core walk", () => {
  assert.equal(SLIPWAY_WALK[0].event, "slipway-yard");
  const cut = SLIPWAY_WALK.find((row) => row.event === "iface-swap");
  assert.equal(cut.ifaceSwap || cut.ethernetDrop, true);
  const path = SLIPWAY_WALK.find((row) => row.t === "path");
  assert.equal(path.slipped, true);
  const scoreRow = SLIPWAY_WALK.find((row) => row.event === "slipped");
  assert.equal(scoreRow.slipped, true);
  assert.equal(scoreRow.ethernetDrop, true);
});

test("positive control slipway-yard stays moored", () => {
  const walk = scoreWalk({ rows: POSITIVE_CONTROL_WALK });
  assert.equal(walk.verdict, "moored");
  const ok = walk.rows.find((row) => row.t === "hold");
  assert.equal(ok.verdict, "moored");
  const hold = walk.rows.find((row) => row.event === "slipway-yard");
  assert.equal(hold.moored, true);
  assert.equal(hold.verdict, "moored");
});

test("issue constants encode only #94458 published facts", () => {
  assert.equal(FEATURED_ISSUE, 94458);
  assert.ok(ISSUE_URL.includes("94458"));
  assert.match(TITLE, /undock|Ethernet|Wi-Fi|no retry|background/i);
  assert.equal(STATE, "OPEN");
  assert.match(PLATFORM, /windows/i);
  assert.match(HOST, /2\.1\.272|Realtek|Wi-Fi 7|26200/i);
  assert.equal(BUILD, "Claude Code 2.1.272 (also 2.1.270 / 2.1.251 / 2.1.233)");
  assert.equal(SURFACE, "iface-swap");
  assert.deepEqual([...LABELS], ["bug", "has repro", "platform:windows", "area:core", "area:networking", "area:agent-view"]);
  assert.equal(FIELD_MARKS.length, 6);
  assert.equal(LEDGER_NAMES.length, 6);
  assert.equal(EVIDENCE_ROWS.length, 6);
  assert.equal(EVIDENCE_ROWS[0].slipped, true);
  assert.equal(EVIDENCE_ROWS[1].live, true);
  assert.equal(EVIDENCE_ROWS[3].gap, true);
  assert.ok(RULED_OUT.some((row) => /#87987/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /#89552/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /#94430/i.test(row)));
  assert.ok(EXPECTED.some((row) => /retry|fresh TCP|background/i.test(row)));
  assert.match(
    DISTRIBUTION,
    /Connection lost mid-response|id=10001|sessionKind|2\.1\.272|Realtek|16 hours|25 minutes/i,
  );
  assert.equal(BOOTH_STATIONS.length, 6);
  assert.ok(FINGERPRINT_LINES.includes("iface-swap"));
  assert.ok(FINGERPRINT_LINES.includes("slipway"));
  assert.equal(PHRASE, "Score slipway or admit moored.");
  assert.equal(SAMPLE_SLIPPED_PROOF.ifaceSwap, true);
  assert.equal(SAMPLE_SLIPPED_PROOF.names.length, 6);
  assert.equal(seedFendered().seed, "fendered");
  assert.equal(seedWarped().seed, "warped");
  assert.equal(seedNicHandoff().seed, "nic-handoff");
  assert.equal(seedMidStreamCut().seed, "mid-stream-cut");
  assert.equal(seedNoRetry().seed, "no-retry");
  assert.equal(OCCURRENCES, 6);
  assert.equal(IDLE_HOURS, 16);
  assert.equal(QUEUED_MIN, 25);
  assert.equal(EVENT_DISC, 10001);
});

test("has-repro fingerprints encode the published slipway proof", () => {
  const result = handle(seedSlipped());
  assert.equal(result.published.platform, "windows");
  assert.equal(result.published.surface, "iface-swap");
  assert.equal(result.published.host, HOST);
  assert.match(
    fingerprint(seedSlipped()),
    /slipped\|kind=iface-swap\|ref=nic-handoff\|path=iface-swap\|cue=iface-swap/,
  );
  assert.equal(classify({ seed: "has-repro", preferSeed: true }), "has-repro");
});

test("forbidden idle list includes prior catalog words and buoyed/mended/homed", () => {
  const required = [
    "buoyed",
    "mended",
    "homed",
    "shared",
    "contiguous",
    "stationed",
    "lasting",
    "enrolled",
    "cleared",
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

test("moored booth flips slipped back when the cradle admits moored", () => {
  const tape = {
    moored: true,
    slipped: false,
    ifaceSwap: false,
    cue: "moored",
  };
  assert.equal(scoreGate(tape).verdict, "moored");
  tape.moored = false;
  tape.slipped = true;
  tape.ifaceSwap = true;
  tape.cue = "slipped";
  assert.equal(scoreGate(tape).verdict, "slipped");
  tape.moored = true;
  tape.slipped = false;
  tape.ifaceSwap = false;
  tape.cue = "moored";
  assert.equal(scoreGate(tape).verdict, "moored");
});

test("inspectors and readBooth mark the slipped proof", () => {
  const handoff = inspectNicHandoffMark({ slipped: true });
  assert.equal(handoff.stamp, "nic-handoff");
  const cut = inspectMidStreamMark({ slipped: true, midStreamCut: true });
  assert.equal(cut.stamp, "mid-stream-cut");
  assert.equal(cut.missed, true);
  const booth = readBooth({
    slipped: true,
    ifaceSwap: true,
    ethernetDrop: true,
  });
  assert.equal(booth.slipped, true);
  assert.equal(booth.mark, "slipped");
  const open = readBooth({
    moored: true,
    slipped: false,
    ifaceSwap: false,
  });
  assert.equal(open.slipped, false);
  assert.equal(open.mark, "moored");
  assert.equal(inspectNoRetryMark({ slipped: true, noRetry: true }).stamp, "no-retry");
  assert.equal(inspectBgOnly({ slipped: true, bgIdle: true }).stamp, "bg-idle");
  assert.equal(inspectEthernetDrop({ slipped: true, ethernetDrop: true }).stamp, "ethernet-drop");
});

test("mapSlipway encodes the published iface-swap", () => {
  const miss = mapSlipway({ slipped: true, ifaceSwap: true });
  assert.equal(miss.stamp, "iface-swap");
  assert.equal(miss.holdingLane, "undock-cut");
  assert.equal(miss.ribbon, "slipped");
  const clear = mapSlipway({ moored: true, slipped: false });
  assert.equal(clear.stamp, "slipway-yard");
  assert.equal(clear.kindLane, "keel-cradle");
  assert.equal(clear.holdingLane, "slipway-yard");
});

test("cousins stay cite-only; products stay distinct; backups stay data-only", () => {
  assert.equal(COUSINS.length, 2);
  assert.deepEqual(COUSINS.map((row) => row.issue), [87987, 89552]);
  assert.ok(COUSINS.every((row) => row.citeOnly === true));
  assert.ok(NOT_PRODUCTS.includes("freshet"));
  assert.ok(NOT_PRODUCTS.includes("kintsugi"));
  assert.ok(NOT_PRODUCTS.includes("cenotaph"));
  assert.ok(NOT_PRODUCTS.includes("hawser"));
  assert.ok(NOT_PRODUCTS.includes("bollard"));
  assert.ok(NOT_PRODUCTS.includes("gangway"));
  assert.equal(BACKUPS.length, 4);
  assert.equal(BACKUPS[0].issue, 93924);
  assert.equal(BACKUPS[3].issue, 94151);
  assert.ok(BACKUPS.every((row) => row.citeOnly === true));
  assert.ok(!BACKUPS.some((row) => row.issue === 94458));
  assert.ok(!BACKUPS.some((row) => row.issue === 94336));
  assert.ok(!COUSINS.some((row) => row.issue === 94458));
  assert.equal(classify({ seed: "cousins", preferSeed: true }), "cousins");
  assert.equal(classify({ seed: "backups", preferSeed: true }), "backups");
});

test("CLI scores fixtures without a server", () => {
  const idle = spawnSync(process.execPath, [modelPath()], { encoding: "utf8" });
  const seeded = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/slipped.json", import.meta.url))],
    { encoding: "utf8" },
  );
  const mooredFix = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/moored.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(idle.status, 0, idle.stderr);
  assert.equal(seeded.status, 0, seeded.stderr);
  assert.equal(mooredFix.status, 0, mooredFix.stderr);
  const idleOut = JSON.parse(idle.stdout);
  const seededOut = JSON.parse(seeded.stdout);
  const mooredOut = JSON.parse(mooredFix.stdout);
  assert.equal(idleOut.verdict, "moored");
  assert.equal(idleOut.hold, true);
  assert.equal(seededOut.verdict, "slipped");
  assert.equal(seededOut.alarm, true);
  assert.equal(mooredOut.verdict, "moored");
  assert.equal(mooredOut.hold, true);
  assert.match(mooredOut.phrase, /admit moored/);
});

test("handle exposes published hypothesis and #94458 headline", () => {
  const result = handle(seedSlipped());
  assert.equal(result.published.issue, 94458);
  assert.equal(result.published.platform, "windows");
  assert.deepEqual(result.published.cousins, [87987, 89552]);
  assert.ok(result.published.backups.includes(93924));
  assert.ok(result.published.backups.includes(94151));
  assert.ok(!result.published.backups.includes(94458));
  assert.ok(!result.published.backups.includes(94336));
  assert.match(
    result.published.hypothesis,
    /retry|fresh TCP|NON-BINDING|#94458/i,
  );
  assert.match(result.published.hypothesis, /NON-BINDING/);
  assert.match(result.published.hypothesis, /#94458/);
  assert.equal(result.published.build, BUILD);
  assert.equal(result.published.evidence.length, 6);
});

test("model has no static node: imports so the moored page can score in-browser", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /^import .* from "node:/m);
  assert.match(source, /import\("node:fs"\)/);
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
});

test("moored page is a dry-dock slipway night booth, not a flood gauge or lacquer kiln", () => {
  const page = readPage();
  assert.match(page, /family=Spectral|Spectral/);
  assert.match(page, /family=Manrope|Manrope/);
  assert.match(page, /family=Source\+Code\+Pro|Source Code Pro/);
  assert.match(
    page,
    /slipway|moored|slipped|iface-swap|keel-cradle|sodium-lamp|eth-dock|wifi-fairway|undock-cut|bg-idle-hull/i,
  );
  assert.match(page, /#06141F|#A34428|#EFA31A|#B7C2CC|#1E5346|#0C1C22/i);
  assert.match(page, /\bmoored\b/);
  assert.match(page, /\bslipped\b/);
  assert.match(page, /iface-swap/);
  assert.match(page, /Score slipway or admit moored/i);
  assert.match(page, /#386/);
  assert.match(page, /#94458/);
  assert.match(page, /Admit moored/);
  assert.match(page, /Score slipway/);
  assert.match(page, /Walk iface-swap/);
  assert.match(page, /Compare moored \/ slipped/);
  assert.match(page, /Pin idle moored/);
  assert.match(page, /Pin seeded slipped/);
  assert.match(page, /Pin iface-swap/);
  assert.match(page, /Stamp mid-stream-cut/);
  assert.match(page, /Score booth/);
  assert.match(page, /slipway-score/);
  assert.match(
    page,
    /Connection lost mid-response|Retrying \(n\/10\)|sessionKind|id=10001|Ethernet|Wi-Fi/i,
  );
  assert.match(page, /keel-cradle|sodium-lamp|eth-dock|wifi-fairway|undock-cut|bg-idle-hull/i);
  assert.match(
    page,
    /<svg[\s\S]*class="slipway-rails"|class="keel-cradle"|class="sodium-lamp"|class="eth-dock"|class="wifi-fairway"|class="undock-cut"|class="bg-idle-hull"/i,
  );
  assert.match(page, /body\.moored|body\.slipped|body\.iface-swap/);
  assert.match(page, /evidence-table|Connection lost|id=10001|sessionKind/i);
  assert.doesNotMatch(page, /family=Fraunces|Fraunces/);
  assert.doesNotMatch(page, /family=DM\+Sans|DM Sans/);
  assert.doesNotMatch(page, /family=IBM\+Plex\+Mono|IBM Plex Mono/);
  assert.doesNotMatch(page, /family=Libre\+Baskerville|Libre Baskerville/);
  assert.doesNotMatch(page, /family=Outfit|Outfit/);
  assert.doesNotMatch(page, /family=JetBrains\+Mono|JetBrains Mono/);
  assert.doesNotMatch(page, /family=Newsreader|Newsreader/);
  assert.doesNotMatch(page, /family=Karla|Karla/);
  assert.doesNotMatch(page, /#0B1C2C|#C4A35A|#E8F1F5|#E09F3E|#3D5A6C|#8B7355/);
  assert.doesNotMatch(page, /#110C09|#C47A4A|#C9A227|#9E1B1B|#E8C9A8|#3A1C14|#E4C04A/);
  assert.doesNotMatch(page, /#E8E2D6|#8B6914|#3F5A45|#5C5650|#1A1814|#C4B59A|#0E0D0B/);
  assert.doesNotMatch(page, /staff-gauge|flood-crest|event-spool|window-viewport|no-messages-plaque/i);
  assert.doesNotMatch(page, /urushi|gold seam|cracked bowl|kiln-mouth|repair bench/i);
  assert.doesNotMatch(page, /vacant sarcophagus|Portland-stone|memorial yard/i);
  assert.doesNotMatch(page, /admit buoyed|Score freshet|idle buoyed/i);
  assert.doesNotMatch(page, /admit mended|Score kintsugi|idle mended/i);
  assert.doesNotMatch(page, /admit homed|Score cenotaph|idle homed/i);
  assert.doesNotMatch(page, /\bfreshet\b/);
  assert.doesNotMatch(page, /\bkintsugi\b/);
  assert.doesNotMatch(page, /\bcenotaph\b/);
  assert.doesNotMatch(page, /\bstratum\b/);
  assert.doesNotMatch(page, /\btmesis\b/);
  assert.doesNotMatch(page, /\bvedette\b/);
  assert.doesNotMatch(page, /\borloj\b/);
  assert.doesNotMatch(page, /\bhawser\b/);
  assert.doesNotMatch(page, /\bbollard\b/);
  assert.doesNotMatch(page, /\bgangway\b/);
  assert.doesNotMatch(page, /init-flood/);
  assert.doesNotMatch(page, /heal-abort/);
  assert.doesNotMatch(page, /dead-install/);
  assert.match(page, /NOT Freshet/i);
  assert.match(page, /NOT Kintsugi/i);
  assert.match(page, /NOT Cenotaph/i);
  assert.match(page, /NOT #94430/i);
  assert.match(page, /NOT #87987/i);
  assert.match(page, /#87987/);
  assert.match(page, /#89552/);
  assert.doesNotMatch(page, /fetch\(/);
  assert.match(page, /body\.embed/);
});

test("README states the thesis, anti-clone, and how to score", () => {
  const readme = readReadme();
  assert.match(readme, /Slipway/);
  assert.match(readme, /#94458/);
  assert.match(readme, /\bmoored\b/);
  assert.match(readme, /\bslipped\b/);
  assert.match(readme, /iface-swap/);
  assert.match(readme, /Spectral/);
  assert.match(readme, /Manrope/);
  assert.match(readme, /Source Code Pro/);
  assert.doesNotMatch(readme, /Fraunces/);
  assert.doesNotMatch(readme, /Libre Baskerville/);
  assert.doesNotMatch(readme, /Outfit/);
  assert.doesNotMatch(readme, /JetBrains/);
  assert.doesNotMatch(readme, /DM Sans/);
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /Research brief/i);
  assert.match(readme, /Connection lost mid-response|undock|sessionKind|id=10001/i);
  assert.match(readme, /NOT #87987/);
  assert.match(readme, /NOT #89552/);
  assert.match(readme, /NOT #94430/);
  assert.match(readme, /#87987/);
  assert.match(readme, /do NOT rebuild|do not conflate/i);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/slipway/);
  assert.match(readme, /node --test projects\/slipway\/slipway\.test\.mjs/);
  assert.match(readme, /NON-BINDING/);
  assert.match(readme, /slipway|pier|undock|NIC-handoff|mid-stream/i);
  assert.match(readme, /Score slipway or admit moored/);
  assert.match(readme, /#93924|#94151/);
  assert.doesNotMatch(readme, /backup #94458|#94458 as next/);
  assert.match(readme, /00:50/);
  assert.match(readme, /Do NOT implement a fix/i);
  assert.doesNotMatch(readme, /\bfreshet\b/);
  assert.doesNotMatch(readme, /\bkintsugi\b/);
  assert.doesNotMatch(readme, /\bcenotaph\b/);
  const runLog = readFileSync(
    fileURLToPath(new URL("../../RUN_LOG.md", import.meta.url)),
    "utf8",
  );
  assert.match(runLog, /## 2026-09-16 — Slipway/);
  assert.match(runLog, /00:50/);
});

test("catalog features Slipway only; Freshet unfeatured; product count 386", () => {
  const catalog = readCatalog();
  const hub = readHubCatalog();
  assert.equal(catalog.products.length, 386);
  assert.equal(hub.products.length, 386);
  assert.equal(catalog.products[0].name, "Slipway");
  assert.equal(catalog.products[0].slug, "slipway");
  assert.equal(catalog.products[0].featured, true);
  assert.equal(catalog.products[0].href, "/slipway/");
  assert.equal(catalog.products[0].day, "2026-09-16");
  assert.equal(catalog.products[0].summary, CATALOG_SUMMARY);
  assert.equal(hub.products[0].summary, catalog.products[0].summary);
  assert.match(catalog.products[0].summary, /\bmoored\b/);
  assert.match(catalog.products[0].summary, /\bslipped\b/);
  assert.match(catalog.products[0].summary, /iface-swap/);
  assert.match(catalog.products[0].summary, /Score slipway or admit moored/);
  assert.match(catalog.products[0].summary, /#94458/);
  assert.match(catalog.products[0].summary, /00:50/);
  assert.equal(hub.products[0].slug, "slipway");
  assert.equal(hub.products[0].featured, true);
  const freshet = catalog.products.find((row) => row.slug === "freshet");
  assert.ok(freshet);
  assert.equal(freshet.featured, false);
  const kintsugi = catalog.products.find((row) => row.slug === "kintsugi");
  assert.ok(kintsugi);
  assert.equal(kintsugi.featured, false);
  assert.equal(catalog.products.filter((row) => row.featured).length, 1);
  assert.equal(
    catalog.products.filter((row) => row.slug === "slipway" && row.featured).length,
    1,
  );
  assert.ok(
    !catalog.products.some(
      (row) => String(row.summary || "").includes("94458") && row.slug !== "slipway",
    ),
  );
});

test("vercel rewrites slipway to the project folder at the top", () => {
  const vercel = readVercel();
  assert.equal(vercel.rewrites[0].source, "/slipway");
  assert.equal(vercel.rewrites[0].destination, "/projects/slipway");
  assert.equal(vercel.rewrites[1].source, "/slipway/");
  assert.equal(vercel.rewrites[1].destination, "/projects/slipway");
  assert.equal(vercel.rewrites[2].source, "/slipway/:path*");
  assert.equal(vercel.rewrites[2].destination, "/projects/slipway/:path*");
  assert.equal(vercel.rewrites[3].source, "/freshet");
  assert.equal(vercel.rewrites[3].destination, "/projects/freshet");
});

test("no leftover clone / flood-gauge / pottery / hemp-rope content", () => {
  const page = readPage();
  const readme = readReadme();
  const source = readFileSync(modelPath(), "utf8");
  for (const blob of [page, readme]) {
    assert.doesNotMatch(blob, /staff-gauge|flood-crest|event-spool|window-viewport|no-messages-plaque|copper-kettle|treacle-well|vacant sarcophagus|cracked-bowl|urushi-pot|kiln-mouth|gold-seam|hemp-rope winch|bollard-post|gangway-plank/i);
  }
  assert.doesNotMatch(source, /staff gauge overtopped|floodplain plaque|urushi pot|cracked bowl|vacant sarcophagus/i);
});

test("no network calls in the model or tests", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
  assert.doesNotMatch(source, /https?:\/\/[^\s"']*anthropic\.com\/v1/);
});
