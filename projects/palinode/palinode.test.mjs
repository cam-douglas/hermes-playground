import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  AGE_CURRENT_MONTH,
  AGE_OLDER_THAN_5_WEEKS,
  AGE_PREVIOUS_MONTH,
  AGE_PRUNE_ELIGIBLE,
  AGE_PRUNE_FLOOR_DAYS,
  ALARM,
  BUDGET_EXAMPLE,
  BYTE_CAP,
  CHIPS,
  COUSINS,
  FEATURED_ISSUE,
  FILED_AT,
  FORBIDDEN_IDLE,
  FORBIDDEN_SEED,
  HOLD,
  IDLE_WORD,
  ISSUE_URL,
  LABELS,
  LADDER,
  LINE_CAP,
  NOT_PRODUCTS,
  PATH_WORD,
  REPORTER,
  RETRACT_WALK,
  SEEDED_WORD,
  SILO_LINES,
  SILO_MEMORIES,
  STATE,
  TITLE,
  VERDICTS,
  analyze,
  budgetLine,
  byteCapBindsFirst,
  classify,
  decide,
  emptyTicket,
  fingerprint,
  handle,
  score,
  scoreGate,
  scoreWalk,
  seedEmended,
  seedPalinoded,
  seedUnretracted,
} from "./palinode.mjs";

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
  return fileURLToPath(new URL("./palinode.mjs", import.meta.url));
}

test("idle emended is a hold; truncate from the top / newest corrections retained", () => {
  const result = analyze(seedEmended());
  assert.equal(result.verdict, "emended");
  assert.equal(result.idleWord, "emended");
  assert.equal(IDLE_WORD, "emended");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.emended, true);
  assert.equal(result.phrase, "admit emended");
  assert.equal(result.truncateFrom, "top");
  assert.equal(result.newestRetained, true);
  assert.equal(result.newestDiscarded, false);
  assert.equal(result.supersessionLost, false);
  assert.equal(result.budgetSurfaced, true);
  assert.equal(result.frontmatterPresent, true);
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(result.idleWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("empty ticket and empty stdin classify emended", () => {
  assert.equal(classify(emptyTicket()), "emended");
  assert.equal(classify(""), "emended");
  assert.equal(classify(null), "emended");
  assert.equal(decide({}), "emended");
});

test("#92998 seeded path scores unretracted from bottom truncation", () => {
  const result = analyze(seedUnretracted());
  assert.equal(result.verdict, "unretracted");
  assert.equal(result.seededWord, "unretracted");
  assert.equal(SEEDED_WORD, "unretracted");
  assert.equal(result.hold, false);
  assert.equal(result.alarm, true);
  assert.equal(result.unretracted, true);
  assert.equal(result.phrase, "score unretracted");
  assert.equal(result.truncateFrom, "bottom");
  assert.equal(result.newestDiscarded, true);
  assert.equal(result.supersessionLost, true);
  assert.equal(result.supersededLoaded, true);
  assert.equal(result.appendSuccess, true);
  assert.equal(result.writeWarned, false);
  assert.equal(result.laterSessionWarning, true);
  assert.equal(result.agePruneEligible, 0);
  for (const word of FORBIDDEN_SEED) {
    assert.notEqual(result.seededWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("path word is palinoded; named palinoded seed holds the path", () => {
  assert.equal(PATH_WORD, "palinoded");
  const result = analyze(seedPalinoded());
  assert.equal(result.verdict, "palinoded");
  assert.equal(result.pathWord, "palinoded");
  assert.equal(result.hold, false);
  assert.equal(classify(readData("palinoded.json")), "palinoded");
});

test("fixture toggle flips emended vs unretracted", () => {
  const emended = scoreGate(readData("emended.json"));
  const unretracted = scoreGate(readData("unretracted.json"));
  assert.equal(emended.verdict, "emended");
  assert.equal(unretracted.verdict, "unretracted");
  assert.notEqual(emended.verdict, unretracted.verdict);
  assert.equal(score(readData("emended.json")), "emended");
  assert.equal(score(readData("unretracted.json")), "unretracted");
  assert.equal(score(readData("92998.json")), "unretracted");
});

test("key fixture rows score their named verdicts", () => {
  assert.equal(classify(readData("bottom-truncate.json")), "bottom-truncate");
  assert.equal(classify(readData("newest-discarded.json")), "newest-discarded");
  assert.equal(classify(readData("supersession-lost.json")), "supersession-lost");
  assert.equal(classify(readData("write-reports-success.json")), "write-reports-success");
  assert.equal(classify(readData("later-session-warning.json")), "later-session-warning");
  assert.equal(classify(readData("byte-cap-25k.json")), "byte-cap-25k");
  assert.equal(classify(readData("line-cap-200.json")), "line-cap-200");
  assert.equal(classify(readData("age-prune-zero.json")), "age-prune-zero");
  assert.equal(classify(readData("frontmatter-lost.json")), "frontmatter-lost");
  assert.equal(classify(readData("truncate-from-top.json")), "truncate-from-top");
  assert.equal(classify(readData("budget-surface.json")), "budget-surface");
  assert.equal(classify(readData("has-repro.json")), "has-repro");
  assert.equal(classify(readData("hold.json")), "hold");
  assert.equal(classify(readData("cousins.json")), "cousins");
  assert.equal(classify(readData("fixtures.json")), "fixtures");
  assert.equal(classify(readData("chips.json")), "chips");
  assert.equal(classify(readData("fingerprints.json")), "fingerprints");
});

test("published retract walk scores unretracted after bottom truncation sheds the newest retract", () => {
  const night = scoreWalk(readData("walk.json"));
  assert.equal(night.verdict, "unretracted");
  assert.ok(night.unretractedCount >= 1);
  const append = night.rows.find((row) => row.event === "append-past-cap");
  assert.equal(append.verdict, "unretracted");
  assert.equal(append.appendSuccess, true);
  const cut = night.rows.find((row) => row.event === "bottom-truncate");
  assert.equal(cut.verdict, "unretracted");
  assert.equal(cut.truncateFrom, "bottom");
  const lost = night.rows.find((row) => row.event === "supersession-lost");
  assert.equal(lost.verdict, "unretracted");
  assert.equal(lost.supersessionLost, true);
  const later = night.rows.find((row) => row.event === "later-session-warning");
  assert.equal(later.verdict, "unretracted");
  assert.equal(later.laterSessionWarning, true);
});

test("RETRACT_WALK constant matches the issue overflow path", () => {
  assert.equal(RETRACT_WALK[0].event, "append-past-cap");
  assert.equal(RETRACT_WALK[0].truncateFrom, "bottom");
  assert.equal(RETRACT_WALK[0].appendSuccess, true);
  const cut = RETRACT_WALK.find((row) => row.event === "bottom-truncate");
  assert.equal(cut.truncateFrom, "bottom");
  const shed = RETRACT_WALK.find((row) => row.event === "newest-discarded");
  assert.equal(shed.newestDiscarded, true);
  const retract = RETRACT_WALK.find((row) => row.event === "supersession-lost");
  assert.equal(retract.supersessionLost, true);
  assert.equal(retract.supersededLoaded, true);
});

test("issue constants encode only #92998 published facts", () => {
  assert.equal(FEATURED_ISSUE, 92998);
  assert.ok(ISSUE_URL.includes("92998"));
  assert.match(TITLE, /NEWEST entries/);
  assert.equal(STATE, "OPEN");
  assert.ok(LABELS.includes("bug"));
  assert.ok(LABELS.includes("area:core"));
  assert.ok(LABELS.includes("memory"));
  assert.equal(LINE_CAP, 200);
  assert.equal(BYTE_CAP, 25000);
  assert.equal(SILO_MEMORIES, 199);
  assert.equal(SILO_LINES, 201);
  assert.equal(AGE_CURRENT_MONTH, 96);
  assert.equal(AGE_PREVIOUS_MONTH, 91);
  assert.equal(AGE_OLDER_THAN_5_WEEKS, 12);
  assert.equal(AGE_PRUNE_ELIGIBLE, 0);
  assert.equal(AGE_PRUNE_FLOOR_DAYS, 30);
  assert.equal(REPORTER, "No-Smoke");
  assert.equal(FILED_AT, "2026-09-09T04:47:31Z");
  assert.match(BUDGET_EXAMPLE, /195\/200/);
  assert.match(BUDGET_EXAMPLE, /22\.4k\/25k/);
  assert.equal(budgetLine(), BUDGET_EXAMPLE);
  assert.ok(byteCapBindsFirst());
  assert.equal(LADDER[0].bytes, 22744);
  assert.equal(LADDER[1].bytes, 22974);
  assert.equal(LADDER[LADDER.length - 1].hookChars, 0);
  assert.equal(LADDER[LADDER.length - 1].bytes, 18514);
  assert.ok(HOLD.includes("emended"));
  assert.ok(ALARM.includes("unretracted"));
  assert.ok(ALARM.includes("palinoded"));
  assert.ok(CHIPS.includes("bottom-truncate"));
  assert.ok(VERDICTS.includes("truncate-from-top"));
  assert.ok(VERDICTS.includes("frontmatter-lost"));
  assert.ok(VERDICTS.includes("age-prune-zero"));
  assert.ok(VERDICTS.includes("byte-cap-25k"));
  assert.ok(VERDICTS.includes("line-cap-200"));
});

test("bottom truncation flips emended to unretracted; top truncate recovers", () => {
  const tape = {
    truncateFrom: "top",
    newestRetained: true,
    newestDiscarded: false,
    supersessionLost: false,
    supersededLoaded: false,
    appendSuccess: true,
    writeWarned: true,
    budgetSurfaced: true,
    frontmatterPresent: true,
  };
  assert.equal(scoreGate(tape).verdict, "emended");
  tape.truncateFrom = "bottom";
  tape.newestRetained = false;
  tape.newestDiscarded = true;
  tape.supersessionLost = true;
  tape.supersededLoaded = true;
  tape.writeWarned = false;
  tape.budgetSurfaced = false;
  tape.writeReportsSuccess = true;
  assert.equal(scoreGate(tape).verdict, "unretracted");
  tape.truncateFrom = "top";
  tape.newestRetained = true;
  tape.newestDiscarded = false;
  tape.supersessionLost = false;
  tape.supersededLoaded = false;
  tape.writeWarned = true;
  tape.budgetSurfaced = true;
  delete tape.writeReportsSuccess;
  assert.equal(scoreGate(tape).verdict, "emended");
});

test("cousins are cite-only; products stay distinct", () => {
  const cousins = readData("cousins.json");
  assert.equal(cousins.verdict, "cousins");
  assert.deepEqual(
    cousins.cousinsCiteOnly.map((row) => row.issue),
    [25006, 33143, 38452, 39811, 57574],
  );
  assert.equal(COUSINS.length, 5);
  assert.equal(COUSINS[0].issue, 25006);
  assert.equal(COUSINS[0].state, "CLOSED");
  assert.equal(COUSINS[0].citeOnly, true);
  assert.ok(NOT_PRODUCTS.includes("oxbow"));
  assert.ok(NOT_PRODUCTS.includes("recension"));
  assert.ok(NOT_PRODUCTS.includes("setoff"));
  assert.ok(NOT_PRODUCTS.includes("palimpsest"));
  assert.ok(NOT_PRODUCTS.includes("ferrule"));
  assert.ok(NOT_PRODUCTS.includes("ephemera"));
  assert.equal(classify(cousins), "cousins");
});

test("CLI scores fixtures without a server", () => {
  const emended = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/emended.json", import.meta.url))],
    { encoding: "utf8" },
  );
  const unretracted = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/unretracted.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(emended.status, 0, emended.stderr);
  assert.equal(unretracted.status, 0, unretracted.stderr);
  assert.equal(JSON.parse(emended.stdout).verdict, "emended");
  assert.equal(JSON.parse(unretracted.stdout).verdict, "unretracted");
});

test("handle exposes published hypothesis and #92998 headline", () => {
  const result = handle(readData("92998.json"));
  assert.equal(result.published.issue, 92998);
  assert.equal(result.published.lineCap, 200);
  assert.equal(result.published.byteCap, 25000);
  assert.equal(result.published.siloMemories, 199);
  assert.equal(result.published.siloLines, 201);
  assert.equal(result.published.agePruneEligible, 0);
  assert.deepEqual(result.published.cousins, [25006, 33143, 38452, 39811, 57574]);
  assert.match(result.published.hypothesis, /bottom-capped append log/);
  assert.match(
    fingerprint(seedUnretracted()),
    /unretracted\|cut=bottom\|newest=shed\|retract=lost\|write=ok-silent\|warn=later/,
  );
});

test("model has no static node: imports so the living page can score in-browser", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /^import .* from "node:/m);
  assert.match(source, /import\("node:fs"\)/);
});

test("living page is a wax-tablet retract booth, not ferrule / interlock / recension / oxbow / setoff", () => {
  const page = readPage();
  assert.match(page, /Cardo/);
  assert.match(page, /Nunito Sans/);
  assert.match(page, /IBM Plex Mono/);
  assert.match(page, /wax tablet|stylus|scraped|vellum|retract|ink pot|ruling/i);
  assert.match(page, /Score the retract/);
  assert.match(page, /Pin idle emended/);
  assert.match(page, /Pin seeded unretracted/);
  assert.match(page, /Admit emended/);
  assert.match(page, /Load fixtures/);
  assert.match(page, /Reset to emended/);
  assert.match(page, /score unretracted or admit emended/i);
  assert.match(page, /emended/);
  assert.match(page, /unretracted/);
  assert.match(page, /palinoded/);
  assert.match(page, /cousin-not-primary/);
  assert.match(page, /14:50/);
  assert.match(page, /#241/);
  assert.match(page, /#92998/);
  assert.match(page, /200/);
  assert.match(page, /25,000|25000|25k/i);
  assert.doesNotMatch(page, /Oswald|Source Sans 3|Share Tech Mono/);
  assert.doesNotMatch(page, /Chakra Petch|Hind/);
  assert.doesNotMatch(page, /Literata|Public Sans|JetBrains Mono/);
  assert.doesNotMatch(page, /gunmetal|oil-black|cyan instrument/i);
  assert.doesNotMatch(page, /plant-floor|E-stop|hazard stripe|safety yellow/i);
  assert.doesNotMatch(page, /river-ford|watchword|password lodge|indigo bank/i);
  assert.doesNotMatch(page, /collation desk|stemma|\bstereotyped\b|\bcollated\b/i);
  assert.doesNotMatch(page, /abandoned meander/i);
  assert.doesNotMatch(page, /letterpress|tympan|\bladen\b/i);
  assert.match(page, /NOT Oxbow/i);
  assert.match(page, /NOT Recension/i);
  assert.match(page, /NOT Setoff/i);
  assert.match(page, /NOT Ferrule/i);
  assert.doesNotMatch(page, /\bephemeral\b/);
  assert.doesNotMatch(page, /\bferruled\b/);
  assert.doesNotMatch(page, /\binterlocked\b/);
  assert.doesNotMatch(page, /\bpassable\b/);
});

test("README states the thesis, anti-clone, and how to score", () => {
  const readme = readReadme();
  assert.match(readme, /Palinode/);
  assert.match(readme, /#92998/);
  assert.match(readme, /emended/);
  assert.match(readme, /unretracted/);
  assert.match(readme, /palinoded/);
  assert.match(readme, /truncate from the (top|bottom)/i);
  assert.match(readme, /25,000|25000/);
  assert.match(readme, /200/);
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /NOT Oxbow/i);
  assert.match(readme, /NOT Recension/i);
  assert.match(readme, /NOT Setoff/i);
  assert.match(readme, /NOT Palimpsest/i);
  assert.match(readme, /NOT Ferrule/i);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/palinode/);
  assert.match(readme, /node --test projects\/palinode\/palinode\.test\.mjs/);
  assert.match(readme, /NOT leftover woodworking/i);
});

test("catalog lists Palinode unfeatured after Secateurs #242", () => {
  const catalog = readCatalog();
  assert.equal(catalog.products.length, 242);
  assert.equal(catalog.products[0].slug, "secateurs");
  const palinode = catalog.products.find((row) => row.slug === "palinode");
  assert.ok(palinode);
  assert.equal(palinode.featured, false);
  assert.equal(palinode.href, "/palinode/");
  const ferrule = catalog.products.find((row) => row.slug === "ferrule");
  assert.ok(ferrule);
  assert.equal(ferrule.featured, false);
});
