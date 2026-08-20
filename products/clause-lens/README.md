# Clause Lens

Auto-renew, assignment, and “we may change these terms” hide in paragraphs you already signed. Paste the clause. See the tripwires in place.

This is not Renew Trap. Renew Trap answers “which vendors bill if nobody cancels.” Clause Lens answers “which tripwires sit in this paragraph.” Not a cancel-by roster. This is not Unseen Ink (glyphs). This is not Quote Drift (invoice extras). One paste well, in-place highlights.

## Problem

Signed SaaS terms bury the moves that still bind you after you stop reading:

- does this term auto-renew if you stay silent?
- how many days of notice does non-renewal need?
- can they assign the agreement without consent?
- can they change the terms by posting an update?
- did they already pick venue or arbitration?

Existing tools in this catalogue inspect unicode, quote-vs-invoice extras, and vendor notice windows. They do not put one pasted clause under a loupe.

## Users

- founders who pasted a terms paragraph into notes and need the tripwires marked
- ops people who refuse to re-read a wall of prose for “automatically renews”
- anyone comparing a vendor clause before a card goes on file
- teams that want a no-backend, local-only pass — not a lawyer, not a board

## Workflow

1. Load the seed / demo: a short SaaS paragraph with auto-renew, a 30-day notice, assignment without consent, unilateral amendment, and a venue clause, mixed with harmless sentences
2. Read the well: tripwires are highlighted in place
3. Click a kind chip to scroll and focus the first hit
4. Read the compact gauge: counts by kind, plus one line for what happens if you do nothing
5. Copy the marked-up plain list of hits
6. Reset restores the seed
7. Refresh keeps the last paste

## Data model

The pasted value is raw text. Derived hits:

- `kind` — `auto-renew` | `notice` | `assignment` | `unilateral` | `venue`
- `label` — chip-facing name
- `start` / `end` — offsets in the paste
- `text` — the matched span

Derived gauge:

- counts by kind
- `consequence` — one line, e.g. auto-renew present → “If you do nothing, this term auto-renews.”

Persisted locally:

- last paste and mode (`seed` / `paste`) in `localStorage`

## Architecture

- static HTML/CSS/JS
- no backend required for the prototype
- heuristic regex / keyword matching in-browser
- one well: transparent textarea over an in-place highlight layer
- `localStorage` for the last paste
- copy of marked hits stays on-device

## UX

- legal desk loupe (dark, brass, sharp — not a vendor grid, not analog clocks, not a unicode UV board)
- one paste well with colored in-place highlights
- chips for auto-renew, notice window, assignment, unilateral change, venue / arbitration
- chip click focuses the first hit of that kind
- compact gauge under the well — counts plus one consequence line, not a 6+ row rail
- load seed, reset, copy marked hits
- last paste persists across refresh

## Deployment plan

- deploy as static files on Vercel
- keep each product in its own folder
- expose the product at `products/clause-lens/`

## Verification

- page loads in a browser without build tooling
- one paste well is in the DOM
- seed lights auto-renew and assignment, and at least one other kind
- chip click focuses a highlight
- reset restores the seed
- refresh persists the last paste
- no 6+ row data rail and no analog clock face as the main UI
