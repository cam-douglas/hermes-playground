#!/usr/bin/env node
/**
 * Drawbridge — medieval castle drawbridge / portcullis / bailey
 * approach / gatehouse / raised-span booth.
 *
 * Educational diagnostic model for a published Claude Code defect:
 * Claude Code desktop auto-update restarts the app and terminates the
 * machine-wide Remote Control bridge. Every RC session across unrelated
 * projects goes offline at once. Conversations resume and keep writing
 * locally, so the break is invisible. No notification.
 * bridge-state.json freezes with a stale localSessionId that matches
 * neither live session. The settings checkbox only says future sessions
 * will be connected — there is no way to reattach already-running
 * sessions. User must abandon and recreate every in-flight conversation.
 *
 *   node drawbridge.mjs data/drawbridge.json
 *   echo '{"seed":"drawbridge"}' | node drawbridge.mjs
 *
 * Idle word is spanned (HOLD: open-span / linked / moored / joined).
 * Seeded word is drawbridge (#94049 — the rc-bridge-update-drop path).
 * Path word is rc-bridge-update-drop.
 * Product score word is drawbridge (Score drawbridge or admit spanned.).
 *
 * Encoded from anthropics/claude-code#94049 issue text only.
 * Hypothesis (NON-BINDING): auto-update restart tears down the
 * machine-wide bridge and never rebinds live interactive sessions;
 * checkbox gates future sessions only; bridge-state is not reconciled
 * to live session ids.
 * Do NOT claim a root cause in Claude Code source you have not seen.
 * Do NOT implement a fix. No network. No exploits. No live Claude.
 * No secrets.
 *
 * NOT Chirograph/#94045 (worktree branch rename stale).
 * NOT Titulus/#94025 (resume stale title).
 * NOT Derelict/#93996 (orphan Bash).
 * NOT Vestry/#94008 (bwrap mount refcount).
 * NOT Surfeit/#94012 (quota spawn cascade).
 * NOT Phosphene/#94003 (WindowServer CA thrash).
 * NOT Parablepsis/#93954 (Latin-1 edit wipe).
 * NOT Demesne/#93989 (home bind overreach).
 * NOT Cartouche/#93772. NOT Attaint/#93821. NOT Oriel/#93809.
 * NOT Diplopia / Fulcrum / Mondegreen.
 * Cousins cite-only: #90387 (RC archived on teardown after auto-update),
 * #84793 (remoteControlAtStartup not honored on resume after auto-update),
 * #84805 (restored sessions never re-register RC), #90172 (stealth
 * relaunch destroys hosts), #85413 (auto-update kills live session
 * hosts), #82462 / #80400 (registration-lost cousins).
 * Drawbridge is specifically: auto-update raises the machine-wide
 * Remote Control span; halls stay lit; no horn; gatehouse ledger only
 * admits future carts.
 */

/* Browser-safe: no top-level node: imports. CLI I/O is loaded only in main(). */

export const VERDICTS = Object.freeze([
  "spanned",
  "drawbridge",
  "rc-bridge-update-drop",
  "hold",
  "open-span",
  "linked",
  "moored",
  "joined",
  "auto-update-restart",
  "bridge-state-stale",
  "silent-drop",
  "future-sessions-only",
  "multi-project-offline",
  "transcript-survives",
  "landing",
  "has-repro",
  "cousins",
  "backups",
  "fixtures",
  "walk",
]);

export const IDLE_WORD = "spanned";
export const PATH_WORD = "rc-bridge-update-drop";
export const SEEDED_WORD = "drawbridge";
export const PRODUCT_WORD = "drawbridge";
export const HOLD = Object.freeze(["spanned", "hold"]);
export const HOLD_ALIASES = Object.freeze([
  "spanned",
  "open-span",
  "linked",
  "moored",
  "joined",
]);
export const RECOVER = Object.freeze(["spanned", "hold"]);
export const ALARM = Object.freeze(
  VERDICTS.filter((name) => !HOLD.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FORBIDDEN_IDLE = Object.freeze([
  "matched",
  "chirograph",
  "worktree-rename-stale",
  "bipartite",
  "moiety",
  "indenture",
  "current",
  "inscribed",
  "titulus",
  "resume-stale-title",
  "plaque",
  "latest-wins",
  "synced",
  "sidebar-stale",
  "custom-title-clobber",
  "ios-rename",
  "list-sessions-stale",
  "pegged",
  "vestry",
  "mount-refcount-race",
  "hung",
  "stowed",
  "refcounted",
  "co-tenant",
  "tempered",
  "surfeit",
  "quota-spawn-cascade",
  "solvent",
  "frugal",
  "circuit-held",
  "no-spawn",
  "quiescent",
  "phosphene",
  "layer-tree-walk",
  "diplomatic",
  "parablepsis",
  "latin1-edit-wipe",
  "demesned",
  "demesne",
  "home-bind-overreach",
  "diagrammed",
  "cartouche",
  "section-poster",
  "unattainted",
  "attaint",
  "session-attainder",
  "reflowed",
  "oriel",
  "plan-no-reflow",
  "articulate",
  "anarthria",
  "dictation-paste-drop",
  "limber",
  "trismus",
  "notif-xpc-deadlock",
  "filiated",
  "foundling",
  "subagent-bash-outlive",
  "injective",
  "crased",
  "crasis",
  "store-slug-collide",
  "unitary",
  "tessellated",
  "tessera",
  "version-path-tcc",
  "verbatim",
  "mojibaked",
  "mojibake",
  "fffd-spall",
  "latent",
  "afterimage",
  "legible",
  "scotomized",
  "scotoma",
  "command-args-blind",
  "followspot",
  "thrash",
  "scrim",
  "relict",
  "pentimento",
  "scissel",
  "feoffee",
  "apograph",
  "airlock",
  "gleaner",
  "unreaped",
  "vested",
  "plenary",
  "berthed",
  "singular",
  "equalized",
  "calibrated",
  "tethered",
  "engaged",
  "flush",
  "candid",
  "stetted",
  "sighted",
  "derelict",
  "orphaned",
  "session-kill-orphan",
  "mondegreen",
  "monadnock",
  "escheat",
  "midden",
  "entresol",
  "deadletter",
  "gland",
  "diplopia",
  "fulcrum",
]);

export const FORBIDDEN_SEED = Object.freeze(
  FORBIDDEN_IDLE.filter((name) => name !== "drawbridge"),
);

export const FEATURED_ISSUE = 94049;
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/94049";
export const TITLE =
  "Auto-update silently drops all Remote Control bridges; running sessions cannot reconnect";
export const STATE = "OPEN";
export const LABELS = Object.freeze([
  "bug",
  "has-repro",
  "platform:windows",
  "area:desktop",
]);
export const PLATFORM = "windows";
export const SURFACE = "rc-bridge-update-drop";
export const HOST = "Claude Code desktop Windows Remote Control bridge";
export const CHECKED_ON =
  "Claude Code desktop Windows 2.1.266 → 2.1.270 auto-update; Windows 10 Pro 19045; 2026-09-13 ~20:09 local UTC+3";
export const BUILD = "2.1.266 → 2.1.270";
export const SELECTED_MODEL = "unspecified";
export const OS = "windows 10 pro 19045";
export const PHRASE = "Score drawbridge or admit spanned.";
export const DISTRIBUTION =
  "Claude Code desktop Windows auto-update 2.1.266 → 2.1.270 restarted the app and terminated the machine-wide Remote Control bridge. Every RC session across unrelated projects went offline at once. Conversations resumed and kept writing locally, so the break was invisible. No notification. bridge-state.json last written at restart with a stale localSessionId that matches neither live session. Settings checkbox only says future sessions will be connected — no way to reattach already-running sessions. User must abandon and recreate every in-flight conversation. Evidence: all claude processes restarted ~20:09:31; two live processes different versions; crash queue empty; all remote peers offline; jsonl transcripts keep appending; SessionStart hooks fire. Repro: enable RC checkbox (future sessions), start two sessions in different projects reachable remotely, let app auto-update/restart, conversations resume locally, remote device cannot reach either.";

export const RULED_OUT = Object.freeze([
  "Chirograph/#94045 worktree-rename-stale — recorded branch never refreshed after git branch -m",
  "Titulus/#94025 resume-stale-title — iOS rename vs desktop sidebar title cache",
  "Derelict/#93996 session-kill-orphan — Bash-tool subprocesses survive session stop",
  "Vestry/#94008 mount-refcount-race — Linux bwrap placeholder Set, not Remote Control",
  "Surfeit/#94012 quota-spawn-cascade — orchestrator spawn after session-limit",
  "Phosphene/#94003 layer-tree-walk — WindowServer CA thrash",
  "Parablepsis/#93954 latin1-edit-wipe — collation wipe, not RC bridge",
  "Demesne/#93989 home-bind-overreach — `--bind /home /home` vs `$HOME`",
  "Cartouche/#93772 section-poster — wrong diagram type",
  "Attaint/#93821 session-attainder — cyber-safeguard stain",
  "Oriel/#93809 plan-no-reflow — Gothic bay layout",
  "Diplopia/#93012 room-label conflation — title-adjacent, not RC bridge",
  "Fulcrum/#92377 auto-title overwrites --name — title-adjacent, not RC bridge",
  "Mondegreen/#93193 worktree Bash false-block on substring git — different surface",
]);
export const EXPECTED = Object.freeze([
  "The Remote Control bridge reconnects after an auto-update restart",
  "If the bridge does not reconnect, the user is told and offered a reconnect path",
  "Already-running interactive sessions can be reattached — not only future sessions",
  "bridge-state.json must not freeze on a stale localSessionId that matches neither live session",
  "Unrelated projects must not lose remote links together from one machine-wide teardown with no horn",
]);

export const FIELD_MARKS = Object.freeze([
  {
    id: "auto-update-restart",
    label: "auto-update restart",
    count: "20:09:31",
    note: "All claude processes restarted ~20:09:31; two live processes on different versions; crash queue empty",
  },
  {
    id: "bridge-state-stale",
    label: "bridge-state stale",
    count: "stale localSessionId",
    note: "bridge-state.json last written at restart; localSessionId matches neither live session",
  },
  {
    id: "silent-drop",
    label: "silent drop",
    count: "no horn",
    note: "No notification; user discovered the cut only from the remote device",
  },
  {
    id: "future-sessions-only",
    label: "future sessions only",
    count: "checkbox",
    note: "Settings checkbox only admits future sessions; no reattach path for live interactive sessions",
  },
  {
    id: "multi-project-offline",
    label: "multi-project offline",
    count: "app-wide",
    note: "RC is machine-wide not per-session; unrelated projects lose remote links together",
  },
]);

export const BOOTH_STATIONS = Object.freeze([
  {
    id: "spanned-approach",
    survey:
      "drawbridge stays down; remote carts still reach the keep; live sessions stay linked; gatehouse ledger matches live ids",
    kind: "spanned",
    note: "idle: spanned — the hold/good path",
  },
  {
    id: "auto-update-restart",
    survey:
      "the keep auto-updates; the machine-wide span is hauled up with the restart",
    kind: "drawbridge",
    note: "seeded: auto-update-restart of the keep",
  },
  {
    id: "rc-bridge-update-drop",
    survey:
      "every remote approach across unrelated baileys goes offline at once; no horn; halls stay lit",
    kind: "drawbridge",
    note: "path: rc-bridge-update-drop names the raised span",
  },
  {
    id: "future-sessions-only",
    survey:
      "gatehouse ledger only admits future carts; already-running sessions cannot reattach",
    kind: "drawbridge",
    note: "seeded: future-sessions-only of the checkbox",
  },
  {
    id: "drawbridge",
    survey:
      "the booth is drawbridge — span raised, remote approach cut, halls still lit, ledger stale",
    kind: "drawbridge",
    note: "seeded: drawbridge — Score drawbridge or admit spanned.",
  },
]);

export const FINGERPRINT_LINES = Object.freeze([
  "rc-bridge-update-drop",
  "drawbridge",
  "auto-update-restart",
  "bridge-state-stale",
  "silent-drop",
  "future-sessions-only",
  "multi-project-offline",
  "transcript-survives",
]);

export const COUSINS = Object.freeze([
  {
    issue: 90387,
    title: "RC archived on teardown after auto-update",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — RC archived on teardown after auto-update. Adjacent restart path, not this silent machine-wide drop of live sessions. Do not rebuild.",
  },
  {
    issue: 84793,
    title: "remoteControlAtStartup not honored on resume after auto-update",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — remoteControlAtStartup not honored on resume after auto-update. Different startup flag, not the live-session reattach gap.",
  },
  {
    issue: 84805,
    title: "restored sessions never re-register RC",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — restored sessions never re-register RC. Registration cousin, not the silent all-session drop.",
  },
  {
    issue: 90172,
    title: "stealth relaunch destroys hosts",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — stealth relaunch destroys hosts. Adjacent relaunch, not the frozen bridge-state localSessionId.",
  },
  {
    issue: 85413,
    title: "auto-update kills live session hosts",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — auto-update kills live session hosts. Host-kill cousin, not the invisible RC cut while transcripts keep writing.",
  },
  {
    issue: 82462,
    title: "registration-lost cousin",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — registration-lost path cousin. Do not conflate with #94049.",
  },
  {
    issue: 80400,
    title: "registration-lost cousin",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — registration-lost path cousin. Do not conflate with #94049.",
  },
]);

export const BACKUPS = Object.freeze([
  { issue: 94052, title: "backup #94052 VS Code chip Hide→X no persist", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94041, title: "backup #94041 /goal Stop hook re-fire", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94040, title: "backup #94040 worktree Bash refuse non-git", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94032, title: "backup #94032 summarizedThinking forced", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94031, title: "backup #94031 VoiceOver typing echo lost after app switch", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94029, title: "backup #94029 claude attach ignores DISABLE_MOUSE", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93987, title: "backup #93987 /reload-skills no changes", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93924, title: "backup #93924 Remote Control slows local", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93770, title: "backup #93770 TUI copy padding", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93777, title: "backup #93777 Vercel MCP teamId", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
]);

export const NOT_PRODUCTS = Object.freeze([
  "chirograph",
  "titulus",
  "derelict",
  "vestry",
  "surfeit",
  "phosphene",
  "parablepsis",
  "demesne",
  "cartouche",
  "attaint",
  "oriel",
  "anarthria",
  "trismus",
  "gleaner",
  "foundling",
  "apograph",
  "mondegreen",
  "diplopia",
  "fulcrum",
  "crasis",
  "tessera",
  "mojibake",
  "scissel",
  "feoffee",
  "airlock",
  "scotoma",
  "afterimage",
  "thrash",
]);

export const SAMPLE_KIND_IDLE = "open-span";
export const SAMPLE_KIND_SEEDED = "rc-bridge-update-drop";
export const SAMPLE_HOLDING_IDLE = "linked";
export const SAMPLE_HOLDING_SEEDED = "raised";

export const SAMPLE_SPANNED_PROOF = Object.freeze({
  spanned: true,
  drawbridge: false,
  rcBridgeUpdateDrop: false,
  autoUpdateRestart: false,
  bridgeStateStale: false,
  silentDrop: false,
  futureSessionsOnly: false,
  multiProjectOffline: false,
  transcriptSurvives: false,
  kind: SAMPLE_KIND_IDLE,
});

export const SAMPLE_DRAWBRIDGE_PROOF = Object.freeze({
  spanned: false,
  drawbridge: true,
  rcBridgeUpdateDrop: true,
  autoUpdateRestart: true,
  bridgeStateStale: true,
  silentDrop: true,
  futureSessionsOnly: true,
  multiProjectOffline: true,
  transcriptSurvives: true,
  kind: SAMPLE_KIND_SEEDED,
});

export const SAMPLE_WALK_LOG = Object.freeze([
  { t: "idle", line: "booth holds spanned: drawbridge down; remote carts reach the keep; live sessions stay linked; gatehouse ledger matches live ids" },
  { t: "auto-update-restart", line: "the keep auto-updates; the machine-wide span is hauled up with the restart" },
  { t: "silent-drop", line: "no horn sounds; halls stay lit; remote peers across unrelated baileys go offline together" },
  { t: "path", line: "rc-bridge-update-drop — bridge-state freezes on a stale localSessionId; checkbox only admits future carts" },
  { t: "score", line: "when the span is raised the booth is drawbridge — Score drawbridge or admit spanned." },
]);

/**
 * Bailey map: spanned approach vs raised drawbridge.
 * Idle/spanned: remote carts still cross; ledger matches live ids.
 * Seeded/drawbridge: auto-update hauls the machine-wide span up.
 */
export function mapBailey(input = {}) {
  const drawbridge =
    input.drawbridge === true ||
    input.rcBridgeUpdateDrop === true ||
    input.autoUpdateRestart === true ||
    input.bridgeStateStale === true ||
    input.silentDrop === true ||
    input.futureSessionsOnly === true ||
    input.multiProjectOffline === true ||
    input.transcriptSurvives === true;
  const spanned = input.spanned === true && !drawbridge;
  return {
    stamp: drawbridge ? "rc-bridge-update-drop" : "spanned-approach",
    holdingLane: drawbridge ? "raised" : "linked",
    kindLane: drawbridge ? "rc-bridge-update-drop" : "open-span",
    bindLane: drawbridge ? "bridge-state-stale" : "joined",
    ribbon: drawbridge ? "drawbridge" : "spanned",
    spanned,
  };
}

export function inspectSpan(input = {}) {
  const raised =
    input.drawbridge === true ||
    input.rcBridgeUpdateDrop === true ||
    input.autoUpdateRestart === true;
  if (input.spanned === true && !raised) {
    return {
      stamp: "span-down",
      raised: false,
    };
  }
  return {
    stamp: raised ? "span-raised" : "span-idle",
    raised,
    note: raised
      ? "the machine-wide drawbridge is raised — remote approach is cut while halls stay lit"
      : "",
  };
}

export function inspectLedger(input = {}) {
  const stale =
    input.bridgeStateStale === true ||
    input.drawbridge === true;
  if (input.spanned === true && !stale) {
    return {
      stamp: "ledger-live",
      stale: false,
    };
  }
  return {
    stamp: stale ? "bridge-state-stale" : "ledger-idle",
    stale,
    note: stale
      ? "bridge-state.json last written at restart; stale localSessionId matches neither live session"
      : "",
  };
}

export function inspectUpdate(input = {}) {
  const restarted =
    input.autoUpdateRestart === true ||
    input.drawbridge === true;
  if (input.spanned === true && !restarted) {
    return {
      stamp: "update-none",
      restarted: false,
    };
  }
  return {
    stamp: restarted ? "auto-update-restart" : "update-idle",
    restarted,
    note: restarted
      ? "auto-update 2.1.266 → 2.1.270 restarted every claude process ~20:09:31; crash queue empty"
      : "",
  };
}

export function inspectHorn(input = {}) {
  const silent =
    input.silentDrop === true ||
    input.multiProjectOffline === true ||
    input.rcBridgeUpdateDrop === true ||
    input.drawbridge === true;
  if (input.spanned === true && !silent) {
    return {
      stamp: "horn-ready",
      silent: false,
    };
  }
  return {
    stamp: silent ? "silent-drop" : "horn-idle",
    silent,
    note: silent
      ? "no horn; every Remote Control session across unrelated projects went offline at once"
      : "",
  };
}

export function inspectReattach(input = {}) {
  const gated =
    input.futureSessionsOnly === true ||
    input.transcriptSurvives === true ||
    input.drawbridge === true;
  if (input.spanned === true && !gated) {
    return {
      stamp: "reattach-open",
      gated: false,
    };
  }
  return {
    stamp: gated ? "future-sessions-only" : "reattach-idle",
    gated,
    note: gated
      ? "checkbox only admits future sessions; live interactive sessions cannot reattach; transcripts keep writing locally"
      : "",
  };
}

export function readBooth(input = {}) {
  const drawbridge =
    input.drawbridge === true ||
    input.rcBridgeUpdateDrop === true ||
    input.autoUpdateRestart === true ||
    input.bridgeStateStale === true ||
    input.silentDrop === true ||
    input.futureSessionsOnly === true ||
    input.multiProjectOffline === true ||
    input.transcriptSurvives === true;
  const spanned = input.spanned === true && !drawbridge;
  return {
    mark: drawbridge ? "drawbridge" : spanned || !drawbridge ? "spanned" : "drawbridge",
    spanned,
    drawbridge,
    rcBridgeUpdateDrop: input.rcBridgeUpdateDrop === true || drawbridge,
    autoUpdateRestart: input.autoUpdateRestart === true,
    bridgeStateStale: input.bridgeStateStale === true,
    silentDrop: input.silentDrop === true,
    futureSessionsOnly: input.futureSessionsOnly === true,
    multiProjectOffline: input.multiProjectOffline === true,
    transcriptSurvives: input.transcriptSurvives === true,
    scope: mapBailey(input),
    span: inspectSpan(input),
    ledger: inspectLedger(input),
    update: inspectUpdate(input),
    horn: inspectHorn(input),
    reattach: inspectReattach(input),
    log: input.log || [],
  };
}

export const DRAWBRIDGE_WALK = Object.freeze([
  {
    t: "idle",
    event: "cue-spanned",
    spanned: true,
    drawbridge: false,
    cue: "spanned",
    note: "idle HOLD: drawbridge down; remote carts reach the keep; live sessions stay linked; gatehouse ledger matches live ids — the hold/good path",
  },
  {
    t: "auto-update-restart",
    event: "auto-update-restart",
    drawbridge: true,
    autoUpdateRestart: true,
    cue: "drawbridge",
    note: "the keep auto-updates; the machine-wide span is hauled up with the restart",
  },
  {
    t: "silent-drop",
    event: "silent-drop",
    drawbridge: true,
    bridgeStateStale: true,
    silentDrop: true,
    cue: "drawbridge",
    note: "no horn sounds; halls stay lit; remote peers across unrelated baileys go offline together",
  },
  {
    t: "path",
    event: "rc-bridge-update-drop",
    drawbridge: true,
    rcBridgeUpdateDrop: true,
    futureSessionsOnly: true,
    cue: "drawbridge",
    note: "rc-bridge-update-drop — bridge-state freezes on a stale localSessionId; checkbox only admits future carts",
  },
  {
    t: "score",
    event: "drawbridge",
    drawbridge: true,
    rcBridgeUpdateDrop: true,
    autoUpdateRestart: true,
    bridgeStateStale: true,
    silentDrop: true,
    futureSessionsOnly: true,
    multiProjectOffline: true,
    transcriptSurvives: true,
    cue: "drawbridge",
    note: "drawbridge — when the span is raised the booth is drawbridge",
  },
]);

export const POSITIVE_CONTROL_WALK = Object.freeze([
  {
    t: "hold",
    event: "cue-spanned",
    spanned: true,
    drawbridge: false,
    cue: "spanned",
    note: "positive control: remote carts still cross; ledger matches live ids",
  },
  {
    t: "announce",
    event: "cue-spanned",
    spanned: true,
    cue: "spanned",
    note: "positive control: the approach stays spanned",
  },
]);

function classifyFromSeed(seed) {
  if (seed && VERDICTS.includes(seed)) return seed;
  return null;
}

export function emptyTicket() {
  return {
    seed: IDLE_WORD,
    spanned: true,
    drawbridge: false,
    rcBridgeUpdateDrop: false,
    cue: "spanned",
  };
}

export function seedSpanned() {
  return { ...emptyTicket() };
}

export function seedDrawbridge() {
  return {
    seed: SEEDED_WORD,
    spanned: false,
    drawbridge: true,
    rcBridgeUpdateDrop: true,
    autoUpdateRestart: true,
    bridgeStateStale: true,
    silentDrop: true,
    futureSessionsOnly: true,
    multiProjectOffline: true,
    transcriptSurvives: true,
    cue: "drawbridge",
    issue: FEATURED_ISSUE,
    proof: SAMPLE_DRAWBRIDGE_PROOF,
  };
}

export function seedProduct() {
  return {
    seed: PRODUCT_WORD,
    preferSeed: true,
    drawbridge: true,
    rcBridgeUpdateDrop: true,
    autoUpdateRestart: true,
    cue: "drawbridge",
  };
}

export function seedRcBridgeUpdateDrop() {
  return {
    seed: PATH_WORD,
    preferSeed: true,
    drawbridge: true,
    rcBridgeUpdateDrop: true,
    silentDrop: true,
    event: "rc-bridge-update-drop",
    cue: "drawbridge",
  };
}

export function seedHold() {
  return {
    seed: "hold",
    preferSeed: true,
    spanned: true,
    cue: "spanned",
  };
}

export function seedOpenSpan() {
  return {
    seed: "open-span",
    preferSeed: true,
    spanned: true,
    cue: "spanned",
  };
}

export function seedLinked() {
  return {
    seed: "linked",
    preferSeed: true,
    spanned: true,
    cue: "spanned",
  };
}

export function seedMoored() {
  return {
    seed: "moored",
    preferSeed: true,
    spanned: true,
    cue: "spanned",
  };
}

export function seedJoined() {
  return {
    seed: "joined",
    preferSeed: true,
    spanned: true,
    cue: "spanned",
  };
}

export function seedAutoUpdateRestart() {
  return {
    seed: "auto-update-restart",
    preferSeed: true,
    autoUpdateRestart: true,
    cue: "drawbridge",
  };
}

export function seedBridgeStateStale() {
  return {
    seed: "bridge-state-stale",
    preferSeed: true,
    bridgeStateStale: true,
    cue: "drawbridge",
  };
}

export function seedSilentDrop() {
  return {
    seed: "silent-drop",
    preferSeed: true,
    silentDrop: true,
    cue: "drawbridge",
  };
}

export function seedFutureSessionsOnly() {
  return {
    seed: "future-sessions-only",
    preferSeed: true,
    futureSessionsOnly: true,
    cue: "drawbridge",
  };
}

export function seedMultiProjectOffline() {
  return {
    seed: "multi-project-offline",
    preferSeed: true,
    multiProjectOffline: true,
    cue: "drawbridge",
  };
}

export function seedTranscriptSurvives() {
  return {
    seed: "transcript-survives",
    preferSeed: true,
    transcriptSurvives: true,
    cue: "drawbridge",
  };
}

export function normalizeBooth(raw) {
  if (!raw || typeof raw !== "object") {
    return {
      spanned: false,
      drawbridge: false,
      rcBridgeUpdateDrop: false,
      autoUpdateRestart: false,
      bridgeStateStale: false,
      silentDrop: false,
      futureSessionsOnly: false,
      multiProjectOffline: false,
      transcriptSurvives: false,
      cue: null,
      event: null,
      t: null,
    };
  }
  return {
    spanned: raw.spanned === true,
    drawbridge: raw.drawbridge === true || raw.event === "drawbridge",
    rcBridgeUpdateDrop:
      raw.rcBridgeUpdateDrop === true || raw.event === "rc-bridge-update-drop",
    autoUpdateRestart:
      raw.autoUpdateRestart === true || raw.event === "auto-update-restart",
    bridgeStateStale:
      raw.bridgeStateStale === true || raw.event === "bridge-state-stale",
    silentDrop: raw.silentDrop === true || raw.event === "silent-drop",
    futureSessionsOnly:
      raw.futureSessionsOnly === true || raw.event === "future-sessions-only",
    multiProjectOffline:
      raw.multiProjectOffline === true || raw.event === "multi-project-offline",
    transcriptSurvives:
      raw.transcriptSurvives === true || raw.event === "transcript-survives",
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
      (ticket.spanned != null ||
        ticket.drawbridge != null ||
        ticket.rcBridgeUpdateDrop != null ||
        ticket.autoUpdateRestart != null ||
        ticket.bridgeStateStale != null ||
        ticket.silentDrop != null ||
        ticket.futureSessionsOnly != null ||
        ticket.multiProjectOffline != null ||
        ticket.transcriptSurvives != null ||
        ticket.cue != null ||
        ticket.event ||
        ticket.proof),
  );
}

function isSpanned(row) {
  if (row.drawbridge && row.cue !== "spanned") return false;
  if (row.cue === "drawbridge" || row.cue === "rc-bridge-update-drop") {
    return false;
  }
  if (
    row.rcBridgeUpdateDrop &&
    row.autoUpdateRestart &&
    row.cue !== "spanned" &&
    row.spanned !== true
  ) {
    return false;
  }
  if (row.spanned === true && row.drawbridge !== true && row.cue !== "drawbridge") {
    return true;
  }
  if (
    row.cue === "spanned" &&
    row.drawbridge !== true &&
    row.rcBridgeUpdateDrop !== true &&
    row.autoUpdateRestart !== true &&
    row.bridgeStateStale !== true &&
    row.silentDrop !== true &&
    row.futureSessionsOnly !== true &&
    row.multiProjectOffline !== true &&
    row.transcriptSurvives !== true
  ) {
    return true;
  }
  return false;
}

function isRcBridgeUpdateDrop(row) {
  return (
    row.event === "rc-bridge-update-drop" &&
    !isSpanned(row) &&
    (row.rcBridgeUpdateDrop === true ||
      row.silentDrop === true ||
      row.autoUpdateRestart === true)
  );
}

function isDrawbridgeRow(row) {
  if (isSpanned(row)) return false;
  if (isRcBridgeUpdateDrop(row) && row.cue !== "drawbridge") return false;
  if (row.cue === "drawbridge") return true;
  if (row.drawbridge === true) return true;
  if (row.rcBridgeUpdateDrop === true && row.autoUpdateRestart === true) {
    return true;
  }
  if (
    row.rcBridgeUpdateDrop === true ||
    row.autoUpdateRestart === true ||
    row.bridgeStateStale === true ||
    row.silentDrop === true ||
    row.futureSessionsOnly === true ||
    row.multiProjectOffline === true ||
    row.transcriptSurvives === true
  ) {
    return true;
  }
  return false;
}

/**
 * Score one drawbridge pass against the bailey approach.
 * spanned: remote carts still cross; ledger matches live ids.
 * drawbridge: auto-update hauls the machine-wide span up; no horn; halls stay lit.
 * rc-bridge-update-drop: names that path.
 */
export function scoreGate(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const row = normalizeBooth(ticket);
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);

  let verdict = IDLE_WORD;
  if (
    isRcBridgeUpdateDrop(row) ||
    (row.rcBridgeUpdateDrop && ticket.preferSeed && seeded === PATH_WORD)
  ) {
    verdict = "rc-bridge-update-drop";
  } else if (isDrawbridgeRow(row)) {
    verdict = "drawbridge";
  } else if (isSpanned(row)) {
    verdict = "spanned";
  } else if (
    row.rcBridgeUpdateDrop ||
    row.autoUpdateRestart ||
    row.bridgeStateStale ||
    row.silentDrop ||
    row.futureSessionsOnly ||
    row.multiProjectOffline ||
    row.transcriptSurvives
  ) {
    verdict = "drawbridge";
  }

  if (seeded && (!hasBoothFields(ticket) || ticket.preferSeed === true)) {
    verdict = seeded;
  }

  const hold = HOLD.includes(verdict);
  const span = inspectSpan(row);
  const ledger = inspectLedger(row);
  const update = inspectUpdate(row);
  const horn = inspectHorn(row);
  const reattach = inspectReattach(row);
  return {
    verdict,
    idleWord: IDLE_WORD,
    pathWord: PATH_WORD,
    seededWord: SEEDED_WORD,
    productWord: PRODUCT_WORD,
    hold,
    alarm: !hold,
    recover: RECOVER.includes(verdict),
    spanned: verdict === "spanned" || verdict === "hold",
    drawbridge: verdict === "drawbridge" || verdict === SEEDED_WORD,
    rcBridgeUpdateDrop:
      row.rcBridgeUpdateDrop === true ||
      verdict === "rc-bridge-update-drop" ||
      verdict === PATH_WORD,
    autoUpdateRestart: row.autoUpdateRestart,
    bridgeStateStale: row.bridgeStateStale,
    silentDrop: row.silentDrop,
    futureSessionsOnly: row.futureSessionsOnly,
    multiProjectOffline: row.multiProjectOffline,
    transcriptSurvives: row.transcriptSurvives,
    cue: hold
      ? "spanned"
      : row.rcBridgeUpdateDrop || verdict === "rc-bridge-update-drop"
        ? "rc-bridge-update-drop"
        : "drawbridge",
    event: row.event,
    t: row.t,
    phrase: hold ? "admit spanned" : "score drawbridge",
    spanInspect: span,
    ledgerInspect: ledger,
    updateInspect: update,
    hornInspect: horn,
    reattachInspect: reattach,
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
      : DRAWBRIDGE_WALK;
  const scored = rows.map((row) => ({
    ...normalizeBooth(row),
    ...scoreGate({ ...row, preferSeed: false }),
  }));
  const dead = scored.filter((row) => row.verdict === "drawbridge");
  const path = scored.filter((row) => row.verdict === "rc-bridge-update-drop");
  const spanned = scored.filter((row) => row.verdict === "spanned");
  const headline =
    scored.find((row) => row.event === "drawbridge") ||
    scored.find((row) => row.event === "rc-bridge-update-drop") ||
    scored.find((row) => row.event === "auto-update-restart") ||
    dead[dead.length - 1];
  let verdict = "spanned";
  if (dead.length) verdict = "drawbridge";
  else if (path.length && !spanned.length) verdict = "rc-bridge-update-drop";
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
    drawbridgeCount: dead.length,
    pathCount: path.length,
    spannedCount: spanned.length,
    headline,
    rows: scored,
    phrase: HOLD.includes(verdict) ? "admit spanned" : "score drawbridge",
    note: headline
      ? "Auto-update restart tears down the machine-wide Remote Control bridge and never rebinds live interactive sessions; checkbox gates future sessions only; bridge-state not reconciled to live session ids. Cousins cite-only: #90387 #84793 #84805 #90172 #85413 #82462 #80400."
      : "published drawbridge walk scored against spanned vs drawbridge",
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
    seeded !== "spanned" &&
    seeded !== "drawbridge" &&
    seeded !== "rc-bridge-update-drop" &&
    ticket.spanned == null &&
    ticket.drawbridge == null &&
    ticket.rcBridgeUpdateDrop == null &&
    ticket.autoUpdateRestart == null &&
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
    spanned: scored.spanned ?? false,
    drawbridge: scored.drawbridge ?? false,
    rcBridgeUpdateDrop: scored.rcBridgeUpdateDrop ?? false,
    autoUpdateRestart: scored.autoUpdateRestart ?? false,
    bridgeStateStale: scored.bridgeStateStale ?? false,
    silentDrop: scored.silentDrop ?? false,
    futureSessionsOnly: scored.futureSessionsOnly ?? false,
    multiProjectOffline: scored.multiProjectOffline ?? false,
    transcriptSurvives: scored.transcriptSurvives ?? false,
  };
}

export function score(input) {
  return analyze(input).verdict;
}

export function fingerprint(input) {
  const result = analyze(input);
  return [
    result.verdict,
    result.autoUpdateRestart || result.drawbridge
      ? "kind=rc-bridge-update-drop"
      : "kind=open-span",
    result.bridgeStateStale || result.drawbridge ? "span=raised" : "span=down",
    result.rcBridgeUpdateDrop || result.verdict === "rc-bridge-update-drop"
      ? "path=rc-bridge-update-drop"
      : "path=spanned",
    result.cue === "spanned"
      ? "cue=spanned"
      : result.cue === "rc-bridge-update-drop"
        ? "cue=rc-bridge-update-drop"
        : "cue=drawbridge",
  ].join("|");
}

export function handle(input) {
  const result = analyze(input);
  const booth = readBooth({
    spanned: result.spanned,
    drawbridge: result.drawbridge,
    rcBridgeUpdateDrop: result.rcBridgeUpdateDrop,
    autoUpdateRestart: result.autoUpdateRestart,
    bridgeStateStale: result.bridgeStateStale,
    silentDrop: result.silentDrop,
    futureSessionsOnly: result.futureSessionsOnly,
    multiProjectOffline: result.multiProjectOffline,
    transcriptSurvives: result.transcriptSurvives,
    proof: input && input.proof,
    log: input && input.log,
  });
  return {
    ...result,
    fingerprint: fingerprint(input),
    booth,
    span: inspectSpan({
      spanned: result.spanned,
      drawbridge: result.drawbridge,
      rcBridgeUpdateDrop: result.rcBridgeUpdateDrop,
      autoUpdateRestart: result.autoUpdateRestart,
    }),
    ledger: inspectLedger({
      spanned: result.spanned,
      drawbridge: result.drawbridge,
      bridgeStateStale: result.bridgeStateStale,
    }),
    update: inspectUpdate({
      spanned: result.spanned,
      drawbridge: result.drawbridge,
      autoUpdateRestart: result.autoUpdateRestart,
    }),
    horn: inspectHorn({
      spanned: result.spanned,
      drawbridge: result.drawbridge,
      rcBridgeUpdateDrop: result.rcBridgeUpdateDrop,
      silentDrop: result.silentDrop,
      multiProjectOffline: result.multiProjectOffline,
    }),
    reattach: inspectReattach({
      spanned: result.spanned,
      drawbridge: result.drawbridge,
      futureSessionsOnly: result.futureSessionsOnly,
      transcriptSurvives: result.transcriptSurvives,
    }),
    scope: mapBailey({
      spanned: result.spanned,
      drawbridge: result.drawbridge,
      rcBridgeUpdateDrop: result.rcBridgeUpdateDrop,
      autoUpdateRestart: result.autoUpdateRestart,
      bridgeStateStale: result.bridgeStateStale,
      silentDrop: result.silentDrop,
      futureSessionsOnly: result.futureSessionsOnly,
      multiProjectOffline: result.multiProjectOffline,
      transcriptSurvives: result.transcriptSurvives,
    }),
    stations: BOOTH_STATIONS.map((row) => ({
      ...row,
      drawbridge:
        result.drawbridge === true ||
        result.verdict === "drawbridge",
    })),
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
      ruledOut: [...RULED_OUT],
      expected: [...EXPECTED],
      distribution: DISTRIBUTION,
      stations: BOOTH_STATIONS,
      fingerprintLines: [...FINGERPRINT_LINES],
      cousins: COUSINS.map((row) => row.issue),
      backups: BACKUPS.map((row) => row.issue),
      phrase: PHRASE,
      hypothesis:
        "NON-BINDING: auto-update restart tears down the machine-wide bridge and never rebinds live interactive sessions; checkbox gates future sessions only; bridge-state is not reconciled to live session ids. Invite verify against #94049 text only. Do not claim a root cause in Claude Code source you have not seen.",
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
