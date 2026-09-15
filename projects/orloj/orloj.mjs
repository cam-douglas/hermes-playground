#!/usr/bin/env node
/**
 * Orloj — Prague astronomical clock / clock tower / zodiac dial /
 * automaton apostles / calendar dial booth.
 * A *orloj* is the Prague astronomical clock: the face promises a
 * full hour (schema max timeout_ms 3600000) while the mechanism
 * dies at half-life (~30 minutes) even during an active session.
 * Persistent is ignored / hard-rejected. Re-arming the watch after
 * each expiry produces the same ~30-minute lifetime again.
 * Night indigo / gilt brass / clock-face cream / rust automaton red.
 * NOT Brisure herald college. NOT Diptych wax-tablet. NOT Vizard
 * masque-ball. NOT Treacle kettle. NOT Somnus sleep clinic.
 * NOT Cresset fire-basket. NOT Dictabelt wax-belt. NOT Lemure
 * lararium. NOT Cancellans binder. NOT Arras tapestry.
 *
 * Educational diagnostic model for a published Claude Monitor
 * defect: the Monitor tool schema accepts timeout_ms up to
 * 3600000 (1h) and docs imply longer/persistent watches, but in
 * practice (1) persistent is ignored / hard-rejected, (2)
 * timeout_ms > 3600000 fails schema validation
 * (InputValidationError: timeout_ms must be <= 3600000 when
 * calling with 86400000), (3) even a Monitor started at the
 * allowed max is reported as "expires in 30m" and actually dies
 * ~30 minutes during a continuously active session — forcing
 * perpetual re-arm. Distinct from #63023 / #65968 (background
 * tasks harvested on session pause/idle-suspend): the reporter's
 * session never went idle — actively processing task-notification
 * every ~30m from this monitor's own expiry for hours.
 *
 * Encoded from anthropics/claude-code#94393 issue text only.
 * Hypothesis (NON-BINDING — issue text): schema max / docs
 * disagree with honored lifetime; silent ~30m cap during active
 * use. Invite verify against #94393 text only. Do NOT claim a
 * root cause in Claude Code source you have not seen. Do NOT
 * implement a Claude Code fix. No network. No exploits.
 * No live Claude.
 *
 *   node orloj.mjs data/orloj.json
 *   echo '{"seed":"orloj"}' | node orloj.mjs
 *
 * Idle word is lasting (HOLD: schema-promised hour honored).
 * HOLD aliases: hourlong, promised, diurnal, calendar.
 * Seeded word is orloj (#94393 path).
 * Path word is half-life.
 * Product score word is orloj (Score orloj or admit lasting.).
 *
 * NOT #63023 / #65968 (idle/pause harvest of background tasks).
 * Same family of "watch dies" words but DIFFERENT defect.
 */

/* Browser-safe: no top-level node: imports. CLI I/O is loaded only in main(). */

export const VERDICTS = Object.freeze([
  "lasting",
  "orloj",
  "half-life",
  "hourlong",
  "promised",
  "diurnal",
  "calendar",
  "schema-cap",
  "thirty-minute",
  "persistent-reject",
  "re-arm",
  "active-session",
  "docs-promise",
  "94393",
  "landing",
  "has-repro",
  "cousins",
  "backups",
  "fixtures",
  "walk",
  "closed",
]);

export const IDLE_WORD = "lasting";
export const PATH_WORD = "half-life";
export const SEEDED_WORD = "orloj";
export const PRODUCT_WORD = "orloj";
export const HOLD = Object.freeze(["lasting"]);
export const HOLD_ALIASES = Object.freeze([
  "hourlong",
  "promised",
  "diurnal",
  "calendar",
]);
export const RECOVER = Object.freeze(["lasting"]);
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

export const FEATURED_ISSUE = 94393;
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/94393";
export const TITLE =
  "[BUG] Monitor tool: doesn't respect persistent flag and timeout_ms schema caps at 3600000 but actual lifetime is ~30 minutes, even during active (non-idle) sessions";
export const STATE = "OPEN";
export const LABELS = Object.freeze([
  "bug",
  "has repro",
  "platform:linux",
  "area:tools",
]);
export const PLATFORM = "linux";
export const SURFACE = "half-life";
export const HOST =
  "Claude Code 2.1.270; Ubuntu/Debian Linux; Anthropic API; Non-interactive/CI environment";
export const CHECKED_ON =
  "Published report: Monitor hard-rejects persistent and timeout_ms above 3600000; even at the allowed max the confirmation says expires in 30m and the watch dies ~30 minutes during a continuously active session";
export const BUILD = "Claude Code 2.1.270";
export const SELECTED_MODEL =
  "Monitor lifetime half-life — not a model defect";
export const OS = "Ubuntu/Debian Linux; platform:linux / area:tools";
export const PHRASE = "Score orloj or admit lasting.";
export const DISTRIBUTION =
  "The Monitor tool now hard-rejects persistent and timeout_ms above 3600000 (1 hour) even with persistent set, it rejects with a schema validation error, and even a Monitor started with the maximum now allowed (3600000) is reported as expiring after only ~30 minutes — during a continuously active session, not an idle or paused one. Calling Monitor with timeout_ms: 86400000 (24 hours) fails immediately with InputValidationError: timeout_ms must be <= 3600000. Retrying at the allowed maximum (timeout_ms: 3600000) succeeds, but the tool's own confirmation text says the monitor expires in 30m, not 1h: Monitor started (task <id>, expires in 30m unless the source ends first; you get one notice at expiry — re-arm if you still need the watch). Distinct from #63023 / #65968 (background tasks harvested on session pause/idle-suspend): the reporter's session never went idle — it was actively processing task-notification events roughly every 30 minutes, generated by this same monitor's own repeated expiry, for several hours straight. Re-arming immediately after each expiry produces the same ~30-minute lifetime again, indefinitely, regardless of session/user activity. Docs: https://code.claude.com/docs/en/tools-reference#monitor-tool. Expected: no limit on the monitor time, or bring back the old 24h limit; the timeout_ms schema max should match the tool's actual honored lifetime; a Monitor started with any value up to the documented/allowed max should actually run for that long during active use, not silently cap out near 30 minutes. Env: Claude Code 2.1.270; Ubuntu/Debian Linux; Anthropic API.";

export const CODE_BUILD = "2.1.270";
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
  kind: "lasting",
  timeoutMs: SCHEMA_MAX_MS,
  persistent: false,
  honoredMs: SCHEMA_MAX_MS,
  reported: "expires in 60m",
  sessionIdle: false,
  note: "hour dial holds — lasting",
  synthetic: true,
});
export const SYNTHETIC_ORLOJ = Object.freeze({
  kind: "orloj",
  timeoutMs: SCHEMA_MAX_MS,
  persistent: true,
  persistentHonored: false,
  honoredMs: HONORED_MS,
  reported: "expires in 30m",
  sessionIdle: false,
  note: "clock face promises an hour; mechanism dies at half-life",
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
    control: "A Monitor at the allowed max would last the promised hour",
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
    story: "the automaton apostles never take the lasting procession",
  },
  {
    id: "thirty-chime",
    lost: "Thirty chime — confirmation says expires in 30m, not 1h",
    control: "confirmation would name the accepted timeout_ms",
    story: "Death rings the half-life bell while the face still shows an hour",
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
    story: "the apostles walk, freeze at half-life, and walk again forever",
  },
]);

export const BOOTH_STATIONS = Object.freeze([
  {
    id: "hour-dial",
    survey: "lasting HOLD: schema-promised hour honored during active use",
    kind: "lasting",
    note: "idle/control: clock face and mechanism agree on one hour",
  },
  {
    id: "zodiac-ring",
    survey: "timeout_ms: 86400000 fails InputValidationError too_big maximum 3600000",
    kind: "orloj",
    note: "seeded: schema-cap rejects the 24h request",
  },
  {
    id: "persistent-gate",
    survey: "persistent is ignored / hard-rejected even when set",
    kind: "orloj",
    note: "seeded: persistent-reject",
  },
  {
    id: "thirty-chime",
    survey: "at allowed max 3600000, confirmation says expires in 30m",
    kind: "orloj",
    note: "seeded: thirty-minute confirmation, not 1h",
  },
  {
    id: "active-tower",
    survey: "session never went idle — actively processing task-notification",
    kind: "orloj",
    note: "seeded: distinct from #63023 / #65968 idle/pause harvest",
  },
  {
    id: "rearm-walk",
    survey: "half-life — re-arm immediately; same ~30-minute lifetime again",
    kind: "orloj",
    note: "path: half-life names the silent 30m cap during active use",
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
  "half-life",
  "orloj",
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
  { issue: 94392, title: "backup next-focus", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 86198, title: "backup next-focus", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94417, title: "backup next-focus", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94452, title: "backup next-focus", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94451, title: "backup next-focus", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94430, title: "backup next-focus", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94458, title: "backup next-focus", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93924, title: "backup next-focus", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93770, title: "backup next-focus", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93777, title: "backup next-focus", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94151, title: "backup next-focus", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
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
export const SAMPLE_KIND_SEEDED = "half-life";
export const SAMPLE_HOLDING_IDLE = "calendar";
export const SAMPLE_HOLDING_SEEDED = "thirty-chime";

export const SAMPLE_LASTING_PROOF = Object.freeze({
  lasting: true,
  orloj: false,
  halfLife: false,
  kind: SAMPLE_KIND_IDLE,
});

export const SAMPLE_ORLOJ_PROOF = Object.freeze({
  lasting: false,
  orloj: true,
  halfLife: true,
  schemaCap: true,
  thirtyMinute: true,
  persistentReject: true,
  rearmLoop: true,
  activeSession: true,
  docsPromise: true,
  kind: SAMPLE_KIND_SEEDED,
  names: LEDGER_NAMES.map((row) => row.id),
  lastingWatch: { ...SYNTHETIC_LASTING },
  orlojWatch: { ...SYNTHETIC_ORLOJ },
  schemaShape: { ...SYNTHETIC_SCHEMA_CAP },
  synthetic: true,
});

export const SAMPLE_WALK_LOG = Object.freeze([
  { t: "idle", line: "booth holds lasting: schema-promised hour honored during active use" },
  { t: "half-life", line: "at allowed max 3600000, confirmation says expires in 30m; watch dies ~30 minutes" },
  { t: "path", line: "half-life — perpetual re-arm; session never idle" },
  { t: "score", line: "when the face promises an hour and the mechanism dies at half-life the booth is orloj — Score orloj or admit lasting." },
]);

const FORCE_FLAGS = [
  "halfLife",
  "schemaCap",
  "thirtyMinute",
  "persistentReject",
  "rearmLoop",
  "activeSession",
  "docsPromise",
];

const ISSUE_CUE_RE =
  /94393|timeout_ms|3600000|86400000|InputValidationError|expires in 30m|persistent|task-notification|Monitor/i;

/**
 * Educational timeout schema. Not a Claude Code patch.
 * Encodes only the published #94393 shapes.
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
      phrase: "score orloj",
    };
  }
  return {
    ok: true,
    rejected: false,
    timeoutMs,
    maximum: SCHEMA_MAX_MS,
    phrase: "admit lasting",
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
      phrase: "score orloj",
    };
  }
  return {
    honored: false,
    rejected: false,
    persistent: false,
    phrase: "admit lasting",
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
  lasting = false,
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
  if (lasting === true) {
    return {
      ok: true,
      requestedMs: timeoutMs,
      reported: "expires in 60m",
      lifetimeMin: 60,
      honoredMs: SCHEMA_MAX_MS,
      sessionIdle,
      persistentHonored: persist.honored,
      phrase: "admit lasting",
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
    phrase: "score orloj",
    synthetic: true,
  };
}

export function rearmWatch() {
  return {
    lifetimeMin: HONORED_MINUTES,
    again: true,
    phrase: "score orloj",
    note: "Re-arming immediately after each expiry produces the same ~30-minute lifetime again",
    synthetic: true,
  };
}

/**
 * Educational hour honor. Not a Claude Code patch.
 * lasting=true is the HOLD / promised-hour path.
 */
export function honorHour({
  lasting = false,
  timeoutMs = SCHEMA_MAX_MS,
} = {}) {
  if (lasting === true) {
    return {
      lasting: true,
      honoredMs: SCHEMA_MAX_MS,
      lifetimeMin: 60,
      phrase: "admit lasting",
      synthetic: true,
    };
  }
  const observed = observeLifetime({ timeoutMs, lasting: false });
  return {
    lasting: false,
    honoredMs: observed.honoredMs ?? HONORED_MS,
    lifetimeMin: observed.lifetimeMin ?? HONORED_MINUTES,
    phrase: "score orloj",
    synthetic: true,
  };
}

export function scoreHalfLife(input = {}) {
  const lastingHold = input.lasting === true && input.orloj !== true;
  const hour = honorHour({
    lasting: lastingHold,
    timeoutMs: input.timeoutMs ?? SCHEMA_MAX_MS,
  });
  const orloj =
    !lastingHold &&
    (hour.lasting === false ||
      input.orloj === true ||
      input.halfLife === true ||
      input.thirtyMinute === true ||
      input.schemaCap === true);
  return {
    lasting: !orloj,
    orloj,
    halfLife: orloj,
    hour,
    phrase: orloj ? "score orloj" : "admit lasting",
  };
}

export function mentionsIssueCue(input = {}) {
  if (input.issue === FEATURED_ISSUE || input.issue === "94393") return true;
  const blob = typeof input === "string" ? input : JSON.stringify(input);
  return ISSUE_CUE_RE.test(blob);
}

export function mapOrloj(input = {}) {
  const orloj = isOrlojInput(input);
  const lasting = input.lasting === true && !orloj;
  return {
    stamp: orloj ? "half-life" : "calendar",
    holdingLane: orloj ? "thirty-chime" : "calendar",
    kindLane: orloj ? "half-life" : "hour-dial",
    bindLane: orloj ? "active-tower" : "promised",
    ribbon: orloj ? "orloj" : "lasting",
    lasting,
  };
}

export function inspectSchemaCap(input = {}) {
  const capped =
    input.schemaCap === true ||
    input.orloj === true ||
    input.halfLife === true ||
    isOrlojInput(input);
  if (input.lasting === true && !capped) {
    return { stamp: "hourlong", capped: false, note: "schema and face agree" };
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
    input.orloj === true ||
    isOrlojInput(input);
  if (input.lasting === true && !thirty) {
    return { stamp: "promised", thirty: false };
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
    input.orloj === true ||
    isOrlojInput(input);
  if (input.lasting === true && !rejected) {
    return { stamp: "diurnal", rejected: false };
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
    input.orloj === true ||
    input.halfLife === true ||
    isOrlojInput(input);
  if (input.lasting === true && !loop) {
    return { stamp: "calendar", loop: false };
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
    input.orloj === true ||
    isOrlojInput(input);
  if (input.lasting === true && !active) {
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
    "hour-dial": input.orloj || input.halfLife,
    "zodiac-ring": input.schemaCap || input.orloj,
    "persistent-gate": input.persistentReject || input.orloj,
    "thirty-chime": input.thirtyMinute || input.orloj,
    "active-tower": input.activeSession || input.orloj,
    "rearm-walk": input.rearmLoop || input.halfLife || input.orloj,
  };
  return (
    map[id] === true ||
    input.halfLife === true ||
    input.orloj === true
  );
}

function isOrlojInput(input = {}) {
  return (
    input.orloj === true ||
    input.halfLife === true ||
    input.schemaCap === true ||
    input.thirtyMinute === true ||
    input.persistentReject === true ||
    input.rearmLoop === true ||
    input.activeSession === true ||
    input.docsPromise === true
  );
}

export function readBooth(input = {}) {
  const orloj = isOrlojInput(input);
  const lasting = input.lasting === true && !orloj;
  return {
    mark: orloj ? "orloj" : "lasting",
    lasting,
    orloj,
    halfLife: input.halfLife === true || orloj,
    schemaCap: input.schemaCap === true,
    thirtyMinute: input.thirtyMinute === true,
    persistentReject: input.persistentReject === true,
    rearmLoop: input.rearmLoop === true,
    activeSession: input.activeSession === true,
    docsPromise: input.docsPromise === true,
    tower: mapOrloj(input),
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

export const ORLOJ_WALK = Object.freeze([
  {
    t: "idle",
    event: "calendar",
    lasting: true,
    orloj: false,
    cue: "lasting",
    note: "idle HOLD: schema-promised hour honored during active use",
  },
  {
    t: "half-life",
    event: "half-life",
    orloj: true,
    halfLife: true,
    thirtyMinute: true,
    schemaCap: true,
    cue: "orloj",
    note: "at allowed max 3600000, confirmation says expires in 30m; watch dies ~30 minutes",
  },
  {
    t: "path",
    event: "half-life",
    orloj: true,
    halfLife: true,
    schemaCap: true,
    thirtyMinute: true,
    persistentReject: true,
    rearmLoop: true,
    activeSession: true,
    docsPromise: true,
    cue: "orloj",
    note: "half-life — perpetual re-arm; session never idle",
  },
  {
    t: "score",
    event: "orloj",
    orloj: true,
    halfLife: true,
    schemaCap: true,
    thirtyMinute: true,
    persistentReject: true,
    rearmLoop: true,
    activeSession: true,
    docsPromise: true,
    cue: "orloj",
    note: "orloj — the clock face promises an hour; the mechanism dies at half-life",
  },
]);

export const POSITIVE_CONTROL_WALK = Object.freeze([
  {
    t: "hold",
    event: "calendar",
    lasting: true,
    orloj: false,
    cue: "lasting",
    note: "positive control: schema-promised hour honored during active use",
  },
  {
    t: "admit",
    event: "calendar",
    lasting: true,
    cue: "lasting",
    note: "positive control: the tower admits lasting",
  },
]);

function classifyFromSeed(seed) {
  if (seed && VERDICTS.includes(seed)) return seed;
  return null;
}

export function emptyTicket() {
  return {
    seed: IDLE_WORD,
    lasting: true,
    orloj: false,
    halfLife: false,
    cue: "lasting",
  };
}

export function seedLasting() {
  return { ...emptyTicket() };
}

export function seedOrloj() {
  return {
    seed: SEEDED_WORD,
    lasting: false,
    orloj: true,
    halfLife: true,
    schemaCap: true,
    thirtyMinute: true,
    persistentReject: true,
    rearmLoop: true,
    activeSession: true,
    docsPromise: true,
    cue: "orloj",
    issue: FEATURED_ISSUE,
    proof: SAMPLE_ORLOJ_PROOF,
  };
}

export function seedProduct() {
  return {
    seed: PRODUCT_WORD,
    preferSeed: true,
    orloj: true,
    halfLife: true,
    cue: "orloj",
  };
}

export function seedHalfLife() {
  return {
    seed: PATH_WORD,
    preferSeed: true,
    orloj: true,
    halfLife: true,
    event: "half-life",
    cue: "orloj",
  };
}

export function seedHourlong() {
  return { seed: "hourlong", preferSeed: true, lasting: true, cue: "lasting" };
}

export function seedPromised() {
  return { seed: "promised", preferSeed: true, lasting: true, cue: "lasting" };
}

export function seedDiurnal() {
  return { seed: "diurnal", preferSeed: true, lasting: true, cue: "lasting" };
}

export function seedCalendar() {
  return { seed: "calendar", preferSeed: true, lasting: true, cue: "lasting" };
}

export function seedSchemaCap() {
  return {
    seed: "schema-cap",
    preferSeed: true,
    schemaCap: true,
    cue: "orloj",
  };
}

export function seedThirty() {
  return {
    seed: "thirty-minute",
    preferSeed: true,
    thirtyMinute: true,
    cue: "orloj",
  };
}

export function normalizeBooth(raw) {
  if (!raw || typeof raw !== "object") {
    return {
      lasting: false,
      orloj: false,
      halfLife: false,
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
    lasting: raw.lasting === true,
    orloj: raw.orloj === true || raw.event === "orloj",
    halfLife: raw.halfLife === true || raw.event === "half-life",
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
      (ticket.lasting != null ||
        ticket.orloj != null ||
        ticket.halfLife != null ||
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
  if (row.orloj && row.cue !== "lasting") return false;
  if (row.cue === "orloj" || row.cue === "half-life") return false;
  if (
    row.halfLife &&
    row.thirtyMinute &&
    row.cue !== "lasting" &&
    row.lasting !== true
  ) {
    return false;
  }
  if (
    row.lasting === true &&
    row.orloj !== true &&
    row.cue !== "orloj"
  ) {
    return true;
  }
  if (
    row.cue === "lasting" &&
    row.orloj !== true &&
    row.halfLife !== true &&
    FORCE_FLAGS.every((flag) => row[flag] !== true)
  ) {
    return true;
  }
  return false;
}

function isHalfLife(row) {
  return (
    row.event === "half-life" &&
    !isLasting(row) &&
    (row.halfLife === true ||
      row.thirtyMinute === true ||
      row.orloj === true)
  );
}

function isOrlojRow(row) {
  if (isLasting(row)) return false;
  if (isHalfLife(row) && row.cue !== "orloj") return false;
  if (row.cue === "orloj") return true;
  if (row.orloj === true) return true;
  if (row.halfLife === true && row.thirtyMinute === true) return true;
  if (
    row.halfLife === true ||
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
 * Score one orloj pass against the Prague clock tower.
 * lasting: schema-promised hour honored during active use.
 * orloj: clock face promises an hour; mechanism dies at half-life.
 * half-life: names that path.
 */
export function scoreGate(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const row = normalizeBooth(ticket);
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);

  let verdict = IDLE_WORD;
  if (
    isHalfLife(row) ||
    (row.halfLife && ticket.preferSeed && seeded === PATH_WORD)
  ) {
    verdict = "half-life";
  } else if (isOrlojRow(row)) {
    verdict = "orloj";
  } else if (isLasting(row)) {
    verdict = "lasting";
  } else if (
    row.halfLife ||
    row.schemaCap ||
    row.thirtyMinute ||
    row.persistentReject ||
    row.rearmLoop ||
    row.activeSession ||
    row.docsPromise
  ) {
    verdict = "orloj";
  } else if (mentionsIssueCue(ticket) && !seeded) {
    verdict = "orloj";
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
    lasting: verdict === "lasting",
    orloj: verdict === "orloj" || verdict === SEEDED_WORD,
    halfLife:
      row.halfLife === true ||
      verdict === "half-life" ||
      verdict === PATH_WORD,
    schemaCap: row.schemaCap,
    thirtyMinute: row.thirtyMinute,
    persistentReject: row.persistentReject,
    rearmLoop: row.rearmLoop,
    activeSession: row.activeSession,
    docsPromise: row.docsPromise,
    cue: hold
      ? "lasting"
      : row.halfLife || verdict === "half-life"
        ? "half-life"
        : "orloj",
    event: row.event,
    t: row.t,
    phrase: hold ? "admit lasting" : "score orloj",
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
      : ORLOJ_WALK;
  const scored = rows.map((row) => ({
    ...normalizeBooth(row),
    ...scoreGate({ ...row, preferSeed: false }),
  }));
  const charged = scored.filter((row) => row.verdict === "orloj");
  const path = scored.filter((row) => row.verdict === "half-life");
  const lasting = scored.filter((row) => row.verdict === "lasting");
  const headline =
    scored.find((row) => row.event === "orloj") ||
    scored.find((row) => row.event === "half-life") ||
    scored.find((row) => row.event === "thirty-minute") ||
    charged[charged.length - 1];
  let verdict = "lasting";
  if (charged.length) verdict = "orloj";
  else if (path.length && !lasting.length) {
    verdict = "half-life";
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
    orlojCount: charged.length,
    pathCount: path.length,
    lastingCount: lasting.length,
    headline,
    rows: scored,
    phrase: HOLD.includes(verdict) ? "admit lasting" : "score orloj",
    note: headline
      ? "Monitor tool schema caps timeout_ms at 3600000 and ignores persistent; even at the allowed max the tool reports expires in 30m and dies ~30 minutes during an active session. Cite-only cousins #63023 #65968."
      : "published orloj walk scored against lasting vs orloj",
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
    seeded !== "lasting" &&
    seeded !== "orloj" &&
    seeded !== "half-life" &&
    ticket.lasting == null &&
    ticket.orloj == null &&
    ticket.halfLife == null &&
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
    lasting: scored.lasting ?? false,
    orloj: scored.orloj ?? false,
    halfLife: scored.halfLife ?? false,
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
  if (verdict === PATH_WORD) return SEEDED_WORD;
  return verdict;
}

export function fingerprint(input) {
  const result = analyze(input);
  return [
    result.verdict,
    result.halfLife || result.orloj
      ? "kind=half-life"
      : "kind=hour-dial",
    result.thirtyMinute || result.orloj
      ? "ref=thirty-minute"
      : "ref=calendar",
    result.halfLife || result.verdict === "half-life"
      ? "path=half-life"
      : "path=lasting",
    result.cue === "lasting"
      ? "cue=lasting"
      : result.cue === "half-life"
        ? "cue=half-life"
        : "cue=orloj",
  ].join("|");
}

export function handle(input) {
  const result = analyze(input);
  const booth = readBooth({
    lasting: result.lasting,
    orloj: result.orloj,
    halfLife: result.halfLife,
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
      lasting: result.lasting,
      orloj: result.orloj,
      schemaCap: result.schemaCap,
    }),
    thirty: inspectThirty({
      lasting: result.lasting,
      orloj: result.orloj,
      thirtyMinute: result.thirtyMinute,
    }),
    persist: inspectPersistent({
      lasting: result.lasting,
      orloj: result.orloj,
      persistentReject: result.persistentReject,
    }),
    rearm: inspectRearm({
      lasting: result.lasting,
      orloj: result.orloj,
      rearmLoop: result.rearmLoop,
    }),
    active: inspectActive({
      lasting: result.lasting,
      orloj: result.orloj,
      activeSession: result.activeSession,
    }),
    tower: mapOrloj({
      lasting: result.lasting,
      orloj: result.orloj,
      halfLife: result.halfLife,
      thirtyMinute: result.thirtyMinute,
    }),
    stations: BOOTH_STATIONS.map((row) => ({
      ...row,
      orloj: result.orloj === true || result.verdict === "orloj",
    })),
    leakPath: scoreHalfLife({
      lasting: result.lasting === true && !result.orloj,
      orloj: result.orloj,
      halfLife: result.halfLife,
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
        "NON-BINDING (issue text): schema max / docs disagree with honored lifetime; silent ~30m cap during active use. Invite verify against #94393 text only. Do not claim a root cause in Claude Code source you have not seen.",
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
