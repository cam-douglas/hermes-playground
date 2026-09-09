# Vizard fixtures

Diagnostic JSON only. No live Claude sessions. Encoded from #93190 issue facts: Desktop app resolves `/plan` to built-in plan mode; CLI correctly resolves it to the project's `/plan` command. Score vizard or admit unmasked.

Idle word: **unmasked**. Seeded word: **vizard**. Path word: **precedence**. HOLD: **unmasked** / **project-command** / **hold**. ALARM: **vizard** / **precedence** / **built-in-plan-mode** / **client-side-intercept** / **remote-control-desktop** / **arguments-unsent** / **no-round-trip** / **read-only-wrong-mode** / **companion-work** / **has-repro** / **cousins** / **fixtures** / **chips** / **fingerprints** / **walk**. Primary: [anthropics/claude-code#93190](https://github.com/anthropics/claude-code/issues/93190).

Fixtures record the published incident only. No live session. No secrets. No exploit payloads. No network to Anthropic. No live Claude. No patch to anthropics/claude-code. Not Dead Air/#93155 (silent 900s API stall). Not Scuttle/#93154 (remote SSH warm-up-failure `server.shutdown`). Not Stopcock/#93143 (Streamable HTTP MCP ~6min hard seat). Not Parergon/#93122 (stealth idle over `/btw` aside). Not Stereotype/#93108 (plugin update version-string-only freshness). Not Midden/#93081 (WorktreePool partial-remove GC remound). Not Guillotine/#92974 / Understudy / Mirage / Trompe / Homonym / Shibboleth / leftover woodworking / mm-slider. Different paradigm: Desktop client-side `/plan` intercept vs CLI project-command precedence.

| File | Verdict | What it scores |
|---|---|---|
| `unmasked.json` | unmasked | Idle booth. HOLD: CLI-style precedence; project `/plan` wins. |
| `vizard.json` | vizard | Seeded #93190 path. ALARM: built-in plan mode; `/plan` stripped; args unsent. |
| `93190.json` | vizard | Primary fixture alias for #93190. |
| `precedence.json` | precedence | Path word: project commands must outrank built-ins on every surface. |
| `hold.json` | hold | HOLD alias: admit unmasked. |
| `project-command.json` | project-command | HOLD: `.claude/commands/plan.md` invokes a planning skill. |
| `walk.json` | walk | Published idle → project-command → CLI → Remote Control → intercept → vizard → precedence. |
| `built-in-plan-mode.json` | built-in-plan-mode | Permission mode flips to Plan. |
| `client-side-intercept.json` | client-side-intercept | Intercept appears entirely client-side in Desktop. |
| `remote-control-desktop.json` | remote-control-desktop | `claude --remote-control --spawn worktree`. |
| `arguments-unsent.json` | arguments-unsent | `foo bar` left unsent in composer. |
| `no-round-trip.json` | no-round-trip | Server-side CLI resolution never runs. |
| `read-only-wrong-mode.json` | read-only-wrong-mode | Plan mode is read-only; project `/plan` may write. |
| `companion-work.json` | companion-work | Companion `/work <slug>` executes a plan. |
| `has-repro.json` | has-repro | CLI 2.1.266 + Desktop 1.49585.0 (41ad1d) walk. |
| `cousins.json` | cousins | Cite-only #82676 #89398 #85654 #68252 #68102 #29156 #28379 #92138. |
| `fixtures.json` | fixtures | Row list for the vizard booth. |
| `chips.json` | chips | Chip list matching verdicts. |
| `fingerprints.json` | fingerprints | Fingerprint samples for unmasked vs vizard. |

Clip any file onto `projects/vizard/index.html`. Buttons load the seeded path. The living page admits **unmasked** / idle booth / #93190.

The booth reconstructs the reporter’s Desktop `/plan` intercept walk from the published #93190 body. This atelier booth does not run Claude.
