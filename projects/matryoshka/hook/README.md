# Matryoshka hook note (educational)

This folder is **not** a Claude Code patch. It only explains why
a nested `;` / `|` inside `$(...)` can disagree with a walk that
already allow-lists every leaf command.

`unpack-doll.mjs` compares a synthetic nested-pipe / nested-semicolon
command against the HOLD (unpacked) recurse path. It does not
install hooks, does not talk to the network, and does not claim
to fix #94350.

```
node projects/matryoshka/hook/unpack-doll.mjs
```
