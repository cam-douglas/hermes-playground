# Sightline

A room looks open until you see the line. Move the partition. See the leftover block.

This is not Dark Floor. Dark Floor is rooms booked-empty. This is not Depth. Depth is which plane is sharp. This is not Plumb. Plumb is a bob vs a wall. This is not Camber. Camber is a road crown. Sightline answers “is the eye line clear, and how many millimetres sit in the way.”

## Problem

A room looks open until you see the line:

- how high is the partition?
- can two seated people still see each other?
- how many leftover millimetres of occlusion sit on the line?
- what happens if the pair stretches?

Existing tools in this catalogue book rooms, blur a plane, hang a bob, and crown a road. They do not show leftover occlusion on a sight line.

## Users

- people who already know a room can look open and still have a blocked line
- anyone who refuses to treat a paste of a floor plan as the product
- desks that want the leftover block as a picture, not a sign-off
- teams that want a no-backend, local-only pass — not rooms, not blur, not a road

## Workflow

1. Load the seed: partition already a bit too high at 1400 mm, seats 1.8 m apart
2. Read the elevation: two seats, one screen, a dashed eye line that is blocked
3. Move the partition (or use the arrow keys on the focused slider); the leftover clears or occludes
4. Stretch the seat distance; the pair moves apart without becoming a hanging cable
5. Reset restores the seeded block

## Data model

One elevation:

- `height` — millimetres of partition (default 1400)
- `span` — millimetres between seats (default 1800)

Derived picture:

- seated eye line at 1100 mm
- leftover occlusion = max(0, height − 1100)
- the leftover is whether the line is clear or blocked
- drawing scale 1:5, labelled as a sketch, not a sign-off

Nothing is persisted. Refresh restores the seeded scene.

## Architecture

- static HTML/CSS/JS
- no backend required for the prototype
- one SVG elevation: two seats and a partition
- height clears or occludes the line; span stretches the pair
- no network, no npm, no localStorage

## UX

- one elevation, not a spreadsheet, not a Gantt, not a floor plan, not a stock bar, not a bag, not a crease diagram, not a claims beam, not a mixer, not a plumb bob, not a catenary, not a lamp, not a road, not a focus plane, not a clock
- seeded demo already shows a blocked line
- live clear / blocked and leftover millimetres
- keyboard moves the focused control
- SVG text alternative names clear vs blocked
- reset returns the seed

## Deployment plan

- deploy as static files on Vercel
- keep each product in its own folder
- expose the product at `products/sightline/`

## Verification

- page loads in a browser without build tooling
- one SVG elevation (two seats, a partition, a dashed line) is in the DOM
- seeded partition is too high (~1400 mm); the line is blocked
- changing height clears or blocks the line
- changing span stretches the pair
- no paste-well hero, no room occupancy plan, no focus blur, no road crown
