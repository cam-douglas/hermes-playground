# Fulcrum fixtures

Diagnostic JSON only. No live Claude sessions. Encoded from #92377 issue facts: on Claude Code 2.1.261, `claude --name <name>` no longer sets the name a session registers for cross-session messaging. The session's `~/.claude/sessions/<pid>.json` entry is written with `nameSource: "auto"` and a `name` that is an AI-generated title copied from a different, unrelated session, about 100 ms after launch and before any prompt is sent. The transcript records the `--name` value as a `custom-title` line, but the peer registry, `ListAgents`, and the prompt-bar title all show the foreign generated title instead. Score the naming lever or admit the registry already collided.

Idle word: **inherited**. Seeded word: **collided**. Contrast: **name-applied** / **registry-locked** / **dedup-user-name** / **foreign-title-blocked**. Custom vs auto: **custom-title** / **auto**. Primary: [anthropics/claude-code#92377](https://github.com/anthropics/claude-code/issues/92377). Seed primary as collided / inherited fulcrum / `--name` discarded / foreign auto title.

| File | Verdict | What it scores |
|---|---|---|
| `inherited.json` | inherited | Idle naming-lever fence. `--name` is a custom-title line; registry inherits a foreign auto title ~100 ms after launch. |
| `collided.json` | collided | Seeded #92377. Multiple live sessions share one generated name; bare SendMessage is ambiguous. |
| `92377.json` | collided | Primary fixture alias for #92377. |
| `repro.json` | collided | Published repro: three scratch `--name dup4cc4` panes inherit one foreign title with nameSource auto. |
| `registry-entry.json` | inherited | `--name Hermit` registry: name "Artifact skill trigger instruction passing", nameSource auto, nameSince ~100 ms after start. |
| `transcript-lines.json` | custom-title | Transcript records customTitle Hermit plus ai-title/agent-name of the foreign title. |
| `list-agents.json` | collided | ListAgents rows share the generated name; distinguishable only by [ref] and tmux address. |
| `send-message.json` | collided | SendMessage to bare name is ambiguous; `name [ref]` delivers; after /rename old `name [ref]` is unreachable. |
| `name-applied.json` | name-applied | Contrast hold. `--name` sets the session name and replaces any generated title. |
| `registry-locked.json` | registry-locked | Contrast hold. Peer registry, ListAgents, and prompt-bar use the user-set name. |
| `dedup-user-name.json` | dedup-user-name | Contrast hold. If a collision must happen, dedup rename to a two-word variant applies for user-set names. |
| `foreign-title-blocked.json` | foreign-title-blocked | Contrast hold. A fresh session never registers under a title generated for a different session. |
| `custom-title.json` | custom-title | Score the custom-title side of the lever: transcript `--name` is present. |
| `auto.json` | auto | Score the auto-title side: nameSource auto + foreign generated title on the registry. |
| `cousins.json` | stay-off | Cite-only cousins #91054 #88845 #86736 #86531 #81899. |
| `fixtures.json` | index | Row list for the balance-beam / pivot / naming-lever lab. |

Drop any file onto `projects/fulcrum/index.html` or paste the JSON. The living page seeds **collided** / `--name` discarded / foreign auto peer title / nameSource auto.
