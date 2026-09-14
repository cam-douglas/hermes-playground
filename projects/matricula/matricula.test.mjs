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
  CENSUS_PASSES,
  CHIPS,
  COUSINS,
  DESK_NAMES,
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
  MATRICULA_WALK,
  NOT_PRODUCTS,
  PATH_WORD,
  PHRASE,
  PLATFORM,
  POSITIVE_CONTROL_WALK,
  PRODUCT_WORD,
  PROBE_NAME,
  RULED_OUT,
  SAMPLE_MATRICULA_PROOF,
  SEEDED_WORD,
  STATE,
  STUCK_COUNT,
  SURFACE,
  TITLE,
  VERDICTS,
  analyze,
  classify,
  decide,
  diskHasProbe,
  emptyTicket,
  fingerprint,
  freshProcessSees,
  handle,
  inspectCensus,
  inspectJunction,
  inspectPath,
  inspectProbe,
  inspectRoll,
  inspectStamp,
  mapDesk,
  readBooth,
  reloadReport,
  score,
  scoreCensus,
  scoreGate,
  scoreWalk,
  seedEnrolled,
  seedFreshProcessSees,
  seedHold,
  seedMatricula,
  seedNoChanges,
  seedProduct,
  seedReloadBlind,
} from "./matricula.mjs";

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
  return fileURLToPath(new URL("./matricula.mjs", import.meta.url));
}

test("idle enrolled is a hold; live roll would pick up a mid-session arrival", () => {
  const result = analyze(seedEnrolled());
  assert.equal(result.verdict, "enrolled");
  assert.equal(result.idleWord, "enrolled");
  assert.equal(IDLE_WORD, "enrolled");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.enrolled, true);
  assert.equal(result.phrase, "admit enrolled");
  assert.equal(result.matricula, false);
  assert.equal(result.reloadBlind, false);
  assert.ok(HOLD_ALIASES.includes("admitted"));
  assert.ok(HOLD_ALIASES.includes("rostered"));
  assert.ok(HOLD_ALIASES.includes("listed"));
  assert.ok(HOLD_ALIASES.includes("scanned"));
  assert.ok(HOLD_ALIASES.includes("freshened"));
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(result.idleWord, word);
    assert.notEqual(result.verdict, word);
  }
  assert.notEqual(IDLE_WORD, "equated");
  assert.notEqual(IDLE_WORD, "penned");
  assert.notEqual(IDLE_WORD, "ungloved");
  assert.notEqual(IDLE_WORD, "attested");
});

test("empty ticket and empty stdin classify enrolled", () => {
  assert.equal(classify(emptyTicket()), "enrolled");
  assert.equal(classify(""), "enrolled");
  assert.equal(classify(null), "enrolled");
  assert.equal(decide({}), "enrolled");
});

test("#93987 seeded path scores matricula when /reload-skills stamps no changes", () => {
  const result = analyze(seedMatricula());
  assert.equal(result.verdict, "matricula");
  assert.equal(result.seededWord, "matricula");
  assert.equal(SEEDED_WORD, "matricula");
  assert.equal(PRODUCT_WORD, "matricula");
  assert.equal(result.hold, false);
  assert.equal(result.alarm, true);
  assert.equal(result.matricula, true);
  assert.equal(result.phrase, "score matricula");
  assert.equal(result.reloadBlind, true);
  assert.equal(result.noChanges, true);
  for (const word of FORBIDDEN_SEED) {
    assert.notEqual(result.seededWord, word);
    assert.notEqual(result.verdict, word);
  }
  assert.notEqual(SEEDED_WORD, "allograph");
  assert.notEqual(SEEDED_WORD, "agraphia");
  assert.notEqual(SEEDED_WORD, "cadastre");
});

test("census helpers prove disk has reload-probe while the live stamp says no changes", () => {
  assert.equal(PROBE_NAME, "reload-probe");
  assert.equal(STUCK_COUNT, 72);
  assert.equal(diskHasProbe(["reload-probe"]), true);
  assert.equal(freshProcessSees(["reload-probe"]), true);
  const honest = reloadReport({ beforeCount: 72, afterCount: 73 });
  assert.equal(honest.noChanges, false);
  assert.match(honest.text, /1 added/);
  const stuck = reloadReport({ beforeCount: 72, afterCount: 72 });
  assert.equal(stuck.noChanges, true);
  assert.match(stuck.text, /no changes/);
  const grown = scoreCensus({
    diskHasProbe: true,
    sessionListsProbe: false,
    noChanges: true,
    count: 72,
    report: "Reloaded skills: 72 skills available (no changes)",
  });
  assert.equal(grown.onDisk, true);
  assert.equal(grown.listed, false);
  assert.equal(grown.reloadBlind, true);
  const fresh = scoreCensus({
    diskHasProbe: true,
    sessionListsProbe: true,
    freshProcess: true,
    report: "reload-probe   userSettings   -   -   0x  never",
  });
  assert.equal(fresh.freshSees, true);
  assert.equal(fresh.listed, true);
});

test("inspectors mark no-changes stamp and fresh census", () => {
  const stamp = inspectStamp({ matricula: true, noChanges: true });
  assert.equal(stamp.stamp, "no-changes-stamp");
  assert.equal(stamp.stamped, true);
  const census = inspectCensus({ matricula: true, freshProcessSees: true });
  assert.equal(census.stamp, "fresh-census");
  assert.equal(census.sees, true);
  const scored = scoreGate({
    matricula: true,
    reloadBlind: true,
    noChanges: true,
    cue: "matricula",
  });
  assert.equal(scored.verdict, "matricula");
  const open = inspectStamp({ enrolled: true, matricula: false });
  assert.equal(open.stamp, "stamp-freshened");
});

test("path word is reload-blind; booth seed holds the path", () => {
  assert.equal(PATH_WORD, "reload-blind");
  const result = analyze(seedReloadBlind());
  assert.equal(result.verdict, "reload-blind");
  assert.equal(result.pathWord, "reload-blind");
  assert.equal(result.hold, false);
  assert.equal(
    classify({
      seed: "reload-blind",
      preferSeed: true,
      matricula: true,
    }),
    "reload-blind",
  );
  assert.equal(classify(seedNoChanges()), "no-changes");
  assert.equal(score(seedReloadBlind()), "matricula");
});

test("HOLD includes enrolled / hold", () => {
  assert.ok(HOLD.includes("enrolled"));
  assert.ok(HOLD.includes("hold"));
  const hold = analyze(seedHold());
  assert.equal(hold.verdict, "hold");
  assert.equal(hold.hold, true);
  assert.equal(classify({ seed: "hold", preferSeed: true }), "hold");
});

test("alarm chips: no-changes, reload-blind, matricula, mid-session-add", () => {
  assert.equal(classify(seedNoChanges()), "no-changes");
  assert.equal(classify(seedReloadBlind()), "reload-blind");
  assert.equal(classify(seedProduct()), "matricula");
  assert.equal(classify({ seed: "mid-session-add", preferSeed: true }), "mid-session-add");
});

test("booth fixtures flip enrolled vs matricula vs reload-blind", () => {
  const idle = scoreGate(seedEnrolled());
  const seeded = scoreGate(seedMatricula());
  const enrolled = readData("enrolled.json");
  const matricula = readData("matricula.json");
  const issued = readData("93987.json");
  const path = readData("reload-blind.json");
  const holdFix = readData("hold.json");
  assert.equal(idle.verdict, "enrolled");
  assert.equal(seeded.verdict, "matricula");
  assert.notEqual(idle.verdict, seeded.verdict);
  assert.equal(score(seedEnrolled()), "enrolled");
  assert.equal(score(seedMatricula()), "matricula");
  assert.equal(score({ seed: "reload-blind", preferSeed: true }), "matricula");
  assert.equal(enrolled.reloadBlind, false);
  assert.equal(enrolled.enrolled, true);
  assert.equal(scoreGate(enrolled).verdict, "enrolled");
  assert.equal(matricula.reloadBlind, true);
  assert.equal(matricula.noChanges, true);
  assert.equal(classify(matricula), "matricula");
  assert.equal(issued.issue, 93987);
  assert.equal(classify(issued), "matricula");
  assert.equal(path.paths.length, 3);
  assert.match(path.paths[0].rule, /enrolled|admitted|rostered|listed|scanned|freshened/i);
  assert.match(path.paths[1].result, /reload-blind|no changes|72|reload-probe/i);
  assert.equal(classify(path), "reload-blind");
  assert.equal(matricula.hubCount, "MATRICULA");
  assert.equal(matricula.issue, 93987);
  assert.equal(matricula.matricula, true);
  assert.equal(classify(holdFix), "hold");
  assert.equal(classify(readData("admitted.json")), "admitted");
  assert.equal(classify(readData("rostered.json")), "rostered");
  assert.equal(classify(readData("listed.json")), "listed");
  assert.equal(classify(readData("scanned.json")), "scanned");
  assert.equal(classify(readData("freshened.json")), "freshened");
  assert.equal(classify(readData("no-changes.json")), "no-changes");
  assert.equal(classify(readData("mid-session-add.json")), "mid-session-add");
  assert.equal(classify(readData("fresh-process-sees.json")), "fresh-process-sees");
  assert.equal(classify(readData("skill-doctor.json")), "skill-doctor");
  assert.equal(classify(readData("reload-probe.json")), "reload-probe");
  assert.equal(classify(readData("count-stuck.json")), "count-stuck");
  assert.equal(classify(readData("junction-ok.json")), "junction-ok");
  assert.equal(classify(readData("verified-negative.json")), "verified-negative");
  assert.equal(classify(readData("landing.json")), "landing");
  assert.equal(classify(readData("cousins.json")), "cousins");
  assert.deepEqual(readData("cousins.json").issues, [88164, 74990, 72631]);
  assert.equal(classify(readData("backups.json")), "backups");
  assert.equal(classify(readData("walk.json")), "walk");
  assert.equal(classify(readData("has-repro.json")), "has-repro");
  assert.equal(classify(readData("fixtures.json")), "fixtures");
  assert.equal(classify(readData("closed.json")), "closed");
  const passes = readData("census-passes.json");
  assert.ok(passes.passes.length >= 3);
  assert.ok(passes.passes.some((row) => /72/.test(String(row.report)) && /no changes/i.test(row.report)));
  assert.ok(passes.passes.some((row) => /skill-doctor|reload-probe/i.test(row.report)));
});

test("chips include idle, seeded, path, and walk", () => {
  assert.ok(CHIPS.includes("enrolled"));
  assert.ok(CHIPS.includes("matricula"));
  assert.ok(CHIPS.includes("reload-blind"));
  assert.ok(CHIPS.includes("no-changes"));
  assert.ok(CHIPS.includes("mid-session-add"));
  assert.ok(CHIPS.includes("admitted"));
  assert.ok(CHIPS.includes("fixtures"));
  assert.ok(CHIPS.includes("walk"));
  assert.ok(ALARM.includes("matricula"));
  assert.ok(ALARM.includes("reload-blind"));
  assert.ok(ALARM.includes("no-changes"));
  assert.ok(ALARM.includes("mid-session-add"));
  assert.ok(VERDICTS.includes("walk"));
  assert.equal(classify({ seed: "fixtures", preferSeed: true }), "fixtures");
  assert.equal(classify({ seed: "walk", preferSeed: true }), "walk");
});

test("published matricula walk scores matricula after the idle hold", () => {
  const booth = scoreWalk({ rows: MATRICULA_WALK });
  assert.equal(booth.verdict, "matricula");
  assert.ok(booth.matriculaCount >= 1);
  const idle = booth.rows.find((row) => row.event === "roll-enrolled");
  assert.equal(idle.enrolled, true);
  assert.equal(idle.verdict, "enrolled");
  const cut = booth.rows.find((row) => row.event === "reload-blind");
  assert.equal(cut.reloadBlind, true);
  const path = booth.rows.find(
    (row) => row.event === "reload-blind" && row.t === "path",
  );
  assert.equal(path.verdict, "reload-blind");
});

test("MATRICULA_WALK constant matches the issue enrollment walk", () => {
  assert.equal(MATRICULA_WALK[0].event, "roll-enrolled");
  const cut = MATRICULA_WALK.find((row) => row.event === "reload-blind");
  assert.equal(cut.reloadBlind || cut.noChanges, true);
  const path = MATRICULA_WALK.find((row) => row.t === "path");
  assert.equal(path.matricula, true);
  const scoreRow = MATRICULA_WALK.find((row) => row.event === "matricula");
  assert.equal(scoreRow.matricula, true);
  assert.equal(scoreRow.noChanges, true);
});

test("positive control enrolled roll stays enrolled", () => {
  const walk = scoreWalk({ rows: POSITIVE_CONTROL_WALK });
  assert.equal(walk.verdict, "enrolled");
  const ok = walk.rows.find((row) => row.t === "hold");
  assert.equal(ok.verdict, "enrolled");
  const hold = walk.rows.find((row) => row.event === "roll-enrolled");
  assert.equal(hold.enrolled, true);
  assert.equal(hold.verdict, "enrolled");
});

test("issue constants encode only #93987 published facts", () => {
  assert.equal(FEATURED_ISSUE, 93987);
  assert.ok(ISSUE_URL.includes("93987"));
  assert.match(TITLE, /reload-skills|no changes|mid-session|fresh process/i);
  assert.equal(STATE, "OPEN");
  assert.match(PLATFORM, /windows/i);
  assert.match(HOST, /2\.1\.266|Windows 10|skill-doctor|junction/i);
  assert.equal(
    BUILD,
    "Claude Code desktop 2.1.266 (Code tab, Windows 10); CLI 2.1.263 control",
  );
  assert.equal(SURFACE, "reload-blind");
  assert.deepEqual(
    [...LABELS],
    ["bug", "has repro", "platform:windows", "area:skills", "area:desktop"],
  );
  assert.equal(FIELD_MARKS.length, 6);
  assert.equal(DESK_NAMES.length, 6);
  assert.ok(RULED_OUT.some((row) => /Allograph|#94256/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /Agraphia|#94251/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /Gauntlet|#94029/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /Cadastre|#92908/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /#88164/i.test(row)));
  assert.ok(EXPECTED.some((row) => /1 added|no changes|reload-probe|skill-doctor/i.test(row)));
  assert.match(
    DISTRIBUTION,
    /72|no changes|reload-probe|skill-doctor|2\.1\.266|junction|commands\.md/i,
  );
  assert.equal(BOOTH_STATIONS.length, 6);
  assert.ok(FINGERPRINT_LINES.includes("reload-blind"));
  assert.ok(FINGERPRINT_LINES.includes("matricula"));
  assert.equal(PHRASE, "Score matricula or admit enrolled.");
  assert.equal(SAMPLE_MATRICULA_PROOF.reloadBlind, true);
  assert.equal(SAMPLE_MATRICULA_PROOF.names.length, 6);
  assert.equal(CENSUS_PASSES.length, 4);
  assert.equal(CENSUS_PASSES[0].count, 72);
  assert.match(CENSUS_PASSES[3].report, /reload-probe/);
});

test("has-repro fingerprints encode the published matricula proof", () => {
  const result = handle(seedMatricula());
  assert.equal(result.published.platform, "windows");
  assert.equal(result.published.surface, "reload-blind");
  assert.equal(result.published.host, HOST);
  assert.match(
    fingerprint(seedMatricula()),
    /matricula\|kind=reload-blind\|ref=no-changes\|path=reload-blind\|cue=reload-blind/,
  );
  assert.equal(classify({ seed: "has-repro", preferSeed: true }), "has-repro");
});

test("forbidden idle list includes prior catalog words and equated/penned/ungloved/attested", () => {
  const required = [
    "equated",
    "penned",
    "ungloved",
    "attested",
    "reaped",
    "tenanted",
    "intact",
    "allograph",
    "agraphia",
    "gauntlet",
    "lictor",
    "lychgate",
    "ouster",
    "thimblerig",
    "fetchling",
    "rasure",
    "rasura",
    "cadastre",
    "escheated",
    "win-posix-mismatch",
    "pre-tool-omit",
    "attach-mouse",
    "picker-bypass",
  ];
  for (const word of required) {
    assert.ok(FORBIDDEN_IDLE.includes(word), `missing forbidden idle ${word}`);
  }
});

test("enrolled booth flips matricula back when the roll admits enrolled", () => {
  const tape = {
    enrolled: true,
    matricula: false,
    reloadBlind: false,
    cue: "enrolled",
  };
  assert.equal(scoreGate(tape).verdict, "enrolled");
  tape.enrolled = false;
  tape.matricula = true;
  tape.reloadBlind = true;
  tape.cue = "matricula";
  assert.equal(scoreGate(tape).verdict, "matricula");
  tape.enrolled = true;
  tape.matricula = false;
  tape.reloadBlind = false;
  tape.cue = "enrolled";
  assert.equal(scoreGate(tape).verdict, "enrolled");
});

test("roll, stamp, probe, census, and readBooth mark the matricula proof", () => {
  const roll = inspectRoll({ matricula: true });
  assert.equal(roll.stamp, "roll-blind");
  const stamp = inspectStamp({ matricula: true, noChanges: true });
  assert.equal(stamp.stamp, "no-changes-stamp");
  assert.equal(stamp.stamped, true);
  const probe = inspectProbe({ matricula: true, midSessionAdd: true });
  assert.equal(probe.stamp, "reload-probe");
  const booth = readBooth({
    matricula: true,
    reloadBlind: true,
    noChanges: true,
  });
  assert.equal(booth.matricula, true);
  assert.equal(booth.mark, "matricula");
  const open = readBooth({
    enrolled: true,
    matricula: false,
    reloadBlind: false,
  });
  assert.equal(open.matricula, false);
  assert.equal(open.mark, "enrolled");
  assert.equal(inspectCensus({ matricula: true, freshProcessSees: true }).stamp, "fresh-census");
  assert.equal(inspectJunction({ matricula: true, junctionOk: true }).stamp, "junction-ok");
  assert.equal(inspectPath({ matricula: true, reloadBlind: true }).stamp, "path-blind");
});

test("mapDesk encodes the published blind roll", () => {
  const miss = mapDesk({ matricula: true, reloadBlind: true });
  assert.equal(miss.stamp, "reload-blind");
  assert.equal(miss.holdingLane, "no-changes");
  assert.equal(miss.ribbon, "matricula");
  const clear = mapDesk({ enrolled: true, matricula: false });
  assert.equal(clear.stamp, "enrolled-roll");
  assert.equal(clear.kindLane, "listed");
  assert.equal(clear.holdingLane, "freshened");
});

test("cousins cite #88164 #74990 #72631 only; products stay distinct; backups stay data-only", () => {
  assert.equal(COUSINS.length, 3);
  assert.equal(COUSINS[0].issue, 88164);
  assert.equal(COUSINS[1].issue, 74990);
  assert.equal(COUSINS[2].issue, 72631);
  assert.equal(COUSINS[2].state, "CLOSED");
  assert.ok(COUSINS.every((row) => row.citeOnly === true));
  assert.ok(COUSINS.every((row) => /do not conflate/i.test(row.why)));
  assert.ok(NOT_PRODUCTS.includes("allograph"));
  assert.ok(NOT_PRODUCTS.includes("agraphia"));
  assert.ok(NOT_PRODUCTS.includes("gauntlet"));
  assert.ok(NOT_PRODUCTS.includes("lictor"));
  assert.ok(NOT_PRODUCTS.includes("rasure"));
  assert.ok(NOT_PRODUCTS.includes("cadastre"));
  assert.equal(BACKUPS.length, 6);
  assert.equal(BACKUPS[0].issue, 93924);
  assert.equal(BACKUPS[5].issue, 94277);
  assert.ok(BACKUPS.every((row) => row.citeOnly === true));
  assert.ok(!BACKUPS.some((row) => row.issue === 93987));
  assert.ok(!BACKUPS.some((row) => row.issue === 88164));
  assert.equal(classify({ seed: "cousins", preferSeed: true }), "cousins");
  assert.equal(classify({ seed: "backups", preferSeed: true }), "backups");
  assert.equal(classify(seedFreshProcessSees()), "fresh-process-sees");
});

test("CLI scores fixtures without a server", () => {
  const idle = spawnSync(process.execPath, [modelPath()], { encoding: "utf8" });
  const seeded = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/matricula.json", import.meta.url))],
    { encoding: "utf8" },
  );
  const enrolledFix = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/enrolled.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(idle.status, 0, idle.stderr);
  assert.equal(seeded.status, 0, seeded.stderr);
  assert.equal(enrolledFix.status, 0, enrolledFix.stderr);
  const idleOut = JSON.parse(idle.stdout);
  const seededOut = JSON.parse(seeded.stdout);
  const enrolledOut = JSON.parse(enrolledFix.stdout);
  assert.equal(idleOut.verdict, "enrolled");
  assert.equal(idleOut.hold, true);
  assert.equal(seededOut.verdict, "matricula");
  assert.equal(seededOut.alarm, true);
  assert.equal(enrolledOut.verdict, "enrolled");
  assert.equal(enrolledOut.hold, true);
  assert.match(enrolledOut.phrase, /admit enrolled/);
});

test("handle exposes published hypothesis and #93987 headline", () => {
  const result = handle(seedMatricula());
  assert.equal(result.published.issue, 93987);
  assert.equal(result.published.platform, "windows");
  assert.deepEqual(result.published.cousins, [88164, 74990, 72631]);
  assert.ok(result.published.backups.includes(93924));
  assert.ok(result.published.backups.includes(94277));
  assert.ok(!result.published.backups.includes(93987));
  assert.match(
    result.published.hypothesis,
    /reload-skills|no changes|fresh process|NON-BINDING|#93987/i,
  );
  assert.match(result.published.hypothesis, /NON-BINDING/);
  assert.match(result.published.hypothesis, /#93987/);
  assert.equal(result.published.build, BUILD);
});

test("model has no static node: imports so the enrolled page can score in-browser", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /^import .* from "node:/m);
  assert.match(source, /import\("node:fs"\)/);
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
});

test("enrolled page is an enrollment desk, not allograph foundry or agraphia clinic or cadastre bench", () => {
  const page = readPage();
  assert.match(page, /family=Bitter|Bitter/);
  assert.match(page, /family=Karla|Karla/);
  assert.match(page, /Roboto\+Mono|Roboto Mono/);
  assert.match(
    page,
    /matricula|enrolled|reload-blind|blotter-roll|no-changes-stamp|reload-probe|fresh-census|enrollment-desk/i,
  );
  assert.match(page, /#F7F0E6|#1A211C|#3A6B4F|#C4A15A|#6B3E2E/i);
  assert.match(page, /\benrolled\b/);
  assert.match(page, /\bmatricula\b/);
  assert.match(page, /reload-blind/);
  assert.match(page, /Score matricula or admit enrolled/i);
  assert.match(page, /#364/);
  assert.match(page, /#93987/);
  assert.match(page, /Admit enrolled/);
  assert.match(page, /Score matricula/);
  assert.match(page, /Walk reload-blind/);
  assert.match(page, /Compare enrolled \/ matricula/);
  assert.match(page, /Pin idle enrolled/);
  assert.match(page, /Pin seeded matricula/);
  assert.match(page, /Pin reload-blind/);
  assert.match(page, /Stamp no changes/);
  assert.match(page, /Score booth/);
  assert.match(page, /matricula-score/);
  assert.match(
    page,
    /72|no changes|reload-probe|skill-doctor|2\.1\.266|junction/i,
  );
  assert.match(page, /blotter-roll|no-changes-stamp|reload-probe|fresh-census|junction-path|enrollment-desk/i);
  assert.match(
    page,
    /<svg[\s\S]*class="blotter-roll"|class="no-changes-stamp"|class="reload-probe"|class="fresh-census"|class="junction-path"|class="enrollment-desk"/i,
  );
  assert.doesNotMatch(page, /family=Fraunces|Fraunces/);
  assert.doesNotMatch(page, /family=Source\+Sans\+3|Source Sans 3/);
  assert.doesNotMatch(page, /IBM\+Plex\+Mono|IBM Plex Mono/);
  assert.doesNotMatch(page, /family=Crimson\+Pro|Crimson Pro/);
  assert.doesNotMatch(page, /family=Outfit|Outfit/);
  assert.doesNotMatch(page, /JetBrains\+Mono|JetBrains Mono/);
  assert.doesNotMatch(page, /family=Cinzel|Cinzel/);
  assert.doesNotMatch(page, /#F3E6C9|#B87333|#F4F1EA|#D4A04A|#8B1E2D/);
  assert.doesNotMatch(page, /tilting-yard|iron glove|riveted cuff|mail sleeve/i);
  assert.doesNotMatch(page, /fasces|purple aisle|curule/i);
  assert.doesNotMatch(page, /neurology writing-desk|writing-hand|quill-lift|clinic-desk/i);
  assert.doesNotMatch(page, /type-foundry|punchcutter|dual-script|win-punch|posix-matrix/i);
  assert.doesNotMatch(page, /theodolite|cadastral|escheat|hasTrustDialogAccepted/i);
  assert.doesNotMatch(page, /admit equated|Score allograph|idle equated/i);
  assert.doesNotMatch(page, /admit penned|Score agraphia|idle penned/i);
  assert.doesNotMatch(page, /admit ungloved|Score gauntlet|idle ungloved/i);
  assert.doesNotMatch(page, /admit attested|Score lictor|idle attested/i);
  assert.doesNotMatch(page, /score escheated/i);
  assert.doesNotMatch(page, /\ballograph\b/);
  assert.doesNotMatch(page, /\bagraphia\b/);
  assert.doesNotMatch(page, /\bgauntlet\b/);
  assert.doesNotMatch(page, /\blictor\b/);
  assert.doesNotMatch(page, /\bcadastre\b/);
  assert.doesNotMatch(page, /win-posix-mismatch/);
  assert.doesNotMatch(page, /pre-tool-omit/);
  assert.doesNotMatch(page, /attach-mouse/);
  assert.doesNotMatch(page, /picker-bypass/);
  assert.match(page, /NOT Allograph/i);
  assert.match(page, /NOT Agraphia/i);
  assert.match(page, /NOT Gauntlet/i);
  assert.match(page, /NOT Cadastre/i);
  assert.match(page, /#88164/);
  assert.match(page, /#74990/);
  assert.doesNotMatch(page, /fetch\(/);
  assert.match(page, /body\.embed/);
});

test("README states the thesis, anti-clone, and how to score", () => {
  const readme = readReadme();
  assert.match(readme, /Matricula/);
  assert.match(readme, /#93987/);
  assert.match(readme, /\benrolled\b/);
  assert.match(readme, /\bmatricula\b/);
  assert.match(readme, /reload-blind/);
  assert.match(readme, /Bitter/);
  assert.match(readme, /Karla/);
  assert.match(readme, /Roboto Mono/);
  assert.doesNotMatch(readme, /Fraunces/);
  assert.doesNotMatch(readme, /Crimson Pro/);
  assert.doesNotMatch(readme, /Cinzel/);
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /Research brief/i);
  assert.match(readme, /72|no changes|reload-probe|skill-doctor|2\.1\.266/i);
  assert.match(readme, /NOT Allograph\/#94256/);
  assert.match(readme, /NOT Agraphia\/#94251/);
  assert.match(readme, /NOT Gauntlet\/#94029/);
  assert.match(readme, /NOT Cadastre\/#92908/);
  assert.match(readme, /#88164/);
  assert.match(readme, /#74990/);
  assert.match(readme, /#72631/);
  assert.match(readme, /do NOT rebuild|do not conflate/i);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/matricula/);
  assert.match(readme, /node --test projects\/matricula\/matricula\.test\.mjs/);
  assert.match(readme, /NON-BINDING/);
  assert.match(readme, /enrollment-desk|blotter|registrar|matricula/i);
  assert.match(readme, /Score matricula or admit enrolled/);
  assert.match(readme, /#93924|#93770|#93777|#94151|#94064|#94277/);
  assert.doesNotMatch(readme, /backup #93987|#93987 as next/);
  assert.match(readme, /00:50/);
  assert.match(readme, /Do NOT implement a fix/i);
  assert.doesNotMatch(readme, /\ballograph\b/);
  assert.doesNotMatch(readme, /\bagraphia\b/);
  const runLog = readFileSync(
    fileURLToPath(new URL("../../RUN_LOG.md", import.meta.url)),
    "utf8",
  );
  assert.match(runLog, /## 2026-09-14 — Matricula/);
  assert.match(runLog, /00:50/);
});

test("catalog features Matricula only; Allograph unfeatured; product count 364", () => {
  const catalog = readCatalog();
  const hub = readHubCatalog();
  assert.equal(catalog.products.length, 364);
  assert.equal(hub.products.length, 364);
  assert.equal(catalog.products[0].name, "Matricula");
  assert.equal(catalog.products[0].slug, "matricula");
  assert.equal(catalog.products[0].featured, true);
  assert.equal(catalog.products[0].href, "/matricula/");
  assert.equal(catalog.products[0].day, "2026-09-14");
  assert.equal(
    catalog.products[0].summary,
    "00:50 matricula: a university registrar / enrollment-desk / ivory-blotter / brass-stamp booth for #93987. Desktop /reload-skills returns Reloaded skills: 72 skills available (no changes) after ~/.claude/skills/reload-probe/SKILL.md is added mid-session; a fresh process `claude -p '/skill-doctor'` lists reload-probe. Idle enrolled / seeded matricula / path reload-blind. Score matricula or admit enrolled.",
  );
  assert.equal(hub.products[0].summary, catalog.products[0].summary);
  assert.match(catalog.products[0].summary, /\benrolled\b/);
  assert.match(catalog.products[0].summary, /\bmatricula\b/);
  assert.match(catalog.products[0].summary, /reload-blind/);
  assert.match(catalog.products[0].summary, /Score matricula or admit enrolled/);
  assert.match(catalog.products[0].summary, /#93987/);
  assert.equal(hub.products[0].slug, "matricula");
  assert.equal(hub.products[0].featured, true);
  const allograph = catalog.products.find((row) => row.slug === "allograph");
  assert.ok(allograph);
  assert.equal(allograph.featured, false);
  const agraphia = catalog.products.find((row) => row.slug === "agraphia");
  assert.ok(agraphia);
  assert.equal(agraphia.featured, false);
  const gauntlet = catalog.products.find((row) => row.slug === "gauntlet");
  assert.ok(gauntlet);
  assert.equal(gauntlet.featured, false);
  const cadastre = catalog.products.find((row) => row.slug === "cadastre");
  assert.ok(cadastre);
  assert.equal(cadastre.featured, false);
  assert.equal(catalog.products.filter((row) => row.featured).length, 1);
  assert.equal(catalog.products.filter((row) => row.slug === "matricula").length, 1);
  assert.ok(
    !catalog.products.some(
      (row) => String(row.summary || "").includes("93987") && row.slug !== "matricula",
    ),
  );
});

test("vercel rewrites matricula to the project folder at the top", () => {
  const vercel = readVercel();
  assert.equal(vercel.rewrites[0].source, "/matricula");
  assert.equal(vercel.rewrites[0].destination, "/projects/matricula");
  assert.equal(vercel.rewrites[1].source, "/matricula/");
  assert.equal(vercel.rewrites[1].destination, "/projects/matricula");
  assert.equal(vercel.rewrites[2].source, "/matricula/:path*");
  assert.equal(vercel.rewrites[2].destination, "/projects/matricula/:path*");
  assert.equal(vercel.rewrites[3].source, "/allograph");
  assert.equal(vercel.rewrites[3].destination, "/projects/allograph");
});

test("no network calls in the model or tests", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
  assert.doesNotMatch(source, /https?:\/\/[^\s"']*anthropic\.com\/v1/);
});
