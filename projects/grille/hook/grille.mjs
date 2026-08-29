/**
 * Grille — bank teller's bronze grille /
 * night-depository desk for Claude Code
 * permission-mode system-prompt steering
 * that sends file mutations through Bash
 * (sed / heredoc / short script) instead
 * of Edit/Write.
 *
 * Edit/Write tool cards render diffs;
 * Bash does not. So all edit diffs
 * silently vanish. PreToolUse hooks
 * matching Write|Edit|NotebookEdit never
 * fire. diffTool and PostToolUse keyed
 * on Edit/Write go blind. permissions.deny
 * Edit(path)/Write(path) go blind. Rules
 * with paths: frontmatter never lazy-load.
 * Transcript JSONL has no edit contents
 * (rewind/#87575). The only workaround is
 * a CLAUDE.md prompt overriding a prompt
 * — not a setting. Changelog 2.1.240–
 * 2.1.251 is silent. acceptEdits restores
 * Edit/Write and the diffs.
 *
 * A night drop through the slot is not a
 * hold. Score the grille or admit posted.
 *
 * Primary #90599: open, filed 2026-08-29,
 * macOS, Claude Code 2.1.251 (also
 * 2.1.248, 2.1.250). skipDangerousModePermissionPrompt
 * true. System prompt: "Do your work
 * through the Bash tool … make file
 * changes with sed, heredocs, or short
 * scripts, rather than using the dedicated
 * Read, Edit, or Write tools." Diffs
 * vanish. acceptEdits restores them. No
 * changelog entry 2.1.240–2.1.251. No
 * setting. CLAUDE.md override is prompt-
 * vs-prompt.
 *
 * Same-class (cite, do not invent):
 *   #90597 — Windows: same file-write
 *            directive prescribes heredocs
 *            without platform gate;
 *            PowerShell has no heredoc;
 *            Git Bash marshalling can
 *            truncate; 2–3× tokens vs Write
 *   #89251 — has repro, area:security.
 *            Same directive in bypass AND
 *            auto mode. PreToolUse
 *            Write|Edit|NotebookEdit never
 *            called. Closed predecessor
 *            #63786. Comment by nzaytsev:
 *            deny rules, paths: frontmatter,
 *            rewind/transcript diffs
 *            (#87575) all go blind.
 *            Referenced by #89716.
 *   #85511 — manual permission mode:
 *            Bash python/sed bypass per-
 *            edit diff review;
 *            Bash(python3 *) allowlist →
 *            zero prompts
 *   #29709 — PreToolUse:Edit circumvented
 *            via Bash python write after
 *            Edit was blocked 3 times
 *   #31292 — disallowedTools: [Write, Edit]
 *            trivially bypassed via
 *            sed/awk/redirects
 *
 * Cross-ecosystem:
 *   openai/codex#10330 — model claims
 *            apply_patch unavailable, uses
 *            bash/python; after wire_api
 *            fix still uses cat on Windows
 *            to create files
 *   openai/codex#16397 — custom provider
 *            cannot apply_patch, resorts
 *            to sed / cat heredoc
 *   openai/codex#17899 — apply_patch
 *            missing, falls back to
 *            sed/echo
 *
 * Verdicts: posted | slotted | steered
 *           | unreceipted | unhooked
 *           | killed | overlay | ungated
 *           | allowlisted | restored
 * Idle word is posted (transaction went
 * through the teller grille; Edit/Write
 * used; a receipt/diff would render;
 * hooks that match Write|Edit would have
 * been consulted).
 * NEVER use grille / grill / empty /
 * silent / mute / idle / dead as idle.
 * NEVER reuse bunged, belayed, rove,
 * keyed, housed, beamed, snug, hung,
 * appointed, cinched, gauged, stamped,
 * overrun, pratique, wound, bound,
 * stilled, stabled, drained, flat, fit,
 * spoilt, laid, unlinked, tight, banked,
 * roosted, stocked, seated, heard, clear,
 * paired, kernel, latched, upheld,
 * sterling, home, valid, dry, sealed,
 * quiet, seised, rung, moored.
 * Do NOT ship Galley, Chase, Stick,
 * Proof, Slug, Kerf, Crop, Stump, Snip,
 * Quill, Nib, Trunc, Ferrule, Darkroom,
 * Shutter, Till, Cage, Slot, Nightbox,
 * Palimpsest as the product name.
 * Product name is Grille only.
 *
 * Slack alarm on slotted / steered /
 * unreceipted / unhooked / killed /
 * allowlisted.
 * Linear ticket on slotted / steered /
 * unhooked / killed.
 * GitHub grille-ledger of scored probes
 * on every score.
 *
 * Priority when multiple match:
 *   killed > ungated > steered >
 *   allowlisted > slotted > unreceipted >
 *   unhooked > overlay > restored >
 *   posted
 * Unique nearby flags win their own
 * seeds because those seeds do not
 * carry the #90599 steered pentad
 * (bypass directive present, Bash write-
 * capable, Edit/Write unused, diff would
 * not render, Write|Edit hooks would not
 * fire).
 *
 * posted is true ONLY when Edit/Write
 * was used, a diff would render, Write|
 * Edit hooks would fire, and the verdict
 * is not a failure class.
 *
 * Why this is not a clone:
 * NOT Stencil — plan-mode fence
 *     (Write/Bash succeed mid-plan).
 *     Grille is permission-mode steering
 *     to Bash so the audited Edit path
 *     is abandoned.
 * NOT Hasp — file-path lease / last-
 *     writer-wins races.
 * NOT Coda — silently dropped assistant
 *     text.
 * NOT Veto — heron_brook system-prompt
 *     injection that vetoes Agent-tool
 *     delegation. Grille is a tool-path
 *     injection (use Bash not Edit),
 *     not an Agent-tool veto.
 * NOT Tappet — silent hook injection of
 *     additionalContext. Grille is hooks
 *     never consulted because the write
 *     never used Edit/Write.
 * NOT Assay — tool-arg wire-format /
 *     schema vs markup.
 * NOT Spile — hook stdin kept open
 *     without EOF + unenforced timeout.
 * NOT Scant — Bash snapshot PATH
 *     truncation at ~7.2KB on Windows.
 * NOT Knock — permission-grant stalls.
 * NOT Gasket — project sandbox.network
 *     .strictAllowlist discarded.
 * NOT Iota — typesetter's type-case for
 *     path-key casing.
 * NOT Blot — image-poison darkroom.
 * NOT Wicket — worktree isolation
 *     gatehouse.
 * Different problem: PERMISSION-MODE
 * SYSTEM PROMPT STEERS FILE MUTATIONS
 * TO BASH → DIFFS VANISH + WRITE HOOKS
 * / DENY RULES GO BLIND.
 * Different UI: bank teller's bronze
 * grille — marble counter, bronze
 * lattice window, receipt stamp, cash
 * drawer, night-depository slot, bypass-
 * mode lamp.
 * Different idle: posted.
 */

export const VERDICTS = Object.freeze([
  "posted",
  "slotted",
  "steered",
  "unreceipted",
  "unhooked",
  "killed",
  "overlay",
  "ungated",
  "allowlisted",
  "restored",
]);
export const IDLE_WORD = "posted";
export const SLACK_VERDICTS = Object.freeze([
  "slotted",
  "steered",
  "unreceipted",
  "unhooked",
  "killed",
  "allowlisted",
]);
export const LINEAR_VERDICTS = Object.freeze([
  "slotted",
  "steered",
  "unhooked",
  "killed",
]);
export const ALARM_VERDICTS = SLACK_VERDICTS;
export const FEATURED_ISSUE = 90599;
export const WINDOWS_ISSUE = 90597;
export const HOOK_ISSUE = 89251;
export const ALLOWLIST_ISSUE = 85511;
export const EDIT_CIRCUMVENT_ISSUE = 29709;
export const DISALLOW_ISSUE = 31292;
export const REWIND_ISSUE = 87575;
export const PREDECESSOR_ISSUE = 63786;
export const REFERENCED_BY_ISSUE = 89716;

const FORBIDDEN_IDLE = Object.freeze([
  "grille",
  "grill",
  "galley",
  "chase",
  "stick",
  "proof",
  "slug",
  "kerf",
  "crop",
  "stump",
  "snip",
  "quill",
  "nib",
  "trunc",
  "ferrule",
  "darkroom",
  "shutter",
  "till",
  "cage",
  "slot",
  "nightbox",
  "palimpsest",
  "empty",
  "silent",
  "mute",
  "idle",
  "dead",
  "bunged",
  "belayed",
  "rove",
  "keyed",
  "housed",
  "beamed",
  "snug",
  "hung",
  "appointed",
  "cinched",
  "gauged",
  "stamped",
  "overrun",
  "pratique",
  "wound",
  "bound",
  "stilled",
  "stabled",
  "drained",
  "flat",
  "fit",
  "spoilt",
  "laid",
  "unlinked",
  "tight",
  "banked",
  "roosted",
  "stocked",
  "seated",
  "heard",
  "clear",
  "paired",
  "kernel",
  "latched",
  "upheld",
  "sterling",
  "home",
  "valid",
  "dry",
  "sealed",
  "quiet",
  "seised",
  "rung",
  "moored",
  "spile",
  "stencil",
  "hasp",
  "coda",
  "veto",
  "tappet",
  "assay",
  "scant",
  "knock",
  "gasket",
  "iota",
  "blot",
  "wicket",
]);

export function forbiddenIdleWords() {
  return FORBIDDEN_IDLE.slice();
}

function asText(value) {
  return value != null ? String(value) : "";
}

function asIssue(value) {
  if (value == null || value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : value;
}

function asBool(value, fallback = undefined) {
  if (value == null) return fallback;
  if (typeof value === "string") {
    const s = value.trim().toLowerCase();
    if (s === "" || s === "false" || s === "0" || s === "off" || s === "no") {
      return false;
    }
    if (s === "true" || s === "1" || s === "on" || s === "yes") return true;
    return Boolean(s);
  }
  return Boolean(value);
}

function isEditWriteTool(tool) {
  const name = asText(tool).trim().toLowerCase();
  return name === "edit" || name === "write" || name === "notebookedit";
}

export function emptyGrille() {
  return {
    session: "",
    issue: null,
    source: "",
    permissionMode: "",
    bypassDirectivePresent: false,
    toolUsed: "",
    bashWriteCapable: false,
    editWriteUsed: false,
    diffWouldRender: false,
    preToolUseEditWriteWouldFire: false,
    windowsPlatform: false,
    heredocPrescribed: false,
    writeFailedOrTruncated: false,
    allowlistBashWrite: false,
    claudeMdOverrideOnly: false,
    noSettingToggle: false,
    acceptEditsRestored: false,
    scored: false,
  };
}

export function emptyAction(session = "posted-1") {
  return {
    action: "score",
    session,
    grille: emptyGrille(),
  };
}

export function cloneGrille(raw = {}) {
  const src = raw && typeof raw === "object" ? raw : emptyGrille();
  const nested =
    (src.grille && typeof src.grille === "object" && src.grille) ||
    (src.probe && typeof src.probe === "object" && src.probe) ||
    (src.payload && typeof src.payload === "object" && src.payload) ||
    (src.desk && typeof src.desk === "object" && src.desk) ||
    src;
  const toolUsed = asText(nested.toolUsed ?? src.toolUsed);
  const editWriteUsedRaw = nested.editWriteUsed ?? src.editWriteUsed;
  const editWriteUsed =
    editWriteUsedRaw == null ? isEditWriteTool(toolUsed) : asBool(editWriteUsedRaw, false) === true;
  return {
    ...emptyGrille(),
    session: asText(nested.session ?? src.session ?? src.sessionKey),
    issue: asIssue(nested.issue ?? src.issue),
    source: asText(nested.source ?? src.source),
    permissionMode: asText(nested.permissionMode ?? src.permissionMode),
    bypassDirectivePresent: asBool(nested.bypassDirectivePresent ?? src.bypassDirectivePresent, false) === true,
    toolUsed,
    bashWriteCapable: asBool(nested.bashWriteCapable ?? src.bashWriteCapable, false) === true,
    editWriteUsed,
    diffWouldRender: asBool(nested.diffWouldRender ?? src.diffWouldRender, false) === true,
    preToolUseEditWriteWouldFire:
      asBool(nested.preToolUseEditWriteWouldFire ?? src.preToolUseEditWriteWouldFire, false) === true,
    windowsPlatform: asBool(nested.windowsPlatform ?? src.windowsPlatform, false) === true,
    heredocPrescribed: asBool(nested.heredocPrescribed ?? src.heredocPrescribed, false) === true,
    writeFailedOrTruncated: asBool(nested.writeFailedOrTruncated ?? src.writeFailedOrTruncated, false) === true,
    allowlistBashWrite: asBool(nested.allowlistBashWrite ?? src.allowlistBashWrite, false) === true,
    claudeMdOverrideOnly: asBool(nested.claudeMdOverrideOnly ?? src.claudeMdOverrideOnly, false) === true,
    noSettingToggle: asBool(nested.noSettingToggle ?? src.noSettingToggle, false) === true,
    acceptEditsRestored: asBool(nested.acceptEditsRestored ?? src.acceptEditsRestored, false) === true,
    scored: asBool(nested.scored ?? src.scored, false) === true,
  };
}

export function analyze(grille = {}) {
  const next = cloneGrille(grille);
  const killedShape =
    next.windowsPlatform === true &&
    next.heredocPrescribed === true &&
    next.writeFailedOrTruncated === true;
  const ungatedShape =
    killedShape !== true &&
    next.windowsPlatform === true &&
    next.heredocPrescribed === true;
  const steeredShape =
    killedShape !== true &&
    ungatedShape !== true &&
    next.bypassDirectivePresent === true &&
    next.bashWriteCapable === true &&
    next.editWriteUsed !== true;
  const allowlistedShape =
    killedShape !== true &&
    ungatedShape !== true &&
    steeredShape !== true &&
    next.allowlistBashWrite === true;
  const slottedShape =
    killedShape !== true &&
    ungatedShape !== true &&
    steeredShape !== true &&
    allowlistedShape !== true &&
    next.bashWriteCapable === true &&
    next.editWriteUsed !== true;
  const unreceiptedShape =
    killedShape !== true &&
    ungatedShape !== true &&
    steeredShape !== true &&
    allowlistedShape !== true &&
    slottedShape !== true &&
    next.diffWouldRender !== true &&
    next.editWriteUsed !== true &&
    Boolean(asText(next.toolUsed)) &&
    next.claudeMdOverrideOnly !== true;
  const unhookedShape =
    killedShape !== true &&
    ungatedShape !== true &&
    steeredShape !== true &&
    allowlistedShape !== true &&
    slottedShape !== true &&
    unreceiptedShape !== true &&
    next.preToolUseEditWriteWouldFire !== true &&
    next.editWriteUsed !== true &&
    next.diffWouldRender === true &&
    next.claudeMdOverrideOnly !== true;
  const overlayShape =
    killedShape !== true &&
    ungatedShape !== true &&
    steeredShape !== true &&
    allowlistedShape !== true &&
    slottedShape !== true &&
    unreceiptedShape !== true &&
    unhookedShape !== true &&
    next.claudeMdOverrideOnly === true &&
    next.noSettingToggle === true;
  const restoredShape =
    killedShape !== true &&
    ungatedShape !== true &&
    steeredShape !== true &&
    allowlistedShape !== true &&
    slottedShape !== true &&
    unreceiptedShape !== true &&
    unhookedShape !== true &&
    overlayShape !== true &&
    next.acceptEditsRestored === true;
  const postedHold =
    next.editWriteUsed === true &&
    next.diffWouldRender === true &&
    next.preToolUseEditWriteWouldFire === true &&
    next.bashWriteCapable !== true &&
    next.bypassDirectivePresent !== true &&
    next.allowlistBashWrite !== true &&
    next.acceptEditsRestored !== true &&
    next.writeFailedOrTruncated !== true;
  return {
    permissionMode: next.permissionMode,
    bypassDirectivePresent: next.bypassDirectivePresent,
    toolUsed: next.toolUsed,
    bashWriteCapable: next.bashWriteCapable,
    editWriteUsed: next.editWriteUsed,
    diffWouldRender: next.diffWouldRender,
    preToolUseEditWriteWouldFire: next.preToolUseEditWriteWouldFire,
    windowsPlatform: next.windowsPlatform,
    heredocPrescribed: next.heredocPrescribed,
    writeFailedOrTruncated: next.writeFailedOrTruncated,
    allowlistBashWrite: next.allowlistBashWrite,
    claudeMdOverrideOnly: next.claudeMdOverrideOnly,
    noSettingToggle: next.noSettingToggle,
    acceptEditsRestored: next.acceptEditsRestored,
    killedShape,
    ungatedShape,
    steeredShape,
    allowlistedShape,
    slottedShape,
    unreceiptedShape,
    unhookedShape,
    overlayShape,
    restoredShape,
    postedHold,
  };
}

export function isIdle(grille = {}) {
  const next = cloneGrille(grille);
  return (
    next.bypassDirectivePresent !== true &&
    next.bashWriteCapable !== true &&
    next.editWriteUsed !== true &&
    next.diffWouldRender !== true &&
    next.preToolUseEditWriteWouldFire !== true &&
    next.windowsPlatform !== true &&
    next.heredocPrescribed !== true &&
    next.writeFailedOrTruncated !== true &&
    next.allowlistBashWrite !== true &&
    next.claudeMdOverrideOnly !== true &&
    next.noSettingToggle !== true &&
    next.acceptEditsRestored !== true &&
    !asText(next.toolUsed) &&
    !asText(next.permissionMode)
  );
}

/**
 * First match wins by documented priority:
 * killed > ungated > steered >
 * allowlisted > slotted > unreceipted >
 * unhooked > overlay > restored >
 * posted.
 * Idle posted is first. Seeded #90599
 * numbers must produce steered, never
 * posted. A night drop through the slot
 * is not a hold.
 */
export function classify(grille = {}) {
  const next = cloneGrille(grille);
  if (isIdle(next)) return "posted";
  const facts = analyze(next);

  if (facts.killedShape) return "killed";
  if (facts.ungatedShape) return "ungated";
  if (facts.steeredShape) return "steered";
  if (facts.allowlistedShape) return "allowlisted";
  if (facts.slottedShape) return "slotted";
  if (facts.unreceiptedShape) return "unreceipted";
  if (facts.unhookedShape) return "unhooked";
  if (facts.overlayShape) return "overlay";
  if (facts.restoredShape) return "restored";
  if (facts.postedHold) return "posted";
  return "posted";
}

export function feedOf(grille = {}, verdict = "") {
  const kind = verdict || classify(grille);
  if (kind === "steered") {
    return "● Steered · injected “While bypass permissions mode is active” (also auto) told the model to prefer Bash for file changes · primary #90599";
  }
  if (kind === "slotted") {
    return "● Slotted · mutation went through the night-depository slot · Bash sed / heredoc / python -c write / redirect · no Edit/Write card";
  }
  if (kind === "unreceipted") {
    return "● Unreceipted · diffs vanished · user has no visual record of what changed in which file";
  }
  if (kind === "unhooked") {
    return "● Unhooked · PreToolUse Write|Edit|NotebookEdit never invoked · path-deny rules and paths: frontmatter go blind · Bash-matcher hooks can only string-parse";
  }
  if (kind === "killed") {
    return "● Killed · Windows: platform-ungated heredoc/here-string write truncated or failed · 2–3× token waste vs Write · #90597";
  }
  if (kind === "overlay") {
    return "● Overlay · only CLAUDE.md prompt-vs-prompt workaround exists · settings reference has no preferBashForFileOps / showEditDiffs toggle";
  }
  if (kind === "ungated") {
    return "● Ungated · file-write directive prescribes POSIX heredocs with no platform condition while Platform: win32 is already in context";
  }
  if (kind === "allowlisted") {
    return "● Allowlisted · innocent Bash(python3 *) / Bash(sed *) allowlist grants unbounded workspace writes with zero prompts · #85511";
  }
  if (kind === "restored") {
    return "● Restored · acceptEdits (or leaving bypass) restores Edit/Write and diffs";
  }
  return "● Posted · transaction went through the teller grille · Edit/Write used · a receipt/diff would render · Write|Edit hooks would have been consulted · idle word is posted";
}

export function reasonsOf(grille = {}, verdict = "") {
  const next = cloneGrille(grille);
  const kind = verdict || classify(next);
  const facts = analyze(next);
  const reasons = [];
  if (next.session) reasons.push(`session ${next.session}`);
  reasons.push(
    facts.bypassDirectivePresent ||
      facts.bashWriteCapable ||
      facts.editWriteUsed ||
      facts.windowsPlatform ||
      facts.allowlistBashWrite ||
      facts.acceptEditsRestored
      ? `mode ${facts.permissionMode || "—"} · tool ${facts.toolUsed || "—"} · bash-write ${facts.bashWriteCapable ? "yes" : "no"} · edit/write ${facts.editWriteUsed ? "yes" : "no"} · diff ${facts.diffWouldRender ? "yes" : "no"} · hooks ${facts.preToolUseEditWriteWouldFire ? "yes" : "no"}`
      : "teller grille closed · Edit/Write used · receipt/diff would render · Write|Edit hooks consulted · idle word is posted",
  );
  if (facts.steeredShape) {
    reasons.push(
      "injected “While bypass permissions mode is active” (also auto) directive told the model to prefer Bash for file changes · the #90599 damage",
    );
  }
  if (facts.bashWriteCapable && !facts.editWriteUsed) {
    reasons.push(
      "mutation went through Bash sed / heredoc / python -c write / redirect · no Edit/Write card would render",
    );
  }
  if (!facts.diffWouldRender && !facts.editWriteUsed) {
    reasons.push("diffs vanished · user has no visual record of what changed in which file");
  }
  if (!facts.preToolUseEditWriteWouldFire && !facts.editWriteUsed) {
    reasons.push(
      "PreToolUse Write|Edit|NotebookEdit never invoked · a hook that does not fire looks like a hook with nothing to object to · path-deny and paths: frontmatter go blind",
    );
  }
  if (facts.killedShape) {
    reasons.push(
      "Windows: platform-ungated heredoc/here-string write truncated or failed · 2–3× token waste vs Write · #90597",
    );
  }
  if (facts.ungatedShape) {
    reasons.push(
      "file-write directive prescribes POSIX heredocs with no platform condition while Platform: win32 is already in context",
    );
  }
  if (facts.allowlistBashWrite) {
    reasons.push(
      "innocent Bash(python3 *) / Bash(sed *) allowlist grants unbounded workspace writes with zero prompts · #85511",
    );
  }
  if (facts.claudeMdOverrideOnly && facts.noSettingToggle) {
    reasons.push(
      "only CLAUDE.md prompt-vs-prompt workaround exists · settings reference has no preferBashForFileOps / showEditDiffs toggle · changelog 2.1.240–2.1.251 is silent",
    );
  }
  if (facts.acceptEditsRestored) {
    reasons.push("acceptEdits (or leaving bypass) restores Edit/Write and diffs");
  }
  reasons.push("a night drop through the slot is not a hold");
  reasons.push(
    "NOT Stencil (plan-mode fence) / Hasp (file-path lease) / Coda (dropped assistant text) / Veto (heron_brook Agent-tool veto) / Tappet (silent hook injection) / Assay (tool-arg furnace) / Spile (hook stdin EOF) / Scant (PATH truncation) / Knock (permission-grant stalls) / Gasket (strictAllowlist discard) / Iota (type-case) / Blot (darkroom) / Wicket (gatehouse) / leftover woodworking / millimetre-slider.",
  );
  if (kind === "posted") {
    reasons.push(
      "transaction went through the teller grille; Edit/Write used; a receipt/diff would render; Write|Edit hooks would have been consulted; idle word is posted",
    );
  }
  if (kind === "steered") {
    reasons.push(
      "PRIMARY #90599: bypass-permissions (and auto) injects a system-prompt directive that steers file mutations through Bash. Diffs vanish. The steered case is steered, never posted.",
    );
  }
  if (kind === "slotted") {
    reasons.push("mutation went through the night-depository slot. No Edit/Write card.");
  }
  if (kind === "unreceipted") {
    reasons.push("diffs vanished; user has no visual record of what changed in which file.");
  }
  if (kind === "unhooked") {
    reasons.push(
      "PreToolUse Write|Edit|NotebookEdit never invoked; deny rules, paths: frontmatter, rewind/transcript diffs (#87575) go blind.",
    );
  }
  if (kind === "killed") {
    reasons.push("Windows platform-ungated heredoc write truncated or failed. 2–3× tokens vs Write.");
  }
  if (kind === "overlay") {
    reasons.push("only CLAUDE.md prompt-vs-prompt workaround; no preferBashForFileOps / showEditDiffs setting.");
  }
  if (kind === "ungated") {
    reasons.push("POSIX heredocs prescribed with no platform condition while Platform: win32 is already in context.");
  }
  if (kind === "allowlisted") {
    reasons.push("Bash(python3 *) / Bash(sed *) allowlist grants unbounded workspace writes with zero prompts.");
  }
  if (kind === "restored") {
    reasons.push("acceptEdits (or leaving bypass) restores Edit/Write and diffs.");
  }
  return reasons;
}

export function verdictOf(grille = {}) {
  return classify(grille);
}

export function flagsOf(verdict) {
  return {
    slack: SLACK_VERDICTS.includes(verdict),
    linear: LINEAR_VERDICTS.includes(verdict),
    github: true,
    alarm: ALARM_VERDICTS.includes(verdict),
  };
}

export function postedOf(grille = {}, verdict = "") {
  const kind = verdict || classify(grille);
  if (SLACK_VERDICTS.includes(kind)) return false;
  if (kind === "overlay" || kind === "ungated" || kind === "restored") return false;
  const facts = analyze(grille);
  if (isIdle(grille)) return true;
  return facts.postedHold === true;
}

export function steeredOf(grille = {}, verdict = "") {
  return (verdict || classify(grille)) === "steered";
}

export function summaryOf(grille = {}) {
  const next = cloneGrille(grille);
  const facts = analyze(next);
  return {
    permissionMode: facts.permissionMode,
    bypassDirectivePresent: facts.bypassDirectivePresent,
    toolUsed: facts.toolUsed,
    bashWriteCapable: facts.bashWriteCapable,
    editWriteUsed: facts.editWriteUsed,
    diffWouldRender: facts.diffWouldRender,
    preToolUseEditWriteWouldFire: facts.preToolUseEditWriteWouldFire,
    windowsPlatform: facts.windowsPlatform,
    heredocPrescribed: facts.heredocPrescribed,
    writeFailedOrTruncated: facts.writeFailedOrTruncated,
    allowlistBashWrite: facts.allowlistBashWrite,
    claudeMdOverrideOnly: facts.claudeMdOverrideOnly,
    noSettingToggle: facts.noSettingToggle,
    acceptEditsRestored: facts.acceptEditsRestored,
  };
}

export function score(grille = {}) {
  const next = cloneGrille(grille);
  const verdict = classify(next);
  const facts = analyze(next);
  const flags = flagsOf(verdict);
  return {
    verdict,
    reasons: reasonsOf(next, verdict),
    posted: postedOf(next, verdict),
    steered: steeredOf(next, verdict),
    feed: feedOf(next, verdict),
    slack: flags.slack,
    linear: flags.linear,
    github: flags.github,
    alarm: flags.alarm,
    idleWord: IDLE_WORD,
    state: verdict,
    decision: verdict,
    permissionMode: facts.permissionMode,
    bypassDirectivePresent: facts.bypassDirectivePresent,
    toolUsed: facts.toolUsed,
    bashWriteCapable: facts.bashWriteCapable,
    editWriteUsed: facts.editWriteUsed,
    diffWouldRender: facts.diffWouldRender,
    preToolUseEditWriteWouldFire: facts.preToolUseEditWriteWouldFire,
    windowsPlatform: facts.windowsPlatform,
    heredocPrescribed: facts.heredocPrescribed,
    writeFailedOrTruncated: facts.writeFailedOrTruncated,
    allowlistBashWrite: facts.allowlistBashWrite,
    claudeMdOverrideOnly: facts.claudeMdOverrideOnly,
    noSettingToggle: facts.noSettingToggle,
    acceptEditsRestored: facts.acceptEditsRestored,
    summary: summaryOf(next),
    grille: next,
  };
}

export function readAction(payload = {}) {
  const nested = payload.action && typeof payload.action === "object" ? payload.action : null;
  const src = nested || payload;
  const grilleSrc =
    src.grille ||
    src.probe ||
    src.payload ||
    src.desk ||
    payload.grille ||
    payload.probe ||
    payload.desk;
  const grille = cloneGrille(
    grilleSrc && typeof grilleSrc === "object" ? { ...grilleSrc, ...src, ...payload } : payload,
  );
  if (typeof src.session === "string" && !grille.session) grille.session = src.session;
  if (typeof payload.session === "string" && !grille.session) grille.session = payload.session;
  const rawAction = String((nested ? nested.action : payload.action) || "score");
  return {
    action: rawAction,
    session: String(src.session ?? payload.session ?? grille.session ?? ""),
    grille,
    issue: src.issue ?? payload.issue ?? grille.issue ?? null,
    source: src.source ?? payload.source ?? grille.source ?? "",
  };
}

function grilleResult(verdict, grille, action, extras = {}) {
  const next = cloneGrille(grille);
  const scored = score(next);
  return {
    ok: true,
    product: "grille",
    verdict,
    state: verdict,
    decision: verdict,
    idleWord: IDLE_WORD,
    alarm: scored.alarm,
    linear: scored.linear,
    slack: scored.slack,
    github: scored.github,
    posted: scored.posted,
    steered: scored.steered,
    grillePosted: verdict === "posted",
    grilleSlotted: verdict === "slotted",
    grilleSteered: verdict === "steered",
    grilleUnreceipted: verdict === "unreceipted",
    grilleUnhooked: verdict === "unhooked",
    grilleKilled: verdict === "killed",
    grilleOverlay: verdict === "overlay",
    grilleUngated: verdict === "ungated",
    grilleAllowlisted: verdict === "allowlisted",
    grilleRestored: verdict === "restored",
    action: action.action,
    session: next.session || action.session || "",
    source: next.source || action.source || "",
    issue: next.issue ?? action.issue ?? null,
    permissionMode: scored.permissionMode,
    bypassDirectivePresent: scored.bypassDirectivePresent,
    toolUsed: scored.toolUsed,
    bashWriteCapable: scored.bashWriteCapable,
    editWriteUsed: scored.editWriteUsed,
    diffWouldRender: scored.diffWouldRender,
    preToolUseEditWriteWouldFire: scored.preToolUseEditWriteWouldFire,
    windowsPlatform: scored.windowsPlatform,
    heredocPrescribed: scored.heredocPrescribed,
    writeFailedOrTruncated: scored.writeFailedOrTruncated,
    allowlistBashWrite: scored.allowlistBashWrite,
    claudeMdOverrideOnly: scored.claudeMdOverrideOnly,
    noSettingToggle: scored.noSettingToggle,
    acceptEditsRestored: scored.acceptEditsRestored,
    feed: scored.feed,
    reasons: scored.reasons,
    summary: scored.summary,
    scored: Boolean(next.scored),
    grille: next,
    ...extras,
  };
}

function seedGrille(issue, source, extras = {}) {
  const session = extras.session != null ? String(extras.session) : String(issue);
  const issueId = extras.issue !== undefined ? extras.issue : issue;
  source = extras.source != null ? extras.source : source;
  return {
    action: extras.action || "score",
    session,
    issue: issueId,
    source,
    grille: {
      ...emptyGrille(),
      session,
      source,
      issue: issueId,
      scored: extras.scored == null ? true : Boolean(extras.scored),
      permissionMode: asText(extras.permissionMode),
      bypassDirectivePresent: Boolean(extras.bypassDirectivePresent),
      toolUsed: asText(extras.toolUsed),
      bashWriteCapable: Boolean(extras.bashWriteCapable),
      editWriteUsed: Boolean(extras.editWriteUsed),
      diffWouldRender: Boolean(extras.diffWouldRender),
      preToolUseEditWriteWouldFire: Boolean(extras.preToolUseEditWriteWouldFire),
      windowsPlatform: Boolean(extras.windowsPlatform),
      heredocPrescribed: Boolean(extras.heredocPrescribed),
      writeFailedOrTruncated: Boolean(extras.writeFailedOrTruncated),
      allowlistBashWrite: Boolean(extras.allowlistBashWrite),
      claudeMdOverrideOnly: Boolean(extras.claudeMdOverrideOnly),
      noSettingToggle: Boolean(extras.noSettingToggle),
      acceptEditsRestored: Boolean(extras.acceptEditsRestored),
    },
  };
}

/** Idle reset. Teller grille closed. Receipt would stamp. */
export function seedPosted() {
  return seedGrille("posted", "teller", {
    session: "posted",
    issue: null,
    scored: true,
  });
}

export function seedReset() {
  return seedPosted();
}

/**
 * Control / proof: Edit/Write used, diff
 * would render, Write|Edit hooks would
 * fire. Classifies as posted; posted true.
 */
export function seedControl() {
  return seedGrille(FEATURED_ISSUE, "anthropics/claude-code#90599", {
    session: "90599-control",
    issue: null,
    permissionMode: "default",
    toolUsed: "Edit",
    editWriteUsed: true,
    diffWouldRender: true,
    preToolUseEditWriteWouldFire: true,
  });
}

/**
 * #90599 steered: bypass directive
 * present, Bash write-capable, Edit/Write
 * unused, diffs would not render, Write|
 * Edit hooks would not fire. A night drop
 * through the slot is not a hold. The
 * steered case is steered, never posted.
 */
export function seedSteered() {
  return seedGrille(FEATURED_ISSUE, "anthropics/claude-code#90599", {
    session: "90599-steered",
    permissionMode: "bypass",
    bypassDirectivePresent: true,
    toolUsed: "Bash",
    bashWriteCapable: true,
    editWriteUsed: false,
    diffWouldRender: false,
    preToolUseEditWriteWouldFire: false,
    heredocPrescribed: true,
    claudeMdOverrideOnly: true,
    noSettingToggle: true,
  });
}

export function seed90599() {
  return seedSteered();
}

/** Mutation through the night-depository slot. No directive. */
export function seedSlotted() {
  return seedGrille(DISALLOW_ISSUE, "anthropics/claude-code#31292", {
    session: "90599-slotted",
    issue: DISALLOW_ISSUE,
    permissionMode: "manual",
    toolUsed: "Bash",
    bashWriteCapable: true,
    editWriteUsed: false,
    diffWouldRender: false,
    preToolUseEditWriteWouldFire: false,
  });
}

/** Diffs vanished. Unique flags: a tool ran, no Edit/Write card, no Bash-write exclusive. */
export function seedUnreceipted() {
  return seedGrille(FEATURED_ISSUE, "anthropics/claude-code#90599", {
    session: "90599-unreceipted",
    toolUsed: "Bash",
    editWriteUsed: false,
    diffWouldRender: false,
  });
}

/**
 * PreToolUse Write|Edit never invoked.
 * Unique flags: hooks blind without a
 * Bash-write or vanished-diff exclusive.
 */
export function seedUnhooked() {
  return seedGrille(HOOK_ISSUE, "anthropics/claude-code#89251", {
    session: "90599-unhooked",
    issue: HOOK_ISSUE,
    permissionMode: "bypass",
    preToolUseEditWriteWouldFire: false,
    diffWouldRender: true,
  });
}

/**
 * Windows: platform-ungated heredoc write
 * truncated or failed. Unique flags win
 * over steered even when the same
 * directive is present.
 */
export function seedKilled() {
  return seedGrille(WINDOWS_ISSUE, "anthropics/claude-code#90597", {
    session: "90599-killed",
    issue: WINDOWS_ISSUE,
    permissionMode: "bypass",
    bypassDirectivePresent: true,
    toolUsed: "Bash",
    bashWriteCapable: true,
    windowsPlatform: true,
    heredocPrescribed: true,
    writeFailedOrTruncated: true,
  });
}

/** Only CLAUDE.md prompt-vs-prompt workaround. No setting. */
export function seedOverlay() {
  return seedGrille(FEATURED_ISSUE, "anthropics/claude-code#90599", {
    session: "90599-overlay",
    claudeMdOverrideOnly: true,
    noSettingToggle: true,
  });
}

/**
 * POSIX heredocs prescribed with no
 * platform condition while Platform:
 * win32 is already in context. Unique
 * flags: windows + heredoc, no truncate.
 */
export function seedUngated() {
  return seedGrille(WINDOWS_ISSUE, "anthropics/claude-code#90597", {
    session: "90599-ungated",
    issue: WINDOWS_ISSUE,
    permissionMode: "bypass",
    bypassDirectivePresent: true,
    windowsPlatform: true,
    heredocPrescribed: true,
    writeFailedOrTruncated: false,
  });
}

/** Innocent Bash(python3 *) allowlist. Zero prompts. */
export function seedAllowlisted() {
  return seedGrille(ALLOWLIST_ISSUE, "anthropics/claude-code#85511", {
    session: "90599-allowlisted",
    issue: ALLOWLIST_ISSUE,
    permissionMode: "manual",
    toolUsed: "Bash",
    bashWriteCapable: true,
    allowlistBashWrite: true,
    editWriteUsed: false,
    diffWouldRender: false,
    preToolUseEditWriteWouldFire: false,
  });
}

/** acceptEdits restores Edit/Write and diffs. */
export function seedRestored() {
  return seedGrille(FEATURED_ISSUE, "anthropics/claude-code#90599", {
    session: "90599-restored",
    permissionMode: "acceptEdits",
    toolUsed: "Edit",
    editWriteUsed: true,
    diffWouldRender: true,
    preToolUseEditWriteWouldFire: true,
    acceptEditsRestored: true,
  });
}

export function parseSessionTrace(raw = "") {
  const text = asText(raw).trim();
  if (!text) return emptyGrille();
  if (text.startsWith("{") || text.startsWith("[")) {
    try {
      const parsed = JSON.parse(text);
      if (Array.isArray(parsed)) {
        return cloneGrille({ scored: true });
      }
      if (parsed && typeof parsed === "object") {
        return cloneGrille({ ...parsed, scored: true });
      }
    } catch {
      /* fall through to prose */
    }
  }
  const steered =
    /While bypass permissions mode is active|prefer Bash|sed, heredocs|#90599/i.test(text) &&
    /steer|bypass|diffs vanish|no Edit|no Write/i.test(text);
  const killed = /killed|truncated|here-string|2–3×|2-3x|#90597/i.test(text);
  const ungated = /ungated|Platform: win32|no platform condition|POSIX heredoc/i.test(text);
  const allowlisted = /allowlisted|Bash\(python3 \*\)|Bash\(sed \*\)|#85511|zero prompts/i.test(text);
  const slotted = /slotted|night-depository|sed \/ heredoc|python -c write/i.test(text);
  const unreceipted = /unreceipted|diffs vanished|no visual record/i.test(text);
  const unhooked = /unhooked|PreToolUse|Write\|Edit\|NotebookEdit|paths: frontmatter|#89251|#87575/i.test(text);
  const overlay = /overlay|CLAUDE\.md prompt-vs-prompt|preferBashForFileOps|showEditDiffs/i.test(text);
  const restored = /restored|acceptEdits restores|leaving bypass/i.test(text);
  const posted = /admit posted|teller grille|Edit\/Write used|receipt\/diff would render/i.test(text);

  if (killed && !/steer/.test(text)) {
    return {
      ...seedKilled().grille,
      session: "paste-killed",
      source: "anthropics/claude-code#90597",
      issue: WINDOWS_ISSUE,
      scored: true,
    };
  }
  if (ungated && !/steer/.test(text) && !/killed/.test(text)) {
    return {
      ...seedUngated().grille,
      session: "paste-ungated",
      source: "anthropics/claude-code#90597",
      issue: WINDOWS_ISSUE,
      scored: true,
    };
  }
  if (steered) {
    return {
      ...seedSteered().grille,
      session: "paste-steered",
      source: "anthropics/claude-code#90599",
      issue: FEATURED_ISSUE,
      scored: true,
    };
  }
  if (allowlisted) {
    return {
      ...seedAllowlisted().grille,
      session: "paste-allowlisted",
      source: "anthropics/claude-code#85511",
      issue: ALLOWLIST_ISSUE,
      scored: true,
    };
  }
  if (slotted) {
    return {
      ...seedSlotted().grille,
      session: "paste-slotted",
      source: "anthropics/claude-code#31292",
      issue: DISALLOW_ISSUE,
      scored: true,
    };
  }
  if (unreceipted) {
    return {
      ...seedUnreceipted().grille,
      session: "paste-unreceipted",
      source: "anthropics/claude-code#90599",
      issue: FEATURED_ISSUE,
      scored: true,
    };
  }
  if (unhooked) {
    return {
      ...seedUnhooked().grille,
      session: "paste-unhooked",
      source: "anthropics/claude-code#89251",
      issue: HOOK_ISSUE,
      scored: true,
    };
  }
  if (overlay) {
    return {
      ...seedOverlay().grille,
      session: "paste-overlay",
      source: "anthropics/claude-code#90599",
      issue: FEATURED_ISSUE,
      scored: true,
    };
  }
  if (restored) {
    return {
      ...seedRestored().grille,
      session: "paste-restored",
      source: "anthropics/claude-code#90599",
      issue: FEATURED_ISSUE,
      scored: true,
    };
  }
  if (posted) {
    return { ...seedPosted().grille, session: "paste-posted", source: "paste", scored: true };
  }
  return { ...emptyGrille(), session: "paste", source: "paste", scored: true };
}

export function parseJsonl(raw = "") {
  return parseSessionTrace(raw);
}

const SEEDS = {
  posted: seedPosted,
  control: seedControl,
  steered: seedSteered,
  90599: seed90599,
  "90599-steered": seedSteered,
  slotted: seedSlotted,
  unreceipted: seedUnreceipted,
  unhooked: seedUnhooked,
  killed: seedKilled,
  overlay: seedOverlay,
  ungated: seedUngated,
  allowlisted: seedAllowlisted,
  restored: seedRestored,
  reset: seedReset,
  idle: seedReset,
  healthy: seedControl,
  teller: seedControl,
  desk: seedControl,
};

export function decideSeed(seed, extra = {}) {
  if (typeof seed === "function") return decide({ ...seed(), ...extra });
  if (typeof seed === "number" || (typeof seed === "string" && SEEDS[seed])) {
    return decide({ ...SEEDS[seed](), ...extra });
  }
  return decide({ ...seed, ...extra });
}

export function decide(payload = {}) {
  if (typeof payload === "function") return decide(payload());
  const action = readAction(payload);
  let grille = cloneGrille(action.grille);
  const verb = String(action.action || "score").toLowerCase();

  if (
    verb === "bail" ||
    verb === "posted" ||
    verb === "still" ||
    verb === "rest" ||
    verb === "reset"
  ) {
    return grilleResult("posted", emptyGrille(), {
      ...action,
      action: verb === "still" || verb === "rest" || verb === "reset" ? "bail" : verb,
    });
  }

  if (verb === "control" || verb === "healthy" || verb === "proof" || verb === "teller" || verb === "desk") {
    grille = seedControl().grille;
    return grilleResult(classify(grille), grille, { ...action, action: "control" });
  }

  if (verb === "restore" || verb === "steered" || verb === "incident" || verb === "90599") {
    grille = seedSteered().grille;
    return grilleResult(classify(grille), grille, {
      ...action,
      action: verb === "restore" ? "restore" : verb,
    });
  }

  if (verb === "observe" || verb === "trace" || verb === "ledger" || verb === "stamp" || verb === "score-desk") {
    grille = { ...grille, scored: true };
    return grilleResult(classify(grille), grille, {
      ...action,
      action: verb === "observe" ? "ledger" : verb,
    });
  }

  if (verb === "press" || verb === "admit" || verb === "score" || verb === "throw" || verb === "make") {
    grille = { ...grille, scored: true };
    return grilleResult(classify(grille), grille, {
      ...action,
      action: verb === "press" || verb === "throw" || verb === "make" ? "score" : verb,
    });
  }

  grille = { ...grille, scored: true };
  return grilleResult(classify(grille), grille, action);
}
