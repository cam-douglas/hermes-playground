# Strowger fixtures

Diagnostic JSON only. No live Claude sessions. Encoded from #93218 issue facts: Desktop app disables `SendMessage` via `--disallowedTools`, but `ListAgents` in the same session still lists peers and documents it as the address. Score strowger or admit trunked.

Idle word: **trunked**. Seeded word: **strowger**. Path word: **exchanged**. HOLD: **trunked** / **hold**. ALARM: **strowger** / **exchanged** / **sendmessage-cut** / **listagents-lists** / **disallowed-tools** / **notify-when-idle-gone** / **six-mechanisms** / **launcher-only** / **cli-still-has-tool** / **has-repro** / **cousins** / **backups** / **fixtures** / **chips** / **fingerprints** / **walk**. Primary: [anthropics/claude-code#93218](https://github.com/anthropics/claude-code/issues/93218).

Fixtures record the published incident only. No live session. No secrets. No exploit payloads. No network to Anthropic. No live Claude. No patch to anthropics/claude-code. Not Mondegreen/#93193 (worktree Bash substring git). Not Derby/#93197 (npm-global race). Not Vizard/#93190 (Desktop `/plan` intercept). Not Dead Air/#93155 (silent 900s API stall). Not Speakpipe/#92646. Not Aphonia. Not Annunciator. Not Deadlight/#92249. Not leftover woodworking / mm-slider. Different paradigm: Desktop `--disallowedTools SendMessage` while ListAgents still lists peers and documents the address.

Backups (cite in data only — do not auto-pick as primary): #93219, #93207, #93182.

| File | Verdict | What it scores |
|---|---|---|
| `trunked.json` | trunked | Idle booth. HOLD: SendMessage present; peers addressable. |
| `strowger.json` | strowger | Seeded #93218 path. ALARM: directory lists, trunk cut. |
| `93218.json` | strowger | Primary fixture alias for #93218. |
| `exchanged.json` | exchanged | Path word: directory lists, trunk cut, score the drift. |
| `hold.json` | hold | HOLD alias: admit trunked. |
| `walk.json` | walk | Published idle → launcher → disallowed → lists → cut → six → cli → strowger → exchanged. |
| `sendmessage-cut.json` | sendmessage-cut | Docs still advertise SendMessage; trunk is cut. |
| `listagents-lists.json` | listagents-lists | ListAgents still lists peers. |
| `disallowed-tools.json` | disallowed-tools | `--disallowedTools SendMessage` plus auto-deny. |
| `notify-when-idle-gone.json` | notify-when-idle-gone | One-shot subscription rides on SendMessage. |
| `six-mechanisms.json` | six-mechanisms | Six SendMessage-routed mechanisms silently gone. |
| `launcher-only.json` | launcher-only | Same binary; only the Desktop launcher differs. |
| `cli-still-has-tool.json` | cli-still-has-tool | Bundled CLI still returns 44 tools including SendMessage. |
| `has-repro.json` | has-repro | Desktop spawn + ListAgents lists + CLI control. |
| `cousins.json` | cousins | Cite-only #92646 #92249 #90481. |
| `backups.json` | backups | Cite-only #93219 #93207 #93182. |
| `fixtures.json` | fixtures | Row list for the strowger booth. |
| `chips.json` | chips | Chip list matching verdicts. |
| `fingerprints.json` | fingerprints | Fingerprint samples for trunked vs strowger. |

Clip any file onto `projects/strowger/index.html`. Buttons load the seeded path. The living page admits **trunked** / idle booth / #93218.

The booth reconstructs the reporter’s Desktop `--disallowedTools SendMessage` / ListAgents-still-lists walk from the published #93218 body. This exchange does not run Claude.
