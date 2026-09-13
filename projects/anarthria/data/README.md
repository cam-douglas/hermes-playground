# Anarthria fixtures

Diagnostic JSON only. No Claude sessions. Encoded from #93782 issue facts: after auto-updating to 2.1.269, Wispr Flow dictation (clipboard + simulated Ctrl+V) is no longer inserted into the Claude Code prompt in the VS Code integrated terminal over Remote-WSL. Voice arrives; the larynx of the prompt stays silent. Score anarthria or admit articulate.

Idle word: **articulate**. Path word: **dictation-paste-drop**. Seeded loss: **anarthria**. Product: **anarthria**. HOLD: **articulate**. ALARM: **anarthria** / **dictation-paste-drop** / **wispr-ctrlv** / **silent-drop**. Primary: [anthropics/claude-code#93782](https://github.com/anthropics/claude-code/issues/93782).

Fixtures record the published incident only. No session. No secrets. No exploit payloads. No network to Anthropic. No Claude. No patch to anthropics/claude-code. Do NOT implement a fix.

| File | Verdict | What it scores |
|---|---|---|
| `articulate.json` | articulate | Idle clinic. HOLD: paste lands; prompt receives dictation. |
| `hold.json` | hold | HOLD alias for idle articulate. |
| `anarthria.json` | anarthria | Seeded #93782 path and product. ALARM: larynx mute. |
| `dictation-paste-drop.json` | dictation-paste-drop | Path: clipboard + Ctrl+V never reaches the prompt. |
| `phonated.json` | phonated | HOLD alias: voice produced. |
| `received.json` | received | HOLD alias: prompt receives dictation. |
| `landing.json` | landing | HOLD alias: paste lands. |
| `larynx-open.json` | larynx-open | HOLD alias: glottis open. |
| `clipboard-heard.json` | clipboard-heard | HOLD alias: voice at clipboard and prompt took it. |
| `wispr-ctrlv.json` | wispr-ctrlv | Wispr Flow clipboard + simulated Ctrl+V. |
| `vscode-wsl.json` | vscode-wsl | VS Code integrated terminal over Remote-WSL. |
| `regression-21269.json` | regression-21269 | 2.1.269 swallows paste that 2.1.268 accepted. |
| `windows-terminal-ok.json` | windows-terminal-ok | Contrast: 2.1.269 in Windows Terminal works. |
| `plain-bash-ok.json` | plain-bash-ok | Contrast: plain bash in the same VS Code terminal works. |
| `silent-drop.json` | silent-drop | Nothing appears in the prompt. |
| `has-repro.json` | has-repro | Published shape. |
| `cousins.json` | cousins | Cite-only microsoft/vscode#282290. |
| `backups.json` | backups | Cite-only backups. Do not auto-pick. |
| `fixtures.json` | fixtures | Clinic teal / warm paper / ink / voice-amber / mute-rose. |
| `walk.json` | walk | Published idle articulate → dictation-paste-drop → anarthria. |

## Cousins (cite only)

microsoft/vscode#282290 (Wispr/screen-reader detection — ruled out by reporter). Do not rebuild as a separate booth.

## Backups (cite only — do NOT auto-pick or build)

#93772 #93770 #93777 #93821 #93811 #93809 #93924 #93925 #93954 #93967 #93957 #93823

Drop any file onto `projects/anarthria/index.html`. Buttons load the seeded path. The living page admits **articulate** / idle clinic / #93782.

Probes are diagnostic reconstructions of the issue's published facts. This booth does not run Claude.
