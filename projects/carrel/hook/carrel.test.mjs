import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  fire,
  githubCarrelLedger,
  linearCarrelTicket,
  slackCarrelAlarm,
} from "./adapters.mjs";
import {
  ALARM_VERDICTS,
  CODEX_SPAWN_CWD,
  CODEX_THREAD_ENV,
  CODEX_WORKTREE,
  DEMO_CALLER_CWD,
  DEMO_CALLER_LAUNCH,
  DEMO_LANE_NAME,
  DEMO_LANE_PORT,
  DEMO_NESTED_LAUNCH,
  DEMO_ROOT_NAME,
  DEMO_ROOT_PORT,
  DEMO_SESSION_CWD,
  DEMO_SESSION_LAUNCH,
  DOWNSTREAM_845,
  FEATURED_ISSUE,
  IDLE_WORD,
  LINEAR_VERDICTS,
  NEARBY_63008,
  NEARBY_76496,
  RELATED_85319,
  RELATED_86039,
  SLACK_VERDICTS,
  VERDICTS,
  analyze,
  classify,
  cloneCarrel,
  decide,
  decideSeed,
  emptyAction,
  emptyCarrel,
  feedOf,
  forbiddenIdleWords,
  isIdle,
  isOffShelf,
  parseCarrelJson,
  parseLaunchJson,
  parsePreviewStart,
  pathUnder,
  reasonsOf,
  score,
  seatedOf,
  seed90661,
  seedBorrowed,
  seedBylineGhost,
  seedContended,
  seedControl,
  seedFallbackOk,
  seedFasciaTrust,
  seedHaspLease,
  seedLaneBlind,
  seedMainSpawn,
  seedMisfiled,
  seedNestedMiss,
  seedOffShelf86039,
  seedOverwritten,
  seedReset,
  seedSeated,
  seedSiblingServed,
  seedWicketEscape,
  verdictOf,
} from "./carrel.mjs";
import { handle, listen } from "./index.mjs";

const PRIOR_IDLES =
  /empty|silent|mute|idle|dead|credited|level|verbatim|fronted|locked|yanked|caught|stowed|posted|bunged|belayed|rove|keyed|housed|beamed|snug|hung|appointed|cinched|gauged|stamped|overrun|pratique|wound|bound|stilled|stabled|drained|flat|fit|spoilt|laid|unlinked|tight|banked|roosted|stocked|heard|clear|paired|kernel|latched|upheld|sterling|home|valid|dry|quiet|seised|rung|moored/;

function assertIdleNeverCarrel(result) {
  assert.equal(result.idleWord, "seated");
  assert.equal(IDLE_WORD, "seated");
  assert.doesNotMatch(result.idleWord, /carrel/i);
  assert.doesNotMatch(IDLE_WORD, /^carrel$/i);
  assert.doesNotMatch(result.idleWord, PRIOR_IDLES);
}

function assertScoreShape(result) {
  assert.equal(typeof result.verdict, "string");
  assert.ok(Array.isArray(result.reasons));
  assert.equal(typeof result.seated, "boolean");
  assert.equal(typeof result.feed, "string");
}

test("1 seed 90661 borrowed is borrowed, slack, linear, idleWord seated, never seated", () => {
  const seed = seedBorrowed();
  const result = decide(seed);
  assert.equal(result.verdict, "borrowed");
  assert.equal(result.state, "borrowed");
  assert.equal(result.decision, "borrowed");
  assert.equal(classify(seed.carrel), "borrowed");
  assert.equal(verdictOf(seed.carrel), "borrowed");
  assert.notEqual(result.verdict, "seated");
  assert.equal(result.alarm, true);
  assert.equal(result.slack, true);
  assert.equal(result.linear, true);
  assert.equal(result.github, true);
  assert.equal(result.borrowed, true);
  assert.equal(result.seated, false);
  assertIdleNeverCarrel(result);
  assert.equal(result.session, "90661-borrowed");
  assert.equal(result.issue, FEATURED_ISSUE);
  assert.equal(result.facts.sessionCwd, DEMO_SESSION_CWD);
  assert.equal(result.facts.callerCwd, DEMO_CALLER_CWD);
  assert.equal(result.facts.launchJsonPathUsed, DEMO_SESSION_LAUNCH);
  assert.equal(result.facts.requestedName, DEMO_LANE_NAME);
  assert.match(result.feed, /Borrowed|session cwd|primary #90661/i);
  assert.equal(decideSeed("borrowed").verdict, "borrowed");
  assert.equal(decideSeed("90661").verdict, "borrowed");
  assert.equal(decideSeed(90661).verdict, "borrowed");
  assert.equal(decide(seed90661()).verdict, "borrowed");
});

test("2 idle/empty/{} is seated, never the product name, never empty, never error", () => {
  const result = decide(emptyAction("idle"));
  assert.equal(result.state, "seated");
  assert.equal(result.verdict, "seated");
  assert.equal(result.alarm, false);
  assert.equal(result.slack, false);
  assert.equal(result.seated, true);
  assert.equal(classify({}), "seated");
  assert.equal(classify(emptyCarrel()), "seated");
  assert.equal(isIdle(emptyCarrel()), true);
  assert.equal(score(emptyCarrel()).seated, true);
  assertIdleNeverCarrel(result);
  const bailed = decide({ action: "bail" });
  assert.equal(bailed.state, "seated");
  assert.equal(bailed.idleWord, "seated");
  const empty = decide({});
  assert.equal(empty.verdict, "seated");
  assert.match(empty.feed, /Seated/);
});

test("3 honest seated hold: caller worktree launch.json used", () => {
  const result = decide(seedSeated());
  assert.equal(result.verdict, "seated");
  assert.equal(result.alarm, false);
  assert.equal(result.seated, true);
  assert.equal(result.linear, false);
  assert.equal(result.facts.usedCaller, true);
  assert.equal(result.facts.usedSession, false);
  assert.match(result.feed, /Seated|calling agent's own worktree|idle word is seated/i);
  assert.equal(decideSeed("control").verdict, "seated");
  assert.equal(decideSeed("healthy").verdict, "seated");
  assert.equal(decide(seedControl()).seated, true);
  assert.equal(seatedOf(seedSeated().carrel), true);
});

test("4 seated must not be confused with borrowed, misfiled, or contended", () => {
  const hold = decide(seedSeated());
  const borrowed = decide(seedBorrowed());
  const misfiled = decide(seedMisfiled());
  const contended = decide(seedContended());
  assert.equal(hold.verdict, "seated");
  assert.equal(borrowed.verdict, "borrowed");
  assert.equal(misfiled.verdict, "misfiled");
  assert.equal(contended.verdict, "contended");
  assert.notEqual(hold.verdict, borrowed.verdict);
  assert.notEqual(hold.verdict, misfiled.verdict);
  assert.notEqual(hold.verdict, contended.verdict);
  assert.equal(hold.seated, true);
  assert.equal(borrowed.seated, false);
  assert.equal(misfiled.seated, false);
  assert.equal(contended.seated, false);
});

test("5 misfiled: name matched against orchestrator configurations; lane name missing", () => {
  const result = decide(seedMisfiled());
  assert.equal(result.verdict, "misfiled");
  assert.equal(result.misfiled, true);
  assert.equal(result.seated, false);
  assert.equal(result.borrowed, false);
  assert.equal(result.alarm, true);
  assert.equal(result.linear, true);
  assert.ok(result.facts.callerNames.includes(DEMO_LANE_NAME));
  assert.ok(!result.facts.scopeNames.includes(DEMO_LANE_NAME));
  assert.match(result.feed, /Misfiled|orchestrator|lane name missing/i);
  assert.equal(decideSeed("misfiled").verdict, "misfiled");
});

test("6 contended: N lanes writing one shared launch.json", () => {
  const result = decide(seedContended());
  assert.equal(result.verdict, "contended");
  assert.equal(result.contended, true);
  assert.equal(result.seated, false);
  assert.equal(result.overwritten, false);
  assert.equal(result.alarm, true);
  assert.equal(result.linear, true);
  assert.match(result.feed, /Contended|shared launch.json/i);
});

test("7 overwritten: last-writer-wins, no error", () => {
  const result = decide(seedOverwritten());
  assert.equal(result.verdict, "overwritten");
  assert.equal(result.overwritten, true);
  assert.equal(result.seated, false);
  assert.equal(result.alarm, true);
  assert.match(result.feed, /Overwritten|last-writer-wins|no error/i);
});

test("8 sibling-served: preview serving a sibling worktree under this lane's port", () => {
  const result = decide(seedSiblingServed());
  assert.equal(result.verdict, "sibling-served");
  assert.equal(result.siblingServed, true);
  assert.equal(result.seated, false);
  assert.equal(result.alarm, true);
  assert.equal(result.linear, true);
  assert.equal(result.room.port, DEMO_LANE_PORT);
  assert.equal(result.room.servedWorktree, DEMO_SESSION_CWD);
  assert.match(result.feed, /Sibling-served|sibling worktree/i);
});

test("9 lane-blind: caller cwd ignored for discovery", () => {
  const result = decide(seedLaneBlind());
  assert.equal(result.verdict, "lane-blind");
  assert.equal(result.laneBlind, true);
  assert.equal(result.seated, false);
  assert.equal(result.borrowed, false);
  assert.equal(result.alarm, true);
  assert.match(result.feed, /Lane-blind|caller cwd ignored/i);
});

test("10 nested-miss #76496: file exists in nested worktree but lookup fails", () => {
  const result = decide(seedNestedMiss());
  assert.equal(result.verdict, "nested-miss");
  assert.equal(result.nestedMiss, true);
  assert.equal(result.seated, false);
  assert.equal(result.borrowed, false);
  assert.equal(result.issue, NEARBY_76496);
  assert.equal(result.room.citedPath, DEMO_NESTED_LAUNCH);
  assert.equal(result.room.fileExistsAtCitedPath, true);
  assert.equal(result.room.lookupFailed, true);
  assert.match(result.feed, /Nested-miss|#76496/i);
  assert.equal(decideSeed("76496").verdict, "nested-miss");
  assert.equal(decideSeed(76496).verdict, "nested-miss");
});

test("11 main-spawn #63008: spawn cwd is main repo not worktree", () => {
  const result = decide(seedMainSpawn());
  assert.equal(result.verdict, "main-spawn");
  assert.equal(result.mainSpawn, true);
  assert.equal(result.seated, false);
  assert.equal(result.borrowed, false);
  assert.equal(result.issue, NEARBY_63008);
  assert.equal(result.room.spawnCwd, DEMO_SESSION_CWD);
  assert.equal(result.facts.usedCaller, true);
  assert.match(result.feed, /Main-spawn|#63008/i);
  assert.equal(decideSeed("63008").verdict, "main-spawn");
});

test("12 fallback-ok: caller has no file, session fallback explicit and safe", () => {
  const result = decide(seedFallbackOk());
  assert.equal(result.verdict, "fallback-ok");
  assert.equal(result.fallbackOk, true);
  assert.equal(result.seated, false);
  assert.equal(result.borrowed, false);
  assert.equal(result.alarm, false);
  assert.equal(result.linear, false);
  assert.match(result.feed, /Fallback-ok|explicit and safe/i);
});

test("13 family verdicts are distinct", () => {
  const map = {
    seated: decide(seedSeated()).verdict,
    borrowed: decide(seedBorrowed()).verdict,
    misfiled: decide(seedMisfiled()).verdict,
    contended: decide(seedContended()).verdict,
    overwritten: decide(seedOverwritten()).verdict,
    "sibling-served": decide(seedSiblingServed()).verdict,
    "lane-blind": decide(seedLaneBlind()).verdict,
    "nested-miss": decide(seedNestedMiss()).verdict,
    "main-spawn": decide(seedMainSpawn()).verdict,
    "fallback-ok": decide(seedFallbackOk()).verdict,
  };
  const unique = new Set(Object.values(map));
  assert.equal(unique.size, 10);
  for (const [name, verdict] of Object.entries(map)) {
    assert.equal(verdict, name);
  }
});

test("14 refuse treating #86039 / Wicket / Fascia / Hasp / Byline as this bug", () => {
  const nearby = [
    seedOffShelf86039,
    seedWicketEscape,
    seedFasciaTrust,
    seedHaspLease,
    seedBylineGhost,
  ];
  for (const seed of nearby) {
    const result = decide(seed());
    assert.equal(result.verdict, "off-shelf", result.session);
    assert.equal(result.offShelf, true, result.session);
    assert.equal(isOffShelf(seed().carrel), true, result.session);
    assert.notEqual(result.verdict, "borrowed", result.session);
    assert.notEqual(result.verdict, "misfiled", result.session);
    assert.notEqual(result.verdict, "contended", result.session);
    assert.notEqual(result.verdict, "overwritten", result.session);
    assert.notEqual(result.verdict, "sibling-served", result.session);
    assert.notEqual(result.verdict, "seated", result.session);
    assert.ok(result.reasons.some((row) => /off-shelf nearby/i.test(row)), result.session);
  }
  assert.equal(decide(seedOffShelf86039()).issue, RELATED_86039);
  assert.equal(decide(seedWicketEscape()).room.wicketEscape, true);
  assert.equal(decide(seedFasciaTrust()).room.fasciaTrust, true);
  assert.equal(decide(seedHaspLease()).room.haspLease, true);
  assert.equal(decide(seedBylineGhost()).room.bylineGhost, true);
});

test("15 forbidden idle list includes carrel, empty, leftover names, not seated", () => {
  const words = forbiddenIdleWords();
  assert.ok(words.includes("carrel"));
  assert.ok(words.includes("empty"));
  assert.ok(words.includes("silent"));
  assert.ok(words.includes("mute"));
  assert.ok(words.includes("credited"));
  assert.ok(words.includes("level"));
  assert.ok(words.includes("verbatim"));
  assert.ok(words.includes("fronted"));
  assert.ok(words.includes("byline"));
  assert.ok(words.includes("wicket"));
  assert.ok(words.includes("hasp"));
  assert.ok(words.includes("fascia"));
  assert.ok(!words.includes("seated"));
  assert.doesNotMatch(IDLE_WORD, PRIOR_IDLES);
});

test("16 demo sinks: Slack on borrowed family; Linear on four; GitHub always; never fake live 200", async () => {
  const borrowed = decide(seedBorrowed());
  const slack = slackCarrelAlarm(borrowed, {});
  assert.equal(slack.mode, "demo");
  assert.match(slack.summary, /Would post to Slack/);
  assert.ok(Array.isArray(slack.body.blocks));
  const github = githubCarrelLedger(borrowed, {});
  assert.equal(github.mode, "demo");
  assert.match(github.summary, /Would open a GitHub carrel-ledger/);
  const linear = linearCarrelTicket(borrowed, {});
  assert.equal(linear.mode, "demo");
  assert.match(linear.summary, /Would open a Linear ticket/);

  for (const seed of [seedBorrowed, seedMisfiled, seedContended, seedOverwritten, seedSiblingServed]) {
    const result = decide(seed());
    assert.equal(result.slack, true, result.verdict);
    assert.match(slackCarrelAlarm(result, {}).summary, /Would post to Slack/);
  }
  for (const seed of [seedBorrowed, seedMisfiled, seedSiblingServed, seedContended]) {
    const result = decide(seed());
    assert.equal(result.linear, true, result.verdict);
    assert.match(linearCarrelTicket(result, {}).summary, /Would open a Linear ticket/);
  }
  const seated = decide(seedSeated());
  assert.match(slackCarrelAlarm(seated, {}).summary, /Would skip Slack/);
  assert.match(linearCarrelTicket(seated, {}).summary, /Would skip Linear/);
  const fired = await fire(borrowed, {});
  assert.equal(fired.events.length, 3);
  assert.ok(fired.events.every((row) => row.mode === "demo"));
  assert.ok(fired.events.every((row) => row.ok === true));
});

test("17 handle deny on borrowed, allow on seated", async () => {
  const deny = await handle(seedBorrowed(), {});
  assert.equal(deny.permissionDecision, "deny");
  assert.equal(deny.verdict, "borrowed");
  assert.match(deny.hookSpecificOutput.decision.message, /session cwd/i);
  const allow = await handle(seedSeated(), {});
  assert.equal(allow.permissionDecision, "allow");
  assert.equal(allow.verdict, "seated");
  assert.match(allow.hookSpecificOutput.decision.message, /idle word is seated/i);
});

test("18 restore / 90661 / incident produce the borrowed seed", () => {
  assert.equal(decide({ action: "restore" }).verdict, "borrowed");
  assert.equal(decide({ action: "90661" }).verdict, "borrowed");
  assert.equal(decide({ action: "incident" }).verdict, "borrowed");
  assert.equal(decide({ action: "borrowed" }).verdict, "borrowed");
});

test("19 admit scores honestly: borrowed stays borrowed", () => {
  const admitted = decide({ action: "admit", ...seedBorrowed() });
  assert.equal(admitted.verdict, "borrowed");
  assert.equal(admitted.seated, false);
});

test("20 parse launch.json + preview_start payload", () => {
  const configs = parseLaunchJson({
    configurations: [
      { name: DEMO_ROOT_NAME, port: DEMO_ROOT_PORT },
      { name: DEMO_LANE_NAME, port: DEMO_LANE_PORT },
    ],
  });
  assert.equal(configs.length, 2);
  assert.equal(parsePreviewStart({ name: DEMO_LANE_NAME }), DEMO_LANE_NAME);
  assert.equal(parsePreviewStart('preview_start({ name: "lane-web" })'), "lane-web");
  const probe = parseCarrelJson({
    sessionCwd: DEMO_SESSION_CWD,
    callerCwd: DEMO_CALLER_CWD,
    launchJsonPathUsed: DEMO_SESSION_LAUNCH,
    preview_start: { name: DEMO_LANE_NAME },
    sessionConfigs: [{ name: DEMO_ROOT_NAME, port: DEMO_ROOT_PORT }],
    callerConfigs: [{ name: DEMO_LANE_NAME, port: DEMO_LANE_PORT }],
    callerLaunchExists: true,
  });
  assert.equal(probe.requestedName, DEMO_LANE_NAME);
  assert.equal(classify(probe), "borrowed");
});

test("21 constants name the #90661 repro paths and nearby issue numbers", () => {
  assert.equal(FEATURED_ISSUE, 90661);
  assert.equal(NEARBY_63008, 63008);
  assert.equal(NEARBY_76496, 76496);
  assert.equal(RELATED_86039, 86039);
  assert.equal(RELATED_85319, 85319);
  assert.equal(CODEX_SPAWN_CWD, 18969);
  assert.equal(CODEX_WORKTREE, 23095);
  assert.equal(CODEX_THREAD_ENV, 30570);
  assert.equal(DOWNSTREAM_845, 845);
  assert.equal(DEMO_ROOT_NAME, "root-web");
  assert.equal(DEMO_LANE_NAME, "lane-web");
  assert.equal(DEMO_ROOT_PORT, 3000);
  assert.equal(DEMO_LANE_PORT, 3101);
  assert.ok(pathUnder(DEMO_SESSION_LAUNCH, DEMO_SESSION_CWD));
  assert.ok(pathUnder(DEMO_CALLER_LAUNCH, DEMO_CALLER_CWD));
  assert.ok(!pathUnder(DEMO_SESSION_LAUNCH, DEMO_CALLER_CWD));
});

test("22 feed and reasons cite #90661 on borrowed", () => {
  assert.match(feedOf("seated"), /idle word is seated/);
  assert.match(feedOf("borrowed"), /#90661/);
  const reasons = reasonsOf(seedBorrowed().carrel, "borrowed");
  assert.ok(reasons.some((row) => /#90661/.test(row)));
  const facts = analyze(seedBorrowed().carrel);
  assert.equal(facts.borrowed, true);
  assert.equal(facts.usedSession, true);
  assert.equal(facts.eventClass, "session-cwd-discovery");
});

test("23 folio HTML sanity: idle word seated, seeded borrowed, not byline/datum/fascia", () => {
  const html = readFileSync(fileURLToPath(new URL("../index.html", import.meta.url)), "utf8");
  assert.match(html, /seated/);
  assert.match(html, /Score/);
  assert.match(html, /borrowed/);
  assert.match(html, /90661/);
  assert.match(html, /const IDLE_WORD = "seated"/);
  assert.doesNotMatch(html, /const IDLE_WORD = "carrel"/);
  assert.doesNotMatch(html, /const IDLE_WORD = "credited"/);
  assert.doesNotMatch(html, /const IDLE_WORD = "empty"/);
  assert.doesNotMatch(html, /const IDLE_WORD = "level"/);
  assert.doesNotMatch(html, /const IDLE_WORD = "verbatim"/);
  assert.match(html, /reading-room|card-catalog|study-carrel|call-slip|banker-lamp/i);
  assert.match(html, /11:50 Sydney · carrel/);
  assert.match(html, /a borrowed carrel is not a hold/i);
  assert.doesNotMatch(html, /class="city-desk"|class="masthead-plate"|class="brass-nameplate-rack"/);
  assert.doesNotMatch(html, /class="survey-field"|class="datum-desk"|class="brass-leveling-plate"/);
  assert.doesNotMatch(html, /class="shopfront-street"|class="enamel-fascia-board"/);
  assert.doesNotMatch(html, /class="composing-room"|class="oak-chase"|class="brass-quoin"/);
  assert.doesNotMatch(html, /class="gunsmith-shop"|class="sear-rail"/);
  assert.doesNotMatch(html, /class="teller-hall"|class="marble-counter"/);
  assert.doesNotMatch(html, /class="mailroom-hall"|class="cubby-wall"/);
  assert.doesNotMatch(html, /Oswald|Newsreader/);
  assert.doesNotMatch(html, /millimeter slider|millimetre slider/i);
  assert.match(html, /<title>Carrel/);
  assert.match(html, /Fraunces|Literata|IBM Plex Mono/);
  assert.match(html, /Admit seated/);
  assert.match(html, /Restore · #90661|restore to borrowed/i);
});

test("24 HTML why-not names Wicket, Fascia, Hasp, Byline, leftover", () => {
  const html = readFileSync(fileURLToPath(new URL("../index.html", import.meta.url)), "utf8");
  assert.match(html, /NOT Wicket/);
  assert.match(html, /NOT Fascia/);
  assert.match(html, /NOT Hasp/);
  assert.match(html, /NOT Byline/);
  assert.match(html, /NOT Iota/);
  assert.match(html, /NOT Cinch/);
  assert.match(html, /NOT Cubby/);
  assert.match(html, /leftover/);
  assert.match(html, /millimeter-slider|millimetre-slider|millimeter slider|millimetre slider/);
});

test("25 README names contrasts and seated idle", () => {
  const readme = readFileSync(fileURLToPath(new URL("../README.md", import.meta.url)), "utf8");
  assert.match(readme, /NOT \*\*Wicket\*\*|NOT Wicket/);
  assert.match(readme, /NOT \*\*Fascia\*\*|NOT Fascia/);
  assert.match(readme, /NOT \*\*Hasp\*\*|NOT Hasp/);
  assert.match(readme, /NOT \*\*Byline\*\*|NOT Byline/);
  assert.match(readme, /\*\*seated\*\*/);
  assert.match(readme, /#90661/);
  assert.match(readme, /#63008/);
  assert.match(readme, /#76496/);
  assert.match(readme, /#86039/);
  assert.match(readme, /\/carrel\//);
  assert.doesNotMatch(readme, /idle word is carrel/i);
  assert.doesNotMatch(readme, /idle word is credited/i);
  assert.doesNotMatch(readme, /idle word is level/i);
  assert.doesNotMatch(readme, /idle word is verbatim/i);
});

test("26 README and desk cite #90661 plus nearby and cross-ecosystem", () => {
  const readme = readFileSync(fileURLToPath(new URL("../README.md", import.meta.url)), "utf8");
  assert.match(readme, /90661/);
  assert.match(readme, /18969/);
  assert.match(readme, /23095/);
  assert.match(readme, /30570/);
  const html = readFileSync(fileURLToPath(new URL("../index.html", import.meta.url)), "utf8");
  assert.match(html, /90661/);
  assert.match(html, /63008/);
  assert.match(html, /76496/);
  assert.match(html, /86039/);
  assert.match(html, /18969/);
  assert.match(html, /root-web/);
  assert.match(html, /lane-web/);
  assert.match(html, /github.com\/anthropics\/claude-code\/issues\/90661/);
});

test("27 Slack skip on seated / control / fallback-ok / off-shelf", () => {
  for (const seed of [seedReset, seedControl, seedSeated, seedFallbackOk, seedOffShelf86039]) {
    const result = decide(seed());
    assert.equal(result.slack, false, result.verdict);
    assert.match(slackCarrelAlarm(result, {}).summary, /Would skip Slack/);
  }
});

test("28 borrowed beats misfiled on the #90661 triad", () => {
  const facts = analyze(seedBorrowed().carrel);
  assert.equal(facts.borrowed, true);
  assert.equal(facts.misfiled, true);
  assert.equal(classify(seedBorrowed().carrel), "borrowed");
});

test("29 sibling-served beats borrowed when the lane port serves a sibling tree", () => {
  const result = score(seedSiblingServed().carrel);
  assert.equal(result.verdict, "sibling-served");
  assert.equal(analyze(seedSiblingServed().carrel).borrowed, true);
});

test("30 HTML parse prefers JSON so a pasted probe scores the room", () => {
  const html = readFileSync(fileURLToPath(new URL("../index.html", import.meta.url)), "utf8");
  assert.match(html, /raw\.startsWith\("\{"\)|startsWith\("\{"\)/);
  const probe = score(seedBorrowed().carrel);
  assert.equal(probe.verdict, "borrowed");
  assert.equal(probe.seated, false);
});

test("31 listen health names carrel verbs", async () => {
  const server = listen(0);
  await new Promise((resolve) => server.once("listening", resolve));
  const { port } = server.address();
  const res = await fetch(`http://127.0.0.1:${port}/health`);
  const body = await res.json();
  assert.equal(body.product, "carrel");
  assert.match(body.verbs, /borrowed/);
  assert.match(body.verbs, /seated/);
  server.close();
});

test("32 assertScoreShape on every family verdict", () => {
  for (const seed of [
    seedSeated,
    seedBorrowed,
    seedMisfiled,
    seedContended,
    seedOverwritten,
    seedSiblingServed,
    seedLaneBlind,
    seedNestedMiss,
    seedMainSpawn,
    seedFallbackOk,
    seedOffShelf86039,
  ]) {
    const result = decide(seed());
    assertScoreShape(result);
    assertIdleNeverCarrel(result);
    assert.ok(VERDICTS.includes(result.verdict), result.verdict);
  }
  assert.ok(ALARM_VERDICTS.includes("borrowed"));
  assert.ok(LINEAR_VERDICTS.includes("borrowed"));
  assert.ok(SLACK_VERDICTS.includes("misfiled"));
});

test("33 cloneCarrel reads preview_start name", () => {
  const row = cloneCarrel({
    sessionCwd: DEMO_SESSION_CWD,
    preview_start: { name: "lane-web" },
  });
  assert.equal(row.requestedName, "lane-web");
});
