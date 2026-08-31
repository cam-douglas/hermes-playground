import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ALARM_VERDICTS,
  CHIPS,
  CONTRAST_NOTE,
  EXTENSION,
  EXTENSION_VERSION,
  FEATURED_ISSUE,
  FILED_AT,
  FORBIDDEN_IDLE,
  HOLD_VERDICTS,
  HUB_LINE,
  IDLE_WORD,
  ISSUE_URL,
  LABELS,
  MARK,
  NOT_PRODUCTS,
  OS_NAME,
  PHRASE,
  PRIMARY_ISSUES,
  REPORTER,
  SAME_CLASS,
  SEEDED_WORD,
  TITLE,
  VERDICTS,
  VSCODE,
  analyze,
  chipsOf,
  classify,
  decide,
  decideSeed,
  emptyTicket,
  handle,
  normalize,
  score,
  seedHunting,
  seedTraced,
} from "./trammel.mjs";

function readData(name) {
  return JSON.parse(
    readFileSync(fileURLToPath(new URL(`../data/${name}`, import.meta.url)), "utf8")
  );
}

function readPage() {
  return readFileSync(fileURLToPath(new URL("../index.html", import.meta.url)), "utf8");
}

function hookPath() {
  return fileURLToPath(new URL("./trammel.mjs", import.meta.url));
}

test("idle traced is a hold; only the active pane restores", () => {
  const result = analyze(seedTraced());
  assert.equal(result.verdict, "traced");
  assert.equal(result.idleWord, "traced");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.hunting, false);
  assert.ok(result.chips.includes("traced"));
  assert.ok(!result.chips.includes("hunting"));
  assert.ok(!result.chips.includes("steal-loop"));
  assert.doesNotMatch(
    result.idleWord,
    /trammel|hunting|oscillating|stolen|ping-pong|focus|flicker|split|loop|soundpost|coupled|fallen|struck|torn|seated/i,
  );
});

test("empty ticket and empty stdin classify traced", () => {
  assert.equal(classify(emptyTicket()), "traced");
  assert.equal(classify(""), "traced");
  assert.equal(classify(null), "traced");
  assert.equal(decideSeed("traced").verdict, "traced");
});

test("seeded hunting #90936 is alarm with the steal-loop chips", () => {
  const result = analyze(seedHunting());
  assert.equal(result.verdict, "hunting");
  assert.equal(result.alarm, true);
  assert.equal(result.hold, false);
  assert.ok(result.chips.includes("hunting"));
  assert.ok(result.chips.includes("split"));
  assert.ok(result.chips.includes("visible-not-active"));
  assert.ok(result.chips.includes("per-document"));
  assert.ok(result.chips.includes("body-guard"));
  assert.ok(result.chips.includes("timeout-offset"));
  assert.ok(result.chips.includes("steal-loop"));
  assert.ok(result.chips.includes("iframe-focus"));
  assert.ok(result.chips.includes("no-isActive"));
  assert.ok(result.chips.includes("dual-visible"));
  assert.ok(result.chips.includes("flicker"));
  assert.match(result.contrast.split, /two visible/);
  assert.match(result.contrast.sash, /regained OS focus/);
  assert.match(result.contrast.groove, /isVisible without isActive/);
});

test("data fixtures classify traced vs hunting vs named chips", () => {
  assert.equal(classify(readData("traced.json")), "traced");
  assert.equal(classify(readData("hunting.json")), "hunting");
  assert.equal(classify(readData("90936.json")), "hunting");
  assert.equal(classify(readData("split.json")), "split");
  assert.equal(classify(readData("visible-not-active.json")), "visible-not-active");
  assert.equal(classify(readData("per-document.json")), "per-document");
  assert.equal(classify(readData("body-guard.json")), "body-guard");
  assert.equal(classify(readData("timeout-offset.json")), "timeout-offset");
  assert.equal(classify(readData("steal-loop.json")), "steal-loop");
  assert.equal(classify(readData("iframe-focus.json")), "iframe-focus");
  assert.equal(classify(readData("no-isActive.json")), "no-isActive");
  assert.equal(classify(readData("dual-visible.json")), "dual-visible");
  assert.equal(classify(readData("flicker.json")), "flicker");
});

test("hunting seed is alarm; traced seed is hold", () => {
  assert.equal(score(seedHunting()).alarm, true);
  assert.equal(score(seedHunting()).hold, false);
  assert.equal(score(seedTraced()).hold, true);
  assert.equal(score(seedTraced()).alarm, false);
});

test("normalize seeds 90936 without ticket fields", () => {
  const ticket = normalize({ issue: 90936 });
  assert.equal(ticket.twoVisiblePanels, true);
  assert.equal(ticket.windowRegainedFocus, true);
  assert.equal(ticket.perDocumentActiveElement, true);
  assert.equal(ticket.visibilityIsVisibleOnly, true);
  assert.equal(ticket.panelActiveOmitted, true);
  assert.equal(classify(ticket), "hunting");
});

test("score / decide / handle agree on hunting vs traced", () => {
  assert.equal(score(seedHunting()).verdict, "hunting");
  assert.equal(decide(seedTraced()).verdict, "traced");
  const fail = handle(seedHunting());
  const hold = handle(seedTraced());
  assert.match(fail.hookSpecificOutput.additionalContext, /#90936/);
  assert.match(hold.hookSpecificOutput.additionalContext, /traced/i);
});

test("decideSeed aliases", () => {
  assert.equal(decideSeed("hunting").verdict, "hunting");
  assert.equal(decideSeed(90936).verdict, "hunting");
  assert.equal(decideSeed("90936").verdict, "hunting");
  assert.equal(decideSeed("traced").verdict, "traced");
});

test("CLI scores data files", () => {
  const hunting = spawnSync(
    process.execPath,
    [hookPath(), fileURLToPath(new URL("../data/hunting.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(hunting.status, 0, hunting.stderr);
  assert.equal(JSON.parse(hunting.stdout).verdict, "hunting");

  const traced = spawnSync(
    process.execPath,
    [hookPath(), fileURLToPath(new URL("../data/traced.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(traced.status, 0, traced.stderr);
  assert.equal(JSON.parse(traced.stdout).verdict, "traced");
});

test("constants match the issue facts only", () => {
  assert.equal(FEATURED_ISSUE, 90936);
  assert.deepEqual([...PRIMARY_ISSUES], [90936]);
  assert.deepEqual([...SAME_CLASS], [71809, 79770, 89975, 32726, 74808]);
  assert.equal(REPORTER, "HwangYoonSeong");
  assert.equal(FILED_AT, "2026-08-31T08:44:35Z");
  assert.equal(EXTENSION, "anthropic.claude-code");
  assert.equal(EXTENSION_VERSION, "2.1.251");
  assert.equal(VSCODE, "1.134.0");
  assert.equal(OS_NAME, "macOS arm64");
  assert.equal(IDLE_WORD, "traced");
  assert.equal(SEEDED_WORD, "hunting");
  assert.notEqual(IDLE_WORD, "hunting");
  assert.notEqual(IDLE_WORD, "trammel");
  assert.deepEqual([...HOLD_VERDICTS], ["traced"]);
  assert.ok(ALARM_VERDICTS.includes("hunting"));
  assert.ok(!ALARM_VERDICTS.includes("traced"));
  assert.deepEqual([...VERDICTS], [...CHIPS]);
  assert.equal(VERDICTS.length, 12);
  assert.deepEqual(
    [...LABELS],
    ["bug", "has repro", "platform:macos", "area:ide", "platform:vscode"],
  );
  assert.match(TITLE, /focus ping-pongs between two visible Claude panels/);
  assert.match(ISSUE_URL, /90936/);
  assert.match(PHRASE, /hunting trammel is not a hold/i);
  assert.match(HUB_LINE, /18:50 trammel/);
  assert.match(MARK, /18:50/);
  assert.match(MARK, /#92/);
  assert.match(MARK, /#90936/);
  assert.match(CONTRAST_NOTE, /same editor group/);
  assert.ok(NOT_PRODUCTS.includes("soundpost"));
  assert.ok(NOT_PRODUCTS.includes("flong"));
  assert.ok(NOT_PRODUCTS.includes("bulla"));
  assert.ok(NOT_PRODUCTS.includes("census"));
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(IDLE_WORD, word);
  }
});

test("chips.json and fingerprints stay aligned", () => {
  const chips = readData("chips.json");
  assert.deepEqual(chips.verdicts, [...VERDICTS]);
  assert.equal(chips.idleWord, "traced");
  const fp = readData("fingerprints.json");
  assert.equal(fp.primary, 90936);
  assert.equal(fp.extension, "anthropic.claude-code");
  assert.equal(fp.extensionVersion, "2.1.251");
  assert.equal(fp.vscode, "1.134.0");
  const contrast = readData("contrast.json");
  assert.match(contrast.workaround.result, /only one tab per group is visible/);
  assert.equal(contrast.sameClass.originalPingPong, 71809);
  assert.equal(contrast.sameClass.windowsSplit, 89975);
});

test("chipsOf on a raw hunting ticket still marks steal-loop", () => {
  const chips = chipsOf({
    twoVisiblePanels: true,
    windowRegainedFocus: true,
    perDocumentActiveElement: true,
    visibilityIsVisibleOnly: true,
    panelActiveOmitted: true,
    timeoutOffset: true,
    sameEditorGroup: false,
    inputFlicker: true,
    typingImpossible: true,
    activePanelRestoresOnly: false,
  });
  assert.ok(chips.includes("hunting"));
  assert.ok(chips.includes("steal-loop"));
  assert.ok(chips.includes("body-guard"));
  assert.ok(!chips.includes("traced"));
});

test("same-group contrast does not hunt", () => {
  const result = analyze({
    twoVisiblePanels: false,
    sameEditorGroup: true,
    windowRegainedFocus: true,
    perDocumentActiveElement: true,
    visibilityIsVisibleOnly: true,
    panelActiveOmitted: true,
    timeoutOffset: true,
    activePanelRestoresOnly: false,
  });
  assert.notEqual(result.verdict, "hunting");
  assert.ok(result.reasons.some((row) => /same editor group/i.test(row)));
});

test("living page is a drafting trammel / split-sash desk, idle traced, seeded hunting", () => {
  const html = readPage();
  assert.match(html, /Idle word:\s*traced/);
  assert.match(html, /traced/);
  assert.match(html, /hunting/);
  assert.match(html, /visible-not-active/);
  assert.match(html, /per-document/);
  assert.match(html, /body-guard/);
  assert.match(html, /timeout-offset/);
  assert.match(html, /steal-loop/);
  assert.match(html, /iframe-focus/);
  assert.match(html, /no-isActive/);
  assert.match(html, /dual-visible/);
  assert.match(html, /flicker/);
  assert.match(html, /#90936/);
  assert.match(html, /#71809/);
  assert.match(html, /#79770/);
  assert.match(html, /#89975/);
  assert.match(html, /#32726/);
  assert.match(html, /#74808/);
  assert.match(html, /18:50/);
  assert.match(html, /catalog #92/);
  assert.match(html, /2\.1\.251/);
  assert.match(html, /1\.134\.0/);
  assert.match(html, /HwangYoonSeong/);
  assert.match(html, /Newsreader/);
  assert.match(html, /Sora/);
  assert.match(html, /Red\+Hat\+Mono|Red Hat Mono/);
  assert.match(html, /Score the grooves/);
  assert.match(html, /Pin idle traced/);
  assert.match(html, /Pin seeded hunting/);
  assert.match(html, /Regain the sash/);
  assert.match(html, /trammel/i);
  assert.match(html, /ellipse/i);
  assert.match(html, /composer/i);
  assert.doesNotMatch(html, /Idle word:\s*hunting/i);
  assert.doesNotMatch(html, /Idle word:\s*trammel/i);
  assert.doesNotMatch(html, /Idle word:\s*coupled/);
  assert.doesNotMatch(html, /Idle word:\s*struck/);
  assert.doesNotMatch(html, /Idle word:\s*seated/);
  assert.doesNotMatch(html, /Score the plates/);
  assert.doesNotMatch(html, /Lay idle coupled/);
  assert.doesNotMatch(html, /family=Fraunces/);
  assert.doesNotMatch(html, /family=Source\+Sans/);
  assert.doesNotMatch(html, /family=IBM\+Plex\+Mono/);
  assert.doesNotMatch(html, /family=Barlow/);
  assert.doesNotMatch(html, /family=Spline/);
  assert.doesNotMatch(html, /family=Cormorant/);
  assert.doesNotMatch(html, /family=Playfair/);
  assert.doesNotMatch(html, /family=Cinzel/);
  assert.doesNotMatch(html, /luthier cutaway/);
  assert.doesNotMatch(html, /composing-stone/);
  assert.doesNotMatch(html, /papal lead/);
  assert.doesNotMatch(html, /hide-glue/);
});
