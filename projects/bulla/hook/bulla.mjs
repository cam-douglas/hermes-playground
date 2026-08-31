#!/usr/bin/env node
/**
 * Bulla — papal lead-bulla / sealed-package assay-desk scorer.
 * A broken seal is not a hold. Score the lead or admit sealed.
 *
 *   echo '{"inPlaceWrite":true,"catPresent":false,"event3010":true}' | node bulla.mjs
 *   node bulla.mjs ticket.json
 *
 * Idle word is sealed.
 * Seeded state is blown / #90891.
 * NEVER idle as "bulla", "wax", "lead", "papal", "chancery",
 * "msix", "package", "gpu", "cat", "desktop".
 *
 * Primary #90891: Claude Desktop (Windows MSIX) updater writes files
 * in place inside the immutable MSIX package directory
 * (C:\Program Files\WindowsApps\Claude_…), which invalidates package
 * code integrity. AppxMetadata\CodeIntegrity.cat goes missing;
 * Windows Code Integrity Event 3010 (STATUS_OBJECT_PATH_NOT_FOUND
 * 0xC000003A) then Event 3033 blocks claude.exe loading
 * app\vk_swiftshader.dll (Chromium SwiftShader). GPU process dies
 * (GPU process gone … exitCode: 101457950), Electron tears down the
 * whole app, and every embedded Claude Code session is killed.
 * Package status: Modified, NeedsRemediation. Standalone unpackaged
 * Claude Code is unaffected.
 *
 * SEALED if cat present, no in-place write, GPU alive, sessions
 * running, package Ok.
 * BLOWN if in-place mutate of the sealed MSIX → catalog missing →
 * Event 3010 → Event 3033 → GPU dead → sessions killed.
 *
 * NOT Wraith #90373, Carcase #90867, Damper #90874/#90877,
 * Livery #90748, Trompe #90881, Davy #90886, Assay, Sigil.
 * Same-class cite (not primary): #89112, #81341, #89016.
 * Updater-family (different symptom): #81875, #89687.
 * Cross: electron/electron#51761 (GPU goodbye on Windows; zombie
 * SID DACL, not catalog-missing).
 */

import { readFileSync } from "node:fs";
import { stdin } from "node:process";
import { pathToFileURL } from "node:url";

export const VERDICTS = Object.freeze([
  "sealed",
  "blown",
  "in-place",
  "cat-missing",
  "gpu-dead",
  "sessions-killed",
  "needs-remediation",
  "unpackaged-clear",
  "swiftshader-blocked",
  "catalog-void",
  "event-3010",
  "event-3033",
]);
export const IDLE_WORD = "sealed";
export const SEED_ALIASES = Object.freeze({
  90891: "blown",
});
export const HOLD_VERDICTS = Object.freeze(["sealed"]);
export const ALARM_VERDICTS = Object.freeze([
  "blown",
  "in-place",
  "cat-missing",
  "gpu-dead",
  "sessions-killed",
  "needs-remediation",
  "unpackaged-clear",
  "swiftshader-blocked",
  "catalog-void",
  "event-3010",
  "event-3033",
]);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FEATURED_ISSUE = 90891;
export const PRIMARY_ISSUES = Object.freeze([90891]);
export const SAME_CLASS = Object.freeze([89112, 81341, 89016]);
export const UPDATER_FAMILY = Object.freeze([81875, 89687]);
export const ELECTRON_CROSS = Object.freeze([51761]);
export const NOT_PRODUCTS = Object.freeze([
  "wraith",
  "carcase",
  "damper",
  "livery",
  "trompe",
  "davy",
  "assay",
  "sigil",
]);
export const REJECTED_THIS_HOUR = Object.freeze([
  90889, 90890, 90874, 90877, 90881, 90886, 90893, 90895, 90882, 90892, 90896, 90900,
]);
export const DESKTOP = "1.40609.0.0";
export const PACKAGE_FAMILY = "Claude_1.40609.0.0_x64__pzs8sxrjxfjjc";
export const SIGNATURE_KIND = "Developer";
export const EMBEDDED_CC = "2.1.247";
export const STANDALONE_CC = "2.1.251";
export const PLATFORM = "windows";
export const OS_NAME = "Windows 11 Home";
export const WIN_BUILD = "26200";
export const GPU = "NVIDIA GeForce RTX 5060 Ti";
export const GPU_DRIVER = "32.0.16.1088";
export const FILED_AT = "2026-08-31T04:07:51Z";
export const REPORTER = "gsl0001";
export const TITLE =
  "Claude Desktop (Windows MSIX) updater modifies package in place, breaking code integrity; blocked vk_swiftshader.dll load crashes GPU process and kills all embedded Claude Code sessions";
export const ISSUE_URL = "https://github.com/anthropics/claude-code/issues/90891";
export const LABELS = Object.freeze([
  "bug",
  "has repro",
  "platform:windows",
  "area:desktop",
]);
export const CRASH_DATE = "2026-08-30";
export const CRASH_TIMES = Object.freeze([
  "16:46:30",
  "17:00:51",
  "17:09:21",
  "17:26:42",
  "20:09:29",
]);
export const EXIT_CODE = 101457950;
export const STATUS_PATH_NOT_FOUND = "0xC000003A";
export const EVENT_3010 = 3010;
export const EVENT_3033 = 3033;
export const CAT_PATH = "AppxMetadata\\CodeIntegrity.cat";
export const DLL_PATH = "app\\vk_swiftshader.dll";
export const SIGNER = "Anthropic, PBC";
export const PACKAGE_STATUS_BLOWN = "Modified, NeedsRemediation";
export const PACKAGE_STATUS_OK = "Ok";
export const INSTALL_AT = "2026-08-28 08:02";
export const REWRITE_AT = "2026-08-30 21:01–21:02";
export const GPU_DLLS = Object.freeze([
  "vk_swiftshader.dll",
  "vulkan-1.dll",
  "libGLESv2.dll",
  "libEGL.dll",
  "ffmpeg.dll",
  "dxil.dll",
  "dxcompiler.dll",
  "d3dcompiler_47.dll",
]);
export const PHRASE = "A broken seal is not a hold. Score the lead or admit sealed.";
export const MARK = "15:50 / hermes catalog #89 / #90891";
export const HUB_LINE = "15:50 bulla: a broken seal is not a hold. Score the lead or admit sealed.";

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

function firstArr(...values) {
  for (const value of values) {
    if (Array.isArray(value)) return value;
  }
  return [];
}

function packageNeedsRemediation(status) {
  const text = String(status || "");
  return /needsremediation|modified/i.test(text);
}

function packageIsOk(status) {
  const text = String(status || "").trim();
  if (!text) return true;
  return /^(ok|sealed|intact)$/i.test(text);
}

export function emptyTicket() {
  return seedBlown();
}

export function cloneTicket(input) {
  const src = input && typeof input === "object" && !Array.isArray(input) ? input : {};
  const nested =
    (src.ticket && typeof src.ticket === "object" && src.ticket) ||
    (src.bulla && typeof src.bulla === "object" && src.bulla) ||
    (src.probe && typeof src.probe === "object" && src.probe) ||
    (src.seal && typeof src.seal === "object" && src.seal) ||
    src;
  return {
    issue: firstNum(nested.issue, src.issue, nested.seed, src.seed) ?? FEATURED_ISSUE,
    seed: firstText(nested.seed, src.seed),
    inPlaceWrite: firstBool(
      nested.inPlaceWrite,
      nested.in_place_write,
      nested.inPlace,
      nested.inplace,
      src.inPlaceWrite,
    ),
    catPresent: firstBool(
      nested.catPresent,
      nested.cat_present,
      nested.codeIntegrityCat,
      nested.catalogPresent,
      src.catPresent,
    ),
    event3010: firstBool(nested.event3010, nested.event_3010, src.event3010),
    event3033: firstBool(nested.event3033, nested.event_3033, src.event3033),
    gpuCrashed: firstBool(
      nested.gpuCrashed,
      nested.gpu_crashed,
      nested.gpuDead,
      src.gpuCrashed,
    ),
    sessionsKilled: firstBool(
      nested.sessionsKilled,
      nested.sessions_killed,
      nested.embeddedKilled,
      src.sessionsKilled,
    ),
    packageStatus: firstText(
      nested.packageStatus,
      nested.package_status,
      nested.status,
      src.packageStatus,
    ),
    unpackagedOk: firstBool(
      nested.unpackagedOk,
      nested.unpackaged_ok,
      nested.standaloneOk,
      src.unpackagedOk,
    ),
    dllBlocked: firstBool(
      nested.dllBlocked,
      nested.dll_blocked,
      nested.swiftshaderBlocked,
      src.dllBlocked,
    ),
    exitCode: firstNum(nested.exitCode, nested.exit_code, src.exitCode),
    crashTimes: firstArr(nested.crashTimes, nested.crash_times, src.crashTimes),
    desktopVersion: firstText(
      nested.desktopVersion,
      nested.desktop_version,
      nested.desktop,
      src.desktopVersion,
    ),
    embeddedCli: firstText(nested.embeddedCli, nested.embedded_cli, src.embeddedCli),
    standaloneCli: firstText(
      nested.standaloneCli,
      nested.standalone_cli,
      src.standaloneCli,
    ),
    packageFamily: firstText(
      nested.packageFamily,
      nested.package_family,
      src.packageFamily,
    ),
    platform: firstText(nested.platform, src.platform) || "",
    outputText: firstText(
      nested.outputText,
      nested.output,
      nested.result,
      nested.text,
      src.outputText,
    ),
    title: firstText(nested.title, src.title),
    url: firstText(nested.url, src.url),
    filedAt: firstText(nested.filedAt, nested.filed_at, src.filedAt),
    labels: firstArr(nested.labels, src.labels),
    reporter: firstText(nested.reporter, src.reporter),
  };
}

export function isSealedHold(ticket) {
  const row = cloneTicket(ticket);
  const noWrite = row.inPlaceWrite !== true;
  const catOk = row.catPresent !== false;
  const no3010 = row.event3010 !== true;
  const no3033 = row.event3033 !== true;
  const gpuAlive = row.gpuCrashed !== true;
  const sessionsAlive = row.sessionsKilled !== true;
  const packageOk = !packageNeedsRemediation(row.packageStatus) && packageIsOk(row.packageStatus);
  const dllOk = row.dllBlocked !== true;
  return noWrite && catOk && no3010 && no3033 && gpuAlive && sessionsAlive && packageOk && dllOk;
}

export function isBlownSignature(ticket) {
  const row = cloneTicket(ticket);
  return (
    row.inPlaceWrite === true &&
    row.catPresent === false &&
    row.event3010 === true &&
    row.event3033 === true &&
    row.gpuCrashed === true &&
    row.sessionsKilled === true &&
    (packageNeedsRemediation(row.packageStatus) || row.dllBlocked === true)
  );
}

export function analyze(input) {
  const row = cloneTicket(input);
  const text = row.outputText || "";
  const inPlace =
    row.inPlaceWrite === true ||
    /in[- ]place (write|mutate|modif)/i.test(text);
  const catMissing =
    row.catPresent === false ||
    /cat (missing|absent|void)|CodeIntegrity\.cat.*(missing|absent|False)|catalog[- ]void/i.test(text);
  const catalogVoid = catMissing || /catalog[- ]void|no AppxMetadata/i.test(text);
  const ev3010 =
    row.event3010 === true ||
    /event\s*3010|0xC000003A|STATUS_OBJECT_PATH_NOT_FOUND/i.test(text);
  const ev3033 =
    row.event3033 === true ||
    /event\s*3033|signing-level|did not meet Microsoft/i.test(text);
  const swiftshader =
    row.dllBlocked === true ||
    /vk_swiftshader|swiftshader[- ]blocked|dll blocked/i.test(text);
  const gpuDead =
    row.gpuCrashed === true ||
    row.exitCode === EXIT_CODE ||
    /gpu process gone|gpu[- ]dead|exitCode:\s*101457950/i.test(text);
  const sessionsDead =
    row.sessionsKilled === true ||
    /sessions? (killed|torn)|embedded .* killed|Electron tears down/i.test(text);
  const needsRemediation =
    packageNeedsRemediation(row.packageStatus) ||
    /needsremediation|needs-remediation|Modified, NeedsRemediation/i.test(text);
  const unpackagedClear =
    row.unpackagedOk === true ||
    /unpackaged|standalone .* (ok|unaffected|clear)|unpackaged-clear/i.test(text);
  const blown = isBlownSignature(row);
  const sealed = isSealedHold(row);
  return {
    row,
    sealed,
    blown,
    inPlace,
    catMissing,
    gpuDead,
    sessionsDead,
    needsRemediation,
    unpackagedClear,
    swiftshader,
    catalogVoid,
    event3010: ev3010,
    event3033: ev3033,
    featured: row.issue === FEATURED_ISSUE && blown,
    chips: collectChips({
      sealed,
      blown,
      inPlace,
      catMissing,
      gpuDead,
      sessionsDead,
      needsRemediation,
      unpackagedClear,
      swiftshader,
      catalogVoid,
      event3010: ev3010,
      event3033: ev3033,
    }),
  };
}

function collectChips(flags) {
  const chips = [];
  if (flags.sealed) chips.push("sealed");
  if (flags.blown) chips.push("blown");
  if (flags.inPlace) chips.push("in-place");
  if (flags.catMissing) chips.push("cat-missing");
  if (flags.gpuDead) chips.push("gpu-dead");
  if (flags.sessionsDead) chips.push("sessions-killed");
  if (flags.needsRemediation) chips.push("needs-remediation");
  if (flags.unpackagedClear) chips.push("unpackaged-clear");
  if (flags.swiftshader) chips.push("swiftshader-blocked");
  if (flags.catalogVoid) chips.push("catalog-void");
  if (flags.event3010) chips.push("event-3010");
  if (flags.event3033) chips.push("event-3033");
  return [...new Set(chips)];
}

export function classify(input) {
  const facts = analyze(input);
  const rawSeed = String(facts.row.seed || "").toLowerCase();
  const aliasFromIssue = SEED_ALIASES[facts.row.issue];
  const seed = SEED_ALIASES[rawSeed] || rawSeed;
  if (facts.sealed && !ALARM_VERDICTS.includes(seed)) return "sealed";
  if (ALARM_VERDICTS.includes(seed)) return seed;
  if (aliasFromIssue === "blown" && facts.blown) return "blown";
  if (facts.featured || facts.blown) return "blown";
  if (facts.inPlace && facts.catMissing && facts.gpuDead) return "blown";
  if (facts.inPlace) return "in-place";
  if (facts.catMissing) return "cat-missing";
  if (facts.event3010 && !facts.event3033) return "event-3010";
  if (facts.event3033) return "event-3033";
  if (facts.swiftshader) return "swiftshader-blocked";
  if (facts.gpuDead) return "gpu-dead";
  if (facts.sessionsDead) return "sessions-killed";
  if (facts.needsRemediation) return "needs-remediation";
  if (facts.catalogVoid) return "catalog-void";
  if (facts.unpackagedClear) return "unpackaged-clear";
  if (facts.sealed) return "sealed";
  return "sealed";
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
    sealed: verdict === "sealed" || facts.sealed,
    blown: verdict === "blown" || facts.blown,
    hold,
    alarm: !hold,
    idleWord: IDLE_WORD,
    issue: facts.row.issue ?? FEATURED_ISSUE,
    chips: facts.chips,
    facts: {
      inPlaceWrite: facts.row.inPlaceWrite,
      catPresent: facts.row.catPresent,
      event3010: facts.event3010,
      event3033: facts.event3033,
      gpuCrashed: facts.gpuDead,
      sessionsKilled: facts.sessionsDead,
      packageStatus: facts.row.packageStatus,
      unpackagedOk: facts.row.unpackagedOk,
      dllBlocked: facts.swiftshader,
      blown: facts.blown,
    },
    reasons: reasonsOf(facts, verdict),
    feed: feedOf(verdict),
    ticket: facts.row,
  };
}

export function feedOf(kind) {
  if (kind === "sealed") {
    return "● Sealed · intact MSIX seal, CodeIntegrity.cat present, GPU alive, embedded sessions running · hold";
  }
  if (kind === "in-place") {
    return "● In-place · updater wrote files inside the immutable WindowsApps package directory · alarm";
  }
  if (kind === "cat-missing") {
    return "● Cat-missing · AppxMetadata\\CodeIntegrity.cat absent (Test-Path = False) · alarm";
  }
  if (kind === "gpu-dead") {
    return "● Gpu-dead · GPU process gone … exitCode: 101457950 · alarm";
  }
  if (kind === "sessions-killed") {
    return "● Sessions-killed · Electron tore down the app; every embedded Claude Code session died · alarm";
  }
  if (kind === "needs-remediation") {
    return "● Needs-remediation · package status Modified, NeedsRemediation · alarm";
  }
  if (kind === "unpackaged-clear") {
    return "● Unpackaged-clear · standalone unpackaged Claude Code 2.1.251 stays clear · witness";
  }
  if (kind === "swiftshader-blocked") {
    return "● Swiftshader-blocked · claude.exe blocked loading app\\vk_swiftshader.dll · alarm";
  }
  if (kind === "catalog-void") {
    return "● Catalog-void · per-file CI catalog missing; package integrity cannot validate · alarm";
  }
  if (kind === "event-3010") {
    return "● Event-3010 · Code Integrity unable to load CodeIntegrity.cat — 0xC000003A STATUS_OBJECT_PATH_NOT_FOUND · alarm";
  }
  if (kind === "event-3033") {
    return "● Event-3033 · claude.exe load of app\\vk_swiftshader.dll failed Microsoft signing-level · alarm";
  }
  return "● Blown · in-place mutate of sealed MSIX → cat missing → 3010 → 3033 → GPU dead → sessions killed · alarm";
}

export function reasonsOf(facts, kind) {
  const reasons = [`verdict ${kind}`];
  if (kind === "sealed") {
    reasons.push("intact MSIX seal; CodeIntegrity.cat present; GPU alive; embedded sessions running");
    reasons.push("hold: this is a sealed lead, not a broken bulla");
  }
  if (!HOLD_VERDICTS.includes(kind) && kind !== "unpackaged-clear") {
    reasons.push(
      "#90891 Claude Desktop (Windows MSIX) updater modifies package in place, breaking code integrity; blocked vk_swiftshader.dll load crashes GPU process and kills all embedded Claude Code sessions",
    );
  }
  if (kind === "unpackaged-clear") {
    reasons.push("standalone unpackaged Claude Code 2.1.251 is unaffected; only the packaged Desktop host dies");
  }
  if (facts.row.inPlaceWrite === true) {
    reasons.push(
      "updater wrote files in place inside C:\\Program Files\\WindowsApps\\Claude_… — the immutable MSIX package directory",
    );
  }
  if (facts.catMissing) {
    reasons.push("AppxMetadata\\CodeIntegrity.cat is absent (Test-Path = False), even after remediation can return Status: Ok");
  }
  if (facts.event3010) {
    reasons.push(
      `Event ${EVENT_3010}: Code Integrity was unable to load ${CAT_PATH} — status ${STATUS_PATH_NOT_FOUND} (STATUS_OBJECT_PATH_NOT_FOUND)`,
    );
  }
  if (facts.event3033) {
    reasons.push(
      `Event ${EVENT_3033}: claude.exe attempted to load ${DLL_PATH} but it did not meet Microsoft signing-level requirements`,
    );
  }
  if (facts.swiftshader) {
    reasons.push(
      `${DLL_PATH} carries a valid Authenticode signature (CN="${SIGNER}") — only the package catalog validation fails`,
    );
  }
  if (facts.gpuDead) {
    reasons.push(
      `GPU process gone: type: GPU, reason: crashed, exitCode: ${facts.row.exitCode ?? EXIT_CODE}, serviceName: GPU`,
    );
  }
  if (facts.sessionsDead) {
    reasons.push("Electron tore down the whole Desktop app; every embedded Claude Code session was killed");
  }
  if (facts.needsRemediation) {
    reasons.push(`package status observed: ${facts.row.packageStatus || PACKAGE_STATUS_BLOWN}`);
  }
  if (facts.unpackagedClear) {
    reasons.push(`standalone unpackaged Claude Code ${facts.row.standaloneCli || STANDALONE_CC} stays clear`);
  }
  if ((facts.row.crashTimes || []).length) {
    reasons.push(
      `five crashes ${CRASH_DATE} local: ${(facts.row.crashTimes || CRASH_TIMES).join(", ")}`,
    );
  }
  if (facts.row.desktopVersion === DESKTOP || facts.row.packageFamily === PACKAGE_FAMILY) {
    reasons.push(
      `Desktop ${DESKTOP} (${PACKAGE_FAMILY}, SignatureKind: ${SIGNATURE_KIND}); embedded CC ${EMBEDDED_CC}`,
    );
  }
  return reasons;
}

function baseSeed(seed) {
  return {
    seed,
    issue: FEATURED_ISSUE,
    title: TITLE,
    url: ISSUE_URL,
    filedAt: FILED_AT,
    labels: [...LABELS],
    reporter: REPORTER,
    inPlaceWrite: true,
    catPresent: false,
    event3010: true,
    event3033: true,
    gpuCrashed: true,
    sessionsKilled: true,
    packageStatus: PACKAGE_STATUS_BLOWN,
    unpackagedOk: true,
    dllBlocked: true,
    exitCode: EXIT_CODE,
    crashTimes: [...CRASH_TIMES],
    desktopVersion: DESKTOP,
    embeddedCli: EMBEDDED_CC,
    standaloneCli: STANDALONE_CC,
    packageFamily: PACKAGE_FAMILY,
    signatureKind: SIGNATURE_KIND,
    platform: PLATFORM,
    os: OS_NAME,
    winBuild: WIN_BUILD,
    gpu: GPU,
    gpuDriver: GPU_DRIVER,
    installAt: INSTALL_AT,
    rewriteAt: REWRITE_AT,
    catPath: CAT_PATH,
    dllPath: DLL_PATH,
    signer: SIGNER,
    outputText:
      "updater wrote in place inside WindowsApps; CodeIntegrity.cat missing; Event 3010 0xC000003A; Event 3033 blocked vk_swiftshader.dll; GPU process gone exitCode 101457950; Electron tore down; every embedded session killed; package Modified, NeedsRemediation; standalone unpackaged 2.1.251 clear",
  };
}

export function seedBlown() {
  return {
    ...baseSeed("blown"),
  };
}

export function seedSealed() {
  return {
    ...baseSeed("sealed"),
    inPlaceWrite: false,
    catPresent: true,
    event3010: false,
    event3033: false,
    gpuCrashed: false,
    sessionsKilled: false,
    packageStatus: PACKAGE_STATUS_OK,
    unpackagedOk: true,
    dllBlocked: false,
    exitCode: null,
    crashTimes: [],
    outputText:
      "intact MSIX seal; CodeIntegrity.cat present; GPU alive; embedded sessions running; package Ok",
  };
}

export function seedInPlace() {
  return {
    ...baseSeed("in-place"),
    catPresent: true,
    event3010: false,
    event3033: false,
    gpuCrashed: false,
    sessionsKilled: false,
    packageStatus: PACKAGE_STATUS_OK,
    dllBlocked: false,
    exitCode: null,
    crashTimes: [],
    outputText: "updater wrote files in place inside the immutable WindowsApps package directory",
  };
}

export function seedCatMissing() {
  return {
    ...baseSeed("cat-missing"),
    inPlaceWrite: false,
    event3010: false,
    event3033: false,
    gpuCrashed: false,
    sessionsKilled: false,
    packageStatus: PACKAGE_STATUS_OK,
    dllBlocked: false,
    exitCode: null,
    crashTimes: [],
    outputText: "AppxMetadata\\CodeIntegrity.cat is absent (Test-Path = False)",
  };
}

export function seedGpuDead() {
  return {
    ...baseSeed("gpu-dead"),
    inPlaceWrite: false,
    catPresent: true,
    event3010: false,
    event3033: false,
    sessionsKilled: false,
    packageStatus: PACKAGE_STATUS_OK,
    dllBlocked: false,
    outputText: "GPU process gone: type: GPU, reason: crashed, exitCode: 101457950, serviceName: GPU",
  };
}

export function seedSessionsKilled() {
  return {
    ...baseSeed("sessions-killed"),
    inPlaceWrite: false,
    catPresent: true,
    event3010: false,
    event3033: false,
    gpuCrashed: false,
    packageStatus: PACKAGE_STATUS_OK,
    dllBlocked: false,
    exitCode: null,
    crashTimes: [],
    outputText: "Electron tore down the whole app; every embedded Claude Code session was killed",
  };
}

export function seedNeedsRemediation() {
  return {
    ...baseSeed("needs-remediation"),
    inPlaceWrite: false,
    catPresent: true,
    event3010: false,
    event3033: false,
    gpuCrashed: false,
    sessionsKilled: false,
    dllBlocked: false,
    exitCode: null,
    crashTimes: [],
    outputText: "package status observed: Modified, NeedsRemediation",
  };
}

export function seedUnpackagedClear() {
  return {
    ...baseSeed("unpackaged-clear"),
    inPlaceWrite: false,
    catPresent: true,
    event3010: false,
    event3033: false,
    gpuCrashed: false,
    sessionsKilled: false,
    packageStatus: PACKAGE_STATUS_OK,
    dllBlocked: false,
    exitCode: null,
    crashTimes: [],
    outputText: "standalone unpackaged Claude Code 2.1.251 is unaffected",
  };
}

export function seedSwiftshaderBlocked() {
  return {
    ...baseSeed("swiftshader-blocked"),
    inPlaceWrite: false,
    catPresent: true,
    event3010: false,
    event3033: false,
    gpuCrashed: false,
    sessionsKilled: false,
    packageStatus: PACKAGE_STATUS_OK,
    outputText: "claude.exe blocked loading app\\vk_swiftshader.dll (Chromium SwiftShader)",
  };
}

export function seedCatalogVoid() {
  return {
    ...baseSeed("catalog-void"),
    inPlaceWrite: false,
    event3010: false,
    event3033: false,
    gpuCrashed: false,
    sessionsKilled: false,
    packageStatus: PACKAGE_STATUS_OK,
    dllBlocked: false,
    exitCode: null,
    crashTimes: [],
    outputText: "per-file CI catalog missing; package integrity cannot validate; catalog-void",
  };
}

export function seedEvent3010() {
  return {
    ...baseSeed("event-3010"),
    inPlaceWrite: false,
    catPresent: true,
    event3033: false,
    gpuCrashed: false,
    sessionsKilled: false,
    packageStatus: PACKAGE_STATUS_OK,
    dllBlocked: false,
    exitCode: null,
    crashTimes: [],
    outputText:
      "Event 3010: Code Integrity was unable to load CodeIntegrity.cat — status 0xC000003A STATUS_OBJECT_PATH_NOT_FOUND",
  };
}

export function seedEvent3033() {
  return {
    ...baseSeed("event-3033"),
    inPlaceWrite: false,
    catPresent: true,
    event3010: false,
    gpuCrashed: false,
    sessionsKilled: false,
    packageStatus: PACKAGE_STATUS_OK,
    dllBlocked: false,
    exitCode: null,
    crashTimes: [],
    outputText:
      "Event 3033: claude.exe attempted to load app\\vk_swiftshader.dll but it did not meet Microsoft signing-level requirements",
  };
}

export function decideSeed(name) {
  const key = String(name || "").toLowerCase();
  const mapped = SEED_ALIASES[key] || key;
  const seeds = {
    sealed: seedSealed,
    blown: seedBlown,
    "in-place": seedInPlace,
    "cat-missing": seedCatMissing,
    "gpu-dead": seedGpuDead,
    "sessions-killed": seedSessionsKilled,
    "needs-remediation": seedNeedsRemediation,
    "unpackaged-clear": seedUnpackagedClear,
    "swiftshader-blocked": seedSwiftshaderBlocked,
    "catalog-void": seedCatalogVoid,
    "event-3010": seedEvent3010,
    "event-3033": seedEvent3033,
    90891: seedBlown,
  };
  const fn = seeds[key] || seeds[mapped];
  return score(fn ? fn() : seedBlown());
}

export function decide(payload = {}) {
  const action = String(payload.action || payload.bulla?.action || "").toLowerCase();
  if (action && action !== "score") return decideSeed(action);
  const ticket = payload.ticket || payload.bulla || payload.probe || payload;
  return score(ticket);
}

export function verdictOf(input) {
  return classify(input);
}

export function parseProbeLog(text) {
  const raw = String(text || "");
  const ticket = {
    inPlaceWrite: /in[- ]place|WindowsApps|LastWriteTime/i.test(raw),
    catPresent: /Test-Path\s*=\s*True|cat present|catalog present/i.test(raw)
      ? true
      : /Test-Path\s*=\s*False|cat (missing|absent)|unable to load .*CodeIntegrity\.cat/i.test(raw)
        ? false
        : null,
    event3010: /Event\s*3010|0xC000003A|STATUS_OBJECT_PATH_NOT_FOUND/i.test(raw),
    event3033: /Event\s*3033|signing-level|vk_swiftshader/i.test(raw),
    gpuCrashed: /GPU process gone|exitCode:\s*101457950/i.test(raw),
    sessionsKilled: /sessions? killed|embedded .* killed|tears down/i.test(raw),
    packageStatus: /NeedsRemediation/i.test(raw) ? PACKAGE_STATUS_BLOWN : "",
    unpackagedOk: /unpackaged|standalone/i.test(raw),
    dllBlocked: /vk_swiftshader|did not meet Microsoft/i.test(raw),
    outputText: raw.slice(0, 400),
  };
  return { ticket };
}

export function crashTimeline() {
  return CRASH_TIMES.map((time) => ({
    date: CRASH_DATE,
    time,
    event3010: {
      id: EVENT_3010,
      status: STATUS_PATH_NOT_FOUND,
      detail: `Code Integrity was unable to load ${PACKAGE_FAMILY}\\${CAT_PATH}`,
    },
    event3033: {
      id: EVENT_3033,
      detail: `claude.exe attempted to load ${DLL_PATH} but it did not meet Microsoft signing-level requirements`,
    },
    mainLog: `GPU process gone: type: GPU, reason: crashed, exitCode: ${EXIT_CODE}, serviceName: GPU`,
  }));
}

export async function handle(payload = {}) {
  const result = decide(payload);
  const deny = result.alarm;
  return {
    hook_event_name: "Stop",
    hookSpecificOutput: {
      hookEventName: "Stop",
      additionalContext: deny
        ? "Bulla blown. A broken seal is not a hold. #90891 Claude Desktop (Windows MSIX) updater wrote in place inside the immutable package; CodeIntegrity.cat missing; Event 3010 then 3033 blocked vk_swiftshader.dll; GPU dead; every embedded session killed. Score the lead or admit sealed."
        : "Bulla sealed. Intact MSIX seal; CodeIntegrity.cat present; GPU alive; embedded sessions running; package Ok.",
    },
    ...result,
  };
}

function parsePayload(raw) {
  const text = String(raw || "").trim();
  if (!text) return seedBlown();
  try {
    const parsed = JSON.parse(text);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return parsed.action || parsed.ticket || parsed.bulla || parsed.probe
        ? parsed
        : { action: "score", ticket: cloneTicket(parsed) };
    }
  } catch {
    return seedBlown();
  }
  return seedBlown();
}

function readStdin() {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stdin.on("data", (chunk) => chunks.push(chunk));
    stdin.on("end", () => {
      const raw = Buffer.concat(chunks).toString("utf8").trim();
      if (!raw) {
        resolve(seedBlown());
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
