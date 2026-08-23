# Fascia

A roof looks finished until you see the fascia. Move the board. See the leftover cover.

This is not Soffit. Soffit is leftover underside plane of the overhang. This is not Eave. Eave is leftover overhang past the wall. This is not Parapet. Parapet is leftover wall above a roof. This is not Chine. Chine is leftover hull crease. This is not Packed sky. Packed sky is last hour’s lattice. This is not a clock. Fascia answers “how far the leftover board still covers the rafter tails.”

## Problem

A roof looks finished until you see the fascia:

- how far does the leftover board still cover the rafter tails?
- is the leftover bare, or showing?
- when is the leftover board obvious — as a sketch, not a joinery sign-off?

Existing tools in this catalogue measure leftover underside plane under an eave, leftover roof overhang past a wall, leftover wall above a roof, leftover loft air, leftover hull crease, leftover drain through a bulwark, leftover hatch lip, leftover doorway bar, leftover window bar, leftover sash-frame, leftover lintel span, leftover tread hang, leftover jutting stone, and leftover vault infill. They do not show leftover board covering the rafter tails.

## Users

- people who already know a roof can look finished until the leftover fascia shows
- anyone who refuses to treat a soffit, an eave, a parapet, a loft, a hull crease, a packed sky, or a clock as this leftover
- desks that want fascia as a sketch, not a joinery sign-off
- teams that want a no-backend, local-only pass — not Soffit, not Eave, not Parapet, not Chine, not a paste well

## Workflow

1. Load the seed: 28 mm of leftover cover — already showing, not flush / tails not bare
2. Read the scene: one elevation, a roof edge whose leftover is the board covering the rafter tails, leftover labelled as a sketch
3. Move cover (or use the arrow keys on the focused slider); leftover names showing or bare
4. Drop the leftover toward 0 mm and the rafter tails show / no leftover board; raise it and the leftover board covers
5. Reset restores the seeded leftover showing

## Data model

One elevation with leftover fascia as leftover cover:

- `cover` — millimetres of leftover board covering the rafter tails (default 28)

Derived picture:

- leftover labelled as a sketch (bare / showing), not a joinery sign-off
- leftover board labelled as a sketch
- bare when cover ≤ 4 mm (the rafter tails show; no leftover board)

Nothing is persisted. Refresh restores the seeded scene.

## Architecture

- static HTML/CSS/JS
- no backend required for the prototype
- one SVG scene: an elevation — a roof edge whose leftover is the fascia; leftover is how far the leftover board still covers the rafter tails
- moving a control redraws the leftover immediately
- `?embed=1` hides catalogue chrome so the hub living well can iframe this page
- no network, no npm, no localStorage

## UX

- one leftover board covering rafter tails in an elevation, not a spreadsheet, not a Gantt, not a floor plan of rooms, not a cut-list stick, not a bag, not a crease diagram of paper, not a claims beam, not a mixer, not a plumb bob, not a catenary, not a lamp, not a road crown, not a focus plane, not a partition, not a grain-angle dial, not a door swing, not talk columns, not gears, not a kerf gap, not a rode, not a vent plume, not wheels, not a chair, not a stair, not a pedal, not a ceiling, not a heading, not a glide, not a sash leftover frame, not an eave overhang as shade, not a soffit underside plane, not a rail, not a list, not a retaining wall, not a brick course, not a wing, not a fetch, not a lot line, not a crane, not a tree, not a scarf, not a hill, not a keystone lock, not a plinth, not a lintel, not a freeboard, not a flue, not a parapet wall, not a rabbet, not a nosing hang, not a going, not a spandrel triangle, not a corbel jut, not a window mullion, not a doorway threshold, not a hatch coaming, not a scupper drain, not a hull chine, not a clock
- seeded demo already shows a visible leftover (not flush / not zero)
- live cover, leftover labelled as a sketch (bare / showing)
- keyboard moves the focused control
- SVG text alternative names whether the fascia is showing
- reset returns the seed

## Deployment plan

- deploy as static files on Vercel
- keep each product in its own folder
- expose the product at `products/fascia/`

## Verification

- page loads in a browser without build tooling
- one SVG scene (elevation / leftover board covering rafter tails) is in the DOM
- seeded leftover is visible (showing — not bare)
- changing a control redraws and updates the readout
- no paste-well hero, no soffit underside-plane as the hero, no eave-as-shade as the hero, no parapet wall, no hull chine, no clock face
