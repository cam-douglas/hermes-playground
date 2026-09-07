# Gangway hook

Tiny Node scorer for the pier gangway / boarding brow / ship-to-shore steel ramp bench. No secrets. No live Claude sessions. No live session JSONL. No payloads. Educational diagnostic only — not an exploit.

```bash
node projects/gangway/hook/index.mjs projects/gangway/data/92662.json
echo '{"seed":"remoored","remoored":true}' | node projects/gangway/hook/index.mjs
node --test projects/gangway/hook/gangway.test.mjs
```

Empty stdin scores the seeded **remoored** ticket. A probe with `seed: "severed"` and never-redial + healthy-socket-ignored scores **severed**. Freight waybills / deck snatch-blocks / brass speakpipes / CRT afterimage tubes / bilge limber-holes / timber wheel-chock yards / locomotive deadman cabs / glass-plate rpm bays are not this product.

Exports: `VERDICTS`, `CHIPS`, `HOLD`, `ALARM`, `decide()`, `analyze()`, `classify()`, `score()`, `scoreFields()`, `handle()`, `seeds()`, `seedSevered()`, `seedRemoored()`, `fingerprint()`, `signals()`, `MEASURED`, `COUSINS`, `IDLE_WORD`, `SEEDED_WORD`, `BROWS`.

HOLD = remoored. ALARM = severed / never-redial / healthy-socket-ignored / reconnect-noop / tab-group-orphan / session-mapping-lost / createIfEmpty-new-tab-only / chrome-relaunch-not-sleep / cousins / has-clear-repro.

Verdicts: severed, remoored, never-redial, healthy-socket-ignored, reconnect-noop, tab-group-orphan, session-mapping-lost, createIfEmpty-new-tab-only, chrome-relaunch-not-sleep, cousins, has-clear-repro.

`decide()` scores fixture objects by `seed`, flags, or a diagnostic gangway probe. Idle Chrome-relaunch + never-redial → severed. Session client re-dials and the restored group is re-adopted → remoored.
