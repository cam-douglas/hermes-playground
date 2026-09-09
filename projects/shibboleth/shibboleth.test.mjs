import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ALARM,
  AUTH,
  CHIPS,
  CLIENT_KEY,
  COUSINS,
  CURL_HITS,
  CURL_URL,
  DOCTOR_DETAIL,
  DOCTOR_HEADLINE,
  ENV_VARS_UNSET,
  ERROR_BODY,
  ERROR_PHRASE,
  FEATURED_ISSUE,
  FILED_AT,
  FORBIDDEN_IDLE,
  FORBIDDEN_SEED,
  GATE_WALK,
  HOLD,
  HTTP_STATUS,
  IDLE_WORD,
  ISSUE_URL,
  LABELS,
  NOT_PRODUCTS,
  OS_NAME,
  PATH_WORD,
  REPORTER,
  SEEDED_WORD,
  TITLE,
  VERDICTS,
  VERSION,
  analyze,
  classify,
  curlLine,
  decide,
  emptyTicket,
  errorBlock,
  fingerprint,
  handle,
  score,
  scoreGate,
  scoreWalk,
  seedAdmitted,
  seedCountersigned,
  seedShibbolethed,
} from "./shibboleth.mjs";

function readData(name) {
  return JSON.parse(
    readFileSync(fileURLToPath(new URL(`./data/${name}`, import.meta.url)), "utf8"),
  );
}

function readPage() {
  return readFileSync(fileURLToPath(new URL("./index.html", import.meta.url)), "utf8");
}

function modelPath() {
  return fileURLToPath(new URL("./shibboleth.mjs", import.meta.url));
}

test("idle admitted is a hold; key accepted, flags load, Remote Control open", () => {
  const result = analyze(seedAdmitted());
  assert.equal(result.verdict, "admitted");
  assert.equal(result.idleWord, "admitted");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.admitted, true);
  assert.equal(result.phrase, "admit admitted");
  assert.equal(result.keyAccepted, true);
  assert.ok(result.flagsLoaded > 0);
  assert.equal(result.remoteControlEligible, true);
  assert.equal(result.doctorUnreachable, false);
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(result.idleWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("empty ticket and empty stdin classify admitted", () => {
  assert.equal(classify(emptyTicket()), "admitted");
  assert.equal(classify(""), "admitted");
  assert.equal(classify(null), "admitted");
  assert.equal(decide({}), "admitted");
});

test("#92966 path scores shibbolethed from the rejected watchword", () => {
  const result = analyze(seedShibbolethed());
  assert.equal(result.verdict, "shibbolethed");
  assert.equal(result.pathWord, "shibbolethed");
  assert.equal(result.hold, false);
  assert.equal(result.alarm, true);
  assert.equal(result.shibbolethed, true);
  assert.equal(result.phrase, "score shibbolethed");
  assert.equal(result.keyAccepted, false);
  assert.equal(result.httpStatus, 400);
  assert.equal(result.invalidApiKey, true);
  assert.equal(result.flagsLoaded, 0);
  assert.equal(result.doctorUnreachable, true);
  assert.equal(result.remoteControlClosed, true);
  assert.equal(result.clientKey, CLIENT_KEY);
  assert.equal(result.curlHits, CURL_HITS);
  for (const word of FORBIDDEN_SEED) {
    assert.notEqual(result.pathWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("fixture toggle flips admitted vs shibbolethed", () => {
  const admitted = scoreGate(readData("admitted.json"));
  const shibbolethed = scoreGate(readData("shibbolethed.json"));
  assert.equal(admitted.verdict, "admitted");
  assert.equal(shibbolethed.verdict, "shibbolethed");
  assert.notEqual(admitted.verdict, shibbolethed.verdict);
  assert.equal(score(readData("admitted.json")), "admitted");
  assert.equal(score(readData("shibbolethed.json")), "shibbolethed");
  assert.equal(score(readData("92966.json")), "shibbolethed");
});

test("countersigned is the rotated key with an honest Invalid-API-Key surface", () => {
  const result = scoreGate(readData("countersigned.json"));
  assert.equal(result.verdict, "countersigned");
  assert.equal(result.seededWord, "countersigned");
  assert.equal(result.hold, false);
  assert.equal(result.recover, true);
  assert.equal(result.keyAccepted, true);
  assert.equal(result.keyRotated, true);
  assert.equal(result.honestSurface, true);
  assert.ok(result.flagsLoaded > 0);
  assert.equal(result.remoteControlEligible, true);
  assert.equal(analyze(seedCountersigned()).verdict, "countersigned");
});

test("key fixture rows score their named verdicts", () => {
  assert.equal(classify(readData("invalid-api-key.json")), "invalid-api-key");
  assert.equal(classify(readData("zero-flags.json")), "zero-flags");
  assert.equal(classify(readData("doctor-unreachable.json")), "doctor-unreachable");
  assert.equal(classify(readData("remote-control-closed.json")), "remote-control-closed");
  assert.equal(classify(readData("channels-dark.json")), "channels-dark");
  assert.equal(classify(readData("key-hardcoded.json")), "key-hardcoded");
  assert.equal(classify(readData("curl-400.json")), "curl-400");
  assert.equal(classify(readData("cousins.json")), "cousins");
  assert.equal(classify(readData("before-after.json")), "before-after");
  assert.equal(classify(readData("fixtures.json")), "fixtures");
  assert.equal(classify(readData("proxy-ruled-out.json")), "proxy-ruled-out");
  assert.equal(classify(readData("env-ruled-out.json")), "env-ruled-out");
});

test("published gate walk scores shibbolethed at the closed ford", () => {
  const night = scoreWalk(readData("walk.json"));
  assert.equal(night.verdict, "shibbolethed");
  assert.ok(night.shibbolethedCount >= 1);
  const gate = night.rows.find((row) => row.event === "remote-control-closed");
  assert.equal(gate.verdict, "shibbolethed");
  assert.equal(gate.httpStatus, 400);
  assert.equal(gate.flagsLoaded, 0);
  const doctor = night.rows.find((row) => row.event === "doctor-unreachable");
  assert.equal(doctor.verdict, "shibbolethed");
  assert.equal(doctor.doctorUnreachable, true);
});

test("GATE_WALK constant matches the issue clocks", () => {
  assert.equal(GATE_WALK[0].event, "launch");
  assert.equal(GATE_WALK[0].version, "2.1.266");
  assert.equal(GATE_WALK[0].clientKey, CLIENT_KEY);
  const closed = GATE_WALK.find((row) => row.event === "remote-control-closed");
  assert.equal(closed.keyAccepted, false);
  assert.equal(closed.httpStatus, 400);
  assert.equal(closed.flagsLoaded, 0);
  assert.equal(closed.doctorFrame, "unreachable");
  assert.equal(closed.remoteControlClosed, true);
  assert.equal(closed.proxyRuledOut, true);
  const four = GATE_WALK.find((row) => row.event === "cdn-400");
  assert.equal(four.error, ERROR_PHRASE);
  assert.equal(four.curlHits, 5);
});

test("error block reprints the published 400 Invalid API Key shape", () => {
  const block = errorBlock();
  assert.match(block, /HTTP 400/);
  assert.match(block, /Invalid API Key/);
  assert.equal(curlLine(), `curl ${CURL_URL.replace(CLIENT_KEY, CLIENT_KEY)}`);
  assert.match(curlLine(), /sdk-zAZezfDKGoZuXXKe/);
  assert.equal(HTTP_STATUS, 400);
  assert.equal(ERROR_BODY, '{"status":400,"error":"Invalid API Key"}');
  assert.match(DOCTOR_HEADLINE, /feature-flag service was unreachable/);
  assert.match(DOCTOR_DETAIL, /no server response this session/);
});

test("accepting the key flips shibbolethed to admitted", () => {
  const tape = {
    clientKey: CLIENT_KEY,
    keyAccepted: false,
    httpStatus: 400,
    invalidApiKey: true,
    flagsLoaded: 0,
    doctorFrame: "unreachable",
    doctorUnreachable: true,
    remoteControlEligible: false,
    remoteControlClosed: true,
    honestSurface: false,
  };
  assert.equal(scoreGate(tape).verdict, "shibbolethed");
  tape.keyAccepted = true;
  tape.httpStatus = 200;
  tape.invalidApiKey = false;
  tape.flagsLoaded = 12;
  tape.doctorFrame = "eligible";
  tape.doctorUnreachable = false;
  tape.remoteControlEligible = true;
  tape.remoteControlClosed = false;
  tape.honestSurface = true;
  tape.keyRotated = true;
  assert.equal(scoreGate(tape).verdict, "countersigned");
  tape.keyRotated = false;
  assert.equal(scoreGate(tape).verdict, "admitted");
});

test("cousins are cite-only; products stay distinct", () => {
  const cousins = readData("cousins.json");
  assert.equal(cousins.verdict, "cousins");
  assert.deepEqual(
    cousins.cousinsCiteOnly.map((row) => row.issue),
    [64151, 92661, 91717, 89292, 92683, 33041, 66556, 92760, 91459],
  );
  assert.equal(COUSINS.length, 9);
  assert.ok(NOT_PRODUCTS.includes("homestead"));
  assert.ok(NOT_PRODUCTS.includes("procrustes"));
  assert.ok(NOT_PRODUCTS.includes("epitaph"));
  assert.ok(NOT_PRODUCTS.includes("quill"));
  assert.equal(classify(cousins), "cousins");
});

test("issue metadata matches #92966", () => {
  assert.equal(FEATURED_ISSUE, 92966);
  assert.ok(ISSUE_URL.includes("92966"));
  assert.ok(/Invalid API Key/i.test(TITLE));
  assert.ok(/2\.1\.266/.test(TITLE));
  assert.ok(LABELS.includes("area:core"));
  assert.ok(LABELS.includes("platform:macos"));
  assert.ok(LABELS.includes("has repro"));
  assert.ok(HOLD.includes("admitted"));
  assert.ok(ALARM.includes("shibbolethed"));
  assert.ok(CHIPS.includes("countersigned"));
  assert.ok(VERDICTS.includes("invalid-api-key"));
  assert.ok(VERDICTS.includes("zero-flags"));
  assert.ok(VERDICTS.includes("doctor-unreachable"));
  assert.ok(VERDICTS.includes("remote-control-closed"));
  assert.ok(VERDICTS.includes("channels-dark"));
  assert.ok(VERDICTS.includes("key-hardcoded"));
  assert.ok(VERDICTS.includes("curl-400"));
  assert.equal(VERSION, "2.1.266");
  assert.equal(OS_NAME, "macOS arm64");
  assert.equal(REPORTER, "achobgood");
  assert.equal(FILED_AT, "2026-09-09T01:50:25Z");
  assert.equal(AUTH.subscriptionType, "max");
  assert.ok(ENV_VARS_UNSET.includes("DISABLE_GROWTHBOOK"));
});

test("CLI scores fixtures without a server", () => {
  const admitted = spawnSync(process.execPath, [modelPath(), fileURLToPath(new URL("./data/admitted.json", import.meta.url))], { encoding: "utf8" });
  const shibbolethed = spawnSync(process.execPath, [modelPath(), fileURLToPath(new URL("./data/shibbolethed.json", import.meta.url))], { encoding: "utf8" });
  assert.equal(admitted.status, 0, admitted.stderr);
  assert.equal(shibbolethed.status, 0, shibbolethed.stderr);
  assert.equal(JSON.parse(admitted.stdout).verdict, "admitted");
  assert.equal(JSON.parse(shibbolethed.stdout).verdict, "shibbolethed");
});

test("handle exposes published hypothesis and GrowthBook headline", () => {
  const result = handle(readData("92966.json"));
  assert.equal(result.published.issue, 92966);
  assert.equal(result.published.clientKey, CLIENT_KEY);
  assert.equal(result.published.httpStatus, 400);
  assert.equal(result.published.curlHits, 5);
  assert.equal(result.published.keyHardcoded, true);
  assert.match(result.published.hypothesis, /clientKey rejected upstream/);
  assert.match(fingerprint(seedShibbolethed()), /shibbolethed\|key=400\|flags=zero\|doctor=unreachable\|rc=closed/);
});

test("model has no static node: imports so the living page can score in-browser", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /^import .* from "node:/m);
  assert.match(source, /import\("node:fs"\)/);
});

test("living page is a river-ford watchword booth, not homestead prairie or epitaph slate", () => {
  const page = readPage();
  assert.match(page, /Cormorant Infant/);
  assert.match(page, /Manrope/);
  assert.match(page, /JetBrains Mono/);
  assert.match(page, /river-ford|watchword|password lodge|indigo bank|wet-stone|lantern/i);
  assert.match(page, /score shibbolethed or admit admitted/i);
  assert.match(page, /countersigned/);
  assert.doesNotMatch(page, /Playfair Display|Figtree|Fira Code/);
  assert.doesNotMatch(page, /Old Standard TT|Work Sans|Ubuntu Mono/);
  assert.doesNotMatch(page, /Vollkorn|Cabin/);
  assert.doesNotMatch(page, /prairie|land-office|homestead-claim|deed paper|survey stake/);
  assert.doesNotMatch(page, /stonecutter|memorial masonry|epitaph tablet/);
  assert.doesNotMatch(page, /iron-bed|blacksmith|Procrustean/);
  assert.doesNotMatch(page, /heat-haze|false oasis/);
  assert.doesNotMatch(page, /\bdeeded\b/);
  assert.doesNotMatch(page, /\bparked\b/);
  assert.doesNotMatch(page, /\bepitaphed\b/);
  assert.doesNotMatch(page, /\binscribed\b/);
  assert.doesNotMatch(page, /\bcollated\b/);
  assert.doesNotMatch(page, /\bstereotyped\b/);
  assert.doesNotMatch(page, /\benrolled\b/);
  assert.doesNotMatch(page, /\bescheated\b/);
  assert.doesNotMatch(page, /\bculled\b/);
  assert.doesNotMatch(page, /\bintact\b/);
  assert.match(page, /#92966/);
  assert.match(page, /11:50/);
});
