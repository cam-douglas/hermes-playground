#!/usr/bin/env node
/**
 * Revenant — Victorian séance parlor / process-tomb graveyard booth.
 *
 * Educational diagnostic model for a published Claude Code defect:
 * peer-session liveness should stay reaped (FFI OpenProcess or O(1)
 * lookup; probes finish under budget; no wedged powershell; commit
 * stable). Instead Windows falls back to Get-CimInstance Win32_Process
 * with a 1s timeout, kills mid-RPC, and leaves unkillable ~43MB
 * powershell revenants until reboot / commit exhaustion.
 *
 *   node revenant.mjs data/revenant.json
 *   echo '{"seed":"revenant"}' | node revenant.mjs
 *
 * Idle word is reaped (HOLD: FFI or O(1); no wedged children).
 * Seeded word is revenant (#93274: timeout-killed WMI powershell wedges).
 * Path word is wedged (HasExited=True; commit remains until reboot).
 *
 * Encoded from anthropics/claude-code#93274 issue body only.
 * Hypothesis (NON-BINDING): the WMI fallback enumerates every process
 * so the 1s timeout structurally kills powershell mid-RPC, leaving
 * wedged commit that only a reboot clears. Verify against #93274 text
 * only. Do NOT claim a root cause in Claude Code source you have not
 * seen. Do NOT implement a fix in anthropics/claude-code.
 * No network. No exploits. No live Claude. No payloads. No secrets.
 */

/* Browser-safe: no top-level node: imports. CLI I/O is loaded only in main(). */

export const VERDICTS = Object.freeze([
  "reaped",
  "revenant",
  "wedged",
  "hold",
  "ffi-dead",
  "wmi-fallback",
  "enum-all",
  "timeout-kill",
  "mid-rpc",
  "orphan-commit",
  "self-accel",
  "stale-key",
  "reboot-only",
  "commit-crash",
  "has-repro",
  "cousins",
  "backups",
  "fixtures",
  "chips",
  "fingerprints",
  "walk",
]);

export const IDLE_WORD = "reaped";
export const PATH_WORD = "wedged";
export const SEEDED_WORD = "revenant";
export const HOLD = Object.freeze(["reaped", "hold"]);
export const RECOVER = Object.freeze(["reaped", "hold"]);
export const ALARM = Object.freeze(
  VERDICTS.filter((name) => !HOLD.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FORBIDDEN_IDLE = Object.freeze([
  "restored",
  "replevin",
  "defaulted",
  "expanded",
  "cognate",
  "literal",
  "laid",
  "lemures",
  "remanent",
  "released",
  "escheat",
  "stale",
  "freehold",
  "mortmain",
  "phantom",
  "trunked",
  "strowger",
  "exchanged",
  "tokenized",
  "mondegreen",
  "parsed",
  "locked",
  "scratched",
  "derby",
  "unmasked",
  "vizard",
  "precedence",
  "carrier",
  "moored",
  "scuttled",
  "open",
  "seated",
  "stopcock",
  "preserved",
  "discarded",
  "cleared",
  "mounded",
  "distinct",
  "held",
  "raised",
  "fallen",
  "primed",
  "flashed",
  "greenroomed",
  "scaffold",
  "stereotype",
  "parergon",
  "lacuna",
  "hangfire",
  "afterimage",
  "remora",
  "quieted",
  "unrung",
  "latent",
  "flushed",
  "collated",
  "stereotyped",
  "deadair",
  "squelch",
  "scuttle",
  "fresh",
  "stamped",
  "conflated",
  "steered",
  "vernier",
  "slider",
  "sterling",
  "lodged",
  "bypassed",
  "diplopic",
  "freewheeling",
  "doubled",
  "cutaway",
  "rubbed",
  "flashpanned",
  "unshorn",
  "sheared",
  "secateured",
  "emended",
  "unretracted",
  "palinoded",
  "ephemeral",
  "voided",
  "fouled",
  "cold",
  "banked",
  "ferruled",
  "interlocked",
  "passable",
  "admitted",
  "deeded",
  "parked",
  "rebound",
  "detached",
  "shibbolethed",
  "countersigned",
  "homesteaded",
  "staked",
  "epitaphed",
  "inscribed",
  "confirmed",
  "miraged",
  "loosed",
  "clung",
  "enrolled",
  "escheated",
  "debased",
  "culled",
  "quietus",
  "palimpsest",
  "recension",
  "ephemera",
  "mirage",
  "calque",
  "sigil",
  "caret",
]);
export const FORBIDDEN_SEED = Object.freeze(
  FORBIDDEN_IDLE.filter((name) => name !== "revenant"),
);

export const FEATURED_ISSUE = 93274;
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/93274";
export const TITLE =
  "Windows: peer-session liveness probe (powershell + Get-CimInstance Win32_Process, 1 s timeout) leaves unkillable orphan processes -> commit exhaustion -> crash 0xC0000409";
export const STATE = "OPEN";
export const LABELS = Object.freeze([
  "bug",
  "has repro",
  "platform:windows",
  "area:core",
]);
export const AUTHOR = "goldencircle1109";
export const FILED = "2026-09-10T06:13:55Z";
export const CLAUDE_VERSION = "2.1.263/266/267";
export const OS = "Windows 11 Pro 10.0.26200";
export const SESSION_KEY =
  "%USERPROFILE%\\.claude\\sessions\\<PID>.<hash>.key";
export const FFI_PATH = "bun:ffi OpenProcess/GetProcessTimes";
export const FALLBACK_CMD =
  'powershell.exe -NoProfile -Command "(Get-CimInstance Win32_Process -Filter \\"ProcessId=${e}\\").CreationDate.Ticks"';
export const TIMEOUT_MS = 1000;
export const ENUM_COST_MS = 1.45;
export const COMMIT_MB = 43;
export const CRASH_CODE = "0xC0000409";
export const RETRIES = "3–4";
export const PHRASE =
  "when a Windows WMI peer-liveness fallback is timeout-killed mid-RPC and leaves unkillable powershell orphans, score revenant or admit reaped.";

export const PARLOR_STATIONS = Object.freeze([
  {
    id: "peers",
    rite: "reap the peers",
    kind: "reap",
    note: "peer liveness should use FFI/OpenProcess or O(1) lookup; probes finish under budget; no wedged powershell",
  },
  {
    id: "tomb",
    rite: "sound the tomb",
    kind: "sound",
    note: "WMI Get-CimInstance Win32_Process with a 1s timeout must not kill mid-RPC and leave ~43MB commit revenants",
  },
  {
    id: "graves",
    rite: "tally the graves",
    kind: "tally",
    note: "orphans raise process count; every session probes every peer 3–4 times; commit climbs to 0xC0000409",
  },
]);

export const FINGERPRINT_LINES = Object.freeze([
  "bun:ffi unavailable",
  "OpenProcess",
  "GetProcessTimes",
  "Get-CimInstance Win32_Process",
  "CreationDate.Ticks",
  "timeout: 1000",
  "HasExited",
  "43MB",
  "0xC0000409",
  "sessions",
]);

export const COUSINS = Object.freeze([
  {
    issue: 84675,
    title:
      "same spawn Get-CimInstance Win32_Process CreationDate.Ticks — visible console window",
    state: "OPEN",
    citeOnly: true,
    why: "Cite-only cousin — same spawn, cosmetic console window; different symptom; do not rebuild",
  },
  {
    issue: 86551,
    title: "statusline pwsh.exe orphans under multi-session use on Windows",
    state: "OPEN",
    citeOnly: true,
    why: "Cite-only cousin — different spawn site (statusline); do not rebuild",
  },
]);

export const BACKUPS = Object.freeze([
  {
    issue: 93279,
    title: "HTTP MCP connectivity pre-check ~25s stall",
    state: "OPEN",
    citeOnly: true,
    why: "HTTP MCP connectivity pre-check ~25s stall — backup, not primary; cite in data only",
  },
  {
    issue: 93265,
    title: "ShipIt double-encodes non-ASCII env",
    state: "OPEN",
    citeOnly: true,
    why: "ShipIt double-encodes non-ASCII env — backup, not primary; cite in data only",
  },
  {
    issue: 93270,
    title: "Workflow kill leaks agent runs blocking archive_session",
    state: "OPEN",
    citeOnly: true,
    why: "Workflow kill leaks agent runs blocking archive_session — backup, not primary; cite in data only",
  },
  {
    issue: 93269,
    title: "archive_session live-work message names four causes",
    state: "OPEN",
    citeOnly: true,
    why: "archive_session live-work message names four causes — backup, not primary; cite in data only",
  },
  {
    issue: 93257,
    title: "agents auto-update relaunch drops flags",
    state: "OPEN",
    citeOnly: true,
    why: "agents auto-update relaunch drops flags — backup, not primary; cite in data only",
  },
  {
    issue: 93259,
    title: "archive_session pin refusal",
    state: "OPEN",
    citeOnly: true,
    why: "archive_session pin refusal — backup, not primary; cite in data only",
  },
  {
    issue: 93239,
    title: "Enter interrupts instead of queueing",
    state: "OPEN",
    citeOnly: true,
    why: "Enter interrupts instead of queueing — backup, not primary; cite in data only",
  },
  {
    issue: 93219,
    title: "Vernier — effort slider inert",
    state: "OPEN",
    product: "Vernier",
    citeOnly: true,
    why: "Vernier — effort slider inert — millimeter-slider leftover, forbidden as primary; cite in data only",
  },
]);

export const NOT_PRODUCTS = Object.freeze([
  "replevin",
  "cognate",
  "lemures",
  "escheat",
  "mortmain",
  "strowger",
  "mondegreen",
  "seizing",
  "flashpan",
  "derby",
  "vizard",
  "deadair",
  "scuttle",
  "stopcock",
  "parergon",
  "stereotype",
  "midden",
  "afterimage",
  "mirage",
  "ephemera",
  "palimpsest",
  "recension",
  "quietus",
  "calque",
  "sigil",
  "caret",
  "vernier",
]);

/**
 * Conceptual peer reap — FFI or O(1) lookup keeps probes under budget
 * instead of spawning a WMI powershell that can wedge.
 */
export function reapPeers(input = {}) {
  const reaped =
    input.reaped === true ||
    (input.ffiAvailable === true && input.timeoutKill !== true);
  return {
    path: reaped ? "ffi-or-o1" : "wmi-spawn",
    rite: reaped ? "reaped" : "revenant",
    ffiAvailable: reaped,
  };
}

/**
 * Conceptual tomb sounding — mark a timeout-killed WMI child so the
 * parlor does not pretend the probe tore down.
 */
export function soundTomb(input = {}) {
  const risen =
    input.timeoutKill === true ||
    input.midRpc === true ||
    (input.wmiFallback === true && input.orphanCommit === true);
  return {
    sounded: risen,
    stamp: risen ? "revenant" : "reaped",
    commitMb: risen ? COMMIT_MB : 0,
    rebootOnly: risen && input.rebootOnly !== false,
  };
}

/**
 * Tally orphan graves / rust commit against the published walk.
 */
export function tallyGraves(input = {}) {
  const risen =
    input.timeoutKill === true ||
    input.orphanCommit === true ||
    input.cue === "revenant";
  return {
    orphans: risen ? 1 : 0,
    commitMb: risen ? COMMIT_MB : 0,
    crash: risen && input.selfAccel === true ? CRASH_CODE : null,
    selfAccel: risen && input.selfAccel !== false,
  };
}

export function readParlor(input = {}) {
  const peers = reapPeers(input);
  const tomb = soundTomb(input);
  const graves = tallyGraves(input);
  const risen = tomb.stamp === "revenant";
  return {
    peers,
    tomb,
    graves,
    stations: PARLOR_STATIONS,
    risen,
    cue: risen ? "revenant" : "reaped",
  };
}

/**
 * Published revenant walk from #93274 only. Facts from the issue body.
 * A reaped parlor uses FFI or O(1). A revenant parlor timeout-kills
 * WMI powershell mid-RPC and leaves wedged commit until reboot.
 */
export const REVENANT_WALK = Object.freeze([
  {
    t: "idle",
    event: "cue-reaped",
    reaped: true,
    ffiAvailable: true,
    wmiFallback: false,
    enumAll: false,
    timeoutKill: false,
    midRpc: false,
    orphanCommit: false,
    selfAccel: false,
    staleKey: false,
    rebootOnly: false,
    cue: "reaped",
    note: "idle HOLD: peer liveness uses FFI/OpenProcess or O(1) lookup; probes finish under budget; no wedged powershell",
  },
  {
    t: "ffi",
    event: "ffi-dead",
    ffiAvailable: false,
    cue: "revenant",
    note: "bun:ffi OpenProcess/GetProcessTimes unavailable; every check falls back to spawn",
  },
  {
    t: "wmi",
    event: "wmi-fallback",
    ffiAvailable: false,
    wmiFallback: true,
    cue: "revenant",
    note: "powershell.exe -NoProfile Get-CimInstance Win32_Process -Filter ProcessId=N · CreationDate.Ticks",
  },
  {
    t: "enum",
    event: "enum-all",
    wmiFallback: true,
    enumAll: true,
    cue: "revenant",
    note: "cimwin32 enumerates every process then filters (~1.45ms/proc)",
  },
  {
    t: "budget",
    event: "timeout-kill",
    timeoutKill: true,
    timeoutMs: 1000,
    wmiFallback: true,
    enumAll: true,
    cue: "revenant",
    note: "500–1200 processes take 0.8–2.0s and structurally exceed the 1s Node timeout",
  },
  {
    t: "rpc",
    event: "mid-rpc",
    midRpc: true,
    timeoutKill: true,
    cue: "revenant",
    note: "Node kills powershell mid WMI/DCOM RPC; process never finishes tearing down",
  },
  {
    t: "orphan",
    event: "orphan-commit",
    orphanCommit: true,
    commitMb: 43,
    midRpc: true,
    timeoutKill: true,
    cue: "revenant",
    note: "HasExited=True; ~43MB commit + one thread Wait/Executive remain",
  },
  {
    t: "spiral",
    event: "self-accel",
    selfAccel: true,
    orphanCommit: true,
    cue: "revenant",
    note: "zombies raise process count → slower probes → more timeouts → more revenants",
  },
  {
    t: "cut",
    event: "revenant",
    reaped: false,
    ffiAvailable: false,
    wmiFallback: true,
    enumAll: true,
    timeoutKill: true,
    midRpc: true,
    orphanCommit: true,
    selfAccel: true,
    staleKey: true,
    rebootOnly: true,
    cue: "revenant",
    note: "timeout-killed WMI powershell wedges; score revenant",
  },
  {
    t: "path",
    event: "wedged",
    wedged: true,
    cue: "revenant",
    note: "wedged — HasExited=True yet commit remains until reboot",
  },
]);

function classifyFromSeed(seed) {
  if (seed && VERDICTS.includes(seed)) return seed;
  return null;
}

export function emptyTicket() {
  return {
    seed: IDLE_WORD,
    reaped: true,
    ffiAvailable: true,
    wmiFallback: false,
    enumAll: false,
    timeoutKill: false,
    midRpc: false,
    orphanCommit: false,
    selfAccel: false,
    staleKey: false,
    rebootOnly: false,
    cue: "reaped",
  };
}

export function seedReaped() {
  return { ...emptyTicket() };
}

export function seedRevenant() {
  return {
    seed: SEEDED_WORD,
    reaped: false,
    ffiAvailable: false,
    wmiFallback: true,
    enumAll: true,
    timeoutKill: true,
    midRpc: true,
    orphanCommit: true,
    selfAccel: true,
    staleKey: true,
    rebootOnly: true,
    cue: "revenant",
    issue: FEATURED_ISSUE,
  };
}

export function seedWedged() {
  return {
    seed: PATH_WORD,
    preferSeed: true,
    wedged: true,
    cue: "revenant",
  };
}

export function seedHold() {
  return {
    seed: "hold",
    preferSeed: true,
    reaped: true,
    cue: "reaped",
  };
}

export function seedFfiDead() {
  return {
    seed: "ffi-dead",
    preferSeed: true,
    ffiAvailable: false,
    cue: "revenant",
  };
}

export function seedWmiFallback() {
  return {
    seed: "wmi-fallback",
    preferSeed: true,
    wmiFallback: true,
    cue: "revenant",
  };
}

export function seedEnumAll() {
  return {
    seed: "enum-all",
    preferSeed: true,
    enumAll: true,
    wmiFallback: true,
    cue: "revenant",
  };
}

export function seedTimeoutKill() {
  return {
    seed: "timeout-kill",
    preferSeed: true,
    timeoutKill: true,
    cue: "revenant",
  };
}

export function seedMidRpc() {
  return {
    seed: "mid-rpc",
    preferSeed: true,
    midRpc: true,
    timeoutKill: true,
    cue: "revenant",
  };
}

export function seedOrphanCommit() {
  return {
    seed: "orphan-commit",
    preferSeed: true,
    orphanCommit: true,
    cue: "revenant",
  };
}

export function seedSelfAccel() {
  return {
    seed: "self-accel",
    preferSeed: true,
    selfAccel: true,
    orphanCommit: true,
    cue: "revenant",
  };
}

export function seedStaleKey() {
  return {
    seed: "stale-key",
    preferSeed: true,
    staleKey: true,
    cue: "revenant",
  };
}

export function seedRebootOnly() {
  return {
    seed: "reboot-only",
    preferSeed: true,
    rebootOnly: true,
    orphanCommit: true,
    cue: "revenant",
  };
}

export function seedCommitCrash() {
  return {
    seed: "commit-crash",
    preferSeed: true,
    selfAccel: true,
    orphanCommit: true,
    cue: "revenant",
  };
}

export function normalizeBooth(raw) {
  if (!raw || typeof raw !== "object") {
    return {
      reaped: false,
      ffiAvailable: false,
      wmiFallback: false,
      enumAll: false,
      timeoutKill: false,
      midRpc: false,
      orphanCommit: false,
      selfAccel: false,
      staleKey: false,
      rebootOnly: false,
      wedged: false,
      cue: null,
      event: null,
      t: null,
    };
  }
  return {
    reaped: raw.reaped === true,
    ffiAvailable: raw.ffiAvailable === true,
    wmiFallback: raw.wmiFallback === true,
    enumAll: raw.enumAll === true,
    timeoutKill: raw.timeoutKill === true,
    midRpc: raw.midRpc === true,
    orphanCommit: raw.orphanCommit === true,
    selfAccel: raw.selfAccel === true,
    staleKey: raw.staleKey === true,
    rebootOnly: raw.rebootOnly === true,
    wedged: raw.wedged === true,
    cue: raw.cue || null,
    event: raw.event || raw.kind || null,
    t: raw.t || raw.time || null,
  };
}

function hasBoothFields(ticket) {
  return Boolean(
    ticket &&
      (ticket.reaped != null ||
        ticket.ffiAvailable != null ||
        ticket.wmiFallback != null ||
        ticket.enumAll != null ||
        ticket.timeoutKill != null ||
        ticket.midRpc != null ||
        ticket.orphanCommit != null ||
        ticket.selfAccel != null ||
        ticket.staleKey != null ||
        ticket.rebootOnly != null ||
        ticket.wedged != null ||
        ticket.cue != null ||
        ticket.event),
  );
}

function isReaped(row) {
  if (row.wedged) return false;
  if (row.cue === "revenant") return false;
  if (row.timeoutKill && row.midRpc) return false;
  if (row.wmiFallback && row.orphanCommit) return false;
  if (
    row.reaped === true &&
    row.timeoutKill !== true &&
    row.cue !== "revenant"
  ) {
    return true;
  }
  if (
    row.cue === "reaped" &&
    row.timeoutKill !== true &&
    row.orphanCommit !== true
  ) {
    return true;
  }
  return false;
}

function isRevenant(row) {
  if (row.wedged && row.cue !== "reaped") return false;
  if (row.cue === "revenant") return true;
  if (row.wmiFallback && row.timeoutKill && row.orphanCommit) return true;
  if (row.midRpc && row.orphanCommit) return true;
  if (row.timeoutKill && row.enumAll && row.wmiFallback) return true;
  return false;
}

function isWedgedPath(row) {
  return row.wedged === true && !isReaped(row);
}

/**
 * Score one parlor pass against the revenant booth.
 * reaped: FFI or O(1); probes finish under budget; no wedged children.
 * revenant: timeout-killed WMI powershell wedges; ~43MB commit until reboot.
 * wedged: named path — HasExited=True; commit remains.
 */
export function scoreGate(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const row = normalizeBooth(ticket);
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);

  let verdict = IDLE_WORD;
  if (isWedgedPath(row)) {
    verdict = "wedged";
  } else if (isRevenant(row)) {
    verdict = "revenant";
  } else if (isReaped(row)) {
    verdict = "reaped";
  } else if (
    row.wmiFallback ||
    row.enumAll ||
    row.timeoutKill ||
    row.midRpc ||
    row.orphanCommit ||
    row.selfAccel ||
    row.staleKey ||
    row.rebootOnly
  ) {
    verdict = "revenant";
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
    hold,
    alarm: !hold,
    recover: RECOVER.includes(verdict),
    reaped: verdict === "reaped",
    revenant: verdict === "revenant" || verdict === SEEDED_WORD,
    wedged: verdict === "wedged" || verdict === PATH_WORD,
    ffiAvailable: row.ffiAvailable,
    wmiFallback: row.wmiFallback,
    enumAll: row.enumAll,
    timeoutKill: row.timeoutKill,
    midRpc: row.midRpc,
    orphanCommit: row.orphanCommit,
    selfAccel: row.selfAccel,
    staleKey: row.staleKey,
    rebootOnly: row.rebootOnly,
    cue: hold ? "reaped" : "revenant",
    event: row.event,
    t: row.t,
    phrase: hold ? "admit reaped" : "score revenant",
  };
}

export function scoreWalk(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const rows = Array.isArray(ticket.rows)
    ? ticket.rows
    : Array.isArray(ticket.walk)
      ? ticket.walk
      : REVENANT_WALK;
  const scored = rows.map((row) => ({
    ...normalizeBooth(row),
    ...scoreGate({ ...row, preferSeed: false }),
  }));
  const revenant = scored.filter((row) => row.verdict === "revenant");
  const wedged = scored.filter((row) => row.verdict === "wedged");
  const reaped = scored.filter((row) => row.verdict === "reaped");
  const headline =
    scored.find((row) => row.event === "revenant") ||
    scored.find((row) => row.event === "timeout-kill") ||
    scored.find((row) => row.event === "orphan-commit") ||
    scored.find((row) => row.event === "wedged") ||
    revenant[revenant.length - 1];
  let verdict = "reaped";
  if (revenant.length) verdict = "revenant";
  else if (wedged.length && !reaped.length) verdict = "wedged";
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
    revenantCount: revenant.length,
    wedgedCount: wedged.length,
    reapedCount: reaped.length,
    headline,
    rows: scored,
    phrase: HOLD.includes(verdict) ? "admit reaped" : "score revenant",
    note: headline
      ? "bun:ffi unavailable; WMI Get-CimInstance exceeds 1s; timeout-kill mid-RPC leaves ~43MB powershell revenants until reboot."
      : "published revenant walk scored against reaped vs revenant",
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
    seeded !== "reaped" &&
    seeded !== "revenant" &&
    seeded !== "wedged" &&
    ticket.reaped == null &&
    ticket.wmiFallback == null &&
    ticket.timeoutKill == null &&
    ticket.wedged == null &&
    !ticket.rows &&
    !ticket.walk
  ) {
    return seeded;
  }
  if (Array.isArray(ticket.rows) || Array.isArray(ticket.walk)) {
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
  const multi = Array.isArray(ticket.rows) || Array.isArray(ticket.walk);
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
    reaped: scored.reaped ?? false,
    ffiAvailable: scored.ffiAvailable ?? false,
    wmiFallback: scored.wmiFallback ?? false,
    enumAll: scored.enumAll ?? false,
    timeoutKill: scored.timeoutKill ?? false,
    midRpc: scored.midRpc ?? false,
    orphanCommit: scored.orphanCommit ?? false,
    selfAccel: scored.selfAccel ?? false,
    staleKey: scored.staleKey ?? false,
    rebootOnly: scored.rebootOnly ?? false,
  };
}

export function score(input) {
  return analyze(input).verdict;
}

export function fingerprint(input) {
  const result = analyze(input);
  return [
    result.verdict,
    result.ffiAvailable ? "ffi=yes" : "ffi=dead",
    result.wmiFallback ? "wmi=yes" : "wmi=no",
    result.timeoutKill ? "kill=yes" : "kill=no",
    result.orphanCommit ? "commit=43" : "commit=0",
    result.cue === "reaped" ? "cue=reaped" : "cue=revenant",
  ].join("|");
}

export function handle(input) {
  const result = analyze(input);
  const parlor = readParlor({
    reaped: result.reaped,
    ffiAvailable: result.ffiAvailable,
    wmiFallback: result.wmiFallback,
    timeoutKill: result.timeoutKill,
    midRpc: result.midRpc,
    orphanCommit: result.orphanCommit,
    rebootOnly: result.rebootOnly,
    selfAccel: result.selfAccel,
    cue: result.cue,
  });
  return {
    ...result,
    fingerprint: fingerprint(input),
    parlor,
    peers: reapPeers({
      reaped: result.reaped,
      ffiAvailable: result.ffiAvailable,
      timeoutKill: result.timeoutKill,
    }),
    tomb: soundTomb({
      timeoutKill: result.timeoutKill,
      midRpc: result.midRpc,
      wmiFallback: result.wmiFallback,
      orphanCommit: result.orphanCommit,
      rebootOnly: result.rebootOnly,
    }),
    graves: tallyGraves({
      timeoutKill: result.timeoutKill,
      orphanCommit: result.orphanCommit,
      selfAccel: result.selfAccel,
      cue: result.cue,
    }),
    stations: PARLOR_STATIONS.map((row) => ({
      ...row,
      risen: result.timeoutKill === true || result.verdict === "revenant",
    })),
    published: {
      issue: FEATURED_ISSUE,
      url: ISSUE_URL,
      title: TITLE,
      state: STATE,
      labels: [...LABELS],
      author: AUTHOR,
      filed: FILED,
      claudeVersion: CLAUDE_VERSION,
      os: OS,
      sessionKey: SESSION_KEY,
      ffiPath: FFI_PATH,
      fallbackCmd: FALLBACK_CMD,
      timeoutMs: TIMEOUT_MS,
      enumCostMs: ENUM_COST_MS,
      commitMb: COMMIT_MB,
      crashCode: CRASH_CODE,
      retries: RETRIES,
      stations: PARLOR_STATIONS,
      fingerprintLines: [...FINGERPRINT_LINES],
      cousins: COUSINS.map((row) => row.issue),
      backups: BACKUPS.map((row) => row.issue),
      phrase: PHRASE,
      expected: [
        "restore or harden bun:ffi OpenProcess/GetProcessTimes so peer probes stay O(1)",
        "if a spawn fallback remains, use a key-path or Get-Process -Id lookup — do not enumerate every process",
        "never hard-kill a WMI client mid-call; prune stale keys whose PID is not claude.exe",
      ],
      hypothesis:
        "NON-BINDING: the WMI fallback enumerates every process so the 1s timeout structurally kills powershell mid-RPC, leaving wedged commit that only a reboot clears",
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
    ticket = safeParse(Buffer.concat(chunks).toString("utf8"));
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
