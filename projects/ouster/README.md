# Ouster

A **common-law ouster / Georgian bailiff-desk / tenancy-roll / wax-seal notice / occupied-flat / iron-key / parchment-writ / ink-stained ledger / street-door booth** — bailiff desk, tenancy roll, iron key, nested lodger still inside when the street door is kicked in. Fonts **Instrument Serif** (display) + **Manrope** (body) + **Fragment Mono** (mono). Palette: parchment `#F4EFE4`, ink `#1C1917`, bailiff brass `#B08D57`, eviction crimson `#8B1E1E`, slate door `#3F4A56`, tenant teal `#2A6F6F`, dust `#6B645A`. Fresh trio. NOT Proscription/#94202. NOT Thimblerig/#94174. NOT Fetchling/#94065. NOT Souffleur/#94031. NOT Epitome/#94032. NOT Diabolica/#94040 (Diabolica was worktree Bash false-guilt / cannot-show-not-git — DIFFERENT). NOT Sallyport/#94082. NOT Palilalia/#94041. NOT Sepulchre. NOT Sneck. NOT Drawbridge. NOT Chirograph. NOT Titulus. NOT Derelict. NOT Vestry. NOT Mondegreen. NOT Afterimage. NOT Phosphene. NOT Scotoma. NOT Scrim. NOT Aphonia. NOT Sourdine. NOT Anarthria. Completely different UI/UX/metaphor. This is specifically: **WORKTREE AUTO-CLEAN YANKS A WORKTREE STILL USED BY A RUNNING NESTED BACKGROUND AGENT — WRONGFUL EVICTION OF A TENANTED FLAT.**

The roll should stay **tenanted** (HOLD: occupied / seated / retained / locked / inhabited). Instead the booth was **ouster** after an **inherited-worktree-yank**.

Primary:

- [anthropics/claude-code#94221](https://github.com/anthropics/claude-code/issues/94221) (OPEN). Title: `Worktree auto-cleanup removes a worktree still used by a running nested background agent`. Labels: bug, has repro, platform:macos, area:agents, data-loss. Version: Claude Code desktop 2.1.220 (macOS). A subagent launched with `isolation: "worktree"` starts a background child agent. The child inherits the same worktree (`inheritedWorktreePath`, `spawnDepth: 2`). The parent then finishes without changes; Claude Code auto-removes the worktree (`worktreeCleanlyRemoved: true`); ~6–8s later every tool call in the still-running child fails with "working directory ... no longer exists ... Refusing to run there". Observed twice on 2026-09-14, main Opus 5, subagents Sonnet 5. Timeline: 06:44:58 parent starts in `.claude/worktrees/agent-a59a…`; 06:45:44 parent calls Agent (background), child inherits; 06:45:50 parent ends with no changes → worktree removed; 06:45:58 child stops. Impact: work lost, stage re-run (tens of millions of tokens). Expected: don't auto-clean (or keep git worktree lock) while a child that inherited the worktree is still running. Cousins cite-only (do NOT rebuild / do NOT conflate): #41010 — worktree isolation cleanup deletes parent session working directory on agent ID collision; #76377 — background/bridge sessions leak worktrees (no cleanup on daemon kill). Related but different. This booth is specifically auto-clean yanking a worktree still used by a running nested inheritor. Backups cite-only (next focus only — do not auto-pick): #94029, #93987, #93924, #93770, #93777, #94059, #94053, #94151, #94064. Stay off Ouster/Proscription/Thimblerig/Fetchling/Souffleur/Epitome/Diabolica/Sallyport/Palilalia/Sepulchre paradigms.

19:00 ouster: a common-law ouster / Georgian bailiff-desk / tenancy-roll / wax-seal notice / occupied-flat / iron-key / parchment-writ / ink-stained ledger / street-door booth for #94221. A subagent launched with isolation worktree starts a background child; the child inherits the same worktree (inheritedWorktreePath, spawnDepth: 2); the parent finishes without changes; Claude Code auto-removes the worktree (worktreeCleanlyRemoved: true); ~6–8s later every tool call in the still-running child fails with working directory no longer exists / Refusing to run there. Observed twice on 2026-09-14, Claude Code desktop 2.1.220 (macOS), main Opus 5, subagents Sonnet 5. Idle **tenanted** / seeded **ouster** / path **inherited-worktree-yank**. Score ouster or admit tenanted.

Score ouster or admit tenanted.

Idle word: **tenanted** (HOLD: worktree stays while nested inheritor still runs). HOLD aliases: occupied, seated, retained, locked, inhabited. Seeded word: **ouster** / #94221 (the inherited-worktree-yank path). Path word: **inherited-worktree-yank**. Product score: **ouster**. Never idle additive / literal / echoing / unabridged / innocent / sealed / silenced / living / cleared / spanned / matched / inscribed / barred / denied / struck / excised / absent / stripped or seeded thimblerig / fetchling / souffleur / epitome / diabolica / sallyport / palilalia / sepulchre / proscription or path skill-row-carve / skill-dollar-swap / deny-list-hollow / etc.

Phrase: **Score ouster or admit tenanted.**

- **tenanted** = IDLE HOLD: worktree retained while nested inheritor still runs
- **ouster** = seeded path / product score: auto-clean yanks worktree under running child
- **inherited-worktree-yank** = path word
- **hold** = HOLD alias for idle tenanted
- **occupied** = HOLD alias: occupied flat still named on the roll
- **seated** = HOLD alias: nested lodger still seated at the desk
- **retained** = HOLD alias: worktree retained while nested inheritor still runs
- **locked** = HOLD alias: iron key stays in the lock
- **inhabited** = HOLD alias: nested child still inside the flat
- **inheritedWorktreePath** = child inherits the same isolation worktree
- **spawnDepth-2** = child meta shows spawnDepth: 2
- **worktreeCleanlyRemoved** = parent-no-changes; auto-clean yanks the worktree
- **parent-no-changes** = parent ends with no changes at 06:45:50
- **child-refuses-cwd** = working directory no longer exists; Refusing to run there
- **six-to-eight-seconds** = ~6–8s later the still-running child dies
- **token-rerun-loss** = work lost; stage re-run; tens of millions of tokens
- **landing** = Georgian bailiff desk / tenancy roll / iron key / street door
- **has-repro** = published shape: 2.1.220 macOS · twice on 2026-09-14 · inheritedWorktreePath · spawnDepth 2
- **cousins** = cite-only #41010 #76377 — do not rebuild; do not conflate
- **backups** = cite-only #94029 #93987 #93924 #93770 #93777 #94059 #94053 #94151 #94064 — do not auto-pick
- **fixtures** = Georgian bailiff desk / tenancy roll / iron key / street door
- **walk** = published idle tenanted → inherited-worktree-yank → ouster

Verdicts: tenanted, ouster, inherited-worktree-yank, hold, occupied, seated, retained, locked, inhabited, inheritedWorktreePath, spawnDepth-2, worktreeCleanlyRemoved, parent-no-changes, child-refuses-cwd, six-to-eight-seconds, token-rerun-loss, landing, has-repro, cousins, backups, fixtures, walk.

This is a diagnostic scoring booth. Not an exploit. No Claude sessions. No network to Anthropic required for scoring. Score whether the booth is **ouster** or already **tenanted**. Fixtures use the issue's published incident only. Do NOT implement a fix in anthropics/claude-code.

Hypothesis only (NON-BINDING): auto-clean treats parent-exit with no changes as a free yank of the shared worktree and does not hold a git worktree lock (or occupancy check) for a nested inheritor still running. Invite verify against #94221 text only. Do not claim a root cause in Claude Code source you have not seen.

## Research brief

Sources:

- Primary: [anthropics/claude-code#94221](https://github.com/anthropics/claude-code/issues/94221)
- Cousins (cite-only — do NOT rebuild / do NOT conflate): #41010 worktree isolation cleanup deletes parent session working directory on agent ID collision (different). #76377 background/bridge sessions leak worktrees — no cleanup on daemon kill (opposite polarity: leak, not yank under a living child). #94221 is specifically auto-clean yanking a worktree still used by a running nested inheritor.
- Backups (data only; next focus only — do not auto-pick): #94029, #93987, #93924, #93770, #93777, #94059, #94053, #94151, #94064

What happened (from the issue text — do not invent):

- OPEN
- Labels: bug, has repro, platform:macos, area:agents, data-loss
- Version: Claude Code desktop 2.1.220 (macOS). Observed twice on 2026-09-14
- Main model Opus 5; subagents Sonnet 5; parent subagent_type `claude`
- Subagent launched with `isolation: "worktree"` starts a background child agent
- Child inherits the same worktree (`inheritedWorktreePath`, `spawnDepth: 2`)
- Parent finishes without changes; Claude Code auto-removes the worktree (`worktreeCleanlyRemoved: true`)
- ~6–8s later every tool call in the still-running child fails with "working directory ... no longer exists ... Refusing to run there"
- Timeline: 06:44:58 parent starts in `.claude/worktrees/agent-a59a…`; 06:45:44 parent calls Agent (background), child inherits; 06:45:50 parent ends with no changes → worktree removed; 06:45:58 child stops
- Impact: work lost, stage re-run (tens of millions of tokens)
- Expected: don't auto-clean (or keep git worktree lock) while a child that inherited the worktree is still running

Problem found: INHERITED-WORKTREE-YANK — auto-clean removes a worktree still used by a running nested background agent; the nested lodger is locked out.

Why Ouster: A common-law *ouster* is a wrongful eviction — the occupied flat is cleared while the tenant (nested child) is still inside. The Georgian bailiff stamps CLEANLY REMOVED on a tenancy roll that still names a seated lodger. The iron key is yanked; the street door is kicked in. Proscription/#94202 was a hollow deny list (Roman tablet). Thimblerig/#94174 was a /context tally lie (carnival cups). Fetchling/#94065 was a Skill-path dollar-token swap (coin-ledger). Diabolica/#94040 was worktree Bash false-guilt / cannot-show-not-git — DIFFERENT (inverted burden on Bash, not auto-clean yanking a living child's cwd). This booth is specifically inherited-worktree-yank on a nested background inheritor — different problem, UI, UX, metaphor. NOT a Claude Code patch — educational diagnostic booth only.

Why this solution: tenanted catalog page + node diagnostic encoding idle **tenanted** / seeded **ouster** / path **inherited-worktree-yank** so operators can score whether the booth is **ouster** or already **tenanted**. Not a Claude Code patch.

Desired (from the issue, scoring narrative only — DO NOT implement a Claude Code fix):

1. Don't auto-clean a worktree while a child that inherited it is still running
2. Or keep the git worktree lock while a nested inheritor still occupies the path
3. A child with inheritedWorktreePath and spawnDepth: 2 must keep a usable cwd
4. Parent-no-changes must not yank the street door under a seated lodger
5. Alternatively document this and provide a way to limit nested Agent spawning

## Why not a clone

This is specifically: **WORKTREE AUTO-CLEAN YANKS A WORKTREE STILL USED BY A RUNNING NESTED BACKGROUND AGENT — WRONGFUL EVICTION OF A TENANTED FLAT.**

Novel paradigm: Georgian bailiff desk / tenancy roll / wax-seal notice / occupied flat / iron key / parchment writ / street door — parchment, ink, brass, eviction crimson, slate door, tenant teal. New issue, new paradigm (inherited-worktree-yank), new UI/UX/fonts/colors, new scoring vocabulary. A bailiff desk with a kicked street door, not a Roman tablet, carnival tent, twilight coin-ledger, theatre prompt-corner, scriptorium desk, inquisitorial court, or fortress sallyport.

**NOT Proscription/#94202** (deny-list-hollow). Different defect. NOT Roman wax-tablet forum. Do not reuse barred / proscription / deny-list-hollow.

**NOT Thimblerig/#94174** (skill-row-carve). Different defect. NOT carnival cups / chalk tally. Do not reuse additive / thimblerig / skill-row-carve.

**NOT Fetchling/#94065** (skill-dollar-swap). Different defect. NOT fae twilight / coin-ledger. Do not reuse literal / fetchling / skill-dollar-swap.

**NOT Souffleur/#94031** (app-switch-echo-loss). Different defect. NOT theatre wings / prompt-corner. Do not reuse echoing / souffleur / app-switch-echo-loss.

**NOT Epitome/#94032** (summarized-thinking-force). Different defect. NOT classical scriptorium. Do not reuse unabridged / epitome / summarized-thinking-force.

**NOT Diabolica/#94040** (cannot-show-not-git). Different defect. NOT inquisitorial parchment-court. Worktree Bash false-guilt — DIFFERENT from inherited-worktree-yank. Do not reuse innocent / diabolica / cannot-show-not-git.

**NOT Sallyport/#94082** (reminder-secret-bypass). Different defect. NOT fortress / gatehouse. Do not reuse sealed / sallyport / reminder-secret-bypass.

**NOT Palilalia/#94041** (goal-stop-refire). Different defect. NOT speech-pathology / phonograph-groove. Do not reuse silenced / palilalia / goal-stop-refire.

**NOT Sepulchre** (bash-nul-poison). Different defect. NOT stone burial vault / ossuary. Do not reuse living / sepulchre / bash-nul-poison.

**NOT Sneck** (chip dismiss ephemeral). Different defect. NOT Northern cottage / brass sneck-latch. Do not reuse cleared / sneck / chip-dismiss-ephemeral.

**NOT Drawbridge** (RC bridge auto-update drop). Different defect. NOT raised span / bailey. Do not reuse spanned / drawbridge / rc-bridge-update-drop.

**NOT Chirograph** (recorded branch never refreshed after `git branch -m`). Different defect. NOT medieval lectern / indenture. Do not reuse matched / chirograph / worktree-rename-stale.

**NOT Titulus** (iOS rename vs desktop sidebar / resume-stale-title). Different defect. NOT Roman marble plaque. Do not reuse inscribed / titulus.

**NOT Derelict** (orphaned Bash after session stop). Different defect. NOT maritime abandoned-hulk. Do not reuse berthed / derelict.

**NOT Vestry** (Linux bwrap placeholder mount cleanup is per-process). Different defect. NOT liturgical sacristy. Do not reuse pegged / vestry.

**NOT Mondegreen** (substring "git" false-positive). Different defect. NOT lyric-ballad / mishearing.

**NOT Afterimage** (Windows text paint latency). Different defect. NOT CRT phosphor.

**NOT Phosphene** (WindowServer CA layer-tree thrash). Different defect. NOT vision flash.

**NOT Scotoma.** Different defect. NOT vision gap.

**NOT Scrim** (runtime DLP redaction). Different product. Do not reuse flushed / scrim.

**NOT Aphonia** (missing SendMessage). Different defect. NOT ENT roster.

**NOT Sourdine** (mid-narration mute). Different defect. NOT concert mute.

**NOT Anarthria** (dictation paste drop). Different defect. NOT laryngology.

Live: https://hermes-playground-green.vercel.app/ouster/

```
node --test projects/ouster/ouster.test.mjs
node projects/ouster/ouster.mjs projects/ouster/data/ouster.json
```
