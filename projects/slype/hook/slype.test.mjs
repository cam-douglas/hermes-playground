import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  fire,
  githubSlypeLedger,
  linearSlypeTicket,
  slackSlypeAlarm,
} from "./adapters.mjs";
import {
  ALARM_VERDICTS,
  CODEX_CREATEPROCESS,
  CODEX_MSIX,
  CODEX_RESTRICTED,
  CONTRAST_77470,
  CONTRAST_78596,
  CONTRAST_85475,
  CONTRAST_86551,
  CONTRAST_89884,
  CONTRAST_90077,
  DEMO_POWERSHELL,
  DEMO_PWSH,
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
  isOffSlype,
  parseSlypeJson,
  reasonsOf,
  score,
  seed126,
  seed90676,
  seedAllowlistMiss,
  seedControl,
  seedMsixStore,
  seedPassed,
  seedPathBlocked,
  seedPowershellOk,
  seedProgramfilesDenied,
  seedPwshDead,
  seedReset,
  seedSandbox,
  seedSystem32Ok,
  passedOf,
  verdictOf,
} from "./slype.mjs";
import { handle, listen } from "./index.mjs";

const PRIOR_IDLES =
  /empty|mute|idle|squared|bound|girt|sheltered|alongside|seated|credited|level|verbatim|fronted|locked|yanked|caught|stowed|posted|bunged|belayed|rove|keyed|housed|beamed|snug|hung|appointed|cinched|gauged|stamped|overrun|pratique|wound|^nested$|^cut$|^switched$|^spilled$|^true$|^home$|^gripped$|^swung$|^slype$|^undercroft$|^narthex$|^galilee$|^postern$|^yett$|^collet$|^chuck$|^mandrel$|^portcullis$|^turnstile$|^lodge$|^porter$|^barbican$|^sallyport$|^boom$|^wicket$|^pale$|^grille$|^cotter$|^tally$/;

function assertIdleNeverSlype(result) {
  assert.equal(result.idleWord, "passed");
  assert.equal(IDLE_WORD, "passed");
  assert.doesNotMatch(result.idleWord, /slype/i);
  assert.doesNotMatch(IDLE_WORD, /^slype$/i);
  assert.doesNotMatch(result.idleWord, PRIOR_IDLES);
}

function assertScoreShape(result) {
  assert.equal(typeof result.verdict, "string");
  assert.ok(Array.isArray(result.reasons));
  assert.equal(typeof result.passed, "boolean");
  assert.equal(typeof result.feed, "string");
}

test("1 seed 90676 126 is 126, slack, linear, idleWord passed, never passed", () => {
  const seed = seed126();
  const result = decide(seed);
  assert.equal(result.verdict, "126");
  assert.equal(result.state, "126");
  assert.equal(result.decision, "126");
  assert.equal(classify(seed.slype), "126");
  assert.equal(verdictOf(seed.slype), "126");
  assert.notEqual(result.verdict, "passed");
  assert.equal(result.alarm, true);
  assert.equal(result.slack, true);
  assert.equal(result.linear, true);
  assert.equal(result.github, true);
  assert.equal(result["126"], true);
  assert.equal(result.passed, false);
  assertIdleNeverSlype(result);
  assert.equal(result.session, "90676-126");
  assert.equal(result.issue, FEATURED_ISSUE);
  assert.equal(result.facts.pwshExit, 126);
  assert.equal(result.facts.powershellExit, 0);
  assert.equal(result.facts.triad, true);
  assert.equal(result.facts.sandbox, true);
  assert.equal(result.facts.outsideOk, true);
  assert.match(result.facts.pwshPath, /Program Files/i);
  assert.match(result.facts.powershellPath, /System32/i);
  assert.match(result.feed, /126|Permission denied|primary #90676/i);
  assert.match(result.slackCopy, /Slype 126 · pwsh 126 · powershell 0/);
  assert.equal(decideSeed("126").verdict, "126");
  assert.equal(decideSeed("90676").verdict, "126");
  assert.equal(decideSeed(90676).verdict, "126");
  assert.equal(decide(seed90676()).verdict, "126");
});

test("2 idle/empty/{} is passed, never the product name, never empty, never error", () => {
  const result = decide(emptyAction("idle"));
  assert.equal(result.state, "passed");
  assert.equal(result.verdict, "passed");
  assert.equal(result.alarm, false);
  assert.equal(result.slack, false);
  assert.equal(result.passed, true);
  assert.equal(classify({}), "passed");
  assert.equal(classify(emptyProbe()), "passed");
  assert.equal(isIdle(emptyProbe()), true);
  assert.equal(score(emptyProbe()).passed, true);
  assertIdleNeverSlype(result);
  const bailed = decide({ action: "bail" });
  assert.equal(bailed.state, "passed");
  assert.equal(bailed.idleWord, "passed");
  const empty = decide({});
  assert.equal(empty.verdict, "passed");
  assert.match(empty.feed, /Passed/);
});

test("3 honest passed hold: pwsh.exe is actually executable in the session", () => {
  const result = decide(seedPassed());
  assert.equal(result.verdict, "passed");
  assert.equal(result.alarm, false);
  assert.equal(result.passed, true);
  assert.equal(result.linear, false);
  assert.equal(result.facts.pwshExit, 0);
  assert.equal(result.facts.powershellExit, 0);
  assert.equal(result.facts.pwshPath, DEMO_PWSH);
  assert.equal(result.facts.powershellPath, DEMO_POWERSHELL);
  assert.match(result.feed, /Passed|executable in the session|idle word is passed/i);
  assert.equal(decideSeed("control").verdict, "passed");
  assert.equal(decideSeed("healthy").verdict, "passed");
  assert.equal(decide(seedControl()).passed, true);
  assert.equal(passedOf(seedPassed().slype), true);
});

test("4 passed must not be confused with 126, programfiles-denied, or msix-store", () => {
  const hold = decide(seedPassed());
  const denied = decide(seed126());
  const friar = decide(seedProgramfilesDenied());
  const contrast = decide(seedMsixStore());
  assert.equal(hold.verdict, "passed");
  assert.equal(denied.verdict, "126");
  assert.equal(friar.verdict, "programfiles-denied");
  assert.equal(contrast.verdict, "msix-store");
  assert.notEqual(hold.verdict, denied.verdict);
  assert.notEqual(hold.verdict, friar.verdict);
  assert.equal(hold.passed, true);
  assert.equal(denied.passed, false);
  assert.equal(friar.passed, false);
  assert.equal(contrast.passed, false);
});

test("5 system32-ok: garrison door opens; not a hold", () => {
  const result = decide(seedSystem32Ok());
  assert.equal(result.verdict, "system32-ok");
  assert.equal(result["system32-ok"], true);
  assert.equal(result.passed, false);
  assert.equal(result.alarm, true);
  assert.equal(result.facts.powershellExit, 0);
  assert.match(result.facts.powershellPath, /System32/i);
  assert.equal(analyze(seedSystem32Ok().slype).triad, false);
  assert.match(result.feed, /System32-ok|garrison|not proof/i);
});

test("6 programfiles-denied: visiting-friar door 126s", () => {
  const result = decide(seedProgramfilesDenied());
  assert.equal(result.verdict, "programfiles-denied");
  assert.equal(result["programfiles-denied"], true);
  assert.equal(result.passed, false);
  assert.equal(result.alarm, true);
  assert.equal(result.facts.pwshExit, 126);
  assert.match(result.facts.pwshPath, /Program Files/i);
  assert.equal(result.facts.nearbyProgramfilesDenied, true);
  assert.notEqual(result.verdict, "126");
  assert.match(result.feed, /Programfiles-denied|visiting-friar|denied path/i);
});

test("7 sandbox: block is the session sandbox, not the OS", () => {
  const result = decide(seedSandbox());
  assert.equal(result.verdict, "sandbox");
  assert.equal(result.sandbox, true);
  assert.equal(result.passed, false);
  assert.equal(result.alarm, true);
  assert.equal(result.facts.sandbox, true);
  assert.equal(result.facts.outsideOk, true);
  assert.equal(analyze(seedSandbox().slype).triad, false);
  assert.match(result.feed, /Sandbox|sandboxed session|not the OS/i);
});

test("8 pwsh-dead / powershell-ok / path-blocked / allowlist-miss nearby flags win their own seeds", () => {
  const dead = decide(seedPwshDead());
  assert.equal(dead.verdict, "pwsh-dead");
  assert.equal(dead["pwsh-dead"], true);
  assert.equal(dead.passed, false);
  assert.equal(dead.facts.nearbyPwshDead, true);
  assert.equal(analyze(seedPwshDead().slype).triad, false);
  assert.match(dead.feed, /Pwsh-dead|targets pwsh 7/i);

  const bash = decide(seedPowershellOk());
  assert.equal(bash.verdict, "powershell-ok");
  assert.equal(bash["powershell-ok"], true);
  assert.equal(bash.facts.tool, "Bash");
  assert.match(bash.feed, /Powershell-ok|Bash plus powershell/i);

  const path = decide(seedPathBlocked());
  assert.equal(path.verdict, "path-blocked");
  assert.equal(path["path-blocked"], true);
  assert.equal(path.facts.nearbyPathBlocked, true);
  assert.match(path.feed, /Path-blocked|system-path/i);

  const miss = decide(seedAllowlistMiss());
  assert.equal(miss.verdict, "allowlist-miss");
  assert.equal(miss["allowlist-miss"], true);
  assert.equal(miss.facts.nearbyAllowlistMiss, true);
  assert.match(miss.feed, /Allowlist-miss|missing from the sandbox allow-list/i);
});

test("9 msix-store: Codex 35871 is contrast, not this defect", () => {
  const result = decide(seedMsixStore());
  assert.equal(result.verdict, "msix-store");
  assert.equal(result["msix-store"], true);
  assert.equal(result.passed, false);
  assert.equal(result.alarm, false);
  assert.equal(result.issue, CODEX_MSIX);
  assert.equal(isOffSlype(seedMsixStore().slype), true);
  assert.equal(analyze(seedMsixStore().slype).triad, false);
  assert.match(result.feed, /Msix-store|#35871|MSIX/i);
  assert.equal(decideSeed("35871").verdict, "msix-store");
  assert.equal(decideSeed("msix").verdict, "msix-store");
});

test("10 admit does not lie: 126 stays 126; restore shows #90676", () => {
  const admitted = decide({ action: "admit", slype: seed126().slype });
  assert.equal(admitted.verdict, "126");
  assert.equal(admitted.passed, false);
  const restored = decide({ action: "restore" });
  assert.equal(restored.verdict, "126");
  assert.equal(restored.facts.triad, true);
  const reset = decide(seedReset());
  assert.equal(reset.verdict, "passed");
});

test("11 slack + linear fire on alarm verdicts; github ledger on every score", () => {
  for (const kind of SLACK_VERDICTS) {
    assert.ok(ALARM_VERDICTS.includes(kind));
    assert.ok(LINEAR_VERDICTS.includes(kind));
  }
  const denied = decide(seed126());
  const slack = slackSlypeAlarm(denied, {});
  assert.match(slack.summary, /Would post to Slack/);
  const linear = linearSlypeTicket(denied, {});
  assert.match(linear.summary, /Would open a Linear ticket/);
  const github = githubSlypeLedger(denied, {});
  assert.match(github.summary, /Would append a GitHub slype-ledger/);
  const hold = decide(seedPassed());
  assert.match(slackSlypeAlarm(hold, {}).summary, /Would skip Slack/);
  assert.match(linearSlypeTicket(hold, {}).summary, /Would skip Linear/);
});

test("12 fire() demo sinks without secrets", async () => {
  const result = decide(seed126());
  const out = await fire(result, {});
  assert.equal(out.events.length, 3);
  assert.equal(out.events[0].adapter, "slack");
  assert.equal(out.events[1].adapter, "github");
  assert.equal(out.events[2].adapter, "linear");
  assert.ok(out.events.every((row) => row.mode === "demo"));
});

test("13 handle deny on 126, allow on passed", async () => {
  const deny = await handle(seed126());
  assert.equal(deny.permissionDecision, "deny");
  assert.equal(deny.verdict, "126");
  assert.ok(Array.isArray(deny.sinks));
  const allow = await handle(seedPassed());
  assert.equal(allow.permissionDecision, "allow");
  assert.equal(allow.verdict, "passed");
});

test("14 verdicts locked; idle never a banned name", () => {
  assert.deepEqual(VERDICTS, [
    "passed",
    "126",
    "system32-ok",
    "programfiles-denied",
    "sandbox",
    "pwsh-dead",
    "powershell-ok",
    "path-blocked",
    "allowlist-miss",
    "msix-store",
  ]);
  const banned = forbiddenIdleWords();
  assert.ok(banned.includes("slype"));
  assert.ok(banned.includes("undercroft"));
  assert.ok(banned.includes("squared"));
  assert.ok(banned.includes("bound"));
  assert.ok(!banned.includes("passed"));
  assert.doesNotMatch(IDLE_WORD, PRIOR_IDLES);
});

test("15 parseSlypeJson + cloneProbe + reasons + feed shapes", () => {
  const parsed = parseSlypeJson({
    pwshExit: 126,
    powershellExit: 0,
    pwshPath: DEMO_PWSH,
    powershellPath: DEMO_POWERSHELL,
  });
  assert.equal(parsed.pwshExit, 126);
  assert.equal(parsed.powershellExit, 0);
  const cloned = cloneProbe({ slype: { pwshExit: 126 } });
  assert.equal(cloned.pwshExit, 126);
  const reasons = reasonsOf(seed126().slype, "126");
  assert.ok(reasons.some((row) => /#90676/.test(row)));
  assert.match(feedOf("passed"), /Passed/);
  assertScoreShape(score(seed126().slype));
});

test("16 contrast constants and nearby priors exist as citations, not clones", () => {
  assert.equal(CONTRAST_90077, 90077);
  assert.equal(CONTRAST_89884, 89884);
  assert.equal(CONTRAST_85475, 85475);
  assert.equal(CONTRAST_78596, 78596);
  assert.equal(CONTRAST_77470, 77470);
  assert.equal(CONTRAST_86551, 86551);
  assert.equal(CODEX_RESTRICTED, 38222);
  assert.equal(CODEX_MSIX, 35871);
  assert.equal(CODEX_CREATEPROCESS, 37592);
  assert.equal(FEATURED_ISSUE, 90676);
});

test("17 README forbids clone names and states idle word rules", () => {
  const readme = readFileSync(fileURLToPath(new URL("../README.md", import.meta.url)), "utf8");
  assert.match(readme, /NOT \**Calque/i);
  assert.match(readme, /NOT \**Sear/i);
  assert.match(readme, /NOT \**Clew/i);
  assert.match(readme, /NOT \**Grille/i);
  assert.match(readme, /NOT \**Waif/i);
  assert.match(readme, /NOT \**Pale/i);
  assert.match(readme, /NOT \**Chatelaine/i);
  assert.match(readme, /NOT \**Tally/i);
  assert.match(readme, /NOT \**Cotter/i);
  assert.match(readme, /#35871/);
  assert.match(readme, /passed/);
  assert.match(readme, /NEVER use passed for a failure/i);
  assert.match(readme, /#90676/);
  const hookReadme = readFileSync(fileURLToPath(new URL("./README.md", import.meta.url)), "utf8");
  assert.match(hookReadme, /Idle word is \*\*passed\*\*/);
});

test("18 listen health + handle msix-store is allow (contrast, not alarm)", async () => {
  const contrast = await handle(seedMsixStore());
  assert.equal(contrast.verdict, "msix-store");
  assert.equal(contrast.permissionDecision, "allow");
  const server = listen(0);
  await new Promise((resolve) => server.close(resolve));
});
