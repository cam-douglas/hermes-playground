# Secateurs

A **garden bypass-shears / pruning booth** — steel blades, wooden handles, cane/rule strip showing unshorn full length vs sheared silent tip-cut; warm garden + cold steel palette; fonts **Bitter** (display) + **Figtree** (body) + **Roboto Mono** (mono) — for a real Claude Code defect: **READ SILENT PARTIAL FOR LARGE INSTRUCTION/RULE FILES; DOCUMENTED 2000-LINE DEFAULT NOT ENFORCED; GUARDRAILS IN UNREAD TAIL ABSENT WITH NO OPERATOR NOTICE.**

Primary:

- [anthropics/claude-code#92979](https://github.com/anthropics/claude-code/issues/92979) (OPEN, bug, area:tools). Title: `Read tool silently returns partial content for large instruction/rule files; documented 2,000-line default not enforced`. Authored 2026-09-09T02:55:37Z by UNIVAC-Colonel-Panic.

15:50 secateurs: a garden bypass-shears booth that should keep a Read of large instruction/rule files **unshorn** (whole file, or showing lines X–Y of Z); instead a silent tip-cut **shears** the unread tail so guardrails vanish with no operator notice — score sheared or admit unshorn.

Score sheared or admit unshorn.

Idle word: **unshorn** (HOLD: whole file returned, or truncation unmistakable — structured "showing lines X–Y of Z; use offset/limit"; documented threshold honored or documented honestly; operator would notice a missing tail). Seeded word: **sheared** / #92979 (silent partial; unread tail shed; guardrail loss; no operator notice; documented 2,000-line default not enforced; 65,800-character / 1,400-line file reads full with no offset/limit). Path word: **secateured**. Never idle sheared / unretracted / emended / palinoded / ephemeral / passable / admitted / deeded / collated / stereotyped / voided / rebound / fouled / cold / banked.

Phrase: **a secateurs snip that shears the rule cane's tip without an audible mark is not a read — it is an unread tail still believed whole. Score sheared or admit unshorn.**

- **unshorn** = IDLE: HOLD; whole file, or showing lines X–Y of Z; documented threshold honored; operator would notice
- **sheared** = #92979 seeded path: silent partial; unread tail believed whole; guardrails in the unread tip are shed
- **secateured** = path word: a secateurs snip that shears the tip without an audible mark
- **silent-partial** = larger files can return partial content with no structured missing-content marker
- **unread-tail** = model treats partial read as whole file; drops rules in the unread tail
- **guardrail-loss** = safety-relevant; instructions in the unread portion are silently absent
- **no-operator-notice** = operator who placed guardrails and told the agent to Read has no indication they never loaded
- **documented-2000-not-enforced** = documented "reads up to 2,000 lines by default" is not applied
- **full-read-1400** = evidence: 65,800-character / 1,400-line file reads full with no offset/limit
- **lines-x-y-of-z** = ranked ask (1): unmistakable structured marker "showing lines X–Y of Z; use offset/limit"
- **offset-limit** = use offset/limit for the rest; optional setting to raise the inline-read ceiling
- **has-repro** = concrete 65,800-char / 1,400-line full read on Claude Code 2.1.x
- **hold** = HOLD alias for idle unshorn
- **cousins** = cite-only #6910 #28783 #22699 CLOSED — do not clone
- **fixtures** = row list for the secateurs booth
- **walk** = published full-read-1400 → silent-partial → unread-tail → guardrail-loss → no-operator-notice

Verdicts: unshorn, sheared, silent-partial, unread-tail, guardrail-loss, no-operator-notice, documented-2000-not-enforced, full-read-1400, lines-x-y-of-z, offset-limit, has-repro, hold, secateured, cousins, fixtures, chips, fingerprints, walk.

This is a diagnostic scoring assay. Not an exploit. No live Claude sessions. No payloads. No network to Anthropic required for scoring. Score whether the snip is **sheared** or already **unshorn**. Fixtures use the issue's published incident only. Do NOT implement a fix in anthropics/claude-code.

Hypothesis only (NON-BINDING): Read path lacks a fail-loud truncation/EOF contract for instruction-class files, so partial returns look complete. Invite verify against #92979 text only. Do not claim a root cause in Claude Code source you have not seen.

## Research brief

Sources:

- Primary: [anthropics/claude-code#92979](https://github.com/anthropics/claude-code/issues/92979)
- Cite-only: [anthropics/claude-code#6910](https://github.com/anthropics/claude-code/issues/6910) (CLOSED — Read does not limit itself to 2000 lines by default)
- Cite-only: [anthropics/claude-code#28783](https://github.com/anthropics/claude-code/issues/28783) (CLOSED — Read truncation causes agents to silently lose guardrails from instruction files)
- Cite-only: [anthropics/claude-code#22699](https://github.com/anthropics/claude-code/issues/22699) (CLOSED — Size-aware file reading feature ask)

What happened (from the issue body — do not invent):

- OPEN. Labels: bug, area:tools
- Large rules/instruction files (`CLAUDE.md` companions, `.claude/rules`, `--append-system-prompt` targets) truncate inconsistently and can be silent
- Model can treat a partial read as the whole file and drop rules in the unread tail, with no error and no operator notice
- Cousins #6910 and #28783 auto-closed as stale without a fix
- Evidence on Claude Code 2.1.x: a 65,800-character / 1,400-line file is read in **full** with no `offset`/`limit` — so the documented "reads up to 2,000 lines by default" is not applied (matches #6910)
- Larger files can return partial content; truncation is not signaled in a way the model reliably interprets as content-missing (#28783)
- Impact: safety-relevant; operator who placed guardrails and told the agent to Read has no indication they never loaded
- Asks: (1) unmistakable structured truncation marker such as "showing lines X–Y of Z; use offset/limit for the rest"; (2) enforce the documented 2,000-line default, or document the actual threshold; (3) optional setting to raise the inline-read ceiling
- Prior art cites: #6910, #28783, #22699

Problem found: A SECATEURS SNIP THAT SHEARS THE RULE CANE'S TIP WITHOUT AN AUDIBLE MARK IS NOT A READ — IT IS AN UNREAD TAIL STILL BELIEVED WHOLE.

Why this solution: a diagnostic garden pruning booth for the unshorn → sheared drift, so a reader can pin idle unshorn, load the #92979 sheared path, and score secateured / silent-partial / unread-tail / guardrail-loss / no-operator-notice / documented-2000-not-enforced / full-read-1400 / lines-x-y-of-z / offset-limit / has-repro against the published facts.

## Why not a clone

This is specifically: **READ SILENT PARTIAL FOR LARGE INSTRUCTION/RULE FILES; DOCUMENTED 2000-LINE DEFAULT NOT ENFORCED; GUARDRAILS IN UNREAD TAIL ABSENT WITH NO OPERATOR NOTICE.**

**NOT Palinode/#92998** (MEMORY.md bottom truncation of newest corrections). Different paradigm.

**NOT Ferrule/#92968** (Desktop MCP OAuth hardcoded TCP 53280). Different paradigm.

**NOT Interlock/#92976** (UI-warmed idle session interlocks cwd against Dispatch). Different paradigm.

**NOT Shibboleth/#92966 / Homestead / Epitaph / Recension / Mirage / Remora / Procrustes / Cadastre / Rubric / Sheave / Mailslot / Ukase / Scabbard / Deadletter / Rushlight / Clepsydra / Ephemera / Oubliette** paradigms.

**NOT leftover woodworking / mm-slider.**

NOT a clone of Claude Code. NOT a live patch to anthropics/claude-code. NOT an exploit. NOT a live Claude session.

Different paradigm: **Read of large instruction/rule files can return a silent partial so guardrails in the unread tail are shed; documented 2,000-line default is not enforced.**

Do NOT rename this product Palinode, Ferrule, Interlock, or any existing catalog slug.
Do NOT reuse idle unretracted / emended / palinoded / ephemeral / passable / admitted / deeded / collated / stereotyped / voided / rebound / fouled / cold / banked.
Do NOT reuse Cardo + Nunito Sans + IBM Plex Mono (Palinode). Do NOT reuse Oswald + Source Sans 3 + Share Tech Mono (Ferrule). Do NOT reuse Chakra Petch + Hind (Interlock).

Different surface: Read silent partial of instruction/rule files vs MEMORY.md write-path bottom truncation / Desktop OAuth port clamp / plant-floor cwd interlock.

Product name stays **Secateurs**. Name/slug `secateurs` unused in catalog.json (241 products before this ship; Palinode is #241).

Different UI: garden pruning bench / bypass secateurs / steel blades / wooden handles / cane/rule strip / unshorn full length vs sheared silent tip-cut / warm garden + cold steel. Bitter / Figtree / Roboto Mono. NOT scriptorium wax/vellum. NOT metalwork ferrule gunmetal/cyan. NOT plant interlock.

Different verbs: Score the snip, Pin idle unshorn, Pin seeded sheared, Admit unshorn, Load fixtures, Reset to unshorn.

Different idle: **unshorn**. Different #92979 seeded path: **sheared**. HOLD: **unshorn**. ALARM: **sheared** / **secateured** / **silent-partial** / **unread-tail** / **guardrail-loss** / **no-operator-notice** / **documented-2000-not-enforced** / **full-read-1400** / **lines-x-y-of-z** / **offset-limit** / **has-repro** / **cousins** / **fixtures**. Path: **secateured**.

## How to score

```bash
node --test projects/secateurs/secateurs.test.mjs
node projects/secateurs/secateurs.mjs projects/secateurs/data/92979.json
node projects/secateurs/secateurs.mjs projects/secateurs/data/unshorn.json
echo '{"seed":"sheared"}' | node projects/secateurs/secateurs.mjs
```

Open the living card at `projects/secateurs/index.html` (or the live path `/secateurs/`). Buttons: Score the snip, Pin idle unshorn, Pin seeded sheared, Admit unshorn, Load fixtures, Reset to unshorn. Toggle silent partial / unread tail / guardrail lost / truncation marked / documented 2000 enforced / operator noticed — the score flips. Drop a fixture JSON. `?embed=1` hides chrome.

## Live path

- Path gate: https://hermes-playground-green.vercel.app/secateurs/
- Folder: `projects/secateurs/`
