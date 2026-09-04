# Hectograph hook

Tiny gelatin hectograph / spirit-duplicator classifier for the Claude Code defect where full bash command text reaches OTLP telemetry in `tool_input` / `tool_parameters` and no `OTEL_LOG_TOOL_*` setting turns it off. Reporter michalszelagsonos. Filed 2026-09-04. Labels: bug, has repro, platform:macos, area:core, area:security. Claude Code 2.1.259 (also 2.1.252, 2.1.258). macOS darwin 25.6.0 arm64. OTLP gRPC to otelcol-contrib 0.160.0 on loopback.

Idle word is **scrubbed**. Seeded state is pulled / #92056 (canary still appears in the exported payload with scrub flags off). Never idle as masked / bled / sounded / muted / slipped / fouled / verbatim / mangled / moored / aloft / resolved / literal / sealed / blanked / attested / usurped / swaged / torn / homed / crossed / armed / unheard / withheld / enacted.

```bash
node projects/hectograph/hook/hectograph.mjs projects/hectograph/data/92056.json
node projects/hectograph/hook/hectograph.mjs projects/hectograph/data/scrubbed.json
echo '{"flags":{"OTEL_LOG_TOOL_CONTENT":false},"canaryPresent":true}' | node projects/hectograph/hook/hectograph.mjs
node --test projects/hectograph/hook/hectograph.test.mjs
```

Empty stdin uses the idle **scrubbed** ticket. Stdout is JSON: `verdict`, `chips[]`, `reasons[]`, `scrubbed`, `pulled`, `hold`, `alarm`, `idleWord`.

Given `{ persistHold, scrubbed, pulled, scrubFlagsOff, canaryPresent, flags, attributes, fullCommand, toolParameters, toolInput }`:

- **SCRUBBED** if every `OTEL_LOG_TOOL_*` flag is off or unset and the canary is absent from `tool_input` / `tool_parameters`
- **PULLED** if the canary still appears in the exported payload with scrub flags off (#92056)
- **FLAG-MATRIX** if five content flags are unset or off and the canary is still pulled on every tool attribute path
- **TOOL-PARAMETERS** if the canary is present in `tool_decision.tool_parameters` and/or `tool_result.tool_parameters`
- **TOOL-INPUT** if the canary is present in `tool_result.tool_input`
- **FULL-COMMAND** if `tool_decision.tool_parameters.full_command` still carries the bash text
- **CONTENT-FALSE** if `OTEL_LOG_TOOL_CONTENT=false` and the canary still appears
- **CONTENT-ZERO** if `OTEL_LOG_TOOL_CONTENT=0` and the canary still appears
- **FLAGS-UNSET** if all `OTEL_LOG_*` flags are unset (default) and the canary still appears
- **HOLD** if the gelatin holds; canary absent; scrub flags honored

This is a diagnostic scoring desk. Not an exploit. No payloads. No real credentials. Score whether the gelatin scrubbed or already pulled a canary. Fixtures use `HECTOGRAPH_CANARY_DO_NOT_EXPORT`.

Primary: [anthropics/claude-code#92056](https://github.com/anthropics/claude-code/issues/92056). Cousins (cite only, not primary): [#92057](https://github.com/anthropics/claude-code/issues/92057) query_source embeds outputStyle, [#91766](https://github.com/anthropics/claude-code/issues/91766) OTEL_LOG_RAW_API_BODIES ignored in project settings.

Hypothesis only (NON-BINDING): `tool_input` / `tool_parameters` may be serialised outside the `OTEL_LOG_TOOL_*` gates. Discard if issue evidence disagrees. Do not claim Claude Code source you have not seen.

NOT leftover congregation placet / print-shop frisket / clavichord tangent / dockyard hawser / proof-desk caret / harbor-buoy / solecism usage-desk / coffer vault / codicil probate / crimp pliers / jackfield channel-strip / tocsin fire-bell / bolter flour-mill / deadeye standing-rigging. Product name stays Hectograph.
