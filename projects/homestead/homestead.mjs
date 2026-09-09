#!/usr/bin/env node
/**
 * Homestead — prairie land-office / homestead-claim desk.
 *
 * Educational diagnostic model for a published HOME-cwd hang:
 * when cwd is $HOME and there is no git repo, a file-index `rg`
 * scan walks the entire home tree, hits macOS TCC-denied tracts,
 * the rg subprocess exits, and the parent `claude` hangs idle
 * (~0.1% CPU) with no further debug line.
 *
 *   node homestead.mjs data/homesteaded.json
 *   echo '{"seed":"homesteaded"}' | node homestead.mjs
 *
 * Idle word is deeded (HOLD: session answers; file-index bounded
 * to project/cwd, or HOME only when HOME is the project; TCC
 * permission errors do not freeze the parent).
 * Path word is homesteaded (unscoped $HOME rg walk + TCC wall →
 * parent hangs idle after rg exits).
 * Seeded recover word is staked (bounded claim / graceful
 * continue after permission-denied stderr).
 *
 * Encoded from anthropics/claude-code#92932 issue body only.
 * Hypothesis (NON-BINDING): when no git root, file-index falls
 * back to $HOME; consumer of rg's many TCC error lines hangs
 * after rg exits. Invite verify against #92932 text only.
 * Do NOT implement a fix in anthropics/claude-code.
 * No network. No exploits. No live Claude. No Desktop automation.
 * No payloads. No secrets.
 */

/* Browser-safe: no top-level node: imports. CLI I/O is loaded only in main(). */

export const VERDICTS = Object.freeze([
  "deeded",
  "homesteaded",
  "staked",
  "unscoped-home",
  "tcc-wall",
  "rg-exited",
  "parent-idle",
  "safe-mode-ok",
  "bare-ok",
  "mcp-ruled-out",
  "git-root-ok",
  "last-debug-line",
  "cousins",
  "before-after",
  "fixtures",
]);

export const IDLE_WORD = "deeded";
export const PATH_WORD = "homesteaded";
export const SEEDED_WORD = "staked";
export const HOLD = Object.freeze(["deeded"]);
export const RECOVER = Object.freeze(["staked"]);
export const ALARM = Object.freeze(VERDICTS.filter((name) => name !== "deeded"));
export const CHIPS = Object.freeze([...VERDICTS]);
export const FORBIDDEN_IDLE = Object.freeze([
  "parked",
  "epitaphed",
  "inscribed",
  "collated",
  "stereotyped",
  "emended",
  "confirmed",
  "miraged",
  "loosed",
  "clung",
  "banked",
  "intact",
  "culled",
  "enrolled",
  "escheated",
  "as-penned",
  "rewritten",
  "rove",
  "vaulted",
  "cleared",
  "fouled",
  "voided",
  "snuffed",
  "tenured",
  "arrested",
  "credited",
  "paid",
  "spilled",
  "ukased",
  "stripped",
  "armed",
  "lost",
  "filed",
  "dry",
  "bonded",
  "leaked",
  "closed",
  "orphaned",
  "keyed",
  "flattened",
  "meshed",
  "swallowed",
  "unbound",
  "echoed",
  "advanced",
  "laden",
  "shed",
  "deaf",
  "remounted",
  "refused",
  "imprinted",
  "ambered",
  "bynamed",
  "bricked",
  "crenelled",
  "unrung",
  "quieted",
  "porous",
  "cribbed",
  "slipped",
  "sprung",
]);
export const FORBIDDEN_SEED = Object.freeze([...FORBIDDEN_IDLE]);

export const FEATURED_ISSUE = 92932;
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/92932";
export const TITLE =
  "New session hangs indefinitely when cwd is HOME with no git repo - unscoped rg scan hits TCC-denied paths";
export const STATE = "OPEN";
export const LABELS = Object.freeze([
  "bug",
  "has repro",
  "platform:macos",
  "area:core",
]);
export const VERSION = "2.1.263";
export const OS_NAME = "macOS 26.6.2 (Build 25G83)";
export const NODE_VERSION = "v26.5.0";
export const SHELL_NAME = "zsh";
export const ARCH = "Apple Silicon Darwin";
export const REPORTER = "mcorbett51090";
export const FILED_AT = "2026-09-08T20:44:54Z";
export const PARENT_CPU_PCT = 0.1;
export const RG_EXIT_CODE = 2;
export const OS_ERROR = 1;
export const RG_ERROR_PHRASE = "Operation not permitted (os error 1)";

export const TCC_TRACTS = Object.freeze([
  ".Trash",
  "Library/Caches/com.apple.ap.adprivacyd",
  "Library/Trial",
  "Library/Mail",
  "Pictures/Photos Library.photoslibrary",
  "Library/com.apple.aiml.instrumentation",
  "Library/Sharing",
  "Library/HomeKit",
  "Library/Messages",
  "Library/IdentityServices",
  "Library/Autosave Information",
  "Library/Daemon Containers",
]);

export const COUSINS = Object.freeze([
  {
    issue: 92784,
    product: "Rushlight",
    title: "TCC AppData grant re-prompt tenure",
    citeOnly: true,
    why: "same platform TCC family, different defect — grant tenure, not HOME rg walk",
  },
  {
    issue: 92908,
    product: "Cadastre",
    title: "trust-parcel RMW lock escheat",
    citeOnly: true,
    why: "land metaphor only; different bug — registry lock, not file-index hang",
  },
  {
    issue: 92036,
    title: "worktree probe timeout hang in a specific project directory",
    citeOnly: true,
    why: "hang cousin; different cause — probe timeout inside a project, not HOME fallback",
  },
  {
    issue: 91881,
    title: "Windows native install hang zero network",
    citeOnly: true,
    why: "hang cousin; different OS and cause — install hang, not macOS TCC rg walk",
  },
]);

export const NOT_PRODUCTS = Object.freeze([
  "epitaph",
  "recension",
  "mirage",
  "remora",
  "procrustes",
  "cadastre",
  "rubric",
  "sheave",
  "mailslot",
  "ukase",
  "scabbard",
  "deadletter",
  "rushlight",
  "quill",
  "colophon",
  "sallyport",
]);

/**
 * Published claim walk from #92932 only. Facts from the issue body —
 * no invented debug lines beyond the listed TCC tracts.
 */
export const CLAIM_WALK = Object.freeze([
  {
    t: "cd-home",
    event: "cwd",
    cwdIsHome: true,
    hasGitRoot: false,
    cwd: "$HOME",
  },
  {
    t: "launch",
    event: "launch",
    mode: "normal",
    debug: true,
    cwdIsHome: true,
    hasGitRoot: false,
  },
  {
    t: "prompt",
    event: "prompt",
    anyPrompt: true,
    cwdIsHome: true,
    hasGitRoot: false,
  },
  {
    t: "scan",
    event: "unscoped-scan",
    scanScope: "unscoped-home",
    scanBounded: false,
    hasGitRoot: false,
    cwdIsHome: true,
    cwd: "$HOME",
  },
  {
    t: "tcc",
    event: "tcc-wall",
    cwdIsHome: true,
    hasGitRoot: false,
    scanScope: "unscoped-home",
    scanBounded: false,
    tccDenied: TCC_TRACTS,
    rgExitCode: RG_EXIT_CODE,
  },
  {
    t: "rg-exit",
    event: "rg-exited",
    cwdIsHome: true,
    hasGitRoot: false,
    scanScope: "unscoped-home",
    scanBounded: false,
    tccDenied: TCC_TRACTS,
    rgExitCode: RG_EXIT_CODE,
    rgExited: true,
    rgStillRunning: false,
    lastDebugIsRgError: true,
    parentResponds: false,
    parentBlocked: true,
    parentCpuPct: PARENT_CPU_PCT,
    permissionDeniedHandled: false,
  },
  {
    t: "hang",
    event: "parent-idle",
    cwdIsHome: true,
    hasGitRoot: false,
    scanScope: "unscoped-home",
    scanBounded: false,
    tccDenied: TCC_TRACTS,
    rgExited: true,
    rgStillRunning: false,
    parentResponds: false,
    parentBlocked: true,
    parentCpuPct: PARENT_CPU_PCT,
    lastDebugIsRgError: true,
    permissionDeniedHandled: false,
  },
]);

export function tccLine(tract) {
  return `rg: /Users/<user>/${tract}: ${RG_ERROR_PHRASE}`;
}

export function tccBlock(tracts = TCC_TRACTS) {
  const head = `rg error (signal=undefined, code=${RG_EXIT_CODE}, stderr: `;
  const body = tracts.map(tccLine).join("\n");
  return `${head}${body}\n... (dozens more)`;
}

function classifyFromSeed(seed) {
  if (seed && VERDICTS.includes(seed)) return seed;
  return null;
}

export function emptyTicket() {
  return {
    seed: IDLE_WORD,
    cwdIsHome: false,
    cwd: "/Users/<user>/project",
    hasGitRoot: true,
    scanScope: "project",
    scanBounded: true,
    tccDenied: [],
    rgExited: true,
    rgStillRunning: false,
    parentResponds: true,
    parentBlocked: false,
    lastDebugIsRgError: false,
    permissionDeniedHandled: true,
    mode: "normal",
    safeMode: false,
    bare: false,
    mcpConfigEmpty: false,
  };
}

export function seedDeeded() {
  return { ...emptyTicket() };
}

export function seedHomesteaded() {
  return {
    seed: PATH_WORD,
    cwdIsHome: true,
    cwd: "$HOME",
    hasGitRoot: false,
    scanScope: "unscoped-home",
    scanBounded: false,
    tccDenied: [...TCC_TRACTS],
    rgExitCode: RG_EXIT_CODE,
    rgExited: true,
    rgStillRunning: false,
    parentResponds: false,
    parentBlocked: true,
    parentCpuPct: PARENT_CPU_PCT,
    lastDebugIsRgError: true,
    permissionDeniedHandled: false,
    mode: "normal",
    safeMode: false,
    bare: false,
    mcpConfigEmpty: false,
    debug: true,
  };
}

export function seedStaked() {
  return {
    seed: SEEDED_WORD,
    cwdIsHome: true,
    cwd: "$HOME",
    hasGitRoot: false,
    scanScope: "cwd",
    scanBounded: true,
    tccDenied: [...TCC_TRACTS],
    rgExitCode: RG_EXIT_CODE,
    rgExited: true,
    rgStillRunning: false,
    parentResponds: true,
    parentBlocked: false,
    lastDebugIsRgError: false,
    permissionDeniedHandled: true,
    mode: "normal",
    safeMode: false,
    bare: false,
    mcpConfigEmpty: false,
  };
}

export function normalizeClaim(raw) {
  if (!raw || typeof raw !== "object") {
    return {
      cwdIsHome: false,
      hasGitRoot: false,
      scanScope: null,
      scanBounded: false,
      tccDenied: [],
      rgExited: false,
      rgStillRunning: false,
      parentResponds: null,
      parentBlocked: false,
      parentCpuPct: null,
      lastDebugIsRgError: false,
      permissionDeniedHandled: false,
      mode: "normal",
      safeMode: false,
      bare: false,
      mcpConfigEmpty: false,
    };
  }
  const denied = Array.isArray(raw.tccDenied)
    ? raw.tccDenied
    : Array.isArray(raw.tccTracts)
      ? raw.tccTracts
      : [];
  const cwdIsHome =
    raw.cwdIsHome === true ||
    raw.cwd === "$HOME" ||
    raw.cwd === "~" ||
    raw.cwd === "HOME";
  const scanScope =
    raw.scanScope ||
    raw.scope ||
    (raw.scanBounded === true
      ? raw.hasGitRoot
        ? "project"
        : "cwd"
      : cwdIsHome && raw.hasGitRoot !== true
        ? "unscoped-home"
        : null);
  return {
    cwd: raw.cwd || (cwdIsHome ? "$HOME" : null),
    cwdIsHome,
    hasGitRoot: raw.hasGitRoot === true,
    scanScope,
    scanBounded:
      raw.scanBounded === true ||
      scanScope === "cwd" ||
      scanScope === "project" ||
      scanScope === "home-as-project",
    tccDenied: denied,
    tccCount: denied.length || Number(raw.tccCount) || 0,
    rgExitCode: raw.rgExitCode ?? raw.code ?? null,
    rgExited: raw.rgExited === true,
    rgStillRunning: raw.rgStillRunning === true,
    parentResponds: raw.parentResponds === true,
    parentBlocked: raw.parentBlocked === true,
    parentCpuPct:
      raw.parentCpuPct != null ? Number(raw.parentCpuPct) : null,
    lastDebugIsRgError: raw.lastDebugIsRgError === true,
    permissionDeniedHandled: raw.permissionDeniedHandled === true,
    mode: raw.mode || (raw.safeMode ? "safe" : raw.bare ? "bare" : "normal"),
    safeMode: raw.safeMode === true || raw.mode === "safe",
    bare: raw.bare === true || raw.mode === "bare",
    mcpConfigEmpty: raw.mcpConfigEmpty === true,
    debug: raw.debug === true,
    event: raw.event || raw.kind || null,
    t: raw.t || raw.time || null,
  };
}

function hasClaimFields(ticket) {
  return Boolean(
    ticket &&
      (ticket.cwdIsHome != null ||
        ticket.hasGitRoot != null ||
        ticket.scanScope != null ||
        ticket.scanBounded != null ||
        ticket.tccDenied != null ||
        ticket.rgExited != null ||
        ticket.parentResponds != null ||
        ticket.parentBlocked != null ||
        ticket.lastDebugIsRgError != null ||
        ticket.permissionDeniedHandled != null ||
        ticket.safeMode != null ||
        ticket.bare != null ||
        ticket.mcpConfigEmpty != null ||
        ticket.event),
  );
}

/**
 * Score one homestead claim against the file-index walk.
 * deeded: session answers; scan bounded to project/cwd (or HOME only
 *   when HOME is the project); TCC denials do not freeze the parent.
 * homesteaded: unscoped $HOME walk + TCC wall + rg exits + parent hangs.
 * staked: bounded claim / graceful continue after permission-denied.
 */
export function scoreClaim(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const row = normalizeClaim(ticket);
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);
  const tccHits = row.tccCount > 0 || row.tccDenied.length > 0;
  const unscopedHome =
    row.scanScope === "unscoped-home" ||
    (row.cwdIsHome && !row.hasGitRoot && !row.scanBounded);
  const parentHangs =
    row.parentResponds === false &&
    (row.parentBlocked ||
      (row.parentCpuPct != null && row.parentCpuPct <= 0.2) ||
      row.event === "parent-idle");
  const parentAnswers = row.parentResponds === true && !row.parentBlocked;
  const bounded =
    row.scanBounded ||
    row.scanScope === "cwd" ||
    row.scanScope === "project" ||
    row.scanScope === "home-as-project";
  const homeIsProject =
    row.cwdIsHome && (row.hasGitRoot || row.scanScope === "home-as-project");

  let verdict = IDLE_WORD;
  if (
    unscopedHome &&
    tccHits &&
    row.rgExited &&
    !row.rgStillRunning &&
    parentHangs &&
    !row.permissionDeniedHandled
  ) {
    verdict = "homesteaded";
  } else if (
    tccHits &&
    row.permissionDeniedHandled &&
    parentAnswers &&
    (bounded || ticket.seed === SEEDED_WORD)
  ) {
    verdict = "staked";
  } else if (parentAnswers && (bounded || homeIsProject || row.hasGitRoot)) {
    verdict = "deeded";
  } else if (parentHangs && unscopedHome && tccHits) {
    verdict = "homesteaded";
  } else if (row.safeMode && parentAnswers) {
    verdict = "safe-mode-ok";
  } else if (row.bare && parentAnswers) {
    verdict = "bare-ok";
  } else if (row.hasGitRoot && parentAnswers) {
    verdict = "git-root-ok";
  }

  if (seeded && (!hasClaimFields(ticket) || ticket.preferSeed === true)) {
    verdict = seeded;
  }

  const hold = HOLD.includes(verdict);
  return {
    verdict,
    idleWord: IDLE_WORD,
    pathWord: PATH_WORD,
    seededWord: SEEDED_WORD,
    hold,
    alarm: !hold,
    recover: RECOVER.includes(verdict),
    deeded: verdict === "deeded",
    homesteaded: verdict === "homesteaded",
    staked: verdict === "staked" || verdict === SEEDED_WORD,
    cwdIsHome: row.cwdIsHome,
    cwd: row.cwd,
    hasGitRoot: row.hasGitRoot,
    scanScope: row.scanScope,
    scanBounded: bounded,
    unscopedHome,
    tccDenied: [...row.tccDenied],
    tccCount: row.tccDenied.length || row.tccCount,
    rgExited: row.rgExited,
    rgStillRunning: row.rgStillRunning,
    rgExitCode: row.rgExitCode,
    parentResponds: row.parentResponds,
    parentBlocked: row.parentBlocked,
    parentCpuPct: row.parentCpuPct,
    lastDebugIsRgError: row.lastDebugIsRgError,
    permissionDeniedHandled: row.permissionDeniedHandled,
    mode: row.mode,
    safeMode: row.safeMode,
    bare: row.bare,
    mcpConfigEmpty: row.mcpConfigEmpty,
    event: row.event,
    t: row.t,
    phrase: hold ? "admit deeded" : "score homesteaded",
  };
}

export function scoreWalk(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const rows = Array.isArray(ticket.rows)
    ? ticket.rows
    : Array.isArray(ticket.walk)
      ? ticket.walk
      : CLAIM_WALK;
  const scored = rows.map((row) => ({
    ...normalizeClaim(row),
    ...scoreClaim({ ...row, preferSeed: false }),
  }));
  const homesteaded = scored.filter((row) => row.verdict === "homesteaded");
  const staked = scored.filter((row) => row.verdict === "staked");
  const deeded = scored.filter((row) => row.verdict === "deeded");
  const headline =
    scored.find((row) => row.event === "parent-idle") ||
    homesteaded[homesteaded.length - 1];
  let verdict = "deeded";
  if (homesteaded.length) verdict = "homesteaded";
  else if (staked.length && !deeded.length) verdict = "staked";
  if (ticket.seed === "fixtures" || ticket.verdict === "fixtures") {
    verdict = "fixtures";
  }
  return {
    verdict,
    idleWord: IDLE_WORD,
    pathWord: PATH_WORD,
    seededWord: SEEDED_WORD,
    hold: verdict === "deeded",
    alarm: verdict !== "deeded",
    homesteadedCount: homesteaded.length,
    stakedCount: staked.length,
    deededCount: deeded.length,
    headline,
    rows: scored,
    phrase: verdict === "deeded" ? "admit deeded" : "score homesteaded",
    note: headline
      ? "unscoped $HOME rg walk hits TCC-denied tracts; rg exits; parent hangs idle"
      : "published HOME-cwd claim walk scored against bounded vs unscoped scan",
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
    seeded !== "deeded" &&
    seeded !== "homesteaded" &&
    seeded !== "staked" &&
    !ticket.cwdIsHome &&
    !ticket.hasGitRoot &&
    !ticket.scanScope &&
    !ticket.rows &&
    !ticket.walk
  ) {
    return seeded;
  }
  if (Array.isArray(ticket.rows) || Array.isArray(ticket.walk)) {
    return scoreWalk(ticket).verdict;
  }
  return scoreClaim(ticket).verdict;
}

export function decide(input) {
  return classify(input);
}

export function analyze(input) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);
  const multi = Array.isArray(ticket.rows) || Array.isArray(ticket.walk);
  const scored = multi ? scoreWalk(ticket) : scoreClaim(ticket);
  const verdict =
    seeded && ticket.preferSeed === true
      ? seeded
      : seeded && !hasClaimFields(ticket) && !multi
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
    tccBlock: tccBlock(),
  };
}

export function score(input) {
  return analyze(input).verdict;
}

export function fingerprint(input) {
  const result = analyze(input);
  return [
    result.verdict,
    result.cwdIsHome ? "cwd=HOME" : "cwd=project",
    result.hasGitRoot ? "git=yes" : "git=no",
    result.unscopedHome ? "scope=HOME" : "scope=bound",
    result.parentResponds ? "parent=answers" : "parent=hangs",
  ].join("|");
}

export function handle(input) {
  const result = analyze(input);
  return {
    ...result,
    fingerprint: fingerprint(input),
    published: {
      issue: FEATURED_ISSUE,
      url: ISSUE_URL,
      title: TITLE,
      state: STATE,
      labels: [...LABELS],
      version: VERSION,
      os: OS_NAME,
      node: NODE_VERSION,
      shell: SHELL_NAME,
      arch: ARCH,
      reporter: REPORTER,
      filedAt: FILED_AT,
      parentCpuPct: PARENT_CPU_PCT,
      rgExitCode: RG_EXIT_CODE,
      osError: OS_ERROR,
      tccTracts: [...TCC_TRACTS],
      lastDebug: "rg-error block (code=2 / Operation not permitted)",
      unaffected: ["--safe-mode", "--bare"],
      mcpRuledOut: true,
      workaround: "cd into a git repo before launching claude",
      hypothesis:
        "when no git root, file-index falls back to $HOME; consumer of rg's many TCC error lines hangs after rg exits",
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
