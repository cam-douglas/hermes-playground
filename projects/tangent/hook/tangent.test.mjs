import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  BANNED_NAMES,
  CHIPS,
  CONTRAST_NOTE,
  COUSINS,
  COUSIN_ISSUE,
  FEATURED_ISSUE,
  FILED_AT,
  FLAG_246,
  FLAG_247,
  FORBIDDEN_IDLE,
  FORBIDDEN_UI,
  HOLD_VERDICTS,
  HUB_LINE,
  HYPOTHESIS_NOTE,
  IDLE_WORD,
  INSERT_TABLE,
  ISSUE_URL,
  LABELS,
  LAST_WORKING,
  MARK,
  NOT_PRODUCTS,
  PHRASE,
  PLATFORM,
  PRIMARY_ISSUES,
  REPORTER,
  SEEDED_WORD,
  SEQ_EVENT_TYPE,
  SEQ_SHIFT_1,
  TITLE,
  VERDICTS,
  VERSION,
  analyze,
  classify,
  decide,
  decideSeed,
  emptyTicket,
  handle,
  isMuted,
  isSounded,
  normalize,
  score,
  seedMuted,
  seedHold,
  seedSounded,
  seedUnshifted,
  seedEventTypeDrop,
} from "./tangent.mjs";

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
  return fileURLToPath(new URL("./tangent.mjs", import.meta.url));
}

test("persist strike + alternate consumed + ! → sounded", () => {
  const result = analyze({
    persistStrike: true,
    sounded: true,
    muted: false,
    sequence: "ESC[49:33;2u",
    parsedGlyph: "!",
    expectedGlyph: "!",
    alternateConsumed: true,
  });
  assert.equal(result.verdict, "sounded");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.muted, false);
  assert.equal(result.sounded, true);
  assert.equal(isSounded(result.ticket), true);
  assert.equal(isMuted(result.ticket), false);
});

test("ESC[49:33;2u parsed as 1 not ! → muted", () => {
  const result = analyze({
    persistStrike: false,
    sounded: false,
    muted: true,
    sequence: "ESC[49:33;2u",
    unshifted: 49,
    shifted: 33,
    parsedGlyph: "1",
    expectedGlyph: "!",
    flagRequested: ">5u",
    flag4: true,
    alternateConsumed: false,
    conptyBlank: true,
    eventTypeDrop: true,
    symbolWrong: true,
    unshiftedOnly: true,
    csiU: true,
  });
  assert.equal(result.verdict, "muted");
  assert.equal(result.alarm, true);
  assert.equal(result.hold, false);
  assert.equal(result.muted, true);
  assert.equal(isMuted(result.ticket), true);
  assert.ok(result.chips.includes("muted"));
  assert.ok(result.chips.includes("symbol-wrong"));
  assert.ok(result.chips.includes("alternate-ignored"));
  assert.ok(!result.chips.includes("sounded"));
});

test("idle sounded is a hold; the string sounds", () => {
  const result = analyze(seedSounded());
  assert.equal(result.verdict, "sounded");
  assert.equal(result.idleWord, "sounded");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.muted, false);
  assert.ok(result.chips.includes("sounded"));
  assert.ok(result.chips.includes("hold"));
  assert.ok(!result.chips.includes("muted"));
  assert.equal(result.ticket.persistStrike, true);
  assert.equal(result.ticket.parsedGlyph, "!");
  assert.doesNotMatch(
    result.idleWord,
    /slipped|fouled|verbatim|mangled|moored|aloft|resolved|literal|sealed|blanked|attested|usurped|swaged|torn|homed|crossed|armed|unheard/i,
  );
});

test("empty ticket and empty stdin classify sounded", () => {
  assert.equal(classify(emptyTicket()), "sounded");
  assert.equal(classify(""), "sounded");
  assert.equal(classify(null), "sounded");
  assert.equal(decideSeed("sounded").verdict, "sounded");
  assert.equal(decideSeed("open").verdict, "sounded");
});

test("seeded muted #92021 is alarm with flag-4 and symbol-wrong", () => {
  const result = analyze(seedMuted());
  assert.equal(result.verdict, "muted");
  assert.equal(result.alarm, true);
  assert.equal(result.hold, false);
  assert.ok(result.chips.includes("muted"));
  assert.ok(result.chips.includes("unshifted"));
  assert.ok(result.chips.includes("flag-4"));
  assert.ok(result.chips.includes("csi-u"));
  assert.ok(result.chips.includes("conpty-blank"));
  assert.ok(result.chips.includes("event-type-drop"));
  assert.ok(result.chips.includes("symbol-wrong"));
  assert.ok(result.chips.includes("alternate-ignored"));
  assert.ok(!result.chips.includes("sounded"));
  assert.equal(result.ticket.alternateConsumed, false);
  assert.equal(result.ticket.reporter, REPORTER);
  assert.equal(result.ticket.cliVersion, VERSION);
  assert.equal(result.ticket.sequence, SEQ_SHIFT_1);
  assert.equal(result.ticket.parsedGlyph, "1");
  assert.equal(result.ticket.expectedGlyph, "!");
  assert.equal(result.ticket.flagRequested, FLAG_247);
});

test("data fixtures classify sounded vs muted vs named chips", () => {
  assert.equal(classify(readData("sounded.json")), "sounded");
  assert.equal(classify(readData("muted.json")), "muted");
  assert.equal(classify(readData("unshifted.json")), "unshifted");
  assert.equal(classify(readData("flag-4.json")), "flag-4");
  assert.equal(classify(readData("92021.json")), "muted");
  assert.equal(classify(readData("hold.json")), "hold");
});

test("muted seed is alarm; sounded / hold are holds", () => {
  assert.equal(score(seedMuted()).alarm, true);
  assert.equal(score(seedMuted()).hold, false);
  assert.equal(score(seedSounded()).hold, true);
  assert.equal(score(seedSounded()).alarm, false);
  assert.equal(score(seedHold()).hold, true);
  assert.equal(score(seedUnshifted()).alarm, true);
  assert.equal(score(seedEventTypeDrop()).alarm, true);
});

test("normalize seeds 92021 without ticket fields", () => {
  const ticket = normalize({ issue: 92021 });
  assert.equal(ticket.alternateConsumed, false);
  assert.equal(ticket.muted, true);
  assert.equal(ticket.reporter, REPORTER);
  assert.equal(classify(ticket), "muted");
});

test("score / decide / handle agree on muted vs sounded", () => {
  assert.equal(score(seedMuted()).verdict, "muted");
  assert.equal(decide(seedSounded()).verdict, "sounded");
  const fail = handle(seedMuted());
  const hold = handle(seedSounded());
  const working = handle(seedHold());
  assert.match(fail.hookSpecificOutput.additionalContext, /#92021/);
  assert.match(
    fail.hookSpecificOutput.additionalContext,
    />5u|flag 4|shifted/i,
  );
  assert.match(hold.hookSpecificOutput.additionalContext, /sounded/i);
  assert.match(working.hookSpecificOutput.additionalContext, /hold/i);
});

test("decideSeed aliases", () => {
  assert.equal(decideSeed("muted").verdict, "muted");
  assert.equal(decideSeed(92021).verdict, "muted");
  assert.equal(decideSeed("92021").verdict, "muted");
  assert.equal(decideSeed("sounded").verdict, "sounded");
  assert.equal(decideSeed("hold").verdict, "hold");
  assert.equal(decideSeed("unshifted").verdict, "unshifted");
  assert.equal(decideSeed("flag-4").verdict, "flag-4");
  assert.equal(decideSeed("csi-u").verdict, "csi-u");
  assert.equal(decideSeed("conpty-blank").verdict, "conpty-blank");
  assert.equal(decideSeed("event-type-drop").verdict, "event-type-drop");
  assert.equal(decideSeed("symbol-wrong").verdict, "symbol-wrong");
  assert.equal(decideSeed("alternate-ignored").verdict, "alternate-ignored");
});

test("CLI scores fixture strings and data files", () => {
  const muted = spawnSync(
    process.execPath,
    [hookPath(), fileURLToPath(new URL("../data/92021.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(muted.status, 0, muted.stderr);
  assert.equal(JSON.parse(muted.stdout).verdict, "muted");
  assert.equal(JSON.parse(muted.stdout).alarm, true);

  const sounded = spawnSync(
    process.execPath,
    [hookPath(), fileURLToPath(new URL("../data/sounded.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(sounded.status, 0, sounded.stderr);
  assert.equal(JSON.parse(sounded.stdout).verdict, "sounded");
  assert.equal(JSON.parse(sounded.stdout).hold, true);

  const piped = spawnSync(
    process.execPath,
    [hookPath()],
    { encoding: "utf8", input: '{"sequence":"ESC[49:33;2u","parsedGlyph":"1","expectedGlyph":"!"}\n' },
  );
  assert.equal(piped.status, 0, piped.stderr);
  assert.equal(JSON.parse(piped.stdout).verdict, "muted");
});

test("constants match the issue facts only", () => {
  assert.equal(FEATURED_ISSUE, 92021);
  assert.deepEqual([...PRIMARY_ISSUES], [92021]);
  assert.equal(COUSIN_ISSUE, 90067);
  assert.deepEqual([...COUSINS], [90067, 71700, 77386]);
  assert.equal(FILED_AT, "2026-09-04T08:16:01Z");
  assert.equal(REPORTER, "chadkirst-authid");
  assert.equal(VERSION, "2.1.260");
  assert.equal(LAST_WORKING, "2.1.246");
  assert.equal(PLATFORM, "WezTerm 20240203 on Windows 11 hosting WSL2 Ubuntu");
  assert.equal(FLAG_246, ">1u");
  assert.equal(FLAG_247, ">5u");
  assert.equal(SEQ_SHIFT_1, "ESC[49:33;2u");
  assert.equal(SEQ_EVENT_TYPE, "ESC[97:65;2:1u");
  assert.equal(IDLE_WORD, "sounded");
  assert.equal(SEEDED_WORD, "muted");
  assert.notEqual(IDLE_WORD, "muted");
  assert.notEqual(IDLE_WORD, "slipped");
  assert.notEqual(IDLE_WORD, "fouled");
  assert.notEqual(IDLE_WORD, "verbatim");
  assert.notEqual(SEEDED_WORD, "resolved");
  assert.match(TITLE, /Shifted keys lost in WezTerm/);
  assert.match(TITLE, /report alternate keys/);
  assert.match(ISSUE_URL, /92021/);
  assert.match(PHRASE, /Score the strike/);
  assert.match(PHRASE, /admit the alternate field already muted/);
  assert.match(HUB_LINE, /08:50 tangent/);
  assert.match(MARK, /08:50/);
  assert.match(MARK, /#132/);
  assert.match(MARK, /#92021/);
  assert.match(CONTRAST_NOTE, /ESC\[>5u/);
  assert.match(CONTRAST_NOTE, /chadkirst-authid/);
  assert.match(CONTRAST_NOTE, /49:33;2u/);
  assert.match(HYPOTHESIS_NOTE, /NON-BINDING/);
  assert.match(HYPOTHESIS_NOTE, /flag 4/);
  assert.equal(INSERT_TABLE[1].expected, "!");
  assert.equal(INSERT_TABLE[1].actual, "1");
  assert.ok(LABELS.includes("area:tui"));
  assert.ok(LABELS.includes("platform:windows"));
  assert.ok(LABELS.includes("platform:wsl"));
  assert.ok(LABELS.includes("has repro"));
  assert.ok(LABELS.includes("regression"));
  assert.ok(NOT_PRODUCTS.includes("hawser"));
  assert.ok(NOT_PRODUCTS.includes("caret"));
  assert.ok(NOT_PRODUCTS.includes("buoy"));
  assert.ok(BANNED_NAMES.includes("Hawser"));
  assert.ok(BANNED_NAMES.includes("Caret"));
  assert.ok(FORBIDDEN_IDLE.includes("slipped"));
  assert.ok(FORBIDDEN_IDLE.includes("fouled"));
  assert.ok(FORBIDDEN_IDLE.includes("verbatim"));
  assert.deepEqual([...HOLD_VERDICTS], ["sounded", "hold"]);
  assert.ok(CHIPS.includes("sounded"));
  assert.ok(CHIPS.includes("muted"));
  assert.ok(CHIPS.includes("flag-4"));
  assert.ok(CHIPS.includes("csi-u"));
  assert.ok(CHIPS.includes("conpty-blank"));
});

test("page is a clavichord desk, not a hawser or caret clone", () => {
  const page = readPage();
  assert.match(page, /Instrument Serif/);
  assert.match(page, /Albert Sans/);
  assert.match(page, /Spline Sans Mono/);
  assert.match(page, /08:50 \/ hermes catalog #132 \/ #92021/);
  assert.match(page, /Score the strike/);
  assert.match(page, /Pin idle sounded/);
  assert.match(page, /Pin seeded muted/);
  assert.match(page, /admit the alternate field already muted/i);
  assert.match(page, /embed=1/);
  assert.match(page, /clavichord|tangent|keycap|49:33;2u|>5u|ConPTY/i);
  assert.doesNotMatch(page, /Fraunces|Outfit|IBM Plex Mono/);
  assert.doesNotMatch(page, /Playfair Display|DM Sans|Fragment Mono/);
  assert.doesNotMatch(page, /Petrona|Sora|Fira Code|Fira\+/);
  assert.doesNotMatch(
    page,
    /Score the reap|Score the argv|Score the layer|Score the parse|Score the seal|Attest the deed|Crimp the join/,
  );
  for (const font of FORBIDDEN_UI) {
    assert.doesNotMatch(page, new RegExp(font.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
});

test("README is the locked Tangent thesis, not a leftover clone", () => {
  const readme = readReadme();
  assert.match(readme, /49:33;2u/);
  assert.match(readme, /#92021/);
  assert.match(readme, /sounded/);
  assert.match(readme, /muted/);
  assert.match(readme, /chadkirst-authid/);
  assert.match(readme, /NOT Hawser/);
  assert.match(readme, /NOT Caret/);
  assert.match(readme, /NOT Buoy/);
  assert.match(readme, /Instrument Serif/);
  assert.match(readme, /Albert Sans/);
  assert.match(readme, /Spline Sans Mono/);
  assert.match(readme, /catalog #132/);
  assert.match(readme, /Score the strike/);
  assert.doesNotMatch(readme, /1182 children/);
  assert.doesNotMatch(readme, /CMD\.EXE \/D \/S \/C/);
  assert.doesNotMatch(readme, /FLOATING LEVEL \(LAYER=3\)/);
  assert.doesNotMatch(readme, /Idle word: \*\*slipped\*\*/);
  assert.doesNotMatch(readme, /Idle word: \*\*verbatim\*\*/);
});

test("cousin isolation stays sounded / cite-only", () => {
  assert.equal(decideSeed("cousin").verdict, "sounded");
  assert.equal(decideSeed(90067).verdict, "sounded");
  assert.equal(classify({ issue: 90067 }), "sounded");
  assert.equal(classify({ issue: 71700 }), "sounded");
  assert.equal(classify({ issue: 77386 }), "sounded");
});

test("no real credentials in fixtures or page", () => {
  const files = [
    "92021.json",
    "sounded.json",
    "muted.json",
    "unshifted.json",
    "flag-4.json",
    "hold.json",
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
