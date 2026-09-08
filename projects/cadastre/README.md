# Cadastre

A **cadastral / land-registry surveyor's bench** — green baize desk, brass theodolite, cream parcel maps, iron map-weights, inked roll; Crimson Pro + Work Sans + Cousine — for a real Claude Code defect: **EVERY CHANGE TO `~/.claude.json` IS A WHOLE-FILE READ-MODIFY-WRITE BEHIND AN ADVISORY `mkdir` LOCK THAT IS ABANDONED AFTER A 15 S WAIT, STOLEN IF OLDER THAN 10 S, OR SKIPPED ON `mkdir` FAILURE — ALL AT `warn` ONLY — SO COMPETING DESKTOP/CLI WRITERS SILENTLY DROP EACH OTHER'S ENTRIES INCLUDING `hasTrustDialogAccepted`; TRUST PARCELS VANISH AND MUST BE REGRANTED.**

Primary:

- [anthropics/claude-code#92908](https://github.com/anthropics/claude-code/issues/92908) (OPEN, bug, has repro, platform:windows, area:core, area:permissions, data-loss). Title: `[BUG] Windows: `.claude.json` is saved as a whole-file read-modify-write behind a best-effort lock that is abandoned after 15 s — entries written by one process disappear again, trust flags included`. Windows 11 Enterprise 10.0.26200; Claude Desktop 1.46388.4 unchanged in 1.49585.0 (installed 2026-09-08 18:42); host CLI 2.1.260.

04:50 cadastre: a cadastral surveyor's bench that should keep workspace-trust parcels enrolled on the ~/.claude.json roll under a held stake; instead whole-file RMW writers abandon the mkdir lock after 15s, steal locks older than 10s, or write without it on mkdir failure — warn only — so hasTrustDialogAccepted parcels escheat and trust must be regranted; score escheated or admit enrolled.

Score escheated or admit enrolled.

Idle word: **enrolled** (HOLD: trust parcels stay on the roll under a held stake). #92908 path: **escheated**. Seeded loss: **regranted**. Never idle as-penned / rove / vaulted / cleared / armed / receipted / fused / remounted / paid. Never seed misbound / fouled / spilled / ukased / stripped / lost / dry / deaf.

**Cadastre** = the land-registry roll a surveyor keeps under a held stake. Workspace-trust parcels should stay enrolled on `~/.claude.json`. Instead concurrent whole-file writers abandon or steal the stake and parcels escheat.

- **enrolled** = IDLE: HOLD; trust parcels stay on the roll under a held stake
- **escheated** = #92908 path: lock abandoned/stolen → parcels vanish from the roll
- **regranted** = seeded loss: user must grant workspace trust again
- **timeout-write** = 15 s give-up then write without lock
- **steal-10s** = lock mtime > 10 s deleted and taken
- **eperm-skip** = mkdir EPERM → write without lock
- **taken-over** = release sees lock ino/birthtime changed; leaves it
- **warn-only** = nothing above warn; JSON stays valid; no user-visible error
- **eight-events** = 8 lock-integrity log lines 2026-08-25→2026-09-08
- **desktop-cli** = Desktop + host CLI both write the same file
- **334-keys** = 215.7 KB / 334 project keys on reporter machine
- **before-after** = 1.46388.4 lock bodies unchanged in 1.49585.0; trust written then gone

Verdicts: enrolled, escheated, regranted, timeout-write, steal-10s, eperm-skip, taken-over, warn-only, eight-events, desktop-cli, 334-keys, before-after.

This is a diagnostic scoring assay. Not an exploit. No live Claude sessions. No payloads. No secrets. No network to Anthropic. Score whether a trust parcel would sit **escheated** or already **enrolled**. Fixtures use the issue's published incident only.

Hypothesis only (NON-BINDING): classic lost-update RMW under a best-effort advisory lock that prefers availability over integrity. Invite verify against #92908 only. Do NOT implement a fix in anthropics/claude-code.

## Research brief

Sources:

- Primary: [anthropics/claude-code#92908](https://github.com/anthropics/claude-code/issues/92908)

What happened (from the issue body — do not invent):

- OPEN. Labels: bug, has repro, platform:windows, area:core, area:permissions, data-loss
- OS: Windows 11 Enterprise 10.0.26200
- Claude Desktop: code read in 1.46388.4; unchanged in 1.49585.0 (installed 2026-09-08 18:42)
- Host CLI: 2.1.260
- Workload: many parallel sessions across worktrees from the desktop app
- `~/.claude.json`: 215.7 KB, 334 project keys (2026-09-08)
- Lock constants: Bvn/QSn = 1e4 (10 s steal), Vvn/$Sn = 15e3 (15 s timeout); lock dir via mkdir mode 448
- In-process mutex only (`Rvn.runExclusive`); cross-process guard is advisory mkdir lock `Hvn`/`eCn`
- Three abandon paths: (1) wait >15 s → warn `Timed out waiting… writing without it` and proceed; (2) lock mtime >10 s → delete and take over; (3) mkdir non-EEXIST failure (e.g. EPERM) → warn `Cannot create… writing without it` and proceed
- Atomic write path (`Vr`: tmp + fsync + rename) — file stays valid JSON; content is lost, not corrupted
- Eight lock-integrity events in desktop logs: EPERM once (2026-08-25), timeouts on 08-25/09-03/09-06×2/09-08, taken-over on 09-04 and 09-06; newest timeout one hour after 1.49585.0 install
- No `Failed to save config` / `Failed to parse config` in those logs
- Trust keys written then gone; hand-added key with app closed did not survive seven minutes after reopen; reporter must re-grant workspace trust; dialog often skipped and session starts untrusted
- Competing writers: Desktop and host CLI both maintain `~/.claude.json`
- Reporter asks: do not write without the lock; raise/remove 10 s steal or refresh mtime; log the loss not just the lock

Problem found: A CADASTRAL ROLL THAT SHOULD KEEP TRUST PARCELS ENROLLED UNDER A HELD STAKE INSTEAD LETS CONCURRENT WHOLE-FILE WRITERS ABANDON/STEAL THE STAKE SO `hasTrustDialogAccepted` PARCELS ESCHEAT AND TRUST MUST BE REGRANTED.

Why this solution: a diagnostic cadastral surveyor's bench for the enrolled → escheated loss, so a reader can pin idle enrolled, load the #92908 escheated path, and score regranted / timeout-write / steal-10s / eperm-skip / taken-over / warn-only / eight-events / desktop-cli / 334-keys / before-after against the published facts.

## Why not a clone

This is specifically: **EVERY CHANGE TO `~/.claude.json` IS A WHOLE-FILE READ-MODIFY-WRITE BEHIND AN ADVISORY `mkdir` LOCK THAT IS ABANDONED AFTER 15 S, STOLEN IF OLDER THAN 10 S, OR SKIPPED ON `mkdir` FAILURE — WARN ONLY — SO TRUST PARCELS ESCHEAT.**

**NOT Rubric/#92855** (TUI ordered-list renumber — just shipped #230). Cite only. Do not touch Rubric.

**NOT Sheave/#92827** (queued `/Users` path as slash). Cite only. Do not touch Sheave.

**NOT Mailslot/#92839** (Keychain argv-fallback). Cite only. Do not touch Mailslot.

**NOT Ukase/#92833, Scabbard/#92820, Deadletter/#90049, Dryjoint/#92809.** Already shipped. Cite only. Do not touch.

**NOT Quill/#92788** (AskUserQuestion free-text discard — backup, do not ship). Cite only. Do not ship Quill.

**NOT Nullity/#92825** (cliSessionId nulled transcripts — backup, do not ship). Cite only. Do not ship Nullity.

**NOT #92872** (powershell Run button — backup, do not ship).

NOT Clobber, Hasp, Parity, or any existing catalog slug. Slug `cadastre` and name Cadastre were unused among 230 products.

NOT a clone of Claude Code. NOT a live patch to anthropics/claude-code. NOT an exploit. NOT a live Claude session.

Different paradigm: **a cadastral roll that should keep trust parcels enrolled under a held stake; instead concurrent whole-file writers abandon/steal the stake and parcels escheat.**

Do NOT rename this product Rubric, Sheave, Mailslot, Ukase, Scabbard, Deadletter, Dryjoint, Quill, Nullity, or any existing catalog slug.
Do NOT reuse idle as-penned / rove / vaulted / cleared / armed / receipted / fused / remounted / paid. Do NOT reuse seeded misbound / fouled / spilled / ukased / stripped / lost / dry / deaf.

Different surface: `~/.claude.json` whole-file RMW + advisory mkdir lock vs TUI ordered-list echo / mid-turn `/Users` slash hitch / Keychain argv-fallback.

Product name stays **Cadastre**. Name/slug `cadastre` confirmed unused in catalog.json (230 products before this ship; Rubric is #230).

Different UI: cadastral surveyor's bench / green baize desk / brass theodolite / cream parcel maps / iron map-weights / inked roll. Crimson Pro / Work Sans / Cousine. NOT Cardo + Figtree + Source Code Pro (Rubric). NOT Fraunces + Plus Jakarta + IBM Plex (Sheave). NOT Libre Bodoni + Karla (Mailslot). NOT Cinzel + Source Sans 3 (Ukase). NOT Cormorant Unicase + Sora (Scabbard). NOT Newsreader + Figtree (Deadletter). NOT a scriptorium, deck sheave, postal mailslot, imperial wax seal, or empty scabbard.

Different verbs: Score escheated, Admit enrolled, Pin idle enrolled, Load escheated, Load regranted, Reset to enrolled.

Different idle: **enrolled**. Different #92908 path: **escheated**. HOLD: **enrolled**. ALARM: **escheated** / **regranted** / **timeout-write** / **steal-10s** / **eperm-skip** / **taken-over** / **warn-only** / **eight-events** / **desktop-cli** / **334-keys** / **before-after**.

## How to score

Open the living card at `projects/cadastre/index.html` (or the live path `/cadastre/`). Buttons: Score escheated, Admit enrolled, Pin idle enrolled, Load escheated, Load regranted, Load fixtures, Reset to enrolled. Hang a survey chip. Drop a fixture JSON. Assay a lock path (held stake / 15 s timeout / 10 s steal / EPERM skip) to see enrolled parcels vs escheated lots. `?embed=1` hides chrome.

## Live path

- Path gate: https://hermes-playground-green.vercel.app/cadastre/
- Folder: `projects/cadastre/`
