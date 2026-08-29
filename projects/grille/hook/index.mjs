#!/usr/bin/env node
/**
 * Grille desk hook. A night drop through
 * the slot is not a hold. Score the
 * grille or admit posted.
 *
 *   echo '{"bypassDirectivePresent":true,"bashWriteCapable":true}' | node index.mjs
 *   node index.mjs grille.json
 *   node index.mjs --listen 9090
 *
 * Env:
 *   GRILLE_SLACK_WEBHOOK  Incoming webhook. Absent → demo "Would post to Slack".
 *   GRILLE_GITHUB_TOKEN   Grille-ledger issue. Absent → demo ledger.
 *   GRILLE_LINEAR_KEY     Slotted / steered / unhooked / killed ticket. Absent → demo row.
 *
 * NOT Stencil / Hasp / Coda / Veto /
 * Tappet / Assay / Spile / Scant / Knock /
 * Gasket / Iota / Blot / Wicket /
 * leftover woodworking. Idle word is
 * posted, never the product name, never
 * empty, never silent / mute / idle / dead.
 */
import { readFileSync } from "node:fs";
import { createServer } from "node:http";
import { stdin } from "node:process";
import { pathToFileURL } from "node:url";
import { fire } from "./adapters.mjs";
import { decide, parseSessionTrace, seedSteered } from "./grille.mjs";

function readStdin() {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stdin.on("data", (chunk) => chunks.push(chunk));
    stdin.on("end", () => {
      const raw = Buffer.concat(chunks).toString("utf8").trim();
      if (!raw) {
        resolve(seedSteered());
        return;
      }
      resolve(parsePayload(raw));
    });
    stdin.on("error", reject);
  });
}

function parsePayload(raw) {
  const text = String(raw || "").trim();
  if (!text) return seedSteered();
  try {
    const parsed = JSON.parse(text);
    if (
      parsed &&
      typeof parsed === "object" &&
      !Array.isArray(parsed) &&
      (parsed.action ||
        parsed.grille ||
        parsed.probe ||
        parsed.bypassDirectivePresent != null ||
        parsed.bashWriteCapable != null ||
        parsed.editWriteUsed != null ||
        parsed.toolUsed != null)
    ) {
      return parsed.action || parsed.grille || parsed.probe
        ? parsed
        : { action: "score", grille: parsed };
    }
    if (Array.isArray(parsed)) {
      return { action: "score", grille: { session: "stdin", scored: true } };
    }
  } catch {
    const grille = parseSessionTrace(text);
    if (
      grille.bypassDirectivePresent ||
      grille.bashWriteCapable ||
      grille.acceptEditsRestored ||
      grille.windowsPlatform
    ) {
      return { action: "score", grille };
    }
    return { error: "unparseable", raw: text };
  }
  const grille = parseSessionTrace(text);
  return { action: "score", grille };
}

function shouldDeny(result) {
  return Boolean(result.alarm);
}

function denyMessage(result) {
  if (result.verdict === "steered") {
    return "Grille steered. Injected bypass/auto directive told the model to prefer Bash for file changes. Diffs vanish. A night drop through the slot is not a hold.";
  }
  if (result.verdict === "slotted") {
    return "Grille slotted. Mutation went through Bash sed / heredoc / python -c / redirect. No Edit/Write card.";
  }
  if (result.verdict === "unreceipted") {
    return "Grille unreceipted. Diffs vanished. User has no visual record of what changed in which file.";
  }
  if (result.verdict === "unhooked") {
    return "Grille unhooked. PreToolUse Write|Edit|NotebookEdit never invoked. Path-deny and paths: frontmatter go blind.";
  }
  if (result.verdict === "killed") {
    return "Grille killed. Windows platform-ungated heredoc/here-string write truncated or failed. 2–3× tokens vs Write.";
  }
  if (result.verdict === "allowlisted") {
    return "Grille allowlisted. Bash(python3 *) / Bash(sed *) allowlist grants unbounded workspace writes with zero prompts.";
  }
  return "Grille refuse. A night drop through the slot is not a hold.";
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
          : "Grille posted. Transaction went through the teller grille. Edit/Write used. Receipt/diff would render. Write|Edit hooks consulted. Idle word is posted.",
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
        product: "grille",
        hook: "UserPromptSubmit",
        verbs: "posted|slotted|steered|unreceipted|unhooked|killed|overlay|ungated|allowlisted|restored",
      });
      return;
    }
    if (req.method !== "POST") {
      send(res, 405, { ok: false, error: "POST a grille action { action, grille? }." });
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
    process.stderr.write(`grille hook listening on http://127.0.0.1:${port}\n`);
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
