# Derby fixtures

Diagnostic JSON only. No live Claude sessions. Encoded from #93197 issue facts: two concurrent sessions race on the npm-global install and delete the claude package (dangling symlink, command not found). Score scratched or admit locked.

Idle word: **locked**. Seeded word: **scratched**. Path word: **derby**. HOLD: **locked** / **skip-in-flight** / **hold**. ALARM: **scratched** / **derby** / **concurrent-sessions** / **shared-temp-retire** / **sighup-vs-ok** / **dangling-symlink** / **command-not-found** / **empty-package-dir** / **npm-debug-pair** / **has-repro** / **cousins** / **fixtures** / **chips** / **fingerprints** / **walk**. Primary: [anthropics/claude-code#93197](https://github.com/anthropics/claude-code/issues/93197).

Fixtures record the published incident only. No live session. No secrets. No exploit payloads. No network to Anthropic. No live Claude. No patch to anthropics/claude-code. Not Vizard/#93190 (Desktop `/plan` intercept). Not Dead Air/#93155 (silent 900s API stall). Not Scuttle/#93154 (remote SSH warm-up-failure `server.shutdown`). Not Stopcock/#93143 (Streamable HTTP MCP ~6min hard seat). Not Parergon/#93122 (stealth idle over `/btw` aside). Not Stereotype/#93108 (plugin update version-string-only freshness). Not Midden/#93081 (WorktreePool partial-remove GC remound). Not Guillotine/#92974 / Understudy / Mirage / Trompe / Homonym / Shibboleth / leftover woodworking / mm-slider. Different paradigm: packaging concurrency / global-install race.

| File | Verdict | What it scores |
|---|---|---|
| `locked.json` | locked | Idle booth. HOLD: one updater in flight; others skip. |
| `scratched.json` | scratched | Seeded #93197 path. ALARM: same temp retire; dangling symlink. |
| `93197.json` | scratched | Primary fixture alias for #93197. |
| `derby.json` | derby | Path word: packaging concurrency / global-install race. |
| `hold.json` | hold | HOLD alias: admit locked. |
| `skip-in-flight.json` | skip-in-flight | HOLD: lock or skip when another update is already in flight. |
| `walk.json` | walk | Published idle → concurrent → npm pair → retire → SIGHUP → empty → dangling → missing → scratched → derby. |
| `concurrent-sessions.json` | concurrent-sessions | Two sessions ~90 ms apart; different `CLAUDE_CONFIG_DIR`. |
| `shared-temp-retire.json` | shared-temp-retire | Both retire to `.claude-code-2DTsDk1V`. |
| `sighup-vs-ok.json` | sighup-vs-ok | SIGHUP / exit 1 vs exit 0 / info ok. |
| `dangling-symlink.json` | dangling-symlink | `/opt/homebrew/bin/claude` dangling. |
| `command-not-found.json` | command-not-found | `claude: command not found` until manual reinstall. |
| `empty-package-dir.json` | empty-package-dir | `/opt/homebrew/lib/node_modules/@anthropic-ai/` empty. |
| `npm-debug-pair.json` | npm-debug-pair | `14_02_34_904Z` and `14_02_34_992Z` debug logs. |
| `has-repro.json` | has-repro | 2.1.266 + npm 11.12.1 + Node 25.9.0 + Darwin 25.6.0 walk. |
| `cousins.json` | cousins | Cite-only #88091 #90233 #86496 #86941 #84081 #84224 #85154 #996. |
| `fixtures.json` | fixtures | Row list for the derby booth. |
| `chips.json` | chips | Chip list matching verdicts. |
| `fingerprints.json` | fingerprints | Fingerprint samples for locked vs scratched. |

Clip any file onto `projects/derby/index.html`. Buttons load the seeded path. The living page admits **locked** / idle booth / #93197.

The booth reconstructs the reporter’s concurrent npm-global retire walk from the published #93197 body. This starting-gate booth does not run Claude.
