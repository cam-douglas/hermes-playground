import assert from "node:assert/strict";
import { test } from "node:test";
import { fire, githubClaimLedger, linearRealityTicket, slackDriftAlarm } from "./adapters.mjs";
import {
  decide,
  emptyClaim,
  parseClaimText,
  rollup,
  seedClaim19520,
  seedClaim40861,
  seedClaim74427,
} from "./parity.mjs";
import { handle } from "./index.mjs";

test("seed 40861 is already on glass — drift", () => {
  const seed = seedClaim40861();
  const result = decide(seed);
  assert.equal(result.claim.session, "claim-40861");
  assert.equal(result.verdict, "drift");
  assert.equal(result.state, "drift");
  assert.equal(result.decision, "drift");
  assert.equal(result.channels.github, "match");
  assert.equal(result.channels.vercel, "match");
  assert.equal(result.channels.linear, "unverified");
  assert.equal(result.channels.functional, "drift");
  assert.equal(result.claim.probes.functional.messagesSent, 0);
  assert.match(result.claim.text, /Deployed and working/i);
  assert.equal(result.claim.claims.outreach, "Deployed");
  assert.equal(result.claim.claims.adaptFrequency, "Disabled");
  assert.equal(result.claim.claims.service, "active");
});

test("idle word is even, never the product name", () => {
  const result = decide(emptyClaim("idle"));
  assert.equal(result.state, "even");
  assert.equal(result.idleWord, "even");
  assert.equal(result.verdict, "even");
  assert.equal(result.decision, "even");
  assert.equal(result.claim.text, "");
  assert.doesNotMatch(result.state, /parity/i);
  assert.doesNotMatch(result.idleWord, /parity/i);
  const cleared = decide({ action: "clear" });
  assert.equal(cleared.state, "even");
  assert.equal(cleared.idleWord, "even");
  assert.doesNotMatch(cleared.state, /parity/i);
  assert.doesNotMatch(cleared.idleWord, /parity/i);
});

test("seed 19520 fabricated SHA is fabricated", () => {
  const result = decide(seedClaim19520());
  assert.equal(result.claim.session, "claim-19520");
  assert.equal(result.verdict, "fabricated");
  assert.equal(result.state, "fabricated");
  assert.equal(result.channels.github, "fabricated");
  assert.equal(result.claim.claims.sha, "9f3e2a1b");
  assert.equal(result.claim.claims.pr, 88);
  assert.equal(result.claim.probes.github.shaExists, false);
});

test("seed 74427 zero-tool report is fabricated", () => {
  const result = decide(seedClaim74427());
  assert.equal(result.claim.session, "claim-74427");
  assert.equal(result.verdict, "fabricated");
  assert.equal(result.state, "fabricated");
  assert.equal(result.channels.functional, "fabricated");
  assert.equal(result.claim.claims.toolUses, 0);
  assert.equal(result.claim.probes.functional.toolUses, 0);
  assert.match(result.claim.text, /10\/10 PASS/);
});

test("parseClaimText extracts sha and PR", () => {
  const parsed = parseClaimText(
    "Committed sha 9f3e2a1b on the current branch and created a follow-up PR #88 via make_pr.",
  );
  assert.equal(parsed.sha, "9f3e2a1b");
  assert.equal(parsed.pr, 88);
  const fromSeed = parseClaimText(seedClaim19520().text);
  assert.equal(fromSeed.sha, "9f3e2a1b");
  assert.equal(fromSeed.pr, 88);
});

test("matching deploy with agreeing probes is match — unverified linear ignored", () => {
  const result = decide({
    session: "agree-1",
    text: "Deployed and working.",
    claims: { deployed: true, working: true },
    probes: {
      github: { checked: true, deployStatus: "success", shaExists: true },
      vercel: { checked: true, ready: true },
      linear: { checked: false },
      functional: { checked: true, messagesSent: 12, working: true },
    },
  });
  assert.equal(result.verdict, "match");
  assert.equal(result.state, "match");
  assert.equal(result.channels.github, "match");
  assert.equal(result.channels.vercel, "match");
  assert.equal(result.channels.functional, "match");
  assert.equal(result.channels.linear, "unverified");
  assert.equal(
    rollup({ github: "match", vercel: "match", linear: "unverified", functional: "match" }),
    "match",
  );
});

test("demo adapters stay honest without secrets", async () => {
  const drifted = decide(seedClaim40861());
  const sinks = await fire(drifted, {});
  const slack = sinks.events.find((row) => row.adapter === "slack");
  const github = sinks.events.find((row) => row.adapter === "github");
  const linear = sinks.events.find((row) => row.adapter === "linear");
  assert.equal(slack.mode, "demo");
  assert.match(slack.summary, /would post to slack/i);
  assert.match(slack.summary, /drift/i);
  assert.equal(github.mode, "demo");
  assert.match(github.summary, /would write/i);
  assert.match(github.summary, /claim ledger/i);
  assert.equal(linear.mode, "demo");
  assert.match(linear.summary, /would open a linear reality ticket/i);
  assert.doesNotMatch(JSON.stringify(sinks).toLowerCase(), /"mode":"live"/);
  assert.doesNotMatch(slack.summary, /\b200\b/);

  const fake = decide(seedClaim19520());
  const fabricatedSinks = await fire(fake, {});
  const alarm = fabricatedSinks.events.find((row) => row.adapter === "slack");
  assert.equal(alarm.mode, "demo");
  assert.match(alarm.summary, /would post to slack/i);
  assert.match(alarm.summary, /fabricated/i);
});

test("hook handle denies drift and fabricated, allows clear", async () => {
  const drift = await handle(seedClaim40861(), {});
  assert.equal(drift.ok, true);
  assert.equal(drift.product, "parity");
  assert.equal(drift.hook_event_name, "ClaimCheck");
  assert.equal(drift.verdict, "drift");
  assert.equal(drift.permissionDecision, "deny");
  assert.equal(drift.hookSpecificOutput.decision.interrupt, true);
  assert.ok(drift.sinks.some((row) => row.adapter === "slack" && row.mode === "demo"));

  const fake = await handle(seedClaim19520(), {});
  assert.equal(fake.verdict, "fabricated");
  assert.equal(fake.permissionDecision, "deny");
  assert.equal(fake.hookSpecificOutput.decision.interrupt, true);

  const clear = await handle({ action: "clear" }, {});
  assert.equal(clear.verdict, "even");
  assert.equal(clear.state, "even");
  assert.equal(clear.permissionDecision, "allow");
  assert.doesNotMatch(clear.state, /parity/i);

  const empty = await handle(emptyClaim(), {});
  assert.equal(empty.verdict, "even");
  assert.equal(empty.permissionDecision, "allow");

  const slack = slackDriftAlarm(empty, {});
  const github = githubClaimLedger(empty, {});
  const linear = linearRealityTicket(empty, {});
  assert.match(slack.summary, /board is even/i);
  assert.match(github.summary, /board is even/i);
  assert.match(linear.summary, /board is even/i);
  assert.doesNotMatch(
    JSON.stringify({ slack, github, linear }).toLowerCase(),
    /\bgrant\b|\bredact\b|\bveil\b|\bdlp\b|\bspend\b|\bfuse\b|\bkill\b|\bmuster\b/,
  );
});
