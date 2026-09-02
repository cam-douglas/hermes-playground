#!/usr/bin/env node
/**
 * Crimp — bench / crimping-pliers atelier classifier.
 * A crimp that tears under concurrent pliers is not a sealed
 * join — it is a sheared foil. Score the swage or admit the
 * settings already tore.
 *
 *   echo '{"torn":true,"unlockedRmw":true}' | node crimp.mjs
 *   node crimp.mjs ticket.json
 *
 * Idle word is swaged (HOLD: writeUserSettingsAndPush uses
 * tmp+rename + lock; concurrent sessions cannot tear
 * ~/.claude/settings.json or silently drop each other's keys).
 * Seeded state is torn / #91520 (unlocked non-atomic RMW;
 * 0-byte mid-truncate OR valid JSON + stale trailing bytes;
 * later writer discards other session's keys).
 *
 * This is a diagnostic scoring bench. NOT an exploit.
 * No payloads. No attack procedures. Score fixture strings
 * for whether the settings join is swaged or torn.
 *
 * Primary #91520: settings.json is written with an unlocked,
 * non-atomic read-modify-write: concurrent sessions tear it
 * ("Settings file failed to parse") and silently drop each
 * other's keys (2.1.258, with repro). Reporter Lukasmolvaer.
 * Filed 2026-09-02T14:21:59Z. OPEN. Labels: bug, has repro,
 * area:core, platform:vscode, platform:wsl.
 *
 * Hypothesis only (NON-BINDING): concurrent writeFile without
 * flock/tmp+rename is the root; discard if issue evidence
 * disagrees.
 */

import { readFileSync } from "node:fs";
import { stdin } from "node:process";
import { pathToFileURL } from "node:url";

export const VERDICTS = Object.freeze([
  "swaged",
  "torn",
  "truncate",
  "stale-tail",
  "lost-update",
  "permissions-drop",
  "hooks-drop",
  "has-clear-repro",
  "hold",
]);
export const IDLE_WORD = "swaged";
export const SEEDED_WORD = "torn";
export const HOLD_VERDICTS = Object.freeze(["swaged", "hold"]);
export const ALARM_VERDICTS = Object.freeze(
  VERDICTS.filter((name) => !HOLD_VERDICTS.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FEATURED_ISSUE = 91520;
export const PRIMARY_ISSUES = Object.freeze([91520]);
export const COUSINS = Object.freeze([79403, 82167, 76749, 2810, 78764]);
export const COUSIN_ISSUE = 79403;
export const BACKUPS = Object.freeze([
  { name: "Codicil", issue: 91513 },
  { name: "Caret", issue: 91526 },
  { name: "Accrete", issue: 91512 },
]);
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/91520";
export const TITLE =
  'settings.json is written with an unlocked, non-atomic read-modify-write: concurrent sessions tear it ("Settings file failed to parse") and silently drop each other\'s keys (2.1.258, with repro)';
export const FILED_AT = "2026-09-02T14:21:59Z";
export const UPDATED_AT = "2026-09-02T14:23:14Z";
export const LABELS = Object.freeze([
  "bug",
  "has repro",
  "area:core",
  "platform:vscode",
  "platform:wsl",
]);
export const REPORTER = "Lukasmolvaer";
export const VERSION = "2.1.258";
export const EXTENSION_RANGE = "2.1.246→2.1.258";
export const PLATFORM = "Ubuntu 24.04.4 LTS on WSL2";
export const WRITE_SITE = "writeUserSettingsAndPush";
export const TORN_RATE = "1.3%";
export const TORN_READS = 2791;
export const TOTAL_READS = 213861;
export const EMPTY_READS = 2498;
export const STALE_TAIL_READS = 293;
export const STALE_TAIL_BYTES = 313;
export const RENAME_TORN = 0;
export const RENAME_READS = 162217;
export const WILD_OCCURRENCES = 9;
export const MAX_PROCESSES = 10;
export const EVIDENCE = "unlocked-non-atomic-rmw";
export const HUB_LINE =
  "02:50 crimp: a crimp that tears under concurrent pliers is not a sealed join — it is a sheared foil. Score the swage or admit the settings already tore.";
export const MARK = "02:50 / hermes catalog #125 / #91520";
export const PHRASE =
  "a crimp that tears under concurrent pliers is not a sealed join — it is a sheared foil. Score the swage or admit the settings already tore.";
export const HYPOTHESIS_NOTE =
  "NON-BINDING: concurrent writeFile without flock/tmp+rename is the root; discard if issue evidence disagrees.";
export const CONTRAST_NOTE =
  "This is SETTINGS.JSON UNLOCKED NON-ATOMIC RMW — CONCURRENT SESSIONS TEAR FILE + LOST UPDATE; SILENT PERMISSION/HOOK DROP; AREA:CORE. writeUserSettingsAndPush does read → mutate → writeFile with no lock and no tmp+rename. Two bugs: (1) torn file — reader sees partial write (0-byte mid-truncate OR valid JSON + stale trailing bytes); (2) lost update — later writer silently discards other session's keys. Deterministic repro: 1.3% torn reads under load (2791/213861; 0-byte: 2498; 293 x valid JSON + 313 stale trailing bytes); write-to-sibling+rename → 0 torn of 162217. Wild evidence: nine occurrences; banked corrupt files with both shapes. Impact: Settings file is not valid JSON → fallback to defaults → silently drops permissions and hooks behind a dismissable banner. Reporter Lukasmolvaer. Claude Code CLI 2.1.258 / VS Code extension 2.1.246→2.1.258; Ubuntu WSL2; up to ten concurrent processes. Filed 2026-09-02. OPEN, has repro, area:core, platform:vscode, platform:wsl.";
export const FORBIDDEN_IDLE = Object.freeze([
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
  "sealed",
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
]);
export const FORBIDDEN_UI = Object.freeze([
  "Brygada 1918",
  "Atkinson Hyperlegible",
  "DM Mono",
  "Fraunces",
  "Source Sans 3",
  "IBM Plex",
  "Piazzolla",
  "Nunito",
  "Roboto Mono",
  "Literata",
  "Red Hat",
  "EB Garamond",
  "Hanken",
  "Noto Sans Mono",
  "Crimson Pro",
  "Plus Jakarta",
  "Ubuntu Mono",
]);
export const NOT_PRODUCTS = Object.freeze([
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
    atomicWrite: null,
    lockedRmw: null,
    unlockedRmw: null,
    tmpRename: null,
    torn: null,
    truncate: null,
    staleTail: null,
    lostUpdate: null,
    permissionsDrop: null,
    hooksDrop: null,
    hasClearRepro: null,
    concurrentSessions: null,
    tornRate: "",
    foilShape: "",
    platform: "",
    area: "",
    evidence: "",
    cliVersion: "",
    reporter: "",
    outputText: "",
  };
}

export function seedSwaged() {
  return {
    ...blankTicket(),
    seed: IDLE_WORD,
    source: "atelier",
    atomicWrite: true,
    lockedRmw: true,
    unlockedRmw: false,
    tmpRename: true,
    torn: false,
    truncate: false,
    staleTail: false,
    lostUpdate: false,
    permissionsDrop: false,
    hooksDrop: false,
    hasClearRepro: false,
    concurrentSessions: 0,
    foilShape: "parse-ok",
    platform: PLATFORM,
    area: "area:core",
    evidence: EVIDENCE,
    cliVersion: VERSION,
    outputText:
      "swaged; writeUserSettingsAndPush uses tmp+rename + lock; concurrent sessions cannot tear settings.json or silently drop keys; idle word swaged",
  };
}

export function seedTorn() {
  return {
    ...blankTicket(),
    seed: SEEDED_WORD,
    issue: FEATURED_ISSUE,
    title: TITLE,
    url: ISSUE_URL,
    source: "atelier",
    atomicWrite: false,
    lockedRmw: false,
    unlockedRmw: true,
    tmpRename: false,
    torn: true,
    truncate: true,
    staleTail: true,
    lostUpdate: true,
    permissionsDrop: true,
    hooksDrop: true,
    hasClearRepro: true,
    concurrentSessions: MAX_PROCESSES,
    tornRate: TORN_RATE,
    foilShape: "torn",
    platform: PLATFORM,
    area: "area:core",
    evidence: EVIDENCE,
    cliVersion: VERSION,
    reporter: REPORTER,
    outputText:
      "torn; #91520; writeUserSettingsAndPush read → mutate → writeFile; no lock; no tmp+rename; 0-byte mid-truncate OR valid JSON + stale trailing bytes; later writer discards other session's keys; 1.3% torn; nine wild occurrences; Settings file is not valid JSON; permissions and hooks drop behind a dismissable banner; Lukasmolvaer; Claude Code CLI 2.1.258; VS Code 2.1.246→2.1.258; Ubuntu WSL2; area:core",
  };
}

export function seedTruncate() {
  return {
    ...blankTicket(),
    seed: "truncate",
    source: "atelier",
    truncate: true,
    torn: true,
    foilShape: "0-byte",
    outputText:
      "truncate; 0-byte mid-truncate between open(O_TRUNC) and write; settings.json.corrupt.20260830T211332 is 0 B",
  };
}

export function seedStaleTail() {
  return {
    ...blankTicket(),
    seed: "stale-tail",
    source: "atelier",
    staleTail: true,
    torn: true,
    foilShape: "valid-json-plus-stale-tail",
    outputText:
      "stale-tail; valid JSON object followed by the tail of a longer earlier serialisation; 293 x valid JSON + 313 stale trailing bytes; banked 131 B / 10-byte stale tail",
  };
}

export function seedLostUpdate() {
  return {
    ...blankTicket(),
    seed: "lost-update",
    source: "atelier",
    lostUpdate: true,
    unlockedRmw: true,
    outputText:
      "lost-update; two sessions each read, mutate and write; the later write wins and silently discards the other session's keys",
  };
}

export function seedPermissionsDrop() {
  return {
    ...blankTicket(),
    seed: "permissions-drop",
    source: "atelier",
    permissionsDrop: true,
    torn: true,
    outputText:
      "permissions-drop; Settings file is not valid JSON → fallback to defaults → silently drops permissions behind a dismissable banner",
  };
}

export function seedHooksDrop() {
  return {
    ...blankTicket(),
    seed: "hooks-drop",
    source: "atelier",
    hooksDrop: true,
    torn: true,
    outputText:
      "hooks-drop; Settings file is not valid JSON → fallback to defaults → silently drops hooks behind a dismissable banner",
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
    platform: PLATFORM,
    outputText:
      "has-clear-repro; Lukasmolvaer filed #91520; has repro; area:core; platform:vscode; platform:wsl; Claude Code CLI 2.1.258; VS Code extension 2.1.246→2.1.258; Ubuntu WSL2; 1.3% torn under load",
  };
}

export function seedHold() {
  return {
    ...seedSwaged(),
    seed: "hold",
    outputText:
      "hold; writeUserSettingsAndPush uses tmp+rename + lock; the crimp holds; idle word swaged",
  };
}

export function seedCousin() {
  return {
    ...seedSwaged(),
    seed: IDLE_WORD,
    issue: COUSIN_ISSUE,
    isolation: "cousin",
    cousin: String(COUSIN_ISSUE),
    outputText:
      "cousin-not-primary; #79403 VS Code model toggle corrupts settings — cite only, not the #91520 unlocked non-atomic RMW tear",
  };
}

export function emptyTicket() {
  return seedSwaged();
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
    atomicWrite: firstBool(nested.atomicWrite, src.atomicWrite),
    lockedRmw: firstBool(nested.lockedRmw, src.lockedRmw),
    unlockedRmw: firstBool(nested.unlockedRmw, src.unlockedRmw),
    tmpRename: firstBool(nested.tmpRename, src.tmpRename),
    torn: firstBool(nested.torn, src.torn),
    truncate: firstBool(nested.truncate, src.truncate),
    staleTail: firstBool(nested.staleTail, src.staleTail),
    lostUpdate: firstBool(nested.lostUpdate, src.lostUpdate),
    permissionsDrop: firstBool(nested.permissionsDrop, src.permissionsDrop),
    hooksDrop: firstBool(nested.hooksDrop, src.hooksDrop),
    hasClearRepro: firstBool(nested.hasClearRepro, src.hasClearRepro),
    concurrentSessions: firstNum(
      nested.concurrentSessions,
      src.concurrentSessions,
    ),
    tornRate: firstText(nested.tornRate, src.tornRate),
    foilShape: firstText(nested.foilShape, src.foilShape),
    platform: firstText(nested.platform, src.platform),
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
    row.atomicWrite == null &&
    row.lockedRmw == null &&
    row.unlockedRmw == null &&
    row.tmpRename == null &&
    row.torn == null &&
    row.truncate == null &&
    row.staleTail == null &&
    row.lostUpdate == null &&
    row.permissionsDrop == null &&
    row.hooksDrop == null
  );
}

const SEED_FNS = {
  [IDLE_WORD]: seedSwaged,
  [SEEDED_WORD]: seedTorn,
  truncate: seedTruncate,
  "stale-tail": seedStaleTail,
  "lost-update": seedLostUpdate,
  "permissions-drop": seedPermissionsDrop,
  "hooks-drop": seedHooksDrop,
  "has-clear-repro": seedHasClearRepro,
  hold: seedHold,
  cousin: seedCousin,
  79403: seedCousin,
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
    return { ...seedTorn(), ...cloned, ...raw };
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
    ticket.foilShape,
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

export function isSwaged(ticket) {
  const row = cloneTicket(ticket);
  if (row.isolation === "cousin") return true;
  if (canonicalSeed(row.seed) === IDLE_WORD) return true;
  if (canonicalSeed(row.seed) === "hold") return true;
  if (
    row.atomicWrite === true &&
    row.tmpRename === true &&
    row.torn !== true &&
    row.unlockedRmw !== true
  ) {
    return true;
  }
  return false;
}

export function isTorn(ticket) {
  const row = cloneTicket(ticket);
  const named = canonicalSeed(row.seed);
  if (named === IDLE_WORD || named === "hold") return false;
  if (COUSINS.includes(row.issue) && named !== SEEDED_WORD) return false;
  if (named === SEEDED_WORD) return true;
  if (row.issue === FEATURED_ISSUE && named !== IDLE_WORD) return true;
  if (
    row.torn === true ||
    row.unlockedRmw === true ||
    (row.truncate === true && row.staleTail === true) ||
    (row.lostUpdate === true && row.tmpRename === false)
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
      /cousin-not-primary|#79403|#82167|#76749|#2810|#78764/i.test(text)) &&
    named !== SEEDED_WORD &&
    row.issue !== FEATURED_ISSUE;
  const tornNow = !cousinOnly && isTorn(row);
  const swagedNow = !tornNow && isSwaged(row);
  const truncate =
    row.truncate === true ||
    named === "truncate" ||
    /truncate|0-byte|mid-truncate|O_TRUNC/i.test(text);
  const staleTail =
    row.staleTail === true ||
    named === "stale-tail" ||
    /stale-tail|stale trailing|stale tail/i.test(text);
  const lostUpdate =
    row.lostUpdate === true ||
    named === "lost-update" ||
    /lost-update|later write wins|discards the other session/i.test(text);
  const permissionsDrop =
    row.permissionsDrop === true ||
    named === "permissions-drop" ||
    /permissions-drop|drops permissions/i.test(text);
  const hooksDrop =
    row.hooksDrop === true ||
    named === "hooks-drop" ||
    /hooks-drop|drops hooks/i.test(text);
  const hasClearRepro =
    row.hasClearRepro === true ||
    named === "has-clear-repro" ||
    /has-clear-repro|Lukasmolvaer|has repro|area:core|platform:wsl/i.test(text);
  const torn =
    named !== IDLE_WORD &&
    named !== "hold" &&
    !cousinOnly &&
    (tornNow || named === SEEDED_WORD || /torn|#91520/i.test(text));
  const swaged =
    named === IDLE_WORD || named === "hold" || (swagedNow && !torn);
  return {
    named,
    cousinOnly,
    tornNow,
    swagedNow,
    truncate,
    staleTail,
    lostUpdate,
    permissionsDrop,
    hooksDrop,
    hasClearRepro,
    torn,
    swaged,
  };
}

export function chipsOf(ticket) {
  const flags = flagsOf(ticket);
  const chips = [];
  if (flags.swaged && !flags.torn) chips.push("swaged");
  if (flags.torn) chips.push("torn");
  if (flags.truncate && flags.torn) chips.push("truncate");
  if (flags.staleTail && flags.torn) chips.push("stale-tail");
  if (flags.lostUpdate && flags.torn) chips.push("lost-update");
  if (flags.permissionsDrop && flags.torn) chips.push("permissions-drop");
  if (flags.hooksDrop && flags.torn) chips.push("hooks-drop");
  if (flags.hasClearRepro && flags.torn) chips.push("has-clear-repro");
  if ((flags.swaged || flags.named === "hold") && !flags.torn) {
    chips.push("hold");
  }
  if (ticket.seed && VERDICTS.includes(ticket.seed)) chips.push(ticket.seed);
  return [...new Set(chips)];
}

function reasonsOf(ticket, flags, verdict) {
  const reasons = [];
  if (verdict === "swaged") {
    reasons.push(
      "swaged; writeUserSettingsAndPush uses tmp+rename + lock; concurrent sessions cannot tear settings.json",
    );
    reasons.push("hold: the crimp is an atomic join; idle word swaged");
  }
  if (verdict === "hold") {
    reasons.push(
      "hold; writeUserSettingsAndPush uses tmp+rename + lock; the crimp holds",
    );
  }
  if (verdict === "torn" || flags.torn) {
    reasons.push(
      "torn; #91520; unlocked non-atomic RMW; 0-byte mid-truncate OR valid JSON + stale trailing bytes; later writer discards other session's keys",
    );
  }
  if (flags.truncate || verdict === "truncate") {
    reasons.push(
      "truncate; 0-byte mid-truncate between open(O_TRUNC) and write; settings.json.corrupt.20260830T211332 is 0 B",
    );
  }
  if (flags.staleTail || verdict === "stale-tail") {
    reasons.push(
      "stale-tail; valid JSON + stale trailing bytes; 293 x 313-byte tail under load; banked 131 B / 10-byte stale tail",
    );
  }
  if (flags.lostUpdate || verdict === "lost-update") {
    reasons.push(
      "lost-update; two sessions each read, mutate and write; the later write wins and silently discards the other session's keys",
    );
  }
  if (flags.permissionsDrop || verdict === "permissions-drop") {
    reasons.push(
      "permissions-drop; Settings file is not valid JSON → fallback to defaults → silently drops permissions behind a dismissable banner",
    );
  }
  if (flags.hooksDrop || verdict === "hooks-drop") {
    reasons.push(
      "hooks-drop; Settings file is not valid JSON → fallback to defaults → silently drops hooks behind a dismissable banner",
    );
  }
  if (flags.hasClearRepro || verdict === "has-clear-repro") {
    reasons.push(
      `has-clear-repro; ${REPORTER} filed #${FEATURED_ISSUE}; has repro; CLI ${VERSION}; VS Code ${EXTENSION_RANGE}; ${PLATFORM}; 1.3% torn; area:core; platform:vscode; platform:wsl`,
    );
  }
  if (flags.cousinOnly) {
    reasons.push(
      "cousin is not Crimp; cite-only #79403 VS Code model toggle corrupts settings / #82167 #76749 lost update / stale in-memory config / #2810 / #78764 impact — not the #91520 unlocked non-atomic RMW tear",
    );
  }
  if (verdict === "torn" || flags.torn) {
    reasons.push(HYPOTHESIS_NOTE);
    reasons.push(CONTRAST_NOTE);
  }
  if (verdict !== "swaged" && verdict !== "hold") {
    reasons.push(PHRASE);
  }
  return reasons;
}

function pickVerdict(seed, flags) {
  const named = canonicalSeed(seed);
  if (named === IDLE_WORD && (flags.swaged || !flags.torn)) return "swaged";
  if (named === "hold" && !flags.torn) return "hold";
  if (named === SEEDED_WORD) return "torn";
  if (VERDICTS.includes(named) && named !== IDLE_WORD && named !== "hold") {
    return named;
  }
  if (flags.cousinOnly) return "swaged";
  if (flags.torn) return "torn";
  if (flags.swaged) return "swaged";
  return "swaged";
}

function benchOf(flags, ticket, verdict) {
  if (verdict === "torn" || flags.torn) {
    return {
      case: "torn — unlocked non-atomic RMW; sheared foil",
      jaw: "writeUserSettingsAndPush read → mutate → writeFile; no lock; no tmp+rename",
      shear: "0-byte mid-truncate OR valid JSON + stale trailing bytes",
      drop: "later writer discards other session's keys; permissions and hooks fall back to defaults",
      mark: "crimp torn; admit the settings already tore",
      note: PHRASE,
    };
  }
  if (verdict === "hold") {
    return {
      case: "swaged — atomic hold; tmp+rename + lock",
      jaw: "write-to-sibling then rename(2) over the target",
      shear: "a reader sees the old file or the new one, never a torn one",
      drop: "advisory lock across the RMW so concurrent sessions cannot clobber keys",
      mark: "crimp swaged; the join holds",
      note: "Hold: the crimp is swaged.",
    };
  }
  return {
    case: "swaged — atomic hold; tmp+rename + lock",
    jaw: "writeUserSettingsAndPush writes a sibling then rename(2)",
    shear: "no mid-truncate window; no stale tail",
    drop: "concurrent pliers cannot shear the foil",
    mark: "crimp swaged; idle word swaged",
    note: "Swaged: the crimp holds.",
  };
}

export function analyze(input) {
  const ticket = normalize(input);
  const flags = flagsOf(ticket);
  const chips = chipsOf(ticket);
  const seed = String(ticket.seed || "");
  const verdict = pickVerdict(seed, flags);
  const hold = HOLD_VERDICTS.includes(verdict);
  const torn = verdict === "torn" || flags.torn;
  return {
    verdict,
    chips,
    reasons: reasonsOf(ticket, flags, verdict),
    swaged: verdict === "swaged" || (flags.swaged && !torn),
    torn,
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
  if (name === SEEDED_WORD || name === 91520 || name === "91520") {
    return analyze(seedTorn());
  }
  if (name === "truncate") return analyze(seedTruncate());
  if (name === "stale-tail") return analyze(seedStaleTail());
  if (name === "lost-update") return analyze(seedLostUpdate());
  if (name === "permissions-drop") return analyze(seedPermissionsDrop());
  if (name === "hooks-drop") return analyze(seedHooksDrop());
  if (name === "has-clear-repro") return analyze(seedHasClearRepro());
  if (name === "hold") return analyze(seedHold());
  if (name === IDLE_WORD || name === "swaged" || name === "open") {
    return analyze(seedSwaged());
  }
  if (
    name === 79403 ||
    name === "79403" ||
    name === "cousin" ||
    name === 82167 ||
    name === "82167" ||
    name === 76749 ||
    name === "76749" ||
    name === 2810 ||
    name === "2810"
  ) {
    return analyze(seedCousin());
  }
  if (SEED_FNS[name]) return analyze(SEED_FNS[name]());
  return analyze(seedSwaged());
}

export function handle(input) {
  const result = analyze(input);
  return {
    ...result,
    hookSpecificOutput: {
      additionalContext:
        result.verdict === "torn" || (result.torn && result.alarm)
          ? `torn crimp #${FEATURED_ISSUE}: unlocked non-atomic RMW; concurrent sessions tear settings.json and silently drop keys. ${HYPOTHESIS_NOTE}`
          : result.verdict === "hold"
            ? "hold. writeUserSettingsAndPush uses tmp+rename + lock. Score the swage."
            : `swaged crimp. Idle word ${IDLE_WORD}. writeUserSettingsAndPush uses tmp+rename + lock; concurrent sessions cannot tear settings.json.`,
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
