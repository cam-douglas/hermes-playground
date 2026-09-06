# Demurrage fixtures

Diagnostic JSON only. No live Claude sessions. No real remote daemon. Encoded from #92548 issue facts: on a self-hosted Linux remote daemon, Claude Code accumulates one ~300 MB `ccd-cli` process per chat and never frees them. Score accruing or admit cleared.

Idle word: **accruing**. Seeded word: **cleared**. HOLD: **cleared**. ALARM: **accruing** / **duplicate-resume** / **daemon-orphan** / **deleted-binary** / **no-lifecycle-flags** / **outage-census** / **cousins**. Primary: [anthropics/claude-code#92548](https://github.com/anthropics/claude-code/issues/92548).

Fixtures record the published process table, daemon sockets, deleted-binary hulks, flag list, and two hard outages. No live daemon. No secrets.

| File | Verdict | What it scores |
|---|---|---|
| `92548.json` | accruing | Primary fixture alias for #92548. Idle overstay ledger. |
| `cleared.json` | cleared | Seeded hold. Berth released or reused. |
| `duplicate-resume.json` | duplicate-resume | Same `--resume` UUID twice under socket `5b2efa6a`, ~48h apart. |
| `daemon-orphan.json` | daemon-orphan | `85fbdb5e` 11d up / 4d since last client; reparented to init. |
| `deleted-binary.json` | deleted-binary | `2.1.247` x2 still executing after `-cli-keep` prune. |
| `no-lifecycle-flags.json` | no-lifecycle-flags | No idle timeout / max-session / eviction; only `-stop`. |
| `outage-census.json` | outage-census | 2026-08-31 8.1 GB / 2026-09-01 ~15 GB. |
| `cousins.json` | cousins | Cite-only #92059 #1935 #49790. |
| `fixtures.json` | index | Row list for the demurrage ledger. |

Drop any file onto `projects/demurrage/index.html` or paste the JSON. The living page admits **accruing** / remote-daemon overstay / #92548.

Repro in the issue is `ps` of `ccd-cli` after open / close / reopen. This assay does not talk to a live daemon.
