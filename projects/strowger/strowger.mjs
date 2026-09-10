#!/usr/bin/env node
/**
 * Strowger — automatic telephone exchange / step-by-step switchboard booth.
 *
 * Educational diagnostic model for a published Claude Code Desktop
 * defect: the booth should stay trunked (SendMessage present; peers
 * addressable; notify_when_idle works; event-driven supervision
 * intact). Instead Desktop cuts the trunk with --disallowedTools
 * SendMessage while ListAgents still lists peers and documents
 * SendMessage as the address. Six mechanisms that all route through
 * SendMessage / notify_when_idle go silently dead.
 *
 *   node strowger.mjs data/strowger.json
 *   echo '{"seed":"strowger"}' | node strowger.mjs
 *
 * Idle word is trunked (HOLD: SendMessage present; peers addressable;
 * notify_when_idle works; event-driven supervision intact).
 * Seeded word is strowger (#93218: Desktop --disallowedTools
 * SendMessage; ListAgents still lists peers and documents SendMessage
 * as the address; six mechanisms dead).
 * Path word is exchanged (named path — directory lists, trunk cut,
 * score the drift).
 *
 * Encoded from anthropics/claude-code#93218 issue body only.
 * Hypothesis (NON-BINDING): the Desktop launcher injects
 * --disallowedTools SendMessage (plus a permission-layer auto-deny)
 * while leaving ListAgents, the Agent tool description, and every
 * subagent completion message pointing at SendMessage; the same
 * bundled binary started in CLI mode still exposes the tool. Verify
 * against #93218 text only. Do NOT claim a root cause in Claude Code
 * source you have not seen. Do NOT implement a fix in
 * anthropics/claude-code.
 * No network. No exploits. No live Claude. No payloads. No secrets.
 */

/* Browser-safe: no top-level node: imports. CLI I/O is loaded only in main(). */

export const VERDICTS = Object.freeze([
  "trunked",
  "strowger",
  "exchanged",
  "hold",
  "sendmessage-cut",
  "listagents-lists",
  "disallowed-tools",
  "notify-when-idle-gone",
  "six-mechanisms",
  "launcher-only",
  "cli-still-has-tool",
  "has-repro",
  "cousins",
  "backups",
  "fixtures",
  "chips",
  "fingerprints",
  "walk",
]);

export const IDLE_WORD = "trunked";
export const PATH_WORD = "exchanged";
export const SEEDED_WORD = "strowger";
export const HOLD = Object.freeze(["trunked", "hold"]);
export const RECOVER = Object.freeze(["trunked", "hold"]);
export const ALARM = Object.freeze(
  VERDICTS.filter((name) => !HOLD.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FORBIDDEN_IDLE = Object.freeze([
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
  "deadair",
  "squelch",
  "moored",
  "scuttled",
  "scuttle",
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
  "lacuna",
  "hangfire",
  "afterimage",
  "remora",
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
  "culled",
  "sole",
  "slipped",
  "sprung",
  "corked",
  "relayed",
]);
export const FORBIDDEN_SEED = Object.freeze(
  FORBIDDEN_IDLE.filter((name) => name !== "strowger"),
);

export const FEATURED_ISSUE = 93218;
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/93218";
export const TITLE =
  "Desktop app disables `SendMessage` via `--disallowedTools`, but `ListAgents` in the same session still lists peers and documents it as the address";
export const STATE = "OPEN";
export const LABELS = Object.freeze([
  "bug",
  "has repro",
  "platform:windows",
  "area:tools",
  "area:agents",
  "area:desktop",
]);
export const AUTHOR = "harry930216";
export const FILED = "2026-09-09T22:59:43Z";
export const LAST_WORKING = "2.1.258";
export const FIRST_BROKEN = "2.1.260";
export const DESKTOP_VERSION = "1.49585.0";
export const BUNDLED_VERSIONS = Object.freeze(["2.1.258", "2.1.260"]);
export const STANDALONE_CLI = "2.1.266";
export const CLI_TOOL_COUNT = 44;
export const DISALLOWED_FLAG = "--disallowedTools SendMessage";
export const SURFACE = "Claude Desktop launcher (Windows MSIX)";
export const DENY_MESSAGE =
  "Use `mcp__ccd_session_mgmt__send_message` to message another session from the desktop app; the CLI-native `SendMessage` tool is unavailable here (terminal sessions outside Claude Desktop are not reachable from this session).";
export const RUNTIME_ERROR =
  "No such tool available: SendMessage. SendMessage is disabled for this session, in subagents as well as here.";
export const LISTAGENTS_DESCRIPTION =
  'Lists agents you can SendMessage to — in-process subagents you spawned, … other local Claude sessions on this machine, … Names are the address: send with SendMessage({to: "<name>"}), copying the name exactly as a row prints it.';
export const COMPLETION_HINT =
  "agentId: a30e265c54747db17 (use SendMessage with to: 'a30e265c54747db17', … to continue this agent)";
export const PHRASE =
  "when ListAgents still lists peers and documents SendMessage as the address but Desktop cut the trunk, strowger never stays trunked — score strowger or admit trunked.";

export const PEER_DIRECTORY = Object.freeze([
  {
    name: "charter-f1",
    id: "9c1493",
    kind: "interactive",
    age: "started 1h ago",
  },
  {
    name: "charter-68",
    id: "471f31",
    kind: "interactive",
    age: "started 7m ago",
  },
  {
    name: "<bg probe>",
    id: "293496",
    kind: "bg",
    status: "idle",
    age: "started 7s ago",
  },
]);

export const SIX_MECHANISMS = Object.freeze([
  {
    id: "supervisor-file-trail",
    link: "Start a supervisor from the app",
    documented:
      "A supervisor session reports back on two channels by design: a file trail and a SendMessage notice to the dispatching session",
    stateNow:
      "Second channel gone. A supervisor started from the app cannot report at all; supervisors must move to claude --bg",
  },
  {
    id: "notify-when-idle",
    link: "Supervise running workers",
    documented:
      "notify_when_idle — one-shot subscription, no polling, costs the other session nothing",
    stateNow:
      "Gone. Supervision reverts to polling, which spends tokens on every check in a session that previously spent none",
  },
  {
    id: "converge-review",
    link: "Converge a review over rounds",
    documented: "SendMessage({to: agentId}) to continue an existing agent",
    stateNow:
      "Gone on desktop. Each round is now a cold re-dispatch that rebuilds the reviewer's full context",
  },
  {
    id: "escalate-unattended",
    link: "Escalate to the human",
    documented:
      "A scheduled task is the only clock that does not depend on a live session; it reports what it finds",
    stateNow:
      "Denied by the unattended_send_message branch. A watchdog that cannot report anything is not a watchdog",
  },
  {
    id: "recover-usage-limit",
    link: "Recover after a usage-limit kill",
    documented:
      "Resume the terminated subagents instead of re-running them — files already written survive",
    stateNow:
      "Gone. Every usage-limit hit forces a full cold re-dispatch, so the retry costs more than the original run did",
  },
  {
    id: "correct-bg-job",
    link: "Correct a running background job",
    documented: "ListAgents lists bg rooms; SendMessage addresses them",
    stateNow:
      "ListAgents lists bg rooms but no tool in the session can address them. Workaround: spawn a separate CLI process purely to relay one message",
  },
]);

export const FINGERPRINT_LINES = Object.freeze([
  "--disallowedTools SendMessage",
  "ListAgents still lists peers",
  "Names are the address: send with SendMessage({to: \"<name>\"})",
  "notify_when_idle",
  "six mechanisms",
  "launcher-only",
  "bundled 2.1.260/claude.exe CLI still returns 44 tools including SendMessage",
  "worked through 2.1.258; stopped at 2.1.260",
  "No such tool available: SendMessage",
]);

export const COUSINS = Object.freeze([
  {
    issue: 92646,
    title:
      "Claude Desktop blocks SendMessage entirely, which also removes subagent continuation",
    state: "OPEN",
    hasRepro: true,
    product: "Speakpipe",
    citeOnly: true,
    why: "Speakpipe/#92646 Desktop corks deck-to-ship SendMessage and Agent/ListAgents/footers still advertise a tool ToolSearch cannot find — prior agent-messaging catalog; corked/relayed paradigm, not this six-mechanism launcher-only cut — cite only; do not rebuild",
  },
  {
    issue: 92249,
    title:
      "[BUG] ListAgents / SendMessage missing from tool registry in Desktop scheduled-task and Remote Control sessions (bisected to Desktop 1.44121.4 -> 1.46388.1)",
    state: "OPEN",
    hasRepro: true,
    product: "Deadlight",
    citeOnly: true,
    why: "Deadlight/#92249 blanks ListAgents and SendMessage on scheduled-task and Remote Control — directory shuttered, not listed-with-cut-trunk — cite only; do not rebuild",
  },
  {
    issue: 90481,
    title: "Cross-session messaging disappearing after an update",
    state: "OPEN",
    hasRepro: false,
    citeOnly: true,
    why: "Related from #93218: VSCode/CLI-side messaging disappear with no --disallowedTools in play — different root cause; cite only; do not rebuild",
  },
]);

export const BACKUPS = Object.freeze([
  {
    issue: 93219,
    title: "macOS effort slider inert, stuck at Max",
    state: "OPEN",
    product: "Vernier",
    citeOnly: true,
    why: "Vernier — macOS effort slider inert, stuck at Max (has repro) — backup, not primary; cite in data only",
  },
  {
    issue: 93207,
    title: "iOS plan approval setMode auto discards prePlanMode",
    state: "OPEN",
    citeOnly: true,
    why: "iOS plan approval setMode auto discards prePlanMode — backup, not primary; cite in data only",
  },
  {
    issue: 93182,
    title:
      "Server-side tools are unblockable: deny rejects the registered casing, and PreToolUse hooks never fire for them",
    state: "OPEN",
    citeOnly: true,
    why: "server-side tools unblockable — deny casing mismatch + PreToolUse never fires — backup, not primary; cite in data only",
  },
]);

export const NOT_PRODUCTS = Object.freeze([
  "mondegreen",
  "derby",
  "vizard",
  "deadair",
  "scuttle",
  "stopcock",
  "parergon",
  "stereotype",
  "midden",
  "speakpipe",
  "mailslot",
  "deadletter",
  "aphonia",
  "annunciator",
  "deadlight",
  "diplopia",
  "greenroom",
  "guillotine",
  "seizing",
  "holdfast",
  "springe",
  "entresol",
  "hallmark",
  "flashpan",
  "secateurs",
  "palinode",
  "understudy",
  "mirage",
  "trompe",
  "homonym",
  "shibboleth",
  "procrustes",
  "interlock",
]);

/**
 * Conceptual directory ear — ListAgents still prints every subscriber
 * and names SendMessage as the address, whether or not the trunk is live.
 */
export function readDirectory(peers = PEER_DIRECTORY) {
  return {
    listed: peers.length,
    names: peers.map((row) => row.name),
    kinds: peers.map((row) => row.kind),
    address: "SendMessage({to: name})",
    description: LISTAGENTS_DESCRIPTION,
  };
}

/**
 * Conceptual trunk lamp — SendMessage present vs cut.
 * Desktop launcher: cut. Same bundled binary in CLI mode: live.
 */
export function readTrunk(input = {}) {
  const desktop = input.desktopLauncher === true;
  const disallowed = input.disallowedTools === true || desktop;
  const cliHas = input.cliStillHasTool !== false;
  const present = desktop || disallowed ? false : cliHas;
  return {
    present,
    cut: !present,
    lamp: present ? "trunked" : "cut",
    flag: disallowed ? DISALLOWED_FLAG : null,
    cliToolCount: cliHas ? CLI_TOOL_COUNT : 0,
    notifyWhenIdle: present,
  };
}

export function compareExchange(input = {}) {
  const directory = readDirectory(input.peers || PEER_DIRECTORY);
  const trunk = readTrunk(input);
  const cutWhileListed = directory.listed > 0 && trunk.cut;
  return {
    directory,
    trunk,
    cutWhileListed,
    sixDead: cutWhileListed,
    cue: cutWhileListed ? "strowger" : "trunked",
  };
}

/**
 * Published strowger walk from #93218 only. Facts from the issue body.
 * A trunked booth keeps SendMessage live. A strowger booth lists the
 * directory while the trunk is cut.
 */
export const STROWGER_WALK = Object.freeze([
  {
    t: "idle",
    event: "cue-trunked",
    trunked: true,
    sendMessagePresent: true,
    peersAddressable: true,
    notifyWhenIdle: true,
    desktopLauncher: false,
    disallowedTools: false,
    listAgentsLists: false,
    sendMessageCut: false,
    sixMechanismsGone: false,
    cliStillHasTool: true,
    cue: "trunked",
    note: "idle HOLD: SendMessage present; peers addressable; notify_when_idle works; event-driven supervision intact",
  },
  {
    t: "launch",
    event: "desktop-launcher",
    desktopLauncher: true,
    launcherOnly: true,
    cue: "strowger",
    note: "Desktop launcher differs; same bundled 2.1.260/claude.exe in CLI mode still returns 44 tools including SendMessage",
  },
  {
    t: "flag",
    event: "disallowed-tools",
    disallowedTools: true,
    desktopLauncher: true,
    flag: DISALLOWED_FLAG,
    cue: "strowger",
    note: "Desktop spawns every Claude Code session with --disallowedTools SendMessage, plus a permission-layer auto-deny",
  },
  {
    t: "directory",
    event: "listagents-lists",
    listAgentsLists: true,
    desktopLauncher: true,
    disallowedTools: true,
    peers: PEER_DIRECTORY,
    cue: "strowger",
    note: "ListAgents in the same session still lists peers (interactive + bg rooms)",
  },
  {
    t: "docs",
    event: "sendmessage-cut",
    sendMessageCut: true,
    listAgentsLists: true,
    docsAdvertiseSendMessage: true,
    desktopLauncher: true,
    disallowedTools: true,
    cue: "strowger",
    note: "ListAgents, the Agent tool description, and every subagent completion message still instruct the model to use SendMessage",
  },
  {
    t: "blast",
    event: "six-mechanisms",
    sixMechanismsGone: true,
    notifyWhenIdleGone: true,
    sendMessageCut: true,
    listAgentsLists: true,
    desktopLauncher: true,
    cue: "strowger",
    note: "Six mechanisms that all route through SendMessage / notify_when_idle are silently gone",
  },
  {
    t: "control",
    event: "cli-still-has-tool",
    cliStillHasTool: true,
    launcherOnly: true,
    desktopLauncher: true,
    cue: "strowger",
    note: "Not a binary regression: bundled 2.1.260/claude.exe in CLI mode still returns 44 tools including SendMessage",
  },
  {
    t: "cut",
    event: "strowger",
    trunked: false,
    sendMessagePresent: false,
    peersAddressable: false,
    notifyWhenIdle: false,
    desktopLauncher: true,
    disallowedTools: true,
    listAgentsLists: true,
    sendMessageCut: true,
    sixMechanismsGone: true,
    cliStillHasTool: true,
    launcherOnly: true,
    cue: "strowger",
    note: "directory lists, trunk cut; score strowger",
  },
  {
    t: "path",
    event: "exchanged",
    exchanged: true,
    cue: "strowger",
    note: "when ListAgents still lists peers and documents SendMessage as the address but Desktop cut the trunk, exchanged never stays trunked",
  },
]);

function classifyFromSeed(seed) {
  if (seed && VERDICTS.includes(seed)) return seed;
  return null;
}

export function emptyTicket() {
  return {
    seed: IDLE_WORD,
    trunked: true,
    sendMessagePresent: true,
    peersAddressable: true,
    notifyWhenIdle: true,
    desktopLauncher: false,
    disallowedTools: false,
    listAgentsLists: false,
    sendMessageCut: false,
    sixMechanismsGone: false,
    notifyWhenIdleGone: false,
    cliStillHasTool: true,
    launcherOnly: false,
    exchanged: false,
    cue: "trunked",
  };
}

export function seedTrunked() {
  return { ...emptyTicket() };
}

export function seedStrowger() {
  return {
    seed: SEEDED_WORD,
    trunked: false,
    sendMessagePresent: false,
    peersAddressable: false,
    notifyWhenIdle: false,
    desktopLauncher: true,
    disallowedTools: true,
    listAgentsLists: true,
    sendMessageCut: true,
    sixMechanismsGone: true,
    notifyWhenIdleGone: true,
    cliStillHasTool: true,
    launcherOnly: true,
    cue: "strowger",
    issue: FEATURED_ISSUE,
  };
}

export function seedExchanged() {
  return {
    seed: PATH_WORD,
    preferSeed: true,
    exchanged: true,
    cue: "strowger",
  };
}

export function seedHold() {
  return {
    seed: "hold",
    preferSeed: true,
    trunked: true,
    sendMessagePresent: true,
    cue: "trunked",
  };
}

export function seedSendmessageCut() {
  return {
    seed: "sendmessage-cut",
    sendMessageCut: true,
    listAgentsLists: true,
    docsAdvertiseSendMessage: true,
    desktopLauncher: true,
    disallowedTools: true,
    cue: "strowger",
  };
}

export function seedListagentsLists() {
  return {
    seed: "listagents-lists",
    listAgentsLists: true,
    desktopLauncher: true,
    disallowedTools: true,
    cue: "strowger",
  };
}

export function seedDisallowedTools() {
  return {
    seed: "disallowed-tools",
    disallowedTools: true,
    desktopLauncher: true,
    flag: DISALLOWED_FLAG,
    cue: "strowger",
  };
}

export function seedNotifyWhenIdleGone() {
  return {
    seed: "notify-when-idle-gone",
    notifyWhenIdleGone: true,
    sixMechanismsGone: true,
    sendMessageCut: true,
    cue: "strowger",
  };
}

export function seedSixMechanisms() {
  return {
    seed: "six-mechanisms",
    sixMechanismsGone: true,
    notifyWhenIdleGone: true,
    sendMessageCut: true,
    listAgentsLists: true,
    desktopLauncher: true,
    cue: "strowger",
  };
}

export function seedLauncherOnly() {
  return {
    seed: "launcher-only",
    launcherOnly: true,
    desktopLauncher: true,
    cliStillHasTool: true,
    cue: "strowger",
  };
}

export function seedCliStillHasTool() {
  return {
    seed: "cli-still-has-tool",
    cliStillHasTool: true,
    launcherOnly: true,
    desktopLauncher: true,
    cue: "strowger",
  };
}

export function normalizeBooth(raw) {
  if (!raw || typeof raw !== "object") {
    return {
      trunked: false,
      sendMessagePresent: false,
      peersAddressable: false,
      notifyWhenIdle: false,
      desktopLauncher: false,
      disallowedTools: false,
      listAgentsLists: false,
      sendMessageCut: false,
      sixMechanismsGone: false,
      notifyWhenIdleGone: false,
      cliStillHasTool: false,
      launcherOnly: false,
      docsAdvertiseSendMessage: false,
      exchanged: false,
      flag: null,
      peers: null,
      cue: null,
      event: null,
      t: null,
    };
  }
  return {
    trunked: raw.trunked === true,
    sendMessagePresent: raw.sendMessagePresent === true,
    peersAddressable: raw.peersAddressable === true,
    notifyWhenIdle: raw.notifyWhenIdle === true,
    desktopLauncher: raw.desktopLauncher === true,
    disallowedTools: raw.disallowedTools === true,
    listAgentsLists: raw.listAgentsLists === true,
    sendMessageCut: raw.sendMessageCut === true,
    sixMechanismsGone: raw.sixMechanismsGone === true,
    notifyWhenIdleGone: raw.notifyWhenIdleGone === true,
    cliStillHasTool: raw.cliStillHasTool === true,
    launcherOnly: raw.launcherOnly === true,
    docsAdvertiseSendMessage: raw.docsAdvertiseSendMessage === true,
    exchanged: raw.exchanged === true,
    flag: raw.flag || null,
    peers: raw.peers || null,
    cue: raw.cue || null,
    event: raw.event || raw.kind || null,
    t: raw.t || raw.time || null,
  };
}

function hasBoothFields(ticket) {
  return Boolean(
    ticket &&
      (ticket.trunked != null ||
        ticket.sendMessagePresent != null ||
        ticket.peersAddressable != null ||
        ticket.notifyWhenIdle != null ||
        ticket.desktopLauncher != null ||
        ticket.disallowedTools != null ||
        ticket.listAgentsLists != null ||
        ticket.sendMessageCut != null ||
        ticket.sixMechanismsGone != null ||
        ticket.notifyWhenIdleGone != null ||
        ticket.cliStillHasTool != null ||
        ticket.launcherOnly != null ||
        ticket.exchanged != null ||
        ticket.cue != null ||
        ticket.event),
  );
}

function isTrunked(row) {
  if (row.exchanged) return false;
  if (row.cue === "strowger") return false;
  if (row.sendMessageCut && row.listAgentsLists) return false;
  if (row.disallowedTools && row.desktopLauncher && row.trunked !== true) {
    return false;
  }
  if (
    row.trunked === true &&
    row.sendMessagePresent === true &&
    row.cue !== "strowger"
  ) {
    return true;
  }
  if (
    row.cue === "trunked" &&
    row.sendMessageCut !== true &&
    row.disallowedTools !== true
  ) {
    return true;
  }
  return false;
}

function isStrowger(row) {
  if (row.exchanged && row.cue !== "trunked") return false;
  if (row.cue === "strowger") return true;
  if (row.sendMessageCut && row.listAgentsLists && row.disallowedTools) {
    return true;
  }
  if (row.desktopLauncher && row.disallowedTools && row.sixMechanismsGone) {
    return true;
  }
  if (row.sixMechanismsGone && row.listAgentsLists) return true;
  if (row.desktopLauncher && row.listAgentsLists && row.sendMessageCut) {
    return true;
  }
  return false;
}

function isExchangedPath(row) {
  return row.exchanged === true && !isTrunked(row);
}

/**
 * Score one exchange pass against the strowger booth.
 * trunked: SendMessage present; peers addressable; notify_when_idle works.
 * strowger: Desktop --disallowedTools SendMessage; ListAgents still lists.
 * exchanged: named path — directory lists, trunk cut, score the drift.
 */
export function scoreGate(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const row = normalizeBooth(ticket);
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);

  let verdict = IDLE_WORD;
  if (isExchangedPath(row)) {
    verdict = "exchanged";
  } else if (isStrowger(row)) {
    verdict = "strowger";
  } else if (isTrunked(row)) {
    verdict = "trunked";
  } else if (
    row.sendMessageCut ||
    row.listAgentsLists ||
    row.disallowedTools ||
    row.sixMechanismsGone ||
    row.notifyWhenIdleGone ||
    (row.desktopLauncher && row.cliStillHasTool)
  ) {
    verdict = "strowger";
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
    trunked: verdict === "trunked",
    strowger: verdict === "strowger" || verdict === SEEDED_WORD,
    exchanged: verdict === "exchanged" || verdict === PATH_WORD,
    sendMessagePresent: row.sendMessagePresent,
    peersAddressable: row.peersAddressable,
    notifyWhenIdle: row.notifyWhenIdle,
    desktopLauncher: row.desktopLauncher,
    disallowedTools: row.disallowedTools,
    listAgentsLists: row.listAgentsLists,
    sendMessageCut: row.sendMessageCut,
    sixMechanismsGone: row.sixMechanismsGone,
    notifyWhenIdleGone: row.notifyWhenIdleGone,
    cliStillHasTool: row.cliStillHasTool,
    launcherOnly: row.launcherOnly,
    docsAdvertiseSendMessage: row.docsAdvertiseSendMessage,
    flag: row.flag,
    peers: row.peers,
    cue: hold ? "trunked" : "strowger",
    event: row.event,
    t: row.t,
    phrase: hold ? "admit trunked" : "score strowger",
  };
}

export function scoreWalk(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const rows = Array.isArray(ticket.rows)
    ? ticket.rows
    : Array.isArray(ticket.walk)
      ? ticket.walk
      : STROWGER_WALK;
  const scored = rows.map((row) => ({
    ...normalizeBooth(row),
    ...scoreGate({ ...row, preferSeed: false }),
  }));
  const strowger = scored.filter((row) => row.verdict === "strowger");
  const exchanged = scored.filter((row) => row.verdict === "exchanged");
  const trunked = scored.filter((row) => row.verdict === "trunked");
  const headline =
    scored.find((row) => row.event === "strowger") ||
    scored.find((row) => row.event === "six-mechanisms") ||
    scored.find((row) => row.event === "sendmessage-cut") ||
    scored.find((row) => row.event === "exchanged") ||
    strowger[strowger.length - 1];
  let verdict = "trunked";
  if (strowger.length) verdict = "strowger";
  else if (exchanged.length && !trunked.length) verdict = "exchanged";
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
    strowgerCount: strowger.length,
    exchangedCount: exchanged.length,
    trunkedCount: trunked.length,
    headline,
    rows: scored,
    phrase: HOLD.includes(verdict) ? "admit trunked" : "score strowger",
    note: headline
      ? "Desktop --disallowedTools SendMessage; ListAgents still lists peers and documents SendMessage as the address; six mechanisms dead."
      : "published strowger walk scored against trunked vs strowger",
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
    seeded !== "trunked" &&
    seeded !== "strowger" &&
    seeded !== "exchanged" &&
    ticket.trunked == null &&
    ticket.desktopLauncher == null &&
    ticket.disallowedTools == null &&
    ticket.listAgentsLists == null &&
    ticket.sendMessageCut == null &&
    ticket.exchanged == null &&
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
    trunked: scored.trunked ?? false,
    sendMessagePresent: scored.sendMessagePresent ?? false,
    peersAddressable: scored.peersAddressable ?? false,
    notifyWhenIdle: scored.notifyWhenIdle ?? false,
    desktopLauncher: scored.desktopLauncher ?? false,
    disallowedTools: scored.disallowedTools ?? false,
    listAgentsLists: scored.listAgentsLists ?? false,
    sendMessageCut: scored.sendMessageCut ?? false,
    sixMechanismsGone: scored.sixMechanismsGone ?? false,
    notifyWhenIdleGone: scored.notifyWhenIdleGone ?? false,
    cliStillHasTool: scored.cliStillHasTool ?? false,
    launcherOnly: scored.launcherOnly ?? false,
  };
}

export function score(input) {
  return analyze(input).verdict;
}

export function fingerprint(input) {
  const result = analyze(input);
  return [
    result.verdict,
    result.desktopLauncher ? "launch=desktop" : "launch=cli",
    result.disallowedTools ? "flag=disallowed" : "flag=none",
    result.listAgentsLists ? "dir=lists" : "dir=quiet",
    result.sendMessageCut ? "trunk=cut" : "trunk=live",
    result.sixMechanismsGone ? "mech=six-dead" : "mech=intact",
    result.cliStillHasTool ? "cli=44" : "cli=none",
    result.cue === "trunked" ? "cue=trunked" : "cue=strowger",
  ].join("|");
}

export function handle(input) {
  const result = analyze(input);
  const exchange = compareExchange({
    desktopLauncher: result.desktopLauncher,
    disallowedTools: result.disallowedTools,
    cliStillHasTool: result.cliStillHasTool !== false,
  });
  return {
    ...result,
    fingerprint: fingerprint(input),
    exchange,
    directory: readDirectory(),
    mechanisms: SIX_MECHANISMS.map((row) => ({
      ...row,
      dead: result.sixMechanismsGone === true || result.verdict === "strowger",
    })),
    published: {
      issue: FEATURED_ISSUE,
      url: ISSUE_URL,
      title: TITLE,
      state: STATE,
      labels: [...LABELS],
      author: AUTHOR,
      filed: FILED,
      lastWorking: LAST_WORKING,
      firstBroken: FIRST_BROKEN,
      desktopVersion: DESKTOP_VERSION,
      bundledVersions: [...BUNDLED_VERSIONS],
      standaloneCli: STANDALONE_CLI,
      cliToolCount: CLI_TOOL_COUNT,
      disallowedFlag: DISALLOWED_FLAG,
      surface: SURFACE,
      denyMessage: DENY_MESSAGE,
      runtimeError: RUNTIME_ERROR,
      listAgentsDescription: LISTAGENTS_DESCRIPTION,
      completionHint: COMPLETION_HINT,
      peers: PEER_DIRECTORY,
      mechanisms: SIX_MECHANISMS,
      fingerprintLines: [...FINGERPRINT_LINES],
      cousins: COUSINS.map((row) => row.issue),
      backups: BACKUPS.map((row) => row.issue),
      phrase: PHRASE,
      expected: [
        "desktop sessions can address what ListAgents already lists",
        "notify_when_idle stays reachable even if outbound SendMessage is limited",
        "if the block is intended, ListAgents / Agent docs / completion hints must not point at a disabled tool",
        "CHANGELOG the desktop-vs-CLI capability difference",
      ],
      hypothesis:
        "NON-BINDING: the Desktop launcher injects --disallowedTools SendMessage (plus a permission-layer auto-deny) while leaving ListAgents, the Agent tool description, and every subagent completion message pointing at SendMessage; the same bundled binary started in CLI mode still exposes the tool",
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
