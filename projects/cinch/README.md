# Cinch

Saddler's / packer's cinch desk for a real Claude Code failure class: Cowork scheduled / unattended tasks intermittently fail to mount folders that are already connected and reliable in interactive sessions. A different subset drops every run. Adding folders to Trusted Cowork folders does not stop it. The worst case treated a surviving leaf path as "proceed" and delivered a VP-level report with two entire sections silently omitted — no error, no placeholder, presented as complete. One monthly deliverable then failed for an entire month.

A written Trusted-folders list is not a hold. Score the girth or admit **cinched**.

Idle word: **cinched** (every expected folder is mounted and reachable).
NEVER use the product name cinch / mount / folder / slip / pack / girth as the idle/state word.
NEVER reuse prior idles: gauged, stamped, overrun, pratique, wound, bound, stilled, stabled, drained, flat, fit, spoilt, laid, unlinked, tight, banked, roosted, stocked, seated, heard, clear, paired, kernel, latched, upheld, sterling, home, valid, dry, sealed, quiet, seised.

Verdicts: **cinched**, **slipped**, **dropped**, **phantom**, **omitted**, **partial**, **trusted**, **loose**, **delivered**, **halted**. Slack alarm on slipped / dropped / omitted / delivered / phantom / loose. Linear ticket when omitted or delivered. GitHub cinch-ledger of scored packs on every score.

Leaf-proceed plus a missing root is **omitted** (or **delivered** if the incomplete pack was presented as complete), never **cinched**, even when a surviving leaf path exists.

## Why not a clone

NOT Fusee (early schedule *dispatch* — cron fires ahead of fireAt). Cinch is an unstable *mount set* on an otherwise-fired run.
NOT Wicket (worktree *isolation* / wrong worktree).
NOT Larder (plugin-*store freeze*: sync stamp advances, on-disk plugin folders stand still).
NOT Hasp (file *lease* / last-writer-wins).
NOT Sprag (boot-cached *MCP* attach failure).
NOT Ullage, Visa, or any other catalog desk.
NOT leftover woodworking / millimetre-slider products.
Do NOT ship Girth, Pack, Saddle, Mount, Tack, Pannier, or Crupper as alternate product names this hour. Product name is **Cinch** only.

Different problem: an unstable mount set on an otherwise-fired run. A surviving leaf is not a hold.
Different UI: night saddlery / tack room. Leather cinch and brass buckle on a pack saddle, strap holes, oil-lamp amber, bridle hooks. Harness leather, brass, lamp amber, stall dark, chalk-white tally. Fonts: Spectral + Nunito Sans — not Fraunces/Barlow Condensed (Ullage), not Libre Baskerville/Source Sans 3 (Visa), not Teko/Atkinson (Sprag), not Bodoni (Fusee).
Different idle word: **cinched**.

## Live catalog path

`/cinch/` is this static saddler's cinch desk. Leather strap, brass buckle, strap holes, oil lamp, bridle hooks, chalk tally. Demo works with no secrets and no npm. Mark: `15:50 Sydney · cinch`.

1. Seeded `#90506` **omitted** is already on the slate: engines + Outputs root missing, leaf treated as proceed, VP report shipped incomplete → **omitted**.
2. Switch **delivered** — incomplete pack presented as complete → **delivered**.
3. Switch **dropped** — two or more expected folders missing → **dropped**.
4. Switch **slipped** — one trusted folder missing this run → **slipped**.
5. Switch **phantom** — listed / trusted / connected but unreachable → **phantom**.
6. Switch **trusted** — Always-allow / Trusted Cowork folders did not prevent the drop → **trusted**.
7. Switch **loose** — cinch reads tight while the pack has shifted → **loose**.
8. Switch **partial** — a subset of the expected mount set is present → **partial**.
9. Switch **halted** — guard treated a missing root as a hard stop → **halted**.
10. Switch **control** — interactive session that never failed → **cinched**.
11. Switch **Reset · cinched** — every expected folder mounted and reachable → **cinched**. Idle word is **cinched** when the tack room is idle.
12. **Score** scores. **Admit cinched** scores honestly. **Reset · cinched** returns idle cinched. **Restore · omitted** shows the #90506 incident 3 omit. Admit does not lie: an omitted pack stays omitted.

## Hook

`projects/cinch/hook/` scores a pack `{ expected[], mounted[], trusted[], listed[], leafProceed, shipped, session, source, issue, scored }` and returns `{ verdict, reasons[], missing[], extra[], cinched }`. See `hook/README.md`.

```bash
node projects/cinch/hook/index.mjs --listen 9090
node --test projects/cinch/hook/cinch.test.mjs
```

## Evidence (do not invent more)

Primary:

- [anthropics/claude-code#90506](https://github.com/anthropics/claude-code/issues/90506) — filed 2026-08-29. Six incidents, six different folder combinations, 2026-08-19 to 2026-08-29. Incident 3: engines + Outputs root missing, one leaf under Outputs stayed reachable; guard treated the leaf as proceed; VP report shipped with two sections silently omitted. Trusted Cowork folders change after incident 1 did not stop incidents 2 and 3. Author points at the same class as #47180 and #59302 but manifesting as silent partial mounts rather than re-prompts.

Shape (cite as shape, not a new primary):

- [anthropics/claude-code#47180](https://github.com/anthropics/claude-code/issues/47180) — scheduled tasks ignore Always-allow; prompts reappear every run.
- [anthropics/claude-code#59302](https://github.com/anthropics/claude-code/issues/59302) — Allow-for-all-scheduled-runs folder permission not persisting (cited by #90506).
- [anthropics/claude-code#89813](https://github.com/anthropics/claude-code/issues/89813) — Cowork mounted a folder into a project session that was never attached.
- [anthropics/claude-code#85577](https://github.com/anthropics/claude-code/issues/85577) — git add silently stages nothing in a connected folder (mount denies unlink).
- [anthropics/claude-code#38993](https://github.com/anthropics/claude-code/issues/38993) — virtiofs FUSE mount serves truncated/stale files.
- [anthropics/claude-code#71307](https://github.com/anthropics/claude-code/issues/71307) — reserved-path overlap blocks mounting scheduled folders.
- [openai/codex#35134](https://github.com/openai/codex/issues/35134) — Windows Desktop scheduled automations fail to attach the same workspace interactive sessions have (malformed cwd).
- [openai/codex#22827](https://github.com/openai/codex/issues/22827) — background automations cannot see the user-scoped WSL distro that interactive chat can.
