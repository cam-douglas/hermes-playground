# Flong

A **stereotype foundry / composing-stone desk** — dark shop, damp paper, iron chase, proof ink; Fraunces + Barlow Condensed + Spline Sans Mono — for a real Claude Code defect: **a torn Git Bash shell snapshot of serialized git-completion functions is sourced before every Bash tool, so every impression exits 127 with no output**.

Primary:

- [anthropics/claude-code#90916](https://github.com/anthropics/claude-code/issues/90916) (OPEN, filed 2026-08-31T06:54:06Z by LefRT). Title: [Bug] Windows/Git Bash: corrupted shell snapshot (serialized git-completion functions) makes every Bash tool call exit 127 with no output. Labels: bug, has-repro, platform:windows, area:bash. Claude Code **2.1.251**. Git **2.53** at non-default `D:\Program Files\Git`. `CLAUDE_CODE_GIT_BASH_PATH` valid.

A torn flong is not a hold. Score the chase or admit **struck**.

Idle word: **struck**. Seeded state: **torn** / #90916 — git-completion eval-replay mold; every impression 127. Never idle as "flong" / "foundry" / "chase" / "proof" / "mold" / "stereotype" / "snapshot" / "bash".

- **struck** = hold: small valid flong (PATH + aliases); proof pulls clean; builtins live
- **torn** = #90916 primary — writer serialized git-completion as `eval $'__git_* () \n{ ... }'`; snapshot unparseable; source exits 127
- **parse-fail** = `bash -n` unexpected token `(`
- **exit-127** = every Bash tool call, including builtins and `/usr/bin/…`
- **git-complete** = Git Bash `/etc/profile.d/git-prompt.sh` → `mingw64/share/git/completion/git-completion.bash`
- **eval-replay** = `eval $'__git_* () \n{ ... }' > /dev/null 2>&1`
- **mid-token** = line 2 begins mid-token (`ord" in`)
- **dangling-comment** = tail `# Shadow pkill to refuse patterns matching the CLI process` with no function body
- **byte-identical** = regenerated snapshots 65284 bytes; older 2.1.226 snapshot 84178 bytes also broken
- **builtins-dead** = `pwd` and absolute paths die the same way
- **interactive-ok** = interactive Git Bash works; Read/Write/WebFetch/MCP work
- **source-killed** = Claude Code *sources* the torn flong; Codex *discards* it

Verdicts: torn, struck, parse-fail, exit-127, git-complete, eval-replay, mid-token, dangling-comment, byte-identical, builtins-dead, interactive-ok, source-killed.

## Why not a clone

This is specifically: **A TORN SHELL-SNAPSHOT FLONG**. The writer serializes git-completion into `eval $'__git_* ()'` plates. The mold is unparseable. Claude Code sources it before every Bash tool. Codex discards the same class of smash.

NOT **Bulla** ([#90891](https://github.com/anthropics/claude-code/issues/90891)) — in-place MSIX mutate / CodeIntegrity.
NOT **Trompe** ([#90881](https://github.com/anthropics/claude-code/issues/90881)) — painted false /clear chip.
NOT **Davy** ([#90886](https://github.com/anthropics/claude-code/issues/90886)) — false boot-canary.
NOT **Slype** ([#90676](https://github.com/anthropics/claude-code/issues/90676)) — sandbox pwsh 126.
NOT **Escutcheon** — tmpfs `/run/user`.
NOT **Quoin** — letterpress *locking* / heredoc unescape. Flong is the *wet-paper mold* and the proof press, not the quoin wedge.

Different UI: stereotype foundry. Dark shop, damp flong paper, iron chase, proof-press lever. Fraunces + Barlow Condensed + Spline Sans Mono. NOT Bulla olive/wax/Cormorant. NOT Trompe plaster/gilt/Playfair. NOT Davy pit-black/brass gauze/Cinzel. NOT Quoin cream oak/Bodoni.

Different idle: **struck**.

## Live catalog path

`/flong/` is this static foundry desk. Demo works with no secrets and no npm. Mark: `16:50 / hermes catalog #90 / #90916`.

1. Idle demo loads **struck** — small valid flong, PATH + aliases, proof clean, builtins live.
2. Seed **torn** → compact #90916 fixture (not 65284 bytes of real git-completion): mid-token head, eval-replay plate, dangling Shadow pkill; bash -n equivalent smash at unexpected `(`.
3. Type lines lock into the iron chase. `__git_*` eval-replay plates read as oversized mats.
4. **Pull a proof** walks quotes / `eval $'...'` and lights the first smash. Bisect: line 1 PATH holds; line 2 is a torn head.
5. Contrast plate: Codex discards unparseable snapshots; Claude Code sources them → 127.
6. Evidence drawer with the GitHub issue links.

## How to score

Open `projects/flong/index.html` in a browser, or serve the repo root and visit `/flong/` (Vercel rewrite → `/projects/flong`). No build step. Optional hook:

```bash
node projects/flong/hook/flong.mjs projects/flong/data/90916.json
node projects/flong/hook/flong.mjs projects/flong/data/struck.json
node --test projects/flong/hook/flong.test.mjs
```

Torn seed → torn/alarm. Struck seed → struck/hold.

`projects/flong/hook/flong.mjs` classifies snapshot text and returns `{ verdict, chips[], reasons[], struck, torn, hold, alarm, idleWord, walk, contrast }`. See `hook/README.md`.

Local fingerprints: `data/90916.json`, `data/torn.json`, `data/struck.json`, plus one JSON per other verdict, `data/fingerprints.json`, `data/chips.json`, `data/contrast.json`. Evidence only from issue facts.

## Native integrations

1. GitHub fetch of [anthropics/claude-code#90916](https://github.com/anthropics/claude-code/issues/90916). Unauthenticated. See `.env.example`.
2. Paste/drop a snapshot (`.sh` or text) and lock it into the chase.
3. In-browser bash -n equivalent walk (quote / `eval $'...'` tokenizer) with bisect lighting.
4. Codex-vs-Claude discard/source contrast plate ([openai/codex#36589](https://github.com/openai/codex/issues/36589)).
5. Evidence drawer: #15128, #16377, #61293, #19053.

## Sources

- [anthropics/claude-code#90916](https://github.com/anthropics/claude-code/issues/90916) OPEN
- Same-class (cite, not primary): [#15128](https://github.com/anthropics/claude-code/issues/15128) empty `PATH=''` in the same snapshot file family, not git-completion syntax; [#16377](https://github.com/anthropics/claude-code/issues/16377) Windows snapshot generation; [#61293](https://github.com/anthropics/claude-code/issues/61293) CLOSED — 2.1.147 wrapper 127, hotfix 2.1.148, different cause; [#19053](https://github.com/anthropics/claude-code/issues/19053) CLOSED — escaped PATH colons were a red herring.
- Cross-ecosystem: [openai/codex#36589](https://github.com/openai/codex/issues/36589) OPEN — shell snapshot of bash-completion/extglob functions fails `bash -n` with syntax error near unexpected token `(`; Codex *discards* the snapshot (degraded). Claude Code *sources* the torn flong.
