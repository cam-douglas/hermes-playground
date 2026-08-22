# Keystone

A vault looks closed until you see the keystone. Move the stone. See the leftover lock.

This is not Stagger. Stagger is leftover brick bond. This is not Batter. Batter is leftover retaining-wall slope. This is not a clock. Keystone answers “how far the stone still sits as leftover lock, leftover drop as seen in elevation.”

## Problem

A vault looks closed until you see the keystone:

- how far does the stone still sit as leftover lock?
- is the leftover seated, or showing?
- when is the leftover lock obvious — as a picture, not a masonry spec?

Existing tools in this catalogue measure leftover brick-course offset and leftover retaining-wall slope. They do not show leftover arch lock.

## Users

- people who already know a vault can look closed until the leftover keystone shows
- anyone who refuses to treat a brick bond, a retaining-wall slope, or a clock as this leftover
- desks that want keystone as a picture, not a masonry sign-off
- teams that want a no-backend, local-only pass — not Stagger, not Batter, not a paste well

## Workflow

1. Load the seed: 48 mm of leftover drop — already showing, not seated / not flush
2. Read the scene: one arch in elevation, keystone at the crown, leftover lock labelled as a sketch
3. Move keystone (or use the arrow keys on the focused slider); leftover names showing or seated
4. Drop the leftover toward 0 mm and the vault looks closed; raise it and the leftover lock shows
5. Reset restores the seeded leftover showing

## Data model

One arch in elevation with leftover lock at the crown:

- `keystone` — millimetres of leftover drop (default 48)

Derived picture:

- leftover labelled as a sketch (seated / showing), not a masonry sign-off
- leftover lock labelled as a sketch
- seated when keystone ≤ 6 mm

Nothing is persisted. Refresh restores the seeded scene.

## Architecture

- static HTML/CSS/JS
- no backend required for the prototype
- one SVG scene: an arch, two piers, leftover lock as the keystone
- moving a control redraws the leftover immediately
- `?embed=1` hides catalogue chrome so the hub living well can iframe this page
- no network, no npm, no localStorage

## UX

- one arch leftover lock in elevation, not a spreadsheet, not a Gantt, not a floor plan, not a cut-list stick, not a bag, not a crease diagram, not a claims beam, not a mixer, not a plumb bob, not a catenary, not a lamp, not a road crown, not a focus plane, not a partition, not a grain-angle dial, not a door, not talk columns, not gears, not a kerf gap, not a rode, not a vent, not wheels, not a chair, not a stair, not a pedal, not a ceiling, not a heading, not a glide, not a window frame, not a roof, not a rail, not a hull, not a retaining wall, not a brick course, not a wing, not a sea, not a lot line, not a crane, not a tree, not a scarf, not a hill, not a clock
- seeded demo already shows a visible leftover (not seated / not flush)
- live keystone, leftover labelled as a sketch (seated / showing)
- keyboard moves the focused control
- SVG text alternative names whether keystone is showing
- reset returns the seed

## Deployment plan

- deploy as static files on Vercel
- keep each product in its own folder
- expose the product at `products/keystone/`

## Verification

- page loads in a browser without build tooling
- one SVG scene (arch / leftover lock) is in the DOM
- seeded leftover is visible (showing — not seated)
- changing a control redraws and updates the readout
- no paste-well hero, no brick bond, no retaining-wall slope, no clock face
