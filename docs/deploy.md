# Deploying to Cloudflare Pages

The site is a static Astro build deployed with the Cloudflare Pages Git integration. Cloudflare builds every push to `main` for production and every other branch or PR as a preview. GitHub Actions (`.github/workflows/ci.yml`) runs `pnpm check` and `pnpm build` on every push and PR.

## One-time setup

1. In the Cloudflare dashboard, go to **Workers & Pages**, then **Create**, then **Pages**, then **Connect to Git**.
2. Pick the `zekhoi-lab/apps.zekhoi.dev` repository.
3. Build settings:
   - Production branch: `main`
   - Framework preset: Astro
   - Build command: `pnpm build`
   - Build output directory: `dist`
4. Environment variables (production and preview):
   - `PNPM_VERSION` = `12.4.1`. The Pages v3 build image defaults to pnpm 10 and does not detect the version from the lockfile or `packageManager`. Keep this in sync with `packageManager` in `package.json`.
   - Node comes from `.node-version` (22). `NODE_VERSION` is not needed.
5. Save and deploy. Check the build log shows pnpm 12 and Node 22.
6. In the project, go to **Custom domains**, then **Set up a custom domain**, and add `apps.zekhoi.dev`. If `zekhoi.dev` is on Cloudflare DNS, the CNAME and certificate are created automatically. Otherwise add a CNAME from `apps` to `<project>.pages.dev` at your DNS provider.

## Zone settings to check

The site ships no JavaScript. Some Cloudflare zone features inject scripts, so turn these off for `apps.zekhoi.dev` (with a Configuration Rule if the rest of the zone needs them):

- **Email Address Obfuscation** (Scrape Shield). It rewrites the `mailto:` support and deletion addresses into a script-decoded placeholder. Store reviewers and users without JS would see `[email protected]` instead of the address. `BaseLayout.astro` wraps every page in Cloudflare's `<!--email_off-->` markers, so addresses are left alone even while the setting is on. To confirm, this must print 0:

  ```sh
  curl -s https://apps.zekhoi.dev/daylime/support | grep -c email-protection
  ```

- **Rocket Loader** and automatic **Web Analytics** injection. If you want analytics, enable Cloudflare Web Analytics knowing it adds a small script, and update the website privacy policy (`src/content/site/privacy.md`).

## How URLs are served

`astro.config.mjs` uses `build.format: "file"` and `trailingSlash: "never"`, so `/daylime/privacy` is built as `dist/daylime/privacy.html`. Pages serves it at the extensionless URL and redirects `/daylime/privacy.html` to it. `dist/404.html` is used automatically for missing pages.

`public/_headers` sets a one-year immutable cache on hashed assets in `/_astro/*` and basic security headers everywhere. HTML gets Cloudflare's default short cache, and compression is automatic.

## After the first deploy

Every compliance URL must return 200:

```sh
for p in daylime daylime/privacy daylime/terms daylime/support daylime/delete-account privacy; do
  printf '%s ' "$p"; curl -s -o /dev/null -w '%{http_code}\n' "https://apps.zekhoi.dev/$p"
done
```

Then submit to the stores:

- Play Console: privacy policy `https://apps.zekhoi.dev/daylime/privacy`, account deletion URL `https://apps.zekhoi.dev/daylime/delete-account`.
- App Store Connect: privacy policy and support URLs.

Resolve every `TODO:` in `src/content/apps/daylime/` and `src/lib/site.ts` before submitting.
