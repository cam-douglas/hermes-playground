# Touchstone

A **Lydian-slab touchstone bench** — black stone, gold and copper purity rubs, extension chips, auth-header shape cards; Cinzel + Plus Jakarta Sans + IBM Plex Mono — for a real Claude Code defect: **WRITE/EDIT DENIED BY PERMISSION-VALIDATION WITH 401 "API KEY IS INVALID" — GATED PURELY BY FILE EXTENSION; ALSO DISABLES AUTO MODE; FIRES UNDER bypassPermissions; PRECEDES PreToolUse; DESKTOP CHILD SESSION ONLY (headless claude -p succeeds); AUTH-SHAPE MATCHES NON-EMPTY INVALID x-api-key.** When validation authenticates the way the main loop does (or a 401 routes to re-auth), the stone is **proved**.

Primary:

- [anthropics/claude-code#92599](https://github.com/anthropics/claude-code/issues/92599) (OPEN, bug, has repro, platform:windows, area:auth, area:permissions). Title: `Write/Edit denied by permission-validation with 401 "API key is invalid" — gated purely by file extension, and it also disables Auto mode (2.1.258)`. Filed 2026-09-07T05:40:11Z. Updated 2026-09-07T05:41:22Z. Reporter: gsegol11-ship-it. 0 comments.

15:50 touchstone: an assay stone that should prove script Write/Edit streaks but instead fouls them with a permission-rule 401 API key is invalid gated by extension (#92599). Score fouled or admit proved.

Idle word: **fouled** (ALARM: script/extension-less Write/Edit denied with permission-rule 401 "API key is invalid"; Auto mode dead; Desktop child session). Seeded state: **proved** / HOLD (validation authenticates correctly for script extensions; Auto mode works; PreToolUse can run). Never idle as razed, culled, sole, stripped, packed, overdraft, marked, cold, voided, banked, rewritten, thrashing, responsive, sealed, rebound, fenced, swept, armed, unheard, unbolted, snagged, tolled, mute, honored, discarded, belayed, veined, streaked, or tarnished.

**Touchstone** = black stone used to rub gold and read purity by color. Here permission-validation rubs Write/Edit targets by extension and fouls script-like rubs with a false "API key is invalid" 401 (wrong credential shape), also disabling Auto mode.

- **fouled** = IDLE: script/extension-less Write/Edit denied with permission-rule 401
- **proved** = seeded word: validation authenticates for script extensions; Auto mode works
- **extension-gate** = script fail vs content pass; `.json` passes, `.jsonl` fails
- **false-401** = message matches invalid x-api-key class; `request_id` null; `toolDenialKind` permission-rule
- **auto-disabled** = Auto approval depends on the same failing validation
- **precedes-pretooluse** = script 401 before PreToolUse; pass targets then stopped by the hook
- **desktop-session-only** = Desktop child fails; headless `claude -p` writes `.mjs`
- **bypass-permissions** = still fires under `bypassPermissions`
- **auth-shape** = seven `/v1/messages` shapes; failing write matches non-empty invalid `x-api-key`
- **cousins** = cite-only #92518 / #92582
- **has-clear-repro** = labeled has repro; 14-target one-turn gate; 36/16/36 census

Verdicts: fouled, proved, extension-gate, false-401, auto-disabled, precedes-pretooluse, desktop-session-only, bypass-permissions, auth-shape, cousins, has-clear-repro.

This is a diagnostic scoring assay. Not an exploit. No live Claude sessions. No payloads. No secrets. Score whether an extension-gated permission-rule 401 would leave the stone **fouled** or already **proved**. Fixtures use the issue's error, extension lists, auth-header classes, and Desktop-vs-headless discriminator only.

Hypothesis only (NON-BINDING): validation may place the OAuth access token into `x-api-key` instead of `Authorization: Bearer`. Encoded from the issue body only. Do not claim a root cause in Claude Code source you have not seen.

A second separable defect in the same issue (README cite only, not the idle path): a failed OAuth refresh wipes still-valid credentials when `ANTHROPIC_BASE_URL` is non-canonical.

## Research brief

Sources:

- Primary: [anthropics/claude-code#92599](https://github.com/anthropics/claude-code/issues/92599)
- Cousins cite-only (NOT primary):
  - [anthropics/claude-code#92518](https://github.com/anthropics/claude-code/issues/92518) — Catachresis: MCP `insufficient_scope` mislabeled as token expired
  - [anthropics/claude-code#92582](https://github.com/anthropics/claude-code/issues/92582) — Chock: `blockReadsOutsideWorkingDirectories` ignores project/local `additionalDirectories`

What happened (from the issue body — do not invent):

- Claude Code 2.1.258 bundled in Claude Desktop 1.44121.4.0 (MSIX), Windows 11 Pro 26200; Claude Max OAuth; no `ANTHROPIC_API_KEY` in Process/User/Machine; delegated child session `CLAUDE_CODE_CHILD_SESSION=1`, `CLAUDE_CODE_ENTRYPOINT=claude-desktop`
- Built-in Write/Edit denied by permission-validation with:
  `Error during validation: Failed to authenticate. API Error: 401 {"type":"error","error":{"type":"authentication_error","message":"API key is invalid."},"request_id":null}`
- Transcript: `toolDenialKind: "permission-rule"`, `request_id: null`
- Extension gate (identical body, scratchpad dir): FAIL every time `.mjs` `.cjs` `.js` `.ts` `.py` `.ps1` `.sh` `.bat` `.jsonl`, extension-less; PASS `.md` `.txt` `.json` `.html` `.yaml`. `.json` passes while `.jsonl` fails; `.gitignore` fails — not "is executable", behaves like an allowlist of known-safe extensions
- Auth-shape evidence (local logging proxy, seven `/v1/messages` shapes): non-empty invalid `x-api-key` → exactly `API key is invalid.` ← matches failing write; missing/empty `x-api-key` → `x-api-key header is required`; Bearer invalid/empty → `Invalid bearer token`
- Additional measured facts: (1) fires under `bypassPermissions`; (2) precedes PreToolUse hooks; (3) disables Auto mode; (4) error string `Error during validation` not in `claude.exe` 2.1.258 or Desktop `app.asar` (controlled negative); (5) same account+binary succeeds via headless `claude -p` writing `.mjs`; (6) 36 denials / 16 sessions / 36 hours on one machine; 0 landed on content-type targets
- Impact: writes pushed to shell fallbacks that bypass PreToolUse policy; harness advises Bash instead of Write/Edit while Auto mode is active
- Binary strings note a mid-turn classifier config adjacent to auth-failure matchers; `CLAUDE_PREVIEW_CLASSIFIER_FLOOR=1` and `CLAUDE_CODE_CLASSIFIER_SUMMARY=0` set in the Desktop session env

Problem found: permission-validation denies script-like Write/Edit with a 401 whose message matches a non-empty invalid `x-api-key`, selected purely by file extension, and the same failure disables Auto mode.

Why this solution: a diagnostic scorer for the fouled → proved touchstone chain, so a reader can admit idle fouled, pin seeded proved, and score extension-gate / false-401 / auto-disabled / precedes-pretooluse / desktop-session-only / bypass-permissions / auth-shape / cousins against the published facts.

## Why not a clone

This is specifically: **WRITE/EDIT DENIED BY PERMISSION-VALIDATION WITH 401 "API KEY IS INVALID" — GATED PURELY BY FILE EXTENSION; ALSO DISABLES AUTO MODE; FIRES UNDER bypassPermissions; PRECEDES PreToolUse; DESKTOP CHILD SESSION ONLY (headless claude -p succeeds); AUTH-SHAPE MATCHES NON-EMPTY INVALID x-api-key.**

**NOT Bitts #92573** (worktree pool slot recycle mid-session data-loss).

**NOT Seizing #92586** (EDR nlink hard-link false-trigger Bash kill).

**NOT Gland / Larum / Cringle / Kerf / Demurrage / Scarph / Plimsoll / Diopter / Decant / Catachresis paradigms.**

**NOT Catachresis #92518** (cite-only cousin: MCP `insufficient_scope` mislabeled as token expired).

**NOT Chock #92582** (cite-only cousin: `blockReadsOutsideWorkingDirectories` ignores project/local `additionalDirectories`).

Stay OFF leftover woodworking / mm-slider / assay / cupel / stencil desks / dockside bitts / bosun seizing yarn / kerf-gauge / scarph joint / wine cellar / lexicographer stamp.

Cousins cite-only (NOT primary): #92518, #92582.

Do NOT name this after prior paradigm desks.
Do NOT reuse idle razed / culled / sole / stripped / packed / overdraft / marked / cold / voided / banked / rewritten / thrashing / responsive / sealed / rebound / fenced / swept / armed / unheard / unbolted / snagged / tolled / mute / honored / discarded / belayed / veined / streaked / tarnished.

Different surface: extension-gated permission-validation 401 vs worktree-pool-physical-directory-recycle / EDR nlink identity kill / isolation-collar hook strip / written-notice-with-no-turn / deny unwrap / Remove-Item path rive / daemon overstay / Windows `-c` shear.

Product name stays **Touchstone**. Name/slug `touchstone` confirmed unused in catalog.json (198 products).

Different UI: black Lydian slab / gold-copper purity rubs / extension chips / auth-header shape cards / dark bench. Cinzel / Plus Jakarta Sans / IBM Plex Mono. NOT Libre Bodoni/Nunito/Source Code Pro (Bitts). NOT Libre Caslon/Sora/Inconsolata (Seizing). NOT Lora/Martian Mono (Gland). NOT Fraunces/Manrope (Catachresis). NOT Cormorant/Outfit (Scarph). NOT Libre Baskerville/DM Sans (Kerf). NOT Spectral/Karla (Decant).

Different verbs: Score the touchstone, Pin idle fouled, Pin seeded proved, Admit proved, Load fixtures, Reset to proved.

Different idle: **fouled**. Different seeded: **proved**. HOLD: **proved**. ALARM: **fouled** / **extension-gate** / **false-401** / **auto-disabled** / **precedes-pretooluse** / **desktop-session-only** / **bypass-permissions** / **auth-shape** / **cousins** / **has-clear-repro**.

## How to score

```bash
node --test projects/touchstone/hook/touchstone.test.mjs
node projects/touchstone/hook/index.mjs projects/touchstone/data/92599.json
echo '{"seed":"proved","proved":true}' | node projects/touchstone/hook/index.mjs
```

Open the living desk at `projects/touchstone/index.html` (or the live path). Buttons: Score the touchstone, Pin idle fouled, Pin seeded proved, Admit proved, Load fixtures, Reset to proved. Drop a fixture JSON or paste it. `?embed=1` hides chrome.

## Live path

- Path gate: https://hermes-playground-green.vercel.app/touchstone/
- Subdomain: https://touchstone.hermes-playground-green.vercel.app
- Folder: `projects/touchstone/`
