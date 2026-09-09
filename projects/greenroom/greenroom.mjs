#!/usr/bin/env node
/**
 * Greenroom — theater green room / offstage waiting booth.
 *
 * Educational diagnostic model for a published Desktop Code tab defect:
 * a green room should HOLD a cue until the entire turn ends (parity with
 * CLI chat:queueSubmit). Instead the cue is STEERED — Enter injects at
 * the next tool-call boundary WITHIN the same turn, Ctrl+Enter is
 * Interrupt, and the bundle's Queue for later option never appears.
 *
 *   node greenroom.mjs data/steered.json
 *   echo '{"seed":"steered"}' | node greenroom.mjs
 *
 * Idle word is held (HOLD: message waits until the entire turn ends —
 * chat:queueSubmit parity).
 * Seeded word is steered (#92988: only mid-turn inject / Interrupt;
 * Queue for later unreachable).
 * Path word is greenroomed (a greenroom that cannot hold a cue until
 * the act ends).
 *
 * Encoded from anthropics/claude-code#92988 issue body only.
 * Hypothesis (NON-BINDING): the Desktop Code tab maps Ctrl+Enter to
 * Interrupt / sendSteeredNow and never surfaces the existing Queue for
 * later / wait-for-turn-end affordance that the bundle strings and CLI
 * chat:queueSubmit already describe; verify against #92988 text only.
 * Do NOT claim a root cause in Claude Code source you have not seen.
 * Do NOT implement a fix in anthropics/claude-code.
 * No network. No exploits. No live Claude. No payloads. No secrets.
 */

/* Browser-safe: no top-level node: imports. CLI I/O is loaded only in main(). */

export const VERDICTS = Object.freeze([
  "held",
  "steered",
  "greenroomed",
  "hold",
  "enter-midturn",
  "ctrl-enter-interrupt",
  "queue-for-later-unreachable",
  "chat-queueSubmit-cli-only",
  "send-button-trio",
  "has-repro",
  "cousins",
  "fixtures",
  "chips",
  "fingerprints",
  "walk",
]);

export const IDLE_WORD = "held";
export const PATH_WORD = "greenroomed";
export const SEEDED_WORD = "steered";
export const HOLD = Object.freeze(["held", "hold"]);
export const RECOVER = Object.freeze(["held", "hold"]);
export const ALARM = Object.freeze(
  VERDICTS.filter((name) => name !== "held" && name !== "hold"),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FORBIDDEN_IDLE = Object.freeze([
  "raised",
  "fallen",
  "scaffold",
  "lodged",
  "bypassed",
  "cutaway",
  "sterling",
  "debased",
  "rubbed",
  "primed",
  "flashed",
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
  "collated",
  "stereotyped",
  "confirmed",
  "miraged",
  "loosed",
  "clung",
  "enrolled",
  "escheated",
]);
export const FORBIDDEN_SEED = Object.freeze(
  FORBIDDEN_IDLE.filter((name) => name !== "steered"),
);

export const FEATURED_ISSUE = 92988;
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/92988";
export const TITLE =
  "Desktop Code tab has no way to queue a message until the turn fully ends — Ctrl+Enter is Interrupt, and the CLI's chat:queueSubmit has no Desktop equivalent";
export const STATE = "OPEN";
export const LABELS = Object.freeze([
  "enhancement",
  "platform:windows",
  "area:desktop",
]);
export const REPORTER = "ahnbu";
export const FILED_AT = "2026-09-09T03:38:25Z";
export const PRODUCT = "Claude Desktop Windows 11 app 1.49585.0 Code tab";
export const VERSION = "1.49585.0";
export const BUNDLED_CLI = "2.1.260";
export const PLATFORM = "windows";
export const KEYBINDINGS = "empty";
export const QUEUE_MESSAGE_ID = "8RUKIaTN4d";
export const QUEUE_LABEL = "Queue for later";
export const CLI_ACTION = "chat:queueSubmit";
export const CLI_QUEUE_SINCE = "2.1.247";
export const CLI_DEFAULT_CHORD = "Ctrl+X Enter";
export const PRIOR_BUILD = "1.46388.4";
export const INTERRUPT_COPY =
  "Interrupts the current step so only this message is read now";
export const PHRASE =
  "a greenroom that cannot hold a cue until the act ends is not held — the cue is steered on mid-scene. Score steered or admit held.";

export const COUSINS = Object.freeze([
  {
    issue: 77724,
    title: "earlier request, closed; the fix landed in the CLI only",
    state: "CLOSED",
    citeOnly: true,
    why: "earlier queue-until-turn-end request — fix landed in CLI only; cite only; do not clone",
  },
  {
    issue: 71726,
    title: "original Desktop-vs-CLI parity gap on mid-task queue injection",
    state: "CLOSED",
    citeOnly: true,
    why: "original Desktop-vs-CLI mid-task queue injection gap — cite only; do not clone",
  },
]);

export const NOT_PRODUCTS = Object.freeze([
  "guillotine",
  "entresol",
  "hallmark",
  "flashpan",
  "secateurs",
  "palinode",
  "ferrule",
  "interlock",
  "shibboleth",
  "homestead",
  "quill",
  "colophon",
  "sallyport",
  "epitaph",
  "recension",
  "mirage",
  "remora",
  "procrustes",
  "cadastre",
  "rubric",
  "sheave",
  "mailslot",
  "ukase",
  "scabbard",
  "deadletter",
  "hangfire",
  "detent",
  "oubliette",
  "ephemera",
  "assay",
]);

export const SEND_BUTTON_TRIO = Object.freeze([
  { label: "Send", key: "Enter" },
  { label: "Interrupt", key: "Ctrl+Enter" },
  { label: "Send in a forked session", key: "Ctrl+Alt+Enter" },
]);

/**
 * Published greenroom walk from #92988 only. Facts from the issue body.
 * A held cue waits until the entire turn ends. A steered cue injects
 * mid-turn or interrupts.
 */
export const GREENROOM_WALK = Object.freeze([
  {
    t: "idle",
    event: "cue-held",
    queueUntilTurnEnd: true,
    queueForLaterVisible: true,
    interruptOnCtrlEnter: false,
    midTurnInject: false,
    cue: "held",
    note: "idle HOLD: message waits until the entire turn ends — chat:queueSubmit parity",
  },
  {
    t: "enter",
    event: "enter-midturn",
    queueUntilTurnEnd: false,
    midTurnInject: true,
    sendAvailable: true,
    cue: "steered",
    note: "Enter queues but injects at the next tool-call boundary WITHIN the same turn",
  },
  {
    t: "interrupt",
    event: "ctrl-enter-interrupt",
    interruptOnCtrlEnter: true,
    queueForLaterVisible: false,
    cue: "steered",
    note: "Ctrl+Enter is Interrupt — opposite of waiting",
  },
  {
    t: "trio",
    event: "send-button-trio",
    sendAvailable: true,
    interruptOnCtrlEnter: true,
    forkAvailable: true,
    queueForLaterVisible: false,
    cue: "steered",
    note: "send-button tooltip lists Send / Interrupt / Send in a forked session only",
  },
  {
    t: "later",
    event: "queue-for-later-unreachable",
    queueForLaterVisible: false,
    queueForLaterUnreachable: true,
    queueMessageId: QUEUE_MESSAGE_ID,
    noMouseDropdown: true,
    cue: "steered",
    note: "bundle ships Queue for later (8RUKIaTN4d) but it never appears",
  },
  {
    t: "cli",
    event: "chat-queueSubmit-cli-only",
    chatQueueSubmitCli: true,
    desktopShortcutParity: false,
    ctrlSlashHasEquivalent: false,
    cue: "steered",
    note: "CLI chat:queueSubmit exists; Desktop docs say terminal shortcuts do not apply",
  },
  {
    t: "settings",
    event: "no-settings-toggle",
    settingsToggle: false,
    settingsSchema: false,
    emptyKeybindings: true,
    restartNoChange: true,
    priorBuild: PRIOR_BUILD,
    version: VERSION,
    cue: "steered",
    note: "no settings JSON schema / Settings toggle; restart 1.46388.4 → 1.49585.0 did not change this",
  },
  {
    t: "path",
    event: "greenroomed",
    greenroomed: true,
    queueUntilTurnEnd: false,
    cue: "steered",
    note: "a greenroom that cannot hold a cue until the act ends is not held",
  },
]);

function classifyFromSeed(seed) {
  if (seed && VERDICTS.includes(seed)) return seed;
  return null;
}

export function emptyTicket() {
  return {
    seed: IDLE_WORD,
    queueUntilTurnEnd: true,
    queueForLaterVisible: true,
    queueForLaterUnreachable: false,
    interruptOnCtrlEnter: false,
    midTurnInject: false,
    sendAvailable: true,
    forkAvailable: true,
    chatQueueSubmitCli: true,
    desktopShortcutParity: true,
    settingsToggle: true,
    settingsSchema: true,
    emptyKeybindings: true,
    restartNoChange: false,
    cue: "held",
  };
}

export function seedHeld() {
  return { ...emptyTicket() };
}

export function seedSteered() {
  return {
    seed: SEEDED_WORD,
    queueUntilTurnEnd: false,
    queueForLaterVisible: false,
    queueForLaterUnreachable: true,
    interruptOnCtrlEnter: true,
    midTurnInject: true,
    sendAvailable: true,
    forkAvailable: true,
    chatQueueSubmitCli: true,
    desktopShortcutParity: false,
    ctrlSlashHasEquivalent: false,
    settingsToggle: false,
    settingsSchema: false,
    emptyKeybindings: true,
    restartNoChange: true,
    noMouseDropdown: true,
    cue: "steered",
    issue: FEATURED_ISSUE,
    version: VERSION,
    bundledCli: BUNDLED_CLI,
    queueMessageId: QUEUE_MESSAGE_ID,
  };
}

export function seedGreenroomed() {
  return {
    seed: PATH_WORD,
    preferSeed: true,
    greenroomed: true,
    queueUntilTurnEnd: false,
    cue: "steered",
  };
}

export function seedEnterMidturn() {
  return {
    seed: "enter-midturn",
    midTurnInject: true,
    queueUntilTurnEnd: false,
    sendAvailable: true,
    cue: "steered",
  };
}

export function seedCtrlEnterInterrupt() {
  return {
    seed: "ctrl-enter-interrupt",
    interruptOnCtrlEnter: true,
    queueForLaterVisible: false,
    cue: "steered",
    interruptCopy: INTERRUPT_COPY,
  };
}

export function normalizeBooth(raw) {
  if (!raw || typeof raw !== "object") {
    return {
      queueUntilTurnEnd: false,
      queueForLaterVisible: false,
      queueForLaterUnreachable: false,
      interruptOnCtrlEnter: false,
      midTurnInject: false,
      sendAvailable: false,
      forkAvailable: false,
      chatQueueSubmitCli: false,
      desktopShortcutParity: false,
      ctrlSlashHasEquivalent: false,
      settingsToggle: false,
      settingsSchema: false,
      emptyKeybindings: false,
      restartNoChange: false,
      noMouseDropdown: false,
      greenroomed: false,
      cue: null,
      event: null,
      t: null,
      queueMessageId: null,
    };
  }
  return {
    queueUntilTurnEnd:
      raw.queueUntilTurnEnd === true || raw.waitForFullTurn === true,
    queueForLaterVisible: raw.queueForLaterVisible === true,
    queueForLaterUnreachable:
      raw.queueForLaterUnreachable === true ||
      raw.queueForLaterVisible === false,
    interruptOnCtrlEnter: raw.interruptOnCtrlEnter === true,
    midTurnInject: raw.midTurnInject === true,
    sendAvailable: raw.sendAvailable === true,
    forkAvailable: raw.forkAvailable === true,
    chatQueueSubmitCli:
      raw.chatQueueSubmitCli === true || raw.cliQueueSubmit === true,
    desktopShortcutParity: raw.desktopShortcutParity === true,
    ctrlSlashHasEquivalent: raw.ctrlSlashHasEquivalent === true,
    settingsToggle: raw.settingsToggle === true,
    settingsSchema: raw.settingsSchema === true,
    emptyKeybindings: raw.emptyKeybindings === true,
    restartNoChange: raw.restartNoChange === true,
    noMouseDropdown: raw.noMouseDropdown === true,
    greenroomed: raw.greenroomed === true,
    cue: raw.cue || null,
    event: raw.event || raw.kind || null,
    t: raw.t || raw.time || null,
    queueMessageId: raw.queueMessageId || raw.messageId || null,
  };
}

function hasBoothFields(ticket) {
  return Boolean(
    ticket &&
      (ticket.queueUntilTurnEnd != null ||
        ticket.waitForFullTurn != null ||
        ticket.queueForLaterVisible != null ||
        ticket.queueForLaterUnreachable != null ||
        ticket.interruptOnCtrlEnter != null ||
        ticket.midTurnInject != null ||
        ticket.greenroomed != null ||
        ticket.cue != null ||
        ticket.chatQueueSubmitCli != null ||
        ticket.desktopShortcutParity != null ||
        ticket.event),
  );
}

function isHeld(row) {
  if (row.greenroomed) return false;
  if (row.cue === "steered") return false;
  if (row.midTurnInject && !row.queueUntilTurnEnd) return false;
  if (row.interruptOnCtrlEnter && !row.queueForLaterVisible) return false;
  if (
    row.queueUntilTurnEnd === true &&
    !row.midTurnInject &&
    !row.interruptOnCtrlEnter
  ) {
    return true;
  }
  if (
    row.queueForLaterVisible === true &&
    !row.queueForLaterUnreachable &&
    !row.interruptOnCtrlEnter &&
    !row.midTurnInject
  ) {
    return true;
  }
  if (row.cue === "held" && row.queueUntilTurnEnd !== false) return true;
  return false;
}

function isSteered(row) {
  if (row.greenroomed && !row.queueUntilTurnEnd) return false;
  if (row.cue === "steered") return true;
  if (row.midTurnInject && !row.queueUntilTurnEnd) return true;
  if (row.interruptOnCtrlEnter && !row.queueForLaterVisible) return true;
  if (row.queueForLaterUnreachable && !row.queueUntilTurnEnd) return true;
  return false;
}

function isGreenroomed(row) {
  return row.greenroomed === true && !isHeld(row);
}

/**
 * Score one Code-tab seating against the greenroom booth.
 * held: cue waits until the entire turn ends; chat:queueSubmit parity.
 * steered: mid-turn inject / Interrupt; Queue for later unreachable.
 * greenroomed: named path — the booth cannot hold a cue until the act ends.
 */
export function scoreGate(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const row = normalizeBooth(ticket);
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);

  let verdict = IDLE_WORD;
  if (isGreenroomed(row)) {
    verdict = "greenroomed";
  } else if (isSteered(row)) {
    verdict = "steered";
  } else if (isHeld(row)) {
    verdict = "held";
  } else if (
    row.interruptOnCtrlEnter ||
    row.midTurnInject ||
    row.queueForLaterUnreachable
  ) {
    verdict = "steered";
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
    held: verdict === "held",
    steered: verdict === "steered" || verdict === SEEDED_WORD,
    greenroomed: verdict === "greenroomed" || verdict === PATH_WORD,
    queueUntilTurnEnd: row.queueUntilTurnEnd,
    queueForLaterVisible: row.queueForLaterVisible,
    queueForLaterUnreachable: row.queueForLaterUnreachable,
    interruptOnCtrlEnter: row.interruptOnCtrlEnter,
    midTurnInject: row.midTurnInject,
    sendAvailable: row.sendAvailable,
    forkAvailable: row.forkAvailable,
    chatQueueSubmitCli: row.chatQueueSubmitCli,
    desktopShortcutParity: row.desktopShortcutParity,
    ctrlSlashHasEquivalent: row.ctrlSlashHasEquivalent,
    settingsToggle: row.settingsToggle,
    settingsSchema: row.settingsSchema,
    emptyKeybindings: row.emptyKeybindings,
    restartNoChange: row.restartNoChange,
    noMouseDropdown: row.noMouseDropdown,
    cue: hold ? "held" : "steered",
    event: row.event,
    t: row.t,
    queueMessageId: row.queueMessageId,
    phrase: hold ? "admit held" : "score steered",
  };
}

export function scoreWalk(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const rows = Array.isArray(ticket.rows)
    ? ticket.rows
    : Array.isArray(ticket.walk)
      ? ticket.walk
      : GREENROOM_WALK;
  const scored = rows.map((row) => ({
    ...normalizeBooth(row),
    ...scoreGate({ ...row, preferSeed: false }),
  }));
  const steered = scored.filter((row) => row.verdict === "steered");
  const greenroomed = scored.filter((row) => row.verdict === "greenroomed");
  const held = scored.filter((row) => row.verdict === "held");
  const headline =
    scored.find((row) => row.event === "queue-for-later-unreachable") ||
    scored.find((row) => row.event === "ctrl-enter-interrupt") ||
    scored.find((row) => row.event === "greenroomed") ||
    steered[steered.length - 1];
  let verdict = "held";
  if (steered.length) verdict = "steered";
  else if (greenroomed.length && !held.length) verdict = "greenroomed";
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
    steeredCount: steered.length,
    greenroomedCount: greenroomed.length,
    heldCount: held.length,
    headline,
    rows: scored,
    phrase: HOLD.includes(verdict) ? "admit held" : "score steered",
    note: headline
      ? "Desktop Code tab has no way to queue a message until the turn fully ends; Ctrl+Enter is Interrupt; Queue for later never appears"
      : "published greenroom walk scored against held vs steered",
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
    seeded !== "held" &&
    seeded !== "steered" &&
    seeded !== "greenroomed" &&
    ticket.queueUntilTurnEnd == null &&
    ticket.interruptOnCtrlEnter == null &&
    ticket.midTurnInject == null &&
    ticket.queueForLaterVisible == null &&
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
    queueUntilTurnEnd: scored.queueUntilTurnEnd ?? false,
  };
}

export function score(input) {
  return analyze(input).verdict;
}

export function fingerprint(input) {
  const result = analyze(input);
  return [
    result.verdict,
    result.queueUntilTurnEnd ? "queue=until-turn-end" : "queue=mid-turn",
    result.interruptOnCtrlEnter ? "ctrl-enter=interrupt" : "ctrl-enter=hold",
    result.queueForLaterVisible ? "later=visible" : "later=unreachable",
    result.cue === "held" ? "cue=held" : "cue=steered",
  ].join("|");
}

export function handle(input) {
  const result = analyze(input);
  return {
    ...result,
    fingerprint: fingerprint(input),
    published: {
      issue: FEATURED_ISSUE,
      url: ISSUE_URL,
      title: TITLE,
      state: STATE,
      labels: [...LABELS],
      reporter: REPORTER,
      filedAt: FILED_AT,
      product: PRODUCT,
      version: VERSION,
      bundledCli: BUNDLED_CLI,
      platform: PLATFORM,
      keybindings: KEYBINDINGS,
      queueMessageId: QUEUE_MESSAGE_ID,
      queueLabel: QUEUE_LABEL,
      cliAction: CLI_ACTION,
      cliQueueSince: CLI_QUEUE_SINCE,
      cliDefaultChord: CLI_DEFAULT_CHORD,
      priorBuild: PRIOR_BUILD,
      interruptCopy: INTERRUPT_COPY,
      sendButtonTrio: SEND_BUTTON_TRIO.map((row) => row.label),
      cousins: COUSINS.map((row) => row.issue),
      phrase: PHRASE,
      expected: [
        "Desktop Code tab can queue a message until the entire turn ends",
        "parity with CLI chat:queueSubmit (never interrupts the turn)",
        "Queue for later is reachable as a send-button option, keystroke, or setting",
        "Ctrl+Enter is not the only chord and is not forced to Interrupt",
      ],
      hypothesis:
        "the Desktop Code tab maps Ctrl+Enter to Interrupt / sendSteeredNow and never surfaces the existing Queue for later / wait-for-turn-end affordance that the bundle strings and CLI chat:queueSubmit already describe",
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
