import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  fire,
  githubFasciaLedger,
  linearFasciaTicket,
  slackFasciaAlarm,
} from "./adapters.mjs";
import {
  ALARM_VERDICTS,
  CODEX_WORKTREE_CWD_ISSUE,
  DEMO_ACTUAL_90638,
  DEMO_BUTTON,
  DEMO_DIALOG_90638,
  DEMO_MODAL_90638,
  DEMO_SPAWN_CWD_90638,
  FEATURED_ISSUE,
  IDLE_WORD,
  LINEAR_VERDICTS,
  RENAME_TRUST_ISSUE,
  REPEAT_TRUST_ISSUE,
  SKILLS_TRUST_ISSUE,
  SLACK_VERDICTS,
  SLASH_TRUST_ISSUE,
  VERDICTS,
  VSCODE_TRUST_ISSUE,
  WICKET_ESCAPE_ISSUE,
  WICKET_MISBIND_ISSUE,
  WICKET_RACE_ISSUE,
  WICKET_RESET_ISSUE,
  analyze,
  classify,
  cloneFascia,
  decide,
  decideSeed,
  emptyAction,
  emptyFascia,
  feedOf,
  flagsOf,
  forbiddenIdleWords,
  frontedOf,
  isIdle,
  isWorktreePath,
  misnamedOf,
  normalizePath,
  parseSessionTrace,
  parseTrustDialog,
  pathsEqual,
  reasonsOf,
  score,
  seed90638,
  seedAccountSplit,
  seedApprovedBlind,
  seedChipStart,
  seedControl,
  seedDiverted,
  seedFronted,
  seedMisnamed,
  seedReset,
  seedSpawnCwd,
  seedTrustLie,
  seedWorktreeElsewhere,
  verdictOf,
} from "./fascia.mjs";
import { handle, listen } from "./index.mjs";

const PRIOR_IDLES =
  /empty|silent|mute|idle|dead|sealed|locked|yanked|caught|stowed|posted|bunged|belayed|rove|keyed|housed|beamed|snug|hung|appointed|cinched|gauged|stamped|overrun|pratique|wound|bound|stilled|stabled|drained|flat|fit|spoilt|laid|unlinked|tight|banked|roosted|stocked|seated|heard|clear|paired|kernel|latched|upheld|sterling|home|valid|dry|quiet|seised|rung|moored/;

function assertIdleNeverFascia(result) {
  assert.equal(result.idleWord, "fronted");
  assert.equal(IDLE_WORD, "fronted");
  assert.doesNotMatch(result.idleWord, /fascia/i);
  assert.doesNotMatch(IDLE_WORD, /^fascia$/i);
  assert.doesNotMatch(result.idleWord, PRIOR_IDLES);
}

function assertScoreShape(result) {
  assert.equal(typeof result.verdict, "string");
  assert.ok(Array.isArray(result.reasons));
  assert.equal(typeof result.fronted, "boolean");
  assert.equal(typeof result.feed, "string");
}

test("1 seed 90638 misnamed is misnamed, slack, linear, idleWord fronted, never fronted", () => {
  const seed = seedMisnamed();
  const result = decide(seed);
  assert.equal(result.verdict, "misnamed");
  assert.equal(result.state, "misnamed");
  assert.equal(result.decision, "misnamed");
  assert.equal(classify(seed.fascia), "misnamed");
  assert.equal(verdictOf(seed.fascia), "misnamed");
  assert.notEqual(result.verdict, "fronted");
  assert.equal(result.alarm, true);
  assert.equal(result.slack, true);
  assert.equal(result.linear, true);
  assert.equal(result.github, true);
  assert.equal(result.fasciaMisnamed, true);
  assert.equal(result.misnamed, true);
  assert.equal(result.fronted, false);
  assertIdleNeverFascia(result);
  assert.equal(result.session, "90638-misnamed");
  assert.equal(result.issue, FEATURED_ISSUE);
  assert.equal(result.dialogNamedPath, DEMO_DIALOG_90638);
  assert.equal(result.actualRunPath, DEMO_ACTUAL_90638);
  assert.equal(result.spawnTaskCwd, DEMO_SPAWN_CWD_90638);
  assert.match(result.dialogNamedPath, /MessageFoundry-b1-1067-repo-governance/);
  assert.match(result.actualRunPath, /\.claude\\worktrees\\heuristic-nobel-5180df/);
  assert.match(result.feed, /Misnamed|primary #90638/i);
  assert.equal(decideSeed("misnamed").verdict, "misnamed");
  assert.equal(decideSeed("90638-misnamed").verdict, "misnamed");
  assert.equal(decideSeed(90638).verdict, "misnamed");
});

test("2 idle/empty/{} is fronted, never the product name, never empty, never error", () => {
  const result = decide(emptyAction("idle"));
  assert.equal(result.state, "fronted");
  assert.equal(result.verdict, "fronted");
  assert.equal(result.alarm, false);
  assert.equal(result.slack, false);
  assert.equal(result.fronted, true);
  assert.equal(classify({}), "fronted");
  assert.equal(classify(emptyFascia()), "fronted");
  assert.equal(isIdle(emptyFascia()), true);
  assert.equal(score(emptyFascia()).fronted, true);
  assertIdleNeverFascia(result);
  const bailed = decide({ action: "bail" });
  assert.equal(bailed.state, "fronted");
  assert.equal(bailed.idleWord, "fronted");
  const empty = decide({});
  assert.equal(empty.verdict, "fronted");
  assert.match(empty.feed, /Fronted/);
});

test("3 honest control where dialog names the worktree is fronted with fronted true", () => {
  const result = decide(seedControl());
  assert.equal(result.verdict, "fronted");
  assert.equal(result.alarm, false);
  assert.equal(result.dialogNamedPath, DEMO_ACTUAL_90638);
  assert.equal(result.actualRunPath, DEMO_ACTUAL_90638);
  assert.equal(result.fronted, true);
  assert.equal(result.honestFront, true);
  assert.match(result.feed, /Fronted|consent label matches/i);
  assert.equal(decideSeed("control").verdict, "fronted");
  assert.equal(decideSeed("healthy").verdict, "fronted");
  assert.equal(decide(seedControl()).fronted, true);
});

test("4 account-split: other account trusted, active config empty, paths would match", () => {
  const result = decide(seedAccountSplit());
  assert.equal(result.verdict, "account-split");
  assert.equal(result.fasciaAccountSplit, true);
  assert.equal(result.trustPresentInOtherAccount, true);
  assert.equal(result.trustPresentInActiveConfig, false);
  assert.equal(result.pathsMatch, true);
  assert.equal(result.alarm, false);
  assert.equal(result.linear, false);
  assert.equal(result.fronted, false);
  assert.match(result.feed, /Account-split|CLAUDE_CONFIG_DIR/i);
  assert.equal(decideSeed("account-split").verdict, "account-split");
});

test("5 diverted: third shopfront, not the worktree triad", () => {
  const result = decide(seedDiverted());
  assert.equal(result.verdict, "diverted");
  assert.equal(result.fasciaDiverted, true);
  assert.equal(result.actualIsWorktree, false);
  assert.equal(result.dialogIsSpawnCwd, false);
  assert.equal(result.alarm, true);
  assert.equal(result.linear, false);
  assert.equal(result.fronted, false);
  assert.match(result.feed, /Diverted|third shopfront/i);
});

test("6 approved-blind: Trust accepted, run directory never shown", () => {
  const result = decide(seedApprovedBlind());
  assert.equal(result.verdict, "approved-blind");
  assert.equal(result.fasciaApprovedBlind, true);
  assert.equal(result.approved, true);
  assert.equal(result.actualIsWorktree, false);
  assert.equal(result.alarm, true);
  assert.equal(result.fronted, false);
  assert.match(result.feed, /Approved-blind|never on the certificate/i);
});

test("7 spawn-cwd: dialog repeats spawn_task cwd, actual is not a worktree", () => {
  const result = decide(seedSpawnCwd());
  assert.equal(result.verdict, "spawn-cwd");
  assert.equal(result.fasciaSpawnCwd, true);
  assert.equal(result.dialogIsSpawnCwd, true);
  assert.equal(result.actualIsWorktree, false);
  assert.equal(result.alarm, false);
  assert.equal(result.fronted, false);
  assert.match(result.feed, /Spawn-cwd|spawn_task cwd/i);
});

test("8 worktree-elsewhere: session under .claude/worktrees, dialog named another door", () => {
  const result = decide(seedWorktreeElsewhere());
  assert.equal(result.verdict, "worktree-elsewhere");
  assert.equal(result.fasciaWorktreeElsewhere, true);
  assert.equal(result.actualIsWorktree, true);
  assert.equal(result.dialogIsSpawnCwd, false);
  assert.equal(result.alarm, true);
  assert.equal(result.fronted, false);
  assert.match(result.feed, /Worktree-elsewhere|\.claude\/worktrees/i);
});

test("9 trust-lie: named path never ran, trust was recorded", () => {
  const result = decide(seedTrustLie());
  assert.equal(result.verdict, "trust-lie");
  assert.equal(result.fasciaTrustLie, true);
  assert.equal(result.namedPathNeverRan, true);
  assert.equal(result.trustPresentInActiveConfig, true);
  assert.equal(result.alarm, true);
  assert.equal(result.linear, true);
  assert.equal(result.fronted, false);
  assert.match(result.feed, /Trust-lie|no session used/i);
});

test("10 chip-start: Start with worktree button, run path not yet named", () => {
  const result = decide(seedChipStart());
  assert.equal(result.verdict, "chip-start");
  assert.equal(result.fasciaChipStart, true);
  assert.equal(result.button, DEMO_BUTTON);
  assert.equal(result.alarm, false);
  assert.equal(result.fronted, false);
  assert.match(result.feed, /Chip-start|Start with worktree/i);
});

test("11 score() idle fascia is fronted and never alarms", () => {
  const result = score(emptyFascia());
  assertScoreShape(result);
  assert.equal(result.verdict, "fronted");
  assert.equal(result.slack, false);
  assert.equal(result.alarm, false);
  assert.equal(result.fronted, true);
  assert.equal(result.misnamed, false);
});

test("12 verdict vocabulary is exactly the nine words", () => {
  assert.deepEqual(VERDICTS, [
    "fronted",
    "misnamed",
    "diverted",
    "approved-blind",
    "spawn-cwd",
    "worktree-elsewhere",
    "trust-lie",
    "chip-start",
    "account-split",
  ]);
  assert.deepEqual(SLACK_VERDICTS, [
    "misnamed",
    "diverted",
    "approved-blind",
    "trust-lie",
    "worktree-elsewhere",
  ]);
  assert.deepEqual(LINEAR_VERDICTS, ["misnamed", "trust-lie"]);
  assert.deepEqual(ALARM_VERDICTS, SLACK_VERDICTS);
  assert.equal(IDLE_WORD, "fronted");
  assert.doesNotMatch(IDLE_WORD, /fascia$|locked|yanked|caught|stowed|posted/);
});

test("13 every seeded class classifies to itself", () => {
  const rows = [
    ["fronted", seedReset],
    ["misnamed", seedMisnamed],
    ["diverted", seedDiverted],
    ["approved-blind", seedApprovedBlind],
    ["spawn-cwd", seedSpawnCwd],
    ["worktree-elsewhere", seedWorktreeElsewhere],
    ["trust-lie", seedTrustLie],
    ["chip-start", seedChipStart],
    ["account-split", seedAccountSplit],
  ];
  for (const [word, seed] of rows) {
    assert.equal(decide(seed()).verdict, word, word);
    assert.equal(classify(seed().fascia), word, word);
    assert.equal(score(seed().fascia).verdict, word, word);
  }
});

test("14 admit does not lie: misnamed stays misnamed; trust-lie stays trust-lie", () => {
  const misnamed = decide({ ...seedMisnamed(), action: "admit" });
  assert.equal(misnamed.verdict, "misnamed");
  assert.equal(misnamed.action, "admit");
  assert.equal(misnamed.fronted, false);
  assert.doesNotMatch(misnamed.verdict, /fronted/);
  const lie = decide({ ...seedTrustLie(), action: "admit" });
  assert.equal(lie.verdict, "trust-lie");
  const diverted = decide({ ...seedDiverted(), action: "admit" });
  assert.equal(diverted.verdict, "diverted");
});

test("15 bail / fronted / reset returns idle fronted", () => {
  const bailed = decide({ ...seedMisnamed(), action: "bail" });
  assert.equal(bailed.verdict, "fronted");
  assert.equal(isIdle(bailed.fascia), true);
  assertIdleNeverFascia(bailed);
  assert.equal(decide({ action: "reset" }).verdict, "fronted");
  assert.equal(decide({ action: "fronted" }).verdict, "fronted");
  assert.equal(decide(seedReset()).verdict, "fronted");
  assert.equal(decide(seedFronted()).verdict, "fronted");
});

test("16 restore / misnamed produces the #90638 misnamed shopfront", () => {
  const result = decide({ action: "restore", fascia: emptyFascia() });
  assert.equal(result.verdict, "misnamed");
  assert.equal(result.action, "restore");
  assert.equal(result.issue, FEATURED_ISSUE);
  assert.equal(result.fronted, false);
  assert.equal(decide({ action: "misnamed" }).verdict, "misnamed");
});

test("17 flagsOf matches slack / github; linear follows misnamed/trust-lie", () => {
  assert.deepEqual(flagsOf("misnamed"), { slack: true, linear: true, github: true, alarm: true });
  assert.deepEqual(flagsOf("trust-lie"), { slack: true, linear: true, github: true, alarm: true });
  assert.deepEqual(flagsOf("diverted"), { slack: true, linear: false, github: true, alarm: true });
  assert.deepEqual(flagsOf("approved-blind"), { slack: true, linear: false, github: true, alarm: true });
  assert.deepEqual(flagsOf("worktree-elsewhere"), { slack: true, linear: false, github: true, alarm: true });
  assert.deepEqual(flagsOf("spawn-cwd"), { slack: false, linear: false, github: true, alarm: false });
  assert.deepEqual(flagsOf("chip-start"), { slack: false, linear: false, github: true, alarm: false });
  assert.deepEqual(flagsOf("account-split"), { slack: false, linear: false, github: true, alarm: false });
  assert.deepEqual(flagsOf("fronted"), { slack: false, linear: false, github: true, alarm: false });
});

test("18 helpers, reasons, analyze, normalize", () => {
  assert.equal(misnamedOf(seedMisnamed().fascia), true);
  assert.equal(frontedOf(emptyFascia()), true);
  assert.equal(frontedOf(seedMisnamed().fascia), false);
  assert.equal(frontedOf(seedControl().fascia), true);
  assert.equal(frontedOf(seedAccountSplit().fascia), false);
  const reasons = reasonsOf(seedMisnamed().fascia, "misnamed");
  assert.ok(reasons.some((row) => /#90638/.test(row)));
  const facts = analyze(seedMisnamed().fascia);
  assert.equal(facts.misnamedShape, true);
  assert.equal(classify(seedMisnamed().fascia), "misnamed");
  assert.equal(classify(seed90638().fascia), "misnamed");
  assert.ok(pathsEqual(DEMO_DIALOG_90638, DEMO_DIALOG_90638.replace(/\\/g, "/")));
  assert.ok(isWorktreePath(DEMO_ACTUAL_90638));
  assert.equal(normalizePath("C:\\Users\\Scott\\Code\\X\\"), "c:/users/scott/code/x");
});

test("19 forbidden idle list includes fascia, empty, leftover names, not fronted", () => {
  const words = forbiddenIdleWords();
  assert.ok(words.includes("fascia"));
  assert.ok(words.includes("empty"));
  assert.ok(words.includes("silent"));
  assert.ok(words.includes("mute"));
  assert.ok(words.includes("locked"));
  assert.ok(words.includes("yanked"));
  assert.ok(words.includes("caught"));
  assert.ok(words.includes("stowed"));
  assert.ok(words.includes("placard"));
  assert.ok(words.includes("wicket"));
  assert.ok(!words.includes("fronted"));
});

test("20 demo sinks: Slack on alarm; Linear on misnamed; GitHub always; never fake live 200", async () => {
  const misnamed = decide(seedMisnamed());
  const slack = slackFasciaAlarm(misnamed, {});
  assert.equal(slack.mode, "demo");
  assert.match(slack.summary, /Would post to Slack/);
  assert.ok(Array.isArray(slack.body.blocks));
  const github = githubFasciaLedger(misnamed, {});
  assert.equal(github.mode, "demo");
  assert.match(github.summary, /Would open a GitHub fascia-ledger/);
  const linear = linearFasciaTicket(misnamed, {});
  assert.equal(linear.mode, "demo");
  assert.match(linear.summary, /Would open a Linear ticket/);
  const honest = decide(seedControl());
  assert.match(linearFasciaTicket(honest, {}).summary, /Would skip Linear/);
  const idle = decide(emptyAction("idle"));
  assert.match(slackFasciaAlarm(idle, {}).summary, /Would skip Slack/);
  const fired = await fire(misnamed, {});
  assert.equal(fired.events.length, 3);
  assert.ok(fired.events.every((row) => row.ok === true));
  assert.ok(fired.events.every((row) => row.mode === "demo"));
  assert.ok(fired.events.every((row) => !/HTTP 200|live 200/.test(row.summary || "")));
});

test("21 Slack live plan uses SLACK_WEBHOOK alias and GITHUB_TOKEN alias", () => {
  const misnamed = decide(seedMisnamed());
  const slack = slackFasciaAlarm(misnamed, { SLACK_WEBHOOK: "https://hooks.example/y" });
  assert.equal(slack.mode, "live");
  const github = githubFasciaLedger(misnamed, { GITHUB_TOKEN: "tok" });
  assert.equal(github.mode, "live");
  const linear = linearFasciaTicket(misnamed, { LINEAR_API_KEY: "lin" });
  assert.equal(linear.mode, "live");
});

test("22 handle alarm classes deny; fronted / control / spawn-cwd / chip-start / account-split allow", async () => {
  const misnamed = await handle(seedMisnamed(), {});
  assert.equal(misnamed.permissionDecision, "deny");
  assert.match(misnamed.hookSpecificOutput.decision.message, /misnamed/);
  assert.equal((await handle(seedDiverted(), {})).permissionDecision, "deny");
  assert.equal((await handle(seedApprovedBlind(), {})).permissionDecision, "deny");
  assert.equal((await handle(seedTrustLie(), {})).permissionDecision, "deny");
  assert.equal((await handle(seedWorktreeElsewhere(), {})).permissionDecision, "deny");
  const idle = await handle({ action: "bail" }, {});
  assert.equal(idle.permissionDecision, "allow");
  assert.match(idle.hookSpecificOutput.decision.message, /fronted/);
  assert.equal((await handle(seedControl(), {})).permissionDecision, "allow");
  assert.equal((await handle(seedSpawnCwd(), {})).permissionDecision, "allow");
  assert.equal((await handle(seedChipStart(), {})).permissionDecision, "allow");
  assert.equal((await handle(seedAccountSplit(), {})).permissionDecision, "allow");
  assert.equal((await handle(seedReset(), {})).permissionDecision, "allow");
});

test("23 listen GET health and POST empty body is fronted", async () => {
  const server = listen(19931);
  await new Promise((resolve) => server.once("listening", resolve));
  const health = await fetch("http://127.0.0.1:19931/health");
  const info = await health.json();
  assert.equal(info.product, "fascia");
  assert.match(info.verbs, /misnamed/);
  const res = await fetch("http://127.0.0.1:19931/", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: "{}",
  });
  const body = await res.json();
  assert.equal(body.verdict, "fronted");
  assert.equal(body.idleWord, "fronted");
  const scored = await fetch("http://127.0.0.1:19931/", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(seedMisnamed()),
  });
  const scoredBody = await scored.json();
  assert.equal(scoredBody.verdict, "misnamed");
  await new Promise((resolve) => server.close(resolve));
});

test("24 listen rejects non-JSON verbs besides health", async () => {
  const server = listen(19932);
  await new Promise((resolve) => server.once("listening", resolve));
  const put = await fetch("http://127.0.0.1:19932/", { method: "PUT" });
  assert.equal(put.status, 405);
  await new Promise((resolve) => server.close(resolve));
});

test("25 parse of the #90638 modal text is misnamed", () => {
  const fascia = parseTrustDialog(DEMO_MODAL_90638, DEMO_ACTUAL_90638, DEMO_SPAWN_CWD_90638);
  assert.equal(classify(fascia), "misnamed");
  assert.match(fascia.dialogNamedPath, /MessageFoundry-b1-1067-repo-governance/);
  assert.match(fascia.actualRunPath, /heuristic-nobel-5180df/);
  assert.match(DEMO_MODAL_90638, /Trust this workspace\?/);
  assert.match(DEMO_MODAL_90638, /MessageFoundry-b1-1067-repo-governance/);
});

test("26 parseSessionTrace reads misnamed JSON and prose", () => {
  assert.equal(
    classify(parseSessionTrace(DEMO_MODAL_90638 + "\n" + DEMO_ACTUAL_90638)),
    "misnamed",
  );
  assert.equal(
    classify(
      parseSessionTrace(
        JSON.stringify({
          dialogNamedPath: DEMO_DIALOG_90638,
          actualRunPath: DEMO_ACTUAL_90638,
          spawnTaskCwd: DEMO_SPAWN_CWD_90638,
        }),
      ),
    ),
    "misnamed",
  );
});

test("27 score() accepts the documented probe shape", () => {
  const result = score({
    session: "demo",
    issue: 90638,
    source: "hook",
    dialogNamedPath: DEMO_DIALOG_90638,
    actualRunPath: DEMO_ACTUAL_90638,
    spawnTaskCwd: DEMO_SPAWN_CWD_90638,
    button: DEMO_BUTTON,
    configDir: "C:\\Users\\Scott\\.claude-account-2",
    trustPresentInActiveConfig: false,
    trustPresentInOtherAccount: true,
    platform: "windows",
    scored: false,
  });
  assert.equal(result.verdict, "misnamed");
  assert.equal(result.fronted, false);
  const hold = score({
    dialogNamedPath: DEMO_ACTUAL_90638,
    actualRunPath: DEMO_ACTUAL_90638,
  });
  assert.equal(hold.verdict, "fronted");
  assert.equal(hold.fronted, true);
});

test("28 nested fascia / probe fields clone", () => {
  const fascia = cloneFascia({ probe: seedMisnamed().fascia });
  assert.equal(classify(fascia), "misnamed");
});

test("29 fire live slack posts when fetch ok", async () => {
  const misnamed = decide(seedMisnamed());
  const events = await fire(
    misnamed,
    { FASCIA_SLACK_WEBHOOK: "https://hooks.example/x" },
    async () => ({
      ok: true,
      status: 200,
      json: async () => ({}),
    }),
  );
  const slack = events.events.find((row) => row.adapter === "slack");
  assert.equal(slack.ok, true);
  assert.match(slack.summary, /Posted misnamed/);
});

test("30 shopfront HTML sanity: idle word fronted, seeded misnamed, not quoin/gaff/sear", () => {
  const html = readFileSync(fileURLToPath(new URL("../index.html", import.meta.url)), "utf8");
  assert.match(html, /fronted/);
  assert.match(html, /Score/);
  assert.match(html, /misnamed/);
  assert.match(html, /90638/);
  assert.match(html, /seedOf\("misnamed"\)|fascia = seedOf\("misnamed"\)/);
  assert.match(html, /const IDLE_WORD = "fronted"/);
  assert.doesNotMatch(html, /const IDLE_WORD = "fascia"/);
  assert.doesNotMatch(html, /const IDLE_WORD = "locked"/);
  assert.doesNotMatch(html, /const IDLE_WORD = "empty"/);
  assert.doesNotMatch(html, /const IDLE_WORD = "yanked"/);
  assert.match(
    html,
    /shopfront-street|enamel-fascia-board|brass-house-numbers|frosted-shop-door|night-shutter|cream-certificate|path-ledger/i,
  );
  assert.match(html, /06:50 Sydney · fascia/);
  assert.match(html, /misnamed fascia is not a hold/i);
  assert.doesNotMatch(html, /class="composing-room"|class="oak-chase"|class="brass-quoin"|class="ink-slab"/);
  assert.doesNotMatch(html, /class="music-hall"|class="house-curtain"|class="proscenium-arch"|class="brass-crook"/);
  assert.doesNotMatch(html, /class="gunsmith-shop"|class="sear-rail"|class="walnut-stock"/);
  assert.doesNotMatch(html, /class="teller-hall"|class="marble-counter"|class="bronze-lattice"/);
  assert.doesNotMatch(html, /class="mailroom-hall"|class="cubby-wall"/);
  assert.doesNotMatch(html, /Bodoni Moda|Roboto Mono/);
  assert.doesNotMatch(html, /Abril Fatface|Bebas Neue|Cutive Mono/);
  assert.doesNotMatch(html, /Calistoga|Commissioner|Inconsolata/);
  assert.doesNotMatch(html, /Cinzel|Lora|Overpass Mono/);
  assert.doesNotMatch(html, /millimeter slider|millimetre slider/i);
  assert.match(html, /<title>Fascia/);
  assert.match(html, /Playfair Display|IBM Plex Mono/);
  assert.match(html, /Admit fronted/);
  assert.match(html, /Restore · #90638|restore to misnamed/i);
});

test("31 HTML why-not names Wicket, Snib, Iota, Damper, Hasp, Cubby", () => {
  const html = readFileSync(fileURLToPath(new URL("../index.html", import.meta.url)), "utf8");
  assert.match(html, /NOT Wicket/);
  assert.match(html, /NOT Snib/);
  assert.match(html, /NOT Iota/);
  assert.match(html, /NOT Damper/);
  assert.match(html, /NOT Hasp/);
  assert.match(html, /NOT Cubby/);
  assert.match(html, /leftover/);
  assert.match(html, /millimeter-slider|millimetre-slider|millimeter slider|millimetre slider/);
});

test("32 README names contrasts and fronted idle", () => {
  const readme = readFileSync(fileURLToPath(new URL("../README.md", import.meta.url)), "utf8");
  assert.match(readme, /NOT \*\*Wicket\*\*|NOT Wicket/);
  assert.match(readme, /NOT \*\*Snib\*\*|NOT Snib/);
  assert.match(readme, /NOT \*\*Iota\*\*|NOT Iota/);
  assert.match(readme, /NOT \*\*Quoin\*\*|NOT Quoin/);
  assert.match(readme, /\*\*fronted\*\*/);
  assert.match(readme, /#90638/);
  assert.match(readme, /#54628/);
  assert.match(readme, /#74726/);
  assert.match(readme, /\/fascia\//);
  assert.doesNotMatch(readme, /idle word is fascia/i);
  assert.doesNotMatch(readme, /idle word is locked/i);
  assert.doesNotMatch(readme, /idle word is yanked/i);
});

test("33 seeded 90638 numbers produce misnamed / fronted=false", () => {
  const misnamed = score({
    dialogNamedPath: DEMO_DIALOG_90638,
    actualRunPath: DEMO_ACTUAL_90638,
    spawnTaskCwd: DEMO_SPAWN_CWD_90638,
    button: DEMO_BUTTON,
    trustPresentInActiveConfig: false,
    trustPresentInOtherAccount: true,
    platform: "windows",
  });
  assert.equal(misnamed.verdict, "misnamed");
  assert.equal(misnamed.fronted, false);
  assert.equal(misnamed.actualIsWorktree, true);
  assert.equal(misnamed.dialogIsSpawnCwd, true);
});

test("34 control matching paths produce fronted=true; misnamed never fronted", () => {
  const hold = score({
    dialogNamedPath: DEMO_ACTUAL_90638,
    actualRunPath: DEMO_ACTUAL_90638,
  });
  assert.equal(hold.verdict, "fronted");
  assert.equal(hold.fronted, true);
  const lie = score({
    dialogNamedPath: DEMO_DIALOG_90638,
    actualRunPath: DEMO_ACTUAL_90638,
    spawnTaskCwd: DEMO_SPAWN_CWD_90638,
  });
  assert.equal(lie.fronted, false);
  assert.equal(lie.verdict, "misnamed");
});

test("35 Slack skip on fronted / control / spawn-cwd / chip-start / account-split", () => {
  for (const seed of [seedReset, seedControl, seedSpawnCwd, seedChipStart, seedAccountSplit, seedFronted]) {
    const result = decide(seed());
    assert.equal(result.slack, false, result.verdict);
    assert.match(slackFasciaAlarm(result, {}).summary, /Would skip Slack/);
  }
});

test("36 misnamed triad wins over approved-blind and account-split flags", () => {
  const result = score({
    dialogNamedPath: DEMO_DIALOG_90638,
    actualRunPath: DEMO_ACTUAL_90638,
    spawnTaskCwd: DEMO_SPAWN_CWD_90638,
    approved: true,
    trustPresentInOtherAccount: true,
    trustPresentInActiveConfig: false,
  });
  assert.equal(result.verdict, "misnamed");
  assert.equal(result.fronted, false);
});

test("37 admit still does not lie after misnamed / diverted", () => {
  const admitted = decide({ ...seedMisnamed(), action: "admit" });
  assert.equal(admitted.verdict, "misnamed");
  assert.equal(admitted.fronted, false);
  const diverted = decide({ ...seedDiverted(), action: "admit" });
  assert.equal(diverted.verdict, "diverted");
  assert.equal(diverted.fronted, false);
});

test("38 HTML parse prefers JSON so dialog+actual+spawn is misnamed not diverted", () => {
  const html = readFileSync(fileURLToPath(new URL("../index.html", import.meta.url)), "utf8");
  assert.match(html, /raw\.startsWith\("\{"\)|startsWith\("\{"\)/);
  const probe = score({
    dialogNamedPath: DEMO_DIALOG_90638,
    actualRunPath: DEMO_ACTUAL_90638,
    spawnTaskCwd: DEMO_SPAWN_CWD_90638,
  });
  assert.equal(probe.verdict, "misnamed");
  assert.equal(probe.fronted, false);
});

test("39 README and shopfront cite #90638 related trust issues and Wicket not-this", () => {
  const readme = readFileSync(fileURLToPath(new URL("../README.md", import.meta.url)), "utf8");
  assert.match(readme, /90638/);
  assert.match(readme, /54628/);
  assert.match(readme, /87325/);
  assert.match(readme, /67319/);
  assert.match(readme, /90041/);
  assert.match(readme, /74794/);
  assert.match(readme, /74726/);
  assert.match(readme, /16525/);
  assert.doesNotMatch(readme, /idle word is fascia |idle word is locked|idle word is yanked/i);
  const html = readFileSync(fileURLToPath(new URL("../index.html", import.meta.url)), "utf8");
  assert.match(html, /Trust this workspace/);
  assert.match(html, /54628/);
  assert.match(html, /87325/);
  assert.match(html, /67319/);
  assert.match(html, /90041/);
  assert.match(html, /74794/);
  assert.match(html, /74726/);
  assert.match(html, /16525/);
  assert.match(html, new RegExp(String(REPEAT_TRUST_ISSUE)));
  assert.match(html, new RegExp(String(SKILLS_TRUST_ISSUE)));
  assert.match(html, new RegExp(String(VSCODE_TRUST_ISSUE)));
  assert.match(html, new RegExp(String(SLASH_TRUST_ISSUE)));
  assert.match(html, new RegExp(String(RENAME_TRUST_ISSUE)));
  assert.match(html, new RegExp(String(WICKET_ESCAPE_ISSUE)));
  assert.match(html, new RegExp(String(WICKET_RESET_ISSUE)));
  assert.match(html, new RegExp(String(WICKET_RACE_ISSUE)));
  assert.match(html, new RegExp(String(WICKET_MISBIND_ISSUE)));
  assert.match(html, new RegExp(String(CODEX_WORKTREE_CWD_ISSUE)));
  assert.match(html, /heuristic-nobel-5180df|MessageFoundry-b1-1067/);
  assert.ok(DEMO_MODAL_90638.includes("Trust this workspace?"));
});
