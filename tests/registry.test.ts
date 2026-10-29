import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
// Node's native TS loader requires explicit file extensions.
// @ts-expect-error Node strips TypeScript without bundling.
import { games } from "../lib/games.ts";
// @ts-expect-error Node strips TypeScript without bundling.
import { adaptWorker } from "../lib/integration.ts";
test("catalog has unique safe slugs and only the real playable release", () => {
  assert.equal(new Set(games.map((g) => g.slug)).size, games.length);
  for (const game of games) {
    assert.match(game.slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    assert.ok(existsSync(`public${game.cover}`));
    assert.equal(game.gameUrl, `/${game.slug}/`);
  }
  assert.deepEqual(
    games.filter((g) => g.status === "available").map((g) => g.slug),
    ["mergefinity"],
  );
});
test("worker adapter isolates caches, limits interception, and rejects unknown formats", () => {
  const upstream = readFileSync("tests/fixtures/mergefinity-sw.js", "utf8");
  const adapted = adaptWorker(upstream);
  assert.match(adapted, /nayaro-hub-mergefinity-/);
  assert.match(adapted, /self.registration.scope/);
  assert.ok(adapted.includes('key.startsWith("nayaro-hub-mergefinity-")'));
  assert.throws(
    () => adaptWorker('self.addEventListener("fetch", () => {})'),
    /contract changed/,
  );
});
