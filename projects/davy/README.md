# Davy

A **miner's safety lamp / lamp station** — Humphry Davy's gauze lamp for firedamp; pit-black stone, brass wire gauze, oil-flame amber, copper fittings, damp haze — for a real Claude Code defect: **a false boot-canary on a PID-keyed pending map in shared `~/.claude.json` banks strikes from a concurrent-session burst, then snuffs a working fullscreen renderer**.

Primary:

- [anthropics/claude-code#90886](https://github.com/anthropics/claude-code/issues/90886) (OPEN, filed 2026-08-31T03:26:28Z by evertjr). Title: Fullscreen renderer auto-disables itself on machines running many concurrent sessions (false boot-canary strikes). Labels: bug, has repro, platform:macos, area:tui. Claude Code **2.1.251** native install. macOS 15.x Darwin 25.6.0 arm64. Canary landed in **2.1.236**.

A false canary is not a hold. Score the gauze or admit **lit**.

Idle word: **lit**. Seeded state: **snuffed** / #90886 — working fullscreen auto-disabled by false boot-canary. Never idle as "davy" / "lamp" / "canary" / "flame" / "pit" / "gauze" / "strike" / "fullscreen" / "tui".

- **lit** = hold: tui=fullscreen, renderer actually fullscreen, strikes 0 or honestly earned, no orphaned pending, no auto-disable
- **snuffed** = #90886 primary — working fullscreen auto-disabled by false boot-canary
- **struck** = `fullscreenAutoDisabled.strikes` banked (issue: 4 vs sticky threshold 2)
- **orphaned** = leftover `fullscreenBootPending` entries for PIDs that are gone
- **reused** = `pid === ownPid` counted as a strike without `startedAt` vs process start
- **withdrawn** = signal-driven exit settles withdrawn, removes own PID, preserves strike counter
- **ratcheted** = on machines that terminate rather than quit, counter only goes up
- **burst** = 10–20 concurrent sessions launched together; lost read-modify-write
- **lost-update** = concurrent RMW against one `~/.claude.json`
- **classic** = fell back to classic renderer despite fullscreen working
- **pid-keyed** = pending map keyed by PID in the single shared `~/.claude.json`
- **env-on** = `CLAUDE_CODE_NO_FLICKER=1` / env_on path excluded from canary (workaround)

Verdicts: lit, snuffed, struck, orphaned, reused, withdrawn, ratcheted, burst, lost-update, classic, pid-keyed, env-on.

## Why not a clone

This is specifically: **FALSE BOOT-CANARY**. Shared PID-keyed pending map + lost updates + strike banking from one burst snuffs a working fullscreen renderer. The gauze lamp is the canary; the flame is the renderer.

NOT **Moviola** ([#90716](https://github.com/anthropics/claude-code/issues/90716)) — prefix-mutating image eviction.
NOT **Carcase** ([#90867](https://github.com/anthropics/claude-code/issues/90867)) — stealth-relaunch chrome.
NOT **Callboard** ([#90858](https://github.com/anthropics/claude-code/issues/90858)) — skill autocomplete.
NOT **Leaven** ([#90782](https://github.com/anthropics/claude-code/issues/90782)) — bootstrap contamination.
NOT **Hydra** ([#90856](https://github.com/anthropics/claude-code/issues/90856)) — marketplace dual-ledger.
NOT **Limpet** ([#89275](https://github.com/anthropics/claude-code/issues/89275)) — process leak after end_turn.
NOT **Scion** ([#90815](https://github.com/anthropics/claude-code/issues/90815)) — empty bridged fork.
NOT **Almanac** ([#90804](https://github.com/anthropics/claude-code/issues/90804)) — one-shot Loop ghost.
NOT **Deadband** ([#90789](https://github.com/anthropics/claude-code/issues/90789)) — settings.json 5s echo suppression.
NOT **Carrel** ([#90661](https://github.com/anthropics/claude-code/issues/90661)) — launch.json session cwd.
NOT **Binnacle** ([#90551](https://github.com/anthropics/claude-code/issues/90551)) — TUI origin split.
NOT **Fetch** ([#90755](https://github.com/anthropics/claude-code/issues/90755)) — tmux ghost text.
NOT **Kindling** ([#90798](https://github.com/anthropics/claude-code/issues/90798)) — WarmLifecycle preview mint.

Different UI: underground lamp station / Davy safety lamp. Pit-black, brass wire gauze, oil-flame amber, copper fittings, damp stone, firedamp haze. Cinzel Decorative + Spectral + IBM Plex Mono. NOT projector-black + red safelight + Special Elite. NOT oak cabinet. NOT bakery maple. NOT marble hydra. NOT stage-door. NOT tide-pool.

Different idle: **lit**.

## Live catalog path

`/davy/` is this static lamp station. Demo works with no secrets and no npm. Mark: `13:50 / hermes catalog #87 / #90886`.

1. Seeded demo loads **snuffed** (#90886 — working fullscreen auto-disabled by false canary). Flame snuffed, classic fallback, strikes at 4 / threshold 2, orphaned pending PIDs visible.
2. Admit lit → lamp burning, gauze honest, auto-disable off.
3. Chip-switch seeds: snuffed / lit / struck / orphaned / reused / withdrawn / ratcheted / burst / lost-update / classic / pid-keyed / env-on.
4. Paste or drop a ticket JSON and score the gauze.
5. Parse a `~/.claude.json` snippet (textarea / drop) for `fullscreenAutoDisabled` / `fullscreenBootPending` / strikes; replay a 15-session burst (PID map + lost-update) on a small canvas.

## How to score

Open `projects/davy/index.html` in a browser, or serve the repo root and visit `/davy/` (Vercel rewrite → `/projects/davy`). No build step. Optional hook:

```bash
node projects/davy/hook/davy.mjs < projects/davy/data/90886.json
node projects/davy/hook/davy.mjs projects/davy/data/lit.json
node --test projects/davy/hook/davy.test.mjs
```

Snuffed seed → snuffed/alarm. Lit seed → lit/hold.

`projects/davy/hook/davy.mjs` scores a probe ticket `{ concurrentSessions, strikes, strikeThreshold, autoDisabled, pendingOrphans, pidReuseStrike, withdrawnPreserve, lostUpdate, fullscreenWorks, tuiSetting, envNoFlicker, classicFallback, version }` and returns `{ verdict, chips[], reasons[], lit, snuffed, hold, alarm, idleWord }`. See `hook/README.md`.

Local fingerprints: `data/90886.json`, `data/snuffed.json`, `data/lit.json`, plus one JSON per other verdict, `data/fingerprints.json`, `data/chips.json`. Evidence only from issue facts.

## Native integrations

1. GitHub fetch of [anthropics/claude-code#90886](https://github.com/anthropics/claude-code/issues/90886). Unauthenticated. See `.env.example`.
2. JSON parse of `~/.claude.json` canary fields (`fullscreenAutoDisabled`, `fullscreenBootPending`, strikes).
3. Concurrent-session burst simulator (~15 PIDs, lost-update leftover map).
4. Strike vs threshold 2 gauge (`strikes` 4 / sticky 2).
5. env_on / `CLAUDE_CODE_NO_FLICKER=1` workaround path.

## Sources

- [anthropics/claude-code#90886](https://github.com/anthropics/claude-code/issues/90886) OPEN
- Same-class (cite, not primary): [#85583](https://github.com/anthropics/claude-code/issues/85583) stale /tui renderer report; Deadband [#90789](https://github.com/anthropics/claude-code/issues/90789) settings.json 5s echo; Carrel [#90661](https://github.com/anthropics/claude-code/issues/90661) launch.json last-writer-wins; [openai/codex#24224](https://github.com/openai/codex/issues/24224), [openai/codex#37226](https://github.com/openai/codex/issues/37226), [openai/codex#39642](https://github.com/openai/codex/issues/39642)
- Nearby TUI (boundary only): #88372 scrollbar, #84940 userMessageBackground, #76022 hyperlinks twice, #85573 assistant text dropped, #82886 mouse selection, #85712 mouse wheel no-op, #78693 SGR leak
