# Cribble hook

Tiny Node scorer for the miller's cribble / coarse-sieve bench. No secrets. No live Claude sessions. No live session JSONL. No payloads. No sandbox bypass instructions. Educational diagnostic only — not an exploit.

```bash
node projects/cribble/hook/index.mjs projects/cribble/data/92684.json
echo '{"seed":"cribbed","cribbed":true}' | node projects/cribble/hook/index.mjs
node --test projects/cribble/hook/cribble.test.mjs
```

Empty stdin scores the seeded **cribbed** mesh. A probe with `seed: "porous"` and mid-star2-writable + mid-star1-writable scores **porous**. Trapper springes / pier gangways / freight waybills / brass speakpipes / CRT afterimage tubes / Sounder / Callboard / Knock / Annunciator desks are not this product.

Exports: `VERDICTS`, `CHIPS`, `HOLD`, `ALARM`, `decide()`, `analyze()`, `classify()`, `score()`, `scoreFields()`, `handle()`, `seeds()`, `seedPorous()`, `seedCribbed()`, `fingerprint()`, `signals()`, `cellEnforced()`, `MEASURED`, `DENY_WRITE_TABLE`, `DENY_READ_TABLE`, `COUSINS`, `IDLE_WORD`, `SEEDED_WORD`, `MESHES`.

HOLD = cribbed. ALARM = porous / literal-eacces / trail-erofs / mid-star2-writable / mid-star1-writable / denyread-mid-enforced / status-shows-active / warning-misstates-read / tool-vs-bash-asymmetry / cousins / has-clear-repro.

Verdicts: porous, cribbed, literal-eacces, trail-erofs, mid-star2-writable, mid-star1-writable, denyread-mid-enforced, status-shows-active, warning-misstates-read, tool-vs-bash-asymmetry, cousins, has-clear-repro.

`decide()` scores fixture objects by `seed`, flags, or a diagnostic cribble probe. Idle mid-path denyWrite fail-open → porous. Mid-path denyWrite enforced like denyRead → cribbed.
