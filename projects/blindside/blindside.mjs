#!/usr/bin/env node
/**
 * Blindside — sideline-scout / blind-side-tackle / peripheral-vision booth.
 *
 * Educational diagnostic model for a published Claude Code defect:
 * Claude Code creates subagent worktrees under `.claude/worktrees/`
 * (a directory it owns). Work those agents commit is then invisible
 * to the session's diff pane, because the pane looks at the directory
 * the session is rooted in and offers no way to select a compare ref.
 * The pane reports "no changes" while several commits exist in the
 * same repository on a worktree branch. Session stays on `main`;
 * agents commit on e.g. `slice-118-readout-elicitation-register`.
 *
 *   node blindside.mjs data/blindsided.json
 *   echo '{"seed":"blindsided"}' | node blindside.mjs
 *
 * Idle word is sighted (HOLD: compare ref / owned worktrees reachable
 * from the diff pane — the sideline the scout can see).
 * Seeded word is blindsided (#93786 worktree commits invisible).
 * Path word is compare-ref-unreachable.
 * Product score word is blindside (Score blindside or admit sighted.).
 *
 * Encoded from anthropics/claude-code#93786 issue text only.
 * Hypothesis (NON-BINDING): the diff pane is rooted to session cwd
 * and exposes base selection but not compare-ref / owned-worktree
 * selection, so committed work in `.claude/worktrees/*` is unreachable.
 * Verify against #93786 text only. Do NOT claim a root cause in
 * Claude Code source you have not seen. Do NOT implement a fix.
 * No network. No exploits. No live Claude. No secrets.
 */

/* Browser-safe: no top-level node: imports. CLI I/O is loaded only in main(). */

export const VERDICTS = Object.freeze([
  "sighted",
  "blindsided",
  "blindside",
  "compare-ref-unreachable",
  "hold",
  "worktree-owned",
  "pane-empty",
  "commits-present",
  "compare-ref",
  "has-repro",
  "cousins",
  "backups",
  "fixtures",
  "walk",
]);

export const IDLE_WORD = "sighted";
export const PATH_WORD = "compare-ref-unreachable";
export const SEEDED_WORD = "blindsided";
export const PRODUCT_WORD = "blindside";
export const HOLD = Object.freeze(["sighted", "hold"]);
export const HOLD_ALIASES = Object.freeze([
  "sighted",
  "compare-reachable",
  "worktree-listed",
  "pane-can-see",
]);
export const RECOVER = Object.freeze(["sighted", "hold"]);
export const ALARM = Object.freeze(
  VERDICTS.filter((name) => !HOLD.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FORBIDDEN_IDLE = Object.freeze([
  "scoped",
  "interdicted",
  "interdict",
  "chrome-prohibit-bleed",
  "duplex",
  "simplexed",
  "simplex",
  "mobile-uplink-silent",
  "keyed",
  "deadkeyed",
  "deadkey",
  "esc-csi-dead",
  "gleaned",
  "orphaned",
  "gleaner",
  "unreaped-ampersand",
  "live",
  "schismed",
  "schism",
  "resume-while-live",
  "intact",
  "rasured",
  "rasure",
  "creation-time-flip",
  "swept",
  "ashpanned",
  "ashpan",
  "orphan-jsonl",
  "credentialed",
  "outridden",
  "outrider",
  "early-connect",
  "attested",
  "necrologized",
  "necrology",
  "incomplete-listing",
  "named",
  "blank",
  "innominate",
  "icon-only",
  "lit",
  "snuffed",
  "snuffer",
  "ganged-or",
  "pledged",
  "swapped",
  "remote-reattach",
  "changeling",
  "invisible-reinject",
  "ledger-lie",
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
  "quench",
  "stopcock",
  "hasp",
  "scuttle",
  "aphonia",
  "muzzle",
  "leaking",
  "excised",
  "escutcheon",
  "lacuna",
  "annunciator",
  "tocsin",
  "knell",
  "wraith",
  "scrim",
  "knock",
  "reliquary",
  "cenotaph",
  "afterimage",
  "midden",
  "eidolon",
  "guillotine",
  "clepsydra",
  "springe",
  "deadlight",
  "damper",
  "sounder",
  "parergon",
  "carrier",
  "deadair",
  "squelch",
  "lazaret",
  "deadletter",
]);
export const FORBIDDEN_SEED = Object.freeze(
  FORBIDDEN_IDLE.filter((name) => name !== "blindsided" && name !== "blindside"),
);

export const FEATURED_ISSUE = 93786;
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/93786";
export const TITLE =
  "[Desktop] Work committed in subagent worktrees under .claude/worktrees/ is invisible to the session's diff pane, and there is no way to select a compare ref";
export const STATE = "OPEN";
export const LABELS = Object.freeze([
  "enhancement",
  "platform:macos",
  "area:agents",
  "area:desktop",
]);
export const PLATFORM = "macos";
export const CLAUDE_VERSION = "2.1.267";
export const GOOD_VERSION =
  "diff pane lists .claude/worktrees/ and/or lets the user choose the compare ref";
export const SURFACE = "Claude Code 2.1.267, Desktop app";
export const HOST = "Desktop app";
export const INSTALL_PATH = "Desktop / .claude/worktrees/ (owned by Claude Code)";
export const COMMAND = "git diff main...slice-118-readout-elicitation-register --stat";
export const PHRASE = "Score blindside or admit sighted.";
export const DISTRIBUTION =
  "Claude Code creates subagent worktrees under .claude/worktrees/, a directory it owns. Work those agents commit is then invisible to the session's diff pane, because the pane looks at the directory the session is rooted in and offers no way to select a compare ref. The pane reports \"no changes\" while several commits exist in the same repository. Session stays on main; an orchestrator agent branched off origin/main and an implementation agent committed six times on slice-118-readout-elicitation-register under .claude/worktrees/. Do not use EnterWorktree. Open the diff pane and select main → working tree → All changes: the pane is empty. That is a correct statement about the directory it watches: the main checkout is on main, its tracked tree is clean, and git diff main returns nothing. The work is real and reachable from the same repository: git diff main...slice-118-readout-elicitation-register --stat shows 5 files changed, 1726 insertions(+), 29 deletions(-); git worktree list shows /path/to/repo/.claude/worktrees/slice-118-readout-elicitation-register 9c2f199c [slice-118-readout-elicitation-register]. This is not the undisclosed-base problem in #65852 and not the uncommitted-changes gap in #52179. The work here is committed, and the base is correct. The compare side is what is unreachable. Environment: Claude Code 2.1.267, Desktop app; macOS 26.6.2 (build 25G83); git 2.54.0 (Apple Git-157). A second symptom: the PR bar also stays blank when a PR is open for the worktree branch while the session stays on main.";
export const RULED_OUT = Object.freeze([
  "undisclosed base / phantom changes (#65852) — here the base is right and the count is honestly zero",
  "uncommitted working-tree diff (#52179) — these changes are committed, so that view would also be empty",
  "select the base branch (#23626) — a different axis; with a base dropdown a session rooted on main still cannot reach a branch checked out elsewhere",
  "diff panel of a session created in a worktree (#79530) — this session was not created in a worktree",
]);
export const EXPECTED = Object.freeze([
  "the pane lists worktrees under .claude/worktrees/ and lets the user view one, since Claude Code created them",
  "the pane lets the user choose the compare ref, not only the base, so a branch checked out in a sibling worktree is reachable",
  "the pane says which refs it is comparing and that nothing else in this repository is being shown, so an empty result is legible rather than ambiguous",
]);

export const FIELD_MARKS = Object.freeze([
  { id: "turf", label: "night turf", count: "field-set", note: "sideline-scout pitch — not a papal vellum or radio chassis" },
  { id: "chalk", label: "chalk hash", count: "lined", note: "session rooted on main; the checkout the pane watches" },
  { id: "flood", label: "floodlight", count: "blind", note: "owned worktree commits sit on the far sideline" },
  { id: "clip", label: "scout clipboard", count: "empty", note: "diff pane reports no changes while commits exist" },
]);

export const BOOTH_STATIONS = Object.freeze([
  {
    id: "sighted-gate",
    survey: "watch compare ref / owned worktrees stay reachable from the diff pane",
    kind: "sighted",
    note: "idle: the scout can see the far sideline — the hold/good path",
  },
  {
    id: "worktree-owned",
    survey: "delegate to subagents that create worktrees under .claude/worktrees/ and commit there",
    kind: "blindsided",
    note: "seeded: Claude Code owns the directory; session stays on main",
  },
  {
    id: "pane-empty",
    survey: "open the diff pane and select main → working tree → All changes",
    kind: "blindsided",
    note: "seeded: pane reports no changes — a correct statement about session cwd",
  },
  {
    id: "commits-present",
    survey: "git diff main...slice-118-readout-elicitation-register --stat",
    kind: "blindsided",
    note: "seeded: 5 files, 1726 insertions, 29 deletions; worktree list shows the slice",
  },
  {
    id: "compare-ref",
    survey: "look for a compare-ref control, not only a base dropdown",
    kind: "blindsided",
    note: "seeded: no way to select the compare ref; the far sideline is unreachable",
  },
]);

export const FINGERPRINT_LINES = Object.freeze([
  "compare-ref-unreachable",
  "blindsided",
  "worktree-owned",
  "pane-empty",
  "commits-present",
  "compare-ref",
]);

export const COUSINS = Object.freeze([
  {
    issue: 65852,
    title: "Undisclosed base / phantom changes in the diff pane",
    state: "OPEN",
    citeOnly: true,
    product: null,
    why: "Cite-only cousin — #65852 undisclosed base inflating the count. Distinct: here the base is right and the count is honestly zero. The compare side is unreachable. Do not rebuild",
  },
  {
    issue: 52179,
    title: "Uncommitted working-tree diff feature",
    state: "OPEN",
    citeOnly: true,
    product: null,
    why: "Cite-only cousin — #52179 asks for an uncommitted working-tree diff. Distinct: these changes are committed, so that view would also be empty. Do not rebuild",
  },
]);

export const BACKUPS = Object.freeze([
  { issue: 93778, title: "backup #93778", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93766, title: "backup #93766", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93764, title: "backup #93764", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93754, title: "backup #93754", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93751, title: "backup #93751", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93744, title: "backup #93744", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93772, title: "backup #93772", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93770, title: "backup #93770", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93777, title: "backup #93777", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93782, title: "backup #93782", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93800, title: "backup #93800", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93795, title: "backup #93795", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93821, title: "backup #93821", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93811, title: "backup #93811", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93809, title: "backup #93809", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93834, title: "backup #93834", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93823, title: "backup #93823", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93825, title: "backup #93825", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93797, title: "backup #93797", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93780, title: "backup #93780", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93779, title: "backup #93779", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93776, title: "backup #93776", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93769, title: "backup #93769", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
]);

export const NOT_PRODUCTS = Object.freeze([
  "interdict",
  "simplex",
  "deadkey",
  "gleaner",
  "schism",
  "rasure",
  "ashpan",
  "outrider",
  "necrology",
  "innominate",
  "snuffer",
  "changeling",
  "homograph",
  "galley",
  "rescript",
  "aphonia",
  "muzzle",
  "deadair",
  "escutcheon",
  "lacuna",
  "annunciator",
  "tocsin",
  "lazaret",
  "oubliette",
  "ephemera",
  "followspot",
  "mondegreen",
  "deadletter",
  "parergon",
  "guillotine",
  "flashpan",
  "clepsydra",
  "springe",
  "deadlight",
  "damper",
  "sounder",
  "eidolon",
  "calends",
  "weir",
  "monadnock",
  "rider",
  "irons",
  "cathead",
  "anachronism",
  "gland",
  "entresol",
  "escheat",
  "midden",
]);

export const SAMPLE_SIGHTED_FIELD = Object.freeze({
  sessionOnMain: true,
  worktreesListed: true,
  compareRefSelectable: true,
  paneSeesWorktree: true,
  version: GOOD_VERSION,
});

export const SAMPLE_BLINDSIDED_FIELD = Object.freeze({
  sessionOnMain: true,
  worktreesListed: false,
  compareRefSelectable: false,
  paneSeesWorktree: false,
  version: CLAUDE_VERSION,
});

export const SAMPLE_WORKTREE = Object.freeze({
  ownedDir: ".claude/worktrees/",
  branch: "slice-118-readout-elicitation-register",
  path: "/path/to/repo/.claude/worktrees/slice-118-readout-elicitation-register",
  sha: "9c2f199c",
  createdByClaude: true,
});

export const SAMPLE_SIGHTED_WORKTREE = Object.freeze({
  ownedDir: ".claude/worktrees/",
  branch: "slice-118-readout-elicitation-register",
  path: "/path/to/repo/.claude/worktrees/slice-118-readout-elicitation-register",
  sha: "9c2f199c",
  createdByClaude: true,
  listedInPane: true,
});

export const SAMPLE_PANE = Object.freeze({
  reportsNoChanges: true,
  watchesSessionCwd: true,
  selection: "main → working tree → All changes",
  empty: true,
});

export const SAMPLE_SIGHTED_PANE = Object.freeze({
  reportsNoChanges: false,
  watchesSessionCwd: true,
  selection: "main → slice-118-readout-elicitation-register",
  empty: false,
});

export const SAMPLE_COMMITS = Object.freeze({
  filesChanged: 5,
  insertions: 1726,
  deletions: 29,
  commitCount: 6,
  command: COMMAND,
  present: true,
});

export const SAMPLE_SIGHTED_COMMITS = Object.freeze({
  filesChanged: 5,
  insertions: 1726,
  deletions: 29,
  commitCount: 6,
  command: COMMAND,
  present: true,
  visibleInPane: true,
});

export const SAMPLE_COMPARE = Object.freeze({
  baseSelectable: true,
  compareSelectable: false,
  compareSideUnreachable: true,
  worktreeBranch: "slice-118-readout-elicitation-register",
});

export const SAMPLE_SIGHTED_COMPARE = Object.freeze({
  baseSelectable: true,
  compareSelectable: true,
  compareSideUnreachable: false,
  worktreeBranch: "slice-118-readout-elicitation-register",
});

export const SAMPLE_WALK_LOG = Object.freeze([
  { t: "idle", line: "booth holds sighted: compare ref / owned worktrees reachable from the diff pane" },
  { t: "worktree-owned", line: "subagents commit on slice-118 under .claude/worktrees/; session stays on main" },
  { t: "pane-empty", line: "diff pane reports no changes — it watches session cwd only" },
  { t: "commits-present", line: "git diff main...slice-118-readout-elicitation-register --stat shows 5 files" },
  { t: "compare-ref", line: "no control to choose the compare ref; the far sideline is unreachable" },
  { t: "path", line: "compare-ref-unreachable — owned worktree commits sit off the pane's field of view" },
  { t: "score", line: "when the pane cannot see committed worktree work the booth is blindside — Score blindside or admit sighted." },
]);

export function inspectWorktreeOwned(input = {}) {
  const tree =
    input.worktree && typeof input.worktree === "object"
      ? input.worktree
      : input.sighted === true && input.blindsided !== true
        ? SAMPLE_SIGHTED_WORKTREE
        : SAMPLE_WORKTREE;
  const forced =
    input.worktreeOwned === true ||
    input.event === "worktree-owned" ||
    input.event === "blindsided" ||
    input.event === "blindside" ||
    input.blindsided === true;
  const owned = forced ? true : tree.createdByClaude === true && input.sighted !== true;
  return {
    ownedDir: ".claude/worktrees/",
    branch: "slice-118-readout-elicitation-register",
    createdByClaude: true,
    listedInPane: !owned && tree.listedInPane === true,
    stamp: owned ? "worktree-owned" : "worktree-listed",
    note: owned
      ? "Claude Code owns .claude/worktrees/; agents committed on slice-118 while the session stayed on main"
      : "owned worktrees stay listed and reachable from the diff pane",
  };
}

export function inspectPaneEmpty(input = {}) {
  const pane =
    input.pane && typeof input.pane === "object"
      ? input.pane
      : input.sighted === true && input.blindsided !== true
        ? SAMPLE_SIGHTED_PANE
        : SAMPLE_PANE;
  const forced =
    input.paneEmpty === true ||
    input.event === "pane-empty" ||
    input.event === "blindsided" ||
    input.event === "blindside";
  const empty = forced ? true : pane.empty === true && input.sighted !== true;
  return {
    reportsNoChanges: empty,
    watchesSessionCwd: true,
    selection: empty ? "main → working tree → All changes" : "main → slice-118-readout-elicitation-register",
    empty,
    stamp: empty ? "pane-empty" : "pane-sees",
    note: empty
      ? "pane reports no changes while several commits exist in the same repository"
      : "pane can see the compare side; empty is not the only readout",
  };
}

export function inspectCommitsPresent(input = {}) {
  const commits =
    input.commits && typeof input.commits === "object"
      ? input.commits
      : input.sighted === true && input.blindsided !== true
        ? SAMPLE_SIGHTED_COMMITS
        : SAMPLE_COMMITS;
  const forced =
    input.commitsPresent === true ||
    input.event === "commits-present" ||
    input.event === "blindsided" ||
    input.event === "blindside";
  const present = forced ? true : commits.present === true && input.sighted !== true;
  return {
    filesChanged: present ? 5 : commits.filesChanged || 0,
    insertions: present ? 1726 : commits.insertions || 0,
    deletions: present ? 29 : commits.deletions || 0,
    commitCount: present ? 6 : commits.commitCount || 0,
    present,
    visibleInPane: !present && commits.visibleInPane === true,
    stamp: present ? "commits-present" : "commits-visible",
    note: present
      ? "git diff main...slice-118-readout-elicitation-register --stat shows 5 files, 1726 insertions, 29 deletions"
      : "committed worktree work is visible in the pane, not only on the CLI",
  };
}

export function inspectCompareRef(input = {}) {
  const compare =
    input.compare && typeof input.compare === "object"
      ? input.compare
      : input.sighted === true && input.blindsided !== true
        ? SAMPLE_SIGHTED_COMPARE
        : SAMPLE_COMPARE;
  const forced =
    input.compareRefUnreachable === true ||
    input.event === "compare-ref" ||
    input.event === "compare-ref-unreachable" ||
    input.event === "blindsided" ||
    input.event === "blindside";
  const unreachable = forced ? true : compare.compareSideUnreachable === true && input.sighted !== true;
  return {
    baseSelectable: true,
    compareSelectable: !unreachable,
    compareSideUnreachable: unreachable,
    worktreeBranch: "slice-118-readout-elicitation-register",
    stamp: unreachable ? "compare-ref-unreachable" : "compare-reachable",
    note: unreachable
      ? "pane offers no way to select a compare ref; the worktree branch stays off the field"
      : "compare ref is selectable; owned worktree branches are on the scout's board",
  };
}

export function readBooth(input = {}) {
  const worktree = inspectWorktreeOwned(input);
  const pane = inspectPaneEmpty(input);
  const commits = inspectCommitsPresent(input);
  const compare = inspectCompareRef(input);
  const blindsided =
    input.sighted !== true &&
    ((pane.empty && commits.present && compare.compareSideUnreachable) ||
      input.blindsided === true);
  const sighted =
    input.sighted === true && blindsided !== true && pane.empty !== true;
  const path =
    (input.event === "compare-ref-unreachable" || input.compareRefUnreachable === true) &&
    (compare.compareSideUnreachable || input.blindsided === true);
  return {
    worktree,
    pane,
    commits,
    compare,
    marks: FIELD_MARKS,
    stations: BOOTH_STATIONS,
    blindsided: blindsided && !sighted && !path,
    sighted: sighted || (!blindsided && !path && input.blindsided !== true && input.compareRefUnreachable !== true && pane.empty !== true),
    compareRefUnreachable: path && !sighted,
    mark:
      path && !sighted
        ? "compare-ref-unreachable"
        : blindsided && !sighted
          ? "blindsided"
          : "sighted",
  };
}

/**
 * Published blindside walk from #93786 only. Facts from the issue text.
 * A sighted booth keeps compare-ref / owned worktrees reachable.
 * A blindsided booth lets committed worktree work sit off the pane.
 * A compare-ref-unreachable booth names the far-sideline path.
 */
export const BLINDSIDE_WALK = Object.freeze([
  {
    t: "idle",
    event: "cue-sighted",
    sighted: true,
    blindsided: false,
    cue: "sighted",
    note: "idle HOLD: compare ref / owned worktrees reachable from the diff pane — the hold/good path",
  },
  {
    t: "worktree-owned",
    event: "worktree-owned",
    blindsided: true,
    worktreeOwned: true,
    cue: "blindsided",
    note: "subagents commit under .claude/worktrees/; session stays on main",
  },
  {
    t: "pane-empty",
    event: "pane-empty",
    blindsided: true,
    paneEmpty: true,
    cue: "blindsided",
    note: "diff pane reports no changes — it watches session cwd",
  },
  {
    t: "commits-present",
    event: "commits-present",
    blindsided: true,
    commitsPresent: true,
    cue: "blindsided",
    note: "git diff main...slice-118 --stat shows real committed work",
  },
  {
    t: "compare-ref",
    event: "compare-ref",
    blindsided: true,
    compareRefUnreachable: true,
    cue: "blindsided",
    note: "no way to select the compare ref",
  },
  {
    t: "path",
    event: "compare-ref-unreachable",
    blindsided: true,
    compareRefUnreachable: true,
    paneEmpty: true,
    commitsPresent: true,
    cue: "blindsided",
    note: "compare-ref-unreachable — owned worktree commits sit off the pane",
  },
  {
    t: "score",
    event: "blindside",
    blindsided: true,
    compareRefUnreachable: true,
    worktreeOwned: true,
    paneEmpty: true,
    commitsPresent: true,
    cue: "blindsided",
    note: "blindside — when the pane cannot see committed worktree work the booth never stays sighted",
  },
]);

export const POSITIVE_CONTROL_WALK = Object.freeze([
  {
    t: "hold",
    event: "cue-sighted",
    sighted: true,
    blindsided: false,
    cue: "sighted",
    note: "positive control: compare ref / owned worktrees stay reachable",
  },
  {
    t: "announce",
    event: "cue-sighted",
    sighted: true,
    cue: "sighted",
    note: "positive control: far sideline on the scout clipboard",
  },
]);

function classifyFromSeed(seed) {
  if (seed && VERDICTS.includes(seed)) return seed;
  return null;
}

export function emptyTicket() {
  return {
    seed: IDLE_WORD,
    sighted: true,
    blindsided: false,
    compareRefUnreachable: false,
    cue: "sighted",
  };
}

export function seedSighted() {
  return { ...emptyTicket() };
}

export function seedBlindsided() {
  return {
    seed: SEEDED_WORD,
    sighted: false,
    blindsided: true,
    compareRefUnreachable: true,
    worktreeOwned: true,
    paneEmpty: true,
    commitsPresent: true,
    cue: "blindsided",
    issue: FEATURED_ISSUE,
    worktree: SAMPLE_WORKTREE,
    pane: SAMPLE_PANE,
    commits: SAMPLE_COMMITS,
    compare: SAMPLE_COMPARE,
  };
}

export function seedBlindside() {
  return {
    seed: PRODUCT_WORD,
    preferSeed: true,
    blindsided: true,
    compareRefUnreachable: true,
    worktreeOwned: true,
    paneEmpty: true,
    commitsPresent: true,
    cue: "blindsided",
  };
}

export function seedCompareRefUnreachable() {
  return {
    seed: PATH_WORD,
    preferSeed: true,
    blindsided: true,
    compareRefUnreachable: true,
    paneEmpty: true,
    commitsPresent: true,
    event: "compare-ref-unreachable",
    cue: "blindsided",
  };
}

export function seedHold() {
  return {
    seed: "hold",
    preferSeed: true,
    sighted: true,
    cue: "sighted",
  };
}

export function seedWorktreeOwned() {
  return {
    seed: "worktree-owned",
    preferSeed: true,
    worktreeOwned: true,
    cue: "blindsided",
  };
}

export function seedPaneEmpty() {
  return {
    seed: "pane-empty",
    preferSeed: true,
    paneEmpty: true,
    cue: "blindsided",
  };
}

export function seedCommitsPresent() {
  return {
    seed: "commits-present",
    preferSeed: true,
    commitsPresent: true,
    cue: "blindsided",
  };
}

export function seedCompareRef() {
  return {
    seed: "compare-ref",
    preferSeed: true,
    compareRefUnreachable: true,
    cue: "blindsided",
  };
}

export function normalizeBooth(raw) {
  if (!raw || typeof raw !== "object") {
    return {
      sighted: false,
      blindsided: false,
      compareRefUnreachable: false,
      worktreeOwned: false,
      paneEmpty: false,
      commitsPresent: false,
      cue: null,
      event: null,
      t: null,
    };
  }
  return {
    sighted: raw.sighted === true,
    blindsided:
      raw.blindsided === true ||
      raw.event === "blindsided" ||
      raw.event === "blindside",
    compareRefUnreachable:
      raw.compareRefUnreachable === true || raw.event === "compare-ref-unreachable",
    worktreeOwned: raw.worktreeOwned === true || raw.event === "worktree-owned",
    paneEmpty: raw.paneEmpty === true || raw.event === "pane-empty",
    commitsPresent: raw.commitsPresent === true || raw.event === "commits-present",
    cue: raw.cue || null,
    event: raw.event || raw.kind || null,
    t: raw.t || raw.time || null,
    worktree: raw.worktree,
    pane: raw.pane,
    commits: raw.commits,
    compare: raw.compare,
    log: raw.log,
  };
}

function hasBoothFields(ticket) {
  return Boolean(
    ticket &&
      (ticket.sighted != null ||
        ticket.blindsided != null ||
        ticket.compareRefUnreachable != null ||
        ticket.paneEmpty != null ||
        ticket.commitsPresent != null ||
        ticket.cue != null ||
        ticket.event ||
        ticket.pane ||
        ticket.commits ||
        ticket.compare),
  );
}

function isSighted(row) {
  if (row.blindsided && row.cue !== "sighted") return false;
  if (
    row.cue === "blindsided" ||
    row.cue === "blindside" ||
    row.cue === "compare-ref-unreachable"
  ) {
    return false;
  }
  if (
    row.compareRefUnreachable &&
    row.paneEmpty &&
    row.cue !== "sighted" &&
    row.sighted !== true
  ) {
    return false;
  }
  if (
    row.compareRefUnreachable &&
    row.commitsPresent &&
    row.cue !== "sighted" &&
    row.sighted !== true
  ) {
    return false;
  }
  if (row.sighted === true && row.blindsided !== true && row.cue !== "blindsided") {
    return true;
  }
  if (
    row.cue === "sighted" &&
    row.blindsided !== true &&
    row.compareRefUnreachable !== true &&
    row.paneEmpty !== true &&
    row.commitsPresent !== true
  ) {
    return true;
  }
  return false;
}

function isCompareRefUnreachablePath(row) {
  return (
    row.event === "compare-ref-unreachable" &&
    !isSighted(row) &&
    (row.compareRefUnreachable === true ||
      row.paneEmpty === true ||
      row.commitsPresent === true)
  );
}

function isBlindsided(row) {
  if (isSighted(row)) return false;
  if (isCompareRefUnreachablePath(row) && row.cue !== "blindsided") return false;
  if (row.cue === "blindsided" || row.cue === "blindside") return true;
  if (row.blindsided === true) return true;
  if (
    row.compareRefUnreachable === true &&
    row.paneEmpty === true &&
    row.commitsPresent === true
  ) {
    return true;
  }
  if (row.compareRefUnreachable === true && row.paneEmpty === true) {
    return true;
  }
  if (
    row.paneEmpty === true ||
    row.commitsPresent === true ||
    row.worktreeOwned === true ||
    (row.compareRefUnreachable === true && row.commitsPresent === true)
  ) {
    return true;
  }
  return false;
}

/**
 * Score one blindside pass against the sideline scout clipboard.
 * sighted: compare ref / owned worktrees reachable from the diff pane.
 * blindsided / blindside: committed worktree work is invisible to the pane.
 * compare-ref-unreachable: the compare side sits off the field of view.
 */
export function scoreGate(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const row = normalizeBooth(ticket);
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);

  let verdict = IDLE_WORD;
  if (
    isCompareRefUnreachablePath(row) ||
    (row.compareRefUnreachable && ticket.preferSeed && seeded === PATH_WORD)
  ) {
    verdict = "compare-ref-unreachable";
  } else if (isBlindsided(row)) {
    verdict = "blindside";
  } else if (isSighted(row)) {
    verdict = "sighted";
  } else if (
    row.compareRefUnreachable ||
    row.paneEmpty ||
    row.commitsPresent ||
    (row.worktreeOwned && !row.sighted)
  ) {
    verdict = "blindside";
  }

  if (seeded && (!hasBoothFields(ticket) || ticket.preferSeed === true)) {
    verdict = seeded;
  }

  const hold = HOLD.includes(verdict);
  const worktree = inspectWorktreeOwned(row);
  const pane = inspectPaneEmpty(row);
  const commits = inspectCommitsPresent(row);
  const compare = inspectCompareRef(row);
  return {
    verdict,
    idleWord: IDLE_WORD,
    pathWord: PATH_WORD,
    seededWord: SEEDED_WORD,
    productWord: PRODUCT_WORD,
    hold,
    alarm: !hold,
    recover: RECOVER.includes(verdict),
    sighted: verdict === "sighted" || verdict === "hold",
    blindsided:
      verdict === "blindsided" ||
      verdict === SEEDED_WORD ||
      verdict === PRODUCT_WORD,
    compareRefUnreachable:
      row.compareRefUnreachable === true ||
      verdict === "compare-ref-unreachable" ||
      verdict === PATH_WORD,
    worktreeOwned: row.worktreeOwned,
    paneEmpty: row.paneEmpty,
    commitsPresent: row.commitsPresent,
    cue: hold
      ? "sighted"
      : row.compareRefUnreachable || verdict === "compare-ref-unreachable"
        ? "compare-ref-unreachable"
        : "blindsided",
    event: row.event,
    t: row.t,
    phrase: hold ? "admit sighted" : "score blindside",
    worktreeInspect: worktree,
    paneInspect: pane,
    commitsInspect: commits,
    compareInspect: compare,
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
      : BLINDSIDE_WALK;
  const scored = rows.map((row) => ({
    ...normalizeBooth(row),
    ...scoreGate({ ...row, preferSeed: false }),
  }));
  const dead = scored.filter(
    (row) => row.verdict === "blindside" || row.verdict === "blindsided",
  );
  const path = scored.filter((row) => row.verdict === "compare-ref-unreachable");
  const sighted = scored.filter((row) => row.verdict === "sighted");
  const headline =
    scored.find((row) => row.event === "blindsided") ||
    scored.find((row) => row.event === "compare-ref-unreachable") ||
    scored.find((row) => row.event === "pane-empty") ||
    dead[dead.length - 1];
  let verdict = "sighted";
  if (dead.length) verdict = "blindside";
  else if (path.length && !sighted.length) verdict = "compare-ref-unreachable";
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
    blindsidedCount: dead.length,
    pathCount: path.length,
    sightedCount: sighted.length,
    headline,
    rows: scored,
    phrase: HOLD.includes(verdict) ? "admit sighted" : "score blindside",
    note: headline
      ? "Diff pane rooted to session cwd cannot see committed work in .claude/worktrees/; compare ref is unreachable; cousins are undisclosed-base / uncommitted-diff, not this compare-side gap."
      : "published blindside walk scored against sighted vs blindsided",
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
    seeded !== "sighted" &&
    seeded !== "blindsided" &&
    seeded !== "compare-ref-unreachable" &&
    seeded !== "blindside" &&
    ticket.sighted == null &&
    ticket.blindsided == null &&
    ticket.compareRefUnreachable == null &&
    ticket.paneEmpty == null &&
    ticket.commitsPresent == null &&
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
    sighted: scored.sighted ?? false,
    blindsided: scored.blindsided ?? false,
    compareRefUnreachable: scored.compareRefUnreachable ?? false,
    worktreeOwned: scored.worktreeOwned ?? false,
    paneEmpty: scored.paneEmpty ?? false,
    commitsPresent: scored.commitsPresent ?? false,
  };
}

export function score(input) {
  return analyze(input).verdict;
}

export function fingerprint(input) {
  const result = analyze(input);
  return [
    result.verdict,
    result.worktreeOwned || result.blindsided ? "worktree=owned" : "worktree=listed",
    result.paneEmpty || result.blindsided ? "pane=empty" : "pane=sees",
    result.commitsPresent || result.blindsided ? "commits=present" : "commits=visible",
    result.compareRefUnreachable || result.blindsided ? "compare=unreachable" : "compare=reachable",
    result.compareRefUnreachable || result.verdict === "compare-ref-unreachable"
      ? "path=compare-ref-unreachable"
      : "path=sighted",
    result.cue === "sighted"
      ? "cue=sighted"
      : result.cue === "compare-ref-unreachable"
        ? "cue=compare-ref-unreachable"
        : "cue=blindsided",
  ].join("|");
}

export function handle(input) {
  const result = analyze(input);
  const booth = readBooth({
    sighted: result.sighted,
    blindsided: result.blindsided,
    compareRefUnreachable: result.compareRefUnreachable,
    worktreeOwned: result.worktreeOwned,
    paneEmpty: result.paneEmpty,
    commitsPresent: result.commitsPresent,
    worktree: input && input.worktree,
    pane: input && input.pane,
    commits: input && input.commits,
    compare: input && input.compare,
    log: input && input.log,
  });
  return {
    ...result,
    fingerprint: fingerprint(input),
    booth,
    worktree: inspectWorktreeOwned({
      sighted: result.sighted,
      blindsided: result.blindsided,
      worktreeOwned: result.worktreeOwned,
      worktree: input && input.worktree,
    }),
    pane: inspectPaneEmpty({
      sighted: result.sighted,
      blindsided: result.blindsided,
      paneEmpty: result.paneEmpty,
      pane: input && input.pane,
    }),
    commits: inspectCommitsPresent({
      sighted: result.sighted,
      blindsided: result.blindsided,
      commitsPresent: result.commitsPresent,
      commits: input && input.commits,
    }),
    compare: inspectCompareRef({
      sighted: result.sighted,
      blindsided: result.blindsided,
      compareRefUnreachable: result.compareRefUnreachable,
      compare: input && input.compare,
    }),
    stations: BOOTH_STATIONS.map((row) => ({
      ...row,
      blindsided:
        result.blindsided === true ||
        result.verdict === "blindsided" ||
        result.verdict === "blindside",
    })),
    published: {
      issue: FEATURED_ISSUE,
      url: ISSUE_URL,
      title: TITLE,
      state: STATE,
      labels: [...LABELS],
      platform: PLATFORM,
      claudeVersion: CLAUDE_VERSION,
      goodVersion: GOOD_VERSION,
      surface: SURFACE,
      host: HOST,
      installPath: INSTALL_PATH,
      command: COMMAND,
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
        "NON-BINDING: the diff pane is rooted to session cwd and exposes base selection but not compare-ref / owned-worktree selection, so committed work in `.claude/worktrees/*` is unreachable. Invite verify against #93786 text only. Do not claim a root cause in Claude Code source you have not seen.",
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
