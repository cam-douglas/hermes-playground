import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ALARM_VERDICTS,
  ANSI_CP,
  ARMED_DAYS,
  BOM,
  CHIPS,
  CONTRAST_NOTE,
  FEATURED_ISSUE,
  FILED_AT,
  FORBIDDEN_IDLE,
  HOLD_VERDICTS,
  HUB_LINE,
  HYPOTHESIS_NOTE,
  IDLE_WORD,
  ISSUE_URL,
  LABELS,
  MARK,
  MISSING_DQ,
  MISSING_SQ,
  NOT_PRODUCTS,
  OPPOSITE_BOM_ISSUE,
  OS_NAME,
  PHRASE,
  POWERSHELL,
  PRIMARY_ISSUES,
  REPORTER,
  SAME_CLASS,
  SCHEDULER_RESULT,
  SEEDED_WORD,
  TABLE_EXPECT,
  TITLE,
  TREE_NON_ASCII,
  TREE_PS1,
  VERDICTS,
  analyze,
  assay,
  assayFixture,
  assayTable,
  buildFixture,
  chipsOf,
  classify,
  decide,
  decideSeed,
  decodeFile,
  emptyTicket,
  firstBytes,
  handle,
  normalize,
  score,
  seedHallmarked,
  seedMisstruck,
  startsWithBom,
} from "./puncheon.mjs";

function readData(name) {
  return JSON.parse(
    readFileSync(fileURLToPath(new URL(`../data/${name}`, import.meta.url)), "utf8"),
  );
}

function readPage() {
  return readFileSync(fileURLToPath(new URL("../index.html", import.meta.url)), "utf8");
}

function hookPath() {
  return fileURLToPath(new URL("./puncheon.mjs", import.meta.url));
}

test("assay table matches the measured PS 5.1 tokenizer exactly", () => {
  const rows = assayTable();
  assert.equal(rows.length, 12);
  for (const expected of TABLE_EXPECT) {
    const row = rows.find((item) => item.id === expected.id);
    assert.ok(row, `missing fixture ${expected.id}`);
    assert.equal(row.result.grade, expected.grade, `fixture ${expected.id} grade`);
    if (expected.parseError) {
      assert.equal(row.result.parseError, expected.parseError, `fixture ${expected.id} parseError`);
    }
    if (expected.parseErrors != null) {
      assert.equal(
        row.result.parseErrors,
        expected.parseErrors,
        `fixture ${expected.id} parseErrors`,
      );
    }
  }

  const one = assayFixture(1);
  assert.equal(one.grade, "BROKEN");
  assert.equal(one.parseError, MISSING_DQ);
  assert.equal(one.parseErrors, 1);
  assert.equal(startsWithBom(buildFixture(1)), false);
  assert.deepEqual(firstBytes(buildFixture(1), 3), [0x57, 0x72, 0x69]);
  assert.notDeepEqual(firstBytes(buildFixture(1), 3), [...BOM]);

  const two = assayFixture(2);
  assert.equal(two.grade, "OK");
  assert.equal(two.parseErrors, 0);
  assert.equal(startsWithBom(buildFixture(2)), true);
  assert.deepEqual(firstBytes(buildFixture(2), 3), [...BOM]);

  const three = assayFixture(3);
  assert.equal(three.grade, "BROKEN");
  assert.equal(three.parseError, MISSING_DQ);

  const four = assayFixture(4);
  assert.equal(four.grade, "BROKEN");
  assert.equal(four.parseError, MISSING_SQ);

  const five = assayFixture(5);
  assert.equal(five.grade, "RISK");
  assert.equal(five.parseErrors, 0);

  const six = assayFixture(6);
  assert.equal(six.grade, "RISK");
  assert.equal(six.parseErrors, 0);

  const seven = assayFixture(7);
  assert.equal(seven.grade, "RISK");
  assert.equal(seven.parseErrors, 0);

  const eight = assayFixture(8);
  assert.equal(eight.grade, "RISK");
  assert.equal(eight.parseErrors, 0);

  const nine = assayFixture(9);
  assert.equal(nine.grade, "OK");
  assert.equal(nine.parseErrors, 0);

  const ten = assayFixture(10);
  assert.equal(ten.grade, "SKIPPED");
  assert.equal(ten.oppositeBom, true);
  assert.equal(startsWithBom(buildFixture(10)), true);

  const eleven = assayFixture(11);
  assert.equal(eleven.grade, "REGISTERED");
  assert.equal(startsWithBom(buildFixture(11)), false);
  assert.ok(decodeFile(buildFixture(11)).text.startsWith("---"));

  const twelve = assayFixture(12);
  assert.equal(twelve.grade, "silent-schedule");
  assert.equal(twelve.result, SCHEDULER_RESULT);
  assert.equal(twelve.logExists, false);
  assert.equal(twelve.history, "completed");
  assert.equal(twelve.parseError, MISSING_DQ);
});

test("fixture 1 is honest UTF-8 no BOM with E2 80 94 inside", () => {
  const buf = buildFixture(1);
  assert.equal(buf[0], 0x57);
  assert.ok(!startsWithBom(buf));
  const idx = buf.indexOf(0xe2);
  assert.ok(idx >= 0);
  assert.equal(buf[idx], 0xe2);
  assert.equal(buf[idx + 1], 0x80);
  assert.equal(buf[idx + 2], 0x94);
  const decoded = decodeFile(buf);
  assert.equal(decoded.encoding, "cp1252");
  assert.ok(decoded.text.includes("\u201d"));
});

test("idle hallmarked is a hold; punches sit", () => {
  const result = analyze(seedHallmarked());
  assert.equal(result.verdict, "hallmarked");
  assert.equal(result.idleWord, "hallmarked");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.misstruck, false);
  assert.ok(result.chips.includes("hallmarked"));
  assert.ok(!result.chips.includes("misstruck"));
  assert.doesNotMatch(
    result.idleWord,
    /puncheon|misstruck|bom|utf|quote|powershell|gnomon|pointed|collapsed|spoiled|banked|traced|struck|torn/i,
  );
});

test("empty ticket and empty stdin classify hallmarked", () => {
  assert.equal(classify(emptyTicket()), "hallmarked");
  assert.equal(classify(""), "hallmarked");
  assert.equal(classify(null), "hallmarked");
  assert.equal(decideSeed("hallmarked").verdict, "hallmarked");
});

test("seeded misstruck #90962 is alarm with the puncheon chips", () => {
  const result = analyze(seedMisstruck());
  assert.equal(result.verdict, "misstruck");
  assert.equal(result.alarm, true);
  assert.equal(result.hold, false);
  assert.ok(result.chips.includes("misstruck"));
  assert.ok(result.chips.includes("no-bom"));
  assert.ok(result.chips.includes("mojibake-quote"));
  assert.ok(result.chips.includes("em-dash"));
  assert.ok(result.chips.includes("cp1252"));
  assert.ok(result.chips.includes("parser-error"));
  assert.ok(result.chips.includes("silent-schedule"));
  assert.ok(result.chips.includes("0x80070001"));
  assert.ok(result.chips.includes("per-extension"));
  assert.ok(result.chips.includes("ps51-ansi"));
  assert.ok(result.chips.includes("string-terminator"));
  assert.ok(result.chips.includes("task-success"));
  assert.ok(!result.chips.includes("hallmarked"));
  assert.match(result.contrast.punch, /quote/);
  assert.match(result.contrast.assay, /0x94/);
  assert.match(result.contrast.schedule, /0x80070001/);
});

test("data fixtures classify hallmarked vs misstruck vs named chips", () => {
  assert.equal(classify(readData("hallmarked.json")), "hallmarked");
  assert.equal(classify(readData("misstruck.json")), "misstruck");
  assert.equal(classify(readData("90962.json")), "misstruck");
  assert.equal(classify(readData("no-bom.json")), "no-bom");
  assert.equal(classify(readData("mojibake-quote.json")), "mojibake-quote");
  assert.equal(classify(readData("em-dash.json")), "em-dash");
  assert.equal(classify(readData("cp1252.json")), "cp1252");
  assert.equal(classify(readData("parser-error.json")), "parser-error");
  assert.equal(classify(readData("silent-schedule.json")), "silent-schedule");
  assert.equal(classify(readData("0x80070001.json")), "0x80070001");
  assert.equal(classify(readData("per-extension.json")), "per-extension");
  assert.equal(classify(readData("opposite-bom.json")), "opposite-bom");
  assert.equal(classify(readData("ps51-ansi.json")), "ps51-ansi");
  assert.equal(classify(readData("string-terminator.json")), "string-terminator");
  assert.equal(classify(readData("task-success.json")), "task-success");
});

test("normalize seeds 90962 without ticket fields", () => {
  const ticket = normalize({ issue: 90962 });
  assert.equal(ticket.bom, false);
  assert.equal(ticket.noBom, true);
  assert.equal(ticket.emDash, true);
  assert.equal(ticket.parseError, true);
  assert.equal(ticket.scheduled, true);
  assert.equal(classify(ticket), "misstruck");
});

test("score / decide / handle agree on misstruck vs hallmarked", () => {
  assert.equal(score(seedMisstruck()).verdict, "misstruck");
  assert.equal(decide(seedHallmarked()).verdict, "hallmarked");
  const fail = handle(seedMisstruck());
  const hold = handle(seedHallmarked());
  assert.match(fail.hookSpecificOutput.additionalContext, /#90962/);
  assert.match(hold.hookSpecificOutput.additionalContext, /hallmarked/i);
});

test("decideSeed aliases", () => {
  assert.equal(decideSeed("misstruck").verdict, "misstruck");
  assert.equal(decideSeed(90962).verdict, "misstruck");
  assert.equal(decideSeed("90962").verdict, "misstruck");
  assert.equal(decideSeed("hallmarked").verdict, "hallmarked");
});

test("CLI scores data files and the assay table", () => {
  const misstruck = spawnSync(
    process.execPath,
    [hookPath(), fileURLToPath(new URL("../data/misstruck.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(misstruck.status, 0, misstruck.stderr);
  assert.equal(JSON.parse(misstruck.stdout).verdict, "misstruck");

  const hallmarked = spawnSync(
    process.execPath,
    [hookPath(), fileURLToPath(new URL("../data/hallmarked.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(hallmarked.status, 0, hallmarked.stderr);
  assert.equal(JSON.parse(hallmarked.stdout).verdict, "hallmarked");

  const table = spawnSync(process.execPath, [hookPath(), "--table"], {
    encoding: "utf8",
  });
  assert.equal(table.status, 0, table.stderr);
  const rows = JSON.parse(table.stdout);
  assert.equal(rows[0].grade, "BROKEN");
  assert.equal(rows[1].grade, "OK");
  assert.equal(rows[9].grade, "SKIPPED");
  assert.equal(rows[11].grade, "silent-schedule");
});

test("constants match the issue facts only", () => {
  assert.equal(FEATURED_ISSUE, 90962);
  assert.deepEqual([...PRIMARY_ISSUES], [90962]);
  assert.ok(SAME_CLASS.includes(73158));
  assert.ok(SAME_CLASS.includes(58545));
  assert.ok(SAME_CLASS.includes(28316));
  assert.equal(OPPOSITE_BOM_ISSUE, 73158);
  assert.equal(REPORTER, "tonydzi");
  assert.equal(FILED_AT, "2026-08-31T11:01:52Z");
  assert.equal(OS_NAME, "Windows 11 Pro 10.0.26200");
  assert.equal(POWERSHELL, "5.1.22621.6133");
  assert.equal(ANSI_CP, 1252);
  assert.equal(TREE_NON_ASCII, 16);
  assert.equal(TREE_PS1, 67);
  assert.equal(ARMED_DAYS, 4);
  assert.equal(SCHEDULER_RESULT, "0x80070001");
  assert.equal(IDLE_WORD, "hallmarked");
  assert.equal(SEEDED_WORD, "misstruck");
  assert.notEqual(IDLE_WORD, "misstruck");
  assert.notEqual(IDLE_WORD, "puncheon");
  assert.deepEqual([...HOLD_VERDICTS], ["hallmarked"]);
  assert.ok(ALARM_VERDICTS.includes("misstruck"));
  assert.ok(!ALARM_VERDICTS.includes("hallmarked"));
  assert.deepEqual([...VERDICTS], [...CHIPS]);
  assert.equal(VERDICTS.length, 14);
  assert.deepEqual(
    [...LABELS],
    ["bug", "has-repro", "platform:windows", "area:tools"],
  );
  assert.match(TITLE, /without a BOM/);
  assert.match(ISSUE_URL, /90962/);
  assert.match(PHRASE, /unstruck mark is not a hold/i);
  assert.match(HUB_LINE, /21:50 puncheon/);
  assert.match(HUB_LINE, /admit hallmarked/);
  assert.match(MARK, /21:50/);
  assert.match(MARK, /#95/);
  assert.match(MARK, /#90962/);
  assert.match(CONTRAST_NOTE, /per-extension/);
  assert.match(HYPOTHESIS_NOTE, /em-dash strike comes out a quotation mark/);
  assert.ok(NOT_PRODUCTS.includes("gnomon"));
  assert.ok(NOT_PRODUCTS.includes("spoil"));
  assert.ok(NOT_PRODUCTS.includes("trammel"));
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(IDLE_WORD, word);
  }
});

test("chips.json and fingerprints stay aligned", () => {
  const chips = readData("chips.json");
  assert.deepEqual(chips.verdicts, [...VERDICTS]);
  assert.equal(chips.idleWord, "hallmarked");
  assert.equal(chips.seededWord, "misstruck");
  const fp = readData("fingerprints.json");
  assert.equal(fp.primary, 90962);
  assert.equal(fp.powershell, "5.1.22621.6133");
  assert.equal(fp.ansiCp, 1252);
  assert.deepEqual(fp.sameClass, [73158, 58545, 28316, 13363, 43024]);
  const contrast = readData("contrast.json");
  assert.match(contrast.scriptBom.result, /BOM|ASCII/);
  assert.match(contrast.stripAgent.result, /strip/);
  assert.equal(contrast.sameClass.oppositeBom, 73158);
  const fixtures = readData("fixtures.json");
  assert.equal(fixtures.rows.length, 12);
  assert.equal(fixtures.rows[0].verdict, "BROKEN");
  assert.equal(fixtures.rows[1].verdict, "OK");
  assert.equal(fixtures.rows[9].verdict, "SKIPPED");
  assert.equal(fixtures.narrativeNotFixture.tree, "16/67");
  assert.equal(fixtures.narrativeNotFixture.armedDays, 4);
});

test("chipsOf on a raw misstruck ticket still marks parser-error", () => {
  const chips = chipsOf({
    bom: false,
    noBom: true,
    emDash: true,
    cp1252: true,
    parseError: true,
    scheduled: true,
    oppositeBom: false,
    asciiOnly: false,
    perExtension: true,
    taskSuccess: true,
    result: "0x80070001",
    logExists: false,
    history: "completed",
  });
  assert.ok(chips.includes("misstruck"));
  assert.ok(chips.includes("parser-error"));
  assert.ok(chips.includes("no-bom"));
  assert.ok(chips.includes("0x80070001"));
  assert.ok(!chips.includes("hallmarked"));
});

test("per-extension contrast does not misstrike a hallmarked sheet", () => {
  const result = analyze({
    bom: true,
    noBom: false,
    emDash: false,
    parseError: false,
    scheduled: false,
    oppositeBom: false,
    asciiOnly: false,
    perExtension: true,
    outputText: "per-extension: emit UTF-8 BOM on .ps1 or restrict to ASCII",
  });
  assert.notEqual(result.verdict, "misstruck");
  assert.ok(result.reasons.some((row) => /per-extension/i.test(row)));
});

test("living page is a goldsmith puncheon rack, idle hallmarked, seeded misstruck", () => {
  const html = readPage();
  assert.match(html, /Idle word:\s*hallmarked/);
  assert.match(html, /hallmarked/);
  assert.match(html, /misstruck/);
  assert.match(html, /no-bom/);
  assert.match(html, /mojibake-quote/);
  assert.match(html, /em-dash/);
  assert.match(html, /cp1252/);
  assert.match(html, /parser-error/);
  assert.match(html, /silent-schedule/);
  assert.match(html, /0x80070001/);
  assert.match(html, /per-extension/);
  assert.match(html, /opposite-bom/);
  assert.match(html, /ps51-ansi/);
  assert.match(html, /string-terminator/);
  assert.match(html, /task-success/);
  assert.match(html, /#90962/);
  assert.match(html, /#73158/);
  assert.match(html, /#58545/);
  assert.match(html, /#28316/);
  assert.match(html, /#43024/);
  assert.match(html, /21:50/);
  assert.match(html, /catalog #95/);
  assert.match(html, /5\.1\.22621\.6133/);
  assert.match(html, /tonydzi/);
  assert.match(html, /E2 80 94/);
  assert.match(html, /U\+201D/);
  assert.match(html, /Cinzel/);
  assert.match(html, /Outfit/);
  assert.match(html, /Spline\+Sans\+Mono|Spline Sans Mono/);
  assert.match(html, /Score the gold/);
  assert.match(html, /Pin idle hallmarked/);
  assert.match(html, /Pin seeded misstruck/);
  assert.match(html, /admit hallmarked/);
  assert.match(html, /puncheon/i);
  assert.match(html, /gold sheet/i);
  assert.match(html, /pewter/i);
  assert.match(html, /scheduler/i);
  assert.match(html, /invisible punch/i);
  assert.doesNotMatch(html, /Idle word:\s*misstruck/i);
  assert.doesNotMatch(html, /Idle word:\s*puncheon/i);
  assert.doesNotMatch(html, /Idle word:\s*pointed/);
  assert.doesNotMatch(html, /Idle word:\s*collapsed/);
  assert.doesNotMatch(html, /Idle word:\s*banked/);
  assert.doesNotMatch(html, /Idle word:\s*traced/);
  assert.doesNotMatch(html, /Pin idle pointed/);
  assert.doesNotMatch(html, /Pin seeded collapsed/);
  assert.doesNotMatch(html, /Score the gnomon/);
  assert.doesNotMatch(html, /Score the spoil/);
  assert.doesNotMatch(html, /Score the grooves/);
  assert.doesNotMatch(html, /family=Libre\+Baskerville/);
  assert.doesNotMatch(html, /family=IBM\+Plex\+Sans/);
  assert.doesNotMatch(html, /family=Space\+Mono/);
  assert.doesNotMatch(html, /family=Instrument/);
  assert.doesNotMatch(html, /family=Source\+Serif/);
  assert.doesNotMatch(html, /family=JetBrains/);
  assert.doesNotMatch(html, /family=Newsreader/);
  assert.doesNotMatch(html, /family=Sora/);
  assert.doesNotMatch(html, /family=Red\+Hat\+Mono/);
  assert.doesNotMatch(html, /family=Fraunces/);
  assert.doesNotMatch(html, /family=Source\+Sans/);
  assert.doesNotMatch(html, /family=IBM\+Plex\+Mono/);
  assert.doesNotMatch(html, /observatory/i);
  assert.doesNotMatch(html, /sundial/i);
  assert.doesNotMatch(html, /spoil tip/i);
  assert.doesNotMatch(html, /drafting trammel/i);
  assert.doesNotMatch(html, /composing-stone/);
  assert.doesNotMatch(html, /papal lead/);
  assert.doesNotMatch(html, /luthier cutaway/);
});

test("assay of raw bytes does not need Windows PowerShell", () => {
  const broken = assay(buildFixture(1), { kind: "ps1" });
  assert.equal(broken.grade, "BROKEN");
  const ok = assay(buildFixture(2), { kind: "ps1" });
  assert.equal(ok.grade, "OK");
  const skipped = assay(buildFixture(10), { kind: "agent.md", filename: "agent.md" });
  assert.equal(skipped.grade, "SKIPPED");
});
