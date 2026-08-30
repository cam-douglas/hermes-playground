# Fetch

An Irish/English folklore **looking-glass parlor** — pewter frame, fog glass, cold moonlight, a silvered scrying pane, a fetch (living doppelganger) on the glass — for a real Claude Code defect: the prompt-suggestion feature (forked agent, `source=prompt_suggestion`, `promptSuggestionEnabled` default-on) renders a **model-generated suggested user reply as ghost text on the `❯` input line**. In headless/automated setups that scrape the terminal with `tmux capture-pane -p` (or similar), styling is stripped so ghost text is **byte-identical to real typed input**. A watchdog that resubmits "stuck" input turns suggestions into real user messages — over ~2 days one report saw **220+ fabricated user messages**, including fake approvals ("Yes, go ahead") that caused real edits, self-modification of the watchdog, incorrect memory writes, and runaway self-conversation loops.

Primary: [anthropics/claude-code#90755](https://github.com/anthropics/claude-code/issues/90755) (OPEN, filed 2026-08-30). Title: Prompt suggestions render as ghost text indistinguishable from typed input in scraped/headless terminals — enabled fabricated "user messages" incl. fake approvals. Labels: bug, platform:macos, area:tui, area:security. Env: Claude Code 2.1.246–2.1.251, macOS Apple Silicon, headless inside tmux with `--channels plugin:telegram` and `--permission-mode auto`; Telegram bridge injects via `tmux send-keys`; watchdog rescues stuck input by scraping `tmux capture-pane -p`.

A fetch on the glass is not a keyed reply. Score the pane or admit **muted**.

Idle word: **muted** (honest control: `promptSuggestionEnabled` off / suggestions suppressed for `--channels` / non-interactive / no recent local keystrokes; or a machine-readable marker so scrapers filter suggestion text. Input line is keyed-only).
NEVER use muted for a failure. NEVER use the product name fetch / liveried / penned / underwrit / plated / collated / unheard / passed / squared / bound / girt / sheltered / alongside / seated / credited / level / verbatim / fronted / locked / yanked / caught / posted / bunged / belayed / rove / keyed / housed / beamed / snug / hung / appointed / cinched / gauged / stamped / overrun / pratique / wound / fit / spoilt / laid / unlinked / tight / banked / roosted / stocked / heard / clear / paired / empty / mute / idle / silent / flat as the idle/state word.

Verdicts: **muted**, **ghosted**, **scraped**, **fabricated**, **fake-approve**, **self-loop**, **unmarked**, **default-on**, **channel-blind**, **byte-identical**, **watchdog-fed**, **suggestion-source**.

- **muted** = idle / honest control (suggestions off or marked; input line keyed-only)
- **ghosted** = #90755 primary: suggestion rendered as ghost text on the `❯` input line
- **scraped** = `capture-pane` / pane scrape sees byte-identical text
- **fabricated** = suggestion submitted as a real user message
- **fake-approve** = fabricated approval like "Yes, go ahead" acted on
- **self-loop** = each reply generates a fresh suggestion which is resubmitted
- **unmarked** = no machine-readable marker / glyph / prefix on the suggestion line
- **default-on** = `promptSuggestionEnabled` default on
- **channel-blind** = suggestions still on under `--channels` / headless
- **byte-identical** = styled ghost == typed bytes after scrape
- **watchdog-fed** = automation treats the suggestion as stuck human input
- **suggestion-source** = debug `source=prompt_suggestion`

The seeded #90755 board (ghost text on `❯` + unmarked + `source=prompt_suggestion` + capture-pane byte-identical + submitted as user) is **ghosted** (or fabricated), never **muted**. Unique nearby flags win their own seeds. Admit does not lie: a ghosted probe stays ghosted.

## Why not a clone

Different problem: TUI ghost-text / headless scrape / fabricated user authorship. NOT packaging, NOT AV, NOT hooks rewrite, NOT OAuth, NOT DLP pattern redact, NOT permission stall.

NOT **Livery** (#90748 TCC path-churn desktop bundled binary).
NOT **Pinfold** (#90706 Defender FileFix CmdLine EPERM).
NOT **Palimpsest** (#90725 PreToolUse updatedInput sibling drop).
NOT **Escutcheon** (Linux /run/user tmpfs / keyring).
NOT **Chatelaine** (nested mcpOAuth).
NOT **Fob** (keychain litter).
NOT **Visa** (OAuth destination).
NOT **Sigil** (hollow thinking seal).
NOT **Hasp** (file lease).
NOT **Knock** (permission grant stall).
NOT **Slype** (sandbox pwsh 126).
NOT **Scrim** (runtime DLP redact tool_result).
NOT **Chute** (typed secret handoff).
NOT **Ambo** (pulpit / unread card).
NOT **Byline** (ghost byline authorship elsewhere — different metaphor; Byline is about credited authorship on a rack, not TUI ghost suggestions).

Different UI: looking-glass parlor / scrying pane / silvered fetch window. Cold moonlight silver, slate, pewter, fog glass — NOT mahogany wine wardrobe, NOT village pound, NOT scriptorium, NOT locksmith plate, NOT collation desk, NOT pressing board, NOT pulpit.
Different fonts from Livery (do NOT use Playfair Display + Source Sans 3 + IBM Plex Mono). Cormorant Garamond + Manrope + JetBrains Mono.
Different idle: **muted**.

## Live catalog path

`/fetch/` is this static looking-glass parlor. Demo works with no secrets and no npm. Mark: `23:50 Sydney · fetch`.

1. Seeded `#90755` **ghosted/fabricated** is already on the pane: ghost text on `❯` + unmarked + `source=prompt_suggestion` + capture-pane byte-identical → **ghosted**. Never muted.
2. File **scraped** — `capture-pane` / pane scrape sees byte-identical text.
3. File **fabricated** — suggestion submitted as a real user message.
4. File **fake-approve** — fabricated approval like "Yes, go ahead" acted on.
5. File **self-loop** — each reply generates a fresh suggestion which is resubmitted.
6. File **unmarked** — no machine-readable marker / glyph / prefix on the suggestion line.
7. File **default-on** — `promptSuggestionEnabled` default on.
8. File **channel-blind** — suggestions still on under `--channels` / headless.
9. File **byte-identical** — styled ghost == typed bytes after scrape.
10. File **watchdog-fed** — automation treats the suggestion as stuck human input.
11. File **suggestion-source** — debug `source=prompt_suggestion`.
12. **Stamp** the matching class. Wrong stamps bind the glass. **Admit muted** unlocks only on the honest pane (suggestions muted / marked). **Restore · #90755** shows the ghosted board.

## Hook

`projects/fetch/hook/` scores a probe transcript `{ promptSuggestionEnabled, suggestionSource, ghostText, capturePaneText, composerMarked, channelsActive, recentKeystrokes, submittedAsUser, approvalText, watchdogFed, selfLoop, fabricatedCount }` and returns `{ verdict, reasons[], muted, alarm }`. See `hook/README.md`.

```bash
node projects/fetch/hook/index.mjs < transcript.txt
node --test projects/fetch/hook/fetch.test.mjs
```

`muted` is true ONLY when the verdict is muted (idle, or honest control: suggestions off or marked; input line keyed-only). Seeded 90755 numbers must produce ghosted / fabricated / `muted=false`.

## Evidence (do not invent more)

Primary:

- [anthropics/claude-code#90755](https://github.com/anthropics/claude-code/issues/90755) — OPEN, filed 2026-08-30. Ghost text on `❯`; `tmux capture-pane -p` byte-identical; 220+ fabricated user messages incl. fake approvals. Labels: bug, platform:macos, area:tui, area:security. Claude Code 2.1.246–2.1.251, macOS Apple Silicon, headless tmux, `--channels plugin:telegram`, `--permission-mode auto`.

Related (same habitat; cite, do not treat as primary):

- [anthropics/claude-code#78177](https://github.com/anthropics/claude-code/issues/78177) — Remote Control: message arrives in TUI composer but is never submitted — tmux/headless.
- [anthropics/claude-code#86896](https://github.com/anthropics/claude-code/issues/86896) — Spurious mid-run interrupt from terminal report sequences in unattended tmux.
- [anthropics/claude-code#77155](https://github.com/anthropics/claude-code/issues/77155) — `--channels` fails when plugin loaded via `--plugin-dir`.
- [anthropics/claude-code#77569](https://github.com/anthropics/claude-code/issues/77569) — Display text / ANSI leaks into persisted flags (display-vs-semantic confusion class).

Suggested consumer fix (from the issue, not invented): emit a machine-readable marker for suggestion text (distinct glyph/prefix on the rendered line) so scrapers can filter it; auto-suppress prompt suggestions when running with `--channels` / in non-interactive-looking contexts (no recent local keystrokes); document `promptSuggestionEnabled` prominently for headless deployments.

## Env

| Variable | Meaning |
| --- | --- |
| `FETCH_SLACK_WEBHOOK` / `SLACK_WEBHOOK` | Unused at page runtime. Absent → honest demo. |
| `FETCH_GITHUB_TOKEN` / `GITHUB_TOKEN` | Unused at page runtime. |

Missing secrets stay in honest demo mode. The static page does not need them.
