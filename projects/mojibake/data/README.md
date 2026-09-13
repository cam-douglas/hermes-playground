# Mojibake fixtures

Diagnostic JSON only. No Claude sessions. Encoded from #93848 issue facts: Windows embedded CLAUDE.md intermittently reaches the API with one multibyte character replaced by three U+FFFD, changing the prompt prefix mid-session and defeating prompt caching. Score mojibake or admit verbatim.

Idle word: **verbatim**. Path word: **fffd-spall**. Seeded loss: **mojibaked**. Product: **mojibake**. HOLD: **verbatim**. ALARM: **mojibaked** / **mojibake** / **fffd-spall** / **cache-miss**. Primary: [anthropics/claude-code#93848](https://github.com/anthropics/claude-code/issues/93848).

Fixtures record the published incident only. No session. No secrets. No exploit payloads. No network to Anthropic. No Claude. No patch to anthropics/claude-code.

| File | Verdict | What it scores |
|---|---|---|
| `verbatim.json` | verbatim | Idle chase. HOLD: CLAUDE.md UTF-8 reaches the API intact. |
| `hold.json` | hold | HOLD alias for idle verbatim. |
| `mojibaked.json` | mojibaked | Seeded #93848 path. ALARM: `불` → three U+FFFD. |
| `mojibake.json` | mojibake | Product score for the compositor booth. |
| `fffd-spall.json` | fffd-spall | Path: tofu-tile substitution vs hangul-kept sort. |
| `clean-variant.json` | clean-variant | 14 of 17; sid `600ce64a`. |
| `corrupted-variant.json` | corrupted-variant | 3 of 17; sid `8fdae59a`. |
| `cache-miss.json` | cache-miss | Corrupted prefix → full prompt-cache miss. |
| `hangul-불.json` | hangul-불 | Syllable at char index 3615 (UTF-8 `EB B6 88`). |
| `intact-utf8.json` | intact-utf8 | HOLD alias: file decode and embed stay UTF-8. |
| `cache-hit.json` | cache-hit | HOLD alias: prompt-cache prefix reused. |
| `prefix-stable.json` | prefix-stable | HOLD alias: messages[0] text identical. |
| `hangul-kept.json` | hangul-kept | HOLD alias: `불` stays `불`. |
| `has-repro.json` | has-repro | Published shape. |
| `cousins.json` | cousins | Cite-only #40396 / #88836. |
| `backups.json` | backups | Cite-only backups. Do not auto-pick. |
| `fixtures.json` | fixtures | Rice-paper / ink / geta magenta. |
| `walk.json` | walk | Published idle verbatim → fffd-spall → mojibaked → mojibake. |

## Cousins (cite only)

#40396 (closed; Korean U+FFFD in responses on macOS). #88836 (AskUserQuestion newlines → U+FFFD since 2.1.235). Do not rebuild as separate booths.

## Backups (cite only — do NOT auto-pick or build)

#93772 #93770 #93777 #93782 #93889 #93821 #93811 #93809 #93823 #93929 #93924 #93925

Drop any file onto `projects/mojibake/index.html`. Buttons load the seeded path. The living page admits **verbatim** / idle chase / #93848.

Probes are diagnostic reconstructions of the issue's published facts. This booth does not run Claude.
