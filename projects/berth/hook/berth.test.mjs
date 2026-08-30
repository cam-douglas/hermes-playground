import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  fire,
  githubBerthLedger,
  linearBerthTicket,
  slackBerthAlarm,
} from "./adapters.mjs";
import {
  ALARM_VERDICTS,
  CODEX_BRANCH_DRIFT,
  CODEX_IGNORE_WORKTREE,
  CODEX_SPAWN_CWD,
  DEMO_77263_CWD,
  DEMO_77263_PARENT,
  DEMO_79234_PHANTOM,
  DEMO_BRANCH_CHIP,
  DEMO_BRANCH_PARENT,
  DEMO_CHIP_ISOLATED,
  DEMO_INTERLEAVED,
  DEMO_PARENT_CWD,
  FEATURED_ISSUE,
  IDLE_WORD,
  LINEAR_VERDICTS,
  NEARBY_77263,
  NEARBY_79234,
  RELATED_81213,
  RELATED_86691,
  RELATED_89940,
  RELATED_CARREL,
  RELATED_FASCIA,
  SLACK_VERDICTS,
  VERDICTS,
  analyze,
  alongsideOf,
  classify,
  cloneBerth,
  decide,
  decideSeed,
  emptyAction,
  emptyBerth,
  feedOf,
  forbiddenIdleWords,
  isIdle,
  isOffQuay,
  parseBerthJson,
  parseSpawnTask,
  pathUnder,
  reasonsOf,
  score,
  seed90668,
  seed77263,
  seed79234,
  seedAlongside,
  seedBranchStolen,
  seedChipLied,
  seedCohabited,
  seedControl,
  seedCwdIgnored,
  seedInterleaved,
  seedOffQuay86691,
  seedOffQuayByline,
  seedOffQuayCarrel,
  seedOffQuayFascia,
  seedPhantomTree,
  seedPrimaryDock,
  seedPromisedFresh,
  seedReset,
  seedSameFloor,
  verdictOf,
} from "./berth.mjs";
import { handle, listen } from "./index.mjs";

const PRIOR_IDLES =
  /empty|silent|mute|idle|dead|seated|credited|level|verbatim|fronted|locked|yanked|caught|stowed|posted|bunged|belayed|rove|keyed|housed|beamed|snug|hung|appointed|cinched|gauged|stamped|overrun|pratique|wound|bound|stilled|stabled|drained|flat|fit|spoilt|laid|unlinked|tight|banked|roosted|stocked|heard|clear|paired|kernel|latched|upheld|sterling|home|valid|dry|quiet|seised|rung|moored/;

function assertIdleNeverBerth(result) {
  assert.equal(result.idleWord, "alongside");
  assert.equal(IDLE_WORD, "alongside");
  assert.doesNotMatch(result.idleWord, /berth/i);
  assert.doesNotMatch(IDLE_WORD, /^berth$/i);
  assert.doesNotMatch(result.idleWord, PRIOR_IDLES);
}

function assertScoreShape(result) {
  assert.equal(typeof result.verdict, "string");
  assert.ok(Array.isArray(result.reasons));
  assert.equal(typeof result.alongside, "boolean");
  assert.equal(typeof result.feed, "string");
}

test("1 seed 90668 cohabited is cohabited, slack, linear, idleWord alongside, never alongside", () => {
  const seed = seedCohabited();
  const result = decide(seed);
  assert.equal(result.verdict, "cohabited");
  assert.equal(result.state, "cohabited");
  assert.equal(result.decision, "cohabited");
  assert.equal(classify(seed.berth), "cohabited");
  assert.equal(verdictOf(seed.berth), "cohabited");
  assert.notEqual(result.verdict, "alongside");
  assert.equal(result.alarm, true);
  assert.equal(result.slack, true);
  assert.equal(result.linear, true);
  assert.equal(result.github, true);
  assert.equal(result.cohabited, true);
  assert.equal(result.alongside, false);
  assertIdleNeverBerth(result);
  assert.equal(result.session, "90668-cohabited");
  assert.equal(result.issue, FEATURED_ISSUE);
  assert.equal(result.facts.parentCwd, DEMO_PARENT_CWD);
  assert.equal(result.facts.chipCwd, DEMO_PARENT_CWD);
  assert.equal(result.facts.sameFloor, true);
  assert.equal(result.facts.cohabited, true);
  assert.match(result.feed, /Cohabited|working tree|primary #90668/i);
  assert.equal(decideSeed("cohabited").verdict, "cohabited");
  assert.equal(decideSeed("90668").verdict, "cohabited");
  assert.equal(decideSeed(90668).verdict, "cohabited");
  assert.equal(decide(seed90668()).verdict, "cohabited");
});

test("2 idle/empty/{} is alongside, never the product name, never empty, never error", () => {
  const result = decide(emptyAction("idle"));
  assert.equal(result.state, "alongside");
  assert.equal(result.verdict, "alongside");
  assert.equal(result.alarm, false);
  assert.equal(result.slack, false);
  assert.equal(result.alongside, true);
  assert.equal(classify({}), "alongside");
  assert.equal(classify(emptyBerth()), "alongside");
  assert.equal(isIdle(emptyBerth()), true);
  assert.equal(score(emptyBerth()).alongside, true);
  assertIdleNeverBerth(result);
  const bailed = decide({ action: "bail" });
  assert.equal(bailed.state, "alongside");
  assert.equal(bailed.idleWord, "alongside");
  const empty = decide({});
  assert.equal(empty.verdict, "alongside");
  assert.match(empty.feed, /Alongside/);
});

test("3 honest alongside hold: chip has its own real git worktree", () => {
  const result = decide(seedAlongside());
  assert.equal(result.verdict, "alongside");
  assert.equal(result.alarm, false);
  assert.equal(result.alongside, true);
  assert.equal(result.linear, false);
  assert.equal(result.facts.worktreeOk, true);
  assert.equal(result.facts.sameFloor, false);
  assert.equal(result.facts.parentCwd, DEMO_PARENT_CWD);
  assert.equal(result.facts.chipCwd, DEMO_CHIP_ISOLATED);
  assert.match(result.feed, /Alongside|real git worktree|idle word is alongside/i);
  assert.equal(decideSeed("control").verdict, "alongside");
  assert.equal(decideSeed("healthy").verdict, "alongside");
  assert.equal(decide(seedControl()).alongside, true);
  assert.equal(alongsideOf(seedAlongside().berth), true);
});

test("4 alongside must not be confused with cohabited, interleaved, or branch-stolen", () => {
  const hold = decide(seedAlongside());
  const cohabited = decide(seedCohabited());
  const interleaved = decide(seedInterleaved());
  const stolen = decide(seedBranchStolen());
  assert.equal(hold.verdict, "alongside");
  assert.equal(cohabited.verdict, "cohabited");
  assert.equal(interleaved.verdict, "interleaved");
  assert.equal(stolen.verdict, "branch-stolen");
  assert.notEqual(hold.verdict, cohabited.verdict);
  assert.notEqual(hold.verdict, interleaved.verdict);
  assert.notEqual(hold.verdict, stolen.verdict);
  assert.equal(hold.alongside, true);
  assert.equal(cohabited.alongside, false);
  assert.equal(interleaved.alongside, false);
  assert.equal(stolen.alongside, false);
});

test("5 seed77263 is cwd-ignored or promised-fresh, with alarms", () => {
  const result = decide(seedCwdIgnored());
  assert.ok(["cwd-ignored", "promised-fresh"].includes(result.verdict), result.verdict);
  assert.equal(result.verdict, "cwd-ignored");
  assert.equal(result.cwdIgnored, true);
  assert.equal(result.alongside, false);
  assert.equal(result.alarm, true);
  assert.equal(result.linear, true);
  assert.equal(result.issue, NEARBY_77263);
  assert.equal(result.facts.cwdParam, DEMO_77263_CWD);
  assert.equal(result.quay.parentCwd, DEMO_77263_PARENT);
  assert.match(result.feed, /Cwd-ignored|#77263|cwd param/i);
  assert.equal(decideSeed("77263").verdict, "cwd-ignored");
  assert.equal(decideSeed(77263).verdict, "cwd-ignored");
  assert.equal(decide(seed77263()).verdict, "cwd-ignored");
});

test("6 seed79234 is phantom-tree or branch-stolen, with alarms", () => {
  const result = decide(seedPhantomTree());
  assert.ok(["phantom-tree", "branch-stolen"].includes(result.verdict), result.verdict);
  assert.equal(result.verdict, "phantom-tree");
  assert.equal(result.phantomTree, true);
  assert.equal(result.alongside, false);
  assert.equal(result.alarm, true);
  assert.equal(result.issue, NEARBY_79234);
  assert.equal(result.quay.phantomPath, DEMO_79234_PHANTOM);
  assert.equal(result.quay.worktreeIsGit, false);
  assert.match(result.feed, /Phantom-tree|#79234|not a real git worktree/i);
  assert.equal(decideSeed("79234").verdict, "phantom-tree");
  assert.equal(decideSeed(79234).verdict, "phantom-tree");
  assert.equal(decide(seed79234()).verdict, "phantom-tree");
});

test("7 branch-stolen: chip moved the shared checkout under the parent", () => {
  const result = decide(seedBranchStolen());
  assert.equal(result.verdict, "branch-stolen");
  assert.equal(result.branchStolen, true);
  assert.equal(result.alongside, false);
  assert.equal(result.alarm, true);
  assert.equal(result.facts.branchBefore, DEMO_BRANCH_PARENT);
  assert.equal(result.facts.branchAfter, DEMO_BRANCH_CHIP);
  assert.match(result.feed, /Branch-stolen|moved the shared tree/i);
});

test("8 interleaved: chip files in parent git status mid-task", () => {
  const result = decide(seedInterleaved());
  assert.equal(result.verdict, "interleaved");
  assert.equal(result.interleaved, true);
  assert.equal(result.alongside, false);
  assert.equal(result.alarm, true);
  assert.deepEqual(result.facts.interleavedPaths, DEMO_INTERLEAVED.slice());
  assert.match(result.feed, /Interleaved|uncommitted files/i);
});

test("9 promised-fresh / same-floor / chip-lied / primary-dock family", () => {
  const promised = decide(seedPromisedFresh());
  assert.equal(promised.verdict, "promised-fresh");
  assert.equal(promised.alarm, true);
  const floor = decide(seedSameFloor());
  assert.equal(floor.verdict, "same-floor");
  assert.equal(floor.alarm, true);
  const lied = decide(seedChipLied());
  assert.equal(lied.verdict, "chip-lied");
  assert.equal(lied.alarm, true);
  const dock = decide(seedPrimaryDock());
  assert.equal(dock.verdict, "primary-dock");
  assert.equal(dock.alarm, true);
  assert.equal(promised.alongside, false);
  assert.equal(floor.alongside, false);
  assert.equal(lied.alongside, false);
  assert.equal(dock.alongside, false);
});

test("10 fascia / carrel control seeds are off-quay, not this berth", () => {
  const nearby = [seedOffQuayFascia, seedOffQuayCarrel, seedOffQuayByline, seedOffQuay86691];
  for (const seed of nearby) {
    const result = decide(seed());
    assert.equal(result.verdict, "off-quay", result.session);
    assert.equal(result.offQuay, true, result.session);
    assert.equal(isOffQuay(seed().berth), true, result.session);
    assert.notEqual(result.verdict, "cohabited", result.session);
    assert.notEqual(result.verdict, "alongside", result.session);
    assert.ok(result.reasons.some((row) => /off-quay nearby/i.test(row)), result.session);
  }
  assert.equal(decide(seedOffQuayFascia()).issue, RELATED_FASCIA);
  assert.equal(decide(seedOffQuayCarrel()).issue, RELATED_CARREL);
  assert.equal(decide(seedOffQuayFascia()).quay.fasciaTrust, true);
  assert.equal(decide(seedOffQuayCarrel()).quay.carrelLaunch, true);
});

test("11 family verdicts are distinct", () => {
  const map = {
    alongside: decide(seedAlongside()).verdict,
    cohabited: decide(seedCohabited()).verdict,
    "promised-fresh": decide(seedPromisedFresh()).verdict,
    "same-floor": decide(seedSameFloor()).verdict,
    "branch-stolen": decide(seedBranchStolen()).verdict,
    interleaved: decide(seedInterleaved()).verdict,
    "chip-lied": decide(seedChipLied()).verdict,
    "primary-dock": decide(seedPrimaryDock()).verdict,
    "cwd-ignored": decide(seedCwdIgnored()).verdict,
    "phantom-tree": decide(seedPhantomTree()).verdict,
    "off-quay": decide(seedOffQuayFascia()).verdict,
  };
  const unique = new Set(Object.values(map));
  assert.equal(unique.size, 11);
  for (const [name, verdict] of Object.entries(map)) {
    assert.equal(verdict, name);
  }
});

test("12 forbidden idle list includes berth, empty, leftover names, not alongside", () => {
  const words = forbiddenIdleWords();
  assert.ok(words.includes("berth"));
  assert.ok(words.includes("empty"));
  assert.ok(words.includes("silent"));
  assert.ok(words.includes("mute"));
  assert.ok(words.includes("seated"));
  assert.ok(words.includes("credited"));
  assert.ok(words.includes("level"));
  assert.ok(words.includes("verbatim"));
  assert.ok(words.includes("fronted"));
  assert.ok(words.includes("moored"));
  assert.ok(words.includes("carrel"));
  assert.ok(words.includes("byline"));
  assert.ok(words.includes("fascia"));
  assert.ok(!words.includes("alongside"));
  assert.doesNotMatch(IDLE_WORD, PRIOR_IDLES);
});

test("13 demo sinks: Slack+Linear on alarm family; GitHub always; never fake live 200", async () => {
  const cohabited = decide(seedCohabited());
  const slack = slackBerthAlarm(cohabited, {});
  assert.equal(slack.mode, "demo");
  assert.match(slack.summary, /Would post to Slack/);
  assert.ok(Array.isArray(slack.body.blocks));
  const github = githubBerthLedger(cohabited, {});
  assert.equal(github.mode, "demo");
  assert.match(github.summary, /Would open a GitHub berth-ledger/);
  const linear = linearBerthTicket(cohabited, {});
  assert.equal(linear.mode, "demo");
  assert.match(linear.summary, /Would open a Linear ticket/);

  for (const seed of [
    seedCohabited,
    seedPromisedFresh,
    seedSameFloor,
    seedBranchStolen,
    seedInterleaved,
    seedChipLied,
    seedPrimaryDock,
    seedCwdIgnored,
    seedPhantomTree,
  ]) {
    const result = decide(seed());
    assert.equal(result.slack, true, result.verdict);
    assert.equal(result.linear, true, result.verdict);
    assert.match(slackBerthAlarm(result, {}).summary, /Would post to Slack/);
    assert.match(linearBerthTicket(result, {}).summary, /Would open a Linear ticket/);
  }
  const hold = decide(seedAlongside());
  assert.match(slackBerthAlarm(hold, {}).summary, /Would skip Slack/);
  assert.match(linearBerthTicket(hold, {}).summary, /Would skip Linear/);
  const fired = await fire(cohabited, {});
  assert.equal(fired.events.length, 3);
  assert.ok(fired.events.every((row) => row.mode === "demo"));
  assert.ok(fired.events.every((row) => row.ok === true));
});

test("14 handle deny on cohabited, allow on alongside", async () => {
  const deny = await handle(seedCohabited(), {});
  assert.equal(deny.permissionDecision, "deny");
  assert.equal(deny.verdict, "cohabited");
  assert.match(deny.hookSpecificOutput.decision.message, /working tree/i);
  const allow = await handle(seedAlongside(), {});
  assert.equal(allow.permissionDecision, "allow");
  assert.equal(allow.verdict, "alongside");
  assert.match(allow.hookSpecificOutput.decision.message, /idle word is alongside/i);
});

test("15 restore / 90668 / incident produce the cohabited seed", () => {
  assert.equal(decide({ action: "restore" }).verdict, "cohabited");
  assert.equal(decide({ action: "90668" }).verdict, "cohabited");
  assert.equal(decide({ action: "incident" }).verdict, "cohabited");
  assert.equal(decide({ action: "cohabited" }).verdict, "cohabited");
});

test("16 admit scores honestly: cohabited stays cohabited", () => {
  const admitted = decide({ action: "admit", ...seedCohabited() });
  assert.equal(admitted.verdict, "cohabited");
  assert.equal(admitted.alongside, false);
});

test("17 parse spawn_task + berth payload", () => {
  const spawn = parseSpawnTask({ cwd: DEMO_77263_CWD, promisedFresh: true });
  assert.equal(spawn.cwd, DEMO_77263_CWD);
  assert.equal(spawn.promisedFresh, true);
  assert.equal(parseSpawnTask('cwd: "/Users/ada/dev/app" and a fresh worktree').cwd, "/Users/ada/dev/app");
  const probe = parseBerthJson({
    parentCwd: DEMO_PARENT_CWD,
    chipCwd: DEMO_PARENT_CWD,
    spawn_task: { cwd: DEMO_PARENT_CWD, promisedFresh: true },
    parentStillEditing: true,
    worktreeCreated: false,
  });
  assert.equal(probe.promisedFresh, true);
  assert.equal(classify(probe), "cohabited");
});

test("18 constants name the #90668 repro paths and nearby issue numbers", () => {
  assert.equal(FEATURED_ISSUE, 90668);
  assert.equal(NEARBY_77263, 77263);
  assert.equal(NEARBY_79234, 79234);
  assert.equal(RELATED_FASCIA, 90638);
  assert.equal(RELATED_CARREL, 90661);
  assert.equal(RELATED_86691, 86691);
  assert.equal(RELATED_81213, 81213);
  assert.equal(RELATED_89940, 89940);
  assert.equal(CODEX_BRANCH_DRIFT, 31572);
  assert.equal(CODEX_IGNORE_WORKTREE, 33144);
  assert.equal(CODEX_SPAWN_CWD, 18969);
  assert.ok(pathUnder(DEMO_CHIP_ISOLATED, DEMO_PARENT_CWD));
  assert.ok(!pathUnder(DEMO_PARENT_CWD, DEMO_CHIP_ISOLATED));
});

test("19 feed and reasons cite #90668 on cohabited", () => {
  assert.match(feedOf("alongside"), /idle word is alongside/);
  assert.match(feedOf("cohabited"), /#90668/);
  const reasons = reasonsOf(seedCohabited().berth, "cohabited");
  assert.ok(reasons.some((row) => /#90668/.test(row)));
  const facts = analyze(seedCohabited().berth);
  assert.equal(facts.cohabited, true);
  assert.equal(facts.sameFloor, true);
  assert.equal(facts.eventClass, "cohabited");
});

test("20 folio HTML sanity: idle word alongside, seeded cohabited, not carrel/byline/fascia/datum", () => {
  const html = readFileSync(fileURLToPath(new URL("../index.html", import.meta.url)), "utf8");
  assert.match(html, /alongside/);
  assert.match(html, /Score/);
  assert.match(html, /cohabited/);
  assert.match(html, /90668/);
  assert.match(html, /const IDLE_WORD = "alongside"/);
  assert.doesNotMatch(html, /const IDLE_WORD = "berth"/);
  assert.doesNotMatch(html, /const IDLE_WORD = "seated"/);
  assert.doesNotMatch(html, /const IDLE_WORD = "empty"/);
  assert.doesNotMatch(html, /const IDLE_WORD = "moored"/);
  assert.match(html, /harbour-quay|tide-board|berth-chalkboard|fender-posts/i);
  assert.match(html, /12:50 Sydney · berth/);
  assert.match(html, /a shared berth is not a hold/i);
  assert.doesNotMatch(html, /class="reading-room"|class="study-carrel"|class="card-catalog"|class="banker-lamp"/);
  assert.doesNotMatch(html, /class="city-desk"|class="masthead-plate"|class="brass-nameplate-rack"/);
  assert.doesNotMatch(html, /class="survey-field"|class="datum-desk"|class="brass-leveling-plate"/);
  assert.doesNotMatch(html, /class="shopfront-street"|class="enamel-fascia-board"/);
  assert.doesNotMatch(html, /class="composing-room"|class="oak-chase"|class="brass-quoin"/);
  assert.doesNotMatch(html, /class="gunsmith-shop"|class="sear-rail"/);
  assert.doesNotMatch(html, /class="teller-hall"|class="marble-counter"/);
  assert.doesNotMatch(html, /class="mailroom-hall"|class="cubby-wall"/);
  assert.doesNotMatch(html, /Oswald|Newsreader/);
  assert.doesNotMatch(html, /Fraunces|Literata/);
  assert.doesNotMatch(html, /millimeter slider|millimetre slider/i);
  assert.match(html, /<title>Berth/);
  assert.match(html, /Bebas Neue|Lora|Space Mono/);
  assert.match(html, /Admit alongside/);
  assert.match(html, /Restore · #90668|restore to cohabited/i);
});

test("21 HTML why-not names Carrel, Fascia, Byline, leftover", () => {
  const html = readFileSync(fileURLToPath(new URL("../index.html", import.meta.url)), "utf8");
  assert.match(html, /NOT Carrel/);
  assert.match(html, /NOT Fascia/);
  assert.match(html, /NOT Byline/);
  assert.match(html, /NOT Datum/);
  assert.match(html, /NOT Wicket/);
  assert.match(html, /leftover/);
  assert.match(html, /millimeter-slider|millimetre-slider|millimeter slider|millimetre slider/);
});

test("22 README names contrasts and alongside idle", () => {
  const readme = readFileSync(fileURLToPath(new URL("../README.md", import.meta.url)), "utf8");
  assert.match(readme, /NOT \*\*Carrel\*\*|NOT Carrel/);
  assert.match(readme, /NOT \*\*Fascia\*\*|NOT Fascia/);
  assert.match(readme, /NOT \*\*Byline\*\*|NOT Byline/);
  assert.match(readme, /\*\*alongside\*\*/);
  assert.match(readme, /#90668/);
  assert.match(readme, /#77263/);
  assert.match(readme, /#79234/);
  assert.match(readme, /#90638/);
  assert.match(readme, /\/berth\//);
  assert.doesNotMatch(readme, /idle word is berth/i);
  assert.doesNotMatch(readme, /idle word is seated/i);
  assert.doesNotMatch(readme, /idle word is moored/i);
});

test("23 README and desk cite #90668 plus nearby and cross-ecosystem", () => {
  const readme = readFileSync(fileURLToPath(new URL("../README.md", import.meta.url)), "utf8");
  assert.match(readme, /90668/);
  assert.match(readme, /31572/);
  assert.match(readme, /33144/);
  assert.match(readme, /18969/);
  const html = readFileSync(fileURLToPath(new URL("../index.html", import.meta.url)), "utf8");
  assert.match(html, /90668/);
  assert.match(html, /77263/);
  assert.match(html, /79234/);
  assert.match(html, /90638/);
  assert.match(html, /31572/);
  assert.match(html, /wolverine/);
  assert.match(html, /github.com\/anthropics\/claude-code\/issues\/90668/);
});

test("24 Slack skip on alongside / control / off-quay", () => {
  for (const seed of [seedReset, seedControl, seedAlongside, seedOffQuayFascia]) {
    const result = decide(seed());
    assert.equal(result.slack, false, result.verdict);
    assert.match(slackBerthAlarm(result, {}).summary, /Would skip Slack/);
  }
});

test("25 branch-stolen beats interleaved and cohabited", () => {
  const facts = analyze(seedBranchStolen().berth);
  assert.equal(facts.branchStolen, true);
  assert.equal(facts.cohabited, true);
  assert.equal(classify(seedBranchStolen().berth), "branch-stolen");
});

test("26 interleaved beats cohabited when chip files show in parent status", () => {
  const result = score(seedInterleaved().berth);
  assert.equal(result.verdict, "interleaved");
  assert.equal(analyze(seedInterleaved().berth).cohabited, true);
});

test("27 HTML parse prefers JSON so a pasted probe scores the quay", () => {
  const html = readFileSync(fileURLToPath(new URL("../index.html", import.meta.url)), "utf8");
  assert.match(html, /raw\.startsWith\("\{"\)|startsWith\("\{"\)/);
  const probe = score(seedCohabited().berth);
  assert.equal(probe.verdict, "cohabited");
  assert.equal(probe.alongside, false);
});

test("28 listen health names berth verbs", async () => {
  const server = listen(0);
  await new Promise((resolve) => server.once("listening", resolve));
  const { port } = server.address();
  const res = await fetch(`http://127.0.0.1:${port}/health`);
  const body = await res.json();
  assert.equal(body.product, "berth");
  assert.match(body.verbs, /cohabited/);
  assert.match(body.verbs, /alongside/);
  server.close();
});

test("29 assertScoreShape on every family verdict", () => {
  for (const seed of [
    seedAlongside,
    seedCohabited,
    seedPromisedFresh,
    seedSameFloor,
    seedBranchStolen,
    seedInterleaved,
    seedChipLied,
    seedPrimaryDock,
    seedCwdIgnored,
    seedPhantomTree,
    seedOffQuayFascia,
  ]) {
    const result = decide(seed());
    assertScoreShape(result);
    assertIdleNeverBerth(result);
    assert.ok(VERDICTS.includes(result.verdict), result.verdict);
  }
  assert.ok(ALARM_VERDICTS.includes("cohabited"));
  assert.ok(LINEAR_VERDICTS.includes("cohabited"));
  assert.ok(SLACK_VERDICTS.includes("promised-fresh"));
});

test("30 cloneBerth reads spawn_task cwd", () => {
  const row = cloneBerth({
    parentCwd: DEMO_PARENT_CWD,
    spawn_task: { cwd: DEMO_PARENT_CWD, promisedFresh: true },
  });
  assert.equal(row.chipCwd, DEMO_PARENT_CWD);
  assert.equal(row.promisedFresh, true);
});
