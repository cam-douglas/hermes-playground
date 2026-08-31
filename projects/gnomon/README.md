# Gnomon

An **observatory / sundial terrace** — slate night sky, brass dial, moon-silver, umber stone, chalk meridian lines; Libre Baskerville + IBM Plex Sans + Space Mono — for a real Claude Code defect: **closed session transcripts under `~/.claude/projects/<project>/` are observed with a shared identical mtime (114 files at one second) while content's last timestamped event can be days or weeks earlier**. Appended records are timestamp-free metadata types (`last-prompt`, `mode`). `ls -lt`, retention, recent-session pickers, and cleanup all operate on the wrong set. Silent-wrong-output: nothing errors, and the wrong answer looks exactly like the right one.

Primary:

- [anthropics/claude-code#90954](https://github.com/anthropics/claude-code/issues/90954) (OPEN, has repro, filed 2026-08-31T10:32:53Z by somarakis). Title: [BUG] Closed session transcripts are bulk-rewritten with a shared mtime, destroying file-date signal (114 files at one identical second). Labels: bug, has repro, platform:macos, area:core. Claude Code **2.1.247** (`CLAUDE_CODE_ENTRYPOINT=claude-desktop`). macOS Darwin 25.5.0 Apple Silicon. Latest published at filing: 2.1.251.

A shared mtime is not a hold. Score the gnomon or admit **cast**.

Idle word: **cast**. Seeded state: **eclipsed** / #90954 — 114 files at epoch `1787422837` (2026-08-22T21:20:37 local); median mtime-minus-last-event 17 days; tail `last-prompt` ×76, `mode` ×21. Never idle as "gnomon" / "eclipsed" / "mtime" / "transcript" / "bulk" / "rewrite" / "shared" / "spoiled" / "banked" / "trammel" / "hunting" / "traced" / "soundpost" / "flong" / "bulla".

The bulk-append-of-timestamp-free-metadata trigger is a **labeled observation, not a proven cause**. Observable facts from the issue: (1) many long-closed transcripts were appended to in one bulk operation, (2) the appended records are timestamp-free metadata types, (3) mtime moved and content did not.

- **cast** = hold: mtime matches last timestamped event; shadow cast matches last event; healthy dating
- **eclipsed** = #90954 primary — shared identical mtime on closed transcripts; timestamp-free tail; median 17-day skew
- **shared-mtime** = 114 files at one identical second
- **bulk-rewrite** = many long-closed transcripts appended to in one operation (observation)
- **timestamp-free** = `last-prompt` and `mode` carry no `timestamp` field
- **last-prompt** = tail type `last-prompt` ×76 of the cluster
- **mode-tail** = tail type `mode` ×21 of the cluster
- **closed-transcript** = writes land on already-closed session files
- **date-skew** = mtime minus last timestamped record: min 3 / median 17 / max 47 days
- **silent-wrong** = nothing errors; the wrong answer looks like the right one
- **retention-trap** = retention keyed on mtime preserves stale sessions and can age out recent ones
- **ls-lt-lie** = `ls -lt` reports a burst on a day when no work happened

Verdicts: eclipsed, cast, shared-mtime, bulk-rewrite, timestamp-free, last-prompt, mode-tail, closed-transcript, date-skew, silent-wrong, retention-trap, ls-lt-lie.

## Why not a clone

This is specifically: **CLOSED TRANSCRIPTS SHARING ONE IDENTICAL MTIME WHILE CONTENT'S LAST TIMESTAMPED EVENT IS DAYS OR WEEKS EARLIER**. File-date signal is destroyed. The trigger is not asserted.

NOT **Spoil** ([#90943](https://github.com/anthropics/claude-code/issues/90943)) — stale private `GIT_INDEX_FILE`.
NOT **Trammel** ([#90936](https://github.com/anthropics/claude-code/issues/90936)) — VS Code focus ping-pong.
NOT **Soundpost** ([#90926](https://github.com/anthropics/claude-code/issues/90926)) — CLI-resolved LSP vs Desktop-deaf.
NOT **Flong** ([#90916](https://github.com/anthropics/claude-code/issues/90916)) — torn Git Bash snapshot.
NOT **Bulla** / **Trompe** / **Davy** / **Moviola**.
NOT **Clepsydra** / [#90930](https://github.com/anthropics/claude-code/issues/90930) — do not ship.
NOT **Palimpsest** (scraped manuscript — different), **Almanac**, **Datum**, **Tally**, **Cenotaph**.
NOT **Assay** / **Wicket** / **Sigil** / **Stencil** / **Suture** / **Blot** / **Coda** / **Reed** / **Fathom** / **Hasp** / **Parity** / **Reveille** / **Quench** / **Scrim** / **Knock**.

Different UI: observatory sundial terrace. Brass, slate night sky, moon-silver, umber stone, chalk meridian. Libre Baskerville + IBM Plex Sans + Space Mono. NOT Spoil Instrument Serif / Source Serif 4 / JetBrains Mono slag/ochre. NOT Trammel Newsreader / Sora / Red Hat Mono mahogany. NOT Soundpost Fraunces / Source Sans 3 / IBM Plex Mono amber/maple.

Different verbs: score the gnomon, pin idle cast, pin seeded eclipsed, admit cast, contrast the meridian. Not "Score the spoil" / "Pin idle banked" / "Score the grooves".

Different idle: **cast**.

## Live catalog path

`/gnomon/` is this static observatory desk. Demo works with no secrets and no npm. Mark: `20:50 / hermes catalog #94 / #90954`.

1. Idle demo loads **cast** — shadow angle matches last timestamped event; dating is healthy.
2. Seed **eclipsed** → #90954 ticket: 114 files at epoch 1787422837; timestamp-free `last-prompt` / `mode`; median 17-day skew; `ls -lt` lies.
3. Paste or edit a meridian ticket JSON (`sharedMtime`, `timestampFreeTail`, `lastPromptTail`, `modeTail`, `closedTranscript`, `dateSkew`, `silentWrong`, `retentionTrap`, `lsLtLie`, `mtimePreserved`, `timestampRequired`, `healthyDating`).
4. **Score the gnomon** walks the ticket and lights chips on the brass rail.
5. Contrast: preserve mtime on closed transcripts OR require timestamp on appended records. **Contrast the meridian** pins that pair.
6. Evidence drawer with the GitHub issue links. Fetch #90954 without a token (idle copy is fine).

## How to score

Open `projects/gnomon/index.html` in a browser, or serve the repo root and visit `/gnomon/` (Vercel rewrite → `/projects/gnomon`). No build step. Optional hook:

```bash
node projects/gnomon/hook/gnomon.mjs projects/gnomon/data/90954.json
node projects/gnomon/hook/gnomon.mjs projects/gnomon/data/cast.json
node --test projects/gnomon/hook/gnomon.test.mjs
```

Eclipsed seed → eclipsed/alarm. Cast seed → cast/hold.

`projects/gnomon/hook/gnomon.mjs` classifies a ticket and returns `{ verdict, chips[], reasons[], hold, alarm, idleWord }`. See `hook/README.md`.

Local fingerprints: `data/90954.json`, `data/eclipsed.json`, `data/cast.json`, plus one JSON per other verdict, `data/fingerprints.json`, `data/chips.json`, `data/contrast.json`. Evidence only from issue facts.

## Native integrations

1. GitHub fetch of [anthropics/claude-code#90954](https://github.com/anthropics/claude-code/issues/90954). Unauthenticated. See `.env.example`.
2. Paste/edit a meridian ticket JSON and score.
3. Seed chips: cast / eclipsed / shared-mtime / timestamp-free / last-prompt / date-skew.
4. Contrast plate: preserve-mtime vs timestamp-required.
5. Evidence drawer: #90932, #90931, #90955.
6. Skew table: the two issue examples (2026-07-22T14:00:18Z and 2026-08-04T10:19:24Z) plus the 114-file cluster.

## Sources

- [anthropics/claude-code#90954](https://github.com/anthropics/claude-code/issues/90954) OPEN
- Same-class (cite, not primary; different mechanism, same family of session-file integrity): [#90932](https://github.com/anthropics/claude-code/issues/90932) Rewind+continue makes prior conversation disappear from rendered transcript (display stitch; data intact on disk); [#90931](https://github.com/anthropics/claude-code/issues/90931) Desktop fork ENOTDIR when `projects/<project>` is a symlink; [#90955](https://github.com/anthropics/claude-code/issues/90955) `claude --version` reports PATH CLI not Desktop binary (version-signal skew — NOT mtime).
- Contrast: preserve mtime on closed transcripts OR require timestamp on appended records.
