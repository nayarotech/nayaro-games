# Architecture

## Inspection and decision

Inspected `../MergeFinity` package/build scripts, Vite configuration, React/Phaser entry points, persistence modules, public assets, service worker, worker-versioning script, built output and existing browser tests. No sibling files were changed.

The inspected project uses React 19.3.1, Phaser 4.2.1, Vite 8.3.5, TypeScript 6 and Tailwind 4.3.3. `npm run build` type-checks, builds with Vite, then fingerprints the complete app shell and enumerates lazy chunks in `scripts/version-sw.mjs`. Release scripts perform unit/browser verification and retain versioned release packages. Existing production URL: https://mergefinity.vercel.app.

Vite `base: './'` emits relative HTML script, stylesheet, icon and branding paths. Although source font URLs are root-relative, the inspected production CSS rewrites them to `../fonts/...` and the built preload is `./fonts/...`. The existing build therefore works beneath `/mergefinity/` without root asset aliases or source edits. This is a build contract to verify after game tooling updates.

Selected architecture: a Next.js catalog with an external fallback rewrite, equivalent to a small multi-zone setup. Vercel owns the one public domain; each game keeps its own release/deployment lifecycle. No iframe, game-source monorepo bundle, duplicate release upload or generic open proxy. Full document anchors cross the game boundary; Next client navigation is used inside the hub.

```text
 games.nayaro.tech             nayaro-games Vercel project
   /                          static catalog
   /play/mergefinity/         static launch/save information
   /mergefinity/sw.js         checked worker adapter (dynamic)
   /mergefinity/*             rewrite → mergefinity.vercel.app/*
                              existing independent Vercel project
```

`next.config.ts` is the routing source of truth. Rewrites run as fallbacks so the real worker route wins; unknown non-game routes return the hub's 404. Next normalizes `/mergefinity` to `/mergefinity/`, required for relative asset resolution. There are no gameplay deep links in the inspected game; only `/mergefinity/` is a supported entry point. Missing game assets retain upstream status behavior. Future SPA games with deep links need their own base-aware fallback and tests, not a blanket hub catch-all.

A new upstream game deployment takes effect through the stable game alias without rebuilding the hub. Adding another game route or changing an origin requires a hub configuration deployment. `MERGEFINITY_ORIGIN` is a server-controlled override for QA; production should use the default stable HTTPS origin. Keep games public for proxy access, or separately design deployment-protection bypass; no secrets are handled by this implementation.

## Offline and worker boundary

The upstream worker caches its shell, lazy Phaser/board chunks, fonts and icon. It registers relative to the document, yielding `/mergefinity/sw.js` and scope `/mergefinity/`. Its original navigation fallback is unsafe when an already controlled game document navigates outside that path: it can return the game shell for `/`.

`app/mergefinity/sw.js/route.ts` fetches the current upstream worker without caching. `lib/integration.ts` checks the known source structure and applies two narrowly scoped changes: cache names/cleanup gain a hub-specific namespace, and requests outside the registration pathname are ignored. The game keeps its upstream content fingerprint, precache list, install lifecycle and gameplay. The adapter returns JavaScript with `Cache-Control: no-store` and `Service-Worker-Allowed: /mergefinity/`. It cannot claim the catalog root. The hub registers no worker.

If the upstream worker contract changes or fetch fails, this endpoint returns 502 and a new worker does not install. Online play remains available. Existing installed workers may continue serving a previous cached game until a successful update. Maintain this small adapter alongside the game worker contract; tests include a copy of the inspected generated worker. The copy is a test fixture, never a deployed game release.

The worker is cache-first. New workers wait while old controlled tabs remain open; close all game tabs and reopen online to activate an update. We deliberately retain the game's no-force-update behavior to avoid swapping chunks mid-session. Browser eviction, private browsing or blocked workers can prevent offline play. No offline guarantee is made for the catalog or launch page. Never clear all site storage as an update strategy.

A game deployment can race with first-time worker installation: old HTML/worker references may outlive an upstream hashed asset. Retain assets/release rollback options and verify first visits following a deployment. A failed precache should leave online play available and allow a later install retry.

## Saves and trust

Saves use localStorage keys `mergefinity.v1`, `mergefinity.daily.v1`, `mergefinity.rush.v1`, `mergefinity.limited.v1`, plus onboarding `mergefinity.guide.v1`. Progress remains across reloads and game deployments as long as game schemas stay compatible. Browsers can clear storage; no cloud backup exists.

`mergefinity.vercel.app` and `games.nayaro.tech` are different storage origins. Existing saves remain on the original site and do not automatically move. The launch page explains this and provides a direct original-site link. There is no cross-origin save import or automatic data transfer. Preview URLs also have separate saves.

Paths do not isolate storage or JavaScript privileges. All games proxied under this domain must be trusted Nayaro code, use unique localStorage/cache namespaces and keep workers scoped to their own path. Host untrusted third-party games on separate origins instead. Future multiplayer backends may have separate CORS, WebSocket and authentication needs; none are implemented or implied here.

## UI, assets and SEO

The registry drives cards, available launch routes and sitemap entries. Unreleased/unknown launch slugs return 404. Upcoming content is an editorial placeholder with no invented game names, release dates or active play links. Slug, description, cover, genre, status, URL, featured flag and optional release date have a central type.

Actual Nayaro PNG branding and Archivo/IBM Plex Mono font files came from the game, with their license texts retained. Fonts use `next/font/local` and self-hosted build assets. The game card uses a screenshot of the current MergeFinity Classic board captured through the local hub proxy. Semantic landmarks, focus outlines, skip navigation, reduced-motion support and responsive card layouts are built in. PNG Open Graph artwork is generated locally by Next's ImageResponse; canonical metadata, sitemap and robots point to the intended production domain.

Sources: [Next.js installation](https://nextjs.org/docs/app/getting-started/installation), [Vercel external rewrites](https://vercel.com/docs/routing/rewrites). Dependencies were resolved from the registry and locked locally; current compatibility was verified by executed checks documented separately.

## Brand alignment

The hub uses Nayaro's published light-theme tokens from https://nayaro.tech: blue `#1F5EFF`, navy text `#111726`, background `#F7F8FA`, white surfaces, muted text `#4F5A68`, and borders `#DCE2EA`. These semantic tokens are centralized in `app/globals.css` and applied across navigation, buttons, illustrations, badges, and launch pages. The favicon and generated social image use the same palette; the game cover shows the actual game board. Archivo is the display typeface, IBM Plex Sans is the locally hosted body font, and IBM Plex Mono provides labels. The body font was obtained from the company site's published font asset; its SIL Open Font License is retained in `public/fonts/IBMPlexSans-OFL.txt`. This replaces the initial green/cream visual direction. The game itself retains its independent styling.
