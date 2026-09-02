#!/usr/bin/env node
/**
 * Coffer — vault-coffer / strongroom-ledger classifier.
 * A refresh key that is never restamped into the ledger
 * is not a sealed vault — it is a till that blanks itself
 * on the next cash-out. Score the seal or admit the store
 * already voided.
 *
 *   echo '{"blanked":true,"staleHorizon":true}' | node coffer.mjs
 *   node coffer.mjs ticket.json
 *
 * Idle word is sealed (HOLD: rotated refresh tokens are
 * restamped into %USERPROFILE%\.claude\.credentials.json;
 * a fresh process inherits a live key). Seeded state is
 * blanked / #91571 (Windows file-store never updated with
 * rotated refresh tokens; refreshTokenExpiresAt stays at
 * login+~24h; a failed refresh rewrites empty accessToken
 * / refreshToken and locks out every subsequent fresh
 * process; live sessions keep working in memory).
 *
 * This is a diagnostic scoring desk. NOT an exploit.
 * No payloads. No attack procedures. No real credentials.
 * Score fixture strings for whether the Windows file store
 * is sealed / restamped or blanked / voided.
 *
 * Primary #91571: Windows: refresh-token rotation not
 * persisted to .credentials.json; failed refresh blanks
 * the store, locking out all fresh processes (2.1.220).
 * Reporter peterzirkle-cmyk. Filed 2026-09-02T18:31:43Z.
 * OPEN. Labels: bug, has repro, platform:windows, area:auth.
 *
 * Hypothesis only (NON-BINDING): persist rotated refresh
 * tokens to the Windows file store atomically, and never
 * blank the store on a single failed refresh without a
 * visible recovery path; discard if issue evidence disagrees.
 */

import { readFileSync } from "node:fs";
import { stdin } from "node:process";
import { pathToFileURL } from "node:url";

export const VERDICTS = Object.freeze([
  "sealed",
  "restamped",
  "blanked",
  "voided",
  "stale-refresh-horizon",
  "empty-token-rewrite",
  "lockout-all-fresh",
  "live-session-ok-memory",
  "headless-scheduled-print",
  "windows-file-store",
  "no-keychain",
  "has-clear-repro",
  "hold",
]);
export const IDLE_WORD = "sealed";
export const SEEDED_WORD = "blanked";
export const HOLD_VERDICTS = Object.freeze(["sealed", "restamped", "hold"]);
export const ALARM_VERDICTS = Object.freeze(
  VERDICTS.filter((name) => !HOLD_VERDICTS.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FEATURED_ISSUE = 91571;
export const PRIMARY_ISSUES = Object.freeze([91571]);
export const COUSINS = Object.freeze([
  83464, 68398, 88054, 91158, 90010, 88124, 91436, 88583, 90688, 89490, 43392,
  90860,
]);
export const COUSIN_ISSUE = 83464;
export const BACKUPS = Object.freeze([
  { name: "Solecism", issue: 91558 },
  { name: "Buoy", issue: 91569 },
]);
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/91571";
export const TITLE =
  "Windows: refresh-token rotation not persisted to .credentials.json; failed refresh blanks the store, locking out all fresh processes (2.1.220)";
export const FILED_AT = "2026-09-02T18:31:43Z";
export const UPDATED_AT = "2026-09-02T18:32:59Z";
export const LABELS = Object.freeze([
  "bug",
  "has repro",
  "platform:windows",
  "area:auth",
]);
export const REPORTER = "peterzirkle-cmyk";
export const VERSION = "2.1.220";
export const PLATFORM = "Windows 11 Pro";
export const STORE_PATH = "%USERPROFILE%\\.claude\\.credentials.json";
export const AREA = "area:auth";
export const EVIDENCE = "windows-oauth-file-store-never-restamped";
export const LOGIN_AT = "2026-08-31T16:49";
export const HORIZON_AT = "2026-09-01T16:49";
export const BLANKED_AT = "2026-09-02T00:05:04";
export const HEADLESS_401_AT = "2026-09-02T00:05:10";
export const LIVE_SESSION_HOURS = "40+";
export const CONCURRENT_SESSIONS = "2-3";
export const HUB_LINE =
  "04:50 coffer: a coffer that never restamps the refresh key into the ledger is not a sealed vault — it is a till that blanks itself on the next cash-out. Score the seal or admit the store already voided.";
export const MARK = "04:50 / hermes catalog #127 / #91571";
export const PHRASE =
  "a refresh key that is never restamped into the ledger is not a sealed vault — it is a till that blanks itself on the next cash-out. Score the seal or admit the store already voided.";
export const HYPOTHESIS_NOTE =
  "NON-BINDING: persist rotated refresh tokens to the Windows file store atomically, and never blank the store on a single failed refresh without a visible recovery path; discard if issue evidence disagrees.";
export const CONTRAST_NOTE =
  "This is WINDOWS OAUTH FILE-STORE REFRESH ROTATION NEVER PERSISTED; FAILED REFRESH BLANKS TOKENS; LOCKS OUT ALL FRESH PROCESSES; AREA:AUTH; PLATFORM:WINDOWS. On Windows, long-running interactive Claude Code sessions stay healthy while on-disk %USERPROFILE%\\.claude\\.credentials.json is NEVER updated with rotated refresh tokens (refreshTokenExpiresAt stays at login+~24h). When a fresh headless process (claude --print from a scheduled task, same user) starts after that horizon, auth fails AND the CLI rewrites .credentials.json with empty accessToken/refreshToken (expiresAt: 0), locking out EVERY subsequent fresh process until manual claude auth login. Live sessions keep working in memory; the disk store is silently poisoned. Claude Code 2.1.220 native install; Windows 11 Pro always-on (no sleep/wake); OAuth file store only (no API key, no keychain/Credential Manager). 2-3 concurrent interactive sessions plus one nightly headless claude --print. Timeline: Aug 31 ~16:49 last login; Sep 1 16:49 refreshTokenExpiresAt horizon; Sep 2 00:05:04 empty-token rewrite; Sep 2 00:05:10 scheduled --print 401. One live session ran 40+ hours. Reporter peterzirkle-cmyk. Filed 2026-09-02. OPEN, has repro, platform:windows, area:auth.";
export const FORBIDDEN_IDLE = Object.freeze([
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
  "Cormorant Garamond",
  "Figtree",
  "Azeret Mono",
  "Newsreader",
  "Manrope",
  "JetBrains Mono",
  "Public Sans",
  "Brygada 1918",
  "Atkinson Hyperlegible",
  "DM Mono",
  "Fraunces",
  "Source Sans 3",
]);
export const NOT_PRODUCTS = Object.freeze([
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
    persistRefresh: null,
    restamped: null,
    sealed: null,
    staleHorizon: null,
    emptyTokenRewrite: null,
    blanked: null,
    lockoutAllFresh: null,
    voided: null,
    liveSessionOkMemory: null,
    headlessScheduledPrint: null,
    windowsFileStore: null,
    noKeychain: null,
    hasClearRepro: null,
    refreshTokenExpiresAt: "",
    accessTokenPresent: null,
    refreshTokenPresent: null,
    expiresAt: "",
    loginAt: "",
    blankedAt: "",
    headlessAt: "",
    liveSessionHours: "",
    concurrentSessions: "",
    storePath: "",
    platform: "",
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
    persistRefresh: true,
    restamped: true,
    sealed: true,
    staleHorizon: false,
    emptyTokenRewrite: false,
    blanked: false,
    lockoutAllFresh: false,
    voided: false,
    liveSessionOkMemory: false,
    headlessScheduledPrint: false,
    windowsFileStore: true,
    noKeychain: true,
    hasClearRepro: false,
    refreshTokenExpiresAt: "restamped",
    accessTokenPresent: true,
    refreshTokenPresent: true,
    expiresAt: "future",
    loginAt: LOGIN_AT,
    storePath: STORE_PATH,
    platform: PLATFORM,
    area: AREA,
    evidence: EVIDENCE,
    cliVersion: VERSION,
    outputText:
      "sealed; rotated refresh tokens restamped into .credentials.json; a fresh process inherits a live key; idle word sealed",
  };
}

export function seedRestamped() {
  return {
    ...seedSealed(),
    seed: "restamped",
    outputText:
      "restamped; refreshTokenExpiresAt written back after rotation; the coffer holds; idle word sealed",
  };
}

export function seedBlanked() {
  return {
    ...blankTicket(),
    seed: SEEDED_WORD,
    issue: FEATURED_ISSUE,
    title: TITLE,
    url: ISSUE_URL,
    source: "atelier",
    persistRefresh: false,
    restamped: false,
    sealed: false,
    staleHorizon: true,
    emptyTokenRewrite: true,
    blanked: true,
    lockoutAllFresh: true,
    voided: true,
    liveSessionOkMemory: true,
    headlessScheduledPrint: true,
    windowsFileStore: true,
    noKeychain: true,
    hasClearRepro: true,
    refreshTokenExpiresAt: HORIZON_AT,
    accessTokenPresent: false,
    refreshTokenPresent: false,
    expiresAt: "0",
    loginAt: LOGIN_AT,
    blankedAt: BLANKED_AT,
    headlessAt: HEADLESS_401_AT,
    liveSessionHours: LIVE_SESSION_HOURS,
    concurrentSessions: CONCURRENT_SESSIONS,
    storePath: STORE_PATH,
    platform: PLATFORM,
    area: AREA,
    evidence: EVIDENCE,
    cliVersion: VERSION,
    reporter: REPORTER,
    outputText:
      "blanked; #91571; Windows file-store never restamped rotated refresh tokens; refreshTokenExpiresAt stayed at login+~24h; failed refresh rewrote empty accessToken/refreshToken (expiresAt: 0); lockout all fresh processes; live sessions ok in memory; claude --print scheduled task 401; peterzirkle-cmyk; Claude Code 2.1.220; Windows 11 Pro; no keychain; area:auth",
  };
}

export function seedVoided() {
  return {
    ...blankTicket(),
    seed: "voided",
    source: "atelier",
    voided: true,
    lockoutAllFresh: true,
    blanked: true,
    emptyTokenRewrite: true,
    outputText:
      "voided; empty-token rewrite locks out every subsequent fresh process until manual claude auth login",
  };
}

export function seedStaleRefreshHorizon() {
  return {
    ...blankTicket(),
    seed: "stale-refresh-horizon",
    source: "atelier",
    staleHorizon: true,
    persistRefresh: false,
    restamped: false,
    refreshTokenExpiresAt: HORIZON_AT,
    outputText:
      "stale-refresh-horizon; refreshTokenExpiresAt stayed at last login + ~24h; on-disk file never rewritten while live sessions refreshed in memory",
  };
}

export function seedEmptyTokenRewrite() {
  return {
    ...blankTicket(),
    seed: "empty-token-rewrite",
    source: "atelier",
    emptyTokenRewrite: true,
    blanked: true,
    accessTokenPresent: false,
    refreshTokenPresent: false,
    expiresAt: "0",
    outputText:
      "empty-token-rewrite; CLI rewrote .credentials.json with empty accessToken/refreshToken and expiresAt: 0; other fields retained",
  };
}

export function seedLockoutAllFresh() {
  return {
    ...blankTicket(),
    seed: "lockout-all-fresh",
    source: "atelier",
    lockoutAllFresh: true,
    voided: true,
    outputText:
      "lockout-all-fresh; every subsequent fresh process unable to authenticate until manual claude auth login",
  };
}

export function seedLiveSessionOkMemory() {
  return {
    ...blankTicket(),
    seed: "live-session-ok-memory",
    source: "atelier",
    liveSessionOkMemory: true,
    liveSessionHours: LIVE_SESSION_HOURS,
    outputText:
      "live-session-ok-memory; long-running interactive sessions from before the horizon continued working (one ran 40+ hours) on in-memory tokens",
  };
}

export function seedHeadlessScheduledPrint() {
  return {
    ...blankTicket(),
    seed: "headless-scheduled-print",
    source: "atelier",
    headlessScheduledPrint: true,
    headlessAt: HEADLESS_401_AT,
    outputText:
      "headless-scheduled-print; nightly claude --print scheduled task under the same user logged 401 on every model at 00:05:10",
  };
}

export function seedWindowsFileStore() {
  return {
    ...blankTicket(),
    seed: "windows-file-store",
    source: "atelier",
    windowsFileStore: true,
    storePath: STORE_PATH,
    platform: PLATFORM,
    outputText:
      "windows-file-store; OAuth tokens live only in %USERPROFILE%\\.claude\\.credentials.json on Windows 11 Pro",
  };
}

export function seedNoKeychain() {
  return {
    ...blankTicket(),
    seed: "no-keychain",
    source: "atelier",
    noKeychain: true,
    windowsFileStore: true,
    outputText:
      "no-keychain; no API key; no keychain / Credential Manager entries — file store only",
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
      "has-clear-repro; peterzirkle-cmyk filed #91571; has repro; platform:windows; area:auth; Claude Code 2.1.220; Windows 11 Pro; file-store timeline from login through blanked rewrite",
  };
}

export function seedHold() {
  return {
    ...seedSealed(),
    seed: "hold",
    outputText:
      "hold; rotated refresh tokens restamped into the Windows file store; the coffer holds; idle word sealed",
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
      "cousin-not-primary; #83464 clears OAuth before refreshTokenExpiresAt — cite only, not the #91571 Windows file-store never-restamped blank",
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
    persistRefresh: firstBool(nested.persistRefresh, src.persistRefresh),
    restamped: firstBool(nested.restamped, src.restamped),
    sealed: firstBool(nested.sealed, src.sealed),
    staleHorizon: firstBool(nested.staleHorizon, src.staleHorizon),
    emptyTokenRewrite: firstBool(nested.emptyTokenRewrite, src.emptyTokenRewrite),
    blanked: firstBool(nested.blanked, src.blanked),
    lockoutAllFresh: firstBool(nested.lockoutAllFresh, src.lockoutAllFresh),
    voided: firstBool(nested.voided, src.voided),
    liveSessionOkMemory: firstBool(
      nested.liveSessionOkMemory,
      src.liveSessionOkMemory,
    ),
    headlessScheduledPrint: firstBool(
      nested.headlessScheduledPrint,
      src.headlessScheduledPrint,
    ),
    windowsFileStore: firstBool(nested.windowsFileStore, src.windowsFileStore),
    noKeychain: firstBool(nested.noKeychain, src.noKeychain),
    hasClearRepro: firstBool(nested.hasClearRepro, src.hasClearRepro),
    refreshTokenExpiresAt: firstText(
      nested.refreshTokenExpiresAt,
      src.refreshTokenExpiresAt,
    ),
    accessTokenPresent: firstBool(
      nested.accessTokenPresent,
      src.accessTokenPresent,
    ),
    refreshTokenPresent: firstBool(
      nested.refreshTokenPresent,
      src.refreshTokenPresent,
    ),
    expiresAt: firstText(nested.expiresAt, src.expiresAt),
    loginAt: firstText(nested.loginAt, src.loginAt),
    blankedAt: firstText(nested.blankedAt, src.blankedAt),
    headlessAt: firstText(nested.headlessAt, src.headlessAt),
    liveSessionHours: firstText(nested.liveSessionHours, src.liveSessionHours),
    concurrentSessions: firstText(
      nested.concurrentSessions,
      src.concurrentSessions,
    ),
    storePath: firstText(nested.storePath, src.storePath),
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
    row.persistRefresh == null &&
    row.restamped == null &&
    row.sealed == null &&
    row.staleHorizon == null &&
    row.emptyTokenRewrite == null &&
    row.blanked == null &&
    row.lockoutAllFresh == null &&
    row.voided == null &&
    row.liveSessionOkMemory == null &&
    row.headlessScheduledPrint == null
  );
}

const SEED_FNS = {
  [IDLE_WORD]: seedSealed,
  restamped: seedRestamped,
  [SEEDED_WORD]: seedBlanked,
  voided: seedVoided,
  "stale-refresh-horizon": seedStaleRefreshHorizon,
  "empty-token-rewrite": seedEmptyTokenRewrite,
  "lockout-all-fresh": seedLockoutAllFresh,
  "live-session-ok-memory": seedLiveSessionOkMemory,
  "headless-scheduled-print": seedHeadlessScheduledPrint,
  "windows-file-store": seedWindowsFileStore,
  "no-keychain": seedNoKeychain,
  "has-clear-repro": seedHasClearRepro,
  hold: seedHold,
  cousin: seedCousin,
  83464: seedCousin,
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
    return { ...seedBlanked(), ...cloned, ...raw };
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
    ticket.refreshTokenExpiresAt,
    ticket.platform,
    ticket.area,
    ticket.evidence,
    ticket.storePath,
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
  if (canonicalSeed(row.seed) === "restamped") return true;
  if (
    row.persistRefresh === true &&
    row.blanked !== true &&
    row.emptyTokenRewrite !== true &&
    row.staleHorizon !== true
  ) {
    return true;
  }
  return false;
}

export function isBlanked(ticket) {
  const row = cloneTicket(ticket);
  const named = canonicalSeed(row.seed);
  if (named === IDLE_WORD || named === "hold" || named === "restamped") {
    return false;
  }
  if (COUSINS.includes(row.issue) && named !== SEEDED_WORD) return false;
  if (named === SEEDED_WORD) return true;
  if (row.issue === FEATURED_ISSUE && named !== IDLE_WORD) return true;
  if (
    row.blanked === true ||
    row.emptyTokenRewrite === true ||
    (row.staleHorizon === true && row.persistRefresh === false) ||
    (row.voided === true && row.lockoutAllFresh === true)
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
      /cousin-not-primary|#83464|#68398|#88054|#91158|#90010|#88124|#91436|#88583|#90688|#89490|#43392|#90860/i.test(
        text,
      )) &&
    named !== SEEDED_WORD &&
    row.issue !== FEATURED_ISSUE;
  const blankedNow = !cousinOnly && isBlanked(row);
  const sealedNow = !blankedNow && isSealed(row);
  const staleHorizon =
    row.staleHorizon === true ||
    named === "stale-refresh-horizon" ||
    /stale-refresh-horizon|login\+~24h|never restamped|never rewritten/i.test(text);
  const emptyTokenRewrite =
    row.emptyTokenRewrite === true ||
    named === "empty-token-rewrite" ||
    /empty-token-rewrite|empty accessToken|empty refreshToken|expiresAt: 0/i.test(
      text,
    );
  const lockoutAllFresh =
    row.lockoutAllFresh === true ||
    named === "lockout-all-fresh" ||
    /lockout-all-fresh|locks out|every subsequent fresh/i.test(text);
  const liveSessionOkMemory =
    row.liveSessionOkMemory === true ||
    named === "live-session-ok-memory" ||
    /live-session-ok-memory|40\+ hours|in memory/i.test(text);
  const headlessScheduledPrint =
    row.headlessScheduledPrint === true ||
    named === "headless-scheduled-print" ||
    /headless-scheduled-print|claude --print|scheduled task/i.test(text);
  const windowsFileStore =
    row.windowsFileStore === true ||
    named === "windows-file-store" ||
    /windows-file-store|\.credentials\.json|USERPROFILE/i.test(text);
  const noKeychain =
    row.noKeychain === true ||
    named === "no-keychain" ||
    /no-keychain|no keychain|Credential Manager/i.test(text);
  const hasClearRepro =
    row.hasClearRepro === true ||
    named === "has-clear-repro" ||
    /has-clear-repro|peterzirkle-cmyk|has repro|platform:windows/i.test(text);
  const voided =
    named !== IDLE_WORD &&
    named !== "hold" &&
    named !== "restamped" &&
    !cousinOnly &&
    (row.voided === true ||
      named === "voided" ||
      lockoutAllFresh ||
      /voided|store already voided/i.test(text));
  const blanked =
    named !== IDLE_WORD &&
    named !== "hold" &&
    named !== "restamped" &&
    !cousinOnly &&
    (blankedNow || named === SEEDED_WORD || /blanked|#91571/i.test(text));
  const restamped =
    named === "restamped" ||
    (row.restamped === true && !blanked && !voided);
  const sealed =
    named === IDLE_WORD ||
    named === "hold" ||
    (sealedNow && !blanked && !voided);
  return {
    named,
    cousinOnly,
    blankedNow,
    sealedNow,
    staleHorizon,
    emptyTokenRewrite,
    lockoutAllFresh,
    liveSessionOkMemory,
    headlessScheduledPrint,
    windowsFileStore,
    noKeychain,
    hasClearRepro,
    voided,
    blanked,
    restamped,
    sealed,
  };
}

export function chipsOf(ticket) {
  const flags = flagsOf(ticket);
  const chips = [];
  if (flags.sealed && !flags.blanked) chips.push("sealed");
  if (flags.restamped && !flags.blanked) chips.push("restamped");
  if (flags.blanked) chips.push("blanked");
  if (flags.voided && flags.blanked) chips.push("voided");
  if (flags.staleHorizon && flags.blanked) chips.push("stale-refresh-horizon");
  if (flags.emptyTokenRewrite && flags.blanked) chips.push("empty-token-rewrite");
  if (flags.lockoutAllFresh && flags.blanked) chips.push("lockout-all-fresh");
  if (flags.liveSessionOkMemory && flags.blanked) {
    chips.push("live-session-ok-memory");
  }
  if (flags.headlessScheduledPrint && flags.blanked) {
    chips.push("headless-scheduled-print");
  }
  if (flags.windowsFileStore && flags.blanked) chips.push("windows-file-store");
  if (flags.noKeychain && flags.blanked) chips.push("no-keychain");
  if (flags.hasClearRepro && flags.blanked) chips.push("has-clear-repro");
  if (
    (flags.sealed || flags.restamped || flags.named === "hold") &&
    !flags.blanked
  ) {
    chips.push("hold");
  }
  if (ticket.seed && VERDICTS.includes(ticket.seed)) chips.push(ticket.seed);
  return [...new Set(chips)];
}

function reasonsOf(ticket, flags, verdict) {
  const reasons = [];
  if (verdict === "sealed") {
    reasons.push(
      "sealed; rotated refresh tokens restamped into .credentials.json; a fresh process inherits a live key",
    );
    reasons.push("hold: the coffer is a sealed vault; idle word sealed");
  }
  if (verdict === "restamped") {
    reasons.push(
      "restamped; refreshTokenExpiresAt written back after rotation; the coffer holds",
    );
  }
  if (verdict === "hold") {
    reasons.push(
      "hold; rotated refresh tokens restamped into the Windows file store; the coffer holds",
    );
  }
  if (verdict === "blanked" || flags.blanked) {
    reasons.push(
      "blanked; #91571; Windows file-store never restamped rotated refresh tokens; failed refresh rewrote empty tokens",
    );
  }
  if (flags.voided || verdict === "voided") {
    reasons.push(
      "voided; empty-token rewrite locks out every subsequent fresh process until manual claude auth login",
    );
  }
  if (flags.staleHorizon || verdict === "stale-refresh-horizon") {
    reasons.push(
      "stale-refresh-horizon; refreshTokenExpiresAt stayed at last login + ~24h; on-disk file never rewritten",
    );
  }
  if (flags.emptyTokenRewrite || verdict === "empty-token-rewrite") {
    reasons.push(
      "empty-token-rewrite; CLI rewrote .credentials.json with empty accessToken/refreshToken and expiresAt: 0",
    );
  }
  if (flags.lockoutAllFresh || verdict === "lockout-all-fresh") {
    reasons.push(
      "lockout-all-fresh; every subsequent fresh process unable to authenticate until manual claude auth login",
    );
  }
  if (flags.liveSessionOkMemory || verdict === "live-session-ok-memory") {
    reasons.push(
      "live-session-ok-memory; long-running interactive sessions continued working in memory (one ran 40+ hours)",
    );
  }
  if (flags.headlessScheduledPrint || verdict === "headless-scheduled-print") {
    reasons.push(
      "headless-scheduled-print; nightly claude --print scheduled task logged 401 on every model at 00:05:10",
    );
  }
  if (flags.windowsFileStore || verdict === "windows-file-store") {
    reasons.push(
      `windows-file-store; OAuth tokens live only in ${STORE_PATH} on ${PLATFORM}`,
    );
  }
  if (flags.noKeychain || verdict === "no-keychain") {
    reasons.push(
      "no-keychain; no API key; no keychain / Credential Manager entries — file store only",
    );
  }
  if (flags.hasClearRepro || verdict === "has-clear-repro") {
    reasons.push(
      `has-clear-repro; ${REPORTER} filed #${FEATURED_ISSUE}; has repro; CLI ${VERSION}; ${PLATFORM}; platform:windows; area:auth`,
    );
  }
  if (flags.cousinOnly) {
    reasons.push(
      "cousin is not Coffer; cite-only #83464 clears OAuth before refreshTokenExpiresAt / #68398 Windows refresh unused / #88054 remote-control 401 at 24h / #91158 plaintext refresh / #90010 security-guidance echoes tokens / #88124 Windows auto-update relogin / #91436 VS Code idle logout / #88583 Keychain wipe / #90688 wake 400 / #89490 mid-session expire / #43392 MCP race / #90860 Desktop 24h — not the #91571 Windows file-store never-restamped blank",
    );
  }
  if (verdict === "blanked" || flags.blanked) {
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
  if (named === IDLE_WORD && (flags.sealed || !flags.blanked)) return "sealed";
  if (named === "restamped" && !flags.blanked) return "restamped";
  if (named === "hold" && !flags.blanked) return "hold";
  if (named === SEEDED_WORD) return "blanked";
  if (VERDICTS.includes(named) && !HOLD_VERDICTS.includes(named)) {
    return named;
  }
  if (flags.cousinOnly) return "sealed";
  if (flags.blanked) return "blanked";
  if (flags.sealed) return "sealed";
  return "sealed";
}

function vaultOf(flags, ticket, verdict) {
  if (verdict === "blanked" || flags.blanked) {
    return {
      case: "blanked — Windows file-store never restamped; till voided",
      ledger: `${STORE_PATH}; refreshTokenExpiresAt stayed at ${HORIZON_AT} (login+~24h)`,
      till: "failed refresh rewrote empty accessToken/refreshToken; expiresAt: 0",
      lockout: "fresh claude --print 401; every subsequent fresh process locked out",
      mark: "coffer blanked; admit the store already voided",
      note: PHRASE,
    };
  }
  if (verdict === "restamped" || verdict === "hold") {
    return {
      case: "restamped — rotation written back to the night-safe ledger",
      ledger: "refreshTokenExpiresAt restamped after each in-memory rotation",
      till: "a failed refresh does not blank the store",
      lockout: "a fresh process inherits the restamped key",
      mark: "coffer restamped; the seal holds",
      note: "Restamped: the coffer holds.",
    };
  }
  return {
    case: "sealed — rotation persisted; night-safe ledger current",
    ledger: "rotated refresh tokens restamped into .credentials.json",
    till: "the till is not blanked; tokens remain present",
    lockout: "scheduled headless --print authenticates from the file store",
    mark: "coffer sealed; idle word sealed",
    note: "Sealed: the coffer holds.",
  };
}

export function analyze(input) {
  const ticket = normalize(input);
  const flags = flagsOf(ticket);
  const chips = chipsOf(ticket);
  const seed = String(ticket.seed || "");
  const verdict = pickVerdict(seed, flags);
  const hold = HOLD_VERDICTS.includes(verdict);
  const blanked = verdict === "blanked" || flags.blanked;
  return {
    verdict,
    chips,
    reasons: reasonsOf(ticket, flags, verdict),
    sealed: verdict === "sealed" || (flags.sealed && !blanked),
    restamped: verdict === "restamped" || (flags.restamped && !blanked),
    blanked,
    voided: flags.voided && blanked,
    hold,
    alarm: !hold,
    idleWord: IDLE_WORD,
    seededWord: SEEDED_WORD,
    flags,
    contrast: vaultOf(flags, ticket, verdict),
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
  if (name === SEEDED_WORD || name === 91571 || name === "91571") {
    return analyze(seedBlanked());
  }
  if (name === "voided") return analyze(seedVoided());
  if (name === "stale-refresh-horizon") {
    return analyze(seedStaleRefreshHorizon());
  }
  if (name === "empty-token-rewrite") return analyze(seedEmptyTokenRewrite());
  if (name === "lockout-all-fresh") return analyze(seedLockoutAllFresh());
  if (name === "live-session-ok-memory") {
    return analyze(seedLiveSessionOkMemory());
  }
  if (name === "headless-scheduled-print") {
    return analyze(seedHeadlessScheduledPrint());
  }
  if (name === "windows-file-store") return analyze(seedWindowsFileStore());
  if (name === "no-keychain") return analyze(seedNoKeychain());
  if (name === "has-clear-repro") return analyze(seedHasClearRepro());
  if (name === "restamped") return analyze(seedRestamped());
  if (name === "hold") return analyze(seedHold());
  if (name === IDLE_WORD || name === "sealed" || name === "open") {
    return analyze(seedSealed());
  }
  if (
    name === "cousin" ||
    name === 83464 ||
    name === "83464" ||
    name === 68398 ||
    name === "68398" ||
    name === 88054 ||
    name === "88054" ||
    name === 91158 ||
    name === "91158" ||
    name === 90010 ||
    name === "90010" ||
    name === 88124 ||
    name === "88124" ||
    name === 91436 ||
    name === "91436" ||
    name === 88583 ||
    name === "88583" ||
    name === 90688 ||
    name === "90688" ||
    name === 89490 ||
    name === "89490" ||
    name === 43392 ||
    name === "43392" ||
    name === 90860 ||
    name === "90860"
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
        result.verdict === "blanked" || (result.blanked && result.alarm)
          ? `blanked coffer #${FEATURED_ISSUE}: Windows file-store never restamped rotated refresh tokens; failed refresh blanks the store. ${HYPOTHESIS_NOTE}`
          : result.verdict === "hold" || result.verdict === "restamped"
            ? "hold. rotated refresh tokens restamped into the Windows file store. Score the seal."
            : `sealed coffer. Idle word ${IDLE_WORD}. rotated refresh tokens restamped into .credentials.json; a fresh process inherits a live key.`,
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
