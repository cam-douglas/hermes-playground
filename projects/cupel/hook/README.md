# Cupel hook

Tiny bone-ash assay-office classifier for the Claude Code defect where the Filesystem extension breaks in Cowork/Code sessions on 1.46388.2: the era probe marks the server legacy, then draft-07 tool schemas are rejected. Reporter aflewis. Filed 2026-09-04. Labels: bug, has repro, platform:macos, area:mcp, area:cowork, area:desktop. macOS Apple Silicon. Claude Desktop 1.46388.2 (worked on 1.40609.1). Electron 42.10.0. Bundled Node 24.18.1. `@modelcontextprotocol/server-filesystem` v2026.7.4.

Idle word is **pure**. Seeded state is scorched / #92122 (draft-07 rejected / era-legacy shared-pool path). Never idle as cold / voided / banked / rewritten / keyed / strayed / scrubbed / pulled / enacted / withheld / masked / bled / crossed / homed.

```bash
node projects/cupel/hook/cupel.mjs projects/cupel/data/92122.json
node projects/cupel/hook/cupel.mjs projects/cupel/data/pure.json
echo '{"dialect":"draft-07","toolsCall":"refused"}' | node projects/cupel/hook/cupel.mjs
node --test projects/cupel/hook/cupel.test.mjs
```

Empty stdin uses the idle **pure** ticket. Stdout is JSON: `verdict`, `chips[]`, `reasons[]`, `pure`, `scorched`, `hold`, `alarm`, `idleWord`.

Given an assay-shaped payload `{ dialect, eraProbe, siblingComplete, context, toolsAnnounced, toolsCall, outputSchemaValid }`:

- **PURE** if 2020-12 schemas are accepted (the cupel stayed bone-ash)
- **SCORCHED** if draft-07 is rejected or the era-legacy shared-pool path fires (#92122)
- **LEGACY** if `Era probe verdict: legacy (sibling did not complete the exchange)`
- **DRAFT07** if the validator refuses `"$schema": "http://json-schema.org/draft-07/schema#"`
- **SHARED-POOL** if the desktop app connects and Cowork/Code shared-pool fails
- **REFUSED** if every `tools/call` is refused before disk
- **FOURTEEN** if 14 tools are announced and then every call is refused
- **HOLD** if the cupel stays bone-ash on a 2020-12 assay

This is a diagnostic scoring desk. Not an exploit. No payloads. No real credentials. Score whether the cupel held or already scorched the charge.

Primary: [anthropics/claude-code#92122](https://github.com/anthropics/claude-code/issues/92122). Cousins (cite only, not primary): [#88988](https://github.com/anthropics/claude-code/issues/88988), [#88882](https://github.com/anthropics/claude-code/issues/88882), [#90549](https://github.com/anthropics/claude-code/issues/90549), [#90245](https://github.com/anthropics/claude-code/issues/90245), [#87633](https://github.com/anthropics/claude-code/issues/87633), [#86142](https://github.com/anthropics/claude-code/issues/86142) (closed). Different-class cite: [#92091](https://github.com/anthropics/claude-code/issues/92091), [#80174](https://github.com/anthropics/claude-code/issues/80174).

Hypothesis only (NON-BINDING): Shared-pool transport probes in place and marks era legacy when sibling exchange incomplete; after reconnect, a 2020-12-only validator rejects draft-07 outputSchema that most MCP servers still ship. Discard if issue evidence disagrees. Do not claim Claude Code source you have not seen.

NOT leftover stone-pit oubliette / cream wick-lit ephemera / commutator drum / hectograph gelatin / congregation placet / print-shop frisket / dockyard hawser. Product name stays Cupel.
