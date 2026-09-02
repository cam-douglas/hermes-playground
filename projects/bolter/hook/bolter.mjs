#!/usr/bin/env node
/**
 * Bolter — flour-mill bolting-cloth atelier classifier.
 * A bolter that catches every option token — even bare -- — while
 * rm -rf slips the same mesh is not a safety policy; it is a
 * snagged matcher. Score the cloth or admit the allow-rule already
 * lied.
 *
 *   echo '{"optionToken":true,"flaglessRuns":true}' | node bolter.mjs
 *   node bolter.mjs ticket.json
 *
 * Idle word is unbolted (HOLD: flagged cp/mv including `cp --`
 * pass the allow-rule mesh under dontAsk).
 * Seeded state is snagged / #91422 (any option token on cp/mv
 * refused; rm -rf unaffected; matcher artifact).
 * NEVER idle as creased / bled / latched / vanished / sealed /
 * rebound / dark / spurious / fenced / swept / tolled / mute /
 * honored / discarded / arrested / skipped / indexed / jumped /
 * chocked / rolled / clasped / sprung / drained / hinged / pealed /
 * warded / pooled / cased / aired / sifted / stocked / stationed /
 * marvered / unpinned / rinsed / literal / choked / opened /
 * stalled / fused / forged / attributed / reeved / fouled.
 *
 * Primary #91422: `--permission-mode dontAsk`: `cp`/`mv` refuse any
 * option token (including bare `--`) while the flagless form runs;
 * `rm` is unaffected. Measured on Claude Code 2.1.251, run E.
 * Allow rules at same breadth: Bash(cp:*), Bash(mv:*), Bash(rm:*).
 * REFUSED: cp -f, cp -v, cp --, mv -v. RAN: bare cp, bare mv,
 * rm -f, rm -rf. cp -f with relative paths still REFUSED (not
 * absolute-vs-relative). Deterministic across repeated arms in one
 * session (not a race). cp -- is POSIX end-of-options with no
 * force semantics. rm -rf under identical rule shape runs — a real
 * force/destructive policy would refuse rm first. Cost: agent
 * guidance to always pass force flags on cp/mv (avoid -i alias
 * hang) is unfollowable; teams wrote flagless-form exemptions.
 * Reporter alfalcon90. Filed 2026-09-02T07:28:49Z. OPEN. Labels:
 * bug, has repro, area:bash, area:permissions.
 *
 * Hypothesis only (NON-BINDING): dontAsk matcher may classify any
 * token after cp/mv as a gated option, including bare `--`, while
 * rm uses a different code path. Do not claim source you have not
 * seen beyond the issue's measured repro. Verify against the issue
 * text and discard if wrong.
 *
 * This is a diagnostic scoring bench. NOT an exploit. No payloads.
 * Score whether the cloth is unbolted or snagged.
 *
 * NOT Deadeye #91226 (relative PreToolUse Bash hook path × drifted
 * cwd → permanent Bash deadlock).
 * NOT Reglet #91443 / Reliquary #91433 / Annunciator #91419 /
 * Caisson #91405 / Spindle #91402 / Knell #91298.
 * NOT Tumbler / Escapement / Geneva / Scotch / Carillon / Pintle /
 * Fibula / Virgule / Riddle / Garner / Postern / Sluice / Reveille /
 * standing-rigging deadeye metaphors.
 * NOT Toggle — this hour ships Bolter.
 * Product name stays Bolter. Do not rename to Deadeye / Reglet /
 * Reliquary / Annunciator / Caisson / Spindle / Knell / Tumbler /
 * Escapement / Geneva / Scotch / Fibula / Virgule / Riddle /
 * Garner / Pintle / Carillon / Postern / Sluice / Alidade /
 * Cockade / Lye / Clew / Hasp / Berth / Bollard / Reveille /
 * Callboard / Quench / Scrim / Knock.
 */

import { readFileSync } from "node:fs";
import { stdin } from "node:process";
import { pathToFileURL } from "node:url";

export const VERDICTS = Object.freeze([
  "unbolted",
  "snagged",
  "dontask",
  "option-token",
  "bare-end-of-options",
  "flagless-runs",
  "rm-rf-slips",
  "equal-breadth",
  "matcher-artifact",
  "force-flag-unfollowable",
  "not-path-class",
  "deterministic",
  "has-clear-repro",
  "hold",
]);
export const IDLE_WORD = "unbolted";
export const SEEDED_WORD = "snagged";
export const HOLD_VERDICTS = Object.freeze(["unbolted", "hold"]);
export const ALARM_VERDICTS = Object.freeze(
  VERDICTS.filter((name) => !HOLD_VERDICTS.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FEATURED_ISSUE = 91422;
export const PRIMARY_ISSUES = Object.freeze([91422]);
export const COUSINS = Object.freeze([74567, 76867, 76490, 91479]);
export const COUSIN_ISSUE = 74567;
export const RELATED_IN_ISSUE = Object.freeze([16449, 30519]);
export const BACKUPS = Object.freeze([
  { name: "Clepsydra", issue: 91414 },
  { name: "Skipjack", issue: 91480 },
  { name: "Platen", issue: 91438 },
]);
export const NOT_PRODUCTS = Object.freeze([
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
  "quench",
  "scrim",
  "knock",
  "toggle",
  "woodworking",
  "mm-slider",
  "millrace",
  "locksmith",
  "campanology",
  "standing-rigging",
]);
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/91422";
export const TITLE =
  "`--permission-mode dontAsk`: `cp`/`mv` refuse any option token (including bare `--`) while the flagless form runs; `rm` is unaffected";
export const FILED_AT = "2026-09-02T07:28:49Z";
export const UPDATED_AT = "2026-09-02T07:29:54Z";
export const LABELS = Object.freeze([
  "bug",
  "has repro",
  "area:bash",
  "area:permissions",
]);
export const REPORTER = "alfalcon90";
export const VERSION = "2.1.251";
export const RUN_LABEL = "run E";
export const PERMISSION_MODE = "--permission-mode dontAsk";
export const ALLOW_CP = "Bash(cp:*)";
export const ALLOW_MV = "Bash(mv:*)";
export const ALLOW_RM = "Bash(rm:*)";
export const REFUSED = Object.freeze(["cp -f", "cp -v", "cp --", "mv -v"]);
export const RAN = Object.freeze(["cp", "mv", "rm -f", "rm -rf"]);
export const POSIX_END_OF_OPTIONS = "cp --";
export const HUB_LINE =
  "21:50 bolter: a bolter that catches every option token — even bare -- — while rm -rf slips the same mesh is not a safety policy; it is a snagged matcher. Score the cloth or admit the allow-rule already lied.";
export const MARK = "21:50 / hermes catalog #122 / #91422";
export const PHRASE =
  "a bolter that catches every option token — even bare -- — while rm -rf slips the same mesh is not a safety policy; it is a snagged matcher. Score the cloth or admit the allow-rule already lied.";
export const HYPOTHESIS_NOTE =
  "NON-BINDING: dontAsk matcher may classify any token after cp/mv as a gated option, including bare `--`, while rm uses a different code path. Do not claim source you have not seen beyond the issue's measured repro. Verify against the issue text and discard if wrong.";
export const CONTRAST_NOTE =
  "This is DONTASK + EQUAL-BREADTH BASH(CP:*)/(MV:*) REFUSE ANY OPTION TOKEN INCL BARE -- WHILE BARE FORMS AND RM -RF RUN; MATCHER ARTIFACT NOT SAFETY POLICY; AREA:BASH+PERMISSIONS. Mode: --permission-mode dontAsk. Allow rules at same breadth: Bash(cp:*), Bash(mv:*), Bash(rm:*). REFUSED: cp -f, cp -v, cp --, mv -v. RAN: bare cp, bare mv, rm -f, rm -rf. cp -f with relative paths still REFUSED (not absolute-vs-relative). Deterministic across repeated arms in one session (not a race). cp -- is POSIX end-of-options with no force semantics — refusing it proves this is not a deliberate force-flag gate. rm -rf under identical rule shape runs — a real force/destructive policy would refuse rm first. Cost: agent guidance to always pass force flags on cp/mv (avoid -i alias hang) is unfollowable; teams wrote flagless-form exemptions. Reporter alfalcon90. Claude Code 2.1.251, run E. Filed 2026-09-02. OPEN, has repro, area:bash, area:permissions.";
export const FORBIDDEN_IDLE = Object.freeze([
  "creased",
  "bled",
  "latched",
  "vanished",
  "sealed",
  "rebound",
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
  "reeved",
  "fouled",
]);
export const BANNED_NAMES = Object.freeze([
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
  "Toggle",
]);
export const FORBIDDEN_UI = Object.freeze([
  "standing-rigging deadeye",
  "letterpress cream galley",
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

function firstList(...values) {
  for (const value of values) {
    if (Array.isArray(value) && value.length) return value;
  }
  return [];
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
    meshFair: null,
    flaggedAndFlaglessTogether: null,
    optionTokensPass: null,
    dontAsk: null,
    optionToken: null,
    bareEndOfOptions: null,
    flaglessRuns: null,
    rmRfSlips: null,
    equalBreadth: null,
    matcherArtifact: null,
    forceFlagUnfollowable: null,
    notPathClass: null,
    deterministic: null,
    hasClearRepro: null,
    permissionMode: "",
    allowCp: "",
    allowMv: "",
    allowRm: "",
    refused: [],
    ran: [],
    command: "",
    cliVersion: "",
    reporter: "",
    observed: "",
    runLabel: "",
    outputText: "",
  };
}

export function seedUnbolted() {
  return {
    ...blankTicket(),
    seed: IDLE_WORD,
    issue: null,
    source: "atelier",
    meshFair: true,
    flaggedAndFlaglessTogether: true,
    optionTokensPass: true,
    dontAsk: true,
    optionToken: false,
    bareEndOfOptions: false,
    flaglessRuns: true,
    rmRfSlips: false,
    equalBreadth: true,
    matcherArtifact: false,
    forceFlagUnfollowable: false,
    notPathClass: false,
    deterministic: false,
    hasClearRepro: false,
    permissionMode: PERMISSION_MODE,
    allowCp: ALLOW_CP,
    allowMv: ALLOW_MV,
    allowRm: ALLOW_RM,
    refused: [],
    ran: ["cp", "cp -f", "cp -v", "cp --", "mv", "mv -v", "rm -f", "rm -rf"],
    cliVersion: VERSION,
    reporter: "",
    observed: "",
    runLabel: RUN_LABEL,
    outputText:
      "unbolted; flagged cp/mv including cp -- pass the allow-rule mesh under dontAsk; idle word unbolted",
  };
}

export function seedSnagged() {
  return {
    ...blankTicket(),
    seed: SEEDED_WORD,
    issue: FEATURED_ISSUE,
    title: TITLE,
    url: ISSUE_URL,
    source: "atelier",
    meshFair: false,
    flaggedAndFlaglessTogether: false,
    optionTokensPass: false,
    dontAsk: true,
    optionToken: true,
    bareEndOfOptions: true,
    flaglessRuns: true,
    rmRfSlips: true,
    equalBreadth: true,
    matcherArtifact: true,
    forceFlagUnfollowable: true,
    notPathClass: true,
    deterministic: true,
    hasClearRepro: true,
    permissionMode: PERMISSION_MODE,
    allowCp: ALLOW_CP,
    allowMv: ALLOW_MV,
    allowRm: ALLOW_RM,
    refused: [...REFUSED],
    ran: [...RAN],
    cliVersion: VERSION,
    reporter: REPORTER,
    observed: "2026-09-02",
    runLabel: RUN_LABEL,
    outputText:
      "snagged; #91422; --permission-mode dontAsk; Bash(cp:*); Bash(mv:*); Bash(rm:*); cp -f REFUSED; cp -v REFUSED; cp -- REFUSED; mv -v REFUSED; bare cp RAN; bare mv RAN; rm -f RAN; rm -rf RAN; POSIX end-of-options; matcher artifact; equal breadth; force-flag unfollowable; alfalcon90; Claude Code 2.1.251; run E; area:bash area:permissions",
  };
}

export function seedDontask() {
  return {
    ...blankTicket(),
    seed: "dontask",
    source: "atelier",
    dontAsk: true,
    permissionMode: PERMISSION_MODE,
    outputText:
      "dontask; --permission-mode dontAsk; auto-deny what the matcher refuses",
  };
}

export function seedOptionToken() {
  return {
    ...blankTicket(),
    seed: "option-token",
    source: "atelier",
    optionToken: true,
    outputText:
      "option-token; any option token on cp/mv refused: cp -f, cp -v, cp --, mv -v",
  };
}

export function seedBareEndOfOptions() {
  return {
    ...blankTicket(),
    seed: "bare-end-of-options",
    source: "atelier",
    bareEndOfOptions: true,
    command: POSIX_END_OF_OPTIONS,
    outputText:
      "bare-end-of-options; cp -- is POSIX end-of-options with no force semantics — refusing it proves this is not a deliberate force-flag gate",
  };
}

export function seedFlaglessRuns() {
  return {
    ...blankTicket(),
    seed: "flagless-runs",
    source: "atelier",
    flaglessRuns: true,
    ran: ["cp", "mv"],
    outputText: "flagless-runs; bare cp RAN; bare mv RAN",
  };
}

export function seedRmRfSlips() {
  return {
    ...blankTicket(),
    seed: "rm-rf-slips",
    source: "atelier",
    rmRfSlips: true,
    ran: ["rm -f", "rm -rf"],
    outputText:
      "rm-rf-slips; rm -f RAN; rm -rf RAN under identical Bash(rm:*) breadth — a real force/destructive policy would refuse rm first",
  };
}

export function seedEqualBreadth() {
  return {
    ...blankTicket(),
    seed: "equal-breadth",
    source: "atelier",
    equalBreadth: true,
    allowCp: ALLOW_CP,
    allowMv: ALLOW_MV,
    allowRm: ALLOW_RM,
    outputText:
      "equal-breadth; Bash(cp:*), Bash(mv:*), Bash(rm:*) at the same breadth",
  };
}

export function seedMatcherArtifact() {
  return {
    ...blankTicket(),
    seed: "matcher-artifact",
    source: "atelier",
    matcherArtifact: true,
    outputText:
      "matcher-artifact; not a considered safety policy — the matcher snags every option token on cp/mv including inert bare POSIX --",
  };
}

export function seedForceFlagUnfollowable() {
  return {
    ...blankTicket(),
    seed: "force-flag-unfollowable",
    source: "atelier",
    forceFlagUnfollowable: true,
    outputText:
      "force-flag-unfollowable; agent guidance to always pass force flags on cp/mv (avoid -i alias hang) is unfollowable; teams wrote flagless-form exemptions",
  };
}

export function seedNotPathClass() {
  return {
    ...blankTicket(),
    seed: "not-path-class",
    source: "atelier",
    notPathClass: true,
    outputText:
      "not-path-class; cp -f with relative paths still REFUSED (not absolute-vs-relative)",
  };
}

export function seedDeterministic() {
  return {
    ...blankTicket(),
    seed: "deterministic",
    source: "atelier",
    deterministic: true,
    outputText:
      "deterministic; cp -f repeated as the last of several arms in the same session — still REFUSED (not a race)",
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
    runLabel: RUN_LABEL,
    outputText:
      "has-clear-repro; alfalcon90 filed #91422; has repro; area:bash; area:permissions; Claude Code 2.1.251; run E",
  };
}

export function seedHold() {
  return {
    ...seedUnbolted(),
    seed: "hold",
    outputText:
      "hold; flagged cp/mv including cp -- pass the allow-rule mesh under dontAsk; the bolter holds",
  };
}

export function seedCousin() {
  return {
    ...seedUnbolted(),
    seed: IDLE_WORD,
    issue: COUSIN_ISSUE,
    isolation: "cousin",
    cousin: String(COUSIN_ISSUE),
    outputText:
      "cousin-not-primary; #74567 dontAsk Write/Edit deny — cite only, not the #91422 bolting-cloth matcher snag",
  };
}

export function emptyTicket() {
  return seedUnbolted();
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
    meshFair: firstBool(nested.meshFair, src.meshFair),
    flaggedAndFlaglessTogether: firstBool(
      nested.flaggedAndFlaglessTogether,
      src.flaggedAndFlaglessTogether,
    ),
    optionTokensPass: firstBool(nested.optionTokensPass, src.optionTokensPass),
    dontAsk: firstBool(nested.dontAsk, src.dontAsk),
    optionToken: firstBool(nested.optionToken, src.optionToken),
    bareEndOfOptions: firstBool(nested.bareEndOfOptions, src.bareEndOfOptions),
    flaglessRuns: firstBool(nested.flaglessRuns, src.flaglessRuns),
    rmRfSlips: firstBool(nested.rmRfSlips, src.rmRfSlips),
    equalBreadth: firstBool(nested.equalBreadth, src.equalBreadth),
    matcherArtifact: firstBool(nested.matcherArtifact, src.matcherArtifact),
    forceFlagUnfollowable: firstBool(
      nested.forceFlagUnfollowable,
      src.forceFlagUnfollowable,
    ),
    notPathClass: firstBool(nested.notPathClass, src.notPathClass),
    deterministic: firstBool(nested.deterministic, src.deterministic),
    hasClearRepro: firstBool(nested.hasClearRepro, src.hasClearRepro),
    permissionMode: firstText(nested.permissionMode, src.permissionMode),
    allowCp: firstText(nested.allowCp, src.allowCp),
    allowMv: firstText(nested.allowMv, src.allowMv),
    allowRm: firstText(nested.allowRm, src.allowRm),
    refused: firstList(nested.refused, src.refused),
    ran: firstList(nested.ran, src.ran),
    command: firstText(nested.command, src.command),
    cliVersion: firstText(nested.cliVersion, src.cliVersion),
    reporter: firstText(nested.reporter, src.reporter),
    observed: firstText(nested.observed, src.observed),
    runLabel: firstText(nested.runLabel, src.runLabel),
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
    row.meshFair == null &&
    row.flaggedAndFlaglessTogether == null &&
    row.optionTokensPass == null &&
    row.dontAsk == null &&
    row.optionToken == null &&
    row.bareEndOfOptions == null &&
    row.flaglessRuns == null &&
    row.rmRfSlips == null &&
    row.equalBreadth == null &&
    row.matcherArtifact == null &&
    row.forceFlagUnfollowable == null &&
    row.notPathClass == null &&
    row.deterministic == null
  );
}

const SEED_FNS = {
  [IDLE_WORD]: seedUnbolted,
  [SEEDED_WORD]: seedSnagged,
  dontask: seedDontask,
  "option-token": seedOptionToken,
  "bare-end-of-options": seedBareEndOfOptions,
  "end-of-options": seedBareEndOfOptions,
  "flagless-runs": seedFlaglessRuns,
  "rm-rf-slips": seedRmRfSlips,
  "equal-breadth": seedEqualBreadth,
  "matcher-artifact": seedMatcherArtifact,
  "force-flag-unfollowable": seedForceFlagUnfollowable,
  "not-path-class": seedNotPathClass,
  "relative-still-refused": seedNotPathClass,
  deterministic: seedDeterministic,
  "has-clear-repro": seedHasClearRepro,
  hold: seedHold,
  cousin: seedCousin,
  74567: seedCousin,
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
    return { ...seedSnagged(), ...cloned, ...raw };
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
    ticket.permissionMode,
    ticket.allowCp,
    ticket.allowMv,
    ticket.allowRm,
    ticket.command,
    ticket.runLabel,
    ...(ticket.refused || []),
    ...(ticket.ran || []),
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

export function isUnbolted(ticket) {
  const row = cloneTicket(ticket);
  if (row.isolation === "cousin") return true;
  if (canonicalSeed(row.seed) === IDLE_WORD) return true;
  if (canonicalSeed(row.seed) === "hold") return true;
  if (
    row.meshFair === true &&
    row.optionTokensPass === true &&
    row.optionToken !== true &&
    row.matcherArtifact !== true
  ) {
    return true;
  }
  return false;
}

export function isSnagged(ticket) {
  const row = cloneTicket(ticket);
  const named = canonicalSeed(row.seed);
  if (named === IDLE_WORD || named === "hold") return false;
  if (COUSINS.includes(row.issue) && named !== SEEDED_WORD) return false;
  if (named === SEEDED_WORD) return true;
  if (row.issue === FEATURED_ISSUE && named !== IDLE_WORD) return true;
  if (
    (row.optionToken === true && row.flaglessRuns === true) ||
    (row.bareEndOfOptions === true && row.rmRfSlips === true) ||
    (row.matcherArtifact === true && row.equalBreadth === true && row.optionToken === true)
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
      /cousin-not-primary|#74567|#76867|#76490|#91479|#16449|#30519/i.test(text)) &&
    named !== SEEDED_WORD &&
    row.issue !== FEATURED_ISSUE;
  const snaggedNow = !cousinOnly && isSnagged(row);
  const unboltedNow = !snaggedNow && isUnbolted(row);
  const dontAsk =
    row.dontAsk === true ||
    named === "dontask" ||
    /dontask|dontAsk|--permission-mode dontAsk/i.test(text);
  const optionToken =
    row.optionToken === true ||
    named === "option-token" ||
    /option-token|cp -f|cp -v|mv -v|any option token/i.test(text);
  const bareEndOfOptions =
    row.bareEndOfOptions === true ||
    named === "bare-end-of-options" ||
    /bare-end-of-options|cp --|POSIX end-of-options/i.test(text);
  const flaglessRuns =
    row.flaglessRuns === true ||
    named === "flagless-runs" ||
    /flagless-runs|bare cp RAN|bare mv RAN/i.test(text);
  const rmRfSlips =
    row.rmRfSlips === true ||
    named === "rm-rf-slips" ||
    /rm-rf-slips|rm -rf RAN|rm -f RAN/i.test(text);
  const equalBreadth =
    row.equalBreadth === true ||
    named === "equal-breadth" ||
    /equal-breadth|Bash\(cp:\*\)|Bash\(mv:\*\)|Bash\(rm:\*\)/i.test(text);
  const matcherArtifact =
    row.matcherArtifact === true ||
    named === "matcher-artifact" ||
    /matcher-artifact|matcher artifact|not a safety policy/i.test(text);
  const forceFlagUnfollowable =
    row.forceFlagUnfollowable === true ||
    named === "force-flag-unfollowable" ||
    /force-flag-unfollowable|force flags on cp\/mv|-i alias hang|flagless-form exemption/i.test(
      text,
    );
  const notPathClass =
    row.notPathClass === true ||
    named === "not-path-class" ||
    /not-path-class|relative paths still REFUSED|not absolute-vs-relative/i.test(
      text,
    );
  const deterministic =
    row.deterministic === true ||
    named === "deterministic" ||
    /deterministic|not a race|repeated arms/i.test(text);
  const hasClearRepro =
    row.hasClearRepro === true ||
    named === "has-clear-repro" ||
    /has-clear-repro|alfalcon90|has repro|area:bash|area:permissions/i.test(
      text,
    );
  const snagged =
    named !== IDLE_WORD &&
    named !== "hold" &&
    !cousinOnly &&
    (snaggedNow || named === SEEDED_WORD || /snagged|#91422/i.test(text));
  const unbolted =
    named === IDLE_WORD || named === "hold" || (unboltedNow && !snagged);
  return {
    named,
    cousinOnly,
    snaggedNow,
    unboltedNow,
    dontAsk,
    optionToken,
    bareEndOfOptions,
    flaglessRuns,
    rmRfSlips,
    equalBreadth,
    matcherArtifact,
    forceFlagUnfollowable,
    notPathClass,
    deterministic,
    hasClearRepro,
    snagged,
    unbolted,
  };
}

export function chipsOf(ticket) {
  const flags = flagsOf(ticket);
  const chips = [];
  if (flags.unbolted && !flags.snagged) chips.push("unbolted");
  if (flags.snagged) chips.push("snagged");
  if (flags.dontAsk && flags.snagged) chips.push("dontask");
  if (flags.optionToken && flags.snagged) chips.push("option-token");
  if (flags.bareEndOfOptions && flags.snagged) chips.push("bare-end-of-options");
  if (flags.flaglessRuns && flags.snagged) chips.push("flagless-runs");
  if (flags.rmRfSlips && flags.snagged) chips.push("rm-rf-slips");
  if (flags.equalBreadth && flags.snagged) chips.push("equal-breadth");
  if (flags.matcherArtifact && flags.snagged) chips.push("matcher-artifact");
  if (flags.forceFlagUnfollowable && flags.snagged) {
    chips.push("force-flag-unfollowable");
  }
  if (flags.notPathClass && flags.snagged) chips.push("not-path-class");
  if (flags.deterministic && flags.snagged) chips.push("deterministic");
  if (flags.hasClearRepro && flags.snagged) chips.push("has-clear-repro");
  if ((flags.unbolted || flags.named === "hold") && !flags.snagged) {
    chips.push("hold");
  }
  if (ticket.seed && VERDICTS.includes(ticket.seed)) chips.push(ticket.seed);
  return [...new Set(chips)];
}

function reasonsOf(ticket, flags, verdict) {
  const reasons = [];
  if (verdict === "unbolted") {
    reasons.push(
      "unbolted; flagged cp/mv including cp -- pass the allow-rule mesh under dontAsk",
    );
    reasons.push(
      "hold: the bolter sifts under a fair mesh; flagged and flagless forms pass together",
    );
  }
  if (verdict === "hold") {
    reasons.push(
      "hold; flagged cp/mv including cp -- pass the allow-rule mesh under dontAsk; the bolter holds",
    );
  }
  if (verdict === "snagged" || flags.snagged) {
    reasons.push(
      "snagged; #91422; any option token on cp/mv refused; rm -rf unaffected; matcher artifact",
    );
  }
  if (flags.dontAsk || verdict === "dontask") {
    reasons.push("dontask; --permission-mode dontAsk");
  }
  if (flags.optionToken || verdict === "option-token") {
    reasons.push(
      "option-token; REFUSED: cp -f, cp -v, cp --, mv -v — any option token on cp/mv",
    );
  }
  if (flags.bareEndOfOptions || verdict === "bare-end-of-options") {
    reasons.push(
      "bare-end-of-options; cp -- is POSIX end-of-options with no force semantics — refusing it proves this is not a deliberate force-flag gate",
    );
  }
  if (flags.flaglessRuns || verdict === "flagless-runs") {
    reasons.push("flagless-runs; bare cp RAN; bare mv RAN");
  }
  if (flags.rmRfSlips || verdict === "rm-rf-slips") {
    reasons.push(
      "rm-rf-slips; rm -f RAN; rm -rf RAN under identical Bash(rm:*) — a real force/destructive policy would refuse rm first",
    );
  }
  if (flags.equalBreadth || verdict === "equal-breadth") {
    reasons.push(
      "equal-breadth; Bash(cp:*), Bash(mv:*), Bash(rm:*) at the same breadth",
    );
  }
  if (flags.matcherArtifact || verdict === "matcher-artifact") {
    reasons.push(
      "matcher-artifact; not a considered safety policy — the matcher snags every option token on cp/mv including inert bare POSIX --",
    );
  }
  if (flags.forceFlagUnfollowable || verdict === "force-flag-unfollowable") {
    reasons.push(
      "force-flag-unfollowable; agent guidance to always pass force flags on cp/mv (avoid -i alias hang) is unfollowable; teams wrote flagless-form exemptions",
    );
  }
  if (flags.notPathClass || verdict === "not-path-class") {
    reasons.push(
      "not-path-class; cp -f with relative paths still REFUSED (not absolute-vs-relative)",
    );
  }
  if (flags.deterministic || verdict === "deterministic") {
    reasons.push(
      "deterministic; repeated arms in one session still REFUSED (not a race)",
    );
  }
  if (flags.hasClearRepro || verdict === "has-clear-repro") {
    reasons.push(
      `has-clear-repro; ${REPORTER} filed #${FEATURED_ISSUE}; has repro; CLI ${VERSION}; ${RUN_LABEL}; area:bash; area:permissions`,
    );
  }
  if (flags.cousinOnly) {
    reasons.push(
      "cousin is not Bolter; cite-only #74567 dontAsk Write/Edit deny / #76867 dontAsk denied-tool still reports success / #76490 Bash allow-list Windows drive-letter + defaultMode dontAsk / #91479 blockReadsOutsideWorkingDirectories flag values misidentified as paths — not the #91422 bolting-cloth option-token snag",
    );
  }
  if (verdict === "snagged" || flags.snagged) {
    reasons.push(HYPOTHESIS_NOTE);
    reasons.push(CONTRAST_NOTE);
  }
  if (verdict !== "unbolted" && verdict !== "hold") {
    reasons.push(PHRASE);
  }
  return reasons;
}

function pickVerdict(seed, flags) {
  const named = canonicalSeed(seed);
  if (named === IDLE_WORD && (flags.unbolted || !flags.snagged)) return "unbolted";
  if (named === "hold" && !flags.snagged) return "hold";
  if (named === SEEDED_WORD) return "snagged";
  if (VERDICTS.includes(named) && named !== IDLE_WORD && named !== "hold") {
    return named;
  }
  if (flags.cousinOnly) return "unbolted";
  if (flags.snagged) return "snagged";
  if (flags.unbolted) return "unbolted";
  return "unbolted";
}

function chamberOf(flags, ticket, verdict) {
  if (verdict === "snagged" || flags.snagged) {
    return {
      case: "snagged — option tokens catch on the cloth; rm -rf slips",
      cloth: "dontAsk equal-breadth Bash(cp:*) / Bash(mv:*) / Bash(rm:*)",
      snag: "cp -f, cp -v, cp --, mv -v REFUSED; bare -- is POSIX end-of-options",
      slip: "bare cp / bare mv / rm -f / rm -rf RAN",
      mark: "bolter snagged the option tokens; admit the allow-rule already lied",
      note: PHRASE,
    };
  }
  if (verdict === "hold") {
    return {
      case: "unbolted — fair mesh; flagged and flagless pass together",
      cloth: "dontAsk equal-breadth allow rules honoured for option tokens",
      snag: "cp -- and force flags pass the mesh",
      slip: "nothing slips; rm and cp/mv share the same breadth honestly",
      mark: "bolter unbolted; the cloth holds",
      note: "Hold: the bolter is unbolted.",
    };
  }
  return {
    case: "unbolted — fair mesh; flagged and flagless pass together",
    cloth: "Bash(cp:*) / Bash(mv:*) / Bash(rm:*) under dontAsk",
    snag: "option tokens including bare -- pass",
    slip: "flour-dust quiet; atelier unbolted",
    mark: "bolter unbolted; idle word unbolted",
    note: "Unbolted: the bolter holds.",
  };
}

export function analyze(input) {
  const ticket = normalize(input);
  const flags = flagsOf(ticket);
  const chips = chipsOf(ticket);
  const seed = String(ticket.seed || "");
  const verdict = pickVerdict(seed, flags);
  const hold = HOLD_VERDICTS.includes(verdict);
  const snagged = verdict === "snagged" || flags.snagged;
  return {
    verdict,
    chips,
    reasons: reasonsOf(ticket, flags, verdict),
    unbolted: verdict === "unbolted" || (flags.unbolted && !snagged),
    snagged,
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
  if (name === SEEDED_WORD || name === 91422 || name === "91422") {
    return analyze(seedSnagged());
  }
  if (name === "dontask") return analyze(seedDontask());
  if (name === "option-token") return analyze(seedOptionToken());
  if (name === "bare-end-of-options" || name === "end-of-options") {
    return analyze(seedBareEndOfOptions());
  }
  if (name === "flagless-runs") return analyze(seedFlaglessRuns());
  if (name === "rm-rf-slips") return analyze(seedRmRfSlips());
  if (name === "equal-breadth") return analyze(seedEqualBreadth());
  if (name === "matcher-artifact") return analyze(seedMatcherArtifact());
  if (name === "force-flag-unfollowable") {
    return analyze(seedForceFlagUnfollowable());
  }
  if (name === "not-path-class" || name === "relative-still-refused") {
    return analyze(seedNotPathClass());
  }
  if (name === "deterministic") return analyze(seedDeterministic());
  if (name === "has-clear-repro") return analyze(seedHasClearRepro());
  if (name === "hold") return analyze(seedHold());
  if (name === IDLE_WORD || name === "unbolted" || name === "open") {
    return analyze(seedUnbolted());
  }
  if (
    name === 74567 ||
    name === "74567" ||
    name === "cousin" ||
    name === 76867 ||
    name === "76867" ||
    name === 76490 ||
    name === "76490" ||
    name === 91479 ||
    name === "91479"
  ) {
    return analyze(seedCousin());
  }
  if (SEED_FNS[name]) return analyze(SEED_FNS[name]());
  return analyze(seedUnbolted());
}

export function handle(input) {
  const result = analyze(input);
  return {
    ...result,
    hookSpecificOutput: {
      additionalContext:
        result.verdict === "snagged" || (result.snagged && result.alarm)
          ? `snagged bolter #${FEATURED_ISSUE}: any option token on cp/mv refused under dontAsk while rm -rf slips the same mesh. ${HYPOTHESIS_NOTE}`
          : result.verdict === "hold"
            ? "hold. Flagged cp/mv including cp -- pass the allow-rule mesh under dontAsk. Bolt the cloth."
            : `unbolted bolter. Idle word ${IDLE_WORD}. Flagged cp/mv including cp -- pass the allow-rule mesh under dontAsk.`,
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
