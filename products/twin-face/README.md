# Twin Face

A timestamp is one string. Two people hear two times. Paste once, see two analog faces.

This is not Quiet Landing. Quiet Landing answers “does this queued send land while they are asleep.” Twin Face answers “what does this instant look like on two analog clocks.” No send list. No quiet-hours rail. This is not Pager Face (on-call rotation). This is not Unseen Ink (hidden glyphs). One paste, two clocks.

## Problem

A timestamp arrives as one string: ISO, RFC, or “Thu 20 Aug 2026 09:50 AEST.” One person hears Thursday morning in Sydney. The other hears Wednesday evening in New York. Existing tools in this catalogue inspect glyphs, queued sends, leftover access, and on-call rings. They do not put one paste on two analog faces:

- what civil time is this instant in each zone?
- do the analog hands actually disagree?
- did the calendar date split across the pair?
- how many hours and minutes is one face ahead or behind the other?

## Users

- people who paste a timestamp and need two wall times, not a conversion table
- ops who refuse to do Sydney ↔ New York math in their head
- anyone reviewing a log line, a calendar invite, or a “meet at 09:50” that hid the zone
- teams that want a no-backend pair of faces before the next cross-ocean call

## Workflow

1. Load the seed / demo timestamp (Sydney 09:50 AEST on 20 Aug 2026)
2. Read the two analog faces: Australia/Sydney and America/New_York
3. Read under each face: zone, local civil time, UTC offset, day-of-week
4. See the date-split flag when the calendar day differs
5. Read the compact delta line under the pair
6. Change a zone, or swap faces
7. Reset restores the seed timestamp and seed zones
8. Refresh keeps the last paste and the last two zones

## Data model

The pasted value is raw text. Derived instant:

- `date` — a `Date` from ISO, RFC, or a civil string with a known abbreviation (`AEST`, `AEDT`, `EDT`, …)
- `leftZone` / `rightZone` — IANA names from the pickers
- `parts` — weekday, civil date, hour, minute, second, UTC offset in that zone
- `dateSplit` — true when the two calendar dates disagree
- `delta` — signed minutes from left face to right face

Persisted locally:

- last paste, last two zones, and mode (`seed` / `demo` / `paste`) in `localStorage`

## Architecture

- static HTML/CSS/JS
- no backend required for the prototype
- `Date` plus abbreviation → offset rewrite for strings like `Thu 20 Aug 2026 09:50 AEST`
- local civil time via `Intl.DateTimeFormat` with IANA `timeZone`
- two SVG analog faces; hands are computed from each zone’s wall time
- `localStorage` for the last paste and the last two zones

## UX

- twin analog instruments on a night desk (dark, sharp — not a send queue, not a quiet-hours red rail, not an on-call ring)
- one paste field above the pair
- two independently zoned analog faces
- under each face: zone name, local civil time, UTC offset, day-of-week
- date-split flag when the calendar dates differ
- compact hours/minutes ahead/behind line under the pair — not a 6+ row rail
- zone pickers, swap, seed/demo, reset
- last paste and last two zones persist across refresh

## Deployment plan

- deploy as static files on Vercel
- keep each product in its own folder
- expose the product at `products/twin-face/`

## Verification

- page loads in a browser without build tooling
- two analog clocks are in the DOM (`svg`)
- seed timestamp produces two different local times for Sydney vs New York
- swapping zones swaps the displayed locals
- a date-line difference is visible if the seed crosses midnight
- refresh persists the last paste and the last two zones
- reset restores the seed
- no send queue / quiet-hours rail as the main UI
