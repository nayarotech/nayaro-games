// Match the inspected upstream worker deliberately; fail closed if its contract changes.
export function adaptWorker(source: string): string {
  const cache = /const CACHE = "(mergefinity-[a-zA-Z0-9-]+)";/;
  const guard = 'event.request.method !== "GET" ||';
  const cleanup = 'key.startsWith("mergefinity-")';
  if (
    !cache.test(source) ||
    !source.includes(guard) ||
    !source.includes(cleanup) ||
    !source.includes("const ASSETS =")
  ) {
    throw new Error(
      "Upstream service worker contract changed; review the adapter before enabling offline play.",
    );
  }
  return source
    .replace(cache, 'const CACHE = "nayaro-hub-$1";')
    .replace(cleanup, 'key.startsWith("nayaro-hub-mergefinity-")')
    .replace(
      guard,
      `${guard}
    !new URL(event.request.url).pathname.startsWith(new URL(self.registration.scope).pathname) ||`,
    );
}
