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
  seedCast,
  seedEclipsed,
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

test("idle cast is a hold; shadow matches last event", () => {
  const result = analyze(seedCast());
  assert.equal(result.verdict, "cast");
  assert.equal(result.idleWord, "cast");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.eclipsed, false);
  assert.ok(result.chips.includes("cast"));
  assert.ok(!result.chips.includes("eclipsed"));
  assert.ok(!result.chips.includes("shared-mtime"));
  assert.doesNotMatch(
    result.idleWord,
    /gnomon|eclipsed|mtime|transcript|bulk|rewrite|shared|spoiled|banked|trammel|hunting|traced|soundpost|flong|bulla/i,
  );
});

test("empty ticket and empty stdin classify cast", () => {
  assert.equal(classify(emptyTicket()), "cast");
  assert.equal(classify(""), "cast");
  assert.equal(classify(null), "cast");
  assert.equal(decideSeed("cast").verdict, "cast");
});

test("seeded eclipsed #90954 is alarm with the shared-mtime chips", () => {
  const result = analyze(seedEclipsed());
  assert.equal(result.verdict, "eclipsed");
  assert.equal(result.alarm, true);
  assert.equal(result.hold, false);
  assert.ok(result.chips.includes("eclipsed"));
  assert.ok(result.chips.includes("shared-mtime"));
  assert.ok(result.chips.includes("bulk-rewrite"));
  assert.ok(result.chips.includes("timestamp-free"));
  assert.ok(result.chips.includes("last-prompt"));
  assert.ok(result.chips.includes("mode-tail"));
  assert.ok(result.chips.includes("closed-transcript"));
  assert.ok(result.chips.includes("date-skew"));
  assert.ok(result.chips.includes("silent-wrong"));
  assert.ok(result.chips.includes("retention-trap"));
  assert.ok(result.chips.includes("ls-lt-lie"));
  assert.ok(!result.chips.includes("cast"));
  assert.match(result.contrast.dial, /114 files/);
  assert.match(result.contrast.shadow, /median 17 days/);
  assert.match(result.contrast.meridian, /no timestamp/);
  assert.match(result.contrast.note, /labeled observation/);
});

test("data fixtures classify cast vs eclipsed vs named chips", () => {
  assert.equal(classify(readData("cast.json")), "cast");
  assert.equal(classify(readData("eclipsed.json")), "eclipsed");
  assert.equal(classify(readData("90954.json")), "eclipsed");
  assert.equal(classify(readData("shared-mtime.json")), "shared-mtime");
  assert.equal(classify(readData("bulk-rewrite.json")), "bulk-rewrite");
  assert.equal(classify(readData("timestamp-free.json")), "timestamp-free");
  assert.equal(classify(readData("last-prompt.json")), "last-prompt");
  assert.equal(classify(readData("mode-tail.json")), "mode-tail");
  assert.equal(classify(readData("closed-transcript.json")), "closed-transcript");
  assert.equal(classify(readData("date-skew.json")), "date-skew");
  assert.equal(classify(readData("silent-wrong.json")), "silent-wrong");
  assert.equal(classify(readData("retention-trap.json")), "retention-trap");
  assert.equal(classify(readData("ls-lt-lie.json")), "ls-lt-lie");
});

test("eclipsed seed is alarm; cast seed is hold", () => {
  assert.equal(score(seedEclipsed()).alarm, true);
  assert.equal(score(seedEclipsed()).hold, false);
  assert.equal(score(seedCast()).hold, true);
  assert.equal(score(seedCast()).alarm, false);
});

test("normalize seeds 90954 without ticket fields", () => {
  const ticket = normalize({ issue: 90954 });
  assert.equal(ticket.sharedMtime, true);
  assert.equal(ticket.timestampFreeTail, true);
  assert.equal(ticket.closedTranscript, true);
  assert.equal(ticket.dateSkew, true);
  assert.equal(ticket.lastPromptTail, true);
  assert.equal(classify(ticket), "eclipsed");
});

test("score / decide / handle agree on eclipsed vs cast", () => {
  assert.equal(score(seedEclipsed()).verdict, "eclipsed");
  assert.equal(decide(seedCast()).verdict, "cast");
  const fail = handle(seedEclipsed());
  const hold = handle(seedCast());
  assert.match(fail.hookSpecificOutput.additionalContext, /#90954/);
  assert.match(hold.hookSpecificOutput.additionalContext, /cast/i);
});

test("decideSeed aliases", () => {
  assert.equal(decideSeed("eclipsed").verdict, "eclipsed");
  assert.equal(decideSeed(90954).verdict, "eclipsed");
  assert.equal(decideSeed("90954").verdict, "eclipsed");
  assert.equal(decideSeed("cast").verdict, "cast");
});

test("CLI scores data files", () => {
  const eclipsed = spawnSync(
    process.execPath,
    [hookPath(), fileURLToPath(new URL("../data/eclipsed.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(eclipsed.status, 0, eclipsed.stderr);
  assert.equal(JSON.parse(eclipsed.stdout).verdict, "eclipsed");

  const cast = spawnSync(
    process.execPath,
    [hookPath(), fileURLToPath(new URL("../data/cast.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(cast.status, 0, cast.stderr);
  assert.equal(JSON.parse(cast.stdout).verdict, "cast");
});

test("constants match the issue facts only", () => {
  assert.equal(FEATURED_ISSUE, 90954);
  assert.deepEqual([...PRIMARY_ISSUES], [90954]);
  assert.deepEqual([...SAME_CLASS], [90932, 90931, 90955]);
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
  assert.equal(TAIL_COUNTS.attachment, 10);
  assert.equal(TAIL_COUNTS["queue-operation"], 4);
  assert.equal(TAIL_COUNTS.user, 2);
  assert.equal(TAIL_COUNTS.assistant, 1);
  assert.equal(EXAMPLES[0].lastEvent, "2026-07-22T14:00:18Z");
  assert.equal(EXAMPLES[1].lastEvent, "2026-08-04T10:19:24Z");
  assert.equal(IDLE_WORD, "cast");
  assert.equal(SEEDED_WORD, "eclipsed");
  assert.notEqual(IDLE_WORD, "eclipsed");
  assert.notEqual(IDLE_WORD, "gnomon");
  assert.deepEqual([...HOLD_VERDICTS], ["cast"]);
  assert.ok(ALARM_VERDICTS.includes("eclipsed"));
  assert.ok(!ALARM_VERDICTS.includes("cast"));
  assert.deepEqual([...VERDICTS], [...CHIPS]);
  assert.equal(VERDICTS.length, 12);
  assert.deepEqual(
    [...LABELS],
    ["bug", "has repro", "platform:macos", "area:core"],
  );
  assert.match(TITLE, /shared mtime, destroying file-date signal/);
  assert.match(ISSUE_URL, /90954/);
  assert.match(PHRASE, /shared mtime is not a hold/i);
  assert.match(HUB_LINE, /20:50 gnomon/);
  assert.match(MARK, /20:50/);
  assert.match(MARK, /#94/);
  assert.match(MARK, /#90954/);
  assert.match(CONTRAST_NOTE, /preserve mtime/);
  assert.match(HYPOTHESIS_NOTE, /labeled observation, not a proven cause/);
  assert.ok(NOT_PRODUCTS.includes("spoil"));
  assert.ok(NOT_PRODUCTS.includes("trammel"));
  assert.ok(NOT_PRODUCTS.includes("soundpost"));
  assert.ok(NOT_PRODUCTS.includes("clepsydra"));
  assert.ok(NOT_PRODUCTS.includes("palimpsest"));
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(IDLE_WORD, word);
  }
});

test("chips.json and fingerprints stay aligned", () => {
  const chips = readData("chips.json");
  assert.deepEqual(chips.verdicts, [...VERDICTS]);
  assert.equal(chips.idleWord, "cast");
  const fp = readData("fingerprints.json");
  assert.equal(fp.primary, 90954);
  assert.equal(fp.ccd, "2.1.247");
  assert.equal(fp.clusterEpoch, 1787422837);
  assert.equal(fp.clusterCount, 114);
  assert.deepEqual(fp.sameClass, [90932, 90931, 90955]);
  const contrast = readData("contrast.json");
  assert.match(contrast.preserveMtime.result, /preserve/);
  assert.match(contrast.timestampRequired.result, /timestamp/);
  assert.equal(contrast.sameClass.rewindContinue, 90932);
  assert.equal(contrast.sameClass.symlinkEnotdir, 90931);
  assert.equal(contrast.sameClass.versionSkew, 90955);
});

test("chipsOf on a raw eclipsed ticket still marks date-skew", () => {
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
  });
  assert.ok(chips.includes("eclipsed"));
  assert.ok(chips.includes("date-skew"));
  assert.ok(chips.includes("timestamp-free"));
  assert.ok(!chips.includes("cast"));
});

test("preserve-mtime contrast does not eclipse", () => {
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
  assert.notEqual(result.verdict, "eclipsed");
  assert.ok(result.reasons.some((row) => /preserve mtime/i.test(row)));
});

test("living page is an observatory sundial terrace, idle cast, seeded eclipsed", () => {
  const html = readPage();
  assert.match(html, /Idle word:\s*cast/);
  assert.match(html, /cast/);
  assert.match(html, /eclipsed/);
  assert.match(html, /shared-mtime/);
  assert.match(html, /bulk-rewrite/);
  assert.match(html, /timestamp-free/);
  assert.match(html, /last-prompt/);
  assert.match(html, /mode-tail/);
  assert.match(html, /closed-transcript/);
  assert.match(html, /date-skew/);
  assert.match(html, /silent-wrong/);
  assert.match(html, /retention-trap/);
  assert.match(html, /ls-lt-lie/);
  assert.match(html, /#90954/);
  assert.match(html, /#90932/);
  assert.match(html, /#90931/);
  assert.match(html, /#90955/);
  assert.match(html, /20:50/);
  assert.match(html, /catalog #94/);
  assert.match(html, /2\.1\.247/);
  assert.match(html, /somarakis/);
  assert.match(html, /1787422837/);
  assert.match(html, /Libre\+Baskerville|Libre Baskerville/);
  assert.match(html, /IBM\+Plex\+Sans|IBM Plex Sans/);
  assert.match(html, /Space\+Mono|Space Mono/);
  assert.match(html, /Score the gnomon/);
  assert.match(html, /Pin idle cast/);
  assert.match(html, /Pin seeded eclipsed/);
  assert.match(html, /sundial/i);
  assert.match(html, /observatory/i);
  assert.match(html, /meridian/i);
  assert.match(html, /labeled observation/);
  assert.doesNotMatch(html, /Idle word:\s*eclipsed/i);
  assert.doesNotMatch(html, /Idle word:\s*gnomon/i);
  assert.doesNotMatch(html, /Idle word:\s*banked/);
  assert.doesNotMatch(html, /Idle word:\s*traced/);
  assert.doesNotMatch(html, /Idle word:\s*coupled/);
  assert.doesNotMatch(html, /Score the spoil/);
  assert.doesNotMatch(html, /Pin idle banked/);
  assert.doesNotMatch(html, /Score the grooves/);
  assert.doesNotMatch(html, /Pin idle traced/);
  assert.doesNotMatch(html, /Score the plates/);
  assert.doesNotMatch(html, /family=Instrument/);
  assert.doesNotMatch(html, /family=Source\+Serif/);
  assert.doesNotMatch(html, /family=JetBrains/);
  assert.doesNotMatch(html, /family=Newsreader/);
  assert.doesNotMatch(html, /family=Sora/);
  assert.doesNotMatch(html, /family=Red\+Hat\+Mono/);
  assert.doesNotMatch(html, /family=Fraunces/);
  assert.doesNotMatch(html, /family=Source\+Sans/);
  assert.doesNotMatch(html, /family=IBM\+Plex\+Mono/);
  assert.doesNotMatch(html, /family=Barlow/);
  assert.doesNotMatch(html, /family=Spline/);
  assert.doesNotMatch(html, /family=Cormorant/);
  assert.doesNotMatch(html, /family=Playfair/);
  assert.doesNotMatch(html, /family=Cinzel/);
  assert.doesNotMatch(html, /luthier cutaway/);
  assert.doesNotMatch(html, /composing-stone/);
  assert.doesNotMatch(html, /papal lead/);
  assert.doesNotMatch(html, /hide-glue/);
  assert.doesNotMatch(html, /mahogany/);
  assert.doesNotMatch(html, /Prussian/);
  assert.doesNotMatch(html, /corrugated/);
  assert.doesNotMatch(html, /spoil tip/i);
  assert.doesNotMatch(html, /ochre heap/i);
});
