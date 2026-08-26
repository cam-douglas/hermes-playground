# Holiday

The coat is on, but a bare holiday still sits. Move the leftover holiday. See the residual missed bare patch still sitting after a brush coat.

This is not Stain. Stain is a wash of pigment in the face. This is not Burn. Burn is a heat scorch along a kerf. This is not Creep. Creep is a thin glue line along a closed seam. This is not a glaze. This is not a stub. This is not a clock. This is not finish advice. This is not a mill sign-off. Holiday answers “how much leftover holiday still sits after the brush.”

## Problem

The coat is on, but a bare holiday still sits:

- how much leftover sitting holiday still sits after the brush?
- is the leftover coated, or showing?
- when is the leftover holiday obvious — as a sketch, not a mill sign-off?

Existing tools in this catalogue measure leftover stub, leftover creep, leftover scuff, leftover dent, leftover gouge, leftover nick, leftover stain, leftover burn, leftover packed sky, leftover desk-keys, leftover desk-pins. They do not show leftover holiday — leftover missed bare patch still sitting after a brush coat, not Stain leftover wash, not Burn leftover scorch, not Creep leftover glue line, not a glaze.

## Users

- people who already know a brush coat can still leave one leftover holiday sitting in the coat as a missed bare patch
- anyone who refuses to treat a stain wash, a burn scorch, a glue creep line, a glaze, a packed sky, or a clock as this leftover
- desks that want holiday as a sketch, not a mill sign-off, and not finish advice
- teams that want a no-backend, local-only pass — not Stain, not Burn, not Creep, not a paste well

## Workflow

1. Load the seed: 5 mm of leftover holiday — already showing, not a coated-only face
2. Read the scene: one workpiece, one coat that stays on, a leftover whose leftover is one leftover missed bare patch still sitting after that brush, leftover labelled as a sketch
3. Move leftover holiday (or use the arrow keys on the focused slider); leftover names showing or coated
4. Drop the leftover toward 0 mm and the face looks coated / no leftover holiday; raise it and a wider leftover holiday still sits after a brush coat
5. Reset restores the seeded leftover showing

## Data model

One workpiece with leftover holiday as leftover missed bare patch that still sits after the brush:

- `holiday` — millimetres of leftover sitting holiday patch span after the brush (default 5)

Derived picture:

- leftover labelled as a sketch (coated / showing), not a mill sign-off
- leftover holiday labelled as a sketch
- coated / no leftover holiday when holiday ≤ 1 mm (integer slider means 0 or 1)

Nothing is persisted. Refresh restores the seeded scene. Empty state is named coated — not “holiday”.

## Architecture

- static HTML/CSS/JS
- no backend required for the prototype
- one SVG scene: one workpiece with a coat that stays on and one leftover missed bare patch holiday still sitting after that brush (not a stain wash, not a burn scorch, not a glue creep line, not a glaze)
- moving a control redraws the leftover immediately; the coat does not move
- `?embed=1` hides catalogue chrome so the hub living well can iframe this page
- no network, no npm, no localStorage

## UX

- leftover missed bare patch still sitting after a brush coat, not a stain wash as the hero, not a burn as the hero, not creep as the hero, not a glaze as the hero, not a clock
- seeded demo already shows a visible leftover (not a coated-only face)
- live leftover holiday, leftover labelled as a sketch (coated / showing)
- keyboard moves the focused control
- SVG text alternative names whether the holiday is showing
- reset returns the seed

## Deployment plan

- deploy as static files on Vercel
- keep each product in its own folder
- expose the product at `products/holiday/`

## Verification

- page loads in a browser without build tooling
- one SVG scene (one workpiece / leftover missed bare patch still sitting after a brush coat) is in the DOM
- seeded leftover is visible (showing — not coated)
- changing a control redraws and updates the readout; the coat stays fixed
- empty state is named coated — not “holiday”
- no paste-well hero, no stain as the hero, no burn as the hero, no creep as the hero, no glaze as the hero, no clock face
