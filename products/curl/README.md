# Curl

A board looks even until you see the curl. Move the figure. See the leftover wave.

This is not Burl. Burl is leftover swirl of figure from a dormant bud. This is not Ring. Ring is leftover annual year-band that still sits in the face. This is not Heart. Heart is leftover inner that still occupies the core as a darker heartwood zone down the middle. This is not Sap. Sap is leftover pale that still bands the edge. This is not Ray. Ray is leftover medullary flash / spoke. This is not Knot. Knot is leftover circular dark of branch wood. This is not Grain. Grain is leftover mismatch of the cut to the fibres. This is not Crook. Crook is leftover edge sweep in plan. This is not a paste well. This is not a clock. Curl answers “how far the leftover wave still sits in the figure.”

## Problem

A board looks even until you see the curl:

- how far does the leftover wave still sit in the figure?
- is the leftover even, or showing?
- when is the leftover wave-figure obvious — as a sketch, not a mill sign-off?

Existing tools in this catalogue measure leftover year that still sits in the face as leftover annual growth, leftover inner that still occupies the core as a darker heartwood zone down the middle of a pale sapwood face, leftover pale that still bands the edge of a heartwood face, leftover circular dark that still sits in the face as branch wood, leftover medullary flash that still cuts across the face as a spoke from pith toward bark, leftover resin that still sits in the face as a pocket of gum, leftover swirl of figure from a dormant bud, leftover live edge that still takes the square off a board, leftover mismatch of the cut to the fibres, leftover drying split that still opens along the face, leftover closed joinery pocket that still opens in the face, leftover sweep that still curves the edge in plan, leftover key that still sits between two boards as a separate slip, leftover tongue that still projects from the end, leftover housing groove that still cuts across the grain, leftover angle that still cuts the square meet, leftover rebate along the edge, leftover wind that still spirals one end of a board off the other, leftover dish that still warps a board across its width, leftover arch that still warps a board along its length, leftover millimetres of stock, leftover blade gap, leftover radius that still fills a concave corner, leftover bevel that still takes the sharp off, leftover sharp where two planes meet, leftover packing that still fills a gap, leftover peak where two roof planes meet, leftover board covering rafter tails, leftover underside plane, leftover roof overhang, leftover hull crease, leftover drain through a bulwark, leftover hatch lip, leftover doorway bar, leftover window bar, leftover sash-frame, leftover lintel span, leftover tread hang, leftover jutting stone, leftover vault infill, and leftover overlap along the length. They do not show leftover curl — leftover wave that still sits in the figure as leftover undulating wave-figure: leftover 3D-looking bands that shimmer across the wood (fiddleback), not a burl swirl, not annual rings, not a circular knot, not a radial medullary spoke, not a heartwood core occupying the middle, not a pale sap stripe along the edge, not a cut-to-fibre mismatch, not a crook.

## Users

- people who already know a board can look even until the leftover wave shows
- anyone who refuses to treat a burl swirl, a year-band, a heartwood core, a sap edge-band, a ray flash, a knot dark, a packed sky, or a clock as this leftover
- desks that want curl as a sketch, not a mill sign-off
- teams that want a no-backend, local-only pass — not Burl, not Ring, not Heart, not a paste well

## Workflow

1. Load the seed: 28 mm of leftover curl — already showing, not an even-only face
2. Read the scene: one board in face, a leftover whose leftover is the curl, leftover labelled as a sketch
3. Move curl (or use the arrow keys on the focused slider); leftover names showing or even
4. Drop the leftover toward 0 mm and the board looks even / no leftover curl; raise it and the leftover wave still sits in the figure
5. Reset restores the seeded leftover showing

## Data model

One board in face with leftover curl as leftover wave that still sits in the figure:

- `curl` — millimetres of leftover wave-figure showing (default 28)

Derived picture:

- leftover labelled as a sketch (even / showing), not a mill sign-off
- leftover wave labelled as a sketch
- even / no leftover curl when curl ≤ 4 mm (the board looks even throughout)

Nothing is persisted. Refresh restores the seeded scene.

## Architecture

- static HTML/CSS/JS
- no backend required for the prototype
- one SVG scene: one board in face — a leftover whose leftover is the curl; leftover is leftover wave that still sits in the figure as leftover undulating wave-figure (leftover 3D-looking bands that shimmer across the wood, not a burl swirl, not annual rings, not a circular knot, not a radial medullary spoke, not a heartwood core occupying the middle, not a pale sap stripe along the edge, not a cut-to-fibre mismatch)
- moving a control redraws the leftover immediately
- `?embed=1` hides catalogue chrome so the hub living well can iframe this page
- no network, no npm, no localStorage

## UX

- leftover undulating wave-bands of figure that still sit in the face as leftover 3D-looking bands that shimmer (fiddleback), not a spreadsheet, not a Gantt, not a floor plan of rooms, not a cut-list stick, not a bag, not a crease diagram of paper, not a claims beam, not a mixer, not a plumb bob, not a catenary, not a lamp, not a road crown, not a focus plane, not a partition, not a grain-angle dial, not a door swing, not talk columns, not gears, not a kerf gap as the hero, not a rode, not a vent plume, not wheels, not a chair, not a stair, not a pedal, not a ceiling, not a heading, not a glide, not a sash leftover frame, not an eave overhang as shade, not a soffit underside plane, not a fascia board, not a parapet wall, not a keystone lock, not a rail, not a list, not a retaining wall, not a brick course, not a wing, not a fetch, not a lot line, not a crane, not a tree, not a scarf overlap as the hero, not a hill, not a plinth, not a lintel, not a freeboard, not a flue, not a rabbet shoulder as the hero, not a nosing hang, not a going, not a spandrel triangle, not a corbel jut, not a window mullion, not a doorway threshold, not a hatch coaming, not a scupper drain, not a hull chine, not a chamfer single-edge bevel as the hero, not an arris sharp, not a shim pack as the hero, not a ridge peak, not a fillet radius, not a wane live edge as the hero, not a cup dish as the hero, not a bow length-arch as the hero, not a twist wind as the hero, not a check drying-split as the hero, not a dado through-groove as the hero, not a mortise pocket as the hero, not a tenon tongue as the hero, not a mitre angle as the hero, not a spline key as the hero, not a knot dark as the hero, not a crook edge-sweep as the hero, not a burl swirl as the hero, not a pitch resin as the hero, not a ray flash as the hero, not a sap edge-band as the hero, not a heartwood core as the hero, not a year-band as the hero, not a clock
- seeded demo already shows a visible leftover (not an even-only face)
- live curl, leftover labelled as a sketch (even / showing)
- keyboard moves the focused control
- SVG text alternative names whether the curl is showing
- reset returns the seed

## Deployment plan

- deploy as static files on Vercel
- keep each product in its own folder
- expose the product at `products/curl/`

## Verification

- page loads in a browser without build tooling
- one SVG scene (face / one board / leftover curl) is in the DOM
- seeded leftover is visible (showing — not even)
- changing a control redraws and updates the readout
- no paste-well hero, no burl swirl as the hero, no year-band as the hero, no knot dark as the hero, no sap edge-band as the hero, no ray flash as the hero, no heartwood core as the hero, no grain-angle mismatch as the hero, no clock face
