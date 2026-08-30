# Scion

A night-orchard **grafting bench / scion bank** — wet bark, cambium, grafting tape, wax, lantern light, rootstock vs scion wood, annual rings as transcript records — for a real Claude Code defect: **forking a VS Code session while Remote Control is on produces a child with empty history**. The child registers as a fresh bridged session, not a fork.

Primary: [anthropics/claude-code#90815](https://github.com/anthropics/claude-code/issues/90815) (OPEN, filed 2026-08-30T19:34:40Z). Title: [BUG] VS Code extension: forking a session while Remote Control is on produces a child with EMPTY history (registers as a fresh bridged session, not a fork). Labels: bug, has repro, platform:windows, platform:vscode. Author alonsorobots. VS Code extension **2.1.251**. Child jsonl first record `type: bridge-session` `lastSequenceNum: 0`; **38 recs / 40,676 bytes** vs parent **3942 recs / 9,363,037 bytes**.

A healthy graft with no rings is not a hold. Score the cambium or admit **hollow**.

Idle word: **hollow**. Seeded state: hollow / empty-fork.

- **hollow** = lastSequenceNum === 0 AND missing forkedFromSessionId AND banner healthy / kind interactive
- **lined** / **taken** = child byte-count matches parent and forkedFromSessionId is present (hold)

Verdict chips: empty-fork, bridge-won, unlineaged, lastSequenceNum-0, no-forkedFrom, silent-drop, vscode-rc, race, healthy-banner, seedless.

Fingerprints (do not invent): transcript opens as `bridge-session` with `lastSequenceNum: 0`; Desktop session record `kind: interactive` with NO `forkedFromSessionId`; healthy banner `Remote Control is active · Continue here, on your phone, or at claude.ai/code`; first user record `parentUuid: null`; silent (no error). Same parent forked successfully when the result was NOT bridged (identical 9,363,037 bytes / 3942 records, UUID-swap fingerprint). Parent quiesced 2s before child startedAt.

## Why not a clone

This is specifically: **bridge wins the fork/bridge race; history is never seeded**. Mirror image of #78563 (forks never enable RC).

NOT **Kindling** ([#90798](https://github.com/anthropics/claude-code/issues/90798)) — WarmLifecycle throwaway preview sessions.
NOT **Bollard** — RC env orphan after supervisor gap.
NOT **Cote** — resume hub identity split.
NOT **Ullage** — silent context drop / prefix freeze.
NOT **Voucher** ([#90807](https://github.com/anthropics/claude-code/issues/90807)) — nested subagent fabrication.
NOT **Almanac** ([#90804](https://github.com/anthropics/claude-code/issues/90804)) — one-shot Loop ghost.
NOT **Stile** ([#90767](https://github.com/anthropics/claude-code/issues/90767)) — weaker; Bollard/Cote-adjacent. Stay on Scion.

Different UI: night orchard / grafting shed / wet bark / cambium green / grafting tape / wax / lantern / rootstock vs scion / annual rings. Fraunces + Figtree + Spline Sans Mono. NOT Almanac cream/vermilion, NOT Voucher cashier, NOT Kindling hearth, NOT Deadband control-room.

## Live catalog path

`/scion/` is this static grafting bench. Demo works with no secrets and no npm. Mark: `06:50 Sydney · scion`.

1. Seeded demo loads **hollow** (RC sap graft).
2. Take a graft from parent stock with RC sap flowing → hollow scion (38 / 40,676, lastSequenceNum 0, no forkedFromSessionId, healthy RC banner).
3. Take a graft from unbridged stock → taken/hold (9,363,037 / 3942, forkedFromSessionId present).
4. Chip-switch seeds: hollow / lined / unbridged-success.
5. Paste or edit a graft ticket JSON and score the cambium.
6. Export a graft ticket.

## How to score

Open `projects/scion/index.html` in a browser, or serve the repo root and visit `/scion/` (Vercel rewrite → `/projects/scion`). No build step. Optional hook:

```bash
node projects/scion/hook/index.mjs < projects/scion/data/hollow.json
node projects/scion/hook/index.mjs projects/scion/data/lined.json
node --test projects/scion/hook/scion.test.mjs
```

Hollow seed → hollow/fail. Lined or unbridged-success seed → taken/hold.

`projects/scion/hook/` scores a graft ticket `{ lastSequenceNum, forkedFromSessionId, banner, kind, bytes, parentBytes }` and returns `{ verdict, chips[], reasons[], hollow, taken, hold, alarm }`. See `hook/README.md`.

Local fingerprints: `data/parent.json`, `data/child.json`, `data/parent.jsonl`, `data/child.jsonl`. Numbers from #90815 only: 9363037/3942 vs 40676/38, lastSequenceNum 0, startedAt offset 2s.

## Native integrations

1. Live fetch `https://api.github.com/repos/anthropics/claude-code/issues/90815` (title + state). Unauthenticated. See `.env.example`.
2. Local seed json/jsonl under `data/`.
3. Hook CLI: `node projects/scion/hook/index.mjs`.
4. Opposite pole card + fetch for [#85281](https://github.com/anthropics/claude-code/issues/85281) (has-banner, no-bridge). Cite only — not a hollow seed.

## Sources

- [anthropics/claude-code#90815](https://github.com/anthropics/claude-code/issues/90815) OPEN
- [anthropics/claude-code#85281](https://github.com/anthropics/claude-code/issues/85281) OPEN — opposite pole: VS Code RC banner with no `bridgeSessionId` (has-banner, no-bridge) vs Scion has-bridge / no-lineage / lastSequenceNum 0
- [anthropics/claude-code#78563](https://github.com/anthropics/claude-code/issues/78563) OPEN — Desktop forks never enable Remote Control
- [anthropics/claude-code#90791](https://github.com/anthropics/claude-code/issues/90791) OPEN — VS Code remote session from another machine
- [anthropics/claude-code#85875](https://github.com/anthropics/claude-code/issues/85875) OPEN — subsequent forks silently empty
- [anthropics/claude-code#84468](https://github.com/anthropics/claude-code/issues/84468) OPEN — RC daemon respawns without --resume
- [anthropics/claude-code#85435](https://github.com/anthropics/claude-code/issues/85435) OPEN (stale) — RC registration once at creation
- [anthropics/claude-code#87006](https://github.com/anthropics/claude-code/issues/87006) CLOSED — nearby, not the empty-bridged-child race
- [openai/codex#41713](https://github.com/openai/codex/issues/41713) OPEN — opposite pole (too much lineage vs none)
