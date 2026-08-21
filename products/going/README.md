# Going

A stair looks even until you put a foot on it. Move the going. See the leftover tread.

This is not Camber. Camber is a crowned road — leftover rise. This is not Rake. Rake is chair-back angle from vertical. This is not Dark Floor. Dark Floor is a night plan of empty booked rooms. This is not Swing. Swing is a door arc. This is not a clock. Going answers “how much leftover tread does a foot actually get, as seen from the side.”

## Problem

A stair looks even until you put a foot on it:

- is the going short, or enough?
- how many millimetres of leftover tread sit off a dashed enough-going mark?
- when is the leftover obvious — as a picture, not a building-code table?

Existing tools in this catalogue crown a road, rake a chair, swing a door, and plan empty rooms. They do not show leftover stair going from the side.

## Users

- people who already know a stair can look even while the tread is still short
- anyone who refuses to treat a crowned road, a chair back, a door arc, or a clock as this leftover
- desks that want going as a picture, not a building-code table
- teams that want a no-backend, local-only pass — not Camber, not Rake, not Dark Floor, not a paste well

## Workflow

1. Load the seed: 180 mm going, already short versus a 250 mm enough-going mark
2. Read the scene: stair in side view, dashed enough-going versus the actual tread, a sketched foot
3. Move going (or rise; or use the arrow keys on the focused slider); leftover names short or enough
4. Push the slider toward 250 mm and the foot starts to fit; reset restores the seeded leftover shortage
5. Reset restores the seeded leftover short going

## Data model

One side view of a stair:

- `going` — millimetres of tread a foot actually gets (default 180)
- `rise` — millimetres of step height (default 175)

Derived picture:

- labelled as a sketch (short / enough), not a building-code sign-off

Nothing is persisted. Refresh restores the seeded scene.

## Architecture

- static HTML/CSS/JS
- no backend required for the prototype
- one SVG scene: stair in side view, rise plus going, dashed enough-going, leftover tread, sketched foot
- moving a control redraws the tread immediately
- `?embed=1` hides catalogue chrome so the hub living well can iframe this page
- no network, no npm, no localStorage

## UX

- a stair in side view, not a spreadsheet, not a Gantt, not a night plan of rooms, not a cut-list stick, not a bag, not a crease diagram, not a claims beam, not a mixer, not a plumb bob, not a catenary, not a lamp, not a road crown, not a focus plane, not a partition, not a grain-angle dial, not a door, not talk columns, not gears, not a kerf gap, not a rode, not a vent, not wheels, not a chair, not a clock
- seeded demo already shows a visible leftover shortage
- live going, leftover labelled as a sketch (short / enough)
- keyboard moves the focused control
- SVG text alternative names whether going is short
- reset returns the seed

## Deployment plan

- deploy as static files on Vercel
- keep each product in its own folder
- expose the product at `products/going/`

## Verification

- page loads in a browser without build tooling
- one SVG scene (stair in side view + dashed enough-going) is in the DOM
- seeded leftover is visible (180 mm short — not a generous tread)
- changing a control redraws and updates the readout
- no paste-well hero, no crowned road, no chair, no door arc, no clock face
