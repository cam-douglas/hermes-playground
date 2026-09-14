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
  CUP_SHAPES,
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
  SAMPLE_THIMBLERIG_PROOF,
  SEEDED_WORD,
  STATE,
  SURFACE,
  THIMBLERIG_WALK,
  TITLE,
  VERDICTS,
  analyze,
  classify,
  decide,
  emptyTicket,
  fingerprint,
  handle,
  inspectBoard,
  inspectCups,
  inspectPea,
  inspectTally,
  inspectTent,
  mapBoard,
  readBooth,
  score,
  scoreGate,
  scoreWalk,
  seedCarvedListing,
  seedHold,
  seedProduct,
  seedRowTrade,
  seedSkillRowCarve,
  seedThimblerig,
  seedAdditive,
} from "./thimblerig.mjs";

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
  return fileURLToPath(new URL("./thimblerig.mjs", import.meta.url));
}

test("idle additive is a hold; Skills row additive and tally moves", () => {
  const result = analyze(seedAdditive());
  assert.equal(result.verdict, "additive");
  assert.equal(result.idleWord, "additive");
  assert.equal(IDLE_WORD, "additive");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.additive, true);
  assert.equal(result.phrase, "admit additive");
  assert.equal(result.thimblerig, false);
  assert.equal(result.skillRowCarve, false);
  assert.ok(HOLD_ALIASES.includes("additive"));
  assert.ok(HOLD_ALIASES.includes("honest-total"));
  assert.ok(HOLD_ALIASES.includes("settled"));
  assert.ok(HOLD_ALIASES.includes("true-sum"));
  assert.ok(HOLD_ALIASES.includes("skills-additive"));
  assert.ok(HOLD_ALIASES.includes("account-true"));
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(result.idleWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("empty ticket and empty stdin classify additive", () => {
  assert.equal(classify(emptyTicket()), "additive");
  assert.equal(classify(""), "additive");
  assert.equal(classify(null), "additive");
  assert.equal(decide({}), "additive");
});

test("#94174 seeded path scores thimblerig when cups trade 1:1", () => {
  const result = analyze(seedThimblerig());
  assert.equal(result.verdict, "thimblerig");
  assert.equal(result.seededWord, "thimblerig");
  assert.equal(SEEDED_WORD, "thimblerig");
  assert.equal(PRODUCT_WORD, "thimblerig");
  assert.equal(result.hold, false);
  assert.equal(result.alarm, true);
  assert.equal(result.thimblerig, true);
  assert.equal(result.phrase, "score thimblerig");
  assert.equal(result.skillRowCarve, true);
  assert.equal(result.frozenTotal, true);
  for (const word of FORBIDDEN_SEED) {
    assert.notEqual(result.seededWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("inspectors mark traded cups and frozen chalk tally", () => {
  const tent = inspectTent({ thimblerig: true, skillRowCarve: true });
  assert.equal(tent.stamp, "tent-rigged");
  assert.equal(tent.rigged, true);
  const cups = inspectCups({ thimblerig: true, skillRowCarve: true });
  assert.equal(cups.stamp, "cups-traded");
  assert.equal(cups.traded, true);
  const pea = inspectPea({ thimblerig: true, carvedListing: true });
  assert.equal(pea.stamp, "pea-carved");
  const scored = scoreGate({
    thimblerig: true,
    skillRowCarve: true,
    rowTrade: true,
    cue: "thimblerig",
  });
  assert.equal(scored.verdict, "thimblerig");
  const open = inspectTent({ additive: true, thimblerig: false });
  assert.equal(open.stamp, "tent-canvas");
});

test("path word is skill-row-carve; booth seed holds the path", () => {
  assert.equal(PATH_WORD, "skill-row-carve");
  const result = analyze(seedSkillRowCarve());
  assert.equal(result.verdict, "skill-row-carve");
  assert.equal(result.pathWord, "skill-row-carve");
  assert.equal(result.hold, false);
  assert.equal(
    classify({
      seed: "skill-row-carve",
      preferSeed: true,
      thimblerig: true,
    }),
    "skill-row-carve",
  );
  assert.equal(classify(seedRowTrade()), "row-trade");
  assert.equal(score(seedSkillRowCarve()), "thimblerig");
});

test("HOLD includes additive / hold", () => {
  assert.ok(HOLD.includes("additive"));
  assert.ok(HOLD.includes("hold"));
  const hold = analyze(seedHold());
  assert.equal(hold.verdict, "hold");
  assert.equal(hold.hold, true);
  assert.equal(classify({ seed: "hold", preferSeed: true }), "hold");
});

test("alarm chips: row-trade, carved-listing, thimblerig", () => {
  assert.equal(classify(seedRowTrade()), "row-trade");
  assert.equal(classify(seedCarvedListing()), "carved-listing");
  assert.equal(classify(seedProduct()), "thimblerig");
});

test("booth fixtures flip additive vs thimblerig vs skill-row-carve", () => {
  const idle = scoreGate(seedAdditive());
  const seeded = scoreGate(seedThimblerig());
  const additive = readData("additive.json");
  const thimblerig = readData("thimblerig.json");
  const path = readData("skill-row-carve.json");
  const holdFix = readData("hold.json");
  assert.equal(idle.verdict, "additive");
  assert.equal(seeded.verdict, "thimblerig");
  assert.notEqual(idle.verdict, seeded.verdict);
  assert.equal(score(seedAdditive()), "additive");
  assert.equal(score(seedThimblerig()), "thimblerig");
  assert.equal(
    score({ seed: "skill-row-carve", preferSeed: true }),
    "thimblerig",
  );
  assert.equal(additive.skillRowCarve, false);
  assert.equal(additive.additive, true);
  assert.equal(scoreGate(additive).verdict, "additive");
  assert.equal(thimblerig.skillRowCarve, true);
  assert.equal(thimblerig.rowTrade, true);
  assert.equal(thimblerig.frozenTotal, true);
  assert.equal(classify(thimblerig), "thimblerig");
  assert.equal(path.paths.length, 3);
  assert.match(
    path.paths[0].rule,
    /additive|honest-total|settled|true-sum|skills-additive|account-true/i,
  );
  assert.match(
    path.paths[1].result,
    /skill-row-carve|row-trade|27\.1k|carved/i,
  );
  assert.equal(classify(path), "skill-row-carve");
  assert.equal(thimblerig.hubCount, "THIMBLERIG");
  assert.equal(thimblerig.issue, 94174);
  assert.equal(thimblerig.thimblerig, true);
  assert.equal(classify(holdFix), "hold");
  assert.equal(classify(readData("honest-total.json")), "honest-total");
  assert.equal(classify(readData("settled.json")), "settled");
  assert.equal(classify(readData("true-sum.json")), "true-sum");
  assert.equal(classify(readData("skills-additive.json")), "skills-additive");
  assert.equal(classify(readData("account-true.json")), "account-true");
  assert.equal(classify(readData("frozen-total.json")), "frozen-total");
  assert.equal(classify(readData("row-trade.json")), "row-trade");
  assert.equal(classify(readData("carved-listing.json")), "carved-listing");
  assert.equal(classify(readData("baseline-a.json")), "baseline-a");
  assert.equal(classify(readData("disable-invocation-b.json")), "disable-invocation-b");
  assert.equal(classify(readData("disable-bundled-c.json")), "disable-bundled-c");
  assert.equal(classify(readData("reporting-lie.json")), "reporting-lie");
  assert.equal(classify(readData("payload-shrinks.json")), "payload-shrinks");
  assert.equal(classify(readData("landing.json")), "landing");
  assert.equal(classify(readData("cousins.json")), "cousins");
  assert.deepEqual(readData("cousins.json").issues, [85439, 92255, 92877, 92881, 87281]);
  assert.equal(classify(readData("backups.json")), "backups");
  assert.equal(classify(readData("walk.json")), "walk");
  assert.equal(classify(readData("has-repro.json")), "has-repro");
  assert.equal(classify(readData("fixtures.json")), "fixtures");
});

test("chips include idle, seeded, path, and walk", () => {
  assert.ok(CHIPS.includes("additive"));
  assert.ok(CHIPS.includes("thimblerig"));
  assert.ok(CHIPS.includes("skill-row-carve"));
  assert.ok(CHIPS.includes("row-trade"));
  assert.ok(CHIPS.includes("frozen-total"));
  assert.ok(CHIPS.includes("honest-total"));
  assert.ok(CHIPS.includes("account-true"));
  assert.ok(CHIPS.includes("fixtures"));
  assert.ok(CHIPS.includes("walk"));
  assert.ok(ALARM.includes("thimblerig"));
  assert.ok(ALARM.includes("skill-row-carve"));
  assert.ok(ALARM.includes("row-trade"));
  assert.ok(ALARM.includes("carved-listing"));
  assert.ok(ALARM.includes("frozen-total"));
  assert.ok(VERDICTS.includes("walk"));
  assert.equal(classify({ seed: "fixtures", preferSeed: true }), "fixtures");
  assert.equal(classify({ seed: "walk", preferSeed: true }), "walk");
});

test("published thimblerig walk scores thimblerig after the idle hold", () => {
  const booth = scoreWalk({ rows: THIMBLERIG_WALK });
  assert.equal(booth.verdict, "thimblerig");
  assert.ok(booth.thimblerigCount >= 1);
  const idle = booth.rows.find((row) => row.event === "tally-additive");
  assert.equal(idle.additive, true);
  assert.equal(idle.verdict, "additive");
  const cut = booth.rows.find((row) => row.event === "skill-row-carve");
  assert.equal(cut.skillRowCarve, true);
  const path = booth.rows.find(
    (row) => row.event === "skill-row-carve" && row.t === "path",
  );
  assert.equal(path.verdict, "skill-row-carve");
});

test("THIMBLERIG_WALK constant matches the issue board walk", () => {
  assert.equal(THIMBLERIG_WALK[0].event, "tally-additive");
  const cut = THIMBLERIG_WALK.find((row) => row.event === "skill-row-carve");
  assert.equal(cut.skillRowCarve || cut.rowTrade, true);
  const path = THIMBLERIG_WALK.find((row) => row.t === "path");
  assert.equal(path.thimblerig, true);
  const scoreRow = THIMBLERIG_WALK.find((row) => row.event === "thimblerig");
  assert.equal(scoreRow.thimblerig, true);
});

test("positive control additive board stays additive", () => {
  const walk = scoreWalk({ rows: POSITIVE_CONTROL_WALK });
  assert.equal(walk.verdict, "additive");
  const ok = walk.rows.find((row) => row.t === "hold");
  assert.equal(ok.verdict, "additive");
  const hold = walk.rows.find((row) => row.event === "tally-additive");
  assert.equal(hold.additive, true);
  assert.equal(hold.verdict, "additive");
});

test("issue constants encode only #94174 published facts", () => {
  assert.equal(FEATURED_ISSUE, 94174);
  assert.ok(ISSUE_URL.includes("94174"));
  assert.match(TITLE, /\/context|hiding skills|System tools|#85439/i);
  assert.equal(STATE, "OPEN");
  assert.match(PLATFORM, /tui/i);
  assert.match(HOST, /\/context|skill listing/i);
  assert.equal(BUILD, "/context TUI (2.1.270; confirmed 2.1.233)");
  assert.equal(SURFACE, "skill-row-carve");
  assert.deepEqual([...LABELS], ["bug", "has repro", "area:tui"]);
  assert.equal(FIELD_MARKS.length, 6);
  assert.equal(CUP_SHAPES.length, 6);
  assert.ok(RULED_OUT.some((row) => /Fetchling|#94065/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /Souffleur|#94031/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /Epitome|#94032/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /Diabolica|#94040/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /Sallyport|#94082/i.test(row)));
  assert.ok(
    EXPECTED.some((row) => /additive|System tools|total should go down|carve/i.test(row)),
  );
  assert.match(
    DISTRIBUTION,
    /3\.9k|2\.8k|800|18k|19\.1k|21\.1k|27\.1k|disable-model-invocation|disableBundledSkills|#85439|2\.1\.270/i,
  );
  assert.equal(BOOTH_STATIONS.length, 5);
  assert.ok(FINGERPRINT_LINES.includes("skill-row-carve"));
  assert.ok(FINGERPRINT_LINES.includes("thimblerig"));
  assert.equal(PHRASE, "Score thimblerig or admit additive.");
  assert.equal(SAMPLE_THIMBLERIG_PROOF.skillRowCarve, true);
  assert.equal(SAMPLE_THIMBLERIG_PROOF.shapes.length, 6);
});

test("has-repro fingerprints encode the published thimblerig proof", () => {
  const result = handle(seedThimblerig());
  assert.equal(result.published.platform, "tui");
  assert.equal(result.published.surface, "skill-row-carve");
  assert.equal(result.published.host, HOST);
  assert.match(
    fingerprint(seedThimblerig()),
    /thimblerig\|kind=skill-row-carve\|ref=frozen\|path=skill-row-carve\|cue=skill-row-carve/,
  );
  assert.equal(classify({ seed: "has-repro", preferSeed: true }), "has-repro");
});

test("forbidden idle list includes prior catalog words and fetchling/souffleur", () => {
  const required = [
    "literal",
    "echoing",
    "unabridged",
    "innocent",
    "sealed",
    "silenced",
    "living",
    "cleared",
    "spanned",
    "matched",
    "inscribed",
    "berthed",
    "pegged",
    "latent",
    "flushed",
    "articulate",
    "limber",
    "primed",
    "lit",
    "voiced",
    "mute",
    "rostered",
    "quieted",
    "unrung",
    "demesned",
    "diagrammed",
    "fetchling",
    "souffleur",
    "epitome",
    "diabolica",
    "sallyport",
    "palilalia",
    "sepulchre",
    "sneck",
    "drawbridge",
    "chirograph",
    "titulus",
    "derelict",
    "vestry",
    "mondegreen",
    "afterimage",
    "phosphene",
    "scotoma",
    "scrim",
    "aphonia",
    "sourdine",
    "anarthria",
    "skill-dollar-swap",
    "app-switch-echo-loss",
    "summarized-thinking-force",
    "cannot-show-not-git",
    "reminder-secret-bypass",
    "goal-stop-refire",
    "bash-nul-poison",
  ];
  for (const word of required) {
    assert.ok(FORBIDDEN_IDLE.includes(word), `missing forbidden idle ${word}`);
  }
});

test("additive booth flips thimblerig back when the board admits additive", () => {
  const tape = {
    additive: true,
    thimblerig: false,
    skillRowCarve: false,
    cue: "additive",
  };
  assert.equal(scoreGate(tape).verdict, "additive");
  tape.additive = false;
  tape.thimblerig = true;
  tape.skillRowCarve = true;
  tape.cue = "thimblerig";
  assert.equal(scoreGate(tape).verdict, "thimblerig");
  tape.additive = true;
  tape.thimblerig = false;
  tape.skillRowCarve = false;
  tape.cue = "additive";
  assert.equal(scoreGate(tape).verdict, "additive");
});

test("tent, cups, pea, tally, and readBooth mark the thimblerig proof", () => {
  const idle = inspectTent({ additive: true });
  assert.equal(idle.stamp, "tent-canvas");
  const cups = inspectCups({ thimblerig: true, skillRowCarve: true });
  assert.equal(cups.stamp, "cups-traded");
  assert.equal(cups.traded, true);
  const pea = inspectPea({ thimblerig: true, carvedListing: true });
  assert.equal(pea.stamp, "pea-carved");
  const booth = readBooth({
    thimblerig: true,
    skillRowCarve: true,
    rowTrade: true,
  });
  assert.equal(booth.thimblerig, true);
  assert.equal(booth.mark, "thimblerig");
  const open = readBooth({
    additive: true,
    thimblerig: false,
    skillRowCarve: false,
  });
  assert.equal(open.thimblerig, false);
  assert.equal(open.mark, "additive");
  assert.equal(
    inspectTally({ thimblerig: true, frozenTotal: true }).stamp,
    "tally-frozen",
  );
  assert.equal(inspectCups({ additive: true }).stamp, "cups-still");
  assert.equal(
    inspectBoard({ thimblerig: true, reportingLie: true }).stamp,
    "board-lie",
  );
  assert.equal(
    inspectPea({ thimblerig: true, carvedListing: true }).stamp,
    "pea-carved",
  );
});

test("mapBoard encodes the published open carve", () => {
  const miss = mapBoard({ thimblerig: true, skillRowCarve: true });
  assert.equal(miss.stamp, "skill-row-carve");
  assert.equal(miss.holdingLane, "frozen");
  assert.equal(miss.ribbon, "thimblerig");
  const clear = mapBoard({ additive: true, thimblerig: false });
  assert.equal(clear.stamp, "additive-board");
  assert.equal(clear.kindLane, "account-true");
  assert.equal(clear.holdingLane, "true-sum");
});

test("cousins cite #85439 #92255 #92877 #92881 #87281 only; products stay distinct; backups stay data-only", () => {
  assert.equal(COUSINS.length, 5);
  assert.equal(COUSINS[0].issue, 85439);
  assert.equal(COUSINS[1].issue, 92255);
  assert.equal(COUSINS[2].issue, 92877);
  assert.equal(COUSINS[3].issue, 92881);
  assert.equal(COUSINS[4].issue, 87281);
  assert.ok(COUSINS.every((row) => row.citeOnly === true));
  assert.ok(COUSINS.every((row) => /do not conflate/i.test(row.why)));
  assert.ok(NOT_PRODUCTS.includes("fetchling"));
  assert.ok(NOT_PRODUCTS.includes("souffleur"));
  assert.ok(NOT_PRODUCTS.includes("epitome"));
  assert.ok(NOT_PRODUCTS.includes("diabolica"));
  assert.ok(NOT_PRODUCTS.includes("sallyport"));
  assert.equal(BACKUPS.length, 9);
  assert.equal(BACKUPS[0].issue, 94029);
  assert.equal(BACKUPS[8].issue, 94064);
  assert.ok(BACKUPS.every((row) => row.citeOnly === true));
  assert.ok(!BACKUPS.some((row) => row.issue === 94174));
  assert.ok(!BACKUPS.some((row) => row.issue === 94065));
  assert.ok(!BACKUPS.some((row) => [85439, 92255, 92877, 92881, 87281].includes(row.issue)));
  assert.equal(classify({ seed: "cousins", preferSeed: true }), "cousins");
  assert.equal(classify({ seed: "backups", preferSeed: true }), "backups");
});

test("CLI scores fixtures without a server", () => {
  const idle = spawnSync(process.execPath, [modelPath()], { encoding: "utf8" });
  const seeded = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/thimblerig.json", import.meta.url))],
    { encoding: "utf8" },
  );
  const additiveFix = spawnSync(
    process.execPath,
    [
      modelPath(),
      fileURLToPath(new URL("./data/additive.json", import.meta.url)),
    ],
    { encoding: "utf8" },
  );
  assert.equal(idle.status, 0, idle.stderr);
  assert.equal(seeded.status, 0, seeded.stderr);
  assert.equal(additiveFix.status, 0, additiveFix.stderr);
  const idleOut = JSON.parse(idle.stdout);
  const seededOut = JSON.parse(seeded.stdout);
  const additiveOut = JSON.parse(additiveFix.stdout);
  assert.equal(idleOut.verdict, "additive");
  assert.equal(idleOut.hold, true);
  assert.equal(seededOut.verdict, "thimblerig");
  assert.equal(seededOut.alarm, true);
  assert.equal(additiveOut.verdict, "additive");
  assert.equal(additiveOut.hold, true);
  assert.match(additiveOut.phrase, /admit additive/);
});

test("handle exposes published hypothesis and #94174 headline", () => {
  const result = handle(seedThimblerig());
  assert.equal(result.published.issue, 94174);
  assert.equal(result.published.platform, "tui");
  assert.deepEqual(result.published.cousins, [85439, 92255, 92877, 92881, 87281]);
  assert.ok(result.published.backups.includes(94029));
  assert.ok(result.published.backups.includes(94064));
  assert.ok(!result.published.backups.includes(94174));
  assert.match(
    result.published.hypothesis,
    /tools−skillListing|tools-skillListing|Skills additive|NON-BINDING|#94174/i,
  );
  assert.match(result.published.hypothesis, /NON-BINDING/);
  assert.match(result.published.hypothesis, /#94174/);
  assert.equal(result.published.build, BUILD);
});

test("model has no static node: imports so the additive page can score in-browser", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /^import .* from "node:/m);
  assert.match(source, /import\("node:fs"\)/);
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
});

test("additive page is a carnival cups-and-pea board, not a coin-ledger desk", () => {
  const page = readPage();
  assert.match(page, /family=Rye|Rye/);
  assert.match(page, /family=DM\+Sans|DM Sans/);
  assert.match(page, /IBM\+Plex\+Mono|IBM Plex Mono/);
  assert.match(
    page,
    /thimblerig|additive|skill-row-carve|cup|pea|chalk|tally|tent|carnival/i,
  );
  assert.match(page, /#E8DCC8|#3A2A1A|#3D8B4F|#B83232|#F4F0E6|#1E1A2E|#C9A227/i);
  assert.match(page, /\badditive\b/);
  assert.match(page, /\bthimblerig\b/);
  assert.match(page, /skill-row-carve/);
  assert.match(page, /Score thimblerig or admit additive/i);
  assert.match(page, /#356/);
  assert.match(page, /#94174/);
  assert.match(page, /Admit additive/);
  assert.match(page, /Score thimblerig/);
  assert.match(page, /Walk skill-row-carve/);
  assert.match(page, /Compare additive \/ thimblerig/);
  assert.match(page, /Pin idle additive/);
  assert.match(page, /Pin seeded thimblerig/);
  assert.match(page, /Pin skill-row-carve/);
  assert.match(page, /Lift the cups/);
  assert.match(page, /Score booth/);
  assert.match(page, /thimblerig-score/);
  assert.match(
    page,
    /27\.1k|3\.9k|2\.8k|18k|19\.1k|21\.1k|disable-model-invocation|disableBundledSkills|#85439/i,
  );
  assert.match(page, /tent|cup|pea|chalk|tally|carnival|thimblerig/i);
  assert.match(page, /<svg[\s\S]*class="pea-dot"|class="cup-shell"|class="tent-peak"/i);
  assert.doesNotMatch(page, /family=Lora|Lora/);
  assert.doesNotMatch(page, /family=Plus\+Jakarta\+Sans|Plus Jakarta Sans/);
  assert.doesNotMatch(page, /Roboto\+Mono|Roboto Mono/);
  assert.doesNotMatch(page, /family=Fraunces|Fraunces/);
  assert.doesNotMatch(page, /family=Nunito|Nunito/);
  assert.doesNotMatch(page, /Fira\+Code|Fira Code|Fira\+Mono/);
  assert.doesNotMatch(page, /family=Oswald|Oswald/);
  assert.doesNotMatch(page, /family=Karla|Karla/);
  assert.doesNotMatch(page, /Space\+Mono|Space Mono/);
  assert.doesNotMatch(page, /family=Newsreader|Newsreader/);
  assert.doesNotMatch(page, /family=Manrope|Manrope/);
  assert.doesNotMatch(page, /JetBrains Mono|JetBrains\+Mono/);
  assert.doesNotMatch(page, /family=Spectral|Spectral/);
  assert.doesNotMatch(page, /family=Public\+Sans|Public Sans/);
  assert.doesNotMatch(page, /Cousine/);
  assert.doesNotMatch(page, /family=Instrument\+Serif|Instrument Serif/);
  assert.doesNotMatch(page, /coin-ledger|mint tray|twilight glass|fae-twilight/i);
  assert.doesNotMatch(page, /prompt-corner|cue-script|footlights|wings-open/i);
  assert.doesNotMatch(page, /quill-knife|binding-press|gold-rule|scriptorium/i);
  assert.doesNotMatch(page, /probatio|parchment-court|iron scale|sealed writ/i);
  assert.doesNotMatch(page, /gatehouse|iron-grille|sealed-strongroom/i);
  assert.doesNotMatch(page, /admit literal|Score fetchling|idle literal/i);
  assert.doesNotMatch(page, /admit echoing|Score souffleur/i);
  assert.doesNotMatch(page, /admit unabridged|Score epitome/i);
  assert.doesNotMatch(page, /admit innocent|Score diabolica/i);
  assert.doesNotMatch(page, /admit sealed|Score sallyport/i);
  assert.doesNotMatch(page, /\bfetchling\b/);
  assert.doesNotMatch(page, /skill-dollar-swap/);
  assert.doesNotMatch(page, /app-switch-echo-loss/);
  assert.doesNotMatch(page, /summarized-thinking-force/);
  assert.match(page, /NOT Fetchling/i);
  assert.match(page, /NOT Souffleur/i);
  assert.match(page, /NOT Epitome/i);
  assert.match(page, /NOT Diabolica/i);
  assert.match(page, /NOT Sallyport/i);
  assert.match(page, /#85439|#92255|#92877|#92881|#87281/);
  assert.doesNotMatch(page, /fetch\(/);
});

test("README states the thesis, anti-clone, and how to score", () => {
  const readme = readReadme();
  assert.match(readme, /Thimblerig/);
  assert.match(readme, /#94174/);
  assert.match(readme, /\badditive\b/);
  assert.match(readme, /\bthimblerig\b/);
  assert.match(readme, /skill-row-carve/);
  assert.match(readme, /Rye/);
  assert.match(readme, /DM Sans/);
  assert.match(readme, /IBM Plex Mono/);
  assert.doesNotMatch(readme, /Lora/);
  assert.doesNotMatch(readme, /Plus Jakarta Sans/);
  assert.doesNotMatch(readme, /Roboto Mono/);
  assert.doesNotMatch(readme, /Fraunces/);
  assert.doesNotMatch(readme, /Nunito/);
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /Research brief/i);
  assert.match(
    readme,
    /SKILL-ROW-CARVE|27\.1k|Skills|System tools|disable-model-invocation/i,
  );
  assert.match(readme, /NOT Fetchling\/#94065/);
  assert.match(readme, /NOT Souffleur\/#94031/);
  assert.match(readme, /NOT Epitome\/#94032/);
  assert.match(readme, /NOT Diabolica\/#94040/);
  assert.match(readme, /NOT Sallyport\/#94082/);
  assert.match(readme, /#85439|#92255|#92877|#92881|#87281/);
  assert.match(readme, /do NOT rebuild|do not conflate/i);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/thimblerig/);
  assert.match(readme, /node --test projects\/thimblerig\/thimblerig\.test\.mjs/);
  assert.match(readme, /NON-BINDING/);
  assert.match(readme, /tent|cup|pea|chalk|tally|carnival/i);
  assert.match(readme, /Score thimblerig or admit additive/);
  assert.match(
    readme,
    /#94029|#93987|#93924|#93770|#93777|#94059|#94053|#94151|#94064/,
  );
  assert.match(readme, /15:50/);
  assert.match(readme, /Do NOT implement a fix/i);
  const runLog = readFileSync(
    fileURLToPath(new URL("../../RUN_LOG.md", import.meta.url)),
    "utf8",
  );
  assert.match(runLog, /## 2026-09-14 — Thimblerig/);
  assert.match(runLog, /15:50/);
});

test("catalog features Thimblerig only; Fetchling unfeatured; product count 356", () => {
  const catalog = readCatalog();
  const hub = readHubCatalog();
  assert.equal(catalog.products.length, 356);
  assert.equal(hub.products.length, 356);
  assert.equal(catalog.products[0].name, "Thimblerig");
  assert.equal(catalog.products[0].slug, "thimblerig");
  assert.equal(catalog.products[0].featured, true);
  assert.equal(catalog.products[0].href, "/thimblerig/");
  assert.equal(catalog.products[0].day, "2026-09-14");
  assert.equal(
    catalog.products[0].summary,
    "15:50 thimblerig: a street-corner cups-and-pea / carnival thimblerig booth for #94174. Re-open of #85439: hiding skills makes /context Skills row go down but System tools row goes up 1:1; total stuck at 27.1k. Maintainer: skill listing is a separate note, not tool definitions; /context carves Skills from a tools number that never contained it. Idle additive / seeded thimblerig / path skill-row-carve. Score thimblerig or admit additive.",
  );
  assert.equal(hub.products[0].summary, catalog.products[0].summary);
  assert.match(catalog.products[0].summary, /\badditive\b/);
  assert.match(catalog.products[0].summary, /\bthimblerig\b/);
  assert.match(catalog.products[0].summary, /skill-row-carve/);
  assert.match(catalog.products[0].summary, /Score thimblerig or admit additive/);
  assert.match(catalog.products[0].summary, /#94174/);
  assert.equal(hub.products[0].slug, "thimblerig");
  assert.equal(hub.products[0].featured, true);
  const fetchling = catalog.products.find((row) => row.slug === "fetchling");
  assert.ok(fetchling);
  assert.equal(fetchling.featured, false);
  const souffleur = catalog.products.find((row) => row.slug === "souffleur");
  assert.ok(souffleur);
  assert.equal(souffleur.featured, false);
  const epitome = catalog.products.find((row) => row.slug === "epitome");
  assert.ok(epitome);
  assert.equal(epitome.featured, false);
  assert.equal(catalog.products.filter((row) => row.featured).length, 1);
  assert.equal(catalog.products.filter((row) => row.slug === "thimblerig").length, 1);
  assert.ok(
    !catalog.products.some(
      (row) => String(row.summary || "").includes("94174") && row.slug !== "thimblerig",
    ),
  );
});

test("vercel rewrites thimblerig to the project folder at the top", () => {
  const vercel = readVercel();
  assert.equal(vercel.rewrites[0].source, "/thimblerig");
  assert.equal(vercel.rewrites[0].destination, "/projects/thimblerig");
  assert.equal(vercel.rewrites[1].source, "/thimblerig/");
  assert.equal(vercel.rewrites[1].destination, "/projects/thimblerig");
  assert.equal(vercel.rewrites[2].source, "/thimblerig/:path*");
  assert.equal(vercel.rewrites[2].destination, "/projects/thimblerig/:path*");
});

test("no network calls in the model or tests", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
  assert.doesNotMatch(source, /https?:\/\/[^\s"']*anthropic\.com\/v1/);
});
