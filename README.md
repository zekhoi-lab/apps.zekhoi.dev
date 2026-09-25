# apps.zekhoi.dev

The home for apps and games by zekhoi: one landing page per app, plus stable privacy, terms, support, and account deletion URLs for Google Play and the App Store.

Static Astro site with Tailwind CSS v4, deployed to Cloudflare Pages. See [docs/deploy.md](docs/deploy.md).

## Commands

| Command        | What it does                  |
| -------------- | ----------------------------- |
| `pnpm dev`     | Start the dev server          |
| `pnpm check`   | Type-check with `astro check` |
| `pnpm build`   | Build to `dist/`              |
| `pnpm preview` | Serve the build locally       |
| `pnpm format`  | Format with Prettier          |

## Adding an app or game

1. Create `src/content/apps/<slug>/index.md`. Copy the frontmatter from `src/content/apps/daylime/index.md`. The schema is in `src/content.config.ts`.
2. Add `privacy.md` and `terms.md`, plus `delete-account.md` if `hasAccounts: true`. The build fails if an app with accounts has no deletion page.
3. Put the icon and screenshots in `src/assets/apps/<slug>/`.
   - No icon yet? `node scripts/placeholder-icon.mjs <slug> "#hex"`.
   - Open Graph image: `node scripts/og-image.mjs <slug>`, then set `ogImage` in the frontmatter. For the Inter font, point `FONTCONFIG_FILE` at a fontconfig file that includes `InterVariable.ttf`. Otherwise it uses the system sans-serif.
4. Run `pnpm build` and check `/<slug>`, `/<slug>/privacy`, `/<slug>/terms`, `/<slug>/support`, and `/<slug>/delete-account`.
5. Submit the URLs to Play Console and App Store Connect.

When the store listing goes live, add `links.playStore` or `links.appStore` and set `status: live`. The official badges then appear automatically.

## Docs

- [docs/build-plan.md](docs/build-plan.md): the original build plan
- [docs/design-notes.md](docs/design-notes.md): design research and tokens
- [docs/deploy.md](docs/deploy.md): Cloudflare Pages setup
