# Lychgate

A **parish lychgate / coffin-rest / churchyard-porch / lantern / iron-latch / parish-roll booth** — covered English lich-gate, coffin rest, hanging lantern, iron latch left ajar, parish roll still naming a gone body. Fonts **Spectral** (display) + **Figtree** (body) + **IBM Plex Mono** (mono). Palette: wet slate `#2C3338`, lichen `#6B8F71`, lantern amber `#C9A227`, coffin oak `#5C4033`, parchment mist `#E8E4DA`, iron `#1A1A1A`, moss shadow `#3D4F3F`. Fresh trio. NOT Ouster/#94221. NOT Proscription/#94202. NOT Thimblerig/#94174. NOT Fetchling/#94065. NOT Souffleur/#94031. NOT Epitome/#94032. NOT Diabolica/#94040. NOT Sallyport/#94082. NOT Palilalia/#94041. NOT Sepulchre. NOT Sneck. NOT Drawbridge. NOT Chirograph. NOT Titulus. NOT Derelict. NOT Vestry. NOT Mondegreen. NOT Afterimage. NOT Phosphene. NOT Scotoma. NOT Scrim. NOT Aphonia. NOT Sourdine. NOT Anarthria. NOT Revenant. NOT Cenotaph. NOT Wraith. NOT Eidolon. NOT Husk. NOT Simulacrum. Completely different UI/UX/metaphor. This is specifically: **MOVED-TO-BACKGROUND BASH STAYS RUNNING AFTER THE PROCESS EXITS; REMOTE SSH HANGS ON OPEN STDIN — A BODY GONE FROM LIFE STILL LISTED UNDER THE GATE.**

The porch should stay **reaped** (HOLD: buried / closed / finished / drained / exited). Instead the booth was **lychgate** after a **bg-task-stale**.

Primary:

- [anthropics/claude-code#94059](https://github.com/anthropics/claude-code/issues/94059) (OPEN). Title: `Background tasks: moved-to-background commands stay 'Running' after the process exits; background remote-shell call hangs on open stdin`. Labels: bug, has repro, platform:macos, area:bash, area:agent-view. Version: Claude Code 2.1.240, desktop app (macOS 26.6.2, Apple silicon), Code tab, model claude-opus-5. Long session ~536 finished tasks / 14h. 1) Foreground Bash hits 600s timeout → moved to background → underlying shell later exits (ps empty) but Background tasks panel + /tasks still say Running for 5–7 hours; TaskStop returns Successfully stopped with original command text. Stale task record. 2) `run_in_background` Bash whose last command is remote shell (`ssh HOST 'md5sum …'`) with no stdin redirect hung ~9h56m because the child gets open stdin that never EOF; killing ssh pid completed with exit 0 + task-notification. Earlier chain commands that redirected stdin completed. Expected: exited process → finished + task-notification; bg tasks should close stdin (/dev/null) or at least show blocked-on-stdin not Running. Cousins cite-only (do NOT rebuild / do NOT conflate): #75085 — RC completed bg tasks stay running badges; #93948 — scheduled tasks stuck; #82151 — turn ends with bg tasks still running; #75314 — bg Agent tasks stuck 34h; #89766 — TaskStop ambiguity. Related but different. This booth is specifically moved-to-background stale Running after process exit, plus remote-ssh open-stdin hang. Backups cite-only (next focus only — do not auto-pick): #94029, #93987, #93924, #93770, #93777, #94053, #94151, #94064. Stay off Lychgate/Ouster/Proscription/Thimblerig/Fetchling/Souffleur/Epitome/Diabolica/Sallyport/Palilalia/Sepulchre paradigms.

19:50 lychgate: a parish lychgate / coffin-rest / churchyard-porch / lantern / iron-latch / parish-roll booth for #94059. Moved-to-background Bash stays Running after process exits (ps empty, 5–7h); run_in_background remote ssh hangs on open stdin (~9h56m). Claude Code desktop 2.1.240 macOS Code tab. Idle **reaped** / seeded **lychgate** / path **bg-task-stale**. Score lychgate or admit reaped.

Score lychgate or admit reaped.

Idle word: **reaped** (HOLD: process exit observed → panel shows finished + notification). HOLD aliases: buried, closed, finished, drained, exited. Seeded word: **lychgate** / #94059 (the bg-task-stale path). Path word: **bg-task-stale**. Product score: **lychgate**. Never idle tenanted / barred / additive / literal / echoing / unabridged / innocent / sealed / silenced / living / cleared / spanned / matched / inscribed / berthed / pegged / latent / flushed / articulate / limber / primed / lit / voiced / mute / rostered / quieted / unrung / vested / plenary / equalized / legible / calibrated / engaged / flush / candid / stetted / sighted or seeded ouster / proscription / thimblerig / fetchling / souffleur / epitome / diabolica / sallyport / palilalia / sepulchre or path inherited-worktree-yank / deny-list-hollow / skill-row-carve / skill-dollar-swap.

Phrase: **Score lychgate or admit reaped.**

- **reaped** = IDLE HOLD: process exit observed → panel shows finished + notification
- **lychgate** = seeded path / product score: moved-to-background stays Running after process exits
- **bg-task-stale** = path word
- **hold** = HOLD alias for idle reaped
- **buried** = HOLD alias: empty bier named finished on the roll
- **closed** = HOLD alias: iron latch shut; stdin closed
- **finished** = HOLD alias: panel shows finished + notification
- **drained** = HOLD alias: stdin drained to /dev/null
- **exited** = HOLD alias: process exit observed
- **moved-to-background** = foreground Bash hits 600s timeout and is moved to the background
- **stale-running** = panel + /tasks still say Running
- **ps-empty** = no matching process
- **taskstop-stale** = TaskStop returns Successfully stopped with the original command text
- **stdin-hang** = iron latch ajar — remote ssh hung ~9h56m on open stdin
- **remote-ssh** = last command `ssh HOST 'md5sum …'` with no stdin redirect
- **five-to-seven-hours** = three entries sat 5–7 hours
- **nine-hours-fifty-six** = remote ssh hung 9h 56m
- **task-notification** = expected finished + task-notification
- **landing** = parish lychgate porch / coffin rest / lantern / iron latch
- **has-repro** = published shape: 2.1.240 macOS Code tab · 536 finished · 600s move · ps empty
- **cousins** = cite-only #75085 #93948 #82151 #75314 #89766 — do not rebuild; do not conflate
- **backups** = cite-only #94029 #93987 #93924 #93770 #93777 #94053 #94151 #94064 — do not auto-pick
- **fixtures** = parish lychgate porch / coffin rest / lantern / iron latch
- **walk** = published idle reaped → bg-task-stale → lychgate

Verdicts: reaped, lychgate, bg-task-stale, hold, buried, closed, finished, drained, exited, moved-to-background, stale-running, ps-empty, taskstop-stale, stdin-hang, remote-ssh, five-to-seven-hours, nine-hours-fifty-six, task-notification, landing, has-repro, cousins, backups, fixtures, walk.

This is a diagnostic scoring booth. Not an exploit. No Claude sessions. No network to Anthropic required for scoring. Score whether the booth is **lychgate** or already **reaped**. Fixtures use the issue's published incident only. Do NOT implement a fix in anthropics/claude-code.

Hypothesis only (NON-BINDING): moved-to-background Bash records stay Running after the process exits (ps empty); run_in_background remote ssh hangs on open stdin that never EOF. Invite verify against #94059 text only. Do not claim a root cause in Claude Code source you have not seen.

## Research brief

Sources:

- Primary: [anthropics/claude-code#94059](https://github.com/anthropics/claude-code/issues/94059)
- Cousins (cite-only — do NOT rebuild / do NOT conflate): #75085 RC completed bg tasks stay running badges (different). #93948 scheduled tasks stuck (different). #82151 turn ends with bg tasks still running (different). #75314 bg Agent tasks stuck 34h (different). #89766 TaskStop ambiguity (different). #94059 is specifically moved-to-background stale Running after process exit, plus remote-ssh open-stdin hang.
- Backups (data only; next focus only — do not auto-pick): #94029, #93987, #93924, #93770, #93777, #94053, #94151, #94064

What happened (from the issue text — do not invent):

- OPEN
- Labels: bug, has repro, platform:macos, area:bash, area:agent-view
- Version: Claude Code 2.1.240, desktop app (macOS 26.6.2, Apple silicon), Code tab, model claude-opus-5
- Long session with several `run_in_background` tasks and background agents (~536 finished tasks, 14 h)
- Foreground Bash hits 600s timeout and is "moved to the background"
- Underlying shell later exits; `ps` empty; panel + `/tasks` still say Running for 5–7 hours
- Three entries: "Wait for warm re-run results — 7h 40m", "Wait for the four-line acceptance run — 6h 06m", "Wait for the 20:00 acceptance run — 5h 27m"
- TaskStop returns "Successfully stopped" with the original command text — stale task record
- `run_in_background` last command `ssh HOST 'md5sum …'` with no stdin redirect hung 9h 56m
- Earlier chain commands that redirected stdin (`ssh HOST 'cat > /tmp/x' < localfile`) completed
- Killing the ssh pid completed with exit 0 and a normal `<task-notification>`
- Expected: exited process → finished + task-notification; close stdin (`/dev/null`) or show blocked-on-stdin not Running

Problem found: BG-TASK-STALE — moved-to-background Bash stays Running after the process exits; remote ssh hangs on open stdin; the body is gone, the porch still lists it present.

Why Lychgate: An English parish *lychgate* (lich-gate) is the covered churchyard gateway where a coffin rests before burial. The body is gone from life (process exited) but still listed as present under the gate (panel says Running). Second station: the iron latch left ajar so the bearer never finishes (open stdin hang). Ouster/#94221 was a wrongful eviction of a nested worktree (bailiff desk). Sepulchre was a stone burial vault / NUL poison — DIFFERENT (the tomb, not the gate). Sallyport was a fortress side passage. This booth is specifically bg-task-stale on a moved-to-background record — different problem, UI, UX, metaphor. NOT a Claude Code patch — educational diagnostic booth only.

Why this solution: reaped catalog page + node diagnostic encoding idle **reaped** / seeded **lychgate** / path **bg-task-stale** so operators can score whether the booth is **lychgate** or already **reaped**. Not a Claude Code patch.

Desired (from the issue, scoring narrative only — DO NOT implement a Claude Code fix):

1. A moved-to-background task whose process exited should be marked finished (with its output) and produce the usual `<task-notification>`
2. Background tasks should not hand the child an open stdin (or should document that they do)
3. Close stdin (`/dev/null`) by default if background tasks are meant to have no interactive stdin
4. At minimum the panel should show blocked-on-stdin rather than Running
5. `ps` empty + TaskStop Successfully stopped with original command text means the record is stale — reap it

## Why not a clone

This is specifically: **MOVED-TO-BACKGROUND BASH STAYS RUNNING AFTER THE PROCESS EXITS; REMOTE SSH HANGS ON OPEN STDIN — A BODY GONE FROM LIFE STILL LISTED UNDER THE GATE.**

Novel paradigm: English parish lychgate / covered churchyard porch / coffin rest / hanging lantern / iron latch / parish roll / burial path — wet slate, lichen, lantern amber, coffin oak, parchment mist, iron, moss shadow. New issue, new paradigm (bg-task-stale), new UI/UX/fonts/colors, new scoring vocabulary. A covered porch before the yard, not a bailiff desk, Roman tablet, carnival tent, twilight coin-ledger, theatre prompt-corner, scriptorium desk, inquisitorial court, fortress sallyport, or stone burial vault.

**NOT Ouster/#94221** (inherited-worktree-yank). Different defect. NOT Georgian bailiff desk. Do not reuse tenanted / ouster / inherited-worktree-yank.

**NOT Proscription/#94202** (deny-list-hollow). Different defect. NOT Roman wax-tablet forum. Do not reuse barred / proscription / deny-list-hollow.

**NOT Thimblerig/#94174** (skill-row-carve). Different defect. NOT carnival cups / chalk tally. Do not reuse additive / thimblerig / skill-row-carve.

**NOT Fetchling/#94065** (skill-dollar-swap). Different defect. NOT fae twilight / coin-ledger. Do not reuse literal / fetchling / skill-dollar-swap.

**NOT Souffleur/#94031** (app-switch-echo-loss). Different defect. NOT theatre wings / prompt-corner. Do not reuse echoing / souffleur / app-switch-echo-loss.

**NOT Epitome/#94032** (summarized-thinking-force). Different defect. NOT classical scriptorium. Do not reuse unabridged / epitome / summarized-thinking-force.

**NOT Diabolica/#94040** (cannot-show-not-git). Different defect. NOT inquisitorial parchment-court. Do not reuse innocent / diabolica / cannot-show-not-git.

**NOT Sallyport/#94082** (reminder-secret-bypass). Different defect. NOT fortress / gatehouse. Do not reuse sealed / sallyport / reminder-secret-bypass.

**NOT Palilalia/#94041** (goal-stop-refire). Different defect. NOT speech-pathology / phonograph-groove. Do not reuse silenced / palilalia / goal-stop-refire.

**NOT Sepulchre** (bash-nul-poison). Different defect. NOT stone burial vault / ossuary. This is the GATE before the yard, not the tomb. Do not reuse living / sepulchre / bash-nul-poison.

**NOT Sneck** (chip dismiss ephemeral). Different defect. NOT Northern cottage / brass sneck-latch. Do not reuse cleared / sneck / chip-dismiss-ephemeral.

**NOT Drawbridge** (RC bridge auto-update drop). Different defect. NOT raised span / bailey. Do not reuse spanned / drawbridge / rc-bridge-update-drop.

**NOT Chirograph** (recorded branch never refreshed after `git branch -m`). Different defect. NOT medieval lectern / indenture. Do not reuse matched / chirograph / worktree-rename-stale.

**NOT Titulus** (iOS rename vs desktop sidebar / resume-stale-title). Different defect. NOT Roman marble plaque. Do not reuse inscribed / titulus.

**NOT Derelict** (orphaned Bash after session stop). Different defect. NOT maritime abandoned-hulk. Do not reuse berthed / derelict.

**NOT Vestry** (Linux bwrap placeholder mount cleanup is per-process). Different defect. NOT liturgical sacristy. Do not reuse pegged / vestry.

**NOT Mondegreen** (substring "git" false-positive). Different defect. NOT lyric-ballad / mishearing.

**NOT Afterimage** (Windows text paint latency). Different defect. NOT CRT phosphor.

**NOT Phosphene** (WindowServer CA layer-tree thrash). Different defect. NOT vision flash.

**NOT Scotoma.** Different defect. NOT vision gap.

**NOT Scrim** (runtime DLP redaction). Different product. Do not reuse flushed / scrim.

**NOT Aphonia** (missing SendMessage). Different defect. NOT ENT roster.

**NOT Sourdine** (mid-narration mute). Different defect. NOT concert mute.

**NOT Anarthria** (dictation paste drop). Different defect. NOT laryngology.

**NOT Revenant. NOT Cenotaph. NOT Wraith. NOT Eidolon. NOT Husk. NOT Simulacrum.** Different products.

Live: https://hermes-playground-green.vercel.app/lychgate/

```
node --test projects/lychgate/lychgate.test.mjs
node projects/lychgate/lychgate.mjs projects/lychgate/data/lychgate.json
```
