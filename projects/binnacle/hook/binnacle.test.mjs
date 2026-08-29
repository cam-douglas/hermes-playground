import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  fire,
  githubBinnacleLedger,
  linearBinnacleTicket,
  slackBinnacleAlarm,
} from "./adapters.mjs";
import {
  ALARM_VERDICTS,
  DEMO_BASE_URL,
  IDLE_WORD,
  LINEAR_VERDICTS,
  SLACK_VERDICTS,
  VERDICTS,
  analyze,
  classify,
  cloneBinnacle,
  decide,
  decideSeed,
  emptyAction,
  emptyBinnacle,
  feedOf,
  flagsOf,
  forbiddenIdleWords,
  housedOf,
  isIdle,
  reasonsOf,
  refusedOf,
  score,
  seed90551,
  seedBlind,
  seedBoxed,
  seedControl,
  seedDemanded,
  seedFatal,
  seedHoused,
  seedPrinted,
  seedRefused,
  seedReset,
  seedSplit,
  seedStripped,
  seedSwung,
  parseSessionTrace,
  verdictOf,
} from "./binnacle.mjs";
import { handle, listen } from "./index.mjs";

function assertIdleNeverBinnacle(result) {
  assert.equal(result.idleWord, "housed");
  assert.equal(IDLE_WORD, "housed");
  assert.doesNotMatch(result.idleWord, /binnacle/i);
  assert.doesNotMatch(IDLE_WORD, /^binnacle$/i);
  assert.doesNotMatch(result.idleWord, /empty|silent|magnetic|gyro|origin/i);
  assert.doesNotMatch(
    result.idleWord,
    /beamed|snug|hung|appointed|cinched|gauged|stamped|overrun|pratique|wound|bound|stilled|stabled|drained|flat|fit|spoilt|laid|unlinked|tight|banked|roosted|stocked|seated|heard|clear|paired|kernel|latched|upheld|sterling|home|valid|dry|sealed|quiet|seised|rung/,
  );
}

function assertScoreShape(result) {
  assert.equal(typeof result.verdict, "string");
  assert.ok(Array.isArray(result.reasons));
  assert.equal(typeof result.housed, "boolean");
  assert.equal(typeof result.feed, "string");
}

test("1 seed 90551 refused is refused, slack, linear, idleWord housed", () => {
  const seed = seedRefused();
  const result = decide(seed);
  assert.equal(result.verdict, "refused");
  assert.equal(result.state, "refused");
  assert.equal(result.decision, "refused");
  assert.equal(classify(seed.binnacle), "refused");
  assert.equal(verdictOf(seed.binnacle), "refused");
  assert.notEqual(result.verdict, "housed");
  assert.notEqual(result.verdict, "printed");
  assert.equal(result.alarm, true);
  assert.equal(result.slack, true);
  assert.equal(result.linear, true);
  assert.equal(result.github, true);
  assert.equal(result.binnacleRefused, true);
  assert.equal(result.refused, true);
  assert.equal(result.housed, false);
  assertIdleNeverBinnacle(result);
  assert.equal(result.session, "90551-refused");
  assert.equal(result.issue, 90551);
  assert.equal(result.interactiveTuiStarts, false);
  assert.equal(result.headlessPrintWorks, true);
  assert.equal(result.namedGatewayServesMessages, true);
  assert.equal(result.publicOriginReachable, false);
  assert.equal(result.baseUrl, DEMO_BASE_URL);
  assert.match(result.feed, /Refused|primary #90551/i);
  assert.equal(decideSeed("refused").verdict, "refused");
  assert.equal(decideSeed("90551-refused").verdict, "refused");
  assert.equal(decideSeed(90551).verdict, "refused");
});

test("2 idle/empty/{} is housed, never the product name, never empty, never error", () => {
  const result = decide(emptyAction("idle"));
  assert.equal(result.state, "housed");
  assert.equal(result.verdict, "housed");
  assert.equal(result.alarm, false);
  assert.equal(result.slack, false);
  assert.equal(result.housed, true);
  assert.equal(classify({}), "housed");
  assert.equal(classify(emptyBinnacle()), "housed");
  assert.equal(isIdle(emptyBinnacle()), true);
  assert.equal(score(emptyBinnacle()).housed, true);
  assertIdleNeverBinnacle(result);
  const bailed = decide({ action: "bail" });
  assert.equal(bailed.state, "housed");
  assert.equal(bailed.idleWord, "housed");
  const empty = decide({});
  assert.equal(empty.verdict, "housed");
  assert.match(empty.feed, /Housed/);
});

test("3 control / seedHoused stay housed", () => {
  const result = decide(seedControl());
  assert.equal(result.verdict, "housed");
  assert.equal(result.alarm, false);
  assert.equal(result.interactiveTuiStarts, true);
  assert.equal(result.helloToPublic, false);
  assert.equal(result.oauthProfileToPublic, false);
  assert.match(result.feed, /Housed/);
  assert.equal(decideSeed("control").verdict, "housed");
  assert.equal(decideSeed("housed").verdict, "housed");
  assert.equal(decideSeed("healthy").verdict, "housed");
  assert.equal(decide(seedHoused()).verdict, "housed");
});

test("4 swung: TUI still probes magnetic north", () => {
  const result = decide(seedSwung());
  assert.equal(result.verdict, "swung");
  assert.equal(result.binnacleSwung, true);
  assert.equal(result.helloToPublic, true);
  assert.equal(result.helloToBaseUrl, false);
  assert.equal(result.alarm, true);
  assert.equal(result.linear, true);
  assert.match(result.feed, /Swung|api\.anthropic\.com/);
  assert.equal(decideSeed("swung").verdict, "swung");
});

test("5 fatal: check fatal in TUI, advisory in -p", () => {
  const result = decide(seedFatal());
  assert.equal(result.verdict, "fatal");
  assert.equal(result.binnacleFatal, true);
  assert.equal(result.checkFatalInTui, true);
  assert.equal(result.checkAdvisoryInPrint, true);
  assert.equal(result.alarm, true);
  assert.equal(result.linear, false);
  assert.match(result.feed, /Fatal|advisory/);
  assert.equal(decideSeed("fatal").verdict, "fatal");
});

test("6 split: hello honors gyro; oauth still knocks MAG", () => {
  const result = decide(seedSplit());
  assert.equal(result.verdict, "split");
  assert.equal(result.binnacleSplit, true);
  assert.equal(result.helloToBaseUrl, true);
  assert.equal(result.oauthProfileToPublic, true);
  assert.equal(result.alarm, true);
  assert.match(result.feed, /Split|hello/);
  assert.equal(decideSeed("split").verdict, "split");
});

test("7 blind: error names the proxy, never the base URL", () => {
  const result = decide(seedBlind());
  assert.equal(result.verdict, "blind");
  assert.equal(result.binnacleBlind, true);
  assert.equal(result.errorNamesProxy, true);
  assert.equal(result.errorNamesBaseUrl, false);
  assert.equal(result.alarm, true);
  assert.match(result.feed, /Blind|proxy/);
  assert.equal(decideSeed("blind").verdict, "blind");
});

test("8 boxed: deny-by-default sandbox", () => {
  const result = decide(seedBoxed());
  assert.equal(result.verdict, "boxed");
  assert.equal(result.binnacleBoxed, true);
  assert.equal(result.denyByDefaultSandbox, true);
  assert.equal(result.alarm, true);
  assert.match(result.feed, /Boxed|sandbox/);
  assert.equal(decideSeed("boxed").verdict, "boxed");
});

test("9 demanded: public TLS still required while gateway serves messages", () => {
  const result = decide(seedDemanded());
  assert.equal(result.verdict, "demanded");
  assert.equal(result.binnacleDemanded, true);
  assert.equal(result.publicOriginReachable, false);
  assert.equal(result.namedGatewayServesMessages, true);
  assert.equal(result.alarm, true);
  assert.match(result.feed, /Demanded|trusted-TLS|public origin/);
  assert.equal(decideSeed("demanded").verdict, "demanded");
});

test("10 stripped: injected origin path stripped", () => {
  const result = decide(seedStripped());
  assert.equal(result.verdict, "stripped");
  assert.equal(result.binnacleStripped, true);
  assert.equal(result.pathStripped, true);
  assert.equal(result.alarm, true);
  assert.match(result.feed, /Stripped|#88345/);
  assert.equal(decideSeed("stripped").verdict, "stripped");
});

test("11 printed: claude -p on the same config works", () => {
  const result = decide(seedPrinted());
  assert.equal(result.verdict, "printed");
  assert.equal(result.binnaclePrinted, true);
  assert.equal(result.headlessPrintWorks, true);
  assert.equal(result.alarm, false);
  assert.equal(result.linear, false);
  assert.match(result.feed, /Printed|-p /);
  assert.equal(decideSeed("printed").verdict, "printed");
});

test("12 score() idle binnacle is housed and never alarms", () => {
  const result = score(emptyBinnacle());
  assertScoreShape(result);
  assert.equal(result.verdict, "housed");
  assert.equal(result.slack, false);
  assert.equal(result.alarm, false);
  assert.equal(result.housed, true);
  assert.equal(result.refused, false);
});

test("13 verdict vocabulary is exactly the ten words", () => {
  assert.deepEqual(VERDICTS, [
    "housed",
    "swung",
    "refused",
    "printed",
    "split",
    "fatal",
    "demanded",
    "blind",
    "boxed",
    "stripped",
  ]);
  assert.deepEqual(SLACK_VERDICTS, [
    "swung",
    "refused",
    "fatal",
    "split",
    "blind",
    "boxed",
    "demanded",
    "stripped",
  ]);
  assert.deepEqual(LINEAR_VERDICTS, ["refused", "swung"]);
  assert.deepEqual(ALARM_VERDICTS, SLACK_VERDICTS);
  assert.equal(IDLE_WORD, "housed");
  assert.doesNotMatch(IDLE_WORD, /binnacle$|beamed|rung|snug|magnetic/);
});

test("14 every seeded class classifies to itself", () => {
  const rows = [
    ["housed", seedReset],
    ["refused", seedRefused],
    ["swung", seedSwung],
    ["fatal", seedFatal],
    ["split", seedSplit],
    ["blind", seedBlind],
    ["boxed", seedBoxed],
    ["demanded", seedDemanded],
    ["stripped", seedStripped],
    ["printed", seedPrinted],
  ];
  for (const [word, seed] of rows) {
    assert.equal(decide(seed()).verdict, word, word);
    assert.equal(classify(seed().binnacle), word, word);
    assert.equal(score(seed().binnacle).verdict, word, word);
  }
});

test("15 admit does not lie: refused stays refused; swung stays swung", () => {
  const refused = decide({ ...seedRefused(), action: "admit" });
  assert.equal(refused.verdict, "refused");
  assert.equal(refused.action, "admit");
  assert.doesNotMatch(refused.verdict, /housed/);
  const swung = decide({ ...seedSwung(), action: "admit" });
  assert.equal(swung.verdict, "swung");
});

test("16 bail / housed / reset returns idle housed", () => {
  const bailed = decide({ ...seedRefused(), action: "bail" });
  assert.equal(bailed.verdict, "housed");
  assert.equal(isIdle(bailed.binnacle), true);
  assertIdleNeverBinnacle(bailed);
  assert.equal(decide({ action: "reset" }).verdict, "housed");
  assert.equal(decide({ action: "housed" }).verdict, "housed");
  assert.equal(decide(seedReset()).verdict, "housed");
});

test("17 restore / refused produces the #90551 refused binnacle", () => {
  const result = decide({ action: "restore", binnacle: emptyBinnacle() });
  assert.equal(result.verdict, "refused");
  assert.equal(result.action, "restore");
  assert.equal(result.issue, 90551);
  assert.equal(decide({ action: "refused" }).verdict, "refused");
});

test("18 flagsOf matches slack / github; linear follows refused/swung", () => {
  assert.deepEqual(flagsOf("refused"), { slack: true, linear: true, github: true, alarm: true });
  assert.deepEqual(flagsOf("swung"), { slack: true, linear: true, github: true, alarm: true });
  assert.deepEqual(flagsOf("fatal"), { slack: true, linear: false, github: true, alarm: true });
  assert.deepEqual(flagsOf("split"), { slack: true, linear: false, github: true, alarm: true });
  assert.deepEqual(flagsOf("blind"), { slack: true, linear: false, github: true, alarm: true });
  assert.deepEqual(flagsOf("boxed"), { slack: true, linear: false, github: true, alarm: true });
  assert.deepEqual(flagsOf("demanded"), { slack: true, linear: false, github: true, alarm: true });
  assert.deepEqual(flagsOf("stripped"), { slack: true, linear: false, github: true, alarm: true });
  assert.deepEqual(flagsOf("printed"), { slack: false, linear: false, github: true, alarm: false });
  assert.deepEqual(flagsOf("housed"), { slack: false, linear: false, github: true, alarm: false });
});

test("19 helpers, reasons, analyze, priority", () => {
  assert.equal(refusedOf(seedRefused().binnacle), true);
  assert.equal(housedOf(emptyBinnacle()), true);
  assert.equal(housedOf(seedRefused().binnacle), false);
  const reasons = reasonsOf(seedRefused().binnacle, "refused");
  assert.ok(reasons.some((row) => /#90551/.test(row)));
  const facts = analyze(seedRefused().binnacle);
  assert.equal(facts.refusedShape, true);
  assert.equal(facts.swungShape, false);
  assert.equal(facts.splitShape, true);
  assert.equal(classify(seedRefused().binnacle), "refused");
  assert.equal(classify(seed90551().binnacle), "refused");
});

test("20 forbidden idle list includes binnacle, empty, leftover names", () => {
  const words = forbiddenIdleWords();
  assert.ok(words.includes("binnacle"));
  assert.ok(words.includes("empty"));
  assert.ok(words.includes("magnetic"));
  assert.ok(words.includes("gyro"));
  assert.ok(words.includes("rung"));
  assert.ok(words.includes("visa"));
  assert.ok(words.includes("husk"));
  assert.ok(!words.includes("housed"));
});

test("21 demo sinks: Slack on alarm; Linear on refused; GitHub always", async () => {
  const refused = decide(seedRefused());
  const slack = slackBinnacleAlarm(refused, {});
  assert.equal(slack.mode, "demo");
  assert.match(slack.summary, /Would post to Slack/);
  assert.ok(Array.isArray(slack.body.blocks));
  const github = githubBinnacleLedger(refused, {});
  assert.equal(github.mode, "demo");
  assert.match(github.summary, /Would open a GitHub binnacle-ledger/);
  const linear = linearBinnacleTicket(refused, {});
  assert.equal(linear.mode, "demo");
  assert.match(linear.summary, /Would open a Linear ticket/);
  const honest = decide(seedControl());
  assert.match(linearBinnacleTicket(honest, {}).summary, /Would skip Linear/);
  const idle = decide(emptyAction("idle"));
  assert.match(slackBinnacleAlarm(idle, {}).summary, /Would skip Slack/);
  const fired = await fire(refused, {});
  assert.equal(fired.events.length, 3);
  assert.ok(fired.events.every((row) => row.ok === true));
});

test("22 Slack live plan uses SLACK_WEBHOOK alias and GITHUB_TOKEN alias", () => {
  const refused = decide(seedRefused());
  const slack = slackBinnacleAlarm(refused, { SLACK_WEBHOOK: "https://hooks.example/y" });
  assert.equal(slack.mode, "live");
  const github = githubBinnacleLedger(refused, { GITHUB_TOKEN: "tok" });
  assert.equal(github.mode, "live");
  const linear = linearBinnacleTicket(refused, { LINEAR_API_KEY: "lin" });
  assert.equal(linear.mode, "live");
});

test("23 handle alarm classes deny; housed / control / printed allow", async () => {
  const refused = await handle(seedRefused(), {});
  assert.equal(refused.permissionDecision, "deny");
  assert.match(refused.hookSpecificOutput.decision.message, /refused/);
  assert.equal((await handle(seedSwung(), {})).permissionDecision, "deny");
  assert.equal((await handle(seedFatal(), {})).permissionDecision, "deny");
  assert.equal((await handle(seedSplit(), {})).permissionDecision, "deny");
  assert.equal((await handle(seedBlind(), {})).permissionDecision, "deny");
  const idle = await handle({ action: "bail" }, {});
  assert.equal(idle.permissionDecision, "allow");
  assert.match(idle.hookSpecificOutput.decision.message, /housed/);
  assert.equal((await handle(seedControl(), {})).permissionDecision, "allow");
  assert.equal((await handle(seedPrinted(), {})).permissionDecision, "allow");
});

test("24 listen GET health and POST empty body is housed", async () => {
  const server = listen(19736);
  await new Promise((resolve) => server.once("listening", resolve));
  const health = await fetch("http://127.0.0.1:19736/health");
  const info = await health.json();
  assert.equal(info.product, "binnacle");
  assert.match(info.verbs, /refused/);
  const res = await fetch("http://127.0.0.1:19736/", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: "{}",
  });
  const body = await res.json();
  assert.equal(body.verdict, "housed");
  assert.equal(body.idleWord, "housed");
  const scored = await fetch("http://127.0.0.1:19736/", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(seedRefused()),
  });
  const scoredBody = await scored.json();
  assert.equal(scoredBody.verdict, "refused");
  await new Promise((resolve) => server.close(resolve));
});

test("25 listen rejects non-JSON verbs besides health", async () => {
  const server = listen(19737);
  await new Promise((resolve) => server.once("listening", resolve));
  const put = await fetch("http://127.0.0.1:19737/", { method: "PUT" });
  assert.equal(put.status, 405);
  await new Promise((resolve) => server.close(resolve));
});

test("26 parseSessionTrace reads a #90551 refused report", () => {
  const binnacle = parseSessionTrace(
    "Interactive TUI will not start unless it can reach api.anthropic.com. ANTHROPIC_BASE_URL is set. claude -p works.",
  );
  assert.equal(classify(binnacle), "refused");
});

test("27 parseSessionTrace reads swung, fatal, split, blind", () => {
  assert.equal(
    classify(parseSessionTrace("TUI still probes api.anthropic.com despite named BASE_URL.")),
    "swung",
  );
  assert.equal(
    classify(parseSessionTrace("same check is fatal in TUI and only advisory in -p")),
    "fatal",
  );
  assert.equal(
    classify(parseSessionTrace("/api/hello honors BASE_URL; oauth/profile and event_logging do not")),
    "split",
  );
  assert.equal(
    classify(parseSessionTrace("error names the proxy, never the configured base URL")),
    "blind",
  );
});

test("28 score() accepts the documented probe shape", () => {
  const result = score({
    session: "demo",
    issue: 90551,
    source: "tui",
    baseUrl: DEMO_BASE_URL,
    publicOriginReachable: false,
    namedGatewayServesMessages: true,
    interactiveTuiStarts: false,
    headlessPrintWorks: true,
    helloToBaseUrl: true,
    helloToPublic: true,
    oauthProfileToPublic: true,
    eventLoggingToPublic: true,
    checkFatalInTui: true,
    checkAdvisoryInPrint: true,
    errorNamesProxy: true,
    errorNamesBaseUrl: false,
    pathStripped: false,
    denyByDefaultSandbox: true,
    scored: false,
  });
  assert.equal(result.verdict, "refused");
  const swung = score({
    baseUrl: DEMO_BASE_URL,
    interactiveTuiStarts: true,
    helloToPublic: true,
    helloToBaseUrl: false,
    oauthProfileToPublic: true,
  });
  assert.equal(swung.verdict, "swung");
});

test("29 nested binnacle / probe fields clone", () => {
  const binnacle = cloneBinnacle({ probe: seedRefused().binnacle });
  assert.equal(classify(binnacle), "refused");
});

test("30 fire live slack posts when fetch ok", async () => {
  const refused = decide(seedRefused());
  const events = await fire(
    refused,
    { BINNACLE_SLACK_WEBHOOK: "https://hooks.example/x" },
    async () => ({
      ok: true,
      status: 200,
      json: async () => ({}),
    }),
  );
  const slack = events.events.find((row) => row.adapter === "slack");
  assert.equal(slack.ok, true);
  assert.match(slack.summary, /Posted refused/);
});

test("31 desk HTML sanity: idle word housed, seeded refused, not pirn/cotter/fob/ordo", () => {
  const html = readFileSync(fileURLToPath(new URL("../index.html", import.meta.url)), "utf8");
  assert.match(html, /housed/);
  assert.match(html, /Score/);
  assert.match(html, /refused/);
  assert.match(html, /90551/);
  assert.match(html, /seedOf\("refused"\)|binnacle = seedOf\("refused"\)/);
  assert.match(html, /const IDLE_WORD = "housed"/);
  assert.doesNotMatch(html, /const IDLE_WORD = "binnacle"/);
  assert.doesNotMatch(html, /const IDLE_WORD = "rung"/);
  assert.doesNotMatch(html, /const IDLE_WORD = "beamed"/);
  assert.match(
    html,
    /binnacle-house|chart-table|gyro-card|mag-card|oil-lamp|night-order|compass-rose|heading-plate|tiller-lamp/i,
  );
  assert.match(html, /20:50 Sydney · binnacle/);
  assert.match(html, /named heading is not a hold/i);
  assert.doesNotMatch(html, /class="loom-shed"|class="oak-frame"|class="pirn-rack"|class="yarn-package"/);
  assert.doesNotMatch(html, /class="pin-tray"|class="felt-bed"|class="split-pin"|class="caliper-beam"/);
  assert.doesNotMatch(html, /class="fob-rail"|class="brass-hook"|class="room-tag"|class="night-clerk"/);
  assert.doesNotMatch(html, /class="parchment-leaf"|class="rubric-rule"|class="kalendar-hours"|class="missal-gutter"/);
  assert.doesNotMatch(html, /class="leather-cinch"|class="brass-buckle"|class="strap-holes"/);
  assert.doesNotMatch(html, /class="oak-cask"|class="iron-hoop"|class="bung-seal"|class="gauging-rod"/);
  assert.doesNotMatch(html, /class="stone-belfry"|class="bronze-bell"|class="slack-rope"|class="bell-cote"/);
  assert.doesNotMatch(html, /Syne|Literata|IBM Plex Mono/);
  assert.doesNotMatch(html, /Big Shoulders Stencil|Sora|Share Tech Mono/);
  assert.doesNotMatch(html, /Italiana|Newsreader/);
  assert.doesNotMatch(html, /Cormorant Garamond|Crimson Pro/);
  assert.doesNotMatch(html, /Fraunces|Barlow Condensed/);
  assert.doesNotMatch(html, /Spectral|Nunito Sans/);
  assert.doesNotMatch(html, /millimeter slider|millimetre slider/i);
  assert.match(html, /<title>Binnacle/);
  assert.match(html, /Bodoni Moda|Figtree|DM Mono/);
  assert.match(html, /Reset · housed|reset to housed/i);
  assert.match(html, /Restore · #90551|restore to refused/i);
});

test("32 HTML why-not names Visa, Husk, Sprag, Reed, Gasket, Tain", () => {
  const html = readFileSync(fileURLToPath(new URL("../index.html", import.meta.url)), "utf8");
  assert.match(html, /NOT Visa/);
  assert.match(html, /NOT Husk/);
  assert.match(html, /NOT Sprag/);
  assert.match(html, /NOT Reed/);
  assert.match(html, /NOT Gasket/);
  assert.match(html, /NOT Tain/);
  assert.match(html, /leftover/);
  assert.match(html, /millimeter-slider|millimetre-slider|millimeter slider|millimetre slider/);
});

test("33 README names contrasts and housed idle", () => {
  const readme = readFileSync(fileURLToPath(new URL("../README.md", import.meta.url)), "utf8");
  assert.match(readme, /NOT \*\*Visa\*\*|NOT Visa/);
  assert.match(readme, /NOT \*\*Husk\*\*|NOT Husk/);
  assert.match(readme, /NOT \*\*Gasket\*\*|NOT Gasket/);
  assert.match(readme, /NOT \*\*Tain\*\*|NOT Tain/);
  assert.match(readme, /\*\*housed\*\*/);
  assert.match(readme, /#90551/);
  assert.match(readme, /\/binnacle\//);
  assert.doesNotMatch(readme, /idle word is binnacle/i);
  assert.doesNotMatch(readme, /idle word is rung/i);
});

test("34 working -p and green gateway lamps do not force housed when TUI refuses", () => {
  const refused = score({
    baseUrl: DEMO_BASE_URL,
    namedGatewayServesMessages: true,
    headlessPrintWorks: true,
    interactiveTuiStarts: false,
    publicOriginReachable: false,
    helloToBaseUrl: true,
    helloToPublic: true,
    oauthProfileToPublic: true,
    eventLoggingToPublic: true,
    checkFatalInTui: true,
    checkAdvisoryInPrint: true,
    denyByDefaultSandbox: true,
  });
  assert.equal(refused.verdict, "refused");
  assert.equal(refused.housed, false);
  assert.equal(refused.headlessPrintWorks, true);
});

test("35 housed hold requires TUI on the named origin with no magnetic knock", () => {
  const hold = score({
    baseUrl: DEMO_BASE_URL,
    interactiveTuiStarts: true,
    headlessPrintWorks: true,
    helloToBaseUrl: true,
    helloToPublic: false,
    oauthProfileToPublic: false,
    eventLoggingToPublic: false,
    namedGatewayServesMessages: true,
    pathStripped: false,
  });
  assert.equal(hold.verdict, "housed");
});

test("36 Slack skip on housed / control / printed", () => {
  for (const seed of [seedReset, seedControl, seedHoused, seedPrinted]) {
    const result = decide(seed());
    assert.equal(result.slack, false, result.verdict);
    assert.match(slackBinnacleAlarm(result, {}).summary, /Would skip Slack/);
  }
});
