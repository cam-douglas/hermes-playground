# Spillway hook

Tiny hydroelectric dam / spillway classifier notes for the Claude Code defect where `CLAUDE_CODE_MAX_CONCURRENT_SUBAGENTS` is skipped when ultracode is active, so a Workflow ran 7 agents under a cap of 3 (2.1.261). OPEN. Labels: bug, has repro, platform:linux, area:agents.

Idle word is **gated**. Seeded state is spilled / #92311 (ultracode early-return; 7 overlapping under cap 3). Never idle as hushed / blurted / maculed / stilled / rung / barred / dropped / pared / raw / cast / fouled / flowing / snubbed / matched / warded / lit / blanked / afloat / careened / caught / slipping / locked / wiped / seated / channel / stranded / scratched / live / orphaned / set / scrapped / pure / scorched / cold / voided / banked / rewritten.

This stub is documentation only. The living page at `projects/spillway/index.html` scores probes in-browser. No npm. No secrets. No real hooks. No exploits. Diagnostic shapes only (cap, ultracode flag, Workflow `agentCount`, sweep-line overlap, hook exit 2). No payloads.

Preferred fix / detection (document only — do not treat this stub as a live hook):

1. Apply the cap to Workflow-spawned agents and resumes; drop the ultracode early return, or
2. Make the exemption opt-in and default to enforced, or
3. Expose Workflow runtime concurrency (`min(16, cpus−2)`) as a setting and document that `CLAUDE_CODE_MAX_CONCURRENT_SUBAGENTS` does not bound it.

Workaround measured (from the issue): a SubagentStart hook that counts live agents and exits 2 when the count would exceed the cap.

Detection: if ultracode is on, the launch guard returns early (`appState.ultracode === true`, effort xhigh), Workflow plans `agentCount:16`, and a sweep-line over `agent-*.jsonl` timestamps peaks above the settings cap of 3, the dam is already spilled.

Given a probe-shaped payload `{ cap, ultracode, effort, agentCount, peakOverlap, workflowConcurrency, guardSkipped, amberKestrel, hookExit2, refusedCount, persistHold, log }`:

- **GATED** if the cap holds and concurrent stay ≤3 with no ultracode bypass
- **SPILLED** if ultracode early-return let overlap exceed the cap (#92311)
- **CAPPED** if settings set `CLAUDE_CODE_MAX_CONCURRENT_SUBAGENTS=3`
- **EXEMPT** if ultracode sessions are treated as exempt
- **OVERLAPPED** if sweep-line peak overlap is 7 at 2026-09-05T08:21:20.624Z
- **HOOKED** if SubagentStart exit 2 gates the live count
- **REFUSED** if the hook refused the spawn before the lane filled

This is a diagnostic scoring desk. Not an exploit. No payloads. No real credentials. Score whether the concurrency dam held or the spillway already opened.

Primary: [anthropics/claude-code#92311](https://github.com/anthropics/claude-code/issues/92311). Cousins (cite only, not primary): [#80082](https://github.com/anthropics/claude-code/issues/80082) docs omitted the concurrent cap; [#90483](https://github.com/anthropics/claude-code/issues/90483) Workflow concurrency derives from CPU count.

Hypothesis only (NON-BINDING): the interactive desk should make “ultracode early-return skips the concurrent cap so Workflow fans out past the operator’s 3” visceral via a dam board whose spillway opens. Discard if issue evidence disagrees. Do not claim unseen source.

NOT leftover Blurt CRT phosphor · Macule letterpress cream / vermilion · Alarum indigo night watchtower · Portcullis castle grate · Skive leather tannery · Lagan salvage-buoy · Snub dockside snubbing post · Ward locksmith iron/brass · Deadlight night-cabin shutter · Sluice millrace pond. Product name stays Spillway.
