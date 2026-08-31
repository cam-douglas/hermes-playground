import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ALARM_VERDICTS,
  CCD,
  CHIPS,
  CLUSTER_COUNT,
  CLUSTER_EPOCH,
  CLUSTER_LOCAL,
  CONTRAST_NOTE,
  ENTRYPOINT,
  EXAMPLES,
  FEATURED_ISSUE,
  FILED_AT,
  FORBIDDEN_IDLE,
  HOLD_VERDICTS,
  HUB_LINE,
  HYPOTHESIS_NOTE,
  IDLE_WORD,
  ISSUE_URL,
  LABELS,
  LATEST_PUBLISHED,
  MARK,
  MAX_SKEW_DAYS,
  MEDIAN_SKEW_DAYS,
  MIN_SKEW_DAYS,
  NOT_PRODUCTS,
  OS_NAME,
  OVER_SEVEN_DAYS,
  PHRASE,
  PRIMARY_ISSUES,
  REPORTER,
  SAME_CLASS,
  SEEDED_WORD,
  SESSION_FILES,
  TAIL_COUNTS,
  TITLE,
  VERDICTS,
  analyze,
  chipsOf,
  classify,
  decide,
  decideSeed,
  emptyTicket,
  handle,
  normalize,
  score,
  seedCollapsed,
  seedPointed,
} from "./gnomon.mjs";

function readData(name) {
  return JSON.parse(
    readFileSync(fileURLToPath(new URL(`../data/${name}`, import.meta.url)), "utf8")
  );
}

function readPage() {
  return readFileSync(fileURLToPath(new URL("../index.html", import.meta.url)), "utf8");
}

function hookPath() {
  return fileURLToPath(new URL("./gnomon.mjs", import.meta.url));
}

test("idle pointed is a hold; true shadow tracks last event", () => {
  const result = analyze(seedPointed());
  assert.equal(result.verdict, "pointed");
  assert.equal(result.idleWord, "pointed");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.collapsed, false);
  assert.ok(result.chips.includes("pointed"));
  assert.ok(!result.chips.includes("collapsed"));
  assert.ok(!result.chips.includes("shared-second"));
  assert.doesNotMatch(
    result.idleWord,
    /gnomon|collapsed|mtime|transcript|bulk|cast|eclipsed|spoiled|banked|rewrite|shared|trammel|hunting|traced/i,
  );
});

test("empty ticket and empty stdin classify pointed", () => {
  assert.equal(classify(emptyTicket()), "pointed");
  assert.equal(classify(""), "pointed");
  assert.equal(classify(null), "pointed");
  assert.equal(decideSeed("pointed").verdict, "pointed");
});

test("seeded collapsed #90954 is alarm with the shared-second chips", () => {
  const result = analyze(seedCollapsed());
  assert.equal(result.verdict, "collapsed");
  assert.equal(result.alarm, true);
  assert.equal(result.hold, false);
  assert.ok(result.chips.includes("collapsed"));
  assert.ok(result.chips.includes("bulk-mtime"));
  assert.ok(result.chips.includes("shared-second"));
  assert.ok(result.chips.includes("closed-transcript"));
  assert.ok(result.chips.includes("date-signal"));
  assert.ok(result.chips.includes("untimed-tail"));
  assert.ok(result.chips.includes("last-prompt"));
  assert.ok(result.chips.includes("silent-wrong"));
  assert.ok(result.chips.includes("retention-lie"));
  assert.ok(result.chips.includes("cluster-114"));
  assert.ok(result.chips.includes("mtime-vs-content"));
  assert.ok(result.chips.includes("archive-clock"));
  assert.ok(result.chips.includes("no-timestamp"));
  assert.ok(!result.chips.includes("pointed"));
  assert.match(result.contrast.dial, /114 files/);
  assert.match(result.contrast.shadow, /median 17 days/);
  assert.match(result.contrast.meridian, /no timestamp/);
  assert.match(result.contrast.note, /labeled observation/);
});

test("data fixtures classify pointed vs collapsed vs named chips", () => {
  assert.equal(classify(readData("pointed.json")), "pointed");
  assert.equal(classify(readData("collapsed.json")), "collapsed");
  assert.equal(classify(readData("90954.json")), "collapsed");
  assert.equal(classify(readData("bulk-mtime.json")), "bulk-mtime");
  assert.equal(classify(readData("shared-second.json")), "shared-second");
  assert.equal(classify(readData("closed-transcript.json")), "closed-transcript");
  assert.equal(classify(readData("date-signal.json")), "date-signal");
  assert.equal(classify(readData("untimed-tail.json")), "untimed-tail");
  assert.equal(classify(readData("last-prompt.json")), "last-prompt");
  assert.equal(classify(readData("silent-wrong.json")), "silent-wrong");
  assert.equal(classify(readData("retention-lie.json")), "retention-lie");
  assert.equal(classify(readData("cluster-114.json")), "cluster-114");
  assert.equal(classify(readData("mtime-vs-content.json")), "mtime-vs-content");
  assert.equal(classify(readData("archive-clock.json")), "archive-clock");
  assert.equal(classify(readData("no-timestamp.json")), "no-timestamp");
});

test("collapsed seed is alarm; pointed seed is hold", () => {
  assert.equal(score(seedCollapsed()).alarm, true);
  assert.equal(score(seedCollapsed()).hold, false);
  assert.equal(score(seedPointed()).hold, true);
  assert.equal(score(seedPointed()).alarm, false);
});

test("normalize seeds 90954 without ticket fields", () => {
  const ticket = normalize({ issue: 90954 });
  assert.equal(ticket.sharedMtime, true);
  assert.equal(ticket.timestampFreeTail, true);
  assert.equal(ticket.closedTranscript, true);
  assert.equal(ticket.dateSkew, true);
  assert.equal(ticket.lastPromptTail, true);
  assert.equal(classify(ticket), "collapsed");
});

test("score / decide / handle agree on collapsed vs pointed", () => {
  assert.equal(score(seedCollapsed()).verdict, "collapsed");
  assert.equal(decide(seedPointed()).verdict, "pointed");
  const fail = handle(seedCollapsed());
  const hold = handle(seedPointed());
  assert.match(fail.hookSpecificOutput.additionalContext, /#90954/);
  assert.match(hold.hookSpecificOutput.additionalContext, /pointed/i);
});

test("decideSeed aliases", () => {
  assert.equal(decideSeed("collapsed").verdict, "collapsed");
  assert.equal(decideSeed(90954).verdict, "collapsed");
  assert.equal(decideSeed("90954").verdict, "collapsed");
  assert.equal(decideSeed("pointed").verdict, "pointed");
});

test("CLI scores data files", () => {
  const collapsed = spawnSync(
    process.execPath,
    [hookPath(), fileURLToPath(new URL("../data/collapsed.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(collapsed.status, 0, collapsed.stderr);
  assert.equal(JSON.parse(collapsed.stdout).verdict, "collapsed");

  const pointed = spawnSync(
    process.execPath,
    [hookPath(), fileURLToPath(new URL("../data/pointed.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(pointed.status, 0, pointed.stderr);
  assert.equal(JSON.parse(pointed.stdout).verdict, "pointed");
});

test("constants match the issue facts only", () => {
  assert.equal(FEATURED_ISSUE, 90954);
  assert.deepEqual([...PRIMARY_ISSUES], [90954]);
  assert.deepEqual([...SAME_CLASS], [87900, 81803, 72746, 68929]);
  assert.equal(REPORTER, "somarakis");
  assert.equal(FILED_AT, "2026-08-31T10:32:53Z");
  assert.equal(CCD, "2.1.247");
  assert.equal(LATEST_PUBLISHED, "2.1.251");
  assert.equal(OS_NAME, "macOS Darwin 25.5.0 Apple Silicon");
  assert.equal(ENTRYPOINT, "claude-desktop");
  assert.equal(SESSION_FILES, 1206);
  assert.equal(CLUSTER_COUNT, 114);
  assert.equal(CLUSTER_EPOCH, 1787422837);
  assert.equal(CLUSTER_LOCAL, "2026-08-22T21:20:37");
  assert.equal(MEDIAN_SKEW_DAYS, 17);
  assert.equal(MIN_SKEW_DAYS, 3);
  assert.equal(MAX_SKEW_DAYS, 47);
  assert.equal(OVER_SEVEN_DAYS, 93);
  assert.equal(TAIL_COUNTS["last-prompt"], 76);
  assert.equal(TAIL_COUNTS.mode, 21);
  assert.equal(EXAMPLES[0].lastEvent, "2026-07-22T14:00:18Z");
  assert.equal(EXAMPLES[1].lastEvent, "2026-08-04T10:19:24Z");
  assert.equal(IDLE_WORD, "pointed");
  assert.equal(SEEDED_WORD, "collapsed");
  assert.notEqual(IDLE_WORD, "collapsed");
  assert.notEqual(IDLE_WORD, "gnomon");
  assert.notEqual(IDLE_WORD, "cast");
  assert.notEqual(IDLE_WORD, "eclipsed");
  assert.deepEqual([...HOLD_VERDICTS], ["pointed"]);
  assert.ok(ALARM_VERDICTS.includes("collapsed"));
  assert.ok(!ALARM_VERDICTS.includes("pointed"));
  assert.deepEqual([...VERDICTS], [...CHIPS]);
  assert.equal(VERDICTS.length, 14);
  assert.deepEqual(
    [...LABELS],
    ["bug", "has repro", "platform:macos", "area:core"],
  );
  assert.match(TITLE, /shared mtime, destroying file-date signal/);
  assert.match(ISSUE_URL, /90954/);
  assert.match(PHRASE, /shared mtime is not a hold/i);
  assert.match(HUB_LINE, /20:50 gnomon/);
  assert.match(HUB_LINE, /admit pointed/);
  assert.match(MARK, /20:50/);
  assert.match(MARK, /#94/);
  assert.match(MARK, /#90954/);
  assert.match(CONTRAST_NOTE, /preserve mtime/);
  assert.match(HYPOTHESIS_NOTE, /labeled observation, not a proven cause/);
  assert.ok(NOT_PRODUCTS.includes("spoil"));
  assert.ok(NOT_PRODUCTS.includes("trammel"));
  assert.ok(NOT_PRODUCTS.includes("clepsydra"));
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(IDLE_WORD, word);
  }
});

test("chips.json and fingerprints stay aligned", () => {
  const chips = readData("chips.json");
  assert.deepEqual(chips.verdicts, [...VERDICTS]);
  assert.equal(chips.idleWord, "pointed");
  assert.equal(chips.seededWord, "collapsed");
  const fp = readData("fingerprints.json");
  assert.equal(fp.primary, 90954);
  assert.equal(fp.ccd, "2.1.247");
  assert.equal(fp.clusterEpoch, 1787422837);
  assert.equal(fp.clusterCount, 114);
  assert.deepEqual(fp.sameClass, [87900, 81803, 72746, 68929]);
  const contrast = readData("contrast.json");
  assert.match(contrast.preserveMtime.result, /preserve/);
  assert.match(contrast.timestampRequired.result, /timestamp/);
  assert.equal(contrast.sameClass.startupIndexing, 87900);
  assert.equal(contrast.sameClass.extensionUpdate, 81803);
  assert.equal(contrast.sameClass.agentViewLastChanged, 72746);
  assert.equal(contrast.sameClass.titleBackfill, 68929);
});

test("chipsOf on a raw collapsed ticket still marks date-signal", () => {
  const chips = chipsOf({
    sharedMtime: true,
    timestampFreeTail: true,
    lastPromptTail: true,
    modeTail: true,
    closedTranscript: true,
    dateSkew: true,
    silentWrong: true,
    retentionTrap: true,
    lsLtLie: true,
    mtimePreserved: false,
    timestampRequired: false,
    healthyDating: false,
    lastEventDaysAgo: 17,
    clusterCount: 114,
  });
  assert.ok(chips.includes("collapsed"));
  assert.ok(chips.includes("date-signal"));
  assert.ok(chips.includes("no-timestamp"));
  assert.ok(chips.includes("cluster-114"));
  assert.ok(!chips.includes("pointed"));
});

test("preserve-mtime contrast does not collapse", () => {
  const result = analyze({
    sharedMtime: false,
    timestampFreeTail: false,
    closedTranscript: true,
    dateSkew: false,
    mtimePreserved: true,
    timestampRequired: false,
    healthyDating: false,
    outputText: "writes to an already-closed transcript preserve its mtime",
  });
  assert.notEqual(result.verdict, "collapsed");
  assert.ok(result.reasons.some((row) => /preserve mtime/i.test(row)));
});

test("living page is an observatory sundial terrace, idle pointed, seeded collapsed", () => {
  const html = readPage();
  assert.match(html, /Idle word:\s*pointed/);
  assert.match(html, /pointed/);
  assert.match(html, /collapsed/);
  assert.match(html, /bulk-mtime/);
  assert.match(html, /shared-second/);
  assert.match(html, /closed-transcript/);
  assert.match(html, /date-signal/);
  assert.match(html, /untimed-tail/);
  assert.match(html, /last-prompt/);
  assert.match(html, /silent-wrong/);
  assert.match(html, /retention-lie/);
  assert.match(html, /cluster-114/);
  assert.match(html, /mtime-vs-content/);
  assert.match(html, /archive-clock/);
  assert.match(html, /no-timestamp/);
  assert.match(html, /#90954/);
  assert.match(html, /#87900/);
  assert.match(html, /#81803/);
  assert.match(html, /#72746/);
  assert.match(html, /#68929/);
  assert.match(html, /20:50/);
  assert.match(html, /catalog #94/);
  assert.match(html, /2\.1\.247/);
  assert.match(html, /somarakis/);
  assert.match(html, /1787422837/);
  assert.match(html, /Libre\+Baskerville|Libre Baskerville/);
  assert.match(html, /IBM\+Plex\+Sans|IBM Plex Sans/);
  assert.match(html, /Space\+Mono|Space Mono/);
  assert.match(html, /Score the gnomon/);
  assert.match(html, /Pin idle pointed/);
  assert.match(html, /Pin seeded collapsed/);
  assert.match(html, /admit pointed/);
  assert.match(html, /sundial/i);
  assert.match(html, /observatory/i);
  assert.match(html, /meridian/i);
  assert.match(html, /labeled observation/);
  assert.doesNotMatch(html, /Idle word:\s*collapsed/i);
  assert.doesNotMatch(html, /Idle word:\s*gnomon/i);
  assert.doesNotMatch(html, /Idle word:\s*cast/);
  assert.doesNotMatch(html, /Idle word:\s*eclipsed/);
  assert.doesNotMatch(html, /Idle word:\s*banked/);
  assert.doesNotMatch(html, /Idle word:\s*traced/);
  assert.doesNotMatch(html, /Pin idle cast/);
  assert.doesNotMatch(html, /Pin seeded eclipsed/);
  assert.doesNotMatch(html, /Score the spoil/);
  assert.doesNotMatch(html, /Pin idle banked/);
  assert.doesNotMatch(html, /Score the grooves/);
  assert.doesNotMatch(html, /family=Instrument/);
  assert.doesNotMatch(html, /family=Source\+Serif/);
  assert.doesNotMatch(html, /family=JetBrains/);
  assert.doesNotMatch(html, /family=Newsreader/);
  assert.doesNotMatch(html, /family=Sora/);
  assert.doesNotMatch(html, /family=Red\+Hat\+Mono/);
  assert.doesNotMatch(html, /family=Fraunces/);
  assert.doesNotMatch(html, /family=Source\+Sans/);
  assert.doesNotMatch(html, /family=IBM\+Plex\+Mono/);
  assert.doesNotMatch(html, /luthier cutaway/);
  assert.doesNotMatch(html, /composing-stone/);
  assert.doesNotMatch(html, /papal lead/);
  assert.doesNotMatch(html, /corrugated/);
  assert.doesNotMatch(html, /spoil tip/i);
  assert.doesNotMatch(html, /ochre heap/i);
});
