#!/usr/bin/env node
/**
 * Ouster — common-law wrongful eviction / Georgian bailiff desk /
 * tenancy roll / wax-seal notice / occupied flat / iron key /
 * parchment writ / ink-stained ledger / street door kicked in
 * under a nested lodger.
 *
 * Educational diagnostic model for a published Claude Code
 * worktree defect: a subagent launched with isolation:"worktree"
 * starts a background child that inherits the same worktree
 * (inheritedWorktreePath, spawnDepth: 2). The parent finishes
 * without changes; Claude Code auto-removes the worktree
 * (worktreeCleanlyRemoved: true); ~6–8s later every tool call
 * in the still-running child fails with "working directory ...
 * no longer exists ... Refusing to run there".
 *
 * Encoded from anthropics/claude-code#94221 issue text only.
 * Hypothesis (NON-BINDING): auto-clean treats parent-exit with
 * no changes as a free yank of the shared worktree and does not
 * hold a git worktree lock (or occupancy check) for a nested
 * inheritor still running. Invite verify against issue text only.
 * Do NOT claim a root cause in Claude Code source you have
 * not seen. Do NOT implement a fix. No network. No exploits.
 * No live Claude.
 *
 *   node ouster.mjs data/ouster.json
 *   echo '{"seed":"ouster"}' | node ouster.mjs
 *
 * Idle word is tenanted (HOLD: worktree stays while nested inheritor still runs).
 * HOLD aliases: occupied, seated, retained, locked, inhabited.
 * Seeded word is ouster (#94221 — the inherited-worktree-yank path).
 * Path word is inherited-worktree-yank.
 * Product score word is ouster (Score ouster or admit tenanted.).
 *
 * NOT Proscription/#94202. NOT Thimblerig/#94174. NOT Fetchling/#94065.
 * NOT Souffleur/#94031. NOT Epitome/#94032. NOT Diabolica/#94040
 * (Diabolica was worktree Bash false-guilt / cannot-show-not-git —
 * DIFFERENT). NOT Sallyport/#94082. NOT Palilalia/#94041.
 * NOT Sepulchre. NOT Sneck. NOT Drawbridge. NOT Chirograph.
 * NOT Titulus. NOT Derelict. NOT Vestry. NOT Mondegreen.
 * NOT Afterimage. NOT Phosphene. NOT Scotoma. NOT Scrim.
 * NOT Aphonia. NOT Sourdine. NOT Anarthria.
 * Cousins cite-only (do NOT rebuild / do NOT conflate):
 * #41010 — worktree isolation cleanup deletes parent session
 * working directory on agent ID collision.
 * #76377 — background/bridge sessions leak worktrees (no cleanup
 * on daemon kill). Ouster is specifically auto-clean yanking a
 * worktree still used by a running nested inheritor.
 */

/* Browser-safe: no top-level node: imports. CLI I/O is loaded only in main(). */

export const VERDICTS = Object.freeze([
  "tenanted",
  "ouster",
  "inherited-worktree-yank",
  "hold",
  "occupied",
  "seated",
  "retained",
  "locked",
  "inhabited",
  "inheritedWorktreePath",
  "spawnDepth-2",
  "worktreeCleanlyRemoved",
  "parent-no-changes",
  "child-refuses-cwd",
  "six-to-eight-seconds",
  "token-rerun-loss",
  "landing",
  "has-repro",
  "cousins",
  "backups",
  "fixtures",
  "walk",
]);

export const IDLE_WORD = "tenanted";
export const PATH_WORD = "inherited-worktree-yank";
export const SEEDED_WORD = "ouster";
export const PRODUCT_WORD = "ouster";
export const HOLD = Object.freeze(["tenanted", "hold"]);
export const HOLD_ALIASES = Object.freeze([
  "occupied",
  "seated",
  "retained",
  "locked",
  "inhabited",
]);
export const RECOVER = Object.freeze(["tenanted", "hold"]);
export const ALARM = Object.freeze(
  VERDICTS.filter((name) => !HOLD.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FORBIDDEN_IDLE = Object.freeze([
  "additive",
  "literal",
  "echoing",
  "unabridged",
  "innocent",
  "sealed",
  "silenced",
  "living",
  "cleared",
  "spanned",
  "matched",
  "inscribed",
  "berthed",
  "pegged",
  "latent",
  "flushed",
  "articulate",
  "limber",
  "primed",
  "lit",
  "voiced",
  "mute",
  "rostered",
  "quieted",
  "unrung",
  "demesned",
  "diagrammed",
  "traced",
  "damped",
  "mounted",
  "warm",
  "honest",
  "afloat",
  "concordant",
  "routed",
  "bound",
  "preserved",
  "raised",
  "barred",
  "denied",
  "struck",
  "excised",
  "absent",
  "stripped",
  "thimblerig",
  "fetchling",
  "souffleur",
  "epitome",
  "diabolica",
  "sallyport",
  "palilalia",
  "sepulchre",
  "sneck",
  "drawbridge",
  "chirograph",
  "titulus",
  "derelict",
  "vestry",
  "mondegreen",
  "afterimage",
  "phosphene",
  "scotoma",
  "scrim",
  "aphonia",
  "sourdine",
  "anarthria",
  "proscription",
  "skill-row-carve",
  "skill-dollar-swap",
  "app-switch-echo-loss",
  "summarized-thinking-force",
  "cannot-show-not-git",
  "reminder-secret-bypass",
  "goal-stop-refire",
  "bash-nul-poison",
  "deny-list-hollow",
]);

export const FORBIDDEN_SEED = Object.freeze([
  "thimblerig",
  "fetchling",
  "souffleur",
  "epitome",
  "diabolica",
  "sallyport",
  "palilalia",
  "sepulchre",
  "sneck",
  "drawbridge",
  "chirograph",
  "titulus",
  "derelict",
  "vestry",
  "mondegreen",
  "afterimage",
  "phosphene",
  "scotoma",
  "scrim",
  "aphonia",
  "sourdine",
  "anarthria",
  "proscription",
  "skill-row-carve",
  "skill-dollar-swap",
  "app-switch-echo-loss",
  "summarized-thinking-force",
  "cannot-show-not-git",
  "reminder-secret-bypass",
  "goal-stop-refire",
  "bash-nul-poison",
  "deny-list-hollow",
]);

export const FEATURED_ISSUE = 94221;
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/94221";
export const TITLE =
  "Worktree auto-cleanup removes a worktree still used by a running nested background agent";
export const STATE = "OPEN";
export const LABELS = Object.freeze([
  "bug",
  "has repro",
  "platform:macos",
  "area:agents",
  "data-loss",
]);
export const PLATFORM = "macos";
export const SURFACE = "inherited-worktree-yank";
export const HOST =
  "Claude Code desktop nested Agent isolation:\"worktree\" inheritedWorktreePath spawnDepth 2";
export const CHECKED_ON =
  "Claude Code desktop 2.1.220 (macOS). Observed twice on 2026-09-14.";
export const BUILD = "Claude Code desktop 2.1.220 (macOS)";
export const SELECTED_MODEL = "claude-opus-5";
export const SUBAGENT_MODEL = "claude-sonnet-5";
export const OS = "macOS";
export const PHRASE = "Score ouster or admit tenanted.";
export const DISTRIBUTION =
  "A subagent launched with isolation: \"worktree\" starts a background child agent. The child inherits the same worktree (its meta shows inheritedWorktreePath, spawnDepth: 2). The parent then finishes without changes; Claude Code auto-removes the worktree (worktreeCleanlyRemoved: true); ~6–8s later every tool call in the still-running child fails with \"working directory ... no longer exists ... Refusing to run there\". Observed twice on 2026-09-14, Claude Code desktop 2.1.220 (macOS), main Opus 5, subagents Sonnet 5. Timeline: 06:44:58 parent starts in .claude/worktrees/agent-a59a…; 06:45:44 parent calls Agent (background), child inherits; 06:45:50 parent ends with no changes → worktree removed; 06:45:58 child stops. Impact: work lost, stage re-run (tens of millions of tokens). Expected: don't auto-clean (or keep git worktree lock) while a child that inherited the worktree is still running.";

export const RULED_OUT = Object.freeze([
  "Proscription/#94202 deny-list-hollow — subagent own frontmatter disallowedTools unused",
  "Thimblerig/#94174 skill-row-carve — /context Skills↔tools tally lie",
  "Fetchling/#94065 skill-dollar-swap — Skill-path $N conversation-fragment swap",
  "Souffleur/#94031 app-switch-echo-loss — VoiceOver typing echo after app switch",
  "Epitome/#94032 summarized-thinking-force — scriptorium abridgement",
  "Diabolica/#94040 cannot-show-not-git — worktree Bash inverted burden / false-guilt (DIFFERENT)",
  "Sallyport/#94082 reminder-secret-bypass — mtime reminder dumps secrets past PreToolUse",
  "Palilalia/#94041 goal-stop-refire — /goal Stop hook re-fires stale text",
  "Sepulchre — bash-nul-poison; different vault",
  "Sneck — chip-dismiss-ephemeral; different latch",
  "Drawbridge — rc-bridge-update-drop; different span",
  "Chirograph — worktree-rename-stale; different indenture",
  "Titulus — resume-stale-title; different plaque",
  "Derelict — session-kill-orphan; different hulk",
  "Vestry — mount-refcount-race; different sacristy",
  "Mondegreen — substring-scan; different lyric ear",
  "Afterimage — Windows text paint latency (CRT phosphor)",
  "Phosphene — layer-tree-walk; vision flash",
  "Scotoma — /goal lived only in command-args; vision gap",
  "Scrim — runtime DLP redaction; different product",
  "Aphonia — missing SendMessage; ENT roster",
  "Sourdine — mid-narration mute; concert mute",
  "Anarthria — dictation paste drop; laryngology",
]);
export const EXPECTED = Object.freeze([
  "Don't auto-clean a worktree while a child that inherited it is still running",
  "Or keep the git worktree lock while a nested inheritor still occupies the path",
  "A child with inheritedWorktreePath and spawnDepth: 2 must keep a usable cwd",
  "Parent-no-changes must not yank the street door under a seated lodger",
  "Alternatively document this and provide a way to limit nested Agent spawning",
]);

export const FIELD_MARKS = Object.freeze([
  {
    id: "inheritedWorktreePath",
    label: "inheritedWorktreePath",
    count: "same .claude/worktrees/agent-a59a…",
    note: "Child inherits the parent's isolation worktree",
  },
  {
    id: "spawnDepth-2",
    label: "spawnDepth: 2",
    count: "nested background child",
    note: "Child meta shows spawnDepth: 2",
  },
  {
    id: "worktreeCleanlyRemoved",
    label: "worktreeCleanlyRemoved",
    count: "true after parent-no-changes",
    note: "Parent finishes without changes; auto-clean yanks the worktree",
  },
  {
    id: "child-refuses-cwd",
    label: "child refuses cwd",
    count: "Refusing to run there",
    note: "Every tool call fails: working directory no longer exists",
  },
  {
    id: "six-to-eight-seconds",
    label: "six-to-eight-seconds",
    count: "~6–8s after yank",
    note: "Child dies shortly after the parent-exit cleanup",
  },
  {
    id: "inherited-worktree-yank",
    label: "inherited-worktree-yank",
    count: "auto-clean under nested inheritor",
    note: "Worktree yanked while the nested child is still inside",
  },
]);

export const WRIT_NAMES = Object.freeze([
  {
    id: "inheritedWorktreePath",
    lost: "Child inherits the same worktree; the roll still names that tenancy",
    control: "Inherited path stays locked while the nested lodger is seated",
    story: "the ledger lists one flat; two tenants still inside",
  },
  {
    id: "spawnDepth-2",
    lost: "spawnDepth: 2 nested child is still running when the writ is served",
    control: "Depth-2 occupancy holds the key until the child leaves",
    story: "the nested lodger is still at the desk",
  },
  {
    id: "worktreeCleanlyRemoved",
    lost: "worktreeCleanlyRemoved: true after parent-no-changes — street door kicked in",
    control: "No clean removal while an inheritor still occupies the path",
    story: "the bailiff stamps CLEANLY REMOVED on an occupied roll",
  },
  {
    id: "parent-no-changes",
    lost: "Parent ends with no changes and that is treated as leave to evict",
    control: "Parent-no-changes is not leave to yank a shared worktree",
    story: "the parent walks out; the nested lodger is still paying rent",
  },
  {
    id: "child-refuses-cwd",
    lost: "working directory ... no longer exists ... Refusing to run there",
    control: "Child tool calls keep a living cwd",
    story: "every knock at the door is refused — the flat is gone",
  },
  {
    id: "inherited-worktree-yank",
    lost: "Auto-clean yanks the inherited worktree under a running child",
    control: "Keep the lock (or skip auto-clean) while the inheritor runs",
    story: "wrongful eviction — ouster of a tenanted worktree",
  },
]);

export const BOOTH_STCTIONS = Object.freeze([
  {
    id: "tenanted-roll",
    survey:
      "Georgian bailiff desk; tenancy roll; iron key; occupied flat retained while the nested lodger still sits",
    kind: "tenanted",
    note: "idle: tenanted — the hold/good path",
  },
  {
    id: "inheritedWorktreePath",
    survey:
      "child inherits the same isolation worktree (inheritedWorktreePath)",
    kind: "ouster",
    note: "seeded: inherited path still occupied",
  },
  {
    id: "inherited-worktree-yank",
    survey:
      "parent-no-changes auto-clean yanks the shared worktree under a running nested child",
    kind: "ouster",
    note: "path: inherited-worktree-yank names the wrongful eviction",
  },
  {
    id: "child-refuses-cwd",
    survey:
      "~6–8s later every tool call fails: working directory no longer exists; Refusing to run there",
    kind: "ouster",
    note: "seeded: the nested lodger is locked out",
  },
  {
    id: "ouster",
    survey:
      "the booth is ouster — auto-clean yanks the worktree under a running child",
    kind: "ouster",
    note: "seeded: ouster — Score ouster or admit tenanted.",
  },
]);

export const BOOTH_STATIONS = BOOTH_STCTIONS;

export const FINGERPRINT_LINES = Object.freeze([
  "inherited-worktree-yank",
  "ouster",
  "inheritedWorktreePath",
  "spawnDepth-2",
  "worktreeCleanlyRemoved",
  "parent-no-changes",
  "child-refuses-cwd",
  "six-to-eight-seconds",
  "token-rerun-loss",
]);

export const COUSINS = Object.freeze([
  {
    issue: 41010,
    title:
      "Worktree isolation cleanup deletes parent session working directory on agent ID collision",
    state: "CLOSED",
    citeOnly: true,
    why: "Cite only — ID-prefix collision deleting the PARENT session cwd. Related but different. Do not rebuild. Do not conflate.",
  },
  {
    issue: 76377,
    title:
      "Background/bridge sessions leak .claude/worktrees worktrees: no cleanup or stale-lock reaping on the daemon kill/settle path",
    state: "CLOSED",
    citeOnly: true,
    why: "Cite only — leaked / uncleaned worktrees after daemon kill. Related but different (opposite polarity: leak, not yank under a living child). Do not rebuild. Do not conflate.",
  },
]);

export const BACKUPS = Object.freeze([
  { issue: 94029, title: "backup #94029 claude attach ignores DISABLE_MOUSE", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93987, title: "backup #93987 /reload-skills no changes", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93924, title: "backup #93924 Remote Control slows local", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93770, title: "backup #93770 TUI copy padding", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93777, title: "backup #93777 Vercel MCP teamId not forwarded", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94059, title: "backup #94059 bg tasks stale Running / ssh stdin hang", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94053, title: "backup #94053 desktop model picker skips Pre/PostModelSwitch", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94151, title: "backup #94151", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94064, title: "backup #94064", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
]);

export const NOT_PRODUCTS = Object.freeze([
  "proscription",
  "thimblerig",
  "fetchling",
  "souffleur",
  "epitome",
  "diabolica",
  "sallyport",
  "palilalia",
  "sepulchre",
  "sneck",
  "drawbridge",
  "chirograph",
  "titulus",
  "derelict",
  "vestry",
  "mondegreen",
  "afterimage",
  "phosphene",
  "scotoma",
  "scrim",
  "aphonia",
  "sourdine",
  "anarthria",
]);

export const SAMPLE_KIND_IDLE = "occupied";
export const SAMPLE_KIND_SEEDED = "inherited-worktree-yank";
export const SAMPLE_HOLDING_IDLE = "seated";
export const SAMPLE_HOLDING_SEEDED = "cleared";

export const SAMPLE_TENANTED_PROOF = Object.freeze({
  tenanted: true,
  ouster: false,
  inheritedWorktreeYank: false,
  inheritedWorktreePath: false,
  spawnDepth2: false,
  worktreeCleanlyRemoved: false,
  parentNoChanges: false,
  childRefusesCwd: false,
  sixToEightSeconds: false,
  tokenRerunLoss: false,
  kind: SAMPLE_KIND_IDLE,
});

export const SAMPLE_OUSTER_PROOF = Object.freeze({
  tenanted: false,
  ouster: true,
  inheritedWorktreeYank: true,
  inheritedWorktreePath: true,
  spawnDepth2: true,
  worktreeCleanlyRemoved: true,
  parentNoChanges: true,
  childRefusesCwd: true,
  sixToEightSeconds: true,
  tokenRerunLoss: true,
  kind: SAMPLE_KIND_SEEDED,
  names: WRIT_NAMES.map((row) => row.id),
});

export const SAMPLE_WALK_LOG = Object.freeze([
  { t: "idle", line: "booth holds tenanted: worktree retained while nested inheritor still runs; iron key stays in the lock" },
  { t: "spawn", line: "parent isolation:\"worktree\" starts in .claude/worktrees/agent-a59a…" },
  { t: "inherit", line: "parent calls Agent (background); child inherits inheritedWorktreePath, spawnDepth: 2" },
  { t: "path", line: "inherited-worktree-yank — parent-no-changes; worktreeCleanlyRemoved: true" },
  { t: "score", line: "when auto-clean yanks the worktree under a running child the booth is ouster — Score ouster or admit tenanted." },
]);

const FORCE_FLAGS = [
  "inheritedWorktreeYank",
  "inheritedWorktreePath",
  "spawnDepth2",
  "worktreeCleanlyRemoved",
  "parentNoChanges",
  "childRefusesCwd",
  "sixToEightSeconds",
  "tokenRerunLoss",
];

/**
 * Tenancy map: tenanted roll vs wrongful ouster.
 * Idle/tenanted: worktree stays while nested inheritor still runs.
 * Seeded/ouster: auto-clean yanks the worktree under a running child.
 */
export function mapTenancy(input = {}) {
  const ouster = isOusterInput(input);
  const tenanted = input.tenanted === true && !ouster;
  return {
    stamp: ouster ? "inherited-worktree-yank" : "tenanted-roll",
    holdingLane: ouster ? "cleared" : "seated",
    kindLane: ouster ? "inherited-worktree-yank" : "occupied",
    bindLane: ouster ? "worktree-cleanly-removed" : "locked",
    ribbon: ouster ? "ouster" : "tenanted",
    tenanted,
  };
}

export function inspectWrit(input = {}) {
  const served = isOusterInput(input);
  if (input.tenanted === true && !served) {
    return {
      stamp: "writ-unserved",
      served: false,
      note: "wax-seal notice stays in the desk — tenancy still held",
    };
  }
  return {
    stamp: served ? "writ-served" : "writ-idle",
    served,
    note: served
      ? "wax-seal eviction notice served on an occupied flat"
      : "",
  };
}

export function inspectRoll(input = {}) {
  const yanked = isOusterInput(input);
  if (input.tenanted === true && !yanked) {
    return {
      stamp: "roll-occupied",
      yanked: false,
      edge: "seated",
    };
  }
  return {
    stamp: yanked ? "roll-cleared" : "roll-idle",
    yanked,
    edge: yanked ? "cleared" : "seated",
    note: yanked
      ? "ink-stained ledger still lists the nested lodger; the bailiff stamped CLEANLY REMOVED"
      : "",
  };
}

export function inspectKey(input = {}) {
  const yanked =
    input.inheritedWorktreeYank === true ||
    input.ouster === true ||
    isOusterInput(input);
  if (input.tenanted === true && !yanked) {
    return {
      stamp: "key-locked",
      yanked: false,
    };
  }
  return {
    stamp: yanked ? "key-yanked" : "key-idle",
    yanked,
    note: yanked
      ? "iron key pulled from the lock while the nested lodger is still inside"
      : "",
  };
}

export function inspectDoor(input = {}) {
  const kicked =
    input.inheritedWorktreeYank === true ||
    input.ouster === true ||
    input.worktreeCleanlyRemoved === true ||
    isOusterInput(input);
  if (input.tenanted === true && !kicked) {
    return {
      stamp: "door-shut",
      kicked: false,
    };
  }
  return {
    stamp: kicked ? "door-kicked" : "door-idle",
    kicked,
    note: kicked
      ? "slate street door kicked in under a nested lodger"
      : "",
  };
}

export function inspectFlat(input = {}) {
  const evicted =
    input.ouster === true ||
    isOusterInput(input);
  if (input.tenanted === true && !evicted) {
    return {
      stamp: "flat-occupied",
      evicted: false,
    };
  }
  return {
    stamp: evicted ? "flat-cleared" : "flat-idle",
    evicted,
    note: evicted
      ? "occupied flat cleared while the tenant (nested child) is still inside"
      : "",
  };
}

export function inspectDesk(input = {}) {
  const served =
    input.ouster === true ||
    isOusterInput(input);
  if (input.tenanted === true && !served) {
    return {
      stamp: "desk-tenanted",
      served: false,
    };
  }
  return {
    stamp: served ? "desk-evicting" : "desk-idle",
    served,
    note: served
      ? "Georgian bailiff desk: writ served; tenancy roll stamped ouster"
      : "",
  };
}

function nameOpen(input, id) {
  const map = {
    inheritedWorktreePath: input.inheritedWorktreePath,
    "spawnDepth-2": input.spawnDepth2,
    worktreeCleanlyRemoved: input.worktreeCleanlyRemoved,
    "parent-no-changes": input.parentNoChanges,
    "child-refuses-cwd": input.childRefusesCwd,
    "inherited-worktree-yank": input.inheritedWorktreeYank,
  };
  return (
    map[id] === true ||
    input.inheritedWorktreeYank === true ||
    input.ouster === true
  );
}

function isOusterInput(input = {}) {
  return (
    input.ouster === true ||
    input.inheritedWorktreeYank === true ||
    input.inheritedWorktreePath === true ||
    input.spawnDepth2 === true ||
    input.worktreeCleanlyRemoved === true ||
    input.parentNoChanges === true ||
    input.childRefusesCwd === true ||
    input.sixToEightSeconds === true ||
    input.tokenRerunLoss === true
  );
}

export function readBooth(input = {}) {
  const ouster = isOusterInput(input);
  const tenanted = input.tenanted === true && !ouster;
  return {
    mark: ouster ? "ouster" : "tenanted",
    tenanted,
    ouster,
    inheritedWorktreeYank: input.inheritedWorktreeYank === true || ouster,
    inheritedWorktreePath: input.inheritedWorktreePath === true,
    spawnDepth2: input.spawnDepth2 === true,
    worktreeCleanlyRemoved: input.worktreeCleanlyRemoved === true,
    parentNoChanges: input.parentNoChanges === true,
    childRefusesCwd: input.childRefusesCwd === true,
    sixToEightSeconds: input.sixToEightSeconds === true,
    tokenRerunLoss: input.tokenRerunLoss === true,
    scope: mapTenancy(input),
    writ: inspectWrit(input),
    roll: inspectRoll(input),
    key: inspectKey(input),
    door: inspectDoor(input),
    flat: inspectFlat(input),
    desk: inspectDesk(input),
    names: WRIT_NAMES.filter((row) => nameOpen(input, row.id)).map(
      (row) => row.id,
    ),
    log: input.log || [],
  };
}

export const OUSTER_WALK = Object.freeze([
  {
    t: "idle",
    event: "tenancy-held",
    tenanted: true,
    ouster: false,
    cue: "tenanted",
    note: "idle HOLD: worktree retained while nested inheritor still runs — the hold/good path",
  },
  {
    t: "spawn",
    event: "parent-worktree-start",
    ouster: true,
    inheritedWorktreePath: true,
    cue: "ouster",
    note: "parent isolation:\"worktree\" starts in .claude/worktrees/agent-a59a… at 06:44:58",
  },
  {
    t: "inherit",
    event: "child-inherits",
    ouster: true,
    inheritedWorktreePath: true,
    spawnDepth2: true,
    cue: "ouster",
    note: "06:45:44 parent calls Agent (background); child inherits inheritedWorktreePath, spawnDepth: 2",
  },
  {
    t: "path",
    event: "inherited-worktree-yank",
    ouster: true,
    inheritedWorktreeYank: true,
    worktreeCleanlyRemoved: true,
    parentNoChanges: true,
    cue: "ouster",
    note: "inherited-worktree-yank — 06:45:50 parent ends with no changes; worktreeCleanlyRemoved: true",
  },
  {
    t: "score",
    event: "ouster",
    ouster: true,
    inheritedWorktreeYank: true,
    inheritedWorktreePath: true,
    spawnDepth2: true,
    worktreeCleanlyRemoved: true,
    parentNoChanges: true,
    childRefusesCwd: true,
    sixToEightSeconds: true,
    tokenRerunLoss: true,
    cue: "ouster",
    note: "ouster — 06:45:58 child stops; working directory no longer exists; Refusing to run there",
  },
]);

export const POSITIVE_CONTROL_WALK = Object.freeze([
  {
    t: "hold",
    event: "tenancy-held",
    tenanted: true,
    ouster: false,
    cue: "tenanted",
    note: "positive control: worktree retained; nested inheritor still seated; the roll is tenanted",
  },
  {
    t: "admit",
    event: "tenancy-held",
    tenanted: true,
    cue: "tenanted",
    note: "positive control: the roll admits tenanted",
  },
]);

function classifyFromSeed(seed) {
  if (seed && VERDICTS.includes(seed)) return seed;
  return null;
}

export function emptyTicket() {
  return {
    seed: IDLE_WORD,
    tenanted: true,
    ouster: false,
    inheritedWorktreeYank: false,
    cue: "tenanted",
  };
}

export function seedTenanted() {
  return { ...emptyTicket() };
}

export function seedOuster() {
  return {
    seed: SEEDED_WORD,
    tenanted: false,
    ouster: true,
    inheritedWorktreeYank: true,
    inheritedWorktreePath: true,
    spawnDepth2: true,
    worktreeCleanlyRemoved: true,
    parentNoChanges: true,
    childRefusesCwd: true,
    sixToEightSeconds: true,
    tokenRerunLoss: true,
    cue: "ouster",
    issue: FEATURED_ISSUE,
    proof: SAMPLE_OUSTER_PROOF,
  };
}

export function seedProduct() {
  return {
    seed: PRODUCT_WORD,
    preferSeed: true,
    ouster: true,
    inheritedWorktreeYank: true,
    worktreeCleanlyRemoved: true,
    cue: "ouster",
  };
}

export function seedInheritedWorktreeYank() {
  return {
    seed: PATH_WORD,
    preferSeed: true,
    ouster: true,
    inheritedWorktreeYank: true,
    event: "inherited-worktree-yank",
    cue: "ouster",
  };
}

export function seedHold() {
  return {
    seed: "hold",
    preferSeed: true,
    tenanted: true,
    cue: "tenanted",
  };
}

export function seedOccupied() {
  return {
    seed: "occupied",
    preferSeed: true,
    tenanted: true,
    cue: "tenanted",
  };
}

export function seedSeated() {
  return {
    seed: "seated",
    preferSeed: true,
    tenanted: true,
    cue: "tenanted",
  };
}

export function seedRetained() {
  return {
    seed: "retained",
    preferSeed: true,
    tenanted: true,
    cue: "tenanted",
  };
}

export function seedLocked() {
  return {
    seed: "locked",
    preferSeed: true,
    tenanted: true,
    cue: "tenanted",
  };
}

export function seedInhabited() {
  return {
    seed: "inhabited",
    preferSeed: true,
    tenanted: true,
    cue: "tenanted",
  };
}

export function seedInheritedWorktreePath() {
  return {
    seed: "inheritedWorktreePath",
    preferSeed: true,
    inheritedWorktreePath: true,
    cue: "ouster",
  };
}

export function seedSpawnDepth2() {
  return {
    seed: "spawnDepth-2",
    preferSeed: true,
    spawnDepth2: true,
    cue: "ouster",
  };
}

export function seedWorktreeCleanlyRemoved() {
  return {
    seed: "worktreeCleanlyRemoved",
    preferSeed: true,
    worktreeCleanlyRemoved: true,
    cue: "ouster",
  };
}

export function seedParentNoChanges() {
  return {
    seed: "parent-no-changes",
    preferSeed: true,
    parentNoChanges: true,
    cue: "ouster",
  };
}

export function seedChildRefusesCwd() {
  return {
    seed: "child-refuses-cwd",
    preferSeed: true,
    childRefusesCwd: true,
    cue: "ouster",
  };
}

export function seedSixToEightSeconds() {
  return {
    seed: "six-to-eight-seconds",
    preferSeed: true,
    sixToEightSeconds: true,
    cue: "ouster",
  };
}

export function seedTokenRerunLoss() {
  return {
    seed: "token-rerun-loss",
    preferSeed: true,
    tokenRerunLoss: true,
    cue: "ouster",
  };
}

export function normalizeBooth(raw) {
  if (!raw || typeof raw !== "object") {
    return {
      tenanted: false,
      ouster: false,
      inheritedWorktreeYank: false,
      inheritedWorktreePath: false,
      spawnDepth2: false,
      worktreeCleanlyRemoved: false,
      parentNoChanges: false,
      childRefusesCwd: false,
      sixToEightSeconds: false,
      tokenRerunLoss: false,
      cue: null,
      event: null,
      t: null,
    };
  }
  return {
    tenanted: raw.tenanted === true,
    ouster: raw.ouster === true || raw.event === "ouster",
    inheritedWorktreeYank:
      raw.inheritedWorktreeYank === true ||
      raw.event === "inherited-worktree-yank",
    inheritedWorktreePath:
      raw.inheritedWorktreePath === true ||
      raw.event === "inheritedWorktreePath",
    spawnDepth2:
      raw.spawnDepth2 === true || raw.event === "spawnDepth-2",
    worktreeCleanlyRemoved:
      raw.worktreeCleanlyRemoved === true ||
      raw.event === "worktreeCleanlyRemoved",
    parentNoChanges:
      raw.parentNoChanges === true || raw.event === "parent-no-changes",
    childRefusesCwd:
      raw.childRefusesCwd === true || raw.event === "child-refuses-cwd",
    sixToEightSeconds:
      raw.sixToEightSeconds === true ||
      raw.event === "six-to-eight-seconds",
    tokenRerunLoss:
      raw.tokenRerunLoss === true || raw.event === "token-rerun-loss",
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
      (ticket.tenanted != null ||
        ticket.ouster != null ||
        ticket.inheritedWorktreeYank != null ||
        ticket.inheritedWorktreePath != null ||
        ticket.spawnDepth2 != null ||
        ticket.worktreeCleanlyRemoved != null ||
        ticket.parentNoChanges != null ||
        ticket.childRefusesCwd != null ||
        ticket.sixToEightSeconds != null ||
        ticket.tokenRerunLoss != null ||
        ticket.cue != null ||
        ticket.event ||
        ticket.proof),
  );
}

function isTenanted(row) {
  if (row.ouster && row.cue !== "tenanted") return false;
  if (row.cue === "ouster" || row.cue === "inherited-worktree-yank") {
    return false;
  }
  if (
    row.inheritedWorktreeYank &&
    row.worktreeCleanlyRemoved &&
    row.cue !== "tenanted" &&
    row.tenanted !== true
  ) {
    return false;
  }
  if (
    row.tenanted === true &&
    row.ouster !== true &&
    row.cue !== "ouster"
  ) {
    return true;
  }
  if (
    row.cue === "tenanted" &&
    row.ouster !== true &&
    row.inheritedWorktreeYank !== true &&
    FORCE_FLAGS.every((flag) => row[flag] !== true)
  ) {
    return true;
  }
  return false;
}

function isInheritedWorktreeYank(row) {
  return (
    row.event === "inherited-worktree-yank" &&
    !isTenanted(row) &&
    (row.inheritedWorktreeYank === true ||
      row.worktreeCleanlyRemoved === true ||
      row.ouster === true)
  );
}

function isOusterRow(row) {
  if (isTenanted(row)) return false;
  if (isInheritedWorktreeYank(row) && row.cue !== "ouster") return false;
  if (row.cue === "ouster") return true;
  if (row.ouster === true) return true;
  if (row.inheritedWorktreeYank === true && row.worktreeCleanlyRemoved === true) {
    return true;
  }
  if (
    row.inheritedWorktreeYank === true ||
    row.inheritedWorktreePath === true ||
    row.spawnDepth2 === true ||
    row.worktreeCleanlyRemoved === true ||
    row.parentNoChanges === true ||
    row.childRefusesCwd === true ||
    row.sixToEightSeconds === true ||
    row.tokenRerunLoss === true
  ) {
    return true;
  }
  return false;
}

/**
 * Score one ouster pass against the tenancy roll.
 * tenanted: worktree retained while nested inheritor still runs.
 * ouster: auto-clean yanks the worktree under a running child.
 * inherited-worktree-yank: names that path.
 */
export function scoreGate(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const row = normalizeBooth(ticket);
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);

  let verdict = IDLE_WORD;
  if (
    isInheritedWorktreeYank(row) ||
    (row.inheritedWorktreeYank &&
      ticket.preferSeed &&
      seeded === PATH_WORD)
  ) {
    verdict = "inherited-worktree-yank";
  } else if (isOusterRow(row)) {
    verdict = "ouster";
  } else if (isTenanted(row)) {
    verdict = "tenanted";
  } else if (
    row.inheritedWorktreeYank ||
    row.inheritedWorktreePath ||
    row.spawnDepth2 ||
    row.worktreeCleanlyRemoved ||
    row.parentNoChanges ||
    row.childRefusesCwd ||
    row.sixToEightSeconds ||
    row.tokenRerunLoss
  ) {
    verdict = "ouster";
  }

  if (seeded && (!hasBoothFields(ticket) || ticket.preferSeed === true)) {
    verdict = seeded;
  }

  const hold = HOLD.includes(verdict);
  const writ = inspectWrit(row);
  const roll = inspectRoll(row);
  const key = inspectKey(row);
  const door = inspectDoor(row);
  const flat = inspectFlat(row);
  const desk = inspectDesk(row);
  return {
    verdict,
    idleWord: IDLE_WORD,
    pathWord: PATH_WORD,
    seededWord: SEEDED_WORD,
    productWord: PRODUCT_WORD,
    hold,
    alarm: !hold,
    recover: RECOVER.includes(verdict),
    tenanted: verdict === "tenanted" || verdict === "hold",
    ouster: verdict === "ouster" || verdict === SEEDED_WORD,
    inheritedWorktreeYank:
      row.inheritedWorktreeYank === true ||
      verdict === "inherited-worktree-yank" ||
      verdict === PATH_WORD,
    inheritedWorktreePath: row.inheritedWorktreePath,
    spawnDepth2: row.spawnDepth2,
    worktreeCleanlyRemoved: row.worktreeCleanlyRemoved,
    parentNoChanges: row.parentNoChanges,
    childRefusesCwd: row.childRefusesCwd,
    sixToEightSeconds: row.sixToEightSeconds,
    tokenRerunLoss: row.tokenRerunLoss,
    cue: hold
      ? "tenanted"
      : row.inheritedWorktreeYank || verdict === "inherited-worktree-yank"
        ? "inherited-worktree-yank"
        : "ouster",
    event: row.event,
    t: row.t,
    phrase: hold ? "admit tenanted" : "score ouster",
    writInspect: writ,
    rollInspect: roll,
    keyInspect: key,
    doorInspect: door,
    flatInspect: flat,
    deskInspect: desk,
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
      : OUSTER_WALK;
  const scored = rows.map((row) => ({
    ...normalizeBooth(row),
    ...scoreGate({ ...row, preferSeed: false }),
  }));
  const charged = scored.filter((row) => row.verdict === "ouster");
  const path = scored.filter((row) => row.verdict === "inherited-worktree-yank");
  const tenanted = scored.filter((row) => row.verdict === "tenanted");
  const headline =
    scored.find((row) => row.event === "ouster") ||
    scored.find((row) => row.event === "inherited-worktree-yank") ||
    scored.find((row) => row.event === "child-inherits") ||
    charged[charged.length - 1];
  let verdict = "tenanted";
  if (charged.length) verdict = "ouster";
  else if (path.length && !tenanted.length) {
    verdict = "inherited-worktree-yank";
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
    ousterCount: charged.length,
    pathCount: path.length,
    tenantedCount: tenanted.length,
    headline,
    rows: scored,
    phrase: HOLD.includes(verdict) ? "admit tenanted" : "score ouster",
    note: headline
      ? "Worktree auto-clean yanks a worktree still used by a running nested inheritor. Cousins cite-only: #41010 #76377 — do not rebuild, do not conflate."
      : "published ouster walk scored against tenanted vs ouster",
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
    seeded !== "tenanted" &&
    seeded !== "ouster" &&
    seeded !== "inherited-worktree-yank" &&
    ticket.tenanted == null &&
    ticket.ouster == null &&
    ticket.inheritedWorktreeYank == null &&
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
    tenanted: scored.tenanted ?? false,
    ouster: scored.ouster ?? false,
    inheritedWorktreeYank: scored.inheritedWorktreeYank ?? false,
    inheritedWorktreePath: scored.inheritedWorktreePath ?? false,
    spawnDepth2: scored.spawnDepth2 ?? false,
    worktreeCleanlyRemoved: scored.worktreeCleanlyRemoved ?? false,
    parentNoChanges: scored.parentNoChanges ?? false,
    childRefusesCwd: scored.childRefusesCwd ?? false,
    sixToEightSeconds: scored.sixToEightSeconds ?? false,
    tokenRerunLoss: scored.tokenRerunLoss ?? false,
  };
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
    result.worktreeCleanlyRemoved || result.ouster
      ? "kind=inherited-worktree-yank"
      : "kind=occupied",
    result.childRefusesCwd || result.ouster ? "ref=cleared" : "ref=seated",
    result.inheritedWorktreeYank || result.verdict === "inherited-worktree-yank"
      ? "path=inherited-worktree-yank"
      : "path=tenanted",
    result.cue === "tenanted"
      ? "cue=tenanted"
      : result.cue === "inherited-worktree-yank"
        ? "cue=inherited-worktree-yank"
        : "cue=ouster",
  ].join("|");
}

export function handle(input) {
  const result = analyze(input);
  const booth = readBooth({
    tenanted: result.tenanted,
    ouster: result.ouster,
    inheritedWorktreeYank: result.inheritedWorktreeYank,
    inheritedWorktreePath: result.inheritedWorktreePath,
    spawnDepth2: result.spawnDepth2,
    worktreeCleanlyRemoved: result.worktreeCleanlyRemoved,
    parentNoChanges: result.parentNoChanges,
    childRefusesCwd: result.childRefusesCwd,
    sixToEightSeconds: result.sixToEightSeconds,
    tokenRerunLoss: result.tokenRerunLoss,
    proof: input && input.proof,
    log: input && input.log,
  });
  return {
    ...result,
    fingerprint: fingerprint(input),
    booth,
    writ: inspectWrit({
      tenanted: result.tenanted,
      ouster: result.ouster,
      inheritedWorktreeYank: result.inheritedWorktreeYank,
    }),
    roll: inspectRoll({
      tenanted: result.tenanted,
      ouster: result.ouster,
      inheritedWorktreeYank: result.inheritedWorktreeYank,
    }),
    key: inspectKey({
      tenanted: result.tenanted,
      ouster: result.ouster,
      inheritedWorktreeYank: result.inheritedWorktreeYank,
    }),
    door: inspectDoor({
      tenanted: result.tenanted,
      ouster: result.ouster,
      inheritedWorktreeYank: result.inheritedWorktreeYank,
      worktreeCleanlyRemoved: result.worktreeCleanlyRemoved,
    }),
    flat: inspectFlat({
      tenanted: result.tenanted,
      ouster: result.ouster,
    }),
    desk: inspectDesk({
      tenanted: result.tenanted,
      ouster: result.ouster,
    }),
    scope: mapTenancy({
      tenanted: result.tenanted,
      ouster: result.ouster,
      inheritedWorktreeYank: result.inheritedWorktreeYank,
      inheritedWorktreePath: result.inheritedWorktreePath,
      spawnDepth2: result.spawnDepth2,
      worktreeCleanlyRemoved: result.worktreeCleanlyRemoved,
      parentNoChanges: result.parentNoChanges,
      childRefusesCwd: result.childRefusesCwd,
      sixToEightSeconds: result.sixToEightSeconds,
      tokenRerunLoss: result.tokenRerunLoss,
    }),
    stations: BOOTH_STATIONS.map((row) => ({
      ...row,
      ouster: result.ouster === true || result.verdict === "ouster",
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
      subagentModel: SUBAGENT_MODEL,
      os: OS,
      marks: FIELD_MARKS,
      names: WRIT_NAMES,
      ruledOut: [...RULED_OUT],
      expected: [...EXPECTED],
      distribution: DISTRIBUTION,
      stations: BOOTH_STATIONS,
      fingerprintLines: [...FINGERPRINT_LINES],
      cousins: COUSINS.map((row) => row.issue),
      backups: BACKUPS.map((row) => row.issue),
      phrase: PHRASE,
      hypothesis:
        "NON-BINDING: auto-clean treats parent-exit with no changes as a free yank of the shared worktree and does not hold a git worktree lock (or occupancy check) for a nested inheritor still running. Invite verify against #94221 text only. Do not claim a root cause in Claude Code source you have not seen.",
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
