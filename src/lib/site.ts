export const SITE = {
  name: "zekhoi apps",
  developer: "zekhoi",
  url: "https://apps.zekhoi.dev",
  homepage: "https://zekhoi.dev",
  email: "me@zekhoi.dev",
  description:
    "Apps and games by zekhoi, with downloads, support, and policies for each one.",
} as const;

export function pageTitle(...parts: string[]): string {
  return [...parts, SITE.name].join(" | ");
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

/**
 * build.format "file" makes Astro.url end in .html, but Cloudflare Pages
 * serves the extensionless URL. Returns that public path.
 */
export function publicPath(url: URL): string {
  return url.pathname.replace(/\.html$/, "").replace(/(^|\/)index$/, "/");
}
