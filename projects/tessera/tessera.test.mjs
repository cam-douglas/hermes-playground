import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ALARM,
  BACKUPS,
  BOOTH_STATIONS,
  BUNDLE_INODE,
  BUNDLE_MTIME,
  BUNDLE_PATH,
  CHECKED_ON,
  CHIPS,
  CLAUDE_VERSION,
  COUSINS,
  DISTRIBUTION,
  EXPECTED,
  FEATURED_ISSUE,
  FIELD_MARKS,
  FINGERPRINT_LINES,
  FORBIDDEN_IDLE,
  FORBIDDEN_SEED,
  GOOD_VERSION,
  HOLD,
  HOLD_ALIASES,
  HOST,
  IDLE_WORD,
  ISSUE_URL,
  LABELS,
  LIVE_INODE,
  LIVE_PATH,
  NOT_PRODUCTS,
  PATH_WORD,
  PHRASE,
  PLATFORM,
  POSITIVE_CONTROL_WALK,
  PRIOR_REPORTS,
  PRODUCT_WORD,
  RULED_OUT,
  SAMPLE_BUNDLE,
  SAMPLE_LIVE,
  SAMPLE_PATH,
  SAMPLE_TESSELLATED_PROOF,
  SEEDED_WORD,
  SIGNING_ID,
  STATE,
  SURFACE,
  TEAM_ID,
  TESSERA_WALK,
  TITLE,
  TCC_PANES,
  TCCUTIL,
  VERDICTS,
  VERSION_DIR,
  analyze,
  classify,
  decide,
  emptyTicket,
  fingerprint,
  handle,
  inspectBundle,
  inspectPath,
  inspectTcc,
  mapPane,
  readBooth,
  score,
  scoreGate,
  scoreWalk,
  seedHold,
  seedStaleTccRow,
  seedTessellated,
  seedTessera,
  seedUnitary,
  seedVersionPathTcc,
  seedBareVersionLabel,
} from "./tessera.mjs";

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
  return fileURLToPath(new URL("./tessera.mjs", import.meta.url));
}

test("idle unitary is a hold; one TCC identity on a stable path", () => {
  const result = analyze(seedUnitary());
  assert.equal(result.verdict, "unitary");
  assert.equal(result.idleWord, "unitary");
  assert.equal(IDLE_WORD, "unitary");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.unitary, true);
  assert.equal(result.phrase, "admit unitary");
  assert.equal(result.tessellated, false);
  assert.equal(result.versionPathTcc, false);
  assert.ok(HOLD_ALIASES.includes("unitary"));
  assert.ok(HOLD_ALIASES.includes("bundled"));
  assert.ok(HOLD_ALIASES.includes("stable-path"));
  assert.ok(HOLD_ALIASES.includes("one-row"));
  assert.ok(HOLD_ALIASES.includes("identity-kept"));
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(result.idleWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("empty ticket and empty stdin classify unitary", () => {
  assert.equal(classify(emptyTicket()), "unitary");
  assert.equal(classify(""), "unitary");
  assert.equal(classify(null), "unitary");
  assert.equal(decide({}), "unitary");
});

test("#93929 seeded path scores tessera when the pane is tessellated", () => {
  const result = analyze(seedTessellated());
  assert.equal(result.verdict, "tessera");
  assert.equal(result.seededWord, "tessellated");
  assert.equal(SEEDED_WORD, "tessellated");
  assert.equal(PRODUCT_WORD, "tessera");
  assert.equal(result.hold, false);
  assert.equal(result.alarm, true);
  assert.equal(result.tessellated, true);
  assert.equal(result.phrase, "score tessera");
  assert.equal(result.versionPathTcc, true);
  assert.equal(result.staleTccRow, true);
  for (const word of FORBIDDEN_SEED) {
    assert.notEqual(result.seededWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("version-path-tcc plus stale TCC row is the #93929 tessera", () => {
  const cut = inspectPath({ tessellated: true, versionPathTcc: true });
  assert.equal(cut.stamp, "version-path-tcc");
  assert.equal(cut.versioned, true);
  const scored = scoreGate({
    tessellated: true,
    versionPathTcc: true,
    staleTccRow: true,
    bareVersionLabel: true,
    cue: "tessellated",
    path: SAMPLE_PATH,
    bundle: SAMPLE_BUNDLE,
  });
  assert.equal(scored.verdict, "tessera");
  assert.equal(scored.versionPathTcc, true);
  const open = inspectPath({ unitary: true, versionPathTcc: false });
  assert.equal(open.stamp, "stable-path");
});

test("path word is version-path-tcc; versioned path seed holds the path", () => {
  assert.equal(PATH_WORD, "version-path-tcc");
  const result = analyze(seedVersionPathTcc());
  assert.equal(result.verdict, "version-path-tcc");
  assert.equal(result.pathWord, "version-path-tcc");
  assert.equal(result.hold, false);
  assert.equal(
    classify({ seed: "version-path-tcc", preferSeed: true, tessellated: true }),
    "version-path-tcc",
  );
  assert.equal(classify(seedStaleTccRow()), "stale-tcc-row");
});

test("HOLD includes unitary / hold", () => {
  assert.ok(HOLD.includes("unitary"));
  assert.ok(HOLD.includes("hold"));
  const hold = analyze(seedHold());
  assert.equal(hold.verdict, "hold");
  assert.equal(hold.hold, true);
  assert.equal(classify({ seed: "hold", preferSeed: true }), "hold");
});

test("alarm chips: stale-tcc-row, bare-version-label, tessera", () => {
  assert.equal(classify(seedStaleTccRow()), "stale-tcc-row");
  assert.equal(classify(seedBareVersionLabel()), "bare-version-label");
  assert.equal(classify(seedTessera()), "tessera");
});

test("booth fixtures flip unitary vs tessellated vs version-path-tcc vs tessera", () => {
  const idle = scoreGate(seedUnitary());
  const seeded = scoreGate(seedTessellated());
  const unitary = readData("unitary.json");
  const tessellated = readData("tessellated.json");
  const path = readData("version-path-tcc.json");
  const product = readData("tessera.json");
  const holdFix = readData("hold.json");
  assert.equal(idle.verdict, "unitary");
  assert.equal(seeded.verdict, "tessera");
  assert.notEqual(idle.verdict, seeded.verdict);
  assert.equal(score(seedUnitary()), "unitary");
  assert.equal(score(seedTessellated()), "tessera");
  assert.equal(unitary.versionPathTcc, false);
  assert.equal(unitary.unitary, true);
  assert.equal(scoreGate(unitary).verdict, "unitary");
  assert.equal(tessellated.versionPathTcc, true);
  assert.equal(tessellated.staleTccRow, true);
  assert.equal(tessellated.bareVersionLabel, true);
  assert.equal(classify(tessellated), "tessellated");
  assert.equal(path.paths.length, 3);
  assert.match(path.paths[0].rule, /Claude\.app|bundle|version-independent|TCC|identity/i);
  assert.match(path.paths[1].result, /2\.1\.263|versions|tccutil|Jul 14|Q6L2SF6YDW/i);
  assert.equal(classify(path), "version-path-tcc");
  assert.equal(classify(product), "tessera");
  assert.equal(product.hubCount, "TESSERA");
  assert.equal(tessellated.issue, 93929);
  assert.equal(tessellated.tessellated, true);
  assert.equal(classify(holdFix), "hold");
  assert.equal(classify(readData("bundled.json")), "bundled");
  assert.equal(classify(readData("bare-version-label.json")), "bare-version-label");
  assert.equal(classify(readData("stale-tcc-row.json")), "stale-tcc-row");
  assert.equal(classify(readData("live-versioned.json")), "live-versioned");
  assert.equal(classify(readData("stable-path.json")), "stable-path");
  assert.equal(classify(readData("one-row.json")), "one-row");
  assert.equal(classify(readData("identity-kept.json")), "identity-kept");
  assert.equal(classify(readData("bundle-frozen.json")), "bundle-frozen");
  assert.equal(classify(readData("cousins.json")), "cousins");
  assert.equal(classify(readData("backups.json")), "backups");
  assert.equal(classify(readData("walk.json")), "walk");
  assert.equal(classify(readData("has-repro.json")), "has-repro");
  assert.equal(classify(readData("fixtures.json")), "fixtures");
});

test("chips include idle, seeded, path, and walk", () => {
  assert.ok(CHIPS.includes("unitary"));
  assert.ok(CHIPS.includes("tessellated"));
  assert.ok(CHIPS.includes("tessera"));
  assert.ok(CHIPS.includes("version-path-tcc"));
  assert.ok(CHIPS.includes("stale-tcc-row"));
  assert.ok(CHIPS.includes("live-versioned"));
  assert.ok(CHIPS.includes("bundled"));
  assert.ok(CHIPS.includes("stable-path"));
  assert.ok(CHIPS.includes("fixtures"));
  assert.ok(CHIPS.includes("walk"));
  assert.ok(ALARM.includes("tessellated"));
  assert.ok(ALARM.includes("version-path-tcc"));
  assert.ok(ALARM.includes("stale-tcc-row"));
  assert.ok(ALARM.includes("tessera"));
  assert.ok(VERDICTS.includes("walk"));
  assert.equal(classify({ seed: "fixtures", preferSeed: true }), "fixtures");
  assert.equal(classify({ seed: "walk", preferSeed: true }), "walk");
});

test("published tessera walk scores tessera after the idle hold", () => {
  const booth = scoreWalk({ rows: TESSERA_WALK });
  assert.equal(booth.verdict, "tessera");
  assert.ok(booth.tessellatedCount >= 1);
  const idle = booth.rows.find((row) => row.event === "cue-unitary");
  assert.equal(idle.unitary, true);
  assert.equal(idle.verdict, "unitary");
  const cut = booth.rows.find((row) => row.event === "version-path-tcc");
  assert.equal(cut.versionPathTcc, true);
  const path = booth.rows.find((row) => row.event === "version-path-tcc" && row.t === "path");
  assert.equal(path.verdict, "version-path-tcc");
});

test("TESSERA_WALK constant matches the issue pane walk", () => {
  assert.equal(TESSERA_WALK[0].event, "cue-unitary");
  const cut = TESSERA_WALK.find((row) => row.event === "version-path-tcc");
  assert.equal(cut.versionPathTcc, true);
  const path = TESSERA_WALK.find((row) => row.t === "path");
  assert.equal(path.tessellated, true);
  const scoreRow = TESSERA_WALK.find((row) => row.event === "tessera");
  assert.equal(scoreRow.tessellated, true);
});

test("positive control unitary pane stays unitary", () => {
  const walk = scoreWalk({ rows: POSITIVE_CONTROL_WALK });
  assert.equal(walk.verdict, "unitary");
  const ok = walk.rows.find((row) => row.t === "hold");
  assert.equal(ok.verdict, "unitary");
  const hold = walk.rows.find((row) => row.event === "cue-unitary");
  assert.equal(hold.unitary, true);
  assert.equal(hold.verdict, "unitary");
});

test("issue constants encode only #93929 published facts", () => {
  assert.equal(FEATURED_ISSUE, 93929);
  assert.ok(ISSUE_URL.includes("93929"));
  assert.match(TITLE, /macOS|permission|version-named|signing|#76615/i);
  assert.equal(STATE, "OPEN");
  assert.equal(PLATFORM, "macos");
  assert.match(HOST, /macOS 27\.0|26A428/);
  assert.equal(CHECKED_ON, "2026-09-12");
  assert.equal(CLAUDE_VERSION, "2.1.263");
  assert.match(GOOD_VERSION, /Claude\.app|version-independent|TCC/i);
  assert.equal(SURFACE, "native-macos-installer");
  assert.equal(VERSION_DIR, "~/.local/share/claude/versions/<version>");
  assert.equal(LIVE_PATH, "~/.local/share/claude/versions/2.1.263");
  assert.equal(BUNDLE_PATH, "~/.local/share/claude/ClaudeCode.app/Contents/MacOS/claude");
  assert.equal(BUNDLE_INODE, 319832836);
  assert.equal(BUNDLE_MTIME, "2026-07-14 23:48");
  assert.equal(LIVE_INODE, 336626048);
  assert.equal(SIGNING_ID, "com.anthropic.claude-code");
  assert.equal(TEAM_ID, "Q6L2SF6YDW");
  assert.deepEqual([...TCC_PANES], ["App Management", "Files & Folders"]);
  assert.equal(TCCUTIL, "tccutil cannot target a path");
  assert.deepEqual([...PRIOR_REPORTS], [76615, 38722]);
  assert.deepEqual([...LABELS], [
    "bug",
    "has repro",
    "platform:macos",
    "area:packaging",
  ]);
  assert.equal(FIELD_MARKS.length, 4);
  assert.ok(RULED_OUT.some((row) => /signing identity|Q6L2SF6YDW/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /tccutil|remove control/i.test(row)));
  assert.ok(EXPECTED.some((row) => /persistent|Claude Code|version-independent/i.test(row)));
  assert.match(DISTRIBUTION, /2\.1\.263|319832836|Q6L2SF6YDW|#76080|#93747|#76615/i);
  assert.equal(BOOTH_STATIONS.length, 5);
  assert.ok(FINGERPRINT_LINES.includes("version-path-tcc"));
  assert.ok(FINGERPRINT_LINES.includes("tessellated"));
  assert.equal(PHRASE, "Score tessera or admit unitary.");
  assert.equal(SAMPLE_TESSELLATED_PROOF.versionPathTcc, true);
  assert.equal(SAMPLE_BUNDLE.inode, 319832836);
  assert.equal(SAMPLE_LIVE.version, "2.1.263");
});

test("has-repro fingerprints encode the published tessellated proof", () => {
  const result = handle(seedTessellated());
  assert.equal(result.published.platform, "macos");
  assert.equal(result.published.surface, "native-macos-installer");
  assert.equal(result.published.claudeVersion, CLAUDE_VERSION);
  assert.match(
    fingerprint(seedTessellated()),
    /tessera\|path=versioned\|tcc=stale\|path=version-path-tcc\|cue=version-path-tcc/,
  );
  assert.equal(classify({ seed: "has-repro", preferSeed: true }), "has-repro");
});

test("forbidden idle list includes recent catalog words including Mojibake, Scissel, Feoffee, Apograph, Airlock", () => {
  const required = [
    "verbatim",
    "mojibaked",
    "mojibake",
    "fffd-spall",
    "plenary",
    "scisselled",
    "scissel",
    "argv-trunc",
    "vested",
    "unseised",
    "preview-eperm",
    "feoffee",
    "singular",
    "apographed",
    "apograph",
    "reopen-fork",
    "airlock",
    "equalized",
    "blown",
    "socat-race",
    "scotoma",
    "legible",
    "scotomized",
    "command-args-blind",
    "aneroid",
    "calibrated",
    "aneroided",
    "wrong-window-ring",
    "simulacrum",
    "tethered",
    "hollow",
    "phantom-navigate",
    "solenoid",
    "engaged",
    "inert",
    "warm-before-message",
    "scotia",
    "scotiated",
    "decstbm-undershoot",
    "flush",
    "canard",
    "candid",
    "canarded",
    "onedrive-cwd",
    "stetted",
    "rewound",
    "stet",
    "mic-resume-wipe",
    "sighted",
    "blindsided",
    "blindside",
    "compare-ref-unreachable",
    "scoped",
    "interdicted",
    "interdict",
    "chrome-prohibit-bleed",
    "gleaned",
    "orphaned",
    "inherited",
    "gleaner",
    "live",
    "schismed",
    "schism",
    "swept",
    "ashpanned",
    "ashpan",
    "seised",
    "disseised",
    "disseisin",
    "intact",
    "rasure",
    "keyed",
    "voiced",
    "muted",
    "sourdine",
    "aphonia",
    "released",
    "frozen",
    "sostenuto",
    "tabula",
    "rescript",
    "cachet",
    "ukase",
    "scapegoat",
    "galley",
    "stop-dirty",
    "primed",
    "warm",
    "armed",
    "coil-pulled",
  ];
  for (const word of required) {
    assert.ok(FORBIDDEN_IDLE.includes(word), `missing forbidden idle ${word}`);
  }
});

test("unitary booth flips tessellated back when the pane keeps one tile", () => {
  const tape = {
    unitary: true,
    tessellated: false,
    versionPathTcc: false,
    cue: "unitary",
  };
  assert.equal(scoreGate(tape).verdict, "unitary");
  tape.unitary = false;
  tape.tessellated = true;
  tape.versionPathTcc = true;
  tape.staleTccRow = true;
  tape.cue = "tessellated";
  assert.equal(scoreGate(tape).verdict, "tessera");
  tape.unitary = true;
  tape.tessellated = false;
  tape.versionPathTcc = false;
  tape.staleTccRow = false;
  tape.cue = "unitary";
  assert.equal(scoreGate(tape).verdict, "unitary");
});

test("path, tcc, bundle, and readBooth mark the tessellated proof", () => {
  const idle = inspectPath({
    unitary: true,
    path: { livePath: BUNDLE_PATH },
  });
  assert.equal(idle.stamp, "stable-path");
  const tcc = inspectTcc({ tessellated: true, tcc: { rowLabel: "bare version number" } });
  assert.equal(tcc.stamp, "stale-tcc-row");
  assert.equal(tcc.stale, true);
  const bundle = inspectBundle({ unitary: true, bundled: true });
  assert.equal(bundle.stamp, "bundled");
  const booth = readBooth({
    tessellated: true,
    versionPathTcc: true,
    path: SAMPLE_PATH,
  });
  assert.equal(booth.tessellated, true);
  assert.equal(booth.mark, "tessellated");
  const open = readBooth({
    unitary: true,
    tessellated: false,
    versionPathTcc: false,
  });
  assert.equal(open.tessellated, false);
  assert.equal(open.mark, "unitary");
});

test("mapPane encodes the published version-tile scree", () => {
  const miss = mapPane({ tessellated: true, versionPathTcc: true });
  assert.equal(miss.stamp, "version-path-tcc");
  assert.equal(miss.tileLane, "scree");
  assert.equal(miss.seal, "tessellated");
  const clear = mapPane({ unitary: true, tessellated: false });
  assert.equal(clear.stamp, "unitary-pane");
  assert.equal(clear.tileLane, "unitary");
  assert.equal(clear.groutLane, "one-row");
});

test("cousins are cite-only; products stay distinct; backups stay data-only", () => {
  assert.equal(COUSINS.length, 4);
  assert.equal(COUSINS[0].issue, 76615);
  assert.equal(COUSINS[1].issue, 38722);
  assert.equal(COUSINS[2].issue, 76080);
  assert.equal(COUSINS[3].issue, 93747);
  assert.ok(COUSINS.every((row) => row.citeOnly === true));
  assert.ok(NOT_PRODUCTS.includes("mojibake"));
  assert.ok(NOT_PRODUCTS.includes("scissel"));
  assert.ok(NOT_PRODUCTS.includes("feoffee"));
  assert.ok(NOT_PRODUCTS.includes("apograph"));
  assert.ok(NOT_PRODUCTS.includes("airlock"));
  assert.ok(NOT_PRODUCTS.includes("scotoma"));
  assert.ok(NOT_PRODUCTS.includes("aneroid"));
  assert.ok(NOT_PRODUCTS.includes("canard"));
  assert.ok(NOT_PRODUCTS.includes("stet"));
  assert.ok(NOT_PRODUCTS.includes("blindside"));
  assert.ok(NOT_PRODUCTS.includes("interdict"));
  assert.ok(NOT_PRODUCTS.includes("schism"));
  assert.ok(NOT_PRODUCTS.includes("gleaner"));
  assert.ok(NOT_PRODUCTS.includes("waif"));
  assert.ok(NOT_PRODUCTS.includes("ashpan"));
  assert.ok(NOT_PRODUCTS.includes("disseisin"));
  assert.ok(NOT_PRODUCTS.includes("simplex"));
  assert.ok(NOT_PRODUCTS.includes("deadkey"));
  assert.ok(NOT_PRODUCTS.includes("galley"));
  assert.ok(NOT_PRODUCTS.includes("changeling"));
  assert.equal(BACKUPS.length, 11);
  assert.equal(BACKUPS[0].issue, 93772);
  assert.equal(BACKUPS[1].issue, 93770);
  assert.equal(BACKUPS[2].issue, 93777);
  assert.equal(BACKUPS[3].issue, 93782);
  assert.equal(BACKUPS[4].issue, 93889);
  assert.equal(BACKUPS[5].issue, 93821);
  assert.equal(BACKUPS[6].issue, 93811);
  assert.equal(BACKUPS[7].issue, 93809);
  assert.equal(BACKUPS[8].issue, 93823);
  assert.equal(BACKUPS[9].issue, 93924);
  assert.equal(BACKUPS[10].issue, 93925);
  assert.ok(BACKUPS.every((row) => row.citeOnly === true));
  assert.ok(!BACKUPS.some((row) => row.issue === 93929));
  assert.ok(!BACKUPS.some((row) => row.issue === 76615));
  assert.ok(!BACKUPS.some((row) => row.issue === 38722));
  assert.ok(!BACKUPS.some((row) => row.issue === 76080));
  assert.ok(!BACKUPS.some((row) => row.issue === 93747));
  assert.equal(classify({ seed: "cousins", preferSeed: true }), "cousins");
  assert.equal(classify({ seed: "backups", preferSeed: true }), "backups");
});

test("CLI scores fixtures without a server", () => {
  const idle = spawnSync(process.execPath, [modelPath()], { encoding: "utf8" });
  const seeded = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/tessellated.json", import.meta.url))],
    { encoding: "utf8" },
  );
  const unitaryFix = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/unitary.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(idle.status, 0, idle.stderr);
  assert.equal(seeded.status, 0, seeded.stderr);
  assert.equal(unitaryFix.status, 0, unitaryFix.stderr);
  const idleOut = JSON.parse(idle.stdout);
  const seededOut = JSON.parse(seeded.stdout);
  const unitaryOut = JSON.parse(unitaryFix.stdout);
  assert.equal(idleOut.verdict, "unitary");
  assert.equal(idleOut.hold, true);
  assert.equal(seededOut.verdict, "tessellated");
  assert.equal(seededOut.alarm, true);
  assert.equal(unitaryOut.verdict, "unitary");
  assert.equal(unitaryOut.hold, true);
});

test("handle exposes published hypothesis and #93929 headline", () => {
  const result = handle(seedTessellated());
  assert.equal(result.published.issue, 93929);
  assert.equal(result.published.platform, "macos");
  assert.deepEqual(result.published.cousins, [76615, 38722, 76080, 93747]);
  assert.ok(result.published.backups.includes(93772));
  assert.ok(result.published.backups.includes(93924));
  assert.ok(result.published.backups.includes(93925));
  assert.ok(!result.published.backups.includes(93929));
  assert.match(result.published.hypothesis, /TCC|version-named|Q6L2SF6YDW|NON-BINDING/i);
  assert.match(result.published.hypothesis, /NON-BINDING/);
  assert.match(result.published.hypothesis, /#93929/);
  assert.equal(result.published.bundleInode, 319832836);
  assert.equal(result.published.signingId, "com.anthropic.claude-code");
});

test("model has no static node: imports so the living page can score in-browser", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /^import .* from "node:/m);
  assert.match(source, /import\("node:fs"\)/);
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
});

test("living page is a mosaic / tesserae / privacy-pane booth, not mojibake or scissel", () => {
  const page = readPage();
  assert.match(page, /Big Shoulders Display|Big\+Shoulders\+Display/);
  assert.match(page, /DM Sans|DM\+Sans/);
  assert.match(page, /DM Mono|DM\+Mono/);
  assert.match(page, /tessera|unitary|tessellated|version-path-tcc|mosaic|tesserae|privacy-pane/i);
  assert.match(page, /#E8E2D6|#1C1A17|#C4A35A|#3F6F5C|#8B3A3A|#F7F3EA/i);
  assert.match(page, /\bunitary\b/);
  assert.match(page, /\btessellated\b/);
  assert.match(page, /version-path-tcc/);
  assert.match(page, /Score tessera or admit unitary/i);
  assert.match(page, /#76615|#38722|#76080|#93747|cousin/i);
  assert.match(page, /#331/);
  assert.match(page, /#93929/);
  assert.match(page, /Admit unitary/);
  assert.match(page, /Score tessera/);
  assert.match(page, /Walk version-path-tcc/);
  assert.match(page, /Compare unitary \/ tessellated/);
  assert.match(page, /Pin idle unitary/);
  assert.match(page, /Pin seeded tessellated/);
  assert.match(page, /Pin version-path-tcc/);
  assert.match(page, /Press the grout/);
  assert.match(page, /2\.1\.263|macOS 27\.0|Q6L2SF6YDW|tccutil|319832836/i);
  assert.match(page, /tessera|mosaic|grout|privacy pane|limestone/i);
  assert.doesNotMatch(page, /Syne/);
  assert.doesNotMatch(page, /Source Sans 3|Source\+Sans\+3/);
  assert.doesNotMatch(page, /JetBrains Mono|JetBrains\+Mono/);
  assert.doesNotMatch(page, /Oswald/);
  assert.doesNotMatch(page, /IBM Plex Sans|IBM\+Plex\+Sans/);
  assert.doesNotMatch(page, /IBM Plex Mono|IBM\+Plex\+Mono/);
  assert.doesNotMatch(page, /Cinzel/);
  assert.doesNotMatch(page, /EB Garamond|EB\+Garamond/);
  assert.doesNotMatch(page, /Fira Code|Fira\+Code/);
  assert.doesNotMatch(page, /#F4EFE6/);
  assert.doesNotMatch(page, /#C41E6A/);
  assert.doesNotMatch(page, /#C9892E/);
  assert.doesNotMatch(page, /#1F6F6A/);
  assert.doesNotMatch(page, /#121417/);
  assert.doesNotMatch(page, /#C8CED6/);
  assert.doesNotMatch(page, /#B87333/);
  assert.doesNotMatch(page, /#2C2118/);
  assert.doesNotMatch(page, /#F3E6C8/);
  assert.doesNotMatch(page, /#7A1F1F/);
  assert.doesNotMatch(page, /#B08D57/);
  assert.doesNotMatch(page, /#3F5D4A/);
  assert.doesNotMatch(page, /Humphrey|perimetry|visual-field|fixation/i);
  assert.doesNotMatch(page, /submarine|spacecraft|socat|TCP-LISTEN|3128|1080/i);
  assert.doesNotMatch(page, /aneroid-barometer|instrument-panel|sealed gauge|barograph/i);
  assert.doesNotMatch(page, /autoCompactWindow/);
  assert.doesNotMatch(page, /press-room|newspaper-canard|duck-press|wire ticker|ENOENT stamp/i);
  assert.doesNotMatch(page, /copy-desk|blue-pencil|stet\. underline/i);
  assert.doesNotMatch(page, /papal-bull|diocese territory|vellum blotter/i);
  assert.doesNotMatch(page, /typewriter platen|dead-key lever|carbon platen/i);
  assert.doesNotMatch(page, /stacked parchment leaves|session-ID wax seal|MB chain/i);
  assert.doesNotMatch(page, /twin glass|dual-writer|Resuming agent/i);
  assert.doesNotMatch(page, /scotia hollow|column-molding|shadow-gap/i);
  assert.doesNotMatch(page, /wheat|stubble|sickle|leftover-harvest|gleaner's field/i);
  assert.doesNotMatch(page, /sideline-scout|night turf|floodlight|yard marker/i);
  assert.doesNotMatch(page, /industrial switchgear|solenoid-coil|coil-plunger/i);
  assert.doesNotMatch(page, /wax-museum|hyperreality|mannequin CRT|vitrine/i);
  assert.doesNotMatch(page, /court of novel disseisin|freehold manor roll/i);
  assert.doesNotMatch(page, /feoffment|livery-of-seisin|chancery|demesne|letters patent/i);
  assert.doesNotMatch(page, /planchet|die punch|slag floor/i);
  assert.doesNotMatch(page, /compositor|foul-proof|geta-tofu|type case|rice-paper/i);
  assert.doesNotMatch(page, /\bplenary\b/);
  assert.doesNotMatch(page, /\bscisselled\b/);
  assert.doesNotMatch(page, /argv-trunc/);
  assert.doesNotMatch(page, /\bverbatim\b/);
  assert.doesNotMatch(page, /\bmojibaked\b/);
  assert.doesNotMatch(page, /fffd-spall/);
  assert.doesNotMatch(page, /\bsingular\b/);
  assert.doesNotMatch(page, /\bapographed\b/);
  assert.doesNotMatch(page, /reopen-fork/);
  assert.doesNotMatch(page, /\bequalized\b/);
  assert.doesNotMatch(page, /\bblown\b/);
  assert.doesNotMatch(page, /socat-race/);
  assert.doesNotMatch(page, /\blegible\b/);
  assert.doesNotMatch(page, /\bscotomized\b/);
  assert.doesNotMatch(page, /command-args-blind/);
  assert.doesNotMatch(page, /\bcalibrated\b/);
  assert.doesNotMatch(page, /\baneroided\b/);
  assert.doesNotMatch(page, /wrong-window-ring/);
  assert.doesNotMatch(page, /\btethered\b/);
  assert.doesNotMatch(page, /\bhollow\b/);
  assert.doesNotMatch(page, /phantom-navigate/);
  assert.doesNotMatch(page, /\bengaged\b/);
  assert.doesNotMatch(page, /\binert\b/);
  assert.doesNotMatch(page, /warm-before-message/);
  assert.doesNotMatch(page, /\bflush\b/);
  assert.doesNotMatch(page, /\bscotiated\b/);
  assert.doesNotMatch(page, /decstbm-undershoot/);
  assert.doesNotMatch(page, /\bcandid\b/);
  assert.doesNotMatch(page, /\bcanarded\b/);
  assert.doesNotMatch(page, /onedrive-cwd/);
  assert.doesNotMatch(page, /\bvested\b/);
  assert.doesNotMatch(page, /\bunseised\b/);
  assert.doesNotMatch(page, /preview-eperm/);
  assert.match(page, /NOT Mojibake/i);
  assert.match(page, /NOT Scissel/i);
  assert.match(page, /NOT Feoffee/i);
  assert.match(page, /NOT Apograph/i);
  assert.match(page, /NOT Airlock/i);
  assert.match(page, /NOT Scotoma/i);
  assert.match(page, /NOT Aneroid/i);
  assert.match(page, /NOT Simulacrum/i);
  assert.match(page, /NOT Solenoid/i);
  assert.match(page, /NOT Scotia/i);
  assert.match(page, /NOT Canard/i);
  assert.match(page, /NOT Stet/i);
  assert.match(page, /NOT Blindside/i);
  assert.match(page, /NOT Interdict/i);
  assert.match(page, /NOT Schism/i);
  assert.match(page, /NOT Gleaner/i);
  assert.match(page, /NOT Waif/i);
  assert.match(page, /NOT Ashpan/i);
  assert.match(page, /NOT Snatch/i);
  assert.match(page, /NOT Disseisin/i);
});

test("README states the thesis, anti-clone, and how to score", () => {
  const readme = readReadme();
  assert.match(readme, /Tessera/);
  assert.match(readme, /#93929/);
  assert.match(readme, /\bunitary\b/);
  assert.match(readme, /\btessellated\b/);
  assert.match(readme, /version-path-tcc/);
  assert.match(readme, /Big Shoulders Display/);
  assert.match(readme, /DM Sans/);
  assert.match(readme, /DM Mono/);
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /NOT Mojibake/i);
  assert.match(readme, /NOT Scissel/i);
  assert.match(readme, /NOT Feoffee/i);
  assert.match(readme, /NOT Apograph/i);
  assert.match(readme, /NOT Airlock/i);
  assert.match(readme, /NOT Scotoma/i);
  assert.match(readme, /NOT Aneroid/i);
  assert.match(readme, /NOT Simulacrum/i);
  assert.match(readme, /NOT Solenoid/i);
  assert.match(readme, /NOT Scotia/i);
  assert.match(readme, /NOT Canard/i);
  assert.match(readme, /NOT Stet/i);
  assert.match(readme, /NOT Blindside/i);
  assert.match(readme, /NOT Interdict/i);
  assert.match(readme, /NOT Schism/i);
  assert.match(readme, /NOT Gleaner/i);
  assert.match(readme, /NOT Waif/i);
  assert.match(readme, /NOT Ashpan/i);
  assert.match(readme, /NOT Snatch/i);
  assert.match(readme, /NOT Disseisin/i);
  assert.match(readme, /2\.1\.263|macOS 27\.0|Q6L2SF6YDW|tccutil|319832836/i);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/tessera/);
  assert.match(readme, /node --test projects\/tessera\/tessera\.test\.mjs/);
  assert.match(readme, /NON-BINDING/);
  assert.match(readme, /tessera|mosaic|tesserae|privacy-pane/i);
  assert.match(readme, /Score tessera or admit unitary/);
  assert.match(readme, /#76615|#38722|#76080|#93747/);
  assert.match(readme, /#93772|#93770|#93777|#93782|#93889|#93821|#93811|#93809|#93823|#93924|#93925/);
  assert.match(readme, /14:50/);
});

test("catalog features Tessera only; Mojibake, Scissel, Feoffee, Apograph unfeatured", () => {
  const catalog = readCatalog();
  const hub = readHubCatalog();
  assert.equal(catalog.products.length, 331);
  assert.equal(hub.products.length, 331);
  assert.equal(catalog.products[0].name, "Tessera");
  assert.equal(catalog.products[0].slug, "tessera");
  assert.equal(catalog.products[0].featured, true);
  assert.equal(catalog.products[0].href, "/tessera/");
  assert.equal(catalog.products[0].day, "2026-09-13");
  assert.match(catalog.products[0].summary, /14:50 tessera|#93929|mosaic|tesserae|privacy-pane/i);
  assert.match(catalog.products[0].summary, /\bunitary\b/);
  assert.match(catalog.products[0].summary, /\btessellated\b/);
  assert.match(catalog.products[0].summary, /version-path-tcc/);
  assert.match(catalog.products[0].summary, /Score tessera or admit unitary/);
  assert.equal(hub.products[0].slug, "tessera");
  assert.equal(hub.products[0].featured, true);
  const mojibake = catalog.products.find((row) => row.slug === "mojibake");
  assert.ok(mojibake);
  assert.equal(mojibake.featured, false);
  const scissel = catalog.products.find((row) => row.slug === "scissel");
  assert.ok(scissel);
  assert.equal(scissel.featured, false);
  const feoffee = catalog.products.find((row) => row.slug === "feoffee");
  assert.ok(feoffee);
  assert.equal(feoffee.featured, false);
  const apograph = catalog.products.find((row) => row.slug === "apograph");
  assert.ok(apograph);
  assert.equal(apograph.featured, false);
  const airlock = catalog.products.find((row) => row.slug === "airlock");
  assert.ok(airlock);
  assert.equal(airlock.featured, false);
  const scotoma = catalog.products.find((row) => row.slug === "scotoma");
  assert.ok(scotoma);
  assert.equal(scotoma.featured, false);
  const aneroid = catalog.products.find((row) => row.slug === "aneroid");
  assert.ok(aneroid);
  assert.equal(aneroid.featured, false);
  const canard = catalog.products.find((row) => row.slug === "canard");
  assert.ok(canard);
  assert.equal(canard.featured, false);
  assert.equal(catalog.products.filter((row) => row.featured).length, 1);
  assert.equal(catalog.products.filter((row) => row.slug === "tessera").length, 1);
  assert.ok(!catalog.products.some((row) => String(row.summary || "").includes("93929") && row.slug !== "tessera"));
});

test("vercel rewrites tessera to the project folder at the top", () => {
  const vercel = readVercel();
  assert.equal(vercel.rewrites[0].source, "/tessera");
  assert.equal(vercel.rewrites[0].destination, "/projects/tessera");
  assert.equal(vercel.rewrites[1].source, "/tessera/");
  assert.equal(vercel.rewrites[1].destination, "/projects/tessera");
  assert.equal(vercel.rewrites[2].source, "/tessera/:path*");
  assert.equal(vercel.rewrites[2].destination, "/projects/tessera/:path*");
});

test("no network calls in the model or tests", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
  assert.doesNotMatch(source, /https?:\/\/[^\s"']*anthropic\.com\/v1/);
});
