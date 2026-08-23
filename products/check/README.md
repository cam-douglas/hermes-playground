# Check

A board looks sound until you see the check. Move the split. See the leftover opening.

This is not Kerf. Kerf is what the blade removed — a cut gap. This is not Grain. Grain is leftover mismatch of the cut to the fibres. This is not Twist. Twist is leftover wind that still spirals one end off the other. This is not Cup. Cup is leftover dish across the width. This is not Bow. Bow is leftover arch along the length. This is not Wane. Wane is leftover live edge / bark. This is not a paste well. This is not a clock. Check answers “how far the leftover split still opens along the face.”

## Problem

A board looks sound until you see the check:

- how far does the leftover split still open along the face?
- is the leftover sound, or showing?
- when is the leftover opening obvious — as a sketch, not a mill sign-off?

Existing tools in this catalogue measure leftover wind that still spirals one end of a board off the other, leftover dish that still warps a board across its width, leftover arch that still warps a board along its length, leftover live edge that still takes the square off a board, leftover mismatch of the cut to the fibres, leftover millimetres of stock, leftover blade gap, leftover radius that still fills a concave corner, leftover bevel that still takes the sharp off, leftover sharp where two planes meet, leftover packing that still fills a gap, leftover peak where two roof planes meet, leftover board covering rafter tails, leftover underside plane, leftover roof overhang, leftover hull crease, leftover drain through a bulwark, leftover hatch lip, leftover doorway bar, leftover window bar, leftover sash-frame, leftover lintel span, leftover tread hang, leftover jutting stone, and leftover vault infill. They do not show leftover split — how far a check still opens along the face of a board.

## Users

- people who already know a board can look sound until the leftover check shows
- anyone who refuses to treat a kerf, a grain, a twist, a cup, a bow, a wane, a packed sky, or a clock as this leftover
- desks that want check as a sketch, not a mill sign-off
- teams that want a no-backend, local-only pass — not Kerf, not Grain, not Twist, not Cup, not Bow, not Wane, not a paste well

## Workflow

1. Load the seed: 14 mm of leftover opening — already showing, not a sound board
2. Read the scene: one face-elevation, a board whose leftover is the check, leftover labelled as a sketch
3. Move check (or use the arrow keys on the focused slider); leftover names showing or sound
4. Drop the leftover toward 0 mm and the board looks sound / no leftover opening; raise it and the leftover split still opens along the face
5. Reset restores the seeded leftover showing

## Data model

One face-elevation with leftover check as leftover split that still opens in a board:

- `check` — millimetres of leftover opening (default 14)

Derived picture:

- leftover labelled as a sketch (sound / showing), not a mill sign-off
- leftover opening labelled as a sketch
- sound / no leftover opening when check ≤ 4 mm (the board looks sound / no leftover split)

Nothing is persisted. Refresh restores the seeded scene.

## Architecture

- static HTML/CSS/JS
- no backend required for the prototype
- one SVG scene: a face-elevation — a board whose leftover is the check; leftover is how far the leftover split still opens along the face (a drying crack that still shows)
- moving a control redraws the leftover immediately
- `?embed=1` hides catalogue chrome so the hub living well can iframe this page
- no network, no npm, no localStorage

## UX

- one leftover split that still opens in a board in a face-elevation, not a spreadsheet, not a Gantt, not a floor plan of rooms, not a cut-list stick, not a bag, not a crease diagram of paper, not a claims beam, not a mixer, not a plumb bob, not a catenary, not a lamp, not a road crown, not a focus plane, not a partition, not a grain-angle dial, not a door swing, not talk columns, not gears, not a kerf gap as the hero, not a rode, not a vent plume, not wheels, not a chair, not a stair, not a pedal, not a ceiling, not a heading, not a glide, not a sash leftover frame, not an eave overhang as shade, not a soffit underside plane, not a fascia board, not a parapet wall, not a keystone lock, not a rail, not a list, not a retaining wall, not a brick course, not a wing, not a fetch, not a lot line, not a crane, not a tree, not a scarf, not a hill, not a plinth, not a lintel, not a freeboard, not a flue, not a rabbet shoulder, not a nosing hang, not a going, not a spandrel triangle, not a corbel jut, not a window mullion, not a doorway threshold, not a hatch coaming, not a scupper drain, not a hull chine, not a chamfer bevel as the hero, not an arris sharp, not a shim pack, not a ridge peak, not a fillet radius, not a wane live edge, not a cup dish as the hero, not a bow length-arch as the hero, not a twist wind as the hero, not a clock
- seeded demo already shows a visible leftover (not a sound board)
- live check, leftover labelled as a sketch (sound / showing)
- keyboard moves the focused control
- SVG text alternative names whether the check is showing
- reset returns the seed

## Deployment plan

- deploy as static files on Vercel
- keep each product in its own folder
- expose the product at `products/check/`

## Verification

- page loads in a browser without build tooling
- one SVG scene (face-elevation / one board / leftover check) is in the DOM
- seeded leftover is visible (showing — not sound)
- changing a control redraws and updates the readout
- no paste-well hero, no kerf blade-gap as the hero, no grain fibres as the hero, no twist wind, no cup dish, no bow arch, no wane live edge, no clock face
