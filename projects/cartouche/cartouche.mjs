#!/usr/bin/env node
/**
 * Cartouche — Egyptian cartouche / name-oval / temple-relief booth.
 *
 * Educational diagnostic model for a published Claude Code defect:
 * "Draw a diagram to explain X" defaults to a section-summary poster
 * instead of the diagram type X calls for. Asked to diagram a technical
 * doc whose subject is per-turn data flow through a pipeline, the model
 * produced a three-column infographic restating section headings in
 * colored boxes — twice, including after a regeneration — rather than
 * a dataflow/flow diagram (nodes and edges: who reads/writes whom).
 *
 *   node cartouche.mjs data/cartouche.json
 *   echo '{"seed":"cartouche"}' | node cartouche.mjs
 *
 * Idle word is diagrammed (HOLD: nodes+edges / dataflow inferred from subject).
 * Seeded word is cartouche (#93772 — ornamental name-oval restates headings).
 * Path word is section-poster.
 * Product score word is cartouche (Score cartouche or admit diagrammed.).
 *
 * Encoded from anthropics/claude-code#93772 issue text only.
 * Hypothesis (NON-BINDING): the model defaults to a section-summary
 * infographic layout when asked to "draw a diagram" without an explicit
 * type, instead of inferring dataflow from subject matter. Do NOT claim
 * a root cause in Claude Code source you have not seen. Do NOT implement
 * a fix. No network. No exploits. No live Claude. No secrets.
 *
 * NOT Attaint/#93821 (medieval court-roll attainder).
 * NOT Oriel/#93809 (Gothic oriel / plan no-reflow).
 * NOT Anarthria/#93782 (dictation paste drop).
 * NOT Trismus, Foundling, Crasis, Tessera, Mojibake, Scissel,
 * Feoffee, Apograph, Airlock, Scotoma, Attainder.
 * Cartouche is specifically a wrong-diagram-type booth: section-summary
 * poster instead of dataflow when the subject is pipeline data flow.
 */

/* Browser-safe: no top-level node: imports. CLI I/O is loaded only in main(). */

export const VERDICTS = Object.freeze([
  "diagrammed",
  "cartouche",
  "section-poster",
  "hold",
  "nodal",
  "edged",
  "dataflow",
  "flow-inferred",
  "type-matched",
  "heading-boxes",
  "infographic-restate",
  "prose-duplicate",
  "no-independent-info",
  "regenerate-same",
  "type-unasked",
  "landing",
  "has-repro",
  "cousins",
  "backups",
  "fixtures",
  "walk",
]);

export const IDLE_WORD = "diagrammed";
export const PATH_WORD = "section-poster";
export const SEEDED_WORD = "cartouche";
export const PRODUCT_WORD = "cartouche";
export const HOLD = Object.freeze(["diagrammed", "hold"]);
export const HOLD_ALIASES = Object.freeze([
  "diagrammed",
  "nodal",
  "edged",
  "dataflow",
  "flow-inferred",
  "type-matched",
]);
export const RECOVER = Object.freeze(["diagrammed", "hold"]);
export const ALARM = Object.freeze(
  VERDICTS.filter((name) => !HOLD.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FORBIDDEN_IDLE = Object.freeze([
  "unattainted",
  "attaint",
  "session-attainder",
  "reflowed",
  "oriel",
  "plan-no-reflow",
  "articulate",
  "anarthria",
  "dictation-paste-drop",
  "limber",
  "trismus",
  "notif-xpc-deadlock",
  "filiated",
  "foundling",
  "subagent-bash-outlive",
  "injective",
  "crased",
  "crasis",
  "store-slug-collide",
  "unitary",
  "tessellated",
  "tessera",
  "version-path-tcc",
  "verbatim",
  "mojibaked",
  "mojibake",
  "fffd-spall",
  "plenary",
  "scisselled",
  "scissel",
  "argv-trunc",
  "vested",
  "unseised",
  "preview-eperm",
  "feoffee",
  "singular",
  "apographed",
  "apograph",
  "reopen-fork",
  "airlock",
  "equalized",
  "blown",
  "socat-race",
  "scotoma",
  "legible",
  "scotomized",
  "command-args-blind",
  "aneroid",
  "calibrated",
  "aneroided",
  "wrong-window-ring",
  "simulacrum",
  "tethered",
  "hollow",
  "phantom-navigate",
  "solenoid",
  "engaged",
  "inert",
  "warm-before-message",
  "scotia",
  "scotiated",
  "decstbm-undershoot",
  "flush",
  "canard",
  "candid",
  "canarded",
  "stet",
  "stetted",
  "rewound",
  "mic-resume-wipe",
  "blindside",
  "interdict",
  "simplex",
  "deadkey",
  "gleaner",
  "schism",
  "rasure",
  "ashpan",
  "outrider",
  "necrology",
  "innominate",
  "snuffer",
  "changeling",
  "homograph",
  "galley",
  "rescript",
  "monadnock",
  "rider",
  "followspot",
  "calends",
  "weir",
  "irons",
  "cathead",
  "untainted",
  "attainted",
  "attainder",
  "retire-parked",
  "scrubbed",
  "contaminated",
  "fomite",
  "gitignore",
  "spanned",
  "sashed",
  "bayed",
  "projected",
  "fenestrated",
  "width-fit",
  "phonated",
  "received",
  "larynx-open",
  "clipboard-heard",
  "as-penned",
  "unlocked",
  "responsive",
  "async-notif",
  "free-main",
  "unclenched",
  "letters-patent",
  "demesne-open",
  "getcwd-eperm",
  "voiced",
  "muted",
  "sourdine",
  "mid-narration",
  "mondegreen",
  "tokenized",
  "parsed",
  "seizing",
  "culled",
  "sole",
  "hangfire",
  "flashpan",
  "flashed",
  "primed",
  "flashpanned",
  "frizzen",
  "mirage",
  "miraged",
  "confirmed",
  "counterfoil",
  "cachet",
  "forksink",
  "foxfire",
  "pentimento",
  "vinculum",
  "strobe",
  "lodged",
  "kindled",
  "flushed",
  "solitary",
  "hit",
  "dropped",
  "painted",
  "lagged",
  "twinlinked",
  "flattened",
  "held",
  "steered",
  "greenroomed",
  "greenroom",
  "rubric",
  "quoin",
  "casement",
  "palimpsest",
  "oubliette",
  "ephemera",
  "homonym",
  "quench",
  "stopcock",
  "hasp",
  "scuttle",
  "aphonia",
  "muzzle",
  "leaking",
  "excised",
  "escutcheon",
  "lacuna",
  "annunciator",
  "tocsin",
  "knell",
  "wraith",
  "scrim",
  "knock",
  "reliquary",
  "cenotaph",
  "afterimage",
  "midden",
  "eidolon",
  "guillotine",
  "clepsydra",
  "springe",
  "deadlight",
  "damper",
  "sounder",
  "parergon",
  "carrier",
  "deadair",
  "squelch",
  "lazaret",
  "deadletter",
  "released",
  "frozen",
  "sostenuto",
  "tabula",
  "ukase",
  "scapegoat",
  "alidade",
  "diopter",
  "sluice",
  "warm",
  "sheltered",
  "waif",
  "jetsam",
  "bonded",
  "registered",
  "warded",
  "parented",
  "silted",
  "drained",
]);

export const FORBIDDEN_SEED = Object.freeze(
  FORBIDDEN_IDLE.filter((name) => name !== "cartouche"),
);

export const FEATURED_ISSUE = 93772;
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/93772";
export const TITLE =
  '"Draw a diagram to explain X" defaults to a section-summary poster instead of the diagram type X calls for';
export const STATE = "OPEN";
export const LABELS = Object.freeze(["bug", "area:model"]);
export const PLATFORM = "cli";
export const SURFACE = "wrong-diagram-type-section-poster";
export const HOST = "Claude Code CLI";
export const CHECKED_ON =
  "Claude Code CLI, model claude-fable-5, diagrams via an external CLI tool the session drives";
export const BUILD = "cli";
export const SELECTED_MODEL = "claude-fable-5";
export const OS = "unspecified";
export const PHRASE = "Score cartouche or admit diagrammed.";
export const DISTRIBUTION =
  "A Claude Code CLI user asked claude-fable-5 to draw a diagram for a technical doc whose subject is per-turn data flow through a pipeline. It produced a three-column infographic restating the doc's section headings in colored boxes — twice, including after a regeneration — rather than a dataflow/flow diagram (nodes and edges: who reads/writes whom). Expected: infer the diagram type from the subject (a doc about data flow ⇒ flow diagram), or ask which type is wanted before rendering. The poster duplicated the adjacent prose and carried no independent information. Diagrams were generated via an external CLI tool the session drives.";

export const RULED_OUT = Object.freeze([
  "Attaint/#93821 session-attainder cyber-safeguard — different defect; a court-roll stain, not a wrong diagram type",
  "Oriel/#93809 plan-window no-reflow — different defect; a fixed manuscript column, not a section-summary poster",
  "Anarthria/#93782 dictation-paste-drop — different defect; mute larynx on Wispr Ctrl+V, not a diagram type miss",
  "Trismus/#93823 UNUserNotification XPC lockjaw — macOS Desktop freeze, not a poster-vs-dataflow miss",
  "Foundling/#93889 subagent Bash orphaning — child-agent lifecycle, not a diagram type",
  "Crasis/#93960 non-injective store slug — memory drawer collision, not a section-poster",
  "Tessera/#93929 version-path TCC — privacy-pane rows, not a cartouche",
  "Mojibake/#93848 Windows CLAUDE.md U+FFFD — encoding spall, not a heading-box poster",
  "Scissel/#93915 Windows Bash argv truncation — mint scrap, not a name-oval",
  "Feoffee/#93863 preview_start getcwd EPERM — seisin miss, not a false door",
  "Apograph/#93859 Desktop reopen-fork — transcript copy, not a dataflow miss",
  "Airlock/#93862 sandbox socat race — readiness, not a diagram type",
  "Scotoma/#93744 command-args-blind — Stop evaluator, not a section-summary poster",
]);
export const EXPECTED = Object.freeze([
  "Infer the diagram type from the subject: a doc about per-turn data flow ⇒ a flow/dataflow diagram with nodes and edges",
  "Or ask which diagram type is wanted before rendering",
  "Do not default to a three-column section-summary infographic that restates headings in colored boxes",
  "A diagram should carry independent information — not duplicate the adjacent prose",
  "Regeneration should not produce the same wrong poster a second time",
]);

export const FIELD_MARKS = Object.freeze([
  {
    id: "heading-boxes",
    label: "heading boxes",
    count: "three-column",
    note: "section headings restated in colored boxes instead of nodes and edges",
  },
  {
    id: "infographic-restate",
    label: "infographic",
    count: "restate",
    note: "three-column infographic restates the doc's section headings",
  },
  {
    id: "prose-duplicate",
    label: "prose duplicate",
    count: "no-new-info",
    note: "the poster duplicated the adjacent prose and carried no independent information",
  },
  {
    id: "regenerate-same",
    label: "regenerate",
    count: "twice",
    note: "same section-summary poster after a regeneration",
  },
  {
    id: "type-unasked",
    label: "type unasked",
    count: "no-prompt",
    note: "did not infer dataflow from subject; did not ask which type was wanted",
  },
]);

export const BOOTH_STATIONS = Object.freeze([
  {
    id: "diagrammed-relief",
    survey:
      "nodes and edges inferred from the pipeline subject; false door opens to a dataflow schematic",
    kind: "diagrammed",
    note: "idle: diagrammed — the hold/good path",
  },
  {
    id: "heading-boxes",
    survey:
      "three-column heading boxes restating the doc's section titles instead of who-reads-whom",
    kind: "cartouche",
    note: "seeded: ornamental name-oval restates labels",
  },
  {
    id: "infographic-restate",
    survey:
      "ask-for-diagram produced a section-summary infographic, including after regeneration",
    kind: "cartouche",
    note: "seeded: infographic-restate of adjacent headings",
  },
  {
    id: "section-poster",
    survey:
      "false door slams open to a three-column section-poster; gold oval seals shut over the missing graph",
    kind: "cartouche",
    note: "path: section-poster names the wrong-diagram-type vs a diagrammed relief",
  },
  {
    id: "cartouche",
    survey:
      "the name-oval is cartouche — headings boxed, no nodes, no edges, no independent information",
    kind: "cartouche",
    note: "seeded: cartouche — Score cartouche or admit diagrammed.",
  },
]);

export const FINGERPRINT_LINES = Object.freeze([
  "section-poster",
  "cartouche",
  "heading-boxes",
  "infographic-restate",
  "prose-duplicate",
  "type-unasked",
]);

export const COUSINS = Object.freeze([]);

export const BACKUPS = Object.freeze([
  { issue: 93770, title: "backup #93770 TUI copy padding", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93777, title: "backup #93777 Vercel MCP teamId not forwarded", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93811, title: "backup #93811", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93924, title: "backup #93924 RC local slowdown", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93925, title: "backup #93925", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93954, title: "backup #93954", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93967, title: "backup #93967", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93957, title: "backup #93957", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93989, title: "backup #93989 bwrap /home bind", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93987, title: "backup #93987 reload-skills", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
]);

export const NOT_PRODUCTS = Object.freeze([
  "attaint",
  "oriel",
  "anarthria",
  "trismus",
  "foundling",
  "crasis",
  "tessera",
  "mojibake",
  "scissel",
  "feoffee",
  "apograph",
  "airlock",
  "scotoma",
  "attainder",
  "fomite",
  "aneroid",
  "simulacrum",
  "solenoid",
  "scotia",
  "canard",
  "stet",
  "blindside",
  "interdict",
  "schism",
  "gleaner",
  "deadkey",
  "rasure",
  "ashpan",
  "outrider",
  "simplex",
  "rubric",
  "galley",
]);

export const SAMPLE_KIND_IDLE = "dataflow";
export const SAMPLE_KIND_SEEDED = "section-poster";
export const SAMPLE_OVAL_IDLE = "open";
export const SAMPLE_OVAL_SEEDED = "sealed";

export const SAMPLE_DIAGRAMMED_PROOF = Object.freeze({
  diagrammed: true,
  cartouche: false,
  sectionPoster: false,
  headingBoxes: false,
  infographicRestate: false,
  proseDuplicate: false,
  noIndependentInfo: false,
  regenerateSame: false,
  typeUnasked: false,
  kind: SAMPLE_KIND_IDLE,
});

export const SAMPLE_CARTOUCHE_PROOF = Object.freeze({
  diagrammed: false,
  cartouche: true,
  sectionPoster: true,
  headingBoxes: true,
  infographicRestate: true,
  proseDuplicate: true,
  noIndependentInfo: true,
  regenerateSame: true,
  typeUnasked: true,
  kind: SAMPLE_KIND_SEEDED,
});

export const SAMPLE_WALK_LOG = Object.freeze([
  { t: "idle", line: "booth holds diagrammed: nodes and edges inferred from pipeline data flow; gold oval stays open" },
  { t: "heading-boxes", line: "three-column heading boxes restate the doc's section titles instead of who-reads-whom" },
  { t: "infographic-restate", line: "ask-for-diagram produced a section-summary infographic — twice, including after regeneration" },
  { t: "path", line: "section-poster — false door slams to heading columns; gold oval seals shut over the missing graph" },
  { t: "score", line: "when the name-oval restates headings instead of drawing dataflow the booth is cartouche — Score cartouche or admit diagrammed." },
]);

/**
 * Scope map: open dataflow oval vs sealed cartouche.
 * Idle/diagrammed: nodes+edges inferred from subject.
 * Seeded/cartouche: section-summary poster seals the oval.
 */
export function mapScope(input = {}) {
  const cartouche =
    input.cartouche === true ||
    input.sectionPoster === true ||
    input.headingBoxes === true ||
    input.infographicRestate === true ||
    input.proseDuplicate === true ||
    input.noIndependentInfo === true ||
    input.regenerateSame === true ||
    input.typeUnasked === true;
  const diagrammed = input.diagrammed === true && !cartouche;
  return {
    stamp: cartouche ? "section-poster" : "diagrammed-relief",
    ovalLane: cartouche ? "sealed" : "open",
    kindLane: cartouche ? "section-poster" : "dataflow",
    typeLane: cartouche ? "unasked" : "inferred",
    ribbon: cartouche ? "cartouche" : "diagrammed",
    diagrammed,
  };
}

export function inspectOval(input = {}) {
  const sealed =
    input.cartouche === true ||
    input.sectionPoster === true ||
    input.headingBoxes === true;
  if (input.diagrammed === true && !sealed) {
    return {
      stamp: "oval-open",
      sealed: false,
    };
  }
  return {
    stamp: sealed ? "oval-sealed" : "oval-idle",
    sealed,
    note: sealed
      ? "gold oval seals shut over the missing graph"
      : "",
  };
}

export function inspectPoster(input = {}) {
  const hit =
    input.sectionPoster === true ||
    input.headingBoxes === true ||
    input.infographicRestate === true ||
    input.cartouche === true;
  if (input.diagrammed === true && !hit) {
    return {
      stamp: "poster-absent",
      columns: 0,
    };
  }
  return {
    stamp: hit ? "section-poster" : "poster-idle",
    columns: hit ? 3 : 0,
    note: hit
      ? "three-column section-summary poster restates headings in colored boxes"
      : "",
  };
}

export function inspectType(input = {}) {
  const unasked =
    input.typeUnasked === true ||
    input.cartouche === true ||
    input.infographicRestate === true;
  if (input.diagrammed === true && !unasked) {
    return {
      stamp: "type-matched",
      inferred: true,
    };
  }
  return {
    stamp: unasked ? "type-unasked" : "type-idle",
    inferred: !unasked && input.diagrammed === true,
    note: unasked
      ? "did not infer dataflow from the pipeline subject; did not ask which type was wanted"
      : "",
  };
}

export function inspectProse(input = {}) {
  const duplicate =
    input.proseDuplicate === true ||
    input.noIndependentInfo === true ||
    input.cartouche === true;
  if (input.diagrammed === true && !duplicate) {
    return {
      stamp: "independent-info",
      duplicate: false,
    };
  }
  return {
    stamp: duplicate ? "prose-duplicate" : "prose-idle",
    duplicate,
    note: duplicate
      ? "the poster duplicated the adjacent prose and carried no independent information"
      : "",
  };
}

export function inspectRegen(input = {}) {
  const same =
    input.regenerateSame === true ||
    input.cartouche === true;
  if (input.diagrammed === true && !same) {
    return {
      stamp: "regen-idle",
      same: false,
    };
  }
  return {
    stamp: same ? "regenerate-same" : "regen-idle",
    same,
    note: same
      ? "same section-summary poster after a regeneration"
      : "",
  };
}

export function readBooth(input = {}) {
  const cartouche =
    input.cartouche === true ||
    input.sectionPoster === true ||
    input.headingBoxes === true ||
    input.infographicRestate === true ||
    input.proseDuplicate === true ||
    input.noIndependentInfo === true ||
    input.regenerateSame === true ||
    input.typeUnasked === true;
  const diagrammed = input.diagrammed === true && !cartouche;
  return {
    mark: cartouche ? "cartouche" : diagrammed || !cartouche ? "diagrammed" : "cartouche",
    diagrammed,
    cartouche,
    sectionPoster: input.sectionPoster === true || cartouche,
    headingBoxes: input.headingBoxes === true,
    infographicRestate: input.infographicRestate === true,
    proseDuplicate: input.proseDuplicate === true,
    noIndependentInfo: input.noIndependentInfo === true,
    regenerateSame: input.regenerateSame === true,
    typeUnasked: input.typeUnasked === true,
    scope: mapScope(input),
    oval: inspectOval(input),
    poster: inspectPoster(input),
    type: inspectType(input),
    prose: inspectProse(input),
    regen: inspectRegen(input),
    log: input.log || [],
  };
}

export const CARTOUCHE_WALK = Object.freeze([
  {
    t: "idle",
    event: "cue-diagrammed",
    diagrammed: true,
    cartouche: false,
    cue: "diagrammed",
    note: "idle HOLD: nodes and edges inferred from pipeline data flow — the hold/good path",
  },
  {
    t: "heading-boxes",
    event: "heading-boxes",
    cartouche: true,
    headingBoxes: true,
    cue: "cartouche",
    note: "three-column heading boxes restate the doc's section titles",
  },
  {
    t: "infographic-restate",
    event: "infographic-restate",
    cartouche: true,
    infographicRestate: true,
    proseDuplicate: true,
    cue: "cartouche",
    note: "ask-for-diagram produced a section-summary infographic that duplicates adjacent prose",
  },
  {
    t: "path",
    event: "section-poster",
    cartouche: true,
    sectionPoster: true,
    headingBoxes: true,
    typeUnasked: true,
    cue: "cartouche",
    note: "section-poster — false door slams to heading columns; gold oval seals shut",
  },
  {
    t: "score",
    event: "cartouche",
    cartouche: true,
    sectionPoster: true,
    headingBoxes: true,
    infographicRestate: true,
    proseDuplicate: true,
    noIndependentInfo: true,
    regenerateSame: true,
    typeUnasked: true,
    cue: "cartouche",
    note: "cartouche — when the name-oval restates headings the booth is cartouche",
  },
]);

export const POSITIVE_CONTROL_WALK = Object.freeze([
  {
    t: "hold",
    event: "cue-diagrammed",
    diagrammed: true,
    cartouche: false,
    cue: "diagrammed",
    note: "positive control: nodes and edges inferred from the pipeline subject",
  },
  {
    t: "announce",
    event: "cue-diagrammed",
    diagrammed: true,
    cue: "diagrammed",
    note: "positive control: the relief stays diagrammed",
  },
]);

function classifyFromSeed(seed) {
  if (seed && VERDICTS.includes(seed)) return seed;
  return null;
}

export function emptyTicket() {
  return {
    seed: IDLE_WORD,
    diagrammed: true,
    cartouche: false,
    sectionPoster: false,
    cue: "diagrammed",
  };
}

export function seedDiagrammed() {
  return { ...emptyTicket() };
}

export function seedCartouche() {
  return {
    seed: SEEDED_WORD,
    diagrammed: false,
    cartouche: true,
    sectionPoster: true,
    headingBoxes: true,
    infographicRestate: true,
    proseDuplicate: true,
    noIndependentInfo: true,
    regenerateSame: true,
    typeUnasked: true,
    cue: "cartouche",
    issue: FEATURED_ISSUE,
    proof: SAMPLE_CARTOUCHE_PROOF,
  };
}

export function seedProduct() {
  return {
    seed: PRODUCT_WORD,
    preferSeed: true,
    cartouche: true,
    sectionPoster: true,
    headingBoxes: true,
    cue: "cartouche",
  };
}

export function seedSectionPoster() {
  return {
    seed: PATH_WORD,
    preferSeed: true,
    cartouche: true,
    sectionPoster: true,
    headingBoxes: true,
    event: "section-poster",
    cue: "cartouche",
  };
}

export function seedHold() {
  return {
    seed: "hold",
    preferSeed: true,
    diagrammed: true,
    cue: "diagrammed",
  };
}

export function seedHeadingBoxes() {
  return {
    seed: "heading-boxes",
    preferSeed: true,
    headingBoxes: true,
    cue: "cartouche",
  };
}

export function seedInfographicRestate() {
  return {
    seed: "infographic-restate",
    preferSeed: true,
    infographicRestate: true,
    cue: "cartouche",
  };
}

export function seedProseDuplicate() {
  return {
    seed: "prose-duplicate",
    preferSeed: true,
    proseDuplicate: true,
    cue: "cartouche",
  };
}

export function seedNoIndependentInfo() {
  return {
    seed: "no-independent-info",
    preferSeed: true,
    noIndependentInfo: true,
    cue: "cartouche",
  };
}

export function seedRegenerateSame() {
  return {
    seed: "regenerate-same",
    preferSeed: true,
    regenerateSame: true,
    cue: "cartouche",
  };
}

export function seedTypeUnasked() {
  return {
    seed: "type-unasked",
    preferSeed: true,
    typeUnasked: true,
    cue: "cartouche",
  };
}

export function seedNodal() {
  return {
    seed: "nodal",
    preferSeed: true,
    diagrammed: true,
    cue: "diagrammed",
  };
}

export function seedEdged() {
  return {
    seed: "edged",
    preferSeed: true,
    diagrammed: true,
    cue: "diagrammed",
  };
}

export function seedDataflow() {
  return {
    seed: "dataflow",
    preferSeed: true,
    diagrammed: true,
    cue: "diagrammed",
  };
}

export function seedFlowInferred() {
  return {
    seed: "flow-inferred",
    preferSeed: true,
    diagrammed: true,
    cue: "diagrammed",
  };
}

export function seedTypeMatched() {
  return {
    seed: "type-matched",
    preferSeed: true,
    diagrammed: true,
    cue: "diagrammed",
  };
}

export function normalizeBooth(raw) {
  if (!raw || typeof raw !== "object") {
    return {
      diagrammed: false,
      cartouche: false,
      sectionPoster: false,
      headingBoxes: false,
      infographicRestate: false,
      proseDuplicate: false,
      noIndependentInfo: false,
      regenerateSame: false,
      typeUnasked: false,
      cue: null,
      event: null,
      t: null,
    };
  }
  return {
    diagrammed: raw.diagrammed === true,
    cartouche: raw.cartouche === true || raw.event === "cartouche",
    sectionPoster:
      raw.sectionPoster === true || raw.event === "section-poster",
    headingBoxes:
      raw.headingBoxes === true || raw.event === "heading-boxes",
    infographicRestate:
      raw.infographicRestate === true || raw.event === "infographic-restate",
    proseDuplicate:
      raw.proseDuplicate === true || raw.event === "prose-duplicate",
    noIndependentInfo:
      raw.noIndependentInfo === true || raw.event === "no-independent-info",
    regenerateSame:
      raw.regenerateSame === true || raw.event === "regenerate-same",
    typeUnasked:
      raw.typeUnasked === true || raw.event === "type-unasked",
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
      (ticket.diagrammed != null ||
        ticket.cartouche != null ||
        ticket.sectionPoster != null ||
        ticket.headingBoxes != null ||
        ticket.infographicRestate != null ||
        ticket.proseDuplicate != null ||
        ticket.noIndependentInfo != null ||
        ticket.regenerateSame != null ||
        ticket.typeUnasked != null ||
        ticket.cue != null ||
        ticket.event ||
        ticket.proof),
  );
}

function isDiagrammed(row) {
  if (row.cartouche && row.cue !== "diagrammed") return false;
  if (row.cue === "cartouche" || row.cue === "section-poster") {
    return false;
  }
  if (
    row.sectionPoster &&
    row.headingBoxes &&
    row.cue !== "diagrammed" &&
    row.diagrammed !== true
  ) {
    return false;
  }
  if (row.diagrammed === true && row.cartouche !== true && row.cue !== "cartouche") {
    return true;
  }
  if (
    row.cue === "diagrammed" &&
    row.cartouche !== true &&
    row.sectionPoster !== true &&
    row.headingBoxes !== true &&
    row.infographicRestate !== true &&
    row.proseDuplicate !== true &&
    row.noIndependentInfo !== true &&
    row.regenerateSame !== true &&
    row.typeUnasked !== true
  ) {
    return true;
  }
  return false;
}

function isSectionPoster(row) {
  return (
    row.event === "section-poster" &&
    !isDiagrammed(row) &&
    (row.sectionPoster === true ||
      row.headingBoxes === true ||
      row.typeUnasked === true)
  );
}

function isCartoucheRow(row) {
  if (isDiagrammed(row)) return false;
  if (isSectionPoster(row) && row.cue !== "cartouche") return false;
  if (row.cue === "cartouche") return true;
  if (row.cartouche === true) return true;
  if (row.sectionPoster === true && row.headingBoxes === true) {
    return true;
  }
  if (
    row.sectionPoster === true ||
    row.headingBoxes === true ||
    row.infographicRestate === true ||
    row.proseDuplicate === true ||
    row.noIndependentInfo === true ||
    row.regenerateSame === true ||
    row.typeUnasked === true
  ) {
    return true;
  }
  return false;
}

/**
 * Score one cartouche pass against the temple relief.
 * diagrammed: nodes+edges / dataflow inferred from subject.
 * cartouche: ornamental name-oval restates headings as a poster.
 * section-poster: names that path.
 */
export function scoreGate(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const row = normalizeBooth(ticket);
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);

  let verdict = IDLE_WORD;
  if (
    isSectionPoster(row) ||
    (row.sectionPoster && ticket.preferSeed && seeded === PATH_WORD)
  ) {
    verdict = "section-poster";
  } else if (isCartoucheRow(row)) {
    verdict = "cartouche";
  } else if (isDiagrammed(row)) {
    verdict = "diagrammed";
  } else if (
    row.sectionPoster ||
    row.headingBoxes ||
    row.infographicRestate ||
    row.proseDuplicate ||
    row.noIndependentInfo ||
    row.regenerateSame ||
    row.typeUnasked
  ) {
    verdict = "cartouche";
  }

  if (seeded && (!hasBoothFields(ticket) || ticket.preferSeed === true)) {
    verdict = seeded;
  }

  const hold = HOLD.includes(verdict);
  const oval = inspectOval(row);
  const poster = inspectPoster(row);
  const type = inspectType(row);
  const prose = inspectProse(row);
  const regen = inspectRegen(row);
  return {
    verdict,
    idleWord: IDLE_WORD,
    pathWord: PATH_WORD,
    seededWord: SEEDED_WORD,
    productWord: PRODUCT_WORD,
    hold,
    alarm: !hold,
    recover: RECOVER.includes(verdict),
    diagrammed: verdict === "diagrammed" || verdict === "hold",
    cartouche: verdict === "cartouche" || verdict === SEEDED_WORD,
    sectionPoster:
      row.sectionPoster === true ||
      verdict === "section-poster" ||
      verdict === PATH_WORD,
    headingBoxes: row.headingBoxes,
    infographicRestate: row.infographicRestate,
    proseDuplicate: row.proseDuplicate,
    noIndependentInfo: row.noIndependentInfo,
    regenerateSame: row.regenerateSame,
    typeUnasked: row.typeUnasked,
    cue: hold
      ? "diagrammed"
      : row.sectionPoster || verdict === "section-poster"
        ? "section-poster"
        : "cartouche",
    event: row.event,
    t: row.t,
    phrase: hold ? "admit diagrammed" : "score cartouche",
    ovalInspect: oval,
    posterInspect: poster,
    typeInspect: type,
    proseInspect: prose,
    regenInspect: regen,
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
      : CARTOUCHE_WALK;
  const scored = rows.map((row) => ({
    ...normalizeBooth(row),
    ...scoreGate({ ...row, preferSeed: false }),
  }));
  const dead = scored.filter((row) => row.verdict === "cartouche");
  const path = scored.filter((row) => row.verdict === "section-poster");
  const diagrammed = scored.filter((row) => row.verdict === "diagrammed");
  const headline =
    scored.find((row) => row.event === "cartouche") ||
    scored.find((row) => row.event === "section-poster") ||
    scored.find((row) => row.event === "heading-boxes") ||
    dead[dead.length - 1];
  let verdict = "diagrammed";
  if (dead.length) verdict = "cartouche";
  else if (path.length && !diagrammed.length) verdict = "section-poster";
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
    cartoucheCount: dead.length,
    pathCount: path.length,
    diagrammedCount: diagrammed.length,
    headline,
    rows: scored,
    phrase: HOLD.includes(verdict) ? "admit diagrammed" : "score cartouche",
    note: headline
      ? "Ask-for-diagram on a pipeline data-flow doc produced a three-column section-summary poster instead of nodes and edges; regeneration repeated the same poster. No close cousin on diagram-type mismatch."
      : "published cartouche walk scored against diagrammed vs cartouche",
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
    seeded !== "diagrammed" &&
    seeded !== "cartouche" &&
    seeded !== "section-poster" &&
    ticket.diagrammed == null &&
    ticket.cartouche == null &&
    ticket.sectionPoster == null &&
    ticket.headingBoxes == null &&
    ticket.infographicRestate == null &&
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
    diagrammed: scored.diagrammed ?? false,
    cartouche: scored.cartouche ?? false,
    sectionPoster: scored.sectionPoster ?? false,
    headingBoxes: scored.headingBoxes ?? false,
    infographicRestate: scored.infographicRestate ?? false,
    proseDuplicate: scored.proseDuplicate ?? false,
    noIndependentInfo: scored.noIndependentInfo ?? false,
    regenerateSame: scored.regenerateSame ?? false,
    typeUnasked: scored.typeUnasked ?? false,
  };
}

export function score(input) {
  return analyze(input).verdict;
}

export function fingerprint(input) {
  const result = analyze(input);
  return [
    result.verdict,
    result.headingBoxes || result.cartouche ? "kind=section-poster" : "kind=dataflow",
    result.typeUnasked || result.cartouche ? "type=unasked" : "type=inferred",
    result.sectionPoster || result.verdict === "section-poster"
      ? "path=section-poster"
      : "path=diagrammed",
    result.cue === "diagrammed"
      ? "cue=diagrammed"
      : result.cue === "section-poster"
        ? "cue=section-poster"
        : "cue=cartouche",
  ].join("|");
}

export function handle(input) {
  const result = analyze(input);
  const booth = readBooth({
    diagrammed: result.diagrammed,
    cartouche: result.cartouche,
    sectionPoster: result.sectionPoster,
    headingBoxes: result.headingBoxes,
    infographicRestate: result.infographicRestate,
    proseDuplicate: result.proseDuplicate,
    noIndependentInfo: result.noIndependentInfo,
    regenerateSame: result.regenerateSame,
    typeUnasked: result.typeUnasked,
    proof: input && input.proof,
    log: input && input.log,
  });
  return {
    ...result,
    fingerprint: fingerprint(input),
    booth,
    oval: inspectOval({
      diagrammed: result.diagrammed,
      cartouche: result.cartouche,
      sectionPoster: result.sectionPoster,
      headingBoxes: result.headingBoxes,
    }),
    poster: inspectPoster({
      diagrammed: result.diagrammed,
      cartouche: result.cartouche,
      sectionPoster: result.sectionPoster,
      headingBoxes: result.headingBoxes,
      infographicRestate: result.infographicRestate,
    }),
    type: inspectType({
      diagrammed: result.diagrammed,
      cartouche: result.cartouche,
      typeUnasked: result.typeUnasked,
      infographicRestate: result.infographicRestate,
    }),
    prose: inspectProse({
      diagrammed: result.diagrammed,
      cartouche: result.cartouche,
      proseDuplicate: result.proseDuplicate,
      noIndependentInfo: result.noIndependentInfo,
    }),
    regen: inspectRegen({
      diagrammed: result.diagrammed,
      cartouche: result.cartouche,
      regenerateSame: result.regenerateSame,
    }),
    scope: mapScope({
      diagrammed: result.diagrammed,
      cartouche: result.cartouche,
      sectionPoster: result.sectionPoster,
      headingBoxes: result.headingBoxes,
      infographicRestate: result.infographicRestate,
      proseDuplicate: result.proseDuplicate,
      noIndependentInfo: result.noIndependentInfo,
      regenerateSame: result.regenerateSame,
      typeUnasked: result.typeUnasked,
    }),
    stations: BOOTH_STATIONS.map((row) => ({
      ...row,
      cartouche:
        result.cartouche === true ||
        result.verdict === "cartouche",
    })),
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
      ruledOut: [...RULED_OUT],
      expected: [...EXPECTED],
      distribution: DISTRIBUTION,
      stations: BOOTH_STATIONS,
      fingerprintLines: [...FINGERPRINT_LINES],
      cousins: COUSINS.map((row) => row.issue),
      backups: BACKUPS.map((row) => row.issue),
      phrase: PHRASE,
      hypothesis:
        "NON-BINDING: the model defaults to a section-summary infographic layout when asked to \"draw a diagram\" without an explicit type, instead of inferring dataflow from subject matter. Invite verify against #93772 text only. Do not claim a root cause in Claude Code source you have not seen.",
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
