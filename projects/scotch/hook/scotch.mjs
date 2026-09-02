#!/usr/bin/env node
/**
 * Scotch — railway wagon scotch-block atelier classifier.
 * A scotch that cannot arm recovery is not a hold.
 * Score the block or admit chocked.
 *
 *   echo '{"recoveryConfigured":false,"accessDenied":true,"openServiceDenied":true,"uncleanDeath":true,"rebootRequired":true,"crashStaysDown":true}' | node scotch.mjs
 *   node scotch.mjs ticket.json
 *
 * Idle word is chocked (HOLD: recovery actions configured successfully;
 * unclean service death would auto-restart; no Access is denied on
 * open service).
 * Seeded state is rolled / #91324 (Access is denied configuring recovery
 * actions; crashed service stays down until reboot).
 * NEVER idle as rolled, clasped, sprung, drained, hinged, pealed,
 * warded, pooled, cased, aired, sifted, stocked.
 *
 * Primary #91324: Packaged Windows service CoworkVMService /
 * cowork-svc.exe logs every start in
 * C:\ProgramData\Claude\Logs\cowork-service.log a warning:
 * failed to configure recovery actions (a crashed service will stay
 * down until reboot): open service: Access is denied. Matching stop
 * warning: failed to disarm recovery actions… Access is denied.
 * Reporter rebooted three times in one day after Desktop window deaths
 * (twice with GPU process gone; once silent stop). After death: main
 * process stayed alive with no window; second-instance suppressed;
 * Task Manager kill of the service left it down permanently until reboot.
 *
 * Hypothesis only (NON-BINDING): service process lacks privilege / wrong
 * identity to call ChangeServiceConfig2 for failure actions, so recovery
 * never arms. Do not claim a root cause in Claude Code source you have
 * not seen. Verify against the issue text and discard if wrong.
 *
 * This is a diagnostic scoring bench. NOT an exploit. No payloads.
 * Score whether the block is chocked or rolled.
 *
 * NOT sluice / millrace / Toke-File-SeAt paged-pool leak.
 * NOT bulla / MSIX seal / package corruption.
 * NOT limpet / session process still clamped after done.
 * NOT damper / kist / bollard Remote Control cluster.
 * NOT fibula / mute DISPLAY clipboard hang.
 * NOT virgule / riddle / garner / pintle / carillon / postern.
 * NOT leftover woodworking / mm-slider.
 * Product name stays Scotch. Do not rename to Recovery / Service /
 * SCM / Cowork / Reboot / Access / Fibula / Virgule / Riddle / Garner / Pintle.
 */

import { readFileSync } from "node:fs";
import { stdin } from "node:process";
import { pathToFileURL } from "node:url";

export const VERDICTS = Object.freeze([
  "chocked",
  "rolled",
  "access-denied",
  "recovery-actions",
  "open-service",
  "reboot-only",
  "unclean-death",
  "gpu-adjacent",
  "msix-adjacent",
  "second-instance",
  "has-repro",
  "hold",
]);
export const IDLE_WORD = "chocked";
export const SEEDED_WORD = "rolled";
export const HOLD_VERDICTS = Object.freeze(["chocked", "hold"]);
export const ALARM_VERDICTS = Object.freeze(
  VERDICTS.filter((name) => !HOLD_VERDICTS.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FEATURED_ISSUE = 91324;
export const PRIMARY_ISSUES = Object.freeze([91324]);
export const COUSINS = Object.freeze([90105, 89912, 89692, 89648, 89687]);
export const COUSIN_ISSUE = 90105;
export const CROSS_ECOSYSTEM = Object.freeze([]);
export const NOT_PRODUCTS = Object.freeze([
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
  "bulla",
  "limpet",
  "damper",
  "kist",
  "bollard",
  "shunt",
  "woodworking",
  "mm-slider",
]);
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/91324";
export const TITLE =
  'Windows: CoworkVMService can\'t set its own crash recovery ("Access is denied") — once it dies, only a reboot brings Claude back';
export const FILED_AT = "2026-09-01T21:25:43Z";
export const LABELS = Object.freeze([
  "bug",
  "has repro",
  "platform:windows",
  "area:cowork",
  "area:desktop",
]);
export const REPORTER = "danarkind";
export const SERVICE = "CoworkVMService";
export const EXE = "cowork-svc.exe";
export const LOG_PATH = "C:\\ProgramData\\Claude\\Logs\\cowork-service.log";
export const WARNING =
  "failed to configure recovery actions (a crashed service will stay down until reboot): open service: Access is denied.";
export const STOP_WARNING =
  "failed to disarm recovery actions for this stop... Access is denied";
export const ACCESS_DENIED = "Access is denied";
export const OPEN_SERVICE = "open service: Access is denied";
export const GPU_GONE = "GPU process gone";
export const GPU_TIMES = Object.freeze(["11:29:12", "12:50:44"]);
export const SECOND_INSTANCE = "second-instance: suppressing duplicate argv";
export const NOT_MAIN = "Not main instance, returning early from app ready";
export const USED_BY_ANOTHER = "Claude is being used by another program";
export const MEMORY_LINE =
  "[process-memory] tree_rss_sum=15216MB electron(14)=2597MB children(251)=12618MB ... sys_free=21688MB/65209MB";
export const MSIX_FROM = "1.40609.0.0";
export const MSIX_TO = "1.40609.1.0";
export const OS = "Windows 11 Pro 10.0.26200";
export const ARCH = "x64";
export const RAM = "64 GB";
export const PLATFORM = "windows";
export const REBOOTS_IN_DAY = 3;
export const WINDOW_DEATHS = 3;
export const HUB_LINE =
  "10:50 scotch: a scotch that cannot arm recovery is not a hold. Score the block or admit chocked.";
export const MARK = "10:50 / hermes catalog #111 / #91324";
export const PHRASE =
  "A scotch that cannot arm recovery is not a hold. Score the block or admit chocked.";
export const HYPOTHESIS_NOTE =
  "NON-BINDING: service process lacks privilege / wrong identity to call ChangeServiceConfig2 for failure actions, so recovery never arms. Do not claim a root cause in Claude Code source you have not seen. Verify against the issue text and discard if wrong.";
export const CONTRAST_NOTE =
  "This is CoworkVMService FAILS TO CONFIGURE WINDOWS SCM RECOVERY ACTIONS WITH open service: Access is denied; UNCLEAN DEATH → REBOOT-ONLY RECLAIM. Packaged Windows service CoworkVMService / cowork-svc.exe logs every start in C:\\ProgramData\\Claude\\Logs\\cowork-service.log: failed to configure recovery actions (a crashed service will stay down until reboot): open service: Access is denied. Matching stop warning: failed to disarm recovery actions… Access is denied. Reporter rebooted three times in one day after Desktop window deaths (twice with GPU process gone at 11:29:12 and 12:50:44; once silent stop). After death: main process stayed alive with no window; second-instance suppressed; Task Manager kill of the service left it down permanently until reboot. Pending MSIX update 1.40609.0.0 → 1.40609.1.0 and GPU/orphan paths noted as adjacent; recovery-actions warning is the newly filed piece. Env: Claude Desktop MSIX 1.40609.0.0 → 1.40609.1.0, Windows 11 Pro 10.0.26200, x64, 64 GB RAM. NOT Sluice #91265 (Cowork Toke/File/SeAt kernel paged-pool leak / millrace). NOT Bulla #90891 (MSIX seal / package corruption). NOT Limpet #89275 (session process still clamped after done). NOT Damper/Kist/Bollard (Remote Control settings/roster/hawser cluster). NOT #90105 / #89692 / #89912 / #89648 / #89687 (GPU orphan + MSIX update reboot loops — cite-only cousins that become reboot-only when recovery cannot arm). NOT Fibula #91306 (mute DISPLAY clipboard hang). NOT Virgule #91337 / Riddle #91327 / Garner #91246 / Pintle #91226 / Carillon / Postern. NOT leftover woodworking / mm-slider. Product name stays Scotch.";
export const FORBIDDEN_IDLE = Object.freeze([
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
]);
export const BANNED_NAMES = Object.freeze([
  "Recovery",
  "Service",
  "SCM",
  "Cowork",
  "Reboot",
  "Access",
  "Fibula",
  "Virgule",
  "Riddle",
  "Garner",
  "Pintle",
]);
export const FORBIDDEN_UI = Object.freeze([
  "bow fibula",
  "catch-plate",
  "cloak fold",
  "wax tablet",
  "iron stylus",
  "composing stick",
  "type-case",
  "lead sorts",
  "vermilion virgule",
  "wire mesh",
  "ore grit",
  "copper rivet",
  "coal strap",
  "grain loft",
  "airing hatch",
  "millrace",
  "sluice-gate",
  "pool-gauge",
  "peal-board",
  "belfry",
  "postern-gate",
  "night bailey",
  "plane-table",
  "rudder pintle",
  "gudgeon",
  "woodworking",
  "mm-slider",
]);

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

function blankTicket() {
  return {
    seed: "",
    issue: null,
    source: "",
    service: "",
    exe: "",
    logPath: "",
    recoveryConfigured: null,
    recoveryArmed: null,
    accessDenied: null,
    openServiceDenied: null,
    crashStaysDown: null,
    rebootRequired: null,
    uncleanDeath: null,
    windowGone: null,
    mainProcessAlive: null,
    secondInstanceSuppressed: null,
    gpuProcessGone: null,
    gpuTimes: [],
    silentStop: null,
    msixPending: null,
    msixFrom: "",
    msixTo: "",
    rebootsInDay: null,
    windowDeaths: null,
    version: "",
    os: "",
    arch: "",
    ram: "",
    platform: "",
    hasRepro: null,
    cousin: "",
    outputText: "",
  };
}

export function seedChocked() {
  return {
    seed: IDLE_WORD,
    issue: null,
    source: "atelier",
    service: SERVICE,
    exe: EXE,
    logPath: LOG_PATH,
    recoveryConfigured: true,
    recoveryArmed: true,
    accessDenied: false,
    openServiceDenied: false,
    crashStaysDown: false,
    rebootRequired: false,
    uncleanDeath: false,
    windowGone: false,
    mainProcessAlive: true,
    secondInstanceSuppressed: false,
    gpuProcessGone: false,
    gpuTimes: [],
    silentStop: false,
    msixPending: false,
    msixFrom: MSIX_FROM,
    msixTo: MSIX_TO,
    rebootsInDay: 0,
    windowDeaths: 0,
    version: MSIX_FROM,
    os: OS,
    arch: ARCH,
    ram: RAM,
    platform: PLATFORM,
    hasRepro: false,
    cousin: "",
    outputText:
      "chocked; recovery actions configured successfully; unclean service death would auto-restart; no Access is denied on open service; idle word chocked",
  };
}

export function seedRolled() {
  return {
    seed: SEEDED_WORD,
    issue: FEATURED_ISSUE,
    title: TITLE,
    url: ISSUE_URL,
    filedAt: FILED_AT,
    labels: [...LABELS],
    reporter: REPORTER,
    source: "atelier",
    service: SERVICE,
    exe: EXE,
    logPath: LOG_PATH,
    recoveryConfigured: false,
    recoveryArmed: false,
    accessDenied: true,
    openServiceDenied: true,
    crashStaysDown: true,
    rebootRequired: true,
    uncleanDeath: true,
    windowGone: true,
    mainProcessAlive: true,
    secondInstanceSuppressed: true,
    gpuProcessGone: true,
    gpuTimes: [...GPU_TIMES],
    silentStop: true,
    msixPending: true,
    msixFrom: MSIX_FROM,
    msixTo: MSIX_TO,
    rebootsInDay: REBOOTS_IN_DAY,
    windowDeaths: WINDOW_DEATHS,
    version: MSIX_FROM,
    os: OS,
    arch: ARCH,
    ram: RAM,
    platform: PLATFORM,
    hasRepro: true,
    cousin: "",
    outputText:
      "rolled; #91324; Access is denied configuring recovery actions; crashed service stays down until reboot; CoworkVMService / cowork-svc.exe; open service: Access is denied",
  };
}

export function seedAccessDenied() {
  return {
    seed: "access-denied",
    source: "atelier",
    service: SERVICE,
    exe: EXE,
    logPath: LOG_PATH,
    recoveryConfigured: false,
    accessDenied: true,
    openServiceDenied: true,
    crashStaysDown: true,
    rebootRequired: true,
    uncleanDeath: true,
    version: MSIX_FROM,
    platform: PLATFORM,
    hasRepro: true,
    outputText:
      "access-denied; Warning: failed to configure recovery actions (a crashed service will stay down until reboot): open service: Access is denied.",
  };
}

export function seedRecoveryActions() {
  return {
    seed: "recovery-actions",
    source: "atelier",
    service: SERVICE,
    exe: EXE,
    logPath: LOG_PATH,
    recoveryConfigured: false,
    recoveryArmed: false,
    accessDenied: true,
    openServiceDenied: true,
    crashStaysDown: true,
    rebootRequired: true,
    uncleanDeath: true,
    version: MSIX_FROM,
    platform: PLATFORM,
    hasRepro: true,
    outputText:
      "recovery-actions; failed to configure recovery actions; matching stop warning failed to disarm recovery actions… Access is denied; recovery never arms",
  };
}

export function seedOpenService() {
  return {
    seed: "open-service",
    source: "atelier",
    service: SERVICE,
    exe: EXE,
    logPath: LOG_PATH,
    recoveryConfigured: false,
    accessDenied: true,
    openServiceDenied: true,
    crashStaysDown: true,
    rebootRequired: true,
    uncleanDeath: true,
    version: MSIX_FROM,
    platform: PLATFORM,
    hasRepro: true,
    outputText:
      "open-service; open service: Access is denied; CoworkVMService cannot open its own service handle to set SCM recovery",
  };
}

export function seedRebootOnly() {
  return {
    seed: "reboot-only",
    source: "atelier",
    service: SERVICE,
    exe: EXE,
    recoveryConfigured: false,
    accessDenied: true,
    openServiceDenied: true,
    crashStaysDown: true,
    rebootRequired: true,
    uncleanDeath: true,
    rebootsInDay: REBOOTS_IN_DAY,
    windowDeaths: WINDOW_DEATHS,
    version: MSIX_FROM,
    platform: PLATFORM,
    hasRepro: true,
    outputText:
      "reboot-only; a crashed service will stay down until reboot; Task Manager kill of the service left it down permanently until reboot; reporter rebooted three times in one day",
  };
}

export function seedUncleanDeath() {
  return {
    seed: "unclean-death",
    source: "atelier",
    service: SERVICE,
    exe: EXE,
    recoveryConfigured: false,
    accessDenied: true,
    openServiceDenied: true,
    crashStaysDown: true,
    rebootRequired: true,
    uncleanDeath: true,
    windowGone: true,
    mainProcessAlive: true,
    version: MSIX_FROM,
    platform: PLATFORM,
    hasRepro: true,
    outputText:
      "unclean-death; Desktop window deaths; once the service dies uncleanly Windows will not bring it back; main process stayed alive with no window",
  };
}

export function seedGpuAdjacent() {
  return {
    seed: "gpu-adjacent",
    source: "atelier",
    service: SERVICE,
    exe: EXE,
    recoveryConfigured: false,
    accessDenied: true,
    openServiceDenied: true,
    crashStaysDown: true,
    rebootRequired: true,
    uncleanDeath: true,
    gpuProcessGone: true,
    gpuTimes: [...GPU_TIMES],
    version: MSIX_FROM,
    platform: PLATFORM,
    hasRepro: true,
    outputText:
      "gpu-adjacent; twice the log shows GPU process gone at the moment of death (11:29:12 and 12:50:44); GPU/orphan paths noted as adjacent cite #90105",
  };
}

export function seedMsixAdjacent() {
  return {
    seed: "msix-adjacent",
    source: "atelier",
    service: SERVICE,
    exe: EXE,
    recoveryConfigured: false,
    accessDenied: true,
    openServiceDenied: true,
    crashStaysDown: true,
    rebootRequired: true,
    uncleanDeath: true,
    msixPending: true,
    msixFrom: MSIX_FROM,
    msixTo: MSIX_TO,
    version: MSIX_FROM,
    platform: PLATFORM,
    hasRepro: true,
    outputText:
      "msix-adjacent; pending MSIX update 1.40609.0.0 → 1.40609.1.0 noted as adjacent; covered by #89912 / #89692 / #89648 / #89687; recovery-actions warning is the newly filed piece",
  };
}

export function seedSecondInstance() {
  return {
    seed: "second-instance",
    source: "atelier",
    service: SERVICE,
    exe: EXE,
    recoveryConfigured: false,
    accessDenied: true,
    openServiceDenied: true,
    crashStaysDown: true,
    rebootRequired: true,
    uncleanDeath: true,
    windowGone: true,
    mainProcessAlive: true,
    secondInstanceSuppressed: true,
    version: MSIX_FROM,
    platform: PLATFORM,
    hasRepro: true,
    outputText:
      "second-instance; after death the main process stayed alive with no window; clicking Claude produced Claude is being used by another program; second-instance: suppressing duplicate argv; Not main instance, returning early from app ready",
  };
}

export function seedHasRepro() {
  return {
    seed: "has-repro",
    source: "atelier",
    service: SERVICE,
    exe: EXE,
    logPath: LOG_PATH,
    recoveryConfigured: false,
    accessDenied: true,
    openServiceDenied: true,
    crashStaysDown: true,
    rebootRequired: true,
    uncleanDeath: true,
    version: MSIX_FROM,
    platform: PLATFORM,
    hasRepro: true,
    outputText:
      "has-repro; packaged Windows service logs the recovery-actions warning every start in cowork-service.log; labels include has repro; platform:windows area:cowork area:desktop",
  };
}

export function seedHold() {
  return {
    seed: "hold",
    source: "atelier",
    service: SERVICE,
    exe: EXE,
    logPath: LOG_PATH,
    recoveryConfigured: true,
    recoveryArmed: true,
    accessDenied: false,
    openServiceDenied: false,
    crashStaysDown: false,
    rebootRequired: false,
    uncleanDeath: false,
    windowGone: false,
    mainProcessAlive: true,
    secondInstanceSuppressed: false,
    gpuProcessGone: false,
    msixPending: false,
    version: MSIX_FROM,
    platform: PLATFORM,
    hasRepro: false,
    outputText:
      "hold; recovery actions configured successfully; unclean service death would auto-restart; no Access is denied on open service; the block is chocked",
  };
}

export function seedCousin() {
  return {
    seed: IDLE_WORD,
    issue: COUSIN_ISSUE,
    source: "atelier",
    cousin: "90105",
    version: MSIX_FROM,
    outputText:
      "cousin-not-primary; #90105 GPU orphan path — cite; GPU/orphan side looks like #90105; not the #91324 recovery-actions Access is denied warning",
  };
}

export function emptyTicket() {
  return seedChocked();
}

export function cloneTicket(input) {
  const src = input && typeof input === "object" && !Array.isArray(input) ? input : {};
  const nested =
    (src.ticket && typeof src.ticket === "object" && src.ticket) ||
    (src.scotch && typeof src.scotch === "object" && src.scotch) ||
    (src.probe && typeof src.probe === "object" && src.probe) ||
    (src.block && typeof src.block === "object" && src.block) ||
    src;
  return {
    seed: firstText(nested.seed, src.seed),
    issue: firstNum(nested.issue, src.issue),
    title: firstText(nested.title, src.title),
    url: firstText(nested.url, src.url),
    filedAt: firstText(nested.filedAt, nested.filed_at, src.filedAt),
    labels: Array.isArray(nested.labels)
      ? nested.labels
      : Array.isArray(src.labels)
        ? src.labels
        : [],
    reporter: firstText(nested.reporter, src.reporter),
    source: firstText(nested.source, src.source),
    service: firstText(nested.service, src.service),
    exe: firstText(nested.exe, src.exe),
    logPath: firstText(nested.logPath, nested.log_path, src.logPath),
    recoveryConfigured: firstBool(
      nested.recoveryConfigured,
      nested.recovery_configured,
      src.recoveryConfigured,
    ),
    recoveryArmed: firstBool(
      nested.recoveryArmed,
      nested.recovery_armed,
      src.recoveryArmed,
    ),
    accessDenied: firstBool(
      nested.accessDenied,
      nested.access_denied,
      src.accessDenied,
    ),
    openServiceDenied: firstBool(
      nested.openServiceDenied,
      nested.open_service_denied,
      src.openServiceDenied,
    ),
    crashStaysDown: firstBool(
      nested.crashStaysDown,
      nested.crash_stays_down,
      src.crashStaysDown,
    ),
    rebootRequired: firstBool(
      nested.rebootRequired,
      nested.reboot_required,
      src.rebootRequired,
    ),
    uncleanDeath: firstBool(
      nested.uncleanDeath,
      nested.unclean_death,
      src.uncleanDeath,
    ),
    windowGone: firstBool(nested.windowGone, nested.window_gone, src.windowGone),
    mainProcessAlive: firstBool(
      nested.mainProcessAlive,
      nested.main_process_alive,
      src.mainProcessAlive,
    ),
    secondInstanceSuppressed: firstBool(
      nested.secondInstanceSuppressed,
      nested.second_instance_suppressed,
      src.secondInstanceSuppressed,
    ),
    gpuProcessGone: firstBool(
      nested.gpuProcessGone,
      nested.gpu_process_gone,
      src.gpuProcessGone,
    ),
    gpuTimes: Array.isArray(nested.gpuTimes)
      ? nested.gpuTimes
      : Array.isArray(nested.gpu_times)
        ? nested.gpu_times
        : Array.isArray(src.gpuTimes)
          ? src.gpuTimes
          : [],
    silentStop: firstBool(nested.silentStop, nested.silent_stop, src.silentStop),
    msixPending: firstBool(
      nested.msixPending,
      nested.msix_pending,
      src.msixPending,
    ),
    msixFrom: firstText(nested.msixFrom, nested.msix_from, src.msixFrom),
    msixTo: firstText(nested.msixTo, nested.msix_to, src.msixTo),
    rebootsInDay: firstNum(
      nested.rebootsInDay,
      nested.reboots_in_day,
      src.rebootsInDay,
    ),
    windowDeaths: firstNum(
      nested.windowDeaths,
      nested.window_deaths,
      src.windowDeaths,
    ),
    version: firstText(nested.version, src.version),
    os: firstText(nested.os, src.os),
    arch: firstText(nested.arch, src.arch),
    ram: firstText(nested.ram, src.ram),
    platform: firstText(nested.platform, src.platform),
    hasRepro: firstBool(nested.hasRepro, nested.has_repro, src.hasRepro),
    cousin: firstText(nested.cousin, src.cousin),
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
    row.recoveryConfigured == null &&
    row.recoveryArmed == null &&
    row.accessDenied == null &&
    row.openServiceDenied == null &&
    row.crashStaysDown == null &&
    row.rebootRequired == null &&
    row.uncleanDeath == null &&
    row.windowGone == null &&
    row.secondInstanceSuppressed == null &&
    row.gpuProcessGone == null &&
    row.msixPending == null
  );
}

const SEED_FNS = {
  [IDLE_WORD]: seedChocked,
  [SEEDED_WORD]: seedRolled,
  "access-denied": seedAccessDenied,
  "recovery-actions": seedRecoveryActions,
  "open-service": seedOpenService,
  "reboot-only": seedRebootOnly,
  "unclean-death": seedUncleanDeath,
  "gpu-adjacent": seedGpuAdjacent,
  "msix-adjacent": seedMsixAdjacent,
  "second-instance": seedSecondInstance,
  "has-repro": seedHasRepro,
  hold: seedHold,
  cousin: seedCousin,
  90105: seedCousin,
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
    return { ...seedRolled(), ...cloned, ...raw };
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
    ticket.service,
    ticket.exe,
    ticket.logPath,
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

export function isChocked(ticket) {
  const row = cloneTicket(ticket);
  if (row.isolation === "cousin") return true;
  if (canonicalSeed(row.seed) === IDLE_WORD) return true;
  if (canonicalSeed(row.seed) === "hold") return true;
  if (
    row.recoveryConfigured === true &&
    row.accessDenied === false &&
    row.crashStaysDown === false
  ) {
    return true;
  }
  return false;
}

export function isRolled(ticket) {
  const row = cloneTicket(ticket);
  const named = canonicalSeed(row.seed);
  if (named === IDLE_WORD || named === "hold") return false;
  if (COUSINS.includes(row.issue) && named !== SEEDED_WORD) return false;
  if (named === SEEDED_WORD) return true;
  if (row.issue === FEATURED_ISSUE && named !== IDLE_WORD) return true;
  if (
    row.accessDenied === true &&
    (row.recoveryConfigured === false ||
      row.openServiceDenied === true ||
      row.crashStaysDown === true ||
      row.rebootRequired === true ||
      row.uncleanDeath === true)
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
      /cousin-not-primary|#90105|#89912|#89692|#89648|#89687/i.test(text)) &&
    named !== SEEDED_WORD &&
    row.issue !== FEATURED_ISSUE;
  const rolledNow = !cousinOnly && isRolled(row);
  const chockedNow = !rolledNow && isChocked(row);
  const accessDenied =
    row.accessDenied === true ||
    named === "access-denied" ||
    /access-denied|Access is denied/i.test(text);
  const recoveryActions =
    row.recoveryConfigured === false ||
    row.recoveryArmed === false ||
    named === "recovery-actions" ||
    /recovery-actions|configure recovery actions|disarm recovery actions/i.test(
      text,
    );
  const openService =
    row.openServiceDenied === true ||
    named === "open-service" ||
    /open-service|open service: Access is denied/i.test(text);
  const rebootOnly =
    row.rebootRequired === true ||
    row.crashStaysDown === true ||
    named === "reboot-only" ||
    /reboot-only|stay down until reboot|until reboot/i.test(text);
  const uncleanDeath =
    row.uncleanDeath === true ||
    named === "unclean-death" ||
    /unclean-death|uncleanly|window died|window deaths/i.test(text);
  const gpuAdjacent =
    row.gpuProcessGone === true ||
    named === "gpu-adjacent" ||
    /gpu-adjacent|GPU process gone/i.test(text);
  const msixAdjacent =
    row.msixPending === true ||
    named === "msix-adjacent" ||
    /msix-adjacent|1\.40609|MSIX update/i.test(text);
  const secondInstance =
    row.secondInstanceSuppressed === true ||
    named === "second-instance" ||
    /second-instance|suppressing duplicate argv|being used by another program/i.test(
      text,
    );
  const hasRepro =
    row.hasRepro === true ||
    named === "has-repro" ||
    /has-repro|has repro/i.test(text);
  const rolled =
    named !== IDLE_WORD &&
    named !== "hold" &&
    !cousinOnly &&
    (rolledNow || named === SEEDED_WORD || /rolled|#91324/i.test(text));
  const chocked =
    named === IDLE_WORD ||
    named === "hold" ||
    (chockedNow && !rolled);
  return {
    named,
    cousinOnly,
    rolledNow,
    chockedNow,
    accessDenied,
    recoveryActions,
    openService,
    rebootOnly,
    uncleanDeath,
    gpuAdjacent,
    msixAdjacent,
    secondInstance,
    hasRepro,
    rolled,
    chocked,
  };
}

export function chipsOf(ticket) {
  const flags = flagsOf(ticket);
  const chips = [];
  if (flags.chocked && !flags.rolled) chips.push("chocked");
  if (flags.rolled) chips.push("rolled");
  if (flags.accessDenied && flags.rolled) chips.push("access-denied");
  if (flags.recoveryActions && flags.rolled) chips.push("recovery-actions");
  if (flags.openService && flags.rolled) chips.push("open-service");
  if (flags.rebootOnly && flags.rolled) chips.push("reboot-only");
  if (flags.uncleanDeath && flags.rolled) chips.push("unclean-death");
  if (flags.gpuAdjacent && flags.rolled) chips.push("gpu-adjacent");
  if (flags.msixAdjacent && flags.rolled) chips.push("msix-adjacent");
  if (flags.secondInstance && flags.rolled) chips.push("second-instance");
  if (flags.hasRepro && flags.rolled) chips.push("has-repro");
  if ((flags.chocked || flags.named === "hold") && !flags.rolled) {
    chips.push("hold");
  }
  if (ticket.seed && VERDICTS.includes(ticket.seed)) chips.push(ticket.seed);
  return [...new Set(chips)];
}

function reasonsOf(ticket, flags, verdict) {
  const reasons = [];
  if (verdict === "chocked") {
    reasons.push(
      "chocked; recovery actions configured successfully; unclean service death would auto-restart; no Access is denied on open service",
    );
    reasons.push("hold: the block is chocked; score treats armed SCM recovery");
  }
  if (verdict === "hold") {
    reasons.push(
      "hold; recovery actions configured successfully; unclean service death would auto-restart; the block is chocked",
    );
  }
  if (verdict === "rolled" || flags.rolled) {
    reasons.push(
      "rolled; #91324; Access is denied configuring recovery actions; crashed service stays down until reboot",
    );
  }
  if (flags.accessDenied || verdict === "access-denied") {
    reasons.push(
      `access-denied; ${WARNING}`,
    );
  }
  if (flags.recoveryActions || verdict === "recovery-actions") {
    reasons.push(
      `recovery-actions; failed to configure recovery actions; matching stop: ${STOP_WARNING}`,
    );
  }
  if (flags.openService || verdict === "open-service") {
    reasons.push(
      `open-service; ${OPEN_SERVICE}; ${SERVICE} / ${EXE} cannot arm SCM recovery`,
    );
  }
  if (flags.rebootOnly || verdict === "reboot-only") {
    reasons.push(
      "reboot-only; a crashed service will stay down until reboot; Task Manager kill of the service left it down permanently until reboot; three reboots in one day",
    );
  }
  if (flags.uncleanDeath || verdict === "unclean-death") {
    reasons.push(
      "unclean-death; Desktop window deaths; once the service dies uncleanly Windows will not bring it back",
    );
  }
  if (flags.gpuAdjacent || verdict === "gpu-adjacent") {
    reasons.push(
      `gpu-adjacent; ${GPU_GONE} at ${GPU_TIMES.join(" and ")}; cite-only cousin #90105`,
    );
  }
  if (flags.msixAdjacent || verdict === "msix-adjacent") {
    reasons.push(
      `msix-adjacent; pending MSIX update ${MSIX_FROM} → ${MSIX_TO}; cite-only cousins #89912 / #89692 / #89648 / #89687`,
    );
  }
  if (flags.secondInstance || verdict === "second-instance") {
    reasons.push(
      `second-instance; ${SECOND_INSTANCE}; ${USED_BY_ANOTHER}; main process stayed alive with no window`,
    );
  }
  if (flags.hasRepro || verdict === "has-repro") {
    reasons.push(
      `has-repro; ${SERVICE} / ${EXE} logs the recovery-actions warning every start in ${LOG_PATH}; labels include has repro`,
    );
  }
  if (flags.cousinOnly) {
    reasons.push(
      "cousin is not Scotch; cite-only GPU orphan / MSIX update reboot loop, not the recovery-actions Access is denied warning",
    );
  }
  if (verdict === "rolled" || flags.rolled) {
    reasons.push(HYPOTHESIS_NOTE);
    reasons.push(CONTRAST_NOTE);
  }
  if (verdict !== "chocked" && verdict !== "hold") {
    reasons.push(PHRASE);
  }
  return reasons;
}

function pickVerdict(seed, flags) {
  const named = canonicalSeed(seed);
  if (named === IDLE_WORD && (flags.chocked || !flags.rolled)) return "chocked";
  if (named === "hold" && !flags.rolled) return "hold";
  if (named === SEEDED_WORD) return "rolled";
  if (VERDICTS.includes(named) && named !== IDLE_WORD && named !== "hold") {
    return named;
  }
  if (flags.cousinOnly) return "chocked";
  if (flags.rolled) return "rolled";
  if (flags.chocked) return "chocked";
  return "chocked";
}

function blockOf(flags, ticket, verdict) {
  if (verdict === "rolled" || flags.rolled) {
    return {
      case: "rolled — Access is denied; the wagon rolls",
      pin: "timber scotch aside; iron wheel free on the rail",
      catch: `${ticket.service || SERVICE} · ${OPEN_SERVICE} · reboot-only`,
      cloak: "wagon rolls; recovery unarmed",
      mark: "oak block off the flange; the wagon rolled",
      note: PHRASE,
    };
  }
  if (verdict === "hold") {
    return {
      case: "chocked — recovery actions configured successfully",
      pin: "timber scotch under the wheel; iron flange held",
      catch: "SCM recovery armed · unclean death would auto-restart",
      cloak: "wagon held; switchman's hut quiet",
      mark: "oak block under the flange; the block is chocked",
      note: "Hold: the block is chocked.",
    };
  }
  return {
    case: "chocked — recovery armed; unclean death would auto-restart",
    pin: "timber scotch under the wheel; no Access is denied",
    catch: "open service granted · recovery actions configured",
    cloak: "wagon held on the sleeper",
    mark: "oak block under the flange; idle word chocked",
    note: "Chocked: the block holds.",
  };
}

export function analyze(input) {
  const ticket = normalize(input);
  const flags = flagsOf(ticket);
  const chips = chipsOf(ticket);
  const seed = String(ticket.seed || "");
  const verdict = pickVerdict(seed, flags);
  const hold = HOLD_VERDICTS.includes(verdict);
  const rolled = verdict === "rolled" || flags.rolled;
  return {
    verdict,
    chips,
    reasons: reasonsOf(ticket, flags, verdict),
    chocked: verdict === "chocked" || (flags.chocked && !rolled),
    rolled,
    hold,
    alarm: !hold,
    idleWord: IDLE_WORD,
    seededWord: SEEDED_WORD,
    flags,
    contrast: blockOf(flags, ticket, verdict),
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
  if (name === SEEDED_WORD || name === 91324 || name === "91324") {
    return analyze(seedRolled());
  }
  if (name === "access-denied") return analyze(seedAccessDenied());
  if (name === "recovery-actions") return analyze(seedRecoveryActions());
  if (name === "open-service") return analyze(seedOpenService());
  if (name === "reboot-only") return analyze(seedRebootOnly());
  if (name === "unclean-death") return analyze(seedUncleanDeath());
  if (name === "gpu-adjacent") return analyze(seedGpuAdjacent());
  if (name === "msix-adjacent") return analyze(seedMsixAdjacent());
  if (name === "second-instance") return analyze(seedSecondInstance());
  if (name === "has-repro") return analyze(seedHasRepro());
  if (name === "hold") return analyze(seedHold());
  if (name === IDLE_WORD || name === "chocked" || name === "open") {
    return analyze(seedChocked());
  }
  if (name === 90105 || name === "90105" || name === "cousin") {
    return analyze(seedCousin());
  }
  if (SEED_FNS[name]) return analyze(SEED_FNS[name]());
  return analyze(seedChocked());
}

export function handle(input) {
  const result = analyze(input);
  return {
    ...result,
    hookSpecificOutput: {
      additionalContext:
        result.verdict === "rolled" || (result.rolled && result.alarm)
          ? `rolled scotch #${FEATURED_ISSUE}: ${SERVICE} / ${EXE} failed to configure recovery actions; ${OPEN_SERVICE}; crashed service stays down until reboot. ${HYPOTHESIS_NOTE}`
          : result.verdict === "hold"
            ? "hold. Recovery actions configured successfully. Score the block."
            : `chocked scotch. Idle word ${IDLE_WORD}. Recovery actions configured successfully; unclean service death would auto-restart; no Access is denied on open service.`,
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
