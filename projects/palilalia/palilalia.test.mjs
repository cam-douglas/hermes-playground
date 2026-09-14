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
  SAMPLE_PALILALIA_PROOF,
  SEEDED_WORD,
  PALILALIA_WALK,
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
  inspectEvidence,
  inspectGroove,
  inspectHold,
  inspectRefire,
  inspectValve,
  mapGroove,
  readBooth,
  score,
  scoreGate,
  scoreWalk,
  seedGoalStopRefire,
  seedHold,
  seedSilenced,
  seedNineConsecutive,
  seedProduct,
  seedPalilalia,
  seedStaleGoal,
} from "./palilalia.mjs";

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
  return fileURLToPath(new URL("./palilalia.mjs", import.meta.url));
}

test("idle silenced is a hold; stylus still lifted", () => {
  const result = analyze(seedSilenced());
  assert.equal(result.verdict, "silenced");
  assert.equal(result.idleWord, "silenced");
  assert.equal(IDLE_WORD, "silenced");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.silenced, true);
  assert.equal(result.phrase, "admit silenced");
  assert.equal(result.palilalia, false);
  assert.equal(result.goalStopRefire, false);
  assert.ok(HOLD_ALIASES.includes("silenced"));
  assert.ok(HOLD_ALIASES.includes("acknowledged"));
  assert.ok(HOLD_ALIASES.includes("stood-down"));
  assert.ok(HOLD_ALIASES.includes("met"));
  assert.ok(HOLD_ALIASES.includes("once"));
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(result.idleWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("empty ticket and empty stdin classify silenced", () => {
  assert.equal(classify(emptyTicket()), "silenced");
  assert.equal(classify(""), "silenced");
  assert.equal(classify(null), "silenced");
  assert.equal(decide({}), "silenced");
});

test("#94041 seeded path scores palilalia when the stylus will not lift", () => {
  const result = analyze(seedPalilalia());
  assert.equal(result.verdict, "palilalia");
  assert.equal(result.seededWord, "palilalia");
  assert.equal(SEEDED_WORD, "palilalia");
  assert.equal(PRODUCT_WORD, "palilalia");
  assert.equal(result.hold, false);
  assert.equal(result.alarm, true);
  assert.equal(result.palilalia, true);
  assert.equal(result.phrase, "score palilalia");
  assert.equal(result.goalStopRefire, true);
  assert.equal(result.safetyValve, true);
  for (const word of FORBIDDEN_SEED) {
    assert.notEqual(result.seededWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("inspectors mark stuck groove and safety valve", () => {
  const groove = inspectGroove({ palilalia: true, goalStopRefire: true });
  assert.equal(groove.stamp, "stylus-stuck");
  assert.equal(groove.stuck, true);
  const refire = inspectRefire({ palilalia: true, nineConsecutive: true });
  assert.equal(refire.stamp, "goal-stop-refire");
  assert.equal(refire.repeating, true);
  const valve = inspectValve({ palilalia: true, safetyValve: true });
  assert.equal(valve.stamp, "safety-valve");
  const scored = scoreGate({
    palilalia: true,
    goalStopRefire: true,
    safetyValve: true,
    nineConsecutive: true,
    cue: "palilalia",
  });
  assert.equal(scored.verdict, "palilalia");
  const open = inspectGroove({ silenced: true, palilalia: false });
  assert.equal(open.stamp, "stylus-lifted");
});

test("path word is goal-stop-refire; booth seed holds the path", () => {
  assert.equal(PATH_WORD, "goal-stop-refire");
  const result = analyze(seedGoalStopRefire());
  assert.equal(result.verdict, "goal-stop-refire");
  assert.equal(result.pathWord, "goal-stop-refire");
  assert.equal(result.hold, false);
  assert.equal(
    classify({ seed: "goal-stop-refire", preferSeed: true, palilalia: true }),
    "goal-stop-refire",
  );
  assert.equal(classify(seedStaleGoal()), "stale-goal");
});

test("HOLD includes silenced / hold", () => {
  assert.ok(HOLD.includes("silenced"));
  assert.ok(HOLD.includes("hold"));
  const hold = analyze(seedHold());
  assert.equal(hold.verdict, "hold");
  assert.equal(hold.hold, true);
  assert.equal(classify({ seed: "hold", preferSeed: true }), "hold");
});

test("alarm chips: nine-consecutive, stale-goal, palilalia", () => {
  assert.equal(classify(seedNineConsecutive()), "nine-consecutive");
  assert.equal(classify(seedStaleGoal()), "stale-goal");
  assert.equal(classify(seedProduct()), "palilalia");
});

test("booth fixtures flip silenced vs palilalia vs goal-stop-refire", () => {
  const idle = scoreGate(seedSilenced());
  const seeded = scoreGate(seedPalilalia());
  const silenced = readData("silenced.json");
  const palilalia = readData("palilalia.json");
  const path = readData("goal-stop-refire.json");
  const holdFix = readData("hold.json");
  assert.equal(idle.verdict, "silenced");
  assert.equal(seeded.verdict, "palilalia");
  assert.notEqual(idle.verdict, seeded.verdict);
  assert.equal(score(seedSilenced()), "silenced");
  assert.equal(score(seedPalilalia()), "palilalia");
  assert.equal(silenced.goalStopRefire, false);
  assert.equal(silenced.silenced, true);
  assert.equal(scoreGate(silenced).verdict, "silenced");
  assert.equal(palilalia.goalStopRefire, true);
  assert.equal(palilalia.safetyValve, true);
  assert.equal(palilalia.nineConsecutive, true);
  assert.equal(classify(palilalia), "palilalia");
  assert.equal(path.paths.length, 3);
  assert.match(path.paths[0].rule, /silenced|acknowledged|stood-down|met|once/i);
  assert.match(path.paths[1].result, /9 consecutive|21 consecutive|safety valve|stale/i);
  assert.equal(classify(path), "goal-stop-refire");
  assert.equal(palilalia.hubCount, "PALILALIA");
  assert.equal(palilalia.issue, 94041);
  assert.equal(palilalia.palilalia, true);
  assert.equal(classify(holdFix), "hold");
  assert.equal(classify(readData("acknowledged.json")), "acknowledged");
  assert.equal(classify(readData("stood-down.json")), "stood-down");
  assert.equal(classify(readData("met.json")), "met");
  assert.equal(classify(readData("once.json")), "once");
  assert.equal(classify(readData("hold-compaction.json")), "hold-compaction");
  assert.equal(classify(readData("stale-goal.json")), "stale-goal");
  assert.equal(classify(readData("nine-consecutive.json")), "nine-consecutive");
  assert.equal(classify(readData("twenty-one-consecutive.json")), "twenty-one-consecutive");
  assert.equal(classify(readData("safety-valve.json")), "safety-valve");
  assert.equal(classify(readData("evidence-ignored.json")), "evidence-ignored");
  assert.equal(classify(readData("no-acknowledge.json")), "no-acknowledge");
  assert.equal(classify(readData("landing.json")), "landing");
  assert.equal(classify(readData("cousins.json")), "cousins");
  assert.equal(classify(readData("backups.json")), "backups");
  assert.equal(classify(readData("walk.json")), "walk");
  assert.equal(classify(readData("has-repro.json")), "has-repro");
  assert.equal(classify(readData("fixtures.json")), "fixtures");
});

test("chips include idle, seeded, path, and walk", () => {
  assert.ok(CHIPS.includes("silenced"));
  assert.ok(CHIPS.includes("palilalia"));
  assert.ok(CHIPS.includes("goal-stop-refire"));
  assert.ok(CHIPS.includes("stale-goal"));
  assert.ok(CHIPS.includes("nine-consecutive"));
  assert.ok(CHIPS.includes("acknowledged"));
  assert.ok(CHIPS.includes("once"));
  assert.ok(CHIPS.includes("fixtures"));
  assert.ok(CHIPS.includes("walk"));
  assert.ok(ALARM.includes("palilalia"));
  assert.ok(ALARM.includes("goal-stop-refire"));
  assert.ok(ALARM.includes("stale-goal"));
  assert.ok(ALARM.includes("nine-consecutive"));
  assert.ok(ALARM.includes("safety-valve"));
  assert.ok(VERDICTS.includes("walk"));
  assert.equal(classify({ seed: "fixtures", preferSeed: true }), "fixtures");
  assert.equal(classify({ seed: "walk", preferSeed: true }), "walk");
});

test("published palilalia walk scores palilalia after the idle hold", () => {
  const booth = scoreWalk({ rows: PALILALIA_WALK });
  assert.equal(booth.verdict, "palilalia");
  assert.ok(booth.palilaliaCount >= 1);
  const idle = booth.rows.find((row) => row.event === "cue-silenced");
  assert.equal(idle.silenced, true);
  assert.equal(idle.verdict, "silenced");
  const cut = booth.rows.find((row) => row.event === "goal-stop-refire");
  assert.equal(cut.goalStopRefire, true);
  const path = booth.rows.find((row) => row.event === "goal-stop-refire" && row.t === "path");
  assert.equal(path.verdict, "goal-stop-refire");
});

test("PALILALIA_WALK constant matches the issue groove walk", () => {
  assert.equal(PALILALIA_WALK[0].event, "cue-silenced");
  const cut = PALILALIA_WALK.find((row) => row.event === "goal-stop-refire");
  assert.equal(cut.goalStopRefire || cut.safetyValve, true);
  const path = PALILALIA_WALK.find((row) => row.t === "path");
  assert.equal(path.palilalia, true);
  const scoreRow = PALILALIA_WALK.find((row) => row.event === "palilalia");
  assert.equal(scoreRow.palilalia, true);
});

test("positive control silenced groove stays silenced", () => {
  const walk = scoreWalk({ rows: POSITIVE_CONTROL_WALK });
  assert.equal(walk.verdict, "silenced");
  const ok = walk.rows.find((row) => row.t === "hold");
  assert.equal(ok.verdict, "silenced");
  const hold = walk.rows.find((row) => row.event === "cue-silenced");
  assert.equal(hold.silenced, true);
  assert.equal(hold.verdict, "silenced");
});

test("issue constants encode only #94041 published facts", () => {
  assert.equal(FEATURED_ISSUE, 94041);
  assert.ok(ISSUE_URL.includes("94041"));
  assert.match(TITLE, /\/goal|Stop hook|acknowledge a hold/i);
  assert.equal(STATE, "OPEN");
  assert.equal(PLATFORM, "linux");
  assert.match(HOST, /\/goal|Stop hook|CLI/i);
  assert.match(BUILD, /2\.1\.258|2\.1\.26/);
  assert.equal(SURFACE, "goal-stop-refire");
  assert.deepEqual(
    [...LABELS],
    ["bug", "platform:linux", "area:hooks"],
  );
  assert.equal(FIELD_MARKS.length, 5);
  assert.ok(RULED_OUT.some((row) => /Sepulchre|#94055/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /Sneck|#94052/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /Anarthria|#93782/i.test(row)));
  assert.ok(EXPECTED.some((row) => /acknowledge|transcript|hold|compaction|safety valve/i.test(row)));
  assert.match(
    DISTRIBUTION,
    /9 consecutive|21 consecutive|safety valve|stale|compaction|2\.1\.258|Fedora 44|tmux/i,
  );
  assert.equal(BOOTH_STATIONS.length, 5);
  assert.ok(FINGERPRINT_LINES.includes("goal-stop-refire"));
  assert.ok(FINGERPRINT_LINES.includes("palilalia"));
  assert.equal(PHRASE, "Score palilalia or admit silenced.");
  assert.equal(SAMPLE_PALILALIA_PROOF.goalStopRefire, true);
});

test("has-repro fingerprints encode the published palilalia proof", () => {
  const result = handle(seedPalilalia());
  assert.equal(result.published.platform, "linux");
  assert.equal(result.published.surface, "goal-stop-refire");
  assert.equal(result.published.host, HOST);
  assert.match(
    fingerprint(seedPalilalia()),
    /palilalia\|kind=goal-stop-refire\|ref=nine\|path=goal-stop-refire\|cue=goal-stop-refire/,
  );
  assert.equal(classify({ seed: "has-repro", preferSeed: true }), "has-repro");
});

test("forbidden idle list includes living/cleared/spanned and recent catalog words", () => {
  const required = [
    "living",
    "sepulchre",
    "bash-nul-poison",
    "cleared",
    "sneck",
    "chip-dismiss-ephemeral",
    "spanned",
    "drawbridge",
    "rc-bridge-update-drop",
    "matched",
    "chirograph",
    "worktree-rename-stale",
    "inscribed",
    "titulus",
    "berthed",
    "pegged",
    "tempered",
    "quiescent",
    "diplomatic",
    "demesned",
    "diagrammed",
    "unattainted",
    "reflowed",
    "articulate",
    "limber",
    "filiated",
    "injective",
    "unitary",
    "verbatim",
    "plenary",
    "vested",
    "sealed",
    "latched",
    "nullarbor",
    "sigil",
    "mondegreen",
    "diplopia",
    "fulcrum",
    "followspot",
    "tocsin",
    "carillon",
    "knell",
    "larum",
    "palinode",
  ];
  for (const word of required) {
    assert.ok(FORBIDDEN_IDLE.includes(word), `missing forbidden idle ${word}`);
  }
});

test("silenced booth flips palilalia back when the groove is silenced", () => {
  const tape = {
    silenced: true,
    palilalia: false,
    goalStopRefire: false,
    cue: "silenced",
  };
  assert.equal(scoreGate(tape).verdict, "silenced");
  tape.silenced = false;
  tape.palilalia = true;
  tape.goalStopRefire = true;
  tape.safetyValve = true;
  tape.cue = "palilalia";
  assert.equal(scoreGate(tape).verdict, "palilalia");
  tape.silenced = true;
  tape.palilalia = false;
  tape.goalStopRefire = false;
  tape.safetyValve = false;
  tape.cue = "silenced";
  assert.equal(scoreGate(tape).verdict, "silenced");
});

test("groove, refire, valve, and readBooth mark the palilalia proof", () => {
  const idle = inspectGroove({
    silenced: true,
  });
  assert.equal(idle.stamp, "stylus-lifted");
  const refire = inspectRefire({ palilalia: true, nineConsecutive: true });
  assert.equal(refire.stamp, "goal-stop-refire");
  assert.equal(refire.repeating, true);
  const valve = inspectValve({ palilalia: true, safetyValve: true });
  assert.equal(valve.stamp, "safety-valve");
  const booth = readBooth({
    palilalia: true,
    goalStopRefire: true,
    safetyValve: true,
  });
  assert.equal(booth.palilalia, true);
  assert.equal(booth.mark, "palilalia");
  const open = readBooth({
    silenced: true,
    palilalia: false,
    goalStopRefire: false,
  });
  assert.equal(open.palilalia, false);
  assert.equal(open.mark, "silenced");
  assert.equal(inspectEvidence({ palilalia: true, evidenceIgnored: true }).stamp, "evidence-ignored");
  assert.equal(inspectHold({ palilalia: true, noAcknowledge: true }).stamp, "no-acknowledge");
});

test("mapGroove encodes the published stuck palilalia", () => {
  const miss = mapGroove({ palilalia: true, goalStopRefire: true });
  assert.equal(miss.stamp, "goal-stop-refire");
  assert.equal(miss.holdingLane, "stuck-groove");
  assert.equal(miss.ribbon, "palilalia");
  const clear = mapGroove({ silenced: true, palilalia: false });
  assert.equal(clear.stamp, "silenced-groove");
  assert.equal(clear.kindLane, "lifted-stylus");
  assert.equal(clear.holdingLane, "once");
});

test("cousins cite #82546 #83266 #78121 #91601 #92242 #93744 only; products stay distinct; backups stay data-only", () => {
  assert.equal(COUSINS.length, 6);
  assert.equal(COUSINS[0].issue, 82546);
  assert.equal(COUSINS[1].issue, 83266);
  assert.equal(COUSINS[2].issue, 78121);
  assert.equal(COUSINS[3].issue, 91601);
  assert.equal(COUSINS[4].issue, 92242);
  assert.equal(COUSINS[5].issue, 93744);
  assert.ok(COUSINS.every((row) => row.citeOnly === true));
  assert.ok(NOT_PRODUCTS.includes("sepulchre"));
  assert.ok(NOT_PRODUCTS.includes("sneck"));
  assert.ok(NOT_PRODUCTS.includes("drawbridge"));
  assert.ok(NOT_PRODUCTS.includes("chirograph"));
  assert.ok(NOT_PRODUCTS.includes("titulus"));
  assert.ok(NOT_PRODUCTS.includes("nullarbor"));
  assert.ok(NOT_PRODUCTS.includes("sigil"));
  assert.ok(NOT_PRODUCTS.includes("anarthria"));
  assert.ok(NOT_PRODUCTS.includes("palinode"));
  assert.equal(BACKUPS.length, 10);
  assert.equal(BACKUPS[0].issue, 94040);
  assert.equal(BACKUPS[1].issue, 94032);
  assert.equal(BACKUPS[2].issue, 94031);
  assert.equal(BACKUPS[3].issue, 94029);
  assert.equal(BACKUPS[4].issue, 93987);
  assert.equal(BACKUPS[5].issue, 93924);
  assert.equal(BACKUPS[6].issue, 93770);
  assert.equal(BACKUPS[7].issue, 93777);
  assert.equal(BACKUPS[8].issue, 94059);
  assert.equal(BACKUPS[9].issue, 94053);
  assert.ok(BACKUPS.every((row) => row.citeOnly === true));
  assert.ok(!BACKUPS.some((row) => row.issue === 94041));
  assert.ok(!BACKUPS.some((row) => row.issue === 82546));
  assert.equal(classify({ seed: "cousins", preferSeed: true }), "cousins");
  assert.equal(classify({ seed: "backups", preferSeed: true }), "backups");
});

test("CLI scores fixtures without a server", () => {
  const idle = spawnSync(process.execPath, [modelPath()], { encoding: "utf8" });
  const seeded = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/palilalia.json", import.meta.url))],
    { encoding: "utf8" },
  );
  const silencedFix = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/silenced.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(idle.status, 0, idle.stderr);
  assert.equal(seeded.status, 0, seeded.stderr);
  assert.equal(silencedFix.status, 0, silencedFix.stderr);
  const idleOut = JSON.parse(idle.stdout);
  const seededOut = JSON.parse(seeded.stdout);
  const silencedOut = JSON.parse(silencedFix.stdout);
  assert.equal(idleOut.verdict, "silenced");
  assert.equal(idleOut.hold, true);
  assert.equal(seededOut.verdict, "palilalia");
  assert.equal(seededOut.alarm, true);
  assert.equal(silencedOut.verdict, "silenced");
  assert.equal(silencedOut.hold, true);
  assert.match(silencedOut.phrase, /admit silenced/);
});

test("handle exposes published hypothesis and #94041 headline", () => {
  const result = handle(seedPalilalia());
  assert.equal(result.published.issue, 94041);
  assert.equal(result.published.platform, "linux");
  assert.deepEqual(result.published.cousins, [82546, 83266, 78121, 91601, 92242, 93744]);
  assert.ok(result.published.backups.includes(94040));
  assert.ok(result.published.backups.includes(94053));
  assert.ok(!result.published.backups.includes(94041));
  assert.match(result.published.hypothesis, /evaluator|transcript|hold-acknowledge|NON-BINDING|#94041/i);
  assert.match(result.published.hypothesis, /NON-BINDING/);
  assert.match(result.published.hypothesis, /#94041/);
  assert.equal(result.published.build, BUILD);
});

test("model has no static node: imports so the silenced page can score in-browser", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /^import .* from "node:/m);
  assert.match(source, /import\("node:fs"\)/);
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
});

test("silenced page is a speech-clinic phonograph, not vault or cottage latch or castle or lectern", () => {
  const page = readPage();
  assert.match(page, /family=Libre\+Baskerville|Libre Baskerville/);
  assert.match(page, /family=DM\+Sans|DM Sans/);
  assert.match(page, /JetBrains\+Mono|JetBrains Mono/);
  assert.match(page, /palilalia|silenced|goal-stop-refire|phonograph|wax|cylinder|stylus|groove|clinic/i);
  assert.match(page, /#F4EFE6|#1A1F24|#C9893A|#D45D4A|#2F6F6A|#FFF9F0|#3A322C|#8B4513/i);
  assert.match(page, /\bsilenced\b/);
  assert.match(page, /\bpalilalia\b/);
  assert.match(page, /goal-stop-refire/);
  assert.match(page, /Score palilalia or admit silenced/i);
  assert.match(page, /#350/);
  assert.match(page, /#94041/);
  assert.match(page, /Admit silenced/);
  assert.match(page, /Score palilalia/);
  assert.match(page, /Walk goal-stop-refire/);
  assert.match(page, /Compare silenced \/ palilalia/);
  assert.match(page, /Pin idle silenced/);
  assert.match(page, /Pin seeded palilalia/);
  assert.match(page, /Pin goal-stop-refire/);
  assert.match(page, /Lift the stylus/);
  assert.match(page, /Score booth/);
  assert.match(page, /palilalia-score/);
  assert.match(page, /9 consecutive|21 consecutive|safety valve|A hook blocked the turn from ending 9 consecutive times|compaction|stale/i);
  assert.match(page, /phonograph|wax|cylinder|stylus|groove|clinic|platter/i);
  assert.doesNotMatch(page, /family=Cardo|Cardo/);
  assert.doesNotMatch(page, /family=Figtree|Figtree/);
  assert.doesNotMatch(page, /IBM\+Plex\+Mono|IBM Plex Mono/);
  assert.doesNotMatch(page, /family=Fraunces|Fraunces/);
  assert.doesNotMatch(page, /family=Nunito\+Sans|Nunito Sans/);
  assert.doesNotMatch(page, /Source\+Code\+Pro|Source Code Pro/);
  assert.doesNotMatch(page, /family=Cinzel|Cinzel/);
  assert.doesNotMatch(page, /family=Manrope|Manrope/);
  assert.doesNotMatch(page, /family=Cormorant\+Garamond|Cormorant Garamond/);
  assert.doesNotMatch(page, /family=Forum|Forum/);
  assert.doesNotMatch(page, /family=Outfit|Outfit/);
  assert.doesNotMatch(page, /Space\+Mono|Space Mono/);
  assert.doesNotMatch(page, /#D6C7A8/);
  assert.doesNotMatch(page, /#161310/);
  assert.doesNotMatch(page, /#C67A28/);
  assert.doesNotMatch(page, /#2C241C/);
  assert.doesNotMatch(page, /#3E434A/);
  assert.doesNotMatch(page, /#EDE4D4/);
  assert.doesNotMatch(page, /#8C6B48/);
  assert.doesNotMatch(page, /#E8A44A/);
  assert.doesNotMatch(page, /ossuary|limestone lintel|extinguished-lamp|burial-vault/i);
  assert.doesNotMatch(page, /cottage|stoop|wool draft|oak plank/i);
  assert.doesNotMatch(page, /battlement|merlon|portcullis|bailey|gatehouse|crenel/i);
  assert.doesNotMatch(page, /lectern|indenture|moiety/i);
  assert.doesNotMatch(page, /night-latch/);
  assert.doesNotMatch(page, /laryngoscope|glottis|voice-strip/i);
  assert.doesNotMatch(page, /\bliving\b/);
  assert.doesNotMatch(page, /\bcleared\b/);
  assert.doesNotMatch(page, /\bspanned\b/);
  assert.doesNotMatch(page, /\bmatched\b/);
  assert.doesNotMatch(page, /\binscribed\b/);
  assert.match(page, /NOT Sepulchre/i);
  assert.match(page, /NOT Sneck/i);
  assert.match(page, /NOT Anarthria/i);
  assert.match(page, /NOT Palinode/i);
});

test("README states the thesis, anti-clone, and how to score", () => {
  const readme = readReadme();
  assert.match(readme, /Palilalia/);
  assert.match(readme, /#94041/);
  assert.match(readme, /\bsilenced\b/);
  assert.match(readme, /\bpalilalia\b/);
  assert.match(readme, /goal-stop-refire/);
  assert.match(readme, /Libre Baskerville/);
  assert.match(readme, /DM Sans/);
  assert.match(readme, /JetBrains Mono/);
  assert.doesNotMatch(readme, /Cardo/);
  assert.doesNotMatch(readme, /Figtree/);
  assert.doesNotMatch(readme, /IBM Plex Mono/);
  assert.doesNotMatch(readme, /Fraunces/);
  assert.doesNotMatch(readme, /Nunito Sans/);
  assert.doesNotMatch(readme, /Source Code Pro/);
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /Research brief/i);
  assert.match(readme, /GOAL-STOP-REFIRE|\/goal|Stop hook/i);
  assert.match(readme, /NOT Sepulchre\/#94055/);
  assert.match(readme, /NOT Sneck\/#94052/);
  assert.match(readme, /NOT Anarthria/);
  assert.match(readme, /#82546|#83266|#78121|#91601|#92242|#93744/);
  assert.match(readme, /9 consecutive|21 consecutive|safety valve|compaction/i);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/palilalia/);
  assert.match(readme, /node --test projects\/palilalia\/palilalia\.test\.mjs/);
  assert.match(readme, /NON-BINDING/);
  assert.match(readme, /phonograph|wax|cylinder|stylus|groove|clinic/i);
  assert.match(readme, /Score palilalia or admit silenced/);
  assert.match(readme, /#94040|#94032|#94031|#94029|#93987|#93924|#93770|#93777|#94059|#94053/);
  assert.match(readme, /09:50/);
  assert.match(readme, /Do NOT implement a fix/i);
  const runLog = readFileSync(fileURLToPath(new URL("../../RUN_LOG.md", import.meta.url)), "utf8");
  assert.match(runLog, /## 2026-09-14 — Palilalia/);
  assert.match(runLog, /09:50/);
});

test("catalog features Palilalia only; Sepulchre unfeatured; product count 350", () => {
  const catalog = readCatalog();
  const hub = readHubCatalog();
  assert.equal(catalog.products.length, 350);
  assert.equal(hub.products.length, 350);
  assert.equal(catalog.products[0].name, "Palilalia");
  assert.equal(catalog.products[0].slug, "palilalia");
  assert.equal(catalog.products[0].featured, true);
  assert.equal(catalog.products[0].href, "/palilalia/");
  assert.equal(catalog.products[0].day, "2026-09-14");
  assert.equal(
    catalog.products[0].summary,
    "09:50 palilalia: a speech-pathology / phonograph-groove booth for #94041. Native /goal Stop hook re-fires indefinitely with unchanged/stale text even after verifiable evidence the condition is met or a deliberate hold; only the repeated-block safety valve ends the loop and the pattern resumes later. Idle silenced / seeded palilalia / path goal-stop-refire. Score palilalia or admit silenced.",
  );
  assert.equal(hub.products[0].summary, catalog.products[0].summary);
  assert.match(catalog.products[0].summary, /\bsilenced\b/);
  assert.match(catalog.products[0].summary, /\bpalilalia\b/);
  assert.match(catalog.products[0].summary, /goal-stop-refire/);
  assert.match(catalog.products[0].summary, /Score palilalia or admit silenced/);
  assert.equal(hub.products[0].slug, "palilalia");
  assert.equal(hub.products[0].featured, true);
  const sepulchre = catalog.products.find((row) => row.slug === "sepulchre");
  assert.ok(sepulchre);
  assert.equal(sepulchre.featured, false);
  const sneck = catalog.products.find((row) => row.slug === "sneck");
  assert.ok(sneck);
  assert.equal(sneck.featured, false);
  const drawbridge = catalog.products.find((row) => row.slug === "drawbridge");
  assert.ok(drawbridge);
  assert.equal(drawbridge.featured, false);
  assert.equal(catalog.products.filter((row) => row.featured).length, 1);
  assert.equal(catalog.products.filter((row) => row.slug === "palilalia").length, 1);
  assert.ok(!catalog.products.some((row) => String(row.summary || "").includes("94041") && row.slug !== "palilalia"));
});

test("vercel rewrites palilalia to the project folder at the top", () => {
  const vercel = readVercel();
  assert.equal(vercel.rewrites[0].source, "/palilalia");
  assert.equal(vercel.rewrites[0].destination, "/projects/palilalia");
  assert.equal(vercel.rewrites[1].source, "/palilalia/");
  assert.equal(vercel.rewrites[1].destination, "/projects/palilalia");
  assert.equal(vercel.rewrites[2].source, "/palilalia/:path*");
  assert.equal(vercel.rewrites[2].destination, "/projects/palilalia/:path*");
});

test("no network calls in the model or tests", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
  assert.doesNotMatch(source, /https?:\/\/[^\s"']*anthropic\.com\/v1/);
});
