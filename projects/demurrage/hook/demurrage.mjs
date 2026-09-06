/**
 * Demurrage clerk's laytime / overstay ledger scorer.
 * The remote daemon should release or reuse a chat berth
 * when the vessel leaves. Instead ccd-cli sessions accrue
 * unpaid — duplicates on the same --resume UUID, daemons
 * idle days after last client, processes still running
 * pruned binaries — until the self-hosted host is seized.
 *
 * Encoded from #92548 issue facts only.
 * Hypothesis (NON-BINDING): the remote daemon has no
 * session lifecycle — no release on chat close, no reuse
 * of --resume UUID, no exit on client disconnect, and
 * prune does not restart processes still executing the
 * deleted binary. Verify nothing in closed source; encode
 * issue facts only.
 * No network. No exploits. No live Claude.
 * Do not invent source-code claims.
 */

export const CHIPS = [
  "accruing",
  "cleared",
  "duplicate-resume",
  "daemon-orphan",
  "deleted-binary",
  "no-lifecycle-flags",
  "outage-census",
  "cousins"
];

export const HOLD = new Set(["cleared"]);

export const ALARM = new Set([
  "accruing",
  "duplicate-resume",
  "daemon-orphan",
  "deleted-binary",
  "no-lifecycle-flags",
  "outage-census",
  "cousins"
]);

export const MEASURED = {
  rssPerChatMb: 300,
  rssLowMb: 250,
  rssHighMb: 420,
  hostRamGb: 15,
  swap: false,
  linux: "6.12.24",
  host: "Unraid",
  transport: "Tailscale SSH",
  clients: ["desktop", "mobile"],
  terminalUse: false,
  cliKeepDefault: 3,
  prunedStillRunning: "2.1.247",
  onDisk: ["2.1.255", "2.1.258", "2.1.260"],
  runningCounts: { "2.1.247": 2, "2.1.255": 3, "2.1.258": 2 },
  versionsResident: ["2.1.247", "2.1.255", "2.1.258", "2.1.260"],
  latestPublished: "2.1.263",
  serverVersion: "2.1.260",
  daemonBuild: "7d193f89fc02cf1035a391245312e34ad419f63e",
  daemonBuilt: "2026-08-25T00:11:43Z",
  bridgeBuild: "4534d8648b686881955c6f13baf46ae72ee72f4c",
  idleDaemonDays: 11,
  idleSinceClientDays: 4,
  idleDaemonOtherDays: 5,
  stopRecoveredMb: 478,
  stopReleasedChats: 4,
  outage1: {
    date: "2026-08-31",
    load: 87,
    dState: 60,
    sessions: 23,
    heldGb: 8.1
  },
  outage2: {
    date: "2026-09-01",
    load: 97,
    freeMb: 324,
    ramGb: 15,
    sessions: 59,
    heldGb: 15
  },
  flagsPresent: [
    "-bridge",
    "-cli-checksum",
    "-cli-dir",
    "-cli-keep",
    "-cli-url",
    "-cli-version",
    "-cli-zst",
    "-install",
    "-serve",
    "-socket",
    "-stop",
    "-token-file",
    "-version"
  ],
  flagsMissing: ["idle-timeout", "max-session", "eviction"],
  stopOnly: true,
  stopAllOrNothing: true,
  reporter: "jbast1224",
  filed: "2026-09-06T20:19:28Z",
  labels: [
    "bug",
    "has repro",
    "platform:linux",
    "perf:memory",
    "area:self-hosted-environments"
  ]
};

export const PROCESSES = [
  { conversation: "2e283802", pid: 363856, socket: "5b2efa6a", ageH: 117.1 },
  { conversation: "2e283802", pid: 267743, socket: "5b2efa6a", ageH: 68.6, duplicateSameDaemon: true },
  { conversation: "2e283802", pid: 3753765, socket: "85fbdb5e", ageH: 93.1 },
  { conversation: "c41780db", pid: 338535, socket: "5b2efa6a", ageH: 117.3 },
  { conversation: "c41780db", pid: 3753764, socket: "85fbdb5e", ageH: 93.1 },
  { conversation: "f2498e39", pid: 2110967, socket: "77f380c3", ageH: 118.0 },
  { conversation: "f2498e39", pid: 958621, socket: "4927f78e", ageH: 2.5 },
  { conversation: "59aa5e70", pid: 2110977, socket: "77f380c3", ageH: 118.0 },
  { conversation: "59aa5e70", pid: 958053, socket: "4927f78e", ageH: 2.4 }
];

export const DAEMONS = [
  { socket: "85fbdb5e", started: "Aug 25 19:22", lastClient: "Sep 2 11:28", chatsHeld: 2, state: "idle 4 days", idleDays: 4, upDays: 11, reparentedToInit: true },
  { socket: "77f380c3", started: "Sep 1 10:25", lastClient: "Sep 1 23:39", chatsHeld: 2, state: "idle 5 days", idleDays: 5, upDays: 5, reparentedToInit: true },
  { socket: "5b2efa6a", started: "Sep 1 11:10", lastClient: "active", chatsHeld: 4, state: "in use", idleDays: 0, upDays: 5 },
  { socket: "4927f78e", started: "Sep 6 05:48", lastClient: "active", chatsHeld: 3, state: "in use", idleDays: 0, upDays: 0 }
];

export const FILING_CENSUS = [
  { pid: 338535, conversation: "c41780db", version: "2.1.247", rssMb: 397, ageH: 121.9, deleted: true },
  { pid: 3911065, conversation: "c41780db", version: "2.1.258", rssMb: 418, ageH: 96.8, deleted: false },
  { pid: 363856, conversation: "2e283802", version: "2.1.247", rssMb: 277, ageH: 121.7, deleted: true },
  { pid: 2677438, conversation: "2e283802", version: "2.1.258", rssMb: 370, ageH: 73.2, deleted: false }
];

export const COUSINS = [
  {
    id: 92059,
    note: "Windows: memory-pressure governor evicts 0 of 0 idle sessions while remote control vetoes pause — CLIENT side counterpart"
  },
  {
    id: 1935,
    note: "orphaned MCP servers — different component, same lifecycle family"
  },
  {
    id: 49790,
    note: "requests the opposite behaviour (sessions surviving disconnect)"
  }
];

function num(value) {
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? n : null;
}

function boolish(value) {
  return value === true || value === "true" || value === 1;
}

export function classify(probe = {}) {
  const t = probe && typeof probe === "object" ? probe : {};
  const processes = Array.isArray(t.processes) ? t.processes : PROCESSES;
  const daemons = Array.isArray(t.daemons) ? t.daemons : DAEMONS;
  const resumeUuid = String(t.resumeUuid || t.resume || t.conversation || "");
  const sameDaemonDup =
    boolish(t.duplicateSameDaemon) ||
    boolish(t.duplicateResume) ||
    processes.some((p) => p.duplicateSameDaemon === true);
  const rssMb = num(t.rssMb ?? t.rss ?? t.residentMb) ?? MEASURED.rssPerChatMb;
  const chatsHeld = num(t.chatsHeld ?? t.sessionsHeld);
  const idleDays = num(t.idleDays ?? t.idleSinceClientDays);
  const upDays = num(t.upDays ?? t.daemonUpDays);
  const deletedBinary =
    boolish(t.deletedBinary) ||
    boolish(t.runningDeleted) ||
    String(t.version || "") === MEASURED.prunedStillRunning;
  const missingFlags =
    boolish(t.noLifecycleFlags) ||
    (Array.isArray(t.flagsMissing) && t.flagsMissing.length > 0) ||
    (Array.isArray(t.missingFlags) && t.missingFlags.length > 0);
  const outage =
    boolish(t.outage) ||
    boolish(t.seized) ||
    num(t.sessions) != null ||
    num(t.load) != null;
  const linuxSelfHost =
    boolish(t.linux) ||
    String(t.platform || t.os || t.host || "").toLowerCase().includes("linux") ||
    String(t.host || "").toLowerCase().includes("unraid");
  const released =
    boolish(t.cleared) ||
    boolish(t.released) ||
    boolish(t.reused);
  const accruing =
    boolish(t.accruing) ||
    (!released && (sameDaemonDup || deletedBinary || missingFlags || outage || (idleDays != null && idleDays >= 4)));

  return {
    resumeUuid,
    sameDaemonDup,
    rssMb,
    chatsHeld,
    idleDays: idleDays ?? MEASURED.idleSinceClientDays,
    upDays: upDays ?? MEASURED.idleDaemonDays,
    deletedBinary,
    missingFlags,
    outage,
    linuxSelfHost,
    released,
    accruing,
    processCount: processes.length,
    daemonCount: daemons.length,
    version: t.version || MEASURED.serverVersion,
    platform: t.platform || "linux",
    host: t.host || MEASURED.host,
    transport: t.transport || MEASURED.transport
  };
}

export function seedAccruing() {
  return {
    seed: "accruing",
    issue: 92548,
    accruing: true,
    cleared: false,
    released: false,
    reused: false,
    duplicateSameDaemon: true,
    deletedBinary: true,
    noLifecycleFlags: true,
    rssMb: 300,
    idleDays: 4,
    upDays: 11,
    version: "2.1.260",
    platform: "linux",
    host: "Unraid",
    transport: "Tailscale SSH",
    os: "Linux 6.12.24"
  };
}

export function seedCleared() {
  return {
    seed: "cleared",
    issue: 92548,
    accruing: false,
    cleared: true,
    released: true,
    reused: true,
    duplicateSameDaemon: false,
    deletedBinary: false,
    noLifecycleFlags: false,
    rssMb: 0,
    idleDays: 0,
    upDays: 0,
    version: "2.1.260",
    platform: "linux"
  };
}

export function scoreFields(probe = {}) {
  return classify(probe);
}

export function decide(probe = {}) {
  const t = probe && typeof probe === "object" ? probe : {};
  const seed = String(t.seed || "");
  const berth = classify(t);
  const reasons = [];

  if (seed === "cousins" || (Array.isArray(t.cousinsCiteOnly) && seed === "cousins")) {
    reasons.push(
      "cite-only #92059 Windows memory-pressure governor evicts 0 of 0 idle while remote control vetoes pause — CLIENT side; #1935 orphaned MCP servers (different component, same lifecycle family); #49790 requests opposite behaviour (sessions surviving disconnect). Neighbourhood contrast only: Bourdon/#92510 is Cowork VM host fd climb on macOS — DIFFERENT paradigm. Primary stays #92548"
    );
    return {
      verdict: "cousins",
      reasons,
      accruing: true,
      cleared: false,
      chips: ["cousins", "accruing"],
      berth
    };
  }

  if (
    seed === "cleared" ||
    (t.cleared === true && t.accruing !== true && seed !== "duplicate-resume")
  ) {
    reasons.push(
      "laytime cleared. Chat process released when the chat closed or after idle; reopen reused the same --resume berth; the daemon exited after last client or handed sessions to the successor. Seeded word is cleared"
    );
    return {
      verdict: "cleared",
      reasons,
      accruing: false,
      cleared: true,
      chips: ["cleared"],
      berth
    };
  }

  if (seed === "outage-census" || t.outageCensus === true) {
    reasons.push(
      "Two hard outages on Unraid, 15 GB, no swap. 2026-08-31 load 87 / ~60 D-state / 23 abandoned sessions holding 8.1 GB. 2026-09-01 load 97 / 324 MB free of 15 GB / 59 sessions holding ~15 GB. Printers dropped MQTT simultaneously. With no swap the machine stops responding rather than slowing down"
    );
    return {
      verdict: "outage-census",
      reasons,
      accruing: true,
      cleared: false,
      chips: ["outage-census", "accruing"],
      berth
    };
  }

  if (seed === "no-lifecycle-flags") {
    reasons.push(
      "Daemon flag list has no idle timeout, session cap, or eviction. Present: -bridge -cli-checksum -cli-dir -cli-keep -cli-url -cli-version -cli-zst -install -serve -socket -stop -token-file -version. Only -stop (all-or-nothing per daemon). Desktop and mobile have no shell and no per-chat control"
    );
    return {
      verdict: "no-lifecycle-flags",
      reasons,
      accruing: true,
      cleared: false,
      chips: ["no-lifecycle-flags", "accruing"],
      berth
    };
  }

  if (seed === "deleted-binary" || (t.runningDeleted === true && seed !== "accruing")) {
    reasons.push(
      "CLI prune (-cli-keep default 3) deletes old binaries but leaves processes still executing pruned versions. On disk: 2.1.255 / 2.1.258 / 2.1.260. Running: 2.1.247 x2 (no longer on disk), 2.1.255 x3, 2.1.258 x2. Filing census: PID 338535 c41780db 2.1.247 397MB 121.9h and PID 363856 2e283802 2.1.247 277MB 121.7h still executing the hulk"
    );
    return {
      verdict: "deleted-binary",
      reasons,
      accruing: true,
      cleared: false,
      chips: ["deleted-binary", "accruing"],
      berth
    };
  }

  if (seed === "daemon-orphan" || t.orphanDaemon === true) {
    reasons.push(
      "Each client update starts a new daemon on a new socket; the old daemon keeps running indefinitely with every chat it held. Socket 85fbdb5e started Aug 25 19:22, last client Sep 2 11:28, 2 chats held, idle 4 days, 11 days since start. Socket 77f380c3 idle 5 days. Both idle daemons self-daemonized and reparented to init"
    );
    return {
      verdict: "daemon-orphan",
      reasons,
      accruing: true,
      cleared: false,
      chips: ["daemon-orphan", "accruing"],
      berth
    };
  }

  if (seed === "duplicate-resume" || t.duplicateResume === true) {
    reasons.push(
      "Reopening a chat under the SAME daemon spawns a duplicate against the same --resume UUID. Decisive row: conversation 2e283802 PID 363856 on socket 5b2efa6a age 117.1h and PID 267743 on the same socket age 68.6h — started ~48h apart. Device-switching is not required"
    );
    return {
      verdict: "duplicate-resume",
      reasons,
      accruing: true,
      cleared: false,
      chips: ["duplicate-resume", "accruing"],
      berth
    };
  }

  if (
    t.accruing === true ||
    seed === "accruing" ||
    (berth.accruing && !berth.released)
  ) {
    reasons.push(
      "The remote daemon should release or reuse each chat berth when the vessel leaves; instead ~300MB ccd-cli sessions accrue unpaid. Opening a chat starts a process holding 250–420 MB that stays resident indefinitely. Four conversations, nine processes. No error is emitted — the daemon logs nothing abnormal. Desktop and mobile only over Tailscale SSH; -stop requires a shell and is all-or-nothing"
    );
    const chips = ["accruing"];
    if (berth.sameDaemonDup || t.duplicateResume === true) chips.push("duplicate-resume");
    if (berth.deletedBinary || t.deletedBinary === true) chips.push("deleted-binary");
    if (berth.missingFlags || t.noLifecycleFlags === true) chips.push("no-lifecycle-flags");
    if ((berth.idleDays != null && berth.idleDays >= 4) || t.daemonOrphan === true) {
      chips.push("daemon-orphan");
    }
    return {
      verdict: "accruing",
      reasons,
      accruing: true,
      cleared: false,
      chips: [...new Set(chips)],
      berth
    };
  }

  if (HOLD.has(seed)) {
    reasons.push(`seeded ${seed}`);
    return { verdict: seed, reasons, accruing: false, cleared: true, chips: [seed], berth };
  }

  if (ALARM.has(seed)) {
    reasons.push(`seeded ${seed}`);
    return { verdict: seed, reasons, accruing: true, cleared: false, chips: [seed], berth };
  }

  reasons.push(
    "empty probe; idle demurrage ledger is accruing — chat berths stay occupied after the vessel leaves, ~300MB ccd-cli per chat, no idle timeout"
  );
  return {
    verdict: "accruing",
    reasons,
    accruing: true,
    cleared: false,
    chips: ["accruing"],
    berth
  };
}
