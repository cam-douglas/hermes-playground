#!/usr/bin/env node
/**
 * Postern — bailey / postern-gate / night-ward classifier.
 * A postern that anyone in the bailey can bar is not a hold.
 * Score the postern or admit warded.
 *
 *   echo '{"sessionUid":501,"primaryDirOwnerUid":502}' | node postern.mjs
 *   node postern.mjs ticket.json
 *
 * Idle word is warded (session uid owns the sockets dir it uses,
 * or a private XDG that is honored; messaging on).
 * Seeded state is squatted / #91223 (another uid owns primary
 * AND per-uid fallback; messaging off).
 * NEVER idle as squatted, postern, sluice, drained, pooled,
 * stationed, displaced, hung, marvered, unpinned, shed,
 * sealed, rinsed, vacant.
 *
 * Primary #91223: sockets directory is still first-come after
 * 2.1.248, and a local account can squat both /tmp/cc-socks
 * and the per-uid fallback. DoS only; peerToken holds.
 *
 * Hypothesis only (NON-BINDING): treat this as UDS messaging
 * directory tenancy — a shared first-come primary plus a
 * predictable per-uid postern with no third door under $HOME.
 * Do not claim a root cause in Claude Code source you have
 * not seen. Verify against the issue text and discard if wrong.
 *
 * This is a diagnostic scoring bench. NOT an exploit, attack
 * PoC, or remote-access how-to. No payloads. No squat cookbook.
 * Score whether the postern is warded or squatted.
 *
 * NOT Sluice (#91265) — Cowork kernel Toke/File/SeAt leak.
 * NOT Alidade (#91055) — silent foreign tool host.
 * NOT Parison (#91037) — parent-side subagent wedge.
 * NOT Cockade (#91033) — ultracode silent arm.
 * NOT Lye (#91020) — config-dir scrub.
 * NOT Limpet (#89275) — OS process-pair cling.
 * NOT Quench — token-spend fuse.
 * NOT Bulla (#90891) — MSIX seal.
 * NOT Cubby — cubbyhole.
 * NOT Bitting / Chatelaine — OAuth/key material.
 * NOT Pale (#90683) — silent-absent hooks.
 * NOT Berth (#90668) — spawn_task sharing parent tree.
 * Product name stays Postern. Do not rename to Wicket / Hatch /
 * Lodge / Scuttle / Coaming / Bailey / Gatehouse / Sallyport /
 * Porter / Letterbox.
 */

import { readFileSync } from "node:fs";
import { stdin } from "node:process";
import { pathToFileURL } from "node:url";

export const VERDICTS = Object.freeze([
  "warded",
  "squatted",
  "first-come",
  "boot-order",
  "postern-refused",
  "no-third-door",
  "predictable-uid",
  "workaround-xdg",
  "fallback-ignores-xdg",
  "dos-only",
  "peer-path-ok",
  "status-silent",
]);
export const IDLE_WORD = "warded";
export const SEEDED_WORD = "squatted";
export const HOLD_VERDICTS = Object.freeze(["warded"]);
export const ALARM_VERDICTS = Object.freeze(
  VERDICTS.filter((name) => !HOLD_VERDICTS.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FEATURED_ISSUE = 91223;
export const PRIMARY_ISSUES = Object.freeze([91223]);
export const COUSIN_ISSUE = 89401;
export const COUSINS = Object.freeze([89401]);
export const FAMILY = Object.freeze([89401]);
export const NOT_PRODUCTS = Object.freeze([
  "sluice",
  "alidade",
  "parison",
  "cockade",
  "lye",
  "limpet",
  "quench",
  "bulla",
  "cubby",
  "bitting",
  "chatelaine",
  "pale",
  "berth",
  "wicket",
  "hatch",
  "lodge",
  "scuttle",
]);
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/91223";
export const COUSIN_URL =
  "https://github.com/anthropics/claude-code/issues/89401";
export const TITLE =
  "Sockets directory is still first-come after 2.1.248, and a local account can squat both /tmp/cc-socks and the per-uid fallback";
export const FILED_AT = "2026-09-01T13:34:37Z";
export const LABELS = Object.freeze([
  "bug",
  "has repro",
  "platform:macos",
  "area:core",
  "area:security",
]);
export const REPORTER = "allixsenos";
export const CLAUDE_VERSION = "2.1.252";
export const SYMPTOM_FIX_VERSION = "2.1.248";
export const SETTINGS_BLOCK_VERSION = "2.1.251";
export const PLATFORM = "macos";
export const MACOS_BUILD = "25.6.0 arm64";
export const PACKAGE_NOTE = "native install";
export const SESSION_UID = 501;
export const OTHER_UID = 502;
export const PRIMARY_DIR = "/tmp/cc-socks";
export const FALLBACK_DIR_PREFIX = "/tmp/cc-socks-";
export const DIR_MODE = "0700";
export const UDS_BUDGET_BYTES = 103;
export const UID_SUFFIX_BYTES = 4;
export const WORKAROUND_PATH_BYTES = 35;
export const WORKAROUND_XDG = "/tmp/claude-501";
export const HUB_LINE =
  "03:50 postern: a postern anyone in the bailey can bar is not a hold. Score the postern or admit warded.";
export const MARK = "03:50 / hermes catalog #104 / #91223";
export const PHRASE =
  "A postern that anyone in the bailey can bar is not a hold. Score the postern or admit warded.";
export const HYPOTHESIS_NOTE =
  "NON-BINDING: treat this as UDS messaging directory tenancy — a shared first-come primary plus a predictable per-uid postern with no third door under $HOME. Do not claim a root cause in Claude Code source you have not seen. Verify against the issue text and discard if wrong.";
export const CONTRAST_NOTE =
  "This is UDS MESSAGING DIRECTORY TENANCY — FIRST-COME SHARED /tmp/cc-socks + PREDICTABLE PER-UID POSTERN WITH NO THIRD DOOR. LOCAL ACCOUNT CAN SQUAT BOTH NAMES AND TURN MESSAGING OFF. DoS ONLY (peerToken holds). NOT Sluice (#91265) Cowork kernel Toke/File/SeAt leak. NOT Alidade (#91055) silent foreign tool host. NOT Parison (#91037) parent-side subagent wedge. NOT Cockade (#91033) ultracode silent arm. NOT Lye (#91020) config-dir scrub. NOT Limpet (#89275) OS process-pair cling. NOT Quench token-spend fuse. NOT Bulla (#90891) MSIX seal. NOT Cubby. NOT Bitting / Chatelaine. NOT Pale (#90683). NOT Berth (#90668). Product name stays Postern.";
export const FORBIDDEN_IDLE = Object.freeze([
  "squatted",
  "postern",
  "sluice",
  "drained",
  "pooled",
  "stationed",
  "displaced",
  "hung",
  "marvered",
  "unpinned",
  "shed",
  "sealed",
  "rinsed",
  "vacant",
]);
export const BANNED_NAMES = Object.freeze([
  "Wicket",
  "Hatch",
  "Lodge",
  "Scuttle",
  "Coaming",
  "Bailey",
  "Gatehouse",
  "Sallyport",
  "Porter",
  "Letterbox",
  "Sluice",
  "Alidade",
  "Parison",
  "Cockade",
  "Lye",
  "Cubby",
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
    sessionUid: null,
    primaryDirOwnerUid: null,
    fallbackDirOwnerUid: null,
    primaryDirExists: null,
    fallbackDirExists: null,
    messagingOn: null,
    xdgRuntimeDirSet: null,
    xdgHonoredByFallback: null,
    homeFallbackAttempted: null,
    tmpClearedSinceBoot: null,
    firstComeWinnerUid: null,
    peerTokenHolds: null,
    socketPathBytes: null,
    statusReportsRefusal: null,
    cousin: "",
    claudeVersion: "",
    platform: "",
    macosBuild: "",
    outputText: "",
  };
}

export function emptyTicket() {
  return seedWarded();
}

export function seedWarded() {
  return {
    seed: IDLE_WORD,
    issue: null,
    sessionUid: SESSION_UID,
    primaryDirOwnerUid: SESSION_UID,
    fallbackDirOwnerUid: SESSION_UID,
    primaryDirExists: true,
    fallbackDirExists: false,
    messagingOn: true,
    xdgRuntimeDirSet: false,
    xdgHonoredByFallback: false,
    homeFallbackAttempted: false,
    tmpClearedSinceBoot: false,
    firstComeWinnerUid: SESSION_UID,
    peerTokenHolds: true,
    socketPathBytes: null,
    statusReportsRefusal: false,
    cousin: "",
    claudeVersion: CLAUDE_VERSION,
    platform: PLATFORM,
    macosBuild: MACOS_BUILD,
    packageNote: PACKAGE_NOTE,
    outputText:
      "warded postern; session uid 501 owns the sockets dir it uses; messaging on; idle word warded",
  };
}

export function seedSquatted() {
  return {
    seed: SEEDED_WORD,
    issue: FEATURED_ISSUE,
    title: TITLE,
    url: ISSUE_URL,
    filedAt: FILED_AT,
    labels: [...LABELS],
    reporter: REPORTER,
    sessionUid: SESSION_UID,
    primaryDirOwnerUid: OTHER_UID,
    fallbackDirOwnerUid: OTHER_UID,
    primaryDirExists: true,
    fallbackDirExists: true,
    messagingOn: false,
    xdgRuntimeDirSet: false,
    xdgHonoredByFallback: false,
    homeFallbackAttempted: false,
    tmpClearedSinceBoot: false,
    firstComeWinnerUid: OTHER_UID,
    peerTokenHolds: true,
    socketPathBytes: null,
    statusReportsRefusal: false,
    cousin: "",
    claudeVersion: CLAUDE_VERSION,
    platform: PLATFORM,
    macosBuild: MACOS_BUILD,
    packageNote: PACKAGE_NOTE,
    outputText:
      "squatted; another uid owns primary /tmp/cc-socks AND per-uid fallback /tmp/cc-socks-501; both owner checks fail; messaging off; peerToken holds; DoS only; no $HOME third door; /status silent; Claude Code 2.1.252 native install; macOS 25.6.0 arm64; uid 501 vs 502; XDG_RUNTIME_DIR unset; CLAUDE_CODE_TMPDIR unset",
  };
}

export function seedFirstCome() {
  return {
    seed: "first-come",
    sessionUid: SESSION_UID,
    primaryDirOwnerUid: OTHER_UID,
    fallbackDirOwnerUid: SESSION_UID,
    primaryDirExists: true,
    fallbackDirExists: true,
    messagingOn: true,
    xdgRuntimeDirSet: false,
    xdgHonoredByFallback: false,
    homeFallbackAttempted: false,
    tmpClearedSinceBoot: false,
    firstComeWinnerUid: OTHER_UID,
    peerTokenHolds: true,
    socketPathBytes: null,
    statusReportsRefusal: false,
    outputText:
      "first-come; shared /tmp/cc-socks owned by whoever started first (uid 502); session 501 fails the owner check and takes the per-uid path; messaging on via absolute messagingSocketPath",
  };
}

export function seedBootOrder() {
  return {
    seed: "boot-order",
    sessionUid: SESSION_UID,
    primaryDirOwnerUid: OTHER_UID,
    fallbackDirOwnerUid: SESSION_UID,
    primaryDirExists: true,
    fallbackDirExists: true,
    messagingOn: true,
    xdgRuntimeDirSet: false,
    xdgHonoredByFallback: false,
    homeFallbackAttempted: false,
    tmpClearedSinceBoot: true,
    firstComeWinnerUid: OTHER_UID,
    peerTokenHolds: true,
    socketPathBytes: null,
    statusReportsRefusal: false,
    outputText:
      "boot-order; macOS clears /tmp so the first-come winner can change after a reboot; diagnostic cost: an account cannot predict its own socket directory",
  };
}

export function seedPosternRefused() {
  return {
    seed: "postern-refused",
    sessionUid: SESSION_UID,
    primaryDirOwnerUid: OTHER_UID,
    fallbackDirOwnerUid: OTHER_UID,
    primaryDirExists: true,
    fallbackDirExists: true,
    messagingOn: false,
    xdgRuntimeDirSet: false,
    xdgHonoredByFallback: false,
    homeFallbackAttempted: false,
    tmpClearedSinceBoot: false,
    firstComeWinnerUid: OTHER_UID,
    peerTokenHolds: true,
    socketPathBytes: null,
    statusReportsRefusal: false,
    outputText:
      "postern-refused; per-uid fallback also failed the owner check; refusal path tries the per-uid directory once, then stops",
  };
}

export function seedNoThirdDoor() {
  return {
    seed: "no-third-door",
    sessionUid: SESSION_UID,
    primaryDirOwnerUid: OTHER_UID,
    fallbackDirOwnerUid: OTHER_UID,
    primaryDirExists: true,
    fallbackDirExists: true,
    messagingOn: false,
    xdgRuntimeDirSet: false,
    xdgHonoredByFallback: false,
    homeFallbackAttempted: false,
    tmpClearedSinceBoot: false,
    firstComeWinnerUid: OTHER_UID,
    peerTokenHolds: true,
    socketPathBytes: null,
    statusReportsRefusal: false,
    outputText:
      "no-third-door; no $HOME fallback before giving up; reporter asks to try a third location under the user's own home",
  };
}

export function seedPredictableUid() {
  return {
    seed: "predictable-uid",
    sessionUid: SESSION_UID,
    primaryDirOwnerUid: OTHER_UID,
    fallbackDirOwnerUid: null,
    primaryDirExists: true,
    fallbackDirExists: false,
    messagingOn: true,
    xdgRuntimeDirSet: false,
    xdgHonoredByFallback: false,
    homeFallbackAttempted: false,
    tmpClearedSinceBoot: false,
    firstComeWinnerUid: OTHER_UID,
    peerTokenHolds: true,
    socketPathBytes: null,
    statusReportsRefusal: false,
    outputText:
      "predictable-uid; nNn() builds the fallback from a fixed uid so the target name is public and predictable: /tmp/cc-socks-<uid>; uid suffix costs 4 bytes of a 103-byte UDS path budget",
  };
}

export function seedWorkaroundXdg() {
  return {
    seed: "workaround-xdg",
    sessionUid: SESSION_UID,
    primaryDirOwnerUid: SESSION_UID,
    fallbackDirOwnerUid: null,
    primaryDirExists: true,
    fallbackDirExists: false,
    messagingOn: true,
    xdgRuntimeDirSet: true,
    xdgHonoredByFallback: false,
    homeFallbackAttempted: false,
    tmpClearedSinceBoot: false,
    firstComeWinnerUid: null,
    peerTokenHolds: true,
    socketPathBytes: WORKAROUND_PATH_BYTES,
    statusReportsRefusal: false,
    outputText:
      "workaround-xdg; XDG_RUNTIME_DIR=/tmp/claude-501 keeps messaging; resulting socket path 35 bytes, inside the 103-byte limit; primary no longer resolves to /tmp/cc-socks",
  };
}

export function seedFallbackIgnoresXdg() {
  return {
    seed: "fallback-ignores-xdg",
    sessionUid: SESSION_UID,
    primaryDirOwnerUid: OTHER_UID,
    fallbackDirOwnerUid: OTHER_UID,
    primaryDirExists: true,
    fallbackDirExists: true,
    messagingOn: false,
    xdgRuntimeDirSet: true,
    xdgHonoredByFallback: false,
    homeFallbackAttempted: false,
    tmpClearedSinceBoot: false,
    firstComeWinnerUid: OTHER_UID,
    peerTokenHolds: true,
    socketPathBytes: null,
    statusReportsRefusal: false,
    outputText:
      "fallback-ignores-xdg; nNn() ignores both XDG_RUNTIME_DIR and CLAUDE_CODE_TMPDIR; if your own directory is refused the code sends you to /tmp anyway",
  };
}

export function seedDosOnly() {
  return {
    seed: "dos-only",
    sessionUid: SESSION_UID,
    primaryDirOwnerUid: OTHER_UID,
    fallbackDirOwnerUid: OTHER_UID,
    primaryDirExists: true,
    fallbackDirExists: true,
    messagingOn: false,
    xdgRuntimeDirSet: false,
    xdgHonoredByFallback: false,
    homeFallbackAttempted: false,
    tmpClearedSinceBoot: false,
    firstComeWinnerUid: OTHER_UID,
    peerTokenHolds: true,
    socketPathBytes: null,
    statusReportsRefusal: false,
    outputText:
      "dos-only; owner check + peerToken file still stop the squatting account from receiving anyone else's messages; denial of service only; attacker needs a local login",
  };
}

export function seedPeerPathOk() {
  return {
    seed: "peer-path-ok",
    sessionUid: SESSION_UID,
    primaryDirOwnerUid: OTHER_UID,
    fallbackDirOwnerUid: SESSION_UID,
    primaryDirExists: true,
    fallbackDirExists: true,
    messagingOn: true,
    xdgRuntimeDirSet: false,
    xdgHonoredByFallback: false,
    homeFallbackAttempted: false,
    tmpClearedSinceBoot: false,
    firstComeWinnerUid: OTHER_UID,
    peerTokenHolds: true,
    socketPathBytes: null,
    statusReportsRefusal: false,
    outputText:
      "peer-path-ok; case 1 still discovers via sessions json; each session writes absolute messagingSocketPath into ~/.claude/sessions/<pid>.json so peers never resolve the directory by convention",
  };
}

export function seedStatusSilent() {
  return {
    seed: "status-silent",
    sessionUid: SESSION_UID,
    primaryDirOwnerUid: OTHER_UID,
    fallbackDirOwnerUid: OTHER_UID,
    primaryDirExists: true,
    fallbackDirExists: true,
    messagingOn: false,
    xdgRuntimeDirSet: false,
    xdgHonoredByFallback: false,
    homeFallbackAttempted: false,
    tmpClearedSinceBoot: false,
    firstComeWinnerUid: OTHER_UID,
    peerTokenHolds: true,
    socketPathBytes: null,
    statusReportsRefusal: false,
    outputText:
      "status-silent; refusal is not reported in /status; reporter asks to report the refusal in /status",
  };
}

export function seedCousin() {
  return {
    seed: "first-come",
    issue: COUSIN_ISSUE,
    sessionUid: SESSION_UID,
    primaryDirOwnerUid: OTHER_UID,
    fallbackDirOwnerUid: SESSION_UID,
    primaryDirExists: true,
    fallbackDirExists: true,
    messagingOn: true,
    xdgRuntimeDirSet: false,
    xdgHonoredByFallback: false,
    homeFallbackAttempted: false,
    tmpClearedSinceBoot: false,
    firstComeWinnerUid: OTHER_UID,
    peerTokenHolds: true,
    socketPathBytes: null,
    statusReportsRefusal: false,
    cousin: "89401",
    outputText:
      "cousin-not-primary; #89401 CLOSED — Cross-session messaging silently disabled for secondary users on multi-user macOS; symptom treated in 2.1.248; #91223 documents the remaining first-come + dual-name squat",
  };
}

export function cloneTicket(input) {
  const src = input && typeof input === "object" && !Array.isArray(input) ? input : {};
  const nested =
    (src.ticket && typeof src.ticket === "object" && src.ticket) ||
    (src.postern && typeof src.postern === "object" && src.postern) ||
    (src.probe && typeof src.probe === "object" && src.probe) ||
    (src.ward && typeof src.ward === "object" && src.ward) ||
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
    sessionUid: firstNum(
      nested.sessionUid,
      nested.session_uid,
      src.sessionUid,
    ),
    primaryDirOwnerUid: firstNum(
      nested.primaryDirOwnerUid,
      nested.primary_dir_owner_uid,
      src.primaryDirOwnerUid,
    ),
    fallbackDirOwnerUid: firstNum(
      nested.fallbackDirOwnerUid,
      nested.fallback_dir_owner_uid,
      src.fallbackDirOwnerUid,
    ),
    primaryDirExists: firstBool(
      nested.primaryDirExists,
      nested.primary_dir_exists,
      src.primaryDirExists,
    ),
    fallbackDirExists: firstBool(
      nested.fallbackDirExists,
      nested.fallback_dir_exists,
      src.fallbackDirExists,
    ),
    messagingOn: firstBool(
      nested.messagingOn,
      nested.messaging_on,
      src.messagingOn,
    ),
    xdgRuntimeDirSet: firstBool(
      nested.xdgRuntimeDirSet,
      nested.xdg_runtime_dir_set,
      src.xdgRuntimeDirSet,
    ),
    xdgHonoredByFallback: firstBool(
      nested.xdgHonoredByFallback,
      nested.xdg_honored_by_fallback,
      src.xdgHonoredByFallback,
    ),
    homeFallbackAttempted: firstBool(
      nested.homeFallbackAttempted,
      nested.home_fallback_attempted,
      src.homeFallbackAttempted,
    ),
    tmpClearedSinceBoot: firstBool(
      nested.tmpClearedSinceBoot,
      nested.tmp_cleared_since_boot,
      src.tmpClearedSinceBoot,
    ),
    firstComeWinnerUid: firstNum(
      nested.firstComeWinnerUid,
      nested.first_come_winner_uid,
      src.firstComeWinnerUid,
    ),
    peerTokenHolds: firstBool(
      nested.peerTokenHolds,
      nested.peer_token_holds,
      src.peerTokenHolds,
    ),
    socketPathBytes: firstNum(
      nested.socketPathBytes,
      nested.socket_path_bytes,
      src.socketPathBytes,
    ),
    statusReportsRefusal: firstBool(
      nested.statusReportsRefusal,
      nested.status_reports_refusal,
      src.statusReportsRefusal,
    ),
    cousin: firstText(nested.cousin, src.cousin),
    claudeVersion: firstText(
      nested.claudeVersion,
      nested.claude_version,
      src.claudeVersion,
    ),
    platform: firstText(nested.platform, src.platform),
    macosBuild: firstText(
      nested.macosBuild,
      nested.macos_build,
      src.macosBuild,
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
    input.sessionUid == null &&
    input.primaryDirOwnerUid == null &&
    input.fallbackDirOwnerUid == null &&
    input.messagingOn == null &&
    input.xdgRuntimeDirSet == null &&
    input.homeFallbackAttempted == null &&
    input.peerTokenHolds == null &&
    input.statusReportsRefusal == null
  );
}

const SEED_FNS = {
  [IDLE_WORD]: seedWarded,
  [SEEDED_WORD]: seedSquatted,
  "first-come": seedFirstCome,
  "boot-order": seedBootOrder,
  "postern-refused": seedPosternRefused,
  "no-third-door": seedNoThirdDoor,
  "predictable-uid": seedPredictableUid,
  "workaround-xdg": seedWorkaroundXdg,
  "fallback-ignores-xdg": seedFallbackIgnoresXdg,
  "dos-only": seedDosOnly,
  "peer-path-ok": seedPeerPathOk,
  "status-silent": seedStatusSilent,
  cousin: seedCousin,
  89401: seedCousin,
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
    return { ...seedSquatted(), ...cloned, ...raw };
  }
  if ((issue === COUSIN_ISSUE || raw.issue === COUSIN_ISSUE) && coreMissing) {
    return { ...seedCousin(), ...cloned, ...raw };
  }
  const seedFn = SEED_FNS[String(cloned.seed || "")];
  if (seedFn && coreMissing) {
    return { ...seedFn(), ...cloned, ...raw };
  }
  return { ...blankTicket(), ...cloned, ...raw };
}

function textOf(ticket) {
  return [ticket.outputText, ticket.title, ticket.cousin, ticket.seed]
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
  const session = row.sessionUid;
  const primaryOwner = row.primaryDirOwnerUid;
  const fallbackOwner = row.fallbackDirOwnerUid;
  const primaryForeign =
    session != null &&
    primaryOwner != null &&
    primaryOwner !== session;
  const fallbackForeign =
    session != null &&
    fallbackOwner != null &&
    fallbackOwner !== session;
  const fallbackOwn =
    session != null &&
    fallbackOwner != null &&
    fallbackOwner === session;
  const primaryOwn =
    session != null &&
    primaryOwner != null &&
    primaryOwner === session;
  const bothForeign = primaryForeign && fallbackForeign;
  const messagingOff = row.messagingOn === false;
  const messagingOn =
    row.messagingOn === true || /messaging on/i.test(text);
  const xdgSet =
    row.xdgRuntimeDirSet === true ||
    /XDG_RUNTIME_DIR=\/tmp\/claude/i.test(text);
  const xdgIgnored =
    row.xdgHonoredByFallback === false &&
    (xdgSet || /nNn\(\) ignores|fallback-ignores-xdg/i.test(text));
  const noHome =
    row.homeFallbackAttempted === false ||
    /no-third-door|no \$HOME|no third door/i.test(text);
  const tmpCleared =
    row.tmpClearedSinceBoot === true ||
    /boot-order|clears \/tmp|after a reboot/i.test(text);
  const peerTokenHolds =
    row.peerTokenHolds === true ||
    /peerToken holds|dos-only/i.test(text);
  const statusSilent =
    row.statusReportsRefusal === false ||
    /status-silent|not reported in \/status/i.test(text);
  const workaround =
    (xdgSet &&
      messagingOn &&
      (row.socketPathBytes === WORKAROUND_PATH_BYTES ||
        /workaround-xdg|35 bytes/i.test(text))) ||
    named === "workaround-xdg";
  const firstCome =
    (primaryForeign && fallbackOwn && messagingOn) ||
    /first-come; shared \/tmp\/cc-socks/i.test(text);
  const peerPathOk =
    messagingOn &&
    (firstCome || /peer-path-ok|messagingSocketPath/i.test(text));
  const predictable =
    /predictable-uid|cc-socks-<uid>|public and predictable/i.test(text) ||
    named === "predictable-uid" ||
    bothForeign ||
    firstCome;
  const squatted =
    named !== IDLE_WORD &&
    (bothForeign && messagingOff && row.fallbackDirExists !== false);
  const warded =
    named === IDLE_WORD ||
    (primaryOwn && messagingOn && !bothForeign && named !== SEEDED_WORD) ||
    (workaround && named === IDLE_WORD);
  const cousinOnly =
    (row.issue === COUSIN_ISSUE ||
      row.cousin === "89401" ||
      /cousin-not-primary|#89401 CLOSED/i.test(text)) &&
    !squatted &&
    named !== SEEDED_WORD;
  return {
    primaryForeign,
    fallbackForeign,
    fallbackOwn,
    primaryOwn,
    bothForeign,
    messagingOff,
    messagingOn,
    xdgSet,
    xdgIgnored,
    noHome,
    tmpCleared,
    peerTokenHolds,
    statusSilent,
    workaround,
    firstCome,
    peerPathOk,
    predictable,
    squatted,
    warded,
    cousinOnly,
    named,
  };
}

export function chipsOf(ticket) {
  const flags = flagsOf(ticket);
  const chips = [];
  if (flags.squatted) chips.push("squatted");
  if (flags.warded && !flags.squatted) chips.push("warded");
  if (flags.firstCome && !flags.squatted) chips.push("first-come");
  if (flags.tmpCleared && !flags.warded) chips.push("boot-order");
  if (flags.fallbackForeign && flags.messagingOff) chips.push("postern-refused");
  if (flags.noHome && flags.messagingOff && flags.bothForeign) {
    chips.push("no-third-door");
  }
  if (flags.predictable && !flags.warded) chips.push("predictable-uid");
  if (flags.workaround) chips.push("workaround-xdg");
  if (flags.xdgIgnored && flags.xdgSet && !flags.warded) {
    chips.push("fallback-ignores-xdg");
  }
  if (flags.peerTokenHolds && (flags.squatted || flags.messagingOff || ticket.seed === "dos-only")) {
    chips.push("dos-only");
  }
  if (flags.peerPathOk && !flags.squatted) chips.push("peer-path-ok");
  if (flags.statusSilent && flags.messagingOff) chips.push("status-silent");
  if (ticket.seed && VERDICTS.includes(ticket.seed)) chips.push(ticket.seed);
  return [...new Set(chips)];
}

function reasonsOf(ticket, flags, verdict) {
  const reasons = [];
  if (verdict === "warded") {
    reasons.push(
      "warded postern; session uid owns the sockets dir it uses (or private XDG that is honored); messaging on",
    );
    reasons.push("hold: the postern is the session uid's own; the ward holds");
  }
  if (verdict === "squatted") {
    reasons.push(
      `squatted; uid ${ticket.primaryDirOwnerUid ?? OTHER_UID} owns primary ${PRIMARY_DIR} AND per-uid fallback ${FALLBACK_DIR_PREFIX}${ticket.sessionUid ?? SESSION_UID}; messaging off`,
    );
  }
  if (flags.firstCome || verdict === "first-come") {
    reasons.push(
      "first-come; /tmp/cc-socks is still the shared primary; /tmp is world-writable sticky; first account after each /tmp clear keeps it at mode 0700",
    );
  }
  if (flags.tmpCleared || verdict === "boot-order") {
    reasons.push(
      "boot-order; macOS clears /tmp so the winner can change after a reboot; support answers depend on login order",
    );
  }
  if (flags.fallbackForeign || verdict === "postern-refused") {
    reasons.push(
      "postern-refused; the refusal path tries the per-uid directory once, then stops",
    );
  }
  if (flags.noHome || verdict === "no-third-door") {
    reasons.push(
      "no-third-door; no $HOME fallback before giving up; another account cannot create a directory under the user's own home",
    );
  }
  if (flags.predictable || verdict === "predictable-uid") {
    reasons.push(
      `predictable-uid; fallback name is public cc-socks-<uid>; uid suffix costs ${UID_SUFFIX_BYTES} bytes of a ${UDS_BUDGET_BYTES}-byte UDS path budget`,
    );
  }
  if (flags.workaround || verdict === "workaround-xdg") {
    reasons.push(
      `workaround-xdg; XDG_RUNTIME_DIR=/tmp/claude-<uid> keeps messaging; resulting socket path ${WORKAROUND_PATH_BYTES} bytes, inside the ${UDS_BUDGET_BYTES}-byte limit`,
    );
  }
  if (flags.xdgIgnored || verdict === "fallback-ignores-xdg") {
    reasons.push(
      "fallback-ignores-xdg; nNn() ignores both XDG_RUNTIME_DIR and CLAUDE_CODE_TMPDIR",
    );
  }
  if (flags.peerTokenHolds || verdict === "dos-only") {
    reasons.push(
      "dos-only; owner check + peerToken file still stop the squatting account from receiving anyone else's messages; cite chip, not a hold",
    );
  }
  if (flags.peerPathOk || verdict === "peer-path-ok") {
    reasons.push(
      "peer-path-ok; case 1 still discovers via sessions json; peers never resolve the directory by convention",
    );
  }
  if (flags.statusSilent || verdict === "status-silent") {
    reasons.push(
      "status-silent; refusal is not reported in /status; reporter asks to report the refusal in /status",
    );
  }
  if (flags.cousinOnly) {
    reasons.push(
      "cousin #89401 is not Postern; symptom treated in 2.1.248; #91223 documents the remaining first-come + dual-name squat",
    );
  }
  if (verdict === "squatted" || flags.squatted) {
    reasons.push(HYPOTHESIS_NOTE);
    reasons.push(CONTRAST_NOTE);
  }
  if (verdict !== "warded") {
    reasons.push(PHRASE);
  }
  return reasons;
}

function pickVerdict(seed, flags) {
  const named = canonicalSeed(seed);
  if (named === IDLE_WORD && (flags.warded || !flags.squatted)) return "warded";
  if (named === SEEDED_WORD) return "squatted";
  if (VERDICTS.includes(named) && named !== IDLE_WORD) return named;
  if (flags.squatted) return "squatted";
  if (flags.workaround && flags.messagingOn) return "workaround-xdg";
  if (flags.xdgSet && flags.xdgIgnored && flags.messagingOff) {
    return "fallback-ignores-xdg";
  }
  if (flags.firstCome) return "first-come";
  if (flags.tmpCleared) return "boot-order";
  if (flags.fallbackForeign && flags.messagingOff) return "postern-refused";
  if (flags.noHome && flags.messagingOff && flags.bothForeign) {
    return "no-third-door";
  }
  if (flags.warded) return "warded";
  return "warded";
}

function baileyOf(flags, ticket, verdict) {
  if (verdict === "squatted" || flags.squatted) {
    return {
      greatGate: "barred — another uid owns /tmp/cc-socks",
      postern: `barred — another uid owns /tmp/cc-socks-${ticket.sessionUid ?? SESSION_UID}`,
      thirdArch: "ghosted — no $HOME door before the ward fails",
      rushlight: "gutters — both leaves barred; messaging off",
      note: PHRASE,
    };
  }
  if (verdict === "workaround-xdg" || flags.workaround) {
    return {
      greatGate: "bypassed — primary no longer resolves to /tmp/cc-socks",
      postern: "unused — XDG private dir is the session's own",
      thirdArch: "ghosted — still no $HOME door in the fallback path",
      rushlight: "steady — messaging on; 35-byte path",
      note: "Workaround: XDG_RUNTIME_DIR=/tmp/claude-<uid> keeps messaging.",
    };
  }
  if (verdict === "first-come" || flags.firstCome) {
    return {
      greatGate: "held by first-come — shared /tmp/cc-socks",
      postern: "open — session uid owns the per-uid leaf",
      thirdArch: "ghosted — not needed while the postern opens",
      rushlight: "steady — peers find the socket via sessions json",
      note: "First-come: diagnostic cost, not a peer-discovery break.",
    };
  }
  return {
    greatGate: "open — session uid owns the sockets dir it uses",
    postern: "warded — the session uid's own leaf",
    thirdArch: "ghosted — the missing door under $HOME",
    rushlight: "steady — messaging on; the ward holds",
    note: "Warded: session uid owns the sockets dir it uses; messaging on.",
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
    warded: verdict === "warded" || (flags.warded && !flags.squatted && verdict !== SEEDED_WORD),
    squatted: verdict === "squatted" || flags.squatted,
    hold,
    alarm: !hold,
    idleWord: IDLE_WORD,
    seededWord: SEEDED_WORD,
    flags,
    contrast: baileyOf(flags, ticket, verdict),
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
  if (name === SEEDED_WORD || name === 91223 || name === "91223") {
    return analyze(seedSquatted());
  }
  if (name === "first-come") return analyze(seedFirstCome());
  if (name === "boot-order") return analyze(seedBootOrder());
  if (name === "postern-refused") return analyze(seedPosternRefused());
  if (name === "no-third-door") return analyze(seedNoThirdDoor());
  if (name === "predictable-uid") return analyze(seedPredictableUid());
  if (name === "workaround-xdg") return analyze(seedWorkaroundXdg());
  if (name === "fallback-ignores-xdg") return analyze(seedFallbackIgnoresXdg());
  if (name === "dos-only") return analyze(seedDosOnly());
  if (name === "peer-path-ok") return analyze(seedPeerPathOk());
  if (name === "status-silent") return analyze(seedStatusSilent());
  if (name === IDLE_WORD || name === "warded") {
    return analyze(seedWarded());
  }
  if (name === 89401 || name === "89401" || name === "cousin") {
    return analyze(seedCousin());
  }
  if (SEED_FNS[name]) return analyze(SEED_FNS[name]());
  return analyze(seedWarded());
}

export function handle(input) {
  const result = analyze(input);
  return {
    ...result,
    hookSpecificOutput: {
      additionalContext:
        result.verdict === "squatted" || (result.squatted && result.alarm)
          ? `squatted postern #${FEATURED_ISSUE}: another uid owns ${PRIMARY_DIR} AND the per-uid fallback; messaging off; DoS only (peerToken holds). ${HYPOTHESIS_NOTE}`
          : result.verdict === "first-come"
            ? "first-come. Shared /tmp/cc-socks owned by whoever started first. Score the postern."
            : result.verdict === "workaround-xdg"
              ? "workaround-xdg. XDG_RUNTIME_DIR=/tmp/claude-<uid> keeps messaging (35-byte path)."
              : `warded postern. Idle word ${IDLE_WORD}. Session uid owns the sockets dir it uses; messaging on.`,
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
