#!/usr/bin/env node
/**
 * Lucida — camera-lucida / optical-tracing atelier booth.
 *
 * Educational diagnostic model for a published Claude Code defect:
 * Desktop app (Code tab) paste should keep the plate traceable
 * (write image to ~/.claude/image-cache/<session-id>/N.png and
 * inject companion user message `[Image: source: <path>]` the way
 * CLI does). Instead desktop receives only the inline image block:
 * measured 0/4 entrypoint:"claude-desktop" sessions inject the path
 * / write cache; 4/4 entrypoint:"cli" sessions do; pixels
 * byte-identical.
 *
 *   node lucida.mjs data/lucida.json
 *   echo '{"seed":"pathless"}' | node lucida.mjs
 *
 * Idle word is traced (HOLD: CLI writes image-cache and injects
 * `[Image: source: <path>]`; plate stays addressable).
 * Seeded word is pathless (#93429: Desktop Code tab omits the
 * companion; no image-cache dir for that session).
 * Path word is image-cache.
 * Product score word is lucida (score lucida or admit traced).
 *
 * Encoded from anthropics/claude-code#93429 issue body only.
 * Hypothesis (NON-BINDING): prompt-submission path branches on how
 * the image arrived; desktop takes the content-block branch missing
 * the cache+path argument the CLI / pastedContents path uses.
 * Verify against #93429 text only. Do NOT claim a root cause in
 * Claude Code source you have not seen. Do NOT implement a fix.
 * No network. No exploits. No live Claude. No secrets.
 */

/* Browser-safe: no top-level node: imports. CLI I/O is loaded only in main(). */

export const VERDICTS = Object.freeze([
  "traced",
  "pathless",
  "lucida",
  "image-cache",
  "hold",
  "cli-inject",
  "desktop-omit",
  "companion-missing",
  "no-cache-dir",
  "content-block",
  "pasted-contents",
  "turn-companion",
  "bytes-identical",
  "has-repro",
  "cousins",
  "backups",
  "fixtures",
  "chips",
  "fingerprints",
  "walk",
]);

export const IDLE_WORD = "traced";
export const PATH_WORD = "image-cache";
export const SEEDED_WORD = "pathless";
export const PRODUCT_WORD = "lucida";
export const HOLD = Object.freeze(["traced", "hold"]);
export const RECOVER = Object.freeze(["traced", "hold"]);
export const ALARM = Object.freeze(
  VERDICTS.filter((name) => !HOLD.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FORBIDDEN_IDLE = Object.freeze([
  "scrubbed",
  "contaminated",
  "fomite",
  "gitignore",
  "mounted",
  "fossed",
  "plan9",
  "fosse",
  "warm",
  "paged-out",
  "majflt",
  "hibernacle",
  "honest",
  "scapegoated",
  "ungranted",
  "scapegoat",
  "cleared",
  "grafted",
  "copy-forward",
  "graft",
  "damped",
  "spinning",
  "mux",
  "snubber",
  "slipped",
  "sprung",
  "springe",
  "bound",
  "accreted",
  "session-url",
  "cartulary",
  "sealed",
  "mismatched",
  "issuer",
  "paraph",
  "routed",
  "inherited",
  "cascade",
  "appanage",
  "afloat",
  "washed",
  "pontoon",
  "concordant",
  "concordat",
  "reaped",
  "revenant",
  "restored",
  "expanded",
  "laid",
  "released",
  "freehold",
  "trunked",
  "tokenized",
  "locked",
  "scratched",
  "unmasked",
  "replevin",
  "cognate",
  "lemures",
  "escheat",
  "mortmain",
  "strowger",
  "mondegreen",
  "derby",
  "vizard",
  "oubliette",
  "voided",
  "ephemera",
  "commutator",
  "heddle",
  "hectograph",
  "placet",
  "frisket",
  "tangent",
  "hawser",
  "caret",
  "buoy",
  "solecism",
  "coffer",
  "codicil",
  "crimp",
  "jackfield",
  "tocsin",
  "bolter",
  "deadeye",
  "reglet",
  "reliquary",
  "annunciator",
  "caisson",
  "spindle",
  "knell",
  "tumbler",
  "escapement",
  "geneva",
  "scotch",
  "defaulted",
  "literal",
  "remanent",
  "stale",
  "phantom",
  "vernier",
  "slider",
  "latent",
  "flushed",
  "afterimage",
  "distinct",
  "conflated",
  "diplopia",
  "diopter",
]);
export const FORBIDDEN_SEED = Object.freeze(
  FORBIDDEN_IDLE.filter(
    (name) => name !== "pathless" && name !== "lucida",
  ),
);

export const FEATURED_ISSUE = 93429;
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/93429";
export const TITLE =
  "Desktop app (Code tab) drops the image source path: pasted images are never written to image-cache and no `[Image: source: <path>]` line is injected";
export const STATE = "OPEN";
export const LABELS = Object.freeze([
  "bug",
  "has repro",
  "platform:macos",
  "area:desktop",
]);
export const AUTHOR = "Lumidew";
export const FILED = "2026-09-10T17:53:26Z";
export const DESKTOP_APP = "1.49585.0";
export const DESKTOP_BUILT = "2026-09-08";
export const BUNDLED_CODE = "2.1.260";
export const BUNDLED_ALSO = "2.1.258";
export const CLI_VERSION = "2.1.266";
export const OS = "macOS";
export const OS_VERSION = "15.3.2";
export const ARCH = "arm64";
export const CACHE_PATH = "~/.claude/image-cache/<session-id>/N.png";
export const COMPANION = "[Image: source: <path>]";
export const ENTRYPOINT_CLI = "cli";
export const ENTRYPOINT_DESKTOP = "claude-desktop";
export const CLI_INJECT = "4/4";
export const DESKTOP_INJECT = "0/4";
export const SESSIONS = 8;
export const IMAGE_WIDTH = 852;
export const IMAGE_HEIGHT = 525;
export const IMAGE_SIZE = "852x525";
export const GETBBOX = "None";
export const CHANNEL_DIFF = 0;
export const PHRASE =
  "when the desktop Code tab drops the image source path so pasted images never hit image-cache and no [Image: source: path] companion is injected, score lucida or admit traced.";

export const BENCH_STATIONS = Object.freeze([
  {
    id: "plate",
    survey: "read the drafting plate",
    kind: "paste",
    note: "Code tab paste should keep the plate traceable",
  },
  {
    id: "prism",
    survey: "align the camera-lucida prism",
    kind: "companion",
    note: "CLI injects turnCompanion [Image: source: <path>]",
  },
  {
    id: "tissue",
    survey: "lift the tracing paper",
    kind: "pixels",
    note: "pixels byte-identical 852x525; ImageChops.difference getbbox None",
  },
  {
    id: "drawer",
    survey: "audit the image-cache drawer",
    kind: "cache",
    note: "CLI writes ~/.claude/image-cache/<session-id>/N.png; desktop has no dir",
  },
]);

export const ENTRYPOINT_TABLE = Object.freeze([
  {
    name: "cli",
    entrypoint: "cli",
    sessions: 4,
    injected: "4/4",
    cacheWritten: true,
    companion: true,
    note: "writes image-cache and injects turnCompanion",
  },
  {
    name: "claude-desktop",
    entrypoint: "claude-desktop",
    sessions: 4,
    injected: "0/4",
    cacheWritten: false,
    companion: false,
    note: "inline image block only; no cache dir; no companion",
  },
]);

export const FINGERPRINT_LINES = Object.freeze([
  "cli-inject",
  "desktop-omit",
  "companion-missing",
  "no-cache-dir",
  "content-block",
  "pasted-contents",
  "turn-companion",
  "bytes-identical",
]);

export const COUSINS = Object.freeze([
  {
    issue: 84251,
    title:
      "macOS: images from existing files attach as [Image #X] but Claude only receives a generic PNG document placeholder",
    state: "OPEN",
    citeOnly: true,
    why: "Cite-only cousin — image path / attachment parity; do not rebuild",
  },
  {
    issue: 89223,
    title:
      "WSL/WSLg: image paste fails because wl-paste returns BMP into a .png path",
    state: "OPEN",
    citeOnly: true,
    why: "Cite-only cousin — paste path / format; do not rebuild",
  },
]);

export const BACKUPS = Object.freeze([
  {
    issue: 93446,
    title: "mcp add-json client-secret key mismatch",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
  {
    issue: 93445,
    title: "/branch RC reconnection record",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
  {
    issue: 93403,
    title: "nested skills never load in auto mode",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
  {
    issue: 93405,
    title: "autoMode trusted-repo path pinned user-global",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
  {
    issue: 93402,
    title: "Cmd+Enter interrupts instead of queues",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
  {
    issue: 93426,
    title: "host writes .in_use/.orphaned_at into pinned plugin tree",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
]);

export const NOT_PRODUCTS = Object.freeze([
  "afterimage",
  "diplopia",
  "diopter",
  "fomite",
  "snubber",
  "fosse",
  "hibernacle",
  "pontoon",
  "concordat",
  "ward",
  "latchkey",
  "bitting",
  "escutcheon",
  "scapegoat",
  "graft",
  "springe",
  "cartulary",
  "paraph",
  "appanage",
  "revenant",
  "replevin",
  "cognate",
  "lemures",
  "escheat",
  "mortmain",
  "strowger",
  "mondegreen",
  "derby",
  "vizard",
  "oubliette",
  "ephemera",
  "commutator",
  "heddle",
  "hectograph",
  "placet",
  "frisket",
  "tangent",
  "hawser",
  "caret",
  "buoy",
  "solecism",
  "coffer",
  "codicil",
  "crimp",
  "jackfield",
  "tocsin",
  "bolter",
  "deadeye",
  "reglet",
  "reliquary",
  "annunciator",
  "caisson",
  "spindle",
  "knell",
  "tumbler",
  "escapement",
  "geneva",
  "scotch",
  "flashpan",
  "clepsydra",
  "deadair",
  "scuttle",
  "stopcock",
  "parergon",
  "stereotype",
  "midden",
  "mirage",
  "guillotine",
  "vernier",
  "scion",
  "drift-radar",
  "reorder-radar",
]);

/**
 * Read whether the turnCompanion [Image: source: <path>] line
 * was injected the way CLI does.
 */
export function inspectCompanion(input = {}) {
  const injected =
    input.companionInjected === true ||
    input.turnCompanion === true ||
    input.cliInject === true ||
    (input.injected === true && input.companionOmitted !== true);
  const omitted =
    input.companionOmitted === true ||
    input.companionMissing === true ||
    input.desktopOmit === true ||
    input.companionInjected === false;
  return {
    injected: injected && !omitted && input.pathless !== true,
    omitted: omitted && input.traced !== true,
    text: injected && !omitted && input.pathless !== true ? COMPANION : "",
    stamp: omitted && input.traced !== true ? "pathless" : "traced",
  };
}

/**
 * Assay whether ~/.claude/image-cache/<session-id>/N.png was written.
 */
export function inspectImageCache(input = {}) {
  const written =
    input.cacheWritten === true ||
    input.imageCacheWritten === true ||
    input.wroteCache === true;
  const missing =
    input.noCacheDir === true ||
    input.cacheMissing === true ||
    input.cacheWritten === false;
  return {
    written: written && !missing && input.pathless !== true,
    missing: missing && input.traced !== true,
    path: written && !missing && input.pathless !== true ? CACHE_PATH : "",
    stamp: missing && input.traced !== true ? "pathless" : "traced",
  };
}

/**
 * Assay CLI vs desktop entrypoint injection counts from #93429.
 */
export function inspectEntrypoint(input = {}) {
  const desktop =
    input.entrypoint === ENTRYPOINT_DESKTOP ||
    input.desktop === true ||
    input.desktopOmit === true;
  const cli =
    input.entrypoint === ENTRYPOINT_CLI ||
    input.cli === true ||
    input.cliInject === true;
  return {
    desktop,
    cli,
    desktopInject: desktop ? DESKTOP_INJECT : null,
    cliInject: cli ? CLI_INJECT : null,
    stamp:
      desktop && input.traced !== true && input.companionInjected !== true
        ? "pathless"
        : "traced",
  };
}

export function readPlate(input = {}) {
  const companion = inspectCompanion(input);
  const cache = inspectImageCache(input);
  const entry = inspectEntrypoint(input);
  const pathless =
    companion.stamp === "pathless" ||
    cache.stamp === "pathless" ||
    entry.stamp === "pathless" ||
    input.pathless === true;
  const traced =
    input.traced === true &&
    pathless !== true &&
    companion.stamp === "traced";
  return {
    companion,
    cache,
    entry,
    stations: BENCH_STATIONS,
    pathless: pathless && !traced,
    traced:
      traced ||
      (companion.stamp === "traced" &&
        cache.stamp === "traced" &&
        entry.stamp === "traced" &&
        input.pathless !== true),
    mark: pathless && !traced ? "pathless" : "traced",
  };
}

/**
 * Published lucida walk from #93429 only. Facts from the issue body.
 * A traced plate writes image-cache and injects the companion.
 * A pathless plate is the desktop Code tab: inline image only.
 */
export const LUCIDA_WALK = Object.freeze([
  {
    t: "idle",
    event: "cue-traced",
    traced: true,
    cacheWritten: true,
    companionInjected: true,
    turnCompanion: true,
    cliInject: true,
    entrypoint: "cli",
    pathless: false,
    cue: "traced",
    note: "idle HOLD: CLI writes image-cache and injects [Image: source: <path>]; plate stays addressable",
  },
  {
    t: "cli",
    event: "paste-cli",
    entrypoint: "cli",
    cli: true,
    traced: true,
    cacheWritten: true,
    companionInjected: true,
    cue: "traced",
    note: "paste a screenshot into the terminal CLI and send it",
  },
  {
    t: "cache",
    event: "write-cache",
    cacheWritten: true,
    imageCacheWritten: true,
    traced: true,
    cue: "traced",
    note: "CLI writes ~/.claude/image-cache/<session-id>/N.png",
  },
  {
    t: "companion",
    event: "inject-companion",
    companionInjected: true,
    turnCompanion: true,
    traced: true,
    cue: "traced",
    note: "injects turnCompanion meta user message [Image: source: ...]",
  },
  {
    t: "desktop",
    event: "paste-desktop",
    entrypoint: "claude-desktop",
    desktop: true,
    pathless: true,
    cue: "pathless",
    note: "paste the same screenshot into the desktop app Code tab",
  },
  {
    t: "branch",
    event: "content-block",
    contentBlock: true,
    pathless: true,
    cue: "pathless",
    note: "desktop takes the content-block branch (NON-BINDING hypothesis from issue)",
  },
  {
    t: "omit",
    event: "omit-companion",
    companionOmitted: true,
    companionMissing: true,
    desktopOmit: true,
    pathless: true,
    cue: "pathless",
    note: "desktop transcript has no turnCompanion record",
  },
  {
    t: "drawer",
    event: "no-cache-dir",
    noCacheDir: true,
    cacheMissing: true,
    cacheWritten: false,
    pathless: true,
    cue: "pathless",
    note: "~/.claude/image-cache/ contains no directory for that session",
  },
  {
    t: "pixels",
    event: "bytes-identical",
    bytesIdentical: true,
    imageSize: IMAGE_SIZE,
    getbbox: GETBBOX,
    pathless: true,
    cue: "pathless",
    note: "pixels byte-identical 852x525; ImageChops.difference getbbox None",
  },
  {
    t: "measure",
    event: "pathless",
    traced: false,
    pathless: true,
    desktopOmit: true,
    companionOmitted: true,
    noCacheDir: true,
    contentBlock: true,
    entrypoint: "claude-desktop",
    desktopInject: DESKTOP_INJECT,
    cliInjectCount: CLI_INJECT,
    cue: "pathless",
    note: "#93429: 0/4 claude-desktop inject; 4/4 cli inject",
  },
  {
    t: "path",
    event: "image-cache",
    pathless: true,
    imageCache: true,
    noCacheDir: true,
    cue: "pathless",
    note: "image-cache — desktop never writes the tracing-plate path",
  },
  {
    t: "score",
    event: "lucida",
    pathless: true,
    imageCache: true,
    cue: "pathless",
    note: "lucida — score the missing tracing-plate path on the Code tab paste",
  },
]);

function classifyFromSeed(seed) {
  if (seed && VERDICTS.includes(seed)) return seed;
  return null;
}

export function emptyTicket() {
  return {
    seed: IDLE_WORD,
    traced: true,
    cacheWritten: true,
    companionInjected: true,
    turnCompanion: true,
    cliInject: true,
    entrypoint: "cli",
    pathless: false,
    cue: "traced",
  };
}

export function seedTraced() {
  return { ...emptyTicket() };
}

export function seedPathless() {
  return {
    seed: SEEDED_WORD,
    traced: false,
    pathless: true,
    desktopOmit: true,
    companionOmitted: true,
    companionMissing: true,
    companionInjected: false,
    noCacheDir: true,
    cacheMissing: true,
    cacheWritten: false,
    contentBlock: true,
    entrypoint: ENTRYPOINT_DESKTOP,
    desktop: true,
    desktopInject: DESKTOP_INJECT,
    cliInjectCount: CLI_INJECT,
    bytesIdentical: true,
    imageSize: IMAGE_SIZE,
    getbbox: GETBBOX,
    cue: "pathless",
    issue: FEATURED_ISSUE,
  };
}

export function seedLucida() {
  return {
    seed: PRODUCT_WORD,
    preferSeed: true,
    pathless: true,
    imageCache: true,
    cue: "pathless",
  };
}

export function seedImageCache() {
  return {
    seed: PATH_WORD,
    preferSeed: true,
    pathless: true,
    imageCache: true,
    noCacheDir: true,
    cue: "pathless",
  };
}

export function seedHold() {
  return {
    seed: "hold",
    preferSeed: true,
    traced: true,
    cue: "traced",
  };
}

export function seedCliInject() {
  return {
    seed: "cli-inject",
    preferSeed: true,
    cliInject: true,
    cue: "traced",
  };
}

export function seedDesktopOmit() {
  return {
    seed: "desktop-omit",
    preferSeed: true,
    desktopOmit: true,
    cue: "pathless",
  };
}

export function seedCompanionMissing() {
  return {
    seed: "companion-missing",
    preferSeed: true,
    companionMissing: true,
    cue: "pathless",
  };
}

export function seedNoCacheDir() {
  return {
    seed: "no-cache-dir",
    preferSeed: true,
    noCacheDir: true,
    cue: "pathless",
  };
}

export function seedContentBlock() {
  return {
    seed: "content-block",
    preferSeed: true,
    contentBlock: true,
    cue: "pathless",
  };
}

export function seedPastedContents() {
  return {
    seed: "pasted-contents",
    preferSeed: true,
    pastedContents: true,
    cue: "traced",
  };
}

export function seedTurnCompanion() {
  return {
    seed: "turn-companion",
    preferSeed: true,
    turnCompanion: true,
    cue: "traced",
  };
}

export function seedBytesIdentical() {
  return {
    seed: "bytes-identical",
    preferSeed: true,
    bytesIdentical: true,
    cue: "pathless",
  };
}

export function normalizeBooth(raw) {
  if (!raw || typeof raw !== "object") {
    return {
      traced: false,
      pathless: false,
      imageCache: false,
      cacheWritten: false,
      imageCacheWritten: false,
      wroteCache: false,
      noCacheDir: false,
      cacheMissing: false,
      companionInjected: false,
      turnCompanion: false,
      cliInject: false,
      companionOmitted: false,
      companionMissing: false,
      desktopOmit: false,
      contentBlock: false,
      pastedContents: false,
      bytesIdentical: false,
      desktop: false,
      cli: false,
      entrypoint: null,
      desktopInject: null,
      cliInjectCount: null,
      imageSize: null,
      getbbox: null,
      cue: null,
      event: null,
      t: null,
    };
  }
  return {
    traced: raw.traced === true,
    pathless: raw.pathless === true,
    imageCache: raw.imageCache === true,
    cacheWritten:
      raw.cacheWritten === true ||
      raw.imageCacheWritten === true ||
      raw.wroteCache === true,
    imageCacheWritten: raw.imageCacheWritten === true,
    wroteCache: raw.wroteCache === true,
    noCacheDir: raw.noCacheDir === true || raw.cacheMissing === true,
    cacheMissing: raw.cacheMissing === true,
    companionInjected:
      raw.companionInjected === true || raw.turnCompanion === true,
    turnCompanion: raw.turnCompanion === true,
    cliInject: raw.cliInject === true,
    companionOmitted:
      raw.companionOmitted === true || raw.companionMissing === true,
    companionMissing: raw.companionMissing === true,
    desktopOmit: raw.desktopOmit === true,
    contentBlock: raw.contentBlock === true,
    pastedContents: raw.pastedContents === true,
    bytesIdentical: raw.bytesIdentical === true,
    desktop: raw.desktop === true || raw.entrypoint === ENTRYPOINT_DESKTOP,
    cli: raw.cli === true || raw.entrypoint === ENTRYPOINT_CLI,
    entrypoint: raw.entrypoint == null ? null : raw.entrypoint,
    desktopInject: raw.desktopInject == null ? null : raw.desktopInject,
    cliInjectCount: raw.cliInjectCount == null ? null : raw.cliInjectCount,
    imageSize: raw.imageSize == null ? null : raw.imageSize,
    getbbox: raw.getbbox == null ? null : raw.getbbox,
    cue: raw.cue || null,
    event: raw.event || raw.kind || null,
    t: raw.t || raw.time || null,
  };
}

function hasBoothFields(ticket) {
  return Boolean(
    ticket &&
      (ticket.traced != null ||
        ticket.pathless != null ||
        ticket.imageCache != null ||
        ticket.cacheWritten != null ||
        ticket.noCacheDir != null ||
        ticket.companionInjected != null ||
        ticket.companionOmitted != null ||
        ticket.desktopOmit != null ||
        ticket.contentBlock != null ||
        ticket.entrypoint != null ||
        ticket.cue != null ||
        ticket.event),
  );
}

function isTraced(row) {
  if (row.pathless && row.cue !== "traced") return false;
  if (
    row.cue === "pathless" ||
    row.cue === "lucida" ||
    row.cue === "image-cache"
  ) {
    return false;
  }
  if (row.desktopOmit && row.cue !== "traced") return false;
  if (row.companionOmitted && row.cue !== "traced") return false;
  if (row.noCacheDir && row.cue !== "traced") return false;
  if (
    row.traced === true &&
    row.pathless !== true &&
    row.cue !== "pathless"
  ) {
    return true;
  }
  if (
    row.cue === "traced" &&
    row.pathless !== true &&
    row.desktopOmit !== true &&
    row.companionOmitted !== true &&
    row.noCacheDir !== true
  ) {
    return true;
  }
  if (
    row.cacheWritten === true &&
    row.companionInjected === true &&
    row.pathless !== true &&
    row.desktopOmit !== true
  ) {
    return true;
  }
  return false;
}

function isPathless(row) {
  if (isTraced(row)) return false;
  if (row.cue === "pathless" || row.cue === "lucida") return true;
  if (row.pathless === true) return true;
  if (
    row.desktopOmit === true ||
    row.companionOmitted === true ||
    row.noCacheDir === true ||
    row.desktopInject === DESKTOP_INJECT
  ) {
    return true;
  }
  if (
    row.entrypoint === ENTRYPOINT_DESKTOP &&
    row.companionInjected !== true &&
    row.traced !== true
  ) {
    return true;
  }
  return false;
}

function isImageCachePath(row) {
  return (
    row.event === "image-cache" &&
    !isTraced(row) &&
    (row.pathless === true ||
      row.imageCache === true ||
      row.noCacheDir === true)
  );
}

/**
 * Score one plate pass against the lucida booth.
 * traced: CLI writes image-cache and injects the companion.
 * pathless: Desktop Code tab omits companion and cache dir.
 * image-cache: named path — cache never written on desktop.
 */
export function scoreGate(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const row = normalizeBooth(ticket);
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);

  let verdict = IDLE_WORD;
  if (
    isImageCachePath(row) ||
    (row.imageCache && ticket.preferSeed && seeded === PATH_WORD)
  ) {
    verdict = "image-cache";
  } else if (isPathless(row)) {
    verdict = "pathless";
  } else if (isTraced(row)) {
    verdict = "traced";
  } else if (
    row.desktopOmit ||
    row.companionOmitted ||
    row.noCacheDir ||
    row.contentBlock ||
    row.bytesIdentical
  ) {
    verdict = "pathless";
  }

  if (seeded && (!hasBoothFields(ticket) || ticket.preferSeed === true)) {
    verdict = seeded;
  }

  const hold = HOLD.includes(verdict);
  const companion = inspectCompanion(row);
  const cache = inspectImageCache(row);
  const entry = inspectEntrypoint(row);
  return {
    verdict,
    idleWord: IDLE_WORD,
    pathWord: PATH_WORD,
    seededWord: SEEDED_WORD,
    productWord: PRODUCT_WORD,
    hold,
    alarm: !hold,
    recover: RECOVER.includes(verdict),
    traced: verdict === "traced" || verdict === "hold",
    pathless:
      verdict === "pathless" ||
      verdict === SEEDED_WORD ||
      verdict === PRODUCT_WORD,
    imageCache:
      row.imageCache === true ||
      verdict === "image-cache" ||
      verdict === PATH_WORD,
    cacheWritten: row.cacheWritten,
    imageCacheWritten: row.imageCacheWritten,
    wroteCache: row.wroteCache,
    noCacheDir: row.noCacheDir,
    cacheMissing: row.cacheMissing,
    companionInjected: row.companionInjected,
    turnCompanion: row.turnCompanion,
    cliInject: row.cliInject,
    companionOmitted: row.companionOmitted,
    companionMissing: row.companionMissing,
    desktopOmit: row.desktopOmit,
    contentBlock: row.contentBlock,
    pastedContents: row.pastedContents,
    bytesIdentical: row.bytesIdentical,
    desktop: row.desktop,
    cli: row.cli,
    entrypoint: row.entrypoint,
    desktopInject: row.desktopInject,
    cliInjectCount: row.cliInjectCount,
    imageSize: row.imageSize,
    getbbox: row.getbbox,
    cue: hold ? "traced" : "pathless",
    event: row.event,
    t: row.t,
    phrase: hold ? "admit traced" : "score lucida",
    companion,
    cache,
    entry,
  };
}

export function scoreWalk(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const rows = Array.isArray(ticket.rows)
    ? ticket.rows
    : Array.isArray(ticket.walk)
      ? ticket.walk
      : LUCIDA_WALK;
  const scored = rows.map((row) => ({
    ...normalizeBooth(row),
    ...scoreGate({ ...row, preferSeed: false }),
  }));
  const pathless = scored.filter((row) => row.verdict === "pathless");
  const path = scored.filter((row) => row.verdict === "image-cache");
  const traced = scored.filter((row) => row.verdict === "traced");
  const headline =
    scored.find((row) => row.event === "pathless") ||
    scored.find((row) => row.event === "omit-companion") ||
    scored.find((row) => row.event === "image-cache") ||
    pathless[pathless.length - 1];
  let verdict = "traced";
  if (pathless.length) verdict = "pathless";
  else if (path.length && !traced.length) verdict = "image-cache";
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
    pathlessCount: pathless.length,
    pathCount: path.length,
    tracedCount: traced.length,
    headline,
    rows: scored,
    phrase: HOLD.includes(verdict) ? "admit traced" : "score lucida",
    note: headline
      ? "Desktop 1.49585.0; bundled Code 2.1.260; CLI 2.1.266; macOS 15.3.2 arm64; 4/4 cli inject; 0/4 claude-desktop inject; pixels 852x525 byte-identical."
      : "published lucida walk scored against traced vs pathless",
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
    seeded !== "traced" &&
    seeded !== "pathless" &&
    seeded !== "image-cache" &&
    seeded !== "lucida" &&
    ticket.traced == null &&
    ticket.pathless == null &&
    ticket.imageCache == null &&
    ticket.companionInjected == null &&
    ticket.desktopOmit == null &&
    ticket.noCacheDir == null &&
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
    traced: scored.traced ?? false,
    pathless: scored.pathless ?? false,
    imageCache: scored.imageCache ?? false,
    cacheWritten: scored.cacheWritten ?? false,
    noCacheDir: scored.noCacheDir ?? false,
    companionInjected: scored.companionInjected ?? false,
    companionOmitted: scored.companionOmitted ?? false,
    desktopOmit: scored.desktopOmit ?? false,
    contentBlock: scored.contentBlock ?? false,
    bytesIdentical: scored.bytesIdentical ?? false,
  };
}

export function score(input) {
  return analyze(input).verdict;
}

export function fingerprint(input) {
  const result = analyze(input);
  return [
    result.verdict,
    result.cacheWritten ? "cache=written" : "cache=missing",
    result.companionInjected ? "companion=injected" : "companion=omitted",
    result.desktopOmit || result.entrypoint === ENTRYPOINT_DESKTOP
      ? "entry=claude-desktop"
      : "entry=cli",
    result.bytesIdentical || result.imageSize === IMAGE_SIZE
      ? "pixels=852x525"
      : "pixels=unmeasured",
    result.cue === "traced" ? "cue=traced" : "cue=pathless",
  ].join("|");
}

export function handle(input) {
  const result = analyze(input);
  const plate = readPlate({
    traced: result.traced,
    pathless: result.pathless,
    cacheWritten: result.cacheWritten,
    imageCacheWritten: result.imageCacheWritten,
    wroteCache: result.wroteCache,
    noCacheDir: result.noCacheDir,
    cacheMissing: result.cacheMissing,
    companionInjected: result.companionInjected,
    turnCompanion: result.turnCompanion,
    cliInject: result.cliInject,
    companionOmitted: result.companionOmitted,
    companionMissing: result.companionMissing,
    desktopOmit: result.desktopOmit,
    contentBlock: result.contentBlock,
    entrypoint: result.entrypoint,
    desktop: result.desktop,
    cli: result.cli,
  });
  return {
    ...result,
    fingerprint: fingerprint(input),
    plate,
    companion: inspectCompanion({
      companionInjected: result.companionInjected,
      turnCompanion: result.turnCompanion,
      cliInject: result.cliInject,
      companionOmitted: result.companionOmitted,
      companionMissing: result.companionMissing,
      desktopOmit: result.desktopOmit,
      traced: result.traced,
      pathless: result.pathless,
    }),
    cache: inspectImageCache({
      cacheWritten: result.cacheWritten,
      imageCacheWritten: result.imageCacheWritten,
      wroteCache: result.wroteCache,
      noCacheDir: result.noCacheDir,
      cacheMissing: result.cacheMissing,
      traced: result.traced,
      pathless: result.pathless,
    }),
    entry: inspectEntrypoint({
      entrypoint: result.entrypoint,
      desktop: result.desktop,
      cli: result.cli,
      desktopOmit: result.desktopOmit,
      cliInject: result.cliInject,
      companionInjected: result.companionInjected,
      traced: result.traced,
    }),
    stations: BENCH_STATIONS.map((row) => ({
      ...row,
      pathless: result.pathless === true || result.verdict === "pathless",
    })),
    published: {
      issue: FEATURED_ISSUE,
      url: ISSUE_URL,
      title: TITLE,
      state: STATE,
      labels: [...LABELS],
      author: AUTHOR,
      filed: FILED,
      desktopApp: DESKTOP_APP,
      desktopBuilt: DESKTOP_BUILT,
      bundledCode: BUNDLED_CODE,
      bundledAlso: BUNDLED_ALSO,
      cliVersion: CLI_VERSION,
      os: OS,
      osVersion: OS_VERSION,
      arch: ARCH,
      cachePath: CACHE_PATH,
      companion: COMPANION,
      entrypointCli: ENTRYPOINT_CLI,
      entrypointDesktop: ENTRYPOINT_DESKTOP,
      cliInject: CLI_INJECT,
      desktopInject: DESKTOP_INJECT,
      sessions: SESSIONS,
      imageWidth: IMAGE_WIDTH,
      imageHeight: IMAGE_HEIGHT,
      imageSize: IMAGE_SIZE,
      getbbox: GETBBOX,
      channelDiff: CHANNEL_DIFF,
      entrypointTable: ENTRYPOINT_TABLE,
      stations: BENCH_STATIONS,
      fingerprintLines: [...FINGERPRINT_LINES],
      cousins: COUSINS.map((row) => row.issue),
      backups: BACKUPS.map((row) => row.issue),
      phrase: PHRASE,
      expected: [
        "both clients inject the source-path companion message",
        "desktop Code tab paste writes ~/.claude/image-cache/<session-id>/N.png",
        "the model can Read/Bash the cached file for crop/upscale",
      ],
      hypothesis:
        "NON-BINDING: prompt-submission path branches on how the image arrived; desktop takes the content-block branch missing the cache+path argument the CLI / pastedContents path uses. Verify against #93429 text only. Do not claim a root cause in Claude Code source you have not seen.",
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
