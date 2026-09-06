# Clobber fixtures

Diagnostic JSON only. No live Claude sessions. Encoded from #92419 issue facts: Edit/Write replace files via temp-file + rename (atomic replace). Path unchanged but the inode is new, so any watcher bound to the original inode never fires. The editor keeps showing stale content A and believes the buffer is clean; the user types A′; `files.autoSave` afterDelay writes A′ and silently destroys agent write B — no conflict dialog. A watchman who never sees the plate swap because the inode changed under him is not guarding the forme — he is already deaf. Score the notify or admit the agent edit already clobbered.

Idle word: **deaf**. Seeded word: **clobbered**. Contrast: **in-place** / **notified** / **conflicted**. Failure rows: **new-inode** / **outside-workspace** / **silent-loss**. Primary: [anthropics/claude-code#92419](https://github.com/anthropics/claude-code/issues/92419). Seed primary as clobbered / inode BEFORE 5588409 → AFTER 5588677 / autosave overwrites B with A′.

| File | Verdict | What it scores |
|---|---|---|
| `deaf.json` | deaf | Idle forme fence. Inode-bound watcher never fires; the watchman is already deaf. |
| `clobbered.json` | clobbered | Seeded #92419. Autosave writes A′ over agent B. Admit the agent edit already clobbered. |
| `92419.json` | clobbered | Primary fixture alias for #92419. |
| `repro.json` | clobbered | Published outside-workspace repro: open orphan sheet, Edit, `stat -f %i` inode differs, type a character, autoSave destroys B. |
| `new-inode.json` | new-inode | Same path, new file object. inode BEFORE 5588409 → AFTER 5588677. |
| `outside-workspace.json` | outside-workspace | Individual watch on files outside any workspace folder (e.g. `~/.claude/plans/`) reproduces every time. |
| `silent-loss.json` | silent-loss | No error, no prompt, nothing in the UI. B is lost. |
| `in-place.json` | in-place | Contrast hold. Write in place (open + truncate + write) keeps the same inode. |
| `notified.json` | notified | Contrast hold. Watcher fires, or an explicit change signal reaches the editor. |
| `conflicted.json` | conflicted | Contrast hold. Conflict dialog before overwrite. |
| `ruled-out-or-workarounds.json` | deaf | In-workspace recursive gallery usually reloads; this is not a race (#87056); suggested remediations are in-place / copy-back / explicit signal. |
| `cousins.json` | stay-off | Cite-only cousin #87056 (race / collision detection — same symptom, different root cause). |
| `fixtures.json` | index | Row list for the print-shop / overstrike / letterpress clobber lab. |

Drop any file onto `projects/clobber/index.html` or paste the JSON. The living page seeds **clobbered** / inode 5588409 → 5588677 / autosave overwrites agent B with A′.
