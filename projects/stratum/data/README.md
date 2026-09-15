# Stratum fixtures

Diagnostic JSON only. No Claude sessions. Encoded from #94417 issue facts: CLAUDE.md / auto-memory sits in `messages[0]` after the system breakpoint with no `cache_control` of its own, so parallel sessions never share the project bed. Score stratum or admit shared.

Idle word: **shared**. Path word: **layer-unsealed**. Seeded loss: **stratum**. Product: **stratum**. HOLD: **shared**. ALARM: **stratum** / **layer-unsealed** / **cache-miss**. Primary: [anthropics/claude-code#94417](https://github.com/anthropics/claude-code/issues/94417).

Fixtures record the published incident only. Request reconstructions are **synthetic example-data** labeled as such — not live session dumps. No session. No exploit payloads. No network to Anthropic. No Claude. No patch to anthropics/claude-code. Do NOT implement a fix.

| File | Verdict | What it scores |
|---|---|---|
| `shared.json` | shared | Idle core. HOLD: seal the project-context bed with its own cache_control. |
| `stratum.json` | stratum | Seeded #94417 path and product. ALARM: layer-unsealed miss. |
| `94417.json` | stratum | Same seeded path under the issue number. |
| `layer-unsealed.json` | layer-unsealed | Path: no cache entry ends at the project bed. |
| `layered.json` | layered | HOLD alias: project bed stays a sealed system layer. |
| `sealed.json` | sealed | HOLD alias: the bedding plane stays sealed. |
| `common.json` | common | HOLD alias: parallel shafts share the project bed. |
| `no-breakpoint.json` | no-breakpoint | Project context sits after the system breakpoint. |
| `messages-zero.json` | messages-zero | CLAUDE.md is the first content block of the first user message. |
| `cache-miss.json` | cache-miss | Zero warm starts read beyond the system prompt layer. |
| `project-context.json` | project-context | 4–7k CLAUDE.md+MEMORY tokens never get their own cache entry. |
| `parallel-shafts.json` | parallel-shafts | 0 of 474 warm starts share the project bed. |
| `core.json` | cache-miss | Six-row unsealed core log fixture. |
| `landing.json` | landing | Geology / core-sample / bedding-plane / field-stratigraphy. |
| `has-repro.json` | has-repro | Published shape. |
| `cousins.json` | cousins | Cite-only cousins. |
| `backups.json` | backups | Cite-only backups. Do not auto-pick. |
| `fixtures.json` | fixtures | System bedrock / project bed / missing plane. |
| `walk.json` | walk | Published idle shared → layer-unsealed → stratum. |
| `closed.json` | closed | #94417 remains OPEN — cite only; not this booth. |

## Cousins (cite only)

Do NOT rebuild. Do NOT conflate.

#94400 — Cancellans: resume fork drops initial tools → cache miss. DIFFERENT.

#93490 — Cachet: resume flattens array+cache_control. DIFFERENT.

#93848 — Mojibake: encoding U+FFFD in CLAUDE.md. DIFFERENT.

#91151 — resume cache collapses to system+tools floor. DIFFERENT.

#94417 is specifically: project-context layer never sealed with its own cache_control → zero cross-session share of CLAUDE.md / auto-memory.

## Backups (cite only — do NOT auto-pick or build)

#94452 #94451 #94430 #94458 #93924 #93770 #93777 #94151 #94496 #94499

Drop any file onto `projects/stratum/index.html`. Buttons load the seeded path. The core admits **shared** / idle desk / #94417.

Probes are diagnostic reconstructions of the issue's published facts. This booth does not run Claude.
