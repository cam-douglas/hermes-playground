import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ALARM_VERDICTS,
  CHIPS,
  CLI_BAD,
  CLI_GOOD,
  CONFIG_DIR,
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
  NOT_PRODUCTS,
  PARENT_LISTING,
  PHRASE,
  PLATFORM,
  PRIMARY_ISSUES,
  REPRO_PATH,
  SAME_CLASS,
  SCRUB_FLAG,
  SEEDED_WORD,
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
  seedPassThrough,
  seedRinsed,
  seedScrubbed,
} from "./lye.mjs";

function readData(name) {
  return JSON.parse(
    readFileSync(fileURLToPath(new URL(`../data/${name}`, import.meta.url)), "utf8"),
  );
}

function readPage() {
  return readFileSync(fileURLToPath(new URL("../index.html", import.meta.url)), "utf8");
}

function hookPath() {
  return fileURLToPath(new URL("./lye.mjs", import.meta.url));
}

test("idle rinsed is a hold; CLAUDE_CONFIG_DIR still reaches children", () => {
  const result = analyze(seedRinsed());
  assert.equal(result.verdict, "rinsed");
  assert.equal(result.idleWord, "rinsed");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.scrubbed, false);
  assert.ok(result.chips.includes("rinsed"));
  assert.ok(result.chips.includes("pass-through-250"));
  assert.ok(!result.chips.includes("scrubbed"));
  assert.ok(!result.chips.includes("stripped"));
  assert.ok(!result.chips.includes("hook-blind"));
  assert.doesNotMatch(
    result.idleWord,
    /scrubbed|stripped|lye|advowson|reserved|vacant|smutch|plain|seated|bound|hallmarked|pointed|collapsed|spoiled|banked|misstruck|hunting|traced/i,
  );
});

test("empty ticket and empty stdin classify rinsed", () => {
  assert.equal(classify(emptyTicket()), "rinsed");
  assert.equal(classify(""), "rinsed");
  assert.equal(classify(null), "rinsed");
  assert.equal(decideSeed("rinsed").verdict, "rinsed");
});

test("seeded scrubbed #91020 is alarm with the vat chips", () => {
  const result = analyze(seedScrubbed());
  assert.equal(result.verdict, "scrubbed");
  assert.equal(result.alarm, true);
  assert.equal(result.hold, false);
  assert.ok(result.chips.includes("scrubbed"));
  assert.ok(result.chips.includes("stripped"));
  assert.ok(result.chips.includes("relocated-parent"));
  assert.ok(result.chips.includes("default-home"));
  assert.ok(result.chips.includes("hook-blind"));
  assert.ok(result.chips.includes("bash-blind"));
  assert.ok(result.chips.includes("silent-drop"));
  assert.ok(result.chips.includes("regression-251"));
  assert.ok(result.chips.includes("scrub-flag"));
  assert.ok(result.chips.includes("config-dir-lie"));
  assert.ok(result.chips.includes("dual-home"));
  assert.ok(result.chips.includes("unlogged"));
  assert.ok(!result.chips.includes("rinsed"));
  assert.ok(!result.chips.includes("pass-through-250"));
  assert.match(result.contrast.vat, /relocated vat/);
  assert.match(result.contrast.hank, /lost CLAUDE_CONFIG_DIR/);
  assert.match(result.contrast.home, /dual-home/);
});

test("pass-through-250 is a hold", () => {
  const result = analyze(seedPassThrough());
  assert.equal(result.verdict, "pass-through-250");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.ok(result.chips.includes("pass-through-250"));
  assert.ok(result.chips.includes("rinsed"));
  assert.ok(!result.chips.includes("scrubbed"));
});

test("data fixtures classify rinsed vs scrubbed vs named chips", () => {
  assert.equal(classify(readData("rinsed.json")), "rinsed");
  assert.equal(classify(readData("scrubbed.json")), "scrubbed");
  assert.equal(classify(readData("91020.json")), "scrubbed");
  assert.equal(classify(readData("pass-through-250.json")), "pass-through-250");
  assert.equal(classify(readData("stripped.json")), "stripped");
  assert.equal(classify(readData("relocated-parent.json")), "relocated-parent");
  assert.equal(classify(readData("default-home.json")), "default-home");
  assert.equal(classify(readData("hook-blind.json")), "hook-blind");
  assert.equal(classify(readData("bash-blind.json")), "bash-blind");
  assert.equal(classify(readData("silent-drop.json")), "silent-drop");
  assert.equal(classify(readData("regression-251.json")), "regression-251");
  assert.equal(classify(readData("scrub-flag.json")), "scrub-flag");
  assert.equal(classify(readData("config-dir-lie.json")), "config-dir-lie");
  assert.equal(classify(readData("dual-home.json")), "dual-home");
  assert.equal(classify(readData("unlogged.json")), "unlogged");
  assert.equal(classify(readData("not-logged-in.json")), "not-logged-in");
});

test("scrubbed seed is alarm; rinsed and pass-through seeds are hold", () => {
  assert.equal(score(seedScrubbed()).alarm, true);
  assert.equal(score(seedScrubbed()).hold, false);
  assert.equal(score(seedRinsed()).hold, true);
  assert.equal(score(seedRinsed()).alarm, false);
  assert.equal(score(seedPassThrough()).hold, true);
  assert.equal(score(seedPassThrough()).alarm, false);
});

test("normalize seeds 91020 without ticket fields", () => {
  const ticket = normalize({ issue: 91020 });
  assert.equal(ticket.childHasConfigDir, false);
  assert.equal(ticket.parentWritesRelocated, true);
  assert.equal(ticket.hookGrepCount, 0);
  assert.equal(ticket.bashGrepCount, 0);
  assert.equal(ticket.cliVersion, "2.1.251");
  assert.equal(classify(ticket), "scrubbed");
});

test("score / decide / handle agree on scrubbed vs rinsed", () => {
  assert.equal(score(seedScrubbed()).verdict, "scrubbed");
  assert.equal(decide(seedRinsed()).verdict, "rinsed");
  const fail = handle(seedScrubbed());
  const hold = handle(seedRinsed());
  const pass = handle(seedPassThrough());
  assert.match(fail.hookSpecificOutput.additionalContext, /#91020/);
  assert.match(hold.hookSpecificOutput.additionalContext, /rinsed/i);
  assert.match(pass.hookSpecificOutput.additionalContext, /pass-through|2\.1\.250/i);
});

test("decideSeed aliases", () => {
  assert.equal(decideSeed("scrubbed").verdict, "scrubbed");
  assert.equal(decideSeed(91020).verdict, "scrubbed");
  assert.equal(decideSeed("91020").verdict, "scrubbed");
  assert.equal(decideSeed("rinsed").verdict, "rinsed");
  assert.equal(decideSeed("pass-through-250").verdict, "pass-through-250");
  assert.equal(decideSeed("2.1.250").verdict, "pass-through-250");
});

test("CLI scores data files", () => {
  const scrubbed = spawnSync(
    process.execPath,
    [hookPath(), fileURLToPath(new URL("../data/scrubbed.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(scrubbed.status, 0, scrubbed.stderr);
  assert.equal(JSON.parse(scrubbed.stdout).verdict, "scrubbed");

  const rinsed = spawnSync(
    process.execPath,
    [hookPath(), fileURLToPath(new URL("../data/rinsed.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(rinsed.status, 0, rinsed.stderr);
  assert.equal(JSON.parse(rinsed.stdout).verdict, "rinsed");

  const pass = spawnSync(
    process.execPath,
    [hookPath(), fileURLToPath(new URL("../data/pass-through-250.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(pass.status, 0, pass.stderr);
  assert.equal(JSON.parse(pass.stdout).verdict, "pass-through-250");
  assert.equal(JSON.parse(pass.stdout).hold, true);
});

test("constants match the issue facts only", () => {
  assert.equal(FEATURED_ISSUE, 91020);
  assert.deepEqual([...PRIMARY_ISSUES], [91020]);
  assert.deepEqual([...SAME_CLASS], [90683, 90784, 90685, 90647, 91005]);
  assert.equal(FILED_AT, "2026-08-31T15:46:51Z");
  assert.equal(CLI_BAD, "2.1.251");
  assert.equal(CLI_GOOD, "2.1.250");
  assert.equal(PLATFORM, "windows");
  assert.equal(SCRUB_FLAG, "CLAUDE_CODE_SUBPROCESS_ENV_SCRUB=1");
  assert.equal(CONFIG_DIR, "CLAUDE_CONFIG_DIR");
  assert.equal(REPRO_PATH, "/tmp/scrubprobe");
  assert.deepEqual([...PARENT_LISTING], [".claude.json", "projects/", "sessions/"]);
  assert.equal(IDLE_WORD, "rinsed");
  assert.equal(SEEDED_WORD, "scrubbed");
  assert.notEqual(IDLE_WORD, "scrubbed");
  assert.notEqual(IDLE_WORD, "stripped");
  assert.notEqual(IDLE_WORD, "lye");
  assert.deepEqual([...HOLD_VERDICTS], ["rinsed", "pass-through-250"]);
  assert.ok(ALARM_VERDICTS.includes("scrubbed"));
  assert.ok(ALARM_VERDICTS.includes("dual-home"));
  assert.ok(!ALARM_VERDICTS.includes("rinsed"));
  assert.ok(!ALARM_VERDICTS.includes("pass-through-250"));
  assert.deepEqual([...VERDICTS], [...CHIPS]);
  assert.equal(VERDICTS.length, 15);
  assert.deepEqual(
    [...LABELS],
    ["bug", "has repro", "platform:windows", "area:security", "area:bash", "area:hooks", "regression"],
  );
  assert.match(TITLE, /strips CLAUDE_CONFIG_DIR/);
  assert.match(ISSUE_URL, /91020/);
  assert.match(PHRASE, /strips the relocated address from every child/i);
  assert.match(HUB_LINE, /01:50 lye/);
  assert.match(HUB_LINE, /admit rinsed/);
  assert.match(MARK, /01:50/);
  assert.match(MARK, /#99/);
  assert.match(MARK, /#91020/);
  assert.match(CONTRAST_NOTE, /ENV-SCRUB REGRESSION/);
  assert.match(HYPOTHESIS_NOTE, /env-scrub regression in subprocess spawn paths/);
  assert.ok(NOT_PRODUCTS.includes("advowson"));
  assert.ok(NOT_PRODUCTS.includes("smutch"));
  assert.ok(NOT_PRODUCTS.includes("pale"));
  assert.ok(NOT_PRODUCTS.includes("pawl"));
  assert.ok(NOT_PRODUCTS.includes("ambo"));
  assert.ok(NOT_PRODUCTS.includes("chatelaine"));
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(IDLE_WORD, word);
  }
});

test("chips.json and fingerprints stay aligned", () => {
  const chips = readData("chips.json");
  assert.deepEqual(chips.verdicts, [...VERDICTS]);
  assert.equal(chips.idleWord, "rinsed");
  assert.equal(chips.seededWord, "scrubbed");
  const fp = readData("fingerprints.json");
  assert.equal(fp.primary, 91020);
  assert.equal(fp.reproPath, "/tmp/scrubprobe");
  assert.equal(fp.cliBad, "2.1.251");
  assert.equal(fp.cliGood, "2.1.250");
  assert.equal(fp.scrubFlag, "CLAUDE_CODE_SUBPROCESS_ENV_SCRUB=1");
  assert.deepEqual(fp.sameClass, [90683, 90784, 90685, 90647, 91005]);
  const fixtures = readData("fixtures.json");
  assert.equal(fixtures.rows.length, 5);
  assert.equal(fixtures.rows[0].probe, "grep '^CLAUDE_CONFIG_DIR='");
  assert.equal(fixtures.rows[1].probe, "env | grep -c CLAUDE_CONFIG_DIR");
  assert.equal(fixtures.rows[2].path, "/tmp/scrubprobe");
  assert.equal(fixtures.narrativeNotFixture.cliBad, "2.1.251");
});

test("chipsOf on a raw scrubbed ticket still marks hook-blind and dual-home", () => {
  const chips = chipsOf({
    cliVersion: "2.1.251",
    scrubEnabled: true,
    parentWritesRelocated: true,
    childHasConfigDir: false,
    hookGrepCount: 0,
    bashGrepCount: 0,
    silentDrop: true,
    debugSilent: true,
    rinseHold: false,
    outputText:
      "2.1.251 CLAUDE_CODE_SUBPROCESS_ENV_SCRUB=1 strips CLAUDE_CONFIG_DIR; SessionStart hook grep is 0; Bash prints 0; parent still writes relocated /tmp/scrubprobe; children resolve ~/.claude; nothing printed; --debug log contains no message; dual-home; scrubbed",
  });
  assert.ok(chips.includes("scrubbed"));
  assert.ok(chips.includes("stripped"));
  assert.ok(chips.includes("hook-blind"));
  assert.ok(chips.includes("bash-blind"));
  assert.ok(chips.includes("dual-home"));
  assert.ok(chips.includes("silent-drop"));
  assert.ok(!chips.includes("rinsed"));
});

test("named hook-blind is not a full scrubbed vat", () => {
  const result = analyze({
    seed: "hook-blind",
    hookGrepCount: 0,
    childHasConfigDir: false,
    rinseHold: false,
    outputText: "hook-blind: SessionStart hook grep '^CLAUDE_CONFIG_DIR=' is 0",
  });
  assert.notEqual(result.verdict, "scrubbed");
  assert.equal(result.verdict, "hook-blind");
  assert.ok(result.reasons.some((row) => /hook/i.test(row)));
});

test("children lost while parent writes relocated → scrubbed; 2.1.250 pass-through → hold; no strip → rinsed", () => {
  assert.equal(
    classify({
      cliVersion: "2.1.251",
      scrubEnabled: true,
      parentWritesRelocated: true,
      childHasConfigDir: false,
      hookGrepCount: 0,
      bashGrepCount: 0,
      rinseHold: false,
      outputText: "children lost CLAUDE_CONFIG_DIR while parent writes relocated vat",
    }),
    "scrubbed",
  );
  assert.equal(
    classify({
      cliVersion: "2.1.250",
      scrubEnabled: true,
      childHasConfigDir: true,
      hookGrepCount: 1,
      bashGrepCount: 1,
      rinseHold: true,
      outputText: "2.1.250 passes CLAUDE_CONFIG_DIR through with scrub; hook grep 1; Bash grep 1",
    }),
    "pass-through-250",
  );
  assert.equal(
    classify({
      rinseHold: true,
      childHasConfigDir: true,
      hookGrepCount: 1,
      outputText: "rinsed vat; CLAUDE_CONFIG_DIR still reaches children; no strip",
    }),
    "rinsed",
  );
});

test("living page is a fuller's lye vat, idle rinsed, seeded scrubbed", () => {
  const html = readPage();
  assert.match(html, /Idle word:\s*rinsed/);
  assert.match(html, /rinsed/);
  assert.match(html, /scrubbed/);
  assert.match(html, /stripped/);
  assert.match(html, /relocated-parent/);
  assert.match(html, /default-home/);
  assert.match(html, /hook-blind/);
  assert.match(html, /bash-blind/);
  assert.match(html, /silent-drop/);
  assert.match(html, /regression-251/);
  assert.match(html, /scrub-flag/);
  assert.match(html, /config-dir-lie/);
  assert.match(html, /dual-home/);
  assert.match(html, /unlogged/);
  assert.match(html, /pass-through-250/);
  assert.match(html, /not-logged-in/);
  assert.match(html, /#91020/);
  assert.match(html, /#90683/);
  assert.match(html, /#90784/);
  assert.match(html, /#90685/);
  assert.match(html, /01:50/);
  assert.match(html, /catalog #99/);
  assert.match(html, /CLAUDE_CONFIG_DIR/);
  assert.match(html, /CLAUDE_CODE_SUBPROCESS_ENV_SCRUB/);
  assert.match(html, /2\.1\.251/);
  assert.match(html, /2\.1\.250/);
  assert.match(html, /scrubprobe/);
  assert.match(html, /Libre\+Baskerville|Libre Baskerville/);
  assert.match(html, /Source\+Sans\+3|Source Sans 3/);
  assert.match(html, /IBM\+Plex\+Mono|IBM Plex Mono/);
  assert.match(html, /Score the vat/);
  assert.match(html, /Pin idle rinsed/);
  assert.match(html, /Pin seeded scrubbed/);
  assert.match(html, /Admit rinsed/);
  assert.match(html, /Load fixtures/);
  assert.match(html, /Reset to rinsed/);
  assert.match(html, /lye/i);
  assert.match(html, /vat/i);
  assert.match(html, /hank/i);
  assert.match(html, /fuller/i);
  assert.doesNotMatch(html, /Idle word:\s*scrubbed/i);
  assert.doesNotMatch(html, /Idle word:\s*stripped/i);
  assert.doesNotMatch(html, /Idle word:\s*vacant/);
  assert.doesNotMatch(html, /Idle word:\s*reserved/);
  assert.doesNotMatch(html, /Idle word:\s*plain/);
  assert.doesNotMatch(html, /Pin idle vacant/);
  assert.doesNotMatch(html, /Pin idle plain/);
  assert.doesNotMatch(html, /Pin seeded reserved/);
  assert.doesNotMatch(html, /Score the presentation/);
  assert.doesNotMatch(html, /Score the smutch/);
  assert.doesNotMatch(html, /Score the bitting/);
  assert.doesNotMatch(html, /Score the gold/);
  assert.doesNotMatch(html, /family=Cormorant/);
  assert.doesNotMatch(html, /family=Karla/);
  assert.doesNotMatch(html, /family=Fraunces/);
  assert.doesNotMatch(html, /family=DM\+Sans/);
  assert.doesNotMatch(html, /family=Libre\+Bodoni/);
  assert.doesNotMatch(html, /family=Figtree/);
  assert.doesNotMatch(html, /family=JetBrains/);
  assert.doesNotMatch(html, /family=Cinzel/);
  assert.doesNotMatch(html, /family=Outfit/);
  assert.doesNotMatch(html, /family=Spline/);
  assert.doesNotMatch(html, /family=Roboto\+Mono/);
  assert.doesNotMatch(html, /goldsmith/);
  assert.doesNotMatch(html, /observatory/i);
  assert.doesNotMatch(html, /sundial/i);
  assert.doesNotMatch(html, /diocesan/i);
  assert.doesNotMatch(html, /parchment/i);
  assert.doesNotMatch(html, /felt-green/);
  assert.doesNotMatch(html, /pin-tumbler/);
  assert.doesNotMatch(html, /blotter/i);
  assert.doesNotMatch(html, /binder/i);
  assert.doesNotMatch(html, /millimeter/);
  assert.doesNotMatch(html, /woodworking/);
});
