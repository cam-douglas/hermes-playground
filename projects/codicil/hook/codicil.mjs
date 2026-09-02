#!/usr/bin/env node
/**
 * Codicil — probate / will-chamber / codicil-desk classifier.
 * A codicil that amends whichever deed sits on the desk is
 * not a lawful addendum — it is a silent rewrite of a
 * teammate's will. Score the attestation or admit the HEAD
 * already moved.
 *
 *   echo '{"usurped":true,"amendBlind":true}' | node codicil.mjs
 *   node codicil.mjs ticket.json
 *
 * Idle word is attested (HOLD: HEAD still agent's own SHA;
 * git rev-parse HEAD matches the SHA from the agent's own
 * prior commit; amend is safe). Seeded state is usurped
 * / #91513 (shared multi-agent non-worktree-isolated tree;
 * git commit --amend does not re-check HEAD; silently
 * rewrites concurrent teammate C2's message while keeping
 * C2's tree byte-identical).
 *
 * This is a diagnostic scoring desk. NOT an exploit.
 * No payloads. No attack procedures. Score fixture strings
 * for whether the shared-tree amend is attested or usurped.
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
  "attested",
  "usurped",
  "head-moved",
  "teammate-rewrite",
  "message-discard",
  "tree-identical",
  "no-rev-parse-guard",
  "shared-worktree",
  "has-clear-repro",
  "hold",
]);
export const IDLE_WORD = "attested";
export const SEEDED_WORD = "usurped";
export const HOLD_VERDICTS = Object.freeze(["attested", "hold"]);
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
  "03:50 codicil: a codicil that amends whichever deed sits on the desk is not a lawful addendum — it is a silent rewrite of a teammate's will. Score the attestation or admit the HEAD already moved.";
export const MARK = "03:50 / hermes catalog #126 / #91513";
export const PHRASE =
  "a codicil that amends whichever deed sits on the desk is not a lawful addendum — it is a silent rewrite of a teammate's will. Score the attestation or admit the HEAD already moved.";
export const HYPOTHESIS_NOTE =
  "NON-BINDING: product-level guardrail should refuse amend when HEAD ≠ agent's last commit SHA in shared trees; discard if issue evidence disagrees.";
export const CONTRAST_NOTE =
  "This is SHARED MULTI-AGENT WORKTREE — `git commit --amend` DOES NOT RE-CHECK HEAD; SILENTLY REWRITES CONCURRENT TEAMMATE COMMIT MESSAGE; AREA:AGENTS. Agent A creates C1. Before A's follow-up amend, Agent B commits C2 on top of C1 (shared non-worktree-isolated tree). A's `git commit --amend` does not re-check HEAD; it rewrites Agent B's C2 — keeps C2's tree byte-identical but discards B's commit message and replaces it with A's. Expected: before amend in a possibly-shared tree, verify `git rev-parse HEAD` still equals the SHA from the agent's own prior commit; refuse/warn if HEAD moved. Impact: git history/metadata only (message + parent linkage); no working-tree file loss. Reporter KinohTaGo. Claude Code 2.1.239. Filed 2026-09-02. OPEN, has repro, area:agents.";
export const FORBIDDEN_IDLE = Object.freeze([
  "sealed",
  "rewritten",
  "swaged",
  "torn",
  "homed",
  "crossed",
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
  "Literata",
  "Fragment Mono",
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
    noRevParseGuard: null,
    usurped: null,
    teammateRewrite: null,
    messageDiscard: null,
    treeIdentical: null,
    sharedWorktree: null,
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

export function seedAttested() {
  return {
    ...blankTicket(),
    seed: IDLE_WORD,
    source: "atelier",
    recheckHead: true,
    headMoved: false,
    amendBlind: false,
    noRevParseGuard: false,
    usurped: false,
    teammateRewrite: false,
    messageDiscard: false,
    treeIdentical: false,
    sharedWorktree: false,
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
      "attested; git rev-parse HEAD still equals Agent A's own C1 SHA; amend is safe; idle word attested",
  };
}

export function seedUsurped() {
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
    noRevParseGuard: true,
    usurped: true,
    teammateRewrite: true,
    messageDiscard: true,
    treeIdentical: true,
    sharedWorktree: true,
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
      "usurped; #91513; shared multi-agent worktree; git commit --amend does not re-check HEAD; Agent A C1 then Agent B C2 then A amends C2; C2 tree byte-identical; B's message discarded and replaced with A's; KinohTaGo; Claude Code 2.1.239; area:agents",
  };
}

export function seedHeadMoved() {
  return {
    ...blankTicket(),
    seed: "head-moved",
    source: "atelier",
    headMoved: true,
    usurped: true,
    agentSha: AGENT_SHA,
    currentHead: TEAMMATE_SHA,
    outputText:
      "head-moved; git rev-parse HEAD is Agent B's C2, not Agent A's C1 SHA from the prior commit",
  };
}

export function seedTeammateRewrite() {
  return {
    ...blankTicket(),
    seed: "teammate-rewrite",
    source: "atelier",
    teammateRewrite: true,
    usurped: true,
    outputText:
      "teammate-rewrite; Agent A's --amend rewrites Agent B's C2 instead of A's own C1",
  };
}

export function seedMessageDiscard() {
  return {
    ...blankTicket(),
    seed: "message-discard",
    source: "atelier",
    messageDiscard: true,
    usurped: true,
    agentAMessage: AGENT_A_MESSAGE,
    agentBMessage: AGENT_B_MESSAGE,
    outputText:
      "message-discard; Agent B's C2 commit message discarded and replaced with Agent A's intended amend",
  };
}

export function seedTreeIdentical() {
  return {
    ...blankTicket(),
    seed: "tree-identical",
    source: "atelier",
    treeIdentical: true,
    usurped: true,
    treeSha: TREE_SHA,
    outputText:
      "tree-identical; amended commit's tree is byte-identical to C2; no working-tree file loss; history/metadata only",
  };
}

export function seedNoRevParseGuard() {
  return {
    ...blankTicket(),
    seed: "no-rev-parse-guard",
    source: "atelier",
    noRevParseGuard: true,
    amendBlind: true,
    recheckHead: false,
    usurped: true,
    outputText:
      "no-rev-parse-guard; git commit --amend does not re-check git rev-parse HEAD against the agent's own prior SHA",
  };
}

export function seedSharedWorktree() {
  return {
    ...blankTicket(),
    seed: "shared-worktree",
    source: "atelier",
    sharedWorktree: true,
    worktreeIsolated: false,
    usurped: true,
    outputText:
      "shared-worktree; Agent Teams teammates share one plain git working tree; no worktree isolation",
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
    ...seedAttested(),
    seed: "hold",
    outputText:
      "hold; HEAD still Agent A's own SHA; the attestation holds; idle word attested",
  };
}

export function seedCousin() {
  return {
    ...seedAttested(),
    seed: IDLE_WORD,
    issue: COUSIN_ISSUE,
    isolation: "cousin",
    cousin: String(COUSIN_ISSUE),
    outputText:
      "cousin-not-primary; #90943 concurrent sessions stale git index — cite only, not the #91513 amend-no-recheck-HEAD rewrite",
  };
}

export function emptyTicket() {
  return seedAttested();
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
    noRevParseGuard: firstBool(nested.noRevParseGuard, src.noRevParseGuard),
    usurped: firstBool(nested.usurped, src.usurped, nested.rewritten, src.rewritten),
    teammateRewrite: firstBool(nested.teammateRewrite, src.teammateRewrite),
    messageDiscard: firstBool(
      nested.messageDiscard,
      src.messageDiscard,
      nested.messageUsurp,
      src.messageUsurp,
    ),
    treeIdentical: firstBool(nested.treeIdentical, src.treeIdentical),
    sharedWorktree: firstBool(
      nested.sharedWorktree,
      src.sharedWorktree,
      nested.sharedTree,
      src.sharedTree,
    ),
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
    row.noRevParseGuard == null &&
    row.usurped == null &&
    row.rewritten == null &&
    row.teammateRewrite == null &&
    row.messageDiscard == null &&
    row.messageUsurp == null &&
    row.treeIdentical == null &&
    row.sharedWorktree == null &&
    row.sharedTree == null
  );
}

const SEED_FNS = {
  [IDLE_WORD]: seedAttested,
  [SEEDED_WORD]: seedUsurped,
  "head-moved": seedHeadMoved,
  "teammate-rewrite": seedTeammateRewrite,
  "message-discard": seedMessageDiscard,
  "tree-identical": seedTreeIdentical,
  "no-rev-parse-guard": seedNoRevParseGuard,
  "shared-worktree": seedSharedWorktree,
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
    return { ...seedUsurped(), ...cloned, ...raw };
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

export function isAttested(ticket) {
  const row = cloneTicket(ticket);
  if (row.isolation === "cousin") return true;
  if (canonicalSeed(row.seed) === IDLE_WORD) return true;
  if (canonicalSeed(row.seed) === "hold") return true;
  if (
    row.recheckHead === true &&
    row.headMoved !== true &&
    row.usurped !== true &&
    row.amendBlind !== true &&
    row.noRevParseGuard !== true
  ) {
    return true;
  }
  return false;
}

export function isUsurped(ticket) {
  const row = cloneTicket(ticket);
  const named = canonicalSeed(row.seed);
  if (named === IDLE_WORD || named === "hold") return false;
  if (COUSINS.includes(row.issue) && named !== SEEDED_WORD) return false;
  if (named === SEEDED_WORD) return true;
  if (row.issue === FEATURED_ISSUE && named !== IDLE_WORD) return true;
  if (
    row.usurped === true ||
    row.amendBlind === true ||
    row.noRevParseGuard === true ||
    (row.headMoved === true && row.recheckHead === false) ||
    (row.teammateRewrite === true && row.messageDiscard === true)
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
  const usurpedNow = !cousinOnly && isUsurped(row);
  const attestedNow = !usurpedNow && isAttested(row);
  const headMoved =
    row.headMoved === true ||
    named === "head-moved" ||
    /head-moved|HEAD moved|HEAD is Agent B|rev-parse HEAD is Agent B/i.test(text);
  const teammateRewrite =
    row.teammateRewrite === true ||
    named === "teammate-rewrite" ||
    /teammate-rewrite|rewrites Agent B|rewrites concurrent teammate/i.test(text);
  const messageDiscard =
    row.messageDiscard === true ||
    named === "message-discard" ||
    /message-discard|message discarded|replaced with Agent A/i.test(text);
  const treeIdentical =
    row.treeIdentical === true ||
    named === "tree-identical" ||
    /tree-identical|byte-identical|tree is byte-identical/i.test(text);
  const noRevParseGuard =
    row.noRevParseGuard === true ||
    row.amendBlind === true ||
    named === "no-rev-parse-guard" ||
    /no-rev-parse-guard|does not re-check|does not re-check HEAD/i.test(text);
  const sharedWorktree =
    row.sharedWorktree === true ||
    named === "shared-worktree" ||
    /shared-worktree|shared multi-agent|no worktree isolation/i.test(text);
  const hasClearRepro =
    row.hasClearRepro === true ||
    named === "has-clear-repro" ||
    /has-clear-repro|KinohTaGo|has repro|area:agents/i.test(text);
  const usurped =
    named !== IDLE_WORD &&
    named !== "hold" &&
    !cousinOnly &&
    (usurpedNow || named === SEEDED_WORD || /usurped|#91513/i.test(text));
  const attested =
    named === IDLE_WORD || named === "hold" || (attestedNow && !usurped);
  return {
    named,
    cousinOnly,
    usurpedNow,
    attestedNow,
    headMoved,
    teammateRewrite,
    messageDiscard,
    treeIdentical,
    noRevParseGuard,
    sharedWorktree,
    hasClearRepro,
    usurped,
    attested,
  };
}

export function chipsOf(ticket) {
  const flags = flagsOf(ticket);
  const chips = [];
  if (flags.attested && !flags.usurped) chips.push("attested");
  if (flags.usurped) chips.push("usurped");
  if (flags.headMoved && flags.usurped) chips.push("head-moved");
  if (flags.teammateRewrite && flags.usurped) chips.push("teammate-rewrite");
  if (flags.messageDiscard && flags.usurped) chips.push("message-discard");
  if (flags.treeIdentical && flags.usurped) chips.push("tree-identical");
  if (flags.noRevParseGuard && flags.usurped) chips.push("no-rev-parse-guard");
  if (flags.sharedWorktree && flags.usurped) chips.push("shared-worktree");
  if (flags.hasClearRepro && flags.usurped) chips.push("has-clear-repro");
  if ((flags.attested || flags.named === "hold") && !flags.usurped) {
    chips.push("hold");
  }
  if (ticket.seed && VERDICTS.includes(ticket.seed)) chips.push(ticket.seed);
  return [...new Set(chips)];
}

function reasonsOf(ticket, flags, verdict) {
  const reasons = [];
  if (verdict === "attested") {
    reasons.push(
      "attested; git rev-parse HEAD still equals Agent A's own C1 SHA; amend is safe",
    );
    reasons.push("hold: the deed is an attested clause; idle word attested");
  }
  if (verdict === "hold") {
    reasons.push(
      "hold; HEAD still Agent A's own SHA; the attestation holds",
    );
  }
  if (verdict === "usurped" || flags.usurped) {
    reasons.push(
      "usurped; #91513; git commit --amend does not re-check HEAD; silently rewrites concurrent teammate C2",
    );
  }
  if (flags.headMoved || verdict === "head-moved") {
    reasons.push(
      "head-moved; git rev-parse HEAD is Agent B's C2, not Agent A's C1 SHA from the prior commit",
    );
  }
  if (flags.teammateRewrite || verdict === "teammate-rewrite") {
    reasons.push(
      "teammate-rewrite; Agent A's --amend rewrites Agent B's C2 instead of A's own C1",
    );
  }
  if (flags.messageDiscard || verdict === "message-discard") {
    reasons.push(
      "message-discard; Agent B's C2 commit message discarded and replaced with Agent A's intended amend",
    );
  }
  if (flags.treeIdentical || verdict === "tree-identical") {
    reasons.push(
      "tree-identical; amended commit's tree is byte-identical to C2; no working-tree file loss; history/metadata only",
    );
  }
  if (flags.noRevParseGuard || verdict === "no-rev-parse-guard") {
    reasons.push(
      "no-rev-parse-guard; git commit --amend does not re-check git rev-parse HEAD against the agent's own prior SHA",
    );
  }
  if (flags.sharedWorktree || verdict === "shared-worktree") {
    reasons.push(
      "shared-worktree; Agent Teams teammates share one plain git working tree; no worktree isolation",
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
  if (verdict === "usurped" || flags.usurped) {
    reasons.push(HYPOTHESIS_NOTE);
    reasons.push(CONTRAST_NOTE);
  }
  if (verdict !== "attested" && verdict !== "hold") {
    reasons.push(PHRASE);
  }
  return reasons;
}

function pickVerdict(seed, flags) {
  const named = canonicalSeed(seed);
  if (named === IDLE_WORD && (flags.attested || !flags.usurped)) return "attested";
  if (named === "hold" && !flags.usurped) return "hold";
  if (named === SEEDED_WORD) return "usurped";
  if (VERDICTS.includes(named) && named !== IDLE_WORD && named !== "hold") {
    return named;
  }
  if (flags.cousinOnly) return "attested";
  if (flags.usurped) return "usurped";
  if (flags.attested) return "attested";
  return "attested";
}

function benchOf(flags, ticket, verdict) {
  if (verdict === "usurped" || flags.usurped) {
    return {
      case: "usurped — blind amend; silent rewrite of a teammate's will",
      jaw: "git commit --amend operates on whatever HEAD is, not the commit Agent A just made",
      shear: "HEAD moved from C1 to teammate C2; no git rev-parse re-check",
      drop: "C2 tree kept byte-identical; B's message discarded and replaced with A's",
      mark: "codicil usurped; admit the HEAD already moved",
      note: PHRASE,
    };
  }
  if (verdict === "hold") {
    return {
      case: "attested — HEAD still agent's own SHA; amend safe",
      jaw: "git rev-parse HEAD equals the SHA from Agent A's own prior commit",
      shear: "HEAD has not moved; no concurrent C2",
      drop: "the deed on the desk is still A's will",
      mark: "codicil attested; the deed holds",
      note: "Hold: the deed is attested.",
    };
  }
  return {
    case: "attested — HEAD still agent's own SHA; amend safe",
    jaw: "before amend, verify git rev-parse HEAD still equals the agent's own SHA",
    shear: "no mid-desk rewrite; no usurped legatee",
    drop: "concurrent clerks cannot rewrite the attested deed",
    mark: "codicil attested; idle word attested",
    note: "Attested: the deed holds.",
  };
}

export function analyze(input) {
  const ticket = normalize(input);
  const flags = flagsOf(ticket);
  const chips = chipsOf(ticket);
  const seed = String(ticket.seed || "");
  const verdict = pickVerdict(seed, flags);
  const hold = HOLD_VERDICTS.includes(verdict);
  const usurped = verdict === "usurped" || flags.usurped;
  return {
    verdict,
    chips,
    reasons: reasonsOf(ticket, flags, verdict),
    attested: verdict === "attested" || (flags.attested && !usurped),
    usurped,
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
    return analyze(seedUsurped());
  }
  if (name === "head-moved") return analyze(seedHeadMoved());
  if (name === "teammate-rewrite") return analyze(seedTeammateRewrite());
  if (name === "message-discard") return analyze(seedMessageDiscard());
  if (name === "tree-identical") return analyze(seedTreeIdentical());
  if (name === "no-rev-parse-guard") return analyze(seedNoRevParseGuard());
  if (name === "shared-worktree") return analyze(seedSharedWorktree());
  if (name === "has-clear-repro") return analyze(seedHasClearRepro());
  if (name === "hold") return analyze(seedHold());
  if (name === IDLE_WORD || name === "attested" || name === "open") {
    return analyze(seedAttested());
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
  return analyze(seedAttested());
}

export function handle(input) {
  const result = analyze(input);
  return {
    ...result,
    hookSpecificOutput: {
      additionalContext:
        result.verdict === "usurped" || (result.usurped && result.alarm)
          ? `usurped codicil #${FEATURED_ISSUE}: git commit --amend does not re-check HEAD; silently rewrites concurrent teammate C2. ${HYPOTHESIS_NOTE}`
          : result.verdict === "hold"
            ? "hold. HEAD still Agent A's own SHA. Score the attestation."
            : `attested codicil. Idle word ${IDLE_WORD}. git rev-parse HEAD still equals Agent A's own C1 SHA; amend is safe.`,
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
