#!/usr/bin/env node
/**
 * Scuttle — naval damage-control / shipyard booth.
 *
 * Educational diagnostic model for a published Claude Code remote-SSH
 * defect: on a transient SSH blip, remote-session warm-up should
 * REATTACH to a still-healthy remote daemon. Instead warm-up failure
 * (`channel_closed_no_socket` → `bridge_startup_timeout`) issues
 * `server.shutdown` via `RemoteServerController` / `server --stop`
 * WITHOUT probing whether the daemon is still alive, and the daemon
 * SIGKILLs every tracked child session (blast radius: 10 live
 * `ccd-cli` sessions / 42 process groups in the report).
 *
 *   node scuttle.mjs data/scuttled.json
 *   echo '{"seed":"scuttled"}' | node scuttle.mjs
 *
 * Idle word is moored (HOLD: the ship stays moored — remote-session
 * warm-up REATTACHES to a still-healthy remote daemon after a brief
 * SSH channel drop; ordinary reconnect already reuses a running
 * daemon; children stay alive).
 * Seeded word is scuttled (#93154: channel_closed_no_socket →
 * bridge_startup_timeout → server.shutdown / server --stop with no
 * liveness probe; daemon SIGKILLs tracked children; no SIGTERM
 * stage, no grace, no active-session guard).
 * Path word is scuttle (a brief network blip that SIGKILLs every
 * healthy remote session instead of reattaching is not a moored
 * ship — it is a scuttle).
 *
 * Encoded from anthropics/claude-code#93154 issue body only.
 * Hypothesis (NON-BINDING): warm-up failure branch may select
 * destructive server.shutdown instead of the existing
 * reattach/reuse path. Verify against #93154 text only.
 * Do NOT claim a root cause in Claude Code source you have not seen.
 * Do NOT implement a fix in anthropics/claude-code.
 * No network. No exploits. No live Claude. No payloads. No secrets.
 */

/* Browser-safe: no top-level node: imports. CLI I/O is loaded only in main(). */

export const VERDICTS = Object.freeze([
  "moored",
  "scuttled",
  "scuttle",
  "hold",
  "reattach",
  "server-shutdown",
  "bridge-startup-timeout",
  "channel-closed-no-socket",
  "sigkill-children",
  "warm-up-failure",
  "no-liveness-probe",
  "takeover-path-exists",
  "has-repro",
  "cousins",
  "fixtures",
  "chips",
  "fingerprints",
  "walk",
]);

export const IDLE_WORD = "moored";
export const PATH_WORD = "scuttle";
export const SEEDED_WORD = "scuttled";
export const HOLD = Object.freeze(["moored", "reattach", "hold"]);
export const RECOVER = Object.freeze(["moored", "reattach", "hold"]);
export const ALARM = Object.freeze(
  VERDICTS.filter((name) => !HOLD.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FORBIDDEN_IDLE = Object.freeze([
  "open",
  "seated",
  "stopcock",
  "preserved",
  "discarded",
  "fresh",
  "stamped",
  "cleared",
  "mounded",
  "distinct",
  "conflated",
  "held",
  "steered",
  "raised",
  "fallen",
  "sterling",
  "primed",
  "flashed",
  "lodged",
  "bypassed",
  "greenroomed",
  "scaffold",
  "diplopic",
  "freewheeling",
  "doubled",
  "stereotype",
  "parergon",
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
  "collated",
  "confirmed",
  "miraged",
  "loosed",
  "clung",
  "enrolled",
  "escheated",
  "debased",
]);
export const FORBIDDEN_SEED = Object.freeze(
  FORBIDDEN_IDLE.filter((name) => name !== "scuttled"),
);

export const FEATURED_ISSUE = 93154;
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/93154";
export const TITLE =
  "Remote SSH daemon destroys all running sessions on transient reconnect instead of reattaching";
export const STATE = "OPEN";
export const LABELS = Object.freeze([
  "bug",
  "has repro",
  "platform:macos",
  "platform:linux",
  "area:core",
]);
export const AUTHOR = "gofanly-reviewer";
export const FILED = "2026-09-09";
export const REMOTE_SSH = "claude-ssh 4534d864";
export const REMOTE_SSH_BUILT = "2026-09-02";
export const REMOTE_CLI = "ccd-cli 2.1.260";
export const REMOTE_OS = "Linux x86-64";
export const CLIENT = "Claude desktop on macOS";
export const CHANNEL_ERROR = "channel_closed_no_socket";
export const WARMUP_ERROR = "bridge_startup_timeout";
export const SHUTDOWN_RPC = "server.shutdown";
export const SHUTDOWN_CLI = "server --stop";
export const CONTROLLER = "RemoteServerController";
export const HEALTHY_AFTER_DROP_S = 104;
export const REAP_EXIT = 0;
export const LIVE_SESSIONS = 10;
export const PROCESS_GROUPS = 42;
export const CONNECTIONS_CLOSED = 1;
export const CLEANUP_LINE =
  "cleanup: closed 1 connection(s), killed 42 child process group(s)";
export const CONTROL_UPTIME = "2 days";
export const PING_RPC = "server.ping";
export const LOCK_FILE = "daemon.lock";
export const LOCK_FIELDS = Object.freeze(["pid", "instanceId", "startedAt"]);
export const PHRASE =
  "a brief network blip that SIGKILLs every healthy remote session instead of reattaching is not a moored ship — it is a scuttle. Score scuttled or admit moored.";

export const FINGERPRINT_LINES = Object.freeze([
  "channel_closed_no_socket",
  "bridge_startup_timeout",
  "server.shutdown",
  "server --stop",
  "cleanup: closed 1 connection(s), killed 42 child process group(s)",
]);

export const COUSINS = Object.freeze([
  {
    issue: 85567,
    title:
      'Remote SSH parks on "Reconnecting" for hours after successful reconnect',
    state: "OPEN",
    hasRepro: true,
    citeOnly: true,
    why: "same remote-SSH reconnect neighborhood but the session hangs on Reconnecting instead of destroying live children; cite only; do not clone",
  },
  {
    issue: 92687,
    title:
      "relaunching app replaces running ccd-cli (SIGTERM + --resume) and kills in-flight background work",
    state: "OPEN",
    hasRepro: true,
    citeOnly: true,
    why: "kills in-flight ccd-cli work on relaunch via SIGTERM + --resume, not a warm-up-failure server.shutdown blast of every tracked child; cite only; do not clone",
  },
  {
    issue: 49790,
    title: "feature request: SSH remote session should survive client disconnect",
    state: "OPEN",
    hasRepro: false,
    citeOnly: true,
    why: "wish that a remote session survive disconnect; this ship is the published destroy-on-transient-reconnect walk; cite only; do not clone",
  },
  {
    issue: 84468,
    title: "Remote Control spawns without --resume wiping context",
    state: "OPEN",
    hasRepro: true,
    citeOnly: true,
    why: "Remote Control spawn without --resume wipes context; not RemoteServerController server --stop on warm-up failure; cite only; do not clone",
  },
  {
    issue: 50982,
    title:
      "Desktop Windows remote SSH loses UI message history after reboot",
    state: "OPEN",
    hasRepro: true,
    citeOnly: true,
    why: "Windows Desktop UI history loss after reboot, not a Linux remote daemon SIGKILL of 42 process groups; cite only; do not clone",
  },
  {
    issue: 34255,
    title: "Remote Control automatic reconnection doesn't work",
    state: "OPEN",
    hasRepro: true,
    citeOnly: true,
    why: "Remote Control auto-reconnect failure, not warm-up-failure destructive shutdown of a still-healthy daemon; cite only; do not clone",
  },
]);

export const NOT_PRODUCTS = Object.freeze([
  "stopcock",
  "parergon",
  "stereotype",
  "midden",
  "diplopia",
  "greenroom",
  "guillotine",
  "entresol",
  "hallmark",
  "flashpan",
  "secateurs",
  "palinode",
  "ferrule",
  "clepsydra",
  "fusee",
  "procrustes",
  "reed",
  "quench",
  "wildcat",
  "snatch",
  "deadman",
]);

/**
 * Published scuttle walk from #93154 only. Facts from the issue body.
 * A moored ship reattaches to a still-healthy remote daemon.
 * A scuttled ship is sunk by server.shutdown with no liveness probe.
 */
export const SCUTTLE_WALK = Object.freeze([
  {
    t: "idle",
    event: "cue-moored",
    daemonAlive: true,
    reattach: true,
    livenessProbe: true,
    shutdownIssued: false,
    sigkillChildren: false,
    warmupFailure: false,
    channelClosed: false,
    takeoverPathExists: true,
    childrenKilled: 0,
    liveSessions: LIVE_SESSIONS,
    cue: "moored",
    note: "idle HOLD: remote-session warm-up REATTACHES to a still-healthy remote daemon; ordinary reconnect already reuses a running daemon",
  },
  {
    t: "drop",
    event: "channel-closed-no-socket",
    channelClosed: true,
    channelError: CHANNEL_ERROR,
    daemonAlive: true,
    cue: "scuttled",
    note: "SSH channel drops briefly; client reports channel_closed_no_socket",
  },
  {
    t: "warmup",
    event: "bridge-startup-timeout",
    warmupFailure: true,
    warmupError: WARMUP_ERROR,
    channelClosed: true,
    daemonAlive: true,
    cue: "scuttled",
    note: "warm-up fails with bridge_startup_timeout after the channel drop",
  },
  {
    t: "branch",
    event: "warm-up-failure",
    warmupFailure: true,
    shutdownIssued: true,
    livenessProbe: false,
    cue: "scuttled",
    note: "destructive stop is specifically the warm-up failure branch; ordinary reconnect already reuses a running daemon",
  },
  {
    t: "probe",
    event: "no-liveness-probe",
    livenessProbe: false,
    pingRpc: PING_RPC,
    lockFile: LOCK_FILE,
    cue: "scuttled",
    note: "RemoteServerController issues stop WITHOUT probing daemon liveness via server.ping or daemon.lock (pid, instanceId, startedAt)",
  },
  {
    t: "stop",
    event: "server-shutdown",
    shutdownIssued: true,
    shutdownRpc: SHUTDOWN_RPC,
    shutdownCli: SHUTDOWN_CLI,
    controller: CONTROLLER,
    livenessProbe: false,
    cue: "scuttled",
    note: "RemoteServerController issues server --stop / server.shutdown RPC without checking daemon liveness",
  },
  {
    t: "evidence",
    event: "daemon-still-healthy",
    daemonAlive: true,
    healthyAfterDropS: HEALTHY_AFTER_DROP_S,
    reapExit: REAP_EXIT,
    shutdownIssued: true,
    cue: "scuttled",
    note: "daemon still healthy 104s after drop (reaping exit code 0) in the same second shutdown arrives",
  },
  {
    t: "kill",
    event: "sigkill-children",
    sigkillChildren: true,
    shutdownIssued: true,
    childrenKilled: PROCESS_GROUPS,
    liveSessions: LIVE_SESSIONS,
    connectionsClosed: CONNECTIONS_CLOSED,
    cleanupLine: CLEANUP_LINE,
    noSigterm: true,
    noGrace: true,
    noActiveSessionGuard: true,
    cue: "scuttled",
    note: "daemon SIGKILLs all tracked child process groups (no SIGTERM stage, no grace, no active-session guard); cleanup closed 1 connection(s), killed 42 child process group(s)",
  },
  {
    t: "control",
    event: "takeover-path-exists",
    takeoverPathExists: true,
    takeoverSigtermFirst: true,
    childrenOrphaned: true,
    cue: "scuttled",
    note: "non-destructive daemon-takeover path already exists in the same binary (SIGTERM-first; children orphaned and surviving); only the RPC shutdown path is unconditionally destructive",
  },
  {
    t: "sink",
    event: "scuttled",
    daemonAlive: true,
    reattach: false,
    livenessProbe: false,
    shutdownIssued: true,
    sigkillChildren: true,
    warmupFailure: true,
    channelClosed: true,
    takeoverPathExists: true,
    childrenKilled: PROCESS_GROUPS,
    liveSessions: LIVE_SESSIONS,
    cue: "scuttled",
    note: "brief network blip SIGKILLs every healthy remote session instead of reattaching; score scuttled",
  },
  {
    t: "path",
    event: "scuttle",
    scuttle: true,
    cue: "scuttled",
    note: "a brief network blip that SIGKILLs every healthy remote session instead of reattaching is not a moored ship — it is a scuttle",
  },
]);

function classifyFromSeed(seed) {
  if (seed && VERDICTS.includes(seed)) return seed;
  return null;
}

export function emptyTicket() {
  return {
    seed: IDLE_WORD,
    daemonAlive: true,
    reattach: true,
    livenessProbe: true,
    shutdownIssued: false,
    sigkillChildren: false,
    warmupFailure: false,
    channelClosed: false,
    takeoverPathExists: true,
    childrenKilled: 0,
    liveSessions: LIVE_SESSIONS,
    cue: "moored",
  };
}

export function seedMoored() {
  return { ...emptyTicket() };
}

export function seedScuttled() {
  return {
    seed: SEEDED_WORD,
    daemonAlive: true,
    reattach: false,
    livenessProbe: false,
    shutdownIssued: true,
    sigkillChildren: true,
    warmupFailure: true,
    channelClosed: true,
    takeoverPathExists: true,
    childrenKilled: PROCESS_GROUPS,
    liveSessions: LIVE_SESSIONS,
    healthyAfterDropS: HEALTHY_AFTER_DROP_S,
    reapExit: REAP_EXIT,
    channelError: CHANNEL_ERROR,
    warmupError: WARMUP_ERROR,
    shutdownRpc: SHUTDOWN_RPC,
    shutdownCli: SHUTDOWN_CLI,
    controller: CONTROLLER,
    cleanupLine: CLEANUP_LINE,
    noSigterm: true,
    noGrace: true,
    noActiveSessionGuard: true,
    cue: "scuttled",
    issue: FEATURED_ISSUE,
  };
}

export function seedScuttle() {
  return {
    seed: PATH_WORD,
    preferSeed: true,
    scuttle: true,
    cue: "scuttled",
  };
}

export function seedReattach() {
  return {
    seed: "reattach",
    preferSeed: true,
    reattach: true,
    daemonAlive: true,
    shutdownIssued: false,
    sigkillChildren: false,
    cue: "moored",
  };
}

export function seedServerShutdown() {
  return {
    seed: "server-shutdown",
    shutdownIssued: true,
    shutdownRpc: SHUTDOWN_RPC,
    shutdownCli: SHUTDOWN_CLI,
    controller: CONTROLLER,
    livenessProbe: false,
    cue: "scuttled",
  };
}

export function seedBridgeStartupTimeout() {
  return {
    seed: "bridge-startup-timeout",
    warmupFailure: true,
    warmupError: WARMUP_ERROR,
    cue: "scuttled",
  };
}

export function seedChannelClosedNoSocket() {
  return {
    seed: "channel-closed-no-socket",
    channelClosed: true,
    channelError: CHANNEL_ERROR,
    cue: "scuttled",
  };
}

export function seedSigkillChildren() {
  return {
    seed: "sigkill-children",
    sigkillChildren: true,
    childrenKilled: PROCESS_GROUPS,
    liveSessions: LIVE_SESSIONS,
    cleanupLine: CLEANUP_LINE,
    noSigterm: true,
    cue: "scuttled",
  };
}

export function seedWarmUpFailure() {
  return {
    seed: "warm-up-failure",
    warmupFailure: true,
    shutdownIssued: true,
    livenessProbe: false,
    cue: "scuttled",
  };
}

export function seedNoLivenessProbe() {
  return {
    seed: "no-liveness-probe",
    livenessProbe: false,
    pingRpc: PING_RPC,
    lockFile: LOCK_FILE,
    cue: "scuttled",
  };
}

export function seedTakeoverPathExists() {
  return {
    seed: "takeover-path-exists",
    takeoverPathExists: true,
    takeoverSigtermFirst: true,
    childrenOrphaned: true,
    cue: "scuttled",
  };
}

export function normalizeBooth(raw) {
  if (!raw || typeof raw !== "object") {
    return {
      daemonAlive: false,
      reattach: false,
      livenessProbe: false,
      shutdownIssued: false,
      sigkillChildren: false,
      warmupFailure: false,
      channelClosed: false,
      takeoverPathExists: false,
      takeoverSigtermFirst: false,
      childrenOrphaned: false,
      noSigterm: false,
      noGrace: false,
      noActiveSessionGuard: false,
      scuttle: false,
      childrenKilled: null,
      liveSessions: null,
      healthyAfterDropS: null,
      reapExit: null,
      connectionsClosed: null,
      channelError: null,
      warmupError: null,
      shutdownRpc: null,
      shutdownCli: null,
      controller: null,
      pingRpc: null,
      lockFile: null,
      cleanupLine: null,
      cue: null,
      event: null,
      t: null,
    };
  }
  return {
    daemonAlive: raw.daemonAlive === true,
    reattach: raw.reattach === true,
    livenessProbe: raw.livenessProbe === true,
    shutdownIssued: raw.shutdownIssued === true,
    sigkillChildren: raw.sigkillChildren === true,
    warmupFailure: raw.warmupFailure === true,
    channelClosed: raw.channelClosed === true,
    takeoverPathExists: raw.takeoverPathExists === true,
    takeoverSigtermFirst: raw.takeoverSigtermFirst === true,
    childrenOrphaned: raw.childrenOrphaned === true,
    noSigterm: raw.noSigterm === true,
    noGrace: raw.noGrace === true,
    noActiveSessionGuard: raw.noActiveSessionGuard === true,
    scuttle: raw.scuttle === true,
    childrenKilled: raw.childrenKilled ?? null,
    liveSessions: raw.liveSessions ?? null,
    healthyAfterDropS: raw.healthyAfterDropS ?? null,
    reapExit: raw.reapExit ?? null,
    connectionsClosed: raw.connectionsClosed ?? null,
    channelError: raw.channelError || null,
    warmupError: raw.warmupError || null,
    shutdownRpc: raw.shutdownRpc || null,
    shutdownCli: raw.shutdownCli || null,
    controller: raw.controller || null,
    pingRpc: raw.pingRpc || null,
    lockFile: raw.lockFile || null,
    cleanupLine: raw.cleanupLine || null,
    cue: raw.cue || null,
    event: raw.event || raw.kind || null,
    t: raw.t || raw.time || null,
  };
}

function hasBoothFields(ticket) {
  return Boolean(
    ticket &&
      (ticket.daemonAlive != null ||
        ticket.reattach != null ||
        ticket.livenessProbe != null ||
        ticket.shutdownIssued != null ||
        ticket.sigkillChildren != null ||
        ticket.warmupFailure != null ||
        ticket.channelClosed != null ||
        ticket.takeoverPathExists != null ||
        ticket.scuttle != null ||
        ticket.cue != null ||
        ticket.event ||
        ticket.childrenKilled != null ||
        ticket.healthyAfterDropS != null),
  );
}

function isMoored(row) {
  if (row.scuttle) return false;
  if (row.cue === "scuttled") return false;
  if (row.shutdownIssued && row.sigkillChildren) return false;
  if (row.warmupFailure && row.shutdownIssued && row.livenessProbe === false) {
    return false;
  }
  if (
    row.daemonAlive === true &&
    row.reattach === true &&
    row.shutdownIssued !== true &&
    row.sigkillChildren !== true &&
    row.cue !== "scuttled"
  ) {
    return true;
  }
  if (
    row.cue === "moored" &&
    row.shutdownIssued !== true &&
    row.sigkillChildren !== true
  ) {
    return true;
  }
  return false;
}

function isScuttled(row) {
  if (row.scuttle && row.cue !== "moored") return false;
  if (row.cue === "scuttled") return true;
  if (row.shutdownIssued && row.sigkillChildren) return true;
  if (row.warmupFailure && row.shutdownIssued && row.livenessProbe === false) {
    return true;
  }
  if (
    row.channelClosed &&
    row.warmupFailure &&
    (row.shutdownIssued || row.sigkillChildren)
  ) {
    return true;
  }
  if (row.childrenKilled === PROCESS_GROUPS && row.sigkillChildren) return true;
  return false;
}

function isScuttlePath(row) {
  return row.scuttle === true && !isMoored(row);
}

/**
 * Score one remote-SSH reconnect pass against the scuttle booth.
 * moored: reattach to a still-healthy daemon; no shutdown; children live.
 * scuttled: warm-up failure issues server.shutdown; SIGKILL children.
 * scuttle: named path — a brief blip that SIGKILLs is not a moored ship.
 */
export function scoreGate(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const row = normalizeBooth(ticket);
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);

  let verdict = IDLE_WORD;
  if (isScuttlePath(row)) {
    verdict = "scuttle";
  } else if (isScuttled(row)) {
    verdict = "scuttled";
  } else if (isMoored(row)) {
    verdict = "moored";
  } else if (
    row.shutdownIssued ||
    row.sigkillChildren ||
    row.warmupFailure ||
    (row.channelClosed && row.livenessProbe === false) ||
    row.childrenKilled === PROCESS_GROUPS
  ) {
    verdict = "scuttled";
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
    moored: verdict === "moored",
    scuttled: verdict === "scuttled" || verdict === SEEDED_WORD,
    scuttle: verdict === "scuttle" || verdict === PATH_WORD,
    reattach: row.reattach,
    daemonAlive: row.daemonAlive,
    livenessProbe: row.livenessProbe,
    shutdownIssued: row.shutdownIssued,
    sigkillChildren: row.sigkillChildren,
    warmupFailure: row.warmupFailure,
    channelClosed: row.channelClosed,
    takeoverPathExists: row.takeoverPathExists,
    takeoverSigtermFirst: row.takeoverSigtermFirst,
    childrenOrphaned: row.childrenOrphaned,
    noSigterm: row.noSigterm,
    noGrace: row.noGrace,
    noActiveSessionGuard: row.noActiveSessionGuard,
    childrenKilled: row.childrenKilled,
    liveSessions: row.liveSessions,
    healthyAfterDropS: row.healthyAfterDropS,
    reapExit: row.reapExit,
    connectionsClosed: row.connectionsClosed,
    channelError: row.channelError,
    warmupError: row.warmupError,
    shutdownRpc: row.shutdownRpc,
    shutdownCli: row.shutdownCli,
    controller: row.controller,
    pingRpc: row.pingRpc,
    lockFile: row.lockFile,
    cleanupLine: row.cleanupLine,
    cue: hold ? "moored" : "scuttled",
    event: row.event,
    t: row.t,
    phrase: hold ? "admit moored" : "score scuttled",
  };
}

export function scoreWalk(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const rows = Array.isArray(ticket.rows)
    ? ticket.rows
    : Array.isArray(ticket.walk)
      ? ticket.walk
      : SCUTTLE_WALK;
  const scored = rows.map((row) => ({
    ...normalizeBooth(row),
    ...scoreGate({ ...row, preferSeed: false }),
  }));
  const scuttled = scored.filter((row) => row.verdict === "scuttled");
  const scuttle = scored.filter((row) => row.verdict === "scuttle");
  const moored = scored.filter((row) => row.verdict === "moored");
  const headline =
    scored.find((row) => row.event === "scuttled") ||
    scored.find((row) => row.event === "sigkill-children") ||
    scored.find((row) => row.event === "server-shutdown") ||
    scored.find((row) => row.event === "scuttle") ||
    scuttled[scuttled.length - 1];
  let verdict = "moored";
  if (scuttled.length) verdict = "scuttled";
  else if (scuttle.length && !moored.length) verdict = "scuttle";
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
    scuttledCount: scuttled.length,
    scuttleCount: scuttle.length,
    mooredCount: moored.length,
    headline,
    rows: scored,
    phrase: HOLD.includes(verdict) ? "admit moored" : "score scuttled",
    note: headline
      ? "brief network blip SIGKILLs every healthy remote session instead of reattaching; server.shutdown with no liveness probe; killed 42 child process group(s)."
      : "published scuttle walk scored against moored vs scuttled",
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
    seeded !== "scuttled" &&
    seeded !== "scuttle" &&
    ticket.daemonAlive == null &&
    ticket.reattach == null &&
    ticket.livenessProbe == null &&
    ticket.shutdownIssued == null &&
    ticket.sigkillChildren == null &&
    ticket.warmupFailure == null &&
    ticket.scuttle == null &&
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
    daemonAlive: scored.daemonAlive ?? false,
    reattach: scored.reattach ?? false,
    livenessProbe: scored.livenessProbe ?? false,
    shutdownIssued: scored.shutdownIssued ?? false,
    sigkillChildren: scored.sigkillChildren ?? false,
    warmupFailure: scored.warmupFailure ?? false,
  };
}

export function score(input) {
  return analyze(input).verdict;
}

export function fingerprint(input) {
  const result = analyze(input);
  return [
    result.verdict,
    result.reattach ? "reattach=yes" : "reattach=no",
    result.livenessProbe ? "probe=yes" : "probe=none",
    result.shutdownIssued ? "stop=shutdown" : "stop=none",
    result.cue === "moored" ? "cue=moored" : "cue=scuttled",
  ].join("|");
}

export function handle(input) {
  const result = analyze(input);
  return {
    ...result,
    fingerprint: fingerprint(input),
    published: {
      issue: FEATURED_ISSUE,
      url: ISSUE_URL,
      title: TITLE,
      state: STATE,
      labels: [...LABELS],
      author: AUTHOR,
      filed: FILED,
      remoteSsh: REMOTE_SSH,
      remoteSshBuilt: REMOTE_SSH_BUILT,
      remoteCli: REMOTE_CLI,
      remoteOs: REMOTE_OS,
      client: CLIENT,
      channelError: CHANNEL_ERROR,
      warmupError: WARMUP_ERROR,
      shutdownRpc: SHUTDOWN_RPC,
      shutdownCli: SHUTDOWN_CLI,
      controller: CONTROLLER,
      healthyAfterDropS: HEALTHY_AFTER_DROP_S,
      reapExit: REAP_EXIT,
      liveSessions: LIVE_SESSIONS,
      processGroups: PROCESS_GROUPS,
      connectionsClosed: CONNECTIONS_CLOSED,
      cleanupLine: CLEANUP_LINE,
      controlUptime: CONTROL_UPTIME,
      pingRpc: PING_RPC,
      lockFile: LOCK_FILE,
      lockFields: [...LOCK_FIELDS],
      fingerprintLines: [...FINGERPRINT_LINES],
      cousins: COUSINS.map((row) => row.issue),
      phrase: PHRASE,
      expected: [
        "on a transient SSH blip, remote-session warm-up should REATTACH to a still-healthy remote daemon",
        "probe with server.ping / daemon.lock (pid, instanceId, startedAt) before destroy",
        "if stop required, use takeover semantics (SIGTERM-first; children orphaned) or an active-session guard",
      ],
      hypothesis:
        "NON-BINDING: warm-up failure branch may select destructive server.shutdown instead of the existing reattach/reuse path",
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
