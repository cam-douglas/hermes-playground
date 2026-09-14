#!/usr/bin/env node
/**
 * Lychgate — English parish lychgate (lich-gate) / covered churchyard
 * porch / coffin rest / parish roll / hanging lantern / iron latch /
 * burial path before the yard.
 *
 * Educational diagnostic model for a published Claude Code
 * background-task defect: a foreground Bash call that hits the 600s
 * timeout is moved to the background; the underlying shell later
 * exits (ps empty) but the Background tasks panel and /tasks still
 * say Running for 5–7 hours. TaskStop returns Successfully stopped
 * with the original command text. Stale task record. Second station:
 * a run_in_background Bash whose last command is a remote shell
 * (`ssh HOST 'md5sum …'`) with no stdin redirect hung ~9h56m because
 * the child gets an open stdin that never EOF; killing the ssh pid
 * completed with exit 0 + task-notification. Earlier chain commands
 * that redirected stdin completed.
 *
 * Encoded from anthropics/claude-code#94059 issue text only.
 * Hypothesis (NON-BINDING): moved-to-background Bash records stay
 * Running after the process exits (ps empty); run_in_background
 * remote ssh hangs on open stdin that never EOF. Invite verify
 * against issue text only. Do NOT claim a root cause in Claude Code
 * source you have not seen. Do NOT implement a fix. No network. No
 * exploits. No live Claude.
 *
 *   node lychgate.mjs data/lychgate.json
 *   echo '{"seed":"lychgate"}' | node lychgate.mjs
 *
 * Idle word is reaped (HOLD: process exit observed → panel shows
 * finished + notification).
 * HOLD aliases: buried, closed, finished, drained, exited.
 * Seeded word is lychgate (#94059 — the bg-task-stale path).
 * Path word is bg-task-stale.
 * Product score word is lychgate (Score lychgate or admit reaped.).
 *
 * NOT Ouster/#94221. NOT Proscription/#94202. NOT Thimblerig/#94174.
 * NOT Fetchling/#94065. NOT Souffleur/#94031. NOT Epitome/#94032.
 * NOT Diabolica/#94040. NOT Sallyport/#94082. NOT Palilalia/#94041.
 * NOT Sepulchre. NOT Sneck. NOT Drawbridge. NOT Chirograph.
 * NOT Titulus. NOT Derelict. NOT Vestry. NOT Mondegreen.
 * NOT Afterimage. NOT Phosphene. NOT Scotoma. NOT Scrim.
 * NOT Aphonia. NOT Sourdine. NOT Anarthria. NOT Revenant.
 * NOT Cenotaph. NOT Wraith. NOT Eidolon. NOT Husk. NOT Simulacrum.
 * Cousins cite-only (do NOT rebuild / do NOT conflate):
 * #75085 — RC completed bg tasks stay running badges.
 * #93948 — scheduled tasks stuck indefinitely.
 * #82151 — turn ends with bg tasks still running.
 * #75314 — bg Agent tasks stuck 34h.
 * #89766 — TaskStop task_id ambiguity.
 * Lychgate is specifically moved-to-background stale Running after
 * process exit, plus remote-ssh open-stdin hang.
 */

/* Browser-safe: no top-level node: imports. CLI I/O is loaded only in main(). */

export const VERDICTS = Object.freeze([
  "reaped",
  "lychgate",
  "bg-task-stale",
  "hold",
  "buried",
  "closed",
  "finished",
  "drained",
  "exited",
  "moved-to-background",
  "stale-running",
  "ps-empty",
  "taskstop-stale",
  "stdin-hang",
  "remote-ssh",
  "five-to-seven-hours",
  "nine-hours-fifty-six",
  "task-notification",
  "landing",
  "has-repro",
  "cousins",
  "backups",
  "fixtures",
  "walk",
]);

export const IDLE_WORD = "reaped";
export const PATH_WORD = "bg-task-stale";
export const SEEDED_WORD = "lychgate";
export const PRODUCT_WORD = "lychgate";
export const HOLD = Object.freeze(["reaped", "hold"]);
export const HOLD_ALIASES = Object.freeze([
  "buried",
  "closed",
  "finished",
  "drained",
  "exited",
]);
export const RECOVER = Object.freeze(["reaped", "hold"]);
export const ALARM = Object.freeze(
  VERDICTS.filter((name) => !HOLD.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FORBIDDEN_IDLE = Object.freeze([
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
  "vested",
  "plenary",
  "equalized",
  "legible",
  "calibrated",
  "engaged",
  "flush",
  "candid",
  "stetted",
  "sighted",
  "occupied",
  "seated",
  "retained",
  "locked",
  "inhabited",
  "ouster",
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
  "revenant",
  "cenotaph",
  "wraith",
  "eidolon",
  "husk",
  "simulacrum",
  "inherited-worktree-yank",
  "deny-list-hollow",
  "skill-row-carve",
  "skill-dollar-swap",
  "app-switch-echo-loss",
  "summarized-thinking-force",
  "cannot-show-not-git",
  "reminder-secret-bypass",
  "goal-stop-refire",
  "bash-nul-poison",
]);

export const FORBIDDEN_SEED = Object.freeze([
  "ouster",
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
  "revenant",
  "cenotaph",
  "wraith",
  "eidolon",
  "husk",
  "simulacrum",
  "inherited-worktree-yank",
  "deny-list-hollow",
  "skill-row-carve",
  "skill-dollar-swap",
  "app-switch-echo-loss",
  "summarized-thinking-force",
  "cannot-show-not-git",
  "reminder-secret-bypass",
  "goal-stop-refire",
  "bash-nul-poison",
]);

export const FEATURED_ISSUE = 94059;
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/94059";
export const TITLE =
  "Background tasks: moved-to-background commands stay 'Running' after the process exits; background remote-shell call hangs on open stdin";
export const STATE = "OPEN";
export const LABELS = Object.freeze([
  "bug",
  "has repro",
  "platform:macos",
  "area:bash",
  "area:agent-view",
]);
export const PLATFORM = "macos";
export const SURFACE = "bg-task-stale";
export const HOST =
  "Claude Code desktop 2.1.240 macOS Code tab; long session ~536 finished tasks / 14h";
export const CHECKED_ON =
  "Claude Code 2.1.240, desktop app (macOS 26.6.2, Apple silicon), Code tab.";
export const BUILD = "Claude Code 2.1.240 (macOS desktop, Code tab)";
export const SELECTED_MODEL = "claude-opus-5";
export const OS = "macOS";
export const PHRASE = "Score lychgate or admit reaped.";
export const DISTRIBUTION =
  "Two related problems with background Bash tasks in the desktop app (Code tab), observed in one long session (~536 finished tasks, 14 h). 1) A foreground Bash call that hits the 600 s timeout is \"moved to the background\" and then stays listed as Running forever, even after the underlying shell has exited. Three such entries sat in the Background tasks panel for 5–7 hours (\"Wait for warm re-run results — 7h 40m\", \"Wait for the four-line acceptance run — 6h 06m\", \"Wait for the 20:00 acceptance run — 5h 27m\"). ps showed no matching process for any of them; TaskStop on each id returned \"Successfully stopped\" with the original command text. So the task record is stale — the process was gone, the panel and the task list still said running. 2) A run_in_background Bash task whose last command was a remote shell call (ssh HOST 'md5sum …', no stdin redirection) hung for 9 h 56 min. The earlier commands in the same chain (ssh HOST 'cat > /tmp/x' < localfile) completed. Background tasks apparently give the child a stdin that never reaches EOF, so a plain ssh (which forwards stdin) blocks. Killing the ssh pid made the task complete with exit code 0 and a normal <task-notification>. If background tasks are meant to have no interactive stdin, </dev/null by default (or closing stdin) would avoid this; at minimum the panel should show that the process is blocked on stdin rather than \"running\".";

export const RULED_OUT = Object.freeze([
  "Ouster/#94221 inherited-worktree-yank — nested worktree auto-clean eviction; DIFFERENT",
  "Proscription/#94202 deny-list-hollow — subagent own frontmatter disallowedTools unused",
  "Thimblerig/#94174 skill-row-carve — /context Skills↔tools tally lie",
  "Fetchling/#94065 skill-dollar-swap — Skill-path $N conversation-fragment swap",
  "Souffleur/#94031 app-switch-echo-loss — VoiceOver typing echo after app switch",
  "Epitome/#94032 summarized-thinking-force — scriptorium abridgement",
  "Diabolica/#94040 cannot-show-not-git — worktree Bash inverted burden / false-guilt",
  "Sallyport/#94082 reminder-secret-bypass — mtime reminder dumps secrets past PreToolUse",
  "Palilalia/#94041 goal-stop-refire — /goal Stop hook re-fires stale text",
  "Sepulchre — bash-nul-poison; different vault, not a porch gate",
  "Sneck — chip-dismiss-ephemeral; different cottage latch",
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
  "Revenant — different return-from-death product",
  "Cenotaph — empty monument; different memorial",
  "Wraith — different shade product",
  "Eidolon — different image product",
  "Husk — different threshing product",
  "Simulacrum — different hyperreality product",
]);
export const EXPECTED = Object.freeze([
  "A moved-to-background task whose process exited should be marked finished (with its output) and produce the usual <task-notification>",
  "Background tasks should not hand the child an open stdin (or should document that they do), so ssh/cat-style commands don't hang silently",
  "Close stdin (/dev/null) by default if background tasks are meant to have no interactive stdin",
  "At minimum the panel should show blocked-on-stdin rather than Running",
  "ps empty + TaskStop Successfully stopped with original command text means the record is stale — reap it",
]);

export const FIELD_MARKS = Object.freeze([
  {
    id: "moved-to-background",
    label: "moved to background",
    count: "600s timeout → background ID",
    note: "Foreground Bash hits 600s timeout and is moved to the background",
  },
  {
    id: "stale-running",
    label: "stale Running",
    count: "panel + /tasks still Running",
    note: "Background tasks panel and /tasks still say Running after the shell exits",
  },
  {
    id: "ps-empty",
    label: "ps empty",
    count: "no matching process",
    note: "ps showed no matching process for any of the three stale entries",
  },
  {
    id: "taskstop-stale",
    label: "TaskStop stale",
    count: "Successfully stopped + original command",
    note: "TaskStop returns Successfully stopped with the original command text",
  },
  {
    id: "stdin-hang",
    label: "iron latch ajar",
    count: "~9h56m ssh hang",
    note: "run_in_background remote ssh with no stdin redirect hung on open stdin",
  },
  {
    id: "bg-task-stale",
    label: "bg-task-stale",
    count: "stale record under the porch",
    note: "Body gone from life; parish roll still lists it present under the gate",
  },
]);

export const PORCH_NAMES = Object.freeze([
  {
    id: "moved-to-background",
    lost: "Foreground Bash hits 600s timeout and is moved to the background",
    control: "Moved-to-background task is reaped when the shell exits",
    story: "the coffin is set down under the porch after the long walk",
  },
  {
    id: "stale-running",
    lost: "Panel + /tasks still say Running for 5–7 hours after the process exits",
    control: "Parish roll marks finished + task-notification when the body is gone",
    story: "the roll still names the bearer present under the gate",
  },
  {
    id: "ps-empty",
    lost: "ps showed no matching process; the body is gone from life",
    control: "Empty ps is enough to reap the record",
    story: "the bier is empty; the roll still lists a name",
  },
  {
    id: "taskstop-stale",
    lost: "TaskStop returns Successfully stopped with the original command text",
    control: "A stop that only reprints the command is a stale record, not a living task",
    story: "the sexton reads the old name and calls it stopped",
  },
  {
    id: "stdin-hang",
    lost: "run_in_background ssh HOST 'md5sum …' with no stdin redirect hung ~9h56m",
    control: "Close stdin (/dev/null) or show blocked-on-stdin, not Running",
    story: "the iron latch is left ajar; the bearer never finishes",
  },
  {
    id: "bg-task-stale",
    lost: "Stale task record: process gone, panel still Running",
    control: "Exited process → finished + task-notification",
    story: "lychgate — the body is gone; the porch still lists it present",
  },
]);

export const BOOTH_STCTIONS = Object.freeze([
  {
    id: "lychgate-porch",
    survey:
      "covered churchyard gateway; timber roof; stone piers; the body rests before burial",
    kind: "reaped",
    note: "idle: reaped — the hold/good path",
  },
  {
    id: "coffin-rest",
    survey:
      "coffin rest under the porch; process already exited; bier empty",
    kind: "lychgate",
    note: "seeded: empty bier still named on the roll",
  },
  {
    id: "parish-roll",
    survey:
      "parish roll still says Running for 5–7 hours after ps empty",
    kind: "lychgate",
    note: "seeded: stale Running on the roll",
  },
  {
    id: "lantern",
    survey:
      "hanging lantern over the porch; TaskStop reprints the original command",
    kind: "lychgate",
    note: "seeded: lantern still lit for a gone process",
  },
  {
    id: "iron-latch",
    survey:
      "iron latch left ajar — remote ssh hung ~9h56m on open stdin",
    kind: "lychgate",
    note: "seeded: stdin hang; bearer never finishes",
  },
  {
    id: "burial-path",
    survey:
      "bg-task-stale — exited process should finish + notify; the path beyond the gate",
    kind: "lychgate",
    note: "path: bg-task-stale names the stale record",
  },
]);

export const BOOTH_STATIONS = BOOTH_STCTIONS;

export const FINGERPRINT_LINES = Object.freeze([
  "bg-task-stale",
  "lychgate",
  "moved-to-background",
  "stale-running",
  "ps-empty",
  "taskstop-stale",
  "stdin-hang",
  "remote-ssh",
  "five-to-seven-hours",
  "nine-hours-fifty-six",
]);

export const COUSINS = Object.freeze([
  {
    issue: 75085,
    title:
      "[BUG] Remote-control sessions: completed background tasks remain as \"running\" badges and accumulate",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — RC completed bg tasks stay running badges. Related but different surface (RC badges, not desktop Code-tab moved-to-background stale record / ssh stdin hang). Do not rebuild. Do not conflate.",
  },
  {
    issue: 93948,
    title:
      "[BUG] Scheduled tasks in Claude Code Desktop can become stuck indefinitely, with no automatic recovery",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — scheduled tasks stuck. Related but different. Do not rebuild. Do not conflate.",
  },
  {
    issue: 82151,
    title:
      "Turn can end with background tasks still running, with no signal — \"assistant is done\" is indistinguishable from \"assistant still has live work\"",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — turn ends with bg tasks still running. Related but different (turn-end signal, not stale Running after process exit). Do not rebuild. Do not conflate.",
  },
  {
    issue: 75314,
    title:
      "10 background Agent tasks stuck running for 34+ hours, no way to cancel, burned ~1M tokens",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — bg Agent tasks stuck 34h. Related but different (Agent tasks, not Bash moved-to-background / ssh stdin). Do not rebuild. Do not conflate.",
  },
  {
    issue: 89766,
    title:
      "[Bug] TaskStop task_id ambiguity causes incorrect background task termination",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — TaskStop ambiguity. Related but different (wrong id killed, not Successfully stopped on a stale record). Do not rebuild. Do not conflate.",
  },
]);

export const BACKUPS = Object.freeze([
  { issue: 94029, title: "backup #94029 claude attach ignores DISABLE_MOUSE", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93987, title: "backup #93987 /reload-skills no changes", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93924, title: "backup #93924 Remote Control slows local", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93770, title: "backup #93770 TUI copy padding", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93777, title: "backup #93777 Vercel MCP teamId not forwarded", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94053, title: "backup #94053 desktop model picker skips Pre/PostModelSwitch", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94151, title: "backup #94151 Shift+PageUp/PageDown Konsole scrollback", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94064, title: "backup #94064 desktop full-disk find TCC prompts", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
]);

export const NOT_PRODUCTS = Object.freeze([
  "ouster",
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
  "revenant",
  "cenotaph",
  "wraith",
  "eidolon",
  "husk",
  "simulacrum",
]);

export const SAMPLE_KIND_IDLE = "buried";
export const SAMPLE_KIND_SEEDED = "bg-task-stale";
export const SAMPLE_HOLDING_IDLE = "finished";
export const SAMPLE_HOLDING_SEEDED = "stale-running";

export const SAMPLE_REAPED_PROOF = Object.freeze({
  reaped: true,
  lychgate: false,
  bgTaskStale: false,
  movedToBackground: false,
  staleRunning: false,
  psEmpty: false,
  taskstopStale: false,
  stdinHang: false,
  remoteSsh: false,
  fiveToSevenHours: false,
  nineHoursFiftySix: false,
  kind: SAMPLE_KIND_IDLE,
});

export const SAMPLE_LYCHGATE_PROOF = Object.freeze({
  reaped: false,
  lychgate: true,
  bgTaskStale: true,
  movedToBackground: true,
  staleRunning: true,
  psEmpty: true,
  taskstopStale: true,
  stdinHang: true,
  remoteSsh: true,
  fiveToSevenHours: true,
  nineHoursFiftySix: true,
  kind: SAMPLE_KIND_SEEDED,
  names: PORCH_NAMES.map((row) => row.id),
});

export const SAMPLE_WALK_LOG = Object.freeze([
  { t: "idle", line: "booth holds reaped: process exit observed; panel shows finished + notification; lantern dim" },
  { t: "timeout", line: "foreground Bash hits 600s timeout and is moved to the background" },
  { t: "exit", line: "underlying shell exits; ps empty; TaskStop Successfully stopped with original command" },
  { t: "path", line: "bg-task-stale — panel + /tasks still Running for 5–7 hours" },
  { t: "score", line: "when the body is gone and the roll still says Running the booth is lychgate — Score lychgate or admit reaped." },
]);

const FORCE_FLAGS = [
  "bgTaskStale",
  "movedToBackground",
  "staleRunning",
  "psEmpty",
  "taskstopStale",
  "stdinHang",
  "remoteSsh",
  "fiveToSevenHours",
  "nineHoursFiftySix",
];

/**
 * Parish map: reaped porch vs stale lychgate.
 * Idle/reaped: process exit observed → panel shows finished + notification.
 * Seeded/lychgate: moved-to-background stays Running after process exits.
 */
export function mapParish(input = {}) {
  const lychgate = isLychgateInput(input);
  const reaped = input.reaped === true && !lychgate;
  return {
    stamp: lychgate ? "bg-task-stale" : "reaped-porch",
    holdingLane: lychgate ? "stale-running" : "finished",
    kindLane: lychgate ? "bg-task-stale" : "buried",
    bindLane: lychgate ? "ps-empty" : "drained",
    ribbon: lychgate ? "lychgate" : "reaped",
    reaped,
  };
}

export function inspectPorch(input = {}) {
  const stale = isLychgateInput(input);
  if (input.reaped === true && !stale) {
    return {
      stamp: "porch-reaped",
      stale: false,
      note: "covered porch admits the body is gone; the roll is finished",
    };
  }
  return {
    stamp: stale ? "porch-stale" : "porch-idle",
    stale,
    note: stale
      ? "covered churchyard gateway still lists a name after the body has gone"
      : "",
  };
}

export function inspectBier(input = {}) {
  const empty =
    input.psEmpty === true ||
    input.lychgate === true ||
    isLychgateInput(input);
  if (input.reaped === true && !empty) {
    return {
      stamp: "bier-reaped",
      empty: false,
    };
  }
  return {
    stamp: empty ? "bier-empty" : "bier-idle",
    empty,
    note: empty
      ? "coffin rest is empty — process exited; the roll still names it present"
      : "",
  };
}

export function inspectRoll(input = {}) {
  const stale = isLychgateInput(input);
  if (input.reaped === true && !stale) {
    return {
      stamp: "roll-reaped",
      stale: false,
      edge: "finished",
    };
  }
  return {
    stamp: stale ? "roll-running" : "roll-idle",
    stale,
    edge: stale ? "stale-running" : "finished",
    note: stale
      ? "parish roll still says Running; ps empty; TaskStop reprints the original command"
      : "",
  };
}

export function inspectLantern(input = {}) {
  const hanging =
    input.staleRunning === true ||
    input.lychgate === true ||
    isLychgateInput(input);
  if (input.reaped === true && !hanging) {
    return {
      stamp: "lantern-dim",
      hanging: false,
    };
  }
  return {
    stamp: hanging ? "lantern-hung" : "lantern-idle",
    hanging,
    note: hanging
      ? "lantern still hung for a gone process — panel says Running"
      : "",
  };
}

export function inspectLatch(input = {}) {
  const ajar =
    input.stdinHang === true ||
    input.remoteSsh === true ||
    input.nineHoursFiftySix === true ||
    (input.lychgate === true && input.stdinHang !== false);
  if (input.reaped === true && !ajar) {
    return {
      stamp: "latch-shut",
      ajar: false,
    };
  }
  if (input.stdinHang === true || input.remoteSsh === true || input.nineHoursFiftySix === true) {
    return {
      stamp: "latch-ajar",
      ajar: true,
      note: "iron latch left ajar — remote ssh hung ~9h56m on open stdin",
    };
  }
  return {
    stamp: ajar && isLychgateInput(input) ? "latch-listed" : "latch-idle",
    ajar: false,
    note: "",
  };
}

export function inspectPath(input = {}) {
  const stale =
    input.bgTaskStale === true ||
    input.lychgate === true ||
    isLychgateInput(input);
  if (input.reaped === true && !stale) {
    return {
      stamp: "path-reaped",
      stale: false,
    };
  }
  return {
    stamp: stale ? "path-stale" : "path-idle",
    stale,
    note: stale
      ? "burial path named bg-task-stale — exited process never finished on the roll"
      : "",
  };
}

function nameOpen(input, id) {
  const map = {
    "moved-to-background": input.movedToBackground,
    "stale-running": input.staleRunning,
    "ps-empty": input.psEmpty,
    "taskstop-stale": input.taskstopStale,
    "stdin-hang": input.stdinHang,
    "bg-task-stale": input.bgTaskStale,
  };
  return (
    map[id] === true ||
    input.bgTaskStale === true ||
    input.lychgate === true
  );
}

function isLychgateInput(input = {}) {
  return (
    input.lychgate === true ||
    input.bgTaskStale === true ||
    input.movedToBackground === true ||
    input.staleRunning === true ||
    input.psEmpty === true ||
    input.taskstopStale === true ||
    input.stdinHang === true ||
    input.remoteSsh === true ||
    input.fiveToSevenHours === true ||
    input.nineHoursFiftySix === true
  );
}

export function readBooth(input = {}) {
  const lychgate = isLychgateInput(input);
  const reaped = input.reaped === true && !lychgate;
  return {
    mark: lychgate ? "lychgate" : "reaped",
    reaped,
    lychgate,
    bgTaskStale: input.bgTaskStale === true || lychgate,
    movedToBackground: input.movedToBackground === true,
    staleRunning: input.staleRunning === true,
    psEmpty: input.psEmpty === true,
    taskstopStale: input.taskstopStale === true,
    stdinHang: input.stdinHang === true,
    remoteSsh: input.remoteSsh === true,
    fiveToSevenHours: input.fiveToSevenHours === true,
    nineHoursFiftySix: input.nineHoursFiftySix === true,
    scope: mapParish(input),
    porch: inspectPorch(input),
    bier: inspectBier(input),
    roll: inspectRoll(input),
    lantern: inspectLantern(input),
    latch: inspectLatch(input),
    path: inspectPath(input),
    names: PORCH_NAMES.filter((row) => nameOpen(input, row.id)).map(
      (row) => row.id,
    ),
    log: input.log || [],
  };
}

export const LYCHGATE_WALK = Object.freeze([
  {
    t: "idle",
    event: "parish-reaped",
    reaped: true,
    lychgate: false,
    cue: "reaped",
    note: "idle HOLD: process exit observed → panel shows finished + notification — the hold/good path",
  },
  {
    t: "timeout",
    event: "moved-to-background",
    lychgate: true,
    movedToBackground: true,
    cue: "lychgate",
    note: "foreground Bash hits 600s timeout and is moved to the background",
  },
  {
    t: "exit",
    event: "ps-empty",
    lychgate: true,
    movedToBackground: true,
    psEmpty: true,
    taskstopStale: true,
    cue: "lychgate",
    note: "underlying shell exits; ps empty; TaskStop Successfully stopped with original command",
  },
  {
    t: "path",
    event: "bg-task-stale",
    lychgate: true,
    bgTaskStale: true,
    staleRunning: true,
    fiveToSevenHours: true,
    cue: "lychgate",
    note: "bg-task-stale — panel + /tasks still Running for 5–7 hours",
  },
  {
    t: "score",
    event: "lychgate",
    lychgate: true,
    bgTaskStale: true,
    movedToBackground: true,
    staleRunning: true,
    psEmpty: true,
    taskstopStale: true,
    stdinHang: true,
    remoteSsh: true,
    fiveToSevenHours: true,
    nineHoursFiftySix: true,
    cue: "lychgate",
    note: "lychgate — body gone; roll still Running; iron latch ajar on remote ssh",
  },
]);

export const POSITIVE_CONTROL_WALK = Object.freeze([
  {
    t: "hold",
    event: "parish-reaped",
    reaped: true,
    lychgate: false,
    cue: "reaped",
    note: "positive control: process exit observed; panel finished + notification; the porch is reaped",
  },
  {
    t: "admit",
    event: "parish-reaped",
    reaped: true,
    cue: "reaped",
    note: "positive control: the porch admits reaped",
  },
]);

function classifyFromSeed(seed) {
  if (seed && VERDICTS.includes(seed)) return seed;
  return null;
}

export function emptyTicket() {
  return {
    seed: IDLE_WORD,
    reaped: true,
    lychgate: false,
    bgTaskStale: false,
    cue: "reaped",
  };
}

export function seedReaped() {
  return { ...emptyTicket() };
}

export function seedLychgate() {
  return {
    seed: SEEDED_WORD,
    reaped: false,
    lychgate: true,
    bgTaskStale: true,
    movedToBackground: true,
    staleRunning: true,
    psEmpty: true,
    taskstopStale: true,
    stdinHang: true,
    remoteSsh: true,
    fiveToSevenHours: true,
    nineHoursFiftySix: true,
    cue: "lychgate",
    issue: FEATURED_ISSUE,
    proof: SAMPLE_LYCHGATE_PROOF,
  };
}

export function seedProduct() {
  return {
    seed: PRODUCT_WORD,
    preferSeed: true,
    lychgate: true,
    bgTaskStale: true,
    staleRunning: true,
    cue: "lychgate",
  };
}

export function seedBgTaskStale() {
  return {
    seed: PATH_WORD,
    preferSeed: true,
    lychgate: true,
    bgTaskStale: true,
    event: "bg-task-stale",
    cue: "lychgate",
  };
}

export function seedHold() {
  return {
    seed: "hold",
    preferSeed: true,
    reaped: true,
    cue: "reaped",
  };
}

export function seedBuried() {
  return {
    seed: "buried",
    preferSeed: true,
    reaped: true,
    cue: "reaped",
  };
}

export function seedClosed() {
  return {
    seed: "closed",
    preferSeed: true,
    reaped: true,
    cue: "reaped",
  };
}

export function seedFinished() {
  return {
    seed: "finished",
    preferSeed: true,
    reaped: true,
    cue: "reaped",
  };
}

export function seedDrained() {
  return {
    seed: "drained",
    preferSeed: true,
    reaped: true,
    cue: "reaped",
  };
}

export function seedExited() {
  return {
    seed: "exited",
    preferSeed: true,
    reaped: true,
    cue: "reaped",
  };
}

export function seedMovedToBackground() {
  return {
    seed: "moved-to-background",
    preferSeed: true,
    movedToBackground: true,
    cue: "lychgate",
  };
}

export function seedStaleRunning() {
  return {
    seed: "stale-running",
    preferSeed: true,
    staleRunning: true,
    cue: "lychgate",
  };
}

export function seedPsEmpty() {
  return {
    seed: "ps-empty",
    preferSeed: true,
    psEmpty: true,
    cue: "lychgate",
  };
}

export function seedTaskstopStale() {
  return {
    seed: "taskstop-stale",
    preferSeed: true,
    taskstopStale: true,
    cue: "lychgate",
  };
}

export function seedStdinHang() {
  return {
    seed: "stdin-hang",
    preferSeed: true,
    stdinHang: true,
    remoteSsh: true,
    nineHoursFiftySix: true,
    cue: "lychgate",
  };
}

export function seedRemoteSsh() {
  return {
    seed: "remote-ssh",
    preferSeed: true,
    remoteSsh: true,
    cue: "lychgate",
  };
}

export function seedFiveToSevenHours() {
  return {
    seed: "five-to-seven-hours",
    preferSeed: true,
    fiveToSevenHours: true,
    cue: "lychgate",
  };
}

export function seedNineHoursFiftySix() {
  return {
    seed: "nine-hours-fifty-six",
    preferSeed: true,
    nineHoursFiftySix: true,
    cue: "lychgate",
  };
}

export function seedTaskNotification() {
  return {
    seed: "task-notification",
    preferSeed: true,
    cue: "lychgate",
  };
}

export function normalizeBooth(raw) {
  if (!raw || typeof raw !== "object") {
    return {
      reaped: false,
      lychgate: false,
      bgTaskStale: false,
      movedToBackground: false,
      staleRunning: false,
      psEmpty: false,
      taskstopStale: false,
      stdinHang: false,
      remoteSsh: false,
      fiveToSevenHours: false,
      nineHoursFiftySix: false,
      cue: null,
      event: null,
      t: null,
    };
  }
  return {
    reaped: raw.reaped === true,
    lychgate: raw.lychgate === true || raw.event === "lychgate",
    bgTaskStale:
      raw.bgTaskStale === true || raw.event === "bg-task-stale",
    movedToBackground:
      raw.movedToBackground === true ||
      raw.event === "moved-to-background",
    staleRunning:
      raw.staleRunning === true || raw.event === "stale-running",
    psEmpty: raw.psEmpty === true || raw.event === "ps-empty",
    taskstopStale:
      raw.taskstopStale === true || raw.event === "taskstop-stale",
    stdinHang: raw.stdinHang === true || raw.event === "stdin-hang",
    remoteSsh: raw.remoteSsh === true || raw.event === "remote-ssh",
    fiveToSevenHours:
      raw.fiveToSevenHours === true ||
      raw.event === "five-to-seven-hours",
    nineHoursFiftySix:
      raw.nineHoursFiftySix === true ||
      raw.event === "nine-hours-fifty-six",
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
      (ticket.reaped != null ||
        ticket.lychgate != null ||
        ticket.bgTaskStale != null ||
        ticket.movedToBackground != null ||
        ticket.staleRunning != null ||
        ticket.psEmpty != null ||
        ticket.taskstopStale != null ||
        ticket.stdinHang != null ||
        ticket.remoteSsh != null ||
        ticket.fiveToSevenHours != null ||
        ticket.nineHoursFiftySix != null ||
        ticket.cue != null ||
        ticket.event ||
        ticket.proof),
  );
}

function isReaped(row) {
  if (row.lychgate && row.cue !== "reaped") return false;
  if (row.cue === "lychgate" || row.cue === "bg-task-stale") {
    return false;
  }
  if (
    row.bgTaskStale &&
    row.staleRunning &&
    row.cue !== "reaped" &&
    row.reaped !== true
  ) {
    return false;
  }
  if (
    row.reaped === true &&
    row.lychgate !== true &&
    row.cue !== "lychgate"
  ) {
    return true;
  }
  if (
    row.cue === "reaped" &&
    row.lychgate !== true &&
    row.bgTaskStale !== true &&
    FORCE_FLAGS.every((flag) => row[flag] !== true)
  ) {
    return true;
  }
  return false;
}

function isBgTaskStale(row) {
  return (
    row.event === "bg-task-stale" &&
    !isReaped(row) &&
    (row.bgTaskStale === true ||
      row.staleRunning === true ||
      row.lychgate === true)
  );
}

function isLychgateRow(row) {
  if (isReaped(row)) return false;
  if (isBgTaskStale(row) && row.cue !== "lychgate") return false;
  if (row.cue === "lychgate") return true;
  if (row.lychgate === true) return true;
  if (row.bgTaskStale === true && row.staleRunning === true) {
    return true;
  }
  if (
    row.bgTaskStale === true ||
    row.movedToBackground === true ||
    row.staleRunning === true ||
    row.psEmpty === true ||
    row.taskstopStale === true ||
    row.stdinHang === true ||
    row.remoteSsh === true ||
    row.fiveToSevenHours === true ||
    row.nineHoursFiftySix === true
  ) {
    return true;
  }
  return false;
}

/**
 * Score one lychgate pass against the parish roll.
 * reaped: process exit observed → panel shows finished + notification.
 * lychgate: moved-to-background stays Running after process exits.
 * bg-task-stale: names that path.
 */
export function scoreGate(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const row = normalizeBooth(ticket);
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);

  let verdict = IDLE_WORD;
  if (
    isBgTaskStale(row) ||
    (row.bgTaskStale &&
      ticket.preferSeed &&
      seeded === PATH_WORD)
  ) {
    verdict = "bg-task-stale";
  } else if (isLychgateRow(row)) {
    verdict = "lychgate";
  } else if (isReaped(row)) {
    verdict = "reaped";
  } else if (
    row.bgTaskStale ||
    row.movedToBackground ||
    row.staleRunning ||
    row.psEmpty ||
    row.taskstopStale ||
    row.stdinHang ||
    row.remoteSsh ||
    row.fiveToSevenHours ||
    row.nineHoursFiftySix
  ) {
    verdict = "lychgate";
  }

  if (seeded && (!hasBoothFields(ticket) || ticket.preferSeed === true)) {
    verdict = seeded;
  }

  const hold = HOLD.includes(verdict);
  const porch = inspectPorch(row);
  const bier = inspectBier(row);
  const roll = inspectRoll(row);
  const lantern = inspectLantern(row);
  const latch = inspectLatch(row);
  const path = inspectPath(row);
  return {
    verdict,
    idleWord: IDLE_WORD,
    pathWord: PATH_WORD,
    seededWord: SEEDED_WORD,
    productWord: PRODUCT_WORD,
    hold,
    alarm: !hold,
    recover: RECOVER.includes(verdict),
    reaped: verdict === "reaped" || verdict === "hold",
    lychgate: verdict === "lychgate" || verdict === SEEDED_WORD,
    bgTaskStale:
      row.bgTaskStale === true ||
      verdict === "bg-task-stale" ||
      verdict === PATH_WORD,
    movedToBackground: row.movedToBackground,
    staleRunning: row.staleRunning,
    psEmpty: row.psEmpty,
    taskstopStale: row.taskstopStale,
    stdinHang: row.stdinHang,
    remoteSsh: row.remoteSsh,
    fiveToSevenHours: row.fiveToSevenHours,
    nineHoursFiftySix: row.nineHoursFiftySix,
    cue: hold
      ? "reaped"
      : row.bgTaskStale || verdict === "bg-task-stale"
        ? "bg-task-stale"
        : "lychgate",
    event: row.event,
    t: row.t,
    phrase: hold ? "admit reaped" : "score lychgate",
    porchInspect: porch,
    bierInspect: bier,
    rollInspect: roll,
    lanternInspect: lantern,
    latchInspect: latch,
    pathInspect: path,
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
      : LYCHGATE_WALK;
  const scored = rows.map((row) => ({
    ...normalizeBooth(row),
    ...scoreGate({ ...row, preferSeed: false }),
  }));
  const charged = scored.filter((row) => row.verdict === "lychgate");
  const path = scored.filter((row) => row.verdict === "bg-task-stale");
  const reaped = scored.filter((row) => row.verdict === "reaped");
  const headline =
    scored.find((row) => row.event === "lychgate") ||
    scored.find((row) => row.event === "bg-task-stale") ||
    scored.find((row) => row.event === "moved-to-background") ||
    charged[charged.length - 1];
  let verdict = "reaped";
  if (charged.length) verdict = "lychgate";
  else if (path.length && !reaped.length) {
    verdict = "bg-task-stale";
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
    lychgateCount: charged.length,
    pathCount: path.length,
    reapedCount: reaped.length,
    headline,
    rows: scored,
    phrase: HOLD.includes(verdict) ? "admit reaped" : "score lychgate",
    note: headline
      ? "Moved-to-background Bash stays Running after process exits. Cousins cite-only: #75085 #93948 #82151 #75314 #89766 — do not rebuild, do not conflate."
      : "published lychgate walk scored against reaped vs lychgate",
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
    seeded !== "reaped" &&
    seeded !== "lychgate" &&
    seeded !== "bg-task-stale" &&
    ticket.reaped == null &&
    ticket.lychgate == null &&
    ticket.bgTaskStale == null &&
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
    reaped: scored.reaped ?? false,
    lychgate: scored.lychgate ?? false,
    bgTaskStale: scored.bgTaskStale ?? false,
    movedToBackground: scored.movedToBackground ?? false,
    staleRunning: scored.staleRunning ?? false,
    psEmpty: scored.psEmpty ?? false,
    taskstopStale: scored.taskstopStale ?? false,
    stdinHang: scored.stdinHang ?? false,
    remoteSsh: scored.remoteSsh ?? false,
    fiveToSevenHours: scored.fiveToSevenHours ?? false,
    nineHoursFiftySix: scored.nineHoursFiftySix ?? false,
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
    result.staleRunning || result.lychgate
      ? "kind=bg-task-stale"
      : "kind=buried",
    result.psEmpty || result.lychgate ? "ref=stale-running" : "ref=finished",
    result.bgTaskStale || result.verdict === "bg-task-stale"
      ? "path=bg-task-stale"
      : "path=reaped",
    result.cue === "reaped"
      ? "cue=reaped"
      : result.cue === "bg-task-stale"
        ? "cue=bg-task-stale"
        : "cue=lychgate",
  ].join("|");
}

export function handle(input) {
  const result = analyze(input);
  const booth = readBooth({
    reaped: result.reaped,
    lychgate: result.lychgate,
    bgTaskStale: result.bgTaskStale,
    movedToBackground: result.movedToBackground,
    staleRunning: result.staleRunning,
    psEmpty: result.psEmpty,
    taskstopStale: result.taskstopStale,
    stdinHang: result.stdinHang,
    remoteSsh: result.remoteSsh,
    fiveToSevenHours: result.fiveToSevenHours,
    nineHoursFiftySix: result.nineHoursFiftySix,
    proof: input && input.proof,
    log: input && input.log,
  });
  return {
    ...result,
    fingerprint: fingerprint(input),
    booth,
    porch: inspectPorch({
      reaped: result.reaped,
      lychgate: result.lychgate,
      bgTaskStale: result.bgTaskStale,
    }),
    bier: inspectBier({
      reaped: result.reaped,
      lychgate: result.lychgate,
      bgTaskStale: result.bgTaskStale,
      psEmpty: result.psEmpty,
    }),
    roll: inspectRoll({
      reaped: result.reaped,
      lychgate: result.lychgate,
      bgTaskStale: result.bgTaskStale,
    }),
    lantern: inspectLantern({
      reaped: result.reaped,
      lychgate: result.lychgate,
      staleRunning: result.staleRunning,
    }),
    latch: inspectLatch({
      reaped: result.reaped,
      lychgate: result.lychgate,
      stdinHang: result.stdinHang,
      remoteSsh: result.remoteSsh,
      nineHoursFiftySix: result.nineHoursFiftySix,
    }),
    path: inspectPath({
      reaped: result.reaped,
      lychgate: result.lychgate,
      bgTaskStale: result.bgTaskStale,
    }),
    scope: mapParish({
      reaped: result.reaped,
      lychgate: result.lychgate,
      bgTaskStale: result.bgTaskStale,
      movedToBackground: result.movedToBackground,
      staleRunning: result.staleRunning,
      psEmpty: result.psEmpty,
      taskstopStale: result.taskstopStale,
      stdinHang: result.stdinHang,
      remoteSsh: result.remoteSsh,
      fiveToSevenHours: result.fiveToSevenHours,
      nineHoursFiftySix: result.nineHoursFiftySix,
    }),
    stations: BOOTH_STATIONS.map((row) => ({
      ...row,
      lychgate: result.lychgate === true || result.verdict === "lychgate",
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
      names: PORCH_NAMES,
      ruledOut: [...RULED_OUT],
      expected: [...EXPECTED],
      distribution: DISTRIBUTION,
      stations: BOOTH_STATIONS,
      fingerprintLines: [...FINGERPRINT_LINES],
      cousins: COUSINS.map((row) => row.issue),
      backups: BACKUPS.map((row) => row.issue),
      phrase: PHRASE,
      hypothesis:
        "NON-BINDING: moved-to-background Bash records stay Running after the process exits (ps empty); run_in_background remote ssh hangs on open stdin that never EOF. Invite verify against #94059 text only. Do not claim a root cause in Claude Code source you have not seen.",
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
