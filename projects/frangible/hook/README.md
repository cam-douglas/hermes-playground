# Frangible hook note (educational)

This folder is **not** a Claude Code patch. It only explains why
a PreToolUse deny-guard whose command file lacks `+x` (chmod 644)
can fail open while the same settings with chmod 755 correctly deny.

`arm-seal.mjs` compares a synthetic chmod 644 spawn failure
against the HOLD (armed) chmod 755 deny-fires path. It does not
install hooks, does not talk to the network, and does not claim
to fix #94362.

```
node projects/frangible/hook/arm-seal.mjs
```
