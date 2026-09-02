import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ALARM_VERDICTS,
  BANNED_NAMES,
  BASH,
  CHIPS,
  CLAUDE_PROJECT_DIR,
  CONTRAST_NOTE,
  COUSINS,
  COUSIN_ISSUE,
  CROSS_ECOSYSTEM,
  CD_SUBDIR,
  DARWIN,
  ENOENT,
  FEATURED_ISSUE,
  FILED_AT,
  FORBIDDEN_IDLE,
  FORBIDDEN_UI,
  HOLD_VERDICTS,
  HOOK_COMMAND,
  HOOK_TYPE,
  HUB_LINE,
  HYPOTHESIS_NOTE,
  IDLE_WORD,
  ISOLATION_WORKTREE,
  ISSUE_URL,
  LABELS,
  MARK,
  NOT_PRODUCTS,
  PHRASE,
  PLATFORM,
  PRETOOLUSE,
  PRIMARY_ISSUES,
  PWD,
  REPORTER,
  SEEDED_WORD,
  TITLE,
  VERDICTS,
  VERSION,
  analyze,
  chipsOf,
  classify,
  decide,
  decideSeed,
  emptyTicket,
  handle,
  isFouled,
  isReeved,
  normalize,
  score,
  seedClaudeProjectDirFix,
  seedCorrectiveCdFails,
  seedCousin,
  seedDriftedCwd,
  seedEnoentSeize,
  seedFouled,
  seedHasClearRepro,
  seedHold,
  seedIsolationWorktreeEscape,
  seedPersistentBashCwd,
  seedPretooluseBeforeCommand,
  seedRecurrence,
  seedReeved,
  seedRelativePath,
  seedSubagentInherit,
} from "./deadeye.mjs";

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
  return fileURLToPath(new URL("./deadeye.mjs", import.meta.url));
}

test("lanyard reeved against mast + stable root + no ENOENT → reeved", () => {
  const result = analyze({
    lanyardReevedAgainstMast: true,
    projectRootStable: true,
    bashFree: true,
    relativePath: false,
    driftedCwd: false,
    enoentSeize: false,
  });
  assert.equal(result.verdict, "reeved");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.fouled, false);
  assert.equal(result.reeved, true);
  assert.equal(isReeved(result.ticket), true);
  assert.equal(isFouled(result.ticket), false);
});

test("relative path + drifted cwd + ENOENT → fouled", () => {
  const result = analyze({
    relativePath: true,
    driftedCwd: true,
    enoentSeize: true,
    pretooluseBeforeCommand: true,
    persistentBashCwd: true,
    correctiveCdFails: true,
    hasClearRepro: true,
    lanyardReevedAgainstMast: false,
    projectRootStable: false,
  });
  assert.equal(result.verdict, "fouled");
  assert.equal(result.alarm, true);
  assert.equal(result.hold, false);
  assert.equal(result.fouled, true);
  assert.equal(isFouled(result.ticket), true);
  assert.ok(result.chips.includes("fouled"));
  assert.ok(result.chips.includes("relative-path"));
  assert.ok(result.chips.includes("drifted-cwd"));
  assert.ok(!result.chips.includes("reeved"));
});

test("idle reeved is a hold; lanyard reeved against mast / $CLAUDE_PROJECT_DIR; Bash free", () => {
  const result = analyze(seedReeved());
  assert.equal(result.verdict, "reeved");
  assert.equal(result.idleWord, "reeved");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.fouled, false);
  assert.equal(result.reeved, true);
  assert.ok(result.chips.includes("reeved"));
  assert.ok(result.chips.includes("hold"));
  assert.ok(!result.chips.includes("fouled"));
  assert.equal(result.ticket.lanyardReevedAgainstMast, true);
  assert.equal(result.ticket.projectRootStable, true);
  assert.equal(result.ticket.relativePath, false);
  assert.match(result.contrast.case, /reeved/i);
  assert.doesNotMatch(
    result.idleWord,
    /creased|bled|latched|vanished|sealed|rebound|dark|spurious|fenced|swept|tolled|mute|honored|discarded|arrested|skipped|indexed|jumped|chocked|rolled|clasped|sprung|drained|hinged|pealed|warded|pooled|cased|aired|sifted|stocked|stationed|marvered|unpinned|rinsed|literal|choked|opened|stalled|fused|forged|attributed/i,
  );
});

test("empty ticket and empty stdin classify reeved", () => {
  assert.equal(classify(emptyTicket()), "reeved");
  assert.equal(classify(""), "reeved");
  assert.equal(classify(null), "reeved");
  assert.equal(decideSeed("reeved").verdict, "reeved");
  assert.equal(decideSeed("open").verdict, "reeved");
});

test("seeded fouled #91226 is alarm with relative path, drifted cwd, ENOENT seize", () => {
  const result = analyze(seedFouled());
  assert.equal(result.verdict, "fouled");
  assert.equal(result.alarm, true);
  assert.equal(result.hold, false);
  assert.equal(result.fouled, true);
  assert.ok(result.chips.includes("fouled"));
  assert.ok(result.chips.includes("relative-path"));
  assert.ok(result.chips.includes("drifted-cwd"));
  assert.ok(result.chips.includes("enoent-seize"));
  assert.ok(result.chips.includes("pretooluse-before-command"));
  assert.ok(result.chips.includes("persistent-bash-cwd"));
  assert.ok(result.chips.includes("corrective-cd-fails"));
  assert.ok(result.chips.includes("subagent-inherit"));
  assert.ok(result.chips.includes("isolation-worktree-escape"));
  assert.ok(result.chips.includes("recurrence"));
  assert.ok(result.chips.includes("has-clear-repro"));
  assert.ok(!result.chips.includes("reeved"));
  assert.match(result.contrast.case, /fouled/i);
  assert.equal(result.ticket.relativePath, true);
  assert.equal(result.ticket.driftedCwd, true);
  assert.equal(result.ticket.enoentSeize, true);
  assert.equal(result.ticket.reporter, REPORTER);
  assert.equal(result.ticket.cliVersion, VERSION);
  assert.equal(result.ticket.platform, PLATFORM);
});

test("data fixtures classify reeved vs fouled vs named chips", () => {
  assert.equal(classify(readData("reeved.json")), "reeved");
  assert.equal(classify(readData("fouled.json")), "fouled");
  assert.equal(classify(readData("91226.json")), "fouled");
  assert.equal(classify(readData("relative-path.json")), "relative-path");
  assert.equal(classify(readData("drifted-cwd.json")), "drifted-cwd");
  assert.equal(classify(readData("enoent.json")), "enoent-seize");
  assert.equal(classify(readData("pretooluse.json")), "pretooluse-before-command");
  assert.equal(classify(readData("project-dir.json")), "claude-project-dir-fix");
  assert.equal(classify(readData("worktree-escape.json")), "isolation-worktree-escape");
  assert.equal(classify(readData("corrective-cd-fails.json")), "corrective-cd-fails");
  assert.equal(classify(readData("pwd-fails.json")), "enoent-seize");
  assert.equal(classify(readData("subagent-inherit.json")), "subagent-inherit");
  assert.equal(classify(readData("isolation-worktree-ok.json")), "isolation-worktree-escape");
  assert.equal(classify(readData("has-clear-repro.json")), "has-clear-repro");
  assert.equal(classify(readData("recurrence-32361.json")), "recurrence");
  assert.equal(classify(readData("recurrence-5176.json")), "recurrence");
  assert.equal(classify(readData("recurrence-50960.json")), "recurrence");
  assert.equal(classify(readData("hold.json")), "hold");
});

test("fouled seed is alarm; reeved / hold are holds", () => {
  assert.equal(score(seedFouled()).alarm, true);
  assert.equal(score(seedFouled()).hold, false);
  assert.equal(score(seedReeved()).hold, true);
  assert.equal(score(seedReeved()).alarm, false);
  assert.equal(score(seedHold()).hold, true);
  assert.equal(score(seedRelativePath()).alarm, true);
  assert.equal(score(seedEnoentSeize()).alarm, true);
});

test("normalize seeds 91226 without ticket fields", () => {
  const ticket = normalize({ issue: 91226 });
  assert.equal(ticket.relativePath, true);
  assert.equal(ticket.driftedCwd, true);
  assert.equal(ticket.enoentSeize, true);
  assert.equal(ticket.reporter, REPORTER);
  assert.equal(classify(ticket), "fouled");
});

test("score / decide / handle agree on fouled vs reeved", () => {
  assert.equal(score(seedFouled()).verdict, "fouled");
  assert.equal(decide(seedReeved()).verdict, "reeved");
  const fail = handle(seedFouled());
  const hold = handle(seedReeved());
  const working = handle(seedHold());
  assert.match(fail.hookSpecificOutput.additionalContext, /#91226/);
  assert.match(fail.hookSpecificOutput.additionalContext, /ENOENT|relative/);
  assert.match(hold.hookSpecificOutput.additionalContext, /reeved/i);
  assert.match(working.hookSpecificOutput.additionalContext, /hold/i);
});

test("decideSeed aliases", () => {
  assert.equal(decideSeed("fouled").verdict, "fouled");
  assert.equal(decideSeed(91226).verdict, "fouled");
  assert.equal(decideSeed("91226").verdict, "fouled");
  assert.equal(decideSeed("reeved").verdict, "reeved");
  assert.equal(decideSeed("hold").verdict, "hold");
  assert.equal(decideSeed("relative-path").verdict, "relative-path");
  assert.equal(decideSeed("drifted-cwd").verdict, "drifted-cwd");
  assert.equal(decideSeed("enoent-seize").verdict, "enoent-seize");
});

test("CLI scores data files", () => {
  const fouled = spawnSync(
    process.execPath,
    [hookPath(), fileURLToPath(new URL("../data/91226.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(fouled.status, 0, fouled.stderr);
  assert.equal(JSON.parse(fouled.stdout).verdict, "fouled");
  assert.equal(JSON.parse(fouled.stdout).alarm, true);

  const reeved = spawnSync(
    process.execPath,
    [hookPath(), fileURLToPath(new URL("../data/reeved.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(reeved.status, 0, reeved.stderr);
  assert.equal(JSON.parse(reeved.stdout).verdict, "reeved");
  assert.equal(JSON.parse(reeved.stdout).hold, true);

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
  assert.deepEqual([...COUSINS], [32361, 5176, 50960, 88830, 87890]);
  assert.deepEqual([...CROSS_ECOSYSTEM], [26675]);
  assert.equal(FILED_AT, "2026-09-01T13:40:21Z");
  assert.equal(REPORTER, "hamazinger");
  assert.equal(VERSION, "2.1.252");
  assert.equal(PLATFORM, "macOS");
  assert.equal(DARWIN, "Darwin 25.6.0");
  assert.equal(PRETOOLUSE, "PreToolUse");
  assert.equal(BASH, "Bash");
  assert.equal(HOOK_TYPE, "command");
  assert.equal(HOOK_COMMAND, "python3 scripts/harness_health_dashboard/guard-deploy-commands.py");
  assert.equal(ENOENT, "ENOENT");
  assert.equal(CLAUDE_PROJECT_DIR, "$CLAUDE_PROJECT_DIR");
  assert.equal(ISOLATION_WORKTREE, 'isolation: "worktree"');
  assert.equal(CD_SUBDIR, "cd some/subdirectory");
  assert.equal(PWD, "pwd");
  assert.equal(IDLE_WORD, "reeved");
  assert.equal(SEEDED_WORD, "fouled");
  assert.notEqual(IDLE_WORD, "fouled");
  assert.match(TITLE, /PreToolUse/);
  assert.match(TITLE, /Bash/);
  assert.match(TITLE, /relative command path/);
  assert.match(TITLE, /deadlock/);
  assert.match(ISSUE_URL, /91226/);
  assert.match(PHRASE, /reeves the hook lanyard against the moving block/i);
  assert.match(PHRASE, /admit the Bash already seized/);
  assert.match(HUB_LINE, /20:50 deadeye/);
  assert.match(HUB_LINE, /admit the Bash already seized/);
  assert.match(MARK, /20:50/);
  assert.match(MARK, /#121/);
  assert.match(MARK, /#91226/);
  assert.match(CONTRAST_NOTE, /RELATIVE PRETOOLUSE BASH HOOK PATH RESOLVES AGAINST DRIFTED BASH CWD/);
  assert.match(CONTRAST_NOTE, /PreToolUse/);
  assert.match(CONTRAST_NOTE, /Bash/);
  assert.match(CONTRAST_NOTE, /ENOENT/);
  assert.match(CONTRAST_NOTE, /cd some\/subdirectory/);
  assert.match(CONTRAST_NOTE, /\$CLAUDE_PROJECT_DIR/);
  assert.match(CONTRAST_NOTE, /isolation: "worktree"/);
  assert.match(CONTRAST_NOTE, /python3 scripts\/harness_health_dashboard\/guard-deploy-commands\.py/);
  assert.match(CONTRAST_NOTE, /#32361/);
  assert.match(CONTRAST_NOTE, /#5176/);
  assert.match(CONTRAST_NOTE, /#50960/);
  assert.match(CONTRAST_NOTE, /hamazinger/);
  assert.match(CONTRAST_NOTE, /2\.1\.252/);
  assert.match(CONTRAST_NOTE, /Darwin 25\.6\.0/);
  assert.match(HYPOTHESIS_NOTE, /NON-BINDING/);
  assert.ok(NOT_PRODUCTS.includes("reglet"));
  assert.ok(NOT_PRODUCTS.includes("reliquary"));
  assert.ok(NOT_PRODUCTS.includes("annunciator"));
  assert.ok(NOT_PRODUCTS.includes("caisson"));
  assert.ok(NOT_PRODUCTS.includes("spindle"));
  assert.ok(NOT_PRODUCTS.includes("knell"));
  assert.ok(NOT_PRODUCTS.includes("tumbler"));
  assert.ok(NOT_PRODUCTS.includes("escapement"));
  assert.ok(NOT_PRODUCTS.includes("berth"));
  assert.ok(NOT_PRODUCTS.includes("bollard"));
  assert.ok(NOT_PRODUCTS.includes("reveille"));
  assert.ok(NOT_PRODUCTS.includes("callboard"));
  assert.ok(BANNED_NAMES.includes("Reglet"));
  assert.ok(BANNED_NAMES.includes("Reliquary"));
  assert.ok(BANNED_NAMES.includes("Annunciator"));
  assert.ok(BANNED_NAMES.includes("Caisson"));
  assert.ok(BANNED_NAMES.includes("Spindle"));
  assert.ok(BANNED_NAMES.includes("Knell"));
  assert.ok(BANNED_NAMES.includes("Tumbler"));
  assert.ok(BANNED_NAMES.includes("Berth"));
  assert.ok(BANNED_NAMES.includes("Bollard"));
  assert.ok(BANNED_NAMES.includes("Reveille"));
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(IDLE_WORD, word);
    assert.notEqual(SEEDED_WORD, word);
  }
  assert.ok(LABELS.includes("has repro"));
  assert.ok(LABELS.includes("platform:macos"));
  assert.ok(LABELS.includes("area:bash"));
  assert.ok(LABELS.includes("area:hooks"));
  assert.ok(HOLD_VERDICTS.includes("reeved"));
  assert.ok(ALARM_VERDICTS.includes("fouled"));
  assert.deepEqual([...CHIPS], [...VERDICTS]);
});

test("chips.json and fingerprints stay aligned", () => {
  const chips = readData("chips.json");
  assert.deepEqual(chips.verdicts, [...VERDICTS]);
  assert.equal(chips.idleWord, "reeved");
  assert.equal(chips.seededWord, "fouled");
  const fp = readData("fingerprints.json");
  assert.equal(fp.primary, 91226);
  assert.equal(fp.cousin, 32361);
  assert.deepEqual(fp.cousins, [32361, 5176, 50960, 88830, 87890]);
  assert.equal(fp.reporter, "hamazinger");
  assert.equal(fp.version, "2.1.252");
  assert.equal(fp.platform, "macOS");
  assert.equal(fp.darwin, "Darwin 25.6.0");
  assert.equal(fp.pretooluse, "PreToolUse");
  assert.equal(fp.bash, "Bash");
  assert.equal(fp.enoent, "ENOENT");
  assert.equal(fp.claudeProjectDir, "$CLAUDE_PROJECT_DIR");
  const fixtures = readData("fixtures.json");
  assert.equal(fixtures.rows.length, 5);
  assert.equal(fixtures.rows[0].verdict, "fouled");
  assert.equal(fixtures.narrativeNotFixture.noCountsInvented, true);
  assert.equal(fixtures.narrativeNotFixture.relativePath, true);
});

test("chipsOf on a raw relative-path ticket still marks fouled", () => {
  const chips = chipsOf({
    relativePath: true,
    driftedCwd: true,
    enoentSeize: true,
    pretooluseBeforeCommand: true,
    outputText:
      "fouled; #91226; PreToolUse; Bash; ENOENT; cd some/subdirectory; python3 scripts/harness_health_dashboard/guard-deploy-commands.py",
  });
  assert.ok(chips.includes("fouled"));
  assert.ok(chips.includes("relative-path"));
  assert.ok(chips.includes("drifted-cwd"));
  assert.ok(!chips.includes("reeved"));
});

test("cousin #32361 is not conflated with fouled primary", () => {
  assert.notEqual(classify(seedCousin()), "fouled");
  assert.notEqual(classify({ issue: 32361 }), "fouled");
  const cousin = analyze(seedCousin());
  assert.ok(cousin.reasons.some((row) => /32361|cousin/i.test(row)));
});

test("cite-only cousins are not primaries and do not become fouled", () => {
  for (const issue of COUSINS) {
    assert.notEqual(classify({ issue }), "fouled", String(issue));
    assert.notEqual(issue, FEATURED_ISSUE);
  }
  assert.equal(FEATURED_ISSUE, 91226);
});

test("named verdicts each have a seed and a hold/alarm split", () => {
  assert.equal(analyze(seedRelativePath()).verdict, "relative-path");
  assert.equal(analyze(seedDriftedCwd()).verdict, "drifted-cwd");
  assert.equal(analyze(seedEnoentSeize()).verdict, "enoent-seize");
  assert.equal(analyze(seedPretooluseBeforeCommand()).verdict, "pretooluse-before-command");
  assert.equal(analyze(seedPersistentBashCwd()).verdict, "persistent-bash-cwd");
  assert.equal(analyze(seedCorrectiveCdFails()).verdict, "corrective-cd-fails");
  assert.equal(analyze(seedSubagentInherit()).verdict, "subagent-inherit");
  assert.equal(analyze(seedIsolationWorktreeEscape()).verdict, "isolation-worktree-escape");
  assert.equal(analyze(seedClaudeProjectDirFix()).verdict, "claude-project-dir-fix");
  assert.equal(analyze(seedRecurrence()).verdict, "recurrence");
  assert.equal(analyze(seedHasClearRepro()).verdict, "has-clear-repro");
  assert.equal(analyze(seedHold()).ticket.lanyardReevedAgainstMast, true);
  assert.equal(isFouled(seedReeved()), false);
  assert.equal(isFouled(seedFouled()), true);
});

test("living page is a Deadeye atelier, idle reeved, seeded fouled", () => {
  const html = readPage();
  assert.match(html, /<title>Deadeye/);
  assert.match(html, /Idle word:\s*reeved/);
  assert.match(html, /reeved/);
  assert.match(html, /fouled/);
  assert.match(html, /relative-path/);
  assert.match(html, /drifted-cwd/);
  assert.match(html, /enoent-seize/);
  assert.match(html, /pretooluse-before-command/);
  assert.match(html, /persistent-bash-cwd/);
  assert.match(html, /corrective-cd-fails/);
  assert.match(html, /subagent-inherit/);
  assert.match(html, /isolation-worktree-escape/);
  assert.match(html, /claude-project-dir-fix/);
  assert.match(html, /recurrence/);
  assert.match(html, /has-clear-repro/);
  assert.match(html, /#91226/);
  assert.match(html, /#32361/);
  assert.match(html, /#5176/);
  assert.match(html, /#50960/);
  assert.match(html, /#88830/);
  assert.match(html, /#87890/);
  assert.match(html, /cousin-not-primary|cousin, not primary/i);
  assert.match(html, /20:50/);
  assert.match(html, /catalog #121/);
  assert.match(html, /PreToolUse/);
  assert.match(html, /Bash/);
  assert.match(html, /ENOENT/);
  assert.match(html, /cd some\/subdirectory/);
  assert.match(html, /\$CLAUDE_PROJECT_DIR/);
  assert.match(html, /isolation: "worktree"/);
  assert.match(html, /python3 scripts\/harness_health_dashboard\/guard-deploy-commands\.py/);
  assert.match(html, /pwd/);
  assert.match(html, /macOS/);
  assert.match(html, /Darwin 25\.6\.0/);
  assert.match(html, /2\.1\.252/);
  assert.match(html, /hamazinger/);
  assert.match(html, /family=Literata|Literata/);
  assert.match(html, /family=Red\+Hat\+Text|Red Hat Text/);
  assert.match(html, /family=Red\+Hat\+Mono|Red Hat Mono/);
  assert.match(html, /Reeve the deadeye/);
  assert.match(html, /Pin idle reeved/);
  assert.match(html, /Pin seeded fouled/);
  assert.match(html, /Admit the Bash already seized/);
  assert.match(html, /Load fixtures/);
  assert.match(html, /Reset to reeved/);
  assert.match(html, /deadeye|standing-rigging|lignum-vitae|lanyard|mast/i);
  assert.match(html, /RELATIVE PRETOOLUSE|drifted|ENOENT/i);
  assert.match(html, /#hermes-catalog/);
  assert.match(html, /embed/);
  assert.match(html, /Stay OFF reglet letterpress/);
  assert.match(html, /reliquary vault-latch/);
  assert.match(html, /annunciator lamps/);
  assert.match(html, /caisson berth/);
  assert.match(html, /spindle chip-sweep/);
  assert.match(html, /knell mute-bell/);
  assert.match(html, /tumbler keyway/);
  assert.match(html, /escapement pallet/);
  assert.match(html, /carillon peal/);
  assert.match(html, /sluice millrace/);
  assert.match(html, /reveille muster/);
  assert.match(html, /callboard roster/);
  assert.match(html, /berth-card clone/);
  assert.match(html, /bollard clone/);
  assert.doesNotMatch(html, /Idle word:\s*fouled/i);
  assert.doesNotMatch(html, /Idle word:\s*creased/i);
  assert.doesNotMatch(html, /Idle word:\s*bled/i);
  assert.doesNotMatch(html, /Idle word:\s*latched/i);
  assert.doesNotMatch(html, /Idle word:\s*vanished/i);
  assert.doesNotMatch(html, /Idle word:\s*sealed/i);
  assert.doesNotMatch(html, /Pin idle fouled/);
  assert.doesNotMatch(html, /Pin idle creased/);
  assert.doesNotMatch(html, /Pin idle bled/);
  assert.doesNotMatch(html, /Score the strip/);
  assert.doesNotMatch(html, /Score the latch/);
  assert.doesNotMatch(html, /Score the seal/);
  assert.doesNotMatch(html, /Score the purge/);
  assert.doesNotMatch(html, /Score the mute/);
  assert.doesNotMatch(html, /Score the keyway/);
  assert.doesNotMatch(html, /Score the pallet/);
  assert.doesNotMatch(html, /Score the cross/);
  assert.doesNotMatch(html, /Score the block/);
  assert.doesNotMatch(html, /Score the pin/);
  assert.doesNotMatch(html, /Score the stick/);
  assert.doesNotMatch(html, /Score the loft/);
  assert.doesNotMatch(html, /Score the hinge/);
  assert.doesNotMatch(html, /Score the peal/);
  assert.doesNotMatch(html, /Score the peg/);
  assert.doesNotMatch(html, /Score the postern/);
  assert.doesNotMatch(html, /Score the mesh/);
  assert.doesNotMatch(html, /family=EB\+Garamond|EB Garamond/);
  assert.doesNotMatch(html, /family=Hanken\+Grotesk|Hanken Grotesk/);
  assert.doesNotMatch(html, /family=Noto\+Sans\+Mono|Noto Sans Mono/);
  assert.doesNotMatch(html, /family=Crimson\+Pro|Crimson Pro/);
  assert.doesNotMatch(html, /family=Plus\+Jakarta\+Sans|Plus Jakarta Sans/);
  assert.doesNotMatch(html, /family=Ubuntu\+Mono|Ubuntu Mono/);
  assert.doesNotMatch(html, /family=Chakra\+Petch|Chakra Petch/);
  assert.doesNotMatch(html, /family=Barlow|Barlow/);
  assert.doesNotMatch(html, /family=Share\+Tech\+Mono|Share Tech Mono/);
  assert.doesNotMatch(html, /family=Zilla\+Slab|Zilla Slab/);
  assert.doesNotMatch(html, /family=Epilogue|Epilogue/);
  assert.doesNotMatch(html, /family=Overpass\+Mono|Overpass Mono/);
  assert.doesNotMatch(html, /family=Cardo|Cardo/);
  assert.doesNotMatch(html, /family=Hind|Hind/);
  assert.doesNotMatch(html, /family=Cousine|Cousine/);
  assert.doesNotMatch(html, /family=Bitter|Bitter/);
  assert.doesNotMatch(html, /family=Karla|Karla/);
  assert.doesNotMatch(html, /family=Inconsolata|Inconsolata/);
  assert.doesNotMatch(html, /family=Young\+Serif|Young Serif/);
  assert.doesNotMatch(html, /family=Figtree|Figtree/);
  assert.doesNotMatch(html, /family=Fragment\+Mono|Fragment Mono/);
  assert.doesNotMatch(html, /family=Instrument\+Serif|Instrument Serif/);
  assert.doesNotMatch(html, /family=Manrope|Manrope/);
  assert.doesNotMatch(html, /family=Azeret\+Mono|Azeret Mono/);
  assert.doesNotMatch(html, /family=Bodoni/);
  assert.doesNotMatch(html, /family=Jost/);
  assert.doesNotMatch(html, /family=Space\+Mono/);
  assert.doesNotMatch(html, /family=Spectral/);
  assert.doesNotMatch(html, /family=Sora/);
  assert.doesNotMatch(html, /family=IBM\+Plex/);
  assert.doesNotMatch(html, /family=Cormorant/);
  assert.doesNotMatch(html, /family=Outfit/);
  assert.doesNotMatch(html, /family=Fira/);
  assert.doesNotMatch(html, /family=Libre\+Baskerville/);
  assert.doesNotMatch(html, /family=Work\+Sans/);
  assert.doesNotMatch(html, /family=JetBrains/);
  assert.doesNotMatch(html, /family=Newsreader/);
  assert.doesNotMatch(html, /family=Public\+Sans/);
  assert.doesNotMatch(html, /family=Source\+Code\+Pro/);
  assert.doesNotMatch(html, /family=Atkinson/);
  assert.doesNotMatch(html, /family=Fraunces/);
  assert.doesNotMatch(html, /family=Syne/);
  assert.doesNotMatch(html, /family=DM\+Sans/);
  assert.doesNotMatch(html, /family=Playfair/);
  assert.doesNotMatch(html, /family=Source\+Serif/);
  assert.doesNotMatch(html, /family=Cinzel/);
  assert.doesNotMatch(html, /family=Libre\+Caslon/);
  for (const word of FORBIDDEN_UI) {
    assert.doesNotMatch(
      html,
      new RegExp(word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"),
    );
  }
});

test("README and page stay Deadeye, not a clone", () => {
  const readme = readReadme();
  assert.match(readme, /^# Deadeye/m);
  assert.match(readme, /Why not a clone/);
  assert.match(
    readme,
    /RELATIVE PRETOOLUSE BASH HOOK PATH RESOLVES AGAINST DRIFTED BASH CWD/i,
  );
  assert.match(readme, /NOT \*\*Reglet\*\*/);
  assert.match(readme, /NOT \*\*Reliquary\*\*/);
  assert.match(readme, /NOT \*\*Annunciator\*\*/);
  assert.match(readme, /NOT \*\*Caisson\*\*/);
  assert.match(readme, /NOT \*\*Spindle\*\*/);
  assert.match(readme, /NOT \*\*Knell\*\*/);
  assert.match(readme, /NOT \*\*Tumbler\*\*/);
  assert.match(readme, /NOT \*\*Escapement\*\*/);
  assert.match(readme, /NOT \*\*Berth\*\*/);
  assert.match(readme, /NOT \*\*Bollard\*\*/);
  assert.match(readme, /Product name stays \*\*Deadeye\*\*/);
  assert.match(readme, /Idle word: \*\*reeved\*\*/);
  assert.match(readme, /#32361/);
  assert.match(readme, /#5176/);
  assert.match(readme, /#50960/);
  assert.match(readme, /#88830/);
  assert.match(readme, /#87890/);
  assert.match(readme, /PreToolUse/);
  assert.match(readme, /Bash/);
  assert.match(readme, /ENOENT/);
  assert.match(readme, /cd some\/subdirectory/);
  assert.match(readme, /\$CLAUDE_PROJECT_DIR/);
  assert.match(readme, /isolation: "worktree"/);
  assert.match(readme, /python3 scripts\/harness_health_dashboard\/guard-deploy-commands\.py/);
  assert.match(readme, /hamazinger/);
  assert.match(readme, /2\.1\.252/);
  assert.match(readme, /Darwin 25\.6\.0/);
  assert.doesNotMatch(readme, /^# Reglet/m);
  assert.doesNotMatch(readme, /^# Reliquary/m);
  assert.doesNotMatch(readme, /^# Annunciator/m);
  assert.doesNotMatch(readme, /^# Caisson/m);
  assert.doesNotMatch(readme, /^# Spindle/m);
  assert.doesNotMatch(readme, /^# Knell/m);
  assert.doesNotMatch(readme, /^# Tumbler/m);
  assert.doesNotMatch(readme, /^# Escapement/m);
  assert.doesNotMatch(readme, /^# Geneva/m);
  assert.doesNotMatch(readme, /^# Scotch/m);
  assert.doesNotMatch(readme, /^# Fibula/m);
  assert.doesNotMatch(readme, /^# Virgule/m);
  assert.doesNotMatch(readme, /^# Riddle/m);
  assert.doesNotMatch(readme, /^# Garner/m);
  assert.doesNotMatch(readme, /^# Pintle/m);
  assert.doesNotMatch(readme, /^# Carillon/m);
  assert.doesNotMatch(readme, /^# Postern/m);
  assert.doesNotMatch(readme, /^# Sluice/m);
  assert.doesNotMatch(readme, /^# Berth/m);
  assert.doesNotMatch(readme, /^# Bollard/m);
  assert.doesNotMatch(readme, /^# Reveille/m);
  assert.doesNotMatch(readme, /^# Callboard/m);
});
