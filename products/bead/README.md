# Bead

A board looks square until you see the bead. Move the edge. See the leftover round.

This is not Fillet. Fillet is leftover radius that still fills a concave interior corner. This is not Chamfer. Chamfer is leftover bevel that still takes the sharp off one edge. This is not Arris. Arris is leftover sharp where two planes meet. This is not Wane. Wane is leftover irregular live-edge / bark. This is not Ribbon. Ribbon is leftover vertical quartered stripe-bands of figure. This is not Flame. Flame is leftover leaping peaks of figure. This is not Curl. Curl is leftover undulating wave-figure / fiddleback. This is not Drip. Drip is leftover liquid run on the face. This is not a knot. This is not ovolo or ogee as a clone of this bead. This is not Fold Sheet. Fold Sheet is leftover paper creases. This is not a paste well. This is not a clock. Bead answers “how far the leftover round still sits on the edge.”

## Problem

A board looks square until you see the bead:

- how far does the leftover round still sit on the edge?
- is the leftover square, or showing?
- when is the leftover bead obvious — as a sketch, not a mill sign-off?

Existing tools in this catalogue measure leftover radius that still fills a concave corner, leftover bevel that still takes the sharp off one edge, leftover sharp where two planes meet, leftover irregular live-edge / bark, leftover vertical quartered stripe-bands of figure, leftover leaping peaks of figure, leftover undulating wave-figure, leftover liquid run, leftover blotch, leftover plume, leftover 3D blister-patches, leftover tiny circular dimples, leftover year-band, leftover inner core, leftover pale edge-band, leftover medullary flash, leftover resin pocket, leftover swirl occupying a patch, leftover edge sweep, leftover circular dark, leftover key between two grooves, leftover angle, leftover tongue, leftover closed pocket, leftover housing groove, leftover drying split, leftover wind, leftover dish, leftover arch, leftover millimetres of stock, leftover blade gap, leftover packing, leftover board covering rafter tails, leftover underside plane, leftover roof overhang, leftover hull crease, leftover drain, leftover hatch lip, leftover doorway bar, leftover window bar, leftover lintel span, leftover tread hang, leftover jutting stone, leftover vault infill, and leftover overlap along the length. They do not show leftover bead — leftover round that still sits on the edge as leftover half-round still sitting on one long edge of a board (beaded board / stuck bead), not Fillet (concave corner radius), not Chamfer (bevel), not Arris (sharp), not Wane (live edge / bark), not Ribbon (figure stripe), not Flame (leaping peaks), not Curl (wave), not a drip run, not a paper fold-sheet, not ovolo or ogee as a clone of this bead.

## Users

- people who already know a board can look square until the leftover round shows
- anyone who refuses to treat a fillet scoop, a chamfer bevel, a wane bite, a packed sky, or a clock as this leftover
- desks that want bead as a sketch, not a mill sign-off
- teams that want a no-backend, local-only pass — not Fillet, not Chamfer, not Flame, not a paste well

## Workflow

1. Load the seed: 30 mm of leftover bead — already showing, not a square-only edge
2. Read the scene: one board in section, a leftover whose leftover is the bead, leftover labelled as a sketch
3. Move bead (or use the arrow keys on the focused slider); leftover names showing or square
4. Drop the leftover toward 0 mm and the board looks square / no leftover bead; raise it and a larger leftover half-round still sits on one long edge
5. Reset restores the seeded leftover showing

## Data model

One board in section with leftover bead as leftover round that still sits on the edge:

- `bead` — millimetres of leftover round showing (default 30)

Derived picture:

- leftover labelled as a sketch (square / showing), not a mill sign-off
- leftover round labelled as a sketch
- square / no leftover bead when bead ≤ 4 mm (the board looks square-edged throughout)

Nothing is persisted. Refresh restores the seeded scene.

## Architecture

- static HTML/CSS/JS
- no backend required for the prototype
- one SVG scene: one board in section — a leftover whose leftover is the bead; leftover is leftover round that still sits on the edge as leftover half-round still sitting on one long edge (not a fillet scoop in a concave corner, not a chamfer bevel, not a wane bite, not figure in the face, not leaping flame peaks, not curl waves, not ribbon stripes, not a liquid drip, not ovolo or ogee as a clone of this bead)
- moving a control redraws the leftover immediately
- `?embed=1` hides catalogue chrome so the hub living well can iframe this page
- no network, no npm, no localStorage

## UX

- leftover half-round still sitting on one long edge of a board (beaded board / stuck bead), not a spreadsheet, not a Gantt, not a floor plan of rooms, not a cut-list stick, not a bag, not a crease diagram of paper, not a claims beam, not a mixer, not a plumb bob, not a catenary, not a lamp, not a road crown, not a focus plane, not a partition, not a grain-angle dial, not a door swing, not talk columns, not gears, not a kerf gap as the hero, not a rode, not a vent plume, not wheels, not a chair, not a stair, not a pedal, not a ceiling, not a heading, not a glide, not a sash leftover frame, not an eave overhang as shade, not a soffit underside plane, not a fascia board, not a parapet wall, not a keystone lock, not a rail, not a list, not a retaining wall, not a brick course, not a wing, not a fetch, not a lot line, not a crane, not a tree, not a scarf overlap as the hero, not a hill, not a plinth, not a lintel, not a freeboard, not a flue, not a rabbet shoulder as the hero, not a nosing hang, not a going, not a spandrel triangle, not a corbel jut, not a window mullion, not a doorway threshold, not a hatch coaming, not a scupper drain, not a hull chine, not a chamfer single-edge bevel as the hero, not an arris sharp, not a shim pack as the hero, not a ridge peak, not a fillet radius as the hero, not a wane live edge as the hero, not a cup dish as the hero, not a bow length-arch as the hero, not a twist wind as the hero, not a check drying-split as the hero, not a dado through-groove as the hero, not a mortise pocket as the hero, not a tenon tongue as the hero, not a mitre angle as the hero, not a spline key as the hero, not a knot dark as the hero, not a crook edge-sweep as the hero, not a burl swirl as the hero, not a pitch resin as the hero, not a ray flash as the hero, not a sap edge-band as the hero, not a heartwood core as the hero, not a year-band as the hero, not a curl wave as the hero, not an eye dimple as the hero, not a quilt blister as the hero, not a spalt zone-line as the hero, not a stain wash as the hero, not a ribbon stripe as the hero, not a crotch plume as the hero, not a mottle blotch as the hero, not a drip run as the hero, not a flame leap as the hero, not a clock
- seeded demo already shows a visible leftover (not a square-only edge)
- live bead, leftover labelled as a sketch (square / showing)
- keyboard moves the focused control
- SVG text alternative names whether the bead is showing
- reset returns the seed

## Deployment plan

- deploy as static files on Vercel
- keep each product in its own folder
- expose the product at `products/bead/`

## Verification

- page loads in a browser without build tooling
- one SVG scene (section / one board / leftover bead) is in the DOM
- seeded leftover is visible (showing — not square)
- changing a control redraws and updates the readout
- no paste-well hero, no fillet scoop as the hero, no chamfer bevel as the hero, no wane bite as the hero, no flame peaks as the hero, no curl wave as the hero, no ribbon stripe as the hero, no drip run as the hero, no clock face
