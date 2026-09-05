# Ratchet

A **workshop ratchet / gear-tooth scoring desk** — gunmetal steel, oil amber, tooth brass, graphite, machine-oil black — Outfit + Source Serif 4 + Fragment Mono — for a real Claude Code `/goal` defect: **/GOAL STOP HOOK RE-FIRES AFTER USER ACCEPTS BLOCKED VIA ASKUSERQUESTION.**

Primary:

- [anthropics/claude-code#92242](https://github.com/anthropics/claude-code/issues/92242) (OPEN, bug, has-repro, platform:windows, platform:vscode, area:hooks, filed 2026-09-04T23:56:03Z, updated 2026-09-04T23:57:03Z). Title: `[Bug] /goal stop hook repeatedly re-fires after user accepts BLOCKED outcome via AskUserQuestion`. Reporter biz-dapav. Claude Code 2.1.260 · win32 · vscode. User sets a `/goal` condition (bring a PR to MERGEABLE, resolve threads). Mid-task a policy conflict appears; the model uses AskUserQuestion; one option’s preview explicitly describes a terminal BLOCKED / stopped-looping outcome. The user picks that BLOCKED option (informed, explicit). Despite that, the `/goal` dynamic stop hook keeps re-firing 50+ times with the same automated feedback; the model has no tool to clear or acknowledge the goal (only the user’s own `/goal clear`). `/goal resume` reconverges to the same terminal stop and still re-fires. The stop hook has no way to learn of the AskUserQuestion resolution and keeps firing on the original literal condition text.

09:50 ratchet: a ratchet that keeps slipping after the user accepted the BLOCKED tooth is not a caught stop — it is already slipping. Score the ratchet or admit the tooth already slipping.

Idle word: **caught**. Seeded state: **slipping** / #92242 — stop-hook re-fires on literal goal text after user accepted BLOCKED; resume reconverges; only `/goal clear` ends it. Never idle as locked / wiped / seated / channel / stranded / scratched / live / orphaned / set / scrapped / pure / scorched / cold / voided / banked / rewritten / keyed / strayed / scrubbed / pulled / enacted / withheld / masked / bled / fouled / careted / ringing.

**Ratchet** is a workshop socket ratchet on a scoring bench: a tooth that the user already accepted as BLOCKED should catch and rest. If the stop-hook dog never sees that acceptance and keeps riding the frozen literal condition, every click is already slipping.

- **caught** = HOLD: AskUserQuestion BLOCKED acceptance acknowledged; stop-hook rests; condition cleared/satisfied as terminal
- **slipping** = #92242: stop-hook re-fires on literal goal text after the user accepted BLOCKED
- **stop-hook** = `/goal` dynamic stop hook keeps firing the same automated feedback
- **ask-user-blocked** = user picked the option whose preview is terminal BLOCKED / stopped-looping
- **goal-literal** = verifier only sees the original frozen `/goal` condition text
- **resume-reconverge** = `/goal resume` returns to the same justified terminal stop
- **clear-only** = only the user’s own `/goal clear` ends the loop; the model has no acknowledge tool
- **fifty-plus** = 50+ consecutive identical stop-hook re-fires
- **policy-conflict** = mid-task rule forbids the exact actions the goal required
- **terminal-preview** = the chosen AskUserQuestion option preview described BLOCKED / stopped-looping
- **no-model-clear** = no model-facing tool to clear or acknowledge the goal
- **condition-frozen-cousin** = cite-only #86434: Stop-hook condition frozen at creation; verifier cannot see later cancellation

Verdicts: caught, slipping, stop-hook, ask-user-blocked, goal-literal, resume-reconverge, clear-only, fifty-plus, policy-conflict, terminal-preview, no-model-clear, condition-frozen-cousin.

This is a diagnostic scoring desk. Not an exploit. No payloads. No real credentials. Score whether the ratchet caught the BLOCKED tooth or the tooth already slipping. Fixtures use fictionalized paths (`org/demo-repo#<demo-pr>`, `~/.claude/projects/<demo-slug>/<session-id>.jsonl`).

Hypothesis only (NON-BINDING): Stop-hook verifier only sees the frozen literal `/goal` condition text and never observes AskUserQuestion terminal BLOCKED acceptance as satisfaction/cancellation. Discard if evidence disagrees. Encoded from the issue’s mechanism. Do not claim unseen source.

## Why not a clone

This is specifically: **/GOAL STOP HOOK RE-FIRES AFTER USER ACCEPTS BLOCKED VIA ASKUSERQUESTION**.

NOT Forme ([#92203](https://github.com/anthropics/claude-code/issues/92203)) — TUI completed-turn scrollback wipe.
NOT Tabula ([#92210](https://github.com/anthropics/claude-code/issues/92210)) — deep-link same-folder scratch.
NOT Oxbow ([#92197](https://github.com/anthropics/claude-code/issues/92197)) — transcript forest largest≠newest.
NOT Relict ([#92173](https://github.com/anthropics/claude-code/issues/92173)) — MSIX Run orphan.
NOT Hellbox ([#92168](https://github.com/anthropics/claude-code/issues/92168)) — sticky CLAUDE_PROJECT_DIR.
NOT Cupel ([#92122](https://github.com/anthropics/claude-code/issues/92122)) — MCP draft-07.
NOT Oubliette ([#92095](https://github.com/anthropics/claude-code/issues/92095)) — cold-parent Dispatch.
NOT Ephemera ([#92090](https://github.com/anthropics/claude-code/issues/92090)) — 5m subagent cache.
NOT Detent ([#92079](https://github.com/anthropics/claude-code/issues/92079)) — one-time scheduled `enabled:false` re-fire — same-class loop cousin only; different surface (scheduled-tasks MCP vs `/goal` stop hook + AskUserQuestion).
NOT Tocsin / Knell / Escapement / Geneva / Scotch / Pawl / Clapper UIs.

Different surface: `/goal` dynamic stop hook + AskUserQuestion BLOCKED acceptance vs TUI scrollback / desktop deep-link / transcript forest / packaging / hooks-dir / MCP schema / Dispatch / cache / scheduled-tasks. Completely different UI (workshop ratchet / gear-tooth scoring desk — gunmetal steel, oil amber, tooth brass, graphite, machine-oil black), backend (probe-shaped JSON of catch / slip / stop-hook / ask-user-blocked / goal-literal rows), and UX (tooth simulator chips, caught/slipping state machine, workshop plates).

Cousins are cite-only on a cousin strip; primary stays #92242.

- [#85594](https://github.com/anthropics/claude-code/issues/85594) — Goal execution loops indefinitely after completion. Cite-only.
- [#86434](https://github.com/anthropics/claude-code/issues/86434) — `/goal` Stop-hook condition frozen at creation; verifier cannot see later cancellation. Cite-only.
- [#69201](https://github.com/anthropics/claude-code/issues/69201) — stop-hook-git-check false-positive → unbreakable Stop-hook loop. Cite-only.
- [#92079](https://github.com/anthropics/claude-code/issues/92079) — one-time scheduled task re-fire loop (cite-only; Detent alt).
- [#86438](https://github.com/anthropics/claude-code/issues/86438) — `/goal clear` typed while working treated as chat. Cite-only.
- [#89295](https://github.com/anthropics/claude-code/issues/89295) — `/goal` activation record mid-turn orphans advisor / bricks session. Cite-only.

Backups (document only, do not build): [#92235](https://github.com/anthropics/claude-code/issues/92235) (Doublet — mobile Remote Control reconnect mints duplicate sessions; auto-archive-on-disconnect dead), [#92214](https://github.com/anthropics/claude-code/issues/92214) (Lintel — Background Computer Use silently disabled on macOS 27 by undocumented max-OS ceiling 26.9999 before preference read), [#92207](https://github.com/anthropics/claude-code/issues/92207) (Snuff — stealth update idle relaunch severs Remote Control bridges).

Product name stays **Ratchet**. Do not rename to Forme, Tabula, Oxbow, Relict, Hellbox, Cupel, Oubliette, Ephemera, Commutator, Heddle, Hectograph, Placet, Frisket, Tangent, Hawser, Caret, Buoy, Solecism, Coffer, Codicil, Crimp, Jackfield, Tocsin, Bolter, Deadeye, Reglet, Reliquary, Annunciator, Caisson, Spindle, Knell, Tumbler, Escapement, Geneva, Scotch, Pintle, Palimpsest, Lacuna, Quoin, Flong, Pawl, Clapper, Detent, Catafalque, Schism, Miskey or any existing catalog slug.

Different UI: workshop ratchet / gear-tooth scoring desk + gunmetal steel + oil amber + tooth brass + graphite / machine-oil black. Outfit + Source Serif 4 + Fragment Mono. NOT Literata / Sora / IBM Plex Mono (Forme imposing-stone). NOT Fraunces / Source Sans 3 (Tabula wax). NOT Crimson Pro / Work Sans / Space Mono (Oxbow). NOT Spectral / Manrope / JetBrains Mono (Relict). NOT Fraunces / DM Sans (Hellbox — melt, not scoring). Stay OFF Forme imposing-stone / Tabula wax tablet / Oxbow floodplain / Relict glacial fossil slab / Hellbox letterpress melt / Cupel assay office / Oubliette dungeon / Tocsin/Knell bells / Escapement/Geneva/Scotch clockworks.

Different verbs: Score the ratchet, pin idle caught, pin seeded slipping, admit the tooth already slipping, load fixtures, reset to caught. Score the ratchet is this desk’s phrase.

Different idle: **caught**.

## Live catalog path

`/ratchet/` is this static workshop gear-tooth scoring desk. Path `https://hermes-playground-green.vercel.app/ratchet/` and subdomain `https://ratchet.hermes-playground-green.vercel.app` are both fine. Demo works with no secrets and no npm. Mark: `09:50 / hermes catalog #145 / #92242`. `?embed` or `?embed=1` hides chrome for the hub living featured well.

1. Seeded demo loads **slipping** — user accepted the BLOCKED tooth via AskUserQuestion; stop-hook never learned it; frozen literal condition keeps firing 50+ times; `/goal resume` reconverges; only `/goal clear` ends it; the tooth is already slipping.
2. Idle **caught** → AskUserQuestion BLOCKED acceptance acknowledged as terminal; stop-hook rests; condition cleared/satisfied; the ratchet stays caught.
3. Workshop UI: ratchet head for caught tooth vs slipping dog, catch/slip state machine, workshop plates. Caught = BLOCKED tooth seated. Slipping = every click rides the frozen literal.
4. Cousin cite strip labeled cousin-not-primary: [#85594](https://github.com/anthropics/claude-code/issues/85594), [#86434](https://github.com/anthropics/claude-code/issues/86434), [#69201](https://github.com/anthropics/claude-code/issues/69201), [#92079](https://github.com/anthropics/claude-code/issues/92079), [#86438](https://github.com/anthropics/claude-code/issues/86438), [#89295](https://github.com/anthropics/claude-code/issues/89295). Cite only. Primary stays #92242.
5. **Score the ratchet** walks the probe ticket and lights chips on the bench. Chip-switch every verdict. Paste or drop JSON. Tooth simulator chips rewrite whether the dog observes BLOCKED. Catch machine steps set → conflict → ask → accept → verify → slip.

## How to score

Open `projects/ratchet/index.html` in a browser, or serve the repo root and visit `/ratchet/` (Vercel rewrite → `/projects/ratchet`). No build step. Hook is a documentation stub only:

```bash
# No classifier binary. The living page scores probes in-browser.
# See projects/ratchet/hook/README.md
```

Empty paste scores the idle **caught** ticket if you pin idle. Paste a probe on the page or drop a fixture from `data/`. The living page seeds **slipping**.
