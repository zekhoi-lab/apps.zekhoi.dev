## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)

## Project rules

- Use pnpm only. Run `pnpm check` and `pnpm build` before committing.
- No emojis or decorative symbols in UI copy.
- Ship no client-side JavaScript unless a feature truly needs it.
- Every component has a typed `Props` interface.
- Adding an app means adding content under `src/content/apps/<slug>/` and images under `src/assets/apps/<slug>/`, never new routes. See README.md.
- Legal facts the owner has not confirmed stay marked `TODO:`. Do not invent providers, regions, or retention periods.
