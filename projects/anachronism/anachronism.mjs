#!/usr/bin/env node
/**
 * Anachronism — film continuity / slate chronometer booth.
 *
 * Educational diagnostic model for a published Claude Code defect:
 * A Claude Code on the web session (from desktop) comes up one commit
 * behind the remote tip of the named branch. Reflogs show the harness
 * DID re-fetch at session start and detached HEAD on the new tip, then
 * ran `git checkout <branch>`, which resolved to the LOCAL branch
 * created ~9 minutes earlier during container pre-warm — still pointing
 * at the OLD tip. In the same second `refs/remotes/origin/<branch>` was
 * rewritten back to the OLD sha, so `git status` reported up to date.
 * SessionStart hooks then ran against the stale checkout; a hook fix
 * pushed minutes earlier had no effect. Any push landing between
 * container preparation and session start is silently dropped.
 *
 *   node anachronism.mjs data/stale.json
 *   echo '{"seed":"stale"}' | node anachronism.mjs
 *
 * Idle word is tip (HOLD: HEAD at remote tip as of session start;
 * checkout -B / reset --hard onto FETCH_HEAD; SessionStart hooks see
 * the new commit).
 * Seeded word is stale (#93585 — pre-warm local branch wins after
 * fetch; remote-tracking ref rewritten to old sha; hooks run on stale
 * checkout).
 * Path word is prewarm-latch.
 * Product score word is anachronism (Score anachronism or admit tip.).
 *
 * Encoded from anthropics/claude-code#93585 issue text only.
 * Hypothesis (NON-BINDING): if a local branch exists from pre-warm,
 * force onto the fetched tip (`git checkout -B <branch> FETCH_HEAD`
 * or `reset --hard origin/<branch>`); the remote-tracking ref must
 * never be written back to a stale sha. Verify against #93585 text
 * only. Do NOT claim a root cause in Claude Code source you have not
 * seen. Do NOT implement a fix. No network. No exploits. No live
 * Claude. No secrets.
 */

/* Browser-safe: no top-level node: imports. CLI I/O is loaded only in main(). */

export const VERDICTS = Object.freeze([
  "tip",
  "stale",
  "anachronism",
  "prewarm-latch",
  "hold",
  "fetch-tip",
  "checkout-local",
  "remote-rewrite",
  "sessionstart-stale",
  "reflog-gap",
  "status-lie",
  "force-B",
  "detached-fetch",
  "prewarm-branch",
  "old-tip",
  "new-tip",
  "hook-miss",
  "silent-drop",
  "reset-hard",
  "never-rewrite",
  "one-behind",
  "web-session",
  "has-repro",
  "cousins",
  "backups",
  "fixtures",
  "chips",
  "fingerprints",
  "walk",
]);

export const IDLE_WORD = "tip";
export const PATH_WORD = "prewarm-latch";
export const SEEDED_WORD = "stale";
export const PRODUCT_WORD = "anachronism";
export const HOLD = Object.freeze(["tip", "hold"]);
export const RECOVER = Object.freeze(["tip", "hold"]);
export const ALARM = Object.freeze(
  VERDICTS.filter((name) => !HOLD.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FORBIDDEN_IDLE = Object.freeze([
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
  "counterfoil",
  "cachet",
  "forksink",
  "foxfire",
  "pentimento",
  "vinculum",
]);
export const FORBIDDEN_SEED = Object.freeze(
  FORBIDDEN_IDLE.filter(
    (name) => name !== "stale" && name !== "anachronism",
  ),
);

export const FEATURED_ISSUE = 93585;
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/93585";
export const TITLE =
  "Cloud session checks out stale local branch when a commit is pushed between container pre-warm and session start.";
export const STATE = "OPEN";
export const LABELS = Object.freeze([
  "bug",
  "has repro",
  "area:claude-code-web",
  "platform:web",
]);
export const PREWARM_CLOCK = "09:03";
export const SESSION_CLOCK = "09:12";
export const REFLOG_GAP_MINUTES = 9;
export const OLD_TIP = "9a03c01d";
export const NEW_TIP = "0912f37c";
export const BRANCH_NAME = "named-branch";
export const CHECKOUT_CMD = "git checkout named-branch";
export const FORCE_B_CMD = "git checkout -B named-branch FETCH_HEAD";
export const RESET_HARD_CMD = "git reset --hard origin/named-branch";
export const PHRASE = "Score anachronism or admit tip.";
export const DISTRIBUTION =
  "Claude Code on the web session from desktop. Container pre-warm creates a local named-branch at the then-tip. A push lands before session start. Harness re-fetches the new tip and detaches HEAD on it, then git checkout named-branch resolves the pre-warm local branch (old tip). refs/remotes/origin/named-branch is rewritten to the old sha in the same second so git status lies up to date.";
export const SESSION_KIND =
  "Web session from desktop. Pre-warm ~09:03 creates local named-branch at 9a03c01d. Push lands. Session start ~09:12 re-fetches 0912f37c (HEAD detached on it), then checkout named-branch returns to 9a03c01d. origin/named-branch rewritten to 9a03c01d. SessionStart hooks run on the stale checkout; a hook fix pushed minutes earlier has no effect.";

export const BOOTH_STATIONS = Object.freeze([
  {
    id: "slate",
    survey: "mark the continuity slate (session start should clap the fetched tip)",
    kind: "slate",
    note: "seeded: the slate says the tip was fetched; checkout still rolls the pre-warm take",
  },
  {
    id: "chronometer",
    survey: "read the darkroom chronometer (pre-warm 09:03 vs session 09:12)",
    kind: "chronometer",
    note: "seeded: nine minutes of wrong-era film left on the bench after pre-warm",
  },
  {
    id: "sprocket",
    survey: "walk the sprocket rail (detached FETCH_HEAD then checkout local)",
    kind: "sprocket",
    note: "seeded: harness DID re-fetch and detach on the new tip, then checkout named the local branch",
  },
  {
    id: "clocks",
    survey: "compare the dual clocks (pre-warm take vs session clap)",
    kind: "clocks",
    note: "seeded: any push between the two clocks is silently dropped from the checkout",
  },
  {
    id: "reflog",
    survey: "read the reflog strip (same-second rewrite of origin/<branch>)",
    kind: "reflog",
    note: "seeded: remote-tracking ref rewritten to the old sha so status lies up to date",
  },
]);

export const FINGERPRINT_LINES = Object.freeze([
  "prewarm-latch",
  "stale",
  "fetch-tip",
  "checkout-local",
  "remote-rewrite",
  "sessionstart-stale",
  "reflog-gap",
  "status-lie",
]);

export const COUSINS = Object.freeze([
  {
    issue: 82364,
    title: "cite-only cousin — EnterWorktree stale local main",
    state: "OPEN",
    citeOnly: true,
    why: "Cite-only cousin — EnterWorktree stale local main, not the cloud pre-warm vs session-start tip race. Do not rebuild",
  },
  {
    issue: 53025,
    title: "cite-only cousin — worktree from stale local without fetch",
    state: "OPEN",
    citeOnly: true,
    why: "Cite-only cousin — worktree from stale local without fetch. This harness DID fetch. Do not rebuild",
  },
  {
    issue: 70843,
    title: "cite-only cousin — auto-mode blocks sync of stale clone",
    state: "OPEN",
    citeOnly: true,
    why: "Cite-only cousin — auto-mode blocks sync of a stale clone. Different gate. Do not rebuild",
  },
  {
    issue: 73725,
    title: "cite-only cousin — desktop diff stat stale after reset",
    state: "OPEN",
    citeOnly: true,
    why: "Cite-only cousin — desktop diff stat stale after reset. UI stat, not checkout. Do not rebuild",
  },
]);

export const BACKUPS = Object.freeze([
  {
    issue: 93624,
    title: "macOS teammate spawn fork failed Device not configured / ptmx race; alt Timeslip",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship. Forksink already used; unused alt is Timeslip",
  },
  {
    issue: 93615,
    title: "scheduled WebSearch hangs; alt Hangfire stay-off",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
  {
    issue: 93570,
    title: "single-task shutdown kills all; alt Overkill",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
  {
    issue: 93589,
    title: "Cowork egress additional domains ignored",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
  {
    issue: 93618,
    title: "Windows/Git Bash ~8175 truncation + backslash",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
  {
    issue: 93622,
    title: "channel messages merge lose prompt cache",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
]);

export const NOT_PRODUCTS = Object.freeze([
  "nullarbor",
  "petard",
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
  "palimpsest",
  "scarph",
  "cringle",
  "plimsoll",
  "oubliette",
  "ephemera",
  "commutator",
  "mondegreen",
  "seizing",
  "hangfire",
  "flashpan",
  "frizzen",
]);

export const SAMPLE_REFLOG = Object.freeze([
  {
    id: "prewarm",
    clock: PREWARM_CLOCK,
    sha: OLD_TIP,
    action: "local named-branch created during container pre-warm",
    note: "wrong-era take left on the bench",
  },
  {
    id: "fetch",
    clock: SESSION_CLOCK,
    sha: NEW_TIP,
    action: "session-start re-fetch; HEAD detached on the new tip",
    note: "the slate says the tip was fetched",
  },
  {
    id: "checkout",
    clock: SESSION_CLOCK,
    sha: OLD_TIP,
    action: "git checkout named-branch resolves the pre-warm local",
    note: "checkout rolls the pre-warm take",
  },
  {
    id: "rewrite",
    clock: SESSION_CLOCK,
    sha: OLD_TIP,
    action: "refs/remotes/origin/named-branch rewritten to the old sha",
    note: "status lies up to date",
  },
]);

export const SAMPLE_TIP_REFLOG = Object.freeze([
  {
    id: "prewarm",
    clock: PREWARM_CLOCK,
    sha: OLD_TIP,
    action: "local named-branch created during container pre-warm",
    note: "pre-warm take is on the bench",
  },
  {
    id: "fetch",
    clock: SESSION_CLOCK,
    sha: NEW_TIP,
    action: "session-start re-fetch; HEAD detached on the new tip",
    note: "the slate claps the fetched tip",
  },
  {
    id: "force-B",
    clock: SESSION_CLOCK,
    sha: NEW_TIP,
    action: "git checkout -B named-branch FETCH_HEAD",
    note: "local branch forced onto the fetched tip",
  },
  {
    id: "honest",
    clock: SESSION_CLOCK,
    sha: NEW_TIP,
    action: "origin/named-branch stays on the fetched tip",
    note: "status agrees with the remote tip",
  },
]);

export const SAMPLE_SLATE = Object.freeze({
  fetched: true,
  clapped: "fetched-tip",
  rolled: "prewarm-take",
  honest: false,
});

export const SAMPLE_TIP_SLATE = Object.freeze({
  fetched: true,
  clapped: "fetched-tip",
  rolled: "fetched-tip",
  honest: true,
});

export const SAMPLE_CHRONOMETER = Object.freeze({
  prewarm: PREWARM_CLOCK,
  session: SESSION_CLOCK,
  gapMinutes: REFLOG_GAP_MINUTES,
  aligned: false,
});

export const SAMPLE_TIP_CHRONOMETER = Object.freeze({
  prewarm: PREWARM_CLOCK,
  session: SESSION_CLOCK,
  gapMinutes: REFLOG_GAP_MINUTES,
  aligned: true,
});

export const SAMPLE_CHECKOUT = Object.freeze({
  detachedOnFetch: true,
  resolvedLocal: true,
  forcedB: false,
  head: OLD_TIP,
});

export const SAMPLE_TIP_CHECKOUT = Object.freeze({
  detachedOnFetch: true,
  resolvedLocal: false,
  forcedB: true,
  head: NEW_TIP,
});

export const SAMPLE_REMOTE = Object.freeze({
  rewritten: true,
  sha: OLD_TIP,
  statusLie: true,
});

export const SAMPLE_TIP_REMOTE = Object.freeze({
  rewritten: false,
  sha: NEW_TIP,
  statusLie: false,
});

export const SAMPLE_LOG = Object.freeze([
  { t: "idle", line: "HEAD at remote tip as of session start; checkout -B / reset --hard onto FETCH_HEAD; SessionStart hooks see the new commit" },
  { t: "prewarm", line: "container pre-warm ~09:03 creates local named-branch at 9a03c01d" },
  { t: "push", line: "a commit is pushed between pre-warm and session start" },
  { t: "fetch", line: "session start ~09:12 re-fetches; HEAD detached on 0912f37c" },
  { t: "checkout", line: "git checkout named-branch resolves the pre-warm local — old tip" },
  { t: "rewrite", line: "refs/remotes/origin/named-branch rewritten to 9a03c01d in the same second" },
  { t: "status", line: "git status reports up to date — the status lie" },
  { t: "hooks", line: "SessionStart hooks run on the stale checkout; a hook fix pushed minutes earlier has no effect" },
  { t: "window", line: "any push between container preparation and session start is silently dropped" },
  { t: "expect", line: "force onto fetched tip: git checkout -B named-branch FETCH_HEAD or reset --hard origin/named-branch" },
  { t: "never", line: "remote-tracking ref must never be written back to a stale sha" },
  { t: "score", line: "wrong-era take left on the bench — Score anachronism or admit tip." },
]);

export function inspectSlate(input = {}) {
  const slate =
    input.slate && typeof input.slate === "object"
      ? input.slate
      : input.tip === true && input.stale !== true
        ? SAMPLE_TIP_SLATE
        : SAMPLE_SLATE;
  const forcedStale =
    input.stale === true ||
    input.checkoutLocal === true ||
    input.event === "stale" ||
    input.event === "checkout-local" ||
    input.prewarmLatch === true;
  const honest = forcedStale
    ? false
    : slate.honest === true ||
      input.forceB === true ||
      input.tip === true;
  return {
    fetched: slate.fetched !== false,
    clapped: slate.clapped || "fetched-tip",
    rolled: honest ? "fetched-tip" : "prewarm-take",
    honest,
    stamp: honest ? "tip" : "wrong-take",
    note: honest
      ? "continuity slate claps the fetched tip — HEAD matches session-start FETCH_HEAD"
      : "continuity slate says the tip was fetched; checkout still rolls the pre-warm take",
  };
}

export function inspectChronometer(input = {}) {
  const chrono =
    input.chronometer && typeof input.chronometer === "object"
      ? input.chronometer
      : input.tip === true && input.stale !== true
        ? SAMPLE_TIP_CHRONOMETER
        : SAMPLE_CHRONOMETER;
  const forcedGap =
    input.reflogGap === true ||
    input.event === "reflog-gap" ||
    (input.stale === true && input.tip !== true);
  const aligned = forcedGap ? false : chrono.aligned === true || input.tip === true;
  return {
    prewarm: chrono.prewarm || PREWARM_CLOCK,
    session: chrono.session || SESSION_CLOCK,
    gapMinutes: chrono.gapMinutes || REFLOG_GAP_MINUTES,
    aligned,
    stamp: aligned ? "aligned" : "gap",
    note: aligned
      ? "chronometer aligned — session clap forces the local branch onto the fetched tip"
      : "chronometer gap — pre-warm 09:03 vs session 09:12; nine minutes of wrong-era film",
  };
}

export function inspectCheckout(input = {}) {
  const checkout =
    input.checkout && typeof input.checkout === "object"
      ? input.checkout
      : input.tip === true && input.stale !== true
        ? SAMPLE_TIP_CHECKOUT
        : SAMPLE_CHECKOUT;
  const forcedLocal =
    input.checkoutLocal === true ||
    input.event === "checkout-local" ||
    input.prewarmLatch === true ||
    input.stale === true ||
    (input.oneBehind === true && input.tip !== true);
  const resolvedLocal = forcedLocal ? true : checkout.resolvedLocal === true;
  const forcedB =
    !forcedLocal &&
    (checkout.forcedB === true || input.forceB === true || input.tip === true);
  return {
    detachedOnFetch: checkout.detachedOnFetch !== false || input.detachedFetch === true,
    resolvedLocal,
    forcedB,
    head: resolvedLocal ? OLD_TIP : NEW_TIP,
    stamp: resolvedLocal ? "local" : "force-B",
    note: resolvedLocal
      ? "checkout named the pre-warm local branch — HEAD at the old tip"
      : "checkout -B onto FETCH_HEAD — HEAD at the session-start tip",
  };
}

export function inspectRemote(input = {}) {
  const remote =
    input.remote && typeof input.remote === "object"
      ? input.remote
      : input.tip === true && input.stale !== true
        ? SAMPLE_TIP_REMOTE
        : SAMPLE_REMOTE;
  const forcedRewrite =
    input.remoteRewrite === true ||
    input.event === "remote-rewrite" ||
    input.statusLie === true ||
    (input.stale === true && input.tip !== true);
  const rewritten = forcedRewrite ? true : remote.rewritten === true;
  return {
    rewritten,
    sha: rewritten ? OLD_TIP : NEW_TIP,
    statusLie: rewritten || remote.statusLie === true,
    stamp: rewritten ? "rewritten" : "honest",
    note: rewritten
      ? "origin/named-branch rewritten to the old sha — git status lies up to date"
      : "origin/named-branch stays on the fetched tip — status agrees",
  };
}

export function inspectReflog(input = {}) {
  const rows = Array.isArray(input.reflog)
    ? input.reflog
    : input.tip === true && input.stale !== true
      ? SAMPLE_TIP_REFLOG
      : SAMPLE_REFLOG;
  const sampleCalm =
    rows === SAMPLE_REFLOG && input.tip === true && input.stale !== true;
  const forcedGap =
    input.reflogGap === true ||
    input.event === "reflog-gap" ||
    (input.stale === true && input.tip !== true);
  const gapped = !sampleCalm && (forcedGap || rows.some((row) => row.sha === OLD_TIP && row.id === "checkout"));
  return {
    gapped,
    gapMinutes: REFLOG_GAP_MINUTES,
    rows: sampleCalm ? SAMPLE_TIP_REFLOG : rows,
    stamp: gapped ? "gap" : "tip",
    note: gapped
      ? "reflog strip — fetch new tip, then checkout local, then same-second origin rewrite"
      : "reflog strip — fetch new tip, then checkout -B onto FETCH_HEAD",
  };
}

export function readBooth(input = {}) {
  const slate = inspectSlate(input);
  const chronometer = inspectChronometer(input);
  const checkout = inspectCheckout(input);
  const remote = inspectRemote(input);
  const reflog = inspectReflog(input);
  const stale =
    input.tip !== true &&
    ((slate.rolled === "prewarm-take" && !slate.honest) ||
      checkout.resolvedLocal ||
      input.stale === true);
  const tip =
    input.tip === true &&
    stale !== true &&
    slate.honest &&
    checkout.forcedB;
  const path =
    checkout.resolvedLocal &&
    (input.event === "prewarm-latch" || input.prewarmLatch === true);
  return {
    slate,
    chronometer,
    checkout,
    remote,
    reflog,
    stations: BOOTH_STATIONS,
    stale: stale && !tip && !path,
    tip:
      tip ||
      (slate.honest &&
        checkout.forcedB &&
        input.stale !== true &&
        input.prewarmLatch !== true),
    prewarmLatch: path && !tip,
    mark:
      path && !tip
        ? "prewarm-latch"
        : stale && !tip
          ? "stale"
          : "tip",
  };
}

/**
 * Published anachronism walk from #93585 only. Facts from the issue text.
 * A tip booth forces the local branch onto FETCH_HEAD at session start.
 * A stale booth checks out the pre-warm local after a successful fetch.
 * A prewarm-latch booth names the local-branch win as the path.
 */
export const ANACHRONISM_WALK = Object.freeze([
  {
    t: "idle",
    event: "cue-tip",
    tip: true,
    stale: false,
    forceB: true,
    neverRewrite: true,
    cue: "tip",
    note: "idle HOLD: HEAD at remote tip as of session start; checkout -B / reset --hard onto FETCH_HEAD; SessionStart hooks see the new commit",
  },
  {
    t: "prewarm",
    event: "prewarm-branch",
    stale: true,
    prewarmBranch: true,
    oldTip: true,
    cue: "stale",
    note: "container pre-warm ~09:03 creates local named-branch at 9a03c01d",
  },
  {
    t: "push",
    event: "silent-drop",
    stale: true,
    silentDrop: true,
    cue: "stale",
    note: "a commit is pushed between container preparation and session start",
  },
  {
    t: "fetch",
    event: "fetch-tip",
    stale: true,
    fetchTip: true,
    detachedFetch: true,
    newTip: true,
    cue: "stale",
    note: "session start ~09:12 re-fetches; HEAD detached on 0912f37c",
  },
  {
    t: "checkout",
    event: "checkout-local",
    stale: true,
    checkoutLocal: true,
    cue: "stale",
    note: "git checkout named-branch resolves the pre-warm local — old tip",
  },
  {
    t: "rewrite",
    event: "remote-rewrite",
    stale: true,
    remoteRewrite: true,
    cue: "stale",
    note: "refs/remotes/origin/named-branch rewritten to 9a03c01d in the same second",
  },
  {
    t: "status",
    event: "status-lie",
    stale: true,
    statusLie: true,
    cue: "stale",
    note: "git status reports up to date — the status lie",
  },
  {
    t: "hooks",
    event: "sessionstart-stale",
    stale: true,
    sessionStartStale: true,
    hookMiss: true,
    cue: "stale",
    note: "SessionStart hooks run on the stale checkout; a hook fix pushed minutes earlier has no effect",
  },
  {
    t: "gap",
    event: "reflog-gap",
    stale: true,
    reflogGap: true,
    cue: "stale",
    note: "nine-minute window between pre-warm 09:03 and session 09:12",
  },
  {
    t: "behind",
    event: "one-behind",
    stale: true,
    oneBehind: true,
    webSession: true,
    cue: "stale",
    note: "web session from desktop comes up one commit behind the remote tip",
  },
  {
    t: "expect",
    event: "force-B",
    stale: true,
    forceB: true,
    resetHard: true,
    cue: "stale",
    note: "expected: git checkout -B named-branch FETCH_HEAD or reset --hard origin/named-branch",
  },
  {
    t: "path",
    event: "prewarm-latch",
    stale: true,
    prewarmLatch: true,
    checkoutLocal: true,
    remoteRewrite: true,
    cue: "stale",
    note: "prewarm-latch — the pre-warm local branch wins after the fetch",
  },
  {
    t: "score",
    event: "anachronism",
    stale: true,
    checkoutLocal: true,
    remoteRewrite: true,
    sessionStartStale: true,
    prewarmLatch: true,
    cue: "stale",
    note: "anachronism — wrong-era take left on the bench after pre-warm",
  },
]);

export const POSITIVE_CONTROL_WALK = Object.freeze([
  {
    t: "hold",
    event: "force-B",
    tip: true,
    forceB: true,
    cue: "tip",
    note: "positive control: git checkout -B named-branch FETCH_HEAD",
  },
  {
    t: "honest",
    event: "cue-tip",
    tip: true,
    neverRewrite: true,
    cue: "tip",
    note: "positive control: origin/named-branch stays on the fetched tip",
  },
  {
    t: "hooks",
    event: "new-tip",
    tip: true,
    newTip: true,
    cue: "tip",
    note: "positive control: SessionStart hooks see the new commit",
  },
]);

function classifyFromSeed(seed) {
  if (seed && VERDICTS.includes(seed)) return seed;
  return null;
}

export function emptyTicket() {
  return {
    seed: IDLE_WORD,
    tip: true,
    stale: false,
    forceB: true,
    neverRewrite: true,
    cue: "tip",
  };
}

export function seedTip() {
  return { ...emptyTicket() };
}

export function seedStale() {
  return {
    seed: SEEDED_WORD,
    tip: false,
    stale: true,
    prewarmBranch: true,
    oldTip: true,
    silentDrop: true,
    fetchTip: true,
    detachedFetch: true,
    newTip: true,
    checkoutLocal: true,
    remoteRewrite: true,
    statusLie: true,
    sessionStartStale: true,
    hookMiss: true,
    reflogGap: true,
    oneBehind: true,
    webSession: true,
    forceB: true,
    resetHard: true,
    prewarmLatch: true,
    cue: "stale",
    issue: FEATURED_ISSUE,
    slate: SAMPLE_SLATE,
    chronometer: SAMPLE_CHRONOMETER,
    checkout: SAMPLE_CHECKOUT,
    remote: SAMPLE_REMOTE,
    reflog: SAMPLE_REFLOG,
  };
}

export function seedAnachronism() {
  return {
    seed: PRODUCT_WORD,
    preferSeed: true,
    stale: true,
    checkoutLocal: true,
    remoteRewrite: true,
    sessionStartStale: true,
    prewarmLatch: true,
    cue: "stale",
  };
}

export function seedPrewarmLatch() {
  return {
    seed: PATH_WORD,
    preferSeed: true,
    stale: true,
    prewarmLatch: true,
    checkoutLocal: true,
    remoteRewrite: true,
    event: "prewarm-latch",
    cue: "stale",
  };
}

export function seedHold() {
  return {
    seed: "hold",
    preferSeed: true,
    tip: true,
    cue: "tip",
  };
}

export function seedFetchTip() {
  return { seed: "fetch-tip", preferSeed: true, fetchTip: true, cue: "stale" };
}

export function seedCheckoutLocal() {
  return { seed: "checkout-local", preferSeed: true, checkoutLocal: true, cue: "stale" };
}

export function seedRemoteRewrite() {
  return { seed: "remote-rewrite", preferSeed: true, remoteRewrite: true, cue: "stale" };
}

export function seedSessionstartStale() {
  return { seed: "sessionstart-stale", preferSeed: true, sessionStartStale: true, cue: "stale" };
}

export function seedReflogGap() {
  return { seed: "reflog-gap", preferSeed: true, reflogGap: true, cue: "stale" };
}

export function seedStatusLie() {
  return { seed: "status-lie", preferSeed: true, statusLie: true, cue: "stale" };
}

export function seedForceB() {
  return { seed: "force-B", preferSeed: true, forceB: true, cue: "stale" };
}

export function seedDetachedFetch() {
  return { seed: "detached-fetch", preferSeed: true, detachedFetch: true, cue: "stale" };
}

export function seedPrewarmBranch() {
  return { seed: "prewarm-branch", preferSeed: true, prewarmBranch: true, cue: "stale" };
}

export function seedOldTip() {
  return { seed: "old-tip", preferSeed: true, oldTip: true, cue: "stale" };
}

export function seedNewTip() {
  return { seed: "new-tip", preferSeed: true, newTip: true, cue: "tip" };
}

export function seedHookMiss() {
  return { seed: "hook-miss", preferSeed: true, hookMiss: true, cue: "stale" };
}

export function seedSilentDrop() {
  return { seed: "silent-drop", preferSeed: true, silentDrop: true, cue: "stale" };
}

export function seedResetHard() {
  return { seed: "reset-hard", preferSeed: true, resetHard: true, cue: "stale" };
}

export function seedNeverRewrite() {
  return { seed: "never-rewrite", preferSeed: true, neverRewrite: true, cue: "tip" };
}

export function seedOneBehind() {
  return { seed: "one-behind", preferSeed: true, oneBehind: true, cue: "stale" };
}

export function seedWebSession() {
  return { seed: "web-session", preferSeed: true, webSession: true, cue: "stale" };
}

export function normalizeBooth(raw) {
  if (!raw || typeof raw !== "object") {
    return {
      tip: false,
      stale: false,
      prewarmLatch: false,
      fetchTip: false,
      checkoutLocal: false,
      remoteRewrite: false,
      sessionStartStale: false,
      reflogGap: false,
      statusLie: false,
      forceB: false,
      detachedFetch: false,
      prewarmBranch: false,
      oldTip: false,
      newTip: false,
      hookMiss: false,
      silentDrop: false,
      resetHard: false,
      neverRewrite: false,
      oneBehind: false,
      webSession: false,
      cue: null,
      event: null,
      t: null,
    };
  }
  return {
    tip: raw.tip === true,
    stale:
      raw.stale === true ||
      raw.event === "stale" ||
      raw.event === "anachronism",
    prewarmLatch: raw.prewarmLatch === true || raw.event === "prewarm-latch",
    fetchTip: raw.fetchTip === true || raw.event === "fetch-tip",
    checkoutLocal: raw.checkoutLocal === true || raw.event === "checkout-local",
    remoteRewrite: raw.remoteRewrite === true || raw.event === "remote-rewrite",
    sessionStartStale:
      raw.sessionStartStale === true || raw.event === "sessionstart-stale",
    reflogGap: raw.reflogGap === true || raw.event === "reflog-gap",
    statusLie: raw.statusLie === true || raw.event === "status-lie",
    forceB: raw.forceB === true || raw.event === "force-B",
    detachedFetch: raw.detachedFetch === true || raw.event === "detached-fetch",
    prewarmBranch: raw.prewarmBranch === true || raw.event === "prewarm-branch",
    oldTip: raw.oldTip === true || raw.event === "old-tip",
    newTip: raw.newTip === true || raw.event === "new-tip",
    hookMiss: raw.hookMiss === true || raw.event === "hook-miss",
    silentDrop: raw.silentDrop === true || raw.event === "silent-drop",
    resetHard: raw.resetHard === true || raw.event === "reset-hard",
    neverRewrite: raw.neverRewrite === true || raw.event === "never-rewrite",
    oneBehind: raw.oneBehind === true || raw.event === "one-behind",
    webSession: raw.webSession === true || raw.event === "web-session",
    cue: raw.cue || null,
    event: raw.event || raw.kind || null,
    t: raw.t || raw.time || null,
    slate: raw.slate,
    chronometer: raw.chronometer,
    checkout: raw.checkout,
    remote: raw.remote,
    reflog: raw.reflog,
    log: raw.log,
  };
}

function hasBoothFields(ticket) {
  return Boolean(
    ticket &&
      (ticket.tip != null ||
        ticket.stale != null ||
        ticket.prewarmLatch != null ||
        ticket.fetchTip != null ||
        ticket.checkoutLocal != null ||
        ticket.remoteRewrite != null ||
        ticket.sessionStartStale != null ||
        ticket.cue != null ||
        ticket.event ||
        ticket.slate ||
        ticket.checkout ||
        ticket.remote),
  );
}

function isTip(row) {
  if (row.stale && row.cue !== "tip") return false;
  if (
    row.cue === "stale" ||
    row.cue === "anachronism" ||
    row.cue === "prewarm-latch"
  ) {
    return false;
  }
  if (
    row.checkoutLocal &&
    row.remoteRewrite &&
    row.cue !== "tip" &&
    row.tip !== true
  ) {
    return false;
  }
  if (
    row.prewarmLatch &&
    row.checkoutLocal &&
    row.cue !== "tip" &&
    row.tip !== true
  ) {
    return false;
  }
  if (row.tip === true && row.stale !== true && row.cue !== "stale") {
    return true;
  }
  if (
    row.cue === "tip" &&
    row.stale !== true &&
    row.checkoutLocal !== true &&
    row.prewarmLatch !== true
  ) {
    return true;
  }
  if (
    (row.forceB === true || row.neverRewrite === true || row.newTip === true) &&
    row.stale !== true &&
    row.checkoutLocal !== true &&
    row.remoteRewrite !== true &&
    row.prewarmLatch !== true
  ) {
    return true;
  }
  return false;
}

function isPrewarmLatchPath(row) {
  return (
    row.event === "prewarm-latch" &&
    !isTip(row) &&
    (row.prewarmLatch === true || row.checkoutLocal === true || row.remoteRewrite === true)
  );
}

function isStale(row) {
  if (isTip(row)) return false;
  if (isPrewarmLatchPath(row) && row.cue !== "stale") return false;
  if (row.cue === "stale" || row.cue === "anachronism") return true;
  if (row.stale === true) return true;
  if (
    row.checkoutLocal === true &&
    row.remoteRewrite === true &&
    row.sessionStartStale === true
  ) {
    return true;
  }
  if (row.checkoutLocal === true && row.remoteRewrite === true) {
    return true;
  }
  if (
    row.checkoutLocal === true ||
    row.remoteRewrite === true ||
    row.sessionStartStale === true ||
    (row.prewarmLatch === true && row.statusLie === true)
  ) {
    return true;
  }
  return false;
}

/**
 * Score one continuity pass against the anachronism booth.
 * tip: HEAD at remote tip as of session start; checkout -B onto FETCH_HEAD.
 * stale: pre-warm local wins after fetch; origin rewritten; hooks on old tip.
 * prewarm-latch: the local-branch win after a successful fetch is the path.
 */
export function scoreGate(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const row = normalizeBooth(ticket);
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);

  let verdict = IDLE_WORD;
  if (
    isPrewarmLatchPath(row) ||
    (row.prewarmLatch && ticket.preferSeed && seeded === PATH_WORD)
  ) {
    verdict = "prewarm-latch";
  } else if (isStale(row)) {
    verdict = "stale";
  } else if (isTip(row)) {
    verdict = "tip";
  } else if (
    row.checkoutLocal ||
    row.remoteRewrite ||
    row.sessionStartStale ||
    (row.prewarmLatch && !row.forceB)
  ) {
    verdict = "stale";
  }

  if (seeded && (!hasBoothFields(ticket) || ticket.preferSeed === true)) {
    verdict = seeded;
  }

  const hold = HOLD.includes(verdict);
  const slate = inspectSlate(row);
  const chronometer = inspectChronometer(row);
  const checkout = inspectCheckout(row);
  const remote = inspectRemote(row);
  const reflog = inspectReflog(row);
  return {
    verdict,
    idleWord: IDLE_WORD,
    pathWord: PATH_WORD,
    seededWord: SEEDED_WORD,
    productWord: PRODUCT_WORD,
    hold,
    alarm: !hold,
    recover: RECOVER.includes(verdict),
    tip: verdict === "tip" || verdict === "hold",
    stale:
      verdict === "stale" ||
      verdict === SEEDED_WORD ||
      verdict === PRODUCT_WORD,
    prewarmLatch:
      row.prewarmLatch === true ||
      verdict === "prewarm-latch" ||
      verdict === PATH_WORD,
    fetchTip: row.fetchTip,
    checkoutLocal: row.checkoutLocal,
    remoteRewrite: row.remoteRewrite,
    sessionStartStale: row.sessionStartStale,
    reflogGap: row.reflogGap,
    statusLie: row.statusLie,
    forceB: row.forceB,
    detachedFetch: row.detachedFetch,
    prewarmBranch: row.prewarmBranch,
    oldTip: row.oldTip,
    newTip: row.newTip,
    hookMiss: row.hookMiss,
    silentDrop: row.silentDrop,
    resetHard: row.resetHard,
    neverRewrite: row.neverRewrite,
    oneBehind: row.oneBehind,
    webSession: row.webSession,
    cue: hold
      ? "tip"
      : row.prewarmLatch || verdict === "prewarm-latch"
        ? "prewarm-latch"
        : "stale",
    event: row.event,
    t: row.t,
    phrase: hold ? "admit tip" : "score anachronism",
    slateInspect: slate,
    chronometerInspect: chronometer,
    checkoutInspect: checkout,
    remoteInspect: remote,
    reflogInspect: reflog,
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
      : ANACHRONISM_WALK;
  const scored = rows.map((row) => ({
    ...normalizeBooth(row),
    ...scoreGate({ ...row, preferSeed: false }),
  }));
  const stale = scored.filter((row) => row.verdict === "stale");
  const path = scored.filter((row) => row.verdict === "prewarm-latch");
  const tip = scored.filter((row) => row.verdict === "tip");
  const headline =
    scored.find((row) => row.event === "stale") ||
    scored.find((row) => row.event === "prewarm-latch") ||
    scored.find((row) => row.event === "checkout-local") ||
    stale[stale.length - 1];
  let verdict = "tip";
  if (stale.length) verdict = "stale";
  else if (path.length && !tip.length) verdict = "prewarm-latch";
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
    staleCount: stale.length,
    pathCount: path.length,
    tipCount: tip.length,
    headline,
    rows: scored,
    phrase: HOLD.includes(verdict) ? "admit tip" : "score anachronism",
    note: headline
      ? "Claude Code on the web; harness fetched the new tip then checkout named the pre-warm local; origin rewritten; SessionStart hooks on the stale checkout."
      : "published anachronism walk scored against tip vs stale",
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
    seeded !== "tip" &&
    seeded !== "stale" &&
    seeded !== "prewarm-latch" &&
    seeded !== "anachronism" &&
    ticket.tip == null &&
    ticket.stale == null &&
    ticket.checkoutLocal == null &&
    ticket.prewarmLatch == null &&
    ticket.remoteRewrite == null &&
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
    tip: scored.tip ?? false,
    stale: scored.stale ?? false,
    prewarmLatch: scored.prewarmLatch ?? false,
    fetchTip: scored.fetchTip ?? false,
    checkoutLocal: scored.checkoutLocal ?? false,
    remoteRewrite: scored.remoteRewrite ?? false,
    sessionStartStale: scored.sessionStartStale ?? false,
    reflogGap: scored.reflogGap ?? false,
    statusLie: scored.statusLie ?? false,
    forceB: scored.forceB ?? false,
    detachedFetch: scored.detachedFetch ?? false,
    hookMiss: scored.hookMiss ?? false,
    silentDrop: scored.silentDrop ?? false,
    oneBehind: scored.oneBehind ?? false,
    webSession: scored.webSession ?? false,
  };
}

export function score(input) {
  return analyze(input).verdict;
}

export function fingerprint(input) {
  const result = analyze(input);
  return [
    result.verdict,
    result.tip && !result.stale ? "slate=tip" : "slate=wrong-take",
    result.reflogGap || result.stale ? "chrono=gap" : "chrono=aligned",
    result.checkoutLocal || result.stale ? "checkout=local" : "checkout=force-B",
    result.remoteRewrite || result.stale ? "remote=rewritten" : "remote=honest",
    result.sessionStartStale || result.stale ? "hooks=stale" : "hooks=tip",
    result.prewarmLatch || result.verdict === "prewarm-latch"
      ? "path=prewarm-latch"
      : "path=tip",
    result.cue === "tip"
      ? "cue=tip"
      : result.cue === "prewarm-latch"
        ? "cue=prewarm-latch"
        : "cue=stale",
  ].join("|");
}

export function handle(input) {
  const result = analyze(input);
  const booth = readBooth({
    tip: result.tip,
    stale: result.stale,
    prewarmLatch: result.prewarmLatch,
    fetchTip: result.fetchTip,
    checkoutLocal: result.checkoutLocal,
    remoteRewrite: result.remoteRewrite,
    sessionStartStale: result.sessionStartStale,
    reflogGap: result.reflogGap,
    statusLie: result.statusLie,
    forceB: result.forceB,
    detachedFetch: result.detachedFetch,
    slate: input && input.slate,
    chronometer: input && input.chronometer,
    checkout: input && input.checkout,
    remote: input && input.remote,
    reflog: input && input.reflog,
    log: input && input.log,
  });
  return {
    ...result,
    fingerprint: fingerprint(input),
    booth,
    slate: inspectSlate({
      tip: result.tip,
      stale: result.stale,
      checkoutLocal: result.checkoutLocal,
      forceB: result.forceB,
      prewarmLatch: result.prewarmLatch,
      slate: input && input.slate,
    }),
    chronometer: inspectChronometer({
      tip: result.tip,
      stale: result.stale,
      reflogGap: result.reflogGap,
      chronometer: input && input.chronometer,
    }),
    checkout: inspectCheckout({
      tip: result.tip,
      stale: result.stale,
      checkoutLocal: result.checkoutLocal,
      forceB: result.forceB,
      prewarmLatch: result.prewarmLatch,
      detachedFetch: result.detachedFetch,
      oneBehind: result.oneBehind,
      checkout: input && input.checkout,
    }),
    remote: inspectRemote({
      tip: result.tip,
      stale: result.stale,
      remoteRewrite: result.remoteRewrite,
      statusLie: result.statusLie,
      remote: input && input.remote,
    }),
    reflog: inspectReflog({
      tip: result.tip,
      stale: result.stale,
      reflogGap: result.reflogGap,
      reflog: input && input.reflog,
    }),
    stations: BOOTH_STATIONS.map((row) => ({
      ...row,
      stale: result.stale === true || result.verdict === "stale",
    })),
    published: {
      issue: FEATURED_ISSUE,
      url: ISSUE_URL,
      title: TITLE,
      state: STATE,
      labels: [...LABELS],
      prewarmClock: PREWARM_CLOCK,
      sessionClock: SESSION_CLOCK,
      reflogGapMinutes: REFLOG_GAP_MINUTES,
      oldTip: OLD_TIP,
      newTip: NEW_TIP,
      branchName: BRANCH_NAME,
      checkoutCmd: CHECKOUT_CMD,
      forceBCmd: FORCE_B_CMD,
      resetHardCmd: RESET_HARD_CMD,
      distribution: DISTRIBUTION,
      sessionKind: SESSION_KIND,
      reflog: SAMPLE_REFLOG,
      stations: BOOTH_STATIONS,
      fingerprintLines: [...FINGERPRINT_LINES],
      cousins: COUSINS.map((row) => row.issue),
      backups: BACKUPS.map((row) => row.issue),
      phrase: PHRASE,
      expected: [
        "HEAD at remote tip as of session start; if a local branch exists from pre-warm, force onto the fetched tip (git checkout -B <branch> FETCH_HEAD or reset --hard origin/<branch>); remote-tracking ref must never be written back to a stale sha",
      ],
      hypothesis:
        "NON-BINDING: if a local branch exists from pre-warm, force onto the fetched tip (`git checkout -B <branch> FETCH_HEAD` or `reset --hard origin/<branch>`); the remote-tracking ref must never be written back to a stale sha. Verify against #93585 text only. Do not claim a root cause in Claude Code source you have not seen.",
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
