# Frizzen fixtures

Diagnostic JSON only. No live Claude sessions. Encoded from #92353 issue facts: a `UserPromptSubmit` hook in `.claude/settings.json` is correctly listed by `/hooks` and the script works when invoked manually with the same JSON payload, but it is **never invoked** when a real prompt is typed/submitted interactively in Git Bash (MINGW64) CLI on Windows, Claude Code **v2.1.261**. The model receives the raw prompt unmodified (verified in session `.jsonl`). The #17277 warm-up first-message workaround does **not** help. A separate `PreToolUse` Bash hook and `permissions.deny` rules in the same settings **do** work.

Idle word: **unstruck**. Seeded word: **leaked**. Contrast: **snapped** / **manual-fire**. Primary: [anthropics/claude-code#92353](https://github.com/anthropics/claude-code/issues/92353). Seed primary as leaked / hook never invoked / secret reached the model.

The canary string `sk-ant-api03-abcdefghijklmnop1234567890` is the published issue repro example, not a live credential.

| File | Verdict | What it scores |
|---|---|---|
| `unstruck.json` | unstruck | Idle frizzen fence. Listed by `/hooks`; assembled on the lock; never snaps on a real pull. |
| `leaked.json` | leaked | Seeded #92353. Secret prompt reached the model unmodified; no hook-block stderr. |
| `92353.json` | leaked | Primary fixture alias for #92353. Interactive Git Bash submit; jsonl user+assistant. |
| `repro.json` | leaked | Published repro: `/hooks` lists it; manual node fires; interactive submit never invokes. |
| `snapped.json` | snapped | Contrast hold. Hook invoked; exit 2 blocked; stderr shown; no model turn. |
| `manual-fire.json` | manual-fire | Contrast hold. Script works when run by hand with the same payload. |
| `warmup-still-dark.json` | leaked | #17277 warm-up then secret still never fires. |
| `hooks-listed.json` | unstruck | `/hooks` false confidence: listed under Project Settings, never invoked. |
| `pretool-works.json` | unstruck | Same settings: PreToolUse Bash hook *did* fire (desktop Code tab). |
| `deny-works.json` | unstruck | Same settings: `permissions.deny` on `.env` / `~/.aws/**` works. |
| `remediation-invoke.json` | snapped | Expected fix: invoke UserPromptSubmit on every interactive submit. |
| `remediation-block.json` | snapped | Expected fix: exit 2 blocks; stderr shown; no model turn; no jsonl assistant. |
| `cousins.json` | stay-off | Cite-only cousins #17277 #7873 #31114 + Windows stdin cousins. |
| `fixtures.json` | index | Row list for the frizzen desk. |

Drop any file onto `projects/frizzen/index.html` or paste the JSON. The living page seeds **leaked** / hook never invoked.
