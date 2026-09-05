# Intake hook

Tiny industrial water-intake / gauge-house classifier notes for the Claude Code defect where `claude -p` with piped stdin counts the input ~1.78× toward the context limit. The refusal attributes the surplus to "system prompt, tool definitions, and attachment content." A ~2.26 MB pipe (~567k conversation tokens) is refused on a 1M model. OPEN. Labels: bug, has repro, platform:linux, area:cli.

IDLE_WORD=once. SEEDED_WORD=doubled. Seeded state is doubled / #92305 (same stream as prompt and attachment; 1,014,989 / 566,880). Never idle as stuck / missed / gated / spilled / hushed / blurted / single / maculed / stilled / rung / barred / dropped.

This stub is documentation only. The living page at `projects/intake/index.html` scores probes in-browser. No npm. No secrets. No real hooks. No exploits. Diagnostic shapes only (`claude -p`, stdin, stream-json, `--bare`, request/conversation pairs, ~16k overhead, cwd Δ ~5). No payloads.

Preferred fix / detection (document only — do not treat this stub as a live hook):

1. Compose piped stdin once under OAuth, so the usable window is the model's window minus the CLI's fixed overhead, or
2. Expose a flag that passes stdin once without dropping OAuth (the issue asks whether stdin is composed as both prompt and attachment by design).

Detection: if `claude -p` reads stdin (or `--input-format stream-json`), OAuth is seated, `--bare` is off, tools are disallowed, cwd is empty, and the refusal reports request ≈ 1.78 × conversation + ~16k with the surplus attributed to attachment content, the intake is already doubled.

Given a probe-shaped payload `{ inputFormat, promptPath, attachmentPath, composeOnce, composeTwice, conversationTokens, requestTokens, overheadTokens, cwdDeltaTokens, oauth, bare, refused, doubled, once, persistHold, log }`:

- **ONCE** if piped stdin is composed once on the prompt path
- **DOUBLED** if the same stream is composed as prompt and attachment (#92305)
- **HOLD** if persistHold keeps the intake composed once
- **BARE** if `--bare` avoids the ratio but drops OAuth
- **STREAM-JSON** if `--input-format stream-json` shows the same ~1.78× ratio
- **HALVED** if the halved file completes with the same ratio (effective window already ~560k)

This is a diagnostic scoring desk. Not an exploit. No payloads. No real credentials. Score whether the pipe was composed once or twice.

Primary: [anthropics/claude-code#92305](https://github.com/anthropics/claude-code/issues/92305). Cousin (cite only, not primary): [#12312](https://github.com/anthropics/claude-code/issues/12312) CLOSED stale — same "Prompt is too long" below-limit symptom, no mechanism identified.

Hypothesis only (NON-BINDING): piped stdin is composed as both prompt and attachment. Do not claim source beyond the issue’s measured pairs and refusal text. Discard if issue evidence disagrees.

NOT leftover Pasteboard kraft / Spillway dam teal / Blurt CRT phosphor / Macule letterpress / Ullage compaction / Alarum watchtower. Product name stays Intake.
