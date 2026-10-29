# Verification record

Executed locally on October 28, 2026 using Node.js 24.22.1.

| Check                         | Result                                                                                                                           |
| ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `npm run lint`                | Passed                                                                                                                           |
| `npm run typecheck`           | Passed                                                                                                                           |
| `npm test`                    | 2 passed: registry integrity and upstream worker contract/isolation                                                              |
| `npm run build`               | Passed: production Next.js webpack build, prerendered catalog/launch/SEO routes and dynamic worker adapter                       |
| `npm run test:e2e`            | 4 passed in Chromium desktop and iPhone-sized Chromium using the untouched sibling production game build through the local proxy |
| `E2E_LIVE=1 npm run test:e2e` | 4 passed against the local production hub using the real public MergeFinity upstream                                             |
| Public game comparison        | Existing public HTML and generated service worker matched the inspected local build byte for byte                                |

Browser coverage includes title, keyboard skip link, catalog navigation, save-origin notice, real play link, unknown/unreleased route 404s, sitemap, robots, generated PNG social artwork, responsive layouts (including 320, 768 and 1440px bounds), slash normalization, JS/CSS/font/game asset loading, worker scope/MIME/cache headers, keyboard gameplay, localStorage persistence through reload, offline reload and gameplay, fetches outside worker scope, and full document navigation back to an uncontrolled hub. Browser errors and HTTP failures are asserted absent during the game scenario. Desktop/mobile full-page screenshots were also visually inspected.

The local fixture reads `../MergeFinity/dist` without rebuilding or changing it. `GAME_DIST` can override that path. Unit tests carry a snapshot of the generated upstream worker in `tests/fixtures/`; update the fixture and adapter together when the upstream contract changes.

To repeat verification with the live upstream (read-only network requests):

```sh
npm run build
E2E_LIVE=1 npm run test:e2e
```

Browser processes and local ports may require execution permissions in a restricted sandbox. The first sandboxed dependency/server attempts were blocked by network/process restrictions; permitted reruns completed. The initial lint toolchain required compatible TypeScript/ESLint versions. Desktop decorative overflow and a 320px grid sizing issue were fixed and retested. These failures are not presented as passing runs.

## Remaining deployment verification

No hosted preview/production deployment, DNS changes, certificate issuance, Vercel edge caching checks, production-origin save migration, upstream release/rollback exercise or multi-version worker-update test was performed. Existing cross-origin saves intentionally do not migrate. The game remains independently deployed at its original URL.

Browser tests use Chromium, including mobile emulation; physical devices and Safari/WebKit/Firefox were not tested for this hub. There is no Lighthouse score or formal WCAG audit claim. Offline behavior depends on successful first online precaching and browser storage policy. Review the deployment checklist before release.

## Brand alignment update

Replaced the initial green/cream theme with the published Nayaro light palette and added locally hosted IBM Plex Sans for body text. After this update, lint, type checking, the production build and all four local desktop/mobile Chromium browser tests passed. Desktop screenshots were inspected; responsive checks include 320px, 768px and 1440px widths. The favicon, cover illustration and social image were recolored alongside the CSS tokens. This update did not change game integration logic or publish a deployment.

## Copy and layout cleanup

Removed promotional slogans, repeated feature claims, floating-tile hero artwork, decorative stars, artificial game counters and trailing punctuation accents. The homepage now identifies the platform, lists the game and its modes, and gives brief future-release and company information. The game cover is an actual Classic board screenshot captured through the production hub proxy; MergeFinity source was not changed. SEO copy, the launch page and 404 page were updated to use the same plain language. The running user development server was left untouched; verification used a separate local production server.

## Final local release check — October 28, 2026

Verified the latest hero with left-aligned copy and the Nayaro Games controller/browser SVG on the right. The controller is platform artwork; the featured game card continues to use an actual MergeFinity board screenshot.

- `npm run lint`: passed.
- `npm run typecheck`: passed.
- `npm test`: 2 passed.
- `npm run build`: passed.
- `E2E_LIVE=1 npm run test:e2e`: all 4 desktop/mobile Chromium tests passed against the local production hub and public MergeFinity upstream.
- Reviewed final desktop/mobile screenshots: controller and game cover render, desktop uses two columns, mobile stacks the hero, and no horizontal overflow was detected at 320px, 768px or 1440px.
- Navigation, unavailable routes, SEO endpoints, game assets, worker scope/headers, progress persistence, offline reload and return navigation passed the existing browser scenarios.

No application fixes were needed during this check. Test servers were stopped by Playwright. No deployment, Vercel project creation, domain assignment or DNS change was performed. Hosted edge routing/caching and HTTPS remain part of the preview/production deployment checks above.

## Vercel preview attempt — October 28, 2026

The owner authorized creating the separate `nayaro-games` project in `nayarotech-ctrl` and deploying a preview. The project was created and the local folder linked to it. Existing `mergefinity`, `nayaro-tech`, and unrelated projects were not modified; no custom domain or DNS changes were made.

Vercel classified the new project's first deployment as production despite explicit CLI preview targeting. Retrying with `--environment preview` and a direct API `target: staging` reproduced the override. All three new deployment attempts were removed. The first attempt briefly received the generated `nayaro-games.vercel.app` alias before removal; no company custom domain was assigned. The first build reached READY before removal, but no hosted game/browser verification was completed.

The project remains available for a subsequent deployment. A proposed workaround is an explicitly staged initial production deployment with automatic domain assignment disabled, followed by a normal preview deployment. This differs from the authorized preview-only operation and requires owner approval before execution. Do not repeatedly recreate first deployments expecting the explicit preview flag to prevent Vercel's override. Relevant upstream report: https://github.com/vercel/vercel/issues/17069.

## Authorized production deployment — October 28, 2026

After reviewing the preview-target issue, the owner explicitly approved deploying the site. The separate `nayarotech-ctrl/nayaro-games` project deployed successfully with status READY:

- Public URL: https://nayaro-games.vercel.app
- Deployment URL: https://nayaro-games-8zk5r2w8q-nayarotech-ctrl.vercel.app
- Deployment ID: `dpl_CdbBHU1sJTYp3pFmTVAvxxqmEt41`
- Dashboard: https://vercel.com/nayarotech-ctrl/nayaro-games/CdbBHU1sJTYp3pFmTVAvxxqmEt41

Executed all four existing browser scenarios against the public production URL in desktop and mobile Chromium; **4 passed**. Hosted checks covered the catalog, responsive bounds, navigation, 404s, sitemap/robots/social image, game asset loading through the Vercel rewrite, scoped worker headers, gameplay, saved progress across refresh, offline reload and return navigation. The public production alias was accessible without adding a protection bypass or changing deployment protection.

This supersedes the earlier local-only status: Vercel production build and hosted integration are now verified. `games.nayaro.tech` remains unassigned; no DNS changes were made. Existing company/game projects were not modified. Custom-domain HTTPS, upstream release/rollback, multi-version worker lifecycle and non-Chromium/device testing remain unverified.

## Custom-domain preparation — October 28, 2026

Attached `games.nayaro.tech` to the correct new `nayaro-games` project and confirmed domain ownership. Vercel's configuration check found no current CNAME/A records or conflicts, and supplied the project-specific CNAME documented in `DEPLOYMENT.md`. GoDaddy DNS access is not connected; saving that CNAME remains a manual step. Custom-domain DNS propagation, HTTPS and browser tests are pending that change. No company website records or nameservers were changed.

## Custom-domain verification complete — October 28, 2026

Verified https://games.nayaro.tech after the owner saved its CNAME. Vercel reported `configured-correctly`, ownership verified, no conflicts, and the expected project-specific CNAME.

The first four browser scenarios failed before reaching the application because HTTPS connections closed during TLS setup. Vercel's certificate list had no entry for this subdomain. Issued the missing certificate through Vercel; issuance succeeded, and a subsequent HTTPS request returned HTTP 200 with certificate verification enabled.

Reran all four existing desktop/mobile Chromium scenarios against the custom domain: **4 passed**. Coverage included navigation, 320/768/1440px responsive bounds, 404s, metadata endpoints, proxied game assets, worker scope/headers, gameplay, save persistence, offline refresh, and returning to the hub. This resolves the earlier pending custom-domain DNS/TLS/browser checks. Upstream release/rollback, multi-version worker updates and physical/non-Chromium devices remain untested. No company-site DNS records or existing game deployment were changed.
