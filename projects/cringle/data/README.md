# Cringle fixtures

Diagnostic JSON only. No live Claude sessions. No live Bash deny matching. Encoded from #92542 issue facts: `permissions.deny` Bash rules match the program name of each sub-command after unwrapping a fixed eight-item wrapper list; any other PATH wrapper that forwards args shifts the program name so the deny rule never sees the real command. Score slipped or admit sighted.

Idle word: **slipped**. Seeded word: **sighted**. HOLD: **sighted**. ALARM: **slipped** / **eight-unwrap** / **wrapper-shift** / **compound-caught** / **path-wrapper-bypass** / **cousins**. Primary: [anthropics/claude-code#92542](https://github.com/anthropics/claude-code/issues/92542).

Fixtures record the published unwrap list, repro, denial/bypass timestamps, impact counts, and environment. No live session. No secrets.

| File | Verdict | What it scores |
|---|---|---|
| `slipped.json` | slipped | Idle loft. Eight-item unwrap; unknown wrapper shifts the program token. |
| `sighted.json` | sighted | Seeded hold. Unwrap-aware; unmatched escalates. |
| `92542.json` | slipped | Primary fixture alias for #92542. |
| `eight-unwrap.json` | eight-unwrap | Listed wrappers: timeout time nice stdbuf nohup command builtin noglob + VAR=value. |
| `wrapper-shift.json` | wrapper-shift | Unknown PATH wrapper forwards args; deny never consulted. |
| `compound-caught.json` | compound-caught | Compound forms correctly denied; splitter is not the hole. |
| `path-wrapper-bypass.json` | path-wrapper-bypass | Six denials then four runs · 103 files / 657,373 insertions. |
| `cousins.json` | cousins | Cite-only #49874 #31558 #4956. |
| `fixtures.json` | index | Row list for the splicing bench. |

Drop any file onto `projects/cringle/index.html` or paste the JSON. The living page admits **slipped** / Bash deny unwrap wrapper bypass / #92542.

Repro in the issue is a deny-rule contrast (bare command denied; wrapper-prefixed command runs). This assay does not run that command.
