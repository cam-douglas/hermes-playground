import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  fire,
  githubQuoinLedger,
  linearQuoinTicket,
  slackQuoinAlarm,
} from "./adapters.mjs";
import {
  ALARM_VERDICTS,
  CODEX_PWSH_QUOTE_ISSUE,
  COLLAPSE_ISSUE,
  DEMO_COMPOSED_90630,
  DEMO_PROBE_90630,
  DEMO_PYTHON_PROBE,
  DEMO_PYTHON_TRACE,
  DEMO_RECEIVED_90630,
  FEATURED_ISSUE,
  HEREDOC_PLATFORM_ISSUE,
  IDLE_WORD,
  LINEAR_VERDICTS,
  SLACK_VERDICTS,
  VERDICTS,
  WINDOWS_HALVE_ISSUE,
  WINDOWS_STRIP_ISSUE,
  WRITE_UNICODE_ISSUE,
  analyze,
  applyOneUnescapePass,
  classify,
  cloneQuoin,
  countBackslashes,
  decide,
  decideSeed,
  emptyAction,
  emptyQuoin,
  feedOf,
  flagsOf,
  forbiddenIdleWords,
  isIdle,
  lockedOf,
  oneUnescapePass,
  parseSessionTrace,
  reasonsOf,
  score,
  seed90630,
  seedCollapsed,
  seedControl,
  seedDoubleSlash,
  seedLocked,
  seedMisattributed,
  seedPathBroke,
  seedPowerShell,
  seedRegexBroke,
  seedReset,
  seedSealedOpen,
  seedShifted,
  seedUnescaped,
  seedWindowsHalve,
  shiftedOf,
  verdictOf,
} from "./quoin.mjs";
import { handle, listen } from "./index.mjs";

const PRIOR_IDLES =
  /posted|bunged|belayed|rove|keyed|housed|beamed|snug|hung|appointed|cinched|gauged|stamped|overrun|pratique|wound|bound|stilled|stabled|drained|flat|fit|spoilt|laid|unlinked|tight|banked|roosted|stocked|seated|heard|clear|paired|kernel|latched|upheld|sterling|home|valid|dry|sealed|quiet|seised|rung|moored|stowed|caught|yanked/;

function assertIdleNeverQuoin(result) {
  assert.equal(result.idleWord, "locked");
  assert.equal(IDLE_WORD, "locked");
  assert.doesNotMatch(result.idleWord, /quoin/i);
  assert.doesNotMatch(IDLE_WORD, /^quoin$/i);
  assert.notEqual(result.idleWord, "quoin");
  assert.doesNotMatch(result.idleWord, /empty|silent|mute|idle|dead|sealed/i);
  assert.doesNotMatch(result.idleWord, PRIOR_IDLES);
}

function assertScoreShape(result) {
  assert.equal(typeof result.verdict, "string");
  assert.ok(Array.isArray(result.reasons));
  assert.equal(typeof result.locked, "boolean");
  assert.equal(typeof result.feed, "string");
}

test("1 seed 90630 shifted is shifted, slack, linear, idleWord locked, never locked", () => {
  const seed = seedShifted();
  const result = decide(seed);
  assert.equal(result.verdict, "shifted");
  assert.equal(result.state, "shifted");
  assert.equal(result.decision, "shifted");
  assert.equal(classify(seed.quoin), "shifted");
  assert.equal(verdictOf(seed.quoin), "shifted");
  assert.notEqual(result.verdict, "locked");
  assert.ok(VERDICTS.includes(result.verdict));
  assert.equal(result.alarm, true);
  assert.equal(result.slack, true);
  assert.equal(result.linear, true);
  assert.equal(result.github, true);
  assert.equal(result.quoinShifted, true);
  assert.equal(result.shifted, true);
  assert.equal(result.locked, false);
  assertIdleNeverQuoin(result);
  assert.equal(result.session, "90630-shifted");
  assert.equal(result.issue, FEATURED_ISSUE);
  assert.equal(result.delimiterQuoted, true);
  assert.equal(result.composedBody, DEMO_COMPOSED_90630);
  assert.equal(result.receivedBody, DEMO_RECEIVED_90630);
  assert.ok(oneUnescapePass(result.composedBody, result.receivedBody));
  assert.match(result.feed, /Shifted|primary #90630/i);
  assert.equal(decideSeed("shifted").verdict, "shifted");
  assert.equal(decideSeed("90630-shifted").verdict, "shifted");
  assert.equal(decideSeed(90630).verdict, "shifted");
});

test("2 idle/empty/{} is locked, never the product name, never empty, never error", () => {
  const result = decide(emptyAction("idle"));
  assert.equal(result.state, "locked");
  assert.equal(result.verdict, "locked");
  assert.equal(result.alarm, false);
  assert.equal(result.slack, false);
  assert.equal(result.locked, true);
  assert.equal(classify({}), "locked");
  assert.equal(classify(emptyQuoin()), "locked");
  assert.equal(isIdle(emptyQuoin()), true);
  assert.equal(score(emptyQuoin()).locked, true);
  assertIdleNeverQuoin(result);
  const bailed = decide({ action: "bail" });
  assert.equal(bailed.state, "locked");
  assert.equal(bailed.idleWord, "locked");
  const empty = decide({});
  assert.equal(empty.verdict, "locked");
  assert.match(empty.feed, /Locked/);
});

test("3 control locked stays locked with locked true", () => {
  const result = decide(seedControl());
  assert.equal(result.verdict, "locked");
  assert.equal(result.alarm, false);
  assert.equal(result.delimiterQuoted, true);
  assert.equal(result.composedBody, result.receivedBody);
  assert.equal(result.unescapeApplied, false);
  assert.equal(result.locked, true);
  assert.match(result.feed, /Locked|quoted delimiter held|no unescape/i);
  assert.equal(decideSeed("control").verdict, "locked");
  assert.equal(decideSeed("healthy").verdict, "locked");
  assert.equal(decide(seedControl()).locked, true);
});

test("4 PowerShell @'...'@ control is locked", () => {
  const result = decide(seedPowerShell());
  assert.equal(result.verdict, "locked");
  assert.equal(result.powershellHereString, true);
  assert.equal(result.composedBody, result.receivedBody);
  assert.equal(result.locked, true);
  assert.equal(result.alarm, false);
  assert.equal(decideSeed("powershell").verdict, "locked");
});

test("5 collapsed: #88561 command-text without quoted heredoc", () => {
  const result = decide(seedCollapsed());
  assert.equal(result.verdict, "collapsed");
  assert.equal(result.quoinCollapsed, true);
  assert.equal(result.commandTextCollapse, true);
  assert.equal(result.delimiterQuoted, false);
  assert.equal(result.alarm, true);
  assert.equal(result.linear, false);
  assert.equal(result.locked, false);
  assert.match(result.feed, /Collapsed|#88561/i);
  assert.equal(decideSeed("collapsed").verdict, "collapsed");
  assert.equal(decideSeed(88561).verdict, "collapsed");
});

test("6 unescaped: quoted delimiter + unescape flag without body collapse", () => {
  const result = decide(seedUnescaped());
  assert.equal(result.verdict, "unescaped");
  assert.equal(result.quoinUnescaped, true);
  assert.equal(result.unescapeApplied, true);
  assert.equal(result.delimiterQuoted, true);
  assert.equal(result.locked, false);
  assert.equal(result.alarm, false);
  assert.match(result.feed, /Unescaped|quoted delimiter/i);
  assert.equal(decideSeed("unescaped").verdict, "unescaped");
});

test("7 misattributed: unicodeescape traceback, not shifted", () => {
  const result = decide(seedMisattributed());
  assert.equal(result.verdict, "misattributed");
  assert.equal(result.quoinMisattributed, true);
  assert.match(result.traceback, /unicodeescape/);
  assert.equal(result.delimiterQuoted, false);
  assert.equal(result.alarm, true);
  assert.equal(result.linear, true);
  assert.equal(result.locked, false);
  assert.match(result.feed, /Misattributed|traceback|Python/i);
  assert.equal(decideSeed("misattributed").verdict, "misattributed");
});

test("8 path-broke: #89392 Windows strip without quoted heredoc pair", () => {
  const result = decide(seedPathBroke());
  assert.equal(result.verdict, "path-broke");
  assert.equal(result.quoinPathBroke, true);
  assert.equal(result.windowsStrip, true);
  assert.equal(result.delimiterQuoted, false);
  assert.equal(result.alarm, true);
  assert.equal(result.linear, false);
  assert.equal(result.locked, false);
  assert.match(result.feed, /Path-broke|#89392|#85856/i);
  assert.equal(decideSeed("path-broke").verdict, "path-broke");
  assert.equal(decideSeed(89392).verdict, "path-broke");
});

test("9 #85856 windows halve is path-broke", () => {
  const result = decide(seedWindowsHalve());
  assert.equal(result.verdict, "path-broke");
  assert.equal(result.windowsHalve, true);
  assert.equal(result.windowsStrip, false);
  assert.equal(result.alarm, true);
  assert.equal(result.locked, false);
  assert.equal(decideSeed(85856).verdict, "path-broke");
});

test("10 regex-broke: \\\\d / \\\\\\\\ patterns silently changed", () => {
  const result = decide(seedRegexBroke());
  assert.equal(result.verdict, "regex-broke");
  assert.equal(result.quoinRegexBroke, true);
  assert.equal(result.regexChanged, true);
  assert.equal(result.alarm, true);
  assert.equal(result.linear, false);
  assert.equal(result.locked, false);
  assert.match(result.feed, /Regex-broke/i);
  assert.equal(decideSeed("regex-broke").verdict, "regex-broke");
});

test("11 double-slash: two composed, one arrived, no quoted delimiter", () => {
  const result = decide(seedDoubleSlash());
  assert.equal(result.verdict, "double-slash");
  assert.equal(result.quoinDoubleSlash, true);
  assert.equal(result.delimiterQuoted, false);
  assert.ok(countBackslashes(result.composedBody) > countBackslashes(result.receivedBody));
  assert.equal(result.locked, false);
  assert.equal(result.alarm, false);
  assert.match(result.feed, /Double-slash|two composed/i);
  assert.equal(decideSeed("double-slash").verdict, "double-slash");
});

test("12 sealed-open: quoted promise broken without unescape collapse", () => {
  const result = decide(seedSealedOpen());
  assert.equal(result.verdict, "sealed-open");
  assert.equal(result.quoinSealedOpen, true);
  assert.equal(result.sealedLook, true);
  assert.equal(result.delimiterQuoted, true);
  assert.equal(result.locked, false);
  assert.match(result.feed, /Sealed-open|steamed/i);
  assert.equal(decideSeed("sealed-open").verdict, "sealed-open");
});

test("13 parse of the #90630 cat probe (two vs one backslash) is shifted", () => {
  const quoin = parseSessionTrace(DEMO_PROBE_90630);
  assert.equal(classify(quoin), "shifted");
  assert.equal(quoin.delimiterQuoted, true);
  const twoLine = (quoin.composedBody.split("\n").find((line) => line.startsWith("two:")) || "");
  const twoRecv = (quoin.receivedBody.split("\n").find((line) => line.startsWith("two:")) || "");
  assert.equal(countBackslashes(twoLine), 2);
  assert.equal(countBackslashes(twoRecv), 1);
  assert.ok(oneUnescapePass(quoin.composedBody, quoin.receivedBody));
  assert.match(DEMO_PROBE_90630, /<<'EOF'/);
  assert.equal(applyOneUnescapePass("C:\\\\Users"), "C:\\Users");
});

test("14 parse of Python unicodeescape probe is misattributed", () => {
  const quoin = parseSessionTrace(DEMO_PYTHON_PROBE);
  assert.equal(classify(quoin), "misattributed");
  assert.match(quoin.traceback || DEMO_PYTHON_TRACE, /unicodeescape/);
  assert.match(DEMO_PYTHON_PROBE, /C:\\\\Users\\\\Scott|unicodeescape/);
});

test("15 parse PowerShell here-string is locked", () => {
  const quoin = parseSessionTrace("@'\none:  C:\\Users\ntwo:  C:\\\\Users\n'@");
  assert.equal(classify(quoin), "locked");
  assert.equal(quoin.powershellHereString, true);
  assert.equal(lockedOf(quoin), true);
});

test("16 parseSessionTrace prefers JSON before prose", () => {
  const quoin = parseSessionTrace(
    JSON.stringify({
      composedBody: DEMO_COMPOSED_90630,
      receivedBody: DEMO_RECEIVED_90630,
      delimiterQuoted: true,
      tool: "Bash",
      unescapeApplied: true,
    }),
  );
  assert.equal(classify(quoin), "shifted");
  assert.equal(quoin.delimiterQuoted, true);
});

test("17 forbidden idle list includes quoin, empty, prior idles, not locked", () => {
  const words = forbiddenIdleWords();
  assert.ok(words.includes("quoin"));
  assert.ok(words.includes("empty"));
  assert.ok(words.includes("silent"));
  assert.ok(words.includes("mute"));
  assert.ok(words.includes("sealed"));
  assert.ok(words.includes("posted"));
  assert.ok(words.includes("caught"));
  assert.ok(words.includes("yanked"));
  assert.ok(words.includes("stowed"));
  assert.ok(words.includes("gaff"));
  assert.ok(words.includes("sear"));
  assert.ok(words.includes("bodkin"));
  assert.ok(!words.includes("locked"));
});

test("18 demo sinks: Slack on alarm; Linear on shifted; GitHub always; never fake live 200", async () => {
  const shifted = decide(seedShifted());
  const slack = slackQuoinAlarm(shifted, {});
  assert.equal(slack.mode, "demo");
  assert.match(slack.summary, /Would post to Slack/);
  assert.ok(Array.isArray(slack.body.blocks));
  const github = githubQuoinLedger(shifted, {});
  assert.equal(github.mode, "demo");
  assert.match(github.summary, /Would open a GitHub quoin-ledger/);
  const linear = linearQuoinTicket(shifted, {});
  assert.equal(linear.mode, "demo");
  assert.match(linear.summary, /Would open a Linear ticket/);
  const honest = decide(seedControl());
  assert.match(linearQuoinTicket(honest, {}).summary, /Would skip Linear/);
  const idle = decide(emptyAction("idle"));
  assert.match(slackQuoinAlarm(idle, {}).summary, /Would skip Slack/);
  const fired = await fire(shifted, {});
  assert.equal(fired.events.length, 3);
  assert.ok(fired.events.every((row) => row.ok === true));
  assert.ok(fired.events.every((row) => row.mode === "demo"));
  assert.ok(fired.events.every((row) => !/HTTP 200|live 200/.test(row.summary || "")));
});

test("19 Slack live plan uses SLACK_WEBHOOK alias and GITHUB_TOKEN alias", () => {
  const shifted = decide(seedShifted());
  const slack = slackQuoinAlarm(shifted, { SLACK_WEBHOOK: "https://hooks.example/y" });
  assert.equal(slack.mode, "live");
  const github = githubQuoinLedger(shifted, { GITHUB_TOKEN: "tok" });
  assert.equal(github.mode, "live");
  const linear = linearQuoinTicket(shifted, { LINEAR_API_KEY: "lin" });
  assert.equal(linear.mode, "live");
});

test("20 handle alarm classes deny; locked / control / powershell / unescaped / double-slash / sealed-open allow", async () => {
  const shifted = await handle(seedShifted(), {});
  assert.equal(shifted.permissionDecision, "deny");
  assert.match(shifted.hookSpecificOutput.decision.message, /shifted/);
  assert.equal((await handle(seedCollapsed(), {})).permissionDecision, "deny");
  assert.equal((await handle(seedMisattributed(), {})).permissionDecision, "deny");
  assert.equal((await handle(seedPathBroke(), {})).permissionDecision, "deny");
  assert.equal((await handle(seedRegexBroke(), {})).permissionDecision, "deny");
  const idle = await handle({ action: "bail" }, {});
  assert.equal(idle.permissionDecision, "allow");
  assert.match(idle.hookSpecificOutput.decision.message, /locked/);
  assert.equal((await handle(seedControl(), {})).permissionDecision, "allow");
  assert.equal((await handle(seedPowerShell(), {})).permissionDecision, "allow");
  assert.equal((await handle(seedUnescaped(), {})).permissionDecision, "allow");
  assert.equal((await handle(seedDoubleSlash(), {})).permissionDecision, "allow");
  assert.equal((await handle(seedSealedOpen(), {})).permissionDecision, "allow");
  assert.equal((await handle(seedReset(), {})).permissionDecision, "allow");
});

test("21 listen GET health and POST empty body is locked", async () => {
  const server = listen(19931);
  await new Promise((resolve) => server.once("listening", resolve));
  const health = await fetch("http://127.0.0.1:19931/health");
  const info = await health.json();
  assert.equal(info.product, "quoin");
  assert.match(info.verbs, /shifted/);
  const res = await fetch("http://127.0.0.1:19931/", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: "{}",
  });
  const body = await res.json();
  assert.equal(body.verdict, "locked");
  assert.equal(body.idleWord, "locked");
  const scored = await fetch("http://127.0.0.1:19931/", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(seedShifted()),
  });
  const scoredBody = await scored.json();
  assert.equal(scoredBody.verdict, "shifted");
  await new Promise((resolve) => server.close(resolve));
});

test("22 listen rejects non-JSON verbs besides health", async () => {
  const server = listen(19932);
  await new Promise((resolve) => server.once("listening", resolve));
  const put = await fetch("http://127.0.0.1:19932/", { method: "PUT" });
  assert.equal(put.status, 405);
  await new Promise((resolve) => server.close(resolve));
});

test("23 score() accepts the documented probe shape", () => {
  const result = score({
    session: "demo",
    issue: 90630,
    source: "hook",
    composedBody: DEMO_COMPOSED_90630,
    receivedBody: DEMO_RECEIVED_90630,
    delimiterQuoted: true,
    tool: "Bash",
    platform: "windows",
    unescapeApplied: true,
    scored: false,
  });
  assert.equal(result.verdict, "shifted");
  assert.equal(result.locked, false);
  const hold = score({
    composedBody: DEMO_COMPOSED_90630,
    receivedBody: DEMO_COMPOSED_90630,
    delimiterQuoted: true,
    tool: "Bash",
  });
  assert.equal(hold.verdict, "locked");
  assert.equal(hold.locked, true);
  assertScoreShape(result);
});

test("24 nested quoin / probe fields clone", () => {
  const quoin = cloneQuoin({ probe: seedShifted().quoin });
  assert.equal(classify(quoin), "shifted");
});

test("25 fire live slack posts when fetch ok", async () => {
  const shifted = decide(seedShifted());
  const events = await fire(
    shifted,
    { QUOIN_SLACK_WEBHOOK: "https://hooks.example/x" },
    async () => ({
      ok: true,
      status: 200,
      json: async () => ({}),
    }),
  );
  const slack = events.events.find((row) => row.adapter === "slack");
  assert.equal(slack.ok, true);
  assert.match(slack.summary, /Posted shifted/);
});

test("26 composing-room HTML sanity: idle word locked, seeded shifted, not gaff/sear/cubby", () => {
  const html = readFileSync(fileURLToPath(new URL("../index.html", import.meta.url)), "utf8");
  assert.match(html, /locked/);
  assert.match(html, /Score/);
  assert.match(html, /shifted/);
  assert.match(html, /90630/);
  assert.match(html, /seedOf\("shifted"\)|quoin = seedOf\("shifted"\)/);
  assert.match(html, /const IDLE_WORD = "locked"/);
  assert.doesNotMatch(html, /const IDLE_WORD = "quoin"/);
  assert.doesNotMatch(html, /const IDLE_WORD = "posted"/);
  assert.doesNotMatch(html, /const IDLE_WORD = "empty"/);
  assert.doesNotMatch(html, /const IDLE_WORD = "caught"/);
  assert.doesNotMatch(html, /const IDLE_WORD = "yanked"/);
  assert.doesNotMatch(html, /const IDLE_WORD = "sealed"/);
  assert.match(
    html,
    /composing-room|oak-chase|brass-quoin|quoin-key|ink-slab|proof-sheet|type-form|nameplate/i,
  );
  assert.match(html, /05:50 Sydney · quoin/);
  assert.match(html, /shifted form is not a hold/i);
  assert.doesNotMatch(html, /class="music-hall"|class="house-curtain"|class="proscenium-arch"|class="brass-crook"/);
  assert.doesNotMatch(html, /class="gunsmith-shop"|class="sear-rail"|class="walnut-stock"|class="blued-action"|class="sear-notch"/);
  assert.doesNotMatch(html, /class="mailroom-hall"|class="cubby-wall"|class="oak-bay"|class="brass-nameplate"/);
  assert.doesNotMatch(html, /class="teller-hall"|class="marble-counter"|class="bronze-lattice"|class="grille-window"/);
  assert.doesNotMatch(html, /class="bung-station"|class="barrel-head"|class="bung-hole"|class="brass-spile"/);
  assert.doesNotMatch(html, /class="wet-pier"|class="bollard-plate"|class="quay-lamp"|class="hawser-eye"/);
  assert.doesNotMatch(html, /class="sail-loft"|class="rigger-bench"|class="hemp-clew"/);
  assert.doesNotMatch(html, /class="night-desk"|class="sounder-key"|class="telegraph-sounder"/);
  assert.doesNotMatch(html, /--velvet:|--house-red:|--gold:|#6b0d1a|#9b1424/);
  assert.doesNotMatch(html, /--walnut:|--blued:|#3d2a1a|#2c4a6e/);
  assert.doesNotMatch(html, /Abril Fatface|Bebas Neue|Cutive Mono/);
  assert.doesNotMatch(html, /Calistoga|Commissioner|Inconsolata/);
  assert.doesNotMatch(html, /Playfair Display|Source Serif 4|JetBrains Mono/);
  assert.doesNotMatch(html, /Cinzel|Lora|Overpass Mono/);
  assert.doesNotMatch(html, /Yeseva One|\bCabin\b|Anonymous Pro/);
  assert.doesNotMatch(html, /Alfa Slab One|Bitter|Space Mono/);
  assert.doesNotMatch(html, /Big Shoulders Stencil|Sora|Share Tech Mono/);
  assert.doesNotMatch(html, /Cormorant Garamond|Crimson Pro/);
  assert.doesNotMatch(html, /Young Serif|Outfit|Red Hat Mono/);
  assert.doesNotMatch(html, /Newsreader|Barlow Condensed|IBM Plex Mono/);
  assert.doesNotMatch(html, /millimeter slider|millimetre slider/i);
  assert.match(html, /<title>Quoin/);
  assert.match(html, /Bodoni Moda|Roboto Mono/);
  assert.match(html, /Reset · locked|reset to locked/i);
  assert.match(html, /Restore · #90630|restore to shifted/i);
  assert.match(html, /Admit locked/);
});

test("27 HTML why-not names Scant, Sear, Grille, Assay, Gaff", () => {
  const html = readFileSync(fileURLToPath(new URL("../index.html", import.meta.url)), "utf8");
  assert.match(html, /NOT Scant/);
  assert.match(html, /NOT Sear/);
  assert.match(html, /NOT Grille/);
  assert.match(html, /NOT Assay/);
  assert.match(html, /NOT Gaff/);
  assert.match(html, /leftover/);
  assert.match(html, /millimeter-slider|millimetre-slider|millimeter slider|millimetre slider/);
});

test("28 README names contrasts and locked idle", () => {
  const readme = readFileSync(fileURLToPath(new URL("../README.md", import.meta.url)), "utf8");
  assert.match(readme, /NOT \*\*Scant\*\*|NOT Scant/);
  assert.match(readme, /NOT \*\*Sear\*\*|NOT Sear/);
  assert.match(readme, /NOT \*\*Grille\*\*|NOT Grille/);
  assert.match(readme, /NOT \*\*Assay\*\*|NOT Assay/);
  assert.match(readme, /NOT \*\*Gaff\*\*|NOT Gaff/);
  assert.match(readme, /\*\*locked\*\*/);
  assert.match(readme, /#90630/);
  assert.match(readme, /#88561/);
  assert.match(readme, /#89392/);
  assert.match(readme, /#85856/);
  assert.match(readme, /#41534/);
  assert.match(readme, /#72957/);
  assert.match(readme, /\/quoin\//);
  assert.doesNotMatch(readme, /idle word is quoin/i);
  assert.doesNotMatch(readme, /idle word is yanked/i);
  assert.doesNotMatch(readme, /idle word is caught/i);
  assert.doesNotMatch(readme, /idle word is sealed/i);
});

test("29 seeded 90630 numbers produce shifted / locked=false", () => {
  const shifted = score({
    composedBody: DEMO_COMPOSED_90630,
    receivedBody: DEMO_RECEIVED_90630,
    delimiterQuoted: true,
    tool: "Bash",
    unescapeApplied: true,
  });
  assert.equal(shifted.verdict, "shifted");
  assert.equal(shifted.locked, false);
  assert.equal(shifted.delimiterQuoted, true);
  assert.ok(shifted.collapse);
  assert.equal(shiftedOf(seedShifted().quoin), true);
  assert.equal(lockedOf(seedControl().quoin), true);
  assert.equal(lockedOf(seedShifted().quoin), false);
  const facts = analyze(seedShifted().quoin);
  assert.equal(facts.shiftedShape, true);
  assert.equal(classify(seed90630().quoin), "shifted");
});

test("30 control verbatim produces locked=true; shifted never locked", () => {
  const hold = score({
    composedBody: DEMO_COMPOSED_90630,
    receivedBody: DEMO_COMPOSED_90630,
    delimiterQuoted: true,
  });
  assert.equal(hold.verdict, "locked");
  assert.equal(hold.locked, true);
  const lie = score({
    composedBody: DEMO_COMPOSED_90630,
    receivedBody: DEMO_RECEIVED_90630,
    delimiterQuoted: true,
    unescapeApplied: true,
  });
  assert.equal(lie.locked, false);
  assert.equal(lie.verdict, "shifted");
});

test("31 Slack skip on locked / control / powershell / unescaped / double-slash / sealed-open", () => {
  for (const seed of [seedReset, seedControl, seedPowerShell, seedUnescaped, seedDoubleSlash, seedSealedOpen, seedLocked]) {
    const result = decide(seed());
    assert.equal(result.slack, false, result.verdict);
    assert.match(slackQuoinAlarm(result, {}).summary, /Would skip Slack/);
  }
});

test("32 shifted pair wins over unescape / sealed-open flags", () => {
  const result = score({
    composedBody: DEMO_COMPOSED_90630,
    receivedBody: DEMO_RECEIVED_90630,
    delimiterQuoted: true,
    unescapeApplied: true,
    sealedLook: true,
    tool: "Bash",
  });
  assert.equal(result.verdict, "shifted");
  assert.equal(result.locked, false);
});

test("33 admit still does not lie after shifted / misattributed", () => {
  const admitted = decide({ ...seedShifted(), action: "admit" });
  assert.equal(admitted.verdict, "shifted");
  assert.equal(admitted.locked, false);
  const blamed = decide({ ...seedMisattributed(), action: "admit" });
  assert.equal(blamed.verdict, "misattributed");
  assert.equal(blamed.locked, false);
});

test("34 HTML parse prefers JSON so quoted+collapse is shifted not sealed-open", () => {
  const html = readFileSync(fileURLToPath(new URL("../index.html", import.meta.url)), "utf8");
  assert.match(html, /raw\.startsWith\("\{"\)|startsWith\("\{"\)/);
  const probe = score({
    composedBody: DEMO_COMPOSED_90630,
    receivedBody: DEMO_RECEIVED_90630,
    delimiterQuoted: true,
    unescapeApplied: true,
  });
  assert.equal(probe.verdict, "shifted");
  assert.equal(probe.locked, false);
});

test("35 README and composing-room cite #90630 #88561 #89392 #85856 and nearby issues", () => {
  const readme = readFileSync(fileURLToPath(new URL("../README.md", import.meta.url)), "utf8");
  assert.match(readme, /90630/);
  assert.match(readme, /88561/);
  assert.match(readme, /89392/);
  assert.match(readme, /85856/);
  assert.match(readme, /72957/);
  assert.match(readme, /90597/);
  assert.match(readme, /41534/);
  assert.doesNotMatch(readme, /idle word is quoin |idle word is sealed|idle word is yanked/i);
  const html = readFileSync(fileURLToPath(new URL("../index.html", import.meta.url)), "utf8");
  assert.match(html, /<<'EOF'|quoted heredoc/);
  assert.match(html, /88561/);
  assert.match(html, /89392/);
  assert.match(html, /85856/);
  assert.match(html, /72957/);
  assert.match(html, /90597/);
  assert.match(html, /41534/);
  assert.match(html, new RegExp(String(COLLAPSE_ISSUE)));
  assert.match(html, new RegExp(String(WINDOWS_STRIP_ISSUE)));
  assert.match(html, new RegExp(String(WINDOWS_HALVE_ISSUE)));
  assert.match(html, new RegExp(String(WRITE_UNICODE_ISSUE)));
  assert.match(html, new RegExp(String(HEREDOC_PLATFORM_ISSUE)));
  assert.match(html, new RegExp(String(CODEX_PWSH_QUOTE_ISSUE)));
  assert.ok(DEMO_PROBE_90630.includes("<<'EOF'"));
  assert.ok(SLACK_VERDICTS.includes("shifted"));
  assert.ok(LINEAR_VERDICTS.includes("misattributed"));
  assert.ok(ALARM_VERDICTS.includes("path-broke"));
  const reasons = reasonsOf(seedShifted().quoin, "shifted");
  assert.ok(reasons.some((row) => /#90630/.test(row)));
  assert.equal(flagsOf("shifted").slack, true);
  assert.equal(feedOf(seedShifted().quoin).includes("Shifted"), true);
});

test("36 each verdict has a dedicated seed", () => {
  assert.equal(decide(seedLocked()).verdict, "locked");
  assert.equal(decide(seedShifted()).verdict, "shifted");
  assert.equal(decide(seedCollapsed()).verdict, "collapsed");
  assert.equal(decide(seedUnescaped()).verdict, "unescaped");
  assert.equal(decide(seedMisattributed()).verdict, "misattributed");
  assert.equal(decide(seedPathBroke()).verdict, "path-broke");
  assert.equal(decide(seedRegexBroke()).verdict, "regex-broke");
  assert.equal(decide(seedDoubleSlash()).verdict, "double-slash");
  assert.equal(decide(seedSealedOpen()).verdict, "sealed-open");
});
