# Deadlight

A **night-cabin / brass-deadlight scoring desk** — ink black, lamp brass, shutter iron, starlight paper, cabin indigo — Libre Baskerville + Manrope + IBM Plex Mono — for a real Claude Desktop defect: **LISTAGENTS / SENDMESSAGE MISSING FROM THE TOOL REGISTRY IN DESKTOP SCHEDULED-TASK AND REMOTE CONTROL SESSIONS (BISECTED TO DESKTOP 1.44121.4 → 1.46388.1).**

Primary:

- [anthropics/claude-code#92249](https://github.com/anthropics/claude-code/issues/92249) (OPEN, bug, has repro, platform:windows, area:agents, regression, area:desktop, filed 2026-09-05T01:11:44Z, updated 2026-09-05T01:46:38Z). Title: `[BUG] ListAgents / SendMessage missing from tool registry in Desktop scheduled-task and Remote Control sessions (bisected to Desktop 1.44121.4 -> 1.46388.1)`. Reporter 0u0v. Claude Desktop 1.46388.3 · bundled Claude Code 2.1.260 · standalone CLI 2.1.250 · Windows 11 10.0.26200. After Desktop auto-updated 1.44121.4 → 1.46388.1, built-in cross-session tools `ListAgents` and `SendMessage` are absent from the tool registry **and** the deferred-tool list in sessions started as Desktop scheduled tasks or driven via Remote Control. ToolSearch returns `No matching deferred tools found`. Interactive Desktop Code tab and standalone CLI on the same machine / account / settings still have both tools. Not `permissions.deny`. Not `crossSessionInbound`. Not MCP `ccd_session_mgmt` (that surface has a separate intentional unattended refusal). First blank at 15:57 on bundled runtime 2.1.255; 2.1.260 was written at 16:18 — host change is the variable. Still blanked on 1.46388.2 and 1.46388.3.

11:50 deadlight: a deadlight that blanks ListAgents and SendMessage on scheduled-task and Remote Control is not an unattended safety rail — it is a porthole already shuttered. Score the deadlight or admit the registry already blanked.

Idle word: **lit**. Seeded state: **blanked** / #92249 — tools missing from registry + deferred list in scheduled-task / Remote Control. Never idle as afloat / careened / caught / slipping / locked / wiped / seated / channel / stranded / scratched / live / orphaned / set / scrapped / pure / scorched / cold / voided / banked / rewritten / keyed / strayed / scrubbed / pulled / enacted / withheld / masked / bled / fouled / careted / ringing.

**Deadlight** is the brass shutter that blanks a porthole. Unattended sessions have the agent-mesh porthole shuttered — the registry has a blank where ListAgents and SendMessage should be.

- **lit** = HOLD: registry shows ListAgents and SendMessage; porthole clear
- **blanked** = #92249: tools missing from registry + deferred list in scheduled-task / Remote Control
- **lit-interactive** = Desktop interactive local Code tab still has both tools
- **lit-cli** = standalone CLI still has both tools
- **blanked-scheduled-task** = Desktop scheduled-task routine: both tools absent
- **blanked-remote-control** = Remote Control (phone-driven): both tools absent
- **toolsearch-empty** = ToolSearch returns no matching deferred tools
- **not-permissions-deny** = no deny entry; not a permission-rule problem
- **not-mcp-ccd-refusal** = MCP ccd unattended refusal is a different, intentional shutter
- **bisect-host-not-runtime** = host 1.44121.4 → 1.46388.1; runtime bump later
- **still-blanked-46388-2** = still blanked on Desktop 1.46388.2
- **still-blanked-46388-3** = still blanked on Desktop 1.46388.3

Verdicts: lit, blanked, lit-interactive, lit-cli, blanked-scheduled-task, blanked-remote-control, toolsearch-empty, not-permissions-deny, not-mcp-ccd-refusal, bisect-host-not-runtime, still-blanked-46388-2, still-blanked-46388-3.

This is a diagnostic scoring desk. Not an exploit. No payloads. No real credentials. Score whether the deadlight is lit or the registry already blanked. Fixtures use fictionalized paths (`%LOCALAPPDATA%\AnthropicClaude\app-<demo-ver>`, `~/.claude/projects/<demo-slug>/<session-id>.jsonl`).

Hypothesis only (NON-BINDING): Desktop host 1.46388.1 stopped registering built-in cross-session tools for unattended session kinds (scheduled-task / Remote Control) while interactive Code tab and standalone CLI on the same account still receive them. Discard if evidence disagrees. Encoded from the issue’s mechanism. Do not claim unseen source.

## Why not a clone

This is specifically: **LISTAGENTS / SENDMESSAGE MISSING FROM THE TOOL REGISTRY IN DESKTOP SCHEDULED-TASK AND REMOTE CONTROL SESSIONS.**

NOT Careen ([#92246](https://github.com/anthropics/claude-code/issues/92246)) — Windows Developer-sideloaded MSIX forced mid-session swap. Deadlight is a tool-registry blank after a host bump, not a hull scrape.
NOT [#90481](https://github.com/anthropics/claude-code/issues/90481) — VS Code extension update disables ListAgents/SendMessage in every session. Deadlight is Desktop host gating unattended surfaces only.
NOT [#92134](https://github.com/anthropics/claude-code/issues/92134) — SendMessage missing for in-process subagent continue; cross-session tools still work.
NOT [#90243](https://github.com/anthropics/claude-code/issues/90243) — stale Remote Control pairings truncate a scan of tools that are present.
NOT [#88970](https://github.com/anthropics/claude-code/issues/88970) — send_message return path / local_uuid unreachable; tools exist.
NOT Ratchet ([#92242](https://github.com/anthropics/claude-code/issues/92242)) — `/goal` stop-hook re-fire after AskUserQuestion BLOCKED.
NOT Forme ([#92203](https://github.com/anthropics/claude-code/issues/92203)) — TUI completed-turn scrollback wipe.
NOT Tabula ([#92210](https://github.com/anthropics/claude-code/issues/92210)) — deep-link same-folder scratch.
NOT Oxbow ([#92197](https://github.com/anthropics/claude-code/issues/92197)) — transcript forest largest≠newest.
NOT Relict / Hellbox / Cupel / Oubliette / Ephemera / Commutator UIs.

Different surface: Desktop host tool-registry blank on unattended session kinds vs MSIX mid-session kill / `/goal` hooks / TUI scrollback / deep-link / transcript forest. Completely different UI (night cabin, brass deadlight, ink-black, lamp brass, shutter iron — not teal/copper careening yard), backend (probe-shaped JSON of lit / blanked / scheduled-task / Remote Control / ToolSearch rows), and UX (porthole vs shutter simulator, lit/blanked state machine, cabin plates).

Cousins are cite-only on a cousin strip; primary stays #92249.

- [#90481](https://github.com/anthropics/claude-code/issues/90481) — OPEN — cross-session messaging permanently disabled after update. Cite-only.
- [#92134](https://github.com/anthropics/claude-code/issues/92134) — OPEN — ListAgents tells you to use SendMessage not present in build. Cite-only.
- [#90243](https://github.com/anthropics/claude-code/issues/90243) — OPEN — stale Remote Control pairings truncate reachability. Cite-only.
- [#88970](https://github.com/anthropics/claude-code/issues/88970) — OPEN — send_message return path / local_uuid unreachable. Cite-only.

Backups (document only, do not build): [#92251](https://github.com/anthropics/claude-code/issues/92251) (Cowork scheduled-task duplicate early fire), [#91991](https://github.com/anthropics/claude-code/issues/91991) (Remote Control New attaches to most recent session), [#92248](https://github.com/anthropics/claude-code/issues/92248) (browser pane policy-check unavailable).

Product name stays **Deadlight**. Do not rename to Careen, Ratchet, Forme, Tabula, Oxbow, Relict, Hellbox, Cupel, Oubliette, Ephemera, Commutator, Heddle, Hectograph, Placet, Frisket, Tangent, Hawser, Caret, Buoy, Solecism, Coffer, Codicil, Crimp, Jackfield, Tocsin, Bolter, Deadeye, Reglet, Reliquary, Annunciator, Caisson, Spindle, Knell, Tumbler, Escapement, Geneva, Scotch, Pintle, Detent, Snuff, Doublet, Lintel or any existing catalog slug.

Different UI: night-cabin brass deadlight + ink black + lamp brass + shutter iron + starlight paper / cabin indigo. Libre Baskerville + Manrope + IBM Plex Mono. NOT Newsreader / Figtree (Careen). NOT Outfit / Source Serif 4 / Fragment Mono (Ratchet). NOT Literata / Manrope (Forme — Manrope is UI here, display is Libre Baskerville). NOT Fraunces / Source Sans 3 (Tabula). Stay OFF careening yard / workshop ratchet / imposing-stone / wax tablet / oxbow floodplain / glacial relict slab / hellbox melt / cupel assay / oubliette pit.

Different verbs: Score the deadlight, pin idle lit, pin seeded blanked, admit the registry already blanked, load fixtures, reset to lit. Score the deadlight is this desk’s phrase.

Different idle: **lit**.

## Live catalog path

`/deadlight/` is this static night-cabin brass-deadlight scoring desk. Path `https://hermes-playground-green.vercel.app/deadlight/` and subdomain `https://deadlight.hermes-playground-green.vercel.app` are both fine. Demo works with no secrets and no npm. Mark: `11:50 / hermes catalog #147 / #92249`. `?embed` or `?embed=1` hides chrome for the hub living featured well.

1. Seeded demo loads **blanked** — Desktop host 1.46388.1; scheduled-task and Remote Control missing ListAgents and SendMessage from registry and deferred list; ToolSearch empty; not deny, not inbound, not MCP ccd; host not runtime; still blanked on 1.46388.2 / 1.46388.3; the porthole is already shuttered.
2. Idle **lit** → interactive Code tab and standalone CLI still show both tools; the porthole stays clear.
3. Cabin UI: open porthole for lit vs brass shutter for blanked, surface/registry state machine, iron plates. Lit = registry shows the tools. Blanked = deadlight already shut.
4. Cousin cite strip labeled cousin-not-primary: [#90481](https://github.com/anthropics/claude-code/issues/90481), [#92134](https://github.com/anthropics/claude-code/issues/92134), [#90243](https://github.com/anthropics/claude-code/issues/90243), [#88970](https://github.com/anthropics/claude-code/issues/88970). Cite only. Primary stays #92249.
5. **Score the deadlight** walks the probe ticket and lights chips on the desk. Chip-switch every verdict. Paste or drop JSON. Surface simulator chips rewrite whether the session is interactive, CLI, scheduled-task, or Remote Control. Deadlight machine steps interactive → cli → scheduled → remote → toolsearch → blanked.

## How to score

Open `projects/deadlight/index.html` in a browser, or serve the repo root and visit `/deadlight/` (Vercel rewrite → `/projects/deadlight`). No build step. Hook is a documentation stub only:

```bash
# No classifier binary. The living page scores probes in-browser.
# See projects/deadlight/hook/README.md
```

Empty paste scores the idle **lit** ticket if you pin idle. Paste a probe on the page or drop a fixture from `data/`. The living page seeds **blanked**.
