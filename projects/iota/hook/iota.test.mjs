import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  fire,
  githubIotaLedger,
  linearIotaTicket,
  slackIotaAlarm,
} from "./adapters.mjs";
import {
  ALARM_VERDICTS,
  IDLE_WORD,
  KEYS_90438,
  LINEAR_VERDICTS,
  SLACK_VERDICTS,
  VERDICTS,
  analyze,
  boundOf,
  caseOnlyPair,
  classify,
  cloneProbe,
  clusterKeys,
  clusterOf,
  decide,
  decideSeed,
  emptyAction,
  emptyProbe,
  feedOf,
  flagsOf,
  foldIdentity,
  foldSeparators,
  forbiddenIdleWords,
  identityFault,
  isIdle,
  parseSessionTrace,
  powerShellDuplicate,
  reasonsOf,
  score,
  seed90438Split,
  seedAliased,
  seedBound,
  seedDropped,
  seedHidden,
  seedMixed,
  seedOpen,
  seedTrue,
  seedTwinned,
  seedUnparseable,
  slashOnlyPair,
  splitOf,
  twinnedOf,
  verdictOf,
} from "./iota.mjs";
import { handle, listen } from "./index.mjs";

function assertIdleNeverIota(result) {
  assert.equal(result.idleWord, "bound");
  assert.equal(IDLE_WORD, "bound");
  assert.doesNotMatch(result.idleWord, /iota/i);
  assert.doesNotMatch(IDLE_WORD, /iota/i);
  assert.doesNotMatch(result.idleWord, /type-case|casing|fold|folded/i);
  assert.doesNotMatch(result.idleWord, /empty/i);
  assert.doesNotMatch(IDLE_WORD, /empty/i);
  assert.doesNotMatch(
    result.idleWord,
    /stilled|drained|flat|fit|spoilt|laid|unlinked|tight|banked|roosted|stocked|seated|heard|clear|paired|kernel|latched|upheld|sterling|home|valid|dry|sealed|quiet|seised|stabled/,
  );
}

function assertScoreShape(result) {
  assert.equal(typeof result.verdict, "string");
  assert.ok(Array.isArray(result.reasons));
  assert.ok(Array.isArray(result.cluster));
  assert.equal(typeof result.bound, "boolean");
  assert.equal(typeof result.split, "boolean");
  assert.equal(typeof result.twinned, "boolean");
  assert.equal(typeof result.feed, "string");
  assert.equal(typeof result.slack, "boolean");
  assert.equal(typeof result.linear, "boolean");
  assert.equal(typeof result.github, "boolean");
}

test("1 seed 90438 split is split, slack, linear, idleWord bound", () => {
  const seed = seed90438Split();
  const result = decide(seed);
  assert.equal(result.verdict, "split");
  assert.equal(result.state, "split");
  assert.equal(result.decision, "split");
  assert.equal(classify(seed.probe), "split");
  assert.equal(verdictOf(seed.probe), "split");
  assert.notEqual(result.verdict, "bound");
  assert.equal(result.alarm, true);
  assert.equal(result.slack, true);
  assert.equal(result.linear, true);
  assert.equal(result.github, true);
  assert.equal(result.caseSplit, true);
  assert.equal(result.caseBound, false);
  assert.equal(result.bound, false);
  assert.equal(result.split, true);
  assert.equal(result.twinned, false);
  assertIdleNeverIota(result);
  assert.equal(result.session, "90438-split");
  assert.equal(result.issue, 90438);
  assert.equal(result.keys.length, 5);
  assert.equal(result.parseError, "DuplicateKeysInJsonString");
  assert.equal(result.mcpWriteKey, "C:/Users//projects/Project1");
  assert.equal(result.sessionReadKey, "C:/Users//projects/project1");
  assert.equal(result.mcpAbsent, true);
  assert.match(result.feed, /\.claude vs \.Claude/i);
  assert.ok(result.cluster.includes("twinned"));
  assert.ok(result.cluster.includes("hidden"));
  assert.ok(result.cluster.includes("unparseable"));
  assert.ok(!result.cluster.includes("split"));
  assert.ok(!result.cluster.includes("bound"));
  assert.equal(decideSeed(90438).verdict, "split");
  assert.equal(decideSeed("split").verdict, "split");
  assert.equal(decideSeed("90438-split").verdict, "split");
});

test("2 idle/empty/{} is bound, never the product name, never empty, never stilled", () => {
  const result = decide(emptyAction("idle"));
  assert.equal(result.state, "bound");
  assert.equal(result.verdict, "bound");
  assert.equal(result.decision, "bound");
  assert.equal(result.alarm, false);
  assert.equal(result.slack, false);
  assert.equal(result.linear, false);
  assert.equal(result.bound, true);
  assert.equal(result.split, false);
  assert.equal(classify({}), "bound");
  assert.equal(classify(emptyProbe()), "bound");
  assert.equal(isIdle(emptyProbe()), true);
  assertIdleNeverIota(result);
  const bailed = decide({ action: "bail" });
  assert.equal(bailed.state, "bound");
  assert.equal(bailed.idleWord, "bound");
  assert.equal(bailed.keys.length, 0);
  assert.doesNotMatch(bailed.state, /iota/i);
  assert.doesNotMatch(bailed.state, /empty/i);
  const empty = decide({});
  assert.equal(empty.verdict, "bound");
  assert.equal(empty.idleWord, "bound");
});

test("3 twinned: two spellings of one directory, no parse, no mcp miss", () => {
  const result = decide(seedTwinned());
  assert.equal(result.verdict, "twinned");
  assert.equal(result.keys.length, 2);
  assert.equal(result.mergedResplit, true);
  assert.equal(result.parseError, "");
  assert.equal(result.alarm, true);
  assert.equal(result.slack, true);
  assert.equal(result.linear, true);
  assert.equal(result.twinned, true);
  assert.match(result.feed, /two or more spellings/i);
  assert.equal(decideSeed("twinned").verdict, "twinned");
});

test("4 hidden: mcp add wrote Project1, session read project1", () => {
  const result = decide(seedHidden());
  assert.equal(result.verdict, "hidden");
  assert.equal(result.mcpWriteKey, "C:/Users//projects/Project1");
  assert.equal(result.sessionReadKey, "C:/Users//projects/project1");
  assert.equal(result.mcpAbsent, true);
  assert.equal(result.parseError, "");
  assert.equal(result.alarm, true);
  assert.equal(result.slack, true);
  assert.equal(result.linear, false);
  assert.match(result.feed, /silently absent/i);
  assert.equal(decideSeed("hidden").verdict, "hidden");
});

test("5 unparseable: DuplicateKeysInJsonString, no mcp miss", () => {
  const result = decide(seedUnparseable());
  assert.equal(result.verdict, "unparseable");
  assert.equal(result.parseError, "DuplicateKeysInJsonString");
  assert.equal(result.mcpWriteKey, "");
  assert.equal(result.alarm, true);
  assert.equal(result.slack, true);
  assert.equal(result.linear, true);
  assert.match(result.feed, /DuplicateKeysInJsonString/);
  assert.equal(decideSeed("unparseable").verdict, "unparseable");
});

test("6 dropped: 32 permissions.allow ignored; C: vs c:", () => {
  const result = decide(seedDropped());
  assert.equal(result.verdict, "dropped");
  assert.equal(result.permissionsAllow, 32);
  assert.equal(result.permissionsHonored, 0);
  assert.equal(result.doeFoldsSeparators, true);
  assert.equal(result.doeFoldsDriveCase, false);
  assert.equal(result.alarm, true);
  assert.equal(result.slack, true);
  assert.equal(result.linear, true);
  assert.match(result.feed, /permissions\.allow ignored/i);
  assert.equal(decideSeed("dropped").verdict, "dropped");
});

test("7 mixed: installed_plugins.json mixed-case duplicates", () => {
  const result = decide(seedMixed());
  assert.equal(result.verdict, "mixed");
  assert.equal(result.pluginsKeys.length, 2);
  assert.equal(result.alarm, true);
  assert.equal(result.slack, true);
  assert.equal(result.linear, false);
  assert.match(result.feed, /installed_plugins/i);
  assert.equal(decideSeed("mixed").verdict, "mixed");
});

test("8 open: headersHelper never runs on slash mismatch", () => {
  const result = decide(seedOpen());
  assert.equal(result.verdict, "open");
  assert.equal(result.helperRan, false);
  assert.ok(result.trustWriteKey);
  assert.ok(result.trustLookupKey);
  assert.equal(result.alarm, false);
  assert.match(result.feed, /helper never runs/i);
  assert.equal(decideSeed("open").verdict, "open");
});

test("9 aliased: same path, only slash direction differs", () => {
  const result = decide(seedAliased());
  assert.equal(result.verdict, "aliased");
  assert.equal(result.keys.length, 2);
  assert.equal(result.helperRan, true);
  assert.equal(result.alarm, true);
  assert.match(result.feed, /slash direction/i);
  assert.equal(decideSeed("aliased").verdict, "aliased");
});

test("10 true: one directory, one key, write matches read", () => {
  const result = decide(seedTrue());
  assert.equal(result.verdict, "true");
  assert.equal(result.keys.length, 1);
  assert.equal(result.mcpWriteKey, result.sessionReadKey);
  assert.equal(result.alarm, false);
  assert.match(result.feed, /identity holds/i);
  assert.equal(decideSeed("true").verdict, "true");
});

test("11 bound seed is bound and never alarms", () => {
  const result = decide(seedBound());
  assert.equal(result.verdict, "bound");
  assert.equal(result.keys.length, 0);
  assert.equal(result.bound, true);
  assert.equal(result.alarm, false);
  assert.equal(result.slack, false);
  assert.equal(result.linear, false);
  assert.match(result.feed, /Bound/);
  assert.equal(decideSeed("bound").verdict, "bound");
});

test("12 score() idle probe is bound and never alarms", () => {
  const result = score(emptyProbe());
  assertScoreShape(result);
  assert.equal(result.verdict, "bound");
  assert.equal(result.slack, false);
  assert.equal(result.linear, false);
  assert.equal(result.github, true);
  assert.equal(result.alarm, false);
  assert.equal(result.bound, true);
  assert.equal(result.split, false);
  assert.equal(result.twinned, false);
});

test("13 verdict vocabulary is exactly the ten words", () => {
  assert.deepEqual(VERDICTS, [
    "bound",
    "split",
    "twinned",
    "hidden",
    "unparseable",
    "dropped",
    "mixed",
    "open",
    "aliased",
    "true",
  ]);
  assert.deepEqual(SLACK_VERDICTS, [
    "split",
    "twinned",
    "hidden",
    "unparseable",
    "dropped",
    "mixed",
    "aliased",
  ]);
  assert.deepEqual(ALARM_VERDICTS, SLACK_VERDICTS);
  assert.deepEqual(LINEAR_VERDICTS, ["split", "twinned", "unparseable", "dropped"]);
  assert.equal(IDLE_WORD, "bound");
  assert.doesNotMatch(IDLE_WORD, /iota/i);
  assert.doesNotMatch(IDLE_WORD, /empty/i);
  assert.doesNotMatch(IDLE_WORD, /stilled|drained|flat|fit|spoilt|stabled|seised|casing|fold/);
  assert.doesNotMatch(VERDICTS.join(" "), /empty|iota|stilled|drained|flat|fit|spoilt|stabled/);
});

test("14 every seeded class classifies to itself", () => {
  const rows = [
    ["bound", seedBound],
    ["split", seed90438Split],
    ["twinned", seedTwinned],
    ["hidden", seedHidden],
    ["unparseable", seedUnparseable],
    ["dropped", seedDropped],
    ["mixed", seedMixed],
    ["open", seedOpen],
    ["aliased", seedAliased],
    ["true", seedTrue],
  ];
  for (const [word, seed] of rows) {
    assert.equal(decide(seed()).verdict, word, word);
    assert.equal(classify(seed().probe), word, word);
    assert.equal(score(seed().probe).verdict, word, word);
  }
});

test("15 admit does not lie: split stays split", () => {
  const result = decide({ ...seed90438Split(), action: "admit" });
  assert.equal(result.verdict, "split");
  assert.equal(result.action, "admit");
  assert.doesNotMatch(result.verdict, /bound/);
  assert.doesNotMatch(result.verdict, /iota/i);
});

test("16 score / stamp / throw scores split", () => {
  const result = decide({ ...seed90438Split(), action: "score" });
  assert.equal(result.verdict, "split");
  assert.equal(result.action, "score");
  assert.equal(result.parseError, "DuplicateKeysInJsonString");
  const stamped = decide({ ...seed90438Split(), action: "stamp" });
  assert.equal(stamped.verdict, "split");
  assert.equal(stamped.action, "stamp");
  const thrown = decide({ ...seed90438Split(), action: "throw" });
  assert.equal(thrown.verdict, "split");
  assert.equal(thrown.action, "score");
});

test("17 bail / bound returns idle bound", () => {
  const bailed = decide({ ...seed90438Split(), action: "bail" });
  assert.equal(bailed.verdict, "bound");
  assert.equal(bailed.action, "bail");
  assert.equal(bailed.keys.length, 0);
  assert.equal(isIdle(bailed.probe), true);
  assertIdleNeverIota(bailed);
  const idle = decide({ ...seedUnparseable(), action: "bound" });
  assert.equal(idle.verdict, "bound");
  const still = decide({ ...seedHidden(), action: "still" });
  assert.equal(still.verdict, "bound");
});

test("18 case on idle produces split drawer", () => {
  const result = decide({ action: "case", probe: emptyProbe() });
  assert.equal(result.verdict, "split");
  assert.equal(result.action, "case");
  assert.equal(result.keys.length, 5);
  assert.equal(result.parseError, "DuplicateKeysInJsonString");
  assert.equal(result.split, true);
});

test("19 case on a twinned probe becomes split", () => {
  const result = decide({ ...seedTwinned(), action: "case" });
  assert.equal(result.verdict, "split");
  assert.equal(result.action, "case");
  assert.equal(result.mcpAbsent, true);
});

test("20 ledger marks the case sound and does not lie", () => {
  const result = decide({ ...seed90438Split(), action: "ledger" });
  assert.equal(result.verdict, "split");
  assert.equal(result.action, "ledger");
  assert.equal(result.observed, true);
  assert.ok(result.reasons.some((line) => /Case sounded/.test(line)));
});

test("21 observe on unparseable stays unparseable", () => {
  const result = decide({ ...seedUnparseable(), action: "observe" });
  assert.equal(result.verdict, "unparseable");
  assert.equal(result.observed, true);
  assert.equal(result.parseError, "DuplicateKeysInJsonString");
});

test("22 split beats unparseable/hidden/twinned when the full #90438 signature is present", () => {
  assert.equal(
    classify({
      keys: KEYS_90438.slice(),
      parseError: "DuplicateKeysInJsonString",
      mcpWriteKey: "C:/Users//projects/Project1",
      sessionReadKey: "C:/Users//projects/project1",
      mcpAbsent: true,
    }),
    "split",
  );
  assert.equal(identityFault(seed90438Split().probe), true);
});

test("23 unparseable is parse only, without the mcp miss", () => {
  assert.equal(
    classify({
      keys: [
        "C:/Users//.claude/projects/Project1",
        "C:/Users//.Claude/projects/Project1",
      ],
      parseError: "DuplicateKeysInJsonString",
    }),
    "unparseable",
  );
});

test("24 hidden requires mcp write vs session read, not just keys", () => {
  assert.equal(classify({ keys: ["C:/Users//projects/Project1"] }), "true");
  assert.equal(
    classify({
      mcpWriteKey: "C:/Users//projects/Project1",
      sessionReadKey: "C:/Users//projects/project1",
    }),
    "hidden",
  );
});

test("25 twinned requires two spellings without parse or mcp miss", () => {
  assert.equal(classify({ keys: ["D:\\repos\\qoreai\\jupyter"] }), "true");
  assert.equal(
    classify({
      keys: ["D:\\repos\\qoreai\\jupyter", "D:\\repos\\QoreAI\\jupyter"],
    }),
    "twinned",
  );
});

test("26 nested drawer / typecase / proof / identity fields clone", () => {
  const probe = cloneProbe({
    drawer: {
      keys: KEYS_90438.slice(),
      parseError: "DuplicateKeysInJsonString",
      mcpWriteKey: "C:/Users//projects/Project1",
      sessionReadKey: "C:/Users//projects/project1",
    },
  });
  assert.equal(classify(probe), "split");
  const typecase = cloneProbe({
    typecase: {
      keys: [
        "C:/Users//.claude/projects/Project1",
        "C:/Users//.Claude/projects/Project1",
      ],
      parseError: "DuplicateKeysInJsonString",
    },
  });
  assert.equal(classify(typecase), "unparseable");
});

test("27 flagsOf matches slack / linear / github", () => {
  assert.deepEqual(flagsOf("split"), { slack: true, linear: true, github: true, alarm: true });
  assert.deepEqual(flagsOf("twinned"), { slack: true, linear: true, github: true, alarm: true });
  assert.deepEqual(flagsOf("hidden"), { slack: true, linear: false, github: true, alarm: true });
  assert.deepEqual(flagsOf("unparseable"), { slack: true, linear: true, github: true, alarm: true });
  assert.deepEqual(flagsOf("dropped"), { slack: true, linear: true, github: true, alarm: true });
  assert.deepEqual(flagsOf("mixed"), { slack: true, linear: false, github: true, alarm: true });
  assert.deepEqual(flagsOf("aliased"), { slack: true, linear: false, github: true, alarm: true });
  assert.deepEqual(flagsOf("bound"), { slack: false, linear: false, github: true, alarm: false });
  assert.deepEqual(flagsOf("open"), { slack: false, linear: false, github: true, alarm: false });
  assert.deepEqual(flagsOf("true"), { slack: false, linear: false, github: true, alarm: false });
});

test("28 bound / split / twinned helpers", () => {
  assert.equal(boundOf(seed90438Split().probe), false);
  assert.equal(splitOf(seed90438Split().probe), true);
  assert.equal(twinnedOf(seed90438Split().probe), false);
  assert.equal(boundOf(emptyProbe()), true);
  assert.equal(twinnedOf(seedTwinned().probe), true);
  assert.equal(splitOf(seedTwinned().probe), false);
  assert.equal(boundOf(seedHidden().probe), false);
});

test("29 feed and reasons never use iota or empty as the idle word", () => {
  const idle = score(emptyProbe());
  assert.equal(idle.idleWord, "bound");
  assert.doesNotMatch(idle.feed, /idle word is iota/i);
  assert.doesNotMatch(idle.feed, /idle word is empty/i);
  assert.ok(idle.reasons.every((line) => !/idle word is iota/i.test(line)));
  assert.ok(idle.reasons.every((line) => !/idle word is empty/i.test(line)));
  assert.match(feedOf(emptyProbe(), "bound"), /Bound/);
  assert.ok(reasonsOf(emptyProbe(), "bound").some((line) => /idle word is bound/.test(line)));
});

test("30 forbidden idle list includes iota, type-case, casing, fold, empty, leftover names", () => {
  const words = forbiddenIdleWords();
  assert.ok(words.includes("iota"));
  assert.ok(words.includes("type-case"));
  assert.ok(words.includes("casing"));
  assert.ok(words.includes("fold"));
  assert.ok(words.includes("folded"));
  assert.ok(words.includes("empty"));
  assert.ok(words.includes("stilled"));
  assert.ok(words.includes("drained"));
  assert.ok(words.includes("stabled"));
  assert.ok(words.includes("seised"));
  assert.ok(words.includes("jot"));
  assert.ok(words.includes("galley"));
  assert.ok(words.includes("cadastre"));
  assert.ok(words.includes("leat"));
  assert.ok(words.includes("reed"));
  assert.ok(words.includes("gasket"));
  assert.ok(!words.includes("bound"));
});

test("31 demo sinks: Slack on alarm; Linear on split/twinned/unparseable/dropped; GitHub always", async () => {
  const split = decide(seed90438Split());
  const slack = slackIotaAlarm(split, {});
  assert.equal(slack.mode, "demo");
  assert.match(slack.summary, /Would post to Slack/);
  const github = githubIotaLedger(split, {});
  assert.equal(github.mode, "demo");
  assert.match(github.summary, /Would open a GitHub iota-ledger/);
  const linear = linearIotaTicket(split, {});
  assert.equal(linear.mode, "demo");
  assert.match(linear.summary, /Would open a Linear ticket/);
  const honest = decide(seedTrue());
  const linearSkip = linearIotaTicket(honest, {});
  assert.equal(linearSkip.mode, "demo");
  assert.match(linearSkip.summary, /Would skip Linear/);
  const idle = decide(emptyAction("idle"));
  assert.match(slackIotaAlarm(idle, {}).summary, /Would skip Slack/);
  assert.match(linearIotaTicket(idle, {}).summary, /Would skip Linear/);
  const fired = await fire(split, {});
  assert.equal(fired.events.length, 3);
  assert.ok(fired.events.every((row) => row.ok === true));
});

test("32 Slack live plan uses SLACK_WEBHOOK alias and GITHUB_TOKEN alias", () => {
  const split = decide(seed90438Split());
  const slack = slackIotaAlarm(split, { SLACK_WEBHOOK: "https://hooks.example/y" });
  assert.equal(slack.mode, "live");
  const github = githubIotaLedger(split, { GITHUB_TOKEN: "tok" });
  assert.equal(github.mode, "live");
  const linear = linearIotaTicket(split, { LINEAR_API_KEY: "lin" });
  assert.equal(linear.mode, "live");
});

test("33 Slack skip on bound / open / true", () => {
  for (const seed of [seedBound, seedOpen, seedTrue]) {
    const result = decide(seed());
    assert.equal(result.slack, false, result.verdict);
    assert.match(slackIotaAlarm(result, {}).summary, /Would skip Slack/);
  }
});

test("34 Linear only on split, twinned, unparseable, and dropped", () => {
  assert.equal(decide(seed90438Split()).linear, true);
  assert.equal(decide(seedTwinned()).linear, true);
  assert.equal(decide(seedUnparseable()).linear, true);
  assert.equal(decide(seedDropped()).linear, true);
  assert.equal(decide(seedHidden()).linear, false);
  assert.equal(decide(seedMixed()).linear, false);
  assert.equal(decide(seedAliased()).linear, false);
  assert.equal(decide(seedBound()).linear, false);
});

test("35 GitHub ledger fires on idle/bail scored probes too", () => {
  const idle = decide(emptyAction("idle"));
  assert.equal(idle.github, true);
  assert.equal(score(emptyProbe()).github, true);
  const bailed = decide({ action: "bail" });
  assert.equal(bailed.github, true);
});

test("36 handle split / twinned / hidden / unparseable / dropped / mixed / aliased deny", async () => {
  const split = await handle(seed90438Split(), {});
  assert.equal(split.permissionDecision, "deny");
  assert.match(split.hookSpecificOutput.decision.message, /split/);
  const twinned = await handle(seedTwinned(), {});
  assert.equal(twinned.permissionDecision, "deny");
  const hidden = await handle(seedHidden(), {});
  assert.equal(hidden.permissionDecision, "deny");
  const unparseable = await handle(seedUnparseable(), {});
  assert.equal(unparseable.permissionDecision, "deny");
  const dropped = await handle(seedDropped(), {});
  assert.equal(dropped.permissionDecision, "deny");
  const mixed = await handle(seedMixed(), {});
  assert.equal(mixed.permissionDecision, "deny");
  const aliased = await handle(seedAliased(), {});
  assert.equal(aliased.permissionDecision, "deny");
});

test("37 handle bound / open / true allow", async () => {
  const idle = await handle({ action: "bail" }, {});
  assert.equal(idle.permissionDecision, "allow");
  assert.match(idle.hookSpecificOutput.decision.message, /bound/);
  const open = await handle(seedOpen(), {});
  assert.equal(open.permissionDecision, "allow");
  const honest = await handle(seedTrue(), {});
  assert.equal(honest.permissionDecision, "allow");
});

test("38 listen GET health and POST empty body is bound", async () => {
  const server = listen(19092);
  await new Promise((resolve) => server.once("listening", resolve));
  const health = await fetch("http://127.0.0.1:19092/health");
  const info = await health.json();
  assert.equal(info.product, "iota");
  assert.match(info.verbs, /split/);
  const res = await fetch("http://127.0.0.1:19092/", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: "{}",
  });
  const body = await res.json();
  assert.equal(body.verdict, "bound");
  assert.equal(body.idleWord, "bound");
  const scored = await fetch("http://127.0.0.1:19092/", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(seed90438Split()),
  });
  const scoredBody = await scored.json();
  assert.equal(scoredBody.verdict, "split");
  await new Promise((resolve) => server.close(resolve));
});

test("39 listen rejects non-JSON and GET-only verbs besides health", async () => {
  const server = listen(19093);
  await new Promise((resolve) => server.once("listening", resolve));
  const bad = await fetch("http://127.0.0.1:19093/", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: "{",
  });
  assert.equal(bad.status, 400);
  const put = await fetch("http://127.0.0.1:19093/", { method: "PUT" });
  assert.equal(put.status, 405);
  await new Promise((resolve) => server.close(resolve));
});

test("40 every verdict is uniquely first-match on its seed", () => {
  const map = {
    bound: seedBound,
    split: seed90438Split,
    twinned: seedTwinned,
    hidden: seedHidden,
    unparseable: seedUnparseable,
    dropped: seedDropped,
    mixed: seedMixed,
    open: seedOpen,
    aliased: seedAliased,
    true: seedTrue,
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

test("41 admit does not lie on every fault class", () => {
  const rows = [
    ["split", seed90438Split],
    ["twinned", seedTwinned],
    ["hidden", seedHidden],
    ["unparseable", seedUnparseable],
    ["dropped", seedDropped],
    ["mixed", seedMixed],
    ["open", seedOpen],
    ["aliased", seedAliased],
    ["true", seedTrue],
  ];
  for (const [word, seed] of rows) {
    const result = decide({ ...seed(), action: "admit" });
    assert.equal(result.verdict, word, word);
    assert.equal(result.action, "admit", word);
  }
});

test("42 desk HTML sanity: idle word bound, seeded split, not leat/reed/gasket", () => {
  const html = readFileSync(fileURLToPath(new URL("../index.html", import.meta.url)), "utf8");
  assert.match(html, /bound/);
  assert.match(html, /Score/);
  assert.match(html, /Bail/);
  assert.match(html, /split/);
  assert.match(html, /90438/);
  assert.match(html, /seedOf\("split"\)|probe = seedOf\("split"\)/);
  assert.doesNotMatch(html, /Admit iota/);
  assert.doesNotMatch(html, /const IDLE_WORD = "iota"/);
  assert.doesNotMatch(html, /const IDLE_WORD = "empty"/);
  assert.doesNotMatch(html, /const IDLE_WORD = "stilled"/);
  assert.doesNotMatch(html, /const IDLE_WORD = "stabled"/);
  assert.match(html, /const IDLE_WORD = "bound"/);
  assert.match(html, /type-case|upper drawer|lower drawer|composing stick|proof/i);
  assert.match(html, /09:50 Sydney · iota/);
  assert.match(html, /second casing is not a plot/i);
  assert.doesNotMatch(html, /class="afterimage"|class="tombstone"|class="inode"|class="chamber"/);
  assert.doesNotMatch(html, /class="booth"|class="punchcard"|class="ballot"/);
  assert.doesNotMatch(html, /class="flange"|class="packing"|class="chest"|class="hinge"|class="lid"/);
  assert.doesNotMatch(html, /class="shop"|class="needle-rail"|class="felt"/);
  assert.doesNotMatch(html, /class="grate-bar"|class="cistern"|class="sludge"|class="pump-house"/);
  assert.doesNotMatch(html, /class="rails"|class="siding"|class="wagons"|class="signal-box"/);
  assert.doesNotMatch(html, /class="sluice"|class="raceway"|class="mill"/);
  assert.doesNotMatch(html, /--shed:|--pitch:|--pine:|--sawdust:/);
  assert.doesNotMatch(html, /--shop:|--felt:|--wool:|--worsted:/);
  assert.doesNotMatch(html, /--concrete:|--bilge:|--silt:|--ochre:/);
  assert.doesNotMatch(html, /--night:|--wagon:/);
  assert.doesNotMatch(html, /--moss:|--water:|--foam:|--algae:/);
  assert.doesNotMatch(html, /Cormorant|Outfit/);
  assert.doesNotMatch(html, /Fraunces|IBM Plex Mono/);
  assert.doesNotMatch(html, /Barlow Condensed|Source Code Pro/);
  assert.doesNotMatch(html, /millimeter slider|millimetre slider/i);
  assert.match(html, /<title>Iota/);
  assert.match(html, /Playfair Display|IBM Plex Sans/);
});

test("43 HTML why-not names Reed, Gasket, Larder, Leat, leftover", () => {
  const html = readFileSync(fileURLToPath(new URL("../index.html", import.meta.url)), "utf8");
  assert.match(html, /NOT Reed/);
  assert.match(html, /NOT Gasket/);
  assert.match(html, /NOT Larder/);
  assert.match(html, /NOT Leat/);
  assert.match(html, /leftover/);
  assert.match(html, /millimeter-slider|millimetre-slider|millimeter slider|millimetre slider/);
  assert.doesNotMatch(html, /Iota is a mill/i);
  assert.doesNotMatch(html, /Iota is a railway/i);
  assert.doesNotMatch(html, /this is a night yard/i);
});

test("44 README names Reed / Gasket / Larder / Leat contrast and bound idle", () => {
  const readme = readFileSync(fileURLToPath(new URL("../README.md", import.meta.url)), "utf8");
  assert.match(readme, /NOT Reed/);
  assert.match(readme, /NOT Gasket/);
  assert.match(readme, /NOT Larder/);
  assert.match(readme, /NOT Leat/);
  assert.match(readme, /leftover/);
  assert.match(readme, /\*\*bound\*\*/);
  assert.match(readme, /#90438|#90438/);
  assert.match(readme, /#75855|#75855/);
  assert.match(readme, /#90041|#90041/);
  assert.doesNotMatch(readme, /idle word is iota/i);
  assert.doesNotMatch(readme, /idle word is stilled/i);
  assert.doesNotMatch(readme, /idle word is stabled/i);
  assert.doesNotMatch(readme, /Iota is a mill/i);
});

test("45 score() split includes split and not bound", () => {
  const result = score(seed90438Split().probe);
  assertScoreShape(result);
  assert.equal(result.verdict, "split");
  assert.equal(result.bound, false);
  assert.equal(result.split, true);
  assert.equal(result.twinned, false);
});

test("46 fire live slack posts when fetch ok", async () => {
  const split = decide(seed90438Split());
  const events = await fire(split, { IOTA_SLACK_WEBHOOK: "https://hooks.example/x" }, async () => ({
    ok: true,
    status: 200,
    json: async () => ({}),
  }));
  const slack = events.events.find((row) => row.adapter === "slack");
  assert.equal(slack.ok, true);
  assert.match(slack.summary, /Posted split/);
});

test("47 fire live github and linear paths", async () => {
  const split = decide(seed90438Split());
  const events = await fire(
    split,
    {
      IOTA_GITHUB_TOKEN: "tok",
      IOTA_LINEAR_KEY: "lin",
      IOTA_LINEAR_TEAM: "team-1",
    },
    async (url) => {
      if (String(url).includes("gists")) {
        return { ok: true, status: 200, json: async () => ({ id: "gist1" }) };
      }
      return {
        ok: true,
        status: 200,
        json: async () => ({
          data: { issueCreate: { success: true, issue: { id: "1", identifier: "IOT-1", url: "https://linear.app/iot-1" } } },
        }),
      };
    },
  );
  const github = events.events.find((row) => row.adapter === "github");
  const linear = events.events.find((row) => row.adapter === "linear");
  assert.equal(github.ok, true);
  assert.match(github.summary, /gist1/);
  assert.equal(linear.ok, true);
  assert.match(linear.summary, /IOT-1/);
});

test("48 reasons cite primary issue numbers on their classes", () => {
  assert.ok(reasonsOf(seed90438Split().probe, "split").some((line) => /#90438/.test(line)));
  assert.ok(reasonsOf(seedUnparseable().probe, "unparseable").some((line) => /#90438/.test(line)));
  assert.ok(reasonsOf(seedDropped().probe, "dropped").some((line) => /#75855/.test(line)));
  assert.ok(reasonsOf(seedOpen().probe, "open").some((line) => /#90041/.test(line)));
});

test("49 adapters stay honest when env is empty — never a fake live HTTP 200", async () => {
  const split = decide(seed90438Split());
  const slack = slackIotaAlarm(split, {});
  const github = githubIotaLedger(split, {});
  const linear = linearIotaTicket(split, {});
  assert.equal(slack.mode, "demo");
  assert.equal(github.mode, "demo");
  assert.equal(linear.mode, "demo");
  assert.doesNotMatch(slack.summary, /HTTP 200/);
  assert.doesNotMatch(github.summary, /HTTP 200/);
  assert.doesNotMatch(linear.summary, /HTTP 200/);
  const fired = await fire(split, {});
  assert.ok(fired.events.every((row) => row.mode === "demo"));
  assert.ok(fired.events.every((row) => !/HTTP 200/.test(row.summary)));
});

test("50 catalog wiring: 36 products, Fusee featured, Iota listed", () => {
  const catalog = JSON.parse(readFileSync(fileURLToPath(new URL("../../../catalog.json", import.meta.url)), "utf8"));
  assert.equal(catalog.products.length, 36);
  const featured = catalog.products.filter((row) => row.featured);
  assert.equal(featured.length, 1);
  assert.equal(featured[0].name, "Fusee");
  const iota = catalog.products.find((row) => row.slug === "iota");
  assert.ok(iota);
  assert.equal(iota.featured, false);
  assert.equal(iota.href, "/iota/");
  assert.equal(iota.day, "2026-08-29");
  assert.match(iota.summary, /09:50|second casing is not a plot|bound/);
  const leat = catalog.products.find((row) => row.slug === "leat");
  assert.ok(leat);
  assert.equal(leat.featured, false);
  assert.match(leat.summary, /08:50|blocked sleep is not a hold|stilled/);
  const slugs = catalog.products.map((row) => row.slug);
  assert.equal(slugs[0], "fusee");
  assert.equal(slugs[1], "iota");
  assert.ok(slugs.includes("leat"));
  assert.ok(slugs.includes("knock"));
  assert.ok(!slugs.includes("jot"));
  assert.ok(!slugs.includes("galley"));
  assert.ok(!slugs.includes("cadastre"));
});

test("51 vercel rewrite order puts /fusee before /iota, /leat and the slug fallback", () => {
  const vercel = JSON.parse(readFileSync(fileURLToPath(new URL("../../../vercel.json", import.meta.url)), "utf8"));
  const sources = vercel.rewrites.map((row) => row.source);
  assert.equal(sources[0], "/fusee");
  assert.equal(sources[1], "/fusee/");
  assert.equal(sources[2], "/iota");
  assert.equal(sources[3], "/iota/");
  assert.ok(sources.includes("/leat"));
  assert.ok(sources.includes("/shunt"));
  assert.ok(sources.includes("/:slug"));
  assert.ok(sources.indexOf("/fusee") < sources.indexOf("/iota"));
  assert.ok(sources.indexOf("/iota") < sources.indexOf("/leat"));
  assert.ok(sources.indexOf("/iota/") < sources.indexOf("/:slug"));
});

test("52 hours.json keeps the 09:50 Sydney Iota ship after Fusee", () => {
  const hours = JSON.parse(readFileSync(fileURLToPath(new URL("../../../runs/hours.json", import.meta.url)), "utf8"));
  assert.equal(hours[0].stem, "2026-08-29-fusee");
  const iota = hours.find((row) => row.stem === "2026-08-29-iota");
  assert.ok(iota);
  assert.equal(iota.date, "2026-08-29");
  assert.equal(iota.time, "09:50");
  assert.equal(iota.tz, "Australia/Sydney");
  assert.equal(iota.title, "Iota");
  assert.equal(iota.kind, "ship");
  assert.match(iota.note, /bound/);
  assert.match(iota.note, /Leat/);
  assert.equal(hours[1].stem, "2026-08-29-iota");
});

test("53 clusterOf on #90438 includes twinned hidden unparseable", () => {
  const cluster = clusterOf(seed90438Split().probe, "split");
  assert.ok(cluster.includes("twinned"));
  assert.ok(cluster.includes("hidden"));
  assert.ok(cluster.includes("unparseable"));
});

test("54 boolean string coercion on probe flags", () => {
  const probe = cloneProbe({
    keys: KEYS_90438.slice(),
    parseError: "DuplicateKeysInJsonString",
    mcpWriteKey: "C:/Users//projects/Project1",
    sessionReadKey: "C:/Users//projects/project1",
    mcpAbsent: "true",
    filesystemCaseInsensitive: "true",
  });
  assert.equal(probe.mcpAbsent, true);
  assert.equal(probe.filesystemCaseInsensitive, true);
  assert.equal(probe.keys.length, 5);
  assert.equal(classify(probe), "split");
});

test("55 parseSessionTrace detects .claude vs .Claude / DuplicateKeysInJsonString / mcp miss", () => {
  const parsed = parseSessionTrace(`
C:/Users//.claude/projects/Project1
C:/Users//.Claude/projects/Project1
ConvertFrom-Json throws DuplicateKeysInJsonString
cmd wrote Project1 so the write landed
session read project1
MCP server is silently absent
`);
  assert.ok(parsed.keys.length >= 2);
  assert.equal(parsed.parseError, "DuplicateKeysInJsonString");
  assert.equal(parsed.mcpWriteKey, "Project1");
  assert.equal(parsed.sessionReadKey, "project1");
  assert.equal(parsed.mcpAbsent, true);
});

test("56 true action scores a single canonical key, not idle bound", () => {
  const result = decide({ ...seed90438Split(), action: "true" });
  assert.equal(result.verdict, "true");
  assert.equal(result.action, "true");
  assert.equal(result.keys.length, 1);
  assert.equal(result.alarm, false);
});

test("57 identity helpers: fold, case-only, slash-only, PowerShell duplicate", () => {
  assert.equal(foldSeparators("C:\\Users\\a"), "C:/Users/a");
  assert.equal(foldIdentity("C:/Users//.Claude/projects/Project1"), foldIdentity("C:/Users//.claude/projects/project1"));
  assert.equal(caseOnlyPair("C:/Users//.claude/projects/Project1", "C:/Users//.Claude/projects/Project1"), true);
  assert.equal(slashOnlyPair("C:/Users//projects/Project1", "C:\\Users\\\\projects\\Project1"), true);
  assert.equal(powerShellDuplicate(KEYS_90438.slice(0, 2)), true);
  const groups = clusterKeys(KEYS_90438.slice());
  assert.equal(groups.length, 2);
  assert.equal(analyze(seed90438Split().probe).realDirectories, 2);
});

test("58 env example lists IOTA_SLACK_WEBHOOK, IOTA_GITHUB_TOKEN, IOTA_LINEAR_KEY", () => {
  const env = readFileSync(fileURLToPath(new URL("../.env.example", import.meta.url)), "utf8");
  assert.match(env, /IOTA_SLACK_WEBHOOK/);
  assert.match(env, /IOTA_GITHUB_TOKEN/);
  assert.match(env, /IOTA_LINEAR_KEY/);
});
