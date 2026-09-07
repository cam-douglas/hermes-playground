/**
 * Cringle sailmaker's loft / cringle-and-grommet splicing bench.
 * permissions.deny Bash rules match the program name of each
 * sub-command in the parsed AST. Before matching, Claude Code
 * unwraps a fixed eight-item list of wrapper programs
 * (function ax() in ~/.local/share/claude/versions/2.1.258 per
 * the reporter) plus leading VAR=value assignments. There is
 * no fallback and no attempt to resolve what an unknown wrapper
 * actually executes. Any other PATH wrapper that forwards args
 * shifts the program name so deny/allow rules for the
 * underlying program are silently skipped — the rope slips
 * past the eye.
 *
 * Encoded from #92542 issue facts only.
 * Hypothesis (NON-BINDING): ax() peels only the eight named
 * wrappers and env-prefix tokens, then binds Bash(...) rules
 * to the remaining leading program token; an unknown wrapper
 * is treated as the program itself, so the deny pattern never
 * sees the forwarded command. Verify nothing in closed source;
 * encode issue facts only.
 * No network. No exploits. No live Claude.
 * Do not invent source-code claims.
 */

export const CHIPS = [
  "slipped",
  "sighted",
  "eight-unwrap",
  "wrapper-shift",
  "compound-caught",
  "path-wrapper-bypass",
  "cousins"
];

export const HOLD = new Set(["sighted"]);

export const ALARM = new Set([
  "slipped",
  "eight-unwrap",
  "wrapper-shift",
  "compound-caught",
  "path-wrapper-bypass",
  "cousins"
]);

export const EIGHT_UNWRAP = [
  "timeout",
  "time",
  "nice",
  "stdbuf",
  "nohup",
  "command",
  "builtin",
  "noglob"
];

export const MEASURED = {
  issue: 92542,
  title: "[BUG] Bash deny rules bypassed by any wrapper program outside ax()'s 8-item unwrap list",
  state: "open",
  labels: [
    "bug",
    "has repro",
    "platform:linux",
    "area:security",
    "area:bash",
    "area:permissions"
  ],
  updated: "2026-09-06T19:38:38Z",
  filed: "2026-09-06T19:37:44Z",
  reporter: "ppravdin",
  version: "2.1.258",
  os: "Linux",
  axHint: "~/.local/share/claude/versions/2.1.258 function ax()",
  denyRule: "Bash(git add -A*)",
  denyProgram: "git",
  denyRest: "add -A*",
  eightUnwrap: EIGHT_UNWRAP.slice(),
  plusAssignments: "leading VAR=value assignments",
  noFallback: true,
  notEnvPrefix: 31558,
  notCommandChaining: 4956,
  impactFiles: 103,
  impactInsertions: 657373,
  denials: [
    "2026-08-27T18:15:51Z",
    "2026-08-28T07:23:26Z",
    "2026-08-28T07:42:37Z",
    "2026-08-28T07:59:53Z",
    "2026-08-28T09:35:12Z",
    "2026-08-28T09:41:26Z"
  ],
  bypasses: [
    "2026-09-06T16:57:28Z",
    "2026-09-06T17:12:26Z",
    "2026-09-06T18:44:10Z",
    "2026-09-06T19:01:59Z"
  ],
  promptsSuppressed: true,
  bypassIndependentOfPrompts: true,
  relatedWrapperAdvice: 49874
};

export const REPROS = {
  bareDenied: "git add -A",
  listedUnwrap: "nice git add -A",
  assignmentThenGit: "FOO=1 git add -A",
  unknownWrapper: "mywrap git add -A",
  pathWrapper: "envwrap git add -A",
  compoundCd: "cd /tmp; git revert HEAD",
  compoundRm: "rm -f /tmp/x; git add -A .",
  compoundAnd: "git add -A && git status"
};

export const COUSINS = [
  {
    id: 49874,
    state: "closed",
    note: "CLOSED. Bash(cmd *) allowlist silently bypassed for commands interpolating user env vars; uninformative denial. Recommends putting commands behind a wrapper so allowlist matching stops seeing them — same mechanism that defeats deny. Primary stays #92542."
  },
  {
    id: 31558,
    state: "closed",
    note: "CLOSED. Bypass deny via env variable prefix. Issue #92542 is explicit this is NOT that case. Primary stays #92542."
  },
  {
    id: 4956,
    state: "closed",
    note: "CLOSED. Bash Permission Bypass via Command Chaining. Issue #92542 is explicit this is NOT that case; compound splitting works. Primary stays #92542."
  }
];

function boolish(value) {
  return value === true || value === "true" || value === 1;
}

function tokenize(command) {
  return String(command ?? "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

function splitCompounds(command) {
  const text = String(command ?? "").trim();
  if (!text) return [];
  return text
    .split(/\s*(?:&&|\|\||;)\s*/)
    .map((part) => part.trim())
    .filter(Boolean);
}

export function isAssignment(token) {
  return /^[A-Za-z_][A-Za-z0-9_]*=/.test(String(token || ""));
}

export function unwrapProgram(command) {
  const tokens = tokenize(command);
  const peeled = [];
  let i = 0;
  while (i < tokens.length && isAssignment(tokens[i])) {
    peeled.push({ kind: "assignment", token: tokens[i] });
    i += 1;
  }
  while (i < tokens.length && EIGHT_UNWRAP.includes(tokens[i])) {
    peeled.push({ kind: "listed-wrapper", token: tokens[i] });
    i += 1;
  }
  const program = tokens[i] || "";
  const rest = tokens.slice(i + 1);
  const unknownWrapper =
    Boolean(program) &&
    !EIGHT_UNWRAP.includes(program) &&
    !isAssignment(program) &&
    rest.length > 0 &&
    program !== MEASURED.denyProgram;
  return {
    tokens,
    peeled,
    program,
    rest,
    unknownWrapper,
    listedUnwrapped: peeled.some((p) => p.kind === "listed-wrapper"),
    assignmentStripped: peeled.some((p) => p.kind === "assignment")
  };
}

export function denyConsulted(command, denyProgram = MEASURED.denyProgram) {
  const parts = splitCompounds(command);
  if (!parts.length) {
    const one = unwrapProgram(command);
    const consulted = one.program === denyProgram;
    return {
      consulted,
      program: one.program,
      parts: [one],
      slipped: one.unknownWrapper && !consulted
    };
  }
  const unwrapped = parts.map((part) => unwrapProgram(part));
  const consulted = unwrapped.some((u) => u.program === denyProgram);
  const slipped = unwrapped.some((u) => u.unknownWrapper && u.program !== denyProgram);
  return {
    consulted,
    program: unwrapped[0]?.program || "",
    parts: unwrapped,
    slipped
  };
}

export function classify(probe = {}) {
  const t = probe && typeof probe === "object" ? probe : {};
  const command = String(t.command ?? t.text ?? t.cmd ?? "");
  const eye = command ? unwrapProgram(command) : unwrapProgram("");
  const match = command
    ? denyConsulted(command, t.denyProgram || MEASURED.denyProgram)
    : { consulted: false, program: "", parts: [], slipped: false };
  const slipped =
    boolish(t.slipped) ||
    match.slipped ||
    boolish(t.bypass) ||
    boolish(t.wrapperShift);
  const sighted =
    boolish(t.sighted) ||
    (boolish(t.hold) && !slipped);
  const compound =
    boolish(t.compoundCaught) ||
    boolish(t.compound) ||
    /;|&&|\|\|/.test(command);
  const listed =
    boolish(t.eightUnwrap) ||
    eye.listedUnwrapped;
  return {
    command,
    program: eye.program || match.program,
    rest: eye.rest,
    peeled: eye.peeled,
    unknownWrapper: eye.unknownWrapper,
    listedUnwrapped: listed,
    assignmentStripped: eye.assignmentStripped,
    denyConsulted: match.consulted,
    slipped,
    sighted,
    compound,
    denyRule: t.denyRule || MEASURED.denyRule,
    version: t.version || MEASURED.version,
    platform: t.platform || "linux",
    os: t.os || MEASURED.os
  };
}

export function seedSlipped() {
  return {
    seed: "slipped",
    issue: 92542,
    slipped: true,
    sighted: false,
    command: REPROS.unknownWrapper,
    denyRule: MEASURED.denyRule,
    platform: "linux",
    os: MEASURED.os,
    version: MEASURED.version
  };
}

export function seedSighted() {
  return {
    seed: "sighted",
    issue: 92542,
    slipped: false,
    sighted: true,
    command: REPROS.unknownWrapper,
    denyRule: MEASURED.denyRule,
    platform: "linux",
    os: MEASURED.os,
    version: MEASURED.version
  };
}

export function scoreFields(probe = {}) {
  return classify(probe);
}

export function decide(probe = {}) {
  const t = probe && typeof probe === "object" ? probe : {};
  const seed = String(t.seed || "");
  const cringle = classify(t);
  const reasons = [];

  if (seed === "cousins" || (Array.isArray(t.cousinsCiteOnly) && seed === "cousins")) {
    reasons.push(
      "cite-only #49874 CLOSED Bash(cmd *) allowlist silently bypassed for commands interpolating user env vars; uninformative denial — recommends wrappers so allowlist matching stops seeing them, the same mechanism that defeats deny; #31558 CLOSED bypass deny via env variable prefix — #92542 is explicit this is NOT that case; #4956 CLOSED Bash Permission Bypass via Command Chaining — #92542 is explicit this is NOT that case and compound splitting works. Same permissions/Bash matching neighbourhood, different defects. Primary stays #92542. Do not treat Kerf/#92539 Remove-Item spaced-path cousins as this loft"
    );
    return {
      verdict: "cousins",
      reasons,
      slipped: true,
      sighted: false,
      chips: ["cousins", "slipped"],
      cringle
    };
  }

  if (
    seed === "sighted" ||
    (t.sighted === true && t.slipped !== true)
  ) {
    reasons.push(
      "matching is sighted — unwrap-aware; an unknown wrapper does not fall through. Unmatched escalates to a prompt rather than silently skipping the deny rule. Seeded word is sighted"
    );
    return {
      verdict: "sighted",
      reasons,
      slipped: false,
      sighted: true,
      chips: ["sighted"],
      cringle
    };
  }

  if (seed === "path-wrapper-bypass" || t.pathWrapperBypass === true) {
    reasons.push(
      "permissions.deny includes Bash(git add -A*). Bare git add -A denied six times (2026-08-27T18:15:51Z, 2026-08-28T07:23:26Z, 07:42:37Z, 07:59:53Z, 09:35:12Z, 09:41:26Z). Same op preceded by any non-listed wrapper on PATH that forwards args ran four times (2026-09-06T16:57:28Z, 17:12:26Z, 18:44:10Z, 19:01:59Z), committing 103 unintended files / 657,373 insertions. Deny never consulted"
    );
    return {
      verdict: "path-wrapper-bypass",
      reasons,
      slipped: true,
      sighted: false,
      chips: ["path-wrapper-bypass", "slipped"],
      cringle
    };
  }

  if (seed === "compound-caught" || t.compoundCaught === true) {
    reasons.push(
      "Compound splitting works: cd <dir>; git revert ..., rm -f <path>; git add -A ..., and git add -A && git status were denied correctly in the same environment. The AST splitter is not the hole. The hole is the wrapper allowlist itself"
    );
    return {
      verdict: "compound-caught",
      reasons,
      slipped: false,
      sighted: false,
      chips: ["compound-caught"],
      cringle
    };
  }

  if (seed === "wrapper-shift" || t.wrapperShift === true) {
    reasons.push(
      "Any wrapper binary or script on PATH that forwards args shifts the program name. Deny and allow rules for the underlying program are silently skipped. Not the env-var prefix case (#31558, closed) and not command-chaining (#4956)"
    );
    return {
      verdict: "wrapper-shift",
      reasons,
      slipped: true,
      sighted: false,
      chips: ["wrapper-shift", "slipped"],
      cringle
    };
  }

  if (seed === "eight-unwrap" || t.eightUnwrap === true) {
    reasons.push(
      "Before matching, Claude Code unwraps a fixed eight-item list — timeout, time, nice, stdbuf, nohup, command, builtin, noglob — plus leading VAR=value assignments. Function ax() in ~/.local/share/claude/versions/2.1.258 per the reporter. No fallback; no attempt to resolve what an unknown wrapper actually executes"
    );
    return {
      verdict: "eight-unwrap",
      reasons,
      slipped: false,
      sighted: false,
      chips: ["eight-unwrap"],
      cringle
    };
  }

  if (
    t.slipped === true ||
    seed === "slipped" ||
    (cringle.slipped && !cringle.sighted)
  ) {
    reasons.push(
      "A cringle is the reinforced eye in a sail through which a rope is reeved. Claude Code's Bash permissions.deny matching unwraps only a fixed eight-item wrapper list before reading the program name. Any other PATH wrapper that execs its arguments shifts the program name so the deny rule never sees the real command — the rope slips past the eye"
    );
    const chips = ["slipped"];
    if (t.wrapperShift === true || cringle.unknownWrapper) chips.push("wrapper-shift");
    if (t.pathWrapperBypass === true) chips.push("path-wrapper-bypass");
    return {
      verdict: "slipped",
      reasons,
      slipped: true,
      sighted: false,
      chips: [...new Set(chips)],
      cringle
    };
  }

  if (HOLD.has(seed)) {
    reasons.push(`seeded ${seed}`);
    return { verdict: seed, reasons, slipped: false, sighted: true, chips: [seed], cringle };
  }

  if (ALARM.has(seed)) {
    reasons.push(`seeded ${seed}`);
    return {
      verdict: seed,
      reasons,
      slipped: seed !== "compound-caught" && seed !== "eight-unwrap",
      sighted: false,
      chips: [seed],
      cringle
    };
  }

  reasons.push(
    "empty probe; idle sailmaker's loft is slipped — eight-item unwrap list; unknown PATH wrapper shifts the program token past the eye; deny never consulted"
  );
  return {
    verdict: "slipped",
    reasons,
    slipped: true,
    sighted: false,
    chips: ["slipped"],
    cringle
  };
}
