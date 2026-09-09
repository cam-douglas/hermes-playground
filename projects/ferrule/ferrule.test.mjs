import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ALARM,
  BIND_HOST,
  CHIPS,
  CLAMP_WALK,
  CLI_REDIRECT_EXAMPLE,
  COUSINS,
  DESKTOP_VERSION,
  DYNAMIC_COUNT,
  DYNAMIC_START,
  ERROR_CODE,
  ERROR_TEXT,
  EXCLUDED_END,
  EXCLUDED_START,
  FEATURED_ISSUE,
  FILED_AT,
  FORBIDDEN_IDLE,
  FORBIDDEN_SEED,
  HARDCODED_PORT,
  HOLD,
  IDLE_WORD,
  ISSUE_URL,
  LABELS,
  NOT_ERROR,
  NOT_PRODUCTS,
  OS_ASSIGNED_PORT,
  OS_NAME,
  PATH_WORD,
  PLATFORM_SERVICES,
  REPORTER,
  RESERVATION_SERVICES,
  SEEDED_WORD,
  TITLE,
  TRANSPORT,
  VERDICTS,
  VERSION_HASH,
  WORKAROUND_COUNT,
  WORKAROUND_START,
  analyze,
  classify,
  decide,
  eaccesLine,
  emptyTicket,
  errorBlock,
  fingerprint,
  handle,
  portInExcludedRange,
  score,
  scoreGate,
  scoreWalk,
  seedEphemeral,
  seedFerruled,
  seedRebound,
} from "./ferrule.mjs";

function readData(name) {
  return JSON.parse(
    readFileSync(fileURLToPath(new URL(`./data/${name}`, import.meta.url)), "utf8"),
  );
}

function readPage() {
  return readFileSync(fileURLToPath(new URL("./index.html", import.meta.url)), "utf8");
}

function modelPath() {
  return fileURLToPath(new URL("./ferrule.mjs", import.meta.url));
}

test("idle ephemeral is a hold; OS-assigned port 0 / CLI-parity listening", () => {
  const result = analyze(seedEphemeral());
  assert.equal(result.verdict, "ephemeral");
  assert.equal(result.idleWord, "ephemeral");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.ephemeral, true);
  assert.equal(result.phrase, "admit ephemeral");
  assert.equal(result.bindPort, 0);
  assert.equal(result.osAssigned, true);
  assert.equal(result.hardcoded, false);
  assert.equal(result.listening, true);
  assert.equal(result.consentOpened, true);
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(result.idleWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("empty ticket and empty stdin classify ephemeral", () => {
  assert.equal(classify(emptyTicket()), "ephemeral");
  assert.equal(classify(""), "ephemeral");
  assert.equal(classify(null), "ephemeral");
  assert.equal(decide({}), "ephemeral");
});

test("#92968 path scores ferruled from the hardcoded 53280 clamp", () => {
  const result = analyze(seedFerruled());
  assert.equal(result.verdict, "ferruled");
  assert.equal(result.pathWord, "ferruled");
  assert.equal(result.hold, false);
  assert.equal(result.alarm, true);
  assert.equal(result.ferruled, true);
  assert.equal(result.phrase, "score ferruled");
  assert.equal(result.bindPort, HARDCODED_PORT);
  assert.equal(result.hardcoded, true);
  assert.equal(result.excludedCovers, true);
  assert.equal(result.eacces, true);
  assert.equal(result.listening, false);
  assert.equal(result.consentOpened, false);
  for (const word of FORBIDDEN_SEED) {
    assert.notEqual(result.pathWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("fixture toggle flips ephemeral vs ferruled", () => {
  const ephemeral = scoreGate(readData("ephemeral.json"));
  const ferruled = scoreGate(readData("ferruled.json"));
  assert.equal(ephemeral.verdict, "ephemeral");
  assert.equal(ferruled.verdict, "ferruled");
  assert.notEqual(ephemeral.verdict, ferruled.verdict);
  assert.equal(score(readData("ephemeral.json")), "ephemeral");
  assert.equal(score(readData("ferruled.json")), "ferruled");
  assert.equal(score(readData("92968.json")), "ferruled");
});

test("rebound is the seeded recover: bind port 0, redirect from assigned, retry/fallback", () => {
  const result = scoreGate(readData("rebound.json"));
  assert.equal(result.verdict, "rebound");
  assert.equal(result.seededWord, "rebound");
  assert.equal(result.hold, false);
  assert.equal(result.recover, true);
  assert.equal(result.bindPort, 0);
  assert.equal(result.redirectFromAssigned, true);
  assert.equal(result.retry, true);
  assert.equal(result.fallback, true);
  assert.equal(analyze(seedRebound()).verdict, "rebound");
});

test("key fixture rows score their named verdicts", () => {
  assert.equal(classify(readData("hardcoded-53280.json")), "hardcoded-53280");
  assert.equal(classify(readData("excluded-range.json")), "excluded-range");
  assert.equal(classify(readData("eacces-bind.json")), "eacces-bind");
  assert.equal(classify(readData("no-consent.json")), "no-consent");
  assert.equal(classify(readData("no-fallback.json")), "no-fallback");
  assert.equal(classify(readData("no-retry.json")), "no-retry");
  assert.equal(classify(readData("cli-port-0.json")), "cli-port-0");
  assert.equal(classify(readData("cli-parity.json")), "cli-parity");
  assert.equal(classify(readData("winnat-hns.json")), "winnat-hns");
  assert.equal(classify(readData("dynamic-range.json")), "dynamic-range");
  assert.equal(classify(readData("workaround-range.json")), "workaround-range");
  assert.equal(classify(readData("eacces-not-eaddrinuse.json")), "eacces-not-eaddrinuse");
  assert.equal(classify(readData("redirect-from-assigned.json")), "redirect-from-assigned");
  assert.equal(classify(readData("cousins.json")), "cousins");
  assert.equal(classify(readData("before-after.json")), "before-after");
  assert.equal(classify(readData("fixtures.json")), "fixtures");
});

test("published clamp walk scores ferruled after the excluded-range refuse", () => {
  const night = scoreWalk(readData("walk.json"));
  assert.equal(night.verdict, "ferruled");
  assert.ok(night.ferruledCount >= 1);
  const bind = night.rows.find((row) => row.event === "desktop-bind-53280");
  assert.equal(bind.verdict, "ferruled");
  assert.equal(bind.bindPort, HARDCODED_PORT);
  const eacces = night.rows.find((row) => row.event === "eacces-bind");
  assert.equal(eacces.verdict, "ferruled");
  assert.equal(eacces.eacces, true);
  const consent = night.rows.find((row) => row.event === "no-consent");
  assert.equal(consent.verdict, "ferruled");
  assert.equal(consent.consentOpened, false);
  const cli = night.rows.find((row) => row.event === "cli-port-0");
  assert.equal(cli.verdict, "ephemeral");
  assert.equal(cli.bindPort, 0);
  assert.equal(cli.listening, true);
});

test("CLAMP_WALK constant matches the issue ports and range", () => {
  assert.equal(CLAMP_WALK[0].event, "desktop-bind-53280");
  assert.equal(CLAMP_WALK[0].bindPort, 53280);
  const range = CLAMP_WALK.find((row) => row.event === "excluded-covers");
  assert.equal(range.excludedStart, 53249);
  assert.equal(range.excludedEnd, 53348);
  const fail = CLAMP_WALK.find((row) => row.event === "eacces-bind");
  assert.equal(fail.bindError, "EACCES");
  const shut = CLAMP_WALK.find((row) => row.event === "no-consent");
  assert.equal(shut.consentOpened, false);
  const cli = CLAMP_WALK.find((row) => row.event === "cli-port-0");
  assert.equal(cli.bindPort, 0);
  assert.equal(cli.redirectUri, CLI_REDIRECT_EXAMPLE);
});

test("error block reprints the published EACCES shape", () => {
  const block = errorBlock();
  assert.match(block, /listen EACCES: permission denied 127\.0\.0\.1:53280/);
  assert.equal(eaccesLine(), ERROR_TEXT);
  assert.equal(ERROR_CODE, "EACCES");
  assert.equal(NOT_ERROR, "EADDRINUSE");
  assert.ok(portInExcludedRange(53280, 53249, 53348));
  assert.ok(!portInExcludedRange(0, 53249, 53348));
});

test("ferruling 53280 flips ephemeral to ferruled; rebound recovers", () => {
  const tape = {
    bindPort: 0,
    osAssigned: true,
    hardcoded: false,
    listening: true,
    consentOpened: true,
    cliParity: true,
  };
  assert.equal(scoreGate(tape).verdict, "ephemeral");
  tape.bindPort = 53280;
  tape.osAssigned = false;
  tape.hardcoded = true;
  tape.listening = false;
  tape.consentOpened = false;
  tape.eacces = true;
  tape.cliParity = false;
  tape.excludedStart = 53249;
  tape.excludedEnd = 53348;
  assert.equal(scoreGate(tape).verdict, "ferruled");
  tape.bindPort = 0;
  tape.osAssigned = true;
  tape.hardcoded = false;
  tape.listening = true;
  tape.consentOpened = true;
  tape.eacces = false;
  tape.rebound = true;
  tape.redirectFromAssigned = true;
  tape.retry = true;
  tape.fallback = true;
  assert.equal(scoreGate(tape).verdict, "rebound");
});

test("cousins are cite-only; products stay distinct", () => {
  const cousins = readData("cousins.json");
  assert.equal(cousins.verdict, "cousins");
  assert.deepEqual(
    cousins.cousinsCiteOnly.map((row) => row.issue),
    [84795],
  );
  assert.equal(COUSINS.length, 1);
  assert.equal(COUSINS[0].issue, 84795);
  assert.equal(COUSINS[0].state, "CLOSED");
  assert.equal(COUSINS[0].citeOnly, true);
  assert.ok(NOT_PRODUCTS.includes("mailslot"));
  assert.ok(NOT_PRODUCTS.includes("shibboleth"));
  assert.ok(NOT_PRODUCTS.includes("interlock"));
  assert.ok(NOT_PRODUCTS.includes("speakpipe"));
  assert.ok(NOT_PRODUCTS.includes("homestead"));
  assert.equal(classify(cousins), "cousins");
});

test("issue metadata matches #92968", () => {
  assert.equal(FEATURED_ISSUE, 92968);
  assert.ok(ISSUE_URL.includes("92968"));
  assert.match(TITLE, /hardcoded port 53280/);
  assert.ok(LABELS.includes("bug"));
  assert.ok(LABELS.includes("platform:windows"));
  assert.ok(LABELS.includes("area:auth"));
  assert.ok(LABELS.includes("area:mcp"));
  assert.ok(LABELS.includes("area:desktop"));
  assert.ok(HOLD.includes("ephemeral"));
  assert.ok(ALARM.includes("ferruled"));
  assert.ok(CHIPS.includes("rebound"));
  assert.ok(VERDICTS.includes("hardcoded-53280"));
  assert.ok(VERDICTS.includes("excluded-range"));
  assert.ok(VERDICTS.includes("eacces-bind"));
  assert.ok(VERDICTS.includes("cli-port-0"));
  assert.equal(HARDCODED_PORT, 53280);
  assert.equal(OS_ASSIGNED_PORT, 0);
  assert.equal(BIND_HOST, "127.0.0.1");
  assert.equal(EXCLUDED_START, 53249);
  assert.equal(EXCLUDED_END, 53348);
  assert.equal(DYNAMIC_START, 53000);
  assert.equal(DYNAMIC_COUNT, 1000);
  assert.equal(WORKAROUND_START, 54000);
  assert.equal(WORKAROUND_COUNT, 11536);
  assert.equal(DESKTOP_VERSION, "1.49585.0");
  assert.equal(VERSION_HASH, "41ad1d");
  assert.equal(OS_NAME, "Windows");
  assert.equal(REPORTER, "elliotsegler");
  assert.equal(FILED_AT, "2026-09-09T01:51:55Z");
  assert.equal(TRANSPORT, "Streamable HTTP");
  assert.ok(PLATFORM_SERVICES.includes("Hyper-V"));
  assert.ok(PLATFORM_SERVICES.includes("WSL2"));
  assert.ok(PLATFORM_SERVICES.includes("Docker Desktop"));
  assert.ok(RESERVATION_SERVICES.includes("winnat"));
  assert.ok(RESERVATION_SERVICES.includes("hns"));
});

test("CLI scores fixtures without a server", () => {
  const ephemeral = spawnSync(process.execPath, [modelPath(), fileURLToPath(new URL("./data/ephemeral.json", import.meta.url))], { encoding: "utf8" });
  const ferruled = spawnSync(process.execPath, [modelPath(), fileURLToPath(new URL("./data/ferruled.json", import.meta.url))], { encoding: "utf8" });
  assert.equal(ephemeral.status, 0, ephemeral.stderr);
  assert.equal(ferruled.status, 0, ferruled.stderr);
  assert.equal(JSON.parse(ephemeral.stdout).verdict, "ephemeral");
  assert.equal(JSON.parse(ferruled.stdout).verdict, "ferruled");
});

test("handle exposes published hypothesis and EACCES headline", () => {
  const result = handle(readData("92968.json"));
  assert.equal(result.published.issue, 92968);
  assert.equal(result.published.hardcodedPort, 53280);
  assert.equal(result.published.osAssignedPort, 0);
  assert.equal(result.published.excludedStart, 53249);
  assert.equal(result.published.excludedEnd, 53348);
  assert.equal(result.published.cousin, 84795);
  assert.match(result.published.hypothesis, /Desktop binds fixed 53280/);
  assert.match(
    fingerprint(seedFerruled()),
    /ferruled\|port=53280\|clamp=on\|range=hit\|bind=EACCES\|consent=shut/,
  );
});

test("model has no static node: imports so the living page can score in-browser", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /^import .* from "node:/m);
  assert.match(source, /import\("node:fs"\)/);
});

test("living page is a metalwork ferrule booth, not plant-floor or prairie", () => {
  const page = readPage();
  assert.match(page, /Oswald/);
  assert.match(page, /Source Sans 3/);
  assert.match(page, /Share Tech Mono/);
  assert.match(page, /ferrule|clamp|copper|gunmetal|oil-black|cyan/i);
  assert.match(page, /score ferruled or admit ephemeral/i);
  assert.match(page, /rebound/);
  assert.match(page, /53280/);
  assert.match(page, /53249/);
  assert.match(page, /53348/);
  assert.doesNotMatch(page, /Chakra Petch|Hind|IBM Plex Mono/);
  assert.doesNotMatch(page, /Cormorant Infant|Manrope/);
  assert.doesNotMatch(page, /Playfair Display|Figtree|Fira Code/);
  assert.doesNotMatch(page, /Old Standard TT|Work Sans|Ubuntu Mono/);
  assert.doesNotMatch(page, /Literata|Public Sans|JetBrains Mono/);
  assert.doesNotMatch(page, /Newsreader|Lexend|Fragment Mono/);
  assert.doesNotMatch(page, /Ibarra Real Nova|Red Hat Text|Red Hat Mono/);
  assert.doesNotMatch(page, /plant-floor|E-stop|hazard stripe|safety yellow/i);
  assert.doesNotMatch(page, /prairie|land-office|homestead-claim|deed paper|survey stake/);
  assert.doesNotMatch(page, /stonecutter|memorial masonry|epitaph tablet/);
  assert.doesNotMatch(page, /scriptorium|collation desk|iron-gall/);
  assert.doesNotMatch(page, /heat-haze|false oasis/);
  assert.doesNotMatch(page, /river-ford|watchword|password lodge|indigo bank|wet-stone/);
  assert.doesNotMatch(page, /\bpassable\b/);
  assert.doesNotMatch(page, /\badmitted\b/);
  assert.doesNotMatch(page, /\bdeeded\b/);
  assert.doesNotMatch(page, /\bparked\b/);
  assert.doesNotMatch(page, /\bcollated\b/);
  assert.doesNotMatch(page, /\bconfirmed\b/);
  assert.doesNotMatch(page, /\bloosed\b/);
  assert.doesNotMatch(page, /\binterlocked\b/);
  assert.doesNotMatch(page, /\bdetached\b/);
  assert.doesNotMatch(page, /\bshibbolethed\b/);
  assert.doesNotMatch(page, /\bhomesteaded\b/);
  assert.match(page, /#92968/);
  assert.match(page, /13:50/);
});
