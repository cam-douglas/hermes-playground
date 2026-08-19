# Pager Face

A local 24-hour pager clock for on-call rotations. A wiki roster is a list. At 3am you need a face: whose night is it, when does it hand off, is the backup actually awake. This instrument draws the rotation as shift arcs on a Sydney meridian ring, with a now-hand you can scrub.

This is not Quiet Landing. Quiet Landing answers “does this scheduled send land while they are asleep.” Pager Face answers “who is on the pager right now, and are they inside their own night.” Rotation geometry, not outbound courtesy. Not Still Inside (leftover access). Not a roster table.

## Problem

On-call lives in a wiki table. The table does not tell you, at a glance, whose night it is. Follow-the-sun names hide the geometry: a “Berlin morning” shift can be 00:00–06:00 local. Backup may be the only person awake. Existing tools cluster around leftover access, send-landing courtesy, contract rails, and scanners. They do not answer:

- who is primary on this hour of the ring?
- who is backup, and are they in a workday or a night?
- how many minutes until the handoff?
- is the current primary inside their own quiet hours (22:00–07:00 local)?
- what does this arc look like if you swap primary and backup?

## Users

- on-call leads who refuse to read a roster wiki at 3am
- follow-the-sun teams (Sydney / Berlin / NYC / Auckland) who need the overlap, not the spreadsheet
- anyone paging a “primary” who is already inside their own 23:00–07:00
- teams that need a no-backend pager face before the next night watch

## Workflow

1. Load the 24-hour pager face (seed rotation, Sydney meridian)
2. Read the center: primary, backup, minutes to handoff, quiet-hours flag
3. Scrub the now-hand around the day, or click an arc to focus that shift
4. Swap primary / backup on the focused arc
5. Apply the demo fixture to land the hand on a quiet-hours overlap
6. Export or import the rotation as JSON
7. Reset restores the seed

## Data model

Each shift arc tracks:

- `id`
- `label` — graveyard, morning, afternoon, evening
- `startMin` / `endMin` — minutes from Sydney midnight (0–1440)
- `primary` — `{ name, zone, city }` (IANA zone)
- `backup` — `{ name, zone, city }`

The now-hand tracks:

- `live` — true when the hand follows Sydney wall time
- `scrubMinutes` — pinned Sydney minutes from midnight when scrubbing

Derived values:

- `current shift` — the arc that contains the now-hand
- `minutes to handoff` — remaining minutes in the current arc
- `primary local` / `backup local` — wall time in each person’s zone at the now-hand instant
- `quiet primary` — primary local time is inside 22:00–07:00
- `awake-primary` vs `asleep-primary`
- `next handoff` — Sydney clock time of the current arc’s end

## Architecture

- static HTML/CSS/JS
- no backend required for the prototype
- SVG 24-hour clock face (arcs, ticks, now-hand)
- `localStorage` persistence for the rotation and scrub
- JSON export / import for a portable copy
- local times computed in the browser from IANA zones (`Intl`), not copied from Sydney

## UX

- instrument / analog night-watch clock (brass bezel, phosphor hand — not a red rail of rows, not an ops spreadsheet)
- 24-hour ring divided into shift arcs; now-hand on the current (or scrubbed) hour
- center readout: primary, backup, minutes to handoff, quiet-hours flag
- click an arc to focus it (who, zone, local time at the now-hand)
- scrub the day, swap the focused arc, demo fixture, seed reset
- compact legend under the clock: asleep/awake primary, next handoff — not a data table

## Deployment plan

- deploy as static files on Vercel
- keep each product in its own folder
- expose the product at `products/pager-face/`

## Verification

- page loads in a browser without build tooling
- a clock / ring is in the DOM (`svg`)
- center names a primary
- scrubbing the now-hand changes the primary or minutes-to-handoff
- demo fixture lands the hand on a quiet-hours overlap; center says the primary is in quiet hours
- refresh keeps the rotation and scrub
- reset restores the seed
- no rail of 6+ data rows as the main UI
