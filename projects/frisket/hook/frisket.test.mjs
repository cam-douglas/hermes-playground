import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  BANNED_NAMES,
  CANARY_DENY,
  CHIPS,
  COMMENTER,
  COMMENTER_PLATFORM,
  COMMENTER_VERSION,
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
  MARK,
  MATCHER,
  NOT_PRODUCTS,
  PERMISSION_MODE,
  PHRASE,
  PLATFORM,
  PRIMARY_ISSUES,
  REPORTER,
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
  isBled,
  isMasked,
  normalize,
  score,
  seedBled,
  seedHold,
  seedLinuxHold,
  seedMasked,
  seedPreSkipped,
  seedDenyIgnored,
} from "./frisket.mjs";

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
  return fileURLToPath(new URL("./frisket.mjs", import.meta.url));
}

test("pre invoked + deny + write held + post silent → masked", () => {
  const result = analyze({
    persistMask: true,
    masked: true,
    bled: false,
    preInvoked: true,
    permissionDecision: "deny",
    writeCompleted: false,
    postFired: false,
  });
  assert.equal(result.verdict, "masked");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.bled, false);
  assert.equal(result.masked, true);
  assert.equal(isMasked(result.ticket), true);
  assert.equal(isBled(result.ticket), false);
});

test("write completed + deny or pre skipped + post fired → bled", () => {
  const result = analyze({
    persistMask: false,
    masked: false,
    bled: true,
    preInvoked: false,
    permissionDecision: "deny",
    writeCompleted: true,
    postFired: true,
    canaryResult: "DENY:test",
    platform: "macOS Darwin 25.3.0",
  });
  assert.equal(result.verdict, "bled");
  assert.equal(result.alarm, true);
  assert.equal(result.hold, false);
  assert.equal(result.bled, true);
  assert.equal(isBled(result.ticket), true);
  assert.ok(result.chips.includes("bled"));
  assert.ok(result.chips.includes("pre-skipped"));
  assert.ok(result.chips.includes("post-fired"));
  assert.ok(result.chips.includes("canary-deny"));
  assert.ok(!result.chips.includes("masked"));
});

test("idle masked is a hold; the mask seats", () => {
  const result = analyze(seedMasked());
  assert.equal(result.verdict, "masked");
  assert.equal(result.idleWord, "masked");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.bled, false);
  assert.ok(result.chips.includes("masked"));
  assert.ok(result.chips.includes("hold"));
  assert.ok(!result.chips.includes("bled"));
  assert.equal(result.ticket.persistMask, true);
  assert.equal(result.ticket.preInvoked, true);
  assert.equal(result.ticket.permissionDecision, "deny");
  assert.equal(result.ticket.writeCompleted, false);
  assert.equal(result.ticket.postFired, false);
  assert.doesNotMatch(
    result.idleWord,
    /sounded|muted|slipped|fouled|verbatim|mangled|moored|aloft|resolved|literal|sealed|blanked|attested|usurped|swaged|torn|homed|crossed|armed|unheard/i,
  );
});

test("empty ticket and empty stdin classify masked", () => {
  assert.equal(classify(emptyTicket()), "masked");
  assert.equal(classify(""), "masked");
  assert.equal(classify(null), "masked");
  assert.equal(decideSeed("masked").verdict, "masked");
  assert.equal(decideSeed("open").verdict, "masked");
});

test("seeded bled #91574 is alarm with pre-skipped post-fired canary-deny", () => {
  const result = analyze(seedBled());
  assert.equal(result.verdict, "bled");
  assert.equal(result.alarm, true);
  assert.equal(result.hold, false);
  assert.ok(result.chips.includes("bled"));
  assert.ok(result.chips.includes("pre-skipped"));
  assert.ok(result.chips.includes("post-fired"));
  assert.ok(result.chips.includes("canary-deny"));
  assert.ok(result.chips.includes("macos-only"));
  assert.ok(result.chips.includes("bypass-mode"));
  assert.ok(!result.chips.includes("masked"));
  assert.equal(result.ticket.preInvoked, false);
  assert.equal(result.ticket.writeCompleted, true);
  assert.equal(result.ticket.postFired, true);
  assert.equal(result.ticket.reporter, REPORTER);
  assert.equal(result.ticket.cliVersion, VERSION);
  assert.equal(result.ticket.canaryResult, CANARY_DENY);
  assert.equal(result.ticket.permissionDecision, "deny");
});

test("data fixtures classify masked vs bled vs named chips", () => {
  assert.equal(classify(readData("masked.json")), "masked");
  assert.equal(classify(readData("bled.json")), "bled");
  assert.equal(classify(readData("pre-skipped.json")), "pre-skipped");
  assert.equal(classify(readData("deny-ignored.json")), "deny-ignored");
  assert.equal(classify(readData("91574.json")), "bled");
  assert.equal(classify(readData("hold.json")), "hold");
  assert.equal(classify(readData("linux-hold.json")), "linux-hold");
});

test("bled seed is alarm; masked / hold / linux-hold are holds", () => {
  assert.equal(score(seedBled()).alarm, true);
  assert.equal(score(seedBled()).hold, false);
  assert.equal(score(seedMasked()).hold, true);
  assert.equal(score(seedMasked()).alarm, false);
  assert.equal(score(seedHold()).hold, true);
  assert.equal(score(seedLinuxHold()).hold, true);
  assert.equal(score(seedLinuxHold()).verdict, "linux-hold");
  assert.equal(score(seedPreSkipped()).alarm, true);
  assert.equal(score(seedDenyIgnored()).alarm, true);
});

test("normalize seeds 91574 without ticket fields", () => {
  const ticket = normalize({ issue: 91574 });
  assert.equal(ticket.writeCompleted, true);
  assert.equal(ticket.bled, true);
  assert.equal(ticket.reporter, REPORTER);
  assert.equal(classify(ticket), "bled");
});

test("score / decide / handle agree on bled vs masked", () => {
  assert.equal(score(seedBled()).verdict, "bled");
  assert.equal(decide(seedMasked()).verdict, "masked");
  const fail = handle(seedBled());
  const hold = handle(seedMasked());
  const working = handle(seedHold());
  assert.match(fail.hookSpecificOutput.additionalContext, /#91574/);
  assert.match(
    fail.hookSpecificOutput.additionalContext,
    /PreToolUse|Write completed|PostToolUse/i,
  );
  assert.match(hold.hookSpecificOutput.additionalContext, /masked/i);
  assert.match(working.hookSpecificOutput.additionalContext, /hold/i);
});

test("decideSeed aliases", () => {
  assert.equal(decideSeed("bled").verdict, "bled");
  assert.equal(decideSeed(91574).verdict, "bled");
  assert.equal(decideSeed("91574").verdict, "bled");
  assert.equal(decideSeed("masked").verdict, "masked");
  assert.equal(decideSeed("hold").verdict, "hold");
  assert.equal(decideSeed("pre-skipped").verdict, "pre-skipped");
  assert.equal(decideSeed("deny-ignored").verdict, "deny-ignored");
  assert.equal(decideSeed("post-fired").verdict, "post-fired");
  assert.equal(decideSeed("canary-deny").verdict, "canary-deny");
  assert.equal(decideSeed("macos-only").verdict, "macos-only");
  assert.equal(decideSeed("linux-hold").verdict, "linux-hold");
  assert.equal(decideSeed("bypass-mode").verdict, "bypass-mode");
});

test("CLI scores fixture strings and data files", () => {
  const bled = spawnSync(
    process.execPath,
    [hookPath(), fileURLToPath(new URL("../data/91574.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(bled.status, 0, bled.stderr);
  assert.equal(JSON.parse(bled.stdout).verdict, "bled");
  assert.equal(JSON.parse(bled.stdout).alarm, true);

  const masked = spawnSync(
    process.execPath,
    [hookPath(), fileURLToPath(new URL("../data/masked.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(masked.status, 0, masked.stderr);
  assert.equal(JSON.parse(masked.stdout).verdict, "masked");
  assert.equal(JSON.parse(masked.stdout).hold, true);

  const piped = spawnSync(
    process.execPath,
    [hookPath()],
    {
      encoding: "utf8",
      input:
        '{"preInvoked":false,"permissionDecision":"deny","writeCompleted":true,"postFired":true}\n',
    },
  );
  assert.equal(piped.status, 0, piped.stderr);
  assert.equal(JSON.parse(piped.stdout).verdict, "bled");
});

test("constants match the issue facts only", () => {
  assert.equal(FEATURED_ISSUE, 91574);
  assert.deepEqual([...PRIMARY_ISSUES], [91574]);
  assert.equal(COUSIN_ISSUE, 89251);
  assert.deepEqual([...COUSINS], [89251, 82642, 88896, 77735]);
  assert.equal(FILED_AT, "2026-09-02T18:56:28Z");
  assert.equal(REPORTER, "technoashu");
  assert.equal(COMMENTER, "yurukusa");
  assert.equal(VERSION, "2.1.245");
  assert.equal(COMMENTER_VERSION, "2.1.258");
  assert.equal(PLATFORM, "macOS Darwin 25.3.0");
  assert.equal(COMMENTER_PLATFORM, "Linux 6.6.87.2 WSL2 Ubuntu 24.04");
  assert.equal(MATCHER, "Write|Edit|MultiEdit|NotebookEdit");
  assert.equal(CANARY_DENY, "DENY:test");
  assert.equal(PERMISSION_MODE, "bypassPermissions");
  assert.equal(IDLE_WORD, "masked");
  assert.equal(SEEDED_WORD, "bled");
  assert.notEqual(IDLE_WORD, "bled");
  assert.notEqual(IDLE_WORD, "sounded");
  assert.notEqual(IDLE_WORD, "muted");
  assert.notEqual(IDLE_WORD, "slipped");
  assert.notEqual(SEEDED_WORD, "resolved");
  assert.match(TITLE, /PreToolUse hook on Write/);
  assert.match(TITLE, /PostToolUse on same matcher fires reliably/);
  assert.match(ISSUE_URL, /91574/);
  assert.match(PHRASE, /Score the mask/);
  assert.match(PHRASE, /admit the plate already bled/);
  assert.match(HUB_LINE, /19:50 frisket/);
  assert.match(HUB_LINE, /a frisket that never seats before the press is not a resist/);
  assert.match(MARK, /19:50/);
  assert.match(MARK, /#133/);
  assert.match(MARK, /#91574/);
  assert.match(CONTRAST_NOTE, /2\.1\.245/);
  assert.match(CONTRAST_NOTE, /technoashu/);
  assert.match(CONTRAST_NOTE, /yurukusa/);
  assert.match(CONTRAST_NOTE, /Darwin 25\.3\.0/);
  assert.match(HYPOTHESIS_NOTE, /NON-BINDING/);
  assert.match(HYPOTHESIS_NOTE, /macOS/);
  assert.ok(LABELS.includes("area:hooks"));
  assert.ok(LABELS.includes("platform:macos"));
  assert.ok(LABELS.includes("has repro"));
  assert.ok(NOT_PRODUCTS.includes("tangent"));
  assert.ok(NOT_PRODUCTS.includes("hawser"));
  assert.ok(NOT_PRODUCTS.includes("caret"));
  assert.ok(BANNED_NAMES.includes("Tangent"));
  assert.ok(BANNED_NAMES.includes("Hawser"));
  assert.ok(BANNED_NAMES.includes("Caret"));
  assert.ok(FORBIDDEN_IDLE.includes("sounded"));
  assert.ok(FORBIDDEN_IDLE.includes("muted"));
  assert.ok(FORBIDDEN_IDLE.includes("slipped"));
  assert.ok(FORBIDDEN_IDLE.includes("verbatim"));
  assert.deepEqual([...HOLD_VERDICTS], ["masked", "hold", "linux-hold"]);
  assert.ok(CHIPS.includes("masked"));
  assert.ok(CHIPS.includes("bled"));
  assert.ok(CHIPS.includes("pre-skipped"));
  assert.ok(CHIPS.includes("canary-deny"));
  assert.ok(CHIPS.includes("linux-hold"));
});

test("page is a print-shop frisket desk, not a tangent or hawser clone", () => {
  const page = readPage();
  assert.match(page, /Libre Baskerville/);
  assert.match(page, /Karla/);
  assert.match(page, /IBM Plex Mono/);
  assert.match(page, /19:50 \/ hermes catalog #133 \/ #91574/);
  assert.match(page, /Score the mask/);
  assert.match(page, /Pin idle masked/);
  assert.match(page, /Pin seeded bled/);
  assert.match(page, /admit the plate already bled/i);
  assert.match(page, /embed=1/);
  assert.match(page, /frisket|press|mask|canary|bleed/i);
  assert.doesNotMatch(page, /Instrument Serif|Albert Sans|Spline Sans Mono/);
  assert.doesNotMatch(page, /Playfair Display|DM Sans|Fragment Mono/);
  assert.doesNotMatch(page, /Petrona|Sora|Fira Code|Fraunces|Outfit/);
  assert.doesNotMatch(
    page,
    /Score the strike|Score the reap|Score the argv|Score the layer|Score the parse|Score the seal|Attest the deed|Crimp the join/,
  );
  for (const font of FORBIDDEN_UI) {
    assert.doesNotMatch(page, new RegExp(font.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
});

test("README is the locked Frisket thesis, not a leftover clone", () => {
  const readme = readReadme();
  assert.match(readme, /Write\|Edit\|MultiEdit\|NotebookEdit/);
  assert.match(readme, /#91574/);
  assert.match(readme, /masked/);
  assert.match(readme, /bled/);
  assert.match(readme, /technoashu/);
  assert.match(readme, /NOT Tangent/);
  assert.match(readme, /NOT Hawser/);
  assert.match(readme, /NOT Caret/);
  assert.match(readme, /Libre Baskerville/);
  assert.match(readme, /Karla/);
  assert.match(readme, /IBM Plex Mono/);
  assert.match(readme, /catalog #133/);
  assert.match(readme, /Score the mask/);
  assert.doesNotMatch(readme, /49:33;2u/);
  assert.doesNotMatch(readme, /1182 children/);
  assert.doesNotMatch(readme, /CMD\.EXE \/D \/S \/C/);
  assert.doesNotMatch(readme, /Idle word: \*\*sounded\*\*/);
  assert.doesNotMatch(readme, /Idle word: \*\*slipped\*\*/);
  assert.doesNotMatch(readme, /Idle word: \*\*verbatim\*\*/);
});

test("cousin isolation stays masked / cite-only", () => {
  assert.equal(decideSeed("cousin").verdict, "masked");
  assert.equal(decideSeed(89251).verdict, "masked");
  assert.equal(classify({ issue: 89251 }), "masked");
  assert.equal(classify({ issue: 82642 }), "masked");
  assert.equal(classify({ issue: 88896 }), "masked");
  assert.equal(classify({ issue: 77735 }), "masked");
});

test("banned idle words never appear as the idle word", () => {
  assert.ok(!FORBIDDEN_IDLE.includes(IDLE_WORD));
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(IDLE_WORD, word);
  }
});

test("no real credentials in fixtures or page", () => {
  const files = [
    "91574.json",
    "masked.json",
    "bled.json",
    "pre-skipped.json",
    "deny-ignored.json",
    "hold.json",
    "linux-hold.json",
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
