# Gnomon hook

Tiny observatory / sundial-terrace classifier for destroyed file-date signal on closed Claude Code transcripts. Closed session `.jsonl` files under `~/.claude/projects/<project>/` are observed with a **shared identical mtime** (114 files at one second) while content's last timestamped event can be days or weeks earlier. Appended records are timestamp-free metadata types (`last-prompt`, `mode`). The bulk-append trigger is a labeled observation, not a proven cause. Pipe a probe ticket (`sharedMtime` / `timestampFreeTail` / `lastPromptTail` / `modeTail` / `closedTranscript` / `dateSkew` / `silentWrong` / `retentionTrap` / `lsLtLie` / `mtimePreserved` / `timestampRequired` / `healthyDating`) and get **collapsed** or **pointed**.

Idle word is **pointed**. Seeded state is collapsed / #90954. Never idle as "gnomon" / "collapsed" / "mtime" / "transcript" / "bulk" / "cast" / "eclipsed" / "spoiled" / "banked" / "rewrite" / "shared" / "trammel" / "hunting" / "traced".

```bash
node projects/gnomon/hook/gnomon.mjs projects/gnomon/data/90954.json
node projects/gnomon/hook/gnomon.mjs projects/gnomon/data/pointed.json
echo '{"sharedMtime":true,"timestampFreeTail":true}' | node projects/gnomon/hook/gnomon.mjs
node --test projects/gnomon/hook/gnomon.test.mjs
```

Empty stdin uses the idle **pointed** ticket. Stdout is JSON: `verdict`, `chips[]`, `reasons[]`, `hold`, `alarm`, `idleWord`.

- **POINTED** if mtime tracks last timestamped event — the shadow is true
- **COLLAPSED** if 114 closed transcripts share one mtime, tails are untimed, and dating is skewed (#90954)
- **BULK-MTIME** if many long-closed transcripts were rewritten in one operation (observation)
- **SHARED-SECOND** if many files share one identical second
- **CLOSED-TRANSCRIPT** if writes land on already-closed session files
- **DATE-SIGNAL** if mtime no longer dates the session
- **UNTIMED-TAIL** if `last-prompt` / `mode` carry no `timestamp`
- **LAST-PROMPT** if the cluster tail is `last-prompt` ×76
- **SILENT-WRONG** if nothing errors and the wrong set looks recent
- **RETENTION-LIE** if retention keyed on mtime preserves stale and ages out recent
- **CLUSTER-114** if the largest pile is 114 files at one second
- **MTIME-VS-CONTENT** if mtime and last timestamped event disagree
- **ARCHIVE-CLOCK** if `ls -lt` reports a burst on a day when no work happened
- **NO-TIMESTAMP** if appended records carry no `timestamp` field

Primary: [anthropics/claude-code#90954](https://github.com/anthropics/claude-code/issues/90954). Same-class (mtime date-signal family): [#87900](https://github.com/anthropics/claude-code/issues/87900), [#81803](https://github.com/anthropics/claude-code/issues/81803), [#72746](https://github.com/anthropics/claude-code/issues/72746), [#68929](https://github.com/anthropics/claude-code/issues/68929). Contrast: preserve mtime on closed transcripts OR require timestamp on appended records.

NOT Spoil / Trammel / Soundpost / Flong / Bulla / Trompe / Davy / Moviola / Clepsydra / Palimpsest.
