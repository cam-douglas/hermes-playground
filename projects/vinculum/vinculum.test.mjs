import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ALARM,
  ALIAS_ENTRIES,
  AFFECTED_FILES,
  AUTHOR,
  BACKUPS,
  BRIDGE_ERROR,
  CHIPS,
  CLAUDE_DESKTOP_VERSION,
  COUSINS,
  FEATURED_ISSUE,
  FILED,
  FINGERPRINT_LINES,
  FORBIDDEN_IDLE,
  FORBIDDEN_SEED,
  FORGE_STATIONS,
  HOLD,
  IDLE_WORD,
  INTERACTIVE_LINKS,
  ISSUE_URL,
  LABELS,
  NLINK_REFUSE_THRESHOLD,
  NOT_PRODUCTS,
  OS,
  OS_BUILD,
  OTHER_LINK_COUNTS,
  PATH_WORD,
  PHRASE,
  PLATFORM,
  PRODUCT_WORD,
  REPRESENTATIVE,
  SEEDED_WORD,
  SESSION_KIND,
  SKILL_LINKS,
  STATE,
  TITLE,
  UPLOAD_CACHE,
  VERDICTS,
  VINCULUM_WALK,
  WORKSPACE_FILES,
  analyze,
  classify,
  decide,
  emptyTicket,
  fingerprint,
  handle,
  inspectAccumulation,
  inspectAlias,
  inspectBridge,
  inspectMode,
  inspectNlink,
  readBench,
  score,
  scoreGate,
  scoreWalk,
  seedAccumulate,
  seedAlias,
  seedBridgeRefuse,
  seedCloudBridge,
  seedFsutil,
  seedHardlink,
  seedHold,
  seedLocalMode,
  seedNlinkOne,
  seedNlinkRise,
  seedSessionEnd,
  seedSolitary,
  seedTwinlinked,
  seedUploadCache,
  seedVinculum,
  seedWorkaround,
  seedWriteThrough,
} from "./vinculum.mjs";

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
  return fileURLToPath(new URL("./vinculum.mjs", import.meta.url));
}

test("idle solitary is a hold; nlink=1; no Claude-owned alias; cloud bridge accepts", () => {
  const result = analyze(seedSolitary());
  assert.equal(result.verdict, "solitary");
  assert.equal(result.idleWord, "solitary");
  assert.equal(IDLE_WORD, "solitary");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.solitary, true);
  assert.equal(result.phrase, "admit solitary");
  assert.equal(result.hardlink, false);
  assert.equal(result.bridgeRefuse, false);
  assert.equal(result.nlinkOne, true);
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(result.idleWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("empty ticket and empty stdin classify solitary", () => {
  assert.equal(classify(emptyTicket()), "solitary");
  assert.equal(classify(""), "solitary");
  assert.equal(classify(null), "solitary");
  assert.equal(decide({}), "solitary");
});

test("#93485 seeded path scores twinlinked when local mode hardlinks into the upload cache", () => {
  const result = analyze(seedTwinlinked());
  assert.equal(result.verdict, "twinlinked");
  assert.equal(result.seededWord, "twinlinked");
  assert.equal(SEEDED_WORD, "twinlinked");
  assert.equal(PRODUCT_WORD, "vinculum");
  assert.equal(result.hold, false);
  assert.equal(result.alarm, true);
  assert.equal(result.twinlinked, true);
  assert.equal(result.phrase, "score vinculum");
  assert.equal(result.localMode, true);
  assert.equal(result.hardlink, true);
  assert.equal(result.alias, true);
  assert.equal(result.nlinkRise, true);
  assert.equal(result.bridgeRefuse, true);
  for (const word of FORBIDDEN_SEED) {
    assert.notEqual(result.seededWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("local hardlink plus nlink rise is the #93485 vinculum", () => {
  const nlink = inspectNlink({
    localMode: true,
    hardlink: true,
    alias: true,
    nlink: 2,
  });
  assert.equal(nlink.stamp, "twinlinked");
  assert.equal(nlink.risen, true);
  const scored = scoreGate({
    twinlinked: true,
    localMode: true,
    hardlink: true,
    alias: true,
    nlinkRise: true,
    bridgeRefuse: true,
    cue: "twinlinked",
  });
  assert.equal(scored.verdict, "twinlinked");
  assert.equal(scored.bridgeRefuse, true);
  const calm = inspectNlink({ solitary: true, nlink: 1, nlinkOne: true });
  assert.equal(calm.stamp, "solitary");
});

test("path word is bridge-refuse; named path seed holds the path", () => {
  assert.equal(PATH_WORD, "bridge-refuse");
  const result = analyze(seedBridgeRefuse());
  assert.equal(result.verdict, "bridge-refuse");
  assert.equal(result.pathWord, "bridge-refuse");
  assert.equal(result.hold, false);
  assert.equal(
    classify({ seed: "bridge-refuse", preferSeed: true, twinlinked: true }),
    "bridge-refuse",
  );
  assert.equal(classify(seedHardlink()), "hardlink");
});

test("HOLD includes solitary / hold", () => {
  assert.ok(HOLD.includes("solitary"));
  assert.ok(HOLD.includes("hold"));
  const hold = analyze(seedHold());
  assert.equal(hold.verdict, "hold");
  assert.equal(hold.hold, true);
  assert.equal(classify({ seed: "hold", preferSeed: true }), "hold");
});

test("alarm chips: nlink-rise, hardlink, alias, upload-cache, local-mode, cloud-bridge", () => {
  assert.equal(classify(seedNlinkOne()), "nlink-one");
  assert.equal(classify(seedNlinkRise()), "nlink-rise");
  assert.equal(classify(seedHardlink()), "hardlink");
  assert.equal(classify(seedAlias()), "alias");
  assert.equal(classify(seedUploadCache()), "upload-cache");
  assert.equal(classify(seedLocalMode()), "local-mode");
  assert.equal(classify(seedCloudBridge()), "cloud-bridge");
  assert.equal(classify(seedAccumulate()), "accumulate");
  assert.equal(classify(seedSessionEnd()), "session-end");
  assert.equal(classify(seedWriteThrough()), "write-through");
  assert.equal(classify(seedWorkaround()), "workaround");
  assert.equal(classify(seedFsutil()), "fsutil");
  assert.equal(classify(seedVinculum()), "vinculum");
});

test("booth fixtures flip solitary vs twinlinked vs bridge-refuse", () => {
  const idle = scoreGate(seedSolitary());
  const seeded = scoreGate(readData("twinlinked.json"));
  const solitary = readData("solitary.json");
  const twinlinked = readData("twinlinked.json");
  const path = readData("bridge-refuse.json");
  const product = readData("vinculum.json");
  assert.equal(idle.verdict, "solitary");
  assert.equal(seeded.verdict, "twinlinked");
  assert.notEqual(idle.verdict, seeded.verdict);
  assert.equal(score(seedSolitary()), "solitary");
  assert.equal(score(readData("twinlinked.json")), "twinlinked");
  assert.equal(solitary.nlink, 1);
  assert.equal(solitary.solitary, true);
  assert.equal(scoreGate(solitary).verdict, "solitary");
  assert.equal(twinlinked.nlink, 2);
  assert.equal(twinlinked.hardlink, true);
  assert.equal(twinlinked.localMode, true);
  assert.equal(classify(twinlinked), "twinlinked");
  assert.equal(path.paths.length, 3);
  assert.equal(
    path.paths[0].rule,
    "local agent mode does not copy; it creates a hard link into local-agent-mode-sessions/.../uploads/",
  );
  assert.match(path.paths[2].result, /bridge-refuse/);
  assert.equal(classify(path), "bridge-refuse");
  assert.equal(classify(product), "vinculum");
  assert.equal(twinlinked.issue, 93485);
  assert.equal(twinlinked.nlink, 2);
});

test("chips include idle, seeded, path, and walk", () => {
  assert.ok(CHIPS.includes("solitary"));
  assert.ok(CHIPS.includes("twinlinked"));
  assert.ok(CHIPS.includes("vinculum"));
  assert.ok(CHIPS.includes("bridge-refuse"));
  assert.ok(CHIPS.includes("chips"));
  assert.ok(CHIPS.includes("fingerprints"));
  assert.ok(CHIPS.includes("walk"));
  assert.ok(ALARM.includes("twinlinked"));
  assert.ok(ALARM.includes("bridge-refuse"));
  assert.ok(VERDICTS.includes("walk"));
  assert.equal(classify({ seed: "chips", preferSeed: true }), "chips");
  assert.equal(classify({ seed: "fingerprints", preferSeed: true }), "fingerprints");
  assert.equal(classify({ seed: "walk", preferSeed: true }), "walk");
});

test("published vinculum walk scores twinlinked after the idle hold", () => {
  const bench = scoreWalk({ rows: VINCULUM_WALK });
  assert.equal(bench.verdict, "twinlinked");
  assert.ok(bench.twinlinkedCount >= 1);
  const idle = bench.rows.find((row) => row.event === "cue-solitary");
  assert.equal(idle.solitary, true);
  assert.equal(idle.verdict, "solitary");
  const local = bench.rows.find((row) => row.event === "local-session");
  assert.equal(local.localMode, true);
  const link = bench.rows.find((row) => row.event === "hardlink");
  assert.equal(link.hardlink, true);
  const rise = bench.rows.find((row) => row.event === "nlink-rise");
  assert.equal(rise.nlinkRise, true);
  assert.equal(rise.nlink, 2);
  const pile = bench.rows.find((row) => row.event === "accumulate");
  assert.equal(pile.accumulate, true);
  assert.equal(pile.nlink, 26);
  const cloud = bench.rows.find((row) => row.event === "cloud-default");
  assert.equal(cloud.cloud, true);
  const path = bench.rows.filter((row) => row.event === "bridge-refuse");
  assert.ok(path.length >= 1);
  assert.equal(path[0].verdict, "bridge-refuse");
});

test("VINCULUM_WALK constant matches the issue forge walk", () => {
  assert.equal(VINCULUM_WALK[0].event, "cue-solitary");
  const link = VINCULUM_WALK.find((row) => row.event === "hardlink");
  assert.equal(link.hardlink, true);
  const rise = VINCULUM_WALK.find((row) => row.event === "nlink-rise");
  assert.equal(rise.nlinkRise, true);
  const path = VINCULUM_WALK.find((row) => row.event === "bridge-refuse");
  assert.equal(path.twinlinked, true);
  const scoreRow = VINCULUM_WALK.find((row) => row.event === "vinculum");
  assert.equal(scoreRow.twinlinked, true);
});

test("issue constants encode only #93485 published facts", () => {
  assert.equal(FEATURED_ISSUE, 93485);
  assert.ok(ISSUE_URL.includes("93485"));
  assert.match(TITLE, /hardlinks workspace files into its session upload cache/);
  assert.equal(STATE, "OPEN");
  assert.ok(LABELS.includes("bug"));
  assert.ok(LABELS.includes("has repro"));
  assert.ok(LABELS.includes("platform:windows"));
  assert.ok(LABELS.includes("area:cowork"));
  assert.equal(AUTHOR, "GBalunis");
  assert.equal(FILED, "2026-09-10T22:20:28Z");
  assert.equal(CLAUDE_DESKTOP_VERSION, "1.49585.0");
  assert.equal(PLATFORM, "win32 x64");
  assert.equal(OS, "Windows 11 25H2");
  assert.equal(OS_BUILD, "26200.9445");
  assert.equal(SESSION_KIND, "Cowork cloud session linked to a desktop device");
  assert.equal(WORKSPACE_FILES, 4195);
  assert.equal(AFFECTED_FILES, 20);
  assert.equal(ALIAS_ENTRIES, 52);
  assert.equal(SKILL_LINKS, 26);
  assert.deepEqual(OTHER_LINK_COUNTS, [8, 3]);
  assert.equal(INTERACTIVE_LINKS, 2);
  assert.equal(NLINK_REFUSE_THRESHOLD, 1);
  assert.match(UPLOAD_CACHE, /local-agent-mode-sessions/);
  assert.equal(REPRESENTATIVE, "context\\stack.md");
  assert.match(BRIDGE_ERROR, /nlink > 1/);
  assert.equal(FORGE_STATIONS.length, 4);
  assert.ok(FINGERPRINT_LINES.includes("bridge-refuse"));
  assert.ok(FINGERPRINT_LINES.includes("twinlinked"));
  assert.match(PHRASE, /score vinculum or admit solitary/);
});

test("has-repro fingerprints encode the published local-mode hardlink window", () => {
  const result = handle(readData("twinlinked.json"));
  assert.equal(result.published.claudeDesktopVersion, "1.49585.0");
  assert.equal(result.published.author, "GBalunis");
  assert.equal(result.published.sessionKind, "Cowork cloud session linked to a desktop device");
  assert.equal(result.published.affectedFiles, 20);
  assert.match(
    fingerprint(seedTwinlinked()),
    /twinlinked\|mode=local\|link=hardlink\|nlink=rise\|bridge=refuse\|alias=claude\|cue=twinlinked/,
  );
  assert.equal(classify({ seed: "has-repro", preferSeed: true }), "has-repro");
});

test("forbidden idle list includes recent catalog words including Cachet and Strobe", () => {
  const required = [
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
    "honest",
    "scapegoated",
    "ungranted",
    "scapegoat",
    "bound",
    "accreted",
    "session-url",
    "cartulary",
    "oubliette",
    "vernier",
    "procrustes",
  ];
  for (const word of required) {
    assert.ok(FORBIDDEN_IDLE.includes(word), `missing forbidden idle ${word}`);
  }
});

test("solitary bench flips twinlinked back when the nlink stays one", () => {
  const tape = {
    solitary: true,
    twinlinked: false,
    nlink: 1,
    nlinkOne: true,
    hardlink: false,
    alias: false,
    bridgeRefuse: false,
    cue: "solitary",
  };
  assert.equal(scoreGate(tape).verdict, "solitary");
  tape.solitary = false;
  tape.twinlinked = true;
  tape.localMode = true;
  tape.hardlink = true;
  tape.nlink = 2;
  tape.nlinkRise = true;
  tape.cue = "twinlinked";
  assert.equal(scoreGate(tape).verdict, "twinlinked");
  tape.solitary = true;
  tape.twinlinked = false;
  tape.localMode = false;
  tape.hardlink = false;
  tape.nlink = 1;
  tape.nlinkRise = false;
  tape.cue = "solitary";
  assert.equal(scoreGate(tape).verdict, "solitary");
});

test("nlink, alias, bridge, mode, and bench mark twinlinked after local hardlink", () => {
  const idle = inspectNlink({ nlinkOne: true, solitary: true, nlink: 1 });
  assert.equal(idle.stamp, "solitary");
  assert.equal(idle.one, true);
  const nlink = inspectNlink({
    localMode: true,
    hardlink: true,
    alias: true,
    nlink: 2,
  });
  assert.equal(nlink.stamp, "twinlinked");
  assert.equal(nlink.risen, true);
  const alias = inspectAlias({
    alias: true,
    hardlink: true,
    uploadCache: true,
  });
  assert.equal(alias.stamp, "twinlinked");
  assert.match(alias.path, /local-agent-mode-sessions/);
  const bridge = inspectBridge({
    cloud: true,
    bridgeRefuse: true,
    nlink: 2,
    hardlink: true,
  });
  assert.equal(bridge.stamp, "twinlinked");
  assert.equal(bridge.refuses, true);
  const mode = inspectMode({
    localMode: true,
    hardlink: true,
    nlinkRise: true,
  });
  assert.equal(mode.stamp, "twinlinked");
  assert.equal(mode.manufactured, true);
  const pile = inspectAccumulation({
    twinlinked: true,
    accumulate: true,
    nlink: 26,
  });
  assert.equal(pile.stamp, "twinlinked");
  assert.equal(pile.affected, 20);
  const bench = readBench({
    twinlinked: true,
    localMode: true,
    hardlink: true,
    alias: true,
    nlink: 2,
    nlinkRise: true,
  });
  assert.equal(bench.twinlinked, true);
  assert.equal(bench.mark, "twinlinked");
  const calm = readBench({
    solitary: true,
    twinlinked: false,
    nlink: 1,
    nlinkOne: true,
  });
  assert.equal(calm.twinlinked, false);
  assert.equal(calm.mark, "solitary");
});

test("cousins are cite-only; products stay distinct; backups stay data-only", () => {
  assert.equal(COUSINS.length, 1);
  assert.equal(COUSINS[0].issue, 50268);
  assert.ok(COUSINS.every((row) => row.citeOnly === true));
  assert.ok(NOT_PRODUCTS.includes("cachet"));
  assert.ok(NOT_PRODUCTS.includes("strobe"));
  assert.ok(NOT_PRODUCTS.includes("counterfoil"));
  assert.ok(NOT_PRODUCTS.includes("lucida"));
  assert.ok(NOT_PRODUCTS.includes("hallmark"));
  assert.ok(NOT_PRODUCTS.includes("procrustes"));
  assert.ok(NOT_PRODUCTS.includes("paraph"));
  assert.equal(BACKUPS.length, 6);
  assert.equal(BACKUPS[0].issue, 93458);
  assert.equal(BACKUPS[1].issue, 93482);
  assert.equal(BACKUPS[2].issue, 93475);
  assert.equal(BACKUPS[3].issue, 93439);
  assert.equal(BACKUPS[4].issue, 93438);
  assert.equal(BACKUPS[5].issue, 93466);
  assert.ok(BACKUPS.every((row) => row.citeOnly === true));
  assert.equal(classify({ seed: "cousins", preferSeed: true }), "cousins");
  assert.equal(classify({ seed: "backups", preferSeed: true }), "backups");
});

test("CLI scores fixtures without a server", () => {
  const idle = spawnSync(process.execPath, [modelPath()], { encoding: "utf8" });
  const seeded = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/twinlinked.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(idle.status, 0, idle.stderr);
  assert.equal(seeded.status, 0, seeded.stderr);
  assert.equal(JSON.parse(idle.stdout).verdict, "solitary");
  assert.equal(JSON.parse(seeded.stdout).verdict, "twinlinked");
});

test("handle exposes published hypothesis and #93485 headline", () => {
  const result = handle(readData("twinlinked.json"));
  assert.equal(result.published.issue, 93485);
  assert.equal(result.published.claudeDesktopVersion, "1.49585.0");
  assert.equal(result.published.author, "GBalunis");
  assert.deepEqual(result.published.cousins, [50268]);
  assert.ok(result.published.backups.includes(93458));
  assert.ok(result.published.backups.includes(93482));
  assert.ok(result.published.backups.includes(93466));
  assert.match(result.published.hypothesis, /fs\.link/);
  assert.match(result.published.hypothesis, /NON-BINDING/);
});

test("model has no static node: imports so the living page can score in-browser", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /^import .* from "node:/m);
  assert.match(source, /import\("node:fs"\)/);
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
});

test("living page is a chain-forge vinculum bench, not a wax-cachet blotter or hangar strobe", () => {
  const page = readPage();
  assert.match(page, /Libre Baskerville/);
  assert.match(page, /Karla/);
  assert.match(page, /Source Code Pro/);
  assert.match(page, /vinculum|forge|anvil|nlink|binder/i);
  assert.match(page, /#1a1f2a|#b8956c|#e8dfd0|#0d1016|#8b3a2a|#3d6b4f/);
  assert.match(page, /\bsolitary\b/);
  assert.match(page, /twinlinked/);
  assert.match(page, /bridge-refuse/);
  assert.match(page, /score vinculum or admit solitary/i);
  assert.match(page, /cousin-not-primary/);
  assert.match(page, /09:50/);
  assert.match(page, /#281/);
  assert.match(page, /#93485/);
  assert.match(page, /GBalunis/);
  assert.match(page, /1\.49585\.0/);
  assert.match(page, /nlink/);
  assert.match(page, /local-agent-mode-sessions/);
  assert.match(page, /Strike the vinculum/);
  assert.match(page, /Score vinculum/);
  assert.match(page, /Gauge the nlink/);
  assert.match(page, /Compare local \/ cloud/);
  assert.match(page, /Pin idle solitary/);
  assert.match(page, /Pin seeded twinlinked/);
  assert.match(page, /Pin bridge-refuse/);
  assert.match(page, /Clear the forge/);
  assert.doesNotMatch(page, /Cormorant Infant/);
  assert.doesNotMatch(page, /Figtree/);
  assert.doesNotMatch(page, /IBM Plex Mono/);
  assert.doesNotMatch(page, /Newsreader/);
  assert.doesNotMatch(page, /Red Hat Mono/);
  assert.doesNotMatch(page, /Source Sans 3/);
  assert.doesNotMatch(page, /JetBrains Mono/);
  assert.doesNotMatch(page, /Fraunces/);
  assert.doesNotMatch(page, /Outfit/);
  assert.doesNotMatch(page, /Space Mono/);
  assert.doesNotMatch(page, /Source Serif 4/);
  assert.doesNotMatch(page, /Libre Franklin/);
  assert.doesNotMatch(page, /Noto Sans Mono/);
  assert.doesNotMatch(page, /Alegreya/);
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
  assert.doesNotMatch(page, /hangar beacon|flash capacitor|cheque-counter|camera-lucida atelier|culture dish|pulse-damper|earthwork fosse|wax-cachet blotter/i);
  assert.doesNotMatch(page, /\bhit\b/);
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
  assert.match(page, /NOT Cachet/i);
  assert.match(page, /NOT Strobe/i);
  assert.match(page, /NOT Counterfoil/i);
  assert.match(page, /NOT Lucida/i);
  assert.match(page, /NOT Fomite/i);
  assert.match(page, /NOT Snubber/i);
  assert.match(page, /NOT Fosse/i);
  assert.match(page, /NOT Hibernacle/i);
  assert.match(page, /NOT Paraph/i);
  assert.match(page, /NOT Procrustes/i);
});

test("README states the thesis, anti-clone, and how to score", () => {
  const readme = readReadme();
  assert.match(readme, /Vinculum/);
  assert.match(readme, /#93485/);
  assert.match(readme, /\bsolitary\b/);
  assert.match(readme, /twinlinked/);
  assert.match(readme, /bridge-refuse/);
  assert.match(readme, /Libre Baskerville/);
  assert.match(readme, /Karla/);
  assert.match(readme, /Source Code Pro/);
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /NOT Cachet/i);
  assert.match(readme, /NOT Strobe/i);
  assert.match(readme, /NOT Counterfoil/i);
  assert.match(readme, /NOT Lucida/i);
  assert.match(readme, /NOT Fomite/i);
  assert.match(readme, /NOT Snubber/i);
  assert.match(readme, /NOT Fosse/i);
  assert.match(readme, /NOT Hibernacle/i);
  assert.match(readme, /NOT Paraph/i);
  assert.match(readme, /1\.49585\.0/);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/vinculum/);
  assert.match(readme, /node --test projects\/vinculum\/vinculum\.test\.mjs/);
  assert.match(readme, /NON-BINDING/);
  assert.match(readme, /fs\.link/);
  assert.match(readme, /#50268/);
  assert.match(readme, /forge|anvil|nlink/i);
  assert.match(readme, /local-agent-mode-sessions/);
});

test("catalog features Vinculum only; Cachet and Strobe unfeatured", () => {
  const catalog = readCatalog();
  const hub = readHubCatalog();
  assert.equal(catalog.products.length, 281);
  assert.equal(hub.products.length, 281);
  assert.equal(catalog.products[0].name, "Vinculum");
  assert.equal(catalog.products[0].slug, "vinculum");
  assert.equal(catalog.products[0].featured, true);
  assert.equal(catalog.products[0].href, "/vinculum/");
  assert.equal(catalog.products[0].day, "2026-09-11");
  assert.match(catalog.products[0].summary, /09:50/);
  assert.match(catalog.products[0].summary, /vinculum/);
  assert.match(catalog.products[0].summary, /#93485/);
  assert.match(catalog.products[0].summary, /\bsolitary\b/);
  assert.match(catalog.products[0].summary, /twinlinked/);
  assert.match(catalog.products[0].summary, /bridge-refuse/);
  assert.equal(hub.products[0].slug, "vinculum");
  assert.equal(hub.products[0].featured, true);
  const cachet = catalog.products.find((row) => row.slug === "cachet");
  assert.ok(cachet);
  assert.equal(cachet.featured, false);
  const strobe = catalog.products.find((row) => row.slug === "strobe");
  assert.ok(strobe);
  assert.equal(strobe.featured, false);
  const counterfoil = catalog.products.find((row) => row.slug === "counterfoil");
  assert.ok(counterfoil);
  assert.equal(counterfoil.featured, false);
  assert.equal(catalog.products.filter((row) => row.featured).length, 1);
  assert.equal(catalog.products.filter((row) => row.slug === "vinculum").length, 1);
  assert.ok(!catalog.products.some((row) => String(row.summary || "").includes("93485") && row.slug !== "vinculum"));
});

test("vercel rewrites vinculum to the project folder at the top", () => {
  const vercel = readVercel();
  assert.equal(vercel.rewrites[0].source, "/vinculum");
  assert.equal(vercel.rewrites[0].destination, "/projects/vinculum");
  assert.equal(vercel.rewrites[1].source, "/vinculum/");
  assert.equal(vercel.rewrites[1].destination, "/projects/vinculum");
  assert.equal(vercel.rewrites[2].source, "/vinculum/:path*");
  assert.equal(vercel.rewrites[2].destination, "/projects/vinculum/:path*");
});

test("no network calls in the model or tests", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /\bcurl\b/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
  assert.doesNotMatch(source, /https?:\/\/[^\s"']*anthropic\.com\/v1/);
});
