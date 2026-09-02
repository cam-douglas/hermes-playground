import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ALARM_VERDICTS,
  ATTRIBUTES_FILE,
  BANNED_NAMES,
  CHIPS,
  CLAUDE_LAUNCH,
  CLAUDE_MD,
  CONTRAST_NOTE,
  CORE_AUTOCRLF,
  COUSINS,
  COUSIN_ISSUE,
  CREATE_WORKTREE,
  CRLF,
  CROSS_ECOSYSTEM,
  DESKTOP_VERSION,
  EMPTY_INDEX,
  END_OF_LINE,
  ENTER_WORKTREE,
  EXCLUDE_CLAUDE,
  FEATURED_ISSUE,
  FILED_AT,
  FORBIDDEN_IDLE,
  FORBIDDEN_UI,
  GITATTRIBUTES,
  GIT_VERSION,
  HOLD_VERDICTS,
  HUB_LINE,
  HYPOTHESIS_NOTE,
  IDLE_WORD,
  INFO_ATTRIBUTES,
  ISSUE_URL,
  ISOLATION_WORKTREE,
  LABELS,
  LF,
  LS_FILES_EOL,
  MARK,
  NO_CHECKOUT,
  NOT_PRODUCTS,
  PHRASE,
  PLATFORM,
  PRETTIER_CHECK,
  PRIMARY_ISSUES,
  REPORTER,
  SEEDED_WORD,
  STAGE_CHECKOUT,
  TITLE,
  VERDICTS,
  VERSION,
  WINDOWS,
  W_CRLF,
  analyze,
  chipsOf,
  classify,
  decide,
  decideSeed,
  emptyTicket,
  handle,
  isBled,
  isCreased,
  normalize,
  score,
  seedAttributesInStage1Fix,
  seedAutocrlfFalseFix,
  seedAutocrlfTrue,
  seedBled,
  seedCliWorktreeLf,
  seedCousin,
  seedCreased,
  seedCrlfBleed,
  seedEmptyIndex,
  seedExcludeClaude,
  seedGitattributesMissing,
  seedGitStatusClean,
  seedHasClearRepro,
  seedHold,
  seedPlainGitRepro,
  seedPrettierFails,
  seedStageCheckout,
} from "./reglet.mjs";

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
  return fileURLToPath(new URL("./reglet.mjs", import.meta.url));
}

test("reglet seated + LF flush + no CRLF → creased", () => {
  const result = analyze({
    regletSeated: true,
    lfFlush: true,
    agentFilesUncreased: true,
    crlfBleed: false,
    emptyIndex: false,
    prettierFails: false,
    gitattributesMissing: false,
  });
  assert.equal(result.verdict, "creased");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.bled, false);
  assert.equal(result.creased, true);
  assert.equal(isCreased(result.ticket), true);
  assert.equal(isBled(result.ticket), false);
});

test("CRLF + empty index + stageCheckout → bled", () => {
  const result = analyze({
    crlfBleed: true,
    emptyIndex: true,
    stageCheckout: true,
    autocrlfTrue: true,
    gitattributesMissing: true,
    prettierFails: true,
    gitStatusClean: true,
    hasClearRepro: true,
    regletSeated: false,
    lfFlush: false,
  });
  assert.equal(result.verdict, "bled");
  assert.equal(result.alarm, true);
  assert.equal(result.hold, false);
  assert.equal(result.bled, true);
  assert.equal(isBled(result.ticket), true);
  assert.ok(result.chips.includes("bled"));
  assert.ok(result.chips.includes("crlf-bleed"));
  assert.ok(result.chips.includes("empty-index"));
  assert.ok(!result.chips.includes("creased"));
});

test("idle creased is a hold; reglet seated flat; LF flush across the galley", () => {
  const result = analyze(seedCreased());
  assert.equal(result.verdict, "creased");
  assert.equal(result.idleWord, "creased");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.bled, false);
  assert.equal(result.creased, true);
  assert.ok(result.chips.includes("creased"));
  assert.ok(result.chips.includes("hold"));
  assert.ok(!result.chips.includes("bled"));
  assert.equal(result.ticket.regletSeated, true);
  assert.equal(result.ticket.lfFlush, true);
  assert.equal(result.ticket.crlfBleed, false);
  assert.match(result.contrast.case, /creased/i);
  assert.doesNotMatch(
    result.idleWord,
    /latched|vanished|sealed|dark|spurious|fenced|swept|tolled|mute|honored|discarded|arrested|skipped|indexed|jumped|chocked|rolled|clasped|sprung|drained|hinged|pealed|warded|pooled|cased|aired|sifted|stocked|stationed|marvered|unpinned|rinsed|literal|choked|opened|stalled|fused|forged|attributed/i,
  );
});

test("empty ticket and empty stdin classify creased", () => {
  assert.equal(classify(emptyTicket()), "creased");
  assert.equal(classify(""), "creased");
  assert.equal(classify(null), "creased");
  assert.equal(decideSeed("creased").verdict, "creased");
  assert.equal(decideSeed("open").verdict, "creased");
});

test("seeded bled #91443 is alarm with CRLF bleed and empty-index stageCheckout", () => {
  const result = analyze(seedBled());
  assert.equal(result.verdict, "bled");
  assert.equal(result.alarm, true);
  assert.equal(result.hold, false);
  assert.equal(result.bled, true);
  assert.ok(result.chips.includes("bled"));
  assert.ok(result.chips.includes("crlf-bleed"));
  assert.ok(result.chips.includes("empty-index"));
  assert.ok(result.chips.includes("stage-checkout"));
  assert.ok(result.chips.includes("autocrlf-true"));
  assert.ok(result.chips.includes("gitattributes-missing"));
  assert.ok(result.chips.includes("prettier-fails"));
  assert.ok(result.chips.includes("git-status-clean"));
  assert.ok(result.chips.includes("cli-worktree-lf"));
  assert.ok(result.chips.includes("exclude-claude"));
  assert.ok(result.chips.includes("plain-git-repro"));
  assert.ok(result.chips.includes("has-clear-repro"));
  assert.ok(!result.chips.includes("creased"));
  assert.match(result.contrast.case, /bled/i);
  assert.equal(result.ticket.crlfBleed, true);
  assert.equal(result.ticket.emptyIndex, true);
  assert.equal(result.ticket.eolClaude, CRLF);
  assert.equal(result.ticket.eolTree, LF);
  assert.equal(result.ticket.reporter, REPORTER);
  assert.equal(result.ticket.cliVersion, VERSION);
  assert.equal(result.ticket.platform, WINDOWS);
});

test("data fixtures classify creased vs bled vs named chips", () => {
  assert.equal(classify(readData("creased.json")), "creased");
  assert.equal(classify(readData("bled.json")), "bled");
  assert.equal(classify(readData("91443.json")), "bled");
  assert.equal(classify(readData("crlf.json")), "crlf-bleed");
  assert.equal(classify(readData("empty-index.json")), "empty-index");
  assert.equal(classify(readData("stage-checkout.json")), "stage-checkout");
  assert.equal(classify(readData("autocrlf.json")), "autocrlf-true");
  assert.equal(classify(readData("gitattributes.json")), "gitattributes-missing");
  assert.equal(classify(readData("prettier-fails-clean-status.json")), "prettier-fails");
  assert.equal(classify(readData("cli-worktree-lf.json")), "cli-worktree-lf");
  assert.equal(classify(readData("selective-checkout-paths.json")), "stage-checkout");
  assert.equal(classify(readData("exclude-claude.json")), "exclude-claude");
  assert.equal(classify(readData("plain-git-repro.json")), "plain-git-repro");
  assert.equal(classify(readData("attributes-in-stage1-fix.json")), "attributes-in-stage1-fix");
  assert.equal(classify(readData("autocrlf-false-fix.json")), "autocrlf-false-fix");
  assert.equal(classify(readData("has-clear-repro.json")), "has-clear-repro");
  assert.equal(classify(readData("hold.json")), "hold");
});

test("bled seed is alarm; creased / hold are holds", () => {
  assert.equal(score(seedBled()).alarm, true);
  assert.equal(score(seedBled()).hold, false);
  assert.equal(score(seedCreased()).hold, true);
  assert.equal(score(seedCreased()).alarm, false);
  assert.equal(score(seedHold()).hold, true);
  assert.equal(score(seedCrlfBleed()).alarm, true);
  assert.equal(score(seedEmptyIndex()).alarm, true);
});

test("normalize seeds 91443 without ticket fields", () => {
  const ticket = normalize({ issue: 91443 });
  assert.equal(ticket.crlfBleed, true);
  assert.equal(ticket.emptyIndex, true);
  assert.equal(ticket.stageCheckout, true);
  assert.equal(ticket.reporter, REPORTER);
  assert.equal(classify(ticket), "bled");
});

test("score / decide / handle agree on bled vs creased", () => {
  assert.equal(score(seedBled()).verdict, "bled");
  assert.equal(decide(seedCreased()).verdict, "creased");
  const fail = handle(seedBled());
  const hold = handle(seedCreased());
  const working = handle(seedHold());
  assert.match(fail.hookSpecificOutput.additionalContext, /#91443/);
  assert.match(fail.hookSpecificOutput.additionalContext, /CRLF/);
  assert.match(hold.hookSpecificOutput.additionalContext, /creased/i);
  assert.match(working.hookSpecificOutput.additionalContext, /hold/i);
});

test("decideSeed aliases", () => {
  assert.equal(decideSeed("bled").verdict, "bled");
  assert.equal(decideSeed(91443).verdict, "bled");
  assert.equal(decideSeed("91443").verdict, "bled");
  assert.equal(decideSeed("creased").verdict, "creased");
  assert.equal(decideSeed("hold").verdict, "hold");
  assert.equal(decideSeed("crlf-bleed").verdict, "crlf-bleed");
  assert.equal(decideSeed("empty-index").verdict, "empty-index");
  assert.equal(decideSeed("stage-checkout").verdict, "stage-checkout");
  assert.equal(decideSeed("autocrlf-true").verdict, "autocrlf-true");
});

test("CLI scores data files", () => {
  const bled = spawnSync(
    process.execPath,
    [hookPath(), fileURLToPath(new URL("../data/91443.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(bled.status, 0, bled.stderr);
  assert.equal(JSON.parse(bled.stdout).verdict, "bled");
  assert.equal(JSON.parse(bled.stdout).alarm, true);

  const creased = spawnSync(
    process.execPath,
    [hookPath(), fileURLToPath(new URL("../data/creased.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(creased.status, 0, creased.stderr);
  assert.equal(JSON.parse(creased.stdout).verdict, "creased");
  assert.equal(JSON.parse(creased.stdout).hold, true);

  const hold = spawnSync(
    process.execPath,
    [hookPath(), fileURLToPath(new URL("../data/hold.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(hold.status, 0, hold.stderr);
  assert.equal(JSON.parse(hold.stdout).verdict, "hold");
});

test("constants match the issue facts only", () => {
  assert.equal(FEATURED_ISSUE, 91443);
  assert.deepEqual([...PRIMARY_ISSUES], [91443]);
  assert.equal(COUSIN_ISSUE, 91405);
  assert.deepEqual([...COUSINS], [91405, 88747, 86010, 91438]);
  assert.deepEqual([...CROSS_ECOSYSTEM], []);
  assert.equal(FILED_AT, "2026-09-02T09:12:57Z");
  assert.equal(REPORTER, "mortenklungland-ai");
  assert.equal(VERSION, "2.1.255");
  assert.equal(DESKTOP_VERSION, "1.40609.1.0");
  assert.equal(PLATFORM, "Windows");
  assert.equal(WINDOWS, "Windows 11");
  assert.equal(GIT_VERSION, "2.55.0");
  assert.equal(CORE_AUTOCRLF, "core.autocrlf");
  assert.equal(GITATTRIBUTES, ".gitattributes");
  assert.equal(CREATE_WORKTREE, "createWorktree");
  assert.equal(STAGE_CHECKOUT, "stageCheckout");
  assert.equal(NO_CHECKOUT, "--no-checkout");
  assert.equal(EMPTY_INDEX, "empty index");
  assert.equal(CLAUDE_LAUNCH, ".claude/launch.json");
  assert.equal(CLAUDE_MD, "CLAUDE.md");
  assert.equal(EXCLUDE_CLAUDE, ":(exclude).claude");
  assert.equal(PRETTIER_CHECK, "prettier --check");
  assert.equal(END_OF_LINE, "endOfLine: lf");
  assert.equal(LS_FILES_EOL, "ls-files --eol");
  assert.equal(W_CRLF, "w/crlf");
  assert.equal(CRLF, "CRLF");
  assert.equal(LF, "LF");
  assert.equal(ENTER_WORKTREE, "EnterWorktree");
  assert.equal(ISOLATION_WORKTREE, 'isolation:"worktree"');
  assert.equal(ATTRIBUTES_FILE, "core.attributesFile");
  assert.equal(INFO_ATTRIBUTES, ".git/info/attributes");
  assert.equal(IDLE_WORD, "creased");
  assert.equal(SEEDED_WORD, "bled");
  assert.notEqual(IDLE_WORD, "bled");
  assert.match(TITLE, /Desktop/);
  assert.match(TITLE, /\.gitattributes/);
  assert.match(TITLE, /CRLF/);
  assert.match(TITLE, /core\.autocrlf=true/);
  assert.match(ISSUE_URL, /91443/);
  assert.match(PHRASE, /seats type before the attributes rule/i);
  assert.match(PHRASE, /admit the CRLF already set/);
  assert.match(HUB_LINE, /19:50 reglet/);
  assert.match(HUB_LINE, /admit the CRLF already set/);
  assert.match(MARK, /19:50/);
  assert.match(MARK, /#120/);
  assert.match(MARK, /#91443/);
  assert.match(CONTRAST_NOTE, /DESKTOP WINDOWS STAGED WORKTREE CHECKOUT BEFORE \.GITATTRIBUTES/);
  assert.match(CONTRAST_NOTE, /CRLF/);
  assert.match(CONTRAST_NOTE, /LF/);
  assert.match(CONTRAST_NOTE, /core\.autocrlf/);
  assert.match(CONTRAST_NOTE, /\.gitattributes/);
  assert.match(CONTRAST_NOTE, /stageCheckout/);
  assert.match(CONTRAST_NOTE, /createWorktree/);
  assert.match(CONTRAST_NOTE, /--no-checkout/);
  assert.match(CONTRAST_NOTE, /empty index/);
  assert.match(CONTRAST_NOTE, /\.claude\/launch\.json/);
  assert.match(CONTRAST_NOTE, /CLAUDE\.md/);
  assert.match(CONTRAST_NOTE, /prettier --check/);
  assert.match(CONTRAST_NOTE, /endOfLine: lf/);
  assert.match(CONTRAST_NOTE, /ls-files --eol/);
  assert.match(CONTRAST_NOTE, /w\/crlf/);
  assert.match(CONTRAST_NOTE, /:\(exclude\)\.claude/);
  assert.match(CONTRAST_NOTE, /Windows/);
  assert.match(CONTRAST_NOTE, /Desktop/);
  assert.match(CONTRAST_NOTE, /plain-git repro/);
  assert.match(HYPOTHESIS_NOTE, /NON-BINDING/);
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
  }
  assert.ok(LABELS.includes("has repro"));
  assert.ok(LABELS.includes("platform:windows"));
  assert.ok(LABELS.includes("area:desktop"));
  assert.ok(HOLD_VERDICTS.includes("creased"));
  assert.ok(ALARM_VERDICTS.includes("bled"));
  assert.deepEqual([...CHIPS], [...VERDICTS]);
});

test("chips.json and fingerprints stay aligned", () => {
  const chips = readData("chips.json");
  assert.deepEqual(chips.verdicts, [...VERDICTS]);
  assert.equal(chips.idleWord, "creased");
  assert.equal(chips.seededWord, "bled");
  const fp = readData("fingerprints.json");
  assert.equal(fp.primary, 91443);
  assert.equal(fp.cousin, 91405);
  assert.deepEqual(fp.cousins, [91405, 88747, 86010, 91438]);
  assert.equal(fp.reporter, "mortenklungland-ai");
  assert.equal(fp.version, "2.1.255");
  assert.equal(fp.desktopVersion, "1.40609.1.0");
  assert.equal(fp.platform, "Windows");
  assert.equal(fp.windows, "Windows 11");
  assert.equal(fp.coreAutocrlf, "core.autocrlf");
  assert.equal(fp.gitattributes, ".gitattributes");
  assert.equal(fp.stageCheckout, "stageCheckout");
  assert.equal(fp.createWorktree, "createWorktree");
  const fixtures = readData("fixtures.json");
  assert.equal(fixtures.rows.length, 5);
  assert.equal(fixtures.rows[0].verdict, "bled");
  assert.equal(fixtures.narrativeNotFixture.noCountsInvented, true);
  assert.equal(fixtures.narrativeNotFixture.crlfBleed, true);
});

test("chipsOf on a raw CRLF ticket still marks bled", () => {
  const chips = chipsOf({
    crlfBleed: true,
    emptyIndex: true,
    stageCheckout: true,
    autocrlfTrue: true,
    outputText:
      "bled; #91443; CRLF; stageCheckout; createWorktree; --no-checkout; empty index; .claude/launch.json; CLAUDE.md; prettier --check; core.autocrlf",
  });
  assert.ok(chips.includes("bled"));
  assert.ok(chips.includes("crlf-bleed"));
  assert.ok(chips.includes("empty-index"));
  assert.ok(!chips.includes("creased"));
});

test("cousin #91405 is not conflated with bled primary", () => {
  assert.notEqual(classify(seedCousin()), "bled");
  assert.notEqual(classify({ issue: 91405 }), "bled");
  const cousin = analyze(seedCousin());
  assert.ok(cousin.reasons.some((row) => /91405|cousin/i.test(row)));
});

test("cite-only cousins are not primaries and do not become bled", () => {
  for (const issue of COUSINS) {
    assert.notEqual(classify({ issue }), "bled", String(issue));
    assert.notEqual(issue, FEATURED_ISSUE);
  }
  assert.equal(FEATURED_ISSUE, 91443);
});

test("named verdicts each have a seed and a hold/alarm split", () => {
  assert.equal(analyze(seedCrlfBleed()).verdict, "crlf-bleed");
  assert.equal(analyze(seedEmptyIndex()).verdict, "empty-index");
  assert.equal(analyze(seedStageCheckout()).verdict, "stage-checkout");
  assert.equal(analyze(seedAutocrlfTrue()).verdict, "autocrlf-true");
  assert.equal(analyze(seedGitattributesMissing()).verdict, "gitattributes-missing");
  assert.equal(analyze(seedPrettierFails()).verdict, "prettier-fails");
  assert.equal(analyze(seedGitStatusClean()).verdict, "git-status-clean");
  assert.equal(analyze(seedCliWorktreeLf()).verdict, "cli-worktree-lf");
  assert.equal(analyze(seedExcludeClaude()).verdict, "exclude-claude");
  assert.equal(analyze(seedPlainGitRepro()).verdict, "plain-git-repro");
  assert.equal(analyze(seedAttributesInStage1Fix()).verdict, "attributes-in-stage1-fix");
  assert.equal(analyze(seedAutocrlfFalseFix()).verdict, "autocrlf-false-fix");
  assert.equal(analyze(seedHasClearRepro()).verdict, "has-clear-repro");
  assert.equal(analyze(seedHold()).ticket.regletSeated, true);
  assert.equal(isBled(seedCreased()), false);
  assert.equal(isBled(seedBled()), true);
});

test("living page is a Reglet atelier, idle creased, seeded bled", () => {
  const html = readPage();
  assert.match(html, /<title>Reglet/);
  assert.match(html, /Idle word:\s*creased/);
  assert.match(html, /creased/);
  assert.match(html, /bled/);
  assert.match(html, /crlf-bleed/);
  assert.match(html, /empty-index/);
  assert.match(html, /stage-checkout/);
  assert.match(html, /autocrlf-true/);
  assert.match(html, /gitattributes-missing/);
  assert.match(html, /prettier-fails/);
  assert.match(html, /git-status-clean/);
  assert.match(html, /cli-worktree-lf/);
  assert.match(html, /exclude-claude/);
  assert.match(html, /plain-git-repro/);
  assert.match(html, /attributes-in-stage1-fix/);
  assert.match(html, /autocrlf-false-fix/);
  assert.match(html, /has-clear-repro/);
  assert.match(html, /#91443/);
  assert.match(html, /#91405/);
  assert.match(html, /#88747/);
  assert.match(html, /#86010/);
  assert.match(html, /#91438/);
  assert.match(html, /cousin-not-primary|cousin, not primary/i);
  assert.match(html, /19:50/);
  assert.match(html, /catalog #120/);
  assert.match(html, /CRLF/);
  assert.match(html, /LF/);
  assert.match(html, /core\.autocrlf/);
  assert.match(html, /\.gitattributes/);
  assert.match(html, /stageCheckout/);
  assert.match(html, /createWorktree/);
  assert.match(html, /--no-checkout/);
  assert.match(html, /empty index/);
  assert.match(html, /\.claude\/launch\.json/);
  assert.match(html, /CLAUDE\.md/);
  assert.match(html, /prettier --check/);
  assert.match(html, /endOfLine: lf/);
  assert.match(html, /ls-files --eol/);
  assert.match(html, /w\/crlf/);
  assert.match(html, /:\(exclude\)\.claude/);
  assert.match(html, /Windows/);
  assert.match(html, /Desktop/);
  assert.match(html, /plain-git repro/);
  assert.match(html, /EnterWorktree/);
  assert.match(html, /1\.40609\.1\.0/);
  assert.match(html, /2\.1\.255/);
  assert.match(html, /2\.55\.0/);
  assert.match(html, /mortenklungland-ai/);
  assert.match(html, /family=EB\+Garamond|EB Garamond/);
  assert.match(html, /family=Hanken\+Grotesk|Hanken Grotesk/);
  assert.match(html, /family=Noto\+Sans\+Mono|Noto Sans Mono/);
  assert.match(html, /Seat the reglet/);
  assert.match(html, /Pin idle creased/);
  assert.match(html, /Pin seeded bled/);
  assert.match(html, /Admit the CRLF already set/);
  assert.match(html, /Load fixtures/);
  assert.match(html, /Reset to creased/);
  assert.match(html, /reglet|galley|letterpress/i);
  assert.match(html, /DESKTOP WINDOWS|stageCheckout|core\.autocrlf/i);
  assert.match(html, /#hermes-catalog/);
  assert.match(html, /embed/);
  assert.match(html, /Stay OFF reliquary vault-latch/);
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
  assert.doesNotMatch(html, /Idle word:\s*bled/i);
  assert.doesNotMatch(html, /Idle word:\s*latched/i);
  assert.doesNotMatch(html, /Idle word:\s*vanished/i);
  assert.doesNotMatch(html, /Idle word:\s*sealed/i);
  assert.doesNotMatch(html, /Idle word:\s*dark/i);
  assert.doesNotMatch(html, /Idle word:\s*spurious/i);
  assert.doesNotMatch(html, /Pin idle bled/);
  assert.doesNotMatch(html, /Pin idle latched/);
  assert.doesNotMatch(html, /Pin idle vanished/);
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
  assert.doesNotMatch(html, /family=Literata/);
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

test("README and page stay Reglet, not a clone", () => {
  const readme = readReadme();
  assert.match(readme, /^# Reglet/m);
  assert.match(readme, /Why not a clone/);
  assert.match(
    readme,
    /DESKTOP WINDOWS STAGED WORKTREE CHECKOUT BEFORE \.GITATTRIBUTES IS IN THE INDEX/i,
  );
  assert.match(readme, /NOT \*\*Reliquary\*\*/);
  assert.match(readme, /NOT \*\*Annunciator\*\*/);
  assert.match(readme, /NOT \*\*Caisson\*\*/);
  assert.match(readme, /NOT \*\*Spindle\*\*/);
  assert.match(readme, /NOT \*\*Knell\*\*/);
  assert.match(readme, /NOT \*\*Tumbler\*\*/);
  assert.match(readme, /NOT \*\*Escapement\*\*/);
  assert.match(readme, /NOT \*\*Berth\*\*/);
  assert.match(readme, /NOT \*\*Bollard\*\*/);
  assert.match(readme, /Product name stays \*\*Reglet\*\*/);
  assert.match(readme, /Idle word: \*\*creased\*\*/);
  assert.match(readme, /#91405/);
  assert.match(readme, /#88747/);
  assert.match(readme, /#86010/);
  assert.match(readme, /#91438/);
  assert.match(readme, /CRLF/);
  assert.match(readme, /LF/);
  assert.match(readme, /core\.autocrlf/);
  assert.match(readme, /\.gitattributes/);
  assert.match(readme, /stageCheckout/);
  assert.match(readme, /createWorktree/);
  assert.match(readme, /--no-checkout/);
  assert.match(readme, /empty index/);
  assert.match(readme, /\.claude\/launch\.json/);
  assert.match(readme, /prettier --check/);
  assert.match(readme, /endOfLine: lf/);
  assert.match(readme, /ls-files --eol/);
  assert.match(readme, /w\/crlf/);
  assert.match(readme, /Windows/);
  assert.match(readme, /mortenklungland-ai/);
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
