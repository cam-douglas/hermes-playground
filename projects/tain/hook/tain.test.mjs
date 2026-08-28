import assert from "node:assert/strict";
import { test } from "node:test";
import {
  fire,
  githubTainLedger,
  linearTainTicket,
  slackTainAlarm,
} from "./adapters.mjs";
import {
  ALARM_VERDICTS,
  IDLE_WORD,
  LINEAR_VERDICTS,
  SLACK_VERDICTS,
  VERDICTS,
  classify,
  decide,
  decideSeed,
  emptyAction,
  emptyProbe,
  seed74667Claimed,
  seed74902Nameless,
  seed78096Stale,
  seed83518Ghost,
  seed86937Strayed,
  seed90257Silvered,
  seed90257Split,
  seedDark,
  seedPaired,
  verdictOf,
} from "./tain.mjs";
import { handle } from "./index.mjs";

test("1 seed 90257 silvered is silvered, slack alarm, idleWord paired", () => {
  const seed = seed90257Silvered();
  const result = decide(seed);
  assert.equal(result.verdict, "silvered");
  assert.equal(result.state, "silvered");
  assert.equal(result.decision, "silvered");
  assert.equal(classify(seed.probe), "silvered");
  assert.equal(verdictOf(seed.probe), "silvered");
  assert.equal(result.alarm, true);
  assert.equal(result.slack, true);
  assert.equal(result.linear, false);
  assert.equal(result.idleWord, "paired");
  assert.equal(IDLE_WORD, "paired");
  assert.doesNotMatch(result.idleWord, /tain/i);
  assert.doesNotMatch(result.idleWord, /kernel/i);
  assert.doesNotMatch(result.idleWord, /latched/i);
  assert.doesNotMatch(result.idleWord, /husked/i);
  assert.equal(result.session, "90257-silvered");
  assert.equal(result.issue, 90257);
  assert.equal(result.liveRendersSession, true);
  assert.equal(result.browsers.length, 0);
  assert.equal(result.tainSilvered, true);
  assert.equal(result.tainLifted, false);
  assert.equal(decideSeed(90257).verdict, "silvered");
  assert.equal(decideSeed("silvered").verdict, "silvered");
});

test("2 idle/clear/{} is paired, never the product name", () => {
  const result = decide(emptyAction("idle"));
  assert.equal(result.state, "paired");
  assert.equal(result.idleWord, "paired");
  assert.equal(result.verdict, "paired");
  assert.equal(result.decision, "paired");
  assert.equal(result.alarm, false);
  assert.equal(classify({}), "paired");
  assert.equal(classify(emptyProbe()), "paired");
  assert.doesNotMatch(result.state, /tain/i);
  assert.doesNotMatch(result.idleWord, /tain/i);
  const cleared = decide({ action: "clear" });
  assert.equal(cleared.state, "paired");
  assert.equal(cleared.idleWord, "paired");
  assert.equal(cleared.browsers.length, 0);
  const empty = decide({});
  assert.equal(empty.verdict, "paired");
  assert.equal(empty.idleWord, "paired");
});

test("3 paired: both sides name the same live device", () => {
  const result = decide(seedPaired());
  assert.equal(result.verdict, "paired");
  assert.equal(result.tainLifted, true);
  assert.equal(result.tainSilvered, false);
  assert.equal(result.alarm, false);
  assert.equal(result.liveRendersSession, true);
  assert.equal(result.browsers.length, 1);
  assert.equal(result.browsers[0].name, "Studio");
  assert.equal(result.assignedName, "Studio");
  assert.equal(result.mcpConnected, true);
  assert.equal(decideSeed("paired").verdict, "paired");
});

test("4 #83518 ghost: extension signed in; MCP not connected", () => {
  const result = decide(seed83518Ghost());
  assert.equal(result.verdict, "ghost");
  assert.equal(result.issue, 83518);
  assert.equal(result.extensionInstalled, true);
  assert.equal(result.extensionEnabled, true);
  assert.equal(result.extensionSignedIn, true);
  assert.equal(result.liveRendersSession, false);
  assert.equal(result.mcpConnected, false);
  assert.equal(result.browsers.length, 0);
  assert.equal(result.alarm, false);
  assert.equal(decideSeed(83518).verdict, "ghost");
  assert.equal(decideSeed("ghost").verdict, "ghost");
});

test("5 #86937 strayed: actions bind to another physical machine", () => {
  const result = decide(seed86937Strayed());
  assert.equal(result.verdict, "strayed");
  assert.equal(result.issue, 86937);
  assert.equal(result.thisMachine, "desk-sydney");
  assert.equal(result.boundMachine, "cowork-cloud");
  assert.equal(result.alarm, true);
  assert.equal(result.linear, true);
  assert.equal(decideSeed(86937).verdict, "strayed");
  assert.equal(decideSeed("strayed").verdict, "strayed");
});

test("6 #74667 claimed: isLocal true for a remote box", () => {
  const result = decide(seed74667Claimed());
  assert.equal(result.verdict, "claimed");
  assert.equal(result.issue, 74667);
  assert.equal(result.browsers[0].isLocal, true);
  assert.equal(result.browsers[0].machineId, "laptop-berlin");
  assert.equal(result.thisMachine, "desk-sydney");
  assert.equal(result.boundMachine, "desk-sydney");
  assert.equal(result.alarm, false);
  assert.equal(decideSeed(74667).verdict, "claimed");
  assert.equal(decideSeed("claimed").verdict, "claimed");
});

test("7 #74902 nameless: Browser 1/2; assigned name lost", () => {
  const result = decide(seed74902Nameless());
  assert.equal(result.verdict, "nameless");
  assert.equal(result.issue, 74902);
  assert.deepEqual(
    result.browsers.map((row) => row.name),
    ["Browser 1", "Browser 2"],
  );
  assert.equal(result.assignedName, "Studio");
  assert.equal(result.renameAppears, false);
  assert.equal(decideSeed(74902).verdict, "nameless");
  assert.equal(decideSeed(90153).verdict, "nameless");
  assert.equal(decideSeed("nameless").verdict, "nameless");
});

test("8 #78096 stale: connectedAt frozen; rename does not appear", () => {
  const result = decide(seed78096Stale());
  assert.equal(result.verdict, "stale");
  assert.equal(result.issue, 78096);
  assert.equal(result.connectedAtFrozen, true);
  assert.equal(result.renameAppears, false);
  assert.equal(result.assignedName, "Studio East");
  assert.equal(result.browsers[0].name, "Studio");
  assert.equal(decideSeed(78096).verdict, "stale");
  assert.equal(decideSeed(89302).verdict, "stale");
  assert.equal(decideSeed("stale").verdict, "stale");
});

test("9 #90257 split: two native-host manifests claim the same extension id", () => {
  const result = decide(seed90257Split());
  assert.equal(result.verdict, "split");
  assert.equal(result.issue, 90257);
  assert.equal(result.nativeHosts.length, 2);
  assert.equal(result.nativeHosts[0].extensionId, result.nativeHosts[1].extensionId);
  assert.equal(result.nativeHosts[0].source, "Claude.app");
  assert.equal(result.nativeHosts[1].source, "Claude Code");
  assert.equal(result.browsers.length, 1);
  assert.equal(decideSeed("split").verdict, "split");
  assert.equal(decideSeed("90257-split").verdict, "split");
});

test("10 dark: neither side connected", () => {
  const result = decide(seedDark());
  assert.equal(result.verdict, "dark");
  assert.equal(result.glassDark, true);
  assert.equal(result.extensionInstalled, false);
  assert.equal(result.extensionSignedIn, false);
  assert.equal(result.browsers.length, 0);
  assert.equal(result.mcpConnected, false);
  assert.equal(decideSeed("dark").verdict, "dark");
});

test("11 first-match: silvered beats ghost when the glass live-renders an empty list", () => {
  const verdict = classify({
    extensionInstalled: true,
    extensionEnabled: true,
    extensionSignedIn: true,
    liveRendersSession: true,
    browsers: [],
    mcpConnected: false,
    mcpMessage: "not connected",
  });
  assert.equal(verdict, "silvered");
});

test("12 first-match: split beats paired when two hosts claim the same id", () => {
  const verdict = classify({
    extensionInstalled: true,
    extensionEnabled: true,
    extensionSignedIn: true,
    liveRendersSession: true,
    sessionId: "dev_studio",
    assignedName: "Studio",
    thisMachine: "desk-sydney",
    boundMachine: "desk-sydney",
    mcpConnected: true,
    browsers: [
      {
        name: "Studio",
        deviceId: "dev_studio",
        isLocal: true,
        machineId: "desk-sydney",
      },
    ],
    nativeHosts: [
      { source: "Claude.app", extensionId: "com.anthropic.claude_in_chrome" },
      { source: "Claude Code", extensionId: "com.anthropic.claude_in_chrome" },
    ],
  });
  assert.equal(verdict, "split");
});

test("13 first-match: strayed beats claimed when bind and isLocal both lie", () => {
  const verdict = classify({
    extensionInstalled: true,
    extensionEnabled: true,
    extensionSignedIn: true,
    liveRendersSession: true,
    thisMachine: "desk-sydney",
    boundMachine: "cowork-cloud",
    mcpConnected: true,
    browsers: [
      {
        name: "Studio",
        deviceId: "dev_studio",
        isLocal: true,
        machineId: "cowork-cloud",
      },
    ],
  });
  assert.equal(verdict, "strayed");
});

test("14 first-match: nameless beats stale on generic Browser 1/2", () => {
  const verdict = classify({
    extensionInstalled: true,
    extensionEnabled: true,
    extensionSignedIn: true,
    liveRendersSession: true,
    thisMachine: "desk-sydney",
    boundMachine: "desk-sydney",
    assignedName: "Studio",
    mcpConnected: true,
    connectedAtFrozen: true,
    renameAppears: false,
    browsers: [
      { name: "Browser 1", deviceId: "a", isLocal: true, machineId: "desk-sydney" },
      { name: "Browser 2", deviceId: "b", isLocal: true, machineId: "desk-sydney" },
    ],
  });
  assert.equal(verdict, "nameless");
});

test("15 verdict vocabulary is exactly the nine words", () => {
  assert.deepEqual(VERDICTS, [
    "paired",
    "silvered",
    "ghost",
    "strayed",
    "claimed",
    "nameless",
    "stale",
    "split",
    "dark",
  ]);
  assert.deepEqual(SLACK_VERDICTS, ["silvered", "strayed"]);
  assert.deepEqual(ALARM_VERDICTS, ["silvered", "strayed"]);
  assert.deepEqual(LINEAR_VERDICTS, ["strayed"]);
});

test("16 every seeded class classifies to itself", () => {
  const rows = [
    ["paired", seedPaired],
    ["silvered", seed90257Silvered],
    ["ghost", seed83518Ghost],
    ["strayed", seed86937Strayed],
    ["claimed", seed74667Claimed],
    ["nameless", seed74902Nameless],
    ["stale", seed78096Stale],
    ["split", seed90257Split],
    ["dark", seedDark],
  ];
  for (const [word, seed] of rows) {
    assert.equal(decide(seed()).verdict, word, word);
    assert.equal(classify(seed().probe), word, word);
  }
});

test("17 admit does not lie: silvered stays silvered", () => {
  const result = decide({ ...seed90257Silvered(), action: "admit" });
  assert.equal(result.verdict, "silvered");
  assert.equal(result.action, "admit");
});

test("18 demo sinks: Slack on silvered/strayed; Linear on strayed; GitHub always", async () => {
  const silvered = decide(seed90257Silvered());
  const slack = slackTainAlarm(silvered, {});
  assert.match(slack.summary, /Would post to Slack/);
  assert.equal(slack.mode, "demo");
  assert.match(linearTainTicket(silvered, {}).summary, /Would skip Linear/);
  assert.match(githubTainLedger(silvered, {}).summary, /Would open a GitHub pairing-ledger/);
  const strayed = decide(seed86937Strayed());
  assert.match(slackTainAlarm(strayed, {}).summary, /Would post to Slack/);
  assert.match(linearTainTicket(strayed, {}).summary, /Would open a Linear stray-browser/);
  const paired = decide(seedPaired());
  assert.match(slackTainAlarm(paired, {}).summary, /Would skip Slack/);
  assert.match(linearTainTicket(paired, {}).summary, /Would skip Linear/);
  const fired = await fire(silvered, {});
  assert.equal(fired.events.length, 3);
  assert.equal(fired.events.every((row) => row.ok === true), true);
});

test("19 handle scores default seed and deny on silvered", async () => {
  const out = await handle(seed90257Silvered(), {});
  assert.equal(out.verdict, "silvered");
  assert.equal(out.permissionDecision, "deny");
  assert.equal(out.idleWord, "paired");
  assert.ok(Array.isArray(out.sinks));
  const idle = await handle({ action: "clear" }, {});
  assert.equal(idle.verdict, "paired");
  assert.equal(idle.permissionDecision, "allow");
});

test("20 no invented issue numbers on seeds", () => {
  const allowed = new Set([90257, 83518, 86937, 74667, 74902, 78096, 90153, 89302, null]);
  const seeds = [
    seedPaired(),
    seed90257Silvered(),
    seed83518Ghost(),
    seed86937Strayed(),
    seed74667Claimed(),
    seed74902Nameless(),
    seed78096Stale(),
    seed90257Split(),
    seedDark(),
  ];
  for (const seed of seeds) {
    assert.ok(allowed.has(seed.issue), String(seed.issue));
  }
});
