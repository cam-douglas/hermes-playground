import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  APPROVED_PLAN_LEAD,
  ARCH,
  BANNED_NAMES,
  BUTTON_ACCEPT,
  BUTTON_IMPLEMENT,
  CHIPS,
  CONTRAST_NOTE,
  COUSINS,
  COUSIN_ISSUE,
  EXITED_PLAN_BLOCK,
  EXITED_PLAN_EDITS_PHRASE,
  FEATURED_ISSUE,
  FILED_AT,
  FORBIDDEN_IDLE,
  FORBIDDEN_UI,
  HOLD_VERDICTS,
  HOST,
  HUB_LINE,
  HYPOTHESIS_NOTE,
  IDLE_WORD,
  INTERRUPT_STEPS,
  ISSUE_URL,
  LABELS,
  MARK,
  MODEL,
  NOT_PRODUCTS,
  OBSERVED,
  OPEN_DECISIONS,
  PERMISSION_MODE,
  PHRASE,
  PLAN_FILE_COUNT,
  PLATFORM,
  PRIMARY_ISSUES,
  REPORTER,
  SEEDED_WORD,
  START_CODING_PHRASE,
  TITLE,
  VERDICTS,
  analyze,
  classify,
  decide,
  decideSeed,
  emptyTicket,
  handle,
  isEnacted,
  isWithheld,
  normalize,
  score,
  seedAcceptNarrow,
  seedEnacted,
  seedHold,
  seedStartCodingLanguage,
  seedWithheld,
} from "./placet.mjs";

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
  return fileURLToPath(new URL("./placet.mjs", import.meta.url));
}

test("plan assented + implementation withheld + no start-coding language → withheld", () => {
  const result = analyze({
    persistHold: true,
    withheld: true,
    enacted: false,
    buttonChoice: "Accept",
    planAssented: true,
    implementationAuthorised: false,
    startCodingLanguage: false,
    exitedPlanEdits: false,
  });
  assert.equal(result.verdict, "withheld");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.enacted, false);
  assert.equal(result.withheld, true);
  assert.equal(isWithheld(result.ticket), true);
  assert.equal(isEnacted(result.ticket), false);
});

test("narrow Accept + start-coding + exited-plan edits → enacted", () => {
  const result = analyze({
    persistHold: false,
    withheld: false,
    enacted: true,
    buttonChoice: "Accept",
    acceptNarrow: true,
    planAssented: true,
    implementationAuthorised: false,
    startCodingLanguage: true,
    exitedPlanEdits: true,
    permissionMode: "Manual",
    platform: "macOS Darwin 25.6.0",
  });
  assert.equal(result.verdict, "enacted");
  assert.equal(result.alarm, true);
  assert.equal(result.hold, false);
  assert.equal(result.enacted, true);
  assert.equal(isEnacted(result.ticket), true);
  assert.ok(result.chips.includes("enacted"));
  assert.ok(result.chips.includes("accept-narrow"));
  assert.ok(result.chips.includes("start-coding-language"));
  assert.ok(result.chips.includes("exited-plan-edits"));
  assert.ok(!result.chips.includes("withheld"));
});

test("idle withheld is a hold; the chamber withholds", () => {
  const result = analyze(seedWithheld());
  assert.equal(result.verdict, "withheld");
  assert.equal(result.idleWord, "withheld");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.enacted, false);
  assert.ok(result.chips.includes("withheld"));
  assert.ok(result.chips.includes("hold"));
  assert.ok(!result.chips.includes("enacted"));
  assert.equal(result.ticket.persistHold, true);
  assert.equal(result.ticket.planAssented, true);
  assert.equal(result.ticket.implementationAuthorised, false);
  assert.equal(result.ticket.startCodingLanguage, false);
  assert.equal(result.ticket.exitedPlanEdits, false);
  assert.doesNotMatch(
    result.idleWord,
    /masked|bled|sounded|muted|slipped|fouled|verbatim|mangled|moored|aloft|resolved|literal|sealed|blanked|attested|usurped|swaged|torn|homed|crossed|armed|unheard/i,
  );
});

test("empty ticket and empty stdin classify withheld", () => {
  assert.equal(classify(emptyTicket()), "withheld");
  assert.equal(classify(""), "withheld");
  assert.equal(classify(null), "withheld");
  assert.equal(decideSeed("withheld").verdict, "withheld");
  assert.equal(decideSeed("open").verdict, "withheld");
});

test("seeded enacted #92040 is alarm with start-coding and exited-plan chips", () => {
  const result = analyze(seedEnacted());
  assert.equal(result.verdict, "enacted");
  assert.equal(result.alarm, true);
  assert.equal(result.hold, false);
  assert.ok(result.chips.includes("enacted"));
  assert.ok(result.chips.includes("accept-narrow"));
  assert.ok(result.chips.includes("start-coding-language"));
  assert.ok(result.chips.includes("exited-plan-edits"));
  assert.ok(result.chips.includes("manual-mode"));
  assert.ok(result.chips.includes("scope-mismatch"));
  assert.ok(!result.chips.includes("withheld"));
  assert.equal(result.ticket.buttonChoice, BUTTON_ACCEPT);
  assert.equal(result.ticket.startCodingLanguage, true);
  assert.equal(result.ticket.exitedPlanEdits, true);
  assert.equal(result.ticket.reporter, REPORTER);
  assert.equal(result.ticket.permissionMode, PERMISSION_MODE);
  assert.match(result.ticket.toolResultText, /You can now start coding/);
  assert.match(result.ticket.toolResultText, /You can now make edits/);
});

test("data fixtures classify withheld vs enacted vs named chips", () => {
  assert.equal(classify(readData("withheld.json")), "withheld");
  assert.equal(classify(readData("enacted.json")), "enacted");
  assert.equal(classify(readData("accept-narrow.json")), "accept-narrow");
  assert.equal(classify(readData("start-coding-language.json")), "start-coding-language");
  assert.equal(classify(readData("92040.json")), "enacted");
  assert.equal(classify(readData("hold.json")), "hold");
  assert.equal(classify(readData("scope-mismatch.json")), "scope-mismatch");
});

test("enacted seed is alarm; withheld / hold are holds", () => {
  assert.equal(score(seedEnacted()).alarm, true);
  assert.equal(score(seedEnacted()).hold, false);
  assert.equal(score(seedWithheld()).hold, true);
  assert.equal(score(seedWithheld()).alarm, false);
  assert.equal(score(seedHold()).hold, true);
  assert.equal(score(seedAcceptNarrow()).alarm, true);
  assert.equal(score(seedStartCodingLanguage()).alarm, true);
});

test("normalize seeds 92040 without ticket fields", () => {
  const ticket = normalize({ issue: 92040 });
  assert.equal(ticket.startCodingLanguage, true);
  assert.equal(ticket.enacted, true);
  assert.equal(ticket.reporter, REPORTER);
  assert.equal(classify(ticket), "enacted");
});

test("score / decide / handle agree on enacted vs withheld", () => {
  assert.equal(score(seedEnacted()).verdict, "enacted");
  assert.equal(decide(seedWithheld()).verdict, "withheld");
  const fail = handle(seedEnacted());
  const hold = handle(seedWithheld());
  const working = handle(seedHold());
  assert.match(fail.hookSpecificOutput.additionalContext, /#92040/);
  assert.match(
    fail.hookSpecificOutput.additionalContext,
    /start-coding|exited-plan|Accept/i,
  );
  assert.match(hold.hookSpecificOutput.additionalContext, /withheld/i);
  assert.match(working.hookSpecificOutput.additionalContext, /hold/i);
});

test("decideSeed aliases", () => {
  assert.equal(decideSeed("enacted").verdict, "enacted");
  assert.equal(decideSeed(92040).verdict, "enacted");
  assert.equal(decideSeed("92040").verdict, "enacted");
  assert.equal(decideSeed("withheld").verdict, "withheld");
  assert.equal(decideSeed("hold").verdict, "hold");
  assert.equal(decideSeed("accept-narrow").verdict, "accept-narrow");
  assert.equal(decideSeed("accept-and-implement").verdict, "accept-and-implement");
  assert.equal(decideSeed("start-coding-language").verdict, "start-coding-language");
  assert.equal(decideSeed("exited-plan-edits").verdict, "exited-plan-edits");
  assert.equal(decideSeed("manual-mode").verdict, "manual-mode");
  assert.equal(decideSeed("scope-mismatch").verdict, "scope-mismatch");
});

test("CLI scores fixture strings and data files", () => {
  const enacted = spawnSync(
    process.execPath,
    [hookPath(), fileURLToPath(new URL("../data/92040.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(enacted.status, 0, enacted.stderr);
  assert.equal(JSON.parse(enacted.stdout).verdict, "enacted");
  assert.equal(JSON.parse(enacted.stdout).alarm, true);

  const withheld = spawnSync(
    process.execPath,
    [hookPath(), fileURLToPath(new URL("../data/withheld.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(withheld.status, 0, withheld.stderr);
  assert.equal(JSON.parse(withheld.stdout).verdict, "withheld");
  assert.equal(JSON.parse(withheld.stdout).hold, true);

  const piped = spawnSync(
    process.execPath,
    [hookPath()],
    {
      encoding: "utf8",
      input:
        '{"buttonChoice":"Accept","planAssented":true,"implementationAuthorised":false,"startCodingLanguage":true,"exitedPlanEdits":true}\n',
    },
  );
  assert.equal(piped.status, 0, piped.stderr);
  assert.equal(JSON.parse(piped.stdout).verdict, "enacted");
});

test("constants match the issue facts only", () => {
  assert.equal(FEATURED_ISSUE, 92040);
  assert.deepEqual([...PRIMARY_ISSUES], [92040]);
  assert.equal(COUSIN_ISSUE, 74256);
  assert.deepEqual([...COUSINS], [74256, 90685]);
  assert.equal(FILED_AT, "2026-09-04T09:55:26Z");
  assert.equal(REPORTER, "renelaerke");
  assert.equal(PLATFORM, "macOS Darwin 25.6.0");
  assert.equal(ARCH, "Apple Silicon");
  assert.equal(MODEL, "claude-opus-5");
  assert.equal(HOST, "Claude Desktop Code tab");
  assert.equal(PERMISSION_MODE, "Manual");
  assert.equal(OBSERVED, "2026-09-04");
  assert.equal(BUTTON_ACCEPT, "Accept");
  assert.equal(BUTTON_IMPLEMENT, "Accept and start implementing");
  assert.equal(START_CODING_PHRASE, "You can now start coding");
  assert.equal(EXITED_PLAN_EDITS_PHRASE, "You can now make edits, run tools, and take actions");
  assert.equal(PLAN_FILE_COUNT, 6);
  assert.deepEqual([...OPEN_DECISIONS], ["which priority to start", "the release vehicle"]);
  assert.match(INTERRUPT_STEPS, /session-metadata call and one read-only file read/);
  assert.match(APPROVED_PLAN_LEAD, /User has approved your plan/);
  assert.match(EXITED_PLAN_BLOCK, /You have exited plan mode/);
  assert.equal(IDLE_WORD, "withheld");
  assert.equal(SEEDED_WORD, "enacted");
  assert.notEqual(IDLE_WORD, "enacted");
  assert.notEqual(IDLE_WORD, "masked");
  assert.notEqual(IDLE_WORD, "bled");
  assert.notEqual(SEEDED_WORD, "masked");
  assert.match(TITLE, /ExitPlanMode/);
  assert.match(TITLE, /You can now start coding/);
  assert.match(ISSUE_URL, /92040/);
  assert.match(PHRASE, /Score the chamber/);
  assert.match(PHRASE, /admit implementation already started/);
  assert.match(HUB_LINE, /20:50 placet/);
  assert.match(HUB_LINE, /a placet that stamps coding when the chamber only assented to the plan is not assent/);
  assert.match(MARK, /20:50/);
  assert.match(MARK, /#134/);
  assert.match(MARK, /#92040/);
  assert.match(CONTRAST_NOTE, /claude-opus-5/);
  assert.match(CONTRAST_NOTE, /renelaerke/);
  assert.match(CONTRAST_NOTE, /Darwin 25\.6\.0/);
  assert.match(CONTRAST_NOTE, /Manual/);
  assert.match(HYPOTHESIS_NOTE, /NON-BINDING/);
  assert.match(HYPOTHESIS_NOTE, /Accept/);
  assert.ok(LABELS.includes("area:core"));
  assert.ok(LABELS.includes("area:permissions"));
  assert.ok(LABELS.includes("platform:macos"));
  assert.ok(LABELS.includes("has repro"));
  assert.ok(NOT_PRODUCTS.includes("frisket"));
  assert.ok(NOT_PRODUCTS.includes("tangent"));
  assert.ok(NOT_PRODUCTS.includes("hawser"));
  assert.ok(BANNED_NAMES.includes("Frisket"));
  assert.ok(BANNED_NAMES.includes("Tangent"));
  assert.ok(BANNED_NAMES.includes("Hawser"));
  assert.ok(FORBIDDEN_IDLE.includes("masked"));
  assert.ok(FORBIDDEN_IDLE.includes("bled"));
  assert.ok(FORBIDDEN_IDLE.includes("sounded"));
  assert.deepEqual([...HOLD_VERDICTS], ["withheld", "hold"]);
  assert.ok(CHIPS.includes("withheld"));
  assert.ok(CHIPS.includes("enacted"));
  assert.ok(CHIPS.includes("accept-narrow"));
  assert.ok(CHIPS.includes("start-coding-language"));
  assert.ok(CHIPS.includes("scope-mismatch"));
});

test("page is a congregation placet desk, not a frisket or tangent clone", () => {
  const page = readPage();
  assert.match(page, /Spectral/);
  assert.match(page, /Figtree/);
  assert.match(page, /JetBrains Mono/);
  assert.match(page, /20:50 \/ hermes catalog #134 \/ #92040/);
  assert.match(page, /Score the chamber/);
  assert.match(page, /Pin idle withheld/);
  assert.match(page, /Pin seeded enacted/);
  assert.match(page, /admit implementation already started/i);
  assert.match(page, /embed=1/);
  assert.match(page, /placet|chamber|assent|ballot|parchment/i);
  assert.doesNotMatch(page, /Libre Baskerville|Karla|IBM Plex Mono/);
  assert.doesNotMatch(page, /Instrument Serif|Albert Sans|Spline Sans Mono/);
  assert.doesNotMatch(page, /Playfair Display|DM Sans|Fragment Mono/);
  assert.doesNotMatch(page, /Petrona|Sora|Fira Code|Fraunces|Outfit/);
  assert.doesNotMatch(
    page,
    /Score the mask|Score the strike|Score the reap|Score the argv|Score the layer|Score the parse|Score the seal|Attest the deed|Crimp the join/,
  );
  for (const font of FORBIDDEN_UI) {
    assert.doesNotMatch(page, new RegExp(font.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
});

test("README is the locked Placet thesis, not a leftover clone", () => {
  const readme = readReadme();
  assert.match(readme, /ExitPlanMode/);
  assert.match(readme, /#92040/);
  assert.match(readme, /withheld/);
  assert.match(readme, /enacted/);
  assert.match(readme, /renelaerke/);
  assert.match(readme, /NOT Frisket/);
  assert.match(readme, /NOT Tangent/);
  assert.match(readme, /NOT Hawser/);
  assert.match(readme, /Spectral/);
  assert.match(readme, /Figtree/);
  assert.match(readme, /JetBrains Mono/);
  assert.match(readme, /catalog #134/);
  assert.match(readme, /Score the chamber/);
  assert.doesNotMatch(readme, /Write\|Edit\|MultiEdit\|NotebookEdit/);
  assert.doesNotMatch(readme, /49:33;2u/);
  assert.doesNotMatch(readme, /1182 children/);
  assert.doesNotMatch(readme, /Idle word: \*\*masked\*\*/);
  assert.doesNotMatch(readme, /Idle word: \*\*sounded\*\*/);
  assert.doesNotMatch(readme, /Idle word: \*\*slipped\*\*/);
});

test("cousin isolation stays withheld / cite-only", () => {
  assert.equal(decideSeed("cousin").verdict, "withheld");
  assert.equal(decideSeed(74256).verdict, "withheld");
  assert.equal(classify({ issue: 74256 }), "withheld");
  assert.equal(classify({ issue: 90685 }), "withheld");
});

test("banned idle words never appear as the idle word", () => {
  assert.ok(!FORBIDDEN_IDLE.includes(IDLE_WORD));
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(IDLE_WORD, word);
  }
});

test("no real credentials in fixtures or page", () => {
  const files = [
    "92040.json",
    "withheld.json",
    "enacted.json",
    "accept-narrow.json",
    "start-coding-language.json",
    "hold.json",
    "scope-mismatch.json",
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
  }
  const page = readPage();
  assert.doesNotMatch(page, /sk-ant-|ort01-|oat01-/);
});
