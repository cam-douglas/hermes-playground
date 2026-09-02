#!/usr/bin/env node
/**
 * Hawser — dockyard hawser / process-reap bench classifier.
 * A hawser that never slips after idle is not a release — it
 * is a fouled pile. Score the reap or admit the warm children
 * already fouled.
 *
 *   echo '{"children":1182,"reaped":false}' | node hawser.mjs
 *   node hawser.mjs ticket.json
 *
 * Idle word is slipped (HOLD: idle disconnect reaps the
 * per-session claude.exe + MCP children; tree returns to 1).
 * Seeded state is fouled / #91578 (WarmLifecycle logs
 * "Idle timeout reached, disconnecting" but children are
 * never reaped; 1 → 1182 / 32.9 GB RSS in one day).
 *
 * This is a diagnostic scoring desk. NOT an exploit.
 * No payloads. No attack procedures. No real credentials.
 * Score fixture strings for whether the hawser slipped
 * (children reaped after idle) or already fouled
 * (monotonic unreaped pile).
 *
 * Primary #91578: Windows desktop app idle warm sessions
 * never release MCP child processes (1 to 1,182 children /
 * 33 GB RSS in one day, ends in GPU process crash).
 * Reporter megzieberr. Filed 2026-09-02T19:08:38Z. OPEN.
 * Labels: bug, has-repro, platform:windows, area:mcp,
 * area:desktop.
 *
 * Hypothesis only (NON-BINDING): WarmLifecycle disconnects
 * the session IPC but does not terminate the per-session
 * claude.exe + MCP child tree on Windows (no Job Object /
 * no cascading kill). Each subsequent warm adds another
 * unreaped copy. Discard if issue evidence disagrees. Do
 * not claim Claude Code source you have not seen.
 */

import { readFileSync } from "node:fs";
import { stdin } from "node:process";
import { pathToFileURL } from "node:url";

export const VERDICTS = Object.freeze([
  "slipped",
  "fouled",
  "unreaped",
  "idle-timeout",
  "warmlifecycle",
  "process-tree",
  "rss-climb",
  "gpu-crash",
  "monotonic",
  "per-session-cost",
  "hold",
]);
export const IDLE_WORD = "slipped";
export const SEEDED_WORD = "fouled";
export const HOLD_VERDICTS = Object.freeze(["slipped", "hold"]);
export const ALARM_VERDICTS = Object.freeze(
  VERDICTS.filter((name) => !HOLD_VERDICTS.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FEATURED_ISSUE = 91578;
export const PRIMARY_ISSUES = Object.freeze([91578]);
export const COUSINS = Object.freeze([77593]);
export const COUSIN_ISSUE = 77593;
export const BACKUPS = Object.freeze([{ name: "Frisket", issue: 91574 }]);
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/91578";
export const TITLE =
  "Windows desktop app: idle warm sessions never release MCP child processes (1 to 1,182 children / 33 GB RSS in one day, ends in GPU process crash)";
export const FILED_AT = "2026-09-02T19:08:38Z";
export const UPDATED_AT = "2026-09-02T19:18:33Z";
export const LABELS = Object.freeze([
  "bug",
  "has-repro",
  "platform:windows",
  "area:mcp",
  "area:desktop",
]);
export const REPORTER = "megzieberr";
export const VERSION = "1.40609.1";
export const CLI_VERSION = "2.1.255";
export const PLATFORM = "Windows 11 Pro, build 10.0.26200, x64, 28 GB RAM";
export const AREA = "area:mcp + area:desktop";
export const EVIDENCE = "warmlifecycle-idle-disconnect-never-reaps-mcp-children";
export const CHILDREN_START = 1;
export const CHILDREN_END = 1182;
export const RSS_START_MB = 38;
export const RSS_END_GB = 32.9;
export const SYS_FREE_START_GB = 17.7;
export const SYS_FREE_END_GB = 4.5;
export const IDLE_TIMEOUT_S = 900;
export const GPU_EXIT = 101457950;
export const MCP_COUNT = 10;
export const TOOL_COUNT = 92;
export const PER_SESSION_CHILDREN = 10;
export const WARM_5_CHILDREN = 50;
export const WARM_5_RSS_GB = 2;
export const RUN_DATE = "2026-09-02";
export const RUN_START = "08:49";
export const RUN_END = "20:30";
export const LOG_IDLE_START =
  "2026-09-02 20:30:13 [info] [WarmLifecycle:session] Starting idle timeout for local_81866749-...: 900s";
export const LOG_IDLE_DISCONNECT =
  "2026-09-02 20:30:15 [info] [WarmLifecycle:session] Idle timeout reached, disconnecting local_d3800dbc-...";
export const LOG_GPU =
  "2026-09-02 20:30:22 [info] GPU process gone: { type: 'GPU', reason: 'crashed', exitCode: 101457950, serviceName: 'GPU' }";
export const LOG_MEMORY =
  "2026-09-02 19:44:11 [info] [process-memory] trigger=interval tree_rss_sum=31631MB tree_footprint_sum=5355MB electron(20)=3807MB children(1060)=27825MB top=[electron_renderer:25048:889MB electron_main:8096:580MB child:57128:381MB child:49160:376MB child:30832:332MB] sys_free=6240MB/28524MB sys_free_raw=6240MB";
export const TELEMETRY = Object.freeze([
  { time: "08:49", children: 1, rss: "38 MB", free: "17.7 GB" },
  { time: "09:49", children: 138, rss: "4.6 GB", free: "15.8 GB" },
  { time: "10:49", children: 226, rss: "7.1 GB", free: "14.1 GB" },
  { time: "11:48", children: 369, rss: "10.6 GB", free: "13.3 GB" },
  { time: "12:48", children: 425, rss: "12.2 GB", free: "11.2 GB" },
  { time: "14:48", children: 534, rss: "14.5 GB", free: "10.2 GB" },
  { time: "15:48", children: 753, rss: "21.3 GB", free: "7.4 GB" },
  { time: "18:48", children: 1014, rss: "28.4 GB", free: "6.3 GB" },
  { time: "20:30", children: 1182, rss: "32.9 GB", free: "4.5 GB" },
]);
export const HUB_LINE =
  "08:50 hawser: a hawser that never slips after idle is not a release — it is a fouled pile. Score the reap or admit the warm children already fouled.";
export const MARK = "08:50 / hermes catalog #131 / #91578";
export const PHRASE =
  "Score the reap or admit the warm children already fouled.";
export const HYPOTHESIS_NOTE =
  "NON-BINDING: WarmLifecycle disconnects the session IPC but does not terminate the per-session claude.exe + MCP child tree on Windows (no Job Object / no cascading kill). Each subsequent warm adds another unreaped copy. Discard if issue evidence disagrees. Do not claim Claude Code source you have not seen.";
export const CONTRAST_NOTE =
  "This is WINDOWS DESKTOP APP IDLE WARM SESSIONS NEVER RELEASE MCP CHILD PROCESSES (1 TO 1,182 CHILDREN / 33 GB RSS IN ONE DAY, ENDS IN GPU PROCESS CRASH); AREA:MCP; AREA:DESKTOP; PLATFORM:WINDOWS. Every warmed local session spawns claude.exe plus a full copy of configured MCP servers (~10 servers / toolCount=92). When WarmLifecycle logs Idle timeout reached, disconnecting ..., child processes are NEVER reaped. Process tree grows monotonically (~+100 children/hour) until the GPU process dies and the app exits. Telemetry from one day (2026-09-02, started 08:49, died 20:30): 08:49 → 1 child / 38 MB; 20:30 → 1182 children / 32.9 GB RSS. Idle disconnects fire but child count never decreases. After a clean restart, warming ~5 restored sessions produced 50 children (~2 GB) within 90 seconds (~10 processes per warm). Desktop 1.40609.1 (bundled CLI 2.1.255); Windows 11 Pro 10.0.26200, 28 GB RAM. Reporter megzieberr. Filed 2026-09-02. OPEN, bug, has-repro, platform:windows, area:mcp, area:desktop.";
export const FORBIDDEN_IDLE = Object.freeze([
  "verbatim",
  "mangled",
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
  "homed",
  "crossed",
  "armed",
  "unheard",
]);
export const BANNED_NAMES = Object.freeze([
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
  "Veto",
  "Gasket",
  "Snib",
]);
export const FORBIDDEN_UI = Object.freeze([
  "Playfair Display",
  "Playfair",
  "DM Sans",
  "Fragment Mono",
  "Fragment",
  "Petrona",
  "Sora",
  "Fira Code",
  "Fira",
  "Source Serif 4",
  "Work Sans",
  "Inconsolata",
  "Spectral",
  "Karla",
  "Cormorant Garamond",
  "Cormorant",
  "Figtree",
  "Azeret Mono",
  "Azeret",
  "Newsreader",
  "Manrope",
  "JetBrains Mono",
  "JetBrains",
  "Brygada 1918",
  "Brygada",
  "Atkinson Hyperlegible",
  "Atkinson",
  "DM Mono",
  "Source Sans 3",
]);
export const NOT_PRODUCTS = Object.freeze([
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
  "veto",
  "gasket",
  "snib",
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
    persistReap: null,
    slipped: null,
    fouled: null,
    children: null,
    childrenAfterIdle: null,
    childrenRssMb: null,
    childrenRssGb: null,
    reaped: null,
    idleDisconnect: null,
    unreaped: null,
    idleTimeout: null,
    warmlifecycle: null,
    processTree: null,
    rssClimb: null,
    gpuCrash: null,
    monotonic: null,
    perSessionCost: null,
    gpuExit: null,
    idleTimeoutS: null,
    mcpCount: null,
    toolCount: null,
    logIdleDisconnect: "",
    logGpu: "",
    platform: "",
    area: "",
    evidence: "",
    appVersion: "",
    cliVersion: "",
    reporter: "",
    outputText: "",
  };
}

export function seedSlipped() {
  return {
    ...blankTicket(),
    seed: IDLE_WORD,
    source: "atelier",
    persistReap: true,
    slipped: true,
    fouled: false,
    children: CHILDREN_START,
    childrenAfterIdle: CHILDREN_START,
    childrenRssMb: RSS_START_MB,
    reaped: true,
    idleDisconnect: true,
    unreaped: false,
    idleTimeout: false,
    warmlifecycle: false,
    processTree: false,
    rssClimb: false,
    gpuCrash: false,
    monotonic: false,
    perSessionCost: false,
    platform: PLATFORM,
    area: AREA,
    evidence: EVIDENCE,
    appVersion: VERSION,
    cliVersion: CLI_VERSION,
    outputText:
      "slipped; idle disconnect reaped the hawser; children returned to 1 / 38 MB; idle word slipped",
  };
}

export function seedFouled() {
  return {
    ...blankTicket(),
    seed: SEEDED_WORD,
    issue: FEATURED_ISSUE,
    title: TITLE,
    url: ISSUE_URL,
    source: "atelier",
    persistReap: false,
    slipped: false,
    fouled: true,
    children: CHILDREN_END,
    childrenAfterIdle: CHILDREN_END,
    childrenRssGb: RSS_END_GB,
    reaped: false,
    idleDisconnect: true,
    unreaped: true,
    idleTimeout: true,
    warmlifecycle: true,
    processTree: true,
    rssClimb: true,
    gpuCrash: true,
    monotonic: true,
    perSessionCost: true,
    gpuExit: GPU_EXIT,
    idleTimeoutS: IDLE_TIMEOUT_S,
    mcpCount: MCP_COUNT,
    toolCount: TOOL_COUNT,
    logIdleDisconnect: LOG_IDLE_DISCONNECT,
    logGpu: LOG_GPU,
    platform: PLATFORM,
    area: AREA,
    evidence: EVIDENCE,
    appVersion: VERSION,
    cliVersion: CLI_VERSION,
    reporter: REPORTER,
    outputText:
      "fouled; #91578; WarmLifecycle Idle timeout reached, disconnecting but children never reaped; 1 → 1182 / 32.9 GB RSS; GPU process gone exitCode 101457950; megzieberr; Desktop 1.40609.1; Windows 11 Pro; area:mcp area:desktop",
  };
}

export function seedUnreaped() {
  return {
    ...blankTicket(),
    seed: "unreaped",
    source: "atelier",
    unreaped: true,
    reaped: false,
    fouled: true,
    persistReap: false,
    childrenAfterIdle: CHILDREN_END,
    outputText:
      "unreaped; Idle timeout reached, disconnecting fired; child count never decreased",
  };
}

export function seedIdleTimeout() {
  return {
    ...blankTicket(),
    seed: "idle-timeout",
    source: "atelier",
    idleTimeout: true,
    idleTimeoutS: IDLE_TIMEOUT_S,
    idleDisconnect: true,
    fouled: true,
    persistReap: false,
    outputText:
      "idle-timeout; WarmLifecycle Starting idle timeout ...: 900s then Idle timeout reached, disconnecting; the line never slips",
  };
}

export function seedWarmlifecycle() {
  return {
    ...blankTicket(),
    seed: "warmlifecycle",
    source: "atelier",
    warmlifecycle: true,
    idleDisconnect: true,
    fouled: true,
    persistReap: false,
    logIdleDisconnect: LOG_IDLE_DISCONNECT,
    outputText:
      "warmlifecycle; WarmLifecycle:session logs disconnect but the process tree never slips",
  };
}

export function seedProcessTree() {
  return {
    ...blankTicket(),
    seed: "process-tree",
    source: "atelier",
    processTree: true,
    children: CHILDREN_END,
    fouled: true,
    persistReap: false,
    outputText:
      "process-tree; 1 → 1182 children across 08:49–20:30; tree grows monotonically",
  };
}

export function seedRssClimb() {
  return {
    ...blankTicket(),
    seed: "rss-climb",
    source: "atelier",
    rssClimb: true,
    childrenRssGb: RSS_END_GB,
    fouled: true,
    persistReap: false,
    outputText:
      "rss-climb; children RSS 38 MB → 32.9 GB; system free 17.7 GB → 4.5 GB",
  };
}

export function seedGpuCrash() {
  return {
    ...blankTicket(),
    seed: "gpu-crash",
    source: "atelier",
    gpuCrash: true,
    gpuExit: GPU_EXIT,
    fouled: true,
    persistReap: false,
    logGpu: LOG_GPU,
    outputText:
      "gpu-crash; GPU process gone reason crashed exitCode 101457950; last log line of the run",
  };
}

export function seedMonotonic() {
  return {
    ...blankTicket(),
    seed: "monotonic",
    source: "atelier",
    monotonic: true,
    children: CHILDREN_END,
    childrenAfterIdle: CHILDREN_END,
    fouled: true,
    persistReap: false,
    outputText:
      "monotonic; child count never decreases after idle disconnects; still 1182 immediately after WarmLifecycle disconnect",
  };
}

export function seedPerSessionCost() {
  return {
    ...blankTicket(),
    seed: "per-session-cost",
    source: "atelier",
    perSessionCost: true,
    mcpCount: MCP_COUNT,
    toolCount: TOOL_COUNT,
    fouled: true,
    persistReap: false,
    outputText:
      "per-session-cost; after clean restart, warming ~5 restored sessions produced 50 children (~2 GB) within 90 seconds; ~10 processes per warm session",
  };
}

export function seedHold() {
  return {
    ...seedSlipped(),
    seed: "hold",
    outputText:
      "hold; idle disconnect reaped the hawser; children returned to 1; the bitts hold; idle word slipped",
  };
}

export function seedCousin() {
  return {
    ...seedSlipped(),
    seed: IDLE_WORD,
    issue: COUSIN_ISSUE,
    isolation: "cousin",
    cousin: String(COUSIN_ISSUE),
    outputText:
      "cousin-not-primary; #77593 Windows background Bash orphans — cite only, not the #91578 WarmLifecycle MCP-child reap",
  };
}

export function emptyTicket() {
  return seedSlipped();
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
    persistReap: firstBool(nested.persistReap, src.persistReap),
    slipped: firstBool(nested.slipped, src.slipped),
    fouled: firstBool(nested.fouled, src.fouled),
    children: firstNum(nested.children, src.children),
    childrenAfterIdle: firstNum(
      nested.childrenAfterIdle,
      src.childrenAfterIdle,
    ),
    childrenRssMb: firstNum(nested.childrenRssMb, src.childrenRssMb),
    childrenRssGb: firstNum(nested.childrenRssGb, src.childrenRssGb),
    reaped: firstBool(nested.reaped, src.reaped),
    idleDisconnect: firstBool(nested.idleDisconnect, src.idleDisconnect),
    unreaped: firstBool(nested.unreaped, src.unreaped),
    idleTimeout: firstBool(nested.idleTimeout, src.idleTimeout),
    warmlifecycle: firstBool(nested.warmlifecycle, src.warmlifecycle),
    processTree: firstBool(nested.processTree, src.processTree),
    rssClimb: firstBool(nested.rssClimb, src.rssClimb),
    gpuCrash: firstBool(nested.gpuCrash, src.gpuCrash),
    monotonic: firstBool(nested.monotonic, src.monotonic),
    perSessionCost: firstBool(nested.perSessionCost, src.perSessionCost),
    gpuExit: firstNum(nested.gpuExit, src.gpuExit),
    idleTimeoutS: firstNum(nested.idleTimeoutS, src.idleTimeoutS),
    mcpCount: firstNum(nested.mcpCount, src.mcpCount),
    toolCount: firstNum(nested.toolCount, src.toolCount),
    logIdleDisconnect: firstText(
      nested.logIdleDisconnect,
      src.logIdleDisconnect,
    ),
    logGpu: firstText(nested.logGpu, src.logGpu),
    platform: firstText(nested.platform, src.platform),
    area: firstText(nested.area, src.area),
    evidence: firstText(nested.evidence, src.evidence),
    appVersion: firstText(nested.appVersion, src.appVersion),
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
    row.persistReap == null &&
    row.slipped == null &&
    row.fouled == null &&
    row.children == null &&
    row.childrenAfterIdle == null &&
    row.reaped == null &&
    row.unreaped == null &&
    row.monotonic == null
  );
}

const SEED_FNS = {
  [IDLE_WORD]: seedSlipped,
  [SEEDED_WORD]: seedFouled,
  unreaped: seedUnreaped,
  "idle-timeout": seedIdleTimeout,
  warmlifecycle: seedWarmlifecycle,
  "process-tree": seedProcessTree,
  "rss-climb": seedRssClimb,
  "gpu-crash": seedGpuCrash,
  monotonic: seedMonotonic,
  "per-session-cost": seedPerSessionCost,
  hold: seedHold,
  cousin: seedCousin,
  77593: seedCousin,
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
    return { ...seedFouled(), ...cloned, ...raw };
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
    ticket.logIdleDisconnect,
    ticket.logGpu,
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

function pileGrew(row) {
  if (row.childrenAfterIdle != null && row.childrenAfterIdle > CHILDREN_START) {
    return true;
  }
  if (row.children != null && row.children > CHILDREN_START && row.reaped === false) {
    return true;
  }
  if (row.childrenRssGb != null && row.childrenRssGb >= 10) return true;
  return false;
}

export function isSlipped(ticket) {
  const row = cloneTicket(ticket);
  if (row.isolation === "cousin") return true;
  if (canonicalSeed(row.seed) === IDLE_WORD) return true;
  if (canonicalSeed(row.seed) === "hold") return true;
  if (
    row.persistReap === true &&
    row.fouled !== true &&
    row.reaped !== false &&
    !pileGrew(row)
  ) {
    return true;
  }
  return false;
}

export function isFouled(ticket) {
  const row = cloneTicket(ticket);
  const named = canonicalSeed(row.seed);
  if (named === IDLE_WORD || named === "hold") {
    return false;
  }
  if (COUSINS.includes(row.issue) && named !== SEEDED_WORD) return false;
  if (named === SEEDED_WORD) return true;
  if (row.issue === FEATURED_ISSUE && named !== IDLE_WORD) return true;
  if (
    row.fouled === true ||
    row.unreaped === true ||
    row.reaped === false ||
    pileGrew(row) ||
    (row.persistReap === false && row.idleDisconnect === true) ||
    (row.monotonic === true && row.slipped === false)
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
    (COUSINS.includes(row.issue) || /cousin-not-primary|#77593/i.test(text)) &&
    named !== SEEDED_WORD &&
    row.issue !== FEATURED_ISSUE;
  const fouledNow = !cousinOnly && isFouled(row);
  const slippedNow = !fouledNow && isSlipped(row);
  const unreaped =
    row.unreaped === true ||
    row.reaped === false ||
    named === "unreaped" ||
    /unreaped|never reaped|child count never decreased/i.test(text);
  const idleTimeout =
    row.idleTimeout === true ||
    named === "idle-timeout" ||
    row.idleTimeoutS === IDLE_TIMEOUT_S ||
    /idle-timeout|Starting idle timeout|900s/i.test(text);
  const warmlifecycle =
    row.warmlifecycle === true ||
    named === "warmlifecycle" ||
    /warmlifecycle|WarmLifecycle:session|Idle timeout reached, disconnecting/i.test(
      text,
    );
  const processTree =
    row.processTree === true ||
    named === "process-tree" ||
    row.children === CHILDREN_END ||
    /process-tree|1 → 1182|1182 children/i.test(text);
  const rssClimb =
    row.rssClimb === true ||
    named === "rss-climb" ||
    row.childrenRssGb === RSS_END_GB ||
    /rss-climb|32\.9 GB|38 MB → 32\.9/i.test(text);
  const gpuCrash =
    row.gpuCrash === true ||
    named === "gpu-crash" ||
    row.gpuExit === GPU_EXIT ||
    /gpu-crash|GPU process gone|101457950/i.test(text);
  const monotonic =
    row.monotonic === true ||
    named === "monotonic" ||
    (row.childrenAfterIdle === CHILDREN_END && row.reaped === false) ||
    /monotonic|never decreases|still 1182/i.test(text);
  const perSessionCost =
    row.perSessionCost === true ||
    named === "per-session-cost" ||
    /per-session-cost|50 children|~10 processes per warm/i.test(text);
  const fouled =
    named !== IDLE_WORD &&
    named !== "hold" &&
    !cousinOnly &&
    (fouledNow || named === SEEDED_WORD || /fouled|#91578/i.test(text));
  const slipped =
    named === IDLE_WORD ||
    named === "hold" ||
    (slippedNow && !fouled);
  return {
    named,
    cousinOnly,
    fouledNow,
    slippedNow,
    unreaped,
    idleTimeout,
    warmlifecycle,
    processTree,
    rssClimb,
    gpuCrash,
    monotonic,
    perSessionCost,
    fouled,
    slipped,
  };
}

export function chipsOf(ticket) {
  const flags = flagsOf(ticket);
  const chips = [];
  if (flags.slipped && !flags.fouled) chips.push("slipped");
  if (flags.fouled) chips.push("fouled");
  if (flags.unreaped && flags.fouled) chips.push("unreaped");
  if (flags.idleTimeout && flags.fouled) chips.push("idle-timeout");
  if (flags.warmlifecycle && flags.fouled) chips.push("warmlifecycle");
  if (flags.processTree && flags.fouled) chips.push("process-tree");
  if (flags.rssClimb && flags.fouled) chips.push("rss-climb");
  if (flags.gpuCrash && flags.fouled) chips.push("gpu-crash");
  if (flags.monotonic && flags.fouled) chips.push("monotonic");
  if (flags.perSessionCost && flags.fouled) chips.push("per-session-cost");
  if ((flags.slipped || flags.named === "hold") && !flags.fouled) {
    chips.push("hold");
  }
  if (ticket.seed && VERDICTS.includes(ticket.seed)) chips.push(ticket.seed);
  return [...new Set(chips)];
}

function reasonsOf(ticket, flags, verdict) {
  const reasons = [];
  if (verdict === "slipped") {
    reasons.push(
      "slipped; idle disconnect reaped the hawser; children returned to 1 / 38 MB",
    );
    reasons.push("hold: the bitts are a clean release; idle word slipped");
  }
  if (verdict === "hold") {
    reasons.push(
      "hold; idle disconnect reaped the hawser; children returned to 1; the bitts hold",
    );
  }
  if (verdict === "fouled" || flags.fouled) {
    reasons.push(
      "fouled; #91578; WarmLifecycle Idle timeout reached, disconnecting but children never reaped; 1 → 1182 / 32.9 GB RSS",
    );
  }
  if (flags.unreaped || verdict === "unreaped") {
    reasons.push(
      "unreaped; Idle timeout reached, disconnecting fired; child count never decreased",
    );
  }
  if (flags.idleTimeout || verdict === "idle-timeout") {
    reasons.push(
      "idle-timeout; WarmLifecycle Starting idle timeout ...: 900s then Idle timeout reached, disconnecting; the line never slips",
    );
  }
  if (flags.warmlifecycle || verdict === "warmlifecycle") {
    reasons.push(
      "warmlifecycle; WarmLifecycle:session logs disconnect but the process tree never slips",
    );
  }
  if (flags.processTree || verdict === "process-tree") {
    reasons.push(
      "process-tree; 1 → 1182 children across 08:49–20:30; tree grows monotonically",
    );
  }
  if (flags.rssClimb || verdict === "rss-climb") {
    reasons.push(
      "rss-climb; children RSS 38 MB → 32.9 GB; system free 17.7 GB → 4.5 GB",
    );
  }
  if (flags.gpuCrash || verdict === "gpu-crash") {
    reasons.push(
      "gpu-crash; GPU process gone reason crashed exitCode 101457950; last log line of the run",
    );
  }
  if (flags.monotonic || verdict === "monotonic") {
    reasons.push(
      "monotonic; child count never decreases after idle disconnects; still 1182 immediately after WarmLifecycle disconnect",
    );
  }
  if (flags.perSessionCost || verdict === "per-session-cost") {
    reasons.push(
      "per-session-cost; after clean restart, warming ~5 restored sessions produced 50 children (~2 GB) within 90 seconds; ~10 processes per warm session",
    );
  }
  if (flags.cousinOnly) {
    reasons.push(
      "cousin is not Hawser; cite-only #77593 Windows background Bash orphans (no Job Object) — different mechanism from #91578 WarmLifecycle MCP-child reap; primary stays #91578",
    );
  }
  if (verdict === "fouled" || flags.fouled) {
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
  if (named === IDLE_WORD && (flags.slipped || !flags.fouled)) return "slipped";
  if (named === "hold" && !flags.fouled) return "hold";
  if (named === SEEDED_WORD) return "fouled";
  if (VERDICTS.includes(named) && !HOLD_VERDICTS.includes(named)) {
    return named;
  }
  if (flags.cousinOnly) return "slipped";
  if (flags.fouled) return "fouled";
  if (flags.slipped) return "slipped";
  return "slipped";
}

function benchOf(flags, ticket, verdict) {
  if (verdict === "fouled" || flags.fouled) {
    return {
      case: "fouled — idle disconnect logged; children never reaped",
      children: ticket.children ?? CHILDREN_END,
      rss: `${RSS_END_GB} GB`,
      reaped: false,
      mark: "hawser fouled; admit the warm children already fouled",
      note: PHRASE,
    };
  }
  if (verdict === "hold") {
    return {
      case: "hold — idle disconnect reaped the hawser",
      children: CHILDREN_START,
      rss: `${RSS_START_MB} MB`,
      reaped: true,
      mark: "hawser hold; the bitts hold",
      note: "Hold: the bitts hold.",
    };
  }
  return {
    case: "slipped — idle disconnect reaped the hawser; children returned to 1",
    children: CHILDREN_START,
    rss: `${RSS_START_MB} MB`,
    reaped: true,
    mark: "hawser slipped; idle word slipped",
    note: "Slipped: the bitts hold.",
  };
}

export function analyze(input) {
  const ticket = normalize(input);
  const flags = flagsOf(ticket);
  const chips = chipsOf(ticket);
  const seed = String(ticket.seed || "");
  const verdict = pickVerdict(seed, flags);
  const hold = HOLD_VERDICTS.includes(verdict);
  const fouled = verdict === "fouled" || flags.fouled;
  return {
    verdict,
    chips,
    reasons: reasonsOf(ticket, flags, verdict),
    slipped: verdict === "slipped" || (flags.slipped && !fouled),
    fouled,
    unreaped: flags.unreaped && fouled,
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
  if (name === SEEDED_WORD || name === 91578 || name === "91578") {
    return analyze(seedFouled());
  }
  if (name === "unreaped") return analyze(seedUnreaped());
  if (name === "idle-timeout") return analyze(seedIdleTimeout());
  if (name === "warmlifecycle") return analyze(seedWarmlifecycle());
  if (name === "process-tree") return analyze(seedProcessTree());
  if (name === "rss-climb") return analyze(seedRssClimb());
  if (name === "gpu-crash") return analyze(seedGpuCrash());
  if (name === "monotonic") return analyze(seedMonotonic());
  if (name === "per-session-cost") return analyze(seedPerSessionCost());
  if (name === "hold") return analyze(seedHold());
  if (name === IDLE_WORD || name === "slipped" || name === "open") {
    return analyze(seedSlipped());
  }
  if (name === 77593 || name === "77593" || name === "cousin") {
    return analyze(seedCousin());
  }
  if (SEED_FNS[name]) return analyze(SEED_FNS[name]());
  return analyze(seedSlipped());
}

export function handle(input) {
  const result = analyze(input);
  return {
    ...result,
    hookSpecificOutput: {
      additionalContext:
        result.verdict === "fouled" || (result.fouled && result.alarm)
          ? `fouled hawser #${FEATURED_ISSUE}: Windows desktop app idle warm sessions never release MCP child processes (1 to 1,182 children / 33 GB RSS). ${HYPOTHESIS_NOTE}`
          : result.verdict === "hold"
            ? "hold. idle disconnect reaped the hawser. Score the reap."
            : `slipped hawser. Idle word ${IDLE_WORD}. idle disconnect reaped the hawser; children returned to 1 / 38 MB.`,
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
