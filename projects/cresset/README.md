# Cresset

A **cresset / night-wall / iron fire-basket / GNOME-suspend booth** — a cresset is an iron basket kept burning aloft on walls and ships. Desktop "Keep computer awake while Claude works" should stay **released** (the keep-awake / GNOME suspend inhibitor drops when no Code turn is active). Instead the basket stays lit after a re-adopted or stalled Code session, so night suspend is blocked for hours. Fonts **Spectral** (display) + **Outfit** (body) + **JetBrains Mono** (mono). Palette: ember `#E07020`, iron `#2A2E33`, ash `#E8E4DC`, night `#0E1218`, spark-gold `#F0C14A`, cooling-blue `#3D6F8C`. Fresh trio. Completely different UI/UX/metaphor — night wall / hanging iron basket / GNOME suspend dial / hold ledger / ember that should snuff. NOT Dictabelt voice-dictation. NOT Lemure household shrine. NOT Cancellans binder. NOT Arras tapestry. NOT Frangible / Nameplate / Matryoshka / Dragnet.

The basket should stay **released** (HOLD: keep-awake / GNOME suspend inhibitor drops when no Code turn is active). Instead the booth was **cresset** after a **hold-leak**.

Primary:

- [anthropics/claude-code#94420](https://github.com/anthropics/claude-code/issues/94420) (OPEN). Title: `Desktop (Linux): "Keep computer awake while Claude works" hold is never released after a re-adopted or stalled Code session, blocking idle suspend for hours`. Labels: bug, has repro, platform:linux, area:desktop. Environment: Claude Code 2.1.270; Claude Desktop 1.52386.6 (`claude-desktop` .deb); Pop!_OS 22.04; GNOME Shell 42.9; X11. With keep-awake enabled, Desktop takes a keep-awake hold per Code turn and normally releases when the session goes idle (logs: hold taken / hold released with idle reason). On Linux the hold is a GNOME session-manager inhibitor (app id `/usr/bin/claude-desktop`, flags `4` = suspend). Case 1 (reproduced on demand): quit mid-turn on a remote SSH Code session, relaunch; re-adopt takes a hold at 10:59:05; turn completes 10:59:31; later no Code turn running from 11:00:12, yet hold is never released. Ordinary holds in the same session released after 118 s and 174 s. Earlier unattended: hold lasted 4h38m (3h24m after finished), ended with reason `armed_grace` not `idle`. Case 2 (observed): session dropped as "stalled" at 01:56:20 but hold `id=25` never released; remote-tools-device claims inside the same hold take/release normally — only the Code-session claim keeps the hold alive; GNOME set to suspend after 15m idle but suspend blocked for hours. Stay off Dictabelt/Lemure/Cancellans/Arras/Frangible/Nameplate/Matryoshka/Dragnet paradigms.

13:50 cresset: a cresset / night-wall / iron fire-basket / GNOME-suspend booth for #94420. Desktop (Linux): Keep computer awake while Claude works hold is never released after a re-adopted or stalled Code session, blocking idle suspend for hours. GNOME inhibitor app id /usr/bin/claude-desktop flags 4=suspend. Re-adopt hold taken then never released after turn completes; stalled session drops from count but Code-session claim keeps hold; remote-tools-device claims cycle inside same hold. Idle **released** / seeded **cresset** / path **hold-leak**. Score cresset or admit released.

Score cresset or admit released.

Idle word: **released** (HOLD: keep-awake / GNOME suspend inhibitor drops when no Code turn is active). HOLD aliases: slack, yielding, extinguished, idle-ok, suspend-ready. Seeded word: **cresset** / #94420 (the hold-leak path). Path word: **hold-leak**. Product score: **cresset**. Never idle verbatim / quiet / intact / cleared / armed / affixed / unpacked / scoped / enrolled / equated / penned or seeded dictabelt / lemure / cancellans / arras / frangible / nameplate / matryoshka / dragnet or path segment-drop / orphan-tick / deferred-delta / phantom-prompt / chmod-failopen / header-rename / subst-nest / root-find.

Phrase: **Score cresset or admit released.**

- **released** = IDLE HOLD: keep-awake / GNOME suspend inhibitor drops when no Code turn is active
- **cresset** = seeded path / product score: re-adopt or stall leaves the Code-session claim hanging
- **hold-leak** = path word
- **slack** = HOLD alias: the basket yields after the watch
- **yielding** = HOLD alias: the claim gives way
- **extinguished** = HOLD alias: the ember snuffs
- **idle-ok** = HOLD alias: no Code turn, no inhibitor
- **suspend-ready** = HOLD alias: GNOME 15m idle can fire
- **re-adopt** = relaunch re-adopts a mid-turn SSH session and takes a hold that never releases
- **stalled** = session dropped as stalled; Code-session claim stays
- **armed-grace** = earlier unattended hold lasted 4h38m and ended `armed_grace`, not `idle`
- **inhibitor** = GNOME session-manager inhibitor, app id `/usr/bin/claude-desktop`, flags `4`
- **gnome-suspend** = GNOME set to suspend after 15m idle; suspend blocked
- **code-session-claim** = only this claim keeps the hold alive
- **remote-tools-ok** = remote-tools-device claims still take and release inside the same hold
- **battery-false** = published take line is `battery=false`
- **landing** = cresset / night-wall / iron fire-basket / GNOME-suspend
- **has-repro** = published shape: 2.1.270 · Desktop 1.52386.6 · Pop!_OS 22.04 · GNOME 42.9
- **cousins** = cite-only #94415 #94392 #93924 — do not rebuild; do not conflate
- **backups** = cite-only #94344 #94398 #94397 #94396 #94393 #94392 #86198 #94417 #94415 #93924 #93770 #93777 #94151 — do not auto-pick
- **fixtures** = suspend-ready basket / leaking basket
- **walk** = published idle released → hold-leak → cresset
- **closed** = #94420 remains OPEN — cite only; not this booth

Verdicts: released, cresset, hold-leak, slack, yielding, extinguished, idle-ok, suspend-ready, re-adopt, stalled, armed-grace, inhibitor, gnome-suspend, code-session-claim, remote-tools-ok, battery-false, landing, has-repro, cousins, backups, fixtures, walk, closed.

This is a diagnostic scoring booth. Not an exploit. No Claude sessions. No network to Anthropic required for scoring. Score whether the booth is **cresset** or already **released**. Fixtures use the issue's published incident only. Ledger rows reconstructed from published log lines are synthetic example-data. Do NOT implement a fix in anthropics/claude-code.

Hypothesis only (NON-BINDING — issue text): re-adopt and stall paths take a Code-session keep-awake claim but miss the idle-release / stop path that ordinary turns use; remote-tools-device claims continue cycling inside the same hold. Invite verify against #94420 text only. Do not claim a root cause in Claude Code source you have not seen.

## Research brief

Sources:

- Primary: [anthropics/claude-code#94420](https://github.com/anthropics/claude-code/issues/94420)
- Cousins: do NOT rebuild / do NOT conflate: #94415 (Cowork scheduled task permanently disabled after device asleep — schedule `suspension_reason`, not keep-awake hold), #94392 (headless `-p` exits with Tasks still running — CLI process exit vs desktop inhibitor), #93924 (Remote Control makes local session slower — RC perf). None of them covers a GNOME suspend inhibitor left hanging after re-adopt or stall.
- Backups (data only; next focus only — do not auto-pick): #94344, #94398, #94397, #94396, #94393, #94392, #86198, #94417, #94415, #93924, #93770, #93777, #94151

What happened (from the issue text — do not invent):

- OPEN
- Labels: bug, has repro, platform:linux, area:desktop
- Environment: Claude Code 2.1.270; Claude Desktop 1.52386.6 (`claude-desktop` .deb); Pop!_OS 22.04; GNOME Shell 42.9; X11
- With "Keep computer awake while Claude works" enabled, Desktop takes a keep-awake hold per Code turn
- Normally releases when the session goes idle (logs: hold taken / hold released with idle reason)
- On Linux the hold is a GNOME session-manager inhibitor (app id `/usr/bin/claude-desktop`, flags `4` = suspend)
- Case 1 (reproduced on demand): quit mid-turn on a remote SSH Code session, relaunch; re-adopt takes a hold at 10:59:05; turn completes at 10:59:31; the only other Code turn ends at 11:00:12; from 11:00:12 to 11:07:04 no Code turn is running, yet the hold is never released
- Ordinary holds in the same session released after 118 s and 174 s
- Earlier unattended: the same re-adoption hold lasted 4h38m, 3h24m of it after the session had finished, and ended with reason `armed_grace` rather than `idle`
- Case 2 (observed): hold started at 23:42:14; at 01:56:20 the app logged the session no longer counted (stalled); hold `id=25` was never stopped
- remote-tools-device claims inside the same hold kept being taken and released normally — only the Code-session claim keeps the hold alive
- GNOME set to suspend after 15 minutes idle; last user input 01:25; from 01:56 nothing should have blocked suspend, but GNOME never suspended
- The machine only suspended at 02:15 through a separate root cron job that does not honour GNOME session inhibitors
- Closest earlier report #45769 (macOS Electron `NoIdleSleepAssertion` held from launch until quit) was closed as not planned and predates per-turn keep-awake claims
- Distinct from #92010 (a Remote Control hold *not restored* after relaunch)
- Expected: the Code-session claim should be released as soon as no Code session is mid-turn

Problem found: HOLD-LEAK — keep-awake GNOME suspend inhibitor not released after a re-adopted or stalled Code session, blocking idle suspend for hours.

Why Cresset: A *cresset* is an iron fire-basket kept burning aloft on walls and ships. The desktop keep-awake cresset should go out when work ends; instead it stays lit after re-adopt or stall, blocking night suspend. #94415 is a Cowork schedule `suspension_reason` after sleep — DIFFERENT. #94392 is a headless `-p` CLI process that exits while Tasks still run — DIFFERENT. #93924 is Remote Control making a local session slower — DIFFERENT. This booth is specifically **keep-awake GNOME suspend inhibitor not released after re-adopted or stalled Code session**. NOT a Claude Code patch — educational diagnostic booth only.

Why this solution: an educational diagnostic booth that scores hold-leak honesty (released vs cresset) so operators can see the stuck-inhibitor path without needing Claude Desktop. Not a Claude Code patch.

Desired (from the issue, scoring narrative only — DO NOT implement a Claude Code fix):

1. The Code-session claim should be released as soon as no Code session is mid-turn
2. When a re-adopted session's turn completes, the same way an ordinary turn's hold is released
3. When a session is dropped from the count as stalled, the hold should be re-evaluated and released if nothing else claims it

## Why not a clone

This is specifically: **KEEP-AWAKE GNOME SUSPEND INHIBITOR NOT RELEASED AFTER A RE-ADOPTED OR STALLED CODE SESSION, BLOCKING IDLE SUSPEND FOR HOURS. LINUX DESKTOP 2.1.270 / 1.52386.6; APP ID /USR/BIN/CLAUDE-DESKTOP FLAGS 4=SUSPEND; RE-ADOPT HOLD TAKEN THEN NEVER RELEASED AFTER TURN COMPLETES; STALLED SESSION DROPS FROM COUNT BUT CODE-SESSION CLAIM KEEPS HOLD; REMOTE-TOOLS-DEVICE CLAIMS STILL CYCLE.**

Novel paradigm: cresset / night-wall / iron fire-basket / GNOME-suspend — ember, iron, ash, night, spark-gold, cooling-blue. New issue, new paradigm (hold-leak), new UI/UX/fonts/colors, new scoring vocabulary. A night-wall iron basket booth, not a voice-dictation recorder, household shrine, binder folio, or theater tapestry.

**NOT #94415** (Cowork scheduled task permanently disabled after device asleep). Different defect. Schedule `suspension_reason`, not keep-awake hold. Do not rebuild. Do not conflate.

**NOT #94392** (headless `-p` exits with Tasks still running). Different defect. CLI process exit vs desktop inhibitor. Do not rebuild. Do not conflate.

**NOT #93924** (Remote Control makes local session slower). Different defect. RC perf, not a stuck GNOME inhibitor. Do not rebuild. Do not conflate.

**NOT Dictabelt/#94406** (voice-dictation fragment path). Different defect. Do not reuse verbatim / Dictabelt / segment-drop.

**NOT Lemure/#94410** (orphan dispatcher ticks). Different defect. NOT household shrine. Do not reuse quiet / Lemure / orphan-tick.

**NOT Cancellans/#94400** (deferred-delta). Different defect. NOT binder folio. Do not reuse intact / Cancellans / deferred-delta.

**NOT Arras/#94348** (phantom approval card). Different defect. Do not reuse cleared / Arras / phantom-prompt.

**NOT Frangible/#94362** (chmod-failopen). Different defect. Do not reuse armed / Frangible / chmod-failopen.

**NOT Nameplate/#94349** (header-rename). Different defect. Do not reuse affixed / Nameplate / header-rename.

**NOT Matryoshka/#94350** (subst-nest). Different defect. Do not reuse unpacked / Matryoshka / subst-nest.

**NOT Dragnet/#94064** (root-find). Different defect. Do not reuse scoped / Dragnet / root-find.

Live: https://hermes-playground-green.vercel.app/cresset/

```
node --test projects/cresset/cresset.test.mjs
node projects/cresset/cresset.mjs projects/cresset/data/cresset.json
```
