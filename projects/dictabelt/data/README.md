# Dictabelt fixtures

Diagnostic JSON only. No Claude sessions. Encoded from #94406 issue facts: desktop voice dictation (v2.1.237, macOS Darwin 25.6.0) drops words throughout a recording — beginning, middle, and end; output is fragments, not a transcript; same machine/mic/sentence ChatGPT batch is essentially verbatim; en and de; hold and tap both fail; 15s silence auto-stop and 2 minute maximum compound. Score dictabelt or admit verbatim.

Idle word: **verbatim**. Path word: **segment-drop**. Seeded loss: **dictabelt**. Product: **dictabelt**. HOLD: **verbatim**. ALARM: **dictabelt** / **segment-drop** / **fragment**. Primary: [anthropics/claude-code#94406](https://github.com/anthropics/claude-code/issues/94406).

Fixtures record the published incident only. Fragment rows are **synthetic example-data** labeled as such — not live session dumps. The published issue did not include a spoken-vs-transcribed sample pair. No session. No exploit payloads. No network to Anthropic. No Claude. No patch to anthropics/claude-code. Do NOT implement a fix.

| File | Verdict | What it scores |
|---|---|---|
| `verbatim.json` | verbatim | Idle belt. HOLD: joined transcript comparable to batch. |
| `hold.json` | hold | HOLD alias for idle verbatim. |
| `dictabelt.json` | dictabelt | Seeded #94406 path and product. ALARM: fragment belt. |
| `94406.json` | dictabelt | Same seeded path under the issue number. |
| `segment-drop.json` | segment-drop | Path: live-boundary audio loss. |
| `continuous.json` | continuous | HOLD alias: speech never breaks at a live cut. |
| `joined.json` | joined | HOLD alias: chunks splice into one slip. |
| `seamless.json` | seamless | HOLD alias: no groove gap on the belt. |
| `fluent.json` | fluent | HOLD alias: the take reads as spoken. |
| `batch-ok.json` | batch-ok | HOLD alias: same-hardware batch control matches. |
| `fragment.json` | fragment | Isolated recognized chunks. |
| `gap-spread.json` | gap-spread | Loss across begin / mid / end. |
| `hold-and-tap.json` | hold-and-tap | Both modes fail. |
| `bilingual.json` | bilingual | en and de both fragment. |
| `silence-autostop.json` | silence-autostop | 15s silence cut. |
| `two-minute-cap.json` | two-minute-cap | 2 minute maximum. |
| `landing.json` | landing | Dictabelt / wax-belt / stenotype / belt-dictation. |
| `has-repro.json` | has-repro | Published shape. |
| `cousins.json` | cousins | Cite-only cousins. |
| `backups.json` | backups | Cite-only backups. Do not auto-pick. |
| `fixtures.json` | fixtures | Batch-ok belt / fragment belt. |
| `walk.json` | walk | Published idle verbatim → segment-drop → dictabelt. |
| `closed.json` | closed | #94406 remains OPEN — cite only; not this booth. |

## Cousins (cite only)

Do NOT rebuild. Do NOT conflate.

#93782 — Wispr Flow clipboard+Ctrl+V paste drop. DIFFERENT trigger.

#94031 — VoiceOver/app-switch echo loss. DIFFERENT surface.

#94041 — /goal Stop hook re-fires stale text. DIFFERENT (phonograph re-fire).

#94251 — transcript JSONL omits pre-tool assistant text. DIFFERENT (written omit).

#93193 — Bash isolation false-block on substring git. DIFFERENT (tokenization).

#94406 is specifically: live streaming voice-dictation segment boundaries dropping mid-utterance audio into fragment transcripts vs batch verbatim.

## Backups (cite only — do NOT auto-pick or build)

#94344 #94398 #94397 #94396 #94393 #94392 #86198 #93924 #93770 #93777 #94151 #94420 #94417 #94415

Drop any file onto `projects/dictabelt/index.html`. Buttons load the seeded path. The wax page admits **verbatim** / idle belt / #94406.

Probes are diagnostic reconstructions of the issue's published facts. This booth does not run Claude.
