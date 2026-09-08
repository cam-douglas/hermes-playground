# Cadastre fixtures

Diagnostic JSON only. No live Claude sessions. Encoded from #92908 issue facts: every change to `~/.claude.json` is a whole-file read-modify-write behind an advisory `mkdir` lock that is abandoned after a 15 s wait, stolen if older than 10 s, or skipped on `mkdir` failure — all at `warn` only — so competing Desktop/CLI writers silently drop each other's entries including `hasTrustDialogAccepted`. Trust parcels vanish and must be regranted. Score escheated or admit enrolled.

Idle word: **enrolled**. Path word: **escheated**. Seeded loss: **regranted**. HOLD: **enrolled**. ALARM: **escheated** / **regranted** / **timeout-write** / **steal-10s** / **eperm-skip** / **taken-over** / **warn-only** / **eight-events** / **desktop-cli** / **334-keys** / **before-after**. Primary: [anthropics/claude-code#92908](https://github.com/anthropics/claude-code/issues/92908).

Fixtures record the published incident only. No live session. No secrets. No exploit payloads. No network to Anthropic. No live Claude. No patch to anthropics/claude-code.

| File | Verdict | What it scores |
|---|---|---|
| `enrolled.json` | enrolled | Idle surveyor. HOLD: trust parcels stay on the roll under a held stake. |
| `escheated.json` | escheated | Seeded #92908 path. ALARM: lock abandoned/stolen → parcels vanish from the roll. |
| `92908.json` | escheated | Primary fixture alias for #92908. |
| `regranted.json` | regranted | Seeded loss: user must grant workspace trust again. |
| `timeout-write.json` | timeout-write | 15 s give-up then write without lock. |
| `steal-10s.json` | steal-10s | Lock mtime > 10 s deleted and taken. |
| `eperm-skip.json` | eperm-skip | mkdir EPERM → write without lock. |
| `taken-over.json` | taken-over | Release sees lock ino/birthtime changed; leaves it. |
| `warn-only.json` | warn-only | Nothing above warn; JSON stays valid; no user-visible error. |
| `eight-events.json` | eight-events | 8 lock-integrity log lines 2026-08-25→2026-09-08. |
| `desktop-cli.json` | desktop-cli | Desktop + host CLI both write the same file. |
| `before-after.json` | before-after | Trust written then gone; 1.46388.4 unchanged in 1.49585.0. |
| `fixtures.json` | index | Row list for the cadastral bench. |

Drop any file onto `projects/cadastre/index.html`. Buttons load the seeded path. The living page admits **enrolled** / idle surveyor / #92908.

Probes are diagnostic reconstructions of the issue's published facts. This assay does not run Claude.
