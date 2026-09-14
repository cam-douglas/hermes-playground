# Sallyport

A **fortress sallyport / gatehouse / iron-grille side passage / torch-lit stone corridor / sealed-strongroom booth** — ash stone, iron, torch rust, sealed bronze, cold slate, paper. Fonts **Newsreader** (display) + **Public Sans** (body) + **Source Code Pro** (mono). Palette: ash stone `#E8E4DC`, iron `#1C1F26`, torch rust `#B54A2E`, sealed bronze `#8B7355`, cold slate blue `#3D4F5F`, paper `#F7F4EE`. Fresh trio. NOT Palilalia/#94041. NOT Sepulchre/#94055. NOT Sneck/#94052. NOT Drawbridge/#94049. NOT Chirograph/#94045. NOT Titulus/#94025. NOT Derelict/#93996. NOT Vestry/#94008. NOT Surfeit/#94012. NOT Phosphene/#94003. NOT Scotoma. NOT Postern. NOT Portcullis / Wicket / Embrasure. Completely different UI/UX/metaphor. This is specifically: **PRETOOLUSE BLOCKS BASH READS OF SECRETS; MTIME REMINDER STILL DUMPS FULL CONTENTS.**

The fortress should stay **sealed** (HOLD: redacted / guarded / hush / gate-checked). Instead the booth was **sallyport** after a **reminder-secret-bypass**.

Primary:

- [anthropics/claude-code#94082](https://github.com/anthropics/claude-code/issues/94082) (OPEN). Title: `Security: automatic 'file changed on disk' notification bypasses secret-file PreToolUse hook, leaking full credential file to transcript`. Labels: bug, has repro, platform:macos, area:security, area:hooks. A PreToolUse Bash hook that blocks `cat`/`grep`/`head`/`tail`/etc. against secret paths (`.env*`, `~/.vercel`, `~/.fly`, designated secrets dirs) can be silently bypassed by a different unguarded surface: the harness's own "this file changed on disk since you last read it" notification. Sequence: (1) agent edits a secrets file with a scoped non-printing method (`sed -i`, confirm via awk key name + value length only); (2) user has the same file open in another editor (nano) so mtime changes; (3) harness injects a `<system-reminder>` showing the file's **full current contents** (every key AND value) as an unrequested "here's what changed" diff; (4) this is NOT a tool call, so PreToolUse never runs; (5) ten live production credentials ended up in the transcript and had to be rotated. The hook gives a false sense of coverage — it stops bad shell commands while leaving a systemic harness-injection vector open that does not require the agent to err. Suggested fix (document only, do not implement in Claude Code): file-change notifications should respect the same secret-path awareness — suppress content diff for secret patterns, or route through the same redaction/blocking before model context. Cousins cite-only: #92074, #92487, #88441, #89716, #92365. Backups cite-only (next focus only — do not auto-pick): #94040 #94032 #94031 #94029 #93987 #93924 #93770 #93777 #94059 #94053. Stay off Palilalia/Sepulchre/Sneck/Drawbridge/Chirograph/Titulus/Derelict/Vestry/Surfeit/Phosphene/Scotoma/Postern/Portcullis/Wicket/Embrasure paradigms.

10:50 sallyport: a fortress sallyport / gatehouse / iron-grille side-passage / torch-lit stone corridor / sealed-strongroom booth for #94082. A PreToolUse Bash hook that blocks cat/grep/head/tail against secret paths can be silently bypassed by the harness "file changed on disk" notification, which injects a `<system-reminder>` with the file's full current contents — every key AND value — because that injection is not a tool call. Idle **sealed** / seeded **sallyport** / path **reminder-secret-bypass**. Score sallyport or admit sealed.

Score sallyport or admit sealed.

Idle word: **sealed** (HOLD: redacted / guarded). HOLD aliases: sealed, redacted, guarded, hush, gate-checked. Seeded word: **sallyport** / #94082 (the reminder-secret-bypass path). Path word: **reminder-secret-bypass**. Product score: **sallyport**. Never idle silenced / living / cleared / spanned / matched / inscribed / berthed / pegged / tempered / quiescent or seeded palilalia / sepulchre / sneck / drawbridge / chirograph / titulus / derelict / vestry / surfeit / phosphene / scotoma / postern / portcullis / wicket / embrasure / goal-stop-refire / bash-nul-poison / chip-dismiss-ephemeral.

Phrase: **Score sallyport or admit sealed.**

- **sealed** = IDLE: HOLD; both doors shut; keys stay redacted silhouettes
- **sallyport** = #94082 seeded path and product score: side passage open; reminder dumps plaintext past the locked gate
- **reminder-secret-bypass** = path word: mtime `<system-reminder>` is not a tool call
- **hold** = HOLD alias for idle sealed
- **redacted** = HOLD alias: strongroom keys stay redacted
- **guarded** = HOLD alias: the main gate stays guarded
- **hush** = HOLD alias: no content dump
- **gate-checked** = HOLD alias: PreToolUse still sees Bash
- **pretooluse-locked** = main gate LOCKED on cat/grep/head/tail
- **mtime-nudge** = nano held the same file; harness noticed
- **system-reminder** = harness injects a non-tool reminder
- **full-contents-dump** = every key AND value
- **ten-keys** = ten credentials rotated (fixtures use FAKE_KEY_REDACTED)
- **not-a-tool-call** = PreToolUse never runs
- **false-coverage** = hook covers Bash only
- **landing** = ash / iron / torch / bronze / slate / paper
- **has-repro** = published shape: macOS · sed -i · nano · `<system-reminder>`
- **cousins** = cite-only #92074 #92487 #88441 #89716 #92365 — do not conflate
- **backups** = cite-only #94040 #94032 #94031 #94029 #93987 #93924 #93770 #93777 #94059 #94053 — do not auto-pick
- **fixtures** = ash / iron / torch / bronze / slate / paper
- **walk** = published idle sealed → reminder-secret-bypass → sallyport

Verdicts: sealed, sallyport, reminder-secret-bypass, hold, redacted, guarded, hush, gate-checked, pretooluse-locked, mtime-nudge, system-reminder, full-contents-dump, ten-keys, not-a-tool-call, false-coverage, landing, has-repro, cousins, backups, fixtures, walk.

This is a diagnostic scoring booth. Not an exploit. No Claude sessions. No live secrets. No network to Anthropic required for scoring. Score whether the booth is **sallyport** or already **sealed**. Fixtures use the issue's published incident only, with `FAKE_KEY_REDACTED` placeholders. Do NOT implement a fix in anthropics/claude-code.

Hypothesis only (NON-BINDING): harness file-change reminder injects full file contents into context without consulting secret-path / PreToolUse deny rules because it is not a tool call. Do not claim a root cause in Claude Code source you have not seen.

## Research brief

Sources:

- Primary: [anthropics/claude-code#94082](https://github.com/anthropics/claude-code/issues/94082)
- Cousins: #92074 cite-only (PreToolUse silent miss in VS Code). #92487 cite-only (.env protection feature request). #88441 cite-only (PreToolUse never fires for Bash inside Task subagents). #89716 cite-only (PreToolUse can't reach Bash file-command recognition). #92365 cite-only (bad sandbox deny entry silently disables PreToolUse). Adjacent only. Different defects. Do not conflate.
- Backups (data only; next focus only — do not auto-pick): #94040, #94032, #94031, #94029, #93987, #93924, #93770, #93777, #94059, #94053

What happened (from the issue text — do not invent):

- OPEN
- Labels: bug, has repro, platform:macos, area:security, area:hooks
- Claude Code CLI, non-interactive/agent SDK session; macOS (Darwin 24.6.0)
- A PreToolUse Bash hook blocks `cat`/`grep` (without `-c`) / `head`/`tail`/`less`/`more`/`bat`/`xxd`/`od`/`hexdump`/`echo`/`printf` against `~/.fly`, `~/.vercel`, a designated `~/.artefakt-secrets` directory, and `*.env*` files
- Agent edited `~/.artefakt-secrets/.env.production.local` with `sed -i` on a specific line
- Confirmed afterward only by printing a key name and value length via `awk`, never the value itself
- User had the same file open concurrently in nano
- mtime changed; harness file-tracking noticed
- Harness injected a `<system-reminder>` showing the file's full current contents — every key AND every value
- This is not a tool call, so PreToolUse never ran
- Ten live production credentials ended up in the transcript and had to be rotated
- The hook gives a false sense of coverage: it stops bad shell commands while leaving a systemic harness-injection vector open

Problem found: PRETOOLUSE BLOCKS BASH READS OF SECRETS; MTIME REMINDER STILL DUMPS FULL CONTENTS.

Why Sallyport: a sallyport is a fortified side passage past the main gatehouse. The PreToolUse hook is the main gate (checks Bash tool calls). The mtime "file changed on disk" reminder is the sallyport — an unguarded side door that marches full secret plaintext into the transcript without ever presenting at the gate. NOT a Claude Code patch — educational diagnostic booth only.

Why this solution: sealed catalog page + node diagnostic encoding idle **sealed** / seeded **sallyport** / path **reminder-secret-bypass** so operators can score whether the booth is **sallyport** or already **sealed**. Not a Claude Code patch.

Desired (from the issue, scoring narrative only — DO NOT implement a Claude Code fix):

1. File-change notifications should respect the same secret-path awareness the PreToolUse hook already has
2. For a path matching known secret-file patterns (`.env*`, credential directories), suppress the automatic content diff
3. Or say only "this file changed on disk, re-read explicitly if needed" without content
4. Or route the reminder through the same redaction/blocking logic the Bash hook uses before model context
5. A PreToolUse hook must not give a false sense of coverage while an unguarded harness injection still dumps secrets

## Why not a clone

This is specifically: **PRETOOLUSE BLOCKS BASH READS OF SECRETS; MTIME REMINDER STILL DUMPS FULL CONTENTS.**

Novel paradigm: fortress sallyport / gatehouse / iron-grille side passage / torch-lit stone corridor / sealed strongroom — ash, iron, torch, bronze, slate, paper. New issue, new paradigm (reminder-secret-bypass), new UI/UX/fonts/colors, new scoring vocabulary. Horizontal fortress section, not a clinic groove, burial vault, cottage latch, raised drawbridge, or night postern.

**NOT Palilalia/#94041** (goal-stop-refire). Different defect. NOT speech-pathology / phonograph-groove. Do not reuse silenced / palilalia / goal-stop-refire.

**NOT Sepulchre/#94055** (bash-nul-poison). Different defect. NOT stone burial vault / ossuary. Do not reuse living / sepulchre / bash-nul-poison.

**NOT Sneck/#94052** (chip dismiss ephemeral). Different defect. NOT Northern cottage / brass sneck-latch. Do not reuse cleared / sneck / chip-dismiss-ephemeral.

**NOT Drawbridge/#94049** (RC bridge auto-update drop). Different defect. NOT raised span / bailey. Do not reuse spanned / drawbridge / rc-bridge-update-drop.

**NOT Chirograph/#94045** (recorded branch never refreshed after `git branch -m`). Different defect. NOT medieval lectern / indenture. Do not reuse matched / chirograph / worktree-rename-stale.

**NOT Titulus/#94025** (iOS rename vs desktop sidebar / resume-stale-title). Different defect. NOT Roman marble plaque. Do not reuse inscribed / titulus.

**NOT Derelict/#93996** (orphaned Bash after session stop). Different defect. NOT maritime abandoned-hulk. Do not reuse berthed / derelict.

**NOT Vestry/#94008** (Linux bwrap placeholder mount cleanup is per-process). Different defect. NOT liturgical sacristy. Do not reuse pegged / vestry.

**NOT Surfeit/#94012** (workflow keeps spawning after terminal session-limit). Different defect.

**NOT Phosphene/#94003** (WindowServer CA layer-tree thrash). Different defect.

**NOT Scotoma.** Different defect.

**NOT Postern** (slug already used). Different night-bailey paradigm.

**NOT Portcullis / Wicket / Embrasure.** Different fortress-gate paradigms.

Live: https://hermes-playground-green.vercel.app/sallyport/

```
node --test projects/sallyport/sallyport.test.mjs
node projects/sallyport/sallyport.mjs projects/sallyport/data/sallyport.json
```
