/**
 * Quoin — letterpress quoin for a
 * real Claude Code failure: the Bash
 * tool applies one level of
 * backslash-unescaping to the body
 * of a *quoted* heredoc (`<<'EOF'`)
 * before the shell sees it. POSIX
 * requires a quoted delimiter to
 * suppress all expansion and
 * processing, so the body should
 * arrive verbatim. Actual: `\\`
 * collapses to `\`; `\U` is left
 * alone. That is a single unescape
 * pass. The failure is misattributed:
 * a Python heredoc with
 * `s = "C:\\Users\\Scott"` raises a
 * unicodeescape SyntaxError that
 * points at a source line the model
 * never wrote. The natural response
 * is to rewrite the Python, which
 * cannot help. On Windows every
 * absolute path carries backslashes;
 * regexes with `\\` and `\d` are
 * affected the same way.
 *
 * A shifted form is not a hold.
 * Score the chase or admit locked.
 *
 * Primary #90630: open, filed
 * 2026-08-29, labels bug / has repro
 * / platform:windows / area:bash.
 * Title: Bash tool unescapes
 * backslashes inside a quoted
 * heredoc. Repro as a single Bash
 * tool call:
 *   cat <<'EOF'
 *   one:  C:\Users
 *   two:  C:\\Users
 *   EOF
 * Expected: one keeps one backslash,
 * two keeps two. Actual: both print
 * one backslash (two collapsed).
 * Piped into Python:
 *   s = "C:\\Users\\Scott"
 * raises SyntaxError unicodeescape
 * truncated \UXXXXXXXX — traceback
 * points at a line the model did not
 * write. Workarounds verified: build
 * separator with chr(92); PowerShell
 * single-quoted here-string
 * @'...'@ unaffected; forward
 * slashes.
 *
 * Same class:
 *   #88561 — Bash tool silently
 *            collapses `\\` to `\`
 *            in command text,
 *            corrupting regex and
 *            paths.
 *   #89392 — Bash tool silently
 *            strips backslashes on
 *            Windows/Git Bash.
 *   #85856 — Windows/Git Bash: Bash
 *            tool silently halves
 *            backslashes (MSVCRT vs
 *            MSYS2 command-line
 *            encoding mismatch).
 *
 * Nearby pole (different tool, do
 * not treat as the same bug):
 *   #72957 — Write/Edit tools
 *            silently decode \uXXXX
 *            in file content. Quoin
 *            is Bash-tool transport
 *            into a quoted heredoc,
 *            not Write/Edit.
 * Nearby (not this):
 *   #90597 — File-write directive
 *            prescribes heredocs
 *            without gating on
 *            platform — platform
 *            heredoc breakage, not
 *            unescape of a correctly
 *            quoted body.
 *
 * Cross-ecosystem:
 *   openai/codex#41534 — nested-
 *            quote corruption in
 *            pwsh -Command; intended
 *            body mangled before the
 *            shell sees it. Different
 *            mechanism, same class
 *            of lie (composed text ≠
 *            executed text).
 *
 * Verdicts: locked | shifted |
 *           collapsed | unescaped |
 *           misattributed |
 *           path-broke | regex-broke |
 *           double-slash | sealed-open
 * Idle word is locked (the quoted
 * delimiter held; body arrived
 * verbatim; no unescape pass; form
 * did not shift).
 * NEVER use quoin / empty / silent /
 * mute / idle / dead / sealed as
 * idle.
 * NEVER reuse posted, bunged,
 * belayed, rove, keyed, housed,
 * beamed, snug, hung, appointed,
 * cinched, gauged, stamped, overrun,
 * pratique, wound, bound, stilled,
 * stabled, drained, flat, fit,
 * spoilt, laid, unlinked, tight,
 * banked, roosted, stocked, seated,
 * heard, clear, paired, kernel,
 * latched, upheld, sterling, home,
 * valid, dry, sealed, quiet, seised,
 * rung, moored, stowed, caught,
 * yanked.
 * Do NOT ship Bodkin, Chase, Galley,
 * Slug, Wafer, Cachet, Escaper,
 * Heredoc, Quote as the product
 * name. Product name is Quoin only.
 *
 * Slack alarm on shifted / collapsed
 * / misattributed / path-broke /
 * regex-broke.
 * Linear ticket on shifted /
 * misattributed.
 * GitHub quoin-ledger of scored
 * probes on every score.
 *
 * Priority when multiple match:
 *   shifted > misattributed >
 *   path-broke > regex-broke >
 *   collapsed > double-slash >
 *   unescaped > sealed-open >
 *   locked
 * Unique nearby flags win their own
 * seeds because those seeds do not
 * carry the #90630 shifted pair
 * (quoted delimiter + one unescape
 * pass that collapses \\ to \).
 *
 * locked is true ONLY when
 * composed === received (verbatim)
 * under a quoted delimiter, OR when
 * the control path (PowerShell
 * here-string / no unescape) holds,
 * AND the verdict is locked (not a
 * failure class).
 *
 * Why this is not a clone:
 * NOT Scant — PATH truncation /
 *     working-size coil adjacent.
 *     Quoin is unescape of a quoted
 *     heredoc body.
 * NOT Sear (#90611) — set -e
 *     structurally inert in
 *     eval/non-final &&. Quoin is
 *     not about errexit.
 * NOT Grille (#90599) — permission-
 *     mode steers edits to Bash
 *     sed/heredocs so diffs vanish.
 *     Quoin is about the body
 *     arriving mutated *inside* an
 *     already-quoted heredoc, not
 *     about which tool was chosen.
 * NOT Assay — tool-arg wire-format.
 *     Quoin is Bash transport
 *     unescaping.
 * NOT Stencil — plan-mode fence.
 * NOT Gaff (#90616) — timeout-kill
 *     false complete. Quoin is not
 *     about exit receipts.
 * NOT Spile / Sounder / Leat —
 *     stdin wedge / missed wakeup /
 *     until-loop.
 * Different problem: BASH TOOL
 * APPLIES ONE UNESCAPE PASS TO A
 * QUOTED HEREDOC BODY → COMPOSED
 * TEXT ≠ SHELL BODY.
 * Different UI: letterpress
 * composing room — oak chase, type
 * metal, brass expanding quoin +
 * quoin key, ink slab, cream proof
 * sheet. Composed form vs received
 * proof. Idle locked.
 */

export const VERDICTS = Object.freeze([
  "locked",
  "shifted",
  "collapsed",
  "unescaped",
  "misattributed",
  "path-broke",
  "regex-broke",
  "double-slash",
  "sealed-open",
]);
export const IDLE_WORD = "locked";
export const SLACK_VERDICTS = Object.freeze([
  "shifted",
  "collapsed",
  "misattributed",
  "path-broke",
  "regex-broke",
]);
export const LINEAR_VERDICTS = Object.freeze(["shifted", "misattributed"]);
export const ALARM_VERDICTS = SLACK_VERDICTS;
export const FEATURED_ISSUE = 90630;
export const COLLAPSE_ISSUE = 88561;
export const WINDOWS_STRIP_ISSUE = 89392;
export const WINDOWS_HALVE_ISSUE = 85856;
export const WRITE_UNICODE_ISSUE = 72957;
export const HEREDOC_PLATFORM_ISSUE = 90597;
export const CODEX_PWSH_QUOTE_ISSUE = 41534;

export const DEMO_COMPOSED_90630 = "one:  C:\\Users\ntwo:  C:\\\\Users";
export const DEMO_RECEIVED_90630 = "one:  C:\\Users\ntwo:  C:\\Users";
export const DEMO_PROBE_90630 = [
  "cat <<'EOF'",
  DEMO_COMPOSED_90630,
  "EOF",
  "",
  "Expected:",
  DEMO_COMPOSED_90630,
  "",
  "Actual:",
  DEMO_RECEIVED_90630,
].join("\n");
export const DEMO_PYTHON_COMPOSED = 's = "C:\\\\Users\\\\Scott"';
export const DEMO_PYTHON_RECEIVED = 's = "C:\\Users\\Scott"';
export const DEMO_PYTHON_TRACE = [
  '  File "<stdin>", line 1',
  `    ${DEMO_PYTHON_RECEIVED}`,
  "        ^^^^^^^^^^^^^^^^^",
  "SyntaxError: (unicode error) 'unicodeescape' codec can't decode bytes in position 2-3: truncated \\UXXXXXXXX escape",
].join("\n");
export const DEMO_PYTHON_PROBE = [
  "python - <<'EOF'",
  DEMO_PYTHON_COMPOSED,
  "print(s)",
  "EOF",
  "",
  DEMO_PYTHON_TRACE,
].join("\n");
export const DEMO_COLLAPSE_88561 = "printf '%s\\n' 'a\\\\b'";
export const DEMO_COLLAPSE_RECEIVED = "a\\b";
export const DEMO_WINDOWS_STRIP = "printf '%s' 'M\\\\N' > /tmp/bs.txt; od -c /tmp/bs.txt";
export const DEMO_POWERSHELL_CONTROL = [
  "@'",
  "one:  C:\\Users",
  "two:  C:\\\\Users",
  "'@",
].join("\n");

const FORBIDDEN_IDLE = Object.freeze([
  "quoin",
  "bodkin",
  "chase",
  "galley",
  "slug",
  "wafer",
  "cachet",
  "escaper",
  "heredoc",
  "quote",
  "empty",
  "silent",
  "mute",
  "idle",
  "dead",
  "sealed",
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
  "stowed",
  "caught",
  "yanked",
  "gaff",
  "sear",
  "cubby",
  "grille",
  "spile",
  "scant",
  "assay",
  "stencil",
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

export function countBackslashes(text) {
  return (asText(text).match(/\\/g) || []).length;
}

export function applyOneUnescapePass(text) {
  return asText(text).replace(/\\\\/g, "\\");
}

export function oneUnescapePass(composed, received) {
  const left = asText(composed);
  const right = asText(received);
  if (!left || right === "") return false;
  if (left === right) return false;
  return applyOneUnescapePass(left) === right;
}

export function bodiesDiffer(composed, received) {
  return asText(composed) !== asText(received) && (asText(composed) !== "" || asText(received) !== "");
}

export function emptyQuoin() {
  return {
    session: "",
    issue: null,
    source: "",
    composedBody: "",
    receivedBody: "",
    delimiterQuoted: false,
    tool: "",
    platform: "",
    traceback: "",
    commandTextCollapse: false,
    windowsStrip: false,
    windowsHalve: false,
    regexChanged: false,
    unescapeApplied: false,
    sealedLook: false,
    powershellHereString: false,
    scored: false,
  };
}

export function emptyAction(session = "locked-1") {
  return {
    action: "score",
    session,
    quoin: emptyQuoin(),
  };
}

export function cloneQuoin(raw = {}) {
  const src = raw && typeof raw === "object" ? raw : emptyQuoin();
  const nested =
    (src.quoin && typeof src.quoin === "object" && src.quoin) ||
    (src.probe && typeof src.probe === "object" && src.probe) ||
    (src.payload && typeof src.payload === "object" && src.payload) ||
    (src.chase && typeof src.chase === "object" && src.chase) ||
    src;
  return {
    ...emptyQuoin(),
    session: asText(nested.session ?? src.session ?? src.sessionKey),
    issue: asIssue(nested.issue ?? src.issue),
    source: asText(nested.source ?? src.source),
    composedBody: asText(nested.composedBody ?? src.composedBody ?? nested.composed ?? src.composed),
    receivedBody: asText(nested.receivedBody ?? src.receivedBody ?? nested.received ?? src.received),
    delimiterQuoted: asBool(nested.delimiterQuoted ?? src.delimiterQuoted, false) === true,
    tool: asText(nested.tool ?? src.tool),
    platform: asText(nested.platform ?? src.platform),
    traceback: asText(nested.traceback ?? src.traceback),
    commandTextCollapse:
      asBool(nested.commandTextCollapse ?? src.commandTextCollapse, false) === true,
    windowsStrip: asBool(nested.windowsStrip ?? src.windowsStrip, false) === true,
    windowsHalve: asBool(nested.windowsHalve ?? src.windowsHalve, false) === true,
    regexChanged: asBool(nested.regexChanged ?? src.regexChanged, false) === true,
    unescapeApplied: asBool(nested.unescapeApplied ?? src.unescapeApplied, false) === true,
    sealedLook: asBool(nested.sealedLook ?? src.sealedLook, false) === true,
    powershellHereString:
      asBool(nested.powershellHereString ?? src.powershellHereString, false) === true,
    scored: asBool(nested.scored ?? src.scored, false) === true,
  };
}

function toolIsBash(quoin) {
  const tool = asText(quoin.tool).toLowerCase();
  return tool === "" || tool === "bash" || tool === "git bash";
}

function toolIsPowerShell(quoin) {
  return /powershell|pwsh/i.test(asText(quoin.tool)) || quoin.powershellHereString === true;
}

export function analyze(quoin = {}) {
  const next = cloneQuoin(quoin);
  const collapse = oneUnescapePass(next.composedBody, next.receivedBody);
  const differ = bodiesDiffer(next.composedBody, next.receivedBody);
  const composedSlashes = countBackslashes(next.composedBody);
  const receivedSlashes = countBackslashes(next.receivedBody);
  const twoVsOne = composedSlashes >= 2 && receivedSlashes === composedSlashes - 1;
  const quotedBash = next.delimiterQuoted === true && toolIsBash(next) && !toolIsPowerShell(next);

  const shiftedShape =
    quotedBash &&
    (collapse === true || (differ === true && twoVsOne === true && next.unescapeApplied === true));

  const misattributedShape =
    shiftedShape !== true &&
    (/unicodeescape|truncated \\U|SyntaxError/i.test(next.traceback) ||
      (/unicodeescape|truncated \\U|SyntaxError/i.test(next.composedBody + next.receivedBody) &&
        next.traceback !== ""));

  const pathBrokeShape =
    shiftedShape !== true &&
    misattributedShape !== true &&
    (next.windowsStrip === true ||
      next.windowsHalve === true ||
      (/windows/i.test(next.platform) &&
        /C:\\|Users\\|\\\\Users/i.test(next.composedBody) &&
        differ === true &&
        quotedBash !== true));

  const regexBrokeShape =
    shiftedShape !== true &&
    misattributedShape !== true &&
    pathBrokeShape !== true &&
    next.regexChanged === true;

  const collapsedShape =
    shiftedShape !== true &&
    misattributedShape !== true &&
    pathBrokeShape !== true &&
    regexBrokeShape !== true &&
    next.commandTextCollapse === true &&
    next.delimiterQuoted !== true;

  const doubleSlashShape =
    shiftedShape !== true &&
    misattributedShape !== true &&
    pathBrokeShape !== true &&
    regexBrokeShape !== true &&
    collapsedShape !== true &&
    differ === true &&
    twoVsOne === true &&
    next.delimiterQuoted !== true;

  const unescapedShape =
    shiftedShape !== true &&
    misattributedShape !== true &&
    pathBrokeShape !== true &&
    regexBrokeShape !== true &&
    collapsedShape !== true &&
    doubleSlashShape !== true &&
    next.unescapeApplied === true &&
    next.delimiterQuoted === true;

  const sealedOpenShape =
    shiftedShape !== true &&
    misattributedShape !== true &&
    pathBrokeShape !== true &&
    regexBrokeShape !== true &&
    collapsedShape !== true &&
    doubleSlashShape !== true &&
    unescapedShape !== true &&
    next.delimiterQuoted === true &&
    next.sealedLook === true &&
    differ === true;

  const lockedHold =
    (next.powershellHereString === true &&
      (next.composedBody === "" || next.composedBody === next.receivedBody) &&
      next.unescapeApplied !== true &&
      collapse !== true) ||
    (next.delimiterQuoted === true &&
      next.composedBody !== "" &&
      next.composedBody === next.receivedBody &&
      next.unescapeApplied !== true &&
      collapse !== true &&
      next.commandTextCollapse !== true &&
      next.windowsStrip !== true &&
      next.windowsHalve !== true &&
      next.regexChanged !== true &&
      next.traceback === "");

  return {
    collapse,
    differ,
    composedSlashes,
    receivedSlashes,
    twoVsOne,
    quotedBash,
    shiftedShape,
    misattributedShape,
    pathBrokeShape,
    regexBrokeShape,
    collapsedShape,
    doubleSlashShape,
    unescapedShape,
    sealedOpenShape,
    lockedHold,
  };
}

export function isIdle(quoin = {}) {
  const next = cloneQuoin(quoin);
  return (
    next.composedBody === "" &&
    next.receivedBody === "" &&
    next.delimiterQuoted !== true &&
    next.traceback === "" &&
    next.commandTextCollapse !== true &&
    next.windowsStrip !== true &&
    next.windowsHalve !== true &&
    next.regexChanged !== true &&
    next.unescapeApplied !== true &&
    next.sealedLook !== true &&
    next.powershellHereString !== true
  );
}

/**
 * First match wins by documented priority:
 * shifted > misattributed > path-broke >
 * regex-broke > collapsed > double-slash >
 * unescaped > sealed-open > locked.
 * Idle locked is first. Seeded #90630
 * numbers must produce shifted,
 * never locked. A shifted form is
 * not a hold.
 */
export function classify(quoin = {}) {
  const next = cloneQuoin(quoin);
  if (isIdle(next)) return "locked";
  const facts = analyze(next);

  if (facts.shiftedShape) return "shifted";
  if (facts.misattributedShape) return "misattributed";
  if (facts.pathBrokeShape) return "path-broke";
  if (facts.regexBrokeShape) return "regex-broke";
  if (facts.collapsedShape) return "collapsed";
  if (facts.doubleSlashShape) return "double-slash";
  if (facts.unescapedShape) return "unescaped";
  if (facts.sealedOpenShape) return "sealed-open";
  if (facts.lockedHold) return "locked";
  return "locked";
}

export function feedOf(quoin = {}, verdict = "") {
  const kind = verdict || classify(quoin);
  if (kind === "shifted") {
    return "● Shifted · one unescape pass · \\\\ collapsed to \\ inside <<'EOF' · primary #90630";
  }
  if (kind === "collapsed") {
    return "● Collapsed · double slash became single in command text · #88561";
  }
  if (kind === "unescaped") {
    return "● Unescaped · transport applied escape processing despite quoted delimiter";
  }
  if (kind === "misattributed") {
    return "● Misattributed · SyntaxError / traceback points at a line the model never wrote · model rewrites Python instead of blaming transport · #90630";
  }
  if (kind === "path-broke") {
    return "● Path-broke · Windows absolute path backslashes corrupted · #89392 / #85856";
  }
  if (kind === "regex-broke") {
    return "● Regex-broke · \\\\d / \\\\\\\\ patterns silently changed · #88561";
  }
  if (kind === "double-slash") {
    return "● Double-slash · probe shows two composed, one arrived";
  }
  if (kind === "sealed-open") {
    return "● Sealed-open · quoted heredoc promise broken · look sealed, body steamed";
  }
  return "● Locked · quoted delimiter held · composed === shell body · no unescape pass · form did not shift · idle word is locked";
}

export function reasonsOf(quoin = {}, verdict = "") {
  const next = cloneQuoin(quoin);
  const kind = verdict || classify(next);
  const facts = analyze(next);
  const reasons = [];
  if (next.session) reasons.push(`session ${next.session}`);
  reasons.push(
    facts.shiftedShape || facts.collapse || facts.differ
      ? `composed slashes ${facts.composedSlashes} · received slashes ${facts.receivedSlashes} · quoted ${next.delimiterQuoted ? "yes" : "no"} · unescape ${facts.collapse || next.unescapeApplied ? "yes" : "no"}`
      : "quoted delimiter held · composed === shell body · no unescape pass · idle word is locked",
  );
  if (facts.shiftedShape) {
    reasons.push(
      "one unescape pass · \\\\ collapsed to \\ inside <<'EOF' · POSIX quoted delimiter should have arrived verbatim · the #90630 harm",
    );
  }
  if (facts.collapse) {
    reasons.push(
      "applyOneUnescapePass(composed) === received · \\\\ is a recognised escape · \\U is left alone",
    );
  }
  if (next.traceback) {
    reasons.push(
      "traceback / unicodeescape points at a source line the model never wrote · rewriting the Python cannot help",
    );
  }
  if (next.windowsStrip || next.windowsHalve) {
    reasons.push(
      "Windows/Git Bash strip or halve · #89392 silent strip · #85856 MSVCRT vs MSYS2 halves every pair",
    );
  }
  if (next.regexChanged) {
    reasons.push("regex \\\\d / \\\\\\\\ pattern silently changed · sed/grep match something else and exit 0");
  }
  if (next.commandTextCollapse) {
    reasons.push("command-text collapse · #88561 · \\\\ → \\ before the shell parses, including inside single quotes");
  }
  if (next.powershellHereString) {
    reasons.push("PowerShell single-quoted here-string @'...'@ control · unaffected · verified workaround");
  }
  if (facts.lockedHold) {
    reasons.push(
      "composed arrived verbatim under a quoted delimiter, or the PowerShell here-string / no-unescape control held",
    );
  }
  reasons.push("a shifted form is not a hold");
  reasons.push(
    "NOT Scant (PATH truncation) / Sear (inert set -e) / Grille (Bash-steered edits) / Assay (tool-arg wire-format) / Stencil (plan fence) / Gaff (timeout-kill false complete) / Spile / Sounder / Leat / leftover woodworking / millimetre-slider.",
  );
  if (kind === "locked") {
    reasons.push(
      "quoted delimiter held; composed === shell body; no unescape pass; form did not shift; idle word is locked",
    );
  }
  if (kind === "shifted") {
    reasons.push(
      "PRIMARY #90630: Bash tool unescapes backslashes inside a quoted heredoc. The shifted case is shifted, never locked.",
    );
  }
  if (kind === "collapsed") {
    reasons.push("double slash became single in command text. #88561.");
  }
  if (kind === "unescaped") {
    reasons.push("transport applied escape processing despite quoted delimiter.");
  }
  if (kind === "misattributed") {
    reasons.push(
      "SyntaxError / traceback points at a line the model never wrote. Model rewrites Python instead of blaming transport.",
    );
  }
  if (kind === "path-broke") {
    reasons.push("Windows absolute path backslashes corrupted. #89392 / #85856.");
  }
  if (kind === "regex-broke") {
    reasons.push("\\\\d / \\\\\\\\ patterns silently changed.");
  }
  if (kind === "double-slash") {
    reasons.push("probe shows two composed, one arrived.");
  }
  if (kind === "sealed-open") {
    reasons.push("quoted heredoc promise broken — look sealed, body steamed.");
  }
  return reasons;
}

export function verdictOf(quoin = {}) {
  return classify(quoin);
}

export function flagsOf(verdict) {
  return {
    slack: SLACK_VERDICTS.includes(verdict),
    linear: LINEAR_VERDICTS.includes(verdict),
    github: true,
    alarm: ALARM_VERDICTS.includes(verdict),
  };
}

export function lockedOf(quoin = {}, verdict = "") {
  const kind = verdict || classify(quoin);
  if (kind !== "locked") return false;
  if (SLACK_VERDICTS.includes(kind)) return false;
  const facts = analyze(quoin);
  if (isIdle(quoin)) return true;
  return facts.lockedHold === true;
}

export function shiftedOf(quoin = {}, verdict = "") {
  return (verdict || classify(quoin)) === "shifted";
}

export function summaryOf(quoin = {}) {
  const next = cloneQuoin(quoin);
  const facts = analyze(next);
  return {
    composedBody: next.composedBody,
    receivedBody: next.receivedBody,
    delimiterQuoted: next.delimiterQuoted,
    tool: next.tool,
    platform: next.platform,
    traceback: next.traceback,
    commandTextCollapse: next.commandTextCollapse,
    windowsStrip: next.windowsStrip,
    windowsHalve: next.windowsHalve,
    regexChanged: next.regexChanged,
    unescapeApplied: next.unescapeApplied,
    sealedLook: next.sealedLook,
    powershellHereString: next.powershellHereString,
    composedSlashes: facts.composedSlashes,
    receivedSlashes: facts.receivedSlashes,
    collapse: facts.collapse,
  };
}

export function score(quoin = {}) {
  const next = cloneQuoin(quoin);
  const verdict = classify(next);
  const facts = analyze(next);
  const flags = flagsOf(verdict);
  return {
    verdict,
    reasons: reasonsOf(next, verdict),
    locked: lockedOf(next, verdict),
    shifted: shiftedOf(next, verdict),
    feed: feedOf(next, verdict),
    slack: flags.slack,
    linear: flags.linear,
    github: flags.github,
    alarm: flags.alarm,
    idleWord: IDLE_WORD,
    state: verdict,
    decision: verdict,
    composedBody: next.composedBody,
    receivedBody: next.receivedBody,
    delimiterQuoted: next.delimiterQuoted,
    tool: next.tool,
    platform: next.platform,
    traceback: next.traceback,
    commandTextCollapse: next.commandTextCollapse,
    windowsStrip: next.windowsStrip,
    windowsHalve: next.windowsHalve,
    regexChanged: next.regexChanged,
    unescapeApplied: next.unescapeApplied,
    sealedLook: next.sealedLook,
    powershellHereString: next.powershellHereString,
    composedSlashes: facts.composedSlashes,
    receivedSlashes: facts.receivedSlashes,
    collapse: facts.collapse,
    summary: summaryOf(next),
    quoin: next,
  };
}

export function readAction(payload = {}) {
  const nested = payload.action && typeof payload.action === "object" ? payload.action : null;
  const src = nested || payload;
  const quoinSrc =
    src.quoin ||
    src.probe ||
    src.payload ||
    src.chase ||
    payload.quoin ||
    payload.probe ||
    payload.chase;
  const quoin = cloneQuoin(
    quoinSrc && typeof quoinSrc === "object" ? { ...quoinSrc, ...src, ...payload } : payload,
  );
  if (typeof src.session === "string" && !quoin.session) quoin.session = src.session;
  if (typeof payload.session === "string" && !quoin.session) quoin.session = payload.session;
  const rawAction = String((nested ? nested.action : payload.action) || "score");
  return {
    action: rawAction,
    session: String(src.session ?? payload.session ?? quoin.session ?? ""),
    quoin,
    issue: src.issue ?? payload.issue ?? quoin.issue ?? null,
    source: src.source ?? payload.source ?? quoin.source ?? "",
  };
}

function quoinResult(verdict, quoin, action, extras = {}) {
  const next = cloneQuoin(quoin);
  const scored = score(next);
  return {
    ok: true,
    product: "quoin",
    verdict,
    state: verdict,
    decision: verdict,
    idleWord: IDLE_WORD,
    alarm: scored.alarm,
    linear: scored.linear,
    slack: scored.slack,
    github: scored.github,
    locked: scored.locked,
    shifted: scored.shifted,
    quoinLocked: verdict === "locked",
    quoinShifted: verdict === "shifted",
    quoinCollapsed: verdict === "collapsed",
    quoinUnescaped: verdict === "unescaped",
    quoinMisattributed: verdict === "misattributed",
    quoinPathBroke: verdict === "path-broke",
    quoinRegexBroke: verdict === "regex-broke",
    quoinDoubleSlash: verdict === "double-slash",
    quoinSealedOpen: verdict === "sealed-open",
    action: action.action,
    session: next.session || action.session || "",
    source: next.source || action.source || "",
    issue: next.issue ?? action.issue ?? null,
    composedBody: scored.composedBody,
    receivedBody: scored.receivedBody,
    delimiterQuoted: scored.delimiterQuoted,
    tool: scored.tool,
    platform: scored.platform,
    traceback: scored.traceback,
    commandTextCollapse: scored.commandTextCollapse,
    windowsStrip: scored.windowsStrip,
    windowsHalve: scored.windowsHalve,
    regexChanged: scored.regexChanged,
    unescapeApplied: scored.unescapeApplied,
    sealedLook: scored.sealedLook,
    powershellHereString: scored.powershellHereString,
    composedSlashes: scored.composedSlashes,
    receivedSlashes: scored.receivedSlashes,
    collapse: scored.collapse,
    feed: scored.feed,
    reasons: scored.reasons,
    summary: scored.summary,
    scored: Boolean(next.scored),
    quoin: next,
    ...extras,
  };
}

function seedQuoin(issue, source, extras = {}) {
  const session = extras.session != null ? String(extras.session) : String(issue);
  const issueId = extras.issue !== undefined ? extras.issue : issue;
  source = extras.source != null ? extras.source : source;
  return {
    action: extras.action || "score",
    session,
    issue: issueId,
    source,
    quoin: {
      ...emptyQuoin(),
      session,
      source,
      issue: issueId,
      scored: extras.scored == null ? true : Boolean(extras.scored),
      composedBody: extras.composedBody != null ? extras.composedBody : "",
      receivedBody: extras.receivedBody != null ? extras.receivedBody : "",
      delimiterQuoted: Boolean(extras.delimiterQuoted),
      tool: extras.tool != null ? extras.tool : "",
      platform: extras.platform != null ? extras.platform : "",
      traceback: extras.traceback != null ? extras.traceback : "",
      commandTextCollapse: Boolean(extras.commandTextCollapse),
      windowsStrip: Boolean(extras.windowsStrip),
      windowsHalve: Boolean(extras.windowsHalve),
      regexChanged: Boolean(extras.regexChanged),
      unescapeApplied: Boolean(extras.unescapeApplied),
      sealedLook: Boolean(extras.sealedLook),
      powershellHereString: Boolean(extras.powershellHereString),
    },
  };
}

/** Idle reset. Quoted delimiter held. Form did not shift. */
export function seedLocked() {
  return seedQuoin("locked", "letterpress", {
    session: "locked",
    issue: null,
    scored: true,
  });
}

export function seedReset() {
  return seedLocked();
}

/**
 * Control / proof: quoted heredoc
 * body arrives verbatim, or
 * PowerShell @'...'@ here-string
 * holds. Classifies as locked;
 * locked true.
 */
export function seedControl() {
  return seedQuoin(FEATURED_ISSUE, "anthropics/claude-code#90630", {
    session: "90630-control",
    issue: null,
    composedBody: DEMO_COMPOSED_90630,
    receivedBody: DEMO_COMPOSED_90630,
    delimiterQuoted: true,
    tool: "Bash",
    unescapeApplied: false,
  });
}

export function seedPowerShell() {
  return seedQuoin(FEATURED_ISSUE, "anthropics/claude-code#90630", {
    session: "90630-powershell",
    issue: null,
    composedBody: DEMO_COMPOSED_90630,
    receivedBody: DEMO_COMPOSED_90630,
    delimiterQuoted: false,
    tool: "PowerShell",
    powershellHereString: true,
    unescapeApplied: false,
  });
}

/**
 * #90630 shifted: quoted delimiter,
 * composed two-backslash line,
 * received one-backslash line, one
 * unescape pass. A shifted form is
 * not a hold. Never locked.
 */
export function seedShifted() {
  return seedQuoin(FEATURED_ISSUE, "anthropics/claude-code#90630", {
    session: "90630-shifted",
    composedBody: DEMO_COMPOSED_90630,
    receivedBody: DEMO_RECEIVED_90630,
    delimiterQuoted: true,
    tool: "Bash",
    platform: "windows",
    unescapeApplied: true,
  });
}

export function seed90630() {
  return seedShifted();
}

/** #88561 command-text collapse without a quoted heredoc pair. */
export function seedCollapsed() {
  return seedQuoin(COLLAPSE_ISSUE, "anthropics/claude-code#88561", {
    session: "88561-collapsed",
    composedBody: "a\\\\b",
    receivedBody: "a\\b",
    delimiterQuoted: false,
    tool: "Bash",
    commandTextCollapse: true,
  });
}

/** Transport applied escape processing despite quoted delimiter. Unique flag. */
export function seedUnescaped() {
  return seedQuoin(FEATURED_ISSUE, "anthropics/claude-code#90630", {
    session: "90630-unescaped",
    delimiterQuoted: true,
    unescapeApplied: true,
    tool: "Bash",
  });
}

/**
 * Python unicodeescape traceback
 * points at a line the model never
 * wrote. Unique: traceback without
 * the quoted-heredoc collapse pair.
 */
export function seedMisattributed() {
  return seedQuoin(FEATURED_ISSUE, "anthropics/claude-code#90630", {
    session: "90630-misattributed",
    composedBody: DEMO_PYTHON_COMPOSED,
    receivedBody: DEMO_PYTHON_RECEIVED,
    delimiterQuoted: false,
    tool: "Bash",
    traceback: DEMO_PYTHON_TRACE,
  });
}

/** #89392 Windows/Git Bash silent strip. */
export function seedPathBroke() {
  return seedQuoin(WINDOWS_STRIP_ISSUE, "anthropics/claude-code#89392", {
    session: "89392-path-broke",
    composedBody: "M\\\\N",
    receivedBody: "M\\N",
    delimiterQuoted: false,
    tool: "Bash",
    platform: "windows",
    windowsStrip: true,
  });
}

/** #85856 MSVCRT vs MSYS2 halve. Same path-broke class, unique flag. */
export function seedWindowsHalve() {
  return seedQuoin(WINDOWS_HALVE_ISSUE, "anthropics/claude-code#85856", {
    session: "85856-halve",
    composedBody: "a\\\\b",
    receivedBody: "a\\b",
    delimiterQuoted: false,
    tool: "Bash",
    platform: "windows",
    windowsHalve: true,
  });
}

/** Regex \\\\d / \\\\\\\\ patterns silently changed. */
export function seedRegexBroke() {
  return seedQuoin(COLLAPSE_ISSUE, "anthropics/claude-code#88561", {
    session: "88561-regex-broke",
    composedBody: "s/a\\\\b/[HIT]/",
    receivedBody: "s/a\\b/[HIT]/",
    delimiterQuoted: false,
    tool: "Bash",
    regexChanged: true,
  });
}

/** Probe shows two composed, one arrived, without quoted delimiter. */
export function seedDoubleSlash() {
  return seedQuoin(FEATURED_ISSUE, "anthropics/claude-code#90630", {
    session: "90630-double-slash",
    composedBody: "C:\\\\Users",
    receivedBody: "C:\\Users",
    delimiterQuoted: false,
    tool: "Bash",
  });
}

/** Quoted heredoc promise broken — look sealed, body steamed. */
export function seedSealedOpen() {
  return seedQuoin(FEATURED_ISSUE, "anthropics/claude-code#90630", {
    session: "90630-sealed-open",
    composedBody: "form locked",
    receivedBody: "form steamed",
    delimiterQuoted: true,
    sealedLook: true,
    tool: "Bash",
  });
}

function extractHeredocBody(text) {
  const match = asText(text).match(/<<\s*'[^']+'\s*\n([\s\S]*?)\n[A-Za-z_][A-Za-z0-9_]*\s*$/m)
    || asText(text).match(/<<\s*'[^']+'\s*\n([\s\S]*?)\nEOF\b/);
  return match ? match[1] : "";
}

function extractActual(text) {
  const match = asText(text).match(/Actual:\s*\n([\s\S]+?)(?:\n\n|$)/i);
  return match ? match[1].trim() : "";
}

export function parseSessionTrace(raw = "") {
  const text = asText(raw).trim();
  if (!text) return emptyQuoin();
  if (text.startsWith("{") || text.startsWith("[")) {
    try {
      const parsed = JSON.parse(text);
      if (Array.isArray(parsed)) {
        return cloneQuoin({ scored: true });
      }
      if (parsed && typeof parsed === "object") {
        return cloneQuoin({ ...parsed, scored: true });
      }
    } catch {
      /* fall through to prose */
    }
  }

  const quoted = /<<\s*'[^']+'/.test(text);
  const powershell = /@'[\s\S]*?'@/.test(text) || /powershell here-string|pwsh/i.test(text);
  const unicode = /unicodeescape|truncated \\U|SyntaxError/i.test(text);
  const collapseCmd = /#88561|printf '%s\\n' 'a\\\\b'|command text/i.test(text);
  const strip = /#89392|silently strips backslashes|M\\\\N/i.test(text);
  const halve = /#85856|halves backslashes|MSVCRT|MSYS2/i.test(text);
  const regex = /regex-broke|#88561.*regex|\\\\d|s\/a\\\\b/i.test(text);
  const locked = /admit locked|quoted delimiter held|composed ===|verbatim|no unescape/i.test(text);

  if (unicode) {
    return {
      ...seedMisattributed().quoin,
      session: "paste-misattributed",
      source: "anthropics/claude-code#90630",
      issue: FEATURED_ISSUE,
      scored: true,
      composedBody: extractHeredocBody(text) || DEMO_PYTHON_COMPOSED,
      receivedBody: DEMO_PYTHON_RECEIVED,
      traceback: text.includes("unicodeescape") ? text : DEMO_PYTHON_TRACE,
    };
  }

  if (quoted && /#90630|one:\s+C:\\Users|two:\s+C:\\\\Users/i.test(text)) {
    const composed = extractHeredocBody(text) || DEMO_COMPOSED_90630;
    const actual = extractActual(text) || DEMO_RECEIVED_90630;
    return {
      ...seedShifted().quoin,
      session: "paste-shifted",
      source: "anthropics/claude-code#90630",
      issue: FEATURED_ISSUE,
      scored: true,
      composedBody: composed,
      receivedBody: actual,
      delimiterQuoted: true,
      unescapeApplied: true,
    };
  }

  if (powershell && !unicode) {
    return {
      ...seedPowerShell().quoin,
      session: "paste-powershell",
      source: "paste",
      scored: true,
    };
  }

  if (regex && !quoted) {
    return {
      ...seedRegexBroke().quoin,
      session: "paste-regex-broke",
      source: "anthropics/claude-code#88561",
      issue: COLLAPSE_ISSUE,
      scored: true,
    };
  }

  if (halve && !quoted) {
    return {
      ...seedWindowsHalve().quoin,
      session: "paste-halve",
      source: "anthropics/claude-code#85856",
      issue: WINDOWS_HALVE_ISSUE,
      scored: true,
    };
  }

  if (strip && !quoted) {
    return {
      ...seedPathBroke().quoin,
      session: "paste-path-broke",
      source: "anthropics/claude-code#89392",
      issue: WINDOWS_STRIP_ISSUE,
      scored: true,
    };
  }

  if (collapseCmd && !quoted) {
    return {
      ...seedCollapsed().quoin,
      session: "paste-collapsed",
      source: "anthropics/claude-code#88561",
      issue: COLLAPSE_ISSUE,
      scored: true,
    };
  }

  if (quoted && /sealed-open|body steamed|promise broken/i.test(text)) {
    return {
      ...seedSealedOpen().quoin,
      session: "paste-sealed-open",
      source: "paste",
      scored: true,
    };
  }

  if (locked) {
    return { ...seedLocked().quoin, session: "paste-locked", source: "paste", scored: true };
  }

  if (quoted) {
    const composed = extractHeredocBody(text);
    const actual = extractActual(text);
    if (composed && actual && oneUnescapePass(composed, actual)) {
      return {
        ...emptyQuoin(),
        session: "paste-shifted",
        source: "paste",
        issue: FEATURED_ISSUE,
        scored: true,
        composedBody: composed,
        receivedBody: actual,
        delimiterQuoted: true,
        tool: "Bash",
        unescapeApplied: true,
      };
    }
    if (composed && (actual === composed || (actual === "" && !/Actual:/i.test(text)))) {
      return {
        ...emptyQuoin(),
        session: "paste-quoted",
        source: "paste",
        scored: true,
        composedBody: composed,
        receivedBody: actual || composed,
        delimiterQuoted: true,
        tool: "Bash",
      };
    }
  }

  return { ...emptyQuoin(), session: "paste", source: "paste", scored: true };
}

export function parseJsonl(raw = "") {
  return parseSessionTrace(raw);
}

export function parseProbe(raw = "") {
  return parseSessionTrace(raw);
}

const SEEDS = {
  locked: seedLocked,
  control: seedControl,
  powershell: seedPowerShell,
  "powershell-control": seedPowerShell,
  shifted: seedShifted,
  90630: seed90630,
  "90630-shifted": seedShifted,
  collapsed: seedCollapsed,
  88561: seedCollapsed,
  unescaped: seedUnescaped,
  misattributed: seedMisattributed,
  "path-broke": seedPathBroke,
  pathbroke: seedPathBroke,
  89392: seedPathBroke,
  halve: seedWindowsHalve,
  85856: seedWindowsHalve,
  "regex-broke": seedRegexBroke,
  regexbroke: seedRegexBroke,
  "double-slash": seedDoubleSlash,
  doubleslash: seedDoubleSlash,
  "sealed-open": seedSealedOpen,
  sealedopen: seedSealedOpen,
  reset: seedReset,
  idle: seedReset,
  healthy: seedControl,
  letterpress: seedControl,
  chase: seedControl,
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
  let quoin = cloneQuoin(action.quoin);
  const verb = String(action.action || "score").toLowerCase();

  if (
    verb === "bail" ||
    verb === "locked" ||
    verb === "still" ||
    verb === "rest" ||
    verb === "reset"
  ) {
    return quoinResult("locked", emptyQuoin(), {
      ...action,
      action: verb === "still" || verb === "rest" || verb === "reset" ? "bail" : verb,
    });
  }

  if (
    verb === "control" ||
    verb === "healthy" ||
    verb === "proof" ||
    verb === "letterpress" ||
    verb === "chase"
  ) {
    quoin = seedControl().quoin;
    return quoinResult(classify(quoin), quoin, { ...action, action: "control" });
  }

  if (verb === "powershell" || verb === "pwsh") {
    quoin = seedPowerShell().quoin;
    return quoinResult(classify(quoin), quoin, { ...action, action: "powershell" });
  }

  if (verb === "restore" || verb === "shifted" || verb === "incident" || verb === "90630") {
    quoin = seedShifted().quoin;
    return quoinResult(classify(quoin), quoin, {
      ...action,
      action: verb === "restore" ? "restore" : verb,
    });
  }

  if (verb === "observe" || verb === "trace" || verb === "ledger" || verb === "score-chase") {
    quoin = { ...quoin, scored: true };
    return quoinResult(classify(quoin), quoin, {
      ...action,
      action: verb === "observe" ? "ledger" : verb,
    });
  }

  if (verb === "press" || verb === "admit" || verb === "score" || verb === "throw" || verb === "make") {
    quoin = { ...quoin, scored: true };
    return quoinResult(classify(quoin), quoin, {
      ...action,
      action: verb === "press" || verb === "throw" || verb === "make" ? "score" : verb,
    });
  }

  quoin = { ...quoin, scored: true };
  return quoinResult(classify(quoin), quoin, action);
}
