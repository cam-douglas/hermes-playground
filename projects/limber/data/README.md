# Limber fixtures

Diagnostic JSON only. No live Claude sessions. Encoded from #92590 issue facts: `sandbox.enabled` sets `$TMPDIR` from `CLAUDE_CODE_TMPDIR` under `$HOME` then denies writes because the write allowlist keeps the literal token `$TMPDIR`. Score silted or admit drained.

Idle word: **silted**. Seeded word: **drained**. HOLD: **drained**. ALARM: **silted** / **literal-token** / **mktemp-readonly** / **nested-socket-eperm** / **guidance-says-writable** / **failIfUnavailable-refuses** / **settings-revert-blocked** / **cousins** / **has-clear-repro**. Primary: [anthropics/claude-code#92590](https://github.com/anthropics/claude-code/issues/92590).

Fixtures record the published incident (literal `$TMPDIR` token, mktemp Read-only, nested socket EPERM, guidance vs observed, failIfUnavailable refuse, settings revert blocked). No live session. No secrets. No exploit payloads.

| File | Verdict | What it scores |
|---|---|---|
| `silted.json` | silted | Idle board. Literal `$TMPDIR` silts the well; mktemp and sockets fail. |
| `drained.json` | drained | Seeded hold. Allowlist expands `$TMPDIR` or temp root resolves independently. |
| `92590.json` | silted | Primary fixture alias for #92590. |
| `literal-token.json` | literal-token | Write allowlist keeps `"$TMPDIR"` unexpanded. |
| `mktemp-readonly.json` | mktemp-readonly | `mktemp -d` fails Read-only file system. |
| `nested-socket-eperm.json` | nested-socket-eperm | Nested `claude` EPERM listen `srt-mux-*.sock`. |
| `guidance-says-writable.json` | guidance-says-writable | Guidance says TMPDIR is sandbox-writable. |
| `failIfUnavailable-refuses.json` | failIfUnavailable-refuses | Refuses unsandboxed (correct). |
| `settings-revert-blocked.json` | settings-revert-blocked | Writing `~/.claude` denied; revert from outside. |
| `cousins.json` | cousins | Cite-only #91643 / #91223 / #15637. Primary stays #92590. |
| `has-clear-repro.json` | has-clear-repro | Issue labeled has repro. |
| `fixtures.json` | index | Row list for the limber-board. |

Drop any file onto `projects/limber/index.html` or paste the JSON. The living page admits **silted** / literal-token + mktemp-readonly / #92590.

Probes are diagnostic reconstructions of the issue's published facts. This assay does not run Claude.
