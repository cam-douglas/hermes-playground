# Oubliette hook

Tiny stone-pit / trapdoor classifier for the Claude Code defect where a Cowork Dispatch child-completion notification is queued against an idle parent and only drains on the parent's next unrelated turn. Reporter AllyOmega. Filed 2026-09-04. Labels: bug, has repro, platform:windows, area:cowork. Claude Desktop (Cowork / Code tab) 1.44121.4.0 MSIX. CCD 2.1.258. Windows 11 (10.0.26200) x64.

Idle word is **cold**. Seeded state is voided / #92095 (cold parent + queued child completion; the notice sits until the next unrelated wake). Never idle as banked / rewritten / keyed / strayed / scrubbed / pulled / enacted / withheld / masked / bled / crossed / homed.

```bash
node projects/oubliette/hook/oubliette.mjs projects/oubliette/data/92095.json
node projects/oubliette/hook/oubliette.mjs projects/oubliette/data/cold.json
echo '{"parentTemp":"cold","queued":true,"childCompleted":true}' | node projects/oubliette/hook/oubliette.mjs
node --test projects/oubliette/hook/oubliette.test.mjs
```

Empty stdin uses the idle **cold** ticket. Stdout is JSON: `verdict`, `chips[]`, `reasons[]`, `cold`, `voided`, `hold`, `alarm`, `idleWord`.

Given a dispatch-shaped payload `{ parentTemp, queued, drained, childCompleted, processAlive, delay, coldPathHits }`:

- **COLD** if a warm parent drained the notice on the same turn (the trapdoor stayed shut)
- **VOIDED** if a cold parent queued a finished child's notice (#92095)
- **QUEUED** if the log shows `Queued notification for cold parent` in the same second as the child's result
- **TRAPDOOR** if the parent is not listening while idle and every wake relaunches the session
- **DRAIN-ON-WAKE** if the queue drains only on `idle → initializing`
- **NINE-OF-NINE** if every completion hit the cold path, 9 out of 9
- **UNBOUNDED** if the same parent saw 1m44s, 12m06s, 48m34s, 11h35m
- **NO-OS-NOTIFY** if nothing emits an OS notification and `ccd_session_mgmt__send_message` cannot reach the parent
- **HOLD** if the trapdoor stays shut on a warm drain

This is a diagnostic scoring desk. Not an exploit. No payloads. No real credentials. Score whether the trapdoor held or already dropped the notice into the pit.

Primary: [anthropics/claude-code#92095](https://github.com/anthropics/claude-code/issues/92095). Cousins (cite only, not primary): [#39335](https://github.com/anthropics/claude-code/issues/39335) locked same-class delayed completion, [#54214](https://github.com/anthropics/claude-code/issues/54214), [#53605](https://github.com/anthropics/claude-code/issues/53605). Different-class cite: [#20754](https://github.com/anthropics/claude-code/issues/20754), [#79268](https://github.com/anthropics/claude-code/issues/79268).

Hypothesis only (NON-BINDING): a Dispatch child completion is queued against the parent orchestrator; when the parent is idle there is no process alive to receive a push, so the notice sits until the next unrelated user turn. Discard if issue evidence disagrees. Do not claim Claude Code source you have not seen.

NOT leftover cream wick-lit ephemera / commutator drum / hectograph gelatin / congregation placet / print-shop frisket / dockyard hawser / watchhouse tocsin. Product name stays Oubliette.
