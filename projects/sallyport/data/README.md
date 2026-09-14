# Sallyport fixtures

Diagnostic JSON only. No Claude sessions. Encoded from #94082 issue facts: A PreToolUse Bash hook that blocks cat/grep/head/tail against secret paths can be silently bypassed by the harness "file changed on disk" notification, which injects a `<system-reminder>` with the file's full current contents because that injection is not a tool call. Score sallyport or admit sealed.

Idle word: **sealed**. Path word: **reminder-secret-bypass**. Seeded loss: **sallyport**. Product: **sallyport**. HOLD: **sealed**. ALARM: **sallyport** / **reminder-secret-bypass** / **system-reminder** / **full-contents-dump**. Primary: [anthropics/claude-code#94082](https://github.com/anthropics/claude-code/issues/94082).

Fixtures record the published incident only. No session. No live secrets. All credential values are `FAKE_KEY_REDACTED` placeholders. No exploit payloads. No network to Anthropic. No Claude. No patch to anthropics/claude-code. Do NOT implement a fix.

| File | Verdict | What it scores |
|---|---|---|
| `sealed.json` | sealed | Idle fortress. HOLD: both doors shut; keys stay redacted. |
| `hold.json` | hold | HOLD alias for idle sealed. |
| `sallyport.json` | sallyport | Seeded #94082 path and product. ALARM: side door open. |
| `reminder-secret-bypass.json` | reminder-secret-bypass | Path: mtime reminder dumps secrets past the locked gate. |
| `redacted.json` | redacted | HOLD alias: keys stay redacted. |
| `guarded.json` | guarded | HOLD alias: the main gate stays guarded. |
| `hush.json` | hush | HOLD alias: no content dump. |
| `gate-checked.json` | gate-checked | HOLD alias: PreToolUse still sees Bash. |
| `pretooluse-locked.json` | pretooluse-locked | Main gate LOCKED on cat/grep/head/tail. |
| `mtime-nudge.json` | mtime-nudge | nano held the same file; harness noticed. |
| `system-reminder.json` | system-reminder | Harness injects a non-tool reminder. |
| `full-contents-dump.json` | full-contents-dump | Every key AND value. |
| `ten-keys.json` | ten-keys | Ten FAKE_KEY_REDACTED placeholders. |
| `not-a-tool-call.json` | not-a-tool-call | PreToolUse never runs. |
| `false-coverage.json` | false-coverage | Hook covers Bash only. |
| `landing.json` | landing | Ash / iron / torch / bronze / slate / paper. |
| `has-repro.json` | has-repro | Published shape. |
| `cousins.json` | cousins | Cite-only #92074 #92487 #88441 #89716 #92365. |
| `backups.json` | backups | Cite-only backups. Do not auto-pick. |
| `fixtures.json` | fixtures | Ash / iron / torch / bronze / slate / paper. |
| `walk.json` | walk | Published idle sealed → reminder-secret-bypass → sallyport. |

## Cousins (cite only)

#92074 — PreToolUse silent miss in VS Code. Do not conflate.

#92487 — .env protection feature request. Do not conflate.

#88441 — PreToolUse never fires for Bash inside Task subagents. Do not conflate.

#89716 — PreToolUse can't reach Bash file-command recognition. Do not conflate.

#92365 — bad sandbox deny entry silently disables PreToolUse. Do not conflate.

## Backups (cite only — do NOT auto-pick or build)

#94040 #94032 #94031 #94029 #93987 #93924 #93770 #93777 #94059 #94053

Drop any file onto `projects/sallyport/index.html`. Buttons load the seeded path. The sealed page admits **sealed** / idle fortress / #94082.

Probes are diagnostic reconstructions of the issue's published facts. This booth does not run Claude.
