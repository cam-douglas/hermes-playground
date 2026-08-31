import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ACTIVE_TASKS_OCC3,
  ALARM_VERDICTS,
  BANNED_NAMES,
  CHIPS,
  CONTRAST_NOTE,
  COUSINS,
  EFFORT,
  FEATURED_ISSUE,
  FILED_AT,
  FILES_WRITTEN_OCC3,
  FORBIDDEN_IDLE,
  HOLD_VERDICTS,
  HUB_LINE,
  HYPOTHESIS_NOTE,
  IDLE_WORD,
  ISSUE_URL,
  LABELS,
  MARK,
  MEMORY_LIMIT_MIB,
  MEMORY_PEAK_MIB,
  MEMORY_PEAK_PCT,
  MODEL_FABLE,
  MODEL_OPUS,
  NOT_PRODUCTS,
  PHRASE,
  PLATFORM,
  PRIMARY_ISSUES,
  REPORTER,
  RESULT_COUNT_OCC3,
  SAME_CLASS,
  SDK_BAD_A,
  SDK_BAD_B,
  SDK_SEEDED,
  SEEDED_WORD,
  SILENCE_SECONDS_OCC3,
  TITLE,
  VERDICTS,
  WATCHDOG_OCC3,
  analyze,
  chipsOf,
  classify,
  decide,
  decideSeed,
  emptyTicket,
  handle,
  normalize,
  score,
  seedHung,
  seedMarvered,
  seedOpusHolds,
  seedTransferred,
} from "./parison.mjs";

function readData(name) {
  return JSON.parse(
    readFileSync(fileURLToPath(new URL(`../data/${name}`, import.meta.url)), "utf8"),
  );
}

function readPage() {
  return readFileSync(fileURLToPath(new URL("../index.html", import.meta.url)), "utf8");
}

function hookPath() {
  return fileURLToPath(new URL("./parison.mjs", import.meta.url));
}

test("idle marvered is a hold; parent received results", () => {
  const result = analyze(seedMarvered());
  assert.equal(result.verdict, "marvered");
  assert.equal(result.idleWord, "marvered");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.hung, false);
  assert.ok(result.chips.includes("marvered"));
  assert.ok(!result.chips.includes("hung"));
  assert.ok(!result.chips.includes("silent-stream"));
  assert.ok(!result.chips.includes("zero-results"));
  assert.doesNotMatch(
    result.idleWord,
    /hung|parison|glory|noria|dry|stilled|unpinned|cocked|rinsed|scrubbed|vacant|reserved|shed|clamped|sealed|torn|cauterized/i,
  );
});

test("empty ticket and empty stdin classify marvered", () => {
  assert.equal(classify(emptyTicket()), "marvered");
  assert.equal(classify(""), "marvered");
  assert.equal(classify(null), "marvered");
  assert.equal(decideSeed("marvered").verdict, "marvered");
});

test("seeded hung #91037 is alarm with the glory-hole chips", () => {
  const result = analyze(seedHung());
  assert.equal(result.verdict, "hung");
  assert.equal(result.alarm, true);
  assert.equal(result.hold, false);
  assert.ok(result.chips.includes("hung"));
  assert.ok(result.chips.includes("silent-stream"));
  assert.ok(result.chips.includes("unreconciled"));
  assert.ok(result.chips.includes("ledger-full"));
  assert.ok(result.chips.includes("zero-results"));
  assert.ok(result.chips.includes("files-written"));
  assert.ok(result.chips.includes("cost-unreported"));
  assert.ok(result.chips.includes("fable-xhigh"));
  assert.ok(result.chips.includes("sdk-wedge"));
  assert.ok(result.chips.includes("awaiting-post"));
  assert.ok(result.chips.includes("opus-holds"));
  assert.ok(!result.chips.includes("marvered"));
  assert.ok(!result.chips.includes("transferred"));
  assert.match(result.contrast.glory, /parison hangs/);
  assert.match(result.contrast.ledger, /34/);
  assert.match(result.contrast.stream, /silent/);
  assert.match(result.contrast.cost, /unreported/);
});

test("transferred is a hold", () => {
  const result = analyze(seedTransferred());
  assert.equal(result.verdict, "transferred");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.ok(result.chips.includes("transferred"));
  assert.ok(!result.chips.includes("hung"));
});

test("opus-holds is a hold contrast, not the idle word", () => {
  const result = analyze(seedOpusHolds());
  assert.equal(result.verdict, "opus-holds");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.ok(result.chips.includes("opus-holds"));
  assert.notEqual(result.idleWord, "opus-holds");
  assert.equal(result.idleWord, "marvered");
});

test("data fixtures classify marvered vs hung vs named chips", () => {
  assert.equal(classify(readData("marvered.json")), "marvered");
  assert.equal(classify(readData("hung.json")), "hung");
  assert.equal(classify(readData("91037.json")), "hung");
  assert.equal(classify(readData("transferred.json")), "transferred");
  assert.equal(classify(readData("opus-holds.json")), "opus-holds");
  assert.equal(classify(readData("silent-stream.json")), "silent-stream");
  assert.equal(classify(readData("unreconciled.json")), "unreconciled");
  assert.equal(classify(readData("ledger-full.json")), "ledger-full");
  assert.equal(classify(readData("zero-results.json")), "zero-results");
  assert.equal(classify(readData("files-written.json")), "files-written");
  assert.equal(classify(readData("cost-unreported.json")), "cost-unreported");
  assert.equal(classify(readData("fable-xhigh.json")), "fable-xhigh");
  assert.equal(classify(readData("sdk-wedge.json")), "sdk-wedge");
  assert.equal(classify(readData("awaiting-post.json")), "awaiting-post");
});

test("hung seed is alarm; marvered and transferred seeds are hold", () => {
  assert.equal(score(seedHung()).alarm, true);
  assert.equal(score(seedHung()).hold, false);
  assert.equal(score(seedMarvered()).hold, true);
  assert.equal(score(seedMarvered()).alarm, false);
  assert.equal(score(seedTransferred()).hold, true);
  assert.equal(score(seedTransferred()).alarm, false);
});

test("normalize seeds 91037 without ticket fields", () => {
  const ticket = normalize({ issue: 91037 });
  assert.equal(ticket.activeTasks, 34);
  assert.equal(ticket.resultCount, 0);
  assert.equal(ticket.awaitingPostTaskResult, true);
  assert.equal(ticket.filesWritten, 256);
  assert.equal(ticket.eventStream, "silent");
  assert.equal(ticket.sdkVersion, "0.3.251");
  assert.equal(classify(ticket), "hung");
});

test("score / decide / handle agree on hung vs marvered", () => {
  assert.equal(score(seedHung()).verdict, "hung");
  assert.equal(decide(seedMarvered()).verdict, "marvered");
  const fail = handle(seedHung());
  const hold = handle(seedMarvered());
  const moved = handle(seedTransferred());
  assert.match(fail.hookSpecificOutput.additionalContext, /#91037/);
  assert.match(hold.hookSpecificOutput.additionalContext, /marvered/i);
  assert.match(moved.hookSpecificOutput.additionalContext, /transferred|punty/i);
});

test("decideSeed aliases", () => {
  assert.equal(decideSeed("hung").verdict, "hung");
  assert.equal(decideSeed(91037).verdict, "hung");
  assert.equal(decideSeed("91037").verdict, "hung");
  assert.equal(decideSeed("marvered").verdict, "marvered");
  assert.equal(decideSeed("transferred").verdict, "transferred");
  assert.equal(decideSeed("opus-holds").verdict, "opus-holds");
  assert.equal(decideSeed("claude-opus-5").verdict, "opus-holds");
});

test("CLI scores data files", () => {
  const hung = spawnSync(
    process.execPath,
    [hookPath(), fileURLToPath(new URL("../data/hung.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(hung.status, 0, hung.stderr);
  assert.equal(JSON.parse(hung.stdout).verdict, "hung");
  assert.equal(JSON.parse(hung.stdout).alarm, true);

  const marvered = spawnSync(
    process.execPath,
    [hookPath(), fileURLToPath(new URL("../data/marvered.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(marvered.status, 0, marvered.stderr);
  assert.equal(JSON.parse(marvered.stdout).verdict, "marvered");
  assert.equal(JSON.parse(marvered.stdout).hold, true);

  const moved = spawnSync(
    process.execPath,
    [hookPath(), fileURLToPath(new URL("../data/transferred.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(moved.status, 0, moved.stderr);
  assert.equal(JSON.parse(moved.stdout).verdict, "transferred");
  assert.equal(JSON.parse(moved.stdout).hold, true);
});

test("constants match the issue facts only", () => {
  assert.equal(FEATURED_ISSUE, 91037);
  assert.deepEqual([...PRIMARY_ISSUES], [91037]);
  assert.deepEqual([...SAME_CLASS], [47936, 59962, 37521, 61547, 28482]);
  assert.deepEqual([...COUSINS], [47936, 59962, 37521, 61547, 28482]);
  assert.equal(FILED_AT, "2026-08-31T17:08:37Z");
  assert.equal(SDK_BAD_A, "0.3.197");
  assert.equal(SDK_BAD_B, "0.3.251");
  assert.equal(SDK_SEEDED, "0.3.251");
  assert.equal(MODEL_FABLE, "claude-fable-5");
  assert.equal(MODEL_OPUS, "claude-opus-5");
  assert.equal(EFFORT, "xhigh");
  assert.equal(PLATFORM, "linux");
  assert.equal(REPORTER, "fjnoyp");
  assert.equal(ACTIVE_TASKS_OCC3, 34);
  assert.equal(RESULT_COUNT_OCC3, 0);
  assert.equal(FILES_WRITTEN_OCC3, 256);
  assert.equal(SILENCE_SECONDS_OCC3, 900);
  assert.equal(MEMORY_LIMIT_MIB, 1024);
  assert.equal(MEMORY_PEAK_MIB, 358);
  assert.equal(MEMORY_PEAK_PCT, 35);
  assert.match(WATCHDOG_OCC3, /active_tasks=34/);
  assert.equal(IDLE_WORD, "marvered");
  assert.equal(SEEDED_WORD, "hung");
  assert.notEqual(IDLE_WORD, "hung");
  assert.notEqual(IDLE_WORD, "parison");
  assert.notEqual(IDLE_WORD, "glory");
  assert.deepEqual([...HOLD_VERDICTS], ["marvered", "transferred", "opus-holds"]);
  assert.ok(ALARM_VERDICTS.includes("hung"));
  assert.ok(ALARM_VERDICTS.includes("silent-stream"));
  assert.ok(!ALARM_VERDICTS.includes("marvered"));
  assert.ok(!ALARM_VERDICTS.includes("transferred"));
  assert.deepEqual([...VERDICTS], [...CHIPS]);
  assert.equal(VERDICTS.length, 13);
  assert.deepEqual(
    [...LABELS],
    ["bug", "has repro", "platform:linux", "area:agents", "area:agent-sdk"],
  );
  assert.match(TITLE, /parent session permanently wedges/);
  assert.match(ISSUE_URL, /91037/);
  assert.match(PHRASE, /parison hung in the glory hole/i);
  assert.match(HUB_LINE, /03:50 parison/);
  assert.match(HUB_LINE, /admit marvered/);
  assert.match(MARK, /03:50/);
  assert.match(MARK, /#101/);
  assert.match(MARK, /#91037/);
  assert.match(CONTRAST_NOTE, /PARENT-SIDE RESULT RECONCILIATION/);
  assert.match(HYPOTHESIS_NOTE, /NON-BINDING/);
  assert.ok(NOT_PRODUCTS.includes("cockade"));
  assert.ok(NOT_PRODUCTS.includes("lye"));
  assert.ok(NOT_PRODUCTS.includes("leat"));
  assert.ok(NOT_PRODUCTS.includes("noria"));
  assert.ok(NOT_PRODUCTS.includes("suture"));
  assert.ok(NOT_PRODUCTS.includes("limpet"));
  assert.ok(BANNED_NAMES.includes("Noria"));
  assert.ok(BANNED_NAMES.includes("Millrace"));
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(IDLE_WORD, word);
  }
});

test("chips.json and fingerprints stay aligned", () => {
  const chips = readData("chips.json");
  assert.deepEqual(chips.verdicts, [...VERDICTS]);
  assert.equal(chips.idleWord, "marvered");
  assert.equal(chips.seededWord, "hung");
  const fp = readData("fingerprints.json");
  assert.equal(fp.primary, 91037);
  assert.equal(fp.sdkSeeded, "0.3.251");
  assert.equal(fp.activeTasks, 34);
  assert.equal(fp.resultCount, 0);
  assert.equal(fp.filesWritten, 256);
  assert.equal(fp.silenceSeconds, 900);
  assert.equal(fp.model, "claude-fable-5");
  assert.deepEqual(fp.sameClass, [47936, 59962, 37521, 61547, 28482]);
  const fixtures = readData("fixtures.json");
  assert.equal(fixtures.rows.length, 5);
  assert.equal(fixtures.rows[0].verdict, "hung");
  assert.equal(fixtures.narrativeNotFixture.noSessionIds, true);
  assert.equal(fixtures.narrativeNotFixture.activeTasks, 34);
});

test("chipsOf on a raw hung ticket still marks ledger-full and files-written", () => {
  const chips = chipsOf({
    activeTasks: 34,
    resultCount: 0,
    awaitingPostTaskResult: true,
    filesWritten: 256,
    eventStream: "silent",
    costReported: false,
    terminalResult: false,
    parentReconciled: false,
    model: "claude-fable-5",
    effort: "xhigh",
    sdkVersion: "0.3.251",
    ledgerSettled: false,
    outputText:
      "34 tasks active, 0 results; 256+ files; event stream stops; awaiting_post_task_result=true; total_cost_usd is never reported; claude-fable-5 xhigh; Agent SDK 0.3.251; hung",
  });
  assert.ok(chips.includes("hung"));
  assert.ok(chips.includes("silent-stream"));
  assert.ok(chips.includes("ledger-full"));
  assert.ok(chips.includes("zero-results"));
  assert.ok(chips.includes("files-written"));
  assert.ok(chips.includes("awaiting-post"));
  assert.ok(!chips.includes("marvered"));
});

test("named silent-stream is not a full hung gather", () => {
  const result = analyze({
    seed: "silent-stream",
    eventStream: "silent",
    containerHealthy: true,
    resultCount: 0,
    outputText: "silent-stream: SDK event stream stops entirely; container stays healthy",
  });
  assert.notEqual(result.verdict, "hung");
  assert.equal(result.verdict, "silent-stream");
  assert.ok(result.reasons.some((row) => /stream/i.test(row)));
});

test("ledger full + files + silent stream → hung; settled live stream → marvered", () => {
  assert.equal(
    classify({
      activeTasks: 34,
      resultCount: 0,
      awaitingPostTaskResult: true,
      filesWritten: 256,
      eventStream: "silent",
      costReported: false,
      parentReconciled: false,
      ledgerSettled: false,
      model: "claude-fable-5",
      effort: "xhigh",
      outputText: "34 tasks active, 0 results; 256+ files; event stream stops; hung gather",
    }),
    "hung",
  );
  assert.equal(
    classify({
      activeTasks: 0,
      resultCount: 256,
      awaitingPostTaskResult: false,
      filesWritten: 256,
      eventStream: "live",
      costReported: true,
      terminalResult: true,
      ledgerSettled: true,
      parentReconciled: true,
      outputText: "marvered gather; parent received results; stream live; cost reported; ledger settled",
    }),
    "marvered",
  );
});

test("living page is a glasshouse glory-hole shop, idle marvered, seeded hung", () => {
  const html = readPage();
  assert.match(html, /Idle word:\s*marvered/);
  assert.match(html, /marvered/);
  assert.match(html, /hung/);
  assert.match(html, /silent-stream/);
  assert.match(html, /unreconciled/);
  assert.match(html, /ledger-full/);
  assert.match(html, /zero-results/);
  assert.match(html, /files-written/);
  assert.match(html, /cost-unreported/);
  assert.match(html, /fable-xhigh/);
  assert.match(html, /sdk-wedge/);
  assert.match(html, /awaiting-post/);
  assert.match(html, /transferred/);
  assert.match(html, /opus-holds/);
  assert.match(html, /#91037/);
  assert.match(html, /#47936/);
  assert.match(html, /#59962/);
  assert.match(html, /03:50/);
  assert.match(html, /catalog #101/);
  assert.match(html, /0\.3\.251/);
  assert.match(html, /0\.3\.197/);
  assert.match(html, /claude-fable-5|Fable-5|Fable 5/);
  assert.match(html, /256\+/);
  assert.match(html, /active_tasks=34|34 active/);
  assert.match(html, /EB\+Garamond|EB Garamond/);
  assert.match(html, /Mulish/);
  assert.match(html, /IBM\+Plex\+Mono|IBM Plex Mono/);
  assert.match(html, /Score the gather/);
  assert.match(html, /Pin idle marvered/);
  assert.match(html, /Pin seeded hung/);
  assert.match(html, /Admit marvered/);
  assert.match(html, /Load fixtures/);
  assert.match(html, /Reset to marvered/);
  assert.match(html, /glory hole/i);
  assert.match(html, /parison/i);
  assert.match(html, /marver/i);
  assert.match(html, /gaffer/i);
  assert.match(html, /punty/i);
  assert.match(html, /blowpipe/i);
  assert.doesNotMatch(html, /Idle word:\s*hung/i);
  assert.doesNotMatch(html, /Idle word:\s*parison/i);
  assert.doesNotMatch(html, /Idle word:\s*glory/i);
  assert.doesNotMatch(html, /Idle word:\s*noria/i);
  assert.doesNotMatch(html, /Idle word:\s*dry/i);
  assert.doesNotMatch(html, /Idle word:\s*unpinned/);
  assert.doesNotMatch(html, /Idle word:\s*cocked/);
  assert.doesNotMatch(html, /Idle word:\s*rinsed/);
  assert.doesNotMatch(html, /Pin idle unpinned/);
  assert.doesNotMatch(html, /Pin idle rinsed/);
  assert.doesNotMatch(html, /Pin seeded cocked/);
  assert.doesNotMatch(html, /Score the brim/);
  assert.doesNotMatch(html, /Score the vat/);
  assert.doesNotMatch(html, /family=Playfair/);
  assert.doesNotMatch(html, /family=Nunito/);
  assert.doesNotMatch(html, /family=Libre\+Baskerville/);
  assert.doesNotMatch(html, /family=Source\+Sans/);
  assert.doesNotMatch(html, /family=Cinzel/);
  assert.doesNotMatch(html, /family=Outfit/);
  assert.doesNotMatch(html, /family=Cormorant/);
  assert.doesNotMatch(html, /hat-block/);
  assert.doesNotMatch(html, /silk cockade/);
  assert.doesNotMatch(html, /lye vat/);
  assert.doesNotMatch(html, /mill wheel/);
  assert.doesNotMatch(html, /noria pot/);
  assert.doesNotMatch(html, /diocesan/);
  assert.doesNotMatch(html, /mill-race/);
  assert.doesNotMatch(html, /millrace/);
  assert.doesNotMatch(html, /family=Fraunces/);
  assert.doesNotMatch(html, /woodworking/);
  assert.doesNotMatch(html, /millimeter/);
});
