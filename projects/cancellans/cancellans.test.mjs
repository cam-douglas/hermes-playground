import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ADDED_NAMES,
  ALARM,
  BACKUPS,
  BOOTH_STATIONS,
  BUILD,
  BUILD_VERSION,
  CACHE_TTL,
  CANCELLANS_WALK,
  CHIPS,
  COLD_WITHOUT_TOOL_READ,
  COUSINS,
  DEFERRED_DELTA_TYPE,
  DISTRIBUTION,
  END_CONVERSATION,
  EXPECTED,
  FEATURED_ISSUE,
  FIELD_MARKS,
  FINGERPRINT_LINES,
  FOLIO_NAMES,
  FORBIDDEN_IDLE,
  FORBIDDEN_SEED,
  FORK_FIRST_CREATE,
  FORK_FIRST_READ,
  HOLD,
  HOLD_ALIASES,
  HOST,
  IDLE_WORD,
  ISSUE_URL,
  LABELS,
  NOT_PRODUCTS,
  PARENT_TOOLS,
  PATH_WORD,
  PHRASE,
  PLATFORM,
  POSITIVE_CONTROL_WALK,
  PRODUCT_WORD,
  RULED_OUT,
  SAMPLE_CANCELLANS_PROOF,
  SEEDED_WORD,
  STATE,
  SURFACE,
  TITLE,
  TOOLS_FLAG,
  VERDICTS,
  analyze,
  classify,
  decide,
  emptyTicket,
  fingerprint,
  handle,
  inspectCache,
  inspectDelta,
  inspectEndConversation,
  inspectFolio,
  inspectFork,
  inspectTtl,
  mapCancellans,
  readBooth,
  restoreInitialTools,
  score,
  scoreCachePrefix,
  scoreGate,
  scoreWalk,
  seedCacheMiss,
  seedCancellans,
  seedDeferredDelta,
  seedHold,
  seedInitialDrop,
  seedIntact,
  seedProduct,
} from "./cancellans.mjs";

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
  return fileURLToPath(new URL("./cancellans.mjs", import.meta.url));
}

const CATALOG_SUMMARY =
  "09:50 cancellans: a binder / print-shop / cancelled-leaf / folio-press booth for #94400. Resumed (--resume) fork drops a server-gated tool (EndConversation) that was in the parent's initial tools array; first fork request omits it and only later gets deferred_tools_delta — prompt-cache prefix misses despite TTL. Post-first-request tools restore OK. Idle intact / seeded cancellans / path deferred-delta. Score cancellans or admit intact.";

test("idle intact is a hold; parent's initial tools array restored; prefix hot", () => {
  const result = analyze(seedIntact());
  assert.equal(result.verdict, "intact");
  assert.equal(result.idleWord, "intact");
  assert.equal(IDLE_WORD, "intact");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.intact, true);
  assert.equal(result.phrase, "admit intact");
  assert.equal(result.cancellans, false);
  assert.equal(result.deferredDelta, false);
  assert.ok(HOLD_ALIASES.includes("bound"));
  assert.ok(HOLD_ALIASES.includes("mirrored"));
  assert.ok(HOLD_ALIASES.includes("folio-match"));
  assert.ok(HOLD_ALIASES.includes("prefix-hot"));
  assert.ok(HOLD_ALIASES.includes("tools-restored"));
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(result.idleWord, word);
    assert.notEqual(result.verdict, word);
  }
  assert.notEqual(IDLE_WORD, "cleared");
  assert.notEqual(IDLE_WORD, "armed");
  assert.notEqual(IDLE_WORD, "affixed");
  assert.notEqual(IDLE_WORD, "unpacked");
  assert.notEqual(IDLE_WORD, "draped");
  assert.notEqual(IDLE_WORD, "hung");
  assert.notEqual(IDLE_WORD, "screened");
  assert.notEqual(IDLE_WORD, "sealed");
  assert.notEqual(IDLE_WORD, "latched");
  assert.notEqual(IDLE_WORD, "guarded");
  assert.notEqual(IDLE_WORD, "scoped");
  assert.notEqual(IDLE_WORD, "enrolled");
});

test("empty ticket and empty stdin classify intact", () => {
  assert.equal(classify(emptyTicket()), "intact");
  assert.equal(classify(""), "intact");
  assert.equal(classify(null), "intact");
  assert.equal(decide({}), "intact");
});

test("#94400 seeded path scores cancellans when the binder drops a first-folio line", () => {
  const result = analyze(seedCancellans());
  assert.equal(result.verdict, "cancellans");
  assert.equal(result.seededWord, "cancellans");
  assert.equal(SEEDED_WORD, "cancellans");
  assert.equal(PRODUCT_WORD, "cancellans");
  assert.equal(result.hold, false);
  assert.equal(result.alarm, true);
  assert.equal(result.cancellans, true);
  assert.equal(result.phrase, "score cancellans");
  assert.equal(result.deferredDelta, true);
  assert.equal(result.cacheMiss, true);
  for (const word of FORBIDDEN_SEED) {
    assert.notEqual(result.seededWord, word);
    assert.notEqual(result.verdict, word);
  }
  assert.notEqual(SEEDED_WORD, "arras");
  assert.notEqual(SEEDED_WORD, "frangible");
  assert.notEqual(SEEDED_WORD, "nameplate");
  assert.notEqual(SEEDED_WORD, "matryoshka");
  assert.notEqual(SEEDED_WORD, "dragnet");
  assert.notEqual(PATH_WORD, "phantom-prompt");
  assert.notEqual(PATH_WORD, "chmod-failopen");
});

test("educational tools-array helper encodes published intact vs deferred-delta paths", () => {
  assert.equal(END_CONVERSATION, "EndConversation");
  assert.equal(DEFERRED_DELTA_TYPE, "deferred_tools_delta");
  assert.equal(CACHE_TTL, "ephemeral_1h");
  assert.equal(TOOLS_FLAG, "Bash,PowerShell,Read,Grep,Glob");
  assert.ok(PARENT_TOOLS.includes(END_CONVERSATION));
  assert.deepEqual([...ADDED_NAMES], ["EndConversation"]);
  assert.equal(FORK_FIRST_READ, 7462);
  assert.equal(FORK_FIRST_CREATE, 20562);
  assert.equal(COLD_WITHOUT_TOOL_READ, 7462);
  assert.equal(BUILD_VERSION, "2.1.270");
  const dropped = restoreInitialTools({ intact: false });
  assert.equal(dropped.matched, false);
  assert.ok(dropped.missing.includes(END_CONVERSATION));
  assert.equal(dropped.prefixHot, false);
  const control = restoreInitialTools({ intact: true });
  assert.equal(control.matched, true);
  assert.equal(control.prefixHot, true);
  const hold = restoreInitialTools({
    intact: true,
    forkFirst: ["Bash"],
  });
  assert.equal(hold.matched, true);
  const scored = scoreCachePrefix({
    cancellans: true,
    deferredDelta: true,
    cacheMiss: true,
  });
  assert.equal(scored.cancellans, true);
  assert.equal(scored.cacheMiss, true);
  const intactPath = scoreCachePrefix({ intact: true });
  assert.equal(intactPath.cancellans, false);
  assert.equal(intactPath.intact, true);
});

test("inspectors mark fork folio drop and late paste-slip", () => {
  const fork = inspectFork({ cancellans: true, initialDrop: true });
  assert.equal(fork.stamp, "fork-folio");
  assert.equal(fork.omitted, true);
  const delta = inspectDelta({ cancellans: true, deferredDelta: true });
  assert.equal(delta.stamp, "paste-slip");
  assert.equal(delta.pasted, true);
  const scored = scoreGate({
    cancellans: true,
    deferredDelta: true,
    cacheMiss: true,
    cue: "cancellans",
  });
  assert.equal(scored.verdict, "cancellans");
  const open = inspectFolio({ intact: true, cancellans: false });
  assert.equal(open.stamp, "folio-bound");
});

test("path word is deferred-delta; booth seed holds the path", () => {
  assert.equal(PATH_WORD, "deferred-delta");
  const result = analyze(seedDeferredDelta());
  assert.equal(result.verdict, "deferred-delta");
  assert.equal(result.pathWord, "deferred-delta");
  assert.equal(result.hold, false);
  assert.equal(
    classify({
      seed: "deferred-delta",
      preferSeed: true,
      cancellans: true,
    }),
    "deferred-delta",
  );
  assert.equal(classify({ seed: "cache-miss", preferSeed: true }), "cache-miss");
  assert.equal(score(seedDeferredDelta()), "cancellans");
});

test("HOLD includes intact / hold", () => {
  assert.ok(HOLD.includes("intact"));
  assert.ok(HOLD.includes("hold"));
  const hold = analyze(seedHold());
  assert.equal(hold.verdict, "hold");
  assert.equal(hold.hold, true);
  assert.equal(classify({ seed: "hold", preferSeed: true }), "hold");
});

test("alarm chips: cache-miss, deferred-delta, cancellans", () => {
  assert.equal(classify({ seed: "cache-miss", preferSeed: true }), "cache-miss");
  assert.equal(classify(seedDeferredDelta()), "deferred-delta");
  assert.equal(classify(seedProduct()), "cancellans");
  assert.equal(classify(seedCacheMiss()), "cache-miss");
  assert.equal(classify(seedInitialDrop()), "initial-drop");
});

test("booth fixtures flip intact vs cancellans vs deferred-delta", () => {
  const idle = scoreGate(seedIntact());
  const seeded = scoreGate(seedCancellans());
  const intact = readData("intact.json");
  const cancellans = readData("cancellans.json");
  const issued = readData("94400.json");
  const path = readData("deferred-delta.json");
  const holdFix = readData("hold.json");
  assert.equal(idle.verdict, "intact");
  assert.equal(seeded.verdict, "cancellans");
  assert.notEqual(idle.verdict, seeded.verdict);
  assert.equal(score(seedIntact()), "intact");
  assert.equal(score(seedCancellans()), "cancellans");
  assert.equal(score({ seed: "deferred-delta", preferSeed: true }), "cancellans");
  assert.equal(intact.deferredDelta, false);
  assert.equal(intact.intact, true);
  assert.equal(scoreGate(intact).verdict, "intact");
  assert.equal(cancellans.deferredDelta, true);
  assert.equal(cancellans.cacheMiss, true);
  assert.equal(classify(cancellans), "cancellans");
  assert.equal(issued.issue, 94400);
  assert.equal(classify(issued), "cancellans");
  assert.equal(path.paths.length, 3);
  assert.match(path.paths[0].rule, /intact|bound|mirrored|folio-match|prefix-hot|tools-restored/i);
  assert.match(path.paths[1].result, /deferred-delta|cache-miss|initial-drop/i);
  assert.equal(classify(path), "deferred-delta");
  assert.equal(cancellans.hubCount, "CANCELLANS");
  assert.equal(cancellans.issue, 94400);
  assert.equal(cancellans.cancellans, true);
  assert.equal(classify(holdFix), "hold");
  assert.equal(classify(readData("bound.json")), "bound");
  assert.equal(classify(readData("mirrored.json")), "mirrored");
  assert.equal(classify(readData("folio-match.json")), "folio-match");
  assert.equal(classify(readData("prefix-hot.json")), "prefix-hot");
  assert.equal(classify(readData("tools-restored.json")), "tools-restored");
  assert.equal(classify(readData("cache-miss.json")), "cache-miss");
  assert.equal(classify(readData("initial-drop.json")), "initial-drop");
  assert.equal(classify(readData("endconversation.json")), "endconversation");
  assert.equal(classify(readData("fork-resume.json")), "fork-resume");
  assert.equal(classify(readData("ttl-alive.json")), "ttl-alive");
  assert.equal(classify(readData("landing.json")), "landing");
  assert.equal(classify(readData("cousins.json")), "cousins");
  assert.deepEqual(readData("cousins.json").issues, [92033, 91151, 92524, 83913]);
  assert.equal(classify(readData("backups.json")), "backups");
  assert.equal(classify(readData("walk.json")), "walk");
  assert.equal(classify(readData("has-repro.json")), "has-repro");
  assert.equal(classify(readData("fixtures.json")), "fixtures");
  assert.equal(classify(readData("closed.json")), "closed");
});

test("chips include idle, seeded, path, and walk", () => {
  assert.ok(CHIPS.includes("intact"));
  assert.ok(CHIPS.includes("cancellans"));
  assert.ok(CHIPS.includes("deferred-delta"));
  assert.ok(CHIPS.includes("cache-miss"));
  assert.ok(CHIPS.includes("initial-drop"));
  assert.ok(CHIPS.includes("endconversation"));
  assert.ok(CHIPS.includes("prefix-hot"));
  assert.ok(CHIPS.includes("fixtures"));
  assert.ok(CHIPS.includes("walk"));
  assert.ok(ALARM.includes("cancellans"));
  assert.ok(ALARM.includes("deferred-delta"));
  assert.ok(ALARM.includes("cache-miss"));
  assert.ok(ALARM.includes("initial-drop"));
  assert.ok(VERDICTS.includes("walk"));
  assert.equal(classify({ seed: "fixtures", preferSeed: true }), "fixtures");
  assert.equal(classify({ seed: "walk", preferSeed: true }), "walk");
});

test("published cancellans walk scores cancellans after the idle hold", () => {
  const booth = scoreWalk({ rows: CANCELLANS_WALK });
  assert.equal(booth.verdict, "cancellans");
  assert.ok(booth.cancellansCount >= 1);
  const idle = booth.rows.find((row) => row.event === "prefix-hot");
  assert.equal(idle.intact, true);
  assert.equal(idle.verdict, "intact");
  const cut = booth.rows.find((row) => row.event === "deferred-delta");
  assert.equal(cut.deferredDelta, true);
  const path = booth.rows.find(
    (row) => row.event === "deferred-delta" && row.t === "path",
  );
  assert.equal(path.verdict, "deferred-delta");
});

test("CANCELLANS_WALK constant matches the issue folio walk", () => {
  assert.equal(CANCELLANS_WALK[0].event, "prefix-hot");
  const cut = CANCELLANS_WALK.find((row) => row.event === "deferred-delta");
  assert.equal(cut.deferredDelta || cut.initialDrop, true);
  const path = CANCELLANS_WALK.find((row) => row.t === "path");
  assert.equal(path.cancellans, true);
  const scoreRow = CANCELLANS_WALK.find((row) => row.event === "cancellans");
  assert.equal(scoreRow.cancellans, true);
  assert.equal(scoreRow.cacheMiss, true);
});

test("positive control prefix-hot folio stays intact", () => {
  const walk = scoreWalk({ rows: POSITIVE_CONTROL_WALK });
  assert.equal(walk.verdict, "intact");
  const ok = walk.rows.find((row) => row.t === "hold");
  assert.equal(ok.verdict, "intact");
  const hold = walk.rows.find((row) => row.event === "prefix-hot");
  assert.equal(hold.intact, true);
  assert.equal(hold.verdict, "intact");
});

test("issue constants encode only #94400 published facts", () => {
  assert.equal(FEATURED_ISSUE, 94400);
  assert.ok(ISSUE_URL.includes("94400"));
  assert.match(TITLE, /Resumed session|EndConversation|prompt cache/i);
  assert.equal(STATE, "OPEN");
  assert.match(PLATFORM, /windows/i);
  assert.match(HOST, /2\.1\.270|Windows 11/i);
  assert.equal(BUILD, "Claude Code 2.1.270; Windows 11");
  assert.equal(SURFACE, "deferred-delta");
  assert.deepEqual(
    [...LABELS],
    ["bug", "has-repro", "platform:windows", "area:core"],
  );
  assert.equal(FIELD_MARKS.length, 6);
  assert.equal(FOLIO_NAMES.length, 6);
  assert.ok(RULED_OUT.some((row) => /Arras|#94348/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /Frangible|#94362/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /Nameplate|#94349/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /#92033/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /#94336/i.test(row)));
  assert.ok(EXPECTED.some((row) => /prompt_snapshot|tools array|deferred_tools_delta/i.test(row)));
  assert.match(
    DISTRIBUTION,
    /--resume|EndConversation|deferred_tools_delta|ephemeral_1h|7,462|20,562/i,
  );
  assert.equal(BOOTH_STATIONS.length, 6);
  assert.ok(FINGERPRINT_LINES.includes("deferred-delta"));
  assert.ok(FINGERPRINT_LINES.includes("cancellans"));
  assert.equal(PHRASE, "Score cancellans or admit intact.");
  assert.equal(SAMPLE_CANCELLANS_PROOF.deferredDelta, true);
  assert.equal(SAMPLE_CANCELLANS_PROOF.names.length, 6);
});

test("has-repro fingerprints encode the published cancellans proof", () => {
  const result = handle(seedCancellans());
  assert.equal(result.published.platform, "windows");
  assert.equal(result.published.surface, "deferred-delta");
  assert.equal(result.published.host, HOST);
  assert.match(
    fingerprint(seedCancellans()),
    /cancellans\|kind=deferred-delta\|ref=cache-miss\|path=deferred-delta\|cue=deferred-delta/,
  );
  assert.equal(classify({ seed: "has-repro", preferSeed: true }), "has-repro");
});

test("forbidden idle list includes prior catalog words and cleared/armed/affixed/unpacked/draped", () => {
  const required = [
    "cleared",
    "armed",
    "sealed",
    "latched",
    "guarded",
    "affixed",
    "unpacked",
    "draped",
    "hung",
    "screened",
    "scoped",
    "enrolled",
    "equated",
    "penned",
    "ungloved",
    "attested",
    "arras",
    "frangible",
    "nameplate",
    "matryoshka",
    "dragnet",
    "matricula",
    "allograph",
    "agraphia",
    "gauntlet",
    "lictor",
    "lychgate",
    "ouster",
    "frisket",
    "scant",
    "knock",
    "phantom-prompt",
    "chmod-failopen",
    "header-rename",
    "subst-nest",
    "root-find",
    "reload-blind",
    "win-posix-mismatch",
  ];
  for (const word of required) {
    assert.ok(FORBIDDEN_IDLE.includes(word), `missing forbidden idle ${word}`);
  }
});

test("intact booth flips cancellans back when the press admits intact", () => {
  const tape = {
    intact: true,
    cancellans: false,
    deferredDelta: false,
    cue: "intact",
  };
  assert.equal(scoreGate(tape).verdict, "intact");
  tape.intact = false;
  tape.cancellans = true;
  tape.deferredDelta = true;
  tape.cue = "cancellans";
  assert.equal(scoreGate(tape).verdict, "cancellans");
  tape.intact = true;
  tape.cancellans = false;
  tape.deferredDelta = false;
  tape.cue = "intact";
  assert.equal(scoreGate(tape).verdict, "intact");
});

test("folio, fork, delta, and readBooth mark the cancellans proof", () => {
  const folio = inspectFolio({ cancellans: true });
  assert.equal(folio.stamp, "parent-folio");
  const fork = inspectFork({ cancellans: true, initialDrop: true });
  assert.equal(fork.stamp, "fork-folio");
  assert.equal(fork.omitted, true);
  const booth = readBooth({
    cancellans: true,
    deferredDelta: true,
    cacheMiss: true,
  });
  assert.equal(booth.cancellans, true);
  assert.equal(booth.mark, "cancellans");
  const open = readBooth({
    intact: true,
    cancellans: false,
    deferredDelta: false,
  });
  assert.equal(open.cancellans, false);
  assert.equal(open.mark, "intact");
  assert.equal(inspectDelta({ cancellans: true, deferredDelta: true }).stamp, "paste-slip");
  assert.equal(inspectCache({ cancellans: true, cacheMiss: true }).stamp, "cache-lamp");
  assert.equal(inspectTtl({ cancellans: true, ttlAlive: true }).stamp, "ttl-alive");
  assert.equal(inspectEndConversation({ cancellans: true, endConversation: true }).stamp, "endconversation");
});

test("mapCancellans encodes the published deferred-delta", () => {
  const miss = mapCancellans({ cancellans: true, deferredDelta: true });
  assert.equal(miss.stamp, "deferred-delta");
  assert.equal(miss.holdingLane, "initial-drop");
  assert.equal(miss.ribbon, "cancellans");
  const clear = mapCancellans({ intact: true, cancellans: false });
  assert.equal(clear.stamp, "prefix-hot");
  assert.equal(clear.kindLane, "folio-match");
  assert.equal(clear.holdingLane, "prefix-hot");
});

test("cousins stay cite-only; products stay distinct; backups stay data-only", () => {
  assert.equal(COUSINS.length, 4);
  assert.deepEqual(COUSINS.map((row) => row.issue), [92033, 91151, 92524, 83913]);
  assert.ok(COUSINS.every((row) => row.citeOnly === true));
  assert.ok(NOT_PRODUCTS.includes("arras"));
  assert.ok(NOT_PRODUCTS.includes("frangible"));
  assert.ok(NOT_PRODUCTS.includes("nameplate"));
  assert.ok(NOT_PRODUCTS.includes("matryoshka"));
  assert.ok(NOT_PRODUCTS.includes("dragnet"));
  assert.ok(NOT_PRODUCTS.includes("matricula"));
  assert.ok(NOT_PRODUCTS.includes("allograph"));
  assert.ok(NOT_PRODUCTS.includes("agraphia"));
  assert.ok(NOT_PRODUCTS.includes("gauntlet"));
  assert.ok(NOT_PRODUCTS.includes("frisket"));
  assert.ok(NOT_PRODUCTS.includes("scant"));
  assert.ok(NOT_PRODUCTS.includes("knock"));
  assert.equal(BACKUPS.length, 4);
  assert.equal(BACKUPS[0].issue, 93924);
  assert.equal(BACKUPS[3].issue, 94151);
  assert.ok(BACKUPS.every((row) => row.citeOnly === true));
  assert.ok(!BACKUPS.some((row) => row.issue === 94400));
  assert.ok(!BACKUPS.some((row) => row.issue === 94336));
  assert.ok(!COUSINS.some((row) => row.issue === 94336));
  assert.equal(classify({ seed: "cousins", preferSeed: true }), "cousins");
  assert.equal(classify({ seed: "backups", preferSeed: true }), "backups");
});

test("CLI scores fixtures without a server", () => {
  const idle = spawnSync(process.execPath, [modelPath()], { encoding: "utf8" });
  const seeded = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/cancellans.json", import.meta.url))],
    { encoding: "utf8" },
  );
  const intactFix = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/intact.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(idle.status, 0, idle.stderr);
  assert.equal(seeded.status, 0, seeded.stderr);
  assert.equal(intactFix.status, 0, intactFix.stderr);
  const idleOut = JSON.parse(idle.stdout);
  const seededOut = JSON.parse(seeded.stdout);
  const intactOut = JSON.parse(intactFix.stdout);
  assert.equal(idleOut.verdict, "intact");
  assert.equal(idleOut.hold, true);
  assert.equal(seededOut.verdict, "cancellans");
  assert.equal(seededOut.alarm, true);
  assert.equal(intactOut.verdict, "intact");
  assert.equal(intactOut.hold, true);
  assert.match(intactOut.phrase, /admit intact/);
});

test("handle exposes published hypothesis and #94400 headline", () => {
  const result = handle(seedCancellans());
  assert.equal(result.published.issue, 94400);
  assert.equal(result.published.platform, "windows");
  assert.deepEqual(result.published.cousins, [92033, 91151, 92524, 83913]);
  assert.ok(result.published.backups.includes(93924));
  assert.ok(result.published.backups.includes(94151));
  assert.ok(!result.published.backups.includes(94400));
  assert.ok(!result.published.backups.includes(94336));
  assert.match(
    result.published.hypothesis,
    /resume|EndConversation|deferred_tools_delta|NON-BINDING|#94400/i,
  );
  assert.match(result.published.hypothesis, /NON-BINDING/);
  assert.match(result.published.hypothesis, /#94400/);
  assert.equal(result.published.build, BUILD);
});

test("model has no static node: imports so the intact page can score in-browser", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /^import .* from "node:/m);
  assert.match(source, /import\("node:fs"\)/);
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
});

test("intact page is a binder press, not arras theater or frangible wax-seal", () => {
  const page = readPage();
  assert.match(page, /family=Fraunces|Fraunces/);
  assert.match(page, /family=Nunito\+Sans|Nunito Sans/);
  assert.match(page, /IBM\+Plex\+Mono|IBM Plex Mono/);
  assert.match(
    page,
    /cancellans|intact|deferred-delta|binder-cloth|cancelled-stamp|folio-press|sewing-thread|replacement-leaf/i,
  );
  assert.match(page, /#1B2430|#C23B22|#F4ECD8|#0D0C0A|#E0A100|#2A9D8F/i);
  assert.match(page, /\bintact\b/);
  assert.match(page, /\bcancellans\b/);
  assert.match(page, /deferred-delta/);
  assert.match(page, /Score cancellans or admit intact/i);
  assert.match(page, /#370/);
  assert.match(page, /#94400/);
  assert.match(page, /Admit intact/);
  assert.match(page, /Score cancellans/);
  assert.match(page, /Walk deferred-delta/);
  assert.match(page, /Compare intact \/ cancellans/);
  assert.match(page, /Pin idle intact/);
  assert.match(page, /Pin seeded cancellans/);
  assert.match(page, /Pin deferred-delta/);
  assert.match(page, /Stamp cache-miss/);
  assert.match(page, /Score booth/);
  assert.match(page, /cancellans-score/);
  assert.match(
    page,
    /EndConversation|deferred_tools_delta|--resume|ephemeral_1h|prompt_snapshot|7,462/i,
  );
  assert.match(page, /parent-folio|fork-folio|paste-slip|cache-lamp|initial-drop/i);
  assert.match(
    page,
    /<svg[\s\S]*class="binder-cloth"|class="folio-press"|class="cancelled-stamp"|class="sewing-thread"|class="replacement-leaf"|class="cache-lamp"/i,
  );
  assert.doesNotMatch(page, /family=Playfair|Playfair Display/);
  assert.doesNotMatch(page, /family=Source\+Sans\+3|Source Sans 3/);
  assert.doesNotMatch(page, /JetBrains\+Mono|JetBrains Mono/);
  assert.doesNotMatch(page, /family=Cinzel|Cinzel/);
  assert.doesNotMatch(page, /family=Manrope|Manrope/);
  assert.doesNotMatch(page, /family=Libre\+Baskerville|Libre Baskerville/);
  assert.doesNotMatch(page, /family=Yeseva\+One|Yeseva One/);
  assert.doesNotMatch(page, /family=Archivo\+Black|Archivo Black/);
  assert.doesNotMatch(page, /family=Figtree|Figtree/);
  assert.doesNotMatch(page, /DM\+Mono|DM Mono/);
  assert.doesNotMatch(page, /family=Bitter|Bitter/);
  assert.doesNotMatch(page, /family=Karla|Karla/);
  assert.doesNotMatch(page, /Roboto\+Mono|Roboto Mono/);
  assert.doesNotMatch(page, /#1A0F1C|#C9A227|#F3EDE0|#8B1E3F|#4ECDC4/);
  assert.doesNotMatch(page, /#1E1740|#E09A3A|#F6EFD8|#3DD6D0|#120E28/);
  assert.doesNotMatch(page, /#B08D57|#F7F1E5|#3B1F14|#1A1A1A|#2F6F5E/);
  assert.doesNotMatch(page, /#C41E3A|#F4E8D8|#1B2838|#D4A017|#2A2A2A/);
  assert.doesNotMatch(page, /#12151A|#E8E4D9|#E6B422|#4A6FA5|#8B909A/);
  assert.doesNotMatch(page, /wax-seal atelier|glass ampule|shear-pin|wax press/i);
  assert.doesNotMatch(page, /hotel door-plate|mahogany door|front-desk ledger|verdigris hinge/i);
  assert.doesNotMatch(page, /lacquer nesting-doll|birch-workshop|gold leaf|indigo cloth/i);
  assert.doesNotMatch(page, /night blotter|caution tape|city-grid|police-fishing/i);
  assert.doesNotMatch(page, /enrollment-desk|enrollment-floor|ivory blotter/i);
  assert.doesNotMatch(page, /tilting-yard|iron glove|riveted cuff|mail sleeve/i);
  assert.doesNotMatch(page, /fasces|purple aisle|curule/i);
  assert.doesNotMatch(page, /neurology writing-desk|writing-hand|quill-lift|clinic-desk/i);
  assert.doesNotMatch(page, /type-foundry|punchcutter|dual-script|win-punch|posix-matrix/i);
  assert.doesNotMatch(page, /theater|tapestry|curtain-aisle|gallery-wing|Polonius|proscenium/i);
  assert.doesNotMatch(page, /admit armed|Score frangible|idle armed/i);
  assert.doesNotMatch(page, /admit affixed|Score nameplate|idle affixed/i);
  assert.doesNotMatch(page, /admit unpacked|Score matryoshka|idle unpacked/i);
  assert.doesNotMatch(page, /admit scoped|Score dragnet|idle scoped/i);
  assert.doesNotMatch(page, /admit enrolled|Score matricula|idle enrolled/i);
  assert.doesNotMatch(page, /admit cleared|Score arras|idle cleared/i);
  assert.doesNotMatch(page, /\barras\b/);
  assert.doesNotMatch(page, /\bfrangible\b/);
  assert.doesNotMatch(page, /\bnameplate\b/);
  assert.doesNotMatch(page, /\bmatryoshka\b/);
  assert.doesNotMatch(page, /\bdragnet\b/);
  assert.doesNotMatch(page, /\bmatricula\b/);
  assert.doesNotMatch(page, /\ballograph\b/);
  assert.doesNotMatch(page, /\bagraphia\b/);
  assert.doesNotMatch(page, /\bgauntlet\b/);
  assert.doesNotMatch(page, /phantom-prompt/);
  assert.doesNotMatch(page, /chmod-failopen/);
  assert.doesNotMatch(page, /header-rename/);
  assert.doesNotMatch(page, /subst-nest/);
  assert.doesNotMatch(page, /root-find/);
  assert.doesNotMatch(page, /reload-blind/);
  assert.doesNotMatch(page, /win-posix-mismatch/);
  assert.match(page, /NOT Arras/i);
  assert.match(page, /NOT Frangible/i);
  assert.match(page, /NOT Nameplate/i);
  assert.match(page, /NOT Matryoshka/i);
  assert.match(page, /NOT Dragnet/i);
  assert.match(page, /NOT Knock/i);
  assert.match(page, /#92033/);
  assert.match(page, /#91151/);
  assert.match(page, /#92524/);
  assert.match(page, /#83913/);
  assert.doesNotMatch(page, /#94336/);
  assert.doesNotMatch(page, /fetch\(/);
  assert.match(page, /body\.embed/);
});

test("README states the thesis, anti-clone, and how to score", () => {
  const readme = readReadme();
  assert.match(readme, /Cancellans/);
  assert.match(readme, /#94400/);
  assert.match(readme, /\bintact\b/);
  assert.match(readme, /\bcancellans\b/);
  assert.match(readme, /deferred-delta/);
  assert.match(readme, /Fraunces/);
  assert.match(readme, /Nunito Sans/);
  assert.match(readme, /IBM Plex Mono/);
  assert.doesNotMatch(readme, /Playfair Display/);
  assert.doesNotMatch(readme, /Source Sans 3/);
  assert.doesNotMatch(readme, /JetBrains Mono/);
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /Research brief/i);
  assert.match(readme, /EndConversation|deferred_tools_delta|--resume|prompt.cache/i);
  assert.match(readme, /NOT Arras\/#94348/);
  assert.match(readme, /NOT Frangible\/#94362/);
  assert.match(readme, /NOT Nameplate\/#94349/);
  assert.match(readme, /NOT Matryoshka\/#94350/);
  assert.match(readme, /NOT Dragnet\/#94064/);
  assert.match(readme, /NOT Matricula\/#93987/);
  assert.match(readme, /NOT Allograph\/#94256/);
  assert.match(readme, /NOT Gauntlet\/#94029/);
  assert.match(readme, /NOT Knock/);
  assert.match(readme, /NOT Frisket/);
  assert.match(readme, /NOT Scant/);
  assert.match(readme, /#92033/);
  assert.match(readme, /#91151/);
  assert.match(readme, /#92524/);
  assert.match(readme, /#83913/);
  assert.match(readme, /do NOT rebuild|do not conflate/i);
  assert.match(readme, /do NOT pick #94336|#94336/i);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/cancellans/);
  assert.match(readme, /node --test projects\/cancellans\/cancellans\.test\.mjs/);
  assert.match(readme, /NON-BINDING/);
  assert.match(readme, /binder|print.?shop|cancelled-leaf|folio.?press|cancellandum/i);
  assert.match(readme, /Score cancellans or admit intact/);
  assert.match(readme, /#93924|#93770|#93777|#94151/);
  assert.doesNotMatch(readme, /backup #94400|#94400 as next/);
  assert.match(readme, /09:50/);
  assert.match(readme, /Do NOT implement a fix/i);
  assert.doesNotMatch(readme, /\barras\b/);
  assert.doesNotMatch(readme, /\bfrangible\b/);
  assert.doesNotMatch(readme, /\bnameplate\b/);
  const runLog = readFileSync(
    fileURLToPath(new URL("../../RUN_LOG.md", import.meta.url)),
    "utf8",
  );
  assert.match(runLog, /## 2026-09-15 — Cancellans/);
  assert.match(runLog, /09:50/);
});

test("catalog features Cancellans only; Arras unfeatured; product count 370", () => {
  const catalog = readCatalog();
  const hub = readHubCatalog();
  assert.equal(catalog.products.length, 370);
  assert.equal(hub.products.length, 370);
  assert.equal(catalog.products[0].name, "Cancellans");
  assert.equal(catalog.products[0].slug, "cancellans");
  assert.equal(catalog.products[0].featured, true);
  assert.equal(catalog.products[0].href, "/cancellans/");
  assert.equal(catalog.products[0].day, "2026-09-15");
  assert.equal(catalog.products[0].summary, CATALOG_SUMMARY);
  assert.equal(hub.products[0].summary, catalog.products[0].summary);
  assert.match(catalog.products[0].summary, /\bintact\b/);
  assert.match(catalog.products[0].summary, /\bcancellans\b/);
  assert.match(catalog.products[0].summary, /deferred-delta/);
  assert.match(catalog.products[0].summary, /Score cancellans or admit intact/);
  assert.match(catalog.products[0].summary, /#94400/);
  assert.equal(hub.products[0].slug, "cancellans");
  assert.equal(hub.products[0].featured, true);
  const arras = catalog.products.find((row) => row.slug === "arras");
  assert.ok(arras);
  assert.equal(arras.featured, false);
  const frangible = catalog.products.find((row) => row.slug === "frangible");
  assert.ok(frangible);
  assert.equal(frangible.featured, false);
  const nameplate = catalog.products.find((row) => row.slug === "nameplate");
  assert.ok(nameplate);
  assert.equal(nameplate.featured, false);
  assert.equal(catalog.products.filter((row) => row.featured).length, 1);
  assert.equal(catalog.products.filter((row) => row.slug === "cancellans").length, 1);
  assert.ok(
    !catalog.products.some(
      (row) => String(row.summary || "").includes("94400") && row.slug !== "cancellans",
    ),
  );
});

test("vercel rewrites cancellans to the project folder at the top", () => {
  const vercel = readVercel();
  assert.equal(vercel.rewrites[0].source, "/cancellans");
  assert.equal(vercel.rewrites[0].destination, "/projects/cancellans");
  assert.equal(vercel.rewrites[1].source, "/cancellans/");
  assert.equal(vercel.rewrites[1].destination, "/projects/cancellans");
  assert.equal(vercel.rewrites[2].source, "/cancellans/:path*");
  assert.equal(vercel.rewrites[2].destination, "/projects/cancellans/:path*");
  assert.equal(vercel.rewrites[3].source, "/arras");
  assert.equal(vercel.rewrites[3].destination, "/projects/arras");
});

test("no network calls in the model or tests", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
  assert.doesNotMatch(source, /https?:\/\/[^\s"']*anthropic\.com\/v1/);
});
