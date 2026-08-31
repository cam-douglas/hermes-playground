# Gnomon hook

Tiny observatory / sundial-terrace classifier for destroyed file-date signal on closed Claude Code transcripts. Closed session `.jsonl` files under `~/.claude/projects/<project>/` are observed with a **shared identical mtime** (114 files at one second) while content's last timestamped event can be days or weeks earlier. Appended records are timestamp-free metadata types (`last-prompt`, `mode`). The bulk-append trigger is a labeled observation, not a proven cause. Pipe a probe ticket (`sharedMtime` / `timestampFreeTail` / `lastPromptTail` / `modeTail` / `closedTranscript` / `dateSkew` / `silentWrong` / `retentionTrap` / `lsLtLie` / `mtimePreserved` / `timestampRequired` / `healthyDating`) and get **eclipsed** or **cast**.

Idle word is **cast**. Seeded state is eclipsed / #90954. Never idle as "gnomon" / "eclipsed" / "mtime" / "transcript" / "bulk" / "rewrite" / "shared" / "spoiled" / "banked" / "trammel" / "hunting" / "traced" / "soundpost" / "flong" / "bulla".

```bash
node projects/gnomon/hook/gnomon.mjs projects/gnomon/data/90954.json
node projects/gnomon/hook/gnomon.mjs projects/gnomon/data/cast.json
echo '{"sharedMtime":true,"timestampFreeTail":true}' | node projects/gnomon/hook/gnomon.mjs
node --test projects/gnomon/hook/gnomon.test.mjs
```

Empty stdin uses the idle **cast** ticket. Stdout is JSON: `verdict`, `chips[]`, `reasons[]`, `hold`, `alarm`, `idleWord`.

- **CAST** if mtime matches last timestamped event — the shadow is true
- **ECLIPSED** if 114 closed transcripts share one mtime, tails are timestamp-free, and dating is skewed (#90954)
- **SHARED-MTIME** if many files share one identical second
- **BULK-REWRITE** if many long-closed transcripts were appended to in one operation (observation)
- **TIMESTAMP-FREE** if `last-prompt` / `mode` carry no `timestamp` field
- **LAST-PROMPT** if the cluster tail is `last-prompt` ×76
- **MODE-TAIL** if the cluster tail is `mode` ×21
- **CLOSED-TRANSCRIPT** if writes land on already-closed session files
- **DATE-SKEW** if mtime minus last timestamped record is days or weeks
- **SILENT-WRONG** if nothing errors and the wrong set looks recent
- **RETENTION-TRAP** if retention keyed on mtime preserves stale and ages out recent
- **LS-LT-LIE** if `ls -lt` reports a burst on a day when no work happened

Primary: [anthropics/claude-code#90954](https://github.com/anthropics/claude-code/issues/90954). Same-class (cite, not primary): [#90932](https://github.com/anthropics/claude-code/issues/90932), [#90931](https://github.com/anthropics/claude-code/issues/90931), [#90955](https://github.com/anthropics/claude-code/issues/90955). Contrast: preserve mtime on closed transcripts OR require timestamp on appended records.

NOT Spoil / Trammel / Soundpost / Flong / Bulla / Trompe / Davy / Moviola / Clepsydra / Palimpsest.
