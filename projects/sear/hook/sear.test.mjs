import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  fire,
  githubSearLedger,
  linearSearTicket,
  slackSearAlarm,
} from "./adapters.mjs";
import {
  ALARM_VERDICTS,
  CHANNEL_LIE_ISSUE,
  CODEX_PWSH_QUOTE_ISSUE,
  CODEX_STILL_RUNNING_ISSUE,
  DEMO_REPRO,
  DEMO_WRAPPER,
  EXIT_144_ISSUE,
  FEATURED_ISSUE,
  IDLE_WORD,
  LINEAR_VERDICTS,
  SLACK_VERDICTS,
  VERDICTS,
  analyze,
  classify,
  cloneSear,
  decide,
  decideSeed,
  emptyAction,
  emptySear,
  feedOf,
  flagsOf,
  forbiddenIdleWords,
  isIdle,
  parseSessionTrace,
  reasonsOf,
  score,
  seed90611,
  seedCaught,
  seedChained,
  seedContinued,
  seedControl,
  seedFreshbash,
  seedInert,
  seedNonfinal,
  seedPhantomOk,
  seedReset,
  seedSuppressed,
  seedSurvived,
  seedWiped,
  caughtOf,
  inertOf,
  verdictOf,
} from "./sear.mjs";
import { handle, listen } from "./index.mjs";

function assertIdleNeverSear(result) {
  assert.equal(result.idleWord, "caught");
  assert.equal(IDLE_WORD, "caught");
  assert.doesNotMatch(result.idleWord, /sear/i);
  assert.doesNotMatch(IDLE_WORD, /^sear$/i);
  assert.doesNotMatch(result.idleWord, /empty|silent|mute|idle|dead/i);
  assert.doesNotMatch(
    result.idleWord,
    /posted|bunged|belayed|rove|keyed|housed|beamed|snug|hung|appointed|cinched|gauged|stamped|overrun|pratique|wound|bound|stilled|stabled|drained|flat|fit|spoilt|laid|unlinked|tight|banked|roosted|stocked|seated|heard|clear|paired|kernel|latched|upheld|sterling|home|valid|dry|sealed|quiet|seised|rung|moored|stowed/,
  );
}

function assertScoreShape(result) {
  assert.equal(typeof result.verdict, "string");
  assert.ok(Array.isArray(result.reasons));
  assert.equal(typeof result.caught, "boolean");
  assert.equal(typeof result.feed, "string");
}

test("1 seed 90611 inert is inert, slack, linear, idleWord caught, never caught", () => {
  const seed = seedInert();
  const result = decide(seed);
  assert.equal(result.verdict, "inert");
  assert.equal(result.state, "inert");
  assert.equal(result.decision, "inert");
  assert.equal(classify(seed.sear), "inert");
  assert.equal(verdictOf(seed.sear), "inert");
  assert.notEqual(result.verdict, "caught");
  assert.ok(["inert", "survived", "nonfinal", "phantom-ok"].includes(result.verdict));
  assert.equal(result.alarm, true);
  assert.equal(result.slack, true);
  assert.equal(result.linear, true);
  assert.equal(result.github, true);
  assert.equal(result.searInert, true);
  assert.equal(result.inert, true);
  assert.equal(result.caught, false);
  assertIdleNeverSear(result);
  assert.equal(result.session, "90611-inert");
  assert.equal(result.issue, FEATURED_ISSUE);
  assert.equal(result.setEPresent, true);
  assert.equal(result.wrapperEvalNonFinalAnd, true);
  assert.equal(result.falseThenEchoSurvived, true);
  assert.equal(result.toolExitZeroDespiteMidFail, true);
  assert.equal(result.wipeAfterFailedCopy, true);
  assert.match(result.feed, /Inert|primary #90611/i);
  assert.equal(decideSeed("inert").verdict, "inert");
  assert.equal(decideSeed("90611-inert").verdict, "inert");
  assert.equal(decideSeed(90611).verdict, "inert");
});

test("2 idle/empty/{} is caught, never the product name, never empty, never error", () => {
  const result = decide(emptyAction("idle"));
  assert.equal(result.state, "caught");
  assert.equal(result.verdict, "caught");
  assert.equal(result.alarm, false);
  assert.equal(result.slack, false);
  assert.equal(result.caught, true);
  assert.equal(classify({}), "caught");
  assert.equal(classify(emptySear()), "caught");
  assert.equal(isIdle(emptySear()), true);
  assert.equal(score(emptySear()).caught, true);
  assertIdleNeverSear(result);
  const bailed = decide({ action: "bail" });
  assert.equal(bailed.state, "caught");
  assert.equal(bailed.idleWord, "caught");
  const empty = decide({});
  assert.equal(empty.verdict, "caught");
  assert.match(empty.feed, /Caught/);
});

test("3 control caught stays caught with caught true", () => {
  const result = decide(seedControl());
  assert.equal(result.verdict, "caught");
  assert.equal(result.alarm, false);
  assert.equal(result.setEPresent, true);
  assert.equal(result.wrapperEvalNonFinalAnd, false);
  assert.equal(result.freshBashEc, true);
  assert.equal(result.falseThenEchoSurvived, false);
  assert.equal(result.caught, true);
  assert.match(result.feed, /Caught|sear engaged|would abort/i);
  assert.equal(decideSeed("control").verdict, "caught");
  assert.equal(decideSeed("healthy").verdict, "caught");
  assert.equal(decide(seedControl()).caught, true);
});

test("4 survived: echo survived without the inert pair", () => {
  const result = decide(seedSurvived());
  assert.equal(result.verdict, "survived");
  assert.equal(result.searSurvived, true);
  assert.equal(result.falseThenEchoSurvived, true);
  assert.equal(result.wrapperEvalNonFinalAnd, false);
  assert.equal(result.alarm, true);
  assert.equal(result.linear, false);
  assert.equal(result.caught, false);
  assert.match(result.feed, /Survived|echo survived|#90611/i);
  assert.equal(decideSeed("survived").verdict, "survived");
});

test("5 nonfinal: eval non-final without set -e present", () => {
  const result = decide(seedNonfinal());
  assert.equal(result.verdict, "nonfinal");
  assert.equal(result.searNonfinal, true);
  assert.equal(result.wrapperEvalNonFinalAnd, true);
  assert.equal(result.setEPresent, false);
  assert.equal(result.alarm, true);
  assert.equal(result.linear, false);
  assert.equal(result.caught, false);
  assert.match(result.feed, /Nonfinal|non-final &&/i);
  assert.equal(decideSeed("nonfinal").verdict, "nonfinal");
});

test("6 phantom-ok: tool exit 0 despite mid-fail, not inert", () => {
  const result = decide(seedPhantomOk());
  assert.equal(result.verdict, "phantom-ok");
  assert.equal(result.searPhantomOk, true);
  assert.equal(result.toolExitZeroDespiteMidFail, true);
  assert.equal(result.wrapperEvalNonFinalAnd, false);
  assert.equal(result.alarm, true);
  assert.equal(result.linear, true);
  assert.equal(result.caught, false);
  assert.match(result.feed, /Phantom-ok|exit 0/i);
  assert.equal(decideSeed("phantom-ok").verdict, "phantom-ok");
});

test("7 continued: lines after a failed command", () => {
  const result = decide(seedContinued());
  assert.equal(result.verdict, "continued");
  assert.equal(result.searContinued, true);
  assert.equal(result.continuedPastFail, true);
  assert.equal(result.alarm, true);
  assert.equal(result.linear, false);
  assert.equal(result.caught, false);
  assert.match(result.feed, /Continued|after a failed/i);
  assert.equal(decideSeed("continued").verdict, "continued");
});

test("8 wiped: cp-fail then rm -rf without the inert pair", () => {
  const result = decide(seedWiped());
  assert.equal(result.verdict, "wiped");
  assert.equal(result.searWiped, true);
  assert.equal(result.wipeAfterFailedCopy, true);
  assert.equal(result.setEPresent, false);
  assert.equal(result.wrapperEvalNonFinalAnd, false);
  assert.equal(result.alarm, true);
  assert.equal(result.linear, true);
  assert.equal(result.caught, false);
  assert.match(result.feed, /Wiped|rm -rf|#90611/i);
  assert.equal(decideSeed("wiped").verdict, "wiped");
});

test("9 chained: &&-chain workaround, not true errexit", () => {
  const result = decide(seedChained());
  assert.equal(result.verdict, "chained");
  assert.equal(result.searChained, true);
  assert.equal(result.chainedWorkaround, true);
  assert.equal(result.alarm, false);
  assert.equal(result.linear, false);
  assert.equal(result.caught, false);
  assert.match(result.feed, /Chained|workaround|not true errexit/i);
  assert.equal(decideSeed("chained").verdict, "chained");
});

test("10 freshbash: bash -ec workaround; caught false", () => {
  const result = decide(seedFreshbash());
  assert.equal(result.verdict, "freshbash");
  assert.equal(result.searFreshbash, true);
  assert.equal(result.freshBashEc, true);
  assert.equal(result.setEPresent, false);
  assert.equal(result.alarm, false);
  assert.equal(result.slack, false);
  assert.equal(result.linear, false);
  assert.equal(result.caught, false);
  assert.match(result.feed, /Freshbash|bash -ec|recovery/i);
  assert.equal(decideSeed("freshbash").verdict, "freshbash");
});

test("11 suppressed: POSIX &&/|| subshell survival without eval-nonfinal pair", () => {
  const result = decide(seedSuppressed());
  assert.equal(result.verdict, "suppressed");
  assert.equal(result.searSuppressed, true);
  assert.equal(result.setEPresent, true);
  assert.equal(result.subshellAlsoSurvived, true);
  assert.equal(result.wrapperEvalNonFinalAnd, false);
  assert.equal(result.alarm, true);
  assert.equal(result.linear, false);
  assert.equal(result.caught, false);
  assert.match(result.feed, /Suppressed|POSIX|&&\/\|\|/i);
  assert.equal(decideSeed("suppressed").verdict, "suppressed");
});

test("12 score() idle sear is caught and never alarms", () => {
  const result = score(emptySear());
  assertScoreShape(result);
  assert.equal(result.verdict, "caught");
  assert.equal(result.slack, false);
  assert.equal(result.alarm, false);
  assert.equal(result.caught, true);
  assert.equal(result.inert, false);
});

test("13 verdict vocabulary is exactly the ten words", () => {
  assert.deepEqual(VERDICTS, [
    "caught",
    "inert",
    "survived",
    "nonfinal",
    "phantom-ok",
    "continued",
    "wiped",
    "chained",
    "freshbash",
    "suppressed",
  ]);
  assert.deepEqual(SLACK_VERDICTS, [
    "inert",
    "survived",
    "nonfinal",
    "phantom-ok",
    "continued",
    "wiped",
    "suppressed",
  ]);
  assert.deepEqual(LINEAR_VERDICTS, ["wiped", "phantom-ok", "inert"]);
  assert.deepEqual(ALARM_VERDICTS, SLACK_VERDICTS);
  assert.equal(IDLE_WORD, "caught");
  assert.doesNotMatch(IDLE_WORD, /sear$|posted|bunged|silent|stowed/);
});

test("14 every seeded class classifies to itself", () => {
  const rows = [
    ["caught", seedReset],
    ["inert", seedInert],
    ["survived", seedSurvived],
    ["nonfinal", seedNonfinal],
    ["phantom-ok", seedPhantomOk],
    ["continued", seedContinued],
    ["wiped", seedWiped],
    ["chained", seedChained],
    ["freshbash", seedFreshbash],
    ["suppressed", seedSuppressed],
  ];
  for (const [word, seed] of rows) {
    assert.equal(decide(seed()).verdict, word, word);
    assert.equal(classify(seed().sear), word, word);
    assert.equal(score(seed().sear).verdict, word, word);
  }
});

test("15 admit does not lie: inert stays inert; survived stays survived", () => {
  const inert = decide({ ...seedInert(), action: "admit" });
  assert.equal(inert.verdict, "inert");
  assert.equal(inert.action, "admit");
  assert.equal(inert.caught, false);
  assert.doesNotMatch(inert.verdict, /caught/);
  const survived = decide({ ...seedSurvived(), action: "admit" });
  assert.equal(survived.verdict, "survived");
  const wiped = decide({ ...seedWiped(), action: "admit" });
  assert.equal(wiped.verdict, "wiped");
});

test("16 bail / caught / reset returns idle caught", () => {
  const bailed = decide({ ...seedInert(), action: "bail" });
  assert.equal(bailed.verdict, "caught");
  assert.equal(isIdle(bailed.sear), true);
  assertIdleNeverSear(bailed);
  assert.equal(decide({ action: "reset" }).verdict, "caught");
  assert.equal(decide({ action: "caught" }).verdict, "caught");
  assert.equal(decide(seedReset()).verdict, "caught");
  assert.equal(decide(seedCaught()).verdict, "caught");
});

test("17 restore / inert produces the #90611 inert bench", () => {
  const result = decide({ action: "restore", sear: emptySear() });
  assert.equal(result.verdict, "inert");
  assert.equal(result.action, "restore");
  assert.equal(result.issue, FEATURED_ISSUE);
  assert.equal(result.caught, false);
  assert.equal(decide({ action: "inert" }).verdict, "inert");
});

test("18 flagsOf matches slack / github; linear follows wiped/phantom-ok/inert", () => {
  assert.deepEqual(flagsOf("inert"), { slack: true, linear: true, github: true, alarm: true });
  assert.deepEqual(flagsOf("wiped"), { slack: true, linear: true, github: true, alarm: true });
  assert.deepEqual(flagsOf("phantom-ok"), { slack: true, linear: true, github: true, alarm: true });
  assert.deepEqual(flagsOf("survived"), { slack: true, linear: false, github: true, alarm: true });
  assert.deepEqual(flagsOf("nonfinal"), { slack: true, linear: false, github: true, alarm: true });
  assert.deepEqual(flagsOf("continued"), { slack: true, linear: false, github: true, alarm: true });
  assert.deepEqual(flagsOf("suppressed"), { slack: true, linear: false, github: true, alarm: true });
  assert.deepEqual(flagsOf("chained"), { slack: false, linear: false, github: true, alarm: false });
  assert.deepEqual(flagsOf("freshbash"), { slack: false, linear: false, github: true, alarm: false });
  assert.deepEqual(flagsOf("caught"), { slack: false, linear: false, github: true, alarm: false });
});

test("19 helpers, reasons, analyze, priority", () => {
  assert.equal(inertOf(seedInert().sear), true);
  assert.equal(caughtOf(emptySear()), true);
  assert.equal(caughtOf(seedInert().sear), false);
  assert.equal(caughtOf(seedControl().sear), true);
  assert.equal(caughtOf(seedFreshbash().sear), false);
  const reasons = reasonsOf(seedInert().sear, "inert");
  assert.ok(reasons.some((row) => /#90611/.test(row)));
  const facts = analyze(seedInert().sear);
  assert.equal(facts.inertShape, true);
  assert.equal(classify(seedInert().sear), "inert");
  assert.equal(classify(seed90611().sear), "inert");
  assert.equal(classify(seedSurvived().sear), "survived");
  assert.equal(classify(seedNonfinal().sear), "nonfinal");
});

test("20 forbidden idle list includes sear, empty, leftover names", () => {
  const words = forbiddenIdleWords();
  assert.ok(words.includes("sear"));
  assert.ok(words.includes("empty"));
  assert.ok(words.includes("silent"));
  assert.ok(words.includes("mute"));
  assert.ok(words.includes("posted"));
  assert.ok(words.includes("trap"));
  assert.ok(words.includes("fuse"));
  assert.ok(words.includes("stowed"));
  assert.ok(words.includes("grille"));
  assert.ok(words.includes("cubby"));
  assert.ok(!words.includes("caught"));
});

test("21 demo sinks: Slack on alarm; Linear on inert; GitHub always", async () => {
  const inert = decide(seedInert());
  const slack = slackSearAlarm(inert, {});
  assert.equal(slack.mode, "demo");
  assert.match(slack.summary, /Would post to Slack/);
  assert.ok(Array.isArray(slack.body.blocks));
  const github = githubSearLedger(inert, {});
  assert.equal(github.mode, "demo");
  assert.match(github.summary, /Would open a GitHub sear-ledger/);
  const linear = linearSearTicket(inert, {});
  assert.equal(linear.mode, "demo");
  assert.match(linear.summary, /Would open a Linear ticket/);
  const honest = decide(seedControl());
  assert.match(linearSearTicket(honest, {}).summary, /Would skip Linear/);
  const idle = decide(emptyAction("idle"));
  assert.match(slackSearAlarm(idle, {}).summary, /Would skip Slack/);
  const fired = await fire(inert, {});
  assert.equal(fired.events.length, 3);
  assert.ok(fired.events.every((row) => row.ok === true));
});

test("22 Slack live plan uses SLACK_WEBHOOK alias and GITHUB_TOKEN alias", () => {
  const inert = decide(seedInert());
  const slack = slackSearAlarm(inert, { SLACK_WEBHOOK: "https://hooks.example/y" });
  assert.equal(slack.mode, "live");
  const github = githubSearLedger(inert, { GITHUB_TOKEN: "tok" });
  assert.equal(github.mode, "live");
  const linear = linearSearTicket(inert, { LINEAR_API_KEY: "lin" });
  assert.equal(linear.mode, "live");
});

test("23 handle alarm classes deny; caught / control / chained / freshbash allow", async () => {
  const inert = await handle(seedInert(), {});
  assert.equal(inert.permissionDecision, "deny");
  assert.match(inert.hookSpecificOutput.decision.message, /inert/);
  assert.equal((await handle(seedSurvived(), {})).permissionDecision, "deny");
  assert.equal((await handle(seedNonfinal(), {})).permissionDecision, "deny");
  assert.equal((await handle(seedPhantomOk(), {})).permissionDecision, "deny");
  assert.equal((await handle(seedContinued(), {})).permissionDecision, "deny");
  assert.equal((await handle(seedWiped(), {})).permissionDecision, "deny");
  assert.equal((await handle(seedSuppressed(), {})).permissionDecision, "deny");
  const idle = await handle({ action: "bail" }, {});
  assert.equal(idle.permissionDecision, "allow");
  assert.match(idle.hookSpecificOutput.decision.message, /caught/);
  assert.equal((await handle(seedControl(), {})).permissionDecision, "allow");
  assert.equal((await handle(seedChained(), {})).permissionDecision, "allow");
  assert.equal((await handle(seedFreshbash(), {})).permissionDecision, "allow");
  assert.equal((await handle(seedReset(), {})).permissionDecision, "allow");
});

test("24 listen GET health and POST empty body is caught", async () => {
  const server = listen(19911);
  await new Promise((resolve) => server.once("listening", resolve));
  const health = await fetch("http://127.0.0.1:19911/health");
  const info = await health.json();
  assert.equal(info.product, "sear");
  assert.match(info.verbs, /inert/);
  const res = await fetch("http://127.0.0.1:19911/", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: "{}",
  });
  const body = await res.json();
  assert.equal(body.verdict, "caught");
  assert.equal(body.idleWord, "caught");
  const scored = await fetch("http://127.0.0.1:19911/", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(seedInert()),
  });
  const scoredBody = await scored.json();
  assert.equal(scoredBody.verdict, "inert");
  await new Promise((resolve) => server.close(resolve));
});

test("25 listen rejects non-JSON verbs besides health", async () => {
  const server = listen(19912);
  await new Promise((resolve) => server.once("listening", resolve));
  const put = await fetch("http://127.0.0.1:19912/", { method: "PUT" });
  assert.equal(put.status, 405);
  await new Promise((resolve) => server.close(resolve));
});

test("26 parseSessionTrace reads a #90611 inert report", () => {
  const sear = parseSessionTrace(
    "Bash tool: set -e is structurally inert -- command runs as eval in a non-final && list member. #90611 inert.",
  );
  assert.equal(classify(sear), "inert");
});

test("27 parseSessionTrace reads survived, wiped, nonfinal", () => {
  assert.equal(
    classify(parseSessionTrace("echo survived after false; false; echo survived")),
    "survived",
  );
  assert.equal(
    classify(parseSessionTrace("wiped copy-then-cleanup cp failed then rm -rf")),
    "wiped",
  );
  assert.equal(
    classify(parseSessionTrace("nonfinal eval is not the final && member")),
    "nonfinal",
  );
});

test("28 score() accepts the documented probe shape", () => {
  const result = score({
    session: "demo",
    issue: 90611,
    source: "hook",
    setEPresent: true,
    wrapperEvalNonFinalAnd: true,
    falseThenEchoSurvived: true,
    toolExitZeroDespiteMidFail: true,
    continuedPastFail: true,
    wipeAfterFailedCopy: true,
    chainedWorkaround: false,
    freshBashEc: false,
    subshellAlsoSurvived: true,
    scored: false,
  });
  assert.equal(result.verdict, "inert");
  assert.equal(result.caught, false);
  const hold = score({
    setEPresent: true,
    wrapperEvalNonFinalAnd: false,
    freshBashEc: true,
  });
  assert.equal(hold.verdict, "caught");
  assert.equal(hold.caught, true);
});

test("29 nested sear / probe fields clone", () => {
  const sear = cloneSear({ probe: seedInert().sear });
  assert.equal(classify(sear), "inert");
});

test("30 fire live slack posts when fetch ok", async () => {
  const inert = decide(seedInert());
  const events = await fire(
    inert,
    { SEAR_SLACK_WEBHOOK: "https://hooks.example/x" },
    async () => ({
      ok: true,
      status: 200,
      json: async () => ({}),
    }),
  );
  const slack = events.events.find((row) => row.adapter === "slack");
  assert.equal(slack.ok, true);
  assert.match(slack.summary, /Posted inert/);
});

test("31 gunsmith HTML sanity: idle word caught, seeded inert, not cubby/grille/bung", () => {
  const html = readFileSync(fileURLToPath(new URL("../index.html", import.meta.url)), "utf8");
  assert.match(html, /caught/);
  assert.match(html, /Score/);
  assert.match(html, /inert/);
  assert.match(html, /90611/);
  assert.match(html, /seedOf\("inert"\)|sear = seedOf\("inert"\)/);
  assert.match(html, /const IDLE_WORD = "caught"/);
  assert.doesNotMatch(html, /const IDLE_WORD = "sear"/);
  assert.doesNotMatch(html, /const IDLE_WORD = "posted"/);
  assert.doesNotMatch(html, /const IDLE_WORD = "empty"/);
  assert.doesNotMatch(html, /const IDLE_WORD = "bunged"/);
  assert.doesNotMatch(html, /const IDLE_WORD = "stowed"/);
  assert.match(
    html,
    /gunsmith-shop|sear-rail|walnut-stock|blued-action|sear-notch|hammer-cock|chain-lamp|eval-badge|survived-stamp|wipe-card/i,
  );
  assert.match(html, /03:50 Sydney · sear/);
  assert.match(html, /fallen sear is not a hold/i);
  assert.doesNotMatch(html, /class="mailroom-hall"|class="cubby-wall"|class="oak-bay"|class="brass-nameplate"|class="safety-envelope"|class="ancestor-cubby"/);
  assert.doesNotMatch(html, /class="teller-hall"|class="marble-counter"|class="bronze-lattice"|class="grille-window"|class="night-slot"|class="bypass-lamp"/);
  assert.doesNotMatch(html, /class="bung-station"|class="barrel-head"|class="bung-hole"|class="brass-spile"|class="wooden-bung"|class="bung-mallet"/);
  assert.doesNotMatch(html, /class="wet-pier"|class="bollard-plate"|class="quay-lamp"|class="hawser-eye"/);
  assert.doesNotMatch(html, /class="sail-loft"|class="rigger-bench"|class="hemp-clew"/);
  assert.doesNotMatch(html, /class="type-case"|class="composing-stick"|class="galley-tray"|class="proof-sheet"/);
  assert.doesNotMatch(html, /class="darkroom"|class="enlarger"|class="film-reel"/);
  assert.doesNotMatch(html, /class="gatehouse"|class="turnstile"|class="portcullis"/);
  assert.doesNotMatch(html, /class="fob-rail"|class="brass-hook"|class="room-tag"/);
  assert.doesNotMatch(html, /Calistoga|Commissioner|Inconsolata/);
  assert.doesNotMatch(html, /Playfair Display|Source Serif 4|JetBrains Mono/);
  assert.doesNotMatch(html, /Cinzel|Lora|Overpass Mono/);
  assert.doesNotMatch(html, /Yeseva One|\bCabin\b|Anonymous Pro/);
  assert.doesNotMatch(html, /Alfa Slab One|Bitter|Space Mono/);
  assert.doesNotMatch(html, /Big Shoulders Stencil|Sora|Share Tech Mono/);
  assert.doesNotMatch(html, /Cormorant Garamond|Crimson Pro/);
  assert.doesNotMatch(html, /Young Serif|Outfit|Red Hat Mono/);
  assert.doesNotMatch(html, /millimeter slider|millimetre slider/i);
  assert.match(html, /<title>Sear/);
  assert.match(html, /Newsreader|Barlow Condensed|IBM Plex Mono/);
  assert.match(html, /Reset · caught|reset to caught/i);
  assert.match(html, /Restore · #90611|restore to inert/i);
  assert.match(html, /Admit caught/);
});

test("32 HTML why-not names Spile, Grille, Scant, Sounder, Leat, Clew, Cubby, Bollard", () => {
  const html = readFileSync(fileURLToPath(new URL("../index.html", import.meta.url)), "utf8");
  assert.match(html, /NOT Spile/);
  assert.match(html, /NOT Grille/);
  assert.match(html, /NOT Scant/);
  assert.match(html, /NOT Sounder/);
  assert.match(html, /NOT Leat/);
  assert.match(html, /NOT Clew/);
  assert.match(html, /NOT Cubby/);
  assert.match(html, /NOT Bollard/);
  assert.match(html, /leftover/);
  assert.match(html, /millimeter-slider|millimetre-slider|millimeter slider|millimetre slider/);
});

test("33 README names contrasts and caught idle", () => {
  const readme = readFileSync(fileURLToPath(new URL("../README.md", import.meta.url)), "utf8");
  assert.match(readme, /NOT \*\*Spile\*\*|NOT Spile/);
  assert.match(readme, /NOT \*\*Grille\*\*|NOT Grille/);
  assert.match(readme, /NOT \*\*Scant\*\*|NOT Scant/);
  assert.match(readme, /NOT \*\*Cubby\*\*|NOT Cubby/);
  assert.match(readme, /NOT \*\*Bollard\*\*|NOT Bollard/);
  assert.match(readme, /\*\*caught\*\*/);
  assert.match(readme, /#90611/);
  assert.match(readme, /\/sear\//);
  assert.doesNotMatch(readme, /idle word is sear/i);
  assert.doesNotMatch(readme, /idle word is posted/i);
  assert.doesNotMatch(readme, /idle word is bunged/i);
  assert.doesNotMatch(readme, /idle word is stowed/i);
});

test("34 seeded 90611 numbers produce inert / caught=false", () => {
  const inert = score({
    setEPresent: true,
    wrapperEvalNonFinalAnd: true,
    falseThenEchoSurvived: true,
    toolExitZeroDespiteMidFail: true,
    continuedPastFail: true,
    wipeAfterFailedCopy: true,
    subshellAlsoSurvived: true,
  });
  assert.equal(inert.verdict, "inert");
  assert.equal(inert.caught, false);
  assert.equal(inert.setEPresent, true);
  assert.equal(inert.wrapperEvalNonFinalAnd, true);
});

test("35 control fresh-bash / final-member produces caught=true; inert never caught", () => {
  const hold = score({
    setEPresent: true,
    wrapperEvalNonFinalAnd: false,
    freshBashEc: true,
  });
  assert.equal(hold.verdict, "caught");
  assert.equal(hold.caught, true);
  const dead = score({
    setEPresent: true,
    wrapperEvalNonFinalAnd: true,
    falseThenEchoSurvived: true,
    toolExitZeroDespiteMidFail: true,
    continuedPastFail: true,
    wipeAfterFailedCopy: true,
    subshellAlsoSurvived: true,
  });
  assert.equal(dead.caught, false);
  assert.equal(dead.verdict, "inert");
});

test("36 Slack skip on caught / control / chained / freshbash", () => {
  for (const seed of [seedReset, seedControl, seedChained, seedFreshbash, seedCaught]) {
    const result = decide(seed());
    assert.equal(result.slack, false, result.verdict);
    assert.match(slackSearAlarm(result, {}).summary, /Would skip Slack/);
  }
});

test("37 inert pentad wins over wiped and survived", () => {
  const result = score({
    setEPresent: true,
    wrapperEvalNonFinalAnd: true,
    falseThenEchoSurvived: true,
    toolExitZeroDespiteMidFail: true,
    continuedPastFail: true,
    wipeAfterFailedCopy: true,
    subshellAlsoSurvived: true,
  });
  assert.equal(result.verdict, "inert");
  assert.equal(result.caught, false);
});

test("38 survived wins over phantom-ok when only echo-survived is set", () => {
  const result = decide(seedSurvived());
  assert.equal(result.verdict, "survived");
  assert.equal(result.falseThenEchoSurvived, true);
  assert.notEqual(result.verdict, "inert");
  assert.notEqual(result.verdict, "phantom-ok");
});

test("39 admit still does not lie after inert / wiped", () => {
  const admitted = decide({ ...seedInert(), action: "admit" });
  assert.equal(admitted.verdict, "inert");
  assert.equal(admitted.caught, false);
  const wiped = decide({ ...seedWiped(), action: "admit" });
  assert.equal(wiped.verdict, "wiped");
  assert.equal(wiped.caught, false);
});

test("40a HTML parseTrace prefers JSON so wrapperEvalNonFinalAnd is inert not nonfinal", () => {
  const html = readFileSync(fileURLToPath(new URL("../index.html", import.meta.url)), "utf8");
  assert.match(html, /raw\.startsWith\("\{"\)|startsWith\("\{"\)/);
  const probe = score({
    setEPresent: true,
    wrapperEvalNonFinalAnd: true,
    falseThenEchoSurvived: true,
  });
  assert.equal(probe.verdict, "inert");
  assert.equal(probe.caught, false);
});

test("40 README and gunsmith cite #90611 and nearby issues", () => {
  const readme = readFileSync(fileURLToPath(new URL("../README.md", import.meta.url)), "utf8");
  assert.match(readme, /90611/);
  assert.match(readme, /90118/);
  assert.match(readme, /62297/);
  assert.match(readme, /34866/);
  assert.match(readme, /41534/);
  assert.doesNotMatch(readme, /idle word is sear |idle word is trap|idle word is posted/i);
  const html = readFileSync(fileURLToPath(new URL("../index.html", import.meta.url)), "utf8");
  assert.match(html, /set -e|eval|echo survived/);
  assert.match(html, /90118/);
  assert.match(html, /62297/);
  assert.match(html, /34866/);
  assert.match(html, new RegExp(String(CHANNEL_LIE_ISSUE)));
  assert.match(html, new RegExp(String(EXIT_144_ISSUE)));
  assert.match(html, new RegExp(String(CODEX_STILL_RUNNING_ISSUE)));
  assert.match(html, new RegExp(String(CODEX_PWSH_QUOTE_ISSUE)));
  assert.match(html, /eval '<user command>'|pwd -P/);
  assert.ok(DEMO_WRAPPER.includes("eval"));
  assert.match(DEMO_REPRO, /echo survived/);
});
