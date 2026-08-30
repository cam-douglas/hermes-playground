import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  fire,
  githubPaleLedger,
  linearPaleTicket,
  slackPaleAlarm,
} from "./adapters.mjs";
import {
  ALARM_VERDICTS,
  CODEX_ANCESTOR_AGENTS,
  CODEX_MULTIROOT_AGENTS,
  CODEX_SUBMODULE_AGENTS,
  DEMO_HOOKS,
  DEMO_PARENT,
  DEMO_REPO,
  FEATURED_ISSUE,
  IDLE_WORD,
  LINEAR_VERDICTS,
  NEARBY_76441,
  NEARBY_78505,
  NEARBY_79480,
  NEARBY_88871,
  NEARBY_89215,
  RELATED_CHATELAINE,
  SLACK_VERDICTS,
  VERDICTS,
  analyze,
  boundOf,
  classify,
  cloneProbe,
  decide,
  decideSeed,
  emptyAction,
  emptyProbe,
  feedOf,
  forbiddenIdleWords,
  isIdle,
  isOffPale,
  parsePaleJson,
  reasonsOf,
  score,
  seed90683,
  seedAbove,
  seedBeyond,
  seedBound,
  seedControl,
  seedFailOpen,
  seedOffPale,
  seedReset,
  seedRootless,
  seedSilent,
  seedSubdir,
  seedUnhooked,
  seedWalkless,
  verdictOf,
} from "./pale.mjs";
import { handle, listen } from "./index.mjs";

const PRIOR_IDLES =
  /empty|mute|idle|sheltered|alongside|seated|credited|level|verbatim|fronted|locked|yanked|caught|stowed|posted|bunged|belayed|rove|keyed|housed|beamed|snug|hung|appointed|cinched|gauged|stamped|overrun|pratique|wound|girt|^nested$|^cut$|^switched$|^spilled$|^pale$/;

function assertIdleNeverPale(result) {
  assert.equal(result.idleWord, "bound");
  assert.equal(IDLE_WORD, "bound");
  assert.doesNotMatch(result.idleWord, /pale/i);
  assert.doesNotMatch(IDLE_WORD, /^pale$/i);
  assert.doesNotMatch(result.idleWord, PRIOR_IDLES);
}

function assertScoreShape(result) {
  assert.equal(typeof result.verdict, "string");
  assert.ok(Array.isArray(result.reasons));
  assert.equal(typeof result.bound, "boolean");
  assert.equal(typeof result.feed, "string");
}

test("1 seed 90683 beyond is beyond, slack, linear, idleWord bound, never bound", () => {
  const seed = seedBeyond();
  const result = decide(seed);
  assert.equal(result.verdict, "beyond");
  assert.equal(result.state, "beyond");
  assert.equal(result.decision, "beyond");
  assert.equal(classify(seed.pale), "beyond");
  assert.equal(verdictOf(seed.pale), "beyond");
  assert.notEqual(result.verdict, "bound");
  assert.equal(result.alarm, true);
  assert.equal(result.slack, true);
  assert.equal(result.linear, true);
  assert.equal(result.github, true);
  assert.equal(result.beyond, true);
  assert.equal(result.bound, false);
  assertIdleNeverPale(result);
  assert.equal(result.session, "90683-beyond");
  assert.equal(result.issue, FEATURED_ISSUE);
  assert.equal(result.facts.settingsPresentOnDisk, true);
  assert.equal(result.facts.startedAboveRepo, true);
  assert.equal(result.facts.triad, true);
  assert.equal(result.facts.hooksRegisteredCount, 0);
  assert.match(result.feed, /Beyond|hooks absent|primary #90683/i);
  assert.match(result.slackCopy, /Pale beyond · hooks silently absent · fence never walked up · #90683/);
  assert.equal(decideSeed("beyond").verdict, "beyond");
  assert.equal(decideSeed("90683").verdict, "beyond");
  assert.equal(decideSeed(90683).verdict, "beyond");
  assert.equal(decide(seed90683()).verdict, "beyond");
});

test("2 idle/empty/{} is bound, never the product name, never empty, never error", () => {
  const result = decide(emptyAction("idle"));
  assert.equal(result.state, "bound");
  assert.equal(result.verdict, "bound");
  assert.equal(result.alarm, false);
  assert.equal(result.slack, false);
  assert.equal(result.bound, true);
  assert.equal(classify({}), "bound");
  assert.equal(classify(emptyProbe()), "bound");
  assert.equal(isIdle(emptyProbe()), true);
  assert.equal(score(emptyProbe()).bound, true);
  assertIdleNeverPale(result);
  const bailed = decide({ action: "bail" });
  assert.equal(bailed.state, "bound");
  assert.equal(bailed.idleWord, "bound");
  const empty = decide({});
  assert.equal(empty.verdict, "bound");
  assert.match(empty.feed, /Bound/);
});

test("3 honest bound hold: project root matches settings dir; hooks armed", () => {
  const result = decide(seedBound());
  assert.equal(result.verdict, "bound");
  assert.equal(result.alarm, false);
  assert.equal(result.bound, true);
  assert.equal(result.linear, false);
  assert.equal(result.facts.rootsMatch, true);
  assert.equal(result.facts.settingsPresentOnDisk, true);
  assert.equal(result.facts.hooksRegisteredCount, DEMO_HOOKS);
  assert.equal(result.facts.toolProceededUnhooked, false);
  assert.match(result.feed, /Bound|hooks registered|idle word is bound/i);
  assert.equal(decideSeed("control").verdict, "bound");
  assert.equal(decideSeed("healthy").verdict, "bound");
  assert.equal(decide(seedControl()).bound, true);
  assert.equal(boundOf(seedBound().pale), true);
});

test("4 bound must not be confused with beyond, unhooked, or fail-open", () => {
  const hold = decide(seedBound());
  const beyond = decide(seedBeyond());
  const unhooked = decide(seedUnhooked());
  const failOpen = decide(seedFailOpen());
  assert.equal(hold.verdict, "bound");
  assert.equal(beyond.verdict, "beyond");
  assert.equal(unhooked.verdict, "unhooked");
  assert.equal(failOpen.verdict, "fail-open");
  assert.notEqual(hold.verdict, beyond.verdict);
  assert.notEqual(hold.verdict, unhooked.verdict);
  assert.equal(hold.bound, true);
  assert.equal(beyond.bound, false);
  assert.equal(unhooked.bound, false);
  assert.equal(failOpen.bound, false);
});

test("5 unhooked: settings on disk, roots match, zero hooks armed", () => {
  const result = decide(seedUnhooked());
  assert.equal(result.verdict, "unhooked");
  assert.equal(result.unhooked, true);
  assert.equal(result.bound, false);
  assert.equal(result.alarm, true);
  assert.equal(result.facts.rootsMatch, true);
  assert.equal(result.facts.hooksRegisteredCount, 0);
  assert.equal(analyze(seedUnhooked().pale).triad, false);
  assert.match(result.feed, /Unhooked|zero hooks armed/i);
});

test("6 rootless: nearby cloud empty / CLAUDE_PROJECT_DIR empty", () => {
  const result = decide(seedRootless());
  assert.equal(result.verdict, "rootless");
  assert.equal(result.rootless, true);
  assert.equal(result.bound, false);
  assert.equal(result.alarm, true);
  assert.equal(result.issue, NEARBY_78505);
  assert.equal(result.facts.nearbyCloudEmpty, true);
  assert.notEqual(result.verdict, "beyond");
  assert.match(result.feed, /Rootless|project root/i);
});

test("7 silent: nearby web ignore, no warning", () => {
  const result = decide(seedSilent());
  assert.equal(result.verdict, "silent");
  assert.equal(result.silent, true);
  assert.equal(result.bound, false);
  assert.equal(result.alarm, true);
  assert.equal(result.issue, NEARBY_89215);
  assert.equal(analyze(seedSilent().pale).triad, false);
  assert.match(result.feed, /Silent|no warning/i);
});

test("8 above: started in a parent; warning did fire so not the triad", () => {
  const result = decide(seedAbove());
  assert.equal(result.verdict, "above");
  assert.equal(result.above, true);
  assert.equal(result.bound, false);
  assert.equal(result.alarm, true);
  assert.equal(result.facts.startedAboveRepo, true);
  assert.equal(result.facts.warningEmitted, true);
  assert.equal(analyze(seedAbove().pale).triad, false);
  assert.match(result.feed, /Above|parent of the repo/i);
});

test("9 subdir: nearby subdirectory launch keeps its own seed", () => {
  const result = decide(seedSubdir());
  assert.equal(result.verdict, "subdir");
  assert.equal(result.subdir, true);
  assert.equal(result.bound, false);
  assert.equal(result.alarm, true);
  assert.equal(result.issue, NEARBY_76441);
  assert.equal(result.facts.startedInSubdir, true);
  assert.equal(result.facts.nearbySubdirMiss, true);
  assert.equal(analyze(seedSubdir().pale).triad, false);
  assert.match(result.feed, /Subdir|#76441|subdirectory/i);
});

test("10 walkless / fail-open / off-pale nearby flags win their own seeds", () => {
  const walkless = decide(seedWalkless());
  assert.equal(walkless.verdict, "walkless");
  assert.equal(walkless.walkless, true);
  assert.equal(walkless.bound, false);
  assert.equal(walkless.issue, NEARBY_88871);
  assert.equal(analyze(seedWalkless().pale).triad, false);

  const failOpen = decide(seedFailOpen());
  assert.equal(failOpen.verdict, "fail-open");
  assert.equal(failOpen["fail-open"], true);
  assert.equal(failOpen.bound, false);
  assert.equal(analyze(seedFailOpen().pale).triad, false);

  const off = decide(seedOffPale());
  assert.equal(off.verdict, "off-pale");
  assert.equal(off["off-pale"], true);
  assert.equal(off.bound, false);
  assert.equal(off.issue, RELATED_CHATELAINE);
  assert.equal(isOffPale(seedOffPale().pale), true);
  assert.ok(off.reasons.some((row) => /off-pale nearby|NOT this fence|#90647/i.test(row)));
});

test("11 Chatelaine-shaped different bug is labeled off-pale, not beyond", () => {
  const result = decide(seedOffPale());
  assert.notEqual(result.verdict, "beyond");
  assert.equal(result.verdict, "off-pale");
  assert.equal(result.bound, false);
  assert.equal(result.slack, false);
  assert.equal(analyze(seedOffPale().pale).triad, false);
});

test("12 family verdicts are distinct", () => {
  const map = {
    bound: decide(seedBound()).verdict,
    beyond: decide(seedBeyond()).verdict,
    unhooked: decide(seedUnhooked()).verdict,
    rootless: decide(seedRootless()).verdict,
    silent: decide(seedSilent()).verdict,
    above: decide(seedAbove()).verdict,
    subdir: decide(seedSubdir()).verdict,
    walkless: decide(seedWalkless()).verdict,
    "fail-open": decide(seedFailOpen()).verdict,
    "off-pale": decide(seedOffPale()).verdict,
  };
  const unique = new Set(Object.values(map));
  assert.equal(unique.size, 10);
  for (const [name, verdict] of Object.entries(map)) {
    assert.equal(verdict, name);
  }
});

test("13 forbidden idle list includes pale, prior idles, not bound", () => {
  const words = forbiddenIdleWords();
  assert.ok(words.includes("pale"));
  assert.ok(words.includes("empty"));
  assert.ok(words.includes("sheltered"));
  assert.ok(words.includes("girt"));
  assert.ok(words.includes("alongside"));
  assert.ok(words.includes("bailey"));
  assert.ok(words.includes("chatelaine"));
  assert.ok(!words.includes("bound"));
  assert.doesNotMatch(IDLE_WORD, PRIOR_IDLES);
});

test("14 demo sinks: Slack+Linear on fail family; GitHub always; never fake live 200", async () => {
  const beyond = decide(seedBeyond());
  const slack = slackPaleAlarm(beyond, {});
  assert.equal(slack.mode, "demo");
  assert.match(slack.summary, /Would post to Slack/);
  assert.ok(Array.isArray(slack.body.blocks));
  const github = githubPaleLedger(beyond, {});
  assert.equal(github.mode, "demo");
  assert.match(github.summary, /Would append a GitHub pale-ledger/);
  const linear = linearPaleTicket(beyond, {});
  assert.equal(linear.mode, "demo");
  assert.match(linear.summary, /Would open a Linear ticket/);

  for (const seed of [
    seedBeyond,
    seedUnhooked,
    seedRootless,
    seedSilent,
    seedAbove,
    seedSubdir,
    seedWalkless,
    seedFailOpen,
  ]) {
    const result = decide(seed());
    assert.equal(result.slack, true, result.verdict);
    assert.equal(result.linear, true, result.verdict);
    assert.match(slackPaleAlarm(result, {}).summary, /Would post to Slack/);
    assert.match(linearPaleTicket(result, {}).summary, /Would open a Linear ticket/);
  }
  const hold = decide(seedBound());
  assert.match(slackPaleAlarm(hold, {}).summary, /Would skip Slack/);
  assert.match(linearPaleTicket(hold, {}).summary, /Would skip Linear/);
  const fired = await fire(beyond, {});
  assert.equal(fired.events.length, 3);
  assert.ok(fired.events.every((row) => row.mode === "demo"));
  assert.ok(fired.events.every((row) => row.ok === true));
});

test("15 handle deny on beyond, allow on bound", async () => {
  const deny = await handle(seedBeyond(), {});
  assert.equal(deny.permissionDecision, "deny");
  assert.equal(deny.verdict, "beyond");
  assert.match(deny.hookSpecificOutput.decision.message, /hooks silently absent|outside the repo/i);
  const allow = await handle(seedBound(), {});
  assert.equal(allow.permissionDecision, "allow");
  assert.equal(allow.verdict, "bound");
  assert.match(allow.hookSpecificOutput.decision.message, /idle word is bound/i);
});

test("16 restore / 90683 / incident produce the beyond seed", () => {
  assert.equal(decide({ action: "restore" }).verdict, "beyond");
  assert.equal(decide({ action: "90683" }).verdict, "beyond");
  assert.equal(decide({ action: "incident" }).verdict, "beyond");
  assert.equal(decide({ action: "beyond" }).verdict, "beyond");
});

test("17 admit scores honestly: beyond stays beyond", () => {
  const admitted = decide({ action: "admit", ...seedBeyond() });
  assert.equal(admitted.verdict, "beyond");
  assert.equal(admitted.bound, false);
});

test("18 parse pale payload", () => {
  const probe = parsePaleJson({
    settingsPresentOnDisk: true,
    sessionProjectRoot: DEMO_PARENT,
    settingsDir: DEMO_REPO,
    rootsMatch: false,
    hooksRegisteredCount: 0,
    warningEmitted: false,
    startedAboveRepo: true,
    walkUpAttempted: false,
    toolProceededUnhooked: true,
  });
  assert.equal(classify(probe), "beyond");
  const dumped = cloneProbe({
    settingsPresentOnDisk: true,
    sessionProjectRoot: DEMO_REPO,
    settingsDir: DEMO_REPO,
  });
  assert.equal(dumped.sessionProjectRoot, DEMO_REPO);
});

test("19 constants name the #90683 repro and nearby issue numbers", () => {
  assert.equal(FEATURED_ISSUE, 90683);
  assert.equal(NEARBY_76441, 76441);
  assert.equal(NEARBY_79480, 79480);
  assert.equal(NEARBY_89215, 89215);
  assert.equal(NEARBY_78505, 78505);
  assert.equal(NEARBY_88871, 88871);
  assert.equal(RELATED_CHATELAINE, 90647);
  assert.equal(CODEX_ANCESTOR_AGENTS, 28903);
  assert.equal(CODEX_SUBMODULE_AGENTS, 30789);
  assert.equal(CODEX_MULTIROOT_AGENTS, 38065);
});

test("20 feed and reasons cite #90683 on beyond", () => {
  assert.match(feedOf("bound"), /idle word is bound/);
  assert.match(feedOf("beyond"), /#90683/);
  const reasons = reasonsOf(seedBeyond().pale, "beyond");
  assert.ok(reasons.some((row) => /#90683/.test(row)));
  const facts = analyze(seedBeyond().pale);
  assert.equal(facts.triad, true);
  assert.equal(facts.eventClass, "beyond");
});

test("21 folio HTML sanity: idle word bound, seeded beyond, not chatelaine/waif/berth", () => {
  const html = readFileSync(fileURLToPath(new URL("../index.html", import.meta.url)), "utf8");
  assert.match(html, /bound/);
  assert.match(html, /Score/);
  assert.match(html, /beyond/);
  assert.match(html, /90683/);
  assert.match(html, /const IDLE_WORD = "bound"/);
  assert.doesNotMatch(html, /const IDLE_WORD = "pale"/);
  assert.doesNotMatch(html, /const IDLE_WORD = "girt"/);
  assert.doesNotMatch(html, /const IDLE_WORD = "sheltered"/);
  assert.match(html, /pale-march|oak-pale-fence|jurisdiction-map|peat-ditch|iron-gall-plate|limestone-stones/i);
  assert.match(html, /15:50 Sydney · pale/);
  assert.match(html, /a session beyond the pale is not a hold/i);
  assert.doesNotMatch(html, /class="harbour-quay"|class="tide-board"|class="berth-chalkboard"/);
  assert.doesNotMatch(html, /class="hotel-rack"|class="key-rack"|class="numbered-hooks"/);
  assert.doesNotMatch(html, /class="passport-desk"|class="visa-stamp"|class="border-booth"/);
  assert.doesNotMatch(html, /class="foundling-home"|class="parish-ward"|class="intake-board"/);
  assert.doesNotMatch(html, /class="stillroom-apron"|class="waist-girdle"|class="oxidized-brass-plate"/);
  assert.doesNotMatch(html, /Oswald|Newsreader|Italiana/);
  assert.doesNotMatch(html, /Bebas Neue|Lora|Space Mono/);
  assert.doesNotMatch(html, /Abril Fatface|Cutive Mono|Fraunces/);
  assert.doesNotMatch(html, /Cormorant Garamond|Great Vibes|Pinyon Script/);
  assert.doesNotMatch(html, /millimeter slider|millimetre slider/i);
  assert.match(html, /<title>Pale/);
  assert.match(html, /UnifrakturCook|Cinzel/);
  assert.match(html, /Source Serif|IBM Plex Mono/);
  assert.match(html, /Admit bound/);
  assert.match(html, /Restore · #90683|restore to beyond/i);
});

test("22 HTML why-not names Chatelaine, Waif, leftover", () => {
  const html = readFileSync(fileURLToPath(new URL("../index.html", import.meta.url)), "utf8");
  assert.match(html, /NOT Chatelaine/);
  assert.match(html, /NOT Waif/);
  assert.match(html, /NOT Berth/);
  assert.match(html, /NOT Carrel/);
  assert.match(html, /NOT Byline/);
  assert.match(html, /NOT Fascia/);
  assert.match(html, /leftover/);
  assert.match(html, /millimeter-slider|millimetre-slider|millimeter slider|millimetre slider/);
});

test("23 README names contrasts and bound idle", () => {
  const readme = readFileSync(fileURLToPath(new URL("../README.md", import.meta.url)), "utf8");
  assert.match(readme, /NOT \*\*Chatelaine\*\*|NOT Chatelaine/);
  assert.match(readme, /NOT \*\*Waif\*\*|NOT Waif/);
  assert.match(readme, /NOT \*\*Berth\*\*|NOT Berth/);
  assert.match(readme, /\*\*bound\*\*/);
  assert.match(readme, /#90683/);
  assert.match(readme, /#76441/);
  assert.match(readme, /#79111/);
  assert.match(readme, /#90647/);
  assert.match(readme, /\/pale\//);
  assert.doesNotMatch(readme, /idle word is pale/i);
  assert.doesNotMatch(readme, /idle word is girt/i);
  assert.doesNotMatch(readme, /idle word is sheltered/i);
});

test("24 README and desk cite #90683 plus nearby and cross-ecosystem", () => {
  const readme = readFileSync(fileURLToPath(new URL("../README.md", import.meta.url)), "utf8");
  assert.match(readme, /90683/);
  assert.match(readme, /28903/);
  assert.match(readme, /30789/);
  assert.match(readme, /38065/);
  const html = readFileSync(fileURLToPath(new URL("../index.html", import.meta.url)), "utf8");
  assert.match(html, /90683/);
  assert.match(html, /76441/);
  assert.match(html, /79111/);
  assert.match(html, /90647/);
  assert.match(html, /28903/);
  assert.match(html, /\.claude\/settings\.json/);
  assert.match(html, /github.com\/anthropics\/claude-code\/issues\/90683/);
});

test("25 Slack skip on bound / control / off-pale; beyond chip is a fail never a hold", () => {
  for (const seed of [seedReset, seedControl, seedBound, seedOffPale]) {
    const result = decide(seed());
    assert.equal(result.slack, false, result.verdict);
    assert.match(slackPaleAlarm(result, {}).summary, /Would skip Slack/);
  }
  const beyond = decide(seedBeyond());
  assert.equal(beyond.slack, true);
  assert.match(beyond.slackCopy, /beyond/);
  assert.doesNotMatch(beyond.slackCopy, /hold|bound/i);
  const html = readFileSync(fileURLToPath(new URL("../index.html", import.meta.url)), "utf8");
  assert.match(html, /fail, never a hold|never a hold/);
});

test("26 beyond beats fail-open/unhooked/silent on the #90683 triad", () => {
  const facts = analyze(seedBeyond().pale);
  assert.equal(facts.triad, true);
  assert.equal(facts.failOpen, true);
  assert.equal(classify(seedBeyond().pale), "beyond");
  assert.equal(seedBeyond().pale.hooksRegisteredCount, 0);
  assert.equal(seedBeyond().pale.startedAboveRepo, true);
});

test("27 HTML parse prefers JSON so a pasted probe scores the fence", () => {
  const html = readFileSync(fileURLToPath(new URL("../index.html", import.meta.url)), "utf8");
  assert.match(html, /raw\.startsWith\("\{"\)|startsWith\("\{"\)/);
  const probe = score(seedBeyond().pale);
  assert.equal(probe.verdict, "beyond");
  assert.equal(probe.bound, false);
});

test("28 listen health names pale verbs", async () => {
  const server = listen(0);
  await new Promise((resolve) => server.once("listening", resolve));
  const { port } = server.address();
  const res = await fetch(`http://127.0.0.1:${port}/health`);
  const body = await res.json();
  assert.equal(body.product, "pale");
  assert.match(body.verbs, /beyond/);
  assert.match(body.verbs, /bound/);
  server.close();
});

test("29 assertScoreShape on every family verdict", () => {
  for (const seed of [
    seedBound,
    seedBeyond,
    seedUnhooked,
    seedRootless,
    seedSilent,
    seedAbove,
    seedSubdir,
    seedWalkless,
    seedFailOpen,
    seedOffPale,
  ]) {
    const result = decide(seed());
    assertScoreShape(result);
    assertIdleNeverPale(result);
    assert.ok(VERDICTS.includes(result.verdict), result.verdict);
  }
  assert.ok(ALARM_VERDICTS.includes("beyond"));
  assert.ok(LINEAR_VERDICTS.includes("beyond"));
  assert.ok(SLACK_VERDICTS.includes("unhooked"));
});

test("30 catalog indexes Pale featured, 64 products, Chatelaine unfeatured", () => {
  const catalog = JSON.parse(
    readFileSync(fileURLToPath(new URL("../../../catalog.json", import.meta.url)), "utf8"),
  );
  assert.equal(catalog.products.length, 64);
  assert.equal(catalog.products[0].slug, "pale");
  assert.equal(catalog.products[0].featured, true);
  assert.equal(
    catalog.products[0].summary,
    "15:50 pale: a session beyond the pale is not a hold. Score the fence or admit bound.",
  );
  const chatelaine = catalog.products.find((row) => row.slug === "chatelaine");
  const waif = catalog.products.find((row) => row.slug === "waif");
  const berth = catalog.products.find((row) => row.slug === "berth");
  const carrel = catalog.products.find((row) => row.slug === "carrel");
  assert.ok(chatelaine);
  assert.equal(chatelaine.featured, false);
  assert.ok(waif);
  assert.equal(waif.featured, false);
  assert.ok(berth);
  assert.ok(carrel);
});
