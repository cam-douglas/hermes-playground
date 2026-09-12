# Gleaner

An **agricultural gleaner's field / leftover-harvest booth** — after the reapers leave, gleaners collect leftover grain; here the Bash call's harvest should take the `&` children with it, but they are left spinning in the stubble as unreaped orphans. Fonts **Yrsa** (display) + **Mulish** (body) + **IBM Plex Mono** (mono). Palette: field night `#0E140C`, straw `#E8D9A8`, soil `#2A1F14`, wheat `#C4A35A`, leaf `#5B8C5A`, rust-alert `#B85C38`, chalk `#F4F0E6`. Wheat/stubble field strip / gleaner's basket/sickle motif / process-row chips (yes×39) / PPID-1 badge / process-group stamps (pgid 40734 / 42141) / nice-5 chip / fd2→tasks/output path strip / Activity Monitor wall / SIGTERM-fail→SIGKILL escalate chip / 8h42m elapsed meter / worktree agent-cwd badge / setsid/process-group containment gate (idle path). NOT Schism (twin glass / dual-writer), NOT Rasure (parchment wipe), NOT Ashpan (foundry grate / orphan jsonl), NOT Outrider (cavalry / headersHelper), NOT Necrology (parish death-register), NOT Innominate/Snuffer/Changeling/Homograph/Galley/Rescript/Monadnock/Rider/Followspot/Calends/Weir/Irons/Cathead/Anachronism, NOT millimeter-slider or woodworking leftover. This is specifically: orphaned shell `&` jobs not reaped by the Bash harness — PPID 1 silent CPU leak.

The harvest should stay **gleaned** (HOLD: process-group reaped when Bash call ends; no orphan PPID-1 spinners; tracked or dead — the good path). Instead background `&` jobs were **orphaned** after an **unreaped-ampersand**.

Primary:

- [anthropics/claude-code#93794](https://github.com/anthropics/claude-code/issues/93794) (OPEN, has repro). Title: `Background \`&\` jobs in a Bash tool call are orphaned, not reaped: 39 \`yes\` processes pegged ~7 cores for 8h42m`. Labels: bug, has repro, platform:macos, area:bash. Environment: Claude Code 2.1.267, macOS Darwin 25.5.0 arm64 14 cores, zsh via Bash tool. Background processes started with `&` inside a Bash tool call are not reaped when that call ends. They are reparented to PID 1 and keep running after the tool call, the subagent, and the session. A subagent spawned 60 `yes > /dev/null` as synthetic CPU-load to reproduce a timing flake; 39 still spinning 8h42m later (~25% CPU each ≈ 7 of 14 cores); no UI indication; user found via Activity Monitor. Evidence: `pgrep -x yes` → 39; every PPID 1; two process groups (2 in pgid 40734, 37 in pgid 42141); lsof shows cwd under `.claude/worktrees/agent-<id>`, fd2 at `…/<session-id>/tasks/<task-id>.output` (Bash tool output file), nice 5; survivors needed `kill -9` after SIGTERM failed. Root cause narrative in the issue: (1) the agent never killed its own background jobs; (2) the harness did not clean them — shell exit reparented children to PID 1; nothing later reaped them. (2) is the Claude Code bug. Worse than cosmetic: no visibility in transcript /tasks / background surfaces; outlives session; compounds; not rate-limited enough. Repro (single Bash tool call): `for i in $(seq 1 5); do yes > /dev/null & done; sleep 1; echo done`. After return: `pgrep -x yes` → 5; PPID 1. Suggested fixes (scoring narrative only — DO NOT implement a Claude Code fix): process group per Bash call + kill group on complete; reap at session teardown; surface stray children in tool result; warn model; escalate TERM→KILL. Env leak 8h42m; 60 spawned / 39 alive. Cousins cite-only (do not rebuild): #92583 (OPEN) — session-end unreaped auto-backgrounded Bash orphans (Snatch). Different mechanism: here the leak is at Bash-call end, not session teardown. #77593 (OPEN) — Windows background Bash tool processes orphaned across sessions. Different platform. Backups cite-only (next focus only — do not auto-pick): #93788 #93801 #93798 #93786 #93778 #93800 #93795 #93766 #93764 #93754 #93751 #93744 #93772 #93770 #93777 #93782.

20:50 gleaner: an agricultural gleaner's field / leftover-harvest booth for #93794. Idle **gleaned** / seeded **orphaned** / path **unreaped-ampersand**. Score gleaner or admit gleaned.

Score gleaner or admit gleaned.

Idle word: **gleaned** (HOLD: process-group reaped when Bash call ends; no orphan PPID-1 spinners; tracked or dead — the hold/good path). HOLD aliases: gleaned, reaped, contained, process-group. Seeded word: **orphaned** / #93794 (unreaped `&` jobs reparented to PID 1). Path word: **unreaped-ampersand**. Product score: **gleaner**. Never idle live / schismed / schism / resume-while-live / intact / rasured / rasure / creation-time-flip / swept / ashpanned / ashpan / orphan-jsonl / credentialed / outridden / outrider / early-connect / attested / necrologized / necrology / incomplete-listing / named / innominate / icon-only / lit / snuffed / snuffer / ganged-or / pledged / swapped / remote-reattach / changeling / distinct / collided / lossy-slug / homograph / dry / billed / stop-dirty / galley / scraped / rescript / fresh / residual / monadnock / plain / ridden / rider / dark / followspot / due / calends / flowing / weir / underway / irons / seated / cathead / tip / stale / anachronism / eidolon or seeded schismed / rasured / ashpanned / outridden / necrologized / blank / snuffed / swapped / collided / billed / residual / ridden / dark / misfired / dammed / becalmed / raced.

Phrase: **Score gleaner or admit gleaned.**

- **gleaned** = IDLE: HOLD; process-group reaped when Bash call ends; no orphan PPID-1 spinners; tracked or dead
- **orphaned** = #93794 seeded path: unreaped `&` jobs reparented to PID 1
- **gleaner** = product score word for the leftover-harvest field
- **unreaped-ampersand** = path word: Bash call ended; `&` jobs left in the stubble
- **hold** = HOLD alias for idle gleaned
- **ppid-one** = every survivor PPID 1 — spawning shell gone; children reparented
- **process-group** = two leaked groups: 2 in pgid 40734, 37 in pgid 42141
- **nice-five** = survivors ran at nice 5 — the niceness the Bash tool applies
- **task-output-fd** = fd 2 → `…/<session-id>/tasks/<task-id>.output`; cwd under `.claude/worktrees/agent-<id>`
- **sigkill-escalate** = all 39 survived SIGTERM plus 2s; needed kill -9
- **eight-hour-spin** = 39 still spinning 8h42m later; ~25% CPU each ≈ 7 of 14 cores
- **yes-wall** = Activity Monitor wall of yes×39; 60 spawned as synthetic CPU-load
- **has-repro** = published shape: PPID 1; yes×39; fd2 tasks/output; 8h42m
- **cousins** = cite-only #92583 #77593 — do not rebuild
- **backups** = cite-only #93788 #93801 #93798 #93786 #93778 #93800 #93795 #93766 #93764 #93754 #93751 #93744 #93772 #93770 #93777 #93782 — do not auto-pick
- **fixtures** = wheat/stubble field strip / gleaner's basket/sickle / yes×39 chips / PPID-1 badge / pgid stamps / nice-5 / fd2 strip / Activity Monitor wall / SIGTERM→SIGKILL / 8h42m meter / worktree cwd / setsid gate
- **walk** = published idle gleaned → unreaped-ampersand → orphaned → gleaner

Verdicts: gleaned, orphaned, gleaner, unreaped-ampersand, hold, ppid-one, process-group, nice-five, task-output-fd, sigkill-escalate, eight-hour-spin, yes-wall, has-repro, cousins, backups, fixtures, walk.

This is a diagnostic scoring booth. Not an exploit. No live Claude sessions. No secrets. No network to Anthropic required for scoring. Score whether the booth is **orphaned** / **gleaner** or already **gleaned**. Fixtures use the issue's published incident only. Do NOT implement a fix in anthropics/claude-code.

Hypothesis only (NON-BINDING): Bash tool does not put the call in its own process group / does not kill leftover children on shell exit, so `&` jobs reparent to PID 1. Invite verify against #93794 text only. Do not claim a root cause in Claude Code source you have not seen.

## Research brief

Sources:

- Primary: [anthropics/claude-code#93794](https://github.com/anthropics/claude-code/issues/93794)
- Cite-only cousins: #92583 (session-end unreaped auto-backgrounded Bash orphans — Snatch). Different mechanism: here the leak is at Bash-call end, not session teardown; plain shell `&` jobs reparent to PID 1 when the tool call returns. #77593 (Windows background Bash tool processes orphaned across sessions). Different platform. Issue comments were empty; these two are stay-off cousins from the catalog, cite-only.
- Backups (data only; next focus only — do not auto-pick): #93788, #93801, #93798, #93786, #93778, #93800, #93795, #93766, #93764, #93754, #93751, #93744, #93772, #93770, #93777, #93782

What happened (from the issue text — do not invent):

- OPEN, has repro
- Labels: bug / has repro / platform:macos / area:bash
- Environment: Claude Code 2.1.267, macOS Darwin 25.5.0 arm64 14 cores, zsh via Bash tool
- Background processes started with `&` inside a Bash tool call are not reaped when that call ends
- They are reparented to PID 1 and keep running after the tool call, the subagent, and the session
- Subagent spawned 60 `yes > /dev/null` as synthetic CPU-load to reproduce a timing flake
- 39 still spinning 8h42m later, each ~25% CPU ≈ 7 of 14 cores; no UI indication; found via Activity Monitor
- Evidence: `pgrep -x yes` → 39; every PPID 1; two process groups (2 in pgid 40734, 37 in pgid 42141)
- lsof: cwd under `.claude/worktrees/agent-<id>`; fd2 at `…/<session-id>/tasks/<task-id>.output`; nice 5
- Survivors needed `kill -9` after SIGTERM failed
- Root cause narrative: (1) agent never killed its own background jobs; (2) harness did not clean them — shell exit reparented children to PID 1. (2) is the Claude Code bug
- Worse than cosmetic: no visibility in transcript /tasks / background surfaces; outlives session; compounds; not rate-limited enough
- Repro (single Bash tool call): `for i in $(seq 1 5); do yes > /dev/null & done; sleep 1; echo done`. After return: `pgrep -x yes` → 5; PPID 1
- Expected (scoring narrative only): process group per Bash call + kill group on complete; reap at session teardown; surface stray children; warn model; escalate TERM→KILL

Problem found: BACKGROUND `&` JOBS IN A BASH TOOL CALL ARE ORPHANED, NOT REAPED — REPARENTED TO PID 1 AND KEEP SPINNING AFTER THE CALL, THE SUBAGENT, AND THE SESSION.

Why this solution: living catalog page + node diagnostic encoding idle **gleaned** / seeded **orphaned** / path **unreaped-ampersand** so operators can score whether the booth is a **gleaner** or already **gleaned**. Not a Claude Code patch.

Desired (from the issue, scoring narrative only — DO NOT implement a Claude Code fix):

1. Run each Bash tool call in its own process group and kill that group when the call completes (`setsid` / `setpgid`, then `kill(-pgid, SIGTERM)` followed by `SIGKILL` after a grace period)
2. Reap at session teardown as a backstop
3. Surface stray children in the tool result
4. Warn the model when a command contains a backgrounding loop without a `trap`/`kill`
5. Escalate TERM→KILL — survivors needed SIGKILL

## Why not a clone

This is specifically: **ORPHANED SHELL `&` JOBS NOT REAPED BY THE BASH HARNESS — PPID 1 SILENT CPU LEAK.**

Novel paradigm: agricultural gleaner's field / leftover-harvest booth — after the reapers leave, gleaners collect leftover grain; the Bash call's harvest should take the `&` children with it, but they spin in the stubble as unreaped orphans.

**NOT Schism/#93797** (SendMessage to a LIVE Workflow agent resumes a second copy). Different defect. NOT twin glass / dual-writer / ecclesiastical schism. Do not reuse live / schismed / resume-while-live.

**NOT Rasure/#93791** (`~/.claude` wipe + CreationTime flip). Different defect. NOT parchment rasure / wholesale recreate. Do not reuse intact / rasured / creation-time-flip.

**NOT Ashpan/#93780** (delete_session leftover jsonl). Different defect. NOT industrial grate / ashpan / foundry. Do not reuse swept / ashpanned / orphan-jsonl.

**NOT Outrider/#93776** (headersHelper timing race). Different defect. NOT cavalry outrider / dispatch-rider / sealed pouch. Do not reuse credentialed / outridden / early-connect.

**NOT Necrology/#93774** (incomplete `/models` listing asserted as death). Different defect. NOT parish necrology / death-register / incomplete listing. Do not reuse attested / necrologized / incomplete-listing.

**NOT Innominate/#93769** (Send/Stop empty accessible name). Different defect. NOT innominate nameplate / blank-escutcheon. Do not reuse named / icon-only.

**NOT Snuffer/#93746** (`enableArtifact: false` kills scratchpad). Different defect. NOT candle-snuffer / taper / ganged OR. Do not reuse lit / snuffed / ganged-or.

**NOT Changeling/#93757** (remote reconnect discards `/model`). Different defect. NOT fairy-court / cradle-swap. Do not reuse pledged / swapped / remote-reattach.

**NOT Homograph/#93743** (non-ASCII path slug collision). Different defect. NOT lexicographer / headword / lemma. Do not reuse distinct / collided / lossy-slug.

**NOT Galley/#93745** (Stop dirty-tree full-turn bill). Different defect. NOT printer’s tray / unbound sheets. Do not reuse dry / billed / stop-dirty.

**NOT Eidolon** (phantom attach). Different defect. NOT eidolon / phantom. Do not rebuild.

**NOT Followspot/#93714** (Desktop Linux spawn_task chip MCP attach-on-focus). Different defect. NOT theatrical followspot / stage booth. Do not reuse dark / spawn-mcp-focus.

**NOT Calends/#93687** (scheduled catch-up ignores DOW). Different defect. NOT stone calendar / fasti. Do not reuse due / misfired / catchup-dow.

**NOT Weir/#93589** (Cowork Desktop additional-domains / All domains egress 403 after VM 2.1.266). Different defect. NOT mill weir / millrace. Do not reuse flowing / dammed / egress-allowlist.

**NOT Snatch/#92583** (session-end unreaped auto-backgrounded Bash orphans). Cite-only cousin. Different mechanism: session teardown vs Bash-call end. Do not rebuild.

**NOT Reliquary / Cenotaph / Wraith / Afterimage / Midden / Oubliette**. Different defects. Do not rebuild.

**NOT Aphonia / Muzzle / Escutcheon / Lacuna / Annunciator / Tocsin / Scrim / Knock / Quench** (different metaphors). Different defects. Do not rebuild.

**NOT Stubble** (woodworking leftover / millimeter-slider). Different paradigm. This booth is a night field after harvest, not a shop leftover.

Do NOT rename Gleaner to any existing catalog slug. Catalog currently has 313 products; Gleaner is #314 after Schism #313.
Do NOT reuse idle live / schismed / intact / rasured / swept / ashpanned / credentialed / outridden / attested / necrologized / named / innominate / lit / snuffed / pledged / swapped / distinct / collided / dry / billed / scraped / fresh / residual / plain / ridden / dark / due / flowing / underway / seated / tip / stale / eidolon.

Display here is **Yrsa**. Body is **Mulish**. Mono is **IBM Plex Mono**.

Different surface: unreaped Bash `&` jobs reparented to PID 1 vs dual-writer resume of a still-running workflow agent vs wholesale `~/.claude` recreate vs leftover spawned-child jsonl vs headersHelper timing race vs incomplete `/models` death-roll vs Send/Stop empty accessible name vs artifact/scratchpad ganged OR vs remote reconnect `/model` swap vs non-ASCII slug collision vs Stop dirty-tree full-turn bill vs chip-spawn MCP attach-on-focus vs wrong-day catch-up vs sandbox egress allowlist.

Different UI: wheat/stubble field strip / gleaner's basket/sickle / yes×39 chips / PPID-1 badge / pgid 40734 / 42141 stamps / nice-5 chip / fd2→tasks/output strip / Activity Monitor wall / SIGTERM→SIGKILL escalate / 8h42m meter / worktree agent-cwd / setsid containment gate. Yrsa / Mulish / IBM Plex Mono. Field night / straw / soil / wheat / leaf / rust-alert / chalk. NOT twin glass. NOT parchment. NOT foundry grate. NOT cavalry navy/khaki. NOT parish register. NOT void/amber nameplate. NOT beeswax/snuffer brass. NOT moonlit moss. NOT dictionary cream. NOT printer-galley soot. NOT stage black. NOT marble fasti. NOT mill-house.

Different verbs: Admit gleaned, Score gleaner, Walk unreaped-ampersand, Compare gleaned / orphaned, Pin idle gleaned, Pin seeded orphaned, Pin unreaped-ampersand, Hold the gleaned.

Different idle: **gleaned**. Different #93794 seeded path: **orphaned**. HOLD: **gleaned** / **hold**. ALARM: **orphaned** / **gleaner** / **unreaped-ampersand** / **ppid-one**. Path: **unreaped-ampersand**.

## How to score

```bash
node --test projects/gleaner/gleaner.test.mjs
node projects/gleaner/gleaner.mjs projects/gleaner/data/orphaned.json
echo '{"seed":"orphaned"}' | node projects/gleaner/gleaner.mjs
```

Open the living card at `projects/gleaner/index.html` (or the live path `/gleaner/`). Buttons: Admit gleaned, Score gleaner, Walk unreaped-ampersand, Compare gleaned / orphaned, Pin idle gleaned, Pin seeded orphaned, Pin unreaped-ampersand, Hold the gleaned. Toggle chips for: unreaped-ampersand, ppid-one, yes-wall, process-group, task-output-fd, sigkill-escalate — the score flips. Lay a fixture JSON on the field blotter. `?embed=1` hides chrome.

The booth reconstructs the reporter’s unreaped-ampersand walk from the published #93794 text. This page did not run Claude.

## Live path

- Path gate: https://hermes-playground-green.vercel.app/gleaner/
- Folder: `projects/gleaner/`
