# Skill Clash

A local-first collision board for stacked agent skills — paste `SKILL.md` / `AGENTS.md` fragments and see which MUST/NEVER rules, domains, and injection-shaped lines short each other out.

## Problem

People now stack 10–40 agent skills. The packs look complementary until they run: YAGNI deletes the test file that “always write tests” just demanded; “never touch auth” sits next to “patch auth in the same session”; a helpful-looking reviewer says ignore previous instructions. Existing skill repos teach you how to write a pack. They do not show what happens when packs share one agent.

- which MUST line is cancelled by another pack’s NEVER?
- which skills claim the same domain and will talk over each other?
- which pasted rule is shaped like a prompt injection?
- does the stack get more coherent when you disable one pack?

## Users

- engineers assembling a personal agent skill stack
- teams reviewing a shared `AGENTS.md` after a pack dump
- anyone who inherited five “must follow this skill” files
- reviewers who want a local, no-backend collision pass before merge

## Workflow

1. Load the seed stack (YAGNI vs tests, sealed auth vs hotfix auth)
2. Apply demo fixtures to add the injection-shaped “Helpful Reviewer”
3. Read the red MUST/NEVER shorts, amber domain overlaps, and ice injection hits
4. Disable or remove a pack and watch the stack-coherence score move
5. Paste another skill (name + rules text) to grow the stack
6. Export or import JSON; reset restores the seed

## Data model

Each skill tracks:

- `id`
- `name`
- `body` — free-text rules (`MUST` / `NEVER` / `ALWAYS` / `DO NOT`)
- `enabled`

Persisted locally:

- `skills` — the current stack
- `selected` — last inspected skill id

Derived values:

- parsed MUST / NEVER directives per skill
- `MUST vs NEVER` clash when opposite-polarity lines share a domain or enough tokens
- overlapping domains (`tests`, `auth`, `yagni`, `skills`, `docs`, `git`)
- injection-shaped lines (`ignore previous instructions`, `you are now`, dump-secrets, grant-write, and kin)
- `stack-coherence score` — 100 minus clash / overlap / injection penalties

## Architecture

- static HTML/CSS/JS
- no backend required for the prototype
- `localStorage` persistence for the stack
- JSON export / import for a portable copy
- deterministic clash, overlap, and coherence scoring

## UX

- fuse-box collision board (ember vs ice, not a catalogue reskin)
- stack-coherence meter that moves when a skill is added, removed, or disabled
- armed-pack list with inspect / disable / remove
- paste-a-skill form
- collision rail: red shorts, amber overlaps, ice injection hits
- demo fixtures and one-click seed reset

## Deployment plan

- deploy as static files on Vercel
- keep each product in its own folder
- expose the product at `products/skill-clash/`

## Verification

- page loads in a browser without build tooling
- demo fixtures produce at least one red MUST/NEVER clash (YAGNI × Test Always, Sealed Auth × Hotfix Auth)
- adding or removing a skill moves the stack-coherence score
- refresh keeps the stack
- export / import round-trips the same state
- reset restores the five-skill seed
