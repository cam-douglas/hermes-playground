# Glide

An approach looks plenty until you see the glide. Move the range. See the leftover air.

This is not Yaw. Yaw is leftover heading versus a dashed true course. This is not Throw. Throw is a vent plume across a room. This is not Scope. Scope is rode versus the seabed. This is not Quiet Landing. Quiet Landing is timezone courtesy. This is not a clock. Glide answers “how far you still have versus how far you can still fly, as seen from the side.”

## Problem

An approach looks plenty until you see the glide:

- how far can the leftover still fly?
- how far is still left to the numbers?
- is the leftover short, or enough?
- when is the shortage obvious — as a picture, not a pilot sign-off?

Existing tools in this catalogue measure leftover heading, a vent plume, a rode versus the bottom, and timezone courtesy. They do not show leftover range of an approach.

## Users

- people who already know an approach can look plenty until the leftover range shows
- anyone who refuses to treat a heading, a vent, a rode, or a clock as this leftover
- desks that want glide as a picture, not an approach plate
- teams that want a no-backend, local-only pass — not Yaw, not Throw, not Scope, not a paste well

## Workflow

1. Load the seed: 140 m of height, 1.12 km of range against 1.56 km still to the numbers — already short
2. Read the scene: side view of a mark, leftover range, dashed enough-glide to the numbers
3. Move height (or use the arrow keys on the focused slider); leftover names short or enough
4. Raise the height and the range reaches; drop it and the shortage grows
5. Reset restores the seeded leftover short

## Data model

One side view of an approach:

- `height` — metres of leftover height (default 140)
- range is height × 8
- still-have to the numbers is 1.56 km

Derived picture:

- leftover labelled as a sketch (short / enough), not a pilot sign-off
- enough when range meets or passes the still-have

Nothing is persisted. Refresh restores the seeded scene.

## Architecture

- static HTML/CSS/JS
- no backend required for the prototype
- one SVG scene: a mark on an approach, leftover range, dashed enough-glide
- moving a control redraws the leftover immediately
- `?embed=1` hides catalogue chrome so the hub living well can iframe this page
- no network, no npm, no localStorage

## UX

- leftover range in side view, not a spreadsheet, not a Gantt, not a night plan of rooms, not a cut-list stick, not a bag, not a crease diagram, not a claims beam, not a mixer, not a plumb bob, not a catenary, not a lamp, not a road crown, not a focus plane, not a partition, not a grain-angle dial, not a door, not talk columns, not gears, not a kerf gap, not a rode, not a vent, not wheels, not a chair, not a stair, not a pedal, not a ceiling, not a heading, not a clock
- seeded demo already shows a visible leftover (not plenty / not enough)
- live range, leftover labelled as a sketch (short / enough)
- keyboard moves the focused control
- SVG text alternative names whether glide is short
- reset returns the seed

## Deployment plan

- deploy as static files on Vercel
- keep each product in its own folder
- expose the product at `products/glide/`

## Verification

- page loads in a browser without build tooling
- one SVG scene (approach / leftover range) is in the DOM
- seeded leftover is visible (short — not plenty)
- changing a control redraws and updates the readout
- no paste-well hero, no heading, no vent, no rode, no clock face
