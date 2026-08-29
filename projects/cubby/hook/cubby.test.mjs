import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  fire,
  githubCubbyLedger,
  linearCubbyTicket,
  slackCubbyAlarm,
} from "./adapters.mjs";
import {
  ALARM_VERDICTS,
  ANCESTOR_ISSUE,
  CWD_GIT_ISSUE,
  DEMO_CWD,
  DEMO_EXPECTED_CACHE,
  DEMO_INJECTED_CACHE,
  DEMO_MISSING_FILE_COUNT,
  FEATURED_ISSUE,
  IDLE_WORD,
  LINEAR_VERDICTS,
  NON_ASCII_ISSUE,
  READ_WRONG_SCOPE_ISSUE,
  SLACK_VERDICTS,
  VERDICTS,
  WRONG_HASH_ISSUE,
  analyze,
  classify,
  cloneCubby,
  decide,
  decideSeed,
  emptyAction,
  emptyCubby,
  feedOf,
  flagsOf,
  forbiddenIdleWords,
  isIdle,
  parseSessionTrace,
  reasonsOf,
  score,
  seed90604,
  seedAncestor,
  seedControl,
  seedGhosted,
  seedInvisible,
  seedMirroredFail,
  seedMisfiled,
  seedReset,
  seedRestored,
  seedStale,
  seedStowed,
  seedUnsurfaced,
  seedWalkedUp,
  stowedOf,
  invisibleOf,
  verdictOf,
} from "./cubby.mjs";
import { handle, listen } from "./index.mjs";

function assertIdleNeverCubby(result) {
  assert.equal(result.idleWord, "stowed");
  assert.equal(IDLE_WORD, "stowed");
  assert.doesNotMatch(result.idleWord, /cubby/i);
  assert.doesNotMatch(IDLE_WORD, /^cubby$/i);
  assert.doesNotMatch(result.idleWord, /empty|silent|mute|idle|dead/i);
  assert.doesNotMatch(
    result.idleWord,
    /posted|bunged|belayed|rove|keyed|housed|beamed|snug|hung|appointed|cinched|gauged|stamped|overrun|pratique|wound|bound|stilled|stabled|drained|flat|fit|spoilt|laid|unlinked|tight|banked|roosted|stocked|seated|heard|clear|paired|kernel|latched|upheld|sterling|home|valid|dry|sealed|quiet|seised|rung|moored/,
  );
}

function assertScoreShape(result) {
  assert.equal(typeof result.verdict, "string");
  assert.ok(Array.isArray(result.reasons));
  assert.equal(typeof result.stowed, "boolean");
  assert.equal(typeof result.feed, "string");
}

test("1 seed 90604 invisible is invisible, slack, linear, idleWord stowed, never stowed", () => {
  const seed = seedInvisible();
  const result = decide(seed);
  assert.equal(result.verdict, "invisible");
  assert.equal(result.state, "invisible");
  assert.equal(result.decision, "invisible");
  assert.equal(classify(seed.cubby), "invisible");
  assert.equal(verdictOf(seed.cubby), "invisible");
  assert.notEqual(result.verdict, "stowed");
  assert.notEqual(result.verdict, "ancestor");
  assert.equal(result.alarm, true);
  assert.equal(result.slack, true);
  assert.equal(result.linear, true);
  assert.equal(result.github, true);
  assert.equal(result.cubbyInvisible, true);
  assert.equal(result.invisible, true);
  assert.equal(result.stowed, false);
  assertIdleNeverCubby(result);
  assert.equal(result.session, "90604-invisible");
  assert.equal(result.issue, FEATURED_ISSUE);
  assert.equal(result.ancestorWalkUp, true);
  assert.equal(result.safetyRuleInAuthoritativeOnly, true);
  assert.equal(result.cachePathSurfaced, false);
  assert.equal(result.injectedCachePath, DEMO_INJECTED_CACHE);
  assert.equal(result.expectedCachePath, DEMO_EXPECTED_CACHE);
  assert.equal(result.cwd, DEMO_CWD);
  assert.match(result.feed, /Invisible|primary #90604/i);
  assert.equal(decideSeed("invisible").verdict, "invisible");
  assert.equal(decideSeed("90604-invisible").verdict, "invisible");
  assert.equal(decideSeed(90604).verdict, "invisible");
});

test("2 idle/empty/{} is stowed, never the product name, never empty, never error", () => {
  const result = decide(emptyAction("idle"));
  assert.equal(result.state, "stowed");
  assert.equal(result.verdict, "stowed");
  assert.equal(result.alarm, false);
  assert.equal(result.slack, false);
  assert.equal(result.stowed, true);
  assert.equal(classify({}), "stowed");
  assert.equal(classify(emptyCubby()), "stowed");
  assert.equal(isIdle(emptyCubby()), true);
  assert.equal(score(emptyCubby()).stowed, true);
  assertIdleNeverCubby(result);
  const bailed = decide({ action: "bail" });
  assert.equal(bailed.state, "stowed");
  assert.equal(bailed.idleWord, "stowed");
  const empty = decide({});
  assert.equal(empty.verdict, "stowed");
  assert.match(empty.feed, /Stowed/);
});

test("3 control stowed stays stowed with stowed true", () => {
  const result = decide(seedControl());
  assert.equal(result.verdict, "stowed");
  assert.equal(result.alarm, false);
  assert.equal(result.expectedCachePath, result.injectedCachePath);
  assert.equal(result.cachePathSurfaced, true);
  assert.equal(result.safetyRuleInAuthoritativeOnly, false);
  assert.equal(result.injectedMissingFileCount, 0);
  assert.equal(result.stowed, true);
  assert.match(result.feed, /Stowed|correct cache/);
  assert.equal(decideSeed("control").verdict, "stowed");
  assert.equal(decideSeed("healthy").verdict, "stowed");
  assert.equal(decide(seedControl()).stowed, true);
});

test("4 ancestor: walk-up without the safety-rule-invisible harm", () => {
  const result = decide(seedAncestor());
  assert.equal(result.verdict, "ancestor");
  assert.equal(result.cubbyAncestor, true);
  assert.equal(result.ancestorWalkUp, true);
  assert.equal(result.safetyRuleInAuthoritativeOnly, false);
  assert.equal(result.issue, ANCESTOR_ISSUE);
  assert.equal(result.alarm, true);
  assert.equal(result.linear, true);
  assert.equal(result.stowed, false);
  assert.match(result.feed, /Ancestor|walked up|#53734/i);
  assert.equal(decideSeed("ancestor").verdict, "ancestor");
});

test("5 walked-up: CWD vs git-root path split", () => {
  const result = decide(seedWalkedUp());
  assert.equal(result.verdict, "walked-up");
  assert.equal(result.cubbyWalkedUp, true);
  assert.equal(result.cwdVsGitRootSplit, true);
  assert.equal(result.ancestorWalkUp, false);
  assert.equal(result.issue, CWD_GIT_ISSUE);
  assert.equal(result.alarm, true);
  assert.equal(result.linear, true);
  assert.equal(result.stowed, false);
  assert.match(result.feed, /Walked-up|CWD vs git-root|#52772|#90046/i);
  assert.equal(decideSeed("walked-up").verdict, "walked-up");
});

test("6 misfiled: different project-hash folder, not ancestor", () => {
  const result = decide(seedMisfiled());
  assert.equal(result.verdict, "misfiled");
  assert.equal(result.cubbyMisfiled, true);
  assert.notEqual(result.expectedCachePath, result.injectedCachePath);
  assert.equal(result.ancestorWalkUp, false);
  assert.equal(result.issue, WRONG_HASH_ISSUE);
  assert.equal(result.alarm, true);
  assert.equal(result.linear, false);
  assert.equal(result.stowed, false);
  assert.match(result.feed, /Misfiled|project-hash/i);
  assert.equal(decideSeed("misfiled").verdict, "misfiled");
});

test("7 stale: same cubby, files missing, no safety-rule exclusive", () => {
  const result = decide(seedStale());
  assert.equal(result.verdict, "stale");
  assert.equal(result.cubbyStale, true);
  assert.equal(result.expectedCachePath, result.injectedCachePath);
  assert.equal(result.injectedMissingFileCount, DEMO_MISSING_FILE_COUNT);
  assert.equal(result.safetyRuleInAuthoritativeOnly, false);
  assert.equal(result.alarm, true);
  assert.equal(result.linear, false);
  assert.equal(result.stowed, false);
  assert.match(result.feed, /Stale|files missing|mirror/i);
  assert.equal(decideSeed("stale").verdict, "stale");
});

test("8 ghosted: Non-ASCII slug / wrong project hash", () => {
  const result = decide(seedGhosted());
  assert.equal(result.verdict, "ghosted");
  assert.equal(result.cubbyGhosted, true);
  assert.equal(result.nonAsciiSlugCorrupt, true);
  assert.equal(result.wrongProjectHash, true);
  assert.equal(result.issue, NON_ASCII_ISSUE);
  assert.equal(result.alarm, true);
  assert.equal(result.linear, true);
  assert.equal(result.stowed, false);
  assert.match(result.feed, /Ghosted|#76617|#89915/);
  assert.equal(decideSeed("ghosted").verdict, "ghosted");
});

test("9 mirrored-fail: Read wrong scope / path-scoped unreachable", () => {
  const result = decide(seedMirroredFail());
  assert.equal(result.verdict, "mirrored-fail");
  assert.equal(result.cubbyMirroredFail, true);
  assert.equal(result.pathScopedUnreachable, true);
  assert.equal(result.readReturnedWrongScope, true);
  assert.equal(result.issue, READ_WRONG_SCOPE_ISSUE);
  assert.equal(result.alarm, true);
  assert.equal(result.linear, false);
  assert.equal(result.stowed, false);
  assert.match(result.feed, /Mirrored-fail|#85591|#88945/);
  assert.equal(decideSeed("mirrored-fail").verdict, "mirrored-fail");
});

test("10 unsurfaced: cache path never shown; stowed false", () => {
  const result = decide(seedUnsurfaced());
  assert.equal(result.verdict, "unsurfaced");
  assert.equal(result.cubbyUnsurfaced, true);
  assert.equal(result.cachePathSurfaced, false);
  assert.ok(result.injectedCachePath);
  assert.equal(result.alarm, false);
  assert.equal(result.slack, false);
  assert.equal(result.linear, false);
  assert.equal(result.stowed, false);
  assert.match(result.feed, /Unsurfaced|never shown|directory diff/);
  assert.equal(decideSeed("unsurfaced").verdict, "unsurfaced");
});

test("11 restored: diagnostic surfaces path; stowed false", () => {
  const result = decide(seedRestored());
  assert.equal(result.verdict, "restored");
  assert.equal(result.cubbyRestored, true);
  assert.equal(result.restoredDiagnostic, true);
  assert.equal(result.cachePathSurfaced, true);
  assert.equal(result.alarm, false);
  assert.equal(result.slack, false);
  assert.equal(result.linear, false);
  assert.equal(result.stowed, false);
  assert.match(result.feed, /Restored|re-resolve|diagnostic/);
  assert.equal(decideSeed("restored").verdict, "restored");
});

test("12 score() idle cubby is stowed and never alarms", () => {
  const result = score(emptyCubby());
  assertScoreShape(result);
  assert.equal(result.verdict, "stowed");
  assert.equal(result.slack, false);
  assert.equal(result.alarm, false);
  assert.equal(result.stowed, true);
  assert.equal(result.invisible, false);
});

test("13 verdict vocabulary is exactly the ten words", () => {
  assert.deepEqual(VERDICTS, [
    "stowed",
    "misfiled",
    "ancestor",
    "stale",
    "invisible",
    "walked-up",
    "unsurfaced",
    "ghosted",
    "mirrored-fail",
    "restored",
  ]);
  assert.deepEqual(SLACK_VERDICTS, [
    "misfiled",
    "ancestor",
    "stale",
    "invisible",
    "walked-up",
    "ghosted",
    "mirrored-fail",
  ]);
  assert.deepEqual(LINEAR_VERDICTS, ["invisible", "ancestor", "walked-up", "ghosted"]);
  assert.deepEqual(ALARM_VERDICTS, SLACK_VERDICTS);
  assert.equal(IDLE_WORD, "stowed");
  assert.doesNotMatch(IDLE_WORD, /cubby$|posted|bunged|silent/);
});

test("14 every seeded class classifies to itself", () => {
  const rows = [
    ["stowed", seedReset],
    ["invisible", seedInvisible],
    ["ancestor", seedAncestor],
    ["walked-up", seedWalkedUp],
    ["misfiled", seedMisfiled],
    ["stale", seedStale],
    ["ghosted", seedGhosted],
    ["mirrored-fail", seedMirroredFail],
    ["unsurfaced", seedUnsurfaced],
    ["restored", seedRestored],
  ];
  for (const [word, seed] of rows) {
    assert.equal(decide(seed()).verdict, word, word);
    assert.equal(classify(seed().cubby), word, word);
    assert.equal(score(seed().cubby).verdict, word, word);
  }
});

test("15 admit does not lie: invisible stays invisible; ancestor stays ancestor", () => {
  const invisible = decide({ ...seedInvisible(), action: "admit" });
  assert.equal(invisible.verdict, "invisible");
  assert.equal(invisible.action, "admit");
  assert.equal(invisible.stowed, false);
  assert.doesNotMatch(invisible.verdict, /stowed/);
  const ancestor = decide({ ...seedAncestor(), action: "admit" });
  assert.equal(ancestor.verdict, "ancestor");
  const walked = decide({ ...seedWalkedUp(), action: "admit" });
  assert.equal(walked.verdict, "walked-up");
});

test("16 bail / stowed / reset returns idle stowed", () => {
  const bailed = decide({ ...seedInvisible(), action: "bail" });
  assert.equal(bailed.verdict, "stowed");
  assert.equal(isIdle(bailed.cubby), true);
  assertIdleNeverCubby(bailed);
  assert.equal(decide({ action: "reset" }).verdict, "stowed");
  assert.equal(decide({ action: "stowed" }).verdict, "stowed");
  assert.equal(decide(seedReset()).verdict, "stowed");
  assert.equal(decide(seedStowed()).verdict, "stowed");
});

test("17 restore / invisible produces the #90604 invisible wall", () => {
  const result = decide({ action: "restore", cubby: emptyCubby() });
  assert.equal(result.verdict, "invisible");
  assert.equal(result.action, "restore");
  assert.equal(result.issue, FEATURED_ISSUE);
  assert.equal(result.stowed, false);
  assert.equal(decide({ action: "invisible" }).verdict, "invisible");
});

test("18 flagsOf matches slack / github; linear follows invisible/ancestor/walked-up/ghosted", () => {
  assert.deepEqual(flagsOf("invisible"), { slack: true, linear: true, github: true, alarm: true });
  assert.deepEqual(flagsOf("ancestor"), { slack: true, linear: true, github: true, alarm: true });
  assert.deepEqual(flagsOf("walked-up"), { slack: true, linear: true, github: true, alarm: true });
  assert.deepEqual(flagsOf("ghosted"), { slack: true, linear: true, github: true, alarm: true });
  assert.deepEqual(flagsOf("misfiled"), { slack: true, linear: false, github: true, alarm: true });
  assert.deepEqual(flagsOf("stale"), { slack: true, linear: false, github: true, alarm: true });
  assert.deepEqual(flagsOf("mirrored-fail"), { slack: true, linear: false, github: true, alarm: true });
  assert.deepEqual(flagsOf("unsurfaced"), { slack: false, linear: false, github: true, alarm: false });
  assert.deepEqual(flagsOf("restored"), { slack: false, linear: false, github: true, alarm: false });
  assert.deepEqual(flagsOf("stowed"), { slack: false, linear: false, github: true, alarm: false });
});

test("19 helpers, reasons, analyze, priority", () => {
  assert.equal(invisibleOf(seedInvisible().cubby), true);
  assert.equal(stowedOf(emptyCubby()), true);
  assert.equal(stowedOf(seedInvisible().cubby), false);
  assert.equal(stowedOf(seedControl().cubby), true);
  assert.equal(stowedOf(seedRestored().cubby), false);
  const reasons = reasonsOf(seedInvisible().cubby, "invisible");
  assert.ok(reasons.some((row) => /#90604/.test(row)));
  const facts = analyze(seedInvisible().cubby);
  assert.equal(facts.invisibleShape, true);
  assert.equal(classify(seedInvisible().cubby), "invisible");
  assert.equal(classify(seed90604().cubby), "invisible");
  assert.equal(classify(seedAncestor().cubby), "ancestor");
  assert.equal(classify(seedWalkedUp().cubby), "walked-up");
});

test("20 forbidden idle list includes cubby, empty, leftover names", () => {
  const words = forbiddenIdleWords();
  assert.ok(words.includes("cubby"));
  assert.ok(words.includes("empty"));
  assert.ok(words.includes("silent"));
  assert.ok(words.includes("mute"));
  assert.ok(words.includes("posted"));
  assert.ok(words.includes("sorter"));
  assert.ok(words.includes("grille"));
  assert.ok(words.includes("ullage"));
  assert.ok(!words.includes("stowed"));
});

test("21 demo sinks: Slack on alarm; Linear on invisible; GitHub always", async () => {
  const invisible = decide(seedInvisible());
  const slack = slackCubbyAlarm(invisible, {});
  assert.equal(slack.mode, "demo");
  assert.match(slack.summary, /Would post to Slack/);
  assert.ok(Array.isArray(slack.body.blocks));
  const github = githubCubbyLedger(invisible, {});
  assert.equal(github.mode, "demo");
  assert.match(github.summary, /Would open a GitHub cubby-ledger/);
  const linear = linearCubbyTicket(invisible, {});
  assert.equal(linear.mode, "demo");
  assert.match(linear.summary, /Would open a Linear ticket/);
  const honest = decide(seedControl());
  assert.match(linearCubbyTicket(honest, {}).summary, /Would skip Linear/);
  const idle = decide(emptyAction("idle"));
  assert.match(slackCubbyAlarm(idle, {}).summary, /Would skip Slack/);
  const fired = await fire(invisible, {});
  assert.equal(fired.events.length, 3);
  assert.ok(fired.events.every((row) => row.ok === true));
});

test("22 Slack live plan uses SLACK_WEBHOOK alias and GITHUB_TOKEN alias", () => {
  const invisible = decide(seedInvisible());
  const slack = slackCubbyAlarm(invisible, { SLACK_WEBHOOK: "https://hooks.example/y" });
  assert.equal(slack.mode, "live");
  const github = githubCubbyLedger(invisible, { GITHUB_TOKEN: "tok" });
  assert.equal(github.mode, "live");
  const linear = linearCubbyTicket(invisible, { LINEAR_API_KEY: "lin" });
  assert.equal(linear.mode, "live");
});

test("23 handle alarm classes deny; stowed / control / unsurfaced / restored allow", async () => {
  const invisible = await handle(seedInvisible(), {});
  assert.equal(invisible.permissionDecision, "deny");
  assert.match(invisible.hookSpecificOutput.decision.message, /invisible/);
  assert.equal((await handle(seedAncestor(), {})).permissionDecision, "deny");
  assert.equal((await handle(seedWalkedUp(), {})).permissionDecision, "deny");
  assert.equal((await handle(seedMisfiled(), {})).permissionDecision, "deny");
  assert.equal((await handle(seedStale(), {})).permissionDecision, "deny");
  assert.equal((await handle(seedGhosted(), {})).permissionDecision, "deny");
  assert.equal((await handle(seedMirroredFail(), {})).permissionDecision, "deny");
  const idle = await handle({ action: "bail" }, {});
  assert.equal(idle.permissionDecision, "allow");
  assert.match(idle.hookSpecificOutput.decision.message, /stowed/);
  assert.equal((await handle(seedControl(), {})).permissionDecision, "allow");
  assert.equal((await handle(seedUnsurfaced(), {})).permissionDecision, "allow");
  assert.equal((await handle(seedRestored(), {})).permissionDecision, "allow");
  assert.equal((await handle(seedReset(), {})).permissionDecision, "allow");
});

test("24 listen GET health and POST empty body is stowed", async () => {
  const server = listen(19895);
  await new Promise((resolve) => server.once("listening", resolve));
  const health = await fetch("http://127.0.0.1:19895/health");
  const info = await health.json();
  assert.equal(info.product, "cubby");
  assert.match(info.verbs, /invisible/);
  const res = await fetch("http://127.0.0.1:19895/", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: "{}",
  });
  const body = await res.json();
  assert.equal(body.verdict, "stowed");
  assert.equal(body.idleWord, "stowed");
  const scored = await fetch("http://127.0.0.1:19895/", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(seedInvisible()),
  });
  const scoredBody = await scored.json();
  assert.equal(scoredBody.verdict, "invisible");
  await new Promise((resolve) => server.close(resolve));
});

test("25 listen rejects non-JSON verbs besides health", async () => {
  const server = listen(19896);
  await new Promise((resolve) => server.once("listening", resolve));
  const put = await fetch("http://127.0.0.1:19896/", { method: "PUT" });
  assert.equal(put.status, 405);
  await new Promise((resolve) => server.close(resolve));
});

test("26 parseSessionTrace reads a #90604 invisible report", () => {
  const cubby = parseSessionTrace(
    "never git push origin main without go-ahead. safety rule missed. injected from ancestor cache. #90604 invisible.",
  );
  assert.equal(classify(cubby), "invisible");
});

test("27 parseSessionTrace reads ancestor, walked-up, ghosted", () => {
  assert.equal(
    classify(parseSessionTrace("ancestor-encoded walked up to an ancestor #53734")),
    "ancestor",
  );
  assert.equal(
    classify(parseSessionTrace("walked-up CWD vs git-root #52772 prompt path and /memory")),
    "walked-up",
  );
  assert.equal(
    classify(parseSessionTrace("ghosted Non-ASCII #76617 wrong project hash #89915")),
    "ghosted",
  );
});

test("28 score() accepts the documented probe shape", () => {
  const result = score({
    session: "demo",
    issue: 90604,
    source: "hook",
    cwd: DEMO_CWD,
    gitRoot: DEMO_CWD,
    expectedCachePath: DEMO_EXPECTED_CACHE,
    injectedCachePath: DEMO_INJECTED_CACHE,
    ancestorWalkUp: true,
    cwdVsGitRootSplit: false,
    authoritativeMemoryPath: "/home/user/source/soft-shop/memory/",
    injectedMissingFileCount: 247,
    safetyRuleInAuthoritativeOnly: true,
    cachePathSurfaced: false,
    nonAsciiSlugCorrupt: false,
    wrongProjectHash: false,
    pathScopedUnreachable: false,
    readReturnedWrongScope: false,
    restoredDiagnostic: false,
    scored: false,
  });
  assert.equal(result.verdict, "invisible");
  assert.equal(result.stowed, false);
  const hold = score({
    cwd: DEMO_CWD,
    gitRoot: DEMO_CWD,
    expectedCachePath: DEMO_EXPECTED_CACHE,
    injectedCachePath: DEMO_EXPECTED_CACHE,
    cachePathSurfaced: true,
  });
  assert.equal(hold.verdict, "stowed");
  assert.equal(hold.stowed, true);
});

test("29 nested cubby / probe fields clone", () => {
  const cubby = cloneCubby({ probe: seedInvisible().cubby });
  assert.equal(classify(cubby), "invisible");
});

test("30 fire live slack posts when fetch ok", async () => {
  const invisible = decide(seedInvisible());
  const events = await fire(
    invisible,
    { CUBBY_SLACK_WEBHOOK: "https://hooks.example/x" },
    async () => ({
      ok: true,
      status: 200,
      json: async () => ({}),
    }),
  );
  const slack = events.events.find((row) => row.adapter === "slack");
  assert.equal(slack.ok, true);
  assert.match(slack.summary, /Posted invisible/);
});

test("31 mailroom HTML sanity: idle word stowed, seeded invisible, not teller/bung/type-case", () => {
  const html = readFileSync(fileURLToPath(new URL("../index.html", import.meta.url)), "utf8");
  assert.match(html, /stowed/);
  assert.match(html, /Score/);
  assert.match(html, /invisible/);
  assert.match(html, /90604/);
  assert.match(html, /seedOf\("invisible"\)|cubby = seedOf\("invisible"\)/);
  assert.match(html, /const IDLE_WORD = "stowed"/);
  assert.doesNotMatch(html, /const IDLE_WORD = "cubby"/);
  assert.doesNotMatch(html, /const IDLE_WORD = "posted"/);
  assert.doesNotMatch(html, /const IDLE_WORD = "empty"/);
  assert.doesNotMatch(html, /const IDLE_WORD = "bunged"/);
  assert.match(
    html,
    /mailroom-hall|cubby-wall|oak-bay|brass-nameplate|safety-envelope|ancestor-cubby|project-cubby|directory-lamp|mirror-stamp|cubby-rail|oak-grain|amber-slot/i,
  );
  assert.match(html, /02:50 Sydney · cubby/);
  assert.match(html, /stuffed cubby is not a hold/i);
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
  assert.doesNotMatch(html, /millimeter slider|millimetre slider/i);
  assert.match(html, /<title>Cubby/);
  assert.match(html, /Young Serif|Outfit|Red Hat Mono/);
  assert.match(html, /Reset · stowed|reset to stowed/i);
  assert.match(html, /Restore · #90604|restore to invisible/i);
  assert.match(html, /Admit stowed/);
});

test("32 HTML why-not names Ullage, Iota, Fob, Cinch, Wicket, Grille, Spile", () => {
  const html = readFileSync(fileURLToPath(new URL("../index.html", import.meta.url)), "utf8");
  assert.match(html, /NOT Ullage/);
  assert.match(html, /NOT Iota/);
  assert.match(html, /NOT Fob/);
  assert.match(html, /NOT Cinch/);
  assert.match(html, /NOT Wicket/);
  assert.match(html, /NOT Grille/);
  assert.match(html, /NOT Spile/);
  assert.match(html, /leftover/);
  assert.match(html, /millimeter-slider|millimetre-slider|millimeter slider|millimetre slider/);
});

test("33 README names contrasts and stowed idle", () => {
  const readme = readFileSync(fileURLToPath(new URL("../README.md", import.meta.url)), "utf8");
  assert.match(readme, /NOT \*\*Ullage\*\*|NOT Ullage|wrong \*directory\*/);
  assert.match(readme, /NOT \*\*Iota\*\*|NOT Iota/);
  assert.match(readme, /NOT \*\*Grille\*\*|NOT Grille/);
  assert.match(readme, /NOT \*\*Spile\*\*|NOT Spile/);
  assert.match(readme, /NOT \*\*Wicket\*\*|NOT Wicket/);
  assert.match(readme, /\*\*stowed\*\*/);
  assert.match(readme, /#90604/);
  assert.match(readme, /\/cubby\//);
  assert.doesNotMatch(readme, /idle word is cubby/i);
  assert.doesNotMatch(readme, /idle word is posted/i);
  assert.doesNotMatch(readme, /idle word is bunged/i);
});

test("34 seeded 90604 numbers produce invisible / stowed=false", () => {
  const invisible = score({
    cwd: DEMO_CWD,
    gitRoot: DEMO_CWD,
    expectedCachePath: DEMO_EXPECTED_CACHE,
    injectedCachePath: DEMO_INJECTED_CACHE,
    ancestorWalkUp: true,
    injectedMissingFileCount: 247,
    safetyRuleInAuthoritativeOnly: true,
    cachePathSurfaced: false,
  });
  assert.equal(invisible.verdict, "invisible");
  assert.equal(invisible.stowed, false);
  assert.equal(invisible.ancestorWalkUp, true);
  assert.equal(invisible.safetyRuleInAuthoritativeOnly, true);
});

test("35 control correct-cache path produces stowed=true; invisible never stowed", () => {
  const hold = score({
    cwd: DEMO_CWD,
    gitRoot: DEMO_CWD,
    expectedCachePath: DEMO_EXPECTED_CACHE,
    injectedCachePath: DEMO_EXPECTED_CACHE,
    cachePathSurfaced: true,
  });
  assert.equal(hold.verdict, "stowed");
  assert.equal(hold.stowed, true);
  const dead = score({
    cwd: DEMO_CWD,
    gitRoot: DEMO_CWD,
    expectedCachePath: DEMO_EXPECTED_CACHE,
    injectedCachePath: DEMO_INJECTED_CACHE,
    ancestorWalkUp: true,
    safetyRuleInAuthoritativeOnly: true,
    injectedMissingFileCount: 247,
    cachePathSurfaced: false,
  });
  assert.equal(dead.stowed, false);
  assert.equal(dead.verdict, "invisible");
});

test("36 Slack skip on stowed / control / unsurfaced / restored", () => {
  for (const seed of [seedReset, seedControl, seedUnsurfaced, seedRestored, seedStowed]) {
    const result = decide(seed());
    assert.equal(result.slack, false, result.verdict);
    assert.match(slackCubbyAlarm(result, {}).summary, /Would skip Slack/);
  }
});

test("37 invisible pentad wins over ancestor and stale", () => {
  const result = score({
    cwd: DEMO_CWD,
    gitRoot: DEMO_CWD,
    expectedCachePath: DEMO_EXPECTED_CACHE,
    injectedCachePath: DEMO_INJECTED_CACHE,
    ancestorWalkUp: true,
    injectedMissingFileCount: 247,
    safetyRuleInAuthoritativeOnly: true,
    cachePathSurfaced: false,
  });
  assert.equal(result.verdict, "invisible");
  assert.equal(result.stowed, false);
});

test("38 ancestor wins over misfiled when walk-up is set without the safety rule", () => {
  const result = decide(seedAncestor());
  assert.equal(result.verdict, "ancestor");
  assert.equal(result.ancestorWalkUp, true);
  assert.notEqual(result.expectedCachePath, result.injectedCachePath);
  assert.notEqual(result.verdict, "invisible");
  assert.notEqual(result.verdict, "misfiled");
});

test("39 admit still does not lie after invisible / ancestor", () => {
  const admitted = decide({ ...seedInvisible(), action: "admit" });
  assert.equal(admitted.verdict, "invisible");
  assert.equal(admitted.stowed, false);
  const ancestor = decide({ ...seedAncestor(), action: "admit" });
  assert.equal(ancestor.verdict, "ancestor");
  assert.equal(ancestor.stowed, false);
});

test("40 README and mailroom cite #90604 and same-class issues", () => {
  const readme = readFileSync(fileURLToPath(new URL("../README.md", import.meta.url)), "utf8");
  assert.match(readme, /90604/);
  assert.match(readme, /52772/);
  assert.match(readme, /53734/);
  assert.match(readme, /89915/);
  assert.match(readme, /90046/);
  assert.match(readme, /85591/);
  assert.match(readme, /88945/);
  assert.match(readme, /76617/);
  assert.match(readme, /16799/);
  assert.doesNotMatch(readme, /idle word is cubby |idle word is sorter|idle word is posted/i);
  const html = readFileSync(fileURLToPath(new URL("../index.html", import.meta.url)), "utf8");
  assert.match(html, /soft-shop|never git push origin main|# auto memory/);
  assert.match(html, /52772/);
  assert.match(html, /53734/);
  assert.match(html, /89915/);
  assert.match(html, /90046/);
  assert.match(html, /85591/);
  assert.match(html, /16799/);
});
