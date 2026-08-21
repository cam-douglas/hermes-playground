# Rake

A chair looks upright until you see the rake. Move the back. See the leftover sit.

This is not Camber. Camber is a crowned road — leftover rise. This is not Grain. Grain is cut versus grain on a plank. This is not Toe. Toe is wheel angle from above. This is not Plumb. Plumb is a hanging bob. This is not a clock. Rake answers “how far does the chair back still lean from vertical, as seen from the side.”

## Problem

A chair looks upright until you see the rake:

- is the back upright, or reclined?
- how many degrees of leftover sit off the dashed vertical?
- when is the leftover obvious — as a picture, not a furniture spec sheet?

Existing tools in this catalogue crown a road, cut a plank, toe two wheels, and hang a bob. They do not show leftover chair-back angle from the side.

## Users

- people who already know a chair can look upright while the back still rakes
- anyone who refuses to treat a crowned road, a plank cut, wheel toe, or a clock as this leftover
- desks that want rake as a picture, not a furniture spec sheet
- teams that want a no-backend, local-only pass — not Camber, not Grain, not Toe, not a paste well

## Workflow

1. Load the seed: 16° rake, already reclined from vertical
2. Read the scene: chair in side view, dashed vertical versus the actual back
3. Move rake (or use the arrow keys on the focused slider); leftover names upright or reclined
4. Push the slider toward zero and the back stands up; reset restores the seeded leftover sit
5. Reset restores the seeded leftover recline

## Data model

One side view of a chair:

- `rake` — degrees from vertical (default 16)

Derived picture:

- labelled as a sketch (upright / reclined), not a shop sign-off

Nothing is persisted. Refresh restores the seeded scene.

## Architecture

- static HTML/CSS/JS
- no backend required for the prototype
- one SVG scene: chair in side view, seat plus back, dashed vertical, leftover rake
- moving a control redraws the back immediately
- `?embed=1` hides catalogue chrome so the hub living well can iframe this page
- no network, no npm, no localStorage

## UX

- a chair in side view, not a spreadsheet, not a Gantt, not a night plan of rooms, not a cut-list stick, not a bag, not a crease diagram, not a claims beam, not a mixer, not a plumb bob, not a catenary, not a lamp, not a road crown, not a focus plane, not a partition, not a grain-angle dial, not a door, not talk columns, not gears, not a kerf gap, not a rode, not a vent, not wheels, not a clock
- seeded demo already shows a visible leftover recline
- live rake, leftover labelled as a sketch (upright / reclined)
- keyboard moves the focused control
- SVG text alternative names whether the back is reclined
- reset returns the seed

## Deployment plan

- deploy as static files on Vercel
- keep each product in its own folder
- expose the product at `products/rake/`

## Verification

- page loads in a browser without build tooling
- one SVG scene (chair in side view + dashed vertical) is in the DOM
- seeded leftover is visible (16° reclined — not zero / not bolt-upright)
- changing a control redraws and updates the readout
- no paste-well hero, no crowned road, no plank, no wheels, no clock face
