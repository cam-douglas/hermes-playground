import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ATTRIBUTE_PATHS,
  BANNED_NAMES,
  CANARY,
  CHIPS,
  CLI_VERSION,
  COLLECTOR,
  CONTRAST_NOTE,
  COUSINS,
  COUSIN_ISSUE,
  FAKE_COMMAND,
  FEATURED_ISSUE,
  FILED_AT,
  FLAG_NAMES,
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
  OBSERVED,
  PHRASE,
  PLATFORM,
  PRIMARY_ISSUES,
  REPORTER,
  SEEDED_WORD,
  SKIP_BACKUPS,
  TITLE,
  VERDICTS,
  analyze,
  canaryInBlob,
  classify,
  decide,
  decideSeed,
  emptyTicket,
  flagsWantScrub,
  handle,
  isPulled,
  isScrubbed,
  normalize,
  score,
  seedFlagMatrix,
  seedHold,
  seedPulled,
  seedScrubbed,
  seedToolInput,
  seedToolParameters,
} from "./hectograph.mjs";

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
  return fileURLToPath(new URL("./hectograph.mjs", import.meta.url));
}

test("flags off + canary absent → scrubbed", () => {
  const result = analyze({
    persistHold: true,
    scrubbed: true,
    pulled: false,
    scrubFlagsOff: true,
    canaryPresent: false,
    flags: { OTEL_LOG_TOOL_CONTENT: false },
    attributes: { tool_result: { tool_input: { command: "echo ok" } } },
  });
  assert.equal(result.verdict, "scrubbed");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.pulled, false);
  assert.equal(result.scrubbed, true);
  assert.equal(isScrubbed(result.ticket), true);
  assert.equal(isPulled(result.ticket), false);
});

test("flags off + canary in tool_parameters and tool_input → pulled", () => {
  const result = analyze({
    persistHold: false,
    scrubbed: false,
    pulled: true,
    scrubFlagsOff: true,
    canaryPresent: true,
    canary: CANARY,
    flags: { OTEL_LOG_TOOL_CONTENT: false },
    fullCommand: FAKE_COMMAND,
    toolParameters: FAKE_COMMAND,
    toolInput: FAKE_COMMAND,
    platform: PLATFORM,
  });
  assert.equal(result.verdict, "pulled");
  assert.equal(result.alarm, true);
  assert.equal(result.hold, false);
  assert.equal(result.pulled, true);
  assert.equal(isPulled(result.ticket), true);
  assert.ok(result.chips.includes("pulled"));
  assert.ok(result.chips.includes("tool-parameters"));
  assert.ok(result.chips.includes("tool-input"));
  assert.ok(result.chips.includes("full-command"));
  assert.ok(!result.chips.includes("scrubbed"));
});

test("idle scrubbed is a hold; the gelatin holds", () => {
  const result = analyze(seedScrubbed());
  assert.equal(result.verdict, "scrubbed");
  assert.equal(result.idleWord, "scrubbed");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.pulled, false);
  assert.ok(result.chips.includes("scrubbed"));
  assert.ok(result.chips.includes("hold"));
  assert.ok(!result.chips.includes("pulled"));
  assert.equal(result.ticket.persistHold, true);
  assert.equal(result.ticket.canaryPresent, false);
  assert.equal(result.ticket.scrubFlagsOff, true);
  assert.equal(flagsWantScrub(result.ticket.flags), true);
  assert.equal(canaryInBlob(result.ticket), false);
  assert.doesNotMatch(
    result.idleWord,
    /masked|bled|sounded|muted|slipped|fouled|verbatim|mangled|moored|aloft|resolved|literal|sealed|blanked|attested|usurped|swaged|torn|homed|crossed|armed|unheard|withheld|enacted/i,
  );
});

test("empty ticket and empty stdin classify scrubbed", () => {
  assert.equal(classify(emptyTicket()), "scrubbed");
  assert.equal(classify(""), "scrubbed");
  assert.equal(classify(null), "scrubbed");
  assert.equal(decideSeed("scrubbed").verdict, "scrubbed");
  assert.equal(decideSeed("open").verdict, "scrubbed");
});

test("seeded pulled #92056 is alarm with path and flag chips", () => {
  const result = analyze(seedPulled());
  assert.equal(result.verdict, "pulled");
  assert.equal(result.alarm, true);
  assert.equal(result.hold, false);
  assert.ok(result.chips.includes("pulled"));
  assert.ok(result.chips.includes("flag-matrix"));
  assert.ok(result.chips.includes("tool-parameters"));
  assert.ok(result.chips.includes("tool-input"));
  assert.ok(result.chips.includes("full-command"));
  assert.ok(result.chips.includes("content-false"));
  assert.ok(!result.chips.includes("scrubbed"));
  assert.equal(result.ticket.canaryPresent, true);
  assert.equal(result.ticket.reporter, REPORTER);
  assert.equal(result.ticket.cliVersion, CLI_VERSION);
  assert.match(result.ticket.fullCommand, new RegExp(CANARY));
  assert.match(JSON.stringify(result.ticket.attributes), /tool_parameters/);
  assert.match(JSON.stringify(result.ticket.attributes), /tool_input/);
});

test("data fixtures classify scrubbed vs pulled vs named chips", () => {
  assert.equal(classify(readData("scrubbed.json")), "scrubbed");
  assert.equal(classify(readData("pulled.json")), "pulled");
  assert.equal(classify(readData("flag-matrix.json")), "flag-matrix");
  assert.equal(classify(readData("tool-parameters.json")), "tool-parameters");
  assert.equal(classify(readData("tool-input.json")), "tool-input");
  assert.equal(classify(readData("92056.json")), "pulled");
  assert.equal(classify(readData("hold.json")), "hold");
  assert.equal(classify(readData("content-false.json")), "content-false");
  assert.equal(classify(readData("content-zero.json")), "content-zero");
  assert.equal(classify(readData("full-command.json")), "full-command");
  assert.equal(classify(readData("canary-payload.json")), "pulled");
});

test("pulled seed is alarm; scrubbed / hold are holds", () => {
  assert.equal(score(seedPulled()).alarm, true);
  assert.equal(score(seedPulled()).hold, false);
  assert.equal(score(seedScrubbed()).hold, true);
  assert.equal(score(seedScrubbed()).alarm, false);
  assert.equal(score(seedHold()).hold, true);
  assert.equal(score(seedFlagMatrix()).alarm, true);
  assert.equal(score(seedToolParameters()).alarm, true);
  assert.equal(score(seedToolInput()).alarm, true);
});

test("normalize seeds 92056 without ticket fields", () => {
  const ticket = normalize({ issue: 92056 });
  assert.equal(ticket.canaryPresent, true);
  assert.equal(ticket.pulled, true);
  assert.equal(ticket.reporter, REPORTER);
  assert.equal(classify(ticket), "pulled");
});

test("score / decide / handle agree on pulled vs scrubbed", () => {
  assert.equal(score(seedPulled()).verdict, "pulled");
  assert.equal(decide(seedScrubbed()).verdict, "scrubbed");
  const fail = handle(seedPulled());
  const hold = handle(seedScrubbed());
  const working = handle(seedHold());
  assert.match(fail.hookSpecificOutput.additionalContext, /#92056/);
  assert.match(
    fail.hookSpecificOutput.additionalContext,
    /tool_input|tool_parameters|canary/i,
  );
  assert.match(hold.hookSpecificOutput.additionalContext, /scrubbed/i);
  assert.match(working.hookSpecificOutput.additionalContext, /hold/i);
});

test("decideSeed aliases", () => {
  assert.equal(decideSeed("pulled").verdict, "pulled");
  assert.equal(decideSeed(92056).verdict, "pulled");
  assert.equal(decideSeed("92056").verdict, "pulled");
  assert.equal(decideSeed("scrubbed").verdict, "scrubbed");
  assert.equal(decideSeed("hold").verdict, "hold");
  assert.equal(decideSeed("flag-matrix").verdict, "flag-matrix");
  assert.equal(decideSeed("tool-parameters").verdict, "tool-parameters");
  assert.equal(decideSeed("tool-input").verdict, "tool-input");
  assert.equal(decideSeed("full-command").verdict, "full-command");
  assert.equal(decideSeed("content-false").verdict, "content-false");
  assert.equal(decideSeed("content-zero").verdict, "content-zero");
  assert.equal(decideSeed("flags-unset").verdict, "flags-unset");
});

test("CLI scores fixture strings and data files", () => {
  const pulled = spawnSync(
    process.execPath,
    [hookPath(), fileURLToPath(new URL("../data/92056.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(pulled.status, 0, pulled.stderr);
  assert.equal(JSON.parse(pulled.stdout).verdict, "pulled");
  assert.equal(JSON.parse(pulled.stdout).alarm, true);

  const scrubbed = spawnSync(
    process.execPath,
    [hookPath(), fileURLToPath(new URL("../data/scrubbed.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(scrubbed.status, 0, scrubbed.stderr);
  assert.equal(JSON.parse(scrubbed.stdout).verdict, "scrubbed");
  assert.equal(JSON.parse(scrubbed.stdout).hold, true);

  const piped = spawnSync(
    process.execPath,
    [hookPath()],
    {
      encoding: "utf8",
      input:
        '{"flags":{"OTEL_LOG_TOOL_CONTENT":false},"canaryPresent":true,"fullCommand":"echo HECTOGRAPH_CANARY_DO_NOT_EXPORT"}\n',
    },
  );
  assert.equal(piped.status, 0, piped.stderr);
  assert.equal(JSON.parse(piped.stdout).verdict, "pulled");
});

test("constants match the issue facts only", () => {
  assert.equal(FEATURED_ISSUE, 92056);
  assert.deepEqual([...PRIMARY_ISSUES], [92056]);
  assert.equal(COUSIN_ISSUE, 92057);
  assert.deepEqual([...COUSINS], [91766, 92057, 91165, 81991]);
  assert.deepEqual([...SKIP_BACKUPS], [92019, 92014]);
  assert.equal(FILED_AT, "2026-09-04T11:07:44Z");
  assert.equal(REPORTER, "michalszelagsonos");
  assert.equal(PLATFORM, "macOS darwin 25.6.0 arm64");
  assert.equal(CLI_VERSION, "2.1.259");
  assert.equal(COLLECTOR, "otelcol-contrib 0.160.0 loopback");
  assert.equal(OBSERVED, "2026-09-04");
  assert.equal(CANARY, "HECTOGRAPH_CANARY_DO_NOT_EXPORT");
  assert.match(FAKE_COMMAND, /HECTOGRAPH_CANARY_DO_NOT_EXPORT/);
  assert.equal(IDLE_WORD, "scrubbed");
  assert.equal(SEEDED_WORD, "pulled");
  assert.notEqual(IDLE_WORD, "pulled");
  assert.notEqual(IDLE_WORD, "masked");
  assert.notEqual(IDLE_WORD, "withheld");
  assert.notEqual(SEEDED_WORD, "enacted");
  assert.match(TITLE, /tool_input\/tool_parameters/);
  assert.match(TITLE, /OTEL_LOG_TOOL_/);
  assert.match(ISSUE_URL, /92056/);
  assert.match(PHRASE, /Score the gelatin/);
  assert.match(PHRASE, /admit the canary already pulled/);
  assert.match(HUB_LINE, /21:50 hectograph/);
  assert.match(HUB_LINE, /a hectograph that still pulls a canary when every scrub flag is off is not a private log/);
  assert.match(MARK, /21:50/);
  assert.match(MARK, /#135/);
  assert.match(MARK, /#92056/);
  assert.match(CONTRAST_NOTE, /2\.1\.259/);
  assert.match(CONTRAST_NOTE, /michalszelagsonos/);
  assert.match(CONTRAST_NOTE, /darwin 25\.6\.0/);
  assert.match(HYPOTHESIS_NOTE, /NON-BINDING/);
  assert.match(HYPOTHESIS_NOTE, /OTEL_LOG_TOOL_/);
  assert.ok(LABELS.includes("area:core"));
  assert.ok(LABELS.includes("area:security"));
  assert.ok(LABELS.includes("platform:macos"));
  assert.ok(LABELS.includes("has repro"));
  assert.ok(FLAG_NAMES.includes("OTEL_LOG_TOOL_CONTENT"));
  assert.ok(ATTRIBUTE_PATHS.includes("tool_decision.tool_parameters.full_command"));
  assert.ok(ATTRIBUTE_PATHS.includes("tool_result.tool_parameters"));
  assert.ok(ATTRIBUTE_PATHS.includes("tool_result.tool_input"));
  assert.ok(NOT_PRODUCTS.includes("placet"));
  assert.ok(NOT_PRODUCTS.includes("frisket"));
  assert.ok(NOT_PRODUCTS.includes("tangent"));
  assert.ok(BANNED_NAMES.includes("Placet"));
  assert.ok(BANNED_NAMES.includes("Frisket"));
  assert.ok(FORBIDDEN_IDLE.includes("masked"));
  assert.ok(FORBIDDEN_IDLE.includes("withheld"));
  assert.ok(FORBIDDEN_IDLE.includes("enacted"));
  assert.deepEqual([...HOLD_VERDICTS], ["scrubbed", "hold"]);
  assert.ok(CHIPS.includes("scrubbed"));
  assert.ok(CHIPS.includes("pulled"));
  assert.ok(CHIPS.includes("flag-matrix"));
  assert.ok(CHIPS.includes("tool-parameters"));
  assert.ok(CHIPS.includes("tool-input"));
});

test("page is a hectograph atelier, not a placet or frisket clone", () => {
  const page = readPage();
  assert.match(page, /Fraunces/);
  assert.match(page, /Outfit/);
  assert.match(page, /Fira Code/);
  assert.match(page, /21:50 \/ hermes catalog #135 \/ #92056/);
  assert.match(page, /Score the gelatin/);
  assert.match(page, /Pin idle scrubbed/);
  assert.match(page, /Pin seeded pulled/);
  assert.match(page, /admit the canary already pulled/i);
  assert.match(page, /embed=1/);
  assert.match(page, /hectograph|gelatin|canary|blot|tray/i);
  assert.doesNotMatch(page, /Spectral|Figtree|JetBrains Mono/);
  assert.doesNotMatch(page, /Libre Baskerville|Karla|IBM Plex Mono/);
  assert.doesNotMatch(page, /Instrument Serif|Albert Sans|Spline Sans Mono/);
  assert.doesNotMatch(page, /Playfair Display|DM Sans|Fragment Mono/);
  assert.doesNotMatch(page, /Petrona|Sora/);
  assert.doesNotMatch(
    page,
    /Score the chamber|Score the mask|Score the strike|Score the reap|Score the argv|Score the layer|Score the parse|Score the seal|Attest the deed|Crimp the join/,
  );
  for (const font of FORBIDDEN_UI) {
    assert.doesNotMatch(page, new RegExp(font.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
});

test("README is the locked Hectograph thesis, not a leftover clone", () => {
  const readme = readReadme();
  assert.match(readme, /OTEL_LOG_TOOL_/);
  assert.match(readme, /#92056/);
  assert.match(readme, /scrubbed/);
  assert.match(readme, /pulled/);
  assert.match(readme, /michalszelagsonos/);
  assert.match(readme, /NOT Placet/);
  assert.match(readme, /NOT Frisket/);
  assert.match(readme, /NOT Tangent/);
  assert.match(readme, /Fraunces/);
  assert.match(readme, /Outfit/);
  assert.match(readme, /Fira Code/);
  assert.match(readme, /catalog #135/);
  assert.match(readme, /Score the gelatin/);
  assert.doesNotMatch(readme, /Idle word: \*\*withheld\*\*/);
  assert.doesNotMatch(readme, /Idle word: \*\*masked\*\*/);
  assert.doesNotMatch(readme, /Idle word: \*\*sounded\*\*/);
  assert.doesNotMatch(readme, /You can now start coding/);
  assert.doesNotMatch(readme, /Write\|Edit\|MultiEdit\|NotebookEdit/);
});

test("cousin isolation stays scrubbed / cite-only", () => {
  assert.equal(decideSeed("cousin").verdict, "scrubbed");
  assert.equal(decideSeed(92057).verdict, "scrubbed");
  assert.equal(classify({ issue: 91766 }), "scrubbed");
  assert.equal(classify({ issue: 92057 }), "scrubbed");
  assert.equal(classify({ issue: 91165 }), "scrubbed");
  assert.equal(classify({ issue: 81991 }), "scrubbed");
  assert.equal(decideSeed(91165).verdict, "scrubbed");
  assert.equal(decideSeed(81991).verdict, "scrubbed");
  const cousins = readData("cousins.json");
  assert.equal(cousins.primary, 92056);
  assert.deepEqual(
    cousins.rows.map((row) => row.issue),
    [91766, 92057, 91165, 81991],
  );
});

test("banned idle words never appear as the idle word", () => {
  assert.ok(!FORBIDDEN_IDLE.includes(IDLE_WORD));
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(IDLE_WORD, word);
  }
});

test("no real credentials or exploit payloads in fixtures or page", () => {
  const files = [
    "92056.json",
    "scrubbed.json",
    "pulled.json",
    "flag-matrix.json",
    "tool-parameters.json",
    "tool-input.json",
    "full-command.json",
    "content-false.json",
    "content-zero.json",
    "hold.json",
    "canary-payload.json",
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
  assert.match(page, /HECTOGRAPH_CANARY_DO_NOT_EXPORT/);
});
