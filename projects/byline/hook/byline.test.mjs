import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  fire,
  githubBylineLedger,
  linearBylineTicket,
  slackBylineAlarm,
} from "./adapters.mjs";
import {
  ALARM_VERDICTS,
  CODEX_AUTO_REVIEW,
  CODEX_INTERRUPT,
  CODEX_NO_AGENT,
  DEMO_CAT_REDIR,
  DEMO_GHOST_0720,
  DEMO_GHOST_0835,
  DEMO_GHOST_0920,
  DEMO_GHOST_1332,
  DEMO_GHOST_1609,
  DEMO_LSOF,
  DEMO_NEXT_BASH,
  DEMO_REAL_0720,
  DEMO_REAL_0835,
  DEMO_REAL_0920,
  DEMO_REAL_1332,
  DEMO_REAL_1609,
  DEMO_VERSION,
  FEATURED_ISSUE,
  IDLE_WORD,
  LINEAR_VERDICTS,
  SLACK_VERDICTS,
  STOP_SIDE_59719,
  STOP_SIDE_87065,
  STOP_SIDE_88995,
  STOP_SIDE_89555,
  VERDICTS,
  analyze,
  classify,
  cloneByline,
  creditedOf,
  decide,
  decideSeed,
  emptyAction,
  emptyByline,
  feedOf,
  flagsOf,
  forbiddenIdleWords,
  isIdle,
  parseHookJson,
  parseSessionTrace,
  parseTranscriptJsonl,
  reasonsOf,
  reconcileTranscript,
  score,
  seed90662,
  seedBorrowed,
  seedControl,
  seedCredited,
  seedGhosted,
  seedHanging,
  seedNestSplit,
  seedReset,
  seedResumeSplit,
  seedSplit,
  seedStopSide59719,
  seedStopSide87065,
  seedStopSide88995,
  seedStopSide89555,
  seedStray,
  seedUnstopped,
  seedUntyped,
  verdictOf,
} from "./byline.mjs";
import { handle, listen } from "./index.mjs";

const PRIOR_IDLES =
  /empty|silent|mute|idle|dead|sealed|fronted|locked|yanked|caught|stowed|posted|bunged|belayed|rove|keyed|housed|beamed|snug|hung|appointed|cinched|gauged|stamped|overrun|pratique|wound|bound|stilled|stabled|drained|flat|fit|spoilt|laid|unlinked|tight|banked|roosted|stocked|seated|heard|clear|paired|kernel|latched|upheld|sterling|home|valid|dry|quiet|seised|rung|moored|verbatim|level/;

function assertIdleNeverByline(result) {
  assert.equal(result.idleWord, "credited");
  assert.equal(IDLE_WORD, "credited");
  assert.doesNotMatch(result.idleWord, /byline/i);
  assert.doesNotMatch(IDLE_WORD, /^byline$/i);
  assert.doesNotMatch(result.idleWord, PRIOR_IDLES);
}

function assertScoreShape(result) {
  assert.equal(typeof result.verdict, "string");
  assert.ok(Array.isArray(result.reasons));
  assert.equal(typeof result.credited, "boolean");
  assert.equal(typeof result.feed, "string");
}

test("1 seed 90662 split is split, slack, linear, idleWord credited, never credited", () => {
  const seed = seedSplit();
  const result = decide(seed);
  assert.equal(result.verdict, "split");
  assert.equal(result.state, "split");
  assert.equal(result.decision, "split");
  assert.equal(classify(seed.byline), "split");
  assert.equal(verdictOf(seed.byline), "split");
  assert.notEqual(result.verdict, "credited");
  assert.equal(result.alarm, true);
  assert.equal(result.slack, true);
  assert.equal(result.linear, true);
  assert.equal(result.github, true);
  assert.equal(result.split, true);
  assert.equal(result.credited, false);
  assertIdleNeverByline(result);
  assert.equal(result.session, "90662-1609-split");
  assert.equal(result.issue, FEATURED_ISSUE);
  assert.ok(result.ghosts.includes(DEMO_GHOST_1609));
  assert.ok(result.hired.includes(DEMO_REAL_1609));
  assert.equal(result.splitPair.realId, DEMO_REAL_1609);
  assert.equal(result.splitPair.ghostId, DEMO_GHOST_1609);
  assert.match(result.feed, /Split|lsof|primary #90662/i);
  assert.equal(decideSeed("split").verdict, "split");
  assert.equal(decideSeed("90662").verdict, "split");
  assert.equal(decideSeed(90662).verdict, "split");
  assert.equal(decide(seed90662()).verdict, "split");
});

test("2 idle/empty/{} is credited, never the product name, never empty, never error", () => {
  const result = decide(emptyAction("idle"));
  assert.equal(result.state, "credited");
  assert.equal(result.verdict, "credited");
  assert.equal(result.alarm, false);
  assert.equal(result.slack, false);
  assert.equal(result.credited, true);
  assert.equal(classify({}), "credited");
  assert.equal(classify(emptyByline()), "credited");
  assert.equal(isIdle(emptyByline()), true);
  assert.equal(score(emptyByline()).credited, true);
  assertIdleNeverByline(result);
  const bailed = decide({ action: "bail" });
  assert.equal(bailed.state, "credited");
  assert.equal(bailed.idleWord, "credited");
  const empty = decide({});
  assert.equal(empty.verdict, "credited");
  assert.match(empty.feed, /Credited/);
});

test("3 honest control with start+type+stop is credited with credited true", () => {
  const result = decide(seedControl());
  assert.equal(result.verdict, "credited");
  assert.equal(result.alarm, false);
  assert.equal(result.credited, true);
  assert.equal(result.linear, false);
  assert.ok(result.hired.includes("a111111"));
  assert.equal(result.ghosts.length, 0);
  assert.match(result.feed, /Credited|same agent_id/i);
  assert.equal(decideSeed("control").verdict, "credited");
  assert.equal(decideSeed("healthy").verdict, "credited");
  assert.equal(decide(seedCredited()).credited, true);
});

test("4 credited must not be confused with ghosted, split, or borrowed", () => {
  const hold = decide(seedCredited());
  const ghost = decide(seedGhosted());
  const split = decide(seedSplit());
  const borrowed = decide(seedBorrowed());
  assert.equal(hold.verdict, "credited");
  assert.equal(ghost.verdict, "ghosted");
  assert.equal(split.verdict, "split");
  assert.equal(borrowed.verdict, "borrowed");
  assert.notEqual(hold.verdict, ghost.verdict);
  assert.notEqual(hold.verdict, split.verdict);
  assert.notEqual(hold.verdict, borrowed.verdict);
  assert.equal(hold.credited, true);
  assert.equal(ghost.credited, false);
  assert.equal(split.credited, false);
  assert.equal(borrowed.credited, false);
  assert.equal(creditedOf(seedCredited().byline), true);
  assert.equal(creditedOf(seedGhosted().byline), false);
  assert.equal(creditedOf(seedSplit().byline), false);
  assert.equal(creditedOf(seedBorrowed().byline), false);
});

test("5 ghosted: Pre/Post under an id that never had SubagentStart", () => {
  const result = decide(seedGhosted());
  assert.equal(result.verdict, "ghosted");
  assert.equal(result.ghosted, true);
  assert.equal(result.credited, false);
  assert.equal(result.alarm, true);
  assert.equal(result.linear, true);
  assert.ok(result.ghosts.includes("f0aghost"));
  assert.match(result.feed, /Ghosted|never had SubagentStart/i);
  assert.equal(decideSeed("ghosted").verdict, "ghosted");
});

test("6 untyped: hired id, payloads have agent_id but no agent_type", () => {
  const result = decide(seedUntyped());
  assert.equal(result.verdict, "untyped");
  assert.equal(result.untyped, true);
  assert.equal(result.credited, false);
  assert.equal(result.ghosted, false);
  assert.equal(result.slack, false);
  assert.equal(result.linear, false);
  assert.match(result.feed, /Untyped|no agent_type/i);
});

test("7 unstopped: hired typed entry never receives SubagentStop", () => {
  const result = decide(seedUnstopped());
  assert.equal(result.verdict, "unstopped");
  assert.equal(result.unstopped, true);
  assert.equal(result.credited, false);
  assert.equal(result.alarm, true);
  assert.equal(result.linear, false);
  assert.match(result.feed, /Unstopped|never receives SubagentStop/i);
});

test("8 hanging: 09:20 #90662 ghost keeps collecting copy for 45+ minutes", () => {
  const result = decide(seedHanging());
  assert.equal(result.verdict, "hanging");
  assert.equal(result.hanging, true);
  assert.equal(result.credited, false);
  assert.ok(result.ghosts.includes(DEMO_GHOST_0920));
  assert.ok(result.hired.includes(DEMO_REAL_0920));
  assert.equal(result.alarm, true);
  assert.match(result.feed, /Hanging|45 minutes/i);
  assert.equal(decideSeed("0920").verdict, "hanging");
});

test("9 stray: 07:20 #90662 short burst on a ghost then silence", () => {
  const result = decide(seedStray());
  assert.equal(result.verdict, "stray");
  assert.equal(result.stray, true);
  assert.equal(result.credited, false);
  assert.ok(result.ghosts.includes(DEMO_GHOST_0720));
  assert.ok(result.hired.includes(DEMO_REAL_0720));
  assert.equal(result.alarm, true);
  assert.match(result.feed, /Stray|short burst|07:20/i);
  assert.equal(decideSeed("0720").verdict, "stray");
});

test("10 borrowed: 08:35 #90662 ghost later receives cat > from other subagents", () => {
  const result = decide(seedBorrowed());
  assert.equal(result.verdict, "borrowed");
  assert.equal(result.borrowed, true);
  assert.equal(result.credited, false);
  assert.ok(result.ghosts.includes(DEMO_GHOST_0835));
  assert.ok(result.hired.includes(DEMO_REAL_0835));
  assert.ok(result.borrowedFrom.laterFrom.length > 0);
  assert.equal(result.linear, true);
  assert.match(result.feed, /Borrowed|cat >|08:35/i);
  assert.equal(decideSeed("0835").verdict, "borrowed");
});

test("11 nest-split: stray id appears right after Agent-tool child spawn", () => {
  const result = decide(seedNestSplit());
  assert.equal(result.verdict, "nest-split");
  assert.equal(result.nestSplit, true);
  assert.equal(result.credited, false);
  assert.notEqual(result.verdict, "split");
  assert.equal(result.alarm, true);
  assert.match(result.feed, /Nest-split|Agent-tool/i);
});

test("12 resume-split: 13:32 #90662 stray after SendMessage resume", () => {
  const result = decide(seedResumeSplit());
  assert.equal(result.verdict, "resume-split");
  assert.equal(result.resumeSplit, true);
  assert.equal(result.credited, false);
  assert.ok(result.ghosts.includes(DEMO_GHOST_1332));
  assert.ok(result.hired.includes(DEMO_REAL_1332));
  assert.equal(result.alarm, true);
  assert.match(result.feed, /Resume-split|SendMessage|13:32/i);
  assert.equal(decideSeed("1332").verdict, "resume-split");
});

test("13 five reconciled #90662 cases plus credited control are distinct", () => {
  const map = {
    credited: decide(seedCredited()).verdict,
    stray: decide(seedStray()).verdict,
    borrowed: decide(seedBorrowed()).verdict,
    hanging: decide(seedHanging()).verdict,
    "resume-split": decide(seedResumeSplit()).verdict,
    split: decide(seedSplit()).verdict,
  };
  assert.equal(map.credited, "credited");
  assert.equal(map.stray, "stray");
  assert.equal(map.borrowed, "borrowed");
  assert.equal(map.hanging, "hanging");
  assert.equal(map["resume-split"], "resume-split");
  assert.equal(map.split, "split");
  const unique = new Set(Object.values(map));
  assert.equal(unique.size, 6);
});

test("14 stop-side nearby is labeled stop-side, not treated as this bug", () => {
  for (const seed of [seedStopSide89555, seedStopSide87065, seedStopSide59719, seedStopSide88995]) {
    const result = decide(seed());
    assert.equal(result.stopSideNearby, true, result.session);
    assert.notEqual(result.verdict, "ghosted", result.session);
    assert.notEqual(result.verdict, "split", result.session);
    assert.notEqual(result.verdict, "borrowed", result.session);
    assert.ok(
      result.eventClass === "stop-side" || result.stopSideIssues.length > 0,
      result.session,
    );
    assert.ok(result.reasons.some((row) => /stop-side nearby/i.test(row)));
  }
  assert.equal(decide(seedStopSide89555()).stopSideIssues.includes(STOP_SIDE_89555), true);
  assert.equal(decide(seedStopSide87065()).stopSideIssues.includes(STOP_SIDE_87065), true);
  assert.equal(decide(seedStopSide59719()).stopSideIssues.includes(STOP_SIDE_59719), true);
});

test("15 forbidden idle list includes byline, empty, leftover names, not credited", () => {
  const words = forbiddenIdleWords();
  assert.ok(words.includes("byline"));
  assert.ok(words.includes("empty"));
  assert.ok(words.includes("silent"));
  assert.ok(words.includes("mute"));
  assert.ok(words.includes("fronted"));
  assert.ok(words.includes("locked"));
  assert.ok(words.includes("yanked"));
  assert.ok(words.includes("verbatim"));
  assert.ok(words.includes("level"));
  assert.ok(words.includes("datum"));
  assert.ok(words.includes("calque"));
  assert.ok(words.includes("shunt"));
  assert.ok(words.includes("tappet"));
  assert.ok(!words.includes("credited"));
  assert.doesNotMatch(IDLE_WORD, PRIOR_IDLES);
});

test("16 demo sinks: Slack on ghosted/split/borrowed/unstopped; Linear on those three; GitHub always; never fake live 200", async () => {
  const ghosted = decide(seedGhosted());
  const slack = slackBylineAlarm(ghosted, {});
  assert.equal(slack.mode, "demo");
  assert.match(slack.summary, /Would post to Slack/);
  assert.ok(Array.isArray(slack.body.blocks));
  const github = githubBylineLedger(ghosted, {});
  assert.equal(github.mode, "demo");
  assert.match(github.summary, /Would open a GitHub byline-ledger/);
  const linear = linearBylineTicket(ghosted, {});
  assert.equal(linear.mode, "demo");
  assert.match(linear.summary, /Would open a Linear ticket/);

  for (const seed of [seedGhosted, seedSplit, seedBorrowed, seedUnstopped]) {
    const result = decide(seed());
    assert.equal(result.slack, true, result.verdict);
    assert.match(slackBylineAlarm(result, {}).summary, /Would post to Slack/);
  }
  for (const seed of [seedGhosted, seedSplit, seedBorrowed]) {
    const result = decide(seed());
    assert.equal(result.linear, true, result.verdict);
    assert.match(linearBylineTicket(result, {}).summary, /Would open a Linear ticket/);
  }
  const honest = decide(seedControl());
  assert.match(linearBylineTicket(honest, {}).summary, /Would skip Linear/);
  assert.match(slackBylineAlarm(honest, {}).summary, /Would skip Slack/);
  assert.match(githubBylineLedger(honest, {}).summary, /Would open a GitHub byline-ledger/);
  const idle = decide(emptyAction("idle"));
  assert.match(slackBylineAlarm(idle, {}).summary, /Would skip Slack/);
  const fired = await fire(ghosted, {});
  assert.equal(fired.events.length, 3);
  assert.ok(fired.events.every((row) => row.ok === true));
  assert.ok(fired.events.every((row) => row.mode === "demo"));
  assert.ok(fired.events.every((row) => !/HTTP 200|live 200/.test(row.summary || "")));
});

test("17 Slack live plan uses SLACK_WEBHOOK alias and GITHUB_TOKEN alias", () => {
  const split = decide(seedSplit());
  const slack = slackBylineAlarm(split, { SLACK_WEBHOOK: "https://hooks.example/y" });
  assert.equal(slack.mode, "live");
  const github = githubBylineLedger(split, { GITHUB_TOKEN: "tok" });
  assert.equal(github.mode, "live");
  const linear = linearBylineTicket(split, { LINEAR_API_KEY: "lin" });
  assert.equal(linear.mode, "live");
});

test("18 fire live slack posts when fetch ok", async () => {
  const split = decide(seedSplit());
  const events = await fire(
    split,
    { BYLINE_SLACK_WEBHOOK: "https://hooks.example/x" },
    async () => ({
      ok: true,
      status: 200,
      json: async () => ({}),
    }),
  );
  const slack = events.events.find((row) => row.adapter === "slack");
  assert.equal(slack.ok, true);
  assert.match(slack.summary, /Posted split/);
});

test("19 handle deny on split, allow on credited", async () => {
  const denied = await handle(seedSplit(), {});
  assert.equal(denied.permissionDecision, "deny");
  assert.equal(denied.verdict, "split");
  assert.ok(Array.isArray(denied.sinks));
  const allowed = await handle(seedCredited(), {});
  assert.equal(allowed.permissionDecision, "allow");
  assert.equal(allowed.verdict, "credited");
  assert.match(allowed.hookSpecificOutput.decision.message, /credited/i);
});

test("20 listen health reports byline verbs", async () => {
  const server = listen(0);
  await new Promise((resolve) => server.once("listening", resolve));
  const { port } = server.address();
  const res = await fetch(`http://127.0.0.1:${port}/health`);
  const body = await res.json();
  assert.equal(body.product, "byline");
  assert.match(body.verbs, /credited/);
  assert.match(body.verbs, /split/);
  server.close();
});

test("21 parseHookJson and parseSessionTrace consume hook JSON and transcript jsonl", () => {
  const hook = parseHookJson({
    hook_event_name: "PreToolUse",
    agent_id: "f0aghost",
    tool_name: "Bash",
    tool_input: { command: "pwd" },
  });
  assert.equal(hook.events[0].agent_id, "f0aghost");
  assert.equal(hook.events[0].hook, "PreToolUse");
  const jsonl = parseTranscriptJsonl(
    `{"type":"tool_use","timestamp":"2026-08-29T16:14:51Z","tool_name":"Bash","tool_input":{"command":"${DEMO_LSOF}"}}\n{"type":"tool_use","timestamp":"2026-08-29T16:15:06Z","tool_name":"Bash","tool_input":{"command":"${DEMO_NEXT_BASH}"}}\n`,
    DEMO_REAL_1609,
  );
  assert.equal(jsonl[DEMO_REAL_1609].length, 2);
  const traced = parseSessionTrace(
    `{"hook_event_name":"SubagentStart","agent_id":"a1","agent_type":"claude"}\n{"hook_event_name":"PreToolUse","agent_id":"a1","agent_type":"claude","tool_name":"Bash","tool_input":{"command":"pwd"}}\n{"hook_event_name":"SubagentStop","agent_id":"a1","agent_type":"claude"}`,
  );
  assert.equal(classify(traced), "credited");
});

test("22 reconcileTranscript reports two-id split pair", () => {
  const rec = reconcileTranscript(seedSplit().byline);
  assert.equal(rec.verdict, "split");
  assert.equal(rec.splitPair.realId, DEMO_REAL_1609);
  assert.equal(rec.splitPair.ghostId, DEMO_GHOST_1609);
  assert.match(rec.splitPair.first.tool_input, /lsof/);
  assert.match(rec.splitPair.second.tool_input, /cd ~\/projects/);
});

test("23 score() accepts the documented probe shape", () => {
  const result = score(seedSplit().byline);
  assert.equal(result.verdict, "split");
  assert.equal(result.credited, false);
  const hold = score(seedCredited().byline);
  assert.equal(hold.verdict, "credited");
  assert.equal(hold.credited, true);
});

test("24 nested byline / probe fields clone", () => {
  const byline = cloneByline({ probe: seedSplit().byline });
  assert.equal(classify(byline), "split");
  const rack = cloneByline({ rack: seedBorrowed().byline });
  assert.equal(classify(rack), "borrowed");
});

test("25 admit still does not lie after split / ghosted / borrowed", () => {
  const admitted = decide({ ...seedSplit(), action: "admit" });
  assert.equal(admitted.verdict, "split");
  assert.equal(admitted.credited, false);
  const ghost = decide({ ...seedGhosted(), action: "admit" });
  assert.equal(ghost.verdict, "ghosted");
  assert.equal(ghost.credited, false);
  const borrowed = decide({ ...seedBorrowed(), action: "admit" });
  assert.equal(borrowed.verdict, "borrowed");
});

test("26 restore / 90662 / incident produce the cleanest split seed", () => {
  assert.equal(decide({ action: "restore" }).verdict, "split");
  assert.equal(decide({ action: "90662" }).verdict, "split");
  assert.equal(decide({ action: "incident" }).verdict, "split");
  assert.equal(decide({ action: "control" }).verdict, "credited");
  assert.equal(decide({ action: "reset" }).verdict, "credited");
});

test("27 VERDICTS and sink lists stay distinct and testable", () => {
  assert.deepEqual(VERDICTS.slice().sort(), [
    "borrowed",
    "credited",
    "ghosted",
    "hanging",
    "nest-split",
    "resume-split",
    "split",
    "stray",
    "unstopped",
    "untyped",
  ]);
  assert.ok(SLACK_VERDICTS.includes("ghosted"));
  assert.ok(SLACK_VERDICTS.includes("split"));
  assert.ok(SLACK_VERDICTS.includes("borrowed"));
  assert.ok(SLACK_VERDICTS.includes("unstopped"));
  assert.ok(!SLACK_VERDICTS.includes("credited"));
  assert.ok(!SLACK_VERDICTS.includes("untyped"));
  assert.deepEqual(LINEAR_VERDICTS.slice().sort(), ["borrowed", "ghosted", "split"]);
  assert.ok(ALARM_VERDICTS.includes("split"));
  assert.equal(FEATURED_ISSUE, 90662);
  assert.equal(DEMO_VERSION, "2.1.251");
});

test("28 flagsOf / feedOf / reasonsOf / analyze expose the triad", () => {
  const flags = flagsOf(seedSplit().byline);
  assert.equal(flags.splitShape, true);
  assert.equal(flags.verdict, "split");
  assert.equal(flags.credited, false);
  assert.match(feedOf("credited"), /idle word is credited/);
  const reasons = reasonsOf(seedSplit().byline, "split");
  assert.ok(reasons.some((row) => /#90662/.test(row)));
  const facts = analyze(seedSplit().byline);
  assert.equal(facts.splitShape, true);
  assert.equal(facts.eventClass, "pre-post-split");
});

test("29 folio HTML sanity: idle word credited, seeded split, not datum/calque/fascia", () => {
  const html = readFileSync(fileURLToPath(new URL("../index.html", import.meta.url)), "utf8");
  assert.match(html, /credited/);
  assert.match(html, /Score/);
  assert.match(html, /ghosted/);
  assert.match(html, /90662/);
  assert.match(html, /seedOf\("split"\)|byline = seedOf\("split"\)/);
  assert.match(html, /const IDLE_WORD = "credited"/);
  assert.doesNotMatch(html, /const IDLE_WORD = "byline"/);
  assert.doesNotMatch(html, /const IDLE_WORD = "fronted"/);
  assert.doesNotMatch(html, /const IDLE_WORD = "empty"/);
  assert.doesNotMatch(html, /const IDLE_WORD = "level"/);
  assert.doesNotMatch(html, /const IDLE_WORD = "verbatim"/);
  assert.match(
    html,
    /city-desk|masthead-plate|brass-nameplate-rack|ghost-byline-card|attribution-ledger|copy-spike|wire-ticker|newsprint-sheet/i,
  );
  assert.match(html, /10:50 Sydney · byline/);
  assert.match(html, /a ghost byline is not a hold/i);
  assert.doesNotMatch(html, /class="survey-field"|class="datum-desk"|class="brass-leveling-plate"/);
  assert.doesNotMatch(html, /class="shopfront-street"|class="enamel-fascia-board"|class="frosted-shop-door"/);
  assert.doesNotMatch(html, /class="composing-room"|class="oak-chase"|class="brass-quoin"|class="ink-slab"/);
  assert.doesNotMatch(html, /class="music-hall"|class="house-curtain"|class="proscenium-arch"|class="brass-crook"/);
  assert.doesNotMatch(html, /class="gunsmith-shop"|class="sear-rail"|class="walnut-stock"/);
  assert.doesNotMatch(html, /class="teller-hall"|class="marble-counter"|class="bronze-lattice"/);
  assert.doesNotMatch(html, /class="mailroom-hall"|class="cubby-wall"/);
  assert.doesNotMatch(html, /class="scriptorium-hall"|class="false-gloss-desk"|class="bilingual-manuscript"/);
  assert.doesNotMatch(html, /Bodoni Moda|Roboto Mono/);
  assert.doesNotMatch(html, /Abril Fatface|Bebas Neue|Cutive Mono/);
  assert.doesNotMatch(html, /Calistoga|Commissioner|Inconsolata/);
  assert.doesNotMatch(html, /Cinzel|Lora|Overpass Mono/);
  assert.doesNotMatch(html, /Playfair Display|IBM Plex Mono/);
  assert.doesNotMatch(html, /IM Fell English|Red Hat Mono/);
  assert.doesNotMatch(html, /Special Elite|Share Tech Mono|Barlow Condensed/);
  assert.doesNotMatch(html, /millimeter slider|millimetre slider/i);
  assert.match(html, /<title>Byline/);
  assert.match(html, /Oswald|Newsreader|Azeret Mono/);
  assert.match(html, /Admit credited/);
  assert.match(html, /Restore · #90662|restore to split/i);
});

test("30 HTML why-not names Shunt, Cote, Tappet, Datum, Calque, leftover", () => {
  const html = readFileSync(fileURLToPath(new URL("../index.html", import.meta.url)), "utf8");
  assert.match(html, /NOT Shunt/);
  assert.match(html, /NOT Cote/);
  assert.match(html, /NOT Tappet/);
  assert.match(html, /NOT Sounder/);
  assert.match(html, /NOT Fascia/);
  assert.match(html, /NOT Datum/);
  assert.match(html, /NOT Calque/);
  assert.match(html, /NOT Quoin/);
  assert.match(html, /NOT Gaff/);
  assert.match(html, /leftover/);
  assert.match(html, /millimeter-slider|millimetre-slider|millimeter slider|millimetre slider/);
});

test("31 README names contrasts and credited idle", () => {
  const readme = readFileSync(fileURLToPath(new URL("../README.md", import.meta.url)), "utf8");
  assert.match(readme, /NOT \*\*Shunt\*\*|NOT Shunt/);
  assert.match(readme, /NOT \*\*Cote\*\*|NOT Cote/);
  assert.match(readme, /NOT \*\*Tappet\*\*|NOT Tappet/);
  assert.match(readme, /NOT \*\*Datum\*\*|NOT Datum/);
  assert.match(readme, /NOT \*\*Calque\*\*|NOT Calque/);
  assert.match(readme, /\*\*credited\*\*/);
  assert.match(readme, /#90662/);
  assert.match(readme, /#89555/);
  assert.match(readme, /#87065/);
  assert.match(readme, /#59719/);
  assert.match(readme, /#88995/);
  assert.match(readme, /\/byline\//);
  assert.doesNotMatch(readme, /idle word is byline/i);
  assert.doesNotMatch(readme, /idle word is fronted/i);
  assert.doesNotMatch(readme, /idle word is level/i);
  assert.doesNotMatch(readme, /idle word is verbatim/i);
});

test("32 README and desk cite #90662 plus stop-side nearby and cross-ecosystem", () => {
  const readme = readFileSync(fileURLToPath(new URL("../README.md", import.meta.url)), "utf8");
  assert.match(readme, /90662/);
  assert.match(readme, /16226/);
  assert.match(readme, /38142/);
  assert.match(readme, /40802/);
  const html = readFileSync(fileURLToPath(new URL("../index.html", import.meta.url)), "utf8");
  assert.match(html, /90662/);
  assert.match(html, /89555/);
  assert.match(html, /87065/);
  assert.match(html, /59719/);
  assert.match(html, /88995/);
  assert.match(html, /16226/);
  assert.match(html, /a37ed07/);
  assert.match(html, /lsof/);
  assert.equal(CODEX_NO_AGENT, 16226);
  assert.equal(CODEX_INTERRUPT, 38142);
  assert.equal(CODEX_AUTO_REVIEW, 40802);
  assert.equal(STOP_SIDE_88995, 88995);
});

test("33 Slack skip on credited / control / untyped", () => {
  for (const seed of [seedReset, seedControl, seedUntyped, seedCredited]) {
    const result = decide(seed());
    assert.equal(result.slack, false, result.verdict);
    assert.match(slackBylineAlarm(result, {}).summary, /Would skip Slack/);
  }
});

test("34 borrowed beats hanging when a long ghost later collects another reporter", () => {
  const result = score(seedBorrowed().byline);
  assert.equal(result.verdict, "borrowed");
  assert.equal(result.credited, false);
  assert.match(result.borrowedFrom.laterFrom.join(" "), /a799181|ab28539|a37ed07/);
});

test("35 split beats nest-split on the 16:09 triad", () => {
  const result = score(seedSplit().byline);
  assert.equal(result.verdict, "split");
  assert.equal(analyze(seedSplit().byline).nestSplit, true);
  assert.equal(analyze(seedSplit().byline).splitShape, true);
});

test("36 HTML parse prefers JSON so hook consumer scores a ghost rack", () => {
  const html = readFileSync(fileURLToPath(new URL("../index.html", import.meta.url)), "utf8");
  assert.match(html, /raw\.startsWith\("\{"\)|startsWith\("\{"\)/);
  const probe = score(seedGhosted().byline);
  assert.equal(probe.verdict, "ghosted");
  assert.equal(probe.credited, false);
});

test("37 constants name the five UTC ids and the cat >/lsof copy", () => {
  assert.equal(DEMO_REAL_1609, "a37ed07");
  assert.equal(DEMO_GHOST_1609, "f0a16e9");
  assert.match(DEMO_LSOF, /lsof -nP -iTCP/);
  assert.match(DEMO_NEXT_BASH, /cd ~\/projects/);
  assert.equal(DEMO_REAL_0720, "aecdca5");
  assert.equal(DEMO_GHOST_0720, "f0a0720");
  assert.equal(DEMO_REAL_0835, "a74c422");
  assert.equal(DEMO_GHOST_0835, "f0a0835");
  assert.match(DEMO_CAT_REDIR, /cat >/);
  assert.equal(DEMO_REAL_0920, "a355335");
  assert.equal(DEMO_GHOST_0920, "f0a0920");
  assert.equal(DEMO_REAL_1332, "af2b998");
  assert.equal(DEMO_GHOST_1332, "f0a1332");
});

test("38 assertScoreShape on every family verdict", () => {
  for (const seed of [
    seedCredited,
    seedGhosted,
    seedUntyped,
    seedUnstopped,
    seedHanging,
    seedSplit,
    seedStray,
    seedBorrowed,
    seedNestSplit,
    seedResumeSplit,
  ]) {
    const result = decide(seed());
    assertScoreShape(result);
    assertIdleNeverByline(result);
    assert.ok(VERDICTS.includes(result.verdict), result.verdict);
  }
});
