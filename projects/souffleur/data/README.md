# Souffleur fixtures

Diagnostic JSON only. No Claude sessions. Encoded from #94031 issue facts: after the 11 September 2026 macOS desktop update to 1.52386.3 (Electron 44.2.0), VoiceOver no longer echoes typed characters in the prompt box after switching to another app and returning. VO nav still works. Quit+relaunch restores until the next switch. Score souffleur or admit echoing.

Idle word: **echoing**. Path word: **app-switch-echo-loss**. Seeded loss: **souffleur**. Product: **souffleur**. HOLD: **echoing**. ALARM: **souffleur** / **app-switch-echo-loss** / **typing-echo-lost** / **focus-return-mute**. Primary: [anthropics/claude-code#94031](https://github.com/anthropics/claude-code/issues/94031).

Fixtures record the published incident only. No session. No exploit payloads. No network to Anthropic. No Claude. No patch to anthropics/claude-code. Do NOT implement a fix.

| File | Verdict | What it scores |
|---|---|---|
| `echoing.json` | echoing | Idle house. HOLD: prompt-corner whispers; wings open. |
| `hold.json` | hold | HOLD alias for idle echoing. |
| `souffleur.json` | souffleur | Seeded #94031 path and product. ALARM: whisper gone. |
| `app-switch-echo-loss.json` | app-switch-echo-loss | Path: focus leave + return kills typing echo. |
| `voiced-echo.json` | voiced-echo | HOLD alias: each typed character is announced. |
| `cued.json` | cued | HOLD alias: the souffleur still whispers the cue. |
| `announced.json` | announced | HOLD alias: VoiceOver echoes the prompt box. |
| `prompt-heard.json` | prompt-heard | HOLD alias: the prompt box stays heard after return. |
| `wings-open.json` | wings-open | HOLD alias: exit and return still hold the whisper. |
| `typing-echo-lost.json` | typing-echo-lost | nothing announced while typing after return. |
| `focus-return-mute.json` | focus-return-mute | Cmd-Tab back; the souffleur stops whispering. |
| `quit-relaunch-only.json` | quit-relaunch-only | only quit+reopen restores; fault returns on next switch. |
| `vo-nav-still-works.json` | vo-nav-still-works | VO keys, headings, replies, finished-responding still announce. |
| `electron-cousin.json` | electron-cousin | cite-only electron/electron#13203. |
| `landing.json` | landing | Wings / prompt-corner / cue-script / footlights / curtain. |
| `has-repro.json` | has-repro | Published shape. |
| `cousins.json` | cousins | Cite-only #87977 #87978 #91058 #86697 electron/electron#13203. |
| `backups.json` | backups | Cite-only backups. Do not auto-pick. |
| `fixtures.json` | fixtures | Wings / prompt-corner / cue-script / footlights / curtain. |
| `walk.json` | walk | Published idle echoing → app-switch-echo-loss → souffleur. |

## Cousins (cite only)

#87977 — VoiceOver navigation jumps (different symptom). Do not conflate.

#87978 — cite-only. Do not rebuild.

#91058 — cite-only. Do not rebuild.

#86697 — cite-only. Do not rebuild.

electron/electron#13203 — long-standing Chromium/Electron VoiceOver typing-echo fault. Newly triggered here by app switch. Do not rebuild.

## Backups (cite only — do NOT auto-pick or build)

#94029 #93987 #93924 #93770 #93777 #94059 #94053 #94174 #94151 #94065 #94064

Drop any file onto `projects/souffleur/index.html`. Buttons load the seeded path. The echoing page admits **echoing** / idle house / #94031.

Probes are diagnostic reconstructions of the issue's published facts. This booth does not run Claude.
