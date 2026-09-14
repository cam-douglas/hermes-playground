# Agraphia fixtures

Diagnostic JSON only. No Claude sessions. Encoded from #94251 issue facts: interactive CLI 2.1.270 omits most assistant text written before a tool_use; 2.1.267 still penned those blocks. Score agraphia or admit penned.

Idle word: **penned**. Path word: **pre-tool-omit**. Seeded loss: **agraphia**. Product: **agraphia**. HOLD: **penned**. ALARM: **agraphia** / **pre-tool-omit** / **text-omit**. Primary: [anthropics/claude-code#94251](https://github.com/anthropics/claude-code/issues/94251).

Fixtures record the published incident only. Transcript excerpts are **synthetic example-data** labeled as such — not live session dumps. No session. No exploit payloads. No network to Anthropic. No Claude. No patch to anthropics/claude-code. Do NOT implement a fix.

| File | Verdict | What it scores |
|---|---|---|
| `penned.json` | penned | Idle chart. HOLD: pre-tool text still written. |
| `hold.json` | hold | HOLD alias for idle penned. |
| `agraphia.json` | agraphia | Seeded #94251 path and product. ALARM: writing hand failed. |
| `pre-tool-omit.json` | pre-tool-omit | Path: JSONL omits pre-tool assistant text. |
| `recorded.json` | recorded | HOLD alias: text block recorded in JSONL. |
| `retained.json` | retained | HOLD alias: pre-tool text retained. |
| `charted.json` | charted | HOLD alias: chart clipboard still has the line. |
| `filed.json` | filed | HOLD alias: transcript file still holds the block. |
| `marked.json` | marked | HOLD alias: hooks can read the written marker. |
| `text-omit.json` | text-omit | Most assistant text before tool_use missing. |
| `hook-blind.json` | hook-blind | transcript_path no longer shows what the model said. |
| `pretool-empty.json` | pretool-empty | PreToolUse payload carries no assistant text. |
| `quote-only.json` | quote-only | UI phrase appears only inside later tool inputs. |
| `share-drop.json` | share-drop | Published share drop A 26.4%→12.8% / B 27.6%→2.9%. |
| `haiku-ok.json` | haiku-ok | Haiku no-tool sessions still record text on both versions. |
| `end-of-turn.json` | end-of-turn | End-of-turn text affected much less. |
| `profile-a.json` | profile-a | Profile A measurements. |
| `profile-b.json` | profile-b | Profile B measurements. |
| `landing.json` | landing | Clinic desk / writing hand / chart clipboard. |
| `has-repro.json` | has-repro | Published shape. |
| `cousins.json` | cousins | Cite-only #65051 #76668. |
| `backups.json` | backups | Cite-only backups. Do not auto-pick. |
| `fixtures.json` | fixtures | Clinic desk / writing hand / chart clipboard. |
| `walk.json` | walk | Published idle penned → pre-tool-omit → agraphia. |
| `closed.json` | closed | Cousins remain OPEN — cite only; not this booth. |
| `penned-excerpt.json` | penned | Synthetic example-data: 2.1.267-shaped text+tool_use. |
| `agraphia-excerpt.json` | agraphia | Synthetic example-data: 2.1.270-shaped thinking+tool_use, no text. |
| `measurements.json` | share-drop | Published measurement table. |

## Cousins (cite only)

Different entrypoint from #94251 interactive CLI. Do NOT rebuild. Do NOT conflate.

#65051 — daemon sessions, 2.1.161. Same shape on other entrypoints. Distinct cousin.

#76668 — desktop app. Same shape on other entrypoints. Distinct cousin.

#94251 is specifically: interactive CLI 2.1.270 transcript omitting pre-tool assistant text.

## Backups (cite only — do NOT auto-pick or build)

#93987 #93924 #93770 #93777 #94151 #94064 #94256 #94277 #94275 #94274 #94273 #94267

Drop any file onto `projects/agraphia/index.html`. Buttons load the seeded path. The penned page admits **penned** / idle chart / #94251.

Probes are diagnostic reconstructions of the issue's published facts. This booth does not run Claude.
