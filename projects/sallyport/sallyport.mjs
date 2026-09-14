#!/usr/bin/env node
/**
 * Sallyport — fortress sallyport / gatehouse / iron-grille side
 * passage / torch-lit stone corridor / sealed strongroom.
 *
 * Educational diagnostic model for a published Claude Code defect:
 * A PreToolUse Bash hook that blocks cat/grep/head/tail/etc. against
 * secret paths (.env*, ~/.vercel, ~/.fly, designated secrets dirs)
 * can be silently bypassed by a different unguarded surface: the
 * harness's own "this file changed on disk since you last read it"
 * notification. Sequence: (1) agent edits a secrets file with a
 * scoped non-printing method (sed -i, confirm via awk key name +
 * value length only); (2) user has the same file open in another
 * editor (nano) so mtime changes; (3) harness injects a
 * <system-reminder> showing the file's full current contents (every
 * key AND value) as an unrequested "here's what changed" diff;
 * (4) this is NOT a tool call, so PreToolUse never runs; (5) ten
 * live production credentials ended up in the transcript and had
 * to be rotated. The hook gives a false sense of coverage — it
 * stops bad shell commands while leaving a systemic harness-injection
 * vector open that does not require the agent to err.
 *
 *   node sallyport.mjs data/sallyport.json
 *   echo '{"seed":"sallyport"}' | node sallyport.mjs
 *
 * Idle word is sealed (HOLD: redacted / guarded / hush / gate-checked).
 * Seeded word is sallyport (#94082 — the reminder-secret-bypass path).
 * Path word is reminder-secret-bypass.
 * Product score word is sallyport (Score sallyport or admit sealed.).
 *
 * Encoded from anthropics/claude-code#94082 issue text only.
 * Hypothesis (NON-BINDING): harness file-change reminder injects
 * full file contents into context without consulting secret-path /
 * PreToolUse deny rules because it is not a tool call. Invite verify
 * against #94082 text only.
 * Do NOT claim a root cause in Claude Code source you have not seen.
 * Do NOT implement a fix. No network. No exploits. No live Claude.
 * No secrets. Fixture credentials are FAKE_KEY_REDACTED placeholders.
 *
 * NOT Palilalia/#94041 (goal-stop-refire).
 * NOT Sepulchre/#94055 (bash-nul-poison).
 * NOT Sneck/#94052. NOT Drawbridge/#94049. NOT Chirograph/#94045.
 * NOT Titulus/#94025. NOT Derelict/#93996. NOT Vestry/#94008.
 * NOT Surfeit/#94012. NOT Phosphene/#94003. NOT Scotoma.
 * NOT Postern (slug already used). NOT Portcullis / Wicket / Embrasure.
 * Cousins cite-only: #92074 (PreToolUse silent miss in VS Code),
 * #92487 (.env protection feature request), #88441 (PreToolUse never
 * fires for Bash inside Task subagents), #89716 (PreToolUse can't
 * reach Bash file-command recognition), #92365 (bad sandbox deny
 * entry silently disables PreToolUse).
 * Sallyport is specifically: PreToolUse blocks Bash reads of secrets;
 * mtime "file changed on disk" reminder still dumps full contents.
 */

/* Browser-safe: no top-level node: imports. CLI I/O is loaded only in main(). */

export const VERDICTS = Object.freeze([
  "sealed",
  "sallyport",
  "reminder-secret-bypass",
  "hold",
  "redacted",
  "guarded",
  "hush",
  "gate-checked",
  "pretooluse-locked",
  "mtime-nudge",
  "system-reminder",
  "full-contents-dump",
  "ten-keys",
  "not-a-tool-call",
  "false-coverage",
  "landing",
  "has-repro",
  "cousins",
  "backups",
  "fixtures",
  "walk",
]);

export const IDLE_WORD = "sealed";
export const PATH_WORD = "reminder-secret-bypass";
export const SEEDED_WORD = "sallyport";
export const PRODUCT_WORD = "sallyport";
export const HOLD = Object.freeze(["sealed", "hold"]);
export const HOLD_ALIASES = Object.freeze([
  "sealed",
  "redacted",
  "guarded",
  "hush",
  "gate-checked",
]);
export const RECOVER = Object.freeze(["sealed", "hold"]);
export const ALARM = Object.freeze(
  VERDICTS.filter((name) => !HOLD.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FORBIDDEN_IDLE = Object.freeze([
  "silenced",
  "living",
  "cleared",
  "spanned",
  "matched",
  "inscribed",
  "berthed",
  "pegged",
  "tempered",
  "quiescent",
  "palilalia",
  "sepulchre",
  "sneck",
  "drawbridge",
  "chirograph",
  "titulus",
  "derelict",
  "vestry",
  "surfeit",
  "phosphene",
  "scotoma",
  "postern",
  "portcullis",
  "wicket",
  "embrasure",
  "goal-stop-refire",
  "bash-nul-poison",
  "chip-dismiss-ephemeral",
  "rc-bridge-update-drop",
  "worktree-rename-stale",
  "resume-stale-title",
  "session-kill-orphan",
  "mount-refcount-race",
  "quota-spawn-cascade",
  "layer-tree-walk",
  "acknowledged",
  "stood-down",
  "met",
  "once",
  "unsealed",
  "breathing",
  "open-vault",
  "intact",
  "undone",
  "open-latch",
  "stayed-off",
  "withheld",
  "open-span",
  "linked",
  "moored",
  "joined",
  "bipartite",
  "moiety",
  "indenture",
  "current",
  "diplomatic",
  "demesned",
  "diagrammed",
  "unattainted",
  "reflowed",
  "articulate",
  "limber",
  "filiated",
  "injective",
  "unitary",
  "verbatim",
  "plenary",
  "vested",
  "singular",
  "equalized",
  "legible",
  "calibrated",
  "tethered",
  "engaged",
  "flush",
  "candid",
  "stetted",
  "lit",
  "primed",
  "raised",
  "preserved",
  "tokenized",
  "sprung",
  "unpinned",
  "latched",
  "liveried",
  "stamped",
  "emptied",
  "warm",
  "mounted",
  "traced",
  "damped",
  "afloat",
  "concordant",
  "routed",
  "bound",
  "honest",
  "fossed",
  "scapegoated",
  "accreted",
  "mismatched",
  "inherited",
  "washed",
  "mondegreen",
  "diplopia",
  "fulcrum",
  "followspot",
  "parablepsis",
  "demesne",
  "cartouche",
  "attaint",
  "oriel",
  "anarthria",
  "trismus",
  "foundling",
  "crasis",
  "tessera",
  "mojibake",
  "scissel",
  "feoffee",
  "apograph",
  "fibula",
  "cockade",
  "hasp",
  "snib",
  "bulla",
  "livery",
]);

export const FORBIDDEN_SEED = Object.freeze(
  FORBIDDEN_IDLE.filter((name) => name !== "sallyport"),
);

export const FEATURED_ISSUE = 94082;
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/94082";
export const TITLE =
  "Security: automatic 'file changed on disk' notification bypasses secret-file PreToolUse hook, leaking full credential file to transcript";
export const STATE = "OPEN";
export const LABELS = Object.freeze([
  "bug",
  "has-repro",
  "platform:macos",
  "area:security",
  "area:hooks",
]);
export const PLATFORM = "macos";
export const SURFACE = "reminder-secret-bypass";
export const HOST = "Claude Code CLI harness file-change <system-reminder>";
export const CHECKED_ON =
  "Claude Code CLI, non-interactive/agent SDK session; macOS (Darwin 24.6.0)";
export const BUILD = "Claude Code CLI";
export const SELECTED_MODEL = "unspecified (issue does not pin a model)";
export const OS = "macos";
export const PHRASE = "Score sallyport or admit sealed.";
export const DISTRIBUTION =
  "A PreToolUse Bash hook that blocks cat/grep without -c/head/tail/less/more/bat/xxd/od/hexdump/echo/printf against secret paths (.env files, ~/.vercel, ~/.fly, a project's designated secrets directory, ~/.artefakt-secrets) can be silently bypassed by the harness's own \"this file changed on disk since you last read it\" notification. Sequence: (1) agent edits ~/.artefakt-secrets/.env.production.local with sed -i on a specific line, confirmed afterward only by printing a key name and value length via awk, never the value itself; (2) user has the same file open concurrently in nano in a separate terminal; (3) mtime changes; harness file-tracking notices; (4) harness injects a <system-reminder> showing the file's full current contents — every key AND every value — as an unrequested \"here's what changed\" diff; (5) this is not a tool call, so the PreToolUse Bash hook never runs; (6) ten live production credentials ended up in the transcript and had to be rotated. The hook gives a false sense of coverage: it stops bad shell commands while leaving a systemic harness-injection vector open that does not require the agent to err. Suggested fix (document only): file-change notifications should respect the same secret-path awareness — suppress the content diff for secret patterns, or route through the same redaction/blocking before model context.";

export const RULED_OUT = Object.freeze([
  "Palilalia/#94041 goal-stop-refire — /goal Stop hook re-fires stale text",
  "Sepulchre/#94055 bash-nul-poison — Bash NUL truncates the next request body",
  "Sneck/#94052 chip-dismiss-ephemeral — Hide→X chip dismiss, not secret dump",
  "Drawbridge/#94049 rc-bridge-update-drop — machine-wide Remote Control span",
  "Chirograph/#94045 worktree-rename-stale — recorded branch never refreshed",
  "Titulus/#94025 resume-stale-title — iOS rename vs desktop sidebar title",
  "Derelict/#93996 session-kill-orphan — Bash-tool subprocesses survive stop",
  "Vestry/#94008 mount-refcount-race — Linux bwrap placeholder Set",
  "Surfeit/#94012 quota-spawn-cascade — orchestrator spawn after session-limit",
  "Phosphene/#94003 layer-tree-walk — WindowServer CA thrash",
  "Scotoma — /goal lived only in command-args; different defect",
  "Postern — night bailey / postern-gate; slug already used",
  "Portcullis / Wicket / Embrasure — different fortress-gate paradigms",
]);
export const EXPECTED = Object.freeze([
  "File-change notifications should respect the same secret-path awareness the PreToolUse hook already has",
  "For a path matching known secret-file patterns (.env*, credential directories), suppress the automatic content diff",
  "Or say only \"this file changed on disk, re-read explicitly if needed\" without content",
  "Or route the reminder through the same redaction/blocking logic the Bash hook uses before model context",
  "A PreToolUse hook must not give a false sense of coverage while an unguarded harness injection still dumps secrets",
]);

export const FIELD_MARKS = Object.freeze([
  {
    id: "pretooluse-locked",
    label: "PreToolUse locked",
    count: "Bash cat/grep/head/tail blocked",
    note: "Hook blocks printing known secret files via Bash — .env*, ~/.vercel, ~/.fly, designated secrets dirs",
  },
  {
    id: "mtime-nudge",
    label: "mtime nudge",
    count: "nano + sed -i",
    note: "User had the same file open in nano; mtime changed; harness file-tracking noticed",
  },
  {
    id: "system-reminder",
    label: "system-reminder",
    count: "not a tool call",
    note: "Harness injects <system-reminder> with a \"here's what changed\" diff; PreToolUse never runs",
  },
  {
    id: "full-contents-dump",
    label: "full contents dump",
    count: "every key AND value",
    note: "Reminder shows the file's full current contents — not a scoped awk length check",
  },
  {
    id: "ten-keys",
    label: "ten keys",
    count: "10 credentials rotated",
    note: "Ten live production credentials ended up in the transcript and had to be rotated",
  },
]);

export const BOOTH_STATIONS = Object.freeze([
  {
    id: "sealed-gate",
    survey:
      "gatehouse stays sealed; PreToolUse grille locked; strongroom keys stay redacted silhouettes",
    kind: "sealed",
    note: "idle: sealed — the hold/good path",
  },
  {
    id: "pretooluse-locked",
    survey:
      "main gate stays LOCKED — Bash cat/grep/head/tail against secret paths is blocked",
    kind: "sallyport",
    note: "seeded: the main gate still holds",
  },
  {
    id: "reminder-secret-bypass",
    survey:
      "mtime reminder injects a <system-reminder> with full secret contents past the locked gate",
    kind: "sallyport",
    note: "path: reminder-secret-bypass names the side door",
  },
  {
    id: "full-contents-dump",
    survey:
      "every key AND value marches into the transcript; ten credentials must be rotated",
    kind: "sallyport",
    note: "seeded: full-contents-dump of the published leak",
  },
  {
    id: "sallyport",
    survey:
      "the booth is sallyport — the side passage is open while the main gate stays locked",
    kind: "sallyport",
    note: "seeded: sallyport — Score sallyport or admit sealed.",
  },
]);

export const FINGERPRINT_LINES = Object.freeze([
  "reminder-secret-bypass",
  "sallyport",
  "pretooluse-locked",
  "mtime-nudge",
  "system-reminder",
  "full-contents-dump",
  "ten-keys",
  "not-a-tool-call",
  "false-coverage",
]);

export const COUSINS = Object.freeze([
  {
    issue: 92074,
    title: "PreToolUse silent miss in VS Code",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — PreToolUse silent miss in VS Code. Different surface. Do not conflate with harness file-change reminder injection.",
  },
  {
    issue: 92487,
    title: ".env protection feature request",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — .env protection feature request. Adjacent topic, not the mtime reminder bypass.",
  },
  {
    issue: 88441,
    title: "PreToolUse never fires for Bash inside Task subagents",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — PreToolUse never fires for Bash inside Task subagents. Different miss: subagent Bash, not harness reminder.",
  },
  {
    issue: 89716,
    title: "PreToolUse can't reach Bash file-command recognition",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — PreToolUse can't reach Bash file-command recognition. Tool-call recognition gap, not a non-tool injection.",
  },
  {
    issue: 92365,
    title: "bad sandbox deny entry silently disables PreToolUse",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — bad sandbox deny entry silently disables PreToolUse. Hook disabled, not bypassed by a reminder.",
  },
]);

export const BACKUPS = Object.freeze([
  { issue: 94040, title: "backup #94040", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94032, title: "backup #94032", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94031, title: "backup #94031", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94029, title: "backup #94029", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93987, title: "backup #93987", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93924, title: "backup #93924", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93770, title: "backup #93770", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93777, title: "backup #93777", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94059, title: "backup #94059", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94053, title: "backup #94053", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
]);

export const NOT_PRODUCTS = Object.freeze([
  "palilalia",
  "sepulchre",
  "sneck",
  "drawbridge",
  "chirograph",
  "titulus",
  "derelict",
  "vestry",
  "surfeit",
  "phosphene",
  "scotoma",
  "postern",
  "portcullis",
  "wicket",
  "embrasure",
  "parablepsis",
  "demesne",
  "cartouche",
  "attaint",
  "oriel",
  "anarthria",
  "trismus",
  "foundling",
  "crasis",
  "tessera",
  "mojibake",
]);

export const SAMPLE_KIND_IDLE = "gate-checked";
export const SAMPLE_KIND_SEEDED = "reminder-secret-bypass";
export const SAMPLE_HOLDING_IDLE = "redacted";
export const SAMPLE_HOLDING_SEEDED = "leaked";

export const FAKE_SECRET_KEYS = Object.freeze([
  "SUPABASE_SERVICE_ROLE=FAKE_KEY_REDACTED",
  "SUPABASE_MANAGEMENT_TOKEN=FAKE_KEY_REDACTED",
  "VERCEL_DEPLOY_TOKEN=FAKE_KEY_REDACTED",
  "VERCEL_OIDC_TOKEN=FAKE_KEY_REDACTED",
  "RESEND_API_KEY=FAKE_KEY_REDACTED",
  "TURNSTILE_SECRET=FAKE_KEY_REDACTED",
  "CRON_SECRET=FAKE_KEY_REDACTED",
  "R2_ACCESS_KEY=FAKE_KEY_REDACTED",
  "EXTERNAL_API_KEY_A=FAKE_KEY_REDACTED",
  "EXTERNAL_API_KEY_B=FAKE_KEY_REDACTED",
]);

export const SAMPLE_SEALED_PROOF = Object.freeze({
  sealed: true,
  sallyport: false,
  reminderSecretBypass: false,
  pretooluseLocked: true,
  mtimeNudge: false,
  systemReminder: false,
  fullContentsDump: false,
  tenKeys: false,
  notAToolCall: false,
  falseCoverage: false,
  kind: SAMPLE_KIND_IDLE,
});

export const SAMPLE_SALLYPORT_PROOF = Object.freeze({
  sealed: false,
  sallyport: true,
  reminderSecretBypass: true,
  pretooluseLocked: true,
  mtimeNudge: true,
  systemReminder: true,
  fullContentsDump: true,
  tenKeys: true,
  notAToolCall: true,
  falseCoverage: true,
  kind: SAMPLE_KIND_SEEDED,
  fakeKeys: FAKE_SECRET_KEYS,
});

export const SAMPLE_WALK_LOG = Object.freeze([
  { t: "idle", line: "booth holds sealed: gatehouse locked; sallyport shut; strongroom keys redacted" },
  { t: "sed-i", line: "agent edits ~/.artefakt-secrets/.env.production.local with sed -i; awk prints key name + value length only" },
  { t: "mtime-nudge", line: "nano has the same file open; mtime changes; harness file-tracking notices" },
  { t: "path", line: "reminder-secret-bypass — <system-reminder> injects full current contents past the locked PreToolUse gate" },
  { t: "score", line: "when the side door is open the booth is sallyport — Score sallyport or admit sealed." },
]);

/**
 * Fortress map: sealed gate-checked vs open sallyport.
 * Idle/sealed: both doors shut; keys stay redacted.
 * Seeded/sallyport: main gate locked; side passage open; reminder dumps plaintext.
 */
export function mapFortress(input = {}) {
  const sallyport = isSallyportInput(input);
  const sealed = input.sealed === true && !sallyport;
  return {
    stamp: sallyport ? "reminder-secret-bypass" : "sealed-gate",
    holdingLane: sallyport ? "leaked" : "redacted",
    kindLane: sallyport ? "reminder-secret-bypass" : "gate-checked",
    bindLane: sallyport ? "full-contents-dump" : "guarded",
    ribbon: sallyport ? "sallyport" : "sealed",
    sealed,
  };
}

export function inspectGatehouse(input = {}) {
  const locked =
    input.pretooluseLocked === true ||
    input.sealed === true ||
    input.sallyport === true ||
    input.reminderSecretBypass === true;
  return {
    stamp: locked ? "gate-locked" : "gate-idle",
    locked,
    note: locked
      ? "PreToolUse Bash hook still blocks cat/grep/head/tail against secret paths — the main gate is LOCKED"
      : "",
  };
}

export function inspectSallyport(input = {}) {
  const open = isSallyportInput(input);
  if (input.sealed === true && !open) {
    return {
      stamp: "sallyport-shut",
      open: false,
    };
  }
  return {
    stamp: open ? "sallyport-open" : "sallyport-idle",
    open,
    note: open
      ? "the fortified side passage is open — harness reminder marches full secret plaintext past the locked gate"
      : "",
  };
}

export function inspectReminder(input = {}) {
  const injected =
    input.systemReminder === true ||
    input.fullContentsDump === true ||
    input.reminderSecretBypass === true ||
    input.sallyport === true;
  if (input.sealed === true && !injected) {
    return {
      stamp: "reminder-withheld",
      injected: false,
    };
  }
  return {
    stamp: injected ? "system-reminder" : "reminder-idle",
    injected,
    note: injected
      ? "harness injects a <system-reminder> showing the file's full current contents as an unrequested diff"
      : "",
  };
}

export function inspectStrongroom(input = {}) {
  const leaked =
    input.fullContentsDump === true ||
    input.tenKeys === true ||
    input.sallyport === true;
  if (input.sealed === true && !leaked) {
    return {
      stamp: "keys-redacted",
      leaked: false,
    };
  }
  return {
    stamp: leaked ? "keys-leaked" : "keys-idle",
    leaked,
    note: leaked
      ? "ten FAKE_KEY_REDACTED silhouettes fill the transcript panel — every key AND value"
      : "",
    fakeKeys: leaked ? [...FAKE_SECRET_KEYS] : [],
  };
}

export function inspectHook(input = {}) {
  const bypassed =
    input.notAToolCall === true ||
    input.falseCoverage === true ||
    input.sallyport === true ||
    input.reminderSecretBypass === true;
  if (input.sealed === true && !bypassed) {
    return {
      stamp: "hook-gate-checked",
      bypassed: false,
    };
  }
  return {
    stamp: bypassed ? "hook-bypassed" : "hook-idle",
    bypassed,
    note: bypassed
      ? "this is not a tool call, so PreToolUse never runs; the hook gives a false sense of coverage"
      : "",
  };
}

function isSallyportInput(input = {}) {
  return (
    input.sallyport === true ||
    input.reminderSecretBypass === true ||
    input.mtimeNudge === true ||
    input.systemReminder === true ||
    input.fullContentsDump === true ||
    input.tenKeys === true ||
    input.notAToolCall === true ||
    input.falseCoverage === true
  );
}

export function readBooth(input = {}) {
  const sallyport = isSallyportInput(input);
  const sealed = input.sealed === true && !sallyport;
  return {
    mark: sallyport ? "sallyport" : sealed || !sallyport ? "sealed" : "sallyport",
    sealed,
    sallyport,
    reminderSecretBypass: input.reminderSecretBypass === true || sallyport,
    pretooluseLocked: input.pretooluseLocked === true || true,
    mtimeNudge: input.mtimeNudge === true,
    systemReminder: input.systemReminder === true,
    fullContentsDump: input.fullContentsDump === true,
    tenKeys: input.tenKeys === true,
    notAToolCall: input.notAToolCall === true,
    falseCoverage: input.falseCoverage === true,
    scope: mapFortress(input),
    gatehouse: inspectGatehouse(input),
    sallyportDoor: inspectSallyport(input),
    reminder: inspectReminder(input),
    strongroom: inspectStrongroom(input),
    hook: inspectHook(input),
    log: input.log || [],
  };
}

export const SALLYPORT_WALK = Object.freeze([
  {
    t: "idle",
    event: "cue-sealed",
    sealed: true,
    sallyport: false,
    cue: "sealed",
    note: "idle HOLD: gatehouse locked; sallyport shut; strongroom keys redacted — the hold/good path",
  },
  {
    t: "sed-i",
    event: "pretooluse-locked",
    sallyport: true,
    pretooluseLocked: true,
    cue: "sallyport",
    note: "sed -i on ~/.artefakt-secrets/.env.production.local; awk prints key name + value length only",
  },
  {
    t: "mtime-nudge",
    event: "mtime-nudge",
    sallyport: true,
    mtimeNudge: true,
    cue: "sallyport",
    note: "nano has the same file open; mtime changes; harness file-tracking notices",
  },
  {
    t: "path",
    event: "reminder-secret-bypass",
    sallyport: true,
    reminderSecretBypass: true,
    systemReminder: true,
    notAToolCall: true,
    cue: "sallyport",
    note: "reminder-secret-bypass — <system-reminder> injects full current contents; PreToolUse never runs",
  },
  {
    t: "score",
    event: "sallyport",
    sallyport: true,
    reminderSecretBypass: true,
    pretooluseLocked: true,
    mtimeNudge: true,
    systemReminder: true,
    fullContentsDump: true,
    tenKeys: true,
    notAToolCall: true,
    falseCoverage: true,
    cue: "sallyport",
    note: "sallyport — when the side door is open the booth is sallyport",
  },
]);

export const POSITIVE_CONTROL_WALK = Object.freeze([
  {
    t: "hold",
    event: "cue-sealed",
    sealed: true,
    sallyport: false,
    cue: "sealed",
    note: "positive control: both doors shut; keys stay redacted",
  },
  {
    t: "announce",
    event: "cue-sealed",
    sealed: true,
    cue: "sealed",
    note: "positive control: the fortress stays sealed",
  },
]);

function classifyFromSeed(seed) {
  if (seed && VERDICTS.includes(seed)) return seed;
  return null;
}

export function emptyTicket() {
  return {
    seed: IDLE_WORD,
    sealed: true,
    sallyport: false,
    reminderSecretBypass: false,
    cue: "sealed",
  };
}

export function seedSealed() {
  return { ...emptyTicket() };
}

export function seedSallyport() {
  return {
    seed: SEEDED_WORD,
    sealed: false,
    sallyport: true,
    reminderSecretBypass: true,
    pretooluseLocked: true,
    mtimeNudge: true,
    systemReminder: true,
    fullContentsDump: true,
    tenKeys: true,
    notAToolCall: true,
    falseCoverage: true,
    cue: "sallyport",
    issue: FEATURED_ISSUE,
    proof: SAMPLE_SALLYPORT_PROOF,
  };
}

export function seedProduct() {
  return {
    seed: PRODUCT_WORD,
    preferSeed: true,
    sallyport: true,
    reminderSecretBypass: true,
    fullContentsDump: true,
    cue: "sallyport",
  };
}

export function seedReminderSecretBypass() {
  return {
    seed: PATH_WORD,
    preferSeed: true,
    sallyport: true,
    reminderSecretBypass: true,
    systemReminder: true,
    event: "reminder-secret-bypass",
    cue: "sallyport",
  };
}

export function seedHold() {
  return {
    seed: "hold",
    preferSeed: true,
    sealed: true,
    cue: "sealed",
  };
}

export function seedRedacted() {
  return {
    seed: "redacted",
    preferSeed: true,
    sealed: true,
    cue: "sealed",
  };
}

export function seedGuarded() {
  return {
    seed: "guarded",
    preferSeed: true,
    sealed: true,
    cue: "sealed",
  };
}

export function seedHush() {
  return {
    seed: "hush",
    preferSeed: true,
    sealed: true,
    cue: "sealed",
  };
}

export function seedGateChecked() {
  return {
    seed: "gate-checked",
    preferSeed: true,
    sealed: true,
    cue: "sealed",
  };
}

export function seedPretooluseLocked() {
  return {
    seed: "pretooluse-locked",
    preferSeed: true,
    pretooluseLocked: true,
    cue: "sallyport",
  };
}

export function seedMtimeNudge() {
  return {
    seed: "mtime-nudge",
    preferSeed: true,
    mtimeNudge: true,
    cue: "sallyport",
  };
}

export function seedSystemReminder() {
  return {
    seed: "system-reminder",
    preferSeed: true,
    systemReminder: true,
    cue: "sallyport",
  };
}

export function seedFullContentsDump() {
  return {
    seed: "full-contents-dump",
    preferSeed: true,
    fullContentsDump: true,
    cue: "sallyport",
  };
}

export function seedTenKeys() {
  return {
    seed: "ten-keys",
    preferSeed: true,
    tenKeys: true,
    cue: "sallyport",
  };
}

export function seedNotAToolCall() {
  return {
    seed: "not-a-tool-call",
    preferSeed: true,
    notAToolCall: true,
    cue: "sallyport",
  };
}

export function seedFalseCoverage() {
  return {
    seed: "false-coverage",
    preferSeed: true,
    falseCoverage: true,
    cue: "sallyport",
  };
}

export function normalizeBooth(raw) {
  if (!raw || typeof raw !== "object") {
    return {
      sealed: false,
      sallyport: false,
      reminderSecretBypass: false,
      pretooluseLocked: false,
      mtimeNudge: false,
      systemReminder: false,
      fullContentsDump: false,
      tenKeys: false,
      notAToolCall: false,
      falseCoverage: false,
      cue: null,
      event: null,
      t: null,
    };
  }
  return {
    sealed: raw.sealed === true,
    sallyport: raw.sallyport === true || raw.event === "sallyport",
    reminderSecretBypass:
      raw.reminderSecretBypass === true ||
      raw.event === "reminder-secret-bypass",
    pretooluseLocked:
      raw.pretooluseLocked === true || raw.event === "pretooluse-locked",
    mtimeNudge: raw.mtimeNudge === true || raw.event === "mtime-nudge",
    systemReminder:
      raw.systemReminder === true || raw.event === "system-reminder",
    fullContentsDump:
      raw.fullContentsDump === true || raw.event === "full-contents-dump",
    tenKeys: raw.tenKeys === true || raw.event === "ten-keys",
    notAToolCall: raw.notAToolCall === true || raw.event === "not-a-tool-call",
    falseCoverage:
      raw.falseCoverage === true || raw.event === "false-coverage",
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
      (ticket.sealed != null ||
        ticket.sallyport != null ||
        ticket.reminderSecretBypass != null ||
        ticket.pretooluseLocked != null ||
        ticket.mtimeNudge != null ||
        ticket.systemReminder != null ||
        ticket.fullContentsDump != null ||
        ticket.tenKeys != null ||
        ticket.notAToolCall != null ||
        ticket.falseCoverage != null ||
        ticket.cue != null ||
        ticket.event ||
        ticket.proof),
  );
}

function isSealed(row) {
  if (row.sallyport && row.cue !== "sealed") return false;
  if (row.cue === "sallyport" || row.cue === "reminder-secret-bypass") {
    return false;
  }
  if (
    row.reminderSecretBypass &&
    row.systemReminder &&
    row.cue !== "sealed" &&
    row.sealed !== true
  ) {
    return false;
  }
  if (row.sealed === true && row.sallyport !== true && row.cue !== "sallyport") {
    return true;
  }
  if (
    row.cue === "sealed" &&
    row.sallyport !== true &&
    row.reminderSecretBypass !== true &&
    row.mtimeNudge !== true &&
    row.systemReminder !== true &&
    row.fullContentsDump !== true &&
    row.tenKeys !== true &&
    row.notAToolCall !== true &&
    row.falseCoverage !== true
  ) {
    return true;
  }
  return false;
}

function isReminderSecretBypass(row) {
  return (
    row.event === "reminder-secret-bypass" &&
    !isSealed(row) &&
    (row.reminderSecretBypass === true ||
      row.systemReminder === true ||
      row.notAToolCall === true)
  );
}

function isSallyportRow(row) {
  if (isSealed(row)) return false;
  if (isReminderSecretBypass(row) && row.cue !== "sallyport") return false;
  if (row.cue === "sallyport") return true;
  if (row.sallyport === true) return true;
  if (row.reminderSecretBypass === true && row.systemReminder === true) {
    return true;
  }
  if (
    row.reminderSecretBypass === true ||
    row.mtimeNudge === true ||
    row.systemReminder === true ||
    row.fullContentsDump === true ||
    row.tenKeys === true ||
    row.notAToolCall === true ||
    row.falseCoverage === true
  ) {
    return true;
  }
  return false;
}

/**
 * Score one sallyport pass against the fortress.
 * sealed: both doors shut; keys stay redacted.
 * sallyport: side passage open; reminder dumps plaintext past the locked gate.
 * reminder-secret-bypass: names that path.
 */
export function scoreGate(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const row = normalizeBooth(ticket);
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);

  let verdict = IDLE_WORD;
  if (
    isReminderSecretBypass(row) ||
    (row.reminderSecretBypass && ticket.preferSeed && seeded === PATH_WORD)
  ) {
    verdict = "reminder-secret-bypass";
  } else if (isSallyportRow(row)) {
    verdict = "sallyport";
  } else if (isSealed(row)) {
    verdict = "sealed";
  } else if (
    row.reminderSecretBypass ||
    row.mtimeNudge ||
    row.systemReminder ||
    row.fullContentsDump ||
    row.tenKeys ||
    row.notAToolCall ||
    row.falseCoverage
  ) {
    verdict = "sallyport";
  }

  if (seeded && (!hasBoothFields(ticket) || ticket.preferSeed === true)) {
    verdict = seeded;
  }

  const hold = HOLD.includes(verdict);
  const gatehouse = inspectGatehouse(row);
  const sallyportDoor = inspectSallyport(row);
  const reminder = inspectReminder(row);
  const strongroom = inspectStrongroom(row);
  const hook = inspectHook(row);
  return {
    verdict,
    idleWord: IDLE_WORD,
    pathWord: PATH_WORD,
    seededWord: SEEDED_WORD,
    productWord: PRODUCT_WORD,
    hold,
    alarm: !hold,
    recover: RECOVER.includes(verdict),
    sealed: verdict === "sealed" || verdict === "hold",
    sallyport: verdict === "sallyport" || verdict === SEEDED_WORD,
    reminderSecretBypass:
      row.reminderSecretBypass === true ||
      verdict === "reminder-secret-bypass" ||
      verdict === PATH_WORD,
    pretooluseLocked: row.pretooluseLocked,
    mtimeNudge: row.mtimeNudge,
    systemReminder: row.systemReminder,
    fullContentsDump: row.fullContentsDump,
    tenKeys: row.tenKeys,
    notAToolCall: row.notAToolCall,
    falseCoverage: row.falseCoverage,
    cue: hold
      ? "sealed"
      : row.reminderSecretBypass || verdict === "reminder-secret-bypass"
        ? "reminder-secret-bypass"
        : "sallyport",
    event: row.event,
    t: row.t,
    phrase: hold ? "admit sealed" : "score sallyport",
    gatehouseInspect: gatehouse,
    sallyportInspect: sallyportDoor,
    reminderInspect: reminder,
    strongroomInspect: strongroom,
    hookInspect: hook,
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
      : SALLYPORT_WALK;
  const scored = rows.map((row) => ({
    ...normalizeBooth(row),
    ...scoreGate({ ...row, preferSeed: false }),
  }));
  const leaked = scored.filter((row) => row.verdict === "sallyport");
  const path = scored.filter((row) => row.verdict === "reminder-secret-bypass");
  const sealed = scored.filter((row) => row.verdict === "sealed");
  const headline =
    scored.find((row) => row.event === "sallyport") ||
    scored.find((row) => row.event === "reminder-secret-bypass") ||
    scored.find((row) => row.event === "mtime-nudge") ||
    leaked[leaked.length - 1];
  let verdict = "sealed";
  if (leaked.length) verdict = "sallyport";
  else if (path.length && !sealed.length) verdict = "reminder-secret-bypass";
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
    sallyportCount: leaked.length,
    pathCount: path.length,
    sealedCount: sealed.length,
    headline,
    rows: scored,
    phrase: HOLD.includes(verdict) ? "admit sealed" : "score sallyport",
    note: headline
      ? "PreToolUse blocks Bash reads of secrets; mtime reminder still dumps full contents. Cousins cite-only: #92074 #92487 #88441 #89716 #92365."
      : "published sallyport walk scored against sealed vs sallyport",
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
    seeded !== "sealed" &&
    seeded !== "sallyport" &&
    seeded !== "reminder-secret-bypass" &&
    ticket.sealed == null &&
    ticket.sallyport == null &&
    ticket.reminderSecretBypass == null &&
    ticket.systemReminder == null &&
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
    sealed: scored.sealed ?? false,
    sallyport: scored.sallyport ?? false,
    reminderSecretBypass: scored.reminderSecretBypass ?? false,
    pretooluseLocked: scored.pretooluseLocked ?? false,
    mtimeNudge: scored.mtimeNudge ?? false,
    systemReminder: scored.systemReminder ?? false,
    fullContentsDump: scored.fullContentsDump ?? false,
    tenKeys: scored.tenKeys ?? false,
    notAToolCall: scored.notAToolCall ?? false,
    falseCoverage: scored.falseCoverage ?? false,
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
    result.fullContentsDump || result.sallyport
      ? "kind=reminder-secret-bypass"
      : "kind=gate-checked",
    result.mtimeNudge || result.sallyport ? "ref=mtime" : "ref=redacted",
    result.reminderSecretBypass || result.verdict === "reminder-secret-bypass"
      ? "path=reminder-secret-bypass"
      : "path=sealed",
    result.cue === "sealed"
      ? "cue=sealed"
      : result.cue === "reminder-secret-bypass"
        ? "cue=reminder-secret-bypass"
        : "cue=sallyport",
  ].join("|");
}

export function handle(input) {
  const result = analyze(input);
  const booth = readBooth({
    sealed: result.sealed,
    sallyport: result.sallyport,
    reminderSecretBypass: result.reminderSecretBypass,
    pretooluseLocked: result.pretooluseLocked,
    mtimeNudge: result.mtimeNudge,
    systemReminder: result.systemReminder,
    fullContentsDump: result.fullContentsDump,
    tenKeys: result.tenKeys,
    notAToolCall: result.notAToolCall,
    falseCoverage: result.falseCoverage,
    proof: input && input.proof,
    log: input && input.log,
  });
  return {
    ...result,
    fingerprint: fingerprint(input),
    booth,
    gatehouse: inspectGatehouse({
      sealed: result.sealed,
      sallyport: result.sallyport,
      reminderSecretBypass: result.reminderSecretBypass,
      pretooluseLocked: result.pretooluseLocked,
    }),
    sallyportDoor: inspectSallyport({
      sealed: result.sealed,
      sallyport: result.sallyport,
      reminderSecretBypass: result.reminderSecretBypass,
    }),
    reminder: inspectReminder({
      sealed: result.sealed,
      sallyport: result.sallyport,
      systemReminder: result.systemReminder,
      fullContentsDump: result.fullContentsDump,
      reminderSecretBypass: result.reminderSecretBypass,
    }),
    strongroom: inspectStrongroom({
      sealed: result.sealed,
      sallyport: result.sallyport,
      fullContentsDump: result.fullContentsDump,
      tenKeys: result.tenKeys,
    }),
    hook: inspectHook({
      sealed: result.sealed,
      sallyport: result.sallyport,
      notAToolCall: result.notAToolCall,
      falseCoverage: result.falseCoverage,
      reminderSecretBypass: result.reminderSecretBypass,
    }),
    scope: mapFortress({
      sealed: result.sealed,
      sallyport: result.sallyport,
      reminderSecretBypass: result.reminderSecretBypass,
      mtimeNudge: result.mtimeNudge,
      systemReminder: result.systemReminder,
      fullContentsDump: result.fullContentsDump,
      tenKeys: result.tenKeys,
      notAToolCall: result.notAToolCall,
      falseCoverage: result.falseCoverage,
    }),
    stations: BOOTH_STATIONS.map((row) => ({
      ...row,
      sallyport: result.sallyport === true || result.verdict === "sallyport",
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
        "NON-BINDING: harness file-change reminder injects full file contents into context without consulting secret-path / PreToolUse deny rules because it is not a tool call. Invite verify against #94082 text only. Do not claim a root cause in Claude Code source you have not seen.",
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
