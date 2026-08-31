# Cockade hook

Tiny milliner-bench classifier for the undocumented ultracode arm. Originally filed as a cosmetic badge bug; further checking inverted the diagnosis. Opening `/effort` shows the slider marker sitting ON ultracode ("xhigh + workflows") while the session header in the same frame reads "Fable 5 with xhigh effort". The badge was truthful; the header is the element mislabeling the state (ultracode reports its level as `xhigh` internally, per statusline docs). Two defects: (1) Ultracode is armed with no ultracode opt-in anywhere. (2) Header hides ultracode. With effort actually at ultracode, `/effort xhigh` is a silent no-op — no `modelSettings` entry is written.

Idle word is **unpinned**. Seeded state is cocked / #91033. Never idle as cocked / armed / ultracode / cockade / rinsed / scrubbed / stripped / lye / vacant / reserved / advowson / smutch / plain / seated / bound / hallmarked / pointed / collapsed / spoiled / banked.

```bash
node projects/cockade/hook/cockade.mjs projects/cockade/data/91033.json
node projects/cockade/hook/cockade.mjs projects/cockade/data/unpinned.json
echo '{"slider":"ultracode","header":"Fable 5 with xhigh effort","badge":"ultracode"}' | node projects/cockade/hook/cockade.mjs
node --test projects/cockade/hook/cockade.test.mjs
```

Empty stdin uses the idle **unpinned** ticket. Stdout is JSON: `verdict`, `chips[]`, `reasons[]`, `hold`, `alarm`, `idleWord`.

- **UNPINNED** if ultracode is off, the header is honest, and the slider sits on documented default `high`
- **COCKED** if the slider sits on ultracode with no ultracode key anywhere and the header still reads "with xhigh effort" (#91033)
- **DOCUMENTED-DEFAULT** if Fable 5 holds the documented model default (`high`) and ultracode is unset (hold)
- **MISLABELED** / **HEADER-LIE** if the brim ticket prints `xhigh` while ultracode is active
- **SILENT-NOOP** / **EFFORT-XHIGH** / **PERSIST-MISS** if `/effort xhigh` writes no `modelSettings` entry
- **XHIGH-MASK** if ultracode reports as `xhigh` and the header renders that reported level
- **NO-OPT-IN** / **SETTINGS-ABSENT** / **ENV-UNSET** if no documented route armed ultracode
- **SLIDER-ULTRACODE** / **WORKFLOWS-ARMED** if the `/effort` marker sits on "xhigh + workflows"
- **BADGE-TRUE** if the footer badge ultracode is the honest element
- **FABLE-DEFAULT** if Fable 5 has no effort setting (docs say `high`)
- **UNDOCUMENTED** if ultracode is armed with no changelog / settings default

Primary: [anthropics/claude-code#91033](https://github.com/anthropics/claude-code/issues/91033). No same-class cite required.

Hypothesis only (NON-BINDING): undocumented / spontaneous ultracode arm (possibly a saved plain `xhigh` seated as ultracode) plus a header that prints ultracode's internal reported level (`xhigh`) so `/effort xhigh` is a silent no-op. Do not claim a root cause in Claude Code source you have not seen.

NOT Lye / Advowson / Smutch / Bitting / Puncheon / Gnomon / Spoil / Pale / Pawl / Ambo / Chatelaine / Bulla / Limpet.
