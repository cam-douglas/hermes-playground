import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  fire,
  githubCalqueLedger,
  linearCalqueTicket,
  slackCalqueAlarm,
} from "./adapters.mjs";
import {
  ALARM_VERDICTS,
  DEMO_BLOCK_90645,
  DEMO_COMMAND_90645,
  DEMO_CONTROL_COMMAND,
  DEMO_CONTROL_MESSAGE,
  DEMO_EXTRACTED_90645,
  DEMO_MESSAGE_90645,
  DEMO_PATH_90645,
  DEMO_TOOL_BASH,
  DEMO_TOOL_POWERSHELL,
  FEATURED_ISSUE,
  IDLE_WORD,
  LINEAR_VERDICTS,
  PRIOR_TARGET_69461,
  PRIOR_TARGET_73524,
  PRIOR_TARGET_73882,
  SLACK_VERDICTS,
  VERDICTS,
  analyze,
  classify,
  cloneCalque,
  decide,
  decideSeed,
  emptyAction,
  emptyCalque,
  feedOf,
  flagsOf,
  forbiddenIdleWords,
  hasSpanishDelInQuotes,
  hasUnquotedDelAlias,
  isIdle,
  isPowerShellTool,
  parseBlockedPath,
  parsePowerShellCommand,
  parseSessionTrace,
  pathStartsWithQuote,
  reasonsOf,
  score,
  seed90645,
  seedAliased,
  seedBashOk,
  seedCalqued,
  seedCommitBlocked,
  seedControl,
  seedFragQuote,
  seedPathLie,
  seedQuoteBlind,
  seedReset,
  seedSpanishDel,
  seedVerbatim,
  verbatimOf,
  calquedOf,
  verdictOf,
} from "./calque.mjs";
import { handle, listen } from "./index.mjs";

const PRIOR_IDLES =
  /empty|silent|mute|idle|dead|sealed|fronted|locked|yanked|caught|stowed|posted|bunged|belayed|rove|keyed|housed|beamed|snug|hung|appointed|cinched|gauged|stamped|overrun|pratique|wound|bound|stilled|stabled|drained|flat|fit|spoilt|laid|unlinked|tight|banked|roosted|stocked|seated|heard|clear|paired|kernel|latched|upheld|sterling|home|valid|dry|quiet|seised|rung|moored/;

function assertIdleNeverCalque(result) {
  assert.equal(result.idleWord, "verbatim");
  assert.equal(IDLE_WORD, "verbatim");
  assert.doesNotMatch(result.idleWord, /calque/i);
  assert.doesNotMatch(IDLE_WORD, /^calque$/i);
  assert.doesNotMatch(result.idleWord, PRIOR_IDLES);
}

function assertScoreShape(result) {
  assert.equal(typeof result.verdict, "string");
  assert.ok(Array.isArray(result.reasons));
  assert.equal(typeof result.verbatim, "boolean");
  assert.equal(typeof result.feed, "string");
}

test("1 seed 90645 calqued is calqued, slack, linear, idleWord verbatim, never verbatim", () => {
  const seed = seedCalqued();
  const result = decide(seed);
  assert.equal(result.verdict, "calqued");
  assert.equal(result.state, "calqued");
  assert.equal(result.decision, "calqued");
  assert.equal(classify(seed.calque), "calqued");
  assert.equal(verdictOf(seed.calque), "calqued");
  assert.notEqual(result.verdict, "verbatim");
  assert.equal(result.alarm, true);
  assert.equal(result.slack, true);
  assert.equal(result.linear, true);
  assert.equal(result.github, true);
  assert.equal(result.calqueCalqued, true);
  assert.equal(result.calqued, true);
  assert.equal(result.verbatim, false);
  assertIdleNeverCalque(result);
  assert.equal(result.session, "90645-calqued");
  assert.equal(result.issue, FEATURED_ISSUE);
  assert.equal(result.command, DEMO_COMMAND_90645);
  assert.equal(result.messageText, DEMO_MESSAGE_90645);
  assert.equal(result.extractedPath, DEMO_EXTRACTED_90645);
  assert.match(result.command, /prueba del guard/);
  assert.match(result.extractedPath, /^"/);
  assert.match(result.feed, /Calqued|primary #90645/i);
  assert.equal(decideSeed("calqued").verdict, "calqued");
  assert.equal(decideSeed("90645-calqued").verdict, "calqued");
  assert.equal(decideSeed(90645).verdict, "calqued");
});

test("2 idle/empty/{} is verbatim, never the product name, never empty, never error", () => {
  const result = decide(emptyAction("idle"));
  assert.equal(result.state, "verbatim");
  assert.equal(result.verdict, "verbatim");
  assert.equal(result.alarm, false);
  assert.equal(result.slack, false);
  assert.equal(result.verbatim, true);
  assert.equal(classify({}), "verbatim");
  assert.equal(classify(emptyCalque()), "verbatim");
  assert.equal(isIdle(emptyCalque()), true);
  assert.equal(score(emptyCalque()).verbatim, true);
  assertIdleNeverCalque(result);
  const bailed = decide({ action: "bail" });
  assert.equal(bailed.state, "verbatim");
  assert.equal(bailed.idleWord, "verbatim");
  const empty = decide({});
  assert.equal(empty.verdict, "verbatim");
  assert.match(empty.feed, /Verbatim/);
});

test("3 honest control without del is verbatim with verbatim true", () => {
  const result = decide(seedControl());
  assert.equal(result.verdict, "verbatim");
  assert.equal(result.alarm, false);
  assert.equal(result.command, DEMO_CONTROL_COMMAND);
  assert.equal(result.messageText, DEMO_CONTROL_MESSAGE);
  assert.equal(result.blocked, false);
  assert.equal(result.verbatim, true);
  assert.equal(result.honestFolio, true);
  assert.match(result.feed, /Verbatim|quoted string content/i);
  assert.equal(decideSeed("control").verdict, "verbatim");
  assert.equal(decideSeed("healthy").verdict, "verbatim");
  assert.equal(decide(seedControl()).verbatim, true);
});

test("4 spanish-del: Spanish del inside quotes, blocked, no quote-frag", () => {
  const result = decide(seedSpanishDel());
  assert.equal(result.verdict, "spanish-del");
  assert.equal(result.calqueSpanishDel, true);
  assert.equal(result.spanishDel, true);
  assert.equal(result.fragQuote, false);
  assert.equal(result.alarm, true);
  assert.equal(result.linear, true);
  assert.equal(result.verbatim, false);
  assert.match(result.feed, /Spanish-del|Spanish del/i);
  assert.equal(decideSeed("spanish-del").verdict, "spanish-del");
});

test("5 aliased: unquoted del token, not the Spanish lemma", () => {
  const result = decide(seedAliased());
  assert.equal(result.verdict, "aliased");
  assert.equal(result.calqueAliased, true);
  assert.equal(result.unquotedDel, true);
  assert.equal(result.spanishDel, false);
  assert.equal(result.alarm, true);
  assert.equal(result.linear, false);
  assert.equal(result.verbatim, false);
  assert.match(result.feed, /Aliased|Remove-Item/i);
});

test("6 quote-blind: whitespace split, fragment does not start with quote", () => {
  const result = decide(seedQuoteBlind());
  assert.equal(result.verdict, "quote-blind");
  assert.equal(result.calqueQuoteBlind, true);
  assert.equal(result.quoteBlind, true);
  assert.equal(result.fragQuote, false);
  assert.equal(result.alarm, true);
  assert.equal(result.verbatim, false);
  assert.match(result.feed, /Quote-blind|whitespace split/i);
});

test("7 frag-quote: extracted path begins with a quote, no Spanish del", () => {
  const result = decide(seedFragQuote());
  assert.equal(result.verdict, "frag-quote");
  assert.equal(result.calqueFragQuote, true);
  assert.equal(result.fragQuote, true);
  assert.equal(result.spanishDel, false);
  assert.equal(result.alarm, true);
  assert.equal(result.verbatim, false);
  assert.match(result.feed, /Frag-quote|begins with/i);
});

test("8 commit-blocked: plain git commit denied, no del, no quote-frag", () => {
  const result = decide(seedCommitBlocked());
  assert.equal(result.verdict, "commit-blocked");
  assert.equal(result.calqueCommitBlocked, true);
  assert.equal(result.gitCommit, true);
  assert.equal(result.spanishDel, false);
  assert.equal(result.alarm, true);
  assert.equal(result.linear, true);
  assert.equal(result.verbatim, false);
  assert.match(result.feed, /Commit-blocked|git commit/i);
});

test("9 bash-ok: same command with del via Bash is not blocked", () => {
  const result = decide(seedBashOk());
  assert.equal(result.verdict, "bash-ok");
  assert.equal(result.calqueBashOk, true);
  assert.equal(result.tool, DEMO_TOOL_BASH);
  assert.equal(result.blocked, false);
  assert.equal(result.spanishDel, true);
  assert.equal(result.alarm, false);
  assert.equal(result.linear, false);
  assert.equal(result.verbatim, false);
  assert.match(result.feed, /Bash-ok|PowerShell-tool only/i);
  assert.equal(decideSeed("bash-ok").verdict, "bash-ok");
});

test("10 path-lie: fabricated system path, not a git commit", () => {
  const result = decide(seedPathLie());
  assert.equal(result.verdict, "path-lie");
  assert.equal(result.calquePathLie, true);
  assert.equal(result.systemPathClaim, true);
  assert.equal(result.gitCommit, false);
  assert.equal(result.alarm, true);
  assert.equal(result.linear, false);
  assert.equal(result.verbatim, false);
  assert.match(result.feed, /Path-lie|fabricated fragment/i);
});

test("11 score() idle calque is verbatim and never alarms", () => {
  const result = score(emptyCalque());
  assertScoreShape(result);
  assert.equal(result.verdict, "verbatim");
  assert.equal(result.slack, false);
  assert.equal(result.alarm, false);
  assert.equal(result.verbatim, true);
  assert.equal(result.calqued, false);
});

test("12 verdict vocabulary is exactly the nine words", () => {
  assert.deepEqual(VERDICTS, [
    "verbatim",
    "calqued",
    "aliased",
    "quote-blind",
    "frag-quote",
    "commit-blocked",
    "bash-ok",
    "path-lie",
    "spanish-del",
  ]);
  assert.deepEqual(SLACK_VERDICTS, [
    "calqued",
    "aliased",
    "quote-blind",
    "frag-quote",
    "commit-blocked",
    "path-lie",
    "spanish-del",
  ]);
  assert.deepEqual(LINEAR_VERDICTS, ["calqued", "spanish-del", "commit-blocked"]);
  assert.deepEqual(ALARM_VERDICTS, SLACK_VERDICTS);
  assert.equal(IDLE_WORD, "verbatim");
  assert.doesNotMatch(IDLE_WORD, /calque$|fronted|locked|yanked|caught|stowed|posted/);
});

test("13 every seeded class classifies to itself", () => {
  const rows = [
    ["verbatim", seedReset],
    ["calqued", seedCalqued],
    ["spanish-del", seedSpanishDel],
    ["aliased", seedAliased],
    ["quote-blind", seedQuoteBlind],
    ["frag-quote", seedFragQuote],
    ["commit-blocked", seedCommitBlocked],
    ["bash-ok", seedBashOk],
    ["path-lie", seedPathLie],
  ];
  for (const [word, seed] of rows) {
    assert.equal(decide(seed()).verdict, word, word);
    assert.equal(classify(seed().calque), word, word);
    assert.equal(score(seed().calque).verdict, word, word);
  }
});

test("14 admit does not lie: calqued stays calqued; spanish-del stays spanish-del", () => {
  const calqued = decide({ ...seedCalqued(), action: "admit" });
  assert.equal(calqued.verdict, "calqued");
  assert.equal(calqued.action, "admit");
  assert.equal(calqued.verbatim, false);
  assert.doesNotMatch(calqued.verdict, /verbatim/);
  const lemma = decide({ ...seedSpanishDel(), action: "admit" });
  assert.equal(lemma.verdict, "spanish-del");
  const aliased = decide({ ...seedAliased(), action: "admit" });
  assert.equal(aliased.verdict, "aliased");
});

test("15 bail / verbatim / reset returns idle verbatim", () => {
  const bailed = decide({ ...seedCalqued(), action: "bail" });
  assert.equal(bailed.verdict, "verbatim");
  assert.equal(isIdle(bailed.calque), true);
  assertIdleNeverCalque(bailed);
  assert.equal(decide({ action: "reset" }).verdict, "verbatim");
  assert.equal(decide({ action: "verbatim" }).verdict, "verbatim");
  assert.equal(decide(seedReset()).verdict, "verbatim");
  assert.equal(decide(seedVerbatim()).verdict, "verbatim");
});

test("16 restore / calqued produces the #90645 calqued folio", () => {
  const result = decide({ action: "restore", calque: emptyCalque() });
  assert.equal(result.verdict, "calqued");
  assert.equal(result.action, "restore");
  assert.equal(result.issue, FEATURED_ISSUE);
  assert.equal(result.verbatim, false);
  assert.equal(decide({ action: "calqued" }).verdict, "calqued");
});

test("17 flagsOf matches slack / github; linear follows calqued/spanish-del/commit-blocked", () => {
  assert.deepEqual(flagsOf("calqued"), { slack: true, linear: true, github: true, alarm: true });
  assert.deepEqual(flagsOf("spanish-del"), { slack: true, linear: true, github: true, alarm: true });
  assert.deepEqual(flagsOf("commit-blocked"), { slack: true, linear: true, github: true, alarm: true });
  assert.deepEqual(flagsOf("aliased"), { slack: true, linear: false, github: true, alarm: true });
  assert.deepEqual(flagsOf("quote-blind"), { slack: true, linear: false, github: true, alarm: true });
  assert.deepEqual(flagsOf("frag-quote"), { slack: true, linear: false, github: true, alarm: true });
  assert.deepEqual(flagsOf("path-lie"), { slack: true, linear: false, github: true, alarm: true });
  assert.deepEqual(flagsOf("bash-ok"), { slack: false, linear: false, github: true, alarm: false });
  assert.deepEqual(flagsOf("verbatim"), { slack: false, linear: false, github: true, alarm: false });
});

test("18 helpers, reasons, analyze, quote parse", () => {
  assert.equal(calquedOf(seedCalqued().calque), true);
  assert.equal(verbatimOf(emptyCalque()), true);
  assert.equal(verbatimOf(seedCalqued().calque), false);
  assert.equal(verbatimOf(seedControl().calque), true);
  assert.equal(verbatimOf(seedBashOk().calque), false);
  const reasons = reasonsOf(seedCalqued().calque, "calqued");
  assert.ok(reasons.some((row) => /#90645/.test(row)));
  const facts = analyze(seedCalqued().calque);
  assert.equal(facts.calquedShape, true);
  assert.equal(classify(seedCalqued().calque), "calqued");
  assert.equal(classify(seed90645().calque), "calqued");
  assert.ok(isPowerShellTool(DEMO_TOOL_POWERSHELL));
  assert.ok(hasSpanishDelInQuotes(DEMO_COMMAND_90645, DEMO_MESSAGE_90645));
  assert.ok(hasUnquotedDelAlias("del C:\\Temp\\scratch.txt"));
  assert.ok(pathStartsWithQuote(DEMO_EXTRACTED_90645));
  assert.equal(parseBlockedPath(DEMO_BLOCK_90645), DEMO_EXTRACTED_90645);
});

test("19 forbidden idle list includes calque, empty, leftover names, not verbatim", () => {
  const words = forbiddenIdleWords();
  assert.ok(words.includes("calque"));
  assert.ok(words.includes("empty"));
  assert.ok(words.includes("silent"));
  assert.ok(words.includes("mute"));
  assert.ok(words.includes("fronted"));
  assert.ok(words.includes("locked"));
  assert.ok(words.includes("yanked"));
  assert.ok(words.includes("caught"));
  assert.ok(words.includes("stowed"));
  assert.ok(words.includes("frisk"));
  assert.ok(words.includes("visa"));
  assert.ok(!words.includes("verbatim"));
});

test("20 demo sinks: Slack on alarm; Linear on calqued; GitHub always; never fake live 200", async () => {
  const calqued = decide(seedCalqued());
  const slack = slackCalqueAlarm(calqued, {});
  assert.equal(slack.mode, "demo");
  assert.match(slack.summary, /Would post to Slack/);
  assert.ok(Array.isArray(slack.body.blocks));
  const github = githubCalqueLedger(calqued, {});
  assert.equal(github.mode, "demo");
  assert.match(github.summary, /Would open a GitHub calque-ledger/);
  const linear = linearCalqueTicket(calqued, {});
  assert.equal(linear.mode, "demo");
  assert.match(linear.summary, /Would open a Linear ticket/);
  const honest = decide(seedControl());
  assert.match(linearCalqueTicket(honest, {}).summary, /Would skip Linear/);
  const idle = decide(emptyAction("idle"));
  assert.match(slackCalqueAlarm(idle, {}).summary, /Would skip Slack/);
  const fired = await fire(calqued, {});
  assert.equal(fired.events.length, 3);
  assert.ok(fired.events.every((row) => row.ok === true));
  assert.ok(fired.events.every((row) => row.mode === "demo"));
  assert.ok(fired.events.every((row) => !/HTTP 200|live 200/.test(row.summary || "")));
});

test("21 Slack live plan uses SLACK_WEBHOOK alias and GITHUB_TOKEN alias", () => {
  const calqued = decide(seedCalqued());
  const slack = slackCalqueAlarm(calqued, { SLACK_WEBHOOK: "https://hooks.example/y" });
  assert.equal(slack.mode, "live");
  const github = githubCalqueLedger(calqued, { GITHUB_TOKEN: "tok" });
  assert.equal(github.mode, "live");
  const linear = linearCalqueTicket(calqued, { LINEAR_API_KEY: "lin" });
  assert.equal(linear.mode, "live");
});

test("22 handle alarm classes deny; verbatim / control / bash-ok allow", async () => {
  const calqued = await handle(seedCalqued(), {});
  assert.equal(calqued.permissionDecision, "deny");
  assert.match(calqued.hookSpecificOutput.decision.message, /calqued/);
  assert.equal((await handle(seedSpanishDel(), {})).permissionDecision, "deny");
  assert.equal((await handle(seedAliased(), {})).permissionDecision, "deny");
  assert.equal((await handle(seedQuoteBlind(), {})).permissionDecision, "deny");
  assert.equal((await handle(seedFragQuote(), {})).permissionDecision, "deny");
  assert.equal((await handle(seedCommitBlocked(), {})).permissionDecision, "deny");
  assert.equal((await handle(seedPathLie(), {})).permissionDecision, "deny");
  const idle = await handle({ action: "bail" }, {});
  assert.equal(idle.permissionDecision, "allow");
  assert.match(idle.hookSpecificOutput.decision.message, /verbatim/);
  assert.equal((await handle(seedControl(), {})).permissionDecision, "allow");
  assert.equal((await handle(seedBashOk(), {})).permissionDecision, "allow");
  assert.equal((await handle(seedReset(), {})).permissionDecision, "allow");
});

test("23 listen GET health and POST empty body is verbatim", async () => {
  const server = listen(19941);
  await new Promise((resolve) => server.once("listening", resolve));
  const health = await fetch("http://127.0.0.1:19941/health");
  const info = await health.json();
  assert.equal(info.product, "calque");
  assert.match(info.verbs, /calqued/);
  const res = await fetch("http://127.0.0.1:19941/", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: "{}",
  });
  const body = await res.json();
  assert.equal(body.verdict, "verbatim");
  assert.equal(body.idleWord, "verbatim");
  const scored = await fetch("http://127.0.0.1:19941/", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(seedCalqued()),
  });
  const scoredBody = await scored.json();
  assert.equal(scoredBody.verdict, "calqued");
  await new Promise((resolve) => server.close(resolve));
});

test("24 listen rejects non-JSON verbs besides health", async () => {
  const server = listen(19942);
  await new Promise((resolve) => server.once("listening", resolve));
  const put = await fetch("http://127.0.0.1:19942/", { method: "PUT" });
  assert.equal(put.status, 405);
  await new Promise((resolve) => server.close(resolve));
});

test("25 parse of the #90645 command plus block is calqued", () => {
  const calque = parsePowerShellCommand(DEMO_COMMAND_90645, DEMO_BLOCK_90645, DEMO_TOOL_POWERSHELL);
  assert.equal(classify(calque), "calqued");
  assert.match(calque.command, /prueba del guard/);
  assert.match(calque.extractedPath || parseBlockedPath(DEMO_BLOCK_90645), /^"/);
  assert.match(DEMO_BLOCK_90645, /Remove-Item on system path/);
  assert.match(DEMO_COMMAND_90645, /Produccion de Video/);
});

test("26 parseSessionTrace reads calqued JSON and prose", () => {
  assert.equal(
    classify(parseSessionTrace(`${DEMO_COMMAND_90645}\n${DEMO_BLOCK_90645}`)),
    "calqued",
  );
  assert.equal(
    classify(
      parseSessionTrace(
        JSON.stringify({
          command: DEMO_COMMAND_90645,
          tool: DEMO_TOOL_POWERSHELL,
          messageText: DEMO_MESSAGE_90645,
          extractedPath: DEMO_EXTRACTED_90645,
          blocked: true,
          blockMessage: DEMO_BLOCK_90645,
        }),
      ),
    ),
    "calqued",
  );
});

test("27 score() accepts the documented probe shape", () => {
  const result = score({
    session: "demo",
    issue: 90645,
    source: "hook",
    command: DEMO_COMMAND_90645,
    tool: DEMO_TOOL_POWERSHELL,
    messageText: DEMO_MESSAGE_90645,
    quotedPaths: [DEMO_PATH_90645, DEMO_MESSAGE_90645],
    extractedPath: DEMO_EXTRACTED_90645,
    blocked: true,
    blockMessage: DEMO_BLOCK_90645,
    platform: "windows",
    scored: false,
  });
  assert.equal(result.verdict, "calqued");
  assert.equal(result.verbatim, false);
  const hold = score({
    command: DEMO_CONTROL_COMMAND,
    tool: DEMO_TOOL_POWERSHELL,
    messageText: DEMO_CONTROL_MESSAGE,
    blocked: false,
  });
  assert.equal(hold.verdict, "verbatim");
  assert.equal(hold.verbatim, true);
});

test("28 nested calque / probe fields clone", () => {
  const calque = cloneCalque({ probe: seedCalqued().calque });
  assert.equal(classify(calque), "calqued");
});

test("29 fire live slack posts when fetch ok", async () => {
  const calqued = decide(seedCalqued());
  const events = await fire(
    calqued,
    { CALQUE_SLACK_WEBHOOK: "https://hooks.example/x" },
    async () => ({
      ok: true,
      status: 200,
      json: async () => ({}),
    }),
  );
  const slack = events.events.find((row) => row.adapter === "slack");
  assert.equal(slack.ok, true);
  assert.match(slack.summary, /Posted calqued/);
});

test("30 folio HTML sanity: idle word verbatim, seeded calqued, not fascia/quoin/gaff", () => {
  const html = readFileSync(fileURLToPath(new URL("../index.html", import.meta.url)), "utf8");
  assert.match(html, /verbatim/);
  assert.match(html, /Score/);
  assert.match(html, /calqued/);
  assert.match(html, /90645/);
  assert.match(html, /seedOf\("calqued"\)|calque = seedOf\("calqued"\)/);
  assert.match(html, /const IDLE_WORD = "verbatim"/);
  assert.doesNotMatch(html, /const IDLE_WORD = "calque"/);
  assert.doesNotMatch(html, /const IDLE_WORD = "fronted"/);
  assert.doesNotMatch(html, /const IDLE_WORD = "empty"/);
  assert.doesNotMatch(html, /const IDLE_WORD = "locked"/);
  assert.match(
    html,
    /scriptorium-hall|false-gloss-desk|bilingual-manuscript|spanish-lemma|remove-item-gloss|parchment-folio|ink-well|translator-rail/i,
  );
  assert.match(html, /08:50 Sydney · calque/);
  assert.match(html, /quoted string content is not a command/i);
  assert.doesNotMatch(html, /class="shopfront-street"|class="enamel-fascia-board"|class="frosted-shop-door"/);
  assert.doesNotMatch(html, /class="composing-room"|class="oak-chase"|class="brass-quoin"|class="ink-slab"/);
  assert.doesNotMatch(html, /class="music-hall"|class="house-curtain"|class="proscenium-arch"|class="brass-crook"/);
  assert.doesNotMatch(html, /class="gunsmith-shop"|class="sear-rail"|class="walnut-stock"/);
  assert.doesNotMatch(html, /class="teller-hall"|class="marble-counter"|class="bronze-lattice"/);
  assert.doesNotMatch(html, /class="mailroom-hall"|class="cubby-wall"/);
  assert.doesNotMatch(html, /Bodoni Moda|Roboto Mono/);
  assert.doesNotMatch(html, /Abril Fatface|Bebas Neue|Cutive Mono/);
  assert.doesNotMatch(html, /Calistoga|Commissioner|Inconsolata/);
  assert.doesNotMatch(html, /Cinzel|Lora|Overpass Mono/);
  assert.doesNotMatch(html, /Playfair Display|IBM Plex Mono/);
  assert.doesNotMatch(html, /millimeter slider|millimetre slider/i);
  assert.match(html, /<title>Calque/);
  assert.match(html, /IM Fell English|Red Hat Mono/);
  assert.match(html, /Admit verbatim/);
  assert.match(html, /Restore · #90645|restore to calqued/i);
});

test("31 HTML why-not names Visa, Fob, Snib, Quoin, Fascia, leftover", () => {
  const html = readFileSync(fileURLToPath(new URL("../index.html", import.meta.url)), "utf8");
  assert.match(html, /NOT Visa/);
  assert.match(html, /NOT Fob/);
  assert.match(html, /NOT Snib/);
  assert.match(html, /NOT Quoin/);
  assert.match(html, /NOT Fascia/);
  assert.match(html, /leftover/);
  assert.match(html, /millimeter-slider|millimetre-slider|millimeter slider|millimetre slider/);
});

test("32 README names contrasts and verbatim idle", () => {
  const readme = readFileSync(fileURLToPath(new URL("../README.md", import.meta.url)), "utf8");
  assert.match(readme, /NOT \*\*Visa\*\*|NOT Visa/);
  assert.match(readme, /NOT \*\*Fob\*\*|NOT Fob/);
  assert.match(readme, /NOT \*\*Quoin\*\*|NOT Quoin/);
  assert.match(readme, /NOT \*\*Fascia\*\*|NOT Fascia/);
  assert.match(readme, /\*\*verbatim\*\*/);
  assert.match(readme, /#90645/);
  assert.match(readme, /#69461/);
  assert.match(readme, /#73524/);
  assert.match(readme, /#73882/);
  assert.match(readme, /\/calque\//);
  assert.doesNotMatch(readme, /idle word is calque/i);
  assert.doesNotMatch(readme, /idle word is fronted/i);
  assert.doesNotMatch(readme, /idle word is locked/i);
});

test("33 seeded 90645 numbers produce calqued / verbatim=false", () => {
  const calqued = score({
    command: DEMO_COMMAND_90645,
    tool: DEMO_TOOL_POWERSHELL,
    messageText: DEMO_MESSAGE_90645,
    quotedPaths: [DEMO_PATH_90645, DEMO_MESSAGE_90645],
    extractedPath: DEMO_EXTRACTED_90645,
    blocked: true,
    blockMessage: DEMO_BLOCK_90645,
    platform: "windows",
  });
  assert.equal(calqued.verdict, "calqued");
  assert.equal(calqued.verbatim, false);
  assert.equal(calqued.fragQuote, true);
  assert.equal(calqued.spanishDel, true);
});

test("34 control without del produces verbatim=true; calqued never verbatim", () => {
  const hold = score({
    command: DEMO_CONTROL_COMMAND,
    tool: DEMO_TOOL_POWERSHELL,
    messageText: DEMO_CONTROL_MESSAGE,
    blocked: false,
  });
  assert.equal(hold.verdict, "verbatim");
  assert.equal(hold.verbatim, true);
  const lie = score({
    command: DEMO_COMMAND_90645,
    tool: DEMO_TOOL_POWERSHELL,
    messageText: DEMO_MESSAGE_90645,
    extractedPath: DEMO_EXTRACTED_90645,
    blocked: true,
    blockMessage: DEMO_BLOCK_90645,
  });
  assert.equal(lie.verbatim, false);
  assert.equal(lie.verdict, "calqued");
});

test("35 Slack skip on verbatim / control / bash-ok", () => {
  for (const seed of [seedReset, seedControl, seedBashOk, seedVerbatim]) {
    const result = decide(seed());
    assert.equal(result.slack, false, result.verdict);
    assert.match(slackCalqueAlarm(result, {}).summary, /Would skip Slack/);
  }
});

test("36 calqued triad wins over spanish-del and commit-blocked flags", () => {
  const result = score({
    command: DEMO_COMMAND_90645,
    tool: DEMO_TOOL_POWERSHELL,
    messageText: DEMO_MESSAGE_90645,
    extractedPath: DEMO_EXTRACTED_90645,
    blocked: true,
    blockMessage: DEMO_BLOCK_90645,
  });
  assert.equal(result.verdict, "calqued");
  assert.equal(result.verbatim, false);
});

test("37 admit still does not lie after calqued / spanish-del", () => {
  const admitted = decide({ ...seedCalqued(), action: "admit" });
  assert.equal(admitted.verdict, "calqued");
  assert.equal(admitted.verbatim, false);
  const lemma = decide({ ...seedSpanishDel(), action: "admit" });
  assert.equal(lemma.verdict, "spanish-del");
  assert.equal(lemma.verbatim, false);
});

test("38 HTML parse prefers JSON so command+block is calqued not quote-blind", () => {
  const html = readFileSync(fileURLToPath(new URL("../index.html", import.meta.url)), "utf8");
  assert.match(html, /raw\.startsWith\("\{"\)|startsWith\("\{"\)/);
  const probe = score({
    command: DEMO_COMMAND_90645,
    tool: DEMO_TOOL_POWERSHELL,
    messageText: DEMO_MESSAGE_90645,
    extractedPath: DEMO_EXTRACTED_90645,
    blocked: true,
    blockMessage: DEMO_BLOCK_90645,
  });
  assert.equal(probe.verdict, "calqued");
  assert.equal(probe.verbatim, false);
});

test("39 README and folio cite #90645 related target-side priors", () => {
  const readme = readFileSync(fileURLToPath(new URL("../README.md", import.meta.url)), "utf8");
  assert.match(readme, /90645/);
  assert.match(readme, /69461/);
  assert.match(readme, /73524/);
  assert.match(readme, /73882/);
  assert.doesNotMatch(readme, /idle word is calque |idle word is fronted|idle word is locked/i);
  const html = readFileSync(fileURLToPath(new URL("../index.html", import.meta.url)), "utf8");
  assert.match(html, /prueba del guard/);
  assert.match(html, /69461/);
  assert.match(html, /73524/);
  assert.match(html, /73882/);
  assert.match(html, new RegExp(String(PRIOR_TARGET_69461)));
  assert.match(html, new RegExp(String(PRIOR_TARGET_73524)));
  assert.match(html, new RegExp(String(PRIOR_TARGET_73882)));
  assert.match(html, /Produccion de Video|prueba del guard/);
  assert.ok(DEMO_BLOCK_90645.includes("Remove-Item on system path"));
});
