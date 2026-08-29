# Ordo

Sacristan's missal / kalendar desk for a real Claude Code failure class: plugin-provided slash commands fail to resolve in headless `-p` mode on 2.1.251, returning `Unknown command: /<plugin>:<cmd>` with `num_turns: 0`. Built-ins still work. The process exits 0 with `is_error: false`, so unattended wrappers treat it as success and store the error string as the analysis result. Same plugins, same config, same cwd work on 2.1.250. Bisect isolated the version. Node 20 and 24 both fail on 2.1.251.

A written plugin command is not a hold. Score the missal or admit **appointed**.

Idle word: **appointed** (plugin command resolved and ran, or the empty missal).
NEVER use the product name ordo / missal / office / rubric / kalendar as the idle/state word.
NEVER reuse prior idles: cinched, gauged, stamped, overrun, pratique, wound, bound, stilled, stabled, drained, flat, fit, spoilt, laid, unlinked, tight, banked, roosted, stocked, seated, heard, clear, paired, kernel, latched, upheld, sterling, home, valid, dry, sealed, quiet, seised.

Verdicts: **appointed**, **unknown**, **silent**, **hollow**, **builtin**, **missing**, **loud**, **stale**, **resolved**, **cache-ok**. Slack alarm on silent / hollow / unknown. Linear ticket on silent (unattended missal miss). GitHub ordo-ledger of scored offices on every score.

The #90515 silent trio (Unknown command + `is_error` false + exit 0) is **silent**, never **appointed**, even when `enabledPlugins` + `installed_plugins.json` + `commands/*.md` look healthy.

## Why not a clone

NOT Larder (plugin-*store freeze*: sync stamp advances, on-disk plugin folders stand still). Ordo assumes the store and cache look healthy.
NOT Tappet (fired hook is not a seated injection).
NOT Reed (MCP connected vs registered).
NOT Assay (parsed call vs delivered arguments).
NOT Cinch (silent partial folder mounts).
NOT Sprag (boot-cached MCP attach failure).
NOT Visa (OAuth missing resource).
NOT leftover woodworking / millimetre-slider products.

Different problem: the HEADLESS MISSAL. Did `-p` actually resolve the plugin office, and did the wrapper notice the failure (exit / `is_error`), vs a written enabledPlugins + cache file that looks healthy.
Different UI: liturgical parchment. Cream page, red rubrics, black appointed offices, kalendar of the day's hours. Fonts: Cormorant Garamond + Crimson Pro — not Spectral/Nunito Sans (Cinch), not Fraunces/Barlow Condensed (Ullage), not Libre Baskerville/Source Sans 3 (Visa), not Teko/Atkinson (Sprag), not Bodoni (Fusee).
Different idle word: **appointed**.

## Live catalog path

`/ordo/` is this static sacristy missal. Parchment leaf, rubric rule, kalendar of hours, red-letter offices, missal gutter. Demo works with no secrets and no npm. Mark: `16:50 Sydney · ordo`.

1. Seeded `#90515` **silent** is already on the missal: `/ppp:analyze-incident` → Unknown command, `num_turns` 0, `is_error` false, exit 0, plugin enabled + cached → **silent**.
2. Switch **hollow** — error string stored as the analysis result → **hollow**.
3. Switch **unknown** — Unknown command without the silent-success envelope → **unknown**.
4. Switch **loud** — unknown AND `is_error` true → **loud**.
5. Switch **missing** — plugin not actually enabled or cached → **missing**.
6. Switch **stale** — cache file exists, headless resolver does not see it → **stale**.
7. Switch **builtin** — `/context` still works, proving `-p` is alive → **builtin**.
8. Switch **resolved** — parser has the office → **resolved**.
9. Switch **cache-ok** — files on disk look healthy → **cache-ok**.
10. Switch **control** — same plugin command on 2.1.250 → **appointed**.
11. Switch **Reset · appointed** — empty missal → **appointed**. Idle word is **appointed** when the sacristy is idle.
12. **Score** scores. **Admit appointed** scores honestly. **Reset · appointed** returns idle appointed. **Restore · silent** shows the #90515 silent-unknown. Admit does not lie: a silent missal stays silent.

## Hook

`projects/ordo/hook/` scores an office `{ command, result, numTurns, isError, exitCode, enabled, installed, cached, commandFile, resolved, storedAsResult, isBuiltin, session, source, issue, scored }` and returns `{ verdict, reasons[], appointed }`. See `hook/README.md`.

```bash
node projects/ordo/hook/index.mjs --listen 9090
node --test projects/ordo/hook/ordo.test.mjs
```

## Evidence (do not invent more)

Primary:

- [anthropics/claude-code#90515](https://github.com/anthropics/claude-code/issues/90515) — filed 2026-08-29. Every plugin-provided slash command fails in headless `-p` on 2.1.251. Unknown command, `num_turns` 0, `is_error` false, exit 0. Built-ins still work. Plugin enabled in settings.json, present in `installed_plugins.json`, cache carries `commands/*.md`. Same cwd works on 2.1.250. Node 20 and 24 both fail on 2.1.251.

Shape (cite as shape, not a new primary):

- [anthropics/claude-code#37862](https://github.com/anthropics/claude-code/issues/37862) — `/reload-plugins` rebuilds model-facing skills, not the `/` command parser index.
- [anthropics/claude-code#41842](https://github.com/anthropics/claude-code/issues/41842) — plugin `skills/` not slash-registered; Skill tool works.
- [anthropics/claude-code#17271](https://github.com/anthropics/claude-code/issues/17271) — plugin skill missing from slash.
- [anthropics/claude-code#64669](https://github.com/anthropics/claude-code/issues/64669) — official plugin slash commands Unknown.
- [anthropics/claude-code#8430](https://github.com/anthropics/claude-code/issues/8430) — agent-sdk custom slash commands: `is_error` false, empty result, CLI works.
- [openai/codex#14459](https://github.com/openai/codex/issues/14459) — custom prompts on disk; desktop `/` popup only shows builtins.
- [openai/codex#15980](https://github.com/openai/codex/issues/15980) — custom prompts "Not available in app-server TUI yet".
