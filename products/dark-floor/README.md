# Dark Floor

Room calendars say booked. The floor is empty. This instrument draws the afternoon as a night plan: booked-and-empty rooms go dark, occupied rooms keep their lights, free rooms stay outline.

This is not Hold Stack. Hold Stack answers “how many holds sit on the same hour.” Dark Floor answers “which booked rooms are actually empty.” Geometry of a floor, not a day strip. Not a clock. Not a scanner.

## Problem

Room calendars lie about presence. A board room is booked until 16:00 and the lights are off. An exec hold owns the focus cave and nobody walked in. Existing tools in this catalogue map overlapping holds on a day tape, leftover access, and on-call rings. They do not answer:

- which rooms are booked and empty right now?
- who booked the dark room, and until when?
- if you walk the floor, which “busy” rooms are actually vacant?
- what happens when you mark a dark room occupied?
- how many booked-empty rooms remain after you walk the plan?

## Users

- workplace / facilities people who inherit a calendar that says full
- EAs who parked a hold for exec and need to see it sitting empty
- anyone who has walked a “fully booked” floor and found it dark
- teams that need a no-backend presence plan before they release a room

## Workflow

1. Load the night plan (seed L4 west wing, 13:00–18:00)
2. Read the floor: dark rooms are booked and empty; warm rooms are occupied; outlines are free
3. Click a room for who booked it, until when, and whether anyone is there
4. Mark the focused room occupied or empty
5. Scrub the now-marker across the afternoon if a booking window matters
6. Apply the demo fixture to darken ≥ 3 booked rooms
7. Export or import JSON
8. Reset restores the seed

## Data model

Each room tracks:

- `id`
- `name` — Board, Huddle A, phone booth, kitchen, open bay
- `kind` — `board` | `huddle` | `booth` | `kitchen` | `bay` | `focus` | `war`
- `title` — the calendar subject (standup overflow, hold for exec)
- `bookedBy` — who put it on the room calendar
- `startMin` / `endMin` — minutes from local midnight
- `occupied` — true when someone is actually in the room
- `holdForExec` — true for the empty exec hold

The play-head tracks:

- `nowMin` — pinned afternoon minute when scrubbing

Derived values:

- `booked` — `nowMin` sits inside `startMin`–`endMin` (kitchen never books)
- `dark` — booked and not occupied
- `status` — `dark` | `occupied` | `free` | `open`
- `dark count` — booked-empty rooms at the play-head

Persisted locally:

- rooms, now-marker, and focused room in `localStorage`

## Architecture

- static HTML/CSS/JS
- no backend required for the prototype
- SVG floor plan (clickable room polygons) as the primary UI
- `localStorage` persistence for the floor and scrub
- JSON export / import for a portable copy
- presence derived in the browser from booking windows + occupied flags, not from a badge API

## UX

- architectural night plan (dark, sharp, title-block — not a film-strip, not analog clocks)
- clickable rooms on a plan; fill encodes status; dark rooms are the punch
- compact readout: who booked, until when, occupied? — not a 6+ row rail
- mark occupied / mark empty, demo fixture, seed reset
- optional afternoon scrub 13:00–18:00
- last floor persists across refresh

## Deployment plan

- deploy as static files on Vercel
- keep each product in its own folder
- expose the product at `products/dark-floor/`

## Verification

- page loads in a browser without build tooling
- a floor-plan SVG is in the DOM
- seed has ≥ 1 dark / booked-empty room
- demo fixture makes ≥ 3 dark rooms
- marking a dark room occupied drops the dark count
- refresh keeps the floor and scrub
- reset restores the seed
- no day strip and no rail of 6+ data rows as the main UI
