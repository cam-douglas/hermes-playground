# Depth

A picture looks sharp until you see the plane. Move focus. See the leftover blur.

This is not Kelvin. Kelvin is a lamp’s temperature. This is not Clause Lens. Clause Lens is a legal-text loupe. This is not Camber. Camber is a road crown. This is not Dark Floor. Dark Floor is rooms. This is not Mix Bus. Mix Bus is loudness. Depth answers “which plane is sharp, and what leftover blur sits on the other.”

## Problem

A picture looks sharp until you see the plane:

- how far is the focus?
- which plane is sharp — the cup, or the window?
- what leftover blur sits on the other plane?
- what happens if the leftover thickens?

Existing tools in this catalogue wash a lamp, loupe a clause, and crown a road. They do not show the leftover blur of a focus plane.

## Users

- people who already know a picture can look sharp and still have a soft plane
- anyone who refuses to treat a paste of EXIF as the product
- desks that want the leftover blur as a picture, not a camera sign-off
- teams that want a no-backend, local-only pass — not a lamp, not a clause, not a road

## Workflow

1. Load the seed: focus already a bit too near at 0.8 m, leftover blur at 5
2. Read the scene: a cup on a table in front of a window; the window is visibly soft
3. Move the focus (or use the arrow keys on the focused slider); the sharp plane shifts
4. Thicken or thin the leftover-blur sketch; out-of-focus gets softer or closer to sharp
5. Reset restores the seeded near focus

## Data model

One scene:

- `focus` — metres, near to far (default 0.8)
- `leftover` — leftover-blur sketch amount (default 5)

Derived picture:

- near plane at 0.6 m (the cup)
- far plane at 6 m (the window)
- named stop: near / mid / far
- leftover blur on a plane = |distance − focus| × leftover × a sketch scale
- the leftover is which plane is soft

Nothing is persisted. Refresh restores the seeded scene.

## Architecture

- static HTML/CSS/JS
- no backend required for the prototype
- one SVG: a near cup and a far window
- focus shifts which plane is sharp; leftover blur is SVG Gaussian blur
- no network, no npm, no localStorage

## UX

- one scene, not a spreadsheet, not a Gantt, not a floor plan, not a stock bar, not a bag, not a crease diagram, not a claims beam, not a mixer, not a plumb bob, not a catenary, not a lamp, not a road, not a clock, not a clause loupe
- seeded demo already shows a soft far plane
- live focus distance and named stop
- keyboard moves the focused control
- SVG text alternative names the focus plane
- reset returns the seed

## Deployment plan

- deploy as static files on Vercel
- keep each product in its own folder
- expose the product at `products/depth/`

## Verification

- page loads in a browser without build tooling
- one SVG scene (near cup, far window) is in the DOM
- seeded focus is near (~0.8 m); far plane is soft
- changing focus shifts which plane is sharp
- leftover-blur sketch thickens the soft plane
- no paste-well hero, no lamp temperature, no road crown, no clause loupe
