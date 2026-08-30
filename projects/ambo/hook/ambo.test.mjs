import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  fire,
  githubAmboLedger,
  linearAmboTicket,
  slackAmboAlarm,
} from "./adapters.mjs";
import {
  ALARM_VERDICTS,
  BACKUP_MCP_AUTH,
  BACKUP_OAUTH_A,
  BACKUP_OAUTH_B,
  CODEX_NEWLINES,
  CODEX_OBSERVABILITY,
  CODEX_REJECTION,
  CONTRAST_76736,
  CONTRAST_78266,
  CONTRAST_80693,
  CONTRAST_80882,
  CONTRAST_86168,
  DEMO_HOOK,
  DEMO_MESSAGE,
  DEMO_PROMPT,
  DEMO_TOOL,
  FEATURED_ISSUE,
  IDLE_WORD,
  LINEAR_VERDICTS,
  SLACK_VERDICTS,
  VERDICTS,
  analyze,
  classify,
  cloneProbe,
  decide,
  decideSeed,
  emptyAction,
  emptyProbe,
  feedOf,
  forbiddenIdleWords,
  isIdle,
  isOffAmbo,
  parseAmboJson,
  reasonsOf,
  score,
  seed90685,
  seedContrast78266,
  seedControl,
  seedDecisionFree,
  seedDeferredPath,
  seedDocsAllHooks,
  seedLoggedSuccess,
  seedPlanCard,
  seedReset,
  seedSilentSurface,
  seedTerminalSequenceOk,
  seedTuiBlank,
  seedUnheard,
  seedVscodeBlank,
  unheardOf,
  verdictOf,
} from "./ambo.mjs";
import { handle, listen } from "./index.mjs";

const PRIOR_IDLES =
  /empty|mute|idle|passed|squared|bound|girt|sheltered|alongside|seated|credited|level|verbatim|fronted|locked|yanked|caught|stowed|posted|bunged|belayed|rove|keyed|housed|beamed|snug|hung|appointed|cinched|gauged|stamped|overrun|pratique|wound|^nested$|^cut$|^switched$|^spilled$|^true$|^home$|^gripped$|^swung$|^ambo$|^pulpit$|^lectern$|^nave$|^slype$|^tally$|^pale$|^chatelaine$|^waif$|^berth$|^carrel$|^cotter$|^grille$|^wicket$/;

function assertIdleNeverAmbo(result) {
  assert.equal(result.idleWord, "unheard");
  assert.equal(IDLE_WORD, "unheard");
  assert.doesNotMatch(result.idleWord, /ambo/i);
  assert.doesNotMatch(IDLE_WORD, /^ambo$/i);
  assert.doesNotMatch(result.idleWord, PRIOR_IDLES);
}

function assertScoreShape(result) {
  assert.equal(typeof result.verdict, "string");
  assert.ok(Array.isArray(result.reasons));
  assert.equal(typeof result.unheard, "boolean");
  assert.equal(typeof result.feed, "string");
}

test("1 seed 90685 logged-success is logged-success, slack, linear, idleWord unheard, never unheard", () => {
  const seed = seedLoggedSuccess();
  const result = decide(seed);
  assert.equal(result.verdict, "logged-success");
  assert.equal(result.state, "logged-success");
  assert.equal(result.decision, "logged-success");
  assert.equal(classify(seed.ambo), "logged-success");
  assert.equal(verdictOf(seed.ambo), "logged-success");
  assert.notEqual(result.verdict, "unheard");
  assert.equal(result.alarm, true);
  assert.equal(result.slack, true);
  assert.equal(result.linear, true);
  assert.equal(result.github, true);
  assert.equal(result["logged-success"], true);
  assert.equal(result.unheard, false);
  assertIdleNeverAmbo(result);
  assert.equal(result.session, "90685-logged-success");
  assert.equal(result.issue, FEATURED_ISSUE);
  assert.equal(result.facts.hookEvent, DEMO_HOOK);
  assert.equal(result.facts.tool, DEMO_TOOL);
  assert.equal(result.facts.systemMessage, DEMO_MESSAGE);
  assert.equal(result.facts.triad, true);
  assert.equal(result.facts.hookLogSuccess, true);
  assert.equal(result.facts.parsedValidated, true);
  assert.equal(result.facts.rendered, false);
  assert.match(result.feed, /Logged-success|validated|primary #90685/i);
  assert.match(result.slackCopy, /Ambo logged-success · PermissionRequest · ExitPlanMode/);
  assert.equal(decideSeed("logged-success").verdict, "logged-success");
  assert.equal(decideSeed("90685").verdict, "logged-success");
  assert.equal(decideSeed(90685).verdict, "logged-success");
  assert.equal(decide(seed90685()).verdict, "logged-success");
});

test("2 idle/empty/{} is unheard, never the product name, never empty, never error", () => {
  const result = decide(emptyAction("idle"));
  assert.equal(result.state, "unheard");
  assert.equal(result.verdict, "unheard");
  assert.equal(result.alarm, false);
  assert.equal(result.slack, false);
  assert.equal(result.unheard, true);
  assert.equal(classify({}), "unheard");
  assert.equal(classify(emptyProbe()), "unheard");
  assert.equal(isIdle(emptyProbe()), true);
  assert.equal(score(emptyProbe()).unheard, true);
  assertIdleNeverAmbo(result);
  const bailed = decide({ action: "bail" });
  assert.equal(bailed.state, "unheard");
  assert.equal(bailed.idleWord, "unheard");
  const empty = decide({});
  assert.equal(empty.verdict, "unheard");
  assert.match(empty.feed, /Unheard/);
});

test("3 honest unheard hold: systemMessage actually rendered on the approval card", () => {
  const result = decide(seedUnheard());
  assert.equal(result.verdict, "unheard");
  assert.equal(result.alarm, false);
  assert.equal(result.unheard, true);
  assert.equal(result.linear, false);
  assert.equal(result.facts.rendered, true);
  assert.equal(result.facts.tuiRendered, true);
  assert.equal(result.facts.vscodeRendered, true);
  assert.equal(result.facts.systemMessage, DEMO_MESSAGE);
  assert.match(result.feed, /Unheard|actually rendered|idle word is unheard/i);
  assert.equal(decideSeed("control").verdict, "unheard");
  assert.equal(decideSeed("healthy").verdict, "unheard");
  assert.equal(decide(seedControl()).unheard, true);
  assert.equal(unheardOf(seedUnheard().ambo), true);
});

test("4 unheard must not be confused with logged-success, silent-surface, or contrast", () => {
  const hold = decide(seedUnheard());
  const denied = decide(seedLoggedSuccess());
  const silent = decide(seedSilentSurface());
  const contrast = decide(seedContrast78266());
  assert.equal(hold.verdict, "unheard");
  assert.equal(denied.verdict, "logged-success");
  assert.equal(silent.verdict, "silent-surface");
  assert.equal(contrast.verdict, "vscode-blank");
  assert.notEqual(hold.verdict, denied.verdict);
  assert.notEqual(hold.verdict, silent.verdict);
  assert.equal(hold.unheard, true);
  assert.equal(denied.unheard, false);
  assert.equal(silent.unheard, false);
  assert.equal(contrast.unheard, false);
  assert.equal(contrast.alarm, false);
});

test("5 plan-card: ExitPlanMode Ready-to-code card is the surface; not a hold", () => {
  const result = decide(seedPlanCard());
  assert.equal(result.verdict, "plan-card");
  assert.equal(result["plan-card"], true);
  assert.equal(result.unheard, false);
  assert.equal(result.alarm, true);
  assert.equal(result.facts.prompt, DEMO_PROMPT);
  assert.equal(analyze(seedPlanCard().ambo).triad, false);
  assert.match(result.feed, /Plan-card|Ready-to-code|never shows/i);
});

test("6 silent-surface: no surface (TUI and VS Code) renders it", () => {
  const result = decide(seedSilentSurface());
  assert.equal(result.verdict, "silent-surface");
  assert.equal(result["silent-surface"], true);
  assert.equal(result.unheard, false);
  assert.equal(result.alarm, true);
  assert.equal(result.facts.tuiRendered, false);
  assert.equal(result.facts.vscodeRendered, false);
  assert.equal(analyze(seedSilentSurface().ambo).triad, false);
  assert.match(result.feed, /Silent-surface|no surface|TUI and VS Code/i);
});

test("7 tui-blank / vscode-blank / decision-free / terminal-sequence-ok nearby flags win their own seeds", () => {
  const tui = decide(seedTuiBlank());
  assert.equal(tui.verdict, "tui-blank");
  assert.equal(tui["tui-blank"], true);
  assert.equal(tui.unheard, false);
  assert.equal(tui.facts.nearbyTuiBlank, true);
  assert.equal(analyze(seedTuiBlank().ambo).triad, false);
  assert.match(tui.feed, /Tui-blank|terminal TUI/i);

  const vscode = decide(seedVscodeBlank());
  assert.equal(vscode.verdict, "vscode-blank");
  assert.equal(vscode["vscode-blank"], true);
  assert.equal(vscode.facts.nearbyVscodeBlank, true);
  assert.match(vscode.feed, /Vscode-blank|VS Code/i);

  const free = decide(seedDecisionFree());
  assert.equal(free.verdict, "decision-free");
  assert.equal(free["decision-free"], true);
  assert.equal(free.facts.permissionDecision, "");
  assert.match(free.feed, /Decision-free|inform-only|no allow\/deny/i);

  const osc = decide(seedTerminalSequenceOk());
  assert.equal(osc.verdict, "terminal-sequence-ok");
  assert.equal(osc["terminal-sequence-ok"], true);
  assert.equal(osc.facts.terminalSequence, true);
  assert.match(osc.feed, /Terminal-sequence-ok|OSC|BEL/i);
});

test("8 docs-all-hooks and deferred-path nearby flags win; contrast #78266 is labeled", () => {
  const docs = decide(seedDocsAllHooks());
  assert.equal(docs.verdict, "docs-all-hooks");
  assert.equal(docs["docs-all-hooks"], true);
  assert.equal(docs.unheard, false);
  assert.equal(docs.alarm, true);
  assert.match(docs.feed, /Docs-all-hooks|all hooks/i);

  const deferred = decide(seedDeferredPath());
  assert.equal(deferred.verdict, "deferred-path");
  assert.equal(deferred["deferred-path"], true);
  assert.match(deferred.feed, /Deferred-path|renderer/i);

  const contrast = decide(seedContrast78266());
  assert.equal(contrast.verdict, "vscode-blank");
  assert.equal(contrast.alarm, false);
  assert.equal(contrast.issue, CONTRAST_78266);
  assert.equal(isOffAmbo(seedContrast78266().ambo), true);
  assert.equal(analyze(seedContrast78266().ambo).triad, false);
  assert.equal(decideSeed("78266").verdict, "vscode-blank");
  assert.equal(decideSeed("contrast").verdict, "vscode-blank");
});

test("9 admit does not lie: logged-success stays logged-success; restore shows #90685", () => {
  const admitted = decide({ action: "admit", ambo: seedLoggedSuccess().ambo });
  assert.equal(admitted.verdict, "logged-success");
  assert.equal(admitted.unheard, false);
  const restored = decide({ action: "restore" });
  assert.equal(restored.verdict, "logged-success");
  assert.equal(restored.facts.triad, true);
  const reset = decide(seedReset());
  assert.equal(reset.verdict, "unheard");
});

test("10 slack + linear fire on alarm verdicts; github ledger on every score", () => {
  for (const kind of SLACK_VERDICTS) {
    assert.ok(ALARM_VERDICTS.includes(kind));
    assert.ok(LINEAR_VERDICTS.includes(kind));
  }
  const denied = decide(seedLoggedSuccess());
  const slack = slackAmboAlarm(denied, {});
  assert.match(slack.summary, /Would post to Slack/);
  const linear = linearAmboTicket(denied, {});
  assert.match(linear.summary, /Would open a Linear ticket/);
  const github = githubAmboLedger(denied, {});
  assert.match(github.summary, /Would append a GitHub ambo-ledger/);
  const hold = decide(seedUnheard());
  assert.match(slackAmboAlarm(hold, {}).summary, /Would skip Slack/);
  assert.match(linearAmboTicket(hold, {}).summary, /Would skip Linear/);
});

test("11 fire() demo sinks without secrets", async () => {
  const result = decide(seedLoggedSuccess());
  const out = await fire(result, {});
  assert.equal(out.events.length, 3);
  assert.equal(out.events[0].adapter, "slack");
  assert.equal(out.events[1].adapter, "github");
  assert.equal(out.events[2].adapter, "linear");
  assert.ok(out.events.every((row) => row.mode === "demo"));
});

test("12 handle deny on logged-success, allow on unheard", async () => {
  const deny = await handle(seedLoggedSuccess());
  assert.equal(deny.permissionDecision, "deny");
  assert.equal(deny.verdict, "logged-success");
  assert.ok(Array.isArray(deny.sinks));
  const allow = await handle(seedUnheard());
  assert.equal(allow.permissionDecision, "allow");
  assert.equal(allow.verdict, "unheard");
});

test("13 verdicts locked; idle never a banned name", () => {
  assert.deepEqual(VERDICTS, [
    "unheard",
    "logged-success",
    "plan-card",
    "silent-surface",
    "tui-blank",
    "vscode-blank",
    "decision-free",
    "terminal-sequence-ok",
    "docs-all-hooks",
    "deferred-path",
  ]);
  const banned = forbiddenIdleWords();
  assert.ok(banned.includes("ambo"));
  assert.ok(banned.includes("pulpit"));
  assert.ok(banned.includes("lectern"));
  assert.ok(banned.includes("nave"));
  assert.ok(banned.includes("passed"));
  assert.ok(banned.includes("squared"));
  assert.ok(banned.includes("slype"));
  assert.ok(banned.includes("tally"));
  assert.ok(banned.includes("pale"));
  assert.ok(banned.includes("chatelaine"));
  assert.ok(!banned.includes("unheard"));
  assert.doesNotMatch(IDLE_WORD, PRIOR_IDLES);
});

test("14 parseAmboJson + cloneProbe + reasons + feed shapes", () => {
  const parsed = parseAmboJson({
    hookEvent: DEMO_HOOK,
    tool: DEMO_TOOL,
    systemMessage: DEMO_MESSAGE,
    hookLogSuccess: true,
    parsedValidated: true,
    rendered: false,
  });
  assert.equal(parsed.hookEvent, DEMO_HOOK);
  assert.equal(parsed.rendered, false);
  const cloned = cloneProbe({ ambo: { hookEvent: DEMO_HOOK } });
  assert.equal(cloned.hookEvent, DEMO_HOOK);
  const reasons = reasonsOf(seedLoggedSuccess().ambo, "logged-success");
  assert.ok(reasons.some((row) => /#90685/.test(row)));
  assert.match(feedOf("unheard"), /Unheard/);
  assertScoreShape(score(seedLoggedSuccess().ambo));
});

test("15 contrast constants and nearby priors exist as citations, not clones", () => {
  assert.equal(CONTRAST_80693, 80693);
  assert.equal(CONTRAST_78266, 78266);
  assert.equal(CONTRAST_86168, 86168);
  assert.equal(CONTRAST_80882, 80882);
  assert.equal(CONTRAST_76736, 76736);
  assert.equal(CODEX_REJECTION, 17745);
  assert.equal(CODEX_NEWLINES, 35906);
  assert.equal(CODEX_OBSERVABILITY, 33020);
  assert.equal(BACKUP_OAUTH_A, 90688);
  assert.equal(BACKUP_OAUTH_B, 90697);
  assert.equal(BACKUP_MCP_AUTH, 90677);
  assert.equal(FEATURED_ISSUE, 90685);
});

test("16 README forbids clone names and states idle word rules", () => {
  const readme = readFileSync(fileURLToPath(new URL("../README.md", import.meta.url)), "utf8");
  assert.match(readme, /NOT \**Slype/i);
  assert.match(readme, /NOT \**Tally/i);
  assert.match(readme, /NOT \**Pale/i);
  assert.match(readme, /NOT \**Chatelaine/i);
  assert.match(readme, /NOT \**Waif/i);
  assert.match(readme, /NOT \**Berth/i);
  assert.match(readme, /NOT \**Carrel/i);
  assert.match(readme, /NOT \**Cotter/i);
  assert.match(readme, /#78266/);
  assert.match(readme, /unheard/);
  assert.match(readme, /NEVER use unheard for a failure/i);
  assert.match(readme, /#90685/);
  const hookReadme = readFileSync(fileURLToPath(new URL("./README.md", import.meta.url)), "utf8");
  assert.match(hookReadme, /Idle word is \*\*unheard\*\*/);
});

test("17 listen health + handle contrast is allow (labeled, not alarm)", async () => {
  const contrast = await handle(seedContrast78266());
  assert.equal(contrast.verdict, "vscode-blank");
  assert.equal(contrast.permissionDecision, "allow");
  const server = listen(0);
  await new Promise((resolve) => server.close(resolve));
});

test("18 fail chips never use the idle word", () => {
  const fails = [
    seedLoggedSuccess(),
    seedPlanCard(),
    seedSilentSurface(),
    seedTuiBlank(),
    seedVscodeBlank(),
    seedDecisionFree(),
    seedTerminalSequenceOk(),
    seedDocsAllHooks(),
    seedDeferredPath(),
  ];
  for (const seed of fails) {
    const result = decide(seed);
    assert.notEqual(result.verdict, "unheard");
    assert.equal(result.unheard, false);
    assert.doesNotMatch(result.verdict, /unheard/i);
  }
});
