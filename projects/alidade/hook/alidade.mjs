#!/usr/bin/env node
/**
 * Alidade — surveyor's plane-table / station-plate classifier.
 * A sight on a foreign station with no plate is not a hold.
 * Score the peg or admit stationed.
 *
 *   echo '{"viewerHost":"HOME-DESK","toolHost":"DESKTOP-JNMKF1S"}' | node alidade.mjs
 *   node alidade.mjs ticket.json
 *
 * Idle word is stationed (viewer host matches tool host, station
 * plate shown, writes land on this desk).
 * Seeded state is displaced / #91055 (foreign host attached,
 * no plate, account-global list, shared profile path).
 * NEVER idle as displaced, alidade, noria, pelorus, strowger,
 * hung, marvered, unpinned, cocked, rinsed, vacant, reserved,
 * fronted, silvered, defaulted, kisted, belayed, misrouted.
 *
 * Primary #91055: Desktop session list is account-global;
 * opening a session created on another machine attaches that
 * machine's tool host with no host badge. Parent leak #90433
 * is sidebar title only. Alidade is the silent wrong-machine
 * tool runtime.
 *
 * Hypothesis only (NON-BINDING): treat this as account-global
 * session listing plus resume that binds the original machine's
 * tool host, with zero chrome that the viewer is not that host.
 * Do not claim a root cause in Claude Code source you have not
 * seen. Verify against the issue text and discard if wrong.
 *
 * This is a diagnostic scoring bench. NOT an exploit, attack
 * PoC, or remote-access how-to. No payloads. No reproduction
 * procedures. Score whether the Desktop session's tool host
 * matches the machine you are on.
 *
 * NOT Fascia (#90638) — trust dialog names wrong *local*
 * worktree cwd. Different host/child.
 * NOT Tain (#90257) — Chrome pairing identity split.
 * NOT Damper (#90341) — RC auto-enable.
 * NOT Kist (#90387) — RC archive sticky.
 * NOT Bollard (#90581) — RC env GC on supervisor gap.
 * NOT #90433 — sidebar title leak only (same-class extra).
 * NOT Shunt (#90463) — SendMessage follow-up misrouted to root.
 * Product name stays Alidade. Do not rename to Noria / Pelorus /
 * Strowger / Berth / Fascia / Tain / Damper / Kist / Bollard /
 * Shunt / Parison.
 */

import { readFileSync } from "node:fs";
import { stdin } from "node:process";
import { pathToFileURL } from "node:url";

export const VERDICTS = Object.freeze([
  "displaced",
  "foreign-host",
  "no-plate",
  "shared-path",
  "silent-uac",
  "account-list",
  "stationed",
  "plated",
  "host-match",
  "local-scope",
]);
export const IDLE_WORD = "stationed";
export const SEEDED_WORD = "displaced";
export const HOLD_VERDICTS = Object.freeze([
  "stationed",
  "plated",
  "host-match",
  "local-scope",
]);
export const ALARM_VERDICTS = Object.freeze(
  VERDICTS.filter((name) => !HOLD_VERDICTS.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FEATURED_ISSUE = 91055;
export const PRIMARY_ISSUES = Object.freeze([91055]);
export const TITLE_LEAK_ISSUE = 90433;
export const FASCIA_ISSUE = 90638;
export const TAIN_ISSUE = 90257;
export const DAMPER_ISSUE = 90341;
export const KIST_ISSUE = 90387;
export const BOLLARD_ISSUE = 90581;
export const SHUNT_ISSUE = 90463;
export const SAME_CLASS = Object.freeze([90433]);
export const COUSINS = Object.freeze([
  90638, 90257, 90341, 90387, 90581, 90463, 90433,
]);
export const NOT_PRODUCTS = Object.freeze([
  "fascia",
  "tain",
  "damper",
  "kist",
  "bollard",
  "shunt",
  "parison",
  "cockade",
  "lye",
  "advowson",
  "smutch",
  "noria",
  "pelorus",
  "strowger",
]);
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/91055";
export const TITLE =
  "[BUG] Opening a session created on another machine silently executes on that machine, with no host indication (escalation of #90433)";
export const FILED_AT = "2026-08-31T18:14:44Z";
export const LABELS = Object.freeze([
  "bug",
  "has repro",
  "platform:windows",
  "area:security",
  "area:desktop",
]);
export const REPORTER = "RingmasterSpain";
export const DESKTOP_VERSION = "1.40609.0.0";
export const CLI_VERSION = "2.1.247";
export const PLATFORM = "windows";
export const TOOL_HOST_SEEDED = "DESKTOP-JNMKF1S";
export const VIEWER_HOST_SEEDED = "HOME-DESK";
export const VIEWER_HOST_IDLE = "HOME-DESK";
export const TOOL_HOST_IDLE = "HOME-DESK";
export const SESSION_LABEL = "downloads-44 [4161f1]";
export const SHARED_CWD = "C:\\Users\\…\\Downloads";
export const MACHINE_A_NOTE = "ASUS ExpertBook B1502CBA laptop, office";
export const MACHINE_B_NOTE =
  "desktop PC at home, AMD Radeon AI PRO R9700, 4 SSDs";
export const HUB_LINE =
  "04:50 alidade: a sight on a foreign station with no plate is not a hold. Score the peg or admit stationed.";
export const MARK = "04:50 / hermes catalog #102 / #91055";
export const PHRASE =
  "A sight on a foreign station with no plate is not a hold. Score the peg or admit stationed.";
export const HYPOTHESIS_NOTE =
  "NON-BINDING: treat this as account-global session listing plus resume that binds the original machine's tool host, with zero chrome that the viewer is not that host. Do not claim a root cause in Claude Code source you have not seen. Verify against the issue text and discard if wrong.";
export const CONTRAST_NOTE =
  "This is DESKTOP SESSION-HOST IDENTITY vs REMOTE MACHINE TOOL RUNTIME — account-global list, resume attaches the original host, no station plate. Freeze is silent wrong-disk writes plus an invisible remote UAC hang. NOT Fascia (#90638) trust dialog that names the wrong *local* worktree cwd. NOT Tain (#90257) Chrome pairing identity split. NOT Damper (#90341) RC auto-enable. NOT Kist (#90387) RC archive sticky. NOT Bollard (#90581) RC env GC on supervisor gap. NOT #90433 sidebar title leak only (same-class extra: titles sync, tools do not attach). NOT Shunt (#90463) SendMessage follow-up misrouted to root. Product name stays Alidade.";
export const FORBIDDEN_IDLE = Object.freeze([
  "displaced",
  "alidade",
  "noria",
  "pelorus",
  "strowger",
  "hung",
  "marvered",
  "unpinned",
  "cocked",
  "rinsed",
  "vacant",
  "reserved",
  "fronted",
  "silvered",
  "defaulted",
  "kisted",
  "belayed",
  "misrouted",
]);
export const BANNED_NAMES = Object.freeze([
  "Noria",
  "Pelorus",
  "Strowger",
  "Berth",
  "Fascia",
  "Tain",
  "Damper",
  "Kist",
  "Bollard",
  "Shunt",
  "Parison",
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

function normHost(value) {
  return String(value || "")
    .trim()
    .toUpperCase();
}

function blankTicket() {
  return {
    seed: "",
    issue: null,
    viewerHost: "",
    toolHost: "",
    platePresent: null,
    cwd: "",
    cwdShared: null,
    accountGlobalList: null,
    sessionLabel: "",
    uacVisible: null,
    writesLandLocal: null,
    toolAttached: null,
    titleLeakOnly: null,
    cousin: "",
    desktopVersion: "",
    cliVersion: "",
    platform: "",
    outputText: "",
  };
}

export function emptyTicket() {
  return seedStationed();
}

export function seedStationed() {
  return {
    seed: IDLE_WORD,
    issue: null,
    viewerHost: VIEWER_HOST_IDLE,
    toolHost: TOOL_HOST_IDLE,
    platePresent: true,
    cwd: SHARED_CWD,
    cwdShared: false,
    accountGlobalList: false,
    sessionLabel: "local-desk [station]",
    uacVisible: true,
    writesLandLocal: true,
    toolAttached: true,
    titleLeakOnly: false,
    cousin: "",
    desktopVersion: DESKTOP_VERSION,
    cliVersion: CLI_VERSION,
    platform: PLATFORM,
    outputText:
      "stationed peg; viewer host matches tool host; station plate shown; writes land on this desk; idle word stationed",
  };
}

export function seedDisplaced() {
  return {
    seed: SEEDED_WORD,
    issue: FEATURED_ISSUE,
    title: TITLE,
    url: ISSUE_URL,
    filedAt: FILED_AT,
    labels: [...LABELS],
    reporter: REPORTER,
    viewerHost: VIEWER_HOST_SEEDED,
    toolHost: TOOL_HOST_SEEDED,
    platePresent: false,
    cwd: SHARED_CWD,
    cwdShared: true,
    accountGlobalList: true,
    sessionLabel: SESSION_LABEL,
    uacVisible: false,
    writesLandLocal: false,
    toolAttached: true,
    titleLeakOnly: false,
    cousin: "",
    desktopVersion: DESKTOP_VERSION,
    cliVersion: CLI_VERSION,
    platform: PLATFORM,
    machineA: MACHINE_A_NOTE,
    machineB: MACHINE_B_NOTE,
    listAgentsPeerLabel: "Remote Control",
    currentSessionHost: "",
    sameClass: [...SAME_CLASS],
    outputText:
      "displaced; foreign host attached; no station plate; account-global session list; shared profile path C:\\Users\\…\\Downloads; session downloads-44 [4161f1] with no host; tool host DESKTOP-JNMKF1S; viewer HOME-DESK; writes land on the foreign disk; UAC hangs unseen; Desktop 1.40609.0.0; CLI 2.1.247; Windows; escalation of #90433 title leak into silent tool runtime",
  };
}

export function seedHostMatch() {
  return {
    seed: "host-match",
    viewerHost: VIEWER_HOST_IDLE,
    toolHost: TOOL_HOST_IDLE,
    platePresent: true,
    cwdShared: false,
    accountGlobalList: false,
    writesLandLocal: true,
    toolAttached: true,
    outputText:
      "host-match; viewer hostname equals tool host; station plate present; writes land local",
  };
}

export function seedForeignHost() {
  return {
    seed: "foreign-host",
    viewerHost: VIEWER_HOST_SEEDED,
    toolHost: TOOL_HOST_SEEDED,
    platePresent: true,
    cwdShared: false,
    accountGlobalList: true,
    writesLandLocal: false,
    toolAttached: true,
    outputText:
      "foreign-host; tool host DESKTOP-JNMKF1S is not the viewing station HOME-DESK; plate may be present but the peg is foreign",
  };
}

export function seedNoPlate() {
  return {
    seed: "no-plate",
    viewerHost: VIEWER_HOST_IDLE,
    toolHost: TOOL_HOST_IDLE,
    platePresent: false,
    cwdShared: false,
    accountGlobalList: false,
    writesLandLocal: true,
    toolAttached: true,
    outputText:
      "no-plate; hosts match but the session chrome has no host badge; ListAgents labels peers Remote Control and says nothing about the session you are in",
  };
}

export function seedPlated() {
  return {
    seed: "plated",
    viewerHost: VIEWER_HOST_IDLE,
    toolHost: TOOL_HOST_IDLE,
    platePresent: true,
    cwdShared: false,
    writesLandLocal: true,
    toolAttached: true,
    outputText:
      "plated; station plate names the executing host; viewer can sight the peg",
  };
}

export function seedLocalScope() {
  return {
    seed: "local-scope",
    viewerHost: VIEWER_HOST_IDLE,
    toolHost: TOOL_HOST_IDLE,
    platePresent: true,
    accountGlobalList: false,
    writesLandLocal: true,
    toolAttached: true,
    outputText:
      "local-scope; session list scoped to this machine; earlier Desktop builds kept the code window independent per machine",
  };
}

export function seedSharedPath() {
  return {
    seed: "shared-path",
    viewerHost: VIEWER_HOST_SEEDED,
    toolHost: TOOL_HOST_SEEDED,
    platePresent: false,
    cwd: SHARED_CWD,
    cwdShared: true,
    accountGlobalList: true,
    writesLandLocal: false,
    toolAttached: true,
    outputText:
      "shared-path; C:\\Users\\…\\Downloads exists on both stations so every path in the transcript looks local",
  };
}

export function seedSilentUac() {
  return {
    seed: "silent-uac",
    viewerHost: VIEWER_HOST_SEEDED,
    toolHost: TOOL_HOST_SEEDED,
    platePresent: false,
    uacVisible: false,
    writesLandLocal: false,
    toolAttached: true,
    accountGlobalList: true,
    outputText:
      "silent-uac; elevation consent hangs on the unseen host; the viewer never sees the prompt",
  };
}

export function seedAccountList() {
  return {
    seed: "account-list",
    viewerHost: VIEWER_HOST_SEEDED,
    toolHost: TOOL_HOST_SEEDED,
    platePresent: false,
    accountGlobalList: true,
    toolAttached: true,
    outputText:
      "account-list; Desktop lists sessions from every machine on the shared account; resume attaches the original tool host",
  };
}

const COUSIN_BY_ISSUE = Object.freeze({
  [FASCIA_ISSUE]: "fascia",
  [TAIN_ISSUE]: "tain",
  [DAMPER_ISSUE]: "damper",
  [KIST_ISSUE]: "kist",
  [BOLLARD_ISSUE]: "bollard",
  [SHUNT_ISSUE]: "shunt",
  [TITLE_LEAK_ISSUE]: "title-leak",
});

export function seedCousin(kind) {
  const map = {
    fascia: {
      issue: FASCIA_ISSUE,
      cousin: "fascia",
      viewerHost: TOOL_HOST_SEEDED,
      toolHost: TOOL_HOST_SEEDED,
      platePresent: true,
      cwdShared: false,
      writesLandLocal: true,
      toolAttached: true,
      titleLeakOnly: false,
      outputText:
        "fascia cousin; trust dialog names spawn_task cwd while the session runs in a local .claude/worktrees path; same host; wrong local cwd; not a foreign station",
    },
    tain: {
      issue: TAIN_ISSUE,
      cousin: "tain",
      viewerHost: VIEWER_HOST_IDLE,
      toolHost: VIEWER_HOST_IDLE,
      platePresent: true,
      writesLandLocal: true,
      toolAttached: true,
      outputText:
        "tain cousin; Chrome pairing identity split; extension live-renders while list_connected_browsers is empty; not a Desktop session-host mismatch",
    },
    damper: {
      issue: DAMPER_ISSUE,
      cousin: "damper",
      viewerHost: VIEWER_HOST_IDLE,
      toolHost: VIEWER_HOST_IDLE,
      platePresent: true,
      writesLandLocal: true,
      toolAttached: true,
      outputText:
        "damper cousin; Remote Control auto-enable without /rc; not a silent foreign tool host on resume",
    },
    kist: {
      issue: KIST_ISSUE,
      cousin: "kist",
      viewerHost: VIEWER_HOST_IDLE,
      toolHost: VIEWER_HOST_IDLE,
      platePresent: true,
      writesLandLocal: true,
      toolAttached: true,
      outputText:
        "kist cousin; Remote Control archive sticky after teardown; not a wrong-machine attach with no plate",
    },
    bollard: {
      issue: BOLLARD_ISSUE,
      cousin: "bollard",
      viewerHost: VIEWER_HOST_IDLE,
      toolHost: VIEWER_HOST_IDLE,
      platePresent: true,
      writesLandLocal: true,
      toolAttached: true,
      outputText:
        "bollard cousin; Remote Control environment GC after a supervisor gap; not a foreign station peg",
    },
    shunt: {
      issue: SHUNT_ISSUE,
      cousin: "shunt",
      viewerHost: VIEWER_HOST_IDLE,
      toolHost: VIEWER_HOST_IDLE,
      platePresent: true,
      writesLandLocal: true,
      toolAttached: true,
      outputText:
        "shunt cousin; SendMessage follow-up misrouted to root; not a Desktop tool-host identity split",
    },
    "title-leak": {
      issue: TITLE_LEAK_ISSUE,
      cousin: "title-leak",
      viewerHost: VIEWER_HOST_SEEDED,
      toolHost: "",
      platePresent: false,
      accountGlobalList: true,
      toolAttached: false,
      titleLeakOnly: true,
      writesLandLocal: true,
      outputText:
        "title-leak cousin #90433; sidebar shows session titles from other machines; titles/metadata only; tools do not attach; no silent wrong-disk writes",
    },
  };
  const row = map[kind] || map.fascia;
  return {
    seed: row.cousin,
    cwd: SHARED_CWD,
    cwdShared: false,
    accountGlobalList: false,
    uacVisible: true,
    desktopVersion: DESKTOP_VERSION,
    cliVersion: CLI_VERSION,
    platform: PLATFORM,
    ...row,
  };
}

export function cloneTicket(input) {
  const src = input && typeof input === "object" && !Array.isArray(input) ? input : {};
  const nested =
    (src.ticket && typeof src.ticket === "object" && src.ticket) ||
    (src.alidade && typeof src.alidade === "object" && src.alidade) ||
    (src.station && typeof src.station === "object" && src.station) ||
    (src.peg && typeof src.peg === "object" && src.peg) ||
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
    viewerHost: firstText(
      nested.viewerHost,
      nested.viewer_host,
      nested.viewer,
      src.viewerHost,
    ),
    toolHost: firstText(
      nested.toolHost,
      nested.tool_host,
      nested.host,
      src.toolHost,
    ),
    platePresent: firstBool(
      nested.platePresent,
      nested.plate_present,
      nested.plate,
      src.platePresent,
    ),
    cwd: firstText(nested.cwd, nested.workingDirectory, src.cwd),
    cwdShared: firstBool(
      nested.cwdShared,
      nested.cwd_shared,
      nested.sharedPath,
      src.cwdShared,
    ),
    accountGlobalList: firstBool(
      nested.accountGlobalList,
      nested.account_global_list,
      nested.accountList,
      src.accountGlobalList,
    ),
    sessionLabel: firstText(
      nested.sessionLabel,
      nested.session_label,
      nested.session,
      src.sessionLabel,
    ),
    uacVisible: firstBool(
      nested.uacVisible,
      nested.uac_visible,
      src.uacVisible,
    ),
    writesLandLocal: firstBool(
      nested.writesLandLocal,
      nested.writes_land_local,
      src.writesLandLocal,
    ),
    toolAttached: firstBool(
      nested.toolAttached,
      nested.tool_attached,
      src.toolAttached,
    ),
    titleLeakOnly: firstBool(
      nested.titleLeakOnly,
      nested.title_leak_only,
      src.titleLeakOnly,
    ),
    cousin: firstText(nested.cousin, src.cousin),
    desktopVersion: firstText(
      nested.desktopVersion,
      nested.desktop_version,
      src.desktopVersion,
    ),
    cliVersion: firstText(nested.cliVersion, nested.cli_version, src.cliVersion),
    platform: firstText(nested.platform, src.platform),
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
    input.viewerHost == null &&
    input.toolHost == null &&
    input.platePresent == null &&
    input.writesLandLocal == null &&
    input.accountGlobalList == null &&
    input.cousin == null
  );
}

const SEED_FNS = {
  [IDLE_WORD]: seedStationed,
  [SEEDED_WORD]: seedDisplaced,
  "host-match": seedHostMatch,
  "foreign-host": seedForeignHost,
  "no-plate": seedNoPlate,
  plated: seedPlated,
  "local-scope": seedLocalScope,
  "shared-path": seedSharedPath,
  "silent-uac": seedSilentUac,
  "account-list": seedAccountList,
  fascia: () => seedCousin("fascia"),
  tain: () => seedCousin("tain"),
  damper: () => seedCousin("damper"),
  kist: () => seedCousin("kist"),
  bollard: () => seedCousin("bollard"),
  shunt: () => seedCousin("shunt"),
  "title-leak": () => seedCousin("title-leak"),
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
    return { ...seedDisplaced(), ...cloned, ...raw };
  }
  if (COUSIN_BY_ISSUE[issue] && coreMissing) {
    return { ...seedCousin(COUSIN_BY_ISSUE[issue]), ...cloned, ...raw };
  }
  const seedFn = SEED_FNS[String(cloned.seed || "").toLowerCase()];
  if (seedFn && coreMissing) {
    return { ...seedFn(), ...cloned, ...raw };
  }
  return { ...blankTicket(), ...cloned, ...raw };
}

function textOf(ticket) {
  return [
    ticket.outputText,
    ticket.title,
    ticket.sessionLabel,
    ticket.viewerHost,
    ticket.toolHost,
    ticket.cousin,
  ]
    .filter(Boolean)
    .join("\n");
}

export function flagsOf(ticket) {
  const row = cloneTicket(ticket);
  const text = textOf(row);
  const named = canonicalSeed(row.seed);
  const cousinName =
    row.cousin ||
    COUSIN_BY_ISSUE[row.issue] ||
    (/title-leak|#90433|sidebar.*title/i.test(text) ? "title-leak" : "") ||
    (/fascia|spawn_task cwd|worktrees/i.test(text) ? "fascia" : "") ||
    (/tain|chrome pairing|list_connected_browsers/i.test(text) ? "tain" : "") ||
    (/damper|remote control auto-enable/i.test(text) ? "damper" : "") ||
    (/kist|archive sticky/i.test(text) ? "kist" : "") ||
    (/bollard|supervisor gap|environment GC/i.test(text) ? "bollard" : "") ||
    (/shunt|SendMessage|misrouted to root/i.test(text) ? "shunt" : "");
  const viewer = normHost(row.viewerHost);
  const tool = normHost(row.toolHost);
  const hostsPresent = Boolean(viewer && tool);
  const hostMatch =
    hostsPresent &&
    viewer === tool &&
    !/foreign host|tool host .* is not the viewing/i.test(text);
  const foreignHost =
    (hostsPresent && viewer !== tool) ||
    /foreign host attached|tool host DESKTOP-JNMKF1S|foreign-host/i.test(text);
  const noPlate =
    row.platePresent === false ||
    /no station plate|no host badge|no-plate|with no host/i.test(text);
  const plateShown =
    row.platePresent === true ||
    (/station plate (shown|present|names)|plated/i.test(text) && !noPlate);
  const sharedPath =
    row.cwdShared === true ||
    /shared profile path|shared-path|C:\\Users\\…\\Downloads exists on both/i.test(
      text,
    );
  const silentUac =
    row.uacVisible === false ||
    /UAC hangs unseen|silent-uac|elevation consent hangs/i.test(text);
  const accountList =
    row.accountGlobalList === true ||
    /account-global session list|account-list|lists sessions from every machine/i.test(
      text,
    );
  const writesForeign =
    row.writesLandLocal === false ||
    /writes land on the foreign disk|wrong-disk/i.test(text);
  const titleOnly =
    row.titleLeakOnly === true ||
    row.toolAttached === false ||
    /title-leak|titles\/metadata only|tools do not attach/i.test(text);
  const cousinOnly = Boolean(cousinName) && !foreignHost && named !== SEEDED_WORD;
  const namedAlarm =
    VERDICTS.includes(named) &&
    named !== IDLE_WORD &&
    named !== SEEDED_WORD &&
    !HOLD_VERDICTS.includes(named);
  const namedHold = HOLD_VERDICTS.includes(named);
  const displaced =
    !cousinOnly &&
    !namedHold &&
    !titleOnly &&
    foreignHost &&
    noPlate &&
    (row.toolAttached !== false);
  const stationed =
    !namedAlarm &&
    !displaced &&
    !cousinOnly &&
    (namedHold ||
      (hostMatch && plateShown && !writesForeign) ||
      /stationed peg; viewer host matches/i.test(text));
  return {
    hostMatch,
    foreignHost,
    noPlate,
    plateShown,
    sharedPath,
    silentUac,
    accountList,
    writesForeign,
    titleOnly,
    cousinOnly,
    cousinName,
    displaced,
    stationed,
    namedAlarm,
    namedHold,
    viewer,
    tool,
  };
}

export function chipsOf(ticket) {
  const flags = flagsOf(ticket);
  const chips = [];
  if (flags.displaced) chips.push("displaced");
  if (flags.stationed) chips.push("stationed");
  if (flags.foreignHost && !flags.stationed) chips.push("foreign-host");
  if (flags.noPlate && !flags.stationed) chips.push("no-plate");
  if (flags.sharedPath && !flags.stationed) chips.push("shared-path");
  if (flags.silentUac && flags.foreignHost && !flags.stationed) {
    chips.push("silent-uac");
  }
  if (flags.accountList && !flags.stationed) chips.push("account-list");
  if (flags.plateShown && flags.hostMatch && !flags.displaced) {
    chips.push("plated");
  }
  if (flags.hostMatch && !flags.displaced) chips.push("host-match");
  if (!flags.accountList && flags.hostMatch && !flags.displaced) {
    chips.push("local-scope");
  }
  if (ticket.seed === "plated" && flags.plateShown) chips.push("plated");
  if (ticket.seed === "local-scope" && !flags.accountList) {
    chips.push("local-scope");
  }
  if (ticket.seed === "host-match" && flags.hostMatch) chips.push("host-match");
  return [...new Set(chips)];
}

function reasonsOf(ticket, flags, verdict) {
  const reasons = [];
  if (verdict === "stationed") {
    reasons.push(
      "stationed peg; viewer host matches tool host; station plate shown; writes land on this desk",
    );
    reasons.push("hold: the sight is on this station");
  }
  if (verdict === "plated") {
    reasons.push("plated; station plate names the executing host");
    reasons.push("hold: the peg is marked");
  }
  if (verdict === "host-match") {
    reasons.push("host-match; viewer hostname equals tool host");
  }
  if (verdict === "local-scope") {
    reasons.push("local-scope; session list scoped to this machine");
  }
  if (flags.foreignHost) {
    reasons.push(
      `tool host ${ticket.toolHost || TOOL_HOST_SEEDED} is not the viewing station ${ticket.viewerHost || VIEWER_HOST_SEEDED}`,
    );
  }
  if (flags.noPlate) {
    reasons.push(
      "no station plate; current session has no host badge; ListAgents may label peers Remote Control and say nothing about the session you are in",
    );
  }
  if (flags.sharedPath) {
    reasons.push(
      "shared profile path C:\\Users\\…\\Downloads exists on both machines, so every path in the transcript looks local",
    );
  }
  if (flags.silentUac && flags.foreignHost) {
    reasons.push(
      "elevation consent hangs on the unseen host; the viewer never sees the prompt",
    );
  }
  if (flags.accountList) {
    reasons.push(
      "account-global session list; resume attaches the original machine's tool host",
    );
  }
  if (flags.writesForeign) {
    reasons.push("writes land on the foreign disk; the viewer has no access");
  }
  if (flags.displaced || verdict === "displaced") {
    reasons.push(HYPOTHESIS_NOTE);
    reasons.push(CONTRAST_NOTE);
  }
  if (flags.cousinOnly || flags.cousinName) {
    reasons.push(
      `cousin ${flags.cousinName || "named"} is not Alidade; do not conflate with #91055 displaced`,
    );
  }
  if (verdict !== "stationed" && verdict !== "plated" && verdict !== "host-match") {
    reasons.push(PHRASE);
  }
  return reasons;
}

function canonicalSeed(seed) {
  const lower = String(seed || "").toLowerCase();
  return VERDICTS.find((name) => name.toLowerCase() === lower) || lower;
}

function pickVerdict(seed, flags) {
  const named = canonicalSeed(seed);
  if (flags.cousinOnly) return IDLE_WORD;
  if (named === IDLE_WORD && flags.stationed) return "stationed";
  if (named === SEEDED_WORD) return "displaced";
  if (VERDICTS.includes(named) && named !== IDLE_WORD) return named;
  if (flags.displaced) return "displaced";
  if (flags.foreignHost && !flags.noPlate) return "foreign-host";
  if (flags.noPlate && flags.hostMatch) return "no-plate";
  if (flags.stationed) return "stationed";
  if (flags.hostMatch && flags.plateShown) return "stationed";
  if (flags.hostMatch) return "host-match";
  return "stationed";
}

export function analyze(input) {
  const ticket = normalize(input);
  const flags = flagsOf(ticket);
  const chips = chipsOf(ticket);
  const seed = String(ticket.seed || "").toLowerCase();
  const verdict = pickVerdict(seed, flags);
  const hold = HOLD_VERDICTS.includes(verdict);
  return {
    verdict,
    chips,
    reasons: reasonsOf(ticket, flags, verdict),
    displaced: verdict === "displaced" || flags.displaced,
    stationed: verdict === "stationed" || flags.stationed,
    hold,
    alarm: !hold,
    idleWord: IDLE_WORD,
    seededWord: SEEDED_WORD,
    flags,
    contrast: {
      vane: flags.displaced
        ? "the alidade sights a foreign unmarked station"
        : flags.stationed || flags.hostMatch
          ? "the vane rests on this peg; the plate is stamped"
          : "no sight taken",
      plate: flags.noPlate
        ? "station plate missing; session chrome has no host"
        : flags.plateShown
          ? "station plate names the executing host"
          : "plate unread",
      compass: flags.foreignHost
        ? `viewer ${ticket.viewerHost || VIEWER_HOST_SEEDED} · tool ${ticket.toolHost || TOOL_HOST_SEEDED}`
        : flags.hostMatch
          ? `both hosts ${ticket.viewerHost || VIEWER_HOST_IDLE}`
          : "compass quiet",
      disk: flags.writesForeign
        ? "writes land on the foreign disk"
        : "writes land on this desk",
      note: flags.displaced
        ? PHRASE
        : flags.cousinOnly
          ? `Cousin ${flags.cousinName}: not a foreign-station attach.`
          : "Stationed: viewer host matches tool host; plate shown.",
    },
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
  if (name === SEEDED_WORD || name === 91055 || name === "91055") {
    return analyze(seedDisplaced());
  }
  if (name === "host-match") return analyze(seedHostMatch());
  if (name === "foreign-host") return analyze(seedForeignHost());
  if (name === "no-plate") return analyze(seedNoPlate());
  if (name === "plated") return analyze(seedPlated());
  if (name === "local-scope") return analyze(seedLocalScope());
  if (name === "shared-path") return analyze(seedSharedPath());
  if (name === "silent-uac") return analyze(seedSilentUac());
  if (name === "account-list") return analyze(seedAccountList());
  if (name === IDLE_WORD || name === "stationed") {
    return analyze(seedStationed());
  }
  if (COUSIN_BY_ISSUE[name] || SEED_FNS[name]) {
    const fn = SEED_FNS[name] || (() => seedCousin(COUSIN_BY_ISSUE[name]));
    return analyze(fn());
  }
  return analyze(seedStationed());
}

export function handle(input) {
  const result = analyze(input);
  return {
    ...result,
    hookSpecificOutput: {
      additionalContext:
        result.verdict === "displaced" || (result.displaced && result.alarm)
          ? `displaced station #${FEATURED_ISSUE}: foreign host ${TOOL_HOST_SEEDED} attached from ${VIEWER_HOST_SEEDED}; no plate; session ${SESSION_LABEL}. ${HYPOTHESIS_NOTE}`
          : result.verdict === "foreign-host"
            ? "foreign-host. Tool host is not the viewing station. Score the peg."
            : result.verdict === "no-plate"
              ? "no-plate. Hosts may match but the session chrome has no host badge."
              : result.verdict === "host-match"
                ? "host-match. Viewer hostname equals tool host. Hold."
                : `stationed peg. Idle word ${IDLE_WORD}. Viewer host matches tool host; station plate shown; writes land on this desk.`,
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
