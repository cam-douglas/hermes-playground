# Mullion

A window looks open until you see the mullion. Move the lights. See the leftover bar.

This is not Reveal. Reveal is leftover sash-frame around a sash. This is not Lintel. Lintel is leftover span over an opening. This is not Swing. Swing is leftover door arc. This is not Corbel. Corbel is leftover jutting stone. This is not Spandrel. Spandrel is leftover vault infill. This is not a clock. Mullion answers “how far the leftover bar still divides the lights, leftover window bar as seen in elevation.”

## Problem

A window looks open until you see the mullion:

- how far does the leftover bar still divide the lights?
- is the leftover open, or showing?
- when is the leftover bar obvious — as a picture, not a joinery sign-off?

Existing tools in this catalogue measure leftover sash-frame around a sash, leftover lintel span, leftover door swing, leftover jutting stone, and leftover vault infill. They do not show leftover window bar — how far a mullion still divides two lights.

## Users

- people who already know a window can look open until the leftover mullion shows
- anyone who refuses to treat a reveal, a lintel, a door swing, a corbel, a spandrel, or a clock as this leftover
- desks that want mullion as a picture, not a joinery sign-off
- teams that want a no-backend, local-only pass — not Reveal, not Lintel, not Swing, not Corbel, not Spandrel, not a paste well

## Workflow

1. Load the seed: 28 mm of leftover bar — already showing, not open / not flush
2. Read the scene: one elevation, a window with two lights and a vertical mullion between them, leftover labelled as a sketch
3. Move bar (or use the arrow keys on the focused slider); leftover names showing or open
4. Drop the leftover toward 0 mm and the window looks like one opening; raise it and the leftover bar shows
5. Reset restores the seeded leftover showing

## Data model

One elevation with leftover mullion as leftover bar:

- `bar` — millimetres of leftover bar width (default 28)

Derived picture:

- leftover labelled as a sketch (open / showing), not a joinery sign-off
- leftover bar labelled as a sketch
- open / flush when bar ≤ 4 mm

Nothing is persisted. Refresh restores the seeded scene.

## Architecture

- static HTML/CSS/JS
- no backend required for the prototype
- one SVG scene: an elevation — a window with two lights and a vertical mullion between them; leftover is how far the leftover bar still divides the lights
- moving a control redraws the leftover immediately
- `?embed=1` hides catalogue chrome so the hub living well can iframe this page
- no network, no npm, no localStorage

## UX

- one leftover bar in elevation, not a spreadsheet, not a Gantt, not a floor plan, not a cut-list stick, not a bag, not a crease diagram, not a claims beam, not a mixer, not a plumb bob, not a catenary, not a lamp, not a road crown, not a focus plane, not a partition, not a grain-angle dial, not a door swing, not talk columns, not gears, not a kerf gap, not a rode, not a vent plume, not wheels, not a chair, not a stair, not a pedal, not a ceiling, not a heading, not a glide, not a sash leftover frame, not an eave overhang, not a rail, not a list, not a retaining wall, not a brick course, not a wing, not a fetch, not a lot line, not a crane, not a tree, not a scarf, not a hill, not a keystone lock, not a plinth, not a lintel, not a freeboard, not a flue, not a parapet, not a rabbet, not a nosing hang, not a spandrel triangle, not a corbel jut, not a clock
- seeded demo already shows a visible leftover (not open / not flush)
- live bar, leftover labelled as a sketch (open / showing)
- keyboard moves the focused control
- SVG text alternative names whether the mullion is showing
- reset returns the seed

## Deployment plan

- deploy as static files on Vercel
- keep each product in its own folder
- expose the product at `products/mullion/`

## Verification

- page loads in a browser without build tooling
- one SVG scene (elevation / leftover window bar between two lights) is in the DOM
- seeded leftover is visible (showing — not open / not flush)
- changing a control redraws and updates the readout
- no paste-well hero, no leftover sash-frame, no lintel span, no door swing, no corbel jut, no spandrel triangle, no clock face
