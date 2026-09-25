# apps.zekhoi.dev Build Plan

## Goal

Build **apps.zekhoi.dev**, the official home for all apps and games by zekhoi. It serves two purposes:

1. A public showcase: one landing page per app or game, with store badges, screenshots, and features.
2. Store compliance: stable URLs for privacy policy, terms, support, and account deletion that can be submitted to Google Play Console and App Store Connect.

Adding a new app must only require adding a content folder and images. No new routes or components.

## Stack

- Astro (latest), static output
- pnpm
- TypeScript strict
- Tailwind CSS v4 via `@tailwindcss/vite`
- `@astrojs/sitemap`
- Content collections with the `glob` loader
- Deployment: Cloudflare Pages (Git integration)

## Working Rules

- Use pnpm for everything. Never npm or yarn.
- Check the current Astro docs for API changes before writing config or content collection code.
- No emojis or decorative symbols anywhere in UI copy.
- Keep components small and typed. Props interfaces on every component.
- Zero client-side JavaScript unless a feature truly needs it. Prefer Astro components over framework islands.
- Run `pnpm check` and `pnpm build` at the end of every phase. Fix all errors before moving on.
- Commit at the end of each logical step with a conventional commit message.

---

## Phase 0: Design Research with Mobbin MCP

Before writing UI code, use the Mobbin MCP to gather references. Summarize findings in `docs/design-notes.md`.

Research targets:

1. **App landing pages**: app marketing sites and "download the app" pages. Hero layout, store badge placement, screenshot presentation.
2. **App directory / portfolio grids**: how studios list multiple apps (cards, icons, tags, platform labels).
3. **Legal pages**: readable privacy policy and terms layouts (typography, table of contents, last updated date).
4. **Support pages**: contact and FAQ patterns.
5. **Account deletion flows**: how apps explain deletion steps and what data is removed.

For each target, record 3 to 5 references with what is worth borrowing, the layout pattern chosen, and spacing, type scale, and color direction.

Then define design tokens (light and dark palette with one accent, type scale with one locally loaded sans-serif via `@fontsource`, spacing, radius, shadow) in `src/styles/global.css` using Tailwind v4 `@theme`.

Design direction: clean, minimal, generous whitespace, content first. Follows system light/dark preference.

## Phase 1: Project Setup

Astro minimal template, TypeScript strict, Tailwind v4, sitemap, Prettier with the Astro and Tailwind plugins, `.editorconfig`, `.gitignore`, scripts `dev`, `build`, `preview`, `check`, `format`, and `packageManager` pinned.

`astro.config.mjs`: `site: "https://apps.zekhoi.dev"`, `output: "static"`, `trailingSlash: "never"`, `build.format: "file"`.

## Phase 2: Content Model

```
src/content/apps/
└── daylime/
    ├── index.md            metadata + landing copy
    ├── privacy.md
    ├── terms.md
    └── delete-account.md   only if hasAccounts is true
```

Images go in `src/assets/apps/<slug>/` so Astro can optimize them.

Two collections in `src/content.config.ts`, both using the `glob` loader over `src/content/apps`:

- `apps` (`*/index.md`): name, tagline, description, type (app, game), platforms (android, ios, web), status (live, beta, coming-soon), icon, screenshots, features, links (website, playStore, appStore, web, github), supportEmail, hasAccounts, faq, order, optional ogImage.
- `docs` (`*/{privacy,terms,delete-account}.md`): title, updatedAt.

Helpers in `src/lib/apps.ts`: `getApps()`, `getApp(slug)`, `getDocs(slug)`, `getAppSlug(entry)`, `getDocName(entry)`.

## Phase 3: Routes

```
src/pages/
├── index.astro                 all apps and games
├── [app]/index.astro           app landing page
├── [app]/[doc].astro           privacy, terms, delete-account
├── [app]/support.astro         support + FAQ
├── privacy.astro               studio-level privacy policy (website itself)
└── 404.astro
```

- `delete-account` is only generated when the app has `hasAccounts: true`, and the build fails if such an app has no `delete-account.md`.
- App slugs must not collide with top-level routes (checked at build time).
- Every app page links to its privacy, terms, support, and (if applicable) delete-account pages in the footer.

| Page | URL |
|---|---|
| Landing | `https://apps.zekhoi.dev/daylime` |
| Privacy policy | `https://apps.zekhoi.dev/daylime/privacy` |
| Terms | `https://apps.zekhoi.dev/daylime/terms` |
| Support | `https://apps.zekhoi.dev/daylime/support` |
| Account deletion | `https://apps.zekhoi.dev/daylime/delete-account` |

## Phase 4: Layouts and Components

Layouts: `BaseLayout` (shell, SEO head, header, footer, dark mode via `prefers-color-scheme`) and `LegalLayout` (narrow column, title, last updated date, table of contents from headings, link back to the app).

Components: `SEO`, `Header`, `Footer`, `AppCard`, `AppHero`, `StoreBadges` (official Google Play and App Store badges in `src/assets/badges/`, only for links that exist), `Screenshots`, `FeatureList`, `FAQ` (`<details>`, no JS), `StatusBadge`, `PlatformLabel`.

Pages: home (intro and app grid, with a CSS-only All / Apps / Games filter shown when both types exist), app landing, and support.

## Phase 5: Store Compliance Content

Real content for Daylime privacy policy, terms, and account deletion. `TODO:` markers wherever facts must be confirmed by the owner (providers used, retention periods, storage region). Nothing invented.

- Privacy policy: developer and contact, data collected, use (including AI provider for the companion), third parties, storage and retention, security, user rights, children, changes, effective date.
- Account deletion (Google Play): app and developer name, in-app steps, request by email without the app, what is deleted and kept, processing time.
- Terms: acceptable use, AI output disclaimer, termination, liability limits, governing law (Indonesia), contact.

## Phase 6: SEO and Polish

Per-page title and description, Open Graph image per app, `robots.txt`, favicon and `site.webmanifest`, semantic HTML, alt text, visible focus states, AA contrast. Lighthouse 95+ in all categories.

Later, only if deep links are needed: `public/.well-known/assetlinks.json`, `public/.well-known/apple-app-site-association` (served as `application/json` via `_headers`), `public/app-ads.txt`.

## Phase 7: Deployment (Cloudflare Pages)

- Cloudflare Pages Git integration builds `main` and PR previews. Build command `pnpm build`, output `dist`. See `docs/deploy.md`.
- With `build.format: "file"`, Pages serves `daylime/privacy.html` at `/daylime/privacy` and uses `404.html` automatically.
- `public/_headers`: long immutable cache for `/_astro/*`, security headers for everything.
- `.node-version` pins Node for the Pages build.
- GitHub Actions runs `pnpm install --frozen-lockfile`, `pnpm check`, and `pnpm build` on every push and PR.

**Done when:** the site is live on `https://apps.zekhoi.dev` and every compliance URL returns 200.

---

## Adding a New App

1. Create `src/content/apps/<slug>/index.md` with frontmatter
2. Add `privacy.md`, `terms.md`, and `delete-account.md` if it has accounts
3. Add icon and screenshots in `src/assets/apps/<slug>/`
4. `pnpm build` and check the new URLs
5. Submit the URLs to Play Console and App Store Connect

## Final Acceptance Checklist

- [ ] `pnpm check` and `pnpm build` pass with zero errors
- [ ] Home lists all apps and games
- [ ] Daylime landing, privacy, terms, support, and delete-account pages exist
- [ ] Legal pages show a last updated date
- [ ] Works on mobile, tablet, desktop, light and dark mode
- [ ] No client-side JS shipped except where required
- [ ] Lighthouse 95+ on all categories
- [ ] Deployed to Cloudflare Pages with the custom domain
- [ ] CI runs check and build on every push
