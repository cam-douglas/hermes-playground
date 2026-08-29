/**
 * Calque — linguistic-calque desk for a
 * real Claude Code defect: the PowerShell
 * tool's protected-path / Remove-Item
 * safety guard treats the Spanish word
 * "del" (de+el contraction; also Catalan)
 * inside a quoted commit message as the
 * Remove-Item alias `del`, then extracts
 * a delete target by whitespace-splitting
 * without respecting quotes, so a
 * fragment like `"C:\IA` (including the
 * leading quote) is judged a protected
 * system path and a plain `git commit`
 * is blocked before execution.
 *
 * Quoted string content is not a command.
 * Score the folio or admit verbatim.
 *
 * Primary #90645: OPEN, filed
 * 2026-08-29, labels bug / has repro /
 * platform:windows / area:sandbox.
 * Title: PowerShell safety guard:
 * Spanish word "del" inside a quoted
 * commit message is treated as
 * Remove-Item, then blocks on a
 * quote-split path fragment.
 * Deterministic repro:
 *   git -C "C:\IA Local\Produccion de Video"
 *     commit -m "prueba del guard"
 * Actual block:
 *   Remove-Item on system path '"C:\IA'
 *   is blocked. This path is protected
 *   from removal.
 * Controls: same command without "del"
 * runs; same with "del" via Bash tool
 * runs; commit -F msg.txt with del in
 * file runs; init/add/push with the
 * same quoted path run.
 *
 * Same-class target-side priors
 * (complementary, not identical —
 * those mis-attribute target when a
 * *real* Remove-Item exists; Calque
 * is verb-side hallucination from
 * quoted natural language):
 *   #69461 #73524 #73882
 *
 * Suggested fix from #90645: tokenize
 * with PowerShell's real parser so
 * alias detection never matches inside
 * string literals; if extracted "path"
 * begins with `"` or `'`, do not block.
 *
 * Verdicts: verbatim | calqued |
 *           aliased | quote-blind |
 *           frag-quote | commit-blocked |
 *           bash-ok | path-lie |
 *           spanish-del
 * Idle word is verbatim (quoted string
 * content is not scanned as commands;
 * hold is quiet). NEVER use calque /
 * empty / silent / mute / idle / dead /
 * sealed / fronted / locked / yanked /
 * caught / stowed / posted / bunged /
 * belayed / rove / keyed / housed /
 * beamed / snug / hung / appointed /
 * cinched / gauged / stamped /
 * overrun / pratique / wound / bound /
 * stilled / stabled / drained / flat /
 * fit / spoilt / laid / unlinked /
 * tight / banked / roosted / stocked /
 * seated / heard / clear / paired /
 * kernel / latched / upheld / sterling /
 * home / valid / dry / quiet / seised /
 * rung / moored as the idle word.
 *
 * Slack alarm on calqued / aliased /
 * quote-blind / frag-quote /
 * commit-blocked / path-lie /
 * spanish-del.
 * Linear ticket on calqued /
 * spanish-del / commit-blocked.
 * GitHub calque-ledger of scored
 * probes on every score.
 *
 * Priority when multiple match:
 *   calqued > spanish-del > aliased >
 *   quote-blind > frag-quote >
 *   commit-blocked > bash-ok >
 *   path-lie > verbatim
 * Unique nearby flags win their own
 * seeds because those seeds do not
 * carry the #90645 calqued triad
 * (PowerShell + Spanish del inside
 * quotes + block with path starting
 * with a quote).
 *
 * verbatim is true ONLY when the
 * verdict is verbatim (idle, or
 * honest control: no del / not
 * blocked). A calqued folio is
 * never verbatim.
 *
 * Why this is not a clone:
 * NOT Visa — MCP OAuth missing
 *     RFC 8707 resource.
 * NOT Fob — Keychain credential
 *     proliferation / split-brain.
 * NOT Snib / Knock / Veto —
 *     auth/permission classes.
 * NOT Quoin — Bash quoted-heredoc
 *     unescape.
 * NOT Sear / Gaff / Grille / Spile —
 *     Bash set -e / timeout-kill /
 *     steered edits / hook stdin.
 * NOT Fascia / Wicket / Iota —
 *     trust dialog / worktree /
 *     path-key.
 * Different problem: PowerShell
 * safety parser calques English
 * `del` onto Spanish "del" inside
 * quotes, then quote-blinds path
 * extraction. Different UI:
 * scriptorium / translator's desk.
 * Different idle: verbatim.
 */

export const VERDICTS = Object.freeze([
  "verbatim",
  "calqued",
  "aliased",
  "quote-blind",
  "frag-quote",
  "commit-blocked",
  "bash-ok",
  "path-lie",
  "spanish-del",
]);
export const IDLE_WORD = "verbatim";
export const SLACK_VERDICTS = Object.freeze([
  "calqued",
  "aliased",
  "quote-blind",
  "frag-quote",
  "commit-blocked",
  "path-lie",
  "spanish-del",
]);
export const LINEAR_VERDICTS = Object.freeze([
  "calqued",
  "spanish-del",
  "commit-blocked",
]);
export const ALARM_VERDICTS = SLACK_VERDICTS;
export const FEATURED_ISSUE = 90645;
export const PRIOR_TARGET_69461 = 69461;
export const PRIOR_TARGET_73524 = 73524;
export const PRIOR_TARGET_73882 = 73882;

export const DEMO_COMMAND_90645 =
  'git -C "C:\\IA Local\\Produccion de Video" commit -m "prueba del guard"';
export const DEMO_MESSAGE_90645 = "prueba del guard";
export const DEMO_PATH_90645 = "C:\\IA Local\\Produccion de Video";
export const DEMO_EXTRACTED_90645 = '"C:\\IA';
export const DEMO_BLOCK_90645 =
  "Remove-Item on system path '\"C:\\IA' is blocked. This path is protected from removal.";
export const DEMO_CONTROL_COMMAND =
  'git -C "C:\\IA Local\\Produccion de Video" commit -m "prueba guard bug tokenizado"';
export const DEMO_CONTROL_MESSAGE = "prueba guard bug tokenizado";
export const DEMO_TOOL_POWERSHELL = "PowerShell";
export const DEMO_TOOL_BASH = "Bash";

const FORBIDDEN_IDLE = Object.freeze([
  "calque",
  "empty",
  "silent",
  "mute",
  "idle",
  "dead",
  "sealed",
  "fronted",
  "locked",
  "yanked",
  "caught",
  "stowed",
  "posted",
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
  "quiet",
  "seised",
  "rung",
  "moored",
  "frisk",
  "cognate",
  "gloss",
  "alias",
  "homograph",
  "delguard",
  "falsefriend",
  "visa",
  "fob",
  "snib",
  "knock",
  "veto",
  "quoin",
  "sear",
  "gaff",
  "grille",
  "spile",
  "fascia",
  "wicket",
  "iota",
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

function asList(value) {
  if (Array.isArray(value)) return value.map((row) => asText(row)).filter(Boolean);
  if (value == null || value === "") return [];
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return [];
    if (trimmed.startsWith("[")) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
          return parsed.map((row) => asText(row)).filter(Boolean);
        }
      } catch {
        /* fall through */
      }
    }
    return trimmed
      .split(/\n|,/)
      .map((row) => row.trim())
      .filter(Boolean);
  }
  return [];
}

export function isPowerShellTool(value) {
  return /powershell|pwsh/i.test(asText(value));
}

export function isBashTool(value) {
  return /^\s*bash\s*$/i.test(asText(value));
}

export function extractQuotedStrings(command = "") {
  const text = asText(command);
  const out = [];
  const re = /"([^"]*)"|'([^']*)'/g;
  let match;
  while ((match = re.exec(text))) {
    out.push(match[1] != null ? match[1] : match[2]);
  }
  return out;
}

export function extractQuotedSpans(command = "") {
  const text = asText(command);
  const out = [];
  const re = /"[^"]*"|'[^']*'/g;
  let match;
  while ((match = re.exec(text))) {
    out.push(match[0]);
  }
  return out;
}

export function stripQuotes(value) {
  const text = asText(value).trim();
  if (
    (text.startsWith('"') && text.endsWith('"')) ||
    (text.startsWith("'") && text.endsWith("'"))
  ) {
    return text.slice(1, -1);
  }
  return text;
}

/**
 * Spanish/Catalan "del" (de+el) inside a
 * quoted string literal — the false gloss.
 * Does not match unquoted `del` aliases.
 */
export function hasSpanishDelInQuotes(command = "", messageText = "") {
  const message = asText(messageText);
  if (/\bdel\b/i.test(message)) return true;
  const quoted = extractQuotedStrings(command);
  return quoted.some((span) => /\bdel\b/i.test(span));
}

/**
 * Unquoted token `del` or Remove-Item —
 * a real alias scan, not the Spanish lemma.
 */
export function hasUnquotedDelAlias(command = "") {
  const text = asText(command);
  if (!text) return false;
  if (/\bRemove-Item\b/i.test(text)) return true;
  const withoutQuotes = text.replace(/"[^"]*"|'[^']*'/g, " ");
  return /(?:^|[;|&\n(])\s*del\b/i.test(withoutQuotes) || /^\s*del\b/i.test(withoutQuotes);
}

export function isGitCommit(command = "") {
  return /\bgit\b[\s\S]*\bcommit\b/i.test(asText(command));
}

export function parseBlockedPath(blockMessage = "") {
  const text = asText(blockMessage);
  const match =
    text.match(/system path\s+'([^']+)'/i) ||
    text.match(/system path\s+"([^"]+)"/i) ||
    text.match(/on system path\s+(\S+)/i);
  return match ? match[1] : "";
}

export function pathStartsWithQuote(value = "") {
  const text = asText(value).trim();
  return text.startsWith('"') || text.startsWith("'");
}

export function claimsSystemPath(blockMessage = "") {
  return /system path|protected from removal/i.test(asText(blockMessage));
}

export function isQuoteBlindSplit(command = "", extractedPath = "") {
  const frag = asText(extractedPath).trim();
  if (!frag) return false;
  const bare = stripQuotes(frag);
  if (!bare) return false;
  const quoted = extractQuotedStrings(command);
  return quoted.some((span) => {
    if (!span.includes(" ")) return false;
    if (span === bare || span === frag) return false;
    return span.startsWith(bare) || span.includes(bare);
  });
}

export function emptyCalque() {
  return {
    session: "",
    issue: null,
    source: "",
    command: "",
    tool: "",
    messageText: "",
    quotedPaths: [],
    extractedPath: "",
    blocked: false,
    blockMessage: "",
    platform: "",
    scored: false,
  };
}

export function emptyAction(session = "verbatim-1") {
  return {
    action: "score",
    session,
    calque: emptyCalque(),
  };
}

export function cloneCalque(raw = {}) {
  const src = raw && typeof raw === "object" ? raw : emptyCalque();
  const nested =
    (src.calque && typeof src.calque === "object" && src.calque) ||
    (src.probe && typeof src.probe === "object" && src.probe) ||
    (src.payload && typeof src.payload === "object" && src.payload) ||
    (src.folio && typeof src.folio === "object" && src.folio) ||
    src;
  const quotedPaths = asList(nested.quotedPaths ?? src.quotedPaths);
  const command = asText(nested.command ?? src.command);
  const blockMessage = asText(nested.blockMessage ?? src.blockMessage);
  const extractedPath = asText(
    nested.extractedPath ?? src.extractedPath ?? parseBlockedPath(blockMessage),
  );
  return {
    ...emptyCalque(),
    session: asText(nested.session ?? src.session ?? src.sessionKey),
    issue: asIssue(nested.issue ?? src.issue),
    source: asText(nested.source ?? src.source),
    command,
    tool: asText(nested.tool ?? src.tool),
    messageText: asText(nested.messageText ?? src.messageText),
    quotedPaths: quotedPaths.length ? quotedPaths : extractQuotedStrings(command),
    extractedPath,
    blocked: asBool(nested.blocked ?? src.blocked, false) === true,
    blockMessage,
    platform: asText(nested.platform ?? src.platform).toLowerCase(),
    scored: asBool(nested.scored ?? src.scored, false) === true,
  };
}

export function analyze(calque = {}) {
  const next = cloneCalque(calque);
  const command = next.command;
  const powershell = isPowerShellTool(next.tool);
  const bash = isBashTool(next.tool);
  const spanishDel = hasSpanishDelInQuotes(command, next.messageText);
  const unquotedDel = hasUnquotedDelAlias(command);
  const extracted = next.extractedPath || parseBlockedPath(next.blockMessage);
  const fragQuote = pathStartsWithQuote(extracted);
  const quoteBlind = isQuoteBlindSplit(command, extracted);
  const gitCommit = isGitCommit(command);
  const systemPathClaim = claimsSystemPath(next.blockMessage);
  const blocked = next.blocked === true;

  const calquedShape = powershell && spanishDel && blocked && fragQuote;
  const spanishDelShape = !calquedShape && powershell && spanishDel && blocked;
  const aliasedShape =
    !calquedShape && !spanishDelShape && powershell && unquotedDel && blocked && !spanishDel;
  const quoteBlindShape =
    !calquedShape &&
    !spanishDelShape &&
    !aliasedShape &&
    powershell &&
    quoteBlind &&
    blocked &&
    !fragQuote;
  const fragQuoteShape =
    !calquedShape &&
    !spanishDelShape &&
    !aliasedShape &&
    !quoteBlindShape &&
    powershell &&
    fragQuote &&
    blocked;
  const commitBlockedShape =
    !calquedShape &&
    !spanishDelShape &&
    !aliasedShape &&
    !quoteBlindShape &&
    !fragQuoteShape &&
    powershell &&
    gitCommit &&
    blocked;
  const bashOkShape = bash && spanishDel && !blocked;
  const pathLieShape =
    !calquedShape &&
    !spanishDelShape &&
    !aliasedShape &&
    !quoteBlindShape &&
    !fragQuoteShape &&
    !commitBlockedShape &&
    powershell &&
    blocked &&
    (systemPathClaim || Boolean(extracted));
  const verbatimHold = !blocked && !bashOkShape;

  return {
    command,
    tool: next.tool,
    messageText: next.messageText,
    quotedPaths: next.quotedPaths,
    extractedPath: extracted,
    blocked,
    blockMessage: next.blockMessage,
    powershell,
    bash,
    spanishDel,
    unquotedDel,
    fragQuote,
    quoteBlind,
    gitCommit,
    systemPathClaim,
    calquedShape,
    spanishDelShape,
    aliasedShape,
    quoteBlindShape,
    fragQuoteShape,
    commitBlockedShape,
    bashOkShape,
    pathLieShape,
    verbatimHold,
  };
}

export function isIdle(calque = {}) {
  const next = cloneCalque(calque);
  return (
    !next.command &&
    !next.tool &&
    !next.messageText &&
    next.quotedPaths.length === 0 &&
    !next.extractedPath &&
    next.blocked !== true &&
    !next.blockMessage
  );
}

/**
 * First match wins by documented
 * priority: calqued > spanish-del >
 * aliased > quote-blind > frag-quote >
 * commit-blocked > bash-ok > path-lie >
 * verbatim. Idle verbatim is first.
 * Seeded #90645 numbers must produce
 * calqued, never verbatim.
 */
export function classify(calque = {}) {
  const next = cloneCalque(calque);
  if (isIdle(next)) return "verbatim";
  const facts = analyze(next);

  if (facts.calquedShape) return "calqued";
  if (facts.spanishDelShape) return "spanish-del";
  if (facts.aliasedShape) return "aliased";
  if (facts.quoteBlindShape) return "quote-blind";
  if (facts.fragQuoteShape) return "frag-quote";
  if (facts.commitBlockedShape) return "commit-blocked";
  if (facts.bashOkShape) return "bash-ok";
  if (facts.pathLieShape) return "path-lie";
  if (facts.verbatimHold) return "verbatim";
  return "verbatim";
}

export function feedOf(calque = {}, verdict = "") {
  const kind = verdict || classify(calque);
  if (kind === "calqued") {
    return "● Calqued · PowerShell guard reads Spanish del inside quotes as Remove-Item · quote-split path starts with \" · primary #90645";
  }
  if (kind === "spanish-del") {
    return "● Spanish-del · Spanish del inside quotes treated as Remove-Item · verb-side hallucination · not the quote-frag triad";
  }
  if (kind === "aliased") {
    return "● Aliased · unquoted del / Remove-Item token scanned as the deletion alias · not the Spanish lemma";
  }
  if (kind === "quote-blind") {
    return "● Quote-blind · whitespace split without respecting quotes · extracted fragment is not the quoted path";
  }
  if (kind === "frag-quote") {
    return "● Frag-quote · extracted path begins with \" or ' · tokenization already known to be wrong";
  }
  if (kind === "commit-blocked") {
    return "● Commit-blocked · a plain git commit was denied before execution · the failure correlates with commit";
  }
  if (kind === "bash-ok") {
    return "● Bash-ok · same command with del via the Bash tool runs · guard is PowerShell-tool only";
  }
  if (kind === "path-lie") {
    return "● Path-lie · block claims a protected system path that is a fabricated fragment · not a real delete target";
  }
  return "● Verbatim · quoted string content is not scanned as commands · hold is quiet · idle word is verbatim";
}

export function reasonsOf(calque = {}, verdict = "") {
  const next = cloneCalque(calque);
  const kind = verdict || classify(next);
  const facts = analyze(next);
  const reasons = [];
  if (next.session) reasons.push(`session ${next.session}`);
  reasons.push(
    next.command
      ? `tool ${next.tool || "unset"} · blocked ${facts.blocked ? "yes" : "no"} · command ${next.command}`
      : "quoted string content is not scanned as commands · hold is quiet · idle word is verbatim",
  );
  if (facts.spanishDel) {
    reasons.push(
      `Spanish/Catalan del inside quotes · message ${next.messageText || "from command"} · the false gloss`,
    );
  }
  if (facts.unquotedDel) {
    reasons.push("unquoted del / Remove-Item token · alias scan, not the lemma");
  }
  if (facts.fragQuote) {
    reasons.push(
      `extracted path starts with a quote · ${facts.extractedPath} · do not block on a known-bad token`,
    );
  }
  if (facts.quoteBlind) {
    reasons.push(
      "whitespace split without respecting quotes · fragment is not the quoted path",
    );
  }
  if (facts.gitCommit) {
    reasons.push("command is git commit · natural-language text is the only free text");
  }
  if (facts.bash) {
    reasons.push("tool is Bash · the PowerShell-only guard does not parse this surface");
  }
  if (facts.systemPathClaim) {
    reasons.push(next.blockMessage || DEMO_BLOCK_90645);
  }
  if (facts.verbatimHold) {
    reasons.push(
      "honest folio: no del inside quotes, or the command was not blocked · quoted content stayed verbatim",
    );
  }
  reasons.push("quoted string content is not a command");
  reasons.push(
    "NOT Visa (MCP OAuth missing RFC 8707) / Fob (Keychain split-brain) / Snib / Knock / Veto (auth/permission) / Quoin (quoted-heredoc unescape) / Sear / Gaff / Grille / Spile / Fascia / Wicket / Iota / leftover woodworking / millimetre-slider.",
  );
  if (kind === "verbatim") {
    reasons.push(
      "quoted string content is not scanned as commands; idle word is verbatim",
    );
  }
  if (kind === "calqued") {
    reasons.push(
      "PRIMARY #90645: PowerShell safety guard treats Spanish del inside a quoted commit message as Remove-Item, then blocks on a quote-split path fragment. The calqued case is calqued, never verbatim.",
    );
  }
  if (kind === "spanish-del") {
    reasons.push("Spanish del inside quotes treated as Remove-Item. Not the quote-frag triad.");
  }
  if (kind === "aliased") {
    reasons.push("unquoted del / Remove-Item scanned as the deletion alias.");
  }
  if (kind === "quote-blind") {
    reasons.push("whitespace split without respecting quotes.");
  }
  if (kind === "frag-quote") {
    reasons.push('extracted path begins with " or \'. Tokenization is already wrong.');
  }
  if (kind === "commit-blocked") {
    reasons.push("a plain git commit was denied before execution.");
  }
  if (kind === "bash-ok") {
    reasons.push("same command via Bash tool runs. Guard is PowerShell-tool only.");
  }
  if (kind === "path-lie") {
    reasons.push("block claims a protected system path that is a fabricated fragment.");
  }
  return reasons;
}

export function verdictOf(calque = {}) {
  return classify(calque);
}

export function flagsOf(verdict) {
  return {
    slack: SLACK_VERDICTS.includes(verdict),
    linear: LINEAR_VERDICTS.includes(verdict),
    github: true,
    alarm: ALARM_VERDICTS.includes(verdict),
  };
}

export function verbatimOf(calque = {}, verdict = "") {
  const kind = verdict || classify(calque);
  if (kind !== "verbatim") return false;
  if (SLACK_VERDICTS.includes(kind)) return false;
  if (isIdle(calque)) return true;
  const facts = analyze(calque);
  return facts.verbatimHold === true;
}

export function calquedOf(calque = {}, verdict = "") {
  return (verdict || classify(calque)) === "calqued";
}

export function summaryOf(calque = {}) {
  const next = cloneCalque(calque);
  const facts = analyze(next);
  return {
    command: next.command,
    tool: next.tool,
    messageText: next.messageText,
    quotedPaths: next.quotedPaths,
    extractedPath: facts.extractedPath,
    blocked: facts.blocked,
    blockMessage: next.blockMessage,
    platform: next.platform,
    powershell: facts.powershell,
    bash: facts.bash,
    spanishDel: facts.spanishDel,
    unquotedDel: facts.unquotedDel,
    fragQuote: facts.fragQuote,
    quoteBlind: facts.quoteBlind,
    gitCommit: facts.gitCommit,
    systemPathClaim: facts.systemPathClaim,
    verbatimHold: facts.verbatimHold,
  };
}

export function score(calque = {}) {
  const next = cloneCalque(calque);
  const verdict = classify(next);
  const facts = analyze(next);
  const flags = flagsOf(verdict);
  return {
    verdict,
    reasons: reasonsOf(next, verdict),
    verbatim: verbatimOf(next, verdict),
    calqued: calquedOf(next, verdict),
    feed: feedOf(next, verdict),
    slack: flags.slack,
    linear: flags.linear,
    github: flags.github,
    alarm: flags.alarm,
    idleWord: IDLE_WORD,
    state: verdict,
    decision: verdict,
    command: next.command,
    tool: next.tool,
    messageText: next.messageText,
    quotedPaths: next.quotedPaths,
    extractedPath: facts.extractedPath,
    blocked: facts.blocked,
    blockMessage: next.blockMessage,
    platform: next.platform,
    powershell: facts.powershell,
    bash: facts.bash,
    spanishDel: facts.spanishDel,
    unquotedDel: facts.unquotedDel,
    fragQuote: facts.fragQuote,
    quoteBlind: facts.quoteBlind,
    gitCommit: facts.gitCommit,
    systemPathClaim: facts.systemPathClaim,
    honestFolio: facts.verbatimHold,
    summary: summaryOf(next),
    calque: next,
  };
}

export function readAction(payload = {}) {
  const nested = payload.action && typeof payload.action === "object" ? payload.action : null;
  const src = nested || payload;
  const calqueSrc =
    src.calque ||
    src.probe ||
    src.payload ||
    src.folio ||
    payload.calque ||
    payload.probe ||
    payload.folio;
  const calque = cloneCalque(
    calqueSrc && typeof calqueSrc === "object" ? { ...calqueSrc, ...src, ...payload } : payload,
  );
  if (typeof src.session === "string" && !calque.session) calque.session = src.session;
  if (typeof payload.session === "string" && !calque.session) calque.session = payload.session;
  const rawAction = String((nested ? nested.action : payload.action) || "score");
  return {
    action: rawAction,
    session: String(src.session ?? payload.session ?? calque.session ?? ""),
    calque,
    issue: src.issue ?? payload.issue ?? calque.issue ?? null,
    source: src.source ?? payload.source ?? calque.source ?? "",
  };
}

function calqueResult(verdict, calque, action, extras = {}) {
  const next = cloneCalque(calque);
  const scored = score(next);
  return {
    ok: true,
    product: "calque",
    verdict,
    state: verdict,
    decision: verdict,
    idleWord: IDLE_WORD,
    alarm: scored.alarm,
    linear: scored.linear,
    slack: scored.slack,
    github: scored.github,
    verbatim: scored.verbatim,
    calqued: scored.calqued,
    calqueVerbatim: verdict === "verbatim",
    calqueCalqued: verdict === "calqued",
    calqueAliased: verdict === "aliased",
    calqueQuoteBlind: verdict === "quote-blind",
    calqueFragQuote: verdict === "frag-quote",
    calqueCommitBlocked: verdict === "commit-blocked",
    calqueBashOk: verdict === "bash-ok",
    calquePathLie: verdict === "path-lie",
    calqueSpanishDel: verdict === "spanish-del",
    action: action.action,
    session: next.session || action.session || "",
    source: next.source || action.source || "",
    issue: next.issue ?? action.issue ?? null,
    command: scored.command,
    tool: scored.tool,
    messageText: scored.messageText,
    quotedPaths: scored.quotedPaths,
    extractedPath: scored.extractedPath,
    blocked: scored.blocked,
    blockMessage: scored.blockMessage,
    platform: scored.platform,
    powershell: scored.powershell,
    bash: scored.bash,
    spanishDel: scored.spanishDel,
    unquotedDel: scored.unquotedDel,
    fragQuote: scored.fragQuote,
    quoteBlind: scored.quoteBlind,
    gitCommit: scored.gitCommit,
    systemPathClaim: scored.systemPathClaim,
    honestFolio: scored.honestFolio,
    feed: scored.feed,
    reasons: scored.reasons,
    summary: scored.summary,
    scored: Boolean(next.scored),
    calque: next,
    ...extras,
  };
}

function seedCalque(issue, source, extras = {}) {
  const session = extras.session != null ? String(extras.session) : String(issue);
  const issueId = extras.issue !== undefined ? extras.issue : issue;
  source = extras.source != null ? extras.source : source;
  return {
    action: extras.action || "score",
    session,
    issue: issueId,
    source,
    calque: {
      ...emptyCalque(),
      session,
      source,
      issue: issueId,
      scored: extras.scored == null ? true : Boolean(extras.scored),
      command: extras.command || "",
      tool: extras.tool || "",
      messageText: extras.messageText || "",
      quotedPaths: extras.quotedPaths || [],
      extractedPath: extras.extractedPath || "",
      blocked: Boolean(extras.blocked),
      blockMessage: extras.blockMessage || "",
      platform: extras.platform || "",
    },
  };
}

/** Idle reset. Quoted content stays verbatim. */
export function seedVerbatim() {
  return seedCalque("verbatim", "scriptorium", {
    session: "verbatim",
    issue: null,
    scored: true,
  });
}

export function seedReset() {
  return seedVerbatim();
}

/**
 * Control / proof: same quoted path,
 * commit message without "del".
 * Classifies as verbatim; verbatim true.
 */
export function seedControl() {
  return seedCalque(FEATURED_ISSUE, "anthropics/claude-code#90645", {
    session: "90645-control",
    issue: null,
    command: DEMO_CONTROL_COMMAND,
    tool: DEMO_TOOL_POWERSHELL,
    messageText: DEMO_CONTROL_MESSAGE,
    quotedPaths: [DEMO_PATH_90645, DEMO_CONTROL_MESSAGE],
    blocked: false,
    platform: "windows",
  });
}

/**
 * #90645 calqued: PowerShell + Spanish
 * del inside quotes + block with path
 * starting with a quote. Never verbatim.
 */
export function seedCalqued() {
  return seedCalque(FEATURED_ISSUE, "anthropics/claude-code#90645", {
    session: "90645-calqued",
    command: DEMO_COMMAND_90645,
    tool: DEMO_TOOL_POWERSHELL,
    messageText: DEMO_MESSAGE_90645,
    quotedPaths: [DEMO_PATH_90645, DEMO_MESSAGE_90645],
    extractedPath: DEMO_EXTRACTED_90645,
    blocked: true,
    blockMessage: DEMO_BLOCK_90645,
    platform: "windows",
  });
}

export function seed90645() {
  return seedCalqued();
}

/**
 * Spanish del inside quotes treated as
 * Remove-Item, without the quote-frag.
 */
export function seedSpanishDel() {
  return seedCalque(FEATURED_ISSUE, "anthropics/claude-code#90645", {
    session: "90645-spanish-del",
    command: 'git commit -m "esqueleto del proyecto"',
    tool: DEMO_TOOL_POWERSHELL,
    messageText: "esqueleto del proyecto",
    quotedPaths: ["esqueleto del proyecto"],
    extractedPath: "C:\\Windows",
    blocked: true,
    blockMessage:
      "Remove-Item on system path 'C:\\Windows' is blocked. This path is protected from removal.",
    platform: "windows",
  });
}

/**
 * Unquoted del / Remove-Item token
 * scanned as the deletion alias.
 */
export function seedAliased() {
  return seedCalque(FEATURED_ISSUE, "anthropics/claude-code#90645", {
    session: "90645-aliased",
    command: "del C:\\Temp\\scratch.txt",
    tool: DEMO_TOOL_POWERSHELL,
    messageText: "",
    quotedPaths: [],
    extractedPath: "C:\\Temp\\scratch.txt",
    blocked: true,
    blockMessage:
      "Remove-Item on system path 'C:\\Temp\\scratch.txt' is blocked. This path is protected from removal.",
    platform: "windows",
  });
}

/**
 * Whitespace split without respecting
 * quotes; fragment does not start with
 * a quote. No Spanish del.
 */
export function seedQuoteBlind() {
  return seedCalque(FEATURED_ISSUE, "anthropics/claude-code#90645", {
    session: "90645-quote-blind",
    command: 'git -C "C:\\IA Local\\Produccion de Video" status',
    tool: DEMO_TOOL_POWERSHELL,
    messageText: "",
    quotedPaths: [DEMO_PATH_90645],
    extractedPath: "C:\\IA",
    blocked: true,
    blockMessage:
      "Remove-Item on system path 'C:\\IA' is blocked. This path is protected from removal.",
    platform: "windows",
  });
}

/**
 * Extracted path begins with a quote.
 * No Spanish del.
 */
export function seedFragQuote() {
  return seedCalque(FEATURED_ISSUE, "anthropics/claude-code#90645", {
    session: "90645-frag-quote",
    command: 'git -C "C:\\IA Local\\Work" status',
    tool: DEMO_TOOL_POWERSHELL,
    messageText: "",
    quotedPaths: ["C:\\IA Local\\Work"],
    extractedPath: '"C:\\IA',
    blocked: true,
    blockMessage:
      "Remove-Item on system path '\"C:\\IA' is blocked. This path is protected from removal.",
    platform: "windows",
  });
}

/**
 * A plain git commit was denied.
 * No del, no quote-frag.
 */
export function seedCommitBlocked() {
  return seedCalque(FEATURED_ISSUE, "anthropics/claude-code#90645", {
    session: "90645-commit-blocked",
    command: 'git commit -m "prueba guard"',
    tool: DEMO_TOOL_POWERSHELL,
    messageText: "prueba guard",
    quotedPaths: ["prueba guard"],
    extractedPath: "",
    blocked: true,
    blockMessage: "commit blocked before execution",
    platform: "windows",
  });
}

/**
 * Same command with del via Bash.
 * Guard is PowerShell-tool only.
 */
export function seedBashOk() {
  return seedCalque(FEATURED_ISSUE, "anthropics/claude-code#90645", {
    session: "90645-bash-ok",
    command: DEMO_COMMAND_90645,
    tool: DEMO_TOOL_BASH,
    messageText: DEMO_MESSAGE_90645,
    quotedPaths: [DEMO_PATH_90645, DEMO_MESSAGE_90645],
    blocked: false,
    platform: "windows",
  });
}

/**
 * Block claims a protected system path
 * that is a fabricated fragment.
 * Not a git commit, no del, no quote.
 */
export function seedPathLie() {
  return seedCalque(FEATURED_ISSUE, "anthropics/claude-code#90645", {
    session: "90645-path-lie",
    command: "Get-ChildItem C:\\IA",
    tool: DEMO_TOOL_POWERSHELL,
    messageText: "",
    quotedPaths: [],
    extractedPath: "C:\\IA",
    blocked: true,
    blockMessage:
      "Remove-Item on system path 'C:\\IA' is blocked. This path is protected from removal.",
    platform: "windows",
  });
}

/**
 * Parse a PowerShell-tool transcript
 * (the #90645 repro command) plus
 * optional block message. JSON objects
 * are preferred when the paste starts
 * with { — never let prose win over a
 * structured probe.
 */
export function parsePowerShellCommand(command = "", block = "", tool = "") {
  const note = asText(command);
  const blockText = asText(block);
  const blob = [note, blockText, asText(tool)].filter(Boolean).join("\n");
  if (!blob.trim()) return emptyCalque();

  if (note.trim().startsWith("{") || note.trim().startsWith("[")) {
    try {
      const parsed = JSON.parse(note);
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        return cloneCalque({
          ...parsed,
          blockMessage: parsed.blockMessage || blockText,
          tool: parsed.tool || tool,
          scored: true,
        });
      }
    } catch {
      /* fall through */
    }
  }

  const looksCalqued =
    /#90645|prueba del guard|Produccion de Video/i.test(blob) &&
    /Remove-Item|blocked|"C:\\IA/i.test(blob);
  if (looksCalqued && !/bash-ok|via the Bash|tool is Bash/i.test(blob)) {
    return {
      ...seedCalqued().calque,
      session: "paste-calqued",
      scored: true,
    };
  }
  if (/bash-ok|via the Bash tool|tool["']?\s*:\s*["']?Bash/i.test(blob) && /del/i.test(blob)) {
    return {
      ...seedBashOk().calque,
      session: "paste-bash-ok",
      scored: true,
    };
  }
  if (/prueba guard bug tokenizado|without ["']?del["']?/i.test(blob)) {
    return {
      ...seedControl().calque,
      session: "paste-control",
      scored: true,
    };
  }

  const extracted = parseBlockedPath(blob);
  const quoted = extractQuotedStrings(note);
  const message =
    (note.match(/-m\s+"([^"]+)"/) || note.match(/-m\s+'([^']+)'/) || [])[1] || "";
  const blocked = /blocked|Remove-Item on system path/i.test(blob);
  const toolName = /bash/i.test(asText(tool))
    ? "Bash"
    : /powershell|pwsh/i.test(blob)
      ? "PowerShell"
      : asText(tool);

  return cloneCalque({
    session: "paste",
    source: "paste",
    command: note,
    tool: toolName,
    messageText: message,
    quotedPaths: quoted,
    extractedPath: extracted,
    blocked,
    blockMessage: blockText || (blocked ? blob : ""),
    platform: /windows|C:\\/i.test(blob) ? "windows" : "",
    scored: true,
  });
}

export function parseSessionTrace(raw = "") {
  const text = asText(raw).trim();
  if (!text) return emptyCalque();
  if (text.startsWith("{") || text.startsWith("[")) {
    try {
      const parsed = JSON.parse(text);
      if (Array.isArray(parsed)) {
        return cloneCalque({ scored: true });
      }
      if (parsed && typeof parsed === "object") {
        return cloneCalque({
          ...parsed,
          command: parsed.command || parsed.cmd || "",
          tool: parsed.tool || "",
          messageText: parsed.messageText || parsed.message || "",
          scored: true,
        });
      }
    } catch {
      /* fall through to prose */
    }
  }
  return parsePowerShellCommand(text, "", "");
}

export function parseJsonl(raw = "") {
  return parseSessionTrace(raw);
}

const SEEDS = {
  verbatim: seedVerbatim,
  control: seedControl,
  calqued: seedCalqued,
  90645: seed90645,
  "90645-calqued": seedCalqued,
  "spanish-del": seedSpanishDel,
  spanishdel: seedSpanishDel,
  aliased: seedAliased,
  "quote-blind": seedQuoteBlind,
  quoteblind: seedQuoteBlind,
  "frag-quote": seedFragQuote,
  fragquote: seedFragQuote,
  "commit-blocked": seedCommitBlocked,
  commitblocked: seedCommitBlocked,
  "bash-ok": seedBashOk,
  bashok: seedBashOk,
  "path-lie": seedPathLie,
  pathlie: seedPathLie,
  reset: seedReset,
  idle: seedReset,
  healthy: seedControl,
  folio: seedControl,
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
  let calque = cloneCalque(action.calque);
  const verb = String(action.action || "score").toLowerCase();

  if (
    verb === "bail" ||
    verb === "verbatim" ||
    verb === "still" ||
    verb === "rest" ||
    verb === "reset"
  ) {
    return calqueResult("verbatim", emptyCalque(), {
      ...action,
      action: verb === "still" || verb === "rest" || verb === "reset" ? "bail" : verb,
    });
  }

  if (verb === "control" || verb === "healthy" || verb === "proof" || verb === "folio" || verb === "desk") {
    calque = seedControl().calque;
    return calqueResult(classify(calque), calque, { ...action, action: "control" });
  }

  if (verb === "restore" || verb === "calqued" || verb === "incident" || verb === "90645") {
    calque = seedCalqued().calque;
    return calqueResult(classify(calque), calque, {
      ...action,
      action: verb === "restore" ? "restore" : verb,
    });
  }

  if (verb === "observe" || verb === "trace" || verb === "ledger" || verb === "score-folio") {
    calque = { ...calque, scored: true };
    return calqueResult(classify(calque), calque, {
      ...action,
      action: verb === "observe" ? "ledger" : verb,
    });
  }

  if (verb === "press" || verb === "admit" || verb === "score" || verb === "throw" || verb === "make") {
    calque = { ...calque, scored: true };
    return calqueResult(classify(calque), calque, {
      ...action,
      action: verb === "press" || verb === "throw" || verb === "make" ? "score" : verb,
    });
  }

  calque = { ...calque, scored: true };
  return calqueResult(classify(calque), calque, action);
}
