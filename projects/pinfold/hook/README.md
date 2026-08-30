# Pinfold hook

Tiny village-pound scorer for Claude Code's PowerShell-tool FileFix CmdLine block. Pipe a probe transcript (`composedCommand` + `threatName` + `spawnError` + Defender events) and get **penned** or **flagged** (or a named nearby class).

Idle word is **penned**. NEVER use penned for a failure.

```bash
node projects/pinfold/hook/index.mjs < transcript.txt
node --test projects/pinfold/hook/pinfold.test.mjs
```

Empty stdin uses the seeded #90706 flagged board. Stdout is JSON: `verdict`, `reasons[]`, `penned`, `alarm`.

Probe shape: `{ composedCommand, threatName, resourceType, spawnError, spawnPath, events, didThreatExecute, fileQuarantined, invokedAs, bodyKind, userSawToast, modelSawHint }` → `{ verdict, reasons[], penned, alarm }`.

Primary: [anthropics/claude-code#90706](https://github.com/anthropics/claude-code/issues/90706). Same-class: [#65627](https://github.com/anthropics/claude-code/issues/65627), [codex#15423](https://github.com/openai/codex/issues/15423), [codex#31419](https://github.com/openai/codex/issues/31419), [codex#26218](https://github.com/openai/codex/issues/26218). Nearby contrast: [#90676](https://github.com/anthropics/claude-code/issues/90676). NOT Slype / Escutcheon / Palimpsest / Calque / Gasket / Fob / Chatelaine.

Suggested consumer fix: when Windows spawn fails EPERM/access-denied, hint that security software may have blocked it (or check Defender 1116/1117); consider materializing long `-Command` bodies to a temp `.ps1` invoked by path so the logic never rides the AMSI-visible command line.
