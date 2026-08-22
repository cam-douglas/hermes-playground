# Chine

A hull looks round until you see the chine. Move the knuckle. See the leftover crease.

This is not Heel. Heel is leftover hull list. This is not Freeboard. Freeboard is leftover hull above water. This is not Scupper. Scupper is leftover drain through the bulwark. This is not Coaming. Coaming is leftover hatch lip. This is not Camber. Camber is leftover road crown. This is not Bank. Bank is leftover wing roll. This is not Packed sky. Packed sky is last hour’s lattice. This is not a clock. Chine answers “how far the leftover knuckle still creases where bottom meets side, leftover hull crease as seen in a midship section.”

## Problem

A hull looks round until you see the chine:

- how far does the leftover knuckle still crease where bottom meets side?
- is the leftover round, or showing?
- when is the leftover crease obvious — as a sketch, not a lines plan?

Existing tools in this catalogue measure leftover hull list, leftover hull above water, leftover drain through a bulwark, leftover hatch lip, leftover road crown, leftover wing roll, leftover doorway bar, leftover window bar, leftover sash-frame, leftover lintel span, leftover tread hang, leftover jutting stone, and leftover vault infill. They do not show leftover hull crease — how far a chine still knuckles where the bottom meets the side.

## Users

- people who already know a hull can look round until the leftover chine shows
- anyone who refuses to treat a heel, a freeboard, a scupper, a coaming, a camber, a bank, a packed sky, or a clock as this leftover
- desks that want chine as a sketch, not a lines plan
- teams that want a no-backend, local-only pass — not Heel, not Freeboard, not Scupper, not Coaming, not a paste well

## Workflow

1. Load the seed: 18° of leftover knuckle — already showing, not round
2. Read the scene: one midship section, a hull whose leftover is the crease where bottom meets side, leftover labelled as a sketch
3. Move knuckle (or use the arrow keys on the focused slider); leftover names showing or round
4. Drop the leftover toward 0° and the hull looks round / flush; raise it and the leftover crease shows
5. Reset restores the seeded leftover showing

## Data model

One midship section with leftover chine as leftover knuckle:

- `knuckle` — degrees of leftover crease where bottom meets side (default 18)

Derived picture:

- leftover labelled as a sketch (round / showing), not a lines plan
- leftover crease labelled as a sketch
- round / flush when knuckle ≤ 2°

Nothing is persisted. Refresh restores the seeded scene.

## Architecture

- static HTML/CSS/JS
- no backend required for the prototype
- one SVG scene: a midship section — a hull whose leftover is the chine; leftover is how far the leftover knuckle still creases where bottom meets side
- moving a control redraws the leftover immediately
- `?embed=1` hides catalogue chrome so the hub living well can iframe this page
- no network, no npm, no localStorage

## UX

- one leftover hull crease in a midship section, not a spreadsheet, not a Gantt, not a floor plan of rooms, not a cut-list stick, not a bag, not a crease diagram of paper, not a claims beam, not a mixer, not a plumb bob, not a catenary, not a lamp, not a road crown, not a focus plane, not a partition, not a grain-angle dial, not a door swing, not talk columns, not gears, not a kerf gap, not a rode, not a vent plume, not wheels, not a chair, not a stair, not a pedal, not a ceiling, not a heading, not a glide, not a sash leftover frame, not an eave overhang, not a rail, not a list, not a retaining wall, not a brick course, not a wing, not a fetch, not a lot line, not a crane, not a tree, not a scarf, not a hill, not a keystone lock, not a plinth, not a lintel, not a freeboard, not a flue, not a parapet, not a rabbet, not a nosing hang, not a going, not a spandrel triangle, not a corbel jut, not a window mullion, not a doorway threshold, not a hatch coaming, not a scupper drain, not a clock
- seeded demo already shows a visible leftover (not round)
- live knuckle, leftover labelled as a sketch (round / showing)
- keyboard moves the focused control
- SVG text alternative names whether the chine is showing
- reset returns the seed

## Deployment plan

- deploy as static files on Vercel
- keep each product in its own folder
- expose the product at `products/chine/`

## Verification

- page loads in a browser without build tooling
- one SVG scene (midship section / leftover hull crease) is in the DOM
- seeded leftover is visible (showing — not round)
- changing a control redraws and updates the readout
- no paste-well hero, no heel list, no freeboard waterline, no scupper drain, no coaming hatch, no road camber, no wing bank, no clock face
