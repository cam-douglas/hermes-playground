#!/usr/bin/env node
/**
 * Ptybind ConPTY bind-plate hook.
 * Score swallowed or admit unbound.
 *
 *   echo '{"seed":"swallowed"}' | node index.mjs
 *   node index.mjs ../data/92757.json
 *
 * No live Claude sessions. Diagnostic only. No secrets. No payloads.
 */
import { main } from "./ptybind.mjs";

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
