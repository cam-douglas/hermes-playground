#!/usr/bin/env node
/**
 * Mondegreen — lyric-mishearing / ballad-sheet studio booth.
 *
 * Educational diagnostic model for a published Claude Code
 * isolation:worktree Bash sandbox defect: the booth should keep a
 * worktree-isolation line tokenized (word-boundary / command-position
 * `git`). Instead the sandbox mondegreens — a crude substring scan
 * hears `git` inside ordinary English ("legitimate") and refuses a
 * command that never invoked git.
 *
 *   node mondegreen.mjs data/mondegreen.json
 *   echo '{"seed":"mondegreen"}' | node mondegreen.mjs
 *
 * Idle word is tokenized (HOLD: word-boundary / command-position
 * tokenization; `git` only as a command word).
 * Seeded word is mondegreen (#93193: substring scan false-blocks on
 * `git` inside "legitimate").
 * Path word is parsed (named path — tokenize command words, do not
 * raw-scan the entire string).
 *
 * Encoded from anthropics/claude-code#93193 issue body only.
 * Hypothesis (NON-BINDING): the isolation:worktree / background-agent
 * sandbox applies a raw substring scan for `git` over the expanded
 * command string, so any English word containing those three letters
 * is treated as an unverifiable git invocation. Verify against #93193
 * text only. Do NOT claim a root cause in Claude Code source you have
 * not seen. Do NOT implement a fix in anthropics/claude-code.
 * No network. No exploits. No live Claude. No payloads. No secrets.
 */

/* Browser-safe: no top-level node: imports. CLI I/O is loaded only in main(). */

export const VERDICTS = Object.freeze([
  "tokenized",
  "mondegreen",
  "parsed",
  "hold",
  "command-word",
  "isolation-worktree",
  "substring-scan",
  "legitimate-prose",
  "bash-refused",
  "too-complex",
  "interactive-ok",
  "word-boundary",
  "has-repro",
  "cousins",
  "backups",
  "fixtures",
  "chips",
  "fingerprints",
  "walk",
]);

export const IDLE_WORD = "tokenized";
export const PATH_WORD = "parsed";
export const SEEDED_WORD = "mondegreen";
export const HOLD = Object.freeze(["tokenized", "command-word", "hold", "word-boundary"]);
export const RECOVER = Object.freeze(["tokenized", "command-word", "hold", "word-boundary"]);
export const ALARM = Object.freeze(
  VERDICTS.filter((name) => !HOLD.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FORBIDDEN_IDLE = Object.freeze([
  "locked",
  "scratched",
  "derby",
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
  "culled",
  "sole",
  "slipped",
  "sprung",
]);
export const FORBIDDEN_SEED = Object.freeze(
  FORBIDDEN_IDLE.filter((name) => name !== "mondegreen"),
);

export const FEATURED_ISSUE = 93193;
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/93193";
export const TITLE =
  'Bash sandbox for isolation:worktree dispatched agents false-blocks on the substring "git" anywhere in the command, including inside unrelated prose';
export const STATE = "OPEN";
export const LABELS = Object.freeze([
  "bug",
  "has repro",
  "area:agents",
  "area:sandbox",
]);
export const AUTHOR = "sohailbm-kandaq";
export const FILED = "2026-09-09T20:28:08Z";
export const ISOLATION = "worktree";
export const AGENT_TRIGGER = 'Agent tool call with isolation: "worktree"';
export const REFUSAL =
  "too complex to verify [it] stays inside the worktree";
export const TRIGGER_WORD = "legitimate";
export const SUBSTRING = "git";
export const PUBLISHED_LYRIC =
  "this is a legitimate status update with no git command in it at all";
export const MONDEGREEN_LINE = "this is a legitimate status update";
export const WORK_COMMAND =
  'python3 scripts/work.py update TX-KAN-NNNNN "status_update=$(cat "$SCRATCH")"';
export const REPRO_BODY = `SCRATCH=$(mktemp)
cat <<'EOF' > "$SCRATCH"
this is a legitimate status update with no git command in it at all
EOF
echo "$(cat "$SCRATCH")"`;
export const SURFACE = "isolation:worktree / background-agent Bash";
export const INTERACTIVE = "interactive (non-dispatched) Bash executes cleanly";
export const PHRASE =
  "when the sandbox hears git inside legitimate, mondegreen never stays tokenized — score mondegreen or admit tokenized.";

export const FINGERPRINT_LINES = Object.freeze([
  'isolation: "worktree"',
  "legitimate",
  "substring git",
  "too complex to verify [it] stays inside the worktree",
  "no git invocation",
  "python3 scripts/work.py update",
  "status_update=$(cat \"$SCRATCH\")",
  "interactive Bash executes cleanly",
  "word-boundary / command-position",
]);

export const FALSE_POSITIVE_WORDS = Object.freeze([
  "legitimate",
  "digit",
  "digits",
  "legitimize",
  "gitignore",
]);

export const COUSINS = Object.freeze([
  {
    issue: 92586,
    title:
      "Bash tool kills every command after ~5s when an EDR transiently hard-links new files",
    state: "OPEN",
    hasRepro: true,
    citeOnly: true,
    why: "Seizing/#92586 EDR hard-link nlink spike culls Bash output identity; not a substring git false-block on legitimate — cite only; do not rebuild",
  },
  {
    issue: 92112,
    title:
      "Worktree cwd guard permanently blocks Bash mid-session while MCP servers retain filesystem access",
    state: "OPEN",
    hasRepro: true,
    citeOnly: true,
    why: "Holdfast/#92112 --worktree cwd Bash block; not isolation:worktree substring git inside prose — cite only; do not rebuild",
  },
  {
    issue: 93197,
    title:
      "Auto-updater: two concurrent sessions race on the npm-global install and delete the claude package",
    state: "OPEN",
    hasRepro: true,
    citeOnly: true,
    why: "Derby/#93197 npm-global concurrent retire race; not a lyric-mishearing substring scan — cite only; do not rebuild",
  },
]);

export const BACKUPS = Object.freeze([
  {
    issue: 93173,
    title:
      "Bash sandbox denies writes to /.claude/ paths, silently corrupting the git working tree in repos that track files there",
    state: "OPEN",
    citeOnly: true,
    why: "sandbox denies writes under repo .claude/ and silently corrupts git checkout — backup, not primary; cite in data only",
  },
  {
    issue: 93182,
    title:
      "Server-side tools are unblockable: deny rejects the registered casing, and PreToolUse hooks never fire for them",
    state: "OPEN",
    citeOnly: true,
    why: "server-side tools unblockable — deny casing mismatch + PreToolUse never fires — backup, not primary; cite in data only",
  },
  {
    issue: 93218,
    title:
      "Desktop app disables SendMessage via --disallowedTools, but ListAgents in the same session still lists peers and documents it as the address",
    state: "OPEN",
    citeOnly: true,
    why: "Desktop --disallowedTools SendMessage but ListAgents still lists peers and documents SendMessage — backup, not primary; cite in data only",
  },
]);

export const NOT_PRODUCTS = Object.freeze([
  "derby",
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
  "seizing",
  "holdfast",
  "springe",
  "entresol",
  "hallmark",
  "flashpan",
  "secateurs",
  "palinode",
  "understudy",
  "mirage",
  "trompe",
  "homonym",
  "shibboleth",
  "procrustes",
  "interlock",
]);

const WRAPPERS = new Set(["env", "sudo", "command", "time", "nohup"]);

/**
 * Conceptual substring ear — the false listener. Any occurrence of
 * the three letters g-i-t anywhere in the expanded command string.
 */
export function scanSubstring(command) {
  return String(command ?? "").toLowerCase().includes(SUBSTRING);
}

/**
 * Split a shell-ish line into chunks at separators and substitutions
 * so we can inspect command-position words only.
 */
export function commandWords(command) {
  const text = String(command ?? "");
  const chunks = text.split(/(?:&&|\|\||;|\n|\||`|\$\()/);
  const words = [];
  for (const chunk of chunks) {
    const cleaned = chunk.replace(/[)\]}]/g, " ").trim();
    if (!cleaned) continue;
    const parts = cleaned.split(/\s+/);
    let i = 0;
    while (i < parts.length) {
      const raw = parts[i].replace(/^['"]+|['"]+$/g, "");
      if (/^[A-Za-z_][A-Za-z0-9_]*=/.test(parts[i])) {
        i += 1;
        continue;
      }
      if (WRAPPERS.has(raw.toLowerCase())) {
        i += 1;
        continue;
      }
      if (raw) {
        const base = raw.replace(/^.*\//, "").toLowerCase();
        words.push(base);
      }
      break;
    }
  }
  return words;
}

/**
 * Token / command-position ear — the true listener. `git` only counts
 * as a command word (start of a pipeline, after && / ; / |, or after
 * env / sudo / $() / backticks). Quoted prose is ignored.
 */
export function scanTokens(command) {
  return commandWords(command).includes(SUBSTRING);
}

/**
 * Word-boundary check: `git` as its own token, not a substring of
 * legitimate / digit / legitimize / gitignore-as-prose.
 */
export function scanWordBoundary(command) {
  return /(?:^|[^A-Za-z0-9_])git(?:[^A-Za-z0-9_]|$)/i.test(String(command ?? ""));
}

export function compareScanners(command) {
  const substringHit = scanSubstring(command);
  const tokenHit = scanTokens(command);
  const wordHit = scanWordBoundary(command);
  const mondegreen = substringHit && !tokenHit;
  return {
    command: String(command ?? ""),
    substringHit,
    tokenHit,
    wordHit,
    mondegreen,
    tokenized: !mondegreen && !tokenHit,
    parsed: tokenHit || !substringHit,
    cue: mondegreen ? "mondegreen" : tokenHit ? "parsed" : "tokenized",
  };
}

export function highlightSubstring(line, needle = SUBSTRING) {
  const text = String(line ?? "");
  const lower = text.toLowerCase();
  const hits = [];
  let from = 0;
  const needleLower = needle.toLowerCase();
  while (from <= lower.length) {
    const at = lower.indexOf(needleLower, from);
    if (at < 0) break;
    hits.push({
      start: at,
      end: at + needle.length,
      excerpt: text.slice(at, at + needle.length),
      host: hostWord(text, at),
    });
    from = at + 1;
  }
  return hits;
}

function hostWord(text, index) {
  let start = index;
  let end = index;
  while (start > 0 && /[A-Za-z0-9_]/.test(text[start - 1])) start -= 1;
  while (end < text.length && /[A-Za-z0-9_]/.test(text[end])) end += 1;
  return text.slice(start, end);
}

/**
 * Published mondegreen walk from #93193 only. Facts from the issue body.
 * A tokenized booth hears command words. A mondegreen booth hears git
 * inside legitimate and refuses the line.
 */
export const MONDEGREEN_WALK = Object.freeze([
  {
    t: "idle",
    event: "cue-tokenized",
    tokenized: true,
    commandPosition: true,
    wordBoundary: true,
    isolationWorktree: false,
    substringScan: false,
    legitimateProse: false,
    bashRefused: false,
    tooComplex: false,
    cue: "tokenized",
    note: "idle HOLD: word-boundary / command-position tokenization; git only as a command word",
  },
  {
    t: "dispatch",
    event: "isolation-worktree",
    isolationWorktree: true,
    agentTrigger: AGENT_TRIGGER,
    cue: "mondegreen",
    note: 'background agent dispatched with isolation: "worktree"',
  },
  {
    t: "lyric",
    event: "legitimate-prose",
    legitimateProse: true,
    triggerWord: TRIGGER_WORD,
    publishedLyric: PUBLISHED_LYRIC,
    isolationWorktree: true,
    cue: "mondegreen",
    note: "$SCRATCH prose includes the English word legitimate — substring git",
  },
  {
    t: "ear",
    event: "substring-scan",
    substringScan: true,
    legitimateProse: true,
    isolationWorktree: true,
    cue: "mondegreen",
    note: "sandbox raw-scans the entire expanded command string for git",
  },
  {
    t: "refuse",
    event: "bash-refused",
    bashRefused: true,
    tooComplex: true,
    isolationWorktree: true,
    cue: "mondegreen",
    note: "Bash refused: too complex to verify [it] stays inside the worktree",
  },
  {
    t: "complex",
    event: "too-complex",
    tooComplex: true,
    bashRefused: true,
    noGitInvocation: true,
    cue: "mondegreen",
    note: "command contained no git invocation — no $(git ...), no git subcommand",
  },
  {
    t: "control",
    event: "interactive-ok",
    interactiveOk: true,
    isolationWorktree: false,
    cue: "mondegreen",
    note: "same command in interactive (non-dispatched) Bash executes cleanly",
  },
  {
    t: "hear",
    event: "mondegreen",
    tokenized: false,
    commandPosition: false,
    wordBoundary: false,
    isolationWorktree: true,
    substringScan: true,
    legitimateProse: true,
    bashRefused: true,
    tooComplex: true,
    interactiveOk: true,
    cue: "mondegreen",
    note: "sandbox hears git inside legitimate; score mondegreen",
  },
  {
    t: "path",
    event: "parsed",
    parsed: true,
    cue: "mondegreen",
    note: "when the sandbox hears git inside legitimate, parsed never stays tokenized",
  },
]);

function classifyFromSeed(seed) {
  if (seed && VERDICTS.includes(seed)) return seed;
  return null;
}

export function emptyTicket() {
  return {
    seed: IDLE_WORD,
    tokenized: true,
    commandPosition: true,
    wordBoundary: true,
    isolationWorktree: false,
    substringScan: false,
    legitimateProse: false,
    bashRefused: false,
    tooComplex: false,
    interactiveOk: false,
    parsed: false,
    cue: "tokenized",
  };
}

export function seedTokenized() {
  return { ...emptyTicket() };
}

export function seedMondegreen() {
  return {
    seed: SEEDED_WORD,
    tokenized: false,
    commandPosition: false,
    wordBoundary: false,
    isolationWorktree: true,
    substringScan: true,
    legitimateProse: true,
    bashRefused: true,
    tooComplex: true,
    interactiveOk: true,
    triggerWord: TRIGGER_WORD,
    publishedLyric: PUBLISHED_LYRIC,
    cue: "mondegreen",
    issue: FEATURED_ISSUE,
  };
}

export function seedParsed() {
  return {
    seed: PATH_WORD,
    preferSeed: true,
    parsed: true,
    cue: "mondegreen",
  };
}

export function seedCommandWord() {
  return {
    seed: "command-word",
    preferSeed: true,
    tokenized: true,
    commandPosition: true,
    cue: "tokenized",
  };
}

export function seedWordBoundary() {
  return {
    seed: "word-boundary",
    preferSeed: true,
    tokenized: true,
    wordBoundary: true,
    cue: "tokenized",
  };
}

export function seedIsolationWorktree() {
  return {
    seed: "isolation-worktree",
    isolationWorktree: true,
    agentTrigger: AGENT_TRIGGER,
    cue: "mondegreen",
  };
}

export function seedSubstringScan() {
  return {
    seed: "substring-scan",
    substringScan: true,
    legitimateProse: true,
    isolationWorktree: true,
    cue: "mondegreen",
  };
}

export function seedLegitimateProse() {
  return {
    seed: "legitimate-prose",
    legitimateProse: true,
    triggerWord: TRIGGER_WORD,
    isolationWorktree: true,
    cue: "mondegreen",
  };
}

export function seedBashRefused() {
  return {
    seed: "bash-refused",
    bashRefused: true,
    tooComplex: true,
    isolationWorktree: true,
    cue: "mondegreen",
  };
}

export function seedTooComplex() {
  return {
    seed: "too-complex",
    tooComplex: true,
    bashRefused: true,
    noGitInvocation: true,
    cue: "mondegreen",
  };
}

export function seedInteractiveOk() {
  return {
    seed: "interactive-ok",
    interactiveOk: true,
    isolationWorktree: false,
    cue: "mondegreen",
  };
}

export function normalizeBooth(raw) {
  if (!raw || typeof raw !== "object") {
    return {
      tokenized: false,
      commandPosition: false,
      wordBoundary: false,
      isolationWorktree: false,
      substringScan: false,
      legitimateProse: false,
      bashRefused: false,
      tooComplex: false,
      interactiveOk: false,
      noGitInvocation: false,
      parsed: false,
      triggerWord: null,
      publishedLyric: null,
      agentTrigger: null,
      cue: null,
      event: null,
      t: null,
    };
  }
  return {
    tokenized: raw.tokenized === true,
    commandPosition: raw.commandPosition === true,
    wordBoundary: raw.wordBoundary === true,
    isolationWorktree: raw.isolationWorktree === true,
    substringScan: raw.substringScan === true,
    legitimateProse: raw.legitimateProse === true,
    bashRefused: raw.bashRefused === true,
    tooComplex: raw.tooComplex === true,
    interactiveOk: raw.interactiveOk === true,
    noGitInvocation: raw.noGitInvocation === true,
    parsed: raw.parsed === true,
    triggerWord: raw.triggerWord || null,
    publishedLyric: raw.publishedLyric || null,
    agentTrigger: raw.agentTrigger || null,
    cue: raw.cue || null,
    event: raw.event || raw.kind || null,
    t: raw.t || raw.time || null,
  };
}

function hasBoothFields(ticket) {
  return Boolean(
    ticket &&
      (ticket.tokenized != null ||
        ticket.commandPosition != null ||
        ticket.wordBoundary != null ||
        ticket.isolationWorktree != null ||
        ticket.substringScan != null ||
        ticket.legitimateProse != null ||
        ticket.bashRefused != null ||
        ticket.tooComplex != null ||
        ticket.interactiveOk != null ||
        ticket.parsed != null ||
        ticket.cue != null ||
        ticket.event),
  );
}

function isTokenized(row) {
  if (row.parsed) return false;
  if (row.cue === "mondegreen") return false;
  if (row.substringScan && row.legitimateProse && row.bashRefused) {
    return false;
  }
  if (
    row.isolationWorktree &&
    row.substringScan &&
    row.tokenized !== true
  ) {
    return false;
  }
  if (
    row.tokenized === true &&
    (row.commandPosition === true || row.wordBoundary === true) &&
    row.cue !== "mondegreen"
  ) {
    return true;
  }
  if (
    row.cue === "tokenized" &&
    row.substringScan !== true &&
    row.bashRefused !== true
  ) {
    return true;
  }
  return false;
}

function isMondegreen(row) {
  if (row.parsed && row.cue !== "tokenized") return false;
  if (row.cue === "mondegreen") return true;
  if (row.substringScan && row.legitimateProse && row.bashRefused) {
    return true;
  }
  if (row.isolationWorktree && row.substringScan && row.tooComplex) {
    return true;
  }
  if (row.bashRefused && row.tooComplex && row.legitimateProse) return true;
  return false;
}

function isParsedPath(row) {
  return row.parsed === true && !isTokenized(row);
}

/**
 * Score one lyric pass against the mondegreen booth.
 * tokenized: word-boundary / command-position; git only as a command word.
 * mondegreen: substring scan hears git inside legitimate; Bash refused.
 * parsed: named path — tokenize command words, do not raw-scan the string.
 */
export function scoreGate(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const row = normalizeBooth(ticket);
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);

  let verdict = IDLE_WORD;
  if (isParsedPath(row)) {
    verdict = "parsed";
  } else if (isMondegreen(row)) {
    verdict = "mondegreen";
  } else if (isTokenized(row)) {
    verdict = "tokenized";
  } else if (
    row.substringScan ||
    row.legitimateProse ||
    row.bashRefused ||
    row.tooComplex ||
    (row.isolationWorktree && row.interactiveOk)
  ) {
    verdict = "mondegreen";
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
    tokenized: verdict === "tokenized",
    mondegreen: verdict === "mondegreen" || verdict === SEEDED_WORD,
    parsed: verdict === "parsed" || verdict === PATH_WORD,
    commandPosition: row.commandPosition,
    wordBoundary: row.wordBoundary,
    isolationWorktree: row.isolationWorktree,
    substringScan: row.substringScan,
    legitimateProse: row.legitimateProse,
    bashRefused: row.bashRefused,
    tooComplex: row.tooComplex,
    interactiveOk: row.interactiveOk,
    noGitInvocation: row.noGitInvocation,
    triggerWord: row.triggerWord,
    publishedLyric: row.publishedLyric,
    agentTrigger: row.agentTrigger,
    cue: hold ? "tokenized" : "mondegreen",
    event: row.event,
    t: row.t,
    phrase: hold ? "admit tokenized" : "score mondegreen",
  };
}

export function scoreWalk(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const rows = Array.isArray(ticket.rows)
    ? ticket.rows
    : Array.isArray(ticket.walk)
      ? ticket.walk
      : MONDEGREEN_WALK;
  const scored = rows.map((row) => ({
    ...normalizeBooth(row),
    ...scoreGate({ ...row, preferSeed: false }),
  }));
  const mondegreen = scored.filter((row) => row.verdict === "mondegreen");
  const parsed = scored.filter((row) => row.verdict === "parsed");
  const tokenized = scored.filter((row) => row.verdict === "tokenized");
  const headline =
    scored.find((row) => row.event === "mondegreen") ||
    scored.find((row) => row.event === "substring-scan") ||
    scored.find((row) => row.event === "bash-refused") ||
    scored.find((row) => row.event === "parsed") ||
    mondegreen[mondegreen.length - 1];
  let verdict = "tokenized";
  if (mondegreen.length) verdict = "mondegreen";
  else if (parsed.length && !tokenized.length) verdict = "parsed";
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
    mondegreenCount: mondegreen.length,
    parsedCount: parsed.length,
    tokenizedCount: tokenized.length,
    headline,
    rows: scored,
    phrase: HOLD.includes(verdict) ? "admit tokenized" : "score mondegreen",
    note: headline
      ? "Sandbox substring-hears git inside legitimate; Bash refused as too complex; interactive session was fine."
      : "published mondegreen walk scored against tokenized vs mondegreen",
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
    seeded !== "tokenized" &&
    seeded !== "mondegreen" &&
    seeded !== "parsed" &&
    ticket.tokenized == null &&
    ticket.isolationWorktree == null &&
    ticket.substringScan == null &&
    ticket.legitimateProse == null &&
    ticket.bashRefused == null &&
    ticket.parsed == null &&
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
    backups: BACKUPS.map((row) => row.issue),
    tokenized: scored.tokenized ?? false,
    commandPosition: scored.commandPosition ?? false,
    wordBoundary: scored.wordBoundary ?? false,
    isolationWorktree: scored.isolationWorktree ?? false,
    substringScan: scored.substringScan ?? false,
    legitimateProse: scored.legitimateProse ?? false,
    bashRefused: scored.bashRefused ?? false,
    tooComplex: scored.tooComplex ?? false,
    interactiveOk: scored.interactiveOk ?? false,
  };
}

export function score(input) {
  return analyze(input).verdict;
}

export function fingerprint(input) {
  const result = analyze(input);
  return [
    result.verdict,
    result.isolationWorktree ? "iso=worktree" : "iso=none",
    result.substringScan ? "ear=substring" : "ear=token",
    result.legitimateProse ? "lyric=legitimate" : "lyric=clean",
    result.bashRefused ? "bash=refused" : "bash=ok",
    result.tooComplex ? "verify=complex" : "verify=plain",
    result.cue === "tokenized" ? "cue=tokenized" : "cue=mondegreen",
  ].join("|");
}

export function handle(input) {
  const result = analyze(input);
  const lyric = result.publishedLyric || MONDEGREEN_LINE;
  return {
    ...result,
    fingerprint: fingerprint(input),
    scanners: compareScanners(lyric),
    hits: highlightSubstring(lyric),
    published: {
      issue: FEATURED_ISSUE,
      url: ISSUE_URL,
      title: TITLE,
      state: STATE,
      labels: [...LABELS],
      author: AUTHOR,
      filed: FILED,
      isolation: ISOLATION,
      agentTrigger: AGENT_TRIGGER,
      refusal: REFUSAL,
      triggerWord: TRIGGER_WORD,
      substring: SUBSTRING,
      publishedLyric: PUBLISHED_LYRIC,
      mondegreenLine: MONDEGREEN_LINE,
      workCommand: WORK_COMMAND,
      reproBody: REPRO_BODY,
      surface: SURFACE,
      interactive: INTERACTIVE,
      falsePositiveWords: [...FALSE_POSITIVE_WORDS],
      fingerprintLines: [...FINGERPRINT_LINES],
      cousins: COUSINS.map((row) => row.issue),
      backups: BACKUPS.map((row) => row.issue),
      phrase: PHRASE,
      expected: [
        "sandbox keys off an actual git token in a command position",
        "word-boundary match, or a real shell/AST parse — not a raw substring scan",
        "quoted prose, heredocs, and variable content containing legitimate / digit / legitimize are ignored",
        "git status, $(git rev-parse --git-dir), foo && git push stay flagged",
      ],
      hypothesis:
        "NON-BINDING: the isolation:worktree / background-agent sandbox applies a raw substring scan for git over the expanded command string, so any English word containing those three letters is treated as an unverifiable git invocation",
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
