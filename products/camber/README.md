# Camber

A road looks flat until you see the crown. Move camber. See the rise.

This is not Wire Sag. Wire Sag is a hanging cable dip. This is not Plumb. Plumb is a hanging bob vs a wall. This is not Offcut. Offcut is leftover millimetres on a stick. This is not Kelvin. Kelvin is a lamp. Camber answers “how much does this pavement rise in the middle.”

## Problem

A road looks flat until you see the crown:

- how wide is the lane?
- how much does the pavement rise at midspan?
- what leftover camber sits in the crown?
- what happens if the section stretches?

Existing tools in this catalogue hang a cable, hang a bob, leftover millimetres on a stick, and wash a lamp. They do not show the rise of a crowned road.

## Users

- people who already know a road can look flat and still have a crown
- anyone who refuses to treat a paste of a survey as the product
- desks that want the leftover rise as a picture, not a scorecard
- teams that want a no-backend, local-only pass — not a sag, not a plumb, not leftover millimetres on a stick, not a lamp

## Workflow

1. Load the seed: 7 m lane, already a bit too much crown at 80 mm
2. Read the section: two curbs, one crowned pavement, a noticeable rise at midspan
3. Move the camber (or use the arrow keys on the focused slider); the crown redraws
4. Stretch the lane width; the curbs move apart
5. Reset restores the seeded rise

## Data model

One section:

- `width` — metres curb to curb (default 7)
- `camber` — millimetres of rise at midspan (default 80)

Derived picture:

- a parabola for the pavement crown (not a hanging catenary)
- sketch fall = rise / half-width, also as 1:N, labelled as a sketch, not a sign-off
- the leftover is the rise in the middle

Nothing is persisted. Refresh restores the seeded section.

## Architecture

- static HTML/CSS/JS
- no backend required for the prototype
- one SVG: two curbs and a crowned pavement
- camber redraws the crown; width stretches the section
- no network, no npm, no localStorage

## UX

- one road section, not a spreadsheet, not a Gantt, not a floor plan, not a stock bar, not a bag, not a crease diagram, not a claims beam, not a mixer, not a plumb bob, not a catenary, not a lamp, not a clock
- seeded demo already shows a visible crown
- live crown millimetres and sketch fall
- keyboard moves the focused control
- SVG text alternative names the crown
- reset returns the seed

## Deployment plan

- deploy as static files on Vercel
- keep each product in its own folder
- expose the product at `products/camber/`

## Verification

- page loads in a browser without build tooling
- one SVG road section (two curbs, crowned pavement) is in the DOM
- seeded crown is visible (~80 mm on 7 m)
- changing camber redraws the crown
- changing width stretches the section
- no paste-well hero, no hanging cable, no plumb bob, no stock bar, no lamp
