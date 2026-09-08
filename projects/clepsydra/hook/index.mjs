#!/usr/bin/env node
/**
 * Clepsydra marble cistern / water-clock hook.
 * Score arrested or admit credited.
 *
 *   echo '{"seed":"arrested"}' | node index.mjs
 *   node index.mjs ../data/92776.json
 *
 * No live Claude sessions. Diagnostic only. No secrets. No payloads.
 */
import { main } from "./clepsydra.mjs";

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
