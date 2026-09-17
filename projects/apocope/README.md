# Precis

A **precis / abstract / abridgement / skill-graft booth** — after manual `/compact`, invoked skill content should reknit (re-attach) per docs; instead only the compaction summary **paraphrase** survives and the skill body drops. Fonts **Cormorant Garamond** (display) + **Plus Jakarta Sans** (UI) + **IBM Plex Mono** (chips). Palette: ink `#1a1d24`, abstract violet `#5c4d7d`, margin sage `#4a6b5a`, highlight coral `#c45c4a`, paper `#f4f0e8`, weave `#2d3142`. NOT Detent's ratchet atelier. NOT Dictabelt wax-belt dictation. NOT a parchment scrape or cancelled-leaf print shop.

The booth should stay **reknit** (HOLD: skill grafted after compact). Instead the booth is **paraphrase** after **skill-drop**.

Primary:

- [anthropics/claude-code#94564](https://github.com/anthropics/claude-code/issues/94564) (OPEN). Title: `Invoked skill not re-attached after manual /compact; only the summary's paraphrase survives`. Environment: Claude Code 2.1.270, macOS; project skill ~5279 bytes invoked as slash command; manual `/compact`; preTokens ~213828 → postTokens ~8106.

21:10 precis: a precis / abstract / abridgement / skill-graft booth for #94564 (catalog #389). After manual /compact, invoked skill content is not re-attached — only the compaction summary paraphrase survives (and can blur critical detail). Idle **reknit** / seeded **paraphrase** / path **skill-drop**. Score precis or admit reknit.

Score precis or admit reknit.

Idle word: **reknit** (HOLD: skill re-attached after compact). HOLD aliases: grafted-skill, carried, attached. Seeded word: **paraphrase**. Path word: **skill-drop**. Product score: **precis**. NOT intact (Rasure/Cancellans/Rescript). NOT verbatim (Dictabelt/Mojibake).

Phrase: **Score precis or admit reknit.**

- **reknit** = IDLE HOLD: invoked_skills / skill body returns after compact
- **paraphrase** = seeded path: only summary paraphrase survives
- **skill-drop** = path word: skill body missing after manual /compact
- **grafted-skill**, **carried**, **attached** = HOLD aliases
- Chip verdicts: invoked-skills, compact-manual, summary-only, token-budget, skill-body, docs-reattach, invoked-block, landing, has-repro, cousins, backups, fixtures, walk, closed

This is a diagnostic scoring booth. Not an exploit. No Claude sessions. No network to Anthropic required for scoring. Do NOT implement a fix in anthropics/claude-code.

Hypothesis only (NON-BINDING — issue text): post-compact skill re-attach path may have failed; paraphrase-only survival. Invite verify against #94564 text only.

## Research brief

Source: [anthropics/claude-code#94564](https://github.com/anthropics/claude-code/issues/94564)

What happened (from issue text):

- Skills docs: compaction should re-attach the most recent invocation of each skill after the summary (first 5k tokens each, 25k combined).
- After manual `/compact`, no `invoked_skills` block / skill content survives — only the compaction summary paraphrase.
- Paraphrase lost detail: "a background subagent" → "background subagents"; model spawned a new subagent for every write.
- Claude Code 2.1.270, macOS, project skill ~5279 bytes as slash command; preTokens ~213828 → postTokens ~8106.

## Why not a clone

Distinct from Dictabelt (segment-drop voice), Mojibake (fffd-spall), Rasure/Cancellans/Rescript (intact), Detent (mouse-dead hit-test). This is **skill-drop after compact**: idle reknit / seeded paraphrase / path skill-drop. Do NOT rebuild Detent or Dictabelt paradigms here; do not conflate verbatim or intact idle words.

NOT Prosopon. NOT Slipway. NOT Cathead. NOT #94575.

Backups (cite only): #94565, #94553, #94560, #94151 — do not auto-pick.

## Run

```bash
node --test projects/precis/precis.test.mjs
node projects/precis/precis.mjs projects/precis/data/paraphrase.json
```

Live: https://hermes-playground-green.vercel.app/precis/
