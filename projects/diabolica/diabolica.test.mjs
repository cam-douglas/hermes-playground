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
  REFUSAL_SHAPES,
  RULED_OUT,
  DIABOLICA_WALK,
  SAMPLE_DIABOLICA_PROOF,
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
  inspectChamber,
  inspectCharges,
  inspectProof,
  inspectScale,
  inspectWrit,
  mapCourt,
  readBooth,
  score,
  scoreGate,
  scoreWalk,
  seedCannotShowNotGit,
  seedComputedProgramName,
  seedDiabolica,
  seedHold,
  seedInnocent,
  seedProduct,
  seedPwdUnresolved,
  seedSixRefusals,
} from "./diabolica.mjs";

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
  return fileURLToPath(new URL("./diabolica.mjs", import.meta.url));
}

test("idle innocent is a hold; writ sealed and scale balances", () => {
  const result = analyze(seedInnocent());
  assert.equal(result.verdict, "innocent");
  assert.equal(result.idleWord, "innocent");
  assert.equal(IDLE_WORD, "innocent");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.innocent, true);
  assert.equal(result.phrase, "admit innocent");
  assert.equal(result.diabolica, false);
  assert.equal(result.cannotShowNotGit, false);
  assert.ok(HOLD_ALIASES.includes("innocent"));
  assert.ok(HOLD_ALIASES.includes("quashed"));
  assert.ok(HOLD_ALIASES.includes("discharged"));
  assert.ok(HOLD_ALIASES.includes("unindicted"));
  assert.ok(HOLD_ALIASES.includes("writ-idle"));
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(result.idleWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("empty ticket and empty stdin classify innocent", () => {
  assert.equal(classify(emptyTicket()), "innocent");
  assert.equal(classify(""), "innocent");
  assert.equal(classify(null), "innocent");
  assert.equal(decide({}), "innocent");
});

test("#94040 seeded path scores diabolica when the negative proof is unfinished", () => {
  const result = analyze(seedDiabolica());
  assert.equal(result.verdict, "diabolica");
  assert.equal(result.seededWord, "diabolica");
  assert.equal(SEEDED_WORD, "diabolica");
  assert.equal(PRODUCT_WORD, "diabolica");
  assert.equal(result.hold, false);
  assert.equal(result.alarm, true);
  assert.equal(result.diabolica, true);
  assert.equal(result.phrase, "score diabolica");
  assert.equal(result.cannotShowNotGit, true);
  assert.equal(result.sixRefusals, true);
  for (const word of FORBIDDEN_SEED) {
    assert.notEqual(result.seededWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("inspectors mark tipped scale and unsealed writ", () => {
  const writ = inspectWrit({ diabolica: true, cannotShowNotGit: true });
  assert.equal(writ.stamp, "writ-unsealed");
  assert.equal(writ.unsealed, true);
  const scale = inspectScale({ diabolica: true, cannotShowNotGit: true });
  assert.equal(scale.stamp, "scale-diabolica");
  assert.equal(scale.tipped, true);
  const charges = inspectCharges({ diabolica: true, sixRefusals: true });
  assert.equal(charges.stamp, "charges-unsealed");
  const scored = scoreGate({
    diabolica: true,
    cannotShowNotGit: true,
    sixRefusals: true,
    cue: "diabolica",
  });
  assert.equal(scored.verdict, "diabolica");
  const shut = inspectWrit({ innocent: true, diabolica: false });
  assert.equal(shut.stamp, "writ-sealed");
});

test("path word is cannot-show-not-git; booth seed holds the path", () => {
  assert.equal(PATH_WORD, "cannot-show-not-git");
  const result = analyze(seedCannotShowNotGit());
  assert.equal(result.verdict, "cannot-show-not-git");
  assert.equal(result.pathWord, "cannot-show-not-git");
  assert.equal(result.hold, false);
  assert.equal(
    classify({ seed: "cannot-show-not-git", preferSeed: true, diabolica: true }),
    "cannot-show-not-git",
  );
  assert.equal(classify(seedPwdUnresolved()), "pwd-unresolved");
  assert.equal(score(seedCannotShowNotGit()), "diabolica");
});

test("HOLD includes innocent / hold", () => {
  assert.ok(HOLD.includes("innocent"));
  assert.ok(HOLD.includes("hold"));
  const hold = analyze(seedHold());
  assert.equal(hold.verdict, "hold");
  assert.equal(hold.hold, true);
  assert.equal(classify({ seed: "hold", preferSeed: true }), "hold");
});

test("alarm chips: pwd-unresolved, six-refusals, diabolica", () => {
  assert.equal(classify(seedPwdUnresolved()), "pwd-unresolved");
  assert.equal(classify(seedSixRefusals()), "six-refusals");
  assert.equal(classify(seedProduct()), "diabolica");
  assert.equal(classify(seedComputedProgramName()), "computed-program-name");
});

test("booth fixtures flip innocent vs diabolica vs cannot-show-not-git", () => {
  const idle = scoreGate(seedInnocent());
  const seeded = scoreGate(seedDiabolica());
  const innocent = readData("innocent.json");
  const diabolica = readData("diabolica.json");
  const path = readData("cannot-show-not-git.json");
  const holdFix = readData("hold.json");
  assert.equal(idle.verdict, "innocent");
  assert.equal(seeded.verdict, "diabolica");
  assert.notEqual(idle.verdict, seeded.verdict);
  assert.equal(score(seedInnocent()), "innocent");
  assert.equal(score(seedDiabolica()), "diabolica");
  assert.equal(score({ seed: "cannot-show-not-git", preferSeed: true }), "diabolica");
  assert.equal(innocent.cannotShowNotGit, false);
  assert.equal(innocent.innocent, true);
  assert.equal(scoreGate(innocent).verdict, "innocent");
  assert.equal(diabolica.cannotShowNotGit, true);
  assert.equal(diabolica.sixRefusals, true);
  assert.equal(diabolica.pwdUnresolved, true);
  assert.equal(classify(diabolica), "diabolica");
  assert.equal(path.paths.length, 3);
  assert.match(path.paths[0].rule, /innocent|quashed|discharged|unindicted|writ-idle/i);
  assert.match(path.paths[1].result, /cannot-show-not-git|too complex|PWD|heredoc/i);
  assert.equal(classify(path), "cannot-show-not-git");
  assert.equal(diabolica.hubCount, "DIABOLICA");
  assert.equal(diabolica.issue, 94040);
  assert.equal(diabolica.diabolica, true);
  assert.equal(classify(holdFix), "hold");
  assert.equal(classify(readData("quashed.json")), "quashed");
  assert.equal(classify(readData("discharged.json")), "discharged");
  assert.equal(classify(readData("unindicted.json")), "unindicted");
  assert.equal(classify(readData("writ-idle.json")), "writ-idle");
  assert.equal(classify(readData("pwd-unresolved.json")), "pwd-unresolved");
  assert.equal(classify(readData("option-may-stand.json")), "option-may-stand");
  assert.equal(classify(readData("heredoc-to-helper.json")), "heredoc-to-helper");
  assert.equal(classify(readData("pipeline-too-complex.json")), "pipeline-too-complex");
  assert.equal(classify(readData("wrapper-find-word.json")), "wrapper-find-word");
  assert.equal(classify(readData("computed-program-name.json")), "computed-program-name");
  assert.equal(classify(readData("six-refusals.json")), "six-refusals");
  assert.equal(classify(readData("one-eighty-one.json")), "one-eighty-one");
  assert.equal(classify(readData("landing.json")), "landing");
  assert.equal(classify(readData("cousins.json")), "cousins");
  assert.equal(classify(readData("backups.json")), "backups");
  assert.equal(classify(readData("walk.json")), "walk");
  assert.equal(classify(readData("has-repro.json")), "has-repro");
  assert.equal(classify(readData("fixtures.json")), "fixtures");
});

test("chips include idle, seeded, path, and walk", () => {
  assert.ok(CHIPS.includes("innocent"));
  assert.ok(CHIPS.includes("diabolica"));
  assert.ok(CHIPS.includes("cannot-show-not-git"));
  assert.ok(CHIPS.includes("pwd-unresolved"));
  assert.ok(CHIPS.includes("six-refusals"));
  assert.ok(CHIPS.includes("quashed"));
  assert.ok(CHIPS.includes("writ-idle"));
  assert.ok(CHIPS.includes("fixtures"));
  assert.ok(CHIPS.includes("walk"));
  assert.ok(ALARM.includes("diabolica"));
  assert.ok(ALARM.includes("cannot-show-not-git"));
  assert.ok(ALARM.includes("pwd-unresolved"));
  assert.ok(ALARM.includes("option-may-stand"));
  assert.ok(ALARM.includes("six-refusals"));
  assert.ok(VERDICTS.includes("walk"));
  assert.equal(classify({ seed: "fixtures", preferSeed: true }), "fixtures");
  assert.equal(classify({ seed: "walk", preferSeed: true }), "walk");
});

test("published diabolica walk scores diabolica after the idle hold", () => {
  const booth = scoreWalk({ rows: DIABOLICA_WALK });
  assert.equal(booth.verdict, "diabolica");
  assert.ok(booth.diabolicaCount >= 1);
  const idle = booth.rows.find((row) => row.event === "cue-innocent");
  assert.equal(idle.innocent, true);
  assert.equal(idle.verdict, "innocent");
  const cut = booth.rows.find((row) => row.event === "cannot-show-not-git");
  assert.equal(cut.cannotShowNotGit, true);
  const path = booth.rows.find((row) => row.event === "cannot-show-not-git" && row.t === "path");
  assert.equal(path.verdict, "cannot-show-not-git");
});

test("DIABOLICA_WALK constant matches the issue court walk", () => {
  assert.equal(DIABOLICA_WALK[0].event, "cue-innocent");
  const cut = DIABOLICA_WALK.find((row) => row.event === "cannot-show-not-git");
  assert.equal(cut.cannotShowNotGit || cut.sixRefusals, true);
  const path = DIABOLICA_WALK.find((row) => row.t === "path");
  assert.equal(path.diabolica, true);
  const scoreRow = DIABOLICA_WALK.find((row) => row.event === "diabolica");
  assert.equal(scoreRow.diabolica, true);
});

test("positive control innocent court stays innocent", () => {
  const walk = scoreWalk({ rows: POSITIVE_CONTROL_WALK });
  assert.equal(walk.verdict, "innocent");
  const ok = walk.rows.find((row) => row.t === "hold");
  assert.equal(ok.verdict, "innocent");
  const hold = walk.rows.find((row) => row.event === "cue-innocent");
  assert.equal(hold.innocent, true);
  assert.equal(hold.verdict, "innocent");
});

test("issue constants encode only #94040 published facts", () => {
  assert.equal(FEATURED_ISSUE, 94040);
  assert.ok(ISSUE_URL.includes("94040"));
  assert.match(TITLE, /Worktree-isolated|never run git|2\.1\.270/i);
  assert.equal(STATE, "OPEN");
  assert.equal(PLATFORM, "macos");
  assert.match(HOST, /worktree|Bash verifier|2\.1\.270/i);
  assert.equal(BUILD, "Claude Code 2.1.270");
  assert.equal(SURFACE, "cannot-show-not-git");
  assert.deepEqual(
    [...LABELS],
    ["bug", "has repro", "platform:macos", "area:bash", "area:sandbox"],
  );
  assert.equal(FIELD_MARKS.length, 6);
  assert.equal(REFUSAL_SHAPES.length, 6);
  assert.ok(RULED_OUT.some((row) => /Sallyport|#94082/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /Palilalia|#94041/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /Mondegreen|#93193/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /Postern/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /Portcullis|Wicket|Embrasure/i.test(row)));
  assert.ok(EXPECTED.some((row) => /\$PWD|time|heredoc|cannot run git/i.test(row)));
  assert.match(
    DISTRIBUTION,
    /helper --raw|sed -n 1p|\$PWD|heredoc|strings|time -p|181|120|too complex|cannot be shown/i,
  );
  assert.equal(BOOTH_STATIONS.length, 5);
  assert.ok(FINGERPRINT_LINES.includes("cannot-show-not-git"));
  assert.ok(FINGERPRINT_LINES.includes("diabolica"));
  assert.equal(PHRASE, "Score diabolica or admit innocent.");
  assert.equal(SAMPLE_DIABOLICA_PROOF.cannotShowNotGit, true);
  assert.equal(SAMPLE_DIABOLICA_PROOF.shapes.length, 6);
});

test("has-repro fingerprints encode the published diabolica proof", () => {
  const result = handle(seedDiabolica());
  assert.equal(result.published.platform, "macos");
  assert.equal(result.published.surface, "cannot-show-not-git");
  assert.equal(result.published.host, HOST);
  assert.match(
    fingerprint(seedDiabolica()),
    /diabolica\|kind=cannot-show-not-git\|ref=pwd\|path=cannot-show-not-git\|cue=cannot-show-not-git/,
  );
  assert.equal(classify({ seed: "has-repro", preferSeed: true }), "has-repro");
});

test("forbidden idle list includes sealed/silenced/cleared/waved and recent catalog words", () => {
  const required = [
    "sealed",
    "silenced",
    "living",
    "cleared",
    "waved",
    "passable",
    "spanned",
    "matched",
    "inscribed",
    "berthed",
    "pegged",
    "tokenized",
    "sallyport",
    "palilalia",
    "sepulchre",
    "sneck",
    "drawbridge",
    "chirograph",
    "titulus",
    "derelict",
    "vestry",
    "surfeit",
    "phosphene",
    "scotoma",
    "mondegreen",
    "postern",
    "portcullis",
    "wicket",
    "embrasure",
    "reminder-secret-bypass",
    "goal-stop-refire",
    "bash-nul-poison",
    "chip-dismiss-ephemeral",
    "substring-scan",
  ];
  for (const word of required) {
    assert.ok(FORBIDDEN_IDLE.includes(word), `missing forbidden idle ${word}`);
  }
});

test("innocent booth flips diabolica back when the court admits innocent", () => {
  const tape = {
    innocent: true,
    diabolica: false,
    cannotShowNotGit: false,
    cue: "innocent",
  };
  assert.equal(scoreGate(tape).verdict, "innocent");
  tape.innocent = false;
  tape.diabolica = true;
  tape.cannotShowNotGit = true;
  tape.cue = "diabolica";
  assert.equal(scoreGate(tape).verdict, "diabolica");
  tape.innocent = true;
  tape.diabolica = false;
  tape.cannotShowNotGit = false;
  tape.cue = "innocent";
  assert.equal(scoreGate(tape).verdict, "innocent");
});

test("writ, scale, chamber, and readBooth mark the diabolica proof", () => {
  const idle = inspectWrit({
    innocent: true,
  });
  assert.equal(idle.stamp, "writ-sealed");
  const scale = inspectScale({ diabolica: true, cannotShowNotGit: true });
  assert.equal(scale.stamp, "scale-diabolica");
  assert.equal(scale.tipped, true);
  const chamber = inspectChamber({ diabolica: true, oneEightyOne: true });
  assert.equal(chamber.stamp, "chamber-charged");
  const booth = readBooth({
    diabolica: true,
    cannotShowNotGit: true,
    sixRefusals: true,
  });
  assert.equal(booth.diabolica, true);
  assert.equal(booth.mark, "diabolica");
  const shut = readBooth({
    innocent: true,
    diabolica: false,
    cannotShowNotGit: false,
  });
  assert.equal(shut.diabolica, false);
  assert.equal(shut.mark, "innocent");
  assert.equal(inspectProof({ diabolica: true, cannotShowNotGit: true }).stamp, "proof-unfinished");
  assert.equal(inspectScale({ innocent: true }).stamp, "scale-innocent");
});

test("mapCourt encodes the published open indictment", () => {
  const miss = mapCourt({ diabolica: true, cannotShowNotGit: true });
  assert.equal(miss.stamp, "cannot-show-not-git");
  assert.equal(miss.holdingLane, "indicted");
  assert.equal(miss.ribbon, "diabolica");
  const clear = mapCourt({ innocent: true, diabolica: false });
  assert.equal(clear.stamp, "innocent-writ");
  assert.equal(clear.kindLane, "writ-idle");
  assert.equal(clear.holdingLane, "quashed");
});

test("cousins cite #90293 #90307 #93193 only; products stay distinct; backups stay data-only", () => {
  assert.equal(COUSINS.length, 3);
  assert.equal(COUSINS[0].issue, 90293);
  assert.equal(COUSINS[1].issue, 90307);
  assert.equal(COUSINS[2].issue, 93193);
  assert.ok(COUSINS.every((row) => row.citeOnly === true));
  assert.ok(NOT_PRODUCTS.includes("sallyport"));
  assert.ok(NOT_PRODUCTS.includes("palilalia"));
  assert.ok(NOT_PRODUCTS.includes("sepulchre"));
  assert.ok(NOT_PRODUCTS.includes("mondegreen"));
  assert.ok(NOT_PRODUCTS.includes("postern"));
  assert.ok(NOT_PRODUCTS.includes("scotoma"));
  assert.equal(BACKUPS.length, 9);
  assert.equal(BACKUPS[0].issue, 94032);
  assert.equal(BACKUPS[8].issue, 94053);
  assert.ok(BACKUPS.every((row) => row.citeOnly === true));
  assert.ok(!BACKUPS.some((row) => row.issue === 94040));
  assert.ok(!BACKUPS.some((row) => row.issue === 93193));
  assert.equal(classify({ seed: "cousins", preferSeed: true }), "cousins");
  assert.equal(classify({ seed: "backups", preferSeed: true }), "backups");
});

test("CLI scores fixtures without a server", () => {
  const idle = spawnSync(process.execPath, [modelPath()], { encoding: "utf8" });
  const seeded = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/diabolica.json", import.meta.url))],
    { encoding: "utf8" },
  );
  const innocentFix = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/innocent.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(idle.status, 0, idle.stderr);
  assert.equal(seeded.status, 0, seeded.stderr);
  assert.equal(innocentFix.status, 0, innocentFix.stderr);
  const idleOut = JSON.parse(idle.stdout);
  const seededOut = JSON.parse(seeded.stdout);
  const innocentOut = JSON.parse(innocentFix.stdout);
  assert.equal(idleOut.verdict, "innocent");
  assert.equal(idleOut.hold, true);
  assert.equal(seededOut.verdict, "diabolica");
  assert.equal(seededOut.alarm, true);
  assert.equal(innocentOut.verdict, "innocent");
  assert.equal(innocentOut.hold, true);
  assert.match(innocentOut.phrase, /admit innocent/);
});

test("handle exposes published hypothesis and #94040 headline", () => {
  const result = handle(seedDiabolica());
  assert.equal(result.published.issue, 94040);
  assert.equal(result.published.platform, "macos");
  assert.deepEqual(result.published.cousins, [90293, 90307, 93193]);
  assert.ok(result.published.backups.includes(94032));
  assert.ok(result.published.backups.includes(94053));
  assert.ok(!result.published.backups.includes(94040));
  assert.match(result.published.hypothesis, /worktree|negative proof|NON-BINDING|#94040/i);
  assert.match(result.published.hypothesis, /NON-BINDING/);
  assert.match(result.published.hypothesis, /#94040/);
  assert.equal(result.published.build, BUILD);
});

test("model has no static node: imports so the innocent page can score in-browser", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /^import .* from "node:/m);
  assert.match(source, /import\("node:fs"\)/);
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
});

test("innocent page is a parchment court, not fortress or clinic or tomb or lyric booth", () => {
  const page = readPage();
  assert.match(page, /family=Fraunces|Fraunces/);
  assert.match(page, /family=Figtree|Figtree/);
  assert.match(page, /IBM\+Plex\+Mono|IBM Plex Mono/);
  assert.match(page, /diabolica|innocent|cannot-show-not-git|writ|balance|candle|parchment|probatio/i);
  assert.match(page, /#E8D5A8|#120C08|#A31D2B|#E6A23C|#5A5348|#C9A227|#1C1108/i);
  assert.match(page, /\binnocent\b/);
  assert.match(page, /\bdiabolica\b/);
  assert.match(page, /cannot-show-not-git/);
  assert.match(page, /Score diabolica or admit innocent/i);
  assert.match(page, /#352/);
  assert.match(page, /#94040/);
  assert.match(page, /Admit innocent/);
  assert.match(page, /Score diabolica/);
  assert.match(page, /Walk cannot-show-not-git/);
  assert.match(page, /Compare innocent \/ diabolica/);
  assert.match(page, /Pin idle innocent/);
  assert.match(page, /Pin seeded diabolica/);
  assert.match(page, /Pin cannot-show-not-git/);
  assert.match(page, /Quash the writ/);
  assert.match(page, /Score booth/);
  assert.match(page, /diabolica-score/);
  assert.match(page, /helper --raw|sed -n 1p|\$PWD|heredoc|strings|time -p|181|120/i);
  assert.match(page, /writ|scale|candle|chamber|parchment|wax/i);
  assert.match(page, /<svg[\s\S]*scale|class="scale-beam"/i);
  assert.doesNotMatch(page, /family=Newsreader|Newsreader/);
  assert.doesNotMatch(page, /family=Public\+Sans|Public Sans/);
  assert.doesNotMatch(page, /Source\+Code\+Pro|Source Code Pro/);
  assert.doesNotMatch(page, /family=Libre\+Baskerville|Libre Baskerville/);
  assert.doesNotMatch(page, /family=DM\+Sans|DM Sans/);
  assert.doesNotMatch(page, /JetBrains Mono|JetBrains\+Mono/);
  assert.doesNotMatch(page, /family=Cardo|Cardo/);
  assert.doesNotMatch(page, /family=Cinzel|Cinzel/);
  assert.doesNotMatch(page, /family=Cormorant|Cormorant/);
  assert.doesNotMatch(page, /family=Outfit|Outfit/);
  assert.doesNotMatch(page, /family=Space\+Mono|Space Mono/);
  assert.doesNotMatch(page, /phonograph|wax-cylinder|stylus/i);
  assert.doesNotMatch(page, /ossuary|limestone lintel|extinguished lamp/i);
  assert.doesNotMatch(page, /cottage|stoop|wool draft|oak plank/i);
  assert.doesNotMatch(page, /bailey|merlon|crenel|gatehouse/i);
  assert.doesNotMatch(page, /lyric-mishearing|ballad-sheet|legitimate/i);
  assert.doesNotMatch(page, /night-latch|postern-gate/i);
  assert.doesNotMatch(page, /admit sealed|idle sealed|Score sallyport/i);
  assert.doesNotMatch(page, /\bsilenced\b/);
  assert.doesNotMatch(page, /\bliving\b/);
  assert.doesNotMatch(page, /\bspanned\b/);
  assert.doesNotMatch(page, /\bcleared\b/);
  assert.match(page, /NOT Sallyport/i);
  assert.match(page, /NOT Palilalia/i);
  assert.match(page, /NOT Mondegreen/i);
  assert.match(page, /NOT Sepulchre/i);
  assert.doesNotMatch(page, /fetch\(/);
});

test("README states the thesis, anti-clone, and how to score", () => {
  const readme = readReadme();
  assert.match(readme, /Diabolica/);
  assert.match(readme, /#94040/);
  assert.match(readme, /\binnocent\b/);
  assert.match(readme, /\bdiabolica\b/);
  assert.match(readme, /cannot-show-not-git/);
  assert.match(readme, /Fraunces/);
  assert.match(readme, /Figtree/);
  assert.match(readme, /IBM Plex Mono/);
  assert.doesNotMatch(readme, /Newsreader/);
  assert.doesNotMatch(readme, /Public Sans/);
  assert.doesNotMatch(readme, /Libre Baskerville/);
  assert.doesNotMatch(readme, /DM Sans/);
  assert.doesNotMatch(readme, /JetBrains/);
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /Research brief/i);
  assert.match(readme, /CANNOT-SHOW-NOT-GIT|probatio diabolica|never run git/i);
  assert.match(readme, /NOT Sallyport\/#94082/);
  assert.match(readme, /NOT Palilalia\/#94041/);
  assert.match(readme, /NOT Mondegreen\/#93193/);
  assert.match(readme, /#90293|#90307|#93193/);
  assert.match(readme, /helper --raw|sed -n 1p|\$PWD|181|120/i);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/diabolica/);
  assert.match(readme, /node --test projects\/diabolica\/diabolica\.test\.mjs/);
  assert.match(readme, /NON-BINDING/);
  assert.match(readme, /writ|scale|candle|chamber|parchment/i);
  assert.match(readme, /Score diabolica or admit innocent/);
  assert.match(readme, /#94032|#94031|#94029|#93987|#93924|#93770|#93777|#94059|#94053/);
  assert.match(readme, /11:50/);
  assert.match(readme, /Do NOT implement a fix/i);
  const runLog = readFileSync(fileURLToPath(new URL("../../RUN_LOG.md", import.meta.url)), "utf8");
  assert.match(runLog, /## 2026-09-14 — Diabolica/);
  assert.match(runLog, /11:50/);
});

test("catalog features Diabolica only; Sallyport unfeatured; product count 352", () => {
  const catalog = readCatalog();
  const hub = readHubCatalog();
  assert.equal(catalog.products.length, 352);
  assert.equal(hub.products.length, 352);
  assert.equal(catalog.products[0].name, "Diabolica");
  assert.equal(catalog.products[0].slug, "diabolica");
  assert.equal(catalog.products[0].featured, true);
  assert.equal(catalog.products[0].href, "/diabolica/");
  assert.equal(catalog.products[0].day, "2026-09-14");
  assert.equal(
    catalog.products[0].summary,
    "11:50 diabolica: an inquisitorial / devil's-proof / parchment-court / iron-balance-scale / sealed-writ / candlelit-chamber booth for #94040. Worktree-isolated sessions still refuse Bash commands that never run git (2.1.270) — residual inverted burden of proof (cannot be shown not to be git / too complex to verify) after loops and quoted-argv substring git often pass. Idle innocent / seeded diabolica / path cannot-show-not-git. Score diabolica or admit innocent.",
  );
  assert.equal(hub.products[0].summary, catalog.products[0].summary);
  assert.match(catalog.products[0].summary, /\binnocent\b/);
  assert.match(catalog.products[0].summary, /\bdiabolica\b/);
  assert.match(catalog.products[0].summary, /cannot-show-not-git/);
  assert.match(catalog.products[0].summary, /Score diabolica or admit innocent/);
  assert.match(catalog.products[0].summary, /#94040/);
  assert.equal(hub.products[0].slug, "diabolica");
  assert.equal(hub.products[0].featured, true);
  const sallyport = catalog.products.find((row) => row.slug === "sallyport");
  assert.ok(sallyport);
  assert.equal(sallyport.featured, false);
  const palilalia = catalog.products.find((row) => row.slug === "palilalia");
  assert.ok(palilalia);
  assert.equal(palilalia.featured, false);
  const sepulchre = catalog.products.find((row) => row.slug === "sepulchre");
  assert.ok(sepulchre);
  assert.equal(sepulchre.featured, false);
  const mondegreen = catalog.products.find((row) => row.slug === "mondegreen");
  assert.ok(mondegreen);
  assert.equal(mondegreen.featured, false);
  assert.equal(catalog.products.filter((row) => row.featured).length, 1);
  assert.equal(catalog.products.filter((row) => row.slug === "diabolica").length, 1);
  assert.ok(!catalog.products.some((row) => String(row.summary || "").includes("94040") && row.slug !== "diabolica"));
});

test("vercel rewrites diabolica to the project folder at the top", () => {
  const vercel = readVercel();
  assert.equal(vercel.rewrites[0].source, "/diabolica");
  assert.equal(vercel.rewrites[0].destination, "/projects/diabolica");
  assert.equal(vercel.rewrites[1].source, "/diabolica/");
  assert.equal(vercel.rewrites[1].destination, "/projects/diabolica");
  assert.equal(vercel.rewrites[2].source, "/diabolica/:path*");
  assert.equal(vercel.rewrites[2].destination, "/projects/diabolica/:path*");
});

test("no network calls in the model or tests", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
  assert.doesNotMatch(source, /https?:\/\/[^\s"']*anthropic\.com\/v1/);
});
