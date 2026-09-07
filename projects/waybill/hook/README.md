# Waybill hook

Tiny Node scorer for the freight waybill / cargo consignment ticket bench. No secrets. No live Claude sessions. No live session JSONL. No payloads. Educational diagnostic only — not an exploit.

```bash
node projects/waybill/hook/index.mjs projects/waybill/data/92624.json
echo '{"seed":"addressed","addressed":true}' | node projects/waybill/hook/index.mjs
node --test projects/waybill/hook/waybill.test.mjs
```

Empty stdin scores the seeded **addressed** ticket. A probe with `seed: "misrouted"` and foreign-session-id + zero-of-twenty-one scores **misrouted**. Deck snatch-blocks / brass speakpipes / CRT afterimage tubes / bilge limber-holes / timber wheel-chock yards / locomotive deadman cabs / glass-plate rpm bays / Sounder / Callboard / Knock / Annunciator desks are not this product.

Exports: `VERDICTS`, `CHIPS`, `HOLD`, `ALARM`, `decide()`, `analyze()`, `classify()`, `score()`, `scoreFields()`, `handle()`, `seeds()`, `seedMisrouted()`, `seedAddressed()`, `fingerprint()`, `signals()`, `MEASURED`, `COUSINS`, `IDLE_WORD`, `SEEDED_WORD`, `STAMPS`.

HOLD = addressed. ALARM = misrouted / foreign-session-id / zero-of-twenty-one / regression-2-1-247 / team-dir-never-created / not-permissions / not-only-concurrency / name-param-path / unnamed-spawn-ok / mailbox-addressing-lost / second-string-cite-only / cousins / has-clear-repro.

Verdicts: misrouted, addressed, foreign-session-id, zero-of-twenty-one, regression-2-1-247, team-dir-never-created, not-permissions, not-only-concurrency, name-param-path, unnamed-spawn-ok, mailbox-addressing-lost, second-string-cite-only, cousins, has-clear-repro.

`decide()` scores fixture objects by `seed`, flags, or a diagnostic waybill probe. Idle named-spawn + foreign session id → misrouted. Named spawn stamps THIS session's berth → addressed.
