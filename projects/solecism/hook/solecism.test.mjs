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
  FORBIDDEN_IDLE,
  FORBIDDEN_UI,
  HOLD_VERDICTS,
  HUB_LINE,
  HYPOTHESIS_NOTE,
  IDLE_WORD,
  ISSUE_URL,
  LABELS,
  LITERAL_PATH,
  MARK,
  NOT_PRODUCTS,
  OBSERVED_AT,
  PHRASE,
  PLATFORM,
  PRIMARY_ISSUES,
  REPORTER,
  RESOLVED_PATH,
  SEEDED_WORD,
  TITLE,
  VERDICTS,
  VERSION,
  analyze,
  classify,
  decide,
  decideSeed,
  emptyTicket,
  handle,
  isLiteral,
  isResolved,
  normalize,
  score,
  seedFlagAsPath,
  seedHold,
  seedLiteral,
  seedParsed,
  seedResolved,
} from "./solecism.mjs";

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
  return fileURLToPath(new URL("./solecism.mjs", import.meta.url));
}

test("persist parse + parsed + no literal → resolved", () => {
  const result = analyze({
    persistParse: true,
    parsed: true,
    literal: false,
    flagAsPath: false,
    mainCheckoutPollution: false,
  });
  assert.equal(result.verdict, "resolved");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.literal, false);
  assert.equal(result.resolved, true);
  assert.equal(isResolved(result.ticket), true);
  assert.equal(isLiteral(result.ticket), false);
});

test("flag-as-path + never parsed + main checkout → literal", () => {
  const result = analyze({
    persistParse: false,
    parsed: false,
    flagAsPath: true,
    literal: true,
    mainCheckoutPollution: true,
    excludeNeverReached: true,
    recurringRecreation: true,
    nearMissGitAdd: true,
    siblingDevNullClass: true,
    belowBashLayer: true,
    gitignoreMasksMiss: true,
    hasClearEvidence: true,
  });
  assert.equal(result.verdict, "literal");
  assert.equal(result.alarm, true);
  assert.equal(result.hold, false);
  assert.equal(result.literal, true);
  assert.equal(isLiteral(result.ticket), true);
  assert.ok(result.chips.includes("literal"));
  assert.ok(result.chips.includes("flag-as-path"));
  assert.ok(result.chips.includes("main-checkout-pollution"));
  assert.ok(result.chips.includes("exclude-never-reached"));
  assert.ok(!result.chips.includes("resolved"));
});

test("idle resolved is a hold; the usage is a resolved exclude", () => {
  const result = analyze(seedResolved());
  assert.equal(result.verdict, "resolved");
  assert.equal(result.idleWord, "resolved");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.literal, false);
  assert.ok(result.chips.includes("resolved"));
  assert.ok(result.chips.includes("hold"));
  assert.ok(result.chips.includes("parsed"));
  assert.ok(!result.chips.includes("literal"));
  assert.equal(result.ticket.persistParse, true);
  assert.equal(result.ticket.parsed, true);
  assert.doesNotMatch(
    result.idleWord,
    /sealed|blanked|attested|usurped|swaged|torn|homed|crossed|armed|unheard/i,
  );
});

test("empty ticket and empty stdin classify resolved", () => {
  assert.equal(classify(emptyTicket()), "resolved");
  assert.equal(classify(""), "resolved");
  assert.equal(classify(null), "resolved");
  assert.equal(decideSeed("resolved").verdict, "resolved");
  assert.equal(decideSeed("open").verdict, "resolved");
});

test("seeded literal #91558 is alarm with flag-as-path and main pollution", () => {
  const result = analyze(seedLiteral());
  assert.equal(result.verdict, "literal");
  assert.equal(result.alarm, true);
  assert.equal(result.hold, false);
  assert.ok(result.chips.includes("literal"));
  assert.ok(result.chips.includes("flag-as-path"));
  assert.ok(result.chips.includes("main-checkout-pollution"));
  assert.ok(result.chips.includes("exclude-never-reached"));
  assert.ok(result.chips.includes("recurring-recreation"));
  assert.ok(result.chips.includes("near-miss-git-add"));
  assert.ok(result.chips.includes("sibling-dev-null-class"));
  assert.ok(result.chips.includes("below-bash-layer"));
  assert.ok(result.chips.includes("gitignore-masks-miss"));
  assert.ok(result.chips.includes("has-clear-evidence"));
  assert.ok(!result.chips.includes("resolved"));
  assert.equal(result.ticket.flagAsPath, true);
  assert.equal(result.ticket.reporter, REPORTER);
  assert.equal(result.ticket.cliVersion, VERSION);
  assert.equal(result.ticket.writtenPath, LITERAL_PATH);
  assert.equal(result.ticket.observedAt, OBSERVED_AT);
});

test("data fixtures classify resolved vs literal vs named chips", () => {
  assert.equal(classify(readData("resolved.json")), "resolved");
  assert.equal(classify(readData("parsed.json")), "parsed");
  assert.equal(classify(readData("literal.json")), "literal");
  assert.equal(classify(readData("flag-as-path.json")), "flag-as-path");
  assert.equal(classify(readData("91558.json")), "literal");
  assert.equal(classify(readData("hold.json")), "hold");
});

test("literal seed is alarm; resolved / parsed / hold are holds", () => {
  assert.equal(score(seedLiteral()).alarm, true);
  assert.equal(score(seedLiteral()).hold, false);
  assert.equal(score(seedResolved()).hold, true);
  assert.equal(score(seedResolved()).alarm, false);
  assert.equal(score(seedHold()).hold, true);
  assert.equal(score(seedParsed()).hold, true);
  assert.equal(score(seedParsed()).verdict, "parsed");
  assert.equal(score(seedFlagAsPath()).alarm, true);
});

test("normalize seeds 91558 without ticket fields", () => {
  const ticket = normalize({ issue: 91558 });
  assert.equal(ticket.flagAsPath, true);
  assert.equal(ticket.literal, true);
  assert.equal(ticket.reporter, REPORTER);
  assert.equal(classify(ticket), "literal");
});

test("score / decide / handle agree on literal vs resolved", () => {
  assert.equal(score(seedLiteral()).verdict, "literal");
  assert.equal(decide(seedResolved()).verdict, "resolved");
  const fail = handle(seedLiteral());
  const hold = handle(seedResolved());
  const working = handle(seedHold());
  assert.match(fail.hookSpecificOutput.additionalContext, /#91558/);
  assert.match(
    fail.hookSpecificOutput.additionalContext,
    /--git-common-dir|literal|MAIN/i,
  );
  assert.match(hold.hookSpecificOutput.additionalContext, /resolved/i);
  assert.match(working.hookSpecificOutput.additionalContext, /hold/i);
});

test("decideSeed aliases", () => {
  assert.equal(decideSeed("literal").verdict, "literal");
  assert.equal(decideSeed(91558).verdict, "literal");
  assert.equal(decideSeed("91558").verdict, "literal");
  assert.equal(decideSeed("resolved").verdict, "resolved");
  assert.equal(decideSeed("hold").verdict, "hold");
  assert.equal(decideSeed("parsed").verdict, "parsed");
  assert.equal(decideSeed("flag-as-path").verdict, "flag-as-path");
  assert.equal(
    decideSeed("main-checkout-pollution").verdict,
    "main-checkout-pollution",
  );
  assert.equal(
    decideSeed("exclude-never-reached").verdict,
    "exclude-never-reached",
  );
  assert.equal(decideSeed("recurring-recreation").verdict, "recurring-recreation");
  assert.equal(decideSeed("near-miss-git-add").verdict, "near-miss-git-add");
  assert.equal(
    decideSeed("sibling-dev-null-class").verdict,
    "sibling-dev-null-class",
  );
  assert.equal(decideSeed("below-bash-layer").verdict, "below-bash-layer");
  assert.equal(decideSeed("gitignore-masks-miss").verdict, "gitignore-masks-miss");
});

test("CLI scores fixture strings and data files", () => {
  const literal = spawnSync(
    process.execPath,
    [hookPath(), fileURLToPath(new URL("../data/91558.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(literal.status, 0, literal.stderr);
  assert.equal(JSON.parse(literal.stdout).verdict, "literal");
  assert.equal(JSON.parse(literal.stdout).alarm, true);

  const resolved = spawnSync(
    process.execPath,
    [hookPath(), fileURLToPath(new URL("../data/resolved.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(resolved.status, 0, resolved.stderr);
  assert.equal(JSON.parse(resolved.stdout).verdict, "resolved");
  assert.equal(JSON.parse(resolved.stdout).hold, true);

  const piped = spawnSync(
    process.execPath,
    [hookPath()],
    { encoding: "utf8", input: '{"flagAsPath":true,"literal":true}\n' },
  );
  assert.equal(piped.status, 0, piped.stderr);
  assert.equal(JSON.parse(piped.stdout).verdict, "literal");
});

test("constants match the issue facts only", () => {
  assert.equal(FEATURED_ISSUE, 91558);
  assert.deepEqual([...PRIMARY_ISSUES], [91558]);
  assert.equal(COUSIN_ISSUE, 90456);
  assert.deepEqual([...COUSINS], [90456]);
  assert.equal(FILED_AT, "2026-09-02T17:19:13Z");
  assert.equal(REPORTER, "karlgroves");
  assert.equal(VERSION, "2.0.42");
  assert.equal(PLATFORM, "macOS 26.5.2 Apple Silicon");
  assert.equal(LITERAL_PATH, "./--git-common-dir/info/exclude");
  assert.equal(RESOLVED_PATH, ".git/info/exclude");
  assert.equal(IDLE_WORD, "resolved");
  assert.equal(SEEDED_WORD, "literal");
  assert.notEqual(IDLE_WORD, "literal");
  assert.notEqual(IDLE_WORD, "sealed");
  assert.notEqual(IDLE_WORD, "attested");
  assert.notEqual(SEEDED_WORD, "blanked");
  assert.notEqual(SEEDED_WORD, "usurped");
  assert.match(TITLE, /literal --git-common-dir/);
  assert.match(TITLE, /\.git\/info\/exclude/);
  assert.match(ISSUE_URL, /91558/);
  assert.match(PHRASE, /Score the parse/);
  assert.match(PHRASE, /admit the flag already landed/);
  assert.match(HUB_LINE, /05:50 solecism/);
  assert.match(MARK, /05:50/);
  assert.match(MARK, /#128/);
  assert.match(MARK, /#91558/);
  assert.match(CONTRAST_NOTE, /LITERAL --git-common-dir/);
  assert.match(CONTRAST_NOTE, /karlgroves/);
  assert.match(CONTRAST_NOTE, /MAIN CHECKOUT/);
  assert.match(HYPOTHESIS_NOTE, /NON-BINDING/);
  assert.match(HYPOTHESIS_NOTE, /fail loudly/);
  assert.ok(LABELS.includes("area:core"));
  assert.ok(LABELS.includes("platform:macos"));
  assert.ok(NOT_PRODUCTS.includes("coffer"));
  assert.ok(NOT_PRODUCTS.includes("codicil"));
  assert.ok(NOT_PRODUCTS.includes("crimp"));
  assert.ok(BANNED_NAMES.includes("Coffer"));
  assert.ok(BANNED_NAMES.includes("Codicil"));
  assert.ok(FORBIDDEN_IDLE.includes("sealed"));
  assert.ok(FORBIDDEN_IDLE.includes("blanked"));
  assert.ok(FORBIDDEN_IDLE.includes("attested"));
  assert.ok(FORBIDDEN_IDLE.includes("usurped"));
  assert.deepEqual([...HOLD_VERDICTS], ["resolved", "parsed", "hold"]);
  assert.ok(CHIPS.includes("resolved"));
  assert.ok(CHIPS.includes("literal"));
  assert.ok(CHIPS.includes("flag-as-path"));
  assert.ok(CHIPS.includes("main-checkout-pollution"));
  assert.ok(CHIPS.includes("exclude-never-reached"));
});

test("page is a grammar usage desk, not a vault or probate clone", () => {
  const page = readPage();
  assert.match(page, /Source Serif 4/);
  assert.match(page, /Work Sans/);
  assert.match(page, /Inconsolata/);
  assert.match(page, /05:50 \/ hermes catalog #128 \/ #91558/);
  assert.match(page, /Score the parse/);
  assert.match(page, /Pin idle resolved/);
  assert.match(page, /Pin seeded literal/);
  assert.match(page, /admit the flag already landed/i);
  assert.match(page, /embed=1/);
  assert.doesNotMatch(page, /Spectral|Karla|IBM Plex Mono/);
  assert.doesNotMatch(page, /Cormorant Garamond|Figtree|Azeret Mono/);
  assert.doesNotMatch(page, /Newsreader|Manrope|JetBrains Mono/);
  assert.doesNotMatch(page, /Brygada 1918|Atkinson Hyperlegible|DM Mono/);
  assert.doesNotMatch(page, /Fraunces|Source Sans 3/);
  assert.doesNotMatch(
    page,
    /Score the seal|Attest the deed|Crimp the join|Patch the jackfield|Sound the tocsin|Score the swage|Score the attestation/,
  );
  for (const font of FORBIDDEN_UI) {
    assert.doesNotMatch(page, new RegExp(font.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
});

test("README is the locked Solecism thesis, not a leftover clone", () => {
  const readme = readReadme();
  assert.match(readme, /LITERAL --git-common-dir/);
  assert.match(readme, /#91558/);
  assert.match(readme, /resolved/);
  assert.match(readme, /literal/);
  assert.match(readme, /karlgroves/);
  assert.match(readme, /NOT Coffer/);
  assert.match(readme, /NOT Codicil/);
  assert.match(readme, /NOT Crimp/);
  assert.match(readme, /Source Serif 4/);
  assert.match(readme, /Work Sans/);
  assert.match(readme, /Inconsolata/);
  assert.match(readme, /catalog #128/);
  assert.match(readme, /Score the parse/);
  assert.doesNotMatch(readme, /WINDOWS OAUTH FILE-STORE/);
  assert.doesNotMatch(readme, /SHARED MULTI-AGENT WORKTREE/);
  assert.doesNotMatch(readme, /SETTINGS.JSON UNLOCKED NON-ATOMIC RMW/);
  assert.doesNotMatch(readme, /Idle word: \*\*sealed\*\*/);
  assert.doesNotMatch(readme, /Idle word: \*\*attested\*\*/);
});

test("cousin isolation stays resolved / cite-only", () => {
  assert.equal(decideSeed("cousin").verdict, "resolved");
  assert.equal(decideSeed(90456).verdict, "resolved");
  assert.equal(classify({ issue: 90456 }), "resolved");
});

test("no real credentials in fixtures or page", () => {
  const files = [
    "91558.json",
    "resolved.json",
    "parsed.json",
    "literal.json",
    "flag-as-path.json",
    "hold.json",
    "fixtures.json",
    "fingerprints.json",
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
