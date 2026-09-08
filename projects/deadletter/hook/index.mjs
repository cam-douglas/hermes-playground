#!/usr/bin/env node
/**
 * Deadletter postal dead-letter / undeliverable-mail bench hook.
 * Score lost or admit filed.
 *
 *   echo '{"seed":"lost"}' | node index.mjs
 *   node index.mjs ../data/90049.json
 *
 * No live Claude sessions. Diagnostic only. No secrets. No payloads.
 */
import { main } from "./deadletter.mjs";

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
