# Waybill

A **freight waybill / cargo consignment ticket bench** — kraft stub, carbon-copy layers, vermillion rubber stamp, warehouse sodium desk, barcode session strips; Oswald + Source Sans 3 + IBM Plex Mono — for a real Claude Code defect: **NAMED AGENT SPAWN RESOLVES THE TEAM FILE UNDER A FOREIGN SESSION ID (0/21 MATCH).** When named spawn stamps THIS session's berth, the waybill is **addressed**.

Primary:

- [anthropics/claude-code#92624](https://github.com/anthropics/claude-code/issues/92624) (OPEN, bug, has repro, platform:windows, area:agents). Title: `[BUG] Named agent spawn resolves the team file under a foreign session id (0/21 match) - Windows, 2.1.247 onward`. Filed 2026-09-07T09:10:56Z. Updated 2026-09-07T09:12:01Z. Reporter: yongseek-choi. 0 comments.

00:50 waybill: a freight waybill bench that should stamp this session's berth on the named-agent team-file lookup but instead misroutes under a foreign session id — 0/21 match / regression 2.1.247+ / Windows (#92624). Score misrouted or admit addressed.

Idle word: **misrouted** (ALARM: named-agent team-file lookup stamps a foreign session id). Seeded state: **addressed** / HOLD (named spawn initializes/looks up the team file for THIS session). Never idle as adrift, corked, latent, silted, barred, runaway, haunted, fouled, razed, culled. Never seeded as reaped, relayed, flushed, drained, admitted, latched, staged, proved, belayed, sole.

**Waybill** = a freight waybill / cargo consignment ticket. Named agent spawn should stamp THIS session's berth on the team-file lookup so the mailbox lands in the right hold. Instead the waybill **misrouted** under a foreign session id (0/21 match). Without `name:` the parcel goes through; with `name:` the stamp is wrong and the team file is "not found".

- **misrouted** = IDLE: ALARM; stamp on a foreign berth
- **addressed** = seeded word: named spawn stamps THIS session id
- **foreign-session-id** = error names session-7470f9d6; live transcript is 1b331b27
- **zero-of-twenty-one** = 0/21 match; 21/21 mismatches
- **regression-2-1-247** = ≤2.1.241 clean; ≥2.1.247 broken; live 2.1.263
- **team-dir-never-created** = failing id never gets a team dir (2 of 6)
- **not-permissions** = `~/.claude/teams/` writable; error is not found
- **not-only-concurrency** = 52% with 1 session; 77% with 2
- **name-param-path** = only the `name:` mailbox path is broken
- **unnamed-spawn-ok** = spawn without `name:` works 73/73
- **mailbox-addressing-lost** = `SendMessage({to:name})` unavailable
- **second-string-cite-only** = #82627 unreadable string is cite-only
- **cousins** = cite-only #82627 / #82493 / #83366 / #81852 / #85949
- **has-clear-repro** = issue labeled has repro

Verdicts: misrouted, addressed, foreign-session-id, zero-of-twenty-one, regression-2-1-247, team-dir-never-created, not-permissions, not-only-concurrency, name-param-path, unnamed-spawn-ok, mailbox-addressing-lost, second-string-cite-only, cousins, has-clear-repro.

This is a diagnostic scoring assay. Not an exploit. No live Claude sessions. No payloads. No secrets. Score whether a named-spawn foreign-id lookup would leave the waybill **misrouted** or already **addressed**. Fixtures use the issue's published incident only.

Hypothesis only (NON-BINDING): named-spawn team-file key may be resolving against a stale/foreign session id rather than the current transcript sessionId (wrong lookup key); initializing/looking up under the current session would address the waybill. Verify against issue text only; do not claim unread source.

## Research brief

Sources:

- Primary: [anthropics/claude-code#92624](https://github.com/anthropics/claude-code/issues/92624)
- Cousins cite-only (NOT primary):
  - [anthropics/claude-code#82627](https://github.com/anthropics/claude-code/issues/82627) — macOS com.apple.provenance team config unreadable (DIFFERENT error string + platform)
  - [anthropics/claude-code#82493](https://github.com/anthropics/claude-code/issues/82493) — Named Agent tool spawns accepted but never executed
  - [anthropics/claude-code#83366](https://github.com/anthropics/claude-code/issues/83366) — Named/teammate spawns silently never start when tmux pane creation fails (Windows)
  - [anthropics/claude-code#81852](https://github.com/anthropics/claude-code/issues/81852) — tools: allowlist dropped for named agents/teammates
  - [anthropics/claude-code#85949](https://github.com/anthropics/claude-code/issues/85949) — teammate inbox orphan / SendMessage to team-lead false-succeeds

Backups do not auto-pick: #92662 (Chrome relaunch bridge), #92675 (plugin PreToolUse hooks), #92678 (TUI scroll while streaming).

What happened (from the issue body — do not invent):

- OS: Windows 11 Enterprise 26200; git-bash; Claude Code 2.1.263 live; regression first at 2.1.247
- Spawn with `name:` fails: `Internal error: team file for "session-<id>" not found. The session team should have been initialized at startup.`
- The `<id>` is NEVER the current session id — 21/21 mismatches (0/21 match)
- Live example: current session 1b331b27-...; error names session-7470f9d6 (unrelated ended ~4h earlier)
- Same spawn without `name:` succeeds (73/73); bg notifications 244/245
- Version table: ≤2.1.241 = 14 OK / 0 ERR; ≥2.1.247 = 9 OK / 39 ERR; gap 2.1.242–246 unobserved
- Failing session's team directory never created before or after failed spawn; only successful named-spawn sessions have dirs (2 of 6 error-named ids)
- Not permissions: `~/.claude/teams/` owned by user; read/create/delete OK; error is not found, foreign id
- Not only concurrency: 52% fail with 1 live session; worse with 2 (77%)
- Second error string on machine (18×): `Team config file unreadable (lock acquired, read failed)` — that is #82627 (macOS provenance); this product covers ONLY the foreign-id "not found" message (21×)
- Impact: named addressing / `SendMessage({to:name})` unavailable

Problem found: NAMED SPAWN LOOKS UP THE TEAM FILE UNDER A FOREIGN SESSION ID — 0/21 match / regression 2.1.247+.

Why this solution: a diagnostic scorer for the misrouted → addressed waybill chain, so a reader can admit idle misrouted, pin seeded addressed, and score foreign-session-id / zero-of-twenty-one / regression-2-1-247 / team-dir-never-created / not-permissions / not-only-concurrency / name-param-path / unnamed-spawn-ok / mailbox-addressing-lost / second-string-cite-only / cousins against the published facts.

## Why not a clone

This is specifically: **NAMED AGENT SPAWN RESOLVES THE TEAM FILE UNDER A FOREIGN SESSION ID (0/21 MATCH).**

**NOT Snatch #92583** (session-end never reaps auto-backgrounded Bash orphans).

**NOT Speakpipe #92646** (Desktop overbroad SendMessage ban).

**NOT Afterimage #92596** (Windows text paint deferred until message_stop).

**NOT Limber #92590** (unexpanded `$TMPDIR` write-allowlist).

**NOT Chock #92582** (`blockReadsOutsideWorkingDirectories` ignores additionalDirectories).

**NOT Deadman #92593** (timeout promote + TaskStop leftover).

**NOT Eidolon #92601** (security-guidance ENOENT loop).

**NOT Touchstone #92599 / Bitts / Oubliette #92095 / Sounder / Callboard / Knock / Annunciator paradigms.**

Cousins cite-only (NOT primary): #82627, #82493, #83366, #81852, #85949. Different surfaces. Backups do not auto-pick: #92662, #92675, #92678.

Do NOT rename this product Snatch, Speakpipe, Afterimage, Limber, Chock, Deadman, Eidolon, Touchstone, Bitts, Oubliette, Sounder, Callboard, Knock, or Annunciator.
Do NOT reuse idle adrift / corked / latent / silted / barred / runaway / haunted / fouled / razed / culled.
Do NOT reuse seeded reaped / relayed / flushed / drained / admitted / latched / staged / proved / belayed / sole.

Different surface: NAMED SPAWN FOREIGN SESSION ID vs session-end unreaped Bash orphans / Desktop overbroad SendMessage ban / Windows text paint deferral / unexpanded `$TMPDIR` / settings-layer read-fence miss / mid-incident timeout leftover / ENOENT fake notice.

Product name stays **Waybill**. Name/slug `waybill` confirmed unused in catalog.json (206 products).

Different UI: freight waybill / consignment ticket / perforated stub / rubber stamp / carbon layers / barcode session strips / warehouse sodium + kraft + vermillion. Oswald / Source Sans 3 / IBM Plex Mono. NOT Newsreader/Figtree/Fragment Mono. NOT Petrona/Lexend/Azeret. NOT Instrument Serif/Plus Jakarta.

Different verbs: Score the waybill, Pin idle misrouted, Pin seeded addressed, Admit addressed, Load fixtures, Reset to addressed, Stamp the berth, Route the parcel.

Different idle: **misrouted**. Different seeded: **addressed**. HOLD: **addressed**. ALARM: **misrouted** / **foreign-session-id** / **zero-of-twenty-one** / **regression-2-1-247** / **team-dir-never-created** / **not-permissions** / **not-only-concurrency** / **name-param-path** / **unnamed-spawn-ok** / **mailbox-addressing-lost** / **second-string-cite-only** / **cousins** / **has-clear-repro**.

## How to score

```bash
node --test projects/waybill/hook/waybill.test.mjs
node projects/waybill/hook/index.mjs projects/waybill/data/92624.json
echo '{"seed":"addressed","addressed":true}' | node projects/waybill/hook/index.mjs
```

Open the living card at `projects/waybill/index.html` (or the live path). Buttons: Score the waybill, Pin idle misrouted, Pin seeded addressed, Admit addressed, Load fixtures, Reset to addressed. Stamp the berth. Route the parcel. Drop a fixture JSON or paste it. `?embed=1` hides chrome.

## Live path

- Path gate: https://hermes-playground-green.vercel.app/waybill/
- Subdomain: https://waybill.hermes-playground-green.vercel.app
- Folder: `projects/waybill/`
