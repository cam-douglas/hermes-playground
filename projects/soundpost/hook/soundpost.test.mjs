import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ALARM_VERDICTS,
  CCD,
  CHIPS,
  CLI_LSP_COUNT,
  COMMAND_COUNT,
  CONTRAST_ISSUES,
  CSHARP_LS,
  DESKTOP,
  FEATURED_ISSUE,
  FILED_AT,
  FORBIDDEN_IDLE,
  HOLD_VERDICTS,
  HUB_LINE,
  IDLE_WORD,
  ISSUE_URL,
  LABELS,
  LOC,
  MARK,
  NODE,
  NOT_PRODUCTS,
  OFFICIAL_LSP_COUNT,
  OS_NAME,
  PHRASE,
  PLUGIN,
  PLUGIN_ERRORS,
  PLUGIN_VERSION,
  PRIMARY_ISSUES,
  REPORTER,
  SAME_CLASS,
  SDK_PLUGIN_COUNT,
  SEEDED_WORD,
  SYNTHESIS_DROPPED,
  SYNTHESIS_KEPT,
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
  seedCoupled,
  seedFallen,
} from "./soundpost.mjs";

function readData(name) {
  return JSON.parse(
    readFileSync(fileURLToPath(new URL(`../data/${name}`, import.meta.url)), "utf8")
  );
}

function readPage() {
  return readFileSync(fileURLToPath(new URL("../index.html", import.meta.url)), "utf8");
}

function hookPath() {
  return fileURLToPath(new URL("./soundpost.mjs", import.meta.url));
}

test("idle coupled is a hold; plates couple", () => {
  const result = analyze(seedCoupled());
  assert.equal(result.verdict, "coupled");
  assert.equal(result.idleWord, "coupled");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.fallen, false);
  assert.ok(result.chips.includes("coupled"));
  assert.ok(result.chips.includes("cli-resolved"));
  assert.ok(!result.chips.includes("fallen"));
  assert.ok(!result.chips.includes("zero-log"));
  assert.doesNotMatch(result.idleWord, /soundpost|seated|mute|silent|empty|fallen|sounder|reed|lsp|plugin/i);
});

test("empty ticket and empty stdin classify coupled", () => {
  assert.equal(classify(emptyTicket()), "coupled");
  assert.equal(classify(""), "coupled");
  assert.equal(classify(null), "coupled");
  assert.equal(decideSeed("coupled").verdict, "coupled");
});

test("seeded fallen #90926 is alarm with the Desktop-deaf chips", () => {
  const result = analyze(seedFallen());
  assert.equal(result.verdict, "fallen");
  assert.equal(result.alarm, true);
  assert.equal(result.hold, false);
  assert.ok(result.chips.includes("fallen"));
  assert.ok(result.chips.includes("mute"));
  assert.ok(result.chips.includes("advertised"));
  assert.ok(result.chips.includes("cli-resolved"));
  assert.ok(result.chips.includes("desktop-deaf"));
  assert.ok(result.chips.includes("zero-log"));
  assert.ok(result.chips.includes("toolsearch-miss"));
  assert.ok(result.chips.includes("no-process"));
  assert.ok(result.chips.includes("synthesis-drop"));
  assert.ok(result.chips.includes("plates-uncoupled"));
  assert.ok(result.chips.includes("healthy-lie"));
  assert.match(result.contrast.belly, /LSP servers \(1\)/);
  assert.match(result.contrast.back, /LSP✘/);
  assert.equal(result.contrast.post, "fallen");
});

test("data fixtures classify coupled vs fallen vs named chips", () => {
  assert.equal(classify(readData("coupled.json")), "coupled");
  assert.equal(classify(readData("fallen.json")), "fallen");
  assert.equal(classify(readData("90926.json")), "fallen");
  assert.equal(classify(readData("mute.json")), "mute");
  assert.equal(classify(readData("advertised.json")), "advertised");
  assert.equal(classify(readData("cli-resolved.json")), "cli-resolved");
  assert.equal(classify(readData("desktop-deaf.json")), "desktop-deaf");
  assert.equal(classify(readData("zero-log.json")), "zero-log");
  assert.equal(classify(readData("toolsearch-miss.json")), "toolsearch-miss");
  assert.equal(classify(readData("no-process.json")), "no-process");
  assert.equal(classify(readData("synthesis-drop.json")), "synthesis-drop");
  assert.equal(classify(readData("plates-uncoupled.json")), "plates-uncoupled");
  assert.equal(classify(readData("healthy-lie.json")), "healthy-lie");
});

test("fallen seed is alarm; coupled seed is hold", () => {
  assert.equal(score(seedFallen()).alarm, true);
  assert.equal(score(seedFallen()).hold, false);
  assert.equal(score(seedCoupled()).hold, true);
  assert.equal(score(seedCoupled()).alarm, false);
});

test("normalize seeds 90926 without ticket fields", () => {
  const ticket = normalize({ issue: 90926 });
  assert.equal(ticket.cliLspCount, 1);
  assert.equal(ticket.toolSearchLsp, false);
  assert.equal(classify(ticket), "fallen");
});

test("score / decide / handle agree on fallen vs coupled", () => {
  assert.equal(score(seedFallen()).verdict, "fallen");
  assert.equal(decide(seedCoupled()).verdict, "coupled");
  const fail = handle(seedFallen());
  const hold = handle(seedCoupled());
  assert.match(fail.hookSpecificOutput.additionalContext, /#90926/);
  assert.match(hold.hookSpecificOutput.additionalContext, /coupled/i);
});

test("decideSeed aliases", () => {
  assert.equal(decideSeed("fallen").verdict, "fallen");
  assert.equal(decideSeed(90926).verdict, "fallen");
  assert.equal(decideSeed("90926").verdict, "fallen");
  assert.equal(decideSeed("coupled").verdict, "coupled");
});

test("CLI scores data files", () => {
  const fallen = spawnSync(
    process.execPath,
    [hookPath(), fileURLToPath(new URL("../data/fallen.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(fallen.status, 0, fallen.stderr);
  assert.equal(JSON.parse(fallen.stdout).verdict, "fallen");

  const coupled = spawnSync(
    process.execPath,
    [hookPath(), fileURLToPath(new URL("../data/coupled.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(coupled.status, 0, coupled.stderr);
  assert.equal(JSON.parse(coupled.stdout).verdict, "coupled");
});

test("constants match the issue facts only", () => {
  assert.equal(FEATURED_ISSUE, 90926);
  assert.deepEqual([...PRIMARY_ISSUES], [90926]);
  assert.deepEqual([...SAME_CLASS], [78604, 84857, 90114, 15148, 86936]);
  assert.deepEqual([...CONTRAST_ISSUES], [75237, 78099]);
  assert.equal(REPORTER, "volkovprojects");
  assert.equal(FILED_AT, "2026-08-31T07:46:31Z");
  assert.equal(DESKTOP, "1.40609.0");
  assert.equal(CCD, "2.1.247");
  assert.equal(NODE, "24.18.1");
  assert.equal(OS_NAME, "Windows 10 Pro 19045");
  assert.equal(PLUGIN, "csharp-lsp@claude-plugins-official");
  assert.equal(PLUGIN_VERSION, "1.0.0");
  assert.equal(CSHARP_LS, "0.27.0");
  assert.equal(CLI_LSP_COUNT, 1);
  assert.equal(SDK_PLUGIN_COUNT, 10);
  assert.equal(COMMAND_COUNT, 99);
  assert.equal(PLUGIN_ERRORS, 0);
  assert.equal(OFFICIAL_LSP_COUNT, 12);
  assert.equal(LOC, 80000);
  assert.deepEqual([...SYNTHESIS_KEPT], ["name", "description", "version", "author"]);
  assert.deepEqual([...SYNTHESIS_DROPPED], ["category", "strict", "lspServers"]);
  assert.equal(IDLE_WORD, "coupled");
  assert.equal(SEEDED_WORD, "fallen");
  assert.notEqual(IDLE_WORD, "seated");
  assert.deepEqual([...HOLD_VERDICTS], ["coupled"]);
  assert.ok(ALARM_VERDICTS.includes("fallen"));
  assert.deepEqual([...VERDICTS], [...CHIPS]);
  assert.deepEqual(
    [...LABELS],
    ["bug", "has repro", "platform:windows", "area:lsp", "area:plugins", "area:desktop"],
  );
  assert.match(TITLE, /never registers plugin LSP servers/);
  assert.match(ISSUE_URL, /90926/);
  assert.match(PHRASE, /fallen post is not a hold/i);
  assert.match(HUB_LINE, /17:50 soundpost/);
  assert.match(MARK, /17:50/);
  assert.match(MARK, /#91/);
  assert.match(MARK, /#90926/);
  assert.ok(NOT_PRODUCTS.includes("reed"));
  assert.ok(NOT_PRODUCTS.includes("sounder"));
  assert.ok(NOT_PRODUCTS.includes("census"));
  assert.ok(NOT_PRODUCTS.includes("flong"));
  assert.ok(NOT_PRODUCTS.includes("callboard"));
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(IDLE_WORD, word);
  }
});

test("chips.json and fingerprints stay aligned", () => {
  const chips = readData("chips.json");
  assert.deepEqual(chips.verdicts, [...VERDICTS]);
  assert.equal(chips.idleWord, "coupled");
  const fp = readData("fingerprints.json");
  assert.equal(fp.primary, 90926);
  assert.equal(fp.cliLspCount, 1);
  assert.equal(fp.sdkPluginCount, 10);
  assert.equal(fp.officialLspCount, 12);
  const contrast = readData("contrast.json");
  assert.match(contrast.belly.result, /LSP servers \(1\)/);
  assert.match(contrast.back.result, /LSP✘/);
  assert.deepEqual(contrast.opposite.spawnThenDisconnect, 75237);
});

test("chipsOf on a raw fallen ticket still marks healthy-lie", () => {
  const chips = chipsOf({
    cliLspCount: 1,
    toolSearchLsp: false,
    processAlive: false,
    lspLogLines: 0,
    pluginErrors: 0,
    synthesisDropped: false,
  });
  assert.ok(chips.includes("fallen"));
  assert.ok(chips.includes("healthy-lie"));
  assert.ok(!chips.includes("synthesis-drop"));
  assert.ok(!chips.includes("coupled"));
});

test("living page is a luthier soundbox, idle coupled, seeded fallen", () => {
  const html = readPage();
  assert.match(html, /Idle word:\s*coupled/);
  assert.match(html, /coupled/);
  assert.match(html, /fallen/);
  assert.match(html, /mute/);
  assert.match(html, /advertised/);
  assert.match(html, /cli-resolved/);
  assert.match(html, /desktop-deaf/);
  assert.match(html, /zero-log/);
  assert.match(html, /toolsearch-miss/);
  assert.match(html, /no-process/);
  assert.match(html, /synthesis-drop/);
  assert.match(html, /plates-uncoupled/);
  assert.match(html, /healthy-lie/);
  assert.match(html, /#90926/);
  assert.match(html, /#78604/);
  assert.match(html, /#84857/);
  assert.match(html, /#90114/);
  assert.match(html, /#15148/);
  assert.match(html, /#86936/);
  assert.match(html, /#75237/);
  assert.match(html, /#78099/);
  assert.match(html, /17:50/);
  assert.match(html, /catalog #91/);
  assert.match(html, /1\.40609\.0/);
  assert.match(html, /2\.1\.247/);
  assert.match(html, /24\.18\.1/);
  assert.match(html, /volkovprojects/);
  assert.match(html, /csharp-lsp/);
  assert.match(html, /csharp-ls/);
  assert.match(html, /0\.27\.0/);
  assert.match(html, /80k|80000/);
  assert.match(html, /Fraunces/);
  assert.match(html, /Source\+Sans|Source Sans/);
  assert.match(html, /IBM\+Plex\+Mono|IBM Plex Mono/);
  assert.match(html, /Score the plates/);
  assert.match(html, /soundpost/);
  assert.match(html, /f-hole|fhole/i);
  assert.match(html, /hide-glue|glue pot/i);
  assert.doesNotMatch(html, /Idle word:\s*seated/i);
  assert.doesNotMatch(html, /Idle word:\s*soundpost/i);
  assert.doesNotMatch(html, /Idle word:\s*struck/);
  assert.doesNotMatch(html, /Idle word:\s*tallied/);
  assert.doesNotMatch(html, /family=Barlow/);
  assert.doesNotMatch(html, /family=Spline/);
  assert.doesNotMatch(html, /family=Cormorant/);
  assert.doesNotMatch(html, /family=Playfair/);
  assert.doesNotMatch(html, /family=Cinzel/);
  assert.doesNotMatch(html, /family=Special\+Elite/);
  assert.doesNotMatch(html, /telegraph night desk/);
  assert.doesNotMatch(html, /composing-stone/);
  assert.doesNotMatch(html, /first-run empty/);
  assert.doesNotMatch(html, /LocalPluginsReader/);
});
