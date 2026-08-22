# Corbel

A wall looks flush until you see the corbel. Move the stone. See the leftover jut.

This is not Plinth. Plinth is a base step. This is not Lintel. Lintel is leftover span over an opening. This is not Batter. Batter is a retaining-wall slope. This is not Parapet. Parapet is leftover wall above the roof. This is not Spandrel. Spandrel is leftover infill between arch and rectangle. This is not Keystone. Keystone is leftover lock stone. This is not a clock. Corbel answers “how far the stone still juts as leftover carry, leftover jutting stone as seen in elevation.”

## Problem

A wall looks flush until you see the corbel:

- how far does the stone still jut as leftover carry?
- is the leftover flush, or showing?
- when is the leftover jut obvious — as a picture, not a masonry spec?

Existing tools in this catalogue measure leftover plinth step, leftover lintel span, leftover retaining-wall batter, leftover wall above the roof, leftover vault infill, and leftover arch lock. They do not show leftover jutting stone — how far a corbel still juts to carry a beam or upper course.

## Users

- people who already know a wall can look flush until the leftover corbel shows
- anyone who refuses to treat a plinth, a lintel, a batter, a parapet, a spandrel, a keystone, or a clock as this leftover
- desks that want corbel as a picture, not a masonry sign-off
- teams that want a no-backend, local-only pass — not Plinth, not Lintel, not Batter, not Parapet, not Spandrel, not Keystone, not a paste well

## Workflow

1. Load the seed: 140 mm of leftover jut — already showing, not flush
2. Read the scene: one elevation, a masonry wall with a corbel jutting out to carry a beam, leftover labelled as a sketch
3. Move jut (or use the arrow keys on the focused slider); leftover names showing or flush
4. Drop the leftover toward 0 mm and the wall looks flush; raise it and the leftover jut shows
5. Reset restores the seeded leftover showing

## Data model

One elevation with leftover corbel as leftover jut:

- `jut` — millimetres of leftover jut (default 140)

Derived picture:

- leftover labelled as a sketch (flush / showing), not a masonry sign-off
- leftover carry labelled as a sketch
- flush when jut ≤ 15 mm

Nothing is persisted. Refresh restores the seeded scene.

## Architecture

- static HTML/CSS/JS
- no backend required for the prototype
- one SVG scene: an elevation — a masonry wall with a corbel jutting out to carry a beam or upper course; leftover is how far the stone still juts as leftover carry
- moving a control redraws the leftover immediately
- `?embed=1` hides catalogue chrome so the hub living well can iframe this page
- no network, no npm, no localStorage

## UX

- one leftover jut in elevation, not a spreadsheet, not a Gantt, not a floor plan, not a cut-list stick, not a bag, not a crease diagram, not a claims beam, not a mixer, not a plumb bob, not a catenary, not a lamp, not a road crown, not a focus plane, not a partition, not a grain-angle dial, not a door swing, not talk columns, not gears, not a kerf gap, not a rode, not a vent plume, not wheels, not a chair, not a stair, not a pedal, not a ceiling, not a heading, not a glide, not a window sash, not an eave overhang, not a rail, not a list, not a retaining wall, not a brick course, not a wing, not a fetch, not a lot line, not a crane, not a tree, not a scarf, not a hill, not a keystone lock, not a plinth, not a lintel, not a freeboard, not a flue, not a parapet, not a rabbet, not a nosing hang, not a spandrel triangle, not a clock
- seeded demo already shows a visible leftover (not flush)
- live jut, leftover labelled as a sketch (flush / showing)
- keyboard moves the focused control
- SVG text alternative names whether the corbel is showing
- reset returns the seed

## Deployment plan

- deploy as static files on Vercel
- keep each product in its own folder
- expose the product at `products/corbel/`

## Verification

- page loads in a browser without build tooling
- one SVG scene (elevation / leftover jutting stone as leftover carry) is in the DOM
- seeded leftover is visible (showing — not flush)
- changing a control redraws and updates the readout
- no paste-well hero, no plinth step, no lintel span, no batter slope, no parapet wall, no spandrel triangle, no keystone lock, no clock face
