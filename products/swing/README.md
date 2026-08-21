# Swing

A door looks free until you see the arc. Move the swing. See the leftover clearance.

This is not Sightline. Sightline is an eye line vs a partition. This is not Dark Floor. Dark Floor is rooms booked-empty. This is not Grain. Grain is a plank leftover. Swing answers “does this door’s arc clear the nearby cabinet, and by how many leftover millimetres.”

## Problem

A door looks free until you see the arc:

- where is the hinge?
- how far does the leaf swing?
- does the arc clear a nearby cabinet, or collide?
- how many leftover millimetres of clearance remain — as a sketch, not a joinery sign-off?

Existing tools in this catalogue block an eye line, book empty rooms, and mismatch a cut against grain. They do not show leftover clearance on one door’s swing.

## Users

- people who already know a door can look free and still hit the cabinet
- anyone who refuses to treat a partition, a night plan of rooms, or a plank as this leftover
- desks that want the leftover as a picture, not a joinery sign-off
- teams that want a no-backend, local-only pass — not a floor of rooms, not a plank, not a paste well

## Workflow

1. Load the seed: opening already a bit too wide at 112°, leaf 800 mm, leftover a collision
2. Read the plan: a wall, one hinge, one door, the swing arc, a nearby cabinet
3. Move the opening (or use the arrow keys on the focused slider); the leftover names clear / hits
4. Drift the door width if you want a wider leaf; it stays secondary
5. Reset restores the seeded overswing

## Data model

One door:

- `angle` — degrees of opening from closed along the wall (default 112)
- `width` — millimetres of leaf (default 800)

Derived picture:

- leftover = signed millimetres from the door leaf to the cabinet
- negative leftover is a collision
- named stop: hits (leftover &lt; 0), clear (leftover ≥ 0)
- labelled as a sketch, not a joinery sign-off

Nothing is persisted. Refresh restores the seeded scene.

## Architecture

- static HTML/CSS/JS
- no backend required for the prototype
- one SVG scene in plan: a door, a hinge, a wall, and the swing arc
- opening angle redraws the leaf and the arc immediately; door width is secondary
- `?embed=1` hides catalogue chrome so the hub living well can iframe this page
- no network, no npm, no localStorage

## UX

- one door’s arc, not a spreadsheet, not a Gantt, not a night plan of rooms, not a stock bar, not a bag, not a crease diagram, not a claims beam, not a mixer, not a plumb bob, not a catenary, not a lamp, not a road crown, not a focus plane, not a partition, not a plank, not a clock
- seeded demo already shows a swing that hits
- live leftover millimetres and a named stop
- keyboard moves the focused control
- SVG text alternative names clear vs hits
- reset returns the seed

## Deployment plan

- deploy as static files on Vercel
- keep each product in its own folder
- expose the product at `products/swing/`

## Verification

- page loads in a browser without build tooling
- one SVG scene (door, hinge, wall, arc) is in the DOM
- seeded swing hits (~112° on an 800 mm leaf; leftover negative)
- changing the angle clears or hits and updates the readout
- no paste-well hero, no night plan of rooms, no partition, no plank
