#!/usr/bin/env node
/**
 * Monadnock — geological monadnock / residual mountain / trig survey booth.
 *
 * Educational diagnostic model for a published Claude Code defect:
 * Desktop-app worktree session rooted INSIDE a git submodule branches
 * from the nested repo's local `main` instead of
 * `refs/remotes/origin/main`, and does not fetch first. If local main
 * is behind, the session silently starts on old code. Measured: a
 * session started on a month-old base, 204 commits behind origin/main.
 * CLI does not have this problem (even on older 2.1.220). The same
 * desktop app is correct when the session is rooted at the superproject.
 * Reflog spelling differs: desktop records a raw SHA; CLI records a
 * ref name. worktree.baseRef is unset everywhere, so the documented
 * `fresh` default should apply (branch from origin/<default-branch>,
 * fetching first if not fetched in 24h). Expected: Created from
 * refs/remotes/origin/main.
 *
 *   node monadnock.mjs data/residual.json
 *   echo '{"seed":"residual"}' | node monadnock.mjs
 *
 * Idle word is fresh (HOLD: worktree branched from origin/main after
 * fetch; nested submodule same as superproject).
 * Seeded word is residual (#93703 — local main left standing; no fetch;
 * raw SHA base).
 * Path word is submodule-base.
 * Product score word is monadnock (Score monadnock or admit fresh.).
 *
 * Encoded from anthropics/claude-code#93703 issue text only.
 * Hypothesis (NON-BINDING): desktop worktree base resolution may take
 * the nested repo's local default-branch tip (or a raw SHA) instead of
 * the fresh origin/<default> path used at superproject root / CLI.
 * Verify against #93703 text only. Do NOT claim a root cause in Claude
 * Code source you have not seen. Do NOT implement a fix. No network.
 * No exploits. No live Claude. No secrets.
 */

/* Browser-safe: no top-level node: imports. CLI I/O is loaded only in main(). */

export const VERDICTS = Object.freeze([
  "fresh",
  "residual",
  "monadnock",
  "submodule-base",
  "hold",
  "fetch-first",
  "origin-main",
  "local-main",
  "nested-repo",
  "superproject-ok",
  "raw-sha",
  "ref-name",
  "behind-204",
  "has-repro",
  "cousins",
  "backups",
  "fixtures",
  "chips",
  "fingerprints",
  "walk",
]);

export const IDLE_WORD = "fresh";
export const PATH_WORD = "submodule-base";
export const SEEDED_WORD = "residual";
export const PRODUCT_WORD = "monadnock";
export const HOLD = Object.freeze(["fresh", "hold"]);
export const RECOVER = Object.freeze(["fresh", "hold"]);
export const ALARM = Object.freeze(
  VERDICTS.filter((name) => !HOLD.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FORBIDDEN_IDLE = Object.freeze([
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
]);
export const FORBIDDEN_SEED = Object.freeze(
  FORBIDDEN_IDLE.filter((name) => name !== "residual" && name !== "monadnock"),
);

export const FEATURED_ISSUE = 93703;
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/93703";
export const TITLE =
  "Worktree branched from local `main` instead of `origin/main` when the session is rooted inside a git submodule (desktop app)";
export const STATE = "OPEN";
export const LABELS = Object.freeze([
  "bug",
  "has repro",
  "platform:macos",
  "area:desktop",
]);
export const PLATFORM = "macos";
export const DESKTOP_VERSION = "2.1.260";
export const CLI_VERSION = "2.1.220";
export const BEHIND_COUNT = 204;
export const LOCAL_MAIN_DATE = "2026-08-10";
export const ORIGIN_MAIN_SHORT = "a8cef9307a";
export const LOCAL_MAIN_SHORT = "f84446c12d";
export const HEAD_SHORT = "446c96d749";
export const LOCAL_MAIN_SHA = "f84446c12d9b6ddee03a4d739bd5f56ce6b90fc4";
export const REFLOG_DESKTOP = `branch: Created from ${LOCAL_MAIN_SHA}`;
export const REFLOG_CLI = "branch: Created from origin/main";
export const REFLOG_SUPER = "branch: Created from refs/remotes/origin/main";
export const EXPECTED_LINE = "Created from refs/remotes/origin/main";
export const PHRASE = "Score monadnock or admit fresh.";
export const DISTRIBUTION =
  "Desktop app 2.1.260 worktree session rooted inside a git submodule branches from local main instead of refs/remotes/origin/main and does not fetch first. Measured: month-old base, 204 commits behind origin/main (local main f84446c12d dated 2026-08-10; origin/main a8cef9307a). CLI 2.1.220 from the same directory records Created from origin/main. Same desktop app rooted at the superproject records Created from refs/remotes/origin/main. Desktop nested reflog records a raw SHA; CLI records a ref name. worktree.baseRef unset; documented fresh default should apply. Expected: Created from refs/remotes/origin/main.";
export const SESSION_KIND =
  "Desktop app 2.1.260 session rooted inside a git submodule. Worktree branched from local main f84446c12d (204 commits behind origin/main, dated 2026-08-10), recorded as raw SHA f84446c12d9b6ddee03a4d739bd5f56ce6b90fc4. No fetch first. CLI 2.1.220 from the same directory is correct.";
export const RULED_OUT = Object.freeze([
  "CLI surface (2.1.220 from the same submodule directory is correct)",
  "desktop app rooted at the superproject (records refs/remotes/origin/main)",
  "worktree.baseRef override (unset everywhere; documented fresh default should apply)",
  "missing-local-main fallback (local main already existed at f84446c12d)",
]);
export const EXPECTED = Object.freeze([
  "Created from refs/remotes/origin/main",
  "matching the documented fresh default",
  "matching what the same app does when rooted at the superproject",
  "fetch first if not fetched in 24h",
]);

export const SURVEY_PLAQUES = Object.freeze([
  { id: "behind", label: "behind origin/main", count: 204, note: "commits" },
  { id: "month", label: "local main date", count: "2026-08-10", note: "month-old base" },
  { id: "desktop", label: "desktop nested", count: "raw SHA", note: "f84446c12d…" },
  { id: "cli", label: "CLI same cwd", count: "ref name", note: "origin/main" },
]);

export const BOOTH_STATIONS = Object.freeze([
  {
    id: "cairn",
    survey: "read the trig cairn (worktree should branch from origin/main after fetch)",
    kind: "cairn",
    note: "seeded: cairn marks residual local main — isolated peak left standing",
  },
  {
    id: "residual-peak",
    survey: "sight the residual peak (local main should not stand as the base)",
    kind: "residual-peak",
    note: "seeded: residual peak stands — local main f84446c12d, 204 commits behind",
  },
  {
    id: "nested-massif",
    survey: "survey the nested massif (submodule cwd should use the same origin/<default> path as the superproject)",
    kind: "nested-massif",
    note: "seeded: nested massif only — superproject root is correct",
  },
  {
    id: "fetch-sill",
    survey: "check the fetch sill (documented fresh default fetches first if not fetched in 24h)",
    kind: "fetch-sill",
    note: "seeded: fetch sill dry — desktop does not fetch first",
  },
  {
    id: "reflog-plate",
    survey: "read the reflog plate (should record a ref name, not a raw SHA)",
    kind: "reflog-plate",
    note: "seeded: plate spells a raw SHA; CLI spells origin/main",
  },
]);

export const FINGERPRINT_LINES = Object.freeze([
  "submodule-base",
  "residual",
  "local-main",
  "nested-repo",
  "raw-sha",
  "behind-204",
  "fetch-first",
  "origin-main",
]);

export const COUSINS = Object.freeze([
  {
    issue: 93231,
    title: "Session exit on VS Code window close never releases its git worktree lock",
    state: "OPEN",
    citeOnly: true,
    product: "escheat",
    why: "Cite-only cousin — Escheat/#93231 worktree lock left naming a dead PID. Different defect (lock release, not base-ref). Do not rebuild",
  },
  {
    issue: 93193,
    title: "Bash sandbox for isolation:worktree false-blocks on substring git",
    state: "OPEN",
    citeOnly: true,
    product: "mondegreen",
    why: "Cite-only cousin — Mondegreen/#93193 worktree-isolation Bash tokenization. Different defect. Do not rebuild",
  },
  {
    issue: 93081,
    title: "Orphaned worktree entry is retried every 30 minutes forever",
    state: "OPEN",
    citeOnly: true,
    product: "midden",
    why: "Cite-only cousin — Midden/#93081 worktree remove/GC refuse loop. Different defect. Do not rebuild",
  },
  {
    issue: 93010,
    title: "CLAUDE.md above a git worktree is not loaded when that directory holds the repository",
    state: "OPEN",
    citeOnly: true,
    product: "entresol",
    why: "Cite-only cousin — Entresol/#93010 parent CLAUDE.md bypassed for worktree child. Different defect. Do not rebuild",
  },
]);

export const BACKUPS = Object.freeze([
  {
    issue: 93722,
    title: "worktree connector disable-list (umbilical-candidate)",
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
  {
    issue: 93735,
    title: "Project-scope effortLevel in .claude/settings.json is never applied in desktop-app Code tab sessions",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
  {
    issue: 93733,
    title: "Agent re-submits a byte-identical rejected tool call 5x while prose claims the fix was applied",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
]);

export const NOT_PRODUCTS = Object.freeze([
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
  "sluice",
  "spillway",
  "leat",
  "portcullis",
  "postern",
  "embrasure",
  "wicket",
  "gnomon",
  "almanac",
  "clepsydra",
  "escheat",
  "mondegreen",
  "midden",
  "entresol",
  "caisson",
]);

export const SAMPLE_CAIRN = Object.freeze({
  originMain: false,
  residual: true,
});

export const SAMPLE_FRESH_CAIRN = Object.freeze({
  originMain: true,
  residual: false,
});

export const SAMPLE_PEAK = Object.freeze({
  localMain: true,
  behind: 204,
  standing: true,
});

export const SAMPLE_FRESH_PEAK = Object.freeze({
  localMain: false,
  behind: 0,
  standing: false,
});

export const SAMPLE_MASSIF = Object.freeze({
  nested: true,
  superprojectOk: true,
});

export const SAMPLE_FRESH_MASSIF = Object.freeze({
  nested: false,
  superprojectOk: true,
});

export const SAMPLE_SILL = Object.freeze({
  fetched: false,
  dry: true,
});

export const SAMPLE_FRESH_SILL = Object.freeze({
  fetched: true,
  dry: false,
});

export const SAMPLE_PLATE = Object.freeze({
  rawSha: true,
  refName: false,
  sha: LOCAL_MAIN_SHA,
});

export const SAMPLE_FRESH_PLATE = Object.freeze({
  rawSha: false,
  refName: true,
  sha: null,
});

export const SAMPLE_WALK_LOG = Object.freeze([
  { t: "idle", line: "worktree branched from origin/main after fetch; nested submodule same as superproject" },
  { t: "origin", line: "cairn marks refs/remotes/origin/main — documented fresh default" },
  { t: "fetch", line: "fetch first if not fetched in 24h" },
  { t: "super", line: "same desktop app rooted at the superproject records refs/remotes/origin/main" },
  { t: "nested", line: "session rooted inside a git submodule — isolated massif" },
  { t: "local", line: "desktop branches from local main instead of origin/main" },
  { t: "dry", line: "does not fetch first" },
  { t: "behind", line: "month-old base · 204 commits behind origin/main · dated 2026-08-10" },
  { t: "sha", line: "desktop records raw SHA f84446c12d9b6ddee03a4d739bd5f56ce6b90fc4" },
  { t: "ref", line: "CLI from the same directory records Created from origin/main" },
  { t: "path", line: "submodule-base — nested-repo worktree takes local main, not origin/main" },
  { t: "score", line: "when the residual peak stands the booth is a monadnock — Score monadnock or admit fresh." },
]);

export function inspectCairn(input = {}) {
  const cairn =
    input.cairn && typeof input.cairn === "object"
      ? input.cairn
      : input.fresh === true && input.residual !== true
        ? SAMPLE_FRESH_CAIRN
        : SAMPLE_CAIRN;
  const forcedResidual =
    input.residual === true ||
    input.localMain === true ||
    input.event === "residual" ||
    input.event === "monadnock" ||
    input.event === "local-main" ||
    input.submoduleBase === true;
  const residual = forcedResidual ? true : cairn.residual === true && input.fresh !== true;
  return {
    originMain: !residual,
    residual,
    stamp: residual ? "residual" : "origin",
    note: residual
      ? "trig cairn marks residual local main — isolated peak left standing"
      : "trig cairn marks origin/main after fetch",
  };
}

export function inspectResidualPeak(input = {}) {
  const peak =
    input.peak && typeof input.peak === "object"
      ? input.peak
      : input.fresh === true && input.residual !== true
        ? SAMPLE_FRESH_PEAK
        : SAMPLE_PEAK;
  const forcedStanding =
    input.behind204 === true ||
    input.event === "behind-204" ||
    input.localMain === true ||
    (input.residual === true && input.fresh !== true);
  const standing = forcedStanding ? true : peak.standing === true;
  return {
    localMain: standing,
    behind: standing ? peak.behind || BEHIND_COUNT : 0,
    standing,
    stamp: standing ? "standing" : "leveled",
    note: standing
      ? "residual peak stands — local main f84446c12d, 204 commits behind"
      : "residual peak is gone — base is origin/main",
  };
}

export function inspectNestedMassif(input = {}) {
  const massif =
    input.massif && typeof input.massif === "object"
      ? input.massif
      : input.fresh === true && input.residual !== true
        ? SAMPLE_FRESH_MASSIF
        : SAMPLE_MASSIF;
  const forcedNested =
    input.nestedRepo === true ||
    input.event === "nested-repo" ||
    input.submoduleBase === true ||
    (input.residual === true && input.fresh !== true);
  const nested = forcedNested ? true : massif.nested === true;
  return {
    nested,
    superprojectOk: true,
    stamp: nested ? "nested" : "range",
    note: nested
      ? "nested massif only — superproject root is correct; submodule cwd is residual"
      : "survey station sits on the same origin/<default> path as the superproject",
  };
}

export function inspectFetchSill(input = {}) {
  const sill =
    input.sill && typeof input.sill === "object"
      ? input.sill
      : input.fresh === true && input.residual !== true
        ? SAMPLE_FRESH_SILL
        : SAMPLE_SILL;
  const forcedDry =
    input.event === "fetch-first" && input.residual === true
      ? true
      : input.submoduleBase === true ||
        (input.residual === true && input.fresh !== true && input.fetchFirst !== true);
  const dry = forcedDry ? true : sill.dry === true && input.fetchFirst !== true && input.fresh !== true;
  return {
    fetched: !dry,
    dry,
    stamp: dry ? "dry" : "wet",
    note: dry
      ? "fetch sill dry — desktop does not fetch first"
      : "fetch sill wet — documented fresh default fetched first",
  };
}

export function inspectReflogPlate(input = {}) {
  const plate =
    input.plate && typeof input.plate === "object"
      ? input.plate
      : input.fresh === true && input.residual !== true
        ? SAMPLE_FRESH_PLATE
        : SAMPLE_PLATE;
  const forcedRaw =
    input.rawSha === true ||
    input.event === "raw-sha" ||
    input.event === "submodule-base" ||
    input.submoduleBase === true ||
    (input.residual === true && input.fresh !== true);
  const rawSha = forcedRaw ? true : plate.rawSha === true;
  return {
    rawSha,
    refName: !rawSha,
    sha: rawSha ? LOCAL_MAIN_SHA : null,
    stamp: rawSha ? "raw-sha" : "ref-name",
    note: rawSha
      ? "plate spells a raw SHA; CLI spells origin/main"
      : "plate spells a ref name — Created from origin/main",
  };
}

export function readBooth(input = {}) {
  const cairn = inspectCairn(input);
  const peak = inspectResidualPeak(input);
  const massif = inspectNestedMassif(input);
  const sill = inspectFetchSill(input);
  const plate = inspectReflogPlate(input);
  const residual =
    input.fresh !== true &&
    ((cairn.residual && peak.standing) ||
      (massif.nested && sill.dry) ||
      input.residual === true);
  const fresh = input.fresh === true && residual !== true && !cairn.residual;
  const path =
    massif.nested &&
    (input.event === "submodule-base" || input.submoduleBase === true);
  return {
    cairn,
    peak,
    massif,
    sill,
    plate,
    plaques: SURVEY_PLAQUES,
    stations: BOOTH_STATIONS,
    residual: residual && !fresh && !path,
    fresh:
      fresh ||
      (!cairn.residual &&
        !peak.standing &&
        input.residual !== true &&
        input.submoduleBase !== true),
    submoduleBase: path && !fresh,
    mark:
      path && !fresh
        ? "submodule-base"
        : residual && !fresh
          ? "residual"
          : "fresh",
  };
}

/**
 * Published monadnock walk from #93703 only. Facts from the issue text.
 * A fresh booth branches from origin/main after fetch; nested matches superproject.
 * A residual booth takes local main, skips fetch, and records a raw SHA.
 * A submodule-base booth names the nested-repo worktree base path.
 */
export const MONADNOCK_WALK = Object.freeze([
  {
    t: "idle",
    event: "cue-fresh",
    fresh: true,
    residual: false,
    cue: "fresh",
    note: "idle HOLD: worktree branched from origin/main after fetch; nested submodule same as superproject",
  },
  {
    t: "origin",
    event: "origin-main",
    fresh: true,
    originMain: true,
    cue: "fresh",
    note: "cairn marks refs/remotes/origin/main — documented fresh default",
  },
  {
    t: "fetch",
    event: "fetch-first",
    fresh: true,
    fetchFirst: true,
    cue: "fresh",
    note: "fetch first if not fetched in 24h",
  },
  {
    t: "super",
    event: "superproject-ok",
    fresh: true,
    superprojectOk: true,
    cue: "fresh",
    note: "same desktop app rooted at the superproject records refs/remotes/origin/main",
  },
  {
    t: "nested",
    event: "nested-repo",
    residual: true,
    nestedRepo: true,
    cue: "residual",
    note: "session rooted inside a git submodule — isolated massif",
  },
  {
    t: "local",
    event: "local-main",
    residual: true,
    localMain: true,
    cue: "residual",
    note: "desktop branches from local main instead of origin/main",
  },
  {
    t: "behind",
    event: "behind-204",
    residual: true,
    behind204: true,
    cue: "residual",
    note: "month-old base · 204 commits behind origin/main · dated 2026-08-10",
  },
  {
    t: "sha",
    event: "raw-sha",
    residual: true,
    rawSha: true,
    cue: "residual",
    note: "desktop records raw SHA f84446c12d9b6ddee03a4d739bd5f56ce6b90fc4",
  },
  {
    t: "ref",
    event: "ref-name",
    residual: true,
    refName: true,
    cue: "residual",
    note: "CLI from the same directory records Created from origin/main",
  },
  {
    t: "path",
    event: "submodule-base",
    residual: true,
    submoduleBase: true,
    nestedRepo: true,
    localMain: true,
    cue: "residual",
    note: "submodule-base — nested-repo worktree takes local main, not origin/main",
  },
  {
    t: "score",
    event: "monadnock",
    residual: true,
    localMain: true,
    nestedRepo: true,
    rawSha: true,
    behind204: true,
    submoduleBase: true,
    cue: "residual",
    note: "monadnock — when the residual peak stands the booth never stays fresh",
  },
]);

export const POSITIVE_CONTROL_WALK = Object.freeze([
  {
    t: "hold",
    event: "origin-main",
    fresh: true,
    originMain: true,
    cue: "fresh",
    note: "positive control: worktree branched from origin/main after fetch",
  },
  {
    t: "super",
    event: "cue-fresh",
    fresh: true,
    cue: "fresh",
    note: "positive control: nested submodule uses the same origin/<default> path as the superproject",
  },
]);

function classifyFromSeed(seed) {
  if (seed && VERDICTS.includes(seed)) return seed;
  return null;
}

export function emptyTicket() {
  return {
    seed: IDLE_WORD,
    fresh: true,
    residual: false,
    originMain: true,
    cue: "fresh",
  };
}

export function seedFresh() {
  return { ...emptyTicket() };
}

export function seedResidual() {
  return {
    seed: SEEDED_WORD,
    fresh: false,
    residual: true,
    localMain: true,
    nestedRepo: true,
    rawSha: true,
    behind204: true,
    submoduleBase: true,
    cue: "residual",
    issue: FEATURED_ISSUE,
    cairn: SAMPLE_CAIRN,
    peak: SAMPLE_PEAK,
    massif: SAMPLE_MASSIF,
    sill: SAMPLE_SILL,
    plate: SAMPLE_PLATE,
  };
}

export function seedMonadnock() {
  return {
    seed: PRODUCT_WORD,
    preferSeed: true,
    residual: true,
    localMain: true,
    nestedRepo: true,
    rawSha: true,
    behind204: true,
    submoduleBase: true,
    cue: "residual",
  };
}

export function seedSubmoduleBase() {
  return {
    seed: PATH_WORD,
    preferSeed: true,
    residual: true,
    submoduleBase: true,
    nestedRepo: true,
    localMain: true,
    event: "submodule-base",
    cue: "residual",
  };
}

export function seedHold() {
  return {
    seed: "hold",
    preferSeed: true,
    fresh: true,
    cue: "fresh",
  };
}

export function seedLocalMain() {
  return {
    seed: "local-main",
    preferSeed: true,
    localMain: true,
    cue: "residual",
  };
}

export function seedNestedRepo() {
  return {
    seed: "nested-repo",
    preferSeed: true,
    nestedRepo: true,
    cue: "residual",
  };
}

export function seedRawSha() {
  return {
    seed: "raw-sha",
    preferSeed: true,
    rawSha: true,
    cue: "residual",
  };
}

export function seedFetchFirst() {
  return {
    seed: "fetch-first",
    preferSeed: true,
    fetchFirst: true,
    cue: "fresh",
  };
}

export function seedOriginMain() {
  return {
    seed: "origin-main",
    preferSeed: true,
    originMain: true,
    cue: "fresh",
  };
}

export function seedSuperprojectOk() {
  return {
    seed: "superproject-ok",
    preferSeed: true,
    superprojectOk: true,
    cue: "fresh",
  };
}

export function seedRefName() {
  return {
    seed: "ref-name",
    preferSeed: true,
    refName: true,
    cue: "fresh",
  };
}

export function seedBehind204() {
  return {
    seed: "behind-204",
    preferSeed: true,
    behind204: true,
    cue: "residual",
  };
}

export function normalizeBooth(raw) {
  if (!raw || typeof raw !== "object") {
    return {
      fresh: false,
      residual: false,
      submoduleBase: false,
      localMain: false,
      nestedRepo: false,
      rawSha: false,
      behind204: false,
      fetchFirst: false,
      originMain: false,
      superprojectOk: false,
      refName: false,
      cue: null,
      event: null,
      t: null,
    };
  }
  return {
    fresh: raw.fresh === true,
    residual:
      raw.residual === true ||
      raw.event === "residual" ||
      raw.event === "monadnock",
    submoduleBase:
      raw.submoduleBase === true || raw.event === "submodule-base",
    localMain: raw.localMain === true || raw.event === "local-main",
    nestedRepo: raw.nestedRepo === true || raw.event === "nested-repo",
    rawSha: raw.rawSha === true || raw.event === "raw-sha",
    behind204: raw.behind204 === true || raw.event === "behind-204",
    fetchFirst: raw.fetchFirst === true || raw.event === "fetch-first",
    originMain: raw.originMain === true || raw.event === "origin-main",
    superprojectOk:
      raw.superprojectOk === true || raw.event === "superproject-ok",
    refName: raw.refName === true || raw.event === "ref-name",
    cue: raw.cue || null,
    event: raw.event || raw.kind || null,
    t: raw.t || raw.time || null,
    cairn: raw.cairn,
    peak: raw.peak,
    massif: raw.massif,
    sill: raw.sill,
    plate: raw.plate,
    log: raw.log,
  };
}

function hasBoothFields(ticket) {
  return Boolean(
    ticket &&
      (ticket.fresh != null ||
        ticket.residual != null ||
        ticket.submoduleBase != null ||
        ticket.localMain != null ||
        ticket.nestedRepo != null ||
        ticket.cue != null ||
        ticket.event ||
        ticket.cairn ||
        ticket.peak ||
        ticket.massif),
  );
}

function isFresh(row) {
  if (row.residual && row.cue !== "fresh") return false;
  if (
    row.cue === "residual" ||
    row.cue === "monadnock" ||
    row.cue === "submodule-base"
  ) {
    return false;
  }
  if (
    row.localMain &&
    row.nestedRepo &&
    row.cue !== "fresh" &&
    row.fresh !== true
  ) {
    return false;
  }
  if (
    row.submoduleBase &&
    row.localMain &&
    row.cue !== "fresh" &&
    row.fresh !== true
  ) {
    return false;
  }
  if (row.fresh === true && row.residual !== true && row.cue !== "residual") {
    return true;
  }
  if (
    row.cue === "fresh" &&
    row.residual !== true &&
    row.localMain !== true &&
    row.submoduleBase !== true
  ) {
    return true;
  }
  if (
    (row.originMain === true || row.fetchFirst === true || row.superprojectOk === true) &&
    row.residual !== true &&
    row.localMain !== true &&
    row.nestedRepo !== true &&
    row.rawSha !== true &&
    row.submoduleBase !== true
  ) {
    return true;
  }
  return false;
}

function isSubmoduleBasePath(row) {
  return (
    row.event === "submodule-base" &&
    !isFresh(row) &&
    (row.submoduleBase === true ||
      row.localMain === true ||
      row.nestedRepo === true)
  );
}

function isResidual(row) {
  if (isFresh(row)) return false;
  if (isSubmoduleBasePath(row) && row.cue !== "residual") return false;
  if (row.cue === "residual" || row.cue === "monadnock") return true;
  if (row.residual === true) return true;
  if (
    row.localMain === true &&
    row.nestedRepo === true &&
    row.rawSha === true
  ) {
    return true;
  }
  if (row.localMain === true && row.nestedRepo === true) {
    return true;
  }
  if (
    row.localMain === true ||
    row.nestedRepo === true ||
    row.rawSha === true ||
    row.behind204 === true ||
    (row.submoduleBase === true && row.rawSha === true)
  ) {
    return true;
  }
  return false;
}

/**
 * Score one monadnock pass against the trig survey station.
 * fresh: worktree branched from origin/main after fetch; nested same as superproject.
 * residual / monadnock: local main left standing; no fetch; raw SHA base.
 * submodule-base: nested-repo worktree takes local main, not origin/main.
 */
export function scoreGate(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const row = normalizeBooth(ticket);
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);

  let verdict = IDLE_WORD;
  if (
    isSubmoduleBasePath(row) ||
    (row.submoduleBase && ticket.preferSeed && seeded === PATH_WORD)
  ) {
    verdict = "submodule-base";
  } else if (isResidual(row)) {
    verdict = "monadnock";
  } else if (isFresh(row)) {
    verdict = "fresh";
  } else if (
    row.localMain ||
    row.nestedRepo ||
    row.rawSha ||
    (row.submoduleBase && !row.originMain)
  ) {
    verdict = "monadnock";
  }

  if (seeded && (!hasBoothFields(ticket) || ticket.preferSeed === true)) {
    verdict = seeded;
  }

  const hold = HOLD.includes(verdict);
  const cairn = inspectCairn(row);
  const peak = inspectResidualPeak(row);
  const massif = inspectNestedMassif(row);
  const sill = inspectFetchSill(row);
  const plate = inspectReflogPlate(row);
  return {
    verdict,
    idleWord: IDLE_WORD,
    pathWord: PATH_WORD,
    seededWord: SEEDED_WORD,
    productWord: PRODUCT_WORD,
    hold,
    alarm: !hold,
    recover: RECOVER.includes(verdict),
    fresh: verdict === "fresh" || verdict === "hold",
    residual:
      verdict === "residual" ||
      verdict === SEEDED_WORD ||
      verdict === PRODUCT_WORD,
    submoduleBase:
      row.submoduleBase === true ||
      verdict === "submodule-base" ||
      verdict === PATH_WORD,
    localMain: row.localMain,
    nestedRepo: row.nestedRepo,
    rawSha: row.rawSha,
    behind204: row.behind204,
    fetchFirst: row.fetchFirst,
    originMain: row.originMain,
    superprojectOk: row.superprojectOk,
    refName: row.refName,
    cue: hold
      ? "fresh"
      : row.submoduleBase || verdict === "submodule-base"
        ? "submodule-base"
        : "residual",
    event: row.event,
    t: row.t,
    phrase: hold ? "admit fresh" : "score monadnock",
    cairnInspect: cairn,
    peakInspect: peak,
    massifInspect: massif,
    sillInspect: sill,
    plateInspect: plate,
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
      : MONADNOCK_WALK;
  const scored = rows.map((row) => ({
    ...normalizeBooth(row),
    ...scoreGate({ ...row, preferSeed: false }),
  }));
  const residual = scored.filter(
    (row) => row.verdict === "monadnock" || row.verdict === "residual",
  );
  const path = scored.filter((row) => row.verdict === "submodule-base");
  const fresh = scored.filter((row) => row.verdict === "fresh");
  const headline =
    scored.find((row) => row.event === "residual") ||
    scored.find((row) => row.event === "submodule-base") ||
    scored.find((row) => row.event === "local-main") ||
    residual[residual.length - 1];
  let verdict = "fresh";
  if (residual.length) verdict = "monadnock";
  else if (path.length && !fresh.length) verdict = "submodule-base";
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
    residualCount: residual.length,
    pathCount: path.length,
    freshCount: fresh.length,
    headline,
    rows: scored,
    phrase: HOLD.includes(verdict) ? "admit fresh" : "score monadnock",
    note: headline
      ? "desktop nested worktree from local main; 204 commits behind; no fetch; raw SHA base; CLI and superproject correct."
      : "published monadnock walk scored against fresh vs residual",
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
    seeded !== "fresh" &&
    seeded !== "residual" &&
    seeded !== "submodule-base" &&
    seeded !== "monadnock" &&
    ticket.fresh == null &&
    ticket.residual == null &&
    ticket.localMain == null &&
    ticket.submoduleBase == null &&
    ticket.nestedRepo == null &&
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
    fresh: scored.fresh ?? false,
    residual: scored.residual ?? false,
    submoduleBase: scored.submoduleBase ?? false,
    localMain: scored.localMain ?? false,
    nestedRepo: scored.nestedRepo ?? false,
    rawSha: scored.rawSha ?? false,
    behind204: scored.behind204 ?? false,
    fetchFirst: scored.fetchFirst ?? false,
    originMain: scored.originMain ?? false,
    superprojectOk: scored.superprojectOk ?? false,
    refName: scored.refName ?? false,
  };
}

export function score(input) {
  return analyze(input).verdict;
}

export function fingerprint(input) {
  const result = analyze(input);
  return [
    result.verdict,
    result.fresh && !result.residual ? "cairn=origin" : "cairn=residual",
    result.behind204 || result.residual ? "peak=standing" : "peak=leveled",
    result.nestedRepo || result.residual ? "massif=nested" : "massif=range",
    result.residual && !result.fetchFirst ? "sill=dry" : "sill=wet",
    result.rawSha || result.residual ? "plate=raw-sha" : "plate=ref-name",
    result.submoduleBase || result.verdict === "submodule-base"
      ? "path=submodule-base"
      : "path=fresh",
    result.cue === "fresh"
      ? "cue=fresh"
      : result.cue === "submodule-base"
        ? "cue=submodule-base"
        : "cue=residual",
  ].join("|");
}

export function handle(input) {
  const result = analyze(input);
  const booth = readBooth({
    fresh: result.fresh,
    residual: result.residual,
    submoduleBase: result.submoduleBase,
    localMain: result.localMain,
    nestedRepo: result.nestedRepo,
    rawSha: result.rawSha,
    behind204: result.behind204,
    fetchFirst: result.fetchFirst,
    originMain: result.originMain,
    superprojectOk: result.superprojectOk,
    refName: result.refName,
    cairn: input && input.cairn,
    peak: input && input.peak,
    massif: input && input.massif,
    sill: input && input.sill,
    plate: input && input.plate,
    log: input && input.log,
  });
  return {
    ...result,
    fingerprint: fingerprint(input),
    booth,
    cairn: inspectCairn({
      fresh: result.fresh,
      residual: result.residual,
      localMain: result.localMain,
      submoduleBase: result.submoduleBase,
      cairn: input && input.cairn,
    }),
    peak: inspectResidualPeak({
      fresh: result.fresh,
      residual: result.residual,
      behind204: result.behind204,
      localMain: result.localMain,
      peak: input && input.peak,
    }),
    massif: inspectNestedMassif({
      fresh: result.fresh,
      residual: result.residual,
      nestedRepo: result.nestedRepo,
      submoduleBase: result.submoduleBase,
      massif: input && input.massif,
    }),
    sill: inspectFetchSill({
      fresh: result.fresh,
      residual: result.residual,
      fetchFirst: result.fetchFirst,
      submoduleBase: result.submoduleBase,
      sill: input && input.sill,
    }),
    plate: inspectReflogPlate({
      fresh: result.fresh,
      residual: result.residual,
      rawSha: result.rawSha,
      submoduleBase: result.submoduleBase,
      plate: input && input.plate,
    }),
    stations: BOOTH_STATIONS.map((row) => ({
      ...row,
      residual:
        result.residual === true ||
        result.verdict === "residual" ||
        result.verdict === "monadnock",
    })),
    published: {
      issue: FEATURED_ISSUE,
      url: ISSUE_URL,
      title: TITLE,
      state: STATE,
      labels: [...LABELS],
      platform: PLATFORM,
      desktopVersion: DESKTOP_VERSION,
      cliVersion: CLI_VERSION,
      behindCount: BEHIND_COUNT,
      localMainDate: LOCAL_MAIN_DATE,
      originMainShort: ORIGIN_MAIN_SHORT,
      localMainShort: LOCAL_MAIN_SHORT,
      headShort: HEAD_SHORT,
      localMainSha: LOCAL_MAIN_SHA,
      reflogDesktop: REFLOG_DESKTOP,
      reflogCli: REFLOG_CLI,
      reflogSuper: REFLOG_SUPER,
      expectedLine: EXPECTED_LINE,
      plaques: SURVEY_PLAQUES,
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
        "NON-BINDING: desktop worktree base resolution may take the nested repo's local default-branch tip (or a raw SHA) instead of the fresh origin/<default> path used at superproject root / CLI. Verify against #93703 text only. Do not claim a root cause in Claude Code source you have not seen.",
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
