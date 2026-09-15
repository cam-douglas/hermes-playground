import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ALARM,
  APP_ID,
  ARMED_GRACE_REASON,
  BACKUPS,
  BASKET_NAMES,
  BATTERY,
  BOOTH_STATIONS,
  BUILD,
  CHIPS,
  CODE_BUILD,
  COUSINS,
  CRESSET_WALK,
  DESKTOP_BUILD,
  DISTRIBUTION,
  DISTRO,
  EXPECTED,
  FEATURED_ISSUE,
  FIELD_MARKS,
  FINGERPRINT_LINES,
  FORBIDDEN_IDLE,
  FORBIDDEN_SEED,
  GNOME_IDLE_MIN,
  GNOME_SHELL,
  HOLD,
  HOLD_ALIASES,
  HOST,
  IDLE_WORD,
  INHIBITOR_FLAGS,
  ISSUE_URL,
  LABELS,
  NOT_PRODUCTS,
  ORDINARY_RELEASE_MS,
  PATH_WORD,
  PHRASE,
  PLATFORM,
  POSITIVE_CONTROL_WALK,
  PRODUCT_WORD,
  RULED_OUT,
  SAMPLE_CRESSET_PROOF,
  SEEDED_WORD,
  SESSION_TYPE,
  STATE,
  SURFACE,
  SYNTHETIC_ORDINARY,
  SYNTHETIC_READOPT,
  SYNTHETIC_STALLED,
  TITLE,
  UNATTENDED_AFTER_FINISH,
  UNATTENDED_HOLD,
  VERDICTS,
  analyze,
  classify,
  decide,
  emptyTicket,
  evaluateHold,
  fingerprint,
  handle,
  inspectArmedGrace,
  inspectInhibitor,
  inspectReAdopt,
  inspectRemoteTools,
  inspectStalled,
  mapCresset,
  readBooth,
  score,
  scoreGate,
  scoreHoldLeak,
  scoreWalk,
  seedCresset,
  seedHoldLeak,
  seedProduct,
  seedReAdopt,
  seedReleased,
  seedStalled,
} from "./cresset.mjs";

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
  return fileURLToPath(new URL("./cresset.mjs", import.meta.url));
}

const CATALOG_SUMMARY =
  "13:50 cresset: a cresset / night-wall / iron fire-basket / GNOME-suspend booth for #94420. Desktop (Linux): Keep computer awake while Claude works hold is never released after a re-adopted or stalled Code session, blocking idle suspend for hours. GNOME inhibitor app id /usr/bin/claude-desktop flags 4=suspend. Re-adopt hold taken then never released after turn completes; stalled session drops from count but Code-session claim keeps hold; remote-tools-device claims cycle inside same hold. Idle released / seeded cresset / path hold-leak. Score cresset or admit released.";

test("idle released is a hold; keep-awake / GNOME suspend inhibitor drops when no Code turn is active", () => {
  const result = analyze(seedReleased());
  assert.equal(result.verdict, "released");
  assert.equal(result.idleWord, "released");
  assert.equal(IDLE_WORD, "released");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.released, true);
  assert.equal(result.phrase, "admit released");
  assert.equal(result.cresset, false);
  assert.equal(result.holdLeak, false);
  assert.ok(HOLD_ALIASES.includes("slack"));
  assert.ok(HOLD_ALIASES.includes("yielding"));
  assert.ok(HOLD_ALIASES.includes("extinguished"));
  assert.ok(HOLD_ALIASES.includes("idle-ok"));
  assert.ok(HOLD_ALIASES.includes("suspend-ready"));
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(result.idleWord, word);
    assert.notEqual(result.verdict, word);
  }
  assert.notEqual(IDLE_WORD, "verbatim");
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

test("empty ticket and empty stdin classify released", () => {
  assert.equal(classify(emptyTicket()), "released");
  assert.equal(classify(""), "released");
  assert.equal(classify(null), "released");
  assert.equal(decide({}), "released");
});

test("#94420 seeded path scores cresset when the night basket stays lit", () => {
  const result = analyze(seedCresset());
  assert.equal(result.verdict, "cresset");
  assert.equal(result.seededWord, "cresset");
  assert.equal(SEEDED_WORD, "cresset");
  assert.equal(PRODUCT_WORD, "cresset");
  assert.equal(result.hold, false);
  assert.equal(result.alarm, true);
  assert.equal(result.cresset, true);
  assert.equal(result.phrase, "score cresset");
  assert.equal(result.holdLeak, true);
  assert.equal(result.reAdopt, true);
  for (const word of FORBIDDEN_SEED) {
    assert.notEqual(result.seededWord, word);
    assert.notEqual(result.verdict, word);
  }
  assert.notEqual(SEEDED_WORD, "dictabelt");
  assert.notEqual(SEEDED_WORD, "lemure");
  assert.notEqual(SEEDED_WORD, "cancellans");
  assert.notEqual(SEEDED_WORD, "arras");
  assert.notEqual(PATH_WORD, "segment-drop");
  assert.notEqual(PATH_WORD, "orphan-tick");
  assert.notEqual(PATH_WORD, "deferred-delta");
  assert.notEqual(PATH_WORD, "phantom-prompt");
  assert.notEqual(PATH_WORD, "chmod-failopen");
  assert.notEqual(PATH_WORD, "header-rename");
  assert.notEqual(PATH_WORD, "subst-nest");
  assert.notEqual(PATH_WORD, "root-find");
});

test("educational hold helper encodes published released vs hold-leak paths", () => {
  assert.equal(CODE_BUILD, "2.1.270");
  assert.equal(DESKTOP_BUILD, "1.52386.6");
  assert.equal(APP_ID, "/usr/bin/claude-desktop");
  assert.equal(INHIBITOR_FLAGS, 4);
  assert.equal(GNOME_IDLE_MIN, 15);
  assert.deepEqual([...ORDINARY_RELEASE_MS], [118291, 173828]);
  assert.equal(UNATTENDED_HOLD, "4h38m");
  assert.equal(UNATTENDED_AFTER_FINISH, "3h24m");
  assert.equal(ARMED_GRACE_REASON, "armed_grace");
  assert.equal(BATTERY, false);
  assert.equal(DISTRO, "Pop!_OS 22.04");
  assert.equal(GNOME_SHELL, "42.9");
  assert.equal(SESSION_TYPE, "X11");
  assert.match(SYNTHETIC_ORDINARY.released, /idle/);
  assert.equal(SYNTHETIC_READOPT.released, null);
  assert.equal(SYNTHETIC_STALLED.released, null);
  const leaked = evaluateHold({ reAdopt: true, inhibitorPresent: true });
  assert.equal(leaked.leaked, true);
  assert.equal(leaked.synthetic, true);
  const control = evaluateHold({ released: true });
  assert.equal(control.leaked, false);
  assert.equal(control.releaseReason, "idle");
  const scored = scoreHoldLeak({
    cresset: true,
    holdLeak: true,
    reAdopt: true,
  });
  assert.equal(scored.cresset, true);
  assert.equal(scored.holdLeak, true);
  const quietPath = scoreHoldLeak({ released: true });
  assert.equal(quietPath.cresset, false);
  assert.equal(quietPath.released, true);
});

test("inspectors mark re-adopt and stalled", () => {
  const readopt = inspectReAdopt({ cresset: true, reAdopt: true });
  assert.equal(readopt.stamp, "re-adopt");
  assert.equal(readopt.leak, true);
  const stall = inspectStalled({ cresset: true, stalled: true });
  assert.equal(stall.stamp, "stalled");
  assert.equal(stall.leak, true);
  const scored = scoreGate({
    cresset: true,
    holdLeak: true,
    reAdopt: true,
    cue: "cresset",
  });
  assert.equal(scored.verdict, "cresset");
  const open = inspectReAdopt({ released: true, cresset: false });
  assert.equal(open.stamp, "ordinary-idle");
});

test("path word is hold-leak; booth seed holds the path", () => {
  assert.equal(PATH_WORD, "hold-leak");
  const result = analyze(seedHoldLeak());
  assert.equal(result.verdict, "hold-leak");
  assert.equal(result.pathWord, "hold-leak");
  assert.equal(result.hold, false);
  assert.equal(
    classify({
      seed: "hold-leak",
      preferSeed: true,
      cresset: true,
    }),
    "hold-leak",
  );
  assert.equal(classify({ seed: "re-adopt", preferSeed: true }), "re-adopt");
  assert.equal(score(seedHoldLeak()), "cresset");
});

test("HOLD includes released", () => {
  assert.ok(HOLD.includes("released"));
  assert.equal(HOLD.length, 1);
  assert.equal(classify({ seed: "slack", preferSeed: true }), "slack");
  assert.equal(classify({ seed: "yielding", preferSeed: true }), "yielding");
  assert.equal(classify({ seed: "extinguished", preferSeed: true }), "extinguished");
  assert.equal(classify({ seed: "idle-ok", preferSeed: true }), "idle-ok");
  assert.equal(classify({ seed: "suspend-ready", preferSeed: true }), "suspend-ready");
});

test("alarm chips: re-adopt, stalled, hold-leak, cresset", () => {
  assert.equal(classify({ seed: "re-adopt", preferSeed: true }), "re-adopt");
  assert.equal(classify(seedHoldLeak()), "hold-leak");
  assert.equal(classify(seedProduct()), "cresset");
  assert.equal(classify(seedReAdopt()), "re-adopt");
  assert.equal(classify(seedStalled()), "stalled");
  assert.equal(classify({ seed: "armed-grace", preferSeed: true }), "armed-grace");
});

test("booth fixtures flip released vs cresset vs hold-leak", () => {
  const idle = scoreGate(seedReleased());
  const seeded = scoreGate(seedCresset());
  const released = readData("released.json");
  const cresset = readData("cresset.json");
  const issued = readData("94420.json");
  const path = readData("hold-leak.json");
  assert.equal(idle.verdict, "released");
  assert.equal(seeded.verdict, "cresset");
  assert.notEqual(idle.verdict, seeded.verdict);
  assert.equal(score(seedReleased()), "released");
  assert.equal(score(seedCresset()), "cresset");
  assert.equal(score({ seed: "hold-leak", preferSeed: true }), "cresset");
  assert.equal(released.holdLeak, false);
  assert.equal(released.released, true);
  assert.equal(scoreGate(released).verdict, "released");
  assert.equal(cresset.holdLeak, true);
  assert.equal(cresset.reAdopt, true);
  assert.equal(classify(cresset), "cresset");
  assert.equal(issued.issue, 94420);
  assert.equal(classify(issued), "cresset");
  assert.equal(path.paths.length, 3);
  assert.match(path.paths[0].rule, /released|slack|yielding|extinguished|idle-ok|suspend-ready/i);
  assert.match(path.paths[1].result, /hold-leak|re-adopt|stalled/i);
  assert.equal(classify(path), "hold-leak");
  assert.equal(cresset.hubCount, "CRESSET");
  assert.equal(cresset.issue, 94420);
  assert.equal(cresset.cresset, true);
  assert.equal(classify(readData("slack.json")), "slack");
  assert.equal(classify(readData("yielding.json")), "yielding");
  assert.equal(classify(readData("extinguished.json")), "extinguished");
  assert.equal(classify(readData("idle-ok.json")), "idle-ok");
  assert.equal(classify(readData("suspend-ready.json")), "suspend-ready");
  assert.equal(classify(readData("re-adopt.json")), "re-adopt");
  assert.equal(classify(readData("stalled.json")), "stalled");
  assert.equal(classify(readData("armed-grace.json")), "armed-grace");
  assert.equal(classify(readData("inhibitor.json")), "inhibitor");
  assert.equal(classify(readData("gnome-suspend.json")), "gnome-suspend");
  assert.equal(classify(readData("code-session-claim.json")), "code-session-claim");
  assert.equal(classify(readData("remote-tools-ok.json")), "remote-tools-ok");
  assert.equal(classify(readData("battery-false.json")), "battery-false");
  assert.equal(classify(readData("landing.json")), "landing");
  assert.equal(classify(readData("cousins.json")), "cousins");
  assert.deepEqual(readData("cousins.json").issues, [94415, 94392, 93924]);
  assert.equal(classify(readData("backups.json")), "backups");
  assert.equal(classify(readData("walk.json")), "walk");
  assert.equal(classify(readData("has-repro.json")), "has-repro");
  assert.equal(classify(readData("fixtures.json")), "fixtures");
  assert.equal(classify(readData("closed.json")), "closed");
});

test("chips include idle, seeded, path, and walk", () => {
  assert.ok(CHIPS.includes("released"));
  assert.ok(CHIPS.includes("cresset"));
  assert.ok(CHIPS.includes("hold-leak"));
  assert.ok(CHIPS.includes("re-adopt"));
  assert.ok(CHIPS.includes("stalled"));
  assert.ok(CHIPS.includes("suspend-ready"));
  assert.ok(CHIPS.includes("fixtures"));
  assert.ok(CHIPS.includes("walk"));
  assert.ok(ALARM.includes("cresset"));
  assert.ok(ALARM.includes("hold-leak"));
  assert.ok(ALARM.includes("re-adopt"));
  assert.ok(ALARM.includes("stalled"));
  assert.ok(VERDICTS.includes("walk"));
  assert.equal(classify({ seed: "fixtures", preferSeed: true }), "fixtures");
  assert.equal(classify({ seed: "walk", preferSeed: true }), "walk");
});

test("published cresset walk scores cresset after the idle hold", () => {
  const booth = scoreWalk({ rows: CRESSET_WALK });
  assert.equal(booth.verdict, "cresset");
  assert.ok(booth.cressetCount >= 1);
  const idle = booth.rows.find((row) => row.event === "suspend-ready");
  assert.equal(idle.released, true);
  assert.equal(idle.verdict, "released");
  const cut = booth.rows.find((row) => row.event === "hold-leak");
  assert.equal(cut.holdLeak, true);
  const path = booth.rows.find(
    (row) => row.event === "hold-leak" && row.t === "path",
  );
  assert.equal(path.verdict, "hold-leak");
});

test("CRESSET_WALK constant matches the issue basket walk", () => {
  assert.equal(CRESSET_WALK[0].event, "suspend-ready");
  const cut = CRESSET_WALK.find((row) => row.event === "hold-leak");
  assert.equal(cut.holdLeak || cut.reAdopt, true);
  const path = CRESSET_WALK.find((row) => row.t === "path");
  assert.equal(path.cresset, true);
  const scoreRow = CRESSET_WALK.find((row) => row.event === "cresset");
  assert.equal(scoreRow.cresset, true);
  assert.equal(scoreRow.reAdopt, true);
});

test("positive control suspend-ready basket stays released", () => {
  const walk = scoreWalk({ rows: POSITIVE_CONTROL_WALK });
  assert.equal(walk.verdict, "released");
  const ok = walk.rows.find((row) => row.t === "hold");
  assert.equal(ok.verdict, "released");
  const hold = walk.rows.find((row) => row.event === "suspend-ready");
  assert.equal(hold.released, true);
  assert.equal(hold.verdict, "released");
});

test("issue constants encode only #94420 published facts", () => {
  assert.equal(FEATURED_ISSUE, 94420);
  assert.ok(ISSUE_URL.includes("94420"));
  assert.match(TITLE, /Keep computer awake|re-adopted|stalled|Linux/i);
  assert.equal(STATE, "OPEN");
  assert.match(PLATFORM, /linux/i);
  assert.match(HOST, /2\.1\.270|1\.52386\.6|Pop!_OS|GNOME Shell 42\.9/i);
  assert.equal(BUILD, "Claude Code 2.1.270; Claude Desktop 1.52386.6; claude-desktop .deb");
  assert.equal(SURFACE, "hold-leak");
  assert.deepEqual(
    [...LABELS],
    ["bug", "has repro", "platform:linux", "area:desktop"],
  );
  assert.equal(FIELD_MARKS.length, 6);
  assert.equal(BASKET_NAMES.length, 6);
  assert.ok(RULED_OUT.some((row) => /#94415/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /#94392/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /#93924/i.test(row)));
  assert.ok(EXPECTED.some((row) => /Code-session claim|re-adopted|stalled/i.test(row)));
  assert.match(
    DISTRIBUTION,
    /keep-awake|claude-desktop|armed_grace|stalled|15 minutes/i,
  );
  assert.equal(BOOTH_STATIONS.length, 6);
  assert.ok(FINGERPRINT_LINES.includes("hold-leak"));
  assert.ok(FINGERPRINT_LINES.includes("cresset"));
  assert.equal(PHRASE, "Score cresset or admit released.");
  assert.equal(SAMPLE_CRESSET_PROOF.holdLeak, true);
  assert.equal(SAMPLE_CRESSET_PROOF.names.length, 6);
  assert.equal(SAMPLE_CRESSET_PROOF.synthetic, true);
});

test("has-repro fingerprints encode the published cresset proof", () => {
  const result = handle(seedCresset());
  assert.equal(result.published.platform, "linux");
  assert.equal(result.published.surface, "hold-leak");
  assert.equal(result.published.host, HOST);
  assert.match(
    fingerprint(seedCresset()),
    /cresset\|kind=hold-leak\|ref=re-adopt\|path=hold-leak\|cue=hold-leak/,
  );
  assert.equal(classify({ seed: "has-repro", preferSeed: true }), "has-repro");
});

test("forbidden idle list includes prior catalog words", () => {
  const required = [
    "verbatim",
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
    "dictabelt",
    "lemure",
    "cancellans",
    "arras",
    "frangible",
    "nameplate",
    "matryoshka",
    "dragnet",
    "segment-drop",
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

test("released booth flips cresset back when the basket admits released", () => {
  const tape = {
    released: true,
    cresset: false,
    holdLeak: false,
    cue: "released",
  };
  assert.equal(scoreGate(tape).verdict, "released");
  tape.released = false;
  tape.cresset = true;
  tape.holdLeak = true;
  tape.cue = "cresset";
  assert.equal(scoreGate(tape).verdict, "cresset");
  tape.released = true;
  tape.cresset = false;
  tape.holdLeak = false;
  tape.cue = "released";
  assert.equal(scoreGate(tape).verdict, "released");
});

test("re-adopt, stall, inhibitor, and readBooth mark the cresset proof", () => {
  const readopt = inspectReAdopt({ cresset: true });
  assert.equal(readopt.stamp, "re-adopt");
  const stall = inspectStalled({ cresset: true, stalled: true });
  assert.equal(stall.stamp, "stalled");
  assert.equal(stall.leak, true);
  const booth = readBooth({
    cresset: true,
    holdLeak: true,
    reAdopt: true,
  });
  assert.equal(booth.cresset, true);
  assert.equal(booth.mark, "cresset");
  const open = readBooth({
    released: true,
    cresset: false,
    holdLeak: false,
  });
  assert.equal(open.cresset, false);
  assert.equal(open.mark, "released");
  assert.equal(inspectInhibitor({ cresset: true, inhibitor: true }).stamp, "inhibitor");
  assert.equal(inspectRemoteTools({ cresset: true, remoteToolsOk: true }).stamp, "remote-tools-ok");
  assert.equal(inspectArmedGrace({ cresset: true, armedGrace: true }).stamp, "armed-grace");
});

test("mapCresset encodes the published hold-leak", () => {
  const miss = mapCresset({ cresset: true, holdLeak: true });
  assert.equal(miss.stamp, "hold-leak");
  assert.equal(miss.holdingLane, "inhibitor");
  assert.equal(miss.ribbon, "cresset");
  const clear = mapCresset({ released: true, cresset: false });
  assert.equal(clear.stamp, "suspend-ready");
  assert.equal(clear.kindLane, "night-wall");
  assert.equal(clear.holdingLane, "suspend-ready");
});

test("cousins stay cite-only; products stay distinct; backups stay data-only", () => {
  assert.equal(COUSINS.length, 3);
  assert.deepEqual(COUSINS.map((row) => row.issue), [94415, 94392, 93924]);
  assert.ok(COUSINS.every((row) => row.citeOnly === true));
  assert.ok(NOT_PRODUCTS.includes("dictabelt"));
  assert.ok(NOT_PRODUCTS.includes("lemure"));
  assert.ok(NOT_PRODUCTS.includes("cancellans"));
  assert.ok(NOT_PRODUCTS.includes("arras"));
  assert.ok(NOT_PRODUCTS.includes("frangible"));
  assert.ok(NOT_PRODUCTS.includes("nameplate"));
  assert.equal(BACKUPS.length, 13);
  assert.equal(BACKUPS[0].issue, 94344);
  assert.equal(BACKUPS[12].issue, 94151);
  assert.ok(BACKUPS.every((row) => row.citeOnly === true));
  assert.ok(!BACKUPS.some((row) => row.issue === 94420));
  assert.ok(!COUSINS.some((row) => row.issue === 94420));
  assert.equal(classify({ seed: "cousins", preferSeed: true }), "cousins");
  assert.equal(classify({ seed: "backups", preferSeed: true }), "backups");
});

test("CLI scores fixtures without a server", () => {
  const idle = spawnSync(process.execPath, [modelPath()], { encoding: "utf8" });
  const seeded = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/cresset.json", import.meta.url))],
    { encoding: "utf8" },
  );
  const releasedFix = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/released.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(idle.status, 0, idle.stderr);
  assert.equal(seeded.status, 0, seeded.stderr);
  assert.equal(releasedFix.status, 0, releasedFix.stderr);
  const idleOut = JSON.parse(idle.stdout);
  const seededOut = JSON.parse(seeded.stdout);
  const releasedOut = JSON.parse(releasedFix.stdout);
  assert.equal(idleOut.verdict, "released");
  assert.equal(idleOut.hold, true);
  assert.equal(seededOut.verdict, "cresset");
  assert.equal(seededOut.alarm, true);
  assert.equal(releasedOut.verdict, "released");
  assert.equal(releasedOut.hold, true);
  assert.match(releasedOut.phrase, /admit released/);
});

test("handle exposes published hypothesis and #94420 headline", () => {
  const result = handle(seedCresset());
  assert.equal(result.published.issue, 94420);
  assert.equal(result.published.platform, "linux");
  assert.deepEqual(result.published.cousins, [94415, 94392, 93924]);
  assert.ok(result.published.backups.includes(94344));
  assert.ok(result.published.backups.includes(94151));
  assert.ok(!result.published.backups.includes(94420));
  assert.match(
    result.published.hypothesis,
    /re-adopt|stall|NON-BINDING|#94420/i,
  );
  assert.match(result.published.hypothesis, /NON-BINDING/);
  assert.match(result.published.hypothesis, /#94420/);
  assert.equal(result.published.build, BUILD);
});

test("model has no static node: imports so the night wall can score in-browser", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /^import .* from "node:/m);
  assert.match(source, /import\("node:fs"\)/);
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
});

test("night wall is a cresset booth, not wax-belt / lararium / binder / tapestry", () => {
  const page = readPage();
  assert.match(page, /family=Spectral|Spectral/);
  assert.match(page, /family=Outfit|Outfit/);
  assert.match(page, /JetBrains\+Mono|JetBrains Mono/);
  assert.match(
    page,
    /cresset|released|hold-leak|night-wall|iron-basket|ember-snuff|gnome-dial/i,
  );
  assert.match(page, /#E07020|#2A2E33|#E8E4DC|#0E1218|#F0C14A|#3D6F8C/i);
  assert.match(page, /\breleased\b/);
  assert.match(page, /\bcresset\b/);
  assert.match(page, /hold-leak/);
  assert.match(page, /Score cresset or admit released/i);
  assert.match(page, /#373/);
  assert.match(page, /#94420/);
  assert.match(page, /Admit released/);
  assert.match(page, /Score cresset/);
  assert.match(page, /Walk hold-leak/);
  assert.match(page, /Compare released \/ cresset/);
  assert.match(page, /Pin idle released/);
  assert.match(page, /Pin seeded cresset/);
  assert.match(page, /Pin hold-leak/);
  assert.match(page, /Stamp re-adopt/);
  assert.match(page, /Score booth/);
  assert.match(page, /cresset-score/);
  assert.match(
    page,
    /2\.1\.270|1\.52386\.6|claude-desktop|GNOME|Pop!_OS|armed_grace|15m/i,
  );
  assert.match(page, /night-wall|iron-basket|ember-snuff|gnome-dial|hold-ledger|armed-grace/i);
  assert.match(
    page,
    /<svg[\s\S]*class="iron-cresset"|class="gnome-dial"|class="night-wall"|class="hold-ledger"|class="ember-core"/i,
  );
  assert.doesNotMatch(page, /family=Playfair\+Display|Playfair Display/);
  assert.doesNotMatch(page, /family=Manrope|Manrope/);
  assert.doesNotMatch(page, /IBM\+Plex\+Mono|IBM Plex Mono/);
  assert.doesNotMatch(page, /family=Bodoni\+Moda|Bodoni Moda/);
  assert.doesNotMatch(page, /family=Figtree|Figtree/);
  assert.doesNotMatch(page, /Fira\+Code|Fira Code/);
  assert.doesNotMatch(page, /family=Fraunces|Fraunces/);
  assert.doesNotMatch(page, /family=Karla|Karla/);
  assert.doesNotMatch(page, /family=Cinzel|Cinzel/);
  assert.doesNotMatch(page, /family=Libre\+Baskerville|Libre Baskerville/);
  assert.doesNotMatch(page, /#C9893A|#F4EFE4|#1A1612|#D64545|#4A5560|#2F6B4F/);
  assert.doesNotMatch(page, /#A39888|#F7F4EC|#120E0C|#C17A3A|#16182F|#E24A32/);
  assert.doesNotMatch(page, /#1B2430|#C23B22|#F4ECD8|#0D0C0A|#E0A100|#2A9D8F/);
  assert.doesNotMatch(page, /wax-belt|stenotype|steel-drum|gooseneck-mic|live-stylus/);
  assert.doesNotMatch(page, /binder-cloth|cancelled-stamp|folio-press|sewing-thread|replacement-leaf/);
  assert.doesNotMatch(page, /salt-circle|bean-rite|ember-tick|ashlar-wall/i);
  assert.doesNotMatch(page, /theater|tapestry|curtain-aisle|gallery-wing|Polonius|proscenium/i);
  assert.doesNotMatch(page, /admit verbatim|Score dictabelt|idle verbatim/i);
  assert.doesNotMatch(page, /admit quiet|Score lemure|idle quiet/i);
  assert.doesNotMatch(page, /admit intact|Score cancellans|idle intact/i);
  assert.doesNotMatch(page, /admit cleared|Score arras|idle cleared/i);
  assert.doesNotMatch(page, /\bdictabelt\b/);
  assert.doesNotMatch(page, /\blemure\b/);
  assert.doesNotMatch(page, /\bcancellans\b/);
  assert.doesNotMatch(page, /\barras\b/);
  assert.doesNotMatch(page, /\bfrangible\b/);
  assert.doesNotMatch(page, /segment-drop/);
  assert.doesNotMatch(page, /orphan-tick/);
  assert.doesNotMatch(page, /phantom-prompt/);
  assert.doesNotMatch(page, /deferred-delta/);
  assert.match(page, /NOT Dictabelt/i);
  assert.match(page, /NOT Lemure/i);
  assert.match(page, /NOT Cancellans/i);
  assert.match(page, /NOT Arras/i);
  assert.match(page, /#94415/);
  assert.match(page, /#94392/);
  assert.match(page, /#93924/);
  assert.doesNotMatch(page, /fetch\(/);
  assert.match(page, /body\.embed/);
});

test("README states the thesis, anti-clone, and how to score", () => {
  const readme = readReadme();
  assert.match(readme, /Cresset/);
  assert.match(readme, /#94420/);
  assert.match(readme, /\breleased\b/);
  assert.match(readme, /\bcresset\b/);
  assert.match(readme, /hold-leak/);
  assert.match(readme, /Spectral/);
  assert.match(readme, /Outfit/);
  assert.match(readme, /JetBrains Mono/);
  assert.doesNotMatch(readme, /Playfair Display/);
  assert.doesNotMatch(readme, /Manrope/);
  assert.doesNotMatch(readme, /Figtree/);
  assert.doesNotMatch(readme, /Bodoni Moda/);
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /Research brief/i);
  assert.match(readme, /2\.1\.270|claude-desktop|GNOME|Pop!_OS|armed_grace|15/i);
  assert.match(readme, /NOT #94415/);
  assert.match(readme, /NOT #94392/);
  assert.match(readme, /NOT #93924/);
  assert.match(readme, /NOT Dictabelt\/#94406/);
  assert.match(readme, /NOT Lemure\/#94410/);
  assert.match(readme, /NOT Cancellans\/#94400/);
  assert.match(readme, /#94415/);
  assert.match(readme, /#94392/);
  assert.match(readme, /#93924/);
  assert.match(readme, /do NOT rebuild|do not conflate/i);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/cresset/);
  assert.match(readme, /node --test projects\/cresset\/cresset\.test\.mjs/);
  assert.match(readme, /NON-BINDING/);
  assert.match(readme, /iron fire-basket|night-wall|GNOME-suspend|cresset/i);
  assert.match(readme, /Score cresset or admit released/);
  assert.match(readme, /#94344|#94398|#94151/);
  assert.match(readme, /13:50/);
  assert.match(readme, /Do NOT implement a fix/i);
  assert.doesNotMatch(readme, /wax-belt|stenotype|millimeter-slider|leftover-instrument/);
  const runLog = readFileSync(
    fileURLToPath(new URL("../../RUN_LOG.md", import.meta.url)),
    "utf8",
  );
  assert.match(runLog, /## 2026-09-15 — Cresset/);
  assert.match(runLog, /13:50/);
});

test("catalog features Cresset only; Dictabelt unfeatured; product count 373", () => {
  const catalog = readCatalog();
  const hub = readHubCatalog();
  assert.equal(catalog.products.length, 373);
  assert.equal(hub.products.length, 373);
  assert.equal(catalog.products[0].name, "Cresset");
  assert.equal(catalog.products[0].slug, "cresset");
  assert.equal(catalog.products[0].featured, true);
  assert.equal(catalog.products[0].href, "/cresset/");
  assert.equal(catalog.products[0].day, "2026-09-15");
  assert.equal(catalog.products[0].summary, CATALOG_SUMMARY);
  assert.equal(hub.products[0].summary, catalog.products[0].summary);
  assert.match(catalog.products[0].summary, /\breleased\b/);
  assert.match(catalog.products[0].summary, /\bcresset\b/);
  assert.match(catalog.products[0].summary, /hold-leak/);
  assert.match(catalog.products[0].summary, /Score cresset or admit released/);
  assert.match(catalog.products[0].summary, /#94420/);
  assert.match(catalog.products[0].summary, /13:50/);
  assert.equal(hub.products[0].slug, "cresset");
  assert.equal(hub.products[0].featured, true);
  const dictabelt = catalog.products.find((row) => row.slug === "dictabelt");
  assert.ok(dictabelt);
  assert.equal(dictabelt.featured, false);
  const lemure = catalog.products.find((row) => row.slug === "lemure");
  assert.ok(lemure);
  assert.equal(lemure.featured, false);
  assert.equal(catalog.products.filter((row) => row.featured).length, 1);
  assert.equal(catalog.products.filter((row) => row.slug === "cresset").length, 1);
  assert.ok(
    !catalog.products.some(
      (row) => String(row.summary || "").includes("94420") && row.slug !== "cresset",
    ),
  );
});

test("vercel rewrites cresset to the project folder at the top", () => {
  const vercel = readVercel();
  assert.equal(vercel.rewrites[0].source, "/cresset");
  assert.equal(vercel.rewrites[0].destination, "/projects/cresset");
  assert.equal(vercel.rewrites[1].source, "/cresset/");
  assert.equal(vercel.rewrites[1].destination, "/projects/cresset");
  assert.equal(vercel.rewrites[2].source, "/cresset/:path*");
  assert.equal(vercel.rewrites[2].destination, "/projects/cresset/:path*");
  assert.equal(vercel.rewrites[3].source, "/dictabelt");
  assert.equal(vercel.rewrites[3].destination, "/projects/dictabelt");
});

test("no leftover clone / wax-belt / stenotype content", () => {
  const page = readPage();
  const readme = readReadme();
  const source = readFileSync(modelPath(), "utf8");
  for (const blob of [page, readme, source]) {
    assert.doesNotMatch(blob, /wax-belt|stenotype|steel-drum|gooseneck-mic|live-stylus/i);
  }
});

test("no network calls in the model or tests", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
  assert.doesNotMatch(source, /https?:\/\/[^\s"']*anthropic\.com\/v1/);
});
