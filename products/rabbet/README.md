# Rabbet

A board looks square until you see the rabbet. Move the rebate. See the leftover shoulder.

This is not Kerf. Kerf is a blade gap. This is not Grain. Grain is cut versus grain. This is not Scarf. Scarf is leftover timber overlap. This is not Offcut. Offcut is leftover millimetres of stock. This is not a clock. Rabbet answers “how far the rebate still shoulders, leftover rebate as seen in a board section.”

## Problem

A board looks square until you see the rabbet:

- how far does the rebate still shoulder?
- is the leftover square, or showing?
- when is the leftover rebate obvious — as a picture, not a joinery spec?

Existing tools in this catalogue measure leftover blade gap, leftover cut-versus-grain mismatch, leftover timber overlap, and leftover millimetres of stock. They do not show leftover rebate shoulder in a board section.

## Users

- people who already know a board can look square until the leftover rabbet shows
- anyone who refuses to treat a kerf, a grain cut, a scarf, leftover stock, or a clock as this leftover
- desks that want rabbet as a picture, not a joinery sign-off
- teams that want a no-backend, local-only pass — not Kerf, not Grain, not Scarf, not Offcut, not a paste well

## Workflow

1. Load the seed: 18 mm of leftover rebate — already showing, not square / not flush
2. Read the scene: one board in section, leftover rabbet labelled as a sketch
3. Move rabbet (or use the arrow keys on the focused slider); leftover names showing or square
4. Drop the leftover toward 0 mm and the board looks square; raise it and the leftover shoulder shows
5. Reset restores the seeded leftover showing

## Data model

One board in section with leftover rabbet as leftover rebate shoulder:

- `rabbet` — millimetres of leftover rebate / shoulder (default 18)

Derived picture:

- leftover labelled as a sketch (square / showing), not a joinery sign-off
- leftover rabbet labelled as a sketch
- square when rabbet ≤ 2 mm

Nothing is persisted. Refresh restores the seeded scene.

## Architecture

- static HTML/CSS/JS
- no backend required for the prototype
- one SVG scene: a board in section, leftover rabbet as leftover rebate shoulder
- moving a control redraws the leftover immediately
- `?embed=1` hides catalogue chrome so the hub living well can iframe this page
- no network, no npm, no localStorage

## UX

- one board leftover rabbet in section, not a spreadsheet, not a Gantt, not a floor plan, not a cut-list stick, not a bag, not a crease diagram, not a claims beam, not a mixer, not a plumb bob, not a catenary, not a lamp, not a road crown, not a focus plane, not a partition, not a grain-angle dial, not a door swing, not talk columns, not gears, not a kerf gap, not a rode, not a vent plume, not wheels, not a chair, not a stair, not a pedal, not a ceiling, not a heading, not a glide, not a window sash, not a roof, not a rail, not a list, not a retaining wall, not a brick course, not a wing, not a fetch, not a lot line, not a crane, not a tree, not a scarf, not a hill, not an arch, not a plinth, not a lintel, not a freeboard, not a flue, not a clock
- seeded demo already shows a visible leftover (not square / not flush)
- live rabbet, leftover labelled as a sketch (square / showing)
- keyboard moves the focused control
- SVG text alternative names whether rabbet is showing
- reset returns the seed

## Deployment plan

- deploy as static files on Vercel
- keep each product in its own folder
- expose the product at `products/rabbet/`

## Verification

- page loads in a browser without build tooling
- one SVG scene (board section / leftover rabbet as leftover rebate shoulder) is in the DOM
- seeded leftover is visible (showing — not square)
- changing a control redraws and updates the readout
- no paste-well hero, no blade gap, no grain cut, no scarf overlap, no leftover stock bar, no clock face
