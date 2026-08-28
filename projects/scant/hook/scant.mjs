/**
 * Scant — timber scantling yard / measuring bench for Claude Code
 * on Windows Desktop: the Bash tool's shell snapshot is silently
 * truncated at ~7.2 KB (≈ Windows cmd.exe 8191 command-line limit)
 * when plugin PATH bloat pushes the snapshot past that wall.
 * Truncation cuts mid-`export PATH='...'` so the quote never closes.
 * Every subsequent Bash call fails with unexpected EOF while looking
 * for matching `'`. On-disk repair of the snapshot file does not
 * heal the session (content is captured in memory). Deleting the
 * snapshot makes commands silently no-op (exit 0, no output).
 * Disabling plugins "fixes" it — not viable. A written shell
 * snapshot is not a hold. Score the board or admit fit.
 *
 * Primary #90421: filed 2026-08-28, has repro. Shell snapshot
 * silently truncated at 7187–7195 bytes on Windows Desktop; every
 * Bash fails unexpected EOF. Truncation size + wrapper ≈ 8191.
 *
 * Verdicts: fit | scant | clipped | open | poisoned | bloated
 *           | stubbed | mute | sealed | true
 * Idle word is fit (board true to length; snapshot closes clean).
 * NEVER use the product name scant as the idle/state word.
 * NEVER use empty.
 * NEVER reuse Chad spoilt, Kist laid, Wraith unlinked, Gasket tight,
 * Damper banked, Cote roosted, Larder stocked, Tappet seated,
 * Aside heard, Chute clear, Tain paired, Husk kernel, Snib latched,
 * Veto upheld, Assay sterling, Wicket home, Sigil valid, Stencil dry,
 * Suture sealed (as idle), Reveille quiet, Livery seised.
 * Do not ship Kerf, Crop, Stump, Snip, Quill, Nib, Trunc, or Ferrule
 * as product names this hour. Product name is Scant only.
 *
 * Slack scant alarm on scant / clipped / poisoned / bloated.
 * Linear scantling ticket on poisoned / clipped.
 * GitHub scant-ledger of board events on every scored probe.
 *
 * Why this is not a clone:
 * NOT Larder (plugin-store freeze: sync stamp advances, folders
 * stand still). Larder is marketplace sync lying green; Scant is
 * snapshot writer clipping PATH so Bash dies.
 * NOT Reed (MCP tool-registry death / four contacts). Reed is
 * registry vs connected; Scant is shell-snapshot length.
 * NOT Assay (tool-arg furnace / parse corruption). Assay is
 * wire-format impurity; Scant is PATH truncation at OS cmdline limit.
 * NOT Quench (token-burn fuse). Quench kills on spend; Scant
 * diagnoses truncated shell env.
 * NOT Wraith (live binary unlink mid-session). Wraith is image
 * pruned under grants; Scant is snapshot clipped under plugins.
 * NOT Chad / Kist / Gasket / Damper / Cote / Tappet / Aside /
 * Chute / Tain / Husk / Snib / Veto / Wicket / Sigil / Stencil /
 * Suture / Blot / Coda / Fathom / Hasp / Parity / Reveille /
 * Scrim / Knock.
 * NOT leftover woodworking / millimetre-slider clones. Scantling
 * is a timber-yard metaphor for a diagnostic desk, not a leftover
 * instrument.
 * Different problem: snapshot writer clips PATH at the Windows
 * cmdline wall so Bash dies.
 * Different UI: timber scantling yard / lumber rack / measuring
 * bench. Sawdust, chalk marks, steel rule, end-grain stamps.
 * Different idle word: fit.
 */

export const VERDICTS = Object.freeze([
  "fit",
  "scant",
  "clipped",
  "open",
  "poisoned",
  "bloated",
  "stubbed",
  "mute",
  "sealed",
  "true",
]);
export const IDLE_WORD = "fit";
export const SLACK_VERDICTS = Object.freeze(["scant", "clipped", "poisoned", "bloated"]);
export const LINEAR_VERDICTS = Object.freeze(["poisoned", "clipped"]);
export const ALARM_VERDICTS = SLACK_VERDICTS;

export const SNAPSHOT_WALL_LO = 7187;
export const SNAPSHOT_WALL_HI = 7195;
export const SNAPSHOT_WALL = 7191;
export const CMDLINE_LIMIT = 8191;
export const PLUGIN_PATH_CHARS = 105;
export const WRAPPER_OVERHEAD = CMDLINE_LIMIT - SNAPSHOT_WALL;

const FORBIDDEN_IDLE = Object.freeze([
  "scant",
  "empty",
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
  "livery",
  "chad",
  "kist",
  "wraith",
  "gasket",
  "damper",
  "cote",
  "nixie",
  "knock",
  "larder",
  "reed",
  "assay",
  "quench",
  "kerf",
  "crop",
  "stump",
  "snip",
  "quill",
  "nib",
  "trunc",
  "ferrule",
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

function asBool(value, fallback = false) {
  if (value == null) return fallback;
  if (typeof value === "string") {
    const s = value.trim().toLowerCase();
    if (s === "" || s === "false" || s === "0" || s === "off" || s === "no") {
      return false;
    }
    return true;
  }
  return Boolean(value);
}

function asInt(value, fallback = 0) {
  if (value == null || value === "") return fallback;
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

export function utf8Bytes(text) {
  const s = String(text ?? "");
  if (typeof Buffer !== "undefined") return Buffer.byteLength(s, "utf8");
  return new TextEncoder().encode(s).length;
}

export function cutToBytes(text, n) {
  const s = String(text ?? "");
  if (n <= 0) return "";
  if (typeof Buffer !== "undefined") {
    const buf = Buffer.from(s, "utf8");
    if (buf.length <= n) return s;
    return buf.subarray(0, n).toString("utf8");
  }
  const enc = new TextEncoder();
  const dec = new TextDecoder();
  const buf = enc.encode(s);
  if (buf.length <= n) return s;
  return dec.decode(buf.slice(0, n));
}

/**
 * Each enabled plugin contributes an entry like
 * .../AppData/Roaming/Claude/local-agent-mode-sessions//plugin_/bin
 * (~105 chars each). #90421.
 */
export function pluginPathEntry(i) {
  const stem = `/c/Users/dev/AppData/Roaming/Claude/local-agent-mode-sessions//plugin_${String(i).padStart(2, "0")}/bin`;
  if (stem.length >= PLUGIN_PATH_CHARS) return stem.slice(0, PLUGIN_PATH_CHARS);
  return `${stem}${"/x".repeat(PLUGIN_PATH_CHARS)}`.slice(0, PLUGIN_PATH_CHARS);
}

export function makePath(pluginCount = 35) {
  const plugins = Array.from({ length: pluginCount }, (_, i) => pluginPathEntry(i));
  const base = "/c/Program Files/Git/usr/bin:/c/Program Files/Git/bin:/c/Windows/System32:/c/Windows";
  return [...plugins, base].join(":");
}

/**
 * Realistic snapshot preamble (other exports + plugin meta).
 * PATH itself is what crosses the 7.2KB wall in #90421; the
 * preamble sits the cut face mid-PATH after ~4KB of env.
 */
export function snapshotPreamble() {
  const lines = [
    "# claude-code shell-snapshot",
    "# windows desktop / git bash",
    "umask 022",
    "export HOME='/c/Users/dev'",
    "export USER='dev'",
    "export SHELL='/usr/bin/bash'",
    "export TERM='xterm-256color'",
    "export LANG='en_US.UTF-8'",
  ];
  for (let i = 0; i < 40; i += 1) {
    const n = String(i).padStart(2, "0");
    lines.push(
      `export CLAUDE_PLUGIN_META_${n}='/c/Users/dev/AppData/Roaming/Claude/local-agent-mode-sessions//meta_${n}'`,
    );
  }
  return `${lines.join("\n")}\n`;
}

export function makeSnapshotBody(path, { closeQuote = true, newline = true, preamble = true } = {}) {
  const head = preamble
    ? snapshotPreamble()
    : ["# claude-code shell-snapshot", "# windows desktop / git bash", "umask 022", "export HOME='/c/Users/dev'", "export USER='dev'"].join("\n") + "\n";
  const line = `export PATH='${path}${closeQuote ? "'" : ""}`;
  const body = `${head}${line}`;
  return newline && closeQuote ? `${body}\n` : body;
}

export function detectUnclosedPathQuote(text) {
  const s = String(text ?? "");
  const idx = s.lastIndexOf("export PATH=");
  if (idx < 0) return false;
  const after = s.slice(idx + "export PATH=".length);
  const quote = after[0];
  if (quote !== "'" && quote !== '"') return false;
  const rest = after.slice(1);
  for (let i = 0; i < rest.length; i += 1) {
    if (rest[i] === "\\") {
      i += 1;
      continue;
    }
    if (rest[i] === quote) return false;
  }
  return true;
}

export function pathBreakIndex(text) {
  const s = String(text ?? "");
  const idx = s.lastIndexOf("export PATH=");
  if (idx < 0) return -1;
  const after = s.slice(idx + "export PATH=".length);
  const quote = after[0];
  if (quote !== "'" && quote !== '"') return -1;
  const rest = after.slice(1);
  for (let i = 0; i < rest.length; i += 1) {
    if (rest[i] === "\\") {
      i += 1;
      continue;
    }
    if (rest[i] === quote) return -1;
  }
  return s.length;
}

export function endsMidPathSegment(text) {
  const s = String(text ?? "");
  if (!s || s.endsWith("\n")) return false;
  if (!detectUnclosedPathQuote(s)) return false;
  const last = s[s.length - 1];
  return /[A-Za-z0-9_/\-]/.test(last);
}

export function endsMidEntry(text) {
  const s = String(text ?? "");
  if (!s || s.endsWith("\n") || s.endsWith("'") || s.endsWith('"')) return false;
  const lastLine = s.split("\n").pop() || "";
  if (/^export\s+\w+=['"]/.test(lastLine) && !/['"]$/.test(lastLine)) return true;
  if (/^export\s+\w+$/.test(lastLine) || /^export\s+\w+=$/.test(lastLine)) return true;
  return endsMidPathSegment(s);
}

export function hitSnapshotWall(bytes) {
  return bytes >= SNAPSHOT_WALL_LO;
}

export function inspectSnapshot(text) {
  const snapshot = asText(text);
  const bytes = utf8Bytes(snapshot);
  const unclosedPathQuote = detectUnclosedPathQuote(snapshot);
  const breakAt = pathBreakIndex(snapshot);
  const midPath = endsMidPathSegment(snapshot);
  return {
    snapshot,
    bytes,
    unclosedPathQuote,
    truncatedMidPath: midPath,
    endsMidEntry: endsMidEntry(snapshot),
    hitWall: hitSnapshotWall(bytes),
    pathBreakAt: breakAt,
    wallLo: SNAPSHOT_WALL_LO,
    wallHi: SNAPSHOT_WALL_HI,
    wall: SNAPSHOT_WALL,
    cmdlineLimit: CMDLINE_LIMIT,
    wrapperOverhead: WRAPPER_OVERHEAD,
    wouldFit: Boolean(snapshot) && bytes < SNAPSHOT_WALL_LO && !unclosedPathQuote,
  };
}

export function emptyProbe() {
  return {
    snapshot: "",
    bytes: 0,
    measuredFullLength: 0,
    pluginCount: 0,
    pluginPathBytes: 0,
    unclosedPathQuote: false,
    truncatedMidPath: false,
    hitWall: false,
    pluginPathBloat: false,
    endsMidEntry: false,
    snapshotDeleted: false,
    silentNoOpBash: false,
    onDiskRepairAttempted: false,
    sessionStillDead: false,
    bashUnexpectedEof: false,
    observed: false,
    session: "",
    source: "",
    issue: null,
    scored: false,
  };
}

export function emptyAction(session = "fit-1") {
  return {
    action: "score",
    session,
    probe: emptyProbe(),
  };
}

function deriveFromSnapshot(snapshot, extras = {}) {
  const inspected = inspectSnapshot(snapshot);
  if (snapshot) {
    return {
      bytes: asInt(extras.bytes, 0) > 0 ? asInt(extras.bytes) : inspected.bytes,
      unclosedPathQuote: inspected.unclosedPathQuote || asBool(extras.unclosedPathQuote),
      truncatedMidPath: inspected.truncatedMidPath || asBool(extras.truncatedMidPath),
      hitWall: inspected.hitWall || asBool(extras.hitWall),
      endsMidEntry: inspected.endsMidEntry || asBool(extras.endsMidEntry),
    };
  }
  return {
    bytes: asInt(extras.bytes, 0),
    unclosedPathQuote: asBool(extras.unclosedPathQuote),
    truncatedMidPath: asBool(extras.truncatedMidPath),
    hitWall: asBool(extras.hitWall),
    endsMidEntry: asBool(extras.endsMidEntry),
  };
}

export function cloneProbe(raw = {}) {
  const src = raw && typeof raw === "object" ? raw : emptyProbe();
  const board = src.board && typeof src.board === "object" ? src.board : {};
  const yard = src.yard && typeof src.yard === "object" ? src.yard : {};
  const rack = src.rack && typeof src.rack === "object" ? src.rack : {};
  const slab = src.slab && typeof src.slab === "object" ? src.slab : {};
  const pick = (key) => src[key] ?? board[key] ?? yard[key] ?? rack[key] ?? slab[key];
  const snapshot = asText(pick("snapshot"));
  const derived = deriveFromSnapshot(snapshot, {
    bytes: pick("bytes"),
    unclosedPathQuote: pick("unclosedPathQuote"),
    truncatedMidPath: pick("truncatedMidPath"),
    hitWall: pick("hitWall"),
    endsMidEntry: pick("endsMidEntry"),
  });
  return {
    ...emptyProbe(),
    snapshot,
    bytes: derived.bytes,
    measuredFullLength: asInt(pick("measuredFullLength"), 0),
    pluginCount: asInt(pick("pluginCount"), 0),
    pluginPathBytes: asInt(pick("pluginPathBytes"), 0),
    unclosedPathQuote: derived.unclosedPathQuote,
    truncatedMidPath: derived.truncatedMidPath,
    hitWall: derived.hitWall,
    pluginPathBloat: asBool(pick("pluginPathBloat")),
    endsMidEntry: derived.endsMidEntry,
    snapshotDeleted: asBool(pick("snapshotDeleted")),
    silentNoOpBash: asBool(pick("silentNoOpBash")),
    onDiskRepairAttempted: asBool(pick("onDiskRepairAttempted")),
    sessionStillDead: asBool(pick("sessionStillDead")),
    bashUnexpectedEof: asBool(pick("bashUnexpectedEof")),
    observed: asBool(src.observed ?? board.observed ?? yard.observed ?? rack.observed),
    session: typeof src.session === "string" ? src.session : asText(src.sessionKey),
    source: asText(src.source ?? board.source ?? yard.source ?? rack.source),
    issue: asIssue(src.issue ?? board.issue ?? yard.issue ?? rack.issue),
    scored: asBool(src.scored ?? board.scored ?? yard.scored ?? rack.scored),
  };
}

export function isIdle(probe = {}) {
  const next = cloneProbe(probe);
  return (
    !next.snapshot &&
    !next.bytes &&
    !next.measuredFullLength &&
    !next.pluginCount &&
    !next.pluginPathBytes &&
    !next.unclosedPathQuote &&
    !next.truncatedMidPath &&
    !next.hitWall &&
    !next.pluginPathBloat &&
    !next.endsMidEntry &&
    !next.snapshotDeleted &&
    !next.silentNoOpBash &&
    !next.onDiskRepairAttempted &&
    !next.sessionStillDead &&
    !next.bashUnexpectedEof &&
    !next.observed
  );
}

/**
 * First match wins. Idle fit is first. Classes stay distinguishable:
 * a written shell snapshot is not a hold. This is PATH truncation
 * at the Windows cmdline wall.
 * NOT Larder (sync stamp). NOT Reed (MCP contacts). NOT Assay
 * (tool-arg impurity). NOT Quench (spend fuse). NOT Wraith
 * (live-image unlink). NOT leftover woodworking.
 */
export function classify(probe = {}) {
  const next = cloneProbe(probe);
  if (isIdle(next)) return "fit";
  if (next.snapshotDeleted || next.silentNoOpBash) return "mute";
  if (next.onDiskRepairAttempted && next.sessionStillDead) return "sealed";
  if (next.bashUnexpectedEof) return "poisoned";
  if (next.truncatedMidPath && next.unclosedPathQuote) return "scant";
  if (next.hitWall) return "clipped";
  if (next.unclosedPathQuote) return "open";
  if (next.pluginPathBloat) return "bloated";
  if (next.endsMidEntry) return "stubbed";
  if (next.snapshot && next.bytes < SNAPSHOT_WALL_LO && !next.unclosedPathQuote) return "true";
  return "fit";
}

export function clusterOf(probe = {}, verdict = "") {
  const next = cloneProbe(probe);
  const kind = verdict || classify(next);
  const cluster = [];
  const add = (word) => {
    if (word && word !== kind && !cluster.includes(word)) cluster.push(word);
  };
  if (next.hitWall) add("clipped");
  if (next.unclosedPathQuote) add("open");
  if (next.pluginPathBloat) add("bloated");
  if (next.endsMidEntry || next.truncatedMidPath) add("stubbed");
  if (next.bashUnexpectedEof) add("poisoned");
  if (next.snapshotDeleted || next.silentNoOpBash) add("mute");
  if (next.onDiskRepairAttempted && next.sessionStillDead) add("sealed");
  return cluster;
}

export function feedOf(probe = {}, verdict = "") {
  const kind = verdict || classify(probe);
  if (kind === "scant") {
    return "● Scant · truncated mid-PATH · unclosed quote · board cut short of the stamp";
  }
  if (kind === "clipped") {
    return "● Clipped · hit the ~8191 / ~7.2KB wall · truncation size + wrapper ≈ cmdline limit";
  }
  if (kind === "open") {
    return "● Open · unclosed PATH quote detected · the matching ' never arrives";
  }
  if (kind === "poisoned") {
    return "● Poisoned · every Bash call fails unexpected EOF while looking for matching '";
  }
  if (kind === "bloated") {
    return "● Bloated · plugin PATH contribution pushed length over the wall";
  }
  if (kind === "stubbed") {
    return "● Stubbed · file ends mid-entry / mid-PATH segment · no trailing newline";
  }
  if (kind === "mute") {
    return "● Mute · snapshot deleted · Bash is a silent no-op · exit 0, no output";
  }
  if (kind === "sealed") {
    return "● Sealed · on-disk repair attempted · session still dead · in-memory capture";
  }
  if (kind === "true") {
    return "● True · measured full length would have fit under the wall · quote closed";
  }
  return "● Fit · board true to length · snapshot closes clean · idle word is fit";
}

export function reasonsOf(probe = {}, verdict = "") {
  const next = cloneProbe(probe);
  const kind = verdict || classify(next);
  const reasons = [];
  if (next.session) reasons.push(`session ${next.session}`);
  reasons.push(
    next.snapshot
      ? `snapshot ${next.bytes} bytes vs wall ${SNAPSHOT_WALL_LO}–${SNAPSHOT_WALL_HI} / cmdline ${CMDLINE_LIMIT}`
      : "no snapshot on this board",
  );
  if (next.measuredFullLength) {
    reasons.push(
      `measured full length ${next.measuredFullLength} bytes${next.measuredFullLength < SNAPSHOT_WALL_LO ? " would have fit" : " would have exceeded the wall"}`,
    );
  }
  if (next.pluginCount) {
    reasons.push(
      `${next.pluginCount} plugins × ~${PLUGIN_PATH_CHARS} chars${next.pluginPathBytes ? ` (${next.pluginPathBytes} PATH bytes)` : ""}`,
    );
  }
  reasons.push(
    next.unclosedPathQuote
      ? "export PATH=' is unclosed — the matching quote never arrives"
      : "PATH quote is closed or PATH export is absent",
  );
  reasons.push(
    next.truncatedMidPath
      ? "truncation cuts mid-PATH / mid-entry, no trailing newline"
      : "file does not end mid-PATH segment",
  );
  reasons.push(
    next.hitWall
      ? `hit the ~7.2KB wall (${next.bytes} ≥ ${SNAPSHOT_WALL_LO}); wrapper overhead ≈ ${WRAPPER_OVERHEAD} → ${CMDLINE_LIMIT}`
      : "length is under the 7187-byte wall",
  );
  if (next.pluginPathBloat) {
    reasons.push("plugin PATH bloat pushed the snapshot over the wall");
  }
  if (next.endsMidEntry) {
    reasons.push("file ends mid-entry / mid-PATH segment");
  }
  if (next.snapshotDeleted || next.silentNoOpBash) {
    reasons.push("snapshot deleted; Bash silently no-ops (exit 0, no output)");
  }
  if (next.onDiskRepairAttempted) {
    reasons.push(
      next.sessionStillDead
        ? "on-disk repair attempted; session still dead — content was captured in memory"
        : "on-disk repair attempted",
    );
  }
  if (next.bashUnexpectedEof) {
    reasons.push("every Bash call fails: unexpected EOF while looking for matching '");
  }
  if (next.observed) {
    reasons.push("Yard checked the board: byte length, PATH quote, wall, plugin bloat");
  }
  reasons.push("a written shell snapshot is not a hold");
  reasons.push(
    "NOT Larder (sync stamp) / Reed (MCP contacts) / Assay (tool-arg impurity) / Quench (spend fuse) / Wraith (live-image unlink) / Chad / leftover woodworking / millimetre-slider",
  );
  if (kind === "fit") {
    reasons.push("board true to length or desk idle; idle word is fit");
  }
  if (kind === "scant") {
    reasons.push(
      "PRIMARY #90421: shell snapshot silently truncated at 7187–7195 bytes on Windows Desktop; export PATH=' cut mid-entry; quote never closes",
    );
  }
  if (kind === "clipped") {
    reasons.push(
      "PRIMARY #90421 contrast: truncation size + wrapper ≈ 8191, the Windows cmd.exe command-line length limit",
    );
  }
  if (kind === "open") {
    reasons.push("unclosed PATH quote detected; matching ' never arrives");
  }
  if (kind === "poisoned") {
    reasons.push(
      "PRIMARY #90421: /usr/bin/bash: -c: unexpected EOF while looking for matching '; every Bash call fails for the session",
    );
  }
  if (kind === "bloated") {
    reasons.push(
      "PRIMARY #90421: ~35 plugins × ~105 chars; full snapshot would be 9–10 KB; plugin PATH pushed length over the wall",
    );
  }
  if (kind === "stubbed") {
    reasons.push("file ends mid-entry / mid-PATH segment; no trailing newline");
  }
  if (kind === "mute") {
    reasons.push("PRIMARY #90421: deleting the snapshot makes commands silently no-op (exit 0, no output)");
  }
  if (kind === "sealed") {
    reasons.push(
      "PRIMARY #90421: repairing the file on disk does not recover the running session — truncated content is captured in memory",
    );
  }
  if (kind === "true") {
    reasons.push("measured full length would have fit under the wall; PATH quote closed; Bash would work");
  }
  const cluster = clusterOf(next, kind);
  if (cluster.length) {
    reasons.push(`supporting cluster: ${cluster.join(", ")}`);
  }
  return reasons;
}

export function verdictOf(probe = {}) {
  return classify(probe);
}

export function flagsOf(verdict) {
  return {
    slack: SLACK_VERDICTS.includes(verdict),
    linear: LINEAR_VERDICTS.includes(verdict),
    github: true,
    alarm: ALARM_VERDICTS.includes(verdict),
  };
}

export function fitOf(probe = {}, verdict = "") {
  return (verdict || classify(probe)) === "fit";
}

export function scantOf(probe = {}, verdict = "") {
  return (verdict || classify(probe)) === "scant";
}

export function clippedOf(probe = {}, verdict = "") {
  return (verdict || classify(probe)) === "clipped";
}

/**
 * score(probe) → { verdict, reasons[], cluster[], fit, scant, clipped, measure }
 * Deterministic. First match wins. Idle fit first.
 */
export function score(probe = {}) {
  const next = cloneProbe(probe);
  const verdict = classify(next);
  const flags = flagsOf(verdict);
  const cluster = clusterOf(next, verdict);
  const measure = inspectSnapshot(next.snapshot);
  return {
    verdict,
    reasons: reasonsOf(next, verdict),
    cluster,
    fit: fitOf(next, verdict),
    scant: scantOf(next, verdict),
    clipped: clippedOf(next, verdict),
    feed: feedOf(next, verdict),
    slack: flags.slack,
    linear: flags.linear,
    github: flags.github,
    alarm: flags.alarm,
    idleWord: IDLE_WORD,
    state: verdict,
    decision: verdict,
    measure,
    probe: next,
  };
}

export function readAction(payload = {}) {
  const nested = payload.action && typeof payload.action === "object" ? payload.action : null;
  const src = nested || payload;
  const probeSrc = src.probe && typeof src.probe === "object" ? src.probe : payload.probe;
  const fromFields = probeSrc && typeof probeSrc === "object" ? probeSrc : src;
  const pick = (key) => fromFields[key] ?? src[key] ?? payload[key];
  const probe = cloneProbe({
    snapshot: pick("snapshot"),
    bytes: pick("bytes"),
    measuredFullLength: pick("measuredFullLength"),
    pluginCount: pick("pluginCount"),
    pluginPathBytes: pick("pluginPathBytes"),
    unclosedPathQuote: pick("unclosedPathQuote"),
    truncatedMidPath: pick("truncatedMidPath"),
    hitWall: pick("hitWall"),
    pluginPathBloat: pick("pluginPathBloat"),
    endsMidEntry: pick("endsMidEntry"),
    snapshotDeleted: pick("snapshotDeleted"),
    silentNoOpBash: pick("silentNoOpBash"),
    onDiskRepairAttempted: pick("onDiskRepairAttempted"),
    sessionStillDead: pick("sessionStillDead"),
    bashUnexpectedEof: pick("bashUnexpectedEof"),
    observed: pick("observed"),
    session: pick("session"),
    source: pick("source"),
    issue: pick("issue"),
    scored: pick("scored"),
    board: fromFields.board,
    yard: fromFields.yard,
    rack: fromFields.rack,
    slab: fromFields.slab,
    sessionKey: typeof src.session === "string" ? src.session : undefined,
  });
  if (typeof src.session === "string" && !probe.session) probe.session = src.session;
  if (typeof payload.session === "string" && !probe.session) {
    probe.session = payload.session;
  }
  const rawAction = String((nested ? nested.action : payload.action) || "score");
  return {
    action: rawAction,
    session: String(src.session ?? payload.session ?? probe.session ?? ""),
    probe,
    issue: src.issue ?? payload.issue ?? probe.issue ?? null,
    source: src.source ?? payload.source ?? probe.source ?? "",
  };
}

function pack(verdict, probe, action, extras = {}) {
  const next = cloneProbe(probe);
  const scored = score(next);
  return {
    ok: true,
    product: "scant",
    verdict,
    state: verdict,
    decision: verdict,
    idleWord: IDLE_WORD,
    alarm: scored.alarm,
    linear: scored.linear,
    slack: scored.slack,
    github: scored.github,
    fit: scored.fit,
    scant: scored.scant,
    clipped: scored.clipped,
    cluster: scored.cluster,
    measure: scored.measure,
    boardFit: verdict === "fit",
    boardScant: verdict === "scant",
    boardClipped: verdict === "clipped",
    boardOpen: verdict === "open",
    boardPoisoned: verdict === "poisoned",
    boardBloated: verdict === "bloated",
    boardStubbed: verdict === "stubbed",
    boardMute: verdict === "mute",
    boardSealed: verdict === "sealed",
    boardTrue: verdict === "true",
    action: action.action,
    session: next.session || action.session || "",
    source: next.source || action.source || "",
    issue: next.issue ?? action.issue ?? null,
    snapshot: next.snapshot,
    bytes: next.bytes,
    measuredFullLength: next.measuredFullLength,
    pluginCount: next.pluginCount,
    pluginPathBytes: next.pluginPathBytes,
    unclosedPathQuote: next.unclosedPathQuote,
    truncatedMidPath: next.truncatedMidPath,
    hitWall: next.hitWall,
    pluginPathBloat: next.pluginPathBloat,
    endsMidEntry: next.endsMidEntry,
    snapshotDeleted: next.snapshotDeleted,
    silentNoOpBash: next.silentNoOpBash,
    onDiskRepairAttempted: next.onDiskRepairAttempted,
    sessionStillDead: next.sessionStillDead,
    bashUnexpectedEof: next.bashUnexpectedEof,
    observed: next.observed,
    feed: scored.feed,
    reasons: scored.reasons,
    scored: Boolean(next.scored),
    probe: next,
    ...extras,
  };
}

function seedProbe(issue, source, extras = {}) {
  const session = extras.session != null ? String(extras.session) : String(issue);
  const issueId = extras.issue !== undefined ? extras.issue : issue;
  const snapshot = extras.snapshot != null ? String(extras.snapshot) : "";
  return {
    action: extras.action || "score",
    session,
    issue: issueId,
    source,
    probe: {
      ...emptyProbe(),
      session,
      source,
      issue: issueId,
      snapshot,
      measuredFullLength: asInt(extras.measuredFullLength, 0),
      pluginCount: asInt(extras.pluginCount, 0),
      pluginPathBytes: asInt(extras.pluginPathBytes, 0),
      pluginPathBloat: Boolean(extras.pluginPathBloat),
      snapshotDeleted: Boolean(extras.snapshotDeleted),
      silentNoOpBash: Boolean(extras.silentNoOpBash),
      onDiskRepairAttempted: Boolean(extras.onDiskRepairAttempted),
      sessionStillDead: Boolean(extras.sessionStillDead),
      bashUnexpectedEof: Boolean(extras.bashUnexpectedEof),
      observed: Boolean(extras.observed),
      scored: extras.scored == null ? true : Boolean(extras.scored),
    },
  };
}

/** Idle / racked. Board true to length. Nothing scored. */
export function seedFit() {
  return seedProbe("fit", "yard", {
    session: "fit",
    issue: null,
    scored: true,
  });
}

/**
 * PRIMARY #90421 scant.
 * Snapshot silently truncated at ~7191 bytes mid-PATH.
 * Quote never closes. Cluster: clipped, open, bloated, stubbed.
 */
export function seed90421Scant() {
  const full = makeSnapshotBody(makePath(35), { closeQuote: false, newline: false });
  const snapshot = cutToBytes(full, SNAPSHOT_WALL);
  const fullBytes = utf8Bytes(makeSnapshotBody(makePath(35), { closeQuote: true, newline: true }));
  return seedProbe(90421, "anthropics/claude-code#90421", {
    session: "90421-scant",
    snapshot,
    measuredFullLength: fullBytes,
    pluginCount: 35,
    pluginPathBytes: 35 * PLUGIN_PATH_CHARS,
    pluginPathBloat: true,
  });
}

/** Clipped: hit the ~7.2KB wall; PATH quote closed (not mid-PATH). */
export function seedClipped() {
  const closed = makeSnapshotBody(makePath(20), { closeQuote: true, newline: true });
  const pad = `\n# ${"board ".repeat(400)}`;
  const snapshot = cutToBytes(`${closed}${pad}`, SNAPSHOT_WALL);
  return seedProbe(90421, "anthropics/claude-code#90421", {
    session: "90421-clipped",
    snapshot,
    pluginCount: 20,
  });
}

/** Open: unclosed PATH quote under the wall. */
export function seedOpen() {
  const snapshot = makeSnapshotBody("/usr/bin:/usr/local/bin:", {
    closeQuote: false,
    newline: false,
    preamble: false,
  });
  return seedProbe(85111, "anthropics/claude-code#85111", {
    session: "85111-open",
    snapshot,
  });
}

/** Poisoned: every Bash call unexpected EOF. */
export function seedPoisoned() {
  const full = makeSnapshotBody(makePath(35), { closeQuote: false, newline: false });
  const snapshot = cutToBytes(full, SNAPSHOT_WALL);
  return seedProbe(90421, "anthropics/claude-code#90421", {
    session: "90421-poisoned",
    snapshot,
    bashUnexpectedEof: true,
    pluginCount: 35,
    pluginPathBloat: true,
    measuredFullLength: 9800,
  });
}

/** Bloated: plugin PATH would push over the wall; current board still closed. */
export function seedBloated() {
  const snapshot = makeSnapshotBody(makePath(8), { closeQuote: true, newline: true });
  return seedProbe(90421, "anthropics/claude-code#90421", {
    session: "90421-bloated",
    snapshot,
    pluginPathBloat: true,
    pluginCount: 35,
    pluginPathBytes: 35 * PLUGIN_PATH_CHARS,
    measuredFullLength: 9800,
  });
}

/** Stubbed: file ends mid-entry (HOME), no PATH export. */
export function seedStubbed() {
  return seedProbe(83243, "anthropics/claude-code#83243", {
    session: "83243-stubbed",
    snapshot: "# claude-code shell-snapshot\nexport HOME='/c/Users/de",
  });
}

/** Mute: snapshot deleted → silent no-op Bash. */
export function seedMute() {
  return seedProbe(90421, "anthropics/claude-code#90421", {
    session: "90421-mute",
    snapshotDeleted: true,
    silentNoOpBash: true,
  });
}

/** Sealed: on-disk repair attempted; session still dead. */
export function seedSealed() {
  const snapshot = makeSnapshotBody(makePath(12), { closeQuote: true, newline: true });
  return seedProbe(90421, "anthropics/claude-code#90421", {
    session: "90421-sealed",
    snapshot,
    onDiskRepairAttempted: true,
    sessionStillDead: true,
  });
}

/** True: measured full length would have fit; quote closed. */
export function seedTrue() {
  const snapshot = makeSnapshotBody("/usr/bin:/bin:/usr/local/bin", {
    closeQuote: true,
    newline: true,
    preamble: false,
  });
  return seedProbe("true", "slab", {
    session: "true",
    issue: null,
    snapshot,
    measuredFullLength: utf8Bytes(snapshot),
  });
}

const SEEDS = {
  fit: seedFit,
  scant: seed90421Scant,
  90421: seed90421Scant,
  "90421-scant": seed90421Scant,
  clipped: seedClipped,
  "90421-clipped": seedClipped,
  open: seedOpen,
  85111: seedOpen,
  "85111-open": seedOpen,
  poisoned: seedPoisoned,
  "90421-poisoned": seedPoisoned,
  bloated: seedBloated,
  "90421-bloated": seedBloated,
  stubbed: seedStubbed,
  83243: seedStubbed,
  "83243-stubbed": seedStubbed,
  mute: seedMute,
  "90421-mute": seedMute,
  sealed: seedSealed,
  "90421-sealed": seedSealed,
  true: seedTrue,
};

function scantStrike(session) {
  const seeded = seed90421Scant();
  return {
    ...seeded.probe,
    session: session || seeded.probe.session,
    source: "board",
    scored: true,
  };
}

function trueStrike(session) {
  const seeded = seedTrue();
  return {
    ...seeded.probe,
    session: session || "true",
    source: "hold",
    scored: true,
  };
}

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
  let probe = cloneProbe(action.probe);
  const verb = String(action.action || "score").toLowerCase();

  if (verb === "fit" || verb === "seat" || verb === "rack") {
    return pack("fit", emptyProbe(), { ...action, action: verb === "seat" ? "rack" : verb });
  }

  if (verb === "clip" || verb === "saw") {
    probe = scantStrike(action.session || probe.session);
    return pack(classify(probe), probe, { ...action, action: "clip" });
  }

  if (verb === "true") {
    probe = trueStrike(action.session || probe.session);
    return pack(classify(probe), probe, { ...action, action: "true" });
  }

  if (verb === "observe" || verb === "trace" || verb === "ledger" || verb === "chalk") {
    probe = { ...probe, observed: true, scored: true };
    return pack(classify(probe), probe, { ...action, action: verb === "observe" ? "chalk" : verb });
  }

  if (verb === "press" || verb === "admit" || verb === "score" || verb === "measure") {
    probe = { ...probe, scored: true };
    return pack(classify(probe), probe, { ...action, action: verb === "press" ? "score" : verb });
  }

  probe = { ...probe, scored: true };
  return pack(classify(probe), probe, action);
}
