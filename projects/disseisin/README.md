# Disseisin

A **court-of-novel-disseisin / freehold manor-roll / writ-of-entry booth** — tenement, manor roll, bronze wafer, ghost deed, clerk docket. Fonts **Crimson Pro** (serif) + **Red Hat Text** (sans) + **Ubuntu Mono** (mono). Palette: manor roll — cream `#F7E8C8`, oak `#2F2418`, sienna `#7A3A28`, moss `#4E6B4F`, bronze `#C48A3A`, slate `#1E2A24` — freehold court, NOT manuscript flashback, NOT sanctuary gilt, NOT cloister dusk, NOT vault steel, NOT bill-of-attainder wax.

Disseisin is a legal wrongful dispossession of freehold: the session domicile evaporates, yet the roll still claims seisin.

Primary:

- [anthropics/claude-code#93574](https://github.com/anthropics/claude-code/issues/93574) (OPEN, bug, has repro, platform:macos, area:cowork). Title: `[BUG] Cowork loses a session's home directory on VM restart, and the connected folder goes with it`. Claude desktop with SDK binary **2.1.260**. Cowork. macOS 26 (Darwin 24.6.0). A Cowork session's home inside the VM does not survive a VM restart. When it goes, the connected folder goes with it, and the app asks to add the folder again in the middle of a task. From `~/Library/Logs/Claude/coworkd.log`: `[process] user rcw-01toqkmz1tbremcwdforbzyz should exist but doesn't, attempting recovery from home directory` then `[process] recovery failed for user rcw-01toqkmz1tbremcwdforbzyz (home directory /sessions/rcw-01toqkmz1tbremcwdforbzyz does not exist)`. That pair appears 30 times across 14 days between 27 April and 10 September 2026, aligned with VM starts. Host disk-low on 10 September was cleared and ruled out. Cousins cite-only: #24483 #24190 #24549 (closed without a named fix).

19:50 disseisin: a court-of-novel-disseisin / freehold manor-roll booth for #93574. Idle **seised** / seeded **disseised** / path **home-evaporated**. Score disseisin or admit seised.

Score disseisin or admit seised.

Idle word: **seised** (HOLD: home intact after restart). Seeded word: **disseised** / #93574 (VM home gone; ghost connected folder). Path word: **home-evaporated**. Product score: **disseisin**. Never idle ordered / viewed / closed / sealed or seeded redelivered / withheld / lingering / blanked.

Phrase: **Score disseisin or admit seised.**

- **seised** = IDLE: HOLD; session home survives a VM restart
- **disseised** = #93574 seeded path: `/sessions/<rcw-…>` gone; folder still shown connected
- **disseisin** = product score word for wrongful dispossession of the session domicile
- **home-evaporated** = path word: the tenement under `/sessions/<rcw-…>` did not survive
- **hold** = HOLD alias for idle seised
- **home-intact** = session home survived the VM restart
- **sessions-void** = home directory `/sessions/rcw-01toqkmz1tbremcwdforbzyz` does not exist
- **recovery-failed** = recovery attempted from home directory, then failed
- **ghost-connected** = UI still presents the folder as connected
- **tool-calls-fail** = every tool call fails; app asks to add the folder again mid-task
- **vm-restart** = quit the desktop app, or let the VM restart; days align with VM starts
- **pair-thirty** = recovery pair appears 30 times
- **fourteen-days** = span 27 April to 10 September 2026
- **disk-low-ruled-out** = host disk-low on 10 September cleared; ruled out
- **rcw-user** = `rcw-01toqkmz1tbremcwdforbzyz`
- **coworkd-log** = `~/Library/Logs/Claude/coworkd.log`
- **folder-lost** = when the home goes, the connected folder goes with it
- **admit-gone** = desired: the app says the session is gone
- **clean-reconnect** = desired: offer to start a new session with the same folder
- **has-repro** = published shape: Cowork, VM restart, `/sessions/<rcw-…>` gone, ghost folder
- **cousins** = cite-only #24483 #24190 #24549 — do not rebuild
- **backups** = cite-only #93576 #93553 #93546 #93530 #93556 #93570 #93588 — do not auto-pick
- **fixtures** = tenement / roll / writ / ghost / docket table for the disseisin booth
- **walk** = published idle seised → folder-connected → vm-restart → sessions-void → recovery-failed → ghost-connected → tool-calls-fail → pair-thirty → disk-low-ruled-out → home-evaporated → disseisin

Verdicts: seised, disseised, disseisin, home-evaporated, hold, home-intact, sessions-void, recovery-failed, ghost-connected, tool-calls-fail, vm-restart, pair-thirty, fourteen-days, disk-low-ruled-out, rcw-user, coworkd-log, folder-lost, admit-gone, clean-reconnect, has-repro, cousins, backups, fixtures, chips, fingerprints, walk.

This is a diagnostic scoring booth. Not an exploit. No live Claude sessions. No secrets. No network to Anthropic required for scoring. Score whether the manor is **disseised** / **disseisin** or already **seised**. Fixtures use the issue's published incident only. Do NOT implement a fix in anthropics/claude-code.

Hypothesis only (NON-BINDING): recovery looks for `/sessions/<rcw-…>` after VM restart and fails when the VM filesystem was ephemeral; UI keeps the folder binding anyway. Invite verify against #93574 text only. Do not claim a root cause in Claude Code source you have not seen.

## Research brief

Sources:

- Primary: [anthropics/claude-code#93574](https://github.com/anthropics/claude-code/issues/93574)
- Cite-only cousin: [anthropics/claude-code#24483](https://github.com/anthropics/claude-code/issues/24483) (same fault family; closed without a named fix)
- Cite-only cousin: [anthropics/claude-code#24190](https://github.com/anthropics/claude-code/issues/24190) (same fault family; closed without a named fix)
- Cite-only cousin: [anthropics/claude-code#24549](https://github.com/anthropics/claude-code/issues/24549) (same fault family; closed for inactivity)
- Backup (data only): #93576 #93553 #93546 #93530 #93556 #93570 #93588

What happened (from the issue text — do not invent):

- OPEN. Labels: bug, has repro, platform:macos, area:cowork.
- Claude desktop SDK **2.1.260**; Cowork; macOS 26 (Darwin 24.6.0)
- Session home inside the VM does not survive a VM restart
- When the home goes, the connected folder goes with it
- UI still presents the folder as connected; every tool call fails
- Recovery pair in `coworkd.log` for `rcw-01toqkmz1tbremcwdforbzyz` / `/sessions/rcw-01toqkmz1tbremcwdforbzyz`
- Pair appears 30 times across 14 days (27 April–10 September 2026), aligned with VM starts
- Host disk-low on 10 September cleared and ruled out
- Tried: restarting the Mac, clearing disk, removing the folder's second entry, seven mails to support since 6 September

Problem found: COWORK SESSION HOME UNDER `/sessions/<rcw-…>` EVAPORATES ON VM RESTART → connected folder becomes a ghost binding; recovery fails; tools fail.

Why this solution: a living catalog page + small node diagnostic that encodes the defect as idle/seeded/path verdicts so operators can score whether the manor stayed **seised** or was **disseised**. Educational manor court for the catalog. Not a Claude Code fix.

Desired (from the issue, scoring narrative only — DO NOT implement a Claude Code fix):

1. A session's home under `/sessions/` survives a VM restart
2. OR the app says the session is gone and offers to start a new one with the same folder
3. Not a ghost connected folder while every tool call fails

## Why not a clone

This is specifically: **COWORK SESSION HOME UNDER `/sessions/<rcw-…>` EVAPORATES ON VM RESTART → ghost connected folder.**

**NOT Analepsis/#93569** (Desktop feed redelivery behind `background_tasks_redelivered`). Different defect. NOT manuscript flashback.

**NOT Monstrance/#93563** (Artifact read binds withdrawn native WebFetch). NOT sanctuary gilt/crimson.

**NOT Compline/#93549** (remote-control bridge never sends `end_session`). NOT cloister dusk.

**NOT Cipherlock/#93537** (concurrent Keychain MCP OAuth wipe). NOT vault/brass dial.

**NOT Attainder/#93529** (parked-permission false user-rejected). NOT bill-of-attainder wax.

**NOT Homestead.** **NOT Oubliette.** **NOT Pontoon** — prior homestead/oubliette/pontoon paradigms. Different surface.

**NOT #24483/#24190/#24549** — same fault family, closed without a named fix. Cite only; this booth is the published #93574 walk.

Do NOT rename Disseisin to any existing catalog slug. Catalog currently has 290 products; Disseisin is #291.
Do NOT reuse idle ordered / viewed / closed / sealed, or seeded redelivered / withheld / lingering / blanked.
Display here is **Crimson Pro**. Body is **Red Hat Text**. Mono is **Ubuntu Mono**.

Different surface: Cowork VM-home evaporation vs Desktop Code-tab feed redelivery vs Cowork Artifact native-WebFetch bind vs routine `end_session` leak vs concurrent Keychain wipe vs parked-permission false user-rejected.

Different UI: tenement / manor roll / writ of novel disseisin / ghost deed / clerk docket. Crimson Pro / Red Hat Text / Ubuntu Mono. Manor roll. NOT vellum dusk. NOT sanctuary night. NOT cloister dusk. NOT bank vault. NOT bill-of-attainder court.

Different verbs: Call the roll, Score disseisin, Issue the writ, Compare seised / disseised, Pin idle seised, Pin seeded disseised, Pin home-evaporated, Restore the freehold.

Different idle: **seised**. Different #93574 seeded path: **disseised**. HOLD: **seised** / **hold**. ALARM: **disseised** / **disseisin** / **home-evaporated** / **sessions-void**. Path: **home-evaporated**.

## How to score

```bash
node --test projects/disseisin/disseisin.test.mjs
node projects/disseisin/disseisin.mjs projects/disseisin/data/disseised.json
echo '{"seed":"disseised"}' | node projects/disseisin/disseisin.mjs
```

Open the living card at `projects/disseisin/index.html` (or the live path `/disseisin/`). Buttons: Call the roll, Score disseisin, Issue the writ, Compare seised / disseised, Pin idle seised, Pin seeded disseised, Pin home-evaporated, Restore the freehold. Toggle chips for: home intact, sessions void, recovery failed, ghost connected, tool calls fail, VM restart, pair thirty, disk-low ruled out — the score flips. Lay a fixture JSON on the manor roll. `?embed=1` hides chrome.

The booth reconstructs the reporter’s disseised walk from the published #93574 text. This page did not run Claude live.

## Live path

- Path gate: https://hermes-playground-green.vercel.app/disseisin/
- Folder: `projects/disseisin/`
