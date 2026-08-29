/**
 * Cotter — machine-shop cotter-pin / axle-pin bench for a real
 * Claude Code failure class: poison-pill scheduled-task registry
 * schema. Claude Desktop’s own `update_scheduled_task` MCP writes
 * `fireAt` as an ISO-8601 string (schema docs say ISO).
 * `loadScheduledTasksFromDisk` Zod-expects epoch milliseconds.
 * One string entry rejects the whole `scheduled-tasks.json`.
 * Every routine goes dark (55h in the primary report) while
 * liveness proxies stay green (processes, package status,
 * dispatcher heartbeat, even `recordedSkips` keep writing).
 *
 * A written schedule is not a hold. Score the pin tray or admit snug.
 *
 * Primary #90533: one string fireAt → ZodError on
 * scheduledTasks[n].fireAt → whole registry fails to load →
 * zero dispatches; the app’s own MCP wrote the string.
 *
 * Same-class / shape (not new primaries):
 *   #85565 — Desktop update silently wiped scheduledTasks: [];
 *            all tasks died at once, zero notification.
 *   #83600 — scheduled tasks silently disappear (recurring
 *            vanished twice in 5 days).
 *   #89811 — scheduled tasks report success but silently
 *            perform zero work.
 *   #88308 — scheduled-task MCP tools missing from session
 *            context on Windows.
 *
 * Cross-check nearby schedule bugs are DIFFERENT (cite only as
 * “not this”):
 *   NOT Fusee / #90485 early schedule dispatch.
 *   NOT Cinch / #90506 partial folder mounts on scheduled
 *       Cowork runs.
 *   NOT Reveille muster / heartbeat survival.
 *   NOT Fob keychain litter, Ordo headless plugin slash,
 *       Ullage context drop, Visa MCP OAuth resource,
 *       Sprag boot MCP, Larder plugin-store freeze,
 *       Hasp file-lease, Wicket worktree, Tappet silent hooks.
 *
 * Cross-ecosystem (real silent-fail shape, not a new primary):
 *   openai/codex#28444 — cron automations never fire while
 *            heartbeat automations stay green.
 *   openai/codex#37973 is NOT this (wrong fire time; Fusee-class).
 *
 * Verdicts: snug | poison | wipe | hollow | vanish | mute-mcp
 * Idle word is snug (every fireAt is epoch ms, Zod loads the
 * whole tray, dispatches match the written hold, MCP tools
 * present). NEVER use cotter / empty / fireAt / schedule /
 * registry / poison as idle.
 * NEVER reuse hung, appointed, cinched, gauged, stamped, overrun,
 * pratique, wound, bound, stilled, stabled, drained, flat, fit,
 * spoilt, laid, unlinked, tight, banked, roosted, stocked, seated,
 * heard, clear, paired, kernel, latched, upheld, sterling, home,
 * valid, dry, sealed, quiet, seised.
 *
 * Slack alarm on poison / wipe / hollow / vanish / mute-mcp.
 * Linear ticket on poison / wipe.
 * GitHub cotter-ledger of scored trays on every score.
 *
 * Why this is not a clone:
 * NOT Fusee (early schedule dispatch).
 * NOT Cinch (partial folder mounts).
 * NOT Reveille (muster / heartbeat survival).
 * NOT Fob (keychain litter).
 * NOT Ordo (headless plugin slash).
 * NOT Ullage (silent context drop).
 * NOT Visa (MCP OAuth resource).
 * NOT Sprag (boot MCP).
 * NOT Larder (plugin-store freeze).
 * NOT Hasp (file-lease).
 * NOT Wicket (worktree).
 * NOT Tappet (silent hooks).
 * Different problem: POISON-PILL REGISTRY SCHEMA — one ISO
 * string fireAt fail-closes the entire routine set while green
 * proxies lie.
 * Different UI: machine-shop cotter-pin / axle-pin tray. Steel
 * bench, oil-stained felt, calipers, numbered pin slots, lying
 * green pressure/grease gauges, a poison pin glowing wrong-typed.
 * Different idle: snug.
 * Do NOT ship leftover woodworking, millimetre-sliders, or near-clones.
 */

export const VERDICTS = Object.freeze([
  "snug",
  "poison",
  "wipe",
  "hollow",
  "vanish",
  "mute-mcp",
]);
export const IDLE_WORD = "snug";
export const SLACK_VERDICTS = Object.freeze([
  "poison",
  "wipe",
  "hollow",
  "vanish",
  "mute-mcp",
]);
export const LINEAR_VERDICTS = Object.freeze(["poison", "wipe"]);
export const ALARM_VERDICTS = SLACK_VERDICTS;
export const ISO_FIRE_AT = "2026-08-27T07:30:00+01:00";
export const EPOCH_FIRE_AT = Date.parse(ISO_FIRE_AT);

const FORBIDDEN_IDLE = Object.freeze([
  "cotter",
  "empty",
  "fireat",
  "fireAt",
  "schedule",
  "registry",
  "poison",
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
  "sealed",
  "quiet",
  "seised",
  "fusee",
  "cinch",
  "reveille",
  "fob",
  "ordo",
  "ullage",
  "visa",
  "sprag",
  "larder",
  "hasp",
  "wicket",
  "tappet",
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

function asNum(value) {
  if (value == null || value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function isIsoFireAt(value) {
  if (typeof value !== "string") return false;
  return /^\d{4}-\d{2}-\d{2}T/.test(value.trim());
}

export function fireAtKind(value) {
  if (value == null || value === "") return "missing";
  if (typeof value === "number" && Number.isFinite(value)) return "epoch";
  if (isIsoFireAt(value)) return "iso";
  if (typeof value === "string") return "string";
  return typeof value;
}

export function emptyPin() {
  return {
    id: "",
    name: "",
    fireAt: null,
    enabled: true,
    cron: "",
    kind: "recurring",
    lastRunAt: "",
    lastFiredAt: "",
    workDone: null,
    toolCalls: null,
  };
}

export function emptyTray() {
  return {
    session: "",
    source: "",
    issue: null,
    scored: false,
    scheduledTasks: [],
    definitionsOnDisk: null,
    registryLoaded: null,
    zodError: "",
    dispatcherHeartbeat: null,
    recordedSkipsWriting: null,
    processesGreen: null,
    packageStatusGreen: null,
    lastFiredAdvances: null,
    workDone: null,
    toolCalls: null,
    mcpToolsPresent: null,
    mcpTools: [],
    darkHours: 0,
    expectedRecurring: 0,
    recurringPresent: 0,
    spentOneTimeRemain: 0,
    wiped: false,
    vanished: false,
    hollow: false,
    muteMcp: false,
  };
}

export function emptyAction(session = "snug-1") {
  return {
    action: "score",
    session,
    tray: emptyTray(),
  };
}

function clonePin(raw = {}) {
  const src = raw && typeof raw === "object" ? raw : emptyPin();
  const fireAt =
    src.fireAt !== undefined
      ? src.fireAt
      : src.fire_at !== undefined
        ? src.fire_at
        : null;
  return {
    ...emptyPin(),
    id: asText(src.id || src.taskId || src.task_id),
    name: asText(src.name || src.title),
    fireAt,
    enabled: asBool(src.enabled, true) !== false,
    cron: asText(src.cron || src.schedule),
    kind: asText(src.kind || src.type) || "recurring",
    lastRunAt: asText(src.lastRunAt || src.last_run_at),
    lastFiredAt: asText(src.lastFiredAt || src.last_fired_at),
    workDone: asBool(src.workDone ?? src.work_done, null),
    toolCalls: asNum(src.toolCalls ?? src.tool_calls ?? src.num_turns),
  };
}

export function cloneTray(raw = {}) {
  const src = raw && typeof raw === "object" ? raw : emptyTray();
  const nested =
    (src.tray && typeof src.tray === "object" && src.tray) ||
    (src.registry && typeof src.registry === "object" && src.registry) ||
    (src.probe && typeof src.probe === "object" && src.probe) ||
    (src.payload && typeof src.payload === "object" && src.payload) ||
    src;
  const tasksRaw = Array.isArray(nested.scheduledTasks)
    ? nested.scheduledTasks
    : Array.isArray(nested.tasks)
      ? nested.tasks
      : Array.isArray(nested.pins)
        ? nested.pins
        : [];
  return {
    ...emptyTray(),
    session: asText(nested.session ?? src.session ?? src.sessionKey),
    source: asText(nested.source ?? src.source),
    issue: asIssue(nested.issue ?? src.issue),
    scored: asBool(nested.scored ?? src.scored, false),
    scheduledTasks: tasksRaw.map(clonePin),
    definitionsOnDisk: asBool(nested.definitionsOnDisk ?? src.definitionsOnDisk, null),
    registryLoaded: asBool(nested.registryLoaded ?? src.registryLoaded, null),
    zodError: asText(nested.zodError ?? src.zodError),
    dispatcherHeartbeat: asBool(nested.dispatcherHeartbeat ?? src.dispatcherHeartbeat, null),
    recordedSkipsWriting: asBool(nested.recordedSkipsWriting ?? src.recordedSkipsWriting, null),
    processesGreen: asBool(nested.processesGreen ?? src.processesGreen, null),
    packageStatusGreen: asBool(nested.packageStatusGreen ?? src.packageStatusGreen, null),
    lastFiredAdvances: asBool(nested.lastFiredAdvances ?? src.lastFiredAdvances, null),
    workDone: asBool(nested.workDone ?? src.workDone, null),
    toolCalls: asNum(nested.toolCalls ?? src.toolCalls),
    mcpToolsPresent: asBool(nested.mcpToolsPresent ?? src.mcpToolsPresent, null),
    mcpTools: Array.isArray(nested.mcpTools ?? src.mcpTools)
      ? (nested.mcpTools ?? src.mcpTools).map((row) => asText(row)).filter(Boolean)
      : [],
    darkHours: asNum(nested.darkHours ?? src.darkHours) || 0,
    expectedRecurring: asNum(nested.expectedRecurring ?? src.expectedRecurring) || 0,
    recurringPresent: asNum(nested.recurringPresent ?? src.recurringPresent) || 0,
    spentOneTimeRemain: asNum(nested.spentOneTimeRemain ?? src.spentOneTimeRemain) || 0,
    wiped: asBool(nested.wiped ?? src.wiped, false) === true,
    vanished: asBool(nested.vanished ?? src.vanished, false) === true,
    hollow: asBool(nested.hollow ?? src.hollow, false) === true,
    muteMcp: asBool(nested.muteMcp ?? src.muteMcp, false) === true,
  };
}

/**
 * Zod-style whole-registry reject. One non-number fireAt fails
 * the entire tray — the primary #90533 shape.
 */
export function loadScheduledTasksFromDisk(tray = {}) {
  const next = cloneTray(tray);
  const tasks = next.scheduledTasks;
  for (let i = 0; i < tasks.length; i += 1) {
    const kind = fireAtKind(tasks[i].fireAt);
    if (kind !== "epoch" && tasks[i].fireAt != null && tasks[i].fireAt !== "") {
      return {
        ok: false,
        loaded: [],
        rejected: true,
        poisonIndex: i,
        poisonKind: kind,
        path: ["scheduledTasks", i, "fireAt"],
        expected: "number",
        received: typeof tasks[i].fireAt,
        message: `Invalid input: expected number, received ${typeof tasks[i].fireAt}`,
        zodError: `ZodError: scheduledTasks[${i}].fireAt expected number, received ${typeof tasks[i].fireAt}`,
      };
    }
  }
  return {
    ok: true,
    loaded: tasks,
    rejected: false,
    poisonIndex: -1,
    poisonKind: "",
    path: [],
    expected: "number",
    received: "",
    message: "",
    zodError: "",
  };
}

export function analyze(tray = {}) {
  const next = cloneTray(tray);
  const load = loadScheduledTasksFromDisk(next);
  const tasks = next.scheduledTasks;
  const kinds = tasks.map((row) => fireAtKind(row.fireAt));
  const stringPins = kinds.filter((kind) => kind === "iso" || kind === "string").length;
  const epochPins = kinds.filter((kind) => kind === "epoch").length;
  const proxiesGreen =
    next.dispatcherHeartbeat === true ||
    next.processesGreen === true ||
    next.packageStatusGreen === true ||
    next.recordedSkipsWriting === true;
  const dispatcherDark =
    load.rejected ||
    next.registryLoaded === false ||
    next.darkHours > 0 ||
    (proxiesGreen && load.rejected);
  const emptyRegistry = tasks.length === 0;
  const wipeShape =
    next.wiped ||
    (emptyRegistry && next.definitionsOnDisk === true) ||
    (emptyRegistry && next.registryLoaded === true && next.definitionsOnDisk !== false && next.scored && next.source);
  const vanishShape =
    next.vanished ||
    (next.expectedRecurring > 0 && next.recurringPresent === 0 && next.spentOneTimeRemain > 0);
  const hollowShape =
    next.hollow ||
    (next.lastFiredAdvances === true && (next.workDone === false || next.toolCalls === 0));
  const muteShape =
    next.muteMcp ||
    next.mcpToolsPresent === false ||
    (Array.isArray(next.mcpTools) &&
      next.mcpTools.length === 0 &&
      next.mcpToolsPresent === false);
  const snugHold =
    load.ok &&
    epochPins === tasks.length &&
    tasks.length > 0 &&
    next.registryLoaded !== false &&
    !stringPins &&
    next.workDone !== false &&
    next.mcpToolsPresent !== false &&
    !next.wiped &&
    !next.vanished &&
    !next.hollow &&
    !next.muteMcp &&
    !vanishShape &&
    !hollowShape;
  return {
    taskCount: tasks.length,
    stringPins,
    epochPins,
    poisonIndex: load.poisonIndex,
    poisonKind: load.poisonKind,
    zodRejected: load.rejected,
    zodError: next.zodError || load.zodError,
    zodPath: load.path,
    proxiesGreen,
    dispatcherDark,
    emptyRegistry,
    wipeShape,
    vanishShape,
    hollowShape,
    muteShape,
    snugHold,
    darkHours: next.darkHours,
    definitionsOnDisk: next.definitionsOnDisk,
    lastFiredAdvances: next.lastFiredAdvances,
    workDone: next.workDone,
    mcpToolsPresent: next.mcpToolsPresent,
    load,
  };
}

export function isIdle(tray = {}) {
  const next = cloneTray(tray);
  return (
    next.scheduledTasks.length === 0 &&
    next.definitionsOnDisk == null &&
    next.registryLoaded == null &&
    !next.zodError &&
    next.dispatcherHeartbeat == null &&
    next.recordedSkipsWriting == null &&
    next.processesGreen == null &&
    next.packageStatusGreen == null &&
    next.lastFiredAdvances == null &&
    next.workDone == null &&
    next.toolCalls == null &&
    next.mcpToolsPresent == null &&
    next.mcpTools.length === 0 &&
    next.darkHours === 0 &&
    next.expectedRecurring === 0 &&
    next.recurringPresent === 0 &&
    next.spentOneTimeRemain === 0 &&
    !next.wiped &&
    !next.vanished &&
    !next.hollow &&
    !next.muteMcp
  );
}

/**
 * First match wins. Idle snug is first. Classes stay distinguishable:
 * a written fireAt is not a hold. Admit snug only when every pin is
 * epoch ms, Zod loads the tray, dispatches match, MCP tools present.
 */
export function classify(tray = {}) {
  const next = cloneTray(tray);
  if (isIdle(next)) return "snug";
  const facts = analyze(next);

  if (facts.zodRejected || facts.stringPins > 0 || facts.poisonKind) return "poison";
  if (facts.wipeShape || (facts.emptyRegistry && next.definitionsOnDisk === true) || next.wiped) {
    return "wipe";
  }
  if (facts.vanishShape || next.vanished) return "vanish";
  if (facts.hollowShape || next.hollow) return "hollow";
  if (facts.muteShape || next.muteMcp || next.mcpToolsPresent === false) return "mute-mcp";
  if (facts.snugHold || facts.emptyRegistry) return "snug";
  return "snug";
}

export function feedOf(tray = {}, verdict = "") {
  const kind = verdict || classify(tray);
  if (kind === "poison") {
    return "● Poison · one string fireAt rejects the whole registry · ZodError scheduledTasks[n].fireAt · primary #90533";
  }
  if (kind === "wipe") {
    return "● Wipe · scheduledTasks: [] after a silent update · definitions still on disk · #85565";
  }
  if (kind === "hollow") {
    return "● Hollow · lastFired advances, zero work, zero tool calls · #89811";
  }
  if (kind === "vanish") {
    return "● Vanish · recurring pin gone; spent one-time pins remain · #83600";
  }
  if (kind === "mute-mcp") {
    return "● Mute-mcp · list/update scheduled-task tools absent from session context · #88308";
  }
  return "● Snug · every fireAt is epoch ms, Zod loads the tray, dispatches match · idle word is snug";
}

export function reasonsOf(tray = {}, verdict = "") {
  const next = cloneTray(tray);
  const kind = verdict || classify(next);
  const facts = analyze(next);
  const reasons = [];
  if (next.session) reasons.push(`session ${next.session}`);
  reasons.push(
    facts.taskCount
      ? `tray ${facts.taskCount} pin${facts.taskCount === 1 ? "" : "s"} · ${facts.epochPins} epoch · ${facts.stringPins} string`
      : "one snug pin on the tray · idle word is snug",
  );
  if (facts.zodRejected) {
    const path = facts.zodPath.length ? facts.zodPath.join(".") : "scheduledTasks[n].fireAt";
    reasons.push(
      `Zod fail-closed · ${path} expected number, received ${facts.load.received || "string"}`,
    );
  }
  if (facts.stringPins) {
    reasons.push(`${facts.stringPins} ISO/string fireAt beside epoch pins · one string rejects the whole tray`);
  }
  if (facts.proxiesGreen && facts.dispatcherDark) {
    reasons.push(
      `lying green gauges · heartbeat / processes / package / recordedSkips stay green · dispatcher dark ${facts.darkHours || 0}h`,
    );
  }
  if (facts.wipeShape || next.wiped) {
    reasons.push("scheduledTasks: [] · SKILL.md definitions still on disk · zero notification");
  }
  if (facts.vanishShape || next.vanished) {
    reasons.push(
      `recurring vanished · expected ${next.expectedRecurring} · present ${next.recurringPresent} · spent one-time remain ${next.spentOneTimeRemain}`,
    );
  }
  if (facts.hollowShape || next.hollow) {
    reasons.push("lastFired / nextRun advance · zero tool calls · zero downstream work");
  }
  if (facts.muteShape || next.muteMcp || next.mcpToolsPresent === false) {
    reasons.push("mcp__scheduled-tasks__* absent from session context · Windows mute");
  }
  reasons.push("a written fireAt is not a hold");
  reasons.push(
    "NOT Fusee (#90485 early dispatch) / Cinch (#90506 partial mounts) / Reveille (muster) / Fob / Ordo / Ullage / Visa / Sprag / Larder / Hasp / Wicket / Tappet / leftover woodworking / millimetre-slider",
  );
  if (kind === "snug") {
    reasons.push("every fireAt is epoch ms, Zod loads the tray, dispatches match; idle word is snug");
  }
  if (kind === "poison") {
    reasons.push(
      "PRIMARY #90533: update_scheduled_task wrote ISO-8601; loadScheduledTasksFromDisk Zod-expects epoch ms. One string → whole registry fails to load → zero dispatches for 55h while proxies stay green.",
    );
  }
  if (kind === "wipe") {
    reasons.push("#85565: Desktop update silently wiped scheduledTasks: []. All tasks died at once, zero notification.");
  }
  if (kind === "hollow") {
    reasons.push("#89811: scheduled tasks report success but silently perform zero work.");
  }
  if (kind === "vanish") {
    reasons.push("#83600: recurring scheduled task vanished twice in 5 days; spent one-time tasks persist.");
  }
  if (kind === "mute-mcp") {
    reasons.push("#88308: list_scheduled_tasks / update_scheduled_task missing from session context on Windows.");
  }
  return reasons;
}

export function verdictOf(tray = {}) {
  return classify(tray);
}

export function flagsOf(verdict) {
  return {
    slack: SLACK_VERDICTS.includes(verdict),
    linear: LINEAR_VERDICTS.includes(verdict),
    github: true,
    alarm: ALARM_VERDICTS.includes(verdict),
  };
}

export function snugOf(tray = {}, verdict = "") {
  return (verdict || classify(tray)) === "snug";
}

export function poisonOf(tray = {}, verdict = "") {
  return (verdict || classify(tray)) === "poison";
}

export function summaryOf(tray = {}) {
  const next = cloneTray(tray);
  const facts = analyze(next);
  return {
    taskCount: facts.taskCount,
    stringPins: facts.stringPins,
    epochPins: facts.epochPins,
    poisonIndex: facts.poisonIndex,
    zodRejected: facts.zodRejected,
    proxiesGreen: facts.proxiesGreen,
    dispatcherDark: facts.dispatcherDark,
    darkHours: facts.darkHours,
    definitionsOnDisk: facts.definitionsOnDisk,
    lastFiredAdvances: facts.lastFiredAdvances,
    workDone: facts.workDone,
    mcpToolsPresent: facts.mcpToolsPresent,
    names: next.scheduledTasks.map((row) => row.name || row.id),
  };
}

export function score(tray = {}) {
  const next = cloneTray(tray);
  const verdict = classify(next);
  const facts = analyze(next);
  const flags = flagsOf(verdict);
  return {
    verdict,
    reasons: reasonsOf(next, verdict),
    snug: snugOf(next, verdict),
    poison: poisonOf(next, verdict),
    feed: feedOf(next, verdict),
    slack: flags.slack,
    linear: flags.linear,
    github: flags.github,
    alarm: flags.alarm,
    idleWord: IDLE_WORD,
    state: verdict,
    decision: verdict,
    taskCount: facts.taskCount,
    stringPins: facts.stringPins,
    epochPins: facts.epochPins,
    poisonIndex: facts.poisonIndex,
    zodRejected: facts.zodRejected,
    proxiesGreen: facts.proxiesGreen,
    dispatcherDark: facts.dispatcherDark,
    darkHours: facts.darkHours,
    summary: summaryOf(next),
    tray: next,
  };
}

export function readAction(payload = {}) {
  const nested = payload.action && typeof payload.action === "object" ? payload.action : null;
  const src = nested || payload;
  const traySrc =
    src.tray || src.registry || src.probe || src.payload || payload.tray || payload.registry || payload.probe;
  const tray = cloneTray(
    traySrc && typeof traySrc === "object" ? { ...traySrc, ...src, ...payload } : payload,
  );
  if (typeof src.session === "string" && !tray.session) tray.session = src.session;
  if (typeof payload.session === "string" && !tray.session) tray.session = payload.session;
  const rawAction = String((nested ? nested.action : payload.action) || "score");
  return {
    action: rawAction,
    session: String(src.session ?? payload.session ?? tray.session ?? ""),
    tray,
    issue: src.issue ?? payload.issue ?? tray.issue ?? null,
    source: src.source ?? payload.source ?? tray.source ?? "",
  };
}

function trayResult(verdict, tray, action, extras = {}) {
  const next = cloneTray(tray);
  const scored = score(next);
  return {
    ok: true,
    product: "cotter",
    verdict,
    state: verdict,
    decision: verdict,
    idleWord: IDLE_WORD,
    alarm: scored.alarm,
    linear: scored.linear,
    slack: scored.slack,
    github: scored.github,
    snug: scored.snug,
    poison: scored.poison,
    traySnug: verdict === "snug",
    trayPoison: verdict === "poison",
    trayWipe: verdict === "wipe",
    trayHollow: verdict === "hollow",
    trayVanish: verdict === "vanish",
    trayMuteMcp: verdict === "mute-mcp",
    action: action.action,
    session: next.session || action.session || "",
    source: next.source || action.source || "",
    issue: next.issue ?? action.issue ?? null,
    taskCount: scored.taskCount,
    stringPins: scored.stringPins,
    epochPins: scored.epochPins,
    poisonIndex: scored.poisonIndex,
    zodRejected: scored.zodRejected,
    proxiesGreen: scored.proxiesGreen,
    dispatcherDark: scored.dispatcherDark,
    darkHours: scored.darkHours,
    feed: scored.feed,
    reasons: scored.reasons,
    summary: scored.summary,
    scored: Boolean(next.scored),
    tray: next,
    ...extras,
  };
}

function seedTray(issue, source, extras = {}) {
  const session = extras.session != null ? String(extras.session) : String(issue);
  const issueId = extras.issue !== undefined ? extras.issue : issue;
  source = extras.source != null ? extras.source : source;
  const tasks = Array.isArray(extras.scheduledTasks) ? extras.scheduledTasks.map(clonePin) : [];
  return {
    action: extras.action || "score",
    session,
    issue: issueId,
    source,
    tray: {
      ...emptyTray(),
      session,
      source,
      issue: issueId,
      scored: extras.scored == null ? true : Boolean(extras.scored),
      scheduledTasks: tasks,
      definitionsOnDisk: extras.definitionsOnDisk !== undefined ? extras.definitionsOnDisk : null,
      registryLoaded: extras.registryLoaded !== undefined ? extras.registryLoaded : null,
      zodError: asText(extras.zodError),
      dispatcherHeartbeat: extras.dispatcherHeartbeat !== undefined ? extras.dispatcherHeartbeat : null,
      recordedSkipsWriting: extras.recordedSkipsWriting !== undefined ? extras.recordedSkipsWriting : null,
      processesGreen: extras.processesGreen !== undefined ? extras.processesGreen : null,
      packageStatusGreen: extras.packageStatusGreen !== undefined ? extras.packageStatusGreen : null,
      lastFiredAdvances: extras.lastFiredAdvances !== undefined ? extras.lastFiredAdvances : null,
      workDone: extras.workDone !== undefined ? extras.workDone : null,
      toolCalls: extras.toolCalls !== undefined ? extras.toolCalls : null,
      mcpToolsPresent: extras.mcpToolsPresent !== undefined ? extras.mcpToolsPresent : null,
      mcpTools: Array.isArray(extras.mcpTools) ? extras.mcpTools : [],
      darkHours: extras.darkHours || 0,
      expectedRecurring: extras.expectedRecurring || 0,
      recurringPresent: extras.recurringPresent || 0,
      spentOneTimeRemain: extras.spentOneTimeRemain || 0,
      wiped: Boolean(extras.wiped),
      vanished: Boolean(extras.vanished),
      hollow: Boolean(extras.hollow),
      muteMcp: Boolean(extras.muteMcp),
    },
  };
}

function epochPin(id, name, extras = {}) {
  return {
    id,
    name,
    fireAt: extras.fireAt != null ? extras.fireAt : EPOCH_FIRE_AT,
    enabled: extras.enabled !== false,
    cron: extras.cron || "0 7 * * *",
    kind: extras.kind || "recurring",
    lastRunAt: extras.lastRunAt || "",
    lastFiredAt: extras.lastFiredAt || "",
    workDone: extras.workDone !== undefined ? extras.workDone : true,
    toolCalls: extras.toolCalls !== undefined ? extras.toolCalls : 3,
  };
}

/** Idle / bail. Tray not scored as a live registry. One snug pin. */
export function seedSnug() {
  return seedTray("snug", "bench", {
    session: "snug",
    issue: null,
    scored: true,
  });
}

/**
 * Control: 6 epoch-ms pins, Zod loads, dispatches match, MCP present.
 */
export function seedControl() {
  const scheduledTasks = [];
  for (let i = 0; i < 6; i += 1) {
    scheduledTasks.push(
      epochPin(`task-${i + 1}`, `routine ${i + 1}`, {
        fireAt: EPOCH_FIRE_AT + i * 3600000,
        lastFiredAt: "2026-08-29T07:00:00Z",
        workDone: true,
        toolCalls: 2,
      }),
    );
  }
  return seedTray("snug", "bench", {
    session: "90533-control",
    issue: null,
    scheduledTasks,
    definitionsOnDisk: true,
    registryLoaded: true,
    dispatcherHeartbeat: true,
    recordedSkipsWriting: false,
    processesGreen: true,
    packageStatusGreen: true,
    lastFiredAdvances: true,
    workDone: true,
    toolCalls: 12,
    mcpToolsPresent: true,
    mcpTools: ["list_scheduled_tasks", "update_scheduled_task"],
    expectedRecurring: 6,
    recurringPresent: 6,
  });
}

/**
 * #90533 poison: one ISO string fireAt at index 33 of 35.
 * Zod rejects the whole registry. 55h dark. Proxies stay green.
 */
export function seedPoison() {
  const scheduledTasks = [];
  for (let i = 0; i < 35; i += 1) {
    scheduledTasks.push(
      epochPin(`task-${String(i + 1).padStart(2, "0")}`, `routine ${i + 1}`, {
        fireAt: i === 33 ? ISO_FIRE_AT : EPOCH_FIRE_AT + i * 60000,
        workDone: false,
        toolCalls: 0,
      }),
    );
  }
  return seedTray(90533, "anthropics/claude-code#90533", {
    session: "90533-poison",
    scheduledTasks,
    definitionsOnDisk: true,
    registryLoaded: false,
    zodError: "ZodError: scheduledTasks[33].fireAt expected number, received string",
    dispatcherHeartbeat: true,
    recordedSkipsWriting: true,
    processesGreen: true,
    packageStatusGreen: true,
    lastFiredAdvances: false,
    workDone: false,
    toolCalls: 0,
    mcpToolsPresent: true,
    mcpTools: ["list_scheduled_tasks", "update_scheduled_task"],
    darkHours: 55,
    expectedRecurring: 35,
    recurringPresent: 35,
  });
}

/** #85565 wipe: scheduledTasks: [], definitions still on disk. */
export function seedWipe() {
  return seedTray(85565, "anthropics/claude-code#85565", {
    session: "85565-wipe",
    scheduledTasks: [],
    definitionsOnDisk: true,
    registryLoaded: true,
    dispatcherHeartbeat: true,
    processesGreen: true,
    packageStatusGreen: true,
    lastFiredAdvances: false,
    workDone: false,
    toolCalls: 0,
    wiped: true,
    expectedRecurring: 4,
    recurringPresent: 0,
  });
}

/** #89811 hollow: lastFired advances, zero work. */
export function seedHollow() {
  return seedTray(89811, "anthropics/claude-code#89811", {
    session: "89811-hollow",
    scheduledTasks: [
      epochPin("trig_01QTYf3M8TBwaKxgMcjzEvBw", "CRM Voice Log Filing", {
        cron: "0 12-22 * * 1-5",
        lastFiredAt: "2026-08-25T21:00:00Z",
        workDone: false,
        toolCalls: 0,
      }),
      epochPin("trig_01ECPLNFxjUx2siMwSZXGN89", "Daily Call List Digest", {
        cron: "0 11 * * 1-5",
        lastFiredAt: "2026-08-25T11:09:22Z",
        workDone: false,
        toolCalls: 0,
      }),
    ],
    definitionsOnDisk: true,
    registryLoaded: true,
    dispatcherHeartbeat: true,
    processesGreen: true,
    lastFiredAdvances: true,
    workDone: false,
    toolCalls: 0,
    hollow: true,
    mcpToolsPresent: true,
    expectedRecurring: 2,
    recurringPresent: 2,
  });
}

/** #83600 vanish: recurring gone; spent one-time remain. */
export function seedVanish() {
  return seedTray(83600, "anthropics/claude-code#83600", {
    session: "83600-vanish",
    scheduledTasks: [
      epochPin("spent-1", "one-time already fired", {
        kind: "one-time",
        enabled: false,
        lastRunAt: "2026-08-01T09:00:00Z",
        lastFiredAt: "2026-08-01T09:00:00Z",
        workDone: true,
        toolCalls: 2,
      }),
      epochPin("spent-2", "one-time already fired", {
        kind: "one-time",
        enabled: false,
        lastRunAt: "2026-08-02T09:00:00Z",
        lastFiredAt: "2026-08-02T09:00:00Z",
        workDone: true,
        toolCalls: 1,
      }),
    ],
    definitionsOnDisk: true,
    registryLoaded: true,
    vanished: true,
    expectedRecurring: 1,
    recurringPresent: 0,
    spentOneTimeRemain: 2,
    mcpToolsPresent: true,
  });
}

/** #88308 mute-mcp: scheduled-task tools absent from session. */
export function seedMuteMcp() {
  return seedTray(88308, "anthropics/claude-code#88308", {
    session: "88308-mute-mcp",
    scheduledTasks: [
      epochPin("obsidian-daily", "Obsidian Daily Knowledge Sync", {
        workDone: true,
        toolCalls: 2,
      }),
    ],
    definitionsOnDisk: true,
    registryLoaded: true,
    mcpToolsPresent: false,
    mcpTools: [],
    muteMcp: true,
    dispatcherHeartbeat: true,
    processesGreen: true,
  });
}

/** Full #90533 poison used as the restore-to-poison ticket. */
export function seed90533() {
  return seedPoison();
}

export function parseSessionTrace(raw = "") {
  const text = asText(raw).trim();
  if (!text) return emptyTray();
  if (text.startsWith("{") || text.startsWith("[")) {
    try {
      const parsed = JSON.parse(text);
      if (Array.isArray(parsed)) {
        return cloneTray({
          scheduledTasks: parsed,
          scored: true,
        });
      }
      if (parsed && typeof parsed === "object") {
        return cloneTray({ ...parsed, scored: true });
      }
    } catch {
      /* fall through to prose */
    }
  }
  const poison =
    /ZodError|expected number, received string|scheduledTasks\[\d+\]\.fireAt|ISO[- ]?8601|update_scheduled_task/i.test(
      text,
    ) && /string|ISO|fireAt/i.test(text);
  const wipe = /scheduledTasks:\s*\[\s*\]|wiped the (internal )?scheduled-tasks|silently wiped/i.test(text);
  const hollow = /report success but silently perform zero work|last_fired_at advances|zero (actual )?work|zero tool/i.test(
    text,
  );
  const vanish = /silently disappear|recurring (task )?vanished|not found/i.test(text);
  const mute = /mcp__scheduled-tasks|tools missing|missing from session context/i.test(text);
  const snug = /every fireAt is epoch|admit snug|Zod loads the tray/i.test(text);

  if (poison) {
    return { ...seedPoison().tray, session: "paste-poison", source: "anthropics/claude-code#90533", issue: 90533, scored: true };
  }
  if (wipe) {
    return { ...seedWipe().tray, session: "paste-wipe", source: "anthropics/claude-code#85565", issue: 85565, scored: true };
  }
  if (hollow) {
    return { ...seedHollow().tray, session: "paste-hollow", source: "anthropics/claude-code#89811", issue: 89811, scored: true };
  }
  if (vanish) {
    return { ...seedVanish().tray, session: "paste-vanish", source: "anthropics/claude-code#83600", issue: 83600, scored: true };
  }
  if (mute) {
    return { ...seedMuteMcp().tray, session: "paste-mute-mcp", source: "anthropics/claude-code#88308", issue: 88308, scored: true };
  }
  if (snug) {
    return { ...seedControl().tray, session: "paste-snug", source: "paste", scored: true };
  }
  const iso = text.match(/"fireAt"\s*:\s*"([^"]+)"/);
  if (iso) {
    return cloneTray({
      scheduledTasks: [{ id: "paste", name: "paste", fireAt: iso[1] }],
      registryLoaded: false,
      scored: true,
      session: "paste-poison",
      source: "paste",
      issue: 90533,
    });
  }
  return { ...emptyTray(), session: "paste", source: "paste", scored: true };
}

export function parseJsonl(raw = "") {
  return parseSessionTrace(raw);
}

const SEEDS = {
  snug: seedSnug,
  control: seedControl,
  poison: seedPoison,
  90533: seed90533,
  "90533-poison": seedPoison,
  wipe: seedWipe,
  85565: seedWipe,
  hollow: seedHollow,
  89811: seedHollow,
  vanish: seedVanish,
  83600: seedVanish,
  "mute-mcp": seedMuteMcp,
  mutemcp: seedMuteMcp,
  88308: seedMuteMcp,
  healthy: seedControl,
  bench: seedControl,
};

export function decideSeed(seed, extra = {}) {
  if (typeof seed === "function") return decide({ ...seed(), ...extra });
  if (typeof seed === "number" || (typeof seed === "string" && SEEDS[seed])) {
    return decide({ ...SEEDS[seed](), ...extra });
  }
  return decide({ ...seed, ...extra });
}

export function decide(payload = {}) {
  if (typeof payload === "function") return decide(payload());
  const action = readAction(payload);
  let tray = cloneTray(action.tray);
  const verb = String(action.action || "score").toLowerCase();

  if (verb === "bail" || verb === "snug" || verb === "still" || verb === "rest" || verb === "reset") {
    return trayResult("snug", emptyTray(), {
      ...action,
      action: verb === "still" || verb === "rest" || verb === "reset" ? "bail" : verb,
    });
  }

  if (verb === "control" || verb === "healthy" || verb === "proof" || verb === "bench") {
    tray = seedControl().tray;
    return trayResult(classify(tray), tray, { ...action, action: "control" });
  }

  if (verb === "restore" || verb === "poison" || verb === "incident") {
    tray = seedPoison().tray;
    return trayResult(classify(tray), tray, { ...action, action: verb === "restore" ? "restore" : verb });
  }

  if (verb === "observe" || verb === "trace" || verb === "ledger" || verb === "sound") {
    tray = { ...tray, scored: true };
    return trayResult(classify(tray), tray, { ...action, action: verb === "observe" ? "ledger" : verb });
  }

  if (verb === "press" || verb === "admit" || verb === "score" || verb === "throw" || verb === "pin") {
    tray = { ...tray, scored: true };
    return trayResult(classify(tray), tray, {
      ...action,
      action: verb === "press" || verb === "throw" || verb === "pin" ? "score" : verb,
    });
  }

  tray = { ...tray, scored: true };
  return trayResult(classify(tray), tray, action);
}
