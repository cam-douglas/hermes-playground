#!/usr/bin/env node
/**
 * Diopter optical trial-lens / refraction-bench hook.
 * Score defocused or admit sharp.
 *
 *   echo '{"seed":"defocused"}' | node index.mjs
 *   node index.mjs ../data/92524.json
 *
 * No live Claude sessions. Diagnostic only.
 */
import { readFileSync } from "node:fs";
import { stdin } from "node:process";
import { pathToFileURL } from "node:url";
import { decide, seedSharp } from "./diopter.mjs";

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
  if (!text) return seedSharp();
  try {
    const parsed = JSON.parse(text);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) return parsed;
  } catch {
    return seedSharp();
  }
  return seedSharp();
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
    product: "diopter",
    issue: 92524,
    mark: "05:50 Sydney · diopter · catalog #189 · #92524",
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
