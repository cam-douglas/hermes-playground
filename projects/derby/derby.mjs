#!/usr/bin/env node
/**
 * Derby — racecourse / starting-gate / photo-finish atelier booth.
 *
 * Educational diagnostic model for a published Claude Code
 * packaging defect: the plate should stay locked (one updater in
 * flight; others skip; install stays intact). Instead two sessions
 * leave the gate ~90 ms apart and scratch the shared npm-global
 * plate — both retire the live package to the same temp path; one
 * SIGHUPs; the other exits 0; dangling symlink; command not found.
 *
 *   node derby.mjs data/derby.json
 *   echo '{"seed":"scratched"}' | node derby.mjs
 *
 * Idle word is locked (HOLD: one updater in flight; others skip;
 * install stays intact).
 * Seeded word is scratched (#93197: same temp retire path, dangling
 * symlink, command not found).
 * Path word is derby (packaging concurrency / global-install race).
 *
 * Encoded from anthropics/claude-code#93197 issue body only.
 * Hypothesis (NON-BINDING): the auto-updater does not take a
 * cross-process lock (or skip-in-flight) before launching
 * `npm install --global`, so two sessions ~90 ms apart both retire
 * the live package to the same temp path. Verify against #93197
 * text only. Do NOT claim a root cause in Claude Code source you
 * have not seen. Do NOT implement a fix in anthropics/claude-code.
 * No network. No exploits. No live Claude. No payloads. No secrets.
 */

/* Browser-safe: no top-level node: imports. CLI I/O is loaded only in main(). */

export const VERDICTS = Object.freeze([
  "locked",
  "scratched",
  "derby",
  "hold",
  "skip-in-flight",
  "concurrent-sessions",
  "shared-temp-retire",
  "sighup-vs-ok",
  "dangling-symlink",
  "command-not-found",
  "empty-package-dir",
  "npm-debug-pair",
  "has-repro",
  "cousins",
  "fixtures",
  "chips",
  "fingerprints",
  "walk",
]);

export const IDLE_WORD = "locked";
export const PATH_WORD = "derby";
export const SEEDED_WORD = "scratched";
export const HOLD = Object.freeze(["locked", "skip-in-flight", "hold"]);
export const RECOVER = Object.freeze(["locked", "skip-in-flight", "hold"]);
export const ALARM = Object.freeze(
  VERDICTS.filter((name) => !HOLD.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FORBIDDEN_IDLE = Object.freeze([
  "unmasked",
  "vizard",
  "precedence",
  "carrier",
  "deadair",
  "squelch",
  "moored",
  "scuttled",
  "scuttle",
  "open",
  "seated",
  "stopcock",
  "preserved",
  "discarded",
  "fresh",
  "stamped",
  "cleared",
  "mounded",
  "distinct",
  "conflated",
  "held",
  "steered",
  "raised",
  "fallen",
  "sterling",
  "primed",
  "flashed",
  "lodged",
  "bypassed",
  "greenroomed",
  "scaffold",
  "diplopic",
  "freewheeling",
  "doubled",
  "stereotype",
  "parergon",
  "lacuna",
  "hangfire",
  "afterimage",
  "remora",
  "cutaway",
  "rubbed",
  "flashpanned",
  "unshorn",
  "sheared",
  "secateured",
  "emended",
  "unretracted",
  "palinoded",
  "ephemeral",
  "voided",
  "fouled",
  "cold",
  "banked",
  "ferruled",
  "interlocked",
  "passable",
  "admitted",
  "deeded",
  "parked",
  "rebound",
  "detached",
  "shibbolethed",
  "countersigned",
  "homesteaded",
  "staked",
  "epitaphed",
  "inscribed",
  "collated",
  "confirmed",
  "miraged",
  "loosed",
  "clung",
  "enrolled",
  "escheated",
  "debased",
]);
export const FORBIDDEN_SEED = Object.freeze(
  FORBIDDEN_IDLE.filter((name) => name !== "scratched"),
);

export const FEATURED_ISSUE = 93197;
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/93197";
export const TITLE =
  "Auto-updater: two concurrent sessions race on the npm-global install and delete the claude package (dangling symlink, 'command not found')";
export const STATE = "OPEN";
export const LABELS = Object.freeze([
  "bug",
  "has repro",
  "platform:macos",
  "area:packaging",
]);
export const CLI = "Claude Code 2.1.266";
export const NPM = "npm 11.12.1";
export const NODE = "Node 25.9.0";
export const OS = "macOS 26.x (Darwin 25.6.0), Apple Silicon";
export const INSTALL = "npm-global under Homebrew node";
export const PACKAGE = "@anthropic-ai/claude-code@2.1.266";
export const NPM_COMMAND =
  "npm install --global @anthropic-ai/claude-code@2.1.266";
export const TEMP_RETIRE =
  "/opt/homebrew/lib/node_modules/@anthropic-ai/.claude-code-2DTsDk1V";
export const PACKAGE_DIR = "/opt/homebrew/lib/node_modules/@anthropic-ai/";
export const SYMLINK = "/opt/homebrew/bin/claude";
export const GAP_MS = 90;
export const LOG_A = "2026-09-09T14_02_34_904Z-debug-0.log";
export const LOG_B = "2026-09-09T14_02_34_992Z-debug-0.log";
export const LOG_VIEW = "2026-09-09T14_02_33 npm view @anthropic-ai/claude-code@latest version --prefer-online";
export const SYMLINK_MTIME = "07:05:03 PDT";
export const REINSTALL = "07:08";
export const CONFIG_SPLIT = "different CLAUDE_CONFIG_DIR";
export const AUTHOR = "saltydoctor";
export const FILED = "2026-09-09T20:45:46Z";
export const PHRASE =
  "when concurrent runners leave the gate together and scratch the shared plate, derby never stays locked — score scratched or admit locked.";

export const FINGERPRINT_LINES = Object.freeze([
  "npm install --global @anthropic-ai/claude-code@2.1.266",
  "/opt/homebrew/lib/node_modules/@anthropic-ai/.claude-code-2DTsDk1V",
  "error signal SIGHUP / exit 1",
  "exit 0 / info ok",
  "dangling symlink",
  "claude: command not found",
  "2026-09-09T14_02_34_904Z-debug-0.log",
  "2026-09-09T14_02_34_992Z-debug-0.log",
  "~90 ms",
]);

export const COUSINS = Object.freeze([
  {
    issue: 88091,
    title:
      "Concurrent claude sessions racing on npm-global auto-update causes ENOTEMPTY + missing native binary",
    state: "OPEN",
    hasRepro: true,
    citeOnly: true,
    why: "leftover .claude-code-<random> temp dir + missing native binary; not the empty package dir + dangling /opt/homebrew/bin/claude from two ~90 ms npm installs; cite only; do not clone",
  },
  {
    issue: 90233,
    title:
      "Windows npm-global auto-update leaks claude.exe.old and can leave no claude.exe (update_apply_exe_locked)",
    state: "OPEN",
    hasRepro: true,
    citeOnly: true,
    why: "Windows exe-locked rename leak; not macOS Homebrew shared temp retire; cite only; do not clone",
  },
  {
    issue: 86496,
    title:
      "Auto-update silently fails when npm global folder isn't writable, then forces re-login",
    state: "OPEN",
    hasRepro: true,
    citeOnly: true,
    why: "unwritable npm global prefix + forced re-login; not concurrent-session retire race; cite only; do not clone",
  },
  {
    issue: 86941,
    title: "Auto-update silently ships a non-functional install on stock npm 12",
    state: "OPEN",
    hasRepro: true,
    citeOnly: true,
    why: "npm 12 allowScripts blocks postinstall; not two sessions sharing one retire path; cite only; do not clone",
  },
  {
    issue: 84081,
    title:
      "Auto-update silently installs a broken 500-byte stub when npm allowScripts blocks the postinstall",
    state: "OPEN",
    hasRepro: true,
    citeOnly: true,
    why: "blocked postinstall stub; not SIGHUP-vs-ok empty package dir; cite only; do not clone",
  },
  {
    issue: 84224,
    title:
      "Auto-updater installs into the PATH-resolved npm prefix, not its own — clobbers a different install",
    state: "OPEN",
    hasRepro: true,
    citeOnly: true,
    why: "cross-prefix PATH npm target; not same-prefix concurrent retire; cite only; do not clone",
  },
  {
    issue: 85154,
    title:
      "npm global update leaves a stub binary and no bin/claude symlink — no rollback",
    state: "OPEN",
    hasRepro: true,
    citeOnly: true,
    why: "stub binary + missing symlink after interrupted update; not two ~90 ms debug logs retiring the same temp path; cite only; do not clone",
  },
  {
    issue: 996,
    title: "Auto-update failed · Try claude doctor or npm i -g @anthropic-ai/claude-code",
    state: "OPEN",
    hasRepro: true,
    citeOnly: true,
    why: "ENOTEMPTY rename leftover; not the #93197 empty-dir dangling-symlink photo finish; cite only; do not clone",
  },
]);

export const NOT_PRODUCTS = Object.freeze([
  "vizard",
  "deadair",
  "scuttle",
  "stopcock",
  "parergon",
  "stereotype",
  "midden",
  "diplopia",
  "greenroom",
  "guillotine",
  "entresol",
  "hallmark",
  "flashpan",
  "secateurs",
  "palinode",
  "oubliette",
  "ephemera",
  "understudy",
  "mirage",
  "trompe",
  "homonym",
  "shibboleth",
  "procrustes",
  "interlock",
]);

/**
 * Published derby walk from #93197 only. Facts from the issue body.
 * A locked plate keeps one updater in flight; others skip.
 * A scratched plate is two runners retiring the live package to the
 * same temp path, leaving a dangling symlink.
 */
export const DERBY_WALK = Object.freeze([
  {
    t: "idle",
    event: "cue-locked",
    updaterLock: true,
    skipInFlight: true,
    installIntact: true,
    concurrentSessions: false,
    sharedTempRetire: false,
    danglingSymlink: false,
    commandNotFound: false,
    cue: "locked",
    note: "idle HOLD: one updater in flight; others skip; install stays intact",
  },
  {
    t: "break",
    event: "concurrent-sessions",
    concurrentSessions: true,
    gapMs: GAP_MS,
    configSplit: CONFIG_SPLIT,
    cue: "scratched",
    note: "two Claude Code sessions launched ~90 ms apart; one interactive in one project dir, one in another dir with a different CLAUDE_CONFIG_DIR",
  },
  {
    t: "npm",
    event: "npm-debug-pair",
    twoNpmDebugLogs: true,
    concurrentSessions: true,
    logA: LOG_A,
    logB: LOG_B,
    npmCommand: NPM_COMMAND,
    cue: "scratched",
    note: "each started its own background auto-update: npm install --global @anthropic-ai/claude-code@2.1.266; debug logs 14_02_34_904Z and 14_02_34_992Z",
  },
  {
    t: "retire",
    event: "shared-temp-retire",
    sharedTempRetire: true,
    sameTempPath: true,
    tempRetire: TEMP_RETIRE,
    concurrentSessions: true,
    cue: "scratched",
    note: "both npm runs retired the live package dir to the same temp path /opt/homebrew/lib/node_modules/@anthropic-ai/.claude-code-2DTsDk1V",
  },
  {
    t: "finish",
    event: "sighup-vs-ok",
    sighupVsOk: true,
    sharedTempRetire: true,
    cue: "scratched",
    note: "one run ended error process terminated / error signal SIGHUP / exit 1; the other logged exit 0 / info ok",
  },
  {
    t: "empty",
    event: "empty-package-dir",
    emptyPackageDir: true,
    packageDir: PACKAGE_DIR,
    cue: "scratched",
    note: "afterward /opt/homebrew/lib/node_modules/@anthropic-ai/ was empty",
  },
  {
    t: "link",
    event: "dangling-symlink",
    danglingSymlink: true,
    symlink: SYMLINK,
    emptyPackageDir: true,
    cue: "scratched",
    note: "/opt/homebrew/bin/claude was a dangling symlink; symlink mtime 07:05:03 PDT",
  },
  {
    t: "shell",
    event: "command-not-found",
    commandNotFound: true,
    danglingSymlink: true,
    cue: "scratched",
    note: "every new shell got claude: command not found until a manual npm install -g @anthropic-ai/claude-code@2.1.266",
  },
  {
    t: "scratch",
    event: "scratched",
    updaterLock: false,
    skipInFlight: false,
    installIntact: false,
    concurrentSessions: true,
    sharedTempRetire: true,
    sameTempPath: true,
    sighupVsOk: true,
    danglingSymlink: true,
    commandNotFound: true,
    emptyPackageDir: true,
    twoNpmDebugLogs: true,
    cue: "scratched",
    note: "concurrent runners scratch the shared plate; score scratched",
  },
  {
    t: "path",
    event: "derby",
    derby: true,
    cue: "scratched",
    note: "when concurrent runners leave the gate together and scratch the shared plate, derby never stays locked",
  },
]);

function classifyFromSeed(seed) {
  if (seed && VERDICTS.includes(seed)) return seed;
  return null;
}

export function emptyTicket() {
  return {
    seed: IDLE_WORD,
    updaterLock: true,
    skipInFlight: true,
    installIntact: true,
    concurrentSessions: false,
    sharedTempRetire: false,
    sameTempPath: false,
    sighupVsOk: false,
    danglingSymlink: false,
    commandNotFound: false,
    emptyPackageDir: false,
    twoNpmDebugLogs: false,
    derby: false,
    cue: "locked",
  };
}

export function seedLocked() {
  return { ...emptyTicket() };
}

export function seedScratched() {
  return {
    seed: SEEDED_WORD,
    updaterLock: false,
    skipInFlight: false,
    installIntact: false,
    concurrentSessions: true,
    sharedTempRetire: true,
    sameTempPath: true,
    sighupVsOk: true,
    danglingSymlink: true,
    commandNotFound: true,
    emptyPackageDir: true,
    twoNpmDebugLogs: true,
    tempRetire: TEMP_RETIRE,
    cue: "scratched",
    issue: FEATURED_ISSUE,
  };
}

export function seedDerby() {
  return {
    seed: PATH_WORD,
    preferSeed: true,
    derby: true,
    cue: "scratched",
  };
}

export function seedSkipInFlight() {
  return {
    seed: "skip-in-flight",
    preferSeed: true,
    updaterLock: true,
    skipInFlight: true,
    installIntact: true,
    cue: "locked",
  };
}

export function seedConcurrentSessions() {
  return {
    seed: "concurrent-sessions",
    concurrentSessions: true,
    gapMs: GAP_MS,
    configSplit: CONFIG_SPLIT,
    cue: "scratched",
  };
}

export function seedSharedTempRetire() {
  return {
    seed: "shared-temp-retire",
    sharedTempRetire: true,
    sameTempPath: true,
    tempRetire: TEMP_RETIRE,
    concurrentSessions: true,
    cue: "scratched",
  };
}

export function seedSighupVsOk() {
  return {
    seed: "sighup-vs-ok",
    sighupVsOk: true,
    sharedTempRetire: true,
    cue: "scratched",
  };
}

export function seedDanglingSymlink() {
  return {
    seed: "dangling-symlink",
    danglingSymlink: true,
    symlink: SYMLINK,
    emptyPackageDir: true,
    cue: "scratched",
  };
}

export function seedCommandNotFound() {
  return {
    seed: "command-not-found",
    commandNotFound: true,
    danglingSymlink: true,
    cue: "scratched",
  };
}

export function seedEmptyPackageDir() {
  return {
    seed: "empty-package-dir",
    emptyPackageDir: true,
    packageDir: PACKAGE_DIR,
    cue: "scratched",
  };
}

export function seedNpmDebugPair() {
  return {
    seed: "npm-debug-pair",
    twoNpmDebugLogs: true,
    concurrentSessions: true,
    logA: LOG_A,
    logB: LOG_B,
    npmCommand: NPM_COMMAND,
    cue: "scratched",
  };
}

export function normalizeBooth(raw) {
  if (!raw || typeof raw !== "object") {
    return {
      updaterLock: false,
      skipInFlight: false,
      installIntact: false,
      concurrentSessions: false,
      sharedTempRetire: false,
      sameTempPath: false,
      sighupVsOk: false,
      danglingSymlink: false,
      commandNotFound: false,
      emptyPackageDir: false,
      twoNpmDebugLogs: false,
      derby: false,
      gapMs: null,
      tempRetire: null,
      symlink: null,
      packageDir: null,
      logA: null,
      logB: null,
      npmCommand: null,
      configSplit: null,
      cue: null,
      event: null,
      t: null,
    };
  }
  return {
    updaterLock: raw.updaterLock === true,
    skipInFlight: raw.skipInFlight === true,
    installIntact: raw.installIntact === true,
    concurrentSessions: raw.concurrentSessions === true,
    sharedTempRetire: raw.sharedTempRetire === true,
    sameTempPath: raw.sameTempPath === true,
    sighupVsOk: raw.sighupVsOk === true,
    danglingSymlink: raw.danglingSymlink === true,
    commandNotFound: raw.commandNotFound === true,
    emptyPackageDir: raw.emptyPackageDir === true,
    twoNpmDebugLogs: raw.twoNpmDebugLogs === true,
    derby: raw.derby === true,
    gapMs: raw.gapMs ?? null,
    tempRetire: raw.tempRetire || null,
    symlink: raw.symlink || null,
    packageDir: raw.packageDir || null,
    logA: raw.logA || null,
    logB: raw.logB || null,
    npmCommand: raw.npmCommand || null,
    configSplit: raw.configSplit || null,
    cue: raw.cue || null,
    event: raw.event || raw.kind || null,
    t: raw.t || raw.time || null,
  };
}

function hasBoothFields(ticket) {
  return Boolean(
    ticket &&
      (ticket.updaterLock != null ||
        ticket.skipInFlight != null ||
        ticket.installIntact != null ||
        ticket.concurrentSessions != null ||
        ticket.sharedTempRetire != null ||
        ticket.sameTempPath != null ||
        ticket.sighupVsOk != null ||
        ticket.danglingSymlink != null ||
        ticket.commandNotFound != null ||
        ticket.emptyPackageDir != null ||
        ticket.twoNpmDebugLogs != null ||
        ticket.derby != null ||
        ticket.cue != null ||
        ticket.event),
  );
}

function isLocked(row) {
  if (row.derby) return false;
  if (row.cue === "scratched") return false;
  if (
    row.sharedTempRetire &&
    row.danglingSymlink &&
    row.commandNotFound
  ) {
    return false;
  }
  if (
    row.concurrentSessions &&
    row.sharedTempRetire &&
    row.updaterLock !== true
  ) {
    return false;
  }
  if (
    row.updaterLock === true &&
    row.skipInFlight === true &&
    row.installIntact === true &&
    row.cue !== "scratched"
  ) {
    return true;
  }
  if (
    row.cue === "locked" &&
    row.sharedTempRetire !== true &&
    row.danglingSymlink !== true
  ) {
    return true;
  }
  return false;
}

function isScratched(row) {
  if (row.derby && row.cue !== "locked") return false;
  if (row.cue === "scratched") return true;
  if (
    row.sharedTempRetire &&
    row.danglingSymlink &&
    row.commandNotFound
  ) {
    return true;
  }
  if (row.concurrentSessions && row.sharedTempRetire && row.sighupVsOk) {
    return true;
  }
  if (row.emptyPackageDir && row.danglingSymlink) return true;
  return false;
}

function isDerbyPath(row) {
  return row.derby === true && !isLocked(row);
}

/**
 * Score one starting-gate pass against the derby booth.
 * locked: one updater in flight; others skip; install stays intact.
 * scratched: same temp retire path; dangling symlink; command not found.
 * derby: named path — packaging concurrency / global-install race.
 */
export function scoreGate(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const row = normalizeBooth(ticket);
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);

  let verdict = IDLE_WORD;
  if (isDerbyPath(row)) {
    verdict = "derby";
  } else if (isScratched(row)) {
    verdict = "scratched";
  } else if (isLocked(row)) {
    verdict = "locked";
  } else if (
    row.sharedTempRetire ||
    row.danglingSymlink ||
    row.commandNotFound ||
    row.emptyPackageDir ||
    row.sighupVsOk ||
    (row.concurrentSessions && row.twoNpmDebugLogs)
  ) {
    verdict = "scratched";
  }

  if (seeded && (!hasBoothFields(ticket) || ticket.preferSeed === true)) {
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
    locked: verdict === "locked",
    scratched: verdict === "scratched" || verdict === SEEDED_WORD,
    derby: verdict === "derby" || verdict === PATH_WORD,
    updaterLock: row.updaterLock,
    skipInFlight: row.skipInFlight,
    installIntact: row.installIntact,
    concurrentSessions: row.concurrentSessions,
    sharedTempRetire: row.sharedTempRetire,
    sameTempPath: row.sameTempPath,
    sighupVsOk: row.sighupVsOk,
    danglingSymlink: row.danglingSymlink,
    commandNotFound: row.commandNotFound,
    emptyPackageDir: row.emptyPackageDir,
    twoNpmDebugLogs: row.twoNpmDebugLogs,
    gapMs: row.gapMs,
    tempRetire: row.tempRetire,
    symlink: row.symlink,
    packageDir: row.packageDir,
    logA: row.logA,
    logB: row.logB,
    npmCommand: row.npmCommand,
    configSplit: row.configSplit,
    cue: hold ? "locked" : "scratched",
    event: row.event,
    t: row.t,
    phrase: hold ? "admit locked" : "score scratched",
  };
}

export function scoreWalk(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const rows = Array.isArray(ticket.rows)
    ? ticket.rows
    : Array.isArray(ticket.walk)
      ? ticket.walk
      : DERBY_WALK;
  const scored = rows.map((row) => ({
    ...normalizeBooth(row),
    ...scoreGate({ ...row, preferSeed: false }),
  }));
  const scratched = scored.filter((row) => row.verdict === "scratched");
  const derby = scored.filter((row) => row.verdict === "derby");
  const locked = scored.filter((row) => row.verdict === "locked");
  const headline =
    scored.find((row) => row.event === "scratched") ||
    scored.find((row) => row.event === "shared-temp-retire") ||
    scored.find((row) => row.event === "dangling-symlink") ||
    scored.find((row) => row.event === "derby") ||
    scratched[scratched.length - 1];
  let verdict = "locked";
  if (scratched.length) verdict = "scratched";
  else if (derby.length && !locked.length) verdict = "derby";
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
    scratchedCount: scratched.length,
    derbyCount: derby.length,
    lockedCount: locked.length,
    headline,
    rows: scored,
    phrase: HOLD.includes(verdict) ? "admit locked" : "score scratched",
    note: headline
      ? "Both npm runs retire the live package to the same temp path; one SIGHUPs; the other exits 0; dangling symlink; command not found."
      : "published derby walk scored against locked vs scratched",
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
    seeded !== "locked" &&
    seeded !== "scratched" &&
    seeded !== "derby" &&
    ticket.updaterLock == null &&
    ticket.skipInFlight == null &&
    ticket.installIntact == null &&
    ticket.concurrentSessions == null &&
    ticket.sharedTempRetire == null &&
    ticket.danglingSymlink == null &&
    ticket.commandNotFound == null &&
    ticket.derby == null &&
    !ticket.rows &&
    !ticket.walk
  ) {
    return seeded;
  }
  if (Array.isArray(ticket.rows) || Array.isArray(ticket.walk)) {
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
  const multi = Array.isArray(ticket.rows) || Array.isArray(ticket.walk);
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
    updaterLock: scored.updaterLock ?? false,
    skipInFlight: scored.skipInFlight ?? false,
    installIntact: scored.installIntact ?? false,
    concurrentSessions: scored.concurrentSessions ?? false,
    sharedTempRetire: scored.sharedTempRetire ?? false,
    danglingSymlink: scored.danglingSymlink ?? false,
    commandNotFound: scored.commandNotFound ?? false,
    emptyPackageDir: scored.emptyPackageDir ?? false,
    sighupVsOk: scored.sighupVsOk ?? false,
    twoNpmDebugLogs: scored.twoNpmDebugLogs ?? false,
  };
}

export function score(input) {
  return analyze(input).verdict;
}

export function fingerprint(input) {
  const result = analyze(input);
  return [
    result.verdict,
    result.updaterLock ? "lock=held" : "lock=none",
    result.skipInFlight ? "skip=yes" : "skip=no",
    result.installIntact ? "install=intact" : "install=empty",
    result.sharedTempRetire ? "retire=shared" : "retire=none",
    result.danglingSymlink ? "link=dangling" : "link=live",
    result.commandNotFound ? "cmd=missing" : "cmd=found",
    result.cue === "locked" ? "cue=locked" : "cue=scratched",
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
      cli: CLI,
      npm: NPM,
      node: NODE,
      os: OS,
      install: INSTALL,
      package: PACKAGE,
      npmCommand: NPM_COMMAND,
      tempRetire: TEMP_RETIRE,
      packageDir: PACKAGE_DIR,
      symlink: SYMLINK,
      gapMs: GAP_MS,
      logA: LOG_A,
      logB: LOG_B,
      logView: LOG_VIEW,
      symlinkMtime: SYMLINK_MTIME,
      reinstall: REINSTALL,
      configSplit: CONFIG_SPLIT,
      author: AUTHOR,
      filed: FILED,
      fingerprintLines: [...FINGERPRINT_LINES],
      cousins: COUSINS.map((row) => row.issue),
      phrase: PHRASE,
      expected: [
        "updater takes a lock so only one npm-global update runs",
        "or skip when another update is already in flight",
        "concurrent sessions cannot clobber the shared global install",
        "install stays intact; /opt/homebrew/bin/claude remains a live symlink",
      ],
      hypothesis:
        "NON-BINDING: the auto-updater does not take a cross-process lock (or skip-in-flight) before launching npm install --global, so two sessions ~90 ms apart both retire the live package to the same temp path",
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
