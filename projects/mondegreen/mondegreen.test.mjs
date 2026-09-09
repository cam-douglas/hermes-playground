import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  AGENT_TRIGGER,
  ALARM,
  AUTHOR,
  BACKUPS,
  CHIPS,
  COUSINS,
  FALSE_POSITIVE_WORDS,
  FEATURED_ISSUE,
  FILED,
  FINGERPRINT_LINES,
  FORBIDDEN_IDLE,
  FORBIDDEN_SEED,
  HOLD,
  IDLE_WORD,
  ISOLATION,
  ISSUE_URL,
  LABELS,
  MONDEGREEN_LINE,
  MONDEGREEN_WALK,
  NOT_PRODUCTS,
  PATH_WORD,
  PHRASE,
  PUBLISHED_LYRIC,
  REFUSAL,
  REPRO_BODY,
  SEEDED_WORD,
  STATE,
  SUBSTRING,
  TITLE,
  TRIGGER_WORD,
  VERDICTS,
  WORK_COMMAND,
  analyze,
  classify,
  commandWords,
  compareScanners,
  decide,
  emptyTicket,
  fingerprint,
  handle,
  highlightSubstring,
  scanSubstring,
  scanTokens,
  scanWordBoundary,
  score,
  scoreGate,
  scoreWalk,
  seedBashRefused,
  seedCommandWord,
  seedInteractiveOk,
  seedIsolationWorktree,
  seedLegitimateProse,
  seedMondegreen,
  seedParsed,
  seedSubstringScan,
  seedTokenized,
  seedTooComplex,
  seedWordBoundary,
} from "./mondegreen.mjs";

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

function readVercel() {
  return JSON.parse(
    readFileSync(fileURLToPath(new URL("../../vercel.json", import.meta.url)), "utf8"),
  );
}

function modelPath() {
  return fileURLToPath(new URL("./mondegreen.mjs", import.meta.url));
}

test("idle tokenized is a hold; word-boundary / command-position", () => {
  const result = analyze(seedTokenized());
  assert.equal(result.verdict, "tokenized");
  assert.equal(result.idleWord, "tokenized");
  assert.equal(IDLE_WORD, "tokenized");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.tokenized, true);
  assert.equal(result.phrase, "admit tokenized");
  assert.equal(result.commandPosition, true);
  assert.equal(result.wordBoundary, true);
  assert.equal(result.substringScan, false);
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(result.idleWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("empty ticket and empty stdin classify tokenized", () => {
  assert.equal(classify(emptyTicket()), "tokenized");
  assert.equal(classify(""), "tokenized");
  assert.equal(classify(null), "tokenized");
  assert.equal(decide({}), "tokenized");
});

test("#93193 seeded path scores mondegreen when substring hears git inside legitimate", () => {
  const result = analyze(seedMondegreen());
  assert.equal(result.verdict, "mondegreen");
  assert.equal(result.seededWord, "mondegreen");
  assert.equal(SEEDED_WORD, "mondegreen");
  assert.equal(result.hold, false);
  assert.equal(result.alarm, true);
  assert.equal(result.mondegreen, true);
  assert.equal(result.phrase, "score mondegreen");
  assert.equal(result.isolationWorktree, true);
  assert.equal(result.substringScan, true);
  assert.equal(result.legitimateProse, true);
  assert.equal(result.bashRefused, true);
  for (const word of FORBIDDEN_SEED) {
    assert.notEqual(result.seededWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("path word is parsed; named parsed seed holds the path", () => {
  assert.equal(PATH_WORD, "parsed");
  const result = analyze(seedParsed());
  assert.equal(result.verdict, "parsed");
  assert.equal(result.pathWord, "parsed");
  assert.equal(result.hold, false);
  assert.equal(classify(readData("parsed.json")), "parsed");
});

test("HOLD includes tokenized / command-word / hold / word-boundary", () => {
  assert.ok(HOLD.includes("tokenized"));
  assert.ok(HOLD.includes("command-word"));
  assert.ok(HOLD.includes("hold"));
  assert.ok(HOLD.includes("word-boundary"));
  const command = analyze(seedCommandWord());
  assert.equal(command.verdict, "command-word");
  assert.equal(command.hold, true);
  assert.equal(classify(readData("command-word.json")), "command-word");
  assert.equal(classify(readData("hold.json")), "hold");
  const boundary = analyze(seedWordBoundary());
  assert.equal(boundary.verdict, "word-boundary");
  assert.equal(boundary.hold, true);
  assert.equal(classify(readData("word-boundary.json")), "word-boundary");
});

test("alarm chips: isolation, substring, legitimate, refused, complex, interactive", () => {
  const isolation = analyze(seedIsolationWorktree());
  assert.equal(isolation.isolationWorktree, true);
  assert.equal(classify(readData("isolation-worktree.json")), "isolation-worktree");
  const scan = analyze(seedSubstringScan());
  assert.equal(scan.substringScan, true);
  assert.equal(classify(readData("substring-scan.json")), "substring-scan");
  const lyric = analyze(seedLegitimateProse());
  assert.equal(lyric.legitimateProse, true);
  assert.equal(classify(readData("legitimate-prose.json")), "legitimate-prose");
  const refused = analyze(seedBashRefused());
  assert.equal(refused.bashRefused, true);
  assert.equal(classify(readData("bash-refused.json")), "bash-refused");
  const complex = analyze(seedTooComplex());
  assert.equal(complex.tooComplex, true);
  assert.equal(classify(readData("too-complex.json")), "too-complex");
  const interactive = analyze(seedInteractiveOk());
  assert.equal(interactive.interactiveOk, true);
  assert.equal(classify(readData("interactive-ok.json")), "interactive-ok");
});

test("fixture toggle flips tokenized vs mondegreen", () => {
  const tokenized = scoreGate(readData("tokenized.json"));
  const mondegreen = scoreGate(readData("mondegreen.json"));
  assert.equal(tokenized.verdict, "tokenized");
  assert.equal(mondegreen.verdict, "mondegreen");
  assert.notEqual(tokenized.verdict, mondegreen.verdict);
  assert.equal(score(readData("tokenized.json")), "tokenized");
  assert.equal(score(readData("mondegreen.json")), "mondegreen");
  assert.equal(score(readData("93193.json")), "mondegreen");
});

test("key fixture rows score their named verdicts", () => {
  assert.equal(classify(readData("isolation-worktree.json")), "isolation-worktree");
  assert.equal(classify(readData("substring-scan.json")), "substring-scan");
  assert.equal(classify(readData("legitimate-prose.json")), "legitimate-prose");
  assert.equal(classify(readData("bash-refused.json")), "bash-refused");
  assert.equal(classify(readData("too-complex.json")), "too-complex");
  assert.equal(classify(readData("interactive-ok.json")), "interactive-ok");
  assert.equal(classify(readData("has-repro.json")), "has-repro");
  assert.equal(classify(readData("hold.json")), "hold");
  assert.equal(classify(readData("command-word.json")), "command-word");
  assert.equal(classify(readData("word-boundary.json")), "word-boundary");
  assert.equal(classify(readData("cousins.json")), "cousins");
  assert.equal(classify(readData("backups.json")), "backups");
  assert.equal(classify(readData("fixtures.json")), "fixtures");
  assert.equal(classify(readData("chips.json")), "chips");
  assert.equal(classify(readData("fingerprints.json")), "fingerprints");
  assert.equal(classify(readData("walk.json")), "walk");
});

test("published mondegreen walk scores mondegreen after the hold floods", () => {
  const night = scoreWalk({ rows: readData("walk.json").rows });
  assert.equal(night.verdict, "mondegreen");
  assert.ok(night.mondegreenCount >= 1);
  const idle = night.rows.find((row) => row.event === "cue-tokenized");
  assert.equal(idle.tokenized, true);
  assert.equal(idle.verdict, "tokenized");
  const isolation = night.rows.find((row) => row.event === "isolation-worktree");
  assert.equal(isolation.isolationWorktree, true);
  const lyric = night.rows.find((row) => row.event === "legitimate-prose");
  assert.equal(lyric.triggerWord, "legitimate");
  const scan = night.rows.find((row) => row.event === "substring-scan");
  assert.equal(scan.substringScan, true);
  const refused = night.rows.find((row) => row.event === "bash-refused");
  assert.equal(refused.bashRefused, true);
  const complex = night.rows.find((row) => row.event === "too-complex");
  assert.equal(complex.noGitInvocation, true);
  const hear = night.rows.find((row) => row.event === "mondegreen");
  assert.equal(hear.substringScan, true);
  const path = night.rows.find((row) => row.event === "parsed");
  assert.equal(path.verdict, "parsed");
});

test("MONDEGREEN_WALK constant matches the issue mishearing walk", () => {
  assert.equal(MONDEGREEN_WALK[0].event, "cue-tokenized");
  const isolation = MONDEGREEN_WALK.find((row) => row.event === "isolation-worktree");
  assert.equal(isolation.agentTrigger, 'Agent tool call with isolation: "worktree"');
  const lyric = MONDEGREEN_WALK.find((row) => row.event === "legitimate-prose");
  assert.equal(lyric.triggerWord, "legitimate");
  const scan = MONDEGREEN_WALK.find((row) => row.event === "substring-scan");
  assert.equal(scan.substringScan, true);
  const hear = MONDEGREEN_WALK.find((row) => row.event === "mondegreen");
  assert.equal(hear.bashRefused, true);
  const path = MONDEGREEN_WALK.find((row) => row.event === "parsed");
  assert.equal(path.parsed, true);
});

test("issue constants encode only #93193 published facts", () => {
  assert.equal(FEATURED_ISSUE, 93193);
  assert.ok(ISSUE_URL.includes("93193"));
  assert.match(TITLE, /substring "git"/);
  assert.equal(STATE, "OPEN");
  assert.ok(LABELS.includes("bug"));
  assert.ok(LABELS.includes("has repro"));
  assert.ok(LABELS.includes("area:agents"));
  assert.ok(LABELS.includes("area:sandbox"));
  assert.equal(AUTHOR, "sohailbm-kandaq");
  assert.equal(FILED, "2026-09-09T20:28:08Z");
  assert.equal(ISOLATION, "worktree");
  assert.match(AGENT_TRIGGER, /isolation: "worktree"/);
  assert.match(REFUSAL, /too complex to verify/);
  assert.equal(TRIGGER_WORD, "legitimate");
  assert.equal(SUBSTRING, "git");
  assert.match(PUBLISHED_LYRIC, /legitimate/);
  assert.match(MONDEGREEN_LINE, /legitimate/);
  assert.match(WORK_COMMAND, /python3 scripts\/work\.py update/);
  assert.match(REPRO_BODY, /legitimate status update/);
  assert.ok(FINGERPRINT_LINES.includes("legitimate"));
  assert.ok(FALSE_POSITIVE_WORDS.includes("digit"));
  assert.ok(FALSE_POSITIVE_WORDS.includes("legitimize"));
  assert.match(PHRASE, /hears git inside legitimate/);
  assert.ok(HOLD.includes("tokenized"));
  assert.ok(ALARM.includes("mondegreen"));
  assert.ok(ALARM.includes("parsed"));
  assert.ok(CHIPS.includes("substring-scan"));
  assert.ok(VERDICTS.includes("walk"));
  assert.ok(VERDICTS.includes("backups"));
});

test("forbidden idle list includes recent idle and seed words", () => {
  const required = [
    "locked",
    "scratched",
    "derby",
    "unmasked",
    "vizard",
    "precedence",
    "carrier",
    "deadair",
    "squelch",
    "moored",
    "scuttled",
    "scuttle",
    "open",
    "seated",
    "stopcock",
    "preserved",
    "discarded",
    "fresh",
    "stamped",
    "cleared",
    "mounded",
    "distinct",
    "conflated",
    "held",
    "steered",
    "raised",
    "fallen",
    "sterling",
    "primed",
    "lodged",
    "parergon",
    "stereotype",
  ];
  for (const word of required) {
    assert.ok(FORBIDDEN_IDLE.includes(word), `missing forbidden idle ${word}`);
  }
});

test("restoring command-position tokenization flips mondegreen to tokenized", () => {
  const tape = {
    tokenized: true,
    commandPosition: true,
    wordBoundary: true,
    isolationWorktree: false,
    substringScan: false,
    legitimateProse: false,
    bashRefused: false,
    cue: "tokenized",
  };
  assert.equal(scoreGate(tape).verdict, "tokenized");
  tape.tokenized = false;
  tape.commandPosition = false;
  tape.wordBoundary = false;
  tape.isolationWorktree = true;
  tape.substringScan = true;
  tape.legitimateProse = true;
  tape.bashRefused = true;
  tape.cue = "mondegreen";
  assert.equal(scoreGate(tape).verdict, "mondegreen");
  tape.tokenized = true;
  tape.commandPosition = true;
  tape.wordBoundary = true;
  tape.isolationWorktree = false;
  tape.substringScan = false;
  tape.legitimateProse = false;
  tape.bashRefused = false;
  tape.cue = "tokenized";
  assert.equal(scoreGate(tape).verdict, "tokenized");
});

test("substring ear false-hears git inside ordinary English; token ear does not", () => {
  assert.equal(scanSubstring("legitimate"), true);
  assert.equal(scanTokens("echo legitimate"), false);
  assert.equal(scanWordBoundary("legitimate"), false);
  assert.equal(compareScanners(MONDEGREEN_LINE).mondegreen, true);
  assert.equal(compareScanners(MONDEGREEN_LINE).substringHit, true);
  assert.equal(compareScanners(MONDEGREEN_LINE).tokenHit, false);
  for (const word of FALSE_POSITIVE_WORDS) {
    assert.equal(scanSubstring(word), true, `substring should hear git in ${word}`);
    assert.equal(scanTokens(`printf ${word}`), false, `token should ignore ${word}`);
  }
  assert.equal(scanTokens("git status"), true);
  assert.equal(scanTokens("foo && git push"), true);
  assert.equal(scanTokens("$(git rev-parse --git-dir)"), true);
  assert.equal(scanTokens('python3 scripts/work.py update TX "status_update=this is a legitimate status update"'), false);
  assert.ok(commandWords("sudo git status").includes("git"));
  const hits = highlightSubstring("legitimate");
  assert.equal(hits.length, 1);
  assert.equal(hits[0].host, "legitimate");
});

test("cousins are cite-only; products stay distinct; backups stay data-only", () => {
  const cousins = readData("cousins.json");
  assert.equal(cousins.verdict, "cousins");
  assert.deepEqual(
    cousins.cousinsCiteOnly.map((row) => row.issue),
    [92586, 92112, 93197],
  );
  assert.equal(COUSINS.length, 3);
  assert.equal(COUSINS[0].issue, 92586);
  assert.equal(COUSINS[2].issue, 93197);
  assert.ok(COUSINS.every((row) => row.citeOnly === true));
  assert.ok(NOT_PRODUCTS.includes("derby"));
  assert.ok(NOT_PRODUCTS.includes("vizard"));
  assert.ok(NOT_PRODUCTS.includes("deadair"));
  assert.ok(NOT_PRODUCTS.includes("seizing"));
  assert.ok(NOT_PRODUCTS.includes("holdfast"));
  assert.ok(NOT_PRODUCTS.includes("springe"));
  assert.ok(NOT_PRODUCTS.includes("guillotine"));
  assert.equal(classify(cousins), "cousins");
  const backups = readData("backups.json");
  assert.equal(backups.verdict, "backups");
  assert.deepEqual(
    backups.backupsCiteOnly.map((row) => row.issue),
    [93173, 93182, 93218],
  );
  assert.equal(BACKUPS.length, 3);
  assert.equal(BACKUPS[0].issue, 93173);
  assert.equal(classify(backups), "backups");
});

test("has-repro encodes published isolation:worktree walk", () => {
  const repro = readData("has-repro.json");
  assert.equal(repro.verdict, "has-repro");
  assert.match(repro.note, /isolation/);
  assert.match(repro.note, /legitimate/);
  assert.match(repro.note, /sohailbm-kandaq/);
  assert.equal(classify(repro), "has-repro");
});

test("CLI scores fixtures without a server", () => {
  const tokenized = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/tokenized.json", import.meta.url))],
    { encoding: "utf8" },
  );
  const mondegreen = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/mondegreen.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(tokenized.status, 0, tokenized.stderr);
  assert.equal(mondegreen.status, 0, mondegreen.stderr);
  assert.equal(JSON.parse(tokenized.stdout).verdict, "tokenized");
  assert.equal(JSON.parse(mondegreen.stdout).verdict, "mondegreen");
});

test("handle exposes published hypothesis and #93193 headline", () => {
  const result = handle(readData("93193.json"));
  assert.equal(result.published.issue, 93193);
  assert.equal(result.published.isolation, "worktree");
  assert.equal(result.published.triggerWord, "legitimate");
  assert.match(result.published.workCommand, /python3 scripts\/work\.py update/);
  assert.deepEqual(result.published.cousins, [92586, 92112, 93197]);
  assert.deepEqual(result.published.backups, [93173, 93182, 93218]);
  assert.match(result.published.hypothesis, /substring scan/);
  assert.match(result.published.hypothesis, /NON-BINDING/);
  assert.match(
    fingerprint(seedMondegreen()),
    /mondegreen\|iso=worktree\|ear=substring\|lyric=legitimate\|bash=refused\|verify=complex/,
  );
});

test("model has no static node: imports so the living page can score in-browser", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /^import .* from "node:/m);
  assert.match(source, /import\("node:fs"\)/);
  assert.doesNotMatch(source, /fetch\(|https?:\/\/api\.|anthropic\.com\/v1/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
});

test("living page is a ballad-sheet lyric studio, not a racecourse or masquerade", () => {
  const page = readPage();
  assert.match(page, /Cormorant Garamond/);
  assert.match(page, /Outfit/);
  assert.match(page, /Space Mono/);
  assert.match(page, /ballad|lyric|mondegreen|staff|broadside/i);
  assert.match(page, /#120e18|#1b1526|#241c32/);
  assert.match(page, /#d4b46a|#c45a78|#7eb8a4/);
  assert.match(page, /#e8dcc8|#d8c8b0|#9a8b78/);
  assert.match(page, /tokenized/);
  assert.match(page, /mondegreen/);
  assert.match(page, /parsed/);
  assert.match(page, /score mondegreen or admit tokenized/i);
  assert.match(page, /cousin-not-primary/);
  assert.match(page, /09:50/);
  assert.match(page, /#257/);
  assert.match(page, /#93193/);
  assert.match(page, /legitimate/);
  assert.match(page, /isolation: "worktree"/);
  assert.match(page, /too complex to verify/);
  assert.match(page, /python3 scripts\/work\.py update/);
  assert.doesNotMatch(page, /Bodoni Moda/);
  assert.doesNotMatch(page, /Manrope/);
  assert.doesNotMatch(page, /IBM Plex Mono/);
  assert.doesNotMatch(page, /Cinzel/);
  assert.doesNotMatch(page, /Karla/);
  assert.doesNotMatch(page, /Azeret Mono/);
  assert.doesNotMatch(page, /Oswald/);
  assert.doesNotMatch(page, /Source Sans 3/);
  assert.doesNotMatch(page, /Share Tech Mono/);
  assert.doesNotMatch(page, /DM Serif Display/);
  assert.doesNotMatch(page, /Lexend/);
  assert.doesNotMatch(page, /JetBrains Mono/);
  assert.doesNotMatch(page, /Literata/);
  assert.doesNotMatch(page, /Instrument Serif/);
  assert.doesNotMatch(page, /Schibsted Grotesk/);
  assert.doesNotMatch(page, /Fragment Mono/);
  assert.doesNotMatch(page, /Alegreya/);
  assert.doesNotMatch(page, /Noto Sans Mono/);
  assert.doesNotMatch(page, /Fraunces/);
  assert.doesNotMatch(page, /Atkinson Hyperlegible/);
  assert.doesNotMatch(page, /Spectral/);
  assert.doesNotMatch(page, /Newsreader|Figtree|Playfair|Cardo|Bitter|Roboto Mono/);
  assert.doesNotMatch(page, /#ff4d14/);
  assert.doesNotMatch(page, /#071422/);
  assert.doesNotMatch(page, /#1a5c48/);
  assert.doesNotMatch(page, /#c4a05a/);
  assert.doesNotMatch(page, /#d0121a/);
  assert.doesNotMatch(page, /#e8a317/);
  assert.doesNotMatch(page, /#6ee87a/);
  assert.doesNotMatch(page, /#121212/);
  assert.doesNotMatch(page, /#b87333/);
  assert.doesNotMatch(page, /#c9a227/);
  assert.doesNotMatch(page, /#2d6a5a/);
  assert.doesNotMatch(page, /#2a0814/);
  assert.doesNotMatch(page, /#7a1428/);
  assert.doesNotMatch(page, /#e6c36a/);
  assert.doesNotMatch(page, /#f3ead6/);
  assert.doesNotMatch(page, /#14110c/);
  assert.doesNotMatch(page, /#3d6b2a/);
  assert.doesNotMatch(page, /#8b1538/);
  assert.doesNotMatch(page, /#e8c547/);
  assert.doesNotMatch(page, /ON.?AIR|vu-meter|copper mic/i);
  assert.doesNotMatch(page, /porthole|bilge|teak|floodlight|shipyard/i);
  assert.doesNotMatch(page, /iron-gall|vermilion rubric|marginalia/i);
  assert.doesNotMatch(page, /letterpress|stereotype-plate|newsprint/i);
  assert.doesNotMatch(page, /refuse-heap|ash-and-bone|kiln amber/i);
  assert.doesNotMatch(page, /phoropter|Snellen|ophthalmology/i);
  assert.doesNotMatch(page, /green room/i);
  assert.doesNotMatch(page, /flintlock|priming-pan|damp powder/i);
  assert.doesNotMatch(page, /dark oak|steel uprights|crimson rope/i);
  assert.doesNotMatch(page, /water-clock|fusee dial|deck sheave/i);
  assert.doesNotMatch(page, /brass plumbing|copper-pipe|valve wheel|verdigris/i);
  assert.doesNotMatch(page, /masquerade|filigree|vizard atelier/i);
  assert.doesNotMatch(page, /racecourse|starting-gate|photo-finish|paddock|silk/i);
  assert.doesNotMatch(page, /millimeter-slider|woodworking leftover/i);
  assert.doesNotMatch(page, /\bcarrier\b/);
  assert.doesNotMatch(page, /\bdeadair\b/);
  assert.doesNotMatch(page, /\bsquelch\b/);
  assert.doesNotMatch(page, /\bmoored\b/);
  assert.doesNotMatch(page, /\bscuttled\b/);
  assert.doesNotMatch(page, /\bpreserved\b/);
  assert.doesNotMatch(page, /\bdiscarded\b/);
  assert.doesNotMatch(page, /\bfresh\b/);
  assert.doesNotMatch(page, /\bstamped\b/);
  assert.doesNotMatch(page, /\bcleared\b/);
  assert.doesNotMatch(page, /\bmounded\b/);
  assert.doesNotMatch(page, /\bdistinct\b/);
  assert.doesNotMatch(page, /\bconflated\b/);
  assert.doesNotMatch(page, /\bheld\b/);
  assert.doesNotMatch(page, /\bsteered\b/);
  assert.doesNotMatch(page, /\braised\b/);
  assert.doesNotMatch(page, /\bfallen\b/);
  assert.doesNotMatch(page, /\bscaffold\b/);
  assert.doesNotMatch(page, /\bsterling\b/);
  assert.doesNotMatch(page, /\bdebased\b/);
  assert.doesNotMatch(page, /\bprimed\b/);
  assert.doesNotMatch(page, /\bflashed\b/);
  assert.doesNotMatch(page, /\blodged\b/);
  assert.doesNotMatch(page, /\bbypassed\b/);
  assert.doesNotMatch(page, /\bgreenroomed\b/);
  assert.doesNotMatch(page, /\bdiplopic\b/);
  assert.doesNotMatch(page, /\bseated\b/);
  assert.doesNotMatch(page, /\bstopcock\b/);
  assert.doesNotMatch(page, /\bunmasked\b/);
  assert.doesNotMatch(page, /\bvizard\b/);
  assert.doesNotMatch(page, /\bprecedence\b/);
  assert.doesNotMatch(page, /\blocked\b/);
  assert.doesNotMatch(page, /\bscratched\b/);
  assert.doesNotMatch(page, /\bderby\b/);
  assert.match(page, /NOT Derby/i);
  assert.match(page, /NOT Vizard/i);
  assert.match(page, /NOT Dead Air/i);
  assert.match(page, /NOT Scuttle/i);
  assert.match(page, /NOT Stopcock/i);
  assert.match(page, /NOT Parergon/i);
  assert.match(page, /NOT Stereotype/i);
  assert.match(page, /NOT Midden/i);
  assert.match(page, /NOT Guillotine/i);
  assert.match(page, /NOT Seizing/i);
  assert.match(page, /NOT Holdfast/i);
  assert.match(page, /NOT Springe/i);
  assert.match(page, /NOT Understudy/i);
  assert.match(page, /NOT Mirage/i);
});

test("README states the thesis, anti-clone, and how to score", () => {
  const readme = readReadme();
  assert.match(readme, /Mondegreen/);
  assert.match(readme, /#93193/);
  assert.match(readme, /tokenized/);
  assert.match(readme, /mondegreen/);
  assert.match(readme, /parsed/);
  assert.match(readme, /Cormorant Garamond/);
  assert.match(readme, /Outfit/);
  assert.match(readme, /Space Mono/);
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /NOT Derby/i);
  assert.match(readme, /NOT Vizard/i);
  assert.match(readme, /NOT Dead Air/i);
  assert.match(readme, /NOT Seizing/i);
  assert.match(readme, /NOT Holdfast/i);
  assert.match(readme, /NOT Springe/i);
  assert.match(readme, /NOT Guillotine/i);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/mondegreen/);
  assert.match(readme, /node --test projects\/mondegreen\/mondegreen\.test\.mjs/);
  assert.match(readme, /NOT leftover woodworking/i);
  assert.match(readme, /NON-BINDING/);
});

test("catalog #257 features Mondegreen; Derby stays listed unfeatured", () => {
  const catalog = readCatalog();
  assert.equal(catalog.products.length, 257);
  assert.equal(catalog.products[0].name, "Mondegreen");
  assert.equal(catalog.products[0].slug, "mondegreen");
  assert.equal(catalog.products[0].featured, true);
  assert.equal(catalog.products[0].href, "/mondegreen/");
  assert.equal(catalog.products[0].day, "2026-09-10");
  assert.match(catalog.products[0].summary, /09:50/);
  assert.match(catalog.products[0].summary, /mondegreen/);
  assert.match(catalog.products[0].summary, /#93193/);
  assert.match(catalog.products[0].summary, /tokenized/);
  const derby = catalog.products.find((row) => row.slug === "derby");
  assert.ok(derby);
  assert.equal(derby.featured, false);
  const vizard = catalog.products.find((row) => row.slug === "vizard");
  assert.ok(vizard);
  assert.equal(vizard.featured, false);
  assert.equal(catalog.products.filter((row) => row.featured).length, 1);
  assert.equal(catalog.products.filter((row) => row.slug === "mondegreen").length, 1);
});

test("vercel rewrites mondegreen to the project folder at the top", () => {
  const vercel = readVercel();
  assert.equal(vercel.rewrites[0].source, "/mondegreen");
  assert.equal(vercel.rewrites[0].destination, "/projects/mondegreen");
  assert.equal(vercel.rewrites[1].source, "/mondegreen/");
  assert.equal(vercel.rewrites[1].destination, "/projects/mondegreen");
});

test("no network calls in the model or tests", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /https?:\/\/api\.anthropic/);
  assert.doesNotMatch(source, /\bcurl\b/);
  assert.doesNotMatch(source, /https?:\/\/[^\s"']*anthropic\.com\/v1/);
});
