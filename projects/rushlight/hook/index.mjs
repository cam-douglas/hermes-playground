#!/usr/bin/env node
/**
 * Rushlight iron sconce / rush-pith candle hook.
 * Score snuffed or admit tenured.
 *
 *   echo '{"seed":"snuffed"}' | node index.mjs
 *   node index.mjs ../data/92784.json
 *
 * No live Claude sessions. Diagnostic only. No secrets. No payloads.
 */
import { main } from "./rushlight.mjs";

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
