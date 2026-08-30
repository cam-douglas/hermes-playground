/**
 * Livery — a tailor's household
 * livery wardrobe / uniform
 * fitting room for a real Claude
 * Code defect: the macOS Claude
 * desktop app runs bundled Claude
 * Code from a version-numbered
 * executable path
 *   ~/Library/Application Support/
 *   Claude/claude-code/<version>/
 *   claude.app/Contents/MacOS/claude
 * macOS TCC keys privacy grants
 * to the executable path. Every
 * desktop update creates a brand-
 * new path with zero grants → a
 * burst of permission dialogs
 * (often first thing after an
 * overnight update). The dialog
 * shows a bare version number
 * ("2.1.NNN wants to access files
 * managed by Dropbox") rather
 * than an app name — easy to
 * mistake for malware. Signing
 * identity is already stable
 * (Identifier=com.anthropic.claude-code,
 * Team Q6L2SF6YDW); only path
 * churn is the bug. FDA on
 * /Applications/Claude.app does
 * not cover the separately-pathed
 * bundled child.
 *
 * A new coat of the same house
 * is not a stranger. Score the
 * wardrobe or admit liveried.
 *
 * Primary #90748: OPEN, filed
 * 2026-08-30. Title: macOS:
 * desktop app's bundled Claude
 * Code uses a version-numbered
 * executable path, causing a
 * burst of TCC permission
 * prompts after every update.
 * Labels: bug, platform:macos,
 * area:packaging, area:desktop.
 * Claude desktop, bundled Claude
 * Code 2.1.247, macOS 26.x
 * Apple Silicon. Cloud mounts:
 * Dropbox, iCloud Drive, Google
 * Drive, CloudMounter.
 *
 * Same-class / earlier CLI path-
 * churn (cite as related, not
 * this product's primary):
 *   #49282 CLI ~/.local/share/
 *     claude/versions/<ver> TCC
 *     re-register.
 *   #74234 FDA prompts every
 *     auto-update (CLI versions/).
 *   #62240 MediaLibrary TCC every
 *     update, bare version name.
 *
 * Cross-ecosystem inspiration:
 *   mo22/tcc-venv — stable signed
 *   launcher for venv Python TCC
 *   identity.
 *
 * Why this is not a clone:
 * NOT Pinfold — Defender FileFix
 *     CmdLine EPERM (#90706).
 * NOT Palimpsest — PreToolUse
 *     updatedInput scrape (#90725).
 * NOT Escutcheon — Linux /run/user
 *     tmpfs / keyring (#90717).
 * NOT Chatelaine — mcpOAuth nested
 *     in Keychain (#90647).
 * NOT Fob — keychain litter.
 * NOT Visa — OAuth destination.
 * NOT Sigil — hollow thinking seal.
 * NOT Hasp — file lease.
 * NOT Knock — permission grant stall.
 * NOT Slype — sandbox pwsh 126.
 * NOT Pleat — Desktop mid-turn fold
 *     collapse (pressing board).
 * Different problem: macOS
 * packaging / TCC path identity
 * for the desktop-bundled binary.
 * Different UI: household livery
 * wardrobe, not a village pound,
 * locksmith plate, scriptorium,
 * collation desk, or pressing board.
 * Different idle: liveried.
 *
 * Verdicts: liveried | prompted |
 *           path-churn |
 *           bare-version |
 *           tcc-orphan | fda-inert |
 *           cloud-mount |
 *           overnight-burst |
 *           signed-stable |
 *           stranger-path |
 *           version-folder |
 *           current-shim
 * Idle word is liveried (honest
 * control: launch from a stable
 * .../claude-code/current/... path;
 * TCC grants persist; no burst).
 * NEVER use liveried for a failure.
 */

export const VERDICTS = Object.freeze([
  "liveried",
  "prompted",
  "path-churn",
  "bare-version",
  "tcc-orphan",
  "fda-inert",
  "cloud-mount",
  "overnight-burst",
  "signed-stable",
  "stranger-path",
  "version-folder",
  "current-shim",
]);
export const IDLE_WORD = "liveried";
export const ALARM_VERDICTS = Object.freeze([
  "prompted",
  "path-churn",
  "bare-version",
  "tcc-orphan",
  "fda-inert",
  "cloud-mount",
  "overnight-burst",
  "stranger-path",
  "version-folder",
]);
export const FEATURED_ISSUE = 90748;
export const SAME_CLASS_49282 = 49282;
export const SAME_CLASS_74234 = 74234;
export const SAME_CLASS_62240 = 62240;
export const RELATED_PINFOLD = 90706;
export const RELATED_PALIMPSEST = 90725;
export const RELATED_ESCUTCHEON = 90717;
export const RELATED_CHATELAINE = 90647;
export const RELATED_SLYPE = 90676;

export const DEMO_VERSION = "2.1.247";
export const DEMO_PATH =
  "/Users/user/Library/Application Support/Claude/claude-code/2.1.247/claude.app/Contents/MacOS/claude";
export const DEMO_PREVIOUS =
  "/Users/user/Library/Application Support/Claude/claude-code/2.1.246/claude.app/Contents/MacOS/claude";
export const DEMO_CURRENT =
  "/Users/user/Library/Application Support/Claude/claude-code/current/claude.app/Contents/MacOS/claude";
export const DEMO_CLI_PATH =
  "/Users/user/.local/share/claude/versions/2.1.111";
export const DEMO_DIALOG =
  '"2.1.247" wants to access files managed by "Dropbox".';
export const DEMO_BUNDLE = "com.anthropic.claude-code";
export const DEMO_TEAM = "Q6L2SF6YDW";
export const DEMO_SIGNING =
  "Identifier=com.anthropic.claude-code\nAuthority=Developer ID Application: Anthropic PBC (Q6L2SF6YDW)\nTeamIdentifier=Q6L2SF6YDW";
export const DEMO_SERVICES = Object.freeze([
  "kTCCServiceFileProviderDomain",
  "SystemPolicyDownloadsFolder",
  "SystemPolicyDesktopFolder",
  "SystemPolicyDocumentsFolder",
  "SystemPolicyNetworkVolumes",
  "MediaLibrary",
  "Calendar",
]);
export const DEMO_MOUNTS = Object.freeze([
  "Dropbox",
  "iCloud Drive",
  "Google Drive",
  "CloudMounter",
]);
export const DEMO_DAY = "2026-08-30";
export const DEMO_MARK = "livery-wardrobe";
export const DEMO_PARENT_APP = "/Applications/Claude.app";

const FORBIDDEN_IDLE = Object.freeze([
  "livery",
  "pinfold",
  "penned",
  "palimpsest",
  "underwrit",
  "escutcheon",
  "plated",
  "lacuna",
  "collated",
  "ambo",
  "unheard",
  "slype",
  "passed",
  "squared",
  "bound",
  "girt",
  "sheltered",
  "alongside",
  "seated",
  "credited",
  "level",
  "verbatim",
  "fronted",
  "locked",
  "yanked",
  "caught",
  "posted",
  "bunged",
  "belayed",
  "rove",
  "keyed",
  "housed",
  "beamed",
  "snug",
  "hung",
  "appointed",
  "cinched",
  "gauged",
  "stamped",
  "overrun",
  "pratique",
  "wound",
  "fit",
  "spoilt",
  "laid",
  "unlinked",
  "tight",
  "banked",
  "roosted",
  "stocked",
  "heard",
  "clear",
  "paired",
  "empty",
  "mute",
  "idle",
  "silent",
  "flat",
  "pleat",
  "fob",
  "chatelaine",
  "visa",
  "sigil",
  "hasp",
  "knock",
]);

export function forbiddenIdleWords() {
  return FORBIDDEN_IDLE.slice();
}

function asText(value) {
  return value == null ? "" : String(value);
}

function asIssue(value) {
  if (value == null || value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : value;
}

function asBool(value, fallback = false) {
  if (value === true || value === false) return value;
  if (value == null || value === "") return fallback;
  if (typeof value === "string") {
    const low = value.toLowerCase();
    if (low === "true" || low === "yes" || low === "1") return true;
    if (low === "false" || low === "no" || low === "0") return false;
  }
  return Boolean(value);
}

function asNullableBool(value) {
  if (value === true || value === false) return value;
  if (value == null || value === "") return null;
  if (typeof value === "string") {
    const low = value.toLowerCase();
    if (low === "true" || low === "yes" || low === "1") return true;
    if (low === "false" || low === "no" || low === "0") return false;
  }
  return Boolean(value);
}

function asNullableNumber(value) {
  if (value == null || value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function asList(value) {
  if (Array.isArray(value)) return value.map((item) => String(item)).filter(Boolean);
  if (typeof value === "string" && value.trim()) {
    return value
      .split(/[,;\n|]+/)
      .map((part) => part.trim())
      .filter(Boolean);
  }
  return [];
}

export function emptyProbe() {
  return {
    session: "",
    issue: null,
    source: "",
    executablePath: "",
    previousPath: "",
    dialogText: "",
    tccObservation: "",
    parentFda: null,
    signingIdentity: "",
    teamId: "",
    bundleId: "",
    cloudMounts: [],
    services: [],
    overnight: null,
    grantsOnNewPath: null,
    grantsOnOldPath: null,
    launchedFrom: "",
    version: "",
    mistakenForMalware: null,
    nearby: "",
    nearbyPrompted: false,
    nearbyPathChurn: false,
    nearbyBareVersion: false,
    nearbyTccOrphan: false,
    nearbyFdaInert: false,
    nearbyCloudMount: false,
    nearbyOvernightBurst: false,
    nearbySignedStable: false,
    nearbyStrangerPath: false,
    nearbyVersionFolder: false,
    nearbyCurrentShim: false,
    scored: false,
  };
}

function nestObject(src) {
  if (src.livery && typeof src.livery === "object") return src.livery;
  if (src.probe && typeof src.probe === "object") return src.probe;
  if (src.wardrobe && typeof src.wardrobe === "object") return src.wardrobe;
  if (src.coat && typeof src.coat === "object") return src.coat;
  return src;
}

export function cloneProbe(input = {}) {
  const src = input && typeof input === "object" ? input : {};
  const nested = nestObject(src);
  const base = emptyProbe();
  return {
    ...base,
    ...nested,
    session: asText(nested.session || src.session || base.session),
    issue: asIssue(nested.issue ?? src.issue ?? base.issue),
    source: asText(nested.source || src.source || base.source),
    executablePath: asText(nested.executablePath || src.executablePath || src.path || ""),
    previousPath: asText(nested.previousPath || src.previousPath || ""),
    dialogText: asText(nested.dialogText || src.dialogText || src.dialog || ""),
    tccObservation: asText(nested.tccObservation || src.tccObservation || src.tcc || ""),
    parentFda: asNullableBool(nested.parentFda ?? src.parentFda),
    signingIdentity: asText(nested.signingIdentity || src.signingIdentity || ""),
    teamId: asText(nested.teamId || src.teamId || ""),
    bundleId: asText(nested.bundleId || src.bundleId || ""),
    cloudMounts: asList(nested.cloudMounts ?? src.cloudMounts ?? []),
    services: asList(nested.services ?? src.services ?? []),
    overnight: asNullableBool(nested.overnight ?? src.overnight),
    grantsOnNewPath: asNullableNumber(nested.grantsOnNewPath ?? src.grantsOnNewPath),
    grantsOnOldPath: asNullableNumber(nested.grantsOnOldPath ?? src.grantsOnOldPath),
    launchedFrom: asText(nested.launchedFrom || src.launchedFrom || ""),
    version: asText(nested.version || src.version || ""),
    mistakenForMalware: asNullableBool(nested.mistakenForMalware ?? src.mistakenForMalware),
    nearby: asText(nested.nearby || src.nearby || ""),
    nearbyPrompted: asBool(nested.nearbyPrompted ?? src.nearbyPrompted, false),
    nearbyPathChurn: asBool(nested.nearbyPathChurn ?? src.nearbyPathChurn, false),
    nearbyBareVersion: asBool(nested.nearbyBareVersion ?? src.nearbyBareVersion, false),
    nearbyTccOrphan: asBool(nested.nearbyTccOrphan ?? src.nearbyTccOrphan, false),
    nearbyFdaInert: asBool(nested.nearbyFdaInert ?? src.nearbyFdaInert, false),
    nearbyCloudMount: asBool(nested.nearbyCloudMount ?? src.nearbyCloudMount, false),
    nearbyOvernightBurst: asBool(nested.nearbyOvernightBurst ?? src.nearbyOvernightBurst, false),
    nearbySignedStable: asBool(nested.nearbySignedStable ?? src.nearbySignedStable, false),
    nearbyStrangerPath: asBool(nested.nearbyStrangerPath ?? src.nearbyStrangerPath, false),
    nearbyVersionFolder: asBool(nested.nearbyVersionFolder ?? src.nearbyVersionFolder, false),
    nearbyCurrentShim: asBool(nested.nearbyCurrentShim ?? src.nearbyCurrentShim, false),
    scored: asBool(nested.scored ?? src.scored, false),
  };
}

const VERSION_RE = /\b(\d+\.\d+\.\d+)\b/;
const DESKTOP_VERSIONED_RE =
  /Application Support\/Claude\/claude-code\/\d+\.\d+\.\d+\//i;
const CLI_VERSIONED_RE = /\.local\/share\/claude\/versions\/\d+\.\d+\.\d+/i;
const CURRENT_SHIM_RE = /claude-code\/current\//i;
const BARE_DIALOG_RE =
  /["“]?(\d+\.\d+\.\d+)["”]?\s+wants to access/i;
const CLOUD_RE = /Dropbox|iCloud|Google Drive|CloudMounter|FileProviderDomain/i;
const STRANGER_RE = /malware|mystery process|unknown process|stranger|unrecognized/i;

export function extractVersion(text) {
  const match = asText(text).match(VERSION_RE);
  return match ? match[1] : "";
}

export function looksVersionedDesktopPath(path) {
  return DESKTOP_VERSIONED_RE.test(asText(path));
}

export function looksCliVersionPath(path) {
  return CLI_VERSIONED_RE.test(asText(path));
}

export function looksCurrentShim(path, launchedFrom = "") {
  const from = asText(launchedFrom).toLowerCase();
  if (from === "current-shim" || from === "current" || from === "stable-path") return true;
  return CURRENT_SHIM_RE.test(asText(path));
}

export function looksBareVersionDialog(dialog) {
  return BARE_DIALOG_RE.test(asText(dialog));
}

export function looksTccOrphan(row = {}) {
  const newGrants = asNullableNumber(row.grantsOnNewPath);
  const oldGrants = asNullableNumber(row.grantsOnOldPath);
  if (newGrants === 0 && oldGrants != null && oldGrants > 0) return true;
  const note = asText(row.tccObservation);
  return /zero rows|0 rows|no rows.*new|orphan/i.test(note) && /previous|old path|still present/i.test(note);
}

export function looksFdaInert(row = {}) {
  if (row.parentFda === true && (looksBareVersionDialog(row.dialogText) || asText(row.dialogText))) {
    return true;
  }
  const note = `${asText(row.tccObservation)} ${asText(row.source)}`;
  return /FDA|Full Disk Access/i.test(note) && /does not (help|cover)|inert|already enabled/i.test(note);
}

export function looksCloudMount(row = {}) {
  if (row.cloudMounts.length > 0) return true;
  if (row.services.some((svc) => /FileProviderDomain/i.test(svc))) return true;
  return CLOUD_RE.test(`${asText(row.dialogText)} ${asText(row.tccObservation)} ${row.cloudMounts.join(" ")}`);
}

export function looksOvernightBurst(row = {}) {
  if (row.overnight === true && (row.services.length > 1 || looksBareVersionDialog(row.dialogText))) {
    return true;
  }
  return /overnight|first thing|morning after/i.test(
    `${asText(row.source)} ${asText(row.dialogText)} ${asText(row.tccObservation)}`,
  );
}

export function looksSignedStable(row = {}) {
  const blob = `${asText(row.signingIdentity)} ${asText(row.bundleId)} ${asText(row.teamId)}`;
  const bundle = /com\.anthropic\.claude-code/i.test(blob);
  const team = /Q6L2SF6YDW/i.test(blob);
  return bundle && team;
}

export function looksStrangerPath(row = {}) {
  if (row.mistakenForMalware === true) return true;
  return looksBareVersionDialog(row.dialogText) && STRANGER_RE.test(`${asText(row.source)} ${asText(row.dialogText)}`);
}

export function looksVersionFolder(path, launchedFrom = "") {
  const from = asText(launchedFrom).toLowerCase();
  if (from === "version-folder" || from === "versioned") return true;
  return looksVersionedDesktopPath(path) && !looksCurrentShim(path, launchedFrom);
}

export function isOffLivery(row = {}) {
  const nearby = asText(row.nearby).toLowerCase();
  return (
    nearby === "pinfold" ||
    nearby === "90706" ||
    nearby === "palimpsest" ||
    nearby === "90725" ||
    nearby === "escutcheon" ||
    nearby === "90717" ||
    nearby === "chatelaine" ||
    nearby === "90647" ||
    nearby === "slype" ||
    nearby === "90676" ||
    nearby === "fob" ||
    nearby === "visa" ||
    nearby === "sigil" ||
    nearby === "hasp" ||
    nearby === "knock" ||
    nearby === "pleat"
  );
}

function uniqueNearbyOf(row) {
  return Boolean(
    row.nearbyPrompted ||
      row.nearbyPathChurn ||
      row.nearbyBareVersion ||
      row.nearbyTccOrphan ||
      row.nearbyFdaInert ||
      row.nearbyCloudMount ||
      row.nearbyOvernightBurst ||
      row.nearbySignedStable ||
      row.nearbyStrangerPath ||
      row.nearbyVersionFolder ||
      row.nearbyCurrentShim ||
      isOffLivery(row),
  );
}

export function isIdle(row = {}) {
  const probe = cloneProbe(row);
  return !(
    probe.executablePath ||
    probe.previousPath ||
    probe.dialogText ||
    probe.tccObservation ||
    probe.parentFda != null ||
    probe.signingIdentity ||
    probe.teamId ||
    probe.bundleId ||
    probe.cloudMounts.length ||
    probe.services.length ||
    probe.overnight != null ||
    probe.grantsOnNewPath != null ||
    probe.grantsOnOldPath != null ||
    probe.launchedFrom ||
    probe.version ||
    probe.mistakenForMalware != null ||
    uniqueNearbyOf(probe)
  );
}

export function analyze(input = {}) {
  const row = cloneProbe(input);
  const uniqueNearby = uniqueNearbyOf(row);
  const versionedDesktop = looksVersionedDesktopPath(row.executablePath);
  const cliVersioned = looksCliVersionPath(row.executablePath);
  const currentShim = looksCurrentShim(row.executablePath, row.launchedFrom);
  const bareVersion = looksBareVersionDialog(row.dialogText);
  const tccOrphan = looksTccOrphan(row);
  const fdaInert = looksFdaInert(row);
  const cloudMount = looksCloudMount(row);
  const overnightBurst = looksOvernightBurst(row);
  const signedStable = looksSignedStable(row);
  const strangerPath = looksStrangerPath(row);
  const versionFolder = looksVersionFolder(row.executablePath, row.launchedFrom);
  const pathChurn = versionedDesktop || cliVersioned || versionFolder;
  const zeroNew = row.grantsOnNewPath === 0;
  const burst = Boolean(
    row.services.length >= 3 ||
      (cloudMount && (overnightBurst || bareVersion)) ||
      /stack of modal|burst of TCC|\ba burst\b/i.test(
        `${asText(row.source)} ${asText(row.tccObservation)}`,
      ),
  );
  const promptedTriad = Boolean(
    versionedDesktop &&
      (bareVersion || burst || overnightBurst) &&
      (zeroNew || tccOrphan) &&
      !uniqueNearby,
  );
  const grantsPersist = Boolean(
    (row.grantsOnNewPath != null && row.grantsOnNewPath > 0) ||
      (currentShim && row.grantsOnNewPath !== 0 && !bareVersion && !burst),
  );
  const honest = Boolean(
    currentShim &&
      grantsPersist &&
      !bareVersion &&
      !burst &&
      !tccOrphan &&
      !uniqueNearby,
  );
  const currentShimContrast = Boolean(
    currentShim && row.nearbyCurrentShim && !promptedTriad,
  );

  let eventClass = "idle";
  if (uniqueNearby && !promptedTriad) {
    if (row.nearbyCurrentShim) eventClass = "current-shim";
    else if (row.nearbySignedStable) eventClass = "signed-stable";
    else if (row.nearbyVersionFolder) eventClass = "version-folder";
    else if (row.nearbyStrangerPath) eventClass = "stranger-path";
    else if (row.nearbyOvernightBurst) eventClass = "overnight-burst";
    else if (row.nearbyCloudMount) eventClass = "cloud-mount";
    else if (row.nearbyFdaInert) eventClass = "fda-inert";
    else if (row.nearbyTccOrphan) eventClass = "tcc-orphan";
    else if (row.nearbyBareVersion) eventClass = "bare-version";
    else if (row.nearbyPathChurn) eventClass = "path-churn";
    else if (row.nearbyPrompted) eventClass = "prompted";
    else if (isOffLivery(row)) eventClass = "prompted";
  } else if (promptedTriad) eventClass = "prompted";
  else if (currentShimContrast && row.nearbyCurrentShim) eventClass = "current-shim";
  else if (overnightBurst && (burst || bareVersion || pathChurn)) eventClass = "overnight-burst";
  else if (tccOrphan) eventClass = "tcc-orphan";
  else if (fdaInert && pathChurn) eventClass = "fda-inert";
  else if (cloudMount && (bareVersion || pathChurn)) eventClass = "cloud-mount";
  else if (strangerPath) eventClass = "stranger-path";
  else if (bareVersion) eventClass = "bare-version";
  else if (versionFolder) eventClass = "version-folder";
  else if (pathChurn) eventClass = "path-churn";
  else if (signedStable && row.nearbySignedStable) eventClass = "signed-stable";
  else if (currentShimContrast) eventClass = "current-shim";
  else if (honest || isIdle(row)) eventClass = "liveried";
  else eventClass = "liveried";

  return {
    uniqueNearby,
    versionedDesktop,
    cliVersioned,
    currentShim,
    bareVersion,
    tccOrphan,
    fdaInert,
    cloudMount,
    overnightBurst,
    signedStable,
    strangerPath,
    versionFolder,
    pathChurn,
    zeroNew,
    burst,
    promptedTriad,
    grantsPersist,
    honest,
    currentShimContrast,
    offLivery: isOffLivery(row),
    eventClass,
    version: row.version || extractVersion(row.executablePath || row.dialogText),
    executablePath: row.executablePath,
    dialogText: row.dialogText,
  };
}

export function classify(input = {}) {
  const row = cloneProbe(input);
  if (isIdle(row)) return "liveried";
  const facts = analyze(row);
  if (!facts.promptedTriad) {
    if (row.nearbyCurrentShim) return "current-shim";
    if (row.nearbySignedStable) return "signed-stable";
    if (row.nearbyVersionFolder) return "version-folder";
    if (row.nearbyStrangerPath) return "stranger-path";
    if (row.nearbyOvernightBurst) return "overnight-burst";
    if (row.nearbyCloudMount) return "cloud-mount";
    if (row.nearbyFdaInert) return "fda-inert";
    if (row.nearbyTccOrphan) return "tcc-orphan";
    if (row.nearbyBareVersion) return "bare-version";
    if (row.nearbyPathChurn) return "path-churn";
    if (row.nearbyPrompted) return "prompted";
    if (facts.offLivery) return "prompted";
  }
  if (facts.promptedTriad) return "prompted";
  if (facts.currentShimContrast) return "current-shim";
  if (facts.overnightBurst && (facts.burst || facts.bareVersion || facts.pathChurn)) {
    return "overnight-burst";
  }
  if (facts.tccOrphan) return "tcc-orphan";
  if (facts.fdaInert && facts.pathChurn) return "fda-inert";
  if (facts.cloudMount && (facts.bareVersion || facts.pathChurn)) return "cloud-mount";
  if (facts.strangerPath) return "stranger-path";
  if (facts.bareVersion) return "bare-version";
  if (facts.versionFolder) return "version-folder";
  if (facts.pathChurn) return "path-churn";
  if (facts.signedStable && row.nearbySignedStable) return "signed-stable";
  if (facts.honest) return "liveried";
  return "liveried";
}

export function feedOf(kind) {
  if (kind === "prompted") {
    return "● Prompted · versioned desktop path · zero grants on the new coat · burst of TCC dialogs · primary #90748";
  }
  if (kind === "path-churn") {
    return "● Path-churn · every desktop update mints a new executable path under claude-code/<version>/";
  }
  if (kind === "bare-version") {
    return '● Bare-version · dialog shows "2.1.NNN" rather than an app name — easy to mistake for malware';
  }
  if (kind === "tcc-orphan") {
    return "● Tcc-orphan · previous version's grants still sit on the old path · the new path has zero rows";
  }
  if (kind === "fda-inert") {
    return "● Fda-inert · Full Disk Access on /Applications/Claude.app does not cover the separately-pathed child";
  }
  if (kind === "cloud-mount") {
    return "● Cloud-mount · one kTCCServiceFileProviderDomain prompt per cloud mount (Dropbox, iCloud, Drive, CloudMounter)";
  }
  if (kind === "overnight-burst") {
    return "● Overnight-burst · stack of modal dialogs, typically first thing after an overnight update";
  }
  if (kind === "signed-stable") {
    return "● Signed-stable · Identifier=com.anthropic.claude-code Team Q6L2SF6YDW already stable · only path churn is the bug";
  }
  if (kind === "stranger-path") {
    return "● Stranger-path · a bare version number reads as a mystery process · the house coat looks like a stranger";
  }
  if (kind === "version-folder") {
    return "● Version-folder · desktop owns and recreates claude-code/<version>/ · CLI symlink trick is unavailable";
  }
  if (kind === "current-shim") {
    return "● Current-shim · launch from .../claude-code/current/... · the suggested fix that lets grants persist";
  }
  return "● Liveried · stable current path · house identity already signed · grants persist · idle word is liveried";
}

export function reasonsOf(input, kind) {
  const facts = analyze(input);
  const row = cloneProbe(input);
  const reasons = [];
  reasons.push(`verdict ${kind}`);
  if (kind === "prompted" || facts.promptedTriad) {
    reasons.push(
      "#90748 desktop bundled Claude Code uses a version-numbered executable path; TCC grants do not survive the update",
    );
  }
  if (facts.versionedDesktop) {
    reasons.push(`desktop versioned path: ${row.executablePath || DEMO_PATH}`);
  }
  if (facts.cliVersioned) {
    reasons.push(`related CLI versions path (not primary): ${row.executablePath}`);
  }
  if (facts.bareVersion) {
    reasons.push(row.dialogText || DEMO_DIALOG);
  }
  if (facts.tccOrphan) {
    reasons.push(
      `TCC orphan: new path ${row.grantsOnNewPath ?? 0} rows; previous path still has ${row.grantsOnOldPath ?? "grants"}`,
    );
  }
  if (facts.fdaInert) {
    reasons.push("FDA on /Applications/Claude.app does not cover the bundled child");
  }
  if (facts.cloudMount) {
    reasons.push(
      `cloud mounts: ${(row.cloudMounts.length ? row.cloudMounts : DEMO_MOUNTS).join(", ")}`,
    );
  }
  if (facts.overnightBurst) {
    reasons.push("overnight update → morning burst of modal TCC dialogs");
  }
  if (facts.signedStable) {
    reasons.push(`signing identity stable: ${DEMO_BUNDLE} / Team ${DEMO_TEAM}`);
  }
  if (facts.strangerPath) {
    reasons.push("bare version string reads as a mystery process / easy to mistake for malware");
  }
  if (facts.versionFolder) {
    reasons.push("desktop owns claude-code/<version>/ and recreates it on update");
  }
  if (facts.currentShim || kind === "current-shim") {
    reasons.push("stable current shim: .../claude-code/current/claude.app/...");
  }
  if (row.services.length) {
    reasons.push(`TCC services: ${row.services.join(", ")}`);
  }
  if (row.version) reasons.push(`version ${row.version}`);
  if (facts.offLivery) {
    reasons.push(
      "labeled contrast, not this defect: Pinfold #90706 / Palimpsest #90725 / Escutcheon #90717 / Chatelaine #90647 / Slype #90676 / Fob / Visa / Sigil / Hasp / Knock / Pleat",
    );
  }
  if (kind === "liveried") {
    reasons.push(
      "stable current path; house identity already signed; grants persist; idle word is liveried",
    );
  }
  if (kind === "signed-stable") {
    reasons.push("contrast: signing is already stable — only the path churn is the bug");
  }
  if (kind === "current-shim") {
    reasons.push("contrast seed: launch from .../current/... so TCC keys a stable path — the fix #90748 needs");
  }
  return reasons;
}

function boardResult(kind, probe, action = {}) {
  const facts = analyze(probe);
  const off = facts.offLivery;
  const alarm = ALARM_VERDICTS.includes(kind) && !off;
  return {
    product: "livery",
    action: action.action || "score",
    session: probe.session || action.session || "",
    issue: probe.issue ?? action.issue ?? null,
    source: probe.source || action.source || "",
    verdict: kind,
    state: kind,
    decision: kind,
    idleWord: IDLE_WORD,
    liveried: kind === "liveried",
    prompted: kind === "prompted",
    "path-churn": kind === "path-churn",
    "bare-version": kind === "bare-version",
    "tcc-orphan": kind === "tcc-orphan",
    "fda-inert": kind === "fda-inert",
    "cloud-mount": kind === "cloud-mount",
    "overnight-burst": kind === "overnight-burst",
    "signed-stable": kind === "signed-stable",
    "stranger-path": kind === "stranger-path",
    "version-folder": kind === "version-folder",
    "current-shim": kind === "current-shim",
    alarm,
    thisBug: kind !== "liveried" && kind !== "signed-stable" && kind !== "current-shim" && !off,
    offLivery: off,
    eventClass: facts.eventClass,
    facts: {
      versionedDesktop: facts.versionedDesktop,
      cliVersioned: facts.cliVersioned,
      currentShim: facts.currentShim,
      bareVersion: facts.bareVersion,
      tccOrphan: facts.tccOrphan,
      fdaInert: facts.fdaInert,
      cloudMount: facts.cloudMount,
      overnightBurst: facts.overnightBurst,
      signedStable: facts.signedStable,
      strangerPath: facts.strangerPath,
      versionFolder: facts.versionFolder,
      pathChurn: facts.pathChurn,
      zeroNew: facts.zeroNew,
      burst: facts.burst,
      promptedTriad: facts.promptedTriad,
      grantsPersist: facts.grantsPersist,
      honest: facts.honest,
      currentShimContrast: facts.currentShimContrast,
      offLivery: facts.offLivery,
      version: facts.version,
      executablePath: facts.executablePath,
      dialogText: facts.dialogText,
    },
    probe,
    reasons: reasonsOf(probe, kind),
    feed: feedOf(kind),
    version: DEMO_MARK,
    day: DEMO_DAY,
  };
}

export function score(probe = {}) {
  const row = cloneProbe(probe);
  return boardResult(classify(row), row, { action: "score" });
}

export function verdictOf(probe = {}) {
  return classify(probe);
}

export function liveriedOf(probe = {}) {
  return classify(probe) === "liveried";
}

function baseSeed(session, issue, extra = {}) {
  return {
    action: "score",
    livery: {
      ...emptyProbe(),
      session,
      issue,
      source: extra.source || `anthropics/claude-code#${issue}`,
      scored: true,
      ...extra,
    },
  };
}

export function seedLiveried() {
  return baseSeed("liveried-hold", FEATURED_ISSUE, {
    source:
      "honest control: launch from .../claude-code/current/...; grants persist; no TCC stack",
    executablePath: DEMO_CURRENT,
    launchedFrom: "current-shim",
    signingIdentity: DEMO_SIGNING,
    bundleId: DEMO_BUNDLE,
    teamId: DEMO_TEAM,
    grantsOnNewPath: 7,
    grantsOnOldPath: 7,
    parentFda: true,
    version: DEMO_VERSION,
  });
}

export function seedControl() {
  return seedLiveried();
}

export function seedReset() {
  return { action: "bail", livery: emptyProbe() };
}

export function seedPrompted() {
  return baseSeed("90748-prompted", FEATURED_ISSUE, {
    source:
      "primary #90748 versioned desktop path; zero grants on the new coat; burst of TCC dialogs after overnight update",
    executablePath: DEMO_PATH,
    previousPath: DEMO_PREVIOUS,
    dialogText: DEMO_DIALOG,
    tccObservation:
      "Zero rows in the user TCC database for any path under Application Support/Claude/claude-code (new); previous version's grants still present under its own path.",
    parentFda: true,
    signingIdentity: DEMO_SIGNING,
    bundleId: DEMO_BUNDLE,
    teamId: DEMO_TEAM,
    cloudMounts: DEMO_MOUNTS.slice(),
    services: DEMO_SERVICES.slice(),
    overnight: true,
    grantsOnNewPath: 0,
    grantsOnOldPath: 7,
    launchedFrom: "version-folder",
    version: DEMO_VERSION,
    mistakenForMalware: true,
  });
}

export function seed90748() {
  return seedPrompted();
}

export function seedPathChurn() {
  return baseSeed("90748-path-churn", FEATURED_ISSUE, {
    source: "every desktop update mints a new executable path under claude-code/<version>/",
    executablePath: DEMO_PATH,
    launchedFrom: "version-folder",
    version: DEMO_VERSION,
    nearbyPathChurn: true,
  });
}

export function seedBareVersion() {
  return baseSeed("90748-bare-version", FEATURED_ISSUE, {
    source: 'dialog shows "2.1.247" rather than an app name',
    executablePath: DEMO_PATH,
    dialogText: DEMO_DIALOG,
    version: DEMO_VERSION,
    nearbyBareVersion: true,
  });
}

export function seedTccOrphan() {
  return baseSeed("90748-tcc-orphan", FEATURED_ISSUE, {
    source: "previous version's grants still sit on the old path; the new path has zero rows",
    executablePath: DEMO_PATH,
    previousPath: DEMO_PREVIOUS,
    tccObservation:
      "Zero rows for the new path; previous version's grants still present under its own path.",
    grantsOnNewPath: 0,
    grantsOnOldPath: 7,
    nearbyTccOrphan: true,
    version: DEMO_VERSION,
  });
}

export function seedFdaInert() {
  return baseSeed("90748-fda-inert", FEATURED_ISSUE, {
    source: "FDA on /Applications/Claude.app already enabled; prompts still appeared",
    executablePath: DEMO_PATH,
    dialogText: DEMO_DIALOG,
    parentFda: true,
    tccObservation: "FDA on /Applications/Claude.app does not cover the separately-pathed child",
    nearbyFdaInert: true,
    version: DEMO_VERSION,
  });
}

export function seedCloudMount() {
  return baseSeed("90748-cloud-mount", FEATURED_ISSUE, {
    source: "one kTCCServiceFileProviderDomain prompt per cloud mount",
    executablePath: DEMO_PATH,
    dialogText: DEMO_DIALOG,
    cloudMounts: DEMO_MOUNTS.slice(),
    services: ["kTCCServiceFileProviderDomain"],
    nearbyCloudMount: true,
    version: DEMO_VERSION,
  });
}

export function seedOvernightBurst() {
  return baseSeed("90748-overnight-burst", FEATURED_ISSUE, {
    source: "stack of modal dialogs, typically first thing after an overnight update",
    executablePath: DEMO_PATH,
    dialogText: DEMO_DIALOG,
    overnight: true,
    services: DEMO_SERVICES.slice(),
    nearbyOvernightBurst: true,
    version: DEMO_VERSION,
  });
}

export function seedSignedStable() {
  return baseSeed("90748-signed-stable", FEATURED_ISSUE, {
    source: "signing identity already stable across releases — only path churn is the bug",
    signingIdentity: DEMO_SIGNING,
    bundleId: DEMO_BUNDLE,
    teamId: DEMO_TEAM,
    nearbySignedStable: true,
    version: DEMO_VERSION,
  });
}

export function seedStrangerPath() {
  return baseSeed("90748-stranger-path", FEATURED_ISSUE, {
    source: "bare version number reads as a mystery process; easy to mistake for malware",
    executablePath: DEMO_PATH,
    dialogText: DEMO_DIALOG,
    mistakenForMalware: true,
    nearbyStrangerPath: true,
    version: DEMO_VERSION,
  });
}

export function seedVersionFolder() {
  return baseSeed("90748-version-folder", FEATURED_ISSUE, {
    source: "desktop owns and recreates claude-code/<version>/; CLI symlink trick is unavailable",
    executablePath: DEMO_PATH,
    launchedFrom: "version-folder",
    nearbyVersionFolder: true,
    version: DEMO_VERSION,
  });
}

export function seedCurrentShim() {
  return baseSeed("90748-current-shim", FEATURED_ISSUE, {
    source:
      "contrast: launch from .../claude-code/current/... so TCC keys a stable path — the fix #90748 needs",
    executablePath: DEMO_CURRENT,
    launchedFrom: "current-shim",
    signingIdentity: DEMO_SIGNING,
    bundleId: DEMO_BUNDLE,
    teamId: DEMO_TEAM,
    grantsOnNewPath: 7,
    nearbyCurrentShim: true,
    version: DEMO_VERSION,
  });
}

const SEEDS = {
  liveried: seedLiveried,
  control: seedLiveried,
  healthy: seedLiveried,
  hold: seedLiveried,
  prompted: seedPrompted,
  90748: seedPrompted,
  "90748": seedPrompted,
  "path-churn": seedPathChurn,
  pathchurn: seedPathChurn,
  "bare-version": seedBareVersion,
  bareversion: seedBareVersion,
  "tcc-orphan": seedTccOrphan,
  tccorphan: seedTccOrphan,
  "fda-inert": seedFdaInert,
  fdainert: seedFdaInert,
  "cloud-mount": seedCloudMount,
  cloudmount: seedCloudMount,
  "overnight-burst": seedOvernightBurst,
  overnightburst: seedOvernightBurst,
  "signed-stable": seedSignedStable,
  signedstable: seedSignedStable,
  "stranger-path": seedStrangerPath,
  strangerpath: seedStrangerPath,
  "version-folder": seedVersionFolder,
  versionfolder: seedVersionFolder,
  "current-shim": seedCurrentShim,
  currentshim: seedCurrentShim,
};

export function decideSeed(seed, extra = {}) {
  if (typeof seed === "function") return decide({ ...seed(), ...extra });
  if (typeof seed === "number" || (typeof seed === "string" && SEEDS[seed])) {
    return decide({ ...SEEDS[seed](), ...extra });
  }
  return decide({ ...seed, ...extra });
}

function readAction(payload = {}) {
  if (typeof payload === "string") {
    return { action: payload, livery: emptyProbe() };
  }
  const src = payload && typeof payload === "object" ? payload : {};
  const nestedAction = src.action && typeof src.action === "object" ? src.action : null;
  const action = asText(nestedAction?.action || src.action || "score");
  const livery = cloneProbe(nestedAction || src);
  return {
    action,
    session: asText(src.session || livery.session),
    issue: asIssue(src.issue ?? livery.issue),
    source: asText(src.source || livery.source),
    livery,
  };
}

export function decide(payload = {}) {
  if (typeof payload === "function") return decide(payload());
  const action = readAction(payload);
  let probe = cloneProbe(action.livery);
  const verb = String(action.action || "score").toLowerCase();

  if (verb === "bail" || verb === "still" || verb === "rest" || verb === "reset") {
    return boardResult("liveried", emptyProbe(), {
      ...action,
      action: verb === "still" || verb === "rest" || verb === "reset" ? "bail" : verb,
    });
  }

  if (verb === "control" || verb === "healthy" || verb === "proof" || verb === "hold") {
    probe = seedLiveried().livery;
    return boardResult(classify(probe), probe, { ...action, action: "control" });
  }

  if (verb === "restore" || verb === "incident" || verb === "90748" || verb === "prompted") {
    probe = seedPrompted().livery;
    return boardResult(classify(probe), probe, {
      ...action,
      action: verb === "restore" ? "restore" : verb,
    });
  }

  if (verb === "press" || verb === "admit" || verb === "score" || verb === "stamp" || verb === "file") {
    probe = { ...probe, scored: true };
    return boardResult(classify(probe), probe, {
      ...action,
      action: verb === "press" || verb === "stamp" || verb === "file" ? "score" : verb,
    });
  }

  probe = { ...probe, scored: true };
  return boardResult(classify(probe), probe, action);
}

export function parseTranscript(raw) {
  const text = asText(raw);
  if (!text.trim()) return emptyProbe();
  try {
    const parsed = JSON.parse(text);
    if (parsed && typeof parsed === "object") {
      return cloneProbe({ ...parsed, scored: true });
    }
  } catch {
    /* transcript, not JSON */
  }
  const probe = emptyProbe();
  const pathMatch = text.match(
    /\/(?:Users\/[^\s]+\/Library\/Application Support\/Claude\/claude-code\/[^\s]+\/claude|Users\/[^\s]+\/\.local\/share\/claude\/versions\/[^\s]+)/,
  );
  if (pathMatch) probe.executablePath = pathMatch[0];
  if (!probe.executablePath && DESKTOP_VERSIONED_RE.test(text)) {
    const loose = text.match(/[^\s]*Application Support\/Claude\/claude-code\/\d+\.\d+\.\d+\/[^\s]*/);
    if (loose) probe.executablePath = loose[0];
  }
  if (!probe.executablePath && CURRENT_SHIM_RE.test(text)) {
    const current = text.match(/[^\s]*claude-code\/current\/[^\s]*/);
    if (current) probe.executablePath = current[0];
  }
  const dialogMatch = text.match(/["“]?\d+\.\d+\.\d+["”]?\s+wants to access[^\n]*/i);
  if (dialogMatch) probe.dialogText = dialogMatch[0];
  if (/zero rows|0 rows/i.test(text)) {
    probe.grantsOnNewPath = 0;
    probe.tccObservation = text.slice(0, 400);
  }
  if (/previous version|old path|still present/i.test(text)) {
    probe.grantsOnOldPath = probe.grantsOnOldPath ?? 7;
  }
  if (/Full Disk Access|FDA/i.test(text) && /does not|already enabled|inert/i.test(text)) {
    probe.parentFda = true;
  }
  if (/com\.anthropic\.claude-code/i.test(text)) probe.bundleId = DEMO_BUNDLE;
  if (/Q6L2SF6YDW/i.test(text)) {
    probe.teamId = DEMO_TEAM;
    probe.signingIdentity = probe.signingIdentity || DEMO_SIGNING;
  }
  for (const mount of DEMO_MOUNTS) {
    if (text.includes(mount)) probe.cloudMounts.push(mount);
  }
  for (const svc of DEMO_SERVICES) {
    if (text.includes(svc)) probe.services.push(svc);
  }
  if (/overnight|first thing|morning after/i.test(text)) probe.overnight = true;
  if (/malware|mystery process|unrecognized/i.test(text)) probe.mistakenForMalware = true;
  if (/claude-code\/current\//i.test(text) && !looksVersionedDesktopPath(probe.executablePath)) {
    probe.launchedFrom = "current-shim";
    if (probe.grantsOnNewPath == null) probe.grantsOnNewPath = 7;
  } else if (looksVersionedDesktopPath(probe.executablePath)) {
    probe.launchedFrom = "version-folder";
  }
  const ver = extractVersion(probe.executablePath || probe.dialogText || text);
  if (ver) probe.version = ver;
  probe.scored = true;
  return cloneProbe(probe);
}

export function parseLiveryJson(raw) {
  if (raw && typeof raw === "object") {
    return cloneProbe({ ...raw, scored: true });
  }
  return parseTranscript(raw);
}

export function emptyAction(verb = "idle") {
  return { action: verb, livery: emptyProbe() };
}
