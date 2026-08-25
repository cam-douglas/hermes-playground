# Shoulder

A joint looks flush until you see the shoulder. Move the bearing. See the leftover shoulder still sitting at the joint.

This is not Tenon. Tenon is leftover tongue that still projects from a mate. This is not Rabbet. Rabbet is leftover rebate shoulder that still sits along an edge. This is not Cheek. Cheek is leftover cheek that still sits on a tenon. This is not Housing. Housing is leftover shallow recess that still sits across a face. This is not Lap. Lap is leftover half-thickness overlap that still sits along a face. This is not Dutchman. Dutchman is leftover repair patch that still sits in a face. This is not a cut-list. This is not a paste well. This is not a clock. Shoulder answers “how much leftover bearing face still sits at the joint.”

## Problem

A joint looks flush until you see the shoulder:

- how much leftover bearing still sits where a tenon meets a rail?
- is the leftover flush, or showing?
- when is the leftover shoulder obvious — as a sketch, not a mill sign-off?

Existing tools in this catalogue measure leftover tongue on a mate, leftover rebate along an edge, leftover recess across a face, leftover overlap along a face, leftover repair patch in a face, leftover millimetres of stock, leftover paper creases, leftover packed sky, leftover desk-keys, leftover desk-pins. They do not show leftover shoulder — leftover bearing face still sitting where a tenon meets a rail, leftover shoulder still sitting at the joint, not Tenon leftover tongue on a mate, not Rabbet leftover shoulder along an edge.

## Users

- people who already know a joint can look flush until the leftover bearing face shows at the joint
- anyone who refuses to treat a tenon tongue, a rabbet edge, a housing recess, a dutchman patch, a packed sky, or a clock as this leftover
- desks that want shoulder as a sketch, not a mill sign-off
- teams that want a no-backend, local-only pass — not Tenon, not Rabbet, not Housing, not Dutchman, not a paste well

## Workflow

1. Load the seed: 9 mm of leftover shoulder — already showing, not a flush-only joint
2. Read the scene: one joint, a leftover whose leftover is the shoulder, leftover labelled as a sketch
3. Move leftover shoulder (or use the arrow keys on the focused slider); leftover names showing or flush
4. Drop the leftover toward 0 mm and the joint looks flush / no leftover shoulder; raise it and a taller leftover shoulder still sits at the joint
5. Reset restores the seeded leftover showing

## Data model

One joint with leftover shoulder as leftover bearing face that still sits where a tenon meets a rail:

- `shoulder` — millimetres of leftover bearing (default 9)

Derived picture:

- leftover labelled as a sketch (flush / showing), not a mill sign-off
- leftover bearing labelled as a sketch
- flush / no leftover shoulder when bearing ≤ 2 mm (the joint looks flush, no leftover shoulder)

Nothing is persisted. Refresh restores the seeded scene.

## Architecture

- static HTML/CSS/JS
- no backend required for the prototype
- one SVG scene: one joint — a leftover whose leftover is the shoulder; leftover is leftover bearing face still sitting where a tenon meets a rail (not a tenon tongue, not a rabbet edge, not a housing recess, not a dutchman patch)
- moving a control redraws the leftover immediately
- `?embed=1` hides catalogue chrome so the hub living well can iframe this page
- no network, no npm, no localStorage

## UX

- leftover bearing face still sitting at one joint, not a tenon tongue as the hero, not a rabbet edge as the hero, not a housing recess as the hero, not a dutchman patch as the hero, not a clock
- seeded demo already shows a visible leftover (not a flush-only joint)
- live leftover shoulder, leftover labelled as a sketch (flush / showing)
- keyboard moves the focused control
- SVG text alternative names whether the shoulder is showing
- reset returns the seed

## Deployment plan

- deploy as static files on Vercel
- keep each product in its own folder
- expose the product at `products/shoulder/`

## Verification

- page loads in a browser without build tooling
- one SVG scene (one joint / bearing / leftover shoulder) is in the DOM
- seeded leftover is visible (showing — not flush)
- changing a control redraws and updates the readout
- no paste-well hero, no tenon tongue as the hero, no rabbet edge as the hero, no housing recess as the hero, no dutchman patch as the hero, no clock face
