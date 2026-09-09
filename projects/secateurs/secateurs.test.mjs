import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ALARM,
  CHIPS,
  COUSINS,
  DOCUMENTED_LINE_DEFAULT,
  EVIDENCE_CHARS,
  EVIDENCE_LINES,
  FEATURED_ISSUE,
  FILED_AT,
  FORBIDDEN_IDLE,
  FORBIDDEN_SEED,
  HOLD,
  IDLE_WORD,
  ISSUE_URL,
  LABELS,
  MARKER_EXAMPLE,
  NOT_PRODUCTS,
  PATH_WORD,
  REPORTER,
  SEEDED_WORD,
  SNIP_WALK,
  STATE,
  TITLE,
  VERDICTS,
  analyze,
  classify,
  decide,
  emptyTicket,
  fingerprint,
  handle,
  linesMarker,
  score,
  scoreGate,
  scoreWalk,
  seedSecateured,
  seedSheared,
  seedUnshorn,
} from "./secateurs.mjs";

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
  return fileURLToPath(new URL("./secateurs.mjs", import.meta.url));
}

test("idle unshorn is a hold; whole file or showing lines X–Y of Z", () => {
  const result = analyze(seedUnshorn());
  assert.equal(result.verdict, "unshorn");
  assert.equal(result.idleWord, "unshorn");
  assert.equal(IDLE_WORD, "unshorn");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.unshorn, true);
  assert.equal(result.phrase, "admit unshorn");
  assert.equal(result.wholeFile, true);
  assert.equal(result.truncationMarked, true);
  assert.equal(result.silentPartial, false);
  assert.equal(result.unreadTail, false);
  assert.equal(result.guardrailLost, false);
  assert.equal(result.documentedDefaultEnforced, true);
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(result.idleWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("empty ticket and empty stdin classify unshorn", () => {
  assert.equal(classify(emptyTicket()), "unshorn");
  assert.equal(classify(""), "unshorn");
  assert.equal(classify(null), "unshorn");
  assert.equal(decide({}), "unshorn");
});

test("#92979 seeded path scores sheared from silent partial + unread tail", () => {
  const result = analyze(seedSheared());
  assert.equal(result.verdict, "sheared");
  assert.equal(result.seededWord, "sheared");
  assert.equal(SEEDED_WORD, "sheared");
  assert.equal(result.hold, false);
  assert.equal(result.alarm, true);
  assert.equal(result.sheared, true);
  assert.equal(result.phrase, "score sheared");
  assert.equal(result.silentPartial, true);
  assert.equal(result.unreadTail, true);
  assert.equal(result.guardrailLost, true);
  assert.equal(result.operatorNoticed, false);
  assert.equal(result.documentedDefaultEnforced, false);
  assert.equal(result.fullRead1400, true);
  assert.equal(result.lineCount, 1400);
  assert.equal(result.charCount, 65800);
  for (const word of FORBIDDEN_SEED) {
    assert.notEqual(result.seededWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("path word is secateured; named secateured seed holds the path", () => {
  assert.equal(PATH_WORD, "secateured");
  const result = analyze(seedSecateured());
  assert.equal(result.verdict, "secateured");
  assert.equal(result.pathWord, "secateured");
  assert.equal(result.hold, false);
  assert.equal(classify(readData("secateured.json")), "secateured");
});

test("fixture toggle flips unshorn vs sheared", () => {
  const unshorn = scoreGate(readData("unshorn.json"));
  const sheared = scoreGate(readData("sheared.json"));
  assert.equal(unshorn.verdict, "unshorn");
  assert.equal(sheared.verdict, "sheared");
  assert.notEqual(unshorn.verdict, sheared.verdict);
  assert.equal(score(readData("unshorn.json")), "unshorn");
  assert.equal(score(readData("sheared.json")), "sheared");
  assert.equal(score(readData("92979.json")), "sheared");
});

test("key fixture rows score their named verdicts", () => {
  assert.equal(classify(readData("silent-partial.json")), "silent-partial");
  assert.equal(classify(readData("unread-tail.json")), "unread-tail");
  assert.equal(classify(readData("guardrail-loss.json")), "guardrail-loss");
  assert.equal(classify(readData("no-operator-notice.json")), "no-operator-notice");
  assert.equal(classify(readData("documented-2000-not-enforced.json")), "documented-2000-not-enforced");
  assert.equal(classify(readData("full-read-1400.json")), "full-read-1400");
  assert.equal(classify(readData("lines-x-y-of-z.json")), "lines-x-y-of-z");
  assert.equal(classify(readData("offset-limit.json")), "offset-limit");
  assert.equal(classify(readData("has-repro.json")), "has-repro");
  assert.equal(classify(readData("hold.json")), "hold");
  assert.equal(classify(readData("cousins.json")), "cousins");
  assert.equal(classify(readData("fixtures.json")), "fixtures");
  assert.equal(classify(readData("chips.json")), "chips");
  assert.equal(classify(readData("fingerprints.json")), "fingerprints");
  assert.equal(classify(readData("walk.json")), "walk");
});

test("published snip walk scores sheared after silent tip-cut sheds the unread tail", () => {
  const night = scoreWalk({ rows: readData("walk.json").rows });
  assert.equal(night.verdict, "sheared");
  assert.ok(night.shearedCount >= 1);
  const evidence = night.rows.find((row) => row.event === "full-read-1400");
  assert.equal(evidence.lineCount, 1400);
  assert.equal(evidence.charCount, 65800);
  assert.equal(evidence.documentedDefaultEnforced, false);
  const snip = night.rows.find((row) => row.event === "silent-partial");
  assert.equal(snip.verdict, "sheared");
  assert.equal(snip.silentPartial, true);
  const tail = night.rows.find((row) => row.event === "unread-tail");
  assert.equal(tail.verdict, "sheared");
  assert.equal(tail.unreadTail, true);
  const lost = night.rows.find((row) => row.event === "guardrail-loss");
  assert.equal(lost.verdict, "sheared");
  assert.equal(lost.guardrailLost, true);
  const notice = night.rows.find((row) => row.event === "no-operator-notice");
  assert.equal(notice.verdict, "sheared");
  assert.equal(notice.operatorNoticed, false);
});

test("SNIP_WALK constant matches the issue Read path", () => {
  assert.equal(SNIP_WALK[0].event, "full-read-1400");
  assert.equal(SNIP_WALK[0].lineCount, 1400);
  assert.equal(SNIP_WALK[0].charCount, 65800);
  assert.equal(SNIP_WALK[0].documentedDefaultEnforced, false);
  const snip = SNIP_WALK.find((row) => row.event === "silent-partial");
  assert.equal(snip.silentPartial, true);
  const tail = SNIP_WALK.find((row) => row.event === "unread-tail");
  assert.equal(tail.unreadTail, true);
  const lost = SNIP_WALK.find((row) => row.event === "guardrail-loss");
  assert.equal(lost.guardrailLost, true);
  const notice = SNIP_WALK.find((row) => row.event === "no-operator-notice");
  assert.equal(notice.operatorNoticed, false);
});

test("issue constants encode only #92979 published facts", () => {
  assert.equal(FEATURED_ISSUE, 92979);
  assert.ok(ISSUE_URL.includes("92979"));
  assert.match(TITLE, /silently returns partial content/);
  assert.match(TITLE, /2,000-line default not enforced/);
  assert.equal(STATE, "OPEN");
  assert.ok(LABELS.includes("bug"));
  assert.ok(LABELS.includes("area:tools"));
  assert.equal(DOCUMENTED_LINE_DEFAULT, 2000);
  assert.equal(EVIDENCE_CHARS, 65800);
  assert.equal(EVIDENCE_LINES, 1400);
  assert.equal(REPORTER, "UNIVAC-Colonel-Panic");
  assert.equal(FILED_AT, "2026-09-09T02:55:37Z");
  assert.match(MARKER_EXAMPLE, /showing lines/);
  assert.match(MARKER_EXAMPLE, /use offset\/limit/);
  assert.equal(linesMarker(), MARKER_EXAMPLE);
  assert.ok(HOLD.includes("unshorn"));
  assert.ok(ALARM.includes("sheared"));
  assert.ok(ALARM.includes("secateured"));
  assert.ok(CHIPS.includes("silent-partial"));
  assert.ok(VERDICTS.includes("unread-tail"));
  assert.ok(VERDICTS.includes("guardrail-loss"));
  assert.ok(VERDICTS.includes("documented-2000-not-enforced"));
  assert.ok(VERDICTS.includes("full-read-1400"));
  assert.ok(VERDICTS.includes("lines-x-y-of-z"));
  assert.ok(VERDICTS.includes("walk"));
});

test("silent partial flips unshorn to sheared; marked truncation recovers", () => {
  const tape = {
    wholeFile: true,
    truncationMarked: true,
    silentPartial: false,
    unreadTail: false,
    guardrailLost: false,
    operatorNoticed: true,
    documentedDefaultEnforced: true,
  };
  assert.equal(scoreGate(tape).verdict, "unshorn");
  tape.wholeFile = false;
  tape.truncationMarked = false;
  tape.silentPartial = true;
  tape.unreadTail = true;
  tape.guardrailLost = true;
  tape.operatorNoticed = false;
  tape.documentedDefaultEnforced = false;
  tape.treatsAsWhole = true;
  tape.partialReturn = true;
  assert.equal(scoreGate(tape).verdict, "sheared");
  tape.wholeFile = false;
  tape.truncationMarked = true;
  tape.silentPartial = false;
  tape.unreadTail = false;
  tape.guardrailLost = false;
  tape.operatorNoticed = true;
  tape.documentedDefaultEnforced = true;
  tape.treatsAsWhole = false;
  tape.partialReturn = true;
  tape.marker = linesMarker();
  assert.equal(scoreGate(tape).verdict, "unshorn");
});

test("cousins are cite-only; products stay distinct", () => {
  const cousins = readData("cousins.json");
  assert.equal(cousins.verdict, "cousins");
  assert.deepEqual(
    cousins.cousinsCiteOnly.map((row) => row.issue),
    [6910, 28783, 22699],
  );
  assert.equal(COUSINS.length, 3);
  assert.equal(COUSINS[0].issue, 6910);
  assert.equal(COUSINS[0].state, "CLOSED");
  assert.equal(COUSINS[0].citeOnly, true);
  assert.ok(NOT_PRODUCTS.includes("palinode"));
  assert.ok(NOT_PRODUCTS.includes("ferrule"));
  assert.ok(NOT_PRODUCTS.includes("interlock"));
  assert.ok(NOT_PRODUCTS.includes("ephemera"));
  assert.ok(NOT_PRODUCTS.includes("oubliette"));
  assert.equal(classify(cousins), "cousins");
});

test("CLI scores fixtures without a server", () => {
  const unshorn = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/unshorn.json", import.meta.url))],
    { encoding: "utf8" },
  );
  const sheared = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/sheared.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(unshorn.status, 0, unshorn.stderr);
  assert.equal(sheared.status, 0, sheared.stderr);
  assert.equal(JSON.parse(unshorn.stdout).verdict, "unshorn");
  assert.equal(JSON.parse(sheared.stdout).verdict, "sheared");
});

test("handle exposes published hypothesis and #92979 headline", () => {
  const result = handle(readData("92979.json"));
  assert.equal(result.published.issue, 92979);
  assert.equal(result.published.documentedLineDefault, 2000);
  assert.equal(result.published.evidenceChars, 65800);
  assert.equal(result.published.evidenceLines, 1400);
  assert.deepEqual(result.published.cousins, [6910, 28783, 22699]);
  assert.match(result.published.hypothesis, /fail-loud truncation\/EOF contract/);
  assert.match(
    fingerprint(seedSheared()),
    /sheared\|snip=silent\|tail=unread\|guard=lost\|notice=none\|cap=unenforced/,
  );
});

test("model has no static node: imports so the living page can score in-browser", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /^import .* from "node:/m);
  assert.match(source, /import\("node:fs"\)/);
});

test("living page is a garden bypass-secateurs booth, not palinode / ferrule / interlock", () => {
  const page = readPage();
  assert.match(page, /Bitter/);
  assert.match(page, /Figtree/);
  assert.match(page, /Roboto Mono/);
  assert.match(page, /bypass|secateurs|pruning|cane|wooden handle|steel blade/i);
  assert.match(page, /Score the snip/);
  assert.match(page, /Pin idle unshorn/);
  assert.match(page, /Pin seeded sheared/);
  assert.match(page, /Admit unshorn/);
  assert.match(page, /Load fixtures/);
  assert.match(page, /Reset to unshorn/);
  assert.match(page, /score sheared or admit unshorn/i);
  assert.match(page, /unshorn/);
  assert.match(page, /sheared/);
  assert.match(page, /secateured/);
  assert.match(page, /cousin-not-primary/);
  assert.match(page, /15:50/);
  assert.match(page, /#242/);
  assert.match(page, /#92979/);
  assert.match(page, /2,000|2000/);
  assert.match(page, /1,400|1400/);
  assert.match(page, /65,800|65800/);
  assert.doesNotMatch(page, /Cardo|Nunito Sans|IBM Plex Mono/);
  assert.doesNotMatch(page, /Oswald|Source Sans 3|Share Tech Mono/);
  assert.doesNotMatch(page, /Chakra Petch|\bHind\b/);
  assert.doesNotMatch(page, /Literata|Public Sans|JetBrains Mono/);
  assert.doesNotMatch(page, /wax tablet|stylus|scraped|vellum|ink pot|ruling/i);
  assert.doesNotMatch(page, /gunmetal|oil-black|cyan instrument/i);
  assert.doesNotMatch(page, /plant-floor|E-stop|hazard stripe|safety yellow/i);
  assert.doesNotMatch(page, /river-ford|watchword|password lodge|indigo bank/i);
  assert.doesNotMatch(page, /collation desk|stemma|\bstereotyped\b|\bcollated\b/i);
  assert.doesNotMatch(page, /\bemended\b/);
  assert.doesNotMatch(page, /\bunretracted\b/);
  assert.doesNotMatch(page, /\bpalinoded\b/);
  assert.match(page, /NOT Palinode/i);
  assert.match(page, /NOT Ferrule/i);
  assert.match(page, /NOT Interlock/i);
});

test("README states the thesis, anti-clone, and how to score", () => {
  const readme = readReadme();
  assert.match(readme, /Secateurs/);
  assert.match(readme, /#92979/);
  assert.match(readme, /unshorn/);
  assert.match(readme, /sheared/);
  assert.match(readme, /secateured/);
  assert.match(readme, /silent partial/i);
  assert.match(readme, /2,000|2000/);
  assert.match(readme, /1,400|1400/);
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /NOT Palinode/i);
  assert.match(readme, /NOT Ferrule/i);
  assert.match(readme, /NOT Interlock/i);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/secateurs/);
  assert.match(readme, /node --test projects\/secateurs\/secateurs\.test\.mjs/);
  assert.match(readme, /NOT leftover woodworking/i);
});

test("catalog #242 features Secateurs; Palinode stays listed unfeatured", () => {
  const catalog = readCatalog();
  assert.equal(catalog.products.length, 242);
  assert.equal(catalog.products[0].name, "Secateurs");
  assert.equal(catalog.products[0].slug, "secateurs");
  assert.equal(catalog.products[0].featured, true);
  assert.equal(catalog.products[0].href, "/secateurs/");
  const palinode = catalog.products.find((row) => row.slug === "palinode");
  assert.ok(palinode);
  assert.equal(palinode.featured, false);
});
