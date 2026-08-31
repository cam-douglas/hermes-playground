import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ALARM_VERDICTS,
  CHIPS,
  CLI_VERSION,
  CONTRAST_NOTE,
  FEATURED_ISSUE,
  FILED_AT,
  FORBIDDEN_IDLE,
  HOLD_VERDICTS,
  HUB_LINE,
  HYPOTHESIS_NOTE,
  IDLE_WORD,
  INVOKE_FORM,
  ISSUE_URL,
  LABELS,
  LOCAL_PATH,
  MARK,
  META_NAME,
  NOT_PRODUCTS,
  PERSISTED_SCRIPT,
  PHRASE,
  PLATFORM,
  PRIMARY_ISSUES,
  REPORTER,
  SAME_CLASS,
  SEEDED_WORD,
  TITLE,
  TOOL_DESCRIPTION,
  VERDICTS,
  WORKFLOW_NAME,
  analyze,
  chipsOf,
  classify,
  decide,
  decideSeed,
  emptyTicket,
  handle,
  normalize,
  score,
  seedPresented,
  seedReserved,
  seedVacant,
} from "./advowson.mjs";

function readData(name) {
  return JSON.parse(
    readFileSync(fileURLToPath(new URL(`../data/${name}`, import.meta.url)), "utf8"),
  );
}

function readPage() {
  return readFileSync(fileURLToPath(new URL("../index.html", import.meta.url)), "utf8");
}

function hookPath() {
  return fileURLToPath(new URL("./advowson.mjs", import.meta.url));
}

test("idle vacant is a hold; no silent override", () => {
  const result = analyze(seedVacant());
  assert.equal(result.verdict, "vacant");
  assert.equal(result.idleWord, "vacant");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.reserved, false);
  assert.ok(result.chips.includes("vacant"));
  assert.ok(!result.chips.includes("reserved"));
  assert.ok(!result.chips.includes("built-in-wins"));
  assert.doesNotMatch(
    result.idleWord,
    /reserved|collated|advowson|built-in|silent|presentation|smutch|plain|seated|bound|hallmarked|pointed|collapsed|spoiled|banked|misstruck|hunting|traced/i,
  );
});

test("empty ticket and empty stdin classify vacant", () => {
  assert.equal(classify(emptyTicket()), "vacant");
  assert.equal(classify(""), "vacant");
  assert.equal(classify(null), "vacant");
  assert.equal(decideSeed("vacant").verdict, "vacant");
});

test("seeded reserved #91005 is alarm with the registry chips", () => {
  const result = analyze(seedReserved());
  assert.equal(result.verdict, "reserved");
  assert.equal(result.alarm, true);
  assert.equal(result.hold, false);
  assert.ok(result.chips.includes("reserved"));
  assert.ok(result.chips.includes("collated"));
  assert.ok(result.chips.includes("built-in-wins"));
  assert.ok(result.chips.includes("local-ignored"));
  assert.ok(result.chips.includes("marker-missing"));
  assert.ok(result.chips.includes("summary-echo"));
  assert.ok(result.chips.includes("skill-hardcode"));
  assert.ok(result.chips.includes("name-vs-path"));
  assert.ok(result.chips.includes("no-warning"));
  assert.ok(result.chips.includes("deep-research-override"));
  assert.ok(result.chips.includes("silent-collation"));
  assert.ok(!result.chips.includes("vacant"));
  assert.ok(!result.chips.includes("presented"));
  assert.ok(!result.chips.includes("scriptPath-ok"));
  assert.match(result.contrast.living, /reserved to the built-in/);
  assert.match(result.contrast.presentation, /deep-research\.js/);
  assert.match(result.contrast.collation, /silent-collates/);
  assert.match(result.contrast.warning, /no warning/);
});

test("presented / scriptPath is a hold", () => {
  const result = analyze(seedPresented());
  assert.equal(result.verdict, "presented");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.ok(result.chips.includes("presented"));
  assert.ok(result.chips.includes("scriptPath-ok"));
  assert.ok(!result.chips.includes("reserved"));
  assert.ok(!result.chips.includes("vacant"));
});

test("data fixtures classify vacant vs reserved vs named chips", () => {
  assert.equal(classify(readData("vacant.json")), "vacant");
  assert.equal(classify(readData("reserved.json")), "reserved");
  assert.equal(classify(readData("91005.json")), "reserved");
  assert.equal(classify(readData("presented.json")), "presented");
  assert.equal(classify(readData("collated.json")), "collated");
  assert.equal(classify(readData("built-in-wins.json")), "built-in-wins");
  assert.equal(classify(readData("local-ignored.json")), "local-ignored");
  assert.equal(classify(readData("scriptPath-ok.json")), "scriptPath-ok");
  assert.equal(classify(readData("marker-missing.json")), "marker-missing");
  assert.equal(classify(readData("summary-echo.json")), "summary-echo");
  assert.equal(classify(readData("skill-hardcode.json")), "skill-hardcode");
  assert.equal(classify(readData("name-vs-path.json")), "name-vs-path");
  assert.equal(classify(readData("no-warning.json")), "no-warning");
  assert.equal(classify(readData("deep-research-override.json")), "deep-research-override");
  assert.equal(classify(readData("silent-collation.json")), "silent-collation");
});

test("reserved seed is alarm; vacant and presented seeds are hold", () => {
  assert.equal(score(seedReserved()).alarm, true);
  assert.equal(score(seedReserved()).hold, false);
  assert.equal(score(seedVacant()).hold, true);
  assert.equal(score(seedVacant()).alarm, false);
  assert.equal(score(seedPresented()).hold, true);
  assert.equal(score(seedPresented()).alarm, false);
});

test("normalize seeds 91005 without ticket fields", () => {
  const ticket = normalize({ issue: 91005 });
  assert.equal(ticket.localExists, true);
  assert.equal(ticket.resolvedBuiltin, true);
  assert.equal(ticket.invokedByName, true);
  assert.equal(ticket.markerInLocal, true);
  assert.equal(ticket.markerInSummary, false);
  assert.equal(classify(ticket), "reserved");
});

test("score / decide / handle agree on reserved vs vacant", () => {
  assert.equal(score(seedReserved()).verdict, "reserved");
  assert.equal(decide(seedVacant()).verdict, "vacant");
  const fail = handle(seedReserved());
  const hold = handle(seedVacant());
  const side = handle(seedPresented());
  assert.match(fail.hookSpecificOutput.additionalContext, /#91005/);
  assert.match(hold.hookSpecificOutput.additionalContext, /vacant/i);
  assert.match(side.hookSpecificOutput.additionalContext, /scriptPath|presented/i);
});

test("decideSeed aliases", () => {
  assert.equal(decideSeed("reserved").verdict, "reserved");
  assert.equal(decideSeed(91005).verdict, "reserved");
  assert.equal(decideSeed("91005").verdict, "reserved");
  assert.equal(decideSeed("vacant").verdict, "vacant");
  assert.equal(decideSeed("presented").verdict, "presented");
  assert.equal(decideSeed("scriptPath-ok").verdict, "presented");
});

test("CLI scores data files", () => {
  const reserved = spawnSync(
    process.execPath,
    [hookPath(), fileURLToPath(new URL("../data/reserved.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(reserved.status, 0, reserved.stderr);
  assert.equal(JSON.parse(reserved.stdout).verdict, "reserved");

  const vacant = spawnSync(
    process.execPath,
    [hookPath(), fileURLToPath(new URL("../data/vacant.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(vacant.status, 0, vacant.stderr);
  assert.equal(JSON.parse(vacant.stdout).verdict, "vacant");

  const presented = spawnSync(
    process.execPath,
    [hookPath(), fileURLToPath(new URL("../data/scriptPath-ok.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(presented.status, 0, presented.stderr);
  assert.equal(JSON.parse(presented.stdout).verdict, "scriptPath-ok");
  assert.equal(JSON.parse(presented.stdout).hold, true);
});

test("constants match the issue facts only", () => {
  assert.equal(FEATURED_ISSUE, 91005);
  assert.deepEqual([...PRIMARY_ISSUES], [91005]);
  assert.deepEqual([...SAME_CLASS], [79019, 75086]);
  assert.equal(REPORTER, "Habriel");
  assert.equal(FILED_AT, "2026-08-31T14:59:44Z");
  assert.equal(CLI_VERSION, "2.1.215");
  assert.equal(PLATFORM, "linux");
  assert.equal(WORKFLOW_NAME, "deep-research");
  assert.equal(LOCAL_PATH, "~/.claude/workflows/deep-research.js");
  assert.equal(META_NAME, "deep-research");
  assert.equal(PERSISTED_SCRIPT, "workflows/scripts/deep-research-.js");
  assert.match(TOOL_DESCRIPTION, /built-in or from \.claude\/workflows\//);
  assert.match(INVOKE_FORM, /Workflow\(\{ name: "deep-research" \}\)/);
  assert.equal(IDLE_WORD, "vacant");
  assert.equal(SEEDED_WORD, "reserved");
  assert.notEqual(IDLE_WORD, "reserved");
  assert.notEqual(IDLE_WORD, "collated");
  assert.notEqual(IDLE_WORD, "advowson");
  assert.deepEqual([...HOLD_VERDICTS], ["vacant", "presented", "scriptPath-ok"]);
  assert.ok(ALARM_VERDICTS.includes("reserved"));
  assert.ok(ALARM_VERDICTS.includes("silent-collation"));
  assert.ok(!ALARM_VERDICTS.includes("vacant"));
  assert.ok(!ALARM_VERDICTS.includes("presented"));
  assert.deepEqual([...VERDICTS], [...CHIPS]);
  assert.equal(VERDICTS.length, 14);
  assert.deepEqual(
    [...LABELS],
    ["bug", "has-repro", "platform:linux", "area:tools"],
  );
  assert.match(TITLE, /silently resolves to the built-in/);
  assert.match(ISSUE_URL, /91005/);
  assert.match(PHRASE, /reserved living that silent-collates the built-in is not a hold/i);
  assert.match(HUB_LINE, /00:50 advowson/);
  assert.match(HUB_LINE, /admit vacant/);
  assert.match(MARK, /00:50/);
  assert.match(MARK, /#98/);
  assert.match(MARK, /#91005/);
  assert.match(CONTRAST_NOTE, /SILENT BUILT-IN COLLATION/);
  assert.match(HYPOTHESIS_NOTE, /right of presentation/);
  assert.ok(NOT_PRODUCTS.includes("smutch"));
  assert.ok(NOT_PRODUCTS.includes("bitting"));
  assert.ok(NOT_PRODUCTS.includes("puncheon"));
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(IDLE_WORD, word);
  }
});

test("chips.json and fingerprints stay aligned", () => {
  const chips = readData("chips.json");
  assert.deepEqual(chips.verdicts, [...VERDICTS]);
  assert.equal(chips.idleWord, "vacant");
  assert.equal(chips.seededWord, "reserved");
  const fp = readData("fingerprints.json");
  assert.equal(fp.primary, 91005);
  assert.equal(fp.workflowName, "deep-research");
  assert.equal(fp.localPath, "~/.claude/workflows/deep-research.js");
  assert.equal(fp.persistedScript, "workflows/scripts/deep-research-.js");
  assert.equal(fp.cliVersion, "2.1.215");
  assert.deepEqual(fp.sameClass, [79019, 75086]);
  const fixtures = readData("fixtures.json");
  assert.equal(fixtures.rows.length, 5);
  assert.equal(fixtures.rows[0].invoke, 'Workflow({name: "deep-research"})');
  assert.equal(fixtures.rows[1].path, "~/.claude/workflows/deep-research.js");
  assert.equal(fixtures.rows[2].invoke, 'Workflow({scriptPath})');
  assert.equal(fixtures.narrativeNotFixture.workflowName, "deep-research");
});

test("chipsOf on a raw reserved ticket still marks local-ignored", () => {
  const chips = chipsOf({
    localExists: true,
    builtinExists: true,
    invokedByName: true,
    invokedByScriptPath: false,
    resolvedBuiltin: true,
    resolvedLocal: false,
    markerInLocal: true,
    markerInSummary: false,
    persistedBuiltinSchema: true,
    noWarning: true,
    skillHardcode: true,
    vacantHold: false,
    outputText:
      'Workflow({name: "deep-research"}) silently resolves to the built-in; ~/.claude/workflows/deep-research.js exists; marker in local meta.description never appears in Summary; workflows/scripts/deep-research-.js original built-in schema; no error, no warning; Invoke: Workflow({ name: "deep-research" }); silent-collation',
  });
  assert.ok(chips.includes("reserved"));
  assert.ok(chips.includes("local-ignored"));
  assert.ok(chips.includes("built-in-wins"));
  assert.ok(chips.includes("marker-missing"));
  assert.ok(chips.includes("silent-collation"));
  assert.ok(!chips.includes("vacant"));
});

test("named local-ignored is not a full reserved living", () => {
  const result = analyze({
    seed: "local-ignored",
    localExists: true,
    resolvedBuiltin: true,
    resolvedLocal: false,
    invokedByName: true,
    vacantHold: false,
    outputText: "local-ignored: ~/.claude/workflows/deep-research.js exists but name resolution ignores it",
  });
  assert.notEqual(result.verdict, "reserved");
  assert.equal(result.verdict, "local-ignored");
  assert.ok(result.reasons.some((row) => /local/i.test(row)));
});

test("name hit built-in while local existed → reserved; scriptPath used local → presented; no conflict → vacant", () => {
  assert.equal(
    classify({
      localExists: true,
      builtinExists: true,
      invokedByName: true,
      resolvedBuiltin: true,
      resolvedLocal: false,
      vacantHold: false,
      outputText: "name hit built-in while local existed",
    }),
    "reserved",
  );
  assert.equal(
    classify({
      localExists: true,
      builtinExists: true,
      invokedByScriptPath: true,
      resolvedLocal: true,
      resolvedBuiltin: false,
      vacantHold: false,
      outputText: "Workflow({scriptPath}) presented the local letters; local override used",
    }),
    "presented",
  );
  assert.equal(
    classify({
      localExists: false,
      builtinExists: false,
      vacantHold: true,
      outputText: "living vacant; no local letters; no silent override",
    }),
    "vacant",
  );
});

test("living page is a diocesan registry, idle vacant, seeded reserved", () => {
  const html = readPage();
  assert.match(html, /Idle word:\s*vacant/);
  assert.match(html, /vacant/);
  assert.match(html, /reserved/);
  assert.match(html, /presented/);
  assert.match(html, /collated/);
  assert.match(html, /built-in-wins/);
  assert.match(html, /local-ignored/);
  assert.match(html, /scriptPath-ok/);
  assert.match(html, /marker-missing/);
  assert.match(html, /summary-echo/);
  assert.match(html, /skill-hardcode/);
  assert.match(html, /name-vs-path/);
  assert.match(html, /no-warning/);
  assert.match(html, /deep-research-override/);
  assert.match(html, /silent-collation/);
  assert.match(html, /#91005/);
  assert.match(html, /#79019/);
  assert.match(html, /#75086/);
  assert.match(html, /00:50/);
  assert.match(html, /catalog #98/);
  assert.match(html, /Habriel/);
  assert.match(html, /deep-research/);
  assert.match(html, /\.claude\/workflows/);
  assert.match(html, /scriptPath/);
  assert.match(html, /Cormorant/);
  assert.match(html, /Karla/);
  assert.match(html, /Roboto\+Mono|Roboto Mono/);
  assert.match(html, /Score the presentation/);
  assert.match(html, /Pin idle vacant/);
  assert.match(html, /Pin seeded reserved/);
  assert.match(html, /Admit vacant/);
  assert.match(html, /Load fixtures/);
  assert.match(html, /Reset to vacant/);
  assert.match(html, /advowson/i);
  assert.match(html, /registry/i);
  assert.match(html, /parchment/i);
  assert.match(html, /wax/i);
  assert.match(html, /presentation/i);
  assert.match(html, /collation/i);
  assert.doesNotMatch(html, /Idle word:\s*reserved/i);
  assert.doesNotMatch(html, /Idle word:\s*collated/i);
  assert.doesNotMatch(html, /Idle word:\s*plain/);
  assert.doesNotMatch(html, /Idle word:\s*seated/);
  assert.doesNotMatch(html, /Idle word:\s*bound/);
  assert.doesNotMatch(html, /Idle word:\s*hallmarked/);
  assert.doesNotMatch(html, /Idle word:\s*smutched/);
  assert.doesNotMatch(html, /Pin idle plain/);
  assert.doesNotMatch(html, /Pin idle seated/);
  assert.doesNotMatch(html, /Pin seeded smutched/);
  assert.doesNotMatch(html, /Pin seeded bound/);
  assert.doesNotMatch(html, /Score the smutch/);
  assert.doesNotMatch(html, /Score the bitting/);
  assert.doesNotMatch(html, /Score the gold/);
  assert.doesNotMatch(html, /Score the gnomon/);
  assert.doesNotMatch(html, /Score the spoil/);
  assert.doesNotMatch(html, /Score the grooves/);
  assert.doesNotMatch(html, /family=Fraunces/);
  assert.doesNotMatch(html, /family=DM\+Sans/);
  assert.doesNotMatch(html, /family=IBM\+Plex/);
  assert.doesNotMatch(html, /family=Libre\+Bodoni/);
  assert.doesNotMatch(html, /family=Figtree/);
  assert.doesNotMatch(html, /family=JetBrains/);
  assert.doesNotMatch(html, /family=Cinzel/);
  assert.doesNotMatch(html, /family=Outfit/);
  assert.doesNotMatch(html, /family=Spline/);
  assert.doesNotMatch(html, /family=Libre\+Baskerville/);
  assert.doesNotMatch(html, /family=IBM\+Plex\+Sans/);
  assert.doesNotMatch(html, /family=Space\+Mono/);
  assert.doesNotMatch(html, /family=Instrument/);
  assert.doesNotMatch(html, /family=Source\+Serif/);
  assert.doesNotMatch(html, /family=Newsreader/);
  assert.doesNotMatch(html, /family=Sora/);
  assert.doesNotMatch(html, /family=Red\+Hat\+Mono/);
  assert.doesNotMatch(html, /goldsmith/);
  assert.doesNotMatch(html, /observatory/i);
  assert.doesNotMatch(html, /sundial/i);
  assert.doesNotMatch(html, /spoil tip/i);
  assert.doesNotMatch(html, /drafting trammel/i);
  assert.doesNotMatch(html, /composing-stone/);
  assert.doesNotMatch(html, /papal lead/);
  assert.doesNotMatch(html, /felt-green/);
  assert.doesNotMatch(html, /pin-tumbler/);
  assert.doesNotMatch(html, /blotter/i);
  assert.doesNotMatch(html, /binder/i);
});
