#!/usr/bin/env node
/**
 * Tmesis — manuscript / rhetoric / spliced parchment /
 * editorial-desk booth.
 * A *tmesis* is the rhetorical figure of cutting a word and
 * inserting another in the middle (abso-bloody-lutely). Slash-
 * command `system` / `local_command` records are tmesis-spliced
 * into the middle of an unresolved advisor turn, breaking the
 * tool_use↔tool_result contiguity the API requires. Iron-gall
 * ink / parchment cream / vermillion splice ribbon / wax-seal
 * 400 / desk walnut. NOT Vedette cavalry lantern. NOT Orloj
 * Prague clock. NOT Brisure herald college. NOT Diptych wax-
 * tablet. NOT Vizard masque-ball. NOT Treacle kettle. NOT
 * Somnus sleep clinic. NOT Cresset fire-basket. NOT Dictabelt
 * wax-belt. NOT Lemure lararium. NOT Cancellans binder. NOT
 * Arras tapestry.
 *
 * Educational diagnostic model for a published Claude Code
 * defect: while a server-side `advisor` tool call is in flight,
 * typing an ordinary slash command (e.g. `/effort`) appends
 * that command's `system` / `local_command` records **inside**
 * the still-open assistant message, between `server_tool_use`
 * and `advisor_tool_result`. The `advisor_tool_result`'s
 * `parentUuid` then chains to the command's stdout record
 * instead of the `server_tool_use`. Every subsequent request
 * replays the corrupted history and fails with a non-retryable
 * 400. Session permanently dead.
 *
 * Encoded from anthropics/claude-code#86198 issue text only.
 * Hypothesis (NON-BINDING — issue text): local_command records
 * are appended to the open assistant message while
 * server_tool_use awaits advisor_tool_result; parentUuid chain
 * breaks; API 400 forever. Invite verify against #86198 text
 * only. Do NOT claim a root cause in Claude Code source you
 * have not seen. Do NOT implement a Claude Code fix. No
 * network. No exploits. No live Claude.
 *
 *   node tmesis.mjs data/tmesis.json
 *   echo '{"seed":"tmesis"}' | node tmesis.mjs
 *
 * Idle word is contiguous (HOLD: defer local_command until the
 * open assistant message — all blocks for that message.id —
 * has closed).
 * HOLD aliases: joined, uncut, bound, clause-shut.
 * Seeded word is tmesis (#86198 path).
 * Path word is mid-inject.
 * Product score word is tmesis (Score tmesis or admit contiguous.).
 *
 * NOT #81397 (Stop-hook injector, same contiguity break).
 * NOT #92509 (server tool result separated by interleaved
 * system messages).
 * NOT #81233 / #60523 (compaction — different).
 * Same family of "tool_use↔tool_result contiguity" words but
 * DIFFERENT injector: a plain user slash command.
 */

/* Browser-safe: no top-level node: imports. CLI I/O is loaded only in main(). */

export const VERDICTS = Object.freeze([
  "contiguous",
  "tmesis",
  "mid-inject",
  "joined",
  "uncut",
  "bound",
  "clause-shut",
  "local-command",
  "orphan-result",
  "parent-break",
  "four-hundred",
  "slash-effort",
  "86198",
  "landing",
  "has-repro",
  "cousins",
  "backups",
  "fixtures",
  "walk",
  "closed",
]);

export const IDLE_WORD = "contiguous";
export const PATH_WORD = "mid-inject";
export const SEEDED_WORD = "tmesis";
export const PRODUCT_WORD = "tmesis";
export const HOLD = Object.freeze(["contiguous"]);
export const HOLD_ALIASES = Object.freeze([
  "joined",
  "uncut",
  "bound",
  "clause-shut",
]);
export const RECOVER = Object.freeze(["contiguous"]);
export const ALARM = Object.freeze(
  VERDICTS.filter((name) => !HOLD.includes(name) && !HOLD_ALIASES.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FORBIDDEN_IDLE = Object.freeze([
  "stationed",
  "lasting",
  "enrolled",
  "single",
  "pledged",
  "brisk",
  "cadence",
  "verbatim",
  "quiet",
  "intact",
  "cleared",
  "armed",
  "affixed",
  "unpacked",
  "scoped",
  "equated",
  "penned",
  "ungloved",
  "attested",
  "reaped",
  "tenanted",
  "barred",
  "additive",
  "literal",
  "echoing",
  "unabridged",
  "innocent",
  "sealed",
  "silenced",
  "living",
  "crewed",
  "posted",
  "vigil",
  "tethered",
  "vedette",
  "orloj",
  "brisure",
  "diptych",
  "vizard",
  "treacle",
  "somnus",
  "cresset",
  "dictabelt",
  "lemure",
  "cancellans",
  "arras",
  "frangible",
  "nameplate",
  "matryoshka",
  "idle-exit",
  "half-life",
  "fork-resume",
  "brief-echo",
  "background-reset",
  "streaming-stall",
  "device-absent",
  "hold-leak",
  "segment-drop",
  "orphan-tick",
  "deferred-delta",
  "phantom-prompt",
  "chmod-failopen",
]);

export const FORBIDDEN_SEED = Object.freeze([
  "vedette",
  "orloj",
  "brisure",
  "diptych",
  "vizard",
  "treacle",
  "somnus",
  "cresset",
  "dictabelt",
  "lemure",
  "cancellans",
  "arras",
  "frangible",
  "nameplate",
  "matryoshka",
  "idle-exit",
  "half-life",
  "fork-resume",
  "brief-echo",
  "background-reset",
  "streaming-stall",
  "device-absent",
  "hold-leak",
  "segment-drop",
  "orphan-tick",
  "deferred-delta",
  "phantom-prompt",
  "chmod-failopen",
  "escutcheon",
  "forksink",
  "diplopia",
  "dragnet",
  "matricula",
  "followspot",
]);

export const FEATURED_ISSUE = 86198;
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/86198";
export const TITLE =
  "Running a slash command (/effort) while `advisor` is in flight injects local_command records mid-message and permanently 400s the session";
export const STATE = "OPEN";
export const LABELS = Object.freeze([
  "bug",
  "has repro",
  "reproduced",
  "platform:macos",
  "area:core",
]);
export const PLATFORM = "macos";
export const SURFACE = "mid-inject";
export const HOST =
  "Claude Code 2.1.226; macOS 15.5 / darwin 25.5.0";
export const CHECKED_ON =
  "Published report: while advisor is in flight, a slash command splices local_command records between server_tool_use and advisor_tool_result; parentUuid chains to stdout; every later request 400s";
export const BUILD = "Claude Code 2.1.226";
export const SELECTED_MODEL =
  "Mid-message slash/local_command inject into in-flight advisor — not a model defect";
export const OS = "macOS 15.5 / darwin 25.5.0; platform:macos / area:core";
export const PHRASE = "Score tmesis or admit contiguous.";
export const DISTRIBUTION =
  "Claude Code 2.1.226; macOS 15.5 / darwin 25.5.0. Session f11035d0-7407-4b01-8b8a-b9aaf785457d made 63 advisor calls; 62 well-formed (advisor_tool_result.parentUuid == server_tool_use.uuid). The 63rd — last thing before the session died — is broken: assistant server_tool_use srvtoolu_01MF7bundmTNou6yC7iNqAs6 (uuid 8b3c6c8a, message.id msg_011CdyMt), then system local_command /effort (8a828144), then system local-command-stdout (4867dfdb), then assistant advisor_tool_result whose parentUuid points at 4867dfdb instead of 8b3c6c8a. Lines 79113 and 79116 share one message.id. Error: API Error: 400 messages.83.content.0: unexpected tool_use_id found in advisor_tool_result blocks: srvtoolu_01MF7bundmTNou6yC7iNqAs6. Each advisor_tool_result block must have a corresponding server_tool_use block before it. Same mechanism as #81397 but injector is a plain user slash command, not a Stop hook. NOT compaction (#81233, #60523). Expected: defer local_command until the open assistant message has closed; belt-and-braces: detect orphaned advisor_tool_result at request-assembly and drop rather than send.";

export const CODE_BUILD = "2.1.226";
export const SESSION_ID = "f11035d0-7407-4b01-8b8a-b9aaf785457d";
export const ADVISOR_CALLS = 63;
export const WELL_FORMED = 62;
export const TOOL_USE_ID = "srvtoolu_01MF7bundmTNou6yC7iNqAs6";
export const MESSAGE_ID = "msg_011CdyMt";
export const STU_UUID = "8b3c6c8a";
export const CMD_UUID = "8a828144";
export const STDOUT_UUID = "4867dfdb";
export const RESULT_UUID = "bd6a377d";
export const BROKEN_PARENT = "4867dfdb";
export const INJECT_AT = "2026-08-12T18:53:58.909Z";
export const ERROR_SIGNATURE =
  "API Error: 400 messages.83.content.0: unexpected tool_use_id found in advisor_tool_result blocks: srvtoolu_01MF7bundmTNou6yC7iNqAs6. Each advisor_tool_result block must have a corresponding server_tool_use block before it.";
export const SLASH_COMMAND = "/effort";
export const INJECTORS = Object.freeze(["/effort", "/usage", "/model", "/status"]);

/**
 * Synthetic example-data — reconstructs published transcript shapes.
 * Labeled as such. Not a live dump.
 */
export const SYNTHETIC_CONTIGUOUS = Object.freeze({
  kind: "contiguous",
  inFlight: false,
  messageClosed: true,
  injected: false,
  parentUuid: STU_UUID,
  orphan: false,
  status: 200,
  note: "folio holds — contiguous until the advisor clause closes",
  synthetic: true,
});
export const SYNTHETIC_TMESIS = Object.freeze({
  kind: "tmesis",
  inFlight: true,
  messageClosed: false,
  injected: true,
  command: SLASH_COMMAND,
  parentUuid: BROKEN_PARENT,
  expectedParent: STU_UUID,
  orphan: true,
  status: 400,
  error: ERROR_SIGNATURE,
  note: "slash ribbon spliced mid-clause; parentUuid points at stdout; 400 forever",
  synthetic: true,
});
export const SYNTHETIC_MID_INJECT = Object.freeze({
  kind: "mid-inject",
  rows: [
    { type: "assistant", block: "server_tool_use", uuid: STU_UUID, parentUuid: "ee8c0e34", messageId: MESSAGE_ID },
    { type: "system", block: "local_command", uuid: CMD_UUID, parentUuid: STU_UUID, command: SLASH_COMMAND },
    { type: "system", block: "local-command-stdout", uuid: STDOUT_UUID, parentUuid: CMD_UUID },
    { type: "assistant", block: "advisor_tool_result", uuid: RESULT_UUID, parentUuid: STDOUT_UUID, messageId: MESSAGE_ID, toolUseId: TOOL_USE_ID },
  ],
  note: "four-row evidence: server_tool_use → local_command → stdout → orphaned advisor_tool_result",
  synthetic: true,
});

export const EVIDENCE_ROWS = Object.freeze([
  {
    line: 79113,
    type: "assistant",
    content: `server_tool_use ${TOOL_USE_ID}`,
    uuid: STU_UUID,
    parentUuid: "ee8c0e34",
    messageId: MESSAGE_ID,
    timestamp: null,
  },
  {
    line: 79114,
    type: "system",
    content: "local_command: <command-name>/effort</command-name>",
    uuid: CMD_UUID,
    parentUuid: STU_UUID,
    messageId: null,
    timestamp: INJECT_AT,
  },
  {
    line: 79115,
    type: "system",
    content: "local_command: <local-command-stdout>Set effort level to medium…</local-command-stdout>",
    uuid: STDOUT_UUID,
    parentUuid: CMD_UUID,
    messageId: null,
    timestamp: INJECT_AT,
  },
  {
    line: 79116,
    type: "assistant",
    content: `advisor_tool_result ${TOOL_USE_ID}`,
    uuid: RESULT_UUID,
    parentUuid: BROKEN_PARENT,
    messageId: MESSAGE_ID,
    timestamp: null,
    orphan: true,
  },
]);

export const LEDGER_NAMES = Object.freeze([
  {
    id: "open-folio",
    lost: "Open folio — advisor ink still flowing; message.id still open",
    control: "A contiguous folio would close the advisor clause before any slash ribbon",
    story: "the editorial desk should not splice a ribbon through a wet clause",
  },
  {
    id: "advisor-ink",
    lost: "Advisor ink — server_tool_use streamed; advisor_tool_result not yet arrived",
    control: "the pair would stay adjacent on one message.id",
    story: "the gall line waits for its result before the page turns",
  },
  {
    id: "splice-ribbon",
    lost: "Splice ribbon — /effort local_command + stdout cut into the middle",
    control: "the slash records would wait until the assistant message closed",
    story: "tmesis: the word is cut and the command is inserted",
  },
  {
    id: "parent-chain",
    lost: "Parent chain — advisor_tool_result.parentUuid points at stdout, not server_tool_use",
    control: "parentUuid would equal the server_tool_use uuid",
    story: "the thread is re-tied to the ribbon instead of the ink",
  },
  {
    id: "orphan-result",
    lost: "Orphan result — advisor_tool_result has no preceding server_tool_use in the assembled request",
    control: "request-assembly would drop the orphan rather than send it",
    story: "the result stands alone and the API rejects the page",
  },
  {
    id: "four-hundred-seal",
    lost: "Four-hundred seal — non-retryable 400; session permanently dead",
    control: "a corrupted history would be repaired or refused locally",
    story: "the wax seal stamps 400 on every later prompt",
  },
]);

export const BOOTH_STATIONS = Object.freeze([
  {
    id: "open-folio",
    survey: "contiguous HOLD: defer local_command until all blocks for that message.id have closed",
    kind: "contiguous",
    note: "idle/control: folio and advisor ink agree to close the clause",
  },
  {
    id: "advisor-ink",
    survey: "server_tool_use in flight; advisor_tool_result not yet written",
    kind: "tmesis",
    note: "seeded: wet ink, open message.id",
  },
  {
    id: "splice-ribbon",
    survey: "plain slash command /effort injects system local_command mid-message",
    kind: "tmesis",
    note: "seeded: tmesis splice through the clause",
  },
  {
    id: "parent-chain",
    survey: "advisor_tool_result.parentUuid chains to stdout instead of server_tool_use",
    kind: "tmesis",
    note: "seeded: broken parentUuid",
  },
  {
    id: "orphan-result",
    survey: "assembled request places intervening turn between tool_use and tool_result",
    kind: "tmesis",
    note: "seeded: orphan advisor_tool_result",
  },
  {
    id: "four-hundred-seal",
    survey: "mid-inject — API 400 forever; session permanently dead",
    kind: "tmesis",
    note: "path: mid-inject names the permanent 400",
  },
]);

export const FIELD_MARKS = Object.freeze([
  {
    id: "local-command",
    label: "local-command",
    count: "system",
    note: "system / local_command records spliced mid-message",
  },
  {
    id: "orphan-result",
    label: "orphan-result",
    count: "orphan",
    note: "advisor_tool_result has no preceding server_tool_use in the assembled request",
  },
  {
    id: "parent-break",
    label: "parent-break",
    count: "parentUuid",
    note: "parentUuid points at stdout instead of server_tool_use",
  },
  {
    id: "four-hundred",
    label: "four-hundred",
    count: "400",
    note: "non-retryable 400; session permanently dead",
  },
  {
    id: "slash-effort",
    label: "slash-effort",
    count: "/effort",
    note: "Injector is a plain user slash command, not a Stop hook",
  },
  {
    id: "mid-inject",
    label: "mid-inject",
    count: "splice",
    note: "Injection lands between server_tool_use and advisor_tool_result",
  },
]);

export const RULED_OUT = Object.freeze([
  "#81397 — identical mechanism, injector is a session-scoped Stop hook instead of a slash command — DIFFERENT injector; cite only",
  "#92509 — server tool result separated by interleaved system messages — DIFFERENT; cite only",
  "#81233 — compaction variant of the same invariant break — DIFFERENT; cite only",
  "#60523 — compaction variant — DIFFERENT; cite only",
  "Vedette/#94392 — headless -p idle-exit / false success — DIFFERENT",
  "Orloj/#94393 — Monitor schema cap / half-life — DIFFERENT",
  "Brisure/#94396 — fork-resume never becomes Remote Control eligible — DIFFERENT",
  "Diptych/#94397 — Remote Control mobile brief-echo — DIFFERENT",
  "Vizard/#94398 — background-reset to Opus 4.8 — DIFFERENT",
  "Treacle/#94344 — Windows PowerShell streaming-stall — DIFFERENT",
  "Somnus/#94415 — Cowork schedule device_absent — DIFFERENT",
  "Cresset/#94420 — keep-awake hold-leak — DIFFERENT",
  "Dictabelt/#94406 — voice segment-drop — DIFFERENT",
  "Lemure/#94410 — orphan scheduled-task ticks — DIFFERENT",
  "Cancellans/#94400 — resume-fork deferred_tools_delta — DIFFERENT",
  "Arras/#94348 — phantom permission prompt — DIFFERENT",
]);

export const EXPECTED = Object.freeze([
  "Slash-command / local_command records must not be chained into an assistant message that has an unresolved server_tool_use",
  "Defer the injection until all content blocks for that message.id have arrived, then append the records after the closed message",
  "Belt-and-braces: the client should detect an orphaned advisor_tool_result at request-assembly time and drop the pair rather than sending a history it knows the API will reject",
]);

export const SUGGESTED_FIX = Object.freeze([
  "Defer local_command injection until the open assistant message (all blocks for that message.id) has closed",
  "Detect orphaned advisor_tool_result at request-assembly and drop rather than send",
]);

export const FINGERPRINT_LINES = Object.freeze([
  "mid-inject",
  "tmesis",
  "local-command",
  "orphan-result",
  "parent-break",
  "four-hundred",
]);

export const COUSINS = Object.freeze([
  {
    issue: 81397,
    title: "Stop-hook injector, same contiguity break",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — #81397 is the same mechanism with a Stop-hook injector. DIFFERENT injector. Do not rebuild. Do not conflate.",
  },
  {
    issue: 92509,
    title: "server tool result separated by interleaved system messages",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — #92509 is interleaved system messages around a server tool result. DIFFERENT. Do not rebuild. Do not conflate.",
  },
  {
    issue: 81233,
    title: "compaction variant of the same invariant break",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — #81233 is the compaction variant. DIFFERENT. Do not rebuild. Do not conflate.",
  },
  {
    issue: 60523,
    title: "compaction variant",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — #60523 is a compaction variant. DIFFERENT. Do not rebuild. Do not conflate.",
  },
]);

export const BACKUPS = Object.freeze([
  { issue: 94417, title: "backup next-focus", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94452, title: "backup next-focus", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94451, title: "backup next-focus", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94430, title: "backup next-focus", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94458, title: "backup next-focus", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93924, title: "backup next-focus", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93770, title: "backup next-focus", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93777, title: "backup next-focus", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94151, title: "backup next-focus", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
]);

export const NOT_PRODUCTS = Object.freeze([
  "vedette",
  "orloj",
  "brisure",
  "diptych",
  "vizard",
  "treacle",
  "somnus",
  "cresset",
  "dictabelt",
  "lemure",
  "cancellans",
  "arras",
  "frangible",
  "nameplate",
  "matryoshka",
  "forksink",
  "diplopia",
  "escutcheon",
  "followspot",
]);

export const SAMPLE_KIND_IDLE = "open-folio";
export const SAMPLE_KIND_SEEDED = "mid-inject";
export const SAMPLE_HOLDING_IDLE = "editorial-desk";
export const SAMPLE_HOLDING_SEEDED = "splice-ribbon";

export const SAMPLE_CONTIGUOUS_PROOF = Object.freeze({
  contiguous: true,
  tmesis: false,
  midInject: false,
  kind: SAMPLE_KIND_IDLE,
});

export const SAMPLE_TMESIS_PROOF = Object.freeze({
  contiguous: false,
  tmesis: true,
  midInject: true,
  localCommand: true,
  orphanResult: true,
  parentBreak: true,
  fourHundred: true,
  slashEffort: true,
  kind: SAMPLE_KIND_SEEDED,
  names: LEDGER_NAMES.map((row) => row.id),
  contiguousWatch: { ...SYNTHETIC_CONTIGUOUS },
  tmesisWatch: { ...SYNTHETIC_TMESIS },
  midInjectShape: { ...SYNTHETIC_MID_INJECT },
  evidence: EVIDENCE_ROWS,
  synthetic: true,
});

export const SAMPLE_WALK_LOG = Object.freeze([
  { t: "idle", line: "booth holds contiguous: defer local_command until the open assistant message has closed" },
  { t: "mid-inject", line: "/effort spliced between server_tool_use and advisor_tool_result" },
  { t: "path", line: "mid-inject — parentUuid points at stdout; next prompt 400s" },
  { t: "score", line: "when the ribbon is cut through the wet clause the booth is tmesis — Score tmesis or admit contiguous." },
]);

const FORCE_FLAGS = [
  "midInject",
  "localCommand",
  "orphanResult",
  "parentBreak",
  "fourHundred",
  "slashEffort",
];

const ISSUE_CUE_RE =
  /86198|advisor_tool_result|server_tool_use|local_command|\/effort|srvtoolu_|unexpected tool_use_id|parentUuid|msg_011CdyMt/i;

/**
 * Educational advisor-flight observer. Not a Claude Code patch.
 * Encodes only the published #86198 shapes.
 *
 * inFlight + open message.id → wet ink. contiguous=true closes the folio.
 */
export function observeAdvisorFlight({
  inFlight = false,
  messageClosed = false,
  contiguous = false,
} = {}) {
  if (contiguous === true) {
    return {
      inFlight: false,
      messageClosed: true,
      phrase: "admit contiguous",
      synthetic: true,
    };
  }
  const wet = inFlight === true && messageClosed !== true;
  return {
    inFlight: wet,
    messageClosed: !wet,
    phrase: wet ? "score tmesis" : "admit contiguous",
    note: wet
      ? "server_tool_use streamed; advisor_tool_result not yet arrived"
      : "advisor clause closed; folio may take a slash ribbon after",
    synthetic: true,
  };
}

/**
 * Educational slash-command splice. Not a Claude Code patch.
 * While advisor is in flight, a local_command is tmesis-spliced
 * into the still-open assistant message.
 */
export function spliceSlashCommand({
  inFlight = false,
  command = SLASH_COMMAND,
  contiguous = false,
} = {}) {
  if (contiguous === true) {
    return {
      injected: false,
      deferred: true,
      command,
      phrase: "admit contiguous",
      note: "slash records wait until the assistant message closed",
      synthetic: true,
    };
  }
  const injected = inFlight === true;
  return {
    injected,
    deferred: !injected,
    command,
    phrase: injected ? "score tmesis" : "admit contiguous",
    note: injected
      ? `${command} local_command records spliced mid-message`
      : "no in-flight advisor; slash may append after a closed message",
    synthetic: true,
  };
}

/**
 * Educational parentUuid chain. Not a Claude Code patch.
 * Broken path: advisor_tool_result.parentUuid == stdout uuid.
 * Contiguous path: parentUuid == server_tool_use uuid.
 */
export function chainParentUuid({
  rows = null,
  contiguous = false,
} = {}) {
  const list = Array.isArray(rows) && rows.length ? rows : SYNTHETIC_MID_INJECT.rows;
  const result = list.find((row) => row.block === "advisor_tool_result") || {};
  const use = list.find((row) => row.block === "server_tool_use") || {};
  if (contiguous === true) {
    return {
      parentUuid: use.uuid || STU_UUID,
      expectedParent: use.uuid || STU_UUID,
      broken: false,
      phrase: "admit contiguous",
      synthetic: true,
    };
  }
  const parentUuid = result.parentUuid || BROKEN_PARENT;
  const expectedParent = use.uuid || STU_UUID;
  const broken = parentUuid !== expectedParent;
  return {
    parentUuid,
    expectedParent,
    broken,
    phrase: broken ? "score tmesis" : "admit contiguous",
    note: broken
      ? "advisor_tool_result.parentUuid points at stdout, not server_tool_use"
      : "parentUuid equals server_tool_use uuid",
    synthetic: true,
  };
}

/**
 * Educational orphan detector. Not a Claude Code patch.
 * Belt-and-braces: an advisor_tool_result without a preceding
 * server_tool_use in the assembled request is an orphan.
 */
export function detectOrphanResult({
  rows = null,
  contiguous = false,
  dropOrphans = false,
} = {}) {
  if (contiguous === true) {
    return {
      orphan: false,
      dropped: false,
      phrase: "admit contiguous",
      synthetic: true,
    };
  }
  const list = Array.isArray(rows) && rows.length ? rows : SYNTHETIC_MID_INJECT.rows;
  const resultIdx = list.findIndex((row) => row.block === "advisor_tool_result");
  const useIdx = list.findIndex((row) => row.block === "server_tool_use");
  const intervening = resultIdx > -1 && useIdx > -1
    ? list.slice(useIdx + 1, resultIdx).some((row) => row.type === "system")
    : resultIdx > -1 && useIdx === -1;
  const orphan = intervening || (resultIdx > -1 && useIdx === -1);
  return {
    orphan,
    dropped: orphan && dropOrphans === true,
    phrase: orphan && !dropOrphans ? "score tmesis" : "admit contiguous",
    note: orphan
      ? dropOrphans
        ? "orphan advisor_tool_result dropped at request-assembly"
        : "orphaned advisor_tool_result would be sent; API 400"
      : "tool_use and tool_result stay contiguous",
    synthetic: true,
  };
}

/**
 * Educational request assembler. Not a Claude Code patch.
 * Sending an orphaned advisor_tool_result yields a non-retryable 400.
 */
export function assembleRequest({
  rows = null,
  dropOrphans = false,
  contiguous = false,
} = {}) {
  const orphan = detectOrphanResult({ rows, contiguous, dropOrphans });
  if (contiguous === true || orphan.dropped || !orphan.orphan) {
    return {
      status: 200,
      error: null,
      phrase: "admit contiguous",
      orphan,
      synthetic: true,
    };
  }
  return {
    status: 400,
    error: ERROR_SIGNATURE,
    phrase: "score tmesis",
    orphan,
    note: "non-retryable 400; session permanently dead",
    synthetic: true,
  };
}

/**
 * Educational deferral. Not a Claude Code patch.
 * Expected: wait until all blocks for that message.id have arrived.
 */
export function deferInjection({
  messageClosed = false,
  contiguous = false,
} = {}) {
  if (contiguous === true || messageClosed === true) {
    return {
      deferred: true,
      appendedAfter: true,
      phrase: "admit contiguous",
      synthetic: true,
    };
  }
  return {
    deferred: false,
    appendedAfter: false,
    phrase: "score tmesis",
    note: "injection landed inside the still-open assistant message",
    synthetic: true,
  };
}

export function scoreMidInject(input = {}) {
  const contiguousHold = input.contiguous === true && input.tmesis !== true;
  const flight = observeAdvisorFlight({
    inFlight: !contiguousHold,
    contiguous: contiguousHold,
  });
  const tmesis =
    !contiguousHold &&
    (input.tmesis === true ||
      input.midInject === true ||
      input.localCommand === true ||
      input.orphanResult === true ||
      input.parentBreak === true ||
      input.fourHundred === true ||
      flight.inFlight === true);
  return {
    contiguous: !tmesis,
    tmesis,
    midInject: tmesis,
    flight,
    phrase: tmesis ? "score tmesis" : "admit contiguous",
  };
}

export function mentionsIssueCue(input = {}) {
  if (input.issue === FEATURED_ISSUE || input.issue === "86198") return true;
  const blob = typeof input === "string" ? input : JSON.stringify(input);
  return ISSUE_CUE_RE.test(blob);
}

export function mapTmesis(input = {}) {
  const tmesis = isTmesisInput(input);
  const contiguous = input.contiguous === true && !tmesis;
  return {
    stamp: tmesis ? "mid-inject" : "editorial-desk",
    holdingLane: tmesis ? "splice-ribbon" : "editorial-desk",
    kindLane: tmesis ? "mid-inject" : "open-folio",
    bindLane: tmesis ? "parent-chain" : "clause-shut",
    ribbon: tmesis ? "tmesis" : "contiguous",
    contiguous,
  };
}

export function inspectLocalCommand(input = {}) {
  const flagged =
    input.localCommand === true ||
    input.tmesis === true ||
    input.midInject === true ||
    isTmesisInput(input);
  if (input.contiguous === true && !flagged) {
    return { stamp: "joined", flagged: false, note: "folio and clause stay joined" };
  }
  return {
    stamp: flagged ? "local-command" : "cmd-idle",
    flagged,
    note: flagged
      ? "local-command — system / local_command records spliced mid-message"
      : "",
  };
}

export function inspectOrphan(input = {}) {
  const orphaned =
    input.orphanResult === true ||
    input.tmesis === true ||
    isTmesisInput(input);
  if (input.contiguous === true && !orphaned) {
    return { stamp: "uncut", orphaned: false };
  }
  return {
    stamp: orphaned ? "orphan-result" : "result-idle",
    orphaned,
    note: orphaned
      ? "orphan-result — advisor_tool_result has no preceding server_tool_use"
      : "",
  };
}

export function inspectParentBreak(input = {}) {
  const broken =
    input.parentBreak === true ||
    input.tmesis === true ||
    isTmesisInput(input);
  if (input.contiguous === true && !broken) {
    return { stamp: "bound", broken: false };
  }
  return {
    stamp: broken ? "parent-break" : "parent-idle",
    broken,
    note: broken
      ? "parent-break — parentUuid points at stdout instead of server_tool_use"
      : "",
  };
}

export function inspectFourHundred(input = {}) {
  const sealed =
    input.fourHundred === true ||
    input.tmesis === true ||
    input.midInject === true ||
    isTmesisInput(input);
  if (input.contiguous === true && !sealed) {
    return { stamp: "clause-shut", sealed: false };
  }
  return {
    stamp: sealed ? "four-hundred" : "seal-idle",
    sealed,
    note: sealed
      ? "four-hundred — non-retryable 400; session permanently dead"
      : "",
  };
}

export function inspectSlashEffort(input = {}) {
  const slashed =
    input.slashEffort === true ||
    input.tmesis === true ||
    isTmesisInput(input);
  if (input.contiguous === true && !slashed) {
    return { stamp: "open-folio", slashed: false };
  }
  return {
    stamp: slashed ? "slash-effort" : "slash-idle",
    slashed,
    note: slashed
      ? "slash-effort — injector is a plain user slash command, not a Stop hook"
      : "",
  };
}

function ledgerOpen(input, id) {
  const map = {
    "open-folio": input.tmesis || input.midInject,
    "advisor-ink": input.tmesis || input.midInject,
    "splice-ribbon": input.localCommand || input.slashEffort || input.tmesis,
    "parent-chain": input.parentBreak || input.tmesis,
    "orphan-result": input.orphanResult || input.tmesis,
    "four-hundred-seal": input.fourHundred || input.midInject || input.tmesis,
  };
  return (
    map[id] === true ||
    input.midInject === true ||
    input.tmesis === true
  );
}

function isTmesisInput(input = {}) {
  return (
    input.tmesis === true ||
    input.midInject === true ||
    input.localCommand === true ||
    input.orphanResult === true ||
    input.parentBreak === true ||
    input.fourHundred === true ||
    input.slashEffort === true
  );
}

export function readBooth(input = {}) {
  const tmesis = isTmesisInput(input);
  const contiguous = input.contiguous === true && !tmesis;
  return {
    mark: tmesis ? "tmesis" : "contiguous",
    contiguous,
    tmesis,
    midInject: input.midInject === true || tmesis,
    localCommand: input.localCommand === true,
    orphanResult: input.orphanResult === true,
    parentBreak: input.parentBreak === true,
    fourHundred: input.fourHundred === true,
    slashEffort: input.slashEffort === true,
    post: mapTmesis(input),
    local: inspectLocalCommand(input),
    orphan: inspectOrphan(input),
    parent: inspectParentBreak(input),
    seal: inspectFourHundred(input),
    slash: inspectSlashEffort(input),
    names: LEDGER_NAMES.filter((row) => ledgerOpen(input, row.id)).map(
      (row) => row.id,
    ),
    evidence: EVIDENCE_ROWS,
    log: input.log || [],
  };
}

export const TMESIS_WALK = Object.freeze([
  {
    t: "idle",
    event: "editorial-desk",
    contiguous: true,
    tmesis: false,
    cue: "contiguous",
    note: "idle HOLD: defer local_command until the open assistant message has closed",
  },
  {
    t: "mid-inject",
    event: "mid-inject",
    tmesis: true,
    midInject: true,
    localCommand: true,
    slashEffort: true,
    cue: "tmesis",
    note: "/effort spliced between server_tool_use and advisor_tool_result",
  },
  {
    t: "path",
    event: "mid-inject",
    tmesis: true,
    midInject: true,
    localCommand: true,
    orphanResult: true,
    parentBreak: true,
    fourHundred: true,
    slashEffort: true,
    cue: "tmesis",
    note: "mid-inject — parentUuid points at stdout; next prompt 400s",
  },
  {
    t: "score",
    event: "tmesis",
    tmesis: true,
    midInject: true,
    localCommand: true,
    orphanResult: true,
    parentBreak: true,
    fourHundred: true,
    slashEffort: true,
    cue: "tmesis",
    note: "tmesis — the slash ribbon is cut through the wet advisor clause",
  },
]);

export const POSITIVE_CONTROL_WALK = Object.freeze([
  {
    t: "hold",
    event: "editorial-desk",
    contiguous: true,
    tmesis: false,
    cue: "contiguous",
    note: "positive control: defer local_command until the open assistant message has closed",
  },
  {
    t: "admit",
    event: "editorial-desk",
    contiguous: true,
    cue: "contiguous",
    note: "positive control: the folio admits contiguous",
  },
]);

function classifyFromSeed(seed) {
  if (seed && VERDICTS.includes(seed)) return seed;
  return null;
}

export function emptyTicket() {
  return {
    seed: IDLE_WORD,
    contiguous: true,
    tmesis: false,
    midInject: false,
    cue: "contiguous",
  };
}

export function seedContiguous() {
  return { ...emptyTicket() };
}

export function seedTmesis() {
  return {
    seed: SEEDED_WORD,
    contiguous: false,
    tmesis: true,
    midInject: true,
    localCommand: true,
    orphanResult: true,
    parentBreak: true,
    fourHundred: true,
    slashEffort: true,
    cue: "tmesis",
    issue: FEATURED_ISSUE,
    proof: SAMPLE_TMESIS_PROOF,
  };
}

export function seedProduct() {
  return {
    seed: PRODUCT_WORD,
    preferSeed: true,
    tmesis: true,
    midInject: true,
    cue: "tmesis",
  };
}

export function seedMidInject() {
  return {
    seed: PATH_WORD,
    preferSeed: true,
    tmesis: true,
    midInject: true,
    event: "mid-inject",
    cue: "tmesis",
  };
}

export function seedJoined() {
  return { seed: "joined", preferSeed: true, contiguous: true, cue: "contiguous" };
}

export function seedUncut() {
  return { seed: "uncut", preferSeed: true, contiguous: true, cue: "contiguous" };
}

export function seedBound() {
  return { seed: "bound", preferSeed: true, contiguous: true, cue: "contiguous" };
}

export function seedClauseShut() {
  return { seed: "clause-shut", preferSeed: true, contiguous: true, cue: "contiguous" };
}

export function seedLocalCommand() {
  return {
    seed: "local-command",
    preferSeed: true,
    localCommand: true,
    cue: "tmesis",
  };
}

export function seedFourHundred() {
  return {
    seed: "four-hundred",
    preferSeed: true,
    fourHundred: true,
    cue: "tmesis",
  };
}

export function normalizeBooth(raw) {
  if (!raw || typeof raw !== "object") {
    return {
      contiguous: false,
      tmesis: false,
      midInject: false,
      localCommand: false,
      orphanResult: false,
      parentBreak: false,
      fourHundred: false,
      slashEffort: false,
      cue: null,
      event: null,
      t: null,
    };
  }
  return {
    contiguous: raw.contiguous === true,
    tmesis: raw.tmesis === true || raw.event === "tmesis",
    midInject: raw.midInject === true || raw.event === "mid-inject",
    localCommand: raw.localCommand === true || raw.event === "local-command",
    orphanResult: raw.orphanResult === true || raw.event === "orphan-result",
    parentBreak: raw.parentBreak === true || raw.event === "parent-break",
    fourHundred: raw.fourHundred === true || raw.event === "four-hundred",
    slashEffort: raw.slashEffort === true || raw.event === "slash-effort",
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
      (ticket.contiguous != null ||
        ticket.tmesis != null ||
        ticket.midInject != null ||
        ticket.localCommand != null ||
        ticket.orphanResult != null ||
        ticket.parentBreak != null ||
        ticket.fourHundred != null ||
        ticket.slashEffort != null ||
        ticket.cue != null ||
        ticket.event ||
        ticket.proof),
  );
}

function isContiguous(row) {
  if (row.tmesis && row.cue !== "contiguous") return false;
  if (row.cue === "tmesis" || row.cue === "mid-inject") return false;
  if (
    row.midInject &&
    row.fourHundred &&
    row.cue !== "contiguous" &&
    row.contiguous !== true
  ) {
    return false;
  }
  if (
    row.contiguous === true &&
    row.tmesis !== true &&
    row.cue !== "tmesis"
  ) {
    return true;
  }
  if (
    row.cue === "contiguous" &&
    row.tmesis !== true &&
    row.midInject !== true &&
    FORCE_FLAGS.every((flag) => row[flag] !== true)
  ) {
    return true;
  }
  return false;
}

function isMidInject(row) {
  return (
    row.event === "mid-inject" &&
    !isContiguous(row) &&
    (row.midInject === true ||
      row.fourHundred === true ||
      row.tmesis === true)
  );
}

function isTmesisRow(row) {
  if (isContiguous(row)) return false;
  if (isMidInject(row) && row.cue !== "tmesis") return false;
  if (row.cue === "tmesis") return true;
  if (row.tmesis === true) return true;
  if (row.midInject === true && row.fourHundred === true) return true;
  if (
    row.midInject === true ||
    row.localCommand === true ||
    row.orphanResult === true ||
    row.parentBreak === true ||
    row.fourHundred === true ||
    row.slashEffort === true
  ) {
    return true;
  }
  return false;
}

/**
 * Score one tmesis pass against the editorial desk.
 * contiguous: defer local_command until the open assistant message has closed.
 * tmesis: slash ribbon spliced mid-clause; parentUuid broken; 400 forever.
 * mid-inject: names that path.
 */
export function scoreGate(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const row = normalizeBooth(ticket);
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);

  let verdict = IDLE_WORD;
  if (
    isMidInject(row) ||
    (row.midInject && ticket.preferSeed && seeded === PATH_WORD)
  ) {
    verdict = "mid-inject";
  } else if (isTmesisRow(row)) {
    verdict = "tmesis";
  } else if (isContiguous(row)) {
    verdict = "contiguous";
  } else if (
    row.midInject ||
    row.localCommand ||
    row.orphanResult ||
    row.parentBreak ||
    row.fourHundred ||
    row.slashEffort
  ) {
    verdict = "tmesis";
  } else if (mentionsIssueCue(ticket) && !seeded) {
    verdict = "tmesis";
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
    productWord: PRODUCT_WORD,
    hold,
    alarm: !hold,
    recover: RECOVER.includes(verdict),
    contiguous: verdict === "contiguous",
    tmesis: verdict === "tmesis" || verdict === SEEDED_WORD,
    midInject:
      row.midInject === true ||
      verdict === "mid-inject" ||
      verdict === PATH_WORD,
    localCommand: row.localCommand,
    orphanResult: row.orphanResult,
    parentBreak: row.parentBreak,
    fourHundred: row.fourHundred,
    slashEffort: row.slashEffort,
    cue: hold
      ? "contiguous"
      : row.midInject || verdict === "mid-inject"
        ? "mid-inject"
        : "tmesis",
    event: row.event,
    t: row.t,
    phrase: hold ? "admit contiguous" : "score tmesis",
    localInspect: inspectLocalCommand(row),
    orphanInspect: inspectOrphan(row),
    parentInspect: inspectParentBreak(row),
    sealInspect: inspectFourHundred(row),
    slashInspect: inspectSlashEffort(row),
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
      : TMESIS_WALK;
  const scored = rows.map((row) => ({
    ...normalizeBooth(row),
    ...scoreGate({ ...row, preferSeed: false }),
  }));
  const charged = scored.filter((row) => row.verdict === "tmesis");
  const path = scored.filter((row) => row.verdict === "mid-inject");
  const contiguous = scored.filter((row) => row.verdict === "contiguous");
  const headline =
    scored.find((row) => row.event === "tmesis") ||
    scored.find((row) => row.event === "mid-inject") ||
    scored.find((row) => row.event === "four-hundred") ||
    charged[charged.length - 1];
  let verdict = "contiguous";
  if (charged.length) verdict = "tmesis";
  else if (path.length && !contiguous.length) {
    verdict = "mid-inject";
  }
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
    tmesisCount: charged.length,
    pathCount: path.length,
    contiguousCount: contiguous.length,
    headline,
    rows: scored,
    phrase: HOLD.includes(verdict) ? "admit contiguous" : "score tmesis",
    note: headline
      ? "Running a slash command (/effort) while advisor is in flight injects local_command records mid-message and permanently 400s the session. Cite-only cousins #81397 #92509 #81233 #60523."
      : "published tmesis walk scored against contiguous vs tmesis",
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
    seeded !== "contiguous" &&
    seeded !== "tmesis" &&
    seeded !== "mid-inject" &&
    ticket.contiguous == null &&
    ticket.tmesis == null &&
    ticket.midInject == null &&
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
    contiguous: scored.contiguous ?? false,
    tmesis: scored.tmesis ?? false,
    midInject: scored.midInject ?? false,
    localCommand: scored.localCommand ?? false,
    orphanResult: scored.orphanResult ?? false,
    parentBreak: scored.parentBreak ?? false,
    fourHundred: scored.fourHundred ?? false,
    slashEffort: scored.slashEffort ?? false,
  };
}

export function diagnose(input) {
  return analyze(input);
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
    result.midInject || result.tmesis
      ? "kind=mid-inject"
      : "kind=open-folio",
    result.orphanResult || result.tmesis
      ? "ref=orphan-result"
      : "ref=editorial-desk",
    result.midInject || result.verdict === "mid-inject"
      ? "path=mid-inject"
      : "path=contiguous",
    result.cue === "contiguous"
      ? "cue=contiguous"
      : result.cue === "mid-inject"
        ? "cue=mid-inject"
        : "cue=tmesis",
  ].join("|");
}

export function handle(input) {
  const result = analyze(input);
  const booth = readBooth({
    contiguous: result.contiguous,
    tmesis: result.tmesis,
    midInject: result.midInject,
    localCommand: result.localCommand,
    orphanResult: result.orphanResult,
    parentBreak: result.parentBreak,
    fourHundred: result.fourHundred,
    slashEffort: result.slashEffort,
    proof: input && input.proof,
    log: input && input.log,
  });
  return {
    ...result,
    fingerprint: fingerprint(input),
    booth,
    local: inspectLocalCommand({
      contiguous: result.contiguous,
      tmesis: result.tmesis,
      localCommand: result.localCommand,
    }),
    orphan: inspectOrphan({
      contiguous: result.contiguous,
      tmesis: result.tmesis,
      orphanResult: result.orphanResult,
    }),
    parent: inspectParentBreak({
      contiguous: result.contiguous,
      tmesis: result.tmesis,
      parentBreak: result.parentBreak,
    }),
    seal: inspectFourHundred({
      contiguous: result.contiguous,
      tmesis: result.tmesis,
      fourHundred: result.fourHundred,
    }),
    slash: inspectSlashEffort({
      contiguous: result.contiguous,
      tmesis: result.tmesis,
      slashEffort: result.slashEffort,
    }),
    post: mapTmesis({
      contiguous: result.contiguous,
      tmesis: result.tmesis,
      midInject: result.midInject,
      fourHundred: result.fourHundred,
    }),
    stations: BOOTH_STATIONS.map((row) => ({
      ...row,
      tmesis: result.tmesis === true || result.verdict === "tmesis",
    })),
    leakPath: scoreMidInject({
      contiguous: result.contiguous === true && !result.tmesis,
      tmesis: result.tmesis,
      midInject: result.midInject,
      fourHundred: result.fourHundred,
      localCommand: result.localCommand,
    }),
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
      names: LEDGER_NAMES,
      ruledOut: [...RULED_OUT],
      expected: [...EXPECTED],
      suggestedFix: [...SUGGESTED_FIX],
      distribution: DISTRIBUTION,
      stations: BOOTH_STATIONS,
      fingerprintLines: [...FINGERPRINT_LINES],
      cousins: COUSINS.map((row) => row.issue),
      backups: BACKUPS.map((row) => row.issue),
      phrase: PHRASE,
      evidence: EVIDENCE_ROWS,
      hypothesis:
        "NON-BINDING (issue text): local_command records are appended to the open assistant message while server_tool_use awaits advisor_tool_result; parentUuid chain breaks; API 400 forever. Invite verify against #86198 text only. Do not claim a root cause in Claude Code source you have not seen.",
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
    const raw = chunks.join("");
    ticket = raw.trim() ? safeParse(raw) : emptyTicket();
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
