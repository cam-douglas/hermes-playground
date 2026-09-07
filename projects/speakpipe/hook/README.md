# Speakpipe hook

Tiny Node scorer for the brass speaking-tube / shipboard voicepipe bench. No secrets. No live Claude sessions. No live session JSONL. No payloads. Educational diagnostic only — not an exploit.

```bash
node projects/speakpipe/hook/index.mjs projects/speakpipe/data/92646.json
echo '{"seed":"relayed","relayed":true}' | node projects/speakpipe/hook/index.mjs
node --test projects/speakpipe/hook/speakpipe.test.mjs
```

Empty stdin scores the seeded **relayed** ticket. A probe with `seed: "corked"` and overbroad-disallow + footer-still-advertises scores **corked**. CRT afterimage tubes / bilge limber-holes / timber wheel-chock yards / locomotive deadman cabs / glass-plate rpm bays / Sounder / Callboard / Knock / Annunciator desks are not this product.

Exports: `VERDICTS`, `CHIPS`, `HOLD`, `ALARM`, `decide()`, `analyze()`, `classify()`, `score()`, `scoreFields()`, `handle()`, `seeds()`, `seedCorked()`, `seedRelayed()`, `fingerprint()`, `signals()`, `MEASURED`, `COUSINS`, `IDLE_WORD`, `SEEDED_WORD`, `DECKS`.

HOLD = relayed. ALARM = corked / dual-purpose-tool / overbroad-disallow / pretooluse-auto-deny / mcp-replacement-gap / footer-still-advertises / toolsearch-empty / listagents-dead-instruction / cli-flag-honoured / desktop-app-ban / timeline-zero-after-1.46388.4 / cousins / has-clear-repro.

Verdicts: corked, relayed, dual-purpose-tool, overbroad-disallow, pretooluse-auto-deny, mcp-replacement-gap, footer-still-advertises, toolsearch-empty, listagents-dead-instruction, cli-flag-honoured, desktop-app-ban, timeline-zero-after-1.46388.4, cousins, has-clear-repro.

`decide()` scores fixture objects by `seed`, flags, or a diagnostic speakpipe probe. Idle overbroad-disallow + footer-still-advertises → corked. Continuation hail can pass the tube to a below-decks subagent → relayed.
