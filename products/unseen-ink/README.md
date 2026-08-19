# Unseen Ink

A local, no-install inspector that reveals inbound hidden Unicode — ZWSP, bidi overrides, tag characters, and homoglyph-adjacent lookalikes — before that text hits an agent or a merge.

## Problem

This week’s tools *strip* marks from content you already own. Reviewers still need to *see* inbound hidden glyphs. PRs, READMEs, and skill files can carry:

- bidi overrides that make `user_exe.png` out of `user_…gnp.exe`
- zero-width spaces that hide a second policy between ordinary words
- Unicode tag characters that encode a stealth string most diffs never show
- homoglyph-adjacent letters that impersonate Latin identifiers

Existing watermark strippers and provenance cleaners optimize for outbound sanitization. They do not give a reviewer a local board of what just arrived.

## Users

- reviewers of inbound PRs, READMEs, and `SKILL.md` fragments
- engineers who paste third-party skill text into an agent
- security-minded maintainers who want to see stealth codepoints, not silently delete them
- anyone who needs a no-backend, local-only pass before merge

## Workflow

1. Load the seed (a bidi-trojan plus ZWSP and tag characters) so the board lights immediately
2. Read the UV reveal: hidden codepoints become labeled marks in place
3. Scan the ledger: codepoint, Unicode name, count, and why it matters
4. Load the clean-text control to confirm a plain ASCII paste stays clean
5. Optionally copy visible-only text *after* the marks have been shown (never the only mode)
6. Drop a `.txt` / `.md` file, or reset to the seed

## Data model

Inbound document:

- `source` — the pasted or dropped text (bytes preserved; nothing stripped by default)

Derived per codepoint:

- `cp` — `U+XXXX`
- `name` — Unicode name or tag-letter label
- `kind` — `bidi override` | `zero-width` | `tag` | `homoglyph-adjacent`
- `count` — occurrences in this paste
- `why` — reviewer-facing risk note

Persisted locally (optional):

- last paste and mode (`seed` / `demo` / `clean` / `paste`) in `localStorage`

## Architecture

- static HTML/CSS/JS
- no backend required for the prototype
- inspection is in-browser and stays on-device
- `localStorage` for the last paste
- deterministic classification (no network, no model)

## UX

- UV-lamp reveal board (phosphor / magenta / cyan / amber — not a catalogue reskin)
- paste textarea plus optional `.txt` / `.md` file drop
- seed and demo fixture that light bidi, ZWSP, and tag hits
- clean-text control that stays clean
- ledger table of codepoint / name / count / why
- copy visible-only only after marks are visible
- one-click seed reset

## Deployment plan

- deploy as static files on Vercel
- keep each product in its own folder
- expose the product at `products/unseen-ink/`

## Verification

- page loads in a browser without build tooling
- demo / seed fixture produces bidi (`U+202E`), zero-width (`U+200B`), and tag (`U+E0069`…) hits by codepoint
- clean control produces zero hits and a clean board state
- reset restores the seed and lights the board again
- copy visible-only stays disabled on the clean control
