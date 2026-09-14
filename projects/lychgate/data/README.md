# Lychgate fixtures

Diagnostic JSON only. No Claude sessions. Encoded from #94059 issue facts: moved-to-background Bash stays Running after the process exits; remote ssh hangs on open stdin. Score lychgate or admit reaped.

Idle word: **reaped**. Path word: **bg-task-stale**. Seeded loss: **lychgate**. Product: **lychgate**. HOLD: **reaped**. ALARM: **lychgate** / **bg-task-stale** / **stale-running**. Primary: [anthropics/claude-code#94059](https://github.com/anthropics/claude-code/issues/94059).

Fixtures record the published incident only. No session. No exploit payloads. No network to Anthropic. No Claude. No patch to anthropics/claude-code. Do NOT implement a fix.

| File | Verdict | What it scores |
|---|---|---|
| `reaped.json` | reaped | Idle porch. HOLD: process exit observed; panel finished + notification. |
| `hold.json` | hold | HOLD alias for idle reaped. |
| `lychgate.json` | lychgate | Seeded #94059 path and product. ALARM: roll still Running. |
| `bg-task-stale.json` | bg-task-stale | Path: stale task record under the porch. |
| `buried.json` | buried | HOLD alias: empty bier named finished. |
| `closed.json` | closed | HOLD alias: iron latch shut. |
| `finished.json` | finished | HOLD alias: panel finished + notification. |
| `drained.json` | drained | HOLD alias: stdin drained to /dev/null. |
| `exited.json` | exited | HOLD alias: process exit observed. |
| `moved-to-background.json` | moved-to-background | Foreground Bash hits 600s timeout. |
| `stale-running.json` | stale-running | Panel + /tasks still Running. |
| `ps-empty.json` | ps-empty | No matching process. |
| `taskstop-stale.json` | taskstop-stale | Successfully stopped with original command. |
| `stdin-hang.json` | stdin-hang | Iron latch ajar; remote ssh hung ~9h56m. |
| `remote-ssh.json` | remote-ssh | Last command `ssh HOST 'md5sum …'`. |
| `five-to-seven-hours.json` | five-to-seven-hours | Three entries sat 5–7 hours. |
| `nine-hours-fifty-six.json` | nine-hours-fifty-six | Remote ssh hung 9h 56m. |
| `task-notification.json` | task-notification | Expected finished + notification. |
| `landing.json` | landing | Parish lychgate porch / coffin rest / lantern. |
| `has-repro.json` | has-repro | Published shape. |
| `cousins.json` | cousins | Cite-only #75085 #93948 #82151 #75314 #89766. |
| `backups.json` | backups | Cite-only backups. Do not auto-pick. |
| `fixtures.json` | fixtures | Parish lychgate porch / coffin rest / lantern. |
| `walk.json` | walk | Published idle reaped → bg-task-stale → lychgate. |

## Cousins (cite only)

Different surface from #94059 bg-task-stale. Do NOT rebuild. Do NOT conflate.

#75085 — RC completed bg tasks stay running badges. Distinct cousin.

#93948 — scheduled tasks stuck indefinitely. Distinct cousin.

#82151 — turn ends with bg tasks still running. Distinct cousin.

#75314 — bg Agent tasks stuck 34h. Distinct cousin.

#89766 — TaskStop task_id ambiguity. Distinct cousin.

#94059 is specifically: moved-to-background stale Running after process exit, plus remote-ssh open-stdin hang.

## Backups (cite only — do NOT auto-pick or build)

#94029 #93987 #93924 #93770 #93777 #94053 #94151 #94064

Drop any file onto `projects/lychgate/index.html`. Buttons load the seeded path. The reaped page admits **reaped** / idle porch / #94059.

Probes are diagnostic reconstructions of the issue's published facts. This booth does not run Claude.
