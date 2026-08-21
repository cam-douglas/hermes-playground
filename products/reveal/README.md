# Reveal

A window looks flush until you see the reveal. Move the sash. See the leftover frame.

This is not Swing. Swing is a door arc and leftover clearance. This is not Headroom. Headroom is a standing figure versus a ceiling. This is not Sightline. Sightline is a seated eye line versus a partition. This is not Dark Floor. Dark Floor is a night plan of booked rooms. This is not a clock. Reveal answers “how much leftover frame still shows around a sash, as seen in section.”

## Problem

A window looks flush until you see the reveal:

- how much frame still shows around the sash?
- is the leftover flush, or showing?
- when is the leftover obvious — as a picture, not a joinery sign-off?

Existing tools in this catalogue measure a door swing, leftover ceiling, an eye line versus a partition, and leftover range of an approach. They do not show leftover frame around a sash.

## Users

- people who already know a window can look flush until the leftover frame shows
- anyone who refuses to treat a door, a ceiling, an eye line, or a clock as this leftover
- desks that want reveal as a picture, not a joinery spec
- teams that want a no-backend, local-only pass — not Swing, not Headroom, not Sightline, not a paste well

## Workflow

1. Load the seed: 42 mm of leftover frame around the sash — already showing, not flush / not zero
2. Read the scene: window in section, sash sitting inside a frame, leftover reveal still showing around it
3. Move reveal (or use the arrow keys on the focused slider); leftover names showing or flush
4. Drop the reveal toward 0 mm and the sash meets the frame; raise it and more frame shows
5. Reset restores the seeded leftover showing

## Data model

One section of a window:

- `reveal` — millimetres of leftover frame around the sash (default 42)

Derived picture:

- leftover labelled as a sketch (flush / showing), not a joinery sign-off
- flush when reveal ≤ 4 mm

Nothing is persisted. Refresh restores the seeded scene.

## Architecture

- static HTML/CSS/JS
- no backend required for the prototype
- one SVG scene: sash inside a frame, leftover reveal showing around it
- moving a control redraws the leftover immediately
- `?embed=1` hides catalogue chrome so the hub living well can iframe this page
- no network, no npm, no localStorage

## UX

- sash versus frame in section, not a spreadsheet, not a Gantt, not a night plan of rooms, not a cut-list stick, not a bag, not a crease diagram, not a claims beam, not a mixer, not a plumb bob, not a catenary, not a lamp, not a road crown, not a focus plane, not a partition, not a grain-angle dial, not a door, not talk columns, not gears, not a kerf gap, not a rode, not a vent, not wheels, not a chair, not a stair, not a pedal, not a ceiling, not a heading, not a glide, not a clock
- seeded demo already shows a visible leftover (not flush / not zero)
- live reveal, leftover labelled as a sketch (flush / showing)
- keyboard moves the focused control
- SVG text alternative names whether reveal is showing
- reset returns the seed

## Deployment plan

- deploy as static files on Vercel
- keep each product in its own folder
- expose the product at `products/reveal/`

## Verification

- page loads in a browser without build tooling
- one SVG scene (sash vs frame) is in the DOM
- seeded leftover is visible (showing — not flush)
- changing a control redraws and updates the readout
- no paste-well hero, no door arc, no standing figure vs ceiling, no seated eye line, no night plan, no clock face
