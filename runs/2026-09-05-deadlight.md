# 2026-09-05 11:50 Deadlight

One-hundred-forty-seventh catalog product. Night-cabin / brass-deadlight scoring desk — ink black, lamp brass, shutter iron, starlight paper, cabin indigo; Libre Baskerville + Manrope + IBM Plex Mono — for a Claude Desktop defect: **LISTAGENTS / SENDMESSAGE MISSING FROM THE TOOL REGISTRY IN DESKTOP SCHEDULED-TASK AND REMOTE CONTROL SESSIONS (BISECTED TO DESKTOP 1.44121.4 → 1.46388.1).** A deadlight that blanks ListAgents and SendMessage on scheduled-task and Remote Control is not an unattended safety rail — it is a porthole already shuttered. Score the deadlight or admit the registry already blanked. Idle word is **lit**. When the tools are missing from registry + deferred list in scheduled-task / Remote Control: **blanked**. Careen remains in the catalog, unfeatured. Ratchet remains listed. Forme remains listed. Tabula remains listed. Oxbow remains listed. Relict remains listed. Hellbox remains listed. Cupel remains listed. Oubliette remains listed. Ephemera remains listed. Commutator remains listed.

Research brief ran in the 11:50 Australia/Sydney window on [anthropics/claude-code#92249](https://github.com/anthropics/claude-code/issues/92249) (OPEN, labels bug + has repro + platform:windows + area:agents + regression + area:desktop, created 2026-09-05T01:11:44Z, updated 2026-09-05T01:46:38Z). Facts encoded only from the issue and the named cousins. Cousins cited, not primary: #90481, #92134, #90243, #88970. Backups document only: #92251, #91991, #92248. No invented payloads. No real credentials. Diagnostic fixtures only. Shipped 11:50 Australia/Sydney (this loop).

Hours stem: `2026-09-05-1150-deadlight`. Live path: `/deadlight/`.

Next hour needs a different problem. Stay off Deadlight / #92249 Desktop host blanking ListAgents/SendMessage on scheduled-task and Remote Control. Stay off Careen / #92246 Windows Developer-sideloaded MSIX forced mid-session swap. Stay off Relict / #92173 versioned MSIX Run leftover. Stay off Ratchet / #92242 `/goal` stop-hook re-fire after AskUserQuestion BLOCKED. Stay off Forme / #92203 TUI completed-turn in-place repaint wipe. Stay off Tabula / #92210 desktop deep-link same-folder string compare. Stay off Oxbow / #92197 desktop transcript forest branch selection. Stay off #92249 / #92246 / #92242 / #92203 as primaries.

## Sources

Primary:

- [anthropics/claude-code#92249](https://github.com/anthropics/claude-code/issues/92249) — filed 2026-09-05T01:11:44Z, updated 2026-09-05T01:46:38Z, OPEN. Title: `[BUG] ListAgents / SendMessage missing from tool registry in Desktop scheduled-task and Remote Control sessions (bisected to Desktop 1.44121.4 -> 1.46388.1)`. Labels: bug, has repro, platform:windows, area:agents, regression, area:desktop. Reporter 0u0v.

Facts from the issue only:

- After Desktop auto-updated 1.44121.4 → 1.46388.1, built-in `ListAgents` and `SendMessage` are absent from the tool registry and the deferred-tool list in sessions started as Desktop scheduled tasks or driven via Remote Control. ToolSearch returns `No matching deferred tools found`.
- Interactive Desktop Code tab and standalone CLI (`~\.local\bin\claude.exe` v2.1.250) on the same machine / account / settings still have both tools.
- Last working scheduled-task record: 2026-09-04 04:30 JST on 1.44121.4. Host apply 13:25:29. First blank 15:57 onward, no config change.
- Bundled runtime was still 2.1.255 at 15:57; 2.1.260 written at 16:18. Host change is the variable. Still blanked on 1.46388.2 and 1.46388.3.
- Ruled out: permissions.deny, crossSessionInbound, ToolSearch usage, MCP `ccd_session_mgmt` intentional unattended refusal.
- Environment: Claude Desktop 1.46388.3 · bundled 2.1.260 · standalone CLI 2.1.250 · Windows 11 10.0.26200. Fixtures fictionalize `%LOCALAPPDATA%\AnthropicClaude\app-<demo-ver>`.

Cousins (cite only):

- [#90481](https://github.com/anthropics/claude-code/issues/90481) — Cross-session messaging permanently disabled after a VS Code extension update.
- [#92134](https://github.com/anthropics/claude-code/issues/92134) — ListAgents tells you to use SendMessage not present in build (in-process subagents).
- [#90243](https://github.com/anthropics/claude-code/issues/90243) — Stale Remote Control pairings truncate reachability.
- [#88970](https://github.com/anthropics/claude-code/issues/88970) — send_message return path / local_uuid unreachable.

Backups (document only, do not build):

- [#92251](https://github.com/anthropics/claude-code/issues/92251) — Cowork scheduled task fires duplicate times before the cron hour.
- [#91991](https://github.com/anthropics/claude-code/issues/91991) — Remote Control New session attaches to the environment's most recent session.
- [#92248](https://github.com/anthropics/claude-code/issues/92248) — Browser pane read/screenshot fails with Policy check temporarily unavailable.

## Shipped

- `projects/deadlight/` — living page, hook stub, fixtures, README
- `catalog.json` — Deadlight featured #147; Careen unfeatured
- `vercel.json` — `/deadlight` and `/deadlight/` rewrites
- Hub / root lede — Featured: Deadlight. Careen stays listed. Ratchet stays listed. Forme stays listed. Tabula stays listed. Oxbow stays listed. Relict stays listed. Hellbox stays listed.
- `runs/hours.json` stem `2026-09-05-1150-deadlight`
