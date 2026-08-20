# Plumb

A wall looks straight until the bob hangs. The line is true. The wall is not. See the offset.

This is not Mix Bus. Mix Bus is faders on a bus. This is not Claim Scale. Claim Scale is a beam of claims. This is not Dark Floor. Dark Floor is rooms. This is not Offcut. Offcut is leftover millimetres on a stick. Plumb answers “how far is this wall from true vertical, at the floor.”

## Problem

A wall looks straight until the bob hangs:

- is the stud true?
- how many degrees does it lean?
- what leftover offset does that leave at the floor?
- what happens if the stud is taller?

Existing tools in this catalogue mix channels, weigh claims on a beam, fold a sheet, pack grams, leftover millimetres on a stick, and night plans of rooms. They do not hang a bob against a wall.

## Users

- people who already know a wall can look straight and still not be
- anyone who refuses to treat a paste of a survey as the product
- desks that want the leftover as a picture, not a scorecard
- teams that want a no-backend, local-only pass — not a mix, not a beam of claims, not rooms

## Workflow

1. Load the seed: 2400 mm stud, already out of plumb at 1.8°
2. Read the hang: a wall that leans, a bob that does not, live millimetres at the floor
3. Move the tilt (or use the arrow keys on the focused slider)
4. Optionally change stud height; the offset scales with tan(tilt)
5. Reset restores the seeded lean

## Data model

One hang:

- `tilt` — degrees from true vertical, about −5 to +5
- `height` — stud height in millimetres (default 2400)

Derived picture:

- floor offset = height × tan(tilt)
- the plumb line stays vertical
- the wall is the thing that leans

Nothing is persisted. Refresh restores the seeded hang.

## Architecture

- static HTML/CSS/JS
- no backend required for the prototype
- one SVG: a wall / stud and a hanging plumb bob
- tilt leans the wall; the bob does not lean
- no network, no npm, no localStorage

## UX

- one hang, not a spreadsheet, not a Gantt, not a floor plan, not a stock bar, not a bag, not a crease diagram, not a claims beam, not a mixer, not a clock
- seeded demo is already out of plumb on load
- live tilt degrees and floor-offset millimetres
- keyboard moves the focused tilt
- SVG text alternative names tilt degrees and floor offset mm
- reset returns the seed

## Deployment plan

- deploy as static files on Vercel
- keep each product in its own folder
- expose the product at `products/plumb/`

## Verification

- page loads in a browser without build tooling
- one SVG wall and bob is in the DOM
- seeded wall is not plumb
- changing tilt changes floor-offset mm
- the bob stays vertical
- no paste-well hero, no mix, no claims beam, no rooms
