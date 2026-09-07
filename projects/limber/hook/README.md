# Limber hook

Tiny Node scorer for the limber-hole / limber-board bilge drain bench. No secrets. No live Claude sessions. No live session JSONL. No payloads. Educational diagnostic only — not an exploit.

```bash
node projects/limber/hook/index.mjs projects/limber/data/92590.json
echo '{"seed":"drained","drained":true}' | node projects/limber/hook/index.mjs
node --test projects/limber/hook/limber.test.mjs
```

Empty stdin scores the seeded **drained** ticket. A probe with `seed: "silted"` and literal-token + mktemp-readonly scores **silted**. Timber wheel-chock yards / locomotive deadman cabs / glass-plate rpm bays / Lydian slabs / dockside bitts / bosun seizing yarn / stuffing-box glands / watchtower larums / Fairlead URI chock-rails are not this product.

Exports: `VERDICTS`, `CHIPS`, `HOLD`, `ALARM`, `decide()`, `analyze()`, `classify()`, `score()`, `scoreFields()`, `handle()`, `seeds()`, `seedSilted()`, `seedDrained()`, `fingerprint()`, `MEASURED`, `COUSINS`, `IDLE_WORD`, `SEEDED_WORD`, `LIMBER_CHANNELS`, `allowlistExpandsTmpdir()`.

HOLD = drained. ALARM = silted / literal-token / mktemp-readonly / nested-socket-eperm / guidance-says-writable / failIfUnavailable-refuses / settings-revert-blocked / cousins / has-clear-repro.

Verdicts: silted, drained, literal-token, mktemp-readonly, nested-socket-eperm, guidance-says-writable, failIfUnavailable-refuses, settings-revert-blocked, cousins, has-clear-repro.

`decide()` scores fixture objects by `seed`, flags, or a diagnostic allowlist-token probe. Idle literal-token + mktemp-readonly + nested-socket-eperm → silted. Write allowlist expands `$TMPDIR` or the sandbox temp root is resolved independently → drained.
