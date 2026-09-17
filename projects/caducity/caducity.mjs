#!/usr/bin/env node
/**
 * Caducity — lease ledger / watch desk / session-long privilege /
 * thirty-cap expiry booth.
 * *Caducity* is the tendency of a right or privilege to lapse /
 * fall into disuse. A Monitor armed with `persistent: true` should
 * abide for the session; instead the lease caducously expires at a
 * hard 30m thirty-cap — false persistence / watch-kill. Educational
 * booth only — NOT a Claude Code fix.
 *
 * Educational diagnostic model for anthropics/claude-code#94553:
 * since ~2.1.268/2.1.272, a Monitor with `persistent: true` is
 * capped at 30 minutes. Tool result: "expires in 30m unless the
 * source ends first; you get one notice at expiry — re-arm if you
 * still need the watch." After 30m: `[Monitor expired after 30m …]`.
 * Documented behaviour (and earlier September sessions): persistent
 * Monitor runs until session ends or TaskStop; timeout_ms ignored.
 * Repro: Interactive Linux (Arch), Claude Code 2.1.272;
 * Monitor({command: "python3 watch.py --interval 180",
 * description: "new mail", persistent: true, timeout_ms: 3600000})
 * → expires in 30m. Impact: mail/webhook/queue watches must
 * re-arm every 30m; events between expiry and re-arm are missed;
 * `persistent` flag is misleading.
 *
 * Encoded from #94553 issue text only. Hypothesis NON-BINDING: a
 * hard 30m cap was introduced without changelog/docs; restore
 * session-long persistent or make cap configurable and documented.
 * Invite verify against #94553 text only. Do NOT claim a root cause
 * in Claude Code source you have not seen. No network. No exploits.
 *
 *   node caducity.mjs data/lapsed.json
 *   echo '{"seed":"lapsed"}' | node caducity.mjs
 *
 * Idle word is abiding (HOLD: perennial / tenured / enduring).
 * Seeded word is lapsed. Path word is thirty-cap.
 * Product score word is caducity (Score caducity or admit abiding.).
 *
 * NOT Efface credential-mask. NOT Apocope WebFetch-cut. NOT Precis
 * skill-drop. NOT Detent mouse-dead. NOT Orloj/#94393 (cite-only).
 */

/* Browser-safe: no top-level node: imports. CLI I/O is loaded only in main(). */

export const VERDICTS = Object.freeze([
  "abiding",
  "lapsed",
  "thirty-cap",
  "perennial",
  "tenured",
  "enduring",
  "session-long",
  "schema-cap",
  "thirty-minute",
  "persistent-reject",
  "re-arm",
  "active-session",
  "docs-promise",
  "94553",
  "landing",
  "has-repro",
  "cousins",
  "backups",
  "fixtures",
  "walk",
  "closed",
]);

export const IDLE_WORD = "abiding";
export const PATH_WORD = "thirty-cap";
export const SEEDED_WORD = "lapsed";
export const PRODUCT_WORD = "caducity";
export const HOLD = Object.freeze(["abiding"]);
export const HOLD_ALIASES = Object.freeze(["perennial", "tenured", "enduring"]);
export const RECOVER = Object.freeze(["abiding"]);
export const ALARM = Object.freeze(
  VERDICTS.filter((name) => !HOLD.includes(name) && !HOLD_ALIASES.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FORBIDDEN_IDLE = Object.freeze([
  "enrolled",
  "single",
  "pledged",
  "brisk",
  "cadence",
  "suspend",
  "verbatim",
  "quiet",
  "intact",
  "cleared",
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
  "sealed",
  "silenced",
  "living",
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
]);

export const FEATURED_ISSUE = 94553;
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/94553";
export const TITLE =
  "[BUG] Monitor with persistent:true capped at 30 minutes despite active session — false persistence / lease caducously expires";
export const STATE = "OPEN";
export const LABELS = Object.freeze([
  "bug",
  "has repro",
  "platform:linux",
  "area:tools",
]);
export const PLATFORM = "linux";
export const SURFACE = "thirty-cap";
export const HOST =
  "Claude Code 2.1.272; Interactive Linux (Arch); Monitor({persistent: true, timeout_ms: 3600000}) → expires in 30m";
export const CHECKED_ON =
  "Published report: since ~2.1.268/2.1.272, Monitor armed with persistent:true is capped at 30 minutes; tool says expires in 30m; after 30m Monitor expired after 30m — earlier behaviour was session-long persistent until TaskStop";
export const BUILD = "Claude Code 2.1.272";
export const SELECTED_MODEL =
  "Monitor lifetime thirty-cap — not a model defect";
export const OS = "Ubuntu/Debian Linux; platform:linux / area:tools";
export const PHRASE = "Score caducity or admit abiding.";
export const DISTRIBUTION =
  "The Monitor tool now hard-rejects persistent and timeout_ms above 3600000 (1 hour) even with persistent set, it rejects with a schema validation error, and even a Monitor started with the maximum now allowed (3600000) is reported as expiring after only ~30 minutes — during a continuously active session, not an idle or paused one. Calling Monitor with timeout_ms: 86400000 (24 hours) fails immediately with InputValidationError: timeout_ms must be <= 3600000. Retrying at the allowed maximum (timeout_ms: 3600000) succeeds, but the tool's own confirmation text says the monitor expires in 30m, not 1h: Monitor started (task <id>, expires in 30m unless the source ends first; you get one notice at expiry — re-arm if you still need the watch). Distinct from #63023 / #65968 (background tasks harvested on session pause/idle-suspend): the reporter's session never went idle — it was actively processing task-notification events roughly every 30 minutes, generated by this same monitor's own repeated expiry, for several hours straight. Re-arming immediately after each expiry produces the same ~30-minute lifetime again, indefinitely, regardless of session/user activity. Docs: https://code.claude.com/docs/en/tools-reference#monitor-tool. Expected: no limit on the monitor time, or bring back the old 24h limit; the timeout_ms schema max should match the tool's actual honored lifetime; a Monitor started with any value up to the documented/allowed max should actually run for that long during active use, not silently cap out near 30 minutes. Env: Claude Code 2.1.270; Ubuntu/Debian Linux; Anthropic API.";

export const CODE_BUILD = "2.1.272";
export const SCHEMA_MAX_MS = 3600000;
export const ATTEMPTED_24H_MS = 86400000;
export const HONORED_MINUTES = 30;
export const HONORED_MS = 1800000;
export const CONFIRMATION =
  "expires in 30m unless the source ends first; you get one notice at expiry — re-arm if you still need the watch";
export const EXPIRY_NOTICE =
  "Monitor expired after 30m with no events delivered. Re-arm it if you still need the watch — and widen the filter if silence was unexpected.";
export const VALIDATION_MESSAGE = "timeout_ms must be <= 3600000";
export const DOCS_URL =
  "https://code.claude.com/docs/en/tools-reference#monitor-tool";

/**
 * Synthetic example-data — reconstructs published Monitor shapes.
 * Labeled as such. Not a live dump.
 */
export const SYNTHETIC_LASTING = Object.freeze({
  kind: "abiding",
  timeoutMs: SCHEMA_MAX_MS,
  persistent: false,
  honoredMs: SCHEMA_MAX_MS,
  reported: "expires in 60m",
  sessionIdle: false,
  note: "hour dial holds — abiding",
  synthetic: true,
});
export const SYNTHETIC_LAPSED = Object.freeze({
  kind: "lapsed",
  timeoutMs: SCHEMA_MAX_MS,
  persistent: true,
  persistentHonored: false,
  honoredMs: HONORED_MS,
  reported: "expires in 30m",
  sessionIdle: false,
  note: "clock face promises an hour; mechanism dies at thirty-cap",
  synthetic: true,
});
export const SYNTHETIC_SCHEMA_CAP = Object.freeze({
  kind: "schema-cap",
  timeoutMs: ATTEMPTED_24H_MS,
  rejected: true,
  message: VALIDATION_MESSAGE,
  code: "too_big",
  maximum: SCHEMA_MAX_MS,
  synthetic: true,
});

export const LEDGER_NAMES = Object.freeze([
  {
    id: "hour-dial",
    lost: "Hour dial — schema max timeout_ms 3600000 promises a full hour",
    control: "A Monitor at the allowed max would last the tenured hour",
    story: "the gilt hand should sweep a full circle before the death-bell",
  },
  {
    id: "zodiac-ring",
    lost: "Zodiac ring — InputValidationError: timeout_ms must be <= 3600000",
    control: "86400000 (24h) would be accepted or the docs would match the cap",
    story: "the 24h request is thrown off the zodiac at the schema gate",
  },
  {
    id: "persistent-gate",
    lost: "Persistent gate — persistent is ignored / hard-rejected",
    control: "persistent would keep the watch across the tower's night",
    story: "the automaton apostles never take the abiding procession",
  },
  {
    id: "thirty-chime",
    lost: "Thirty chime — confirmation says expires in 30m, not 1h",
    control: "confirmation would name the accepted timeout_ms",
    story: "Death rings the thirty-cap bell while the face still shows an hour",
  },
  {
    id: "active-tower",
    lost: "Active tower — session never idle; still dies ~30 minutes",
    control: "an active session would keep the watch for the honored max",
    story: "task-notification every ~30m from this monitor's own expiry",
  },
  {
    id: "rearm-walk",
    lost: "Rearm walk — re-arming produces the same ~30-minute lifetime again",
    control: "a fresh Monitor at 3600000 would last the hour",
    story: "the apostles walk, freeze at thirty-cap, and walk again forever",
  },
]);

export const BOOTH_STATIONS = Object.freeze([
  {
    id: "hour-dial",
    survey: "abiding HOLD: schema-tenured hour honored during active use",
    kind: "abiding",
    note: "idle/control: clock face and mechanism agree on one hour",
  },
  {
    id: "zodiac-ring",
    survey: "timeout_ms: 86400000 fails InputValidationError too_big maximum 3600000",
    kind: "lapsed",
    note: "seeded: schema-cap rejects the 24h request",
  },
  {
    id: "persistent-gate",
    survey: "persistent is ignored / hard-rejected even when set",
    kind: "lapsed",
    note: "seeded: persistent-reject",
  },
  {
    id: "thirty-chime",
    survey: "at allowed max 3600000, confirmation says expires in 30m",
    kind: "lapsed",
    note: "seeded: thirty-minute confirmation, not 1h",
  },
  {
    id: "active-tower",
    survey: "session never went idle — actively processing task-notification",
    kind: "lapsed",
    note: "seeded: distinct from #63023 / #65968 idle/pause harvest",
  },
  {
    id: "rearm-walk",
    survey: "thirty-cap — re-arm immediately; same ~30-minute lifetime again",
    kind: "lapsed",
    note: "path: thirty-cap names the silent 30m cap during active use",
  },
]);

export const FIELD_MARKS = Object.freeze([
  {
    id: "schema-cap",
    label: "schema-cap",
    count: "3600000",
    note: "timeout_ms must be <= 3600000; 86400000 rejected",
  },
  {
    id: "thirty-minute",
    label: "thirty-minute",
    count: "30m",
    note: "Confirmation says expires in 30m unless the source ends first",
  },
  {
    id: "persistent-reject",
    label: "persistent-reject",
    count: "hard",
    note: "persistent is ignored / hard-rejected",
  },
  {
    id: "re-arm",
    label: "re-arm",
    count: "perpetual",
    note: "Re-arming immediately after each expiry produces the same ~30m",
  },
  {
    id: "active-session",
    label: "active-session",
    count: "never idle",
    note: "Actively processing task-notification every ~30m for hours",
  },
  {
    id: "docs-promise",
    label: "docs-promise",
    count: "docs",
    note: "Docs imply longer/persistent watches; schema and lifetime disagree",
  },
]);

export const RULED_OUT = Object.freeze([
  "#63023 — Background agents silently die on session pause/resume — framed around session pause/idle-suspend — DIFFERENT defect; cite only",
  "#65968 — closed as a duplicate of #63023, also framed around idle/suspend boundaries — DIFFERENT; cite only",
  "Brisure/#94396 — fork-resume never becomes Remote Control eligible — DIFFERENT",
  "Diptych/#94397 — Remote Control mobile brief-echo double render — DIFFERENT",
  "Vizard/#94398 — background-reset to Opus 4.8 — DIFFERENT",
  "Treacle/#94344 — Windows PowerShell streaming-stall — DIFFERENT",
  "Somnus/#94415 — Cowork schedule device_absent — DIFFERENT",
  "Cresset/#94420 — keep-awake hold-leak — DIFFERENT",
  "Dictabelt/#94406 — voice segment-drop — DIFFERENT",
  "Lemure/#94410 — ghost orphan ScheduledTasks — DIFFERENT",
  "Cancellans/#94400 — resume-fork deferred_tools_delta — DIFFERENT",
  "Arras/#94348 — phantom permission prompt — DIFFERENT",
]);

export const EXPECTED = Object.freeze([
  "We should not have a limit on the monitor time, or bring back the old 24h limit",
  "The timeout_ms schema max should match the tool's actual honored lifetime",
  "A Monitor started with any value up to the documented/allowed max should actually run for that long during active use, not silently cap out near 30 minutes",
]);

export const SUGGESTED_FIX = Object.freeze([
  "At minimum the discrepancy between the accepted schema max (3600000) and the actual observed lifetime (~30 min) should not exist",
  "Either honor the allowed max during active use, or make the schema max match the honored lifetime so a rejected value does not imply a longer-lived monitor is possible",
]);

export const FINGERPRINT_LINES = Object.freeze([
  "thirty-cap",
  "lapsed",
  "schema-cap",
  "thirty-minute",
  "persistent-reject",
]);

export const COUSINS = Object.freeze([
  {
    issue: 63023,
    title: "Background agents silently die on session pause/resume",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — #63023 is idle/pause harvest of background tasks. DIFFERENT failure mode. Do not rebuild. Do not conflate.",
  },
  {
    issue: 65968,
    title: "idle/suspend boundaries (closed as a duplicate of #63023)",
    state: "CLOSED",
    citeOnly: true,
    why: "Cite only — #65968 is framed around idle/suspend boundaries. DIFFERENT. Do not rebuild. Do not conflate.",
  },
]);

export const BACKUPS = Object.freeze([
  { issue: 94560, title: "backup next-focus", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93924, title: "backup next-focus — RC local slowdown", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93770, title: "backup next-focus — copy padding artifacts", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93777, title: "backup next-focus — Vercel MCP teamId", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94151, title: "backup next-focus — Shift+PageUp Konsole", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
]);

export const NOT_PRODUCTS = Object.freeze([
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
  "forksink",
  "diplopia",
  "escutcheon",
]);

export const SAMPLE_KIND_IDLE = "hour-dial";
export const SAMPLE_KIND_SEEDED = "thirty-cap";
export const SAMPLE_HOLDING_IDLE = "session-long";
export const SAMPLE_HOLDING_SEEDED = "thirty-chime";

export const SAMPLE_LASTING_PROOF = Object.freeze({
  abiding: true,
  lapsed: false,
  thirtyCap: false,
  kind: SAMPLE_KIND_IDLE,
});

export const SAMPLE_LAPSED_PROOF = Object.freeze({
  abiding: false,
  lapsed: true,
  thirtyCap: true,
  schemaCap: true,
  thirtyMinute: true,
  persistentReject: true,
  rearmLoop: true,
  activeSession: true,
  docsPromise: true,
  kind: SAMPLE_KIND_SEEDED,
  names: LEDGER_NAMES.map((row) => row.id),
  abidingWatch: { ...SYNTHETIC_LASTING },
  lapsedWatch: { ...SYNTHETIC_LAPSED },
  schemaShape: { ...SYNTHETIC_SCHEMA_CAP },
  synthetic: true,
});

export const SAMPLE_WALK_LOG = Object.freeze([
  { t: "idle", line: "booth holds abiding: schema-tenured hour honored during active use" },
  { t: "thirty-cap", line: "at allowed max 3600000, confirmation says expires in 30m; watch dies ~30 minutes" },
  { t: "path", line: "thirty-cap — perpetual re-arm; session never idle" },
  { t: "score", line: "when the face promises an hour and the mechanism dies at thirty-cap the booth is lapsed — Score caducity or admit abiding." },
]);

const FORCE_FLAGS = [
  "thirtyCap",
  "schemaCap",
  "thirtyMinute",
  "persistentReject",
  "rearmLoop",
  "activeSession",
  "docsPromise",
];

const ISSUE_CUE_RE =
  /94553|timeout_ms|3600000|86400000|InputValidationError|expires in 30m|persistent|task-notification|Monitor/i;

/**
 * Educational timeout schema. Not a Claude Code patch.
 * Encodes only the published #94553 shapes.
 *
 * requested <= 3600000: accepted by schema.
 * requested > 3600000: InputValidationError too_big.
 */
export function validateTimeoutMs(timeoutMs = SCHEMA_MAX_MS) {
  if (timeoutMs > SCHEMA_MAX_MS) {
    return {
      ok: false,
      rejected: true,
      code: "too_big",
      maximum: SCHEMA_MAX_MS,
      message: VALIDATION_MESSAGE,
      timeoutMs,
      phrase: "score caducity",
    };
  }
  return {
    ok: true,
    rejected: false,
    timeoutMs,
    maximum: SCHEMA_MAX_MS,
    phrase: "admit abiding",
  };
}

/**
 * Educational persistent flag. Not a Claude Code patch.
 * persistent is ignored / hard-rejected.
 */
export function persistFlag(persistent = false) {
  if (persistent === true) {
    return {
      honored: false,
      rejected: true,
      persistent: true,
      note: "persistent is ignored / hard-rejected",
      phrase: "score caducity",
    };
  }
  return {
    honored: false,
    rejected: false,
    persistent: false,
    phrase: "admit abiding",
  };
}

/**
 * Educational lifetime observer. Not a Claude Code patch.
 * Even at the allowed max, confirmation says expires in 30m
 * and the watch dies ~30 minutes during an active session.
 */
export function observeLifetime({
  timeoutMs = SCHEMA_MAX_MS,
  persistent = false,
  sessionIdle = false,
  abiding = false,
} = {}) {
  const schema = validateTimeoutMs(timeoutMs);
  if (!schema.ok) {
    return {
      ...schema,
      lifetimeMin: null,
      confirmation: null,
      sessionIdle,
    };
  }
  const persist = persistFlag(persistent);
  if (abiding === true) {
    return {
      ok: true,
      requestedMs: timeoutMs,
      reported: "expires in 60m",
      lifetimeMin: 60,
      honoredMs: SCHEMA_MAX_MS,
      sessionIdle,
      persistentHonored: persist.honored,
      phrase: "admit abiding",
      synthetic: true,
    };
  }
  return {
    ok: true,
    requestedMs: timeoutMs,
    reported: "expires in 30m",
    lifetimeMin: HONORED_MINUTES,
    honoredMs: HONORED_MS,
    confirmation: CONFIRMATION,
    sessionIdle,
    persistentHonored: persist.honored,
    persistentRejected: persist.rejected,
    phrase: "score caducity",
    synthetic: true,
  };
}

export function rearmWatch() {
  return {
    lifetimeMin: HONORED_MINUTES,
    again: true,
    phrase: "score caducity",
    note: "Re-arming immediately after each expiry produces the same ~30-minute lifetime again",
    synthetic: true,
  };
}

/**
 * Educational hour honor. Not a Claude Code patch.
 * abiding=true is the HOLD / tenured-hour path.
 */
export function honorHour({
  abiding = false,
  timeoutMs = SCHEMA_MAX_MS,
} = {}) {
  if (abiding === true) {
    return {
      abiding: true,
      honoredMs: SCHEMA_MAX_MS,
      lifetimeMin: 60,
      phrase: "admit abiding",
      synthetic: true,
    };
  }
  const observed = observeLifetime({ timeoutMs, abiding: false });
  return {
    abiding: false,
    honoredMs: observed.honoredMs ?? HONORED_MS,
    lifetimeMin: observed.lifetimeMin ?? HONORED_MINUTES,
    phrase: "score caducity",
    synthetic: true,
  };
}

export function scoreThirtyCap(input = {}) {
  const abidingHold = input.abiding === true && input.lapsed !== true;
  const hour = honorHour({
    abiding: abidingHold,
    timeoutMs: input.timeoutMs ?? SCHEMA_MAX_MS,
  });
  const lapsed =
    !abidingHold &&
    (hour.abiding === false ||
      input.lapsed === true ||
      input.thirtyCap === true ||
      input.thirtyMinute === true ||
      input.schemaCap === true);
  return {
    abiding: !lapsed,
    lapsed,
    thirtyCap: lapsed,
    hour,
    phrase: lapsed ? "score caducity" : "admit abiding",
  };
}

export function mentionsIssueCue(input = {}) {
  if (input.issue === FEATURED_ISSUE || input.issue === "94553") return true;
  const blob = typeof input === "string" ? input : JSON.stringify(input);
  return ISSUE_CUE_RE.test(blob);
}

export function mapCaducity(input = {}) {
  const lapsed = isLapsedInput(input);
  const abiding = input.abiding === true && !lapsed;
  return {
    stamp: lapsed ? "thirty-cap" : "session-long",
    holdingLane: lapsed ? "thirty-chime" : "session-long",
    kindLane: lapsed ? "thirty-cap" : "hour-dial",
    bindLane: lapsed ? "active-tower" : "tenured",
    ribbon: lapsed ? "lapsed" : "abiding",
    abiding,
  };
}

export function inspectSchemaCap(input = {}) {
  const capped =
    input.schemaCap === true ||
    input.lapsed === true ||
    input.thirtyCap === true ||
    isLapsedInput(input);
  if (input.abiding === true && !capped) {
    return { stamp: "perennial", capped: false, note: "schema and face agree" };
  }
  return {
    stamp: capped ? "schema-cap" : "schema-idle",
    capped,
    note: capped
      ? "schema-cap — timeout_ms must be <= 3600000; 86400000 rejected"
      : "",
  };
}

export function inspectThirty(input = {}) {
  const thirty =
    input.thirtyMinute === true ||
    input.lapsed === true ||
    isLapsedInput(input);
  if (input.abiding === true && !thirty) {
    return { stamp: "tenured", thirty: false };
  }
  return {
    stamp: thirty ? "thirty-minute" : "chime-idle",
    thirty,
    note: thirty
      ? "thirty-minute — confirmation says expires in 30m unless the source ends first"
      : "",
  };
}

export function inspectPersistent(input = {}) {
  const rejected =
    input.persistentReject === true ||
    input.lapsed === true ||
    isLapsedInput(input);
  if (input.abiding === true && !rejected) {
    return { stamp: "enduring", rejected: false };
  }
  return {
    stamp: rejected ? "persistent-reject" : "persist-idle",
    rejected,
    note: rejected
      ? "persistent-reject — persistent is ignored / hard-rejected"
      : "",
  };
}

export function inspectRearm(input = {}) {
  const loop =
    input.rearmLoop === true ||
    input.lapsed === true ||
    input.thirtyCap === true ||
    isLapsedInput(input);
  if (input.abiding === true && !loop) {
    return { stamp: "session-long", loop: false };
  }
  return {
    stamp: loop ? "re-arm" : "rearm-idle",
    loop,
    note: loop
      ? "re-arm — same ~30-minute lifetime again, indefinitely"
      : "",
  };
}

export function inspectActive(input = {}) {
  const active =
    input.activeSession === true ||
    input.lapsed === true ||
    isLapsedInput(input);
  if (input.abiding === true && !active) {
    return { stamp: "hour-dial", active: false };
  }
  return {
    stamp: active ? "active-session" : "tower-idle",
    active,
    note: active
      ? "active-session — never idle; task-notification every ~30m from this monitor's own expiry"
      : "",
  };
}

function ledgerOpen(input, id) {
  const map = {
    "hour-dial": input.lapsed || input.thirtyCap,
    "zodiac-ring": input.schemaCap || input.lapsed,
    "persistent-gate": input.persistentReject || input.lapsed,
    "thirty-chime": input.thirtyMinute || input.lapsed,
    "active-tower": input.activeSession || input.lapsed,
    "rearm-walk": input.rearmLoop || input.thirtyCap || input.lapsed,
  };
  return (
    map[id] === true ||
    input.thirtyCap === true ||
    input.lapsed === true
  );
}

function isLapsedInput(input = {}) {
  return (
    input.lapsed === true ||
    input.thirtyCap === true ||
    input.schemaCap === true ||
    input.thirtyMinute === true ||
    input.persistentReject === true ||
    input.rearmLoop === true ||
    input.activeSession === true ||
    input.docsPromise === true
  );
}

export function readBooth(input = {}) {
  const lapsed = isLapsedInput(input);
  const abiding = input.abiding === true && !lapsed;
  return {
    mark: lapsed ? "lapsed" : "abiding",
    abiding,
    lapsed,
    thirtyCap: input.thirtyCap === true || lapsed,
    schemaCap: input.schemaCap === true,
    thirtyMinute: input.thirtyMinute === true,
    persistentReject: input.persistentReject === true,
    rearmLoop: input.rearmLoop === true,
    activeSession: input.activeSession === true,
    docsPromise: input.docsPromise === true,
    tower: mapCaducity(input),
    schema: inspectSchemaCap(input),
    thirty: inspectThirty(input),
    persist: inspectPersistent(input),
    rearm: inspectRearm(input),
    active: inspectActive(input),
    names: LEDGER_NAMES.filter((row) => ledgerOpen(input, row.id)).map(
      (row) => row.id,
    ),
    log: input.log || [],
  };
}

export const CADUCITY_WALK = Object.freeze([
  {
    t: "idle",
    event: "session-long",
    abiding: true,
    lapsed: false,
    cue: "abiding",
    note: "idle HOLD: schema-tenured hour honored during active use",
  },
  {
    t: "thirty-cap",
    event: "thirty-cap",
    lapsed: true,
    thirtyCap: true,
    thirtyMinute: true,
    schemaCap: true,
    cue: "lapsed",
    note: "at allowed max 3600000, confirmation says expires in 30m; watch dies ~30 minutes",
  },
  {
    t: "path",
    event: "thirty-cap",
    lapsed: true,
    thirtyCap: true,
    schemaCap: true,
    thirtyMinute: true,
    persistentReject: true,
    rearmLoop: true,
    activeSession: true,
    docsPromise: true,
    cue: "lapsed",
    note: "thirty-cap — perpetual re-arm; session never idle",
  },
  {
    t: "score",
    event: "lapsed",
    lapsed: true,
    thirtyCap: true,
    schemaCap: true,
    thirtyMinute: true,
    persistentReject: true,
    rearmLoop: true,
    activeSession: true,
    docsPromise: true,
    cue: "lapsed",
    note: "lapsed — the clock face promises an hour; the mechanism dies at thirty-cap",
  },
]);

export const POSITIVE_CONTROL_WALK = Object.freeze([
  {
    t: "hold",
    event: "session-long",
    abiding: true,
    lapsed: false,
    cue: "abiding",
    note: "positive control: schema-tenured hour honored during active use",
  },
  {
    t: "admit",
    event: "session-long",
    abiding: true,
    cue: "abiding",
    note: "positive control: the tower admits abiding",
  },
]);

function classifyFromSeed(seed) {
  if (seed && VERDICTS.includes(seed)) return seed;
  return null;
}

export function emptyTicket() {
  return {
    seed: IDLE_WORD,
    abiding: true,
    lapsed: false,
    thirtyCap: false,
    cue: "abiding",
  };
}

export function seedAbiding() {
  return { ...emptyTicket() };
}

export function seedLapsed() {
  return {
    seed: SEEDED_WORD,
    abiding: false,
    lapsed: true,
    thirtyCap: true,
    schemaCap: true,
    thirtyMinute: true,
    persistentReject: true,
    rearmLoop: true,
    activeSession: true,
    docsPromise: true,
    cue: "lapsed",
    issue: FEATURED_ISSUE,
    proof: SAMPLE_LAPSED_PROOF,
  };
}

export function seedProduct() {
  return {
    seed: PRODUCT_WORD,
    preferSeed: true,
    lapsed: true,
    thirtyCap: true,
    cue: "lapsed",
  };
}

export function seedThirtyCap() {
  return {
    seed: PATH_WORD,
    preferSeed: true,
    lapsed: true,
    thirtyCap: true,
    event: "thirty-cap",
    cue: "lapsed",
  };
}

export function seedHourlong() {
  return { seed: "perennial", preferSeed: true, abiding: true, cue: "abiding" };
}

export function seedPromised() {
  return { seed: "tenured", preferSeed: true, abiding: true, cue: "abiding" };
}

export function seedDiurnal() {
  return { seed: "enduring", preferSeed: true, abiding: true, cue: "abiding" };
}

export function seedSessionLong() {
  return { seed: "session-long", preferSeed: true, abiding: true, cue: "abiding" };
}

export function seedSchemaCap() {
  return {
    seed: "schema-cap",
    preferSeed: true,
    schemaCap: true,
    cue: "lapsed",
  };
}

export function seedThirty() {
  return {
    seed: "thirty-minute",
    preferSeed: true,
    thirtyMinute: true,
    cue: "lapsed",
  };
}

export function normalizeBooth(raw) {
  if (!raw || typeof raw !== "object") {
    return {
      abiding: false,
      lapsed: false,
      thirtyCap: false,
      schemaCap: false,
      thirtyMinute: false,
      persistentReject: false,
      rearmLoop: false,
      activeSession: false,
      docsPromise: false,
      cue: null,
      event: null,
      t: null,
    };
  }
  return {
    abiding: raw.abiding === true,
    lapsed: raw.lapsed === true || raw.event === "lapsed",
    thirtyCap: raw.thirtyCap === true || raw.event === "thirty-cap",
    schemaCap: raw.schemaCap === true || raw.event === "schema-cap",
    thirtyMinute:
      raw.thirtyMinute === true || raw.event === "thirty-minute",
    persistentReject:
      raw.persistentReject === true || raw.event === "persistent-reject",
    rearmLoop: raw.rearmLoop === true || raw.event === "re-arm",
    activeSession:
      raw.activeSession === true || raw.event === "active-session",
    docsPromise: raw.docsPromise === true || raw.event === "docs-promise",
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
      (ticket.abiding != null ||
        ticket.lapsed != null ||
        ticket.thirtyCap != null ||
        ticket.schemaCap != null ||
        ticket.thirtyMinute != null ||
        ticket.persistentReject != null ||
        ticket.rearmLoop != null ||
        ticket.activeSession != null ||
        ticket.docsPromise != null ||
        ticket.cue != null ||
        ticket.event ||
        ticket.proof),
  );
}

function isLasting(row) {
  if (row.lapsed && row.cue !== "abiding") return false;
  if (row.cue === "lapsed" || row.cue === "thirty-cap") return false;
  if (
    row.thirtyCap &&
    row.thirtyMinute &&
    row.cue !== "abiding" &&
    row.abiding !== true
  ) {
    return false;
  }
  if (
    row.abiding === true &&
    row.lapsed !== true &&
    row.cue !== "lapsed"
  ) {
    return true;
  }
  if (
    row.cue === "abiding" &&
    row.lapsed !== true &&
    row.thirtyCap !== true &&
    FORCE_FLAGS.every((flag) => row[flag] !== true)
  ) {
    return true;
  }
  return false;
}

function isThirtyCap(row) {
  return (
    row.event === "thirty-cap" &&
    !isLasting(row) &&
    (row.thirtyCap === true ||
      row.thirtyMinute === true ||
      row.lapsed === true)
  );
}

function isCaducityRow(row) {
  if (isLasting(row)) return false;
  if (isThirtyCap(row) && row.cue !== "lapsed") return false;
  if (row.cue === "lapsed") return true;
  if (row.lapsed === true) return true;
  if (row.thirtyCap === true && row.thirtyMinute === true) return true;
  if (
    row.thirtyCap === true ||
    row.schemaCap === true ||
    row.thirtyMinute === true ||
    row.persistentReject === true ||
    row.rearmLoop === true ||
    row.activeSession === true ||
    row.docsPromise === true
  ) {
    return true;
  }
  return false;
}

/**
 * Score one lapsed pass against the lease watch desk.
 * abiding: schema-tenured hour honored during active use.
 * lapsed: clock face promises an hour; mechanism dies at thirty-cap.
 * thirty-cap: names that path.
 */
export function scoreGate(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const row = normalizeBooth(ticket);
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);

  let verdict = IDLE_WORD;
  if (
    isThirtyCap(row) ||
    (row.thirtyCap && ticket.preferSeed && seeded === PATH_WORD)
  ) {
    verdict = "thirty-cap";
  } else if (isCaducityRow(row)) {
    verdict = "lapsed";
  } else if (isLasting(row)) {
    verdict = "abiding";
  } else if (
    row.thirtyCap ||
    row.schemaCap ||
    row.thirtyMinute ||
    row.persistentReject ||
    row.rearmLoop ||
    row.activeSession ||
    row.docsPromise
  ) {
    verdict = "lapsed";
  } else if (mentionsIssueCue(ticket) && !seeded) {
    verdict = "lapsed";
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
    abiding: verdict === "abiding",
    lapsed: verdict === "lapsed" || verdict === SEEDED_WORD,
    thirtyCap:
      row.thirtyCap === true ||
      verdict === "thirty-cap" ||
      verdict === PATH_WORD,
    schemaCap: row.schemaCap,
    thirtyMinute: row.thirtyMinute,
    persistentReject: row.persistentReject,
    rearmLoop: row.rearmLoop,
    activeSession: row.activeSession,
    docsPromise: row.docsPromise,
    cue: hold
      ? "abiding"
      : row.thirtyCap || verdict === "thirty-cap"
        ? "thirty-cap"
        : "lapsed",
    event: row.event,
    t: row.t,
    phrase: hold ? "admit abiding" : "score caducity",
    schemaInspect: inspectSchemaCap(row),
    thirtyInspect: inspectThirty(row),
    persistInspect: inspectPersistent(row),
    rearmInspect: inspectRearm(row),
    activeInspect: inspectActive(row),
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
      : CADUCITY_WALK;
  const scored = rows.map((row) => ({
    ...normalizeBooth(row),
    ...scoreGate({ ...row, preferSeed: false }),
  }));
  const charged = scored.filter((row) => row.verdict === "lapsed");
  const path = scored.filter((row) => row.verdict === "thirty-cap");
  const abiding = scored.filter((row) => row.verdict === "abiding");
  const headline =
    scored.find((row) => row.event === "lapsed") ||
    scored.find((row) => row.event === "thirty-cap") ||
    scored.find((row) => row.event === "thirty-minute") ||
    charged[charged.length - 1];
  let verdict = "abiding";
  if (charged.length) verdict = "lapsed";
  else if (path.length && !abiding.length) {
    verdict = "thirty-cap";
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
    lapsedCount: charged.length,
    pathCount: path.length,
    abidingCount: abiding.length,
    headline,
    rows: scored,
    phrase: HOLD.includes(verdict) ? "admit abiding" : "score caducity",
    note: headline
      ? "Monitor tool schema caps timeout_ms at 3600000 and ignores persistent; even at the allowed max the tool reports expires in 30m and dies ~30 minutes during an active session. Cite-only cousins #63023 #65968."
      : "published caducity walk scored against abiding vs lapsed",
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
    seeded !== "abiding" &&
    seeded !== "lapsed" &&
    seeded !== "thirty-cap" &&
    ticket.abiding == null &&
    ticket.lapsed == null &&
    ticket.thirtyCap == null &&
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
    abiding: scored.abiding ?? false,
    lapsed: scored.lapsed ?? false,
    thirtyCap: scored.thirtyCap ?? false,
    schemaCap: scored.schemaCap ?? false,
    thirtyMinute: scored.thirtyMinute ?? false,
    persistentReject: scored.persistentReject ?? false,
    rearmLoop: scored.rearmLoop ?? false,
    activeSession: scored.activeSession ?? false,
    docsPromise: scored.docsPromise ?? false,
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
    result.thirtyCap || result.lapsed
      ? "kind=thirty-cap"
      : "kind=hour-dial",
    result.thirtyMinute || result.lapsed
      ? "ref=thirty-minute"
      : "ref=session-long",
    result.thirtyCap || result.verdict === "thirty-cap"
      ? "path=thirty-cap"
      : "path=abiding",
    result.cue === "abiding"
      ? "cue=abiding"
      : result.cue === "thirty-cap"
        ? "cue=thirty-cap"
        : "cue=lapsed",
  ].join("|");
}

export function handle(input) {
  const result = analyze(input);
  const booth = readBooth({
    abiding: result.abiding,
    lapsed: result.lapsed,
    thirtyCap: result.thirtyCap,
    schemaCap: result.schemaCap,
    thirtyMinute: result.thirtyMinute,
    persistentReject: result.persistentReject,
    rearmLoop: result.rearmLoop,
    activeSession: result.activeSession,
    docsPromise: result.docsPromise,
    proof: input && input.proof,
    log: input && input.log,
  });
  return {
    ...result,
    fingerprint: fingerprint(input),
    booth,
    schema: inspectSchemaCap({
      abiding: result.abiding,
      lapsed: result.lapsed,
      schemaCap: result.schemaCap,
    }),
    thirty: inspectThirty({
      abiding: result.abiding,
      lapsed: result.lapsed,
      thirtyMinute: result.thirtyMinute,
    }),
    persist: inspectPersistent({
      abiding: result.abiding,
      lapsed: result.lapsed,
      persistentReject: result.persistentReject,
    }),
    rearm: inspectRearm({
      abiding: result.abiding,
      lapsed: result.lapsed,
      rearmLoop: result.rearmLoop,
    }),
    active: inspectActive({
      abiding: result.abiding,
      lapsed: result.lapsed,
      activeSession: result.activeSession,
    }),
    tower: mapCaducity({
      abiding: result.abiding,
      lapsed: result.lapsed,
      thirtyCap: result.thirtyCap,
      thirtyMinute: result.thirtyMinute,
    }),
    stations: BOOTH_STATIONS.map((row) => ({
      ...row,
      lapsed: result.lapsed === true || result.verdict === "lapsed",
    })),
    leakPath: scoreThirtyCap({
      abiding: result.abiding === true && !result.lapsed,
      lapsed: result.lapsed,
      thirtyCap: result.thirtyCap,
      thirtyMinute: result.thirtyMinute,
      schemaCap: result.schemaCap,
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
      hypothesis:
        "NON-BINDING (issue text): a hard 30m cap on persistent:true may have been introduced without changelog/docs; restore session-long persistent or make cap configurable and documented. Invite verify against #94553 text only. Do not claim a root cause in Claude Code source you have not seen.",
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
