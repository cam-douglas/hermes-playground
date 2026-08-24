# Flute

A board looks even until you see the flute. Move the hollow. See the leftover channel.

This is not Dado. Dado is leftover single housing groove across the grain for a shelf. This is not Bead. Bead is leftover convex half-round still sitting on one long edge. This is not Reed. Reed is leftover parallel convex beads — a clone of bead, not this. This is not Drip. Drip is leftover liquid run. This is not Check. Check is leftover drying split. This is not Fillet. Fillet is leftover concave corner radius. This is not Chamfer. Chamfer is leftover bevel. This is not Arris. Arris is leftover sharp. This is not Wane. Wane is leftover irregular live-edge / bark. This is not Ribbon. Ribbon is leftover vertical quartered stripe-bands of figure. This is not Fold Sheet. Fold Sheet is leftover paper creases. This is not ovolo or ogee or quirk as a clone of bead. This is not a paste well. This is not a clock. Flute answers “how deep the leftover hollow still sits in the face.”

## Problem

A board looks even until you see the flute:

- how deep do the leftover parallel concave hollows still sit along the length of the face?
- is the leftover even, or showing?
- when is the leftover flute obvious — as a sketch, not a mill sign-off?

Existing tools in this catalogue measure leftover single housing groove across the grain, leftover convex half-round still sitting on one long edge, leftover covering strip still sitting over a joint, leftover pin still sitting through a join, leftover liquid run, leftover drying split, leftover radius that still fills a concave corner, leftover bevel that still takes the sharp off one edge, leftover sharp where two planes meet, leftover irregular live-edge / bark, leftover millimetres of stock, leftover blade gap, leftover board covering rafter tails, leftover drain, leftover hatch lip, leftover doorway bar, leftover window bar, leftover lintel span, leftover tread hang, leftover jutting stone, leftover vault infill, and leftover overlap along the length. They do not show leftover flute — leftover hollow that still sits in the face as leftover parallel concave channels running along the length of a board (fluted board / fluted column), not Dado (housing groove across the grain), not Bead (convex half-round on the edge), not Reed (parallel convex beads — a clone of bead), not Drip (liquid run), not Check (drying split), not a ribbon of figure, not a paper fold-sheet.

## Users

- people who already know a board can look even until the leftover hollow shows
- anyone who refuses to treat a dado housing, a stuck bead, a reed of convex beads, a drip run, a check split, a packed sky, or a clock as this leftover
- desks that want flute as a sketch, not a mill sign-off
- teams that want a no-backend, local-only pass — not Dado, not Bead, not Reed, not a paste well

## Workflow

1. Load the seed: 26 mm of leftover flute — already showing, not an even-face-only scene
2. Read the scene: one board in face, a slight section that shows concave hollows, a leftover whose leftover is the flute, leftover labelled as a sketch
3. Move flute (or use the arrow keys on the focused slider); leftover names showing or even
4. Drop the leftover toward 0 mm and the board looks even / no leftover flute; raise it and more leftover hollows still sit in the face
5. Reset restores the seeded leftover showing

## Data model

One board in face, with a slight section, with leftover flute as leftover hollow that still sits in the face:

- `flute` — millimetres of leftover hollow showing (default 26)

Derived picture:

- leftover labelled as a sketch (even / showing), not a mill sign-off
- leftover hollow labelled as a sketch
- even / no leftover flute when flute ≤ 4 mm (the board looks even throughout)

Nothing is persisted. Refresh restores the seeded scene.

## Architecture

- static HTML/CSS/JS
- no backend required for the prototype
- one SVG scene: one board in face, with a slight section — a leftover whose leftover is the flute; leftover is leftover hollow that still sits in the face as leftover parallel concave channels running along the length (not a single dado housing across the grain, not a convex bead on the edge, not a reed of convex beads, not a drip trail, not a check split)
- moving a control redraws the leftover immediately
- `?embed=1` hides catalogue chrome so the hub living well can iframe this page
- no network, no npm, no localStorage

## UX

- leftover parallel concave channels still sitting along the length of the face (fluted board / fluted column), not a spreadsheet, not a Gantt, not a floor plan of rooms, not a cut-list stick, not a bag, not a crease diagram of paper, not a claims beam, not a mixer, not a plumb bob, not a catenary, not a lamp, not a road crown, not a focus plane, not a partition, not a grain-angle dial, not a door swing, not talk columns, not gears, not a kerf gap as the hero, not a rode, not a vent plume, not wheels, not a chair, not a stair, not a pedal, not a ceiling, not a heading, not a glide, not a sash leftover frame, not an eave overhang as shade, not a soffit underside plane, not a fascia board as the hero, not a parapet wall, not a keystone lock, not a rail, not a list, not a retaining wall, not a brick course, not a wing, not a fetch, not a lot line, not a crane, not a tree, not a scarf overlap as the hero, not a hill, not a plinth, not a lintel, not a freeboard, not a flue, not a rabbet shoulder as the hero, not a nosing hang, not a going, not a spandrel triangle, not a corbel jut, not a window mullion, not a doorway threshold, not a hatch coaming, not a scupper drain, not a hull chine, not a chamfer single-edge bevel as the hero, not an arris sharp, not a shim pack as the hero, not a ridge peak, not a fillet radius as the hero, not a wane live edge as the hero, not a cup dish as the hero, not a bow length-arch as the hero, not a twist wind as the hero, not a check drying-split as the hero, not a dado through-groove as the hero, not a mortise pocket as the hero, not a tenon tongue as the hero, not a mitre angle as the hero, not a spline key as the hero, not a knot dark as the hero, not a crook edge-sweep as the hero, not a burl swirl as the hero, not a pitch resin as the hero, not a ray flash as the hero, not a sap edge-band as the hero, not a heartwood core as the hero, not a year-band as the hero, not a curl wave as the hero, not an eye dimple as the hero, not a quilt blister as the hero, not a spalt zone-line as the hero, not a stain wash as the hero, not a ribbon stripe as the hero, not a crotch plume as the hero, not a mottle blotch as the hero, not a drip run as the hero, not a flame leap as the hero, not a bead round as the hero, not a batten cover as the hero, not a dowel pin as the hero, not a clock
- seeded demo already shows a visible leftover (not an even-face-only scene)
- live flute, leftover labelled as a sketch (even / showing)
- keyboard moves the focused control
- SVG text alternative names whether the flute is showing
- reset returns the seed

## Deployment plan

- deploy as static files on Vercel
- keep each product in its own folder
- expose the product at `products/flute/`

## Verification

- page loads in a browser without build tooling
- one SVG scene (face / slight section / leftover flute) is in the DOM
- seeded leftover is visible (showing — not even)
- changing a control redraws and updates the readout
- no paste-well hero, no dado housing as the hero, no convex bead as the hero, no reed of convex beads as the hero, no drip run as the hero, no check split as the hero, no clock face
