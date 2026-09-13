# Parablepsis fixtures

Diagnostic JSON only. No Claude sessions. Encoded from #93954 issue facts: Edit/Write UTF-8-decodes Latin-1/Windows-1252 PHP and silently wipes non-ASCII bytes (¢ ½ • ü) across the whole file — 162 chars / 11 files confirmed. Score parablepsis or admit diplomatic.

Idle word: **diplomatic**. Path word: **latin1-edit-wipe**. Seeded loss: **parablepsis**. Product: **parablepsis**. HOLD: **diplomatic**. ALARM: **parablepsis** / **latin1-edit-wipe** / **replacement-char** / **whole-file-wipe**. Primary: [anthropics/claude-code#93954](https://github.com/anthropics/claude-code/issues/93954).

Fixtures record the published incident only. No session. No secrets. No exploit payloads. No network to Anthropic. No Claude. No patch to anthropics/claude-code. Do NOT implement a fix.

| File | Verdict | What it scores |
|---|---|---|
| `diplomatic.json` | diplomatic | Idle folio. HOLD: byte-exact Latin-1 preserved. |
| `hold.json` | hold | HOLD alias for idle diplomatic. |
| `parablepsis.json` | parablepsis | Seeded #93954 path and product. ALARM: Latin-1 wiped. |
| `latin1-edit-wipe.json` | latin1-edit-wipe | Path: collator's eye skips; the exemplar is mangled. |
| `byte-exact.json` | byte-exact | HOLD alias: preserve original bytes. |
| `latin1-preserved.json` | latin1-preserved | HOLD alias: ¢ ½ • ü stay single-byte. |
| `charset-safe.json` | charset-safe | HOLD alias: iso-8859-1 files are not rewritten. |
| `no-rewrite.json` | no-rewrite | HOLD alias: no UTF-8 decode-then-re-encode. |
| `replacement-char.json` | replacement-char | Every undecodable byte becomes U+FFFD. |
| `whole-file-wipe.json` | whole-file-wipe | Corruption hits every other special character. |
| `latin1-byte.json` | latin1-byte | `0xA2` ¢ is not valid UTF-8. |
| `windows-1252.json` | windows-1252 | 0x80–0x9F render as Windows-1252. |
| `iso-8859-1.json` | iso-8859-1 | `charset=iso-8859-1`. |
| `edit-write-decode.json` | edit-write-decode | Reads as UTF-8 text and writes it back. |
| `php-legacy.json` | php-legacy | PHP/legacy web files. |
| `confirmed-162.json` | confirmed-162 | 162 characters across 11 files. |
| `live-edit-wipe.json` | live-edit-wipe | One-line Edit wiped restored bytes. |
| `landing.json` | landing | Collation-desk landing / folio sill. |
| `has-repro.json` | has-repro | Published shape. |
| `cousins.json` | cousins | Cite-only #93848 Mojibake U+FFFD read-path. |
| `backups.json` | backups | Cite-only backups. Do not auto-pick. |
| `fixtures.json` | fixtures | Cool vellum / indigo ink / oxblood lemma / brass folio. |
| `walk.json` | walk | Published idle diplomatic → latin1-edit-wipe → parablepsis. |

## Cousins (cite only)

#93848 — Mojibake. Different: intermittent U+FFFD of multibyte Korean in CLAUDE.md reaching the API / prompt-cache. Read-path, not Edit/Write of Latin-1 PHP. Do not conflate.

## Backups (cite only — do NOT auto-pick or build)

#93770 #93777 #93811 #93924 #93925 #93967 #93957 #93987

Drop any file onto `projects/parablepsis/index.html`. Buttons load the seeded path. The living page admits **diplomatic** / idle folio / #93954.

Probes are diagnostic reconstructions of the issue's published facts. This booth does not run Claude.
