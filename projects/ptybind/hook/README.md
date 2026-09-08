# Ptybind hook

Tiny Node scorer for the ConPTY bind-plate atelier (CRT phosphor green on near-black, brass bind-screws, mux pane lattice, raw-mode console ledger, PTY BIND plate mark). No secrets. No live Claude sessions. No live session JSONL. No payloads. Educational diagnostic only — not an exploit.

```bash
node projects/ptybind/hook/index.mjs projects/ptybind/data/92757.json
node projects/ptybind/hook/ptybind.mjs projects/ptybind/data/92757.json
echo '{"seed":"swallowed","swallowed":true}' | node projects/ptybind/hook/index.mjs
node --test projects/ptybind/hook/ptybind.test.mjs
```

Empty stdin scores the idle **piped** plate. A probe with `seed: "swallowed"` and a parent still consuming input scores **swallowed**. Cite-only cousins: #73301 CLOSED stale (WezTerm same symptom), #84264 OPEN (Ctrl+G kills the Windows Terminal window), #58664 CLOSED (hang instead of launch), #88775 OPEN (bg-spare daemon no controlling tty for emacs). Cargo-hold cribs / letterpress tympans / locksmith casements / censor stamps / herald bynames / mason crenels / mill cribbles / trapper springes / pier gangways / freight waybills are not this product.

Exports: `VERDICTS`, `CHIPS`, `HOLD`, `ALARM`, `decide()`, `analyze()`, `classify()`, `score()`, `scoreFields()`, `handle()`, `seeds()`, `seedPiped()`, `seedSwallowed()`, `seedUnbound()`, `fingerprint()`, `signals()`, `keysWereDead()`, `parentStillConsuming()`, `MEASURED`, `BIND_LEDGER`, `CONTROL_MATRIX`, `COUSINS`, `IDLE_WORD`, `SEEDED_WORD`, `ADMIT_WORD`.

HOLD = piped / unbound. ALARM = swallowed / editor-renders / keys-dead / parent-consuming / conpty-mux / gui-workaround / node-repro / control-matrix / cousins / has-clear-repro.

Verdicts: piped, swallowed, unbound, editor-renders, keys-dead, parent-consuming, conpty-mux, gui-workaround, node-repro, control-matrix, has-clear-repro, cousins.

`decide()` scores fixture objects by `seed`, flags, or a diagnostic bind-plate summary. Editor receives keys / input handed to child → piped. Parent still consuming; editor renders; keys dead → swallowed. After a hypothetical tear-down of parent stdin before spawn → unbound.
