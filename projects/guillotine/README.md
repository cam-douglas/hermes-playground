# Guillotine

A **scaffold / guillotine booth** — dark oak platform, steel uprights, crimson rope, pale chalk floor; fonts **Spectral** (display) + **Public Sans** (body) + **Cousine** (mono) — for a real Claude Code defect: **BACKGROUND-MODE PERMISSION DIALOG SHOWS ONLY A DENY BUTTON, NO WAY TO ACCEPT.**

Primary:

- [anthropics/claude-code#92974](https://github.com/anthropics/claude-code/issues/92974) (OPEN, bug, platform:macos, area:agents, area:permissions). Title: `[BUG] background-mode permission dialog shows only a Deny button, no way to Accept`. Authored 2026-09-09T02:33:12Z by hommeboy. Claude Code 2.1.247, macOS. Scheduled task where Claude sends a group-chat message; Messages permission card is Deny-only. Regression: had worked before. Auto-allow and prior approvals already set. Hang lasted hours. Windows comment (dnhonjo-design, 2026-09-09T07:36:33Z): Claude Desktop Cowork `computer_request_access` shows an unchecked checkbox that cannot be clicked, and only Deny — no Accept. Two PCs / two accounts.

19:50 guillotine: a scaffold / guillotine booth that should keep the permission blade **raised** (Accept + Deny); instead the blade has **fallen** — Deny-only (and on Windows an unclickable unchecked checkbox) so background-mode / Cowork grants cannot be given — score fallen or admit raised.

Score fallen or admit raised.

Idle word: **raised** (HOLD: Accept + Deny both available). Seeded word: **fallen** / #92974 (Deny-only; no Accept). Path word: **scaffold**. Never idle lodged / bypassed / cutaway / sterling / debased / rubbed / primed / flashed / flashpanned / unshorn / sheared / secateured / emended / unretracted / palinoded / ephemeral / voided / fouled / cold / banked / ferruled / interlocked / passable / admitted / deeded / parked.

Phrase: **a permission scaffold that offers only Deny is not raised — the blade has already fallen. Score fallen or admit raised.**

- **raised** = IDLE: HOLD; Accept + Deny both available so the operator can grant
- **fallen** = #92974 seeded path: Deny-only; no Accept; hang waiting on an approval that cannot be given
- **scaffold** = path word: the permission scaffold whose blade has already fallen
- **deny-only** = card shows Deny (⌘.) and no Accept / Allow / Grant
- **accept-missing** = grant path missing an Accept action
- **checkbox-dead** = Windows `computer_request_access` unchecked checkbox cannot be clicked
- **mac-messages-perm** = scheduled group-chat Messages permission Deny-only
- **win-computer-request** = Windows Desktop Cowork `computer_request_access` Deny-only
- **auto-allow-ignored** = auto-allow and prior approvals already set; still Deny-only
- **has-repro** = macOS 2.1.247 + Windows two PCs / two accounts
- **hold** = HOLD alias for idle raised
- **cousins** = cite-only #93048 #76718 — do not clone
- **fixtures** = row list for the guillotine booth
- **walk** = published idle raised → mac Messages → deny-only → auto-allow ignored → Windows → checkbox-dead → hang → scaffold

Verdicts: raised, fallen, scaffold, hold, deny-only, accept-missing, checkbox-dead, mac-messages-perm, win-computer-request, auto-allow-ignored, has-repro, cousins, fixtures, chips, fingerprints, walk.

This is a diagnostic scoring scaffold. Not an exploit. No live Claude sessions. No payloads. No network to Anthropic required for scoring. Score whether the blade is **fallen** or already **raised**. Fixtures use the issue's published incident only. Do NOT implement a fix in anthropics/claude-code.

Hypothesis only (NON-BINDING): background-mode permission UI may render a Deny-only card when the grant path for messages/computer_request_access is missing an Accept action / dead checkbox, leaving the session blocked. Invite verify against #92974 text only. Do not claim a root cause in Claude Code source you have not seen.

## Research brief

Sources:

- Primary: [anthropics/claude-code#92974](https://github.com/anthropics/claude-code/issues/92974)
- Cite-only: [anthropics/claude-code#93048](https://github.com/anthropics/claude-code/issues/93048) (mouse cursor invisible inside folder access permission dialog — Desktop Windows)
- Cite-only: [anthropics/claude-code#76718](https://github.com/anthropics/claude-code/issues/76718) (closed; compound-command permission prompting)

What happened (from the issue body and one Windows comment — do not invent):

- OPEN. Labels: bug, platform:macos, area:agents, area:permissions
- Author hommeboy. Filed 2026-09-09T02:33:12Z
- Claude Code 2.1.247, macOS, Sonnet (default)
- Testing a scheduled task where Claude sends a group-chat message
- Permission request for Messages shows Deny only, no Accept
- Had worked before (regression)
- Auto-allow and prior approvals already set
- Hang lasted hours waiting on an undenyable dialog (group-chat check sat ~3 hours)
- Expected: an approve button so permissions can be granted
- Comment (dnhonjo-design, 2026-09-09T07:36:33Z): same on Windows Claude Desktop Cowork — `computer_request_access` shows app listed, unchecked checkbox that cannot be clicked, only Deny, no Accept. Two PCs / two accounts

Problem found: A PERMISSION SCAFFOLD THAT OFFERS ONLY DENY IS NOT RAISED — THE BLADE HAS ALREADY FALLEN.

Why this solution: a diagnostic scaffold / guillotine booth for the raised → fallen drift, so a reader can pin idle raised, load the #92974 fallen path, and score scaffold / deny-only / checkbox-dead / mac Messages / Windows Cowork against the published facts.

## Why not a clone

This is specifically: **BACKGROUND-MODE PERMISSION DIALOG SHOWS ONLY A DENY BUTTON, NO WAY TO ACCEPT.**

**NOT Entresol/#93010** (parent CLAUDE.md skipped for a worktree of that parent's repository). Different paradigm.

**NOT Hallmark/#93021** (resume loses `[1m]` on non-first-party `BASE_URL`). Different paradigm.

**NOT Flashpan/#93015** (`lastRunAt` stamps without a session birth). Different paradigm.

**NOT Secateurs/#92979** (Read silent partial of large instruction/rule files). Different paradigm.

**NOT Palinode/#92998** (MEMORY.md bottom truncation of newest corrections). Different paradigm.

**NOT Ferrule/#92968** / Interlock / Homestead / Shibboleth / Greenroom/#92988 / #93012 / #93004 / #92987 / #92982 / Quill/#92788 / Colophon/#92918 / Sallyport/#92901.

**NOT leftover woodworking / mm-slider / clones.**

NOT a clone of Claude Code. NOT a live patch to anthropics/claude-code. NOT an exploit. NOT a live Claude session. No live Anthropic network required for scoring.

Different paradigm: **a background-mode / Cowork permission card that should keep Accept + Deny both available instead shows only Deny (and on Windows a dead unchecked checkbox), so the grant cannot be given.**

Do NOT rename this product Entresol, Hallmark, Flashpan, Secateurs, Palinode, Ferrule, Interlock, Greenroom, or any existing catalog slug.
Do NOT reuse idle raised / fallen / scaffold on a later ship.
Do NOT reuse Cinzel (Hallmark display). Do NOT reuse Figtree (Secateurs body). Do NOT reuse Playfair Display + Outfit + Space Mono (Entresol). Do NOT reuse Lato + Fira Code (Hallmark body/mono). Do NOT reuse Newsreader + Manrope + JetBrains Mono (Flashpan). Do NOT reuse Bitter + Roboto Mono (Secateurs display/mono). Do NOT reuse Cardo + Nunito Sans (Palinode). Do NOT reuse Oswald + Source Sans 3 (Ferrule).

Different surface: Deny-only background-mode / Cowork permission dialog vs parent-directory memory skip / resume `[1m]` / scheduled-task `lastRunAt` / Read silent partial / MEMORY.md write-path bottom truncation.

Product name stays **Guillotine**. Name/slug `guillotine` unused in catalog.json (245 products before this ship; Entresol is #245).

Different UI: scaffold / guillotine booth / dark oak platform / steel uprights / crimson rope / pale chalk floor. Spectral / Public Sans / Cousine. NOT gallery mezzanine. NOT silversmith assay. NOT flintlock flash-pan. NOT garden pruning bench. NOT scriptorium wax/vellum.

Different verbs: Walk the scaffold, Pin idle raised, Pin seeded fallen, Admit raised, Load deny-only, Reset to raised.

Different idle: **raised**. Different #92974 seeded path: **fallen**. HOLD: **raised**. ALARM: **fallen** / **scaffold** / **deny-only** / **accept-missing** / **checkbox-dead**. Path: **scaffold**.

## How to score

```bash
node --test projects/guillotine/guillotine.test.mjs
node projects/guillotine/guillotine.mjs projects/guillotine/data/92974.json
node projects/guillotine/guillotine.mjs projects/guillotine/data/raised.json
echo '{"seed":"fallen"}' | node projects/guillotine/guillotine.mjs
```

Open the living card at `projects/guillotine/index.html` (or the live path `/guillotine/`). Buttons: Walk the scaffold, Pin idle raised, Pin seeded fallen, Admit raised, Load deny-only, Reset to raised. Toggle Accept available / Deny available / checkbox clickable — the score flips. Drop a fixture JSON. `?embed=1` hides chrome.

The seeded/fallen faceplate reconstructs the reporter’s Deny-only Messages card from the published #92974 screenshot. This page did not run Claude live.

## Live path

- Path gate: https://hermes-playground-green.vercel.app/guillotine/
- Folder: `projects/guillotine/`
