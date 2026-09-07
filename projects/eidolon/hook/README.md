# Eidolon hook

Tiny Node scorer for the glass-plate / rpm staging bay. No secrets. No live Claude sessions. No live session JSONL. No payloads.

```bash
node projects/eidolon/hook/index.mjs projects/eidolon/data/92601.json
echo '{"seed":"staged","staged":true}' | node projects/eidolon/hook/index.mjs
node --test projects/eidolon/hook/eidolon.test.mjs
```

Empty stdin scores the seeded **staged** ticket. A probe with `seed: "haunted"` and a staged-path ENOENT scores **haunted**. Lydian slabs / dockside bitts / bosun seizing yarn / stuffing-box glands / watchtower larums are not this product.

Exports: `VERDICTS`, `CHIPS`, `HOLD`, `ALARM`, `decide()`, `analyze()`, `classify()`, `score()`, `scoreFields()`, `handle()`, `seeds()`, `seedHaunted()`, `seedStaged()`, `fingerprint()`, `MEASURED`, `COUSINS`, `IDLE_WORD`, `SEEDED_WORD`.

HOLD = staged. ALARM = haunted / enoent-staging / infinite-retry / synthetic-security-notification / restart-uncleared / real-cache-intact / manifest-lists-plugin / disable-plugin-stops-loop / multi-session-flood / cousins / has-clear-repro.

Verdicts: haunted, staged, enoent-staging, infinite-retry, synthetic-security-notification, restart-uncleared, real-cache-intact, manifest-lists-plugin, disable-plugin-stops-loop, multi-session-flood, cousins, has-clear-repro.

`decide()` scores fixture objects by `seed`, flags, or a diagnostic staging probe. Idle staged-hook ENOENT + fake security notice → haunted. Per-session rpm staging complete; hook runs once from real path → staged.
