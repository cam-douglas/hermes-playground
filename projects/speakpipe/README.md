# Speakpipe

A **brass speaking-tube / shipboard voicepipe bench** — below-decks hail board, corked mouthpiece, deck-to-crew pipe geometry; Petrona + Lexend + Azeret Mono — for a real Claude Code defect: **CLAUDE DESKTOP BLOCKS SENDMESSAGE ENTIRELY, WHICH ALSO REMOVES SUBAGENT CONTINUATION.** When a continuation hail can pass the speakpipe to a below-decks crew with its context intact, the pipe is **relayed**.

Primary:

- [anthropics/claude-code#92646](https://github.com/anthropics/claude-code/issues/92646) (OPEN, bug, has repro, platform:windows, area:agents, area:desktop). Title: `Claude Desktop blocks SendMessage entirely, which also removes subagent continuation`. Filed 2026-09-07T11:03:56Z. Updated 2026-09-07T11:05:00Z. Reporter: Had01. 0 comments.

21:50 speakpipe: a brass speakpipe bench that should carry a continuation hail to a below-decks subagent but Desktop corks the whole tube because deck-to-ship SendMessage is banned — Agent/ListAgents/footers still advertise a tool ToolSearch cannot find (#92646). Score corked or admit relayed.

Idle word: **corked** (ALARM: pipe corked; subagent continuation unreachable). Seeded state: **relayed** / HOLD (continuation hail can pass the speakpipe). Never idle as latent, silted, barred, runaway, haunted, fouled, razed, culled. Never seeded as flushed, drained, admitted, latched, staged, proved, belayed, sole.

**Speakpipe** = shipboard speaking tube / brass voicepipe between decks. The pipe should carry a continuation hail to a below-decks crew (subagent) without going on deck to another ship (cross-session). Desktop corks the whole pipe because deck-to-ship hails are banned, so below-decks continuation is corked too.

- **corked** = IDLE: ALARM; pipe corked; subagent continuation unreachable
- **relayed** = seeded word: continuation hail can pass the speakpipe
- **dual-purpose-tool** = SendMessage does cross-session AND continuation
- **overbroad-disallow** = `--disallowedTools SendMessage` on the whole tool
- **pretooluse-auto-deny** = `desktop_ccd_permission_auto_denied` / `cli_native_send_message`
- **mcp-replacement-gap** = `mcp__ccd_session_mgmt__send_message` does not cover continuation
- **footer-still-advertises** = `use SendMessage with to:` still printed
- **toolsearch-empty** = `No matching deferred tools found`
- **listagents-dead-instruction** = ListAgents lists 29 peers; tool missing
- **cli-flag-honoured** = CLI honours the flag; version is not the variable
- **desktop-app-ban** = Desktop 1.46388.4 applies the ban
- **timeline-zero-after-1.46388.4** = zero calls from 2026-09-06
- **cousins** = cite-only #89543 / #92583 / #92624
- **has-clear-repro** = issue labeled has repro

Verdicts: corked, relayed, dual-purpose-tool, overbroad-disallow, pretooluse-auto-deny, mcp-replacement-gap, footer-still-advertises, toolsearch-empty, listagents-dead-instruction, cli-flag-honoured, desktop-app-ban, timeline-zero-after-1.46388.4, cousins, has-clear-repro.

This is a diagnostic scoring assay. Not an exploit. No live Claude sessions. No payloads. No secrets. Score whether an overbroad Desktop SendMessage ban would leave the speakpipe **corked** or already **relayed**. Fixtures use the issue's published incident only.

Hypothesis only (NON-BINDING): Desktop may be banning the entire SendMessage tool for cross-session reasons while Agent/ListAgents still teach continuation via that same tool; a narrower deny or surface-aware copy would uncork the speakpipe. Verify against issue text only; do not claim unread source.

## Research brief

Sources:

- Primary: [anthropics/claude-code#92646](https://github.com/anthropics/claude-code/issues/92646)
- Cousins cite-only (NOT primary):
  - [anthropics/claude-code#89543](https://github.com/anthropics/claude-code/issues/89543) — SendMessage to a running background subagent never delivers (different surface)
  - [anthropics/claude-code#92583](https://github.com/anthropics/claude-code/issues/92583) — timeout orphans (backup; different surface)
  - [anthropics/claude-code#92624](https://github.com/anthropics/claude-code/issues/92624) — foreign session team file (backup; different surface)

What happened (from the issue body — do not invent):

- Claude Desktop 1.46388.4 (Windows MSIX, `Claude_1.46388.4.0_x64__pzs8sxrjxfjjc`), installed 2026-09-05 20:11
- Bundled Claude Code 2.1.260; CLI on PATH 2.1.263; Windows 11 Pro 26200; claude.ai, no managed settings
- Desktop spawns the bundled CLI with `--disallowedTools SendMessage`
- A second layer in `app/resources/app.asar` emits `desktop_ccd_permission_auto_denied` with `reason: "cli_native_send_message"`
- The deny message frames this as cross-session reachability and points to `mcp__ccd_session_mgmt__send_message`
- `SendMessage` also continues a previously spawned subagent with its context intact — the MCP replacement does not cover that job
- Agent description, ListAgents (`SendMessage({to: ...})`), and every subagent result footer still advertise continuation
- `ToolSearch` `select:SendMessage` returns `No matching deferred tools found`
- ListAgents stays available and lists 29 reachable peers
- CLI with the flag: no SendMessage (2.1.258 and 2.1.260). CLI without the flag: SendMessage present (2.1.260 and 2.1.263). Desktop is applying the overbroad ban
- Timeline of real SendMessage calls: 2.1.258 had 84 calls / 4 sessions; 2.1.260 had 0 / 7; 2.1.263 had 0 / 2. Last real call 2026-09-03. Sessions from 2026-09-06 onward have zero while footers keep advertising

Problem found: DESKTOP OVERBROAD SENDMESSAGE BAN — the whole tool is corked for a cross-session reason, so below-decks continuation is corked too.

Why this solution: a diagnostic scorer for the corked → relayed speakpipe chain, so a reader can admit idle corked, pin seeded relayed, and score dual-purpose-tool / overbroad-disallow / pretooluse-auto-deny / mcp-replacement-gap / footer-still-advertises / toolsearch-empty / listagents-dead-instruction / cli-flag-honoured / desktop-app-ban / timeline-zero-after-1.46388.4 / cousins against the published facts.

## Why not a clone

This is specifically: **CLAUDE DESKTOP BLOCKS SENDMESSAGE ENTIRELY, WHICH ALSO REMOVES SUBAGENT CONTINUATION.**

**NOT Afterimage #92596** (Windows text paint deferred until message_stop).

**NOT Limber #92590** (unexpanded `$TMPDIR` write-allowlist token).

**NOT Chock #92582** (`blockReadsOutsideWorkingDirectories` ignores project/local additionalDirectories).

**NOT Deadman #92593** (timeout background + TaskStop shell-only + MSYS wipe).

**NOT Eidolon #92601** (security-guidance ENOENT staging loop).

**NOT Oubliette #92095** (Cowork Dispatch child-completion void against cold parent).

**NOT Sounder / Callboard / Knock / Annunciator paradigms.**

Cousins cite-only (NOT primary): #89543, #92583, #92624. Different surfaces.

Do NOT rename this product Afterimage, Limber, Chock, Deadman, Eidolon, Oubliette, Sounder, Callboard, Knock, or Annunciator.
Do NOT reuse idle latent / silted / barred / runaway / haunted / fouled / razed / culled.
Do NOT reuse seeded flushed / drained / admitted / latched / staged / proved / belayed / sole.

Different surface: DESKTOP OVERBROAD SENDMESSAGE BAN (continuation corked with the cross-session tool) vs Windows text paint deferral / unexpanded `$TMPDIR` / settings-layer read-fence miss / timeout promote / ENOENT fake notice / Dispatch child-completion void.

Product name stays **Speakpipe**. Name/slug `speakpipe` confirmed unused in catalog.json (204 products).

Different UI: brass speaking-tube / shipboard voicepipe / below-decks hail board / corked mouthpiece / deck-to-crew pipe geometry. Petrona / Lexend / Azeret Mono. Dark warm metal, aged brass, copper. NOT Instrument Serif / Plus Jakarta / IBM Plex Mono (Afterimage). NOT Fraunces/Source Sans 3/JetBrains Mono (Limber). NOT Bitter/Manrope (Chock). NOT Chakra Petch/Share Tech Mono (Deadman). NOT Playfair/Work Sans/Fira Code (Eidolon). NOT CRT phosphor. NOT bilge. NOT wheel-chock timber. NOT locomotive deadman.

Different verbs: Score the speakpipe, Pin idle corked, Pin seeded relayed, Admit relayed, Load fixtures, Reset to relayed, Uncork the pipe, Hail below-decks.

Different idle: **corked**. Different seeded: **relayed**. HOLD: **relayed**. ALARM: **corked** / **dual-purpose-tool** / **overbroad-disallow** / **pretooluse-auto-deny** / **mcp-replacement-gap** / **footer-still-advertises** / **toolsearch-empty** / **listagents-dead-instruction** / **cli-flag-honoured** / **desktop-app-ban** / **timeline-zero-after-1.46388.4** / **cousins** / **has-clear-repro**.

## How to score

```bash
node --test projects/speakpipe/hook/speakpipe.test.mjs
node projects/speakpipe/hook/index.mjs projects/speakpipe/data/92646.json
echo '{"seed":"relayed","relayed":true}' | node projects/speakpipe/hook/index.mjs
```

Open the living card at `projects/speakpipe/index.html` (or the live path). Buttons: Score the speakpipe, Pin idle corked, Pin seeded relayed, Admit relayed, Load fixtures, Reset to relayed. Uncork the pipe. Hail below-decks. Drop a fixture JSON or paste it. `?embed=1` hides chrome.

## Live path

- Path gate: https://hermes-playground-green.vercel.app/speakpipe/
- Subdomain: https://speakpipe.hermes-playground-green.vercel.app
- Folder: `projects/speakpipe/`
