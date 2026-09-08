/**
 * Dryjoint — electronics dry-joint / cold-solder bench.
 *
 * VS Code extension chat markdown file links are styled as links but
 * clicking them does nothing. The system prompt (`## Code References
 * in Text`) tells Claude to emit `[name](path)` file references. The
 * host already has a working open_file bridge used by file chips and
 * the diff view. Rendered `<a>` anchors in chat are never wired to
 * that bridge. A second dry joint: `showTextDocument(uri).then(cb)`
 * has no rejection handler, so binary files (.png/.pdf) reject silent.
 *
 * Encoded from anthropics/claude-code#92809 issue facts only.
 * Hypothesis (NON-BINDING): chat `<a>` anchors never call the existing
 * openFile bridge; showTextDocument.then(cb) has no catch so binary
 * opens fail silent. Invite verify against issue text only — do not
 * invent unread source. Do NOT implement a fix in anthropics/claude-code.
 * No network. No exploits. No live Claude. No secrets. No payloads.
 * Educational diagnostic scorer only.
 */

export const VERDICTS = [
  "fused",
  "dry",
  "bonded",
  "unwired-anchor",
  "bridge-exists-unused",
  "silent-binary-reject",
  "showTextDocument-no-catch",
  "markdown-mandate",
  "has-clear-repro",
  "cousins"
];

export const CHIPS = [...VERDICTS];

export const HOLD = new Set(["fused", "bonded"]);

export const ALARM = new Set([
  "dry",
  "unwired-anchor",
  "bridge-exists-unused",
  "silent-binary-reject",
  "showTextDocument-no-catch",
  "markdown-mandate",
  "has-clear-repro",
  "cousins"
]);

export const IDLE_WORD = "fused";
export const SEEDED_WORD = "dry";
export const ADMIT_WORD = "bonded";

export const OPEN_FILE_BRIDGE = {
  webview:
    'openFile(filePath, location) -> sendRequest({type: "request", requestId, request: {type: "open_file", filePath, location}})',
  host: 'case "open_file": -> this.openFile(request.filePath, request.location)',
  users: ["file chips", "diff view"]
};

export const SHOW_TEXT_DOCUMENT = "vscode.window.showTextDocument(uri).then(cb)";

export const PUBLISHED_REPRO = {
  ask: "Ask Claude to create two files in a subfolder, e.g. docs/note.md and docs/chart.png.",
  reply: "Claude replies with [note.md](docs/note.md) and [chart.png](docs/chart.png) — the format its system prompt mandates.",
  click: "Click either link in the chat panel. Nothing happens.",
  also: "Same result with absolute paths, file:/// URLs and directory paths (previously reported in #51015)."
};

export const MEASURED = {
  issue: 92809,
  title: "[BUG] VS Code extension: chat file links are never wired to the existing open_file bridge",
  state: "open",
  labels: ["bug", "has repro", "platform:vscode"],
  filed: "2026-09-08T08:45:25Z",
  reporter: "0nelight",
  extension: "anthropic.claude-code-2.1.263-linux-x64",
  vscode: "1.132.0",
  os: "Debian 13 (trixie), KDE Plasma on X11",
  lastWorking: "2.1.4 (per #10846)",
  stillBroken: "2.1.263",
  surface:
    "VS Code chat markdown file links are styled as links but never call the existing open_file bridge; binary showTextDocument rejects silent",
  expected:
    "Clicking a file link should open the file — text in the editor, binary in its own viewer — and a directory should reveal in the Explorer. Line anchors (file.md#L42, #L42-L51) should map to the location argument the host already accepts.",
  actual:
    "Nothing. The click is a silent no-op. Defect 2 produces an unhandled promise rejection from showTextDocument; nothing surfaces to the user.",
  systemPrompt: "## Code References in Text",
  markdownFormat: "[name](path)",
  bridge: OPEN_FILE_BRIDGE,
  showTextDocument: SHOW_TEXT_DOCUMENT,
  binaryExamples: [".png", ".pdf"],
  desktopNotAtFault:
    "VS Code from native .deb (no Flatpak/Snap), xdg-open present, three xdg-desktop-portal processes, image/png handler registered — none of that is ever reached.",
  citedFix:
    "Catalog product only — do not implement that fix here in anthropics/claude-code. Webview: parse unsized href + optional #L<n>/#L<n>-L<m> and call existing openFile(). Host: give showTextDocument(uri).then(cb) a rejection handler that falls back to vscode.open.",
  workaround:
    "https://github.com/0nelight/claude-code-vscode-linkfix — cited only; do not ship a live patch here.",
  hypothesis:
    "NON-BINDING: chat <a> anchors never call the existing openFile bridge; showTextDocument.then(cb) has no catch so binary opens fail silent. Invite verify against issue text only."
};

export const JOINT_LEDGER = [
  {
    id: "bridge",
    role: "existing open_file pad / file chips + diff view",
    tally: "webview openFile → sendRequest({type:\"open_file\"}) → extension case \"open_file\" → this.openFile",
    note: "the host already resolves cwd, falls back when missing, and revealInExplorer for directories"
  },
  {
    id: "anchor",
    role: "chat <a> dry joint / styled but unwired",
    tally: "rendered anchors never call openFile",
    note: "looks bonded (link styling) but carries no current (click is a silent no-op)"
  },
  {
    id: "binary",
    role: "showTextDocument dry joint / no catch",
    tally: "showTextDocument(uri).then(cb) — no rejection handler",
    note: ".png / .pdf reject; unhandled; user sees nothing even after anchors are wired"
  }
];

export const REPRO_TABLE = [
  { step: "mandate", mark: "[name](path)", note: "system prompt ## Code References in Text" },
  { step: "text link", mark: "[note.md](docs/note.md)", note: "click does nothing" },
  { step: "binary link", mark: "[chart.png](docs/chart.png)", note: "would still fail silent after wiring" },
  { step: "bridge", mark: "open_file", note: "already used by file chips and diff view" }
];

export const COUSINS = [
  {
    id: 10846,
    state: "closed",
    locked: true,
    title: "[BUG] Valid markdown links in Claude Caude VsCode extension do not open files",
    note: "cite-only — closed/locked; reported fixed in v2.1.4; not the #92809 root-cause writeup"
  },
  {
    id: 16056,
    state: "closed",
    locked: true,
    title: "[BUG] Markdown file links in VS Code extension not clickable on macOS",
    note: "cite-only — closed/locked prior report; primary stays #92809"
  },
  {
    id: 44713,
    state: "closed",
    locked: true,
    title: "[BUG] File links in Claude Code panel non-functional - regression from v2.1.4 fix",
    note: "cite-only — closed/locked; broken again by v2.1.92"
  },
  {
    id: 51015,
    state: "closed",
    locked: true,
    title: "VSCode extension: clickable-styled file links in chat do nothing on click",
    note: "cite-only — closed/locked; absolute paths, file:/// URLs, directory paths"
  },
  {
    id: 57100,
    state: "closed",
    locked: true,
    title: "[BUG] Clickable file links in chat no longer open files (regression in VS Code extension)",
    note: "cite-only — closed/locked; 2.1.132 recurrence; primary stays #92809"
  },
  {
    id: 72889,
    state: "closed",
    locked: true,
    title: "VSCode extension: file links in chat panel look clickable but don't navigate or reveal the file",
    note: "cite-only — closed prior report; primary stays #92809"
  }
];

export const NOT_THIS_BUG = [
  {
    slug: "dinkus",
    issue: 92798,
    note: "Dinkus/#92798 already shipped — plugin-settings sed frontmatter range. Do not touch."
  },
  {
    slug: "homonym",
    issue: 92787,
    note: "Homonym/#92787 already shipped — Desktop UUID connector mounts. Do not touch."
  },
  {
    slug: "rushlight",
    issue: 92784,
    note: "Rushlight/#92784 already shipped — session-scoped TCC AppData. Do not touch."
  },
  {
    slug: "clepsydra",
    issue: 92776,
    note: "Clepsydra/#92776 already shipped — OTel mid-session meter. Do not touch."
  },
  {
    slug: "letoff",
    issue: 92771,
    note: "Letoff/#92771 already shipped — libuv Shift+Enter flatten. Do not touch."
  },
  {
    slug: "ptybind",
    issue: 92757,
    note: "Ptybind/#92757 already shipped — ConPTY editor keys. Do not touch."
  },
  {
    slug: "espagnolette",
    issue: 92694,
    note: "Espagnolette/#92694 already shipped — AskUserQuestion selection keys. Do not touch."
  }
];

export const BACKUPS = [
  { id: 92788, note: "AskUserQuestion free-text discard / alt Quill — README only; do not auto-pick" },
  { id: 92794, note: "classic mouse dead Ptyxis — README only; do not auto-pick" },
  { id: 92801, note: "workspace trust not persisted — README only; do not auto-pick" },
  { id: 92761, note: "worktree plugin first-row / alt Cadet — README only; do not auto-pick" },
  { id: 92769, note: "disable-model-invocation / alt Clevis — README only; do not auto-pick" },
  { id: 92781, note: "Scrollwheel — README only; do not auto-pick" },
  { id: 92793, note: "Bazaar — README only; do not auto-pick" },
  { id: 92734, note: "teleport / alt Portage — README only; do not auto-pick" }
];

const CHIP_REASONS = {
  fused:
    "HOLD: pad is fused — chat markdown file links call the existing open_file bridge; binary opens have a catch. Score dry or admit bonded",
  dry:
    "ALARM: chat <a> anchors stay dry (never call the existing open_file bridge) and binary showTextDocument rejects silent. Score dry or admit bonded",
  bonded:
    "pad already bonded — hypothetical: chat anchors call existing openFile(); showTextDocument has a rejection handler that falls back to vscode.open. Admit word is bonded",
  "unwired-anchor":
    "unwired-anchor — rendered <a> elements in the chat panel are styled as links but never call openFile(); the click is a silent no-op",
  "bridge-exists-unused":
    "bridge-exists-unused — webview openFile → sendRequest({type:\"open_file\"}) → extension case \"open_file\" → this.openFile is already used by file chips and the diff view; chat anchors never reach it",
  "silent-binary-reject":
    "silent-binary-reject — showTextDocument rejects for non-text files (.png/.pdf); with no onRejected and no .catch the user sees nothing at all",
  "showTextDocument-no-catch":
    "showTextDocument-no-catch — vscode.window.showTextDocument(uri).then(cb) has no rejection handler; defect 2 stays dry even after anchors are wired",
  "markdown-mandate":
    "markdown-mandate — the extension system prompt (## Code References in Text) instructs Claude to emit [name](path) file references; those links are dead on arrival",
  cousins:
    "cite-only neighbourhood — #10846 #16056 #44713 #51015 #57100 #72889 CLOSED/LOCKED prior reports; none identified the two-defect cause. Primary stays #92809",
  "has-clear-repro":
    "has-clear-repro — #92809 is labeled has repro: ask for docs/note.md + docs/chart.png; Claude emits [name](path); click does nothing; filed 2026-09-08T08:45:25Z; labels bug, has repro, platform:vscode"
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

/**
 * Educational reconstruction of the published file-ref href
 * (not a live VS Code fix): optional #L<n> / #L<n>-L<m>.
 */
export function parseFileHref(href = "") {
  const raw = String(href || "");
  const hash = raw.indexOf("#");
  const path = hash === -1 ? raw : raw.slice(0, hash);
  const frag = hash === -1 ? "" : raw.slice(hash + 1);
  let location = null;
  const range = /^L(\d+)-L(\d+)$/.exec(frag);
  const line = /^L(\d+)$/.exec(frag);
  if (range) location = { start: Number(range[1]), end: Number(range[2]) };
  else if (line) location = { start: Number(line[1]) };
  const schemeMatch = /^([a-zA-Z][a-zA-Z0-9+.-]*):/.exec(path);
  return {
    path,
    fragment: frag,
    location,
    scheme: schemeMatch ? schemeMatch[1] : ""
  };
}

export function hrefLooksLikeFileRef(href = "") {
  const raw = String(href || "");
  if (!raw) return false;
  if (raw.startsWith("#")) return false;
  const parsed = parseFileHref(raw);
  if (parsed.scheme && parsed.scheme !== "file") return false;
  return true;
}

/**
 * Educational: rendered chat <a> never call openFile unless a probe
 * marks the pad wired. This is a diagnostic, not a host patch.
 */
export function anchorCallsBridge(probe = {}) {
  const t = probe && typeof probe === "object" && !Array.isArray(probe) ? probe : {};
  return boolish(t.anchorWired) || boolish(t.anchorCallsOpenFile) || boolish(t.bonded);
}

export function bridgeExists(probe = {}) {
  const t = probe && typeof probe === "object" && !Array.isArray(probe) ? probe : {};
  if (boolish(t.bridgeExists) || boolish(t.bridgeExistsUnused)) return true;
  return /open_file|file chips|diff view/i.test(extractText(t));
}

export function showTextDocumentHasCatch(snippet = "") {
  const s = String(snippet || "");
  return /\.catch\s*\(|onRejected/.test(s);
}

export function binaryWouldReject(ext = "") {
  return /\.(png|pdf|jpg|jpeg|gif|webp|mp4)$/i.test(String(ext || ""));
}

export function fusedSignal(text = "") {
  return /idle pad is fused|pin idle fused|chat markdown file links call the existing open_file|binary opens have a catch/i.test(
    String(text || "")
  );
}

export function drySignal(text = "") {
  return /anchors stay dry|never call the existing open_file|binary showTextDocument rejects silent|click is a silent no-op/i.test(
    String(text || "")
  );
}

export function bondedSignal(text = "") {
  return /already bonded|anchors call existing openFile|rejection handler that falls back to vscode\.open/i.test(
    String(text || "")
  );
}

export function unwiredAnchorSignal(text = "") {
  return /unwired-anchor|rendered <a>|never call openFile|styled as links but/i.test(
    String(text || "")
  );
}

export function bridgeExistsUnusedSignal(text = "") {
  return /bridge-exists-unused|file chips and the diff view|sendRequest\(\{type:"open_file"\}|case "open_file"/i.test(
    String(text || "")
  );
}

export function silentBinaryRejectSignal(text = "") {
  return /silent-binary-reject|non-text files|\.png\/\.pdf|user sees nothing at all/i.test(
    String(text || "")
  );
}

export function showTextDocumentNoCatchSignal(text = "") {
  return /showTextDocument-no-catch|showTextDocument\(uri\)\.then\(cb\)|no rejection handler/i.test(
    String(text || "")
  );
}

export function markdownMandateSignal(text = "") {
  return /markdown-mandate|Code References in Text|\[name\]\(path\)|dead on arrival/i.test(
    String(text || "")
  );
}

export function signals(probe = {}) {
  const blob = typeof probe === "string" ? probe : extractText(probe);
  return {
    fused: fusedSignal(blob),
    dry: drySignal(blob),
    bonded: bondedSignal(blob),
    unwiredAnchor: unwiredAnchorSignal(blob),
    bridgeExistsUnused: bridgeExistsUnusedSignal(blob),
    silentBinaryReject: silentBinaryRejectSignal(blob),
    showTextDocumentNoCatch: showTextDocumentNoCatchSignal(blob),
    markdownMandate: markdownMandateSignal(blob)
  };
}

export function jointWasDry(probe = {}) {
  const t = probe && typeof probe === "object" && !Array.isArray(probe) ? probe : {};
  if (boolish(t.dry) || boolish(t.jointDry) || boolish(t.anchorUnwired)) {
    return true;
  }
  return drySignal(extractText(t));
}

export function padBonded(probe = {}) {
  const t = probe && typeof probe === "object" && !Array.isArray(probe) ? probe : {};
  if (boolish(t.padBonded) || (boolish(t.bonded) && !boolish(t.dry))) {
    return true;
  }
  return false;
}

export function fingerprint(probe = {}) {
  const t = probe && typeof probe === "object" && !Array.isArray(probe) ? probe : {};
  const hits = signals(t);
  const dryHit =
    boolish(t.dry) || (jointWasDry(t) && !boolish(t.bonded) && !boolish(t.fused));
  const bondedClean = boolish(t.bonded) || padBonded(t);
  const fusedHit = boolish(t.fused) || (hits.fused && !dryHit && !bondedClean);
  return {
    dryHit,
    bondedClean,
    fusedHit,
    unwiredAnchor: boolish(t.unwiredAnchor) || hits.unwiredAnchor,
    bridgeExistsUnused: boolish(t.bridgeExistsUnused) || hits.bridgeExistsUnused,
    silentBinaryReject: boolish(t.silentBinaryReject) || hits.silentBinaryReject,
    showTextDocumentNoCatch:
      boolish(t.showTextDocumentNoCatch) || hits.showTextDocumentNoCatch,
    markdownMandate: boolish(t.markdownMandate) || hits.markdownMandate,
    padBonded: padBonded(t),
    jointDry: dryHit,
    jointFused: bondedClean && !dryHit,
    signals: hits
  };
}

export function classify(probe = {}) {
  const t = probe && typeof probe === "object" && !Array.isArray(probe) ? probe : { entries: probe };
  const print = fingerprint(t);
  const dry = boolish(t.dry) || (print.dryHit && !boolish(t.bonded) && !boolish(t.fused));
  const bonded = boolish(t.bonded) || (print.bondedClean && !boolish(t.dry));
  const fused = boolish(t.fused) || (print.fusedHit && !dry && !bonded);
  return {
    fused,
    dry,
    bonded,
    unwiredAnchor: boolish(t.unwiredAnchor) || print.unwiredAnchor,
    bridgeExistsUnused: boolish(t.bridgeExistsUnused) || print.bridgeExistsUnused,
    silentBinaryReject: boolish(t.silentBinaryReject) || print.silentBinaryReject,
    showTextDocumentNoCatch:
      boolish(t.showTextDocumentNoCatch) || print.showTextDocumentNoCatch,
    markdownMandate: boolish(t.markdownMandate) || print.markdownMandate,
    cousins: Array.isArray(t.cousinsCiteOnly) || boolish(t.cousins),
    hasClearRepro:
      boolish(t.hasClearRepro) ||
      (Array.isArray(t.labels) &&
        (t.labels.includes("has repro") || t.labels.includes("has-clear-repro"))),
    fingerprint: print,
    extension: t.extension || MEASURED.extension,
    showTextDocument: t.showTextDocument || MEASURED.showTextDocument
  };
}

export function seedFused() {
  return {
    seed: "fused",
    issue: 92809,
    fused: true,
    dry: false,
    bonded: false,
    outputText:
      "fused; idle pad — chat markdown file links call the existing open_file bridge; binary opens have a catch"
  };
}

export function seedDry() {
  return {
    seed: "dry",
    issue: 92809,
    fused: false,
    dry: true,
    bonded: false,
    jointDry: true,
    anchorUnwired: true,
    unwiredAnchor: true,
    bridgeExistsUnused: true,
    silentBinaryReject: true,
    showTextDocumentNoCatch: true,
    markdownMandate: true,
    hasClearRepro: true,
    outputText:
      "dry; chat <a> anchors stay dry (never call the existing open_file bridge); binary showTextDocument rejects silent; click is a silent no-op",
    extension: MEASURED.extension,
    showTextDocument: MEASURED.showTextDocument
  };
}

export function seedBonded() {
  return {
    seed: "bonded",
    issue: 92809,
    fused: false,
    dry: false,
    bonded: true,
    padBonded: true,
    anchorWired: true,
    extension: MEASURED.extension
  };
}

export function seeds() {
  return {
    fused: seedFused(),
    dry: seedDry(),
    bonded: seedBonded(),
    "unwired-anchor": { seed: "unwired-anchor", issue: 92809, unwiredAnchor: true },
    "bridge-exists-unused": {
      seed: "bridge-exists-unused",
      issue: 92809,
      bridgeExistsUnused: true
    },
    "silent-binary-reject": {
      seed: "silent-binary-reject",
      issue: 92809,
      silentBinaryReject: true
    },
    "showTextDocument-no-catch": {
      seed: "showTextDocument-no-catch",
      issue: 92809,
      showTextDocumentNoCatch: true
    },
    "markdown-mandate": { seed: "markdown-mandate", issue: 92809, markdownMandate: true },
    cousins: { seed: "cousins", issue: 92809, cousins: true, cousinsCiteOnly: COUSINS },
    "has-clear-repro": {
      seed: "has-clear-repro",
      issue: 92809,
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
  "unwired-anchor",
  "bridge-exists-unused",
  "silent-binary-reject",
  "showTextDocument-no-catch",
  "markdown-mandate",
  "has-clear-repro"
];

const FLAG_FOR_SEED = {
  "unwired-anchor": (t, c) => boolish(t.unwiredAnchor) || c.unwiredAnchor,
  "bridge-exists-unused": (t, c) => boolish(t.bridgeExistsUnused) || c.bridgeExistsUnused,
  "silent-binary-reject": (t, c) => boolish(t.silentBinaryReject) || c.silentBinaryReject,
  "showTextDocument-no-catch": (t, c) =>
    boolish(t.showTextDocumentNoCatch) || c.showTextDocumentNoCatch,
  "markdown-mandate": (t, c) => boolish(t.markdownMandate) || c.markdownMandate,
  "has-clear-repro": (t, c) => boolish(t.hasClearRepro) || c.hasClearRepro,
  cousins: (t, c) => Array.isArray(t.cousinsCiteOnly) || c.cousins
};

export function decide(probe = {}) {
  const t = probe && typeof probe === "object" && !Array.isArray(probe) ? probe : { entries: probe };
  const seed = String(t.seed || "");
  const joint = classify(t);
  const reasons = [];

  if (seed === "cousins" || (Array.isArray(t.cousinsCiteOnly) && seed === "cousins")) {
    reasons.push(CHIP_REASONS.cousins);
    return {
      verdict: "cousins",
      reasons,
      fused: false,
      dry: true,
      bonded: false,
      chips: ["cousins", "dry"],
      joint
    };
  }

  if (SPECIFIC_SEEDS.includes(seed) && seed !== "cousins") {
    reasons.push(CHIP_REASONS[seed]);
    return {
      verdict: seed,
      reasons,
      fused: false,
      dry: true,
      bonded: false,
      chips: [seed, "dry"],
      joint
    };
  }

  for (const name of SPECIFIC_SEEDS) {
    if (name === "cousins") continue;
    const flagHit = FLAG_FOR_SEED[name];
    if (
      flagHit &&
      flagHit(t, joint) &&
      seed !== "dry" &&
      seed !== "bonded" &&
      seed !== "fused"
    ) {
      reasons.push(CHIP_REASONS[name]);
      return {
        verdict: name,
        reasons,
        fused: false,
        dry: true,
        bonded: false,
        chips: [name, "dry"],
        joint
      };
    }
  }

  if (
    seed === "bonded" ||
    (t.bonded === true && t.dry !== true && seed !== "dry") ||
    (joint.bonded && !joint.dry && seed !== "dry")
  ) {
    reasons.push(CHIP_REASONS.bonded);
    return {
      verdict: "bonded",
      reasons,
      fused: false,
      dry: false,
      bonded: true,
      chips: ["bonded"],
      joint
    };
  }

  if (t.dry === true || seed === "dry" || (joint.dry && !joint.bonded && !joint.fused)) {
    reasons.push(CHIP_REASONS.dry);
    const chips = ["dry"];
    if (t.unwiredAnchor === true || joint.unwiredAnchor) chips.push("unwired-anchor");
    if (t.bridgeExistsUnused === true || joint.bridgeExistsUnused) {
      chips.push("bridge-exists-unused");
    }
    if (t.silentBinaryReject === true || joint.silentBinaryReject) {
      chips.push("silent-binary-reject");
    }
    if (t.showTextDocumentNoCatch === true || joint.showTextDocumentNoCatch) {
      chips.push("showTextDocument-no-catch");
    }
    if (t.markdownMandate === true || joint.markdownMandate) chips.push("markdown-mandate");
    if (t.hasClearRepro === true || joint.hasClearRepro) chips.push("has-clear-repro");
    return {
      verdict: "dry",
      reasons,
      fused: false,
      dry: true,
      bonded: false,
      chips: [...new Set(chips)],
      joint
    };
  }

  if (HOLD.has(seed) || seed === "fused" || t.fused === true || joint.fused) {
    reasons.push(CHIP_REASONS.fused);
    return {
      verdict: "fused",
      reasons,
      fused: true,
      dry: false,
      bonded: false,
      chips: ["fused"],
      joint
    };
  }

  if (ALARM.has(seed)) {
    reasons.push(`alarm ${seed}`);
    return {
      verdict: seed,
      reasons,
      fused: false,
      dry: true,
      bonded: false,
      chips: [seed],
      joint
    };
  }

  reasons.push(
    "empty probe; idle pad is fused — HOLD: chat markdown file links call the existing open_file bridge; binary opens have a catch"
  );
  return {
    verdict: "fused",
    reasons,
    fused: true,
    dry: false,
    bonded: false,
    chips: ["fused"],
    joint
  };
}

function parseProbe(raw) {
  const text = String(raw || "").trim();
  if (!text) return seedFused();
  try {
    const parsed = JSON.parse(text);
    if (parsed && typeof parsed === "object") return parsed;
  } catch {
    return seedFused();
  }
  return seedFused();
}

export async function main(argv = process.argv.slice(2)) {
  const { readFileSync } = await import("node:fs");
  const { stdin } = await import("node:process");
  let raw = "";
  if (argv[0] && !argv[0].startsWith("-")) {
    raw = readFileSync(argv[0], "utf8");
  } else if (!stdin.isTTY) {
    raw = await new Promise((resolve, reject) => {
      const chunks = [];
      stdin.on("data", (chunk) => chunks.push(chunk));
      stdin.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
      stdin.on("error", reject);
    });
  }
  const probe = parseProbe(raw);
  const result = decide(probe);
  const out = {
    product: "dryjoint",
    issue: 92809,
    mark: "18:50 / hermes catalog #224 / #92809",
    alarm: ALARM.has(result.verdict),
    hold: HOLD.has(result.verdict),
    ...result
  };
  process.stdout.write(`${JSON.stringify(out, null, 2)}\n`);
  return out;
}

import { pathToFileURL } from "node:url";

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
