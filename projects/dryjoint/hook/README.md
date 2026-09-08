# Dryjoint hook

Tiny Node scorer for the electronics dry-joint / cold-solder bench (FR4 pcb, copper traces, flux stains, solder pads). No secrets. No live Claude sessions. No live session JSONL. No payloads. Educational diagnostic only — not an exploit.

```bash
node projects/dryjoint/hook/index.mjs projects/dryjoint/data/92809.json
node projects/dryjoint/hook/dryjoint.mjs projects/dryjoint/data/92809.json
echo '{"seed":"dry","dry":true}' | node projects/dryjoint/hook/index.mjs
node --test projects/dryjoint/hook/dryjoint.test.mjs
```

Empty stdin scores the idle **fused** pad. A probe with `seed: "dry"` and chat anchors that never call `openFile` scores **dry**. Cite-only cousins: #10846 #16056 #44713 #51015 #57100 #72889 CLOSED/LOCKED prior reports. Compositor galleys / twin-nameplate desks / marble cisterns / iron sconces / piano let-off gauges are not this product.

Exports: `VERDICTS`, `CHIPS`, `HOLD`, `ALARM`, `decide()`, `analyze()`, `classify()`, `score()`, `scoreFields()`, `handle()`, `seeds()`, `seedFused()`, `seedDry()`, `seedBonded()`, `fingerprint()`, `signals()`, `parseFileHref()`, `hrefLooksLikeFileRef()`, `anchorCallsBridge()`, `bridgeExists()`, `showTextDocumentHasCatch()`, `binaryWouldReject()`, `jointWasDry()`, `padBonded()`, `MEASURED`, `JOINT_LEDGER`, `REPRO_TABLE`, `COUSINS`, `OPEN_FILE_BRIDGE`, `SHOW_TEXT_DOCUMENT`, `IDLE_WORD`, `SEEDED_WORD`, `ADMIT_WORD`.

HOLD = fused / bonded. ALARM = dry / unwired-anchor / bridge-exists-unused / silent-binary-reject / showTextDocument-no-catch / markdown-mandate / cousins / has-clear-repro.

Verdicts: fused, dry, bonded, unwired-anchor, bridge-exists-unused, silent-binary-reject, showTextDocument-no-catch, markdown-mandate, has-clear-repro, cousins.

`decide()` scores fixture objects by `seed`, flags, or a diagnostic joint summary. Chat anchors call the existing `open_file` bridge → fused. Rendered `<a>` never call it; binary `showTextDocument` rejects silent → dry. After a hypothetical wired-anchor + catch path → bonded.
