# Reread Clock

A local half-life board for attestations that are still live while nobody has re-read the pack. Calendar expiry is the wrong signal. Trust should decay by last open.

This is not Vouch Slip. Vouch Slip answers “who vouches and when does the slip expire.” Reread Clock answers “has that person actually looked at the pack since they signed.” Distinct axis.

## Problem

A named vouch can stay “live” for months after the signer last opened the pack. Reviewers treat calendar expiry as the health check and miss the quieter failure: the human who signed has not re-read. Existing tools cluster around wax-seal clerks, hidden-glyph inspectors, MUST/NEVER boards, fluency maps, and inventory. They do not answer:

- when did this named signer last open the pack?
- how much claimed trust remains on a half-life curve?
- which signatures are stale but still signed?
- which clocks were just revived by a real reread?

## Users

- on-call owners who refuse unread-but-signed packs
- reviewers who inherited a live vouch and need a last-opened timestamp
- teams stacking inbound skill files after a gist dump
- anyone who needs a no-backend decay clock before a pack stays armed

## Workflow

1. Load the live attestation board (fresh, fading, stale, revived)
2. Apply the demo fixture to put at least two stale-but-signed clocks on the red rail
3. Pick a row and mark reread — resets the clock, does not change the vouch
4. Watch remaining % rise and stale count fall
5. Stretch or shrink the half-life; export or import JSON
6. Reset restores the seed

## Data model

Each live attestation tracks:

- `id`
- `pack` — inbound subject (fictional pack names reused from Vouch Slip)
- `signer` — named human who still vouches
- `signedOn`
- `lastReread` — empty when never opened after sign
- `halfLifeDays`
- `revived` — true after a reread that followed a stale stretch

Derived values:

- `remaining` — `100 * 0.5 ^ (ageDays / halfLifeDays)`, age from last reread or signed-on
- `status` — `fresh` (≥70%) | `fading` (≥30%) | `stale` (<30%) | `revived` (flagged reread and still fresh)
- `stale count` — still-signed rows below the stale threshold
- `mean remaining %` — average remaining across the board
- `trust still claimed vs last actually read` — live signature count versus mean days since last open

## Architecture

- static HTML/CSS/JS
- no backend required for the prototype
- `localStorage` persistence for the clock desk
- JSON export / import for a portable copy
- deterministic half-life scoring

## UX

- decay / clock lab (phosphor traces, cobalt rings — not a Vouch Slip wax desk, not Ghost Briefs, not Skill Clash fuses)
- live clock and half-life chamber
- stale count, mean remaining %, and claimed-vs-read line
- red stale-but-still-signed rail
- row board: pack, signer, signed-on, last-reread, half-life days, remaining %, status
- mark reread, stretch / shrink half-life, demo fixture, and one-click seed reset

## Deployment plan

- deploy as static files on Vercel
- keep each product in its own folder
- expose the product at `products/reread-clock/`

## Verification

- page loads in a browser without build tooling
- demo fixture produces at least two stale-but-signed clocks on the rail
- marking a reread raises remaining % and drops stale count
- refresh keeps the board
- export / import round-trips the same state
- reset restores the seed
