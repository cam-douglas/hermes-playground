#!/usr/bin/env node
/**
 * Tocsin — watchhouse fire-bell atelier classifier.
 * A tocsin that only rings into ears already on duty is not a
 * fire-bell; it is an unheard queue. Score the wake or admit the
 * subagent already slept through the all-clear.
 *
 *   echo '{"noIdleWake":true,"notificationQueued":true}' | node tocsin.mjs
 *   node tocsin.mjs ticket.json
 *
 * Idle word is armed (HOLD: background-task completion wakes an
 * idle subagent the same way it wakes the main session).
 * Seeded state is unheard / #91503 (completion notification queued;
 * no idle-wake consumer for subagent; hangs until human nudge;
 * main wakes in ms).
 * NEVER idle as unbolted / snagged / reeved / fouled / creased /
 * bled / latched / vanished / sealed / rebound / dark / spurious /
 * fenced / swept / tolled / mute / honored / discarded / arrested /
 * skipped / indexed / jumped / chocked / rolled / clasped / sprung /
 * drained / hinged / pealed / warded / pooled / cased / aired /
 * sifted / stocked / stationed / marvered / unpinned / rinsed /
 * literal / choked / opened / stalled / fused / forged / attributed.
 *
 * Primary #91503: Windows: a subagent's background-task completion
 * notification is queued but has no idle-wake consumer — the
 * subagent hangs until something else gives it a turn (refs
 * #78338, #21048, #29163). Measured on Claude Code 2.1.258 /
 * Windows 11 across three instrumented runs (`queue-operation`
 * records). Reporter ManufactoryOfCode. Filed 2026-09-02T13:15:54Z.
 * OPEN. Labels: bug, has repro, platform:windows, area:agents.
 *
 * Facts from the issue only:
 * - Subagent starts shell with Bash(run_in_background: true), then
 *   ends its turn
 * - Script completion notification is created and queued on exit
 *   (not lost)
 * - Nothing delivers that notification to an idle subagent (no
 *   idle-wake consumer)
 * - Subagent stays idle indefinitely; parent waiting on its report
 *   hangs
 * - Delivery happens the moment the subagent is already in a turn
 *   (human nudge in practice)
 * - Main session: identical background-task completions dequeue
 *   within milliseconds and start a new turn
 * - Evidence: queue-operation records across three instrumented
 *   runs in one session
 * - Platform: Windows (labels platform:windows); area:agents
 *
 * Hypothesis only (NON-BINDING): the queue entry for a
 * subagent-owned background task has no idle-wake consumer;
 * absorbed_mid_turn is the only path it ever takes; the
 * dequeue-and-start-a-turn path that serves the main session never
 * fires for it. Encoded from the issue's measured claim. Verify
 * against the issue text and discard if wrong.
 *
 * This is a diagnostic scoring bench. NOT an exploit. No payloads.
 * Score whether the wake is armed or unheard.
 *
 * NOT Bolter #91422 (dontAsk cp/mv option-token matcher).
 * NOT Deadeye #91226 (relative PreToolUse Bash hook × drifted cwd
 * deadlock).
 * NOT Reglet #91443 / Reliquary #91433 / Annunciator #91419 /
 * Caisson #91405 / Spindle #91402 / Knell #91298.
 * NOT Tumbler / Escapement / Geneva / Scotch / Carillon / Pintle /
 * Fibula / Virgule / Riddle / Garner / Postern / Sluice / Reveille /
 * callboard / standing-rigging deadeye / flour-mill bolter
 * metaphors.
 * NOT Toggle — this hour ships Tocsin.
 * Product name stays Tocsin. Do not rename to Bolter / Deadeye /
 * Reglet / Reliquary / Annunciator / Caisson / Spindle / Knell /
 * Tumbler / Escapement / Geneva / Scotch / Fibula / Virgule /
 * Riddle / Garner / Pintle / Carillon / Postern / Sluice / Alidade /
 * Cockade / Lye / Clew / Hasp / Berth / Bollard / Reveille /
 * Callboard / Quench / Scrim / Knock.
 */

import { readFileSync } from "node:fs";
import { stdin } from "node:process";
import { pathToFileURL } from "node:url";

export const VERDICTS = Object.freeze([
  "armed",
  "unheard",
  "subagent",
  "main-wakes",
  "queued-not-lost",
  "no-idle-wake",
  "human-nudge",
  "run-in-background",
  "queue-operation",
  "hang-until-turn",
  "has-clear-repro",
  "hold",
]);
export const IDLE_WORD = "armed";
export const SEEDED_WORD = "unheard";
export const HOLD_VERDICTS = Object.freeze(["armed", "hold"]);
export const ALARM_VERDICTS = Object.freeze(
  VERDICTS.filter((name) => !HOLD_VERDICTS.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FEATURED_ISSUE = 91503;
export const PRIMARY_ISSUES = Object.freeze([91503]);
export const COUSINS = Object.freeze([78338, 21048, 29163]);
export const COUSIN_ISSUE = 78338;
export const RELATED_IN_ISSUE = Object.freeze([
  75043, 29271, 24108, 47930, 85047,
]);
export const NOT_THAT_ISSUE = 50572;
export const BACKUPS = Object.freeze([
  { name: "Blackhole", issue: 91502 },
  { name: "Skipjack", issue: 91480 },
  { name: "Clepsydra", issue: 91414 },
  { name: "Platen", issue: 91438 },
]);
export const NOT_PRODUCTS = Object.freeze([
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
  "flour-mill",
]);
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/91503";
export const TITLE =
  "Windows: a subagent's background-task completion notification is queued but has no idle-wake consumer — the subagent hangs until something else gives it a turn (refs #78338, #21048, #29163)";
export const FILED_AT = "2026-09-02T13:15:54Z";
export const UPDATED_AT = "2026-09-02T13:17:10Z";
export const LABELS = Object.freeze([
  "bug",
  "has repro",
  "platform:windows",
  "area:agents",
]);
export const REPORTER = "ManufactoryOfCode";
export const VERSION = "2.1.258";
export const PLATFORM = "Windows 11";
export const RUN_LABEL = "three instrumented runs";
export const EVIDENCE = "queue-operation";
export const BASH_SHAPE = "Bash(run_in_background: true)";
export const HUB_LINE =
  "23:50 tocsin: a tocsin that only rings into ears already on duty is not a fire-bell; it is an unheard queue. Score the wake or admit the subagent already slept through the all-clear.";
export const MARK = "23:50 / hermes catalog #123 / #91503";
export const PHRASE =
  "a tocsin that only rings into ears already on duty is not a fire-bell; it is an unheard queue. Score the wake or admit the subagent already slept through the all-clear.";
export const HYPOTHESIS_NOTE =
  "NON-BINDING: the queue entry for a subagent-owned background task has no idle-wake consumer; absorbed_mid_turn is the only path it ever takes; the dequeue-and-start-a-turn path that serves the main session never fires for it. Encoded from the issue's measured claim. Verify against the issue text and discard if wrong.";
export const CONTRAST_NOTE =
  "This is SUBAGENT BASH(RUN_IN_BACKGROUND:TRUE) COMPLETION NOTIFICATION QUEUED WITH NO IDLE-WAKE CONSUMER; MAIN SESSION WAKES IN MS; HANGS UNTIL HUMAN NUDGE; AREA:AGENTS+WINDOWS. Subagent starts Bash(run_in_background: true), then ends its turn. Script completion notification is created and queued on exit (not lost). Nothing delivers that notification to an idle subagent (no idle-wake consumer). Subagent stays idle indefinitely; parent waiting on its report hangs. Delivery happens the moment the subagent is already in a turn (human nudge in practice). Main session: identical background-task completions dequeue within milliseconds and start a new turn. Evidence: queue-operation records across three instrumented runs in one session. Reporter ManufactoryOfCode. Claude Code 2.1.258 / Windows 11. Filed 2026-09-02. OPEN, has repro, platform:windows, area:agents.";
export const FORBIDDEN_IDLE = Object.freeze([
  "unbolted",
  "snagged",
  "reeved",
  "fouled",
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
]);
export const BANNED_NAMES = Object.freeze([
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
  "flour-mill bolting-cloth",
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
    wakeFair: null,
    subagentWakesOnIdle: null,
    mainWakes: null,
    notificationQueued: null,
    idleWakeConsumer: null,
    subagent: null,
    mainSessionWakes: null,
    queuedNotLost: null,
    noIdleWake: null,
    humanNudge: null,
    runInBackground: null,
    queueOperation: null,
    hangUntilTurn: null,
    hasClearRepro: null,
    bashShape: "",
    platform: "",
    area: "",
    evidence: "",
    cliVersion: "",
    reporter: "",
    observed: "",
    runLabel: "",
    outputText: "",
  };
}

export function seedArmed() {
  return {
    ...blankTicket(),
    seed: IDLE_WORD,
    issue: null,
    source: "atelier",
    wakeFair: true,
    subagentWakesOnIdle: true,
    mainWakes: true,
    notificationQueued: true,
    idleWakeConsumer: true,
    subagent: true,
    mainSessionWakes: true,
    queuedNotLost: true,
    noIdleWake: false,
    humanNudge: false,
    runInBackground: true,
    queueOperation: true,
    hangUntilTurn: false,
    hasClearRepro: false,
    bashShape: BASH_SHAPE,
    platform: PLATFORM,
    area: "area:agents",
    evidence: EVIDENCE,
    cliVersion: VERSION,
    reporter: "",
    observed: "",
    runLabel: RUN_LABEL,
    outputText:
      "armed; background-task completion wakes an idle subagent the same way it wakes the main session; idle word armed",
  };
}

export function seedUnheard() {
  return {
    ...blankTicket(),
    seed: SEEDED_WORD,
    issue: FEATURED_ISSUE,
    title: TITLE,
    url: ISSUE_URL,
    source: "atelier",
    wakeFair: false,
    subagentWakesOnIdle: false,
    mainWakes: true,
    notificationQueued: true,
    idleWakeConsumer: false,
    subagent: true,
    mainSessionWakes: true,
    queuedNotLost: true,
    noIdleWake: true,
    humanNudge: true,
    runInBackground: true,
    queueOperation: true,
    hangUntilTurn: true,
    hasClearRepro: true,
    bashShape: BASH_SHAPE,
    platform: PLATFORM,
    area: "area:agents",
    evidence: EVIDENCE,
    cliVersion: VERSION,
    reporter: REPORTER,
    observed: "2026-09-02",
    runLabel: RUN_LABEL,
    outputText:
      "unheard; #91503; Bash(run_in_background: true); completion notification queued; no idle-wake consumer; subagent hangs until human nudge; main session wakes in ms; queue-operation; three instrumented runs; ManufactoryOfCode; Claude Code 2.1.258; Windows 11; area:agents platform:windows",
  };
}

export function seedSubagent() {
  return {
    ...blankTicket(),
    seed: "subagent",
    source: "atelier",
    subagent: true,
    outputText:
      "subagent; starts Bash(run_in_background: true) then ends its turn",
  };
}

export function seedMainWakes() {
  return {
    ...blankTicket(),
    seed: "main-wakes",
    source: "atelier",
    mainWakes: true,
    mainSessionWakes: true,
    outputText:
      "main-wakes; identical background-task completions dequeue within milliseconds and start a new turn",
  };
}

export function seedQueuedNotLost() {
  return {
    ...blankTicket(),
    seed: "queued-not-lost",
    source: "atelier",
    queuedNotLost: true,
    notificationQueued: true,
    outputText:
      "queued-not-lost; script completion notification is created and queued on exit (not lost)",
  };
}

export function seedNoIdleWake() {
  return {
    ...blankTicket(),
    seed: "no-idle-wake",
    source: "atelier",
    noIdleWake: true,
    idleWakeConsumer: false,
    outputText:
      "no-idle-wake; nothing delivers that notification to an idle subagent (no idle-wake consumer)",
  };
}

export function seedHumanNudge() {
  return {
    ...blankTicket(),
    seed: "human-nudge",
    source: "atelier",
    humanNudge: true,
    outputText:
      "human-nudge; delivery happens the moment the subagent is already in a turn (human nudge in practice)",
  };
}

export function seedRunInBackground() {
  return {
    ...blankTicket(),
    seed: "run-in-background",
    source: "atelier",
    runInBackground: true,
    bashShape: BASH_SHAPE,
    outputText:
      "run-in-background; Bash(run_in_background: true)",
  };
}

export function seedQueueOperation() {
  return {
    ...blankTicket(),
    seed: "queue-operation",
    source: "atelier",
    queueOperation: true,
    evidence: EVIDENCE,
    outputText:
      "queue-operation; queue-operation records across three instrumented runs in one session",
  };
}

export function seedHangUntilTurn() {
  return {
    ...blankTicket(),
    seed: "hang-until-turn",
    source: "atelier",
    hangUntilTurn: true,
    outputText:
      "hang-until-turn; subagent stays idle indefinitely; parent waiting on its report hangs",
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
    platform: PLATFORM,
    outputText:
      "has-clear-repro; ManufactoryOfCode filed #91503; has repro; area:agents; platform:windows; Claude Code 2.1.258; Windows 11; three instrumented runs",
  };
}

export function seedHold() {
  return {
    ...seedArmed(),
    seed: "hold",
    outputText:
      "hold; background-task completion wakes an idle subagent the same way it wakes the main session; the tocsin holds",
  };
}

export function seedCousin() {
  return {
    ...seedArmed(),
    seed: IDLE_WORD,
    issue: COUSIN_ISSUE,
    isolation: "cousin",
    cousin: String(COUSIN_ISSUE),
    outputText:
      "cousin-not-primary; #78338 passively queued command with no idle-wake consumer — cite only, not the #91503 subagent Bash(run_in_background: true) idle-wake miss",
  };
}

export function emptyTicket() {
  return seedArmed();
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
    wakeFair: firstBool(nested.wakeFair, src.wakeFair),
    subagentWakesOnIdle: firstBool(
      nested.subagentWakesOnIdle,
      src.subagentWakesOnIdle,
    ),
    mainWakes: firstBool(nested.mainWakes, src.mainWakes),
    notificationQueued: firstBool(
      nested.notificationQueued,
      src.notificationQueued,
    ),
    idleWakeConsumer: firstBool(nested.idleWakeConsumer, src.idleWakeConsumer),
    subagent: firstBool(nested.subagent, src.subagent),
    mainSessionWakes: firstBool(nested.mainSessionWakes, src.mainSessionWakes),
    queuedNotLost: firstBool(nested.queuedNotLost, src.queuedNotLost),
    noIdleWake: firstBool(nested.noIdleWake, src.noIdleWake),
    humanNudge: firstBool(nested.humanNudge, src.humanNudge),
    runInBackground: firstBool(nested.runInBackground, src.runInBackground),
    queueOperation: firstBool(nested.queueOperation, src.queueOperation),
    hangUntilTurn: firstBool(nested.hangUntilTurn, src.hangUntilTurn),
    hasClearRepro: firstBool(nested.hasClearRepro, src.hasClearRepro),
    bashShape: firstText(nested.bashShape, src.bashShape),
    platform: firstText(nested.platform, src.platform),
    area: firstText(nested.area, src.area),
    evidence: firstText(nested.evidence, src.evidence),
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
    row.wakeFair == null &&
    row.subagentWakesOnIdle == null &&
    row.mainWakes == null &&
    row.notificationQueued == null &&
    row.idleWakeConsumer == null &&
    row.subagent == null &&
    row.mainSessionWakes == null &&
    row.queuedNotLost == null &&
    row.noIdleWake == null &&
    row.humanNudge == null &&
    row.runInBackground == null &&
    row.queueOperation == null &&
    row.hangUntilTurn == null
  );
}

const SEED_FNS = {
  [IDLE_WORD]: seedArmed,
  [SEEDED_WORD]: seedUnheard,
  subagent: seedSubagent,
  "main-wakes": seedMainWakes,
  "main-session": seedMainWakes,
  "queued-not-lost": seedQueuedNotLost,
  "notification-queued": seedQueuedNotLost,
  "no-idle-wake": seedNoIdleWake,
  "idle-wake-missing": seedNoIdleWake,
  "human-nudge": seedHumanNudge,
  "run-in-background": seedRunInBackground,
  "queue-operation": seedQueueOperation,
  "hang-until-turn": seedHangUntilTurn,
  "has-clear-repro": seedHasClearRepro,
  hold: seedHold,
  cousin: seedCousin,
  78338: seedCousin,
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
    return { ...seedUnheard(), ...cloned, ...raw };
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
    ticket.bashShape,
    ticket.platform,
    ticket.area,
    ticket.evidence,
    ticket.runLabel,
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

export function isArmed(ticket) {
  const row = cloneTicket(ticket);
  if (row.isolation === "cousin") return true;
  if (canonicalSeed(row.seed) === IDLE_WORD) return true;
  if (canonicalSeed(row.seed) === "hold") return true;
  if (
    row.wakeFair === true &&
    row.subagentWakesOnIdle === true &&
    row.idleWakeConsumer === true &&
    row.noIdleWake !== true
  ) {
    return true;
  }
  return false;
}

export function isUnheard(ticket) {
  const row = cloneTicket(ticket);
  const named = canonicalSeed(row.seed);
  if (named === IDLE_WORD || named === "hold") return false;
  if (COUSINS.includes(row.issue) && named !== SEEDED_WORD) return false;
  if (named === SEEDED_WORD) return true;
  if (row.issue === FEATURED_ISSUE && named !== IDLE_WORD) return true;
  if (
    (row.noIdleWake === true && row.notificationQueued === true) ||
    (row.hangUntilTurn === true && row.humanNudge === true) ||
    (row.queuedNotLost === true &&
      row.idleWakeConsumer === false &&
      row.subagent === true)
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
      /cousin-not-primary|#78338|#21048|#29163/i.test(text)) &&
    named !== SEEDED_WORD &&
    row.issue !== FEATURED_ISSUE;
  const unheardNow = !cousinOnly && isUnheard(row);
  const armedNow = !unheardNow && isArmed(row);
  const subagent =
    row.subagent === true ||
    named === "subagent" ||
    /subagent|ends its turn/i.test(text);
  const mainWakes =
    row.mainWakes === true ||
    row.mainSessionWakes === true ||
    named === "main-wakes" ||
    /main-wakes|main session wakes|dequeue within milliseconds/i.test(text);
  const queuedNotLost =
    row.queuedNotLost === true ||
    row.notificationQueued === true ||
    named === "queued-not-lost" ||
    /queued-not-lost|notification queued|not lost/i.test(text);
  const noIdleWake =
    row.noIdleWake === true ||
    row.idleWakeConsumer === false ||
    named === "no-idle-wake" ||
    /no-idle-wake|no idle-wake consumer|idle-wake missing/i.test(text);
  const humanNudge =
    row.humanNudge === true ||
    named === "human-nudge" ||
    /human-nudge|human nudge|already in a turn/i.test(text);
  const runInBackground =
    row.runInBackground === true ||
    named === "run-in-background" ||
    /run-in-background|run_in_background|Bash\(run_in_background: true\)/i.test(
      text,
    );
  const queueOperation =
    row.queueOperation === true ||
    named === "queue-operation" ||
    /queue-operation|queue.operation/i.test(text);
  const hangUntilTurn =
    row.hangUntilTurn === true ||
    named === "hang-until-turn" ||
    /hang-until-turn|stays idle indefinitely|parent waiting/i.test(text);
  const hasClearRepro =
    row.hasClearRepro === true ||
    named === "has-clear-repro" ||
    /has-clear-repro|ManufactoryOfCode|has repro|area:agents|platform:windows/i.test(
      text,
    );
  const unheard =
    named !== IDLE_WORD &&
    named !== "hold" &&
    !cousinOnly &&
    (unheardNow || named === SEEDED_WORD || /unheard|#91503/i.test(text));
  const armed =
    named === IDLE_WORD || named === "hold" || (armedNow && !unheard);
  return {
    named,
    cousinOnly,
    unheardNow,
    armedNow,
    subagent,
    mainWakes,
    queuedNotLost,
    noIdleWake,
    humanNudge,
    runInBackground,
    queueOperation,
    hangUntilTurn,
    hasClearRepro,
    unheard,
    armed,
  };
}

export function chipsOf(ticket) {
  const flags = flagsOf(ticket);
  const chips = [];
  if (flags.armed && !flags.unheard) chips.push("armed");
  if (flags.unheard) chips.push("unheard");
  if (flags.subagent && flags.unheard) chips.push("subagent");
  if (flags.mainWakes && flags.unheard) chips.push("main-wakes");
  if (flags.queuedNotLost && flags.unheard) chips.push("queued-not-lost");
  if (flags.noIdleWake && flags.unheard) chips.push("no-idle-wake");
  if (flags.humanNudge && flags.unheard) chips.push("human-nudge");
  if (flags.runInBackground && flags.unheard) chips.push("run-in-background");
  if (flags.queueOperation && flags.unheard) chips.push("queue-operation");
  if (flags.hangUntilTurn && flags.unheard) chips.push("hang-until-turn");
  if (flags.hasClearRepro && flags.unheard) chips.push("has-clear-repro");
  if ((flags.armed || flags.named === "hold") && !flags.unheard) {
    chips.push("hold");
  }
  if (ticket.seed && VERDICTS.includes(ticket.seed)) chips.push(ticket.seed);
  return [...new Set(chips)];
}

function reasonsOf(ticket, flags, verdict) {
  const reasons = [];
  if (verdict === "armed") {
    reasons.push(
      "armed; background-task completion wakes an idle subagent the same way it wakes the main session",
    );
    reasons.push(
      "hold: the tocsin rings into a sleeping watch; idle and on-duty ears hear the same all-clear",
    );
  }
  if (verdict === "hold") {
    reasons.push(
      "hold; background-task completion wakes an idle subagent the same way it wakes the main session; the tocsin holds",
    );
  }
  if (verdict === "unheard" || flags.unheard) {
    reasons.push(
      "unheard; #91503; completion notification queued; no idle-wake consumer for subagent; hangs until human nudge; main wakes in ms",
    );
  }
  if (flags.subagent || verdict === "subagent") {
    reasons.push(
      "subagent; starts Bash(run_in_background: true) then ends its turn",
    );
  }
  if (flags.mainWakes || verdict === "main-wakes") {
    reasons.push(
      "main-wakes; identical background-task completions dequeue within milliseconds and start a new turn",
    );
  }
  if (flags.queuedNotLost || verdict === "queued-not-lost") {
    reasons.push(
      "queued-not-lost; script completion notification is created and queued on exit (not lost)",
    );
  }
  if (flags.noIdleWake || verdict === "no-idle-wake") {
    reasons.push(
      "no-idle-wake; nothing delivers that notification to an idle subagent (no idle-wake consumer)",
    );
  }
  if (flags.humanNudge || verdict === "human-nudge") {
    reasons.push(
      "human-nudge; delivery happens the moment the subagent is already in a turn (human nudge in practice)",
    );
  }
  if (flags.runInBackground || verdict === "run-in-background") {
    reasons.push("run-in-background; Bash(run_in_background: true)");
  }
  if (flags.queueOperation || verdict === "queue-operation") {
    reasons.push(
      "queue-operation; queue-operation records across three instrumented runs in one session",
    );
  }
  if (flags.hangUntilTurn || verdict === "hang-until-turn") {
    reasons.push(
      "hang-until-turn; subagent stays idle indefinitely; parent waiting on its report hangs",
    );
  }
  if (flags.hasClearRepro || verdict === "has-clear-repro") {
    reasons.push(
      `has-clear-repro; ${REPORTER} filed #${FEATURED_ISSUE}; has repro; CLI ${VERSION}; ${PLATFORM}; ${RUN_LABEL}; area:agents; platform:windows`,
    );
  }
  if (flags.cousinOnly) {
    reasons.push(
      "cousin is not Tocsin; cite-only #78338 passively queued command with no idle-wake consumer (Linux, closed) / #21048 Windows run_in_background completion does not wake Claude from idle (main-agent variant) / #29163 team agents go idle without responding (macOS; SendMessage did not revive) — not the #91503 subagent Bash(run_in_background: true) idle-wake miss",
    );
  }
  if (verdict === "unheard" || flags.unheard) {
    reasons.push(HYPOTHESIS_NOTE);
    reasons.push(CONTRAST_NOTE);
  }
  if (verdict !== "armed" && verdict !== "hold") {
    reasons.push(PHRASE);
  }
  return reasons;
}

function pickVerdict(seed, flags) {
  const named = canonicalSeed(seed);
  if (named === IDLE_WORD && (flags.armed || !flags.unheard)) return "armed";
  if (named === "hold" && !flags.unheard) return "hold";
  if (named === SEEDED_WORD) return "unheard";
  if (VERDICTS.includes(named) && named !== IDLE_WORD && named !== "hold") {
    return named;
  }
  if (flags.cousinOnly) return "armed";
  if (flags.unheard) return "unheard";
  if (flags.armed) return "armed";
  return "armed";
}

function chamberOf(flags, ticket, verdict) {
  if (verdict === "unheard" || flags.unheard) {
    return {
      case: "unheard — queued all-clear; no idle-wake consumer",
      cloth: "subagent Bash(run_in_background: true) then end of turn",
      snag: "completion notification queued (not lost); no idle-wake consumer",
      slip: "main session dequeues within milliseconds; subagent hangs until human nudge",
      mark: "tocsin unheard; admit the subagent already slept through the all-clear",
      note: PHRASE,
    };
  }
  if (verdict === "hold") {
    return {
      case: "armed — idle subagent wakes the same way the main session wakes",
      cloth: "background-task completion has an idle-wake consumer",
      snag: "nothing sits unheard in the queue",
      slip: "main and subagent share the same dequeue-and-start-a-turn path",
      mark: "tocsin armed; the fire-bell holds",
      note: "Hold: the tocsin is armed.",
    };
  }
  return {
    case: "armed — idle subagent wakes the same way the main session wakes",
    cloth: "Bash(run_in_background: true) completion wakes idle watch",
    snag: "idle-wake consumer present",
    slip: "watchhouse quiet; atelier armed",
    mark: "tocsin armed; idle word armed",
    note: "Armed: the tocsin holds.",
  };
}

export function analyze(input) {
  const ticket = normalize(input);
  const flags = flagsOf(ticket);
  const chips = chipsOf(ticket);
  const seed = String(ticket.seed || "");
  const verdict = pickVerdict(seed, flags);
  const hold = HOLD_VERDICTS.includes(verdict);
  const unheard = verdict === "unheard" || flags.unheard;
  return {
    verdict,
    chips,
    reasons: reasonsOf(ticket, flags, verdict),
    armed: verdict === "armed" || (flags.armed && !unheard),
    unheard,
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
  if (name === SEEDED_WORD || name === 91503 || name === "91503") {
    return analyze(seedUnheard());
  }
  if (name === "subagent") return analyze(seedSubagent());
  if (name === "main-wakes" || name === "main-session") {
    return analyze(seedMainWakes());
  }
  if (name === "queued-not-lost" || name === "notification-queued") {
    return analyze(seedQueuedNotLost());
  }
  if (name === "no-idle-wake" || name === "idle-wake-missing") {
    return analyze(seedNoIdleWake());
  }
  if (name === "human-nudge") return analyze(seedHumanNudge());
  if (name === "run-in-background") return analyze(seedRunInBackground());
  if (name === "queue-operation") return analyze(seedQueueOperation());
  if (name === "hang-until-turn") return analyze(seedHangUntilTurn());
  if (name === "has-clear-repro") return analyze(seedHasClearRepro());
  if (name === "hold") return analyze(seedHold());
  if (name === IDLE_WORD || name === "armed" || name === "open") {
    return analyze(seedArmed());
  }
  if (
    name === 78338 ||
    name === "78338" ||
    name === "cousin" ||
    name === 21048 ||
    name === "21048" ||
    name === 29163 ||
    name === "29163"
  ) {
    return analyze(seedCousin());
  }
  if (SEED_FNS[name]) return analyze(SEED_FNS[name]());
  return analyze(seedArmed());
}

export function handle(input) {
  const result = analyze(input);
  return {
    ...result,
    hookSpecificOutput: {
      additionalContext:
        result.verdict === "unheard" || (result.unheard && result.alarm)
          ? `unheard tocsin #${FEATURED_ISSUE}: completion notification queued; no idle-wake consumer for subagent; hangs until human nudge; main wakes in ms. ${HYPOTHESIS_NOTE}`
          : result.verdict === "hold"
            ? "hold. Background-task completion wakes an idle subagent the same way it wakes the main session. Sound the tocsin."
            : `armed tocsin. Idle word ${IDLE_WORD}. Background-task completion wakes an idle subagent the same way it wakes the main session.`,
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
