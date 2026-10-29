# Vercel deployment and operations

Nayaro Games is live at https://games.nayaro.tech under `nayarotech-ctrl/nayaro-games`; https://nayaro-games.vercel.app remains available. The owner saved the GoDaddy CNAME, Vercel confirmed the configuration, and HTTPS and hosted game checks passed. The company website and existing game project were not changed. The instructions below document setup and maintenance.

## New project

1. Create/import a **new** project named `nayaro-games` in team `nayarotech-ctrl`. Select this directory as its root and the Next.js preset. Confirm it is not the existing `mergefinity` or `nayaro.tech` project.
2. Select Node.js 24 LTS. Install with `npm ci`, build with `npm run build`. `vercel.json` declares these commands; Next supplies the output directory. Do not use static export: the worker adapter needs a server route.
3. Leave `MERGEFINITY_ORIGIN` unset in production to use `https://mergefinity.vercel.app`. If a preview uses an override, use a trusted public HTTPS build and configure it at build and runtime; rewrites are materialized during the hub build.
4. Deploy a preview first after approval. Check root, `/play/mergefinity/`, slash normalization, game assets, worker MIME/headers, fresh installation, saved progress, offline reload and document navigation back to `/`. Check `/robots.txt`, `/sitemap.xml`, `/opengraph-image` and an unknown route. Ensure the upstream project is accessible to the proxy without authentication.
5. Promote a verified hub build to production only after approval. Keep the MergeFinity project and its existing alias intact.

Optional CLI workflow, to be run manually only after approval:

```sh
npx vercel link --scope nayarotech-ctrl
# Select/create nayaro-games, then inspect .vercel/project.json before proceeding.
npx vercel --scope nayarotech-ctrl
# Review the preview before production:
npx vercel --prod --scope nayarotech-ctrl
```

Do not commit `.vercel/` or credentials. No deployment tokens or third-party services are required in application code.

## Custom domain and GoDaddy DNS

After explicit approval, add `games.nayaro.tech` only to the new `nayaro-games` project's Domains settings. Do not move `nayaro.tech`, change its apex/www records, change nameservers or detach MergeFinity's alias.

In GoDaddy's existing `nayaro.tech` zone, create/update this record using the exact value displayed by Vercel for this project:

| Type  | Name / host | Value                                               | TTL             |
| ----- | ----------- | --------------------------------------------------- | --------------- |
| CNAME | `games`     | **Project-specific target shown in Vercel Domains** | GoDaddy default |

If Vercel requests ownership verification, add the exact TXT name/value it provides. No A record is needed for this subdomain. Resolve conflicts for the `games` host only after inspecting existing records. Vercel uses project-specific CNAME targets; do not guess a generic hostname or point DNS at a URL containing a path.

Wait for Vercel to report a valid configuration and provision HTTPS. Verify the certificate and an HTTPS fresh visit. Vercel handles TLS; no local certificate or application-level HTTPS server is necessary. DNS propagation and HTTPS issuance are unverified until this is actually performed.

References: [Vercel domain setup](https://vercel.com/docs/domains/set-up-custom-domain), [project-specific CNAME guidance](https://vercel.com/docs/domains/working-with-domains/add-a-domain).

## Caching and updates

The hub is prerendered and served using Next/Vercel caching defaults. Its hashed framework/font assets use framework-managed cache policies. Public cover/brand files retain conservative defaults; use a new filename for replacement artwork if long cache lifetimes are added later. No blanket immutable header is applied to game HTML or public unversioned files.

Game HTML and hashed assets flow through the upstream deployment's response semantics and Vercel rewrite behavior. Do not add a long-lived hub cache for game HTML. The worker adapter fetches fresh upstream text and responds `no-store`. Verify actual proxy response headers on preview; production edge behavior cannot be proven by a local Next server.

Update MergeFinity through its existing project/release pipeline. Do not rebuild or upload game code into this hub. Keep relative output paths, worker structure/scope and save-key compatibility intact. Perform the integration smoke tests after each game tooling/worker update. Existing tabs keep their active cached version until the normal worker lifecycle activates a newer release.

## Rollback

For a hub regression, promote the last verified `nayaro-games` deployment using Vercel's deployment controls. Keep the domain assigned to this project. For a game regression, restore the last verified `mergefinity` deployment behind its existing stable alias; the hub rewrite continues targeting that alias. These are independent rollbacks.

Clients with installed workers may keep a cached game until they reconnect and the rollback worker installs/activates. Close game tabs and reopen online; do not delete localStorage. A rollback cannot undo an incompatible save-schema migration—game releases must preserve decode compatibility. Retain existing release artifacts for recovery.

Before production sign-off, verify a new game deployment and an upstream rollback through the hub, as well as worker update behavior with an already open game tab. These operations were not performed locally.

## Custom domain connection status — October 28, 2026

At the owner's request, `games.nayaro.tech` was attached to `nayarotech-ctrl/nayaro-games`. Vercel confirmed ownership (`verified: true`) with no TXT challenge or conflicting records. DNS is managed externally by GoDaddy (`ns07.domaincontrol.com`, `ns08.domaincontrol.com`); the subdomain had no CNAME or A record when inspected.

Vercel returned this exact recommended DNS record:

| Type | Host | Target | TTL |
| --- | --- | --- | --- |
| CNAME | `games` | `785c70cc863c149b.vercel-dns-017.com` | GoDaddy default |

The record still needs to be saved in GoDaddy. No available connected GoDaddy tool was found, so the registrar change was not performed. Existing nameservers, apex/www records, company site, and original MergeFinity deployment were left unchanged. After the record is saved, run `npx vercel domains verify games.nayaro.tech --scope nayarotech-ctrl`, confirm HTTPS, and repeat the hosted browser checks against the custom domain. The production Vercel URL remains available meanwhile.

## Custom domain verified — October 28, 2026

The owner saved the GoDaddy CNAME. Authoritative DNS and Vercel both confirmed `games.nayaro.tech` resolves via `785c70cc863c149b.vercel-dns-017.com`. HTTPS initially failed because no certificate for the subdomain was listed. Requested one with `vercel certs issue games.nayaro.tech --scope nayarotech-ctrl`; Vercel successfully created the certificate, and a normal HTTPS request with certificate validation returned HTTP 200.

All four desktop/mobile Chromium scenarios then passed against https://games.nayaro.tech, including proxied gameplay, local saves, offline refresh and return navigation. The earlier pending-DNS status is resolved. The original MergeFinity URL remains independent, and no apex/www records or nameservers were changed.
