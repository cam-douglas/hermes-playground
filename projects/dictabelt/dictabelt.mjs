#!/usr/bin/env node
/**
 * Dictabelt — wax-belt recorder / stenotype / belt-dictation booth.
 * A Dictabelt is a mid-century analog voice medium: a thin plastic
 * belt engraved by a live stylus while the drum turns. Metaphor:
 * desktop voice dictation streams and finalizes segments live; each
 * segment boundary can drop audio, so the belt comes off the drum as
 * isolated recognized chunks instead of one joined transcript.
 * Belt-amber / wax-cream / carbon / mic-red / steel / verdant hold.
 * Stenotype / wax-belt / gooseneck-mic aesthetic. NOT a phonograph
 * (palilalia). NOT a theatre souffleur. NOT clinical agraphia /
 * anarthria. NOT lararium / lemure. NOT binder / cancellans. NOT
 * tapestry / arras. NOT Frangible / Nameplate / Matryoshka / Dragnet.
 *
 * Educational diagnostic model for a published Claude Code Desktop
 * voice-dictation failure: desktop app v2.1.237 on macOS Darwin
 * 25.6.0 drops words throughout a recording — beginning, middle, and
 * end. Output is fragments, not a transcript. Same machine / mic /
 * sentence: ChatGPT batch dictation is essentially verbatim. Reproduces
 * in en AND de. BOTH hold and tap fail (so not only documented hold
 * warmup dropping first words). 15s silence auto-stop and 2 minute
 * maximum compound. Expected: a complete transcript accurate enough
 * to send without manual repair.
 *
 * Encoded from anthropics/claude-code#94406 issue text only.
 * Hypothesis (NON-BINDING — issue text): streaming transcription
 * finalizes segments live; each segment boundary can drop audio;
 * loss spread evenly across the take fits; ChatGPT records the full
 * utterance then batch-transcribes. Invite verify against issue text
 * only. Do NOT claim a root cause in Claude Code source you have not
 * seen. Do NOT implement a Claude Code fix. No network. No exploits.
 * No live Claude.
 *
 *   node dictabelt.mjs data/dictabelt.json
 *   echo '{"seed":"dictabelt"}' | node dictabelt.mjs
 *
 * Idle word is verbatim (HOLD: continuous speech lands as one joined
 * transcript comparable to batch dictation on the same hardware).
 * HOLD aliases: continuous, joined, seamless, fluent, batch-ok.
 * Seeded word is dictabelt (#94406 path).
 * Path word is segment-drop.
 * Product score word is dictabelt (Score dictabelt or admit verbatim.).
 *
 * NOT Anarthria/#93782 (Wispr Flow clipboard+Ctrl+V paste drop).
 * NOT Souffleur/#94031 (VoiceOver/app-switch echo loss).
 * NOT Palilalia/#94041 (/goal Stop hook re-fires stale text).
 * NOT Agraphia/#94251 (transcript JSONL omits pre-tool assistant text).
 * NOT Mondegreen/#93193 (Bash isolation false-block on substring git).
 * NOT Sostenuto / Sourdine / Aphonia / Aposiopesis (different speech
 * metaphors). Cite-only — do NOT rebuild them.
 */

/* Browser-safe: no top-level node: imports. CLI I/O is loaded only in main(). */

export const VERDICTS = Object.freeze([
  "verbatim",
  "dictabelt",
  "segment-drop",
  "hold",
  "continuous",
  "joined",
  "seamless",
  "fluent",
  "batch-ok",
  "fragment",
  "gap-spread",
  "hold-and-tap",
  "bilingual",
  "silence-autostop",
  "two-minute-cap",
  "landing",
  "has-repro",
  "cousins",
  "backups",
  "fixtures",
  "walk",
  "closed",
]);

export const IDLE_WORD = "verbatim";
export const PATH_WORD = "segment-drop";
export const SEEDED_WORD = "dictabelt";
export const PRODUCT_WORD = "dictabelt";
export const HOLD = Object.freeze(["verbatim", "hold"]);
export const HOLD_ALIASES = Object.freeze([
  "continuous",
  "joined",
  "seamless",
  "fluent",
  "batch-ok",
]);
export const RECOVER = Object.freeze(["verbatim", "hold"]);
export const ALARM = Object.freeze(
  VERDICTS.filter((name) => !HOLD.includes(name) && !HOLD_ALIASES.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FORBIDDEN_IDLE = Object.freeze([
  "quiet",
  "intact",
  "cleared",
  "armed",
  "affixed",
  "unpacked",
  "scoped",
  "enrolled",
  "equated",
  "penned",
  "sealed",
  "latched",
  "guarded",
  "draped",
  "hung",
  "screened",
  "executable",
  "bit-set",
  "+x",
  "engraved",
  "plated",
  "labeled",
  "titled",
  "descended",
  "recursed",
  "opened",
  "nested-ok",
  "walked-in",
  "fenced",
  "bounded",
  "warranted",
  "project-rooted",
  "cwd-scoped",
  "admitted",
  "scanned",
  "freshened",
  "ungloved",
  "attested",
  "reaped",
  "tenanted",
  "barred",
  "draped-open",
  "card-shown",
  "prompt-visible",
  "aisle-clear",
  "curtain-raised",
  "primed",
  "confirmed",
  "blanked",
  "lit",
  "swept",
  "gleaned",
  "rostered",
  "lararium",
  "stilled",
  "listed",
  "removable",
  "lemure",
  "cancellans",
  "arras",
  "frangible",
  "nameplate",
  "matryoshka",
  "dragnet",
  "matricula",
  "allograph",
  "agraphia",
  "anarthria",
  "souffleur",
  "palilalia",
  "mondegreen",
  "sostenuto",
  "sourdine",
  "aphonia",
  "aposiopesis",
  "gauntlet",
  "flashpan",
  "mirage",
  "deadlight",
  "glowplug",
  "relict",
  "ashpan",
  "gleaner",
  "lictor",
  "lychgate",
  "ouster",
  "proscription",
  "thimblerig",
  "fetchling",
  "rasure",
  "rasura",
  "cadastre",
  "frisket",
  "scant",
  "titulus",
  "palinode",
  "epitaph",
  "escutcheon",
  "knock",
  "oubliette",
  "eidolon",
  "quietus",
  "wraith",
  "afterimage",
  "scrim",
  "cachet",
  "veto",
  "phantom-prompt",
  "chmod-failopen",
  "header-rename",
  "subst-nest",
  "root-find",
  "orphan-tick",
  "deferred-delta",
  "reload-blind",
  "win-posix-mismatch",
  "pre-tool-omit",
  "attach-mouse",
  "picker-bypass",
  "lastRunAt",
]);

export const FORBIDDEN_SEED = Object.freeze([
  "lemure",
  "cancellans",
  "arras",
  "frangible",
  "nameplate",
  "matryoshka",
  "dragnet",
  "matricula",
  "allograph",
  "agraphia",
  "anarthria",
  "souffleur",
  "palilalia",
  "mondegreen",
  "sostenuto",
  "sourdine",
  "aphonia",
  "aposiopesis",
  "gauntlet",
  "flashpan",
  "mirage",
  "deadlight",
  "glowplug",
  "relict",
  "ashpan",
  "gleaner",
  "lictor",
  "lychgate",
  "ouster",
  "proscription",
  "thimblerig",
  "fetchling",
  "rasure",
  "rasura",
  "cadastre",
  "frisket",
  "scant",
  "titulus",
  "palinode",
  "epitaph",
  "escutcheon",
  "knock",
  "oubliette",
  "eidolon",
  "quietus",
  "phantom-prompt",
  "chmod-failopen",
  "header-rename",
  "subst-nest",
  "root-find",
  "orphan-tick",
  "deferred-delta",
  "reload-blind",
  "win-posix-mismatch",
  "pre-tool-omit",
  "attach-mouse",
  "picker-bypass",
]);

export const FEATURED_ISSUE = 94406;
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/94406";
export const TITLE =
  "Voice dictation in the desktop app drops words throughout the recording — output is fragments, not a transcript (macOS, v2.1.237)";
export const STATE = "OPEN";
export const LABELS = Object.freeze([
  "bug",
  "has repro",
  "platform:macos",
  "area:desktop",
]);
export const PLATFORM = "macos";
export const SURFACE = "segment-drop";
export const HOST =
  "Claude Code desktop app v2.1.237; macOS Darwin 25.6.0; built-in MacBook Pro microphone 48 kHz ~57% input";
export const CHECKED_ON =
  "Published report: desktop voice dictation loses speech continuously throughout a recording — beginning, middle, and end; isolated recognized chunks with connecting speech missing; same machine/mic/sentence ChatGPT dictation essentially verbatim; en and de; hold and tap both fail; 15s silence auto-stop and 2 minute maximum compound";
export const BUILD = "Claude Code desktop app v2.1.237; macOS Darwin 25.6.0";
export const SELECTED_MODEL =
  "desktop voice-dictation streaming segment-drop — fragment transcript vs batch verbatim, not a model defect";
export const OS =
  "macOS Darwin 25.6.0; platform:macos / area:desktop; built-in MacBook Pro mic 48 kHz ~57%";
export const PHRASE = "Score dictabelt or admit verbatim.";
export const DISTRIBUTION =
  "Voice dictation loses speech continuously throughout a recording — at the beginning, in the middle, and at the end. The result is not a degraded transcript, it is fragments: isolated recognized chunks with the connecting speech missing entirely. Every dictated prompt has to be rewritten by hand. Same machine, same microphone, same spoken sentence, back to back: ChatGPT's dictation transcribes it essentially verbatim. Claude Code returns fragments. Setting the dictation language to de vs en makes no difference — both produce fragments when speaking the matching language. Switching from hold mode to tap mode makes no difference, so this is not only the documented hold-mode warmup dropping the first words. A plausible cause is the streaming transcription design itself. ChatGPT records the full utterance and transcribes it as one batch; Claude Code streams and finalizes segments live. Each segment boundary is a place where audio can be dropped, and the observed symptom — loss spread evenly across the whole recording rather than concentrated at one end — fits that. The recording limits compound this — the 15s silence auto-stop and the 2 minute maximum both cut in well before a real dictated prompt is finished. Tracked separately in #74534. Expected: a dictated passage should come back as a complete transcript, accurate enough to send without manual repair — comparable to what batch dictation in other assistants delivers on the same hardware.";

export const DESKTOP_BUILD = "2.1.237";
export const MIC = "built-in MacBook Pro microphone";
export const SAMPLE_RATE = "48 kHz";
export const INPUT_LEVEL = "~57%";
export const LANGUAGES = Object.freeze(["en", "de"]);
export const MODES = Object.freeze(["hold", "tap"]);
export const SILENCE_AUTOSTOP_S = 15;
export const TWO_MINUTE_CAP_S = 120;
export const BATCH_CONTROL = "ChatGPT dictation on the same machine / mic / sentence is essentially verbatim";
export const LIMITS_ISSUE = 74534;

/**
 * Synthetic example-data — the published issue did not include a
 * spoken-vs-transcribed sample pair (reporter offered to supply one).
 * Labeled as such. Not a live dump.
 */
export const SYNTHETIC_SPOKEN =
  "Please open the project folder and summarize the last three commits without rewriting history.";
export const SYNTHETIC_FRAGMENTS = Object.freeze([
  "Please open",
  "summarize",
  "commits",
]);
export const SYNTHETIC_GAPS = Object.freeze([
  "the project folder and",
  "the last three",
  "without rewriting history",
]);

export const BELT_NAMES = Object.freeze([
  {
    id: "wax-drum",
    lost: "Wax drum — batch-ok belt should land one joined transcript",
    control: "ChatGPT on the same mic/sentence is essentially verbatim",
    story: "the drum holds when the take lands as one joined slip",
  },
  {
    id: "live-stylus",
    lost: "Live stylus — streaming finalize at each segment boundary",
    control: "A batch take would wait for the full utterance",
    story: "the stylus lifts at every live cut and drops the groove",
  },
  {
    id: "gap-groove",
    lost: "Gap groove — connecting speech missing; isolated chunks remain",
    control: "A complete transcript would be accurate enough to send",
    story: "the belt shows islands of wax with silent grooves between",
  },
  {
    id: "hold-and-tap",
    lost: "Hold and tap — both modes fail; not only hold warmup",
    control: "Tap would still join if the defect were hold warmup only",
    story: "the pedal and the tap key both cut the same gaps",
  },
  {
    id: "bilingual-belt",
    lost: "Bilingual belt — en and de both fragment on matching speech",
    control: "Language setting would change the take if it were locale",
    story: "the belt is language-blind: both tongues come back as chips",
  },
  {
    id: "silence-cap",
    lost: "Silence cap — 15s auto-stop and 2 minute maximum compound",
    control: "A real dictated prompt would finish before the caps cut",
    story: "the drum stops before the take is spoken through",
  },
]);

export const BOOTH_STATIONS = Object.freeze([
  {
    id: "wax-drum",
    survey: "batch-ok control: same mic/sentence ChatGPT is essentially verbatim",
    kind: "verbatim",
    note: "idle/control: continuous speech lands as one joined transcript",
  },
  {
    id: "live-stylus",
    survey: "streaming transcription finalizes segments live",
    kind: "dictabelt",
    note: "seeded: live stylus lifts at each segment boundary",
  },
  {
    id: "gap-groove",
    survey: "isolated recognized chunks; connecting speech missing",
    kind: "dictabelt",
    note: "seeded: fragments not a transcript",
  },
  {
    id: "hold-and-tap",
    survey: "hold and tap both fail; not only documented hold warmup",
    kind: "dictabelt",
    note: "seeded: both modes drop mid-utterance audio",
  },
  {
    id: "bilingual-belt",
    survey: "en and de both produce fragments on matching speech",
    kind: "dictabelt",
    note: "seeded: language setting does not join the take",
  },
  {
    id: "silence-cap",
    survey: "segment-drop — 15s silence auto-stop and 2m max compound",
    kind: "dictabelt",
    note: "path: segment-drop names the live-boundary audio loss",
  },
]);

export const FIELD_MARKS = Object.freeze([
  {
    id: "fragment",
    label: "fragment",
    count: "isolated chunks",
    note: "Recognized islands with connecting speech missing entirely",
  },
  {
    id: "gap-spread",
    label: "gap-spread",
    count: "begin / mid / end",
    note: "Loss spread evenly across the whole recording, not one end",
  },
  {
    id: "hold-and-tap",
    label: "hold-and-tap",
    count: "both modes",
    note: "Hold and tap both fail — not only hold-mode warmup",
  },
  {
    id: "bilingual",
    label: "bilingual",
    count: "en + de",
    note: "Language setting de vs en makes no difference",
  },
  {
    id: "silence-autostop",
    label: "silence-autostop",
    count: "15s",
    note: "Silence auto-stop cuts before a real dictated prompt finishes",
  },
  {
    id: "two-minute-cap",
    label: "two-minute-cap",
    count: "120s",
    note: "Two minute maximum also cuts before a real prompt finishes",
  },
]);

export const RULED_OUT = Object.freeze([
  "Anarthria/#93782 — Wispr Flow clipboard+Ctrl+V paste silently dropped in VS Code — paste path, not live mic streaming fragments; DIFFERENT",
  "Souffleur/#94031 — VoiceOver/app-switch echo loss after leaving wings — accessibility echo, not ASR segment gaps; DIFFERENT",
  "Palilalia/#94041 — /goal Stop hook re-fires stale text — phonograph-groove re-fire, not dictation mic; DIFFERENT",
  "Agraphia/#94251 — transcript JSONL omits pre-tool assistant text — written transcript omit, not mic; DIFFERENT",
  "Mondegreen/#93193 — Bash isolation false-block on substring git — tokenization, not speech; DIFFERENT",
  "Sostenuto — different speech metaphor; do not copy UI; DIFFERENT",
  "Sourdine — different speech metaphor; do not copy UI; DIFFERENT",
  "Aphonia — different speech metaphor; do not copy UI; DIFFERENT",
  "Aposiopesis — different speech metaphor; do not copy UI; DIFFERENT",
  "Lemure/#94410 — leftover ScheduledTasks dispatcher ticks; DIFFERENT",
  "Cancellans/#94400 — deferred-delta binder folio; DIFFERENT",
  "Arras/#94348 — phantom-prompt theater tapestry; DIFFERENT",
  "Frangible/#94362 — chmod-failopen wax-seal; DIFFERENT",
  "Nameplate/#94349 — header-rename brass plate; DIFFERENT",
  "Matryoshka/#94350 — subst-nest nesting-doll; DIFFERENT",
  "Dragnet/#94064 — root-find night blotter; DIFFERENT",
  "#74534 — 15s silence / 2m max tracked separately (compounds, not the fragment path)",
  "#80277 — comparable open issue scoped to the VS Code extension — DIFFERENT surface",
]);

export const EXPECTED = Object.freeze([
  "A dictated passage should come back as a complete transcript",
  "Accurate enough to send without manual repair",
  "Comparable to what batch dictation in other assistants delivers on the same hardware",
]);

export const FINGERPRINT_LINES = Object.freeze([
  "segment-drop",
  "dictabelt",
  "fragment",
  "gap-spread",
  "hold-and-tap",
]);

export const COUSINS = Object.freeze([
  {
    issue: 93782,
    title: "Anarthria — Wispr Flow clipboard+Ctrl+V paste silently dropped in VS Code",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — paste path, not live mic streaming fragments. Do not rebuild. Do not conflate.",
  },
  {
    issue: 94031,
    title: "Souffleur — VoiceOver/app-switch echo loss after leaving wings",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — accessibility echo, not ASR segment gaps. Do not rebuild. Do not conflate.",
  },
  {
    issue: 94041,
    title: "Palilalia — /goal Stop hook re-fires stale text",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — phonograph-groove re-fire, not dictation mic. Do not rebuild. Do not conflate.",
  },
  {
    issue: 94251,
    title: "Agraphia — transcript JSONL omits pre-tool assistant text",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — written transcript omit, not mic. Do not rebuild. Do not conflate.",
  },
  {
    issue: 93193,
    title: "Mondegreen — Bash isolation false-block on substring git",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — tokenization, not speech. Do not rebuild. Do not conflate.",
  },
]);

export const BACKUPS = Object.freeze([
  { issue: 94344, title: "backup next-focus", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94398, title: "backup next-focus", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94397, title: "backup next-focus", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94396, title: "backup next-focus", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94393, title: "backup next-focus", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94392, title: "backup next-focus", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 86198, title: "backup next-focus", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93924, title: "backup next-focus", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93770, title: "backup next-focus", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93777, title: "backup next-focus", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94151, title: "backup next-focus", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94420, title: "backup next-focus", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94417, title: "backup next-focus", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94415, title: "backup next-focus", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
]);

export const NOT_PRODUCTS = Object.freeze([
  "lemure",
  "cancellans",
  "arras",
  "frangible",
  "nameplate",
  "matryoshka",
  "dragnet",
  "matricula",
  "allograph",
  "agraphia",
  "anarthria",
  "souffleur",
  "palilalia",
  "mondegreen",
  "sostenuto",
  "sourdine",
  "aphonia",
  "aposiopesis",
  "gauntlet",
  "lictor",
  "lychgate",
  "ouster",
  "proscription",
  "frisket",
  "scant",
  "knock",
  "oubliette",
  "eidolon",
  "quietus",
  "wraith",
  "afterimage",
  "scrim",
  "cachet",
  "veto",
  "thimblerig",
  "fetchling",
  "rasure",
  "rasura",
  "cadastre",
  "titulus",
  "palinode",
  "epitaph",
  "escutcheon",
]);

export const SAMPLE_KIND_IDLE = "wax-drum";
export const SAMPLE_KIND_SEEDED = "segment-drop";
export const SAMPLE_HOLDING_IDLE = "batch-ok";
export const SAMPLE_HOLDING_SEEDED = "fragment";

export const SAMPLE_VERBATIM_PROOF = Object.freeze({
  verbatim: true,
  dictabelt: false,
  segmentDrop: false,
  fragment: false,
  gapSpread: false,
  kind: SAMPLE_KIND_IDLE,
});

export const SAMPLE_DICTABELT_PROOF = Object.freeze({
  verbatim: false,
  dictabelt: true,
  segmentDrop: true,
  fragment: true,
  gapSpread: true,
  holdAndTap: true,
  bilingual: true,
  silenceAutostop: true,
  twoMinuteCap: true,
  kind: SAMPLE_KIND_SEEDED,
  names: BELT_NAMES.map((row) => row.id),
  spoken: SYNTHETIC_SPOKEN,
  chunks: [...SYNTHETIC_FRAGMENTS],
  synthetic: true,
});

export const SAMPLE_WALK_LOG = Object.freeze([
  { t: "idle", line: "booth holds verbatim: continuous speech lands as one joined transcript comparable to batch dictation on the same hardware" },
  { t: "stream", line: "desktop voice dictation streams and finalizes segments live; each boundary can drop audio" },
  { t: "gap", line: "isolated recognized chunks; connecting speech missing; loss spread across begin / mid / end" },
  { t: "path", line: "segment-drop — hold and tap both fail; en and de both fragment; 15s silence and 2m max compound" },
  { t: "score", line: "when the belt comes off as fragments the booth is dictabelt — Score dictabelt or admit verbatim." },
]);

const FORCE_FLAGS = [
  "segmentDrop",
  "fragment",
  "gapSpread",
  "holdAndTap",
  "bilingual",
  "silenceAutostop",
  "twoMinuteCap",
];

const ISSUE_CUE_RE =
  /94406|2\.1\.237|Darwin 25\.6\.0|fragments, not a transcript|hold and tap|ChatGPT|15s silence|2 minute|segment boundary/i;

/**
 * Educational belt join. Not a Claude Code patch.
 * Encodes only the published #94406 shapes.
 * verbatim=true is the HOLD / batch-ok path.
 *
 * Verbatim/HOLD when: recognized text joins to the spoken take
 * (or is comparable to a batch control on the same hardware).
 * Dictabelt / segment-drop when: streaming finalize leaves isolated
 * chunks with connecting speech missing, loss spread across the take,
 * hold and tap both fail, en and de both fragment.
 */
export function joinBelt({
  verbatim = false,
  spoken = SYNTHETIC_SPOKEN,
  recognizedChunks = [...SYNTHETIC_FRAGMENTS],
  mode = "hold",
  language = "en",
  batchCompare = "fragments",
  silenceAutostop = false,
  twoMinuteCap = false,
} = {}) {
  const chunks = Array.isArray(recognizedChunks) ? recognizedChunks : [];
  if (verbatim === true || batchCompare === "verbatim") {
    return {
      dropped: false,
      joined: spoken,
      chunks: spoken ? [spoken] : [],
      gaps: [],
      phrase: "admit verbatim",
      synthetic: true,
    };
  }
  const joined = chunks.join(" ");
  const dropped =
    chunks.length > 1 &&
    joined !== spoken &&
    batchCompare !== "verbatim";
  return {
    dropped,
    joined,
    chunks,
    gaps: dropped ? [...SYNTHETIC_GAPS] : [],
    mode,
    language,
    silenceAutostop,
    twoMinuteCap,
    phrase: dropped ? "score dictabelt" : "admit verbatim",
    synthetic: true,
  };
}

export function scoreSegmentDrop(input = {}) {
  const verbatimHold = input.verbatim === true && input.dictabelt !== true;
  const belt = joinBelt({
    verbatim: verbatimHold,
    spoken: input.spoken || SYNTHETIC_SPOKEN,
    recognizedChunks: verbatimHold
      ? [input.spoken || SYNTHETIC_SPOKEN]
      : input.recognizedChunks || [...SYNTHETIC_FRAGMENTS],
    batchCompare: verbatimHold ? "verbatim" : input.batchCompare || "fragments",
    mode: input.mode,
    language: input.language,
    silenceAutostop: input.silenceAutostop === true,
    twoMinuteCap: input.twoMinuteCap === true,
  });
  const dictabelt =
    !verbatimHold &&
    (belt.dropped === true ||
      input.dictabelt === true ||
      input.segmentDrop === true ||
      input.fragment === true ||
      input.gapSpread === true);
  return {
    verbatim: !dictabelt,
    dictabelt,
    segmentDrop: dictabelt,
    chunks: belt.chunks,
    belt,
    phrase: dictabelt ? "score dictabelt" : "admit verbatim",
  };
}

export function mentionsIssueCue(input = {}) {
  if (input.issue === FEATURED_ISSUE || input.issue === "94406") return true;
  const blob = typeof input === "string" ? input : JSON.stringify(input);
  return ISSUE_CUE_RE.test(blob);
}

export function mapDictabelt(input = {}) {
  const dictabelt = isDictabeltInput(input);
  const verbatim = input.verbatim === true && !dictabelt;
  return {
    stamp: dictabelt ? "segment-drop" : "batch-ok",
    holdingLane: dictabelt ? "fragment" : "batch-ok",
    kindLane: dictabelt ? "segment-drop" : "wax-drum",
    bindLane: dictabelt ? "gap-spread" : "joined",
    ribbon: dictabelt ? "dictabelt" : "verbatim",
    verbatim,
  };
}

export function inspectStreaming(input = {}) {
  const streaming =
    input.fragment === true ||
    input.dictabelt === true ||
    input.segmentDrop === true ||
    isDictabeltInput(input);
  if (input.verbatim === true && !streaming) {
    return { stamp: "batch-joined", streaming: false, note: "full utterance then one join" };
  }
  return {
    stamp: streaming ? "live-stylus" : "stream-idle",
    streaming,
    note: streaming
      ? "live stylus — streaming finalize at each segment boundary"
      : "",
  };
}

export function inspectGapSpread(input = {}) {
  const spread =
    input.gapSpread === true ||
    input.dictabelt === true ||
    input.fragment === true ||
    isDictabeltInput(input);
  if (input.verbatim === true && !spread) {
    return { stamp: "groove-joined", spread: false };
  }
  return {
    stamp: spread ? "gap-spread" : "gap-idle",
    spread,
    note: spread
      ? "gap-spread — loss across beginning, middle, and end"
      : "",
  };
}

export function inspectHoldAndTap(input = {}) {
  const both =
    input.holdAndTap === true ||
    input.dictabelt === true ||
    isDictabeltInput(input);
  if (input.verbatim === true && !both) {
    return { stamp: "modes-hold", both: false };
  }
  return {
    stamp: both ? "hold-and-tap" : "modes-idle",
    both,
    note: both
      ? "hold-and-tap — both modes fail; not only hold warmup"
      : "",
  };
}

export function inspectBilingual(input = {}) {
  const both =
    input.bilingual === true ||
    input.dictabelt === true ||
    isDictabeltInput(input);
  if (input.verbatim === true && !both) {
    return { stamp: "tongue-joined", both: false };
  }
  return {
    stamp: both ? "bilingual" : "tongue-idle",
    both,
    note: both
      ? "bilingual — en and de both fragment on matching speech"
      : "",
  };
}

export function inspectSilenceCap(input = {}) {
  const cuts =
    input.silenceAutostop === true ||
    input.dictabelt === true ||
    isDictabeltInput(input);
  if (input.verbatim === true && !cuts) {
    return { stamp: "silence-holds", cuts: false };
  }
  return {
    stamp: cuts ? "silence-autostop" : "silence-idle",
    cuts,
    note: cuts
      ? "silence-autostop — 15s cut before a real dictated prompt finishes"
      : "",
  };
}

export function inspectTwoMinuteCap(input = {}) {
  const cuts =
    input.twoMinuteCap === true ||
    input.dictabelt === true ||
    isDictabeltInput(input);
  if (input.verbatim === true && !cuts) {
    return { stamp: "cap-holds", cuts: false };
  }
  return {
    stamp: cuts ? "two-minute-cap" : "cap-idle",
    cuts,
    note: cuts
      ? "two-minute-cap — 120s maximum also cuts before a real prompt finishes"
      : "",
  };
}

function beltOpen(input, id) {
  const map = {
    "wax-drum": input.dictabelt || input.segmentDrop,
    "live-stylus": input.fragment || input.dictabelt,
    "gap-groove": input.gapSpread || input.fragment,
    "hold-and-tap": input.holdAndTap,
    "bilingual-belt": input.bilingual,
    "silence-cap": input.silenceAutostop || input.twoMinuteCap || input.segmentDrop,
  };
  return (
    map[id] === true ||
    input.segmentDrop === true ||
    input.dictabelt === true
  );
}

function isDictabeltInput(input = {}) {
  return (
    input.dictabelt === true ||
    input.segmentDrop === true ||
    input.fragment === true ||
    input.gapSpread === true ||
    input.holdAndTap === true ||
    input.bilingual === true ||
    input.silenceAutostop === true ||
    input.twoMinuteCap === true
  );
}

export function readBooth(input = {}) {
  const dictabelt = isDictabeltInput(input);
  const verbatim = input.verbatim === true && !dictabelt;
  return {
    mark: dictabelt ? "dictabelt" : "verbatim",
    verbatim,
    dictabelt,
    segmentDrop: input.segmentDrop === true || dictabelt,
    fragment: input.fragment === true,
    gapSpread: input.gapSpread === true,
    holdAndTap: input.holdAndTap === true,
    bilingual: input.bilingual === true,
    silenceAutostop: input.silenceAutostop === true,
    twoMinuteCap: input.twoMinuteCap === true,
    belt: mapDictabelt(input),
    streaming: inspectStreaming(input),
    gaps: inspectGapSpread(input),
    modes: inspectHoldAndTap(input),
    tongues: inspectBilingual(input),
    silence: inspectSilenceCap(input),
    cap: inspectTwoMinuteCap(input),
    names: BELT_NAMES.filter((row) => beltOpen(input, row.id)).map(
      (row) => row.id,
    ),
    log: input.log || [],
  };
}

export const DICTABELT_WALK = Object.freeze([
  {
    t: "idle",
    event: "batch-ok",
    verbatim: true,
    dictabelt: false,
    cue: "verbatim",
    note: "idle HOLD: continuous speech lands as one joined transcript comparable to batch dictation on the same hardware",
  },
  {
    t: "stream",
    event: "segment-drop",
    dictabelt: true,
    segmentDrop: true,
    fragment: true,
    cue: "dictabelt",
    note: "desktop voice dictation streams and finalizes segments live; each boundary can drop audio",
  },
  {
    t: "gap",
    event: "fragment",
    dictabelt: true,
    fragment: true,
    gapSpread: true,
    cue: "dictabelt",
    note: "isolated recognized chunks; connecting speech missing; loss spread across begin / mid / end",
  },
  {
    t: "path",
    event: "segment-drop",
    dictabelt: true,
    segmentDrop: true,
    fragment: true,
    gapSpread: true,
    holdAndTap: true,
    bilingual: true,
    silenceAutostop: true,
    twoMinuteCap: true,
    cue: "dictabelt",
    note: "segment-drop — hold and tap both fail; en and de both fragment; 15s silence and 2m max compound",
  },
  {
    t: "score",
    event: "dictabelt",
    dictabelt: true,
    segmentDrop: true,
    fragment: true,
    gapSpread: true,
    holdAndTap: true,
    bilingual: true,
    silenceAutostop: true,
    twoMinuteCap: true,
    cue: "dictabelt",
    note: "dictabelt — the belt comes off as fragments, not a transcript",
  },
]);

export const POSITIVE_CONTROL_WALK = Object.freeze([
  {
    t: "hold",
    event: "batch-ok",
    verbatim: true,
    dictabelt: false,
    cue: "verbatim",
    note: "positive control: joined transcript comparable to batch",
  },
  {
    t: "admit",
    event: "batch-ok",
    verbatim: true,
    cue: "verbatim",
    note: "positive control: the booth admits verbatim",
  },
]);

function classifyFromSeed(seed) {
  if (seed && VERDICTS.includes(seed)) return seed;
  return null;
}

export function emptyTicket() {
  return {
    seed: IDLE_WORD,
    verbatim: true,
    dictabelt: false,
    segmentDrop: false,
    cue: "verbatim",
  };
}

export function seedVerbatim() {
  return { ...emptyTicket() };
}

export function seedDictabelt() {
  return {
    seed: SEEDED_WORD,
    verbatim: false,
    dictabelt: true,
    segmentDrop: true,
    fragment: true,
    gapSpread: true,
    holdAndTap: true,
    bilingual: true,
    silenceAutostop: true,
    twoMinuteCap: true,
    cue: "dictabelt",
    issue: FEATURED_ISSUE,
    proof: SAMPLE_DICTABELT_PROOF,
  };
}

export function seedProduct() {
  return {
    seed: PRODUCT_WORD,
    preferSeed: true,
    dictabelt: true,
    segmentDrop: true,
    cue: "dictabelt",
  };
}

export function seedSegmentDrop() {
  return {
    seed: PATH_WORD,
    preferSeed: true,
    dictabelt: true,
    segmentDrop: true,
    event: "segment-drop",
    cue: "dictabelt",
  };
}

export function seedHold() {
  return {
    seed: "hold",
    preferSeed: true,
    verbatim: true,
    cue: "verbatim",
  };
}

export function seedContinuous() {
  return { seed: "continuous", preferSeed: true, verbatim: true, cue: "verbatim" };
}

export function seedJoined() {
  return { seed: "joined", preferSeed: true, verbatim: true, cue: "verbatim" };
}

export function seedSeamless() {
  return { seed: "seamless", preferSeed: true, verbatim: true, cue: "verbatim" };
}

export function seedFluent() {
  return { seed: "fluent", preferSeed: true, verbatim: true, cue: "verbatim" };
}

export function seedBatchOk() {
  return { seed: "batch-ok", preferSeed: true, verbatim: true, cue: "verbatim" };
}

export function seedFragment() {
  return {
    seed: "fragment",
    preferSeed: true,
    fragment: true,
    cue: "dictabelt",
  };
}

export function seedGapSpread() {
  return {
    seed: "gap-spread",
    preferSeed: true,
    gapSpread: true,
    cue: "dictabelt",
  };
}

export function normalizeBooth(raw) {
  if (!raw || typeof raw !== "object") {
    return {
      verbatim: false,
      dictabelt: false,
      segmentDrop: false,
      fragment: false,
      gapSpread: false,
      holdAndTap: false,
      bilingual: false,
      silenceAutostop: false,
      twoMinuteCap: false,
      cue: null,
      event: null,
      t: null,
    };
  }
  return {
    verbatim: raw.verbatim === true,
    dictabelt: raw.dictabelt === true || raw.event === "dictabelt",
    segmentDrop:
      raw.segmentDrop === true || raw.event === "segment-drop",
    fragment:
      raw.fragment === true || raw.event === "fragment",
    gapSpread:
      raw.gapSpread === true || raw.event === "gap-spread",
    holdAndTap:
      raw.holdAndTap === true || raw.event === "hold-and-tap",
    bilingual:
      raw.bilingual === true || raw.event === "bilingual",
    silenceAutostop:
      raw.silenceAutostop === true || raw.event === "silence-autostop",
    twoMinuteCap:
      raw.twoMinuteCap === true || raw.event === "two-minute-cap",
    spoken: raw.spoken,
    recognizedChunks: raw.recognizedChunks,
    batchCompare: raw.batchCompare,
    mode: raw.mode,
    language: raw.language,
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
      (ticket.verbatim != null ||
        ticket.dictabelt != null ||
        ticket.segmentDrop != null ||
        ticket.fragment != null ||
        ticket.gapSpread != null ||
        ticket.holdAndTap != null ||
        ticket.bilingual != null ||
        ticket.silenceAutostop != null ||
        ticket.twoMinuteCap != null ||
        ticket.cue != null ||
        ticket.event ||
        ticket.proof),
  );
}

function isVerbatim(row) {
  if (row.dictabelt && row.cue !== "verbatim") return false;
  if (row.cue === "dictabelt" || row.cue === "segment-drop") return false;
  if (
    row.segmentDrop &&
    row.fragment &&
    row.cue !== "verbatim" &&
    row.verbatim !== true
  ) {
    return false;
  }
  if (
    row.verbatim === true &&
    row.dictabelt !== true &&
    row.cue !== "dictabelt"
  ) {
    return true;
  }
  if (
    row.cue === "verbatim" &&
    row.dictabelt !== true &&
    row.segmentDrop !== true &&
    FORCE_FLAGS.every((flag) => row[flag] !== true)
  ) {
    return true;
  }
  return false;
}

function isSegmentDrop(row) {
  return (
    row.event === "segment-drop" &&
    !isVerbatim(row) &&
    (row.segmentDrop === true ||
      row.fragment === true ||
      row.dictabelt === true)
  );
}

function isDictabeltRow(row) {
  if (isVerbatim(row)) return false;
  if (isSegmentDrop(row) && row.cue !== "dictabelt") return false;
  if (row.cue === "dictabelt") return true;
  if (row.dictabelt === true) return true;
  if (row.segmentDrop === true && row.fragment === true) return true;
  if (
    row.segmentDrop === true ||
    row.fragment === true ||
    row.gapSpread === true ||
    row.holdAndTap === true ||
    row.bilingual === true ||
    row.silenceAutostop === true ||
    row.twoMinuteCap === true
  ) {
    return true;
  }
  return false;
}

/**
 * Score one dictabelt pass against the wax belt.
 * verbatim: continuous speech lands as one joined transcript.
 * dictabelt: streaming finalize drops mid-utterance audio into fragments.
 * segment-drop: names that path.
 */
export function scoreGate(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const row = normalizeBooth(ticket);
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);

  let verdict = IDLE_WORD;
  if (
    isSegmentDrop(row) ||
    (row.segmentDrop && ticket.preferSeed && seeded === PATH_WORD)
  ) {
    verdict = "segment-drop";
  } else if (isDictabeltRow(row)) {
    verdict = "dictabelt";
  } else if (isVerbatim(row)) {
    verdict = "verbatim";
  } else if (
    row.segmentDrop ||
    row.fragment ||
    row.gapSpread ||
    row.holdAndTap ||
    row.bilingual ||
    row.silenceAutostop ||
    row.twoMinuteCap
  ) {
    verdict = "dictabelt";
  } else if (mentionsIssueCue(ticket) && !seeded) {
    verdict = "dictabelt";
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
    verbatim: verdict === "verbatim" || verdict === "hold",
    dictabelt: verdict === "dictabelt" || verdict === SEEDED_WORD,
    segmentDrop:
      row.segmentDrop === true ||
      verdict === "segment-drop" ||
      verdict === PATH_WORD,
    fragment: row.fragment,
    gapSpread: row.gapSpread,
    holdAndTap: row.holdAndTap,
    bilingual: row.bilingual,
    silenceAutostop: row.silenceAutostop,
    twoMinuteCap: row.twoMinuteCap,
    cue: hold
      ? "verbatim"
      : row.segmentDrop || verdict === "segment-drop"
        ? "segment-drop"
        : "dictabelt",
    event: row.event,
    t: row.t,
    phrase: hold ? "admit verbatim" : "score dictabelt",
    streamingInspect: inspectStreaming(row),
    gapInspect: inspectGapSpread(row),
    modeInspect: inspectHoldAndTap(row),
    tongueInspect: inspectBilingual(row),
    silenceInspect: inspectSilenceCap(row),
    capInspect: inspectTwoMinuteCap(row),
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
      : DICTABELT_WALK;
  const scored = rows.map((row) => ({
    ...normalizeBooth(row),
    ...scoreGate({ ...row, preferSeed: false }),
  }));
  const charged = scored.filter((row) => row.verdict === "dictabelt");
  const path = scored.filter((row) => row.verdict === "segment-drop");
  const verbatim = scored.filter((row) => row.verdict === "verbatim");
  const headline =
    scored.find((row) => row.event === "dictabelt") ||
    scored.find((row) => row.event === "segment-drop") ||
    scored.find((row) => row.event === "fragment") ||
    charged[charged.length - 1];
  let verdict = "verbatim";
  if (charged.length) verdict = "dictabelt";
  else if (path.length && !verbatim.length) {
    verdict = "segment-drop";
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
    dictabeltCount: charged.length,
    pathCount: path.length,
    verbatimCount: verbatim.length,
    headline,
    rows: scored,
    phrase: HOLD.includes(verdict) ? "admit verbatim" : "score dictabelt",
    note: headline
      ? "Desktop voice dictation (v2.1.237, macOS) drops words throughout the recording — output is fragments not a transcript. Same mic/sentence ChatGPT batch is essentially verbatim. en and de. Hold and tap both fail. Loss spread across the whole take. 15s silence auto-stop and 2m max compound. Cite-only cousins #93782 #94031 #94041 #94251 #93193."
      : "published dictabelt walk scored against verbatim vs dictabelt",
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
    seeded !== "verbatim" &&
    seeded !== "dictabelt" &&
    seeded !== "segment-drop" &&
    ticket.verbatim == null &&
    ticket.dictabelt == null &&
    ticket.segmentDrop == null &&
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
    verbatim: scored.verbatim ?? false,
    dictabelt: scored.dictabelt ?? false,
    segmentDrop: scored.segmentDrop ?? false,
    fragment: scored.fragment ?? false,
    gapSpread: scored.gapSpread ?? false,
    holdAndTap: scored.holdAndTap ?? false,
    bilingual: scored.bilingual ?? false,
    silenceAutostop: scored.silenceAutostop ?? false,
    twoMinuteCap: scored.twoMinuteCap ?? false,
  };
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
    result.segmentDrop || result.dictabelt
      ? "kind=segment-drop"
      : "kind=wax-drum",
    result.fragment || result.dictabelt
      ? "ref=fragment"
      : "ref=batch-ok",
    result.segmentDrop || result.verdict === "segment-drop"
      ? "path=segment-drop"
      : "path=verbatim",
    result.cue === "verbatim"
      ? "cue=verbatim"
      : result.cue === "segment-drop"
        ? "cue=segment-drop"
        : "cue=dictabelt",
  ].join("|");
}

export function handle(input) {
  const result = analyze(input);
  const booth = readBooth({
    verbatim: result.verbatim,
    dictabelt: result.dictabelt,
    segmentDrop: result.segmentDrop,
    fragment: result.fragment,
    gapSpread: result.gapSpread,
    holdAndTap: result.holdAndTap,
    bilingual: result.bilingual,
    silenceAutostop: result.silenceAutostop,
    twoMinuteCap: result.twoMinuteCap,
    proof: input && input.proof,
    log: input && input.log,
  });
  return {
    ...result,
    fingerprint: fingerprint(input),
    booth,
    streaming: inspectStreaming({
      verbatim: result.verbatim,
      dictabelt: result.dictabelt,
      fragment: result.fragment,
    }),
    gaps: inspectGapSpread({
      verbatim: result.verbatim,
      dictabelt: result.dictabelt,
      gapSpread: result.gapSpread,
    }),
    modes: inspectHoldAndTap({
      verbatim: result.verbatim,
      dictabelt: result.dictabelt,
      holdAndTap: result.holdAndTap,
    }),
    tongues: inspectBilingual({
      verbatim: result.verbatim,
      dictabelt: result.dictabelt,
      bilingual: result.bilingual,
    }),
    silence: inspectSilenceCap({
      verbatim: result.verbatim,
      dictabelt: result.dictabelt,
      silenceAutostop: result.silenceAutostop,
    }),
    cap: inspectTwoMinuteCap({
      verbatim: result.verbatim,
      dictabelt: result.dictabelt,
      twoMinuteCap: result.twoMinuteCap,
    }),
    belt: mapDictabelt({
      verbatim: result.verbatim,
      dictabelt: result.dictabelt,
      segmentDrop: result.segmentDrop,
      fragment: result.fragment,
      gapSpread: result.gapSpread,
    }),
    stations: BOOTH_STATIONS.map((row) => ({
      ...row,
      dictabelt: result.dictabelt === true || result.verdict === "dictabelt",
    })),
    dropPath: scoreSegmentDrop({
      verbatim: result.verbatim === true && !result.dictabelt,
      dictabelt: result.dictabelt,
      segmentDrop: result.segmentDrop,
      fragment: result.fragment,
      gapSpread: result.gapSpread,
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
      names: BELT_NAMES,
      ruledOut: [...RULED_OUT],
      expected: [...EXPECTED],
      distribution: DISTRIBUTION,
      stations: BOOTH_STATIONS,
      fingerprintLines: [...FINGERPRINT_LINES],
      cousins: COUSINS.map((row) => row.issue),
      backups: BACKUPS.map((row) => row.issue),
      phrase: PHRASE,
      hypothesis:
        "NON-BINDING (issue text): streaming transcription finalizes segments live; each segment boundary can drop audio; loss spread evenly across the take fits; ChatGPT records the full utterance then batch-transcribes. Invite verify against #94406 text only. Do not claim a root cause in Claude Code source you have not seen.",
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
