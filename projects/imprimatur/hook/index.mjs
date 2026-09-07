#!/usr/bin/env node
/**
 * Imprimatur censor stamp-desk hook.
 * Score refused or admit imprinted.
 *
 *   echo '{"seed":"refused"}' | node index.mjs
 *   node index.mjs ../data/92740.json
 *
 * No live Claude sessions. Diagnostic only. No secrets. No payloads.
 */
import { main } from "./imprimatur.mjs";

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
