import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ALARM,
  API_TIMEOUT_MS,
  AUTHOR,
  CHIPS,
  CLIENT,
  COUSINS,
  DEADAIR_WALK,
  FEATURED_ISSUE,
  FILED,
  FINGERPRINT_LINES,
  FORBIDDEN_IDLE,
  FORBIDDEN_SEED,
  FREQ_AFFECTED,
  FREQ_CLEAN,
  HOLD,
  IDLE_WORD,
  ISSUE_URL,
  KEEPALIVE_S,
  LABELS,
  NODE,
  NOT_PRODUCTS,
  OS,
  PATH_WORD,
  PHRASE,
  RESPONSE_BYTES,
  SEEDED_WORD,
  STATE,
  STREAM_IDLE_S,
  TITLE,
  UPLOADED_BYTES,
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
  seedApiTimeout900s,
  seedCarrier,
  seedCleanBosControl,
  seedDeadair,
  seedEwrColo,
  seedKeepaliveAcked,
  seedNoLogEntry,
  seedQuantizedStalls,
  seedStreamIdle120s,
  seedSquelch,
  seedTimelyResponse,
  seedZeroResponseBytes,
} from "./deadair.mjs";

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
  return fileURLToPath(new URL("./deadair.mjs", import.meta.url));
}

test("idle carrier is a hold; circuit stays live with a timely response", () => {
  const result = analyze(seedCarrier());
  assert.equal(result.verdict, "carrier");
  assert.equal(result.idleWord, "carrier");
  assert.equal(IDLE_WORD, "carrier");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.carrier, true);
  assert.equal(result.phrase, "admit carrier");
  assert.equal(result.timelyResponse, true);
  assert.ok(result.responseBytes > 0);
  assert.equal(result.noLogEntry, false);
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(result.idleWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("empty ticket and empty stdin classify carrier", () => {
  assert.equal(classify(emptyTicket()), "carrier");
  assert.equal(classify(""), "carrier");
  assert.equal(classify(null), "carrier");
  assert.equal(decide({}), "carrier");
});

test("#93155 seeded path scores deadair when TCP is alive and nothing is logged", () => {
  const result = analyze(seedDeadair());
  assert.equal(result.verdict, "deadair");
  assert.equal(result.seededWord, "deadair");
  assert.equal(SEEDED_WORD, "deadair");
  assert.equal(result.hold, false);
  assert.equal(result.alarm, true);
  assert.equal(result.deadair, true);
  assert.equal(result.phrase, "score deadair");
  assert.equal(result.tcpEstablished, true);
  assert.equal(result.keepaliveAcked, true);
  assert.equal(result.responseBytes, 0);
  assert.equal(result.noLogEntry, true);
  assert.equal(result.ewrColo, true);
  for (const word of FORBIDDEN_SEED) {
    assert.notEqual(result.seededWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("path word is squelch; named squelch seed holds the path", () => {
  assert.equal(PATH_WORD, "squelch");
  const result = analyze(seedSquelch());
  assert.equal(result.verdict, "squelch");
  assert.equal(result.pathWord, "squelch");
  assert.equal(result.hold, false);
  assert.equal(classify(readData("squelch.json")), "squelch");
});

test("HOLD includes carrier / timely-response / hold", () => {
  assert.ok(HOLD.includes("carrier"));
  assert.ok(HOLD.includes("timely-response"));
  assert.ok(HOLD.includes("hold"));
  const timely = analyze(seedTimelyResponse());
  assert.equal(timely.verdict, "timely-response");
  assert.equal(timely.hold, true);
  assert.equal(classify(readData("timely-response.json")), "timely-response");
  assert.equal(classify(readData("hold.json")), "hold");
});

test("alarm chips: ewr, keepalive, zero bytes, 900s, no log, quantized, stream-idle, bos", () => {
  const colo = analyze(seedEwrColo());
  assert.equal(colo.ewrColo, true);
  assert.equal(classify(readData("ewr-colo.json")), "ewr-colo");
  const keep = analyze(seedKeepaliveAcked());
  assert.equal(keep.keepaliveAcked, true);
  assert.equal(keep.keepaliveS, KEEPALIVE_S);
  assert.equal(classify(readData("keepalive-acked.json")), "keepalive-acked");
  const zero = analyze(seedZeroResponseBytes());
  assert.equal(zero.responseBytes, 0);
  assert.equal(classify(readData("zero-response-bytes.json")), "zero-response-bytes");
  const clock = analyze(seedApiTimeout900s());
  assert.equal(clock.apiTimeoutMs, API_TIMEOUT_MS);
  assert.equal(classify(readData("api-timeout-900s.json")), "api-timeout-900s");
  const silent = analyze(seedNoLogEntry());
  assert.equal(silent.noLogEntry, true);
  assert.equal(classify(readData("no-log-entry.json")), "no-log-entry");
  const quant = analyze(seedQuantizedStalls());
  assert.equal(quant.quantized, true);
  assert.equal(classify(readData("quantized-stalls.json")), "quantized-stalls");
  const idle = analyze(seedStreamIdle120s());
  assert.equal(idle.streamIdle120, true);
  assert.equal(classify(readData("stream-idle-120s.json")), "stream-idle-120s");
  const bos = analyze(seedCleanBosControl());
  assert.equal(bos.bosControl, true);
  assert.equal(classify(readData("clean-bos-control.json")), "clean-bos-control");
});

test("fixture toggle flips carrier vs deadair", () => {
  const carrier = scoreGate(readData("carrier.json"));
  const deadair = scoreGate(readData("deadair.json"));
  assert.equal(carrier.verdict, "carrier");
  assert.equal(deadair.verdict, "deadair");
  assert.notEqual(carrier.verdict, deadair.verdict);
  assert.equal(score(readData("carrier.json")), "carrier");
  assert.equal(score(readData("deadair.json")), "deadair");
  assert.equal(score(readData("93155.json")), "deadair");
});

test("key fixture rows score their named verdicts", () => {
  assert.equal(classify(readData("ewr-colo.json")), "ewr-colo");
  assert.equal(classify(readData("keepalive-acked.json")), "keepalive-acked");
  assert.equal(classify(readData("zero-response-bytes.json")), "zero-response-bytes");
  assert.equal(classify(readData("api-timeout-900s.json")), "api-timeout-900s");
  assert.equal(classify(readData("no-log-entry.json")), "no-log-entry");
  assert.equal(classify(readData("quantized-stalls.json")), "quantized-stalls");
  assert.equal(classify(readData("stream-idle-120s.json")), "stream-idle-120s");
  assert.equal(classify(readData("clean-bos-control.json")), "clean-bos-control");
  assert.equal(classify(readData("has-repro.json")), "has-repro");
  assert.equal(classify(readData("hold.json")), "hold");
  assert.equal(classify(readData("timely-response.json")), "timely-response");
  assert.equal(classify(readData("cousins.json")), "cousins");
  assert.equal(classify(readData("fixtures.json")), "fixtures");
  assert.equal(classify(readData("chips.json")), "chips");
  assert.equal(classify(readData("fingerprints.json")), "fingerprints");
  assert.equal(classify(readData("walk.json")), "walk");
});

test("published deadair walk scores deadair after the hold floods", () => {
  const night = scoreWalk({ rows: readData("walk.json").rows });
  assert.equal(night.verdict, "deadair");
  assert.ok(night.deadairCount >= 1);
  const idle = night.rows.find((row) => row.event === "cue-carrier");
  assert.equal(idle.timelyResponse, true);
  assert.equal(idle.verdict, "carrier");
  const zero = night.rows.find((row) => row.event === "zero-response-bytes");
  assert.equal(zero.responseBytes, 0);
  const keep = night.rows.find((row) => row.event === "keepalive-acked");
  assert.equal(keep.keepaliveS, 63.5);
  const colo = night.rows.find((row) => row.event === "ewr-colo");
  assert.equal(colo.ewrColo, true);
  const clock = night.rows.find((row) => row.event === "api-timeout-900s");
  assert.equal(clock.apiTimeoutMs, 900000);
  const silent = night.rows.find((row) => row.event === "no-log-entry");
  assert.equal(silent.noLogEntry, true);
  const air = night.rows.find((row) => row.event === "deadair");
  assert.equal(air.responseBytes, 0);
  const path = night.rows.find((row) => row.event === "squelch");
  assert.equal(path.verdict, "squelch");
});

test("DEADAIR_WALK constant matches the issue stall walk", () => {
  assert.equal(DEADAIR_WALK[0].event, "cue-carrier");
  const zero = DEADAIR_WALK.find((row) => row.event === "zero-response-bytes");
  assert.equal(zero.responseBytes, 0);
  const keep = DEADAIR_WALK.find((row) => row.event === "keepalive-acked");
  assert.equal(keep.keepaliveS, 63.5);
  const colo = DEADAIR_WALK.find((row) => row.event === "ewr-colo");
  assert.equal(colo.affectedPath, "Spectrum IPv6 → Cloudflare EWR");
  const clock = DEADAIR_WALK.find((row) => row.event === "api-timeout-900s");
  assert.equal(clock.apiTimeoutMs, 900000);
  const silent = DEADAIR_WALK.find((row) => row.event === "no-log-entry");
  assert.equal(silent.logRetries, 0);
  const bos = DEADAIR_WALK.find((row) => row.event === "clean-bos-control");
  assert.equal(bos.cleanPath, "T-Mobile → BOS");
  const idle = DEADAIR_WALK.find((row) => row.event === "stream-idle-120s");
  assert.equal(idle.streamIdleS, 120.0);
});

test("issue constants encode only #93155 published facts", () => {
  assert.equal(FEATURED_ISSUE, 93155);
  assert.ok(ISSUE_URL.includes("93155"));
  assert.match(TITLE, /Requests silently stall for 900s/);
  assert.equal(STATE, "OPEN");
  assert.ok(LABELS.includes("bug"));
  assert.ok(LABELS.includes("has repro"));
  assert.ok(LABELS.includes("platform:windows"));
  assert.ok(LABELS.includes("area:networking"));
  assert.equal(AUTHOR, "dehuman8");
  assert.equal(FILED, "2026-09-09");
  assert.match(CLIENT, /2\.1\.260/);
  assert.match(CLIENT, /claude-desktop/);
  assert.equal(OS, "Windows 11 Pro 26200");
  assert.equal(NODE, "24.18.1");
  assert.equal(API_TIMEOUT_MS, 900000);
  assert.equal(UPLOADED_BYTES, 907582);
  assert.equal(RESPONSE_BYTES, 0);
  assert.equal(KEEPALIVE_S, 63.5);
  assert.equal(STREAM_IDLE_S, 120.0);
  assert.equal(FREQ_AFFECTED, "3/1000");
  assert.equal(FREQ_CLEAN, "0/4485");
  assert.ok(FINGERPRINT_LINES.includes("API_TIMEOUT_MS=900000"));
  assert.match(PHRASE, /not a carrier/);
  assert.ok(HOLD.includes("carrier"));
  assert.ok(ALARM.includes("deadair"));
  assert.ok(ALARM.includes("squelch"));
  assert.ok(CHIPS.includes("ewr-colo"));
  assert.ok(VERDICTS.includes("walk"));
});

test("forbidden idle list includes recent idle and seed words", () => {
  const required = [
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
    "lacuna",
    "hangfire",
    "afterimage",
    "remora",
  ];
  for (const word of required) {
    assert.ok(FORBIDDEN_IDLE.includes(word), `missing forbidden idle ${word}`);
  }
});

test("restoring timely response flips deadair to carrier", () => {
  const tape = {
    timelyResponse: true,
    timeoutLogged: true,
    tcpEstablished: true,
    keepaliveAcked: true,
    responseBytes: 2048,
    noLogEntry: false,
    ewrColo: false,
    cue: "carrier",
  };
  assert.equal(scoreGate(tape).verdict, "carrier");
  tape.timelyResponse = false;
  tape.timeoutLogged = false;
  tape.responseBytes = 0;
  tape.noLogEntry = true;
  tape.ewrColo = true;
  tape.cue = "deadair";
  assert.equal(scoreGate(tape).verdict, "deadair");
  tape.timelyResponse = true;
  tape.timeoutLogged = true;
  tape.responseBytes = 2048;
  tape.noLogEntry = false;
  tape.ewrColo = false;
  tape.cue = "carrier";
  assert.equal(scoreGate(tape).verdict, "carrier");
});

test("cousins are cite-only; products stay distinct", () => {
  const cousins = readData("cousins.json");
  assert.equal(cousins.verdict, "cousins");
  assert.deepEqual(
    cousins.cousinsCiteOnly.map((row) => row.issue),
    [93120, 87424, 74544, 90764, 91970, 90964, 32982],
  );
  assert.equal(COUSINS.length, 7);
  assert.equal(COUSINS[0].issue, 93120);
  assert.equal(COUSINS[6].issue, 32982);
  assert.ok(COUSINS.every((row) => row.citeOnly === true));
  assert.ok(NOT_PRODUCTS.includes("scuttle"));
  assert.ok(NOT_PRODUCTS.includes("stopcock"));
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

test("has-repro encodes published windows networking walk", () => {
  const repro = readData("has-repro.json");
  assert.equal(repro.verdict, "has-repro");
  assert.match(repro.note, /2\.1\.260/);
  assert.match(repro.note, /Windows 11 Pro 26200/);
  assert.match(repro.note, /EWR/);
  assert.equal(classify(repro), "has-repro");
});

test("CLI scores fixtures without a server", () => {
  const carrier = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/carrier.json", import.meta.url))],
    { encoding: "utf8" },
  );
  const deadair = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/deadair.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(carrier.status, 0, carrier.stderr);
  assert.equal(deadair.status, 0, deadair.stderr);
  assert.equal(JSON.parse(carrier.stdout).verdict, "carrier");
  assert.equal(JSON.parse(deadair.stdout).verdict, "deadair");
});

test("handle exposes published hypothesis and #93155 headline", () => {
  const result = handle(readData("93155.json"));
  assert.equal(result.published.issue, 93155);
  assert.equal(result.published.client, "Claude Code 2.1.260 (claude-desktop)");
  assert.equal(result.published.apiTimeoutMs, 900000);
  assert.equal(result.published.uploadedBytes, 907582);
  assert.equal(result.published.responseBytes, 0);
  assert.equal(result.published.keepaliveS, 63.5);
  assert.deepEqual(result.published.cousins, [
    93120, 87424, 74544, 90764, 91970, 90964, 32982,
  ]);
  assert.match(result.published.hypothesis, /Established TCP socket/);
  assert.match(result.published.hypothesis, /NON-BINDING/);
  assert.match(
    fingerprint(seedDeadair()),
    /deadair\|timely=no\|keepalive=acked\|rx=0\|log=none/,
  );
});

test("model has no static node: imports so the living page can score in-browser", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /^import .* from "node:/m);
  assert.match(source, /import\("node:fs"\)/);
  assert.doesNotMatch(source, /fetch\(|https?:\/\/api\.|anthropic\.com\/v1/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
});

test("living page is a radio broadcast booth, not a naval shipyard", () => {
  const page = readPage();
  assert.match(page, /Oswald/);
  assert.match(page, /Source Sans 3/);
  assert.match(page, /Share Tech Mono/);
  assert.match(page, /ON.?AIR|on-air|onair/i);
  assert.match(page, /VU|vu-meter|vu meter/i);
  assert.match(page, /copper|grille/i);
  assert.match(page, /#d0121a|#e10600|#c41e3a|#ff2a33/i);
  assert.match(page, /#e8a317|#f5a623|#ffbf00|#e8a31/i);
  assert.match(page, /#6ee87a|#39ff14|#3dcc7a|#7dff9a/i);
  assert.match(page, /carrier/);
  assert.match(page, /deadair/);
  assert.match(page, /squelch/);
  assert.match(page, /score deadair or admit carrier/i);
  assert.match(page, /cousin-not-primary/);
  assert.match(page, /05:50/);
  assert.match(page, /#254/);
  assert.match(page, /#93155/);
  assert.match(page, /API_TIMEOUT_MS/);
  assert.match(page, /900000|900s/);
  assert.match(page, /EWR/);
  assert.match(page, /BOS/);
  assert.match(page, /907/);
  assert.doesNotMatch(page, /DM Serif Display/);
  assert.doesNotMatch(page, /Lexend/);
  assert.doesNotMatch(page, /JetBrains Mono/);
  assert.doesNotMatch(page, /Literata/);
  assert.doesNotMatch(page, /IBM Plex Mono/);
  assert.doesNotMatch(page, /Instrument Serif/);
  assert.doesNotMatch(page, /Schibsted Grotesk/);
  assert.doesNotMatch(page, /Fragment Mono/);
  assert.doesNotMatch(page, /Alegreya/);
  assert.doesNotMatch(page, /Karla/);
  assert.doesNotMatch(page, /Noto Sans Mono/);
  assert.doesNotMatch(page, /Fraunces/);
  assert.doesNotMatch(page, /Atkinson Hyperlegible/);
  assert.doesNotMatch(page, /Cormorant Garamond/);
  assert.doesNotMatch(page, /Spectral/);
  assert.doesNotMatch(page, /Cinzel/);
  assert.doesNotMatch(page, /Newsreader|Manrope|Figtree|Playfair|Outfit|Cardo|Bitter|Roboto Mono/);
  assert.doesNotMatch(page, /#ff4d14/);
  assert.doesNotMatch(page, /#071422/);
  assert.doesNotMatch(page, /#1a5c48/);
  assert.doesNotMatch(page, /#c4a05a/);
  assert.doesNotMatch(page, /#b87333/);
  assert.doesNotMatch(page, /#c9a227/);
  assert.doesNotMatch(page, /#2d6a5a/);
  assert.doesNotMatch(page, /porthole|bilge|teak|floodlight|shipyard/i);
  assert.doesNotMatch(page, /parchment|iron-gall|vermilion rubric|marginalia/i);
  assert.doesNotMatch(page, /letterpress|stereotype-plate|newsprint/i);
  assert.doesNotMatch(page, /refuse-heap|ash-and-bone|kiln amber/i);
  assert.doesNotMatch(page, /phoropter|Snellen|ophthalmology/i);
  assert.doesNotMatch(page, /green room/i);
  assert.doesNotMatch(page, /flintlock|priming-pan|damp powder/i);
  assert.doesNotMatch(page, /dark oak|steel uprights|crimson rope/i);
  assert.doesNotMatch(page, /water-clock|fusee dial|deck sheave/i);
  assert.doesNotMatch(page, /brass plumbing|copper-pipe|valve wheel|verdigris/i);
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
  assert.match(page, /NOT Scuttle/i);
  assert.match(page, /NOT Stopcock/i);
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
  assert.match(readme, /Dead Air/);
  assert.match(readme, /#93155/);
  assert.match(readme, /carrier/);
  assert.match(readme, /deadair/);
  assert.match(readme, /squelch/);
  assert.match(readme, /Oswald/);
  assert.match(readme, /Source Sans 3/);
  assert.match(readme, /Share Tech Mono/);
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /NOT Scuttle/i);
  assert.match(readme, /NOT Stopcock/i);
  assert.match(readme, /NOT Parergon/i);
  assert.match(readme, /NOT Stereotype/i);
  assert.match(readme, /NOT Midden/i);
  assert.match(readme, /NOT Guillotine/i);
  assert.match(readme, /NOT Clepsydra/i);
  assert.match(readme, /NOT Fusee/i);
  assert.match(readme, /NOT Wildcat/i);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/deadair/);
  assert.match(readme, /node --test projects\/deadair\/deadair\.test\.mjs/);
  assert.match(readme, /NOT leftover woodworking/i);
  assert.match(readme, /NON-BINDING/);
});

test("catalog #254 features Dead Air; Scuttle stays listed unfeatured", () => {
  const catalog = readCatalog();
  assert.equal(catalog.products.length, 254);
  assert.equal(catalog.products[0].name, "Dead Air");
  assert.equal(catalog.products[0].slug, "deadair");
  assert.equal(catalog.products[0].featured, true);
  assert.equal(catalog.products[0].href, "/deadair/");
  assert.equal(catalog.products[0].day, "2026-09-10");
  assert.match(catalog.products[0].summary, /05:50/);
  assert.match(catalog.products[0].summary, /radio broadcast/);
  assert.match(catalog.products[0].summary, /#93155/);
  const scuttle = catalog.products.find((row) => row.slug === "scuttle");
  assert.ok(scuttle);
  assert.equal(scuttle.featured, false);
  const stopcock = catalog.products.find((row) => row.slug === "stopcock");
  assert.ok(stopcock);
  assert.equal(stopcock.featured, false);
  assert.equal(catalog.products.filter((row) => row.featured).length, 1);
});

test("vercel rewrites deadair to the project folder at the top", () => {
  const vercel = readVercel();
  assert.equal(vercel.rewrites[0].source, "/deadair");
  assert.equal(vercel.rewrites[0].destination, "/projects/deadair");
  assert.equal(vercel.rewrites[1].source, "/deadair/");
  assert.equal(vercel.rewrites[1].destination, "/projects/deadair");
});

test("no network calls in the model or tests", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /https?:\/\/api\.anthropic/);
  assert.doesNotMatch(source, /\bcurl\b/);
  assert.doesNotMatch(source, /https?:\/\/[^\s"']*anthropic\.com\/v1/);
});
