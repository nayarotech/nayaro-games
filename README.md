# Nayaro Games

The browser gaming home of Nayaro Technology. Next.js App Router, TypeScript, Tailwind CSS 4, locally hosted fonts and a typed game catalog. MergeFinity is the only released game. No accounts, database, analytics or third-party scripts.

## Local development

Use Node.js 24 LTS and npm. From this directory:

```sh
npm ci
npm run dev
```

Open http://localhost:3000. Game traffic normally proxies the existing public MergeFinity deployment, so internet access is needed on first visit. For isolated integration testing, `npm run test:e2e` starts a read-only server for `../MergeFinity/dist` and a separate hub on port 4173. Set `GAME_DIST` to an absolute build directory if your checkout differs. Do not point `MERGEFINITY_ORIGIN` at an untrusted origin: its game executes under the hub origin.

```sh
npm run lint
npm run typecheck
npm test
npm run build
npm start
npm run test:e2e
```

Install Chromium with `npx playwright install chromium` if needed. Browser tests require a pre-existing MergeFinity production build, but unit checks and the hub build are self-contained. The lockfile records compatible versions. TypeScript 6 and ESLint 9 are selected for compatibility with the installed Next.js ESLint toolchain; re-evaluate together when upgrading.

## Project map

```text
app/                  Homepage, launch page, 404, metadata, sitemap and robots
  mergefinity/sw.js/  Isolated service-worker compatibility adapter
components/           Navigation, footer, game cards, badges, featured section
lib/games.ts          Typed game registry
lib/integration.ts    Checked upstream worker transformation
public/               Nayaro brand, licensed fonts, gameplay screenshot and SVG icon
scripts/              Read-only local game fixture server
tests/               Registry and worker contract checks; upstream worker fixture
e2e/                 Desktop/mobile browser integration tests
 docs/                Architecture, deployment, adding games and verification
```

The homepage and launch pages are prerendered. Game documents/assets are fetched from the independent MergeFinity Vercel project through a fallback rewrite. A small dynamic route adapts its service worker to avoid intercepting hub navigation. No gameplay source is bundled into the hub or modified in the sibling project.

See [architecture](docs/ARCHITECTURE.md), [deployment and DNS](docs/DEPLOYMENT.md), [adding games](docs/ADDING_GAMES.md), and [verification](docs/TESTING.md). The owner-approved deployment is live at https://games.nayaro.tech; https://nayaro-games.vercel.app also remains available. Custom-domain DNS and HTTPS have been verified.
