#!/usr/bin/env node
/**
 * Oubliette — stone-pit / trapdoor dungeon-desk classifier.
 * A oubliette that drops a finished child's notice into the pit
 * under a cold parent is not a push — it is a queue already
 * forgotten. Score the trapdoor or admit the queue already drained.
 *
 *   echo '{"parentTemp":"cold","queued":true,"childCompleted":true}' | node oubliette.mjs
 *   node oubliette.mjs ticket.json
 *
 * Idle word is cold (HOLD: warm parent drains the notice on the
 * same turn; the trapdoor stays shut; idle word cold).
 * Seeded state is voided / #92095 (cold parent + queued child
 * completion; the notice sits until the next unrelated wake).
 *
 * This is a diagnostic scoring desk. NOT an exploit.
 * No payloads. No attack procedures. No real credentials.
 * Score dispatch-shaped fixtures for whether the trapdoor held
 * or already dropped the notice into the pit.
 *
 * Primary #92095: Cowork Dispatch child-completion notifications
 * queue against an idle parent and only drain on the parent's
 * next unrelated turn. Reporter AllyOmega. Filed 2026-09-04T14:08:24Z.
 * OPEN. Labels: bug, has repro, platform:windows, area:cowork.
 * Claude Desktop (Cowork / Code tab) 1.44121.4.0, MSIX. CCD 2.1.258.
 * Windows 11 (10.0.26200) x64.
 *
 * Hypothesis only (NON-BINDING): a Dispatch child completion is
 * queued against the parent orchestrator; when the parent is idle
 * there is no process alive to receive a push (every wake
 * relaunches the session), so the notice sits until the next
 * unrelated user turn. The child cannot ccd_session_mgmt__send_message
 * into unattended or remote-dispatched sessions. Discard if issue
 * evidence disagrees. Do not claim Claude Code source you have
 * not seen.
 */

import { readFileSync } from "node:fs";
import { stdin } from "node:process";
import { pathToFileURL } from "node:url";

export const VERDICTS = Object.freeze([
  "cold",
  "voided",
  "queued",
  "trapdoor",
  "drain-on-wake",
  "nine-of-nine",
  "unbounded",
  "no-os-notify",
  "hold",
]);
export const IDLE_WORD = "cold";
export const SEEDED_WORD = "voided";
export const HOLD_VERDICTS = Object.freeze(["cold", "hold"]);
export const ALARM_VERDICTS = Object.freeze(
  VERDICTS.filter((name) => !HOLD_VERDICTS.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FEATURED_ISSUE = 92095;
export const PRIMARY_ISSUES = Object.freeze([92095]);
export const COUSINS = Object.freeze([39335, 54214, 53605]);
export const COUSIN_ISSUE = 39335;
export const DIFFERENT_CLASS = Object.freeze([20754, 79268]);
export const BACKUPS = Object.freeze([92079, 92112, 92059]);
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/92095";
export const TITLE =
  "[BUG] Cowork Dispatch: child-completion notifications queue against an idle parent and only drain on the parent's next unrelated turn";
export const FILED_AT = "2026-09-04T14:08:24Z";
export const UPDATED_AT = "2026-09-04T14:09:40Z";
export const LABELS = Object.freeze([
  "bug",
  "has repro",
  "platform:windows",
  "area:cowork",
]);
export const REPORTER = "AllyOmega";
export const PLATFORM = "Windows 11 (10.0.26200) x64";
export const APP_VERSION = "1.44121.4.0";
export const CCD_VERSION = "2.1.258";
export const INSTALL = "MSIX";
export const DESKTOP = "Claude Desktop (Cowork / Code tab)";
export const AREA = "area:cowork";
export const EVIDENCE = "cowork-dispatch-cold-parent-queued-child-completion";
export const DELAYS = Object.freeze(["1m44s", "12m06s", "48m34s", "11h35m"]);
export const COLD_PATH_HITS = 9;
export const COLD_PATH_TOTAL = 9;
export const QUEUE_AT = "12:07:59";
export const DRAIN_AT = "13:11:59";
export const OVERNIGHT_FINISH = "21:00";
export const OVERNIGHT_RELAY = "08:35";
export const SEND_MESSAGE = "ccd_session_mgmt__send_message";
export const QUEUED_LINE =
  "Queued notification for cold parent local_ditto_<PARENT> (child local_<CHILD> completed)";
export const DRAIN_LINE =
  "Drained 1 queued notification(s) for local_ditto_<PARENT>";
export const RELAUNCH_LINE =
  "Starting local session local_ditto_<PARENT> in /home/<generated-name>";
export const APP_HISTORY = Object.freeze([
  "1.34493.0",
  "1.37937.3",
  "1.40609.0",
  "1.40609.1",
  "1.44121.4",
]);
export const CCD_ON_48M = "2.1.235";
export const APP_ON_48M = "1.34493.0";
export const HUB_LINE =
  "00:50 oubliette: a oubliette that drops a finished child's notice into the pit under a cold parent is not a push — it is a queue already forgotten. Score the trapdoor or admit the void already drained.";
export const MARK = "00:50 / hermes catalog #138 / #92095";
export const PHRASE =
  "Score the trapdoor or admit the queue already drained.";
export const HYPOTHESIS_NOTE =
  "NON-BINDING: a Dispatch child completion is queued against the parent orchestrator; when the parent is idle there is no process alive to receive a push (every wake relaunches the session), so the notice sits until the next unrelated user turn. The child cannot ccd_session_mgmt__send_message into unattended or remote-dispatched sessions. Discard if issue evidence disagrees. Do not claim Claude Code source you have not seen.";
export const CONTRAST_NOTE =
  "This is COLD-PARENT DISPATCH CHILD-COMPLETION QUEUE under an idle Cowork orchestrator. Claude Desktop (Cowork / Code tab) 1.44121.4.0 MSIX; CCD 2.1.258; Windows 11 (10.0.26200) x64. Detection, queue, and child running→idle land in the same second. The queue drains only on the parent's idle→initializing. Every completion in the reporter log hit the cold path, 9 out of 9; the warm path never ran. Delays on the same parent: 1m44s, 12m06s, 48m34s, 11h35m (finished 21:00, relayed 08:35). No OS notification on this path. ccd_session_mgmt__send_message is unavailable in unattended and remote-dispatched sessions. Not a recent regression: 48m34s on app 1.34493.0 / CCD 2.1.235; 11h35m on 1.44121.4 / 2.1.258; 1.37937.3, 1.40609.0, 1.40609.1 in between, same behaviour. Reporter AllyOmega. Filed 2026-09-04. OPEN, bug, has repro, platform:windows, area:cowork. Not Ephemera 5m wick rewrite. Not Commutator sibling-slot stray. Not Hectograph OTEL scrub. Not Hawser process-reap.";
export const HOLD_RESULT =
  "cold pit; warm parent drained the notice on the same turn; the trapdoor stayed shut; idle word cold";
export const FORBIDDEN_IDLE = Object.freeze([
  "banked",
  "rewritten",
  "keyed",
  "strayed",
  "scrubbed",
  "pulled",
  "enacted",
  "withheld",
  "masked",
  "bled",
  "crossed",
  "homed",
  "slipped",
  "fouled",
  "mangled",
  "verbatim",
  "unbolted",
  "snagged",
  "sounded",
  "muted",
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
  "armed",
  "unheard",
  "voided",
]);
export const BANNED_NAMES = Object.freeze([
  "Ephemera",
  "Commutator",
  "Heddle",
  "Hectograph",
  "Placet",
  "Frisket",
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
  "Newsreader",
  "Figtree",
  "Source Code Pro",
  "Source Serif 4",
  "Libre Franklin",
  "JetBrains Mono",
  "Literata",
  "Manrope",
  "IBM Plex Mono",
  "IBM Plex",
  "Cormorant",
  "Fraunces",
  "Outfit",
  "Fira Code",
  "DM Sans",
]);
export const NOT_PRODUCTS = Object.freeze([
  "ephemera",
  "commutator",
  "heddle",
  "hectograph",
  "placet",
  "frisket",
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

function dispatchOf(input) {
  const src = input && typeof input === "object" ? input : {};
  const nested = src.dispatch && typeof src.dispatch === "object" ? src.dispatch : {};
  return {
    parentTemp: firstText(nested.parentTemp, src.parentTemp, src.parent),
    parentState: firstText(nested.parentState, src.parentState, src.lifecycle),
    queued: firstBool(nested.queued, src.queued),
    drained: firstBool(nested.drained, src.drained),
    childCompleted: firstBool(nested.childCompleted, src.childCompleted, src.completed),
    processAlive: firstBool(nested.processAlive, src.processAlive),
    osNotification: firstBool(nested.osNotification, src.osNotification),
    sendMessageAvailable: firstBool(
      nested.sendMessageAvailable,
      src.sendMessageAvailable,
    ),
    delay: firstText(nested.delay, src.delay),
    coldPathHits: firstNum(nested.coldPathHits, src.coldPathHits),
    coldPathTotal: firstNum(nested.coldPathTotal, src.coldPathTotal),
  };
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
    persistHold: null,
    cold: null,
    voided: null,
    parentTemp: "",
    parentState: "",
    queued: null,
    drained: null,
    childCompleted: null,
    processAlive: null,
    osNotification: null,
    sendMessageAvailable: null,
    delay: "",
    delays: null,
    coldPathHits: null,
    coldPathTotal: null,
    queuedAt: "",
    drainedAt: "",
    queuedLine: "",
    drainLine: "",
    relaunchLine: "",
    platform: "",
    appVersion: "",
    ccdVersion: "",
    reporter: "",
    area: "",
    evidence: "",
    outputText: "",
  };
}

export function seedCold() {
  return {
    ...blankTicket(),
    seed: IDLE_WORD,
    source: "dungeon",
    persistHold: true,
    cold: true,
    voided: false,
    parentTemp: "warm",
    parentState: "running",
    queued: false,
    drained: true,
    childCompleted: true,
    processAlive: true,
    osNotification: null,
    delay: "",
    area: AREA,
    evidence: EVIDENCE,
    outputText:
      "cold; warm parent drained the notice on the same turn; the trapdoor stayed shut; idle word cold",
  };
}

export function seedVoided() {
  return {
    ...blankTicket(),
    seed: SEEDED_WORD,
    issue: FEATURED_ISSUE,
    title: TITLE,
    url: ISSUE_URL,
    source: "dungeon",
    persistHold: false,
    cold: false,
    voided: true,
    parentTemp: "cold",
    parentState: "idle",
    queued: true,
    drained: false,
    childCompleted: true,
    processAlive: false,
    osNotification: false,
    sendMessageAvailable: false,
    delay: "11h35m",
    delays: [...DELAYS],
    coldPathHits: COLD_PATH_HITS,
    coldPathTotal: COLD_PATH_TOTAL,
    queuedAt: QUEUE_AT,
    drainedAt: DRAIN_AT,
    queuedLine: QUEUED_LINE,
    drainLine: DRAIN_LINE,
    relaunchLine: RELAUNCH_LINE,
    platform: PLATFORM,
    appVersion: APP_VERSION,
    ccdVersion: CCD_VERSION,
    reporter: REPORTER,
    area: AREA,
    evidence: EVIDENCE,
    outputText:
      "voided; #92095; Queued notification for cold parent; child completed the same second; drain waits on idle → initializing; AllyOmega; 1.44121.4.0; CCD 2.1.258; Windows 11; area:cowork",
  };
}

export function seedQueued() {
  return {
    ...blankTicket(),
    seed: "queued",
    source: "dungeon",
    persistHold: false,
    voided: true,
    parentTemp: "cold",
    parentState: "idle",
    queued: true,
    childCompleted: true,
    queuedAt: QUEUE_AT,
    queuedLine: QUEUED_LINE,
    outputText:
      "queued; 12:07:59 [Dispatch] Queued notification for cold parent local_ditto_<PARENT> (child local_<CHILD> completed)",
  };
}

export function seedTrapdoor() {
  return {
    ...blankTicket(),
    seed: "trapdoor",
    source: "dungeon",
    persistHold: false,
    voided: true,
    parentTemp: "cold",
    parentState: "idle",
    queued: true,
    processAlive: false,
    relaunchLine: RELAUNCH_LINE,
    outputText:
      "trapdoor; parent is not listening while idle; every wake relaunches Starting local session local_ditto_<PARENT> in /home/<generated-name>",
  };
}

export function seedDrainOnWake() {
  return {
    ...blankTicket(),
    seed: "drain-on-wake",
    source: "dungeon",
    persistHold: false,
    voided: true,
    parentTemp: "cold",
    parentState: "idle → initializing",
    queued: true,
    drained: true,
    queuedAt: QUEUE_AT,
    drainedAt: DRAIN_AT,
    drainLine: DRAIN_LINE,
    outputText:
      "drain-on-wake; 13:11:59 [Lifecycle] idle → initializing then [Dispatch] Drained 1 queued notification(s) for local_ditto_<PARENT>",
  };
}

export function seedNineOfNine() {
  return {
    ...blankTicket(),
    seed: "nine-of-nine",
    source: "dungeon",
    persistHold: false,
    voided: true,
    parentTemp: "cold",
    queued: true,
    childCompleted: true,
    coldPathHits: COLD_PATH_HITS,
    coldPathTotal: COLD_PATH_TOTAL,
    outputText:
      "nine-of-nine; every completion in the log hit the cold path, 9 out of 9; the warm path never ran",
  };
}

export function seedUnbounded() {
  return {
    ...blankTicket(),
    seed: "unbounded",
    source: "dungeon",
    persistHold: false,
    voided: true,
    parentTemp: "cold",
    queued: true,
    delay: "11h35m",
    delays: [...DELAYS],
    outputText:
      "unbounded; same parent delays 1m44s, 12m06s, 48m34s, 11h35m; last finished 21:00 and was not relayed until 08:35",
  };
}

export function seedNoOsNotify() {
  return {
    ...blankTicket(),
    seed: "no-os-notify",
    source: "dungeon",
    persistHold: false,
    voided: true,
    parentTemp: "cold",
    queued: true,
    childCompleted: true,
    osNotification: false,
    sendMessageAvailable: false,
    outputText:
      "no-os-notify; nothing in the log emits an OS notification on child completion; ccd_session_mgmt__send_message is unavailable in unattended and remote-dispatched sessions",
  };
}

export function seedHold() {
  return {
    ...seedCold(),
    seed: "hold",
    outputText:
      "hold; warm parent drained the notice on the same turn; the trapdoor stayed shut; idle word cold",
  };
}

export function seedCousin() {
  return {
    ...seedCold(),
    seed: IDLE_WORD,
    issue: COUSIN_ISSUE,
    isolation: "cousin",
    cousin: String(COUSIN_ISSUE),
    outputText:
      "cousin-not-primary; #39335 locked same-class background completion delayed until user interaction; #54214 #53605 closed as duplicates of #39335 — cite only, not the #92095 cold-parent Dispatch oubliette",
  };
}

export function emptyTicket() {
  return seedCold();
}

export function cloneTicket(input) {
  const src = input && typeof input === "object" ? input : {};
  const nested =
    src.ticket && typeof src.ticket === "object" ? src.ticket : {};
  const dispatch = dispatchOf({ ...src, ...nested });
  const delays =
    (Array.isArray(nested.delays) && nested.delays) ||
    (Array.isArray(src.delays) && src.delays) ||
    null;
  return {
    seed: firstText(nested.seed, src.seed),
    issue: firstNum(nested.issue, src.issue),
    title: firstText(nested.title, src.title),
    url: firstText(nested.url, src.url),
    source: firstText(nested.source, src.source),
    isolation: firstText(nested.isolation, src.isolation),
    cousin: firstText(nested.cousin, src.cousin),
    persistHold: firstBool(nested.persistHold, src.persistHold),
    cold: firstBool(nested.cold, src.cold),
    voided: firstBool(nested.voided, src.voided),
    parentTemp: dispatch.parentTemp,
    parentState: dispatch.parentState,
    queued: dispatch.queued,
    drained: dispatch.drained,
    childCompleted: dispatch.childCompleted,
    processAlive: dispatch.processAlive,
    osNotification: dispatch.osNotification,
    sendMessageAvailable: dispatch.sendMessageAvailable,
    delay: dispatch.delay,
    delays,
    coldPathHits: dispatch.coldPathHits,
    coldPathTotal: dispatch.coldPathTotal,
    queuedAt: firstText(nested.queuedAt, src.queuedAt),
    drainedAt: firstText(nested.drainedAt, src.drainedAt),
    queuedLine: firstText(nested.queuedLine, src.queuedLine),
    drainLine: firstText(nested.drainLine, src.drainLine),
    relaunchLine: firstText(nested.relaunchLine, src.relaunchLine),
    platform: firstText(nested.platform, src.platform),
    appVersion: firstText(nested.appVersion, src.appVersion),
    ccdVersion: firstText(nested.ccdVersion, src.ccdVersion, src.cliVersion),
    reporter: firstText(nested.reporter, src.reporter),
    area: firstText(nested.area, src.area),
    evidence: firstText(nested.evidence, src.evidence),
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
  const dispatch = dispatchOf(row);
  return (
    row.persistHold == null &&
    row.cold == null &&
    row.voided == null &&
    !dispatch.parentTemp &&
    dispatch.queued == null &&
    dispatch.drained == null &&
    dispatch.childCompleted == null &&
    dispatch.coldPathHits == null &&
    !dispatch.delay
  );
}

const SEED_FNS = {
  [IDLE_WORD]: seedCold,
  [SEEDED_WORD]: seedVoided,
  queued: seedQueued,
  trapdoor: seedTrapdoor,
  "drain-on-wake": seedDrainOnWake,
  "nine-of-nine": seedNineOfNine,
  unbounded: seedUnbounded,
  "no-os-notify": seedNoOsNotify,
  hold: seedHold,
  cousin: seedCousin,
  39335: seedCousin,
  54214: seedCousin,
  53605: seedCousin,
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
    return { ...seedVoided(), ...cloned, ...raw };
  }
  if (
    (COUSINS.includes(issue) || DIFFERENT_CLASS.includes(issue)) &&
    coreMissing
  ) {
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
    ticket.appVersion,
    ticket.ccdVersion,
    ticket.parentTemp,
    ticket.parentState,
    ticket.delay,
    ticket.queuedLine,
    ticket.drainLine,
    ticket.relaunchLine,
    ticket.area,
    ticket.evidence,
  ]
    .filter(Boolean)
    .join("\n");
}

function canonicalSeed(seed) {
  const raw = String(seed || "");
  if (VERDICTS.includes(raw)) return raw;
  const aliases = {
    drainOnWake: "drain-on-wake",
    drain_on_wake: "drain-on-wake",
    nineOfNine: "nine-of-nine",
    "9/9": "nine-of-nine",
    "nine-of-9": "nine-of-nine",
    noOsNotify: "no-os-notify",
    "no-os": "no-os-notify",
    no_os_notify: "no-os-notify",
  };
  if (aliases[raw]) return aliases[raw];
  const lower = raw.toLowerCase();
  return VERDICTS.find((name) => name.toLowerCase() === lower) || lower;
}

export function isWarmDrain(ticket) {
  const row = cloneTicket(ticket);
  if (row.parentTemp === "warm" && row.drained === true && row.queued !== true) {
    return true;
  }
  if (row.parentTemp === "warm" && row.drained === true && row.processAlive === true) {
    return true;
  }
  return false;
}

export function voidedPattern(ticket) {
  const row = cloneTicket(ticket);
  if (row.voided === true) return true;
  if (row.parentTemp === "cold" && row.queued === true) return true;
  if (row.parentTemp === "cold" && row.childCompleted === true && row.drained !== true) {
    return true;
  }
  if (row.queued === true && /idle/i.test(row.parentState) && row.drained !== true) {
    return true;
  }
  return false;
}

export function coldPattern(ticket) {
  const row = cloneTicket(ticket);
  if (row.cold === true && row.voided !== true) return true;
  if (isWarmDrain(row) && row.voided !== true) return true;
  return false;
}

export function isCold(ticket) {
  const row = cloneTicket(ticket);
  if (row.isolation === "cousin") return true;
  if (canonicalSeed(row.seed) === IDLE_WORD) return true;
  if (canonicalSeed(row.seed) === "hold") return true;
  if (row.persistHold === true && row.voided !== true && coldPattern(row)) {
    return true;
  }
  if (coldPattern(row) && row.voided !== true && !voidedPattern(row)) {
    return true;
  }
  return false;
}

export function isVoided(ticket) {
  const row = cloneTicket(ticket);
  const named = canonicalSeed(row.seed);
  if (HOLD_VERDICTS.includes(named)) return false;
  if (COUSINS.includes(row.issue) && named !== SEEDED_WORD) return false;
  if (DIFFERENT_CLASS.includes(row.issue) && named !== SEEDED_WORD) return false;
  if (named === SEEDED_WORD) return true;
  if (row.issue === FEATURED_ISSUE && named !== IDLE_WORD && named !== "hold") {
    return true;
  }
  if (voidedPattern(row)) return true;
  return false;
}

export function flagsOf(ticket) {
  const row = cloneTicket(ticket);
  const text = textOf(row);
  const named = canonicalSeed(row.seed);
  const cousinOnly =
    (COUSINS.includes(row.issue) ||
      DIFFERENT_CLASS.includes(row.issue) ||
      /cousin-not-primary|#39335|#54214|#53605|#20754|#79268/i.test(text)) &&
    named !== SEEDED_WORD &&
    row.issue !== FEATURED_ISSUE;
  const voidedNow = !cousinOnly && isVoided(row);
  const coldNow = !voidedNow && isCold(row);
  const queued =
    named === "queued" ||
    row.queued === true ||
    /Queued notification for cold parent/i.test(text);
  const trapdoor =
    named === "trapdoor" ||
    row.processAlive === false ||
    /Starting local session local_ditto_|not listening while idle|relaunch/i.test(
      text,
    );
  const drainOnWake =
    named === "drain-on-wake" ||
    /idle → initializing|Drained 1 queued notification/i.test(text) ||
    (row.queuedAt === QUEUE_AT && row.drainedAt === DRAIN_AT);
  const nineOfNine =
    named === "nine-of-nine" ||
    (row.coldPathHits === COLD_PATH_HITS &&
      row.coldPathTotal === COLD_PATH_TOTAL) ||
    /9 out of 9|9\/9|nine-of-nine/i.test(text);
  const unbounded =
    named === "unbounded" ||
    row.delay === "11h35m" ||
    (Array.isArray(row.delays) && row.delays.length === DELAYS.length) ||
    /1m44s|12m06s|48m34s|11h35m|unbounded/i.test(text);
  const noOsNotify =
    named === "no-os-notify" ||
    row.osNotification === false ||
    /no OS notification|ccd_session_mgmt__send_message/i.test(text);
  const voided =
    named !== IDLE_WORD &&
    named !== "hold" &&
    !cousinOnly &&
    (voidedNow || named === SEEDED_WORD || /voided|#92095/i.test(text));
  const cold = HOLD_VERDICTS.includes(named) || (coldNow && !voided);
  return {
    named,
    cousinOnly,
    voidedNow,
    coldNow,
    queued,
    trapdoor,
    drainOnWake,
    nineOfNine,
    unbounded,
    noOsNotify,
    voided,
    cold,
  };
}

export function chipsOf(ticket) {
  const flags = flagsOf(ticket);
  const chips = [];
  if (flags.cold && !flags.voided) chips.push("cold");
  if (flags.voided) chips.push("voided");
  if (flags.queued && flags.voided) chips.push("queued");
  if (flags.trapdoor && flags.voided) chips.push("trapdoor");
  if (flags.drainOnWake && flags.voided) chips.push("drain-on-wake");
  if (flags.nineOfNine && flags.voided) chips.push("nine-of-nine");
  if (flags.unbounded && flags.voided) chips.push("unbounded");
  if (flags.noOsNotify && flags.voided) chips.push("no-os-notify");
  if ((flags.cold || flags.named === "hold") && !flags.voided) {
    chips.push("hold");
  }
  if (ticket.seed && VERDICTS.includes(ticket.seed)) chips.push(ticket.seed);
  return [...new Set(chips)];
}

function reasonsOf(ticket, flags, verdict) {
  const reasons = [];
  if (verdict === "cold") {
    reasons.push(
      "cold; warm parent drained the notice on the same turn; the trapdoor stayed shut",
    );
    reasons.push("hold: the pit stayed empty; idle word cold");
  }
  if (verdict === "hold") {
    reasons.push(
      "hold; warm parent drained the notice on the same turn; the trapdoor stayed shut",
    );
  }
  if (verdict === "voided" || flags.voided) {
    reasons.push(
      "voided; #92095; cold parent + queued child completion; the notice sits until the next unrelated wake",
    );
  }
  if (verdict === "queued" || (flags.queued && flags.voided)) {
    reasons.push(
      "queued; 12:07:59 [Dispatch] Queued notification for cold parent; result, queue, and child running→idle land in the same second",
    );
  }
  if (verdict === "trapdoor" || (flags.trapdoor && flags.voided)) {
    reasons.push(
      "trapdoor; parent is not listening while idle; every wake relaunches the session process",
    );
  }
  if (verdict === "drain-on-wake" || (flags.drainOnWake && flags.voided)) {
    reasons.push(
      "drain-on-wake; the queue drains only on the parent's idle → initializing",
    );
  }
  if (verdict === "nine-of-nine" || (flags.nineOfNine && flags.voided)) {
    reasons.push(
      "nine-of-nine; every completion in the log hit the cold path, 9 out of 9; the warm path never ran",
    );
  }
  if (verdict === "unbounded" || (flags.unbounded && flags.voided)) {
    reasons.push(
      "unbounded; same parent delays 1m44s, 12m06s, 48m34s, 11h35m; last finished 21:00, relayed 08:35",
    );
  }
  if (verdict === "no-os-notify" || (flags.noOsNotify && flags.voided)) {
    reasons.push(
      "no-os-notify; no OS notification on child completion; ccd_session_mgmt__send_message cannot reach unattended or remote-dispatched sessions",
    );
  }
  if (flags.cousinOnly) {
    reasons.push(
      "cousin is not Oubliette; cite-only #39335 (locked; same-class background completion delayed until user interaction), #54214, #53605 — different surfaces from #92095 cold-parent Dispatch oubliette; different-class cite #20754 #79268; primary stays #92095",
    );
  }
  if (verdict === "voided" || flags.voided) {
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
  if (named === IDLE_WORD && (flags.cold || !flags.voided)) return "cold";
  if (named === "hold" && !flags.voided) return "hold";
  if (named === SEEDED_WORD) return "voided";
  if (VERDICTS.includes(named) && !HOLD_VERDICTS.includes(named)) {
    return named;
  }
  if (flags.cousinOnly) return "cold";
  if (flags.voided) return "voided";
  if (flags.cold) return "cold";
  return "cold";
}

function deskOf(flags, ticket, verdict) {
  if (verdict === "voided" || flags.voided) {
    return {
      case: "voided — finished child's notice dropped into the pit under a cold parent",
      parentTemp: ticket.parentTemp || "cold",
      queued: ticket.queued ?? true,
      delay: ticket.delay || "11h35m",
      coldPath: `${ticket.coldPathHits ?? COLD_PATH_HITS}/${ticket.coldPathTotal ?? COLD_PATH_TOTAL}`,
      mark: "oubliette voided; admit the queue already drained",
      note: PHRASE,
    };
  }
  if (verdict === "hold") {
    return {
      case: "hold — warm parent drained the notice on the same turn",
      parentTemp: "warm",
      queued: false,
      delay: "",
      coldPath: "0/0",
      mark: "oubliette hold; the trapdoor stays shut",
      note: "Hold: the trapdoor stays shut.",
    };
  }
  return {
    case: "cold — warm parent drained; the pit stayed empty; idle word cold",
    parentTemp: "warm",
    queued: false,
    delay: "",
    coldPath: "0/0",
    mark: "oubliette cold; idle word cold",
    note: "Cold: the trapdoor stayed shut; the pit stayed empty.",
  };
}

export function analyze(input) {
  const ticket = normalize(input);
  const flags = flagsOf(ticket);
  const chips = chipsOf(ticket);
  const seed = String(ticket.seed || "");
  const verdict = pickVerdict(seed, flags);
  const hold = HOLD_VERDICTS.includes(verdict);
  const voided = verdict === "voided" || flags.voided;
  return {
    verdict,
    chips,
    reasons: reasonsOf(ticket, flags, verdict),
    cold: verdict === "cold" || (flags.cold && !voided),
    voided,
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
  if (name === SEEDED_WORD || name === 92095 || name === "92095") {
    return analyze(seedVoided());
  }
  if (name === "queued") return analyze(seedQueued());
  if (name === "trapdoor") return analyze(seedTrapdoor());
  if (name === "drain-on-wake" || name === "drainOnWake") {
    return analyze(seedDrainOnWake());
  }
  if (name === "nine-of-nine" || name === "9/9") {
    return analyze(seedNineOfNine());
  }
  if (name === "unbounded") return analyze(seedUnbounded());
  if (name === "no-os-notify" || name === "noOsNotify") {
    return analyze(seedNoOsNotify());
  }
  if (name === "hold") return analyze(seedHold());
  if (name === IDLE_WORD || name === "open") {
    return analyze(seedCold());
  }
  if (
    name === 39335 ||
    name === "39335" ||
    name === 54214 ||
    name === "54214" ||
    name === 53605 ||
    name === "53605" ||
    name === 20754 ||
    name === "20754" ||
    name === 79268 ||
    name === "79268" ||
    name === "cousin"
  ) {
    return analyze(seedCousin());
  }
  if (SEED_FNS[name]) return analyze(SEED_FNS[name]());
  return analyze(seedCold());
}

export function handle(input) {
  const result = analyze(input);
  return {
    ...result,
    hookSpecificOutput: {
      additionalContext:
        result.verdict === "voided" || (result.voided && result.alarm)
          ? `voided oubliette #${FEATURED_ISSUE}: cold parent queued a finished child's notice; the pit holds until the next unrelated wake. ${HYPOTHESIS_NOTE}`
          : result.verdict === "hold"
            ? "hold. The trapdoor stayed shut. Score the trapdoor."
            : `cold oubliette. Idle word ${IDLE_WORD}. Warm parent drained the notice on the same turn.`,
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
