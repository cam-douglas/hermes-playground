# Greenroom fixtures

Diagnostic JSON only. No live Claude sessions. Encoded from #92988 issue facts: Desktop Code tab has no way to queue a message until the turn fully ends. Score steered or admit held.

Idle word: **held**. Seeded word: **steered**. Path word: **greenroomed**. HOLD: **held** / **hold**. ALARM: **steered** / **greenroomed** / **enter-midturn** / **ctrl-enter-interrupt** / **queue-for-later-unreachable** / **chat-queueSubmit-cli-only** / **send-button-trio** / **has-repro** / **cousins** / **fixtures** / **chips** / **fingerprints** / **walk**. Primary: [anthropics/claude-code#92988](https://github.com/anthropics/claude-code/issues/92988).

Fixtures record the published incident only. No live session. No secrets. No exploit payloads. No network to Anthropic. No live Claude. No patch to anthropics/claude-code. Not Guillotine/#92974 (background-mode Deny-only). Not Entresol/#93010 (parent CLAUDE.md skipped for worktree-of-that-repo). Not Hallmark/#93021 (resume loses `[1m]`). Not Flashpan/#93015 (`lastRunAt` without session). Not Secateurs/#92979 (Read silent partial). Not Palinode/#92998 (MEMORY.md bottom truncation). Not Ferrule/#92968 / Interlock / Homestead / Shibboleth. Not leftover woodworking / mm-slider.

| File | Verdict | What it scores |
|---|---|---|
| `held.json` | held | Idle booth. HOLD: cue waits until the entire turn ends. |
| `steered.json` | steered | Seeded #92988 path. ALARM: mid-turn inject / Interrupt; Queue for later unreachable. |
| `92988.json` | steered | Primary fixture alias for #92988. |
| `greenroomed.json` | greenroomed | Path word: the booth cannot hold a cue until the act ends. |
| `hold.json` | hold | HOLD alias: cue held. |
| `walk.json` | walk | Published idle → Enter mid-turn → Interrupt → trio → Queue for later unreachable → CLI-only → no settings → greenroomed. |
| `enter-midturn.json` | enter-midturn | Enter injects at the next tool-call boundary WITHIN the same turn. |
| `ctrl-enter-interrupt.json` | ctrl-enter-interrupt | Ctrl+Enter is Interrupt — opposite of waiting. |
| `queue-for-later-unreachable.json` | queue-for-later-unreachable | Bundle string 8RUKIaTN4d never appears. |
| `chat-queueSubmit-cli-only.json` | chat-queueSubmit-cli-only | CLI has chat:queueSubmit; Desktop has no equivalent. |
| `send-button-trio.json` | send-button-trio | Send / Interrupt / Send in a forked session only. |
| `has-repro.json` | has-repro | Desktop 1.49585.0 Windows 11 Code tab; bundled CLI 2.1.260. |
| `cousins.json` | cousins | Cite-only #77724 #71726. |
| `fixtures.json` | fixtures | Row list for the greenroom booth. |
| `chips.json` | chips | Chip list matching verdicts. |
| `fingerprints.json` | fingerprints | Fingerprint samples for held vs steered. |

Clip any file onto `projects/greenroom/index.html`. Buttons load the seeded path. The living page admits **held** / idle booth / #92988.

The send-button trio reconstructs the reporter’s Code tab tooltip from the published #92988 body. This green room does not run Claude.
