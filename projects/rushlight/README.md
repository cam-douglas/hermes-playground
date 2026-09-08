# Rushlight

An **iron sconce / rush-pith candle atelier** — soot wall, amber wick, parchment ledger, iron fittings; Petrona + Manrope + IBM Plex Mono — for a real Claude Code defect: **MACOS SYSTEMPOLICYAPPDATA PROMPT RECURS EVERY SESSION ON THE SAME VERSION BECAUSE THE DESKTOP-BUNDLED WORKER'S TCC GRANT IS STORED SESSION-SCOPED.** When a hypothetical persistently-authorizable identity keeps the rush across sessions of 2.1.258, the sconce is **tenured**.

Primary:

- [anthropics/claude-code#92784](https://github.com/anthropics/claude-code/issues/92784) (OPEN, bug, has repro, platform:macos, area:packaging, area:desktop). Title: `macOS: "access data from other apps" (SystemPolicyAppData) prompt recurs every session on the SAME version — grant stored session-scoped (desktop-bundled worker)`. Filed 2026-09-08T05:47:57Z.

15:50 rushlight: an iron sconce / rush-pith atelier that should keep the TCC AppData grant lit across sessions of the same Claude Code version; instead tccd stores the grant session-scoped and the same 2.1.258 re-prompts every session; score snuffed or admit tenured.

Score snuffed or admit tenured.

Idle word: **lit** (HOLD: TCC AppData grant persists across sessions of the same version). Seeded state: **snuffed** / #92784. Admit word: **tenured**. Never idle as dripping, chorded, piped, berthed, lean, attentive, waived, bricked, unrung, echoed, laden, deaf, shed, remounted, refused, imprinted, burning, granted, glowing. Never seeded as arrested, flattened, swallowed, echoed, laden, deaf, chorded, meshed, piped, unbound.

**Rushlight** = a rush-candle / iron-sconce atelier that should stay lit across sessions of the same Claude Code version once the user Allows the macOS SystemPolicyAppData prompt. Measured, tccd stores the grant session-scoped.

- **lit** = IDLE: HOLD; TCC AppData grant persists across sessions of the same version
- **snuffed** = seeded word / #92784 path: session-scoped grant evaporates; re-prompt every session on 2.1.258
- **tenured** = admit hold: grant durable across sessions of the same version
- **session-scoped-auth-invalid** = tccd AUTHREQ_CTX `kTCCServiceSystemPolicyAppData`; "Session scoped auth is invalid for client"; AUTHREQ_PROMPTING subject Sub:{com.anthropic.claude-code}
- **same-version-reprompt** = after Allow, AUTHREQ_RESULT authValue=2 authReason=2 and TCCDEvent type=Create; ~18 minutes later SAME 2.1.258 prompts again; 4 prompts / 2 days
- **startup-appdata-enumeration** = kernel denials at startup: Mail, Safari, AddressBook, CallHistoryDB, MobileSync, HomeKit, Messages, FaceTime, Suggestions, Weather, Containers
- **fda-desktop-ineffective** = Full Disk Access on `/Applications/Claude.app` does NOT help; responsible process is child `com.anthropic.claude-code` (consistent with #66216)
- **child-worker-identity** = desktop-bundled worker (NOT native `~/.local`, NOT npm); path under `~/Library/Application Support/Claude/claude-code/2.1.258/`; signed Anthropic PBC (Q6L2SF6YDW); two independent bugs
- **cousins** = cite-only #63130 OPEN, #66216 CLOSED, #36832 CLOSED, #36675 CLOSED, #41297 CLOSED, #59608 CLOSED; primary stays #92784
- **has-clear-repro** = issue labeled has repro

Verdicts: lit, snuffed, tenured, session-scoped-auth-invalid, same-version-reprompt, startup-appdata-enumeration, fda-desktop-ineffective, child-worker-identity, has-clear-repro, cousins.

This is a diagnostic scoring assay. Not an exploit. No live Claude sessions. No payloads. No secrets. Score whether a later session of the same version would leave the rush **snuffed** or already **tenured**. Fixtures use the issue's published incident only.

Hypothesis only (NON-BINDING): worker spawned as child of Electron desktop via disclaimer helper gets session-scoped tccd grant rather than persistently-authorizable app identity; plus startup enumeration of unrelated Library folders raises SystemPolicyAppData. Verify against issue text only; do not claim unread source.

## Research brief

Sources:

- Primary: [anthropics/claude-code#92784](https://github.com/anthropics/claude-code/issues/92784)
- Cousins cite-only (NOT primary): [anthropics/claude-code#63130](https://github.com/anthropics/claude-code/issues/63130) OPEN — TCC popup recurring v2.1.153; [anthropics/claude-code#66216](https://github.com/anthropics/claude-code/issues/66216) CLOSED — native installer recurring TCC; FDA on ClaudeCode.app no help; [anthropics/claude-code#36832](https://github.com/anthropics/claude-code/issues/36832) CLOSED — node TCC every launch; [anthropics/claude-code#36675](https://github.com/anthropics/claude-code/issues/36675) CLOSED — CLI binary version-named dialog; [anthropics/claude-code#41297](https://github.com/anthropics/claude-code/issues/41297) CLOSED — TCC on every update + Apple Music; [anthropics/claude-code#59608](https://github.com/anthropics/claude-code/issues/59608) CLOSED — version number in TCC dialog, re-prompts on update.

What happened (from the issue body — do not invent):

- macOS 26.5.2 (build 25F84) Apple Silicon; Claude Code 2.1.258 as desktop app's bundled worker (NOT native `~/.local`, NOT npm)
- Responsible path: `~/Library/Application Support/Claude/claude-code/2.1.258/claude.app/Contents/MacOS/claude`
- Bundle ID: `com.anthropic.claude-code`; signed Developer ID Application: Anthropic PBC (Q6L2SF6YDW), hardened runtime
- tccd: AUTHREQ_CTX service=`kTCCServiceSystemPolicyAppData`; "Session scoped auth is invalid for client"; AUTHREQ_PROMPTING subject Sub:{com.anthropic.claude-code}
- After Allow: AUTHREQ_RESULT authValue=2 authReason=2; TCCDEvent type=Create Bundle ID `com.anthropic.claude-code` — yet ~18 minutes later SAME version 2.1.258 prompts again with Session scoped auth is invalid
- Observed 4 prompts across 2 days, all on 2.1.258 (proves NOT only version-path churn)
- Kernel denials at startup (why prompt fires): Mail, Safari, AddressBook, CallHistoryDB, MobileSync, HomeKit, Messages, FaceTime, Suggestions, Weather, Containers
- Full Disk Access on `/Applications/Claude.app` does NOT help — responsible process is child `com.anthropic.claude-code` worker (consistent with #66216)
- Two independent bugs: (1) AppData grant stored session-scoped not persistent (child of Electron via disclaimer helper); (2) worker enumerates unrelated `~/Library` app-data at startup
- Suggested fixes in issue: stable persistently-authorizable identity OR stop startup enumeration; escape hatch env/config per #58952

Problem found: MACOS SYSTEMPOLICYAPPDATA PROMPT RECURS EVERY SESSION ON THE SAME VERSION BECAUSE THE DESKTOP-BUNDLED WORKER'S TCC GRANT IS STORED SESSION-SCOPED.

Why this solution: a diagnostic scorer for the lit → snuffed / tenured sconce chain, so a reader can pin idle lit, seed snuffed (#92784 path), and score session-scoped-auth-invalid / same-version-reprompt / startup-appdata-enumeration / fda-desktop-ineffective / child-worker-identity / cousins against the published facts.

## Why not a clone

This is specifically: **MACOS SYSTEMPOLICYAPPDATA PROMPT RECURS EVERY SESSION ON THE SAME VERSION — GRANT STORED SESSION-SCOPED (DESKTOP-BUNDLED WORKER).**

**NOT Clepsydra/#92776** (OTel main-loop meter — already shipped). Do not touch Clepsydra.

**NOT Letoff/#92771** (libuv Shift+Enter flatten — already shipped). Do not touch Letoff.

**NOT Ptybind/#92757** (Ctrl+G ConPTY editor input dead — already shipped). Do not touch Ptybind.

**NOT Dunnage/#92746** (RemoteTrigger list cursor). **NOT Setoff/#92750**. **NOT Espagnolette/#92694**. **NOT Imprimatur/#92740**. **NOT Byname/#92738**. **NOT Crenel/#92729**. **NOT Oubliette**. **NOT Ephemera**. **NOT Commutator**. **NOT Heddle**.

**NOT Portage/#92734** (teleport handoff — backup only). **NOT Clevis/#92769** (disable-model-invocation hides skills — backup only). **NOT Cadet/#92761** (worktree plugin first-row — backup only).

NOT a TCC exploit, not a live Claude session, not a payload, not a privacy-scanner clone.

Different paradigm: **desktop-bundled worker TCC AppData grant stored session-scoped; same version 2.1.258 re-prompts; cousins attribute this to version-path churn.**

Cousins cite-only (NOT primary): #63130 OPEN, #66216 CLOSED, #36832 CLOSED, #36675 CLOSED, #41297 CLOSED, #59608 CLOSED. Do not auto-pick as thesis.

Do NOT rename this product Clepsydra, Letoff, Ptybind, Dunnage, Setoff, Espagnolette, Imprimatur, or Byname.
Do NOT reuse idle dripping / chorded / piped / berthed / lean / attentive / waived / bricked / unrung / echoed / laden / deaf / shed / remounted / refused / imprinted / burning / granted / glowing.
Do NOT reuse seeded arrested / flattened / swallowed / echoed / laden / deaf / chorded / meshed / piped / unbound.

Different surface: session-scoped TCC AppData grant on the desktop-bundled child worker vs OTel mid-session meter / libuv Shift+Enter flatten / Ctrl+G ConPTY mux editor input race.

Product name stays **Rushlight**. Name/slug `rushlight` confirmed unused in catalog.json (220 products before this ship; Clepsydra is #220).

Different UI: iron sconce / rush pith candle / soot wall / amber wick / parchment ledger. Petrona / Manrope / IBM Plex Mono. NOT EB Garamond / Barlow / Source Code Pro (Clepsydra). NOT Lora / Plus Jakarta / Cousine (Letoff). NOT Newsreader / Karla (Ptybind). NOT Literata / Red Hat Text / Fira Code (Dunnage). NOT marble/teal water-clock. NOT piano cream/ebony. NOT CRT phosphor green. NOT stevedore wood. NOT letterpress ink. NOT locksmith brass.

Different verbs: Score snuffed, Admit tenured, Pin idle lit, Seed snuffed, Reset to lit, Load fixtures, Snuff the rush, Tenure the sconce.

Different idle: **lit**. Different seeded: **snuffed**. HOLD: **lit** / **tenured**. ALARM: **snuffed** / **session-scoped-auth-invalid** / **same-version-reprompt** / **startup-appdata-enumeration** / **fda-desktop-ineffective** / **child-worker-identity** / **cousins** / **has-clear-repro**.

## How to score

```bash
node --test projects/rushlight/hook/rushlight.test.mjs
node projects/rushlight/hook/rushlight.mjs projects/rushlight/data/92784.json
node projects/rushlight/hook/rushlight.mjs projects/rushlight/data/lit.json
echo '{"seed":"snuffed","snuffed":true}' | node projects/rushlight/hook/index.mjs
```

Open the living card at `projects/rushlight/index.html` (or the live path `/rushlight/`). Buttons: Score snuffed, Admit tenured, Pin idle lit, Seed snuffed, Load fixtures, Reset to lit. Snuff the rush. Tenure the sconce. Drop a fixture JSON or paste it. `?embed=1` hides chrome.

## Live path

- Path gate: https://hermes-playground-green.vercel.app/rushlight/
- Folder: `projects/rushlight/`
