import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  fire,
  githubVisaLedger,
  linearVisaTicket,
  slackVisaAlarm,
} from "./adapters.mjs";
import {
  ALARM_VERDICTS,
  CANONICAL_RESOURCE,
  DEFAULT_CLIENT_ID,
  IDLE_WORD,
  LINEAR_VERDICTS,
  SLACK_VERDICTS,
  VERDICTS,
  analyze,
  audIsClientIdOf,
  classify,
  cloneProbe,
  clusterOf,
  decide,
  decideSeed,
  emptyAction,
  emptyProbe,
  feedOf,
  flagsOf,
  forbiddenIdleWords,
  isIdle,
  omittedFault,
  omittedOf,
  clientidOf,
  parseSessionTrace,
  reasonsOf,
  resourceOmittedOf,
  score,
  seed90497Omitted,
  seedAudless,
  seedClientid,
  seedGranted,
  seedHealthy,
  seedHeld,
  seedMismatched,
  seedRefused,
  seedSlashy,
  seedStamped,
  seedStrict,
  stampedOf,
  verdictOf,
} from "./visa.mjs";
import { handle, listen } from "./index.mjs";

function assertIdleNeverVisa(result) {
  assert.equal(result.idleWord, "stamped");
  assert.equal(IDLE_WORD, "stamped");
  assert.doesNotMatch(result.idleWord, /visa/i);
  assert.doesNotMatch(IDLE_WORD, /visa/i);
  assert.doesNotMatch(result.idleWord, /empty|resource|oauth|audience/i);
  assert.doesNotMatch(IDLE_WORD, /empty/i);
  assert.doesNotMatch(
    result.idleWord,
    /overrun|pratique|bound|stilled|drained|flat|fit|spoilt|laid|unlinked|tight|banked|roosted|stocked|seated|heard|clear|paired|kernel|latched|upheld|sterling|home|valid|dry|sealed|quiet|seised|stabled|wound/,
  );
}

function assertScoreShape(result) {
  assert.equal(typeof result.verdict, "string");
  assert.ok(Array.isArray(result.reasons));
  assert.ok(Array.isArray(result.cluster));
  assert.equal(typeof result.stamped, "boolean");
  assert.equal(typeof result.omitted, "boolean");
  assert.equal(typeof result.clientid, "boolean");
  assert.equal(typeof result.feed, "string");
  assert.equal(typeof result.slack, "boolean");
  assert.equal(typeof result.linear, "boolean");
  assert.equal(typeof result.github, "boolean");
}

test("1 seed 90497 omitted is omitted, slack, linear, idleWord stamped", () => {
  const seed = seed90497Omitted();
  const result = decide(seed);
  assert.equal(result.verdict, "omitted");
  assert.equal(result.state, "omitted");
  assert.equal(result.decision, "omitted");
  assert.equal(classify(seed.probe), "omitted");
  assert.equal(verdictOf(seed.probe), "omitted");
  assert.notEqual(result.verdict, "stamped");
  assert.equal(result.alarm, true);
  assert.equal(result.slack, true);
  assert.equal(result.linear, true);
  assert.equal(result.github, true);
  assert.equal(result.borderOmitted, true);
  assert.equal(result.borderStamped, false);
  assert.equal(result.stamped, false);
  assert.equal(result.omitted, true);
  assert.equal(result.clientid, false);
  assertIdleNeverVisa(result);
  assert.equal(result.session, "90497-omitted");
  assert.equal(result.issue, 90497);
  assert.equal(result.resourceSentAuthorize, false);
  assert.equal(result.resourceSentToken, false);
  assert.equal(result.audClaim, DEFAULT_CLIENT_ID);
  assert.equal(result.canonicalResourceUri, CANONICAL_RESOURCE);
  assert.equal(result.serverStrict, true);
  assert.equal(result.httpStatus, 401);
  assert.equal(result.oauthCompleted, true);
  assert.match(result.feed, /absent|primary #90497/i);
  assert.ok(result.cluster.includes("clientid"));
  assert.ok(result.cluster.includes("refused"));
  assert.ok(!result.cluster.includes("omitted"));
  assert.ok(!result.cluster.includes("stamped"));
  assert.equal(decideSeed(90497).verdict, "omitted");
  assert.equal(decideSeed("omitted").verdict, "omitted");
  assert.equal(decideSeed("90497-omitted").verdict, "omitted");
});

test("2 idle/empty/{} is stamped, never the product name, never empty, never overrun", () => {
  const result = decide(emptyAction("idle"));
  assert.equal(result.state, "stamped");
  assert.equal(result.verdict, "stamped");
  assert.equal(result.decision, "stamped");
  assert.equal(result.alarm, false);
  assert.equal(result.slack, false);
  assert.equal(result.linear, false);
  assert.equal(result.stamped, true);
  assert.equal(result.omitted, false);
  assert.equal(classify({}), "stamped");
  assert.equal(classify(emptyProbe()), "stamped");
  assert.equal(isIdle(emptyProbe()), true);
  assertIdleNeverVisa(result);
  const bailed = decide({ action: "bail" });
  assert.equal(bailed.state, "stamped");
  assert.equal(bailed.idleWord, "stamped");
  assert.equal(bailed.oauthCompleted, false);
  assert.doesNotMatch(bailed.state, /visa/i);
  assert.doesNotMatch(bailed.state, /empty/i);
  const empty = decide({});
  assert.equal(empty.verdict, "stamped");
  assert.equal(empty.idleWord, "stamped");
});

test("3 audless: token has no useful audience claim", () => {
  const result = decide(seedAudless());
  assert.equal(result.verdict, "audless");
  assert.equal(result.resourceSentAuthorize, true);
  assert.equal(result.resourceSentToken, true);
  assert.equal(result.audClaim, "");
  assert.equal(result.alarm, true);
  assert.equal(result.slack, true);
  assert.equal(result.linear, false);
  assert.match(result.feed, /no useful audience/i);
  assert.equal(decideSeed("audless").verdict, "audless");
});

test("4 clientid: aud equals OAuth client_id", () => {
  const result = decide(seedClientid());
  assert.equal(result.verdict, "clientid");
  assert.equal(result.audClaim, DEFAULT_CLIENT_ID);
  assert.equal(result.clientId, DEFAULT_CLIENT_ID);
  assert.equal(result.resourceSentAuthorize, true);
  assert.equal(result.alarm, true);
  assert.equal(result.slack, true);
  assert.equal(result.linear, true);
  assert.equal(result.clientid, true);
  assert.match(result.feed, /client_id/i);
  assert.equal(decideSeed("clientid").verdict, "clientid");
});

test("5 refused: strict MCP server returns 401", () => {
  const result = decide(seedRefused());
  assert.equal(result.verdict, "refused");
  assert.equal(result.serverStrict, true);
  assert.equal(result.httpStatus, 401);
  assert.equal(result.resourceSentAuthorize, true);
  assert.equal(result.alarm, true);
  assert.equal(result.slack, true);
  assert.equal(result.linear, true);
  assert.match(result.feed, /401/i);
  assert.equal(decideSeed("refused").verdict, "refused");
});

test("6 strict: house that rejects, resource named, no accept yet", () => {
  const result = decide(seedStrict());
  assert.equal(result.verdict, "strict");
  assert.equal(result.serverStrict, true);
  assert.equal(result.httpStatus, 0);
  assert.equal(result.audClaim, CANONICAL_RESOURCE);
  assert.equal(result.alarm, false);
  assert.match(result.feed, /house that rejects|RFC 8707/i);
  assert.equal(decideSeed("strict").verdict, "strict");
});

test("7 slashy: resource sent but trailing-slash corrupted", () => {
  const result = decide(seedSlashy());
  assert.equal(result.verdict, "slashy");
  assert.equal(result.trailingSlashCorruption, true);
  assert.equal(result.resourceSentAuthorize, true);
  assert.equal(result.issue, 52871);
  assert.equal(result.alarm, true);
  assert.equal(result.slack, true);
  assert.match(result.feed, /trailing-slash|#52871/i);
  assert.equal(decideSeed("slashy").verdict, "slashy");
  assert.equal(decideSeed(52871).verdict, "slashy");
});

test("8 mismatched: aud does not match Protected Resource Metadata", () => {
  const result = decide(seedMismatched());
  assert.equal(result.verdict, "mismatched");
  assert.equal(result.audClaim, "api://tenant-app");
  assert.equal(result.canonicalResourceUri, "https://host.example/mcp");
  assert.equal(result.alarm, true);
  assert.match(result.feed, /does not match/i);
  assert.equal(decideSeed("mismatched").verdict, "mismatched");
  assert.equal(decideSeed(76096).verdict, "mismatched");
});

test("9 granted: soft server accepted a wrong-audience token", () => {
  const result = decide(seedGranted());
  assert.equal(result.verdict, "granted");
  assert.equal(result.serverStrict, false);
  assert.equal(result.httpStatus, 200);
  assert.equal(result.audClaim, DEFAULT_CLIENT_ID);
  assert.equal(result.alarm, false);
  assert.match(result.feed, /false green|soft\/legacy/i);
  assert.equal(decideSeed("granted").verdict, "granted");
});

test("10 held: waiting on OAuth dance", () => {
  const result = decide(seedHeld());
  assert.equal(result.verdict, "held");
  assert.equal(result.oauthCompleted, false);
  assert.equal(result.alarm, false);
  assert.equal(result.slack, false);
  assert.equal(result.linear, false);
  assert.match(result.feed, /waiting on OAuth/i);
  assert.equal(decideSeed("held").verdict, "held");
});

test("11 stamped seed is stamped and never alarms", () => {
  const result = decide(seedStamped());
  assert.equal(result.verdict, "stamped");
  assert.equal(result.oauthCompleted, false);
  assert.equal(result.stamped, true);
  assert.equal(result.alarm, false);
  assert.equal(result.slack, false);
  assert.equal(result.linear, false);
  assert.match(result.feed, /Stamped/);
  assert.equal(decideSeed("stamped").verdict, "stamped");
});

test("12 score() idle probe is stamped and never alarms", () => {
  const result = score(emptyProbe());
  assertScoreShape(result);
  assert.equal(result.verdict, "stamped");
  assert.equal(result.slack, false);
  assert.equal(result.linear, false);
  assert.equal(result.github, true);
  assert.equal(result.alarm, false);
  assert.equal(result.stamped, true);
  assert.equal(result.omitted, false);
  assert.equal(result.clientid, false);
});

test("13 verdict vocabulary is exactly the ten words", () => {
  assert.deepEqual(VERDICTS, [
    "stamped",
    "omitted",
    "audless",
    "clientid",
    "refused",
    "strict",
    "slashy",
    "mismatched",
    "granted",
    "held",
  ]);
  assert.deepEqual(SLACK_VERDICTS, [
    "omitted",
    "audless",
    "clientid",
    "refused",
    "slashy",
    "mismatched",
  ]);
  assert.deepEqual(ALARM_VERDICTS, SLACK_VERDICTS);
  assert.deepEqual(LINEAR_VERDICTS, ["omitted", "clientid", "refused"]);
  assert.equal(IDLE_WORD, "stamped");
  assert.doesNotMatch(IDLE_WORD, /visa/i);
  assert.doesNotMatch(IDLE_WORD, /empty/i);
  assert.doesNotMatch(IDLE_WORD, /overrun|pratique|resource|oauth|audience/);
  assert.doesNotMatch(VERDICTS.join(" "), /empty|visa|overrun|pratique/);
});

test("14 every seeded class classifies to itself", () => {
  const rows = [
    ["stamped", seedStamped],
    ["omitted", seed90497Omitted],
    ["audless", seedAudless],
    ["clientid", seedClientid],
    ["refused", seedRefused],
    ["strict", seedStrict],
    ["slashy", seedSlashy],
    ["mismatched", seedMismatched],
    ["granted", seedGranted],
    ["held", seedHeld],
  ];
  for (const [word, seed] of rows) {
    assert.equal(decide(seed()).verdict, word, word);
    assert.equal(classify(seed().probe), word, word);
    assert.equal(score(seed().probe).verdict, word, word);
  }
});

test("15 admit does not lie: omitted stays omitted", () => {
  const result = decide({ ...seed90497Omitted(), action: "admit" });
  assert.equal(result.verdict, "omitted");
  assert.equal(result.action, "admit");
  assert.doesNotMatch(result.verdict, /stamped/);
  assert.doesNotMatch(result.verdict, /visa/i);
});

test("16 score / stamp / throw scores omitted", () => {
  const result = decide({ ...seed90497Omitted(), action: "score" });
  assert.equal(result.verdict, "omitted");
  assert.equal(result.action, "score");
  assert.equal(result.oauthCompleted, true);
  const stamped = decide({ ...seed90497Omitted(), action: "stamp" });
  assert.equal(stamped.verdict, "omitted");
  assert.equal(stamped.action, "stamp");
  const thrown = decide({ ...seed90497Omitted(), action: "throw" });
  assert.equal(thrown.verdict, "omitted");
  assert.equal(thrown.action, "score");
});

test("17 bail / stamped returns idle stamped", () => {
  const bailed = decide({ ...seed90497Omitted(), action: "bail" });
  assert.equal(bailed.verdict, "stamped");
  assert.equal(bailed.action, "bail");
  assert.equal(bailed.oauthCompleted, false);
  assert.equal(isIdle(bailed.probe), true);
  assertIdleNeverVisa(bailed);
  const idle = decide({ ...seedGranted(), action: "stamped" });
  assert.equal(idle.verdict, "stamped");
  const still = decide({ ...seedRefused(), action: "still" });
  assert.equal(still.verdict, "stamped");
});

test("18 blotter on idle produces omitted 90497 strike", () => {
  const result = decide({ action: "blotter", probe: emptyProbe() });
  assert.equal(result.verdict, "omitted");
  assert.equal(result.action, "omit");
  assert.equal(result.issue, 90497);
  assert.equal(result.omitted, true);
});

test("19 restore on a held probe becomes omitted", () => {
  const result = decide({ ...seedHeld(), action: "restore" });
  assert.equal(result.verdict, "omitted");
  assert.equal(result.action, "restore");
  assert.equal(result.httpStatus, 401);
});

test("20 ledger marks the blotter and does not lie", () => {
  const result = decide({ ...seed90497Omitted(), action: "ledger" });
  assert.equal(result.verdict, "omitted");
  assert.equal(result.action, "ledger");
  assert.equal(result.oauthCompleted, true);
});

test("21 omitted beats clientid/refused/audless when the full #90497 signature is present", () => {
  assert.equal(
    classify({
      oauthCompleted: true,
      resourceSentAuthorize: false,
      resourceSentToken: false,
      audClaim: "mcp-client",
      clientId: "mcp-client",
      canonicalResourceUri: CANONICAL_RESOURCE,
      serverStrict: true,
      httpStatus: 401,
    }),
    "omitted",
  );
  assert.equal(omittedFault(seed90497Omitted().probe), true);
  assert.equal(resourceOmittedOf(seed90497Omitted().probe), true);
});

test("22 clientid requires resource sent so it is not omitted", () => {
  assert.equal(
    classify({
      oauthCompleted: true,
      resourceSentAuthorize: true,
      resourceSentToken: true,
      resourceValue: CANONICAL_RESOURCE,
      audClaim: "mcp-client",
      clientId: "mcp-client",
      canonicalResourceUri: CANONICAL_RESOURCE,
      serverStrict: true,
    }),
    "clientid",
  );
  assert.equal(audIsClientIdOf(seedClientid().probe), true);
});

test("23 held is oauth not completed even with a destination written", () => {
  assert.equal(
    classify({
      oauthCompleted: false,
      clientId: "mcp-client",
      canonicalResourceUri: CANONICAL_RESOURCE,
    }),
    "held",
  );
});

test("24 granted is a soft 200 on a wrong-audience token", () => {
  assert.equal(
    classify({
      oauthCompleted: true,
      resourceSentAuthorize: true,
      resourceSentToken: true,
      resourceValue: CANONICAL_RESOURCE,
      audClaim: "mcp-client",
      clientId: "mcp-client",
      canonicalResourceUri: CANONICAL_RESOURCE,
      serverStrict: false,
      httpStatus: 200,
    }),
    "granted",
  );
});

test("25 nested blotter / desk / stamp / border fields clone", () => {
  const probe = cloneProbe({
    blotter: {
      oauthCompleted: true,
      resourceSentAuthorize: false,
      resourceSentToken: false,
      audClaim: "mcp-client",
      clientId: "mcp-client",
      canonicalResourceUri: CANONICAL_RESOURCE,
      serverStrict: true,
      httpStatus: 401,
    },
  });
  assert.equal(classify(probe), "omitted");
  const desk = cloneProbe({
    desk: {
      oauthCompleted: true,
      resourceSentAuthorize: true,
      resourceSentToken: true,
      trailingSlashCorruption: true,
      resourceValue: "https://mcp.businesscentral.dynamics.com/",
      canonicalResourceUri: "https://mcp.businesscentral.dynamics.com",
    },
  });
  assert.equal(classify(desk), "slashy");
});

test("26 flagsOf matches slack / linear / github", () => {
  assert.deepEqual(flagsOf("omitted"), { slack: true, linear: true, github: true, alarm: true });
  assert.deepEqual(flagsOf("clientid"), { slack: true, linear: true, github: true, alarm: true });
  assert.deepEqual(flagsOf("refused"), { slack: true, linear: true, github: true, alarm: true });
  assert.deepEqual(flagsOf("audless"), { slack: true, linear: false, github: true, alarm: true });
  assert.deepEqual(flagsOf("slashy"), { slack: true, linear: false, github: true, alarm: true });
  assert.deepEqual(flagsOf("mismatched"), { slack: true, linear: false, github: true, alarm: true });
  assert.deepEqual(flagsOf("stamped"), { slack: false, linear: false, github: true, alarm: false });
  assert.deepEqual(flagsOf("held"), { slack: false, linear: false, github: true, alarm: false });
  assert.deepEqual(flagsOf("strict"), { slack: false, linear: false, github: true, alarm: false });
  assert.deepEqual(flagsOf("granted"), { slack: false, linear: false, github: true, alarm: false });
});

test("27 stamped / omitted / clientid helpers", () => {
  assert.equal(stampedOf(seed90497Omitted().probe), false);
  assert.equal(omittedOf(seed90497Omitted().probe), true);
  assert.equal(clientidOf(seed90497Omitted().probe), false);
  assert.equal(stampedOf(emptyProbe()), true);
  assert.equal(clientidOf(seedClientid().probe), true);
  assert.equal(omittedOf(seedClientid().probe), false);
  assert.equal(stampedOf(seedHeld().probe), false);
});

test("28 feed and reasons never use visa or empty as the idle word", () => {
  const idle = score(emptyProbe());
  assert.equal(idle.idleWord, "stamped");
  assert.doesNotMatch(idle.feed, /idle word is visa/i);
  assert.doesNotMatch(idle.feed, /idle word is empty/i);
  assert.doesNotMatch(idle.feed, /idle word is overrun/i);
  assert.ok(idle.reasons.every((line) => !/idle word is visa/i.test(line)));
  assert.ok(idle.reasons.every((line) => !/idle word is empty/i.test(line)));
  assert.match(feedOf(emptyProbe(), "stamped"), /Stamped/);
  assert.ok(reasonsOf(emptyProbe(), "stamped").some((line) => /idle word is stamped/.test(line)));
});

test("29 forbidden idle list includes visa, empty, leftover names", () => {
  const words = forbiddenIdleWords();
  assert.ok(words.includes("visa"));
  assert.ok(words.includes("empty"));
  assert.ok(words.includes("resource"));
  assert.ok(words.includes("oauth"));
  assert.ok(words.includes("audience"));
  assert.ok(words.includes("overrun"));
  assert.ok(words.includes("pratique"));
  assert.ok(words.includes("sprag"));
  assert.ok(words.includes("reed"));
  assert.ok(words.includes("husk"));
  assert.ok(words.includes("lazaret"));
  assert.ok(words.includes("fusee"));
  assert.ok(!words.includes("stamped"));
});

test("30 demo sinks: Slack on alarm; Linear on omitted/clientid/refused; GitHub always", async () => {
  const omitted = decide(seed90497Omitted());
  const slack = slackVisaAlarm(omitted, {});
  assert.equal(slack.mode, "demo");
  assert.match(slack.summary, /Would post to Slack/);
  const github = githubVisaLedger(omitted, {});
  assert.equal(github.mode, "demo");
  assert.match(github.summary, /Would open a GitHub visa-ledger/);
  const linear = linearVisaTicket(omitted, {});
  assert.equal(linear.mode, "demo");
  assert.match(linear.summary, /Would open a Linear ticket/);
  const honest = decide(seedHealthy());
  const linearSkip = linearVisaTicket(honest, {});
  assert.equal(linearSkip.mode, "demo");
  assert.match(linearSkip.summary, /Would skip Linear/);
  const idle = decide(emptyAction("idle"));
  assert.match(slackVisaAlarm(idle, {}).summary, /Would skip Slack/);
  assert.match(linearVisaTicket(idle, {}).summary, /Would skip Linear/);
  const fired = await fire(omitted, {});
  assert.equal(fired.events.length, 3);
  assert.ok(fired.events.every((row) => row.ok === true));
});

test("31 Slack live plan uses SLACK_WEBHOOK alias and GITHUB_TOKEN alias", () => {
  const omitted = decide(seed90497Omitted());
  const slack = slackVisaAlarm(omitted, { SLACK_WEBHOOK: "https://hooks.example/y" });
  assert.equal(slack.mode, "live");
  const github = githubVisaLedger(omitted, { GITHUB_TOKEN: "tok" });
  assert.equal(github.mode, "live");
  const linear = linearVisaTicket(omitted, { LINEAR_API_KEY: "lin" });
  assert.equal(linear.mode, "live");
});

test("32 Slack skip on stamped / held / strict / granted", () => {
  for (const seed of [seedStamped, seedHeld, seedStrict, seedGranted, seedHealthy]) {
    const result = decide(seed());
    assert.equal(result.slack, false, result.verdict);
    assert.match(slackVisaAlarm(result, {}).summary, /Would skip Slack/);
  }
});

test("33 Linear only on omitted, clientid, and refused", () => {
  assert.equal(decide(seed90497Omitted()).linear, true);
  assert.equal(decide(seedClientid()).linear, true);
  assert.equal(decide(seedRefused()).linear, true);
  assert.equal(decide(seedAudless()).linear, false);
  assert.equal(decide(seedSlashy()).linear, false);
  assert.equal(decide(seedMismatched()).linear, false);
  assert.equal(decide(seedHeld()).linear, false);
  assert.equal(decide(seedStamped()).linear, false);
});

test("34 GitHub ledger fires on idle/bail scored probes too", () => {
  const idle = decide(emptyAction("idle"));
  assert.equal(idle.github, true);
  assert.equal(score(emptyProbe()).github, true);
  const bailed = decide({ action: "bail" });
  assert.equal(bailed.github, true);
});

test("35 handle omitted / audless / clientid / refused / slashy / mismatched deny", async () => {
  const omitted = await handle(seed90497Omitted(), {});
  assert.equal(omitted.permissionDecision, "deny");
  assert.match(omitted.hookSpecificOutput.decision.message, /omitted/);
  const audless = await handle(seedAudless(), {});
  assert.equal(audless.permissionDecision, "deny");
  const clientid = await handle(seedClientid(), {});
  assert.equal(clientid.permissionDecision, "deny");
  const refused = await handle(seedRefused(), {});
  assert.equal(refused.permissionDecision, "deny");
  const slashy = await handle(seedSlashy(), {});
  assert.equal(slashy.permissionDecision, "deny");
  const mismatched = await handle(seedMismatched(), {});
  assert.equal(mismatched.permissionDecision, "deny");
});

test("36 handle stamped / held / strict / granted allow", async () => {
  const idle = await handle({ action: "bail" }, {});
  assert.equal(idle.permissionDecision, "allow");
  assert.match(idle.hookSpecificOutput.decision.message, /stamped/);
  const held = await handle(seedHeld(), {});
  assert.equal(held.permissionDecision, "allow");
  const strict = await handle(seedStrict(), {});
  assert.equal(strict.permissionDecision, "allow");
  const granted = await handle(seedGranted(), {});
  assert.equal(granted.permissionDecision, "allow");
});

test("37 listen GET health and POST empty body is stamped", async () => {
  const server = listen(19304);
  await new Promise((resolve) => server.once("listening", resolve));
  const health = await fetch("http://127.0.0.1:19304/health");
  const info = await health.json();
  assert.equal(info.product, "visa");
  assert.match(info.verbs, /omitted/);
  const res = await fetch("http://127.0.0.1:19304/", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: "{}",
  });
  const body = await res.json();
  assert.equal(body.verdict, "stamped");
  assert.equal(body.idleWord, "stamped");
  const scored = await fetch("http://127.0.0.1:19304/", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(seed90497Omitted()),
  });
  const scoredBody = await scored.json();
  assert.equal(scoredBody.verdict, "omitted");
  await new Promise((resolve) => server.close(resolve));
});

test("38 listen rejects non-JSON and GET-only verbs besides health", async () => {
  const server = listen(19305);
  await new Promise((resolve) => server.once("listening", resolve));
  const bad = await fetch("http://127.0.0.1:19305/", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: "{",
  });
  assert.equal(bad.status, 400);
  const put = await fetch("http://127.0.0.1:19305/", { method: "PUT" });
  assert.equal(put.status, 405);
  await new Promise((resolve) => server.close(resolve));
});

test("39 every verdict is uniquely first-match on its seed", () => {
  const map = {
    stamped: seedStamped,
    omitted: seed90497Omitted,
    audless: seedAudless,
    clientid: seedClientid,
    refused: seedRefused,
    strict: seedStrict,
    slashy: seedSlashy,
    mismatched: seedMismatched,
    granted: seedGranted,
    held: seedHeld,
  };
  const seen = new Set();
  for (const [word, seed] of Object.entries(map)) {
    const got = classify(seed().probe);
    assert.equal(got, word, word);
    assert.equal(seen.has(got), false, word);
    seen.add(got);
  }
  assert.equal(seen.size, 10);
});

test("40 admit does not lie on every fault class", () => {
  const rows = [
    ["omitted", seed90497Omitted],
    ["audless", seedAudless],
    ["clientid", seedClientid],
    ["refused", seedRefused],
    ["strict", seedStrict],
    ["slashy", seedSlashy],
    ["mismatched", seedMismatched],
    ["granted", seedGranted],
    ["held", seedHeld],
    ["stamped", seedHealthy],
  ];
  for (const [word, seed] of rows) {
    const result = decide({ ...seed(), action: "admit" });
    assert.equal(result.verdict, word, word);
    assert.equal(result.action, "admit", word);
  }
});

test("41 desk HTML sanity: idle word stamped, seeded omitted, not sprag/reed/husk", () => {
  const html = readFileSync(fileURLToPath(new URL("../index.html", import.meta.url)), "utf8");
  assert.match(html, /stamped/);
  assert.match(html, /Score/);
  assert.match(html, /Bail/);
  assert.match(html, /Admit stamped/);
  assert.match(html, /omitted/);
  assert.match(html, /90497/);
  assert.match(html, /seedOf\("omitted"\)|probe = seedOf\("omitted"\)/);
  assert.doesNotMatch(html, /const IDLE_WORD = "visa"/);
  assert.doesNotMatch(html, /const IDLE_WORD = "empty"/);
  assert.doesNotMatch(html, /const IDLE_WORD = "overrun"/);
  assert.doesNotMatch(html, /const IDLE_WORD = "pratique"/);
  assert.match(html, /const IDLE_WORD = "stamped"/);
  assert.match(html, /blotter|brass-stamp|watermark-paper|amber-lamp|ink-pad|teal-stripe|passport-folio/i);
  assert.match(html, /13:50 Sydney · visa/);
  assert.match(html, /login without a destination is not a hold/i);
  assert.doesNotMatch(html, /class="clutch-cut"|class="inner-race"|class="outer-race"|class="drain-plug"|class="sprag-wedge"/);
  assert.doesNotMatch(html, /class="yellow-jack"|class="inspection-lantern"|class="ward"|class="tide-line"/);
  assert.doesNotMatch(html, /class="oak-case"|class="enamel-face"|class="fusee-drum"|class="winding-arbor"/);
  assert.doesNotMatch(html, /class="contacts"|class="reed-relay"|class="cabinet-glass"/);
  assert.doesNotMatch(html, /--carbon:|--atf:|--sprag-steel:/);
  assert.doesNotMatch(html, /Teko|Atkinson Hyperlegible/);
  assert.doesNotMatch(html, /Bodoni Moda/);
  assert.doesNotMatch(html, /millimeter slider|millimetre slider/i);
  assert.match(html, /<title>Visa/);
  assert.match(html, /Libre Baskerville|Source Sans 3/);
});

test("42 HTML why-not names Sprag, Reed, Husk, leftover", () => {
  const html = readFileSync(fileURLToPath(new URL("../index.html", import.meta.url)), "utf8");
  assert.match(html, /NOT Sprag/);
  assert.match(html, /NOT Reed/);
  assert.match(html, /NOT Husk/);
  assert.match(html, /#90477/);
  assert.match(html, /leftover/);
  assert.match(html, /millimeter-slider|millimetre-slider|millimeter slider|millimetre slider/);
  assert.doesNotMatch(html, /Visa is a clutch/i);
  assert.doesNotMatch(html, /Visa is a reed/i);
  assert.doesNotMatch(html, /Visa is a lazaret/i);
  assert.doesNotMatch(html, /this is a gearbox/i);
});

test("43 README names Sprag / Reed / Husk contrast and stamped idle", () => {
  const readme = readFileSync(fileURLToPath(new URL("../README.md", import.meta.url)), "utf8");
  assert.match(readme, /NOT Sprag/);
  assert.match(readme, /NOT Reed/);
  assert.match(readme, /NOT Husk/);
  assert.match(readme, /leftover/);
  assert.match(readme, /\*\*stamped\*\*/);
  assert.match(readme, /#90497|#90497/);
  assert.match(readme, /#52871|#52871/);
  assert.match(readme, /codex#13891|openai\/codex#13891/);
  assert.doesNotMatch(readme, /idle word is visa/i);
  assert.doesNotMatch(readme, /idle word is overrun/i);
  assert.doesNotMatch(readme, /idle word is pratique/i);
  assert.doesNotMatch(readme, /Visa is a clutch/i);
});

test("44 score() omitted includes omitted and not stamped", () => {
  const result = score(seed90497Omitted().probe);
  assertScoreShape(result);
  assert.equal(result.verdict, "omitted");
  assert.equal(result.stamped, false);
  assert.equal(result.omitted, true);
  assert.equal(result.clientid, false);
});

test("45 fire live slack posts when fetch ok", async () => {
  const omitted = decide(seed90497Omitted());
  const events = await fire(omitted, { VISA_SLACK_WEBHOOK: "https://hooks.example/x" }, async () => ({
    ok: true,
    status: 200,
    json: async () => ({}),
  }));
  const slack = events.events.find((row) => row.adapter === "slack");
  assert.equal(slack.ok, true);
  assert.match(slack.summary, /Posted omitted/);
});

test("46 parseSessionTrace reads #90497 omitted paste", () => {
  const probe = parseSessionTrace(
    "MCP OAuth client does not send RFC 8707 resource. issued access token aud=mcp-client. 401 claim check failed. http://localhost:8130/mcp #90497",
  );
  assert.equal(probe.oauthCompleted, true);
  assert.equal(probe.issue, 90497);
  assert.equal(classify(probe), "omitted");
});

test("47 parseSessionTrace reads slashy AADSTS9010010", () => {
  const probe = parseSessionTrace(
    "Claude Code appends a trailing slash to resource. AADSTS9010010. #52871",
  );
  assert.equal(probe.trailingSlashCorruption, true);
  assert.equal(probe.issue, 52871);
  assert.equal(classify(probe), "slashy");
});

test("48 analyze omitted probe exposes clientid aud and 401", () => {
  const facts = analyze(seed90497Omitted().probe);
  assert.equal(facts.omitted, true);
  assert.equal(facts.audIsClientId, true);
  assert.equal(facts.refused401, true);
  assert.equal(facts.sentBoth, false);
});

test("49 omit / blotter / desk verbs produce omitted strike", () => {
  assert.equal(decide({ action: "omit" }).verdict, "omitted");
  assert.equal(decide({ action: "blotter" }).verdict, "omitted");
  assert.equal(decide({ action: "desk" }).verdict, "omitted");
  assert.equal(decide({ action: "healthy" }).verdict, "stamped");
});

test("50 healthy seed is stamped with resource named and 200", () => {
  const result = decide(seedHealthy());
  assert.equal(result.verdict, "stamped");
  assert.equal(result.resourceSentAuthorize, true);
  assert.equal(result.resourceSentToken, true);
  assert.equal(result.audClaim, CANONICAL_RESOURCE);
  assert.equal(result.httpStatus, 200);
  assert.equal(result.alarm, false);
  assertIdleNeverVisa(result);
});

test("51 omitted from authorize-only still omitted", () => {
  assert.equal(
    classify({
      oauthCompleted: true,
      resourceSentAuthorize: true,
      resourceSentToken: false,
      audClaim: "mcp-client",
      clientId: "mcp-client",
      canonicalResourceUri: CANONICAL_RESOURCE,
      serverStrict: true,
      httpStatus: 401,
    }),
    "omitted",
  );
});

test("52 omitted from token-only still omitted", () => {
  assert.equal(
    classify({
      oauthCompleted: true,
      resourceSentAuthorize: false,
      resourceSentToken: true,
      audClaim: "mcp-client",
      clientId: "mcp-client",
      canonicalResourceUri: CANONICAL_RESOURCE,
      serverStrict: true,
      httpStatus: 401,
    }),
    "omitted",
  );
});
