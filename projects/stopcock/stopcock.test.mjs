import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ALARM,
  CEILING_HIGH,
  CEILING_LOW,
  CEILING_SPREAD,
  CHIPS,
  CLAUDE_VERSION,
  COUSINS,
  ERROR_CONTENT,
  FEATURED_ISSUE,
  FINGERPRINT_LINES,
  FORBIDDEN_IDLE,
  FORBIDDEN_SEED,
  HOLD,
  IDLE_TIMEOUT_ENV,
  IDLE_TIMEOUT_VALUE,
  IDLE_WORD,
  ISSUE_URL,
  LABELS,
  MEASUREMENTS,
  NOT_PRODUCTS,
  PATH_WORD,
  PER_SERVER_TIMEOUT_MS,
  PHRASE,
  PROGRESS_SECONDS,
  PROTOCOL,
  SEEDED_WORD,
  STATE,
  STOPCOCK_WALK,
  TITLE,
  TOOL,
  TRANSPORT,
  VERDICTS,
  analyze,
  classify,
  decide,
  emptyTicket,
  fingerprint,
  handle,
  score,
  scoreGate,
  scoreWalk,
  seedHardCeiling,
  seedIdleTimeoutZero,
  seedOpen,
  seedOperationTimedOut,
  seedSeated,
  seedServerTimeout24h,
  seedSixMinuteSeat,
  seedStopcock,
  seedStreamableHttp,
  seedTimeoutKnobsIgnored,
  seedToolsCall,
} from "./stopcock.mjs";

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
  return fileURLToPath(new URL("./stopcock.mjs", import.meta.url));
}

test("idle open is a hold; valve stays flowing", () => {
  const result = analyze(seedOpen());
  assert.equal(result.verdict, "open");
  assert.equal(result.idleWord, "open");
  assert.equal(IDLE_WORD, "open");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.open, true);
  assert.equal(result.phrase, "admit open");
  assert.equal(result.valveOpen, true);
  assert.equal(result.hardCeiling, false);
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(result.idleWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("empty ticket and empty stdin classify open", () => {
  assert.equal(classify(emptyTicket()), "open");
  assert.equal(classify(""), "open");
  assert.equal(classify(null), "open");
  assert.equal(decide({}), "open");
});

test("#93143 seeded path scores seated when the hard seat closes the valve", () => {
  const result = analyze(seedSeated());
  assert.equal(result.verdict, "seated");
  assert.equal(result.seededWord, "seated");
  assert.equal(SEEDED_WORD, "seated");
  assert.equal(result.hold, false);
  assert.equal(result.alarm, true);
  assert.equal(result.seated, true);
  assert.equal(result.phrase, "score seated");
  assert.equal(result.hardCeiling, true);
  assert.equal(result.timedOut, true);
  assert.equal(result.isError, true);
  assert.equal(result.knobsHonored, false);
  assert.equal(result.knobsRaised, true);
  assert.equal(result.elapsedSeconds, 363.1);
  for (const word of FORBIDDEN_SEED) {
    assert.notEqual(result.seededWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("path word is stopcock; named stopcock seed holds the path", () => {
  assert.equal(PATH_WORD, "stopcock");
  const result = analyze(seedStopcock());
  assert.equal(result.verdict, "stopcock");
  assert.equal(result.pathWord, "stopcock");
  assert.equal(result.hold, false);
  assert.equal(classify(readData("stopcock.json")), "stopcock");
});

test("ceiling chips: hard-ceiling, six-minute-seat, knobs, idle-zero, 24h, streamable, tools-call, timed-out", () => {
  const ceiling = analyze(seedHardCeiling());
  assert.equal(ceiling.hardCeiling, true);
  assert.equal(ceiling.ceilingLow, CEILING_LOW);
  assert.equal(ceiling.ceilingHigh, CEILING_HIGH);
  assert.equal(classify(readData("hard-ceiling.json")), "hard-ceiling");
  const six = analyze(seedSixMinuteSeat());
  assert.deepEqual([...six.progressSeconds], [300, 330]);
  assert.equal(classify(readData("six-minute-seat.json")), "six-minute-seat");
  const knobs = analyze(seedTimeoutKnobsIgnored());
  assert.equal(knobs.knobsRaised, true);
  assert.equal(knobs.knobsHonored, false);
  assert.equal(classify(readData("timeout-knobs-ignored.json")), "timeout-knobs-ignored");
  const idle = analyze(seedIdleTimeoutZero());
  assert.equal(idle.idleTimeoutValue, 0);
  assert.equal(classify(readData("idle-timeout-zero.json")), "idle-timeout-zero");
  const day = analyze(seedServerTimeout24h());
  assert.equal(day.perServerTimeoutMs, 86400000);
  assert.equal(classify(readData("server-timeout-24h.json")), "server-timeout-24h");
  const http = analyze(seedStreamableHttp());
  assert.equal(http.protocol, "Streamable HTTP");
  assert.equal(classify(readData("streamable-http.json")), "streamable-http");
  const call = analyze(seedToolsCall());
  assert.equal(call.tool, "wait_forever");
  assert.equal(classify(readData("tools-call.json")), "tools-call");
  const abort = analyze(seedOperationTimedOut());
  assert.equal(abort.errorContent, ERROR_CONTENT);
  assert.equal(classify(readData("operation-timed-out.json")), "operation-timed-out");
});

test("fixture toggle flips open vs seated", () => {
  const open = scoreGate(readData("open.json"));
  const seated = scoreGate(readData("seated.json"));
  assert.equal(open.verdict, "open");
  assert.equal(seated.verdict, "seated");
  assert.notEqual(open.verdict, seated.verdict);
  assert.equal(score(readData("open.json")), "open");
  assert.equal(score(readData("seated.json")), "seated");
  assert.equal(score(readData("93143.json")), "seated");
});

test("key fixture rows score their named verdicts", () => {
  assert.equal(classify(readData("hard-ceiling.json")), "hard-ceiling");
  assert.equal(classify(readData("six-minute-seat.json")), "six-minute-seat");
  assert.equal(classify(readData("timeout-knobs-ignored.json")), "timeout-knobs-ignored");
  assert.equal(classify(readData("idle-timeout-zero.json")), "idle-timeout-zero");
  assert.equal(classify(readData("server-timeout-24h.json")), "server-timeout-24h");
  assert.equal(classify(readData("streamable-http.json")), "streamable-http");
  assert.equal(classify(readData("tools-call.json")), "tools-call");
  assert.equal(classify(readData("operation-timed-out.json")), "operation-timed-out");
  assert.equal(classify(readData("has-repro.json")), "has-repro");
  assert.equal(classify(readData("hold.json")), "hold");
  assert.equal(classify(readData("cousins.json")), "cousins");
  assert.equal(classify(readData("fixtures.json")), "fixtures");
  assert.equal(classify(readData("chips.json")), "chips");
  assert.equal(classify(readData("fingerprints.json")), "fingerprints");
  assert.equal(classify(readData("walk.json")), "walk");
});

test("published stopcock walk scores seated after the washer seats", () => {
  const night = scoreWalk({ rows: readData("walk.json").rows });
  assert.equal(night.verdict, "seated");
  assert.ok(night.seatedCount >= 1);
  const idle = night.rows.find((row) => row.event === "cue-open");
  assert.equal(idle.valveOpen, true);
  assert.equal(idle.verdict, "open");
  const ceiling = night.rows.find((row) => row.event === "hard-ceiling");
  assert.equal(ceiling.verdict, "seated");
  assert.equal(ceiling.elapsedSeconds, 363.1);
  const abort = night.rows.find((row) => row.event === "operation-timed-out");
  assert.equal(abort.isError, true);
  assert.equal(abort.errorContent, "The operation timed out.");
  const seat = night.rows.find((row) => row.event === "seated");
  assert.equal(seat.hardCeiling, true);
  const path = night.rows.find((row) => row.event === "stopcock");
  assert.equal(path.verdict, "stopcock");
});

test("STOPCOCK_WALK constant matches the issue ceiling walk", () => {
  assert.equal(STOPCOCK_WALK[0].event, "cue-open");
  const http = STOPCOCK_WALK.find((row) => row.event === "streamable-http");
  assert.equal(http.transport, "http");
  const call = STOPCOCK_WALK.find((row) => row.event === "tools-call");
  assert.equal(call.tool, "wait_forever");
  const day = STOPCOCK_WALK.find((row) => row.event === "server-timeout-24h");
  assert.equal(day.perServerTimeoutMs, 86400000);
  const idle = STOPCOCK_WALK.find((row) => row.event === "idle-timeout-zero");
  assert.equal(idle.idleTimeoutValue, 0);
  const ceiling = STOPCOCK_WALK.find((row) => row.event === "hard-ceiling");
  assert.equal(ceiling.ceilingLow, 352);
  assert.equal(ceiling.ceilingHigh, 363);
  const abort = STOPCOCK_WALK.find((row) => row.event === "operation-timed-out");
  assert.equal(abort.errorContent, "The operation timed out.");
});

test("issue constants encode only #93143 published facts", () => {
  assert.equal(FEATURED_ISSUE, 93143);
  assert.ok(ISSUE_URL.includes("93143"));
  assert.match(TITLE, /Streamable HTTP/);
  assert.match(TITLE, /The operation timed out/);
  assert.equal(STATE, "OPEN");
  assert.ok(LABELS.includes("bug"));
  assert.ok(LABELS.includes("has repro"));
  assert.ok(LABELS.includes("platform:linux"));
  assert.ok(LABELS.includes("area:mcp"));
  assert.equal(CLAUDE_VERSION, "2.1.266");
  assert.equal(TRANSPORT, "http");
  assert.equal(PROTOCOL, "Streamable HTTP");
  assert.equal(TOOL, "wait_forever");
  assert.equal(PER_SERVER_TIMEOUT_MS, 86400000);
  assert.equal(IDLE_TIMEOUT_ENV, "CLAUDE_CODE_MCP_TOOL_IDLE_TIMEOUT");
  assert.equal(IDLE_TIMEOUT_VALUE, 0);
  assert.equal(CEILING_LOW, 352);
  assert.equal(CEILING_HIGH, 363);
  assert.equal(CEILING_SPREAD, 11);
  assert.deepEqual([...MEASUREMENTS], [352, 363.1, 362.5, 357.8]);
  assert.deepEqual([...PROGRESS_SECONDS], [300, 330]);
  assert.equal(ERROR_CONTENT, "The operation timed out.");
  assert.ok(FINGERPRINT_LINES.includes("The operation timed out."));
  assert.match(PHRASE, /seated stopcock/);
  assert.ok(HOLD.includes("open"));
  assert.ok(ALARM.includes("seated"));
  assert.ok(ALARM.includes("stopcock"));
  assert.ok(CHIPS.includes("hard-ceiling"));
  assert.ok(VERDICTS.includes("six-minute-seat"));
  assert.ok(VERDICTS.includes("walk"));
});

test("forbidden idle list includes recent idle and seed words", () => {
  const required = [
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

test("restoring honored knobs flips seated to open", () => {
  const tape = {
    valveOpen: true,
    knobsHonored: true,
    knobsRaised: true,
    hardCeiling: false,
    timedOut: false,
    isError: false,
    cue: "open",
  };
  assert.equal(scoreGate(tape).verdict, "open");
  tape.valveOpen = false;
  tape.knobsHonored = false;
  tape.hardCeiling = true;
  tape.timedOut = true;
  tape.isError = true;
  tape.operationTimedOut = true;
  tape.cue = "seated";
  assert.equal(scoreGate(tape).verdict, "seated");
  tape.valveOpen = true;
  tape.knobsHonored = true;
  tape.hardCeiling = false;
  tape.timedOut = false;
  tape.isError = false;
  tape.operationTimedOut = false;
  tape.cue = "open";
  assert.equal(scoreGate(tape).verdict, "open");
});

test("cousins are cite-only; products stay distinct", () => {
  const cousins = readData("cousins.json");
  assert.equal(cousins.verdict, "cousins");
  assert.deepEqual(
    cousins.cousinsCiteOnly.map((row) => row.issue),
    [50289, 16837],
  );
  assert.equal(COUSINS.length, 2);
  assert.equal(COUSINS[0].issue, 50289);
  assert.equal(COUSINS[1].issue, 16837);
  assert.ok(COUSINS.every((row) => row.citeOnly === true));
  assert.ok(NOT_PRODUCTS.includes("parergon"));
  assert.ok(NOT_PRODUCTS.includes("stereotype"));
  assert.ok(NOT_PRODUCTS.includes("midden"));
  assert.ok(NOT_PRODUCTS.includes("guillotine"));
  assert.ok(NOT_PRODUCTS.includes("clepsydra"));
  assert.ok(NOT_PRODUCTS.includes("fusee"));
  assert.ok(NOT_PRODUCTS.includes("wildcat"));
  assert.ok(NOT_PRODUCTS.includes("snatch"));
  assert.ok(NOT_PRODUCTS.includes("deadman"));
  assert.equal(classify(cousins), "cousins");
});

test("has-repro encodes published linux mcp walk", () => {
  const repro = readData("has-repro.json");
  assert.equal(repro.verdict, "has-repro");
  assert.match(repro.note, /2\.1\.266/);
  assert.match(repro.note, /352/);
  assert.match(repro.note, /Streamable HTTP/);
  assert.equal(classify(repro), "has-repro");
});

test("CLI scores fixtures without a server", () => {
  const open = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/open.json", import.meta.url))],
    { encoding: "utf8" },
  );
  const seated = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/seated.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(open.status, 0, open.stderr);
  assert.equal(seated.status, 0, seated.stderr);
  assert.equal(JSON.parse(open.stdout).verdict, "open");
  assert.equal(JSON.parse(seated.stdout).verdict, "seated");
});

test("handle exposes published hypothesis and #93143 headline", () => {
  const result = handle(readData("93143.json"));
  assert.equal(result.published.issue, 93143);
  assert.equal(result.published.claudeVersion, "2.1.266");
  assert.equal(result.published.perServerTimeoutMs, 86400000);
  assert.equal(result.published.idleTimeoutValue, 0);
  assert.equal(result.published.ceilingLow, 352);
  assert.equal(result.published.ceilingHigh, 363);
  assert.deepEqual(result.published.cousins, [50289, 16837]);
  assert.match(result.published.hypothesis, /360s/);
  assert.match(result.published.hypothesis, /NON-BINDING/);
  assert.match(
    fingerprint(seedSeated()),
    /seated\|knobs=ignored\|ceiling=hard\|call=timed-out/,
  );
});

test("model has no static node: imports so the living page can score in-browser", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /^import .* from "node:/m);
  assert.match(source, /import\("node:fs"\)/);
  assert.doesNotMatch(source, /fetch\(|https?:\/\/api\.|anthropic\.com\/v1/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
});

test("living page is a brass plumbing workshop booth, not a manuscript alcove", () => {
  const page = readPage();
  assert.match(page, /Literata/);
  assert.match(page, /Source Sans 3/);
  assert.match(page, /IBM Plex Mono/);
  assert.match(page, /stopcock|valve|copper|verdigris|workshop/i);
  assert.match(page, /#b87333/);
  assert.match(page, /#c9a227/);
  assert.match(page, /#2d6a5a/);
  assert.match(page, /#1c2128/);
  assert.match(page, /open/);
  assert.match(page, /seated/);
  assert.match(page, /stopcock/);
  assert.match(page, /score seated or admit open/i);
  assert.match(page, /cousin-not-primary/);
  assert.match(page, /02:50/);
  assert.match(page, /#252/);
  assert.match(page, /#93143/);
  assert.match(page, /352/);
  assert.match(page, /363/);
  assert.match(page, /The operation timed out/);
  assert.match(page, /86400000/);
  assert.match(page, /CLAUDE_CODE_MCP_TOOL_IDLE_TIMEOUT/);
  assert.doesNotMatch(page, /Fraunces/);
  assert.doesNotMatch(page, /Instrument Serif/);
  assert.doesNotMatch(page, /Schibsted Grotesk/);
  assert.doesNotMatch(page, /Fragment Mono/);
  assert.doesNotMatch(page, /Alegreya/);
  assert.doesNotMatch(page, /Karla/);
  assert.doesNotMatch(page, /Noto Sans Mono/);
  assert.doesNotMatch(page, /Atkinson Hyperlegible/);
  assert.doesNotMatch(page, /Cormorant Garamond/);
  assert.doesNotMatch(page, /Spectral/);
  assert.doesNotMatch(page, /Cinzel/);
  assert.doesNotMatch(page, /Newsreader|Manrope|JetBrains/);
  assert.doesNotMatch(page, /parchment|iron-gall|vermilion rubric|marginalia/i);
  assert.doesNotMatch(page, /letterpress|stereotype-plate|newsprint/i);
  assert.doesNotMatch(page, /refuse-heap|ash-and-bone|kiln amber/i);
  assert.doesNotMatch(page, /phoropter|Snellen|ophthalmology/i);
  assert.doesNotMatch(page, /green room/i);
  assert.doesNotMatch(page, /flintlock|priming-pan|damp powder/i);
  assert.doesNotMatch(page, /dark oak|steel uprights|crimson rope/i);
  assert.doesNotMatch(page, /water-clock|fusee dial|deck sheave/i);
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
  assert.match(page, /NOT Parergon/i);
  assert.match(page, /NOT Stereotype/i);
  assert.match(page, /NOT Midden/i);
  assert.match(page, /NOT Guillotine/i);
  assert.match(page, /NOT Clepsydra/i);
  assert.match(page, /NOT Fusee/i);
  assert.match(page, /NOT Wildcat/i);
  assert.match(page, /NOT Snatch/i);
  assert.match(page, /NOT Deadman/i);
});

test("README states the thesis, anti-clone, and how to score", () => {
  const readme = readReadme();
  assert.match(readme, /Stopcock/);
  assert.match(readme, /#93143/);
  assert.match(readme, /open/);
  assert.match(readme, /seated/);
  assert.match(readme, /stopcock/);
  assert.match(readme, /Literata/);
  assert.match(readme, /Source Sans 3/);
  assert.match(readme, /IBM Plex Mono/);
  assert.match(readme, /Fraunces was swapped/);
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /NOT Parergon/i);
  assert.match(readme, /NOT Stereotype/i);
  assert.match(readme, /NOT Midden/i);
  assert.match(readme, /NOT Guillotine/i);
  assert.match(readme, /NOT Clepsydra/i);
  assert.match(readme, /NOT Fusee/i);
  assert.match(readme, /NOT Wildcat/i);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/stopcock/);
  assert.match(readme, /node --test projects\/stopcock\/stopcock\.test\.mjs/);
  assert.match(readme, /NOT leftover woodworking/i);
  assert.match(readme, /NON-BINDING/);
});

test("catalog #252 features Stopcock; Parergon stays listed unfeatured", () => {
  const catalog = readCatalog();
  assert.equal(catalog.products.length, 252);
  assert.equal(catalog.products[0].name, "Stopcock");
  assert.equal(catalog.products[0].slug, "stopcock");
  assert.equal(catalog.products[0].featured, true);
  assert.equal(catalog.products[0].href, "/stopcock/");
  assert.equal(catalog.products[0].day, "2026-09-10");
  assert.match(catalog.products[0].summary, /02:50 stopcock/);
  const parergon = catalog.products.find((row) => row.slug === "parergon");
  assert.ok(parergon);
  assert.equal(parergon.featured, false);
  const stereotype = catalog.products.find((row) => row.slug === "stereotype");
  assert.ok(stereotype);
  assert.equal(stereotype.featured, false);
  assert.equal(catalog.products.filter((row) => row.featured).length, 1);
});

test("vercel rewrites stopcock to the project folder at the top", () => {
  const vercel = readVercel();
  assert.equal(vercel.rewrites[0].source, "/stopcock");
  assert.equal(vercel.rewrites[0].destination, "/projects/stopcock");
  assert.equal(vercel.rewrites[1].source, "/stopcock/");
  assert.equal(vercel.rewrites[1].destination, "/projects/stopcock");
});

test("no network calls in the model or tests", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /https?:\/\/api\.anthropic/);
  assert.doesNotMatch(source, /\bcurl\b/);
  assert.doesNotMatch(source, /https?:\/\/[^\s"']*anthropic\.com\/v1/);
});
