import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ALARM,
  CHIPS,
  CHILD_WORD_C,
  CHILD_WORD_D,
  COUSINS,
  DARWIN,
  DOCS,
  ENTRESOL_WALK,
  FEATURED_ISSUE,
  FILED_AT,
  FORBIDDEN_IDLE,
  FORBIDDEN_SEED,
  FRESH_SESSIONS_ONLY,
  HOLD,
  IDLE_WORD,
  ISSUE_URL,
  LABELS,
  MACOS,
  MODES,
  NO_SYMLINKS,
  NOT_PRODUCTS,
  PARENT_WORD_PLAIN,
  PARENT_WORD_WORKTREE,
  PATH_WORD,
  PRODUCT,
  REPORTER,
  SEEDED_WORD,
  SIX_FIXTURE_MATRIX,
  STATE,
  TITLE,
  VERDICTS,
  VERSIONS,
  WORKAROUND,
  analyze,
  classify,
  decide,
  emptyTicket,
  fingerprint,
  handle,
  score,
  scoreCaseMatrix,
  scoreGate,
  scoreWalk,
  seedBypassed,
  seedCaseC,
  seedCaseD,
  seedCutaway,
  seedLodged,
} from "./entresol.mjs";

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

function modelPath() {
  return fileURLToPath(new URL("./entresol.mjs", import.meta.url));
}

test("idle lodged is a hold; parent CLAUDE.md reaches the worktree session", () => {
  const result = analyze(seedLodged());
  assert.equal(result.verdict, "lodged");
  assert.equal(result.idleWord, "lodged");
  assert.equal(IDLE_WORD, "lodged");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.lodged, true);
  assert.equal(result.phrase, "admit lodged");
  assert.equal(result.parentClaudeMdLoaded, true);
  assert.equal(result.childIsWorktreeOfParentRepo, true);
  assert.ok(result.loadedWords.includes(PARENT_WORD_WORKTREE));
  assert.ok(result.loadedWords.includes(CHILD_WORD_D));
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(result.idleWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("empty ticket and empty stdin classify lodged", () => {
  assert.equal(classify(emptyTicket()), "lodged");
  assert.equal(classify(""), "lodged");
  assert.equal(classify(null), "lodged");
  assert.equal(decide({}), "lodged");
});

test("#93010 seeded path scores bypassed when parent CLAUDE.md is absent", () => {
  const result = analyze(seedBypassed());
  assert.equal(result.verdict, "bypassed");
  assert.equal(result.seededWord, "bypassed");
  assert.equal(SEEDED_WORD, "bypassed");
  assert.equal(result.hold, false);
  assert.equal(result.alarm, true);
  assert.equal(result.bypassed, true);
  assert.equal(result.phrase, "score bypassed");
  assert.equal(result.parentHoldsRepo, true);
  assert.equal(result.childIsWorktreeOfParentRepo, true);
  assert.equal(result.parentClaudeMdLoaded, false);
  assert.equal(result.parentDotClaudeLoaded, false);
  assert.equal(result.ancestorsAboveLoaded, true);
  assert.ok(result.loadedWords.includes(CHILD_WORD_D));
  assert.ok(!result.loadedWords.includes(PARENT_WORD_WORKTREE));
  assert.ok(result.missingWords.includes(PARENT_WORD_WORKTREE));
  for (const word of FORBIDDEN_SEED) {
    assert.notEqual(result.seededWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("path word is cutaway; named cutaway seed holds the path", () => {
  assert.equal(PATH_WORD, "cutaway");
  const result = analyze(seedCutaway());
  assert.equal(result.verdict, "cutaway");
  assert.equal(result.pathWord, "cutaway");
  assert.equal(result.hold, false);
  assert.equal(classify(readData("cutaway.json")), "cutaway");
});

test("case C control: plain child of the same parent still loads parent CLAUDE.md", () => {
  const result = analyze(seedCaseC());
  assert.equal(result.parentClaudeMdLoaded, true);
  assert.equal(result.childIsPlain, true);
  assert.equal(result.childIsWorktreeOfParentRepo, false);
  assert.ok(result.loadedWords.includes(PARENT_WORD_PLAIN));
  assert.ok(result.loadedWords.includes(CHILD_WORD_C));
  assert.ok(!result.loadedWords.includes(PARENT_WORD_WORKTREE));
  assert.equal(classify(readData("case-c-plain-child.json")), "case-c-plain-child");
  assert.equal(scoreGate(seedCaseC()).verdict, "case-c-plain-child");
});

test("case D fail: worktree child of the parent repository skips parent CLAUDE.md", () => {
  const result = analyze(seedCaseD());
  assert.equal(result.parentClaudeMdLoaded, false);
  assert.equal(result.childIsWorktreeOfParentRepo, true);
  assert.ok(result.loadedWords.includes(CHILD_WORD_D));
  assert.ok(!result.loadedWords.includes(PARENT_WORD_WORKTREE));
  assert.equal(result.verdict, "bypassed");
  assert.equal(classify(readData("case-d-worktree-child.json")), "case-d-worktree-child");
});

test("six-fixture matrix: only the parent-holds-repo + worktree-of-that-repo pairing fails", () => {
  const matrix = scoreCaseMatrix();
  assert.equal(matrix.rows.length, 6);
  assert.equal(SIX_FIXTURE_MATRIX.length, 6);
  assert.equal(matrix.failingCount, 2);
  assert.equal(matrix.okCount, 4);
  assert.equal(matrix.onlyPairingFails, true);
  const failing = matrix.rows.filter((row) => row.fails);
  assert.ok(failing.every((row) => row.parentHoldsRepo && row.childIsWorktreeOfParentRepo));
  const ok = matrix.rows.filter((row) => !row.fails);
  assert.ok(ok.every((row) => !(row.parentHoldsRepo && row.childIsWorktreeOfParentRepo)));
  const names = matrix.rows.map((row) => row.name);
  assert.deepEqual(names, [
    "case-d-worktree-child",
    "case-c-plain-child",
    "bare-parent-alone-ok",
    "worktree-elsewhere-ok",
    "worktree-of-different-repo-ok",
    "parent-dot-claude-also-skipped",
  ]);
});

test("fixture toggle flips lodged vs bypassed", () => {
  const lodged = scoreGate(readData("lodged.json"));
  const bypassed = scoreGate(readData("bypassed.json"));
  assert.equal(lodged.verdict, "lodged");
  assert.equal(bypassed.verdict, "bypassed");
  assert.notEqual(lodged.verdict, bypassed.verdict);
  assert.equal(score(readData("lodged.json")), "lodged");
  assert.equal(score(readData("bypassed.json")), "bypassed");
  assert.equal(score(readData("93010.json")), "bypassed");
});

test("key fixture rows score their named verdicts", () => {
  assert.equal(classify(readData("case-d-worktree-child.json")), "case-d-worktree-child");
  assert.equal(classify(readData("case-c-plain-child.json")), "case-c-plain-child");
  assert.equal(classify(readData("bare-parent-alone-ok.json")), "bare-parent-alone-ok");
  assert.equal(classify(readData("worktree-elsewhere-ok.json")), "worktree-elsewhere-ok");
  assert.equal(classify(readData("worktree-of-different-repo-ok.json")), "worktree-of-different-repo-ok");
  assert.equal(classify(readData("parent-dot-claude-also-skipped.json")), "parent-dot-claude-also-skipped");
  assert.equal(classify(readData("has-repro.json")), "has-repro");
  assert.equal(classify(readData("hold.json")), "hold");
  assert.equal(classify(readData("cousins.json")), "cousins");
  assert.equal(classify(readData("fixtures.json")), "fixtures");
  assert.equal(classify(readData("chips.json")), "chips");
  assert.equal(classify(readData("fingerprints.json")), "fingerprints");
  assert.equal(classify(readData("walk.json")), "walk");
});

test("published entresol walk scores bypassed after the mezzanine is cut away", () => {
  const night = scoreWalk({ rows: readData("walk.json").rows });
  assert.equal(night.verdict, "bypassed");
  assert.ok(night.bypassedCount >= 1);
  const caseC = night.rows.find((row) => row.event === "case-c-plain-child");
  assert.equal(caseC.parentClaudeMdLoaded, true);
  assert.ok(caseC.loadedWords.includes(PARENT_WORD_PLAIN));
  const caseD = night.rows.find((row) => row.event === "case-d-worktree-child");
  assert.equal(caseD.verdict, "bypassed");
  assert.equal(caseD.parentClaudeMdLoaded, false);
  assert.ok(!caseD.loadedWords.includes(PARENT_WORD_WORKTREE));
  const dot = night.rows.find((row) => row.event === "parent-dot-claude-also-skipped");
  assert.equal(dot.parentDotClaudeLoaded, false);
  const cut = night.rows.find((row) => row.event === "cutaway");
  assert.equal(cut.verdict, "cutaway");
});

test("ENTRESOL_WALK constant matches the issue memory walk", () => {
  assert.equal(ENTRESOL_WALK[0].event, "docs-every-ancestor");
  const caseC = ENTRESOL_WALK.find((row) => row.event === "case-c-plain-child");
  assert.equal(caseC.parentWord, PARENT_WORD_PLAIN);
  assert.equal(caseC.childWord, CHILD_WORD_C);
  assert.equal(caseC.parentClaudeMdLoaded, true);
  const caseD = ENTRESOL_WALK.find((row) => row.event === "case-d-worktree-child");
  assert.equal(caseD.parentWord, PARENT_WORD_WORKTREE);
  assert.equal(caseD.childWord, CHILD_WORD_D);
  assert.equal(caseD.parentClaudeMdLoaded, false);
  const dot = ENTRESOL_WALK.find((row) => row.event === "parent-dot-claude-also-skipped");
  assert.equal(dot.parentDotClaudeLoaded, false);
});

test("issue constants encode only #93010 published facts", () => {
  assert.equal(FEATURED_ISSUE, 93010);
  assert.ok(ISSUE_URL.includes("93010"));
  assert.match(TITLE, /CLAUDE\.md in the directory above a git worktree/);
  assert.match(TITLE, /holds the worktree's repository/);
  assert.equal(STATE, "OPEN");
  assert.ok(LABELS.includes("bug"));
  assert.ok(LABELS.includes("has repro"));
  assert.ok(LABELS.includes("platform:macos"));
  assert.ok(LABELS.includes("area:core"));
  assert.equal(REPORTER, "jdavidbush");
  assert.equal(FILED_AT, "2026-09-09T06:09:19Z");
  assert.match(PRODUCT, /2\.1\.266/);
  assert.match(PRODUCT, /2\.1\.251/);
  assert.equal(DARWIN, "25.6.0");
  assert.equal(MACOS, "15");
  assert.deepEqual([...VERSIONS], ["2.1.266", "2.1.251"]);
  assert.ok(MODES.includes("-p print mode"));
  assert.ok(MODES.includes("interactive"));
  assert.match(DOCS, /recursively from cwd/);
  assert.equal(NO_SYMLINKS, true);
  assert.equal(FRESH_SESSIONS_ONLY, true);
  assert.match(WORKAROUND, /@-import/);
  assert.equal(PARENT_WORD_WORKTREE, "zorb-parent-WORKTREE");
  assert.equal(PARENT_WORD_PLAIN, "zorb-parent-PLAIN");
  assert.equal(CHILD_WORD_D, "zorb-child-D");
  assert.equal(CHILD_WORD_C, "zorb-child-C");
  assert.ok(HOLD.includes("lodged"));
  assert.ok(ALARM.includes("bypassed"));
  assert.ok(ALARM.includes("cutaway"));
  assert.ok(CHIPS.includes("case-d-worktree-child"));
  assert.ok(VERDICTS.includes("case-c-plain-child"));
  assert.ok(VERDICTS.includes("walk"));
});

test("forbidden idle list includes recent idle and seed words", () => {
  const required = [
    "sterling",
    "debased",
    "rubbed",
    "primed",
    "flashed",
    "flashpanned",
    "unshorn",
    "sheared",
    "secateured",
    "emended",
    "unretracted",
    "palinoded",
    "ephemeral",
    "voided",
    "fouled",
    "cold",
    "banked",
    "ferruled",
    "interlocked",
    "passable",
    "admitted",
    "deeded",
    "parked",
  ];
  for (const word of required) {
    assert.ok(FORBIDDEN_IDLE.includes(word), `missing forbidden idle ${word}`);
  }
});

test("restoring parent CLAUDE.md flips bypassed to lodged", () => {
  const tape = {
    parentHoldsRepo: true,
    childIsWorktreeOfParentRepo: true,
    parentClaudeMdLoaded: true,
    parentDotClaudeLoaded: true,
    ancestorsAboveLoaded: true,
    loadedWords: [CHILD_WORD_D, PARENT_WORD_WORKTREE],
    missingWords: [],
  };
  assert.equal(scoreGate(tape).verdict, "lodged");
  tape.parentClaudeMdLoaded = false;
  tape.parentDotClaudeLoaded = false;
  tape.loadedWords = [CHILD_WORD_D];
  tape.missingWords = [PARENT_WORD_WORKTREE];
  assert.equal(scoreGate(tape).verdict, "bypassed");
  tape.parentClaudeMdLoaded = true;
  tape.parentDotClaudeLoaded = true;
  tape.loadedWords = [CHILD_WORD_D, PARENT_WORD_WORKTREE];
  tape.missingWords = [];
  assert.equal(scoreGate(tape).verdict, "lodged");
});

test("cousins are cite-only; products stay distinct", () => {
  const cousins = readData("cousins.json");
  assert.equal(cousins.verdict, "cousins");
  assert.deepEqual(
    cousins.cousinsCiteOnly.map((row) => row.issue),
    [23565, 39920, 27994, 90572, 83411, 87824, 76119, 16600],
  );
  assert.equal(COUSINS.length, 8);
  assert.equal(COUSINS[0].issue, 23565);
  assert.ok(COUSINS.every((row) => row.citeOnly === true));
  assert.ok(NOT_PRODUCTS.includes("hallmark"));
  assert.ok(NOT_PRODUCTS.includes("flashpan"));
  assert.ok(NOT_PRODUCTS.includes("secateurs"));
  assert.ok(NOT_PRODUCTS.includes("palinode"));
  assert.ok(NOT_PRODUCTS.includes("ferrule"));
  assert.ok(NOT_PRODUCTS.includes("guillotine"));
  assert.ok(NOT_PRODUCTS.includes("greenroom"));
  assert.equal(classify(cousins), "cousins");
});

test("CLI scores fixtures without a server", () => {
  const lodged = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/lodged.json", import.meta.url))],
    { encoding: "utf8" },
  );
  const bypassed = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/bypassed.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(lodged.status, 0, lodged.stderr);
  assert.equal(bypassed.status, 0, bypassed.stderr);
  assert.equal(JSON.parse(lodged.stdout).verdict, "lodged");
  assert.equal(JSON.parse(bypassed.stdout).verdict, "bypassed");
});

test("handle exposes published hypothesis and #93010 headline", () => {
  const result = handle(readData("93010.json"));
  assert.equal(result.published.issue, 93010);
  assert.equal(result.published.parentWordWorktree, "zorb-parent-WORKTREE");
  assert.equal(result.published.parentWordPlain, "zorb-parent-PLAIN");
  assert.equal(result.published.childWordD, "zorb-child-D");
  assert.equal(result.published.childWordC, "zorb-child-C");
  assert.equal(result.published.darwin, "25.6.0");
  assert.deepEqual(result.published.cousins, [
    23565, 39920, 27994, 90572, 83411, 87824, 76119, 16600,
  ]);
  assert.match(result.published.hypothesis, /gitdir\/parent boundary/);
  assert.match(
    fingerprint(seedBypassed()),
    /bypassed\|child=worktree-of-parent-repo\|parent=absent/,
  );
});

test("model has no static node: imports so the living page can score in-browser", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /^import .* from "node:/m);
  assert.match(source, /import\("node:fs"\)/);
  assert.doesNotMatch(source, /fetch\(|https?:\/\/api\.|anthropic\.com\/v1/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
});

test("living page is a gallery mezzanine booth, not hallmark / flashpan / secateurs / palinode", () => {
  const page = readPage();
  assert.match(page, /Playfair Display/);
  assert.match(page, /Outfit/);
  assert.match(page, /Space Mono/);
  assert.match(page, /mezzanine|gallery|brass rail|walnut|cream plaster/i);
  assert.match(page, /#3a2a1c/);
  assert.match(page, /#c4a35a/);
  assert.match(page, /#f3ead7/);
  assert.match(page, /#1a1410/);
  assert.match(page, /#a84838/);
  assert.match(page, /lodged/);
  assert.match(page, /bypassed/);
  assert.match(page, /cutaway/);
  assert.match(page, /case-matrix|case matrix/i);
  assert.match(page, /score bypassed or admit lodged/i);
  assert.match(page, /drop-zone|dropzone|drop zone/i);
  assert.match(page, /cousin-not-primary/);
  assert.match(page, /18:50/);
  assert.match(page, /#245/);
  assert.match(page, /#93010/);
  assert.match(page, /zorb-parent-WORKTREE/);
  assert.match(page, /zorb-parent-PLAIN/);
  assert.match(page, /zorb-child-D/);
  assert.match(page, /zorb-child-C/);
  assert.doesNotMatch(page, /Cinzel|Lato|Fira Code/);
  assert.doesNotMatch(page, /Newsreader|Manrope|JetBrains/);
  assert.doesNotMatch(page, /Bitter|Figtree/);
  assert.doesNotMatch(page, /Cardo|Nunito/);
  assert.doesNotMatch(page, /Oswald|Source Sans 3/);
  assert.doesNotMatch(page, /Fraunces|Plus Jakarta/);
  assert.doesNotMatch(page, /EB Garamond|Barlow/);
  assert.doesNotMatch(page, /Bodoni Moda|Libre Caslon|Literata/);
  assert.doesNotMatch(page, /flintlock|priming-pan|damp powder/i);
  assert.doesNotMatch(page, /bypass shears|wooden handle|steel blade/i);
  assert.doesNotMatch(page, /wax tablet|vellum|ink pot|ruling/i);
  assert.doesNotMatch(page, /silversmith|purity mark|cupel/i);
  assert.doesNotMatch(page, /\bsterling\b/);
  assert.doesNotMatch(page, /\bdebased\b/);
  assert.doesNotMatch(page, /\brubbed\b/);
  assert.doesNotMatch(page, /\bprimed\b/);
  assert.doesNotMatch(page, /\bflashed\b/);
  assert.match(page, /NOT Hallmark/i);
  assert.match(page, /NOT Flashpan/i);
  assert.match(page, /NOT Secateurs/i);
  assert.match(page, /NOT Palinode/i);
  assert.match(page, /NOT Ferrule/i);
});

test("README states the thesis, anti-clone, and how to score", () => {
  const readme = readReadme();
  assert.match(readme, /Entresol/);
  assert.match(readme, /#93010/);
  assert.match(readme, /lodged/);
  assert.match(readme, /bypassed/);
  assert.match(readme, /cutaway/);
  assert.match(readme, /zorb-parent-WORKTREE/);
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /NOT Hallmark/i);
  assert.match(readme, /NOT Flashpan/i);
  assert.match(readme, /NOT Secateurs/i);
  assert.match(readme, /NOT Palinode/i);
  assert.match(readme, /NOT Ferrule/i);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/entresol/);
  assert.match(readme, /node --test projects\/entresol\/entresol\.test\.mjs/);
  assert.match(readme, /NOT leftover woodworking/i);
  assert.match(readme, /NON-BINDING/);
});

test("catalog #245 features Entresol; Hallmark stays listed unfeatured", () => {
  const catalog = readCatalog();
  assert.equal(catalog.products.length, 245);
  assert.equal(catalog.products[0].name, "Entresol");
  assert.equal(catalog.products[0].slug, "entresol");
  assert.equal(catalog.products[0].featured, true);
  assert.equal(catalog.products[0].href, "/entresol/");
  assert.equal(catalog.products[0].day, "2026-09-09");
  assert.match(catalog.products[0].summary, /18:50 entresol/);
  const hallmark = catalog.products.find((row) => row.slug === "hallmark");
  assert.ok(hallmark);
  assert.equal(hallmark.featured, false);
  const flashpan = catalog.products.find((row) => row.slug === "flashpan");
  assert.ok(flashpan);
  assert.equal(flashpan.featured, false);
  const secateurs = catalog.products.find((row) => row.slug === "secateurs");
  assert.ok(secateurs);
  assert.equal(secateurs.featured, false);
  const palinode = catalog.products.find((row) => row.slug === "palinode");
  assert.ok(palinode);
  assert.equal(palinode.featured, false);
});

test("no network calls in the model or tests", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /https?:\/\/api\.anthropic/);
  assert.doesNotMatch(source, /\bcurl\b/);
  assert.doesNotMatch(source, /https?:\/\/[^\s"']*anthropic\.com\/v1/);
});
