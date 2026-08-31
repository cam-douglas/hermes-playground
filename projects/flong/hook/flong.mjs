#!/usr/bin/env node
/**
 * Flong — stereotype-foundry snapshot classifier.
 * A torn flong is not a hold. Score the chase or admit struck.
 *
 *   echo "export PATH='/usr/bin'" | node flong.mjs
 *   node flong.mjs ticket.json
 *
 * Idle word is struck (small valid flong: PATH + aliases).
 * Seeded state is torn / #90916 (git-completion eval-replay mold).
 * NEVER idle as "flong", "foundry", "chase", "proof", "mold",
 * "stereotype", "snapshot", "bash".
 *
 * Primary #90916: Windows/Git Bash shell snapshot under
 * ~/.claude/shell-snapshots/snapshot-bash-*.sh is generated then
 * sourced before every Bash tool. The writer serializes Git Bash
 * git-completion as eval $'__git_* () \n{ ... }' > /dev/null 2>&1.
 * The file is unparseable. bash -n dies at unexpected token '('.
 * Line 1 PATH holds; line 2 begins mid-token. Tail is a dangling
 * # Shadow pkill… comment with no function body. Sourcing exits
 * 127 with empty stdout/stderr. Interactive Git Bash works.
 * Codex discards an unparseable snapshot (degraded). Claude Code
 * sources the torn flong, so every Bash tool dies 127.
 *
 * NOT Bulla #90891, Trompe #90881, Davy #90886, Slype #90676,
 * Escutcheon (tmpfs /run/user). Same-class cite (not primary):
 * #15128 empty PATH='', #16377 Windows snapshot generation,
 * #61293 2.1.147 wrapper 127 (hotfix 2.1.148), #19053 escaped
 * PATH colons were a red herring. Cross: openai/codex#36589.
 */

import { readFileSync } from "node:fs";
import { stdin } from "node:process";
import { pathToFileURL } from "node:url";

export const VERDICTS = Object.freeze([
  "torn",
  "struck",
  "parse-fail",
  "exit-127",
  "git-complete",
  "eval-replay",
  "mid-token",
  "dangling-comment",
  "byte-identical",
  "builtins-dead",
  "interactive-ok",
  "source-killed",
]);
export const IDLE_WORD = "struck";
export const SEEDED_WORD = "torn";
export const HOLD_VERDICTS = Object.freeze(["struck"]);
export const ALARM_VERDICTS = Object.freeze([
  "torn",
  "parse-fail",
  "exit-127",
  "git-complete",
  "eval-replay",
  "mid-token",
  "dangling-comment",
  "byte-identical",
  "builtins-dead",
  "source-killed",
]);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FEATURED_ISSUE = 90916;
export const PRIMARY_ISSUES = Object.freeze([90916]);
export const SAME_CLASS = Object.freeze([15128, 16377, 61293, 19053]);
export const CODEX_CROSS = Object.freeze([36589]);
export const NOT_PRODUCTS = Object.freeze([
  "bulla",
  "trompe",
  "davy",
  "slype",
  "escutcheon",
  "quoin",
]);
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/90916";
export const CODEX_URL = "https://github.com/openai/codex/issues/36589";
export const TITLE =
  "[Bug] Windows/Git Bash: corrupted shell snapshot (serialized git-completion functions) makes every Bash tool call exit 127 with no output";
export const REPORTER = "LefRT";
export const FILED_AT = "2026-08-31T06:54:06Z";
export const LABELS = Object.freeze([
  "bug",
  "has-repro",
  "platform:windows",
  "area:bash",
]);
export const CLAUDE_VERSION = "2.1.251";
export const OLDER_VERSION = "2.1.226";
export const GIT_VERSION = "2.53";
export const GIT_PATH = "D:\\Program Files\\Git";
export const TORN_BYTES = 65284;
export const OLDER_BYTES = 84178;
export const EXIT_CODE = 127;
export const HUB_LINE =
  "16:50 flong: a torn flong is not a hold. Score the chase or admit struck.";
export const MARK = "16:50 / hermes catalog #90 / #90916";
export const PHRASE = "a torn flong is not a hold";
export const FORBIDDEN_IDLE = Object.freeze([
  "flong",
  "foundry",
  "chase",
  "proof",
  "mold",
  "stereotype",
  "snapshot",
  "bash",
]);

/** Small valid flong: PATH + aliases. Proof pulls clean. */
export const STRUCK_FLONG = [
  "export PATH='/usr/bin:/mingw64/bin:/usr/local/bin:/bin'",
  "alias ls='ls --color=auto'",
  "alias ll='ls -l'",
].join("\n") + "\n";

/**
 * Compact fixture with the #90916 parse-fail shape.
 * Not 65284 bytes of real git-completion.
 * Line 1 PATH holds. Line 2 begins mid-token.
 * Line 9 is the eval-replay smash. Tail is the dangling Shadow pkill comment.
 */
export const TORN_FLONG = [
  "export PATH='/usr/bin:/mingw64/bin:/usr/local/bin:/bin:/cmd'",
  "ord\" in \\n local cur=\"${2-}\" ; __gitcomp_nl \"$(__git_heads)\"",
  "alias ls='ls --color=auto'",
  "alias ll='ls -l'",
  "# completion replay mats",
  "local __git_repo_path=",
  "__git_ps1 () { :; }",
  "local -a __git_completetext",
  "eval $'__git_complete_config_variable_value () \\n{ \\n  local key=\"$1\"\\n}' > /dev/null 2>&1",
  "# Shadow pkill to refuse patterns matching the CLI process",
].join("\n") + "\n";

const MID_TOKEN_RE = /^(?:[A-Za-z]{1,8}["']\s+in\b)/;
const EVAL_REPLAY_RE = /eval\s+\$'__git_\w[\w]*\s*\(\)/;
const EVAL_GIT_RE = /eval\s+\$'__git_/;
const GIT_FN_RE = /__git_\w+/;
const DANGLING_RE =
  /#\s*Shadow pkill to refuse patterns matching the CLI process/;
const PATH_EXPORT_RE = /^\s*export PATH=/;

export function emptyTicket() {
  return {
    seed: IDLE_WORD,
    snapshot: STRUCK_FLONG,
    issue: null,
    byteIdentical: false,
    interactiveOk: true,
    builtinsLive: true,
  };
}

export function seedStruck() {
  return {
    seed: IDLE_WORD,
    snapshot: STRUCK_FLONG,
    issue: null,
    byteIdentical: false,
    interactiveOk: true,
    builtinsLive: true,
  };
}

export function seedTorn() {
  return {
    seed: SEEDED_WORD,
    snapshot: TORN_FLONG,
    issue: FEATURED_ISSUE,
    title: TITLE,
    url: ISSUE_URL,
    filedAt: FILED_AT,
    labels: [...LABELS],
    reporter: REPORTER,
    claudeVersion: CLAUDE_VERSION,
    olderVersion: OLDER_VERSION,
    gitVersion: GIT_VERSION,
    gitPath: GIT_PATH,
    reportedBytes: TORN_BYTES,
    olderBytes: OLDER_BYTES,
    byteIdentical: true,
    interactiveOk: true,
    builtinsLive: false,
    exitCode: EXIT_CODE,
  };
}

export function cloneTicket(ticket) {
  return JSON.parse(JSON.stringify(ticket));
}

export function normalize(input) {
  if (input == null) return emptyTicket();
  if (typeof input === "string") {
    const trimmed = input.trim();
    if (!trimmed) return emptyTicket();
    if (trimmed.startsWith("{")) {
      try {
        return normalize(JSON.parse(trimmed));
      } catch {
        return { ...emptyTicket(), snapshot: input };
      }
    }
    return { ...emptyTicket(), snapshot: input, seed: null };
  }
  if (typeof input !== "object") return emptyTicket();
  const ticket = { ...emptyTicket(), ...input };
  if (ticket.issue === FEATURED_ISSUE && !input.snapshot) {
    return { ...seedTorn(), ...input, snapshot: TORN_FLONG };
  }
  if (ticket.seed === SEEDED_WORD && !input.snapshot) {
    return { ...seedTorn(), ...input, snapshot: TORN_FLONG };
  }
  if (ticket.seed === IDLE_WORD && !input.snapshot) {
    return { ...seedStruck(), ...input, snapshot: STRUCK_FLONG };
  }
  return ticket;
}

/**
 * bash -n equivalent walk: quote / eval $'...' tokenizer plus the
 * structural smash shapes from #90916 (mid-token head, eval-replay
 * __git_* plates, dangling Shadow pkill comment).
 */
export function walkSnapshot(text) {
  const source = String(text ?? "");
  const lines = source.replace(/\r\n/g, "\n").split("\n");
  let quote = "bare";
  let pathHolds = false;
  let midToken = false;
  let evalReplay = false;
  let gitComplete = false;
  let danglingComment = false;
  let danglingLine = 0;
  let evalLine = 0;
  let bisect = null;
  let bashN = null;

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    const n = i + 1;
    if (n === 1 && PATH_EXPORT_RE.test(raw)) pathHolds = true;
    if (MID_TOKEN_RE.test(raw)) {
      midToken = true;
      if (!bisect) {
        bisect = {
          line: n,
          kind: "mid-token",
          message: "line begins mid-token",
        };
      }
    }
    if (EVAL_REPLAY_RE.test(raw) || EVAL_GIT_RE.test(raw)) {
      evalReplay = true;
      gitComplete = true;
      if (!evalLine) evalLine = n;
    }
    if (GIT_FN_RE.test(raw)) gitComplete = true;
    if (DANGLING_RE.test(raw)) {
      danglingComment = true;
      danglingLine = n;
    }

    let j = 0;
    while (j < raw.length) {
      const c = raw[j];
      const nxt = raw[j + 1];
      if (quote === "bare") {
        if (c === "$" && nxt === "'") {
          quote = "ansi";
          j += 2;
          continue;
        }
        if (c === "'") {
          quote = "sq";
          j += 1;
          continue;
        }
        if (c === '"') {
          quote = "dq";
          j += 1;
          continue;
        }
        if (c === "(") {
          const pre = raw.slice(0, j);
          if (/__git_\w+\s*$/.test(pre) && /eval\s+\$'/.test(pre)) {
            if (!bashN) {
              bashN = {
                line: n,
                kind: "parse-fail",
                token: "(",
                message: "syntax error near unexpected token '('",
              };
            }
          }
        }
        j += 1;
        continue;
      }
      if (quote === "ansi") {
        if (c === "\\") {
          j += 2;
          continue;
        }
        if (c === "'") {
          quote = "bare";
          j += 1;
          continue;
        }
        j += 1;
        continue;
      }
      if (quote === "sq") {
        if (c === "'") quote = "bare";
        j += 1;
        continue;
      }
      if (quote === "dq") {
        if (c === "\\") {
          j += 2;
          continue;
        }
        if (c === '"') {
          quote = "bare";
          j += 1;
          continue;
        }
        j += 1;
        continue;
      }
      j += 1;
    }
  }

  if (quote !== "bare" && !bashN) {
    bashN = {
      line: lines.length,
      kind: "parse-fail",
      message: "unexpected EOF while looking for matching quote",
    };
  }

  // A prior torn head wrecks quote state; the eval-replay plate is
  // where bash -n reports unexpected '('. Compact fixture: line 9.
  if (evalReplay && midToken && evalLine && !bashN) {
    bashN = {
      line: evalLine,
      kind: "parse-fail",
      token: "(",
      message: "syntax error near unexpected token '('",
    };
  }

  if (danglingComment) {
    const rest = lines.slice(danglingLine);
    danglingComment = rest.every((line) => !line.trim() || /^\s*#/.test(line));
  }

  const parseFail = Boolean(bashN || midToken);
  return {
    pathHolds,
    midToken,
    evalReplay,
    gitComplete,
    danglingComment,
    danglingLine,
    evalLine,
    parseFail,
    bisect,
    bashN,
    firstSmash: bisect || bashN,
    quote,
    bytes: Buffer.byteLength(source),
    lineCount: lines.length,
  };
}

export function chipsOf(ticket, walk) {
  const chips = [];
  const torn =
    walk.parseFail ||
    walk.midToken ||
    (walk.evalReplay && walk.midToken) ||
    (walk.danglingComment && walk.midToken);
  if (torn) {
    chips.push("torn");
    if (walk.parseFail || walk.bashN) chips.push("parse-fail");
    chips.push("exit-127");
    if (walk.gitComplete) chips.push("git-complete");
    if (walk.evalReplay) chips.push("eval-replay");
    if (walk.midToken) chips.push("mid-token");
    if (walk.danglingComment) chips.push("dangling-comment");
    if (ticket.byteIdentical) chips.push("byte-identical");
    chips.push("builtins-dead");
    if (ticket.interactiveOk !== false) chips.push("interactive-ok");
    chips.push("source-killed");
  } else {
    chips.push("struck");
    if (ticket.interactiveOk !== false) chips.push("interactive-ok");
  }
  return [...new Set(chips)];
}

export function analyze(input) {
  const ticket = normalize(input);
  const walk = walkSnapshot(ticket.snapshot);
  const chips = chipsOf(ticket, walk);
  const torn = chips.includes("torn");
  const verdict = torn ? "torn" : "struck";
  const reasons = [];
  if (walk.pathHolds) reasons.push("line 1 PATH export holds");
  if (walk.bisect) {
    reasons.push(`bisect: line ${walk.bisect.line} ${walk.bisect.message}`);
  }
  if (walk.bashN) {
    reasons.push(`bash -n: line ${walk.bashN.line} ${walk.bashN.message}`);
  }
  if (walk.evalReplay) {
    reasons.push("eval-replay __git_* plate in the chase");
  }
  if (walk.danglingComment) {
    reasons.push("dangling Shadow pkill comment with no function body");
  }
  if (!torn) reasons.push("small valid flong; proof pulls clean; builtins live");
  if (torn) {
    reasons.push("Claude Code sources the torn flong → exit 127, empty stdio");
    reasons.push("Codex discards an unparseable snapshot (degraded)");
  }
  return {
    verdict,
    chips,
    reasons,
    struck: !torn,
    torn,
    hold: !torn,
    alarm: torn,
    idleWord: IDLE_WORD,
    seededWord: SEEDED_WORD,
    walk,
    smash: walk.firstSmash,
    contrast: {
      claude: torn ? "source" : "source",
      codex: torn ? "discard" : "keep",
      claudeExit: torn ? EXIT_CODE : 0,
      codexExit: torn ? null : 0,
      note: torn
        ? "Codex discards the torn flong (degraded). Claude Code sources it, so every impression is 127."
        : "Struck flong sources clean. Codex and Claude Code both keep it.",
    },
    issue: ticket.issue ?? null,
    mark: MARK,
  };
}

export function classify(input) {
  return analyze(input).verdict;
}

export function score(input) {
  return analyze(input);
}

export function decide(input) {
  return analyze(input);
}

export function decideSeed(name) {
  if (name === SEEDED_WORD || name === 90916 || name === "90916") {
    return analyze(seedTorn());
  }
  return analyze(seedStruck());
}

export function handle(input) {
  const result = analyze(input);
  return {
    ...result,
    hookSpecificOutput: {
      additionalContext: result.torn
        ? `torn flong #${FEATURED_ISSUE}: parse-fail, mid-token, dangling-comment, eval-replay. Source-killed. Exit ${EXIT_CODE}.`
        : `struck flong. Idle word ${IDLE_WORD}. Proof pulls clean.`,
    },
  };
}

function readArgTicket(argv) {
  const file = argv[2];
  if (!file || file === "-") return null;
  const raw = readFileSync(file, "utf8");
  return normalize(raw);
}

async function readStdin() {
  const chunks = [];
  for await (const chunk of stdin) chunks.push(chunk);
  return Buffer.concat(chunks).toString("utf8");
}

export async function main(argv = process.argv) {
  let ticket = readArgTicket(argv);
  if (!ticket) {
    if (stdin.isTTY) {
      ticket = emptyTicket();
    } else {
      const raw = await readStdin();
      ticket = raw.trim() ? normalize(raw) : emptyTicket();
    }
  }
  const result = handle(ticket);
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  return result;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
