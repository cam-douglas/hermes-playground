# Gangway

A **pier gangway / boarding brow / ship-to-shore steel ramp bench** — wet dock night, sodium vapor, rope handrails, grated steel, harbor chrome amber accents; Big Shoulders Display + Public Sans + Roboto Mono — for a real Claude Code defect: **AFTER CHROME RELAUNCH, SESSION BRIDGE CLIENT NEVER RE-DIALS HEALTHY NATIVE-HOST SOCKET + RESTORED TAB GROUP CANNOT BE RE-ADOPTED.** When the session client re-dials and the restored MCP tab group is re-adopted, the gangway is **remoored**.

Primary:

- [anthropics/claude-code#92662](https://github.com/anthropics/claude-code/issues/92662) (OPEN, bug, has repro, platform:macos, area:browser-extension, area:chrome). Title: `Claude in Chrome: after Chrome relaunches (update), session client never re-dials the new bridge socket and the restored tab group cannot be re-adopted`. Filed 2026-09-07T12:52:49Z. Updated 2026-09-07T12:53:59Z. Reporter: PromotezCitizen. 0 comments.

01:50 gangway: a pier gangway / boarding brow bench that should remoor the Claude-in-Chrome bridge after Chrome relaunches but instead stays severed — session client never re-dials the new native-host socket while the host is healthy; restored MCP tab group cannot be re-adopted (#92662). Score severed or admit remoored.

Idle word: **severed** (ALARM: session client never re-dials the new native-host socket while the host is healthy; restored MCP tab group cannot be re-adopted). Seeded state: **remoored** / HOLD (session client re-dials; restored group re-adopted). Never idle as misrouted, adrift, corked, latent, silted, barred, runaway, haunted, fouled, razed, culled. Never seeded as addressed, reaped, relayed, flushed, drained, admitted, latched, staged, proved, belayed, sole.

**Gangway** = a pier boarding brow / ship-to-shore steel ramp. After Chrome relaunches, the brow should remoor the long-running Claude Code session to the new native-host socket and re-adopt the restored Claude tab group. Instead the brow stays **severed**: the in-process client never re-dials a healthy host, reconnect UI is a noop, and the restored MCP group is an orphan.

- **severed** = IDLE: ALARM; brow stays up
- **remoored** = seeded word: client re-dials; group re-adopted
- **never-redial** = 100 attempts; subsequent calls do not re-dial
- **healthy-socket-ignored** = host answers `execute_tool` on the socket
- **reconnect-noop** = Reconnect extension / Select browser do not recover
- **tab-group-orphan** = restored Claude group `isMcp: true`; rejected
- **session-mapping-lost** = memory-only map lost on Chrome restart
- **createIfEmpty-new-tab-only** = only recovery opens a NEW tab
- **chrome-relaunch-not-sleep** = trigger is Chrome relaunch, not sleep/wake
- **cousins** = cite-only #88558 / #86793 / #61117 / #73903 / #87774 / #89335
- **has-clear-repro** = issue labeled has repro

Verdicts: severed, remoored, never-redial, healthy-socket-ignored, reconnect-noop, tab-group-orphan, session-mapping-lost, createIfEmpty-new-tab-only, chrome-relaunch-not-sleep, cousins, has-clear-repro.

This is a diagnostic scoring assay. Not an exploit. No live Claude sessions. No payloads. No secrets. Score whether a Chrome-relaunch never-redial + restored-group orphan would leave the gangway **severed** or already **remoored**. Fixtures use the issue's published incident only.

Hypothesis only (NON-BINDING): in-process bridge client may cache a dead socket and skip directory re-scan on later tool calls; reconnect UI may reset extension side only; session→tab-group map may be memory-only. Invite verify; do not claim source lines.

## Research brief

Sources:

- Primary: [anthropics/claude-code#92662](https://github.com/anthropics/claude-code/issues/92662)
- Cousins cite-only (NOT primary):
  - [anthropics/claude-code#88558](https://github.com/anthropics/claude-code/issues/88558) — stuck not connected (trigger unknown there)
  - [anthropics/claude-code#86793](https://github.com/anthropics/claude-code/issues/86793) — stuck not connected (trigger unknown there)
  - [anthropics/claude-code#61117](https://github.com/anthropics/claude-code/issues/61117) — closed; CLI never dials healthy socket
  - [anthropics/claude-code#73903](https://github.com/anthropics/claude-code/issues/73903) — closed; CLI never dials healthy socket
  - [anthropics/claude-code#87774](https://github.com/anthropics/claude-code/issues/87774) — session→tab-group mapping lost / orphan tabs
  - [anthropics/claude-code#89335](https://github.com/anthropics/claude-code/issues/89335) — session→tab-group mapping lost / orphan tabs

What happened (from the issue body — do not invent):

- Claude Code 2.1.260 native macOS (Darwin 25.4.0, Apple Silicon)
- Chrome 152.0.7977.83 (updated from .76); extension 1.0.91
- Native host `claude --chrome-native-host`; socket `/tmp/claude-mcp-browser-bridge-<user>/<pid>.sock`
- After Chrome relaunches (update/manual/crash), the long-running CLI session's in-process bridge client NEVER re-dials the new native-host unix socket
- Every `mcp__claude-in-chrome__*` tool returns "Browser extension is not connected" for the rest of the session
- The native host is healthy and answers the SAME `execute_tool` when sent to its socket directly
- `/chrome` > Reconnect extension and Select browser do NOT recover it
- Client gives up after 100 attempts with "Will retry on next tool call" but subsequent calls do not re-dial
- Chrome restores the "Claude" tab group; extension Local Extension Settings still record it with `isMcp: true`
- Every tool call on that tab is rejected ("not in Claude's tab group for this session")
- Session→group mapping lives only in memory and is lost on Chrome restart
- Only recovery (`createIfEmpty` / `tabs_create_mcp`) opens a NEW tab and abandons the page under test
- Trigger is Chrome relaunch, not sleep/wake

Problem found: AFTER CHROME RELAUNCH, SESSION BRIDGE CLIENT NEVER RE-DIALS HEALTHY NATIVE-HOST SOCKET + RESTORED TAB GROUP CANNOT BE RE-ADOPTED.

Why this solution: a diagnostic scorer for the severed → remoored gangway chain, so a reader can admit idle severed, pin seeded remoored, and score never-redial / healthy-socket-ignored / reconnect-noop / tab-group-orphan / session-mapping-lost / createIfEmpty-new-tab-only / chrome-relaunch-not-sleep / cousins against the published facts.

## Why not a clone

This is specifically: **AFTER CHROME RELAUNCH, SESSION BRIDGE CLIENT NEVER RE-DIALS HEALTHY NATIVE-HOST SOCKET + RESTORED TAB GROUP CANNOT BE RE-ADOPTED.**

**NOT Waybill #92624** (named-spawn foreign session id).

**NOT Snatch #92583** (session-end never reaps auto-backgrounded Bash orphans).

**NOT Speakpipe #92646** (Desktop overbroad SendMessage ban).

**NOT Afterimage #92596** (Windows text paint deferred until message_stop).

**NOT Limber #92590** (unexpanded `$TMPDIR` write-allowlist).

**NOT Chock #92582** (`blockReadsOutsideWorkingDirectories` ignores additionalDirectories).

**NOT Deadman #92593** (timeout leftover).

**NOT Eidolon #92601** (security-guidance ENOENT loop).

**NOT Oubliette #92095** (Dispatch void).

Cousins cite-only (NOT primary): #88558, #86793, #61117, #73903, #87774, #89335. Different surfaces.

Do NOT rename this product Waybill, Snatch, Speakpipe, Afterimage, Limber, Chock, Deadman, Eidolon, or Oubliette.
Do NOT reuse idle misrouted / adrift / corked / latent / silted / barred / runaway / haunted / fouled / razed / culled.
Do NOT reuse seeded addressed / reaped / relayed / flushed / drained / admitted / latched / staged / proved / belayed / sole.

Different surface: CHROME-RELAUNCH NEVER-REDIAL + RESTORED-GROUP ORPHAN vs named-spawn foreign session id / session-end unreaped Bash orphans / Desktop overbroad SendMessage ban / Windows text paint deferral / unexpanded `$TMPDIR` / settings-layer read-fence miss / mid-incident timeout leftover / ENOENT fake notice.

Product name stays **Gangway**. Name/slug `gangway` confirmed unused in catalog.json (207 products).

Different UI: pier gangway / boarding brow / ship-to-shore steel ramp / wet dock night / sodium vapor / rope handrails / grated steel / harbor chrome amber. Big Shoulders Display / Public Sans / Roboto Mono. NOT Oswald/Source Sans 3/IBM Plex Mono. NOT Newsreader/Figtree/Fragment Mono. NOT Petrona/Lexend/Azeret. NOT Instrument Serif/Plus Jakarta.

Different verbs: Score the gangway, Pin idle severed, Pin seeded remoored, Admit remoored, Load fixtures, Reset to remoored, Lower the brow, Cast the brow.

Different idle: **severed**. Different seeded: **remoored**. HOLD: **remoored**. ALARM: **severed** / **never-redial** / **healthy-socket-ignored** / **reconnect-noop** / **tab-group-orphan** / **session-mapping-lost** / **createIfEmpty-new-tab-only** / **chrome-relaunch-not-sleep** / **cousins** / **has-clear-repro**.

## How to score

```bash
node --test projects/gangway/hook/gangway.test.mjs
node projects/gangway/hook/index.mjs projects/gangway/data/92662.json
echo '{"seed":"remoored","remoored":true}' | node projects/gangway/hook/index.mjs
```

Open the living card at `projects/gangway/index.html` (or the live path). Buttons: Score the gangway, Pin idle severed, Pin seeded remoored, Admit remoored, Load fixtures, Reset to remoored. Lower the brow. Cast the brow. Drop a fixture JSON or paste it. `?embed=1` hides chrome.

## Live path

- Path gate: https://hermes-playground-green.vercel.app/gangway/
- Subdomain: https://gangway.hermes-playground-green.vercel.app
- Folder: `projects/gangway/`
