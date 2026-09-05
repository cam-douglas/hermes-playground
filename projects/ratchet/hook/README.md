# Ratchet hook

Tiny workshop ratchet / gear-tooth classifier notes for the Claude Code `/goal` defect where the dynamic stop hook repeatedly re-fires after the user accepts a BLOCKED outcome via AskUserQuestion. Reporter biz-dapav. Filed 2026-09-04. Labels: bug, has-repro, platform:windows, platform:vscode, area:hooks. Claude Code 2.1.260 · win32 · vscode.

Idle word is **caught**. Seeded state is slipping / #92242 (stop-hook re-fires on literal goal text after user accepted BLOCKED; resume reconverges; only `/goal clear` ends it). Never idle as locked / wiped / seated / channel / stranded / scratched / live / orphaned / set / scrapped / pure / scorched / cold / voided / banked / rewritten / keyed / strayed / scrubbed / pulled / enacted / withheld / masked / bled / fouled / careted / ringing.

This stub is documentation only. The living page at `projects/ratchet/index.html` scores probes in-browser. No npm. No secrets. No real hooks.

Given a probe-shaped payload `{ askUserBlockedAccepted, askUserBlockedAck, stopHookObservesBlocked, frozenLiteral, stopHookRefire, fireCount, resumeReconverge, clearOnly, noModelClear, policyConflict, terminalPreview, conditionSatisfiedTerminal, stopHookRests, goalText, log }`:

- **CAUGHT** if AskUserQuestion BLOCKED acceptance is acknowledged and the stop-hook rests (condition cleared or satisfied as terminal)
- **SLIPPING** if the stop-hook re-fires on the original literal goal text after the user accepted BLOCKED (#92242)
- **STOP-HOOK** if the `/goal` dynamic stop hook keeps firing the same automated feedback
- **ASK-USER-BLOCKED** if the user picked the option whose preview is terminal BLOCKED / stopped-looping
- **GOAL-LITERAL** if the verifier only sees the original frozen `/goal` condition text
- **RESUME-RECONVERGE** if `/goal resume` returns to the same justified terminal stop
- **CLEAR-ONLY** if only the user’s own `/goal clear` ends the loop
- **FIFTY-PLUS** if there are 50+ consecutive identical stop-hook re-fires
- **POLICY-CONFLICT** if a mid-task rule forbids the exact actions the goal required
- **TERMINAL-PREVIEW** if the chosen AskUserQuestion option preview described BLOCKED / stopped-looping
- **NO-MODEL-CLEAR** if the model has no tool to clear or acknowledge the goal
- **CONDITION-FROZEN-COUSIN** if citing #86434 (condition frozen at creation; verifier cannot see later cancellation) — cite only, not primary

This is a diagnostic scoring desk. Not an exploit. No payloads. No real credentials. Score whether the ratchet caught the BLOCKED tooth or the tooth already slipping.

Primary: [anthropics/claude-code#92242](https://github.com/anthropics/claude-code/issues/92242). Cousins (cite only, not primary): [#85594](https://github.com/anthropics/claude-code/issues/85594), [#86434](https://github.com/anthropics/claude-code/issues/86434), [#69201](https://github.com/anthropics/claude-code/issues/69201), [#92079](https://github.com/anthropics/claude-code/issues/92079), [#86438](https://github.com/anthropics/claude-code/issues/86438), [#89295](https://github.com/anthropics/claude-code/issues/89295).

Hypothesis only (NON-BINDING): Stop-hook verifier only sees the frozen literal `/goal` condition text and never observes AskUserQuestion terminal BLOCKED acceptance as satisfaction/cancellation. Discard if issue evidence disagrees. Do not claim unseen source.

NOT leftover Forme imposing-stone / Tabula wax tablet / floodplain oxbow / glacial relict / letterpress hellbox melt / bone-ash cupel / stone-pit oubliette / scheduled-task detent / clockwork escapement. Product name stays Ratchet.
