# Almanac hook

Tiny feast-page scorer for a source-of-truth split: the printed Background Tasks panel still lists a fired one-shot as next year's Loop, while CronList is empty and CronDelete-by-id is not-found. Pipe a probe (`panelShowsLoop` / `cronListEmpty` / `cronDeleteNotFound`) and get **dated** or **looped** (or a named nearby class).

Idle word is **dated**. NEVER use dated for a failure.

```bash
node projects/almanac/hook/index.mjs < transcript.txt
node --test projects/almanac/hook/almanac.test.mjs
```

Empty stdin uses the seeded #90804 looped board. Stdout is JSON: `verdict`, `reasons[]`, `dated`, `fresh`, `alarm`.

Probe shape: `{ panelShowsLoop, cronListEmpty, cronDeleteNotFound, oneShotFired, recurring, next364d, ends3d }` → `{ verdict, reasons[], dated, fresh, alarm }`.

`dated` / `fresh` true ONLY when the verdict is dated.

Primary: [anthropics/claude-code#90804](https://github.com/anthropics/claude-code/issues/90804) (OPEN, filed 2026-08-30T18:09:30Z). Same-class: [#67293](https://github.com/anthropics/claude-code/issues/67293) stale panel vs dead Bash. Opposite poles (cite, do not build): [#85838](https://github.com/anthropics/claude-code/issues/85838) /loop under-fire, [#80679](https://github.com/anthropics/claude-code/issues/80679) ScheduleWakeup vanishes, [#74736](https://github.com/anthropics/claude-code/issues/74736) recurring over-fire, [#86015](https://github.com/anthropics/claude-code/issues/86015) cron silent behind Bash, [#89248](https://github.com/anthropics/claude-code/issues/89248) wakeup silent across compaction.

NOT Fusee / Cotter / Sounder / Reveille / Leat / Voucher.

Ask: after a one-shot fires and CronList is empty, the panel should show complete/removed — not a live Loop a year out.
