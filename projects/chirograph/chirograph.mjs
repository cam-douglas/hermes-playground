#!/usr/bin/env node
/**
 * Chirograph — medieval chirograph / bipartite indenture / wavy-cut
 * charter-desk / scriptorium lectern booth.
 *
 * Educational diagnostic model for a published Claude Code defect:
 * Desktop Claude Code creates a per-session git worktree and records
 * the branch name it created on. If that branch is renamed inside the
 * worktree with `git branch -m`, the recorded name is never updated.
 * When the worktree is later recycled/removed, recovery runs
 * `git worktree add <path> <recorded branch>`, which fails
 * (`fatal: invalid reference`). The session falls back to the shared
 * main repository. The notice claims commits on `claude/<slug>` are
 * safe, but that branch no longer exists, and uncommitted files were
 * not carried over (data-loss).
 *
 *   node chirograph.mjs data/chirograph.json
 *   echo '{"seed":"chirograph"}' | node chirograph.mjs
 *
 * Idle word is matched (HOLD: bipartite / moiety / indenture / current).
 * Seeded word is chirograph (#94045 — the worktree-rename-stale path).
 * Path word is worktree-rename-stale.
 * Product score word is chirograph (Score chirograph or admit matched.).
 *
 * Encoded from anthropics/claude-code#94045 issue text only.
 * Hypothesis (NON-BINDING): session/harness caches the branch name at
 * worktree create and never observes `git branch -m` / never refreshes
 * the recorded name before `git worktree add`.
 * Do NOT claim a root cause in Claude Code source you have not seen.
 * Do NOT implement a fix. No network. No exploits. No live Claude.
 * No secrets.
 *
 * NOT Mondegreen/#93193 (worktree Bash false-block on substring git).
 * NOT Monadnock (submodule worktree branches from stale local main).
 * NOT Escheat (worktree lock not released on session end).
 * NOT Midden (partial-remove worktree remounded).
 * NOT Entresol / Deadletter / Gland / Titulus/#94025 (resume-stale-title
 * across iOS/desktop). NOT Derelict/#93996, Vestry/#94008,
 * Surfeit/#94012, Phosphene/#94003, Parablepsis, Demesne, Cartouche,
 * Attaint, Oriel, Diplopia, Fulcrum.
 * Cousins cite-only: #54653 (closed feature rename), #53061 (UI View PR
 * sticks to original branch), #85114 (worktree dir/branch diverge),
 * #85195 (status bar disappears after branch rename).
 * Chirograph is specifically: recorded branch never refreshed after
 * `git branch -m` → recycle recovery invalid-ref → fallback to main
 * repo → uncommitted loss + false reassurance branch.
 */

/* Browser-safe: no top-level node: imports. CLI I/O is loaded only in main(). */

export const VERDICTS = Object.freeze([
  "matched",
  "chirograph",
  "worktree-rename-stale",
  "hold",
  "bipartite",
  "moiety",
  "indenture",
  "current",
  "recorded-branch",
  "branch-m",
  "invalid-reference",
  "pool-re-lease-failed",
  "fallback-main-repo",
  "uncommitted-lost",
  "false-reassurance",
  "landing",
  "has-repro",
  "cousins",
  "backups",
  "fixtures",
  "walk",
]);

export const IDLE_WORD = "matched";
export const PATH_WORD = "worktree-rename-stale";
export const SEEDED_WORD = "chirograph";
export const PRODUCT_WORD = "chirograph";
export const HOLD = Object.freeze(["matched", "hold"]);
export const HOLD_ALIASES = Object.freeze([
  "matched",
  "bipartite",
  "moiety",
  "indenture",
  "current",
]);
export const RECOVER = Object.freeze(["matched", "hold"]);
export const ALARM = Object.freeze(
  VERDICTS.filter((name) => !HOLD.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FORBIDDEN_IDLE = Object.freeze([
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
  FORBIDDEN_IDLE.filter((name) => name !== "chirograph"),
);

export const FEATURED_ISSUE = 94045;
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/94045";
export const TITLE =
  "Worktree branch rename is never seen by the harness, and recovery then drops the session into the main repo";
export const STATE = "OPEN";
export const LABELS = Object.freeze([
  "bug",
  "has-repro",
  "platform:macos",
  "data-loss",
]);
export const PLATFORM = "macos";
export const SURFACE = "worktree-rename-stale";
export const HOST = "Claude Code desktop worktree pool";
export const CHECKED_ON =
  "Claude Code desktop 2.1.269, macOS 15 (Darwin 24.5.0); 45 fallbacks across retained logs, four on the day of filing";
export const BUILD = "2.1.269";
export const SELECTED_MODEL = "unspecified";
export const OS = "macos 15 darwin 24.5.0";
export const PHRASE = "Score chirograph or admit matched.";
export const DISTRIBUTION =
  "Desktop Claude Code creates a per-session git worktree and records the branch it created it on. If that branch is renamed inside the worktree with git branch -m, the recorded name is never updated. When the worktree is later recycled or removed, recovery runs git worktree add <path> <recorded branch>, which fails: fatal: invalid reference. Session falls back to the main repository. Notice claims commits on claude/<slug> are safe, but that branch no longer exists, and uncommitted files weren't carried over. Log: git worktree add --no-checkout .../sweet-herschel-c84baa claude/dev-28493-25a631; fatal: invalid reference: claude/dev-28493-25a631; [CCD] Pool re-lease and fresh-create both failed for session local_b9c668a3… on branch claude/dev-28493-25a631; [CCD] Worktree at .../dev-28493-25a631 was deleted; falling back to origin repo. Reflog: Branch: renamed refs/heads/claude/dev-28493-25a631 to refs/heads/dev-28493-fold-messenger-uis-version-file-into-the-vite-build-and. 45 fallbacks on one machine. Claude Code desktop 2.1.269, macOS 15.";

export const RULED_OUT = Object.freeze([
  "Mondegreen/#93193 worktree Bash false-block on substring git — different worktree defect",
  "Monadnock submodule worktree branches from stale local main — different stale-ref family",
  "Escheat worktree lock not released on session end — lock lifecycle, not recorded branch",
  "Midden WorktreePool partial-remove remound — GC remound, not rename-stale reclaim",
  "Entresol / Deadletter / Gland / Titulus/#94025 resume-stale-title across iOS/desktop — title cache, not worktree branch",
  "Derelict/#93996 orphaned Bash after session stop — process teardown, not worktree reclaim",
  "Vestry/#94008 mount-refcount-race — Linux bwrap placeholder Set, not recorded branch",
  "Surfeit/#94012 quota-spawn-cascade — orchestrator spawn after session-limit",
  "Phosphene/#94003 layer-tree-walk — WindowServer CA thrash",
  "Parablepsis latin1-edit-wipe — collation wipe, not worktree rename",
  "Demesne/#93989 home-bind-overreach — `--bind /home /home` vs `$HOME`",
  "Cartouche section-poster — wrong diagram type",
  "Attaint session-attainder — cyber-safeguard stain",
  "Oriel/#93809 plan-no-reflow — Gothic bay layout",
  "Diplopia/#93012 room-label conflation — title-adjacent, not worktree branch",
  "Fulcrum/#92377 auto-title overwrites --name — title-adjacent, not recorded branch",
]);
export const EXPECTED = Object.freeze([
  "A rename made with git branch -m inside the worktree should update the recorded branch the harness later uses",
  "Recovery must not run git worktree add against a stale recorded name",
  "fatal: invalid reference must not drop the session into the shared main repository",
  "Uncommitted files in the recycled worktree must be carried over or the session must stop and let the user decide",
  "The fallback notice must not name a branch that no longer exists (false reassurance on claude/<slug>)",
]);

export const FIELD_MARKS = Object.freeze([
  {
    id: "branch-m",
    label: "branch -m",
    count: "git branch -m my-feature",
    note: "Inside the worktree the live branch is renamed; the harness never observes it",
  },
  {
    id: "recorded-branch",
    label: "recorded branch",
    count: "claude/dev-28493-25a631",
    note: "Recorded name stays at worktree-create; never refreshed after the rename",
  },
  {
    id: "invalid-reference",
    label: "invalid reference",
    count: "fatal: invalid reference",
    note: "git worktree add <path> <recorded branch> fails because the ref no longer exists",
  },
  {
    id: "pool-re-lease-failed",
    label: "pool re-lease failed",
    count: "Pool re-lease and fresh-create both failed",
    note: "[CCD] Pool re-lease and fresh-create both failed for session local_b9c668a3…",
  },
  {
    id: "fallback-main-repo",
    label: "fallback main repo",
    count: "falling back to origin repo",
    note: "Session now runs in the shared main checkout; uncommitted files weren't carried over",
  },
]);

export const BOOTH_STATIONS = Object.freeze([
  {
    id: "matched-indenture",
    survey:
      "chirograph moieties still correspond; recorded branch == live branch; reclaim succeeds; uncommitted work preserved",
    kind: "matched",
    note: "idle: matched — the hold/good path",
  },
  {
    id: "branch-m",
    survey:
      "inside the worktree, git branch -m cuts a new live name; the recorded moiety is not recut",
    kind: "chirograph",
    note: "seeded: branch-m of the live parchment",
  },
  {
    id: "worktree-rename-stale",
    survey:
      "recycle/remove recovery runs git worktree add against the stale recorded name and dies on invalid reference",
    kind: "chirograph",
    note: "path: worktree-rename-stale names the split indenture",
  },
  {
    id: "fallback-main-repo",
    survey:
      "pool re-lease and fresh-create both fail; session falls back to the shared main repository",
    kind: "chirograph",
    note: "seeded: fallback-main-repo of the false-reassurance notice",
  },
  {
    id: "chirograph",
    survey:
      "the booth is chirograph — moieties no longer correspond; uncommitted work is gone; the named branch does not exist",
    kind: "chirograph",
    note: "seeded: chirograph — Score chirograph or admit matched.",
  },
]);

export const FINGERPRINT_LINES = Object.freeze([
  "worktree-rename-stale",
  "chirograph",
  "recorded-branch",
  "branch-m",
  "invalid-reference",
  "pool-re-lease-failed",
  "fallback-main-repo",
  "uncommitted-lost",
  "false-reassurance",
]);

export const COUSINS = Object.freeze([
  {
    issue: 54653,
    title:
      "[FEATURE] Allow worktree branch renaming mid-session for meaningful git history",
    state: "CLOSED",
    citeOnly: true,
    why: "Cite only — closed feature request for mid-session worktree branch rename. Adjacent ask, not this data-loss recovery path. Do not rebuild.",
  },
  {
    issue: 53061,
    title:
      "Worktree/branch rename not reflected in session UI; 'View PR' link sticks to original branch",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — same gap, different symptom (UI View PR sticks to original branch). Not the recycle invalid-ref fallback.",
  },
  {
    issue: 85114,
    title: "worktree directory and branch names diverge",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — worktree dir/branch diverge. Distinct from recorded-name never refreshed after git branch -m.",
  },
  {
    issue: 85195,
    title: "status bar disappears after branch rename",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — status bar disappears after branch rename. UI symptom, not pool re-lease fallback to main repo.",
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
  { issue: 94040, title: "backup #94040 worktree Bash refuse non-git", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
]);

export const NOT_PRODUCTS = Object.freeze([
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
  "monadnock",
  "escheat",
  "midden",
  "entresol",
  "deadletter",
  "gland",
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

export const SAMPLE_KIND_IDLE = "indenture";
export const SAMPLE_KIND_SEEDED = "worktree-rename-stale";
export const SAMPLE_HOLDING_IDLE = "moiety";
export const SAMPLE_HOLDING_SEEDED = "split";

export const SAMPLE_MATCHED_PROOF = Object.freeze({
  matched: true,
  chirograph: false,
  worktreeRenameStale: false,
  recordedBranch: false,
  branchM: false,
  invalidReference: false,
  poolReLeaseFailed: false,
  fallbackMainRepo: false,
  uncommittedLost: false,
  falseReassurance: false,
  kind: SAMPLE_KIND_IDLE,
});

export const SAMPLE_CHIROGRAPH_PROOF = Object.freeze({
  matched: false,
  chirograph: true,
  worktreeRenameStale: true,
  recordedBranch: true,
  branchM: true,
  invalidReference: true,
  poolReLeaseFailed: true,
  fallbackMainRepo: true,
  uncommittedLost: true,
  falseReassurance: true,
  kind: SAMPLE_KIND_SEEDED,
});

export const SAMPLE_WALK_LOG = Object.freeze([
  { t: "idle", line: "booth holds matched: chirograph moieties still correspond; recorded branch == live branch; reclaim succeeds; uncommitted work preserved" },
  { t: "branch-m", line: "inside the worktree, git branch -m cuts a new live name; the recorded moiety is not recut" },
  { t: "invalid-reference", line: "recycle recovery runs git worktree add against the stale recorded name — fatal: invalid reference" },
  { t: "path", line: "worktree-rename-stale — pool re-lease and fresh-create both fail; session falls back to the shared main repository" },
  { t: "score", line: "when the moieties no longer correspond the booth is chirograph — Score chirograph or admit matched." },
]);

/**
 * Charter map: matched indenture vs split chirograph.
 * Idle/matched: recorded branch == live branch; reclaim succeeds.
 * Seeded/chirograph: recorded moiety stale after git branch -m.
 */
export function mapCharter(input = {}) {
  const chirograph =
    input.chirograph === true ||
    input.worktreeRenameStale === true ||
    input.recordedBranch === true ||
    input.branchM === true ||
    input.invalidReference === true ||
    input.poolReLeaseFailed === true ||
    input.fallbackMainRepo === true ||
    input.uncommittedLost === true ||
    input.falseReassurance === true;
  const matched = input.matched === true && !chirograph;
  return {
    stamp: chirograph ? "worktree-rename-stale" : "matched-indenture",
    holdingLane: chirograph ? "split" : "moiety",
    kindLane: chirograph ? "worktree-rename-stale" : "indenture",
    bindLane: chirograph ? "recorded-branch" : "current",
    ribbon: chirograph ? "chirograph" : "matched",
    matched,
  };
}

export function inspectMoiety(input = {}) {
  const split =
    input.chirograph === true ||
    input.worktreeRenameStale === true ||
    input.invalidReference === true;
  if (input.matched === true && !split) {
    return {
      stamp: "moiety-matched",
      split: false,
    };
  }
  return {
    stamp: split ? "moiety-split" : "moiety-idle",
    split,
    note: split
      ? "the two parchment moieties no longer correspond — recorded name is not the live branch"
      : "",
  };
}

export function inspectRecorded(input = {}) {
  const stale =
    input.recordedBranch === true ||
    input.chirograph === true;
  if (input.matched === true && !stale) {
    return {
      stamp: "recorded-current",
      stale: false,
    };
  }
  return {
    stamp: stale ? "recorded-branch" : "recorded-idle",
    stale,
    note: stale
      ? "recorded branch stays at worktree-create (claude/dev-28493-25a631); never refreshed after the rename"
      : "",
  };
}

export function inspectRename(input = {}) {
  const renamed =
    input.branchM === true ||
    input.chirograph === true;
  if (input.matched === true && !renamed) {
    return {
      stamp: "rename-none",
      renamed: false,
    };
  }
  return {
    stamp: renamed ? "branch-m" : "rename-idle",
    renamed,
    note: renamed
      ? "git branch -m inside the worktree cut a new live name; the harness never observed it"
      : "",
  };
}

export function inspectReclaim(input = {}) {
  const failed =
    input.invalidReference === true ||
    input.poolReLeaseFailed === true ||
    input.worktreeRenameStale === true ||
    input.chirograph === true;
  if (input.matched === true && !failed) {
    return {
      stamp: "reclaim-matched",
      failed: false,
    };
  }
  return {
    stamp: failed ? "invalid-reference" : "reclaim-idle",
    failed,
    note: failed
      ? "git worktree add fails fatal: invalid reference; Pool re-lease and fresh-create both failed"
      : "",
  };
}

export function inspectFallback(input = {}) {
  const dropped =
    input.fallbackMainRepo === true ||
    input.uncommittedLost === true ||
    input.falseReassurance === true ||
    input.chirograph === true;
  if (input.matched === true && !dropped) {
    return {
      stamp: "fallback-none",
      dropped: false,
    };
  }
  return {
    stamp: dropped ? "fallback-main-repo" : "fallback-idle",
    dropped,
    note: dropped
      ? "session falls back to the shared main repository; uncommitted files weren't carried over; notice names a branch that no longer exists"
      : "",
  };
}

export function readBooth(input = {}) {
  const chirograph =
    input.chirograph === true ||
    input.worktreeRenameStale === true ||
    input.recordedBranch === true ||
    input.branchM === true ||
    input.invalidReference === true ||
    input.poolReLeaseFailed === true ||
    input.fallbackMainRepo === true ||
    input.uncommittedLost === true ||
    input.falseReassurance === true;
  const matched = input.matched === true && !chirograph;
  return {
    mark: chirograph ? "chirograph" : matched || !chirograph ? "matched" : "chirograph",
    matched,
    chirograph,
    worktreeRenameStale: input.worktreeRenameStale === true || chirograph,
    recordedBranch: input.recordedBranch === true,
    branchM: input.branchM === true,
    invalidReference: input.invalidReference === true,
    poolReLeaseFailed: input.poolReLeaseFailed === true,
    fallbackMainRepo: input.fallbackMainRepo === true,
    uncommittedLost: input.uncommittedLost === true,
    falseReassurance: input.falseReassurance === true,
    scope: mapCharter(input),
    moiety: inspectMoiety(input),
    recorded: inspectRecorded(input),
    rename: inspectRename(input),
    reclaim: inspectReclaim(input),
    fallback: inspectFallback(input),
    log: input.log || [],
  };
}

export const CHIROGRAPH_WALK = Object.freeze([
  {
    t: "idle",
    event: "cue-matched",
    matched: true,
    chirograph: false,
    cue: "matched",
    note: "idle HOLD: chirograph moieties still correspond; recorded branch == live branch; reclaim succeeds; uncommitted work preserved — the hold/good path",
  },
  {
    t: "branch-m",
    event: "branch-m",
    chirograph: true,
    branchM: true,
    cue: "chirograph",
    note: "inside the worktree, git branch -m cuts a new live name; the recorded moiety is not recut",
  },
  {
    t: "invalid-reference",
    event: "invalid-reference",
    chirograph: true,
    recordedBranch: true,
    invalidReference: true,
    cue: "chirograph",
    note: "recycle recovery runs git worktree add against the stale recorded name — fatal: invalid reference",
  },
  {
    t: "path",
    event: "worktree-rename-stale",
    chirograph: true,
    worktreeRenameStale: true,
    poolReLeaseFailed: true,
    fallbackMainRepo: true,
    cue: "chirograph",
    note: "worktree-rename-stale — pool re-lease and fresh-create both fail; session falls back to the shared main repository",
  },
  {
    t: "score",
    event: "chirograph",
    chirograph: true,
    worktreeRenameStale: true,
    recordedBranch: true,
    branchM: true,
    invalidReference: true,
    poolReLeaseFailed: true,
    fallbackMainRepo: true,
    uncommittedLost: true,
    falseReassurance: true,
    cue: "chirograph",
    note: "chirograph — when the moieties no longer correspond the booth is chirograph",
  },
]);

export const POSITIVE_CONTROL_WALK = Object.freeze([
  {
    t: "hold",
    event: "cue-matched",
    matched: true,
    chirograph: false,
    cue: "matched",
    note: "positive control: recorded branch == live branch; reclaim succeeds",
  },
  {
    t: "announce",
    event: "cue-matched",
    matched: true,
    cue: "matched",
    note: "positive control: the indenture stays matched",
  },
]);

function classifyFromSeed(seed) {
  if (seed && VERDICTS.includes(seed)) return seed;
  return null;
}

export function emptyTicket() {
  return {
    seed: IDLE_WORD,
    matched: true,
    chirograph: false,
    worktreeRenameStale: false,
    cue: "matched",
  };
}

export function seedMatched() {
  return { ...emptyTicket() };
}

export function seedChirograph() {
  return {
    seed: SEEDED_WORD,
    matched: false,
    chirograph: true,
    worktreeRenameStale: true,
    recordedBranch: true,
    branchM: true,
    invalidReference: true,
    poolReLeaseFailed: true,
    fallbackMainRepo: true,
    uncommittedLost: true,
    falseReassurance: true,
    cue: "chirograph",
    issue: FEATURED_ISSUE,
    proof: SAMPLE_CHIROGRAPH_PROOF,
  };
}

export function seedProduct() {
  return {
    seed: PRODUCT_WORD,
    preferSeed: true,
    chirograph: true,
    worktreeRenameStale: true,
    recordedBranch: true,
    cue: "chirograph",
  };
}

export function seedWorktreeRenameStale() {
  return {
    seed: PATH_WORD,
    preferSeed: true,
    chirograph: true,
    worktreeRenameStale: true,
    invalidReference: true,
    event: "worktree-rename-stale",
    cue: "chirograph",
  };
}

export function seedHold() {
  return {
    seed: "hold",
    preferSeed: true,
    matched: true,
    cue: "matched",
  };
}

export function seedBipartite() {
  return {
    seed: "bipartite",
    preferSeed: true,
    matched: true,
    cue: "matched",
  };
}

export function seedMoiety() {
  return {
    seed: "moiety",
    preferSeed: true,
    matched: true,
    cue: "matched",
  };
}

export function seedIndenture() {
  return {
    seed: "indenture",
    preferSeed: true,
    matched: true,
    cue: "matched",
  };
}

export function seedCurrent() {
  return {
    seed: "current",
    preferSeed: true,
    matched: true,
    cue: "matched",
  };
}

export function seedRecordedBranch() {
  return {
    seed: "recorded-branch",
    preferSeed: true,
    recordedBranch: true,
    cue: "chirograph",
  };
}

export function seedBranchM() {
  return {
    seed: "branch-m",
    preferSeed: true,
    branchM: true,
    cue: "chirograph",
  };
}

export function seedInvalidReference() {
  return {
    seed: "invalid-reference",
    preferSeed: true,
    invalidReference: true,
    cue: "chirograph",
  };
}

export function seedPoolReLeaseFailed() {
  return {
    seed: "pool-re-lease-failed",
    preferSeed: true,
    poolReLeaseFailed: true,
    cue: "chirograph",
  };
}

export function seedFallbackMainRepo() {
  return {
    seed: "fallback-main-repo",
    preferSeed: true,
    fallbackMainRepo: true,
    cue: "chirograph",
  };
}

export function seedUncommittedLost() {
  return {
    seed: "uncommitted-lost",
    preferSeed: true,
    uncommittedLost: true,
    cue: "chirograph",
  };
}

export function seedFalseReassurance() {
  return {
    seed: "false-reassurance",
    preferSeed: true,
    falseReassurance: true,
    cue: "chirograph",
  };
}

export function normalizeBooth(raw) {
  if (!raw || typeof raw !== "object") {
    return {
      matched: false,
      chirograph: false,
      worktreeRenameStale: false,
      recordedBranch: false,
      branchM: false,
      invalidReference: false,
      poolReLeaseFailed: false,
      fallbackMainRepo: false,
      uncommittedLost: false,
      falseReassurance: false,
      cue: null,
      event: null,
      t: null,
    };
  }
  return {
    matched: raw.matched === true,
    chirograph: raw.chirograph === true || raw.event === "chirograph",
    worktreeRenameStale:
      raw.worktreeRenameStale === true || raw.event === "worktree-rename-stale",
    recordedBranch: raw.recordedBranch === true || raw.event === "recorded-branch",
    branchM: raw.branchM === true || raw.event === "branch-m",
    invalidReference:
      raw.invalidReference === true || raw.event === "invalid-reference",
    poolReLeaseFailed:
      raw.poolReLeaseFailed === true || raw.event === "pool-re-lease-failed",
    fallbackMainRepo:
      raw.fallbackMainRepo === true || raw.event === "fallback-main-repo",
    uncommittedLost:
      raw.uncommittedLost === true || raw.event === "uncommitted-lost",
    falseReassurance:
      raw.falseReassurance === true || raw.event === "false-reassurance",
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
      (ticket.matched != null ||
        ticket.chirograph != null ||
        ticket.worktreeRenameStale != null ||
        ticket.recordedBranch != null ||
        ticket.branchM != null ||
        ticket.invalidReference != null ||
        ticket.poolReLeaseFailed != null ||
        ticket.fallbackMainRepo != null ||
        ticket.uncommittedLost != null ||
        ticket.falseReassurance != null ||
        ticket.cue != null ||
        ticket.event ||
        ticket.proof),
  );
}

function isMatched(row) {
  if (row.chirograph && row.cue !== "matched") return false;
  if (row.cue === "chirograph" || row.cue === "worktree-rename-stale") {
    return false;
  }
  if (
    row.worktreeRenameStale &&
    row.recordedBranch &&
    row.cue !== "matched" &&
    row.matched !== true
  ) {
    return false;
  }
  if (row.matched === true && row.chirograph !== true && row.cue !== "chirograph") {
    return true;
  }
  if (
    row.cue === "matched" &&
    row.chirograph !== true &&
    row.worktreeRenameStale !== true &&
    row.recordedBranch !== true &&
    row.branchM !== true &&
    row.invalidReference !== true &&
    row.poolReLeaseFailed !== true &&
    row.fallbackMainRepo !== true &&
    row.uncommittedLost !== true &&
    row.falseReassurance !== true
  ) {
    return true;
  }
  return false;
}

function isWorktreeRenameStale(row) {
  return (
    row.event === "worktree-rename-stale" &&
    !isMatched(row) &&
    (row.worktreeRenameStale === true ||
      row.invalidReference === true ||
      row.recordedBranch === true)
  );
}

function isChirographRow(row) {
  if (isMatched(row)) return false;
  if (isWorktreeRenameStale(row) && row.cue !== "chirograph") return false;
  if (row.cue === "chirograph") return true;
  if (row.chirograph === true) return true;
  if (row.worktreeRenameStale === true && row.recordedBranch === true) {
    return true;
  }
  if (
    row.worktreeRenameStale === true ||
    row.recordedBranch === true ||
    row.branchM === true ||
    row.invalidReference === true ||
    row.poolReLeaseFailed === true ||
    row.fallbackMainRepo === true ||
    row.uncommittedLost === true ||
    row.falseReassurance === true
  ) {
    return true;
  }
  return false;
}

/**
 * Score one chirograph pass against the bipartite indenture.
 * matched: recorded branch == live branch; reclaim succeeds; uncommitted preserved.
 * chirograph: recorded moiety stale after git branch -m; reclaim invalid-ref; fallback to main.
 * worktree-rename-stale: names that path.
 */
export function scoreGate(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const row = normalizeBooth(ticket);
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);

  let verdict = IDLE_WORD;
  if (
    isWorktreeRenameStale(row) ||
    (row.worktreeRenameStale && ticket.preferSeed && seeded === PATH_WORD)
  ) {
    verdict = "worktree-rename-stale";
  } else if (isChirographRow(row)) {
    verdict = "chirograph";
  } else if (isMatched(row)) {
    verdict = "matched";
  } else if (
    row.worktreeRenameStale ||
    row.recordedBranch ||
    row.branchM ||
    row.invalidReference ||
    row.poolReLeaseFailed ||
    row.fallbackMainRepo ||
    row.uncommittedLost ||
    row.falseReassurance
  ) {
    verdict = "chirograph";
  }

  if (seeded && (!hasBoothFields(ticket) || ticket.preferSeed === true)) {
    verdict = seeded;
  }

  const hold = HOLD.includes(verdict);
  const moiety = inspectMoiety(row);
  const recorded = inspectRecorded(row);
  const rename = inspectRename(row);
  const reclaim = inspectReclaim(row);
  const fallback = inspectFallback(row);
  return {
    verdict,
    idleWord: IDLE_WORD,
    pathWord: PATH_WORD,
    seededWord: SEEDED_WORD,
    productWord: PRODUCT_WORD,
    hold,
    alarm: !hold,
    recover: RECOVER.includes(verdict),
    matched: verdict === "matched" || verdict === "hold",
    chirograph: verdict === "chirograph" || verdict === SEEDED_WORD,
    worktreeRenameStale:
      row.worktreeRenameStale === true ||
      verdict === "worktree-rename-stale" ||
      verdict === PATH_WORD,
    recordedBranch: row.recordedBranch,
    branchM: row.branchM,
    invalidReference: row.invalidReference,
    poolReLeaseFailed: row.poolReLeaseFailed,
    fallbackMainRepo: row.fallbackMainRepo,
    uncommittedLost: row.uncommittedLost,
    falseReassurance: row.falseReassurance,
    cue: hold
      ? "matched"
      : row.worktreeRenameStale || verdict === "worktree-rename-stale"
        ? "worktree-rename-stale"
        : "chirograph",
    event: row.event,
    t: row.t,
    phrase: hold ? "admit matched" : "score chirograph",
    moietyInspect: moiety,
    recordedInspect: recorded,
    renameInspect: rename,
    reclaimInspect: reclaim,
    fallbackInspect: fallback,
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
      : CHIROGRAPH_WALK;
  const scored = rows.map((row) => ({
    ...normalizeBooth(row),
    ...scoreGate({ ...row, preferSeed: false }),
  }));
  const dead = scored.filter((row) => row.verdict === "chirograph");
  const path = scored.filter((row) => row.verdict === "worktree-rename-stale");
  const matched = scored.filter((row) => row.verdict === "matched");
  const headline =
    scored.find((row) => row.event === "chirograph") ||
    scored.find((row) => row.event === "worktree-rename-stale") ||
    scored.find((row) => row.event === "branch-m") ||
    dead[dead.length - 1];
  let verdict = "matched";
  if (dead.length) verdict = "chirograph";
  else if (path.length && !matched.length) verdict = "worktree-rename-stale";
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
    chirographCount: dead.length,
    pathCount: path.length,
    matchedCount: matched.length,
    headline,
    rows: scored,
    phrase: HOLD.includes(verdict) ? "admit matched" : "score chirograph",
    note: headline
      ? "Recorded branch never refreshed after git branch -m; recycle recovery invalid-ref; fallback to main repo; uncommitted loss + false reassurance branch. Cousins cite-only: #54653 #53061 #85114 #85195."
      : "published chirograph walk scored against matched vs chirograph",
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
    seeded !== "matched" &&
    seeded !== "chirograph" &&
    seeded !== "worktree-rename-stale" &&
    ticket.matched == null &&
    ticket.chirograph == null &&
    ticket.worktreeRenameStale == null &&
    ticket.recordedBranch == null &&
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
    matched: scored.matched ?? false,
    chirograph: scored.chirograph ?? false,
    worktreeRenameStale: scored.worktreeRenameStale ?? false,
    recordedBranch: scored.recordedBranch ?? false,
    branchM: scored.branchM ?? false,
    invalidReference: scored.invalidReference ?? false,
    poolReLeaseFailed: scored.poolReLeaseFailed ?? false,
    fallbackMainRepo: scored.fallbackMainRepo ?? false,
    uncommittedLost: scored.uncommittedLost ?? false,
    falseReassurance: scored.falseReassurance ?? false,
  };
}

export function score(input) {
  return analyze(input).verdict;
}

export function fingerprint(input) {
  const result = analyze(input);
  return [
    result.verdict,
    result.recordedBranch || result.chirograph
      ? "kind=worktree-rename-stale"
      : "kind=indenture",
    result.invalidReference || result.chirograph ? "ref=invalid" : "ref=current",
    result.worktreeRenameStale || result.verdict === "worktree-rename-stale"
      ? "path=worktree-rename-stale"
      : "path=matched",
    result.cue === "matched"
      ? "cue=matched"
      : result.cue === "worktree-rename-stale"
        ? "cue=worktree-rename-stale"
        : "cue=chirograph",
  ].join("|");
}

export function handle(input) {
  const result = analyze(input);
  const booth = readBooth({
    matched: result.matched,
    chirograph: result.chirograph,
    worktreeRenameStale: result.worktreeRenameStale,
    recordedBranch: result.recordedBranch,
    branchM: result.branchM,
    invalidReference: result.invalidReference,
    poolReLeaseFailed: result.poolReLeaseFailed,
    fallbackMainRepo: result.fallbackMainRepo,
    uncommittedLost: result.uncommittedLost,
    falseReassurance: result.falseReassurance,
    proof: input && input.proof,
    log: input && input.log,
  });
  return {
    ...result,
    fingerprint: fingerprint(input),
    booth,
    moiety: inspectMoiety({
      matched: result.matched,
      chirograph: result.chirograph,
      worktreeRenameStale: result.worktreeRenameStale,
      invalidReference: result.invalidReference,
    }),
    recorded: inspectRecorded({
      matched: result.matched,
      chirograph: result.chirograph,
      recordedBranch: result.recordedBranch,
    }),
    rename: inspectRename({
      matched: result.matched,
      chirograph: result.chirograph,
      branchM: result.branchM,
    }),
    reclaim: inspectReclaim({
      matched: result.matched,
      chirograph: result.chirograph,
      worktreeRenameStale: result.worktreeRenameStale,
      invalidReference: result.invalidReference,
      poolReLeaseFailed: result.poolReLeaseFailed,
    }),
    fallback: inspectFallback({
      matched: result.matched,
      chirograph: result.chirograph,
      fallbackMainRepo: result.fallbackMainRepo,
      uncommittedLost: result.uncommittedLost,
      falseReassurance: result.falseReassurance,
    }),
    scope: mapCharter({
      matched: result.matched,
      chirograph: result.chirograph,
      worktreeRenameStale: result.worktreeRenameStale,
      recordedBranch: result.recordedBranch,
      branchM: result.branchM,
      invalidReference: result.invalidReference,
      poolReLeaseFailed: result.poolReLeaseFailed,
      fallbackMainRepo: result.fallbackMainRepo,
      uncommittedLost: result.uncommittedLost,
      falseReassurance: result.falseReassurance,
    }),
    stations: BOOTH_STATIONS.map((row) => ({
      ...row,
      chirograph:
        result.chirograph === true ||
        result.verdict === "chirograph",
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
        "NON-BINDING: session/harness caches the branch name at worktree create and never observes git branch -m / never refreshes the recorded name before git worktree add. Invite verify against #94045 text only. Do not claim a root cause in Claude Code source you have not seen.",
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
