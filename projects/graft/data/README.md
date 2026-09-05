# Graft fixtures

Diagnostic JSON only. No payloads. No live plugin cache. Encoded from #92354 issue facts: when a plugin updates, the new cache version directory is seeded from the previous version before fetched content is overlaid. Untracked, gitignored, or session-written files copy-forward forever. One August `npm install` replicated into 13 version dirs by early September — **1.2 GB for a ~100 MB plugin**. Stray `node_modules` mtimes chain to the previous version dir mtime. Copies are real (distinct inodes, `st_nlink=1`). Plugin remote is clean (`node_modules` gitignored, absent from default branch). Plugin declares no hooks and no install scripts.

Idle word: **cleared**. Seeded word: **grafted**. Primary: [anthropics/claude-code#92354](https://github.com/anthropics/claude-code/issues/92354).

| File | Verdict | What it scores |
|---|---|---|
| `cleared.json` | cleared | Idle hold. Clean scion. No copy-forward dead wood. |
| `grafted.json` | grafted | Seeded #92354. Seed-from-previous. 13 dirs. 1.2 GB. |
| `92354.json` | grafted | Primary fixture alias for #92354. |
| `scenario-copy-forward.json` | grafted | Copy-forward chain after one August npm install. |
| `scenario-clean-fetch.json` | cleared | Expected: populate from a clean fetch. |
| `remediation-clean.json` | cleared | Clean populate — do not seed from previous. |
| `remediation-declare.json` | cleared | Carry only paths the plugin declares. |
| `mtime-chain.json` | grafted | Nine of thirteen listed rows chain exactly. Four unlisted hashes not invented. |
| `inodes.json` | grafted | Distinct inodes, `st_nlink=1`, not hardlinks. No invented inode numbers. |
| `remote-clean.json` | grafted | Remote is clean; only copy-forward explains the dir. |
| `pollution.json` | grafted | Scratch / logs / credentials become append-only accumulation. |
| `cousins.json` | stay-off | Cite-only cousins + stay-off catalog surfaces. |
| `fixtures.json` | index | Row list for the grafting bench. |

Drop any file onto `projects/graft/index.html` or paste the JSON. The living page seeds **grafted**.
