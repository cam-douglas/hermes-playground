import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  fire,
  githubFobLedger,
  linearRackTicket,
  slackFobAlarm,
} from "./adapters.mjs";
import {
  ALARM_VERDICTS,
  IDLE_WORD,
  LINEAR_VERDICTS,
  SLACK_VERDICTS,
  VERDICTS,
  analyze,
  classify,
  cloneRack,
  decide,
  decideSeed,
  emptyAction,
  emptyRack,
  feedOf,
  flagsOf,
  forbiddenIdleWords,
  hungOf,
  isIdle,
  maskSecrets,
  mintedOf,
  parseKeychainDump,
  parseSessionTrace,
  reasonsOf,
  score,
  seed90527,
  seedControl,
  seedFalseCut,
  seedHoard,
  seedHung,
  seedMinted,
  seedScopeKey,
  seedSplit,
  verdictOf,
} from "./fob.mjs";
import { handle, listen } from "./index.mjs";

function assertIdleNeverFob(result) {
  assert.equal(result.idleWord, "hung");
  assert.equal(IDLE_WORD, "hung");
  assert.doesNotMatch(result.idleWord, /fob/i);
  assert.doesNotMatch(IDLE_WORD, /^fob$/i);
  assert.doesNotMatch(result.idleWord, /empty|keychain|login|rack|hook/i);
  assert.doesNotMatch(
    result.idleWord,
    /appointed|cinched|gauged|stamped|overrun|pratique|wound|bound|stilled|stabled|drained|flat|fit|spoilt|laid|unlinked|tight|banked|roosted|stocked|seated|heard|clear|paired|kernel|latched|upheld|sterling|home|valid|dry|sealed|quiet|seised/,
  );
}

function assertScoreShape(result) {
  assert.equal(typeof result.verdict, "string");
  assert.ok(Array.isArray(result.reasons));
  assert.equal(typeof result.hung, "boolean");
  assert.equal(typeof result.feed, "string");
}

test("1 seed 90527 minted is minted, slack, linear, idleWord hung", () => {
  const seed = seedMinted();
  const result = decide(seed);
  assert.equal(result.verdict, "minted");
  assert.equal(result.state, "minted");
  assert.equal(result.decision, "minted");
  assert.equal(classify(seed.rack), "minted");
  assert.equal(verdictOf(seed.rack), "minted");
  assert.notEqual(result.verdict, "hung");
  assert.notEqual(result.verdict, "hoard");
  assert.equal(result.alarm, true);
  assert.equal(result.slack, true);
  assert.equal(result.linear, true);
  assert.equal(result.github, true);
  assert.equal(result.rackMinted, true);
  assert.equal(result.minted, true);
  assert.equal(result.hung, false);
  assertIdleNeverFob(result);
  assert.equal(result.session, "90527-minted");
  assert.equal(result.issue, 90527);
  assert.ok(result.itemCount >= 2);
  assert.match(result.feed, /Minted|primary #90527/i);
  assert.equal(decideSeed("minted").verdict, "minted");
  assert.equal(decideSeed("90527-minted").verdict, "minted");
  assert.equal(decideSeed(90527).verdict, "minted");
});

test("2 idle/empty/{} is hung, never the product name, never empty, never error", () => {
  const result = decide(emptyAction("idle"));
  assert.equal(result.state, "hung");
  assert.equal(result.verdict, "hung");
  assert.equal(result.alarm, false);
  assert.equal(result.slack, false);
  assert.equal(result.hung, true);
  assert.equal(classify({}), "hung");
  assert.equal(classify(emptyRack()), "hung");
  assert.equal(isIdle(emptyRack()), true);
  assert.equal(score(emptyRack()).oneLive || score(emptyRack()).hung, true);
  assertIdleNeverFob(result);
  const bailed = decide({ action: "bail" });
  assert.equal(bailed.state, "hung");
  assert.equal(bailed.idleWord, "hung");
  const empty = decide({});
  assert.equal(empty.verdict, "hung");
  assert.match(empty.feed, /Hung/);
});

test("3 control one live fob stays hung", () => {
  const result = decide(seedControl());
  assert.equal(result.verdict, "hung");
  assert.equal(result.alarm, false);
  assert.equal(result.itemCount, 1);
  assert.equal(result.oneLive, true);
  assert.match(result.feed, /Hung/);
  assert.equal(decideSeed("control").verdict, "hung");
  assert.equal(decideSeed("healthy").verdict, "hung");
});

test("4 hoard: 75 items, 1156 historical copies", () => {
  const result = decide(seedHoard());
  assert.equal(result.verdict, "hoard");
  assert.equal(result.rackHoard, true);
  assert.equal(result.itemCount, 75);
  assert.equal(result.summary.historicalMcpOAuthCopies, 1156);
  assert.equal(result.alarm, true);
  assert.equal(result.linear, true);
  assert.match(result.feed, /Hoard|#84275/);
  assert.equal(decideSeed("hoard").verdict, "hoard");
  assert.equal(decideSeed(84275).verdict, "hoard");
});

test("5 split: keychain mdat advanced, file mtime did not", () => {
  const result = decide(seedSplit());
  assert.equal(result.verdict, "split");
  assert.equal(result.rackSplit, true);
  assert.equal(result.loginExpired, true);
  assert.equal(result.alarm, true);
  assert.match(result.feed, /Split|#78020/);
  assert.equal(decideSeed("split").verdict, "split");
  assert.equal(decideSeed(78020).verdict, "split");
});

test("6 false-cut: login success never persisted", () => {
  const result = decide(seedFalseCut());
  assert.equal(result.verdict, "false-cut");
  assert.equal(result.rackFalseCut, true);
  assert.equal(result.alarm, true);
  assert.equal(result.linear, false);
  assert.match(result.feed, /False-cut|#89801|#79407/);
  assert.equal(decideSeed("false-cut").verdict, "false-cut");
  assert.equal(decideSeed(89801).verdict, "false-cut");
});

test("7 scope-key: CLI vs desktop scopes diverge", () => {
  const result = decide(seedScopeKey());
  assert.equal(result.verdict, "scope-key");
  assert.equal(result.rackScopeKey, true);
  assert.equal(result.scopesDiverge, true);
  assert.equal(result.alarm, true);
  assert.match(result.feed, /Scope-key|CredentialKey|#90527/);
  assert.equal(decideSeed("scope-key").verdict, "scope-key");
});

test("8 score() idle rack is hung and never alarms", () => {
  const result = score(emptyRack());
  assertScoreShape(result);
  assert.equal(result.verdict, "hung");
  assert.equal(result.slack, false);
  assert.equal(result.alarm, false);
  assert.equal(result.hung, true);
  assert.equal(result.minted, false);
});

test("9 verdict vocabulary is exactly the six words", () => {
  assert.deepEqual(VERDICTS, ["hung", "minted", "hoard", "split", "false-cut", "scope-key"]);
  assert.deepEqual(SLACK_VERDICTS, ["minted", "hoard", "split", "false-cut", "scope-key"]);
  assert.deepEqual(LINEAR_VERDICTS, ["minted", "hoard", "split"]);
  assert.deepEqual(ALARM_VERDICTS, SLACK_VERDICTS);
  assert.equal(IDLE_WORD, "hung");
  assert.doesNotMatch(IDLE_WORD, /fob$|appointed|cinched|gauged|stamped|overrun/);
});

test("10 every seeded class classifies to itself", () => {
  const rows = [
    ["hung", seedHung],
    ["minted", seedMinted],
    ["hoard", seedHoard],
    ["split", seedSplit],
    ["false-cut", seedFalseCut],
    ["scope-key", seedScopeKey],
  ];
  for (const [word, seed] of rows) {
    assert.equal(decide(seed()).verdict, word, word);
    assert.equal(classify(seed().rack), word, word);
    assert.equal(score(seed().rack).verdict, word, word);
  }
});

test("11 admit does not lie: minted stays minted", () => {
  const result = decide({ ...seedMinted(), action: "admit" });
  assert.equal(result.verdict, "minted");
  assert.equal(result.action, "admit");
  assert.doesNotMatch(result.verdict, /hung/);
});

test("12 bail / hung / reset returns idle hung", () => {
  const bailed = decide({ ...seedMinted(), action: "bail" });
  assert.equal(bailed.verdict, "hung");
  assert.equal(isIdle(bailed.rack), true);
  assertIdleNeverFob(bailed);
  assert.equal(decide({ action: "reset" }).verdict, "hung");
  assert.equal(decide({ action: "hung" }).verdict, "hung");
});

test("13 restore / minted produces the #90527 minted rack", () => {
  const result = decide({ action: "restore", rack: emptyRack() });
  assert.equal(result.verdict, "minted");
  assert.equal(result.action, "restore");
  assert.ok(result.itemCount >= 2);
  assert.equal(decide({ action: "minted" }).verdict, "minted");
});

test("14 flagsOf matches slack / github; linear follows minted/hoard/split", () => {
  assert.deepEqual(flagsOf("minted"), { slack: true, linear: true, github: true, alarm: true });
  assert.deepEqual(flagsOf("hoard"), { slack: true, linear: true, github: true, alarm: true });
  assert.deepEqual(flagsOf("split"), { slack: true, linear: true, github: true, alarm: true });
  assert.deepEqual(flagsOf("false-cut"), { slack: true, linear: false, github: true, alarm: true });
  assert.deepEqual(flagsOf("scope-key"), { slack: true, linear: false, github: true, alarm: true });
  assert.deepEqual(flagsOf("hung"), { slack: false, linear: false, github: true, alarm: false });
});

test("15 helpers, reasons, maskSecrets", () => {
  assert.equal(mintedOf(seedMinted().rack), true);
  assert.equal(hungOf(emptyRack()), true);
  assert.equal(hungOf(seedMinted().rack), false);
  const reasons = reasonsOf(seedMinted().rack, "minted");
  assert.ok(reasons.some((row) => /#90527/.test(row)));
  const masked = maskSecrets('accessToken":"sk-ant-oat01-SUPERSECRETTOKENVALUE000000000000000000"');
  assert.doesNotMatch(masked, /SUPERSECRET/);
  assert.match(masked, /••••|sk-ant-••••/);
});

test("16 forbidden idle list includes fob, empty, leftover names", () => {
  const words = forbiddenIdleWords();
  assert.ok(words.includes("fob"));
  assert.ok(words.includes("empty"));
  assert.ok(words.includes("appointed"));
  assert.ok(words.includes("cinched"));
  assert.ok(words.includes("gauged"));
  assert.ok(words.includes("stamped"));
  assert.ok(words.includes("ordo"));
  assert.ok(!words.includes("hung"));
});

test("17 demo sinks: Slack on alarm; Linear on minted; GitHub always", async () => {
  const minted = decide(seedMinted());
  const slack = slackFobAlarm(minted, {});
  assert.equal(slack.mode, "demo");
  assert.match(slack.summary, /Would post to Slack/);
  assert.ok(Array.isArray(slack.body.blocks));
  const github = githubFobLedger(minted, {});
  assert.equal(github.mode, "demo");
  assert.match(github.summary, /Would open a GitHub fob-ledger/);
  const linear = linearRackTicket(minted, {});
  assert.equal(linear.mode, "demo");
  assert.match(linear.summary, /Would open a Linear ticket/);
  const honest = decide(seedControl());
  assert.match(linearRackTicket(honest, {}).summary, /Would skip Linear/);
  const idle = decide(emptyAction("idle"));
  assert.match(slackFobAlarm(idle, {}).summary, /Would skip Slack/);
  const fired = await fire(minted, {});
  assert.equal(fired.events.length, 3);
  assert.ok(fired.events.every((row) => row.ok === true));
});

test("18 Slack live plan uses SLACK_WEBHOOK alias and GITHUB_TOKEN alias", () => {
  const minted = decide(seedMinted());
  const slack = slackFobAlarm(minted, { SLACK_WEBHOOK: "https://hooks.example/y" });
  assert.equal(slack.mode, "live");
  const github = githubFobLedger(minted, { GITHUB_TOKEN: "tok" });
  assert.equal(github.mode, "live");
  const linear = linearRackTicket(minted, { LINEAR_API_KEY: "lin" });
  assert.equal(linear.mode, "live");
});

test("19 handle alarm classes deny; hung / control allow", async () => {
  const minted = await handle(seedMinted(), {});
  assert.equal(minted.permissionDecision, "deny");
  assert.match(minted.hookSpecificOutput.decision.message, /minted/);
  assert.equal((await handle(seedHoard(), {})).permissionDecision, "deny");
  assert.equal((await handle(seedSplit(), {})).permissionDecision, "deny");
  assert.equal((await handle(seedFalseCut(), {})).permissionDecision, "deny");
  assert.equal((await handle(seedScopeKey(), {})).permissionDecision, "deny");
  const idle = await handle({ action: "bail" }, {});
  assert.equal(idle.permissionDecision, "allow");
  assert.match(idle.hookSpecificOutput.decision.message, /hung/);
  assert.equal((await handle(seedControl(), {})).permissionDecision, "allow");
});

test("20 listen GET health and POST empty body is hung", async () => {
  const server = listen(19526);
  await new Promise((resolve) => server.once("listening", resolve));
  const health = await fetch("http://127.0.0.1:19526/health");
  const info = await health.json();
  assert.equal(info.product, "fob");
  assert.match(info.verbs, /minted/);
  const res = await fetch("http://127.0.0.1:19526/", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: "{}",
  });
  const body = await res.json();
  assert.equal(body.verdict, "hung");
  assert.equal(body.idleWord, "hung");
  const scored = await fetch("http://127.0.0.1:19526/", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(seedMinted()),
  });
  const scoredBody = await scored.json();
  assert.equal(scoredBody.verdict, "minted");
  await new Promise((resolve) => server.close(resolve));
});

test("21 listen rejects non-JSON verbs besides health", async () => {
  const server = listen(19527);
  await new Promise((resolve) => server.once("listening", resolve));
  const put = await fetch("http://127.0.0.1:19527/", { method: "PUT" });
  assert.equal(put.status, 405);
  await new Promise((resolve) => server.close(resolve));
});

test("22 parseSessionTrace reads a dump-keychain mint", () => {
  const rack = parseSessionTrace(
    'security dump-keychain | grep Claude Code-credentials\n"svce"<blob>="Claude Code-credentials-1eb0243d"\nnew hash-suffixed item per login instead of updating the live item',
  );
  assert.equal(classify(rack), "minted");
});

test("23 parseSessionTrace reads hoard counts and login-expired split", () => {
  assert.equal(
    classify(parseSessionTrace("75 items, 1,156 duplicated OAuth tokens, never cleaned")),
    "hoard",
  );
  const split = parseSessionTrace(
    "Keychain-only rotation. mdat advanced. .credentials.json mtime unchanged. Login expired · Please run /login. 401 OAuth access token has been revoked.",
  );
  assert.equal(classify(split), "split");
  assert.equal(split.loginExpired, true);
});

test("24 parseKeychainDump extracts service names without secrets", () => {
  const items = parseKeychainDump(
    'keychain: "/Users/x/Library/Keychains/login.keychain-db"\n"svce"<blob>="Claude Code-credentials-1eb0243d"\n"svce"<blob>="Claude Code-credentials-525493ee"\n"password"<blob>="sk-ant-oat01-SHOULDNOTKEEP"',
  );
  assert.equal(items.length, 2);
  assert.equal(items[0].hash, "1eb0243d");
  assert.ok(items.every((row) => !/SHOULDNOTKEEP/.test(row.service)));
});

test("25 nested rack / board / probe fields clone", () => {
  const rack = cloneRack({ board: seedMinted().rack });
  assert.equal(classify(rack), "minted");
});

test("26 fire live slack posts when fetch ok", async () => {
  const minted = decide(seedMinted());
  const events = await fire(minted, { FOB_SLACK_WEBHOOK: "https://hooks.example/x" }, async () => ({
    ok: true,
    status: 200,
    json: async () => ({}),
  }));
  const slack = events.events.find((row) => row.adapter === "slack");
  assert.equal(slack.ok, true);
  assert.match(slack.summary, /Posted minted/);
});

test("27 desk HTML sanity: idle word hung, seeded minted, not ordo/cinch/ullage/visa", () => {
  const html = readFileSync(fileURLToPath(new URL("../index.html", import.meta.url)), "utf8");
  assert.match(html, /hung/);
  assert.match(html, /Score/);
  assert.match(html, /minted/);
  assert.match(html, /90527/);
  assert.match(html, /seedOf\("minted"\)|rack = seedOf\("minted"\)/);
  assert.match(html, /const IDLE_WORD = "hung"/);
  assert.doesNotMatch(html, /const IDLE_WORD = "fob"/);
  assert.doesNotMatch(html, /const IDLE_WORD = "appointed"/);
  assert.doesNotMatch(html, /const IDLE_WORD = "cinched"/);
  assert.doesNotMatch(html, /const IDLE_WORD = "gauged"/);
  assert.match(html, /fob-rail|brass-hook|room-tag|night-clerk|brass-plate/i);
  assert.match(html, /17:50 Sydney · fob/);
  assert.match(html, /new (stamp|login) is not a hold/i);
  assert.doesNotMatch(html, /class="parchment-leaf"|class="rubric-rule"|class="kalendar-hours"|class="missal-gutter"/);
  assert.doesNotMatch(html, /class="leather-cinch"|class="brass-buckle"|class="strap-holes"|class="oil-lamp"|class="bridle-hooks"/);
  assert.doesNotMatch(html, /class="passport-folio"|class="brass-stamp"|class="teal-stripe"|class="ink-pad"/);
  assert.doesNotMatch(html, /class="oak-cask"|class="iron-hoop"|class="bung-seal"|class="gauging-rod"/);
  assert.doesNotMatch(html, /Cormorant Garamond|Crimson Pro/);
  assert.doesNotMatch(html, /Fraunces|Barlow Condensed/);
  assert.doesNotMatch(html, /Libre Baskerville|Source Sans 3/);
  assert.doesNotMatch(html, /Teko|Atkinson Hyperlegible|Bodoni Moda/);
  assert.doesNotMatch(html, /Spectral|Nunito Sans/);
  assert.doesNotMatch(html, /millimeter slider|millimetre slider/i);
  assert.match(html, /<title>Fob/);
  assert.match(html, /Italiana|IBM Plex Mono|Newsreader/);
  assert.match(html, /Reset · hung|reset to hung/i);
  assert.match(html, /Restore · minted|restore to minted/i);
  assert.match(html, /Login expired · Please run \/login/);
});

test("28 HTML why-not names Visa, Snib, Chute, Wraith, Iota, Ordo, Cinch, Ullage", () => {
  const html = readFileSync(fileURLToPath(new URL("../index.html", import.meta.url)), "utf8");
  assert.match(html, /NOT Visa/);
  assert.match(html, /NOT Snib/);
  assert.match(html, /NOT Chute/);
  assert.match(html, /NOT Wraith/);
  assert.match(html, /NOT Iota/);
  assert.match(html, /NOT Ordo/);
  assert.match(html, /NOT Cinch/);
  assert.match(html, /NOT Ullage/);
  assert.match(html, /leftover/);
  assert.match(html, /millimeter-slider|millimetre-slider|millimeter slider|millimetre slider/);
});

test("29 README names contrasts and hung idle", () => {
  const readme = readFileSync(fileURLToPath(new URL("../README.md", import.meta.url)), "utf8");
  assert.match(readme, /NOT Visa/);
  assert.match(readme, /NOT Ordo/);
  assert.match(readme, /NOT Cinch/);
  assert.match(readme, /NOT Ullage/);
  assert.match(readme, /\*\*hung\*\*/);
  assert.match(readme, /#90527/);
  assert.doesNotMatch(readme, /idle word is fob/i);
  assert.doesNotMatch(readme, /idle word is appointed/i);
});

test("30 #90527 miniature minted a new hash beside the live item", () => {
  const facts = analyze(seedMinted().rack);
  assert.equal(facts.justMinted || facts.minted, true);
  assert.ok(facts.itemCount >= 2);
  assert.equal(classify(seed90527().rack), "minted");
});

test("31 Slack skip on hung / control", () => {
  for (const seed of [seedHung, seedControl]) {
    const result = decide(seed());
    assert.equal(result.slack, false, result.verdict);
    assert.match(slackFobAlarm(result, {}).summary, /Would skip Slack/);
  }
});
