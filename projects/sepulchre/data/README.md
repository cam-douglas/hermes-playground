# Sepulchre fixtures

Diagnostic JSON only. No Claude sessions. Encoded from #94055 issue facts: If a Bash tool result contains NUL characters (U+0000), the next API request is sent with a truncated body; server returns 400 invalid_request_error / unexpected end of data; the session never recovers — every following turn rebuilds the same poisoned body; automatic model fallback retries the same body against a second model and cannot help. Score sepulchre or admit living.

Idle word: **living**. Path word: **bash-nul-poison**. Seeded loss: **sepulchre**. Product: **sepulchre**. HOLD: **living**. ALARM: **sepulchre** / **bash-nul-poison** / **nul-bytes** / **truncated-body**. Primary: [anthropics/claude-code#94055](https://github.com/anthropics/claude-code/issues/94055).

Fixtures record the published incident only. No session. No secrets. No exploit payloads. No network to Anthropic. No Claude. No patch to anthropics/claude-code. Do NOT implement a fix.

| File | Verdict | What it scores |
|---|---|---|
| `living.json` | living | Idle vault. HOLD: lamp still burns; JSON stream intact. |
| `hold.json` | hold | HOLD alias for idle living. |
| `sepulchre.json` | sepulchre | Seeded #94055 path and product. ALARM: entombed after NUL poison. |
| `bash-nul-poison.json` | bash-nul-poison | Path: NUL cuts the next request body. |
| `unsealed.json` | unsealed | HOLD alias: the vault stays unsealed. |
| `breathing.json` | breathing | HOLD alias: the lamp still breathes. |
| `open-vault.json` | open-vault | HOLD alias: the ossuary niche stays an open vault. |
| `intact.json` | intact | HOLD alias: the JSON stream stays intact. |
| `nul-bytes.json` | nul-bytes | Bash result contains U+0000. |
| `truncated-body.json` | truncated-body | Next API request body is truncated. |
| `unexpected-end.json` | unexpected-end | 400 unexpected end of data. |
| `session-dead.json` | session-dead | Every later turn rebuilds the same poisoned body. |
| `model-fallback-useless.json` | model-fallback-useless | Fallback retries the same body. |
| `binary-as-text.json` | binary-as-text | Reading any binary as text is enough. |
| `two-step-prompt.json` | two-step-prompt | First turn completes; follow-up fails. |
| `landing.json` | landing | Limestone lintel landing. |
| `has-repro.json` | has-repro | Published shape. |
| `cousins.json` | cousins | Cite-only #91003 #85842 #92562. |
| `backups.json` | backups | Cite-only backups. Do not auto-pick. |
| `fixtures.json` | fixtures | Limestone / soot / amber / vault / iron / bone. |
| `walk.json` | walk | Published idle living → bash-nul-poison → sepulchre. |

## Cousins (cite only)

#91003 — JSON Parse Unexpected EOF discards turns mid-stream. Do not conflate.

#85842 — Edit tool silently corrupts pre-existing non-UTF-8 bytes. Do not conflate.

#92562 — Large Bash tool-call payloads not shown in UI. Do not conflate.

## Backups (cite only — do NOT auto-pick or build)

#94059 #94053 #94041 #94032 #94031 #94029 #93987 #93924 #93770 #93777

Drop any file onto `projects/sepulchre/index.html`. Buttons load the seeded path. The living page admits **living** / idle vault / #94055.

Probes are diagnostic reconstructions of the issue's published facts. This booth does not run Claude.
