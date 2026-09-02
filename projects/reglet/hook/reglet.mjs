#!/usr/bin/env node
/**
 * Reglet — letterpress line-spacing strip / galley atelier classifier.
 * A reglet that seats type before the attributes rule is not spacing —
 * it is bleed. Score the strip or admit the CRLF already set.
 *
 *   echo '{"crlfBleed":true,"emptyIndex":true}' | node reglet.mjs
 *   node reglet.mjs ticket.json
 *
 * Idle word is creased (HOLD: reglet seated flat; LF flush across the
 * galley; agent files uncreased).
 * Seeded state is bled / #91443 (CRLF bleed into .claude/** + CLAUDE.md
 * from empty-index stageCheckout under autocrlf).
 * NEVER idle as latched / vanished / sealed / dark / spurious / fenced /
 * swept / tolled / mute / honored / discarded / arrested / skipped /
 * indexed / jumped / chocked / rolled / clasped / sprung / drained /
 * hinged / pealed / warded / pooled / cased / aired / sifted / stocked /
 * stationed / marvered / unpinned / rinsed / literal / choked / opened /
 * stalled / fused / forged / attributed.
 *
 * Primary #91443: Desktop Windows staged worktree checkout runs before
 * .gitattributes is in the index, so .claude/** and CLAUDE.md get CRLF
 * on Windows (core.autocrlf=true). CLI EnterWorktree / Agent
 * isolation:"worktree" stay LF. Plain-git repro in the issue.
 * createWorktree → stageCheckout: (1) git worktree add --no-checkout
 * empty index; (2) selective checkout HEAD -- includes .claude/**
 * and CLAUDE.md but not .gitattributes; (3) empty index → no
 * attributes → autocrlf writes CRLF; (4) background full checkout
 * uses :(exclude).claude and does not rewrite already-checked-out
 * files. prettier --check . (endOfLine: lf) fails on untouched
 * .claude/launch.json while git status is clean. Fixes that make
 * step 2 LF: -c core.autocrlf=false, include .gitattributes in
 * selective checkout, or -c core.attributesFile=…. Workaround:
 * .git/info/attributes with * text=auto eol=lf in the base repo.
 * Claude Desktop 1.40609.1.0 (MSIX), Windows 11, CLI 2.1.255,
 * git 2.55.0 for Windows. Observed 2026-08-31 and 2026-09-02.
 * Reporter mortenklungland-ai. Filed 2026-09-02T09:12:57Z. OPEN.
 * Labels: bug, has repro, platform:windows, area:desktop.
 *
 * Hypothesis only (NON-BINDING): Desktop may optimize spawn latency
 * with stage-1 selective checkout before attributes land. Do not
 * claim source you have not seen beyond the issue's measured repro.
 * Verify against the issue text and discard if wrong.
 *
 * This is a diagnostic scoring bench. NOT an exploit. No payloads.
 * Score whether the strip is creased or bled.
 *
 * NOT Reliquary #91433 (aarch64 O_* EINVAL session vanish / data-loss).
 * NOT Annunciator #91419 (StopFailure false alarms on parent —
 * loud polarity).
 * NOT Caisson #91405 (worktree pool wrong rebind + dirty wipe —
 * related worktree surface, different failure: binding/wipe ≠ CRLF bleed).
 * NOT Spindle #91402 (startup cleanup deletes live sibling Bash outputs).
 * NOT Knell #91298 (Agent-tool silent child death).
 * NOT Tumbler / Escapement / Geneva / Scotch / Carillon / Pintle /
 * Fibula / Virgule / Riddle / Garner / Postern / Sluice.
 * NOT Reveille / callboard / slype muster-roster ink metaphors.
 * NOT Fid #88747 / Toggle #91422 / Collet #53940 (cite only).
 * NOT leftover woodworking / mm-slider / millrace / locksmith /
 * campanology / berth clones.
 * Product name stays Reglet. Do not rename to Reliquary /
 * Annunciator / Caisson / Spindle / Knell / Tumbler / Escapement /
 * Geneva / Scotch / Fibula / Virgule / Riddle / Garner / Pintle /
 * Carillon / Postern / Sluice / Alidade / Cockade / Lye / Clew /
 * Hasp / Berth / Bollard / Reveille / Callboard.
 */

import { readFileSync } from "node:fs";
import { stdin } from "node:process";
import { pathToFileURL } from "node:url";

export const VERDICTS = Object.freeze([
  "creased",
  "bled",
  "crlf-bleed",
  "empty-index",
  "stage-checkout",
  "autocrlf-true",
  "gitattributes-missing",
  "prettier-fails",
  "git-status-clean",
  "cli-worktree-lf",
  "exclude-claude",
  "plain-git-repro",
  "attributes-in-stage1-fix",
  "autocrlf-false-fix",
  "has-clear-repro",
  "hold",
]);
export const IDLE_WORD = "creased";
export const SEEDED_WORD = "bled";
export const HOLD_VERDICTS = Object.freeze(["creased", "hold"]);
export const ALARM_VERDICTS = Object.freeze(
  VERDICTS.filter((name) => !HOLD_VERDICTS.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FEATURED_ISSUE = 91443;
export const PRIMARY_ISSUES = Object.freeze([91443]);
export const COUSINS = Object.freeze([91405, 88747, 86010, 91438]);
export const COUSIN_ISSUE = 91405;
export const CROSS_ECOSYSTEM = Object.freeze([]);
export const BACKUPS = Object.freeze([
  { name: "Platen", issue: 91438 },
  { name: "Jalousie", issue: 87730 },
  { name: "Fairlead", issue: 88423 },
]);
export const NOT_PRODUCTS = Object.freeze([
  "reliquary",
  "annunciator",
  "caisson",
  "spindle",
  "knell",
  "tumbler",
  "escapement",
  "geneva",
  "scotch",
  "fibula",
  "virgule",
  "riddle",
  "garner",
  "pintle",
  "carillon",
  "postern",
  "sluice",
  "alidade",
  "cockade",
  "lye",
  "clew",
  "hasp",
  "berth",
  "bollard",
  "reveille",
  "callboard",
  "fid",
  "toggle",
  "collet",
  "woodworking",
  "mm-slider",
  "millrace",
  "locksmith",
  "campanology",
  "berth clones",
]);
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/91443";
export const TITLE =
  "[BUG] Desktop: staged worktree checkout runs before .gitattributes is in the index, so .claude/** and CLAUDE.md get CRLF on Windows (core.autocrlf=true)";
export const FILED_AT = "2026-09-02T09:12:57Z";
export const UPDATED_AT = "2026-09-02T09:13:58Z";
export const LABELS = Object.freeze([
  "bug",
  "has repro",
  "platform:windows",
  "area:desktop",
]);
export const REPORTER = "mortenklungland-ai";
export const VERSION = "2.1.255";
export const DESKTOP_VERSION = "1.40609.1.0";
export const DESKTOP_CHANNEL = "MSIX";
export const PLATFORM = "Windows";
export const WINDOWS = "Windows 11";
export const GIT_VERSION = "2.55.0";
export const CORE_AUTOCRLF = "core.autocrlf";
export const AUTOCRLF_TRUE = "true";
export const GITATTRIBUTES = ".gitattributes";
export const GITATTRIBUTES_RULE = "* text=auto eol=lf";
export const CREATE_WORKTREE = "createWorktree";
export const STAGE_CHECKOUT = "stageCheckout";
export const NO_CHECKOUT = "--no-checkout";
export const EMPTY_INDEX = "empty index";
export const CLAUDE_LAUNCH = ".claude/launch.json";
export const CLAUDE_MD = "CLAUDE.md";
export const CLAUDE_GLOB = ".claude/**";
export const EXCLUDE_CLAUDE = ":(exclude).claude";
export const PRETTIER_CHECK = "prettier --check";
export const END_OF_LINE = "endOfLine: lf";
export const LS_FILES_EOL = "ls-files --eol";
export const W_CRLF = "w/crlf";
export const CRLF = "CRLF";
export const LF = "LF";
export const ENTER_WORKTREE = "EnterWorktree";
export const ISOLATION_WORKTREE = 'isolation:"worktree"';
export const ATTRIBUTES_FILE = "core.attributesFile";
export const INFO_ATTRIBUTES = ".git/info/attributes";
export const LOG_STAGE1 = "stage1=";
export const OBSERVED = Object.freeze(["2026-08-31", "2026-09-02"]);
export const HUB_LINE =
  "19:50 reglet: a reglet that seats type before the attributes rule is not spacing — it is bleed. Score the strip or admit the CRLF already set.";
export const MARK = "19:50 / hermes catalog #120 / #91443";
export const PHRASE =
  "a reglet that seats type before the attributes rule is not spacing — it is bleed. Score the strip or admit the CRLF already set.";
export const HYPOTHESIS_NOTE =
  "NON-BINDING: Desktop may optimize spawn latency with stage-1 selective checkout before attributes land. Do not claim source you have not seen beyond the issue's measured repro. Verify against the issue text and discard if wrong.";
export const CONTRAST_NOTE =
  "This is DESKTOP WINDOWS STAGED WORKTREE CHECKOUT BEFORE .GITATTRIBUTES IS IN THE INDEX → .claude/** AND CLAUDE.md GET CRLF UNDER core.autocrlf=true; PRETTIER FAILS WHILE GIT STATUS CLEAN; CLI WORKTREES STAY LF; PLAIN-GIT REPRO; AREA:DESKTOP. createWorktree → stageCheckout: git worktree add --no-checkout leaves an empty index; selective checkout HEAD -- includes .claude/** and CLAUDE.md but not .gitattributes; empty index → no attributes → autocrlf writes CRLF; background full checkout uses :(exclude).claude and leaves the bleed. prettier --check . (endOfLine: lf) fails on untouched .claude/launch.json while git status is clean. CLI EnterWorktree / Agent isolation:\"worktree\" stay LF. plain-git repro: ls-files --eol shows w/crlf attr/. Fixes: -c core.autocrlf=false, include .gitattributes in stage-1, or -c core.attributesFile=…. Workaround: .git/info/attributes with * text=auto eol=lf. Reporter mortenklungland-ai. Claude Desktop 1.40609.1.0 (MSIX), Windows 11, CLI 2.1.255, git 2.55.0.";
export const FORBIDDEN_IDLE = Object.freeze([
  "latched",
  "vanished",
  "sealed",
  "dark",
  "spurious",
  "fenced",
  "swept",
  "tolled",
  "mute",
  "honored",
  "discarded",
  "arrested",
  "skipped",
  "indexed",
  "jumped",
  "chocked",
  "rolled",
  "clasped",
  "sprung",
  "drained",
  "hinged",
  "pealed",
  "warded",
  "pooled",
  "cased",
  "aired",
  "sifted",
  "stocked",
  "stationed",
  "marvered",
  "unpinned",
  "rinsed",
  "literal",
  "choked",
  "opened",
  "stalled",
  "fused",
  "forged",
  "attributed",
]);
export const BANNED_NAMES = Object.freeze([
  "Reliquary",
  "Annunciator",
  "Caisson",
  "Spindle",
  "Knell",
  "Tumbler",
  "Escapement",
  "Geneva",
  "Scotch",
  "Fibula",
  "Virgule",
  "Riddle",
  "Garner",
  "Pintle",
  "Carillon",
  "Postern",
  "Sluice",
  "Berth",
  "Bollard",
  "Reveille",
  "Callboard",
]);
export const FORBIDDEN_UI = Object.freeze([
  "vault-latch relic case",
  "industrial amber annunciator",
  "dry-dock steel caisson",
  "chip-sweep ways",
  "funeral bell rope",
  "pin-tumbler keyway desk",
  "maltese-cross geneva",
  "wagon scotch-block",
  "composing stick case",
  "riddle-sieve mesh",
  "grain loft garner",
  "muster-roster ink",
]);

function firstText(...values) {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return "";
}

function firstNum(...values) {
  for (const value of values) {
    if (typeof value === "number" && Number.isFinite(value)) return value;
    if (typeof value === "string" && value.trim() && Number.isFinite(Number(value))) {
      return Number(value);
    }
  }
  return null;
}

function firstBool(...values) {
  for (const value of values) {
    if (typeof value === "boolean") return value;
  }
  return null;
}

function blankTicket() {
  return {
    seed: "",
    issue: null,
    title: "",
    url: "",
    source: "",
    isolation: "",
    cousin: "",
    regletSeated: null,
    lfFlush: null,
    agentFilesUncreased: null,
    crlfBleed: null,
    emptyIndex: null,
    stageCheckout: null,
    autocrlfTrue: null,
    gitattributesMissing: null,
    prettierFails: null,
    gitStatusClean: null,
    cliWorktreeLf: null,
    excludeClaude: null,
    plainGitRepro: null,
    attributesInStage1Fix: null,
    autocrlfFalseFix: null,
    hasClearRepro: null,
    createWorktree: null,
    noCheckout: null,
    eolClaude: "",
    eolTree: "",
    lsFilesEol: "",
    wCrlf: "",
    prettierCheck: "",
    endOfLine: "",
    gitStatus: "",
    coreAutocrlf: "",
    gitattributes: "",
    stageCheckoutPath: "",
    platform: "",
    desktopVersion: "",
    cliVersion: "",
    gitVersion: "",
    reporter: "",
    observed: "",
    isolationWorktree: "",
    enterWorktree: "",
    outputText: "",
  };
}

export function seedCreased() {
  return {
    ...blankTicket(),
    seed: IDLE_WORD,
    issue: null,
    source: "atelier",
    regletSeated: true,
    lfFlush: true,
    agentFilesUncreased: true,
    crlfBleed: false,
    emptyIndex: false,
    stageCheckout: false,
    autocrlfTrue: false,
    gitattributesMissing: false,
    prettierFails: false,
    gitStatusClean: true,
    cliWorktreeLf: true,
    excludeClaude: false,
    plainGitRepro: false,
    attributesInStage1Fix: true,
    autocrlfFalseFix: false,
    hasClearRepro: false,
    createWorktree: true,
    noCheckout: false,
    eolClaude: LF,
    eolTree: LF,
    lsFilesEol: "w/lf",
    wCrlf: "",
    prettierCheck: PRETTIER_CHECK,
    endOfLine: END_OF_LINE,
    gitStatus: "clean",
    coreAutocrlf: AUTOCRLF_TRUE,
    gitattributes: GITATTRIBUTES_RULE,
    stageCheckoutPath: STAGE_CHECKOUT,
    platform: WINDOWS,
    desktopVersion: DESKTOP_VERSION,
    cliVersion: VERSION,
    gitVersion: GIT_VERSION,
    reporter: "",
    observed: "",
    isolationWorktree: ISOLATION_WORKTREE,
    enterWorktree: ENTER_WORKTREE,
    outputText:
      "creased; reglet seated flat; LF flush across the galley; agent files uncreased; .gitattributes seated before type; idle word creased",
  };
}

export function seedBled() {
  return {
    ...blankTicket(),
    seed: SEEDED_WORD,
    issue: FEATURED_ISSUE,
    title: TITLE,
    url: ISSUE_URL,
    source: "atelier",
    regletSeated: false,
    lfFlush: false,
    agentFilesUncreased: false,
    crlfBleed: true,
    emptyIndex: true,
    stageCheckout: true,
    autocrlfTrue: true,
    gitattributesMissing: true,
    prettierFails: true,
    gitStatusClean: true,
    cliWorktreeLf: true,
    excludeClaude: true,
    plainGitRepro: true,
    attributesInStage1Fix: false,
    autocrlfFalseFix: false,
    hasClearRepro: true,
    createWorktree: true,
    noCheckout: true,
    eolClaude: CRLF,
    eolTree: LF,
    lsFilesEol: LS_FILES_EOL,
    wCrlf: W_CRLF,
    prettierCheck: PRETTIER_CHECK,
    endOfLine: END_OF_LINE,
    gitStatus: "clean",
    coreAutocrlf: `${CORE_AUTOCRLF}=${AUTOCRLF_TRUE}`,
    gitattributes: GITATTRIBUTES_RULE,
    stageCheckoutPath: STAGE_CHECKOUT,
    platform: WINDOWS,
    desktopVersion: DESKTOP_VERSION,
    cliVersion: VERSION,
    gitVersion: GIT_VERSION,
    reporter: REPORTER,
    observed: OBSERVED.join(" and "),
    isolationWorktree: ISOLATION_WORKTREE,
    enterWorktree: ENTER_WORKTREE,
    outputText:
      "bled; #91443; CRLF bleed into .claude/** + CLAUDE.md from empty-index stageCheckout under core.autocrlf=true; prettier --check fails on .claude/launch.json while git status is clean; CLI EnterWorktree / isolation:\"worktree\" stay LF; plain-git repro ls-files --eol w/crlf attr/; createWorktree → stageCheckout after git worktree add --no-checkout; :(exclude).claude leaves the bleed; Windows Desktop 1.40609.1.0 MSIX; CLI 2.1.255; git 2.55.0; mortenklungland-ai; area:desktop",
  };
}

export function seedCrlfBleed() {
  return {
    ...blankTicket(),
    seed: "crlf-bleed",
    source: "atelier",
    crlfBleed: true,
    eolClaude: CRLF,
    eolTree: LF,
    outputText:
      "crlf-bleed; CRLF in .claude/** and CLAUDE.md only; rest of tree LF per .gitattributes",
  };
}

export function seedEmptyIndex() {
  return {
    ...blankTicket(),
    seed: "empty-index",
    source: "atelier",
    emptyIndex: true,
    noCheckout: true,
    outputText:
      "empty-index; git worktree add --no-checkout leaves the new worktree index empty",
  };
}

export function seedStageCheckout() {
  return {
    ...blankTicket(),
    seed: "stage-checkout",
    source: "atelier",
    stageCheckout: true,
    createWorktree: true,
    outputText:
      "stage-checkout; createWorktree → stageCheckout selective checkout HEAD -- includes .claude/** and CLAUDE.md",
  };
}

export function seedAutocrlfTrue() {
  return {
    ...blankTicket(),
    seed: "autocrlf-true",
    source: "atelier",
    autocrlfTrue: true,
    coreAutocrlf: `${CORE_AUTOCRLF}=${AUTOCRLF_TRUE}`,
    platform: WINDOWS,
    outputText:
      "autocrlf-true; Windows default core.autocrlf=true writes CRLF when no attributes are in the index",
  };
}

export function seedGitattributesMissing() {
  return {
    ...blankTicket(),
    seed: "gitattributes-missing",
    source: "atelier",
    gitattributesMissing: true,
    gitattributes: GITATTRIBUTES,
    outputText:
      "gitattributes-missing; .gitattributes is not in the stage-1 selective checkout path list",
  };
}

export function seedPrettierFails() {
  return {
    ...blankTicket(),
    seed: "prettier-fails",
    source: "atelier",
    prettierFails: true,
    prettierCheck: PRETTIER_CHECK,
    endOfLine: END_OF_LINE,
    outputText:
      "prettier-fails; prettier --check . (endOfLine: lf) fails on untouched .claude/launch.json",
  };
}

export function seedGitStatusClean() {
  return {
    ...blankTicket(),
    seed: "git-status-clean",
    source: "atelier",
    gitStatusClean: true,
    gitStatus: "clean",
    outputText:
      "git-status-clean; git status reports the tree clean (autocrlf makes CRLF match the LF blob on read)",
  };
}

export function seedCliWorktreeLf() {
  return {
    ...blankTicket(),
    seed: "cli-worktree-lf",
    source: "atelier",
    cliWorktreeLf: true,
    enterWorktree: ENTER_WORKTREE,
    isolationWorktree: ISOLATION_WORKTREE,
    eolTree: LF,
    outputText:
      "cli-worktree-lf; CLI EnterWorktree / Agent isolation:\"worktree\" stay LF throughout",
  };
}

export function seedExcludeClaude() {
  return {
    ...blankTicket(),
    seed: "exclude-claude",
    source: "atelier",
    excludeClaude: true,
    outputText:
      "exclude-claude; background full checkout uses :(exclude).claude and does not rewrite already-checked-out files",
  };
}

export function seedPlainGitRepro() {
  return {
    ...blankTicket(),
    seed: "plain-git-repro",
    source: "atelier",
    plainGitRepro: true,
    lsFilesEol: LS_FILES_EOL,
    wCrlf: W_CRLF,
    outputText:
      "plain-git-repro; worktree add --no-checkout, checkout HEAD -- .claude/launch.json CLAUDE.md, ls-files --eol shows w/crlf attr/; then full checkout still leaves those CRLF",
  };
}

export function seedAttributesInStage1Fix() {
  return {
    ...blankTicket(),
    seed: "attributes-in-stage1-fix",
    source: "atelier",
    attributesInStage1Fix: true,
    gitattributes: GITATTRIBUTES,
    outputText:
      "attributes-in-stage1-fix; including .gitattributes in the same selective checkout makes step 2 come out LF",
  };
}

export function seedAutocrlfFalseFix() {
  return {
    ...blankTicket(),
    seed: "autocrlf-false-fix",
    source: "atelier",
    autocrlfFalseFix: true,
    coreAutocrlf: `${CORE_AUTOCRLF}=false`,
    outputText:
      "autocrlf-false-fix; git -c core.autocrlf=false checkout HEAD -- … makes step 2 come out LF",
  };
}

export function seedHasClearRepro() {
  return {
    ...blankTicket(),
    seed: "has-clear-repro",
    source: "atelier",
    hasClearRepro: true,
    issue: FEATURED_ISSUE,
    reporter: REPORTER,
    platform: WINDOWS,
    desktopVersion: DESKTOP_VERSION,
    outputText:
      "has-clear-repro; mortenklungland-ai filed #91443; has repro; platform:windows; area:desktop; Claude Desktop 1.40609.1.0 MSIX; plain-git repro",
  };
}

export function seedHold() {
  return {
    ...seedCreased(),
    seed: "hold",
    outputText:
      "hold; reglet seated flat; LF flush across the galley; the strip holds",
  };
}

export function seedCousin() {
  return {
    ...seedCreased(),
    seed: IDLE_WORD,
    issue: COUSIN_ISSUE,
    isolation: "cousin",
    cousin: String(COUSIN_ISSUE),
    outputText:
      "cousin-not-primary; #91405 Caisson worktree pool wrong rebind — cite only, not the #91443 empty-index stageCheckout CRLF bleed",
  };
}

export function emptyTicket() {
  return seedCreased();
}

export function cloneTicket(input) {
  const src = input && typeof input === "object" ? input : {};
  const nested =
    src.ticket && typeof src.ticket === "object" ? src.ticket : {};
  return {
    seed: firstText(nested.seed, src.seed),
    issue: firstNum(nested.issue, src.issue),
    title: firstText(nested.title, src.title),
    url: firstText(nested.url, src.url),
    source: firstText(nested.source, src.source),
    isolation: firstText(nested.isolation, src.isolation),
    cousin: firstText(nested.cousin, src.cousin),
    regletSeated: firstBool(nested.regletSeated, src.regletSeated),
    lfFlush: firstBool(nested.lfFlush, src.lfFlush),
    agentFilesUncreased: firstBool(
      nested.agentFilesUncreased,
      src.agentFilesUncreased,
    ),
    crlfBleed: firstBool(nested.crlfBleed, src.crlfBleed),
    emptyIndex: firstBool(nested.emptyIndex, src.emptyIndex),
    stageCheckout: firstBool(nested.stageCheckout, src.stageCheckout),
    autocrlfTrue: firstBool(nested.autocrlfTrue, src.autocrlfTrue),
    gitattributesMissing: firstBool(
      nested.gitattributesMissing,
      src.gitattributesMissing,
    ),
    prettierFails: firstBool(nested.prettierFails, src.prettierFails),
    gitStatusClean: firstBool(nested.gitStatusClean, src.gitStatusClean),
    cliWorktreeLf: firstBool(nested.cliWorktreeLf, src.cliWorktreeLf),
    excludeClaude: firstBool(nested.excludeClaude, src.excludeClaude),
    plainGitRepro: firstBool(nested.plainGitRepro, src.plainGitRepro),
    attributesInStage1Fix: firstBool(
      nested.attributesInStage1Fix,
      src.attributesInStage1Fix,
    ),
    autocrlfFalseFix: firstBool(
      nested.autocrlfFalseFix,
      src.autocrlfFalseFix,
    ),
    hasClearRepro: firstBool(nested.hasClearRepro, src.hasClearRepro),
    createWorktree: firstBool(nested.createWorktree, src.createWorktree),
    noCheckout: firstBool(nested.noCheckout, src.noCheckout),
    eolClaude: firstText(nested.eolClaude, src.eolClaude),
    eolTree: firstText(nested.eolTree, src.eolTree),
    lsFilesEol: firstText(nested.lsFilesEol, src.lsFilesEol),
    wCrlf: firstText(nested.wCrlf, src.wCrlf),
    prettierCheck: firstText(nested.prettierCheck, src.prettierCheck),
    endOfLine: firstText(nested.endOfLine, src.endOfLine),
    gitStatus: firstText(nested.gitStatus, src.gitStatus),
    coreAutocrlf: firstText(nested.coreAutocrlf, src.coreAutocrlf),
    gitattributes: firstText(nested.gitattributes, src.gitattributes),
    stageCheckoutPath: firstText(
      nested.stageCheckoutPath,
      src.stageCheckoutPath,
    ),
    platform: firstText(nested.platform, src.platform),
    desktopVersion: firstText(nested.desktopVersion, src.desktopVersion),
    cliVersion: firstText(nested.cliVersion, src.cliVersion),
    gitVersion: firstText(nested.gitVersion, src.gitVersion),
    reporter: firstText(nested.reporter, src.reporter),
    observed: firstText(nested.observed, src.observed),
    isolationWorktree: firstText(
      nested.isolationWorktree,
      src.isolationWorktree,
    ),
    enterWorktree: firstText(nested.enterWorktree, src.enterWorktree),
    outputText: firstText(
      nested.outputText,
      nested.output,
      nested.text,
      src.outputText,
    ),
  };
}

function definedOnly(obj) {
  const out = {};
  for (const [key, value] of Object.entries(obj || {})) {
    if (Array.isArray(value)) {
      if (value.length) out[key] = value;
      continue;
    }
    if (value !== null && value !== undefined && value !== "") out[key] = value;
  }
  return out;
}

function missingCore(input) {
  const row = input && typeof input === "object" ? input : {};
  return (
    row.regletSeated == null &&
    row.lfFlush == null &&
    row.crlfBleed == null &&
    row.emptyIndex == null &&
    row.stageCheckout == null &&
    row.autocrlfTrue == null &&
    row.gitattributesMissing == null &&
    row.prettierFails == null &&
    row.gitStatusClean == null &&
    row.cliWorktreeLf == null &&
    row.plainGitRepro == null
  );
}

const SEED_FNS = {
  [IDLE_WORD]: seedCreased,
  [SEEDED_WORD]: seedBled,
  "crlf-bleed": seedCrlfBleed,
  crlf: seedCrlfBleed,
  "empty-index": seedEmptyIndex,
  "stage-checkout": seedStageCheckout,
  "autocrlf-true": seedAutocrlfTrue,
  autocrlf: seedAutocrlfTrue,
  "gitattributes-missing": seedGitattributesMissing,
  gitattributes: seedGitattributesMissing,
  "prettier-fails": seedPrettierFails,
  "git-status-clean": seedGitStatusClean,
  "cli-worktree-lf": seedCliWorktreeLf,
  "exclude-claude": seedExcludeClaude,
  "plain-git-repro": seedPlainGitRepro,
  "attributes-in-stage1-fix": seedAttributesInStage1Fix,
  "autocrlf-false-fix": seedAutocrlfFalseFix,
  "has-clear-repro": seedHasClearRepro,
  hold: seedHold,
  cousin: seedCousin,
  91405: seedCousin,
};

export function normalize(input) {
  if (input == null) return emptyTicket();
  if (typeof input === "string") {
    const trimmed = input.trim();
    if (!trimmed) return emptyTicket();
    if (trimmed.startsWith("{")) {
      try {
        return normalize(JSON.parse(trimmed));
      } catch {
        return emptyTicket();
      }
    }
    return emptyTicket();
  }
  if (typeof input !== "object") return emptyTicket();
  const cloned = definedOnly(cloneTicket(input));
  const raw = definedOnly(input);
  const issue = cloned.issue ?? raw.issue;
  const coreMissing = missingCore(input) && missingCore(cloned);
  if ((issue === FEATURED_ISSUE || raw.issue === FEATURED_ISSUE) && coreMissing) {
    return { ...seedBled(), ...cloned, ...raw };
  }
  if (COUSINS.includes(issue) && coreMissing) {
    return {
      ...seedCousin(),
      ...cloned,
      ...raw,
      issue,
      cousin: String(issue),
    };
  }
  const seedFn = SEED_FNS[String(cloned.seed || "")];
  if (seedFn && coreMissing) {
    return { ...seedFn(), ...cloned, ...raw };
  }
  return { ...blankTicket(), ...cloned, ...raw };
}

function textOf(ticket) {
  return [
    ticket.outputText,
    ticket.title,
    ticket.cousin,
    ticket.seed,
    ticket.reporter,
    ticket.platform,
    ticket.coreAutocrlf,
    ticket.gitattributes,
    ticket.eolClaude,
    ticket.lsFilesEol,
    ticket.wCrlf,
    ticket.prettierCheck,
    ticket.enterWorktree,
  ]
    .filter(Boolean)
    .join("\n");
}

function canonicalSeed(seed) {
  const raw = String(seed || "");
  if (VERDICTS.includes(raw)) return raw;
  const lower = raw.toLowerCase();
  return VERDICTS.find((name) => name.toLowerCase() === lower) || lower;
}

export function isCreased(ticket) {
  const row = cloneTicket(ticket);
  if (row.isolation === "cousin") return true;
  if (canonicalSeed(row.seed) === IDLE_WORD) return true;
  if (canonicalSeed(row.seed) === "hold") return true;
  if (
    row.regletSeated === true &&
    row.lfFlush === true &&
    row.crlfBleed !== true &&
    row.emptyIndex !== true &&
    row.prettierFails !== true &&
    row.gitattributesMissing !== true
  ) {
    return true;
  }
  return false;
}

export function isBled(ticket) {
  const row = cloneTicket(ticket);
  const named = canonicalSeed(row.seed);
  if (named === IDLE_WORD || named === "hold") return false;
  if (COUSINS.includes(row.issue) && named !== SEEDED_WORD) return false;
  if (named === SEEDED_WORD) return true;
  if (row.issue === FEATURED_ISSUE && named !== IDLE_WORD) return true;
  if (
    (row.crlfBleed === true && row.emptyIndex === true) ||
    (row.stageCheckout === true &&
      row.gitattributesMissing === true &&
      row.autocrlfTrue === true) ||
    (row.crlfBleed === true &&
      row.prettierFails === true &&
      row.gitStatusClean === true)
  ) {
    return true;
  }
  return false;
}

export function flagsOf(ticket) {
  const row = cloneTicket(ticket);
  const text = textOf(row);
  const named = canonicalSeed(row.seed);
  const cousinOnly =
    (COUSINS.includes(row.issue) ||
      /cousin-not-primary|#91405|#88747|#86010|#91438/i.test(text)) &&
    named !== SEEDED_WORD &&
    row.issue !== FEATURED_ISSUE;
  const bledNow = !cousinOnly && isBled(row);
  const creasedNow = !bledNow && isCreased(row);
  const crlfBleed =
    row.crlfBleed === true ||
    row.eolClaude === CRLF ||
    named === "crlf-bleed" ||
    /crlf-bleed|CRLF bleed|CRLF in \.claude/i.test(text);
  const emptyIndex =
    row.emptyIndex === true ||
    row.noCheckout === true ||
    named === "empty-index" ||
    /empty-index|empty index|--no-checkout/i.test(text);
  const stageCheckout =
    row.stageCheckout === true ||
    row.createWorktree === true ||
    named === "stage-checkout" ||
    /stage-checkout|stageCheckout|createWorktree/i.test(text);
  const autocrlfTrue =
    row.autocrlfTrue === true ||
    named === "autocrlf-true" ||
    /autocrlf-true|core\.autocrlf=true|core\.autocrlf/i.test(text);
  const gitattributesMissing =
    row.gitattributesMissing === true ||
    named === "gitattributes-missing" ||
    /gitattributes-missing|\.gitattributes.*missing|not \.gitattributes/i.test(
      text,
    );
  const prettierFails =
    row.prettierFails === true ||
    named === "prettier-fails" ||
    /prettier-fails|prettier --check/i.test(text);
  const gitStatusClean =
    row.gitStatusClean === true ||
    named === "git-status-clean" ||
    /git-status-clean|git status.*clean/i.test(text);
  const cliWorktreeLf =
    row.cliWorktreeLf === true ||
    named === "cli-worktree-lf" ||
    /cli-worktree-lf|EnterWorktree|isolation:"worktree"/i.test(text);
  const excludeClaude =
    row.excludeClaude === true ||
    named === "exclude-claude" ||
    /exclude-claude|:\(exclude\)\.claude/i.test(text);
  const plainGitRepro =
    row.plainGitRepro === true ||
    named === "plain-git-repro" ||
    /plain-git-repro|ls-files --eol|w\/crlf/i.test(text);
  const attributesInStage1Fix =
    row.attributesInStage1Fix === true ||
    named === "attributes-in-stage1-fix" ||
    /attributes-in-stage1-fix|include \.gitattributes/i.test(text);
  const autocrlfFalseFix =
    row.autocrlfFalseFix === true ||
    named === "autocrlf-false-fix" ||
    /autocrlf-false-fix|core\.autocrlf=false/i.test(text);
  const hasClearRepro =
    row.hasClearRepro === true ||
    named === "has-clear-repro" ||
    /has-clear-repro|mortenklungland-ai|has repro|platform:windows|area:desktop/i.test(
      text,
    );
  const bled =
    named !== IDLE_WORD &&
    named !== "hold" &&
    !cousinOnly &&
    (bledNow || named === SEEDED_WORD || /bled|#91443/i.test(text));
  const creased =
    named === IDLE_WORD || named === "hold" || (creasedNow && !bled);
  return {
    named,
    cousinOnly,
    bledNow,
    creasedNow,
    crlfBleed,
    emptyIndex,
    stageCheckout,
    autocrlfTrue,
    gitattributesMissing,
    prettierFails,
    gitStatusClean,
    cliWorktreeLf,
    excludeClaude,
    plainGitRepro,
    attributesInStage1Fix,
    autocrlfFalseFix,
    hasClearRepro,
    bled,
    creased,
  };
}

export function chipsOf(ticket) {
  const flags = flagsOf(ticket);
  const chips = [];
  if (flags.creased && !flags.bled) chips.push("creased");
  if (flags.bled) chips.push("bled");
  if (flags.crlfBleed && flags.bled) chips.push("crlf-bleed");
  if (flags.emptyIndex && flags.bled) chips.push("empty-index");
  if (flags.stageCheckout && flags.bled) chips.push("stage-checkout");
  if (flags.autocrlfTrue && flags.bled) chips.push("autocrlf-true");
  if (flags.gitattributesMissing && flags.bled) {
    chips.push("gitattributes-missing");
  }
  if (flags.prettierFails && flags.bled) chips.push("prettier-fails");
  if (flags.gitStatusClean && flags.bled) chips.push("git-status-clean");
  if (flags.cliWorktreeLf && flags.bled) chips.push("cli-worktree-lf");
  if (flags.excludeClaude && flags.bled) chips.push("exclude-claude");
  if (flags.plainGitRepro && flags.bled) chips.push("plain-git-repro");
  if (flags.attributesInStage1Fix && flags.bled) {
    chips.push("attributes-in-stage1-fix");
  }
  if (flags.autocrlfFalseFix && flags.bled) chips.push("autocrlf-false-fix");
  if (flags.hasClearRepro && flags.bled) chips.push("has-clear-repro");
  if ((flags.creased || flags.named === "hold") && !flags.bled) {
    chips.push("hold");
  }
  if (ticket.seed && VERDICTS.includes(ticket.seed)) chips.push(ticket.seed);
  return [...new Set(chips)];
}

function reasonsOf(ticket, flags, verdict) {
  const reasons = [];
  if (verdict === "creased") {
    reasons.push(
      "creased; reglet seated flat; LF flush across the galley; agent files uncreased",
    );
    reasons.push(
      "hold: the reglet seats .gitattributes before type; LF across the strip",
    );
  }
  if (verdict === "hold") {
    reasons.push(
      "hold; reglet seated flat; LF flush across the galley; the strip holds",
    );
  }
  if (verdict === "bled" || flags.bled) {
    reasons.push(
      "bled; #91443; CRLF bleed into .claude/** + CLAUDE.md from empty-index stageCheckout under core.autocrlf=true",
    );
  }
  if (flags.crlfBleed || verdict === "crlf-bleed") {
    reasons.push(
      "crlf-bleed; CRLF in .claude/** and CLAUDE.md only; rest of tree LF per .gitattributes (* text=auto eol=lf)",
    );
  }
  if (flags.emptyIndex || verdict === "empty-index") {
    reasons.push(
      "empty-index; git worktree add --no-checkout leaves the new worktree index empty so git never sees attributes",
    );
  }
  if (flags.stageCheckout || verdict === "stage-checkout") {
    reasons.push(
      "stage-checkout; createWorktree → stageCheckout selective checkout HEAD -- includes .claude/** and CLAUDE.md but not .gitattributes",
    );
  }
  if (flags.autocrlfTrue || verdict === "autocrlf-true") {
    reasons.push(
      "autocrlf-true; Windows default core.autocrlf=true writes CRLF when the index has no attributes",
    );
  }
  if (flags.gitattributesMissing || verdict === "gitattributes-missing") {
    reasons.push(
      "gitattributes-missing; .gitattributes is absent from the stage-1 selective checkout path list",
    );
  }
  if (flags.prettierFails || verdict === "prettier-fails") {
    reasons.push(
      "prettier-fails; prettier --check . (endOfLine: lf) fails on untouched .claude/launch.json",
    );
  }
  if (flags.gitStatusClean || verdict === "git-status-clean") {
    reasons.push(
      "git-status-clean; git status reports the tree clean (autocrlf makes CRLF match the LF blob on read)",
    );
  }
  if (flags.cliWorktreeLf || verdict === "cli-worktree-lf") {
    reasons.push(
      "cli-worktree-lf; CLI EnterWorktree / Agent isolation:\"worktree\" stay LF throughout",
    );
  }
  if (flags.excludeClaude || verdict === "exclude-claude") {
    reasons.push(
      "exclude-claude; background full checkout uses :(exclude).claude and does not rewrite already-checked-out files",
    );
  }
  if (flags.plainGitRepro || verdict === "plain-git-repro") {
    reasons.push(
      "plain-git-repro; worktree add --no-checkout, checkout HEAD -- .claude/launch.json CLAUDE.md, ls-files --eol shows w/crlf attr/; full checkout still leaves those CRLF",
    );
  }
  if (flags.attributesInStage1Fix || verdict === "attributes-in-stage1-fix") {
    reasons.push(
      "attributes-in-stage1-fix; include .gitattributes in the same selective checkout so step 2 comes out LF",
    );
  }
  if (flags.autocrlfFalseFix || verdict === "autocrlf-false-fix") {
    reasons.push(
      "autocrlf-false-fix; git -c core.autocrlf=false checkout HEAD -- … makes step 2 come out LF",
    );
  }
  if (flags.hasClearRepro || verdict === "has-clear-repro") {
    reasons.push(
      `has-clear-repro; ${REPORTER} filed #${FEATURED_ISSUE}; has repro; ${PLATFORM}; ${WINDOWS}; Desktop ${DESKTOP_VERSION} ${DESKTOP_CHANNEL}; CLI ${VERSION}; git ${GIT_VERSION}; area:desktop`,
    );
  }
  if (flags.cousinOnly) {
    reasons.push(
      "cousin is not Reglet; cite-only #91405 Caisson worktree pool wrong rebind / #88747 absolute core.hooksPath / #86010 detached window image viewer / #91438 detached preview dead-click, not the #91443 empty-index stageCheckout CRLF bleed",
    );
  }
  if (verdict === "bled" || flags.bled) {
    reasons.push(HYPOTHESIS_NOTE);
    reasons.push(CONTRAST_NOTE);
  }
  if (verdict !== "creased" && verdict !== "hold") {
    reasons.push(PHRASE);
  }
  return reasons;
}

function pickVerdict(seed, flags) {
  const named = canonicalSeed(seed);
  if (named === IDLE_WORD && (flags.creased || !flags.bled)) return "creased";
  if (named === "hold" && !flags.bled) return "hold";
  if (named === SEEDED_WORD) return "bled";
  if (VERDICTS.includes(named) && named !== IDLE_WORD && named !== "hold") {
    return named;
  }
  if (flags.cousinOnly) return "creased";
  if (flags.bled) return "bled";
  if (flags.creased) return "creased";
  return "creased";
}

function chamberOf(flags, ticket, verdict) {
  if (verdict === "bled" || flags.bled) {
    return {
      case: "bled — CRLF already set on the agent strip",
      rope: "empty-index stageCheckout under core.autocrlf=true; .gitattributes missing from stage-1",
      clapper: `prettier --check fails · git status clean · ${W_CRLF} on ${CLAUDE_LAUNCH}`,
      chamber: ".claude/** + CLAUDE.md CRLF; rest of tree LF; CLI worktrees stay LF",
      mark: "reglet seated type before the attributes rule; admit the CRLF already set",
      note: PHRASE,
    };
  }
  if (verdict === "hold") {
    return {
      case: "creased — reglet seated flat; LF flush",
      rope: ".gitattributes in the index before type; no CRLF bleed",
      clapper: "prettier --check quiet; agent files uncreased",
      chamber: "the strip holds; nothing to score",
      mark: "reglet seated; the galley holds",
      note: "Hold: the reglet is seated.",
    };
  }
  return {
    case: "creased — reglet seated flat; LF flush",
    rope: "attributes rule seated before type; LF across the galley",
    clapper: "stage-1 sees .gitattributes; agent files uncreased",
    chamber: "warm ink quiet; atelier creased",
    mark: "reglet seated; idle word creased",
    note: "Creased: the reglet holds.",
  };
}

export function analyze(input) {
  const ticket = normalize(input);
  const flags = flagsOf(ticket);
  const chips = chipsOf(ticket);
  const seed = String(ticket.seed || "");
  const verdict = pickVerdict(seed, flags);
  const hold = HOLD_VERDICTS.includes(verdict);
  const bled = verdict === "bled" || flags.bled;
  return {
    verdict,
    chips,
    reasons: reasonsOf(ticket, flags, verdict),
    creased: verdict === "creased" || (flags.creased && !bled),
    bled,
    hold,
    alarm: !hold,
    idleWord: IDLE_WORD,
    seededWord: SEEDED_WORD,
    flags,
    contrast: chamberOf(flags, ticket, verdict),
    issue: ticket.issue ?? null,
    mark: MARK,
    ticket,
  };
}

export function classify(input) {
  return analyze(input).verdict;
}

export function score(input) {
  return analyze(input);
}

export function decide(input) {
  return analyze(input);
}

export function decideSeed(name) {
  if (name === SEEDED_WORD || name === 91443 || name === "91443") {
    return analyze(seedBled());
  }
  if (name === "crlf-bleed" || name === "crlf") {
    return analyze(seedCrlfBleed());
  }
  if (name === "empty-index") return analyze(seedEmptyIndex());
  if (name === "stage-checkout") return analyze(seedStageCheckout());
  if (name === "autocrlf-true" || name === "autocrlf") {
    return analyze(seedAutocrlfTrue());
  }
  if (name === "gitattributes-missing" || name === "gitattributes") {
    return analyze(seedGitattributesMissing());
  }
  if (name === "prettier-fails") return analyze(seedPrettierFails());
  if (name === "git-status-clean") return analyze(seedGitStatusClean());
  if (name === "cli-worktree-lf") return analyze(seedCliWorktreeLf());
  if (name === "exclude-claude") return analyze(seedExcludeClaude());
  if (name === "plain-git-repro") return analyze(seedPlainGitRepro());
  if (name === "attributes-in-stage1-fix") {
    return analyze(seedAttributesInStage1Fix());
  }
  if (name === "autocrlf-false-fix") return analyze(seedAutocrlfFalseFix());
  if (name === "has-clear-repro") return analyze(seedHasClearRepro());
  if (name === "hold") return analyze(seedHold());
  if (name === IDLE_WORD || name === "creased" || name === "open") {
    return analyze(seedCreased());
  }
  if (
    name === 91405 ||
    name === "91405" ||
    name === "cousin" ||
    name === 88747 ||
    name === "88747" ||
    name === 86010 ||
    name === "86010" ||
    name === 91438 ||
    name === "91438"
  ) {
    return analyze(seedCousin());
  }
  if (SEED_FNS[name]) return analyze(SEED_FNS[name]());
  return analyze(seedCreased());
}

export function handle(input) {
  const result = analyze(input);
  return {
    ...result,
    hookSpecificOutput: {
      additionalContext:
        result.verdict === "bled" || (result.bled && result.alarm)
          ? `bled reglet #${FEATURED_ISSUE}: CRLF bleed into .claude/** + CLAUDE.md from empty-index stageCheckout under core.autocrlf=true. ${HYPOTHESIS_NOTE}`
          : result.verdict === "hold"
            ? "hold. Reglet seated flat; LF flush across the galley. Seat the reglet."
            : `creased reglet. Idle word ${IDLE_WORD}. Reglet seated flat; LF flush; agent files uncreased.`,
    },
  };
}

function readArgTicket(argv) {
  const file = argv[2];
  if (!file || file === "-") return null;
  const raw = readFileSync(file, "utf8");
  return normalize(raw);
}

async function readStdin() {
  const chunks = [];
  for await (const chunk of stdin) chunks.push(chunk);
  return Buffer.concat(chunks).toString("utf8");
}

export async function main(argv = process.argv) {
  let ticket = readArgTicket(argv);
  if (!ticket) {
    if (stdin.isTTY) {
      ticket = emptyTicket();
    } else {
      const raw = await readStdin();
      ticket = raw.trim() ? normalize(raw) : emptyTicket();
    }
  }
  const result = handle(ticket);
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  return result;
}

const entry = process.argv[1];
if (entry && import.meta.url === pathToFileURL(entry).href) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
