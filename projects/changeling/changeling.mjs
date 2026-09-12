#!/usr/bin/env node
/**
 * Changeling — fairy-court / cradle-swap booth.
 *
 * Educational diagnostic model for a published Claude Code defect:
 * Attaching to a session by remote control from another machine, then
 * resuming it on its host, replaces the model the user set with `/model`
 * with the global default from settings.json, with no notification.
 * Every `remote_session_change` re-injects a model identity attachment;
 * the value re-asserted is the global default rather than the session's
 * explicit choice. UI and session metadata continue to report the user's
 * chosen model, so the substitution is invisible inside the app.
 * Reporter: session ran 293 calls on claude-fable-5-1 over ~16 hours
 * while the app reported claude-opus-5 throughout. `set_session_model`
 * reported success without taking effect; only `/model` inside the
 * session could fix it.
 *
 *   node changeling.mjs data/swapped.json
 *   echo '{"seed":"swapped"}' | node changeling.mjs
 *
 * Idle word is pledged (HOLD: session keeps explicit /model choice).
 * Seeded word is swapped (#93757 — remote reconnect reinjects global
 * default).
 * Path word is remote-reattach.
 * Product score word is changeling (Score changeling or admit pledged.).
 *
 * Encoded from anthropics/claude-code#93757 issue text only.
 * Hypothesis (NON-BINDING): on remote_session_change, re-assert the
 * session's explicit /model choice (or notify on reset). Verify against
 * #93757 text only. Do NOT claim a root cause in Claude Code source you
 * have not seen. Do NOT implement a fix. No network. No exploits. No
 * live Claude. No secrets.
 */

/* Browser-safe: no top-level node: imports. CLI I/O is loaded only in main(). */

export const VERDICTS = Object.freeze([
  "pledged",
  "swapped",
  "changeling",
  "remote-reattach",
  "hold",
  "keep-chosen",
  "notify-reset",
  "remote-latch",
  "identity-token",
  "invisible-reinject",
  "ledger-lie",
  "fable-default",
  "opus-pledged",
  "host-resume",
  "set-session-noop",
  "transcript-only",
  "has-repro",
  "cousins",
  "backups",
  "fixtures",
  "chips",
  "fingerprints",
  "walk",
]);

export const IDLE_WORD = "pledged";
export const PATH_WORD = "remote-reattach";
export const SEEDED_WORD = "swapped";
export const PRODUCT_WORD = "changeling";
export const HOLD = Object.freeze(["pledged", "hold"]);
export const RECOVER = Object.freeze(["pledged", "hold"]);
export const ALARM = Object.freeze(
  VERDICTS.filter((name) => !HOLD.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FORBIDDEN_IDLE = Object.freeze([
  "distinct",
  "collided",
  "lossy-slug",
  "homograph",
  "dash-collapse",
  "orphan-store",
  "dry",
  "billed",
  "stop-dirty",
  "galley",
  "wet-proof",
  "intact",
  "scraped",
  "snapshot-write",
  "rescript",
  "fresh",
  "residual",
  "monadnock",
  "submodule-base",
  "plain",
  "ridden",
  "attachment-rider",
  "rider",
  "lit",
  "dark",
  "spawn-mcp-focus",
  "followspot",
  "due",
  "misfired",
  "catchup-dow",
  "calends",
  "flowing",
  "dammed",
  "egress-allowlist",
  "weir",
  "underway",
  "becalmed",
  "cron-websearch",
  "irons",
  "seated",
  "raced",
  "ptmx-race",
  "cathead",
  "tip",
  "stale",
  "prewarm-latch",
  "anachronism",
  "stamped",
  "emptied",
  "empty-expand",
  "nullarbor",
  "standing",
  "hoisted",
  "petard",
  "wrapper-argv",
  "raised",
  "furled",
  "aposiopesis",
  "git-cwd-mute",
  "seised",
  "disseised",
  "disseisin",
  "home-evaporated",
  "ordered",
  "redelivered",
  "analepsis",
  "marker-misorder",
  "viewed",
  "withheld",
  "monstrance",
  "phantom-deny",
  "closed",
  "lingering",
  "unrung",
  "compline",
  "sealed",
  "blanked",
  "cipherlock",
  "concurrent-write",
  "untainted",
  "attainted",
  "attainder",
  "retire-parked",
  "voiced",
  "muted",
  "sourdine",
  "mid-narration",
  "mondegreen",
  "tokenized",
  "parsed",
  "seizing",
  "culled",
  "sole",
  "hangfire",
  "flashpan",
  "flashed",
  "primed",
  "flashpanned",
  "frizzen",
  "mirage",
  "miraged",
  "confirmed",
  "counterfoil",
  "cachet",
  "forksink",
  "foxfire",
  "pentimento",
  "vinculum",
  "strobe",
  "lodged",
  "kindled",
  "flushed",
  "solitary",
  "hit",
  "dropped",
  "painted",
  "lagged",
  "twinlinked",
  "flattened",
  "held",
  "steered",
  "greenroomed",
  "greenroom",
  "staple",
  "injection",
  "correction",
  "no-opt-out",
  "planning-narration",
  "trust-boundary",
  "payload-only",
  "local-main",
  "nested-repo",
  "raw-sha",
  "behind-204",
  "fetch-first",
  "origin-main",
  "palimpsest",
  "oubliette",
  "ephemera",
  "homonym",
]);
export const FORBIDDEN_SEED = Object.freeze(
  FORBIDDEN_IDLE.filter((name) => name !== "swapped" && name !== "changeling"),
);

export const FEATURED_ISSUE = 93757;
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/93757";
export const TITLE =
  "Session reconnect silently discards an explicit /model choice and falls back to the global default";
export const STATE = "OPEN";
export const LABELS = Object.freeze([
  "bug",
  "has repro",
  "platform:windows",
  "area:cost",
  "area:model",
]);
export const PLATFORM = "windows";
export const PLEDGED_MODEL = "claude-opus-5";
export const SWAPPED_MODEL = "claude-fable-5-1";
export const GLOBAL_DEFAULT = "fable[1m]";
export const CALL_COUNT = 293;
export const RUN_HOURS = 16;
export const DESKTOP_BUILD = "1.52386.0";
export const AGENT_SDK = "0.3.266";
export const OS_LABEL = "Windows 11 Pro";
export const SURFACE = "Claude Code desktop 1.52386.0 (Code tab)";
export const EVENT_NAME = "remote_session_change";
export const NOOP_API = "set_session_model";
export const TRANSCRIPT_PATH = "~/.claude/projects/**/*.jsonl";
export const DETECTION_FIELD = "message.model";
export const PHRASE = "Score changeling or admit pledged.";
export const DISTRIBUTION =
  "Attaching to a session by remote control from another machine, then resuming it on its host, replaces the model the user set with /model with the global default from settings.json, with no notification. Every remote_session_change re-injects a model identity attachment; the value re-asserted is the global default rather than the session's explicit choice. UI and session metadata continue to report the user's chosen model, so the substitution is invisible inside the app. Reporter: session ran 293 calls on claude-fable-5-1 over ~16 hours while the app reported claude-opus-5 throughout. set_session_model reported success without taking effect; only /model inside the session could fix it. Repro: set global default → start session → /model claude-opus-5 (confirmed) → attach via remote control from second machine → return to host and resume → next messages silently on global default; model picker still shows Opus. Detection only via message.model in raw transcript under ~/.claude/projects/**/*.jsonl. Expected: keep chosen model, or clearly say it reset to default.";
export const SESSION_KIND =
  "Windows 11 Pro desktop Code-tab session in the app worktree. Global default fable[1m] in settings.json. Session pledged to claude-opus-5 via /model. Remote control attach from a second machine, then host resume. Next messages silently on claude-fable-5-1; picker still shows Opus. 293 calls over ~16 hours.";
export const RULED_OUT = Object.freeze([
  "the picker being the source of truth (it kept showing Opus while calls ran on fable)",
  "set_session_model being a working repair (it reported success without taking effect)",
  "the user having asked to fall back to the global default (no notification of the reset)",
  "session metadata reflecting the model that actually ran (metadata kept the pledged name)",
]);
export const EXPECTED = Object.freeze([
  "keep the session's explicit /model choice across remote attach and host resume",
  "or clearly say the model reset to the global default from settings.json",
  "on remote_session_change, re-assert the session's explicit choice rather than the global default",
]);

export const CHANGELING_PLAQUES = Object.freeze([
  { id: "heir", label: "pledged heir", count: PLEDGED_MODEL, note: "/model Opus" },
  { id: "lookalike", label: "lookalike", count: SWAPPED_MODEL, note: "293 calls" },
  { id: "ledger", label: "court ledger", count: "Opus", note: "still named" },
  { id: "latch", label: "remote latch", count: "reattach", note: EVENT_NAME },
]);

export const BOOTH_STATIONS = Object.freeze([
  {
    id: "cradle",
    survey: "lay the pledged heir in the cradle (/model claude-opus-5)",
    kind: "cradle",
    note: "seeded: the court pledged Opus; the cradle should keep that child",
  },
  {
    id: "court-ledger",
    survey: "read the court ledger (picker and session metadata still name Opus)",
    kind: "court-ledger",
    note: "seeded: the ledger lies — it still names the rightful child after the swap",
  },
  {
    id: "swapped-swaddling",
    survey: "unwrap the swaddling (next messages run on claude-fable-5-1)",
    kind: "swapped-swaddling",
    note: "seeded: 293 calls on the lookalike over ~16 hours",
  },
  {
    id: "remote-latch",
    survey: "throw the remote latch (attach from a second machine, then host resume)",
    kind: "remote-latch",
    note: "seeded: remote-reattach is the path that opens the cradle to the swap",
  },
  {
    id: "identity-token",
    survey: "inspect the model identity token (re-injected on every remote_session_change)",
    kind: "identity-token",
    note: "seeded: the token re-asserts the global default, not the session choice",
  },
  {
    id: "invisible-reinjection",
    survey: "watch the invisible reinjection (no notification; only message.model in jsonl)",
    kind: "invisible-reinjection",
    note: "seeded: substitution is invisible inside the app",
  },
]);

export const FINGERPRINT_LINES = Object.freeze([
  "remote-reattach",
  "swapped",
  "invisible-reinject",
  "ledger-lie",
  "identity-token",
  "fable-default",
  "opus-pledged",
  "host-resume",
]);

export const COUSINS = Object.freeze([
  {
    issue: 82466,
    title: "settings.json default not honored; /model switch unreliable",
    state: "OPEN",
    citeOnly: true,
    product: null,
    why: "Cite-only cousin — #82466 settings.json default not honored at session start; /model does not reliably switch. Related model identity, different trigger. Do not rebuild",
  },
  {
    issue: 78654,
    title: "/model Enter persists globally vs session scope",
    state: "OPEN",
    citeOnly: true,
    product: null,
    why: "Cite-only cousin — #78654 /model picker Enter persists globally instead of session scope. Related /model persistence, different surface. Do not rebuild",
  },
  {
    issue: 87334,
    title: "picker overrides saved [1m] default with 200k",
    state: "OPEN",
    citeOnly: true,
    product: null,
    why: "Cite-only cousin — #87334 Desktop picker overrides saved [1m] default. Related picker vs default, not remote reconnect. Do not rebuild",
  },
  {
    issue: 93154,
    title: "Remote SSH reconnect destroys sessions instead of reattaching",
    state: "OPEN",
    citeOnly: true,
    product: null,
    why: "Cite-only cousin — #93154 Remote SSH daemon destroys running sessions on transient reconnect. Related reconnect, different substitution. Do not rebuild",
  },
  {
    issue: 92235,
    title: "mobile duplicate session on every remote reconnect",
    state: "OPEN",
    citeOnly: true,
    product: null,
    why: "Cite-only cousin — #92235 Mobile client creates a duplicate session on every reconnect. Related remote reconnect, different defect. Do not rebuild",
  },
]);

export const BACKUPS = Object.freeze([
  {
    issue: 93746,
    title: "enableArtifact false kills scratchpad",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
  {
    issue: 93744,
    title: "/goal stop evaluator blind",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
  {
    issue: 93722,
    title: "worktree connector disable-list",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
  {
    issue: 93672,
    title: "idle_prompt while background subagents still running",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
  {
    issue: 93652,
    title: "Remote Control capacity silent session substitution",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
  {
    issue: 93680,
    title: "Bash mkdir via /proc/self/fd",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
  {
    issue: 93618,
    title: "Windows/Git Bash truncation + backslash",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
  {
    issue: 93694,
    title: "WSL Open-in paths",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
]);

export const NOT_PRODUCTS = Object.freeze([
  "homograph",
  "galley",
  "rescript",
  "monadnock",
  "rider",
  "followspot",
  "calends",
  "weir",
  "irons",
  "cathead",
  "anachronism",
  "nullarbor",
  "petard",
  "greenroom",
  "aposiopesis",
  "disseisin",
  "analepsis",
  "monstrance",
  "compline",
  "cipherlock",
  "attainder",
  "sourdine",
  "forksink",
  "foxfire",
  "pentimento",
  "vinculum",
  "cachet",
  "strobe",
  "counterfoil",
  "lucida",
  "fomite",
  "snubber",
  "fosse",
  "hibernacle",
  "flashpan",
  "hangfire",
  "mirage",
  "frizzen",
  "palimpsest",
  "palinode",
  "ukase",
  "cartulary",
  "paraph",
  "concordat",
  "imprimatur",
  "bulla",
  "oubliette",
  "ephemera",
  "homonym",
]);

export const SAMPLE_CRADLE = Object.freeze({
  pledged: PLEDGED_MODEL,
  running: SWAPPED_MODEL,
  swapped: true,
});

export const SAMPLE_PLEDGED_CRADLE = Object.freeze({
  pledged: PLEDGED_MODEL,
  running: PLEDGED_MODEL,
  swapped: false,
});

export const SAMPLE_LEDGER = Object.freeze({
  reports: PLEDGED_MODEL,
  actual: SWAPPED_MODEL,
  lies: true,
});

export const SAMPLE_PLEDGED_LEDGER = Object.freeze({
  reports: PLEDGED_MODEL,
  actual: PLEDGED_MODEL,
  lies: false,
});

export const SAMPLE_SWADDLING = Object.freeze({
  lookalike: true,
  calls: CALL_COUNT,
  hours: RUN_HOURS,
});

export const SAMPLE_PLEDGED_SWADDLING = Object.freeze({
  lookalike: false,
  calls: 0,
  hours: 0,
});

export const SAMPLE_LATCH = Object.freeze({
  remoteAttach: true,
  hostResume: true,
  event: EVENT_NAME,
});

export const SAMPLE_PLEDGED_LATCH = Object.freeze({
  remoteAttach: false,
  hostResume: false,
  event: null,
});

export const SAMPLE_TOKEN = Object.freeze({
  reinjected: true,
  value: GLOBAL_DEFAULT,
  notified: false,
});

export const SAMPLE_PLEDGED_TOKEN = Object.freeze({
  reinjected: false,
  value: PLEDGED_MODEL,
  notified: false,
});

export const SAMPLE_WALK_LOG = Object.freeze([
  { t: "idle", line: "the pledged heir stays in the cradle; /model Opus is kept" },
  { t: "opus-pledged", line: "/model claude-opus-5 confirmed; picker and metadata name Opus" },
  { t: "remote-latch", line: "attach via remote control from a second machine" },
  { t: "host-resume", line: "return to the host and resume the same session" },
  { t: "path", line: "remote-reattach — every remote_session_change opens the cradle" },
  { t: "identity-token", line: "model identity attachment re-asserts the global default fable[1m]" },
  { t: "invisible-reinject", line: "no notification; substitution is invisible inside the app" },
  { t: "ledger-lie", line: "court ledger still names Opus while calls run on fable" },
  { t: "fable-default", line: "293 calls on claude-fable-5-1 over ~16 hours" },
  { t: "transcript-only", line: "detection only via message.model in ~/.claude/projects/**/*.jsonl" },
  { t: "score", line: "when the pledged heir is swapped for a lookalike the booth is a changeling — Score changeling or admit pledged." },
]);

export function inspectCradle(input = {}) {
  const cradle =
    input.cradle && typeof input.cradle === "object"
      ? input.cradle
      : input.pledged === true && input.swapped !== true
        ? SAMPLE_PLEDGED_CRADLE
        : SAMPLE_CRADLE;
  const forcedSwap =
    input.swapped === true ||
    input.remoteReattach === true ||
    input.event === "swapped" ||
    input.event === "changeling" ||
    input.event === "remote-reattach" ||
    input.event === "fable-default";
  const swapped =
    forcedSwap ? true : cradle.swapped === true && input.pledged !== true;
  return {
    pledged: cradle.pledged || PLEDGED_MODEL,
    running: swapped ? SWAPPED_MODEL : PLEDGED_MODEL,
    swapped,
    stamp: swapped ? "cradle-swapped" : "cradle-pledged",
    note: swapped
      ? "the lookalike lies in the cradle — fable runs while Opus was pledged"
      : "the pledged heir stays in the cradle",
  };
}

export function inspectLedger(input = {}) {
  const ledger =
    input.ledger && typeof input.ledger === "object"
      ? input.ledger
      : input.pledged === true && input.swapped !== true
        ? SAMPLE_PLEDGED_LEDGER
        : SAMPLE_LEDGER;
  const forcedLie =
    input.ledgerLie === true ||
    input.event === "ledger-lie" ||
    input.remoteReattach === true ||
    (input.swapped === true && input.pledged !== true);
  const lies = forcedLie ? true : ledger.lies === true;
  return {
    reports: PLEDGED_MODEL,
    actual: lies ? SWAPPED_MODEL : PLEDGED_MODEL,
    lies,
    stamp: lies ? "ledger-lies" : "ledger-true",
    note: lies
      ? "court ledger still names Opus — the substitution is invisible"
      : "court ledger names the model that actually runs",
  };
}

export function inspectSwaddling(input = {}) {
  const cloth =
    input.swaddling && typeof input.swaddling === "object"
      ? input.swaddling
      : input.pledged === true && input.swapped !== true
        ? SAMPLE_PLEDGED_SWADDLING
        : SAMPLE_SWADDLING;
  const forcedLookalike =
    input.lookalike === true ||
    input.event === "swapped-swaddling" ||
    input.remoteReattach === true ||
    (input.swapped === true && input.pledged !== true);
  const lookalike = forcedLookalike ? true : cloth.lookalike === true;
  return {
    lookalike,
    calls: lookalike ? CALL_COUNT : 0,
    hours: lookalike ? RUN_HOURS : 0,
    stamp: lookalike ? "swaddling-swapped" : "swaddling-pledged",
    note: lookalike
      ? "293 calls on the lookalike over ~16 hours"
      : "swaddling still wraps the pledged heir",
  };
}

export function inspectLatch(input = {}) {
  const latch =
    input.latch && typeof input.latch === "object"
      ? input.latch
      : input.pledged === true && input.swapped !== true
        ? SAMPLE_PLEDGED_LATCH
        : SAMPLE_LATCH;
  const forcedLatch =
    input.remoteLatch === true ||
    input.event === "remote-latch" ||
    input.event === "host-resume" ||
    input.remoteReattach === true ||
    (input.swapped === true && input.pledged !== true);
  const thrown = forcedLatch ? true : latch.remoteAttach === true;
  return {
    remoteAttach: thrown,
    hostResume: thrown,
    event: thrown ? EVENT_NAME : null,
    stamp: thrown ? "latch-thrown" : "latch-quiet",
    note: thrown
      ? "remote latch thrown — attach then host resume"
      : "remote latch stays shut; the heir is not swapped",
  };
}

export function inspectToken(input = {}) {
  const token =
    input.token && typeof input.token === "object"
      ? input.token
      : input.pledged === true && input.swapped !== true
        ? SAMPLE_PLEDGED_TOKEN
        : SAMPLE_TOKEN;
  const forcedReinject =
    input.invisibleReinject === true ||
    input.event === "invisible-reinject" ||
    input.event === "identity-token" ||
    input.remoteReattach === true ||
    (input.swapped === true && input.pledged !== true);
  const reinjected = forcedReinject ? true : token.reinjected === true;
  return {
    reinjected,
    value: reinjected ? GLOBAL_DEFAULT : PLEDGED_MODEL,
    notified: false,
    stamp: reinjected ? "token-reinjected" : "token-session",
    note: reinjected
      ? "identity token re-asserts fable[1m] on every remote_session_change"
      : "identity token keeps the session's explicit /model choice",
  };
}

export function readBooth(input = {}) {
  const cradle = inspectCradle(input);
  const ledger = inspectLedger(input);
  const swaddling = inspectSwaddling(input);
  const latch = inspectLatch(input);
  const token = inspectToken(input);
  const swapped =
    input.pledged !== true &&
    ((cradle.swapped && token.reinjected) ||
      (ledger.lies && swaddling.lookalike) ||
      input.swapped === true);
  const pledged = input.pledged === true && swapped !== true && !cradle.swapped;
  const path =
    latch.remoteAttach &&
    (input.event === "remote-reattach" || input.remoteReattach === true);
  return {
    cradle,
    ledger,
    swaddling,
    latch,
    token,
    plaques: CHANGELING_PLAQUES,
    stations: BOOTH_STATIONS,
    swapped: swapped && !pledged && !path,
    pledged:
      pledged ||
      (!cradle.swapped &&
        !token.reinjected &&
        input.swapped !== true &&
        input.remoteReattach !== true),
    remoteReattach: path && !pledged,
    mark:
      path && !pledged
        ? "remote-reattach"
        : swapped && !pledged
          ? "swapped"
          : "pledged",
  };
}

/**
 * Published changeling walk from #93757 only. Facts from the issue text.
 * A pledged booth keeps the explicit /model choice.
 * A swapped booth replaces the heir with the global default after remote reconnect.
 * A remote-reattach booth names the latch path.
 */
export const CHANGELING_WALK = Object.freeze([
  {
    t: "idle",
    event: "cue-pledged",
    pledged: true,
    swapped: false,
    cue: "pledged",
    note: "idle HOLD: session keeps explicit /model choice; the pledged heir stays in the cradle",
  },
  {
    t: "opus-pledged",
    event: "opus-pledged",
    pledged: true,
    keepChosen: true,
    cue: "pledged",
    note: "/model claude-opus-5 confirmed; picker and metadata name Opus",
  },
  {
    t: "remote-latch",
    event: "remote-latch",
    swapped: true,
    remoteLatch: true,
    cue: "swapped",
    note: "attach via remote control from a second machine",
  },
  {
    t: "host-resume",
    event: "host-resume",
    swapped: true,
    hostResume: true,
    cue: "swapped",
    note: "return to the host and resume the same session",
  },
  {
    t: "path",
    event: "remote-reattach",
    swapped: true,
    remoteReattach: true,
    remoteLatch: true,
    cue: "swapped",
    note: "remote-reattach — every remote_session_change opens the cradle",
  },
  {
    t: "identity-token",
    event: "identity-token",
    swapped: true,
    identityToken: true,
    cue: "swapped",
    note: "model identity attachment re-asserts the global default fable[1m]",
  },
  {
    t: "invisible-reinject",
    event: "invisible-reinject",
    swapped: true,
    invisibleReinject: true,
    cue: "swapped",
    note: "no notification; substitution is invisible inside the app",
  },
  {
    t: "ledger-lie",
    event: "ledger-lie",
    swapped: true,
    ledgerLie: true,
    cue: "swapped",
    note: "court ledger still names Opus while calls run on fable",
  },
  {
    t: "fable-default",
    event: "fable-default",
    swapped: true,
    fableDefault: true,
    cue: "swapped",
    note: "293 calls on claude-fable-5-1 over ~16 hours",
  },
  {
    t: "transcript-only",
    event: "transcript-only",
    swapped: true,
    transcriptOnly: true,
    cue: "swapped",
    note: "detection only via message.model in ~/.claude/projects/**/*.jsonl",
  },
  {
    t: "score",
    event: "changeling",
    swapped: true,
    remoteReattach: true,
    remoteLatch: true,
    invisibleReinject: true,
    ledgerLie: true,
    cue: "swapped",
    note: "changeling — when the pledged heir is swapped for a lookalike the booth never stays pledged",
  },
]);

export const POSITIVE_CONTROL_WALK = Object.freeze([
  {
    t: "hold",
    event: "keep-chosen",
    pledged: true,
    keepChosen: true,
    cue: "pledged",
    note: "positive control: remote_session_change re-asserts the session's explicit /model choice",
  },
  {
    t: "notify",
    event: "cue-pledged",
    pledged: true,
    cue: "pledged",
    note: "positive control: if the model must reset, the court says so",
  },
]);

function classifyFromSeed(seed) {
  if (seed && VERDICTS.includes(seed)) return seed;
  return null;
}

export function emptyTicket() {
  return {
    seed: IDLE_WORD,
    pledged: true,
    swapped: false,
    keepChosen: true,
    cue: "pledged",
  };
}

export function seedPledged() {
  return { ...emptyTicket() };
}

export function seedSwapped() {
  return {
    seed: SEEDED_WORD,
    pledged: false,
    swapped: true,
    remoteLatch: true,
    identityToken: true,
    invisibleReinject: true,
    remoteReattach: true,
    ledgerLie: true,
    fableDefault: true,
    hostResume: true,
    cue: "swapped",
    issue: FEATURED_ISSUE,
    cradle: SAMPLE_CRADLE,
    ledger: SAMPLE_LEDGER,
    swaddling: SAMPLE_SWADDLING,
    latch: SAMPLE_LATCH,
    token: SAMPLE_TOKEN,
  };
}

export function seedChangeling() {
  return {
    seed: PRODUCT_WORD,
    preferSeed: true,
    swapped: true,
    remoteLatch: true,
    identityToken: true,
    invisibleReinject: true,
    remoteReattach: true,
    ledgerLie: true,
    fableDefault: true,
    hostResume: true,
    cue: "swapped",
  };
}

export function seedRemoteReattach() {
  return {
    seed: PATH_WORD,
    preferSeed: true,
    swapped: true,
    remoteReattach: true,
    remoteLatch: true,
    invisibleReinject: true,
    event: "remote-reattach",
    cue: "swapped",
  };
}

export function seedHold() {
  return {
    seed: "hold",
    preferSeed: true,
    pledged: true,
    cue: "pledged",
  };
}

export function seedKeepChosen() {
  return {
    seed: "keep-chosen",
    preferSeed: true,
    keepChosen: true,
    cue: "pledged",
  };
}

export function seedNotifyReset() {
  return {
    seed: "notify-reset",
    preferSeed: true,
    cue: "pledged",
  };
}

export function seedRemoteLatch() {
  return {
    seed: "remote-latch",
    preferSeed: true,
    remoteLatch: true,
    cue: "swapped",
  };
}

export function seedIdentityToken() {
  return {
    seed: "identity-token",
    preferSeed: true,
    identityToken: true,
    cue: "swapped",
  };
}

export function seedInvisibleReinject() {
  return {
    seed: "invisible-reinject",
    preferSeed: true,
    invisibleReinject: true,
    cue: "swapped",
  };
}

export function seedLedgerLie() {
  return {
    seed: "ledger-lie",
    preferSeed: true,
    ledgerLie: true,
    cue: "swapped",
  };
}

export function seedFableDefault() {
  return {
    seed: "fable-default",
    preferSeed: true,
    fableDefault: true,
    cue: "swapped",
  };
}

export function seedOpusPledged() {
  return {
    seed: "opus-pledged",
    preferSeed: true,
    cue: "swapped",
  };
}

export function seedHostResume() {
  return {
    seed: "host-resume",
    preferSeed: true,
    hostResume: true,
    cue: "swapped",
  };
}

export function seedSetSessionNoop() {
  return {
    seed: "set-session-noop",
    preferSeed: true,
    cue: "swapped",
  };
}

export function seedTranscriptOnly() {
  return {
    seed: "transcript-only",
    preferSeed: true,
    transcriptOnly: true,
    cue: "swapped",
  };
}

export function normalizeBooth(raw) {
  if (!raw || typeof raw !== "object") {
    return {
      pledged: false,
      swapped: false,
      remoteReattach: false,
      keepChosen: false,
      remoteLatch: false,
      identityToken: false,
      invisibleReinject: false,
      ledgerLie: false,
      fableDefault: false,
      hostResume: false,
      transcriptOnly: false,
      cue: null,
      event: null,
      t: null,
    };
  }
  return {
    pledged: raw.pledged === true,
    swapped:
      raw.swapped === true ||
      raw.event === "swapped" ||
      raw.event === "changeling",
    remoteReattach: raw.remoteReattach === true || raw.event === "remote-reattach",
    keepChosen: raw.keepChosen === true || raw.event === "keep-chosen",
    remoteLatch: raw.remoteLatch === true || raw.event === "remote-latch",
    identityToken: raw.identityToken === true || raw.event === "identity-token",
    invisibleReinject:
      raw.invisibleReinject === true || raw.event === "invisible-reinject",
    ledgerLie: raw.ledgerLie === true || raw.event === "ledger-lie",
    fableDefault: raw.fableDefault === true || raw.event === "fable-default",
    hostResume: raw.hostResume === true || raw.event === "host-resume",
    transcriptOnly: raw.transcriptOnly === true || raw.event === "transcript-only",
    cue: raw.cue || null,
    event: raw.event || raw.kind || null,
    t: raw.t || raw.time || null,
    cradle: raw.cradle,
    ledger: raw.ledger,
    swaddling: raw.swaddling,
    latch: raw.latch,
    token: raw.token,
    log: raw.log,
  };
}

function hasBoothFields(ticket) {
  return Boolean(
    ticket &&
      (ticket.pledged != null ||
        ticket.swapped != null ||
        ticket.remoteReattach != null ||
        ticket.remoteLatch != null ||
        ticket.invisibleReinject != null ||
        ticket.ledgerLie != null ||
        ticket.cue != null ||
        ticket.event ||
        ticket.cradle ||
        ticket.ledger ||
        ticket.token),
  );
}

function isPledged(row) {
  if (row.swapped && row.cue !== "pledged") return false;
  if (
    row.cue === "swapped" ||
    row.cue === "changeling" ||
    row.cue === "remote-reattach"
  ) {
    return false;
  }
  if (
    row.remoteLatch &&
    row.invisibleReinject &&
    row.cue !== "pledged" &&
    row.pledged !== true
  ) {
    return false;
  }
  if (
    row.remoteReattach &&
    row.remoteLatch &&
    row.cue !== "pledged" &&
    row.pledged !== true
  ) {
    return false;
  }
  if (row.pledged === true && row.swapped !== true && row.cue !== "swapped") {
    return true;
  }
  if (
    row.cue === "pledged" &&
    row.swapped !== true &&
    row.remoteLatch !== true &&
    row.remoteReattach !== true
  ) {
    return true;
  }
  if (
    row.keepChosen === true &&
    row.swapped !== true &&
    row.remoteLatch !== true &&
    row.invisibleReinject !== true &&
    row.remoteReattach !== true
  ) {
    return true;
  }
  return false;
}

function isRemoteReattachPath(row) {
  return (
    row.event === "remote-reattach" &&
    !isPledged(row) &&
    (row.remoteReattach === true ||
      row.remoteLatch === true ||
      row.invisibleReinject === true)
  );
}

function isSwapped(row) {
  if (isPledged(row)) return false;
  if (isRemoteReattachPath(row) && row.cue !== "swapped") return false;
  if (row.cue === "swapped" || row.cue === "changeling") return true;
  if (row.swapped === true) return true;
  if (
    row.remoteLatch === true &&
    row.invisibleReinject === true &&
    row.ledgerLie === true
  ) {
    return true;
  }
  if (row.remoteLatch === true && row.invisibleReinject === true) {
    return true;
  }
  if (
    row.ledgerLie === true ||
    row.fableDefault === true ||
    row.hostResume === true ||
    (row.remoteReattach === true && row.invisibleReinject === true)
  ) {
    return true;
  }
  return false;
}

/**
 * Score one changeling pass against the cradle booth.
 * pledged: session keeps explicit /model choice.
 * swapped / changeling: remote reconnect reinjects global default.
 * remote-reattach: attach-then-host-resume is the latch path.
 */
export function scoreGate(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const row = normalizeBooth(ticket);
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);

  let verdict = IDLE_WORD;
  if (
    isRemoteReattachPath(row) ||
    (row.remoteReattach && ticket.preferSeed && seeded === PATH_WORD)
  ) {
    verdict = "remote-reattach";
  } else if (isSwapped(row)) {
    verdict = "changeling";
  } else if (isPledged(row)) {
    verdict = "pledged";
  } else if (
    row.remoteLatch ||
    row.invisibleReinject ||
    row.ledgerLie ||
    (row.remoteReattach && !row.keepChosen)
  ) {
    verdict = "changeling";
  }

  if (seeded && (!hasBoothFields(ticket) || ticket.preferSeed === true)) {
    verdict = seeded;
  }

  const hold = HOLD.includes(verdict);
  const cradle = inspectCradle(row);
  const ledger = inspectLedger(row);
  const swaddling = inspectSwaddling(row);
  const latch = inspectLatch(row);
  const token = inspectToken(row);
  return {
    verdict,
    idleWord: IDLE_WORD,
    pathWord: PATH_WORD,
    seededWord: SEEDED_WORD,
    productWord: PRODUCT_WORD,
    hold,
    alarm: !hold,
    recover: RECOVER.includes(verdict),
    pledged: verdict === "pledged" || verdict === "hold",
    swapped:
      verdict === "swapped" ||
      verdict === SEEDED_WORD ||
      verdict === PRODUCT_WORD,
    remoteReattach:
      row.remoteReattach === true ||
      verdict === "remote-reattach" ||
      verdict === PATH_WORD,
    keepChosen: row.keepChosen,
    remoteLatch: row.remoteLatch,
    identityToken: row.identityToken,
    invisibleReinject: row.invisibleReinject,
    ledgerLie: row.ledgerLie,
    fableDefault: row.fableDefault,
    hostResume: row.hostResume,
    transcriptOnly: row.transcriptOnly,
    cue: hold
      ? "pledged"
      : row.remoteReattach || verdict === "remote-reattach"
        ? "remote-reattach"
        : "swapped",
    event: row.event,
    t: row.t,
    phrase: hold ? "admit pledged" : "score changeling",
    cradleInspect: cradle,
    ledgerInspect: ledger,
    swaddlingInspect: swaddling,
    latchInspect: latch,
    tokenInspect: token,
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
      : CHANGELING_WALK;
  const scored = rows.map((row) => ({
    ...normalizeBooth(row),
    ...scoreGate({ ...row, preferSeed: false }),
  }));
  const swapped = scored.filter(
    (row) => row.verdict === "changeling" || row.verdict === "swapped",
  );
  const path = scored.filter((row) => row.verdict === "remote-reattach");
  const pledged = scored.filter((row) => row.verdict === "pledged");
  const headline =
    scored.find((row) => row.event === "swapped") ||
    scored.find((row) => row.event === "remote-reattach") ||
    scored.find((row) => row.event === "invisible-reinject") ||
    swapped[swapped.length - 1];
  let verdict = "pledged";
  if (swapped.length) verdict = "changeling";
  else if (path.length && !pledged.length) verdict = "remote-reattach";
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
    swappedCount: swapped.length,
    pathCount: path.length,
    pledgedCount: pledged.length,
    headline,
    rows: scored,
    phrase: HOLD.includes(verdict) ? "admit pledged" : "score changeling",
    note: headline
      ? "Remote reattach reinjected fable[1m] after /model Opus; 293 calls on the lookalike while the ledger still named the pledged heir."
      : "published changeling walk scored against pledged vs swapped",
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
    seeded !== "pledged" &&
    seeded !== "swapped" &&
    seeded !== "remote-reattach" &&
    seeded !== "changeling" &&
    ticket.pledged == null &&
    ticket.swapped == null &&
    ticket.remoteLatch == null &&
    ticket.remoteReattach == null &&
    ticket.invisibleReinject == null &&
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
    pledged: scored.pledged ?? false,
    swapped: scored.swapped ?? false,
    remoteReattach: scored.remoteReattach ?? false,
    keepChosen: scored.keepChosen ?? false,
    remoteLatch: scored.remoteLatch ?? false,
    identityToken: scored.identityToken ?? false,
    invisibleReinject: scored.invisibleReinject ?? false,
    ledgerLie: scored.ledgerLie ?? false,
    fableDefault: scored.fableDefault ?? false,
    hostResume: scored.hostResume ?? false,
    transcriptOnly: scored.transcriptOnly ?? false,
  };
}

export function score(input) {
  return analyze(input).verdict;
}

export function fingerprint(input) {
  const result = analyze(input);
  return [
    result.verdict,
    result.pledged && !result.swapped ? "heir=pledged" : "heir=swapped",
    result.ledgerLie || result.swapped ? "ledger=lie" : "ledger=true",
    result.invisibleReinject || result.swapped
      ? "token=reinjected"
      : "token=session",
    result.remoteLatch || result.swapped ? "latch=remote" : "latch=quiet",
    result.remoteReattach || result.verdict === "remote-reattach"
      ? "path=remote-reattach"
      : "path=pledged",
    result.cue === "pledged"
      ? "cue=pledged"
      : result.cue === "remote-reattach"
        ? "cue=remote-reattach"
        : "cue=swapped",
  ].join("|");
}

export function handle(input) {
  const result = analyze(input);
  const booth = readBooth({
    pledged: result.pledged,
    swapped: result.swapped,
    remoteReattach: result.remoteReattach,
    keepChosen: result.keepChosen,
    remoteLatch: result.remoteLatch,
    identityToken: result.identityToken,
    invisibleReinject: result.invisibleReinject,
    ledgerLie: result.ledgerLie,
    fableDefault: result.fableDefault,
    hostResume: result.hostResume,
    cradle: input && input.cradle,
    ledger: input && input.ledger,
    swaddling: input && input.swaddling,
    latch: input && input.latch,
    token: input && input.token,
    log: input && input.log,
  });
  return {
    ...result,
    fingerprint: fingerprint(input),
    booth,
    cradle: inspectCradle({
      pledged: result.pledged,
      swapped: result.swapped,
      remoteReattach: result.remoteReattach,
      cradle: input && input.cradle,
    }),
    ledger: inspectLedger({
      pledged: result.pledged,
      swapped: result.swapped,
      ledgerLie: result.ledgerLie,
      remoteReattach: result.remoteReattach,
      ledger: input && input.ledger,
    }),
    swaddling: inspectSwaddling({
      pledged: result.pledged,
      swapped: result.swapped,
      lookalike: result.fableDefault,
      remoteReattach: result.remoteReattach,
      swaddling: input && input.swaddling,
    }),
    latch: inspectLatch({
      pledged: result.pledged,
      swapped: result.swapped,
      remoteLatch: result.remoteLatch,
      remoteReattach: result.remoteReattach,
      latch: input && input.latch,
    }),
    token: inspectToken({
      pledged: result.pledged,
      swapped: result.swapped,
      invisibleReinject: result.invisibleReinject,
      remoteReattach: result.remoteReattach,
      token: input && input.token,
    }),
    stations: BOOTH_STATIONS.map((row) => ({
      ...row,
      swapped:
        result.swapped === true ||
        result.verdict === "swapped" ||
        result.verdict === "changeling",
    })),
    published: {
      issue: FEATURED_ISSUE,
      url: ISSUE_URL,
      title: TITLE,
      state: STATE,
      labels: [...LABELS],
      platform: PLATFORM,
      pledgedModel: PLEDGED_MODEL,
      swappedModel: SWAPPED_MODEL,
      globalDefault: GLOBAL_DEFAULT,
      callCount: CALL_COUNT,
      runHours: RUN_HOURS,
      desktopBuild: DESKTOP_BUILD,
      agentSdk: AGENT_SDK,
      osLabel: OS_LABEL,
      surface: SURFACE,
      eventName: EVENT_NAME,
      noopApi: NOOP_API,
      transcriptPath: TRANSCRIPT_PATH,
      detectionField: DETECTION_FIELD,
      plaques: CHANGELING_PLAQUES,
      ruledOut: [...RULED_OUT],
      expected: [...EXPECTED],
      distribution: DISTRIBUTION,
      sessionKind: SESSION_KIND,
      stations: BOOTH_STATIONS,
      fingerprintLines: [...FINGERPRINT_LINES],
      cousins: COUSINS.map((row) => row.issue),
      backups: BACKUPS.map((row) => row.issue),
      phrase: PHRASE,
      hypothesis:
        "NON-BINDING: on remote_session_change, re-assert the session's explicit /model choice (or notify on reset). Verify against #93757 text only. Do not claim a root cause in Claude Code source you have not seen.",
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
