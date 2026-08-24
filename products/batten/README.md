# Batten

A wall looks closed until you see the batten. Move the cover. See the leftover strip.

This is not Spline. Spline is leftover hidden key that still joins two grooves. This is not Fascia. Fascia is leftover rafter-tail cover at the eave. This is not Bead. Bead is leftover half-round still sitting on one long edge. This is not Shim. Shim is leftover packing that still fills a gap. This is not Dado. Dado is leftover housing groove across the grain. This is not Fillet. Fillet is leftover concave corner radius. This is not Chamfer. Chamfer is leftover bevel. This is not Arris. Arris is leftover sharp. This is not Wane. Wane is leftover irregular live-edge / bark. This is not Ribbon. Ribbon is leftover vertical quartered stripe-bands of figure. This is not Flame. Flame is leftover leaping peaks of figure. This is not Soffit. Soffit is leftover underside plane. This is not Ridge. Ridge is leftover roof peak. This is not Fold Sheet. Fold Sheet is leftover paper creases. This is not flashing as a clone of this batten. This is not a paste well. This is not a clock. Batten answers “how far the leftover strip still covers the joint.”

## Problem

A wall looks closed until you see the batten:

- how far does the leftover covering strip still sit over the joint?
- is the leftover open, or showing?
- when is the leftover batten obvious — as a sketch, not a mill sign-off?

Existing tools in this catalogue measure leftover hidden key that still joins two grooves, leftover rafter-tail cover at the eave, leftover half-round still sitting on one long edge, leftover packing that still fills a gap, leftover housing groove across the grain, leftover radius that still fills a concave corner, leftover bevel that still takes the sharp off one edge, leftover sharp where two planes meet, leftover irregular live-edge / bark, leftover vertical quartered stripe-bands of figure, leftover leaping peaks of figure, leftover underside plane, leftover roof peak, leftover millimetres of stock, leftover blade gap, leftover board covering rafter tails, leftover drain, leftover hatch lip, leftover doorway bar, leftover window bar, leftover lintel span, leftover tread hang, leftover jutting stone, leftover vault infill, and leftover overlap along the length. They do not show leftover batten — leftover strip that still covers the joint as leftover covering strip still sitting over the joint between two boards (board-and-batten), not Spline (hidden key), not Fascia (rafter-tail cover), not Bead (half-round on an edge), not Shim (packing in a gap), not Dado (housing groove), not a ribbon of figure, not a flame of figure, not a paper fold-sheet, not flashing as a clone of this batten.

## Users

- people who already know a wall can look closed until the leftover covering strip shows
- anyone who refuses to treat a spline key, a fascia board, a stuck bead, a shim pack, a dado groove, a packed sky, or a clock as this leftover
- desks that want batten as a sketch, not a mill sign-off
- teams that want a no-backend, local-only pass — not Spline, not Fascia, not Bead, not a paste well

## Workflow

1. Load the seed: 32 mm of leftover batten — already showing, not an open-joint-only scene
2. Read the scene: two boards in elevation, a leftover whose leftover is the batten, leftover labelled as a sketch
3. Move batten (or use the arrow keys on the focused slider); leftover names showing or open
4. Drop the leftover toward 0 mm and the wall looks open / no leftover batten; raise it and a wider leftover covering strip still sits over the joint
5. Reset restores the seeded leftover showing

## Data model

Two boards in elevation with leftover batten as leftover strip that still covers the joint:

- `batten` — millimetres of leftover cover showing (default 32)

Derived picture:

- leftover labelled as a sketch (open / showing), not a mill sign-off
- leftover strip labelled as a sketch
- open / no leftover batten when batten ≤ 4 mm (the joint shows)

Nothing is persisted. Refresh restores the seeded scene.

## Architecture

- static HTML/CSS/JS
- no backend required for the prototype
- one SVG scene: two boards in elevation — a leftover whose leftover is the batten; leftover is leftover strip that still covers the joint as leftover covering strip still sitting over the joint (not a hidden spline key between two grooves, not a fascia board at an eave, not a half-round bead on one long edge, not a shim packed into a gap, not a dado housing groove)
- moving a control redraws the leftover immediately
- `?embed=1` hides catalogue chrome so the hub living well can iframe this page
- no network, no npm, no localStorage

## UX

- leftover covering strip still sitting over the joint between two boards (board-and-batten), not a spreadsheet, not a Gantt, not a floor plan of rooms, not a cut-list stick, not a bag, not a crease diagram of paper, not a claims beam, not a mixer, not a plumb bob, not a catenary, not a lamp, not a road crown, not a focus plane, not a partition, not a grain-angle dial, not a door swing, not talk columns, not gears, not a kerf gap as the hero, not a rode, not a vent plume, not wheels, not a chair, not a stair, not a pedal, not a ceiling, not a heading, not a glide, not a sash leftover frame, not an eave overhang as shade, not a soffit underside plane, not a fascia board as the hero, not a parapet wall, not a keystone lock, not a rail, not a list, not a retaining wall, not a brick course, not a wing, not a fetch, not a lot line, not a crane, not a tree, not a scarf overlap as the hero, not a hill, not a plinth, not a lintel, not a freeboard, not a flue, not a rabbet shoulder as the hero, not a nosing hang, not a going, not a spandrel triangle, not a corbel jut, not a window mullion, not a doorway threshold, not a hatch coaming, not a scupper drain, not a hull chine, not a chamfer single-edge bevel as the hero, not an arris sharp, not a shim pack as the hero, not a ridge peak, not a fillet radius as the hero, not a wane live edge as the hero, not a cup dish as the hero, not a bow length-arch as the hero, not a twist wind as the hero, not a check drying-split as the hero, not a dado through-groove as the hero, not a mortise pocket as the hero, not a tenon tongue as the hero, not a mitre angle as the hero, not a spline key as the hero, not a knot dark as the hero, not a crook edge-sweep as the hero, not a burl swirl as the hero, not a pitch resin as the hero, not a ray flash as the hero, not a sap edge-band as the hero, not a heartwood core as the hero, not a year-band as the hero, not a curl wave as the hero, not an eye dimple as the hero, not a quilt blister as the hero, not a spalt zone-line as the hero, not a stain wash as the hero, not a ribbon stripe as the hero, not a crotch plume as the hero, not a mottle blotch as the hero, not a drip run as the hero, not a flame leap as the hero, not a bead round as the hero, not a clock
- seeded demo already shows a visible leftover (not an open-joint-only scene)
- live batten, leftover labelled as a sketch (open / showing)
- keyboard moves the focused control
- SVG text alternative names whether the batten is showing
- reset returns the seed

## Deployment plan

- deploy as static files on Vercel
- keep each product in its own folder
- expose the product at `products/batten/`

## Verification

- page loads in a browser without build tooling
- one SVG scene (elevation / two boards / leftover batten) is in the DOM
- seeded leftover is visible (showing — not open)
- changing a control redraws and updates the readout
- no paste-well hero, no spline key as the hero, no fascia board as the hero, no half-round bead as the hero, no shim pack as the hero, no dado groove as the hero, no clock face
