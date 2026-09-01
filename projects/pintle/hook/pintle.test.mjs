import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ALARM_VERDICTS,
  ABSOLUTE_HOOK,
  ANCHORED_HOOK,
  BANNED_NAMES,
  CHIPS,
  CLAUDE_COUSINS,
  CLAUDE_VERSION,
  CODEX_COUSIN,
  CODEX_COUSINS,
  CONTRAST_NOTE,
  COUSINS,
  COUSIN_ISSUE,
  DRIFT_CWD,
  ENOENT_PATH,
  FEATURED_ISSUE,
  FILED_AT,
  FORBIDDEN_IDLE,
  FORBIDDEN_UI,
  HOLD_VERDICTS,
  HOOK_COMMAND,
  HOOK_EVENT,
  HOOK_MATCHER,
  HOOK_SCRIPT,
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
  PROJECT_ROOT,
  REPORTER,
  SAME_CLASS_COUSINS,
  SEEDED_WORD,
  TITLE,
  VERDICTS,
  analyze,
  chipsOf,
  classify,
  decide,
  decideSeed,
  emptyTicket,
  handle,
  isSeized,
  normalize,
  resolveHook,
  score,
  seedAbsoluteOk,
  seedCorrectiveCdBlocked,
  seedCousin,
  seedCwdDrifted,
  seedHinged,
  seedHold,
  seedHookEnoent,
  seedOrdinarySubagentInherits,
  seedProjectDirAnchored,
  seedSeized,
  seedSessionDeadlock,
  seedWorktreeEscape,
} from "./pintle.mjs";

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
  return fileURLToPath(new URL("./pintle.mjs", import.meta.url));
}

test("relative + cwd == root → hinged", () => {
  const result = analyze({
    projectRoot: PROJECT_ROOT,
    bashCwd: PROJECT_ROOT,
    hookCommand: HOOK_COMMAND,
    resolveMode: "bashCwd",
  });
  assert.equal(result.verdict, "hinged");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.seized, false);
  assert.equal(result.hinged, true);
  assert.equal(isSeized(result.ticket), false);
  assert.equal(resolveHook(result.ticket).resolved, `${PROJECT_ROOT}/${HOOK_SCRIPT}`);
});

test("relative + cwd drifted → seized", () => {
  const result = analyze({
    projectRoot: PROJECT_ROOT,
    bashCwd: DRIFT_CWD,
    hookCommand: HOOK_COMMAND,
    resolveMode: "bashCwd",
  });
  assert.equal(result.verdict, "seized");
  assert.equal(result.alarm, true);
  assert.equal(result.hold, false);
  assert.equal(result.seized, true);
  assert.equal(isSeized(result.ticket), true);
  assert.equal(result.flags.resolved, ENOENT_PATH);
  assert.ok(result.chips.includes("seized"));
  assert.ok(result.chips.includes("cwd-drifted"));
  assert.ok(!result.chips.includes("hinged"));
});

test("absolute always hinged", () => {
  const drifted = analyze({
    projectRoot: PROJECT_ROOT,
    bashCwd: DRIFT_CWD,
    hookCommand: `python3 ${ABSOLUTE_HOOK}`,
    resolveMode: "bashCwd",
  });
  const atRoot = analyze({
    projectRoot: PROJECT_ROOT,
    bashCwd: PROJECT_ROOT,
    hookCommand: `python3 ${ABSOLUTE_HOOK}`,
    resolveMode: "bashCwd",
  });
  assert.equal(drifted.verdict, "absolute-ok");
  assert.equal(drifted.hold, true);
  assert.equal(drifted.seized, false);
  assert.equal(atRoot.hold, true);
  assert.equal(isSeized(drifted.ticket), false);
  assert.equal(isSeized(atRoot.ticket), false);
});

test("CLAUDE_PROJECT_DIR-anchored → hinged", () => {
  const result = analyze({
    projectRoot: PROJECT_ROOT,
    bashCwd: DRIFT_CWD,
    hookCommand: `python3 ${ANCHORED_HOOK}`,
    resolveMode: "claudeProjectDir",
    claudeProjectDir: PROJECT_ROOT,
  });
  assert.equal(result.verdict, "project-dir-anchored");
  assert.equal(result.hold, true);
  assert.equal(result.seized, false);
  assert.equal(isSeized(result.ticket), false);
  assert.equal(result.flags.resolved, ABSOLUTE_HOOK);
  assert.ok(result.chips.includes("project-dir-anchored"));
});

test("post-seize corrective cd still seized", () => {
  const result = analyze({
    projectRoot: PROJECT_ROOT,
    bashCwd: DRIFT_CWD,
    hookCommand: HOOK_COMMAND,
    resolveMode: "bashCwd",
    sessionSeized: true,
    correctiveCd: true,
    command: "cd /opt/project",
  });
  assert.equal(result.verdict, "seized");
  assert.equal(result.alarm, true);
  assert.equal(isSeized(result.ticket), true);
  assert.ok(result.chips.includes("corrective-cd-blocked"));
  assert.ok(result.chips.includes("session-deadlock"));
  assert.ok(result.reasons.some((row) => /corrective cd/i.test(row)));
});

test("idle hinged is a hold; relative hook resolves from project root after cd", () => {
  const result = analyze(seedHinged());
  assert.equal(result.verdict, "hinged");
  assert.equal(result.idleWord, "hinged");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.seized, false);
  assert.equal(result.hinged, true);
  assert.ok(result.chips.includes("hinged"));
  assert.ok(result.chips.includes("hold"));
  assert.ok(!result.chips.includes("seized"));
  assert.equal(result.ticket.bashCwd, DRIFT_CWD);
  assert.equal(result.ticket.resolveMode, "projectRoot");
  assert.match(result.contrast.pintle, /seated/i);
  assert.doesNotMatch(
    result.idleWord,
    /seized|pealed|drained|pooled|warded|first-wins/i,
  );
});

test("empty ticket and empty stdin classify hinged", () => {
  assert.equal(classify(emptyTicket()), "hinged");
  assert.equal(classify(""), "hinged");
  assert.equal(classify(null), "hinged");
  assert.equal(decideSeed("hinged").verdict, "hinged");
  assert.equal(decideSeed("swung").verdict, "hinged");
});

test("seeded seized #91226 is alarm with ENOENT and deadlock", () => {
  const result = analyze(seedSeized());
  assert.equal(result.verdict, "seized");
  assert.equal(result.alarm, true);
  assert.equal(result.hold, false);
  assert.equal(result.seized, true);
  assert.ok(result.chips.includes("seized"));
  assert.ok(result.chips.includes("cwd-drifted"));
  assert.ok(result.chips.includes("hook-enoent"));
  assert.ok(result.chips.includes("session-deadlock"));
  assert.ok(!result.chips.includes("hinged"));
  assert.match(result.contrast.tiller, /seized/i);
  assert.equal(result.flags.resolved, ENOENT_PATH);
});

test("data fixtures classify hinged vs seized vs named chips", () => {
  assert.equal(classify(readData("hinged.json")), "hinged");
  assert.equal(classify(readData("seized.json")), "seized");
  assert.equal(classify(readData("91226.json")), "seized");
  assert.equal(classify(readData("cwd-drifted.json")), "cwd-drifted");
  assert.equal(classify(readData("hook-enoent.json")), "hook-enoent");
  assert.equal(classify(readData("session-deadlock.json")), "session-deadlock");
  assert.equal(classify(readData("corrective-cd-blocked.json")), "corrective-cd-blocked");
  assert.equal(classify(readData("worktree-escape.json")), "worktree-escape");
  assert.equal(classify(readData("ordinary-subagent-inherits.json")), "ordinary-subagent-inherits");
  assert.equal(classify(readData("absolute-ok.json")), "absolute-ok");
  assert.equal(classify(readData("project-dir-anchored.json")), "project-dir-anchored");
  assert.equal(classify(readData("hold.json")), "hold");
});

test("seized seed is alarm; hinged / absolute / anchored / hold are holds", () => {
  assert.equal(score(seedSeized()).alarm, true);
  assert.equal(score(seedSeized()).hold, false);
  assert.equal(score(seedHinged()).hold, true);
  assert.equal(score(seedHinged()).alarm, false);
  assert.equal(score(seedAbsoluteOk()).hold, true);
  assert.equal(score(seedProjectDirAnchored()).hold, true);
  assert.equal(score(seedHold()).hold, true);
  assert.equal(score(seedCwdDrifted()).alarm, true);
  assert.equal(score(seedCorrectiveCdBlocked()).alarm, true);
});

test("normalize seeds 91226 without ticket fields", () => {
  const ticket = normalize({ issue: 91226 });
  assert.equal(ticket.projectRoot, PROJECT_ROOT);
  assert.equal(ticket.bashCwd, DRIFT_CWD);
  assert.equal(ticket.resolveMode, "bashCwd");
  assert.equal(ticket.sessionSeized, true);
  assert.equal(classify(ticket), "seized");
});

test("score / decide / handle agree on seized vs hinged", () => {
  assert.equal(score(seedSeized()).verdict, "seized");
  assert.equal(decide(seedHinged()).verdict, "hinged");
  const fail = handle(seedSeized());
  const hold = handle(seedHinged());
  const working = handle(seedHold());
  assert.match(fail.hookSpecificOutput.additionalContext, /#91226/);
  assert.match(hold.hookSpecificOutput.additionalContext, /hinged/i);
  assert.match(working.hookSpecificOutput.additionalContext, /hold/i);
});

test("decideSeed aliases", () => {
  assert.equal(decideSeed("seized").verdict, "seized");
  assert.equal(decideSeed(91226).verdict, "seized");
  assert.equal(decideSeed("91226").verdict, "seized");
  assert.equal(decideSeed("hinged").verdict, "hinged");
  assert.equal(decideSeed("hold").verdict, "hold");
  assert.equal(decideSeed("absolute-ok").verdict, "absolute-ok");
  assert.equal(decideSeed("project-dir-anchored").verdict, "project-dir-anchored");
  assert.equal(decideSeed("corrective-cd-blocked").verdict, "corrective-cd-blocked");
});

test("CLI scores data files", () => {
  const seized = spawnSync(
    process.execPath,
    [hookPath(), fileURLToPath(new URL("../data/91226.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(seized.status, 0, seized.stderr);
  assert.equal(JSON.parse(seized.stdout).verdict, "seized");
  assert.equal(JSON.parse(seized.stdout).alarm, true);

  const hinged = spawnSync(
    process.execPath,
    [hookPath(), fileURLToPath(new URL("../data/hinged.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(hinged.status, 0, hinged.stderr);
  assert.equal(JSON.parse(hinged.stdout).verdict, "hinged");
  assert.equal(JSON.parse(hinged.stdout).hold, true);

  const hold = spawnSync(
    process.execPath,
    [hookPath(), fileURLToPath(new URL("../data/hold.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(hold.status, 0, hold.stderr);
  assert.equal(JSON.parse(hold.stdout).verdict, "hold");
});

test("constants match the issue facts only", () => {
  assert.equal(FEATURED_ISSUE, 91226);
  assert.deepEqual([...PRIMARY_ISSUES], [91226]);
  assert.equal(COUSIN_ISSUE, 32361);
  assert.equal(CODEX_COUSIN, 26675);
  assert.deepEqual([...SAME_CLASS_COUSINS], [32361, 5176]);
  assert.deepEqual([...CLAUDE_COUSINS], [32361, 5176, 87890, 65378]);
  assert.deepEqual([...CODEX_COUSINS], [26675, 23996]);
  assert.deepEqual([...COUSINS], [32361, 5176, 87890, 65378, 26675, 23996]);
  assert.equal(FILED_AT, "2026-09-01T13:40:21Z");
  assert.equal(CLAUDE_VERSION, "2.1.252");
  assert.equal(PLATFORM, "macos");
  assert.equal(REPORTER, "hamazinger");
  assert.equal(HOOK_EVENT, "PreToolUse");
  assert.equal(HOOK_MATCHER, "Bash");
  assert.equal(HOOK_COMMAND, "python3 scripts/harness_health_dashboard/guard-deploy-commands.py");
  assert.equal(IDLE_WORD, "hinged");
  assert.equal(SEEDED_WORD, "seized");
  assert.notEqual(IDLE_WORD, "seized");
  assert.notEqual(IDLE_WORD, "pealed");
  assert.notEqual(IDLE_WORD, "drained");
  assert.notEqual(IDLE_WORD, "warded");
  assert.notEqual(IDLE_WORD, "first-wins");
  assert.deepEqual([...HOLD_VERDICTS], ["hinged", "hold", "absolute-ok", "project-dir-anchored"]);
  assert.ok(ALARM_VERDICTS.includes("seized"));
  assert.ok(ALARM_VERDICTS.includes("corrective-cd-blocked"));
  assert.ok(!ALARM_VERDICTS.includes("hinged"));
  assert.deepEqual([...VERDICTS], [...CHIPS]);
  assert.equal(VERDICTS.length, 11);
  assert.deepEqual(
    [...LABELS],
    ["bug", "has repro", "platform:macos", "area:bash", "area:hooks"],
  );
  assert.match(TITLE, /relative command path can permanently deadlock/);
  assert.match(ISSUE_URL, /91226/);
  assert.match(PHRASE, /misses the gudgeon after one cd/i);
  assert.match(HUB_LINE, /05:50 pintle/);
  assert.match(HUB_LINE, /admit hinged/);
  assert.match(MARK, /05:50/);
  assert.match(MARK, /#106/);
  assert.match(MARK, /#91226/);
  assert.match(CONTRAST_NOTE, /RELATIVE PRETOOLUSE BASH HOOK/);
  assert.match(HYPOTHESIS_NOTE, /NON-BINDING/);
  assert.ok(NOT_PRODUCTS.includes("carillon"));
  assert.ok(NOT_PRODUCTS.includes("postern"));
  assert.ok(NOT_PRODUCTS.includes("sluice"));
  assert.ok(BANNED_NAMES.includes("Gudgeon"));
  assert.ok(BANNED_NAMES.includes("Carillon"));
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(IDLE_WORD, word);
  }
});

test("chips.json and fingerprints stay aligned", () => {
  const chips = readData("chips.json");
  assert.deepEqual(chips.verdicts, [...VERDICTS]);
  assert.equal(chips.idleWord, "hinged");
  assert.equal(chips.seededWord, "seized");
  const fp = readData("fingerprints.json");
  assert.equal(fp.primary, 91226);
  assert.equal(fp.cousin, 32361);
  assert.deepEqual(fp.cousins, [32361, 5176, 87890, 65378, 26675, 23996]);
  assert.deepEqual(fp.claudeCousins, [32361, 5176, 87890, 65378]);
  assert.deepEqual(fp.codexCousins, [26675, 23996]);
  assert.equal(fp.claudeVersion, "2.1.252");
  assert.equal(fp.hookEvent, "PreToolUse");
  assert.equal(fp.hookMatcher, "Bash");
  const fixtures = readData("fixtures.json");
  assert.equal(fixtures.rows.length, 5);
  assert.equal(fixtures.rows[0].verdict, "seized");
  assert.equal(fixtures.narrativeNotFixture.noCountsInvented, true);
  assert.equal(fixtures.narrativeNotFixture.hookRelative, true);
});

test("chipsOf on a raw drifted relative ticket still marks seized", () => {
  const chips = chipsOf({
    projectRoot: PROJECT_ROOT,
    bashCwd: DRIFT_CWD,
    hookCommand: HOOK_COMMAND,
    resolveMode: "bashCwd",
    sessionSeized: true,
    outputText: "seized; cwd drifted; hook ENOENT; every Bash blocked",
  });
  assert.ok(chips.includes("seized"));
  assert.ok(chips.includes("cwd-drifted"));
  assert.ok(chips.includes("hook-enoent"));
  assert.ok(!chips.includes("hinged"));
});

test("cousin #32361 is not conflated with seized primary", () => {
  assert.notEqual(classify(seedCousin()), "seized");
  assert.notEqual(classify({ issue: 32361 }), "seized");
  const cousin = analyze(seedCousin());
  assert.ok(cousin.reasons.some((row) => /32361|cousin/i.test(row)));
});

test("cite-only cousins are not primaries and do not become seized", () => {
  for (const issue of [32361, 5176, 87890, 65378, 26675, 23996]) {
    assert.notEqual(classify({ issue }), "seized", String(issue));
    assert.notEqual(issue, FEATURED_ISSUE);
  }
  assert.equal(FEATURED_ISSUE, 91226);
});

test("named verdicts each have a seed and a hold/alarm split", () => {
  assert.equal(analyze(seedCwdDrifted()).verdict, "cwd-drifted");
  assert.equal(analyze(seedHookEnoent()).verdict, "hook-enoent");
  assert.equal(analyze(seedSessionDeadlock()).verdict, "session-deadlock");
  assert.equal(analyze(seedCorrectiveCdBlocked()).verdict, "corrective-cd-blocked");
  assert.equal(analyze(seedWorktreeEscape()).verdict, "worktree-escape");
  assert.equal(analyze(seedOrdinarySubagentInherits()).verdict, "ordinary-subagent-inherits");
  assert.equal(analyze(seedAbsoluteOk()).verdict, "absolute-ok");
  assert.equal(analyze(seedProjectDirAnchored()).verdict, "project-dir-anchored");
  assert.equal(analyze(seedHold()).ticket.bashCwd, PROJECT_ROOT);
  assert.equal(analyze(seedWorktreeEscape()).ticket.isolation, "worktree");
  assert.equal(isSeized(seedWorktreeEscape()), false);
  assert.equal(isSeized(seedOrdinarySubagentInherits()), true);
});

test("living page is a Pintle tiller, idle hinged, seeded seized", () => {
  const html = readPage();
  assert.match(html, /<title>Pintle/);
  assert.match(html, /Idle word:\s*hinged/);
  assert.match(html, /hinged/);
  assert.match(html, /seized/);
  assert.match(html, /cwd-drifted/);
  assert.match(html, /hook-enoent/);
  assert.match(html, /session-deadlock/);
  assert.match(html, /corrective-cd-blocked/);
  assert.match(html, /worktree-escape/);
  assert.match(html, /ordinary-subagent-inherits/);
  assert.match(html, /absolute-ok/);
  assert.match(html, /project-dir-anchored/);
  assert.match(html, /#91226/);
  assert.match(html, /#32361/);
  assert.match(html, /#5176/);
  assert.match(html, /#87890/);
  assert.match(html, /#65378/);
  assert.match(html, /26675/);
  assert.match(html, /23996/);
  assert.match(html, /cousin-not-primary|cousin, not primary/i);
  assert.match(html, /05:50/);
  assert.match(html, /catalog #106/);
  assert.match(html, /2\.1\.252/);
  assert.match(html, /family=Syne/);
  assert.match(html, /family=DM\+Sans|DM Sans/);
  assert.match(html, /family=JetBrains\+Mono|JetBrains Mono/);
  assert.match(html, /Score the hinge/);
  assert.match(html, /Pin idle hinged/);
  assert.match(html, /Pin seeded seized/);
  assert.match(html, /Admit hinged/);
  assert.match(html, /pintle|gudgeon|tiller/i);
  assert.match(html, /RELATIVE PRETOOLUSE BASH HOOK/);
  assert.match(html, /embed/);
  assert.doesNotMatch(html, /Idle word:\s*seized/i);
  assert.doesNotMatch(html, /Idle word:\s*pealed/i);
  assert.doesNotMatch(html, /Idle word:\s*drained/i);
  assert.doesNotMatch(html, /Idle word:\s*warded/i);
  assert.doesNotMatch(html, /Idle word:\s*first-wins/i);
  assert.doesNotMatch(html, /Pin idle seized/);
  assert.doesNotMatch(html, /Pin idle pealed/);
  assert.doesNotMatch(html, /Score the peal/);
  assert.doesNotMatch(html, /Score the race/);
  assert.doesNotMatch(html, /Score the peg/);
  assert.doesNotMatch(html, /Score the postern/);
  assert.doesNotMatch(html, /family=Playfair/);
  assert.doesNotMatch(html, /family=Source\+Serif/);
  assert.doesNotMatch(html, /family=Cinzel/);
  assert.doesNotMatch(html, /family=Literata/);
  assert.doesNotMatch(html, /family=Inconsolata/);
  assert.doesNotMatch(html, /family=Fraunces/);
  assert.doesNotMatch(html, /family=Source\+Sans/);
  assert.doesNotMatch(html, /family=Libre\+Caslon/);
  assert.doesNotMatch(html, /family=Public\+Sans/);
  assert.doesNotMatch(html, /family=EB\+Garamond/);
  assert.doesNotMatch(html, /family=Cormorant/);
  assert.doesNotMatch(html, /family=IBM\+Plex\+Mono/);
  for (const word of FORBIDDEN_UI) {
    assert.doesNotMatch(html, new RegExp(word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"));
  }
});

test("README and page stay Pintle, not a clone", () => {
  const readme = readReadme();
  assert.match(readme, /^# Pintle/m);
  assert.match(readme, /Why not a clone/);
  assert.match(readme, /NOT \*\*Carillon\*\*/);
  assert.match(readme, /NOT \*\*Postern\*\*/);
  assert.match(readme, /NOT \*\*Sluice\*\*/);
  assert.match(readme, /Product name stays \*\*Pintle\*\*/);
  assert.match(readme, /Idle word: \*\*hinged\*\*/);
  assert.match(readme, /#32361/);
  assert.match(readme, /#5176/);
  assert.match(readme, /#87890/);
  assert.match(readme, /#65378/);
  assert.match(readme, /codex#26675|26675/);
  assert.doesNotMatch(readme, /^# Carillon/m);
  assert.doesNotMatch(readme, /^# Postern/m);
  assert.doesNotMatch(readme, /^# Sluice/m);
});
