#!/usr/bin/env node
/**
 * Clew loft hook. A working-size coil is not a hold.
 * Score the clew or admit rove.
 *
 *   echo '{"worktreeCount":261,"e2big":true}' | node index.mjs
 *   node index.mjs clew.json
 *   node index.mjs --listen 9090
 *
 * Env:
 *   CLEW_SLACK_WEBHOOK  Incoming webhook. Absent → demo "Would post to Slack".
 *   CLEW_GITHUB_TOKEN   Clew-ledger issue. Absent → demo ledger.
 *   CLEW_LINEAR_KEY     Fouled / choked / jammed ticket. Absent → demo row.
 *
 * NOT Wicket / Scant / Sump / Cinch / Hasp /
 * Sounder / leftover woodworking. Idle word is
 * rove, never the product name, never empty, never
 * silent / mute / idle / dead.
 */
import { readFileSync } from "node:fs";
import { createServer } from "node:http";
import { stdin } from "node:process";
import { pathToFileURL } from "node:url";
import { fire } from "./adapters.mjs";
import { decide, parseSessionTrace, seedFouled } from "./clew.mjs";

function readStdin() {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stdin.on("data", (chunk) => chunks.push(chunk));
    stdin.on("end", () => {
      const raw = Buffer.concat(chunks).toString("utf8").trim();
      if (!raw) {
        resolve(seedFouled());
        return;
      }
      resolve(parsePayload(raw));
    });
    stdin.on("error", reject);
  });
}

function parsePayload(raw) {
  const text = String(raw || "").trim();
  if (!text) return seedFouled();
  try {
    const parsed = JSON.parse(text);
    if (
      parsed &&
      typeof parsed === "object" &&
      !Array.isArray(parsed) &&
      (parsed.action ||
        parsed.clew ||
        parsed.probe ||
        parsed.worktreeCount != null ||
        parsed.e2big != null ||
        parsed.largestArgBytes != null ||
        parsed.sleepFailed != null)
    ) {
      return parsed.action || parsed.clew || parsed.probe
        ? parsed
        : { action: "score", clew: parsed };
    }
    if (Array.isArray(parsed)) {
      return { action: "score", clew: { session: "stdin", scored: true } };
    }
  } catch {
    const clew = parseSessionTrace(text);
    if (clew.worktreeCount || clew.e2big || clew.largestArgBytes) {
      return { action: "score", clew };
    }
    return { error: "unparseable", raw: text };
  }
  const clew = parseSessionTrace(text);
  return { action: "score", clew };
}

function shouldDeny(result) {
  return Boolean(result.alarm);
}

function denyMessage(result) {
  if (result.verdict === "fouled") {
    return "Clew fouled. 261 worktrees; 524 worktree denies; 130.7KB single arg; E2BIG; even sleep 5 fails. A working-size coil is not a hold.";
  }
  if (result.verdict === "overcoiled") {
    return "Clew overcoiled. Deny list grew two entries per registered worktree without bound.";
  }
  if (result.verdict === "choked") {
    return "Clew choked. Every Bash spawn fails (sleep 5 / echo hello / monitor) with E2BIG.";
  }
  if (result.verdict === "jammed") {
    return "Clew jammed. Single /bin/bash -c argument exceeds 128KB MAX_ARG_STRLEN.";
  }
  if (result.verdict === "swollen") {
    return "Clew swollen. Deny count unbounded vs a fixed baseline (~160 baseline + 2×trees).";
  }
  if (result.verdict === "cached") {
    return "Clew cached. Sweep + git worktree prune without a process restart. Profile cached for the whole session; stale registrations still count. Never rove.";
  }
  if (result.verdict === "globbed") {
    return "Clew globbed. Recursive deny globs expanded per-file into bwrap binds.";
  }
  return "Clew refuse. A working-size coil is not a hold.";
}

export async function handle(payload = {}, env = process.env) {
  const result = decide(payload);
  const sinks = await fire(result, env);
  const deny = shouldDeny(result);
  return {
    hook_event_name: "UserPromptSubmit",
    permissionDecision: deny ? "deny" : "allow",
    hookSpecificOutput: {
      hookEventName: "UserPromptSubmit",
      permissionDecision: deny ? "deny" : "allow",
      decision: {
        behavior: deny ? "deny" : "allow",
        message: deny
          ? denyMessage(result)
          : "Clew rove. Working-size clew. Spawn lives. Idle word is rove.",
        interrupt: deny,
      },
    },
    ...result,
    sinks: sinks.events,
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

export function listen(port = 9090) {
  const server = createServer(async (req, res) => {
    if (req.method === "OPTIONS") {
      send(res, 204, { ok: true });
      return;
    }
    if (req.method === "GET" && (req.url === "/" || req.url === "/health")) {
      send(res, 200, {
        ok: true,
        product: "clew",
        hook: "UserPromptSubmit",
        verbs: "rove|fouled|overcoiled|choked|twinned|swollen|jammed|pruned|cached|globbed",
      });
      return;
    }
    if (req.method !== "POST") {
      send(res, 405, { ok: false, error: "POST a clew action { action, clew? }." });
      return;
    }
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const raw = Buffer.concat(chunks).toString("utf8").trim();
    let payload = {};
    try {
      payload = raw ? parsePayload(raw) : {};
    } catch {
      send(res, 400, { ok: false, error: "JSON body required." });
      return;
    }
    const out = await handle(payload);
    send(res, 200, out);
  });
  server.listen(port, "127.0.0.1", () => {
    process.stderr.write(`clew hook listening on http://127.0.0.1:${port}\n`);
  });
  return server;
}

const asCli = Boolean(process.argv[1]) && import.meta.url === pathToFileURL(process.argv[1]).href;
if (asCli) {
  const listenFlag = process.argv.includes("--listen");
  if (listenFlag) {
    const port = Number(process.argv[process.argv.indexOf("--listen") + 1] || 9090);
    listen(Number.isFinite(port) ? port : 9090);
  } else {
    const fileArg = process.argv.slice(2).find((arg) => !arg.startsWith("--"));
    let payload;
    if (fileArg) {
      payload = parsePayload(readFileSync(fileArg, "utf8"));
    } else {
      payload = await readStdin();
    }
    const out = await handle(payload);
    process.stdout.write(`${JSON.stringify(out)}\n`);
  }
}
