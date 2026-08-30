# Livery hook

Tiny household-wardrobe scorer for Claude Code's desktop TCC path churn. Pipe a probe transcript (`executablePath` + `dialogText` + TCC observation) and get **liveried** or **prompted** (or a named nearby class).

Idle word is **liveried**. NEVER use liveried for a failure.

```bash
node projects/livery/hook/index.mjs < transcript.txt
node --test projects/livery/hook/livery.test.mjs
```

Empty stdin uses the seeded #90748 prompted board. Stdout is JSON: `verdict`, `reasons[]`, `liveried`, `alarm`.

Probe shape: `{ executablePath, dialogText, tccObservation, parentFda, signingIdentity, cloudMounts, services, overnight, grantsOnNewPath, grantsOnOldPath, launchedFrom }` → `{ verdict, reasons[], liveried, alarm }`.

Primary: [anthropics/claude-code#90748](https://github.com/anthropics/claude-code/issues/90748). Same-class (CLI / earlier path-churn, not this product's primary): [#49282](https://github.com/anthropics/claude-code/issues/49282), [#74234](https://github.com/anthropics/claude-code/issues/74234), [#62240](https://github.com/anthropics/claude-code/issues/62240). Cross-ecosystem: [mo22/tcc-venv](https://github.com/mo22/tcc-venv). NOT Pinfold / Palimpsest / Escutcheon / Chatelaine / Fob / Visa / Sigil / Hasp / Knock / Slype / Pleat.

Suggested consumer fix: launch the bundled Claude Code from a stable path that does not contain the version number, for example `~/Library/Application Support/Claude/claude-code/current/claude.app/...`.
