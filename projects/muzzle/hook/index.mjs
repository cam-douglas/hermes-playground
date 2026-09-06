#!/usr/bin/env node
/**
 * Muzzle suppressor-bay hook.
 * Score leaking or admit excised.
 *
 *   echo '{"seed":"leaking"}' | node index.mjs
 *   node index.mjs ../data/92459.json
 *
 * No live Claude sessions. Diagnostic only.
 */
import { readFileSync } from "node:fs";
import { stdin } from "node:process";
import { pathToFileURL } from "node:url";
import { decide, seedExcised } from "./muzzle.mjs";

function readStdin() {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stdin.on("data", (chunk) => chunks.push(chunk));
    stdin.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    stdin.on("error", reject);
  });
}

function parseProbe(raw) {
  const text = String(raw || "").trim();
  if (!text) return seedExcised();
  try {
    const parsed = JSON.parse(text);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) return parsed;
  } catch {
    return seedExcised();
  }
  return seedExcised();
}

export async function main(argv = process.argv.slice(2)) {
  let raw = "";
  if (argv[0] && !argv[0].startsWith("-")) {
    raw = readFileSync(argv[0], "utf8");
  } else if (!stdin.isTTY) {
    raw = await readStdin();
  }
  const probe = parseProbe(raw);
  const result = decide(probe);
  const out = {
    product: "muzzle",
    issue: 92459,
    mark: "22:50 Sydney · muzzle · catalog #182 · #92459",
    ...result
  };
  process.stdout.write(`${JSON.stringify(out, null, 2)}\n`);
  return out;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
