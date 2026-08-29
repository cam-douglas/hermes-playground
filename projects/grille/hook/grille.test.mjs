import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  fire,
  githubGrilleLedger,
  linearGrilleTicket,
  slackGrilleAlarm,
} from "./adapters.mjs";
import {
  ALARM_VERDICTS,
  ALLOWLIST_ISSUE,
  DISALLOW_ISSUE,
  FEATURED_ISSUE,
  HOOK_ISSUE,
  IDLE_WORD,
  LINEAR_VERDICTS,
  SLACK_VERDICTS,
  VERDICTS,
  WINDOWS_ISSUE,
  analyze,
  classify,
  cloneGrille,
  decide,
  decideSeed,
  emptyAction,
  emptyGrille,
  feedOf,
  flagsOf,
  forbiddenIdleWords,
  isIdle,
  parseSessionTrace,
  postedOf,
  reasonsOf,
  score,
  seed90599,
  seedAllowlisted,
  seedControl,
  seedKilled,
  seedOverlay,
  seedPosted,
  seedReset,
  seedRestored,
  seedSlotted,
  seedSteered,
  seedUngated,
  seedUnhooked,
  seedUnreceipted,
  steeredOf,
  verdictOf,
} from "./grille.mjs";
import { handle, listen } from "./index.mjs";

function assertIdleNeverGrille(result) {
  assert.equal(result.idleWord, "posted");
  assert.equal(IDLE_WORD, "posted");
  assert.doesNotMatch(result.idleWord, /grille|grill/i);
  assert.doesNotMatch(IDLE_WORD, /^grille$/i);
  assert.doesNotMatch(result.idleWord, /empty|silent|mute|idle|dead/i);
  assert.doesNotMatch(
    result.idleWord,
    /bunged|belayed|rove|keyed|housed|beamed|snug|hung|appointed|cinched|gauged|stamped|overrun|pratique|wound|bound|stilled|stabled|drained|flat|fit|spoilt|laid|unlinked|tight|banked|roosted|stocked|seated|heard|clear|paired|kernel|latched|upheld|sterling|home|valid|dry|sealed|quiet|seised|rung|moored/,
  );
}

function assertScoreShape(result) {
  assert.equal(typeof result.verdict, "string");
  assert.ok(Array.isArray(result.reasons));
  assert.equal(typeof result.posted, "boolean");
  assert.equal(typeof result.feed, "string");
}

test("1 seed 90599 steered is steered, slack, linear, idleWord posted, never posted", () => {
  const seed = seedSteered();
  const result = decide(seed);
  assert.equal(result.verdict, "steered");
  assert.equal(result.state, "steered");
  assert.equal(result.decision, "steered");
  assert.equal(classify(seed.grille), "steered");
  assert.equal(verdictOf(seed.grille), "steered");
  assert.notEqual(result.verdict, "posted");
  assert.notEqual(result.verdict, "slotted");
  assert.equal(result.alarm, true);
  assert.equal(result.slack, true);
  assert.equal(result.linear, true);
  assert.equal(result.github, true);
  assert.equal(result.grilleSteered, true);
  assert.equal(result.steered, true);
  assert.equal(result.posted, false);
  assertIdleNeverGrille(result);
  assert.equal(result.session, "90599-steered");
  assert.equal(result.issue, FEATURED_ISSUE);
  assert.equal(result.bypassDirectivePresent, true);
  assert.equal(result.bashWriteCapable, true);
  assert.equal(result.editWriteUsed, false);
  assert.equal(result.diffWouldRender, false);
  assert.equal(result.preToolUseEditWriteWouldFire, false);
  assert.equal(result.permissionMode, "bypass");
  assert.match(result.feed, /Steered|primary #90599/i);
  assert.equal(decideSeed("steered").verdict, "steered");
  assert.equal(decideSeed("90599-steered").verdict, "steered");
  assert.equal(decideSeed(90599).verdict, "steered");
});

test("2 idle/empty/{} is posted, never the product name, never empty, never error", () => {
  const result = decide(emptyAction("idle"));
  assert.equal(result.state, "posted");
  assert.equal(result.verdict, "posted");
  assert.equal(result.alarm, false);
  assert.equal(result.slack, false);
  assert.equal(result.posted, true);
  assert.equal(classify({}), "posted");
  assert.equal(classify(emptyGrille()), "posted");
  assert.equal(isIdle(emptyGrille()), true);
  assert.equal(score(emptyGrille()).posted, true);
  assertIdleNeverGrille(result);
  const bailed = decide({ action: "bail" });
  assert.equal(bailed.state, "posted");
  assert.equal(bailed.idleWord, "posted");
  const empty = decide({});
  assert.equal(empty.verdict, "posted");
  assert.match(empty.feed, /Posted/);
});

test("3 control posted stays posted with posted true", () => {
  const result = decide(seedControl());
  assert.equal(result.verdict, "posted");
  assert.equal(result.alarm, false);
  assert.equal(result.editWriteUsed, true);
  assert.equal(result.diffWouldRender, true);
  assert.equal(result.preToolUseEditWriteWouldFire, true);
  assert.equal(result.bashWriteCapable, false);
  assert.equal(result.posted, true);
  assert.match(result.feed, /Posted|Edit\/Write/);
  assert.equal(decideSeed("control").verdict, "posted");
  assert.equal(decideSeed("healthy").verdict, "posted");
  assert.equal(decide(seedControl()).posted, true);
});

test("4 slotted: Bash write, no Edit/Write card, no directive", () => {
  const result = decide(seedSlotted());
  assert.equal(result.verdict, "slotted");
  assert.equal(result.grilleSlotted, true);
  assert.equal(result.bashWriteCapable, true);
  assert.equal(result.editWriteUsed, false);
  assert.equal(result.bypassDirectivePresent, false);
  assert.equal(result.issue, DISALLOW_ISSUE);
  assert.equal(result.alarm, true);
  assert.equal(result.linear, true);
  assert.equal(result.posted, false);
  assert.match(result.feed, /Slotted|night-depository|no Edit\/Write/i);
  assert.equal(decideSeed("slotted").verdict, "slotted");
});

test("5 unreceipted: diffs vanished without a Bash-write exclusive", () => {
  const result = decide(seedUnreceipted());
  assert.equal(result.verdict, "unreceipted");
  assert.equal(result.grilleUnreceipted, true);
  assert.equal(result.diffWouldRender, false);
  assert.equal(result.editWriteUsed, false);
  assert.equal(result.bashWriteCapable, false);
  assert.equal(result.alarm, true);
  assert.equal(result.linear, false);
  assert.equal(result.posted, false);
  assert.match(result.feed, /Unreceipted|diffs vanished/i);
  assert.equal(decideSeed("unreceipted").verdict, "unreceipted");
});

test("6 unhooked: PreToolUse Write|Edit never invoked", () => {
  const result = decide(seedUnhooked());
  assert.equal(result.verdict, "unhooked");
  assert.equal(result.grilleUnhooked, true);
  assert.equal(result.preToolUseEditWriteWouldFire, false);
  assert.equal(result.issue, HOOK_ISSUE);
  assert.equal(result.alarm, true);
  assert.equal(result.linear, true);
  assert.equal(result.posted, false);
  assert.match(result.feed, /Unhooked|PreToolUse|Write\|Edit/i);
  assert.equal(decideSeed("unhooked").verdict, "unhooked");
});

test("7 killed: Windows heredoc truncated, even with the same directive", () => {
  const result = decide(seedKilled());
  assert.equal(result.verdict, "killed");
  assert.equal(result.grilleKilled, true);
  assert.equal(result.windowsPlatform, true);
  assert.equal(result.heredocPrescribed, true);
  assert.equal(result.writeFailedOrTruncated, true);
  assert.equal(result.issue, WINDOWS_ISSUE);
  assert.equal(result.alarm, true);
  assert.equal(result.linear, true);
  assert.equal(result.posted, false);
  assert.notEqual(result.verdict, "steered");
  assert.match(result.feed, /Killed|Windows|2–3×|#90597/);
  assert.equal(decideSeed("killed").verdict, "killed");
});

test("8 overlay: only CLAUDE.md prompt-vs-prompt workaround", () => {
  const result = decide(seedOverlay());
  assert.equal(result.verdict, "overlay");
  assert.equal(result.grilleOverlay, true);
  assert.equal(result.claudeMdOverrideOnly, true);
  assert.equal(result.noSettingToggle, true);
  assert.equal(result.alarm, false);
  assert.equal(result.slack, false);
  assert.equal(result.linear, false);
  assert.equal(result.posted, false);
  assert.match(result.feed, /Overlay|CLAUDE\.md|preferBashForFileOps|showEditDiffs/);
  assert.equal(decideSeed("overlay").verdict, "overlay");
});

test("9 ungated: POSIX heredoc prescribed on win32, no truncate", () => {
  const result = decide(seedUngated());
  assert.equal(result.verdict, "ungated");
  assert.equal(result.grilleUngated, true);
  assert.equal(result.windowsPlatform, true);
  assert.equal(result.heredocPrescribed, true);
  assert.equal(result.writeFailedOrTruncated, false);
  assert.equal(result.alarm, false);
  assert.equal(result.posted, false);
  assert.notEqual(result.verdict, "steered");
  assert.notEqual(result.verdict, "killed");
  assert.match(result.feed, /Ungated|win32|POSIX heredoc/);
  assert.equal(decideSeed("ungated").verdict, "ungated");
});

test("10 allowlisted: Bash(python3 *) allowlist, zero prompts", () => {
  const result = decide(seedAllowlisted());
  assert.equal(result.verdict, "allowlisted");
  assert.equal(result.grilleAllowlisted, true);
  assert.equal(result.allowlistBashWrite, true);
  assert.equal(result.bashWriteCapable, true);
  assert.equal(result.issue, ALLOWLIST_ISSUE);
  assert.equal(result.alarm, true);
  assert.equal(result.linear, false);
  assert.equal(result.posted, false);
  assert.notEqual(result.verdict, "slotted");
  assert.match(result.feed, /Allowlisted|python3|#85511/);
  assert.equal(decideSeed("allowlisted").verdict, "allowlisted");
});

test("11 restored: acceptEdits restores Edit/Write; posted false", () => {
  const result = decide(seedRestored());
  assert.equal(result.verdict, "restored");
  assert.equal(result.grilleRestored, true);
  assert.equal(result.acceptEditsRestored, true);
  assert.equal(result.editWriteUsed, true);
  assert.equal(result.diffWouldRender, true);
  assert.equal(result.alarm, false);
  assert.equal(result.slack, false);
  assert.equal(result.linear, false);
  assert.equal(result.posted, false);
  assert.match(result.feed, /Restored|acceptEdits/);
  assert.equal(decideSeed("restored").verdict, "restored");
});

test("12 score() idle grille is posted and never alarms", () => {
  const result = score(emptyGrille());
  assertScoreShape(result);
  assert.equal(result.verdict, "posted");
  assert.equal(result.slack, false);
  assert.equal(result.alarm, false);
  assert.equal(result.posted, true);
  assert.equal(result.steered, false);
});

test("13 verdict vocabulary is exactly the ten words", () => {
  assert.deepEqual(VERDICTS, [
    "posted",
    "slotted",
    "steered",
    "unreceipted",
    "unhooked",
    "killed",
    "overlay",
    "ungated",
    "allowlisted",
    "restored",
  ]);
  assert.deepEqual(SLACK_VERDICTS, [
    "slotted",
    "steered",
    "unreceipted",
    "unhooked",
    "killed",
    "allowlisted",
  ]);
  assert.deepEqual(LINEAR_VERDICTS, ["slotted", "steered", "unhooked", "killed"]);
  assert.deepEqual(ALARM_VERDICTS, SLACK_VERDICTS);
  assert.equal(IDLE_WORD, "posted");
  assert.doesNotMatch(IDLE_WORD, /grille$|bunged|dry|silent/);
});

test("14 every seeded class classifies to itself", () => {
  const rows = [
    ["posted", seedReset],
    ["steered", seedSteered],
    ["slotted", seedSlotted],
    ["unreceipted", seedUnreceipted],
    ["unhooked", seedUnhooked],
    ["killed", seedKilled],
    ["overlay", seedOverlay],
    ["ungated", seedUngated],
    ["allowlisted", seedAllowlisted],
    ["restored", seedRestored],
  ];
  for (const [word, seed] of rows) {
    assert.equal(decide(seed()).verdict, word, word);
    assert.equal(classify(seed().grille), word, word);
    assert.equal(score(seed().grille).verdict, word, word);
  }
});

test("15 admit does not lie: steered stays steered; slotted stays slotted", () => {
  const steered = decide({ ...seedSteered(), action: "admit" });
  assert.equal(steered.verdict, "steered");
  assert.equal(steered.action, "admit");
  assert.equal(steered.posted, false);
  assert.doesNotMatch(steered.verdict, /posted/);
  const slotted = decide({ ...seedSlotted(), action: "admit" });
  assert.equal(slotted.verdict, "slotted");
  const killed = decide({ ...seedKilled(), action: "admit" });
  assert.equal(killed.verdict, "killed");
});

test("16 bail / posted / reset returns idle posted", () => {
  const bailed = decide({ ...seedSteered(), action: "bail" });
  assert.equal(bailed.verdict, "posted");
  assert.equal(isIdle(bailed.grille), true);
  assertIdleNeverGrille(bailed);
  assert.equal(decide({ action: "reset" }).verdict, "posted");
  assert.equal(decide({ action: "posted" }).verdict, "posted");
  assert.equal(decide(seedReset()).verdict, "posted");
  assert.equal(decide(seedPosted()).verdict, "posted");
});

test("17 restore / steered produces the #90599 steered desk", () => {
  const result = decide({ action: "restore", grille: emptyGrille() });
  assert.equal(result.verdict, "steered");
  assert.equal(result.action, "restore");
  assert.equal(result.issue, FEATURED_ISSUE);
  assert.equal(result.posted, false);
  assert.equal(decide({ action: "steered" }).verdict, "steered");
});

test("18 flagsOf matches slack / github; linear follows slotted/steered/unhooked/killed", () => {
  assert.deepEqual(flagsOf("steered"), { slack: true, linear: true, github: true, alarm: true });
  assert.deepEqual(flagsOf("slotted"), { slack: true, linear: true, github: true, alarm: true });
  assert.deepEqual(flagsOf("unhooked"), { slack: true, linear: true, github: true, alarm: true });
  assert.deepEqual(flagsOf("killed"), { slack: true, linear: true, github: true, alarm: true });
  assert.deepEqual(flagsOf("unreceipted"), { slack: true, linear: false, github: true, alarm: true });
  assert.deepEqual(flagsOf("allowlisted"), { slack: true, linear: false, github: true, alarm: true });
  assert.deepEqual(flagsOf("overlay"), { slack: false, linear: false, github: true, alarm: false });
  assert.deepEqual(flagsOf("ungated"), { slack: false, linear: false, github: true, alarm: false });
  assert.deepEqual(flagsOf("restored"), { slack: false, linear: false, github: true, alarm: false });
  assert.deepEqual(flagsOf("posted"), { slack: false, linear: false, github: true, alarm: false });
});

test("19 helpers, reasons, analyze, priority", () => {
  assert.equal(steeredOf(seedSteered().grille), true);
  assert.equal(postedOf(emptyGrille()), true);
  assert.equal(postedOf(seedSteered().grille), false);
  assert.equal(postedOf(seedControl().grille), true);
  assert.equal(postedOf(seedRestored().grille), false);
  const reasons = reasonsOf(seedSteered().grille, "steered");
  assert.ok(reasons.some((row) => /#90599/.test(row)));
  const facts = analyze(seedSteered().grille);
  assert.equal(facts.steeredShape, true);
  assert.equal(classify(seedSteered().grille), "steered");
  assert.equal(classify(seed90599().grille), "steered");
  assert.equal(classify(seedKilled().grille), "killed");
  assert.equal(classify(seedAllowlisted().grille), "allowlisted");
});

test("20 forbidden idle list includes grille, empty, leftover names", () => {
  const words = forbiddenIdleWords();
  assert.ok(words.includes("grille"));
  assert.ok(words.includes("grill"));
  assert.ok(words.includes("empty"));
  assert.ok(words.includes("silent"));
  assert.ok(words.includes("mute"));
  assert.ok(words.includes("bunged"));
  assert.ok(words.includes("galley"));
  assert.ok(words.includes("stencil"));
  assert.ok(words.includes("spile"));
  assert.ok(!words.includes("posted"));
});

test("21 demo sinks: Slack on alarm; Linear on steered; GitHub always", async () => {
  const steered = decide(seedSteered());
  const slack = slackGrilleAlarm(steered, {});
  assert.equal(slack.mode, "demo");
  assert.match(slack.summary, /Would post to Slack/);
  assert.ok(Array.isArray(slack.body.blocks));
  const github = githubGrilleLedger(steered, {});
  assert.equal(github.mode, "demo");
  assert.match(github.summary, /Would open a GitHub grille-ledger/);
  const linear = linearGrilleTicket(steered, {});
  assert.equal(linear.mode, "demo");
  assert.match(linear.summary, /Would open a Linear ticket/);
  const honest = decide(seedControl());
  assert.match(linearGrilleTicket(honest, {}).summary, /Would skip Linear/);
  const idle = decide(emptyAction("idle"));
  assert.match(slackGrilleAlarm(idle, {}).summary, /Would skip Slack/);
  const fired = await fire(steered, {});
  assert.equal(fired.events.length, 3);
  assert.ok(fired.events.every((row) => row.ok === true));
});

test("22 Slack live plan uses SLACK_WEBHOOK alias and GITHUB_TOKEN alias", () => {
  const steered = decide(seedSteered());
  const slack = slackGrilleAlarm(steered, { SLACK_WEBHOOK: "https://hooks.example/y" });
  assert.equal(slack.mode, "live");
  const github = githubGrilleLedger(steered, { GITHUB_TOKEN: "tok" });
  assert.equal(github.mode, "live");
  const linear = linearGrilleTicket(steered, { LINEAR_API_KEY: "lin" });
  assert.equal(linear.mode, "live");
});

test("23 handle alarm classes deny; posted / control / overlay / restored / ungated allow", async () => {
  const steered = await handle(seedSteered(), {});
  assert.equal(steered.permissionDecision, "deny");
  assert.match(steered.hookSpecificOutput.decision.message, /steered/);
  assert.equal((await handle(seedSlotted(), {})).permissionDecision, "deny");
  assert.equal((await handle(seedUnreceipted(), {})).permissionDecision, "deny");
  assert.equal((await handle(seedUnhooked(), {})).permissionDecision, "deny");
  assert.equal((await handle(seedKilled(), {})).permissionDecision, "deny");
  assert.equal((await handle(seedAllowlisted(), {})).permissionDecision, "deny");
  const idle = await handle({ action: "bail" }, {});
  assert.equal(idle.permissionDecision, "allow");
  assert.match(idle.hookSpecificOutput.decision.message, /posted/);
  assert.equal((await handle(seedControl(), {})).permissionDecision, "allow");
  assert.equal((await handle(seedOverlay(), {})).permissionDecision, "allow");
  assert.equal((await handle(seedRestored(), {})).permissionDecision, "allow");
  assert.equal((await handle(seedUngated(), {})).permissionDecision, "allow");
  assert.equal((await handle(seedReset(), {})).permissionDecision, "allow");
});

test("24 listen GET health and POST empty body is posted", async () => {
  const server = listen(19893);
  await new Promise((resolve) => server.once("listening", resolve));
  const health = await fetch("http://127.0.0.1:19893/health");
  const info = await health.json();
  assert.equal(info.product, "grille");
  assert.match(info.verbs, /steered/);
  const res = await fetch("http://127.0.0.1:19893/", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: "{}",
  });
  const body = await res.json();
  assert.equal(body.verdict, "posted");
  assert.equal(body.idleWord, "posted");
  const scored = await fetch("http://127.0.0.1:19893/", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(seedSteered()),
  });
  const scoredBody = await scored.json();
  assert.equal(scoredBody.verdict, "steered");
  await new Promise((resolve) => server.close(resolve));
});

test("25 listen rejects non-JSON verbs besides health", async () => {
  const server = listen(19894);
  await new Promise((resolve) => server.once("listening", resolve));
  const put = await fetch("http://127.0.0.1:19894/", { method: "PUT" });
  assert.equal(put.status, 405);
  await new Promise((resolve) => server.close(resolve));
});

test("26 parseSessionTrace reads a #90599 steered report", () => {
  const grille = parseSessionTrace(
    "While bypass permissions mode is active. Do your work through the Bash tool. diffs vanish. no Edit. #90599 steered.",
  );
  assert.equal(classify(grille), "steered");
});

test("27 parseSessionTrace reads killed, slotted, overlay", () => {
  assert.equal(
    classify(parseSessionTrace("killed truncated here-string 2–3× tokens #90597")),
    "killed",
  );
  assert.equal(
    classify(parseSessionTrace("slotted night-depository sed / heredoc python -c write")),
    "slotted",
  );
  assert.equal(
    classify(parseSessionTrace("overlay CLAUDE.md prompt-vs-prompt preferBashForFileOps showEditDiffs")),
    "overlay",
  );
});

test("28 score() accepts the documented probe shape", () => {
  const result = score({
    session: "demo",
    issue: 90599,
    source: "hook",
    permissionMode: "bypass",
    bypassDirectivePresent: true,
    toolUsed: "Bash",
    bashWriteCapable: true,
    editWriteUsed: false,
    diffWouldRender: false,
    preToolUseEditWriteWouldFire: false,
    windowsPlatform: false,
    heredocPrescribed: true,
    writeFailedOrTruncated: false,
    allowlistBashWrite: false,
    claudeMdOverrideOnly: true,
    noSettingToggle: true,
    acceptEditsRestored: false,
    scored: false,
  });
  assert.equal(result.verdict, "steered");
  assert.equal(result.posted, false);
  const hold = score({
    permissionMode: "default",
    toolUsed: "Write",
    editWriteUsed: true,
    diffWouldRender: true,
    preToolUseEditWriteWouldFire: true,
  });
  assert.equal(hold.verdict, "posted");
  assert.equal(hold.posted, true);
});

test("29 nested grille / probe fields clone", () => {
  const grille = cloneGrille({ probe: seedSteered().grille });
  assert.equal(classify(grille), "steered");
});

test("30 fire live slack posts when fetch ok", async () => {
  const steered = decide(seedSteered());
  const events = await fire(
    steered,
    { GRILLE_SLACK_WEBHOOK: "https://hooks.example/x" },
    async () => ({
      ok: true,
      status: 200,
      json: async () => ({}),
    }),
  );
  const slack = events.events.find((row) => row.adapter === "slack");
  assert.equal(slack.ok, true);
  assert.match(slack.summary, /Posted steered/);
});

test("31 teller HTML sanity: idle word posted, seeded steered, not bung/type-case/darkroom", () => {
  const html = readFileSync(fileURLToPath(new URL("../index.html", import.meta.url)), "utf8");
  assert.match(html, /posted/);
  assert.match(html, /Score/);
  assert.match(html, /steered/);
  assert.match(html, /90599/);
  assert.match(html, /seedOf\("steered"\)|grille = seedOf\("steered"\)/);
  assert.match(html, /const IDLE_WORD = "posted"/);
  assert.doesNotMatch(html, /const IDLE_WORD = "grille"/);
  assert.doesNotMatch(html, /const IDLE_WORD = "bunged"/);
  assert.doesNotMatch(html, /const IDLE_WORD = "empty"/);
  assert.doesNotMatch(html, /const IDLE_WORD = "dry"/);
  assert.match(
    html,
    /teller-hall|marble-counter|bronze-lattice|grille-window|receipt-stamp|cash-drawer|night-slot|bypass-lamp|teller-tape|ink-blotter|bank-plaque|deposit-envelope/i,
  );
  assert.match(html, /01:50 Sydney · grille/);
  assert.match(html, /night drop through the slot is not a hold/i);
  assert.doesNotMatch(html, /class="bung-station"|class="barrel-head"|class="bung-hole"|class="brass-spile"|class="wooden-bung"|class="bung-mallet"|class="drip-tray"|class="fuse-lamp"/);
  assert.doesNotMatch(html, /class="wet-pier"|class="bollard-plate"|class="quay-lamp"|class="hawser-eye"/);
  assert.doesNotMatch(html, /class="sail-loft"|class="rigger-bench"|class="hemp-clew"/);
  assert.doesNotMatch(html, /class="type-case"|class="composing-stick"|class="galley-tray"|class="proof-sheet"/);
  assert.doesNotMatch(html, /class="darkroom"|class="enlarger"|class="film-reel"/);
  assert.doesNotMatch(html, /class="gatehouse"|class="turnstile"|class="portcullis"/);
  assert.doesNotMatch(html, /class="steam-flange"|class="packing-ring"|class="bourdon"/);
  assert.doesNotMatch(html, /Calistoga|Commissioner|Inconsolata/);
  assert.doesNotMatch(html, /Cinzel|Lora|Overpass Mono/);
  assert.doesNotMatch(html, /Yeseva One|Cabin|Anonymous Pro/);
  assert.doesNotMatch(html, /Alfa Slab One|Bitter|Space Mono/);
  assert.doesNotMatch(html, /Big Shoulders Stencil|Sora|Share Tech Mono/);
  assert.doesNotMatch(html, /Cormorant Garamond|Crimson Pro/);
  assert.doesNotMatch(html, /millimeter slider|millimetre slider/i);
  assert.match(html, /<title>Grille/);
  assert.match(html, /Playfair Display|Source Serif 4|JetBrains Mono/);
  assert.match(html, /Reset · posted|reset to posted/i);
  assert.match(html, /Restore · #90599|restore to steered/i);
  assert.match(html, /Admit posted/);
});

test("32 HTML why-not names Stencil, Veto, Tappet, Spile, Iota, Blot, Wicket", () => {
  const html = readFileSync(fileURLToPath(new URL("../index.html", import.meta.url)), "utf8");
  assert.match(html, /NOT Stencil/);
  assert.match(html, /NOT Veto/);
  assert.match(html, /NOT Tappet/);
  assert.match(html, /NOT Spile/);
  assert.match(html, /NOT Iota/);
  assert.match(html, /NOT Blot/);
  assert.match(html, /NOT Wicket/);
  assert.match(html, /leftover/);
  assert.match(html, /millimeter-slider|millimetre-slider|millimeter slider|millimetre slider/);
});

test("33 README names contrasts and posted idle", () => {
  const readme = readFileSync(fileURLToPath(new URL("../README.md", import.meta.url)), "utf8");
  assert.match(readme, /NOT \*\*Stencil\*\*|NOT Stencil|permission-mode/);
  assert.match(readme, /NOT \*\*Veto\*\*|NOT Veto/);
  assert.match(readme, /NOT \*\*Tappet\*\*|NOT Tappet/);
  assert.match(readme, /NOT \*\*Spile\*\*|NOT Spile/);
  assert.match(readme, /NOT \*\*Iota\*\*|NOT Iota/);
  assert.match(readme, /\*\*posted\*\*/);
  assert.match(readme, /#90599/);
  assert.match(readme, /\/grille\//);
  assert.doesNotMatch(readme, /idle word is grille/i);
  assert.doesNotMatch(readme, /idle word is bunged/i);
  assert.doesNotMatch(readme, /idle word is dry/i);
});

test("34 seeded 90599 numbers produce steered / posted=false", () => {
  const steered = score({
    permissionMode: "bypass",
    bypassDirectivePresent: true,
    toolUsed: "Bash",
    bashWriteCapable: true,
    editWriteUsed: false,
    diffWouldRender: false,
    preToolUseEditWriteWouldFire: false,
  });
  assert.equal(steered.verdict, "steered");
  assert.equal(steered.posted, false);
  assert.equal(steered.bypassDirectivePresent, true);
  assert.equal(steered.bashWriteCapable, true);
});

test("35 control Edit/Write path produces posted=true; steered never posted", () => {
  const hold = score({
    permissionMode: "default",
    toolUsed: "Edit",
    editWriteUsed: true,
    diffWouldRender: true,
    preToolUseEditWriteWouldFire: true,
  });
  assert.equal(hold.verdict, "posted");
  assert.equal(hold.posted, true);
  const dead = score({
    permissionMode: "bypass",
    bypassDirectivePresent: true,
    toolUsed: "Bash",
    bashWriteCapable: true,
    editWriteUsed: false,
    diffWouldRender: false,
    preToolUseEditWriteWouldFire: false,
  });
  assert.equal(dead.posted, false);
  assert.equal(dead.verdict, "steered");
});

test("36 Slack skip on posted / control / overlay / restored / ungated", () => {
  for (const seed of [seedReset, seedControl, seedOverlay, seedRestored, seedUngated, seedPosted]) {
    const result = decide(seed());
    assert.equal(result.slack, false, result.verdict);
    assert.match(slackGrilleAlarm(result, {}).summary, /Would skip Slack/);
  }
});

test("37 steered pentad wins over slotted and unreceipted", () => {
  const result = score({
    permissionMode: "bypass",
    bypassDirectivePresent: true,
    toolUsed: "Bash",
    bashWriteCapable: true,
    editWriteUsed: false,
    diffWouldRender: false,
    preToolUseEditWriteWouldFire: false,
    claudeMdOverrideOnly: true,
    noSettingToggle: true,
  });
  assert.equal(result.verdict, "steered");
  assert.equal(result.posted, false);
});

test("38 killed wins over steered when Windows heredoc is truncated", () => {
  const result = decide(seedKilled());
  assert.equal(result.verdict, "killed");
  assert.equal(result.bypassDirectivePresent, true);
  assert.equal(result.writeFailedOrTruncated, true);
  assert.notEqual(result.verdict, "steered");
  assert.notEqual(result.verdict, "slotted");
});

test("39 admit still does not lie after steered / slotted", () => {
  const admitted = decide({ ...seedSteered(), action: "admit" });
  assert.equal(admitted.verdict, "steered");
  assert.equal(admitted.posted, false);
  const slotted = decide({ ...seedSlotted(), action: "admit" });
  assert.equal(slotted.verdict, "slotted");
  assert.equal(slotted.posted, false);
});

test("40 README and teller cite #90599 and same-class issues", () => {
  const readme = readFileSync(fileURLToPath(new URL("../README.md", import.meta.url)), "utf8");
  assert.match(readme, /90599/);
  assert.match(readme, /90597/);
  assert.match(readme, /89251/);
  assert.match(readme, /85511/);
  assert.match(readme, /29709/);
  assert.match(readme, /31292/);
  assert.match(readme, /10330/);
  assert.doesNotMatch(readme, /idle word is grille |idle word is galley|idle word is bunged/i);
  const html = readFileSync(fileURLToPath(new URL("../index.html", import.meta.url)), "utf8");
  assert.match(html, /While bypass permissions mode is active|bypass permissions/);
  assert.match(html, /90597/);
  assert.match(html, /89251/);
  assert.match(html, /85511/);
  assert.match(html, /29709/);
  assert.match(html, /31292/);
  assert.match(html, /10330/);
});
