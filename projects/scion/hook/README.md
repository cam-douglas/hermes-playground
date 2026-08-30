# Scion hook

Tiny cambium scorer for an empty-bridged-fork: a VS Code Remote Control graft that comes up healthy and seedless. Pipe a graft ticket (`lastSequenceNum` / `forkedFromSessionId` / `banner` / `bytes`) and get **hollow** or **lined** / **taken**.

Idle word is **hollow**. Seeded state is hollow / empty-fork.

```bash
node projects/scion/hook/index.mjs < projects/scion/data/hollow.json
node projects/scion/hook/index.mjs projects/scion/data/lined.json
node --test projects/scion/hook/scion.test.mjs
```

Empty stdin uses the seeded #90815 hollow ticket. Stdout is JSON: `verdict`, `chips[]`, `reasons[]`, `hollow`, `taken`, `hold`, `alarm`.

- **HOLLOW** if `lastSequenceNum === 0` AND missing `forkedFromSessionId` AND banner healthy / `kind: interactive`
- **LINED/TAKEN** if child byte-count matches parent (`9363037` / `3942`) AND `forkedFromSessionId` is present

Primary: [anthropics/claude-code#90815](https://github.com/anthropics/claude-code/issues/90815) (OPEN, filed 2026-08-30T19:34:40Z). Mirror: [#78563](https://github.com/anthropics/claude-code/issues/78563). Nearby: [#90791](https://github.com/anthropics/claude-code/issues/90791), [#85875](https://github.com/anthropics/claude-code/issues/85875), [#84468](https://github.com/anthropics/claude-code/issues/84468), [#85435](https://github.com/anthropics/claude-code/issues/85435). Closed nearby: [#87006](https://github.com/anthropics/claude-code/issues/87006). Cross-ecosystem opposite pole: [openai/codex#41713](https://github.com/openai/codex/issues/41713).

NOT Kindling / Bollard / Cote / Ullage / Voucher / Almanac.
