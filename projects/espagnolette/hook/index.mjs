#!/usr/bin/env node
/**
 * Espagnolette locksmith casement-fastener hook.
 * Score deaf or admit remounted.
 *
 *   echo '{"seed":"deaf"}' | node index.mjs
 *   node index.mjs ../data/92694.json
 *
 * No live Claude sessions. Diagnostic only. No secrets. No payloads.
 */
import { main } from "./espagnolette.mjs";

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
