# Ullage

Cooper's bonded-cellar gauging desk for a real Claude Code failure class: the conversation context silently loses a large block of tokens with **no compaction record, no context-editing record, and no error**, then the prompt cache thrashes — `cache_read_input_tokens` freezes at the system-prompt prefix while every later breakpoint misses, so each trivial turn re-writes hundreds of thousands of tokens.

Ullage is the empty space in a cask. If the level drops and no pour was chalked, the cellar has a leak. If the bung weeps on every turn after that, the cache is thrashing. The desk **gauges** the cask: recorded vs actual, bung hold vs weep. It does not claim the cache-key root cause.

Idle word: **gauged** (a cask that is full and accounted for).
NEVER use the product name ullage / empty / compact / cache / leak as the idle/state word.
NEVER reuse prior idles: stamped, overrun, pratique, bound, stilled, drained, flat, fit, spoilt, laid, unlinked, tight, banked, roosted, stocked, seated, heard, clear, paired, kernel, latched, upheld, sterling, home, valid, dry, sealed, quiet, seised, stabled, wound.

Verdicts: **gauged**, **ullaged**, **thrashed**, **frozen**, **leaked**, **rewritten**, **doubled**, **healed**, **silent**, **bunged**. Slack thrash alarm on thrashed / frozen / ullaged / leaked / silent. Linear waste ticket when wasted weighted tokens exceed 1,000,000. GitHub ullage-ledger of cellar events on every scored cask.

Weighted waste (as used in #90509): `input×1 + cache_read×0.1 + cache_creation×2 + output×5`. Deduplicate assistant usage rows by `message.id` / `requestId` first so the waste number is honest.

## Why not a clone

NOT Fathom (standing *rules* dropped *after* a recorded compaction).
NOT Quench (runaway *subagent spawn* token-burn circuit breaker / kill switch).
NOT Coda (silently dropped *assistant text blocks*).
NOT Visa (MCP OAuth missing RFC 8707 resource).
NOT Sprag (boot-cached MCP failure / no retry).
NOT Lazaret, Fusee, Iota, Leat, Shunt, Sump, or any other catalog desk.
NOT any leftover woodworking / millimetre-slider product.
Do NOT ship Cask, Cellar, Bung, Gauge, Compact, or Cache as alternate product names this hour. Product name is **Ullage** only.

Different problem: a **partial context drop with no ticket** (not a compact), plus a **prefix-frozen cache thrash** after that drop. Also flags **double-logged usage** so the waste number is honest.
Different UI: cooper's bonded cellar at night. Standing oak cask in cross-section, iron hoops, bung, gauging rod / dipstick. Cellar oak, iron, candle amber, wine-dark liquid, chalk white. Fonts: Fraunces + Barlow Condensed — not Libre Baskerville / Source Sans 3 (Visa), not Teko/Atkinson (Sprag), not Bodoni (Fusee).
Different idle word: **gauged**.

## Live catalog path

`/ullage/` is this static cooper's gauging desk. Oak cask, iron hoops, bung seal, chalk slate, candle. Demo works with no secrets and no npm. Mark: `14:50 Sydney · ullage`.

1. Seeded `#90509` **ullaged** is already on the slate: 829,414 → 672,391 with no compact ticket → **ullaged**.
2. Switch **#90509 full** — drop, 21 prefix-frozen rewrites (`cache_read=45659`), then self-heal → **healed**.
3. Switch **thrashed** — cluster still weeping → **thrashed**.
4. Switch **frozen** — cache_read pinned, not yet a cluster → **frozen**.
5. Switch **rewritten** — recorded compact, one rebuild, recovery → **rewritten** (not ullaged).
6. Switch **doubled** — JSONL usage duplicated on message.id → **doubled**.
7. Switch **silent** — drop with empty error / compaction / context-edit records → **silent**.
8. Switch **leaked** — drop plus a slate missing this ticket → **leaked**.
9. Switch **bunged** — bung reseated, cache_read recovered → **bunged**.
10. Switch **control** — concurrent session that never failed → **gauged**.
11. Switch **Reset · gauged** — cask full and accounted for → **gauged**. Idle word is **gauged** when the cellar is idle.
12. **Score** scores. **Admit gauged** scores honestly. **Reset · gauged** returns idle gauged. **Restore · ullaged** shows the #90509 drop. Admit does not lie: an ullaged cask stays ullaged.

## Hook

`projects/ullage/hook/` scores a cask `{ turns[], tickets[], errors[], session, source, issue, scored }` and returns `{ verdict, reasons[], cluster[], gauged, ullaged, thrashed, waste }`. See `hook/README.md`.

```bash
node projects/ullage/hook/index.mjs --listen 9090
node --test projects/ullage/hook/ullage.test.mjs
```

## Evidence (do not invent more)

Primary:

- [anthropics/claude-code#90509](https://github.com/anthropics/claude-code/issues/90509) — filed 2026-08-29, has repro. Context silently loses 157,023 tokens (829,414 → 672,391) at 06:17:43 with no compactMetadata nearby. The session's only two real auto-compactions dropped to ~10–12K, days apart, and recovered cleanly. Then 21 full-context rewrites in 17 minutes; on every failed turn `cache_read` was **exactly 45,659** (system-prompt prefix only) while `cache_creation` was ~628K. Work during the window was trivial Read/Bash (~680 output tokens/turn). Wasted ~25M weighted tokens (~36% of a 5-hour usage window). Concurrent control session on the same machine/account/model never failed. Secondary: transcript double-logging (same message.id / requestId written 2–3 times) inflates naive local usage audits ~2.12×.

Shape (cite as shape, not a new primary):

- [anthropics/claude-code#87966](https://github.com/anthropics/claude-code/issues/87966) — cache_read pinned to stable-prefix boundary, 89 full-context rewrites across 9 days, ~59M excess cache_creation; also notes JSONL usage duplication.
- [anthropics/claude-code#89621](https://github.com/anthropics/claude-code/issues/89621) — cache misses beyond ~16K prefix in long-running subagent, ~550K cache_creation every request.
- [anthropics/claude-code#87215](https://github.com/anthropics/claude-code/issues/87215) — waking a parked subagent re-caches entire context; only system prefix served from cache.
- [anthropics/claude-code#90144](https://github.com/anthropics/claude-code/issues/90144) — opening a session with a large slash command discards the entire prompt cache on the second request.
- [anthropics/claude-code#83913](https://github.com/anthropics/claude-code/issues/83913) — prompt cache invalidated when PreToolUse/PostToolUse additionalContext changes during history rebuild.
