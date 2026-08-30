# Palimpsest hook

Tiny scriptorium-folio scorer for Claude Code's PreToolUse `updatedInput` whole-replace. Pipe a probe transcript (`originalInput` + `updatedInput` + observed timeout / exit) and get **underwrit** or **scraped** (or a named sibling-drop / cliff).

Idle word is **underwrit**. NEVER use underwrit for a failure.

```bash
node projects/palimpsest/hook/index.mjs < transcript.txt
node --test projects/palimpsest/hook/palimpsest.test.mjs
```

Empty stdin uses the seeded #90725 scraped board. Stdout is JSON: `verdict`, `reasons[]`, `underwrit`, `alarm`.

Probe shape: `{ originalInput, updatedInput, observedTimeoutMs, exitCode, autoBackgrounded, transcriptShowsTimeout }` → `{ verdict, reasons[], underwrit, alarm }`.

Primary: [anthropics/claude-code#90725](https://github.com/anthropics/claude-code/issues/90725). Same-class: [#90726](https://github.com/anthropics/claude-code/issues/90726). Nearby: [#77851](https://github.com/anthropics/claude-code/issues/77851), [#83353](https://github.com/anthropics/claude-code/issues/83353), [#79321](https://github.com/anthropics/claude-code/issues/79321). NOT Spile / Tappet / Ambo / Quoin / Gaff / Escutcheon / Lacuna.

Suggested consumer fix: treat `updatedInput` as merge-over-original unless the hook explicitly nulls a field; warn on partial `{command}` writes.
