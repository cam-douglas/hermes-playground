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
  DISTRIBUTION,
  DRAWBRIDGE_WALK,
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
  SAMPLE_DRAWBRIDGE_PROOF,
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
  inspectHorn,
  inspectLedger,
  inspectReattach,
  inspectSpan,
  inspectUpdate,
  mapBailey,
  readBooth,
  score,
  scoreGate,
  scoreWalk,
  seedAutoUpdateRestart,
  seedBridgeStateStale,
  seedDrawbridge,
  seedHold,
  seedProduct,
  seedRcBridgeUpdateDrop,
  seedSilentDrop,
  seedSpanned,
} from "./drawbridge.mjs";

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
  return fileURLToPath(new URL("./drawbridge.mjs", import.meta.url));
}

test("idle spanned is a hold; remote carts still reach the keep", () => {
  const result = analyze(seedSpanned());
  assert.equal(result.verdict, "spanned");
  assert.equal(result.idleWord, "spanned");
  assert.equal(IDLE_WORD, "spanned");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.spanned, true);
  assert.equal(result.phrase, "admit spanned");
  assert.equal(result.drawbridge, false);
  assert.equal(result.rcBridgeUpdateDrop, false);
  assert.ok(HOLD_ALIASES.includes("spanned"));
  assert.ok(HOLD_ALIASES.includes("open-span"));
  assert.ok(HOLD_ALIASES.includes("linked"));
  assert.ok(HOLD_ALIASES.includes("moored"));
  assert.ok(HOLD_ALIASES.includes("joined"));
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(result.idleWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("empty ticket and empty stdin classify spanned", () => {
  assert.equal(classify(emptyTicket()), "spanned");
  assert.equal(classify(""), "spanned");
  assert.equal(classify(null), "spanned");
  assert.equal(decide({}), "spanned");
});

test("#94049 seeded path scores drawbridge when the machine-wide span is raised", () => {
  const result = analyze(seedDrawbridge());
  assert.equal(result.verdict, "drawbridge");
  assert.equal(result.seededWord, "drawbridge");
  assert.equal(SEEDED_WORD, "drawbridge");
  assert.equal(PRODUCT_WORD, "drawbridge");
  assert.equal(result.hold, false);
  assert.equal(result.alarm, true);
  assert.equal(result.drawbridge, true);
  assert.equal(result.phrase, "score drawbridge");
  assert.equal(result.rcBridgeUpdateDrop, true);
  assert.equal(result.autoUpdateRestart, true);
  for (const word of FORBIDDEN_SEED) {
    assert.notEqual(result.seededWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("inspectors mark raised span and stale ledger", () => {
  const span = inspectSpan({ drawbridge: true, rcBridgeUpdateDrop: true });
  assert.equal(span.stamp, "span-raised");
  assert.equal(span.raised, true);
  const ledger = inspectLedger({ drawbridge: true, bridgeStateStale: true });
  assert.equal(ledger.stamp, "bridge-state-stale");
  assert.equal(ledger.stale, true);
  const horn = inspectHorn({ drawbridge: true, silentDrop: true });
  assert.equal(horn.stamp, "silent-drop");
  const scored = scoreGate({
    drawbridge: true,
    rcBridgeUpdateDrop: true,
    autoUpdateRestart: true,
    silentDrop: true,
    cue: "drawbridge",
  });
  assert.equal(scored.verdict, "drawbridge");
  const open = inspectSpan({ spanned: true, drawbridge: false });
  assert.equal(open.stamp, "span-down");
});

test("path word is rc-bridge-update-drop; booth seed holds the path", () => {
  assert.equal(PATH_WORD, "rc-bridge-update-drop");
  const result = analyze(seedRcBridgeUpdateDrop());
  assert.equal(result.verdict, "rc-bridge-update-drop");
  assert.equal(result.pathWord, "rc-bridge-update-drop");
  assert.equal(result.hold, false);
  assert.equal(
    classify({ seed: "rc-bridge-update-drop", preferSeed: true, drawbridge: true }),
    "rc-bridge-update-drop",
  );
  assert.equal(classify(seedAutoUpdateRestart()), "auto-update-restart");
});

test("HOLD includes spanned / hold", () => {
  assert.ok(HOLD.includes("spanned"));
  assert.ok(HOLD.includes("hold"));
  const hold = analyze(seedHold());
  assert.equal(hold.verdict, "hold");
  assert.equal(hold.hold, true);
  assert.equal(classify({ seed: "hold", preferSeed: true }), "hold");
});

test("alarm chips: auto-update-restart, bridge-state-stale, drawbridge", () => {
  assert.equal(classify(seedAutoUpdateRestart()), "auto-update-restart");
  assert.equal(classify(seedBridgeStateStale()), "bridge-state-stale");
  assert.equal(classify(seedSilentDrop()), "silent-drop");
  assert.equal(classify(seedProduct()), "drawbridge");
});

test("booth fixtures flip spanned vs drawbridge vs rc-bridge-update-drop", () => {
  const idle = scoreGate(seedSpanned());
  const seeded = scoreGate(seedDrawbridge());
  const spanned = readData("spanned.json");
  const drawbridge = readData("drawbridge.json");
  const path = readData("rc-bridge-update-drop.json");
  const holdFix = readData("hold.json");
  assert.equal(idle.verdict, "spanned");
  assert.equal(seeded.verdict, "drawbridge");
  assert.notEqual(idle.verdict, seeded.verdict);
  assert.equal(score(seedSpanned()), "spanned");
  assert.equal(score(seedDrawbridge()), "drawbridge");
  assert.equal(spanned.rcBridgeUpdateDrop, false);
  assert.equal(spanned.spanned, true);
  assert.equal(scoreGate(spanned).verdict, "spanned");
  assert.equal(drawbridge.rcBridgeUpdateDrop, true);
  assert.equal(drawbridge.autoUpdateRestart, true);
  assert.equal(drawbridge.silentDrop, true);
  assert.equal(classify(drawbridge), "drawbridge");
  assert.equal(path.paths.length, 3);
  assert.match(path.paths[0].rule, /spanned|open-span|linked|moored|joined/i);
  assert.match(path.paths[1].result, /span raised|stale localSessionId|offline|bridge-state/i);
  assert.equal(classify(path), "rc-bridge-update-drop");
  assert.equal(drawbridge.hubCount, "DRAWBRIDGE");
  assert.equal(drawbridge.issue, 94049);
  assert.equal(drawbridge.drawbridge, true);
  assert.equal(classify(holdFix), "hold");
  assert.equal(classify(readData("open-span.json")), "open-span");
  assert.equal(classify(readData("linked.json")), "linked");
  assert.equal(classify(readData("moored.json")), "moored");
  assert.equal(classify(readData("joined.json")), "joined");
  assert.equal(classify(readData("auto-update-restart.json")), "auto-update-restart");
  assert.equal(classify(readData("bridge-state-stale.json")), "bridge-state-stale");
  assert.equal(classify(readData("silent-drop.json")), "silent-drop");
  assert.equal(classify(readData("future-sessions-only.json")), "future-sessions-only");
  assert.equal(classify(readData("multi-project-offline.json")), "multi-project-offline");
  assert.equal(classify(readData("transcript-survives.json")), "transcript-survives");
  assert.equal(classify(readData("landing.json")), "landing");
  assert.equal(classify(readData("cousins.json")), "cousins");
  assert.equal(classify(readData("backups.json")), "backups");
  assert.equal(classify(readData("walk.json")), "walk");
  assert.equal(classify(readData("has-repro.json")), "has-repro");
  assert.equal(classify(readData("fixtures.json")), "fixtures");
});

test("chips include idle, seeded, path, and walk", () => {
  assert.ok(CHIPS.includes("spanned"));
  assert.ok(CHIPS.includes("drawbridge"));
  assert.ok(CHIPS.includes("rc-bridge-update-drop"));
  assert.ok(CHIPS.includes("auto-update-restart"));
  assert.ok(CHIPS.includes("bridge-state-stale"));
  assert.ok(CHIPS.includes("open-span"));
  assert.ok(CHIPS.includes("linked"));
  assert.ok(CHIPS.includes("fixtures"));
  assert.ok(CHIPS.includes("walk"));
  assert.ok(ALARM.includes("drawbridge"));
  assert.ok(ALARM.includes("rc-bridge-update-drop"));
  assert.ok(ALARM.includes("auto-update-restart"));
  assert.ok(ALARM.includes("bridge-state-stale"));
  assert.ok(ALARM.includes("silent-drop"));
  assert.ok(ALARM.includes("future-sessions-only"));
  assert.ok(ALARM.includes("multi-project-offline"));
  assert.ok(ALARM.includes("transcript-survives"));
  assert.ok(VERDICTS.includes("walk"));
  assert.equal(classify({ seed: "fixtures", preferSeed: true }), "fixtures");
  assert.equal(classify({ seed: "walk", preferSeed: true }), "walk");
});

test("published drawbridge walk scores drawbridge after the idle hold", () => {
  const booth = scoreWalk({ rows: DRAWBRIDGE_WALK });
  assert.equal(booth.verdict, "drawbridge");
  assert.ok(booth.drawbridgeCount >= 1);
  const idle = booth.rows.find((row) => row.event === "cue-spanned");
  assert.equal(idle.spanned, true);
  assert.equal(idle.verdict, "spanned");
  const cut = booth.rows.find((row) => row.event === "rc-bridge-update-drop");
  assert.equal(cut.rcBridgeUpdateDrop, true);
  const path = booth.rows.find((row) => row.event === "rc-bridge-update-drop" && row.t === "path");
  assert.equal(path.verdict, "rc-bridge-update-drop");
});

test("DRAWBRIDGE_WALK constant matches the issue approach walk", () => {
  assert.equal(DRAWBRIDGE_WALK[0].event, "cue-spanned");
  const cut = DRAWBRIDGE_WALK.find((row) => row.event === "rc-bridge-update-drop");
  assert.equal(cut.rcBridgeUpdateDrop || cut.silentDrop, true);
  const path = DRAWBRIDGE_WALK.find((row) => row.t === "path");
  assert.equal(path.drawbridge, true);
  const scoreRow = DRAWBRIDGE_WALK.find((row) => row.event === "drawbridge");
  assert.equal(scoreRow.drawbridge, true);
});

test("positive control spanned approach stays spanned", () => {
  const walk = scoreWalk({ rows: POSITIVE_CONTROL_WALK });
  assert.equal(walk.verdict, "spanned");
  const ok = walk.rows.find((row) => row.t === "hold");
  assert.equal(ok.verdict, "spanned");
  const hold = walk.rows.find((row) => row.event === "cue-spanned");
  assert.equal(hold.spanned, true);
  assert.equal(hold.verdict, "spanned");
});

test("issue constants encode only #94049 published facts", () => {
  assert.equal(FEATURED_ISSUE, 94049);
  assert.ok(ISSUE_URL.includes("94049"));
  assert.match(TITLE, /Auto-update|Remote Control|reconnect/i);
  assert.equal(STATE, "OPEN");
  assert.equal(PLATFORM, "windows");
  assert.match(HOST, /Remote Control|Windows/i);
  assert.equal(BUILD, "2.1.266 → 2.1.270");
  assert.equal(SURFACE, "rc-bridge-update-drop");
  assert.deepEqual([...LABELS], ["bug", "has-repro", "platform:windows", "area:desktop"]);
  assert.equal(FIELD_MARKS.length, 5);
  assert.ok(RULED_OUT.some((row) => /Chirograph|#94045/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /Titulus|#94025/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /Derelict|#93996/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /Vestry|#94008/i.test(row)));
  assert.ok(EXPECTED.some((row) => /reconnect|reattach|future sessions|bridge-state|notification|horn|unrelated/i.test(row)));
  assert.match(DISTRIBUTION, /2\.1\.266|2\.1\.270|20:09:31|bridge-state\.json|future sessions|localSessionId/i);
  assert.equal(BOOTH_STATIONS.length, 5);
  assert.ok(FINGERPRINT_LINES.includes("rc-bridge-update-drop"));
  assert.ok(FINGERPRINT_LINES.includes("drawbridge"));
  assert.equal(PHRASE, "Score drawbridge or admit spanned.");
  assert.equal(SAMPLE_DRAWBRIDGE_PROOF.rcBridgeUpdateDrop, true);
});

test("has-repro fingerprints encode the published drawbridge proof", () => {
  const result = handle(seedDrawbridge());
  assert.equal(result.published.platform, "windows");
  assert.equal(result.published.surface, "rc-bridge-update-drop");
  assert.equal(result.published.host, HOST);
  assert.match(
    fingerprint(seedDrawbridge()),
    /drawbridge\|kind=rc-bridge-update-drop\|span=raised\|path=rc-bridge-update-drop\|cue=rc-bridge-update-drop/,
  );
  assert.equal(classify({ seed: "has-repro", preferSeed: true }), "has-repro");
});

test("forbidden idle list includes matched/inscribed/berthed/pegged and recent catalog words", () => {
  const required = [
    "matched",
    "chirograph",
    "worktree-rename-stale",
    "inscribed",
    "titulus",
    "resume-stale-title",
    "plaque",
    "latest-wins",
    "synced",
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
    "berthed",
    "derelict",
    "session-kill-orphan",
    "mondegreen",
    "diplopia",
    "fulcrum",
  ];
  for (const word of required) {
    assert.ok(FORBIDDEN_IDLE.includes(word), `missing forbidden idle ${word}`);
  }
});

test("spanned booth flips drawbridge back when the approach is spanned", () => {
  const tape = {
    spanned: true,
    drawbridge: false,
    rcBridgeUpdateDrop: false,
    cue: "spanned",
  };
  assert.equal(scoreGate(tape).verdict, "spanned");
  tape.spanned = false;
  tape.drawbridge = true;
  tape.rcBridgeUpdateDrop = true;
  tape.autoUpdateRestart = true;
  tape.cue = "drawbridge";
  assert.equal(scoreGate(tape).verdict, "drawbridge");
  tape.spanned = true;
  tape.drawbridge = false;
  tape.rcBridgeUpdateDrop = false;
  tape.autoUpdateRestart = false;
  tape.cue = "spanned";
  assert.equal(scoreGate(tape).verdict, "spanned");
});

test("span, ledger, horn, and readBooth mark the drawbridge proof", () => {
  const idle = inspectSpan({
    spanned: true,
  });
  assert.equal(idle.stamp, "span-down");
  const ledger = inspectLedger({ drawbridge: true, bridgeStateStale: true });
  assert.equal(ledger.stamp, "bridge-state-stale");
  assert.equal(ledger.stale, true);
  const horn = inspectHorn({ drawbridge: true, silentDrop: true });
  assert.equal(horn.stamp, "silent-drop");
  const booth = readBooth({
    drawbridge: true,
    rcBridgeUpdateDrop: true,
    autoUpdateRestart: true,
  });
  assert.equal(booth.drawbridge, true);
  assert.equal(booth.mark, "drawbridge");
  const open = readBooth({
    spanned: true,
    drawbridge: false,
    rcBridgeUpdateDrop: false,
  });
  assert.equal(open.drawbridge, false);
  assert.equal(open.mark, "spanned");
  assert.equal(inspectUpdate({ drawbridge: true, autoUpdateRestart: true }).stamp, "auto-update-restart");
  assert.equal(inspectReattach({ drawbridge: true, futureSessionsOnly: true }).stamp, "future-sessions-only");
});

test("mapBailey encodes the published raised span", () => {
  const miss = mapBailey({ drawbridge: true, rcBridgeUpdateDrop: true });
  assert.equal(miss.stamp, "rc-bridge-update-drop");
  assert.equal(miss.holdingLane, "raised");
  assert.equal(miss.ribbon, "drawbridge");
  const clear = mapBailey({ spanned: true, drawbridge: false });
  assert.equal(clear.stamp, "spanned-approach");
  assert.equal(clear.kindLane, "open-span");
  assert.equal(clear.holdingLane, "linked");
});

test("cousins cite #90387 #84793 #84805 #90172 #85413 #82462 #80400 only; products stay distinct; backups stay data-only", () => {
  assert.equal(COUSINS.length, 7);
  assert.equal(COUSINS[0].issue, 90387);
  assert.equal(COUSINS[1].issue, 84793);
  assert.equal(COUSINS[2].issue, 84805);
  assert.equal(COUSINS[3].issue, 90172);
  assert.equal(COUSINS[4].issue, 85413);
  assert.equal(COUSINS[5].issue, 82462);
  assert.equal(COUSINS[6].issue, 80400);
  assert.ok(COUSINS.every((row) => row.citeOnly === true));
  assert.ok(NOT_PRODUCTS.includes("chirograph"));
  assert.ok(NOT_PRODUCTS.includes("titulus"));
  assert.ok(NOT_PRODUCTS.includes("derelict"));
  assert.ok(NOT_PRODUCTS.includes("vestry"));
  assert.ok(NOT_PRODUCTS.includes("surfeit"));
  assert.ok(NOT_PRODUCTS.includes("phosphene"));
  assert.ok(NOT_PRODUCTS.includes("parablepsis"));
  assert.ok(NOT_PRODUCTS.includes("demesne"));
  assert.ok(NOT_PRODUCTS.includes("cartouche"));
  assert.ok(NOT_PRODUCTS.includes("attaint"));
  assert.ok(NOT_PRODUCTS.includes("oriel"));
  assert.ok(NOT_PRODUCTS.includes("mondegreen"));
  assert.ok(NOT_PRODUCTS.includes("diplopia"));
  assert.ok(NOT_PRODUCTS.includes("fulcrum"));
  assert.equal(BACKUPS.length, 10);
  assert.equal(BACKUPS[0].issue, 94052);
  assert.equal(BACKUPS[1].issue, 94041);
  assert.equal(BACKUPS[2].issue, 94040);
  assert.equal(BACKUPS[3].issue, 94032);
  assert.equal(BACKUPS[4].issue, 94031);
  assert.equal(BACKUPS[5].issue, 94029);
  assert.equal(BACKUPS[6].issue, 93987);
  assert.equal(BACKUPS[7].issue, 93924);
  assert.equal(BACKUPS[8].issue, 93770);
  assert.equal(BACKUPS[9].issue, 93777);
  assert.ok(BACKUPS.every((row) => row.citeOnly === true));
  assert.ok(!BACKUPS.some((row) => row.issue === 94049));
  assert.ok(!BACKUPS.some((row) => row.issue === 90387));
  assert.equal(classify({ seed: "cousins", preferSeed: true }), "cousins");
  assert.equal(classify({ seed: "backups", preferSeed: true }), "backups");
});

test("CLI scores fixtures without a server", () => {
  const idle = spawnSync(process.execPath, [modelPath()], { encoding: "utf8" });
  const seeded = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/drawbridge.json", import.meta.url))],
    { encoding: "utf8" },
  );
  const spannedFix = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/spanned.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(idle.status, 0, idle.stderr);
  assert.equal(seeded.status, 0, seeded.stderr);
  assert.equal(spannedFix.status, 0, spannedFix.stderr);
  const idleOut = JSON.parse(idle.stdout);
  const seededOut = JSON.parse(seeded.stdout);
  const spannedOut = JSON.parse(spannedFix.stdout);
  assert.equal(idleOut.verdict, "spanned");
  assert.equal(idleOut.hold, true);
  assert.equal(seededOut.verdict, "drawbridge");
  assert.equal(seededOut.alarm, true);
  assert.equal(spannedOut.verdict, "spanned");
  assert.equal(spannedOut.hold, true);
  assert.match(spannedOut.phrase, /admit spanned/);
});

test("handle exposes published hypothesis and #94049 headline", () => {
  const result = handle(seedDrawbridge());
  assert.equal(result.published.issue, 94049);
  assert.equal(result.published.platform, "windows");
  assert.deepEqual(result.published.cousins, [90387, 84793, 84805, 90172, 85413, 82462, 80400]);
  assert.ok(result.published.backups.includes(94052));
  assert.ok(result.published.backups.includes(93777));
  assert.ok(!result.published.backups.includes(94049));
  assert.match(result.published.hypothesis, /auto-update|bridge|future sessions|NON-BINDING|#94049/i);
  assert.match(result.published.hypothesis, /NON-BINDING/);
  assert.match(result.published.hypothesis, /#94049/);
  assert.equal(result.published.build, BUILD);
});

test("model has no static node: imports so the living page can score in-browser", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /^import .* from "node:/m);
  assert.match(source, /import\("node:fs"\)/);
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
});

test("living page is a castle gatehouse booth, not chirograph lectern or Roman plaque or salvage pier", () => {
  const page = readPage();
  assert.match(page, /family=Cinzel|Cinzel/);
  assert.match(page, /family=Manrope|Manrope/);
  assert.match(page, /JetBrains\+Mono|JetBrains Mono/);
  assert.match(page, /drawbridge|spanned|rc-bridge-update-drop|gatehouse|bailey|portcullis/i);
  assert.match(page, /#C9C2B2|#1A1C22|#8B3A2A|#3F5E46|#C9842A|#2C3E50|#EDE6D6|#12141A/i);
  assert.match(page, /\bspanned\b/);
  assert.match(page, /\bdrawbridge\b/);
  assert.match(page, /rc-bridge-update-drop/);
  assert.match(page, /Score drawbridge or admit spanned/i);
  assert.match(page, /#347/);
  assert.match(page, /#94049/);
  assert.match(page, /Admit spanned/);
  assert.match(page, /Score drawbridge/);
  assert.match(page, /Walk rc-bridge-update-drop/);
  assert.match(page, /Compare spanned \/ drawbridge/);
  assert.match(page, /Pin idle spanned/);
  assert.match(page, /Pin seeded drawbridge/);
  assert.match(page, /Pin rc-bridge-update-drop/);
  assert.match(page, /Lower the span/);
  assert.match(page, /Score booth/);
  assert.match(page, /drawbridge-score/);
  assert.match(page, /2\.1\.266|2\.1\.270|20:09:31|bridge-state|future sessions|localSessionId/i);
  assert.match(page, /gatehouse|bailey|portcullis|span|keep|ditch|torch|merlon|horn/i);
  assert.doesNotMatch(page, /family=Cormorant\+Garamond|Cormorant Garamond/);
  assert.doesNotMatch(page, /family=Figtree|Figtree/);
  assert.doesNotMatch(page, /IBM\+Plex\+Mono|IBM Plex Mono/);
  assert.doesNotMatch(page, /family=Forum|Forum/);
  assert.doesNotMatch(page, /family=Outfit|Outfit/);
  assert.doesNotMatch(page, /Space\+Mono|Space Mono/);
  assert.doesNotMatch(page, /family=Spectral/);
  assert.doesNotMatch(page, /Nunito|family=Nunito/);
  assert.doesNotMatch(page, /Fira\+Code|Fira Mono|family=Fira/);
  assert.doesNotMatch(page, /family=Cormorant\+Upright|Cormorant Upright/);
  assert.doesNotMatch(page, /family=Karla|Karla/);
  assert.doesNotMatch(page, /#E8D7B0/);
  assert.doesNotMatch(page, /#A11F38/);
  assert.doesNotMatch(page, /#6A3D18/);
  assert.doesNotMatch(page, /sacristy|peg-rail|stole|acolyte|vestment|robe-rail/i);
  assert.doesNotMatch(page, /manor charter|oak post|heraldic green|demesned/i);
  assert.doesNotMatch(page, /false door|hieroglyph|name-oval|limestone/i);
  assert.doesNotMatch(page, /court roll|corruption of blood|attainder/i);
  assert.doesNotMatch(page, /collation-desk|apparatus criticus|oxblood lemma/i);
  assert.doesNotMatch(page, /entoptic|vitreous|isopter|sclera/i);
  assert.doesNotMatch(page, /banquet cellar|empty cask|quota-spawn/i);
  assert.doesNotMatch(page, /foundling-hospital|parish-ward/i);
  assert.doesNotMatch(page, /hawser|bosun|keel|berthed|maritime/i);
  assert.doesNotMatch(page, /funerary-titulus|bronze lettering|marble name-plaque/i);
  assert.doesNotMatch(page, /lectern|parchment|indenture|moiety|gall ink|wax seal/i);
  assert.doesNotMatch(page, /\binscribed\b/);
  assert.doesNotMatch(page, /\btitulus\b/);
  assert.doesNotMatch(page, /\bdiplomatic\b/);
  assert.doesNotMatch(page, /\bdemesned\b/);
  assert.doesNotMatch(page, /\bdemesne\b/);
  assert.doesNotMatch(page, /\bquiescent\b/);
  assert.doesNotMatch(page, /\bphosphene\b/);
  assert.doesNotMatch(page, /\btempered\b/);
  assert.doesNotMatch(page, /\bsurfeit\b/);
  assert.doesNotMatch(page, /\bpegged\b/);
  assert.doesNotMatch(page, /\bvestry\b/);
  assert.doesNotMatch(page, /\bderelict\b/);
  assert.doesNotMatch(page, /\bchirograph\b/);
  assert.doesNotMatch(page, /\bmatched\b/);
  assert.doesNotMatch(page, /home-bind-overreach/);
  assert.doesNotMatch(page, /latin1-edit-wipe/);
  assert.doesNotMatch(page, /layer-tree-walk/);
  assert.doesNotMatch(page, /quota-spawn-cascade/);
  assert.doesNotMatch(page, /mount-refcount-race/);
  assert.doesNotMatch(page, /resume-stale-title/);
  assert.doesNotMatch(page, /worktree-rename-stale/);
  assert.doesNotMatch(page, /\bparablepsis\b/);
  assert.match(page, /NOT Chirograph/i);
  assert.match(page, /NOT Titulus/i);
  assert.match(page, /NOT Derelict/i);
  assert.match(page, /NOT Vestry/i);
  assert.match(page, /NOT Surfeit/i);
  assert.match(page, /NOT Phosphene/i);
  assert.match(page, /NOT Mondegreen/i);
});

test("README states the thesis, anti-clone, and how to score", () => {
  const readme = readReadme();
  assert.match(readme, /Drawbridge/);
  assert.match(readme, /#94049/);
  assert.match(readme, /\bspanned\b/);
  assert.match(readme, /\bdrawbridge\b/);
  assert.match(readme, /rc-bridge-update-drop/);
  assert.match(readme, /Cinzel/);
  assert.match(readme, /Manrope/);
  assert.match(readme, /JetBrains Mono/);
  assert.doesNotMatch(readme, /Cormorant Garamond/);
  assert.doesNotMatch(readme, /Figtree/);
  assert.doesNotMatch(readme, /IBM Plex Mono/);
  assert.doesNotMatch(readme, /Forum/);
  assert.doesNotMatch(readme, /Outfit/);
  assert.doesNotMatch(readme, /Space Mono/);
  assert.doesNotMatch(readme, /Spectral/);
  assert.doesNotMatch(readme, /Nunito/);
  assert.doesNotMatch(readme, /Fira/);
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /Research brief/i);
  assert.match(readme, /RC-BRIDGE-UPDATE-DROP|KEEP AUTO-UPDATE RAISES THE MACHINE-WIDE DRAWBRIDGE/i);
  assert.match(readme, /NOT Chirograph\/#94045/);
  assert.match(readme, /NOT Titulus\/#94025/);
  assert.match(readme, /NOT Derelict\/#93996/);
  assert.match(readme, /NOT Vestry\/#94008/);
  assert.match(readme, /NOT Surfeit\/#94012/);
  assert.match(readme, /NOT Phosphene\/#94003/);
  assert.match(readme, /#90387|#84793|#84805|#90172|#85413/);
  assert.match(readme, /2\.1\.266|2\.1\.270|20:09:31|bridge-state|future sessions/i);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/drawbridge/);
  assert.match(readme, /node --test projects\/drawbridge\/drawbridge\.test\.mjs/);
  assert.match(readme, /NON-BINDING/);
  assert.match(readme, /gatehouse|bailey|portcullis|span|keep|ditch/i);
  assert.match(readme, /Score drawbridge or admit spanned/);
  assert.match(readme, /#94052|#94041|#94040|#94032|#94031|#94029|#93987|#93924|#93770|#93777/);
  assert.match(readme, /06:50/);
  assert.match(readme, /Do NOT implement a fix/i);
  const runLog = readFileSync(fileURLToPath(new URL("../../RUN_LOG.md", import.meta.url)), "utf8");
  assert.match(runLog, /## 2026-09-14 — Drawbridge/);
  assert.match(runLog, /06:50/);
});

test("catalog features Drawbridge only; Chirograph unfeatured; product count 347", () => {
  const catalog = readCatalog();
  const hub = readHubCatalog();
  assert.equal(catalog.products.length, 347);
  assert.equal(hub.products.length, 347);
  assert.equal(catalog.products[0].name, "Drawbridge");
  assert.equal(catalog.products[0].slug, "drawbridge");
  assert.equal(catalog.products[0].featured, true);
  assert.equal(catalog.products[0].href, "/drawbridge/");
  assert.equal(catalog.products[0].day, "2026-09-14");
  assert.equal(
    catalog.products[0].summary,
    "06:50 drawbridge: a medieval castle drawbridge / portcullis / bailey-approach / gatehouse booth for #94049. Desktop Windows auto-update restarts the app and terminates the machine-wide Remote Control bridge; every RC session across unrelated projects goes offline at once; conversations resume and keep writing locally so the break is invisible; no notification; bridge-state.json freezes with a stale localSessionId; the settings checkbox only admits future sessions. Idle spanned / seeded drawbridge / path rc-bridge-update-drop. Score drawbridge or admit spanned.",
  );
  assert.equal(hub.products[0].summary, catalog.products[0].summary);
  assert.match(catalog.products[0].summary, /\bspanned\b/);
  assert.match(catalog.products[0].summary, /\bdrawbridge\b/);
  assert.match(catalog.products[0].summary, /rc-bridge-update-drop/);
  assert.match(catalog.products[0].summary, /Score drawbridge or admit spanned/);
  assert.equal(hub.products[0].slug, "drawbridge");
  assert.equal(hub.products[0].featured, true);
  const chirograph = catalog.products.find((row) => row.slug === "chirograph");
  assert.ok(chirograph);
  assert.equal(chirograph.featured, false);
  const titulus = catalog.products.find((row) => row.slug === "titulus");
  assert.ok(titulus);
  assert.equal(titulus.featured, false);
  const derelict = catalog.products.find((row) => row.slug === "derelict");
  assert.ok(derelict);
  assert.equal(derelict.featured, false);
  const vestry = catalog.products.find((row) => row.slug === "vestry");
  assert.ok(vestry);
  assert.equal(vestry.featured, false);
  assert.equal(catalog.products.filter((row) => row.featured).length, 1);
  assert.equal(catalog.products.filter((row) => row.slug === "drawbridge").length, 1);
  assert.ok(!catalog.products.some((row) => String(row.summary || "").includes("94049") && row.slug !== "drawbridge"));
});

test("vercel rewrites drawbridge to the project folder at the top", () => {
  const vercel = readVercel();
  assert.equal(vercel.rewrites[0].source, "/drawbridge");
  assert.equal(vercel.rewrites[0].destination, "/projects/drawbridge");
  assert.equal(vercel.rewrites[1].source, "/drawbridge/");
  assert.equal(vercel.rewrites[1].destination, "/projects/drawbridge");
  assert.equal(vercel.rewrites[2].source, "/drawbridge/:path*");
  assert.equal(vercel.rewrites[2].destination, "/projects/drawbridge/:path*");
});

test("no network calls in the model or tests", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
  assert.doesNotMatch(source, /https?:\/\/[^\s"']*anthropic\.com\/v1/);
});
