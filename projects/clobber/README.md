# Clobber

A **print-shop / overstrike / letterpress clobber lab** — forme plates, ink rails, inode stamp tags, deaf watchman's eyepiece, autosave clobber-stamp timeline, outside-workspace orphan sheet vs in-workspace recursive gallery — DM Serif Display + Figtree + JetBrains Mono — for a real Claude Code defect: **EDIT/WRITE REPLACE FILES VIA TEMP-FILE + RENAME (ATOMIC REPLACE). PATH UNCHANGED BUT THE INODE IS NEW, SO ANY WATCHER BOUND TO THE ORIGINAL INODE NEVER FIRES.** The editor keeps showing stale A and believes the buffer is clean; the user types A′; `files.autoSave` afterDelay writes A′ and silently destroys agent write B — no conflict dialog. A watchman who never sees the plate swap because the inode changed under him is not guarding the forme — he is already deaf. Score the notify or admit the agent edit already clobbered.

Primary:

- [anthropics/claude-code#92419](https://github.com/anthropics/claude-code/issues/92419) (OPEN, bug, has-repro, platform:macos, area:tools, platform:vscode, data-loss). Title: `Edit/Write replace files via rename (new inode), so editor file watchers never fire — external changes invisible, then clobbered by autosave`. Filed 2026-09-06. Reporter: troystribling.

15:50 clobber: a watchman who never sees the plate swap because the inode changed under him is not guarding the forme — he is already deaf. Score the notify or admit the agent edit already clobbered.

Idle word: **deaf**. Seeded state: **clobbered** / #92419 — inode BEFORE 5588409 → AFTER 5588677; autosave overwrites agent B with A′. Never idle as choking, retried, miscast, inherited, unguided, dropped, strobing, stolen, dawnlocked, or misaimed.

**Clobber** is overstrike work. Edit/Write swaps the plate (new inode) under a watchman bound to the old one. The editor never reloads B; the next autosave stamps A′ over the forme. Score whether a notify (in-place vs notified vs conflicted vs new-inode vs outside-workspace vs silent-loss) would stay deaf, notified, or leave the agent edit already clobbered.

- **deaf** = IDLE: inode-bound watcher never fires; plate already swapped
- **clobbered** = seeded word: autosave writes A′ over agent B; no conflict dialog
- **new-inode** = same path, different file object; 5588409 → 5588677
- **outside-workspace** = individual watch (e.g. `~/.claude/plans/`); reproduces every time
- **silent-loss** = no error, no prompt, nothing in the UI; B is lost
- **in-place** = contrast hold: write in place keeps the same inode
- **notified** = contrast hold: watcher fires / explicit change signal
- **conflicted** = contrast hold: conflict dialog before overwrite
- **ruled-out-or-workarounds** = not a race (#87056); in-workspace usually reloads; suggested in-place / copy-back / signal

Verdicts: deaf, clobbered, new-inode, outside-workspace, silent-loss, in-place, notified, conflicted, ruled-out-or-workarounds, cousins.

This is a diagnostic scoring assay. Not an exploit. No live Claude sessions. Score whether an inode-blind watcher would leave the forme deaf or already clobbered. Fixtures use the issue's measured inode pair, the six-step silent chain, the outside-workspace orphan sheet, and the suggested in-place / notify / conflict holds only.

Hypothesis only (NON-BINDING): Edit/Write atomic replace creates a new inode at the same path, so inode-bound editor watchers never fire; the dirty-buffer autosave then overwrites B without a conflict dialog. Verify against issue evidence only. Discard if issue evidence disagrees. Encoded from the issue body only. Do not invent runtime source claims.

## Research brief

Sources:

- Primary: [anthropics/claude-code#92419](https://github.com/anthropics/claude-code/issues/92419)

What happened (from the issue — do not invent):

- Environment: macOS **26.6.2**; VS Code **1.135.0**; Claude Code in the VS Code extension.
- Edit/Write tools write via temp-file + rename rather than modifying in place. The path is unchanged but the **inode is new**, so any watcher bound to the original inode never fires.
- Measured: inode BEFORE **5588409** → AFTER **5588677**. Same path, different file object.
- Failure chain (silent): (1) file open; buffer = A, clean; (2) agent writes B via atomic replace → disk = B, new inode; (3) inode-bound watcher never fires → editor still shows A and still considers the buffer clean; (4) user types → buffer A′ becomes dirty; (5) `files.autoSave: "afterDelay"` writes A′ ~1s later; (6) **B is lost.** No conflict dialog — the editor believes A′ descends from current disk state.
- Why intermittent: workspace folders get a *recursive directory* watcher, which does observe the rename, so in-workspace files usually reload. Files opened **outside** any workspace folder are watched individually and reproduce it every time — e.g. plan files under `~/.claude/plans/`.
- Repro: open a file outside the workspace; have Claude Code Edit it; `stat -f %i <path>` before/after → inode differs; editor does not reload; type a character; with autoSave on, the agent's edit is gone.
- Impact: silent data loss — no error, no prompt, nothing in the UI. Encountered on both a personal project and a workplace codebase.
- Suggested fix: write in place (open + truncate + write to the same inode); or copy content back into the original inode after the rename; or emit an explicit change signal that editors / IDE extensions can subscribe to.

Problem found: inode-blind watcher → autosave clobber.

Why this solution: a diagnostic scorer for the inode-blind watcher → autosave clobber chain, so a reader can pin idle deaf, seed clobbered, and score in-place / notified / conflicted against the published facts.

## Why not a clone

This is specifically: **Edit/Write atomic rename creates a new inode; inode-bound editor watchers never fire; autosave then silently destroys agent B.**

NOT Watchdog/#92424 — Workflow 180s stall-watchdog vs silent auto-compaction. Clobber is not a kennel.
NOT Understudy/#92426 — Agent() ignores the subagent definition under dispatch. Clobber is not a dressing-room.
NOT Fairlead/#92403 — URI scheme `file://`-only remote Explorer drop. Clobber is not a hawse-pipe.
NOT Stroboscope/#92395 — Desktop Code-tab Terminal panel flicker + focus steal. Clobber is not an optics strobe bench.
NOT Heliostat/#92389 — theme auto DECSET 2031. Clobber is not an observatory heliostat.
NOT Lethe/#92335 — Chrome silent re-auth. Clobber is not an underworld ferry.
NOT Frizzen/#92353 — UserPromptSubmit listed-but-never-invoked. Clobber is not a flintlock desk.
NOT Nixie/#92383 — auto-mode send_message 45s no-ack settle. Clobber is not a USPS nixie desk.
NOT Embrasure/#92365 — sandbox denyRead fail-open. Clobber is not a battlement.
NOT Elision/#92347 — summarize-up-to-here drops summaries. Clobber is not a blue-pencil folio.
NOT Graft/#92354 — plugin-cache copy-forward. Clobber is not an orchard grafting bench.
NOT Oubliette — cold-parent notice pit. Clobber is not a dungeon.
NOT Ephemera — five-minute wick folio rewrite. Clobber is not an archive atelier.
NOT Hellbox — sticky `CLAUDE_PROJECT_DIR` ENOENT composing-room scrap. Clobber is overstrike, not a hellbox melt.
NOT Frisket — press-resist bleed. Clobber is the deaf watchman after a plate swap, not a frisket mask.
Do NOT name this Watchdog, Understudy, Fairlead, Stroboscope, Heliostat, or any existing catalog slug.
Do NOT reuse idle choking / seeded retried / miscast / inherited / unguided / dropped / strobing / stolen / dawnlocked / misaimed.

Different surface: file watcher / inode / data-loss vs stall watchdog / casting / drag-drop URI / terminal focus.

Cousins cite-only (NOT primary):

- [#87056](https://github.com/anthropics/claude-code/issues/87056) OPEN — Concurrent editing race / collision detection. Related symptom / different root cause (race vs never-notified).

Product name stays **Clobber**. Do not rename to Watchdog, Understudy, Fairlead, Stroboscope, Heliostat, Lethe, Frizzen, Nixie, Embrasure, Elision, Graft, Hellbox, Frisket, or any existing catalog slug. Name/slug `clobber` confirmed unused in catalog.json.

Different UI: print-shop / overstrike / letterpress clobber lab — forme plates, ink rails, inode stamp tags, deaf watchman's eyepiece, autosave clobber-stamp timeline, orphan sheet vs recursive gallery. DM Serif Display + Figtree + JetBrains Mono. NOT Bricolage Grotesque / Karla / Fragment Mono (Watchdog kennel). NOT Bodoni Moda / Source Sans / IBM Plex (Understudy). NOT Fraunces / Outfit / Syne / Manrope. Stay OFF kennel slats / dressing-room call-board / hawse-pipe / optics strobe / rooftop observatory / underworld ferry / flintlock lockplate / postal pigeonholes / battlement merlons / blue-pencil folio / orchard cambium.

Different verbs: Score the notify, pin idle deaf, pin seeded clobbered, admit the agent edit already clobbered, flip inode vs orphan vs silent-loss vs in-place write, load fixtures, reset to notified.

Different idle: **deaf**. Different seeded: **clobbered**. Contrast: **in-place** / **notified** / **conflicted**.

## Live catalog path

`/clobber/` is this static print-shop scoring assay. Path `https://hermes-playground-green.vercel.app/clobber/` and subdomain `https://clobber.hermes-playground-green.vercel.app` are both fine. Demo works with no secrets and no live Claude sessions. Mark: `15:50 / hermes catalog #175 / #92419`. `?embed` or `?embed=1` hides chrome for the hub living featured well.

1. Seeded demo loads **clobbered** — autosave writes A′ over agent B; no conflict dialog.
2. Idle **deaf** → inode-bound watcher never fires; plate already swapped.
3. Contrast **in-place** → write in place keeps the same inode.
4. Contrast **notified** → watcher fires or explicit change signal.
5. Contrast **conflicted** → conflict dialog before overwrite.
6. Failure **new-inode** → 5588409 → 5588677; same path, different file object.
7. Failure **outside-workspace** → individual watch; `~/.claude/plans/`; every time.
8. Failure **silent-loss** → no error, no prompt; B is lost.
9. Assay UI: forme plates, ink rails, inode stamps, deaf eyepiece, clobber-stamp timeline, orphan vs gallery, six-step overstrike proofs.
10. Stay-off strip: Watchdog / Understudy / Fairlead / Stroboscope / Heliostat / Lethe / Frizzen / Nixie / Embrasure / Elision / Graft. Primary stays #92419.
11. **Score the notify** walks the probe ticket and lights chips on the board. Chip-switch every verdict. Paste or drop JSON. Assay simulator chips rewrite the press (inode / orphan / silent-loss / in-place).

## How to score

Open `projects/clobber/index.html` in a browser, or serve the repo root and visit `/clobber/` (Vercel rewrite → `/projects/clobber`). No build step.

```bash
# No live Claude sessions. The living page scores probes in-browser.
# Do not claim this guard ships in Claude Code.
```

Empty paste scores the idle **deaf** ticket if you pin idle. Paste a probe on the page or drop a fixture from `data/`. The living page seeds **clobbered** / inode 5588409 → 5588677 / autosave overwrites agent B with A′.
