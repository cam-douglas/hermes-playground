# Renew Trap

A local notice-window board for SaaS and vendor contracts that auto-renew while the owner is in another thread. Calendar reminders fire the day the money leaves. This desk tracks vendors, cancel-by dates, a named owner, and the red rail of “silence bills you.”

This is not Reorder Radar. Reorder Radar answers “which SKUs are low.” Renew Trap answers “which contracts will charge if nobody cancels.” Distinct axis: contracts, not stock. Not a skill/attestation tool.

## Problem

Vendors auto-renew on a date the calendar only notices when the card is already charged. Notice windows close quietly. Seats, domains, insurance, and “free trials that became annual” keep billing because nobody was named, or the named owner was in another thread. Existing tools cluster around inventory cockpits, half-life labs, wax-seal clerks, and skill scanners. They do not answer:

- when is the last day we can still cancel?
- who owns this vendor, by name?
- which contracts are already past cancel-by and will renew?
- how many dollars leave if the board stays silent?

## Users

- finance/ops owners who refuse calendar-day reminders
- founders carrying a pile of SaaS after a hiring or vendor binge
- anyone who inherited a card on file and needs a cancel-by, not a renews-on
- teams that need a no-backend notice desk before the next annual hits

## Workflow

1. Load the notice-window board (open, closing this week, trapped, saved, ownerless)
2. Apply the demo fixture to put at least two trapped / ownerless vendors on the red rail
3. Pick a row and name an owner, or mark cancelled in time
4. Watch trapped / ownerless counts fall and dollars-at-risk drop
5. Stretch or shrink the notice window; export or import JSON
6. Reset restores the seed

## Data model

Each vendor contract tracks:

- `id`
- `vendor` — who bills
- `plan` — the SKU-of-contract, not inventory
- `cadence` — `annual` or `monthly`
- `amount` — next charge, display only
- `owner` — named human, or vacant
- `cancelBy`
- `renewsOn`
- `cancelled` — true when cancelled in time (or after, as a saved-from-next-cycle mark)

Derived values:

- `noticeDaysLeft` — days from today to `cancelBy` (negative once past)
- `status` — `saved` (cancelled) | `trapped` (past cancel-by, still active) | `ownerless` (no named owner, still active) | `closing` (notice ends this week) | `open`
- `trapped count` — past cancel-by, still active
- `ownerless count` — vacant owner, still active
- `dollars at risk` — next-charge sum for trapped, closing, and ownerless rows (silence bills you)

## Architecture

- static HTML/CSS/JS
- no backend required for the prototype
- `localStorage` persistence for the notice desk
- JSON export / import for a portable copy
- deterministic notice-window scoring

## UX

- finance / ops notice desk (ledger rules, crimson trap rail, brass dollars — not an inventory cockpit, not a wax seal, not a half-life lab)
- live clock and acting-as owner field
- trapped count, ownerless count, and dollars about to renew if nobody acts
- red “silence bills you” rail
- row board: vendor, plan, annual/monthly $, named owner (or vacant), cancel-by, renews-on, notice days left, status
- name an owner, mark cancelled, stretch / shrink notice window, demo fixture, and one-click seed reset

## Deployment plan

- deploy as static files on Vercel
- keep each product in its own folder
- expose the product at `products/renew-trap/`

## Verification

- page loads in a browser without build tooling
- demo fixture produces at least two trapped / ownerless vendors on the rail
- naming an owner drops ownerless count; marking cancelled drops trapped count
- dollars-at-risk updates after those actions
- refresh keeps the board
- export / import round-trips the same state
- reset restores the seed
