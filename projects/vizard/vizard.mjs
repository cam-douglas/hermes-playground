#!/usr/bin/env node
/**
 * Vizard — Elizabethan face-mask / half-mask / masque-ball /
 * gilt-edge vizard / velvet ribbon / dressing-table looking-glass booth.
 * A vizard is a historical face-mask worn to hold an assumed identity.
 * The session model should stay pledged; instead backgrounding Remote
 * Control mobile resets it to Opus 4.8 — the mask slips.
 * Velvet / gilt / parchment / ink / rouge / looking-glass silver.
 * NOT Treacle copper kettle. NOT Somnus night-nursery. NOT Cresset
 * iron-basket. NOT Dictabelt wax-belt. NOT Lemure lararium.
 * NOT Cancellans binder. NOT Arras tapestry. NOT Frangible /
 * Nameplate / Matryoshka. NOT Changeling cradle-swap (reconnect
 * reinjects global default — DIFFERENT path).
 *
 * Educational diagnostic model for a published Claude Remote Control
 * mobile defect: a model chosen for an existing session in the mobile
 * app does not survive backgrounding. Background the app, reopen it,
 * and the session's model indicator reads Opus 4.8 again. Reproduced
 * repeatedly across several sessions on 2026-09-14; every time, not
 * intermittent. Same reset later observed on desktop too. Session
 * already running; model chosen explicitly; no turn in flight; only
 * event is background→foreground.
 *
 * Encoded from anthropics/claude-code#94398 issue text only.
 * Hypothesis (NON-BINDING — issue text): session model field is not
 * rehydrated from durable session record on foreground; UI falls
 * back to Opus 4.8 default. Invite verify against #94398 text only.
 * Do NOT claim a root cause in Claude Code source you have not seen.
 * Do NOT implement a Claude Code fix. No network. No exploits.
 * No live Claude.
 *
 *   node vizard.mjs data/vizard.json
 *   echo '{"seed":"vizard"}' | node vizard.mjs
 *
 * Idle word is pledged (HOLD: session model choice survives lifecycle).
 * HOLD aliases: held, chosen, sticky-model, retained, masked-true.
 * Seeded word is vizard (#94398 path).
 * Path word is background-reset.
 * Product score word is vizard (Score vizard or admit pledged.).
 *
 * NOT #89358 (pinned model overridden mid-session by conservative
 * switch on Linux). NOT #90670 (new-session model chip ignored at
 * spawn). NOT Changeling/#93757 (reconnect reinjects global default).
 * Cite-only — do NOT rebuild them.
 */

/* Browser-safe: no top-level node: imports. CLI I/O is loaded only in main(). */

export const VERDICTS = Object.freeze([
  "pledged",
  "vizard",
  "background-reset",
  "held",
  "chosen",
  "sticky-model",
  "retained",
  "masked-true",
  "opus-fallback",
  "existing-session",
  "explicit-choice",
  "no-turn-in-flight",
  "background-foreground",
  "every-time",
  "desktop-too",
  "ios-mobile",
  "landing",
  "has-repro",
  "cousins",
  "backups",
  "fixtures",
  "walk",
  "closed",
]);

export const IDLE_WORD = "pledged";
export const PATH_WORD = "background-reset";
export const SEEDED_WORD = "vizard";
export const PRODUCT_WORD = "vizard";
export const HOLD = Object.freeze(["pledged"]);
export const HOLD_ALIASES = Object.freeze([
  "held",
  "chosen",
  "sticky-model",
  "retained",
  "masked-true",
]);
export const RECOVER = Object.freeze(["pledged"]);
export const ALARM = Object.freeze(
  VERDICTS.filter((name) => !HOLD.includes(name) && !HOLD_ALIASES.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FORBIDDEN_IDLE = Object.freeze([
  "brisk",
  "cadence",
  "released",
  "verbatim",
  "quiet",
  "intact",
  "unmasked",
  "snap",
  "ready",
  "instant",
  "bash-fast",
  "slack",
  "yielding",
  "extinguished",
  "idle-ok",
  "suspend-ready",
  "cleared",
  "affixed",
  "unpacked",
  "scoped",
  "enrolled",
  "equated",
  "penned",
  "armed",
  "bound",
  "listed",
  "scheduled",
  "muster-ok",
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
  "dragnet",
  "continuous",
  "joined",
  "seamless",
  "fluent",
  "batch-ok",
  "rostered",
  "lararium",
  "stilled",
  "removable",
  "mirrored",
  "folio-match",
  "prefix-hot",
  "tools-restored",
  "draped-open",
  "card-shown",
  "prompt-visible",
  "aisle-clear",
  "curtain-raised",
  "sealed",
  "latched",
  "guarded",
  "executable",
  "streaming-stall",
  "device-absent",
  "hold-leak",
  "segment-drop",
  "orphan-tick",
  "deferred-delta",
  "phantom-prompt",
  "chmod-failopen",
  "header-rename",
  "subst-nest",
  "root-find",
  "swapped",
  "remote-reattach",
  "precedence",
]);

export const FORBIDDEN_SEED = Object.freeze([
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
  "dragnet",
  "changeling",
  "matricula",
  "allograph",
  "agraphia",
  "anarthria",
  "souffleur",
  "palilalia",
  "mondegreen",
  "sostenuto",
  "sourdine",
  "aphonia",
  "aposiopesis",
  "gauntlet",
  "flashpan",
  "mirage",
  "deadlight",
  "glowplug",
  "relict",
  "ashpan",
  "gleaner",
  "lictor",
  "lychgate",
  "ouster",
  "proscription",
  "thimblerig",
  "fetchling",
  "rasure",
  "rasura",
  "cadastre",
  "frisket",
  "scant",
  "titulus",
  "palinode",
  "epitaph",
  "escutcheon",
  "knock",
  "oubliette",
  "eidolon",
  "quietus",
  "unmasked",
  "precedence",
  "streaming-stall",
  "device-absent",
  "hold-leak",
  "segment-drop",
  "orphan-tick",
  "deferred-delta",
  "phantom-prompt",
  "chmod-failopen",
  "header-rename",
  "subst-nest",
  "root-find",
  "swapped",
  "remote-reattach",
  "reload-blind",
  "win-posix-mismatch",
  "pre-tool-omit",
  "attach-mouse",
  "picker-bypass",
]);

export const FEATURED_ISSUE = 94398;
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/94398";
export const TITLE =
  "[BUG] Remote Control (mobile): backgrounding the app resets a running session's model to Opus 4.8";
export const STATE = "OPEN";
export const LABELS = Object.freeze([
  "bug",
  "has repro",
  "platform:macos",
  "area:model",
  "platform:ios",
]);
export const PLATFORM = "ios";
export const SURFACE = "background-reset";
export const HOST =
  "Claude mobile app (iOS); Host Claude desktop 1.52386.6 on macOS 26.6.2 (Mac17,9); Claude Code CLI 2.1.266";
export const CHECKED_ON =
  "Published report: model chosen on an existing Remote Control mobile session does not survive backgrounding; reopen and the indicator reads Opus 4.8 again, every time, 2026-09-14";
export const BUILD =
  "Claude desktop 1.52386.6; Claude Code CLI 2.1.266; Claude mobile app (iOS)";
export const SELECTED_MODEL =
  "a model other than Opus 4.8 chosen on an existing session — then Opus 4.8 after background";
export const OS =
  "iOS mobile + macOS 26.6.2 (Mac17,9) host; platform:ios / platform:macos / area:model";
export const PHRASE = "Score vizard or admit pledged.";
export const DISTRIBUTION =
  "A model chosen for an existing session in the mobile app does not survive backgrounding. Background the app, reopen it, and the session's model indicator reads Opus 4.8 again. Reproduced repeatedly across several sessions on 2026-09-14; the reset happens every time, not intermittently. The same reset behaviour has since been observed on the desktop app as well. Steps: (1) In the mobile app, open an existing session and select a model other than Opus 4.8. (2) Background the app. (3) Reopen it and check the model indicator. Expected: The per-session model selection persists across app lifecycle transitions until it is changed. The trigger is different from nearby \"model went back to Opus\" issues: #89358 is a pinned model overridden mid-session by a conservative switch (Linux); #90670 is the new-session model chip ignored at spawn so the spawned session starts on the host default. Here the session is already running, the model was chosen explicitly for it, no turn is in flight, and the only event between the correct state and the wrong one is the app going to background and coming back. No instrumented evidence: the session record stores a single model field and it was not sampled before and after backgrounding; filed on repeated user-visible reproduction. Env: Claude mobile app (iOS); Host Claude desktop 1.52386.6 on macOS 26.6.2 (Mac17,9); Claude Code CLI 2.1.266.";

export const DESKTOP_BUILD = "1.52386.6";
export const CODE_BUILD = "2.1.266";
export const HOST_OS = "macOS 26.6.2 (Mac17,9)";
export const MOBILE_SURFACE = "Claude mobile app (iOS)";
export const FALLBACK_MODEL = "Opus 4.8";
export const REPRO_DAY = "2026-09-14";
export const INTERMITTENT = false;

/**
 * Synthetic example-data — reconstructs published lifecycle shapes.
 * Labeled as such. Not a live dump.
 */
export const SYNTHETIC_PLEDGED = Object.freeze({
  model: "chosen-other-than-opus-4.8",
  survivesBackground: true,
  indicator: "chosen-other-than-opus-4.8",
  note: "per-session model selection persists across app lifecycle",
  synthetic: true,
});
export const SYNTHETIC_BACKGROUND = Object.freeze({
  when: "2026-09-14",
  event: "background app, then reopen",
  turnInFlight: false,
  sessionAlreadyRunning: true,
  synthetic: true,
});
export const SYNTHETIC_OPUS_FALLBACK = Object.freeze({
  indicator: "Opus 4.8",
  after: "background→foreground",
  everyTime: true,
  desktopToo: true,
  synthetic: true,
});

export const LEDGER_NAMES = Object.freeze([
  {
    id: "gilt-edge-vizard",
    lost: "Gilt-edge vizard — chosen face should stay tied across the looking-glass",
    control: "Per-session model selection persists across lifecycle",
    story: "the gilt edge should hold; instead the mask slips to Opus 4.8",
  },
  {
    id: "half-mask",
    lost: "Half-mask — existing session already wearing a chosen model",
    control: "Session already running; model chosen explicitly; no turn in flight",
    story: "only background→foreground happens between the correct face and the wrong one",
  },
  {
    id: "masque-ball",
    lost: "Masque-ball — Remote Control mobile dance; host still at the desk",
    control: "iOS mobile + desktop 1.52386.6 host + CLI 2.1.266",
    story: "the ball continues; the face is not the one pledged",
  },
  {
    id: "velvet-ribbon",
    lost: "Velvet ribbon — the tie that should keep the vizard on",
    control: "Model chip should still name the chosen model after reopen",
    story: "the ribbon loosens on background and the chip reads Opus 4.8",
  },
  {
    id: "looking-glass",
    lost: "Looking-glass — indicator reads Opus 4.8 after reopen",
    control: "Looking-glass should still show the pledged face",
    story: "every time, not intermittent; several sessions on 2026-09-14",
  },
  {
    id: "dressing-table",
    lost: "Dressing-table — same slip later observed on desktop too",
    control: "Lifecycle hold should be the same on mobile and desktop",
    story: "the table shows Opus 4.8 on both looking-glasses",
  },
]);

export const BOOTH_STATIONS = Object.freeze([
  {
    id: "gilt-edge-vizard",
    survey: "ordinary pledged: chosen model survives background→foreground",
    kind: "pledged",
    note: "idle/control: session model choice survives lifecycle",
  },
  {
    id: "half-mask",
    survey: "existing session; model chosen explicitly; no turn in flight",
    kind: "vizard",
    note: "seeded: only event is background→foreground",
  },
  {
    id: "masque-ball",
    survey: "Remote Control mobile; host desktop 1.52386.6; CLI 2.1.266",
    kind: "vizard",
    note: "seeded: iOS mobile masque with a macOS host",
  },
  {
    id: "velvet-ribbon",
    survey: "model chip should stay tied; instead it slips",
    kind: "vizard",
    note: "seeded: ribbon loosens on background",
  },
  {
    id: "looking-glass",
    survey: "reopen — indicator reads Opus 4.8 again, every time",
    kind: "vizard",
    note: "seeded: looking-glass shows the fallback face",
  },
  {
    id: "dressing-table",
    survey: "background-reset — same slip later observed on desktop too",
    kind: "vizard",
    note: "path: background-reset names the lifecycle slip",
  },
]);

export const FIELD_MARKS = Object.freeze([
  {
    id: "opus-fallback",
    label: "opus-fallback",
    count: "Opus 4.8",
    note: "Model indicator reads Opus 4.8 after reopen",
  },
  {
    id: "existing-session",
    label: "existing-session",
    count: "running",
    note: "Session already running; not a spawn-time chip miss",
  },
  {
    id: "explicit-choice",
    label: "explicit-choice",
    count: "chosen",
    note: "Model selected explicitly for this session",
  },
  {
    id: "no-turn-in-flight",
    label: "no-turn-in-flight",
    count: "idle turn",
    note: "No turn in flight between the correct state and the wrong one",
  },
  {
    id: "background-foreground",
    label: "background-foreground",
    count: "only event",
    note: "Only event is the app going to background and coming back",
  },
  {
    id: "every-time",
    label: "every-time",
    count: "2026-09-14",
    note: "Reproduced repeatedly across several sessions; every time",
  },
]);

export const RULED_OUT = Object.freeze([
  "#89358 — pinned model overridden mid-session by a conservative switch (Linux) — DIFFERENT trigger; cite only",
  "#90670 — new-session model chip ignored at spawn so spawned session starts on host default — DIFFERENT; session here is already running",
  "Changeling/#93757 — remote reconnect re-injects the global default — DIFFERENT: reconnect reinjection, not background lifecycle reset to Opus 4.8",
  "Treacle/#94344 — Windows PowerShell first-call streaming-stall — DIFFERENT",
  "Somnus/#94415 — Cowork cloud schedule device_absent — DIFFERENT",
  "Cresset/#94420 — keep-awake GNOME hold never released — DIFFERENT",
  "Dictabelt/#94406 — desktop voice-dictation segment-drop — DIFFERENT",
  "Lemure/#94410 — leftover ScheduledTasks dispatcher ticks — DIFFERENT",
  "Cancellans/#94400 — deferred-delta binder folio — DIFFERENT",
  "Arras/#94348 — phantom-prompt theater tapestry — DIFFERENT",
  "Frangible/#94362 — chmod-failopen wax-seal — DIFFERENT",
  "Nameplate/#94349 — header-rename brass plate — DIFFERENT",
  "Matryoshka/#94350 — subst-nest nesting-doll — DIFFERENT",
  "#94336 — do NOT pick",
]);

export const EXPECTED = Object.freeze([
  "The per-session model selection persists across app lifecycle transitions until it is changed",
  "Backgrounding and reopening the mobile app leaves the model indicator on the chosen model",
  "An existing running session does not fall back to Opus 4.8 with no turn in flight",
  "The same hold applies when the same reset is observed on desktop",
]);

export const FINGERPRINT_LINES = Object.freeze([
  "background-reset",
  "vizard",
  "opus-fallback",
  "existing-session",
  "background-foreground",
]);

export const COUSINS = Object.freeze([
  {
    issue: 89358,
    title: "pinned model overridden mid-session by a conservative switch (Linux)",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — mid-session conservative switch, not background lifecycle. Do not rebuild. Do not conflate.",
  },
  {
    issue: 90670,
    title: "new-session model chip ignored at spawn so spawned session starts on host default",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — spawn-time chip miss; here the session is already running. Do not rebuild. Do not conflate.",
  },
]);

export const CHANGELING_CITE = Object.freeze({
  issue: 93757,
  title: "Session reconnect silently discards an explicit /model choice and falls back to the global default",
  citeOnly: true,
  why: "Cite only — Changeling is a reconnect reinjection path. This booth is background lifecycle reset to Opus 4.8 on RC mobile.",
});

export const BACKUPS = Object.freeze([
  { issue: 94397, title: "double reply via brief-mode SendUserMessage", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94396, title: "forked sessions never RC eligible", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94393, title: "Monitor persistent/timeout", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94392, title: "headless -p exits with Tasks running", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 86198, title: "slash mid-advisor 400s session", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94417, title: "CLAUDE.md auto-memory not cache-shared", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93924, title: "RC slows local session", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93770, title: "TUI copy padding", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93777, title: "Vercel MCP teamId", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94151, title: "Shift+PageUp Konsole", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
]);

export const NOT_PRODUCTS = Object.freeze([
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
  "dragnet",
  "changeling",
  "matricula",
  "allograph",
  "agraphia",
  "anarthria",
  "souffleur",
  "palilalia",
  "mondegreen",
  "sostenuto",
  "sourdine",
  "aphonia",
  "aposiopesis",
  "gauntlet",
  "lictor",
  "lychgate",
  "ouster",
  "proscription",
  "frisket",
  "scant",
  "knock",
  "oubliette",
  "eidolon",
  "quietus",
  "wraith",
  "afterimage",
  "scrim",
  "cachet",
  "veto",
  "thimblerig",
  "fetchling",
  "rasure",
  "titulus",
  "palinode",
  "epitaph",
  "escutcheon",
]);

export const SAMPLE_KIND_IDLE = "gilt-edge-vizard";
export const SAMPLE_KIND_SEEDED = "background-reset";
export const SAMPLE_HOLDING_IDLE = "masked-true";
export const SAMPLE_HOLDING_SEEDED = "looking-glass";

export const SAMPLE_PLEDGED_PROOF = Object.freeze({
  pledged: true,
  vizard: false,
  backgroundReset: false,
  opusFallback: false,
  kind: SAMPLE_KIND_IDLE,
});

export const SAMPLE_VIZARD_PROOF = Object.freeze({
  pledged: false,
  vizard: true,
  backgroundReset: true,
  opusFallback: true,
  existingSession: true,
  explicitChoice: true,
  noTurnInFlight: true,
  backgroundForeground: true,
  everyTime: true,
  desktopToo: true,
  kind: SAMPLE_KIND_SEEDED,
  names: LEDGER_NAMES.map((row) => row.id),
  pledgedCase: { ...SYNTHETIC_PLEDGED },
  background: { ...SYNTHETIC_BACKGROUND },
  fallback: { ...SYNTHETIC_OPUS_FALLBACK },
  synthetic: true,
});

export const SAMPLE_WALK_LOG = Object.freeze([
  { t: "idle", line: "booth holds pledged: session model choice survives lifecycle" },
  { t: "background-reset", line: "existing session; model chosen; no turn; background then reopen" },
  { t: "path", line: "background-reset — looking-glass reads Opus 4.8 again, every time" },
  { t: "score", line: "when the mask slips to Opus 4.8 the booth is vizard — Score vizard or admit pledged." },
]);

const FORCE_FLAGS = [
  "backgroundReset",
  "opusFallback",
  "existingSession",
  "explicitChoice",
  "noTurnInFlight",
  "backgroundForeground",
];

const ISSUE_CUE_RE =
  /94398|Opus 4\.8|backgrounding|1\.52386\.6|2\.1\.266|Mac17,9|2026-09-14/i;

/**
 * Educational lifecycle evaluation. Not a Claude Code patch.
 * Encodes only the published #94398 shapes.
 * pledged=true is the HOLD / model-survives-lifecycle path.
 *
 * Pledged/HOLD when: the chosen session model survives background.
 * Vizard / background-reset when: reopen shows Opus 4.8.
 */
export function evaluateLifecycle({
  pledged = false,
  backgrounded = false,
  rehydrated = false,
  opusFallback = false,
} = {}) {
  if (pledged === true && !opusFallback && !backgrounded) {
    return {
      slipped: false,
      opusFallback: false,
      rehydrated: true,
      phrase: "admit pledged",
      synthetic: true,
    };
  }
  const slipped =
    (backgrounded === true || opusFallback === true) && rehydrated !== true;
  return {
    slipped,
    opusFallback: slipped || opusFallback,
    rehydrated: rehydrated === true && !slipped,
    phrase: slipped ? "score vizard" : "admit pledged",
    synthetic: true,
  };
}

export function scoreBackgroundReset(input = {}) {
  const pledgedHold = input.pledged === true && input.vizard !== true;
  const lifecycle = evaluateLifecycle({
    pledged: pledgedHold,
    backgrounded:
      input.backgroundReset === true || input.backgroundForeground === true,
    rehydrated: input.opusFallback !== true && pledgedHold,
    opusFallback: input.opusFallback === true || input.vizard === true,
  });
  const vizard =
    !pledgedHold &&
    (lifecycle.slipped === true ||
      input.vizard === true ||
      input.backgroundReset === true ||
      input.opusFallback === true);
  return {
    pledged: !vizard,
    vizard,
    backgroundReset: vizard,
    lifecycle,
    phrase: vizard ? "score vizard" : "admit pledged",
  };
}

export function mentionsIssueCue(input = {}) {
  if (input.issue === FEATURED_ISSUE || input.issue === "94398") return true;
  const blob = typeof input === "string" ? input : JSON.stringify(input);
  return ISSUE_CUE_RE.test(blob);
}

export function mapVizard(input = {}) {
  const vizard = isVizardInput(input);
  const pledged = input.pledged === true && !vizard;
  return {
    stamp: vizard ? "background-reset" : "masked-true",
    holdingLane: vizard ? "looking-glass" : "masked-true",
    kindLane: vizard ? "background-reset" : "gilt-edge-vizard",
    bindLane: vizard ? "velvet-ribbon" : "sticky-model",
    ribbon: vizard ? "vizard" : "pledged",
    pledged,
  };
}

export function inspectOpusFallback(input = {}) {
  const slipped =
    input.opusFallback === true ||
    input.vizard === true ||
    input.backgroundReset === true ||
    isVizardInput(input);
  if (input.pledged === true && !slipped) {
    return { stamp: "chosen-face", slipped: false, note: "indicator still names the pledged model" };
  }
  return {
    stamp: slipped ? "opus-fallback" : "fallback-idle",
    slipped,
    note: slipped
      ? "opus-fallback — looking-glass reads Opus 4.8 after reopen"
      : "",
  };
}

export function inspectExistingSession(input = {}) {
  const running =
    input.existingSession === true ||
    input.vizard === true ||
    isVizardInput(input);
  if (input.pledged === true && !running) {
    return { stamp: "session-idle", running: false };
  }
  return {
    stamp: running ? "existing-session" : "session-idle",
    running,
    note: running
      ? "existing-session — already running; not a spawn-time chip miss"
      : "",
  };
}

export function inspectExplicitChoice(input = {}) {
  const chosen =
    input.explicitChoice === true ||
    input.vizard === true ||
    isVizardInput(input);
  if (input.pledged === true && !chosen) {
    return { stamp: "choice-hold", chosen: false };
  }
  return {
    stamp: chosen ? "explicit-choice" : "choice-idle",
    chosen,
    note: chosen
      ? "explicit-choice — model selected for this session, then lost"
      : "",
  };
}

export function inspectNoTurnInFlight(input = {}) {
  const idle =
    input.noTurnInFlight === true ||
    input.vizard === true ||
    isVizardInput(input);
  if (input.pledged === true && !idle) {
    return { stamp: "turn-hold", idle: false };
  }
  return {
    stamp: idle ? "no-turn-in-flight" : "turn-idle",
    idle,
    note: idle
      ? "no-turn-in-flight — only event is background→foreground"
      : "",
  };
}

export function inspectBackgroundForeground(input = {}) {
  const cycle =
    input.backgroundForeground === true ||
    input.backgroundReset === true ||
    input.vizard === true ||
    isVizardInput(input);
  if (input.pledged === true && !cycle) {
    return { stamp: "lifecycle-hold", cycle: false };
  }
  return {
    stamp: cycle ? "background-foreground" : "lifecycle-idle",
    cycle,
    note: cycle
      ? "background-foreground — only event between the correct face and Opus 4.8"
      : "",
  };
}

function ledgerOpen(input, id) {
  const map = {
    "gilt-edge-vizard": input.vizard || input.backgroundReset,
    "half-mask": input.vizard || input.existingSession || input.explicitChoice,
    "masque-ball": input.vizard || input.iosMobile,
    "velvet-ribbon": input.opusFallback || input.backgroundReset,
    "looking-glass": input.opusFallback || input.vizard,
    "dressing-table": input.desktopToo || input.everyTime,
  };
  return (
    map[id] === true ||
    input.backgroundReset === true ||
    input.vizard === true
  );
}

function isVizardInput(input = {}) {
  return (
    input.vizard === true ||
    input.backgroundReset === true ||
    input.opusFallback === true ||
    input.existingSession === true ||
    input.explicitChoice === true ||
    input.noTurnInFlight === true ||
    input.backgroundForeground === true ||
    input.everyTime === true ||
    input.desktopToo === true
  );
}

export function readBooth(input = {}) {
  const vizard = isVizardInput(input);
  const pledged = input.pledged === true && !vizard;
  return {
    mark: vizard ? "vizard" : "pledged",
    pledged,
    vizard,
    backgroundReset: input.backgroundReset === true || vizard,
    opusFallback: input.opusFallback === true,
    existingSession: input.existingSession === true,
    explicitChoice: input.explicitChoice === true,
    noTurnInFlight: input.noTurnInFlight === true,
    backgroundForeground: input.backgroundForeground === true,
    everyTime: input.everyTime === true,
    desktopToo: input.desktopToo === true,
    clinic: mapVizard(input),
    fallback: inspectOpusFallback(input),
    session: inspectExistingSession(input),
    choice: inspectExplicitChoice(input),
    turn: inspectNoTurnInFlight(input),
    cycle: inspectBackgroundForeground(input),
    names: LEDGER_NAMES.filter((row) => ledgerOpen(input, row.id)).map(
      (row) => row.id,
    ),
    log: input.log || [],
  };
}

export const VIZARD_WALK = Object.freeze([
  {
    t: "idle",
    event: "masked-true",
    pledged: true,
    vizard: false,
    cue: "pledged",
    note: "idle HOLD: session model choice survives lifecycle",
  },
  {
    t: "background-reset",
    event: "background-reset",
    vizard: true,
    backgroundReset: true,
    opusFallback: true,
    existingSession: true,
    explicitChoice: true,
    noTurnInFlight: true,
    cue: "vizard",
    note: "existing session; model chosen; no turn; background then reopen",
  },
  {
    t: "path",
    event: "background-reset",
    vizard: true,
    backgroundReset: true,
    opusFallback: true,
    existingSession: true,
    explicitChoice: true,
    noTurnInFlight: true,
    backgroundForeground: true,
    everyTime: true,
    desktopToo: true,
    cue: "vizard",
    note: "background-reset — looking-glass reads Opus 4.8 again, every time",
  },
  {
    t: "score",
    event: "vizard",
    vizard: true,
    backgroundReset: true,
    opusFallback: true,
    existingSession: true,
    explicitChoice: true,
    noTurnInFlight: true,
    backgroundForeground: true,
    everyTime: true,
    desktopToo: true,
    cue: "vizard",
    note: "vizard — the mask slips to Opus 4.8 on background lifecycle",
  },
]);

export const POSITIVE_CONTROL_WALK = Object.freeze([
  {
    t: "hold",
    event: "masked-true",
    pledged: true,
    vizard: false,
    cue: "pledged",
    note: "positive control: chosen model survives background→foreground",
  },
  {
    t: "admit",
    event: "masked-true",
    pledged: true,
    cue: "pledged",
    note: "positive control: the booth admits pledged",
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
    vizard: false,
    backgroundReset: false,
    cue: "pledged",
  };
}

export function seedPledged() {
  return { ...emptyTicket() };
}

export function seedVizard() {
  return {
    seed: SEEDED_WORD,
    pledged: false,
    vizard: true,
    backgroundReset: true,
    opusFallback: true,
    existingSession: true,
    explicitChoice: true,
    noTurnInFlight: true,
    backgroundForeground: true,
    everyTime: true,
    desktopToo: true,
    cue: "vizard",
    issue: FEATURED_ISSUE,
    proof: SAMPLE_VIZARD_PROOF,
  };
}

export function seedProduct() {
  return {
    seed: PRODUCT_WORD,
    preferSeed: true,
    vizard: true,
    backgroundReset: true,
    cue: "vizard",
  };
}

export function seedBackgroundReset() {
  return {
    seed: PATH_WORD,
    preferSeed: true,
    vizard: true,
    backgroundReset: true,
    event: "background-reset",
    cue: "vizard",
  };
}

export function seedHeld() {
  return { seed: "held", preferSeed: true, pledged: true, cue: "pledged" };
}

export function seedChosen() {
  return { seed: "chosen", preferSeed: true, pledged: true, cue: "pledged" };
}

export function seedStickyModel() {
  return { seed: "sticky-model", preferSeed: true, pledged: true, cue: "pledged" };
}

export function seedRetained() {
  return { seed: "retained", preferSeed: true, pledged: true, cue: "pledged" };
}

export function seedMaskedTrue() {
  return { seed: "masked-true", preferSeed: true, pledged: true, cue: "pledged" };
}

export function seedOpusFallback() {
  return {
    seed: "opus-fallback",
    preferSeed: true,
    opusFallback: true,
    cue: "vizard",
  };
}

export function seedExistingSession() {
  return {
    seed: "existing-session",
    preferSeed: true,
    existingSession: true,
    cue: "vizard",
  };
}

export function normalizeBooth(raw) {
  if (!raw || typeof raw !== "object") {
    return {
      pledged: false,
      vizard: false,
      backgroundReset: false,
      opusFallback: false,
      existingSession: false,
      explicitChoice: false,
      noTurnInFlight: false,
      backgroundForeground: false,
      everyTime: false,
      desktopToo: false,
      cue: null,
      event: null,
      t: null,
    };
  }
  return {
    pledged: raw.pledged === true,
    vizard: raw.vizard === true || raw.event === "vizard",
    backgroundReset:
      raw.backgroundReset === true || raw.event === "background-reset",
    opusFallback:
      raw.opusFallback === true || raw.event === "opus-fallback",
    existingSession:
      raw.existingSession === true || raw.event === "existing-session",
    explicitChoice:
      raw.explicitChoice === true || raw.event === "explicit-choice",
    noTurnInFlight:
      raw.noTurnInFlight === true || raw.event === "no-turn-in-flight",
    backgroundForeground:
      raw.backgroundForeground === true || raw.event === "background-foreground",
    everyTime:
      raw.everyTime === true || raw.event === "every-time",
    desktopToo:
      raw.desktopToo === true || raw.event === "desktop-too",
    iosMobile: raw.iosMobile,
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
      (ticket.pledged != null ||
        ticket.vizard != null ||
        ticket.backgroundReset != null ||
        ticket.opusFallback != null ||
        ticket.existingSession != null ||
        ticket.explicitChoice != null ||
        ticket.noTurnInFlight != null ||
        ticket.backgroundForeground != null ||
        ticket.everyTime != null ||
        ticket.desktopToo != null ||
        ticket.cue != null ||
        ticket.event ||
        ticket.proof),
  );
}

function isPledged(row) {
  if (row.vizard && row.cue !== "pledged") return false;
  if (row.cue === "vizard" || row.cue === "background-reset") return false;
  if (
    row.backgroundReset &&
    row.opusFallback &&
    row.cue !== "pledged" &&
    row.pledged !== true
  ) {
    return false;
  }
  if (
    row.pledged === true &&
    row.vizard !== true &&
    row.cue !== "vizard"
  ) {
    return true;
  }
  if (
    row.cue === "pledged" &&
    row.vizard !== true &&
    row.backgroundReset !== true &&
    FORCE_FLAGS.every((flag) => row[flag] !== true)
  ) {
    return true;
  }
  return false;
}

function isBackgroundReset(row) {
  return (
    row.event === "background-reset" &&
    !isPledged(row) &&
    (row.backgroundReset === true ||
      row.opusFallback === true ||
      row.vizard === true)
  );
}

function isVizardRow(row) {
  if (isPledged(row)) return false;
  if (isBackgroundReset(row) && row.cue !== "vizard") return false;
  if (row.cue === "vizard") return true;
  if (row.vizard === true) return true;
  if (row.backgroundReset === true && row.opusFallback === true) return true;
  if (
    row.backgroundReset === true ||
    row.opusFallback === true ||
    row.existingSession === true ||
    row.explicitChoice === true ||
    row.noTurnInFlight === true ||
    row.backgroundForeground === true ||
    row.everyTime === true ||
    row.desktopToo === true
  ) {
    return true;
  }
  return false;
}

/**
 * Score one vizard pass against the dressing-table.
 * pledged: session model choice survives lifecycle.
 * vizard: backgrounding resets the indicator to Opus 4.8.
 * background-reset: names that path.
 */
export function scoreGate(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const row = normalizeBooth(ticket);
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);

  let verdict = IDLE_WORD;
  if (
    isBackgroundReset(row) ||
    (row.backgroundReset && ticket.preferSeed && seeded === PATH_WORD)
  ) {
    verdict = "background-reset";
  } else if (isVizardRow(row)) {
    verdict = "vizard";
  } else if (isPledged(row)) {
    verdict = "pledged";
  } else if (
    row.backgroundReset ||
    row.opusFallback ||
    row.existingSession ||
    row.explicitChoice ||
    row.noTurnInFlight ||
    row.backgroundForeground ||
    row.everyTime ||
    row.desktopToo
  ) {
    verdict = "vizard";
  } else if (mentionsIssueCue(ticket) && !seeded) {
    verdict = "vizard";
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
    pledged: verdict === "pledged",
    vizard: verdict === "vizard" || verdict === SEEDED_WORD,
    backgroundReset:
      row.backgroundReset === true ||
      verdict === "background-reset" ||
      verdict === PATH_WORD,
    opusFallback: row.opusFallback,
    existingSession: row.existingSession,
    explicitChoice: row.explicitChoice,
    noTurnInFlight: row.noTurnInFlight,
    backgroundForeground: row.backgroundForeground,
    everyTime: row.everyTime,
    desktopToo: row.desktopToo,
    cue: hold
      ? "pledged"
      : row.backgroundReset || verdict === "background-reset"
        ? "background-reset"
        : "vizard",
    event: row.event,
    t: row.t,
    phrase: hold ? "admit pledged" : "score vizard",
    fallbackInspect: inspectOpusFallback(row),
    sessionInspect: inspectExistingSession(row),
    choiceInspect: inspectExplicitChoice(row),
    turnInspect: inspectNoTurnInFlight(row),
    cycleInspect: inspectBackgroundForeground(row),
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
      : VIZARD_WALK;
  const scored = rows.map((row) => ({
    ...normalizeBooth(row),
    ...scoreGate({ ...row, preferSeed: false }),
  }));
  const charged = scored.filter((row) => row.verdict === "vizard");
  const path = scored.filter((row) => row.verdict === "background-reset");
  const pledged = scored.filter((row) => row.verdict === "pledged");
  const headline =
    scored.find((row) => row.event === "vizard") ||
    scored.find((row) => row.event === "background-reset") ||
    scored.find((row) => row.event === "opus-fallback") ||
    charged[charged.length - 1];
  let verdict = "pledged";
  if (charged.length) verdict = "vizard";
  else if (path.length && !pledged.length) {
    verdict = "background-reset";
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
    vizardCount: charged.length,
    pathCount: path.length,
    pledgedCount: pledged.length,
    headline,
    rows: scored,
    phrase: HOLD.includes(verdict) ? "admit pledged" : "score vizard",
    note: headline
      ? "Remote Control (mobile): a model chosen on an existing session does not survive backgrounding — reopen and the indicator reads Opus 4.8 again (every time). Desktop 1.52386.6; CLI 2.1.266; iOS mobile; macOS 26.6.2. Cite-only cousins #89358 #90670. Changeling/#93757 cite only."
      : "published vizard walk scored against pledged vs vizard",
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
    seeded !== "vizard" &&
    seeded !== "background-reset" &&
    ticket.pledged == null &&
    ticket.vizard == null &&
    ticket.backgroundReset == null &&
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
    vizard: scored.vizard ?? false,
    backgroundReset: scored.backgroundReset ?? false,
    opusFallback: scored.opusFallback ?? false,
    existingSession: scored.existingSession ?? false,
    explicitChoice: scored.explicitChoice ?? false,
    noTurnInFlight: scored.noTurnInFlight ?? false,
    backgroundForeground: scored.backgroundForeground ?? false,
    everyTime: scored.everyTime ?? false,
    desktopToo: scored.desktopToo ?? false,
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
    result.backgroundReset || result.vizard
      ? "kind=background-reset"
      : "kind=gilt-edge-vizard",
    result.opusFallback || result.vizard
      ? "ref=opus-fallback"
      : "ref=masked-true",
    result.backgroundReset || result.verdict === "background-reset"
      ? "path=background-reset"
      : "path=pledged",
    result.cue === "pledged"
      ? "cue=pledged"
      : result.cue === "background-reset"
        ? "cue=background-reset"
        : "cue=vizard",
  ].join("|");
}

export function handle(input) {
  const result = analyze(input);
  const booth = readBooth({
    pledged: result.pledged,
    vizard: result.vizard,
    backgroundReset: result.backgroundReset,
    opusFallback: result.opusFallback,
    existingSession: result.existingSession,
    explicitChoice: result.explicitChoice,
    noTurnInFlight: result.noTurnInFlight,
    backgroundForeground: result.backgroundForeground,
    everyTime: result.everyTime,
    desktopToo: result.desktopToo,
    proof: input && input.proof,
    log: input && input.log,
  });
  return {
    ...result,
    fingerprint: fingerprint(input),
    booth,
    fallback: inspectOpusFallback({
      pledged: result.pledged,
      vizard: result.vizard,
      opusFallback: result.opusFallback,
    }),
    session: inspectExistingSession({
      pledged: result.pledged,
      vizard: result.vizard,
      existingSession: result.existingSession,
    }),
    choice: inspectExplicitChoice({
      pledged: result.pledged,
      vizard: result.vizard,
      explicitChoice: result.explicitChoice,
    }),
    turn: inspectNoTurnInFlight({
      pledged: result.pledged,
      vizard: result.vizard,
      noTurnInFlight: result.noTurnInFlight,
    }),
    cycle: inspectBackgroundForeground({
      pledged: result.pledged,
      vizard: result.vizard,
      backgroundForeground: result.backgroundForeground,
    }),
    clinic: mapVizard({
      pledged: result.pledged,
      vizard: result.vizard,
      backgroundReset: result.backgroundReset,
      opusFallback: result.opusFallback,
    }),
    stations: BOOTH_STATIONS.map((row) => ({
      ...row,
      vizard: result.vizard === true || result.verdict === "vizard",
    })),
    leakPath: scoreBackgroundReset({
      pledged: result.pledged === true && !result.vizard,
      vizard: result.vizard,
      backgroundReset: result.backgroundReset,
      opusFallback: result.opusFallback,
      backgroundForeground: result.backgroundForeground,
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
      distribution: DISTRIBUTION,
      stations: BOOTH_STATIONS,
      fingerprintLines: [...FINGERPRINT_LINES],
      cousins: COUSINS.map((row) => row.issue),
      backups: BACKUPS.map((row) => row.issue),
      changeling: CHANGELING_CITE.issue,
      phrase: PHRASE,
      hypothesis:
        "NON-BINDING (issue text): session model field is not rehydrated from durable session record on foreground; UI falls back to Opus 4.8 default. Invite verify against #94398 text only. Do not claim a root cause in Claude Code source you have not seen.",
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
