# Eidolon fixtures

Diagnostic JSON only. No live Claude sessions. Encoded from #92601 issue facts: `security-guidance` hook fails with ENOENT in `local-agent-mode-sessions` staging, causing an infinite retry/notification loop framed as "Background security review found issues". Score haunted or admit staged.

Idle word: **haunted**. Seeded word: **staged**. HOLD: **staged**. ALARM: **haunted** / **enoent-staging** / **infinite-retry** / **synthetic-security-notification** / **restart-uncleared** / **real-cache-intact** / **manifest-lists-plugin** / **disable-plugin-stops-loop** / **multi-session-flood** / **cousins** / **has-clear-repro**. Primary: [anthropics/claude-code#92601](https://github.com/anthropics/claude-code/issues/92601).

Fixtures record the published error path, cache-vs-staging contrast, restart fact, and disable-plugin workaround. No live session. No secrets.

| File | Verdict | What it scores |
|---|---|---|
| `haunted.json` | haunted | Idle bay. Staged hook path ENOENT; fake security-notice loop. |
| `staged.json` | staged | Seeded hold. Per-session rpm staging complete; hook runs once. |
| `92601.json` | haunted | Primary fixture alias for #92601. |
| `enoent-staging.json` | enoent-staging | Python can't open staged `security_reminder_hook.py`. |
| `infinite-retry.json` | infinite-retry | Failure retries indefinitely; Idle. / (no change); 45+ repeats. |
| `synthetic-security-notification.json` | synthetic-security-notification | `<task-notification>` "Background security review found issues". |
| `restart-uncleared.json` | restart-uncleared | Three app restarts; rpm/ regenerated; loop resumes. |
| `real-cache-intact.json` | real-cache-intact | Real 2.0.7 cache hook exists and is well-formed. |
| `manifest-lists-plugin.json` | manifest-lists-plugin | Staged manifest lists the plugin id; copy sometimes existed. |
| `disable-plugin-stops-loop.json` | disable-plugin-stops-loop | Disable/uninstall + restart stops the loop. |
| `multi-session-flood.json` | multi-session-flood | Concurrent sessions independently stuck. |
| `cousins.json` | cousins | Cite-only #92563 / #90329 / #74715. Primary stays #92601. |
| `has-clear-repro.json` | has-clear-repro | Labeled has repro; exact ENOENT; disable plugin stops it. |
| `fixtures.json` | index | Row list for the eidolon bay. |

Drop any file onto `projects/eidolon/index.html` or paste the JSON. The living page admits **haunted** / staged-hook ENOENT / #92601.

Probes are diagnostic reconstructions of the issue's published facts. This assay does not run Claude.
