import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  fire,
  githubPleatLedger,
  linearPleatTicket,
  slackPleatAlarm,
} from "./adapters.mjs";
import {
  ALARM_VERDICTS,
  IDLE_WORD,
  LINEAR_VERDICTS,
  SLACK_VERDICTS,
  VERDICTS,
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
  buriedOf,
  isIdle,
  pleatedOf,
  flatOf,
  reasonsOf,
  score,
  seed90425Pleated,
  seedAired,
  seedBuried,
  seedChrome,
  seedFlat,
  seedFolded,
  seedFragment,
  seedGhosted,
  seedMidturn,
  seedSwallowed,
  verdictOf,
} from "./pleat.mjs";
import { handle, listen } from "./index.mjs";

function assertIdleNeverPleat(result) {
  assert.equal(result.idleWord, "flat");
  assert.equal(IDLE_WORD, "flat");
  assert.doesNotMatch(result.idleWord, /pleat/i);
  assert.doesNotMatch(IDLE_WORD, /pleat/i);
  assert.doesNotMatch(result.idleWord, /empty/i);
  assert.doesNotMatch(IDLE_WORD, /empty/i);
  assert.doesNotMatch(
    result.idleWord,
    /fit|spoilt|laid|unlinked|tight|banked|roosted|stocked|seated|heard|clear|paired|kernel|latched|upheld|sterling|home|valid|dry|sealed|quiet|seised/,
  );
}

function assertScoreShape(result) {
  assert.equal(typeof result.verdict, "string");
  assert.ok(Array.isArray(result.reasons));
  assert.ok(Array.isArray(result.cluster));
  assert.equal(typeof result.flat, "boolean");
  assert.equal(typeof result.pleated, "boolean");
  assert.equal(typeof result.buried, "boolean");
  assert.equal(typeof result.feed, "string");
  assert.equal(typeof result.slack, "boolean");
  assert.equal(typeof result.linear, "boolean");
  assert.equal(typeof result.github, "boolean");
}

test("1 seed 90425 pleated is pleated, slack, not linear, idleWord flat", () => {
  const seed = seed90425Pleated();
  const result = decide(seed);
  assert.equal(result.verdict, "pleated");
  assert.equal(result.state, "pleated");
  assert.equal(result.decision, "pleated");
  assert.equal(classify(seed.probe), "pleated");
  assert.equal(verdictOf(seed.probe), "pleated");
  assert.notEqual(result.verdict, "flat");
  assert.equal(result.alarm, true);
  assert.equal(result.slack, true);
  assert.equal(result.linear, false);
  assert.equal(result.github, true);
  assert.equal(result.clothPleated, true);
  assert.equal(result.clothFlat, false);
  assert.equal(result.flat, false);
  assert.equal(result.pleated, true);
  assert.equal(result.buried, false);
  assertIdleNeverPleat(result);
  assert.equal(result.session, "90425-pleated");
  assert.equal(result.issue, 90425);
  assert.equal(result.foldCollapsed, true);
  assert.ok(String(result.midTurnProse).includes("1. Open"));
  assert.equal(result.numberedListStartsMid, true);
  assert.equal(result.userNeverSaw, true);
  assert.match(result.feed, /collapsed under Ran N commands/i);
  assert.ok(result.cluster.includes("buried"));
  assert.ok(result.cluster.includes("folded"));
  assert.ok(result.cluster.includes("swallowed"));
  assert.ok(result.cluster.includes("midturn"));
  assert.ok(result.cluster.includes("chrome"));
  assert.ok(result.cluster.includes("fragment"));
  assert.ok(result.cluster.includes("ghosted"));
  assert.ok(!result.cluster.includes("pleated"));
  assert.ok(!result.cluster.includes("flat"));
  assert.equal(decideSeed(90425).verdict, "pleated");
  assert.equal(decideSeed("pleated").verdict, "pleated");
  assert.equal(decideSeed("90425-pleated").verdict, "pleated");
});

test("2 idle/empty/{} is flat, never the product name, never empty, never spoilt", () => {
  const result = decide(emptyAction("idle"));
  assert.equal(result.state, "flat");
  assert.equal(result.verdict, "flat");
  assert.equal(result.decision, "flat");
  assert.equal(result.alarm, false);
  assert.equal(result.slack, false);
  assert.equal(result.linear, false);
  assert.equal(result.flat, true);
  assert.equal(result.pleated, false);
  assert.equal(classify({}), "flat");
  assert.equal(classify(emptyProbe()), "flat");
  assert.equal(isIdle(emptyProbe()), true);
  assertIdleNeverPleat(result);
  const seated = decide({ action: "shut" });
  assert.equal(seated.state, "flat");
  assert.equal(seated.idleWord, "flat");
  assert.equal(seated.midTurnProse, "");
  assert.doesNotMatch(seated.state, /pleat/i);
  assert.doesNotMatch(seated.state, /empty/i);
  const empty = decide({});
  assert.equal(empty.verdict, "flat");
  assert.equal(empty.idleWord, "flat");
});

test("3 buried: requested explanation hidden in fold", () => {
  const result = decide(seedBuried());
  assert.equal(result.verdict, "buried");
  assert.equal(result.requestedExplanation, true);
  assert.equal(result.explanationInTranscript, true);
  assert.equal(result.explanationHiddenInFold, true);
  assert.equal(result.foldCollapsed, false);
  assert.equal(result.alarm, true);
  assert.equal(result.slack, true);
  assert.equal(result.linear, true);
  assert.equal(result.buried, true);
  assert.match(result.feed, /hidden in fold/i);
  assert.equal(decideSeed("buried").verdict, "buried");
});

test("4 folded: tool chrome + final fragment only", () => {
  const result = decide(seedFolded());
  assert.equal(result.verdict, "folded");
  assert.equal(result.toolChromeOnly, true);
  assert.equal(result.finalFragmentOnly, true);
  assert.equal(result.alarm, false);
  assert.equal(result.slack, false);
  assert.match(result.feed, /tool chrome \+ final fragment/i);
  assert.equal(decideSeed("folded").verdict, "folded");
});

test("5 swallowed: numbered list starts mid-sequence", () => {
  const result = decide(seedSwallowed());
  assert.equal(result.verdict, "swallowed");
  assert.equal(result.numberedListStartsMid, true);
  assert.equal(result.alarm, true);
  assert.equal(result.slack, true);
  assert.equal(result.linear, false);
  assert.match(result.feed, /mid-sequence|earlier items/i);
  assert.equal(decideSeed("swallowed").verdict, "swallowed");
});

test("6 midturn: prose between tool_use blocks", () => {
  const result = decide(seedMidturn());
  assert.equal(result.verdict, "midturn");
  assert.equal(result.proseBetweenToolUse, true);
  assert.equal(result.alarm, false);
  assert.match(result.feed, /dangerous zone/i);
  assert.equal(decideSeed("midturn").verdict, "midturn");
});

test("7 chrome: Ran N commands with no hint of hidden prose", () => {
  const result = decide(seedChrome());
  assert.equal(result.verdict, "chrome");
  assert.equal(result.ranNCommandsVisible, true);
  assert.equal(result.noHintOfHiddenProse, true);
  assert.equal(result.alarm, false);
  assert.match(result.feed, /no hint of hidden prose/i);
  assert.equal(decideSeed("chrome").verdict, "chrome");
});

test("8 fragment: only trailing short status visible", () => {
  const result = decide(seedFragment());
  assert.equal(result.verdict, "fragment");
  assert.equal(result.trailingStatusOnly, true);
  assert.equal(result.alarm, false);
  assert.match(result.feed, /trailing short status/i);
  assert.equal(decideSeed("fragment").verdict, "fragment");
});

test("9 ghosted: model believes it answered; user never saw it", () => {
  const result = decide(seedGhosted());
  assert.equal(result.verdict, "ghosted");
  assert.equal(result.modelBelievesAnswered, true);
  assert.equal(result.userNeverSaw, true);
  assert.equal(result.alarm, true);
  assert.equal(result.slack, true);
  assert.equal(result.linear, true);
  assert.match(result.feed, /user never saw/i);
  assert.equal(decideSeed("ghosted").verdict, "ghosted");
});

test("10 aired: fold expanded, prose recovered", () => {
  const result = decide(seedAired());
  assert.equal(result.verdict, "aired");
  assert.equal(result.foldExpanded, true);
  assert.equal(result.proseRecovered, true);
  assert.equal(result.alarm, false);
  assert.equal(result.slack, false);
  assert.equal(result.linear, false);
  assert.match(result.feed, /prose recovered/i);
  assert.equal(decideSeed("aired").verdict, "aired");
});

test("11 flat seed is flat and never alarms", () => {
  const result = decide(seedFlat());
  assert.equal(result.verdict, "flat");
  assert.equal(result.midTurnProse, "");
  assert.equal(result.flat, true);
  assert.equal(result.alarm, false);
  assert.equal(result.slack, false);
  assert.equal(result.linear, false);
  assert.match(result.feed, /Flat/);
  assert.equal(decideSeed("flat").verdict, "flat");
});

test("12 score() idle probe is flat and never alarms", () => {
  const result = score(emptyProbe());
  assertScoreShape(result);
  assert.equal(result.verdict, "flat");
  assert.equal(result.slack, false);
  assert.equal(result.linear, false);
  assert.equal(result.github, true);
  assert.equal(result.alarm, false);
  assert.equal(result.flat, true);
  assert.equal(result.pleated, false);
  assert.equal(result.buried, false);
});

test("13 verdict vocabulary is exactly the ten words", () => {
  assert.deepEqual(VERDICTS, [
    "flat",
    "pleated",
    "buried",
    "folded",
    "swallowed",
    "midturn",
    "chrome",
    "fragment",
    "ghosted",
    "aired",
  ]);
  assert.deepEqual(SLACK_VERDICTS, ["pleated", "buried", "swallowed", "ghosted"]);
  assert.deepEqual(ALARM_VERDICTS, SLACK_VERDICTS);
  assert.deepEqual(LINEAR_VERDICTS, ["buried", "ghosted"]);
  assert.equal(IDLE_WORD, "flat");
  assert.doesNotMatch(IDLE_WORD, /pleat/i);
  assert.doesNotMatch(IDLE_WORD, /empty/i);
  assert.doesNotMatch(IDLE_WORD, /spoilt|laid|unlinked|tight|banked|seised|seated|latched/);
  assert.doesNotMatch(VERDICTS.join(" "), /empty|unlinked|wraith|kist|knock|spoilt/);
});

test("14 every seeded class classifies to itself", () => {
  const rows = [
    ["flat", seedFlat],
    ["pleated", seed90425Pleated],
    ["buried", seedBuried],
    ["folded", seedFolded],
    ["swallowed", seedSwallowed],
    ["midturn", seedMidturn],
    ["chrome", seedChrome],
    ["fragment", seedFragment],
    ["ghosted", seedGhosted],
    ["aired", seedAired],
  ];
  for (const [word, seed] of rows) {
    assert.equal(decide(seed()).verdict, word, word);
    assert.equal(classify(seed().probe), word, word);
    assert.equal(score(seed().probe).verdict, word, word);
  }
});

test("15 admit does not lie: pleated stays pleated", () => {
  const result = decide({ ...seed90425Pleated(), action: "admit" });
  assert.equal(result.verdict, "pleated");
  assert.equal(result.action, "admit");
  assert.doesNotMatch(result.verdict, /flat/);
  assert.doesNotMatch(result.verdict, /pleat$/i);
});

test("16 score / stamp / iron scores pleated", () => {
  const result = decide({ ...seed90425Pleated(), action: "score" });
  assert.equal(result.verdict, "pleated");
  assert.equal(result.action, "score");
  assert.equal(result.foldCollapsed, true);
  const stamped = decide({ ...seed90425Pleated(), action: "stamp" });
  assert.equal(stamped.verdict, "pleated");
  assert.equal(stamped.action, "stamp");
  const ironed = decide({ ...seed90425Pleated(), action: "iron" });
  assert.equal(ironed.verdict, "pleated");
  assert.equal(ironed.action, "score");
});

test("17 shut / flatten / flat returns idle flat", () => {
  const shut = decide({ ...seed90425Pleated(), action: "shut" });
  assert.equal(shut.verdict, "flat");
  assert.equal(shut.action, "shut");
  assert.equal(shut.midTurnProse, "");
  assert.equal(isIdle(shut.probe), true);
  assertIdleNeverPleat(shut);
  const flattened = decide({ ...seedBuried(), action: "flatten" });
  assert.equal(flattened.verdict, "flat");
  assert.equal(isIdle(flattened.probe), true);
  const idle = decide({ ...seedGhosted(), action: "flat" });
  assert.equal(idle.verdict, "flat");
});

test("18 crease on idle produces pleated cloth", () => {
  const result = decide({ action: "crease", probe: emptyProbe() });
  assert.equal(result.verdict, "pleated");
  assert.equal(result.action, "crease");
  assert.equal(result.foldCollapsed, true);
  assert.ok(String(result.midTurnProse).includes("1. Open"));
  assert.equal(result.pleated, true);
});

test("19 crease on a buried probe becomes pleated", () => {
  const result = decide({ ...seedBuried(), action: "crease" });
  assert.equal(result.verdict, "pleated");
  assert.equal(result.action, "crease");
  assert.equal(result.foldCollapsed, true);
});

test("20 air control is the healthy hold, never idle flat", () => {
  const result = decide({ ...seed90425Pleated(), action: "air" });
  assert.equal(result.verdict, "aired");
  assert.equal(result.action, "air");
  assert.equal(result.foldExpanded, true);
  assert.equal(result.proseRecovered, true);
  assert.equal(result.flat, false);
  assert.equal(result.pleated, false);
});

test("21 ledger marks the cloth check and does not lie", () => {
  const result = decide({ ...seed90425Pleated(), action: "ledger" });
  assert.equal(result.verdict, "pleated");
  assert.equal(result.action, "ledger");
  assert.equal(result.observed, true);
  assert.ok(result.reasons.some((line) => /Shop checked/.test(line)));
});

test("22 observe on buried stays buried", () => {
  const result = decide({ ...seedBuried(), action: "observe" });
  assert.equal(result.verdict, "buried");
  assert.equal(result.observed, true);
  assert.equal(result.explanationHiddenInFold, true);
});

test("23 pleated beats buried when mid-turn prose is folded", () => {
  assert.equal(
    classify({
      midTurnProse: "1. Open the settings panel",
      foldCollapsed: true,
      requestedExplanation: true,
      explanationInTranscript: true,
      explanationHiddenInFold: true,
    }),
    "pleated",
  );
});

test("24 aired beats pleated when the fold is pressed open", () => {
  assert.equal(
    classify({
      midTurnProse: "1. Open the settings panel",
      foldCollapsed: true,
      foldExpanded: true,
      proseRecovered: true,
    }),
    "aired",
  );
});

test("25 buried requires requested explanation hidden in fold, not just prose", () => {
  assert.equal(
    classify({
      requestedExplanation: true,
    }),
    "flat",
  );
  assert.equal(
    classify({
      requestedExplanation: true,
      explanationInTranscript: true,
      explanationHiddenInFold: true,
    }),
    "buried",
  );
});

test("26 ghosted requires both sides silent", () => {
  assert.equal(
    classify({
      modelBelievesAnswered: true,
    }),
    "flat",
  );
  assert.equal(
    classify({
      modelBelievesAnswered: true,
      userNeverSaw: true,
    }),
    "ghosted",
  );
});

test("27 nested cloth / board / fold / ticket fields clone", () => {
  const probe = cloneProbe({
    cloth: {
      midTurnProse: "1. Open the settings panel",
      foldCollapsed: true,
    },
  });
  assert.equal(classify(probe), "pleated");
  const board = cloneProbe({
    board: { numberedListStartsMid: true },
  });
  assert.equal(classify(board), "swallowed");
});

test("28 flagsOf matches slack / linear / github", () => {
  assert.deepEqual(flagsOf("pleated"), { slack: true, linear: false, github: true, alarm: true });
  assert.deepEqual(flagsOf("buried"), { slack: true, linear: true, github: true, alarm: true });
  assert.deepEqual(flagsOf("swallowed"), { slack: true, linear: false, github: true, alarm: true });
  assert.deepEqual(flagsOf("ghosted"), { slack: true, linear: true, github: true, alarm: true });
  assert.deepEqual(flagsOf("flat"), { slack: false, linear: false, github: true, alarm: false });
  assert.deepEqual(flagsOf("folded"), { slack: false, linear: false, github: true, alarm: false });
  assert.deepEqual(flagsOf("midturn"), { slack: false, linear: false, github: true, alarm: false });
  assert.deepEqual(flagsOf("chrome"), { slack: false, linear: false, github: true, alarm: false });
  assert.deepEqual(flagsOf("fragment"), { slack: false, linear: false, github: true, alarm: false });
  assert.deepEqual(flagsOf("aired"), { slack: false, linear: false, github: true, alarm: false });
});

test("29 flat / pleated / buried helpers", () => {
  assert.equal(flatOf(seed90425Pleated().probe), false);
  assert.equal(pleatedOf(seed90425Pleated().probe), true);
  assert.equal(buriedOf(seed90425Pleated().probe), false);
  assert.equal(flatOf(emptyProbe()), true);
  assert.equal(buriedOf(seedBuried().probe), true);
  assert.equal(pleatedOf(seedBuried().probe), false);
  assert.equal(flatOf(seedAired().probe), false);
});

test("30 feed and reasons never use pleat or empty as the idle word", () => {
  const idle = score(emptyProbe());
  assert.equal(idle.idleWord, "flat");
  assert.doesNotMatch(idle.feed, /idle word is pleat/i);
  assert.doesNotMatch(idle.feed, /idle word is empty/i);
  assert.ok(idle.reasons.every((line) => !/idle word is pleat/i.test(line)));
  assert.ok(idle.reasons.every((line) => !/idle word is empty/i.test(line)));
  assert.match(feedOf(emptyProbe(), "flat"), /Flat/);
  assert.ok(reasonsOf(emptyProbe(), "flat").some((line) => /idle word is flat/.test(line)));
});

test("31 forbidden idle list includes pleat, empty, spoilt, leftover names", () => {
  const words = forbiddenIdleWords();
  assert.ok(words.includes("pleat"));
  assert.ok(words.includes("empty"));
  assert.ok(words.includes("spoilt"));
  assert.ok(words.includes("laid"));
  assert.ok(words.includes("unlinked"));
  assert.ok(words.includes("tight"));
  assert.ok(words.includes("seised"));
  assert.ok(words.includes("fit"));
  assert.ok(words.includes("banked"));
  assert.ok(words.includes("knock"));
  assert.ok(words.includes("fold"));
  assert.ok(words.includes("accordion"));
  assert.ok(!words.includes("flat"));
});

test("32 demo sinks: Slack on alarm; Linear on buried/ghosted; GitHub always", async () => {
  const pleated = decide(seed90425Pleated());
  const slack = slackPleatAlarm(pleated, {});
  assert.equal(slack.mode, "demo");
  assert.match(slack.summary, /Would post to Slack/);
  const github = githubPleatLedger(pleated, {});
  assert.equal(github.mode, "demo");
  assert.match(github.summary, /Would open a GitHub pleat-ledger/);
  const linearSkip = linearPleatTicket(pleated, {});
  assert.equal(linearSkip.mode, "demo");
  assert.match(linearSkip.summary, /Would skip Linear/);
  const buried = decide(seedBuried());
  const linear = linearPleatTicket(buried, {});
  assert.equal(linear.mode, "demo");
  assert.match(linear.summary, /Would open a Linear ticket/);
  const idle = decide(emptyAction("idle"));
  assert.match(slackPleatAlarm(idle, {}).summary, /Would skip Slack/);
  assert.match(linearPleatTicket(idle, {}).summary, /Would skip Linear/);
  const fired = await fire(pleated, {});
  assert.equal(fired.events.length, 3);
  assert.ok(fired.events.every((row) => row.ok === true));
});

test("33 Slack live plan uses SLACK_WEBHOOK alias and GITHUB_TOKEN alias", () => {
  const pleated = decide(seed90425Pleated());
  const slack = slackPleatAlarm(pleated, { SLACK_WEBHOOK: "https://hooks.example/y" });
  assert.equal(slack.mode, "live");
  const github = githubPleatLedger(pleated, { GITHUB_TOKEN: "tok" });
  assert.equal(github.mode, "live");
  const buried = decide(seedBuried());
  const linear = linearPleatTicket(buried, { LINEAR_API_KEY: "lin" });
  assert.equal(linear.mode, "live");
});

test("34 Slack skip on flat / folded / midturn / chrome / fragment / aired", () => {
  for (const seed of [seedFlat, seedFolded, seedMidturn, seedChrome, seedFragment, seedAired]) {
    const result = decide(seed());
    assert.equal(result.slack, false, result.verdict);
    assert.match(slackPleatAlarm(result, {}).summary, /Would skip Slack/);
  }
});

test("35 Linear only on buried and ghosted", () => {
  assert.equal(decide(seed90425Pleated()).linear, false);
  assert.equal(decide(seedBuried()).linear, true);
  assert.equal(decide(seedGhosted()).linear, true);
  assert.equal(decide(seedSwallowed()).linear, false);
  assert.equal(decide(seedFolded()).linear, false);
  assert.equal(decide(seedFlat()).linear, false);
});

test("36 GitHub ledger fires on idle/shut scored probes too", () => {
  const idle = decide(emptyAction("idle"));
  assert.equal(idle.github, true);
  assert.equal(score(emptyProbe()).github, true);
  const shut = decide({ action: "shut" });
  assert.equal(shut.github, true);
});

test("37 handle pleated / buried / swallowed / ghosted deny", async () => {
  const pleated = await handle(seed90425Pleated(), {});
  assert.equal(pleated.permissionDecision, "deny");
  assert.match(pleated.hookSpecificOutput.decision.message, /pleated/);
  const buried = await handle(seedBuried(), {});
  assert.equal(buried.permissionDecision, "deny");
  const swallowed = await handle(seedSwallowed(), {});
  assert.equal(swallowed.permissionDecision, "deny");
  const ghosted = await handle(seedGhosted(), {});
  assert.equal(ghosted.permissionDecision, "deny");
});

test("38 handle flat / folded / midturn / chrome / fragment / aired allow", async () => {
  const idle = await handle({ action: "shut" }, {});
  assert.equal(idle.permissionDecision, "allow");
  assert.match(idle.hookSpecificOutput.decision.message, /flat/);
  const folded = await handle(seedFolded(), {});
  assert.equal(folded.permissionDecision, "allow");
  const midturn = await handle(seedMidturn(), {});
  assert.equal(midturn.permissionDecision, "allow");
  const chrome = await handle(seedChrome(), {});
  assert.equal(chrome.permissionDecision, "allow");
  const fragment = await handle(seedFragment(), {});
  assert.equal(fragment.permissionDecision, "allow");
  const aired = await handle(seedAired(), {});
  assert.equal(aired.permissionDecision, "allow");
});

test("39 listen GET health and POST empty body is flat", async () => {
  const server = listen(19060);
  await new Promise((resolve) => server.once("listening", resolve));
  const health = await fetch("http://127.0.0.1:19060/health");
  const info = await health.json();
  assert.equal(info.product, "pleat");
  assert.match(info.verbs, /pleated/);
  const res = await fetch("http://127.0.0.1:19060/", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: "{}",
  });
  const body = await res.json();
  assert.equal(body.verdict, "flat");
  assert.equal(body.idleWord, "flat");
  const scored = await fetch("http://127.0.0.1:19060/", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(seed90425Pleated()),
  });
  const scoredBody = await scored.json();
  assert.equal(scoredBody.verdict, "pleated");
  await new Promise((resolve) => server.close(resolve));
});

test("40 listen rejects non-JSON and GET-only verbs besides health", async () => {
  const server = listen(19061);
  await new Promise((resolve) => server.once("listening", resolve));
  const bad = await fetch("http://127.0.0.1:19061/", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: "{",
  });
  assert.equal(bad.status, 400);
  const put = await fetch("http://127.0.0.1:19061/", { method: "PUT" });
  assert.equal(put.status, 405);
  await new Promise((resolve) => server.close(resolve));
});

test("41 every verdict is uniquely first-match on its seed", () => {
  const map = {
    flat: seedFlat,
    pleated: seed90425Pleated,
    buried: seedBuried,
    folded: seedFolded,
    swallowed: seedSwallowed,
    midturn: seedMidturn,
    chrome: seedChrome,
    fragment: seedFragment,
    ghosted: seedGhosted,
    aired: seedAired,
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

test("42 admit does not lie on every fault class", () => {
  const rows = [
    ["pleated", seed90425Pleated],
    ["buried", seedBuried],
    ["folded", seedFolded],
    ["swallowed", seedSwallowed],
    ["midturn", seedMidturn],
    ["chrome", seedChrome],
    ["fragment", seedFragment],
    ["ghosted", seedGhosted],
    ["aired", seedAired],
  ];
  for (const [word, seed] of rows) {
    const result = decide({ ...seed(), action: "admit" });
    assert.equal(result.verdict, word, word);
    assert.equal(result.action, "admit", word);
  }
});

test("43 desk HTML sanity: idle word flat, seeded pleated, not chad/aside", () => {
  const html = readFileSync(fileURLToPath(new URL("../index.html", import.meta.url)), "utf8");
  assert.match(html, /flat/);
  assert.match(html, /Score/);
  assert.match(html, /Flatten/);
  assert.match(html, /Crease/);
  assert.match(html, /Air/);
  assert.match(html, /pleated/);
  assert.match(html, /90425/);
  assert.match(html, /seedOf\("pleated"\)|probe = seedOf\("pleated"\)/);
  assert.doesNotMatch(html, /Admit pleat/);
  assert.doesNotMatch(html, /const IDLE_WORD = "pleat"/);
  assert.doesNotMatch(html, /const IDLE_WORD = "empty"/);
  assert.doesNotMatch(html, /const IDLE_WORD = "spoilt"/);
  assert.match(html, /const IDLE_WORD = "flat"/);
  assert.match(html, /pressing|accordion|chalk|needle|iron|worsted|felt|grain/i);
  assert.match(html, /05:50 Sydney · pleat/);
  assert.match(html, /rendered fold is not a hold/i);
  assert.doesNotMatch(html, /class="afterimage"|class="tombstone"|class="inode"|class="chamber"/);
  assert.doesNotMatch(html, /class="booth"|class="punchcard"|class="ballot"/);
  assert.doesNotMatch(html, /class="flange"|class="packing"|class="chest"|class="hinge"|class="lid"/);
  assert.doesNotMatch(html, /--void:|--frost:|--ice:|--after:|--tomb:/);
  assert.doesNotMatch(html, /--oak:|--ash:|--linen:|--hessian:|--brass:|--lead:/);
  assert.doesNotMatch(html, /--hall:|--tube:|--manila:|--inkpad:/);
  assert.doesNotMatch(html, /millimeter slider|millimetre slider/i);
  assert.match(html, /<title>Pleat/);
});

test("44 HTML why-not names Aside, Coda, Chad, Blot, leftover", () => {
  const html = readFileSync(fileURLToPath(new URL("../index.html", import.meta.url)), "utf8");
  assert.match(html, /NOT Aside/);
  assert.match(html, /NOT Coda/);
  assert.match(html, /NOT Chad/);
  assert.match(html, /NOT Blot|NOT Scant/);
  assert.match(html, /leftover/);
  assert.match(html, /millimeter-slider|millimetre-slider|millimeter slider|millimetre slider/);
  assert.doesNotMatch(html, /Pleat is a preamble side-channel/i);
  assert.doesNotMatch(html, /Pleat is a last-block splice/i);
  assert.doesNotMatch(html, /this is a hanging-chad ballot/i);
});

test("45 README names Aside / Coda / Chad contrast and flat idle", () => {
  const readme = readFileSync(fileURLToPath(new URL("../README.md", import.meta.url)), "utf8");
  assert.match(readme, /NOT Aside/);
  assert.match(readme, /NOT Coda/);
  assert.match(readme, /NOT Chad/);
  assert.match(readme, /leftover/);
  assert.match(readme, /\*\*flat\*\*/);
  assert.match(readme, /#90425|#90425/);
  assert.match(readme, /#67071|#67071/);
  assert.doesNotMatch(readme, /idle word is pleat/i);
  assert.doesNotMatch(readme, /idle word is spoilt/i);
  assert.doesNotMatch(readme, /Pleat is a preamble side-channel/i);
});

test("46 score() pleated includes pleated and not flat", () => {
  const result = score(seed90425Pleated().probe);
  assertScoreShape(result);
  assert.equal(result.verdict, "pleated");
  assert.equal(result.flat, false);
  assert.equal(result.pleated, true);
  assert.equal(result.buried, false);
});

test("47 fire live slack posts when fetch ok", async () => {
  const pleated = decide(seed90425Pleated());
  const events = await fire(pleated, { PLEAT_SLACK_WEBHOOK: "https://hooks.example/x" }, async () => ({
    ok: true,
    status: 200,
    json: async () => ({}),
  }));
  const slack = events.events.find((row) => row.adapter === "slack");
  assert.equal(slack.ok, true);
  assert.match(slack.summary, /Posted pleated/);
});

test("48 fire live github and linear paths", async () => {
  const buried = decide(seedBuried());
  const events = await fire(
    buried,
    {
      PLEAT_GITHUB_TOKEN: "tok",
      PLEAT_LINEAR_KEY: "lin",
      PLEAT_LINEAR_TEAM: "team-1",
    },
    async (url) => {
      if (String(url).includes("gists")) {
        return { ok: true, status: 200, json: async () => ({ id: "gist1" }) };
      }
      return {
        ok: true,
        status: 200,
        json: async () => ({
          data: { issueCreate: { success: true, issue: { id: "1", identifier: "PLT-1", url: "https://linear.app/plt-1" } } },
        }),
      };
    },
  );
  const github = events.events.find((row) => row.adapter === "github");
  const linear = events.events.find((row) => row.adapter === "linear");
  assert.equal(github.ok, true);
  assert.match(github.summary, /gist1/);
  assert.equal(linear.ok, true);
  assert.match(linear.summary, /PLT-1/);
});

test("49 reasons cite primary issue numbers on their classes", () => {
  assert.ok(reasonsOf(seed90425Pleated().probe, "pleated").some((line) => /#90425/.test(line)));
  assert.ok(reasonsOf(seedBuried().probe, "buried").some((line) => /#90425/.test(line)));
  assert.ok(reasonsOf(seedSwallowed().probe, "swallowed").some((line) => /#90425/.test(line)));
});

test("50 adapters stay honest when env is empty — never a fake live HTTP 200", async () => {
  const pleated = decide(seed90425Pleated());
  const slack = slackPleatAlarm(pleated, {});
  const github = githubPleatLedger(pleated, {});
  const linear = linearPleatTicket(pleated, {});
  assert.equal(slack.mode, "demo");
  assert.equal(github.mode, "demo");
  assert.equal(linear.mode, "demo");
  assert.doesNotMatch(slack.summary, /HTTP 200/);
  assert.doesNotMatch(github.summary, /HTTP 200/);
  assert.doesNotMatch(linear.summary, /HTTP 200/);
  const fired = await fire(pleated, {});
  assert.ok(fired.events.every((row) => row.mode === "demo"));
  assert.ok(fired.events.every((row) => !/HTTP 200/.test(row.summary)));
});

test("51 catalog wiring: 31 products, Pleat featured, Scant and Chad listed", () => {
  const catalog = JSON.parse(readFileSync(fileURLToPath(new URL("../../../catalog.json", import.meta.url)), "utf8"));
  assert.equal(catalog.products.length, 31);
  const featured = catalog.products.filter((row) => row.featured);
  assert.equal(featured.length, 1);
  assert.equal(featured[0].name, "Pleat");
  assert.equal(featured[0].slug, "pleat");
  assert.equal(featured[0].href, "/pleat/");
  assert.equal(featured[0].day, "2026-08-29");
  assert.match(featured[0].summary, /05:50|rendered fold is not a hold|flat/);
  const scant = catalog.products.find((row) => row.slug === "scant");
  assert.ok(scant);
  assert.equal(scant.featured, false);
  const chad = catalog.products.find((row) => row.slug === "chad");
  assert.ok(chad);
  assert.equal(chad.featured, false);
  const kist = catalog.products.find((row) => row.slug === "kist");
  assert.ok(kist);
  assert.equal(kist.featured, false);
  const slugs = catalog.products.map((row) => row.slug);
  assert.equal(slugs[0], "pleat");
  assert.equal(slugs[1], "scant");
  assert.ok(slugs.includes("chad"));
  assert.ok(slugs.includes("knock"));
  assert.ok(!slugs.includes("fold"));
  assert.ok(!slugs.includes("accordion"));
  assert.ok(!slugs.includes("bellows"));
});

test("52 vercel rewrite order puts /pleat before /scant, /chad and the slug fallback", () => {
  const vercel = JSON.parse(readFileSync(fileURLToPath(new URL("../../../vercel.json", import.meta.url)), "utf8"));
  const sources = vercel.rewrites.map((row) => row.source);
  assert.equal(sources[0], "/pleat");
  assert.equal(sources[1], "/pleat/");
  assert.equal(sources[2], "/scant");
  assert.equal(sources[3], "/scant/");
  assert.ok(sources.includes("/chad"));
  assert.ok(sources.includes("/kist"));
  assert.ok(sources.includes("/:slug"));
  assert.ok(sources.indexOf("/pleat") < sources.indexOf("/scant"));
  assert.ok(sources.indexOf("/scant") < sources.indexOf("/chad"));
  assert.ok(sources.indexOf("/pleat/") < sources.indexOf("/:slug"));
});

test("53 hours.json prepends the 05:50 Sydney Pleat ship", () => {
  const hours = JSON.parse(readFileSync(fileURLToPath(new URL("../../../runs/hours.json", import.meta.url)), "utf8"));
  assert.equal(hours[0].stem, "2026-08-29-pleat");
  assert.equal(hours[0].date, "2026-08-29");
  assert.equal(hours[0].time, "05:50");
  assert.equal(hours[0].tz, "Australia/Sydney");
  assert.equal(hours[0].title, "Pleat");
  assert.equal(hours[0].kind, "ship");
  assert.match(hours[0].note, /flat/);
  assert.match(hours[0].note, /Scant/);
  assert.match(hours[0].note, /Chad/);
  assert.equal(hours[1].stem, "2026-08-29-scant");
});

test("54 clusterOf on #90425 includes buried folded swallowed midturn chrome fragment ghosted", () => {
  const cluster = clusterOf(seed90425Pleated().probe, "pleated");
  assert.deepEqual(
    cluster
      .filter((word) =>
        ["buried", "folded", "swallowed", "midturn", "chrome", "fragment", "ghosted"].includes(word),
      )
      .sort(),
    ["buried", "chrome", "folded", "fragment", "ghosted", "midturn", "swallowed"],
  );
});

test("55 boolean string coercion on probe flags", () => {
  const probe = cloneProbe({
    midTurnProse: "1. Open the settings panel",
    foldCollapsed: "true",
    numberedListStartsMid: "false",
    userNeverSaw: "true",
  });
  assert.equal(probe.foldCollapsed, true);
  assert.equal(probe.numberedListStartsMid, false);
  assert.equal(probe.userNeverSaw, true);
  assert.equal(classify(probe), "pleated");
});
