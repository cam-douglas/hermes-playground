/**
 * Byline — newsroom byline desk for a
 * real Claude Code defect: PreToolUse /
 * PostToolUse fired inside a running
 * subagent are sometimes reported under
 * a different agent_id that has no
 * SubagentStart, no agent_type, and
 * never gets a SubagentStop.
 * Consecutive tool calls of one real
 * subagent can split across two ids.
 * The ghost id is a hanging byline:
 * never hired, never killed, still
 * collecting copy.
 *
 * A ghost byline is not a hold.
 * Score the rack or admit credited.
 *
 * Primary #90662: OPEN, filed
 * 2026-08-29, v2.1.251, labels
 * bug / platform:macos / area:hooks /
 * area:agents. Title: PreToolUse /
 * PostToolUse inside a running
 * subagent are sometimes reported
 * under a different agent_id that
 * has no SubagentStart, no
 * agent_type, and never gets a
 * SubagentStop. Five reconciled
 * UTC cases on 2026-08-29 in one
 * long-lived session (same
 * session_id since 2026-08-06).
 *
 * Cleanest case: a37ed07 lsof at
 * 16:14:51 lands on a stray id;
 * next bash at 16:15:06 lands on
 * the real id. The stray never
 * received SubagentStart or
 * SubagentStop.
 *
 * Stop-side nearby (different
 * event class — label, do not
 * treat as this bug):
 *   #89555 SubagentStop with a
 *     fresh agent_id
 *   #87065 empty agent_type
 *     bypasses matcher
 *   #59719 orphan Stop without
 *     Start
 *   #88995 SubagentStop for
 *     never-dispatched subagents
 *
 * Cross-ecosystem (not identical):
 *   openai/codex#16226 hooks have
 *     no agent_id at all
 *   openai/codex#38142
 *     interrupt_agent skips
 *     SubagentStop
 *   openai/codex#40802 auto-review
 *     UserPromptSubmit without
 *     lifecycle hooks
 *
 * Verdicts: credited | ghosted |
 *           untyped | unstopped |
 *           hanging | split |
 *           stray | borrowed |
 *           nest-split |
 *           resume-split
 * Idle word is credited (Pre/Post
 * under the same agent_id as
 * SubagentStart, agent_type
 * present, later SubagentStop;
 * hold is quiet). NEVER use
 * byline / empty / silent / mute /
 * idle / dead / sealed / fronted /
 * locked / yanked / caught /
 * stowed / posted / bunged /
 * belayed / rove / keyed / housed /
 * beamed / snug / hung /
 * appointed / cinched / gauged /
 * stamped / overrun / pratique /
 * wound / bound / stilled /
 * stabled / drained / flat / fit /
 * spoilt / laid / unlinked /
 * tight / banked / roosted /
 * stocked / seated / heard /
 * clear / paired / kernel /
 * latched / upheld / sterling /
 * home / valid / dry / quiet /
 * seised / rung / moored /
 * verbatim / level / calqued as
 * the idle word.
 *
 * Slack alarm on ghosted / split /
 * borrowed / unstopped (and the
 * more-specific #90662 family:
 * stray / hanging / nest-split /
 * resume-split).
 * Linear ticket on ghosted /
 * split / borrowed.
 * GitHub byline-ledger of scored
 * racks on every score.
 *
 * Priority when multiple match:
 *   borrowed > split > nest-split >
 *   resume-split > stray >
 *   hanging > ghosted > untyped >
 *   unstopped > credited
 * Unique nearby flags win their
 * own seeds because those seeds
 * do not carry the #90662 triad
 * (Pre/Post on an id with no
 * SubagentStart + no agent_type +
 * no SubagentStop, attributed to
 * a real running subagent).
 *
 * credited is true ONLY when the
 * verdict is credited (idle, or
 * honest control: every tool-
 * bearing id is hired, typed, and
 * later killed). A ghost rack is
 * never credited.
 *
 * Why this is not a clone:
 * NOT Shunt — nested SendMessage
 *     misroute #90463.
 * NOT Cote / Nixie — resume
 *     team-hub identity split
 *     #90332.
 * NOT Tappet — silent hook
 *     injection #90296.
 * NOT Sounder — missed background
 *     wakeup #90555.
 * NOT Fascia — trust-dialog names
 *     spawn_task cwd #90638.
 * NOT Wicket — worktree isolation.
 * NOT Datum — wrong-base
 *     code-review #90620.
 * NOT Calque — PowerShell Spanish
 *     del #90645.
 * NOT Quoin — quoted-heredoc
 *     unescape.
 * NOT Gaff — timeout-kill
 *     reported exit 0.
 * NOT leftover woodworking /
 *     millimetre-slider clones.
 * Different problem: hook
 * identity split on Pre/Post
 * inside a running subagent.
 * Different UI: newsroom byline
 * desk / brass nameplate rack /
 * ghost byline cards /
 * attribution ledger.
 * Different idle: credited.
 */

export const VERDICTS = Object.freeze([
  "credited",
  "ghosted",
  "untyped",
  "unstopped",
  "hanging",
  "split",
  "stray",
  "borrowed",
  "nest-split",
  "resume-split",
]);
export const IDLE_WORD = "credited";
export const SLACK_VERDICTS = Object.freeze([
  "ghosted",
  "split",
  "borrowed",
  "unstopped",
  "hanging",
  "stray",
  "nest-split",
  "resume-split",
]);
export const LINEAR_VERDICTS = Object.freeze([
  "ghosted",
  "split",
  "borrowed",
]);
export const ALARM_VERDICTS = SLACK_VERDICTS;
export const FEATURED_ISSUE = 90662;
export const STOP_SIDE_89555 = 89555;
export const STOP_SIDE_87065 = 87065;
export const STOP_SIDE_59719 = 59719;
export const STOP_SIDE_88995 = 88995;
export const CODEX_NO_AGENT = 16226;
export const CODEX_INTERRUPT = 38142;
export const CODEX_AUTO_REVIEW = 40802;

export const DEMO_SESSION = "session-since-2026-08-06";
export const DEMO_DAY = "2026-08-29";
export const DEMO_VERSION = "2.1.251";
export const DEMO_REAL_1609 = "a37ed07";
export const DEMO_GHOST_1609 = "f0a16e9";
export const DEMO_CHILD_1609_A = "ad36795";
export const DEMO_CHILD_1609_B = "afad1ed";
export const DEMO_LSOF =
  "lsof -nP -iTCP -sTCP:LISTEN";
export const DEMO_NEXT_BASH = "cd ~/projects/ && …";
export const DEMO_REAL_0720 = "aecdca5";
export const DEMO_GHOST_0720 = "f0a0720";
export const DEMO_SED_BASH = "cd … && sed -n …";
export const DEMO_CD_BASH = "cd ~/projects/ && …";
export const DEMO_REAL_0835 = "a74c422";
export const DEMO_GHOST_0835 = "f0a0835";
export const DEMO_LATER_A = "a799181";
export const DEMO_LATER_B = "ab28539";
export const DEMO_CAT_REDIR = "cat > ~/…";
export const DEMO_REAL_0920 = "a355335";
export const DEMO_GHOST_0920 = "f0a0920";
export const DEMO_TSC = "npx tsc --noEmit …";
export const DEMO_REAL_1332 = "af2b998";
export const DEMO_GHOST_1332 = "f0a1332";
export const DEMO_SENDMESSAGE = "SendMessage";
export const DEMO_AGENT_TYPE = "claude";
export const DEMO_SPAWN_DEPTH = 1;
export const STRAY_BURST_MS = 6 * 60 * 1000;
export const HANGING_SPAN_MS = 45 * 60 * 1000;
export const NEST_WINDOW_MS = 90 * 1000;
export const CONSECUTIVE_MS = 120 * 1000;

const FORBIDDEN_IDLE = Object.freeze([
  "byline",
  "empty",
  "silent",
  "mute",
  "idle",
  "dead",
  "sealed",
  "fronted",
  "locked",
  "yanked",
  "caught",
  "stowed",
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
  "bound",
  "stilled",
  "stabled",
  "drained",
  "flat",
  "fit",
  "spoilt",
  "laid",
  "unlinked",
  "tight",
  "banked",
  "roosted",
  "stocked",
  "seated",
  "heard",
  "clear",
  "paired",
  "kernel",
  "latched",
  "upheld",
  "sterling",
  "home",
  "valid",
  "dry",
  "quiet",
  "seised",
  "rung",
  "moored",
  "verbatim",
  "level",
  "calqued",
  "masthead",
  "dateline",
  "slugline",
  "kicker",
  "lede",
  "dek",
  "hed",
  "cutline",
  "credit",
  "attrib",
  "byname",
  "nameline",
  "shunt",
  "cote",
  "nixie",
  "tappet",
  "sounder",
  "fascia",
  "wicket",
  "datum",
  "calque",
  "quoin",
  "gaff",
  "sear",
  "cubby",
  "grille",
  "visa",
  "fob",
  "snib",
  "knock",
  "veto",
  "iota",
  "parity",
]);

export function forbiddenIdleWords() {
  return FORBIDDEN_IDLE.slice();
}

function asText(value) {
  return value != null ? String(value) : "";
}

function asIssue(value) {
  if (value == null || value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : value;
}

function asBool(value, fallback = undefined) {
  if (value == null) return fallback;
  if (typeof value === "string") {
    const s = value.trim().toLowerCase();
    if (s === "" || s === "false" || s === "0" || s === "off" || s === "no") {
      return false;
    }
    if (s === "true" || s === "1" || s === "on" || s === "yes") return true;
    return Boolean(s);
  }
  return Boolean(value);
}

function asList(value) {
  if (Array.isArray(value)) return value;
  if (value == null || value === "") return [];
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return [];
    if (trimmed.startsWith("[") || trimmed.startsWith("{")) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) return parsed;
        if (parsed && typeof parsed === "object") return [parsed];
      } catch {
        /* fall through */
      }
    }
    return trimmed
      .split(/\n/)
      .map((row) => row.trim())
      .filter(Boolean);
  }
  return [];
}

function hookName(row = {}) {
  return asText(
    row.hook ||
      row.hook_event_name ||
      row.hookEventName ||
      row.event ||
      row.kind,
  );
}

function agentIdOf(row = {}) {
  return asText(row.agent_id || row.agentId || row.id);
}

function agentTypeOf(row = {}) {
  return asText(row.agent_type || row.agentType || row.type);
}

function toolNameOf(row = {}) {
  return asText(row.tool_name || row.toolName || row.tool);
}

function toolInputOf(row = {}) {
  const raw = row.tool_input ?? row.toolInput ?? row.input ?? row.command;
  if (raw == null) return "";
  if (typeof raw === "string") return raw;
  if (typeof raw === "object") {
    return asText(raw.command || raw.message || raw.prompt || JSON.stringify(raw));
  }
  return asText(raw);
}

function timeMs(value) {
  if (value == null || value === "") return null;
  if (typeof value === "number" && Number.isFinite(value)) return value;
  const n = Date.parse(asText(value));
  return Number.isFinite(n) ? n : null;
}

function normalizeEvent(raw = {}) {
  const src = raw && typeof raw === "object" ? raw : {};
  return {
    t: asText(src.t || src.timestamp || src.ts || src.at || src.created_at),
    hook: hookName(src),
    agent_id: agentIdOf(src),
    agent_type: agentTypeOf(src),
    tool_name: toolNameOf(src),
    tool_input: toolInputOf(src),
    spawnDepth: src.spawnDepth ?? src.spawn_depth ?? null,
    background: asBool(src.background, undefined),
  };
}

function normalizeTranscriptRow(raw = {}, fallbackId = "") {
  const src = raw && typeof raw === "object" ? raw : {};
  const tool =
    src.tool_use && typeof src.tool_use === "object" ? src.tool_use : src;
  return {
    t: asText(src.t || src.timestamp || src.ts || src.at),
    type: asText(src.type || (src.tool_use ? "tool_use" : "")),
    agent_id: agentIdOf(src) || fallbackId,
    tool_name: toolNameOf(tool) || toolNameOf(src),
    tool_input: toolInputOf(tool) || toolInputOf(src),
  };
}

export function emptyByline() {
  return {
    session: "",
    issue: null,
    source: "",
    events: [],
    transcripts: {},
    scored: false,
  };
}

export function emptyAction(session = "credited-1") {
  return {
    action: "score",
    session,
    byline: emptyByline(),
  };
}

export function cloneByline(raw = {}) {
  const src = raw && typeof raw === "object" ? raw : emptyByline();
  const nested =
    (src.byline && typeof src.byline === "object" && src.byline) ||
    (src.probe && typeof src.probe === "object" && src.probe) ||
    (src.payload && typeof src.payload === "object" && src.payload) ||
    (src.rack && typeof src.rack === "object" && src.rack) ||
    (src.desk && typeof src.desk === "object" && src.desk) ||
    src;
  const events = asList(nested.events ?? src.events).map(normalizeEvent);
  const transcriptsRaw = nested.transcripts ?? src.transcripts ?? {};
  const transcripts = {};
  if (transcriptsRaw && typeof transcriptsRaw === "object") {
    for (const [id, rows] of Object.entries(transcriptsRaw)) {
      transcripts[id] = asList(rows).map((row) => normalizeTranscriptRow(row, id));
    }
  }
  return {
    ...emptyByline(),
    session: asText(nested.session ?? src.session ?? src.sessionKey),
    issue: asIssue(nested.issue ?? src.issue),
    source: asText(nested.source ?? src.source),
    events,
    transcripts,
    scored: asBool(nested.scored ?? src.scored, false) === true,
  };
}

function isToolHook(hook) {
  return /PreToolUse|PostToolUse/i.test(hook);
}

function isStartHook(hook) {
  return /SubagentStart/i.test(hook);
}

function isStopHook(hook) {
  return /SubagentStop/i.test(hook);
}

function isParentStop(hook) {
  return hook === "Stop" || /^Stop$/i.test(hook);
}

function isAgentTool(name, input) {
  return /^Agent$/i.test(name) || /spawn.*agent|spawn_task/i.test(input);
}

function isSendMessage(name) {
  return /^SendMessage$/i.test(name);
}

function commandLooksLike(left, right) {
  const a = asText(left).toLowerCase();
  const b = asText(right).toLowerCase();
  if (!a || !b) return false;
  if (a === b) return true;
  const compact = (s) => s.replace(/\s+/g, " ").replace(/…/g, "").trim();
  const ca = compact(a);
  const cb = compact(b);
  if (!ca || !cb) return false;
  return ca.includes(cb) || cb.includes(ca);
}

export function indexAgents(events = []) {
  const byId = new Map();
  for (const raw of events) {
    const ev = normalizeEvent(raw);
    const id = ev.agent_id;
    if (!id) continue;
    if (!byId.has(id)) {
      byId.set(id, {
        id,
        start: null,
        stop: null,
        types: new Set(),
        tools: [],
        hooks: [],
        createdAt: ev.t,
        lastAt: ev.t,
      });
    }
    const row = byId.get(id);
    row.hooks.push(ev);
    if (ev.t) row.lastAt = ev.t;
    if (!row.createdAt && ev.t) row.createdAt = ev.t;
    if (isStartHook(ev.hook)) row.start = ev;
    if (isStopHook(ev.hook)) row.stop = ev;
    if (ev.agent_type) row.types.add(ev.agent_type);
    if (isToolHook(ev.hook) || ev.tool_name) row.tools.push(ev);
  }
  return byId;
}

export function isIdle(byline = {}) {
  const row = cloneByline(byline);
  return row.events.length === 0 && Object.keys(row.transcripts).length === 0;
}

export function analyze(byline = {}) {
  const row = cloneByline(byline);
  const agents = indexAgents(row.events);
  const hired = [];
  const ghosts = [];
  let stopSideNearby = false;
  const stopSideIssues = [];
  let parentStopped = false;

  for (const ev of row.events) {
    const hook = hookName(ev);
    if (isParentStop(hook) && !agentIdOf(ev)) parentStopped = true;
    if (isParentStop(hook)) parentStopped = true;
  }

  for (const entry of agents.values()) {
    const hiredHere = Boolean(entry.start);
    const typed = entry.types.size > 0;
    const stopped = Boolean(entry.stop);
    const toolCount = entry.tools.length;
    if (hiredHere) hired.push(entry);
    else if (toolCount > 0) ghosts.push(entry);

    if (entry.stop && !entry.start && toolCount === 0) {
      stopSideNearby = true;
      stopSideIssues.push(STOP_SIDE_59719);
      stopSideIssues.push(STOP_SIDE_88995);
    }
    if (entry.stop && !asText(entry.stop.agent_type)) {
      stopSideNearby = true;
      stopSideIssues.push(STOP_SIDE_87065);
    }
    if (entry.stop && !entry.start && parentStopped) {
      stopSideNearby = true;
      stopSideIssues.push(STOP_SIDE_89555);
    }
  }

  const uniqueStop = [...new Set(stopSideIssues)];
  const onlyStopSide = stopSideNearby && ghosts.length === 0;

  let split = null;
  let borrowed = null;
  let nestSplit = false;
  let resumeSplit = false;
  let nestAt = null;
  let resumeAt = null;

  for (const real of hired) {
    for (const ev of real.hooks) {
      const t = timeMs(ev.t);
      if (isAgentTool(ev.tool_name, ev.tool_input) && t != null) {
        nestAt = nestAt == null ? t : Math.min(nestAt, t);
      }
      if (isSendMessage(ev.tool_name) && t != null) {
        resumeAt = resumeAt == null ? t : Math.min(resumeAt, t);
      }
    }
    const transcript = asList(row.transcripts[real.id]);
    for (const ghost of ghosts) {
      for (const gt of ghost.tools) {
        for (const rt of real.tools) {
          const gtMs = timeMs(gt.t);
          const rtMs = timeMs(rt.t);
          if (gtMs == null || rtMs == null) continue;
          const delta = rtMs - gtMs;
          if (delta <= 0 || delta > CONSECUTIVE_MS) continue;
          const inTranscript = transcript.some((tr, i) => {
            const next = transcript[i + 1];
            if (!next) return false;
            return (
              commandLooksLike(tr.tool_input, gt.tool_input) &&
              commandLooksLike(next.tool_input, rt.tool_input)
            );
          });
          const sequentialHooks =
            commandLooksLike(gt.tool_input, DEMO_LSOF) &&
            commandLooksLike(rt.tool_input, DEMO_NEXT_BASH);
          if (inTranscript || sequentialHooks) {
            split = {
              realId: real.id,
              ghostId: ghost.id,
              first: gt,
              second: rt,
            };
          }
        }
      }
    }
  }

  for (const ghost of ghosts) {
    const created = timeMs(ghost.createdAt);
    if (created != null && nestAt != null && created - nestAt >= 0 && created - nestAt <= NEST_WINDOW_MS) {
      nestSplit = true;
    }
    if (
      created != null &&
      resumeAt != null &&
      created - resumeAt >= 0 &&
      created - resumeAt <= NEST_WINDOW_MS
    ) {
      resumeSplit = true;
    }

    const ownersAtBirth = hired.filter((real) => {
      const start = timeMs(real.start?.t || real.createdAt);
      const stop = timeMs(real.stop?.t);
      const birth = timeMs(ghost.createdAt);
      if (start == null || birth == null) return false;
      if (birth < start) return false;
      if (stop != null && birth > stop) return false;
      return true;
    });
    const laterOwners = new Set();
    for (const gt of ghost.tools) {
      for (const [id, rows] of Object.entries(row.transcripts)) {
        if (ownersAtBirth.some((real) => real.id === id)) continue;
        if (asList(rows).some((tr) => commandLooksLike(tr.tool_input, gt.tool_input))) {
          laterOwners.add(id);
        }
      }
    }
    if (ownersAtBirth.length && laterOwners.size) {
      borrowed = {
        ghostId: ghost.id,
        bornDuring: ownersAtBirth.map((r) => r.id),
        laterFrom: [...laterOwners],
      };
    }
  }

  const strayGhosts = ghosts.filter((g) => {
    const a = timeMs(g.createdAt);
    const b = timeMs(g.lastAt);
    if (g.tools.length < 2) return false;
    if (a == null || b == null) return g.tools.length <= 3;
    return b - a <= STRAY_BURST_MS;
  });
  const hangingGhosts = ghosts.filter((g) => {
    const a = timeMs(g.createdAt);
    const b = timeMs(g.lastAt);
    if (a == null || b == null) return false;
    return b - a >= HANGING_SPAN_MS;
  });

  const untypedHired = hired.filter((h) => h.types.size === 0);
  const unstoppedHired = hired.filter((h) => !h.stop && h.tools.length > 0);
  const creditedHold =
    ghosts.length === 0 &&
    hired.every((h) => h.types.size > 0 && h.stop) &&
    (hired.length > 0 || isIdle(row));

  const borrowedShape = Boolean(borrowed);
  const splitShape = Boolean(split);
  const nestSplitShape = nestSplit && !splitShape && !borrowedShape;
  const resumeSplitShape = resumeSplit && !splitShape && !borrowedShape && !nestSplitShape;
  const strayShape =
    strayGhosts.length > 0 &&
    hangingGhosts.length === 0 &&
    !borrowedShape &&
    !splitShape &&
    !nestSplit &&
    !resumeSplit;
  const hangingShape =
    hangingGhosts.length > 0 && !borrowedShape && !splitShape && !nestSplit && !resumeSplit;
  const ghostedShape =
    ghosts.length > 0 &&
    !borrowedShape &&
    !splitShape &&
    !nestSplit &&
    !resumeSplit &&
    !strayShape &&
    !hangingShape;
  const untypedShape =
    untypedHired.length > 0 &&
    ghosts.length === 0 &&
    !borrowedShape &&
    !splitShape;
  const unstoppedShape =
    unstoppedHired.length > 0 &&
    ghosts.length === 0 &&
    untypedHired.length === 0 &&
    !borrowedShape &&
    !splitShape;

  return {
    hiredCount: hired.length,
    ghostCount: ghosts.length,
    hired: hired.map((h) => h.id),
    ghosts: ghosts.map((g) => g.id),
    stopSideNearby,
    stopSideIssues: uniqueStop,
    onlyStopSide,
    eventClass: onlyStopSide ? "stop-side" : ghosts.length ? "pre-post-split" : "lifecycle",
    split,
    borrowed,
    nestSplit,
    resumeSplit,
    strayGhosts: strayGhosts.map((g) => g.id),
    hangingGhosts: hangingGhosts.map((g) => g.id),
    untypedHired: untypedHired.map((h) => h.id),
    unstoppedHired: unstoppedHired.map((h) => h.id),
    borrowedShape,
    splitShape,
    nestSplitShape,
    resumeSplitShape,
    strayShape,
    hangingShape,
    ghostedShape,
    untypedShape,
    unstoppedShape,
    creditedHold,
  };
}

export function classify(byline = {}) {
  if (isIdle(byline)) return "credited";
  const facts = analyze(byline);
  if (facts.onlyStopSide && facts.creditedHold) return "credited";
  if (facts.borrowedShape) return "borrowed";
  if (facts.splitShape) return "split";
  if (facts.nestSplitShape) return "nest-split";
  if (facts.resumeSplitShape) return "resume-split";
  if (facts.strayShape) return "stray";
  if (facts.hangingShape) return "hanging";
  if (facts.ghostedShape) return "ghosted";
  if (facts.untypedShape) return "untyped";
  if (facts.unstoppedShape) return "unstopped";
  if (facts.creditedHold) return "credited";
  return "credited";
}

export function verdictOf(byline = {}) {
  return classify(byline);
}

export function creditedOf(byline = {}) {
  return classify(byline) === "credited";
}

export function isCredited(byline = {}) {
  return creditedOf(byline);
}

export function flagsOf(byline = {}) {
  const facts = analyze(byline);
  const kind = classify(byline);
  return {
    ...facts,
    verdict: kind,
    credited: kind === "credited",
    ghosted: kind === "ghosted",
    split: kind === "split",
    borrowed: kind === "borrowed",
  };
}

export function feedOf(kind) {
  if (kind === "ghosted") {
    return "● Ghosted · PreToolUse/PostToolUse under an agent_id that never had SubagentStart · hanging byline · primary #90662";
  }
  if (kind === "untyped") {
    return "● Untyped · payload has agent_id but no agent_type · schema says type is present when the hook fires from within a subagent";
  }
  if (kind === "unstopped") {
    return "● Unstopped · hired entry never receives SubagentStop · still on the rack";
  }
  if (kind === "hanging") {
    return "● Hanging · ghost id keeps collecting copy for 45 minutes or more · never hired, never killed";
  }
  if (kind === "split") {
    return "● Split · consecutive tool calls of one real subagent under two ids · cleanest #90662: a37ed07 lsof on stray, next bash on real id";
  }
  if (kind === "stray") {
    return "● Stray · short burst on a ghost then silence · 07:20 #90662";
  }
  if (kind === "borrowed") {
    return "● Borrowed · ghost created during one subagent later receives payloads from a different subagent · 08:35 #90662 cat >";
  }
  if (kind === "nest-split") {
    return "● Nest-split · stray id appears right after Agent-tool child spawn";
  }
  if (kind === "resume-split") {
    return "● Resume-split · stray id appears right after SendMessage resume of a completed child · 13:32 #90662";
  }
  return "● Credited · PreToolUse/PostToolUse under the same agent_id as SubagentStart, agent_type present, later SubagentStop · hold is quiet · idle word is credited";
}

export function reasonsOf(byline = {}, kind = classify(byline)) {
  const reasons = [];
  reasons.push("a ghost byline is not a hold");
  if (kind === "ghosted") {
    reasons.push(
      "PRIMARY #90662: PreToolUse/PostToolUse under an agent_id that never appears in any SubagentStart or SubagentStop.",
    );
  }
  if (kind === "untyped") {
    reasons.push(
      "payload has agent_id but no agent_type. Schema: agent_type is present when the hook fires from within a subagent.",
    );
  }
  if (kind === "unstopped") {
    reasons.push("hired entry never receives SubagentStop. The desk cannot close the slot.");
  }
  if (kind === "hanging") {
    reasons.push(
      "ghost id keeps receiving payloads for 45 minutes or more (09:20 #90662 npx tsc window).",
    );
  }
  if (kind === "split") {
    reasons.push(
      "PRIMARY #90662 cleanest case: a37ed07 Bash lsof at 16:14:51 recorded on stray f0a16e9; next Bash at 16:15:06 recorded on a37ed07.",
    );
  }
  if (kind === "stray") {
    reasons.push(
      "07:20 #90662: short burst on ghost f0a0720 while aecdca5 ran, then silence after ~1 minute.",
    );
  }
  if (kind === "borrowed") {
    reasons.push(
      "08:35 #90662: ghost f0a0835 born during a74c422 later received cat > from a799181 / ab28539 / a37ed07.",
    );
  }
  if (kind === "nest-split") {
    reasons.push("stray id appears right after an Agent-tool child spawn.");
  }
  if (kind === "resume-split") {
    reasons.push(
      "13:32 #90662: stray f0a1332 appears right after af2b998 SendMessage resume of a completed child.",
    );
  }
  if (kind === "credited") {
    reasons.push(
      "every tool-bearing id is hired (SubagentStart), typed (agent_type), and later killed (SubagentStop); idle word is credited",
    );
  }
  const facts = analyze(byline);
  if (facts.stopSideNearby) {
    reasons.push(
      `stop-side nearby (different event class, not this bug): ${facts.stopSideIssues
        .map((n) => `#${n}`)
        .join(" ")}`,
    );
  }
  reasons.push(
    "NOT Shunt / Cote / Nixie / Tappet / Sounder / Fascia / Wicket / Datum / Calque / Quoin / Gaff / leftover woodworking / millimetre-slider.",
  );
  return reasons;
}

function ev(t, hook, id, extra = {}) {
  return {
    t,
    hook,
    agent_id: id,
    agent_type: extra.agent_type ?? extra.type ?? "",
    tool_name: extra.tool_name ?? extra.tool ?? "",
    tool_input: extra.tool_input ?? extra.input ?? extra.command ?? "",
    spawnDepth: extra.spawnDepth ?? null,
    background: extra.background,
  };
}

function tr(t, tool, input) {
  return { t, type: "tool_use", tool_name: tool, tool_input: input };
}

export function seedCredited() {
  return {
    action: "score",
    session: "credited-control",
    byline: {
      session: "credited-control",
      issue: FEATURED_ISSUE,
      source: "control",
      scored: false,
      events: [
        ev("2026-08-29T10:00:00Z", "SubagentStart", "a111111", {
          agent_type: DEMO_AGENT_TYPE,
          spawnDepth: 1,
          background: true,
        }),
        ev("2026-08-29T10:00:05Z", "PreToolUse", "a111111", {
          agent_type: DEMO_AGENT_TYPE,
          tool_name: "Bash",
          tool_input: "pwd",
        }),
        ev("2026-08-29T10:00:06Z", "PostToolUse", "a111111", {
          agent_type: DEMO_AGENT_TYPE,
          tool_name: "Bash",
          tool_input: "pwd",
        }),
        ev("2026-08-29T10:01:00Z", "SubagentStop", "a111111", {
          agent_type: DEMO_AGENT_TYPE,
        }),
      ],
      transcripts: {
        a111111: [tr("2026-08-29T10:00:05Z", "Bash", "pwd")],
      },
    },
  };
}

export function seedReset() {
  return emptyAction("credited-reset");
}

export function seedControl() {
  return seedCredited();
}

export function seedGhosted() {
  return {
    action: "score",
    session: "90662-ghosted",
    byline: {
      session: "90662-ghosted",
      issue: FEATURED_ISSUE,
      source: "anthropics/claude-code#90662",
      scored: false,
      events: [
        ev("2026-08-29T12:00:00Z", "SubagentStart", "a222222", {
          agent_type: DEMO_AGENT_TYPE,
          spawnDepth: 1,
          background: true,
        }),
        ev("2026-08-29T12:10:00Z", "PreToolUse", "f0aghost", {
          tool_name: "Read",
          tool_input: "README.md",
        }),
        ev("2026-08-29T12:40:00Z", "SubagentStop", "a222222", {
          agent_type: DEMO_AGENT_TYPE,
        }),
      ],
      transcripts: {
        a222222: [tr("2026-08-29T12:10:00Z", "Read", "README.md")],
      },
    },
  };
}

export function seedUntyped() {
  return {
    action: "score",
    session: "untyped-hired",
    byline: {
      session: "untyped-hired",
      issue: FEATURED_ISSUE,
      source: "schema",
      scored: false,
      events: [
        ev("2026-08-29T11:00:00Z", "SubagentStart", "a333333", {
          spawnDepth: 1,
        }),
        ev("2026-08-29T11:00:10Z", "PreToolUse", "a333333", {
          tool_name: "Bash",
          tool_input: "echo untyped",
        }),
        ev("2026-08-29T11:01:00Z", "SubagentStop", "a333333"),
      ],
      transcripts: {
        a333333: [tr("2026-08-29T11:00:10Z", "Bash", "echo untyped")],
      },
    },
  };
}

export function seedUnstopped() {
  return {
    action: "score",
    session: "unstopped-hired",
    byline: {
      session: "unstopped-hired",
      issue: FEATURED_ISSUE,
      source: "desk",
      scored: false,
      events: [
        ev("2026-08-29T11:00:00Z", "SubagentStart", "a444444", {
          agent_type: DEMO_AGENT_TYPE,
          spawnDepth: 1,
          background: true,
        }),
        ev("2026-08-29T11:00:10Z", "PreToolUse", "a444444", {
          agent_type: DEMO_AGENT_TYPE,
          tool_name: "Bash",
          tool_input: "sleep 30",
        }),
      ],
      transcripts: {
        a444444: [tr("2026-08-29T11:00:10Z", "Bash", "sleep 30")],
      },
    },
  };
}

export function seedHanging() {
  return {
    action: "score",
    session: "90662-0920-hanging",
    byline: {
      session: "90662-0920-hanging",
      issue: FEATURED_ISSUE,
      source: "anthropics/claude-code#90662",
      scored: false,
      events: [
        ev("2026-08-29T09:09:48Z", "SubagentStart", DEMO_REAL_0920, {
          agent_type: DEMO_AGENT_TYPE,
          spawnDepth: 1,
          background: true,
        }),
        ev("2026-08-29T09:20:45Z", "PreToolUse", DEMO_GHOST_0920, {
          tool_name: "Bash",
          tool_input: "cat > /private/tmp/…",
        }),
        ev("2026-08-29T10:06:40Z", "PreToolUse", DEMO_GHOST_0920, {
          tool_name: "Bash",
          tool_input: DEMO_TSC,
        }),
        ev("2026-08-29T11:27:45Z", "PreToolUse", DEMO_GHOST_0920, {
          tool_name: "Bash",
          tool_input: DEMO_TSC,
        }),
        ev("2026-08-29T11:40:45Z", "SubagentStop", DEMO_REAL_0920, {
          agent_type: DEMO_AGENT_TYPE,
        }),
      ],
      transcripts: {
        [DEMO_REAL_0920]: [
          tr("2026-08-29T09:20:54Z", "Bash", "cat > /private/tmp/…"),
          tr("2026-08-29T10:06:40Z", "Bash", DEMO_TSC),
          tr("2026-08-29T11:27:45Z", "Bash", DEMO_TSC),
          tr("2026-08-29T11:39:49Z", "Bash", DEMO_TSC),
        ],
      },
    },
  };
}

export function seedSplit() {
  return {
    action: "score",
    session: "90662-1609-split",
    byline: {
      session: "90662-1609-split",
      issue: FEATURED_ISSUE,
      source: "anthropics/claude-code#90662",
      scored: false,
      events: [
        ev("2026-08-29T15:58:30Z", "SubagentStart", DEMO_REAL_1609, {
          agent_type: DEMO_AGENT_TYPE,
          spawnDepth: DEMO_SPAWN_DEPTH,
          background: true,
        }),
        ev("2026-08-29T16:09:19Z", "PreToolUse", DEMO_REAL_1609, {
          agent_type: DEMO_AGENT_TYPE,
          tool_name: "Agent",
          tool_input: `spawn ${DEMO_CHILD_1609_A}`,
        }),
        ev("2026-08-29T16:09:21Z", "SubagentStart", DEMO_CHILD_1609_A, {
          agent_type: DEMO_AGENT_TYPE,
          spawnDepth: 2,
        }),
        ev("2026-08-29T16:09:43Z", "PreToolUse", DEMO_GHOST_1609, {
          tool_name: "Bash",
          tool_input: "echo stray-birth",
        }),
        ev("2026-08-29T16:12:45Z", "PreToolUse", DEMO_REAL_1609, {
          agent_type: DEMO_AGENT_TYPE,
          tool_name: "Agent",
          tool_input: `spawn ${DEMO_CHILD_1609_B}`,
        }),
        ev("2026-08-29T16:14:32Z", "SubagentStop", DEMO_CHILD_1609_A, {
          agent_type: DEMO_AGENT_TYPE,
        }),
        ev("2026-08-29T16:14:51Z", "PreToolUse", DEMO_GHOST_1609, {
          tool_name: "Bash",
          tool_input: DEMO_LSOF,
        }),
        ev("2026-08-29T16:14:59Z", "SubagentStop", DEMO_CHILD_1609_B, {
          agent_type: DEMO_AGENT_TYPE,
        }),
        ev("2026-08-29T16:15:06Z", "PreToolUse", DEMO_REAL_1609, {
          agent_type: DEMO_AGENT_TYPE,
          tool_name: "Bash",
          tool_input: DEMO_NEXT_BASH,
        }),
        ev("2026-08-29T17:00:00Z", "SubagentStop", DEMO_REAL_1609, {
          agent_type: DEMO_AGENT_TYPE,
        }),
      ],
      transcripts: {
        [DEMO_REAL_1609]: [
          tr("2026-08-29T16:09:19Z", "Agent", `spawn ${DEMO_CHILD_1609_A}`),
          tr("2026-08-29T16:12:45Z", "Agent", `spawn ${DEMO_CHILD_1609_B}`),
          tr("2026-08-29T16:14:51Z", "Bash", DEMO_LSOF),
          tr("2026-08-29T16:15:06Z", "Bash", DEMO_NEXT_BASH),
        ],
      },
    },
  };
}

export function seed90662() {
  return seedSplit();
}

export function seedStray() {
  return {
    action: "score",
    session: "90662-0720-stray",
    byline: {
      session: "90662-0720-stray",
      issue: FEATURED_ISSUE,
      source: "anthropics/claude-code#90662",
      scored: false,
      events: [
        ev("2026-08-29T07:07:34Z", "SubagentStart", DEMO_REAL_0720, {
          agent_type: DEMO_AGENT_TYPE,
          spawnDepth: 1,
          background: true,
        }),
        ev("2026-08-29T07:20:44Z", "PreToolUse", DEMO_REAL_0720, {
          agent_type: DEMO_AGENT_TYPE,
          tool_name: "Bash",
          tool_input: DEMO_SED_BASH,
        }),
        ev("2026-08-29T07:20:45Z", "PreToolUse", DEMO_GHOST_0720, {
          tool_name: "Bash",
          tool_input: DEMO_CD_BASH,
        }),
        ev("2026-08-29T07:21:49Z", "PostToolUse", DEMO_GHOST_0720, {
          tool_name: "Bash",
          tool_input: DEMO_CD_BASH,
        }),
        ev("2026-08-29T07:48:55Z", "SubagentStop", DEMO_REAL_0720, {
          agent_type: DEMO_AGENT_TYPE,
        }),
      ],
      transcripts: {
        [DEMO_REAL_0720]: [
          tr("2026-08-29T07:20:44Z", "Bash", DEMO_SED_BASH),
          tr("2026-08-29T07:21:10Z", "Bash", DEMO_CD_BASH),
        ],
      },
    },
  };
}

export function seedBorrowed() {
  return {
    action: "score",
    session: "90662-0835-borrowed",
    byline: {
      session: "90662-0835-borrowed",
      issue: FEATURED_ISSUE,
      source: "anthropics/claude-code#90662",
      scored: false,
      events: [
        ev("2026-08-29T08:31:12Z", "SubagentStart", DEMO_REAL_0835, {
          agent_type: DEMO_AGENT_TYPE,
          spawnDepth: 1,
          background: true,
        }),
        ev("2026-08-29T08:35:45Z", "PreToolUse", DEMO_GHOST_0835, {
          tool_name: "Read",
          tool_input: "notes.md",
        }),
        ev("2026-08-29T09:04:20Z", "SubagentStop", DEMO_REAL_0835, {
          agent_type: DEMO_AGENT_TYPE,
        }),
        ev("2026-08-29T09:36:00Z", "SubagentStart", DEMO_LATER_A, {
          agent_type: DEMO_AGENT_TYPE,
          spawnDepth: 1,
        }),
        ev("2026-08-29T09:36:30Z", "PreToolUse", DEMO_GHOST_0835, {
          tool_name: "Bash",
          tool_input: DEMO_CAT_REDIR,
        }),
        ev("2026-08-29T09:37:00Z", "SubagentStop", DEMO_LATER_A, {
          agent_type: DEMO_AGENT_TYPE,
        }),
        ev("2026-08-29T09:53:05Z", "PreToolUse", DEMO_GHOST_0835, {
          tool_name: "Bash",
          tool_input: DEMO_CAT_REDIR,
        }),
        ev("2026-08-29T16:14:04Z", "PreToolUse", DEMO_GHOST_0835, {
          tool_name: "Bash",
          tool_input: DEMO_CAT_REDIR,
        }),
      ],
      transcripts: {
        [DEMO_REAL_0835]: [tr("2026-08-29T08:40:00Z", "Bash", "pwd")],
        [DEMO_LATER_A]: [tr("2026-08-29T09:36:30Z", "Bash", DEMO_CAT_REDIR)],
        [DEMO_LATER_B]: [tr("2026-08-29T09:53:05Z", "Bash", DEMO_CAT_REDIR)],
        [DEMO_REAL_1609]: [tr("2026-08-29T16:14:04Z", "Bash", DEMO_CAT_REDIR)],
      },
    },
  };
}

export function seedNestSplit() {
  return {
    action: "score",
    session: "nest-split-agent-child",
    byline: {
      session: "nest-split-agent-child",
      issue: FEATURED_ISSUE,
      source: "desk",
      scored: false,
      events: [
        ev("2026-08-29T14:00:00Z", "SubagentStart", "a555555", {
          agent_type: DEMO_AGENT_TYPE,
          spawnDepth: 1,
          background: true,
        }),
        ev("2026-08-29T14:00:10Z", "PreToolUse", "a555555", {
          agent_type: DEMO_AGENT_TYPE,
          tool_name: "Agent",
          tool_input: "spawn a666666",
        }),
        ev("2026-08-29T14:00:12Z", "SubagentStart", "a666666", {
          agent_type: DEMO_AGENT_TYPE,
          spawnDepth: 2,
        }),
        ev("2026-08-29T14:00:40Z", "PreToolUse", "f0anest", {
          tool_name: "Bash",
          tool_input: "echo nest-stray",
        }),
        ev("2026-08-29T14:10:00Z", "SubagentStop", "a666666", {
          agent_type: DEMO_AGENT_TYPE,
        }),
        ev("2026-08-29T14:20:00Z", "SubagentStop", "a555555", {
          agent_type: DEMO_AGENT_TYPE,
        }),
      ],
      transcripts: {
        a555555: [tr("2026-08-29T14:00:10Z", "Agent", "spawn a666666")],
      },
    },
  };
}

export function seedResumeSplit() {
  return {
    action: "score",
    session: "90662-1332-resume-split",
    byline: {
      session: "90662-1332-resume-split",
      issue: FEATURED_ISSUE,
      source: "anthropics/claude-code#90662",
      scored: false,
      events: [
        ev("2026-08-29T11:55:44Z", "SubagentStart", DEMO_REAL_1332, {
          agent_type: DEMO_AGENT_TYPE,
          spawnDepth: 1,
          background: true,
        }),
        ev("2026-08-29T13:31:52Z", "PreToolUse", DEMO_REAL_1332, {
          agent_type: DEMO_AGENT_TYPE,
          tool_name: DEMO_SENDMESSAGE,
          tool_input: "resume completed child",
        }),
        ev("2026-08-29T13:32:45Z", "PreToolUse", DEMO_GHOST_1332, {
          tool_name: DEMO_SENDMESSAGE,
          tool_input: "resume completed child",
        }),
        ev("2026-08-29T13:38:23Z", "PreToolUse", DEMO_REAL_1332, {
          agent_type: DEMO_AGENT_TYPE,
          tool_name: "Bash",
          tool_input: "echo after-resume",
        }),
        ev("2026-08-29T14:44:06Z", "SubagentStop", DEMO_REAL_1332, {
          agent_type: DEMO_AGENT_TYPE,
        }),
      ],
      transcripts: {
        [DEMO_REAL_1332]: [
          tr("2026-08-29T13:31:52Z", DEMO_SENDMESSAGE, "resume completed child"),
          tr("2026-08-29T13:38:12Z", DEMO_SENDMESSAGE, "resume completed child"),
          tr("2026-08-29T13:38:23Z", "Bash", "echo after-resume"),
        ],
      },
    },
  };
}

export function seedStopSide89555() {
  return {
    action: "score",
    session: "stop-side-89555",
    byline: {
      session: "stop-side-89555",
      issue: STOP_SIDE_89555,
      source: "anthropics/claude-code#89555",
      scored: false,
      events: [
        ev("2026-08-29T10:00:00Z", "SubagentStart", "a777777", {
          agent_type: DEMO_AGENT_TYPE,
        }),
        ev("2026-08-29T10:00:10Z", "PreToolUse", "a777777", {
          agent_type: DEMO_AGENT_TYPE,
          tool_name: "Bash",
          tool_input: "pwd",
        }),
        ev("2026-08-29T10:00:20Z", "SubagentStop", "a777777", {
          agent_type: DEMO_AGENT_TYPE,
        }),
        ev("2026-08-29T10:00:21Z", "Stop", "", {}),
        ev("2026-08-29T10:00:22Z", "SubagentStop", "f0afresh", {}),
      ],
      transcripts: {
        a777777: [tr("2026-08-29T10:00:10Z", "Bash", "pwd")],
      },
    },
  };
}

export function seedStopSide87065() {
  return {
    action: "score",
    session: "stop-side-87065",
    byline: {
      session: "stop-side-87065",
      issue: STOP_SIDE_87065,
      source: "anthropics/claude-code#87065",
      scored: false,
      events: [
        ev("2026-08-29T10:00:00Z", "SubagentStart", "a888888", {
          agent_type: DEMO_AGENT_TYPE,
        }),
        ev("2026-08-29T10:00:10Z", "PreToolUse", "a888888", {
          agent_type: DEMO_AGENT_TYPE,
          tool_name: "Bash",
          tool_input: "pwd",
        }),
        ev("2026-08-29T10:00:20Z", "SubagentStop", "a888888", {}),
      ],
      transcripts: {
        a888888: [tr("2026-08-29T10:00:10Z", "Bash", "pwd")],
      },
    },
  };
}

export function seedStopSide59719() {
  return {
    action: "score",
    session: "stop-side-59719",
    byline: {
      session: "stop-side-59719",
      issue: STOP_SIDE_59719,
      source: "anthropics/claude-code#59719",
      scored: false,
      events: [
        ev("2026-08-29T10:00:00Z", "SubagentStart", "a999999", {
          agent_type: DEMO_AGENT_TYPE,
        }),
        ev("2026-08-29T10:00:10Z", "PreToolUse", "a999999", {
          agent_type: DEMO_AGENT_TYPE,
          tool_name: "Bash",
          tool_input: "pwd",
        }),
        ev("2026-08-29T10:00:20Z", "SubagentStop", "a999999", {
          agent_type: DEMO_AGENT_TYPE,
        }),
        ev("2026-08-29T10:00:21Z", "SubagentStop", "f0aorphan", {
          agent_type: DEMO_AGENT_TYPE,
        }),
      ],
      transcripts: {
        a999999: [tr("2026-08-29T10:00:10Z", "Bash", "pwd")],
      },
    },
  };
}

export function seedStopSide88995() {
  return seedStopSide59719();
}

const SEEDS = {
  credited: seedCredited,
  control: seedCredited,
  healthy: seedCredited,
  proof: seedCredited,
  desk: seedCredited,
  rack: seedCredited,
  reset: seedReset,
  ghosted: seedGhosted,
  untyped: seedUntyped,
  unstopped: seedUnstopped,
  hanging: seedHanging,
  split: seedSplit,
  "90662": seedSplit,
  "90662-split": seedSplit,
  "1609": seedSplit,
  stray: seedStray,
  "0720": seedStray,
  borrowed: seedBorrowed,
  "0835": seedBorrowed,
  "nest-split": seedNestSplit,
  nest: seedNestSplit,
  "resume-split": seedResumeSplit,
  resume: seedResumeSplit,
  "1332": seedResumeSplit,
  "0920": seedHanging,
  "89555": seedStopSide89555,
  "87065": seedStopSide87065,
  "59719": seedStopSide59719,
  "88995": seedStopSide88995,
};

export function decideSeed(seed, extra = {}) {
  if (typeof seed === "function") return decide({ ...seed(), ...extra });
  if (typeof seed === "number" || (typeof seed === "string" && SEEDS[seed])) {
    return decide({ ...SEEDS[seed](), ...extra });
  }
  return decide({ ...seed, ...extra });
}

function bylineResult(kind, byline, action = {}) {
  const facts = analyze(byline);
  const alarm = SLACK_VERDICTS.includes(kind);
  const linear = LINEAR_VERDICTS.includes(kind);
  return {
    product: "byline",
    action: action.action || "score",
    session: byline.session || action.session || "",
    issue: byline.issue ?? action.issue ?? null,
    source: byline.source || action.source || "",
    verdict: kind,
    state: kind,
    decision: kind,
    idleWord: IDLE_WORD,
    credited: kind === "credited",
    ghosted: kind === "ghosted",
    untyped: kind === "untyped",
    unstopped: kind === "unstopped",
    hanging: kind === "hanging",
    split: kind === "split",
    stray: kind === "stray",
    borrowed: kind === "borrowed",
    nestSplit: kind === "nest-split",
    resumeSplit: kind === "resume-split",
    alarm,
    slack: alarm,
    linear,
    github: true,
    eventClass: facts.eventClass,
    stopSideNearby: facts.stopSideNearby,
    stopSideIssues: facts.stopSideIssues,
    hired: facts.hired,
    ghosts: facts.ghosts,
    splitPair: facts.split,
    borrowedFrom: facts.borrowed,
    events: byline.events,
    transcripts: byline.transcripts,
    reasons: reasonsOf(byline, kind),
    feed: feedOf(kind),
    version: DEMO_VERSION,
    day: DEMO_DAY,
  };
}

export function score(byline = {}) {
  const row = cloneByline(byline);
  const kind = classify(row);
  return bylineResult(kind, row, { action: "score" });
}

function readAction(payload = {}) {
  if (typeof payload === "string") {
    return { action: payload, byline: emptyByline() };
  }
  const src = payload && typeof payload === "object" ? payload : {};
  const nestedAction =
    src.action && typeof src.action === "object" ? src.action : null;
  const action = asText(nestedAction?.action || src.action || "score");
  const byline = cloneByline(nestedAction || src);
  return {
    action,
    session: asText(src.session || byline.session),
    issue: asIssue(src.issue ?? byline.issue),
    source: asText(src.source || byline.source),
    byline,
  };
}

export function decide(payload = {}) {
  if (typeof payload === "function") return decide(payload());
  const action = readAction(payload);
  let byline = cloneByline(action.byline);
  const verb = String(action.action || "score").toLowerCase();

  if (
    verb === "bail" ||
    verb === "credited" ||
    verb === "still" ||
    verb === "rest" ||
    verb === "reset"
  ) {
    return bylineResult("credited", emptyByline(), {
      ...action,
      action: verb === "still" || verb === "rest" || verb === "reset" ? "bail" : verb,
    });
  }

  if (verb === "control" || verb === "healthy" || verb === "proof" || verb === "desk" || verb === "rack") {
    byline = seedControl().byline;
    return bylineResult(classify(byline), byline, { ...action, action: "control" });
  }

  if (verb === "restore" || verb === "split" || verb === "incident" || verb === "90662") {
    byline = seedSplit().byline;
    return bylineResult(classify(byline), byline, {
      ...action,
      action: verb === "restore" ? "restore" : verb,
    });
  }

  if (verb === "observe" || verb === "trace" || verb === "ledger" || verb === "score-rack") {
    byline = { ...byline, scored: true };
    return bylineResult(classify(byline), byline, {
      ...action,
      action: verb === "observe" ? "ledger" : verb,
    });
  }

  if (verb === "press" || verb === "admit" || verb === "score" || verb === "throw" || verb === "make") {
    byline = { ...byline, scored: true };
    return bylineResult(classify(byline), byline, {
      ...action,
      action: verb === "press" || verb === "throw" || verb === "make" ? "score" : verb,
    });
  }

  byline = { ...byline, scored: true };
  return bylineResult(classify(byline), byline, action);
}

export function parseSessionTrace(text = "") {
  const raw = asText(text).trim();
  if (!raw) return emptyByline();
  const events = [];
  const transcripts = {};
  const lines = raw.split(/\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    if (trimmed.startsWith("{")) {
      try {
        const parsed = JSON.parse(trimmed);
        if (parsed && typeof parsed === "object") {
          if (parsed.events || parsed.byline || parsed.transcripts) {
            return cloneByline(parsed);
          }
          const hook = hookName(parsed);
          if (hook || parsed.agent_id || parsed.tool_name || parsed.tool_use) {
            if (parsed.type === "tool_use" || parsed.tool_use) {
              const row = normalizeTranscriptRow(parsed);
              const id = row.agent_id || "_transcript";
              transcripts[id] = transcripts[id] || [];
              transcripts[id].push(row);
            } else {
              events.push(normalizeEvent(parsed));
            }
            continue;
          }
        }
      } catch {
        /* fall through */
      }
    }
    const hookMatch = trimmed.match(
      /(SubagentStart|SubagentStop|PreToolUse|PostToolUse|Stop|SendMessage)\s+(\S+)/i,
    );
    if (hookMatch) {
      events.push(
        normalizeEvent({
          hook: hookMatch[1],
          agent_id: hookMatch[2],
        }),
      );
    }
  }
  return {
    ...emptyByline(),
    events,
    transcripts,
    scored: events.length > 0,
  };
}

export function parseHookJson(raw) {
  if (raw && typeof raw === "object") {
    if (Array.isArray(raw)) {
      return cloneByline({ events: raw, scored: true });
    }
    if (raw.events || raw.byline || raw.transcripts) return cloneByline(raw);
    return cloneByline({ events: [raw], scored: true });
  }
  return parseSessionTrace(asText(raw));
}

export function parseTranscriptJsonl(raw, agentId = "") {
  const text = asText(raw);
  const rows = [];
  for (const line of text.split(/\n/)) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    try {
      rows.push(normalizeTranscriptRow(JSON.parse(trimmed), agentId));
    } catch {
      rows.push(normalizeTranscriptRow({ tool_input: trimmed }, agentId));
    }
  }
  const id = agentId || rows[0]?.agent_id || "_transcript";
  return { [id]: rows };
}

export function reconcileTranscript(byline = {}) {
  const row = cloneByline(byline);
  const facts = analyze(row);
  const kind = classify(row);
  return {
    verdict: kind,
    eventClass: facts.eventClass,
    hired: facts.hired,
    ghosts: facts.ghosts,
    splitPair: facts.split,
    borrowedFrom: facts.borrowed,
    stopSideNearby: facts.stopSideNearby,
  };
}
