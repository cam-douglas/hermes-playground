# Intake

A **industrial water-intake / gauge-house / hydrometer manifold** — cool steel plates, bilge teal, brass dials, riveted panels — Newsreader + Figtree + IBM Plex Mono — for a real Claude Code defect: **`claude -p` WITH PIPED STDIN COUNTS THE INPUT ~1.78× TOWARD THE CONTEXT LIMIT ("ATTACHMENT CONTENT"), HALVING THE USABLE WINDOW FOR LARGE PROMPTS.**

Primary:

- [anthropics/claude-code#92305](https://github.com/anthropics/claude-code/issues/92305) (OPEN, bug, has repro, platform:linux, area:cli). Title: `[BUG] claude -p with piped stdin counts the input ~1.78× toward the context limit ("attachment content"), halving the usable window for large prompts`. Filed 2026-09-05. Reporter: Versidy.

22:50 intake: a pipe that counts the same stream as prompt and attachment is not a window — it is already halved. Score the intake or admit the usable context already doubled away.

Idle word: **once**. Seeded state: **doubled** / #92305 — same stream composed as prompt and attachment; 1,014,989 / 566,880. Never idle as stuck, missed, gated, spilled, hushed, blurted, single, maculed, stilled, rung, barred, dropped, or any prior catalog idle.

**Intake** is the gauge-house well that should take a piped stream once. Here the CLI appears to compose stdin into the request twice — once as the prompt, once as attachment content — so a 1M model refuses a ~567k conversation.

- **once** = HOLD: piped stdin composed once on the prompt path
- **doubled** = #92305: same stream as prompt and attachment; 1,014,989 / 566,880
- **hold** = persistHold keeps the intake composed once
- **bare** = `--bare` avoids the ratio but drops OAuth
- **stream-json** = same ~1.78× ratio via `--input-format stream-json`
- **halved** = halve the file; it completes; same ratio; effective window already ~560k

Verdicts: once, doubled, hold, bare, stream-json, halved.

This is a diagnostic scoring desk. Not an exploit. No payloads. No real credentials. Score whether the pipe was composed once or twice. Fixtures use diagnostic shapes only (`claude -p`, stdin, stream-json, `--bare`, request/conversation token pairs, ~16k overhead, cwd Δ ~5).

Hypothesis only (NON-BINDING): piped stdin is composed into the request twice (prompt + attachment). Do not claim source beyond the issue’s measured pairs and refusal text. Discard if evidence disagrees.

## Research brief

Sources:

- Primary: [anthropics/claude-code#92305](https://github.com/anthropics/claude-code/issues/92305)
- Cousin cite-only (NOT primary): [#12312](https://github.com/anthropics/claude-code/issues/12312)

What happened (from the issue):

- Environment: Claude Code CLI 2.1.259 and 2.1.261, Ubuntu 24.04, model claude-opus-5 (1M context), OAuth login (Max subscription). Invocation: `claude -p` reading the prompt from stdin, throwaway empty directory, tools disallowed.
- Every over-limit refusal reports a request size ≈ 1.78 × the conversation size + ~16k, at three input sizes and two input forms (plain stdin and stream-json):
  - 1,014,989 request / 566,880 conversation
  - 1,452,075 / 821,184 (a doubled packet)
  - 2,057,985 / 1,153,965 (a 4.64 MB control)
  - 2,060,987 / 1,152,395 (same input via stream-json)
- Refusal text attributes the remainder to "system prompt, tool definitions, and attachment content."
- Fixed overhead measured at ~16k tokens (one-word prompt from an empty cwd vs a cwd holding large files: a 5-token difference). cwd is not the cause. The surplus scales with the input.
- Impact: a 2.26 MB text prompt (~641k tokens by o200k, ~567k by the CLI's own count) is refused on a 1M-token model; the effective window for piped input is ~560k tokens. `--bare` avoids it but drops OAuth.
- Expected: piped input counted once, so the usable window is the model's window minus the CLI's fixed overhead.
- Repro: `python3 -c "print('lorem ipsum ' * 200000)" > big.txt` then from an empty directory, tools disallowed, OAuth: `cat big.txt | claude -p --output-format json --model claude-opus-5`. Observe N ≈ 1.78 × M + ~16k. Halve the file; it completes; same ratio. Repeat with `--input-format stream-json`: same ratio.

## Why not a clone

This is specifically: **`claude -p` PIPED STDIN COUNTED ~1.78× (PROMPT + ATTACHMENT CONTENT), HALVING THE USABLE WINDOW.**

NOT Pasteboard ([#92312](https://github.com/anthropics/claude-code/issues/92312)) — OS keybinding miss for image paste. Intake is not a kraft paste-up.
NOT Spillway ([#92311](https://github.com/anthropics/claude-code/issues/92311)) — ultracode concurrency cap bypass. Intake is not a hydroelectric dam.
NOT Blurt ([#92275](https://github.com/anthropics/claude-code/issues/92275)) — TUI ECHO leak. Intake is not a CRT atelier.
NOT Macule ([#92294](https://github.com/anthropics/claude-code/issues/92294)) — show_widget duplicate card. Intake is not letterpress.
NOT Ullage — compaction-ticket gauging. Intake is CLI token double-composition of piped stdin.
NOT Alarum / Portcullis / any existing catalog slug.
NOT #12312 as primary — same "Prompt is too long" below-limit symptom, no mechanism identified there.

Different surface: CLI stdin double-composition vs image-paste chord vs ultracode cap skip vs TUI ECHO race vs widget macule vs compaction ullage.

Cousins are cite-only on a cousin strip; primary stays #92305.

- [#12312](https://github.com/anthropics/claude-code/issues/12312) — CLOSED stale. Same "Prompt is too long" below the model context limit in `-p` mode; no attachment-content ratio identified. Cite-only. Do not ship as primary.

Backups (document only, do not build): [#92286](https://github.com/anthropics/claude-code/issues/92286) (Cresset), [#92292](https://github.com/anthropics/claude-code/issues/92292) (Symlink), [#92321](https://github.com/anthropics/claude-code/issues/92321) (Remote Control stealth-relaunch).

Product name stays **Intake**. Do not rename to Pasteboard, Spillway, Blurt, Macule, Ullage, Alarum, Portcullis or any existing catalog slug.

Different UI: industrial water-intake / gauge-house / hydrometer manifold — cool steel, bilge teal, brass dials, riveted panels, dual-path composition (prompt riser vs attachment riser), token hydrometer (conversation vs request vs 1M). Newsreader + Figtree + IBM Plex Mono. NOT Alegreya/Source Sans/Ubuntu Mono (Pasteboard). NOT Teko/Hind/Fira Code (Spillway). NOT Syne/IBM Plex Sans (Blurt). NOT Bodoni Moda/Barlow (Macule). Stay OFF kraft pasteboard / dam spillway / CRT phosphor / letterpress macule / watchtower.

Different verbs: Score the intake, pin idle once, pin seeded doubled, admit the usable context already doubled away, load fixtures, reset to once. Score the intake is this desk’s phrase.

Different idle: **once**.

## Live catalog path

`/intake/` is this static gauge-house scoring desk. Path `https://hermes-playground-green.vercel.app/intake/` and subdomain `https://intake.hermes-playground-green.vercel.app` are both fine. Demo works with no secrets and no npm. Mark: `22:50 / hermes catalog #158 / #92305`. `?embed` or `?embed=1` hides chrome for the hub living featured well.

1. Seeded demo loads **doubled** — `claude -p` stdin; OAuth Max; tools disallowed; empty cwd; request 1,014,989 / conversation 566,880; surplus attributed to attachment content; 2.26 MB pipe refused on a 1M model.
2. Idle **once** → piped stdin composed once on the prompt path; request ≈ conversation + ~16k; idle word once.
3. Desk UI: riveted steel house, brass hydrometer dials (ratio / overhead / cwd Δ), dual-path manifold (prompt vs attachment), 1M limit tube. Once = prompt riser only. Doubled = both risers live; request overtopping 1M.
4. Cousin cite strip labeled cousin-not-primary: [#12312](https://github.com/anthropics/claude-code/issues/12312). Cite only. Primary stays #92305.
5. **Score the intake** walks the probe ticket and lights chips on the desk. Chip-switch every verdict. Paste or drop JSON. Intake simulator chips rewrite format (stdin / stream-json), composition (once / twice), and auth (oauth / bare).

## How to score

Open `projects/intake/index.html` in a browser, or serve the repo root and visit `/intake/` (Vercel rewrite → `/projects/intake`). No build step. Hook is a documentation stub only:

```bash
# No classifier binary. The living page scores probes in-browser.
# See projects/intake/hook/README.md
```

Empty paste scores the idle **once** ticket if you pin idle. Paste a probe on the page or drop a fixture from `data/`. The living page seeds **doubled**.
