#!/usr/bin/env node
/**
 * Lemures — Roman Lemuria / Parentalia night-courtyard booth.
 *
 * Educational diagnostic model for a published Claude Code defect:
 * the mid-turn task-summary classifier should stay laid across `/clear`
 * (reset latestAsk / capturedIntent / taskSummary on conversation reset;
 * multimodal prompts refresh latestAsk). Instead process-scoped classifier
 * job state remanently keeps the previous conversation's latestAsk,
 * image-bearing prompts never refresh it because findLatestRealUserAsk
 * only accepts string content, emit stamps at: Date.now() so the TUI
 * staleness guard passes, and Remote Control mirrors the wrong topic
 * via external_metadata.task_summary.
 *
 *   node lemures.mjs data/lemures.json
 *   echo '{"seed":"lemures"}' | node lemures.mjs
 *
 * Idle word is laid (HOLD: classifier laid to rest on conversation reset).
 * Seeded word is lemures (#93256: remanent latestAsk after /clear + image).
 * Path word is remanent (named path — leftover ask that was never laid).
 *
 * Encoded from anthropics/claude-code#93256 issue body only.
 * Hypothesis (NON-BINDING): process-scoped classifier job state is never
 * reset on conversation reset; findLatestRealUserAsk only accepts string
 * content so image+text returns undefined; emit stamps Date.now() so the
 * staleness guard does not suppress the remanent headline. Verify against
 * #93256 text only. Do NOT claim a root cause in Claude Code source you
 * have not seen. Do NOT implement a fix in anthropics/claude-code.
 * No network. No exploits. No live Claude. No payloads. No secrets.
 */

/* Browser-safe: no top-level node: imports. CLI I/O is loaded only in main(). */

export const VERDICTS = Object.freeze([
  "laid",
  "lemures",
  "remanent",
  "hold",
  "process-scoped",
  "never-reset",
  "string-only",
  "image-skip",
  "emit-now",
  "guard-passes",
  "rc-mirror",
  "bridge-survives",
  "has-repro",
  "cousins",
  "backups",
  "fixtures",
  "chips",
  "fingerprints",
  "walk",
]);

export const IDLE_WORD = "laid";
export const PATH_WORD = "remanent";
export const SEEDED_WORD = "lemures";
export const HOLD = Object.freeze(["laid", "hold"]);
export const RECOVER = Object.freeze(["laid", "hold"]);
export const ALARM = Object.freeze(
  VERDICTS.filter((name) => !HOLD.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FORBIDDEN_IDLE = Object.freeze([
  "released",
  "escheat",
  "stale",
  "freehold",
  "mortmain",
  "phantom",
  "trunked",
  "strowger",
  "exchanged",
  "tokenized",
  "mondegreen",
  "parsed",
  "locked",
  "scratched",
  "derby",
  "unmasked",
  "vizard",
  "precedence",
  "carrier",
  "moored",
  "scuttled",
  "open",
  "seated",
  "stopcock",
  "preserved",
  "discarded",
  "cleared",
  "mounded",
  "distinct",
  "held",
  "raised",
  "fallen",
  "primed",
  "flashed",
  "greenroomed",
  "scaffold",
  "stereotype",
  "parergon",
  "lacuna",
  "hangfire",
  "afterimage",
  "remora",
  "quieted",
  "unrung",
  "latent",
  "flushed",
  "collated",
  "stereotyped",
  "deadair",
  "squelch",
  "scuttle",
  "fresh",
  "stamped",
  "conflated",
  "steered",
  "sterling",
  "lodged",
  "bypassed",
  "diplopic",
  "freewheeling",
  "doubled",
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
  "confirmed",
  "miraged",
  "loosed",
  "clung",
  "enrolled",
  "escheated",
  "debased",
  "culled",
  "quietus",
  "palimpsest",
  "recension",
  "ephemera",
  "mirage",
]);
export const FORBIDDEN_SEED = Object.freeze(
  FORBIDDEN_IDLE.filter((name) => name !== "lemures"),
);

export const FEATURED_ISSUE = 93256;
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/93256";
export const TITLE =
  "Mid-turn task-summary classifier keeps the previous conversation's latestAsk across /clear (and image-bearing prompts never refresh it) — activity line describes a cleared conversation";
export const STATE = "OPEN";
export const LABELS = Object.freeze([
  "bug",
  "has repro",
  "platform:windows",
  "area:tui",
  "area:core",
  "platform:vscode",
]);
export const AUTHOR = "KamilDev";
export const FILED = "2026-09-10T03:53:45Z";
export const CLAUDE_VERSION = "2.1.267";
export const SURFACE =
  "Windows 11, interactive REPL in the VS Code integrated terminal";
export const MODEL = "Opus 5 (1M context), high effort";
export const OS = "Windows 11";
export const PREV_ASK_AT = "03:21:09Z";
export const CLEAR_AT = "03:24:39Z";
export const IMAGE_PROMPT_AT = "03:27:20Z";
export const BASH_AT = "03:32:08Z";
export const CONTENT_SHAPE = "[image, text]";
export const METADATA_FIELD = "external_metadata.task_summary";
export const FINDER = "findLatestRealUserAsk";
export const EMIT_STAMP = "at: Date.now()";
export const BRIDGE_NOTE =
  "bridgeSessionId survives /clear so process-scoped state carries across";
export const PHRASE =
  "when the mid-turn task-summary classifier remanently keeps the previous conversation's latestAsk across /clear, lemures never stay laid — score lemures or admit laid.";

export const COURTYARD_STATIONS = Object.freeze([
  {
    id: "beans",
    rite: "black beans",
    kind: "laying",
    note: "throw beans over the shoulder so latestAsk is laid on /clear",
  },
  {
    id: "cymbals",
    rite: "bronze cymbals",
    kind: "clash",
    note: "clash bronze so the remanent headline cannot pass the guard",
  },
  {
    id: "chalk",
    rite: "chalk circle",
    kind: "bound",
    note: "conversation identity on taskSummary so a shade cannot outlive its courtyard",
  },
]);

export const FINGERPRINT_LINES = Object.freeze([
  "latestAsk",
  "capturedIntent",
  "taskSummary",
  "findLatestRealUserAsk",
  "at: Date.now()",
  "external_metadata.task_summary",
  "bridgeSessionId",
  "conversation_reset",
  "[{type:\"image\"},{type:\"text\"}]",
  "Remote Control",
]);

export const COUSINS = Object.freeze([
  {
    issue: 87533,
    title:
      "same classifier hard-truncates latestAsk at 300 chars with no marker and renders the complaint as the activity line",
    state: "OPEN",
    hasRepro: true,
    citeOnly: true,
    why: "Cite-only cousin — same classifier, different defect; do not rebuild",
  },
]);

export const BACKUPS = Object.freeze([
  {
    issue: 93219,
    title: "Vernier — effort slider inert",
    state: "OPEN",
    product: "Vernier",
    citeOnly: true,
    why: "Vernier — effort slider inert — backup, not primary; cite in data only",
  },
  {
    issue: 93207,
    title: "iOS plan approval setMode auto",
    state: "OPEN",
    citeOnly: true,
    why: "iOS plan approval setMode auto — backup, not primary; cite in data only",
  },
  {
    issue: 93250,
    title: "${PLUGIN_ROOT} not expanded",
    state: "OPEN",
    citeOnly: true,
    why: "${PLUGIN_ROOT} not expanded — backup, not primary; cite in data only",
  },
  {
    issue: 93239,
    title: "Enter interrupts instead of queueing",
    state: "OPEN",
    citeOnly: true,
    why: "Enter interrupts instead of queueing — backup, not primary; cite in data only",
  },
]);

export const NOT_PRODUCTS = Object.freeze([
  "escheat",
  "mortmain",
  "strowger",
  "mondegreen",
  "afterimage",
  "mirage",
  "ephemera",
  "palimpsest",
  "recension",
  "quietus",
]);

/**
 * Conceptual bean bowl — the paterfamilias throws black beans so a
 * remanent latestAsk is laid instead of walking the new courtyard.
 */
export function throwBeans(input = {}) {
  const laid = input.laid === true || input.cleared !== true;
  return {
    beans: 9,
    thrown: laid,
    rite: laid ? "laid" : "lemures",
    latestAsk: laid ? "" : "previous conversation's last ask",
  };
}

/**
 * Conceptual bronze cymbals — clash so a Date.now() emit cannot
 * smuggle a remanent headline past the TUI guard.
 */
export function clashCymbals(input = {}) {
  const remanent =
    input.cleared === true &&
    (input.imagePrompt === true || input.neverReset === true);
  return {
    clashed: !remanent,
    lamp: remanent ? "lemures" : "laid",
    emitNow: input.emitNow === true,
    guardPasses: remanent && input.emitNow === true,
  };
}

export function readCourtyard(input = {}) {
  const beans = throwBeans(input);
  const cymbals = clashCymbals(input);
  const remanentShade = cymbals.lamp === "lemures";
  return {
    beans,
    cymbals,
    stations: COURTYARD_STATIONS,
    remanentShade,
    cue: remanentShade ? "lemures" : "laid",
  };
}

/**
 * Published lemures walk from #93256 only. Facts from the issue body.
 * A laid courtyard resets classifier state on /clear and refreshes
 * latestAsk from multimodal prompts. A lemures courtyard keeps the
 * previous conversation's latestAsk remanent.
 */
export const LEMURES_WALK = Object.freeze([
  {
    t: "idle",
    event: "cue-laid",
    laid: true,
    remoteControl: false,
    textAsk: false,
    cleared: false,
    imagePrompt: false,
    emitNow: false,
    guardPasses: false,
    rcMirror: false,
    bridgeSurvives: false,
    processScoped: false,
    neverReset: false,
    stringOnly: false,
    cue: "laid",
    note: "idle HOLD: classifier laid on conversation reset; multimodal prompts refresh latestAsk",
  },
  {
    t: "rc",
    event: "remote-control",
    remoteControl: true,
    cue: "lemures",
    note: "Remote Control enabled — activates summary/headline surfaces of the mid-turn classifier",
  },
  {
    t: "ask",
    event: "text-ask",
    remoteControl: true,
    textAsk: true,
    cue: "lemures",
    note: "text-only ask with distinctive vocabulary; string content; turn finishes",
  },
  {
    t: "clear",
    event: "conversation-reset",
    cleared: true,
    remoteControl: true,
    textAsk: true,
    cue: "lemures",
    note: "/clear at 03:24:39Z; conversation_reset fires; classifier is never subscribed",
  },
  {
    t: "scope",
    event: "process-scoped",
    processScoped: true,
    neverReset: true,
    cleared: true,
    cue: "lemures",
    note: "classifier job state is process-scoped; no conversation reset clears latestAsk",
  },
  {
    t: "image",
    event: "image-skip",
    imagePrompt: true,
    stringOnly: true,
    cleared: true,
    cue: "lemures",
    note: "image+text prompt at 03:27:20Z; findLatestRealUserAsk only accepts string content",
  },
  {
    t: "emit",
    event: "emit-now",
    emitNow: true,
    imagePrompt: true,
    cleared: true,
    cue: "lemures",
    note: "emit stamps at: Date.now() so the TUI staleness guard does not suppress",
  },
  {
    t: "guard",
    event: "guard-passes",
    guardPasses: true,
    emitNow: true,
    cue: "lemures",
    note: "at is emit time, not the time of the content the phrase describes",
  },
  {
    t: "mirror",
    event: "rc-mirror",
    rcMirror: true,
    remoteControl: true,
    cue: "lemures",
    note: "Remote Control mirrors the wrong topic via external_metadata.task_summary",
  },
  {
    t: "bridge",
    event: "bridge-survives",
    bridgeSurvives: true,
    processScoped: true,
    cue: "lemures",
    note: "bridgeSessionId survives /clear so process-scoped state carries across",
  },
  {
    t: "cut",
    event: "lemures",
    laid: false,
    remoteControl: true,
    textAsk: true,
    cleared: true,
    imagePrompt: true,
    emitNow: true,
    guardPasses: true,
    rcMirror: true,
    bridgeSurvives: true,
    processScoped: true,
    neverReset: true,
    stringOnly: true,
    cue: "lemures",
    note: "activity line describes the cleared conversation's ask; score lemures",
  },
  {
    t: "path",
    event: "remanent",
    remanent: true,
    cue: "lemures",
    note: "remanent latestAsk never laid; image-bearing prompts never refresh it",
  },
]);

function classifyFromSeed(seed) {
  if (seed && VERDICTS.includes(seed)) return seed;
  return null;
}

export function emptyTicket() {
  return {
    seed: IDLE_WORD,
    laid: true,
    remoteControl: false,
    textAsk: false,
    cleared: false,
    imagePrompt: false,
    emitNow: false,
    guardPasses: false,
    rcMirror: false,
    bridgeSurvives: false,
    processScoped: false,
    neverReset: false,
    stringOnly: false,
    cue: "laid",
  };
}

export function seedLaid() {
  return { ...emptyTicket() };
}

export function seedLemures() {
  return {
    seed: SEEDED_WORD,
    laid: false,
    remoteControl: true,
    textAsk: true,
    cleared: true,
    imagePrompt: true,
    emitNow: true,
    guardPasses: true,
    rcMirror: true,
    bridgeSurvives: true,
    processScoped: true,
    neverReset: true,
    stringOnly: true,
    cue: "lemures",
    issue: FEATURED_ISSUE,
  };
}

export function seedRemanent() {
  return {
    seed: PATH_WORD,
    preferSeed: true,
    remanent: true,
    cue: "lemures",
  };
}

export function seedHold() {
  return {
    seed: "hold",
    preferSeed: true,
    laid: true,
    cue: "laid",
  };
}

export function seedProcessScoped() {
  return {
    seed: "process-scoped",
    preferSeed: true,
    processScoped: true,
    neverReset: true,
    cue: "lemures",
  };
}

export function seedNeverReset() {
  return {
    seed: "never-reset",
    preferSeed: true,
    neverReset: true,
    cleared: true,
    cue: "lemures",
  };
}

export function seedStringOnly() {
  return {
    seed: "string-only",
    preferSeed: true,
    stringOnly: true,
    cue: "lemures",
  };
}

export function seedImageSkip() {
  return {
    seed: "image-skip",
    preferSeed: true,
    imagePrompt: true,
    stringOnly: true,
    cue: "lemures",
  };
}

export function seedEmitNow() {
  return {
    seed: "emit-now",
    preferSeed: true,
    emitNow: true,
    cue: "lemures",
  };
}

export function seedGuardPasses() {
  return {
    seed: "guard-passes",
    preferSeed: true,
    guardPasses: true,
    emitNow: true,
    cue: "lemures",
  };
}

export function seedRcMirror() {
  return {
    seed: "rc-mirror",
    preferSeed: true,
    rcMirror: true,
    remoteControl: true,
    cue: "lemures",
  };
}

export function seedBridgeSurvives() {
  return {
    seed: "bridge-survives",
    preferSeed: true,
    bridgeSurvives: true,
    processScoped: true,
    cue: "lemures",
  };
}

export function normalizeBooth(raw) {
  if (!raw || typeof raw !== "object") {
    return {
      laid: false,
      remoteControl: false,
      textAsk: false,
      cleared: false,
      imagePrompt: false,
      emitNow: false,
      guardPasses: false,
      rcMirror: false,
      bridgeSurvives: false,
      processScoped: false,
      neverReset: false,
      stringOnly: false,
      remanent: false,
      cue: null,
      event: null,
      t: null,
    };
  }
  return {
    laid: raw.laid === true,
    remoteControl: raw.remoteControl === true,
    textAsk: raw.textAsk === true,
    cleared: raw.cleared === true,
    imagePrompt: raw.imagePrompt === true,
    emitNow: raw.emitNow === true,
    guardPasses: raw.guardPasses === true,
    rcMirror: raw.rcMirror === true,
    bridgeSurvives: raw.bridgeSurvives === true,
    processScoped: raw.processScoped === true,
    neverReset: raw.neverReset === true,
    stringOnly: raw.stringOnly === true,
    remanent: raw.remanent === true,
    cue: raw.cue || null,
    event: raw.event || raw.kind || null,
    t: raw.t || raw.time || null,
  };
}

function hasBoothFields(ticket) {
  return Boolean(
    ticket &&
      (ticket.laid != null ||
        ticket.remoteControl != null ||
        ticket.textAsk != null ||
        ticket.cleared != null ||
        ticket.imagePrompt != null ||
        ticket.emitNow != null ||
        ticket.guardPasses != null ||
        ticket.rcMirror != null ||
        ticket.bridgeSurvives != null ||
        ticket.processScoped != null ||
        ticket.neverReset != null ||
        ticket.stringOnly != null ||
        ticket.remanent != null ||
        ticket.cue != null ||
        ticket.event),
  );
}

function isLaid(row) {
  if (row.remanent) return false;
  if (row.cue === "lemures") return false;
  if (row.cleared && row.imagePrompt && row.laid !== true) return false;
  if (row.neverReset && row.imagePrompt) return false;
  if (row.laid === true && row.cleared !== true && row.cue !== "lemures") {
    return true;
  }
  if (
    row.cue === "laid" &&
    row.cleared !== true &&
    row.imagePrompt !== true
  ) {
    return true;
  }
  return false;
}

function isLemures(row) {
  if (row.remanent && row.cue !== "laid") return false;
  if (row.cue === "lemures") return true;
  if (row.cleared && row.imagePrompt && row.neverReset) return true;
  if (row.cleared && row.imagePrompt && row.stringOnly) return true;
  if (row.processScoped && row.neverReset && row.cleared) return true;
  if (row.imagePrompt && row.emitNow && row.guardPasses) return true;
  if (row.rcMirror && row.bridgeSurvives) return true;
  return false;
}

function isRemanentPath(row) {
  return row.remanent === true && !isLaid(row);
}

/**
 * Score one courtyard pass against the lemures booth.
 * laid: classifier laid on conversation reset; multimodal prompts refresh latestAsk.
 * lemures: process-scoped latestAsk remanent after /clear; image prompt never refreshes it.
 * remanent: named path — leftover ask that was never laid.
 */
export function scoreGate(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const row = normalizeBooth(ticket);
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);

  let verdict = IDLE_WORD;
  if (isRemanentPath(row)) {
    verdict = "remanent";
  } else if (isLemures(row)) {
    verdict = "lemures";
  } else if (isLaid(row)) {
    verdict = "laid";
  } else if (
    row.cleared ||
    row.imagePrompt ||
    row.neverReset ||
    row.processScoped ||
    row.stringOnly ||
    row.emitNow ||
    row.guardPasses ||
    row.rcMirror ||
    row.bridgeSurvives
  ) {
    verdict = "lemures";
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
    laid: verdict === "laid",
    lemures: verdict === "lemures" || verdict === SEEDED_WORD,
    remanent: verdict === "remanent" || verdict === PATH_WORD,
    remoteControl: row.remoteControl,
    textAsk: row.textAsk,
    cleared: row.cleared,
    imagePrompt: row.imagePrompt,
    emitNow: row.emitNow,
    guardPasses: row.guardPasses,
    rcMirror: row.rcMirror,
    bridgeSurvives: row.bridgeSurvives,
    processScoped: row.processScoped,
    neverReset: row.neverReset,
    stringOnly: row.stringOnly,
    cue: hold ? "laid" : "lemures",
    event: row.event,
    t: row.t,
    phrase: hold ? "admit laid" : "score lemures",
  };
}

export function scoreWalk(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const rows = Array.isArray(ticket.rows)
    ? ticket.rows
    : Array.isArray(ticket.walk)
      ? ticket.walk
      : LEMURES_WALK;
  const scored = rows.map((row) => ({
    ...normalizeBooth(row),
    ...scoreGate({ ...row, preferSeed: false }),
  }));
  const lemures = scored.filter((row) => row.verdict === "lemures");
  const remanent = scored.filter((row) => row.verdict === "remanent");
  const laid = scored.filter((row) => row.verdict === "laid");
  const headline =
    scored.find((row) => row.event === "lemures") ||
    scored.find((row) => row.event === "image-skip") ||
    scored.find((row) => row.event === "never-reset") ||
    scored.find((row) => row.event === "remanent") ||
    lemures[lemures.length - 1];
  let verdict = "laid";
  if (lemures.length) verdict = "lemures";
  else if (remanent.length && !laid.length) verdict = "remanent";
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
    lemuresCount: lemures.length,
    remanentCount: remanent.length,
    laidCount: laid.length,
    headline,
    rows: scored,
    phrase: HOLD.includes(verdict) ? "admit laid" : "score lemures",
    note: headline
      ? "process-scoped latestAsk remanent after /clear; image+text never refreshes it; emit Date.now() passes the guard."
      : "published lemures walk scored against laid vs lemures",
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
    seeded !== "laid" &&
    seeded !== "lemures" &&
    seeded !== "remanent" &&
    ticket.laid == null &&
    ticket.cleared == null &&
    ticket.imagePrompt == null &&
    ticket.neverReset == null &&
    ticket.remanent == null &&
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
    laid: scored.laid ?? false,
    remoteControl: scored.remoteControl ?? false,
    textAsk: scored.textAsk ?? false,
    cleared: scored.cleared ?? false,
    imagePrompt: scored.imagePrompt ?? false,
    emitNow: scored.emitNow ?? false,
    guardPasses: scored.guardPasses ?? false,
    rcMirror: scored.rcMirror ?? false,
    bridgeSurvives: scored.bridgeSurvives ?? false,
    processScoped: scored.processScoped ?? false,
    neverReset: scored.neverReset ?? false,
    stringOnly: scored.stringOnly ?? false,
  };
}

export function score(input) {
  return analyze(input).verdict;
}

export function fingerprint(input) {
  const result = analyze(input);
  return [
    result.verdict,
    result.cleared ? "clear=yes" : "clear=no",
    result.imagePrompt ? "image=skip" : "image=none",
    result.neverReset ? "reset=never" : "reset=laid",
    result.processScoped ? "scope=process" : "scope=conversation",
    result.stringOnly ? "ask=string-only" : "ask=any",
    result.emitNow ? "emit=now" : "emit=content",
    result.cue === "laid" ? "cue=laid" : "cue=lemures",
  ].join("|");
}

export function handle(input) {
  const result = analyze(input);
  const courtyard = readCourtyard({
    laid: result.laid,
    cleared: result.cleared,
    imagePrompt: result.imagePrompt,
    neverReset: result.neverReset,
    emitNow: result.emitNow,
  });
  return {
    ...result,
    fingerprint: fingerprint(input),
    courtyard,
    beans: throwBeans({
      laid: result.laid,
      cleared: result.cleared,
    }),
    cymbals: clashCymbals({
      cleared: result.cleared,
      imagePrompt: result.imagePrompt,
      neverReset: result.neverReset,
      emitNow: result.emitNow,
    }),
    stations: COURTYARD_STATIONS.map((row) => ({
      ...row,
      remanent: result.cleared === true || result.verdict === "lemures",
    })),
    published: {
      issue: FEATURED_ISSUE,
      url: ISSUE_URL,
      title: TITLE,
      state: STATE,
      labels: [...LABELS],
      author: AUTHOR,
      filed: FILED,
      claudeVersion: CLAUDE_VERSION,
      surface: SURFACE,
      model: MODEL,
      os: OS,
      prevAskAt: PREV_ASK_AT,
      clearAt: CLEAR_AT,
      imagePromptAt: IMAGE_PROMPT_AT,
      bashAt: BASH_AT,
      contentShape: CONTENT_SHAPE,
      metadataField: METADATA_FIELD,
      finder: FINDER,
      emitStamp: EMIT_STAMP,
      bridgeNote: BRIDGE_NOTE,
      stations: COURTYARD_STATIONS,
      fingerprintLines: [...FINGERPRINT_LINES],
      cousins: COUSINS.map((row) => row.issue),
      backups: BACKUPS.map((row) => row.issue),
      phrase: PHRASE,
      expected: [
        "reset classifier job state on conversation reset (latestAsk, capturedIntent, prevState, taskSummary)",
        "findLatestRealUserAsk joins text blocks from array content so multimodal prompts refresh latestAsk",
        "carry conversation id on taskSummary and drop it on mismatch",
      ],
      hypothesis:
        "NON-BINDING: process-scoped classifier job state is never reset on conversation reset; findLatestRealUserAsk only accepts string content so image+text returns undefined; emit stamps Date.now() so the staleness guard does not suppress the remanent headline",
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
