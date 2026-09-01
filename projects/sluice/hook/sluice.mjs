#!/usr/bin/env node
/**
 * Sluice — millrace / sluice-gate / pool-gauge classifier.
 * A race that never drains leaves the mill pond rising until
 * the whole yard floods. Score the race or admit drained.
 *
 *   echo '{"coworkStackOn":true,"tokeRatePerSec":2}' | node sluice.mjs
 *   node sluice.mjs ticket.json
 *
 * Idle word is drained (pool tags quiet, Cowork stack OFF or
 * freshly rebooted, UI responsive).
 * Seeded state is pooled / #91265 (Toke/File/SeAt climbing
 * while user-mode looks fine; only reboot reclaims).
 * NEVER idle as pooled, sluice, limpet, quench, bulla, carcase,
 * wraith, alidade, parison, cockade, lye, stationed, displaced,
 * hung, marvered, unpinned, shed, sealed, blown.
 *
 * Primary #91265: Claude Desktop Cowork VM stack
 * (CoworkVMService, wcifs/bindflt minifilters, WSL2 infra)
 * leaks kernel pool objects — Toke, File, SeAt — at sustained
 * rates. Driver-allocated, charged to no user-mode process,
 * persists until reboot. After 3–4 days paged pool >~5 GB
 * → 50–200 ms UI stalls. Fresh signature is Toke/File/SeAt
 * paged-pool + UI jank, not only NtFC nonpaged.
 *
 * Hypothesis only (NON-BINDING): treat this as Cowork VM +
 * wcifs/bindflt minifilter retention of kernel pool tags,
 * charged to no user-mode process, reclaimable only by reboot.
 * Do not claim a root cause in Claude Code source you have
 * not seen. Verify against the issue text and discard if wrong.
 *
 * This is a diagnostic scoring bench. NOT an exploit, attack
 * PoC, or remote-access how-to. No payloads. No reproduction
 * procedures. Score whether the Cowork race is drained or pooled.
 *
 * NOT Limpet (#89275) — OS process-pair cling after end_turn.
 * NOT Quench — token-spend fuse.
 * NOT Bulla (#90891) — MSIX integrity seal.
 * NOT Wraith — live-image unlink.
 * NOT Carcase (#90867) — stealth relaunch empty chrome.
 * NOT Alidade (#91055) — foreign tool host / station plate.
 * NOT Parison / Cockade / Lye. Product name stays Sluice.
 * Do not rename to Millrace / Flume / Tailrace / Spillway /
 * Penstock / Leat / Sump.
 */

import { readFileSync } from "node:fs";
import { stdin } from "node:process";
import { pathToFileURL } from "node:url";

export const VERDICTS = Object.freeze([
  "drained",
  "pooled",
  "toke-climbing",
  "file-climbing",
  "seat-climbing",
  "minifilter-held",
  "unaccounted",
  "janky",
  "reboot-only",
  "stack-off",
  "ntfC-cousin",
  "watchdog",
]);
export const IDLE_WORD = "drained";
export const SEEDED_WORD = "pooled";
export const HOLD_VERDICTS = Object.freeze(["drained", "stack-off"]);
export const ALARM_VERDICTS = Object.freeze(
  VERDICTS.filter((name) => !HOLD_VERDICTS.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FEATURED_ISSUE = 91265;
export const PRIMARY_ISSUES = Object.freeze([91265]);
export const NTFC_ISSUE_45921 = 45921;
export const NTFC_ISSUE_67819 = 67819;
export const NTFC_ISSUE_85480 = 85480;
export const NTFC_ISSUE_55361 = 55361;
export const NTFC_ISSUE_45889 = 45889;
export const NTFC_ISSUE_48813 = 48813;
export const WSL_ISSUE = 40804;
export const FAMILY = Object.freeze([
  55361, 45889, 48813, 45921, 67819, 85480,
]);
export const COUSINS = Object.freeze([
  55361, 45889, 48813, 45921, 67819, 85480, 40804,
]);
export const NOT_PRODUCTS = Object.freeze([
  "limpet",
  "quench",
  "bulla",
  "wraith",
  "carcase",
  "alidade",
  "parison",
  "cockade",
  "lye",
  "millrace",
  "flume",
  "tailrace",
  "spillway",
  "penstock",
  "leat",
  "sump",
]);
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/91265";
export const TITLE =
  "Cowork VM causes persistent kernel pool leak (Toke/File/SeAt) leading to system-wide UI degradation on Windows";
export const FILED_AT = "2026-09-01T16:26:00Z";
export const LABELS = Object.freeze([
  "bug",
  "has repro",
  "platform:windows",
  "perf:memory",
  "area:cowork",
  "area:desktop",
]);
export const REPORTER = "milandin-hash";
export const DESKTOP_VERSION = "1.40609.0.0";
export const PLATFORM = "windows";
export const WINDOWS_BUILD = "Windows 11 Pro 10.0.26200";
export const PACKAGE_NOTE = "WindowsApps MSIX";
export const TOKE_RATE_ON = 2;
export const FILE_RATE_ON = 11;
export const TOKE_RATE_OFF = 1;
export const FILE_RATE_OFF = 4.4;
export const TOKE_RATE_CUT = 0.5;
export const FILE_RATE_CUT = 0.6;
export const TOKE_OBJECTS_FLOOD = 2719886;
export const FILE_OBJECTS_FLOOD = 6644575;
export const SEAT_OBJECTS_FLOOD = 10855380;
export const TOKE_MB_FLOOD = 4975;
export const FILE_MB_FLOOD = 2534;
export const SEAT_MB_FLOOD = 994;
export const TOKE_OBJECTS_REBOOT = 6499;
export const FILE_OBJECTS_REBOOT = 33913;
export const SEAT_OBJECTS_REBOOT = 34111;
export const HOURS_REBOOT = 0.07;
export const UNACCOUNTED_GB = 7.68;
export const USER_MODE_PAGED_GB = 0.29;
export const PAGED_POOL_JANK_GB = 5;
export const UI_JANK_MS_LOW = 50;
export const UI_JANK_MS_HIGH = 200;
export const UI_JANK_MS_SEEDED = 120;
export const HUB_LINE =
  "02:50 sluice: a millrace pool-gauge for the #91265 Cowork Toke/File/SeAt leak. Score the race or admit drained.";
export const MARK = "02:50 / hermes catalog #103 / #91265";
export const PHRASE =
  "A sluice that never drains leaves the mill pond rising until the whole yard floods. Score the race or admit drained.";
export const HYPOTHESIS_NOTE =
  "NON-BINDING: treat this as Cowork VM + wcifs/bindflt minifilter retention of kernel pool tags (Toke/File/SeAt), charged to no user-mode process, reclaimable only by reboot. Do not claim a root cause in Claude Code source you have not seen. Verify against the issue text and discard if wrong.";
export const CONTRAST_NOTE =
  "This is KERNEL-POOL RETENTION vs COWORK MINIFILTER STACK — Toke/File/SeAt paged-pool climb + system-wide UI jank, driver-allocated, user-mode looks fine. NOT Limpet (#89275) process-pair cling after end_turn. NOT Quench token-spend fuse. NOT Bulla (#90891) MSIX integrity seal. NOT Wraith live-image unlink. NOT Carcase (#90867) stealth relaunch empty chrome. NOT Alidade (#91055) foreign tool host. NOT NtFC-only cousins (#45921/#67819/#85480/WSL#40804) — those are family cites, not this pond. Product name stays Sluice.";
export const FORBIDDEN_IDLE = Object.freeze([
  "pooled",
  "sluice",
  "limpet",
  "quench",
  "bulla",
  "carcase",
  "wraith",
  "alidade",
  "parison",
  "cockade",
  "lye",
  "stationed",
  "displaced",
  "hung",
  "marvered",
  "unpinned",
  "shed",
  "sealed",
  "blown",
]);
export const BANNED_NAMES = Object.freeze([
  "Millrace",
  "Flume",
  "Tailrace",
  "Spillway",
  "Penstock",
  "Leat",
  "Sump",
  "Limpet",
  "Quench",
  "Bulla",
  "Alidade",
  "Parison",
]);

const COUSIN_BY_ISSUE = Object.freeze({
  [NTFC_ISSUE_45921]: "ntfC-cousin",
  [NTFC_ISSUE_67819]: "watchdog",
  [NTFC_ISSUE_85480]: "ntfC-cousin",
  [NTFC_ISSUE_55361]: "ntfC-cousin",
  [NTFC_ISSUE_45889]: "ntfC-cousin",
  [NTFC_ISSUE_48813]: "ntfC-cousin",
  [WSL_ISSUE]: "ntfC-cousin",
});

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
    coworkStackOn: null,
    tokeRatePerSec: null,
    fileRatePerSec: null,
    seatRatePerSec: null,
    tokeObjects: null,
    fileObjects: null,
    seatObjects: null,
    tokeMB: null,
    fileMB: null,
    seatMB: null,
    pagedPoolGB: null,
    unaccountedGB: null,
    userModePagedGB: null,
    uiJankMs: null,
    rebootClears: null,
    ntfCCousin: null,
    hoursUptime: null,
    minifilterHeld: null,
    cousin: "",
    desktopVersion: "",
    platform: "",
    windowsBuild: "",
    outputText: "",
  };
}

export function emptyTicket() {
  return seedDrained();
}

export function seedDrained() {
  return {
    seed: IDLE_WORD,
    issue: null,
    coworkStackOn: false,
    tokeRatePerSec: 0,
    fileRatePerSec: 0,
    seatRatePerSec: 0,
    tokeObjects: TOKE_OBJECTS_REBOOT,
    fileObjects: FILE_OBJECTS_REBOOT,
    seatObjects: SEAT_OBJECTS_REBOOT,
    tokeMB: null,
    fileMB: null,
    seatMB: null,
    pagedPoolGB: 0.2,
    unaccountedGB: 0,
    userModePagedGB: USER_MODE_PAGED_GB,
    uiJankMs: 0,
    rebootClears: false,
    ntfCCousin: false,
    hoursUptime: HOURS_REBOOT,
    minifilterHeld: false,
    cousin: "",
    desktopVersion: DESKTOP_VERSION,
    platform: PLATFORM,
    windowsBuild: WINDOWS_BUILD,
    outputText:
      "drained race; pool tags quiet; Cowork stack OFF or freshly rebooted 0.07 h; Toke 6,499 / File 33,913 / SeAt 34,111; UI responsive; idle word drained",
  };
}

export function seedPooled() {
  return {
    seed: SEEDED_WORD,
    issue: FEATURED_ISSUE,
    title: TITLE,
    url: ISSUE_URL,
    filedAt: FILED_AT,
    labels: [...LABELS],
    reporter: REPORTER,
    coworkStackOn: true,
    tokeRatePerSec: TOKE_RATE_ON,
    fileRatePerSec: FILE_RATE_ON,
    seatRatePerSec: null,
    tokeObjects: TOKE_OBJECTS_FLOOD,
    fileObjects: FILE_OBJECTS_FLOOD,
    seatObjects: SEAT_OBJECTS_FLOOD,
    tokeMB: TOKE_MB_FLOOD,
    fileMB: FILE_MB_FLOOD,
    seatMB: SEAT_MB_FLOOD,
    pagedPoolGB: 8.5,
    unaccountedGB: UNACCOUNTED_GB,
    userModePagedGB: USER_MODE_PAGED_GB,
    uiJankMs: UI_JANK_MS_SEEDED,
    rebootClears: true,
    ntfCCousin: false,
    hoursUptime: 168,
    minifilterHeld: true,
    cousin: "",
    desktopVersion: DESKTOP_VERSION,
    platform: PLATFORM,
    windowsBuild: WINDOWS_BUILD,
    packageNote: PACKAGE_NOTE,
    stackServices: "CoworkVMService, wcifs, bindflt, WSL2",
    sameClass: [...FAMILY],
    outputText:
      "pooled; Cowork stack ON; Toke 2,719,886 (~4,975 MB) climbing ~2/s; File 6,644,575 (~2,534 MB) climbing ~11/s; SeAt 10,855,380 (~994 MB); unaccounted driver-allocated paged pool 7.68 GB vs user-mode 0.29 GB; paged pool >5 GB; UI jank 50–200 ms; only reboot reclaims; Desktop 1.40609.0.0 WindowsApps MSIX; Windows 11 Pro 10.0.26200; wcifs/bindflt minifilters held; 7+ days uptime",
  };
}

export function seedTokeClimbing() {
  return {
    seed: "toke-climbing",
    coworkStackOn: true,
    tokeRatePerSec: TOKE_RATE_ON,
    fileRatePerSec: 0,
    seatRatePerSec: 0,
    tokeObjects: 400000,
    fileObjects: FILE_OBJECTS_REBOOT,
    seatObjects: SEAT_OBJECTS_REBOOT,
    unaccountedGB: 1.2,
    userModePagedGB: USER_MODE_PAGED_GB,
    uiJankMs: 0,
    rebootClears: true,
    ntfCCousin: false,
    minifilterHeld: false,
    outputText:
      "toke-climbing; Toke objects climbing at ~2/s while File and SeAt stay near the reboot baseline",
  };
}

export function seedFileClimbing() {
  return {
    seed: "file-climbing",
    coworkStackOn: true,
    tokeRatePerSec: 0,
    fileRatePerSec: FILE_RATE_ON,
    seatRatePerSec: 0,
    tokeObjects: TOKE_OBJECTS_REBOOT,
    fileObjects: 800000,
    seatObjects: SEAT_OBJECTS_REBOOT,
    unaccountedGB: 1.4,
    userModePagedGB: USER_MODE_PAGED_GB,
    uiJankMs: 0,
    rebootClears: true,
    ntfCCousin: false,
    minifilterHeld: false,
    outputText:
      "file-climbing; File objects climbing at ~11/s while Toke stays near the reboot baseline",
  };
}

export function seedSeatClimbing() {
  return {
    seed: "seat-climbing",
    coworkStackOn: true,
    tokeRatePerSec: 0,
    fileRatePerSec: 0,
    seatRatePerSec: 1,
    tokeObjects: TOKE_OBJECTS_REBOOT,
    fileObjects: FILE_OBJECTS_REBOOT,
    seatObjects: 2000000,
    unaccountedGB: 0.9,
    userModePagedGB: USER_MODE_PAGED_GB,
    uiJankMs: 0,
    rebootClears: true,
    ntfCCousin: false,
    minifilterHeld: false,
    outputText:
      "seat-climbing; SeAt security-attribute objects climbing while Toke and File stay quiet",
  };
}

export function seedMinifilterHeld() {
  return {
    seed: "minifilter-held",
    coworkStackOn: true,
    tokeRatePerSec: 0.4,
    fileRatePerSec: 1,
    tokeObjects: 20000,
    fileObjects: 50000,
    seatObjects: 40000,
    unaccountedGB: 0.5,
    userModePagedGB: USER_MODE_PAGED_GB,
    uiJankMs: 0,
    rebootClears: true,
    ntfCCousin: false,
    minifilterHeld: true,
    outputText:
      "minifilter-held; wcifs/bindflt minifilters and CoworkVMService still attached; race is held even before the pond floods",
  };
}

export function seedUnaccounted() {
  return {
    seed: "unaccounted",
    coworkStackOn: true,
    tokeRatePerSec: 0.3,
    fileRatePerSec: 1,
    tokeObjects: 50000,
    fileObjects: 80000,
    seatObjects: 60000,
    unaccountedGB: UNACCOUNTED_GB,
    userModePagedGB: USER_MODE_PAGED_GB,
    pagedPoolGB: 8,
    uiJankMs: 20,
    rebootClears: true,
    ntfCCousin: false,
    minifilterHeld: false,
    outputText:
      "unaccounted; driver-allocated paged pool 7.68 GB vs user-mode 0.29 GB; charged to no process",
  };
}

export function seedJanky() {
  return {
    seed: "janky",
    coworkStackOn: true,
    tokeRatePerSec: 0.5,
    fileRatePerSec: 2,
    tokeObjects: 120000,
    fileObjects: 200000,
    seatObjects: 150000,
    pagedPoolGB: 5.4,
    unaccountedGB: 4.2,
    userModePagedGB: USER_MODE_PAGED_GB,
    uiJankMs: 160,
    rebootClears: true,
    ntfCCousin: false,
    minifilterHeld: false,
    outputText:
      "janky; paged pool >~5 GB; 50–200 ms stalls in window dragging / Alt+Tab / input; yard is flooding",
  };
}

export function seedRebootOnly() {
  return {
    seed: "reboot-only",
    coworkStackOn: true,
    tokeRatePerSec: 0.8,
    fileRatePerSec: 3,
    tokeObjects: 90000,
    fileObjects: 150000,
    seatObjects: 120000,
    unaccountedGB: 2.1,
    userModePagedGB: USER_MODE_PAGED_GB,
    uiJankMs: 30,
    rebootClears: true,
    ntfCCousin: false,
    minifilterHeld: false,
    outputText:
      "reboot-only; leak persists until full system restart; no user-mode process to kill; only reboot reclaims the pond",
  };
}

export function seedStackOff() {
  return {
    seed: "stack-off",
    coworkStackOn: false,
    tokeRatePerSec: TOKE_RATE_OFF,
    fileRatePerSec: FILE_RATE_OFF,
    seatRatePerSec: 0,
    tokeObjects: 20000,
    fileObjects: 50000,
    seatObjects: 40000,
    unaccountedGB: 0.4,
    userModePagedGB: USER_MODE_PAGED_GB,
    uiJankMs: 8,
    rebootClears: false,
    ntfCCousin: false,
    minifilterHeld: false,
    hoursUptime: 12,
    outputText:
      "stack-off; Cowork stack OFF; A/B cuts Toke rate −50% and File −60% versus ON; pond is held, not flooding",
  };
}

export function seedNtfCCousin() {
  return {
    seed: "ntfC-cousin",
    issue: NTFC_ISSUE_45921,
    coworkStackOn: false,
    tokeRatePerSec: 0,
    fileRatePerSec: 0,
    seatRatePerSec: 0,
    tokeObjects: TOKE_OBJECTS_REBOOT,
    fileObjects: FILE_OBJECTS_REBOOT,
    seatObjects: SEAT_OBJECTS_REBOOT,
    unaccountedGB: 0,
    userModePagedGB: USER_MODE_PAGED_GB,
    uiJankMs: 0,
    rebootClears: false,
    ntfCCousin: true,
    minifilterHeld: false,
    cousin: "ntfC-cousin",
    outputText:
      "ntfC-cousin; #45921 claudevm.bundle .wvm-tmp churn → NtFC nonpaged; family cite, not the #91265 Toke/File/SeAt paged-pool pond",
  };
}

export function seedWatchdog() {
  return {
    seed: "watchdog",
    issue: NTFC_ISSUE_67819,
    coworkStackOn: false,
    tokeRatePerSec: 0,
    fileRatePerSec: 0,
    seatRatePerSec: 0,
    tokeObjects: TOKE_OBJECTS_REBOOT,
    fileObjects: FILE_OBJECTS_REBOOT,
    seatObjects: SEAT_OBJECTS_REBOOT,
    unaccountedGB: 0,
    userModePagedGB: USER_MODE_PAGED_GB,
    uiJankMs: 0,
    rebootClears: false,
    ntfCCousin: true,
    minifilterHeld: false,
    cousin: "watchdog",
    outputText:
      "watchdog; #67819 NtFC 12–16 GB/h + watchdog; cousin of the pond, not the Toke/File/SeAt paged-pool signature",
  };
}

export function seedCousin(kind) {
  const map = {
    "ntfC-cousin": seedNtfCCousin,
    ntfc: seedNtfCCousin,
    45921: seedNtfCCousin,
    watchdog: seedWatchdog,
    67819: seedWatchdog,
    85480: () => ({
      ...seedNtfCCousin(),
      issue: NTFC_ISSUE_85480,
      seed: "ntfC-cousin",
      cousin: "ntfC-cousin",
      outputText:
        "ntfC-cousin; #85480 ~2.2 GB/h NtFC; family cite, not the #91265 Toke/File/SeAt pond",
    }),
    55361: () => ({
      ...seedNtfCCousin(),
      issue: NTFC_ISSUE_55361,
      seed: "ntfC-cousin",
      cousin: "ntfC-cousin",
      outputText:
        "ntfC-cousin; #55361 NtFC / wcifs-bindflt; family cite, not the #91265 Toke/File/SeAt pond",
    }),
    45889: () => ({
      ...seedNtfCCousin(),
      issue: NTFC_ISSUE_45889,
      seed: "ntfC-cousin",
      cousin: "ntfC-cousin",
      outputText:
        "ntfC-cousin; #45889 family cite, not the #91265 Toke/File/SeAt pond",
    }),
    48813: () => ({
      ...seedNtfCCousin(),
      issue: NTFC_ISSUE_48813,
      seed: "ntfC-cousin",
      cousin: "ntfC-cousin",
      outputText:
        "ntfC-cousin; #48813 family cite, not the #91265 Toke/File/SeAt pond",
    }),
    wsl: () => ({
      ...seedNtfCCousin(),
      issue: WSL_ISSUE,
      seed: "ntfC-cousin",
      cousin: "ntfC-cousin",
      outputText:
        "ntfC-cousin; microsoft/WSL#40804 NtFC host-NTFS corroboration; cousin, not primary",
    }),
    40804: () => ({
      ...seedNtfCCousin(),
      issue: WSL_ISSUE,
      seed: "ntfC-cousin",
      cousin: "ntfC-cousin",
      outputText:
        "ntfC-cousin; microsoft/WSL#40804 NtFC host-NTFS corroboration; cousin, not primary",
    }),
  };
  const fn = map[kind] || seedNtfCCousin;
  return fn();
}

export function cloneTicket(input) {
  const src = input && typeof input === "object" && !Array.isArray(input) ? input : {};
  const nested =
    (src.ticket && typeof src.ticket === "object" && src.ticket) ||
    (src.sluice && typeof src.sluice === "object" && src.sluice) ||
    (src.probe && typeof src.probe === "object" && src.probe) ||
    (src.race && typeof src.race === "object" && src.race) ||
    (src.pond && typeof src.pond === "object" && src.pond) ||
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
    coworkStackOn: firstBool(
      nested.coworkStackOn,
      nested.cowork_stack_on,
      nested.stackOn,
      src.coworkStackOn,
    ),
    tokeRatePerSec: firstNum(
      nested.tokeRatePerSec,
      nested.toke_rate_per_sec,
      nested.tokeRate,
      src.tokeRatePerSec,
    ),
    fileRatePerSec: firstNum(
      nested.fileRatePerSec,
      nested.file_rate_per_sec,
      nested.fileRate,
      src.fileRatePerSec,
    ),
    seatRatePerSec: firstNum(
      nested.seatRatePerSec,
      nested.seat_rate_per_sec,
      nested.seatRate,
      src.seatRatePerSec,
    ),
    tokeObjects: firstNum(
      nested.tokeObjects,
      nested.toke_objects,
      src.tokeObjects,
    ),
    fileObjects: firstNum(
      nested.fileObjects,
      nested.file_objects,
      src.fileObjects,
    ),
    seatObjects: firstNum(
      nested.seatObjects,
      nested.seat_objects,
      src.seatObjects,
    ),
    tokeMB: firstNum(nested.tokeMB, nested.toke_mb, src.tokeMB),
    fileMB: firstNum(nested.fileMB, nested.file_mb, src.fileMB),
    seatMB: firstNum(nested.seatMB, nested.seat_mb, src.seatMB),
    pagedPoolGB: firstNum(
      nested.pagedPoolGB,
      nested.paged_pool_gb,
      src.pagedPoolGB,
    ),
    unaccountedGB: firstNum(
      nested.unaccountedGB,
      nested.unaccounted_gb,
      src.unaccountedGB,
    ),
    userModePagedGB: firstNum(
      nested.userModePagedGB,
      nested.user_mode_paged_gb,
      src.userModePagedGB,
    ),
    uiJankMs: firstNum(nested.uiJankMs, nested.ui_jank_ms, src.uiJankMs),
    rebootClears: firstBool(
      nested.rebootClears,
      nested.reboot_clears,
      src.rebootClears,
    ),
    ntfCCousin: firstBool(
      nested.ntfCCousin,
      nested.ntfcCousin,
      nested.ntfc_cousin,
      src.ntfCCousin,
    ),
    hoursUptime: firstNum(
      nested.hoursUptime,
      nested.hours_uptime,
      src.hoursUptime,
    ),
    minifilterHeld: firstBool(
      nested.minifilterHeld,
      nested.minifilter_held,
      src.minifilterHeld,
    ),
    cousin: firstText(nested.cousin, src.cousin),
    desktopVersion: firstText(
      nested.desktopVersion,
      nested.desktop_version,
      src.desktopVersion,
    ),
    platform: firstText(nested.platform, src.platform),
    windowsBuild: firstText(
      nested.windowsBuild,
      nested.windows_build,
      src.windowsBuild,
    ),
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
  return (
    input.coworkStackOn == null &&
    input.tokeRatePerSec == null &&
    input.fileRatePerSec == null &&
    input.tokeObjects == null &&
    input.fileObjects == null &&
    input.seatObjects == null &&
    input.unaccountedGB == null &&
    input.uiJankMs == null &&
    input.rebootClears == null &&
    input.ntfCCousin == null &&
    input.cousin == null
  );
}

const SEED_FNS = {
  [IDLE_WORD]: seedDrained,
  [SEEDED_WORD]: seedPooled,
  "toke-climbing": seedTokeClimbing,
  "file-climbing": seedFileClimbing,
  "seat-climbing": seedSeatClimbing,
  "minifilter-held": seedMinifilterHeld,
  unaccounted: seedUnaccounted,
  janky: seedJanky,
  "reboot-only": seedRebootOnly,
  "stack-off": seedStackOff,
  "ntfC-cousin": seedNtfCCousin,
  ntfc: seedNtfCCousin,
  watchdog: seedWatchdog,
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
    return { ...seedPooled(), ...cloned, ...raw };
  }
  if (COUSIN_BY_ISSUE[issue] && coreMissing) {
    return { ...seedCousin(issue), ...cloned, ...raw };
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

export function flagsOf(ticket) {
  const row = cloneTicket(ticket);
  const text = textOf(row);
  const named = canonicalSeed(row.seed);
  const cousinName =
    row.cousin ||
    COUSIN_BY_ISSUE[row.issue] ||
    (/ntfC-cousin|NtFC|#45921|#85480|#55361|WSL#40804|wvm-tmp/i.test(text)
      ? "ntfC-cousin"
      : "") ||
    (/watchdog|#67819/i.test(text) ? "watchdog" : "");
  const stackOn =
    row.coworkStackOn === true ||
    /Cowork stack ON|coworkStackOn": true/i.test(text);
  const stackOff =
    row.coworkStackOn === false ||
    /Cowork stack OFF|stack-off|freshly rebooted/i.test(text);
  const tokeClimbing =
    (row.tokeRatePerSec != null && row.tokeRatePerSec >= 1) ||
    (row.tokeObjects != null && row.tokeObjects >= 100000) ||
    /toke-climbing|Toke .*climbing|~2\/s|~2 Toke/i.test(text);
  const fileClimbing =
    (row.fileRatePerSec != null && row.fileRatePerSec >= 5) ||
    (row.fileObjects != null && row.fileObjects >= 500000) ||
    /file-climbing|File .*climbing|~11\/s|~11 File/i.test(text);
  const seatClimbing =
    (row.seatRatePerSec != null && row.seatRatePerSec >= 0.5) ||
    (row.seatObjects != null && row.seatObjects >= 1000000) ||
    /seat-climbing|SeAt .*climbing/i.test(text);
  const minifilterHeld =
    row.minifilterHeld === true ||
    /minifilter-held|wcifs|bindflt|CoworkVMService/i.test(text);
  const unaccounted =
    (row.unaccountedGB != null &&
      row.unaccountedGB >= 2 &&
      (row.userModePagedGB == null ||
        row.unaccountedGB > row.userModePagedGB * 5)) ||
    /unaccounted|7\.68 GB/i.test(text);
  const janky =
    (row.uiJankMs != null && row.uiJankMs >= UI_JANK_MS_LOW) ||
    (row.pagedPoolGB != null &&
      row.pagedPoolGB >= PAGED_POOL_JANK_GB &&
      row.uiJankMs != null &&
      row.uiJankMs >= 40) ||
    /janky|50–200 ms|UI jank/i.test(text);
  const rebootOnly =
    row.rebootClears === true ||
    /reboot-only|only reboot reclaims|persists until/i.test(text);
  const freshlyRebooted =
    (row.hoursUptime != null && row.hoursUptime <= 0.2) ||
    /freshly rebooted 0\.07/i.test(text);
  const quietRates =
    (row.tokeRatePerSec == null || row.tokeRatePerSec < 1) &&
    (row.fileRatePerSec == null || row.fileRatePerSec < 5) &&
    (row.tokeObjects == null || row.tokeObjects < 100000);
  const namedAlarm =
    VERDICTS.includes(named) &&
    named !== IDLE_WORD &&
    named !== SEEDED_WORD &&
    !HOLD_VERDICTS.includes(named);
  const namedHold = HOLD_VERDICTS.includes(named);
  const cousinOnly =
    Boolean(cousinName) &&
    !stackOn &&
    !tokeClimbing &&
    named !== SEEDED_WORD &&
    named !== "pooled";
  const pooled =
    !cousinOnly &&
    !namedHold &&
    stackOn &&
    tokeClimbing &&
    fileClimbing &&
    (unaccounted ||
      (row.tokeObjects != null && row.tokeObjects >= 1000000) ||
      /pooled;/i.test(text));
  const drained =
    !namedAlarm &&
    !pooled &&
    !cousinOnly &&
    (namedHold ||
      (stackOff && quietRates && !janky) ||
      freshlyRebooted ||
      /drained race; pool tags quiet/i.test(text));
  return {
    stackOn,
    stackOff,
    tokeClimbing,
    fileClimbing,
    seatClimbing,
    minifilterHeld,
    unaccounted,
    janky,
    rebootOnly,
    freshlyRebooted,
    quietRates,
    cousinOnly,
    cousinName,
    pooled,
    drained,
    namedAlarm,
    namedHold,
  };
}

export function chipsOf(ticket) {
  const flags = flagsOf(ticket);
  const chips = [];
  if (flags.pooled) chips.push("pooled");
  if (flags.drained) chips.push("drained");
  if (flags.tokeClimbing && !flags.drained) chips.push("toke-climbing");
  if (flags.fileClimbing && !flags.drained) chips.push("file-climbing");
  if (flags.seatClimbing && !flags.drained) chips.push("seat-climbing");
  if (flags.minifilterHeld && !flags.drained) chips.push("minifilter-held");
  if (flags.unaccounted && !flags.drained) chips.push("unaccounted");
  if (flags.janky && !flags.drained) chips.push("janky");
  if (flags.rebootOnly && flags.stackOn && !flags.drained) {
    chips.push("reboot-only");
  }
  if (flags.stackOff && !flags.pooled && !flags.cousinOnly) {
    chips.push("stack-off");
  }
  if (ticket.seed === "stack-off" && flags.stackOff) chips.push("stack-off");
  if (ticket.seed === "ntfC-cousin" || flags.cousinName === "ntfC-cousin") {
    chips.push("ntfC-cousin");
  }
  if (ticket.seed === "watchdog" || flags.cousinName === "watchdog") {
    chips.push("watchdog");
  }
  if (ticket.seed === "toke-climbing") chips.push("toke-climbing");
  if (ticket.seed === "file-climbing") chips.push("file-climbing");
  if (ticket.seed === "seat-climbing") chips.push("seat-climbing");
  if (ticket.seed === "minifilter-held") chips.push("minifilter-held");
  if (ticket.seed === "unaccounted") chips.push("unaccounted");
  if (ticket.seed === "janky") chips.push("janky");
  if (ticket.seed === "reboot-only") chips.push("reboot-only");
  return [...new Set(chips)];
}

function reasonsOf(ticket, flags, verdict) {
  const reasons = [];
  if (verdict === "drained") {
    reasons.push(
      "drained race; pool tags quiet; Cowork stack OFF or freshly rebooted; UI responsive",
    );
    reasons.push("hold: the mill pond is down; the yard is dry");
  }
  if (verdict === "stack-off") {
    reasons.push(
      "stack-off; Cowork stack OFF; A/B cuts Toke rate −50% and File −60% versus ON",
    );
    reasons.push("hold: the race is gated; the pond is held");
  }
  if (verdict === "pooled") {
    reasons.push(
      `Toke ${ticket.tokeObjects ?? TOKE_OBJECTS_FLOOD} (~${ticket.tokeMB ?? TOKE_MB_FLOOD} MB) climbing ~${ticket.tokeRatePerSec ?? TOKE_RATE_ON}/s; File ${ticket.fileObjects ?? FILE_OBJECTS_FLOOD} (~${ticket.fileMB ?? FILE_MB_FLOOD} MB) climbing ~${ticket.fileRatePerSec ?? FILE_RATE_ON}/s; SeAt ${ticket.seatObjects ?? SEAT_OBJECTS_FLOOD} (~${ticket.seatMB ?? SEAT_MB_FLOOD} MB)`,
    );
  }
  if (flags.tokeClimbing) {
    reasons.push("Toke access-token objects climbing at a sustained rate (~2/s on the #91265 race)");
  }
  if (flags.fileClimbing) {
    reasons.push("File objects climbing at a sustained rate (~11/s on the #91265 race)");
  }
  if (flags.seatClimbing) {
    reasons.push("SeAt security-attribute objects climbing");
  }
  if (flags.minifilterHeld) {
    reasons.push(
      "wcifs/bindflt minifilters and CoworkVMService still attached; the gate is held",
    );
  }
  if (flags.unaccounted) {
    reasons.push(
      `unaccounted driver-allocated paged pool ${ticket.unaccountedGB ?? UNACCOUNTED_GB} GB vs user-mode ${ticket.userModePagedGB ?? USER_MODE_PAGED_GB} GB`,
    );
  }
  if (flags.janky) {
    reasons.push(
      `UI jank ${ticket.uiJankMs ?? UI_JANK_MS_SEEDED} ms; paged pool >~5 GB stalls window dragging / Alt+Tab / input`,
    );
  }
  if (flags.rebootOnly) {
    reasons.push("only a full system restart reclaims the pond; no user-mode process to kill");
  }
  if (flags.stackOff && verdict !== "drained") {
    reasons.push("Cowork stack OFF; A/B strip shows Toke −50% / File −60% versus ON");
  }
  if (flags.pooled || verdict === "pooled") {
    reasons.push(HYPOTHESIS_NOTE);
    reasons.push(CONTRAST_NOTE);
  }
  if (flags.cousinOnly || flags.cousinName) {
    reasons.push(
      `cousin ${flags.cousinName || "named"} is not Sluice; do not conflate NtFC family cites with #91265 Toke/File/SeAt`,
    );
  }
  if (verdict !== "drained" && verdict !== "stack-off") {
    reasons.push(PHRASE);
  }
  return reasons;
}

function pickVerdict(seed, flags) {
  const named = canonicalSeed(seed);
  if (flags.cousinOnly && named !== "ntfC-cousin" && named !== "watchdog") {
    return IDLE_WORD;
  }
  if (named === IDLE_WORD && flags.drained) return "drained";
  if (named === SEEDED_WORD) return "pooled";
  if (VERDICTS.includes(named) && named !== IDLE_WORD) return named;
  if (flags.pooled) return "pooled";
  if (flags.tokeClimbing && !flags.fileClimbing && !flags.seatClimbing) {
    return "toke-climbing";
  }
  if (flags.fileClimbing && !flags.tokeClimbing) return "file-climbing";
  if (flags.seatClimbing && !flags.tokeClimbing && !flags.fileClimbing) {
    return "seat-climbing";
  }
  if (flags.minifilterHeld && !flags.pooled && !flags.unaccounted) {
    return "minifilter-held";
  }
  if (flags.unaccounted && !flags.pooled) return "unaccounted";
  if (flags.janky && !flags.pooled) return "janky";
  if (flags.rebootOnly && !flags.pooled) return "reboot-only";
  if (flags.stackOff && flags.quietRates && !flags.pooled && /stack-off/i.test(String(seed || ""))) {
    return "stack-off";
  }
  if (flags.drained) return "drained";
  return "drained";
}

function pondOf(flags, ticket, verdict) {
  if (verdict === "pooled" || flags.pooled) {
    return {
      gate: "closed — the sluice is held; the pond is rising",
      pond: "flood — Toke/File/SeAt overtop the mill deck",
      race: `ON ${ticket.tokeRatePerSec ?? TOKE_RATE_ON} Toke/s · ${ticket.fileRatePerSec ?? FILE_RATE_ON} File/s`,
      jank: `${ticket.uiJankMs ?? UI_JANK_MS_SEEDED} ms drag on the millstone`,
      note: PHRASE,
    };
  }
  if (verdict === "stack-off" || (flags.stackOff && !flags.pooled)) {
    return {
      gate: "open — Cowork stack OFF; the race is gated",
      pond: "held — A/B cut Toke −50% / File −60%",
      race: `OFF ${ticket.tokeRatePerSec ?? TOKE_RATE_OFF} Toke/s · ${ticket.fileRatePerSec ?? FILE_RATE_OFF} File/s`,
      jank: `${ticket.uiJankMs ?? 0} ms`,
      note: "Stack-off: the pond is held, not flooding.",
    };
  }
  if (flags.cousinOnly) {
    return {
      gate: "cousin race — NtFC family, not this pond",
      pond: "not the Toke/File/SeAt millrace",
      race: `cousin ${flags.cousinName}`,
      jank: "n/a",
      note: `Cousin ${flags.cousinName}: not the #91265 paged-pool pond.`,
    };
  }
  return {
    gate: "open — the sluice is draining",
    pond: "low — pool tags quiet after reboot or stack OFF",
    race: "quiet · Toke 6,499 / File 33,913 / SeAt 34,111",
    jank: "responsive",
    note: "Drained: pool tags quiet; Cowork stack OFF or freshly rebooted; UI responsive.",
  };
}

export function analyze(input) {
  const ticket = normalize(input);
  const flags = flagsOf(ticket);
  const chips = chipsOf(ticket);
  const seed = String(ticket.seed || "");
  const verdict = pickVerdict(seed, flags);
  const hold = HOLD_VERDICTS.includes(verdict);
  return {
    verdict,
    chips,
    reasons: reasonsOf(ticket, flags, verdict),
    drained: verdict === "drained" || flags.drained,
    pooled: verdict === "pooled" || flags.pooled,
    hold,
    alarm: !hold,
    idleWord: IDLE_WORD,
    seededWord: SEEDED_WORD,
    flags,
    contrast: pondOf(flags, ticket, verdict),
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
  if (name === SEEDED_WORD || name === 91265 || name === "91265") {
    return analyze(seedPooled());
  }
  if (name === "toke-climbing") return analyze(seedTokeClimbing());
  if (name === "file-climbing") return analyze(seedFileClimbing());
  if (name === "seat-climbing") return analyze(seedSeatClimbing());
  if (name === "minifilter-held") return analyze(seedMinifilterHeld());
  if (name === "unaccounted") return analyze(seedUnaccounted());
  if (name === "janky") return analyze(seedJanky());
  if (name === "reboot-only") return analyze(seedRebootOnly());
  if (name === "stack-off") return analyze(seedStackOff());
  if (name === "ntfC-cousin" || name === "ntfc") return analyze(seedNtfCCousin());
  if (name === "watchdog") return analyze(seedWatchdog());
  if (name === IDLE_WORD || name === "drained") {
    return analyze(seedDrained());
  }
  if (COUSIN_BY_ISSUE[name] || SEED_FNS[name]) {
    const fn = SEED_FNS[name] || (() => seedCousin(name));
    return analyze(fn());
  }
  return analyze(seedDrained());
}

export function handle(input) {
  const result = analyze(input);
  return {
    ...result,
    hookSpecificOutput: {
      additionalContext:
        result.verdict === "pooled" || (result.pooled && result.alarm)
          ? `pooled millrace #${FEATURED_ISSUE}: Toke ${TOKE_OBJECTS_FLOOD} (~${TOKE_MB_FLOOD} MB) ~${TOKE_RATE_ON}/s; File ${FILE_OBJECTS_FLOOD} (~${FILE_MB_FLOOD} MB) ~${FILE_RATE_ON}/s; SeAt ${SEAT_OBJECTS_FLOOD} (~${SEAT_MB_FLOOD} MB); unaccounted ${UNACCOUNTED_GB} GB vs user-mode ${USER_MODE_PAGED_GB} GB. ${HYPOTHESIS_NOTE}`
          : result.verdict === "toke-climbing"
            ? "toke-climbing. Toke objects rising at a sustained rate. Score the race."
            : result.verdict === "file-climbing"
              ? "file-climbing. File objects rising at a sustained rate. Score the race."
              : result.verdict === "stack-off"
                ? "stack-off. Cowork stack OFF. A/B cuts Toke −50% / File −60%. Hold."
                : `drained race. Idle word ${IDLE_WORD}. Pool tags quiet; Cowork stack OFF or freshly rebooted; UI responsive.`,
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
