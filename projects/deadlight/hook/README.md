# Deadlight hook

Tiny night-cabin / brass-deadlight classifier notes for the Claude Desktop defect where built-in cross-session tools `ListAgents` and `SendMessage` vanish from the tool registry and the deferred-tool list in sessions started as Desktop scheduled tasks or driven via Remote Control. Reporter 0u0v. Filed 2026-09-05. Labels: bug, has repro, platform:windows, area:agents, regression, area:desktop. Claude Desktop 1.46388.3 · bundled runtime 2.1.260 · standalone CLI 2.1.250 · Windows 11 10.0.26200.

Idle word is **lit**. Seeded state is blanked / #92249 (tools missing from registry + deferred list in scheduled-task / Remote Control after Desktop host 1.44121.4 → 1.46388.1). Never idle as afloat / careened / caught / slipping / locked / wiped / seated / channel / stranded / scratched / live / orphaned / set / scrapped / pure / scorched / cold / voided / banked / rewritten / keyed / strayed / scrubbed / pulled / enacted / withheld / masked / bled / fouled / careted / ringing.

This stub is documentation only. The living page at `projects/deadlight/index.html` scores probes in-browser. No npm. No secrets. No real hooks.

Given a probe-shaped payload `{ surface, listAgents, sendMessage, toolSearchEmpty, scheduledTask, remoteControl, permissionsDenyHit, mcpCcdRefusal, hostNotRuntime, stillBlanked463882, stillBlanked463883, persistHold, log }`:

- **LIT** if the registry shows ListAgents and SendMessage (porthole clear)
- **BLANKED** if both tools are absent from the registry and the deferred-tool list in a scheduled-task or Remote Control session (#92249)
- **LIT-INTERACTIVE** if a Desktop interactive Code tab still has both tools
- **LIT-CLI** if standalone CLI still has both tools
- **BLANKED-SCHEDULED-TASK** if a Desktop scheduled-task routine is missing both tools
- **BLANKED-REMOTE-CONTROL** if a Remote Control (phone-driven) session is missing both tools
- **TOOLSEARCH-EMPTY** if ToolSearch returns `No matching deferred tools found`
- **NOT-PERMISSIONS-DENY** if user and project settings have no deny entry for those tools
- **NOT-MCP-CCD-REFUSAL** if the MCP `ccd_session_mgmt` unattended refusal is a different, intentional shutter
- **BISECT-HOST-NOT-RUNTIME** if the first blank precedes the bundled runtime bump; Desktop host is the variable
- **STILL-BLANKED-46388-2** if still blanked on Desktop 1.46388.2
- **STILL-BLANKED-46388-3** if still blanked on Desktop 1.46388.3

This is a diagnostic scoring desk. Not an exploit. No payloads. No real credentials. Score whether the deadlight is lit or the registry already blanked.

Primary: [anthropics/claude-code#92249](https://github.com/anthropics/claude-code/issues/92249). Cousins (cite only, not primary): [#90481](https://github.com/anthropics/claude-code/issues/90481), [#92134](https://github.com/anthropics/claude-code/issues/92134), [#90243](https://github.com/anthropics/claude-code/issues/90243), [#88970](https://github.com/anthropics/claude-code/issues/88970).

Hypothesis only (NON-BINDING): Desktop host 1.46388.1 stopped registering built-in cross-session tools for unattended session kinds (scheduled-task / Remote Control) while interactive Code tab and standalone CLI on the same account still receive them. Not permissions.deny, not crossSessionInbound, not the MCP ccd unattended refusal. Discard if issue evidence disagrees. Do not claim unseen source.

NOT leftover Careen careening yard / Relict glacial slab / Snuff idle stealth / workshop ratchet / imposing-stone / wax tablet / oxbow floodplain / hellbox melt / cupel assay / oubliette pit. Product name stays Deadlight.
