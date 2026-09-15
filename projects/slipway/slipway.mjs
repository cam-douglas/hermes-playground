#!/usr/bin/env node
/**
 * Slipway — slipway / pier / undock / NIC-handoff /
 * mid-stream-cut booth.
 * A *slipway* is the inclined dock where a hull slides
 * from land into the fairway. When you undock (Ethernet
 * NIC goes away), the stream should re-seize the new
 * Wi-Fi fairway — not abandon the turn. Windows Ethernet
 * → Wi-Fi undock kills the in-flight streaming turn with
 * `API Error: Connection lost mid-response` and no retry.
 * No `Retrying (n/10)`, no `system`/`api_error` JSONL
 * record. Background sessions (`sessionKind: "bg"`)
 * silently idle for hours. NOT Freshet river-gauge.
 * NOT Kintsugi urushi/gold pottery. NOT Cenotaph marble
 * empty-tomb. NOT Stratum geology cores. NOT Tmesis
 * parchment. NOT Vedette cavalry lantern. NOT Orloj
 * Prague clock. NOT Brisure herald college. NOT Diptych
 * wax-tablet. NOT Vizard masque. NOT Treacle kettle.
 * NOT hawser / bollard / gangway hemp-rope benches.
 *
 * Educational diagnostic model for a published Claude Code
 * defect: Windows undock (USB-dock Ethernet → Wi-Fi NIC
 * swap) ends the in-flight streaming turn as a terminal
 * outcome. Path comes back in ~2s; every other app rides
 * through; Claude Code never retries. Disproportionately
 * kills background sessions — interactive users can press
 * enter; bg jobs silently idle.
 *
 * Encoded from anthropics/claude-code#94458 issue text only.
 * Hypothesis (NON-BINDING — issue text): a mid-stream
 * socket loss should be retried like any other transient
 * network error — re-resolve, open a fresh TCP connection
 * on the current default route, and resume the turn. At
 * minimum a background session whose turn was terminated
 * by a network error should not silently go idle.
 * Invite verify against #94458 text only. Do NOT claim a
 * root cause in Claude Code source you have not seen. Do
 * NOT implement a Claude Code fix. No network. No exploits.
 * No live Claude.
 *
 *   node slipway.mjs data/slipway.json
 *   echo '{"seed":"slipway"}' | node slipway.mjs
 *
 * Idle word is moored (HOLD: turn survives iface swap via
 * retry).
 * HOLD aliases: lashed, warped, fendered.
 * Seeded word is slipped (#94458 path).
 * Path word is iface-swap.
 * Product score word is slipway (Score slipway or admit
 * moored.).
 *
 * NOT #87987 (subagent stream no-retry but parent logged
 * api_error). NOT #89552 (macOS Wi-Fi drop sticky
 * ECONNRESET). NOT #94430 (desktop init-flood).
 */

/* Browser-safe: no top-level node: imports. CLI I/O is loaded only in main(). */

export const VERDICTS = Object.freeze([
  "moored",
  "slipped",
  "iface-swap",
  "lashed",
  "warped",
  "fendered",
  "nic-handoff",
  "mid-stream-cut",
  "no-retry",
  "bg-idle",
  "ethernet-drop",
  "wifi-reseize",
  "connection-lost",
  "turn-abandoned",
  "94458",
  "landing",
  "has-repro",
  "cousins",
  "backups",
  "fixtures",
  "walk",
  "closed",
]);

export const IDLE_WORD = "moored";
export const PATH_WORD = "iface-swap";
export const SEEDED_WORD = "slipped";
export const PRODUCT_WORD = "slipway";
export const HOLD = Object.freeze(["moored"]);
export const HOLD_ALIASES = Object.freeze(["lashed", "warped", "fendered"]);
export const RECOVER = Object.freeze(["moored"]);
export const ALARM = Object.freeze(
  VERDICTS.filter((name) => !HOLD.includes(name) && !HOLD_ALIASES.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FORBIDDEN_IDLE = Object.freeze([
  "buoyed",
  "surfaced",
  "charted",
  "sounding",
  "mended",
  "homed",
  "shared",
  "contiguous",
  "stationed",
  "lasting",
  "enrolled",
  "cleared",
  "repointed",
  "relocated",
  "settled",
  "single",
  "pledged",
  "brisk",
  "cadence",
  "verbatim",
  "quiet",
  "intact",
  "stood",
  "armed",
  "affixed",
  "unpacked",
  "scoped",
  "equated",
  "penned",
  "ungloved",
  "attested",
  "reaped",
  "tenanted",
  "barred",
  "additive",
  "literal",
  "echoing",
  "unabridged",
  "innocent",
  "silenced",
  "living",
  "crewed",
  "posted",
  "vigil",
  "tethered",
  "joined",
  "uncut",
  "bound",
  "clause-shut",
  "freshet",
  "kintsugi",
  "cenotaph",
  "stratum",
  "tmesis",
  "vedette",
  "orloj",
  "brisure",
  "diptych",
  "vizard",
  "treacle",
  "somnus",
  "cresset",
  "dictabelt",
  "lemure",
  "cancellans",
  "arras",
  "frangible",
  "nameplate",
  "matryoshka",
  "init-flood",
  "heal-abort",
  "dead-install",
  "layer-unsealed",
  "mid-inject",
  "idle-exit",
  "half-life",
  "fork-resume",
  "brief-echo",
  "background-reset",
  "streaming-stall",
  "device-absent",
  "hold-leak",
  "segment-drop",
  "orphan-tick",
  "deferred-delta",
  "phantom-prompt",
  "chmod-failopen",
]);

export const FORBIDDEN_SEED = Object.freeze([
  "freshet",
  "kintsugi",
  "cenotaph",
  "stratum",
  "tmesis",
  "vedette",
  "orloj",
  "brisure",
  "diptych",
  "vizard",
  "treacle",
  "somnus",
  "cresset",
  "dictabelt",
  "lemure",
  "cancellans",
  "arras",
  "cachet",
  "frangible",
  "nameplate",
  "matryoshka",
  "init-flood",
  "heal-abort",
  "dead-install",
  "layer-unsealed",
  "mid-inject",
  "idle-exit",
  "half-life",
  "fork-resume",
  "brief-echo",
  "background-reset",
  "streaming-stall",
  "device-absent",
  "hold-leak",
  "segment-drop",
  "orphan-tick",
  "deferred-delta",
  "phantom-prompt",
  "chmod-failopen",
  "escutcheon",
  "forksink",
  "diplopia",
  "dragnet",
  "matricula",
  "followspot",
  "stereotype",
  "hectograph",
  "hysteresis",
  "diopter",
  "setoff",
  "plimsoll",
  "graft",
  "ephemera",
  "mojibake",
  "fetchling",
  "veto",
  "sepulchre",
  "hawser",
  "bollard",
  "gangway",
]);

export const FEATURED_ISSUE = 94458;
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/94458";
export const TITLE =
  "[BUG] Windows: undock (Ethernet->Wi-Fi interface swap) ends the in-flight turn with no retry, silently killing background sessions";
export const STATE = "OPEN";
export const LABELS = Object.freeze([
  "bug",
  "has repro",
  "platform:windows",
  "area:core",
  "area:networking",
  "area:agent-view",
]);
export const PLATFORM = "windows";
export const SURFACE = "iface-swap";
export const HOST =
  "Claude Code 2.1.272 (also 2.1.270, 2.1.251, 2.1.233); Windows 11 Pro 10.0.26200 x64; Node v24.20.0; claude-opus-5; Realtek USB 2.5GbE dock → Intel Wi-Fi 7 BE211";
export const CHECKED_ON =
  "Published report: Windows undock Ethernet→Wi-Fi NIC swap kills the in-flight streaming turn with API Error: Connection lost mid-response; no Retrying (n/10); no system/api_error JSONL record; six same-second correlations with NetworkProfile id=10001 Disconnected; path back in ~2s; background sessions (sessionKind: bg) silently idle";
export const BUILD = "Claude Code 2.1.272 (also 2.1.270 / 2.1.251 / 2.1.233)";
export const SELECTED_MODEL = "claude-opus-5 — failure is a missing mid-stream retry, not a model defect";
export const OS = "Windows 11 Pro 10.0.26200 (x64)";
export const PHRASE = "Score slipway or admit moored.";
export const DISTRIBUTION =
  "Claude Code 2.1.272 (also 2.1.270, 2.1.251, 2.1.233 — long-standing, not a recent regression). Windows 11 Pro 10.0.26200 x64; Node v24.20.0; claude-opus-5. Wired NIC: Realtek USB 2.5GbE (dock). Wireless: Intel Wi-Fi 7 BE211. Wi-Fi adapter re-enumerates across dock cycles (Wi-Fi, Wi-Fi 2, Wi-Fi 5), so the interface index changes, not just the route. Six occurrences, all sessionKind: bg. Five inside 32-day Windows event-log retention land on the same second as Microsoft-Windows-NetworkProfile/Operational id=10001 (Network Disconnected). Path healthy within ~2 seconds (id=10000 Connected). JSONL: assistant synthetic API Error: Connection lost mid-response, then system/turn_duration — no api_error, no Retrying (n/10). Recovery never from a retry; only from a later queued turn or a human typing. One background session dead 16 hours. Another queued task-notifications 25 minutes later still produced no turn. Tailscale installed but not the trigger. No proxy.";

export const CODE_BUILD = "2.1.272";
export const ALSO_270 = "2.1.270";
export const ALSO_251 = "2.1.251";
export const ALSO_233 = "2.1.233";
export const PATH_BACK_SEC = 2;
export const OCCURRENCES = 6;
export const IDLE_HOURS = 16;
export const QUEUED_MIN = 25;
export const EVENT_DISC = 10001;
export const EVENT_CONN = 10000;
export const DURATION_MS = 52967;
export const NODE_VERSION = "v24.20.0";
export const NIC_WIRED = "Realtek USB 2.5GbE";
export const NIC_WIFI = "Intel Wi-Fi 7 BE211";
export const SESSION_KIND = "bg";
export const ERROR_LINE =
  "API Error: Connection lost mid-response. The response above may be incomplete.";
export const RETRY_LINE = "Retrying (n/10)";
export const JSONL_ASSISTANT = "assistant";
export const JSONL_TURN = "turn_duration";
export const WINDOWS_LOG = "Microsoft-Windows-NetworkProfile/Operational";

/**
 * Synthetic example-data — reconstructs published request shapes.
 * Labeled as such. Not a live dump.
 */
export const SYNTHETIC_MOORED = Object.freeze({
  kind: "moored",
  retried: true,
  turnSurvived: true,
  bgIdle: false,
  note: "turn survives iface swap via retry; fresh TCP on the new fairway",
  synthetic: true,
});
export const SYNTHETIC_SLIPPED = Object.freeze({
  kind: "slipped",
  retried: false,
  turnSurvived: false,
  bgIdle: true,
  note: "undock ends turn; no retry; bg session silently idle",
  synthetic: true,
});
export const SYNTHETIC_IFACE_SWAP = Object.freeze({
  kind: "iface-swap",
  rows: [
    { lane: "ethernet dock", block: "Realtek USB 2.5GbE goes away", live: false, note: "USB-C undock" },
    { lane: "wifi fairway", block: "Intel Wi-Fi 7 BE211 Up in ~2s", live: true, note: "id=10000 Connected" },
    { lane: "stream cut", block: ERROR_LINE, live: false, note: "treated as terminal turn" },
    { lane: "retry log", block: "no Retrying (n/10)", live: false, note: "unlike #87987 parent loop" },
    { lane: "jsonl gap", block: "no system/api_error record", live: false, note: "assistant synthetic then turn_duration" },
    { lane: "bg idle", block: "sessionKind: bg sits idle", live: false, note: "16h until Status?; 25m queued still dead" },
  ],
  note: "six-row evidence: hull slides off the slipway; iface-swap; no re-seize",
  synthetic: true,
});

export const EVIDENCE_ROWS = Object.freeze([
  {
    lane: "ethernet dock",
    role: "undock",
    content: "USB-C dock Ethernet NIC disappears; NetworkProfile id=10001 Disconnected",
    live: false,
    slipped: true,
  },
  {
    lane: "wifi fairway",
    role: "handoff",
    content: "Intel Wi-Fi 7 BE211 associates in ~2s; id=10000 Connected; every other app rides through",
    live: true,
    slipped: false,
  },
  {
    lane: "stream cut",
    role: "cut",
    content: "API Error: Connection lost mid-response. The response above may be incomplete.",
    live: false,
    slipped: true,
  },
  {
    lane: "retry log",
    role: "gap",
    content: "no Retrying (n/10); stream error treated as a terminal turn outcome",
    live: false,
    slipped: true,
    gap: true,
  },
  {
    lane: "jsonl gap",
    role: "gap",
    content: "assistant <synthetic> error then system/turn_duration; no api_error record",
    live: false,
    slipped: true,
    gap: true,
  },
  {
    lane: "bg idle",
    role: "idle",
    content: "sessionKind: bg — nobody to press enter; 16h dead; 25m queued task-notifications still no turn",
    live: false,
    slipped: true,
  },
]);

export const LEDGER_NAMES = Object.freeze([
  {
    id: "keel-cradle",
    lost: "Keel cradle — Ethernet dock drops; the hull is already mid-stream on the rails",
    control: "A moored cradle would re-seize the new fairway instead of sliding the turn into the drink",
    story: "the dock NIC goes away and the winch never takes a new bite",
  },
  {
    id: "sodium-lamp",
    lost: "Sodium lamp — NetworkProfile id=10001 same-second as the stream cut, six times",
    control: "the lamp would mark a retry, not a funeral",
    story: "the vapor light catches the undock and nothing retries",
  },
  {
    id: "eth-dock",
    lost: "ETH dock — Realtek USB 2.5GbE vanishes; interface index changes, not just the route",
    control: "a fresh TCP on the current default route would resume the turn",
    story: "the pier cable is gone; the fairway is already up",
  },
  {
    id: "wifi-fairway",
    lost: "Wi-Fi fairway — Intel Wi-Fi 7 BE211 Up in ~2s; every other program rides through",
    control: "the client would re-resolve and open a fresh socket on the new path",
    story: "the new channel is healthy; Claude Code never tries again",
  },
  {
    id: "undock-cut",
    lost: "Undock cut — API Error: Connection lost mid-response; treated as terminal",
    control: "a mid-stream socket loss would be retried like any other transient error",
    story: "the stream is declared finished the moment the dock slides away",
  },
  {
    id: "bg-idle-hull",
    lost: "BG idle hull — sessionKind bg sits unmanned; 16h until Status?; no Retrying (n/10)",
    control: "a background session would retry or surface a task notification",
    story: "nobody is at the winch house to press enter",
  },
]);

export const BOOTH_STATIONS = Object.freeze([
  {
    id: "cradle",
    survey: "moored HOLD: turn survives iface swap via retry",
    kind: "moored",
    note: "idle/control: the hull stays on the rails and re-seizes the fairway",
  },
  {
    id: "sodium-lamp",
    survey: "six same-second NetworkProfile id=10001 Disconnected hits; path back in ~2s",
    kind: "slipped",
    note: "seeded: the vapor lamp marks the undock",
  },
  {
    id: "eth-dock",
    survey: "Realtek USB 2.5GbE dock NIC goes away; Wi-Fi adapter re-enumerates (Wi-Fi / Wi-Fi 2 / Wi-Fi 5)",
    kind: "slipped",
    note: "seeded: the pier cable is gone",
  },
  {
    id: "wifi-fairway",
    survey: "Intel Wi-Fi 7 BE211 associates; every other app rides through; Claude Code never retries",
    kind: "slipped",
    note: "seeded: the new fairway is healthy",
  },
  {
    id: "undock-cut",
    survey: "API Error: Connection lost mid-response; no Retrying (n/10); no system/api_error JSONL",
    kind: "slipped",
    note: "seeded: the stream is treated as a terminal turn",
  },
  {
    id: "bg-idle-hull",
    survey: "iface-swap — sessionKind bg silently idle; 16h until Status?; 25m queued still no turn",
    kind: "slipped",
    note: "path: iface-swap names the undock that abandoned the turn",
  },
]);

export const FIELD_MARKS = Object.freeze([
  {
    id: "nic-handoff",
    label: "nic-handoff",
    count: "ETH→Wi-Fi",
    note: "USB-dock Ethernet goes away; Wi-Fi takes over; interface index changes",
  },
  {
    id: "mid-stream-cut",
    label: "mid-stream-cut",
    count: "terminal",
    note: "API Error: Connection lost mid-response treated as a terminal turn outcome",
  },
  {
    id: "no-retry",
    label: "no-retry",
    count: "0/10",
    note: "no Retrying (n/10); no system/api_error JSONL record",
  },
  {
    id: "bg-idle",
    label: "bg-idle",
    count: "bg",
    note: "sessionKind bg silently idle; interactive users can press enter",
  },
  {
    id: "iface-swap",
    label: "iface-swap",
    count: "undock",
    note: "orderly NIC swap; path healthy in ~2s; client never tries again",
  },
  {
    id: "connection-lost",
    label: "connection-lost",
    count: "cut",
    note: "assistant <synthetic> error then turn_duration; recovery never from a retry",
  },
]);

export const RULED_OUT = Object.freeze([
  " #87987 — subagent stream no-retry but parent loop logged api_error and recovered — DIFFERENT; cite only",
  " #89552 — macOS Wi-Fi drop sticky ECONNRESET that survives relaunch — DIFFERENT; cite only",
  " #94430 — desktop Remote Control initialize flood / No messages yet — DIFFERENT; cite only",
  " #93924 — RC local slowdown — DIFFERENT; cite only; backup next-focus",
  " #93770 — copy padding artifacts — DIFFERENT; enhancement; backup next-focus",
  " #93777 — Vercel MCP teamId — DIFFERENT; cite only; backup next-focus",
  " #94151 — Shift+PageUp Konsole — DIFFERENT; cite only; backup next-focus",
  "Freshet/#94430 — river-stage init-flood — DIFFERENT",
  "Kintsugi/#94451 — gold never sets; writer re-reads the corrupt vessel — DIFFERENT",
  "Cenotaph/#94452 — plaque polished, stone never moved — DIFFERENT",
  "Stratum/#94417 — project-context layer-unsealed — DIFFERENT",
  "Tmesis/#86198 — mid-inject slash splice — DIFFERENT",
  "Vedette/#94392 — headless -p idle-exit / false success — DIFFERENT",
  "Orloj/#94393 — Monitor schema cap / half-life — DIFFERENT",
  "hawser / bollard / gangway — hemp-rope process benches — DIFFERENT",
  "Treacle/#94344 — Windows PowerShell streaming-stall — DIFFERENT",
]);

export const EXPECTED = Object.freeze([
  "A mid-stream socket loss should be retried like any other transient network error",
  "The client should re-resolve, open a fresh TCP connection on the current default route, and resume the turn",
  "A background session whose turn was terminated by a network error should not silently go idle; retry or surface a task notification",
]);

export const SUGGESTED_FIX = Object.freeze([
  "Treat mid-stream connection-lost as retryable: Retrying (n/10) on a fresh socket after iface swap",
  "Write a system/api_error JSONL record so the harness can recover the turn without a human pressing enter",
]);

export const FINGERPRINT_LINES = Object.freeze([
  "iface-swap",
  "slipway",
  "nic-handoff",
  "mid-stream-cut",
  "no-retry",
  "bg-idle",
]);

export const COUSINS = Object.freeze([
  {
    issue: 87987,
    title: "subagent stream dies without retry; parent loop logged api_error and recovered",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — #87987 is a subagent stream no-retry but the parent did log api_error. DIFFERENT. Do not rebuild. Do not conflate.",
  },
  {
    issue: 89552,
    title: "macOS Wi-Fi drop sticky ECONNRESET",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — #89552 is a macOS Wi-Fi drop that poisons the client until reboot. DIFFERENT. Do not rebuild. Do not conflate.",
  },
]);

export const BACKUPS = Object.freeze([
  { issue: 93924, title: "backup next-focus — RC local slowdown", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93770, title: "backup next-focus — copy padding artifacts", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93777, title: "backup next-focus — Vercel MCP teamId", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94151, title: "backup next-focus — Shift+PageUp Konsole", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
]);

export const NOT_PRODUCTS = Object.freeze([
  "freshet",
  "kintsugi",
  "cenotaph",
  "stratum",
  "tmesis",
  "vedette",
  "orloj",
  "brisure",
  "diptych",
  "vizard",
  "treacle",
  "somnus",
  "cresset",
  "dictabelt",
  "lemure",
  "cancellans",
  "arras",
  "cachet",
  "stereotype",
  "frangible",
  "nameplate",
  "matryoshka",
  "forksink",
  "diplopia",
  "escutcheon",
  "followspot",
  "hectograph",
  "hysteresis",
  "diopter",
  "setoff",
  "plimsoll",
  "graft",
  "ephemera",
  "mojibake",
  "fetchling",
  "veto",
  "sepulchre",
  "hawser",
  "bollard",
  "gangway",
]);

export const SAMPLE_KIND_IDLE = "keel-cradle";
export const SAMPLE_KIND_SEEDED = "iface-swap";
export const SAMPLE_HOLDING_IDLE = "slipway-yard";
export const SAMPLE_HOLDING_SEEDED = "undock-cut";

export const SAMPLE_MOORED_PROOF = Object.freeze({
  moored: true,
  slipped: false,
  ifaceSwap: false,
  kind: SAMPLE_KIND_IDLE,
});

export const SAMPLE_SLIPPED_PROOF = Object.freeze({
  moored: false,
  slipped: true,
  ifaceSwap: true,
  nicHandoff: true,
  midStreamCut: true,
  noRetry: true,
  bgIdle: true,
  ethernetDrop: true,
  wifiReseize: true,
  connectionLost: true,
  turnAbandoned: true,
  kind: SAMPLE_KIND_SEEDED,
  names: LEDGER_NAMES.map((row) => row.id),
  mooredWatch: { ...SYNTHETIC_MOORED },
  slippedWatch: { ...SYNTHETIC_SLIPPED },
  ifaceSwapShape: { ...SYNTHETIC_IFACE_SWAP },
  evidence: EVIDENCE_ROWS,
  synthetic: true,
});

export const SAMPLE_WALK_LOG = Object.freeze([
  { t: "idle", line: "booth holds moored: turn survives iface swap via retry" },
  { t: "iface-swap", line: "Ethernet dock drops; Wi-Fi up in ~2s; stream treated as terminal" },
  { t: "path", line: "iface-swap — no Retrying (n/10); bg session silently idle" },
  { t: "score", line: "when the hull slides off the rails the booth is slipped — Score slipway or admit moored." },
]);

const FORCE_FLAGS = [
  "ifaceSwap",
  "nicHandoff",
  "midStreamCut",
  "noRetry",
  "bgIdle",
  "ethernetDrop",
  "wifiReseize",
  "connectionLost",
  "turnAbandoned",
];

const ISSUE_CUE_RE =
  /94458|Connection lost mid-response|Retrying \(n\/10\)|sessionKind|iface.?swap|undock|NetworkProfile|id=10001|Ethernet.?Wi-Fi|api_error/i;

/**
 * Educational NIC-handoff observer. Not a Claude Code patch.
 * Encodes only the published #94458 shapes.
 *
 * Path comes back in ~2s. Client never retries.
 */
export function observeIfaceSwap({
  ethernet = true,
  wifiUp = true,
  pathBackSec = PATH_BACK_SEC,
  moored = false,
} = {}) {
  if (moored === true) {
    return {
      ethernet: false,
      wifiUp: true,
      pathBackSec,
      swapped: false,
      retried: true,
      phrase: "admit moored",
      synthetic: true,
    };
  }
  const swapped = ethernet === true && wifiUp === true;
  return {
    ethernet: ethernet === true,
    wifiUp: wifiUp === true,
    pathBackSec,
    swapped,
    retried: false,
    phrase: swapped ? "score slipway" : "admit moored",
    note: swapped
      ? "Ethernet dock drops; Wi-Fi associates in ~2s; client never retries"
      : "no iface swap",
    synthetic: true,
  };
}

/**
 * Educational mid-stream cut. Not a Claude Code patch.
 * Published: stream error treated as a terminal turn outcome.
 */
export function inspectMidStreamCut({
  error = true,
  terminal = true,
  moored = false,
} = {}) {
  if (moored === true) {
    return {
      error: false,
      terminal: false,
      cut: false,
      phrase: "admit moored",
      synthetic: true,
    };
  }
  const cut = error === true && terminal === true;
  return {
    error: error === true,
    terminal: terminal === true,
    cut,
    phrase: cut ? "score slipway" : "admit moored",
    note: cut
      ? "API Error: Connection lost mid-response treated as a terminal turn"
      : "stream still open",
    synthetic: true,
  };
}

/**
 * Educational no-retry observer. Not a Claude Code patch.
 * Published: no Retrying (n/10); no system/api_error JSONL.
 */
export function inspectNoRetry({
  retryLogged = false,
  apiErrorRecord = false,
  moored = false,
} = {}) {
  if (moored === true) {
    return {
      retryLogged: true,
      apiErrorRecord: true,
      missing: false,
      phrase: "admit moored",
      synthetic: true,
    };
  }
  const missing = retryLogged === false && apiErrorRecord === false;
  return {
    retryLogged: retryLogged === true,
    apiErrorRecord: apiErrorRecord === true,
    missing,
    phrase: missing ? "score slipway" : "admit moored",
    note: missing
      ? "no Retrying (n/10); no system/api_error record — unlike #87987"
      : "retry path logged",
    synthetic: true,
  };
}

/**
 * Educational background-idle observer. Not a Claude Code patch.
 * Published: all six occurrences were sessionKind: bg.
 */
export function inspectBgIdle({
  sessionKind = SESSION_KIND,
  idleHours = IDLE_HOURS,
  moored = false,
} = {}) {
  if (moored === true) {
    return {
      sessionKind: "fg",
      idleHours: 0,
      silent: false,
      phrase: "admit moored",
      synthetic: true,
    };
  }
  const silent = sessionKind === SESSION_KIND && idleHours > 0;
  return {
    sessionKind,
    idleHours,
    silent,
    phrase: silent ? "score slipway" : "admit moored",
    note: silent
      ? "sessionKind bg silently idle; nobody to press enter"
      : "interactive session can recover by hand",
    synthetic: true,
  };
}

/**
 * Educational NetworkProfile correlation. Not a Claude Code patch.
 * Published: same-second id=10001 Disconnected, six times.
 */
export function inspectNicHandoff({
  disconnected = EVENT_DISC,
  connected = EVENT_CONN,
  sameSecond = true,
  moored = false,
} = {}) {
  if (moored === true) {
    return {
      disconnected,
      connected,
      sameSecond: false,
      correlated: false,
      phrase: "admit moored",
      synthetic: true,
    };
  }
  const correlated = disconnected === EVENT_DISC && sameSecond === true;
  return {
    disconnected,
    connected,
    sameSecond: sameSecond === true,
    correlated,
    phrase: correlated ? "score slipway" : "admit moored",
    note: correlated
      ? "NetworkProfile id=10001 same-second as the stream cut"
      : "no undock correlation",
    synthetic: true,
  };
}

/**
 * Educational connection-lost plaque. Not a Claude Code patch.
 * Published: assistant <synthetic> error then turn_duration.
 */
export function inspectConnectionLost({
  plaque = true,
  jsonlGap = true,
  moored = false,
} = {}) {
  if (moored === true) {
    return {
      plaque: false,
      jsonlGap: false,
      lie: false,
      phrase: "admit moored",
      synthetic: true,
    };
  }
  const lie = plaque === true && jsonlGap === true;
  return {
    plaque: plaque === true,
    jsonlGap: jsonlGap === true,
    lie,
    phrase: lie ? "score slipway" : "admit moored",
    note: lie
      ? "assistant synthetic Connection lost mid-response then turn_duration; no api_error"
      : "JSONL records a retryable api_error",
    synthetic: true,
  };
}

/**
 * Educational recovery-never-retry observer. Not a Claude Code patch.
 * Published: recovery only from a later queued turn or a human typing.
 */
export function inspectTurnAbandoned({
  recoveredFromRetry = false,
  occurrences = OCCURRENCES,
  moored = false,
} = {}) {
  if (moored === true) {
    return {
      recoveredFromRetry: true,
      occurrences,
      abandoned: false,
      phrase: "admit moored",
      synthetic: true,
    };
  }
  const abandoned = recoveredFromRetry === false && occurrences >= 1;
  return {
    recoveredFromRetry: recoveredFromRetry === true,
    occurrences,
    abandoned,
    phrase: abandoned ? "score slipway" : "admit moored",
    note: abandoned
      ? "recovery never came from a retry; empty queue means the session just stops"
      : "turn re-seized the fairway",
    synthetic: true,
  };
}

export function scoreIfaceSwap(input = {}) {
  const mooredHold = input.moored === true && input.slipped !== true;
  const swap = observeIfaceSwap({
    ethernet: !mooredHold,
    moored: mooredHold,
  });
  const slipped =
    !mooredHold &&
    (input.slipped === true ||
      input.ifaceSwap === true ||
      input.nicHandoff === true ||
      input.midStreamCut === true ||
      input.noRetry === true ||
      input.bgIdle === true ||
      input.ethernetDrop === true ||
      swap.swapped === true);
  return {
    moored: !slipped,
    slipped,
    ifaceSwap: slipped,
    swap,
    phrase: slipped ? "score slipway" : "admit moored",
  };
}

export function mentionsIssueCue(input = {}) {
  if (input.issue === FEATURED_ISSUE || input.issue === "94458") return true;
  const blob = typeof input === "string" ? input : JSON.stringify(input);
  return ISSUE_CUE_RE.test(blob);
}

export function mapSlipway(input = {}) {
  const slipped = isSlippedInput(input);
  const moored = input.moored === true && !slipped;
  return {
    stamp: slipped ? "iface-swap" : "slipway-yard",
    holdingLane: slipped ? "undock-cut" : "slipway-yard",
    kindLane: slipped ? "iface-swap" : "keel-cradle",
    bindLane: slipped ? "mid-stream-cut" : "winch-block",
    ribbon: slipped ? "slipped" : "moored",
    moored,
  };
}

export function inspectNicHandoffMark(input = {}) {
  const flagged =
    input.nicHandoff === true ||
    input.slipped === true ||
    isSlippedInput(input);
  if (input.moored === true && !flagged) {
    return { stamp: "lashed", flagged: false, note: "no undock; turn still moored" };
  }
  return {
    stamp: flagged ? "nic-handoff" : "dock-idle",
    flagged,
    note: flagged
      ? "nic-handoff — Ethernet dock drops; Wi-Fi takes the fairway"
      : "",
  };
}

export function inspectMidStreamMark(input = {}) {
  const missed =
    input.midStreamCut === true ||
    input.slipped === true ||
    input.ifaceSwap === true ||
    isSlippedInput(input);
  if (input.moored === true && !missed) {
    return { stamp: "warped", missed: false };
  }
  return {
    stamp: missed ? "mid-stream-cut" : "stream-idle",
    missed,
    note: missed
      ? "mid-stream-cut — Connection lost mid-response treated as terminal"
      : "",
  };
}

export function inspectNoRetryMark(input = {}) {
  const flagged =
    input.noRetry === true ||
    input.slipped === true ||
    isSlippedInput(input);
  if (input.moored === true && !flagged) {
    return { stamp: "fendered", flagged: false };
  }
  return {
    stamp: flagged ? "no-retry" : "retry-idle",
    flagged,
    note: flagged
      ? "no-retry — no Retrying (n/10); no system/api_error JSONL"
      : "",
  };
}

export function inspectBgOnly(input = {}) {
  const flagged =
    input.bgIdle === true ||
    input.slipped === true ||
    isSlippedInput(input);
  if (input.moored === true && !flagged) {
    return { stamp: "keel-cradle", flagged: false };
  }
  return {
    stamp: flagged ? "bg-idle" : "crew-idle",
    flagged,
    note: flagged
      ? "bg-idle — sessionKind bg silently idle; nobody to press enter"
      : "",
  };
}

export function inspectEthernetDrop(input = {}) {
  const flagged =
    input.ethernetDrop === true ||
    input.wifiReseize === true ||
    input.slipped === true ||
    isSlippedInput(input);
  if (input.moored === true && !flagged) {
    return { stamp: "lashed", flagged: false };
  }
  return {
    stamp: flagged ? "ethernet-drop" : "dock-idle",
    flagged,
    note: flagged
      ? "ethernet-drop — Realtek USB 2.5GbE vanishes; Wi-Fi re-enumerates"
      : "",
  };
}

function ledgerOpen(input, id) {
  const map = {
    "keel-cradle": input.slipped || input.ifaceSwap,
    "sodium-lamp": input.slipped || input.ifaceSwap || input.nicHandoff,
    "eth-dock": input.ethernetDrop || input.slipped,
    "wifi-fairway": input.wifiReseize || input.slipped,
    "undock-cut": input.midStreamCut || input.slipped,
    "bg-idle-hull": input.bgIdle || input.noRetry || input.slipped,
  };
  return (
    map[id] === true ||
    input.ifaceSwap === true ||
    input.slipped === true
  );
}

function isSlippedInput(input = {}) {
  return (
    input.slipped === true ||
    input.ifaceSwap === true ||
    input.nicHandoff === true ||
    input.midStreamCut === true ||
    input.noRetry === true ||
    input.bgIdle === true ||
    input.ethernetDrop === true ||
    input.wifiReseize === true ||
    input.connectionLost === true ||
    input.turnAbandoned === true
  );
}

export function readBooth(input = {}) {
  const slipped = isSlippedInput(input);
  const moored = input.moored === true && !slipped;
  return {
    mark: slipped ? "slipped" : "moored",
    moored,
    slipped,
    ifaceSwap: input.ifaceSwap === true || slipped,
    nicHandoff: input.nicHandoff === true,
    midStreamCut: input.midStreamCut === true,
    noRetry: input.noRetry === true,
    bgIdle: input.bgIdle === true,
    ethernetDrop: input.ethernetDrop === true,
    wifiReseize: input.wifiReseize === true,
    connectionLost: input.connectionLost === true,
    turnAbandoned: input.turnAbandoned === true,
    post: mapSlipway(input),
    handoff: inspectNicHandoffMark(input),
    cut: inspectMidStreamMark(input),
    retry: inspectNoRetryMark(input),
    bg: inspectBgOnly(input),
    dock: inspectEthernetDrop(input),
    names: LEDGER_NAMES.filter((row) => ledgerOpen(input, row.id)).map(
      (row) => row.id,
    ),
    evidence: EVIDENCE_ROWS,
    log: input.log || [],
  };
}

export const SLIPWAY_WALK = Object.freeze([
  {
    t: "idle",
    event: "slipway-yard",
    moored: true,
    slipped: false,
    cue: "moored",
    note: "idle HOLD: turn survives iface swap via retry",
  },
  {
    t: "iface-swap",
    event: "iface-swap",
    slipped: true,
    ifaceSwap: true,
    nicHandoff: true,
    ethernetDrop: true,
    cue: "slipped",
    note: "Ethernet dock drops; Wi-Fi up in ~2s; stream treated as terminal",
  },
  {
    t: "path",
    event: "iface-swap",
    slipped: true,
    ifaceSwap: true,
    nicHandoff: true,
    midStreamCut: true,
    noRetry: true,
    bgIdle: true,
    ethernetDrop: true,
    wifiReseize: true,
    connectionLost: true,
    turnAbandoned: true,
    cue: "slipped",
    note: "iface-swap — no Retrying (n/10); bg session silently idle",
  },
  {
    t: "score",
    event: "slipped",
    slipped: true,
    ifaceSwap: true,
    nicHandoff: true,
    midStreamCut: true,
    noRetry: true,
    bgIdle: true,
    ethernetDrop: true,
    wifiReseize: true,
    connectionLost: true,
    turnAbandoned: true,
    cue: "slipped",
    note: "slipped — the hull slid off the rails; turn abandoned; bg idle",
  },
]);

export const POSITIVE_CONTROL_WALK = Object.freeze([
  {
    t: "hold",
    event: "slipway-yard",
    moored: true,
    slipped: false,
    cue: "moored",
    note: "positive control: turn survives iface swap via retry",
  },
  {
    t: "admit",
    event: "slipway-yard",
    moored: true,
    cue: "moored",
    note: "positive control: the cradle admits moored",
  },
]);

function classifyFromSeed(seed) {
  if (seed && VERDICTS.includes(seed)) return seed;
  return null;
}

export function emptyTicket() {
  return {
    seed: IDLE_WORD,
    moored: true,
    slipped: false,
    ifaceSwap: false,
    cue: "moored",
  };
}

export function seedMoored() {
  return { ...emptyTicket() };
}

export function seedSlipped() {
  return {
    seed: SEEDED_WORD,
    moored: false,
    slipped: true,
    ifaceSwap: true,
    nicHandoff: true,
    midStreamCut: true,
    noRetry: true,
    bgIdle: true,
    ethernetDrop: true,
    wifiReseize: true,
    connectionLost: true,
    turnAbandoned: true,
    cue: "slipped",
    issue: FEATURED_ISSUE,
    proof: SAMPLE_SLIPPED_PROOF,
  };
}

export function seedProduct() {
  return {
    seed: "slipped",
    preferSeed: true,
    slipped: true,
    ifaceSwap: true,
    cue: "slipped",
  };
}

export function seedIfaceSwap() {
  return {
    seed: PATH_WORD,
    preferSeed: true,
    slipped: true,
    ifaceSwap: true,
    event: "iface-swap",
    cue: "slipped",
  };
}

export function seedLashed() {
  return { seed: "lashed", preferSeed: true, moored: true, cue: "moored" };
}

export function seedWarped() {
  return { seed: "warped", preferSeed: true, moored: true, cue: "moored" };
}

export function seedFendered() {
  return { seed: "fendered", preferSeed: true, moored: true, cue: "moored" };
}

export function seedNicHandoff() {
  return {
    seed: "nic-handoff",
    preferSeed: true,
    nicHandoff: true,
    cue: "slipped",
  };
}

export function seedMidStreamCut() {
  return {
    seed: "mid-stream-cut",
    preferSeed: true,
    midStreamCut: true,
    cue: "slipped",
  };
}

export function seedNoRetry() {
  return {
    seed: "no-retry",
    preferSeed: true,
    noRetry: true,
    cue: "slipped",
  };
}

export function normalizeBooth(raw) {
  if (!raw || typeof raw !== "object") {
    return {
      moored: false,
      slipped: false,
      ifaceSwap: false,
      nicHandoff: false,
      midStreamCut: false,
      noRetry: false,
      bgIdle: false,
      ethernetDrop: false,
      wifiReseize: false,
      connectionLost: false,
      turnAbandoned: false,
      cue: null,
      event: null,
      t: null,
    };
  }
  return {
    moored: raw.moored === true,
    slipped: raw.slipped === true || raw.event === "slipped",
    ifaceSwap: raw.ifaceSwap === true || raw.event === "iface-swap",
    nicHandoff: raw.nicHandoff === true || raw.event === "nic-handoff",
    midStreamCut: raw.midStreamCut === true || raw.event === "mid-stream-cut",
    noRetry: raw.noRetry === true || raw.event === "no-retry",
    bgIdle: raw.bgIdle === true || raw.event === "bg-idle",
    ethernetDrop: raw.ethernetDrop === true || raw.event === "ethernet-drop",
    wifiReseize: raw.wifiReseize === true || raw.event === "wifi-reseize",
    connectionLost: raw.connectionLost === true || raw.event === "connection-lost",
    turnAbandoned: raw.turnAbandoned === true || raw.event === "turn-abandoned",
    cue: raw.cue || null,
    event: raw.event || raw.kind || null,
    t: raw.t || raw.time || null,
    proof: raw.proof,
    log: raw.log,
  };
}

function hasBoothFields(ticket) {
  return Boolean(
    ticket &&
      (ticket.moored != null ||
        ticket.slipped != null ||
        ticket.ifaceSwap != null ||
        ticket.nicHandoff != null ||
        ticket.midStreamCut != null ||
        ticket.noRetry != null ||
        ticket.bgIdle != null ||
        ticket.ethernetDrop != null ||
        ticket.wifiReseize != null ||
        ticket.connectionLost != null ||
        ticket.turnAbandoned != null ||
        ticket.cue != null ||
        ticket.event ||
        ticket.proof),
  );
}

function isMoored(row) {
  if (row.slipped && row.cue !== "moored") return false;
  if (row.cue === "slipped" || row.cue === "iface-swap") return false;
  if (
    row.ifaceSwap &&
    row.ethernetDrop &&
    row.cue !== "moored" &&
    row.moored !== true
  ) {
    return false;
  }
  if (
    row.moored === true &&
    row.slipped !== true &&
    row.cue !== "slipped"
  ) {
    return true;
  }
  if (
    row.cue === "moored" &&
    row.slipped !== true &&
    row.ifaceSwap !== true &&
    FORCE_FLAGS.every((flag) => row[flag] !== true)
  ) {
    return true;
  }
  return false;
}

function isIfaceSwap(row) {
  return (
    row.event === "iface-swap" &&
    !isMoored(row) &&
    (row.ifaceSwap === true ||
      row.ethernetDrop === true ||
      row.slipped === true)
  );
}

function isSlippedRow(row) {
  if (isMoored(row)) return false;
  if (isIfaceSwap(row) && row.cue !== "slipped") return false;
  if (row.cue === "slipped") return true;
  if (row.slipped === true) return true;
  if (row.ifaceSwap === true && row.ethernetDrop === true) return true;
  if (
    row.ifaceSwap === true ||
    row.nicHandoff === true ||
    row.midStreamCut === true ||
    row.noRetry === true ||
    row.bgIdle === true ||
    row.ethernetDrop === true ||
    row.wifiReseize === true ||
    row.connectionLost === true ||
    row.turnAbandoned === true
  ) {
    return true;
  }
  return false;
}

/**
 * Score one slipway pass against the cradle.
 * moored: turn survives iface swap via retry.
 * slipped: undock ends turn; no retry; bg idle.
 * iface-swap: names that path.
 */
export function scoreGate(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const row = normalizeBooth(ticket);
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);

  let verdict = IDLE_WORD;
  if (
    isIfaceSwap(row) ||
    (row.ifaceSwap && ticket.preferSeed && seeded === PATH_WORD)
  ) {
    verdict = "iface-swap";
  } else if (isSlippedRow(row)) {
    verdict = "slipped";
  } else if (isMoored(row)) {
    verdict = "moored";
  } else if (
    row.ifaceSwap ||
    row.nicHandoff ||
    row.midStreamCut ||
    row.noRetry ||
    row.bgIdle ||
    row.ethernetDrop ||
    row.wifiReseize ||
    row.connectionLost ||
    row.turnAbandoned
  ) {
    verdict = "slipped";
  } else if (mentionsIssueCue(ticket) && !seeded) {
    verdict = "slipped";
  }

  if (seeded && (!hasBoothFields(ticket) || ticket.preferSeed === true)) {
    verdict = seeded;
  }

  const hold = HOLD.includes(verdict);
  return {
    verdict,
    idleWord: IDLE_WORD,
    pathWord: PATH_WORD,
    seededWord: SEEDED_WORD,
    productWord: PRODUCT_WORD,
    hold,
    alarm: !hold,
    recover: RECOVER.includes(verdict),
    moored: verdict === "moored",
    slipped: verdict === "slipped" || verdict === SEEDED_WORD,
    ifaceSwap:
      row.ifaceSwap === true ||
      verdict === "iface-swap" ||
      verdict === PATH_WORD,
    nicHandoff: row.nicHandoff,
    midStreamCut: row.midStreamCut,
    noRetry: row.noRetry,
    bgIdle: row.bgIdle,
    ethernetDrop: row.ethernetDrop,
    wifiReseize: row.wifiReseize,
    connectionLost: row.connectionLost,
    turnAbandoned: row.turnAbandoned,
    cue: hold
      ? "moored"
      : row.ifaceSwap || verdict === "iface-swap"
        ? "iface-swap"
        : "slipped",
    event: row.event,
    t: row.t,
    phrase: hold ? "admit moored" : "score slipway",
    handoffInspect: inspectNicHandoffMark(row),
    cutInspect: inspectMidStreamMark(row),
    retryInspect: inspectNoRetryMark(row),
    bgInspect: inspectBgOnly(row),
    dockInspect: inspectEthernetDrop(row),
  };
}

export function scoreWalk(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const rows = Array.isArray(ticket.rows)
    ? ticket.rows
    : Array.isArray(ticket.walk) &&
        ticket.walk.length &&
        typeof ticket.walk[0] === "object"
      ? ticket.walk
      : SLIPWAY_WALK;
  const scored = rows.map((row) => ({
    ...normalizeBooth(row),
    ...scoreGate({ ...row, preferSeed: false }),
  }));
  const charged = scored.filter((row) => row.verdict === "slipped");
  const path = scored.filter((row) => row.verdict === "iface-swap");
  const moored = scored.filter((row) => row.verdict === "moored");
  const headline =
    scored.find((row) => row.event === "slipped") ||
    scored.find((row) => row.event === "iface-swap") ||
    scored.find((row) => row.event === "mid-stream-cut") ||
    charged[charged.length - 1];
  let verdict = "moored";
  if (charged.length) verdict = "slipped";
  else if (path.length && !moored.length) {
    verdict = "iface-swap";
  }
  if (ticket.seed === "fixtures" || ticket.verdict === "fixtures") {
    verdict = "fixtures";
  }
  if (ticket.seed === "walk" || ticket.verdict === "walk") {
    verdict = "walk";
  }
  return {
    verdict,
    idleWord: IDLE_WORD,
    pathWord: PATH_WORD,
    seededWord: SEEDED_WORD,
    hold: HOLD.includes(verdict),
    alarm: !HOLD.includes(verdict),
    slippedCount: charged.length,
    pathCount: path.length,
    mooredCount: moored.length,
    headline,
    rows: scored,
    phrase: HOLD.includes(verdict) ? "admit moored" : "score slipway",
    note: headline
      ? "Windows undock (Ethernet→Wi-Fi interface swap) ends the in-flight turn with no retry, silently killing background sessions. Cite-only cousins #87987 #89552."
      : "published slipway walk scored against moored vs slipped",
  };
}

export function classify(input) {
  if (input == null || input === "") return IDLE_WORD;
  const ticket = typeof input === "string" ? safeParse(input) : input;
  if (!ticket || (typeof ticket === "object" && !Object.keys(ticket).length)) {
    return IDLE_WORD;
  }
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);
  if (seeded && ticket.preferSeed === true) return seeded;
  if (
    seeded &&
    seeded !== "moored" &&
    seeded !== "slipped" &&
    seeded !== "iface-swap" &&
    ticket.moored == null &&
    ticket.slipped == null &&
    ticket.ifaceSwap == null &&
    !ticket.rows &&
    !ticket.walk
  ) {
    return seeded;
  }
  if (
    Array.isArray(ticket.rows) ||
    (Array.isArray(ticket.walk) &&
      ticket.walk.length &&
      typeof ticket.walk[0] === "object")
  ) {
    return scoreWalk(ticket).verdict;
  }
  return scoreGate(ticket).verdict;
}

export function decide(input) {
  return classify(input);
}

export function analyze(input) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);
  const multi =
    Array.isArray(ticket.rows) ||
    (Array.isArray(ticket.walk) &&
      ticket.walk.length &&
      typeof ticket.walk[0] === "object");
  const scored = multi ? scoreWalk(ticket) : scoreGate(ticket);
  const verdict =
    seeded && ticket.preferSeed === true
      ? seeded
      : seeded && !hasBoothFields(ticket) && !multi
        ? seeded
        : scored.verdict;
  const hold = HOLD.includes(verdict);
  return {
    ...scored,
    verdict,
    hold,
    alarm: !hold,
    chips: [verdict],
    issue: FEATURED_ISSUE,
    title: TITLE,
    state: STATE,
    labels: [...LABELS],
    cousins: COUSINS.map((row) => row.issue),
    backups: BACKUPS.map((row) => row.issue),
    moored: scored.moored ?? false,
    slipped: scored.slipped ?? false,
    ifaceSwap: scored.ifaceSwap ?? false,
    nicHandoff: scored.nicHandoff ?? false,
    midStreamCut: scored.midStreamCut ?? false,
    noRetry: scored.noRetry ?? false,
    bgIdle: scored.bgIdle ?? false,
    ethernetDrop: scored.ethernetDrop ?? false,
    wifiReseize: scored.wifiReseize ?? false,
    connectionLost: scored.connectionLost ?? false,
    turnAbandoned: scored.turnAbandoned ?? false,
  };
}

export function diagnose(input) {
  return analyze(input);
}

export function score(input) {
  const verdict = analyze(input).verdict;
  if (verdict === PATH_WORD || verdict === SEEDED_WORD) return PRODUCT_WORD;
  return verdict;
}

export function fingerprint(input) {
  const result = analyze(input);
  return [
    result.verdict,
    result.ifaceSwap || result.slipped
      ? "kind=iface-swap"
      : "kind=keel-cradle",
    result.nicHandoff || result.slipped
      ? "ref=nic-handoff"
      : "ref=slipway-yard",
    result.ifaceSwap || result.verdict === "iface-swap"
      ? "path=iface-swap"
      : "path=moored",
    result.cue === "moored"
      ? "cue=moored"
      : result.cue === "iface-swap"
        ? "cue=iface-swap"
        : "cue=slipped",
  ].join("|");
}

export function handle(input) {
  const result = analyze(input);
  const booth = readBooth({
    moored: result.moored,
    slipped: result.slipped,
    ifaceSwap: result.ifaceSwap,
    nicHandoff: result.nicHandoff,
    midStreamCut: result.midStreamCut,
    noRetry: result.noRetry,
    bgIdle: result.bgIdle,
    ethernetDrop: result.ethernetDrop,
    wifiReseize: result.wifiReseize,
    connectionLost: result.connectionLost,
    turnAbandoned: result.turnAbandoned,
    proof: input && input.proof,
    log: input && input.log,
  });
  return {
    ...result,
    fingerprint: fingerprint(input),
    booth,
    handoff: inspectNicHandoffMark({
      moored: result.moored,
      slipped: result.slipped,
      nicHandoff: result.nicHandoff,
    }),
    cut: inspectMidStreamMark({
      moored: result.moored,
      slipped: result.slipped,
      midStreamCut: result.midStreamCut,
    }),
    retry: inspectNoRetryMark({
      moored: result.moored,
      slipped: result.slipped,
      noRetry: result.noRetry,
    }),
    bg: inspectBgOnly({
      moored: result.moored,
      slipped: result.slipped,
      bgIdle: result.bgIdle,
    }),
    dock: inspectEthernetDrop({
      moored: result.moored,
      slipped: result.slipped,
      ethernetDrop: result.ethernetDrop,
    }),
    post: mapSlipway({
      moored: result.moored,
      slipped: result.slipped,
      ifaceSwap: result.ifaceSwap,
      ethernetDrop: result.ethernetDrop,
    }),
    stations: BOOTH_STATIONS.map((row) => ({
      ...row,
      slipped: result.slipped === true || result.verdict === "slipped",
    })),
    leakPath: scoreIfaceSwap({
      moored: result.moored === true && !result.slipped,
      slipped: result.slipped,
      ifaceSwap: result.ifaceSwap,
      nicHandoff: result.nicHandoff,
      ethernetDrop: result.ethernetDrop,
      midStreamCut: result.midStreamCut,
    }),
    published: {
      issue: FEATURED_ISSUE,
      url: ISSUE_URL,
      title: TITLE,
      state: STATE,
      labels: [...LABELS],
      platform: PLATFORM,
      surface: SURFACE,
      host: HOST,
      checkedOn: CHECKED_ON,
      build: BUILD,
      selectedModel: SELECTED_MODEL,
      os: OS,
      marks: FIELD_MARKS,
      names: LEDGER_NAMES,
      ruledOut: [...RULED_OUT],
      expected: [...EXPECTED],
      suggestedFix: [...SUGGESTED_FIX],
      distribution: DISTRIBUTION,
      stations: BOOTH_STATIONS,
      fingerprintLines: [...FINGERPRINT_LINES],
      cousins: COUSINS.map((row) => row.issue),
      backups: BACKUPS.map((row) => row.issue),
      phrase: PHRASE,
      evidence: EVIDENCE_ROWS,
      hypothesis:
        "NON-BINDING (issue text): a mid-stream socket loss should be retried like any other transient network error — re-resolve, open a fresh TCP connection on the current default route, and resume the turn. At minimum a background session whose turn was terminated by a network error should not silently go idle. Invite verify against #94458 text only. Do not claim a root cause in Claude Code source you have not seen.",
    },
  };
}

function safeParse(text) {
  const trimmed = String(text || "").trim();
  if (!trimmed) return emptyTicket();
  try {
    return JSON.parse(trimmed);
  } catch {
    const lower = trimmed.toLowerCase();
    if (VERDICTS.includes(lower)) return { seed: lower, preferSeed: true };
    return emptyTicket();
  }
}

export async function main(argv) {
  const [{ readFileSync }, { stdin }] = await Promise.all([
    import("node:fs"),
    import("node:process"),
  ]);
  const args = argv || (typeof process !== "undefined" ? process.argv.slice(2) : []);
  let ticket;
  if (args[0] && args[0] !== "-") {
    ticket = JSON.parse(readFileSync(args[0], "utf8"));
  } else if (stdin && !stdin.isTTY) {
    const chunks = [];
    for await (const chunk of stdin) chunks.push(chunk);
    const raw = chunks.join("");
    ticket = raw.trim() ? safeParse(raw) : emptyTicket();
  } else {
    ticket = emptyTicket();
  }
  const result = handle(ticket);
  console.log(JSON.stringify(result, null, 2));
  return result;
}

const runningInNode = typeof process !== "undefined" && !!process.versions?.node;

if (runningInNode) {
  import("node:url")
    .then(({ pathToFileURL }) => {
      const invoked = process.argv[1]
        ? import.meta.url === pathToFileURL(process.argv[1]).href
        : false;
      if (invoked) {
        return main();
      }
      return null;
    })
    .catch((error) => {
      console.error(error);
      if (typeof process !== "undefined") process.exitCode = 1;
    });
}
