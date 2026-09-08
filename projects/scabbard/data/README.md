# Scabbard fixtures

Diagnostic JSON only. No live Claude sessions. Encoded from #92820 issue facts: a custom subagent that declares `Bash` in `.claude/agents/*.md` frontmatter is invoked with Bash silently omitted while Grep/Glob remain. No error, warning, or denial. Score stripped or admit armed.

Idle word: **armed**. Seeded word: **stripped**. HOLD: **armed**. ALARM: **stripped** / **frontmatter-bash** / **powershell-rename** / **permissions-allow** / **dual-surface** / **general-purpose**. Primary: [anthropics/claude-code#92820](https://github.com/anthropics/claude-code/issues/92820).

Fixtures record the published incident (frontmatter Bash listed; PowerShell rename still absent; permissions.allow no effect; CLI+VS Code both strip; general-purpose still has `*`). No live session. No secrets. No exploit payloads.

| File | Verdict | What it scores |
|---|---|---|
| `armed.json` | armed | Idle scabbard. HOLD: Bash seated in the granted toolset. |
| `stripped.json` | stripped | Seeded #92820 path. ALARM: Bash omitted silent. |
| `92820.json` | stripped | Primary fixture alias for #92820. |
| `frontmatter-bash.json` | frontmatter-bash | `tools: Bash, Grep, Glob` declared; granted Grep, Glob only. |
| `powershell-rename.json` | powershell-rename | Renamed Bash → PowerShell; still absent. |
| `permissions-allow.json` | permissions-allow | settings.json allow list does not restore the tool. |
| `dual-surface.json` | dual-surface | CLI and VS Code both strip. |
| `general-purpose.json` | general-purpose | Built-in type still receives `*`; custom stays stripped. |
| `fixtures.json` | index | Row list for the rack pegs. |

Drop any file onto `projects/scabbard/index.html` or paste is not required — buttons load the seeded path. The living page admits **armed** / idle filled scabbard / #92820.

Probes are diagnostic reconstructions of the issue's published facts. This assay does not run Claude.
