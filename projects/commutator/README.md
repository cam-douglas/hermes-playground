# Commutator

A **rotary brush-gear / segment drum atelier** — copper segment drum (one bar per concurrent `tools/call` JSON-RPC id), carbon brushes (client correlation), slot ledger (timed-out tool vs landed sibling), drum lamp (keyed insulator-cream / strayed brush-copper), session plaque (`Mcp-Session-Id` over streamable-http); brush-copper / slate / insulator-cream — Source Serif 4 + Libre Franklin + JetBrains Mono — for a real Claude Code defect: **STREAMABLE-HTTP CONCURRENT BATCH JSON-RPC ID MIS-CORRELATION / SIBLING-SLOT STRAY; AREA:MCP; PLATFORM:MACOS.**

Primary:

- [anthropics/claude-code#91958](https://github.com/anthropics/claude-code/issues/91958) (OPEN, bug, has repro, platform:macos, area:mcp, filed 2026-09-04T02:07:13Z, updated 2026-09-04T12:06:15Z). Title: `MCP streamable-http: a slow tool call's result lands in a sibling call's slot in a concurrent batch`. Reporter keithkessleraz. Claude Code 2.1.185. macOS 26.5.2. Remote MCP streamable-http via the claude.ai connector. FastMCP 3.2.4. MCP Python SDK 1.27.0. nginx. OAuth 2.1.

a commutator that seats a late reply on a sibling segment is not a timeout — it is a brush already strayed. Score the drum or admit the batch already lied.

Idle word: **keyed**. Seeded state: **strayed** / #91958 — concurrent `tools/call` batch on one `Mcp-Session-Id` over streamable-http; a slow call reports `Tool call timed out waiting for server response` while its real result lands in a sibling call's slot. Never idle as scrubbed / pulled / enacted / withheld / masked / bled / crossed / homed / slipped / fouled / mangled / verbatim / unbolted / snagged.

A **commutator** is the rotary switch on a DC machine: copper segments on a drum, carbon brushes riding the bars. Each brush must stay on its own segment. A brush that seats a late reply on a sibling bar is not a timeout — it is a brush already strayed.

- **strayed** = #91958: concurrent batch; timed-out call's payload landed in a sibling slot; model got a well-formed wrong tool result
- **streamable-http** = remote MCP over streamable-http via the claude.ai connector (not local stdio)
- **mcp-session** = concurrent `tools/call` batch on one `Mcp-Session-Id`
- **tools-call-batch** = concurrent `tools/call` in one turn; incident 1 batch 12; incident 2 batch 3
- **json-rpc-id** = expected own result or own timeout matched to own JSON-RPC id; late reply never attaches to a different call
- **late-reply** = real result arrived after the client's per-call timeout
- **sibling-slot** = payload of the timed-out call landed in a sibling call's slot
- **client-timeout** = client reported `Tool call timed out waiting for server response` while the handler completed server-side
- **server-exonerated** = hand-rolled client; 28 configs × 5; batches 3 and 12; ~1200 calls; zero misroutes; SSE GET zero reply frames
- **sequential-clean** = neither incident reproduced on a sequential re-run of the same calls
- **well-formed-wrong** = model gets a well-formed but wrong tool result with no signal
- **has-clear-repro** = OPEN, bug, has repro, platform:macos, area:mcp; two production incidents
- **hold** = each result keyed to its own JSON-RPC id; the drum holds
- **keyed** = HOLD: each concurrent `tools/call` result matches its own JSON-RPC id; late reply never seats a sibling

Verdicts: keyed, strayed, streamable-http, mcp-session, tools-call-batch, json-rpc-id, late-reply, sibling-slot, client-timeout, server-exonerated, sequential-clean, well-formed-wrong, has-clear-repro, hold.

This is a diagnostic scoring desk. Not an exploit. No payloads. No real credentials. Score whether the drum keyed each result to its own id or already seated a late reply on a sibling.

Hypothesis only (NON-BINDING): after the client's per-call timeout, a late reply attaches to a still-pending sibling instead of matching strictly by JSON-RPC id. Discard if issue evidence disagrees. Encoded from the issue's two production incidents, expected correlation, and server-side wire sweep. Do not claim Claude Code source you have not seen.

## Why not a clone

This is specifically: **STREAMABLE-HTTP CONCURRENT BATCH JSON-RPC ID MIS-CORRELATION / SIBLING-SLOT STRAY — area:mcp.**

NOT Hectograph ([#92056](https://github.com/anthropics/claude-code/issues/92056)) — OTEL `tool_input` / `tool_parameters` scrub-flag leak.
NOT Placet ([#92040](https://github.com/anthropics/claude-code/issues/92040)) — ExitPlanMode Accept vs Accept-and-implement consent-scope mismatch.
NOT Frisket ([#91574](https://github.com/anthropics/claude-code/issues/91574)) — PreToolUse deny unenforced on Write-family.
NOT Jackfield ([#91511](https://github.com/anthropics/claude-code/issues/91511)) — cross-machine session.
NOT Hawser ([#91578](https://github.com/anthropics/claude-code/issues/91578)) — Windows idle warm MCP unreaped children.
NOT Caret ([#91526](https://github.com/anthropics/claude-code/issues/91526)) — npx cmd.exe argv reparse.
NOT Clepsydra ([#91414](https://github.com/anthropics/claude-code/issues/91414)) — MCP HTTP first-turn `subscriptions/listen` freeze.
NOT leftover gelatin hectograph / congregation chamber / print-shop frisket / clavichord tangent / dockyard hawser / proof-desk caret / harbor-buoy / usage-desk / vault-coffer / probate parchment / crimp pliers / jackfield channel-strip / tocsin fire-bell / bolter flour-mill / deadeye standing-rigging.

Different surface: concurrent MCP `tools/call` JSON-RPC id correlation on one `Mcp-Session-Id` over streamable-http. Completely different UI (rotary copper drum + carbon brushes + slot ledger), backend (fixture JSON of batch incidents + server sweep), and UX.

Cousins are cite-only on a cousin strip; primary stays #91958.

- [#91414](https://github.com/anthropics/claude-code/issues/91414) — OPEN — MCP HTTP: first turn blocks for `MCP_TIMEOUT-5000ms` awaiting `subscriptions/listen` after a successful `server/discover`. Related MCP HTTP timing, not sibling-slot stray. Cite-only.
- [#92046](https://github.com/anthropics/claude-code/issues/92046) — OPEN — Windows desktop: `Claude_Browser` MCP server registers zero tools since ~v2.1.229. Related MCP registration, not batch id correlation. Cite-only.
- [#92065](https://github.com/anthropics/claude-code/issues/92065) — OPEN — `mcp__claude-in-chrome__*` tools absent entirely on Windows (MSIX-hosted sessions). Related MCP presence, not streamable-http sibling-slot stray. Cite-only.

Backups (document only, do not ship unless blocked): Repeater [#92079](https://github.com/anthropics/claude-code/issues/92079), Governor [#92059](https://github.com/anthropics/claude-code/issues/92059), Oriel [#92053](https://github.com/anthropics/claude-code/issues/92053).

Product name stays **Commutator**. Do not rename to Hectograph, Placet, Frisket, Tangent, Hawser, Caret, Buoy, Solecism, Coffer, Codicil, Crimp, Jackfield, Tocsin, Bolter, Deadeye, Reglet, Reliquary, Annunciator, Caisson, Spindle, Knell, Tumbler, Escapement, Geneva, Scotch, Pintle.

Different UI: rotary segment drum + carbon brushes + slot ledger + drum lamp + session plaque / brush-copper / slate / insulator-cream. Source Serif 4 + Libre Franklin + JetBrains Mono. NOT Fraunces/Outfit/Fira Code (Hectograph). NOT Spectral/Figtree (Placet). NOT Libre Baskerville/Karla/IBM Plex Mono (Frisket). Stay OFF gelatin hectograph / congregation chamber / print-shop frisket / clavichord keycaps / hawser bitts / proof-desk caret / harbor-buoy / usage-desk / vault-coffer / probate parchment / crimp pliers / jackfield channel-strip / tocsin fire-bell.

Different verbs: Key the drum, pin idle keyed, pin seeded strayed, admit the batch already lied, load fixtures, reset to keyed. Score the drum is this desk's phrase.

Different idle: **keyed**.

## Live catalog path

`/commutator/` is this static rotary brush-gear atelier. Path `https://hermes-playground-green.vercel.app/commutator/` and subdomain `https://commutator.hermes-playground-green.vercel.app` are both fine. Demo works with no secrets and no npm. Mark: `22:50 / hermes catalog #136 / #91958`. `?embed=1` hides chrome for the hub living featured well.

1. Idle demo loads **keyed** — each concurrent `tools/call` result matches its own JSON-RPC id; late reply never seats a sibling; the drum holds.
2. Seed **strayed** → #91958: concurrent batch on one `Mcp-Session-Id` over streamable-http; timed out `get_tag_vocabulary`; payload landed in `get_park`; well-formed wrong tool result; server sweep zero misroutes.
3. Atelier UI: rotary copper drum / carbon brushes / slot ledger / drum lamp / session plaque. Keyed = drum holds. Strayed = the brush already seated a sibling.
4. Cousin cite strip labeled cousin-not-primary: [#91414](https://github.com/anthropics/claude-code/issues/91414), [#92046](https://github.com/anthropics/claude-code/issues/92046), [#92065](https://github.com/anthropics/claude-code/issues/92065). Cite only. Primary stays #91958.
5. **Key the drum** walks the probe ticket and lights chips on the desk. Chip-switch every verdict. Paste or drop JSON.

## How to score

Open `projects/commutator/index.html` in a browser, or serve the repo root and visit `/commutator/` (Vercel rewrite → `/projects/commutator`). No build step. Optional hook:

```bash
node projects/commutator/hook/commutator.mjs projects/commutator/data/91958.json
node --test projects/commutator/hook/commutator.test.mjs
```

Empty stdin scores the idle **keyed** ticket. Paste a probe on the page or drop a fixture from `data/`.
