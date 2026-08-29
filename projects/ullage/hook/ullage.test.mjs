import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  fire,
  githubUllageLedger,
  linearWasteTicket,
  slackThrashAlarm,
} from "./adapters.mjs";
import {
  ALARM_VERDICTS,
  IDLE_WORD,
  LINEAR_WASTE_THRESHOLD,
  PREFIX_EXAMPLE,
  SLACK_VERDICTS,
  VERDICTS,
  WEIGHTS,
  analyze,
  classify,
  cloneCask,
  clusterOf,
  decide,
  decideSeed,
  emptyAction,
  emptyCask,
  feedOf,
  flagsOf,
  forbiddenIdleWords,
  isIdle,
  parseSessionTrace,
  reasonsOf,
  score,
  seedBunged,
  seedControl,
  seedDoubled,
  seedFrozen,
  seedGauged,
  seedHealed,
  seedLeaked,
  seedRewritten,
  seedSilent,
  seedThrashed,
  seedUllaged,
  seed90509,
  thrashedOf,
  ullagedOf,
  verdictOf,
  weightedTokensOf,
} from "./ullage.mjs";
import { handle, listen } from "./index.mjs";

function assertIdleNeverUllage(result) {
  assert.equal(result.idleWord, "gauged");
  assert.equal(IDLE_WORD, "gauged");
  assert.doesNotMatch(result.idleWord, /ullage/i);
  assert.doesNotMatch(IDLE_WORD, /ullage/i);
  assert.doesNotMatch(result.idleWord, /empty|compact|cache|leak/i);
  assert.doesNotMatch(
    result.idleWord,
    /stamped|overrun|pratique|bound|stilled|drained|flat|fit|spoilt|laid|unlinked|tight|banked|roosted|stocked|seated|heard|clear|paired|kernel|latched|upheld|sterling|home|valid|dry|sealed|quiet|seised|stabled|wound/,
  );
}

function assertScoreShape(result) {
  assert.equal(typeof result.verdict, "string");
  assert.ok(Array.isArray(result.reasons));
  assert.ok(Array.isArray(result.cluster));
  assert.equal(typeof result.gauged, "boolean");
  assert.equal(typeof result.ullaged, "boolean");
  assert.equal(typeof result.thrashed, "boolean");
  assert.equal(typeof result.feed, "string");
}

test("1 seed 90509 ullaged is ullaged, slack, idleWord gauged", () => {
  const seed = seedUllaged();
  const result = decide(seed);
  assert.equal(result.verdict, "ullaged");
  assert.equal(result.state, "ullaged");
  assert.equal(result.decision, "ullaged");
  assert.equal(classify(seed.cask), "ullaged");
  assert.equal(verdictOf(seed.cask), "ullaged");
  assert.notEqual(result.verdict, "gauged");
  assert.notEqual(result.verdict, "rewritten");
  assert.equal(result.alarm, true);
  assert.equal(result.slack, true);
  assert.equal(result.github, true);
  assert.equal(result.cellarUllaged, true);
  assert.equal(result.ullaged, true);
  assert.equal(result.gauged, false);
  assertIdleNeverUllage(result);
  assert.equal(result.session, "90509-ullaged");
  assert.equal(result.issue, 90509);
  assert.equal(result.dropSize, 157_023);
  assert.equal(result.ticketsPresent, false);
  assert.match(result.feed, /no compact ticket|primary #90509/i);
  assert.equal(decideSeed("ullaged").verdict, "ullaged");
  assert.equal(decideSeed("90509-ullaged").verdict, "ullaged");
});

test("2 idle/empty/{} is gauged, never the product name, never empty", () => {
  const result = decide(emptyAction("idle"));
  assert.equal(result.state, "gauged");
  assert.equal(result.verdict, "gauged");
  assert.equal(result.alarm, false);
  assert.equal(result.slack, false);
  assert.equal(result.gauged, true);
  assert.equal(classify({}), "gauged");
  assert.equal(classify(emptyCask()), "gauged");
  assert.equal(isIdle(emptyCask()), true);
  assertIdleNeverUllage(result);
  const bailed = decide({ action: "bail" });
  assert.equal(bailed.state, "gauged");
  assert.equal(bailed.idleWord, "gauged");
  const empty = decide({});
  assert.equal(empty.verdict, "gauged");
});

test("3 control session stays gauged", () => {
  const result = decide(seedControl());
  assert.equal(result.verdict, "gauged");
  assert.equal(result.alarm, false);
  assert.equal(result.dropSize, 0);
  assert.equal(result.freezeCount, 0);
  assert.match(result.feed, /Gauged/);
  assert.equal(decideSeed("control").verdict, "gauged");
  assert.equal(decideSeed("healthy").verdict, "gauged");
});

test("4 thrashed: 21 prefix-frozen rewrites after the #90509 drop", () => {
  const result = decide(seedThrashed());
  assert.equal(result.verdict, "thrashed");
  assert.equal(result.thrashed, true);
  assert.ok(result.freezeCount >= 21);
  assert.equal(result.prefixHint, PREFIX_EXAMPLE);
  assert.equal(result.alarm, true);
  assert.equal(result.slack, true);
  assert.ok(result.waste > LINEAR_WASTE_THRESHOLD);
  assert.equal(result.linear, true);
  assert.match(result.feed, /prefix-frozen|Thrashed/);
  assert.equal(decideSeed("thrashed").verdict, "thrashed");
});

test("5 frozen: cache_read pinned, not yet a cluster", () => {
  const result = decide(seedFrozen());
  assert.equal(result.verdict, "frozen");
  assert.equal(result.freezeCount, 2);
  assert.equal(result.alarm, true);
  assert.match(result.feed, /pinned|prefix/);
  assert.equal(decideSeed("frozen").verdict, "frozen");
  assert.equal(decideSeed(87966).verdict, "frozen");
});

test("6 rewritten: recorded compact then one rewrite, not ullaged", () => {
  const result = decide(seedRewritten());
  assert.equal(result.verdict, "rewritten");
  assert.notEqual(result.verdict, "ullaged");
  assert.notEqual(result.verdict, "thrashed");
  assert.equal(result.ticketsPresent, true);
  assert.equal(result.alarm, false);
  assert.match(result.feed, /recorded compact|expected/i);
  assert.equal(decideSeed("rewritten").verdict, "rewritten");
});

test("7 doubled: JSONL usage duplicated on message.id", () => {
  const result = decide(seedDoubled());
  assert.equal(result.verdict, "doubled");
  assert.ok(result.duplicates >= 2);
  assert.equal(result.alarm, false);
  assert.match(result.feed, /duplicated|message\.id/);
  assert.equal(decideSeed("doubled").verdict, "doubled");
});

test("8 healed: #90509 drop + 21 rewrites + self-heal", () => {
  const result = decide(seedHealed());
  assert.equal(result.verdict, "healed");
  assert.ok(result.recovered);
  assert.ok(result.freezeCount >= 21);
  assert.ok(result.cluster.includes("thrashed") || result.cluster.includes("ullaged"));
  assert.match(result.feed, /Healed|no user action/);
  assert.equal(decideSeed("healed").verdict, "healed");
  assert.equal(decideSeed(90509).verdict, "healed");
  assert.equal(classify(seed90509().cask), "healed");
});

test("9 silent: drop with empty error/compaction/context-edit records", () => {
  const result = decide(seedSilent());
  assert.equal(result.verdict, "silent");
  assert.equal(result.alarm, true);
  assert.match(result.feed, /empty error|Silent/);
  assert.equal(decideSeed("silent").verdict, "silent");
});

test("10 leaked: drop plus a slate missing this ticket", () => {
  const result = decide(seedLeaked());
  assert.equal(result.verdict, "leaked");
  assert.equal(result.ticketsPresent, true);
  assert.equal(result.dropSize, 157_023);
  assert.match(result.feed, /missing|Leaked/);
  assert.equal(decideSeed("leaked").verdict, "leaked");
});

test("11 bunged: freeze then cache_read recovers without a thrash cluster", () => {
  const result = decide(seedBunged());
  assert.equal(result.verdict, "bunged");
  assert.equal(result.recovered, true);
  assert.match(result.feed, /reseated|Bunged/);
  assert.equal(decideSeed("bunged").verdict, "bunged");
});

test("12 score() idle cask is gauged and never alarms", () => {
  const result = score(emptyCask());
  assertScoreShape(result);
  assert.equal(result.verdict, "gauged");
  assert.equal(result.slack, false);
  assert.equal(result.alarm, false);
  assert.equal(result.gauged, true);
  assert.equal(result.ullaged, false);
});

test("13 verdict vocabulary is exactly the ten words", () => {
  assert.deepEqual(VERDICTS, [
    "gauged",
    "ullaged",
    "thrashed",
    "frozen",
    "leaked",
    "rewritten",
    "doubled",
    "healed",
    "silent",
    "bunged",
  ]);
  assert.deepEqual(SLACK_VERDICTS, ["thrashed", "frozen", "ullaged", "leaked", "silent"]);
  assert.deepEqual(ALARM_VERDICTS, SLACK_VERDICTS);
  assert.equal(IDLE_WORD, "gauged");
  assert.doesNotMatch(IDLE_WORD, /ullage|empty|stamped|overrun/);
});

test("14 every seeded class classifies to itself", () => {
  const rows = [
    ["gauged", seedGauged],
    ["ullaged", seedUllaged],
    ["thrashed", seedThrashed],
    ["frozen", seedFrozen],
    ["rewritten", seedRewritten],
    ["doubled", seedDoubled],
    ["healed", seedHealed],
    ["silent", seedSilent],
    ["leaked", seedLeaked],
    ["bunged", seedBunged],
  ];
  for (const [word, seed] of rows) {
    assert.equal(decide(seed()).verdict, word, word);
    assert.equal(classify(seed().cask), word, word);
    assert.equal(score(seed().cask).verdict, word, word);
  }
});

test("15 admit does not lie: ullaged stays ullaged", () => {
  const result = decide({ ...seedUllaged(), action: "admit" });
  assert.equal(result.verdict, "ullaged");
  assert.equal(result.action, "admit");
  assert.doesNotMatch(result.verdict, /gauged/);
});

test("16 bail / gauged / reset returns idle gauged", () => {
  const bailed = decide({ ...seedUllaged(), action: "bail" });
  assert.equal(bailed.verdict, "gauged");
  assert.equal(isIdle(bailed.cask), true);
  assertIdleNeverUllage(bailed);
  assert.equal(decide({ action: "reset" }).verdict, "gauged");
  assert.equal(decide({ action: "gauged" }).verdict, "gauged");
});

test("17 restore / ullaged produces the #90509 drop", () => {
  const result = decide({ action: "restore", cask: emptyCask() });
  assert.equal(result.verdict, "ullaged");
  assert.equal(result.action, "restore");
  assert.equal(result.dropSize, 157_023);
  assert.equal(decide({ action: "ullaged" }).verdict, "ullaged");
});

test("18 weighted waste uses input×1 + cache_read×0.1 + cache_creation×2 + output×5", () => {
  assert.deepEqual(WEIGHTS, { input: 1, cacheRead: 0.1, cacheCreation: 2, output: 5 });
  const row = {
    input: 10,
    cacheRead: 100,
    cacheCreation: 20,
    output: 4,
  };
  assert.equal(weightedTokensOf(row), 10 + 10 + 40 + 20);
  const facts = analyze(seedThrashed().cask);
  assert.ok(facts.waste > 20_000_000);
});

test("19 dedupe by message.id before scoring waste", () => {
  const facts = analyze(seedDoubled().cask);
  assert.ok(facts.duplicates >= 2);
  assert.ok(facts.rawCount > facts.turns.length);
  assert.ok(facts.naiveWeighted > facts.honestWeighted);
});

test("20 recorded compact is not ullage", () => {
  assert.equal(classify(seedRewritten().cask), "rewritten");
  const facts = analyze(seedRewritten().cask);
  assert.equal(facts.unexplainedDrop, false);
  assert.equal(facts.recordedCompact, true);
  assert.equal(facts.rewriteAfterCompact, true);
});

test("21 flagsOf matches slack / github; linear follows waste", () => {
  assert.deepEqual(flagsOf("ullaged", { waste: 0 }), {
    slack: true,
    linear: false,
    github: true,
    alarm: true,
  });
  assert.deepEqual(flagsOf("thrashed", { waste: LINEAR_WASTE_THRESHOLD }), {
    slack: true,
    linear: true,
    github: true,
    alarm: true,
  });
  assert.deepEqual(flagsOf("gauged", { waste: 0 }), {
    slack: false,
    linear: false,
    github: true,
    alarm: false,
  });
});

test("22 helpers and cluster", () => {
  assert.equal(ullagedOf(seedUllaged().cask), true);
  assert.equal(thrashedOf(seedThrashed().cask), true);
  assert.equal(ullagedOf(emptyCask()), false);
  const cluster = clusterOf(seedHealed().cask, "healed");
  assert.ok(cluster.includes("thrashed") || cluster.includes("ullaged"));
});

test("23 forbidden idle list includes ullage, empty, leftover names", () => {
  const words = forbiddenIdleWords();
  assert.ok(words.includes("ullage"));
  assert.ok(words.includes("empty"));
  assert.ok(words.includes("stamped"));
  assert.ok(words.includes("visa"));
  assert.ok(words.includes("fathom"));
  assert.ok(words.includes("quench"));
  assert.ok(words.includes("coda"));
  assert.ok(!words.includes("gauged"));
});

test("24 demo sinks: Slack on alarm; Linear on waste; GitHub always", async () => {
  const thrashed = decide(seedThrashed());
  const slack = slackThrashAlarm(thrashed, {});
  assert.equal(slack.mode, "demo");
  assert.match(slack.summary, /Would post to Slack/);
  const github = githubUllageLedger(thrashed, {});
  assert.equal(github.mode, "demo");
  assert.match(github.summary, /Would open a GitHub ullage-ledger/);
  const linear = linearWasteTicket(thrashed, {});
  assert.equal(linear.mode, "demo");
  assert.match(linear.summary, /Would open a Linear ticket/);
  const honest = decide(seedControl());
  assert.match(linearWasteTicket(honest, {}).summary, /Would skip Linear/);
  const idle = decide(emptyAction("idle"));
  assert.match(slackThrashAlarm(idle, {}).summary, /Would skip Slack/);
  const fired = await fire(thrashed, {});
  assert.equal(fired.events.length, 3);
  assert.ok(fired.events.every((row) => row.ok === true));
});

test("25 Slack live plan uses SLACK_WEBHOOK alias and GITHUB_TOKEN alias", () => {
  const thrashed = decide(seedThrashed());
  const slack = slackThrashAlarm(thrashed, { SLACK_WEBHOOK: "https://hooks.example/y" });
  assert.equal(slack.mode, "live");
  const github = githubUllageLedger(thrashed, { GITHUB_TOKEN: "tok" });
  assert.equal(github.mode, "live");
  const linear = linearWasteTicket(thrashed, { LINEAR_API_KEY: "lin" });
  assert.equal(linear.mode, "live");
});

test("26 handle alarm classes deny; gauged / rewritten / doubled / healed / bunged allow", async () => {
  const ullaged = await handle(seedUllaged(), {});
  assert.equal(ullaged.permissionDecision, "deny");
  assert.match(ullaged.hookSpecificOutput.decision.message, /ullaged/);
  const thrashed = await handle(seedThrashed(), {});
  assert.equal(thrashed.permissionDecision, "deny");
  const frozen = await handle(seedFrozen(), {});
  assert.equal(frozen.permissionDecision, "deny");
  const idle = await handle({ action: "bail" }, {});
  assert.equal(idle.permissionDecision, "allow");
  assert.match(idle.hookSpecificOutput.decision.message, /gauged/);
  assert.equal((await handle(seedRewritten(), {})).permissionDecision, "allow");
  assert.equal((await handle(seedDoubled(), {})).permissionDecision, "allow");
  assert.equal((await handle(seedHealed(), {})).permissionDecision, "allow");
  assert.equal((await handle(seedBunged(), {})).permissionDecision, "allow");
});

test("27 listen GET health and POST empty body is gauged", async () => {
  const server = listen(19404);
  await new Promise((resolve) => server.once("listening", resolve));
  const health = await fetch("http://127.0.0.1:19404/health");
  const info = await health.json();
  assert.equal(info.product, "ullage");
  assert.match(info.verbs, /ullaged/);
  const res = await fetch("http://127.0.0.1:19404/", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: "{}",
  });
  const body = await res.json();
  assert.equal(body.verdict, "gauged");
  assert.equal(body.idleWord, "gauged");
  const scored = await fetch("http://127.0.0.1:19404/", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(seedUllaged()),
  });
  const scoredBody = await scored.json();
  assert.equal(scoredBody.verdict, "ullaged");
  await new Promise((resolve) => server.close(resolve));
});

test("28 listen rejects non-JSON and GET-only verbs besides health", async () => {
  const server = listen(19405);
  await new Promise((resolve) => server.once("listening", resolve));
  const put = await fetch("http://127.0.0.1:19405/", { method: "PUT" });
  assert.equal(put.status, 405);
  await new Promise((resolve) => server.close(resolve));
});

test("29 parseSessionTrace reads #90509 prose", () => {
  const cask = parseSessionTrace(
    "Context silently loses 157,023 tokens (829,414 → 672,391) at 06:17:43. 21 full-context rewrites. cache_read was exactly 45,659. self-heal. #90509",
  );
  assert.equal(classify(cask), "healed");
  assert.equal(cask.issue, 90509);
});

test("30 parseSessionTrace reads a recorded compact as rewritten", () => {
  const cask = parseSessionTrace(
    "recorded compactMetadata auto-compaction dropped to 10-12k and recovered cleanly, then recovery after one rewrite",
  );
  assert.equal(classify(cask), "rewritten");
});

test("31 nested cellar / probe / trace fields clone", () => {
  const cask = cloneCask({
    cellar: seedUllaged().cask,
  });
  assert.equal(classify(cask), "ullaged");
});

test("32 fire live slack posts when fetch ok", async () => {
  const thrashed = decide(seedThrashed());
  const events = await fire(thrashed, { ULLAGE_SLACK_WEBHOOK: "https://hooks.example/x" }, async () => ({
    ok: true,
    status: 200,
    json: async () => ({}),
  }));
  const slack = events.events.find((row) => row.adapter === "slack");
  assert.equal(slack.ok, true);
  assert.match(slack.summary, /Posted thrashed/);
});

test("33 desk HTML sanity: idle word gauged, seeded ullaged, not visa/sprag", () => {
  const html = readFileSync(fileURLToPath(new URL("../index.html", import.meta.url)), "utf8");
  assert.match(html, /gauged/);
  assert.match(html, /Score/);
  assert.match(html, /ullaged/);
  assert.match(html, /90509/);
  assert.match(html, /seedOf\("ullaged"\)|probe = seedOf\("ullaged"\)|cask = seedOf\("ullaged"\)/);
  assert.match(html, /const IDLE_WORD = "gauged"/);
  assert.doesNotMatch(html, /const IDLE_WORD = "ullage"/);
  assert.doesNotMatch(html, /const IDLE_WORD = "stamped"/);
  assert.match(html, /oak-cask|iron-hoop|bung-seal|gauging-rod|ticket-slate|double-entry/i);
  assert.match(html, /14:50 Sydney · ullage/);
  assert.match(html, /missing compaction ticket is not a hold/i);
  assert.doesNotMatch(html, /class="passport-folio"|class="brass-stamp"|class="teal-stripe"|class="ink-pad"/);
  assert.doesNotMatch(html, /class="clutch-cut"|class="inner-race"|class="sprag-wedge"/);
  assert.doesNotMatch(html, /class="oak-case"|class="fusee-drum"|class="enamel-face"/);
  assert.doesNotMatch(html, /Libre Baskerville|Source Sans 3/);
  assert.doesNotMatch(html, /Teko|Atkinson Hyperlegible|Bodoni Moda/);
  assert.doesNotMatch(html, /millimeter slider|millimetre slider/i);
  assert.match(html, /<title>Ullage/);
  assert.match(html, /Barlow Condensed|Fraunces/);
  assert.match(html, /reset-to-gauged|Reset · gauged|reset to gauged/i);
  assert.match(html, /restore-to-ullaged|Restore · ullaged|restore to ullaged/i);
});

test("34 HTML why-not names Fathom, Quench, Coda, Visa, Sprag, leftover", () => {
  const html = readFileSync(fileURLToPath(new URL("../index.html", import.meta.url)), "utf8");
  assert.match(html, /NOT Fathom/);
  assert.match(html, /NOT Quench/);
  assert.match(html, /NOT Coda/);
  assert.match(html, /NOT Visa/);
  assert.match(html, /NOT Sprag/);
  assert.match(html, /leftover/);
  assert.match(html, /millimeter-slider|millimetre-slider|millimeter slider|millimetre slider/);
  assert.doesNotMatch(html, /Ullage is a passport/i);
  assert.doesNotMatch(html, /Ullage is a clutch/i);
});

test("35 README names contrasts and gauged idle", () => {
  const readme = readFileSync(fileURLToPath(new URL("../README.md", import.meta.url)), "utf8");
  assert.match(readme, /NOT Fathom/);
  assert.match(readme, /NOT Quench/);
  assert.match(readme, /NOT Coda/);
  assert.match(readme, /NOT Visa/);
  assert.match(readme, /NOT Sprag/);
  assert.match(readme, /\*\*gauged\*\*/);
  assert.match(readme, /#90509/);
  assert.match(readme, /cache_read×0\.1|cache_read×0.1/);
  assert.doesNotMatch(readme, /idle word is ullage/i);
  assert.doesNotMatch(readme, /idle word is stamped/i);
});

test("36 #90509 miniature has 829k → 157k drop → prefix 45659 → heal", () => {
  const facts = analyze(seedHealed().cask);
  assert.ok(facts.unexplained.some((row) => row.size === 157_023));
  assert.equal(facts.prefixHint, 45_659);
  assert.ok(facts.freezeCount >= 21);
  assert.equal(facts.recovered, true);
  assert.ok(facts.chalked >= 829_414);
});

test("37 Slack skip on gauged / rewritten / doubled / healed / bunged", () => {
  for (const seed of [seedGauged, seedControl, seedRewritten, seedDoubled, seedHealed, seedBunged]) {
    const result = decide(seed());
    assert.equal(result.slack, false, result.verdict);
    assert.match(slackThrashAlarm(result, {}).summary, /Would skip Slack/);
  }
});
