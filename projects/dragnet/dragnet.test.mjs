import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ALARM,
  ALLEY_NAMES,
  BACKUPS,
  BOOTH_STATIONS,
  BUILD,
  BUNDLE_ID,
  CHIPS,
  COUSINS,
  DISTRIBUTION,
  EXPECTED,
  FEATURED_ISSUE,
  FIELD_MARKS,
  FINGERPRINT_LINES,
  FIND_BINARY,
  FORBIDDEN_IDLE,
  FORBIDDEN_SEED,
  HOLD,
  HOLD_ALIASES,
  HOST,
  IDLE_WORD,
  ISSUE_URL,
  LABELS,
  DRAGNET_WALK,
  NOT_PRODUCTS,
  PATH_WORD,
  PHRASE,
  PLATFORM,
  POSITIVE_CONTROL_WALK,
  PRODUCT_WORD,
  RULED_OUT,
  SAMPLE_DRAGNET_PROOF,
  SEEDED_WORD,
  STATE,
  SURFACE,
  TCC_SERVICE,
  TITLE,
  TRAVERSAL_ROOT,
  VERDICTS,
  analyze,
  classify,
  decide,
  emptyTicket,
  fingerprint,
  handle,
  inspectAlleys,
  inspectCase,
  inspectFind,
  inspectLoop,
  inspectProcess,
  inspectTcc,
  mapNet,
  readBooth,
  score,
  scoreGate,
  scoreWalk,
  scoreWalkRoot,
  seedDragnet,
  seedHold,
  seedProduct,
  seedRootFind,
  seedScoped,
  seedTccPrompt,
} from "./dragnet.mjs";

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
  return fileURLToPath(new URL("./dragnet.mjs", import.meta.url));
}

const CATALOG_SUMMARY =
  "04:50 dragnet: a night blotter / police-fishing dragnet booth for #94064. Desktop app repeatedly spawns /usr/bin/find rooted at /; walk hits TCC-protected paths and raises repeated access-data-from-other-apps prompts (~1.5–3 min) regardless of open project. Idle scoped / seeded dragnet / path root-find. Score dragnet or admit scoped.";

test("idle scoped is a hold; scan would stay inside the open project", () => {
  const result = analyze(seedScoped());
  assert.equal(result.verdict, "scoped");
  assert.equal(result.idleWord, "scoped");
  assert.equal(IDLE_WORD, "scoped");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.scoped, true);
  assert.equal(result.phrase, "admit scoped");
  assert.equal(result.dragnet, false);
  assert.equal(result.rootFind, false);
  assert.ok(HOLD_ALIASES.includes("fenced"));
  assert.ok(HOLD_ALIASES.includes("bounded"));
  assert.ok(HOLD_ALIASES.includes("warranted"));
  assert.ok(HOLD_ALIASES.includes("project-rooted"));
  assert.ok(HOLD_ALIASES.includes("cwd-scoped"));
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(result.idleWord, word);
    assert.notEqual(result.verdict, word);
  }
  assert.notEqual(IDLE_WORD, "enrolled");
  assert.notEqual(IDLE_WORD, "equated");
  assert.notEqual(IDLE_WORD, "penned");
  assert.notEqual(IDLE_WORD, "ungloved");
});

test("empty ticket and empty stdin classify scoped", () => {
  assert.equal(classify(emptyTicket()), "scoped");
  assert.equal(classify(""), "scoped");
  assert.equal(classify(null), "scoped");
  assert.equal(decide({}), "scoped");
});

test("#94064 seeded path scores dragnet when find walks from /", () => {
  const result = analyze(seedDragnet());
  assert.equal(result.verdict, "dragnet");
  assert.equal(result.seededWord, "dragnet");
  assert.equal(SEEDED_WORD, "dragnet");
  assert.equal(PRODUCT_WORD, "dragnet");
  assert.equal(result.hold, false);
  assert.equal(result.alarm, true);
  assert.equal(result.dragnet, true);
  assert.equal(result.phrase, "score dragnet");
  assert.equal(result.rootFind, true);
  assert.equal(result.fullDiskFind, true);
  for (const word of FORBIDDEN_SEED) {
    assert.notEqual(result.seededWord, word);
    assert.notEqual(result.verdict, word);
  }
  assert.notEqual(SEEDED_WORD, "matricula");
  assert.notEqual(SEEDED_WORD, "allograph");
  assert.notEqual(SEEDED_WORD, "agraphia");
});

test("walk-root helper is educational and does not walk disk", () => {
  const rooted = scoreWalkRoot({ walkRoot: "/", cwd: "/Users/me/case" });
  assert.equal(rooted.dragnet, true);
  assert.equal(rooted.rootFind, true);
  assert.equal(rooted.scoped, false);
  assert.equal(rooted.findBinary, FIND_BINARY);
  const fenced = scoreWalkRoot({
    walkRoot: "/Users/me/case",
    cwd: "/Users/me/case",
  });
  assert.equal(fenced.scoped, true);
  assert.equal(fenced.dragnet, false);
});

test("inspectors mark net-cast and TCC prompt", () => {
  const find = inspectFind({ dragnet: true, fullDiskFind: true });
  assert.equal(find.stamp, "net-cast");
  assert.equal(find.cast, true);
  const tcc = inspectTcc({ dragnet: true, tccPrompt: true });
  assert.equal(tcc.stamp, "tcc-prompt");
  assert.equal(tcc.prompted, true);
  const scored = scoreGate({
    dragnet: true,
    rootFind: true,
    fullDiskFind: true,
    cue: "dragnet",
  });
  assert.equal(scored.verdict, "dragnet");
  const open = inspectCase({ scoped: true, dragnet: false });
  assert.equal(open.stamp, "case-scoped");
});

test("path word is root-find; booth seed holds the path", () => {
  assert.equal(PATH_WORD, "root-find");
  const result = analyze(seedRootFind());
  assert.equal(result.verdict, "root-find");
  assert.equal(result.pathWord, "root-find");
  assert.equal(result.hold, false);
  assert.equal(
    classify({
      seed: "root-find",
      preferSeed: true,
      dragnet: true,
    }),
    "root-find",
  );
  assert.equal(classify({ seed: "full-disk-find", preferSeed: true }), "full-disk-find");
  assert.equal(score(seedRootFind()), "dragnet");
});

test("HOLD includes scoped / hold", () => {
  assert.ok(HOLD.includes("scoped"));
  assert.ok(HOLD.includes("hold"));
  const hold = analyze(seedHold());
  assert.equal(hold.verdict, "hold");
  assert.equal(hold.hold, true);
  assert.equal(classify({ seed: "hold", preferSeed: true }), "hold");
});

test("alarm chips: full-disk-find, root-find, dragnet, tcc-prompt", () => {
  assert.equal(classify({ seed: "full-disk-find", preferSeed: true }), "full-disk-find");
  assert.equal(classify(seedRootFind()), "root-find");
  assert.equal(classify(seedProduct()), "dragnet");
  assert.equal(classify(seedTccPrompt()), "tcc-prompt");
});

test("booth fixtures flip scoped vs dragnet vs root-find", () => {
  const idle = scoreGate(seedScoped());
  const seeded = scoreGate(seedDragnet());
  const scoped = readData("scoped.json");
  const dragnet = readData("dragnet.json");
  const issued = readData("94064.json");
  const path = readData("root-find.json");
  const holdFix = readData("hold.json");
  assert.equal(idle.verdict, "scoped");
  assert.equal(seeded.verdict, "dragnet");
  assert.notEqual(idle.verdict, seeded.verdict);
  assert.equal(score(seedScoped()), "scoped");
  assert.equal(score(seedDragnet()), "dragnet");
  assert.equal(score({ seed: "root-find", preferSeed: true }), "dragnet");
  assert.equal(scoped.rootFind, false);
  assert.equal(scoped.scoped, true);
  assert.equal(scoreGate(scoped).verdict, "scoped");
  assert.equal(dragnet.rootFind, true);
  assert.equal(dragnet.fullDiskFind, true);
  assert.equal(classify(dragnet), "dragnet");
  assert.equal(issued.issue, 94064);
  assert.equal(classify(issued), "dragnet");
  assert.equal(path.paths.length, 3);
  assert.match(path.paths[0].rule, /scoped|fenced|bounded|warranted|project-rooted|cwd-scoped/i);
  assert.match(path.paths[1].result, /root-find|\/usr\/bin\/find|TCC/i);
  assert.equal(classify(path), "root-find");
  assert.equal(dragnet.hubCount, "DRAGNET");
  assert.equal(dragnet.issue, 94064);
  assert.equal(dragnet.dragnet, true);
  assert.equal(classify(holdFix), "hold");
  assert.equal(classify(readData("fenced.json")), "fenced");
  assert.equal(classify(readData("bounded.json")), "bounded");
  assert.equal(classify(readData("warranted.json")), "warranted");
  assert.equal(classify(readData("project-rooted.json")), "project-rooted");
  assert.equal(classify(readData("cwd-scoped.json")), "cwd-scoped");
  assert.equal(classify(readData("full-disk-find.json")), "full-disk-find");
  assert.equal(classify(readData("tcc-prompt.json")), "tcc-prompt");
  assert.equal(classify(readData("other-apps.json")), "other-apps");
  assert.equal(classify(readData("sandbox-denial.json")), "sandbox-denial");
  assert.equal(classify(readData("alley-trawl.json")), "alley-trawl");
  assert.equal(classify(readData("blotter-loop.json")), "blotter-loop");
  assert.equal(classify(readData("shared-process.json")), "shared-process");
  assert.equal(classify(readData("landing.json")), "landing");
  assert.equal(classify(readData("cousins.json")), "cousins");
  assert.deepEqual(readData("cousins.json").issues, []);
  assert.equal(classify(readData("backups.json")), "backups");
  assert.equal(classify(readData("walk.json")), "walk");
  assert.equal(classify(readData("has-repro.json")), "has-repro");
  assert.equal(classify(readData("fixtures.json")), "fixtures");
  assert.equal(classify(readData("closed.json")), "closed");
});

test("chips include idle, seeded, path, and walk", () => {
  assert.ok(CHIPS.includes("scoped"));
  assert.ok(CHIPS.includes("dragnet"));
  assert.ok(CHIPS.includes("root-find"));
  assert.ok(CHIPS.includes("full-disk-find"));
  assert.ok(CHIPS.includes("tcc-prompt"));
  assert.ok(CHIPS.includes("fenced"));
  assert.ok(CHIPS.includes("fixtures"));
  assert.ok(CHIPS.includes("walk"));
  assert.ok(ALARM.includes("dragnet"));
  assert.ok(ALARM.includes("root-find"));
  assert.ok(ALARM.includes("full-disk-find"));
  assert.ok(ALARM.includes("tcc-prompt"));
  assert.ok(VERDICTS.includes("walk"));
  assert.equal(classify({ seed: "fixtures", preferSeed: true }), "fixtures");
  assert.equal(classify({ seed: "walk", preferSeed: true }), "walk");
});

test("published dragnet walk scores dragnet after the idle hold", () => {
  const booth = scoreWalk({ rows: DRAGNET_WALK });
  assert.equal(booth.verdict, "dragnet");
  assert.ok(booth.dragnetCount >= 1);
  const idle = booth.rows.find((row) => row.event === "case-scoped");
  assert.equal(idle.scoped, true);
  assert.equal(idle.verdict, "scoped");
  const cut = booth.rows.find((row) => row.event === "root-find");
  assert.equal(cut.rootFind, true);
  const path = booth.rows.find(
    (row) => row.event === "root-find" && row.t === "path",
  );
  assert.equal(path.verdict, "root-find");
});

test("DRAGNET_WALK constant matches the issue blotter walk", () => {
  assert.equal(DRAGNET_WALK[0].event, "case-scoped");
  const cut = DRAGNET_WALK.find((row) => row.event === "root-find");
  assert.equal(cut.rootFind || cut.fullDiskFind, true);
  const path = DRAGNET_WALK.find((row) => row.t === "path");
  assert.equal(path.dragnet, true);
  const scoreRow = DRAGNET_WALK.find((row) => row.event === "dragnet");
  assert.equal(scoreRow.dragnet, true);
  assert.equal(scoreRow.fullDiskFind, true);
});

test("positive control scoped case stays scoped", () => {
  const walk = scoreWalk({ rows: POSITIVE_CONTROL_WALK });
  assert.equal(walk.verdict, "scoped");
  const ok = walk.rows.find((row) => row.t === "hold");
  assert.equal(ok.verdict, "scoped");
  const hold = walk.rows.find((row) => row.event === "case-scoped");
  assert.equal(hold.scoped, true);
  assert.equal(hold.verdict, "scoped");
});

test("issue constants encode only #94064 published facts", () => {
  assert.equal(FEATURED_ISSUE, 94064);
  assert.ok(ISSUE_URL.includes("94064"));
  assert.match(TITLE, /full-disk|find|TCC|other apps/i);
  assert.equal(STATE, "OPEN");
  assert.match(PLATFORM, /macos/i);
  assert.match(HOST, /2\.1\.266|com\.anthropic\.claude-code/i);
  assert.equal(BUILD, "Claude Code desktop 2.1.266 (com.anthropic.claude-code)");
  assert.equal(SURFACE, "root-find");
  assert.equal(FIND_BINARY, "/usr/bin/find");
  assert.equal(TRAVERSAL_ROOT, "/");
  assert.equal(BUNDLE_ID, "com.anthropic.claude-code");
  assert.equal(TCC_SERVICE, "kTCCServiceSystemPolicyAppData");
  assert.deepEqual(
    [...LABELS],
    ["bug", "has repro", "platform:macos", "area:desktop"],
  );
  assert.equal(FIELD_MARKS.length, 6);
  assert.equal(ALLEY_NAMES.length, 6);
  assert.ok(RULED_OUT.some((row) => /Matricula|#93987/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /Allograph|#94256/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /Agraphia|#94251/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /Gauntlet|#94029/i.test(row)));
  assert.ok(EXPECTED.some((row) => /cwd-scoped|other-apps|open project|TCC/i.test(row)));
  assert.match(
    DISTRIBUTION,
    /\/usr\/bin\/find|2\.1\.266|TCC|1\.5|AddressBook|CallHistoryDB|CloudDocs/i,
  );
  assert.equal(BOOTH_STATIONS.length, 6);
  assert.ok(FINGERPRINT_LINES.includes("root-find"));
  assert.ok(FINGERPRINT_LINES.includes("dragnet"));
  assert.equal(PHRASE, "Score dragnet or admit scoped.");
  assert.equal(SAMPLE_DRAGNET_PROOF.rootFind, true);
  assert.equal(SAMPLE_DRAGNET_PROOF.names.length, 6);
});

test("has-repro fingerprints encode the published dragnet proof", () => {
  const result = handle(seedDragnet());
  assert.equal(result.published.platform, "macos");
  assert.equal(result.published.surface, "root-find");
  assert.equal(result.published.host, HOST);
  assert.match(
    fingerprint(seedDragnet()),
    /dragnet\|kind=root-find\|ref=tcc-prompt\|path=root-find\|cue=root-find/,
  );
  assert.equal(classify({ seed: "has-repro", preferSeed: true }), "has-repro");
});

test("forbidden idle list includes prior catalog words and enrolled/equated/penned/ungloved", () => {
  const required = [
    "enrolled",
    "equated",
    "penned",
    "ungloved",
    "attested",
    "reaped",
    "tenanted",
    "intact",
    "matricula",
    "allograph",
    "agraphia",
    "gauntlet",
    "lictor",
    "lychgate",
    "ouster",
    "frisket",
    "scant",
    "reload-blind",
    "win-posix-mismatch",
    "pre-tool-omit",
    "attach-mouse",
    "picker-bypass",
  ];
  for (const word of required) {
    assert.ok(FORBIDDEN_IDLE.includes(word), `missing forbidden idle ${word}`);
  }
});

test("scoped booth flips dragnet back when the case admits scoped", () => {
  const tape = {
    scoped: true,
    dragnet: false,
    rootFind: false,
    cue: "scoped",
  };
  assert.equal(scoreGate(tape).verdict, "scoped");
  tape.scoped = false;
  tape.dragnet = true;
  tape.rootFind = true;
  tape.cue = "dragnet";
  assert.equal(scoreGate(tape).verdict, "dragnet");
  tape.scoped = true;
  tape.dragnet = false;
  tape.rootFind = false;
  tape.cue = "scoped";
  assert.equal(scoreGate(tape).verdict, "scoped");
});

test("case, find, alleys, tcc, and readBooth mark the dragnet proof", () => {
  const caseFile = inspectCase({ dragnet: true });
  assert.equal(caseFile.stamp, "case-left");
  const find = inspectFind({ dragnet: true, fullDiskFind: true });
  assert.equal(find.stamp, "net-cast");
  assert.equal(find.cast, true);
  const alleys = inspectAlleys({ dragnet: true, alleyTrawl: true });
  assert.equal(alleys.stamp, "alley-trawl");
  const booth = readBooth({
    dragnet: true,
    rootFind: true,
    fullDiskFind: true,
  });
  assert.equal(booth.dragnet, true);
  assert.equal(booth.mark, "dragnet");
  const open = readBooth({
    scoped: true,
    dragnet: false,
    rootFind: false,
  });
  assert.equal(open.dragnet, false);
  assert.equal(open.mark, "scoped");
  assert.equal(inspectTcc({ dragnet: true, tccPrompt: true }).stamp, "tcc-prompt");
  assert.equal(inspectLoop({ dragnet: true, blotterLoop: true }).stamp, "blotter-loop");
  assert.equal(inspectProcess({ dragnet: true, sharedProcess: true }).stamp, "shared-process");
});

test("mapNet encodes the published unscoped trawl", () => {
  const miss = mapNet({ dragnet: true, rootFind: true });
  assert.equal(miss.stamp, "root-find");
  assert.equal(miss.holdingLane, "full-disk-find");
  assert.equal(miss.ribbon, "dragnet");
  const clear = mapNet({ scoped: true, dragnet: false });
  assert.equal(clear.stamp, "scoped-case");
  assert.equal(clear.kindLane, "cwd-scoped");
  assert.equal(clear.holdingLane, "fenced");
});

test("cousins stay empty; products stay distinct; backups stay data-only", () => {
  assert.equal(COUSINS.length, 0);
  assert.ok(NOT_PRODUCTS.includes("matricula"));
  assert.ok(NOT_PRODUCTS.includes("allograph"));
  assert.ok(NOT_PRODUCTS.includes("agraphia"));
  assert.ok(NOT_PRODUCTS.includes("gauntlet"));
  assert.ok(NOT_PRODUCTS.includes("frisket"));
  assert.ok(NOT_PRODUCTS.includes("scant"));
  assert.equal(BACKUPS.length, 5);
  assert.equal(BACKUPS[0].issue, 93924);
  assert.equal(BACKUPS[4].issue, 94277);
  assert.ok(BACKUPS.every((row) => row.citeOnly === true));
  assert.ok(!BACKUPS.some((row) => row.issue === 94064));
  assert.equal(classify({ seed: "cousins", preferSeed: true }), "cousins");
  assert.equal(classify({ seed: "backups", preferSeed: true }), "backups");
});

test("CLI scores fixtures without a server", () => {
  const idle = spawnSync(process.execPath, [modelPath()], { encoding: "utf8" });
  const seeded = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/dragnet.json", import.meta.url))],
    { encoding: "utf8" },
  );
  const scopedFix = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/scoped.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(idle.status, 0, idle.stderr);
  assert.equal(seeded.status, 0, seeded.stderr);
  assert.equal(scopedFix.status, 0, scopedFix.stderr);
  const idleOut = JSON.parse(idle.stdout);
  const seededOut = JSON.parse(seeded.stdout);
  const scopedOut = JSON.parse(scopedFix.stdout);
  assert.equal(idleOut.verdict, "scoped");
  assert.equal(idleOut.hold, true);
  assert.equal(seededOut.verdict, "dragnet");
  assert.equal(seededOut.alarm, true);
  assert.equal(scopedOut.verdict, "scoped");
  assert.equal(scopedOut.hold, true);
  assert.match(scopedOut.phrase, /admit scoped/);
});

test("handle exposes published hypothesis and #94064 headline", () => {
  const result = handle(seedDragnet());
  assert.equal(result.published.issue, 94064);
  assert.equal(result.published.platform, "macos");
  assert.deepEqual(result.published.cousins, []);
  assert.ok(result.published.backups.includes(93924));
  assert.ok(result.published.backups.includes(94277));
  assert.ok(!result.published.backups.includes(94064));
  assert.match(
    result.published.hypothesis,
    /usr\/bin\/find|TCC|other-apps|NON-BINDING|#94064/i,
  );
  assert.match(result.published.hypothesis, /NON-BINDING/);
  assert.match(result.published.hypothesis, /#94064/);
  assert.equal(result.published.build, BUILD);
});

test("model has no static node: imports so the scoped page can score in-browser", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /^import .* from "node:/m);
  assert.match(source, /import\("node:fs"\)/);
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
});

test("scoped page is a night blotter, not matricula desk or allograph foundry", () => {
  const page = readPage();
  assert.match(page, /family=Archivo\+Black|Archivo Black/);
  assert.match(page, /family=Figtree|Figtree/);
  assert.match(page, /DM\+Mono|DM Mono/);
  assert.match(
    page,
    /dragnet|scoped|root-find|open-case|net-cast|alley-trawl|tcc-prompt|blotter-loop|shared-process/i,
  );
  assert.match(page, /#12151A|#E8E4D9|#E6B422|#4A6FA5|#8B909A/i);
  assert.match(page, /\bscoped\b/);
  assert.match(page, /\bdragnet\b/);
  assert.match(page, /root-find/);
  assert.match(page, /Score dragnet or admit scoped/i);
  assert.match(page, /#365/);
  assert.match(page, /#94064/);
  assert.match(page, /Admit scoped/);
  assert.match(page, /Score dragnet/);
  assert.match(page, /Walk root-find/);
  assert.match(page, /Compare scoped \/ dragnet/);
  assert.match(page, /Pin idle scoped/);
  assert.match(page, /Pin seeded dragnet/);
  assert.match(page, /Pin root-find/);
  assert.match(page, /Stamp TCC/);
  assert.match(page, /Score booth/);
  assert.match(page, /dragnet-score/);
  assert.match(
    page,
    /usr\/bin\/find|2\.1\.266|TCC|AddressBook|CallHistoryDB|1\.5/i,
  );
  assert.match(page, /open-case|net-cast|alley-trawl|tcc-prompt|blotter-loop|shared-process/i);
  assert.match(
    page,
    /<svg[\s\S]*class="city-grid"|class="caution-tape"|class="dragnet-mesh"|class="case-folder"|class="tcc-stamp"|class="dispatch-clock"/i,
  );
  assert.doesNotMatch(page, /family=Bitter|Bitter/);
  assert.doesNotMatch(page, /family=Karla|Karla/);
  assert.doesNotMatch(page, /Roboto\+Mono|Roboto Mono/);
  assert.doesNotMatch(page, /family=Fraunces|Fraunces/);
  assert.doesNotMatch(page, /family=Source\+Sans\+3|Source Sans 3/);
  assert.doesNotMatch(page, /IBM\+Plex\+Mono|IBM Plex Mono/);
  assert.doesNotMatch(page, /family=Crimson\+Pro|Crimson Pro/);
  assert.doesNotMatch(page, /family=Outfit|Outfit/);
  assert.doesNotMatch(page, /JetBrains\+Mono|JetBrains Mono/);
  assert.doesNotMatch(page, /family=Cinzel|Cinzel/);
  assert.doesNotMatch(page, /#F7F0E6|#1A211C|#3A6B4F|#C4A15A|#6B3E2E/);
  assert.doesNotMatch(page, /#F3E6C9|#B87333|#F4F1EA|#D4A04A|#8B1E2D/);
  assert.doesNotMatch(page, /enrollment-desk|enrollment-floor|ivory blotter/i);
  assert.doesNotMatch(page, /tilting-yard|iron glove|riveted cuff|mail sleeve/i);
  assert.doesNotMatch(page, /fasces|purple aisle|curule/i);
  assert.doesNotMatch(page, /neurology writing-desk|writing-hand|quill-lift|clinic-desk/i);
  assert.doesNotMatch(page, /type-foundry|punchcutter|dual-script|win-punch|posix-matrix/i);
  assert.doesNotMatch(page, /admit enrolled|Score matricula|idle enrolled/i);
  assert.doesNotMatch(page, /admit equated|Score allograph|idle equated/i);
  assert.doesNotMatch(page, /admit penned|Score agraphia|idle penned/i);
  assert.doesNotMatch(page, /admit ungloved|Score gauntlet|idle ungloved/i);
  assert.doesNotMatch(page, /\bmatricula\b/);
  assert.doesNotMatch(page, /\ballograph\b/);
  assert.doesNotMatch(page, /\bagraphia\b/);
  assert.doesNotMatch(page, /\bgauntlet\b/);
  assert.doesNotMatch(page, /\blictor\b/);
  assert.doesNotMatch(page, /reload-blind/);
  assert.doesNotMatch(page, /win-posix-mismatch/);
  assert.doesNotMatch(page, /pre-tool-omit/);
  assert.match(page, /NOT Matricula/i);
  assert.match(page, /NOT Allograph/i);
  assert.match(page, /NOT Agraphia/i);
  assert.match(page, /NOT Gauntlet/i);
  assert.doesNotMatch(page, /fetch\(/);
  assert.match(page, /body\.embed/);
});

test("README states the thesis, anti-clone, and how to score", () => {
  const readme = readReadme();
  assert.match(readme, /Dragnet/);
  assert.match(readme, /#94064/);
  assert.match(readme, /\bscoped\b/);
  assert.match(readme, /\bdragnet\b/);
  assert.match(readme, /root-find/);
  assert.match(readme, /Archivo Black/);
  assert.match(readme, /Figtree/);
  assert.match(readme, /DM Mono/);
  assert.doesNotMatch(readme, /Bitter/);
  assert.doesNotMatch(readme, /Fraunces/);
  assert.doesNotMatch(readme, /Crimson Pro/);
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /Research brief/i);
  assert.match(readme, /usr\/bin\/find|2\.1\.266|TCC|AddressBook|1\.5/i);
  assert.match(readme, /NOT Matricula\/#93987/);
  assert.match(readme, /NOT Allograph\/#94256/);
  assert.match(readme, /NOT Agraphia\/#94251/);
  assert.match(readme, /NOT Gauntlet\/#94029/);
  assert.match(readme, /NOT Frisket/);
  assert.match(readme, /NOT Scant/);
  assert.match(readme, /none named|do NOT invent/i);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/dragnet/);
  assert.match(readme, /node --test projects\/dragnet\/dragnet\.test\.mjs/);
  assert.match(readme, /NON-BINDING/);
  assert.match(readme, /night blotter|caution tape|dragnet|asphalt/i);
  assert.match(readme, /Score dragnet or admit scoped/);
  assert.match(readme, /#93924|#93770|#93777|#94151|#94277/);
  assert.doesNotMatch(readme, /backup #94064|#94064 as next/);
  assert.match(readme, /04:50/);
  assert.match(readme, /Do NOT implement a fix/i);
  assert.doesNotMatch(readme, /\bmatricula\b/);
  assert.doesNotMatch(readme, /\ballograph\b/);
  const runLog = readFileSync(
    fileURLToPath(new URL("../../RUN_LOG.md", import.meta.url)),
    "utf8",
  );
  assert.match(runLog, /## 2026-09-15 — Dragnet/);
  assert.match(runLog, /04:50/);
});

test("catalog features Dragnet only; Matricula unfeatured; product count 365", () => {
  const catalog = readCatalog();
  const hub = readHubCatalog();
  assert.equal(catalog.products.length, 365);
  assert.equal(hub.products.length, 365);
  assert.equal(catalog.products[0].name, "Dragnet");
  assert.equal(catalog.products[0].slug, "dragnet");
  assert.equal(catalog.products[0].featured, true);
  assert.equal(catalog.products[0].href, "/dragnet/");
  assert.equal(catalog.products[0].day, "2026-09-15");
  assert.equal(catalog.products[0].summary, CATALOG_SUMMARY);
  assert.equal(hub.products[0].summary, catalog.products[0].summary);
  assert.match(catalog.products[0].summary, /\bscoped\b/);
  assert.match(catalog.products[0].summary, /\bdragnet\b/);
  assert.match(catalog.products[0].summary, /root-find/);
  assert.match(catalog.products[0].summary, /Score dragnet or admit scoped/);
  assert.match(catalog.products[0].summary, /#94064/);
  assert.equal(hub.products[0].slug, "dragnet");
  assert.equal(hub.products[0].featured, true);
  const matricula = catalog.products.find((row) => row.slug === "matricula");
  assert.ok(matricula);
  assert.equal(matricula.featured, false);
  const allograph = catalog.products.find((row) => row.slug === "allograph");
  assert.ok(allograph);
  assert.equal(allograph.featured, false);
  const agraphia = catalog.products.find((row) => row.slug === "agraphia");
  assert.ok(agraphia);
  assert.equal(agraphia.featured, false);
  assert.equal(catalog.products.filter((row) => row.featured).length, 1);
  assert.equal(catalog.products.filter((row) => row.slug === "dragnet").length, 1);
  assert.ok(
    !catalog.products.some(
      (row) => String(row.summary || "").includes("94064") && row.slug !== "dragnet",
    ),
  );
});

test("vercel rewrites dragnet to the project folder at the top", () => {
  const vercel = readVercel();
  assert.equal(vercel.rewrites[0].source, "/dragnet");
  assert.equal(vercel.rewrites[0].destination, "/projects/dragnet");
  assert.equal(vercel.rewrites[1].source, "/dragnet/");
  assert.equal(vercel.rewrites[1].destination, "/projects/dragnet");
  assert.equal(vercel.rewrites[2].source, "/dragnet/:path*");
  assert.equal(vercel.rewrites[2].destination, "/projects/dragnet/:path*");
  assert.equal(vercel.rewrites[3].source, "/matricula");
  assert.equal(vercel.rewrites[3].destination, "/projects/matricula");
});

test("no network calls in the model or tests", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
  assert.doesNotMatch(source, /https?:\/\/[^\s"']*anthropic\.com\/v1/);
});
