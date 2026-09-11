# Petard

A **siege petard / powder-charge / sapper trench booth** — fuse rail, powder ledger, argv mirror, wrapper shell silhouette that blows back on the sapper. Fonts **Cinzel** (display) + **Exo 2** (body) + **Fira Code** (mono). Palette: night trench `#0B0F14`, powder ash `#C4B8A8`, fuse ember `#E85D04`, charge brass `#C9A227`, wrapper steel `#5B6B7A`, blast white `#F5F0E8`, danger red `#9B1D20`. NOT vellum/ink speech-break, NOT manor parchment, NOT flashback dusk, NOT sanctuary gilt, NOT cloister, NOT vault brass, NOT concert velvet.

A petard is a siege powder-charge: the sapper who lights `pkill -f` is hoisted by the wrapper argv that still holds the pattern.

Primary:

- [anthropics/claude-code#93607](https://github.com/anthropics/claude-code/issues/93607) (OPEN, bug, has repro, platform:linux, area:bash). Title: `[BUG] Bash tool (Linux): pkill -f / pgrep -f match the tool's own bash -c … eval wrapper (exit 144, phantom PIDs); 2.1.214 guard covers only the CLI process`. The Bash tool runs every command as `/bin/bash -c "… eval '<the command text>' …"` so the full command text lives in the argv of a live process for the call. On Linux, `pkill -f` / `pgrep -f` match against that argv. procps-ng / BusyBox exclude only the pgrep/pkill process itself, NOT the parent wrapper. Consequences: (1) `pkill -f "<pattern>"` kills the tool's own shell → Exit code 144 / is_error true; nothing after the pkill runs; (2) `pgrep -f` returns the wrapper's PID (changes every call → phantom PIDs); (3) a call whose real work succeeded can still be reported failed when cleanup uses `pkill -f`. Fix 2.1.214 only refuses when the pattern matches `$CLAUDE_PID` (CLI process); it does NOT check wrapper `$$`. `pgrep` is not wrapped. Interactive shells never hit this (typed command is not in interactive argv). macOS BSD pgrep/pkill exclude calling process AND ancestors, so the same command inside the Bash tool on macOS kills only the target. Repro (separate Bash tool calls on Linux): (1) `nohup sleep 3979 >/dev/null 2>&1 & echo started` (2) `pkill -f "sleep 3979"; echo still alive` → Exit 144, never prints still alive (3) `pgrep -af "sleep 3979"` → returns wrapper shell even with no sleep alive. Standalone docker repro across debian/ubuntu/fedora/amazonlinux/arch/alpine all kill wrapper; macOS does not. Bracket idiom `[3]979` only helps when the target started in an earlier call; same-call start+kill still dies. Cousins cite-only: #62297 (exit 144 meaning), #72153 #90070 (pkill over-matching other processes — different), #89496 (same wrapper from grep side).

21:50 petard: a siege petard / powder-charge booth for #93607. Idle **standing** / seeded **hoisted** / path **wrapper-argv**. Score petard or admit standing.

Score petard or admit standing.

Idle word: **standing** (HOLD: wrapper shell still alive; command completes; `still alive` prints). Seeded word: **hoisted** / #93607 (hoist with one's own petard: `pkill -f` kills the Bash-tool wrapper because the pattern sits in that wrapper's argv). Path word: **wrapper-argv**. Product score: **petard**. Never idle raised / seised / ordered / viewed / closed / sealed / voiced or seeded furled / disseised / redelivered / withheld / lingering / blanked / muted.

Phrase: **Score petard or admit standing.**

- **standing** = IDLE: HOLD; wrapper shell still alive; command completes; `still alive` prints
- **hoisted** = #93607 seeded path: `pkill -f` kills the wrapper because the pattern sits in argv
- **petard** = product score word for a siege powder-charge that blows back on the sapper
- **wrapper-argv** = path word: the full command text lives in the live wrapper argv
- **hold** = HOLD alias for idle standing
- **still-alive** = `echo still alive` printed after the pkill
- **exit-144** = Exit code 144; nothing after the pkill runs
- **is-error** = is_error true on a call whose cleanup used `pkill -f`
- **phantom-pid** = `pgrep -f` returns the wrapper PID even with no sleep alive
- **changing-pid** = wrapper PID changes every call
- **cli-guard-only** = 2.1.214 refuses only when the pattern matches `$CLAUDE_PID`
- **wrapper-unchecked** = the guard does NOT check wrapper `$$`
- **pgrep-unwrapped** = `pgrep` is not wrapped
- **argv-leak** = full command text lives in a live process argv
- **eval-in-argv** = `/bin/bash -c "… eval '<the command text>' …"`
- **linux-procps** = procps-ng excludes only pgrep/pkill itself, not the parent
- **busybox-match** = BusyBox same self-exclude-only behavior
- **macos-ancestors-ok** = macOS BSD excludes calling process AND ancestors
- **bracket-partial** = `[3]979` only helps when the target started in an earlier call
- **same-call-dies** = same-call start+kill still dies
- **from-file-ok** = interactive shells never hit this (typed command is not in interactive argv)
- **headless-repeat** = standalone docker repro across debian/ubuntu/fedora/amazonlinux/arch/alpine
- **has-repro** = published shape: start sleep / pkill -f / exit 144 / pgrep wrapper
- **cousins** = cite-only #62297 #72153 #90070 #89496 — do not rebuild
- **backups** = cite-only #93595 #93585 #93570 — do not auto-pick
- **fixtures** = fuse rail / powder ledger / argv mirror / wrapper silhouette / sapper trench
- **walk** = published idle standing → start sleep → pkill -f pattern → wrapper killed → exit 144 → still-alive missing → pgrep returns wrapper → phantom/changing PID → 2.1.214 CLI-only guard → macOS ancestors OK → bracket only helps cross-call → same-call dies → wrapper-argv → petard

Verdicts: standing, hoisted, petard, wrapper-argv, hold, still-alive, exit-144, is-error, phantom-pid, changing-pid, cli-guard-only, wrapper-unchecked, pgrep-unwrapped, argv-leak, eval-in-argv, linux-procps, busybox-match, macos-ancestors-ok, bracket-partial, same-call-dies, from-file-ok, headless-repeat, has-repro, cousins, backups, fixtures, chips, fingerprints, walk.

This is a diagnostic scoring booth. Not an exploit. No live Claude sessions. No secrets. No network to Anthropic required for scoring. Score whether the charge is **hoisted** / **petard** or already **standing**. Fixtures use the issue's published incident only. Do NOT implement a fix in anthropics/claude-code.

Hypothesis only (NON-BINDING): command text should leave argv (env/stdin/tempfile) or pkill/pgrep guards must cover wrapper `$$`. Invite verify against #93607 text only. Do not claim a root cause in Claude Code source you have not seen.

## Research brief

Sources:

- Primary: [anthropics/claude-code#93607](https://github.com/anthropics/claude-code/issues/93607)
- Cite-only cousin: [anthropics/claude-code#62297](https://github.com/anthropics/claude-code/issues/62297) (exit 144 meaning — different)
- Cite-only cousins: #72153, #90070 (pkill over-matching other processes — different), #89496 (same wrapper from grep side)
- Backup (data only): #93595 (plugin HTTP MCP `${VAR}` header expands empty → 401; alt Nullarbor), #93585 (cloud session stale local branch after pre-warm; alt Anachronism), #93570 (single-task shutdown terminates all; alt Overkill)

What happened (from the issue text — do not invent):

- OPEN. Labels: bug, has repro, platform:linux, area:bash.
- Bash tool runs every command as `/bin/bash -c "… eval '<the command text>' …"` so the full command text lives in the argv of a live process for the call
- On Linux, `pkill -f` / `pgrep -f` match against that argv
- procps-ng / BusyBox exclude only the pgrep/pkill process itself, NOT the parent wrapper
- `pkill -f "<pattern>"` kills the tool's own shell → Exit 144 / is_error true; nothing after the pkill runs
- `pgrep -f` returns the wrapper's PID (changes every call → phantom PIDs)
- A call whose real work succeeded can still be reported failed when cleanup uses `pkill -f`
- Fix 2.1.214 only refuses when the pattern matches `$CLAUDE_PID` (CLI process); it does NOT check wrapper `$$`
- `pgrep` is not wrapped
- Interactive shells never hit this (typed command is not in interactive argv)
- macOS BSD pgrep/pkill exclude calling process AND ancestors, so the same command inside the Bash tool on macOS kills only the target
- Repro (separate Bash tool calls on Linux): (1) `nohup sleep 3979 >/dev/null 2>&1 & echo started` (2) `pkill -f "sleep 3979"; echo still alive` → Exit 144, never prints still alive (3) `pgrep -af "sleep 3979"` → returns wrapper shell even with no sleep alive
- Standalone docker repro across debian/ubuntu/fedora/amazonlinux/arch/alpine all kill wrapper; macOS does not
- Bracket idiom `[3]979` only helps when the target started in an earlier call; same-call start+kill still dies

Problem found: PKILL -F / PGREP -F MATCH THE BASH-TOOL WRAPPER ARGV ON LINUX → Exit 144, still alive missing, phantom PIDs; 2.1.214 guard covers only $CLAUDE_PID.

Why this solution: a living catalog page + small node diagnostic that encodes the defect as idle/seeded/path verdicts so operators can score whether the wrapper stayed **standing** or was **hoisted**. Educational siege-petard booth for the catalog. Not a Claude Code fix.

Desired (from the issue, scoring narrative only — DO NOT implement a Claude Code fix):

1. Command text should leave argv (env/stdin/tempfile), or pkill/pgrep guards must cover wrapper `$$`

## Why not a clone

This is specifically: **BASH TOOL (LINUX): PKILL -F / PGREP -F MATCH THE TOOL'S OWN BASH -C … EVAL WRAPPER (EXIT 144, PHANTOM PIDS); 2.1.214 GUARD COVERS ONLY THE CLI PROCESS.**

**NOT Aposiopesis/#93588** (statusLine git-cwd mute). Different defect. NOT vellum/ink speech-break.

**NOT Disseisin/#93574** (Cowork VM-home evaporation / ghost connected folder). Different defect. NOT manor parchment.

**NOT Analepsis/#93569** (Desktop feed redelivery behind `background_tasks_redelivered`). NOT flashback dusk.

**NOT Monstrance/#93563** (Artifact read binds withdrawn native WebFetch). NOT sanctuary gilt.

**NOT Compline/#93549** (remote-control bridge never sends `end_session`). NOT cloister.

**NOT Cipherlock/#93537** (concurrent Keychain wipe). NOT vault brass.

**NOT Mondegreen/#93193** (false-block on substring `git` in English prose). Different isolation:worktree hear. Do not rebuild.

**NOT Seizing** (EDR hard-link nlink identity). Different nlink / alias path. Do not rebuild.

**NOT Hangfire** (scheduled-task hangfire paradigm). Do not rebuild.

**NOT Flashpan** (flintlock flash-pan / lastRunAt flash-without-discharge). Do not rebuild.

**NOT Frizzen** (flintlock frizzen / scheduled-fire paradigm). Do not rebuild.

**NOT #62297** — exit 144 meaning. Cite only.

**NOT #72153 / #90070** — pkill over-matching other processes. Different: other processes, not the tool's own wrapper. Cite only.

**NOT #89496** — same wrapper from grep side. Cite only.

Do NOT rename Petard to any existing catalog slug. Catalog currently has 292 products; Petard is #293.
Do NOT reuse idle raised / seised / ordered / viewed / closed / sealed / voiced, or seeded furled / disseised / redelivered / withheld / lingering / blanked / muted.
Display here is **Cinzel**. Body is **Exo 2**. Mono is **Fira Code**.

Different surface: Linux Bash-tool pkill -f wrapper-argv hoist vs statusLine git-cwd never-spawn vs Cowork VM-home evaporation vs Desktop Code-tab feed redelivery vs substring `git` false-block vs EDR hard-link nlink vs flintlock lastRunAt.

Different UI: fuse rail / powder ledger / argv mirror / wrapper shell silhouette / sapper trench. Cinzel / Exo 2 / Fira Code. Night trench with fuse ember and blast white. NOT speech-break vellum. NOT manor roll. NOT flashback dusk. NOT sanctuary night. NOT cloister dusk. NOT bank vault. NOT concert velvet.

Different verbs: Light the fuse, Score petard, Blow the charge, Compare standing / hoisted, Pin idle standing, Pin seeded hoisted, Pin wrapper-argv, Hold the wrapper.

Different idle: **standing**. Different #93607 seeded path: **hoisted**. HOLD: **standing** / **hold**. ALARM: **hoisted** / **petard** / **wrapper-argv** / **exit-144**. Path: **wrapper-argv**.

## How to score

```bash
node --test projects/petard/petard.test.mjs
node projects/petard/petard.mjs projects/petard/data/hoisted.json
echo '{"seed":"hoisted"}' | node projects/petard/petard.mjs
```

Open the living card at `projects/petard/index.html` (or the live path `/petard/`). Buttons: Light the fuse, Score petard, Blow the charge, Compare standing / hoisted, Pin idle standing, Pin seeded hoisted, Pin wrapper-argv, Hold the wrapper. Toggle chips for: wrapper alive, still alive, pkill -f, exit 144, argv leak, CLI guard only, macOS ancestors, same-call dies — the score flips. Lay a fixture JSON on the powder blotter. `?embed=1` hides chrome.

The booth reconstructs the reporter’s hoisted walk from the published #93607 text. This page did not run Claude live.

## Live path

- Path gate: https://hermes-playground-green.vercel.app/petard/
- Folder: `projects/petard/`
