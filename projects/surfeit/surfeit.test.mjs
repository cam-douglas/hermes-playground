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
  SURFEIT_WALK,
  DISTRIBUTION,
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
  SAMPLE_SURFEIT_PROOF,
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
  inspectCellar,
  inspectHeadline,
  inspectQueue,
  mapBanquet,
  readBooth,
  score,
  scoreGate,
  scoreWalk,
  seedResumeAmplify,
  seedSurfeit,
  seedTempered,
  seedHold,
  seedQuotaSpawnCascade,
  seedProduct,
  seedSessionLimit,
} from "./surfeit.mjs";

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
  return fileURLToPath(new URL("./surfeit.mjs", import.meta.url));
}

test("idle tempered is a hold; cellar solvent, circuit held", () => {
  const result = analyze(seedTempered());
  assert.equal(result.verdict, "tempered");
  assert.equal(result.idleWord, "tempered");
  assert.equal(IDLE_WORD, "tempered");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.tempered, true);
  assert.equal(result.phrase, "admit tempered");
  assert.equal(result.surfeit, false);
  assert.equal(result.quotaSpawnCascade, false);
  assert.ok(HOLD_ALIASES.includes("tempered"));
  assert.ok(HOLD_ALIASES.includes("solvent"));
  assert.ok(HOLD_ALIASES.includes("frugal"));
  assert.ok(HOLD_ALIASES.includes("circuit-held"));
  assert.ok(HOLD_ALIASES.includes("no-spawn"));
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(result.idleWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("empty ticket and empty stdin classify tempered", () => {
  assert.equal(classify(emptyTicket()), "tempered");
  assert.equal(classify(""), "tempered");
  assert.equal(classify(null), "tempered");
  assert.equal(decide({}), "tempered");
});

test("#94012 seeded path scores surfeit when the kitchen keeps plating", () => {
  const result = analyze(seedSurfeit());
  assert.equal(result.verdict, "surfeit");
  assert.equal(result.seededWord, "surfeit");
  assert.equal(SEEDED_WORD, "surfeit");
  assert.equal(PRODUCT_WORD, "surfeit");
  assert.equal(result.hold, false);
  assert.equal(result.alarm, true);
  assert.equal(result.surfeit, true);
  assert.equal(result.phrase, "score surfeit");
  assert.equal(result.quotaSpawnCascade, true);
  assert.equal(result.sessionLimit, true);
  for (const word of FORBIDDEN_SEED) {
    assert.notEqual(result.seededWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("inspectors mark empty cellar and quota-spawn-cascade", () => {
  const cellar = inspectCellar({ surfeit: true, quotaSpawnCascade: true });
  assert.equal(cellar.stamp, "cellar-empty");
  assert.equal(cellar.empty, true);
  const queue = inspectQueue({ surfeit: true, afterFirst133: true });
  assert.equal(queue.stamp, "quota-spawn-cascade");
  assert.equal(queue.extra, 133);
  const headline = inspectHeadline({ surfeit: true, statusCompletedLie: true });
  assert.equal(headline.stamp, "status-completed-lie");
  const scored = scoreGate({
    surfeit: true,
    quotaSpawnCascade: true,
    sessionLimit: true,
    resumeAmplify: true,
    cue: "surfeit",
  });
  assert.equal(scored.verdict, "surfeit");
  const open = inspectCellar({ tempered: true, surfeit: false });
  assert.equal(open.stamp, "cellar-solvent");
});

test("path word is quota-spawn-cascade; booth seed holds the path", () => {
  assert.equal(PATH_WORD, "quota-spawn-cascade");
  const result = analyze(seedQuotaSpawnCascade());
  assert.equal(result.verdict, "quota-spawn-cascade");
  assert.equal(result.pathWord, "quota-spawn-cascade");
  assert.equal(result.hold, false);
  assert.equal(
    classify({ seed: "quota-spawn-cascade", preferSeed: true, surfeit: true }),
    "quota-spawn-cascade",
  );
  assert.equal(classify(seedSessionLimit()), "session-limit");
});

test("HOLD includes tempered / hold", () => {
  assert.ok(HOLD.includes("tempered"));
  assert.ok(HOLD.includes("hold"));
  const hold = analyze(seedHold());
  assert.equal(hold.verdict, "hold");
  assert.equal(hold.hold, true);
  assert.equal(classify({ seed: "hold", preferSeed: true }), "hold");
});

test("alarm chips: session-limit, resume-amplify, surfeit", () => {
  assert.equal(classify(seedSessionLimit()), "session-limit");
  assert.equal(classify(seedResumeAmplify()), "resume-amplify");
  assert.equal(classify(seedProduct()), "surfeit");
});

test("booth fixtures flip tempered vs surfeit vs quota-spawn-cascade", () => {
  const idle = scoreGate(seedTempered());
  const seeded = scoreGate(seedSurfeit());
  const tempered = readData("tempered.json");
  const surfeit = readData("surfeit.json");
  const path = readData("quota-spawn-cascade.json");
  const holdFix = readData("hold.json");
  assert.equal(idle.verdict, "tempered");
  assert.equal(seeded.verdict, "surfeit");
  assert.notEqual(idle.verdict, seeded.verdict);
  assert.equal(score(seedTempered()), "tempered");
  assert.equal(score(seedSurfeit()), "surfeit");
  assert.equal(tempered.quotaSpawnCascade, false);
  assert.equal(tempered.tempered, true);
  assert.equal(scoreGate(tempered).verdict, "tempered");
  assert.equal(surfeit.quotaSpawnCascade, true);
  assert.equal(surfeit.sessionLimit, true);
  assert.equal(surfeit.resumeAmplify, true);
  assert.equal(classify(surfeit), "surfeit");
  assert.equal(path.paths.length, 3);
  assert.match(path.paths[0].rule, /tempered|solvent|frugal|circuit-held|no-spawn/i);
  assert.match(path.paths[1].result, /108|34|133|session limit|status: completed/i);
  assert.equal(classify(path), "quota-spawn-cascade");
  assert.equal(surfeit.hubCount, "SURFEIT");
  assert.equal(surfeit.issue, 94012);
  assert.equal(surfeit.surfeit, true);
  assert.equal(classify(holdFix), "hold");
  assert.equal(classify(readData("solvent.json")), "solvent");
  assert.equal(classify(readData("frugal.json")), "frugal");
  assert.equal(classify(readData("circuit-held.json")), "circuit-held");
  assert.equal(classify(readData("no-spawn.json")), "no-spawn");
  assert.equal(classify(readData("session-limit.json")), "session-limit");
  assert.equal(classify(readData("resume-amplify.json")), "resume-amplify");
  assert.equal(classify(readData("status-completed-lie.json")), "status-completed-lie");
  assert.equal(classify(readData("agents-108.json")), "agents-108");
  assert.equal(classify(readData("killed-34.json")), "killed-34");
  assert.equal(classify(readData("killed-42.json")), "killed-42");
  assert.equal(classify(readData("after-first-133.json")), "after-first-133");
  assert.equal(classify(readData("tokens-16m.json")), "tokens-16m");
  assert.equal(classify(readData("journal-424.json")), "journal-424");
  assert.equal(classify(readData("landing.json")), "landing");
  assert.equal(classify(readData("cousins.json")), "cousins");
  assert.equal(classify(readData("backups.json")), "backups");
  assert.equal(classify(readData("walk.json")), "walk");
  assert.equal(classify(readData("has-repro.json")), "has-repro");
  assert.equal(classify(readData("fixtures.json")), "fixtures");
});

test("chips include idle, seeded, path, and walk", () => {
  assert.ok(CHIPS.includes("tempered"));
  assert.ok(CHIPS.includes("surfeit"));
  assert.ok(CHIPS.includes("quota-spawn-cascade"));
  assert.ok(CHIPS.includes("session-limit"));
  assert.ok(CHIPS.includes("resume-amplify"));
  assert.ok(CHIPS.includes("solvent"));
  assert.ok(CHIPS.includes("frugal"));
  assert.ok(CHIPS.includes("fixtures"));
  assert.ok(CHIPS.includes("walk"));
  assert.ok(ALARM.includes("surfeit"));
  assert.ok(ALARM.includes("quota-spawn-cascade"));
  assert.ok(ALARM.includes("session-limit"));
  assert.ok(ALARM.includes("resume-amplify"));
  assert.ok(ALARM.includes("status-completed-lie"));
  assert.ok(ALARM.includes("agents-108"));
  assert.ok(ALARM.includes("killed-34"));
  assert.ok(ALARM.includes("after-first-133"));
  assert.ok(VERDICTS.includes("walk"));
  assert.equal(classify({ seed: "fixtures", preferSeed: true }), "fixtures");
  assert.equal(classify({ seed: "walk", preferSeed: true }), "walk");
});

test("published surfeit walk scores surfeit after the idle hold", () => {
  const booth = scoreWalk({ rows: SURFEIT_WALK });
  assert.equal(booth.verdict, "surfeit");
  assert.ok(booth.surfeitCount >= 1);
  const idle = booth.rows.find((row) => row.event === "cue-tempered");
  assert.equal(idle.tempered, true);
  assert.equal(idle.verdict, "tempered");
  const cut = booth.rows.find((row) => row.event === "quota-spawn-cascade");
  assert.equal(cut.quotaSpawnCascade, true);
  const path = booth.rows.find((row) => row.event === "quota-spawn-cascade" && row.t === "path");
  assert.equal(path.verdict, "quota-spawn-cascade");
});

test("SURFEIT_WALK constant matches the issue cellar walk", () => {
  assert.equal(SURFEIT_WALK[0].event, "cue-tempered");
  const cut = SURFEIT_WALK.find((row) => row.event === "quota-spawn-cascade");
  assert.equal(cut.quotaSpawnCascade || cut.afterFirst133, true);
  const path = SURFEIT_WALK.find((row) => row.t === "path");
  assert.equal(path.surfeit, true);
  const scoreRow = SURFEIT_WALK.find((row) => row.event === "surfeit");
  assert.equal(scoreRow.surfeit, true);
});

test("positive control tempered cellar stays tempered", () => {
  const walk = scoreWalk({ rows: POSITIVE_CONTROL_WALK });
  assert.equal(walk.verdict, "tempered");
  const ok = walk.rows.find((row) => row.t === "hold");
  assert.equal(ok.verdict, "tempered");
  const hold = walk.rows.find((row) => row.event === "cue-tempered");
  assert.equal(hold.tempered, true);
  assert.equal(hold.verdict, "tempered");
});

test("issue constants encode only #94012 published facts", () => {
  assert.equal(FEATURED_ISSUE, 94012);
  assert.ok(ISSUE_URL.includes("94012"));
  assert.match(TITLE, /session limit|resumeFromRunId|status: completed/i);
  assert.equal(STATE, "OPEN");
  assert.equal(PLATFORM, "macos");
  assert.match(HOST, /Claude Code workflow/);
  assert.equal(BUILD, "unspecified");
  assert.equal(SURFACE, "quota-spawn-cascade");
  assert.deepEqual([...LABELS], ["bug", "has-repro", "platform:macos", "area:cost", "area:agents"]);
  assert.equal(FIELD_MARKS.length, 5);
  assert.ok(RULED_OUT.some((row) => /Phosphene|#94003/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /Parablepsis|#93954/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /Foundling|#93889/i.test(row)));
  assert.ok(EXPECTED.some((row) => /circuit breaker|resumeFromRunId|status: completed|133/i.test(row)));
  assert.match(DISTRIBUTION, /108|8,527,469|34|42|133|16\.6M|424|status completed/i);
  assert.equal(BOOTH_STATIONS.length, 5);
  assert.ok(FINGERPRINT_LINES.includes("quota-spawn-cascade"));
  assert.ok(FINGERPRINT_LINES.includes("surfeit"));
  assert.equal(PHRASE, "Score surfeit or admit tempered.");
  assert.equal(SAMPLE_SURFEIT_PROOF.quotaSpawnCascade, true);
});

test("has-repro fingerprints encode the published surfeit proof", () => {
  const result = handle(seedSurfeit());
  assert.equal(result.published.platform, "macos");
  assert.equal(result.published.surface, "quota-spawn-cascade");
  assert.equal(result.published.host, HOST);
  assert.match(
    fingerprint(seedSurfeit()),
    /surfeit\|kind=quota-spawn-cascade\|killed=34\|path=quota-spawn-cascade\|cue=quota-spawn-cascade/,
  );
  assert.equal(classify({ seed: "has-repro", preferSeed: true }), "has-repro");
});

test("forbidden idle list includes quiescent/diplomatic/demesned and recent catalog words", () => {
  const required = [
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
  ];
  for (const word of required) {
    assert.ok(FORBIDDEN_IDLE.includes(word), `missing forbidden idle ${word}`);
  }
});

test("tempered booth flips surfeit back when the cellar is solvent", () => {
  const tape = {
    tempered: true,
    surfeit: false,
    quotaSpawnCascade: false,
    cue: "tempered",
  };
  assert.equal(scoreGate(tape).verdict, "tempered");
  tape.tempered = false;
  tape.surfeit = true;
  tape.quotaSpawnCascade = true;
  tape.sessionLimit = true;
  tape.cue = "surfeit";
  assert.equal(scoreGate(tape).verdict, "surfeit");
  tape.tempered = true;
  tape.surfeit = false;
  tape.quotaSpawnCascade = false;
  tape.sessionLimit = false;
  tape.cue = "tempered";
  assert.equal(scoreGate(tape).verdict, "tempered");
});

test("cellar, queue, headline, and readBooth mark the surfeit proof", () => {
  const idle = inspectCellar({
    tempered: true,
  });
  assert.equal(idle.stamp, "cellar-solvent");
  const queue = inspectQueue({ surfeit: true, afterFirst133: true });
  assert.equal(queue.stamp, "quota-spawn-cascade");
  assert.equal(queue.extra, 133);
  const headline = inspectHeadline({ surfeit: true, statusCompletedLie: true });
  assert.equal(headline.stamp, "status-completed-lie");
  const booth = readBooth({
    surfeit: true,
    quotaSpawnCascade: true,
    sessionLimit: true,
  });
  assert.equal(booth.surfeit, true);
  assert.equal(booth.mark, "surfeit");
  const open = readBooth({
    tempered: true,
    surfeit: false,
    quotaSpawnCascade: false,
  });
  assert.equal(open.surfeit, false);
  assert.equal(open.mark, "tempered");
});

test("mapBanquet encodes the published surplus cellar", () => {
  const miss = mapBanquet({ surfeit: true, quotaSpawnCascade: true });
  assert.equal(miss.stamp, "quota-spawn-cascade");
  assert.equal(miss.holdingLane, "surplus");
  assert.equal(miss.ribbon, "surfeit");
  const clear = mapBanquet({ tempered: true, surfeit: false });
  assert.equal(clear.stamp, "tempered-cellar");
  assert.equal(clear.kindLane, "frugal");
  assert.equal(clear.holdingLane, "solvent");
});

test("cousins cite #91449 #92631 #91942 only; products stay distinct; backups stay data-only", () => {
  assert.equal(COUSINS.length, 3);
  assert.equal(COUSINS[0].issue, 91449);
  assert.equal(COUSINS[1].issue, 92631);
  assert.equal(COUSINS[2].issue, 91942);
  assert.ok(COUSINS.every((row) => row.citeOnly === true));
  assert.ok(NOT_PRODUCTS.includes("phosphene"));
  assert.ok(NOT_PRODUCTS.includes("parablepsis"));
  assert.ok(NOT_PRODUCTS.includes("demesne"));
  assert.ok(NOT_PRODUCTS.includes("cartouche"));
  assert.ok(NOT_PRODUCTS.includes("attaint"));
  assert.ok(NOT_PRODUCTS.includes("oriel"));
  assert.ok(NOT_PRODUCTS.includes("anarthria"));
  assert.ok(NOT_PRODUCTS.includes("trismus"));
  assert.ok(NOT_PRODUCTS.includes("foundling"));
  assert.ok(NOT_PRODUCTS.includes("crasis"));
  assert.ok(NOT_PRODUCTS.includes("tessera"));
  assert.ok(NOT_PRODUCTS.includes("mojibake"));
  assert.ok(NOT_PRODUCTS.includes("afterimage"));
  assert.ok(NOT_PRODUCTS.includes("scotoma"));
  assert.ok(NOT_PRODUCTS.includes("thrash"));
  assert.ok(NOT_PRODUCTS.includes("gleaner"));
  assert.equal(BACKUPS.length, 8);
  assert.equal(BACKUPS[0].issue, 93770);
  assert.equal(BACKUPS[7].issue, 93996);
  assert.ok(BACKUPS.every((row) => row.citeOnly === true));
  assert.ok(!BACKUPS.some((row) => row.issue === 94012));
  assert.ok(!BACKUPS.some((row) => row.issue === 91449));
  assert.equal(classify({ seed: "cousins", preferSeed: true }), "cousins");
  assert.equal(classify({ seed: "backups", preferSeed: true }), "backups");
});

test("CLI scores fixtures without a server", () => {
  const idle = spawnSync(process.execPath, [modelPath()], { encoding: "utf8" });
  const seeded = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/surfeit.json", import.meta.url))],
    { encoding: "utf8" },
  );
  const temperedFix = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/tempered.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(idle.status, 0, idle.stderr);
  assert.equal(seeded.status, 0, seeded.stderr);
  assert.equal(temperedFix.status, 0, temperedFix.stderr);
  const idleOut = JSON.parse(idle.stdout);
  const seededOut = JSON.parse(seeded.stdout);
  const temperedOut = JSON.parse(temperedFix.stdout);
  assert.equal(idleOut.verdict, "tempered");
  assert.equal(idleOut.hold, true);
  assert.equal(seededOut.verdict, "surfeit");
  assert.equal(seededOut.alarm, true);
  assert.equal(temperedOut.verdict, "tempered");
  assert.equal(temperedOut.hold, true);
  assert.match(temperedOut.phrase, /admit tempered/);
});

test("handle exposes published hypothesis and #94012 headline", () => {
  const result = handle(seedSurfeit());
  assert.equal(result.published.issue, 94012);
  assert.equal(result.published.platform, "macos");
  assert.deepEqual(result.published.cousins, [91449, 92631, 91942]);
  assert.ok(result.published.backups.includes(93770));
  assert.ok(result.published.backups.includes(93996));
  assert.ok(!result.published.backups.includes(94012));
  assert.match(result.published.hypothesis, /circuit breaker|session-limit|NON-BINDING|#94012/i);
  assert.match(result.published.hypothesis, /NON-BINDING/);
  assert.match(result.published.hypothesis, /#94012/);
  assert.equal(result.published.build, BUILD);
});

test("model has no static node: imports so the living page can score in-browser", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /^import .* from "node:/m);
  assert.match(source, /import\("node:fs"\)/);
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
});

test("living page is a banquet cellar booth, not clinic or collation desk or manor", () => {
  const page = readPage();
  assert.match(page, /family=Fraunces|Fraunces/);
  assert.match(page, /family=Manrope|Manrope/);
  assert.match(page, /family=DM\+Mono|DM Mono/);
  assert.match(page, /surfeit|tempered|quota-spawn-cascade|banquet|cellar|excess/i);
  assert.match(page, /#3B0F1A|#E6B84D|#F3EDE2|#1A1410|#8B1E3F|#6E6A62/i);
  assert.match(page, /\btempered\b/);
  assert.match(page, /\bsurfeit\b/);
  assert.match(page, /quota-spawn-cascade/);
  assert.match(page, /Score surfeit or admit tempered/i);
  assert.match(page, /#342/);
  assert.match(page, /#94012/);
  assert.match(page, /Admit tempered/);
  assert.match(page, /Score surfeit/);
  assert.match(page, /Walk quota-spawn-cascade/);
  assert.match(page, /Compare tempered \/ surfeit/);
  assert.match(page, /Pin idle tempered/);
  assert.match(page, /Pin seeded surfeit/);
  assert.match(page, /Pin quota-spawn-cascade/);
  assert.match(page, /Tally the cellar/);
  assert.match(page, /Score booth/);
  assert.match(page, /surfeit-score/);
  assert.match(page, /108|34|42|133|16\.6M|8,527,469|status: completed|resumeFromRunId/i);
  assert.match(page, /banquet|cellar|cask|linen|course|surplus/i);
  assert.doesNotMatch(page, /Syne|family=Syne/);
  assert.doesNotMatch(page, /Sora|family=Sora/);
  assert.doesNotMatch(page, /JetBrains Mono|JetBrains\+Mono/);
  assert.doesNotMatch(page, /IBM Plex Mono|IBM\+Plex\+Mono/);
  assert.doesNotMatch(page, /family=Cormorant\+Garamond|Cormorant Garamond/);
  assert.doesNotMatch(page, /Source Serif 4|Source\+Serif\+4/);
  assert.doesNotMatch(page, /family=UnifrakturMaguntia|UnifrakturMaguntia/);
  assert.doesNotMatch(page, /Epilogue/);
  assert.doesNotMatch(page, /Inconsolata/);
  assert.doesNotMatch(page, /family=Cinzel/);
  assert.doesNotMatch(page, /Outfit/);
  assert.doesNotMatch(page, /Figtree/);
  assert.doesNotMatch(page, /Libre Baskerville|Libre\+Baskerville/);
  assert.doesNotMatch(page, /Instrument Serif|Instrument\+Serif/);
  assert.doesNotMatch(page, /Plus Jakarta|Plus\+Jakarta/);
  assert.doesNotMatch(page, /#12151C/);
  assert.doesNotMatch(page, /#8B7CFF/);
  assert.doesNotMatch(page, /#E8FF6A/);
  assert.doesNotMatch(page, /#1F6F6A/);
  assert.doesNotMatch(page, /#E2E6EC/);
  assert.doesNotMatch(page, /#1F2B4D/);
  assert.doesNotMatch(page, /#7C2434/);
  assert.doesNotMatch(page, /#B8944A/);
  assert.doesNotMatch(page, /#E4D5B5/);
  assert.doesNotMatch(page, /#1A4A36/);
  assert.doesNotMatch(page, /#4A3018/);
  assert.doesNotMatch(page, /manor charter|oak post|heraldic green|demesned/i);
  assert.doesNotMatch(page, /false door|hieroglyph|name-oval|lapis|limestone/i);
  assert.doesNotMatch(page, /court roll|wax seal|corruption of blood|attainder/i);
  assert.doesNotMatch(page, /collation-desk|apparatus criticus|oxblood lemma/i);
  assert.doesNotMatch(page, /entoptic|vitreous|isopter|sclera/i);
  assert.doesNotMatch(page, /\bdiplomatic\b/);
  assert.doesNotMatch(page, /\bdemesned\b/);
  assert.doesNotMatch(page, /\bdemesne\b/);
  assert.doesNotMatch(page, /\bquiescent\b/);
  assert.doesNotMatch(page, /\bphosphene\b/);
  assert.doesNotMatch(page, /home-bind-overreach/);
  assert.doesNotMatch(page, /latin1-edit-wipe/);
  assert.doesNotMatch(page, /layer-tree-walk/);
  assert.doesNotMatch(page, /\bparablepsis\b/);
  assert.match(page, /NOT Phosphene/i);
  assert.match(page, /NOT Parablepsis/i);
  assert.match(page, /NOT Demesne/i);
  assert.match(page, /NOT Cartouche/i);
  assert.match(page, /NOT Attaint/i);
  assert.match(page, /NOT Oriel/i);
  assert.match(page, /NOT Anarthria/i);
  assert.match(page, /NOT Trismus/i);
  assert.match(page, /NOT Foundling/i);
  assert.match(page, /NOT Crasis/i);
  assert.match(page, /NOT Tessera/i);
  assert.match(page, /NOT Mojibake/i);
  assert.match(page, /NOT Afterimage/i);
  assert.match(page, /NOT Scotoma/i);
  assert.match(page, /NOT Thrash/i);
  assert.match(page, /NOT Gleaner/i);
});

test("README states the thesis, anti-clone, and how to score", () => {
  const readme = readReadme();
  assert.match(readme, /Surfeit/);
  assert.match(readme, /#94012/);
  assert.match(readme, /\btempered\b/);
  assert.match(readme, /\bsurfeit\b/);
  assert.match(readme, /quota-spawn-cascade/);
  assert.match(readme, /Fraunces/);
  assert.match(readme, /Manrope/);
  assert.match(readme, /DM Mono/);
  assert.doesNotMatch(readme, /Syne/);
  assert.doesNotMatch(readme, /Sora/);
  assert.doesNotMatch(readme, /JetBrains Mono/);
  assert.doesNotMatch(readme, /IBM Plex Mono/);
  assert.doesNotMatch(readme, /Cormorant Garamond/);
  assert.doesNotMatch(readme, /UnifrakturMaguntia/);
  assert.doesNotMatch(readme, /Figtree/);
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /Research brief/i);
  assert.match(readme, /QUOTA-SPAWN CASCADE/i);
  assert.match(readme, /NOT Phosphene\/#94003/);
  assert.match(readme, /NOT Parablepsis\/#93954/);
  assert.match(readme, /NOT Demesne\/#93989/);
  assert.match(readme, /NOT Cartouche\/#93772/);
  assert.match(readme, /NOT Attaint\/#93821/);
  assert.match(readme, /NOT Oriel\/#93809/);
  assert.match(readme, /NOT Anarthria\/#93782/);
  assert.match(readme, /NOT Trismus\/#93823/);
  assert.match(readme, /NOT Foundling\/#93889/);
  assert.match(readme, /NOT Crasis/i);
  assert.match(readme, /NOT Tessera/i);
  assert.match(readme, /NOT Mojibake/i);
  assert.match(readme, /NOT Afterimage/i);
  assert.match(readme, /NOT Scotoma/i);
  assert.match(readme, /#91449|#92631|#91942/);
  assert.match(readme, /108|34|42|133|16\.6M|resumeFromRunId|status: completed/i);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/surfeit/);
  assert.match(readme, /node --test projects\/surfeit\/surfeit\.test\.mjs/);
  assert.match(readme, /NON-BINDING/);
  assert.match(readme, /banquet|cellar|excess/i);
  assert.match(readme, /Score surfeit or admit tempered/);
  assert.match(readme, /#93770|#93777|#93924|#93925|#93967|#93957|#93987|#93996/);
  assert.match(readme, /01:50/);
  assert.match(readme, /Do NOT implement a fix/i);
  const runLog = readFileSync(fileURLToPath(new URL("../../RUN_LOG.md", import.meta.url)), "utf8");
  assert.match(runLog, /## 2026-09-13 — Surfeit/);
  assert.match(runLog, /01:50/);
});

test("catalog features Surfeit only; Phosphene unfeatured; product count 342", () => {
  const catalog = readCatalog();
  const hub = readHubCatalog();
  assert.equal(catalog.products.length, 342);
  assert.equal(hub.products.length, 342);
  assert.equal(catalog.products[0].name, "Surfeit");
  assert.equal(catalog.products[0].slug, "surfeit");
  assert.equal(catalog.products[0].featured, true);
  assert.equal(catalog.products[0].href, "/surfeit/");
  assert.equal(catalog.products[0].day, "2026-09-13");
  assert.equal(
    catalog.products[0].summary,
    "01:50 surfeit: a banquet / cellar / excess booth for #94012. Workflow keeps spawning after terminal session-limit; resumeFromRunId doubles the bleed; both runs report status: completed. Idle tempered / seeded surfeit / path quota-spawn-cascade. Score surfeit or admit tempered.",
  );
  assert.equal(hub.products[0].summary, catalog.products[0].summary);
  assert.match(catalog.products[0].summary, /\btempered\b/);
  assert.match(catalog.products[0].summary, /\bsurfeit\b/);
  assert.match(catalog.products[0].summary, /quota-spawn-cascade/);
  assert.match(catalog.products[0].summary, /Score surfeit or admit tempered/);
  assert.equal(hub.products[0].slug, "surfeit");
  assert.equal(hub.products[0].featured, true);
  const phosphene = catalog.products.find((row) => row.slug === "phosphene");
  assert.ok(phosphene);
  assert.equal(phosphene.featured, false);
  const parablepsis = catalog.products.find((row) => row.slug === "parablepsis");
  assert.ok(parablepsis);
  assert.equal(parablepsis.featured, false);
  const demesne = catalog.products.find((row) => row.slug === "demesne");
  assert.ok(demesne);
  assert.equal(demesne.featured, false);
  assert.equal(catalog.products.filter((row) => row.featured).length, 1);
  assert.equal(catalog.products.filter((row) => row.slug === "surfeit").length, 1);
  assert.ok(!catalog.products.some((row) => String(row.summary || "").includes("94012") && row.slug !== "surfeit"));
});

test("vercel rewrites surfeit to the project folder at the top", () => {
  const vercel = readVercel();
  assert.equal(vercel.rewrites[0].source, "/surfeit");
  assert.equal(vercel.rewrites[0].destination, "/projects/surfeit");
  assert.equal(vercel.rewrites[1].source, "/surfeit/");
  assert.equal(vercel.rewrites[1].destination, "/projects/surfeit");
  assert.equal(vercel.rewrites[2].source, "/surfeit/:path*");
  assert.equal(vercel.rewrites[2].destination, "/projects/surfeit/:path*");
});

test("no network calls in the model or tests", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
  assert.doesNotMatch(source, /https?:\/\/[^\s"']*anthropic\.com\/v1/);
});
