# Blindside

A **sideline-scout / blind-side-tackle / peripheral-vision booth** — the play is happening on the far sideline, and the clipboard only watches the hash the session is standing on. Fonts **Bebas Neue** (display) + **Source Sans 3** (body) + **IBM Plex Mono** (mono). Palette: night turf `#0B1F14`, chalk `#E8EDDF`, flood amber `#F0A202`, sideline white, clip graphite `#1C2420`, injury red accent sparingly. Chalk hash / night turf / floodlight / scout clipboard / yard marker. NOT Interdict (papal/vellum), NOT Simplex (radio chassis), NOT Deadkey (typewriter platen), NOT Gleaner (wheat leftover-harvest), NOT Schism (twin glass), NOT Rasure (parchment scrape), NOT Ashpan (foundry ashpan). This is specifically: **DIFF PANE CANNOT SEE COMMITTED SUBAGENT WORKTREE WORK; COMPARE REF UNREACHABLE.**

The scout should stay **sighted** (HOLD: compare ref / owned worktrees reachable from the diff pane — the good path). Instead the booth was **blindsided** after a **compare-ref-unreachable**.

Primary:

- [anthropics/claude-code#93786](https://github.com/anthropics/claude-code/issues/93786) (OPEN). Title: `[Desktop] Work committed in subagent worktrees under .claude/worktrees/ is invisible to the session's diff pane, and there is no way to select a compare ref`. Labels: enhancement, platform:macos, area:agents, area:desktop. Claude Code creates subagent worktrees under `.claude/worktrees/` (a directory it owns). Work those agents commit is invisible to the session's diff pane because the pane looks at the directory the session is rooted in and offers no way to select a compare ref. Pane reports "no changes" while several commits exist in the same repository on a worktree branch. Session stays on `main`; agents commit on e.g. `slice-118-readout-elicitation-register` under `.claude/worktrees/...`. This is NOT the undisclosed-base problem in #65852 and NOT the uncommitted-changes gap in #52179. Work is committed; base is correct; the compare side is unreachable. Published evidence includes `git diff main...slice-118-... --stat` showing real changes and `git worktree list` showing the worktree. Cousins cite-only (distinct, do not treat as same bug): #65852, #52179. Backups cite-only (next focus only — do not auto-pick): #93778 #93766 #93764 #93754 #93751 #93744 #93772 #93770 #93777 #93782 #93800 #93795 #93821 #93811 #93809 #93834 #93823 #93825 #93797 #93780 #93779 #93776 #93769.

00:50 blindside: a sideline-scout / blind-side-tackle booth for #93786. Idle **sighted** / seeded **blindsided** / path **compare-ref-unreachable**. Score blindside or admit sighted.

Score blindside or admit sighted.

Idle word: **sighted** (HOLD: compare ref / owned worktrees reachable from the diff pane — the hold/good path). HOLD aliases: sighted, compare-reachable, worktree-listed, pane-can-see. Seeded word: **blindsided** / #93786 (worktree commits invisible). Path word: **compare-ref-unreachable**. Product score: **blindside**. Never idle scoped / interdicted / interdict / chrome-prohibit-bleed / duplex / simplexed / simplex / mobile-uplink-silent / keyed / deadkeyed / deadkey / esc-csi-dead / gleaned / orphaned / gleaner / unreaped-ampersand / live / schismed / schism / resume-while-live / intact / rasured / rasure / creation-time-flip / swept / ashpanned / ashpan / orphan-jsonl / credentialed / outridden / outrider / early-connect / attested / necrologized / necrology / incomplete-listing / named / innominate / icon-only / lit / snuffed / snuffer / pledged / swapped / changeling / distinct / collided / homograph / carrier / deadair / squelch / aphonia / muzzle / leaking / excised / lazaret / mondegreen / deadletter.

Phrase: **Score blindside or admit sighted.**

- **sighted** = IDLE: HOLD; compare ref / owned worktrees reachable from the diff pane
- **blindsided** = #93786 seeded path: committed worktree work invisible to the pane
- **blindside** = product score word for the sideline-scout booth
- **compare-ref-unreachable** = path word: compare side sits off the field of view
- **hold** = HOLD alias for idle sighted
- **worktree-owned** = Claude Code owns `.claude/worktrees/`; agents commit there
- **pane-empty** = pane reports "no changes" while watching session cwd
- **commits-present** = `git diff main...slice-118-readout-elicitation-register --stat` shows 5 files
- **compare-ref** = no control to choose the compare ref, only the base
- **has-repro** = published shape: pane empty; CLI `--stat` live; worktree list shows the slice
- **cousins** = cite-only #65852 #52179 — do not rebuild
- **backups** = cite-only #93778 #93766 #93764 #93754 #93751 #93744 #93772 #93770 #93777 #93782 #93800 #93795 #93821 #93811 #93809 #93834 #93823 #93825 #93797 #93780 #93779 #93776 #93769 — do not auto-pick
- **fixtures** = night turf / chalk hash / floodlight / scout clipboard / sideline hash
- **walk** = published idle sighted → compare-ref-unreachable → blindsided → blindside

Verdicts: sighted, blindsided, blindside, compare-ref-unreachable, hold, worktree-owned, pane-empty, commits-present, compare-ref, has-repro, cousins, backups, fixtures, walk.

This is a diagnostic scoring booth. Not an exploit. No Claude sessions. No secrets. No network to Anthropic required for scoring. Score whether the booth is **blindsided** / **blindside** or already **sighted**. Fixtures use the issue's published incident only. Do NOT implement a fix in anthropics/claude-code.

Hypothesis only (NON-BINDING): the diff pane is rooted to session cwd and exposes base selection but not compare-ref / owned-worktree selection, so committed work in `.claude/worktrees/*` is unreachable. Invite verify against #93786 text only. Do not claim a root cause in Claude Code source you have not seen.

## Research brief

Sources:

- Primary: [anthropics/claude-code#93786](https://github.com/anthropics/claude-code/issues/93786)
- Cite-only cousins: #65852 (undisclosed base / phantom changes). Distinct: here the base is right and the count is honestly zero. #52179 (uncommitted working-tree diff). Distinct: these changes are committed, so that view would also be empty. Do not rebuild.
- Backups (data only; next focus only — do not auto-pick): #93778, #93766, #93764, #93754, #93751, #93744, #93772, #93770, #93777, #93782, #93800, #93795, #93821, #93811, #93809, #93834, #93823, #93825, #93797, #93780, #93779, #93776, #93769

What happened (from the issue text — do not invent):

- OPEN
- Labels: enhancement, platform:macos, area:agents, area:desktop
- Environment: Claude Code 2.1.267, Desktop app; macOS 26.6.2 (build 25G83); git 2.54.0 (Apple Git-157)
- Claude Code creates subagent worktrees under `.claude/worktrees/`, a directory it owns
- Work those agents commit is invisible to the session's diff pane
- The pane looks at the directory the session is rooted in and offers no way to select a compare ref
- Pane reports "no changes" while several commits exist in the same repository
- Session stays on `main`; implementation agent committed six times on `slice-118-readout-elicitation-register`
- `git diff main...slice-118-readout-elicitation-register --stat` shows 5 files, 1726 insertions, 29 deletions
- `git worktree list` shows the worktree at `.claude/worktrees/slice-118-readout-elicitation-register`
- Not #65852 (undisclosed base) and not #52179 (uncommitted changes). Work is committed; base is correct; compare side unreachable
- A second symptom: the PR bar also stays blank when a PR is open for the worktree branch while the session stays on main

Problem found: DIFF PANE CANNOT SEE COMMITTED SUBAGENT WORKTREE WORK; COMPARE REF UNREACHABLE.

Why this solution: living catalog page + node diagnostic encoding idle **sighted** / seeded **blindsided** / path **compare-ref-unreachable** so operators can score whether the booth is a **blindside** or already **sighted**. Not a Claude Code patch.

Desired (from the issue, scoring narrative only — DO NOT implement a Claude Code fix):

1. The pane lists worktrees under `.claude/worktrees/` and lets the user view one, since Claude Code created them
2. The pane lets the user choose the compare ref, not only the base, so a branch checked out in a sibling worktree is reachable
3. The pane says which refs it is comparing and that nothing else in this repository is being shown, so an empty result is legible

## Why not a clone

This is specifically: **DIFF PANE CANNOT SEE COMMITTED SUBAGENT WORKTREE WORK; COMPARE REF UNREACHABLE.**

Novel paradigm: sideline-scout / blind-side-tackle / peripheral-vision booth — the play happens off the hash the clipboard watches.

**NOT Interdict/#93798** (claude-in-chrome MCP Prohibited language covers Bash/SSH). Different defect. NOT papal vellum / wax seal / diocese. Do not reuse scoped / interdicted / chrome-prohibit-bleed.

**NOT Simplex/#93801** (mobile Remote Control send vanishes while desktop→phone still reads). Different defect. NOT radio chassis / RX downlink / TX uplink / PTT. Do not reuse duplex / simplexed / mobile-uplink-silent.

**NOT Deadkey/#93788** (ESC-CSI keys dead in the 2.1.269 composer). Different defect. NOT typewriter platen / dead-key lever. Do not reuse keyed / deadkeyed / esc-csi-dead.

**NOT Gleaner/#93794** (unreaped Bash `&` jobs reparented to PID 1). Different defect. NOT wheat/field leftover-harvest. Do not reuse gleaned / orphaned / unreaped-ampersand.

**NOT Schism/#93797** (SendMessage to a LIVE Workflow agent resumes a second copy). Different defect. NOT twin glass / dual-writer. Do not reuse live / schismed / resume-while-live.

**NOT Rasure/#93791** (`~/.claude` wipe + CreationTime flip). Different defect. NOT parchment rasure / wholesale recreate. Do not reuse intact / rasured / creation-time-flip.

**NOT Ashpan/#93780** (delete_session leftover jsonl). Different defect. NOT industrial grate / ashpan / foundry. Do not reuse swept / ashpanned / orphan-jsonl.

**NOT Outrider / Necrology / Innominate / Snuffer / Changeling / Homograph / Galley / Aphonia / Muzzle / Lazaret / Mondegreen / Deadletter**. Different defects. Related worktree booths exist for OTHER defects (stale main, lock release, GC remound, CLAUDE.md cutaway, isolation packing, sandbox mondegreen, deadletter receipts) — do not reuse their metaphors or idle/seed words. Do not rebuild.

Do NOT rename Blindside to any existing catalog slug. Catalog currently has 317 products; Blindside is #318 after Interdict #317.
Do NOT reuse idle scoped / interdicted / duplex / simplexed / keyed / deadkeyed / gleaned / orphaned / live / schismed / intact / rasured / swept / ashpanned / credentialed / outridden / attested / necrologized / named / innominate / lit / snuffed / pledged / swapped / distinct / collided / carrier / deadair / squelch.

Display here is **Bebas Neue**. Body is **Source Sans 3**. Mono is **IBM Plex Mono**.

Different surface: committed worktree compare-ref gap vs chrome MCP jurisdiction bleed vs mobile Remote Control uplink vanish vs ESC-CSI dead composer vs unreaped Bash `&` jobs.

Different UI: night turf / chalk hash / floodlight / scout clipboard / yard marker / sideline. Bebas Neue / Source Sans 3 / IBM Plex Mono. Night turf / chalk / flood amber / clip graphite. NOT papal vellum. NOT radio chassis. NOT typewriter platen. NOT wheat field. NOT twin glass. NOT parchment scrape. NOT foundry grate.

Different verbs: Admit sighted, Score blindside, Walk compare-ref-unreachable, Compare sighted / blindsided, Pin idle sighted, Pin seeded blindsided, Pin compare-ref-unreachable, Hold the sighted.

Different idle: **sighted**. Different #93786 seeded path: **blindsided**. HOLD: **sighted** / **hold**. ALARM: **blindsided** / **blindside** / **compare-ref-unreachable** / **pane-empty**. Path: **compare-ref-unreachable**.

## How to score

```bash
node --test projects/blindside/blindside.test.mjs
node projects/blindside/blindside.mjs projects/blindside/data/blindsided.json
echo '{"seed":"blindsided"}' | node projects/blindside/blindside.mjs
```

Open the living card at `projects/blindside/index.html` (or the live path `/blindside/`). Buttons: Admit sighted, Score blindside, Walk compare-ref-unreachable, Compare sighted / blindsided, Pin idle sighted, Pin seeded blindsided, Pin compare-ref-unreachable, Hold the sighted. Toggle chips for: compare-ref-unreachable, worktree-owned, pane-empty, commits-present, compare-ref — the score flips. Lay a fixture JSON on the scout clipboard. `?embed=1` hides chrome.

The booth reconstructs the reporter’s compare-ref-unreachable walk from the published #93786 text. This page did not run Claude.

## Live path

- Path gate: https://hermes-playground-green.vercel.app/blindside/
- Folder: `projects/blindside/`
