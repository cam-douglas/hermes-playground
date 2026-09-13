#!/usr/bin/env node
/**
 * Titulus — Roman inscription / marble name-plaque / funerary-titulus booth.
 *
 * Educational diagnostic model for a published Claude Code defect:
 * an iOS rename writes custom-title into the Windows desktop Code-tab
 * transcript, but the desktop sidebar and get_session / list_sessions
 * (ccd_session_mgmt) keep the auto-generated title. On desktop resume
 * after quit/reopen, desktop appends a stale custom-title and clobbers
 * the phone name.
 *
 *   node titulus.mjs data/titulus.json
 *   echo '{"seed":"titulus"}' | node titulus.mjs
 *
 * Idle word is inscribed (HOLD: current / plaque / latest-wins / synced).
 * Seeded word is titulus (#94025 — the resume-stale-title path).
 * Path word is resume-stale-title.
 * Product score word is titulus (Score titulus or admit inscribed.).
 *
 * Encoded from anthropics/claude-code#94025 issue text only.
 * Hypothesis (NON-BINDING): desktop session-mgmt cache/sidebar title
 * is not invalidated by remote custom-title writes from iOS, and
 * resume prefers desktop-cached title when appending custom-title,
 * violating latest-rename-wins across surfaces.
 * Do NOT claim a root cause in Claude Code source you have not seen.
 * Do NOT implement a fix. No network. No exploits. No live Claude.
 * No secrets.
 *
 * NOT Vestry/#94008 (mount-refcount-race). NOT Surfeit/#94012
 * (quota-spawn-cascade). NOT Phosphene/#94003 (layer-tree-walk).
 * NOT Parablepsis (latin1-edit-wipe). NOT Demesne/#93989
 * (home-bind-overreach). NOT Cartouche / Attaint / Oriel /
 * Anarthria / Trismus. NOT Gleaner/#93794. NOT Foundling/#93889
 * (subagent-bash-outlive). NOT Apograph/#93859. NOT Derelict/#93996.
 * Cousins cite-only: diplopia (#93012 — room-label conflation),
 * fulcrum (#92377 — auto-title overwrites --name custom-title).
 * Title-adjacent only. Do not conflate. Titulus is specifically
 * latest-rename-wins failing across iOS / desktop sidebar /
 * ccd_session_mgmt / resume-append.
 */

/* Browser-safe: no top-level node: imports. CLI I/O is loaded only in main(). */

export const VERDICTS = Object.freeze([
  "inscribed",
  "titulus",
  "resume-stale-title",
  "hold",
  "current",
  "plaque",
  "latest-wins",
  "synced",
  "sidebar-stale",
  "custom-title-clobber",
  "ios-rename",
  "list-sessions-stale",
  "landing",
  "has-repro",
  "cousins",
  "backups",
  "fixtures",
  "walk",
]);

export const IDLE_WORD = "inscribed";
export const PATH_WORD = "resume-stale-title";
export const SEEDED_WORD = "titulus";
export const PRODUCT_WORD = "titulus";
export const HOLD = Object.freeze(["inscribed", "hold"]);
export const HOLD_ALIASES = Object.freeze([
  "inscribed",
  "current",
  "plaque",
  "latest-wins",
  "synced",
]);
export const RECOVER = Object.freeze(["inscribed", "hold"]);
export const ALARM = Object.freeze(
  VERDICTS.filter((name) => !HOLD.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FORBIDDEN_IDLE = Object.freeze([
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
  "berthed",
]);

export const FORBIDDEN_SEED = Object.freeze(
  FORBIDDEN_IDLE.filter((name) => name !== "titulus"),
);

export const FEATURED_ISSUE = 94025;
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/94025";
export const TITLE =
  "[BUG] Desktop (Windows): session renamed in the iOS app keeps its old title in the Code sidebar, and the stale title is written back on resume";
export const STATE = "OPEN";
export const LABELS = Object.freeze([
  "bug",
  "has-repro",
  "platform:windows",
  "area:desktop",
]);
export const PLATFORM = "windows";
export const SURFACE = "resume-stale-title";
export const HOST = "Claude for Windows Code tab + Claude iOS";
export const CHECKED_ON =
  "Claude for Windows 1.52386.3 (Microsoft Store), bundled Claude Code 2.1.266; Windows 10 Pro 22H2 (build 19045); Claude iOS same account";
export const BUILD = "2.1.266";
export const SELECTED_MODEL = "Opus";
export const OS = "windows 10 pro 22h2 build 19045";
export const PHRASE = "Score titulus or admit inscribed.";
export const DISTRIBUTION =
  "Windows desktop Code-tab session renamed from Claude iOS. Transcript (~/.claude/projects/<project>/<session>.jsonl) gets custom-title entries with the new name, re-appended after later turns. Desktop sidebar keeps the original auto-generated title; get_session / list_sessions (ccd_session_mgmt) return it too. After quit/reopen, desktop resume appends custom-title with the stale auto-generated title and the phone name is lost. Session A: 2026-09-08 16:00 auto title; 17:34 iOS name kept through 2026-09-11; 2026-09-13 17:15 resume entrypoint claude-desktop then stale custom-title. Session B: 2026-09-13 05:46 transcript has iOS name; ~17:30 list_sessions and sidebar still show auto title. Bundled 2.1.266 vs npm 2.1.270 at filing.";

export const RULED_OUT = Object.freeze([
  "Vestry/#94008 mount-refcount-race — Linux bwrap placeholder Set, not title cache",
  "Surfeit/#94012 quota-spawn-cascade — orchestrator spawn after session-limit, not rename",
  "Phosphene/#94003 layer-tree-walk — WindowServer CA thrash, not session title",
  "Parablepsis latin1-edit-wipe — collation wipe, not custom-title",
  "Demesne/#93989 home-bind-overreach — `--bind /home /home` vs `$HOME`",
  "Cartouche section-poster — wrong diagram type, not sidebar title",
  "Attaint session-attainder — cyber-safeguard stain, not rename",
  "Oriel/#93809 plan-no-reflow — Gothic bay layout, not Code-tab title",
  "Anarthria/#93782 dictation-paste-drop — mute larynx, not plaque",
  "Trismus/#93823 UNUserNotification XPC lockjaw — freeze, not title",
  "Gleaner/#93794 unreaped leftovers — harvest, not inscription",
  "Foundling/#93889 subagent-bash-outlive — child Bash outlives subagent",
  "Apograph/#93859 Desktop reopen-fork — different desktop reopen defect",
  "Derelict/#93996 orphaned Bash after session stop — not title cache",
  "Crasis/#93960 store-slug-collide — memory drawer, not custom-title",
  "Tessera/#93929 version-path-tcc — privacy-pane rows, not sidebar",
  "Mojibake/#93848 fffd-spall — encoding, not rename",
  "Scissel / Feoffee / Airlock — different catalog defects",
]);
export const EXPECTED = Object.freeze([
  "A rename made in the iOS app should update the desktop sidebar",
  "get_session / list_sessions (ccd_session_mgmt) must return the latest name",
  "Resuming a session on the desktop must not overwrite a newer title with the desktop's stored one",
  "The latest rename should win on every surface",
  "The session must be findable on the PC by the name set on the phone",
]);

export const FIELD_MARKS = Object.freeze([
  {
    id: "ios-rename",
    label: "ios rename",
    count: "Title B on phone",
    note: "iOS rename writes custom-title into the host transcript; name kept through later turns",
  },
  {
    id: "sidebar-stale",
    label: "sidebar stale",
    count: "Title A on desktop",
    note: "Windows Code sidebar keeps the original auto-generated title",
  },
  {
    id: "list-sessions-stale",
    label: "list sessions stale",
    count: "ccd_session_mgmt",
    note: "get_session / list_sessions return the auto-generated title, so the session cannot be found by the phone name",
  },
  {
    id: "custom-title-clobber",
    label: "custom-title clobber",
    count: "stale append",
    note: "desktop resume after quit/reopen appends custom-title with the stale auto-generated title",
  },
  {
    id: "resume-stale-title",
    label: "resume stale title",
    count: "entrypoint claude-desktop",
    note: "2026-09-13 17:15 resume immediately followed by custom-title = old auto-generated title",
  },
]);

export const BOOTH_STATIONS = Object.freeze([
  {
    id: "inscribed-plaque",
    survey:
      "marble plaque stays inscribed; latest rename wins; phone name and desktop cache stay synced",
    kind: "inscribed",
    note: "idle: inscribed — the hold/good path",
  },
  {
    id: "ios-rename",
    survey:
      "iOS app stamps Title B; transcript custom-title takes the new name and keeps it through later turns",
    kind: "titulus",
    note: "seeded: ios-rename of the phone plaque",
  },
  {
    id: "resume-stale-title",
    survey:
      "desktop quit/reopen resumes with entrypoint claude-desktop and appends stale Title A, clobbering the phone name",
    kind: "titulus",
    note: "path: resume-stale-title names the bronze letters being recut from cache",
  },
  {
    id: "sidebar-stale",
    survey:
      "Windows Code sidebar and ccd_session_mgmt still show the auto-generated title",
    kind: "titulus",
    note: "seeded: sidebar-stale of the desktop cache",
  },
  {
    id: "titulus",
    survey:
      "the booth is titulus — newest inscription lost; stale desktop letters overwrite the phone name",
    kind: "titulus",
    note: "seeded: titulus — Score titulus or admit inscribed.",
  },
]);

export const FINGERPRINT_LINES = Object.freeze([
  "resume-stale-title",
  "titulus",
  "sidebar-stale",
  "custom-title-clobber",
  "ios-rename",
  "list-sessions-stale",
]);

export const COUSINS = Object.freeze([
  {
    issue: 93012,
    slug: "diplopia",
    title:
      "Remote Control: web and mobile derive the environment label from different payload fields",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — title-adjacent room-label conflation. Distinct surfaces (web/mobile environment names), not iOS-rename vs desktop sidebar custom-title.",
  },
  {
    issue: 92377,
    slug: "fulcrum",
    title:
      "--name is not applied to the peer registry; auto-title overwrites the custom-title side of the lever",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — title-adjacent custom-title vs auto-title collision on --name / peer registry. Distinct from iOS rename reaching the transcript then being clobbered on desktop resume.",
  },
]);

export const BACKUPS = Object.freeze([
  { issue: 93987, title: "backup #93987 reload-skills no changes", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93924, title: "backup #93924 RC local slowdown", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94032, title: "backup #94032 summarizedThinking flag forces empty thinking", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94029, title: "backup #94029 claude attach ignores mouse opt-outs", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94031, title: "backup #94031 VoiceOver typing echo lost after app switch", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93770, title: "backup #93770 TUI copy padding", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93777, title: "backup #93777 Vercel MCP teamId not forwarded", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
]);

export const NOT_PRODUCTS = Object.freeze([
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
  "derelict",
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

export const SAMPLE_KIND_IDLE = "plaque";
export const SAMPLE_KIND_SEEDED = "resume-stale-title";
export const SAMPLE_HOLDING_IDLE = "current";
export const SAMPLE_HOLDING_SEEDED = "clobbered";

export const SAMPLE_INSCRIBED_PROOF = Object.freeze({
  inscribed: true,
  titulus: false,
  resumeStaleTitle: false,
  sidebarStale: false,
  customTitleClobber: false,
  iosRename: false,
  listSessionsStale: false,
  kind: SAMPLE_KIND_IDLE,
});

export const SAMPLE_TITULUS_PROOF = Object.freeze({
  inscribed: false,
  titulus: true,
  resumeStaleTitle: true,
  sidebarStale: true,
  customTitleClobber: true,
  iosRename: true,
  listSessionsStale: true,
  kind: SAMPLE_KIND_SEEDED,
});

export const SAMPLE_WALK_LOG = Object.freeze([
  { t: "idle", line: "booth holds inscribed: latest rename wins; phone name and desktop cache stay synced" },
  { t: "ios-rename", line: "iOS stamps Title B; transcript custom-title takes the phone name" },
  { t: "sidebar-stale", line: "Windows Code sidebar and list_sessions still show Title A" },
  { t: "path", line: "resume-stale-title — desktop quit/reopen appends stale custom-title and clobbers the phone name" },
  { t: "score", line: "when stale desktop letters overwrite the newer inscription the booth is titulus — Score titulus or admit inscribed." },
]);

/**
 * Plaque map: inscribed marble vs clobbered bronze letters.
 * Idle/inscribed: latest rename wins; surfaces stay synced.
 * Seeded/titulus: desktop cache recuts the plaque from a stale title.
 */
export function mapPlaque(input = {}) {
  const titulus =
    input.titulus === true ||
    input.resumeStaleTitle === true ||
    input.sidebarStale === true ||
    input.customTitleClobber === true ||
    input.iosRename === true ||
    input.listSessionsStale === true;
  const inscribed = input.inscribed === true && !titulus;
  return {
    stamp: titulus ? "resume-stale-title" : "inscribed-plaque",
    holdingLane: titulus ? "clobbered" : "current",
    kindLane: titulus ? "resume-stale-title" : "plaque",
    bindLane: titulus ? "sidebar-stale" : "latest-wins",
    ribbon: titulus ? "titulus" : "inscribed",
    inscribed,
  };
}

export function inspectPlaque(input = {}) {
  const clobbered =
    input.titulus === true ||
    input.resumeStaleTitle === true ||
    input.customTitleClobber === true;
  if (input.inscribed === true && !clobbered) {
    return {
      stamp: "plaque-inscribed",
      clobbered: false,
    };
  }
  return {
    stamp: clobbered ? "plaque-clobbered" : "plaque-idle",
    clobbered,
    note: clobbered
      ? "stale desktop letters recut the marble — phone name lost from the transcript"
      : "",
  };
}

export function inspectSidebar(input = {}) {
  const stale =
    input.sidebarStale === true ||
    input.titulus === true;
  if (input.inscribed === true && !stale) {
    return {
      stamp: "sidebar-current",
      stale: false,
    };
  }
  return {
    stamp: stale ? "sidebar-stale" : "sidebar-idle",
    stale,
    note: stale
      ? "Windows Code sidebar keeps the original auto-generated title after the iOS rename"
      : "",
  };
}

export function inspectResume(input = {}) {
  const stale =
    input.resumeStaleTitle === true ||
    input.customTitleClobber === true ||
    input.titulus === true;
  if (input.inscribed === true && !stale) {
    return {
      stamp: "resume-synced",
      stale: false,
    };
  }
  return {
    stamp: stale ? "resume-stale-title" : "resume-idle",
    stale,
    note: stale
      ? "quit/reopen resume with entrypoint claude-desktop appends custom-title = old auto-generated title"
      : "",
  };
}

export function inspectSessions(input = {}) {
  const stale =
    input.listSessionsStale === true ||
    input.titulus === true;
  if (input.inscribed === true && !stale) {
    return {
      stamp: "sessions-synced",
      stale: false,
    };
  }
  return {
    stamp: stale ? "list-sessions-stale" : "sessions-idle",
    stale,
    note: stale
      ? "get_session / list_sessions (ccd_session_mgmt) still return the auto-generated title"
      : "",
  };
}

export function inspectPhone(input = {}) {
  const renamed =
    input.iosRename === true ||
    input.titulus === true;
  if (input.inscribed === true && !renamed) {
    return {
      stamp: "phone-synced",
      renamed: false,
    };
  }
  return {
    stamp: renamed ? "ios-rename" : "phone-idle",
    renamed,
    note: renamed
      ? "iOS rename wrote custom-title Title B into the host transcript; desktop never adopted it"
      : "",
  };
}

export function readBooth(input = {}) {
  const titulus =
    input.titulus === true ||
    input.resumeStaleTitle === true ||
    input.sidebarStale === true ||
    input.customTitleClobber === true ||
    input.iosRename === true ||
    input.listSessionsStale === true;
  const inscribed = input.inscribed === true && !titulus;
  return {
    mark: titulus ? "titulus" : inscribed || !titulus ? "inscribed" : "titulus",
    inscribed,
    titulus,
    resumeStaleTitle: input.resumeStaleTitle === true || titulus,
    sidebarStale: input.sidebarStale === true,
    customTitleClobber: input.customTitleClobber === true,
    iosRename: input.iosRename === true,
    listSessionsStale: input.listSessionsStale === true,
    scope: mapPlaque(input),
    plaque: inspectPlaque(input),
    sidebar: inspectSidebar(input),
    resume: inspectResume(input),
    sessions: inspectSessions(input),
    phone: inspectPhone(input),
    log: input.log || [],
  };
}

export const TITULUS_WALK = Object.freeze([
  {
    t: "idle",
    event: "cue-inscribed",
    inscribed: true,
    titulus: false,
    cue: "inscribed",
    note: "idle HOLD: latest rename wins; phone name and desktop cache stay synced — the hold/good path",
  },
  {
    t: "ios-rename",
    event: "ios-rename",
    titulus: true,
    iosRename: true,
    cue: "titulus",
    note: "iOS stamps Title B; transcript custom-title takes the phone name",
  },
  {
    t: "sidebar-stale",
    event: "sidebar-stale",
    titulus: true,
    sidebarStale: true,
    listSessionsStale: true,
    cue: "titulus",
    note: "Windows Code sidebar and list_sessions still show Title A",
  },
  {
    t: "path",
    event: "resume-stale-title",
    titulus: true,
    resumeStaleTitle: true,
    customTitleClobber: true,
    cue: "titulus",
    note: "resume-stale-title — desktop quit/reopen appends stale custom-title and clobbers the phone name",
  },
  {
    t: "score",
    event: "titulus",
    titulus: true,
    resumeStaleTitle: true,
    sidebarStale: true,
    customTitleClobber: true,
    iosRename: true,
    listSessionsStale: true,
    cue: "titulus",
    note: "titulus — when stale desktop letters overwrite the newer inscription the booth is titulus",
  },
]);

export const POSITIVE_CONTROL_WALK = Object.freeze([
  {
    t: "hold",
    event: "cue-inscribed",
    inscribed: true,
    titulus: false,
    cue: "inscribed",
    note: "positive control: latest rename wins; surfaces stay synced",
  },
  {
    t: "announce",
    event: "cue-inscribed",
    inscribed: true,
    cue: "inscribed",
    note: "positive control: the plaque stays inscribed",
  },
]);

function classifyFromSeed(seed) {
  if (seed && VERDICTS.includes(seed)) return seed;
  return null;
}

export function emptyTicket() {
  return {
    seed: IDLE_WORD,
    inscribed: true,
    titulus: false,
    resumeStaleTitle: false,
    cue: "inscribed",
  };
}

export function seedInscribed() {
  return { ...emptyTicket() };
}

export function seedTitulus() {
  return {
    seed: SEEDED_WORD,
    inscribed: false,
    titulus: true,
    resumeStaleTitle: true,
    sidebarStale: true,
    customTitleClobber: true,
    iosRename: true,
    listSessionsStale: true,
    cue: "titulus",
    issue: FEATURED_ISSUE,
    proof: SAMPLE_TITULUS_PROOF,
  };
}

export function seedProduct() {
  return {
    seed: PRODUCT_WORD,
    preferSeed: true,
    titulus: true,
    resumeStaleTitle: true,
    sidebarStale: true,
    cue: "titulus",
  };
}

export function seedResumeStaleTitle() {
  return {
    seed: PATH_WORD,
    preferSeed: true,
    titulus: true,
    resumeStaleTitle: true,
    customTitleClobber: true,
    event: "resume-stale-title",
    cue: "titulus",
  };
}

export function seedHold() {
  return {
    seed: "hold",
    preferSeed: true,
    inscribed: true,
    cue: "inscribed",
  };
}

export function seedCurrent() {
  return {
    seed: "current",
    preferSeed: true,
    inscribed: true,
    cue: "inscribed",
  };
}

export function seedPlaque() {
  return {
    seed: "plaque",
    preferSeed: true,
    inscribed: true,
    cue: "inscribed",
  };
}

export function seedLatestWins() {
  return {
    seed: "latest-wins",
    preferSeed: true,
    inscribed: true,
    cue: "inscribed",
  };
}

export function seedSynced() {
  return {
    seed: "synced",
    preferSeed: true,
    inscribed: true,
    cue: "inscribed",
  };
}

export function seedSidebarStale() {
  return {
    seed: "sidebar-stale",
    preferSeed: true,
    sidebarStale: true,
    cue: "titulus",
  };
}

export function seedCustomTitleClobber() {
  return {
    seed: "custom-title-clobber",
    preferSeed: true,
    customTitleClobber: true,
    cue: "titulus",
  };
}

export function seedIosRename() {
  return {
    seed: "ios-rename",
    preferSeed: true,
    iosRename: true,
    cue: "titulus",
  };
}

export function seedListSessionsStale() {
  return {
    seed: "list-sessions-stale",
    preferSeed: true,
    listSessionsStale: true,
    cue: "titulus",
  };
}

export function normalizeBooth(raw) {
  if (!raw || typeof raw !== "object") {
    return {
      inscribed: false,
      titulus: false,
      resumeStaleTitle: false,
      sidebarStale: false,
      customTitleClobber: false,
      iosRename: false,
      listSessionsStale: false,
      cue: null,
      event: null,
      t: null,
    };
  }
  return {
    inscribed: raw.inscribed === true,
    titulus: raw.titulus === true || raw.event === "titulus",
    resumeStaleTitle:
      raw.resumeStaleTitle === true || raw.event === "resume-stale-title",
    sidebarStale: raw.sidebarStale === true || raw.event === "sidebar-stale",
    customTitleClobber:
      raw.customTitleClobber === true || raw.event === "custom-title-clobber",
    iosRename: raw.iosRename === true || raw.event === "ios-rename",
    listSessionsStale:
      raw.listSessionsStale === true || raw.event === "list-sessions-stale",
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
      (ticket.inscribed != null ||
        ticket.titulus != null ||
        ticket.resumeStaleTitle != null ||
        ticket.sidebarStale != null ||
        ticket.customTitleClobber != null ||
        ticket.iosRename != null ||
        ticket.listSessionsStale != null ||
        ticket.cue != null ||
        ticket.event ||
        ticket.proof),
  );
}

function isInscribed(row) {
  if (row.titulus && row.cue !== "inscribed") return false;
  if (row.cue === "titulus" || row.cue === "resume-stale-title") {
    return false;
  }
  if (
    row.resumeStaleTitle &&
    row.sidebarStale &&
    row.cue !== "inscribed" &&
    row.inscribed !== true
  ) {
    return false;
  }
  if (row.inscribed === true && row.titulus !== true && row.cue !== "titulus") {
    return true;
  }
  if (
    row.cue === "inscribed" &&
    row.titulus !== true &&
    row.resumeStaleTitle !== true &&
    row.sidebarStale !== true &&
    row.customTitleClobber !== true &&
    row.iosRename !== true &&
    row.listSessionsStale !== true
  ) {
    return true;
  }
  return false;
}

function isResumeStaleTitle(row) {
  return (
    row.event === "resume-stale-title" &&
    !isInscribed(row) &&
    (row.resumeStaleTitle === true ||
      row.customTitleClobber === true ||
      row.sidebarStale === true)
  );
}

function isTitulusRow(row) {
  if (isInscribed(row)) return false;
  if (isResumeStaleTitle(row) && row.cue !== "titulus") return false;
  if (row.cue === "titulus") return true;
  if (row.titulus === true) return true;
  if (row.resumeStaleTitle === true && row.sidebarStale === true) {
    return true;
  }
  if (
    row.resumeStaleTitle === true ||
    row.sidebarStale === true ||
    row.customTitleClobber === true ||
    row.iosRename === true ||
    row.listSessionsStale === true
  ) {
    return true;
  }
  return false;
}

/**
 * Score one titulus pass against the marble name-plaque.
 * inscribed: latest rename wins; phone name and desktop cache stay synced.
 * titulus: stale desktop cache recuts the plaque and clobbers the phone name.
 * resume-stale-title: names that path.
 */
export function scoreGate(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const row = normalizeBooth(ticket);
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);

  let verdict = IDLE_WORD;
  if (
    isResumeStaleTitle(row) ||
    (row.resumeStaleTitle && ticket.preferSeed && seeded === PATH_WORD)
  ) {
    verdict = "resume-stale-title";
  } else if (isTitulusRow(row)) {
    verdict = "titulus";
  } else if (isInscribed(row)) {
    verdict = "inscribed";
  } else if (
    row.resumeStaleTitle ||
    row.sidebarStale ||
    row.customTitleClobber ||
    row.iosRename ||
    row.listSessionsStale
  ) {
    verdict = "titulus";
  }

  if (seeded && (!hasBoothFields(ticket) || ticket.preferSeed === true)) {
    verdict = seeded;
  }

  const hold = HOLD.includes(verdict);
  const plaque = inspectPlaque(row);
  const sidebar = inspectSidebar(row);
  const resume = inspectResume(row);
  const sessions = inspectSessions(row);
  const phone = inspectPhone(row);
  return {
    verdict,
    idleWord: IDLE_WORD,
    pathWord: PATH_WORD,
    seededWord: SEEDED_WORD,
    productWord: PRODUCT_WORD,
    hold,
    alarm: !hold,
    recover: RECOVER.includes(verdict),
    inscribed: verdict === "inscribed" || verdict === "hold",
    titulus: verdict === "titulus" || verdict === SEEDED_WORD,
    resumeStaleTitle:
      row.resumeStaleTitle === true ||
      verdict === "resume-stale-title" ||
      verdict === PATH_WORD,
    sidebarStale: row.sidebarStale,
    customTitleClobber: row.customTitleClobber,
    iosRename: row.iosRename,
    listSessionsStale: row.listSessionsStale,
    cue: hold
      ? "inscribed"
      : row.resumeStaleTitle || verdict === "resume-stale-title"
        ? "resume-stale-title"
        : "titulus",
    event: row.event,
    t: row.t,
    phrase: hold ? "admit inscribed" : "score titulus",
    plaqueInspect: plaque,
    sidebarInspect: sidebar,
    resumeInspect: resume,
    sessionsInspect: sessions,
    phoneInspect: phone,
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
      : TITULUS_WALK;
  const scored = rows.map((row) => ({
    ...normalizeBooth(row),
    ...scoreGate({ ...row, preferSeed: false }),
  }));
  const dead = scored.filter((row) => row.verdict === "titulus");
  const path = scored.filter((row) => row.verdict === "resume-stale-title");
  const inscribed = scored.filter((row) => row.verdict === "inscribed");
  const headline =
    scored.find((row) => row.event === "titulus") ||
    scored.find((row) => row.event === "resume-stale-title") ||
    scored.find((row) => row.event === "ios-rename") ||
    dead[dead.length - 1];
  let verdict = "inscribed";
  if (dead.length) verdict = "titulus";
  else if (path.length && !inscribed.length) verdict = "resume-stale-title";
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
    titulusCount: dead.length,
    pathCount: path.length,
    inscribedCount: inscribed.length,
    headline,
    rows: scored,
    phrase: HOLD.includes(verdict) ? "admit inscribed" : "score titulus",
    note: headline
      ? "Desktop Windows Code sidebar keeps the auto-generated title after an iOS rename; resume appends a stale custom-title and clobbers the phone name. Cousins cite-only: diplopia #93012, fulcrum #92377."
      : "published titulus walk scored against inscribed vs titulus",
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
    seeded !== "inscribed" &&
    seeded !== "titulus" &&
    seeded !== "resume-stale-title" &&
    ticket.inscribed == null &&
    ticket.titulus == null &&
    ticket.resumeStaleTitle == null &&
    ticket.sidebarStale == null &&
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
    inscribed: scored.inscribed ?? false,
    titulus: scored.titulus ?? false,
    resumeStaleTitle: scored.resumeStaleTitle ?? false,
    sidebarStale: scored.sidebarStale ?? false,
    customTitleClobber: scored.customTitleClobber ?? false,
    iosRename: scored.iosRename ?? false,
    listSessionsStale: scored.listSessionsStale ?? false,
  };
}

export function score(input) {
  return analyze(input).verdict;
}

export function fingerprint(input) {
  const result = analyze(input);
  return [
    result.verdict,
    result.sidebarStale || result.titulus ? "kind=resume-stale-title" : "kind=plaque",
    result.listSessionsStale || result.titulus ? "sessions=stale" : "sessions=synced",
    result.resumeStaleTitle || result.verdict === "resume-stale-title"
      ? "path=resume-stale-title"
      : "path=inscribed",
    result.cue === "inscribed"
      ? "cue=inscribed"
      : result.cue === "resume-stale-title"
        ? "cue=resume-stale-title"
        : "cue=titulus",
  ].join("|");
}

export function handle(input) {
  const result = analyze(input);
  const booth = readBooth({
    inscribed: result.inscribed,
    titulus: result.titulus,
    resumeStaleTitle: result.resumeStaleTitle,
    sidebarStale: result.sidebarStale,
    customTitleClobber: result.customTitleClobber,
    iosRename: result.iosRename,
    listSessionsStale: result.listSessionsStale,
    proof: input && input.proof,
    log: input && input.log,
  });
  return {
    ...result,
    fingerprint: fingerprint(input),
    booth,
    plaque: inspectPlaque({
      inscribed: result.inscribed,
      titulus: result.titulus,
      resumeStaleTitle: result.resumeStaleTitle,
      customTitleClobber: result.customTitleClobber,
    }),
    sidebar: inspectSidebar({
      inscribed: result.inscribed,
      titulus: result.titulus,
      sidebarStale: result.sidebarStale,
    }),
    resume: inspectResume({
      inscribed: result.inscribed,
      titulus: result.titulus,
      resumeStaleTitle: result.resumeStaleTitle,
      customTitleClobber: result.customTitleClobber,
    }),
    sessions: inspectSessions({
      inscribed: result.inscribed,
      titulus: result.titulus,
      listSessionsStale: result.listSessionsStale,
    }),
    phone: inspectPhone({
      inscribed: result.inscribed,
      titulus: result.titulus,
      iosRename: result.iosRename,
    }),
    scope: mapPlaque({
      inscribed: result.inscribed,
      titulus: result.titulus,
      resumeStaleTitle: result.resumeStaleTitle,
      sidebarStale: result.sidebarStale,
      customTitleClobber: result.customTitleClobber,
      iosRename: result.iosRename,
      listSessionsStale: result.listSessionsStale,
    }),
    stations: BOOTH_STATIONS.map((row) => ({
      ...row,
      titulus:
        result.titulus === true ||
        result.verdict === "titulus",
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
        "NON-BINDING: desktop session-mgmt cache/sidebar title is not invalidated by remote custom-title writes from iOS, and resume prefers desktop-cached title when appending custom-title, violating latest-rename-wins across surfaces. Invite verify against #94025 text only. Do not claim a root cause in Claude Code source you have not seen.",
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
