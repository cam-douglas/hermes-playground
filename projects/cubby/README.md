# Cubby

School/office mailroom cubby wall for a real Claude Code failure: **auto-memory silently resolves to the wrong ancestor-encoded project cache directory**, so a real user-authored safety rule in the repo's authoritative `memory/` never reaches the session. Recurrence of closed #52772/#53734 with fresh harm (#90604): session cwd was `/home/user/source/soft-shop` (git root with populated `memory/`), but `# auto memory` was injected from `~/.claude/projects/-home-user/memory/` (ancestor `/home/user`). Neither local cache matched the repo's authoritative memory (hundreds of files missing). A "never git push origin main without go-ahead" rule was invisible; the session pushed to main three times. Chosen cache path is never surfaced in the system prompt/transcript, so the mismatch is undetectable without a manual directory diff.

Primary: [anthropics/claude-code#90604](https://github.com/anthropics/claude-code/issues/90604) (open, filed 2026-08-29, platform:linux, area:core, memory). Auto-memory cache path silently stale/wrong-directory; real safety rule missed. Recurrence of #52772/#53734.

A stuffed cubby is not a hold. Score the wall or admit **stowed**.

Idle word: **stowed** (correct cwd/git-root cache used; authoritative memory mirrored; safety rules visible; cache path would be detectable).
NEVER use the product name cubby / empty / silent / mute / idle / dead as the idle/state word.
NEVER reuse prior idles: posted, bunged, belayed, rove, keyed, housed, beamed, snug, hung, appointed, cinched, gauged, stamped, overrun, pratique, wound, bound, stilled, stabled, drained, flat, fit, spoilt, laid, unlinked, tight, banked, roosted, stocked, seated, heard, clear, paired, kernel, latched, upheld, sterling, home, valid, dry, sealed, quiet, seised, rung, moored.

Verdicts: **stowed**, **misfiled**, **ancestor**, **stale**, **invisible**, **walked-up**, **unsurfaced**, **ghosted**, **mirrored-fail**, **restored**. Slack alarm on misfiled / ancestor / stale / invisible / walked-up / ghosted / mirrored-fail. Linear ticket on invisible / ancestor / walked-up / ghosted. GitHub cubby-ledger of scored probes on every score.

The #90604 invisible wall (ancestor-encoded cache, safety rule only in authoritative memory, hundreds of files missing, cache path unsurfaced) is **invisible**, never **stowed**. Unique nearby flags win their own seeds because those seeds do not carry the invisible pentad.

## Why not a clone

NOT **Ullage** — silent 157K context drop then prefix-frozen cache thrash. Cubby is wrong *directory* for auto-memory injection, not context compaction.
NOT **Iota** — path-key casing / type-case identity. Cubby is ancestor-walk / hash mismatch for memory cache, not case folding.
NOT **Fob** — Keychain credential litter.
NOT **Cinch** — silent partial folder mounts on scheduled Cowork.
NOT **Wicket** — worktree isolation gatehouse.
NOT **Grille** — Bash-steered edits under bypass-permissions.
NOT **Spile** — hook stdin wedge / unenforced timeout.
NOT **Bollard** — RC env orphan after supervisor gap.
NOT **Clew** — sandbox deny-list E2BIG.
NOT **Hasp** — file-path lease races.
Do NOT ship alternate names Sorter, Fiche, Carrel, Niche, Locker, Pigeon, Tray, Cabinet, Folio, Docket, Alcove, Stack, Binder, Press, Rolodex, Cardex, Misfile, Shelf, Pigeonhole. Product name is **Cubby** only.

Different problem: AUTO-MEMORY RESOLVES TO ANCESTOR/WRONG-HASH CACHE → SAFETY RULES IN AUTHORITATIVE MEMORY NEVER REACH THE SESSION.
Different UI: school/office **mailroom cubby wall** — warm oak cubbies with brass nameplates, wrong ancestor cubby lit amber, correct project cubby empty of the safety-rule envelope, directory-diff lamp, mirror-fail stamp. Warm oak / brass / cream / amber / soft charcoal. NOT a bank teller grille, NOT a cellar bung, NOT a wet pier, NOT a sail loft, NOT a gauging desk, NOT a type-case, NOT a hotel key-rack, NOT a cinch desk.
Different idle word: **stowed**.

## Live catalog path

`/cubby/` is this static mailroom cubby wall. Warm oak cubbies, brass nameplates, ancestor cubby lit amber, project cubby empty of the safety envelope, directory-diff lamp, mirror-fail stamp. Demo works with no secrets and no npm. Mark: `02:50 Sydney · cubby`.

1. Seeded `#90604` **invisible** is already on the desk: ancestor cache lit, correct cubby empty of the safety-rule envelope → **invisible** / **ancestor**. Never stowed.
2. Switch **misfiled** — injected auto-memory came from a different project-hash folder than the session cwd/git-root encodes.
3. Switch **ancestor** — resolver walked up to an ancestor-encoded project directory.
4. Switch **stale** — chosen local cache significantly behind authoritative repo memory/ (files missing).
5. Switch **invisible** — a concrete safety rule present only in authoritative memory was missing from the injected cache.
6. Switch **walked-up** — CWD vs git-root path split; prompt path and /memory or index path disagree.
7. Switch **unsurfaced** — resolved cache path never shown in system prompt or transcript.
8. Switch **ghosted** — Non-ASCII / hash corruption breaks continuity, or wrong project hash.
9. Switch **mirrored-fail** — Read/tool path returns wrong scope memory, or path-scoped rules make auto-memory unreachable.
10. Switch **restored** — diagnostic surfaces the resolved path and/or re-resolves against actual git-root/cwd.
11. Switch **control stowed** / **Reset · stowed** — correct cubby, mirrored, rule visible → **stowed** true.
12. **Score** scores. **Admit stowed** scores honestly. **Restore · #90604** shows the invisible/ancestor desk. Admit does not lie.

## Hook

`projects/cubby/hook/` scores a probe `{ session, issue, source, cwd, gitRoot, expectedCachePath, injectedCachePath, ancestorWalkUp, cwdVsGitRootSplit, authoritativeMemoryPath, injectedMissingFileCount, safetyRuleInAuthoritativeOnly, cachePathSurfaced, nonAsciiSlugCorrupt, wrongProjectHash, pathScopedUnreachable, readReturnedWrongScope, restoredDiagnostic, scored }` and returns `{ verdict, reasons[], stowed }`. See `hook/README.md`.

```bash
node projects/cubby/hook/index.mjs --listen 9090
node --test projects/cubby/hook/cubby.test.mjs
```

`stowed` is true ONLY when the cache matches cwd/git-root, authoritative memory is mirrored, safety rules would be visible, the cache path would be detectable, and the verdict is not a failure class. Seeded 90604 numbers must produce invisible / `stowed=false`. Control correct-cache path produces `stowed=true`. Restored classifies **restored** with `stowed=false` (recovery, not idle control).

## Evidence (do not invent more)

Primary:

- [anthropics/claude-code#90604](https://github.com/anthropics/claude-code/issues/90604) — open, filed 2026-08-29, platform:linux, area:core, memory. Auto-memory cache path silently stale/wrong-directory; real safety rule missed. Recurrence of #52772/#53734. Session cwd `/home/user/source/soft-shop`; `# auto memory` injected from `~/.claude/projects/-home-user/memory/`; never-push-main rule invisible; session pushed to main three times.

Same-class:

- [anthropics/claude-code#52772](https://github.com/anthropics/claude-code/issues/52772) — CLOSED. Auto memory system prompt path uses CWD-based path but /memory creates directory at git-root-based path.
- [anthropics/claude-code#53734](https://github.com/anthropics/claude-code/issues/53734) — CLOSED. Auto-memory resolver walks up to ancestor-encoded project directory instead of cwd-encoded path.
- [anthropics/claude-code#89915](https://github.com/anthropics/claude-code/issues/89915) — OPEN. Memory directory resolves to wrong project hash.
- [anthropics/claude-code#90046](https://github.com/anthropics/claude-code/issues/90046) — OPEN. Memory store path mismatch between transcript and index in repository subdirectories (transcript under repo/sub slug, index READ from repo slug).
- [anthropics/claude-code#85591](https://github.com/anthropics/claude-code/issues/85591) — OPEN. Read tool returns project-specific auto-memory content when global memory path is specified.
- [anthropics/claude-code#88945](https://github.com/anthropics/claude-code/issues/88945) — OPEN. Path-scoped rules never match outside the project root, making the auto-memory directory unreachable.
- [anthropics/claude-code#76617](https://github.com/anthropics/claude-code/issues/76617) — OPEN. Non-ASCII username in path corrupts project-slug, breaking session/memory continuity.

Cross-check nearby bugs are DIFFERENT (cite only as “not this”):

- NOT Ullage. Silent 157K context drop / prefix-frozen cache thrash.
- NOT Iota. Path-key casing / type-case identity.
- NOT Fob. Keychain credential litter.
- NOT Cinch. Silent partial folder mounts on scheduled Cowork.
- NOT Wicket. Worktree isolation gatehouse.
- NOT Grille. Bash-steered edits under bypass-permissions.
- NOT Spile. Hook stdin wedge / unenforced timeout.
- NOT Bollard. RC env orphan after supervisor gap.
- NOT Clew. Sandbox deny-list E2BIG.
- NOT Hasp. File-path lease races.

Cross-ecosystem:

- [openai/codex#16799](https://github.com/openai/codex/issues/16799) — Cross-project, cross-session state leak (approved command paths leak across projects).
- [openai/codex#37950](https://github.com/openai/codex/issues/37950) — Realtime voice sessions do not receive AGENTS.md / Personality instructions that text sessions do (instructions fail to reach session).

## Integrations

Slack alarm on misfiled / ancestor / stale / invisible / walked-up / ghosted / mirrored-fail. Linear ticket on invisible / ancestor / walked-up / ghosted. GitHub cubby-ledger of scored probes on every score. Demo mode needs no Slack / GitHub / Linear secrets and no npm. Native stubs fire in the UI (ledger tape / alarm card) without requiring live tokens.
