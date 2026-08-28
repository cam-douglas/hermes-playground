import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  fire,
  githubLarderLedger,
  linearLarderTicket,
  slackLarderAlarm,
} from "./adapters.mjs";
import {
  AGED_BEHIND,
  AGED_DAYS,
  ALARM_VERDICTS,
  IDLE_WORD,
  LINEAR_VERDICTS,
  SLACK_VERDICTS,
  VERDICTS,
  classify,
  cloneProbe,
  decide,
  decideSeed,
  emptyAction,
  emptyProbe,
  feedOf,
  flagsOf,
  forbiddenIdleWords,
  isAgedHold,
  isIdle,
  reasonsOf,
  score,
  seed90329Stamped,
  seedAged,
  seedAisled,
  seedDrifted,
  seedFrozen,
  seedGreened,
  seedLagged,
  seedServed,
  seedStocked,
  seedToggled,
  verdictOf,
} from "./larder.mjs";
import { handle, listen } from "./index.mjs";

function assertIdleNeverLarder(result) {
  assert.equal(result.idleWord, "stocked");
  assert.equal(IDLE_WORD, "stocked");
  assert.doesNotMatch(result.idleWord, /larder/i);
  assert.doesNotMatch(result.state, /larder/i);
  assert.doesNotMatch(IDLE_WORD, /larder/i);
}

function assertScoreShape(result) {
  assert.equal(typeof result.verdict, "string");
  assert.ok(Array.isArray(result.reasons));
  assert.equal(typeof result.feed, "string");
  assert.equal(typeof result.slack, "boolean");
  assert.equal(typeof result.linear, "boolean");
  assert.equal(typeof result.github, "boolean");
}

test("1 seed 90329 stamped is stamped, slack, no linear, idleWord stocked", () => {
  const seed = seed90329Stamped();
  const result = decide(seed);
  assert.equal(result.verdict, "stamped");
  assert.equal(result.state, "stamped");
  assert.equal(result.decision, "stamped");
  assert.equal(classify(seed.probe), "stamped");
  assert.equal(verdictOf(seed.probe), "stamped");
  assert.equal(result.alarm, true);
  assert.equal(result.slack, true);
  assert.equal(result.linear, false);
  assert.equal(result.github, true);
  assert.equal(result.shelfStamped, true);
  assert.equal(result.shelfStocked, false);
  assertIdleNeverLarder(result);
  assert.equal(result.session, "90329-stamped");
  assert.equal(result.issue, 90329);
  assert.equal(result.lastUpdatedAdvanced, true);
  assert.equal(result.pluginFolderMoved, false);
  assert.equal(result.versionsBehind, 3);
  assert.equal(result.daysStale, 0);
  assert.equal(result.autoSyncOn, true);
  assert.equal(result.indicatorsGreen, true);
  assert.equal(result.marketplacePageCurrent, true);
  assert.equal(result.logsPresent, false);
  assert.equal(result.localVersion, "1.69.0");
  assert.equal(result.marketplaceVersion, "1.106.1");
  assert.match(result.feed, /lastUpdated is not a delivery/);
  assert.equal(decideSeed(90329).verdict, "stamped");
  assert.equal(decideSeed("stamped").verdict, "stamped");
  assert.equal(decideSeed("90329-stamped").verdict, "stamped");
});

test("2 idle/empty/{} is stocked, never the product name", () => {
  const result = decide(emptyAction("idle"));
  assert.equal(result.state, "stocked");
  assert.equal(result.verdict, "stocked");
  assert.equal(result.decision, "stocked");
  assert.equal(result.alarm, false);
  assert.equal(result.slack, false);
  assert.equal(result.linear, false);
  assert.equal(classify({}), "stocked");
  assert.equal(classify(emptyProbe()), "stocked");
  assert.equal(isIdle(emptyProbe()), true);
  assertIdleNeverLarder(result);
  const cleared = decide({ action: "clear" });
  assert.equal(cleared.state, "stocked");
  assert.equal(cleared.idleWord, "stocked");
  assert.equal(cleared.lastUpdatedAdvanced, false);
  assert.equal(cleared.pluginFolderMoved, false);
  assert.doesNotMatch(cleared.state, /larder/i);
  const empty = decide({});
  assert.equal(empty.verdict, "stocked");
  assert.equal(empty.idleWord, "stocked");
});

test("3 healthy stocked delivery: folders moved, versions match", () => {
  const result = decide(seedStocked());
  assert.equal(result.verdict, "stocked");
  assert.equal(result.pluginFolderMoved, true);
  assert.equal(result.versionsBehind, 0);
  assert.equal(result.lastUpdatedAdvanced, true);
  assert.equal(result.autoSyncOn, true);
  assert.equal(result.alarm, false);
  assert.equal(result.slack, false);
  assert.equal(result.linear, false);
  assert.equal(result.shelfStocked, true);
  assert.match(result.feed, /Stocked/);
  assert.equal(decideSeed("stocked").verdict, "stocked");
});

test("4 aged: 37 behind, 3 days stale — real #90329 figures", () => {
  const result = decide(seedAged());
  assert.equal(result.verdict, "aged");
  assert.equal(result.issue, 90329);
  assert.equal(result.versionsBehind, 37);
  assert.equal(result.daysStale, 3);
  assert.equal(result.pluginFolderMoved, false);
  assert.equal(result.lastUpdatedAdvanced, true);
  assert.equal(result.otherWorkspacesCurrent, false);
  assert.equal(result.alarm, true);
  assert.equal(result.linear, false);
  assert.match(result.feed, /weeks-stale/);
  assert.ok(result.reasons.some((line) => /37 versions behind/.test(line)));
  assert.ok(result.reasons.some((line) => /1\.69\.0 vs 1\.106\.1/.test(line)));
  assert.equal(decideSeed("aged").verdict, "aged");
  assert.equal(decideSeed("90329-aged").verdict, "aged");
});

test("5 frozen: re-froze after 26 Aug toggle, 28 Aug still empty", () => {
  const result = decide(seedFrozen());
  assert.equal(result.verdict, "frozen");
  assert.equal(result.reFroze, true);
  assert.equal(result.pluginFolderMoved, false);
  assert.equal(result.lastUpdatedAdvanced, true);
  assert.equal(result.autoSyncOn, true);
  assert.equal(result.versionsBehind, 2);
  assert.equal(result.alarm, true);
  assert.equal(result.linear, true);
  assert.match(result.feed, /re-froze/);
  assert.equal(decideSeed("frozen").verdict, "frozen");
});

test("6 toggled: one-shot unstick, folders moved", () => {
  const result = decide(seedToggled());
  assert.equal(result.verdict, "toggled");
  assert.equal(result.toggleUnstick, true);
  assert.equal(result.pluginFolderMoved, true);
  assert.equal(result.versionsBehind, 0);
  assert.equal(result.alarm, false);
  assert.equal(result.slack, false);
  assert.equal(result.linear, false);
  assert.equal(result.github, true);
  assert.match(result.feed, /one-shot unstick/);
  assert.equal(decideSeed("toggled").verdict, "toggled");
});

test("7 served: diagnosing session loaded from this store", () => {
  const result = decide(seedServed());
  assert.equal(result.verdict, "served");
  assert.equal(result.sessionsLoadFromStore, true);
  assert.equal(result.versionsBehind, 2);
  assert.equal(result.pluginFolderMoved, false);
  assert.equal(result.alarm, true);
  assert.equal(result.linear, true);
  assert.match(result.feed, /loaded from THIS frozen store/);
  assert.equal(decideSeed("served").verdict, "served");
});

test("8 drifted: CLI pins behind, autoUpdate on, not a store tick", () => {
  const result = decide(seedDrifted());
  assert.equal(result.verdict, "drifted");
  assert.equal(result.cliPinsBehind, true);
  assert.equal(result.autoUpdateOn, true);
  assert.equal(result.lastUpdatedAdvanced, false);
  assert.equal(result.pluginFolderMoved, false);
  assert.equal(result.versionsBehind, 8);
  assert.equal(result.daysStale, 2);
  assert.equal(result.alarm, true);
  assert.equal(result.linear, false);
  assert.match(result.feed, /not a desktop store tick/);
  assert.equal(decideSeed("drifted").verdict, "drifted");
});

test("9 aisled: sibling workspaces current, this store did not take", () => {
  const result = decide(seedAisled());
  assert.equal(result.verdict, "aisled");
  assert.equal(result.otherWorkspacesCurrent, true);
  assert.equal(result.lastUpdatedAdvanced, true);
  assert.equal(result.pluginFolderMoved, false);
  assert.equal(result.versionsBehind, 2);
  assert.equal(result.alarm, false);
  assert.equal(result.slack, false);
  assert.equal(result.linear, false);
  assert.match(result.feed, /per-store, not machine-wide/);
  assert.equal(decideSeed("aisled").verdict, "aisled");
});

test("10 greened: every indicator green, no log, stamp still", () => {
  const result = decide(seedGreened());
  assert.equal(result.verdict, "greened");
  assert.equal(result.logsPresent, false);
  assert.equal(result.indicatorsGreen, true);
  assert.equal(result.marketplacePageCurrent, true);
  assert.equal(result.autoSyncOn, true);
  assert.equal(result.versionsBehind, 4);
  assert.equal(result.lastUpdatedAdvanced, false);
  assert.equal(result.pluginFolderMoved, false);
  assert.equal(result.daysStale, 1);
  assert.equal(result.alarm, true);
  assert.equal(result.linear, true);
  assert.match(result.feed, /every indicator green/);
  assert.equal(decideSeed("greened").verdict, "greened");
});

test("11 lagged: content clock behind sync stamp, historical", () => {
  const result = decide(seedLagged());
  assert.equal(result.verdict, "lagged");
  assert.equal(result.contentClockBehind, true);
  assert.equal(result.lastUpdatedAdvanced, false);
  assert.equal(result.pluginFolderMoved, false);
  assert.equal(result.versionsBehind, 1);
  assert.equal(result.daysStale, 0);
  assert.equal(result.logsPresent, true);
  assert.equal(result.alarm, false);
  assert.equal(result.slack, false);
  assert.equal(result.linear, false);
  assert.match(result.feed, /two clocks/);
  assert.equal(decideSeed("lagged").verdict, "lagged");
});

test("12 first-match: idle stocked beats every later class", () => {
  assert.equal(classify({}), "stocked");
  assert.equal(classify(emptyProbe()), "stocked");
});

test("13 first-match: toggled beats served when folders moved this tick", () => {
  assert.equal(
    classify({
      toggleUnstick: true,
      pluginFolderMoved: true,
      sessionsLoadFromStore: true,
      versionsBehind: 2,
    }),
    "toggled",
  );
});

test("14 first-match: served beats aged when the session loads from this store", () => {
  assert.equal(
    classify({
      sessionsLoadFromStore: true,
      versionsBehind: 37,
      daysStale: 3,
      pluginFolderMoved: false,
    }),
    "served",
  );
});

test("15 first-match: aged beats drifted when hold is weeks-stale", () => {
  assert.equal(
    classify({
      versionsBehind: 37,
      daysStale: 3,
      pluginFolderMoved: false,
      cliPinsBehind: true,
      autoUpdateOn: true,
      lastUpdatedAdvanced: false,
    }),
    "aged",
  );
});

test("16 first-match: drifted beats aisled / greened when CLI pins lag", () => {
  assert.equal(
    classify({
      cliPinsBehind: true,
      autoUpdateOn: true,
      lastUpdatedAdvanced: false,
      pluginFolderMoved: false,
      otherWorkspacesCurrent: true,
      logsPresent: false,
      indicatorsGreen: true,
      versionsBehind: 8,
      daysStale: 2,
    }),
    "drifted",
  );
});

test("17 first-match: aisled beats frozen when siblings took content", () => {
  assert.equal(
    classify({
      otherWorkspacesCurrent: true,
      lastUpdatedAdvanced: true,
      pluginFolderMoved: false,
      reFroze: true,
      versionsBehind: 2,
    }),
    "aisled",
  );
});

test("18 first-match: frozen beats stamped when the store re-froze", () => {
  assert.equal(
    classify({
      reFroze: true,
      lastUpdatedAdvanced: true,
      pluginFolderMoved: false,
      versionsBehind: 2,
    }),
    "frozen",
  );
});

test("19 first-match: stamped beats greened when the stamp moved", () => {
  assert.equal(
    classify({
      lastUpdatedAdvanced: true,
      pluginFolderMoved: false,
      logsPresent: false,
      indicatorsGreen: true,
      versionsBehind: 3,
    }),
    "stamped",
  );
});

test("20 first-match: greened beats lagged when indicators are green and silent", () => {
  assert.equal(
    classify({
      logsPresent: false,
      indicatorsGreen: true,
      versionsBehind: 4,
      lastUpdatedAdvanced: false,
      pluginFolderMoved: false,
      contentClockBehind: true,
    }),
    "greened",
  );
});

test("21 first-match: lagged beats healthy when only the clocks disagree", () => {
  assert.equal(
    classify({
      contentClockBehind: true,
      lastUpdatedAdvanced: false,
      pluginFolderMoved: false,
      versionsBehind: 1,
      logsPresent: true,
    }),
    "lagged",
  );
});

test("22 first-match: healthy folders + zero behind is stocked", () => {
  assert.equal(
    classify({
      pluginFolderMoved: true,
      versionsBehind: 0,
      lastUpdatedAdvanced: true,
      autoSyncOn: true,
    }),
    "stocked",
  );
});

test("23 score() returns verdict, reasons, feed, slack, linear, github", () => {
  const result = score(seed90329Stamped().probe);
  assertScoreShape(result);
  assert.equal(result.verdict, "stamped");
  assert.equal(result.slack, true);
  assert.equal(result.linear, false);
  assert.equal(result.github, true);
  assert.ok(result.reasons.length > 0);
  assert.match(result.feed, /Stamped/);
});

test("24 score() idle probe is stocked and never alarms", () => {
  const result = score(emptyProbe());
  assertScoreShape(result);
  assert.equal(result.verdict, "stocked");
  assert.equal(result.slack, false);
  assert.equal(result.linear, false);
  assert.equal(result.github, true);
  assert.equal(result.alarm, false);
});

test("25 score() stocked seed never fires Slack or Linear", () => {
  const result = score(seedStocked().probe);
  assert.equal(result.verdict, "stocked");
  assert.equal(result.slack, false);
  assert.equal(result.linear, false);
  assert.equal(result.alarm, false);
});

test("26 score() toggled / lagged / aisled never fire Slack or Linear", () => {
  const toggled = score(seedToggled().probe);
  assert.equal(toggled.verdict, "toggled");
  assert.equal(toggled.slack, false);
  assert.equal(toggled.linear, false);
  assert.equal(toggled.github, true);
  const lagged = score(seedLagged().probe);
  assert.equal(lagged.verdict, "lagged");
  assert.equal(lagged.slack, false);
  assert.equal(lagged.linear, false);
  const aisled = score(seedAisled().probe);
  assert.equal(aisled.verdict, "aisled");
  assert.equal(aisled.slack, false);
  assert.equal(aisled.linear, false);
});

test("27 verdict vocabulary is exactly the ten words", () => {
  assert.deepEqual(VERDICTS, [
    "stocked",
    "stamped",
    "frozen",
    "greened",
    "toggled",
    "drifted",
    "lagged",
    "aisled",
    "aged",
    "served",
  ]);
  assert.deepEqual(SLACK_VERDICTS, [
    "stamped",
    "frozen",
    "greened",
    "drifted",
    "aged",
    "served",
  ]);
  assert.deepEqual(ALARM_VERDICTS, SLACK_VERDICTS);
  assert.deepEqual(LINEAR_VERDICTS, ["frozen", "greened", "served"]);
  assert.equal(IDLE_WORD, "stocked");
  assert.doesNotMatch(IDLE_WORD, /larder/i);
  assert.doesNotMatch(VERDICTS.join(" "), /larder/i);
});

test("28 every seeded class classifies to itself", () => {
  const rows = [
    ["stocked", seedStocked],
    ["stamped", seed90329Stamped],
    ["frozen", seedFrozen],
    ["greened", seedGreened],
    ["toggled", seedToggled],
    ["drifted", seedDrifted],
    ["lagged", seedLagged],
    ["aisled", seedAisled],
    ["aged", seedAged],
    ["served", seedServed],
  ];
  for (const [word, seed] of rows) {
    assert.equal(decide(seed()).verdict, word, word);
    assert.equal(classify(seed().probe), word, word);
    assert.equal(score(seed().probe).verdict, word, word);
  }
});

test("29 admit does not lie: stamped stays stamped", () => {
  const result = decide({ ...seed90329Stamped(), action: "admit" });
  assert.equal(result.verdict, "stamped");
  assert.equal(result.action, "admit");
  assert.doesNotMatch(result.verdict, /larder/i);
  assert.doesNotMatch(result.verdict, /stocked/);
});

test("30 admit stocked on a healthy probe stays stocked", () => {
  const result = decide({ ...seedStocked(), action: "admit" });
  assert.equal(result.verdict, "stocked");
  assert.equal(result.action, "admit");
  assertIdleNeverLarder(result);
});

test("31 admit stocked on idle packs stocked", () => {
  const result = decide({ action: "admit", probe: emptyProbe() });
  assert.equal(result.verdict, "stocked");
  assert.equal(result.action, "admit");
  assert.equal(isIdle(emptyProbe()), true);
});

test("32 admit stocked does not lie on every fault class", () => {
  const rows = [
    ["stamped", seed90329Stamped],
    ["frozen", seedFrozen],
    ["greened", seedGreened],
    ["toggled", seedToggled],
    ["drifted", seedDrifted],
    ["lagged", seedLagged],
    ["aisled", seedAisled],
    ["aged", seedAged],
    ["served", seedServed],
  ];
  for (const [word, seed] of rows) {
    const result = decide({ ...seed(), action: "admit" });
    assert.equal(result.verdict, word, word);
    assert.equal(result.action, "admit", word);
  }
});

test("33 strike on idle produces stocked delivery", () => {
  const result = decide({ action: "strike", probe: emptyProbe() });
  assert.equal(result.verdict, "stocked");
  assert.equal(result.action, "strike");
  assert.equal(result.pluginFolderMoved, true);
  assert.equal(result.versionsBehind, 0);
  assert.equal(result.lastUpdatedAdvanced, true);
  assert.equal(result.autoSyncOn, true);
  assertIdleNeverLarder(result);
});

test("34 strike on a stamped probe stays stamped", () => {
  const result = decide({ ...seed90329Stamped(), action: "strike" });
  assert.equal(result.verdict, "stamped");
  assert.equal(result.action, "strike");
  assert.equal(result.lastUpdatedAdvanced, true);
  assert.equal(result.pluginFolderMoved, false);
});

test("35 clear returns idle stocked", () => {
  const result = decide({ ...seed90329Stamped(), action: "clear" });
  assert.equal(result.verdict, "stocked");
  assert.equal(result.action, "clear");
  assert.equal(result.lastUpdatedAdvanced, false);
  assert.equal(result.pluginFolderMoved, false);
  assert.equal(result.versionsBehind, 0);
  assert.equal(isIdle(result.probe), true);
  assertIdleNeverLarder(result);
});

test("36 primary seed versionsBehind stays under aged threshold", () => {
  const probe = seed90329Stamped().probe;
  assert.ok(probe.versionsBehind < AGED_BEHIND);
  assert.ok(probe.daysStale < AGED_DAYS);
  assert.equal(isAgedHold(probe), false);
  assert.equal(classify(probe), "stamped");
});

test("37 aged threshold is 10 behind or 3 days", () => {
  assert.equal(AGED_BEHIND, 10);
  assert.equal(AGED_DAYS, 3);
  assert.equal(
    classify({ versionsBehind: 10, pluginFolderMoved: false, lastUpdatedAdvanced: true }),
    "aged",
  );
  assert.equal(
    classify({ daysStale: 3, pluginFolderMoved: false, lastUpdatedAdvanced: true }),
    "aged",
  );
  assert.equal(
    classify({
      versionsBehind: 9,
      daysStale: 2,
      pluginFolderMoved: false,
      lastUpdatedAdvanced: true,
    }),
    "stamped",
  );
});

test("38 aged does not fire when folders moved", () => {
  assert.equal(
    classify({
      versionsBehind: 37,
      daysStale: 3,
      pluginFolderMoved: true,
      lastUpdatedAdvanced: true,
    }),
    "stocked",
  );
  assert.equal(isAgedHold({ versionsBehind: 37, pluginFolderMoved: true }), false);
});

test("39 demo sinks: Slack on alarm; Linear on frozen/greened/served; GitHub always", async () => {
  const stamped = decide(seed90329Stamped());
  const slack = slackLarderAlarm(stamped, {});
  assert.match(slack.summary, /Would post to Slack/);
  assert.equal(slack.mode, "demo");
  assert.match(linearLarderTicket(stamped, {}).summary, /Would skip Linear/);
  assert.match(githubLarderLedger(stamped, {}).summary, /Would open a GitHub larder-ledger/);
  const frozen = decide(seedFrozen());
  assert.match(slackLarderAlarm(frozen, {}).summary, /Would post to Slack/);
  assert.match(linearLarderTicket(frozen, {}).summary, /Would open a Linear/);
  const greened = decide(seedGreened());
  assert.match(slackLarderAlarm(greened, {}).summary, /Would post to Slack/);
  assert.match(linearLarderTicket(greened, {}).summary, /Would open a Linear/);
  const served = decide(seedServed());
  assert.match(slackLarderAlarm(served, {}).summary, /Would post to Slack/);
  assert.match(linearLarderTicket(served, {}).summary, /Would open a Linear/);
  const drifted = decide(seedDrifted());
  assert.match(slackLarderAlarm(drifted, {}).summary, /Would post to Slack/);
  assert.match(linearLarderTicket(drifted, {}).summary, /Would skip Linear/);
  const aged = decide(seedAged());
  assert.match(slackLarderAlarm(aged, {}).summary, /Would post to Slack/);
  assert.match(linearLarderTicket(aged, {}).summary, /Would skip Linear/);
  const stocked = decide(seedStocked());
  assert.match(slackLarderAlarm(stocked, {}).summary, /Would skip Slack/);
  assert.match(linearLarderTicket(stocked, {}).summary, /Would skip Linear/);
  const fired = await fire(stamped, {});
  assert.equal(fired.events.length, 3);
  assert.equal(fired.events.every((row) => row.ok === true), true);
});

test("40 stocked never fires Slack even when a webhook is present", () => {
  const stocked = decide(seedStocked());
  const slack = slackLarderAlarm(stocked, { LARDER_SLACK_WEBHOOK: "https://hooks.example/x" });
  assert.match(slack.summary, /Would skip Slack/);
  assert.equal(slack.mode, "demo");
  assert.equal(stocked.alarm, false);
});

test("41 missing secrets stay demo, never a fake live 200", () => {
  const stamped = decide(seed90329Stamped());
  assert.equal(slackLarderAlarm(stamped, {}).mode, "demo");
  assert.equal(githubLarderLedger(stamped, {}).mode, "demo");
  assert.equal(linearLarderTicket(stamped, {}).mode, "demo");
  const stocked = decide(seedStocked());
  assert.equal(slackLarderAlarm(stocked, {}).mode, "demo");
  assert.equal(linearLarderTicket(stocked, {}).mode, "demo");
});

test("42 live Slack plan only when webhook + alarm verdict", () => {
  const stamped = decide(seed90329Stamped());
  const live = slackLarderAlarm(stamped, { LARDER_SLACK_WEBHOOK: "https://hooks.example/x" });
  assert.equal(live.mode, "live");
  assert.equal(live.ok, null);
  assert.match(live.summary, /Posting stamped/);
});

test("43 live GitHub plan only when token present", () => {
  const stocked = decide(seedStocked());
  const live = githubLarderLedger(stocked, { LARDER_GITHUB_TOKEN: "tok" });
  assert.equal(live.mode, "live");
  assert.equal(live.tokenPresent, true);
  assert.match(live.line, /larder/);
});

test("44 live Linear plan only when key + frozen/greened/served", () => {
  const frozen = decide(seedFrozen());
  const live = linearLarderTicket(frozen, { LINEAR_API_KEY: "lin_key" });
  assert.equal(live.mode, "live");
  assert.match(live.summary, /Opening Linear ticket/);
  const stocked = decide(seedStocked());
  assert.equal(linearLarderTicket(stocked, { LINEAR_API_KEY: "lin_key" }).mode, "demo");
  const stamped = decide(seed90329Stamped());
  assert.equal(linearLarderTicket(stamped, { LINEAR_API_KEY: "lin_key" }).mode, "demo");
});

test("45 handle scores default seed and deny on stamped", async () => {
  const out = await handle(seed90329Stamped(), {});
  assert.equal(out.verdict, "stamped");
  assert.equal(out.permissionDecision, "deny");
  assert.equal(out.idleWord, "stocked");
  assert.equal(out.hook_event_name, "UserPromptSubmit");
  assert.doesNotMatch(out.idleWord, /larder/i);
  assert.ok(Array.isArray(out.sinks));
  const idle = await handle({ action: "clear" }, {});
  assert.equal(idle.verdict, "stocked");
  assert.equal(idle.permissionDecision, "allow");
  assert.doesNotMatch(idle.verdict, /larder/i);
});

test("46 handle stocked allows; handle frozen denies", async () => {
  const stocked = await handle(seedStocked(), {});
  assert.equal(stocked.verdict, "stocked");
  assert.equal(stocked.permissionDecision, "allow");
  const frozen = await handle(seedFrozen(), {});
  assert.equal(frozen.verdict, "frozen");
  assert.equal(frozen.permissionDecision, "deny");
});

test("47 handle toggled / lagged / aisled allow because they are not alarms", async () => {
  const toggled = await handle(seedToggled(), {});
  assert.equal(toggled.verdict, "toggled");
  assert.equal(toggled.permissionDecision, "allow");
  assert.equal(toggled.alarm, false);
  const lagged = await handle(seedLagged(), {});
  assert.equal(lagged.verdict, "lagged");
  assert.equal(lagged.permissionDecision, "allow");
  const aisled = await handle(seedAisled(), {});
  assert.equal(aisled.verdict, "aisled");
  assert.equal(aisled.permissionDecision, "allow");
});

test("48 no invented issue numbers on seeds", () => {
  const allowed = new Set([90329, null]);
  const seeds = [
    seedStocked(),
    seed90329Stamped(),
    seedAged(),
    seedFrozen(),
    seedToggled(),
    seedServed(),
    seedDrifted(),
    seedAisled(),
    seedGreened(),
    seedLagged(),
  ];
  for (const seed of seeds) {
    assert.ok(allowed.has(seed.issue), String(seed.issue));
  }
});

test("49 idle word is never the product name on any packed result", () => {
  const seeds = [
    seedStocked(),
    seed90329Stamped(),
    seedAged(),
    seedFrozen(),
    seedToggled(),
    seedServed(),
    seedDrifted(),
    seedAisled(),
    seedGreened(),
    seedLagged(),
    { action: "clear" },
    {},
  ];
  for (const seed of seeds) {
    const packed = decide(seed);
    assert.equal(packed.idleWord, "stocked");
    assert.doesNotMatch(packed.idleWord, /larder/i);
    assert.doesNotMatch(packed.state, /larder/i);
    assert.ok(VERDICTS.includes(packed.verdict), packed.verdict);
  }
});

test("50 idle word is never a reused product idle word", () => {
  const banned = forbiddenIdleWords();
  assert.ok(banned.includes("seated"));
  assert.ok(banned.includes("heard"));
  assert.ok(banned.includes("clear"));
  assert.ok(banned.includes("paired"));
  assert.ok(banned.includes("kernel"));
  assert.ok(banned.includes("larder"));
  assert.ok(!banned.includes("stocked"));
  for (const word of banned) {
    assert.notEqual(IDLE_WORD, word, word);
  }
});

test("51 flagsOf stocked: slack false, linear false, github true", () => {
  const flags = flagsOf("stocked");
  assert.equal(flags.slack, false);
  assert.equal(flags.linear, false);
  assert.equal(flags.github, true);
  assert.equal(flags.alarm, false);
});

test("52 flagsOf stamped: slack true, linear false, github true", () => {
  const flags = flagsOf("stamped");
  assert.equal(flags.slack, true);
  assert.equal(flags.linear, false);
  assert.equal(flags.github, true);
  assert.equal(flags.alarm, true);
});

test("53 flagsOf frozen: slack true, linear true", () => {
  assert.equal(flagsOf("frozen").slack, true);
  assert.equal(flagsOf("frozen").linear, true);
});

test("54 flagsOf greened: slack true, linear true", () => {
  assert.equal(flagsOf("greened").slack, true);
  assert.equal(flagsOf("greened").linear, true);
});

test("55 flagsOf served: slack true, linear true", () => {
  assert.equal(flagsOf("served").slack, true);
  assert.equal(flagsOf("served").linear, true);
});

test("56 flagsOf drifted / aged: slack true, linear false", () => {
  assert.equal(flagsOf("drifted").slack, true);
  assert.equal(flagsOf("drifted").linear, false);
  assert.equal(flagsOf("aged").slack, true);
  assert.equal(flagsOf("aged").linear, false);
});

test("57 flagsOf toggled / lagged / aisled: slack false, linear false, github true", () => {
  assert.equal(flagsOf("toggled").slack, false);
  assert.equal(flagsOf("toggled").linear, false);
  assert.equal(flagsOf("toggled").github, true);
  assert.equal(flagsOf("lagged").slack, false);
  assert.equal(flagsOf("aisled").slack, false);
});

test("58 cloneProbe reads nested store / shelf objects", () => {
  const next = cloneProbe({
    store: { lastUpdatedAdvanced: true, pluginFolderMoved: false },
    shelf: { versionsBehind: 3 },
  });
  assert.equal(next.lastUpdatedAdvanced, true);
  assert.equal(next.pluginFolderMoved, false);
  assert.equal(next.versionsBehind, 3);
});

test("59 cloneProbe accepts a store path string", () => {
  const next = cloneProbe({ storePath: "local-agent-mode-sessions\\\\rpm\\\\" });
  assert.equal(next.storePath, "local-agent-mode-sessions\\\\rpm\\\\");
  assert.match(reasonsOf(next, "stamped").join(" "), /local-agent-mode-sessions/);
});

test("60 isIdle is false on every named seed and true on empty", () => {
  assert.equal(isIdle(emptyProbe()), true);
  assert.equal(isIdle({}), true);
  assert.equal(isIdle(seedStocked().probe), false);
  assert.equal(isIdle(seed90329Stamped().probe), false);
  assert.equal(isIdle(seedAged().probe), false);
  assert.equal(isIdle(seedFrozen().probe), false);
  assert.equal(isIdle(seedToggled().probe), false);
  assert.equal(isIdle(seedServed().probe), false);
  assert.equal(isIdle(seedDrifted().probe), false);
  assert.equal(isIdle(seedAisled().probe), false);
  assert.equal(isIdle(seedGreened().probe), false);
  assert.equal(isIdle(seedLagged().probe), false);
});

test("61 feed lines name each class", () => {
  assert.match(feedOf(emptyProbe(), "stocked"), /Stocked/);
  assert.match(feedOf(seed90329Stamped().probe, "stamped"), /Stamped/);
  assert.match(feedOf(seedFrozen().probe, "frozen"), /Frozen/);
  assert.match(feedOf(seedGreened().probe, "greened"), /Greened/);
  assert.match(feedOf(seedToggled().probe, "toggled"), /Toggled/);
  assert.match(feedOf(seedDrifted().probe, "drifted"), /Drifted/);
  assert.match(feedOf(seedLagged().probe, "lagged"), /Lagged/);
  assert.match(feedOf(seedAisled().probe, "aisled"), /Aisled/);
  assert.match(feedOf(seedAged().probe, "aged"), /Aged/);
  assert.match(feedOf(seedServed().probe, "served"), /Served/);
});

test("62 reasons mention content clock vs sync stamp and the NOT-clone list", () => {
  const stamped = reasonsOf(seed90329Stamped().probe, "stamped");
  assert.ok(stamped.some((line) => /content clock vs sync stamp/.test(line)));
  assert.ok(stamped.some((line) => /NOT Husk/.test(line)));
  assert.ok(stamped.some((line) => /Tappet/.test(line)));
  assert.ok(stamped.some((line) => /PRIMARY #90329/.test(line)));
  const stocked = reasonsOf(seedStocked().probe, "stocked");
  assert.ok(stocked.some((line) => /idle word is stocked/.test(line)));
});

test("63 decideSeed accepts numeric and string keys", () => {
  assert.equal(decideSeed(90329).verdict, "stamped");
  assert.equal(decideSeed("90329-stamped").verdict, "stamped");
  assert.equal(decideSeed("90329-aged").verdict, "aged");
  assert.equal(decideSeed("90329-frozen").verdict, "frozen");
  assert.equal(decideSeed("90329-served").verdict, "served");
  assert.equal(decideSeed("90329-greened").verdict, "greened");
});

test("64 nested action objects are accepted", () => {
  const result = decide({
    action: { action: "score", session: "nested", probe: seed90329Stamped().probe },
  });
  assert.equal(result.verdict, "stamped");
  assert.equal(result.action, "score");
  assert.equal(result.lastUpdatedAdvanced, true);
  assert.equal(result.pluginFolderMoved, false);
});

test("65 fire with live Slack fetch records ok from response", async () => {
  const stamped = decide(seed90329Stamped());
  const fired = await fire(
    stamped,
    { LARDER_SLACK_WEBHOOK: "https://hooks.example/x" },
    async () => ({ ok: true, status: 200, json: async () => ({}) }),
  );
  assert.equal(fired.events[0].adapter, "slack");
  assert.equal(fired.events[0].ok, true);
});

test("66 fire with failing Slack fetch stays honest", async () => {
  const stamped = decide(seed90329Stamped());
  const fired = await fire(
    stamped,
    { LARDER_SLACK_WEBHOOK: "https://hooks.example/x" },
    async () => ({ ok: false, status: 500, json: async () => ({}) }),
  );
  assert.equal(fired.events[0].ok, false);
  assert.match(fired.events[0].summary, /HTTP 500/);
});

test("67 fire GitHub live uses larder-ledger.jsonl", async () => {
  const stocked = decide(seedStocked());
  const fired = await fire(
    stocked,
    { LARDER_GITHUB_TOKEN: "tok" },
    async (_url, init) => {
      const body = JSON.parse(init.body);
      assert.ok(body.files["larder-ledger.jsonl"]);
      return { ok: true, status: 201, json: async () => ({ id: "g1" }) };
    },
  );
  const github = fired.events.find((row) => row.adapter === "github");
  assert.equal(github.ok, true);
  assert.match(github.summary, /g1/);
});

test("68 fire Linear live opens an issue when GraphQL succeeds", async () => {
  const frozen = decide(seedFrozen());
  const fired = await fire(
    frozen,
    { LINEAR_API_KEY: "lin", LARDER_LINEAR_TEAM: "team_1" },
    async () => ({
      ok: true,
      status: 200,
      json: async () => ({
        data: { issueCreate: { success: true, issue: { id: "1", identifier: "L-1", url: "https://linear.app/l-1" } } },
      }),
    }),
  );
  const linear = fired.events.find((row) => row.adapter === "linear");
  assert.equal(linear.ok, true);
  assert.match(linear.summary, /L-1/);
});

test("69 fire Linear live failure stays honest", async () => {
  const frozen = decide(seedFrozen());
  const fired = await fire(
    frozen,
    { LINEAR_API_KEY: "lin" },
    async () => ({
      ok: true,
      status: 200,
      json: async () => ({ errors: [{ message: "no team" }] }),
    }),
  );
  const linear = fired.events.find((row) => row.adapter === "linear");
  assert.equal(linear.ok, false);
  assert.match(linear.summary, /failed/);
});

test("70 listen serves health then can be closed", async () => {
  const server = listen(19329);
  await new Promise((resolve) => server.once("listening", resolve));
  const res = await fetch("http://127.0.0.1:19329/health");
  const body = await res.json();
  assert.equal(body.ok, true);
  assert.equal(body.product, "larder");
  assert.match(body.verbs, /stocked/);
  await new Promise((resolve) => server.close(resolve));
});

test("71 listen POST scores a stamped probe", async () => {
  const server = listen(19330);
  await new Promise((resolve) => server.once("listening", resolve));
  const res = await fetch("http://127.0.0.1:19330/", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(seed90329Stamped()),
  });
  const body = await res.json();
  assert.equal(body.verdict, "stamped");
  assert.equal(body.permissionDecision, "deny");
  await new Promise((resolve) => server.close(resolve));
});

test("72 listen rejects non-JSON POST", async () => {
  const server = listen(19331);
  await new Promise((resolve) => server.once("listening", resolve));
  const res = await fetch("http://127.0.0.1:19331/", {
    method: "POST",
    headers: { "content-type": "text/plain" },
    body: "not-json",
  });
  assert.equal(res.status, 400);
  await new Promise((resolve) => server.close(resolve));
});

test("73 listen rejects GET that is not health", async () => {
  const server = listen(19332);
  await new Promise((resolve) => server.once("listening", resolve));
  const res = await fetch("http://127.0.0.1:19332/other");
  assert.equal(res.status, 405);
  await new Promise((resolve) => server.close(resolve));
});

test("74 slack alarm list never includes stocked, toggled, lagged, or aisled", () => {
  assert.equal(SLACK_VERDICTS.includes("stocked"), false);
  assert.equal(SLACK_VERDICTS.includes("toggled"), false);
  assert.equal(SLACK_VERDICTS.includes("lagged"), false);
  assert.equal(SLACK_VERDICTS.includes("aisled"), false);
  assert.equal(LINEAR_VERDICTS.includes("stocked"), false);
  assert.equal(LINEAR_VERDICTS.includes("stamped"), false);
});

test("75 score reasons always include stamp and shelf lines", () => {
  const stocked = score(seedStocked().probe);
  assert.ok(stocked.reasons.some((line) => /plugin folders moved/.test(line)));
  assert.ok(stocked.reasons.some((line) => /lastUpdated advanced/.test(line)));
  const stamped = score(seed90329Stamped().probe);
  assert.ok(stamped.reasons.some((line) => /plugin folders stood still/.test(line)));
});

test("76 fire fetch throw stays honest", async () => {
  const stamped = decide(seed90329Stamped());
  const fired = await fire(
    stamped,
    { LARDER_SLACK_WEBHOOK: "https://hooks.example/x" },
    async () => {
      throw new Error("network down");
    },
  );
  assert.equal(fired.events[0].ok, false);
  assert.match(fired.events[0].summary, /network down/);
});

test("77 GitHub ledger fires on every scored probe including stocked", () => {
  const seeds = [
    seedStocked(),
    seed90329Stamped(),
    seedAged(),
    seedFrozen(),
    seedToggled(),
    seedServed(),
    seedDrifted(),
    seedAisled(),
    seedGreened(),
    seedLagged(),
  ];
  for (const seed of seeds) {
    const result = decide(seed);
    assert.equal(result.github, true, result.verdict);
    const row = githubLarderLedger(result, {});
    assert.match(row.summary, /larder-ledger/, result.verdict);
    assert.equal(row.adapter, "github");
  }
});

test("78 GitHub ledger fires on idle/clear scored probes too", () => {
  const idle = decide(emptyAction("idle"));
  assert.equal(idle.github, true);
  assert.equal(score(emptyProbe()).github, true);
  const cleared = decide({ action: "clear" });
  assert.equal(cleared.github, true);
});

test("79 primary stamped and aged stay distinguishable on #90329", () => {
  assert.equal(classify(seed90329Stamped().probe), "stamped");
  assert.equal(classify(seedAged().probe), "aged");
  assert.ok(seed90329Stamped().probe.versionsBehind < 10);
  assert.ok(seedAged().probe.versionsBehind >= 10);
  assert.notEqual(seed90329Stamped().probe.daysStale, seedAged().probe.daysStale);
});

test("80 frozen stays under aged threshold so reFroze wins", () => {
  const probe = seedFrozen().probe;
  assert.ok(probe.versionsBehind < AGED_BEHIND);
  assert.ok(probe.daysStale < AGED_DAYS);
  assert.equal(probe.reFroze, true);
  assert.equal(classify(probe), "frozen");
});

test("81 drifted stays under aged threshold so CLI pins win", () => {
  const probe = seedDrifted().probe;
  assert.ok(probe.versionsBehind < AGED_BEHIND);
  assert.ok(probe.daysStale < AGED_DAYS);
  assert.equal(probe.cliPinsBehind, true);
  assert.equal(probe.autoUpdateOn, true);
  assert.equal(probe.lastUpdatedAdvanced, false);
  assert.equal(classify(probe), "drifted");
});

test("82 greened requires a silent log and a still stamp", () => {
  assert.equal(
    classify({
      logsPresent: true,
      indicatorsGreen: true,
      versionsBehind: 4,
      lastUpdatedAdvanced: false,
      pluginFolderMoved: false,
      contentClockBehind: true,
    }),
    "lagged",
  );
  assert.equal(
    classify({
      logsPresent: false,
      indicatorsGreen: true,
      versionsBehind: 0,
      lastUpdatedAdvanced: false,
      pluginFolderMoved: false,
      autoSyncOn: true,
    }),
    "stocked",
  );
});

test("83 served requires versionsBehind > 0", () => {
  assert.equal(
    classify({
      sessionsLoadFromStore: true,
      versionsBehind: 0,
      pluginFolderMoved: true,
      lastUpdatedAdvanced: true,
      autoSyncOn: true,
    }),
    "stocked",
  );
});

test("84 feed and reasons never use larder as the idle word", () => {
  const stocked = score(emptyProbe());
  assert.equal(stocked.idleWord, "stocked");
  assert.doesNotMatch(stocked.feed, /idle word is larder/i);
  assert.ok(stocked.reasons.every((line) => !/idle word is larder/i.test(line)));
});

test("85 desk HTML sanity: idle word stocked, seeded stamped, never larder-as-state", () => {
  const html = readFileSync(fileURLToPath(new URL("../index.html", import.meta.url)), "utf8");
  assert.match(html, /stocked/);
  assert.match(html, /Admit stocked/);
  assert.match(html, /stamped/);
  assert.match(html, /90329/);
  assert.match(html, /seedOf\("stamped"\)|probe = seedOf\("stamped"\)/);
  assert.doesNotMatch(html, /Admit larder/);
  assert.doesNotMatch(html, /const IDLE_WORD = "larder"/);
  assert.match(html, /const IDLE_WORD = "stocked"/);
  assert.doesNotMatch(html, /oil-black|cam-lobe|valve train|theatre wing|mail chute/);
  assert.match(html, /stillroom|zinc|butcher-paper|content.clock/i);
});

test("86 handle greened / drifted / aged / served deny", async () => {
  const greened = await handle(seedGreened(), {});
  assert.equal(greened.permissionDecision, "deny");
  const drifted = await handle(seedDrifted(), {});
  assert.equal(drifted.permissionDecision, "deny");
  const aged = await handle(seedAged(), {});
  assert.equal(aged.permissionDecision, "deny");
  const served = await handle(seedServed(), {});
  assert.equal(served.permissionDecision, "deny");
});

test("87 listen POST empty body scores default idle-or-empty as stocked", async () => {
  const server = listen(19333);
  await new Promise((resolve) => server.once("listening", resolve));
  const res = await fetch("http://127.0.0.1:19333/", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: "{}",
  });
  const body = await res.json();
  assert.equal(body.verdict, "stocked");
  assert.equal(body.idleWord, "stocked");
  await new Promise((resolve) => server.close(resolve));
});

test("88 GitHub live plan uses SLACK_WEBHOOK alias and GITHUB_TOKEN alias", () => {
  const stamped = decide(seed90329Stamped());
  const slack = slackLarderAlarm(stamped, { SLACK_WEBHOOK: "https://hooks.example/y" });
  assert.equal(slack.mode, "live");
  const github = githubLarderLedger(stamped, { GITHUB_TOKEN: "tok" });
  assert.equal(github.mode, "live");
});

test("89 every verdict is uniquely first-match on its seed", () => {
  const map = {
    stocked: seedStocked,
    stamped: seed90329Stamped,
    frozen: seedFrozen,
    greened: seedGreened,
    toggled: seedToggled,
    drifted: seedDrifted,
    lagged: seedLagged,
    aisled: seedAisled,
    aged: seedAged,
    served: seedServed,
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
