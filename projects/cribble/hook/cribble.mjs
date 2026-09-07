/**
 * Cribble — miller's coarse sieve / cribble bench.
 *
 * A cribble that should catch mid-path denyWrite globs but stays porous:
 * sandbox.filesystem.denyWrite enforces literal paths (blocked:EACCES)
 * and trailing double-star (blocked:EROFS), but silently ignores mid-path
 * /path/star-star/file and /path/star/file (WRITABLE). denyRead honours
 * the same mid-path shapes (blocked:EACCES). The rule still appears in
 * /status as active. Tool-layer permissions.deny can block Write while a
 * Bash subprocess remains writable.
 *
 * Encoded from anthropics/claude-code#92684 issue facts only.
 * Hypothesis (NON-BINDING): denyWrite has literal + trailing-**
 * branches and no glob matcher; mid-path falls through both.
 * Verify against issue text only; do not claim unread source.
 * No network. No exploits. No live Claude. No secrets. No payloads.
 * No sandbox bypass instructions. Educational diagnostic scorer only.
 */

export const VERDICTS = [
  "porous",
  "cribbed",
  "literal-eacces",
  "trail-erofs",
  "mid-star2-writable",
  "mid-star1-writable",
  "denyread-mid-enforced",
  "status-shows-active",
  "warning-misstates-read",
  "tool-vs-bash-asymmetry",
  "cousins",
  "has-clear-repro"
];

export const CHIPS = [...VERDICTS];

export const HOLD = new Set(["cribbed"]);

export const ALARM = new Set([
  "porous",
  "literal-eacces",
  "trail-erofs",
  "mid-star2-writable",
  "mid-star1-writable",
  "denyread-mid-enforced",
  "status-shows-active",
  "warning-misstates-read",
  "tool-vs-bash-asymmetry",
  "cousins",
  "has-clear-repro"
]);

export const IDLE_WORD = "porous";
export const SEEDED_WORD = "cribbed";

export const MEASURED = {
  issue: 92684,
  title:
    "[BUG] sandbox.filesystem.denyWrite silently ignores rules containing a mid-path wildcard (Linux)",
  state: "open",
  labels: ["bug", "has repro", "platform:linux", "area:security", "area:sandbox"],
  filed: "2026-09-07T15:21:07Z",
  updated: "2026-09-07T15:22:53Z",
  reporter: "Danubian-Narwhal",
  comments: 0,
  os: "Ubuntu/Debian Linux",
  platform: "linux-arm64",
  container: "node:22-bookworm-slim",
  surface: "Claude Code sandbox.filesystem.denyWrite mid-path wildcard",
  claudeCodeLive: "2.1.263",
  commit: "37ae3f38d765",
  sandboxVia: "managed-settings",
  managedSettingsPath: "/etc/claude-code/managed-settings.json",
  sandboxEnabled: true,
  allowUnsandboxedCommands: false,
  enableWeakerNestedSandbox: true,
  bubblewrapNested: true,
  priorBugReceipt: "613a9fb3-3860-4b55-8968-d566e485f315",
  priorBugDate: "2026-09-06",
  model: "Opus",
  target: "/workspace/docs/probe.txt",
  literalRule: "/workspace/docs/probe.txt",
  literalResult: "blocked:EACCES",
  midStar2Rule: "/workspace/**/probe.txt",
  midStar2Result: "WRITABLE",
  midStar1Rule: "/workspace/*/probe.txt",
  midStar1Result: "WRITABLE",
  trailStar2Rule: "/workspace/docs/**",
  trailStar2Result: "blocked:EROFS",
  bareStar2Rule: "/workspace/**",
  bareStar2Result: "blocked:EROFS",
  denyReadLiteral: "blocked:EACCES",
  denyReadMidStar2: "blocked:EACCES",
  denyReadMidStar1: "blocked:EACCES",
  statusShowsActive: true,
  warningOverstatesRead: true,
  warningOmitsDenyWrite: true,
  warningHidesSubprocessFailOpen: true,
  toolLayerWriteBlocked: true,
  bashSubprocessWritable: true,
  expected:
    "/workspace/**/probe.txt should block a write to /workspace/docs/probe.txt, exactly as the same rule blocks a read — or an unenforceable rule should be rejected loudly",
  actual:
    "mid-path denyWrite silently ignored (WRITABLE); literal EACCES and trailing /** EROFS hold; denyRead mid-path enforced; /status still shows the rule",
  impact:
    "documented denyWrite protection for host-executed config (git hooks, .envrc, .npmrc) stays writable to any subprocess when expressed with a mid-path wildcard"
};

export const DENY_WRITE_TABLE = [
  {
    id: "literal",
    rule: "/workspace/docs/probe.txt",
    target: "/workspace/docs/probe.txt",
    result: "blocked:EACCES",
    enforced: true,
    shape: "literal"
  },
  {
    id: "mid-star2",
    rule: "/workspace/**/probe.txt",
    target: "/workspace/docs/probe.txt",
    result: "WRITABLE",
    enforced: false,
    shape: "mid-path-**"
  },
  {
    id: "mid-star1",
    rule: "/workspace/*/probe.txt",
    target: "/workspace/docs/probe.txt",
    result: "WRITABLE",
    enforced: false,
    shape: "mid-path-*"
  },
  {
    id: "trail-star2",
    rule: "/workspace/docs/**",
    target: "/workspace/docs/probe.txt",
    result: "blocked:EROFS",
    enforced: true,
    shape: "trailing-**"
  },
  {
    id: "bare-star2",
    rule: "/workspace/**",
    target: "/workspace/docs/probe.txt",
    result: "blocked:EROFS",
    enforced: true,
    shape: "trailing-**"
  }
];

export const DENY_READ_TABLE = [
  {
    id: "literal",
    rule: "/workspace/docs/probe.txt",
    target: "/workspace/docs/probe.txt",
    result: "blocked:EACCES",
    enforced: true,
    shape: "literal"
  },
  {
    id: "mid-star2",
    rule: "/workspace/**/probe.txt",
    target: "/workspace/docs/probe.txt",
    result: "blocked:EACCES",
    enforced: true,
    shape: "mid-path-**"
  },
  {
    id: "mid-star1",
    rule: "/workspace/*/probe.txt",
    target: "/workspace/docs/probe.txt",
    result: "blocked:EACCES",
    enforced: true,
    shape: "mid-path-*"
  }
];

export const COUSINS = [
  {
    id: 84863,
    state: "open",
    note: "Cite-only cousin. OPEN. sandbox filesystem reads unrestricted; agent can silently break sandbox enforcement by editing settings.json. Different defect — no mid-path denyWrite fail-open table. Primary stays #92684."
  },
  {
    id: 74081,
    state: "open",
    note: "Cite-only cousin. OPEN. Linux sandbox recursive Read() deny globs expand to per-file bwrap binds → E2BIG. Different defect — fail-closed spawn overflow, not mid-path denyWrite WRITABLE. Primary stays #92684."
  },
  {
    id: 89762,
    state: "open",
    note: "Cite-only cousin. OPEN. Sandbox policy covers Bash only; Write and WebFetch are not gated by it. Different defect — tool-vs-sandbox split in the opposite direction. Primary stays #92684."
  },
  {
    id: 81266,
    state: "closed",
    note: "Cite-only cousin. Closed not_planned. sandbox.filesystem.denyRead does not block reads. Opposite of #92684's denyRead-mid-enforced table. Primary stays #92684."
  },
  {
    id: 85761,
    state: "closed",
    note: "Cite-only cousin. Closed completed. sandbox.filesystem.denyWithinAllow not enforced for Edit/Write tools. Different denyWithinAllow surface. Primary stays #92684."
  },
  {
    id: 86054,
    state: "closed",
    note: "Cite-only cousin. Closed not_planned. Bash sandbox filesystem isolation does not confine on Linux-in-Docker — default allow-list AND deny-list both bypassed. Broader confinement miss, not mid-path glob drop. Primary stays #92684."
  }
];

export const NOT_THIS_BUG = [
  {
    slug: "springe",
    issue: 92675,
    note: "Springe/#92675: plugin-native PreToolUse deny not enforced interactively. Different defect."
  },
  {
    slug: "gangway",
    issue: 92662,
    note: "Gangway/#92662: Chrome relaunch never re-dials native-host socket. Different defect."
  },
  {
    slug: "waybill",
    issue: 92624,
    note: "Waybill/#92624: named spawn foreign session id. Different defect."
  },
  {
    slug: "snatch",
    issue: 92583,
    note: "Snatch/#92583: session-end never reaps auto-backgrounded Bash orphans. Different defect."
  },
  {
    slug: "speakpipe",
    issue: 92646,
    note: "Speakpipe/#92646: Desktop overbroad SendMessage ban. Different defect."
  },
  {
    slug: "afterimage",
    issue: 92596,
    note: "Afterimage/#92596: Windows text paint deferred until message_stop. Different defect."
  },
  { slug: "oubliette", issue: 92095, note: "Oubliette/#92095: prior catalog paradigm. Different defect." },
  { slug: "sounder", note: "Sounder: prior catalog paradigm. Different defect." },
  { slug: "callboard", note: "Callboard: prior catalog paradigm. Different defect." },
  { slug: "knock", note: "Knock: prior catalog paradigm. Different defect." },
  { slug: "annunciator", note: "Annunciator: prior catalog paradigm. Different defect." }
];

export const MESHES = [
  {
    id: "literal",
    role: "literal oak stave / exact path",
    hail: "denyWrite literal → blocked:EACCES",
    taut: true
  },
  {
    id: "mesh",
    role: "mid-path wire / **/file and */file",
    hail: "denyWrite mid-path → WRITABLE (silently dropped)",
    taut: false
  },
  {
    id: "trail",
    role: "trailing /** remount / EROFS",
    hail: "denyWrite trailing ** → blocked:EROFS",
    taut: true
  }
];

const CHIP_REASONS = {
  porous:
    "ALARM: cribble porous; mid-path denyWrite silently dropped / WRITABLE. Score porous or admit cribbed",
  cribbed:
    "cribble already cribbed — deny correctly enforced. Mid-path denyWrite blocks the same way denyRead does. Seeded word is cribbed",
  "literal-eacces":
    "literal-eacces — denyWrite /workspace/docs/probe.txt against /workspace/docs/probe.txt measured blocked:EACCES. Literal branch holds",
  "trail-erofs":
    "trail-erofs — denyWrite /workspace/docs/** and /workspace/** against /workspace/docs/probe.txt measured blocked:EROFS. Trailing ** remounts the subtree read-only",
  "mid-star2-writable":
    "mid-star2-writable — denyWrite /workspace/**/probe.txt against /workspace/docs/probe.txt measured WRITABLE. Mid-path ** silently ignored",
  "mid-star1-writable":
    "mid-star1-writable — denyWrite /workspace/*/probe.txt against /workspace/docs/probe.txt measured WRITABLE. Mid-path * silently ignored",
  "denyread-mid-enforced":
    "denyread-mid-enforced — identical mid-path shapes on denyRead all measured blocked:EACCES. Not a bubblewrap expressiveness limit",
  "status-shows-active":
    "status-shows-active — the dropped mid-path rule still appears in /status as if it were active. Fail-open is invisible on the status faceplate",
  "warning-misstates-read":
    "warning-misstates-read — generic Linux glob warning says Edit/Read will be ignored. Overstates Read (denyRead mid-path holds); omits denyWrite; hides subprocess fail-open",
  "tool-vs-bash-asymmetry":
    "tool-vs-bash-asymmetry — tool-layer permissions.deny can block Write while a Bash subprocess remains writable. Dangerous asymmetry: the rule looks like it works when tested through the tool",
  cousins:
    "cite-only #84863 open (reads unrestricted / self-edit settings); #74081 open (Read deny globs E2BIG); #89762 open (sandbox covers Bash only); #81266 closed (denyRead does not block); #85761 closed (denyWithinAllow Edit/Write); #86054 closed (Linux-in-Docker confinement miss). Do not auto-pick as thesis. Not Springe/#92675. Not Gangway/#92662. Not Waybill/#92624. Not Snatch/#92583. Not Speakpipe/#92646. Not Afterimage/#92596. Not Oubliette/#92095. Not Bitts / Sounder / Callboard / Knock / Annunciator. Primary stays #92684",
  "has-clear-repro":
    "has-clear-repro — #92684 is labeled has repro: Claude Code 2.1.263; linux-arm64; Docker node:22-bookworm-slim; sandbox via managed-settings; bubblewrap nested; published denyWrite / denyRead result tables"
};

function boolish(value) {
  return value === true || value === "true" || value === 1;
}

function asText(value) {
  if (value == null) return "";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (Array.isArray(value)) return value.map(asText).join("\n");
  if (typeof value === "object") {
    return Object.values(value).map(asText).join("\n");
  }
  return String(value);
}

export function extractText(probe = {}) {
  return asText(probe);
}

export function porousSignal(text = "") {
  return /porous|silently ignored|silently dropped|WRITABLE|mid-path/i.test(String(text || ""));
}

export function cribbedSignal(text = "") {
  return /cribbed|deny correctly enforced|mesh taut|grit cribbed/i.test(String(text || ""));
}

export function literalEaccesSignal(text = "") {
  return /literal-eacces|blocked:EACCES|literal path/i.test(String(text || ""));
}

export function trailErofsSignal(text = "") {
  return /trail-erofs|blocked:EROFS|trailing \*\*|docs\/\*\*/i.test(String(text || ""));
}

export function midStar2Signal(text = "") {
  return /mid-star2-writable|\/\*\*\/probe\.txt|mid-path \*\*/i.test(String(text || ""));
}

export function midStar1Signal(text = "") {
  return /mid-star1-writable|\/\*\/probe\.txt|mid-path \*/i.test(String(text || ""));
}

export function denyReadMidSignal(text = "") {
  return /denyread-mid-enforced|denyRead mid-path|denyRead.*blocked:EACCES/i.test(
    String(text || "")
  );
}

export function statusActiveSignal(text = "") {
  return /status-shows-active|\/status.*active|appears in \/status/i.test(String(text || ""));
}

export function warningMisstatesSignal(text = "") {
  return /warning-misstates-read|Edit\/Read will be ignored|overstates Read/i.test(
    String(text || "")
  );
}

export function toolVsBashSignal(text = "") {
  return /tool-vs-bash-asymmetry|permissions\.deny|Bash subprocess remains writable/i.test(
    String(text || "")
  );
}

export function signals(probe = {}) {
  const blob = typeof probe === "string" ? probe : extractText(probe);
  return {
    porous: porousSignal(blob),
    cribbed: cribbedSignal(blob),
    literalEacces: literalEaccesSignal(blob),
    trailErofs: trailErofsSignal(blob),
    midStar2: midStar2Signal(blob),
    midStar1: midStar1Signal(blob),
    denyReadMid: denyReadMidSignal(blob),
    statusActive: statusActiveSignal(blob),
    warningMisstates: warningMisstatesSignal(blob),
    toolVsBash: toolVsBashSignal(blob)
  };
}

export function cribbleCribbed(probe = {}) {
  const t = probe && typeof probe === "object" && !Array.isArray(probe) ? probe : {};
  if (boolish(t.cribbleCribbed) || (boolish(t.cribbed) && !boolish(t.porous))) {
    return boolish(t.cribbleCribbed) || (boolish(t.cribbed) && !boolish(t.porous));
  }
  return false;
}

export function cellEnforced(kind, shape) {
  if (kind === "denyWrite") {
    const row = DENY_WRITE_TABLE.find((cell) => cell.shape === shape || cell.id === shape);
    if (!row) return null;
    return row.enforced;
  }
  if (kind === "denyRead") {
    const row = DENY_READ_TABLE.find((cell) => cell.shape === shape || cell.id === shape);
    if (!row) return null;
    return row.enforced;
  }
  return null;
}

export function fingerprint(probe = {}) {
  const t = probe && typeof probe === "object" && !Array.isArray(probe) ? probe : {};
  const hits = signals(t);
  const literalEacces =
    boolish(t.literalEacces) || t.literalResult === "blocked:EACCES" || hits.literalEacces;
  const trailErofs =
    boolish(t.trailErofs) || t.trailStar2Result === "blocked:EROFS" || hits.trailErofs;
  const midStar2Writable =
    boolish(t.midStar2Writable) || t.midStar2Result === "WRITABLE" || hits.midStar2;
  const midStar1Writable =
    boolish(t.midStar1Writable) || t.midStar1Result === "WRITABLE" || hits.midStar1;
  const denyReadMidEnforced =
    boolish(t.denyReadMidEnforced) || t.denyReadMidStar2 === "blocked:EACCES" || hits.denyReadMid;
  const statusShowsActive = boolish(t.statusShowsActive) || hits.statusActive;
  const warningMisstatesRead = boolish(t.warningMisstatesRead) || hits.warningMisstates;
  const toolVsBashAsymmetry =
    boolish(t.toolVsBashAsymmetry) ||
    (t.toolLayerWriteBlocked === true && t.bashSubprocessWritable === true) ||
    hits.toolVsBash;
  const cribbedClean = boolish(t.cribbed) || cribbleCribbed(t);
  const porousHit = boolish(t.porous) || (midStar2Writable && !boolish(t.cribbed));
  return {
    literalEacces,
    trailErofs,
    midStar2Writable,
    midStar1Writable,
    denyReadMidEnforced,
    statusShowsActive,
    warningMisstatesRead,
    toolVsBashAsymmetry,
    cribbedClean,
    porousHit,
    meshTaut: cribbleCribbed(t),
    signals: hits
  };
}

export function classify(probe = {}) {
  const t = probe && typeof probe === "object" && !Array.isArray(probe) ? probe : { entries: probe };
  const print = fingerprint(t);
  const porous = boolish(t.porous) || (print.porousHit && !boolish(t.cribbed));
  const cribbed = boolish(t.cribbed) || (print.cribbedClean && !boolish(t.porous));
  return {
    porous,
    cribbed,
    literalEacces: boolish(t.literalEacces) || print.literalEacces,
    trailErofs: boolish(t.trailErofs) || print.trailErofs,
    midStar2Writable: boolish(t.midStar2Writable) || print.midStar2Writable,
    midStar1Writable: boolish(t.midStar1Writable) || print.midStar1Writable,
    denyReadMidEnforced: boolish(t.denyReadMidEnforced) || print.denyReadMidEnforced,
    statusShowsActive: boolish(t.statusShowsActive) || print.statusShowsActive,
    warningMisstatesRead: boolish(t.warningMisstatesRead) || print.warningMisstatesRead,
    toolVsBashAsymmetry: boolish(t.toolVsBashAsymmetry) || print.toolVsBashAsymmetry,
    cousins: Array.isArray(t.cousinsCiteOnly) || boolish(t.cousins),
    hasClearRepro:
      boolish(t.hasClearRepro) ||
      (Array.isArray(t.labels) &&
        (t.labels.includes("has repro") || t.labels.includes("has-clear-repro"))),
    fingerprint: print,
    reporter: t.reporter || MEASURED.reporter,
    os: t.os || MEASURED.os
  };
}

export function seedPorous() {
  return {
    seed: "porous",
    issue: 92684,
    porous: true,
    cribbed: false,
    literalEacces: true,
    trailErofs: true,
    midStar2Writable: true,
    midStar1Writable: true,
    denyReadMidEnforced: true,
    statusShowsActive: true,
    warningMisstatesRead: true,
    toolVsBashAsymmetry: true,
    midStar2Result: "WRITABLE",
    midStar1Result: "WRITABLE",
    literalResult: "blocked:EACCES",
    trailStar2Result: "blocked:EROFS",
    denyReadMidStar2: "blocked:EACCES",
    toolLayerWriteBlocked: true,
    bashSubprocessWritable: true,
    outputText:
      "porous; mid-path denyWrite silently dropped / WRITABLE while literal EACCES and trailing /** EROFS hold",
    reporter: MEASURED.reporter
  };
}

export function seedCribbed() {
  return {
    seed: "cribbed",
    issue: 92684,
    porous: false,
    cribbed: true,
    cribbleCribbed: true,
    midStar2Result: "blocked:EACCES",
    midStar1Result: "blocked:EACCES",
    reporter: MEASURED.reporter
  };
}

export function seeds() {
  return {
    porous: seedPorous(),
    cribbed: seedCribbed(),
    "literal-eacces": {
      seed: "literal-eacces",
      issue: 92684,
      literalEacces: true,
      literalResult: "blocked:EACCES"
    },
    "trail-erofs": {
      seed: "trail-erofs",
      issue: 92684,
      trailErofs: true,
      trailStar2Result: "blocked:EROFS"
    },
    "mid-star2-writable": {
      seed: "mid-star2-writable",
      issue: 92684,
      midStar2Writable: true,
      midStar2Result: "WRITABLE"
    },
    "mid-star1-writable": {
      seed: "mid-star1-writable",
      issue: 92684,
      midStar1Writable: true,
      midStar1Result: "WRITABLE"
    },
    "denyread-mid-enforced": {
      seed: "denyread-mid-enforced",
      issue: 92684,
      denyReadMidEnforced: true,
      denyReadMidStar2: "blocked:EACCES"
    },
    "status-shows-active": {
      seed: "status-shows-active",
      issue: 92684,
      statusShowsActive: true
    },
    "warning-misstates-read": {
      seed: "warning-misstates-read",
      issue: 92684,
      warningMisstatesRead: true
    },
    "tool-vs-bash-asymmetry": {
      seed: "tool-vs-bash-asymmetry",
      issue: 92684,
      toolVsBashAsymmetry: true,
      toolLayerWriteBlocked: true,
      bashSubprocessWritable: true
    },
    cousins: {
      seed: "cousins",
      issue: 92684,
      cousins: true,
      cousinsCiteOnly: [84863, 74081, 89762, 81266, 85761, 86054]
    },
    "has-clear-repro": {
      seed: "has-clear-repro",
      issue: 92684,
      hasClearRepro: true,
      labels: MEASURED.labels
    }
  };
}

export function scoreFields(probe = {}) {
  return classify(probe);
}

export function analyze(input = {}) {
  const classified = classify(input);
  const decided = decide(input);
  return {
    ...classified,
    verdict: decided.verdict,
    reasons: decided.reasons,
    chips: decided.chips
  };
}

export function score(input = {}) {
  return decide(input);
}

export function handle(input = {}) {
  const probe =
    typeof input === "string"
      ? (() => {
          try {
            return JSON.parse(input);
          } catch {
            return {};
          }
        })()
      : input;
  return decide(probe);
}

const SPECIFIC_SEEDS = [
  "cousins",
  "literal-eacces",
  "trail-erofs",
  "mid-star2-writable",
  "mid-star1-writable",
  "denyread-mid-enforced",
  "status-shows-active",
  "warning-misstates-read",
  "tool-vs-bash-asymmetry",
  "has-clear-repro"
];

const FLAG_FOR_SEED = {
  "literal-eacces": (t, c) => boolish(t.literalEacces) || c.literalEacces,
  "trail-erofs": (t, c) => boolish(t.trailErofs) || c.trailErofs,
  "mid-star2-writable": (t, c) => boolish(t.midStar2Writable) || c.midStar2Writable,
  "mid-star1-writable": (t, c) => boolish(t.midStar1Writable) || c.midStar1Writable,
  "denyread-mid-enforced": (t, c) => boolish(t.denyReadMidEnforced) || c.denyReadMidEnforced,
  "status-shows-active": (t, c) => boolish(t.statusShowsActive) || c.statusShowsActive,
  "warning-misstates-read": (t, c) => boolish(t.warningMisstatesRead) || c.warningMisstatesRead,
  "tool-vs-bash-asymmetry": (t, c) => boolish(t.toolVsBashAsymmetry) || c.toolVsBashAsymmetry,
  "has-clear-repro": (t, c) => boolish(t.hasClearRepro) || c.hasClearRepro,
  cousins: (t, c) => Array.isArray(t.cousinsCiteOnly) || c.cousins
};

export function decide(probe = {}) {
  const t = probe && typeof probe === "object" && !Array.isArray(probe) ? probe : { entries: probe };
  const seed = String(t.seed || "");
  const cribble = classify(t);
  const reasons = [];

  if (seed === "cousins" || (Array.isArray(t.cousinsCiteOnly) && seed === "cousins")) {
    reasons.push(CHIP_REASONS.cousins);
    return {
      verdict: "cousins",
      reasons,
      porous: true,
      cribbed: false,
      chips: ["cousins", "porous"],
      cribble
    };
  }

  if (SPECIFIC_SEEDS.includes(seed) && seed !== "cousins") {
    reasons.push(CHIP_REASONS[seed]);
    return {
      verdict: seed,
      reasons,
      porous: true,
      cribbed: false,
      chips: [seed, "porous"],
      cribble
    };
  }

  for (const name of SPECIFIC_SEEDS) {
    if (name === "cousins") continue;
    const flagHit = FLAG_FOR_SEED[name];
    if (flagHit && flagHit(t, cribble) && seed !== "porous" && seed !== "cribbed") {
      reasons.push(CHIP_REASONS[name]);
      return {
        verdict: name,
        reasons,
        porous: true,
        cribbed: false,
        chips: [name, "porous"],
        cribble
      };
    }
  }

  if (
    seed === "cribbed" ||
    (t.cribbed === true && t.porous !== true && seed !== "porous") ||
    (cribble.cribbed && !cribble.porous && seed !== "porous")
  ) {
    reasons.push(CHIP_REASONS.cribbed);
    return {
      verdict: "cribbed",
      reasons,
      porous: false,
      cribbed: true,
      chips: ["cribbed"],
      cribble
    };
  }

  if (t.porous === true || seed === "porous" || (cribble.porous && !cribble.cribbed)) {
    reasons.push(CHIP_REASONS.porous);
    const chips = ["porous"];
    if (t.literalEacces === true || cribble.literalEacces) chips.push("literal-eacces");
    if (t.trailErofs === true || cribble.trailErofs) chips.push("trail-erofs");
    if (t.midStar2Writable === true || cribble.midStar2Writable) chips.push("mid-star2-writable");
    if (t.midStar1Writable === true || cribble.midStar1Writable) chips.push("mid-star1-writable");
    if (t.denyReadMidEnforced === true || cribble.denyReadMidEnforced) {
      chips.push("denyread-mid-enforced");
    }
    if (t.statusShowsActive === true || cribble.statusShowsActive) chips.push("status-shows-active");
    if (t.warningMisstatesRead === true || cribble.warningMisstatesRead) {
      chips.push("warning-misstates-read");
    }
    if (t.toolVsBashAsymmetry === true || cribble.toolVsBashAsymmetry) {
      chips.push("tool-vs-bash-asymmetry");
    }
    return {
      verdict: "porous",
      reasons,
      porous: true,
      cribbed: false,
      chips: [...new Set(chips)],
      cribble
    };
  }

  if (HOLD.has(seed)) {
    reasons.push(`seeded ${seed}`);
    return { verdict: seed, reasons, porous: false, cribbed: true, chips: [seed], cribble };
  }

  if (ALARM.has(seed)) {
    reasons.push(`seeded ${seed}`);
    return {
      verdict: seed,
      reasons,
      porous: true,
      cribbed: false,
      chips: [seed],
      cribble
    };
  }

  reasons.push(
    "empty probe; idle cribble is porous — ALARM: mid-path denyWrite silently dropped / WRITABLE"
  );
  return {
    verdict: "porous",
    reasons,
    porous: true,
    cribbed: false,
    chips: ["porous"],
    cribble
  };
}
