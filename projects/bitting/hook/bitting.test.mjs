import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ALARM_VERDICTS,
  AUTH_ERROR,
  CACHE_ABSENT,
  CACHE_PRESENT,
  CALLBACK_PORT,
  CHIPS,
  CLEAN_REJECT_MAX_S,
  CLEAN_REJECT_MIN_S,
  CONNECT_TIMEOUT_MS,
  CONTRAST_NOTE,
  DISTINCT_SESSIONS,
  ENDPOINT,
  FEATURED_ISSUE,
  FILED_AT,
  FLAG,
  FORBIDDEN_IDLE,
  HOLD_VERDICTS,
  HUB_LINE,
  HUNG_SESSION,
  HYPOTHESIS_NOTE,
  IDLE_WORD,
  ISSUE_URL,
  LABELS,
  MARK,
  NEEDS_AUTH_CACHE,
  NOT_PRODUCTS,
  PHRASE,
  PLUGIN,
  PRIMARY_ISSUES,
  PROBE_MS,
  REPORTER,
  SAME_CLASS,
  SEEDED_WORD,
  SLACK_PLUGIN_ISSUE,
  TITLE,
  VERDICTS,
  WORKING_SESSION,
  WORKING_TOOL,
  analyze,
  chipsOf,
  classify,
  decide,
  decideSeed,
  emptyTicket,
  handle,
  normalize,
  score,
  seedBound,
  seedSeated,
} from "./bitting.mjs";

function readData(name) {
  return JSON.parse(
    readFileSync(fileURLToPath(new URL(`../data/${name}`, import.meta.url)), "utf8"),
  );
}

function readPage() {
  return readFileSync(fileURLToPath(new URL("../index.html", import.meta.url)), "utf8");
}

function hookPath() {
  return fileURLToPath(new URL("./bitting.mjs", import.meta.url));
}

test("idle seated is a hold; tumblers align", () => {
  const result = analyze(seedSeated());
  assert.equal(result.verdict, "seated");
  assert.equal(result.idleWord, "seated");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.bound, false);
  assert.ok(result.chips.includes("seated"));
  assert.ok(!result.chips.includes("bound"));
  assert.ok(!result.chips.includes("connect-timeout"));
  assert.doesNotMatch(
    result.idleWord,
    /bitting|bound|token|timeout|mcp|slack|hallmarked|pointed|collapsed|spoiled|banked|misstruck|hunting|traced/i,
  );
});

test("empty ticket and empty stdin classify seated", () => {
  assert.equal(classify(emptyTicket()), "seated");
  assert.equal(classify(""), "seated");
  assert.equal(classify(null), "seated");
  assert.equal(decideSeed("seated").verdict, "seated");
});

test("seeded bound #90970 is alarm with the tumbler chips", () => {
  const result = analyze(seedBound());
  assert.equal(result.verdict, "bound");
  assert.equal(result.alarm, true);
  assert.equal(result.hold, false);
  assert.ok(result.chips.includes("bound"));
  assert.ok(result.chips.includes("token-mint"));
  assert.ok(result.chips.includes("session-exclusivity"));
  assert.ok(result.chips.includes("protocol-negotiation"));
  assert.ok(result.chips.includes("connect-timeout"));
  assert.ok(result.chips.includes("shared-credential"));
  assert.ok(result.chips.includes("stale-token"));
  assert.ok(result.chips.includes("needs-auth-miss"));
  assert.ok(result.chips.includes("pinned-legacy"));
  assert.ok(result.chips.includes("probe-hang"));
  assert.ok(result.chips.includes("concurrent-sessions"));
  assert.ok(result.chips.includes("misattributed-network"));
  assert.ok(!result.chips.includes("seated"));
  assert.match(result.contrast.ring, /15 sibling/);
  assert.match(result.contrast.probe, /5s negotiation/);
  assert.match(result.contrast.cache, /slack ABSENT/);
  assert.match(result.contrast.lock, /stale bitting/);
});

test("data fixtures classify seated vs bound vs named chips", () => {
  assert.equal(classify(readData("seated.json")), "seated");
  assert.equal(classify(readData("bound.json")), "bound");
  assert.equal(classify(readData("90970.json")), "bound");
  assert.equal(classify(readData("token-mint.json")), "token-mint");
  assert.equal(classify(readData("session-exclusivity.json")), "session-exclusivity");
  assert.equal(classify(readData("protocol-negotiation.json")), "protocol-negotiation");
  assert.equal(classify(readData("connect-timeout.json")), "connect-timeout");
  assert.equal(classify(readData("shared-credential.json")), "shared-credential");
  assert.equal(classify(readData("stale-token.json")), "stale-token");
  assert.equal(classify(readData("needs-auth-miss.json")), "needs-auth-miss");
  assert.equal(classify(readData("pinned-legacy.json")), "pinned-legacy");
  assert.equal(classify(readData("probe-hang.json")), "probe-hang");
  assert.equal(classify(readData("concurrent-sessions.json")), "concurrent-sessions");
  assert.equal(classify(readData("misattributed-network.json")), "misattributed-network");
  assert.equal(classify(readData("rebroadcast.json")), "rebroadcast");
});

test("bound seed is alarm; seated seed is hold", () => {
  assert.equal(score(seedBound()).alarm, true);
  assert.equal(score(seedBound()).hold, false);
  assert.equal(score(seedSeated()).hold, true);
  assert.equal(score(seedSeated()).alarm, false);
});

test("normalize seeds 90970 without ticket fields", () => {
  const ticket = normalize({ issue: 90970 });
  assert.equal(ticket.concurrentSessions, true);
  assert.equal(ticket.sharedCredential, true);
  assert.equal(ticket.probeHang, true);
  assert.equal(ticket.connectTimeout, true);
  assert.equal(ticket.needsAuthMiss, true);
  assert.equal(classify(ticket), "bound");
});

test("score / decide / handle agree on bound vs seated", () => {
  assert.equal(score(seedBound()).verdict, "bound");
  assert.equal(decide(seedSeated()).verdict, "seated");
  const fail = handle(seedBound());
  const hold = handle(seedSeated());
  assert.match(fail.hookSpecificOutput.additionalContext, /#90970/);
  assert.match(hold.hookSpecificOutput.additionalContext, /seated/i);
});

test("decideSeed aliases", () => {
  assert.equal(decideSeed("bound").verdict, "bound");
  assert.equal(decideSeed(90970).verdict, "bound");
  assert.equal(decideSeed("90970").verdict, "bound");
  assert.equal(decideSeed("seated").verdict, "seated");
});

test("CLI scores data files", () => {
  const bound = spawnSync(
    process.execPath,
    [hookPath(), fileURLToPath(new URL("../data/bound.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(bound.status, 0, bound.stderr);
  assert.equal(JSON.parse(bound.stdout).verdict, "bound");

  const seated = spawnSync(
    process.execPath,
    [hookPath(), fileURLToPath(new URL("../data/seated.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(seated.status, 0, seated.stderr);
  assert.equal(JSON.parse(seated.stdout).verdict, "seated");
});

test("constants match the issue facts only", () => {
  assert.equal(FEATURED_ISSUE, 90970);
  assert.deepEqual([...PRIMARY_ISSUES], [90970]);
  assert.deepEqual([...SAME_CLASS], [77130, 48993, 43000, 51319]);
  assert.equal(SLACK_PLUGIN_ISSUE, 46);
  assert.equal(REPORTER, "mocca102");
  assert.equal(FILED_AT, "2026-08-31T12:22:25Z");
  assert.equal(PLUGIN, "plugin:slack:slack");
  assert.equal(ENDPOINT, "https://mcp.slack.com/mcp");
  assert.equal(CALLBACK_PORT, 3118);
  assert.equal(FLAG, "tengu_mcp_protocol_negotiation_http");
  assert.equal(PROBE_MS, 5000);
  assert.equal(CONNECT_TIMEOUT_MS, 30000);
  assert.equal(CLEAN_REJECT_MIN_S, 0.4);
  assert.equal(CLEAN_REJECT_MAX_S, 10);
  assert.equal(DISTINCT_SESSIONS, 15);
  assert.equal(WORKING_SESSION, "b35777c5");
  assert.equal(HUNG_SESSION, "40a9b36f");
  assert.equal(WORKING_TOOL, "slack_read_thread");
  assert.equal(AUTH_ERROR, "unauthorized: AuthenticateToken authentication failed");
  assert.equal(NEEDS_AUTH_CACHE, "~/.claude/mcp-needs-auth-cache.json");
  assert.equal(CACHE_ABSENT, "slack");
  assert.ok(CACHE_PRESENT.includes("linear"));
  assert.ok(CACHE_PRESENT.includes("figma"));
  assert.equal(IDLE_WORD, "seated");
  assert.equal(SEEDED_WORD, "bound");
  assert.notEqual(IDLE_WORD, "bound");
  assert.notEqual(IDLE_WORD, "bitting");
  assert.notEqual(IDLE_WORD, "token");
  assert.deepEqual([...HOLD_VERDICTS], ["seated"]);
  assert.ok(ALARM_VERDICTS.includes("bound"));
  assert.ok(!ALARM_VERDICTS.includes("seated"));
  assert.deepEqual([...VERDICTS], [...CHIPS]);
  assert.equal(VERDICTS.length, 14);
  assert.deepEqual(
    [...LABELS],
    ["bug", "has-repro", "platform:macos", "area:mcp"],
  );
  assert.match(TITLE, /protocol-negotiation probe hangs/);
  assert.match(ISSUE_URL, /90970/);
  assert.match(PHRASE, /sibling key with yesterday's cut is not a hold/i);
  assert.match(HUB_LINE, /22:50 bitting/);
  assert.match(HUB_LINE, /admit seated/);
  assert.match(MARK, /22:50/);
  assert.match(MARK, /#96/);
  assert.match(MARK, /#90970/);
  assert.match(CONTRAST_NOTE, /AuthenticateToken/);
  assert.match(HYPOTHESIS_NOTE, /most recently cut key/);
  assert.ok(NOT_PRODUCTS.includes("reed"));
  assert.ok(NOT_PRODUCTS.includes("puncheon"));
  assert.ok(NOT_PRODUCTS.includes("gnomon"));
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(IDLE_WORD, word);
  }
});

test("chips.json and fingerprints stay aligned", () => {
  const chips = readData("chips.json");
  assert.deepEqual(chips.verdicts, [...VERDICTS]);
  assert.equal(chips.idleWord, "seated");
  assert.equal(chips.seededWord, "bound");
  const fp = readData("fingerprints.json");
  assert.equal(fp.primary, 90970);
  assert.equal(fp.plugin, "plugin:slack:slack");
  assert.equal(fp.callbackPort, 3118);
  assert.equal(fp.workingSession, "b35777c5");
  assert.equal(fp.hungSession, "40a9b36f");
  assert.equal(fp.distinctSessions, 15);
  assert.deepEqual(fp.sameClass, [77130, 48993, 43000, 51319]);
  const contrast = readData("contrast.json");
  assert.match(contrast.cleanReject.result, /AuthenticateToken/);
  assert.match(contrast.needsAuth.result, /slack/);
  assert.equal(contrast.sameClass.loginRefresh, 77130);
  const fixtures = readData("fixtures.json");
  assert.equal(fixtures.rows.length, 4);
  assert.equal(fixtures.rows[0].session, "b35777c5");
  assert.equal(fixtures.rows[1].session, "40a9b36f");
  assert.equal(fixtures.narrativeNotFixture.distinctSessions, 15);
});

test("chipsOf on a raw bound ticket still marks needs-auth-miss", () => {
  const chips = chipsOf({
    mostRecentMint: false,
    concurrentSessions: true,
    sharedCredential: true,
    probeHang: true,
    protocolNegotiation: true,
    pinnedLegacy: true,
    connectTimeout: true,
    staleToken: true,
    needsAuthMiss: true,
    cleanReject: false,
    siblingWorking: true,
    healthyEndpoint: true,
    flagGated: true,
    seatedHold: false,
    outputText:
      "most recently minted; CONNECT_TIMEOUT after 30000ms; slack is never written to ~/.claude/mcp-needs-auth-cache.json; reported as a network timeout",
  });
  assert.ok(chips.includes("bound"));
  assert.ok(chips.includes("needs-auth-miss"));
  assert.ok(chips.includes("probe-hang"));
  assert.ok(chips.includes("connect-timeout"));
  assert.ok(!chips.includes("seated"));
});

test("clean AuthenticateToken reject is not a bound hang", () => {
  const result = analyze({
    seed: "needs-auth-miss",
    cleanReject: true,
    needsAuthMiss: true,
    concurrentSessions: false,
    sharedCredential: false,
    probeHang: false,
    connectTimeout: false,
    staleToken: false,
    seatedHold: false,
    outputText: "unauthorized: AuthenticateToken authentication failed in 0.4–10s",
  });
  assert.notEqual(result.verdict, "bound");
  assert.ok(result.reasons.some((row) => /AuthenticateToken/i.test(row)));
});

test("living page is a locksmith bitting bench, idle seated, seeded bound", () => {
  const html = readPage();
  assert.match(html, /Idle word:\s*seated/);
  assert.match(html, /seated/);
  assert.match(html, /bound/);
  assert.match(html, /token-mint/);
  assert.match(html, /session-exclusivity/);
  assert.match(html, /protocol-negotiation/);
  assert.match(html, /connect-timeout/);
  assert.match(html, /shared-credential/);
  assert.match(html, /stale-token/);
  assert.match(html, /needs-auth-miss/);
  assert.match(html, /pinned-legacy/);
  assert.match(html, /probe-hang/);
  assert.match(html, /concurrent-sessions/);
  assert.match(html, /misattributed-network/);
  assert.match(html, /rebroadcast/);
  assert.match(html, /#90970/);
  assert.match(html, /#77130/);
  assert.match(html, /#48993/);
  assert.match(html, /#43000/);
  assert.match(html, /#51319/);
  assert.match(html, /22:50/);
  assert.match(html, /catalog #96/);
  assert.match(html, /mocca102/);
  assert.match(html, /b35777c5/);
  assert.match(html, /40a9b36f/);
  assert.match(html, /callbackPort:\s*3118|callbackPort 3118|3118/);
  assert.match(html, /tengu_mcp_protocol_negotiation_http/);
  assert.match(html, /Libre\+Bodoni|Libre Bodoni/);
  assert.match(html, /Figtree/);
  assert.match(html, /JetBrains\+Mono|JetBrains Mono/);
  assert.match(html, /Score the bitting/);
  assert.match(html, /Pin idle seated/);
  assert.match(html, /Pin seeded bound/);
  assert.match(html, /Admit seated/);
  assert.match(html, /bitting/i);
  assert.match(html, /pin-tumbler|pin tumbler|tumbler/i);
  assert.match(html, /felt/i);
  assert.match(html, /needs-auth/i);
  assert.match(html, /AuthenticateToken/);
  assert.doesNotMatch(html, /Idle word:\s*bound/i);
  assert.doesNotMatch(html, /Idle word:\s*bitting/i);
  assert.doesNotMatch(html, /Idle word:\s*hallmarked/);
  assert.doesNotMatch(html, /Idle word:\s*pointed/);
  assert.doesNotMatch(html, /Idle word:\s*collapsed/);
  assert.doesNotMatch(html, /Idle word:\s*banked/);
  assert.doesNotMatch(html, /Pin idle hallmarked/);
  assert.doesNotMatch(html, /Pin seeded misstruck/);
  assert.doesNotMatch(html, /Score the gold/);
  assert.doesNotMatch(html, /Score the gnomon/);
  assert.doesNotMatch(html, /Score the spoil/);
  assert.doesNotMatch(html, /Score the grooves/);
  assert.doesNotMatch(html, /family=Cinzel/);
  assert.doesNotMatch(html, /family=Outfit/);
  assert.doesNotMatch(html, /family=Spline/);
  assert.doesNotMatch(html, /family=Libre\+Baskerville/);
  assert.doesNotMatch(html, /family=IBM\+Plex\+Sans/);
  assert.doesNotMatch(html, /family=Space\+Mono/);
  assert.doesNotMatch(html, /family=Instrument/);
  assert.doesNotMatch(html, /family=Source\+Serif/);
  assert.doesNotMatch(html, /family=Newsreader/);
  assert.doesNotMatch(html, /family=Sora/);
  assert.doesNotMatch(html, /family=Red\+Hat\+Mono/);
  assert.doesNotMatch(html, /family=Fraunces/);
  assert.doesNotMatch(html, /goldsmith/);
  assert.doesNotMatch(html, /observatory/i);
  assert.doesNotMatch(html, /sundial/i);
  assert.doesNotMatch(html, /spoil tip/i);
  assert.doesNotMatch(html, /drafting trammel/i);
  assert.doesNotMatch(html, /composing-stone/);
  assert.doesNotMatch(html, /papal lead/);
  assert.doesNotMatch(html, /walnut bench/);
});
