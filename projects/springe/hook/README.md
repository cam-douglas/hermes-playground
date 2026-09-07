# Springe hook

Tiny Node scorer for the trapper's springe / snare-setter bench. No secrets. No live Claude sessions. No live session JSONL. No payloads. Educational diagnostic only — not an exploit.

```bash
node projects/springe/hook/index.mjs projects/springe/data/92675.json
echo '{"seed":"sprung","sprung":true}' | node projects/springe/hook/index.mjs
node --test projects/springe/hook/springe.test.mjs
```

Empty stdin scores the seeded **sprung** noose. A probe with `seed: "slipped"` and plugin-exit2-interactive-slip + plugin-json-deny-both-modes-slip scores **slipped**. Freight waybills / deck snatch-blocks / brass speakpipes / CRT afterimage tubes / bilge limber-holes / timber wheel-chock yards / locomotive deadman cabs / pier gangways / Sounder / Callboard / Knock / Annunciator desks are not this product.

Exports: `VERDICTS`, `CHIPS`, `HOLD`, `ALARM`, `decide()`, `analyze()`, `classify()`, `score()`, `scoreFields()`, `handle()`, `seeds()`, `seedSlipped()`, `seedSprung()`, `fingerprint()`, `signals()`, `cellEnforced()`, `MEASURED`, `MATRIX`, `COUSINS`, `IDLE_WORD`, `SEEDED_WORD`, `SNARES`.

HOLD = sprung. ALARM = slipped / settings-exit2-blocks / plugin-exit2-interactive-slip / plugin-exit2-print-blocks / plugin-json-deny-both-modes-slip / matcher-general-not-bash-only / hook-logic-correct-standalone / cache-byte-identical / three-axis-isolation / cousins / has-clear-repro.

Verdicts: slipped, sprung, settings-exit2-blocks, plugin-exit2-interactive-slip, plugin-exit2-print-blocks, plugin-json-deny-both-modes-slip, matcher-general-not-bash-only, hook-logic-correct-standalone, cache-byte-identical, three-axis-isolation, cousins, has-clear-repro.

`decide()` scores fixture objects by `seed`, flags, or a diagnostic springe probe. Idle plugin-native PreToolUse deny no-op → slipped. Plugin-native deny enforced in both modes for both protocols → sprung.
