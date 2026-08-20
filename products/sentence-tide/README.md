# Sentence Tide

Walls of text hide the long sentences. Paste prose. See a tide of sentence lengths. Click a swell to find the sentence.

This is not Unseen Ink. Unseen Ink answers “which glyphs are hiding.” Sentence Tide answers “which sentences ran long.” Not unicode. Not invoices. Not clauses. One paste well, one waveform.

## Problem

Prose buries the sentence that actually went on too long:

- which sentence is the swell?
- how many words is the longest one?
- what share of sentences sit over 25 words?
- can you click the tall mark and land on that sentence in the well?
- what happens when you paste a new brief?

Existing tools in this catalogue inspect hidden unicode, quote-versus-invoice extras, and clause tripwires. They do not draw sentence length as a tide.

## Users

- writers who paste a brief and need the long sentences to stand up
- editors who refuse to re-read a wall of prose for the one 40-word line
- anyone comparing cadence before a pack goes out
- teams that want a no-backend, local-only pass — not a style linter, not a board

## Workflow

1. Load the seed / demo: a short brief with mostly tight sentences and two obviously long ones (40+ words)
2. Read the tide: each swell is a sentence; height is word count; the 25-word waterline is marked
3. Click a swell to highlight that sentence in the well and scroll it into view
4. Read the compact gauge: sentence count, longest word-count, % of sentences over 25 words
5. Paste your own prose to redraw the tide
6. Reset restores the seed
7. Refresh keeps the last paste

## Data model

The pasted value is raw text. Derived sentences:

- `text` — the sentence span
- `start` / `end` — offsets in the paste
- `words` — word count after a simple `.?!` split

Derived gauge:

- sentence count
- longest word-count
- percent of sentences over 25 words

Persisted locally:

- last paste and mode (`seed` / `paste`) in `localStorage`

## Architecture

- static HTML/CSS/JS
- no backend required for the prototype
- simple `.?!` sentence split in-browser
- one well plus an SVG waveform of sentence lengths
- `localStorage` for the last paste

## UX

- tide chart / phosphor waveform (dark, sharp — not a unicode UV board, not analog clocks, not a floor plan, not an invoice well)
- one paste well with in-place sentence marks
- clickable swells; tall marks are the punch
- compact gauge under the tide — three numbers, not a 6+ row rail
- load seed, reset
- last paste persists across refresh

## Deployment plan

- deploy as static files on Vercel
- keep each product in its own folder
- expose the product at `products/sentence-tide/`

## Verification

- page loads in a browser without build tooling
- one paste well and a tide/waveform are in the DOM
- seed has ≥ 2 swells taller than the median
- clicking a tall swell highlights a long sentence in the well
- reset restores the seed
- refresh persists the last paste
- no 6+ row data rail, no analog clock face, and no floor plan as the main UI
