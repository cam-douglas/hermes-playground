# Coaming

A deck looks flush until you see the coaming. Move the hatch. See the leftover lip.

This is not Threshold. Threshold is leftover doorway bar. This is not Parapet. Parapet is leftover wall above a roof. This is not Plinth. Plinth is leftover wall base. This is not Headroom. Headroom is leftover loft air. This is not Freeboard. Freeboard is leftover hull above water. This is not Swing. Swing is leftover door arc. This is not a clock. Coaming answers “how far the leftover lip still stands above the deck, leftover raised lip around a hatch as seen in plan.”

## Problem

A deck looks flush until you see the coaming:

- how far does the leftover lip still stand above the deck?
- is the leftover flush, or showing?
- when is the leftover lip obvious — as a picture, not a joinery sign-off?

Existing tools in this catalogue measure leftover doorway bar, leftover wall above a roof, leftover wall base, leftover loft air, leftover hull above water, leftover door arc, leftover window bar, leftover sash-frame, leftover lintel span, leftover tread hang, leftover tread depth, leftover jutting stone, and leftover vault infill. They do not show leftover raised lip around a hatch — how far a coaming still stands above the deck.

## Users

- people who already know a deck can look flush until the leftover coaming shows
- anyone who refuses to treat a threshold, a parapet, a plinth, a headroom, a freeboard, a swing, a mullion, or a clock as this leftover
- desks that want coaming as a picture, not a joinery sign-off
- teams that want a no-backend, local-only pass — not Threshold, not Parapet, not Plinth, not a paste well

## Workflow

1. Load the seed: 24 mm of leftover lip — already showing, not flush
2. Read the scene: one plan, a deck hatch with a leftover raised lip around the opening, leftover labelled as a sketch
3. Move lip (or use the arrow keys on the focused slider); leftover names showing or flush
4. Drop the leftover toward 0 mm and the deck looks continuous; raise it and the leftover lip shows — the hatch still has a raised lip
5. Reset restores the seeded leftover showing

## Data model

One plan with leftover coaming as leftover lip:

- `lip` — millimetres of leftover lip above the deck (default 24)

Derived picture:

- leftover labelled as a sketch (flush / showing), not a joinery sign-off
- leftover lip labelled as a sketch
- flush when lip ≤ 3 mm

Nothing is persisted. Refresh restores the seeded scene.

## Architecture

- static HTML/CSS/JS
- no backend required for the prototype
- one SVG scene: a plan — a deck hatch with a leftover raised lip around the opening; leftover is how far the leftover lip still stands above the deck
- moving a control redraws the leftover immediately
- `?embed=1` hides catalogue chrome so the hub living well can iframe this page
- no network, no npm, no localStorage

## UX

- one leftover raised lip in plan, not a spreadsheet, not a Gantt, not a floor plan of rooms, not a cut-list stick, not a bag, not a crease diagram, not a claims beam, not a mixer, not a plumb bob, not a catenary, not a lamp, not a road crown, not a focus plane, not a partition, not a grain-angle dial, not a door swing, not talk columns, not gears, not a kerf gap, not a rode, not a vent plume, not wheels, not a chair, not a stair, not a pedal, not a ceiling, not a heading, not a glide, not a sash leftover frame, not an eave overhang, not a rail, not a list, not a retaining wall, not a brick course, not a wing, not a fetch, not a lot line, not a crane, not a tree, not a scarf, not a hill, not a keystone lock, not a plinth, not a lintel, not a freeboard, not a flue, not a parapet, not a rabbet, not a nosing hang, not a going, not a spandrel triangle, not a corbel jut, not a window mullion, not a doorway threshold, not a clock
- seeded demo already shows a visible leftover (not flush)
- live lip, leftover labelled as a sketch (flush / showing)
- keyboard moves the focused control
- SVG text alternative names whether the coaming is showing
- reset returns the seed

## Deployment plan

- deploy as static files on Vercel
- keep each product in its own folder
- expose the product at `products/coaming/`

## Verification

- page loads in a browser without build tooling
- one SVG scene (plan / leftover raised lip around a deck hatch) is in the DOM
- seeded leftover is visible (showing — not flush)
- changing a control redraws and updates the readout
- no paste-well hero, no doorway threshold, no parapet wall, no plinth wall-base, no stair nosing, no window mullion, no clock face
