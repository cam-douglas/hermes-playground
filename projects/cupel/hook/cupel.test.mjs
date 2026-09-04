import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  APP_VERSION,
  BANNED_NAMES,
  BUNDLED_NODE,
  CHIPS,
  CONTRAST_NOTE,
  COUSINS,
  COUSIN_ISSUE,
  DIFFERENT_CLASS,
  DRAFT07_URI,
  ELECTRON,
  ERA_PROBE_LINE,
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
  OUTPUT_SCHEMA_LINE,
  PHRASE,
  PLATFORM,
  PRIMARY_ISSUES,
  REPORTER,
  SEEDED_WORD,
  SERVER_VERSION,
  TITLE,
  TOOL_COUNT,
  VERDICTS,
  WORKED_ON,
  analyze,
  classify,
  decide,
  decideSeed,
  emptyTicket,
  handle,
  isPure,
  isScorched,
  normalize,
  score,
  seedHold,
  seedPure,
  seedScorched,
  scorchedPattern,
} from "./cupel.mjs";

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
  return fileURLToPath(new URL("./cupel.mjs", import.meta.url));
}

test("2020-12 accepted schemas → pure", () => {
  const result = analyze({
    persistHold: true,
    pure: true,
    scorched: false,
    dialect: "2020-12",
    eraProbe: "current",
    siblingComplete: true,
    context: "desk-app",
    toolsAnnounced: 14,
    toolsCall: "accepted",
    outputSchemaValid: true,
  });
  assert.equal(result.verdict, "pure");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.scorched, false);
  assert.equal(result.pure, true);
  assert.equal(isPure(result.ticket), true);
  assert.equal(isScorched(result.ticket), false);
});

test("draft-07 refused on shared-pool → scorched", () => {
  const result = analyze({
    persistHold: false,
    pure: false,
    scorched: true,
    dialect: "draft-07",
    eraProbe: "legacy",
    siblingComplete: false,
    context: "shared-pool",
    toolsAnnounced: 14,
    toolsCall: "refused",
    outputSchemaValid: false,
    beforeDisk: true,
  });
  assert.equal(result.verdict, "scorched");
  assert.equal(result.alarm, true);
  assert.equal(result.hold, false);
  assert.equal(result.scorched, true);
  assert.equal(isScorched(result.ticket), true);
  assert.ok(result.chips.includes("scorched"));
  assert.ok(result.chips.includes("draft07"));
  assert.ok(!result.chips.includes("pure"));
});

test("assay-shaped payload without seed flags still scores scorched", () => {
  const result = analyze({
    dialect: "draft-07",
    toolsCall: "refused",
    outputSchemaValid: false,
  });
  assert.equal(result.verdict, "scorched");
  assert.equal(scorchedPattern(result.ticket), true);
});

test("idle pure is a hold; the cupel stays bone-ash", () => {
  const result = analyze(seedPure());
  assert.equal(result.verdict, "pure");
  assert.equal(result.idleWord, "pure");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.scorched, false);
  assert.ok(result.chips.includes("pure"));
  assert.ok(result.chips.includes("hold"));
  assert.ok(!result.chips.includes("scorched"));
  assert.equal(result.ticket.persistHold, true);
  assert.equal(result.ticket.dialect, "2020-12");
  assert.equal(result.ticket.toolsCall, "accepted");
  assert.doesNotMatch(
    result.idleWord,
    /cold|voided|banked|rewritten|keyed|strayed|scrubbed|pulled|enacted|withheld|masked|bled|scorched/i,
  );
});

test("empty ticket and empty stdin classify pure", () => {
  assert.equal(classify(emptyTicket()), "pure");
  assert.equal(classify(""), "pure");
  assert.equal(classify(null), "pure");
  assert.equal(decideSeed("pure").verdict, "pure");
  assert.equal(decideSeed("open").verdict, "pure");
});

test("seeded scorched #92122 is alarm with alloy chips", () => {
  const result = analyze(seedScorched());
  assert.equal(result.verdict, "scorched");
  assert.equal(result.alarm, true);
  assert.equal(result.hold, false);
  assert.ok(result.chips.includes("scorched"));
  assert.ok(result.chips.includes("legacy"));
  assert.ok(result.chips.includes("draft07"));
  assert.ok(result.chips.includes("shared-pool"));
  assert.ok(result.chips.includes("refused"));
  assert.ok(result.chips.includes("fourteen"));
  assert.ok(!result.chips.includes("pure"));
  assert.equal(result.ticket.reporter, REPORTER);
  assert.equal(result.ticket.appVersion, APP_VERSION);
  assert.equal(result.ticket.eraProbeLine, ERA_PROBE_LINE);
  assert.equal(result.ticket.outputSchemaLine, OUTPUT_SCHEMA_LINE);
});

test("data fixtures classify pure vs scorched vs named chips", () => {
  assert.equal(classify(readData("pure.json")), "pure");
  assert.equal(classify(readData("pure-2020-12.json")), "pure");
  assert.equal(classify(readData("scorched.json")), "scorched");
  assert.equal(classify(readData("92122.json")), "scorched");
  assert.equal(classify(readData("hold.json")), "hold");
  assert.equal(classify(readData("era-probe-legacy.json")), "legacy");
  assert.equal(classify(readData("draft07-refused.json")), "draft07");
  assert.equal(classify(readData("shared-pool.json")), "shared-pool");
  assert.equal(classify(readData("refused.json")), "refused");
  assert.equal(classify(readData("fourteen-tools.json")), "fourteen");
});

test("scorched seed is alarm; pure / hold are holds", () => {
  assert.equal(score(seedScorched()).alarm, true);
  assert.equal(score(seedScorched()).hold, false);
  assert.equal(score(seedPure()).hold, true);
  assert.equal(score(seedPure()).alarm, false);
  assert.equal(score(seedHold()).hold, true);
});

test("normalize seeds 92122 without ticket fields", () => {
  const ticket = normalize({ issue: 92122 });
  assert.equal(ticket.scorched, true);
  assert.equal(ticket.reporter, REPORTER);
  assert.equal(classify(ticket), "scorched");
});

test("score / decide / handle agree on scorched vs pure", () => {
  assert.equal(score(seedScorched()).verdict, "scorched");
  assert.equal(decide(seedPure()).verdict, "pure");
  const fail = handle(seedScorched());
  const hold = handle(seedPure());
  const working = handle(seedHold());
  assert.match(fail.hookSpecificOutput.additionalContext, /#92122/);
  assert.match(
    fail.hookSpecificOutput.additionalContext,
    /era probe|draft-07|shared-pool/i,
  );
  assert.match(hold.hookSpecificOutput.additionalContext, /pure/i);
  assert.match(working.hookSpecificOutput.additionalContext, /hold/i);
});

test("decideSeed aliases", () => {
  assert.equal(decideSeed("scorched").verdict, "scorched");
  assert.equal(decideSeed(92122).verdict, "scorched");
  assert.equal(decideSeed("92122").verdict, "scorched");
  assert.equal(decideSeed("pure").verdict, "pure");
  assert.equal(decideSeed("hold").verdict, "hold");
  assert.equal(decideSeed("legacy").verdict, "legacy");
  assert.equal(decideSeed("draft07").verdict, "draft07");
  assert.equal(decideSeed("draft-07").verdict, "draft07");
  assert.equal(decideSeed("shared-pool").verdict, "shared-pool");
  assert.equal(decideSeed("refused").verdict, "refused");
  assert.equal(decideSeed("fourteen").verdict, "fourteen");
});

test("CLI scores fixture strings and data files", () => {
  const scorched = spawnSync(
    process.execPath,
    [hookPath(), fileURLToPath(new URL("../data/92122.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(scorched.status, 0, scorched.stderr);
  assert.equal(JSON.parse(scorched.stdout).verdict, "scorched");
  assert.equal(JSON.parse(scorched.stdout).alarm, true);

  const pure = spawnSync(
    process.execPath,
    [hookPath(), fileURLToPath(new URL("../data/pure.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(pure.status, 0, pure.stderr);
  assert.equal(JSON.parse(pure.stdout).verdict, "pure");
  assert.equal(JSON.parse(pure.stdout).hold, true);

  const piped = spawnSync(
    process.execPath,
    [hookPath()],
    {
      encoding: "utf8",
      input: '{"dialect":"draft-07","toolsCall":"refused","outputSchemaValid":false}\n',
    },
  );
  assert.equal(piped.status, 0, piped.stderr);
  assert.equal(JSON.parse(piped.stdout).verdict, "scorched");
});

test("constants match the issue facts only", () => {
  assert.equal(FEATURED_ISSUE, 92122);
  assert.deepEqual([...PRIMARY_ISSUES], [92122]);
  assert.equal(COUSIN_ISSUE, 88988);
  assert.deepEqual([...COUSINS], [88988, 88882, 90549, 90245, 87633, 86142]);
  assert.deepEqual([...DIFFERENT_CLASS], [92091, 80174]);
  assert.equal(FILED_AT, "2026-09-04T15:30:23Z");
  assert.equal(REPORTER, "aflewis");
  assert.equal(PLATFORM, "macOS Apple Silicon");
  assert.equal(APP_VERSION, "1.46388.2");
  assert.equal(WORKED_ON, "1.40609.1");
  assert.equal(ELECTRON, "42.10.0");
  assert.equal(BUNDLED_NODE, "24.18.1");
  assert.equal(SERVER_VERSION, "2026.7.4");
  assert.equal(TOOL_COUNT, 14);
  assert.equal(DRAFT07_URI, "http://json-schema.org/draft-07/schema#");
  assert.equal(IDLE_WORD, "pure");
  assert.equal(SEEDED_WORD, "scorched");
  assert.notEqual(IDLE_WORD, "scorched");
  assert.notEqual(IDLE_WORD, "cold");
  assert.notEqual(IDLE_WORD, "voided");
  assert.match(TITLE, /Filesystem extension broken/);
  assert.match(TITLE, /draft-07/);
  assert.match(ISSUE_URL, /92122/);
  assert.match(PHRASE, /Score the cupel/);
  assert.match(PHRASE, /admit the charge already scorched/);
  assert.match(HUB_LINE, /01:50 cupel/);
  assert.match(HUB_LINE, /a cupel that scorches draft-07 MCP alloy/);
  assert.match(MARK, /01:50/);
  assert.match(MARK, /#139/);
  assert.match(MARK, /#92122/);
  assert.match(CONTRAST_NOTE, /1\.46388\.2/);
  assert.match(CONTRAST_NOTE, /aflewis/);
  assert.match(CONTRAST_NOTE, /14 tools/);
  assert.match(HYPOTHESIS_NOTE, /NON-BINDING/);
  assert.match(HYPOTHESIS_NOTE, /[Ss]hared-pool/);
  assert.ok(LABELS.includes("area:mcp"));
  assert.ok(LABELS.includes("area:cowork"));
  assert.ok(LABELS.includes("platform:macos"));
  assert.ok(LABELS.includes("has repro"));
  assert.ok(NOT_PRODUCTS.includes("oubliette"));
  assert.ok(NOT_PRODUCTS.includes("ephemera"));
  assert.ok(NOT_PRODUCTS.includes("commutator"));
  assert.ok(BANNED_NAMES.includes("Oubliette"));
  assert.ok(BANNED_NAMES.includes("Ephemera"));
  assert.ok(BANNED_NAMES.includes("Heddle"));
  assert.ok(FORBIDDEN_IDLE.includes("cold"));
  assert.ok(FORBIDDEN_IDLE.includes("voided"));
  assert.deepEqual([...HOLD_VERDICTS], ["pure", "hold"]);
  assert.ok(CHIPS.includes("pure"));
  assert.ok(CHIPS.includes("scorched"));
  assert.ok(CHIPS.includes("legacy"));
  assert.ok(CHIPS.includes("draft07"));
});

test("page is a bone-ash assay office, not a leftover clone", () => {
  const page = readPage();
  assert.match(page, /Bodoni Moda/);
  assert.match(page, /Outfit/);
  assert.match(page, /IBM Plex Mono/);
  assert.match(page, /01:50 \/ hermes catalog #139 \/ #92122/);
  assert.match(page, /Score the cupel/);
  assert.match(page, /Pin idle pure/);
  assert.match(page, /Pin seeded scorched/);
  assert.match(page, /admit the charge already scorched/i);
  assert.match(page, /embed/);
  assert.match(page, /cupel|assay|bullion|slag/i);
  assert.doesNotMatch(page, /trapdoor|stone-pit|voided|moonbeam|hatch/);
  assert.doesNotMatch(page, /Newsreader|Figtree|Source Code Pro/);
  assert.doesNotMatch(page, /Eczar|Schibsted Grotesk|Martian Mono/);
  assert.doesNotMatch(page, /Source Serif 4|Libre Franklin|JetBrains Mono/);
  assert.doesNotMatch(page, /Literata|Manrope|Cormorant|Fraunces|Fira Code|DM Sans/);
  assert.doesNotMatch(
    page,
    /Score the trapdoor|Score the wick|Score the drum|Score the gelatin|Score the chamber|Score the mask/,
  );
  for (const font of FORBIDDEN_UI) {
    assert.doesNotMatch(page, new RegExp(font.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
});

test("README is the locked Cupel thesis, not a leftover clone", () => {
  const readme = readReadme();
  assert.match(readme, /#92122/);
  assert.match(readme, /pure/);
  assert.match(readme, /scorched/);
  assert.match(readme, /aflewis/);
  assert.match(readme, /NOT Oubliette/);
  assert.match(readme, /NOT Ephemera/);
  assert.match(readme, /NOT Commutator/);
  assert.match(readme, /Bodoni Moda/);
  assert.match(readme, /Outfit/);
  assert.match(readme, /IBM Plex Mono/);
  assert.match(readme, /catalog #139/);
  assert.match(readme, /Score the cupel/);
  assert.doesNotMatch(readme, /Idle word: \*\*cold\*\*/);
  assert.doesNotMatch(readme, /Idle word: \*\*voided\*\*/);
  assert.doesNotMatch(readme, /Idle word: \*\*banked\*\*/);
  assert.doesNotMatch(readme, /trapdoor dungeon/);
  assert.doesNotMatch(readme, /five-minute wick/);
  assert.doesNotMatch(readme, /sibling-slot stray/);
});

test("cousin isolation stays pure / cite-only", () => {
  assert.equal(decideSeed("cousin").verdict, "pure");
  assert.equal(decideSeed(88988).verdict, "pure");
  assert.equal(classify({ issue: 88988 }), "pure");
  assert.equal(classify({ issue: 88882 }), "pure");
  assert.equal(classify({ issue: 90549 }), "pure");
  assert.equal(classify({ issue: 90245 }), "pure");
  assert.equal(classify({ issue: 87633 }), "pure");
  assert.equal(classify({ issue: 86142 }), "pure");
  assert.equal(classify({ issue: 92091 }), "pure");
  assert.equal(classify({ issue: 80174 }), "pure");
  const cousins = readData("cousins.json");
  assert.equal(cousins.primary, 92122);
  assert.deepEqual(
    cousins.rows.map((row) => row.issue),
    [88988, 88882, 90549, 90245, 87633, 86142, 92091, 80174],
  );
});

test("dialects and tools encode issue numbers only", () => {
  const dialects = readData("dialects.json");
  assert.equal(dialects.draft07, "http://json-schema.org/draft-07/schema#");
  assert.equal(dialects.validator, "JSON Schema 2020-12 only");
  const tools = readData("tools.json");
  assert.equal(tools.announced, 14);
  assert.deepEqual(tools.refused, [
    "list_directory",
    "get_file_info",
    "list_allowed_directories",
  ]);
});

test("banned idle words never appear as the idle word", () => {
  assert.ok(!FORBIDDEN_IDLE.includes(IDLE_WORD));
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(IDLE_WORD, word);
  }
});

test("no real credentials or exploit payloads in fixtures or page", () => {
  const files = [
    "92122.json",
    "pure.json",
    "pure-2020-12.json",
    "scorched.json",
    "era-probe-legacy.json",
    "draft07-refused.json",
    "shared-pool.json",
    "refused.json",
    "fourteen-tools.json",
    "hold.json",
    "dialects.json",
    "tools.json",
    "fixtures.json",
    "fingerprints.json",
    "cousins.json",
    "chips.json",
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
