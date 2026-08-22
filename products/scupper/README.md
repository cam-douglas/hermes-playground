# Scupper

A deck looks closed until you see the scupper. Move the drain. See the leftover hole.

This is not Coaming. Coaming is leftover raised lip around a hatch. This is not Freeboard. Freeboard is leftover hull above water. This is not Flue. Flue is leftover chimney pull. This is not Threshold. Threshold is leftover doorway bar. This is not Packed sky. Packed sky is last hour’s lattice. This is not a clock. Scupper answers “how far the leftover hole still opens through the bulwark, leftover drain through the bulwark as seen in elevation.”

## Problem

A deck looks closed until you see the scupper:

- how far does the leftover hole still open through the bulwark?
- is the leftover closed, or showing?
- when is the leftover hole obvious — as a picture, not a joinery sign-off?

Existing tools in this catalogue measure leftover raised lip around a hatch, leftover hull above water, leftover chimney pull, leftover doorway bar, leftover door arc, leftover window bar, leftover sash-frame, leftover lintel span, leftover tread hang, leftover tread depth, leftover jutting stone, and leftover vault infill. They do not show leftover drain through the bulwark — how far a scupper still opens so water can still leave.

## Users

- people who already know a deck can look closed until the leftover scupper shows
- anyone who refuses to treat a coaming, a freeboard, a flue, a threshold, a packed sky, or a clock as this leftover
- desks that want scupper as a picture, not a joinery sign-off
- teams that want a no-backend, local-only pass — not Coaming, not Freeboard, not Flue, not Threshold, not a paste well

## Workflow

1. Load the seed: 26 mm of leftover opening — already showing, not closed
2. Read the scene: one elevation, a deck edge / bulwark with a leftover drain opening, leftover labelled as a sketch
3. Move opening (or use the arrow keys on the focused slider); leftover names showing or closed
4. Drop the leftover toward 0 mm and the bulwark looks continuous / the deck looks closed; raise it and the leftover hole shows — water can still leave
5. Reset restores the seeded leftover showing

## Data model

One elevation with leftover scupper as leftover opening:

- `opening` — millimetres of leftover hole through the bulwark (default 26)

Derived picture:

- leftover labelled as a sketch (closed / showing), not a joinery sign-off
- leftover hole labelled as a sketch
- closed / flush when opening ≤ 3 mm

Nothing is persisted. Refresh restores the seeded scene.

## Architecture

- static HTML/CSS/JS
- no backend required for the prototype
- one SVG scene: an elevation — a deck edge / bulwark with a leftover drain opening; leftover is how far the leftover hole still opens through the bulwark
- moving a control redraws the leftover immediately
- `?embed=1` hides catalogue chrome so the hub living well can iframe this page
- no network, no npm, no localStorage

## UX

- one leftover drain through the bulwark in elevation, not a spreadsheet, not a Gantt, not a floor plan of rooms, not a cut-list stick, not a bag, not a crease diagram, not a claims beam, not a mixer, not a plumb bob, not a catenary, not a lamp, not a road crown, not a focus plane, not a partition, not a grain-angle dial, not a door swing, not talk columns, not gears, not a kerf gap, not a rode, not a vent plume, not wheels, not a chair, not a stair, not a pedal, not a ceiling, not a heading, not a glide, not a sash leftover frame, not an eave overhang, not a rail, not a list, not a retaining wall, not a brick course, not a wing, not a fetch, not a lot line, not a crane, not a tree, not a scarf, not a hill, not a keystone lock, not a plinth, not a lintel, not a freeboard, not a flue, not a parapet, not a rabbet, not a nosing hang, not a going, not a spandrel triangle, not a corbel jut, not a window mullion, not a doorway threshold, not a hatch coaming, not a clock
- seeded demo already shows a visible leftover (not closed)
- live opening, leftover labelled as a sketch (closed / showing)
- keyboard moves the focused control
- SVG text alternative names whether the scupper is showing
- reset returns the seed

## Deployment plan

- deploy as static files on Vercel
- keep each product in its own folder
- expose the product at `products/scupper/`

## Verification

- page loads in a browser without build tooling
- one SVG scene (elevation / leftover drain through a bulwark) is in the DOM
- seeded leftover is visible (showing — not closed)
- changing a control redraws and updates the readout
- no paste-well hero, no hatch coaming, no doorway threshold, no chimney flue, no freeboard waterline, no clock face
