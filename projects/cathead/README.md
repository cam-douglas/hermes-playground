# Cathead

A **ship’s bow cathead / anchor-timber / PTY-slot booth** — oak bow timber projecting from the stem, iron ring and cat-block, anchor stock half-catted, PTY slot-vector gauge marked in multiples of 16, placeholder `cat` line coiled on the timber, respawn lever (`-k`), ENXIO flare when the free races the grow, kernel log strip (`ptmx_get_ioctl … out of range`), tmux pane schematic (placeholder → kill → forkpty). Fonts **Literata** (display/serif) + **Sora** (body) + **Red Hat Mono** (mono). Palette: deep hull navy `#071828`, oak varnish `#9A6B3A`, wrought-iron `#2C3036`, signal red `#E23B3B`, seafoam `#3BBFA0`, brass fittings `#D6B15A`. NOT film continuity, NOT saltbush plain, NOT siege petard, NOT manuscript vellum, NOT manor roll.

A cathead is the oak timber that seats the anchor: the pane should hang from the bow; instead the placeholder `cat` frees mid-open at a 16-slot boundary and the cathead drops the new pane with ENXIO.

Primary:

- [anthropics/claude-code#93624](https://github.com/anthropics/claude-code/issues/93624) (OPEN). Title: `[Bug] macOS: teammate spawn "fork failed: Device not configured" — xnu ptmx slot-vector race triggered by cat placeholder + respawn-pane -k (root cause for #77211)`. TmuxBackend does `split-window … -- cat` (placeholder occupies one PTY) then `respawn-pane -k` which closes the placeholder master and immediately forkpty’s the replacement. On xnu, opening `/dev/ptmx` is two non-atomic steps (`ptmx_clone` picks minor; `ptmx_get_ioctl` grows by `PTMX_GROW_VECTOR=16` only if `pis_free==0`). When system-wide PTY usage is exactly vector_size−1, the placeholder fills the last slot, clone picks `pis_total`, the freed placeholder slot makes `pis_free==1` so grow is skipped → minor out of range → ENXIO. Vector never shrinks; every retry fails identically. Evidence: 6/6 spawn failures with kernel log `ptmx_get_ioctl failed because minor number 96 was out of range`; deterministic repro at boundary−1; plain forkpty→close→openpty fails; close→wait for child exit→openpty succeeds; ±1 PTY succeeds; second respawn-pane on a failed pane can crash tmux 3.6a. Env: Darwin 25.5.0 arm64, tmux 3.6a, Claude Code 2.1.268, teammateMode: `tmux`. Cousin cite-only: #77211 (closed stale, same symptom). Backups cite-only: #93615 (scheduled WebSearch hangs), #93570 (single-task shutdown kills all), #93589 (Cowork egress additional domains ignored), #93618 (Windows/Git Bash ~8175 truncation + backslash), #93622 (channel messages merge lose prompt cache), #93652 (Remote Control capacity silent session substitution).

01:50 cathead: a ship’s bow cathead / anchor-timber booth for #93624. Idle **seated** / seeded **raced** / path **ptmx-race**. Score cathead or admit seated.

Score cathead or admit seated.

Idle word: **seated** (HOLD: cathead timber holds the new pane; no placeholder-cat + respawn-pane -k race; forkpty opens a live PTY). Seeded word: **raced** / #93624 (cat placeholder frees mid-open at a 16-slot boundary; grow skipped; ENXIO). Path word: **ptmx-race**. Product score: **cathead**. Never idle tip / stamped / standing / raised / seised / ordered / viewed / closed / sealed / voiced or seeded stale / emptied / hoisted / furled / disseised / redelivered / withheld / lingering / blanked / muted.

Phrase: **Score cathead or admit seated.**

- **seated** = IDLE: HOLD; cathead timber holds the new pane; no placeholder-cat + respawn-pane -k race; forkpty opens a live PTY
- **raced** = #93624 seeded path: placeholder frees mid-open at a 16-slot boundary; grow skipped; ENXIO
- **cathead** = product score word for a dropped pane at the bow timber
- **ptmx-race** = path word: `ptmx_clone` picks `pis_total`; freed placeholder skips grow
- **hold** = HOLD alias for idle seated
- **enxio** = `fork failed: Device not configured` after `ptmx_get_ioctl` rejects the minor
- **placeholder-cat** = `split-window -d … -- cat` occupies one PTY
- **respawn-kill** = `respawn-pane -k` closes the placeholder master then forkpty’s immediately
- **slot-boundary** = system-wide PTY usage is exactly vector_size−1
- **grow-skipped** = `pis_free==1` after placeholder close so `PTMX_GROW_VECTOR` grow is skipped
- **pis-total** = `ptmx_clone` picks `pis_total` after the last slot fills
- **vector-16** = `PTMX_GROW_VECTOR=16`; vector never shrinks; 6/6 spawn failures
- **forkpty-race** = forkpty→close→openpty fails; close→wait for child exit→openpty succeeds
- **wait-exit-ok** = expected: kill placeholder and wait for pid before respawn
- **pregrow-workaround** = user workaround: ~512 ptmx open/close once per boot
- **in-process-mode** = user workaround: `teammateMode: "in-process"`
- **has-repro** = published shape: Darwin 25.5.0 arm64 / tmux 3.6a / Claude Code 2.1.268 / teammateMode tmux / 6/6 ENXIO / minor 96
- **cousins** = cite-only #77211 — do not rebuild
- **backups** = cite-only #93615 #93570 #93589 #93618 #93622 #93652 — do not auto-pick
- **fixtures** = oak cathead timber / slot-vector gauge / placeholder cat line / respawn lever / kernel log strip
- **walk** = published idle seated → placeholder cat → remain-on-exit failed → respawn-kill → pis-total → grow-skipped → ENXIO → vector-16 retry → forkpty-race → wait-exit expected → ptmx-race → cathead

Verdicts: seated, raced, cathead, ptmx-race, hold, enxio, placeholder-cat, respawn-kill, slot-boundary, grow-skipped, pis-total, vector-16, forkpty-race, wait-exit-ok, pregrow-workaround, in-process-mode, has-repro, cousins, backups, fixtures, chips, fingerprints, walk.

This is a diagnostic scoring booth. Not an exploit. No live Claude sessions. No secrets. No network to Anthropic required for scoring. Score whether the pane is **raced** / **cathead** or already **seated**. Fixtures use the issue's published incident only. Do NOT implement a fix in anthropics/claude-code.

Hypothesis only (NON-BINDING): if TmuxBackend avoided cat+respawn-pane -k (direct split-window command, or wait-for-placeholder-exit before respawn, or ENXIO-triggered forced vector grow on a fresh pane), the race would not fire. Invite verify against #93624 text only. Do not claim a root cause in Claude Code source you have not seen.

## Research brief

Sources:

- Primary: [anthropics/claude-code#93624](https://github.com/anthropics/claude-code/issues/93624)
- Cite-only cousins: #77211 (closed stale, same teammate spawn ENXIO symptom)
- Backups (data only): #93615 (scheduled WebSearch hangs), #93570 (single-task shutdown kills all), #93589 (Cowork egress additional domains ignored), #93618 (Windows/Git Bash ~8175 truncation + backslash), #93622 (channel messages merge lose prompt cache), #93652 (Remote Control capacity silent session substitution)

What happened (from the issue text — do not invent):

- OPEN.
- macOS teammate spawn fails with `fork failed: Device not configured` (ENXIO)
- TmuxBackend: `split-window -d … -- cat` → `set-option -p remain-on-exit failed` → `respawn-pane -k -t pane -- teammate cmd`
- xnu `bsd/kern/tty_ptmx.c` — `ptmx_clone` + `ptmx_get_ioctl` race; `PTMX_GROW_VECTOR` 16; `XXX We fall off the end here`; ENXIO / Device not configured
- 6/6 spawn failures with kernel log `ptmx_get_ioctl failed because minor number 96 was out of range`
- Deterministic repro at boundary−1; plain forkpty→close→openpty fails; close→wait for child exit→openpty succeeds; ±1 PTY succeeds
- Second respawn-pane on a failed pane can crash tmux 3.6a
- Env: Darwin 25.5.0 arm64, tmux 3.6a, Claude Code 2.1.268, teammateMode: `tmux`
- Suggested (hypotheses only): spawn teammate directly in split-window (no cat/respawn); kill placeholder and wait for pid before respawn; detect ENXIO and force vector grow via open+close extra `/dev/ptmx` then retry on a fresh pane
- User workaround: pre-grow vector once per boot (~512 ptmx open/close); or `teammateMode: "in-process"`

Problem found: MACOS TEAMMATE SPAWN FORK FAILED DEVICE NOT CONFIGURED — xnu ptmx slot-vector race triggered by cat placeholder + respawn-pane -k.

Why this solution: a living catalog page + small node diagnostic that encodes the defect as idle/seeded/path verdicts so operators can score whether the pane stayed **seated** or went **raced**. Educational bow-cathead booth for the catalog. Not a Claude Code fix.

Desired (from the issue, scoring narrative only — DO NOT implement a Claude Code fix):

1. Spawn teammate directly in split-window, or wait for the placeholder pid before respawn, or force a vector grow on ENXIO and retry on a fresh pane

## Why not a clone

This is specifically: **MACOS TEAMMATE SPAWN FORK FAILED DEVICE NOT CONFIGURED — XNU PTMX SLOT-VECTOR RACE TRIGGERED BY CAT PLACEHOLDER + RESPAWN-PANE -K.**

Novel paradigm: xnu `/dev/ptmx` clone/get_ioctl race at a 16-slot boundary (placeholder occupies the last slot, then frees it mid-open).

**NOT Anachronism/#93585** (cloud pre-warm vs session-start checkout race). Different defect. NOT continuity slate / darkroom. Do not reuse tip / stale / prewarm-latch.

**NOT Nullarbor/#93595** (plugin HTTP MCP `${VAR}` header expands empty). Different defect. NOT saltbush / empty-bearer. Do not reuse stamped / emptied / empty-expand.

**NOT Petard/#93607** (Linux Bash-tool `pkill -f` matches wrapper argv). Different defect. NOT siege petard. Do not reuse standing / hoisted / wrapper-argv.

**NOT Aposiopesis/#93588** (statusLine git-cwd mute). Different defect. NOT vellum/ink speech-break.

**NOT Disseisin/#93574** (Cowork VM-home evaporation / ghost connected folder). Different defect. NOT manor parchment.

**NOT Analepsis/#93569** (Desktop feed redelivery behind `background_tasks_redelivered`). NOT flashback dusk.

**NOT Monstrance/#93563** (Artifact read binds withdrawn native WebFetch). NOT sanctuary gilt.

**NOT Compline/#93549** (remote-control bridge never sends `end_session`). NOT cloister.

**NOT Cipherlock/#93537** (concurrent Keychain wipe). NOT vault brass.

**NOT Attainder/#93529** (parked-permission retirement stamps user-rejected). NOT court parchment.

**NOT Sourdine/#93531** (MessageDisplay mid-narration mute). NOT concert mute.

**NOT Forksink/#93458** (SessionStart additionalContext dropped on fork). NOT storm drain.

**NOT Foxfire/#93502** (Remote Control paints without starting a turn). NOT marsh lantern.

**NOT Pentimento/#93482** (Cowork overwrite one-behind). NOT underpainting.

**NOT Vinculum/#93485** (local-agent hardlink nlink>1). NOT chain-forge.

**NOT Cachet/#93490** (Fable resume string-carrier). NOT wax blotter.

**NOT Strobe/#93468** (off-label ScheduleWakeup). NOT hangar beacon.

**NOT Counterfoil/#93446** (headers-hash). NOT cheque foil.

**NOT #77211** — closed stale, same teammate spawn ENXIO symptom. Cite only.

Do NOT rename Cathead to any existing catalog slug. Catalog currently has 295 products; Cathead is #296.
Do NOT reuse idle tip / stamped / standing / raised / seised / ordered / viewed / closed / sealed / voiced, or seeded stale / emptied / hoisted / furled / disseised / redelivered / withheld / lingering / blanked / muted.
Display here is **Literata**. Body is **Sora**. Mono is **Red Hat Mono**.

Different surface: xnu ptmx slot-vector race vs cloud pre-warm checkout vs empty-bearer MCP headers vs Linux Bash-tool pkill wrapper-argv vs statusLine git-cwd never-spawn vs Cowork VM-home evaporation.

Different UI: oak cathead timber / iron cat-block / slot-vector gauge / coiled cat line / respawn lever / kernel log strip. Literata / Sora / Red Hat Mono. Hull navy with oak varnish, wrought-iron, signal red, seafoam, brass fittings. NOT darkroom film. NOT saltbush dusk. NOT siege trench. NOT speech-break vellum. NOT manor roll.

Different verbs: Seat the cathead, Score cathead, Coil the cat line, Compare seated / raced, Pin idle seated, Pin seeded raced, Pin ptmx-race, Hold the seated.

Different idle: **seated**. Different #93624 seeded path: **raced**. HOLD: **seated** / **hold**. ALARM: **raced** / **cathead** / **ptmx-race** / **placeholder-cat**. Path: **ptmx-race**.

## How to score

```bash
node --test projects/cathead/cathead.test.mjs
node projects/cathead/cathead.mjs projects/cathead/data/raced.json
echo '{"seed":"raced"}' | node projects/cathead/cathead.mjs
```

Open the living card at `projects/cathead/index.html` (or the live path `/cathead/`). Buttons: Seat the cathead, Score cathead, Coil the cat line, Compare seated / raced, Pin idle seated, Pin seeded raced, Pin ptmx-race, Hold the seated. Toggle chips for: placeholder cat, respawn -k, slot boundary, grow skipped, ENXIO, forkpty race, wait exit, pregrow — the score flips. Lay a fixture JSON on the hawse blotter. `?embed=1` hides chrome.

The booth reconstructs the reporter’s ENXIO walk from the published #93624 text. This page did not run Claude live.

## Live path

- Path gate: https://hermes-playground-green.vercel.app/cathead/
- Folder: `projects/cathead/`
