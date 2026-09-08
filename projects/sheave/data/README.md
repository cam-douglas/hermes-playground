# Sheave fixtures

Diagnostic JSON only. No live Claude sessions. Encoded from #92827 issue facts: a mid-turn queue sheave should pay any non-command string at the next tool boundary (`absorbed_mid_turn`); a Finder-dragged `/Users/…` path fouls because a leading `/` is mistaken for a slash command (`startsWith("/") && !skipSlashCommands`), so the file sits queued for the whole turn (21+ min through AskUserQuestion/plan/exec) while the model asks for that file. The same text typed while idle reaches the model as an ordinary prompt. Inverse of Hangfire (where `/compact` is demoted to prose). Score fouled or admit paid.

Idle word: **paid**. Path word: **fouled**. Seeded held-until-end: **hitched**. HOLD: **paid**. ALARM: **fouled** / **hitched** / **slash-false-positive** / **plain-absorbed** / **enqueue-timeline** / **before-after**. Primary: [anthropics/claude-code#92827](https://github.com/anthropics/claude-code/issues/92827).

Fixtures record the published incident only. No live session. No secrets. No exploit payloads. No network to Anthropic. No live Claude. Paths are published `/Users/…` shapes, not a reporter home directory.

| File | Verdict | What it scores |
|---|---|---|
| `paid.json` | paid | Idle sheave. HOLD: any mid-turn queue line pays at the next tool boundary. |
| `fouled.json` | fouled | Seeded #92827 path. ALARM: leading `/Users/…` fouls as a false slash command. |
| `92827.json` | fouled | Primary fixture alias for #92827. |
| `hitched.json` | hitched | Seeded held-until-end: path sits queued 21+ min; never `absorbed_mid_turn`. |
| `slash-false-positive.json` | slash-false-positive | Filter `startsWith("/") && !skipSlashCommands` hitch on a file path. |
| `plain-absorbed.json` | plain-absorbed | Control: "look at the message I sent" absorbs in ~30s. |
| `enqueue-timeline.json` | enqueue-timeline | 09:48 enqueue → 09:50 AskUserQuestion → 10:09 popAll. |
| `before-after.json` | before-after | Idle prompt pays; mid-turn `/Users/…` hitch waits for turn end. |
| `fixtures.json` | index | Row list for the deck sheave. |

Drop any file onto `projects/sheave/index.html`. Buttons load the seeded path. The living page admits **paid** / idle sheave / #92827.

Probes are diagnostic reconstructions of the issue's published facts. This assay does not run Claude.
