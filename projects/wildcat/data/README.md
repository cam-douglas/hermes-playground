# Wildcat fixtures

Diagnostic JSON only. No live Claude sessions. Encoded from #92399 issue facts: when Bash is called with `run_in_background: true` and the command itself spawns detached children via `nohup <cmd> > log 2>&1 &`, the harness reports the background task as **completed** as soon as the parent shell exits, even though the children keep running. A follow-up `ps aux | grep <cmd>` right after the completion notification sometimes showed **no** matching processes, so the model concluded the launch failed and relaunched the same workers. The original children were in fact alive (later ps showed two processes for the same `--worker-id`); both generations wrote to the same output file concurrently, producing ~1.8x duplicate rows. When the clutch drops, the wildcat keeps freewheeling — the deck bell already rang completed. Score the descendants or admit the writers already doubled.

Idle word: **freewheeling**. Seeded word: **doubled**. Contrast: **shell-exit-only** / **work-finished** / **descendant-count-at-exit** / **delayed-ps-recheck**. Failure rows: **visibility-lag** / **shell-exit**. Primary: [anthropics/claude-code#92399](https://github.com/anthropics/claude-code/issues/92399). Seed primary as doubled / freewheeling wildcat / completed ~1s exit 0 / immediate ps miss / ~1.8x duplicate rows.

| File | Verdict | What it scores |
|---|---|---|
| `freewheeling.json` | freewheeling | Idle windlass fence. Clutch dropped; wildcat still spinning; bell already rang completed. |
| `doubled.json` | doubled | Seeded #92399. Immediate ps miss → relaunch → two crews on one hawser → ~1.8x duplicate rows. |
| `92399.json` | doubled | Primary fixture alias for #92399. |
| `repro.json` | doubled | Published minimal repro: nohup tick loop, completed ~1s exit 0, immediate ps miss, log grows 60s. |
| `shell-exit.json` | shell-exit-only | Contrast hold. Completed means parent shell exited; docs should say so. |
| `work-finished.json` | work-finished | Contrast hold. Completion means the work finished. |
| `descendants.json` | descendant-count-at-exit | Contrast hold. Report live descendants at parent-shell exit. |
| `delayed-ps.json` | delayed-ps-recheck | Contrast hold. Re-check ps after a few seconds before assuming launch failed. |
| `visibility-lag.json` | visibility-lag | Immediate ps empty; wait ~5s and the process is listed. |
| `ruled-out-or-workarounds.json` | freewheeling | Never nest nohup…&; not timeout cousin #88702; not opposite polarity #91869. |
| `cousins.json` | stay-off | Cite-only cousins #88702 #91869 #88048 #87689 #91225. |
| `fixtures.json` | index | Row list for the windlass / wildcat / freewheel lab. |

Drop any file onto `projects/wildcat/index.html` or paste the JSON. The living page seeds **doubled** / completed ~1s / immediate ps miss / ~1.8x duplicate rows.
