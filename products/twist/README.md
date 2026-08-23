# Twist

A board looks true until you see the twist. Move the wind. See the leftover spiral.

This is not Cup. Cup is leftover dish across the width. This is not Bow. Bow is leftover arch along the length. This is not Yaw. Yaw is leftover heading of a course. This is not Camber. Camber is leftover crown of a road. This is not Wire Sag. Wire Sag is leftover dip of a cable. This is not Wane. Wane is leftover live edge / bark. This is not a paste well. This is not a clock. Twist answers “how far the leftover wind still spirals one end off the other.”

## Problem

A board looks true until you see the twist:

- how far does the leftover wind still spiral one end off the other?
- is the leftover true, or showing?
- when is the leftover spiral obvious — as a sketch, not a mill sign-off?

Existing tools in this catalogue measure leftover dish that still warps a board across its width, leftover arch that still warps a board along its length, leftover heading of a course, leftover crown of a road, leftover dip of a cable, leftover live edge that still takes the square off a board, leftover mismatch of the cut to the fibres, leftover millimetres of stock, leftover blade gap, leftover radius that still fills a concave corner, leftover bevel that still takes the sharp off, leftover sharp where two planes meet, leftover packing that still fills a gap, leftover peak where two roof planes meet, leftover board covering rafter tails, leftover underside plane, leftover roof overhang, leftover hull crease, leftover drain through a bulwark, leftover hatch lip, leftover doorway bar, leftover window bar, leftover sash-frame, leftover lintel span, leftover tread hang, leftover jutting stone, and leftover vault infill. They do not show leftover wind — how far a twist still spirals one end of a board off the other.

## Users

- people who already know a board can look true until the leftover twist shows
- anyone who refuses to treat a cup, a bow, a yaw, a camber, a sag, a wane, a packed sky, or a clock as this leftover
- desks that want twist as a sketch, not a mill sign-off
- teams that want a no-backend, local-only pass — not Cup, not Bow, not Yaw, not Camber, not Wire Sag, not Wane, not a paste well

## Workflow

1. Load the seed: 16 mm of leftover wind — already showing, not a true board
2. Read the scene: one perspective / end view, a board whose leftover is the twist, leftover labelled as a sketch
3. Move twist (or use the arrow keys on the focused slider); leftover names showing or true
4. Drop the leftover toward 0 mm and the board looks true / no leftover wind; raise it and the leftover wind still spirals one end off the other
5. Reset restores the seeded leftover showing

## Data model

One perspective / end view with leftover twist as leftover wind that still spirals a board off true:

- `twist` — millimetres of leftover wind (default 16)

Derived picture:

- leftover labelled as a sketch (true / showing), not a mill sign-off
- leftover wind labelled as a sketch
- true / no leftover wind when twist ≤ 4 mm (the board looks true / no leftover spiral)

Nothing is persisted. Refresh restores the seeded scene.

## Architecture

- static HTML/CSS/JS
- no backend required for the prototype
- one SVG scene: a perspective / end view — a board whose leftover is the twist; leftover is how far the leftover wind still spirals one end off the other (far-end corners standing off the near-end plane)
- moving a control redraws the leftover immediately
- `?embed=1` hides catalogue chrome so the hub living well can iframe this page
- no network, no npm, no localStorage

## UX

- one leftover wind that still spirals a board off true in a perspective / end view, not a spreadsheet, not a Gantt, not a floor plan of rooms, not a cut-list stick, not a bag, not a crease diagram of paper, not a claims beam, not a mixer, not a plumb bob, not a catenary, not a lamp, not a road crown, not a focus plane, not a partition, not a grain-angle dial, not a door swing, not talk columns, not gears, not a kerf gap, not a rode, not a vent plume, not wheels, not a chair, not a stair, not a pedal, not a ceiling, not a heading, not a glide, not a sash leftover frame, not an eave overhang as shade, not a soffit underside plane, not a fascia board, not a parapet wall, not a keystone lock, not a rail, not a list, not a retaining wall, not a brick course, not a wing, not a fetch, not a lot line, not a crane, not a tree, not a scarf, not a hill, not a plinth, not a lintel, not a freeboard, not a flue, not a rabbet shoulder, not a nosing hang, not a going, not a spandrel triangle, not a corbel jut, not a window mullion, not a doorway threshold, not a hatch coaming, not a scupper drain, not a hull chine, not a chamfer bevel as the hero, not an arris sharp, not a shim pack, not a ridge peak, not a fillet radius, not a wane live edge, not a cup dish as the hero, not a bow length-arch as the hero, not a clock
- seeded demo already shows a visible leftover (not a true board)
- live twist, leftover labelled as a sketch (true / showing)
- keyboard moves the focused control
- SVG text alternative names whether the twist is showing
- reset returns the seed

## Deployment plan

- deploy as static files on Vercel
- keep each product in its own folder
- expose the product at `products/twist/`

## Verification

- page loads in a browser without build tooling
- one SVG scene (perspective / end / one board / leftover twist) is in the DOM
- seeded leftover is visible (showing — not true)
- changing a control redraws and updates the readout
- no paste-well hero, no cup dish as the hero, no bow length-arch as the hero, no yaw heading, no camber road, no wire sag, no wane live edge, no clock face
