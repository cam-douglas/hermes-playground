# Soffit

A roof looks finished until you see the soffit. Move the underside. See the leftover plane.

This is not Eave. Eave is leftover overhang past the wall. This is not Parapet. Parapet is leftover wall above a roof. This is not Headroom. Headroom is leftover loft air. This is not Chine. Chine is leftover hull crease. This is not Packed sky. Packed sky is last hour’s lattice. This is not a clock. Soffit answers “how far the leftover underside plane still runs under the eave, leftover underside as seen looking up.”

## Problem

A roof looks finished until you see the soffit:

- how far does the leftover underside plane still run under the eave?
- is the leftover flush, or showing?
- when is the leftover plane obvious — as a sketch, not a joinery sign-off?

Existing tools in this catalogue measure leftover roof overhang past a wall, leftover wall above a roof, leftover loft air, leftover hull crease, leftover drain through a bulwark, leftover hatch lip, leftover doorway bar, leftover window bar, leftover sash-frame, leftover lintel span, leftover tread hang, leftover jutting stone, and leftover vault infill. They do not show leftover underside plane — how far a soffit still runs under the eave.

## Users

- people who already know a roof can look finished until the leftover soffit shows
- anyone who refuses to treat an eave, a parapet, a loft, a hull crease, a packed sky, or a clock as this leftover
- desks that want soffit as a sketch, not a joinery sign-off
- teams that want a no-backend, local-only pass — not Eave, not Parapet, not Headroom, not Chine, not a paste well

## Workflow

1. Load the seed: 32 mm of leftover underside — already showing, not flush / not edge-only
2. Read the scene: one elevation, a roof overhang whose leftover is the underside plane under the eave, leftover labelled as a sketch
3. Move underside (or use the arrow keys on the focused slider); leftover names showing or flush
4. Drop the leftover toward 0 mm and the overhang looks like edge only / no leftover plane; raise it and the leftover plane shows
5. Reset restores the seeded leftover showing

## Data model

One elevation with leftover soffit as leftover underside:

- `underside` — millimetres of leftover plane under the eave (default 32)

Derived picture:

- leftover labelled as a sketch (flush / showing), not a joinery sign-off
- leftover plane labelled as a sketch
- flush when underside ≤ 4 mm (the overhang looks like edge only / no leftover plane)

Nothing is persisted. Refresh restores the seeded scene.

## Architecture

- static HTML/CSS/JS
- no backend required for the prototype
- one SVG scene: an elevation — a roof overhang whose leftover is the soffit; leftover is how far the leftover underside plane still runs under the eave (you still see it looking up)
- moving a control redraws the leftover immediately
- `?embed=1` hides catalogue chrome so the hub living well can iframe this page
- no network, no npm, no localStorage

## UX

- one leftover underside plane in an elevation, not a spreadsheet, not a Gantt, not a floor plan of rooms, not a cut-list stick, not a bag, not a crease diagram of paper, not a claims beam, not a mixer, not a plumb bob, not a catenary, not a lamp, not a road crown, not a focus plane, not a partition, not a grain-angle dial, not a door swing, not talk columns, not gears, not a kerf gap, not a rode, not a vent plume, not wheels, not a chair, not a stair, not a pedal, not a ceiling, not a heading, not a glide, not a sash leftover frame, not an eave overhang as shade, not a rail, not a list, not a retaining wall, not a brick course, not a wing, not a fetch, not a lot line, not a crane, not a tree, not a scarf, not a hill, not a keystone lock, not a plinth, not a lintel, not a freeboard, not a flue, not a parapet wall, not a rabbet, not a nosing hang, not a going, not a spandrel triangle, not a corbel jut, not a window mullion, not a doorway threshold, not a hatch coaming, not a scupper drain, not a hull chine, not a clock
- seeded demo already shows a visible leftover (not flush / not zero)
- live underside, leftover labelled as a sketch (flush / showing)
- keyboard moves the focused control
- SVG text alternative names whether the soffit is showing
- reset returns the seed

## Deployment plan

- deploy as static files on Vercel
- keep each product in its own folder
- expose the product at `products/soffit/`

## Verification

- page loads in a browser without build tooling
- one SVG scene (elevation / leftover underside plane) is in the DOM
- seeded leftover is visible (showing — not flush)
- changing a control redraws and updates the readout
- no paste-well hero, no eave-as-shade as the hero, no parapet wall, no loft headroom, no hull chine, no clock face
