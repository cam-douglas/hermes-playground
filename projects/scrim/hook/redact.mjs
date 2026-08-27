/**
 * Scrim redaction core.
 * Walks tool_result / stdio / jsonl and veils key-shaped tokens
 * before model context, disk, or chat sinks.
 *
 * Forensic id = sha256(normalized secret).hex[0:8]
 * so the same secret matches across two sinks.
 */
import { createHash } from "node:crypto";

export const TOKEN = (family, id) => `[REDACTED:${family}:${id}]`;

export const FAMILIES = [
  {
    id: "gcp_sa",
    severity: "high",
    // Service-account JSON blob with a private_key PEM.
    re: /\{[^{}]*"type"\s*:\s*"service_account"[\s\S]{0,1200}?"private_key"\s*:\s*"-----BEGIN PRIVATE KEY-----[\s\S]+?-----END PRIVATE KEY-----\\n"[\s\S]{0,400}?\}/g,
  },
  { id: "github_fine", severity: "high", re: /github_pat_[A-Za-z0-9_]{20,}/g },
  { id: "github_pat", severity: "high", re: /ghp_[A-Za-z0-9]{20,}/g },
  { id: "github_oauth", severity: "medium", re: /gho_[A-Za-z0-9]{20,}/g },
  { id: "anthropic", severity: "high", re: /sk-ant-[A-Za-z0-9_-]{8,}/g },
  { id: "openrouter", severity: "high", re: /sk-or-v1-[A-Za-z0-9]{16,}/g },
  { id: "stripe_live", severity: "high", re: /sk_live_[A-Za-z0-9]{16,}/g },
  { id: "stripe_whsec", severity: "medium", re: /whsec_[A-Za-z0-9]{16,}/g },
  { id: "openai", severity: "high", re: /sk-[A-Za-z0-9]{20,}/g },
  {
    id: "azure",
    severity: "high",
    re: /(?:AZURE[_A-Z0-9]*KEY|AccountKey|SharedKey)\s*[=:]\s*([A-Za-z0-9+/=]{32,})/gi,
  },
  {
    id: "bearer",
    severity: "high",
    re: /(?:Authorization:\s*)?Bearer\s+[A-Za-z0-9._\-+/=]{16,}/gi,
  },
];

export function forensicId(secret) {
  return createHash("sha256").update(String(secret), "utf8").digest("hex").slice(0, 8);
}

export function normalizeSecret(family, match) {
  if (family === "bearer") return match.replace(/^[\s\S]*?Bearer\s+/i, "");
  if (family === "azure") {
    const labeled = /(?:AZURE[_A-Z0-9]*KEY|AccountKey|SharedKey)\s*[=:]\s*/i;
    return match.replace(labeled, "");
  }
  return match;
}

function pushFinding(findings, family, severity, secret, sink) {
  const id = forensicId(secret);
  let row = findings.find((item) => item.id === id && item.family === family);
  if (!row) {
    row = { id, family, severity, count: 0, sinks: [], prefix: secret.slice(0, 12) };
    findings.push(row);
  }
  row.count += 1;
  if (sink && !row.sinks.includes(sink)) row.sinks.push(sink);
  return id;
}

function sinkOf(path) {
  const joined = path.join(".");
  if (/jsonl|transcript|message/i.test(joined)) return "jsonl";
  if (/tool_result|tool_response|stdout|stdio|content/i.test(joined)) return "stdio";
  return path.length ? path[path.length - 1] : "payload";
}

export function redactString(text, findings = [], path = []) {
  if (typeof text !== "string" || !text) return text;
  let out = text;
  const sink = sinkOf(path);
  for (const family of FAMILIES) {
    const re = new RegExp(family.re.source, family.re.flags);
    out = out.replace(re, (match) => {
      if (match.includes("[REDACTED:")) return match;
      const secret = normalizeSecret(family.id, match);
      const id = pushFinding(findings, family.id, family.severity, secret, sink);
      if (family.id === "azure") {
        const label = match.slice(0, match.length - secret.length);
        return `${label}${TOKEN(family.id, id)}`;
      }
      return TOKEN(family.id, id);
    });
  }
  return out;
}

export function redactValue(value, findings = [], path = []) {
  if (typeof value === "string") {
    // A jsonl blob: redact each line, keep structure.
    if (value.includes("\n") && /"tool_result"|"tool_use"|hook_event_name/.test(value)) {
      return value
        .split("\n")
        .map((line, i) => redactString(line, findings, path.concat(`line${i}`)))
        .join("\n");
    }
    return redactString(value, findings, path);
  }
  if (Array.isArray(value)) {
    return value.map((item, i) => redactValue(item, findings, path.concat(String(i))));
  }
  if (value && typeof value === "object") {
    const out = {};
    for (const [key, item] of Object.entries(value)) {
      out[key] = redactValue(item, findings, path.concat(key));
    }
    return out;
  }
  return value;
}

export function maskForDemo(text) {
  if (typeof text !== "string" || !text) return text;
  let out = text;
  for (const family of FAMILIES) {
    const re = new RegExp(family.re.source, family.re.flags);
    out = out.replace(re, (match) => {
      const secret = normalizeSecret(family.id, match);
      if (secret.length <= 16) return `${secret.slice(0, 8)}···`;
      const shown = `${secret.slice(0, 12)}···${secret.slice(-4)}`;
      if (family.id === "azure") {
        const label = match.slice(0, match.length - secret.length);
        return `${label}${shown}`;
      }
      if (family.id === "bearer") {
        return match.replace(secret, shown);
      }
      return shown;
    });
  }
  return out;
}

export function highestSeverity(findings) {
  if (findings.some((row) => row.severity === "high")) return "high";
  if (findings.length) return "medium";
  return "clean";
}

// Assembled at runtime so the repo never stores a contiguous scanner-shaped token.
const D = "DEMO";
export const SEED_SECRETS = {
  anthropic: "sk-ant-" + D + "00000000000000000000000AAA",
  openai: "sk-" + D + "0000000000000000000000000BBB",
  openrouter: "sk-or-v1-" + D + "0000000000000000000000CCC",
  stripe: "sk_live_" + D + "000000000000000000000DDD",
  whsec: "whsec_" + D + "0000000000000000000000EEE",
  ghp: "ghp_" + D + "000000000000000000000000FFF1",
  gho: "gho_" + D + "000000000000000000000000GGG1",
  gfpat: "github_pat_" + D + "0000000000000000_HHHHHHHHHH",
  bearer: D + "GATEWAYTOKEN000000000000III",
  azure: D + "AZURE0000000000000000000000KEYJJJ",
};

export function seedPayload() {
  const s = SEED_SECRETS;
  const stdio = [
    "2026-08-24T14:11:02Z mcp.gateway Authorization: Bearer " + s.bearer,
    "AZURE_OPENAI_API_KEY=" + s.azure,
    "ANTHROPIC_API_KEY=" + s.anthropic,
    "OPENAI_API_KEY=" + s.openai,
    "OPENROUTER_API_KEY=" + s.openrouter,
    "STRIPE_SECRET_KEY=" + s.stripe,
    "STRIPE_WEBHOOK_SECRET=" + s.whsec,
    "GITHUB_TOKEN=" + s.ghp,
    "GITHUB_OAUTH=" + s.gho,
    "GITHUB_FINE=" + s.gfpat,
    'GCP_SA={"type":"service_account","project_id":"scrim-demo","private_key_id":"demo0001","private_key":"-----BEGIN PRIVATE KEY-----\\nDEMO-NOT-A-REAL-KEY\\n-----END PRIVATE KEY-----\\n","client_email":"scrim-demo@scrim-demo.iam.gserviceaccount.com"}',
  ].join("\n");

  // Same ghp_ appears again in a transcript jsonl line — two sinks, one forensic id.
  const jsonl = [
    `{"type":"tool_result","tool":"Read","file":"~/.claude/projects/acme-prod/agent-stdio.log","content":"token=${s.ghp} leaked 8× into world-readable agent-stdio.log"}`,
    `{"type":"assistant","content":"Codex rotated ACR/Postgres/Azure OpenAI after the keys hit tool traces. AZURE_OPENAI_API_KEY=${s.azure}"}`,
  ].join("\n");

  return {
    hook_event_name: "PostToolUse",
    tool_name: "Read",
    tool_input: {
      file_path: "/home/ubuntu/.claude/projects/acme-prod/agent-stdio.log",
    },
    tool_result: {
      type: "text",
      content: stdio,
    },
    transcript_tail: jsonl,
    _scrim_note:
      "SYNTHETIC demo only. Every token carries DEMO. Evidence: openai/codex#40378, github/gh-aw#25103, anthropics/claude-code#63593.",
  };
}

export function scrub(payload) {
  const findings = [];
  const redacted = redactValue(payload, findings);
  return {
    ok: true,
    clean: findings.length === 0,
    severity: highestSeverity(findings),
    findings,
    redacted,
  };
}
