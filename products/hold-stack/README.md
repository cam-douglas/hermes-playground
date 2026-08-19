# Hold Stack

A local day-strip map of overlapping calendar holds. The calendar looks empty. The same hour is stacked: a real meeting, a hold for exec, two 1:1s, travel. This instrument draws the pile as a film-strip of the day, then lets you release or split a block.

This is not Pager Face. Pager Face answers “whose night is it on the on-call ring.” Hold Stack answers “how many holds are sitting on the same hour, and which one do you kill.” Geometry of a day, not a roster table. Not Quiet Landing (send landing times).

## Problem

Calendars hide collision. A “free” Tuesday is three holds and a travel block on 14:00. Agenda views flatten the pile into a list. Existing tools cluster around on-call rings, leftover access, send courtesy, and scanners. They do not answer:

- which hour of this day is actually stacked?
- who booked the hold that is sitting on a real 1:1?
- how deep is the pile at the now-marker?
- what happens if you release one block, or split it at now?
- which hours still have overlap ≥ 2 after you cut?

## Users

- EAs and chiefs of staff who inherit a day of “holds” that are not meetings
- founders whose Tuesday looks empty and is not
- anyone who has to choose which overlapping 1:1 dies
- teams that need a no-backend overlap map before the next exec travel day

## Workflow

1. Load the day strip (seed workday, 08:00–20:00, 24h toggle)
2. Read the pile: stacked lanes, heat under each hour, peak overlap
3. Click a block to focus it (who booked, kind, start–end, overlap count)
4. Release the focused hold, or split it at the now-marker
5. Scrub the now-marker across the strip
6. Apply the demo fixture to pile ≥ 3 blocks on one hour
7. Export or import JSON
8. Reset restores the seed

## Data model

Each hold tracks:

- `id`
- `title` — standup, hold for exec, travel, focus, 1:1
- `bookedBy` — who put it on the day
- `kind` — `meeting` | `hold` | `travel` | `focus` | `1:1`
- `startMin` / `endMin` — minutes from local midnight (0–1440)
- `released` — true when the operator cut it from the pile

The play-head tracks:

- `live` — true when the marker follows Sydney wall time
- `nowMin` — pinned minutes from midnight when scrubbing
- `view24` — true for 00:00–24:00; false for 08:00–20:00

Derived values:

- `lanes` — swim/cascade assignment so overlapping holds stack
- `depth at t` — count of active holds covering minute `t`
- `peak overlap` — max depth across the day
- `overlap hours` — hours whose max depth is ≥ 2
- `released count` — holds marked released
- `focus overlap` — other active holds that collide with the focused block

## Architecture

- static HTML/CSS/JS
- no backend required for the prototype
- CSS-positioned day strip (lanes + heat + play-head)
- `localStorage` persistence for the day and scrub
- JSON export / import for a portable copy
- overlap derived in the browser from start/end minutes, not from a calendar API

## UX

- film-strip / tape-deck of the day (sprockets, play-head, amber heat — not a red rail of rows, not a clock face)
- horizontal 08:00–20:00 strip with a 24h toggle
- blocks stacked in overlap lanes; heat under each hour shows depth
- click a block to focus it; scrub the now-marker
- release, split at now, demo pile, seed reset
- compact readout under the strip: peak overlap, hours with overlap ≥ 2, released count — not a data table

## Deployment plan

- deploy as static files on Vercel
- keep each product in its own folder
- expose the product at `products/hold-stack/`

## Verification

- page loads in a browser without build tooling
- a day strip is in the DOM
- seed has a visible overlap (peak ≥ 2)
- demo fixture makes peak ≥ 3
- releasing a focused overlapping hold drops peak or overlap-hours
- refresh keeps the day and scrub
- reset restores the seed
- no rail of 6+ data rows as the main UI
