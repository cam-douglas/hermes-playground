# Frizzen

A **flintlock / frizzen gunsmith desk** — dark walnut bench, steel frizzen plate, flint cock, flash pan, primer powder, touch-hole, lockplate screws, oil lamp, brass gauges — Bodoni Moda + Commissioner + Space Mono — for a real Claude Code defect: **A `UserPromptSubmit` HOOK IS LISTED BY `/hooks` AND WORKS WHEN INVOKED MANUALLY, BUT IS NEVER INVOKED ON A REAL INTERACTIVE PROMPT SUBMIT IN GIT BASH CLI (WINDOWS, v2.1.261).**

Primary:

- [anthropics/claude-code#92353](https://github.com/anthropics/claude-code/issues/92353) (OPEN, bug, has-repro, platform:windows, area:hooks, regression). Title: `UserPromptSubmit hook registered and valid but never invoked on real prompt submission (Git Bash CLI, Windows, v2.1.261) — possible regression of #17277`. Filed 2026-09-05. Reporter: anhducmata.

08:50 frizzen: a frizzen that sits assembled on the lock and shows in /hooks but never snaps on a real pull is not a credential gate — it is already unstruck. Score the spark or admit the pan already leaked.

Idle word: **unstruck**. Seeded state: **leaked** / #92353 — secret prompt reached the model unmodified; no hook-block stderr. Never idle as nixied, open, elided, grafted, frozen, adrift, cold, voided, banked, rewritten, discarded, settled, held, witnessed, or any prior catalog idle.

**Frizzen** is flintlock work. The frizzen is the hinged steel that should spark when the flint strikes on prompt submit. Here it sits assembled, listed as ready, and never snaps on a real pull in Git Bash CLI. The secret slips into the pan and through the touch-hole to the model. Score whether a pull (interactive Git Bash submit vs manual node invoke vs warm-up-then-secret) would stay unstruck, snap, or leak.

- **unstruck** = IDLE / listed-but-never-pulled fence: `/hooks` shows UserPromptSubmit; the cock never falls on a real interactive submit
- **leaked** = seeded word: secret prompt reached the model unmodified; no hook-block stderr; session `.jsonl` shows `type:user` then a genuine `type:assistant` with tokens
- **snapped** = contrast hold: hook actually invoked; exit 2 blocked; stderr shown; no model turn
- **manual-fire** = contrast hold: script works when run by hand with the same JSON payload (Blocked, exit 2)
- **hooks-listed** = `/hooks` lists the entry under Project Settings — false confidence
- **interactive-dark** = typed/submitted in Git Bash CLI; hook never invoked
- **warmup-still-dark** = #17277 first-message workaround does not help; second (secret) message still never fires
- **pretool-works** = same settings: PreToolUse Bash hook *did* fire (desktop Code tab)
- **deny-works** = same settings: `permissions.deny` on `.env` / `~/.aws/**` works and is not silent
- **jsonl-proof** = raw canary as `type:user`, then `type:assistant` with non-zero usage; no hook entry nearby
- **3-sessions** = reproduced across at least 3 fresh session transcripts
- **doctor-hook-error** = `/doctor` flagged hook execution error telemetry for a PreToolUse Bash-hook run
- **possible-regression** = looks like a regression of closed #17277 on v2.1.261
- **invoke-every-submit** = expected fix: actually invoke UserPromptSubmit on every interactive submit
- **exit-2-block** = expected fix: honor exit 2 — erase prompt, show stderr, no model turn

Verdicts: unstruck, leaked, snapped, manual-fire, hooks-listed, interactive-dark, warmup-still-dark, pretool-works, deny-works, jsonl-proof, 3-sessions, doctor-hook-error, possible-regression, invoke-every-submit, exit-2-block.

This is a diagnostic scoring assay. Not an exploit. No live secrets. No live Claude sessions. The canary string is the published issue example. Score whether an interactive Git Bash submit would leave the frizzen unstruck or already leaked. Fixtures use the issue's `/hooks` listing, manual node invoke, interactive miss, jsonl proof, warm-up failure, PreToolUse / deny contrast, and documented exit-2 semantics only.

Hypothesis only (NON-BINDING): invoke UserPromptSubmit on every interactive prompt submit; honor exit 2. Listing in `/hooks` is not a gate. The #17277 warm-up is not sufficient here. Discard if issue evidence disagrees. Encoded from the issue body and the reporter's follow-up comment only.

## Research brief

Sources:

- Primary: [anthropics/claude-code#92353](https://github.com/anthropics/claude-code/issues/92353)

What happened (from the issue — do not invent):

- Environment: Claude Code CLI **v2.1.261**; Windows 10; Git Bash (**MINGW64**); model Sonnet 5, medium effort; permission mode `auto`. Local project with `.claude/settings.json` defining a `UserPromptSubmit` hook and a `PreToolUse` hook (matcher: `Bash`).
- A `UserPromptSubmit` hook configured in `.claude/settings.json` is correctly listed by `/hooks`, and the hook script works when invoked manually with the exact same JSON payload Claude Code would send it — but it is **never actually invoked** when a real prompt is typed and submitted interactively in the CLI. The prompt reaches the model unmodified every time, across multiple fresh session restarts.
- Hook command: `node "$CLAUDE_PROJECT_DIR/.claude/hooks/block-secrets.js"` with `"shell": "bash"`. The script reads stdin JSON (`{"prompt_text": "..."}`), detects a hardcoded-looking secret in `prompt_text`, writes a message to stderr, and `process.exit(2)`.
- `/hooks` lists the `UserPromptSubmit` entry pointing at the script, under "Project Settings".
- Standalone in the same shell:

```bash
node ".claude/hooks/block-secrets.js" <<< '{"prompt_text":"const apiKey = \"sk-ant-api03-abcdefghijklmnop1234567890\";"}'
echo "exit: $?"
```

  Output: the expected "Blocked: detected potential credential(s)..." message, exit code `2`.
- After a full `/exit` and a brand-new `claude` session, typing the same canary into the prompt: the model receives and responds to the raw prompt normally (a real assistant turn, with real token usage). No hook-block message is ever shown.
- Verified in the session `.jsonl` at `~/.claude/projects/<project>/<session-id>.jsonl`: the raw secret string appears as a plain `"type":"user"` message, immediately followed by a genuine `"type":"assistant"` message with non-zero `usage.input_tokens` / `output_tokens`. There is no hook-related entry anywhere near it.
- Reproduced across at least 3 separate fresh sessions, including after adding `"shell": "bash"`, fully exiting and restarting, confirming no `.claude/settings.local.json` override, and confirming the hook appears correctly in `/hooks`.
- A separate `PreToolUse` hook (matcher: `Bash`) in the same settings *did* fire and block a matching Bash tool call — observed from the Claude desktop app Code tab, not independently confirmed in this Git Bash CLI session.
- `permissions.deny` rules in the same settings (blocking `Read` / `Bash cat` on `.env`, `~/.aws/**`, etc.) *do* work and show a clear denial. The settings file is loaded; it is specifically `UserPromptSubmit` invocation that silently does not happen.
- `/doctor` flagged "hook execution error" telemetry for a `PreToolUse` Bash-hook run in the same project.
- Follow-up comment: the #17277 warm-up first-message workaround (`Hi`, then the secret) did **not** help — the hook still failed on the second message. This is not limited to early-session timing; UserPromptSubmit never fires for any interactively-typed prompt in this Git Bash CLI session.

Expected (from `/hooks` documented semantics):

> Exit code 2 - block processing, erase original prompt, and show stderr to user only

The prompt should never reach the model.

Impact: defeats credential-leak-prevention hooks that rely on `UserPromptSubmit` exit code 2 to block secrets before they reach the model.

## Why not a clone

This is specifically: **UserPromptSubmit listed and valid but never invoked on real interactive prompt submission in Git Bash CLI (Windows, v2.1.261); manual node invoke works; #17277 warm-up does not help.**

NOT Nixie/#92383 — postal undeliverable send / 45s no-ack settle. Frizzen is not a USPS nixie desk.
NOT Embrasure/#92365 — denyRead fail-open. Frizzen is not a battlement embrasure.
NOT Elision/#92347 — summary cut. Frizzen is not a blue-pencil folio.
NOT Graft/#92354 — plugin cache copy-forward. Frizzen is not an orchard grafting bench.
NOT Sostenuto/#92360 — CoreAudio hold-to-talk freeze. Frizzen is not an ebony piano.
NOT Jetsam/#92338 — stale tracking-ref Stop hook. Frizzen is not a teak quay.
NOT Priory/#92345 — MSIX priconfig leak. Frizzen is not a limestone cloister.
NOT Latchkey/#92330 — Remote Control OAuth false /login. Frizzen is not a brass latchkey board.
NOT Portcullis/#92278 — EACCES managed prefs. Frizzen is not an iron grate.
NOT Snib / Hasp / Sear / Tumbler / Escapement — different lock/clock paradigms. Frizzen is the hinged steel on a flintlock, not a latch, hasp, sear, pin tumbler, or pallet fork.

Different surface: UserPromptSubmit never-invoked on interactive Git Bash submit vs those.

Cousins cite-only (NOT primary):

- [#17277](https://github.com/anthropics/claude-code/issues/17277) CLOSED — UserPromptSubmit not triggering consistently (early-session race; closed after 2.1.3)
- [#7873](https://github.com/anthropics/claude-code/issues/7873) CLOSED — UserPromptSubmit not working (Windows)
- [#31114](https://github.com/anthropics/claude-code/issues/31114) CLOSED — UserPromptSubmit not fired mid-turn (WSL)
- Windows stdin cousins (hang/empty stdin vs never-invoked): [#46177](https://github.com/anthropics/claude-code/issues/46177) [#53177](https://github.com/anthropics/claude-code/issues/53177) [#48009](https://github.com/anthropics/claude-code/issues/48009) [#36156](https://github.com/anthropics/claude-code/issues/36156) [#78756](https://github.com/anthropics/claude-code/issues/78756)

Backup (do not ship this PR): [#92335](https://github.com/anthropics/claude-code/issues/92335) Chrome silent re-auth after browser session end.

Product name stays **Frizzen**. Do not rename to Nixie, Embrasure, Elision, Graft, Sear, Tumbler, Escapement, or any existing catalog slug. Name/slug `frizzen` confirmed unused in catalog.json.

Different UI: flintlock gunsmith desk / dark walnut / steel frizzen / flint cock / flash pan / oil lamp / brass gauges. Bodoni Moda + Commissioner + Space Mono. NOT Libre Baskerville / DM Sans / JetBrains Mono (Nixie oak-kraft-nixie-red). NOT Cinzel / Source Sans 3 (Embrasure). NOT Newsreader / Figtree (Elision). NOT Literata (Graft). NOT Fraunces / Outfit (Sostenuto). Stay OFF postal pigeonholes / battlement merlons / blue-pencil folio / orchard cambium / ebony piano.

Different verbs: Score the spark, pin idle unstruck, pin seeded leaked, admit the pan already leaked, pull interactive vs manual vs warm-up, load fixtures, reset to snapped.

Different idle: **unstruck**. Different seeded: **leaked**. Contrast: **snapped** / **manual-fire**.

## Live catalog path

`/frizzen/` is this static flintlock scoring assay. Path `https://hermes-playground-green.vercel.app/frizzen/` and subdomain `https://frizzen.hermes-playground-green.vercel.app` are both fine. Demo works with no secrets and no live Claude sessions. Mark: `08:50 / hermes catalog #168 / #92353`. `?embed` or `?embed=1` hides chrome for the hub living featured well.

1. Seeded demo loads **leaked** — interactive Git Bash submit; hook never invoked; canary in jsonl as user then assistant; no hook-block stderr.
2. Idle **unstruck** → the listed-but-never-pulled fence; frizzen assembled; idle word unstruck.
3. Contrast **snapped** → hook invoked; exit 2 blocked; stderr shown; no model turn.
4. Contrast **manual-fire** → script works when run by hand with the same payload.
5. Assay UI: walnut bench, steel lockplate, flint cock, frizzen plate, flash pan, touch-hole, oil lamp, brass `/hooks` / jsonl / Git Bash gauges.
6. Stay-off strip: Nixie / Embrasure / Elision / Graft / Sostenuto / Jetsam / Priory / Latchkey / Portcullis / Snib / Hasp / Sear / Tumbler / Escapement. Primary stays #92353.
7. **Score the spark** walks the probe ticket and lights chips on the bench. Chip-switch every verdict. Paste or drop JSON. Assay simulator chips rewrite the pull (interactive / manual / warm-up).

## How to score

Open `projects/frizzen/index.html` in a browser, or serve the repo root and visit `/frizzen/` (Vercel rewrite → `/projects/frizzen`). No build step.

```bash
# No live Claude sessions. The living page scores probes in-browser.
# Do not claim this guard ships in Claude Code.
```

Empty paste scores the idle **unstruck** ticket if you pin idle. Paste a probe on the page or drop a fixture from `data/`. The living page seeds **leaked** / hook never invoked.
