# Bitts

A **dockside mooring bitts atelier** — twin iron posts, oak wharf planks, hemp warps, tidal pool-slot board, rust / salt / iron on dark wharf ground; Libre Bodoni + Nunito + Source Code Pro — for a real Claude Code defect: **WORKTREE POOL PHYSICAL DIRECTORY UNDER `.claude/worktrees/*` APPEARS REUSED/RESET WHILE A SESSION IS STILL ACTIVE → MASS FILE LOSS (DATA-LOSS); REFLOG SHOWS ≥3 UNRELATED BRANCHES + reset to origin/main + DETACHED UNRELATED HEAD; HOST REAPERS keep:active AND NEVER TOUCHED IT; PRIOR 2026-08-14 amazing-colden-f035e5.** When the slot stays assigned to the live session and the tree is intact (**belayed**), that is the hold path.

Primary:

- [anthropics/claude-code#92573](https://github.com/anthropics/claude-code/issues/92573) (OPEN, bug, has repro, area:agents, data-loss). Title: `.claude/worktrees/* pool: worktree slot appears reused/reset while a session is still active, causing mass file loss mid-session`. Filed 2026-09-07T00:57:35Z. Updated 2026-09-07T00:58:45Z. Reporter: capfininv. 0 comments.

14:50 bitts: a bitts that hot-bunks a live warp is not a hold. Score razed or admit belayed.

Idle word: **razed** (ALARM: pool slot recycled mid-session; mass unstaged deletions; reflog churn / reset to origin/main / detached unrelated HEAD). Seeded state: **belayed** / HOLD (slot stays assigned to live session; keep:active honored; no mid-session recycle; tree intact). Never idle as culled, sole, stripped, packed, overdraft, marked, cold, voided, banked, rewritten, thrashing, responsive, sealed, rebound, fenced, swept, armed, unheard, unbolted, snagged, tolled, mute, honored, or discarded.

**Bitts** = the twin iron posts a warp is belayed to. Claude Code appears to hot-bunk a live `.claude/worktrees/<name>` slot, so the original session finds the tree razed.

- **razed** = IDLE: pool slot recycled mid-session; ~5,900 tracked files vanish as unstaged deletions
- **belayed** = seeded word: slot stays assigned to the live session; tree intact
- **slot-recycle** = physical `.claude/worktrees/<name>` reassigned while the session is still using it
- **reflog-churn** = ≥3 unrelated branches in one day; `reset: moving to origin/main`; detached unrelated HEAD
- **keep-active** = host reapers classified `keep:active` / never touched it
- **mass-deletions** = `git status --short` thousands of unstaged deletions (`.githooks/*`, most of `tools/*`, `.gemini/commands/*`, `.cursor/rules/*`)
- **cousins** = cite-only #87349 / #73900 / #92019
- **hold** = hold path: keep:active honored; no mid-session recycle
- **has-clear-repro** = labeled has repro + data-loss; prior 2026-08-14 `amazing-colden-f035e5`

Verdicts: razed, belayed, slot-recycle, reflog-churn, keep-active, mass-deletions, cousins, hold, has-clear-repro.

This is a diagnostic scoring assay. Not an exploit. No live Claude sessions. No payloads. No secrets. Score whether a recycled pool slot would leave the bitts **razed** or already **belayed**. Fixtures use the issue's isolation call, pool path, mass deletions, reaper audit, and reflog only.

Hypothesis only (NON-BINDING): harness worktree pool may reassign physical `.claude/worktrees/<name>` slots for new Agent(isolation:worktree) dispatches without checking whether a live session still holds that directory; host-side keep:active guards cannot see that recycle. Do not claim a root cause in Claude Code source you have not seen.

## Research brief

Sources:

- Primary: [anthropics/claude-code#92573](https://github.com/anthropics/claude-code/issues/92573)
- Cousins cite-only (NOT primary):
  - [anthropics/claude-code#87349](https://github.com/anthropics/claude-code/issues/87349) — pin-race: isolation guard validates against another session's worktree
  - [anthropics/claude-code#73900](https://github.com/anthropics/claude-code/issues/73900) — `archive_session("self")` deletes the worktree then resumes onto it
  - [anthropics/claude-code#92019](https://github.com/anthropics/claude-code/issues/92019) — Windows `checkout.workers=8` worktree create failure

What happened (from the issue body — do not invent):

- Worktree created via `Agent(isolation: "worktree")` under `.claude/worktrees/<name>`
- ~5,900 tracked files vanished mid-session; `git status --short` showed thousands of unstaged deletions (`.githooks/*`, most of `tools/*`, `.gemini/commands/*`, `.cursor/rules/*`)
- Session was actively editing; had run no destructive command (no `rm`, `git clean`, or `git checkout`) prior to discovery
- Host repo-side reaper/cleanup tooling ruled out: two worktree-reaping tools classified the worktree as `keep:active` / never touched it (audit logs)
- `git reflog` for that worktree directory: slot cycling through **at least three unrelated branches within one day**, including `reset: moving to origin/main`, ending in detached HEAD on a commit unrelated to the reporting session
- Strong evidence the physical directory was reassigned/reset for a different task while the original session was still using it
- Repeat of similar 2026-08-14 incident (worktree `amazing-colden-f035e5` destroyed mid-session under a freshly-dispatched subagent)
- Host tooling added a liveness guard that only protects the repo's *own* reaper — no visibility into harness recycling/reset of `.claude/worktrees/*` pool slots for new dispatches

Problem found: a worktree pool physical directory under `.claude/worktrees/*` appears reused/reset while a session is still active, causing mass file loss.

Why this solution: a diagnostic scorer for the razed → belayed bitts chain, so a reader can admit idle razed, pin seeded belayed, and score slot-recycle / reflog-churn / keep-active / mass-deletions / cousins against the published facts.

## Why not a clone

This is specifically: **WORKTREE POOL PHYSICAL DIRECTORY UNDER `.claude/worktrees/*` APPEARS REUSED/RESET WHILE A SESSION IS STILL ACTIVE → MASS FILE LOSS (DATA-LOSS); REFLOG SHOWS ≥3 UNRELATED BRANCHES + reset to origin/main + DETACHED UNRELATED HEAD; HOST REAPERS keep:active AND NEVER TOUCHED IT; PRIOR 2026-08-14 amazing-colden-f035e5.**

**NOT Gland #92533** — any Bash `tool.call` function-hook strips `Agent(isolation:"worktree")` so every `pwd` refused with `context_lost` — isolation collar, NOT pool directory recycle.

**NOT Seizing #92586** — EDR transient hard-link nlink spike false-triggers Bash output-file identity check → SIGKILL ~5s exit 137.

**NOT Larum #92563 / Cringle #92542 / Kerf #92539 / Demurrage #92548 / Scarph #92543 / Plimsoll #92434 / Diopter #92524 / Decant #92515.**

**NOT #87349** (pin-race: isolation guard validates against another session's worktree — cite-only cousin).

**NOT #73900** (`archive_session("self")` deletes worktree then resumes onto it — cite-only).

**NOT #92019** (Windows `checkout.workers=8` worktree create failure — cite-only).

Stay OFF leftover woodworking / mm-slider / stuffing-box gland / bosun seizing yarn / watchtower larum / sail cringle / kerf-gauge / scarph joint / plimsoll mark.

Cousins cite-only (NOT primary): #87349, #73900, #92019.

Do NOT name this after prior paradigm desks.
Do NOT reuse idle culled / sole / stripped / packed / overdraft / marked / cold / voided / banked / rewritten / thrashing / responsive / sealed / rebound / fenced / swept / armed / unheard / unbolted / snagged / tolled / mute / honored / discarded.

Different surface: worktree-pool-physical-directory-recycle vs isolation-collar hook strip / EDR nlink identity kill / written-notice-with-no-turn / deny unwrap / Remove-Item path rive / daemon overstay / Windows `-c` shear.

Product name stays **Bitts**. Name/slug `bitts` confirmed unused in catalog.json (197 products).

Different UI: dockside mooring bitts / twin iron posts / oak wharf / hemp warps / tidal pool-slot board / reflog ledger / rust salt iron / dark wharf ground. Libre Bodoni / Nunito / Source Code Pro. NOT Libre Caslon/Sora/Inconsolata (Seizing). NOT Lora/Plus Jakarta/Martian Mono (Gland). NOT Fraunces/Manrope (Catachresis). NOT Cormorant/Outfit (Scarph). NOT Libre Baskerville/DM Sans (Kerf). NOT Spectral/Karla (Decant).

Different verbs: Score the bitts, Pin idle razed, Pin seeded belayed, Admit belayed, Load fixtures, Reset to belayed.

Different idle: **razed**. Different seeded: **belayed**. HOLD: **belayed** / **hold**. ALARM: **razed** / **slot-recycle** / **reflog-churn** / **keep-active** / **mass-deletions** / **cousins** / **has-clear-repro**.

## How to score

```bash
node --test projects/bitts/hook/bitts.test.mjs
node projects/bitts/hook/index.mjs projects/bitts/data/92573.json
echo '{"seed":"belayed","belayed":true}' | node projects/bitts/hook/index.mjs
```

Open the living desk at `projects/bitts/index.html` (or the live path). Buttons: Score the bitts, Pin idle razed, Pin seeded belayed, Admit belayed, Load fixtures, Reset to belayed. Drop a fixture JSON or paste it. `?embed=1` hides chrome.

## Live path

- Path gate: https://hermes-playground-green.vercel.app/bitts/
- Subdomain: https://bitts.hermes-playground-green.vercel.app
- Folder: `projects/bitts/`
