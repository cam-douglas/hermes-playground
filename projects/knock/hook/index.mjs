#!/usr/bin/env node
/**
 * Claude Code PermissionRequest / PreToolUse helper.
 * Reads hook JSON on stdin, POSTs to Knock, waits for a decision, writes hook output.
 *
 * Env:
 *   KNOCK_URL          Base URL (default http://localhost:3100)
 *   KNOCK_HOOK_SECRET  Optional bearer token
 *   KNOCK_TTL_SECONDS  Optional TTL override
 */
import { stdin } from "node:process";

function readStdin() {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stdin.on("data", (chunk) => chunks.push(chunk));
    stdin.on("end", () => {
      const raw = Buffer.concat(chunks).toString("utf8").trim();
      if (!raw) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(raw));
      } catch (error) {
        reject(error);
      }
    });
    stdin.on("error", reject);
  });
}

async function waitFor(url, secret, timeoutMs) {
  const headers = { Accept: "application/json" };
  if (secret) headers.Authorization = `Bearer ${secret}`;
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    const response = await fetch(`${url}?timeoutMs=4000`, { headers });
    if (!response.ok) {
      await new Promise((r) => setTimeout(r, 400));
      continue;
    }
    const data = await response.json();
    if (data.decided) return data;
    await new Promise((r) => setTimeout(r, 250));
  }
  return { decision: "deny", reason: "Knock wait exceeded local timeout." };
}

const payload = await readStdin();
const base = (process.env.KNOCK_URL || "http://localhost:3100").replace(/\/$/, "");
const secret = process.env.KNOCK_HOOK_SECRET || "";
const body = {
  ...payload,
  ttl_seconds: Number(process.env.KNOCK_TTL_SECONDS || payload.ttl_seconds || 120),
  wait: "0",
};

const headers = { "Content-Type": "application/json" };
if (secret) headers.Authorization = `Bearer ${secret}`;

let created;
try {
  const response = await fetch(`${base}/api/hooks/permission-request`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
  created = await response.json();
} catch (error) {
  const deny = {
    permissionDecision: "deny",
    hookSpecificOutput: {
      hookEventName: "PermissionRequest",
      decision: {
        behavior: "deny",
        message: `Knock unreachable: ${error instanceof Error ? error.message : "unknown"}`,
        interrupt: true,
      },
    },
  };
  process.stdout.write(`${JSON.stringify(deny)}\n`);
  process.exit(0);
}

const knockId = created.knock?.id;
if (!knockId) {
  process.stdout.write(`${JSON.stringify({ permissionDecision: "deny", reason: created.error || "no knock" })}\n`);
  process.exit(0);
}

const ttlMs = (created.knock.ttlSeconds || 120) * 1000 + 1500;
const decided = await waitFor(`${base}/api/knocks/${knockId}/wait`, secret, ttlMs);
process.stdout.write(`${JSON.stringify(decided)}\n`);
