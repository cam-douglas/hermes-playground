# Fetch hook

Tiny looking-glass parlor scorer for Claude Code's TUI ghost-text prompt suggestions. Pipe a probe transcript (`promptSuggestionEnabled` + `source=prompt_suggestion` + `capturePaneText` + composer / channels / keystroke / submit flags) and get **muted** or **ghosted** (or a named nearby class).

Idle word is **muted**. NEVER use muted for a failure.

```bash
node projects/fetch/hook/index.mjs < transcript.txt
node --test projects/fetch/hook/fetch.test.mjs
```

Empty stdin uses the seeded #90755 ghosted board. Stdout is JSON: `verdict`, `reasons[]`, `muted`, `alarm`.

Probe shape: `{ promptSuggestionEnabled, suggestionSource, ghostText, capturePaneText, composerMarked, channelsActive, recentKeystrokes, submittedAsUser, approvalText, watchdogFed, selfLoop, fabricatedCount }` → `{ verdict, reasons[], muted, alarm }`.

Primary: [anthropics/claude-code#90755](https://github.com/anthropics/claude-code/issues/90755). Related (same habitat, not this product's primary): [#78177](https://github.com/anthropics/claude-code/issues/78177) Remote Control composer never submitted, [#86896](https://github.com/anthropics/claude-code/issues/86896) spurious tmux interrupt, [#77155](https://github.com/anthropics/claude-code/issues/77155) `--channels` / `--plugin-dir`, [#77569](https://github.com/anthropics/claude-code/issues/77569) display-vs-semantic leak. NOT Livery / Pinfold / Palimpsest / Escutcheon / Chatelaine / Fob / Visa / Sigil / Hasp / Knock / Slype / Scrim / Chute / Ambo / Byline.

Suggested consumer fix: emit a machine-readable marker on the suggestion line; auto-suppress suggestions under `--channels` / no recent local keystrokes; document `promptSuggestionEnabled` for headless.
