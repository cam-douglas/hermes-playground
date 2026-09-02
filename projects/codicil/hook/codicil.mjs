#!/usr/bin/env node
/**
 * Codicil — probate / will-chamber / codicil-desk classifier.
 * A codicil that amends whatever will is currently on the desk
 * is not a sealed clause — it is a rewritten legatee. Score
 * the seal or admit the teammate's HEAD already moved.
 *
 *   echo '{"rewritten":true,"amendBlind":true}' | node codicil.mjs
 *   node codicil.mjs ticket.json
 *
 * Idle word is sealed (HOLD: HEAD still agent's own SHA;
 * git rev-parse HEAD matches the SHA from the agent's own
 * prior commit; amend is safe). Seeded state is rewritten
 * / #91513 (shared multi-agent non-worktree-isolated tree;
 * git commit --amend does not re-check HEAD; silently
 * rewrites concurrent teammate C2's message while keeping
 * C2's tree byte-identical).
 *
 * This is a diagnostic scoring desk. NOT an exploit.
 * No payloads. No attack procedures. Score fixture strings
 * for whether the shared-tree amend is sealed or rewritten.
 *
 * Primary #91513: In a shared multi-agent working tree,
 * `git commit --amend` doesn't re-check HEAD, so it can
 * silently rewrite a concurrent teammate's commit instead
 * of the agent's own. Claude Code 2.1.239. Reporter
 * KinohTaGo. Filed 2026-09-02T13:55:40Z. OPEN. Labels:
 * bug, has repro, area:agents.
 *
 * Hypothesis only (NON-BINDING): product-level guardrail
 * should refuse amend when HEAD ≠ agent's last commit SHA
 * in shared trees; discard if issue evidence disagrees.
 */

import { readFileSync } from "node:fs";
import { stdin } from "node:process";
import { pathToFileURL } from "node:url";

export const VERDICTS = Object.freeze([
  "sealed",
  "rewritten",
  "head-moved",
  "message-usurp",
  "tree-identical",
  "shared-tree",
  "has-clear-repro",
  "hold",
]);
export const IDLE_WORD = "sealed";
export const SEEDED_WORD = "rewritten";
export const HOLD_VERDICTS = Object.freeze(["sealed", "hold"]);
export const ALARM_VERDICTS = Object.freeze(
  VERDICTS.filter((name) => !HOLD_VERDICTS.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FEATURED_ISSUE = 91513;
export const PRIMARY_ISSUES = Object.freeze([91513]);
export const COUSINS = Object.freeze([90943, 91349, 90146, 83311, 88967]);
export const COUSIN_ISSUE = 90943;
export const BACKUPS = Object.freeze([
  { name: "Caret", issue: 91526 },
  { name: "Accrete", issue: 91512 },
  { name: "SessionTrailer", issue: 91546 },
]);
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/91513";
export const TITLE =
  "In a shared multi-agent working tree, `git commit --amend` doesn't re-check HEAD, so it can silently rewrite a concurrent teammate's commit instead of the agent's own";
export const FILED_AT = "2026-09-02T13:55:40Z";
export const UPDATED_AT = "2026-09-02T13:56:45Z";
export const LABELS = Object.freeze(["bug", "has repro", "area:agents"]);
export const REPORTER = "KinohTaGo";
export const VERSION = "2.1.239";
export const AREA = "area:agents";
export const EVIDENCE = "amend-no-recheck-head";
export const AGENT_SHA = "c1a091513a0a0a0a0a0a0a0a0a0a0a0a0a0a0a1";
export const TEAMMATE_SHA = "c2b091513b0b0b0b0b0b0b0b0b0b0b0b0b0b0b2";
export const AMENDED_SHA = "a3d091513c0c0c0c0c0c0c0c0c0c0c0c0c0c0c3";
export const TREE_SHA = "t4e091513d0d0d0d0d0d0d0d0d0d0d0d0d0d0d4";
export const AGENT_A_MESSAGE =
  "C1: Agent A clause — append required trailer tag";
export const AGENT_B_MESSAGE =
  "C2: Agent B legatee — concurrent commit on shared tree";
export const HUB_LINE =
  "03:50 codicil: a codicil that amends whatever will is currently on the desk is not a sealed clause — it is a rewritten legatee. Score the seal or admit the teammate's HEAD already moved.";
export const MARK = "03:50 / hermes catalog #126 / #91513";
export const PHRASE =
  "a codicil that amends whatever will is currently on the desk is not a sealed clause — it is a rewritten legatee. Score the seal or admit the teammate's HEAD already moved.";
export const HYPOTHESIS_NOTE =
  "NON-BINDING: product-level guardrail should refuse amend when HEAD ≠ agent's last commit SHA in shared trees; discard if issue evidence disagrees.";
export const CONTRAST_NOTE =
  "This is SHARED MULTI-AGENT WORKTREE — `git commit --amend` DOES NOT RE-CHECK HEAD; SILENTLY REWRITES CONCURRENT TEAMMATE COMMIT MESSAGE; AREA:AGENTS. Agent A creates C1. Before A's follow-up amend, Agent B commits C2 on top of C1 (shared non-worktree-isolated tree). A's `git commit --amend` does not re-check HEAD; it rewrites Agent B's C2 — keeps C2's tree byte-identical but discards B's commit message and replaces it with A's. Expected: before amend in a possibly-shared tree, verify `git rev-parse HEAD` still equals the SHA from the agent's own prior commit; refuse/warn if HEAD moved. Impact: git history/metadata only (message + parent linkage); no working-tree file loss. Reporter KinohTaGo. Claude Code 2.1.239. Filed 2026-09-02. OPEN, has repro, area:agents.";
export const FORBIDDEN_IDLE = Object.freeze([
  "swaged",
  "torn",
  "homed",
  "armed",
  "unheard",
  "unbolted",
  "snagged",
  "reeved",
  "fouled",
  "creased",
  "bled",
  "latched",
  "vanished",
  "rebound",
  "dark",
  "spurious",
  "fenced",
  "swept",
  "tolled",
  "mute",
  "discarded",
  "arrested",
  "indexed",
  "chocked",
  "clasped",
  "sprung",
  "hinged",
  "pealed",
  "crossed",
]);
export const BANNED_NAMES = Object.freeze([
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
  "Public Sans",
  "JetBrains Mono",
  "Brygada 1918",
  "Atkinson Hyperlegible",
  "DM Mono",
  "Fraunces",
  "Source Sans 3",
  "IBM Plex",
]);
export const NOT_PRODUCTS = Object.freeze([
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
    recheckHead: null,
    headMoved: null,
    amendBlind: null,
    rewritten: null,
    messageUsurp: null,
    treeIdentical: null,
    sharedTree: null,
    worktreeIsolated: null,
    hasClearRepro: null,
    agentSha: "",
    currentHead: "",
    parentSha: "",
    amendedSha: "",
    treeSha: "",
    agentAMessage: "",
    agentBMessage: "",
    intendedMessage: "",
    area: "",
    evidence: "",
    cliVersion: "",
    reporter: "",
    outputText: "",
  };
}

export function seedSealed() {
  return {
    ...blankTicket(),
    seed: IDLE_WORD,
    source: "atelier",
    recheckHead: true,
    headMoved: false,
    amendBlind: false,
    rewritten: false,
    messageUsurp: false,
    treeIdentical: false,
    sharedTree: false,
    worktreeIsolated: true,
    hasClearRepro: false,
    agentSha: AGENT_SHA,
    currentHead: AGENT_SHA,
    parentSha: "",
    amendedSha: "",
    treeSha: TREE_SHA,
    agentAMessage: AGENT_A_MESSAGE,
    agentBMessage: "",
    intendedMessage: AGENT_A_MESSAGE,
    area: AREA,
    evidence: EVIDENCE,
    cliVersion: VERSION,
    outputText:
      "sealed; git rev-parse HEAD still equals Agent A's own C1 SHA; amend is safe; idle word sealed",
  };
}

export function seedRewritten() {
  return {
    ...blankTicket(),
    seed: SEEDED_WORD,
    issue: FEATURED_ISSUE,
    title: TITLE,
    url: ISSUE_URL,
    source: "atelier",
    recheckHead: false,
    headMoved: true,
    amendBlind: true,
    rewritten: true,
    messageUsurp: true,
    treeIdentical: true,
    sharedTree: true,
    worktreeIsolated: false,
    hasClearRepro: true,
    agentSha: AGENT_SHA,
    currentHead: TEAMMATE_SHA,
    parentSha: AGENT_SHA,
    amendedSha: AMENDED_SHA,
    treeSha: TREE_SHA,
    agentAMessage: AGENT_A_MESSAGE,
    agentBMessage: AGENT_B_MESSAGE,
    intendedMessage: AGENT_A_MESSAGE,
    area: AREA,
    evidence: EVIDENCE,
    cliVersion: VERSION,
    reporter: REPORTER,
    outputText:
      "rewritten; #91513; shared multi-agent worktree; git commit --amend does not re-check HEAD; Agent A C1 then Agent B C2 then A amends C2; C2 tree byte-identical; B's message discarded and replaced with A's; KinohTaGo; Claude Code 2.1.239; area:agents",
  };
}

export function seedHeadMoved() {
  return {
    ...blankTicket(),
    seed: "head-moved",
    source: "atelier",
    headMoved: true,
    rewritten: true,
    agentSha: AGENT_SHA,
    currentHead: TEAMMATE_SHA,
    outputText:
      "head-moved; git rev-parse HEAD is Agent B's C2, not Agent A's C1 SHA from the prior commit",
  };
}

export function seedMessageUsurp() {
  return {
    ...blankTicket(),
    seed: "message-usurp",
    source: "atelier",
    messageUsurp: true,
    rewritten: true,
    agentAMessage: AGENT_A_MESSAGE,
    agentBMessage: AGENT_B_MESSAGE,
    outputText:
      "message-usurp; Agent B's C2 commit message discarded and replaced with Agent A's intended amend",
  };
}

export function seedTreeIdentical() {
  return {
    ...blankTicket(),
    seed: "tree-identical",
    source: "atelier",
    treeIdentical: true,
    rewritten: true,
    treeSha: TREE_SHA,
    outputText:
      "tree-identical; amended commit's tree is byte-identical to C2; no working-tree file loss; history/metadata only",
  };
}

export function seedSharedTree() {
  return {
    ...blankTicket(),
    seed: "shared-tree",
    source: "atelier",
    sharedTree: true,
    worktreeIsolated: false,
    rewritten: true,
    outputText:
      "shared-tree; Agent Teams teammates share one plain git working tree; no worktree isolation",
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
    cliVersion: VERSION,
    outputText:
      "has-clear-repro; KinohTaGo filed #91513; has repro; area:agents; Claude Code 2.1.239; Agent Teams shared tree; deterministic given A-C1 then B-C2 then A-amend interleaving",
  };
}

export function seedHold() {
  return {
    ...seedSealed(),
    seed: "hold",
    outputText:
      "hold; HEAD still Agent A's own SHA; the seal holds; idle word sealed",
  };
}

export function seedCousin() {
  return {
    ...seedSealed(),
    seed: IDLE_WORD,
    issue: COUSIN_ISSUE,
    isolation: "cousin",
    cousin: String(COUSIN_ISSUE),
    outputText:
      "cousin-not-primary; #90943 concurrent sessions stale git index — cite only, not the #91513 amend-no-recheck-HEAD rewrite",
  };
}

export function emptyTicket() {
  return seedSealed();
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
    recheckHead: firstBool(nested.recheckHead, src.recheckHead),
    headMoved: firstBool(nested.headMoved, src.headMoved),
    amendBlind: firstBool(nested.amendBlind, src.amendBlind),
    rewritten: firstBool(nested.rewritten, src.rewritten),
    messageUsurp: firstBool(nested.messageUsurp, src.messageUsurp),
    treeIdentical: firstBool(nested.treeIdentical, src.treeIdentical),
    sharedTree: firstBool(nested.sharedTree, src.sharedTree),
    worktreeIsolated: firstBool(nested.worktreeIsolated, src.worktreeIsolated),
    hasClearRepro: firstBool(nested.hasClearRepro, src.hasClearRepro),
    agentSha: firstText(nested.agentSha, src.agentSha),
    currentHead: firstText(nested.currentHead, src.currentHead),
    parentSha: firstText(nested.parentSha, src.parentSha),
    amendedSha: firstText(nested.amendedSha, src.amendedSha),
    treeSha: firstText(nested.treeSha, src.treeSha),
    agentAMessage: firstText(nested.agentAMessage, src.agentAMessage),
    agentBMessage: firstText(nested.agentBMessage, src.agentBMessage),
    intendedMessage: firstText(nested.intendedMessage, src.intendedMessage),
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
    row.recheckHead == null &&
    row.headMoved == null &&
    row.amendBlind == null &&
    row.rewritten == null &&
    row.messageUsurp == null &&
    row.treeIdentical == null &&
    row.sharedTree == null
  );
}

const SEED_FNS = {
  [IDLE_WORD]: seedSealed,
  [SEEDED_WORD]: seedRewritten,
  "head-moved": seedHeadMoved,
  "message-usurp": seedMessageUsurp,
  "tree-identical": seedTreeIdentical,
  "shared-tree": seedSharedTree,
  "has-clear-repro": seedHasClearRepro,
  hold: seedHold,
  cousin: seedCousin,
  90943: seedCousin,
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
    return { ...seedRewritten(), ...cloned, ...raw };
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
    ticket.agentAMessage,
    ticket.agentBMessage,
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

export function isSealed(ticket) {
  const row = cloneTicket(ticket);
  if (row.isolation === "cousin") return true;
  if (canonicalSeed(row.seed) === IDLE_WORD) return true;
  if (canonicalSeed(row.seed) === "hold") return true;
  if (
    row.recheckHead === true &&
    row.headMoved !== true &&
    row.rewritten !== true &&
    row.amendBlind !== true
  ) {
    return true;
  }
  return false;
}

export function isRewritten(ticket) {
  const row = cloneTicket(ticket);
  const named = canonicalSeed(row.seed);
  if (named === IDLE_WORD || named === "hold") return false;
  if (COUSINS.includes(row.issue) && named !== SEEDED_WORD) return false;
  if (named === SEEDED_WORD) return true;
  if (row.issue === FEATURED_ISSUE && named !== IDLE_WORD) return true;
  if (
    row.rewritten === true ||
    row.amendBlind === true ||
    (row.headMoved === true && row.recheckHead === false) ||
    (row.messageUsurp === true && row.treeIdentical === true)
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
      /cousin-not-primary|#90943|#91349|#90146|#83311|#88967/i.test(text)) &&
    named !== SEEDED_WORD &&
    row.issue !== FEATURED_ISSUE;
  const rewrittenNow = !cousinOnly && isRewritten(row);
  const sealedNow = !rewrittenNow && isSealed(row);
  const headMoved =
    row.headMoved === true ||
    named === "head-moved" ||
    /head-moved|HEAD moved|HEAD is Agent B|rev-parse HEAD is Agent B/i.test(text);
  const messageUsurp =
    row.messageUsurp === true ||
    named === "message-usurp" ||
    /message-usurp|message discarded|replaced with Agent A/i.test(text);
  const treeIdentical =
    row.treeIdentical === true ||
    named === "tree-identical" ||
    /tree-identical|byte-identical|tree is byte-identical/i.test(text);
  const sharedTree =
    row.sharedTree === true ||
    named === "shared-tree" ||
    /shared-tree|shared multi-agent|no worktree isolation/i.test(text);
  const hasClearRepro =
    row.hasClearRepro === true ||
    named === "has-clear-repro" ||
    /has-clear-repro|KinohTaGo|has repro|area:agents/i.test(text);
  const rewritten =
    named !== IDLE_WORD &&
    named !== "hold" &&
    !cousinOnly &&
    (rewrittenNow || named === SEEDED_WORD || /rewritten|#91513/i.test(text));
  const sealed =
    named === IDLE_WORD || named === "hold" || (sealedNow && !rewritten);
  return {
    named,
    cousinOnly,
    rewrittenNow,
    sealedNow,
    headMoved,
    messageUsurp,
    treeIdentical,
    sharedTree,
    hasClearRepro,
    rewritten,
    sealed,
  };
}

export function chipsOf(ticket) {
  const flags = flagsOf(ticket);
  const chips = [];
  if (flags.sealed && !flags.rewritten) chips.push("sealed");
  if (flags.rewritten) chips.push("rewritten");
  if (flags.headMoved && flags.rewritten) chips.push("head-moved");
  if (flags.messageUsurp && flags.rewritten) chips.push("message-usurp");
  if (flags.treeIdentical && flags.rewritten) chips.push("tree-identical");
  if (flags.sharedTree && flags.rewritten) chips.push("shared-tree");
  if (flags.hasClearRepro && flags.rewritten) chips.push("has-clear-repro");
  if ((flags.sealed || flags.named === "hold") && !flags.rewritten) {
    chips.push("hold");
  }
  if (ticket.seed && VERDICTS.includes(ticket.seed)) chips.push(ticket.seed);
  return [...new Set(chips)];
}

function reasonsOf(ticket, flags, verdict) {
  const reasons = [];
  if (verdict === "sealed") {
    reasons.push(
      "sealed; git rev-parse HEAD still equals Agent A's own C1 SHA; amend is safe",
    );
    reasons.push("hold: the will is a sealed clause; idle word sealed");
  }
  if (verdict === "hold") {
    reasons.push(
      "hold; HEAD still Agent A's own SHA; the seal holds",
    );
  }
  if (verdict === "rewritten" || flags.rewritten) {
    reasons.push(
      "rewritten; #91513; git commit --amend does not re-check HEAD; silently rewrites concurrent teammate C2",
    );
  }
  if (flags.headMoved || verdict === "head-moved") {
    reasons.push(
      "head-moved; git rev-parse HEAD is Agent B's C2, not Agent A's C1 SHA from the prior commit",
    );
  }
  if (flags.messageUsurp || verdict === "message-usurp") {
    reasons.push(
      "message-usurp; Agent B's C2 commit message discarded and replaced with Agent A's intended amend",
    );
  }
  if (flags.treeIdentical || verdict === "tree-identical") {
    reasons.push(
      "tree-identical; amended commit's tree is byte-identical to C2; no working-tree file loss; history/metadata only",
    );
  }
  if (flags.sharedTree || verdict === "shared-tree") {
    reasons.push(
      "shared-tree; Agent Teams teammates share one plain git working tree; no worktree isolation",
    );
  }
  if (flags.hasClearRepro || verdict === "has-clear-repro") {
    reasons.push(
      `has-clear-repro; ${REPORTER} filed #${FEATURED_ISSUE}; has repro; CLI ${VERSION}; area:agents; Agent Teams shared tree; deterministic given A-C1 then B-C2 then A-amend interleaving`,
    );
  }
  if (flags.cousinOnly) {
    reasons.push(
      "cousin is not Codicil; cite-only #90943 concurrent stale git index / #91349 worktree add falls through to shared main / #90146 shared worktree path clobber / #83311 isolation agents commit across branches / #88967 worktree from stale commit — not the #91513 amend-no-recheck-HEAD rewrite",
    );
  }
  if (verdict === "rewritten" || flags.rewritten) {
    reasons.push(HYPOTHESIS_NOTE);
    reasons.push(CONTRAST_NOTE);
  }
  if (verdict !== "sealed" && verdict !== "hold") {
    reasons.push(PHRASE);
  }
  return reasons;
}

function pickVerdict(seed, flags) {
  const named = canonicalSeed(seed);
  if (named === IDLE_WORD && (flags.sealed || !flags.rewritten)) return "sealed";
  if (named === "hold" && !flags.rewritten) return "hold";
  if (named === SEEDED_WORD) return "rewritten";
  if (VERDICTS.includes(named) && named !== IDLE_WORD && named !== "hold") {
    return named;
  }
  if (flags.cousinOnly) return "sealed";
  if (flags.rewritten) return "rewritten";
  if (flags.sealed) return "sealed";
  return "sealed";
}

function benchOf(flags, ticket, verdict) {
  if (verdict === "rewritten" || flags.rewritten) {
    return {
      case: "rewritten — blind amend; usurped legatee",
      jaw: "git commit --amend operates on whatever HEAD is, not the commit Agent A just made",
      shear: "HEAD moved from C1 to teammate C2; no git rev-parse re-check",
      drop: "C2 tree kept byte-identical; B's message discarded and replaced with A's",
      mark: "codicil rewritten; admit the teammate's HEAD already moved",
      note: PHRASE,
    };
  }
  if (verdict === "hold") {
    return {
      case: "sealed — HEAD still agent's own SHA; amend safe",
      jaw: "git rev-parse HEAD equals the SHA from Agent A's own prior commit",
      shear: "HEAD has not moved; no concurrent C2",
      drop: "the clause on the desk is still A's will",
      mark: "codicil sealed; the clause holds",
      note: "Hold: the will is sealed.",
    };
  }
  return {
    case: "sealed — HEAD still agent's own SHA; amend safe",
    jaw: "before amend, verify git rev-parse HEAD still equals the agent's own SHA",
    shear: "no mid-desk rewrite; no usurped legatee",
    drop: "concurrent clerks cannot rewrite the sealed clause",
    mark: "codicil sealed; idle word sealed",
    note: "Sealed: the clause holds.",
  };
}

export function analyze(input) {
  const ticket = normalize(input);
  const flags = flagsOf(ticket);
  const chips = chipsOf(ticket);
  const seed = String(ticket.seed || "");
  const verdict = pickVerdict(seed, flags);
  const hold = HOLD_VERDICTS.includes(verdict);
  const rewritten = verdict === "rewritten" || flags.rewritten;
  return {
    verdict,
    chips,
    reasons: reasonsOf(ticket, flags, verdict),
    sealed: verdict === "sealed" || (flags.sealed && !rewritten),
    rewritten,
    hold,
    alarm: !hold,
    idleWord: IDLE_WORD,
    seededWord: SEEDED_WORD,
    flags,
    contrast: benchOf(flags, ticket, verdict),
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
  if (name === SEEDED_WORD || name === 91513 || name === "91513") {
    return analyze(seedRewritten());
  }
  if (name === "head-moved") return analyze(seedHeadMoved());
  if (name === "message-usurp") return analyze(seedMessageUsurp());
  if (name === "tree-identical") return analyze(seedTreeIdentical());
  if (name === "shared-tree") return analyze(seedSharedTree());
  if (name === "has-clear-repro") return analyze(seedHasClearRepro());
  if (name === "hold") return analyze(seedHold());
  if (name === IDLE_WORD || name === "sealed" || name === "open") {
    return analyze(seedSealed());
  }
  if (
    name === 90943 ||
    name === "90943" ||
    name === "cousin" ||
    name === 91349 ||
    name === "91349" ||
    name === 90146 ||
    name === "90146" ||
    name === 83311 ||
    name === "83311"
  ) {
    return analyze(seedCousin());
  }
  if (SEED_FNS[name]) return analyze(SEED_FNS[name]());
  return analyze(seedSealed());
}

export function handle(input) {
  const result = analyze(input);
  return {
    ...result,
    hookSpecificOutput: {
      additionalContext:
        result.verdict === "rewritten" || (result.rewritten && result.alarm)
          ? `rewritten codicil #${FEATURED_ISSUE}: git commit --amend does not re-check HEAD; silently rewrites concurrent teammate C2. ${HYPOTHESIS_NOTE}`
          : result.verdict === "hold"
            ? "hold. HEAD still Agent A's own SHA. Score the seal."
            : `sealed codicil. Idle word ${IDLE_WORD}. git rev-parse HEAD still equals Agent A's own C1 SHA; amend is safe.`,
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
