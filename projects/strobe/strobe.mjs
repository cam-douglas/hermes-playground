#!/usr/bin/env node
/**
 * Strobe — aviation / photography strobe-beacon booth.
 *
 * Educational diagnostic model for a published Claude Code defect:
 * ScheduleWakeup's own tool description says it's for "/loop dynamic
 * mode" and "you don't call it directly", but it is the only
 * wakeup/scheduling primitive Claude Code exposes. Skills that
 * instruct a bounded idle wait (e.g. Superpowers'
 * subagent-driven-development) drive sessions to call it off-label
 * because there is no alternative bounded-wait primitive for
 * non-/loop sessions (/goal is condition-driven, not wait-and-resume).
 *
 *   node strobe.mjs data/strobing.json
 *   echo '{"seed":"strobing"}' | node strobe.mjs
 *
 * Idle word is steady (HOLD: no /loop; ScheduleWakeup not called
 * off-label; full skills list; no false loop banner).
 * Seeded word is strobing (#93468: off-label ScheduleWakeup paints
 * loop UI + may redeliver prompt).
 * Path word is off-label.
 * Product score word is strobe (score strobe or admit steady).
 *
 * Encoded from anthropics/claude-code#93468 issue body only.
 * Hypothesis (NON-BINDING): Off-label ScheduleWakeup may flip session
 * loop-mode flags / wakeup UI path even when /loop was never entered,
 * truncating skill injection and sometimes replaying the wakeup
 * prompt. Verify against #93468 text only. Do NOT claim a root cause
 * in Claude Code source you have not seen. Do NOT implement a fix.
 * No network. No exploits. No live Claude. No secrets.
 */

/* Browser-safe: no top-level node: imports. CLI I/O is loaded only in main(). */

export const VERDICTS = Object.freeze([
  "steady",
  "strobing",
  "strobe",
  "off-label",
  "hold",
  "schedule-wakeup",
  "never-loop",
  "loop-banner",
  "skills-truncated",
  "prompt-redeliver",
  "interactive",
  "tmux",
  "subagent-driven",
  "noop-88205",
  "changelog-257",
  "goal-condition",
  "has-repro",
  "cousins",
  "backups",
  "fixtures",
  "chips",
  "fingerprints",
  "walk",
]);

export const IDLE_WORD = "steady";
export const PATH_WORD = "off-label";
export const SEEDED_WORD = "strobing";
export const PRODUCT_WORD = "strobe";
export const HOLD = Object.freeze(["steady", "hold"]);
export const RECOVER = Object.freeze(["steady", "hold"]);
export const ALARM = Object.freeze(
  VERDICTS.filter((name) => !HOLD.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FORBIDDEN_IDLE = Object.freeze([
  "matched",
  "skewed",
  "headers-hash",
  "counterfoil",
  "traced",
  "pathless",
  "image-cache",
  "lucida",
  "scrubbed",
  "contaminated",
  "fomite",
  "gitignore",
  "damped",
  "spinning",
  "mux",
  "snubber",
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
  "cleared",
  "grafted",
  "copy-forward",
  "graft",
  "slipped",
  "sprung",
  "springe",
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
    (name) => name !== "strobing" && name !== "strobe",
  ),
);

export const FEATURED_ISSUE = 93468;
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/93468";
export const TITLE =
  "ScheduleWakeup off-label use outside /loop (per skill guidance) causes spurious loop-mode UI and prompt redelivery";
export const STATE = "OPEN";
export const LABELS = Object.freeze(["bug", "has repro", "area:core"]);
export const AUTHOR = "lanej";
export const FILED = "2026-09-10T20:35:57Z";
export const CLAUDE_CODE_VERSION = "2.1.267";
export const CHANGELOG_FIX = "2.1.257";
export const RELATED_NOOP = 88205;
export const SESSION_KIND = "interactive";
export const TERMINAL = "tmux";
export const SKILL = "subagent-driven-development";
export const SKILL_WAIT =
  "wait in bounded stretches (five to ten minutes, where your platform allows)";
export const BANNER = "Claude resuming /loop wakeup (...)";
export const SKILLS_WAKEUP = "1 skill available";
export const PROMPT =
  "check whether Task N's implementer has reported";
export const TOOL_SCOPE = "/loop dynamic mode";
export const TOOL_DIRECT = "you don't call it directly";
export const GOAL_NOTE = "condition-driven, not wait-and-resume";
export const ASK =
  "either make ScheduleWakeup safe/rejected-cleanly outside /loop, or document a supported bounded-wait primitive for non-loop sessions";
export const PHRASE =
  "when ScheduleWakeup is used off-label outside /loop and paints spurious loop-mode UI plus prompt redelivery, score strobe or admit steady.";

export const BENCH_STATIONS = Object.freeze([
  {
    id: "rail",
    survey: "walk the hangar beacon rail",
    kind: "loop",
    note: "session never invoked /loop; rail lamps should stay steady",
  },
  {
    id: "capacitor",
    survey: "charge the flash capacitor",
    kind: "wakeup",
    note: "ScheduleWakeup is the only wakeup/scheduling primitive exposed",
  },
  {
    id: "beacon",
    survey: "watch the false-positive strobe",
    kind: "banner",
    note: 'CLI banner "Claude resuming /loop wakeup (...)" despite never /loop',
  },
  {
    id: "lamps",
    survey: "audit the skills lamps",
    kind: "skills",
    note: 'available-skills list truncated to "1 skill available" on wakeup',
  },
]);

export const FINGERPRINT_LINES = Object.freeze([
  "schedule-wakeup",
  "never-loop",
  "loop-banner",
  "skills-truncated",
  "prompt-redeliver",
  "interactive",
  "subagent-driven",
  "noop-88205",
]);

export const COUSINS = Object.freeze([
  {
    issue: 88205,
    title:
      "ScheduleWakeup rejects noop:true calls made outside /loop with \"prompt is required when stop is not true\"",
    state: "OPEN",
    citeOnly: true,
    why: "Cite-only cousin — same off-label root cause, hard rejection vs silent side effects; do not rebuild",
  },
  {
    issue: 82634,
    title:
      "Text streamed in the same response as ScheduleWakeup is destroyed — absent from the session jsonl, not just hidden",
    state: "OPEN",
    citeOnly: true,
    why: "Cite-only cousin — nearby ScheduleWakeup transcript loss; do not rebuild",
  },
  {
    issue: 86245,
    title:
      "[BUG] ScheduleWakeup has no fallback when tengu_kairos_loop_dynamic is off — self-pacing unreachable for all non-first-party deployments, and non-/loop callers fail opaquely",
    state: "OPEN",
    citeOnly: true,
    why: "Cite-only cousin — nearby ScheduleWakeup gate / non-/loop callers; do not rebuild",
  },
  {
    issue: 74569,
    title:
      "[BUG] Queued ScheduleWakeup silently dropped when a background Agent completion (or macOS sleep/wake) re-enters the session",
    state: "OPEN",
    citeOnly: true,
    why: "Cite-only cousin — nearby queued wakeup drop; do not rebuild",
  },
  {
    issue: 82633,
    title:
      "ScheduleWakeup reports a scheduled time outside /loop, then never fires",
    state: "OPEN",
    citeOnly: true,
    why: "Cite-only cousin — nearby off-label ScheduleWakeup confirmation that never fires; do not rebuild",
  },
  {
    issue: 77235,
    title: "/clear does not cancel pending ScheduleWakeup (dynamic /loop) wakeups",
    state: "OPEN",
    citeOnly: true,
    why: "Cite-only cousin — nearby wakeup cancel; do not rebuild",
  },
  {
    issue: 93114,
    title:
      "ScheduleWakeup / self-paced loop never fires - the session only wakes when the user types",
    state: "OPEN",
    citeOnly: true,
    why: "Cite-only cousin — nearby wakeup never-fires; do not rebuild",
  },
]);

export const BACKUPS = Object.freeze([
  {
    issue: 93458,
    title: "SessionStart hook additionalContext silently dropped when source=fork",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
  {
    issue: 93439,
    title:
      "Read tool never triggers PreToolUse hooks for binary files (Desktop App, \"Code\" tab)",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
  {
    issue: 93475,
    title:
      "[BUG] Effort selector (Alt+P / plan mode) requires very tall terminal to display; unusable at standard terminal heights",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
  {
    issue: 93438,
    title:
      '[Bug] Agent dispatch with isolation:"worktree" causes cwd state bleed into parent session',
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
  {
    issue: 93466,
    title:
      "[BUG] Desktop Directory → Plugins: duplicate cards, cards shown under the wrong marketplace, and no working uninstall",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not auto-pick as this ship",
  },
]);

export const NOT_PRODUCTS = Object.freeze([
  "counterfoil",
  "lucida",
  "fomite",
  "snubber",
  "fosse",
  "hibernacle",
  "scapegoat",
  "cartulary",
  "paraph",
  "flashpan",
  "mirage",
  "glowplug",
  "deadlight",
  "ukase",
  "almanac",
  "stroboscope",
  "appanage",
  "pontoon",
  "concordat",
  "revenant",
  "graft",
  "springe",
  "afterimage",
  "diplopia",
  "diopter",
  "ward",
  "latchkey",
  "bitting",
  "escutcheon",
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
  "clepsydra",
  "deadair",
  "scuttle",
  "stopcock",
  "parergon",
  "stereotype",
  "midden",
  "guillotine",
  "vernier",
  "scion",
  "drift-radar",
  "reorder-radar",
]);

export function inspectLoop(input = {}) {
  const invoked =
    input.loopInvoked === true ||
    input.invokedLoop === true ||
    input.loop === true;
  const never =
    input.neverLoop === true ||
    input.loopInvoked === false ||
    (!invoked && input.steady !== false);
  const steady =
    input.steady === true ||
    (never &&
      input.scheduleWakeup !== true &&
      input.offLabel !== true &&
      input.loopBanner !== true);
  return {
    invoked: invoked && input.steady !== true,
    never: never && !invoked,
    stamp: invoked && input.steady !== true ? "strobing" : "steady",
    note: invoked
      ? "invoked /loop"
      : "never /loop — rail should stay steady",
  };
}

export function inspectWakeup(input = {}) {
  const called =
    input.scheduleWakeup === true ||
    input.offLabel === true ||
    input.wakeupOffLabel === true;
  const offLabel =
    called &&
    input.loopInvoked !== true &&
    input.steady !== true;
  return {
    called: called && input.steady !== true,
    offLabel: offLabel,
    stamp: offLabel ? "strobing" : "steady",
    note: offLabel
      ? "ScheduleWakeup called off-label outside /loop"
      : "ScheduleWakeup not called off-label",
  };
}

export function inspectBanner(input = {}) {
  const painted =
    input.loopBanner === true ||
    input.falseLoop === true ||
    (input.scheduleWakeup === true &&
      input.neverLoop === true &&
      input.steady !== true);
  return {
    painted: painted && input.steady !== true,
    text: painted && input.steady !== true ? BANNER : null,
    stamp: painted && input.steady !== true ? "strobing" : "steady",
  };
}

export function inspectSkills(input = {}) {
  const truncated =
    input.skillsTruncated === true ||
    input.oneSkill === true ||
    input.skillsCount === 1;
  return {
    truncated: truncated && input.steady !== true,
    count: truncated && input.steady !== true ? 1 : null,
    text: truncated && input.steady !== true ? SKILLS_WAKEUP : "full list",
    stamp: truncated && input.steady !== true ? "strobing" : "steady",
  };
}

export function inspectPrompt(input = {}) {
  const redelivered =
    input.promptRedelivered === true ||
    input.promptReplay === true ||
    input.redeliver === true;
  return {
    redelivered: redelivered && input.steady !== true,
    text: redelivered && input.steady !== true ? PROMPT : null,
    stamp: redelivered && input.steady !== true ? "strobing" : "steady",
  };
}

export function readRail(input = {}) {
  const loop = inspectLoop(input);
  const wakeup = inspectWakeup(input);
  const banner = inspectBanner(input);
  const skills = inspectSkills(input);
  const prompt = inspectPrompt(input);
  const strobing =
    loop.stamp === "strobing" ||
    wakeup.stamp === "strobing" ||
    banner.stamp === "strobing" ||
    skills.stamp === "strobing" ||
    prompt.stamp === "strobing" ||
    input.strobing === true;
  const steady =
    input.steady === true &&
    strobing !== true &&
    loop.stamp === "steady";
  return {
    loop,
    wakeup,
    banner,
    skills,
    prompt,
    stations: BENCH_STATIONS,
    strobing: strobing && !steady,
    steady:
      steady ||
      (loop.stamp === "steady" &&
        wakeup.stamp === "steady" &&
        banner.stamp === "steady" &&
        skills.stamp === "steady" &&
        prompt.stamp === "steady" &&
        input.strobing !== true),
    mark: strobing && !steady ? "strobing" : "steady",
  };
}

/**
 * Published strobe walk from #93468 only. Facts from the issue body.
 * A steady booth never invoked /loop, did not call ScheduleWakeup
 * off-label, kept the full skills list, and painted no false loop
 * banner. A strobing booth called ScheduleWakeup off-label while
 * waiting on a dispatched background implementer.
 */
export const STROBE_WALK = Object.freeze([
  {
    t: "idle",
    event: "cue-steady",
    steady: true,
    neverLoop: true,
    loopInvoked: false,
    scheduleWakeup: false,
    offLabel: false,
    loopBanner: false,
    skillsTruncated: false,
    promptRedelivered: false,
    interactive: true,
    cue: "steady",
    note: "idle HOLD: no /loop; ScheduleWakeup not called off-label; full skills list; no false loop banner",
  },
  {
    t: "skill",
    event: "bounded-wait",
    skill: SKILL,
    skillWait: SKILL_WAIT,
    neverLoop: true,
    steady: true,
    cue: "steady",
    note: "Superpowers subagent-driven-development instructs wait in bounded stretches",
  },
  {
    t: "dispatch",
    event: "implementer-wait",
    implementer: true,
    interactive: true,
    tmux: true,
    neverLoop: true,
    steady: true,
    cue: "steady",
    note: "interactive tmux session waiting on a dispatched background implementer subagent",
  },
  {
    t: "call",
    event: "schedule-wakeup-off-label",
    scheduleWakeup: true,
    offLabel: true,
    neverLoop: true,
    loopInvoked: false,
    strobing: true,
    cue: "strobing",
    note: "ScheduleWakeup called off-label — only wakeup/scheduling primitive; tool says you don't call it directly",
  },
  {
    t: "wakeup",
    event: "loop-banner",
    scheduleWakeup: true,
    offLabel: true,
    neverLoop: true,
    loopBanner: true,
    banner: BANNER,
    strobing: true,
    cue: "strobing",
    note: 'CLI banner "Claude resuming /loop wakeup (...)" on wakeup despite /loop never invoked',
  },
  {
    t: "skills",
    event: "skills-truncated",
    scheduleWakeup: true,
    offLabel: true,
    neverLoop: true,
    skillsTruncated: true,
    oneSkill: true,
    skillsCount: 1,
    strobing: true,
    cue: "strobing",
    note: 'available-skills list truncated to "1 skill available" on wakeup vs full list normally',
  },
  {
    t: "prompt",
    event: "prompt-redeliver",
    scheduleWakeup: true,
    offLabel: true,
    neverLoop: true,
    promptRedelivered: true,
    prompt: PROMPT,
    strobing: true,
    cue: "strobing",
    note: "identical prior prompt redelivered as if a new user message — risks double-processing a status check mid-plan",
  },
  {
    t: "flash",
    event: "strobing",
    steady: false,
    strobing: true,
    scheduleWakeup: true,
    offLabel: true,
    neverLoop: true,
    loopBanner: true,
    skillsTruncated: true,
    promptRedelivered: true,
    interactive: true,
    tmux: true,
    cue: "strobing",
    note: "#93468: off-label ScheduleWakeup paints loop UI + may redeliver prompt",
  },
  {
    t: "path",
    event: "off-label",
    strobing: true,
    offLabel: true,
    scheduleWakeup: true,
    neverLoop: true,
    cue: "strobing",
    note: "off-label — ScheduleWakeup used outside /loop because no bounded-wait primitive exists",
  },
  {
    t: "score",
    event: "strobe",
    strobing: true,
    offLabel: true,
    cue: "strobing",
    note: "strobe — score the hangar beacon that flashed a false /loop when the capacitor discharged off-label",
  },
]);

function classifyFromSeed(seed) {
  if (seed && VERDICTS.includes(seed)) return seed;
  return null;
}

export function emptyTicket() {
  return {
    seed: IDLE_WORD,
    steady: true,
    neverLoop: true,
    loopInvoked: false,
    scheduleWakeup: false,
    offLabel: false,
    loopBanner: false,
    skillsTruncated: false,
    promptRedelivered: false,
    cue: "steady",
  };
}

export function seedSteady() {
  return { ...emptyTicket() };
}

export function seedStrobing() {
  return {
    seed: SEEDED_WORD,
    steady: false,
    strobing: true,
    scheduleWakeup: true,
    offLabel: true,
    neverLoop: true,
    loopInvoked: false,
    loopBanner: true,
    skillsTruncated: true,
    oneSkill: true,
    skillsCount: 1,
    promptRedelivered: true,
    interactive: true,
    tmux: true,
    banner: BANNER,
    prompt: PROMPT,
    cue: "strobing",
    issue: FEATURED_ISSUE,
  };
}

export function seedStrobe() {
  return {
    seed: PRODUCT_WORD,
    preferSeed: true,
    strobing: true,
    offLabel: true,
    cue: "strobing",
  };
}

export function seedOffLabel() {
  return {
    seed: PATH_WORD,
    preferSeed: true,
    strobing: true,
    offLabel: true,
    scheduleWakeup: true,
    neverLoop: true,
    cue: "strobing",
  };
}

export function seedHold() {
  return {
    seed: "hold",
    preferSeed: true,
    steady: true,
    cue: "steady",
  };
}

export function seedScheduleWakeup() {
  return {
    seed: "schedule-wakeup",
    preferSeed: true,
    scheduleWakeup: true,
    cue: "strobing",
  };
}

export function seedNeverLoop() {
  return {
    seed: "never-loop",
    preferSeed: true,
    neverLoop: true,
    cue: "strobing",
  };
}

export function seedLoopBanner() {
  return {
    seed: "loop-banner",
    preferSeed: true,
    loopBanner: true,
    cue: "strobing",
  };
}

export function seedSkillsTruncated() {
  return {
    seed: "skills-truncated",
    preferSeed: true,
    skillsTruncated: true,
    cue: "strobing",
  };
}

export function seedPromptRedeliver() {
  return {
    seed: "prompt-redeliver",
    preferSeed: true,
    promptRedelivered: true,
    cue: "strobing",
  };
}

export function seedInteractive() {
  return {
    seed: "interactive",
    preferSeed: true,
    interactive: true,
    cue: "strobing",
  };
}

export function seedTmux() {
  return {
    seed: "tmux",
    preferSeed: true,
    tmux: true,
    cue: "strobing",
  };
}

export function seedSubagentDriven() {
  return {
    seed: "subagent-driven",
    preferSeed: true,
    skill: SKILL,
    cue: "strobing",
  };
}

export function seedNoop88205() {
  return {
    seed: "noop-88205",
    preferSeed: true,
    noop: true,
    cue: "strobing",
  };
}

export function seedChangelog257() {
  return {
    seed: "changelog-257",
    preferSeed: true,
    changelog: true,
    cue: "strobing",
  };
}

export function seedGoalCondition() {
  return {
    seed: "goal-condition",
    preferSeed: true,
    goal: true,
    cue: "strobing",
  };
}

export function normalizeBooth(raw) {
  if (!raw || typeof raw !== "object") {
    return {
      steady: false,
      strobing: false,
      offLabel: false,
      scheduleWakeup: false,
      neverLoop: false,
      loopInvoked: false,
      loopBanner: false,
      skillsTruncated: false,
      oneSkill: false,
      skillsCount: null,
      promptRedelivered: false,
      interactive: false,
      tmux: false,
      implementer: false,
      noop: false,
      changelog: false,
      goal: false,
      banner: null,
      prompt: null,
      skill: null,
      cue: null,
      event: null,
      t: null,
    };
  }
  return {
    steady: raw.steady === true,
    strobing: raw.strobing === true,
    offLabel:
      raw.offLabel === true ||
      raw.wakeupOffLabel === true ||
      raw.event === "off-label",
    scheduleWakeup: raw.scheduleWakeup === true,
    neverLoop: raw.neverLoop === true || raw.loopInvoked === false,
    loopInvoked: raw.loopInvoked === true,
    loopBanner: raw.loopBanner === true || raw.falseLoop === true,
    skillsTruncated:
      raw.skillsTruncated === true ||
      raw.oneSkill === true ||
      raw.skillsCount === 1,
    oneSkill: raw.oneSkill === true,
    skillsCount: raw.skillsCount == null ? null : raw.skillsCount,
    promptRedelivered:
      raw.promptRedelivered === true ||
      raw.promptReplay === true ||
      raw.redeliver === true,
    interactive: raw.interactive === true,
    tmux: raw.tmux === true,
    implementer: raw.implementer === true,
    noop: raw.noop === true,
    changelog: raw.changelog === true,
    goal: raw.goal === true,
    banner: raw.banner == null ? null : raw.banner,
    prompt: raw.prompt == null ? null : raw.prompt,
    skill: raw.skill == null ? null : raw.skill,
    cue: raw.cue || null,
    event: raw.event || raw.kind || null,
    t: raw.t || raw.time || null,
  };
}

function hasBoothFields(ticket) {
  return Boolean(
    ticket &&
      (ticket.steady != null ||
        ticket.strobing != null ||
        ticket.offLabel != null ||
        ticket.scheduleWakeup != null ||
        ticket.neverLoop != null ||
        ticket.loopInvoked != null ||
        ticket.loopBanner != null ||
        ticket.skillsTruncated != null ||
        ticket.promptRedelivered != null ||
        ticket.cue != null ||
        ticket.event),
  );
}

function isSteady(row) {
  if (row.strobing && row.cue !== "steady") return false;
  if (
    row.cue === "strobing" ||
    row.cue === "strobe" ||
    row.cue === "off-label"
  ) {
    return false;
  }
  if (row.offLabel && row.cue !== "steady") return false;
  if (row.loopBanner && row.cue !== "steady") return false;
  if (row.skillsTruncated && row.cue !== "steady") return false;
  if (row.promptRedelivered && row.cue !== "steady") return false;
  if (
    row.steady === true &&
    row.strobing !== true &&
    row.cue !== "strobing"
  ) {
    return true;
  }
  if (
    row.cue === "steady" &&
    row.strobing !== true &&
    row.offLabel !== true &&
    row.loopBanner !== true &&
    row.skillsTruncated !== true &&
    row.promptRedelivered !== true
  ) {
    return true;
  }
  if (
    row.neverLoop === true &&
    row.scheduleWakeup !== true &&
    row.offLabel !== true &&
    row.strobing !== true &&
    row.loopBanner !== true
  ) {
    return true;
  }
  return false;
}

function isStrobing(row) {
  if (isSteady(row)) return false;
  if (row.cue === "strobing" || row.cue === "strobe") return true;
  if (row.strobing === true) return true;
  if (
    row.offLabel === true ||
    row.loopBanner === true ||
    row.skillsTruncated === true ||
    row.promptRedelivered === true ||
    (row.scheduleWakeup === true && row.neverLoop === true)
  ) {
    return true;
  }
  if (
    row.scheduleWakeup &&
    row.loopInvoked !== true &&
    (row.loopBanner || row.skillsTruncated || row.promptRedelivered)
  ) {
    return true;
  }
  return false;
}

function isOffLabelPath(row) {
  return (
    row.event === "off-label" &&
    !isSteady(row) &&
    (row.strobing === true ||
      row.offLabel === true ||
      row.scheduleWakeup === true)
  );
}

/**
 * Score one hangar-rail pass against the strobe booth.
 * steady: no /loop; ScheduleWakeup not called off-label; full skills; no false banner.
 * strobing: off-label ScheduleWakeup paints loop UI + may redeliver prompt.
 * off-label: named path — ScheduleWakeup used outside /loop.
 */
export function scoreGate(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const row = normalizeBooth(ticket);
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);

  let verdict = IDLE_WORD;
  if (
    isOffLabelPath(row) ||
    (row.offLabel && ticket.preferSeed && seeded === PATH_WORD)
  ) {
    verdict = "off-label";
  } else if (isStrobing(row)) {
    verdict = "strobing";
  } else if (isSteady(row)) {
    verdict = "steady";
  } else if (
    row.offLabel ||
    row.loopBanner ||
    row.skillsTruncated ||
    row.promptRedelivered ||
    row.scheduleWakeup
  ) {
    verdict = "strobing";
  }

  if (seeded && (!hasBoothFields(ticket) || ticket.preferSeed === true)) {
    verdict = seeded;
  }

  const hold = HOLD.includes(verdict);
  const loop = inspectLoop(row);
  const wakeup = inspectWakeup(row);
  const banner = inspectBanner(row);
  const skills = inspectSkills(row);
  const prompt = inspectPrompt(row);
  return {
    verdict,
    idleWord: IDLE_WORD,
    pathWord: PATH_WORD,
    seededWord: SEEDED_WORD,
    productWord: PRODUCT_WORD,
    hold,
    alarm: !hold,
    recover: RECOVER.includes(verdict),
    steady: verdict === "steady" || verdict === "hold",
    strobing:
      verdict === "strobing" ||
      verdict === SEEDED_WORD ||
      verdict === PRODUCT_WORD,
    offLabel:
      row.offLabel === true ||
      verdict === "off-label" ||
      verdict === PATH_WORD,
    scheduleWakeup: row.scheduleWakeup,
    neverLoop: row.neverLoop,
    loopInvoked: row.loopInvoked,
    loopBanner: row.loopBanner,
    skillsTruncated: row.skillsTruncated,
    oneSkill: row.oneSkill,
    skillsCount: row.skillsCount,
    promptRedelivered: row.promptRedelivered,
    interactive: row.interactive,
    tmux: row.tmux,
    implementer: row.implementer,
    noop: row.noop,
    changelog: row.changelog,
    goal: row.goal,
    banner: row.banner,
    prompt: row.prompt,
    skill: row.skill,
    cue: hold ? "steady" : "strobing",
    event: row.event,
    t: row.t,
    phrase: hold ? "admit steady" : "score strobe",
    loop,
    wakeup,
    bannerInspect: banner,
    skills,
    promptInspect: prompt,
  };
}

export function scoreWalk(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const rows = Array.isArray(ticket.rows)
    ? ticket.rows
    : Array.isArray(ticket.walk)
      ? ticket.walk
      : STROBE_WALK;
  const scored = rows.map((row) => ({
    ...normalizeBooth(row),
    ...scoreGate({ ...row, preferSeed: false }),
  }));
  const strobing = scored.filter((row) => row.verdict === "strobing");
  const path = scored.filter((row) => row.verdict === "off-label");
  const steady = scored.filter((row) => row.verdict === "steady");
  const headline =
    scored.find((row) => row.event === "strobing") ||
    scored.find((row) => row.event === "loop-banner") ||
    scored.find((row) => row.event === "off-label") ||
    strobing[strobing.length - 1];
  let verdict = "steady";
  if (strobing.length) verdict = "strobing";
  else if (path.length && !steady.length) verdict = "off-label";
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
    strobingCount: strobing.length,
    pathCount: path.length,
    steadyCount: steady.length,
    headline,
    rows: scored,
    phrase: HOLD.includes(verdict) ? "admit steady" : "score strobe",
    note: headline
      ? "Claude Code 2.1.267 interactive tmux; never /loop; off-label ScheduleWakeup paints loop banner, truncates skills to 1, may redeliver the prior prompt. Changelog 2.1.257 fixed a background session state.json prompt-repeat — this repro is interactive."
      : "published strobe walk scored against steady vs strobing",
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
    seeded !== "steady" &&
    seeded !== "strobing" &&
    seeded !== "off-label" &&
    seeded !== "strobe" &&
    ticket.steady == null &&
    ticket.strobing == null &&
    ticket.offLabel == null &&
    ticket.scheduleWakeup == null &&
    ticket.loopBanner == null &&
    ticket.skillsTruncated == null &&
    ticket.promptRedelivered == null &&
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
    steady: scored.steady ?? false,
    strobing: scored.strobing ?? false,
    offLabel: scored.offLabel ?? false,
    scheduleWakeup: scored.scheduleWakeup ?? false,
    neverLoop: scored.neverLoop ?? false,
    loopBanner: scored.loopBanner ?? false,
    skillsTruncated: scored.skillsTruncated ?? false,
    promptRedelivered: scored.promptRedelivered ?? false,
  };
}

export function score(input) {
  return analyze(input).verdict;
}

export function fingerprint(input) {
  const result = analyze(input);
  return [
    result.verdict,
    result.neverLoop || result.loopInvoked === false
      ? "loop=never"
      : "loop=invoked",
    result.scheduleWakeup || result.offLabel
      ? "wakeup=off-label"
      : "wakeup=idle",
    result.loopBanner ? "banner=painted" : "banner=clear",
    result.skillsTruncated ? "skills=1" : "skills=full",
    result.promptRedelivered ? "prompt=redelivered" : "prompt=once",
    result.cue === "steady" ? "cue=steady" : "cue=strobing",
  ].join("|");
}

export function handle(input) {
  const result = analyze(input);
  const rail = readRail({
    steady: result.steady,
    strobing: result.strobing,
    scheduleWakeup: result.scheduleWakeup,
    offLabel: result.offLabel,
    neverLoop: result.neverLoop,
    loopInvoked: result.loopInvoked,
    loopBanner: result.loopBanner,
    skillsTruncated: result.skillsTruncated,
    oneSkill: result.oneSkill,
    skillsCount: result.skillsCount,
    promptRedelivered: result.promptRedelivered,
  });
  return {
    ...result,
    fingerprint: fingerprint(input),
    rail,
    loop: inspectLoop({
      neverLoop: result.neverLoop,
      loopInvoked: result.loopInvoked,
      scheduleWakeup: result.scheduleWakeup,
      offLabel: result.offLabel,
      loopBanner: result.loopBanner,
      steady: result.steady,
    }),
    wakeup: inspectWakeup({
      scheduleWakeup: result.scheduleWakeup,
      offLabel: result.offLabel,
      neverLoop: result.neverLoop,
      loopInvoked: result.loopInvoked,
      steady: result.steady,
    }),
    banner: inspectBanner({
      loopBanner: result.loopBanner,
      scheduleWakeup: result.scheduleWakeup,
      neverLoop: result.neverLoop,
      steady: result.steady,
    }),
    skills: inspectSkills({
      skillsTruncated: result.skillsTruncated,
      oneSkill: result.oneSkill,
      skillsCount: result.skillsCount,
      steady: result.steady,
    }),
    prompt: inspectPrompt({
      promptRedelivered: result.promptRedelivered,
      steady: result.steady,
    }),
    stations: BENCH_STATIONS.map((row) => ({
      ...row,
      strobing: result.strobing === true || result.verdict === "strobing",
    })),
    published: {
      issue: FEATURED_ISSUE,
      url: ISSUE_URL,
      title: TITLE,
      state: STATE,
      labels: [...LABELS],
      author: AUTHOR,
      filed: FILED,
      claudeCodeVersion: CLAUDE_CODE_VERSION,
      changelogFix: CHANGELOG_FIX,
      relatedNoop: RELATED_NOOP,
      sessionKind: SESSION_KIND,
      terminal: TERMINAL,
      skill: SKILL,
      skillWait: SKILL_WAIT,
      banner: BANNER,
      skillsWakeup: SKILLS_WAKEUP,
      prompt: PROMPT,
      toolScope: TOOL_SCOPE,
      toolDirect: TOOL_DIRECT,
      goalNote: GOAL_NOTE,
      ask: ASK,
      stations: BENCH_STATIONS,
      fingerprintLines: [...FINGERPRINT_LINES],
      cousins: COUSINS.map((row) => row.issue),
      backups: BACKUPS.map((row) => row.issue),
      phrase: PHRASE,
      expected: [
        "ScheduleWakeup is safe or rejected cleanly outside /loop",
        "no spurious Claude resuming /loop wakeup banner when /loop was never invoked",
        "full skills list remains injected on wakeup",
        "the prior prompt is not redelivered as a new user message",
        "or a supported bounded-wait primitive is documented for non-loop sessions",
      ],
      hypothesis:
        "NON-BINDING: Off-label ScheduleWakeup may flip session loop-mode flags / wakeup UI path even when /loop was never entered, truncating skill injection and sometimes replaying the wakeup prompt. Verify against #93468 text only. Do not claim a root cause in Claude Code source you have not seen.",
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
