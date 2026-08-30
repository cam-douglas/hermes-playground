#!/usr/bin/env node
/**
 * Hydra — marble registry-hall scorer.
 * A settings cut that regrows from the
 * known ledger is not a hold.
 * Score both ledgers or admit cauterized.
 *
 *   echo '{"removedFromSettings":true,"presentInKnown":true,"cloneExists":true}' | node hydra.mjs
 *   node hydra.mjs ticket.json
 *
 * Idle word is cauterized.
 * Seeded state is regrown / #90856.
 * NEVER idle as "hydra".
 *
 * Primary #90856: remove a marketplace
 * from settings.json extraKnownMarketplaces.
 * Entry gone. Clone under
 * ~/.claude/plugins/marketplaces/<name>/
 * deleted. ~1 minute later
 * known_marketplaces.json silently
 * re-registers it and recreates the
 * clone. No error. No log. Re-add
 * then says "already added".
 *
 * CAUTERIZED if gone from settings AND
 * known AND clone absent.
 * REGROWN if settings removal is
 * undone by the known ledger.
 *
 * NOT Larder (plugin-store freeze).
 * NOT Deadband (5s settings watcher).
 * NOT Ordo / Limpet / Scion / Almanac.
 */

import { readFileSync } from "node:fs";
import { stdin } from "node:process";
import { pathToFileURL } from "node:url";

export const VERDICTS = Object.freeze([
  "cauterized",
  "regrown",
  "re-cloned",
  "dual-ledger",
  "settings-only",
  "known-authoritative",
  "silent-return",
  "already-added",
  "minute-later",
  "clone-back",
]);
export const IDLE_WORD = "cauterized";
export const SEED_ALIASES = Object.freeze({
  excised: "cauterized",
  lopped: "settings-only",
  dual: "dual-ledger",
  recloned: "re-cloned",
  shadowed: "known-authoritative",
});
export const ALARM_VERDICTS = Object.freeze([
  "regrown",
  "re-cloned",
  "dual-ledger",
  "settings-only",
  "known-authoritative",
  "silent-return",
  "already-added",
  "minute-later",
  "clone-back",
]);
export const HOLD_VERDICTS = Object.freeze(["cauterized"]);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FEATURED_ISSUE = 90856;
export const PRIMARY_ISSUES = Object.freeze([90856]);
export const CORROBORATORS = Object.freeze([83704, 87206, 82064, 77937, 87778, 86428, 87651]);
export const CODEX_CORROBORATORS = Object.freeze([39332, 39421, 32058]);
export const VERSION = "2.1.247";
export const PLATFORM = "macos";
export const OS = "macOS 26.4.1";
export const FILED_AT = "2026-08-30T22:50:05Z";
export const AUTHOR = "adamjsimon";
export const TITLE =
  "Removing a marketplace from settings.json is silently reverted by known_marketplaces.json";
export const LABELS = Object.freeze(["bug", "has repro", "platform:macos", "area:plugins"]);
export const SETTINGS_PATH = "~/.claude/settings.json";
export const SETTINGS_KEY = "extraKnownMarketplaces";
export const KNOWN_PATH = "~/.claude/plugins/known_marketplaces.json";
export const CLONE_PATH = "~/.claude/plugins/marketplaces/<name>/";
export const OBSERVATIONS = Object.freeze([
  { marketplace: "A", removed: "~18:02", reregistered: "18:03" },
  { marketplace: "B", removed: "~18:02", reregistered: "18:03" },
  { marketplace: "C", removed: "18:12", reregistered: "18:17", cloneRecreated: "18:17:36" },
]);

export function emptyTicket() {
  return seedRegrown();
}

export function cloneTicket(input) {
  const src = input && typeof input === "object" && !Array.isArray(input) ? input : {};
  const nested =
    (src.ticket && typeof src.ticket === "object" && src.ticket) ||
    (src.hydra && typeof src.hydra === "object" && src.hydra) ||
    (src.registry && typeof src.registry === "object" && src.registry) ||
    (src.probe && typeof src.probe === "object" && src.probe) ||
    src;
  const settings = nested.settings && typeof nested.settings === "object" ? nested.settings : {};
  const known = nested.known && typeof nested.known === "object" ? nested.known : {};
  const clone = nested.clone && typeof nested.clone === "object" ? nested.clone : {};
  return {
    issue: firstNum(nested.issue, src.issue) ?? FEATURED_ISSUE,
    seed: firstText(nested.seed, src.seed),
    removedFromSettings: firstBool(
      nested.removedFromSettings,
      nested.settingsRemoved,
      settings.removed,
      settings.gone,
    ),
    presentInKnown: firstBool(
      nested.presentInKnown,
      nested.knownPresent,
      known.present,
      known.registered,
    ),
    cloneExists: firstBool(nested.cloneExists, nested.clonePresent, clone.exists, clone.present),
    minutesSinceRemoval: firstNum(
      nested.minutesSinceRemoval,
      nested.minutes,
      nested.waitMinutes,
    ),
    reAddReportsAlreadyAdded: firstBool(
      nested.reAddReportsAlreadyAdded,
      nested.alreadyAdded,
      nested.reAddAlreadyAdded,
    ),
    knownLastUpdated: firstText(
      nested.knownLastUpdated,
      nested.lastUpdated,
      known.lastUpdated,
    ),
    settingsHadEntry: firstBool(
      nested.settingsHadEntry,
      nested.hadEntry,
      settings.hadEntry,
    ),
    settingsOnly: firstBool(nested.settingsOnly, nested.editedSettingsOnly, settings.only),
    silent: firstBool(nested.silent, nested.noError, nested.noLog),
    noError: firstBool(nested.noError, nested.silent),
    noLog: firstBool(nested.noLog, nested.silent),
    version: firstText(nested.version, src.version) || "",
    platform: firstText(nested.platform, src.platform) || "",
    os: firstText(nested.os, src.os) || "",
    desktop: firstBool(nested.desktop, src.desktop),
    marketplace: firstText(nested.marketplace, src.marketplace),
    observations: Array.isArray(nested.observations) ? nested.observations : OBSERVATIONS,
    settings,
    known,
    clone,
  };
}

function firstText(...values) {
  for (const value of values) {
    if (value == null || value === "") continue;
    return String(value);
  }
  return "";
}

function firstNum(...values) {
  for (const value of values) {
    if (value == null || value === "") continue;
    const n = Number(value);
    if (Number.isFinite(n)) return n;
  }
  return null;
}

function firstBool(...values) {
  for (const value of values) {
    if (value === true || value === false) return value;
  }
  return null;
}

export function isExcised(ticket) {
  const row = cloneTicket(ticket);
  return row.removedFromSettings === true && row.presentInKnown !== true && row.cloneExists !== true;
}

export function isRegrownPattern(ticket) {
  const row = cloneTicket(ticket);
  return row.removedFromSettings === true && row.presentInKnown === true && row.cloneExists === true;
}

export function analyze(input) {
  const row = cloneTicket(input);
  const removed = row.removedFromSettings === true;
  const inKnown = row.presentInKnown === true;
  const clone = row.cloneExists === true;
  const hadEntry = row.settingsHadEntry === true || removed;
  const minutes = row.minutesSinceRemoval;
  const alreadyAdded = row.reAddReportsAlreadyAdded === true;
  const settingsOnly = row.settingsOnly === true || (removed && inKnown && row.settingsOnly !== false);
  const silent = row.silent === true || row.noError === true || row.noLog === true || (removed && inKnown);
  const minuteLater =
    minutes != null && minutes >= 0.5 && minutes <= 6;
  const dualLedger = (removed && inKnown) || (removed && clone && !inKnown) || (!removed && !inKnown && hadEntry);
  const knownAuthoritative = removed && inKnown;
  const recloned = removed && clone;
  const featured = row.issue === FEATURED_ISSUE && isRegrownPattern(row);
  const excised = isExcised(row);
  const chips = [];
  if (excised) chips.push("cauterized");
  if (isRegrownPattern(row)) chips.push("regrown");
  if (recloned) chips.push("re-cloned", "clone-back");
  if (dualLedger && !excised) chips.push("dual-ledger");
  if (settingsOnly && removed && !excised) chips.push("settings-only");
  if (knownAuthoritative) chips.push("known-authoritative");
  if (silent && !excised) chips.push("silent-return");
  if (alreadyAdded) chips.push("already-added");
  if (minuteLater && !excised) chips.push("minute-later");
  return {
    row,
    removed,
    inKnown,
    clone,
    hadEntry,
    minutes,
    alreadyAdded,
    settingsOnly,
    silent,
    minuteLater,
    dualLedger,
    knownAuthoritative,
    recloned,
    featured,
    excised,
    regrownPattern: isRegrownPattern(row),
    chips: [...new Set(chips)],
  };
}

export function classify(input) {
  const facts = analyze(input);
  const rawSeed = String(facts.row.seed || "").toLowerCase();
  const seed = SEED_ALIASES[rawSeed] || rawSeed;
  if (facts.excised) return "cauterized";
  if (ALARM_VERDICTS.includes(seed)) return seed;
  if (facts.featured) return "regrown";
  if (facts.alreadyAdded && facts.inKnown) return "already-added";
  if (facts.recloned && !facts.inKnown) return "clone-back";
  if (facts.minuteLater && facts.inKnown && !facts.clone) return "minute-later";
  if (facts.recloned && facts.inKnown && facts.silent && facts.alreadyAdded) return "regrown";
  if (facts.recloned && !facts.featured) return "re-cloned";
  if (facts.silent && facts.inKnown && !facts.clone) return "silent-return";
  if (facts.knownAuthoritative && !facts.clone) return "known-authoritative";
  if (facts.settingsOnly && facts.removed && facts.inKnown && !facts.clone) return "settings-only";
  if (facts.dualLedger) return "dual-ledger";
  if (facts.regrownPattern) return "regrown";
  return "cauterized";
}

export function chipsOf(input) {
  return analyze(input).chips;
}

export function score(input) {
  const facts = analyze(input);
  const verdict = classify(input);
  const hold = HOLD_VERDICTS.includes(verdict);
  return {
    verdict,
    state: verdict,
    cauterized: verdict === "cauterized",
    excised: verdict === "cauterized",
    regrown: verdict === "regrown" || facts.regrownPattern,
    hold,
    alarm: !hold,
    idleWord: IDLE_WORD,
    issue: facts.row.issue ?? FEATURED_ISSUE,
    chips: facts.chips,
    facts: {
      removedFromSettings: facts.removed,
      presentInKnown: facts.inKnown,
      cloneExists: facts.clone,
      minutesSinceRemoval: facts.minutes,
      reAddReportsAlreadyAdded: facts.alreadyAdded,
      knownLastUpdated: facts.row.knownLastUpdated,
      settingsHadEntry: facts.hadEntry,
      settingsOnly: facts.settingsOnly,
      silent: facts.silent,
      dualLedger: facts.dualLedger,
      knownAuthoritative: facts.knownAuthoritative,
    },
    reasons: reasonsOf(facts, verdict),
    feed: feedOf(verdict),
    ticket: facts.row,
  };
}

export function feedOf(kind) {
  if (kind === "cauterized") {
    return "● Cauterized · gone from settings AND known AND clone absent · hold";
  }
  if (kind === "re-cloned") {
    return "● Re-cloned · clone directory recreated after the settings cut · alarm";
  }
  if (kind === "clone-back") {
    return "● Clone-back · marketplaces/<name>/ returned to the shelf · alarm";
  }
  if (kind === "dual-ledger") {
    return "● Dual-ledger · settings.json and known_marketplaces.json disagree · alarm";
  }
  if (kind === "settings-only") {
    return "● Settings-only · the cut touched settings.json and left the known ledger · alarm";
  }
  if (kind === "known-authoritative") {
    return "● Known-authoritative · known_marketplaces.json silently wins · alarm";
  }
  if (kind === "silent-return") {
    return "● Silent-return · no error, no log, the entry came back · alarm";
  }
  if (kind === "already-added") {
    return "● Already-added · re-add reports the marketplace already present · alarm";
  }
  if (kind === "minute-later") {
    return "● Minute-later · ~1 minute resurrection window · alarm";
  }
  return "● Regrown · removed from settings; known_marketplaces brought it back · alarm";
}

export function reasonsOf(facts, kind) {
  const reasons = [`verdict ${kind}`];
  if (kind === "cauterized") {
    reasons.push("gone from settings AND known AND clone absent");
    reasons.push("what works: delete from known_marketplaces.json AND remove the clone");
  }
  if (!HOLD_VERDICTS.includes(kind)) {
    reasons.push(
      "#90856 removing a marketplace from settings.json is silently reverted by known_marketplaces.json",
    );
  }
  if (facts.removed) reasons.push("entry gone from settings.json extraKnownMarketplaces");
  if (facts.inKnown) reasons.push("known_marketplaces.json still has / restored the entry");
  if (facts.clone) reasons.push("clone under ~/.claude/plugins/marketplaces/<name>/ exists");
  if (!facts.clone && facts.removed && !facts.excised) {
    reasons.push("clone was deleted; watch the shelf");
  }
  if (facts.minutes != null) reasons.push(`${facts.minutes} minute(s) since removal`);
  if (facts.row.knownLastUpdated) {
    reasons.push(`known lastUpdated ${facts.row.knownLastUpdated}`);
  }
  if (facts.alreadyAdded) reasons.push("re-add reports already added");
  if (facts.silent && !facts.excised) reasons.push("no error, no log");
  if (facts.settingsOnly && facts.removed && !facts.excised) {
    reasons.push("user edited only settings.json");
  }
  if (facts.knownAuthoritative) reasons.push("known ledger is authoritative");
  if (Array.isArray(facts.row.observations) && facts.row.observations.length) {
    const c = facts.row.observations.find((row) => row && row.marketplace === "C");
    if (c && c.cloneRecreated) {
      reasons.push(`C clone recreated ${c.cloneRecreated}`);
    }
  }
  return reasons;
}

export function seedRegrown() {
  return {
    seed: "regrown",
    issue: FEATURED_ISSUE,
    title: TITLE,
    removedFromSettings: true,
    presentInKnown: true,
    cloneExists: true,
    minutesSinceRemoval: 1,
    reAddReportsAlreadyAdded: true,
    knownLastUpdated: "18:03",
    settingsHadEntry: true,
    settingsOnly: true,
    silent: true,
    noError: true,
    noLog: true,
    version: VERSION,
    platform: PLATFORM,
    os: OS,
    desktop: true,
    marketplace: "A",
    observations: [...OBSERVATIONS],
    settings: { removed: true, hadEntry: true, only: true, key: SETTINGS_KEY },
    known: { present: true, lastUpdated: "18:03", path: KNOWN_PATH },
    clone: { exists: true, path: CLONE_PATH, recreated: "18:17:36" },
  };
}

export function seedExcised() {
  return {
    seed: "cauterized",
    issue: FEATURED_ISSUE,
    removedFromSettings: true,
    presentInKnown: false,
    cloneExists: false,
    minutesSinceRemoval: 1,
    reAddReportsAlreadyAdded: false,
    settingsHadEntry: true,
    settingsOnly: false,
    silent: false,
    version: VERSION,
    platform: PLATFORM,
    os: OS,
    desktop: true,
    settings: { removed: true, hadEntry: true, only: false, key: SETTINGS_KEY },
    known: { present: false, path: KNOWN_PATH },
    clone: { exists: false, path: CLONE_PATH },
  };
}

export function seedReCloned() {
  return {
    seed: "re-cloned",
    issue: FEATURED_ISSUE,
    removedFromSettings: true,
    presentInKnown: true,
    cloneExists: true,
    minutesSinceRemoval: 5,
    reAddReportsAlreadyAdded: false,
    knownLastUpdated: "18:17",
    settingsHadEntry: true,
    settingsOnly: true,
    silent: true,
    marketplace: "C",
    cloneRecreated: "18:17:36",
    version: VERSION,
    platform: PLATFORM,
  };
}

export function seedCloneBack() {
  return {
    seed: "clone-back",
    issue: FEATURED_ISSUE,
    removedFromSettings: true,
    presentInKnown: false,
    cloneExists: true,
    minutesSinceRemoval: 5,
    settingsHadEntry: true,
    settingsOnly: true,
    marketplace: "C",
    cloneRecreated: "18:17:36",
    version: VERSION,
    platform: PLATFORM,
  };
}

export function seedDualLedger() {
  return {
    seed: "dual-ledger",
    issue: FEATURED_ISSUE,
    removedFromSettings: true,
    presentInKnown: true,
    cloneExists: false,
    minutesSinceRemoval: 0,
    settingsHadEntry: true,
    settingsOnly: true,
    version: VERSION,
    platform: PLATFORM,
  };
}

export function seedSettingsOnly() {
  return {
    seed: "settings-only",
    issue: FEATURED_ISSUE,
    removedFromSettings: true,
    presentInKnown: true,
    cloneExists: false,
    minutesSinceRemoval: 0,
    settingsHadEntry: true,
    settingsOnly: true,
    version: VERSION,
    platform: PLATFORM,
  };
}

export function seedKnownAuthoritative() {
  return {
    seed: "known-authoritative",
    issue: FEATURED_ISSUE,
    removedFromSettings: true,
    presentInKnown: true,
    cloneExists: false,
    minutesSinceRemoval: 1,
    knownLastUpdated: "18:03",
    settingsHadEntry: true,
    settingsOnly: true,
    silent: true,
    version: VERSION,
    platform: PLATFORM,
  };
}

export function seedSilentReturn() {
  return {
    seed: "silent-return",
    issue: FEATURED_ISSUE,
    removedFromSettings: true,
    presentInKnown: true,
    cloneExists: false,
    minutesSinceRemoval: 1,
    settingsHadEntry: true,
    settingsOnly: true,
    silent: true,
    noError: true,
    noLog: true,
    version: VERSION,
    platform: PLATFORM,
  };
}

export function seedAlreadyAdded() {
  return {
    seed: "already-added",
    issue: FEATURED_ISSUE,
    removedFromSettings: true,
    presentInKnown: true,
    cloneExists: true,
    minutesSinceRemoval: 1,
    reAddReportsAlreadyAdded: true,
    settingsHadEntry: true,
    settingsOnly: true,
    silent: true,
    version: VERSION,
    platform: PLATFORM,
  };
}

export function seedMinuteLater() {
  return {
    seed: "minute-later",
    issue: FEATURED_ISSUE,
    removedFromSettings: true,
    presentInKnown: true,
    cloneExists: false,
    minutesSinceRemoval: 1,
    knownLastUpdated: "18:03",
    settingsHadEntry: true,
    settingsOnly: true,
    silent: true,
    marketplace: "A",
    version: VERSION,
    platform: PLATFORM,
  };
}

export function seedCauterized() {
  return seedExcised();
}

export function decideSeed(name) {
  const key = String(name || "").toLowerCase();
  const mapped = SEED_ALIASES[key] || key;
  const seeds = {
    cauterized: seedCauterized,
    excised: seedCauterized,
    regrown: seedRegrown,
    "re-cloned": seedReCloned,
    recloned: seedReCloned,
    "dual-ledger": seedDualLedger,
    dual: seedDualLedger,
    "settings-only": seedSettingsOnly,
    lopped: seedSettingsOnly,
    "known-authoritative": seedKnownAuthoritative,
    shadowed: seedKnownAuthoritative,
    "silent-return": seedSilentReturn,
    "already-added": seedAlreadyAdded,
    "minute-later": seedMinuteLater,
    "clone-back": seedCloneBack,
    90856: seedRegrown,
  };
  const fn = seeds[key] || seeds[mapped];
  return score(fn ? fn() : seedRegrown());
}

export function decide(payload = {}) {
  const action = String(payload.action || payload.hydra?.action || "").toLowerCase();
  if (action && action !== "score") return decideSeed(action);
  const ticket =
    payload.ticket || payload.hydra || payload.registry || payload.probe || payload;
  return score(ticket);
}

export function verdictOf(input) {
  return classify(input);
}

export async function handle(payload = {}) {
  const result = decide(payload);
  const deny = result.alarm;
  return {
    hook_event_name: "Stop",
    hookSpecificOutput: {
      hookEventName: "Stop",
      additionalContext: deny
        ? "Hydra regrown. A settings cut that regrows from the known ledger is not a hold. #90856 known_marketplaces.json silently re-registers the marketplace."
        : "Hydra cauterized. Gone from settings AND known AND clone absent.",
    },
    ...result,
  };
}

function parsePayload(raw) {
  const text = String(raw || "").trim();
  if (!text) return seedRegrown();
  try {
    const parsed = JSON.parse(text);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return parsed.action || parsed.ticket || parsed.hydra || parsed.registry || parsed.probe
        ? parsed
        : { action: "score", ticket: cloneTicket(parsed) };
    }
  } catch {
    return seedRegrown();
  }
  return seedRegrown();
}

function readStdin() {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stdin.on("data", (chunk) => chunks.push(chunk));
    stdin.on("end", () => {
      const raw = Buffer.concat(chunks).toString("utf8").trim();
      if (!raw) {
        resolve(seedRegrown());
        return;
      }
      resolve(parsePayload(raw));
    });
    stdin.on("error", reject);
  });
}

const asCli = Boolean(process.argv[1]) && import.meta.url === pathToFileURL(process.argv[1]).href;
if (asCli) {
  const fileArg = process.argv.slice(2).find((arg) => !arg.startsWith("--"));
  const payload = fileArg ? parsePayload(readFileSync(fileArg, "utf8")) : await readStdin();
  const out = await handle(payload);
  process.stdout.write(`${JSON.stringify(out)}\n`);
}
