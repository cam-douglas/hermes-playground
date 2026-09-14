# Allograph

A **type-foundry / punchcutter / dual-script ledger booth** — typography *allograph*: variant glyph forms of the same grapheme. `D:\proj\file` and `/d/proj/file` are allographs of one path; the shared PreToolUse guard treats them as different letters and fails closed. Fonts **Fraunces** (display) + **Source Sans 3** (body) + **IBM Plex Mono** (mono). Palette: parchment cream `#F3E6C9`, iron-gall ink `#1C1612`, foundry copper `#B87333`, slate blue `#3D5A73`. Fresh trio. NOT Agraphia clinic chalk/amber. NOT Gauntlet iron/crimson. NOT Lictor purple. Completely different UI/UX/metaphor — scriptorium / type-foundry / punchcutter / dual-script ledger. NOT medical Agraphia. NOT medieval gate/gauntlet/lictor.

The ledger should stay **equated** (HOLD: paths compared after script unification would match). Instead the booth was **allograph** after a **win-posix-mismatch**.

Primary:

- [anthropics/claude-code#94256](https://github.com/anthropics/claude-code/issues/94256) (OPEN). Title: `[BUG] Windows: path-guard hook shared with Linux denies every Edit/Write, even on its own settings file (tool_input.file_path is D:\... but hook shell $PWD/$HOME are POSIX /d/...)`. Labels: bug, has-repro, platform:windows, area:hooks. Environment: Claude Code 2.1.270, native Windows 10 Pro, hooks in Git Bash; same settings.json synced with Ubuntu where it works. Shared PreToolUse guard for Edit|Write|NotebookEdit allows only `$PWD/*`, `$HOME/.claude/*`, `/tmp/claude-*`. Works on Linux. On Windows+Git Bash, `tool_input.file_path` arrives as Windows paths (`D:\Dropbox\project\doc.tex`, `C:\Users\...`) while `$PWD`/`$HOME` in the hook shell are POSIX (`/d/Dropbox/project`, `/c/Users/...`). String prefix match fails closed → every in-project Edit/Write denied, including `.claude/settings.json` (session cannot self-repair). Scratchpad also mismatches (`C:\Users\USER~1\AppData\Local\Temp\claude\...` vs `/tmp/claude/...`). Only feedback is the hook deny message — looks like permissions, not path-script mismatch. Cousins cite-only (do NOT rebuild / do NOT conflate): #89392 (Bash strips backslashes on Windows/Git Bash), #88578 (hook commands with backslash paths never execute — bash eats backslashes), #90122 (commandWindows ignored, forces Git Bash), #93356 (hooks fail when Windows username has space), #79414 (plugin marketplace PATH POSIX-style). Allograph is specifically the shared path-guard comparing Windows tool_input paths to POSIX $PWD/$HOME and failing closed. Stay off Agraphia/Gauntlet/Lictor/Lychgate/Ouster/Proscription/Thimblerig/Fetchling/Rasure/Palilalia/Sallyport/Sepulchre/Anarthria/Wicket/Hasp/Ward/Veto/Interdict paradigms.

23:50 allograph: a type-foundry / punchcutter / dual-script ledger booth for #94256. Shared PreToolUse guard for Edit|Write|NotebookEdit allows only $PWD/*, $HOME/.claude/*, /tmp/claude-*. Works on Linux. On Windows+Git Bash, tool_input.file_path arrives as Windows paths (D:\...) while $PWD/$HOME in the hook shell are POSIX (/d/...). String prefix match fails closed — every in-project Edit/Write denied, including .claude/settings.json. Idle **equated** / seeded **allograph** / path **win-posix-mismatch**. Score allograph or admit equated.

Score allograph or admit equated.

Idle word: **equated** (HOLD: paths compared after script unification would match). HOLD aliases: matched, congruent, aligned, normalized, samepath. Seeded word: **allograph** / #94256 (the win-posix-mismatch path). Path word: **win-posix-mismatch**. Product score: **allograph**. Never idle penned / ungloved / attested / reaped / tenanted / barred / additive / literal / echoing / unabridged / innocent / sealed / silenced / living / cleared / spanned / inscribed / berthed / pegged / latent / flushed / articulate / limber / primed / lit / voiced / mute / rostered / quieted / unrung / vested / plenary / equalized / legible / calibrated / engaged / flush / candid / stetted / sighted / intact or seeded Agraphia / gauntlet / lictor / lychgate / ouster / proscription / thimblerig / fetchling / rasure / palilalia / sallyport / sepulchre or path pre-tool-omit / attach-mouse / picker-bypass.

Phrase: **Score allograph or admit equated.**

- **equated** = IDLE HOLD: paths compared after script unification would match
- **allograph** = seeded path / product score: two glyphs of one path scored as different letters
- **win-posix-mismatch** = path word
- **hold** = HOLD alias for idle equated
- **matched** = HOLD alias: scripts match after unification
- **congruent** = HOLD alias: same grapheme, two glyphs
- **aligned** = HOLD alias: scripts aligned
- **normalized** = HOLD alias: unified to one script
- **samepath** = HOLD alias: one path after unification
- **settings-lockout** = even `.claude/settings.json` is denied; session cannot self-repair
- **scratchpad-temp** = `C:\Users\USER~1\AppData\Local\Temp\claude` vs `/tmp/claude`
- **deny-message-only** = only feedback is the hook deny message — looks like permissions
- **prefix-fail** = string prefix of Windows path against POSIX $PWD fails closed
- **fail-closed** = shared guard fails closed
- **windows-path** = tool_input.file_path is D:\... / C:\...
- **posix-shell** = hook shell $PWD/$HOME are POSIX /d/... / /c/...
- **landing** = type-foundry / punchcutter / dual-script ledger
- **has-repro** = published shape: 2.1.270 Windows 10 Pro Git Bash
- **cousins** = cite-only #89392 #88578 #90122 #93356 #79414 — do not rebuild; do not conflate
- **backups** = cite-only #93987 #93924 #93770 #93777 #94151 #94064 — do not auto-pick
- **fixtures** = type-foundry / punchcutter / dual-script ledger
- **walk** = published idle equated → win-posix-mismatch → allograph
- **closed** = cousins remain OPEN — cite only; not this booth

Verdicts: equated, allograph, win-posix-mismatch, hold, matched, congruent, aligned, normalized, samepath, settings-lockout, scratchpad-temp, deny-message-only, prefix-fail, fail-closed, windows-path, posix-shell, landing, has-repro, cousins, backups, fixtures, walk, closed.

This is a diagnostic scoring booth. Not an exploit. No Claude sessions. No network to Anthropic required for scoring. Score whether the booth is **allograph** or already **equated**. Fixtures use the issue's published incident only. Path pairs are synthetic example-data. Do NOT implement a fix in anthropics/claude-code.

Hypothesis only (NON-BINDING): the shared path-guard compares Windows tool_input.file_path to POSIX $PWD/$HOME by string prefix and fails closed. Invite verify against #94256 text only. Do not claim a root cause in Claude Code source you have not seen.

## Research brief

Sources:

- Primary: [anthropics/claude-code#94256](https://github.com/anthropics/claude-code/issues/94256)
- Cousins (cite-only — do NOT rebuild / do NOT conflate): #89392 — Bash strips backslashes on Windows/Git Bash. #88578 — hook commands with backslash paths never execute — bash eats backslashes. #90122 — commandWindows ignored, forces Git Bash. #93356 — hooks fail when Windows username has space. #79414 — plugin marketplace PATH POSIX-style. #94256 is specifically the shared path-guard comparing Windows tool_input paths to POSIX $PWD/$HOME and failing closed.
- Backups (data only; next focus only — do not auto-pick): #93987, #93924, #93770, #93777, #94151, #94064

What happened (from the issue text — do not invent):

- OPEN
- Labels: bug, has-repro, platform:windows, area:hooks
- Environment: Claude Code 2.1.270, native Windows 10 Pro, hooks in Git Bash; same settings.json synced with Ubuntu where it works
- Shared PreToolUse guard for Edit|Write|NotebookEdit allows only `$PWD/*`, `$HOME/.claude/*`, `/tmp/claude-*`
- Works on Linux
- On Windows+Git Bash, `tool_input.file_path` arrives as Windows paths (`D:\Dropbox\project\doc.tex`, `C:\Users\...`) while `$PWD`/`$HOME` in the hook shell are POSIX (`/d/Dropbox/project`, `/c/Users/...`)
- String prefix match fails closed → every in-project Edit/Write denied, including `.claude/settings.json` (session cannot self-repair)
- Scratchpad also mismatches (`C:\Users\USER~1\AppData\Local\Temp\claude\...` vs `/tmp/claude/...`)
- Only feedback is the hook deny message — looks like permissions, not path-script mismatch

Problem found: WIN-POSIX-MISMATCH — the shared guard compares Windows tool_input paths to POSIX $PWD/$HOME by string prefix and fails closed.

Why Allograph: A typographic *allograph* is a variant glyph of the same grapheme. `D:\proj\file` and `/d/proj/file` are allographs of one path. The shared guard treats them as different letters. Agraphia/#94251 was a clinical writing-desk / pre-tool-omit — DIFFERENT (medical loss of writing, not dual-script). Gauntlet/#94029 was attach-mouse — DIFFERENT. Lictor/#94053 was picker-bypass — DIFFERENT. This booth is specifically win-posix-mismatch on the shared path-guard — different problem, UI, UX, metaphor. NOT a Claude Code patch — educational diagnostic booth only.

Why this solution: equated catalog page + node diagnostic encoding idle **equated** / seeded **allograph** / path **win-posix-mismatch** so operators can score whether the booth is **allograph** or already **equated**. Not a Claude Code patch.

Desired (from the issue, scoring narrative only — DO NOT implement a Claude Code fix):

1. A shared path-guard should treat `D:\proj\file` and `/d/proj/file` as one path after script unification
2. In-project Edit/Write on Windows+Git Bash should be allowed when $PWD is the same directory in POSIX script
3. `.claude/settings.json` in the project should remain writable so the session can self-repair
4. Scratchpad under the Windows temp claude folder should be recognized as the `/tmp/claude-*` allow
5. A deny should name the path-script mismatch, not look like a permissions failure
6. Linux-only string prefix against `$PWD/*` / `$HOME/.claude/*` / `/tmp/claude-*` should not be the Windows compare

## Why not a clone

This is specifically: **SHARED PATH-GUARD COMPARING WINDOWS tool_input PATHS TO POSIX $PWD/$HOME AND FAILING CLOSED — EVERY IN-PROJECT EDIT/WRITE DENIED, INCLUDING SETTINGS.JSON.**

Novel paradigm: type-foundry / punchcutter / dual-script ledger / Windows punch vs POSIX matrix / copper proof — parchment cream, iron-gall, foundry copper, slate blue. New issue, new paradigm (win-posix-mismatch), new UI/UX/fonts/colors, new scoring vocabulary. A foundry ledger, not a neurology desk, tilting-yard glove, purple fasces aisle, parish porch, bailiff desk, Roman tablet, carnival tent, twilight coin-ledger, theatre prompt-corner, scriptorium scrape, inquisitorial court, fortress sallyport, or `/goal` speech clinic.

**NOT Agraphia/#94251** (pre-tool-omit). Different defect. NOT clinical writing-desk. Do not reuse penned / Agraphia / pre-tool-omit.

**NOT Gauntlet/#94029** (attach-mouse). Different defect. NOT tilting-yard / iron glove. Do not reuse ungloved / gauntlet / attach-mouse.

**NOT Lictor/#94053** (picker-bypass). Different defect. NOT purple fasces aisle. Do not reuse attested / lictor / picker-bypass.

**NOT Lychgate/#94059** (bg-task-stale). Different defect. NOT parish porch. Do not reuse reaped / lychgate / bg-task-stale.

**NOT Ouster/#94221** (inherited-worktree-yank). Different defect. NOT Georgian bailiff desk. Do not reuse tenanted / ouster / inherited-worktree-yank.

**NOT Proscription/#94202** (deny-list-hollow). Different defect. NOT Roman wax-tablet forum. Do not reuse barred / proscription / deny-list-hollow.

**NOT Thimblerig/#94174** (skill-row-carve). Different defect. NOT carnival cups. Do not reuse additive / thimblerig / skill-row-carve.

**NOT Fetchling/#94065** (skill-dollar-swap). Different defect. NOT fae twilight. Do not reuse literal / fetchling / skill-dollar-swap.

**NOT Rasure/#93791** (creation-time-flip). Different defect. NOT parchment wipe of `~/.claude`. Do not reuse intact / rasure / creation-time-flip.

**NOT Palilalia/#94041** (goal-stop-refire). Different defect. NOT `/goal` Stop re-fire. Do not reuse silenced / palilalia / goal-stop-refire.

**NOT Sallyport/#94082** (reminder-secret-bypass). Different defect. NOT fortress gatehouse. Do not reuse sealed / sallyport / reminder-secret-bypass.

**NOT Sepulchre**. Different defect. NOT bash-nul-poison.

**NOT Anarthria/#93782**. Different defect. NOT Wispr Flow clipboard drop.

**NOT Wicket / Hasp / Ward / Veto / Interdict**. Gate/glove paradigms. Stay off.

Live: https://hermes-playground-green.vercel.app/allograph/

```
node --test projects/allograph/allograph.test.mjs
node projects/allograph/allograph.mjs projects/allograph/data/allograph.json
```
