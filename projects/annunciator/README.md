# Annunciator

An **industrial annunciator / false-alarm panel** atelier — riveted steel fascia, ISA-style window boxes, lamp board for main-turn vs helper forks vs subagent 429 cascade, parent `session_id` stamp, low-priority idle drip, cascade counter 14/~1min; steel / amber / dark — Chakra Petch + Barlow + Share Tech Mono — for a real Claude Code defect: **StopFailure falsely fires for internal helper forks and background subagent 429s on the parent session_id; under /low-priority an idle prompt rains spurious failures; 14 hooks/~1min; 2.1.258 Windows.**

Primary:

- [anthropics/claude-code#91419](https://github.com/anthropics/claude-code/issues/91419) (OPEN, bug, has repro, platform:windows, area:hooks, area:agents, filed 2026-09-02T07:17:32Z, updated 2026-09-02T07:18:29Z, 0 comments). Title: StopFailure fires for internal helper queries and subagent failures on the parent session. Reporter KamilDev.

an annunciator that lights for a helper is not a trip. Dark the board or admit the turn never ran.

Idle word: **dark**. Seeded state: **spurious** / #91419 — `StopFailure` for helper forks and background subagent 429s on the parent session_id; `/low-priority` idle drip; fourteen hooks in about a minute. Never idle as sealed / rebound / fenced / swept / tolled / mute / honored / discarded / arrested / skipped / indexed / jumped / chocked / rolled / clasped / sprung / drained / hinged / pealed / warded / pooled / cased / aired / sifted / stocked / stationed / marvered / unpinned / rinsed / literal / choked / opened / stalled / fused / forged / attributed.

An **annunciator** is the lamp board that should stay **dark** until the **main turn** dies on an API error. Instead it lights for every internal helper fork (`prompt_suggestion`, `away_summary`, `extract_memories`, `agent_summary`, `skipTranscript: true`) and every background subagent 429, always stamped with the **parent session_id**. Under `/low-priority` those helpers are excluded from retry, so an idle prompt rains `StopFailure` events for turns that never happened.

- **spurious** = #91419: `StopFailure` lights for helper forks and background subagent 429s on the parent session_id; 9/7/14 in about a minute
- **helper-fork-stopfailure** = `prompt_suggestion`, `away_summary`, `extract_memories`, `agent_summary` (`skipTranscript: true`) fire `StopFailure` on the parent session_id
- **subagent-429-parent** = background subagent 429 deaths stamp the parent session_id
- **low-priority-idle-drip** = after `/low-priority` parked, no user input; further `StopFailure` ~20–30s apart (`error: rate_limit`); no transcript line
- **fourteen-hooks-cascade** = nine background agents; seven died on 429; fourteen `StopFailure` hooks in about a minute for one underlying limit; 2N cascade
- **missing-query-source** = payload is `error`, `error_details`, `last_assistant_message` — no `querySource` / `agent_id`
- **skip-transcript-fork** = helper forks (`skipTranscript: true`) still emit `StopFailure`
- **rate-limit-null-retry** = low-priority retry allow-list excludes helpers → 429 returns null → spurious `StopFailure`
- **delegated-observation-skip** = only delegated-observation is skipped; helper forks still fire
- **has-clear-repro** = KamilDev filed #91419; has repro; 9/7/14; Claude Code 2.1.258; Windows 11; Interactive REPL; bypassPermissions; `/low-priority`
- **hold** = board stays dark until the real main turn ends on an API error; helper forks do not light; the annunciator is dark
- **dark** = HOLD: board stays dark until the real main turn ends on an API error

Verdicts: dark, spurious, helper-fork-stopfailure, subagent-429-parent, low-priority-idle-drip, fourteen-hooks-cascade, missing-query-source, skip-transcript-fork, rate-limit-null-retry, delegated-observation-skip, has-clear-repro, hold.

This is a diagnostic scoring bench. Not an exploit. No payloads. Score whether the board is dark or spurious.

Hypothesis only (NON-BINDING): the shared query generator may treat every API-error exit as a main-turn death because the payload never carries query_source, and /low-priority may return null for helpers instead of waiting. Do not claim a root cause in Claude Code source you have not seen.

## Why not a clone

This is specifically: **STOPFAILURE FALSELY FIRES FOR INTERNAL HELPER FORKS AND BACKGROUND SUBAGENT 429s ON THE PARENT SESSION_ID; UNDER /LOW-PRIORITY IDLE PROMPT RAINS SPURIOUS FAILURES; 14 HOOKS/~1min; 2.1.258 WINDOWS.**

NOT **Caisson** ([#91405](https://github.com/anthropics/claude-code/issues/91405)) — Desktop worktree pool reseats the wrong hull — cite as stay-off.
NOT **Spindle** ([#91402](https://github.com/anthropics/claude-code/issues/91402)) — startup cleanup deletes live sibling Bash task outputs under shared temp — cite as stay-off.
NOT **Knell** ([#91298](https://github.com/anthropics/claude-code/issues/91298)) — opposite polarity: Agent-tool custom child silent death after Spawned successfully.
NOT **Tumbler** ([#74256](https://github.com/anthropics/claude-code/issues/74256)) — PermissionRequest ExitPlanMode allow discarded.
NOT **Escapement** / **Geneva** / **Scotch** / **Carillon** / **Pintle** / **Fibula**.
NOT **Spigot** / **Clevis** / **Effigy**.
NOT **Sapper** ([#89251](https://github.com/anthropics/claude-code/issues/89251)) — PreToolUse Bash write steer — deferred backup class.
NOT **#87972** alone (cousin: stall path moved to StopFailure whose decision output is ignored).
NOT leftover woodworking / mm-slider / millrace / locksmith / campanology / berth clones.
NOT **Berth** catalog entries (different product — do not clone their UI).
NOT **Bollard** catalog entries (different product — do not clone their UI).

Cousins are cite-only on a cousin strip; primary stays #91419.

- [#87972](https://github.com/anthropics/claude-code/issues/87972) — Stop hook no longer fires on stream-stall-terminated turns; StopFailure fires instead but its decision output is ignored.
- [#91414](https://github.com/anthropics/claude-code/issues/91414) — MCP HTTP first turn blocks for MCP_TIMEOUT-5000ms awaiting subscriptions/listen.
- [#91408](https://github.com/anthropics/claude-code/issues/91408) — chained approve&&merge defeats interrupts; ambiguous follow-up toward production.
- [#91396](https://github.com/anthropics/claude-code/issues/91396) — assistant emitted a fabricated user message and acted on it as authorization.

Backups (do not ship unless primary blocked): **Fid** / #88747 — worktree writes an absolute `core.hooksPath`. **Toggle** / #91422 — `--permission-mode dontAsk` refuses `cp`/`mv` option tokens. **Collet** / #53940 — Cowork Edit/Write silently truncate files.

Product name stays **Annunciator**. Do not rename to Caisson, Spindle, Knell, Tumbler, Escapement, Geneva, Scotch, Fibula, Virgule, Riddle, Garner, Pintle, Postern, Carillon, Sluice, Alidade, Cockade, Lye, Clew, Hasp, Berth, Bollard.

Different UI: industrial annunciator / false-alarm panel / riveted steel fascia + ISA window boxes + lamp board for main-turn vs helper forks vs subagent 429 cascade / parent session_id stamp / low-priority idle drip / cascade counter 14/~1min / steel-amber-dark. Chakra Petch + Barlow + Share Tech Mono. NOT Zilla Slab/Epilogue/Overpass Mono (Caisson). NOT Cardo/Hind/Cousine (Spindle). NOT Bitter/Karla/Inconsolata (Knell). NOT Young Serif/Figtree/Fragment Mono (Tumbler). NOT Instrument Serif/Manrope/Azeret Mono (Escapement). NOT Bodoni/Jost/Space Mono (Geneva). NOT Spectral/Sora/IBM Plex Mono (Scotch). NOT Cormorant/Outfit/Fira (Fibula). NOT Libre Baskerville/Work Sans/JetBrains (Virgule). NOT Newsreader/Public Sans/Source Code Pro (Riddle). NOT Literata/Atkinson (Garner). NOT Fraunces (Sluice). NOT Syne/DM Sans (Pintle). NOT Playfair/Source Serif 4 (Carillon). NOT Cinzel (Postern). Stay OFF caisson dry-dock / spindle chip-sweep / knell mute-bell / tumbler keyway / escapement pallet / carillon peal / sluice millrace / berth-card clone / bollard clone.

Different verbs: dark the board, pin idle dark, pin seeded spurious, admit the turn never ran, load fixtures, reset to dark. Not "Score the seal/purge/mute/keyway/pallet/cross/block/pin/stick/mesh/loft/hinge/peal/peg/postern/race".

Different idle: **dark**.

## Live catalog path

`/annunciator/` is this static industrial annunciator / false-alarm panel atelier desk. Path `https://hermes-playground-green.vercel.app/annunciator/` and subdomain `https://annunciator.hermes-playground-green.vercel.app` are both fine. Demo works with no secrets and no npm. Mark: `17:50 / hermes catalog #118 / #91419`. `?embed=1` hides chrome for the hub living featured well.

1. Idle demo loads **dark** — board stays dark until the real main turn ends on an API error; helper forks do not light.
2. Seed **spurious** → #91419: `StopFailure` for helper forks and background subagent 429s on the parent session_id; 9/7/14 in about a minute; `/low-priority` idle drip ~20–30s.
3. Atelier UI: riveted steel fascia / ISA window boxes / lamp board / parent session stamp / idle drip / cascade counter. Dark = every helper window unlit. Spurious = helper and 429 windows amber, parent session_id stamped.
4. Cousin cite strip labeled cousin-not-primary: [#87972](https://github.com/anthropics/claude-code/issues/87972) / [#91414](https://github.com/anthropics/claude-code/issues/91414) / [#91408](https://github.com/anthropics/claude-code/issues/91408) / [#91396](https://github.com/anthropics/claude-code/issues/91396). Cite only. Primary stays #91419.
5. **Dark the board** walks the probe ticket and lights chips on the desk. Chip-switch every verdict. Paste or drop JSON.

## How to score

Open `projects/annunciator/index.html` in a browser, or serve the repo root and visit `/annunciator/` (Vercel rewrite → `/projects/annunciator`). No build step. Optional hook:

```bash
node projects/annunciator/hook/annunciator.mjs projects/annunciator/data/91419.json
node --test projects/annunciator/hook/annunciator.test.mjs
```

Empty stdin scores the idle **dark** ticket. Paste a probe on the page or drop a fixture from `data/`.
