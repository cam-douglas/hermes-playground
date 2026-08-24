# Pecky

A board looks sound until you see the pecky. Move the pocket. See the leftover cavity.

This is not Pitch. Pitch is leftover resin / gum pocket occupying a hole. This is not Check. Check is leftover linear drying split still opening along the face. This is not Inlay. Inlay is leftover contrasting piece set into a cut recess. This is not Stain. Stain is leftover color wash flooding the face. This is not Spalt. Spalt is leftover dark fungal zone-lines / map-boundaries. This is not Knot. Knot is leftover circular dark of branch wood. This is not Flute. Flute is leftover parallel concave hollows along the length. This is not Dado. Dado is leftover housing groove across the grain. This is not Mortise. Mortise is leftover closed pocket that still opens in the face. This is not Fold Sheet. Fold Sheet is leftover paper creases. This is not wormy / ambrosia as a clone of this pecky. This is not a paste well. This is not a clock. Pecky answers “how much leftover irregular decay cavity still sits in the face.”

## Problem

A board looks sound until you see the pecky:

- how much leftover irregular fungal decay cavity still sits in the face?
- is the leftover sound, or showing?
- when is the leftover pecky obvious — as a sketch, not a mill sign-off?

Existing tools in this catalogue measure leftover resin that still sits in the face as a gum pocket, leftover linear drying split that still opens along the face, leftover contrasting piece still sitting in a cut recess, leftover color wash flooding the face, leftover dark fungal zone-lines, leftover circular dark of branch wood, leftover parallel concave hollows along the length, leftover closed joinery pocket, leftover housing groove across the grain, leftover millimetres of stock, leftover blade gap, leftover paper creases, leftover board covering rafter tails, leftover drain, leftover hatch lip, leftover doorway bar, leftover window bar, leftover lintel span, leftover tread hang, leftover jutting stone, leftover vault infill, and leftover overlap along the length. They do not show leftover pecky — leftover irregular fungal decay pockets / cavities still sitting in the face (pecky cypress), leftover holes of rot, not a resin-filled pitch pocket, not a linear check split, not a set inlay piece, not a stain wash, not spalt zone-lines, not a circular knot, not a paper fold-sheet.

## Users

- people who already know a board can look sound until the leftover cavities show in the face
- anyone who refuses to treat a pitch resin pocket, a check split, an inlay piece, a stain wash, a spalt zone-line, a knot dark, a packed sky, or a clock as this leftover
- desks that want pecky as a sketch, not a mill sign-off
- teams that want a no-backend, local-only pass — not Pitch, not Check, not Inlay, not a paste well

## Workflow

1. Load the seed: 28 mm of leftover pecky — already showing, not a sound-only face
2. Read the scene: one board in face, a leftover whose leftover is the pecky, leftover labelled as a sketch
3. Move pecky (or use the arrow keys on the focused slider); leftover names showing or sound
4. Drop the leftover toward 0 mm and the board looks sound / no leftover pecky; raise it and more / larger leftover cavities still sit in the face
5. Reset restores the seeded leftover showing

## Data model

One board in face with leftover pecky as leftover irregular decay cavities that still sit in the face:

- `pecky` — millimetres of leftover cavity showing (default 28)

Derived picture:

- leftover labelled as a sketch (sound / showing), not a mill sign-off
- leftover cavity labelled as a sketch
- sound / no leftover pecky when pecky ≤ 4 mm (the board looks sound throughout)

Nothing is persisted. Refresh restores the seeded scene.

## Architecture

- static HTML/CSS/JS
- no backend required for the prototype
- one SVG scene: one board in face — a leftover whose leftover is the pecky; leftover is leftover irregular fungal decay cavities still sitting in the face (not a resin-filled pitch pocket, not a linear check split, not a set inlay piece, not a stain wash, not spalt zone-lines, not a circular knot)
- moving a control redraws the leftover immediately
- `?embed=1` hides catalogue chrome so the hub living well can iframe this page
- no network, no npm, no localStorage

## UX

- leftover irregular decay cavities still sitting in the face, not a spreadsheet, not a Gantt, not a floor plan of rooms, not a cut-list stick, not a bag, not a crease diagram of paper, not a claims beam, not a mixer, not a plumb bob, not a catenary, not a lamp, not a road crown, not a focus plane, not a partition, not a grain-angle dial, not a door swing, not talk columns, not gears, not a kerf gap as the hero, not a rode, not a vent plume, not wheels, not a chair, not a stair, not a pedal, not a ceiling, not a heading, not a glide, not a sash leftover frame, not an eave overhang as shade, not a soffit underside plane, not a fascia board as the hero, not a parapet wall, not a keystone lock, not a rail, not a list, not a retaining wall, not a brick course, not a wing, not a fetch, not a lot line, not a crane, not a tree, not a scarf overlap as the hero, not a hill, not a plinth, not a lintel, not a freeboard, not a flue, not a rabbet shoulder as the hero, not a nosing hang, not a going, not a spandrel triangle, not a corbel jut, not a window mullion, not a doorway threshold, not a hatch coaming, not a scupper drain, not a hull chine, not a chamfer single-edge bevel as the hero, not an arris sharp, not a shim pack as the hero, not a ridge peak, not a fillet radius as the hero, not a wane live edge as the hero, not a cup dish as the hero, not a bow length-arch as the hero, not a twist wind as the hero, not a check drying-split as the hero, not a dado through-groove as the hero, not a mortise pocket as the hero, not a tenon tongue as the hero, not a mitre angle as the hero, not a spline key as the hero, not a knot dark as the hero, not a crook edge-sweep as the hero, not a burl swirl as the hero, not a pitch resin as the hero, not a ray flash as the hero, not a sap edge-band as the hero, not a heartwood core as the hero, not a year-band as the hero, not a curl wave as the hero, not an eye dimple as the hero, not a quilt blister as the hero, not a spalt zone-line as the hero, not a stain wash as the hero, not a ribbon stripe as the hero, not a crotch plume as the hero, not a mottle blotch as the hero, not a drip run as the hero, not a flame leap as the hero, not a bead round as the hero, not a batten cover as the hero, not a dowel pin as the hero, not a flute hollow as the hero, not an inlay piece as the hero, not a banding strip as the hero, not a clock
- seeded demo already shows a visible leftover (not a sound-only face)
- live pecky, leftover labelled as a sketch (sound / showing)
- keyboard moves the focused control
- SVG text alternative names whether the pecky is showing
- reset returns the seed

## Deployment plan

- deploy as static files on Vercel
- keep each product in its own folder
- expose the product at `products/pecky/`

## Verification

- page loads in a browser without build tooling
- one SVG scene (face / leftover pecky) is in the DOM
- seeded leftover is visible (showing — not sound)
- changing a control redraws and updates the readout
- no paste-well hero, no pitch resin as the hero, no check split as the hero, no inlay piece as the hero, no stain wash as the hero, no spalt zone-lines as the hero, no knot dark as the hero, no clock face
