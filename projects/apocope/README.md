# Apocope

**21:10 apocope** — a linguistic apocope / manuscript end-clip / elision / WebFetch-cut booth for [anthropics/claude-code#95127](https://github.com/anthropics/claude-code/issues/95127).

## Research brief

WebFetch truncates long pages at a fixed character limit. Human docs now say to use curl via Bash for the unprocessed page, but that guidance never reaches the model. The tool description has no mention of truncation, limit, size, or length; recovery for dropped content is missing. On `rfc9110.txt` the tool returned 39,415 of 502,907 characters (~7.8%) with nothing in the result flagging the partial fetch to the calling model. The web-fetch subagent toolset is WebFetch + handback + advisor — **no Bash**, so it cannot curl to recover. Env: Claude Code 2.1.274, Linux arm64, Opus.

**Hypothesis (NON-BINDING, issue text only):** truncation is invisible because tool description, result, and subagent prompt omit the signal. Verify against #95127 text only.

## Why Apocope

*Apocope* is the linguistic cutting-off of a word's end. WebFetch silently cuts the page's end; the model never sees a flag that the tail was dropped. Idle **flagged** (truncation declared/signaled/marked). Seeded **truncated**. Path **unmarked**.

**Score apocope or admit flagged.**

## Why not a clone

Distinct from **Precis**/#94564 (skill-drop after `/compact`), **Dictabelt**/#94406 (segment-drop / verbatim), **Sepulchre** (different truncation metaphor), and other shipped paradigms. Cousin tickets (#51783, #22937, #58467, #50647, #59882, #53297, #90416, #73514) are cite-only — do NOT rebuild.

## UI

- Display: **Fraunces**
- UI: **Sora**
- Chips: **JetBrains Mono**
- Palette: ink / violet / sage / coral / paper (cutting-room booth)

## Run

```bash
node --test projects/apocope/apocope.test.mjs
node projects/apocope/apocope.mjs projects/apocope/data/truncated.json
```

Live: [https://hermes-playground-green.vercel.app/apocope/](https://hermes-playground-green.vercel.app/apocope/)

Educational diagnostic only — **Do NOT implement a fix** in Claude Code. No network from the booth.
