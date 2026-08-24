# Inlay

A board looks even until you see the inlay. Move the set. See the leftover piece.

This is not Dado. Dado is leftover housing groove across the grain. This is not Mortise. Mortise is leftover closed pocket that still opens in the face. This is not Stain. Stain is leftover color wash flooding the face. This is not Flute. Flute is leftover parallel concave hollows along the length. This is not Pitch. Pitch is leftover resin pocket. This is not Banding. Banding is a strip around an edge — a different leftover, not this. This is not Bead. Bead is leftover half-round on an edge. This is not Batten. Batten is leftover covering strip. This is not Dowel. Dowel is leftover pin through a join. This is not Fold Sheet. Fold Sheet is leftover paper creases. This is not marquetry as a clone of this inlay. This is not a paste well. This is not a clock. Inlay answers “how much leftover contrasting piece still sits in the recess.”

## Problem

A board looks even until you see the inlay:

- how much leftover contrasting piece still sits in the cut recess?
- is the leftover plain, or showing?
- when is the leftover inlay obvious — as a sketch, not a mill sign-off?

Existing tools in this catalogue measure leftover housing groove across the grain, leftover closed pocket that still opens in the face, leftover color wash flooding the face, leftover parallel concave hollows along the length, leftover resin pocket, leftover half-round on an edge, leftover covering strip, leftover pin through a join, leftover millimetres of stock, leftover blade gap, leftover paper creases, leftover board covering rafter tails, leftover drain, leftover hatch lip, leftover doorway bar, leftover window bar, leftover lintel span, leftover tread hang, leftover jutting stone, leftover vault infill, and leftover overlap along the length. They do not show leftover inlay — leftover contrasting piece still sitting in a cut recess in the face, not Dado (housing groove across the grain), not Mortise (closed pocket), not Stain (color wash), not Flute (parallel concave hollows), not Pitch (resin pocket), not Banding (strip around an edge), not a paper fold-sheet.

## Users

- people who already know a board can look even until the leftover piece shows in the recess
- anyone who refuses to treat a dado housing, a mortise pocket, a stain wash, a flute hollow, a pitch resin, a banding strip, a packed sky, or a clock as this leftover
- desks that want inlay as a sketch, not a mill sign-off
- teams that want a no-backend, local-only pass — not Dado, not Mortise, not Stain, not Flute, not a paste well

## Workflow

1. Load the seed: 30 mm of leftover inlay — already showing, not a plain empty-recess scene
2. Read the scene: one board in face, a slight section that shows the piece sitting in the cut, a leftover whose leftover is the inlay, leftover labelled as a sketch
3. Move inlay (or use the arrow keys on the focused slider); leftover names showing or plain
4. Drop the leftover toward 0 mm and the recess is empty / the face looks plain / no leftover inlay; raise it and more leftover piece still sits in the recess
5. Reset restores the seeded leftover showing

## Data model

One board in face, with a slight section, with leftover inlay as leftover contrasting piece that still sits in the recess:

- `inlay` — millimetres of leftover set showing (default 30)

Derived picture:

- leftover labelled as a sketch (plain / showing), not a mill sign-off
- leftover piece labelled as a sketch
- plain / no leftover inlay when inlay ≤ 4 mm (the recess is empty / the face looks plain)

Nothing is persisted. Refresh restores the seeded scene.

## Architecture

- static HTML/CSS/JS
- no backend required for the prototype
- one SVG scene: one board in face, with a slight section — a leftover whose leftover is the inlay; leftover is leftover contrasting piece still sitting in a cut recess in the face (not a dado housing across the grain, not a mortise pocket, not a stain wash, not flutes along the length, not a resin pocket, not a banding strip around an edge)
- moving a control redraws the leftover immediately
- `?embed=1` hides catalogue chrome so the hub living well can iframe this page
- no network, no npm, no localStorage

## UX

- leftover contrasting piece still sitting in a cut recess in the face, not a spreadsheet, not a Gantt, not a floor plan of rooms, not a cut-list stick, not a bag, not a crease diagram of paper, not a claims beam, not a mixer, not a plumb bob, not a catenary, not a lamp, not a road crown, not a focus plane, not a partition, not a grain-angle dial, not a door swing, not talk columns, not gears, not a kerf gap as the hero, not a rode, not a vent plume, not wheels, not a chair, not a stair, not a pedal, not a ceiling, not a heading, not a glide, not a sash leftover frame, not an eave overhang as shade, not a soffit underside plane, not a fascia board as the hero, not a parapet wall, not a keystone lock, not a rail, not a list, not a retaining wall, not a brick course, not a wing, not a fetch, not a lot line, not a crane, not a tree, not a scarf overlap as the hero, not a hill, not a plinth, not a lintel, not a freeboard, not a flue, not a rabbet shoulder as the hero, not a nosing hang, not a going, not a spandrel triangle, not a corbel jut, not a window mullion, not a doorway threshold, not a hatch coaming, not a scupper drain, not a hull chine, not a chamfer single-edge bevel as the hero, not an arris sharp, not a shim pack as the hero, not a ridge peak, not a fillet radius as the hero, not a wane live edge as the hero, not a cup dish as the hero, not a bow length-arch as the hero, not a twist wind as the hero, not a check drying-split as the hero, not a dado through-groove as the hero, not a mortise pocket as the hero, not a tenon tongue as the hero, not a mitre angle as the hero, not a spline key as the hero, not a knot dark as the hero, not a crook edge-sweep as the hero, not a burl swirl as the hero, not a pitch resin as the hero, not a ray flash as the hero, not a sap edge-band as the hero, not a heartwood core as the hero, not a year-band as the hero, not a curl wave as the hero, not an eye dimple as the hero, not a quilt blister as the hero, not a spalt zone-line as the hero, not a stain wash as the hero, not a ribbon stripe as the hero, not a crotch plume as the hero, not a mottle blotch as the hero, not a drip run as the hero, not a flame leap as the hero, not a bead round as the hero, not a batten cover as the hero, not a dowel pin as the hero, not a flute hollow as the hero, not a banding strip as the hero, not a clock
- seeded demo already shows a visible leftover (not a plain empty-recess scene)
- live inlay, leftover labelled as a sketch (plain / showing)
- keyboard moves the focused control
- SVG text alternative names whether the inlay is showing
- reset returns the seed

## Deployment plan

- deploy as static files on Vercel
- keep each product in its own folder
- expose the product at `products/inlay/`

## Verification

- page loads in a browser without build tooling
- one SVG scene (face / slight section / leftover inlay) is in the DOM
- seeded leftover is visible (showing — not plain)
- changing a control redraws and updates the readout
- no paste-well hero, no dado housing as the hero, no mortise pocket as the hero, no stain wash as the hero, no flute hollows as the hero, no pitch resin as the hero, no banding strip as the hero, no clock face
