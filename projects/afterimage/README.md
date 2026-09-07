# Afterimage

A **CRT / ophthalmology afterimage bench** — darkroom test card, phosphor persistence, retina field; Instrument Serif + Plus Jakarta Sans + IBM Plex Mono — for a real Claude Code defect: **WINDOWS ASSISTANT TEXT DELTAS ARRIVE BUT ARE NOT PAINTED UNTIL MESSAGE_STOP.** When Windows text content blocks paint per-delta the same way thinking already does, the phosphor is **flushed**.

Primary:

- [anthropics/claude-code#92596](https://github.com/anthropics/claude-code/issues/92596) (OPEN, bug, has repro, platform:windows, area:tui). Title: `Windows: assistant text deltas arrive but are not painted until message_stop (thinking streams fine) - v2.1.263`. Filed 2026-09-07T05:29:53Z. Updated 2026-09-07T05:30:57Z. Reporter: skunpoj. 0 comments.

20:50 afterimage: a CRT/ophthalmology afterimage bench that should paint Windows assistant text deltas live (token counter already ticks; thinking paints ~15fps) but the message field stays latent until message_stop then one mega-frame (#92596). Score latent or admit flushed.

Idle word: **latent** (ALARM: deltas held latent; message field blank). Seeded state: **flushed** / HOLD (paint flushed at `message_stop` no longer — text paints live). Never idle as silted, barred, runaway, haunted. Never seeded as drained, admitted, latched, staged. Never reuse **blanked** as a verdict.

**Afterimage** = ophthalmology / CRT phosphor persistence / darkroom afterimage test card. The retina (or phosphor) receives every photon (text deltas) but the conscious field stays blank until the stimulus ends — then the whole answer flashes as one afterimage.

- **latent** = IDLE: deltas held; message field blank until `message_stop`
- **flushed** = seeded word: Windows text paints per-delta like thinking
- **thinking-paints** = thinking deltas ~200 frames / 13s / ~15fps
- **text-zero-frames** = text phase zero paint frames
- **mega-frame-stop** = one 2,482-patch frame then 2,472-patch repaint
- **linux-progressive** = same CLI + gateway streams on Linux
- **nonstreaming-fallback-ruled-out** = `CLAUDE_CODE_DISABLE_NONSTREAMING_FALLBACK=1`
- **fine-grained-no-effect** = `CLAUDE_CODE_ENABLE_FINE_GRAINED_TOOL_STREAMING=1` has no effect on prose
- **cousins** = cite-only #92616 / #92531 / #92493
- **has-clear-repro** = issue labeled has repro

Verdicts: latent, flushed, thinking-paints, text-zero-frames, mega-frame-stop, linux-progressive, nonstreaming-fallback-ruled-out, fine-grained-no-effect, cousins, has-clear-repro.

This is a diagnostic scoring assay. Not an exploit. No live Claude sessions. No payloads. No secrets. Score whether deferred Windows text paint would leave the field **latent** or already **flushed**. Fixtures use the issue's published incident only.

Hypothesis only (NON-BINDING): Windows text `content_block_delta` paint path may be deferred until `message_stop` while thinking path paints live. A fix might paint text deltas the same way thinking already does on Windows. Verify against issue text only; do not claim unread source.

## Research brief

Sources:

- Primary: [anthropics/claude-code#92596](https://github.com/anthropics/claude-code/issues/92596)
- Cousins cite-only (NOT primary):
  - [anthropics/claude-code#92616](https://github.com/anthropics/claude-code/issues/92616) — queued paste merged on interrupt (different surface)
  - [anthropics/claude-code#92531](https://github.com/anthropics/claude-code/issues/92531) — permission modal dismiss (different surface)
  - [anthropics/claude-code#92493](https://github.com/anthropics/claude-code/issues/92493) — stats image glyphs (different surface)

What happened (from the issue body — do not invent):

- Claude Code 2.1.263, native install, Windows 11 Enterprise (10.0.22631)
- Reproduced in Windows Terminal (ConPTY) AND mintty (Git Bash) — terminal-independent
- Also reproduced with a pristine `CLAUDE_CONFIG_DIR`
- Long answers render as a single blink at completion
- Status line shows live token counts (deltas ARE arriving and being parsed)
- Message area paints nothing until `message_stop`
- Raw SSE: `text_delta` every ~100ms for 33s on a 45k-token input — transport fine
- `CLAUDE_CODE_FRAME_TIMING_LOG`: thinking ~200 paint frames / 13s at ~15fps; text phase zero paint frames; at completion one frame with 2,482 patches then a 2,472-patch repaint
- Same CLI + gateway streams progressively on Linux
- `CLAUDE_CODE_DISABLE_NONSTREAMING_FALLBACK=1` rules out silent non-streaming fallback
- `CLAUDE_CODE_ENABLE_FINE_GRAINED_TOOL_STREAMING=1` has no effect on prose
- Interactive renderer paints `content_block_delta` for thinking immediately, but defers painting text content blocks until `message_stop` on Windows only

Problem found: WINDOWS TEXT PAINT DEFERRAL — thinking paints live; text stays latent until `message_stop`, then one mega-frame.

Why this solution: a diagnostic scorer for the latent → flushed afterimage chain, so a reader can admit idle latent, pin seeded flushed, and score thinking-paints / text-zero-frames / mega-frame-stop / linux-progressive / nonstreaming-fallback-ruled-out / fine-grained-no-effect / cousins against the published facts.

## Why not a clone

This is specifically: **WINDOWS ASSISTANT TEXT DELTAS ARRIVE BUT ARE NOT PAINTED UNTIL MESSAGE_STOP.**

**NOT Limber #92590** (unexpanded `$TMPDIR` write-allowlist token).

**NOT Chock #92582** (`blockReadsOutsideWorkingDirectories` ignores project/local additionalDirectories).

**NOT Deadman #92593** (timeout background + TaskStop shell-only + MSYS wipe).

**NOT Eidolon #92601** (security-guidance ENOENT fake notice loop).

**NOT Stroboscope** (terminal panel flicker / caret steal).

**NOT Diopter #92524** (per-session scratchpad UUID defocuses the prompt cache).

**NOT Scrim / Wraith paradigms.** Wraith's deleted-inode afterimage desk is a different defect.

**NOT leftover millimeter-sliders / woodworking leftovers.**

**NOT #92583 Snatch. NOT #92624.** Those backup issues do not ship.

Cousins cite-only (NOT primary): #92616, #92531, #92493. Different surfaces.

Do NOT rename this product Limber, Chock, Deadman, Eidolon, Stroboscope, Diopter, or Scrim.
Do NOT reuse idle silted / barred / runaway / haunted.
Do NOT reuse seeded drained / admitted / latched / staged.
Do NOT reuse blanked as a verdict.

Different surface: WINDOWS TEXT `content_block_delta` PAINT DEFERRAL (thinking live, text latent until `message_stop`) vs unexpanded `$TMPDIR` / settings-layer read-fence miss / timeout promote / ENOENT fake notice / flicker-focus / cache-lens.

Product name stays **Afterimage**. Name/slug `afterimage` confirmed unused in catalog.json (203 products).

Different UI: CRT phosphor / ophthalmology afterimage test card / darkroom retina field / persistence timeline. Instrument Serif / Plus Jakarta Sans / IBM Plex Mono. Dark violet / amber phosphor. NOT Fraunces/Source Sans 3/JetBrains Mono (Limber). NOT Bitter/Manrope (Chock). NOT Chakra Petch/Share Tech Mono (Deadman). NOT Playfair/Work Sans/Fira Code (Eidolon). NOT Cinzel (Touchstone display). NOT trial-lens / stroboscope flicker / scrim loft.

Different verbs: Score the afterimage, Pin idle latent, Pin seeded flushed, Admit flushed, Load fixtures, Reset to flushed, Expose the card, Flush the phosphor.

Different idle: **latent**. Different seeded: **flushed**. HOLD: **flushed**. ALARM: **latent** / **thinking-paints** / **text-zero-frames** / **mega-frame-stop** / **linux-progressive** / **nonstreaming-fallback-ruled-out** / **fine-grained-no-effect** / **cousins** / **has-clear-repro**.

## How to score

```bash
node --test projects/afterimage/hook/afterimage.test.mjs
node projects/afterimage/hook/index.mjs projects/afterimage/data/92596.json
echo '{"seed":"flushed","flushed":true}' | node projects/afterimage/hook/index.mjs
```

Open the living card at `projects/afterimage/index.html` (or the live path). Buttons: Score the afterimage, Pin idle latent, Pin seeded flushed, Admit flushed, Load fixtures, Reset to flushed. Expose the card. Flush the phosphor. Drop a fixture JSON or paste it. `?embed=1` hides chrome.

## Live path

- Path gate: https://hermes-playground-green.vercel.app/afterimage/
- Subdomain: https://afterimage.hermes-playground-green.vercel.app
- Folder: `projects/afterimage/`
