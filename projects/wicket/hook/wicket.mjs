/**
 * Wicket — gatehouse / turnstile for worktree isolation escapes.
 * isolation:"worktree" / EnterWorktree sets a default cwd and sometimes a
 * session-wide latch, but Edit/Write with an absolute file_path still lands
 * in the main checkout. Score a probe against the pinned worktree root.
 * Admit the write (home) or name the failure class.
 * Verdicts: home | escape | latch | reap | swap | misbind | hijack | split.
 * Idle word is home. A successful EnterWorktree report is not a hold.
 * Path check is component-containment (is_relative_to / parents walk),
 * never a string prefix.
 * Not Hasp. Not Stencil. Not Reveille. Not Sigil / Suture / Blot / Coda /
 * Reed / Fathom / Parity / Quench / Scrim / Knock.
 */

export const VERDICTS = Object.freeze([
  "home",
  "escape",
  "latch",
  "reap",
  "swap",
  "misbind",
  "hijack",
  "split",
]);
export const IDLE_WORD = "home";
export const ALARM_VERDICTS = Object.freeze(["escape", "latch", "reap", "hijack", "split"]);
export const MUTATING_TOOLS = Object.freeze([
  "Edit",
  "Write",
  "MultiEdit",
  "NotebookEdit",
  "Bash",
]);

const RESET_HARD = /\bgit\b[\s\S]*\breset\b[\s\S]*--hard\b/i;

export function emptyGate() {
  return {
    session: "",
    pin: "",
    main: "",
    filePath: "",
    cwd: "",
    tool: "",
    command: "",
    isolation: "",
    latch: false,
    enterWorktreeMidBatch: false,
    childAlive: false,
    parentIdle: false,
    reaped: false,
    siblingCwd: "",
    bindCwd: "",
    targetRepo: "",
    logicalCwd: "",
    shellCwd: "",
    guardClaim: "",
    enterWorktreeReportedSuccess: false,
    hijackedBy: "",
    lastWriterWins: false,
    complexBash: false,
    falseGitRedirect: false,
    branchScope: "",
    mutatedMain: false,
    resetHard: false,
    guardFired: null,
    admitted: false,
    refused: false,
    rebound: false,
    held: false,
    source: "",
    issue: null,
  };
}

export function emptyAction(session = "home-1") {
  return {
    action: "score",
    session,
    gate: emptyGate(),
  };
}

function asText(value) {
  return value != null ? String(value) : "";
}

export function cloneValue(raw) {
  if (raw == null || typeof raw !== "object") return raw;
  return JSON.parse(JSON.stringify(raw));
}

export function cloneGate(raw = {}) {
  const src = raw && typeof raw === "object" ? raw : emptyGate();
  const base = emptyGate();
  return {
    ...base,
    ...src,
    session: asText(src.session),
    pin: asText(src.pin),
    main: asText(src.main),
    filePath: asText(src.filePath ?? src.file_path),
    cwd: asText(src.cwd),
    tool: asText(src.tool),
    command: asText(src.command),
    isolation: asText(src.isolation),
    latch: Boolean(src.latch),
    enterWorktreeMidBatch: Boolean(src.enterWorktreeMidBatch),
    childAlive: Boolean(src.childAlive),
    parentIdle: Boolean(src.parentIdle),
    reaped: Boolean(src.reaped),
    siblingCwd: asText(src.siblingCwd),
    bindCwd: asText(src.bindCwd),
    targetRepo: asText(src.targetRepo),
    logicalCwd: asText(src.logicalCwd),
    shellCwd: asText(src.shellCwd),
    guardClaim: asText(src.guardClaim),
    enterWorktreeReportedSuccess: Boolean(src.enterWorktreeReportedSuccess),
    hijackedBy: asText(src.hijackedBy),
    lastWriterWins: Boolean(src.lastWriterWins),
    complexBash: Boolean(src.complexBash),
    falseGitRedirect: Boolean(src.falseGitRedirect),
    branchScope: asText(src.branchScope),
    mutatedMain: Boolean(src.mutatedMain),
    resetHard: Boolean(src.resetHard),
    guardFired: src.guardFired == null ? null : Boolean(src.guardFired),
    admitted: Boolean(src.admitted),
    refused: Boolean(src.refused),
    rebound: Boolean(src.rebound),
    held: Boolean(src.held),
    source: asText(src.source),
    issue: src.issue ?? null,
  };
}

/** Collapse `.` / `..`, unify slashes. Keep a leading `/` or a Windows drive. */
export function normalizePath(input) {
  if (input == null) return "";
  const raw = String(input).trim();
  if (!raw) return "";
  const unified = raw.replace(/\\/g, "/");
  const drive = unified.match(/^([A-Za-z]:)(\/|$)/);
  const isAbs = unified.startsWith("/") || Boolean(drive);
  const pieces = unified.split("/");
  const parts = [];
  for (const piece of pieces) {
    if (piece === "" || piece === ".") continue;
    if (piece === "..") {
      if (parts.length && parts[parts.length - 1] !== "..") parts.pop();
      continue;
    }
    parts.push(piece);
  }
  if (drive) {
    const rest = parts.slice(1).join("/");
    return rest ? `${parts[0]}/${rest}` : parts[0] || drive[1];
  }
  if (isAbs) return `/${parts.join("/")}`;
  return parts.join("/");
}

export function pathComponents(input) {
  const normalized = normalizePath(input);
  if (!normalized) return [];
  return normalized.split("/").filter((part) => part.length > 0);
}

export function parentOf(input) {
  const parts = pathComponents(input);
  if (parts.length <= 1) return "";
  const normalized = normalizePath(input);
  const joined = parts.slice(0, -1).join("/");
  if (/^[A-Za-z]:/.test(normalized)) return joined;
  return `/${joined}`;
}

export function joinPath(root, ...segments) {
  const base = normalizePath(root);
  const extra = segments
    .flatMap((segment) => pathComponents(segment))
    .filter(Boolean);
  if (!base && !extra.length) return "";
  if (!base) return extra.join("/");
  if (!extra.length) return base;
  if (/^[A-Za-z]:/.test(base)) return `${base.replace(/\/$/, "")}/${extra.join("/")}`;
  if (base === "/") return `/${extra.join("/")}`;
  return `${base.replace(/\/$/, "")}/${extra.join("/")}`;
}

/**
 * Component-containment. `/tmp/wt-other` is not inside `/tmp/wt`.
 * Walks parents; never uses a character-prefix startswith.
 */
export function isRelativeTo(child, parent) {
  const c = normalizePath(child);
  const p = normalizePath(parent);
  if (!c || !p) return false;
  if (c === p) return true;
  const childParts = pathComponents(c);
  const parentParts = pathComponents(p);
  if (parentParts.length > childParts.length) return false;
  for (let i = 0; i < parentParts.length; i += 1) {
    if (childParts[i] !== parentParts[i]) return false;
  }
  return true;
}

export function relativeTo(child, parent) {
  if (!isRelativeTo(child, parent)) return "";
  const childParts = pathComponents(child);
  const parentParts = pathComponents(parent);
  return childParts.slice(parentParts.length).join("/");
}

export function isSiblingWorktree(left, right) {
  const a = normalizePath(left);
  const b = normalizePath(right);
  if (!a || !b || a === b) return false;
  const parentA = parentOf(a);
  const parentB = parentOf(b);
  return Boolean(parentA) && parentA === parentB;
}

export function looksResetHard(command = "") {
  return RESET_HARD.test(asText(command));
}

/** Three-way workspace identity: claimed pin, shell cwd, guard claim. */
export function identityOf(gate = {}) {
  const next = cloneGate(gate);
  return {
    logical: normalizePath(next.logicalCwd),
    shell: normalizePath(next.shellCwd),
    guard: normalizePath(next.guardClaim),
  };
}

export function identitiesAgree(gate = {}) {
  const { logical, shell, guard } = identityOf(gate);
  const present = [logical, shell, guard].filter(Boolean);
  if (present.length < 2) return true;
  return present.every((part) => part === present[0]);
}

export function isSplit(gate = {}) {
  const next = cloneGate(gate);
  return Boolean(next.enterWorktreeReportedSuccess) && !identitiesAgree(next);
}

export function isHijack(gate = {}) {
  const next = cloneGate(gate);
  if (next.lastWriterWins || next.hijackedBy) return true;
  if (next.branchScope === "repo") return true;
  return !identitiesAgree(next) && !isSplit(next);
}

function isMutating(gate) {
  return MUTATING_TOOLS.includes(gate.tool) || looksResetHard(gate.command) || gate.resetHard;
}

export function isLatch(gate = {}) {
  const next = cloneGate(gate);
  return (
    next.latch ||
    (next.enterWorktreeMidBatch && next.isolation === "worktree") ||
    next.falseGitRedirect ||
    (next.complexBash && next.guardFired !== false && identitiesAgree(next) && !next.enterWorktreeReportedSuccess)
  );
}

export function isReap(gate = {}) {
  const next = cloneGate(gate);
  return next.reaped && next.childAlive;
}

export function isSwap(gate = {}) {
  const next = cloneGate(gate);
  const cwd = normalizePath(next.cwd);
  const pin = normalizePath(next.pin);
  if (!cwd || !pin || cwd === pin) return false;
  if (next.siblingCwd && normalizePath(next.siblingCwd) === cwd) return true;
  return isSiblingWorktree(cwd, pin);
}

export function isMisbind(gate = {}) {
  const next = cloneGate(gate);
  const bind = normalizePath(next.bindCwd);
  const target = normalizePath(next.targetRepo);
  if (!bind || !target) return false;
  return bind !== target && !isRelativeTo(bind, target);
}

export function isEscape(gate = {}) {
  const next = cloneGate(gate);
  const pin = normalizePath(next.pin);
  const main = normalizePath(next.main);
  const filePath = normalizePath(next.filePath);
  const cwd = normalizePath(next.cwd);
  const resetHard = next.resetHard || looksResetHard(next.command);
  if (!pin) return false;

  if (filePath && !isRelativeTo(filePath, pin)) return true;

  if (resetHard && next.guardFired !== true) {
    if (cwd && !isRelativeTo(cwd, pin)) return true;
    if (cwd && main && isRelativeTo(cwd, main) && !isRelativeTo(cwd, pin)) return true;
  }

  if (cwd && main && isRelativeTo(cwd, main) && !isRelativeTo(cwd, pin) && isMutating(next)) {
    return true;
  }

  return false;
}

export function classify(gate = {}) {
  const next = cloneGate(gate);
  const idle =
    !next.pin &&
    !next.filePath &&
    !next.cwd &&
    !next.command &&
    !next.latch &&
    !next.reaped &&
    !next.bindCwd &&
    !next.targetRepo &&
    !next.logicalCwd &&
    !next.shellCwd &&
    !next.guardClaim &&
    !next.hijackedBy &&
    !next.lastWriterWins &&
    !next.enterWorktreeReportedSuccess &&
    !next.falseGitRedirect &&
    !next.complexBash &&
    !next.branchScope;
  if (idle) return "home";
  if (isSplit(next)) return "split";
  if (isHijack(next)) return "hijack";
  if (isLatch(next)) return "latch";
  if (isReap(next)) return "reap";
  if (isSwap(next)) return "swap";
  if (isMisbind(next)) return "misbind";
  if (isEscape(next)) return "escape";
  return "home";
}

export function reboundPath(filePath, pin, main = "", siblingCwd = "") {
  const dest = normalizePath(pin);
  const src = normalizePath(filePath);
  if (!dest) return src;
  if (!src) return dest;
  if (isRelativeTo(src, dest)) return src;
  if (main && isRelativeTo(src, main)) {
    const rel = relativeTo(src, main);
    return rel ? joinPath(dest, rel) : dest;
  }
  if (siblingCwd && isRelativeTo(src, siblingCwd)) {
    const rel = relativeTo(src, siblingCwd);
    return rel ? joinPath(dest, rel) : dest;
  }
  let cursor = src;
  while (cursor) {
    if (isSiblingWorktree(cursor, dest)) {
      const rel = relativeTo(src, cursor);
      return rel ? joinPath(dest, rel) : dest;
    }
    cursor = parentOf(cursor);
  }
  const leaf = pathComponents(src).at(-1);
  return leaf ? joinPath(dest, leaf) : dest;
}

export function dataLossOf(gate = {}, verdict = "") {
  const next = cloneGate(gate);
  const kind = verdict || classify(next);
  if (kind !== "escape") return false;
  return Boolean(next.mutatedMain || next.resetHard || looksResetHard(next.command));
}

export function verdictOf(gate = {}) {
  return classify(gate);
}

export function readAction(payload = {}) {
  const nested = payload.action && typeof payload.action === "object" ? payload.action : null;
  const src = nested || payload;
  const gateSrc = src.gate && typeof src.gate === "object" ? src.gate : payload.gate;
  const fromFields = gateSrc && typeof gateSrc === "object" ? gateSrc : src;
  const gate = cloneGate({
    session: fromFields.session ?? src.session ?? payload.session,
    pin: fromFields.pin ?? src.pin ?? payload.pin,
    main: fromFields.main ?? src.main ?? payload.main,
    filePath: fromFields.filePath ?? fromFields.file_path ?? src.filePath ?? src.file_path ?? payload.filePath,
    cwd: fromFields.cwd ?? src.cwd ?? payload.cwd,
    tool: fromFields.tool ?? src.tool ?? payload.tool,
    command: fromFields.command ?? src.command ?? payload.command,
    isolation: fromFields.isolation ?? src.isolation ?? payload.isolation,
    latch: fromFields.latch ?? src.latch ?? payload.latch,
    enterWorktreeMidBatch:
      fromFields.enterWorktreeMidBatch ?? src.enterWorktreeMidBatch ?? payload.enterWorktreeMidBatch,
    childAlive: fromFields.childAlive ?? src.childAlive ?? payload.childAlive,
    parentIdle: fromFields.parentIdle ?? src.parentIdle ?? payload.parentIdle,
    reaped: fromFields.reaped ?? src.reaped ?? payload.reaped,
    siblingCwd: fromFields.siblingCwd ?? src.siblingCwd ?? payload.siblingCwd,
    bindCwd: fromFields.bindCwd ?? src.bindCwd ?? payload.bindCwd,
    targetRepo: fromFields.targetRepo ?? src.targetRepo ?? payload.targetRepo,
    logicalCwd: fromFields.logicalCwd ?? src.logicalCwd ?? payload.logicalCwd,
    shellCwd: fromFields.shellCwd ?? src.shellCwd ?? payload.shellCwd,
    guardClaim: fromFields.guardClaim ?? src.guardClaim ?? payload.guardClaim,
    enterWorktreeReportedSuccess:
      fromFields.enterWorktreeReportedSuccess ??
      src.enterWorktreeReportedSuccess ??
      payload.enterWorktreeReportedSuccess,
    hijackedBy: fromFields.hijackedBy ?? src.hijackedBy ?? payload.hijackedBy,
    lastWriterWins: fromFields.lastWriterWins ?? src.lastWriterWins ?? payload.lastWriterWins,
    complexBash: fromFields.complexBash ?? src.complexBash ?? payload.complexBash,
    falseGitRedirect: fromFields.falseGitRedirect ?? src.falseGitRedirect ?? payload.falseGitRedirect,
    branchScope: fromFields.branchScope ?? src.branchScope ?? payload.branchScope,
    mutatedMain: fromFields.mutatedMain ?? src.mutatedMain ?? payload.mutatedMain,
    resetHard: fromFields.resetHard ?? src.resetHard ?? payload.resetHard,
    guardFired: fromFields.guardFired ?? src.guardFired ?? payload.guardFired,
    admitted: fromFields.admitted ?? src.admitted ?? payload.admitted,
    refused: fromFields.refused ?? src.refused ?? payload.refused,
    rebound: fromFields.rebound ?? src.rebound ?? payload.rebound,
    held: fromFields.held ?? src.held ?? payload.held,
    source: fromFields.source ?? src.source ?? payload.source,
    issue: fromFields.issue ?? src.issue ?? payload.issue,
  });
  return {
    action: String((nested ? nested.action : payload.action) || "score"),
    session: String(src.session ?? payload.session ?? gate.session ?? ""),
    gate,
    issue: src.issue ?? payload.issue ?? gate.issue ?? null,
    source: src.source ?? payload.source ?? gate.source ?? "",
  };
}

function pack(verdict, gate, action, extras = {}) {
  const next = cloneGate(gate);
  const contained = next.filePath && next.pin ? isRelativeTo(next.filePath, next.pin) : !next.filePath;
  const dataLoss = dataLossOf(next, verdict);
  return {
    ok: true,
    product: "wicket",
    verdict,
    state: verdict,
    decision: verdict,
    idleWord: IDLE_WORD,
    alarm: ALARM_VERDICTS.includes(verdict),
    action: action.action,
    session: next.session || action.session || "",
    source: next.source || action.source || "",
    issue: next.issue ?? action.issue ?? null,
    pin: next.pin,
    main: next.main,
    filePath: next.filePath,
    cwd: next.cwd,
    tool: next.tool,
    command: next.command,
    isolation: next.isolation,
    latch: next.latch,
    reaped: next.reaped,
    childAlive: next.childAlive,
    parentIdle: next.parentIdle,
    siblingCwd: next.siblingCwd,
    bindCwd: next.bindCwd,
    targetRepo: next.targetRepo,
    logicalCwd: next.logicalCwd,
    shellCwd: next.shellCwd,
    guardClaim: next.guardClaim,
    enterWorktreeReportedSuccess: next.enterWorktreeReportedSuccess,
    hijackedBy: next.hijackedBy,
    lastWriterWins: next.lastWriterWins,
    identitiesAgree: identitiesAgree(next),
    identity: identityOf(next),
    mutatedMain: next.mutatedMain,
    resetHard: next.resetHard || looksResetHard(next.command),
    guardFired: next.guardFired,
    admitted: Boolean(next.admitted),
    refused: Boolean(next.refused),
    rebound: Boolean(next.rebound),
    held: Boolean(next.held),
    contained,
    dataLoss,
    prefixFalseFriend:
      Boolean(next.filePath && next.pin) &&
      normalizePath(next.filePath).startsWith(normalizePath(next.pin)) &&
      !isRelativeTo(next.filePath, next.pin),
    gate: next,
    ...extras,
  };
}

function seedGate(issue, source, extras = {}) {
  const session = extras.session != null ? String(extras.session) : String(issue);
  const issueId = extras.issue !== undefined ? extras.issue : issue;
  return {
    action: extras.action || "score",
    session,
    issue: issueId,
    source,
    gate: {
      ...emptyGate(),
      session,
      source,
      issue: issueId,
      pin: extras.pin || "",
      main: extras.main || "",
      filePath: extras.filePath || "",
      cwd: extras.cwd || "",
      tool: extras.tool || "",
      command: extras.command || "",
      isolation: extras.isolation || "worktree",
      latch: Boolean(extras.latch),
      enterWorktreeMidBatch: Boolean(extras.enterWorktreeMidBatch),
      childAlive: Boolean(extras.childAlive),
      parentIdle: Boolean(extras.parentIdle),
      reaped: Boolean(extras.reaped),
      siblingCwd: extras.siblingCwd || "",
      bindCwd: extras.bindCwd || "",
      targetRepo: extras.targetRepo || "",
      logicalCwd: extras.logicalCwd || "",
      shellCwd: extras.shellCwd || "",
      guardClaim: extras.guardClaim || "",
      enterWorktreeReportedSuccess: Boolean(extras.enterWorktreeReportedSuccess),
      hijackedBy: extras.hijackedBy || "",
      lastWriterWins: Boolean(extras.lastWriterWins),
      complexBash: Boolean(extras.complexBash),
      falseGitRedirect: Boolean(extras.falseGitRedirect),
      branchScope: extras.branchScope || "",
      mutatedMain: Boolean(extras.mutatedMain),
      resetHard: Boolean(extras.resetHard),
      guardFired: extras.guardFired == null ? null : Boolean(extras.guardFired),
    },
  };
}

/** Absolute Edit/Write to main checkout. anthropics/claude-code#74726 (PRIMARY). */
export function seed74726() {
  return seedGate(74726, "anthropics/claude-code#74726", {
    session: "74726",
    pin: "/repo/.claude/worktrees/agent-74726",
    main: "/repo",
    filePath: "/repo/src/handler.ts",
    cwd: "/repo/.claude/worktrees/agent-74726",
    tool: "Edit",
    isolation: "worktree",
    mutatedMain: true,
  });
}

/** git reset --hard in the main checkout; guard silent. anthropics/claude-code#81333. */
export function seed81333() {
  return seedGate(81333, "anthropics/claude-code#81333", {
    pin: "C:/Users/paul/source/repos/Andoneer/.claude/worktrees/agent-81333",
    main: "C:/Users/paul/source/repos/Andoneer",
    cwd: "C:/Users/paul/source/repos/Andoneer",
    tool: "Bash",
    command: "git reset --hard e98f55f",
    isolation: "worktree",
    resetHard: true,
    guardFired: false,
    mutatedMain: true,
  });
}

/** Sibling cwd race. anthropics/claude-code#86584 (a). */
export function seed86584swap() {
  return seedGate(86584, "anthropics/claude-code#86584", {
    session: "86584-swap",
    pin: "/repo/.claude/worktrees/agent-a",
    main: "/repo",
    cwd: "/repo/.claude/worktrees/agent-b",
    siblingCwd: "/repo/.claude/worktrees/agent-b",
    filePath: "/repo/.claude/worktrees/agent-b/src/x.ts",
    tool: "Edit",
    isolation: "worktree",
  });
}

/** Idle auto-reap of a live child's worktree. anthropics/claude-code#86584 (b). */
export function seed86584reap() {
  return seedGate(86584, "anthropics/claude-code#86584", {
    session: "86584-reap",
    pin: "/repo/.claude/worktrees/agent-parent",
    main: "/repo",
    cwd: "/repo/.claude/worktrees/agent-parent",
    filePath: "/repo/.claude/worktrees/agent-parent/src/app.ts",
    tool: "Bash",
    command: "pwd",
    childAlive: true,
    parentIdle: true,
    reaped: true,
    isolation: "worktree",
  });
}

/** EnterWorktree mid-batch flips a session-wide latch. anthropics/claude-code#89102. */
export function seed89102() {
  return seedGate(89102, "anthropics/claude-code#89102", {
    pin: "/repo/.claude/worktrees/agent-own",
    main: "/repo",
    cwd: "/repo/.claude/worktrees/agent-own",
    filePath: "/repo/.claude/worktrees/agent-own/src/app.ts",
    tool: "Bash",
    command: "pwd",
    latch: true,
    enterWorktreeMidBatch: true,
    isolation: "worktree",
  });
}

/** Isolation binds the worktree to the caller's Bash cwd. anthropics/claude-code#85448. */
export function seed85448() {
  return seedGate(85448, "anthropics/claude-code#85448", {
    pin: "/workspace/repo-A/.claude/worktrees/agent-85448",
    main: "/workspace/repo-A",
    cwd: "/workspace/repo-A/.claude/worktrees/agent-85448",
    bindCwd: "/workspace/repo-A",
    targetRepo: "/workspace/repo-D",
    tool: "Agent",
    isolation: "worktree",
  });
}

/** Worktree session edits the parent checkout. anthropics/claude-code#59628. */
export function seed59628() {
  return seedGate(59628, "anthropics/claude-code#59628", {
    pin: "/io/.claude/worktrees/feat",
    main: "/io",
    filePath: "/io/io_utils.py",
    cwd: "/io/.claude/worktrees/feat",
    tool: "Edit",
    isolation: "worktree",
    mutatedMain: true,
  });
}

/** Sibling prefix false-friend. anthropics/claude-code#64322. */
export function seed64322() {
  return seedGate(64322, "anthropics/claude-code#64322", {
    pin: "/tmp/wt",
    main: "/tmp/main",
    filePath: "/tmp/wt-other/src/app.ts",
    cwd: "/tmp/wt",
    tool: "Write",
    isolation: "worktree",
  });
}

/** Same escape class as #74726. anthropics/claude-code#56137. */
export function seed56137() {
  return seedGate(56137, "anthropics/claude-code#56137", {
    pin: "/app/.claude/worktrees/group-f",
    main: "/app",
    filePath: "/app/src/seed.ts",
    cwd: "/app/.claude/worktrees/group-f",
    tool: "Write",
    isolation: "worktree",
    mutatedMain: true,
  });
}

/** Session-global last-writer-wins hijack. anthropics/claude-code#84685. */
export function seed84685() {
  return seedGate(84685, "anthropics/claude-code#84685", {
    pin: "/repo/.claude/worktrees/agent-b",
    main: "/repo",
    cwd: "/repo/.claude/worktrees/agent-a",
    logicalCwd: "/repo/.claude/worktrees/agent-b",
    shellCwd: "/repo/.claude/worktrees/agent-a",
    guardClaim: "/repo/.claude/worktrees/agent-a",
    hijackedBy: "agent-a",
    lastWriterWins: true,
    tool: "Bash",
    command: "pwd",
    isolation: "worktree",
  });
}

/** Teammate EnterWorktree/ExitWorktree repoints the shared session. anthropics/claude-code#84493. */
export function seed84493() {
  return seedGate(84493, "anthropics/claude-code#84493", {
    pin: "/repo",
    main: "/repo",
    cwd: "/repo/.claude/worktrees/childwt2",
    logicalCwd: "/repo",
    shellCwd: "/repo/.claude/worktrees/childwt2",
    guardClaim: "/repo/.claude/worktrees/childwt2",
    hijackedBy: "childwt-agent",
    lastWriterWins: true,
    tool: "Bash",
    command: "pwd",
  });
}

/** EnterWorktree reports success; Bash stays pinned to parent. anthropics/claude-code#84704. */
export function seed84704() {
  return seedGate(84704, "anthropics/claude-code#84704", {
    pin: "/repo/.claude/worktrees/B",
    main: "/repo",
    cwd: "/repo/.claude/worktrees/A",
    logicalCwd: "/repo/.claude/worktrees/B",
    shellCwd: "/repo/.claude/worktrees/A",
    guardClaim: "/repo/.claude/worktrees/A",
    enterWorktreeReportedSuccess: true,
    tool: "Bash",
    command: "pwd",
    isolation: "worktree",
  });
}

/** Guard refuses non-simple Bash with a false git-redirect story. anthropics/claude-code#88776. */
export function seed88776() {
  return seedGate(88776, "anthropics/claude-code#88776", {
    pin: "/repo/.claude/worktrees/agent-88776",
    main: "/repo",
    cwd: "/repo/.claude/worktrees/agent-88776",
    logicalCwd: "/repo/.claude/worktrees/agent-88776",
    shellCwd: "/repo/.claude/worktrees/agent-88776",
    guardClaim: "/repo/.claude/worktrees/agent-88776",
    tool: "Bash",
    command: 'bin/lint.sh 2>&1 | tail -15; echo "EXIT=${PIPESTATUS[0]}"',
    complexBash: true,
    falseGitRedirect: true,
    isolation: "worktree",
  });
}

/** Codex Desktop branch selection scoped to the repo, not the worktree. openai/codex#19627. */
export function seed19627() {
  return seedGate(19627, "openai/codex#19627", {
    pin: "/tmp/codex-worktree-demo.a",
    main: "/tmp/codex-worktree-demo",
    cwd: "/tmp/codex-worktree-demo.a",
    logicalCwd: "/tmp/codex-worktree-demo.a",
    shellCwd: "/tmp/codex-worktree-demo.a",
    guardClaim: "/tmp/codex-worktree-demo",
    branchScope: "repo",
    tool: "Agent",
  });
}

/** Write that stays inside the pin. */
export function seedHome() {
  return seedGate("home", "home", {
    session: "home",
    issue: null,
    pin: "/tmp/wt",
    main: "/tmp/main",
    filePath: "/tmp/wt/src/app.ts",
    cwd: "/tmp/wt",
    tool: "Edit",
    isolation: "worktree",
  });
}

const SEEDS = {
  74726: seed74726,
  81333: seed81333,
  "86584-swap": seed86584swap,
  "86584-reap": seed86584reap,
  89102: seed89102,
  85448: seed85448,
  59628: seed59628,
  64322: seed64322,
  56137: seed56137,
  84685: seed84685,
  84493: seed84493,
  84704: seed84704,
  88776: seed88776,
  19627: seed19627,
  home: seedHome,
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
  let gate = cloneGate(action.gate);

  if (action.action === "clear") {
    return pack("home", emptyGate(), { ...action, action: "clear" });
  }

  if (action.action === "rebound") {
    const nextPath = reboundPath(gate.filePath, gate.pin, gate.main, gate.siblingCwd);
    gate = {
      ...gate,
      filePath: nextPath,
      cwd: gate.pin || gate.cwd,
      mutatedMain: false,
      resetHard: false,
      command: looksResetHard(gate.command) ? "" : gate.command,
      latch: false,
      enterWorktreeMidBatch: false,
      reaped: false,
      childAlive: false,
      siblingCwd: "",
      bindCwd: gate.targetRepo || gate.bindCwd,
      logicalCwd: gate.pin || gate.logicalCwd,
      shellCwd: gate.pin || gate.shellCwd,
      guardClaim: gate.pin || gate.guardClaim,
      enterWorktreeReportedSuccess: false,
      hijackedBy: "",
      lastWriterWins: false,
      complexBash: false,
      falseGitRedirect: false,
      branchScope: "",
      rebound: true,
      admitted: true,
      refused: false,
      held: false,
    };
    return pack(classify(gate), gate, action);
  }

  if (action.action === "refuse") {
    gate = { ...gate, refused: true, admitted: false, held: false };
    return pack(classify(gate), gate, action);
  }

  if (action.action === "hold") {
    gate = { ...gate, held: true };
    return pack(classify(gate), gate, action);
  }

  if (action.action === "admit") {
    const verdict = classify(gate);
    gate = {
      ...gate,
      admitted: verdict === "home",
      refused: verdict !== "home",
      held: false,
    };
    return pack(verdict, gate, action);
  }

  return pack(classify(gate), gate, action);
}
