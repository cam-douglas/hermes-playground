# Aposiopesis

A **manuscript speech-break booth** — unfinished line with an em-dash cut, blank status rail, git-root seal, silence ledger. Fonts **Literata** (display) + **Sora** (body) + **JetBrains Mono** (mono). Palette: ink speech on pale vellum with a sudden white silence gap — paper `#F7F1E6`, ink `#1C1917`, silence-white `#FFFEFA`, ember ellipsis `#B45309`, git-seal `#0F766E`, rail ash `#78716C`. NOT manor-court parchment, NOT flashback vellum dusk, NOT sanctuary gilt, NOT cloister, NOT vault brass, NOT concert velvet.

Aposiopesis is a rhetorical sudden silence mid-speech: the status standard that should keep speaking falls silent only inside a git repo, with no error, no debug line, just blank air.

Primary:

- [anthropics/claude-code#93588](https://github.com/anthropics/claude-code/issues/93588) (OPEN, bug, has repro, platform:macos, regression, area:statusline). Title: `[BUG] 2.1.268: statusLine command is never invoked when cwd is a git repo (works in a non-git cwd) — regression from 2.1.267`. Claude Code **2.1.268** native installer (`~/.local/share/claude/versions/2.1.268`); macOS (Darwin 25.5.0); iTerm2 3.6.11; `TERM=xterm-256color`; `statusLine` type `command` pointing at `bash "$HOME/.claude/statusline.sh"`; `tui` fullscreen; launched as `claude --dangerously-skip-permissions`. When cwd is a normal git clone or a git worktree: the `statusLine` command is NEVER spawned; the status area stays empty; no error; no stale text. Same binary / settings / script with cwd=`$HOME` (not a git repo): command runs and renders. A concurrent **2.1.267** session inside a git repo still invokes continuously. Spawn measured by logging at the top of the script after `input=$(cat)` to `/tmp/statusline-sessions.log`; sessions B and C stayed at zero spawns over minutes of tool calls / assistant messages / `shift+tab`. `claude --debug` in an affected session: NO statusline-related line at all (not even the workspace-trust skip message). Workspace trust is NOT the discriminator (working cwd has `hasTrustDialogAccepted` false; broken ones true or missing). Script itself fine when run by hand in the affected cwd with captured stdin JSON (exits 0 in ~0.3s). Fullscreen TUI alone is insufficient cause (working session also fullscreen). Not yet isolated: broken cwds are git repos AND carry project-level `.claude/settings.json` with hooks; working cwd is `$HOME` with neither — confound remains. Expected: `statusLine` command invoked regardless of whether cwd is inside a git repository. Cousins cite-only: #50679 (mid-task overwrite, not git-cwd never-spawn), #18475, #82885, #58167.

20:50 aposiopesis: a manuscript speech-break booth for #93588. Idle **raised** / seeded **furled** / path **git-cwd-mute**. Score aposiopesis or admit raised.

Score aposiopesis or admit raised.

Idle word: **raised** (HOLD: statusLine spawned and rendered). Seeded word: **furled** / #93588 (blank mute in git cwd). Path word: **git-cwd-mute**. Product score: **aposiopesis**. Never idle seised / ordered / viewed / closed / sealed / voiced or seeded disseised / redelivered / withheld / lingering / blanked / muted.

Phrase: **Score aposiopesis or admit raised.**

- **raised** = IDLE: HOLD; statusLine spawned and rendered
- **furled** = #93588 seeded path: git cwd never spawns; rail empty
- **aposiopesis** = product score word for rhetorical sudden silence mid-speech
- **git-cwd-mute** = path word: the status standard falls silent only inside a git repo
- **hold** = HOLD alias for idle raised
- **spawned** = statusLine command was invoked
- **rendered** = status area shows the script output
- **zero-spawns** = B and C stayed at zero over minutes of tool calls / assistant messages / shift+tab
- **home-renders** = cwd=$HOME (not a git repo) runs and renders
- **worktree-blank** = session C git worktree also never spawned
- **clone-blank** = session B normal git clone never spawned
- **no-debug-line** = `claude --debug` has no statusline-related line
- **not-trust** = workspace trust is not the discriminator
- **script-ok-by-hand** = script exits 0 ~0.3s when run by hand with captured stdin JSON
- **fullscreen-insufficient** = working session also tui fullscreen
- **concurrent-267** = 2.1.267 inside a git repo still invokes continuously
- **settings-hooks-confound** = broken cwds are git repos AND carry project-level settings/hooks
- **git-cwd** = cwd is a git clone or worktree
- **never-spawned** = statusLine command is NEVER spawned
- **blank-rail** = status area stays empty
- **no-error** = no error on the rail
- **no-stale-text** = no leftover text on the rail
- **regression-268** = works on 2.1.267; broken on 2.1.268
- **has-repro** = published shape: 2.1.268, git cwd, never spawned, $HOME still renders
- **cousins** = cite-only #50679 #18475 #82885 #58167 — do not rebuild
- **backups** = cite-only #93576 #93553 #93595 #93589 #93556 #93546 #93530 #93570 — do not auto-pick
- **fixtures** = unfinished line / blank rail / git-root seal / silence ledger / debug strip
- **walk** = published idle raised → git-cwd → never-spawned → blank-rail → zero-spawns → no-debug-line → worktree-blank → not-trust → script-ok-by-hand → fullscreen-insufficient → concurrent-267 → settings-hooks-confound → git-cwd-mute → aposiopesis

Verdicts: raised, furled, aposiopesis, git-cwd-mute, hold, spawned, rendered, zero-spawns, home-renders, worktree-blank, clone-blank, no-debug-line, not-trust, script-ok-by-hand, fullscreen-insufficient, concurrent-267, settings-hooks-confound, git-cwd, never-spawned, blank-rail, no-error, no-stale-text, regression-268, has-repro, cousins, backups, fixtures, chips, fingerprints, walk.

This is a diagnostic scoring booth. Not an exploit. No live Claude sessions. No secrets. No network to Anthropic required for scoring. Score whether the speech is **furled** / **aposiopesis** or already **raised**. Fixtures use the issue's published incident only. Do NOT implement a fix in anthropics/claude-code.

Hypothesis only (NON-BINDING): something about git-cwd detection or project-level settings/hooks presence skips statusLine spawn in 2.1.268. Invite verify against #93588 text only. Do not claim a root cause in Claude Code source you have not seen.

## Research brief

Sources:

- Primary: [anthropics/claude-code#93588](https://github.com/anthropics/claude-code/issues/93588)
- Cite-only cousin: [anthropics/claude-code#50679](https://github.com/anthropics/claude-code/issues/50679) (statusLine not invoked during task execution / activity indicator overwrite — different: mid-task overwrite, not git-cwd never-spawn)
- Cite-only cousins: #18475, #82885, #58167 — do not rebuild
- Backup (data only): #93576 #93553 #93595 #93589 #93556 #93546 #93530 #93570

What happened (from the issue text — do not invent):

- OPEN. Labels: bug, has repro, platform:macos, regression, area:statusline.
- Claude Code **2.1.268** native installer; macOS; iTerm2; statusLine type command; tui fullscreen
- When cwd is a normal git clone or a git worktree: statusLine command is NEVER spawned; status area stays empty; no error; no stale text
- Same binary/settings/script with cwd=$HOME (not a git repo): command runs and renders
- Concurrent 2.1.267 session inside a git repo still invokes continuously → regression in 2.1.268
- Spawn measured by logging at top of script after `input=$(cat)`; B and C stayed at zero spawns over minutes of tool calls / assistant messages / shift+tab
- `claude --debug` in affected session: NO statusline-related line at all (not even workspace-trust skip message)
- Workspace trust is NOT the discriminator (working cwd has `hasTrustDialogAccepted` false; broken ones true or missing)
- Script itself fine when run by hand in affected cwd with captured stdin JSON
- Fullscreen TUI alone is insufficient cause (working session also fullscreen)
- Not yet isolated: broken cwds are git repos AND carry project-level `.claude/settings.json` with hooks; working cwd is `$HOME` with neither — confound remains

Problem found: STATUSLINE COMMAND NEVER SPAWNED WHEN CWD IS A GIT REPO ON 2.1.268 → blank rail, no error, no debug line; $HOME still speaks; 2.1.267 concurrent still speaks.

Why this solution: a living catalog page + small node diagnostic that encodes the defect as idle/seeded/path verdicts so operators can score whether the speech stayed **raised** or was **furled**. Educational speech-break booth for the catalog. Not a Claude Code fix.

Desired (from the issue, scoring narrative only — DO NOT implement a Claude Code fix):

1. The `statusLine` command is invoked regardless of whether cwd is inside a git repository

## Why not a clone

This is specifically: **2.1.268 STATUSLINE COMMAND NEVER SPAWNED WHEN CWD IS A GIT REPO → blank rail, no error, no debug line.**

**NOT Disseisin/#93574** (Cowork VM-home evaporation / ghost connected folder). Different defect. NOT manor-court parchment.

**NOT Analepsis/#93569** (Desktop feed redelivery behind `background_tasks_redelivered`). Different defect. NOT flashback vellum dusk.

**NOT Monstrance/#93563** (Artifact read binds withdrawn native WebFetch). NOT sanctuary gilt/crimson.

**NOT Compline/#93549** (remote-control bridge never sends `end_session`). NOT cloister dusk.

**NOT Sourdine/#93531** (MessageDisplay mid-narration mute). Different mute: hook narration replaced by `(summarized)`, not a statusLine that never spawns. NOT concert velvet.

**NOT Aphonia** (laryngoscope / sibling-already-voiced roster). Name-collision mute cousin. Do not rebuild.

**NOT Deadair** (TCP keepalive, 0 response bytes, 900s silent wait). Different silence. Do not rebuild.

**NOT Lacuna** (prior catalog lacuna / gap booth). Name-collision gap cousin. Do not rebuild.

**NOT #50679** — statusLine not invoked during task execution / activity indicator overwrite. Different: mid-task overwrite while idle still invokes, not git-cwd never-spawn from session start. Cite only.

Do NOT rename Aposiopesis to any existing catalog slug. Catalog currently has 291 products; Aposiopesis is #292.
Do NOT reuse idle seised / ordered / viewed / closed / sealed / voiced, or seeded disseised / redelivered / withheld / lingering / blanked / muted.
Display here is **Literata**. Body is **Sora**. Mono is **JetBrains Mono**.

Different surface: CLI TUI statusLine never-spawn in git cwd vs Cowork VM-home evaporation vs Desktop Code-tab feed redelivery vs Cowork Artifact native-WebFetch bind vs routine `end_session` leak vs MessageDisplay narration mute.

Different UI: unfinished line / em-dash cut / blank status rail / git-root seal / silence ledger. Literata / Sora / JetBrains Mono. Ink on pale paper with a sudden white silence gap. NOT manor roll. NOT vellum dusk. NOT sanctuary night. NOT cloister dusk. NOT bank vault. NOT concert velvet.

Different verbs: Speak the line, Score aposiopesis, Cut the dash, Compare raised / furled, Pin idle raised, Pin seeded furled, Pin git-cwd-mute, Raise the rail.

Different idle: **raised**. Different #93588 seeded path: **furled**. HOLD: **raised** / **hold**. ALARM: **furled** / **aposiopesis** / **git-cwd-mute** / **zero-spawns**. Path: **git-cwd-mute**.

## How to score

```bash
node --test projects/aposiopesis/aposiopesis.test.mjs
node projects/aposiopesis/aposiopesis.mjs projects/aposiopesis/data/furled.json
echo '{"seed":"furled"}' | node projects/aposiopesis/aposiopesis.mjs
```

Open the living card at `projects/aposiopesis/index.html` (or the live path `/aposiopesis/`). Buttons: Speak the line, Score aposiopesis, Cut the dash, Compare raised / furled, Pin idle raised, Pin seeded furled, Pin git-cwd-mute, Raise the rail. Toggle chips for: spawned, rendered, git cwd, worktree, zero spawns, no debug line, not trust, settings/hooks confound — the score flips. Lay a fixture JSON on the blotter. `?embed=1` hides chrome.

The booth reconstructs the reporter’s furled walk from the published #93588 text. This page did not run Claude live.

## Live path

- Path gate: https://hermes-playground-green.vercel.app/aposiopesis/
- Folder: `projects/aposiopesis/`
