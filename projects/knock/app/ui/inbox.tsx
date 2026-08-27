"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type KnockEvent = { at: number; adapter: string; summary: string };
type Knock = {
  id: string;
  status: "pending" | "allowed" | "denied" | "timed_out";
  toolName: string;
  argHash: string;
  agentId: string;
  runId: string;
  reason: string;
  createdAt: number;
  expiresAt: number;
  ttlSeconds: number;
  remainingMs: number;
  decidedBy: string | null;
  grant: { scope: string } | null;
  events: KnockEvent[];
};

type Status = {
  demo: boolean;
  persistence: string;
  note: string;
};

function fmt(ms: number) {
  const s = Math.max(0, Math.ceil(ms / 1000));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

export function Inbox() {
  const [knocks, setKnocks] = useState<Knock[]>([]);
  const [selected, setSelected] = useState<string>("");
  const [status, setStatus] = useState<Status | null>(null);
  const [error, setError] = useState("");
  const [now, setNow] = useState(Date.now());

  async function refresh() {
    const [listRes, statusRes] = await Promise.all([fetch("/api/knocks", { cache: "no-store" }), fetch("/api/status", { cache: "no-store" })]);
    if (!listRes.ok) throw new Error(`inbox ${listRes.status}`);
    const list = (await listRes.json()) as { knocks: Knock[] };
    const nextStatus = (await statusRes.json()) as Status;
    setKnocks(list.knocks);
    setStatus(nextStatus);
    setSelected((current) => current || list.knocks.find((item) => item.status === "pending")?.id || list.knocks[0]?.id || "");
  }

  useEffect(() => {
    refresh().catch((err) => setError(err instanceof Error ? err.message : "inbox failed"));
    const tick = setInterval(() => setNow(Date.now()), 1000);
    const poll = setInterval(() => {
      refresh().catch(() => undefined);
    }, 2500);
    let source: EventSource | null = null;
    try {
      source = new EventSource("/api/stream");
      source.onmessage = () => {
        refresh().catch(() => undefined);
      };
    } catch {
      // polling covers serverless hosts that drop SSE
    }
    return () => {
      clearInterval(tick);
      clearInterval(poll);
      source?.close();
    };
  }, []);

  const active = useMemo(() => knocks.find((item) => item.id === selected) || knocks[0], [knocks, selected]);
  const remaining = active ? Math.max(0, active.expiresAt - now) : 0;
  const pct = active && active.status === "pending" ? (remaining / (active.ttlSeconds * 1000)) * 100 : 0;

  async function decide(decision: "allow" | "deny") {
    if (!active) return;
    const response = await fetch(`/api/knocks/${active.id}/decide`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ decision, actor: "you" }),
    });
    if (!response.ok) setError(`decide ${response.status}`);
    await refresh();
  }

  async function create(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const response = await fetch("/api/knocks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        hook_event_name: "PermissionRequest",
        tool_name: data.get("toolName"),
        tool_input: { demo: true, reason: data.get("reason") },
        agent_id: data.get("agentId"),
        run_id: data.get("runId") || undefined,
        reason: data.get("reason"),
        ttl_seconds: Number(data.get("ttlSeconds") || 120),
      }),
    });
    const json = await response.json();
    if (!response.ok) {
      setError(json.error || "create failed");
      return;
    }
    setSelected(json.knock.id);
    await refresh();
  }

  return (
    <>
      <header className="top">
        <div className="brand">
          <div className="knocker" aria-hidden="true" />
          <div>
            <h1>Knock.</h1>
            <p className="lede">
              The call already fired. The harness gate said no. Knock gets a human on the line before the run dies waiting.
            </p>
          </div>
        </div>
        <div className="mode">
          {status?.demo ? "Demo mode · adapters simulated" : "Live adapters"} · {status?.persistence || "store"}
        </div>
      </header>
      <main className="grid">
        <aside className="rail">
          <p className="section-label">Inbox</p>
          {knocks.map((knock) => (
            <button
              key={knock.id}
              className={`item ${knock.id === active?.id ? "active" : ""}`}
              onClick={() => setSelected(knock.id)}
              type="button"
            >
              <div className="who">
                {knock.agentId} · {knock.runId}
              </div>
              <div className="tool">{knock.toolName}</div>
              <span className={`pill ${knock.status}`}>{knock.status.replace("_", " ")}</span>
            </button>
          ))}
          <form onSubmit={create}>
            <p className="section-label">New knock</p>
            <label>
              Tool <input name="toolName" defaultValue="mcp__github__push_files" required />
            </label>
            <label>
              Agent <input name="agentId" defaultValue="subagent-review" required />
            </label>
            <label>
              Run <input name="runId" placeholder="auto" />
            </label>
            <label>
              Reason <textarea name="reason" rows={2} defaultValue="Classifier denied MCP. No per-run grant." />
            </label>
            <label>
              TTL seconds <input name="ttlSeconds" type="number" min={8} max={600} defaultValue={120} />
            </label>
            <button className="btn ghost" type="submit">
              Knock the gate
            </button>
          </form>
        </aside>
        <section className="stage">
          {error ? <p className="error">{error}</p> : null}
          {active ? (
            <>
              <p className="section-label">Active knock</p>
              <div className="ring-wrap">
                <div className="ring" style={{ ["--pct" as string]: pct }}>
                  <div>
                    <div className="ttl">
                      {active.status === "pending" ? fmt(remaining) : active.status.replace("_", " ")}
                      <small>{active.status === "pending" ? "THEN DENY" : active.decidedBy || ""}</small>
                    </div>
                  </div>
                </div>
                <div>
                  <h2 style={{ margin: "0 0 8px", letterSpacing: "-0.04em" }}>{active.toolName}</h2>
                  <p style={{ margin: 0, color: "var(--muted)" }}>{active.reason}</p>
                </div>
              </div>
              <div className="meta">
                <div className="row">
                  <span>Agent</span>
                  <code>{active.agentId}</code>
                </div>
                <div className="row">
                  <span>Run</span>
                  <code>{active.runId}</code>
                </div>
                <div className="row">
                  <span>Arg hash</span>
                  <code>{active.argHash}</code>
                </div>
                <div className="row">
                  <span>Grant</span>
                  <code>{active.grant?.scope || "none"}</code>
                </div>
              </div>
              <div className="actions">
                <button className="btn allow" type="button" disabled={active.status !== "pending"} onClick={() => decide("allow")}>
                  Let this run through
                </button>
                <button className="btn deny" type="button" disabled={active.status !== "pending"} onClick={() => decide("deny")}>
                  Keep the gate shut
                </button>
              </div>
            </>
          ) : (
            <p className="thesis">No knocks yet.</p>
          )}
        </section>
        <aside className="ledger">
          <p className="section-label">Grant ledger + adapters</p>
          {(active?.events || [])
            .slice()
            .reverse()
            .map((event, index) => (
              <div className="event" key={`${event.at}-${index}`}>
                <b>{event.adapter}</b>
                <div>{event.summary}</div>
                <time>{new Date(event.at).toISOString()}</time>
              </div>
            ))}
          <p className="thesis">
            {status?.note ||
              "Not a proxy. Knock sits inside the permission gate: allow is scoped to this run, timeout denies loud."}
          </p>
        </aside>
      </main>
    </>
  );
}
