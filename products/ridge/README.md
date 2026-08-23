# Ridge

A roof looks one plane until you see the ridge. Move the peak. See the leftover join.

This is not Eave. Eave is leftover overhang past the wall. This is not Soffit. Soffit is leftover underside plane. This is not Fascia. Fascia is leftover rafter-tail cover. This is not Parapet. Parapet is leftover wall above a roof. This is not Keystone. Keystone is leftover arch lock. This is not Shim. Shim is leftover packing that still fills a gap. This is not Arris. Arris is leftover sharp where two planes meet. This is not Packed sky. Packed sky is last hour’s lattice. This is not a clock. Ridge answers “how far the leftover peak still stands where two roof planes meet.”

## Problem

A roof looks one plane until you see the ridge:

- how far does the leftover peak still stand where the planes meet?
- is the leftover flush, or showing?
- when is the leftover join obvious — as a sketch, not a joinery sign-off?

Existing tools in this catalogue measure leftover roof overhang past a wall, leftover underside plane under an eave, leftover board covering rafter tails, leftover wall above a roof, leftover arch lock, leftover packing that still fills a gap, leftover sharp where two planes meet, leftover hull crease, leftover drain through a bulwark, leftover hatch lip, leftover doorway bar, leftover window bar, leftover sash-frame, leftover lintel span, leftover tread hang, leftover jutting stone, and leftover vault infill. They do not show leftover peak — how far a ridge still stands where two roof planes meet.

## Users

- people who already know a roof can look one plane until the leftover ridge shows
- anyone who refuses to treat an eave, a soffit, a fascia, a parapet, a keystone, a shim, an arris, a packed sky, or a clock as this leftover
- desks that want ridge as a sketch, not a joinery sign-off
- teams that want a no-backend, local-only pass — not Eave, not Soffit, not Fascia, not Parapet, not Keystone, not a paste well

## Workflow

1. Load the seed: 24 mm of leftover peak — already showing, not flush / not one plane
2. Read the scene: one elevation, two roof planes whose leftover is the ridge, leftover labelled as a sketch
3. Move peak (or use the arrow keys on the focused slider); leftover names showing or flush
4. Drop the leftover toward 0 mm and the roof looks one plane / no leftover join; raise it and the leftover peak still stands
5. Reset restores the seeded leftover showing

## Data model

One elevation with leftover ridge as leftover peak where two roof planes meet:

- `peak` — millimetres of leftover peak (default 24)

Derived picture:

- leftover labelled as a sketch (flush / showing), not a joinery sign-off
- leftover join labelled as a sketch
- flush when peak ≤ 4 mm (the roof looks one plane / no leftover join)

Nothing is persisted. Refresh restores the seeded scene.

## Architecture

- static HTML/CSS/JS
- no backend required for the prototype
- one SVG scene: an elevation — two roof planes whose leftover is the ridge; leftover is how far the leftover peak still stands where the planes meet
- moving a control redraws the leftover immediately
- `?embed=1` hides catalogue chrome so the hub living well can iframe this page
- no network, no npm, no localStorage

## UX

- one leftover peak where two roof planes meet in an elevation, not a spreadsheet, not a Gantt, not a floor plan of rooms, not a cut-list stick, not a bag, not a crease diagram of paper, not a claims beam, not a mixer, not a plumb bob, not a catenary, not a lamp, not a road crown, not a focus plane, not a partition, not a grain-angle dial, not a door swing, not talk columns, not gears, not a kerf gap, not a rode, not a vent plume, not wheels, not a chair, not a stair, not a pedal, not a ceiling, not a heading, not a glide, not a sash leftover frame, not an eave overhang as shade, not a soffit underside plane, not a fascia board, not a parapet wall, not a keystone lock, not a rail, not a list, not a retaining wall, not a brick course, not a wing, not a fetch, not a lot line, not a crane, not a tree, not a scarf, not a hill, not a plinth, not a lintel, not a freeboard, not a flue, not a rabbet shoulder, not a nosing hang, not a going, not a spandrel triangle, not a corbel jut, not a window mullion, not a doorway threshold, not a hatch coaming, not a scupper drain, not a hull chine, not an arris sharp, not a shim pack, not a clock
- seeded demo already shows a visible leftover (not flush / not one plane)
- live peak, leftover labelled as a sketch (flush / showing)
- keyboard moves the focused control
- SVG text alternative names whether the ridge is showing
- reset returns the seed

## Deployment plan

- deploy as static files on Vercel
- keep each product in its own folder
- expose the product at `products/ridge/`

## Verification

- page loads in a browser without build tooling
- one SVG scene (elevation / two roof planes / leftover ridge) is in the DOM
- seeded leftover is visible (showing — not flush)
- changing a control redraws and updates the readout
- no paste-well hero, no eave overhang as the hero, no soffit underside, no fascia board, no parapet wall, no keystone vault, no clock face
