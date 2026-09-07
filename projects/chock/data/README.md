# Chock fixtures

Diagnostic JSON only. No live Claude sessions. Encoded from #92582 issue facts: `blockReadsOutsideWorkingDirectories` seats user-settings additionalDirectories [A, B] into the read fence but ignores trusted project/local [C, D] even though the environment header lists all four. Score barred or admit admitted.

Idle word: **barred**. Seeded word: **admitted**. HOLD: **admitted**. ALARM: **barred** / **user-only-fence** / **header-lists-all** / **project-ignored** / **local-ignored** / **sandbox-allowWithinDeny** / **add-dir-works** / **unattended-blocked** / **cousins** / **has-clear-repro**. Primary: [anthropics/claude-code#92582](https://github.com/anthropics/claude-code/issues/92582).

Fixtures record the published incident (user vs project vs local layers, header vs fence, sandbox allowWithinDeny, /add-dir escape). No live session. No secrets. No exploit payloads.

| File | Verdict | What it scores |
|---|---|---|
| `barred.json` | barred | Idle yard. Header lists C/D; Read and sandbox still refuse. |
| `admitted.json` | admitted | Seeded hold. Project + local dirs merge into the fence once trust is accepted. |
| `92582.json` | barred | Primary fixture alias for #92582. |
| `user-only-fence.json` | user-only-fence | Read/Grep/Glob allow only cwd, A, B. |
| `header-lists-all.json` | header-lists-all | Environment header lists A, B, C, D. |
| `project-ignored.json` | project-ignored | Trusted project `.claude/settings.json` [C, D] ignored. |
| `local-ignored.json` | local-ignored | Untracked `.claude/settings.local.json` [C, D] ignored. |
| `sandbox-allowWithinDeny.json` | sandbox-allowWithinDeny | Bash sandbox allowWithinDeny is cwd, A, B only. |
| `add-dir-works.json` | add-dir-works | `/add-dir C` in the same session works. |
| `unattended-blocked.json` | unattended-blocked | Scheduled sessions cannot use project dirs. |
| `cousins.json` | cousins | Cite-only #91848 / #83031 / #92615. Primary stays #92582. |
| `has-clear-repro.json` | has-clear-repro | Issue labeled has repro. |
| `fixtures.json` | index | Row list for the chock yard. |

Drop any file onto `projects/chock/index.html` or paste the JSON. The living page admits **barred** / user-only fence + header-lists-all / #92582.

Probes are diagnostic reconstructions of the issue's published facts. This assay does not run Claude.
