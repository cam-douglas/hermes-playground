type Listener = (payload: unknown) => void;

const globalForBus = globalThis as typeof globalThis & {
  __knockBus?: Set<Listener>;
};

function listeners() {
  if (!globalForBus.__knockBus) globalForBus.__knockBus = new Set();
  return globalForBus.__knockBus;
}

export function publish(payload: unknown) {
  for (const listener of listeners()) {
    try {
      listener(payload);
    } catch {
      // A dropped inbox frame must never block a grant decision.
    }
  }
}

export function subscribe(listener: Listener) {
  listeners().add(listener);
  return () => {
    listeners().delete(listener);
  };
}
