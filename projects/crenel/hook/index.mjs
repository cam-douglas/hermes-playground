#!/usr/bin/env node
/**
 * Crenel mason's battlement crenel hook.
 * Score bricked or admit crenelled.
 *
 *   echo '{"seed":"bricked"}' | node index.mjs
 *   node index.mjs ../data/92729.json
 *
 * No live Claude sessions. Diagnostic only. No secrets. No payloads.
 */
import { readFileSync } from "node:fs";
import { stdin } from "node:process";
import { pathToFileURL } from "node:url";
import { decide, seedCrenelled } from "./crenel.mjs";

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
  if (!text) return seedCrenelled();
  try {
    const parsed = JSON.parse(text);
    if (parsed && typeof parsed === "object") return parsed;
  } catch {
    return seedCrenelled();
  }
  return seedCrenelled();
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
    product: "crenel",
    issue: 92729,
    mark: "06:50 / hermes catalog #212 / #92729",
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
