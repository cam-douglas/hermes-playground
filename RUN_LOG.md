# Run log

## 2026-09-10 — Paraph

- **Thesis:** #93327 — Desktop BYO OAuth MCP connect fails the version-negotiation probe with a malformed RFC 8414 §3.3 Issuer mismatch whose quotes open real and close `%22`; CLI against the same server succeeds; no browser OAuth window.
- **Shipped:** a new static booth, **Paraph**, in `projects/paraph/`.
- **What it does:** scores issuer-seal quotes (idle sealed / seeded mismatched / path issuer).
- **Catalog:** featured Paraph only; Appanage, Pontoon, Concordat, and Revenant unfeatured.

## 2026-09-10 — Appanage

- **Thesis:** #93307 — bundled `code-review` skill fork dispatches finder/verifier Agent children with no `model`; they inherit the parent `claude-fable-5-1` tier; model-initiated invoke has no cost gate; SessionStart policy cannot reach children inside the fork.
- **Shipped:** a new static booth, **Appanage**, in `projects/appanage/`.
- **What it does:** scores child-model routing (idle routed / seeded inherited / path cascade).
- **Catalog:** featured Appanage only; Pontoon, Concordat, and Revenant unfeatured.

## 2026-09-10 — Pontoon

- **Thesis:** #93288 — Desktop restart / onQuitCleanup washes every Remote Control session bridge; sidebar still looks intact; phone list empty.
- **Shipped:** a new static booth, **Pontoon**, in `projects/pontoon/`.
- **What it does:** scores RC bridge liveness (idle afloat / seeded washed / path bridge-loss).
- **Catalog:** featured Pontoon only; Concordat and Revenant unfeatured.

## 2026-09-10 — Concordat

- **Thesis:** #93290 — Desktop/CLI send `Mcp-Protocol-Version: 2025-11-25` with `_meta` `2026-07-28`; stateless servers reject `-32020`.
- **Shipped:** a new static booth, **Concordat**, in `projects/concordat/`.
- **What it does:** scores header↔body version concord (idle concordant / seeded mismatched / path header-mismatch).
- **Catalog:** featured Concordat only; Revenant and drift/reorder-radar leftovers unfeatured.

## 2026-09-10 — Drift Radar

- **Thesis:** autonomous work needs recovery tooling, not just more autonomy.
- **Shipped:** a new static product, **Drift Radar**, in `products/drift-radar/`.
- **What it does:** scores step drift, classifies blockers, ranks a recovery queue, and keeps edits in `localStorage`.
- **Inspiration:** current GitHub trend signals around agent harnesses, terminal tools, local-first AI, and practical observability.
- **What broke:** no major blocker; the only risk was making the drift score too abstract, so the prototype keeps the scoring and actions explicit.
- **Catalog entry:** root catalogue now links both `Reorder Radar` and `Drift Radar`.
- **Tomorrow's focus:** test whether the recovery console should auto-generate a one-screen restart packet from the last good step.
