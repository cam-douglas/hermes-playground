# Eave

A roof looks flush until you see the eave. Move the overhang. See the leftover shade.

This is not Headroom. Headroom is a standing figure versus a ceiling. This is not Reveal. Reveal is leftover frame around a sash. This is not Swing. Swing is a door arc. This is not Going. Going is a stair tread. This is not a clock. Eave answers “how far the roof still sticks past the wall, and the leftover shade it casts, as seen in section.”

## Problem

A roof looks flush until you see the eave:

- how far does the roof still stick past the wall?
- is the leftover flush, or showing?
- when is the leftover shade obvious — as a picture, not a roofing sign-off?

Existing tools in this catalogue measure leftover ceiling, leftover frame around a sash, a door swing, and a stair tread. They do not show leftover roof overhang past a wall.

## Users

- people who already know a roof can look flush until the leftover eave shows
- anyone who refuses to treat a ceiling, a window, a door, a stair, or a clock as this leftover
- desks that want eave as a picture, not a roofing spec
- teams that want a no-backend, local-only pass — not Headroom, not Reveal, not Swing, not Going, not a paste well

## Workflow

1. Load the seed: 480 mm of leftover overhang past the wall — already showing, not flush / not zero
2. Read the scene: roof in section, wall, eave still sticking past it, leftover shade under the overhang
3. Move overhang (or use the arrow keys on the focused slider); leftover names showing or flush
4. Drop the overhang toward 0 mm and the roof meets the wall; raise it and more shade shows
5. Reset restores the seeded leftover showing

## Data model

One section of a roof:

- `overhang` — millimetres of leftover eave past the wall (default 480)

Derived picture:

- leftover labelled as a sketch (flush / showing), not a roofing sign-off
- flush when overhang ≤ 40 mm

Nothing is persisted. Refresh restores the seeded scene.

## Architecture

- static HTML/CSS/JS
- no backend required for the prototype
- one SVG scene: wall plus roof line, leftover eave overhang and the shade it casts
- moving a control redraws the leftover immediately
- `?embed=1` hides catalogue chrome so the hub living well can iframe this page
- no network, no npm, no localStorage

## UX

- roof versus wall in section, not a spreadsheet, not a Gantt, not a night plan of rooms, not a cut-list stick, not a bag, not a crease diagram, not a claims beam, not a mixer, not a plumb bob, not a catenary, not a lamp, not a road crown, not a focus plane, not a partition, not a grain-angle dial, not a door, not talk columns, not gears, not a kerf gap, not a rode, not a vent, not wheels, not a chair, not a stair, not a pedal, not a ceiling, not a heading, not a glide, not a window frame, not a clock
- seeded demo already shows a visible leftover (not flush / not zero)
- live overhang, leftover labelled as a sketch (flush / showing)
- keyboard moves the focused control
- SVG text alternative names whether eave is showing
- reset returns the seed

## Deployment plan

- deploy as static files on Vercel
- keep each product in its own folder
- expose the product at `products/eave/`

## Verification

- page loads in a browser without build tooling
- one SVG scene (roof vs wall / leftover overhang) is in the DOM
- seeded leftover is visible (showing — not flush)
- changing a control redraws and updates the readout
- no paste-well hero, no standing figure vs ceiling, no sash vs frame, no door arc, no stair tread, no night plan, no clock face
