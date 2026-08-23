# Arris

A joint looks eased until you see the arris. Move the edge. See the leftover sharp.

This is not Kerf. Kerf is leftover blade gap. This is not Rabbet. Rabbet is leftover rebate shoulder. This is not Scarf. Scarf is leftover overlap. This is not Grain. Grain is leftover cut mismatch. This is not Fascia. Fascia is leftover rafter-tail cover. This is not Soffit. This is not Eave. This is not Packed sky. This is not a clock. Arris answers “how far the leftover sharp still stands before the edge is eased.”

## Problem

A joint looks eased until you see the arris:

- how far does the leftover sharp still stand before the edge is eased?
- is the leftover eased, or showing?
- when is the leftover sharp obvious — as a sketch, not a joinery sign-off?

Existing tools in this catalogue measure leftover blade gap, leftover rebate shoulder, leftover timber overlap, leftover cut-versus-grain mismatch, leftover board covering rafter tails, leftover underside plane, leftover roof overhang, leftover hull crease, leftover drain through a bulwark, leftover hatch lip, leftover doorway bar, leftover window bar, leftover sash-frame, leftover lintel span, leftover tread hang, leftover jutting stone, and leftover vault infill. They do not show leftover sharp where two planes meet.

## Users

- people who already know a joint can look eased until the leftover arris shows
- anyone who refuses to treat a kerf, a rabbet, a scarf, a grain cut, a fascia board, a soffit, an eave, a packed sky, or a clock as this leftover
- desks that want arris as a sketch, not a joinery sign-off
- teams that want a no-backend, local-only pass — not Kerf, not Rabbet, not Scarf, not Grain, not Fascia, not a paste well

## Workflow

1. Load the seed: 5 mm of leftover arris — already showing, not eased / not flush
2. Read the scene: one section, two planes meeting whose leftover is the arris, leftover labelled as a sketch
3. Move arris (or use the arrow keys on the focused slider); leftover names showing or eased
4. Drop the leftover toward 0 mm and the joint looks eased / no leftover sharp; raise it and the leftover sharp stands
5. Reset restores the seeded leftover showing

## Data model

One section with leftover arris as leftover sharp where two planes meet:

- `arris` — millimetres of leftover sharp (default 5)

Derived picture:

- leftover labelled as a sketch (eased / showing), not a joinery sign-off
- leftover sharp labelled as a sketch
- eased / flush when arris ≤ 0.4 mm (the joint looks eased; no leftover sharp)

Nothing is persisted. Refresh restores the seeded scene.

## Architecture

- static HTML/CSS/JS
- no backend required for the prototype
- one SVG scene: a section — two planes meeting whose leftover is the arris; leftover is how far the leftover sharp still stands before the edge is eased
- moving a control redraws the leftover immediately
- `?embed=1` hides catalogue chrome so the hub living well can iframe this page
- no network, no npm, no localStorage

## UX

- one leftover sharp where two planes meet in a section, not a spreadsheet, not a Gantt, not a floor plan of rooms, not a cut-list stick, not a bag, not a crease diagram of paper, not a claims beam, not a mixer, not a plumb bob, not a catenary, not a lamp, not a road crown, not a focus plane, not a partition, not a grain-angle dial, not a door swing, not talk columns, not gears, not a kerf gap, not a rode, not a vent plume, not wheels, not a chair, not a stair, not a pedal, not a ceiling, not a heading, not a glide, not a sash leftover frame, not an eave overhang as shade, not a soffit underside plane, not a fascia board, not a rail, not a list, not a retaining wall, not a brick course, not a wing, not a fetch, not a lot line, not a crane, not a tree, not a scarf, not a hill, not a keystone lock, not a plinth, not a lintel, not a freeboard, not a flue, not a parapet wall, not a rabbet shoulder, not a nosing hang, not a going, not a spandrel triangle, not a corbel jut, not a window mullion, not a doorway threshold, not a hatch coaming, not a scupper drain, not a hull chine, not a clock
- seeded demo already shows a visible leftover (not eased / not flush)
- live arris, leftover labelled as a sketch (eased / showing)
- keyboard moves the focused control
- SVG text alternative names whether the arris is showing
- reset returns the seed

## Deployment plan

- deploy as static files on Vercel
- keep each product in its own folder
- expose the product at `products/arris/`

## Verification

- page loads in a browser without build tooling
- one SVG scene (section / two planes meeting / leftover arris) is in the DOM
- seeded leftover is visible (showing — not eased)
- changing a control redraws and updates the readout
- no paste-well hero, no kerf gap as the hero, no rabbet shoulder, no scarf overlap, no fascia board, no soffit plane, no clock face
