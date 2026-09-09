# Scuttle fixtures

Diagnostic JSON only. No live Claude sessions. Encoded from #93154 issue facts: remote SSH daemon destroys all running sessions on transient reconnect instead of reattaching. Score scuttled or admit moored.

Idle word: **moored**. Seeded word: **scuttled**. Path word: **scuttle**. HOLD: **moored** / **reattach** / **hold**. ALARM: **scuttled** / **scuttle** / **server-shutdown** / **bridge-startup-timeout** / **channel-closed-no-socket** / **sigkill-children** / **warm-up-failure** / **no-liveness-probe** / **takeover-path-exists** / **has-repro** / **cousins** / **fixtures** / **chips** / **fingerprints** / **walk**. Primary: [anthropics/claude-code#93154](https://github.com/anthropics/claude-code/issues/93154).

Fixtures record the published incident only. No live session. No secrets. No exploit payloads. No network to Anthropic. No live Claude. No patch to anthropics/claude-code. Not Stopcock/#93143 (Streamable HTTP MCP ~6min hard seat). Not Parergon/#93122 (stealth idle over `/btw` aside). Not Stereotype/#93108 (plugin update version-string-only freshness). Not Midden/#93081 (WorktreePool partial-remove GC remound). Not Guillotine/#92974 / Clepsydra / Fusee / Procrustes / Reed / Quench / Wildcat/#92399 / Snatch / Deadman / leftover woodworking / mm-slider. Different paradigm: warm-up-failure `server.shutdown` SIGKILLs every tracked remote child instead of reattaching to a still-healthy daemon.

| File | Verdict | What it scores |
|---|---|---|
| `moored.json` | moored | Idle booth. HOLD: reattach to a still-healthy daemon. |
| `scuttled.json` | scuttled | Seeded #93154 path. ALARM: shutdown SIGKILLs children. |
| `93154.json` | scuttled | Primary fixture alias for #93154. |
| `scuttle.json` | scuttle | Path word: a brief blip that SIGKILLs is a scuttle. |
| `hold.json` | hold | HOLD alias: admit moored. |
| `reattach.json` | reattach | HOLD: ordinary reconnect already reuses a running daemon. |
| `walk.json` | walk | Published idle → channel drop → warm-up fail → no probe → shutdown → SIGKILL → scuttled → scuttle. |
| `server-shutdown.json` | server-shutdown | `RemoteServerController` issues `server --stop` / `server.shutdown`. |
| `bridge-startup-timeout.json` | bridge-startup-timeout | Warm-up fails `bridge_startup_timeout`. |
| `channel-closed-no-socket.json` | channel-closed-no-socket | Client `channel_closed_no_socket` after a brief SSH drop. |
| `sigkill-children.json` | sigkill-children | SIGKILL 42 process groups / 10 live `ccd-cli`. |
| `warm-up-failure.json` | warm-up-failure | Destructive stop is specifically the warm-up failure branch. |
| `no-liveness-probe.json` | no-liveness-probe | No `server.ping` / `daemon.lock` check before destroy. |
| `takeover-path-exists.json` | takeover-path-exists | Same binary already has SIGTERM-first takeover. |
| `has-repro.json` | has-repro | remote `claude-ssh 4534d864…` + `ccd-cli 2.1.260` walk. |
| `cousins.json` | cousins | Cite-only #85567 #92687 #49790 #84468 #50982 #34255. |
| `fixtures.json` | fixtures | Row list for the scuttle booth. |
| `chips.json` | chips | Chip list matching verdicts. |
| `fingerprints.json` | fingerprints | Fingerprint samples for moored vs scuttled. |

Clip any file onto `projects/scuttle/index.html`. Buttons load the seeded path. The living page admits **moored** / idle booth / #93154.

The booth reconstructs the reporter’s remote-SSH reconnect walk from the published #93154 body. This shipyard booth does not run Claude.
