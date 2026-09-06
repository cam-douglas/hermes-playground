# Aphonia

A **voice clinic / ENT laryngoscope assay** — sterile tile grid, soft clinical teal, deep charcoal ink, muted rose for mute, soft amber for roster glow — Fraunces + Karla + IBM Plex Mono — for a real Claude Code defect: **IN A DESKTOP CODE-TAB / AGENT-SDK SESSION, `LISTAGENTS` LISTS PEERS AND INSTRUCTS `SENDMESSAGE`, BUT `SENDMESSAGE` IS NOT IN THAT SESSION'S TOOLSET (2.1.258, WINDOWS).** The roster shows the choir. The speaking reed was never laid on this tray. A sibling booth already sings. Score the voice or admit the session already muted.

Primary:

- [anthropics/claude-code#92409](https://github.com/anthropics/claude-code/issues/92409) (OPEN, bug, platform:windows, area:agents, area:desktop). Title: `SendMessage tool missing in desktop Code tab session while ListAgents shows peers (2.1.258, Windows)`. Filed 2026-09-06. Reporter: TheAbyssalOne.

18:50 aphonia: a laryngoscope tray that shows every choir name on the roster but never lays the speaking reed beside it — the sibling booth already sings. Score the voice or admit the session already muted.

Idle word: **mute**. Seeded state: **rostered** / #92409 — ListAgents advertised peers + SendMessage instructions while the tool is missing. Never idle as inherited, freewheeling, deaf, choking, miscast, unguided, dropped, strobing, stolen, dawnlocked, misaimed, cold, voided, or prior catalog idle words. Never seeded as collided, doubled, clobbered, retried, or prior catalog seeded words.

**Aphonia** is loss of voice. The laryngoscope can see the choir on the roster. The speaking instrument was never placed on this session's tray.

- **mute** = IDLE: SendMessage was never placed on this Code-tab / Agent-SDK tray
- **rostered** = seeded word: ListAgents advertised 21 peers and SendMessage instructions while the tool is missing
- **voiced** = contrast hold: SendMessage available whenever ListAgents reports peers
- **tool-present** = contrast hold: SendMessage is in the session toolset (ToolSearch can find it)
- **sibling-has-voice** = sibling "Orchestration" had SendMessage and used it on the same peer
- **deferred-search-miss** = ToolSearch `select:SendMessage` returns "No matching deferred tools found"
- **mcp-not-substitute** = desktop `send_message` MCP (session_mgmt) needs a CCD session id; cannot resolve `aria-80`
- **cousins** = cite-only #92249 #92134 #92016 #92289 #90481 #81185 #79931

Verdicts: mute, rostered, voiced, tool-present, sibling-has-voice, deferred-search-miss, mcp-not-substitute, cousins.

This is a diagnostic scoring assay. Not an exploit. No live Claude sessions. Score whether a Code-tab session that can list peers would have a voice or already be muted. Fixtures use the issue's ListAgents sample (`aria-80 [056652] · interactive · idle`), ToolSearch miss, sibling Orchestration contrast, published settings, and expected-vs-actual only.

Hypothesis only (NON-BINDING): per-session tool gating at Desktop Code-tab / Agent-SDK spawn omits CLI-native SendMessage from some interactive sessions while still registering ListAgents and printing SendMessage instructions; spawn kind / session bootstrap differs from sibling sessions that load the tool. Verify against issue evidence only. Discard if issue evidence disagrees. Encoded from the issue body only. Do not invent runtime source claims. The Mycroft comment on spawn-kind / `--disallowedTools` / `--resume` is context only — primary facts stay the issue body.

## Research brief

Sources:

- Primary: [anthropics/claude-code#92409](https://github.com/anthropics/claude-code/issues/92409)
- Issue comment (Mycroft / tonydzi, 2026-09-06): spawn-kind boundary discussion — treat as context only; primary facts stay the issue body.

What happened (from the issue — do not invent):

- Environment: Claude Code **2.1.258** (`claude --version`); **Windows 11 Enterprise 10.0.26200**; Claude desktop app, **Code tab** (session reports "running within the Claude Agent SDK"); model **claude-fable-5-1**.
- Settings: `~/.claude/settings.json` has `permissions.defaultMode: "dontAsk"`, `crossSessionInbound: "accept"`, no `permissions.deny` entries. No project settings gate the tool.
- In one Code-tab session: `ListAgents` succeeds and lists **21 peers**, including `aria-80 [056652] · interactive · idle`, and instructs to send with `SendMessage({to: name, message: ...})`.
- `SendMessage` is **not** in that session's toolset. `ToolSearch` with `select:SendMessage` returns **"No matching deferred tools found"**.
- A sibling session on the same machine and same account (**"Orchestration"**, cwd `D:\dev\GitHub`) **did** have `SendMessage` and used it successfully to message the same peer.
- Reproduced twice in the same session (tool list does not change mid-session). Gate appears **per-session at startup**, not version or settings.
- Expected: `SendMessage` is available whenever `ListAgents` is available and reports peers, per https://code.claude.com/docs/en/cross-session-messaging ("messaging is on with nothing to enable" once on 2.1.234+ on Windows).
- Actual: `ListAgents` present, `SendMessage` absent. The desktop-app `send_message` MCP tool (session_mgmt) is not a substitute: it requires a CCD session id and cannot resolve peer names such as `aria-80`.

Problem found: ListAgents present and advertising SendMessage → SendMessage missing from this session's toolset → sibling session on the same machine already has the tool.

Why this solution: a diagnostic scorer for the mute tray → rostered choir chain, so a reader can pin idle mute, seed rostered, and score voiced / tool-present / sibling-has-voice / deferred-search-miss / mcp-not-substitute against the published facts.

## Why not a clone

This is specifically: **interactive Desktop Code-tab / Agent-SDK session where ListAgents WORKS and advertises SendMessage, but SendMessage is missing from the toolset; a sibling session has it.**

NOT Deadlight/#92249 — scheduled-task / Remote Control blanks **BOTH** ListAgents **AND** SendMessage. Aphonia is interactive Code tab where ListAgents **WORKS** and advertises SendMessage, but SendMessage is missing; sibling has it.
NOT Nixie/#92383 — send reports Message sent/queued then no Mapping / 45s undelivered. Aphonia never has the tool to call.
NOT Fulcrum/#92377 — `--name` discarded / foreign auto title / registry collision. Aphonia is toolset asymmetry, not naming.
NOT Wildcat/#92399 — `run_in_background` shell-exit while nohup children freewheel. Aphonia is not a windlass.
NOT Clobber/#92419 — inode rename → deaf watcher → autosave clobber. Aphonia is not a print shop.
NOT Watchdog/#92424 — Workflow stall-watchdog vs auto-compaction. Aphonia is not a kennel.
NOT Understudy/#92426 — Agent() definition ignored under dispatch. Aphonia is not a dressing-room.
NOT Fairlead/#92403 — URI scheme `file://`-only. Aphonia is not a hawse-pipe.
NOT Stroboscope/Heliostat/Lethe/Frizzen/Embrasure/Elision/Graft and prior catalog desks.
Do NOT name this Deadlight, Nixie, Fulcrum, Wildcat, Clobber, Watchdog, Understudy, Fairlead, Stroboscope, Heliostat, Lethe, Frizzen, Embrasure, Elision, Graft, or any existing catalog slug.
Do NOT reuse idle inherited / freewheeling / deaf / choking / miscast / unguided / dropped / strobing / stolen / dawnlocked / misaimed / cold / voided.
Do NOT reuse seeded collided / doubled / clobbered / retried.

Different surface: per-session toolset asymmetry (ListAgents present, SendMessage absent) vs unattended dual-blank / silent drop / naming collision / bg completion / inode watcher / stall watchdog / casting / URI drop.

Cousins cite-only (NOT primary — different root cause):

- [#92249](https://github.com/anthropics/claude-code/issues/92249) — ListAgents / SendMessage missing in scheduled-task and Remote Control (both blanked)
- [#92134](https://github.com/anthropics/claude-code/issues/92134) — ListAgents tells you to use SendMessage not present for in-process subagent continue
- [#92016](https://github.com/anthropics/claude-code/issues/92016) — Desktop Code tab auto-denies CLI-native SendMessage (macOS)
- [#92289](https://github.com/anthropics/claude-code/issues/92289) — Desktop blocks CLI-native SendMessage, breaking subagent continuation
- [#90481](https://github.com/anthropics/claude-code/issues/90481) — VS Code extension update disables ListAgents/SendMessage permanently
- [#81185](https://github.com/anthropics/claude-code/issues/81185) — plugin teammate `tools:` list omits SendMessage
- [#79931](https://github.com/anthropics/claude-code/issues/79931) — Grep/Glob missing from tool roster (`tengu_deferred_stub_tool`)

Product name stays **Aphonia**. Do not rename to Deadlight, Nixie, Fulcrum, Wildcat, Clobber, Watchdog, Understudy, Fairlead, Stroboscope, Heliostat, Lethe, Frizzen, Embrasure, Elision, Graft, or any existing catalog slug. Name/slug `aphonia` confirmed unused in catalog.json.

Different UI: clinical voice-lab / ENT laryngoscope tray, sterile tiles, teal + charcoal + muted rose + roster amber. Fraunces / Karla / IBM Plex Mono. NOT Cormorant + DM Sans + Fira (Fulcrum brass balance beam). NOT Syne / Sora (Wildcat windlass). NOT DM Serif Display / Figtree (Clobber print-shop). NOT Bricolage Grotesque (Watchdog kennel). NOT Bodoni Moda (Understudy). Stay OFF brass beam / windlass deck / forme/ink/plate / kennel slats / dressing-room / hawse-pipe / optics strobe / rooftop observatory / underworld ferry / flintlock / postal nixie / porthole deadlight.

Different verbs: pin idle mute, pin seeded rostered, score voiced vs mute, flip tool-present vs deferred-search-miss, load fixtures, reset to voiced.

Different idle: **mute**. Different seeded: **rostered**. Contrast: **voiced** / **tool-present**.

## Live catalog path

`/aphonia/` is this static voice-clinic scoring assay. Path `https://hermes-playground-green.vercel.app/aphonia/` and subdomain `https://aphonia.hermes-playground-green.vercel.app` are both fine. Demo works with no secrets and no live Claude sessions. Mark: `18:50 / hermes catalog #178 / #92409`. `?embed` or `?embed=1` hides chrome for the hub living featured well.

1. Seeded demo loads **rostered** — ListAgents lists 21 peers including `aria-80 [056652] · interactive · idle` and prints SendMessage instructions; SendMessage is missing; ToolSearch misses; sibling Orchestration already has the tool.
2. Idle **mute** → the speaking reed was never laid on this session's tray.
3. Contrast **voiced** → SendMessage available whenever ListAgents reports peers (docs: messaging on with nothing to enable on 2.1.234+ Windows).
4. Contrast **tool-present** → SendMessage is in the session toolset; ToolSearch can find it.
5. Score **sibling-has-voice** → Orchestration used SendMessage on the same peer; this booth did not.
6. Score **deferred-search-miss** → ToolSearch `select:SendMessage` returns no matching deferred tools.
7. Score **mcp-not-substitute** → desktop session_mgmt `send_message` needs a CCD session id; cannot resolve `aria-80`.
8. Assay UI: laryngoscope, instrument tray, two exam booths, choir roster, expected vs actual chart.
9. Stay-off strip: Deadlight / Nixie / Fulcrum / Wildcat / Clobber / Watchdog / Understudy / Fairlead / Stroboscope / Heliostat / Lethe / Frizzen. Primary stays #92409.
10. **Score the voice** walks the probe ticket and lights chips on the tray. Chip-switch every verdict. Paste or drop JSON. Assay simulator chips rewrite the tray (roster / mute / sibling / voiced).

## How to score

Open `projects/aphonia/index.html` in a browser, or serve the repo root and visit `/aphonia/` (Vercel rewrite → `/projects/aphonia`). No build step.

```bash
# No live Claude sessions. The living page scores probes in-browser.
# Do not claim this guard ships in Claude Code.
```

Empty paste scores the idle **mute** ticket if you pin idle. Paste a probe on the page or drop a fixture from `data/`. The living page seeds **rostered** / ListAgents present / SendMessage absent / sibling already voiced.
