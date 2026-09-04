#!/usr/bin/env node
/**
 * Frisket — print-shop / frisket-resist scoring-desk classifier.
 * A frisket that never seats before the press is not a resist —
 * it is a bleed already printed. Score the mask or admit the
 * plate already bled.
 *
 *   echo '{"preInvoked":false,"writeCompleted":true,"postFired":true}' | node frisket.mjs
 *   node frisket.mjs ticket.json
 *
 * Idle word is masked (HOLD: PreToolUse deny seats before Write;
 * file not created; PostToolUse does not fire).
 * Seeded state is bled / #91574 (PreToolUse deny returned or never
 * invoked; Write still completes; PostToolUse fires).
 *
 * This is a diagnostic scoring desk. NOT an exploit.
 * No payloads. No attack procedures. No real credentials.
 * Score fixture strings for whether the frisket masked
 * (Pre deny seated; write held) or the plate already bled
 * (deny computed or Pre skipped; write landed; Post fired).
 *
 * Primary #91574: PreToolUse hook on Write/Edit/MultiEdit/
 * NotebookEdit is not enforced (PostToolUse on same matcher
 * fires reliably). Reporter technoashu. Filed 2026-09-02T18:56:28Z.
 * OPEN. Labels: bug, has repro, platform:macos, area:hooks.
 * CLI 2.1.245 on macOS Darwin 25.3.0. Commenter yurukusa on
 * Linux/WSL 2.1.258 could NOT reproduce (deny held, Pre fired,
 * Post did not).
 *
 * Hypothesis only (NON-BINDING): PreToolUse matcher for
 * Write-family may fail to register on macOS paths while
 * PostToolUse on the same matcher registers; or deny decision
 * ignored between 2.1.245–2.1.258. Discard if issue evidence
 * disagrees. Do not claim Claude Code source you have not seen.
 */

import { readFileSync } from "node:fs";
import { stdin } from "node:process";
import { pathToFileURL } from "node:url";

export const VERDICTS = Object.freeze([
  "masked",
  "bled",
  "pre-skipped",
  "deny-ignored",
  "post-fired",
  "canary-deny",
  "macos-only",
  "linux-hold",
  "bypass-mode",
  "hold",
]);
export const IDLE_WORD = "masked";
export const SEEDED_WORD = "bled";
export const HOLD_VERDICTS = Object.freeze(["masked", "hold", "linux-hold"]);
export const ALARM_VERDICTS = Object.freeze(
  VERDICTS.filter((name) => !HOLD_VERDICTS.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FEATURED_ISSUE = 91574;
export const PRIMARY_ISSUES = Object.freeze([91574]);
export const COUSINS = Object.freeze([89251, 82642, 88896, 77735]);
export const COUSIN_ISSUE = 89251;
export const BACKUPS = Object.freeze([]);
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/91574";
export const TITLE =
  "PreToolUse hook on Write/Edit/MultiEdit/NotebookEdit is not enforced (PostToolUse on same matcher fires reliably)";
export const FILED_AT = "2026-09-02T18:56:28Z";
export const UPDATED_AT = "2026-09-03T20:42:25Z";
export const LABELS = Object.freeze([
  "bug",
  "has repro",
  "platform:macos",
  "area:hooks",
]);
export const REPORTER = "technoashu";
export const COMMENTER = "yurukusa";
export const VERSION = "2.1.245";
export const COMMENTER_VERSION = "2.1.258";
export const PLATFORM = "macOS Darwin 25.3.0";
export const COMMENTER_PLATFORM = "Linux 6.6.87.2 WSL2 Ubuntu 24.04";
export const AREA = "area:hooks";
export const EVIDENCE = "pretooluse-write-family-deny-not-enforced";
export const MATCHER = "Write|Edit|MultiEdit|NotebookEdit";
export const CANARY_DENY = "DENY:test";
export const PERMISSION_MODE = "bypassPermissions";
export const HUB_LINE =
  "19:50 frisket: a frisket that never seats before the press is not a resist — it is a bleed already printed. Score the mask or admit the plate already bled.";
export const MARK = "19:50 / hermes catalog #133 / #91574";
export const PHRASE =
  "Score the mask or admit the plate already bled.";
export const HYPOTHESIS_NOTE =
  "NON-BINDING: PreToolUse matcher for Write-family may fail to register on macOS paths while PostToolUse on the same matcher registers; or deny decision ignored between 2.1.245–2.1.258. Discard if issue evidence disagrees. Do not claim Claude Code source you have not seen.";
export const CONTRAST_NOTE =
  "This is HOOKS PRETOOLUSE WRITE-FAMILY ENFORCEMENT ON MACOS. CLI 2.1.245 on macOS Darwin 25.3.0: a sync PreToolUse hook on Write|Edit|MultiEdit|NotebookEdit returns permissionDecision deny (canary proves deny computed) but the write still completes; PostToolUse on the identical matcher fires every time; --debug hooks shows PostToolUse registering/firing and PreToolUse never appearing (no registration, no invocation). Reproduced under both --permission-mode bypassPermissions and normal permission mode with --allowedTools. Commenter yurukusa on Linux/WSL 2.1.258 could NOT reproduce (deny held, Pre fired, Post did not) — OS vs version not separated; if still on 2.1.258 then macOS-specific. Reporter technoashu. Filed 2026-09-02. OPEN, bug, has repro, platform:macos, area:hooks.";
export const FORBIDDEN_IDLE = Object.freeze([
  "sounded",
  "muted",
  "slipped",
  "fouled",
  "verbatim",
  "mangled",
  "moored",
  "aloft",
  "resolved",
  "literal",
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
  "Tangent",
  "Hawser",
  "Caret",
  "Buoy",
  "Solecism",
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
  "Instrument Serif",
  "Albert Sans",
  "Spline Sans Mono",
  "Spline Sans",
  "Playfair Display",
  "Playfair",
  "DM Sans",
  "Fragment Mono",
  "Fragment",
  "Petrona",
  "Sora",
  "Fira Code",
  "Fraunces",
  "Outfit",
]);
export const NOT_PRODUCTS = Object.freeze([
  "tangent",
  "hawser",
  "caret",
  "buoy",
  "solecism",
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
    persistMask: null,
    masked: null,
    bled: null,
    preInvoked: null,
    permissionDecision: "",
    writeCompleted: null,
    postFired: null,
    platform: "",
    cliVersion: "",
    canaryResult: "",
    permissionMode: "",
    matcher: "",
    area: "",
    evidence: "",
    reporter: "",
    commenter: "",
    outputText: "",
  };
}

export function seedMasked() {
  return {
    ...blankTicket(),
    seed: IDLE_WORD,
    source: "atelier",
    persistMask: true,
    masked: true,
    bled: false,
    preInvoked: true,
    permissionDecision: "deny",
    writeCompleted: false,
    postFired: false,
    platform: PLATFORM,
    cliVersion: VERSION,
    canaryResult: CANARY_DENY,
    permissionMode: PERMISSION_MODE,
    matcher: MATCHER,
    area: AREA,
    evidence: EVIDENCE,
    outputText:
      "masked; PreToolUse deny seats before Write; file not created; PostToolUse does not fire; idle word masked",
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
    persistMask: false,
    masked: false,
    bled: true,
    preInvoked: false,
    permissionDecision: "deny",
    writeCompleted: true,
    postFired: true,
    platform: PLATFORM,
    cliVersion: VERSION,
    canaryResult: CANARY_DENY,
    permissionMode: PERMISSION_MODE,
    matcher: MATCHER,
    area: AREA,
    evidence: EVIDENCE,
    reporter: REPORTER,
    outputText:
      "bled; #91574; PreToolUse deny returned or never invoked; Write still completes; PostToolUse fires; canary DENY; --debug hooks Post registers Pre never appears; technoashu; 2.1.245; macOS Darwin 25.3.0; area:hooks",
  };
}

export function seedPreSkipped() {
  return {
    ...blankTicket(),
    seed: "pre-skipped",
    source: "atelier",
    preInvoked: false,
    writeCompleted: true,
    postFired: true,
    bled: true,
    persistMask: false,
    outputText:
      "pre-skipped; PreToolUse never invoked; Write completed; --debug hooks shows no Pre registration",
  };
}

export function seedDenyIgnored() {
  return {
    ...blankTicket(),
    seed: "deny-ignored",
    source: "atelier",
    preInvoked: true,
    permissionDecision: "deny",
    writeCompleted: true,
    postFired: true,
    canaryResult: CANARY_DENY,
    bled: true,
    persistMask: false,
    outputText:
      "deny-ignored; PreToolUse invoked and returned permissionDecision deny; Write still completed",
  };
}

export function seedPostFired() {
  return {
    ...blankTicket(),
    seed: "post-fired",
    source: "atelier",
    postFired: true,
    writeCompleted: true,
    preInvoked: false,
    bled: true,
    persistMask: false,
    outputText:
      "post-fired; PostToolUse on the identical Write|Edit|MultiEdit|NotebookEdit matcher fires after the write lands",
  };
}

export function seedCanaryDeny() {
  return {
    ...blankTicket(),
    seed: "canary-deny",
    source: "atelier",
    canaryResult: CANARY_DENY,
    permissionDecision: "deny",
    writeCompleted: true,
    postFired: true,
    bled: true,
    persistMask: false,
    outputText:
      "canary-deny; canary captured result=DENY:... — the hook computed deny — and the write still completed",
  };
}

export function seedMacosOnly() {
  return {
    ...blankTicket(),
    seed: "macos-only",
    source: "atelier",
    platform: PLATFORM,
    cliVersion: VERSION,
    preInvoked: false,
    permissionDecision: "deny",
    writeCompleted: true,
    postFired: true,
    bled: true,
    persistMask: false,
    outputText:
      "macos-only; CLI 2.1.245 on macOS Darwin 25.3.0; Linux/WSL 2.1.258 commenter could not reproduce; if still on 2.1.258 then macOS-specific",
  };
}

export function seedLinuxHold() {
  return {
    ...blankTicket(),
    seed: "linux-hold",
    source: "atelier",
    persistMask: true,
    masked: true,
    bled: false,
    preInvoked: true,
    permissionDecision: "deny",
    writeCompleted: false,
    postFired: false,
    platform: COMMENTER_PLATFORM,
    cliVersion: COMMENTER_VERSION,
    canaryResult: CANARY_DENY,
    permissionMode: PERMISSION_MODE,
    matcher: MATCHER,
    commenter: COMMENTER,
    outputText:
      "linux-hold; yurukusa Linux/WSL 2.1.258; Pre fired; deny held; repro.txt not created; Post did not fire; bypassPermissions still held",
  };
}

export function seedBypassMode() {
  return {
    ...blankTicket(),
    seed: "bypass-mode",
    source: "atelier",
    permissionMode: PERMISSION_MODE,
    preInvoked: false,
    permissionDecision: "deny",
    writeCompleted: true,
    postFired: true,
    bled: true,
    persistMask: false,
    outputText:
      "bypass-mode; reproduced under --permission-mode bypassPermissions and under normal permission mode with --allowedTools",
  };
}

export function seedHold() {
  return {
    ...seedMasked(),
    seed: "hold",
    outputText:
      "hold; PreToolUse deny seats before Write; file not created; PostToolUse does not fire; the mask seats; idle word masked",
  };
}

export function seedCousin() {
  return {
    ...seedMasked(),
    seed: IDLE_WORD,
    issue: COUSIN_ISSUE,
    isolation: "cousin",
    cousin: String(COUSIN_ISSUE),
    outputText:
      "cousin-not-primary; #89251 permission-mode system prompt routes writes via Bash around PreToolUse on Write|Edit|NotebookEdit — cite only, not the #91574 Pre-never-seats / Post-fires pattern",
  };
}

export function emptyTicket() {
  return seedMasked();
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
    persistMask: firstBool(nested.persistMask, src.persistMask),
    masked: firstBool(nested.masked, src.masked),
    bled: firstBool(nested.bled, src.bled),
    preInvoked: firstBool(nested.preInvoked, src.preInvoked),
    permissionDecision: firstText(
      nested.permissionDecision,
      src.permissionDecision,
    ),
    writeCompleted: firstBool(nested.writeCompleted, src.writeCompleted),
    postFired: firstBool(nested.postFired, src.postFired),
    platform: firstText(nested.platform, src.platform),
    cliVersion: firstText(nested.cliVersion, src.cliVersion),
    canaryResult: firstText(nested.canaryResult, src.canaryResult),
    permissionMode: firstText(nested.permissionMode, src.permissionMode),
    matcher: firstText(nested.matcher, src.matcher),
    area: firstText(nested.area, src.area),
    evidence: firstText(nested.evidence, src.evidence),
    reporter: firstText(nested.reporter, src.reporter),
    commenter: firstText(nested.commenter, src.commenter),
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
    row.persistMask == null &&
    row.masked == null &&
    row.bled == null &&
    row.preInvoked == null &&
    !row.permissionDecision &&
    row.writeCompleted == null &&
    row.postFired == null &&
    !row.canaryResult
  );
}

const SEED_FNS = {
  [IDLE_WORD]: seedMasked,
  [SEEDED_WORD]: seedBled,
  "pre-skipped": seedPreSkipped,
  "deny-ignored": seedDenyIgnored,
  "post-fired": seedPostFired,
  "canary-deny": seedCanaryDeny,
  "macos-only": seedMacosOnly,
  "linux-hold": seedLinuxHold,
  "bypass-mode": seedBypassMode,
  hold: seedHold,
  cousin: seedCousin,
  89251: seedCousin,
  82642: seedCousin,
  88896: seedCousin,
  77735: seedCousin,
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
    ticket.commenter,
    ticket.platform,
    ticket.cliVersion,
    ticket.canaryResult,
    ticket.permissionDecision,
    ticket.permissionMode,
    ticket.matcher,
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

function isLinuxPlatform(row) {
  return /linux|wsl/i.test(row.platform || "");
}

function isMacosPlatform(row) {
  return /macos|darwin/i.test(row.platform || "");
}

function canaryCapturedDeny(row) {
  return /DENY/i.test(row.canaryResult || "");
}

function holdPattern(row) {
  return (
    row.preInvoked === true &&
    row.permissionDecision === "deny" &&
    row.writeCompleted === false &&
    row.postFired === false
  );
}

function linuxHoldPattern(row) {
  return (
    row.preInvoked === true &&
    row.permissionDecision === "deny" &&
    row.writeCompleted === false &&
    (isLinuxPlatform(row) || canonicalSeed(row.seed) === "linux-hold")
  );
}

function bledPattern(row) {
  return (
    row.writeCompleted === true &&
    (row.permissionDecision === "deny" || row.preInvoked === false) &&
    row.postFired === true
  );
}

function plateBled(row) {
  if (row.bled === true) return true;
  if (bledPattern(row)) return true;
  if (row.preInvoked === false && row.writeCompleted === true) return true;
  if (
    row.preInvoked === true &&
    row.permissionDecision === "deny" &&
    row.writeCompleted === true
  ) {
    return true;
  }
  if (canaryCapturedDeny(row) && row.writeCompleted === true) return true;
  if (row.postFired === true && row.writeCompleted === true) return true;
  return false;
}

export function isMasked(ticket) {
  const row = cloneTicket(ticket);
  if (row.isolation === "cousin") return true;
  if (canonicalSeed(row.seed) === IDLE_WORD) return true;
  if (canonicalSeed(row.seed) === "hold") return true;
  if (canonicalSeed(row.seed) === "linux-hold") return true;
  if (
    row.persistMask === true &&
    row.bled !== true &&
    holdPattern(row)
  ) {
    return true;
  }
  if (holdPattern(row) && row.bled !== true) return true;
  if (linuxHoldPattern(row) && row.bled !== true) return true;
  return false;
}

export function isBled(ticket) {
  const row = cloneTicket(ticket);
  const named = canonicalSeed(row.seed);
  if (HOLD_VERDICTS.includes(named)) return false;
  if (COUSINS.includes(row.issue) && named !== SEEDED_WORD) return false;
  if (named === SEEDED_WORD) return true;
  if (row.issue === FEATURED_ISSUE && named !== IDLE_WORD && named !== "hold") {
    return true;
  }
  if (plateBled(row)) return true;
  return false;
}

export function flagsOf(ticket) {
  const row = cloneTicket(ticket);
  const text = textOf(row);
  const named = canonicalSeed(row.seed);
  const cousinOnly =
    (COUSINS.includes(row.issue) ||
      /cousin-not-primary|#89251|#82642|#88896|#77735/i.test(text)) &&
    named !== SEEDED_WORD &&
    row.issue !== FEATURED_ISSUE;
  const bledNow = !cousinOnly && isBled(row);
  const maskedNow = !bledNow && isMasked(row);
  const preSkipped =
    row.preInvoked === false ||
    named === "pre-skipped" ||
    /pre-skipped|never invoked|never appear|no Pre registration/i.test(text);
  const denyIgnored =
    (row.preInvoked === true &&
      row.permissionDecision === "deny" &&
      row.writeCompleted === true) ||
    named === "deny-ignored" ||
    /deny-ignored|deny still completed|deny and the write/i.test(text);
  const postFired =
    row.postFired === true ||
    named === "post-fired" ||
    /post-fired|PostToolUse.*fires|Post registers/i.test(text);
  const canaryDeny =
    canaryCapturedDeny(row) ||
    named === "canary-deny" ||
    /canary-deny|canary captured|result=DENY/i.test(text);
  const macosOnly =
    named === "macos-only" ||
    (isMacosPlatform(row) && bledNow) ||
    /macos-only|macOS-specific|Darwin 25\.3\.0/i.test(text);
  const linuxHold =
    named === "linux-hold" ||
    linuxHoldPattern(row) ||
    /linux-hold|yurukusa|WSL 2\.1\.258|could NOT reproduce/i.test(text);
  const bypassMode =
    named === "bypass-mode" ||
    /bypassPermissions|bypass-mode/i.test(row.permissionMode || "") ||
    /bypass-mode|bypassPermissions/i.test(text);
  const bled =
    named !== IDLE_WORD &&
    named !== "hold" &&
    named !== "linux-hold" &&
    !cousinOnly &&
    (bledNow || named === SEEDED_WORD || /bled|#91574/i.test(text));
  const masked =
    HOLD_VERDICTS.includes(named) ||
    (maskedNow && !bled);
  return {
    named,
    cousinOnly,
    bledNow,
    maskedNow,
    preSkipped,
    denyIgnored,
    postFired,
    canaryDeny,
    macosOnly,
    linuxHold,
    bypassMode,
    bled,
    masked,
  };
}

export function chipsOf(ticket) {
  const flags = flagsOf(ticket);
  const chips = [];
  if (flags.masked && !flags.bled) chips.push("masked");
  if (flags.bled) chips.push("bled");
  if (flags.preSkipped && flags.bled) chips.push("pre-skipped");
  if (flags.denyIgnored && flags.bled) chips.push("deny-ignored");
  if (flags.postFired && flags.bled) chips.push("post-fired");
  if (flags.canaryDeny && flags.bled) chips.push("canary-deny");
  if (flags.macosOnly && flags.bled) chips.push("macos-only");
  if (flags.linuxHold && !flags.bled) chips.push("linux-hold");
  if (flags.bypassMode && flags.bled) chips.push("bypass-mode");
  if ((flags.masked || flags.named === "hold" || flags.named === "linux-hold") && !flags.bled) {
    chips.push("hold");
  }
  if (ticket.seed && VERDICTS.includes(ticket.seed)) chips.push(ticket.seed);
  return [...new Set(chips)];
}

function reasonsOf(ticket, flags, verdict) {
  const reasons = [];
  if (verdict === "masked") {
    reasons.push(
      "masked; PreToolUse deny seats before Write; file not created; PostToolUse does not fire",
    );
    reasons.push("hold: the frisket seated; idle word masked");
  }
  if (verdict === "hold") {
    reasons.push(
      "hold; PreToolUse deny seats before Write; file not created; PostToolUse does not fire; the mask seats",
    );
  }
  if (verdict === "linux-hold" || (flags.linuxHold && !flags.bled)) {
    reasons.push(
      "linux-hold; yurukusa Linux/WSL 2.1.258; Pre fired; deny held; repro.txt not created; Post did not fire",
    );
  }
  if (verdict === "bled" || flags.bled) {
    reasons.push(
      "bled; #91574; PreToolUse deny returned or never invoked; Write still completes; PostToolUse fires",
    );
  }
  if (verdict === "pre-skipped" || (flags.preSkipped && flags.bled)) {
    reasons.push(
      "pre-skipped; PreToolUse never invoked; Write completed; --debug hooks shows no Pre registration",
    );
  }
  if (verdict === "deny-ignored" || (flags.denyIgnored && flags.bled)) {
    reasons.push(
      "deny-ignored; PreToolUse invoked and returned permissionDecision deny; Write still completed",
    );
  }
  if (verdict === "post-fired" || (flags.postFired && flags.bled)) {
    reasons.push(
      "post-fired; PostToolUse on the identical matcher fires after the write lands",
    );
  }
  if (verdict === "canary-deny" || (flags.canaryDeny && flags.bled)) {
    reasons.push(
      "canary-deny; canary captured result=DENY:... — the hook computed deny — and the write still completed",
    );
  }
  if (verdict === "macos-only" || (flags.macosOnly && flags.bled)) {
    reasons.push(
      "macos-only; CLI 2.1.245 on macOS Darwin 25.3.0; Linux/WSL 2.1.258 commenter could not reproduce",
    );
  }
  if (verdict === "bypass-mode" || (flags.bypassMode && flags.bled)) {
    reasons.push(
      "bypass-mode; reproduced under --permission-mode bypassPermissions and under normal permission mode with --allowedTools",
    );
  }
  if (flags.cousinOnly) {
    reasons.push(
      "cousin is not Frisket; cite-only #89251 (permission-mode Bash routing around Write|Edit|NotebookEdit), #82642 (decisionReason discarded at transcript-write), #88896 (PreToolUse never fires on Windows 2.1.240), #77735 (PreToolUse skipped for schema-invalid .claude/settings.json edits) — different surfaces from #91574 Pre-never-seats / Post-fires; primary stays #91574",
    );
  }
  if (verdict === "bled" || flags.bled) {
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
  if (named === IDLE_WORD && (flags.masked || !flags.bled)) return "masked";
  if (named === "hold" && !flags.bled) return "hold";
  if (named === "linux-hold" && !flags.bled) return "linux-hold";
  if (named === SEEDED_WORD) return "bled";
  if (VERDICTS.includes(named) && !HOLD_VERDICTS.includes(named)) {
    return named;
  }
  if (flags.cousinOnly) return "masked";
  if (flags.linuxHold && !flags.bled) return "linux-hold";
  if (flags.bled) return "bled";
  if (flags.masked) return "masked";
  return "masked";
}

function deskOf(flags, ticket, verdict) {
  if (verdict === "bled" || flags.bled) {
    return {
      case: "bled — Pre deny returned or never invoked; Write landed; Post fired",
      pre: ticket.preInvoked === true ? "invoked" : "skipped",
      decision: ticket.permissionDecision || "deny",
      write: "landed",
      post: ticket.postFired === true ? "fired" : "silent",
      canary: ticket.canaryResult || CANARY_DENY,
      mark: "frisket bled; admit the plate already bled",
      note: PHRASE,
    };
  }
  if (verdict === "linux-hold") {
    return {
      case: "linux-hold — commenter deny seated on Linux/WSL 2.1.258",
      pre: "invoked",
      decision: "deny",
      write: "held",
      post: "silent",
      canary: CANARY_DENY,
      mark: "frisket linux-hold; the mask seats on Linux",
      note: "Hold: the mask seats.",
    };
  }
  if (verdict === "hold") {
    return {
      case: "hold — PreToolUse deny seats before Write",
      pre: "invoked",
      decision: "deny",
      write: "held",
      post: "silent",
      canary: CANARY_DENY,
      mark: "frisket hold; the mask seats",
      note: "Hold: the mask seats.",
    };
  }
  return {
    case: "masked — PreToolUse deny seats before Write; file not created; Post silent",
    pre: "invoked",
    decision: "deny",
    write: "held",
    post: "silent",
    canary: CANARY_DENY,
    mark: "frisket masked; idle word masked",
    note: "Masked: the mask seats.",
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
    masked: verdict === "masked" || (flags.masked && !bled),
    bled,
    hold,
    alarm: !hold,
    idleWord: IDLE_WORD,
    seededWord: SEEDED_WORD,
    flags,
    contrast: deskOf(flags, ticket, verdict),
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
  if (name === SEEDED_WORD || name === 91574 || name === "91574") {
    return analyze(seedBled());
  }
  if (name === "pre-skipped") return analyze(seedPreSkipped());
  if (name === "deny-ignored") return analyze(seedDenyIgnored());
  if (name === "post-fired") return analyze(seedPostFired());
  if (name === "canary-deny") return analyze(seedCanaryDeny());
  if (name === "macos-only") return analyze(seedMacosOnly());
  if (name === "linux-hold") return analyze(seedLinuxHold());
  if (name === "bypass-mode") return analyze(seedBypassMode());
  if (name === "hold") return analyze(seedHold());
  if (name === IDLE_WORD || name === "masked" || name === "open") {
    return analyze(seedMasked());
  }
  if (
    name === 89251 ||
    name === "89251" ||
    name === 82642 ||
    name === "82642" ||
    name === 88896 ||
    name === "88896" ||
    name === 77735 ||
    name === "77735" ||
    name === "cousin"
  ) {
    return analyze(seedCousin());
  }
  if (SEED_FNS[name]) return analyze(SEED_FNS[name]());
  return analyze(seedMasked());
}

export function handle(input) {
  const result = analyze(input);
  return {
    ...result,
    hookSpecificOutput: {
      additionalContext:
        result.verdict === "bled" || (result.bled && result.alarm)
          ? `bled frisket #${FEATURED_ISSUE}: PreToolUse deny returned or never invoked; Write completed; PostToolUse fired. ${HYPOTHESIS_NOTE}`
          : result.verdict === "hold"
            ? "hold. PreToolUse deny seats before Write. Score the mask."
            : result.verdict === "linux-hold"
              ? "linux-hold. Commenter deny seated on Linux/WSL 2.1.258. Score the mask."
              : `masked frisket. Idle word ${IDLE_WORD}. PreToolUse deny seats before Write; file not created; PostToolUse does not fire.`,
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
