# Lagan

A **salvage / lagan-buoy desk** — cork buoy marker, wet line still made fast to a living hull, tide chalk counting orphan PIDs, night-harbor brine — Spectral + Inter + Fira Code — for a real Claude Code desktop defect: **CLOSING A SESSION WINDOW OR TAB LEAVES THE `claude` WRAPPER AND ENTITY CHILD PROCESSES RUNNING, BURNING CPU WHILE THE PARENT APP LIVES.**

Primary:

- [anthropics/claude-code#92266](https://github.com/anthropics/claude-code/issues/92266) (OPEN, bug, has repro, platform:macos, regression, perf:cpu, area:desktop, filed ~2026-09-05). Title: `[BUG] Claude Code desktop: closed sessions leave \`claude\` child processes running — possible regression of #58915/#61748`. Claude Code **desktop** on macOS (Darwin 25.2.0). Confirmed on desktop-bundled CLI **2.1.246** (npm latest cited 2.1.261). After closing a session window/tab, `claude` child processes remain. Each session starts **2** `claude` processes (wrapper + entity). Closing the window does **not** free them; they are not detected as orphans while the parent app lives. Each remnant burns ~**8–12% CPU** continuously. Reporter saw **38** leftover `claude` processes with only 2 live sessions → Mac thermal throttle (`kernel_task` ~189%) and typing lag.

14:50 lagan: a lagan that stays made fast after the session is cast is not a clean release — it is cargo already fouled. Score the lagan or admit the processes already fouled.

Idle word: **cast**. Seeded state: **fouled** / #92266 — window/tab close leaves wrapper+entity alive, burning CPU on a living parent. Never idle as flowing / snubbed / matched / warded / lit / blanked / afloat / careened / caught / slipping / locked / wiped / seated / channel / stranded / scratched / live / orphaned / set / scrapped / pure / scorched / cold / voided / banked / rewritten / keyed / strayed / scrubbed / pulled / enacted / withheld / masked / bled / careted / ringing.

**Lagan** is salvage goods cast overboard but still buoyed and made fast — still attached. The session is cast; the processes stay fouled to the living parent.

- **cast** = HOLD: session ended with `/exit` or Ctrl+D; children released
- **fouled** = #92266: close leaves wrapper+entity alive, burning CPU
- **pair-per-session** = each session starts 2 processes
- **thermal-throttle** = many orphans vs few live sessions → thermal / typing lag
- **cpu-8-12** = each remnant ~8–12% CPU
- **parent-alive** = orphans not reaped while Claude.app parent lives
- **exit-mitigation** = `/exit` or Ctrl+D; quitting app clears batch
- **regression-58915** = cite-only recurrence of closed #58915/#61748

Verdicts: cast, fouled, pair-per-session, thermal-throttle, cpu-8-12, parent-alive, exit-mitigation, regression-58915.

This is a diagnostic scoring desk. Not an exploit. No payloads. No real credentials. Score whether the lagan is cast or already fouled. Fixtures use diagnostic shapes only (live vs observed PIDs, close method, parent alive, CPU %, `kernel_task`). No process-kill scripts.

Hypothesis only (NON-BINDING): the interactive desk should make the still-attached remnant pair and the thermal pile visceral. Discard if evidence disagrees. Encoded from the issue’s facts. Do not claim unseen source.

## Why not a clone

This is specifically: **CLAUDE CODE DESKTOP ON MACOS LEAVES `claude` WRAPPER+ENTITY CHILDREN ALIVE AFTER A WINDOW/TAB CLOSE, UNDETECTED AS ORPHANS WHILE THE PARENT LIVES, BURNING 8–12% CPU EACH.**

NOT Snub ([#92262](https://github.com/anthropics/claude-code/issues/92262)) — Bash-tool heredoc pipe snub. Lagan is an orphan-process salvage, not a 512-byte pipe cliff.
NOT Ward ([#92252](https://github.com/anthropics/claude-code/issues/92252)) — Keychain default-path mis-ward. Lagan is not a credential slot.
NOT Deadlight ([#92249](https://github.com/anthropics/claude-code/issues/92249)) — ListAgents/SendMessage blank in unattended Desktop. Lagan is not a tool-registry shutter.
NOT Careen ([#92246](https://github.com/anthropics/claude-code/issues/92246)) — Windows MSIX mid-session restart. Lagan is not a mid-voyage haulout.
NOT Ratchet ([#92242](https://github.com/anthropics/claude-code/issues/92242)) — `/goal` stop-hook BLOCKED re-fire.
NOT Forme ([#92203](https://github.com/anthropics/claude-code/issues/92203)) — TUI scrollback wipe.
NOT Tabula ([#92210](https://github.com/anthropics/claude-code/issues/92210)) — deep-link scratch.
NOT Oxbow / Relict / Hellbox / Cupel / Oubliette / Ephemera / Commutator / Hectograph / Placet / Frisket / Tangent / Hawser / Caret / Buoy / Solecism / Coffer / Codicil UIs.

Oubliette is a child-completion void under a cold parent — Lagan is the opposite geometry: children stay fouled to a **living** parent after the session is cast.
Hawser is a process-reap bench for a fouled pile after idle — Lagan is salvage goods still made fast, not a hawser that never slips.
Buoy already exists as a harbor-layer sounding mark — Lagan is cargo still attached to a living hull, not a floating mark alone.

Different surface: desktop window-close leftover `claude` children vs Bash heredoc / Keychain / tool registry / MSIX / hooks / TUI. Completely different UI (salvage lagan-buoy desk — cork marker, wet line to a living hull, tide chalk, night-harbor brine — not Snub dockside snubbing post, not Ward locksmith iron/brass, not Deadlight night-cabin, not Careen careening yard, not Buoy orange waterline), backend (probe-shaped JSON of cast / fouled / pair / thermal / cpu / parent-alive / exit / regression rows), and UX (cork buoy still made fast + tide-chalk PID tally + thermal stack).

Cousins are cite-only on a cousin strip; primary stays #92266.

- [#58915](https://github.com/anthropics/claude-code/issues/58915) — closed; nearly identical (window/tab close left disclaimer helper + MCP children). Developer said fixed in a next release. Cite-only.
- [#61748](https://github.com/anthropics/claude-code/issues/61748) — same-class recurrence; left closed. Cite-only.
- [#45507](https://github.com/anthropics/claude-code/issues/45507) — same-class history. Cite-only.
- [#77459](https://github.com/anthropics/claude-code/issues/77459) — Windows same-class. Cite-only.

Backups (document only, do not build): [#92264](https://github.com/anthropics/claude-code/issues/92264) (Becalm — idle background session freezes while async subagents in flight), [#92228](https://github.com/anthropics/claude-code/issues/92228) (Freeboard — MemFree vs MemAvailable background kill), [#92244](https://github.com/anthropics/claude-code/issues/92244) (Reprise — teammate/idle_notification delivered up to 4×).

Product name stays **Lagan**. Do not rename to Snub, Ward, Deadlight, Careen, Ratchet, Forme, Tabula, Oxbow, Relict, Hellbox, Cupel, Oubliette, Ephemera, Commutator, Hectograph, Placet, Frisket, Tangent, Hawser, Caret, Buoy, Solecism, Coffer, Codicil or any existing catalog slug.

Different UI: cork buoy + wet line to a living hull + tide chalk + night-harbor brine. Spectral + Inter + Fira Code. NOT Literata / Outfit / JetBrains Mono (Snub). NOT Fraunces / DM Sans / IBM Plex Mono (Ward). NOT Libre Baskerville / Manrope (Deadlight). NOT Newsreader / Figtree (Careen). Stay OFF dockside snubbing post / locksmith iron/brass / night-cabin shutter / careening yard / orange waterline buoy.

Different verbs: Score the lagan, pin idle cast, pin seeded fouled, admit the processes already fouled, load fixtures, reset to cast. Score the lagan is this desk’s phrase.

Different idle: **cast**.

## Live catalog path

`/lagan/` is this static salvage / lagan-buoy desk. Path `https://hermes-playground-green.vercel.app/lagan/` and subdomain `https://lagan.hermes-playground-green.vercel.app` are both fine. Demo works with no secrets and no npm. Mark: `14:50 / hermes catalog #150 / #92266`. `?embed` or `?embed=1` hides chrome for the hub living featured well.

1. Seeded demo loads **fouled** — 2 live sessions; 38 `claude` processes; window/tab close; parent still alive; remnants not detected as orphans; ~8–12% CPU each; `kernel_task` ~189%; typing lag; the lagan is already fouled.
2. Idle **cast** → `/exit` or Ctrl+D released the pair; expected PIDs match live sessions; idle word cast.
3. Desk UI: living hull with lanterns still lit, wet warp still made fast to a cork lagan buoy, tide chalk counting orphan PIDs, thermal stack for `kernel_task`. Cast = line slipped. Fouled = cargo still lashed to the living parent.
4. Cousin cite strip labeled cousin-not-primary: [#58915](https://github.com/anthropics/claude-code/issues/58915), [#61748](https://github.com/anthropics/claude-code/issues/61748), [#45507](https://github.com/anthropics/claude-code/issues/45507), [#77459](https://github.com/anthropics/claude-code/issues/77459). Cite only. Primary stays #92266.
5. **Score the lagan** walks the probe ticket and lights chips on the desk. Chip-switch every verdict. Paste or drop JSON. Lagan simulator chips rewrite close method (`window/tab` / `/exit` / Ctrl+D / quit app), live session count, and remnant pile.

## How to score

Open `projects/lagan/index.html` in a browser, or serve the repo root and visit `/lagan/` (Vercel rewrite → `/projects/lagan`). No build step. Hook is a documentation stub only:

```bash
# No classifier binary. The living page scores probes in-browser.
# See projects/lagan/hook/README.md
```

Empty paste scores the idle **cast** ticket if you pin idle. Paste a probe on the page or drop a fixture from `data/`. The living page seeds **fouled**.
