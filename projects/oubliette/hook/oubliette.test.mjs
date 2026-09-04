import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  APP_VERSION,
  BANNED_NAMES,
  CCD_VERSION,
  CHIPS,
  CONTRAST_NOTE,
  COUSINS,
  COUSIN_ISSUE,
  DELAYS,
  DIFFERENT_CLASS,
  FEATURED_ISSUE,
  FILED_AT,
  FORBIDDEN_IDLE,
  FORBIDDEN_UI,
  HOLD_VERDICTS,
  HUB_LINE,
  HYPOTHESIS_NOTE,
  IDLE_WORD,
  ISSUE_URL,
  LABELS,
  MARK,
  NOT_PRODUCTS,
  PHRASE,
  PLATFORM,
  PRIMARY_ISSUES,
  QUEUED_LINE,
  REPORTER,
  SEEDED_WORD,
  TITLE,
  VERDICTS,
  analyze,
  classify,
  decide,
  decideSeed,
  emptyTicket,
  handle,
  isCold,
  isVoided,
  normalize,
  score,
  seedCold,
  seedHold,
  seedVoided,
  voidedPattern,
} from "./oubliette.mjs";

function readData(name) {
  return JSON.parse(
    readFileSync(fileURLToPath(new URL(`../data/${name}`, import.meta.url)), "utf8"),
  );
}

function readPage() {
  return readFileSync(fileURLToPath(new URL("../index.html", import.meta.url)), "utf8");
}

function readReadme() {
  return readFileSync(fileURLToPath(new URL("../README.md", import.meta.url)), "utf8");
}

function hookPath() {
  return fileURLToPath(new URL("./oubliette.mjs", import.meta.url));
}

test("warm parent immediate drain → cold", () => {
  const result = analyze({
    persistHold: true,
    cold: true,
    voided: false,
    parentTemp: "warm",
    parentState: "running",
    queued: false,
    drained: true,
    childCompleted: true,
    processAlive: true,
  });
  assert.equal(result.verdict, "cold");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.voided, false);
  assert.equal(result.cold, true);
  assert.equal(isCold(result.ticket), true);
  assert.equal(isVoided(result.ticket), false);
});

test("cold parent + queued child completion → voided", () => {
  const result = analyze({
    persistHold: false,
    cold: false,
    voided: true,
    parentTemp: "cold",
    parentState: "idle",
    queued: true,
    drained: false,
    childCompleted: true,
    processAlive: false,
    delay: "11h35m",
  });
  assert.equal(result.verdict, "voided");
  assert.equal(result.alarm, true);
  assert.equal(result.hold, false);
  assert.equal(result.voided, true);
  assert.equal(isVoided(result.ticket), true);
  assert.ok(result.chips.includes("voided"));
  assert.ok(result.chips.includes("queued"));
  assert.ok(!result.chips.includes("cold"));
});

test("dispatch-shaped payload without seed flags still scores voided", () => {
  const result = analyze({
    parentTemp: "cold",
    queued: true,
    childCompleted: true,
  });
  assert.equal(result.verdict, "voided");
  assert.equal(voidedPattern(result.ticket), true);
});

test("idle cold is a hold; the trapdoor stays shut", () => {
  const result = analyze(seedCold());
  assert.equal(result.verdict, "cold");
  assert.equal(result.idleWord, "cold");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.voided, false);
  assert.ok(result.chips.includes("cold"));
  assert.ok(result.chips.includes("hold"));
  assert.ok(!result.chips.includes("voided"));
  assert.equal(result.ticket.persistHold, true);
  assert.equal(result.ticket.parentTemp, "warm");
  assert.equal(result.ticket.drained, true);
  assert.doesNotMatch(
    result.idleWord,
    /banked|rewritten|keyed|strayed|scrubbed|pulled|enacted|withheld|masked|bled|voided/i,
  );
});

test("empty ticket and empty stdin classify cold", () => {
  assert.equal(classify(emptyTicket()), "cold");
  assert.equal(classify(""), "cold");
  assert.equal(classify(null), "cold");
  assert.equal(decideSeed("cold").verdict, "cold");
  assert.equal(decideSeed("open").verdict, "cold");
});

test("seeded voided #92095 is alarm with pit and trapdoor chips", () => {
  const result = analyze(seedVoided());
  assert.equal(result.verdict, "voided");
  assert.equal(result.alarm, true);
  assert.equal(result.hold, false);
  assert.ok(result.chips.includes("voided"));
  assert.ok(result.chips.includes("queued"));
  assert.ok(result.chips.includes("trapdoor"));
  assert.ok(result.chips.includes("drain-on-wake"));
  assert.ok(result.chips.includes("nine-of-nine"));
  assert.ok(result.chips.includes("unbounded"));
  assert.ok(result.chips.includes("no-os-notify"));
  assert.ok(!result.chips.includes("cold"));
  assert.equal(result.ticket.reporter, REPORTER);
  assert.equal(result.ticket.appVersion, APP_VERSION);
  assert.equal(result.ticket.ccdVersion, CCD_VERSION);
  assert.equal(result.ticket.queuedLine, QUEUED_LINE);
});

test("data fixtures classify cold vs voided vs named chips", () => {
  assert.equal(classify(readData("cold.json")), "cold");
  assert.equal(classify(readData("voided.json")), "voided");
  assert.equal(classify(readData("92095.json")), "voided");
  assert.equal(classify(readData("hold.json")), "hold");
  assert.equal(classify(readData("queued.json")), "queued");
  assert.equal(classify(readData("trapdoor.json")), "trapdoor");
  assert.equal(classify(readData("drain-on-wake.json")), "drain-on-wake");
  assert.equal(classify(readData("nine-of-nine.json")), "nine-of-nine");
  assert.equal(classify(readData("unbounded.json")), "unbounded");
  assert.equal(classify(readData("no-os-notify.json")), "no-os-notify");
});

test("voided seed is alarm; cold / hold are holds", () => {
  assert.equal(score(seedVoided()).alarm, true);
  assert.equal(score(seedVoided()).hold, false);
  assert.equal(score(seedCold()).hold, true);
  assert.equal(score(seedCold()).alarm, false);
  assert.equal(score(seedHold()).hold, true);
});

test("normalize seeds 92095 without ticket fields", () => {
  const ticket = normalize({ issue: 92095 });
  assert.equal(ticket.voided, true);
  assert.equal(ticket.reporter, REPORTER);
  assert.equal(classify(ticket), "voided");
});

test("score / decide / handle agree on voided vs cold", () => {
  assert.equal(score(seedVoided()).verdict, "voided");
  assert.equal(decide(seedCold()).verdict, "cold");
  const fail = handle(seedVoided());
  const hold = handle(seedCold());
  const working = handle(seedHold());
  assert.match(fail.hookSpecificOutput.additionalContext, /#92095/);
  assert.match(
    fail.hookSpecificOutput.additionalContext,
    /cold parent|queued|pit|trapdoor/i,
  );
  assert.match(hold.hookSpecificOutput.additionalContext, /cold/i);
  assert.match(working.hookSpecificOutput.additionalContext, /hold/i);
});

test("decideSeed aliases", () => {
  assert.equal(decideSeed("voided").verdict, "voided");
  assert.equal(decideSeed(92095).verdict, "voided");
  assert.equal(decideSeed("92095").verdict, "voided");
  assert.equal(decideSeed("cold").verdict, "cold");
  assert.equal(decideSeed("hold").verdict, "hold");
  assert.equal(decideSeed("queued").verdict, "queued");
  assert.equal(decideSeed("trapdoor").verdict, "trapdoor");
  assert.equal(decideSeed("drain-on-wake").verdict, "drain-on-wake");
  assert.equal(decideSeed("nine-of-nine").verdict, "nine-of-nine");
  assert.equal(decideSeed("unbounded").verdict, "unbounded");
  assert.equal(decideSeed("no-os-notify").verdict, "no-os-notify");
});

test("CLI scores fixture strings and data files", () => {
  const voided = spawnSync(
    process.execPath,
    [hookPath(), fileURLToPath(new URL("../data/92095.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(voided.status, 0, voided.stderr);
  assert.equal(JSON.parse(voided.stdout).verdict, "voided");
  assert.equal(JSON.parse(voided.stdout).alarm, true);

  const cold = spawnSync(
    process.execPath,
    [hookPath(), fileURLToPath(new URL("../data/cold.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(cold.status, 0, cold.stderr);
  assert.equal(JSON.parse(cold.stdout).verdict, "cold");
  assert.equal(JSON.parse(cold.stdout).hold, true);

  const piped = spawnSync(
    process.execPath,
    [hookPath()],
    {
      encoding: "utf8",
      input: '{"parentTemp":"cold","queued":true,"childCompleted":true}\n',
    },
  );
  assert.equal(piped.status, 0, piped.stderr);
  assert.equal(JSON.parse(piped.stdout).verdict, "voided");
});

test("constants match the issue facts only", () => {
  assert.equal(FEATURED_ISSUE, 92095);
  assert.deepEqual([...PRIMARY_ISSUES], [92095]);
  assert.equal(COUSIN_ISSUE, 39335);
  assert.deepEqual([...COUSINS], [39335, 54214, 53605]);
  assert.deepEqual([...DIFFERENT_CLASS], [20754, 79268]);
  assert.equal(FILED_AT, "2026-09-04T14:08:24Z");
  assert.equal(REPORTER, "AllyOmega");
  assert.equal(PLATFORM, "Windows 11 (10.0.26200) x64");
  assert.equal(APP_VERSION, "1.44121.4.0");
  assert.equal(CCD_VERSION, "2.1.258");
  assert.deepEqual([...DELAYS], ["1m44s", "12m06s", "48m34s", "11h35m"]);
  assert.equal(IDLE_WORD, "cold");
  assert.equal(SEEDED_WORD, "voided");
  assert.notEqual(IDLE_WORD, "voided");
  assert.notEqual(IDLE_WORD, "banked");
  assert.notEqual(IDLE_WORD, "rewritten");
  assert.match(TITLE, /Cowork Dispatch/);
  assert.match(TITLE, /idle parent/);
  assert.match(ISSUE_URL, /92095/);
  assert.match(PHRASE, /Score the trapdoor/);
  assert.match(PHRASE, /admit the queue already drained/);
  assert.match(HUB_LINE, /00:50 oubliette/);
  assert.match(HUB_LINE, /a oubliette that drops a finished child's notice/);
  assert.match(MARK, /00:50/);
  assert.match(MARK, /#138/);
  assert.match(MARK, /#92095/);
  assert.match(CONTRAST_NOTE, /2\.1\.258/);
  assert.match(CONTRAST_NOTE, /AllyOmega/);
  assert.match(CONTRAST_NOTE, /9 out of 9/);
  assert.match(HYPOTHESIS_NOTE, /NON-BINDING/);
  assert.match(HYPOTHESIS_NOTE, /ccd_session_mgmt__send_message/);
  assert.ok(LABELS.includes("area:cowork"));
  assert.ok(LABELS.includes("platform:windows"));
  assert.ok(LABELS.includes("has repro"));
  assert.ok(NOT_PRODUCTS.includes("ephemera"));
  assert.ok(NOT_PRODUCTS.includes("commutator"));
  assert.ok(NOT_PRODUCTS.includes("hawser"));
  assert.ok(BANNED_NAMES.includes("Ephemera"));
  assert.ok(BANNED_NAMES.includes("Commutator"));
  assert.ok(BANNED_NAMES.includes("Hawser"));
  assert.ok(FORBIDDEN_IDLE.includes("banked"));
  assert.ok(FORBIDDEN_IDLE.includes("rewritten"));
  assert.deepEqual([...HOLD_VERDICTS], ["cold", "hold"]);
  assert.ok(CHIPS.includes("cold"));
  assert.ok(CHIPS.includes("voided"));
  assert.ok(CHIPS.includes("queued"));
  assert.ok(CHIPS.includes("nine-of-nine"));
});

test("page is a stone-pit / trapdoor dungeon desk, not a leftover clone", () => {
  const page = readPage();
  assert.match(page, /Eczar/);
  assert.match(page, /Schibsted Grotesk/);
  assert.match(page, /Martian Mono/);
  assert.match(page, /00:50 \/ hermes catalog #138 \/ #92095/);
  assert.match(page, /Score the trapdoor/);
  assert.match(page, /Pin idle cold/);
  assert.match(page, /Pin seeded voided/);
  assert.match(page, /admit the queue already drained/i);
  assert.match(page, /embed=1/);
  assert.match(page, /oubliette|trapdoor|pit/i);
  assert.doesNotMatch(page, /Newsreader|Figtree|Source Code Pro/);
  assert.doesNotMatch(page, /Source Serif 4|Libre Franklin|JetBrains Mono/);
  assert.doesNotMatch(page, /Literata|Manrope|IBM Plex Mono/);
  assert.doesNotMatch(page, /Cormorant|Fraunces|Outfit|Fira Code|DM Sans/);
  assert.doesNotMatch(
    page,
    /Score the wick|Score the drum|Score the gelatin|Score the chamber|Score the mask/,
  );
  for (const font of FORBIDDEN_UI) {
    assert.doesNotMatch(page, new RegExp(font.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
});

test("README is the locked Oubliette thesis, not a leftover clone", () => {
  const readme = readReadme();
  assert.match(readme, /#92095/);
  assert.match(readme, /cold/);
  assert.match(readme, /voided/);
  assert.match(readme, /AllyOmega/);
  assert.match(readme, /NOT Ephemera/);
  assert.match(readme, /NOT Commutator/);
  assert.match(readme, /NOT Hawser/);
  assert.match(readme, /Eczar/);
  assert.match(readme, /Schibsted Grotesk/);
  assert.match(readme, /Martian Mono/);
  assert.match(readme, /catalog #138/);
  assert.match(readme, /Score the trapdoor/);
  assert.doesNotMatch(readme, /Idle word: \*\*banked\*\*/);
  assert.doesNotMatch(readme, /Idle word: \*\*keyed\*\*/);
  assert.doesNotMatch(readme, /Idle word: \*\*rewritten\*\*/);
  assert.doesNotMatch(readme, /five-minute wick/);
  assert.doesNotMatch(readme, /sibling-slot stray/);
});

test("cousin isolation stays cold / cite-only", () => {
  assert.equal(decideSeed("cousin").verdict, "cold");
  assert.equal(decideSeed(39335).verdict, "cold");
  assert.equal(classify({ issue: 39335 }), "cold");
  assert.equal(classify({ issue: 54214 }), "cold");
  assert.equal(classify({ issue: 53605 }), "cold");
  assert.equal(classify({ issue: 20754 }), "cold");
  assert.equal(classify({ issue: 79268 }), "cold");
  const cousins = readData("cousins.json");
  assert.equal(cousins.primary, 92095);
  assert.deepEqual(
    cousins.rows.map((row) => row.issue),
    [39335, 54214, 53605, 20754, 79268],
  );
});

test("delays and versions encode issue numbers only", () => {
  const delays = readData("delays.json");
  assert.equal(delays.rows.length, 4);
  assert.deepEqual(
    delays.rows.map((row) => row.stamp),
    ["1m44s", "12m06s", "48m34s", "11h35m"],
  );
  assert.equal(delays.rows[3].finished, "21:00");
  assert.equal(delays.rows[3].relayed, "08:35");
  const versions = readData("versions.json");
  assert.equal(versions.rows[0].app, "1.34493.0");
  assert.equal(versions.rows[0].ccd, "2.1.235");
  assert.equal(versions.rows[versions.rows.length - 1].app, "1.44121.4");
  assert.equal(versions.rows[versions.rows.length - 1].ccd, "2.1.258");
});

test("banned idle words never appear as the idle word", () => {
  assert.ok(!FORBIDDEN_IDLE.includes(IDLE_WORD));
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(IDLE_WORD, word);
  }
});

test("no real credentials or exploit payloads in fixtures or page", () => {
  const files = [
    "92095.json",
    "cold.json",
    "voided.json",
    "queued.json",
    "trapdoor.json",
    "drain-on-wake.json",
    "nine-of-nine.json",
    "unbounded.json",
    "no-os-notify.json",
    "hold.json",
    "delays.json",
    "versions.json",
    "fixtures.json",
    "fingerprints.json",
    "cousins.json",
  ];
  for (const name of files) {
    const raw = readFileSync(
      fileURLToPath(new URL(`../data/${name}`, import.meta.url)),
      "utf8",
    );
    assert.doesNotMatch(raw, /sk-ant-|ort01-|oat01-/);
    assert.doesNotMatch(raw, /rm -rf|curl .*\| *sh|BEGIN (RSA|OPENSSH) PRIVATE KEY/);
  }
  const page = readPage();
  assert.doesNotMatch(page, /sk-ant-|ort01-|oat01-/);
});
