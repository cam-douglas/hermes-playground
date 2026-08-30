import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  fire,
  githubWaifLedger,
  linearWaifTicket,
  slackWaifAlarm,
} from "./adapters.mjs";
import {
  ALARM_VERDICTS,
  CODEX_RG_ORPHAN,
  CODEX_WIN_ORPHAN,
  CODEX_WSL_ORPHAN,
  CODEX_ZSH_CPU,
  DEMO_CHILD_COUNT,
  DEMO_COMMAND,
  DEMO_CPU_PCT,
  DEMO_DEFENDER_RSS,
  DEMO_MODEL_SAW,
  DEMO_PLATFORM_POSIX,
  DEMO_PLATFORM_WIN,
  FEATURED_ISSUE,
  IDLE_WORD,
  LINEAR_VERDICTS,
  NEARBY_76056,
  NEARBY_76353,
  NEARBY_78030,
  NEARBY_79727,
  NEARBY_82433,
  NEARBY_84464,
  NEARBY_84647,
  NEARBY_85200,
  RELATED_BERTH,
  RELATED_GAFF,
  SLACK_VERDICTS,
  VERDICTS,
  analyze,
  classify,
  cloneWaif,
  decide,
  decideSeed,
  emptyAction,
  emptyWaif,
  feedOf,
  forbiddenIdleWords,
  isIdle,
  isOffWard,
  parseBashTimeout,
  parseWaifJson,
  reasonsOf,
  score,
  seed78030,
  seed76353,
  seed82433,
  seed90672,
  seedAbandoned,
  seedControl,
  seedDefenderLoad,
  seedGroupUnkilled,
  seedJobMissing,
  seedOffWardBerth,
  seedOffWardGaff,
  seedOrphaned,
  seedParentDead,
  seedReset,
  seedSheltered,
  seedTaskkillSkipped,
  seedTimeoutSeen,
  seedTreeAlive,
  shelteredOf,
  verdictOf,
} from "./waif.mjs";
import { handle, listen } from "./index.mjs";

const PRIOR_IDLES =
  /empty|silent|mute|idle|alongside|seated|credited|level|verbatim|fronted|locked|yanked|caught|stowed|posted|bunged|belayed|rove|keyed|housed|beamed|snug|hung|appointed|cinched|gauged|stamped|overrun|pratique|wound|bound|stilled|stabled|drained|flat|fit|spoilt|laid|unlinked|tight|banked|roosted|stocked|heard|clear|paired|kernel|latched|upheld|sterling|home|valid|dry|quiet|seised|rung|moored|claimed|adopted|warded|reaped|^orphaned$/;

function assertIdleNeverWaif(result) {
  assert.equal(result.idleWord, "sheltered");
  assert.equal(IDLE_WORD, "sheltered");
  assert.doesNotMatch(result.idleWord, /waif/i);
  assert.doesNotMatch(IDLE_WORD, /^waif$/i);
  assert.doesNotMatch(result.idleWord, PRIOR_IDLES);
}

function assertScoreShape(result) {
  assert.equal(typeof result.verdict, "string");
  assert.ok(Array.isArray(result.reasons));
  assert.equal(typeof result.sheltered, "boolean");
  assert.equal(typeof result.feed, "string");
}

test("1 seed 90672 abandoned is abandoned, slack, linear, idleWord sheltered, never sheltered", () => {
  const seed = seedAbandoned();
  const result = decide(seed);
  assert.equal(result.verdict, "abandoned");
  assert.equal(result.state, "abandoned");
  assert.equal(result.decision, "abandoned");
  assert.equal(classify(seed.waif), "abandoned");
  assert.equal(verdictOf(seed.waif), "abandoned");
  assert.notEqual(result.verdict, "sheltered");
  assert.equal(result.alarm, true);
  assert.equal(result.slack, true);
  assert.equal(result.linear, true);
  assert.equal(result.github, true);
  assert.equal(result.abandoned, true);
  assert.equal(result.sheltered, false);
  assertIdleNeverWaif(result);
  assert.equal(result.session, "90672-abandoned");
  assert.equal(result.issue, FEATURED_ISSUE);
  assert.equal(result.facts.timedOut, true);
  assert.equal(result.facts.parentAlive, false);
  assert.equal(result.facts.childCount, DEMO_CHILD_COUNT);
  assert.equal(result.facts.childrenWithDeadParent, DEMO_CHILD_COUNT);
  assert.equal(result.facts.modelSaw, DEMO_MODEL_SAW);
  assert.equal(result.facts.abandoned, true);
  assert.match(result.feed, /Abandoned|dead parent|primary #90672/i);
  assert.equal(decideSeed("abandoned").verdict, "abandoned");
  assert.equal(decideSeed("90672").verdict, "abandoned");
  assert.equal(decideSeed(90672).verdict, "abandoned");
  assert.equal(decide(seed90672()).verdict, "abandoned");
});

test("2 idle/empty/{} is sheltered, never the product name, never empty, never error", () => {
  const result = decide(emptyAction("idle"));
  assert.equal(result.state, "sheltered");
  assert.equal(result.verdict, "sheltered");
  assert.equal(result.alarm, false);
  assert.equal(result.slack, false);
  assert.equal(result.sheltered, true);
  assert.equal(classify({}), "sheltered");
  assert.equal(classify(emptyWaif()), "sheltered");
  assert.equal(isIdle(emptyWaif()), true);
  assert.equal(score(emptyWaif()).sheltered, true);
  assertIdleNeverWaif(result);
  const bailed = decide({ action: "bail" });
  assert.equal(bailed.state, "sheltered");
  assert.equal(bailed.idleWord, "sheltered");
  const empty = decide({});
  assert.equal(empty.verdict, "sheltered");
  assert.match(empty.feed, /Sheltered/);
});

test("3 honest sheltered hold: timeout killed the whole tree", () => {
  const result = decide(seedSheltered());
  assert.equal(result.verdict, "sheltered");
  assert.equal(result.alarm, false);
  assert.equal(result.sheltered, true);
  assert.equal(result.linear, false);
  assert.equal(result.facts.killed, true);
  assert.equal(result.facts.childCount, 0);
  assert.equal(result.facts.timedOut, true);
  assert.match(result.feed, /Sheltered|Job Object|process group|idle word is sheltered/i);
  assert.equal(decideSeed("control").verdict, "sheltered");
  assert.equal(decideSeed("healthy").verdict, "sheltered");
  assert.equal(decide(seedControl()).sheltered, true);
  assert.equal(shelteredOf(seedSheltered().waif), true);
});

test("4 sheltered must not be confused with abandoned, orphaned, or tree-alive", () => {
  const hold = decide(seedSheltered());
  const abandoned = decide(seedAbandoned());
  const orphaned = decide(seedOrphaned());
  const tree = decide(seedTreeAlive());
  assert.equal(hold.verdict, "sheltered");
  assert.equal(abandoned.verdict, "abandoned");
  assert.equal(orphaned.verdict, "orphaned");
  assert.equal(tree.verdict, "tree-alive");
  assert.notEqual(hold.verdict, abandoned.verdict);
  assert.notEqual(hold.verdict, orphaned.verdict);
  assert.notEqual(hold.verdict, tree.verdict);
  assert.equal(hold.sheltered, true);
  assert.equal(abandoned.sheltered, false);
  assert.equal(orphaned.sheltered, false);
  assert.equal(tree.sheltered, false);
});

test("5 seed78030 is taskkill-skipped, with alarms", () => {
  const result = decide(seedTaskkillSkipped());
  assert.equal(result.verdict, "taskkill-skipped");
  assert.equal(result.taskkillSkipped, true);
  assert.equal(result.sheltered, false);
  assert.equal(result.alarm, true);
  assert.equal(result.linear, true);
  assert.equal(result.issue, NEARBY_78030);
  assert.equal(result.facts.taskkillTreeUsed, false);
  assert.equal(result.ward.platform, DEMO_PLATFORM_WIN);
  assert.match(result.feed, /Taskkill-skipped|taskkill/i);
  assert.equal(decideSeed("78030").verdict, "taskkill-skipped");
  assert.equal(decideSeed(78030).verdict, "taskkill-skipped");
  assert.equal(decide(seed78030()).verdict, "taskkill-skipped");
});

test("6 seed76353 is job-missing, with alarms", () => {
  const result = decide(seedJobMissing());
  assert.equal(result.verdict, "job-missing");
  assert.equal(result.jobMissing, true);
  assert.equal(result.sheltered, false);
  assert.equal(result.alarm, true);
  assert.equal(result.issue, NEARBY_76353);
  assert.equal(result.facts.jobObjectAttached, false);
  assert.match(result.feed, /Job-missing|Job Object/i);
  assert.equal(decideSeed("76353").verdict, "job-missing");
  assert.equal(decideSeed(76353).verdict, "job-missing");
  assert.equal(decide(seed76353()).verdict, "job-missing");
});

test("7 group-unkilled: POSIX process group not killed", () => {
  const result = decide(seedGroupUnkilled());
  assert.equal(result.verdict, "group-unkilled");
  assert.equal(result.groupUnkilled, true);
  assert.equal(result.sheltered, false);
  assert.equal(result.alarm, true);
  assert.equal(result.issue, NEARBY_82433);
  assert.equal(result.ward.platform, DEMO_PLATFORM_POSIX);
  assert.equal(result.facts.processGroupKilled, false);
  assert.match(result.feed, /Group-unkilled|process group/i);
  assert.equal(decide(seed82433()).verdict, "group-unkilled");
});

test("8 parent-dead + tree-alive family", () => {
  const parent = decide(seedParentDead());
  assert.equal(parent.verdict, "parent-dead");
  assert.equal(parent.parentDead, true);
  assert.equal(parent.sheltered, false);
  assert.equal(parent.alarm, true);
  assert.equal(parent.issue, NEARBY_79727);
  assert.match(parent.feed, /Parent-dead|never reaped/i);
  const tree = decide(seedTreeAlive());
  assert.equal(tree.verdict, "tree-alive");
  assert.equal(tree.treeAlive, true);
  assert.equal(tree.sheltered, false);
  assert.equal(tree.issue, NEARBY_85200);
  assert.match(tree.feed, /Tree-alive|still running/i);
});

test("9 defender-load / timeout-seen / orphaned family", () => {
  const load = decide(seedDefenderLoad());
  assert.equal(load.verdict, "defender-load");
  assert.equal(load.alarm, true);
  assert.equal(load.issue, NEARBY_84647);
  assert.equal(load.facts.rssMb, DEMO_DEFENDER_RSS);
  assert.equal(load.facts.cpuPct, DEMO_CPU_PCT);
  const seen = decide(seedTimeoutSeen());
  assert.equal(seen.verdict, "timeout-seen");
  assert.equal(seen.alarm, true);
  assert.equal(seen.issue, NEARBY_84464);
  const orphaned = decide(seedOrphaned());
  assert.equal(orphaned.verdict, "orphaned");
  assert.equal(orphaned.alarm, true);
  assert.equal(orphaned.issue, NEARBY_76056);
  assert.equal(load.sheltered, false);
  assert.equal(seen.sheltered, false);
  assert.equal(orphaned.sheltered, false);
});

test("10 gaff / berth control seeds are off-ward, not this foundling case", () => {
  const nearby = [seedOffWardGaff, seedOffWardBerth];
  for (const seed of nearby) {
    const result = decide(seed());
    assert.equal(result.verdict, "off-ward", result.session);
    assert.equal(result.offWard, true, result.session);
    assert.equal(isOffWard(seed().waif), true, result.session);
    assert.notEqual(result.verdict, "abandoned", result.session);
    assert.notEqual(result.verdict, "sheltered", result.session);
    assert.ok(result.reasons.some((row) => /off-ward nearby/i.test(row)), result.session);
  }
  assert.equal(decide(seedOffWardGaff()).issue, RELATED_GAFF);
  assert.equal(decide(seedOffWardBerth()).issue, RELATED_BERTH);
  assert.equal(decide(seedOffWardGaff()).ward.gaffBilled, true);
  assert.equal(decide(seedOffWardBerth()).ward.berthCohabited, true);
});

test("11 family verdicts are distinct", () => {
  const map = {
    sheltered: decide(seedSheltered()).verdict,
    abandoned: decide(seedAbandoned()).verdict,
    orphaned: decide(seedOrphaned()).verdict,
    "tree-alive": decide(seedTreeAlive()).verdict,
    "parent-dead": decide(seedParentDead()).verdict,
    "timeout-seen": decide(seedTimeoutSeen()).verdict,
    "group-unkilled": decide(seedGroupUnkilled()).verdict,
    "job-missing": decide(seedJobMissing()).verdict,
    "taskkill-skipped": decide(seedTaskkillSkipped()).verdict,
    "defender-load": decide(seedDefenderLoad()).verdict,
    "off-ward": decide(seedOffWardGaff()).verdict,
  };
  const unique = new Set(Object.values(map));
  assert.equal(unique.size, 11);
  for (const [name, verdict] of Object.entries(map)) {
    assert.equal(verdict, name);
  }
});

test("12 forbidden idle list includes waif, empty, leftover names, not sheltered", () => {
  const words = forbiddenIdleWords();
  assert.ok(words.includes("waif"));
  assert.ok(words.includes("empty"));
  assert.ok(words.includes("silent"));
  assert.ok(words.includes("mute"));
  assert.ok(words.includes("yanked"));
  assert.ok(words.includes("alongside"));
  assert.ok(words.includes("home"));
  assert.ok(words.includes("orphaned"));
  assert.ok(words.includes("gaff"));
  assert.ok(words.includes("berth"));
  assert.ok(!words.includes("sheltered"));
  assert.doesNotMatch(IDLE_WORD, PRIOR_IDLES);
});

test("13 demo sinks: Slack+Linear on alarm family; GitHub always; never fake live 200", async () => {
  const abandoned = decide(seedAbandoned());
  const slack = slackWaifAlarm(abandoned, {});
  assert.equal(slack.mode, "demo");
  assert.match(slack.summary, /Would post to Slack/);
  assert.ok(Array.isArray(slack.body.blocks));
  const github = githubWaifLedger(abandoned, {});
  assert.equal(github.mode, "demo");
  assert.match(github.summary, /Would open a GitHub waif-ledger/);
  const linear = linearWaifTicket(abandoned, {});
  assert.equal(linear.mode, "demo");
  assert.match(linear.summary, /Would open a Linear ticket/);

  for (const seed of [
    seedAbandoned,
    seedOrphaned,
    seedTreeAlive,
    seedParentDead,
    seedTimeoutSeen,
    seedGroupUnkilled,
    seedJobMissing,
    seedTaskkillSkipped,
    seedDefenderLoad,
  ]) {
    const result = decide(seed());
    assert.equal(result.slack, true, result.verdict);
    assert.equal(result.linear, true, result.verdict);
    assert.match(slackWaifAlarm(result, {}).summary, /Would post to Slack/);
    assert.match(linearWaifTicket(result, {}).summary, /Would open a Linear ticket/);
  }
  const hold = decide(seedSheltered());
  assert.match(slackWaifAlarm(hold, {}).summary, /Would skip Slack/);
  assert.match(linearWaifTicket(hold, {}).summary, /Would skip Linear/);
  const fired = await fire(abandoned, {});
  assert.equal(fired.events.length, 3);
  assert.ok(fired.events.every((row) => row.mode === "demo"));
  assert.ok(fired.events.every((row) => row.ok === true));
});

test("14 handle deny on abandoned, allow on sheltered", async () => {
  const deny = await handle(seedAbandoned(), {});
  assert.equal(deny.permissionDecision, "deny");
  assert.equal(deny.verdict, "abandoned");
  assert.match(deny.hookSpecificOutput.decision.message, /dead parent|timed out/i);
  const allow = await handle(seedSheltered(), {});
  assert.equal(allow.permissionDecision, "allow");
  assert.equal(allow.verdict, "sheltered");
  assert.match(allow.hookSpecificOutput.decision.message, /idle word is sheltered/i);
});

test("15 restore / 90672 / incident produce the abandoned seed", () => {
  assert.equal(decide({ action: "restore" }).verdict, "abandoned");
  assert.equal(decide({ action: "90672" }).verdict, "abandoned");
  assert.equal(decide({ action: "incident" }).verdict, "abandoned");
  assert.equal(decide({ action: "abandoned" }).verdict, "abandoned");
});

test("16 admit scores honestly: abandoned stays abandoned", () => {
  const admitted = decide({ action: "admit", ...seedAbandoned() });
  assert.equal(admitted.verdict, "abandoned");
  assert.equal(admitted.sheltered, false);
});

test("17 parse bash timeout + waif payload", () => {
  const bash = parseBashTimeout({ timedOut: true, modelSaw: "timeout", childCount: 21 });
  assert.equal(bash.timedOut, true);
  assert.equal(bash.childCount, 21);
  assert.equal(parseBashTimeout("timeout: 21 child find.exe still running").childCount, 21);
  const probe = parseWaifJson({
    timedOut: true,
    parentAlive: false,
    childCount: 21,
    childrenWithDeadParent: 21,
    bash: { modelSaw: "timeout" },
    processGroupKilled: false,
  });
  assert.equal(probe.modelSaw, "timeout");
  assert.equal(classify(probe), "abandoned");
});

test("18 constants name the #90672 repro and nearby issue numbers", () => {
  assert.equal(FEATURED_ISSUE, 90672);
  assert.equal(NEARBY_78030, 78030);
  assert.equal(NEARBY_76353, 76353);
  assert.equal(NEARBY_85200, 85200);
  assert.equal(NEARBY_84464, 84464);
  assert.equal(NEARBY_82433, 82433);
  assert.equal(NEARBY_76056, 76056);
  assert.equal(NEARBY_84647, 84647);
  assert.equal(NEARBY_79727, 79727);
  assert.equal(RELATED_GAFF, 90616);
  assert.equal(RELATED_BERTH, 90668);
  assert.equal(CODEX_WIN_ORPHAN, 35393);
  assert.equal(CODEX_WSL_ORPHAN, 30802);
  assert.equal(CODEX_RG_ORPHAN, 37770);
  assert.equal(CODEX_ZSH_CPU, 25388);
  assert.match(DEMO_COMMAND, /find|grep/);
});

test("19 feed and reasons cite #90672 on abandoned", () => {
  assert.match(feedOf("sheltered"), /idle word is sheltered/);
  assert.match(feedOf("abandoned"), /#90672/);
  const reasons = reasonsOf(seedAbandoned().waif, "abandoned");
  assert.ok(reasons.some((row) => /#90672/.test(row)));
  const facts = analyze(seedAbandoned().waif);
  assert.equal(facts.abandoned, true);
  assert.equal(facts.parentDead, true);
  assert.equal(facts.eventClass, "abandoned");
});

test("20 folio HTML sanity: idle word sheltered, seeded abandoned, not gaff/berth/carrel", () => {
  const html = readFileSync(fileURLToPath(new URL("../index.html", import.meta.url)), "utf8");
  assert.match(html, /sheltered/);
  assert.match(html, /Score/);
  assert.match(html, /abandoned/);
  assert.match(html, /90672/);
  assert.match(html, /const IDLE_WORD = "sheltered"/);
  assert.doesNotMatch(html, /const IDLE_WORD = "waif"/);
  assert.doesNotMatch(html, /const IDLE_WORD = "yanked"/);
  assert.doesNotMatch(html, /const IDLE_WORD = "empty"/);
  assert.doesNotMatch(html, /const IDLE_WORD = "alongside"/);
  assert.match(html, /foundling-home|parish-ward|intake-board|intake-ledger/i);
  assert.match(html, /13:50 Sydney · waif/);
  assert.match(html, /an abandoned child is not a hold/i);
  assert.doesNotMatch(html, /class="harbour-quay"|class="tide-board"|class="berth-chalkboard"|class="fender-posts"/);
  assert.doesNotMatch(html, /class="music-hall"|class="house-curtain"|class="proscenium-arch"|class="brass-crook"/);
  assert.doesNotMatch(html, /class="reading-room"|class="study-carrel"|class="card-catalog"|class="banker-lamp"/);
  assert.doesNotMatch(html, /class="city-desk"|class="masthead-plate"|class="brass-nameplate-rack"/);
  assert.doesNotMatch(html, /class="survey-field"|class="datum-desk"|class="brass-leveling-plate"/);
  assert.doesNotMatch(html, /class="shopfront-street"|class="enamel-fascia-board"/);
  assert.doesNotMatch(html, /class="composing-room"|class="oak-chase"|class="brass-quoin"/);
  assert.doesNotMatch(html, /class="gunsmith-shop"|class="sear-rail"/);
  assert.doesNotMatch(html, /class="teller-hall"|class="marble-counter"/);
  assert.doesNotMatch(html, /class="mailroom-hall"|class="cubby-wall"/);
  assert.doesNotMatch(html, /Oswald|Newsreader/);
  assert.doesNotMatch(html, /Bebas Neue|Lora|Space Mono/);
  assert.doesNotMatch(html, /Abril Fatface|Cutive Mono/);
  assert.doesNotMatch(html, /millimeter slider|millimetre slider/i);
  assert.match(html, /<title>Waif/);
  assert.match(html, /Fraunces|Source Serif|IBM Plex Mono/);
  assert.match(html, /Admit sheltered/);
  assert.match(html, /Restore · #90672|restore to abandoned/i);
});

test("21 HTML why-not names Gaff, Berth, leftover", () => {
  const html = readFileSync(fileURLToPath(new URL("../index.html", import.meta.url)), "utf8");
  assert.match(html, /NOT Gaff/);
  assert.match(html, /NOT Berth/);
  assert.match(html, /NOT Carrel/);
  assert.match(html, /NOT Byline/);
  assert.match(html, /leftover/);
  assert.match(html, /millimeter-slider|millimetre-slider|millimeter slider|millimetre slider/);
});

test("22 README names contrasts and sheltered idle", () => {
  const readme = readFileSync(fileURLToPath(new URL("../README.md", import.meta.url)), "utf8");
  assert.match(readme, /NOT \*\*Gaff\*\*|NOT Gaff/);
  assert.match(readme, /NOT \*\*Berth\*\*|NOT Berth/);
  assert.match(readme, /NOT \*\*Carrel\*\*|NOT Carrel/);
  assert.match(readme, /\*\*sheltered\*\*/);
  assert.match(readme, /#90672/);
  assert.match(readme, /#78030/);
  assert.match(readme, /#76353/);
  assert.match(readme, /#90616/);
  assert.match(readme, /\/waif\//);
  assert.doesNotMatch(readme, /idle word is waif/i);
  assert.doesNotMatch(readme, /idle word is yanked/i);
  assert.doesNotMatch(readme, /idle word is alongside/i);
});

test("23 README and desk cite #90672 plus nearby and cross-ecosystem", () => {
  const readme = readFileSync(fileURLToPath(new URL("../README.md", import.meta.url)), "utf8");
  assert.match(readme, /90672/);
  assert.match(readme, /35393/);
  assert.match(readme, /30802/);
  assert.match(readme, /37770/);
  assert.match(readme, /25388/);
  const html = readFileSync(fileURLToPath(new URL("../index.html", import.meta.url)), "utf8");
  assert.match(html, /90672/);
  assert.match(html, /78030/);
  assert.match(html, /76353/);
  assert.match(html, /90616/);
  assert.match(html, /35393/);
  assert.match(html, /find\.exe|grep\.exe|21/);
  assert.match(html, /github.com\/anthropics\/claude-code\/issues\/90672/);
});

test("24 Slack skip on sheltered / control / off-ward", () => {
  for (const seed of [seedReset, seedControl, seedSheltered, seedOffWardGaff]) {
    const result = decide(seed());
    assert.equal(result.slack, false, result.verdict);
    assert.match(slackWaifAlarm(result, {}).summary, /Would skip Slack/);
  }
});

test("25 abandoned beats defender-load on the #90672 triad", () => {
  const facts = analyze(seedAbandoned().waif);
  assert.equal(facts.abandoned, true);
  assert.equal(facts.defenderLoad, false);
  assert.equal(classify(seedAbandoned().waif), "abandoned");
  assert.equal(seedAbandoned().waif.cpuPct, DEMO_CPU_PCT);
});

test("26 timeout-seen does not carry the dead-parent triad", () => {
  const result = score(seedTimeoutSeen().waif);
  assert.equal(result.verdict, "timeout-seen");
  assert.equal(analyze(seedTimeoutSeen().waif).abandoned, false);
  assert.equal(analyze(seedTimeoutSeen().waif).parentAlive, true);
});

test("27 HTML parse prefers JSON so a pasted probe scores the ward", () => {
  const html = readFileSync(fileURLToPath(new URL("../index.html", import.meta.url)), "utf8");
  assert.match(html, /raw\.startsWith\("\{"\)|startsWith\("\{"\)/);
  const probe = score(seedAbandoned().waif);
  assert.equal(probe.verdict, "abandoned");
  assert.equal(probe.sheltered, false);
});

test("28 listen health names waif verbs", async () => {
  const server = listen(0);
  await new Promise((resolve) => server.once("listening", resolve));
  const { port } = server.address();
  const res = await fetch(`http://127.0.0.1:${port}/health`);
  const body = await res.json();
  assert.equal(body.product, "waif");
  assert.match(body.verbs, /abandoned/);
  assert.match(body.verbs, /sheltered/);
  server.close();
});

test("29 assertScoreShape on every family verdict", () => {
  for (const seed of [
    seedSheltered,
    seedAbandoned,
    seedOrphaned,
    seedTreeAlive,
    seedParentDead,
    seedTimeoutSeen,
    seedGroupUnkilled,
    seedJobMissing,
    seedTaskkillSkipped,
    seedDefenderLoad,
    seedOffWardGaff,
  ]) {
    const result = decide(seed());
    assertScoreShape(result);
    assertIdleNeverWaif(result);
    assert.ok(VERDICTS.includes(result.verdict), result.verdict);
  }
  assert.ok(ALARM_VERDICTS.includes("abandoned"));
  assert.ok(LINEAR_VERDICTS.includes("abandoned"));
  assert.ok(SLACK_VERDICTS.includes("timeout-seen"));
});

test("30 cloneWaif reads bash nested probe", () => {
  const row = cloneWaif({
    timedOut: true,
    bash: { modelSaw: "timeout", childCount: 21, parentAlive: false },
  });
  assert.equal(row.modelSaw, "timeout");
  assert.equal(row.childCount, 21);
  assert.equal(row.parentAlive, false);
});
