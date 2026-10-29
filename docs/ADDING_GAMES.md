# Adding games

1. Build and deploy the game independently. Use a unique lowercase hyphenated slug, relative or explicitly prefixed asset paths, scoped workers and unique storage/cache keys. Test the built output under `/<slug>/`, not only at the upstream root.
2. Add artwork in `public/` and a record in `lib/games.ts`, conforming to `Game`. Set `status: 'upcoming'` until verified, `featured: false` as appropriate, and add a real ISO release date only when known. Do not fabricate released games.
3. Add a deliberate external fallback rewrite in `next.config.ts`, from `/<slug>/:path*` to that game's stable deployment origin. Do not rewrite the entire catalog or root asset folders. Hub config changes require a hub build; subsequent game releases do not.
4. Inspect worker navigation fallback, precaching and cache cleanup. Workers must ignore URLs outside their scope, including navigation requests from controlled documents. Adapt only when necessary, with contract tests. Never grant `Service-Worker-Allowed: /` to game workers.
5. Verify assets, font URLs, cold load, refresh, saves, offline mode, update/rollback and leaving the game. A game with client-side routes may require its own explicit SPA fallback. Multiplayer/backend features need a separate architecture review when actually required.
6. Mark the game available and feature it when ready. The registry automatically updates the collection, launch route generation and sitemap; do not hand-edit unrelated homepage components.

Example record (illustrative; do not publish as a real release):

```ts
{
  slug: 'your-game',
  name: 'Your Game',
  description: 'An accurate one-sentence description.',
  cover: '/your-game-cover.svg',
  coverAlt: 'Accurate description of the cover art.',
  genre: 'Puzzle',
  status: 'upcoming',
  gameUrl: '/your-game/',
  featured: false,
}
```

If the game has an older separate domain, set optional `legacyUrl` to show the save-origin migration notice and original-site link. Cover alt text is also driven by the registry.

Use a separate origin for games from untrusted parties. A path is a routing boundary, not a security boundary. Storage namespaces and worker cache ownership must remain distinct across all same-origin games.
