import { getCollection, type CollectionEntry } from "astro:content";

export type AppEntry = CollectionEntry<"apps">;
export type DocEntry = CollectionEntry<"docs">;
export type DocName = "privacy" | "terms" | "delete-account";

export const DOC_NAMES: readonly DocName[] = [
  "privacy",
  "terms",
  "delete-account",
];

export const DOC_LABELS: Record<DocName, string> = {
  privacy: "Privacy Policy",
  terms: "Terms of Service",
  "delete-account": "Delete Account",
};

// Slugs that would collide with top-level pages or files in public/.
const RESERVED_SLUGS = new Set([
  "404",
  "_astro",
  "favicon",
  "privacy",
  "robots.txt",
  "site.webmanifest",
  "sitemap-index.xml",
]);

/**
 * The glob loader ids are "daylime" for daylime/index.md and
 * "daylime/privacy" for daylime/privacy.md. Both start with the app slug.
 */
export function getAppSlug(entry: AppEntry | DocEntry): string {
  return entry.id.split("/")[0]!;
}

export function getDocName(entry: DocEntry): DocName {
  const name = entry.id.split("/").at(-1);
  if (!DOC_NAMES.includes(name as DocName)) {
    throw new Error(
      `Unknown doc "${entry.id}". Expected one of ${DOC_NAMES.join(", ")}.`,
    );
  }
  return name as DocName;
}

export async function getApps(): Promise<AppEntry[]> {
  const apps = await getCollection("apps");
  const docs = await getCollection("docs");

  for (const app of apps) {
    const slug = getAppSlug(app);
    if (RESERVED_SLUGS.has(slug)) {
      throw new Error(
        `App slug "${slug}" collides with a reserved route. Rename its folder.`,
      );
    }
    const hasDeletionDoc = docs.some(
      (doc) => getAppSlug(doc) === slug && getDocName(doc) === "delete-account",
    );
    if (app.data.hasAccounts && !hasDeletionDoc) {
      throw new Error(
        `App "${slug}" has accounts but no delete-account.md. Google Play requires an account deletion page.`,
      );
    }
  }

  return apps.sort(
    (a, b) =>
      a.data.order - b.data.order || a.data.name.localeCompare(b.data.name),
  );
}

export async function getApp(slug: string): Promise<AppEntry | undefined> {
  const apps = await getApps();
  return apps.find((app) => getAppSlug(app) === slug);
}

/** Docs that should be published for an app, in display order. */
export async function getDocs(slug: string): Promise<DocEntry[]> {
  const app = await getApp(slug);
  if (!app) return [];
  const docs = await getCollection(
    "docs",
    (doc) =>
      getAppSlug(doc) === slug &&
      (getDocName(doc) !== "delete-account" || app.data.hasAccounts),
  );
  return docs.sort(
    (a, b) =>
      DOC_NAMES.indexOf(getDocName(a)) - DOC_NAMES.indexOf(getDocName(b)),
  );
}
