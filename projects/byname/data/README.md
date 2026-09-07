# Byname fixtures

Diagnostic JSON only. No live Claude sessions. Encoded from #92738 issue facts: plugin skill invoked by its bare name shows a false "isn't a recognized command here" warning. Score ambered or admit bynamed.

Idle word: **clear**. Seeded word: **ambered**. HOLD: **clear** / **bynamed**. ALARM: **ambered** / **bare-submit-warns** / **namespaced-clean** / **resolves-anyway** / **autocomplete-offers-bare** / **alias-missing** / **misleading-terminal-copy** / **cousins** / **has-clear-repro**. Primary: [anthropics/claude-code#92738](https://github.com/anthropics/claude-code/issues/92738).

Fixtures record the published incident (bare `/orc-version` after Escape dismisses autocomplete stamps orange wax; namespaced `/orclab:orc-version` is clean; command resolves anyway; autocomplete offers `orclab:orc-version (orc-version)`; aliases missing the bare form; i18n `+9dhXtDFu6` terminal copy). No live session. No secrets. No exploit payloads.

| File | Verdict | What it scores |
|---|---|---|
| `clear.json` | clear | Idle folio. HOLD: no false warning; namespaced path or no bare submit. |
| `ambered.json` | ambered | Seeded #92738 path. ALARM: bare byname stamps orange wax then runs. |
| `bynamed.json` | bynamed | Admit hold. Bare epithet registered as an alias, or warning suppressed. |
| `92738.json` | ambered | Primary fixture alias for #92738. |
| `bare-submit-warns.json` | bare-submit-warns | Escape dismiss + Enter stamps the orange warning. |
| `namespaced-clean.json` | namespaced-clean | Accepting autocomplete rewrite runs with no warning. |
| `resolves-anyway.json` | resolves-anyway | Warning is false; command resolves and runs. Client-side only. |
| `autocomplete-offers-bare.json` | autocomplete-offers-bare | Menu shows `orclab:orc-version (orc-version)`. |
| `alias-missing.json` | alias-missing | Exact name/alias check; plugin entries carry only namespaced `name`. |
| `misleading-terminal-copy.json` | misleading-terminal-copy | i18n `+9dhXtDFu6` points at Claude Code terminal. |
| `cousins.json` | cousins | Cite-only Advowson/#91005, Springe/#92675, Speakpipe/#92646, Muzzle/#92459, Hangfire, Aphonia, Catachresis/#92518. Primary stays #92738. |
| `has-clear-repro.json` | has-clear-repro | Issue labeled has repro. |
| `fixtures.json` | index | Row list for the byname desk. |

Drop any file onto `projects/byname/index.html` or paste the JSON. The living page admits **clear** / idle no false warning / #92738.

Probes are diagnostic reconstructions of the issue's published facts. This assay does not run Claude.
