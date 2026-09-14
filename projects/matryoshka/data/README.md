# Matryoshka fixtures

Diagnostic JSON only. No Claude sessions. Encoded from #94350 issue facts: Bash permission walker prompts on pipes/semicolons nested inside `$(...)` even when every component is allow-listed; semicolon case leaks `Unhandled node type: ;`. Score matryoshka or admit unpacked.

Idle word: **unpacked**. Path word: **subst-nest**. Seeded loss: **matryoshka**. Product: **matryoshka**. HOLD: **unpacked**. ALARM: **matryoshka** / **subst-nest** / **unhandled-node**. Primary: [anthropics/claude-code#94350](https://github.com/anthropics/claude-code/issues/94350).

Fixtures record the published incident only. Walker rows are **synthetic example-data** labeled as such — not live session dumps. No session. No exploit payloads. No network to Anthropic. No Claude. No patch to anthropics/claude-code. Do NOT implement a fix.

| File | Verdict | What it scores |
|---|---|---|
| `unpacked.json` | unpacked | Idle nest. HOLD: walker recurses into `$(...)`. |
| `hold.json` | hold | HOLD alias for idle unpacked. |
| `matryoshka.json` | matryoshka | Seeded #94350 path and product. ALARM: outer doll will not unpack. |
| `94350.json` | matryoshka | Same seeded path under the issue number. |
| `subst-nest.json` | subst-nest | Path: nested control-operator inside `$(...)`. |
| `descended.json` | descended | HOLD alias: walker descended into the body. |
| `recursed.json` | recursed | HOLD alias: nested list/pipeline like top-level. |
| `opened.json` | opened | HOLD alias: outer doll opened. |
| `nested-ok.json` | nested-ok | HOLD alias: joints walked; no prompt. |
| `walked-in.json` | walked-in | HOLD alias: walker walked into the nest. |
| `unhandled-node.json` | unhandled-node | AST dispatcher fallback. |
| `error-leak.json` | error-leak | `Unhandled node type: ;` in the prompt. |
| `nested-pipe.json` | nested-pipe | `$(cat file.txt \| wc -l)` prompts. |
| `nested-semicolon.json` | nested-semicolon | `$(echo a; echo b)` prompts. |
| `top-level-ok.json` | top-level-ok | `;` and `|` outside subst handled. |
| `allowlisted-parts.json` | allowlisted-parts | cat, wc, echo, pwd auto-allowed. |
| `subst-body.json` | subst-body | `$(...)` subtree is the miss. |
| `landing.json` | landing | Lacquer nesting-doll / birch workshop. |
| `has-repro.json` | has-repro | Published shape. |
| `cousins.json` | cousins | Cite-only CLOSED #55170 family. |
| `backups.json` | backups | Cite-only backups. Do not auto-pick. |
| `fixtures.json` | fixtures | Lacquer nesting-doll / birch workshop. |
| `walk.json` | walk | Published idle unpacked → subst-nest → matryoshka. |
| `closed.json` | closed | Cousins remain CLOSED — cite only; not this booth. |

## Cousins (cite only)

CLOSED cousins from the #94350 text. Do NOT rebuild. Do NOT conflate.

#55170 — parenthesized subshell `(cmd1; cmd2)` → Unhandled node type: ;. Distinct cousin.

#47752 / #56019 — heredoc+pipe → Unhandled node type: pipeline. Distinct cousins.

#47701 / #47706 — redirects → Unhandled node type: file_redirect. Distinct cousins. This booth's redirect-inside-`$(...)` repro is clean.

#46868 — feature request auto-allow compound when every component allowed. Distinct cousin.

#94350 is specifically: nested `;` / `|` inside `$(...)` force a prompt; semicolon leaks `Unhandled node type: ;`.

## Backups (cite only — do NOT auto-pick or build)

#93924 #93770 #93777 #94151 #94277

Drop any file onto `projects/matryoshka/index.html`. Buttons load the seeded path. The unpacked page admits **unpacked** / idle nest / #94350.

Probes are diagnostic reconstructions of the issue's published facts. This booth does not run Claude.
