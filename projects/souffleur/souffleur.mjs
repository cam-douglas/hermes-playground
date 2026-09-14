#!/usr/bin/env node
/**
 * Souffleur — theatre wings / prompt-corner / cue-script /
 * footlights / curtain / VO-focus return booth.
 *
 * Educational diagnostic model for a published Claude desktop
 * a11y defect: after the 11 September 2026 macOS desktop update
 * to 1.52386.3 (Electron 44.2.0), VoiceOver no longer echoes
 * typed characters in the prompt box after switching to another
 * app and returning. The rest of VoiceOver still works: VO
 * navigation, headings/controls, Claude replies, and the
 * "finished responding" announcement. Only typing echo is lost.
 * Quit+reopen restores echo until the next app switch. Typing
 * echo still works in Chrome, Terminal, and other Electron apps
 * on the same Mac. Affects regular chat and Cowork. Failed
 * workarounds: VO Shift Down/Up interact cycle; VO off/on
 * (Cmd F5×2); Escape leave + VO Space re-enter. Environment:
 * macOS 26.5.2 (build 25F84), Claude Max.
 *
 *   node souffleur.mjs data/souffleur.json
 *   echo '{"seed":"souffleur"}' | node souffleur.mjs
 *
 * Idle word is echoing (HOLD: voiced-echo / cued / announced /
 * prompt-heard / wings-open).
 * Seeded word is souffleur (#94031 — the app-switch-echo-loss path).
 * Path word is app-switch-echo-loss.
 * Product score word is souffleur (Score souffleur or admit echoing.).
 *
 * Encoded from anthropics/claude-code#94031 issue text only.
 * Hypothesis (NON-BINDING): Electron/Chromium accessibility
 * focus restore after window reactivation breaks typing-echo
 * for this Electron 44.2.0 bundle. Invite verify against
 * #94031 text only.
 * Do NOT claim a root cause in Claude Code/desktop source you
 * have not seen. Do NOT implement a fix. No network. No
 * exploits. No live Claude.
 *
 * NOT Epitome/#94032. NOT Diabolica/#94040. NOT Sallyport/#94082.
 * NOT Palilalia/#94041. NOT Sepulchre/#94055. NOT Sneck/#94052.
 * NOT Drawbridge/#94049. NOT Chirograph/#94045. NOT Titulus.
 * NOT Derelict. NOT Vestry. NOT Mondegreen. NOT Afterimage/#92596.
 * NOT Phosphene. NOT Scotoma. NOT Scrim. NOT Aphonia/#92409.
 * NOT Sourdine/#93531. NOT Anarthria/#93782. NOT Trismus.
 * NOT Quietus. NOT Followspot. NOT Greenroom. NOT Aside. NOT Ambo.
 * Cousins cite-only: #87977, #87978, #91058, #86697,
 * electron/electron#13203.
 * Souffleur is specifically: after an app-switch exit to the
 * wings and return, the souffleur stops whispering each typed
 * letter — VoiceOver typing echo dies while the rest of the
 * house still speaks.
 */

/* Browser-safe: no top-level node: imports. CLI I/O is loaded only in main(). */

export const VERDICTS = Object.freeze([
  "echoing",
  "souffleur",
  "app-switch-echo-loss",
  "hold",
  "voiced-echo",
  "cued",
  "announced",
  "prompt-heard",
  "wings-open",
  "typing-echo-lost",
  "focus-return-mute",
  "quit-relaunch-only",
  "vo-nav-still-works",
  "electron-cousin",
  "has-repro",
  "cousins",
  "backups",
  "fixtures",
  "walk",
  "landing",
]);

export const IDLE_WORD = "echoing";
export const PATH_WORD = "app-switch-echo-loss";
export const SEEDED_WORD = "souffleur";
export const PRODUCT_WORD = "souffleur";
export const HOLD = Object.freeze(["echoing", "hold"]);
export const HOLD_ALIASES = Object.freeze([
  "echoing",
  "voiced-echo",
  "cued",
  "announced",
  "prompt-heard",
  "wings-open",
]);
export const RECOVER = Object.freeze(["echoing", "hold"]);
export const ALARM = Object.freeze(
  VERDICTS.filter((name) => !HOLD.includes(name)),
);
export const CHIPS = Object.freeze([...VERDICTS]);
export const FORBIDDEN_IDLE = Object.freeze([
  "unabridged",
  "innocent",
  "sealed",
  "silenced",
  "living",
  "cleared",
  "spanned",
  "matched",
  "inscribed",
  "berthed",
  "pegged",
  "latent",
  "flushed",
  "articulate",
  "limber",
  "primed",
  "lit",
  "voiced",
  "mute",
  "rostered",
  "quieted",
  "unrung",
  "demesned",
  "diagrammed",
  "waved",
  "passable",
  "tokenized",
  "epitome",
  "diabolica",
  "sallyport",
  "palilalia",
  "sepulchre",
  "sneck",
  "drawbridge",
  "chirograph",
  "titulus",
  "derelict",
  "vestry",
  "mondegreen",
  "afterimage",
  "phosphene",
  "scotoma",
  "scrim",
  "aphonia",
  "sourdine",
  "anarthria",
  "summarized-thinking-force",
  "cannot-show-not-git",
  "reminder-secret-bypass",
  "goal-stop-refire",
  "bash-nul-poison",
  "dictation-paste-drop",
  "mid-narration",
  "chip-dismiss-ephemeral",
  "rc-bridge-update-drop",
  "worktree-rename-stale",
  "resume-stale-title",
  "session-kill-orphan",
  "mount-refcount-race",
  "layer-tree-walk",
  "substring-scan",
]);

export const FORBIDDEN_SEED = Object.freeze([
  "epitome",
  "diabolica",
  "sallyport",
  "palilalia",
  "sepulchre",
  "sneck",
  "drawbridge",
  "chirograph",
  "titulus",
  "derelict",
  "vestry",
  "mondegreen",
  "afterimage",
  "phosphene",
  "scotoma",
  "scrim",
  "aphonia",
  "sourdine",
  "anarthria",
  "summarized-thinking-force",
  "cannot-show-not-git",
  "reminder-secret-bypass",
  "goal-stop-refire",
  "bash-nul-poison",
  "dictation-paste-drop",
  "mid-narration",
]);

export const FEATURED_ISSUE = 94031;
export const ISSUE_URL =
  "https://github.com/anthropics/claude-code/issues/94031";
export const TITLE =
  "[A11y] macOS desktop app: VoiceOver stops announcing typed characters after switching to another app and back";
export const STATE = "OPEN";
export const LABELS = Object.freeze([
  "bug",
  "has repro",
  "platform:macos",
  "area:a11y",
  "area:desktop",
]);
export const PLATFORM = "macos";
export const SURFACE = "app-switch-echo-loss";
export const HOST =
  "Claude desktop app for macOS (com.anthropic.claudefordesktop) 1.52386.3 / Electron 44.2.0";
export const CHECKED_ON =
  "macOS 26.5.2 (build 25F84); Claude desktop 1.52386.3; Electron 44.2.0; Claude Max; VoiceOver";
export const BUILD = "1.52386.3";
export const SELECTED_MODEL = "None";
export const OS = "macos 26.5.2 (25F84)";
export const PHRASE = "Score souffleur or admit echoing.";
export const DISTRIBUTION =
  "Blind user relies entirely on VoiceOver. Since Claude desktop app update on 11 September 2026 to version 1.52386.3 (Electron 44.2.0), VoiceOver no longer echoes typed characters in the prompt box after switching to another app and returning to Claude. Rest of VoiceOver still works: VO navigation, headings/controls, Claude replies, \"finished responding\" announcement. Only typing echo is lost — many typing mistakes. Quit+reopen restores typing echo until the next app switch. Never happened before this update (regression). Typing echo still works in Chrome, Terminal, other Electron apps on the same Mac — specific to this Claude desktop version. Affects regular chat and Cowork sessions. Workarounds that FAILED: VO Shift Down/Up interact cycle; VO off/on (Cmd F5×2); Escape leave + VO Space re-enter. Only quit+relaunch works; fault returns on next app switch. Environment: macOS 26.5.2 (build 25F84), Claude Max; form Platform/Terminal fields N/A. Resembles long-standing Chromium/Electron VoiceOver typing-echo fault (electron/electron#13203) but newly triggered by app switch after this app version — possibly Electron/Chromium focus-restore change. Related VoiceOver report (cousin cite-only): #87977 (navigation jumps — different symptom).";

export const RULED_OUT = Object.freeze([
  "Epitome/#94032 summarized-thinking-force — scriptorium abridgement",
  "Diabolica/#94040 cannot-show-not-git — worktree Bash inverted burden",
  "Sallyport/#94082 reminder-secret-bypass — mtime reminder dumps secrets past PreToolUse",
  "Palilalia/#94041 goal-stop-refire — /goal Stop hook re-fires stale text",
  "Sepulchre/#94055 bash-nul-poison — Bash NUL truncates the next request body",
  "Sneck/#94052 chip-dismiss-ephemeral — Hide→X chip dismiss",
  "Drawbridge/#94049 rc-bridge-update-drop — machine-wide Remote Control span",
  "Chirograph/#94045 worktree-rename-stale — recorded branch never refreshed",
  "Titulus — resume-stale-title; different plaque",
  "Derelict — session-kill-orphan; different hulk",
  "Vestry — mount-refcount-race; different sacristy",
  "Mondegreen — substring-scan; different lyric ear",
  "Afterimage/#92596 — Windows text paint latency (CRT phosphor)",
  "Phosphene — layer-tree-walk; vision flash",
  "Scotoma — /goal lived only in command-args; vision gap",
  "Scrim — runtime DLP redaction; different product",
  "Aphonia/#92409 — missing SendMessage; ENT roster",
  "Sourdine/#93531 — mid-narration mute; concert mute",
  "Anarthria/#93782 — dictation paste drop; laryngology",
  "Trismus — different jaw lock",
  "Quietus — different extinguishing",
  "Followspot — different stage light",
  "Greenroom — different backstage wait",
  "Aside — different whispered aside",
  "Ambo — different pulpit",
]);
export const EXPECTED = Object.freeze([
  "VoiceOver should announce each typed character in the prompt box every time, including after switching to another app and back",
  "Typing echo should work exactly as it did before the 11 September 2026 update to 1.52386.3",
  "Typing echo should match Chrome, Terminal, and other Electron apps on the same Mac",
  "A blind user should be able to compose a prompt without quitting and relaunching after every app switch",
  "VO Shift Down/Up, VO off/on, and Escape + VO Space should not be required — and they already fail",
]);

export const FIELD_MARKS = Object.freeze([
  {
    id: "typing-echo-lost",
    label: "typing echo lost",
    count: "no character echo",
    note: "VoiceOver no longer echoes typed characters in the prompt box after app switch + return",
  },
  {
    id: "focus-return-mute",
    label: "focus return hush",
    count: "Cmd-Tab back",
    note: "After leaving to another app and returning, the souffleur stops whispering each letter",
  },
  {
    id: "vo-nav-still-works",
    label: "VO nav still works",
    count: "house still speaks",
    note: "VO navigation, headings/controls, Claude replies, finished-responding still announce",
  },
  {
    id: "quit-relaunch-only",
    label: "quit relaunch only",
    count: "quit+reopen",
    note: "Only quit+relaunch restores typing echo; fault returns on the next app switch",
  },
  {
    id: "electron-cousin",
    label: "electron cousin",
    count: "electron#13203",
    note: "Resembles long-standing Chromium/Electron VoiceOver typing-echo fault; newly triggered by app switch",
  },
  {
    id: "app-switch-echo-loss",
    label: "app-switch echo loss",
    count: "1.52386.3 / Electron 44.2.0",
    note: "Regression since 11 September 2026 desktop update; chat and Cowork; specific to this Claude desktop version",
  },
]);

export const ECHO_SHAPES = Object.freeze([
  {
    id: "typing-echo-lost",
    lost: "nothing announced while typing after return",
    control: "each typed character announced",
    story: "the souffleur stops whispering letters",
  },
  {
    id: "focus-return-mute",
    lost: "app switch + return kills typing echo",
    control: "echo survives focus leave and return",
    story: "exit to the wings, return, prompt-corner goes hush",
  },
  {
    id: "vo-nav-still-works",
    lost: "only typing echo is lost",
    control: "full VoiceOver including typing echo",
    story: "the rest of the house still speaks",
  },
  {
    id: "quit-relaunch-only",
    lost: "quit+reopen restores until next switch",
    control: "echo holds across app switches",
    story: "only a full curtain-down / house-reopen restores the whisper",
  },
  {
    id: "electron-cousin",
    lost: "electron/electron#13203 family, newly app-switch triggered",
    control: "Chrome / Terminal / other Electron still echo",
    story: "cousin cite-only — do not rebuild the Chromium fault",
  },
  {
    id: "app-switch-echo-loss",
    lost: "1.52386.3 Electron 44.2.0 after 11 September 2026",
    control: "pre-update desktop typing echo",
    story: "regression; never happened before this version",
  },
]);

export const BOOTH_STCTIONS = Object.freeze([
  {
    id: "echoing-house",
    survey:
      "wings stay dark; prompt-corner whispers each letter; cue-script heard; footlights amber; curtain open",
    kind: "echoing",
    note: "idle: echoing — the hold/good path",
  },
  {
    id: "typing-echo-lost",
    survey:
      "typed characters no longer announced in the prompt box after return",
    kind: "souffleur",
    note: "seeded: souffleur goes silent on letters",
  },
  {
    id: "app-switch-echo-loss",
    survey:
      "focus leave + return → typing echo gone; VO nav still works; quit-relaunch restores until next switch",
    kind: "souffleur",
    note: "path: app-switch-echo-loss names the hush",
  },
  {
    id: "vo-nav-still-works",
    survey:
      "VO keys, headings, Claude replies, finished-responding still announce",
    kind: "souffleur",
    note: "seeded: house still speaks; only the whisper is gone",
  },
  {
    id: "souffleur",
    survey:
      "the booth is souffleur — the prompter stops whispering each typed letter after the wings exit",
    kind: "souffleur",
    note: "seeded: souffleur — Score souffleur or admit echoing.",
  },
]);

export const BOOTH_STATIONS = BOOTH_STCTIONS;

export const FINGERPRINT_LINES = Object.freeze([
  "app-switch-echo-loss",
  "souffleur",
  "typing-echo-lost",
  "focus-return-mute",
  "quit-relaunch-only",
  "vo-nav-still-works",
  "electron-cousin",
]);

export const COUSINS = Object.freeze([
  {
    issue: 87977,
    title: "VoiceOver navigation jumps — different symptom",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — related VoiceOver report for the same app; navigation jumps, not typing-echo loss. Do not rebuild. Do not conflate.",
  },
  {
    issue: 87978,
    title: "cite-only cousin #87978",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not rebuild. Do not conflate.",
  },
  {
    issue: 91058,
    title: "cite-only cousin #91058",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not rebuild. Do not conflate.",
  },
  {
    issue: 86697,
    title: "cite-only cousin #86697",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — do not rebuild. Do not conflate.",
  },
  {
    issue: 13203,
    repo: "electron/electron",
    title:
      "long-standing Chromium/Electron VoiceOver typing-echo fault",
    state: "OPEN",
    citeOnly: true,
    why: "Cite only — electron/electron#13203. Resembles the family; newly triggered here by app switch after 1.52386.3. Do not rebuild. Do not conflate.",
  },
]);

export const BACKUPS = Object.freeze([
  { issue: 94029, title: "backup #94029 claude attach ignores DISABLE_MOUSE", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93987, title: "backup #93987 /reload-skills no changes", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93924, title: "backup #93924 Remote Control slows local", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93770, title: "backup #93770 TUI copy padding", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 93777, title: "backup #93777 Vercel MCP teamId not forwarded", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94059, title: "backup #94059 bg tasks stale Running / ssh stdin hang", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94053, title: "backup #94053 desktop model picker skips Pre/PostModelSwitch", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94174, title: "backup #94174", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94151, title: "backup #94151", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94065, title: "backup #94065", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
  { issue: 94064, title: "backup #94064", state: "OPEN", citeOnly: true, why: "Cite only — next focus only — do not auto-pick as this ship" },
]);

export const NOT_PRODUCTS = Object.freeze([
  "epitome",
  "diabolica",
  "sallyport",
  "palilalia",
  "sepulchre",
  "sneck",
  "drawbridge",
  "chirograph",
  "titulus",
  "derelict",
  "vestry",
  "mondegreen",
  "afterimage",
  "phosphene",
  "scotoma",
  "scrim",
  "aphonia",
  "sourdine",
  "anarthria",
  "trismus",
  "quietus",
  "followspot",
  "greenroom",
  "aside",
  "ambo",
]);

export const SAMPLE_KIND_IDLE = "wings-open";
export const SAMPLE_KIND_SEEDED = "app-switch-echo-loss";
export const SAMPLE_HOLDING_IDLE = "announced";
export const SAMPLE_HOLDING_SEEDED = "hushed";

export const SAMPLE_ECHOING_PROOF = Object.freeze({
  echoing: true,
  souffleur: false,
  appSwitchEchoLoss: false,
  typingEchoLost: false,
  focusReturnMute: false,
  quitRelaunchOnly: false,
  voNavStillWorks: false,
  electronCousin: false,
  kind: SAMPLE_KIND_IDLE,
});

export const SAMPLE_SOUFFLEUR_PROOF = Object.freeze({
  echoing: false,
  souffleur: true,
  appSwitchEchoLoss: true,
  typingEchoLost: true,
  focusReturnMute: true,
  quitRelaunchOnly: true,
  voNavStillWorks: true,
  electronCousin: true,
  kind: SAMPLE_KIND_SEEDED,
  shapes: ECHO_SHAPES.map((row) => row.id),
});

export const SAMPLE_WALK_LOG = Object.freeze([
  { t: "idle", line: "booth holds echoing: prompt-corner whispers each letter; wings open; footlights amber" },
  { t: "leave", line: "app switch — exit to the wings" },
  { t: "return", line: "focus return; typed characters no longer announced; VO nav still works" },
  { t: "path", line: "app-switch-echo-loss — quit+relaunch restores until the next switch" },
  { t: "score", line: "when the souffleur stops whispering each typed letter the booth is souffleur — Score souffleur or admit echoing." },
]);

const FORCE_FLAGS = [
  "appSwitchEchoLoss",
  "typingEchoLost",
  "focusReturnMute",
  "quitRelaunchOnly",
  "voNavStillWorks",
  "electronCousin",
];

/**
 * House map: echoing prompt-corner vs silent souffleur.
 * Idle/echoing: wings open; cue-script heard; footlights amber.
 * Seeded/souffleur: wings exit + return; whisper gone; house still speaks.
 */
export function mapHouse(input = {}) {
  const souffleur = isSouffleurInput(input);
  const echoing = input.echoing === true && !souffleur;
  return {
    stamp: souffleur ? "app-switch-echo-loss" : "echoing-house",
    holdingLane: souffleur ? "hushed" : "announced",
    kindLane: souffleur ? "app-switch-echo-loss" : "wings-open",
    bindLane: souffleur ? "typing-echo-lost" : "voiced-echo",
    ribbon: souffleur ? "souffleur" : "echoing",
    echoing,
  };
}

export function inspectWings(input = {}) {
  const departed = isSouffleurInput(input);
  if (input.echoing === true && !departed) {
    return {
      stamp: "wings-open",
      departed: false,
      note: "wings stay open — the house holds echoing",
    };
  }
  return {
    stamp: departed ? "wings-exited" : "wings-idle",
    departed,
    note: departed
      ? "exit to the wings (app switch); return leaves the souffleur silent"
      : "",
  };
}

export function inspectPrompt(input = {}) {
  const silent = isSouffleurInput(input);
  if (input.echoing === true && !silent) {
    return {
      stamp: "prompt-heard",
      silent: false,
      edge: "whispering",
    };
  }
  return {
    stamp: silent ? "prompt-hushed" : "prompt-idle",
    silent,
    edge: silent ? "lost-echo" : "whispering",
    note: silent
      ? "prompt box no longer announces each typed character after focus return"
      : "",
  };
}

export function inspectCue(input = {}) {
  const dropped = isSouffleurInput(input);
  if (input.echoing === true && !dropped) {
    return {
      stamp: "cue-announced",
      dropped: false,
    };
  }
  return {
    stamp: dropped ? "cue-lost" : "cue-idle",
    dropped,
    note: dropped
      ? "cue-script letters are no longer whispered from the prompt-corner"
      : "",
  };
}

export function inspectFootlights(input = {}) {
  const dimmed =
    input.focusReturnMute === true ||
    input.typingEchoLost === true ||
    input.souffleur === true ||
    isSouffleurInput(input);
  if (input.echoing === true && !dimmed) {
    return {
      stamp: "footlights-amber",
      dimmed: false,
    };
  }
  return {
    stamp: dimmed ? "footlights-dim" : "footlights-idle",
    dimmed,
    note: dimmed
      ? "footlights dim after focus return — typing echo is gone"
      : "",
  };
}

export function inspectCurtain(input = {}) {
  const dropped =
    input.quitRelaunchOnly === true ||
    input.souffleur === true ||
    isSouffleurInput(input);
  if (input.echoing === true && !dropped) {
    return {
      stamp: "curtain-open",
      dropped: false,
    };
  }
  return {
    stamp: dropped ? "curtain-dropped" : "curtain-idle",
    dropped,
    note: dropped
      ? "only a full curtain-down / quit+relaunch restores the whisper until the next switch"
      : "",
  };
}

export function inspectFocusReturn(input = {}) {
  const lost =
    input.focusReturnMute === true ||
    input.appSwitchEchoLoss === true ||
    input.souffleur === true ||
    isSouffleurInput(input);
  if (input.echoing === true && !lost) {
    return {
      stamp: "focus-echo-holds",
      lost: false,
    };
  }
  return {
    stamp: lost ? "focus-return-mute" : "focus-idle",
    lost,
    note: lost
      ? "focus leave + return → typing echo gone; VO nav still works"
      : "",
  };
}

function shapeOpen(input, id) {
  const map = {
    "typing-echo-lost": input.typingEchoLost,
    "focus-return-mute": input.focusReturnMute,
    "vo-nav-still-works": input.voNavStillWorks,
    "quit-relaunch-only": input.quitRelaunchOnly,
    "electron-cousin": input.electronCousin,
    "app-switch-echo-loss": input.appSwitchEchoLoss,
  };
  return (
    map[id] === true ||
    input.appSwitchEchoLoss === true ||
    input.souffleur === true
  );
}

function isSouffleurInput(input = {}) {
  return (
    input.souffleur === true ||
    input.appSwitchEchoLoss === true ||
    input.typingEchoLost === true ||
    input.focusReturnMute === true ||
    input.quitRelaunchOnly === true ||
    input.voNavStillWorks === true ||
    input.electronCousin === true
  );
}

export function readBooth(input = {}) {
  const souffleur = isSouffleurInput(input);
  const echoing = input.echoing === true && !souffleur;
  return {
    mark: souffleur ? "souffleur" : "echoing",
    echoing,
    souffleur,
    appSwitchEchoLoss: input.appSwitchEchoLoss === true || souffleur,
    typingEchoLost: input.typingEchoLost === true,
    focusReturnMute: input.focusReturnMute === true,
    quitRelaunchOnly: input.quitRelaunchOnly === true,
    voNavStillWorks: input.voNavStillWorks === true,
    electronCousin: input.electronCousin === true,
    scope: mapHouse(input),
    wings: inspectWings(input),
    prompt: inspectPrompt(input),
    cue: inspectCue(input),
    footlights: inspectFootlights(input),
    curtain: inspectCurtain(input),
    focusReturn: inspectFocusReturn(input),
    shapes: ECHO_SHAPES.filter((row) => shapeOpen(input, row.id)).map(
      (row) => row.id,
    ),
    log: input.log || [],
  };
}

export const SOUFFLEUR_WALK = Object.freeze([
  {
    t: "idle",
    event: "cue-echoing",
    echoing: true,
    souffleur: false,
    cue: "echoing",
    note: "idle HOLD: prompt-corner whispers each letter; wings open; footlights amber — the hold/good path",
  },
  {
    t: "leave",
    event: "wings-exit",
    souffleur: true,
    appSwitchEchoLoss: true,
    cue: "souffleur",
    note: "app switch — exit to the wings",
  },
  {
    t: "return",
    event: "focus-return-mute",
    souffleur: true,
    typingEchoLost: true,
    focusReturnMute: true,
    voNavStillWorks: true,
    cue: "souffleur",
    note: "focus return; typed characters no longer announced; VO nav still works",
  },
  {
    t: "path",
    event: "app-switch-echo-loss",
    souffleur: true,
    appSwitchEchoLoss: true,
    typingEchoLost: true,
    cue: "souffleur",
    note: "app-switch-echo-loss — quit+relaunch restores until the next switch",
  },
  {
    t: "score",
    event: "souffleur",
    souffleur: true,
    appSwitchEchoLoss: true,
    typingEchoLost: true,
    focusReturnMute: true,
    quitRelaunchOnly: true,
    voNavStillWorks: true,
    electronCousin: true,
    cue: "souffleur",
    note: "souffleur — when the souffleur stops whispering each typed letter the booth is souffleur",
  },
]);

export const POSITIVE_CONTROL_WALK = Object.freeze([
  {
    t: "hold",
    event: "cue-echoing",
    echoing: true,
    souffleur: false,
    cue: "echoing",
    note: "positive control: Chrome / Terminal / other Electron still announce each character — the house is echoing",
  },
  {
    t: "announce",
    event: "cue-echoing",
    echoing: true,
    cue: "echoing",
    note: "positive control: the house admits echoing",
  },
]);

function classifyFromSeed(seed) {
  if (seed && VERDICTS.includes(seed)) return seed;
  return null;
}

export function emptyTicket() {
  return {
    seed: IDLE_WORD,
    echoing: true,
    souffleur: false,
    appSwitchEchoLoss: false,
    cue: "echoing",
  };
}

export function seedEchoing() {
  return { ...emptyTicket() };
}

export function seedSouffleur() {
  return {
    seed: SEEDED_WORD,
    echoing: false,
    souffleur: true,
    appSwitchEchoLoss: true,
    typingEchoLost: true,
    focusReturnMute: true,
    quitRelaunchOnly: true,
    voNavStillWorks: true,
    electronCousin: true,
    cue: "souffleur",
    issue: FEATURED_ISSUE,
    proof: SAMPLE_SOUFFLEUR_PROOF,
  };
}

export function seedProduct() {
  return {
    seed: PRODUCT_WORD,
    preferSeed: true,
    souffleur: true,
    appSwitchEchoLoss: true,
    typingEchoLost: true,
    cue: "souffleur",
  };
}

export function seedAppSwitchEchoLoss() {
  return {
    seed: PATH_WORD,
    preferSeed: true,
    souffleur: true,
    appSwitchEchoLoss: true,
    event: "app-switch-echo-loss",
    cue: "souffleur",
  };
}

export function seedHold() {
  return {
    seed: "hold",
    preferSeed: true,
    echoing: true,
    cue: "echoing",
  };
}

export function seedVoicedEcho() {
  return {
    seed: "voiced-echo",
    preferSeed: true,
    echoing: true,
    cue: "echoing",
  };
}

export function seedCued() {
  return {
    seed: "cued",
    preferSeed: true,
    echoing: true,
    cue: "echoing",
  };
}

export function seedAnnounced() {
  return {
    seed: "announced",
    preferSeed: true,
    echoing: true,
    cue: "echoing",
  };
}

export function seedPromptHeard() {
  return {
    seed: "prompt-heard",
    preferSeed: true,
    echoing: true,
    cue: "echoing",
  };
}

export function seedWingsOpen() {
  return {
    seed: "wings-open",
    preferSeed: true,
    echoing: true,
    cue: "echoing",
  };
}

export function seedTypingEchoLost() {
  return {
    seed: "typing-echo-lost",
    preferSeed: true,
    typingEchoLost: true,
    cue: "souffleur",
  };
}

export function seedFocusReturnMute() {
  return {
    seed: "focus-return-mute",
    preferSeed: true,
    focusReturnMute: true,
    cue: "souffleur",
  };
}

export function seedQuitRelaunchOnly() {
  return {
    seed: "quit-relaunch-only",
    preferSeed: true,
    quitRelaunchOnly: true,
    cue: "souffleur",
  };
}

export function seedVoNavStillWorks() {
  return {
    seed: "vo-nav-still-works",
    preferSeed: true,
    voNavStillWorks: true,
    cue: "souffleur",
  };
}

export function seedElectronCousin() {
  return {
    seed: "electron-cousin",
    preferSeed: true,
    electronCousin: true,
    cue: "souffleur",
  };
}

export function normalizeBooth(raw) {
  if (!raw || typeof raw !== "object") {
    return {
      echoing: false,
      souffleur: false,
      appSwitchEchoLoss: false,
      typingEchoLost: false,
      focusReturnMute: false,
      quitRelaunchOnly: false,
      voNavStillWorks: false,
      electronCousin: false,
      cue: null,
      event: null,
      t: null,
    };
  }
  return {
    echoing: raw.echoing === true,
    souffleur: raw.souffleur === true || raw.event === "souffleur",
    appSwitchEchoLoss:
      raw.appSwitchEchoLoss === true ||
      raw.event === "app-switch-echo-loss",
    typingEchoLost:
      raw.typingEchoLost === true || raw.event === "typing-echo-lost",
    focusReturnMute:
      raw.focusReturnMute === true || raw.event === "focus-return-mute",
    quitRelaunchOnly:
      raw.quitRelaunchOnly === true || raw.event === "quit-relaunch-only",
    voNavStillWorks:
      raw.voNavStillWorks === true || raw.event === "vo-nav-still-works",
    electronCousin:
      raw.electronCousin === true || raw.event === "electron-cousin",
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
      (ticket.echoing != null ||
        ticket.souffleur != null ||
        ticket.appSwitchEchoLoss != null ||
        ticket.typingEchoLost != null ||
        ticket.focusReturnMute != null ||
        ticket.quitRelaunchOnly != null ||
        ticket.voNavStillWorks != null ||
        ticket.electronCousin != null ||
        ticket.cue != null ||
        ticket.event ||
        ticket.proof),
  );
}

function isEchoing(row) {
  if (row.souffleur && row.cue !== "echoing") return false;
  if (row.cue === "souffleur" || row.cue === "app-switch-echo-loss") {
    return false;
  }
  if (
    row.appSwitchEchoLoss &&
    row.typingEchoLost &&
    row.cue !== "echoing" &&
    row.echoing !== true
  ) {
    return false;
  }
  if (
    row.echoing === true &&
    row.souffleur !== true &&
    row.cue !== "souffleur"
  ) {
    return true;
  }
  if (
    row.cue === "echoing" &&
    row.souffleur !== true &&
    row.appSwitchEchoLoss !== true &&
    FORCE_FLAGS.every((flag) => row[flag] !== true)
  ) {
    return true;
  }
  return false;
}

function isAppSwitchEchoLoss(row) {
  return (
    row.event === "app-switch-echo-loss" &&
    !isEchoing(row) &&
    (row.appSwitchEchoLoss === true ||
      row.typingEchoLost === true ||
      row.souffleur === true)
  );
}

function isSouffleurRow(row) {
  if (isEchoing(row)) return false;
  if (isAppSwitchEchoLoss(row) && row.cue !== "souffleur") return false;
  if (row.cue === "souffleur") return true;
  if (row.souffleur === true) return true;
  if (row.appSwitchEchoLoss === true && row.typingEchoLost === true) {
    return true;
  }
  if (
    row.appSwitchEchoLoss === true ||
    row.typingEchoLost === true ||
    row.focusReturnMute === true ||
    row.quitRelaunchOnly === true ||
    row.voNavStillWorks === true ||
    row.electronCousin === true
  ) {
    return true;
  }
  return false;
}

/**
 * Score one souffleur pass against the house.
 * echoing: prompt-corner whispers; wings open; footlights amber.
 * souffleur: whisper gone after wings exit + return.
 * app-switch-echo-loss: names that path.
 */
export function scoreGate(input = {}) {
  const ticket = typeof input === "string" ? safeParse(input) : input || {};
  const row = normalizeBooth(ticket);
  const seeded = classifyFromSeed(ticket.seed || ticket.verdict);

  let verdict = IDLE_WORD;
  if (
    isAppSwitchEchoLoss(row) ||
    (row.appSwitchEchoLoss &&
      ticket.preferSeed &&
      seeded === PATH_WORD)
  ) {
    verdict = "app-switch-echo-loss";
  } else if (isSouffleurRow(row)) {
    verdict = "souffleur";
  } else if (isEchoing(row)) {
    verdict = "echoing";
  } else if (
    row.appSwitchEchoLoss ||
    row.typingEchoLost ||
    row.focusReturnMute ||
    row.quitRelaunchOnly ||
    row.voNavStillWorks ||
    row.electronCousin
  ) {
    verdict = "souffleur";
  }

  if (seeded && (!hasBoothFields(ticket) || ticket.preferSeed === true)) {
    verdict = seeded;
  }

  const hold = HOLD.includes(verdict);
  const wings = inspectWings(row);
  const prompt = inspectPrompt(row);
  const cue = inspectCue(row);
  const footlights = inspectFootlights(row);
  const curtain = inspectCurtain(row);
  const focusReturn = inspectFocusReturn(row);
  return {
    verdict,
    idleWord: IDLE_WORD,
    pathWord: PATH_WORD,
    seededWord: SEEDED_WORD,
    productWord: PRODUCT_WORD,
    hold,
    alarm: !hold,
    recover: RECOVER.includes(verdict),
    echoing: verdict === "echoing" || verdict === "hold",
    souffleur: verdict === "souffleur" || verdict === SEEDED_WORD,
    appSwitchEchoLoss:
      row.appSwitchEchoLoss === true ||
      verdict === "app-switch-echo-loss" ||
      verdict === PATH_WORD,
    typingEchoLost: row.typingEchoLost,
    focusReturnMute: row.focusReturnMute,
    quitRelaunchOnly: row.quitRelaunchOnly,
    voNavStillWorks: row.voNavStillWorks,
    electronCousin: row.electronCousin,
    cue: hold
      ? "echoing"
      : row.appSwitchEchoLoss ||
          verdict === "app-switch-echo-loss"
        ? "app-switch-echo-loss"
        : "souffleur",
    event: row.event,
    t: row.t,
    phrase: hold ? "admit echoing" : "score souffleur",
    wingsInspect: wings,
    promptInspect: prompt,
    cueInspect: cue,
    footlightsInspect: footlights,
    curtainInspect: curtain,
    focusReturnInspect: focusReturn,
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
      : SOUFFLEUR_WALK;
  const scored = rows.map((row) => ({
    ...normalizeBooth(row),
    ...scoreGate({ ...row, preferSeed: false }),
  }));
  const charged = scored.filter((row) => row.verdict === "souffleur");
  const path = scored.filter(
    (row) => row.verdict === "app-switch-echo-loss",
  );
  const echoing = scored.filter((row) => row.verdict === "echoing");
  const headline =
    scored.find((row) => row.event === "souffleur") ||
    scored.find((row) => row.event === "app-switch-echo-loss") ||
    scored.find((row) => row.event === "typing-echo-lost") ||
    charged[charged.length - 1];
  let verdict = "echoing";
  if (charged.length) verdict = "souffleur";
  else if (path.length && !echoing.length) {
    verdict = "app-switch-echo-loss";
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
    souffleurCount: charged.length,
    pathCount: path.length,
    echoingCount: echoing.length,
    headline,
    rows: scored,
    phrase: HOLD.includes(verdict) ? "admit echoing" : "score souffleur",
    note: headline
      ? "Focus leave + return → typing echo gone; VO nav still works; quit-relaunch restores until next switch. Cousins cite-only: #87977 #87978 #91058 #86697 electron/electron#13203."
      : "published souffleur walk scored against echoing vs souffleur",
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
    seeded !== "echoing" &&
    seeded !== "souffleur" &&
    seeded !== "app-switch-echo-loss" &&
    ticket.echoing == null &&
    ticket.souffleur == null &&
    ticket.appSwitchEchoLoss == null &&
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
    echoing: scored.echoing ?? false,
    souffleur: scored.souffleur ?? false,
    appSwitchEchoLoss: scored.appSwitchEchoLoss ?? false,
    typingEchoLost: scored.typingEchoLost ?? false,
    focusReturnMute: scored.focusReturnMute ?? false,
    quitRelaunchOnly: scored.quitRelaunchOnly ?? false,
    voNavStillWorks: scored.voNavStillWorks ?? false,
    electronCousin: scored.electronCousin ?? false,
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
    result.typingEchoLost || result.souffleur
      ? "kind=app-switch-echo-loss"
      : "kind=wings-open",
    result.focusReturnMute || result.souffleur ? "ref=lost-echo" : "ref=announced",
    result.appSwitchEchoLoss ||
    result.verdict === "app-switch-echo-loss"
      ? "path=app-switch-echo-loss"
      : "path=echoing",
    result.cue === "echoing"
      ? "cue=echoing"
      : result.cue === "app-switch-echo-loss"
        ? "cue=app-switch-echo-loss"
        : "cue=souffleur",
  ].join("|");
}

export function handle(input) {
  const result = analyze(input);
  const booth = readBooth({
    echoing: result.echoing,
    souffleur: result.souffleur,
    appSwitchEchoLoss: result.appSwitchEchoLoss,
    typingEchoLost: result.typingEchoLost,
    focusReturnMute: result.focusReturnMute,
    quitRelaunchOnly: result.quitRelaunchOnly,
    voNavStillWorks: result.voNavStillWorks,
    electronCousin: result.electronCousin,
    proof: input && input.proof,
    log: input && input.log,
  });
  return {
    ...result,
    fingerprint: fingerprint(input),
    booth,
    wings: inspectWings({
      echoing: result.echoing,
      souffleur: result.souffleur,
      appSwitchEchoLoss: result.appSwitchEchoLoss,
    }),
    prompt: inspectPrompt({
      echoing: result.echoing,
      souffleur: result.souffleur,
      appSwitchEchoLoss: result.appSwitchEchoLoss,
    }),
    cue: inspectCue({
      echoing: result.echoing,
      souffleur: result.souffleur,
      typingEchoLost: result.typingEchoLost,
    }),
    footlights: inspectFootlights({
      echoing: result.echoing,
      souffleur: result.souffleur,
      focusReturnMute: result.focusReturnMute,
      typingEchoLost: result.typingEchoLost,
    }),
    curtain: inspectCurtain({
      echoing: result.echoing,
      souffleur: result.souffleur,
      quitRelaunchOnly: result.quitRelaunchOnly,
    }),
    focusReturn: inspectFocusReturn({
      echoing: result.echoing,
      souffleur: result.souffleur,
      focusReturnMute: result.focusReturnMute,
      appSwitchEchoLoss: result.appSwitchEchoLoss,
    }),
    scope: mapHouse({
      echoing: result.echoing,
      souffleur: result.souffleur,
      appSwitchEchoLoss: result.appSwitchEchoLoss,
      typingEchoLost: result.typingEchoLost,
      focusReturnMute: result.focusReturnMute,
      quitRelaunchOnly: result.quitRelaunchOnly,
      voNavStillWorks: result.voNavStillWorks,
      electronCousin: result.electronCousin,
    }),
    stations: BOOTH_STATIONS.map((row) => ({
      ...row,
      souffleur: result.souffleur === true || result.verdict === "souffleur",
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
      shapes: ECHO_SHAPES,
      ruledOut: [...RULED_OUT],
      expected: [...EXPECTED],
      distribution: DISTRIBUTION,
      stations: BOOTH_STATIONS,
      fingerprintLines: [...FINGERPRINT_LINES],
      cousins: COUSINS.map((row) => row.issue),
      backups: BACKUPS.map((row) => row.issue),
      phrase: PHRASE,
      hypothesis:
        "NON-BINDING: Electron/Chromium accessibility focus restore after window reactivation breaks typing-echo for this Electron 44.2.0 bundle. Invite verify against #94031 text only. Do not claim a root cause in Claude Code/desktop source you have not seen.",
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
