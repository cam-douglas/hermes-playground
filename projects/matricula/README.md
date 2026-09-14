# Matricula

A **university registrar / enrollment-desk booth** — a *matricula* is the roll of persons admitted to a college, guild, or parish. Desktop `/reload-skills` should re-scan and write a mid-session arrival onto that roll. Instead it stamps `(no changes)` while a fresh process lists the new enrollee. Fonts **Bitter** (display) + **Karla** (body) + **Roboto Mono** (mono). Palette: ivory blotter `#F7F0E6`, oak ink `#1A211C`, forest blotter `#3A6B4F`, brass stamp `#C4A15A`, oak rail `#6B3E2E`. Fresh trio. NOT Allograph parchment/copper. NOT Agraphia clinic chalk/amber. NOT Cadastre cadastral baize/theodolite. Completely different UI/UX/metaphor — oak counter / ivory blotter / brass stamp / ink roll. NOT a cadastral survey. NOT a type-foundry. NOT a neurology desk.

The roll should stay **enrolled** (HOLD: the live scan would pick up a mid-session arrival and report it added). Instead the booth was **matricula** after a **reload-blind**.

Primary:

- [anthropics/claude-code#93987](https://github.com/anthropics/claude-code/issues/93987) (OPEN). Title: `/reload-skills reports "no changes" for a skill added to disk mid-session (Desktop app); a fresh process sees it`. Labels: bug, has repro, platform:windows, area:skills, area:desktop. Environment: Claude Code desktop app 2.1.266 (Code tab), Windows 10; CLI 2.1.263 control process; personal-scope skills at `~/.claude/skills` via a directory junction. `commands.md` documents `/reload-skills` as a re-scan so skills added or changed on disk during the session become available without restarting, reporting how many were added or removed. In the desktop app the re-scan does not pick up a skill directory created mid-session. `/reload-skills` → `Reloaded skills: 72 skills available (no changes)` before anything changed; after creating `~/.claude/skills/reload-probe/SKILL.md`; and after editing the probe so it is user-invocable. Count did not move; probe not listed. Control, run while that session is still open: `claude -p '/skill-doctor'` in a new process → `reload-probe   userSettings   -   -   0x  never`. File, frontmatter and junction are fine. Expected: either `(1 added)` or an honest cannot-re-scan; `(no changes)` reads as a verified negative. Cousins cite-only (do NOT rebuild / do NOT conflate): #88164 (`/skills` prints No changes; there `/reload-skills` works with `2 added`), #74990 (compaction drops Available-skills; `/reload-skills` recovers it while reporting no changes), #72631 (closed — IDE palette missed newly-added symlinked skills until reload). Matricula is specifically desktop `/reload-skills` itself missing a mid-session add. Stay off Allograph/Agraphia/Gauntlet/Lictor/Lychgate/Ouster/Proscription/Thimblerig/Fetchling/Rasure/Cadastre paradigms.

00:50 matricula: a university registrar / enrollment-desk / ivory-blotter / brass-stamp booth for #93987. Desktop /reload-skills returns Reloaded skills: 72 skills available (no changes) after ~/.claude/skills/reload-probe/SKILL.md is added mid-session; a fresh process `claude -p '/skill-doctor'` lists reload-probe. Idle **enrolled** / seeded **matricula** / path **reload-blind**. Score matricula or admit enrolled.

Score matricula or admit enrolled.

Idle word: **enrolled** (HOLD: the live roll would pick up a mid-session arrival and report it added). HOLD aliases: admitted, rostered, listed, scanned, freshened. Seeded word: **matricula** / #93987 (the reload-blind path). Path word: **reload-blind**. Product score: **matricula**. Never idle equated / penned / ungloved / attested / reaped / tenanted / barred / additive / literal / echoing / unabridged / innocent / sealed / silenced / living / cleared / spanned / inscribed / berthed / pegged / latent / flushed / articulate / limber / primed / lit / voiced / mute / quieted / unrung / vested / plenary / equalized / legible / calibrated / engaged / flush / candid / stetted / sighted / intact or seeded Allograph / Agraphia / gauntlet / lictor / lychgate / ouster / proscription / thimblerig / fetchling / rasure / Cadastre or path win-posix-mismatch / pre-tool-omit / attach-mouse / picker-bypass.

Phrase: **Score matricula or admit enrolled.**

- **enrolled** = IDLE HOLD: the live roll would pick up a mid-session arrival and report it added
- **matricula** = seeded path / product score: live stamp misses an arrival a fresh census can see
- **reload-blind** = path word
- **hold** = HOLD alias for idle enrolled
- **admitted** = HOLD alias: name written on the roll
- **rostered** = HOLD alias: on the enrollment roll
- **listed** = HOLD alias: session lists the arrival
- **scanned** = HOLD alias: re-scan walked disk
- **freshened** = HOLD alias: count moved; (1 added)
- **no-changes** = Reloaded skills: 72 skills available (no changes) three times
- **mid-session-add** = ~/.claude/skills/reload-probe/SKILL.md created while the session stayed running
- **fresh-process-sees** = `claude -p '/skill-doctor'` in a new process lists reload-probe
- **skill-doctor** = control row: reload-probe   userSettings   -   -   0x  never
- **reload-probe** = valid frontmatter; not listed in-session
- **count-stuck** = 72 did not move after create or edit
- **junction-ok** = ~/.claude/skills junction loads every other skill; probe loads in a new session
- **verified-negative** = (no changes) reads as I looked and there is genuinely nothing new
- **landing** = university registrar / enrollment-desk / ivory blotter
- **has-repro** = published shape: 2.1.266 desktop Windows 10
- **cousins** = cite-only #88164 #74990 #72631 — do not rebuild; do not conflate
- **backups** = cite-only #93924 #93770 #93777 #94151 #94064 #94277 — do not auto-pick
- **fixtures** = university registrar / enrollment-desk
- **walk** = published idle enrolled → reload-blind → matricula
- **closed** = cousins remain OPEN (except #72631 closed) — cite only; not this booth

Verdicts: enrolled, matricula, reload-blind, hold, admitted, rostered, listed, scanned, freshened, no-changes, mid-session-add, fresh-process-sees, skill-doctor, reload-probe, count-stuck, junction-ok, verified-negative, landing, has-repro, cousins, backups, fixtures, walk, closed.

This is a diagnostic scoring booth. Not an exploit. No Claude sessions. No network to Anthropic required for scoring. Score whether the booth is **matricula** or already **enrolled**. Fixtures use the issue's published incident only. Census rows are synthetic example-data. Do NOT implement a fix in anthropics/claude-code.

Hypothesis only (NON-BINDING): the desktop in-session re-scan does not pick up skill directories created on disk during the session and reports `(no changes)` as if the census were complete; a fresh process sees the same disk set. Invite verify against #93987 text only. Do not claim a root cause in Claude Code source you have not seen.

## Research brief

Sources:

- Primary: [anthropics/claude-code#93987](https://github.com/anthropics/claude-code/issues/93987)
- Cousins (cite-only — do NOT rebuild / do NOT conflate): #88164 — `/skills` prints No changes; there `/reload-skills` works (`19 skills available (2 added)`). #74990 — compaction drops the Available-skills reminder; `/reload-skills` recovers it while reporting no changes. #72631 (closed) — IDE palette did not index newly-added symlinked skills until reload. #93987 is specifically desktop `/reload-skills` itself missing a mid-session add and stamping `(no changes)`.
- Backups (data only; next focus only — do not auto-pick): #93924, #93770, #93777, #94151, #94064, #94277

What happened (from the issue text — do not invent):

- OPEN
- Labels: bug, has repro, platform:windows, area:skills, area:desktop
- Environment: Claude Code desktop app 2.1.266 (Code tab), Windows 10; CLI 2.1.263 control; `~/.claude/skills` is a directory junction
- `commands.md` says `/reload-skills` re-scans so skills added or changed on disk during the session become available without restarting
- `/reload-skills` → `Reloaded skills: 72 skills available (no changes)` before anything changed
- Create `~/.claude/skills/reload-probe/SKILL.md` (valid `name`, `description`)
- `/reload-skills` → same 72 `(no changes)`; probe not listed
- Edit the probe so it is user-invocable; `/reload-skills` → 72 `(no changes)` a third time
- Control while the session stays open: `claude -p '/skill-doctor'` in a new process lists `reload-probe   userSettings   -   -   0x  never`
- File, frontmatter and junction are fine — a fresh process sees the same disk set
- Expected: either `(1 added)` or an honest cannot-re-scan; `(no changes)` reads as a verified negative

Problem found: RELOAD-BLIND — desktop `/reload-skills` does not pick up a skill directory created mid-session and reports `(no changes)` as if the census were complete.

Why Matricula: A *matricula* is the enrollment roll of a college or guild. The registrar should write a late arrival onto the live blotter. Instead the brass stamp reads NO CHANGES while the night clerk (a fresh process) already has the name. Allograph/#94256 was a type-foundry / win-posix-mismatch — DIFFERENT (dual-script path-guard). Agraphia/#94251 was a clinical writing-desk / pre-tool-omit — DIFFERENT. Cadastre/#92908 was a cadastral `~/.claude.json` RMW lock / escheat — DIFFERENT roll. This booth is specifically reload-blind on desktop `/reload-skills` — different problem, UI, UX, metaphor. NOT a Claude Code patch — educational diagnostic booth only.

Why this solution: enrolled catalog page + node diagnostic encoding idle **enrolled** / seeded **matricula** / path **reload-blind** so operators can score whether the booth is **matricula** or already **enrolled**. Not a Claude Code patch.

Desired (from the issue, scoring narrative only — DO NOT implement a Claude Code fix):

1. `/reload-skills` should pick up directories added during the session, as `commands.md` says, and report `(1 added)`
2. If the desktop app cannot re-scan in place, the command should say so instead of reporting `(no changes)`
3. `(no changes)` must not read as a verified negative when the disk set grew
4. A skill created at `~/.claude/skills/reload-probe/SKILL.md` with valid name/description frontmatter should appear on the live roll
5. Editing the probe so it is user-invocable should still be visible to the in-session re-scan
6. A fresh process listing `reload-probe` via `/skill-doctor` proves the file, frontmatter and junction are fine

## Why not a clone

This is specifically: **DESKTOP `/reload-skills` STAMPS `(no changes)` AFTER A SKILL IS ADDED MID-SESSION; A FRESH PROCESS SEES `reload-probe`.**

Novel paradigm: university registrar / enrollment-desk / ivory blotter / brass stamp / oak counter — ivory, oak ink, forest blotter, brass. New issue, new paradigm (reload-blind), new UI/UX/fonts/colors, new scoring vocabulary. An enrollment desk, not a type-foundry ledger, neurology clinic, tilting-yard glove, purple fasces aisle, parish porch, bailiff desk, Roman tablet, carnival tent, twilight coin-ledger, or cadastral surveyor's bench.

**NOT Allograph/#94256** (win-posix-mismatch). Different defect. NOT type-foundry / punchcutter. Do not reuse equated / Allograph / win-posix-mismatch.

**NOT Agraphia/#94251** (pre-tool-omit). Different defect. NOT clinical writing-desk. Do not reuse penned / Agraphia / pre-tool-omit.

**NOT Gauntlet/#94029** (attach-mouse). Different defect. NOT tilting-yard / iron glove. Do not reuse ungloved / gauntlet / attach-mouse.

**NOT Lictor/#94053** (picker-bypass). Different defect. NOT purple fasces aisle. Do not reuse attested / lictor / picker-bypass.

**NOT Lychgate/#94059** (bg-task-stale). Different defect. NOT parish porch. Do not reuse reaped / lychgate / bg-task-stale.

**NOT Ouster/#94221** (inherited-worktree-yank). Different defect. NOT Georgian bailiff desk. Do not reuse tenanted / ouster / inherited-worktree-yank.

**NOT Proscription/#94202** (deny-list-hollow). Different defect. NOT Roman wax-tablet forum. Do not reuse barred / proscription / deny-list-hollow.

**NOT Thimblerig/#94174** (skill-row-carve). Different defect. NOT carnival cups. Do not reuse additive / thimblerig / skill-row-carve.

**NOT Fetchling/#94065** (skill-dollar-swap). Different defect. NOT fae twilight. Do not reuse literal / fetchling / skill-dollar-swap.

**NOT Rasure/#93791** (creation-time-flip). Different defect. NOT parchment wipe of `~/.claude`. Do not reuse intact / rasure / creation-time-flip.

**NOT Cadastre/#92908**. Different defect. NOT cadastral `~/.claude.json` RMW / escheat. Do not reuse escheated / cadastre / theodolite.

Live: https://hermes-playground-green.vercel.app/matricula/

```
node --test projects/matricula/matricula.test.mjs
node projects/matricula/matricula.mjs projects/matricula/data/matricula.json
```
