# Plug

A hole looks open until you see the plug. Move the filler. See the leftover plug still sitting in the hole.

This is not Dowel. Dowel is leftover pin that still sits through a joint. This is not Knot. Knot is leftover dark that still sits in the figure. This is not Dutchman. Dutchman is leftover repair patch that still sits in a face. This is not Drawbore. Drawbore is leftover offset that still sits through a joint. This is not Peg. Peg is leftover pin. This is not Pecky. Pecky is leftover cavity that still sits in the face. This is not a cut-list. This is not a paste well. This is not a clock. Plug answers “how much leftover filler still sits in the drilled hole.”

## Problem

A hole looks open until you see the plug:

- how much leftover filler still sits in the drilled hole?
- is the leftover open, or showing?
- when is the leftover plug obvious — as a sketch, not a mill sign-off?

Existing tools in this catalogue measure leftover pin through a joint, leftover dark in the figure, leftover repair patch in a face, leftover offset through a joint, leftover cavity, leftover millimetres of stock, leftover paper creases, leftover packed sky, leftover desk-keys, leftover desk-pins. They do not show leftover plug — leftover filler still sitting in a drilled hole, leftover plug still sitting in the hole, not Dowel leftover pin through a joint, not Dutchman leftover patch in a face.

## Users

- people who already know a hole can look open until the leftover filler shows in the hole
- anyone who refuses to treat a dowel pin, a dutchman patch, a knot dark, a pecky cavity, a packed sky, or a clock as this leftover
- desks that want plug as a sketch, not a mill sign-off
- teams that want a no-backend, local-only pass — not Dowel, not Dutchman, not Knot, not Pecky, not a paste well

## Workflow

1. Load the seed: 8 mm of leftover plug — already showing, not an open-only hole
2. Read the scene: one board/hole, a leftover whose leftover is the plug, leftover labelled as a sketch
3. Move leftover plug (or use the arrow keys on the focused slider); leftover names showing or open
4. Drop the leftover toward 0 mm and the hole looks open / no leftover plug; raise it and a thicker leftover plug still sits in the hole
5. Reset restores the seeded leftover showing

## Data model

One board/hole with leftover plug as leftover filler that still sits in the drilled hole:

- `plug` — millimetres of leftover filler (default 8)

Derived picture:

- leftover labelled as a sketch (open / showing), not a mill sign-off
- leftover filler labelled as a sketch
- open / no leftover plug when filler ≤ 2 mm (the hole looks open, no leftover plug)

Nothing is persisted. Refresh restores the seeded scene.

## Architecture

- static HTML/CSS/JS
- no backend required for the prototype
- one SVG scene: one board/hole — a leftover whose leftover is the plug; leftover is leftover filler still sitting in a drilled hole (not a dowel pin, not a dutchman patch, not a knot dark, not a pecky cavity)
- moving a control redraws the leftover immediately
- `?embed=1` hides catalogue chrome so the hub living well can iframe this page
- no network, no npm, no localStorage

## UX

- leftover filler still sitting in a drilled hole of one board, not a dowel pin as the hero, not a dutchman patch as the hero, not a knot dark as the hero, not a pecky cavity as the hero, not a clock
- seeded demo already shows a visible leftover (not an open-only hole)
- live leftover plug, leftover labelled as a sketch (open / showing)
- keyboard moves the focused control
- SVG text alternative names whether the plug is showing
- reset returns the seed

## Deployment plan

- deploy as static files on Vercel
- keep each product in its own folder
- expose the product at `products/plug/`

## Verification

- page loads in a browser without build tooling
- one SVG scene (one board / hole / leftover plug) is in the DOM
- seeded leftover is visible (showing — not open)
- changing a control redraws and updates the readout
- no paste-well hero, no dowel pin as the hero, no dutchman patch as the hero, no knot dark as the hero, no pecky cavity as the hero, no clock face
