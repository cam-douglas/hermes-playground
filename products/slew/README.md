# Slew

A boom looks still until you see the slew. Move the cab. See the leftover turn.

This is not Yaw. Yaw is leftover heading off a dashed course. This is not Swing. Swing is leftover door arc. This is not Bank. Bank is leftover wing roll. This is not a clock. Slew answers “how far the boom still turns from the last stop, leftover crane turn as seen in plan.”

## Problem

A boom looks still until you see the slew:

- how far does the boom still turn from the last stop?
- is the leftover parked, or showing?
- when is the leftover turn obvious — as a picture, not a lift spec?

Existing tools in this catalogue measure leftover heading, leftover door arc, and leftover wing roll. They do not show leftover crane turn.

## Users

- people who already know a boom can look still until the leftover slew shows
- anyone who refuses to treat a heading, a door, a wing, or a clock as this leftover
- desks that want slew as a picture, not a lift sign-off
- teams that want a no-backend, local-only pass — not Yaw, not Swing, not Bank, not a paste well

## Workflow

1. Load the seed: 38° of leftover slew — already showing, not parked / not zero
2. Read the scene: a crane in plan, cab and boom, leftover slew labelled as a sketch
3. Move slew (or use the arrow keys on the focused slider); leftover names showing or parked
4. Drop the slew toward 0° and the boom sits on the last stop; raise it and the leftover turn shows
5. Reset restores the seeded leftover showing

## Data model

One crane in plan:

- `slew` — degrees of leftover crane turn from the last stop (default 38)

Derived picture:

- leftover labelled as a sketch (parked / showing), not a lift sign-off
- leftover turn labelled as a sketch
- parked when slew ≤ 4°

Nothing is persisted. Refresh restores the seeded scene.

## Architecture

- static HTML/CSS/JS
- no backend required for the prototype
- one SVG scene: cab, boom, leftover slew as the turn from the last stop
- moving a control redraws the leftover immediately
- `?embed=1` hides catalogue chrome so the hub living well can iframe this page
- no network, no npm, no localStorage

## UX

- crane boom versus leftover turn in plan, not a spreadsheet, not a Gantt, not a floor plan, not a cut-list stick, not a bag, not a crease diagram, not a claims beam, not a mixer, not a plumb bob, not a catenary, not a lamp, not a road crown, not a focus plane, not a partition, not a grain-angle dial, not a door, not talk columns, not gears, not a kerf gap, not a rode, not a vent, not wheels, not a chair, not a stair, not a pedal, not a ceiling, not a heading, not a glide, not a window frame, not a roof, not a rail, not a hull, not a retaining wall, not a brick course, not a wing, not a sea, not a lot line, not a clock
- seeded demo already shows a visible leftover (not parked / not zero)
- live slew, leftover labelled as a sketch (parked / showing)
- keyboard moves the focused control
- SVG text alternative names whether slew is showing
- reset returns the seed

## Deployment plan

- deploy as static files on Vercel
- keep each product in its own folder
- expose the product at `products/slew/`

## Verification

- page loads in a browser without build tooling
- one SVG scene (crane boom / leftover turn) is in the DOM
- seeded leftover is visible (showing — not parked)
- changing a control redraws and updates the readout
- no paste-well hero, no heading course, no door arc, no wings, no clock face
