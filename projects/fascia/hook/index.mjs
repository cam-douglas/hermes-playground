#!/usr/bin/env node
/**
 * Fascia shopfront hook. A misnamed
 * fascia is not a hold. Score the
 * shopfront or admit fronted.
 *
 *   echo '{"dialogNamedPath":"...","actualRunPath":"...","spawnTaskCwd":"..."}' | node index.mjs
 *   node index.mjs fascia.json
 *   node index.mjs --listen 9090
 *
 * Env:
 *   FASCIA_SLACK_WEBHOOK Incoming webhook. Absent → demo "Would post to Slack".
 *   FASCIA_GITHUB_TOKEN  Fascia-ledger issue. Absent → demo ledger.
 *   FASCIA_LINEAR_KEY    Misnamed / trust-lie ticket. Absent → demo row.
 *
 * NOT Wicket / Snib / Iota / Damper /
 * Hasp / Cubby / Quoin / Gaff / Sear /
 * leftover woodworking.
 * Idle word is fronted, never the
 * product name, never empty, never
 * silent / mute / idle / dead /
 * sealed / locked.
 */
import { readFileSync } from "node:fs";
import { createServer } from "node:http";
import { stdin } from "node:process";
import { pathToFileURL } from "node:url";
import { fire } from "./adapters.mjs";
import { decide, parseSessionTrace, seedMisnamed } from "./fascia.mjs";

function readStdin() {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stdin.on("data", (chunk) => chunks.push(chunk));
    stdin.on("end", () => {
      const raw = Buffer.concat(chunks).toString("utf8").trim();
      if (!raw) {
        resolve(seedMisnamed());
        return;
      }
      resolve(parsePayload(raw));
    });
    stdin.on("error", reject);
  });
}

function parsePayload(raw) {
  const text = String(raw || "").trim();
  if (!text) return seedMisnamed();
  try {
    const parsed = JSON.parse(text);
    if (
      parsed &&
      typeof parsed === "object" &&
      !Array.isArray(parsed) &&
      (parsed.action ||
        parsed.fascia ||
        parsed.probe ||
        parsed.dialogNamedPath != null ||
        parsed.actualRunPath != null ||
        parsed.spawnTaskCwd != null ||
        parsed.button != null)
    ) {
      return parsed.action || parsed.fascia || parsed.probe
        ? parsed
        : { action: "score", fascia: parsed };
    }
    if (Array.isArray(parsed)) {
      return { action: "score", fascia: { session: "stdin", scored: true } };
    }
  } catch {
    const fascia = parseSessionTrace(text);
    if (
      fascia.dialogNamedPath ||
      fascia.actualRunPath ||
      fascia.spawnTaskCwd ||
      fascia.button ||
      fascia.namedPathNeverRan
    ) {
      return { action: "score", fascia };
    }
    return { error: "unparseable", raw: text };
  }
  const fascia = parseSessionTrace(text);
  return { action: "score", fascia };
}

function shouldDeny(result) {
  return Boolean(result.alarm);
}

function denyMessage(result) {
  if (result.verdict === "misnamed") {
    return "Fascia misnamed. Trust dialog names spawn_task cwd. Session runs in .claude/worktrees. A misnamed fascia is not a hold.";
  }
  if (result.verdict === "diverted") {
    return "Fascia diverted. Named path is not the run path. Execution landed on a third shopfront.";
  }
  if (result.verdict === "approved-blind") {
    return "Fascia approved-blind. Trust workspace accepted. The directory that ran was never on the certificate.";
  }
  if (result.verdict === "trust-lie") {
    return "Fascia trust-lie. A permanent trust entry was written for a directory no session used as cwd.";
  }
  if (result.verdict === "worktree-elsewhere") {
    return "Fascia worktree-elsewhere. Session sits under .claude/worktrees. The fascia named a different door.";
  }
  return "Fascia refuse. A misnamed fascia is not a hold.";
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
          : "Fascia fronted. Consent label matches the execution site after normalize. The fascia names the door that opens. Idle word is fronted.",
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
        product: "fascia",
        hook: "UserPromptSubmit",
        verbs: "fronted|misnamed|diverted|approved-blind|spawn-cwd|worktree-elsewhere|trust-lie|chip-start|account-split",
      });
      return;
    }
    if (req.method !== "POST") {
      send(res, 405, { ok: false, error: "POST a fascia action { action, fascia? }." });
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
    process.stderr.write(`fascia hook listening on http://127.0.0.1:${port}\n`);
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
