import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  fire,
  githubDatumLedger,
  linearDatumTicket,
  slackDatumAlarm,
} from "./adapters.mjs";
import {
  ALARM_VERDICTS,
  DEMO_CONTROL_IN_DIFF,
  DEMO_CONTROL_MEASURED,
  DEMO_CONTROL_PR_BASE,
  DEMO_CONTROL_TOTAL,
  DEMO_FINDINGS_IN_DIFF,
  DEMO_FINDINGS_OFF_DIFF,
  DEMO_FINDINGS_TOTAL,
  DEMO_MEASURED_BASE,
  DEMO_OFF_DIFF_FILES,
  DEMO_PR_BASE,
  DEMO_PR_URL,
  DEMO_SKILL,
  DEMO_UNRELATED_LINE,
  FEATURED_ISSUE,
  IDLE_WORD,
  LINEAR_VERDICTS,
  PRIOR_COLLIDE_69232,
  PRIOR_EFFORT_78257,
  PRIOR_SHADOW_82397,
  SLACK_VERDICTS,
  VERDICTS,
  analyze,
  classify,
  cloneDatum,
  decide,
  decideSeed,
  emptyAction,
  emptyDatum,
  feedOf,
  flagsOf,
  forbiddenIdleWords,
  isIdle,
  isMasterRef,
  isSkillReview,
  levelOf,
  parseReviewProbe,
  parseSessionTrace,
  reasonsOf,
  score,
  seed90620,
  seedControl,
  seedDevelopBase,
  seedFindingsBleed,
  seedLevel,
  seedMasterLie,
  seedMergeMissed,
  seedReset,
  seedScopeBleed,
  seedSkillReview,
  seedUnrelated,
  seedWrongBase,
  verdictOf,
  wrongBaseOf,
} from "./datum.mjs";
import { handle, listen } from "./index.mjs";

const PRIOR_IDLES =
  /empty|silent|mute|idle|dead|sealed|fronted|locked|yanked|caught|stowed|posted|bunged|belayed|rove|keyed|housed|beamed|snug|hung|appointed|cinched|gauged|stamped|overrun|pratique|wound|bound|stilled|stabled|drained|flat|fit|spoilt|laid|unlinked|tight|banked|roosted|stocked|seated|heard|clear|paired|kernel|latched|upheld|sterling|home|valid|dry|quiet|seised|rung|moored|verbatim|calqued/;

function assertIdleNeverDatum(result) {
  assert.equal(result.idleWord, "level");
  assert.equal(IDLE_WORD, "level");
  assert.doesNotMatch(result.idleWord, /datum/i);
  assert.doesNotMatch(IDLE_WORD, /^datum$/i);
  assert.doesNotMatch(result.idleWord, PRIOR_IDLES);
}

function assertScoreShape(result) {
  assert.equal(typeof result.verdict, "string");
  assert.ok(Array.isArray(result.reasons));
  assert.equal(typeof result.level, "boolean");
  assert.equal(typeof result.feed, "string");
}

test("1 seed 90620 wrong-base is wrong-base, slack, linear, idleWord level, never level", () => {
  const seed = seedWrongBase();
  const result = decide(seed);
  assert.equal(result.verdict, "wrong-base");
  assert.equal(result.state, "wrong-base");
  assert.equal(result.decision, "wrong-base");
  assert.equal(classify(seed.datum), "wrong-base");
  assert.equal(verdictOf(seed.datum), "wrong-base");
  assert.notEqual(result.verdict, "level");
  assert.equal(result.alarm, true);
  assert.equal(result.slack, true);
  assert.equal(result.linear, true);
  assert.equal(result.github, true);
  assert.equal(result.datumWrongBase, true);
  assert.equal(result.wrongBase, true);
  assert.equal(result.level, false);
  assertIdleNeverDatum(result);
  assert.equal(result.session, "90620-wrong-base");
  assert.equal(result.issue, FEATURED_ISSUE);
  assert.equal(result.prUrl, DEMO_PR_URL);
  assert.equal(result.prBase, DEMO_PR_BASE);
  assert.equal(result.measuredBase, DEMO_MEASURED_BASE);
  assert.equal(result.findingsTotal, DEMO_FINDINGS_TOTAL);
  assert.equal(result.findingsInDiff, DEMO_FINDINGS_IN_DIFF);
  assert.equal(result.findingsOffDiff, DEMO_FINDINGS_OFF_DIFF);
  assert.equal(result.skill, DEMO_SKILL);
  assert.match(result.prUrl, /email-background-worker\/pull\/254/);
  assert.match(result.feed, /Wrong-base|primary #90620/i);
  assert.equal(decideSeed("wrong-base").verdict, "wrong-base");
  assert.equal(decideSeed("90620-wrong-base").verdict, "wrong-base");
  assert.equal(decideSeed(90620).verdict, "wrong-base");
});

test("2 idle/empty/{} is level, never the product name, never empty, never error", () => {
  const result = decide(emptyAction("idle"));
  assert.equal(result.state, "level");
  assert.equal(result.verdict, "level");
  assert.equal(result.alarm, false);
  assert.equal(result.slack, false);
  assert.equal(result.level, true);
  assert.equal(classify({}), "level");
  assert.equal(classify(emptyDatum()), "level");
  assert.equal(isIdle(emptyDatum()), true);
  assert.equal(score(emptyDatum()).level, true);
  assertIdleNeverDatum(result);
  const bailed = decide({ action: "bail" });
  assert.equal(bailed.state, "level");
  assert.equal(bailed.idleWord, "level");
  const empty = decide({});
  assert.equal(empty.verdict, "level");
  assert.match(empty.feed, /Level/);
});

test("3 honest control with in-diff findings is level with level true", () => {
  const result = decide(seedControl());
  assert.equal(result.verdict, "level");
  assert.equal(result.alarm, false);
  assert.equal(result.prBase, DEMO_CONTROL_PR_BASE);
  assert.equal(result.measuredBase, DEMO_CONTROL_MEASURED);
  assert.equal(result.findingsTotal, DEMO_CONTROL_TOTAL);
  assert.equal(result.findingsInDiff, DEMO_CONTROL_IN_DIFF);
  assert.equal(result.findingsOffDiff, 0);
  assert.equal(result.level, true);
  assert.equal(result.honestPlate, true);
  assert.match(result.feed, /Level|true merge-base/i);
  assert.equal(decideSeed("control").verdict, "level");
  assert.equal(decideSeed("healthy").verdict, "level");
  assert.equal(decide(seedControl()).level, true);
});

test("4 master-lie: measured master, PR base develop, no off-diff triad", () => {
  const result = decide(seedMasterLie());
  assert.equal(result.verdict, "master-lie");
  assert.equal(result.datumMasterLie, true);
  assert.equal(result.masterMeasured, true);
  assert.equal(result.developPr, true);
  assert.equal(result.hasOffDiff, false);
  assert.equal(result.alarm, true);
  assert.equal(result.linear, true);
  assert.equal(result.level, false);
  assert.match(result.feed, /Master-lie|measured against master/i);
  assert.equal(decideSeed("master-lie").verdict, "master-lie");
});

test("5 scope-bleed: named files absent from gh pr diff, bases match, not majority", () => {
  const result = decide(seedScopeBleed());
  assert.equal(result.verdict, "scope-bleed");
  assert.equal(result.datumScopeBleed, true);
  assert.equal(result.hasOffDiff, true);
  assert.equal(result.majorityOff, false);
  assert.equal(result.basesDiffer, false);
  assert.equal(result.alarm, true);
  assert.equal(result.linear, false);
  assert.equal(result.level, false);
  assert.match(result.feed, /Scope-bleed|absent from gh pr diff/i);
});

test("6 findings-bleed: majority off-diff (5 of 7), bases match", () => {
  const result = decide(seedFindingsBleed());
  assert.equal(result.verdict, "findings-bleed");
  assert.equal(result.datumFindingsBleed, true);
  assert.equal(result.majorityOff, true);
  assert.equal(result.findingsOffDiff, 5);
  assert.equal(result.findingsInDiff, 2);
  assert.equal(result.alarm, true);
  assert.equal(result.linear, true);
  assert.equal(result.level, false);
  assert.match(result.feed, /Findings-bleed|majority/i);
});

test("7 unrelated: findings from already-merged history, none in this PR", () => {
  const result = decide(seedUnrelated());
  assert.equal(result.verdict, "unrelated");
  assert.equal(result.datumUnrelated, true);
  assert.equal(result.findingsInDiff, 0);
  assert.equal(result.findingsOffDiff, 3);
  assert.equal(result.alarm, true);
  assert.equal(result.linear, false);
  assert.equal(result.level, false);
  assert.match(result.feed, /Unrelated|already-merged/i);
});

test("8 merge-missed: baseRefName available but unused", () => {
  const result = decide(seedMergeMissed());
  assert.equal(result.verdict, "merge-missed");
  assert.equal(result.datumMergeMissed, true);
  assert.equal(result.mergeUnused, true);
  assert.equal(result.prBase, "main");
  assert.equal(result.measuredBase, "");
  assert.equal(result.alarm, true);
  assert.equal(result.linear, false);
  assert.equal(result.level, false);
  assert.match(result.feed, /Merge-missed|baseRefName/i);
});

test("9 skill-review: invoked via code-review, bases match, no findings", () => {
  const result = decide(seedSkillReview());
  assert.equal(result.verdict, "skill-review");
  assert.equal(result.datumSkillReview, true);
  assert.equal(result.skill, DEMO_SKILL);
  assert.equal(result.basesDiffer, false);
  assert.equal(result.alarm, false);
  assert.equal(result.linear, false);
  assert.equal(result.level, false);
  assert.match(result.feed, /Skill-review|code-review/i);
  assert.equal(decideSeed("skill-review").verdict, "skill-review");
});

test("10 develop-base: PR actual base is develop, measured correctly, no findings", () => {
  const result = decide(seedDevelopBase());
  assert.equal(result.verdict, "develop-base");
  assert.equal(result.datumDevelopBase, true);
  assert.equal(result.developPr, true);
  assert.equal(result.prBase, DEMO_PR_BASE);
  assert.equal(result.measuredBase, DEMO_PR_BASE);
  assert.equal(result.alarm, false);
  assert.equal(result.linear, false);
  assert.equal(result.level, false);
  assert.match(result.feed, /Develop-base|actual base is develop/i);
});

test("11 score() idle datum is level and never alarms", () => {
  const result = score(emptyDatum());
  assertScoreShape(result);
  assert.equal(result.verdict, "level");
  assert.equal(result.slack, false);
  assert.equal(result.alarm, false);
  assert.equal(result.level, true);
  assert.equal(result.wrongBase, false);
});

test("12 verdict vocabulary is exactly the nine words", () => {
  assert.deepEqual(VERDICTS, [
    "level",
    "wrong-base",
    "scope-bleed",
    "unrelated",
    "master-lie",
    "develop-base",
    "findings-bleed",
    "merge-missed",
    "skill-review",
  ]);
  assert.deepEqual(SLACK_VERDICTS, [
    "wrong-base",
    "master-lie",
    "scope-bleed",
    "findings-bleed",
    "unrelated",
    "merge-missed",
  ]);
  assert.deepEqual(LINEAR_VERDICTS, ["wrong-base", "master-lie", "findings-bleed"]);
  assert.deepEqual(ALARM_VERDICTS, SLACK_VERDICTS);
  assert.equal(IDLE_WORD, "level");
  assert.doesNotMatch(IDLE_WORD, /datum$|fronted|locked|yanked|caught|stowed|posted|verbatim|calqued/);
});

test("13 every seeded class classifies to itself", () => {
  const rows = [
    ["level", seedReset],
    ["wrong-base", seedWrongBase],
    ["master-lie", seedMasterLie],
    ["scope-bleed", seedScopeBleed],
    ["findings-bleed", seedFindingsBleed],
    ["unrelated", seedUnrelated],
    ["merge-missed", seedMergeMissed],
    ["skill-review", seedSkillReview],
    ["develop-base", seedDevelopBase],
  ];
  for (const [word, seed] of rows) {
    assert.equal(decide(seed()).verdict, word, word);
    assert.equal(classify(seed().datum), word, word);
    assert.equal(score(seed().datum).verdict, word, word);
  }
});

test("14 admit does not lie: wrong-base stays wrong-base; master-lie stays master-lie", () => {
  const wrong = decide({ ...seedWrongBase(), action: "admit" });
  assert.equal(wrong.verdict, "wrong-base");
  assert.equal(wrong.action, "admit");
  assert.equal(wrong.level, false);
  assert.doesNotMatch(wrong.verdict, /level/);
  const lie = decide({ ...seedMasterLie(), action: "admit" });
  assert.equal(lie.verdict, "master-lie");
  const bleed = decide({ ...seedScopeBleed(), action: "admit" });
  assert.equal(bleed.verdict, "scope-bleed");
});

test("15 bail / level / reset returns idle level", () => {
  const bailed = decide({ ...seedWrongBase(), action: "bail" });
  assert.equal(bailed.verdict, "level");
  assert.equal(isIdle(bailed.datum), true);
  assertIdleNeverDatum(bailed);
  assert.equal(decide({ action: "reset" }).verdict, "level");
  assert.equal(decide({ action: "level" }).verdict, "level");
  assert.equal(decide(seedReset()).verdict, "level");
  assert.equal(decide(seedLevel()).verdict, "level");
});

test("16 restore / wrong-base produces the #90620 wrong-base plate", () => {
  const result = decide({ action: "restore", datum: emptyDatum() });
  assert.equal(result.verdict, "wrong-base");
  assert.equal(result.action, "restore");
  assert.equal(result.issue, FEATURED_ISSUE);
  assert.equal(result.level, false);
  assert.equal(decide({ action: "wrong-base" }).verdict, "wrong-base");
});

test("17 flagsOf matches slack / github; linear follows wrong-base/master-lie/findings-bleed", () => {
  assert.deepEqual(flagsOf("wrong-base"), { slack: true, linear: true, github: true, alarm: true });
  assert.deepEqual(flagsOf("master-lie"), { slack: true, linear: true, github: true, alarm: true });
  assert.deepEqual(flagsOf("findings-bleed"), { slack: true, linear: true, github: true, alarm: true });
  assert.deepEqual(flagsOf("scope-bleed"), { slack: true, linear: false, github: true, alarm: true });
  assert.deepEqual(flagsOf("unrelated"), { slack: true, linear: false, github: true, alarm: true });
  assert.deepEqual(flagsOf("merge-missed"), { slack: true, linear: false, github: true, alarm: true });
  assert.deepEqual(flagsOf("skill-review"), { slack: false, linear: false, github: true, alarm: false });
  assert.deepEqual(flagsOf("develop-base"), { slack: false, linear: false, github: true, alarm: false });
  assert.deepEqual(flagsOf("level"), { slack: false, linear: false, github: true, alarm: false });
});

test("18 helpers, reasons, analyze, ref parse", () => {
  assert.equal(wrongBaseOf(seedWrongBase().datum), true);
  assert.equal(levelOf(emptyDatum()), true);
  assert.equal(levelOf(seedWrongBase().datum), false);
  assert.equal(levelOf(seedControl().datum), true);
  assert.equal(levelOf(seedSkillReview().datum), false);
  const reasons = reasonsOf(seedWrongBase().datum, "wrong-base");
  assert.ok(reasons.some((row) => /#90620/.test(row)));
  const facts = analyze(seedWrongBase().datum);
  assert.equal(facts.wrongBaseShape, true);
  assert.equal(classify(seedWrongBase().datum), "wrong-base");
  assert.equal(classify(seed90620().datum), "wrong-base");
  assert.ok(isMasterRef(DEMO_MEASURED_BASE));
  assert.ok(isMasterRef("origin/master"));
  assert.ok(isSkillReview(DEMO_SKILL));
  assert.ok(isSkillReview("/code-review"));
  assert.ok(DEMO_OFF_DIFF_FILES.includes("SendEmailCommandHandler.cs"));
  assert.match(DEMO_UNRELATED_LINE, /SendEmailCommandHandler\.cs:83/);
});

test("19 forbidden idle list includes datum, empty, leftover names, not level", () => {
  const words = forbiddenIdleWords();
  assert.ok(words.includes("datum"));
  assert.ok(words.includes("empty"));
  assert.ok(words.includes("silent"));
  assert.ok(words.includes("mute"));
  assert.ok(words.includes("fronted"));
  assert.ok(words.includes("locked"));
  assert.ok(words.includes("yanked"));
  assert.ok(words.includes("caught"));
  assert.ok(words.includes("stowed"));
  assert.ok(words.includes("verbatim"));
  assert.ok(words.includes("calqued"));
  assert.ok(words.includes("bench"));
  assert.ok(words.includes("parity"));
  assert.ok(words.includes("visa"));
  assert.ok(!words.includes("level"));
});

test("20 demo sinks: Slack on alarm; Linear on wrong-base; GitHub always; never fake live 200", async () => {
  const wrong = decide(seedWrongBase());
  const slack = slackDatumAlarm(wrong, {});
  assert.equal(slack.mode, "demo");
  assert.match(slack.summary, /Would post to Slack/);
  assert.ok(Array.isArray(slack.body.blocks));
  const github = githubDatumLedger(wrong, {});
  assert.equal(github.mode, "demo");
  assert.match(github.summary, /Would open a GitHub datum-ledger/);
  const linear = linearDatumTicket(wrong, {});
  assert.equal(linear.mode, "demo");
  assert.match(linear.summary, /Would open a Linear ticket/);
  const honest = decide(seedControl());
  assert.match(linearDatumTicket(honest, {}).summary, /Would skip Linear/);
  const idle = decide(emptyAction("idle"));
  assert.match(slackDatumAlarm(idle, {}).summary, /Would skip Slack/);
  const fired = await fire(wrong, {});
  assert.equal(fired.events.length, 3);
  assert.ok(fired.events.every((row) => row.ok === true));
  assert.ok(fired.events.every((row) => row.mode === "demo"));
  assert.ok(fired.events.every((row) => !/HTTP 200|live 200/.test(row.summary || "")));
});

test("21 Slack live plan uses SLACK_WEBHOOK alias and GITHUB_TOKEN alias", () => {
  const wrong = decide(seedWrongBase());
  const slack = slackDatumAlarm(wrong, { SLACK_WEBHOOK: "https://hooks.example/y" });
  assert.equal(slack.mode, "live");
  const github = githubDatumLedger(wrong, { GITHUB_TOKEN: "tok" });
  assert.equal(github.mode, "live");
  const linear = linearDatumTicket(wrong, { LINEAR_API_KEY: "lin" });
  assert.equal(linear.mode, "live");
});

test("22 handle alarm classes deny; level / control / skill-review / develop-base allow", async () => {
  const wrong = await handle(seedWrongBase(), {});
  assert.equal(wrong.permissionDecision, "deny");
  assert.match(wrong.hookSpecificOutput.decision.message, /wrong-base/);
  assert.equal((await handle(seedMasterLie(), {})).permissionDecision, "deny");
  assert.equal((await handle(seedScopeBleed(), {})).permissionDecision, "deny");
  assert.equal((await handle(seedFindingsBleed(), {})).permissionDecision, "deny");
  assert.equal((await handle(seedUnrelated(), {})).permissionDecision, "deny");
  assert.equal((await handle(seedMergeMissed(), {})).permissionDecision, "deny");
  const idle = await handle({ action: "bail" }, {});
  assert.equal(idle.permissionDecision, "allow");
  assert.match(idle.hookSpecificOutput.decision.message, /level/);
  assert.equal((await handle(seedControl(), {})).permissionDecision, "allow");
  assert.equal((await handle(seedSkillReview(), {})).permissionDecision, "allow");
  assert.equal((await handle(seedDevelopBase(), {})).permissionDecision, "allow");
  assert.equal((await handle(seedReset(), {})).permissionDecision, "allow");
});

test("23 listen GET health and POST empty body is level", async () => {
  const server = listen(19951);
  await new Promise((resolve) => server.once("listening", resolve));
  const health = await fetch("http://127.0.0.1:19951/health");
  const info = await health.json();
  assert.equal(info.product, "datum");
  assert.match(info.verbs, /wrong-base/);
  const res = await fetch("http://127.0.0.1:19951/", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: "{}",
  });
  const body = await res.json();
  assert.equal(body.verdict, "level");
  assert.equal(body.idleWord, "level");
  const scored = await fetch("http://127.0.0.1:19951/", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(seedWrongBase()),
  });
  const scoredBody = await scored.json();
  assert.equal(scoredBody.verdict, "wrong-base");
  await new Promise((resolve) => server.close(resolve));
});

test("24 listen rejects non-JSON verbs besides health", async () => {
  const server = listen(19952);
  await new Promise((resolve) => server.once("listening", resolve));
  const put = await fetch("http://127.0.0.1:19952/", { method: "PUT" });
  assert.equal(put.status, 405);
  await new Promise((resolve) => server.close(resolve));
});

test("25 parse of the #90620 PR plus master note is wrong-base", () => {
  const datum = parseReviewProbe(
    `${DEMO_PR_URL}\nThe PR's actual base is develop. Diffing against local master pulled in ~50 unrelated commits. 7 findings, only 2 in the real PR diff. ${DEMO_UNRELATED_LINE}`,
    "code-review",
  );
  assert.equal(classify(datum), "wrong-base");
  assert.match(datum.prUrl, /pull\/254/);
  assert.equal(datum.prBase, DEMO_PR_BASE);
});

test("26 parseSessionTrace reads wrong-base JSON and prose", () => {
  assert.equal(
    classify(
      parseSessionTrace(
        `${DEMO_PR_URL} #90620 develop local master 7 findings only 2 ${DEMO_UNRELATED_LINE}`,
      ),
    ),
    "wrong-base",
  );
  assert.equal(
    classify(
      parseSessionTrace(
        JSON.stringify({
          prUrl: DEMO_PR_URL,
          prBase: DEMO_PR_BASE,
          measuredBase: DEMO_MEASURED_BASE,
          findingsTotal: DEMO_FINDINGS_TOTAL,
          findingsInDiff: DEMO_FINDINGS_IN_DIFF,
          findingsOffDiff: DEMO_FINDINGS_OFF_DIFF,
          offDiffFiles: DEMO_OFF_DIFF_FILES.slice(),
          skill: DEMO_SKILL,
        }),
      ),
    ),
    "wrong-base",
  );
});

test("27 score() accepts the documented probe shape", () => {
  const result = score({
    session: "demo",
    issue: 90620,
    source: "hook",
    prUrl: DEMO_PR_URL,
    prBase: DEMO_PR_BASE,
    measuredBase: DEMO_MEASURED_BASE,
    findingsTotal: DEMO_FINDINGS_TOTAL,
    findingsInDiff: DEMO_FINDINGS_IN_DIFF,
    findingsOffDiff: DEMO_FINDINGS_OFF_DIFF,
    offDiffFiles: DEMO_OFF_DIFF_FILES.slice(),
    skill: DEMO_SKILL,
    scored: false,
  });
  assert.equal(result.verdict, "wrong-base");
  assert.equal(result.level, false);
  const hold = score({
    prUrl: DEMO_PR_URL,
    prBase: DEMO_CONTROL_PR_BASE,
    measuredBase: DEMO_CONTROL_MEASURED,
    findingsTotal: DEMO_CONTROL_TOTAL,
    findingsInDiff: DEMO_CONTROL_IN_DIFF,
    findingsOffDiff: 0,
  });
  assert.equal(hold.verdict, "level");
  assert.equal(hold.level, true);
});

test("28 nested datum / probe fields clone", () => {
  const datum = cloneDatum({ probe: seedWrongBase().datum });
  assert.equal(classify(datum), "wrong-base");
});

test("29 fire live slack posts when fetch ok", async () => {
  const wrong = decide(seedWrongBase());
  const events = await fire(
    wrong,
    { DATUM_SLACK_WEBHOOK: "https://hooks.example/x" },
    async () => ({
      ok: true,
      status: 200,
      json: async () => ({}),
    }),
  );
  const slack = events.events.find((row) => row.adapter === "slack");
  assert.equal(slack.ok, true);
  assert.match(slack.summary, /Posted wrong-base/);
});

test("30 folio HTML sanity: idle word level, seeded wrong-base, not calque/fascia/quoin", () => {
  const html = readFileSync(fileURLToPath(new URL("../index.html", import.meta.url)), "utf8");
  assert.match(html, /level/);
  assert.match(html, /Score/);
  assert.match(html, /wrong-base/);
  assert.match(html, /90620/);
  assert.match(html, /seedOf\("wrong-base"\)|datum = seedOf\("wrong-base"\)/);
  assert.match(html, /const IDLE_WORD = "level"/);
  assert.doesNotMatch(html, /const IDLE_WORD = "datum"/);
  assert.doesNotMatch(html, /const IDLE_WORD = "fronted"/);
  assert.doesNotMatch(html, /const IDLE_WORD = "empty"/);
  assert.doesNotMatch(html, /const IDLE_WORD = "locked"/);
  assert.doesNotMatch(html, /const IDLE_WORD = "verbatim"/);
  assert.match(
    html,
    /survey-field|datum-desk|brass-leveling-plate|topo-grid|benchmark-stake|plumb-bob|field-notes|stamped-elevations|survey-rail/i,
  );
  assert.match(html, /09:50 Sydney · datum/);
  assert.match(html, /a wrong base is not a hold/i);
  assert.doesNotMatch(html, /class="shopfront-street"|class="enamel-fascia-board"|class="frosted-shop-door"/);
  assert.doesNotMatch(html, /class="composing-room"|class="oak-chase"|class="brass-quoin"|class="ink-slab"/);
  assert.doesNotMatch(html, /class="music-hall"|class="house-curtain"|class="proscenium-arch"|class="brass-crook"/);
  assert.doesNotMatch(html, /class="gunsmith-shop"|class="sear-rail"|class="walnut-stock"/);
  assert.doesNotMatch(html, /class="teller-hall"|class="marble-counter"|class="bronze-lattice"/);
  assert.doesNotMatch(html, /class="mailroom-hall"|class="cubby-wall"/);
  assert.doesNotMatch(html, /class="scriptorium-hall"|class="false-gloss-desk"|class="bilingual-manuscript"/);
  assert.doesNotMatch(html, /Bodoni Moda|Roboto Mono/);
  assert.doesNotMatch(html, /Abril Fatface|Bebas Neue|Cutive Mono/);
  assert.doesNotMatch(html, /Calistoga|Commissioner|Inconsolata/);
  assert.doesNotMatch(html, /Cinzel|Lora|Overpass Mono/);
  assert.doesNotMatch(html, /Playfair Display|IBM Plex Mono/);
  assert.doesNotMatch(html, /IM Fell English|Red Hat Mono/);
  assert.doesNotMatch(html, /millimeter slider|millimetre slider/i);
  assert.match(html, /<title>Datum/);
  assert.match(html, /Special Elite|Share Tech Mono/);
  assert.match(html, /Barlow Condensed/);
  assert.match(html, /Admit level/);
  assert.match(html, /Restore · #90620|restore to wrong-base/i);
});

test("31 HTML why-not names Calque, Fascia, Quoin, Parity, leftover", () => {
  const html = readFileSync(fileURLToPath(new URL("../index.html", import.meta.url)), "utf8");
  assert.match(html, /NOT Calque/);
  assert.match(html, /NOT Fascia/);
  assert.match(html, /NOT Quoin/);
  assert.match(html, /NOT Gaff/);
  assert.match(html, /NOT Sear/);
  assert.match(html, /NOT Parity/);
  assert.match(html, /leftover/);
  assert.match(html, /millimeter-slider|millimetre-slider|millimeter slider|millimetre slider/);
});

test("32 README names contrasts and level idle", () => {
  const readme = readFileSync(fileURLToPath(new URL("../README.md", import.meta.url)), "utf8");
  assert.match(readme, /NOT \*\*Calque\*\*|NOT Calque/);
  assert.match(readme, /NOT \*\*Fascia\*\*|NOT Fascia/);
  assert.match(readme, /NOT \*\*Quoin\*\*|NOT Quoin/);
  assert.match(readme, /NOT \*\*Parity\*\*|NOT Parity/);
  assert.match(readme, /\*\*level\*\*/);
  assert.match(readme, /#90620/);
  assert.match(readme, /#82397/);
  assert.match(readme, /#78257/);
  assert.match(readme, /#69232/);
  assert.match(readme, /\/datum\//);
  assert.doesNotMatch(readme, /idle word is datum/i);
  assert.doesNotMatch(readme, /idle word is fronted/i);
  assert.doesNotMatch(readme, /idle word is locked/i);
  assert.doesNotMatch(readme, /idle word is verbatim/i);
});

test("33 seeded 90620 numbers produce wrong-base / level=false", () => {
  const wrong = score({
    prUrl: DEMO_PR_URL,
    prBase: DEMO_PR_BASE,
    measuredBase: DEMO_MEASURED_BASE,
    findingsTotal: DEMO_FINDINGS_TOTAL,
    findingsInDiff: DEMO_FINDINGS_IN_DIFF,
    findingsOffDiff: DEMO_FINDINGS_OFF_DIFF,
    offDiffFiles: DEMO_OFF_DIFF_FILES.slice(),
    skill: DEMO_SKILL,
  });
  assert.equal(wrong.verdict, "wrong-base");
  assert.equal(wrong.level, false);
  assert.equal(wrong.hasOffDiff, true);
  assert.equal(wrong.developPr, true);
  assert.equal(wrong.masterMeasured, true);
});

test("34 control in-diff produces level=true; wrong-base never level", () => {
  const hold = score({
    prUrl: DEMO_PR_URL,
    prBase: DEMO_CONTROL_PR_BASE,
    measuredBase: DEMO_CONTROL_MEASURED,
    findingsTotal: DEMO_CONTROL_TOTAL,
    findingsInDiff: DEMO_CONTROL_IN_DIFF,
    findingsOffDiff: 0,
  });
  assert.equal(hold.verdict, "level");
  assert.equal(hold.level, true);
  const lie = score({
    prUrl: DEMO_PR_URL,
    prBase: DEMO_PR_BASE,
    measuredBase: DEMO_MEASURED_BASE,
    findingsTotal: DEMO_FINDINGS_TOTAL,
    findingsInDiff: DEMO_FINDINGS_IN_DIFF,
    findingsOffDiff: DEMO_FINDINGS_OFF_DIFF,
    offDiffFiles: DEMO_OFF_DIFF_FILES.slice(),
    skill: DEMO_SKILL,
  });
  assert.equal(lie.level, false);
  assert.equal(lie.verdict, "wrong-base");
});

test("35 Slack skip on level / control / skill-review / develop-base", () => {
  for (const seed of [seedReset, seedControl, seedSkillReview, seedDevelopBase, seedLevel]) {
    const result = decide(seed());
    assert.equal(result.slack, false, result.verdict);
    assert.match(slackDatumAlarm(result, {}).summary, /Would skip Slack/);
  }
});

test("36 wrong-base triad wins over master-lie and scope-bleed flags", () => {
  const result = score({
    prUrl: DEMO_PR_URL,
    prBase: DEMO_PR_BASE,
    measuredBase: DEMO_MEASURED_BASE,
    findingsTotal: DEMO_FINDINGS_TOTAL,
    findingsInDiff: DEMO_FINDINGS_IN_DIFF,
    findingsOffDiff: DEMO_FINDINGS_OFF_DIFF,
    offDiffFiles: DEMO_OFF_DIFF_FILES.slice(),
    skill: DEMO_SKILL,
  });
  assert.equal(result.verdict, "wrong-base");
  assert.equal(result.level, false);
});

test("37 admit still does not lie after wrong-base / master-lie", () => {
  const admitted = decide({ ...seedWrongBase(), action: "admit" });
  assert.equal(admitted.verdict, "wrong-base");
  assert.equal(admitted.level, false);
  const lie = decide({ ...seedMasterLie(), action: "admit" });
  assert.equal(lie.verdict, "master-lie");
  assert.equal(lie.level, false);
});

test("38 HTML parse prefers JSON so PR+master is wrong-base not scope-bleed", () => {
  const html = readFileSync(fileURLToPath(new URL("../index.html", import.meta.url)), "utf8");
  assert.match(html, /raw\.startsWith\("\{"\)|startsWith\("\{"\)/);
  const probe = score({
    prUrl: DEMO_PR_URL,
    prBase: DEMO_PR_BASE,
    measuredBase: DEMO_MEASURED_BASE,
    findingsTotal: DEMO_FINDINGS_TOTAL,
    findingsInDiff: DEMO_FINDINGS_IN_DIFF,
    findingsOffDiff: DEMO_FINDINGS_OFF_DIFF,
    offDiffFiles: DEMO_OFF_DIFF_FILES.slice(),
    skill: DEMO_SKILL,
  });
  assert.equal(probe.verdict, "wrong-base");
  assert.equal(probe.level, false);
});

test("39 README and plate cite #90620 related skill priors", () => {
  const readme = readFileSync(fileURLToPath(new URL("../README.md", import.meta.url)), "utf8");
  assert.match(readme, /90620/);
  assert.match(readme, /82397/);
  assert.match(readme, /78257/);
  assert.match(readme, /69232/);
  assert.doesNotMatch(readme, /idle word is datum |idle word is fronted|idle word is locked|idle word is verbatim/i);
  const html = readFileSync(fileURLToPath(new URL("../index.html", import.meta.url)), "utf8");
  assert.match(html, /email-background-worker|pull\/254|SendEmailCommandHandler/);
  assert.match(html, /82397/);
  assert.match(html, /78257/);
  assert.match(html, /69232/);
  assert.match(html, new RegExp(String(PRIOR_SHADOW_82397)));
  assert.match(html, new RegExp(String(PRIOR_EFFORT_78257)));
  assert.match(html, new RegExp(String(PRIOR_COLLIDE_69232)));
  assert.match(html, /GovernanceWorkflowMappingProfile|SendEmailCommandHandler/);
  assert.ok(DEMO_OFF_DIFF_FILES.includes("GovernanceWorkflowPayloadConverter.cs"));
});
