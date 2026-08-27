# Blot

Darkroom tray for image-poisoned sessions. A bad frame is not a hold. One unreadable image kills every later turn.

Extension-as-image (HTML 404 saved as `.png`), HEIC, Git LFS pointers, error text in a `.png`, valid-magic / corrupt-pixel PNGs, and Codex HEIC threads all produce the same class: the rejected payload is replayed forever.

Inspect every image frame. Score it. Strip the blot. Replace the poison block with a text placeholder so the session can continue.

Verdicts: **clear**, **heic**, **lfs**, **spoof**, **rot**, **replay**. Idle word is **clear**.

Not Coda. Not Reed. Not Fathom. Not Hasp. Not Parity. Not Reveille. Not Quench. Not Scrim. Not Knock. Not a leftover slider.

## Live catalog path

`/blot/` is this static darkroom. Demo works with no secrets and no npm.

1. Seeded OSStatus spoof `#24387` is already on the tray: `/tmp/screenshot.png` is 173 bytes of `OSStatus error -2700` claimed as `image/png` → **spoof**.
2. Switch `#16169` — HEIC from `~/Pictures/IMG_1042.HEIC` → **heic**.
3. Switch `#32764` — Git LFS pointer Read as `test.png` → **lfs**.
4. Switch `#47391` — tool-returned PNG already looping → **replay**.
5. Switch `#10833` — Codex HEIC thread already stuck; looping wins → **replay**.
6. **Strip** replaces every poison frame with `[image removed to fix conversation]` and the tray goes **clear**. **Abandon** deletes the session file and keeps the poison verdict. **Mark** re-scores. **Clear · clear** empties the tray to **clear**.
7. Slack / GitHub / Linear rows are honest demo copy unless env keys exist on the hook.
8. Idle word is **clear**. Never the product name.

## Hook

`projects/blot/hook/` is a PostToolUse darkroom engine. Inspect every frame. Score it. Strip the blot. See `hook/README.md`.

```bash
node projects/blot/hook/index.mjs --listen 8850
node --test projects/blot/hook/blot.test.mjs
```

## Evidence (do not invent more)

- [anthropics/claude-code#24387](https://github.com/anthropics/claude-code/issues/24387) — corrupted / mismatched image permanently breaks session; 400 loop; 173-byte OSStatus error written to screenshot.png (PRIMARY seed)
- [anthropics/claude-code#16169](https://github.com/anthropics/claude-code/issues/16169) — HEIC permanently destroys the session
- [anthropics/claude-code#32764](https://github.com/anthropics/claude-code/issues/32764) — Git LFS pointer file Read as icon.png → unrecoverable loop
- [anthropics/claude-code#47391](https://github.com/anthropics/claude-code/issues/47391) and [#50708](https://github.com/anthropics/claude-code/issues/50708) — tool-returned / Read PNG baked in; later 400; compact also dies
- [openai/codex#10833](https://github.com/openai/codex/issues/10833) and [#7214](https://github.com/openai/codex/issues/7214) — HEIC upload; thread stuck on "Invalid image in your last message"
