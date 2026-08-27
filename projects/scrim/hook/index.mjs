#!/usr/bin/env node
/**
 * Scrim PostToolUse / tool-result middleware.
 * POST (or stdin JSON) in → redacted payload out.
 *
 *   echo '{"tool_result":"..."}' | node index.mjs
 *   node index.mjs --listen 8787
 *
 * Env:
 *   SCRIM_SLACK_WEBHOOK  Incoming webhook. Absent → demo ledger row.
 *   SCRIM_GITHUB_TOKEN   Gist ledger. Absent → demo ledger row.
 *   SCRIM_LINEAR_KEY     High-severity rotate ticket. Absent → demo row.
 */
import { createServer } from "node:http";
import { stdin } from "node:process";
import { pathToFileURL } from "node:url";
import { dispatch } from "./adapters.mjs";
import { scrub } from "./redact.mjs";

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
      } catch {
        resolve({ tool_result: { content: raw } });
      }
    });
    stdin.on("error", reject);
  });
}

export async function handle(payload, env = process.env) {
  const result = scrub(payload);
  const sinks = await dispatch(result, env);
  return {
    hook_event_name: "PostToolUse",
    permissionDecision: "allow",
    hookSpecificOutput: {
      hookEventName: "PostToolUse",
      additionalContext: result.clean
        ? "Scrim: frame is clean."
        : `Scrim veiled ${result.findings.length} secret(s). Forensic ids: ${result.findings
            .map((row) => `${row.family}:${row.id}`)
            .join(", ")}`,
    },
    ...result,
    sinks: sinks.events,
    // Harness-shaped body: original keys, values redacted.
    tool_result: result.redacted?.tool_result ?? result.redacted,
  };
}

function send(res, status, body) {
  const json = JSON.stringify(body);
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "content-type,authorization",
  });
  res.end(json);
}

export function listen(port = 8787) {
  const server = createServer(async (req, res) => {
    if (req.method === "OPTIONS") {
      send(res, 204, { ok: true });
      return;
    }
    if (req.method === "GET" && (req.url === "/" || req.url === "/health")) {
      send(res, 200, { ok: true, product: "scrim", boundary: "PostToolUse" });
      return;
    }
    if (req.method !== "POST") {
      send(res, 405, { ok: false, error: "POST a tool_result / PostToolUse payload." });
      return;
    }
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const raw = Buffer.concat(chunks).toString("utf8").trim();
    let payload = {};
    try {
      payload = raw ? JSON.parse(raw) : {};
    } catch {
      payload = { tool_result: { content: raw } };
    }
    const out = await handle(payload);
    send(res, 200, out);
  });
  server.listen(port, "127.0.0.1", () => {
    process.stderr.write(`scrim hook listening on http://127.0.0.1:${port}\n`);
  });
  return server;
}

const asCli = Boolean(process.argv[1]) && import.meta.url === pathToFileURL(process.argv[1]).href;
if (asCli) {
  const listenFlag = process.argv.includes("--listen");
  if (listenFlag) {
    const port = Number(process.argv[process.argv.indexOf("--listen") + 1] || 8787);
    listen(Number.isFinite(port) ? port : 8787);
  } else {
    const payload = await readStdin();
    const out = await handle(payload);
    process.stdout.write(`${JSON.stringify(out)}\n`);
  }
}
