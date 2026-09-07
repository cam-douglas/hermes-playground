# Deadman hook

Tiny Node scorer for the locomotive deadman's switch / process-tree kill bench. No secrets. No live Claude sessions. No live session JSONL. No payloads. Educational PreToolUse denylist fixture only — does not execute deletes.

```bash
node projects/deadman/hook/index.mjs projects/deadman/data/92593.json
echo '{"seed":"latched","latched":true}' | node projects/deadman/hook/index.mjs
node --test projects/deadman/hook/deadman.test.mjs
```

Empty stdin scores the seeded **latched** ticket. A probe with `seed: "runaway"` and timeout-background + TaskStop-shell-only scores **runaway**. Glass-plate rpm bays / Lydian slabs / dockside bitts / bosun seizing yarn / stuffing-box glands / watchtower larums / hangfire primers / watchdog kennels / letterpress clobber labs are not this product.

Exports: `VERDICTS`, `CHIPS`, `HOLD`, `ALARM`, `decide()`, `analyze()`, `classify()`, `score()`, `scoreFields()`, `handle()`, `seeds()`, `seedRunaway()`, `seedLatched()`, `fingerprint()`, `MEASURED`, `COUSINS`, `IDLE_WORD`, `SEEDED_WORD`, `CATASTROPHIC_TARGETS`, `wouldDenyCatastrophic()`.

HOLD = latched. ALARM = runaway / timeout-background / taskstop-shell-only / msys-backslash-root / drive-wipe / job-object-missing / cousins / has-clear-repro.

Verdicts: runaway, latched, timeout-background, taskstop-shell-only, msys-backslash-root, drive-wipe, job-object-missing, cousins, has-clear-repro.

`decide()` scores fixture objects by `seed`, flags, or a diagnostic process-tree probe. Idle timeout-background + TaskStop shell-only + MSYS drive-root wipe → runaway. Timeout kills; TaskStop kills the full tree; catastrophic targets denied → latched.

## PreToolUse denylist idea (educational fixture)

A cheap defense-in-depth guard would deny recursive deletes whose resolved target is a drive root, POSIX `/`, `~`, or a quoted backslash that MSYS mangles to the current-drive root. The quoted-backslash form evades permission-rule patterns that look for `rm -rf /*`. This hook documents the idea and scores fixtures; it does not run `rm` and is not an exploit.
