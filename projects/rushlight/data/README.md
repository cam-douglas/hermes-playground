# Rushlight fixtures

Diagnostic JSON only. No live Claude sessions. Encoded from #92784 issue facts: desktop-bundled worker TCC `kTCCServiceSystemPolicyAppData` grant stored session-scoped; same version 2.1.258 re-prompts every session. Score snuffed or admit tenured.

Idle word: **lit**. Seeded word: **snuffed**. HOLD: **lit** / **tenured**. ALARM: **snuffed** / **session-scoped-auth-invalid** / **same-version-reprompt** / **startup-appdata-enumeration** / **fda-desktop-ineffective** / **child-worker-identity** / **cousins** / **has-clear-repro**. Primary: [anthropics/claude-code#92784](https://github.com/anthropics/claude-code/issues/92784).

Fixtures record the published incident (macOS 26.5.2 build 25F84; Claude Code 2.1.258 desktop-bundled worker; tccd session-scoped invalid; 4 prompts / 2 days; kernel denials; FDA on Claude.app does NOT help). No live session. No secrets. No exploit payloads.

| File | Verdict | What it scores |
|---|---|---|
| `lit.json` | lit | Idle sconce. HOLD: TCC AppData grant persists across sessions of the same version. |
| `snuffed.json` | snuffed | Seeded #92784 path. ALARM: session-scoped grant evaporates. |
| `tenured.json` | tenured | Admit hold. Grant durable across sessions of the same version. |
| `92784.json` | snuffed | Primary fixture alias for #92784. |
| `session-scoped-auth-invalid.json` | session-scoped-auth-invalid | tccd AUTHREQ_CTX + Session scoped auth is invalid for client. |
| `same-version-reprompt.json` | same-version-reprompt | ~18 minutes later SAME 2.1.258; 4 prompts / 2 days. |
| `startup-appdata-enumeration.json` | startup-appdata-enumeration | Kernel denials: Mail / Safari / AddressBook / CallHistoryDB / … |
| `fda-desktop-ineffective.json` | fda-desktop-ineffective | FDA on `/Applications/Claude.app` does NOT help. |
| `child-worker-identity.json` | child-worker-identity | Desktop-bundled child worker; disclaimer helper; Q6L2SF6YDW. |
| `cousins.json` | cousins | Cite-only #63130 OPEN + five CLOSED. Primary stays #92784. |
| `has-clear-repro.json` | has-clear-repro | Issue labeled has repro. |
| `fixtures.json` | index | Row list for the sconce. |

Drop any file onto `projects/rushlight/index.html` or paste the JSON. The living page admits **lit** / idle sconce / #92784.

Probes are diagnostic reconstructions of the issue's published facts. This assay does not run Claude.
