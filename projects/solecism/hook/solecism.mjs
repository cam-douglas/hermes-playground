#!/usr/bin/env node
/**
 * Solecism — grammar / usage desk / manuscript-margin classifier.
 * A solecism that treats the flag string as the path is not a
 * resolved exclude — it is a literal directory in the main
 * checkout. Score the parse or admit the flag already landed.
 *
 *   echo '{"literal":true,"flagAsPath":true}' | node solecism.mjs
 *   node solecism.mjs ticket.json
 *
 * Idle word is resolved (HOLD: git rev-parse --git-common-dir
 * is executed and its OUTPUT is the path; the exclude lands in
 * .git/info/exclude). Seeded state is literal / #91558
 * (intended write to $(git rev-parse --git-common-dir)/info/exclude
 * never executed the rev-parse; the flag string itself became
 * the path → ./--git-common-dir/info/exclude with contents
 * `.claude/worktrees/`; .git/info/exclude still has no active
 * entries; MAIN checkout polluted, not the worktree).
 *
 * This is a diagnostic scoring desk. NOT an exploit.
 * No payloads. No attack procedures. No real credentials.
 * Score fixture strings for whether the exclude path is
 * resolved / parsed or literal / flag-as-path.
 *
 * Primary #91558: Worktree provisioning writes the git exclude
 * entry to a literal --git-common-dir/ directory in the MAIN
 * checkout instead of .git/info/exclude. Reporter karlgroves.
 * Filed 2026-09-02T17:19:13Z. OPEN. Labels: bug, platform:macos,
 * area:core.
 *
 * Hypothesis only (NON-BINDING): execute git rev-parse
 * --git-common-dir and use its OUTPUT; fail loudly rather than
 * falling back to the flag string; discard if issue evidence
 * disagrees.
 */

import { readFileSync } from "node:fs";
import { stdin } from "node:process";
import { pathToFileURL } from "node:url";

export const VERDICTS = Object.freeze([
  "resolved",
  "parsed",
  "literal",
  "flag-as-path",
  "main-checkout-pollution",
  "exclude-never-reached",
  "recurring-recreation",
  "near-miss-git-add",
  "sibling-dev-null-class",
  "below-bash-layer",
  "gitignore-masks-miss",
  "has-clear-evidence",
  "hold",
]);
export const IDLE_WORD = "resolved";
export const SEEDED_WORD = "literal";
export const HOLD_VERDICTS = Object.freeze(["resolved", "parsed", "hold"]);
export const ALARM_VERDICTS = Object.freeze(
  VERDICTS.filter((name) => !HOLD_VERDICTS.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FEATURED_ISSUE = 91558;
export const PRIMARY_ISSUES = Object.freeze([91558]);
export const COUSINS = Object.freeze([90456]);
export const COUSIN_ISSUE = 90456;
export const BACKUPS = Object.freeze([
  { name: "Caret", issue: 91526 },
  { name: "Buoy", issue: 91569 },
  { name: "Prefix", issue: 91581 },
]);
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/91558";
export const TITLE =
  "Worktree provisioning writes the git exclude entry to a literal --git-common-dir/ directory in the MAIN checkout instead of .git/info/exclude";
export const FILED_AT = "2026-09-02T17:19:13Z";
export const UPDATED_AT = "2026-09-02T17:20:23Z";
export const LABELS = Object.freeze(["bug", "platform:macos", "area:core"]);
export const REPORTER = "karlgroves";
export const VERSION = "2.0.42";
export const PLATFORM = "macOS 26.5.2 Apple Silicon";
export const SHELL = "zsh";
export const GIT_VERSION = "2.50.1";
export const AREA = "area:core";
export const EVIDENCE = "flag-string-used-as-path-without-rev-parse";
export const LITERAL_PATH = "./--git-common-dir/info/exclude";
export const INTENDED_PATH = "$(git rev-parse --git-common-dir)/info/exclude";
export const RESOLVED_PATH = ".git/info/exclude";
export const EXCLUDE_CONTENTS = ".claude/worktrees/";
export const OBSERVED_AT = "2026-09-01T18:01:13";
export const EARLIER_AT = "~16:50";
export const REV_PARSE_OUTPUT = ".git";
export const WORKTREE_LAYOUT = "../.wt-<name>";
export const HUB_LINE =
  "05:50 solecism: a solecism that treats the flag string as the path is not a resolved exclude — it is a literal directory in the main checkout. Score the parse or admit the flag already landed.";
export const MARK = "05:50 / hermes catalog #128 / #91558";
export const PHRASE =
  "Score the parse or admit the flag already landed.";
export const HYPOTHESIS_NOTE =
  "NON-BINDING: execute git rev-parse --git-common-dir and use its OUTPUT; fail loudly rather than falling back to the flag string; discard if issue evidence disagrees.";
export const CONTRAST_NOTE =
  "This is WORKTREE PROVISIONING WRITES THE GIT EXCLUDE ENTRY TO A LITERAL --git-common-dir/ DIRECTORY IN THE MAIN CHECKOUT INSTEAD OF .git/info/exclude; AREA:CORE; PLATFORM:MACOS. Intended write to $(git rev-parse --git-common-dir)/info/exclude never executed the rev-parse; the flag string itself became the path → ./--git-common-dir/info/exclude with contents `.claude/worktrees/`. .git/info/exclude still has no active entries. Pollutes the MAIN repository checkout (not the worktree). Recreated more than once (earlier ~16:50, observed 18:01:13 Sep 1 2026). Not created by any logged tool call — below Bash-tool layer; attribution to worktree provisioning is inference from content+timing+sibling #90456. Claude Code 2.0.42; macOS 26.5.2 Apple Silicon; zsh; git 2.50.1; normal checkout (.git is a real directory; rev-parse returns .git); no LFS; linked worktrees at sibling ../.wt-<name>; .claude/worktrees/ empty. Impact low here because .gitignore already has .claude/; without that rule exclusion silently fails; recurring investigation tax; near-miss git add of A --git-common-dir/info/exclude. Reporter karlgroves. Filed 2026-09-02. OPEN, bug, platform:macos, area:core.";
export const FORBIDDEN_IDLE = Object.freeze([
  "sealed",
  "blanked",
  "attested",
  "usurped",
  "swaged",
  "torn",
  "homed",
  "crossed",
  "armed",
  "unheard",
]);
export const BANNED_NAMES = Object.freeze([
  "Coffer",
  "Codicil",
  "Crimp",
  "Jackfield",
  "Tocsin",
  "Bolter",
  "Deadeye",
  "Reglet",
  "Reliquary",
  "Annunciator",
  "Caisson",
  "Spindle",
  "Knell",
  "Tumbler",
  "Escapement",
  "Geneva",
  "Scotch",
  "Pintle",
]);
export const FORBIDDEN_UI = Object.freeze([
  "Spectral",
  "Karla",
  "IBM Plex Mono",
  "Cormorant Garamond",
  "Figtree",
  "Azeret Mono",
  "Newsreader",
  "Manrope",
  "JetBrains Mono",
  "Brygada 1918",
  "Atkinson Hyperlegible",
  "DM Mono",
  "Fraunces",
  "Source Sans 3",
]);
export const NOT_PRODUCTS = Object.freeze([
  "coffer",
  "codicil",
  "crimp",
  "jackfield",
  "tocsin",
  "bolter",
  "deadeye",
  "reglet",
  "reliquary",
  "annunciator",
  "caisson",
  "spindle",
  "knell",
  "tumbler",
  "escapement",
  "geneva",
  "scotch",
  "pintle",
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
    persistParse: null,
    parsed: null,
    resolved: null,
    literal: null,
    flagAsPath: null,
    mainCheckoutPollution: null,
    excludeNeverReached: null,
    recurringRecreation: null,
    nearMissGitAdd: null,
    siblingDevNullClass: null,
    belowBashLayer: null,
    gitignoreMasksMiss: null,
    hasClearEvidence: null,
    intendedPath: "",
    writtenPath: "",
    excludeContents: "",
    excludeHasActiveEntries: null,
    checkoutKind: "",
    gitCommonDirResolved: "",
    noLfs: null,
    worktreeLayout: "",
    claudeWorktreesEmpty: null,
    observedAt: "",
    earlierAt: "",
    platform: "",
    shell: "",
    gitVersion: "",
    area: "",
    evidence: "",
    cliVersion: "",
    reporter: "",
    outputText: "",
  };
}

export function seedResolved() {
  return {
    ...blankTicket(),
    seed: IDLE_WORD,
    source: "atelier",
    persistParse: true,
    parsed: true,
    resolved: true,
    literal: false,
    flagAsPath: false,
    mainCheckoutPollution: false,
    excludeNeverReached: false,
    recurringRecreation: false,
    nearMissGitAdd: false,
    siblingDevNullClass: false,
    belowBashLayer: false,
    gitignoreMasksMiss: false,
    hasClearEvidence: false,
    intendedPath: INTENDED_PATH,
    writtenPath: RESOLVED_PATH,
    excludeContents: EXCLUDE_CONTENTS,
    excludeHasActiveEntries: true,
    checkoutKind: "main",
    gitCommonDirResolved: REV_PARSE_OUTPUT,
    noLfs: true,
    worktreeLayout: WORKTREE_LAYOUT,
    claudeWorktreesEmpty: true,
    platform: PLATFORM,
    shell: SHELL,
    gitVersion: GIT_VERSION,
    area: AREA,
    evidence: EVIDENCE,
    cliVersion: VERSION,
    outputText:
      "resolved; git rev-parse --git-common-dir executed; OUTPUT used as path; exclude lands in .git/info/exclude; idle word resolved",
  };
}

export function seedParsed() {
  return {
    ...seedResolved(),
    seed: "parsed",
    outputText:
      "parsed; git rev-parse --git-common-dir OUTPUT used as the path; the usage holds; idle word resolved",
  };
}

export function seedLiteral() {
  return {
    ...blankTicket(),
    seed: SEEDED_WORD,
    issue: FEATURED_ISSUE,
    title: TITLE,
    url: ISSUE_URL,
    source: "atelier",
    persistParse: false,
    parsed: false,
    resolved: false,
    literal: true,
    flagAsPath: true,
    mainCheckoutPollution: true,
    excludeNeverReached: true,
    recurringRecreation: true,
    nearMissGitAdd: true,
    siblingDevNullClass: true,
    belowBashLayer: true,
    gitignoreMasksMiss: true,
    hasClearEvidence: true,
    intendedPath: INTENDED_PATH,
    writtenPath: LITERAL_PATH,
    excludeContents: EXCLUDE_CONTENTS,
    excludeHasActiveEntries: false,
    checkoutKind: "main",
    gitCommonDirResolved: "",
    noLfs: true,
    worktreeLayout: WORKTREE_LAYOUT,
    claudeWorktreesEmpty: true,
    observedAt: OBSERVED_AT,
    earlierAt: EARLIER_AT,
    platform: PLATFORM,
    shell: SHELL,
    gitVersion: GIT_VERSION,
    area: AREA,
    evidence: EVIDENCE,
    cliVersion: VERSION,
    reporter: REPORTER,
    outputText:
      "literal; #91558; intended write to $(git rev-parse --git-common-dir)/info/exclude never executed the rev-parse; flag string became the path → ./--git-common-dir/info/exclude with contents `.claude/worktrees/`; .git/info/exclude still has no active entries; MAIN checkout polluted; karlgroves; Claude Code 2.0.42; macOS 26.5.2 Apple Silicon; area:core",
  };
}

export function seedFlagAsPath() {
  return {
    ...blankTicket(),
    seed: "flag-as-path",
    source: "atelier",
    flagAsPath: true,
    literal: true,
    persistParse: false,
    writtenPath: LITERAL_PATH,
    outputText:
      "flag-as-path; the flag string itself became the path → ./--git-common-dir/info/exclude",
  };
}

export function seedMainCheckoutPollution() {
  return {
    ...blankTicket(),
    seed: "main-checkout-pollution",
    source: "atelier",
    mainCheckoutPollution: true,
    literal: true,
    checkoutKind: "main",
    writtenPath: LITERAL_PATH,
    outputText:
      "main-checkout-pollution; pollutes the MAIN repository checkout (not the worktree)",
  };
}

export function seedExcludeNeverReached() {
  return {
    ...blankTicket(),
    seed: "exclude-never-reached",
    source: "atelier",
    excludeNeverReached: true,
    excludeHasActiveEntries: false,
    intendedPath: INTENDED_PATH,
    outputText:
      "exclude-never-reached; .git/info/exclude still has no active entries",
  };
}

export function seedRecurringRecreation() {
  return {
    ...blankTicket(),
    seed: "recurring-recreation",
    source: "atelier",
    recurringRecreation: true,
    observedAt: OBSERVED_AT,
    earlierAt: EARLIER_AT,
    outputText:
      "recurring-recreation; recreated more than once (earlier ~16:50, observed 18:01:13 Sep 1 2026)",
  };
}

export function seedNearMissGitAdd() {
  return {
    ...blankTicket(),
    seed: "near-miss-git-add",
    source: "atelier",
    nearMissGitAdd: true,
    writtenPath: LITERAL_PATH,
    outputText:
      "near-miss-git-add; near-miss git add of A --git-common-dir/info/exclude",
  };
}

export function seedSiblingDevNullClass() {
  return {
    ...blankTicket(),
    seed: "sibling-dev-null-class",
    source: "atelier",
    siblingDevNullClass: true,
    cousin: String(COUSIN_ISSUE),
    outputText:
      "sibling-dev-null-class; same class as #90456: path literal used without resolution; #90456 pollutes the worktree, this one pollutes main",
  };
}

export function seedBelowBashLayer() {
  return {
    ...blankTicket(),
    seed: "below-bash-layer",
    source: "atelier",
    belowBashLayer: true,
    outputText:
      "below-bash-layer; not created by any logged tool call — below Bash-tool layer; attribution to worktree provisioning is inference from content+timing+sibling #90456",
  };
}

export function seedGitignoreMasksMiss() {
  return {
    ...blankTicket(),
    seed: "gitignore-masks-miss",
    source: "atelier",
    gitignoreMasksMiss: true,
    outputText:
      "gitignore-masks-miss; impact low here because .gitignore already has .claude/; without that rule exclusion silently fails",
  };
}

export function seedHasClearEvidence() {
  return {
    ...blankTicket(),
    seed: "has-clear-evidence",
    source: "atelier",
    hasClearEvidence: true,
    issue: FEATURED_ISSUE,
    reporter: REPORTER,
    cliVersion: VERSION,
    platform: PLATFORM,
    writtenPath: LITERAL_PATH,
    excludeContents: EXCLUDE_CONTENTS,
    outputText:
      "has-clear-evidence; karlgroves filed #91558; observed ./--git-common-dir/info/exclude with contents `.claude/worktrees/`; Claude Code 2.0.42; macOS 26.5.2 Apple Silicon; platform:macos; area:core",
  };
}

export function seedHold() {
  return {
    ...seedResolved(),
    seed: "hold",
    outputText:
      "hold; git rev-parse --git-common-dir OUTPUT used; exclude lands in .git/info/exclude; the usage holds; idle word resolved",
  };
}

export function seedCousin() {
  return {
    ...seedResolved(),
    seed: IDLE_WORD,
    issue: COUSIN_ISSUE,
    isolation: "cousin",
    cousin: String(COUSIN_ISSUE),
    outputText:
      "cousin-not-primary; #90456 worktree provisioning writes Git LFS hooks to a literal dev/null/ directory instead of .git/hooks/ — cite only, not the #91558 MAIN-checkout --git-common-dir literal",
  };
}

export function emptyTicket() {
  return seedResolved();
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
    persistParse: firstBool(nested.persistParse, src.persistParse),
    parsed: firstBool(nested.parsed, src.parsed),
    resolved: firstBool(nested.resolved, src.resolved),
    literal: firstBool(nested.literal, src.literal),
    flagAsPath: firstBool(nested.flagAsPath, src.flagAsPath),
    mainCheckoutPollution: firstBool(
      nested.mainCheckoutPollution,
      src.mainCheckoutPollution,
    ),
    excludeNeverReached: firstBool(
      nested.excludeNeverReached,
      src.excludeNeverReached,
    ),
    recurringRecreation: firstBool(
      nested.recurringRecreation,
      src.recurringRecreation,
    ),
    nearMissGitAdd: firstBool(nested.nearMissGitAdd, src.nearMissGitAdd),
    siblingDevNullClass: firstBool(
      nested.siblingDevNullClass,
      src.siblingDevNullClass,
    ),
    belowBashLayer: firstBool(nested.belowBashLayer, src.belowBashLayer),
    gitignoreMasksMiss: firstBool(
      nested.gitignoreMasksMiss,
      src.gitignoreMasksMiss,
    ),
    hasClearEvidence: firstBool(nested.hasClearEvidence, src.hasClearEvidence),
    intendedPath: firstText(nested.intendedPath, src.intendedPath),
    writtenPath: firstText(nested.writtenPath, src.writtenPath),
    excludeContents: firstText(nested.excludeContents, src.excludeContents),
    excludeHasActiveEntries: firstBool(
      nested.excludeHasActiveEntries,
      src.excludeHasActiveEntries,
    ),
    checkoutKind: firstText(nested.checkoutKind, src.checkoutKind),
    gitCommonDirResolved: firstText(
      nested.gitCommonDirResolved,
      src.gitCommonDirResolved,
    ),
    noLfs: firstBool(nested.noLfs, src.noLfs),
    worktreeLayout: firstText(nested.worktreeLayout, src.worktreeLayout),
    claudeWorktreesEmpty: firstBool(
      nested.claudeWorktreesEmpty,
      src.claudeWorktreesEmpty,
    ),
    observedAt: firstText(nested.observedAt, src.observedAt),
    earlierAt: firstText(nested.earlierAt, src.earlierAt),
    platform: firstText(nested.platform, src.platform),
    shell: firstText(nested.shell, src.shell),
    gitVersion: firstText(nested.gitVersion, src.gitVersion),
    area: firstText(nested.area, src.area),
    evidence: firstText(nested.evidence, src.evidence),
    cliVersion: firstText(nested.cliVersion, src.cliVersion),
    reporter: firstText(nested.reporter, src.reporter),
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
    if (value !== null && value !== undefined && value !== "") out[key] = value;
  }
  return out;
}

function missingCore(input) {
  const row = input && typeof input === "object" ? input : {};
  return (
    row.persistParse == null &&
    row.parsed == null &&
    row.resolved == null &&
    row.literal == null &&
    row.flagAsPath == null &&
    row.mainCheckoutPollution == null &&
    row.excludeNeverReached == null &&
    row.recurringRecreation == null
  );
}

const SEED_FNS = {
  [IDLE_WORD]: seedResolved,
  parsed: seedParsed,
  [SEEDED_WORD]: seedLiteral,
  "flag-as-path": seedFlagAsPath,
  "main-checkout-pollution": seedMainCheckoutPollution,
  "exclude-never-reached": seedExcludeNeverReached,
  "recurring-recreation": seedRecurringRecreation,
  "near-miss-git-add": seedNearMissGitAdd,
  "sibling-dev-null-class": seedSiblingDevNullClass,
  "below-bash-layer": seedBelowBashLayer,
  "gitignore-masks-miss": seedGitignoreMasksMiss,
  "has-clear-evidence": seedHasClearEvidence,
  hold: seedHold,
  cousin: seedCousin,
  90456: seedCousin,
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
    return { ...seedLiteral(), ...cloned, ...raw };
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
    ticket.writtenPath,
    ticket.intendedPath,
    ticket.platform,
    ticket.area,
    ticket.evidence,
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

export function isResolved(ticket) {
  const row = cloneTicket(ticket);
  if (row.isolation === "cousin") return true;
  if (canonicalSeed(row.seed) === IDLE_WORD) return true;
  if (canonicalSeed(row.seed) === "hold") return true;
  if (canonicalSeed(row.seed) === "parsed") return true;
  if (
    row.persistParse === true &&
    row.literal !== true &&
    row.flagAsPath !== true
  ) {
    return true;
  }
  return false;
}

export function isLiteral(ticket) {
  const row = cloneTicket(ticket);
  const named = canonicalSeed(row.seed);
  if (named === IDLE_WORD || named === "hold" || named === "parsed") {
    return false;
  }
  if (COUSINS.includes(row.issue) && named !== SEEDED_WORD) return false;
  if (named === SEEDED_WORD) return true;
  if (row.issue === FEATURED_ISSUE && named !== IDLE_WORD) return true;
  if (
    row.literal === true ||
    row.flagAsPath === true ||
    (row.persistParse === false && row.mainCheckoutPollution === true) ||
    (row.excludeNeverReached === true && row.parsed === false)
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
      /cousin-not-primary|#90456/i.test(text)) &&
    named !== SEEDED_WORD &&
    row.issue !== FEATURED_ISSUE;
  const literalNow = !cousinOnly && isLiteral(row);
  const resolvedNow = !literalNow && isResolved(row);
  const flagAsPath =
    row.flagAsPath === true ||
    named === "flag-as-path" ||
    /flag-as-path|--git-common-dir\/info\/exclude|flag string itself became/i.test(
      text,
    );
  const mainCheckoutPollution =
    row.mainCheckoutPollution === true ||
    named === "main-checkout-pollution" ||
    /main-checkout-pollution|MAIN checkout|MAIN repository checkout/i.test(text);
  const excludeNeverReached =
    row.excludeNeverReached === true ||
    named === "exclude-never-reached" ||
    /exclude-never-reached|no active entries/i.test(text);
  const recurringRecreation =
    row.recurringRecreation === true ||
    named === "recurring-recreation" ||
    /recurring-recreation|recreated more than once|18:01:13/i.test(text);
  const nearMissGitAdd =
    row.nearMissGitAdd === true ||
    named === "near-miss-git-add" ||
    /near-miss-git-add|near-miss git add/i.test(text);
  const siblingDevNullClass =
    row.siblingDevNullClass === true ||
    named === "sibling-dev-null-class" ||
    /sibling-dev-null-class|dev\/null|#90456/i.test(text);
  const belowBashLayer =
    row.belowBashLayer === true ||
    named === "below-bash-layer" ||
    /below-bash-layer|below Bash-tool layer/i.test(text);
  const gitignoreMasksMiss =
    row.gitignoreMasksMiss === true ||
    named === "gitignore-masks-miss" ||
    /gitignore-masks-miss|\.gitignore already has \.claude/i.test(text);
  const hasClearEvidence =
    row.hasClearEvidence === true ||
    named === "has-clear-evidence" ||
    /has-clear-evidence|karlgroves|platform:macos/i.test(text);
  const literal =
    named !== IDLE_WORD &&
    named !== "hold" &&
    named !== "parsed" &&
    !cousinOnly &&
    (literalNow || named === SEEDED_WORD || /literal|#91558/i.test(text));
  const parsed =
    named === "parsed" ||
    (row.parsed === true && !literal);
  const resolved =
    named === IDLE_WORD ||
    named === "hold" ||
    (resolvedNow && !literal);
  return {
    named,
    cousinOnly,
    literalNow,
    resolvedNow,
    flagAsPath,
    mainCheckoutPollution,
    excludeNeverReached,
    recurringRecreation,
    nearMissGitAdd,
    siblingDevNullClass,
    belowBashLayer,
    gitignoreMasksMiss,
    hasClearEvidence,
    literal,
    parsed,
    resolved,
  };
}

export function chipsOf(ticket) {
  const flags = flagsOf(ticket);
  const chips = [];
  if (flags.resolved && !flags.literal) chips.push("resolved");
  if (flags.parsed && !flags.literal) chips.push("parsed");
  if (flags.literal) chips.push("literal");
  if (flags.flagAsPath && flags.literal) chips.push("flag-as-path");
  if (flags.mainCheckoutPollution && flags.literal) {
    chips.push("main-checkout-pollution");
  }
  if (flags.excludeNeverReached && flags.literal) {
    chips.push("exclude-never-reached");
  }
  if (flags.recurringRecreation && flags.literal) {
    chips.push("recurring-recreation");
  }
  if (flags.nearMissGitAdd && flags.literal) chips.push("near-miss-git-add");
  if (flags.siblingDevNullClass && flags.literal) {
    chips.push("sibling-dev-null-class");
  }
  if (flags.belowBashLayer && flags.literal) chips.push("below-bash-layer");
  if (flags.gitignoreMasksMiss && flags.literal) {
    chips.push("gitignore-masks-miss");
  }
  if (flags.hasClearEvidence && flags.literal) chips.push("has-clear-evidence");
  if (
    (flags.resolved || flags.parsed || flags.named === "hold") &&
    !flags.literal
  ) {
    chips.push("hold");
  }
  if (ticket.seed && VERDICTS.includes(ticket.seed)) chips.push(ticket.seed);
  return [...new Set(chips)];
}

function reasonsOf(ticket, flags, verdict) {
  const reasons = [];
  if (verdict === "resolved") {
    reasons.push(
      "resolved; git rev-parse --git-common-dir executed; OUTPUT used as path; exclude lands in .git/info/exclude",
    );
    reasons.push("hold: the usage is a resolved exclude; idle word resolved");
  }
  if (verdict === "parsed") {
    reasons.push(
      "parsed; git rev-parse --git-common-dir OUTPUT used as the path; the usage holds",
    );
  }
  if (verdict === "hold") {
    reasons.push(
      "hold; git rev-parse --git-common-dir OUTPUT used; exclude lands in .git/info/exclude; the usage holds",
    );
  }
  if (verdict === "literal" || flags.literal) {
    reasons.push(
      "literal; #91558; intended write never executed the rev-parse; flag string became ./--git-common-dir/info/exclude",
    );
  }
  if (flags.flagAsPath || verdict === "flag-as-path") {
    reasons.push(
      "flag-as-path; the flag string itself became the path → ./--git-common-dir/info/exclude",
    );
  }
  if (flags.mainCheckoutPollution || verdict === "main-checkout-pollution") {
    reasons.push(
      "main-checkout-pollution; pollutes the MAIN repository checkout (not the worktree)",
    );
  }
  if (flags.excludeNeverReached || verdict === "exclude-never-reached") {
    reasons.push(
      "exclude-never-reached; .git/info/exclude still has no active entries",
    );
  }
  if (flags.recurringRecreation || verdict === "recurring-recreation") {
    reasons.push(
      "recurring-recreation; recreated more than once (earlier ~16:50, observed 18:01:13 Sep 1 2026)",
    );
  }
  if (flags.nearMissGitAdd || verdict === "near-miss-git-add") {
    reasons.push(
      "near-miss-git-add; near-miss git add of A --git-common-dir/info/exclude",
    );
  }
  if (flags.siblingDevNullClass || verdict === "sibling-dev-null-class") {
    reasons.push(
      "sibling-dev-null-class; same class as #90456: path literal used without resolution; #90456 pollutes the worktree, this one pollutes main",
    );
  }
  if (flags.belowBashLayer || verdict === "below-bash-layer") {
    reasons.push(
      "below-bash-layer; not created by any logged tool call — below Bash-tool layer; attribution is inference from content+timing+sibling #90456",
    );
  }
  if (flags.gitignoreMasksMiss || verdict === "gitignore-masks-miss") {
    reasons.push(
      "gitignore-masks-miss; impact low here because .gitignore already has .claude/; without that rule exclusion silently fails",
    );
  }
  if (flags.hasClearEvidence || verdict === "has-clear-evidence") {
    reasons.push(
      `has-clear-evidence; ${REPORTER} filed #${FEATURED_ISSUE}; observed ${LITERAL_PATH} with contents \`${EXCLUDE_CONTENTS}\`; CLI ${VERSION}; ${PLATFORM}; platform:macos; area:core`,
    );
  }
  if (flags.cousinOnly) {
    reasons.push(
      "cousin is not Solecism; cite-only #90456 worktree provisioning writes Git LFS hooks to a literal dev/null/ directory instead of .git/hooks/ — same class (path literal without resolution) but pollutes the worktree, not the MAIN checkout",
    );
  }
  if (verdict === "literal" || flags.literal) {
    reasons.push(HYPOTHESIS_NOTE);
    reasons.push(CONTRAST_NOTE);
  }
  if (!HOLD_VERDICTS.includes(verdict)) {
    reasons.push(PHRASE);
  }
  return reasons;
}

function pickVerdict(seed, flags) {
  const named = canonicalSeed(seed);
  if (named === IDLE_WORD && (flags.resolved || !flags.literal)) return "resolved";
  if (named === "parsed" && !flags.literal) return "parsed";
  if (named === "hold" && !flags.literal) return "hold";
  if (named === SEEDED_WORD) return "literal";
  if (VERDICTS.includes(named) && !HOLD_VERDICTS.includes(named)) {
    return named;
  }
  if (flags.cousinOnly) return "resolved";
  if (flags.literal) return "literal";
  if (flags.resolved) return "resolved";
  return "resolved";
}

function folioOf(flags, ticket, verdict) {
  if (verdict === "literal" || flags.literal) {
    return {
      case: "literal — flag string treated as the path; MAIN checkout polluted",
      ledger: `${LITERAL_PATH}; contents \`${EXCLUDE_CONTENTS}\``,
      intended: INTENDED_PATH,
      exclude: ".git/info/exclude still has no active entries",
      mark: "solecism literal; admit the flag already landed",
      note: PHRASE,
    };
  }
  if (verdict === "parsed" || verdict === "hold") {
    return {
      case: "parsed — rev-parse OUTPUT used as the path",
      ledger: `${RESOLVED_PATH}; contents \`${EXCLUDE_CONTENTS}\``,
      intended: INTENDED_PATH,
      exclude: ".git/info/exclude received the entry",
      mark: "solecism parsed; the usage holds",
      note: "Parsed: the usage holds.",
    };
  }
  return {
    case: "resolved — rev-parse executed; exclude lands in .git/info/exclude",
    ledger: "git rev-parse --git-common-dir returned .git; write used that OUTPUT",
    intended: INTENDED_PATH,
    exclude: ".git/info/exclude holds the entry",
    mark: "solecism resolved; idle word resolved",
    note: "Resolved: the usage holds.",
  };
}

export function analyze(input) {
  const ticket = normalize(input);
  const flags = flagsOf(ticket);
  const chips = chipsOf(ticket);
  const seed = String(ticket.seed || "");
  const verdict = pickVerdict(seed, flags);
  const hold = HOLD_VERDICTS.includes(verdict);
  const literal = verdict === "literal" || flags.literal;
  return {
    verdict,
    chips,
    reasons: reasonsOf(ticket, flags, verdict),
    resolved: verdict === "resolved" || (flags.resolved && !literal),
    parsed: verdict === "parsed" || (flags.parsed && !literal),
    literal,
    flagAsPath: flags.flagAsPath && literal,
    hold,
    alarm: !hold,
    idleWord: IDLE_WORD,
    seededWord: SEEDED_WORD,
    flags,
    contrast: folioOf(flags, ticket, verdict),
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
  if (name === SEEDED_WORD || name === 91558 || name === "91558") {
    return analyze(seedLiteral());
  }
  if (name === "flag-as-path") return analyze(seedFlagAsPath());
  if (name === "main-checkout-pollution") {
    return analyze(seedMainCheckoutPollution());
  }
  if (name === "exclude-never-reached") {
    return analyze(seedExcludeNeverReached());
  }
  if (name === "recurring-recreation") {
    return analyze(seedRecurringRecreation());
  }
  if (name === "near-miss-git-add") return analyze(seedNearMissGitAdd());
  if (name === "sibling-dev-null-class") {
    return analyze(seedSiblingDevNullClass());
  }
  if (name === "below-bash-layer") return analyze(seedBelowBashLayer());
  if (name === "gitignore-masks-miss") {
    return analyze(seedGitignoreMasksMiss());
  }
  if (name === "has-clear-evidence") return analyze(seedHasClearEvidence());
  if (name === "parsed") return analyze(seedParsed());
  if (name === "hold") return analyze(seedHold());
  if (name === IDLE_WORD || name === "resolved" || name === "open") {
    return analyze(seedResolved());
  }
  if (name === 90456 || name === "90456" || name === "cousin") {
    return analyze(seedCousin());
  }
  if (SEED_FNS[name]) return analyze(SEED_FNS[name]());
  return analyze(seedResolved());
}

export function handle(input) {
  const result = analyze(input);
  return {
    ...result,
    hookSpecificOutput: {
      additionalContext:
        result.verdict === "literal" || (result.literal && result.alarm)
          ? `literal solecism #${FEATURED_ISSUE}: worktree provisioning wrote the exclude to a literal --git-common-dir/ directory in the MAIN checkout. ${HYPOTHESIS_NOTE}`
          : result.verdict === "hold" || result.verdict === "parsed"
            ? "hold. git rev-parse --git-common-dir OUTPUT used. Score the parse."
            : `resolved solecism. Idle word ${IDLE_WORD}. git rev-parse --git-common-dir executed; OUTPUT used as path; exclude lands in .git/info/exclude.`,
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
