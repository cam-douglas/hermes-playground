# Bourdon hook

Tiny Node scorer for the Bourdon-tube pressure-bay assay. No secrets. No live Claude sessions.

```bash
node projects/bourdon/hook/index.mjs projects/bourdon/data/92510.json
echo '{"seed":"vented","vented":true,"cmdq":true,"hostFd":0}' | node projects/bourdon/hook/index.mjs
node --test projects/bourdon/hook/bourdon.test.mjs
```

Empty stdin scores the seeded **vented** ticket. A probe with `seed: "saturating"` and the host-fd climb scores **saturating**. Glow-plug / delayed-primer / CRT paging-storm / suppressor-bay fields are not this product.

HOLD = vented. ALARM = saturating / host-fd-409600 / guest-clean-512 / idle-12h-after-prompt / virtiofs-suspect / cousins. Control: cli-no-vm-clean (Terminal CLI, no VM, does not exhibit this). Workaround chip: cmdq-releases (Cmd+Q Desktop releases descriptors).

Verdicts: saturating, vented, host-fd-409600, guest-clean-512, idle-12h-after-prompt, virtiofs-suspect, cmdq-releases, cli-no-vm-clean, cousins.
