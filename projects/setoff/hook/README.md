# Setoff hook

Tiny Node scorer for the letterpress set-off bench (ink from one sheet transferring onto the facing sheet). No secrets. No live Claude sessions. No live session JSONL. No payloads. Educational diagnostic only — not an exploit.

```bash
node projects/setoff/hook/index.mjs projects/setoff/data/92750.json
node projects/setoff/hook/setoff.mjs projects/setoff/data/92750.json
echo '{"seed":"laden","laden":true}' | node projects/setoff/hook/index.mjs
node --test projects/setoff/hook/setoff.test.mjs
```

Empty stdin scores the idle **lean** tympan. A probe with `seed: "laden"` and MEMORY.md instructions + skill_listing scores **laden**. No verified cite-only cousins about subagent context are claimed. Locksmith casements / censor stamps / herald bynames / mason crenels / mill cribbles are not this product.

Exports: `VERDICTS`, `CHIPS`, `HOLD`, `ALARM`, `decide()`, `analyze()`, `classify()`, `score()`, `scoreFields()`, `handle()`, `seeds()`, `seedLean()`, `seedLaden()`, `seedShed()`, `fingerprint()`, `signals()`, `hasMemoryInstructions()`, `hasSkillListing()`, `MEASURED`, `TOKEN_TABLE`, `SHEETS`, `COUSINS`, `IDLE_WORD`, `SEEDED_WORD`, `ADMIT_WORD`.

HOLD = lean / shed. ALARM = laden / memory-attached / skill-listing / custom-agent-unchanged / allowlist-residual / token-table / docs-vs-measured / cousins / has-clear-repro.

Verdicts: lean, laden, shed, memory-attached, skill-listing, custom-agent-unchanged, allowlist-residual, token-table, docs-vs-measured, has-clear-repro, cousins.

`decide()` scores fixture objects by `seed`, flags, or a diagnostic attachment summary. Neither memory instructions nor skill_listing → lean. Both present → laden. After a hypothetical strip → shed.
