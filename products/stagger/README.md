# Stagger

A course looks even until you see the stagger. Move the bond. See the leftover offset.

This is not Grain. Grain is a plank leftover cut versus grain. This is not Batter. Batter is leftover retaining-wall slope. This is not Plumb. Plumb is a hanging bob. This is not a clock. Stagger answers “how far the upper course still offsets from the course below, leftover bond as seen in elevation.”

## Problem

A course looks even until you see the stagger:

- how far does the upper course still offset from the one below?
- is the leftover stacked, or showing?
- when is the leftover bond obvious — as a picture, not a masonry sign-off?

Existing tools in this catalogue measure leftover plank mismatch, leftover retaining-wall slope, and leftover vertical offset with a bob. They do not show leftover brick bond.

## Users

- people who already know a course can look even until the leftover stagger shows
- anyone who refuses to treat a plank, a slope, a bob, or a clock as this leftover
- desks that want stagger as a picture, not a masonry spec
- teams that want a no-backend, local-only pass — not Grain, not Batter, not Plumb, not a paste well

## Workflow

1. Load the seed: 108mm of leftover offset — already showing, not stacked / not zero
2. Read the scene: two brick courses in elevation, upper course offset, leftover stagger labelled
3. Move stagger (or use the arrow keys on the focused slider); leftover names showing or stacked
4. Drop the stagger toward 0mm and the courses stack; raise it and the leftover offset shows
5. Reset restores the seeded leftover showing

## Data model

Two courses of brick in elevation:

- `stagger` — millimetres of leftover offset from the course below (default 108)

Derived picture:

- leftover labelled as a sketch (stacked / showing), not a masonry sign-off
- stacked when stagger ≤ 8mm

Nothing is persisted. Refresh restores the seeded scene.

## Architecture

- static HTML/CSS/JS
- no backend required for the prototype
- one SVG scene: two brick courses, leftover stagger as offset
- moving a control redraws the leftover immediately
- `?embed=1` hides catalogue chrome so the hub living well can iframe this page
- no network, no npm, no localStorage

## UX

- two brick courses versus leftover offset in elevation, not a spreadsheet, not a Gantt, not a night plan of rooms, not a cut-list stick, not a bag, not a crease diagram, not a claims beam, not a mixer, not a plumb bob, not a catenary, not a lamp, not a road crown, not a focus plane, not a partition, not a grain-angle dial, not a door, not talk columns, not gears, not a kerf gap, not a rode, not a vent, not wheels, not a chair, not a stair, not a pedal, not a ceiling, not a heading, not a glide, not a window frame, not a roof, not a rail, not a hull, not a retaining wall, not a clock
- seeded demo already shows a visible leftover (not stacked / not zero)
- live stagger, leftover labelled as a sketch (stacked / showing)
- keyboard moves the focused control
- SVG text alternative names whether stagger is showing
- reset returns the seed

## Deployment plan

- deploy as static files on Vercel
- keep each product in its own folder
- expose the product at `products/stagger/`

## Verification

- page loads in a browser without build tooling
- one SVG scene (two brick courses / leftover offset) is in the DOM
- seeded leftover is visible (showing — not stacked)
- changing a control redraws and updates the readout
- no paste-well hero, no wood grain, no sloping retaining wall, no hanging bob, no clock face
