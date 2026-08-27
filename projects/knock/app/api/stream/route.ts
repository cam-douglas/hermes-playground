import { subscribe } from "@/lib/bus";
import { listPublicKnocks, statusPayload, sweep } from "@/lib/engine";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  await sweep();
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const send = (payload: unknown) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(payload)}\n\n`));
      };
      send({ type: "hello", at: Date.now(), knocks: await listPublicKnocks(), status: statusPayload() });
      const unsubscribe = subscribe((payload) => send(payload));
      const heartbeat = setInterval(() => {
        send({ type: "tick", at: Date.now() });
      }, 4000);
      const closer = () => {
        clearInterval(heartbeat);
        unsubscribe();
        try {
          controller.close();
        } catch {
          // already closed
        }
      };
      // Best-effort: close after a preview-friendly window; the inbox reconnects.
      setTimeout(closer, 50_000);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
