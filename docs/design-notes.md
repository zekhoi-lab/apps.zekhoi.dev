# Design notes: apps.zekhoi.dev

Phase 0 of `docs/build-plan.md`. The plan called for the Mobbin MCP, but it requires a paid plan, so references come from live public pages instead. Tokens are at the end and implemented in `src/styles/global.css`.

Research date: 2026-09-26. Method: WebFetch (and WebSearch to locate URLs) against live public pages. Mobbin was unavailable.

Important limitation: WebFetch returns page text converted to Markdown, not rendered pixels or CSS. Everything below about a reference is limited to what was observable that way: section order, headline and CTA copy, heading hierarchy, where dates and badges sit in the document flow, list and step structure. Exact font sizes, colors and pixel spacing of the references were not observed and are not claimed. The "Direction" section is my recommendation, not something copied from a reference.

Pages attempted but not usable (not cited as references): Headspace help center (HTTP 403), Duolingo help pages (redirected to a JS shell with no content), Reddit (fetch blocked), Finch help center (HTTP 403), iconfactory.com/apps (404; the Iconfactory homepage was used instead), howwefeel.org/privacy (JS shell, no content). culturedcode.com redirects straight to /things/ (itself an observation: a one-product studio lets the product be the homepage).

---

## 1. App landing pages

### References

| Product                                   | URL                              | What is worth borrowing                                                                                                                                                                                                                                                                                                                                                             |
| ----------------------------------------- | -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Daylio (mood journal, closest competitor) | https://www.daylio.net/          | Classic hero: headline, one-sentence subheadline ("Keep a diary and capture your day without writing down a single word!"), App Store and Google Play badges directly under the subheadline, one phone screenshot beside it. Ends with a repeated download-badge section and a dedicated "Truly Private and Secure" section linking the policies, which matters for a mood journal. |
| Day One                                   | https://dayoneapp.com/           | Very short hero copy ("Your journal for life." / "The #1 journaling app.") with platform badges in one horizontal row, followed by a one-line pricing clarifier ("Free to use. Better with the Gold plan."). Feature screenshots are stacked full-width, each paired with a single short sentence headline, including a privacy one: "You own the data, we keep it safe."           |
| Bear                                      | https://bear.app/                | Headline "Markdown notes you'll love" followed by a plain platform indicator line (Mac, iPhone, iPad) and then the store badges; the platform line is a cheap, clear way to state availability. Features grouped under one section title ("Write naturally") with four short subsections.                                                                                           |
| Stoic (journal)                           | https://www.getstoic.com/        | Headline plus a one-line promise ending in "Free and private.", then badges for every platform in a single consistently styled row. Shows actual journaling prompts near the top, which demonstrates the product in words instead of screenshots.                                                                                                                                   |
| Halide (Lux)                              | https://halide.cam/              | Single big claim ("UNLOCK YOUR IPHONE CAMERA") plus a short subline and one CTA. Closes with a download prompt, then studio info (Lux) and cross-promotion of the sibling app (Kino), and a footer listing all sibling apps plus Support: a model for how an app page can point back to the studio.                                                                                 |
| Things (Cultured Code)                    | https://culturedcode.com/things/ | One-sentence value statement as the hero, then a single collage image of the app across devices, then a "Get Things" download section with one card per platform each carrying its own store badge. Footer grouped into Products, Support, News, Company.                                                                                                                           |
| Finch                                     | https://finchcare.com/           | Extremely short page: headline "Your new self-care best friend.", one supporting sentence, two badges side by side, a rating line, then footer with FAQ, Privacy, Terms, Contact. Shows that a minimal page with just hero plus legal/support links is a legitimate shape.                                                                                                          |

### Pattern chosen: single-column "icon hero" app page

Route: `/daylime/` (one page per app, same template).

1. Hero (left-aligned on desktop, centered is also fine; keep one choice sitewide):
   - App icon (about 96px, rounded like the Android adaptive icon).
   - H1: app name. Below it one tagline sentence (Day One and Finch show one sentence is enough).
   - Availability line in the Bear style: `Android · Coming soon · Open source`.
   - Primary action: while unreleased, a plain status pill "Coming soon to Google Play" (not a clickable store badge). When live, swap in the official Google Play badge in the same slot. Secondary text link: "View source on GitHub".
2. Screenshots: a row of 3 phone screenshots without device frames, rounded corners, equal height. On mobile the row becomes a horizontal CSS scroll-snap strip (no JS). Things and Day One both let the product image carry the page rather than long copy.
3. Features: 3 short blocks (heading of 2 to 5 words plus one or two sentences each) in a 1/3-column grid. Borrow Day One's "one sentence per screenshot" density.
4. Privacy block, borrowed from Daylio and Day One: a plain statement of where journal data lives and what the AI companion sends where, linking to the app's privacy policy. For a mood journal with AI this is a trust section, not a footnote.
5. Open source block: licence name and repo link (Daylime's differentiator; none of the references have it).
6. Closing repeat of the hero action (Daylio, Things).
7. Per-app footer strip: Support, Privacy, Terms, Delete account, then "Made by zekhoi" linking back to the studio index (Halide pattern).

---

## 2. Studio app directory / portfolio

### References

| Studio                             | URL                             | What is worth borrowing                                                                                                                                                                                                                                                            |
| ---------------------------------- | ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Lux (Halide, Kino, Spectre, Orion) | https://www.lux.camera/         | Each app is a card with just the name as heading and one tagline, and the whole card is the link to the app's own site. Taglines state platform and price plainly inside the sentence ("Our free app to turn your iPad into an HDMI monitor").                                     |
| Panic                              | https://panic.com/              | Products grouped by kind (Mac apps, games, Playdate), each entry with title, one-line description, an inline platform list (Steam, Switch, Mac App Store) and a single CTA. Direct precedent for a studio mixing apps and games under category headings.                           |
| Simon B. Stovring                  | https://simonbs.dev/projects    | Vertical list: small square icon on the left, name and a 2 to 3 sentence description on the right, distribution stated as a text link ("available on GitHub", "available for free on the App Store"). No tags or badges at all, and it still reads cleanly; good for a short list. |
| Supercell                          | https://supercell.com/en/games/ | Grid of cards with artwork, title and a very short tagline ("Epic real-time card battles"). Platform info is not repeated per card but consolidated once (store badges in the footer), which reduces card noise when every title ships on the same platforms.                      |
| The Iconfactory                    | https://iconfactory.com/        | Apps shown under a studio-voice section title ("We walk the walk") with a short feature list per app and a link to each app's own domain; platform info written in prose ("Developed in Unity for iOS, macOS, and tvOS").                                                          |

### Pattern chosen: list cards with a metadata row, grouped by kind

Route: `/` (studio home) with an "Apps" section (and later "Games", Panic-style grouping).

- Start as a vertical list (Simon Stovring) because there is one app today; a 2-column grid of the same card at `md` and up once there are 3 or more items. Same card component either way.
- Card anatomy:
  - Icon 56 to 64px, left.
  - Name (H3) and one-sentence tagline (Lux / Supercell length, not Iconfactory length).
  - Meta row in small muted text: `Android` · `Coming soon` · `Open source`. Use at most one visually distinct chip, for status (Coming soon / Available / Beta); platform and licence stay as plain text so cards stay calm.
  - Entire card is one link to `/daylime/` (Lux). No separate "Learn more" button.
- Section headings by kind ("Apps", "Games") only once a second kind exists.
- Studio intro above the list: one or two sentences of who zekhoi is; no hero image.

---

## 3. Legal pages

### References

| Source                    | URL                                                                                      | What is worth borrowing                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| ------------------------- | ---------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 37signals (Basecamp, HEY) | https://37signals.com/policies/privacy                                                   | Best overall model. "Last updated: August 30, 2026" directly under the title; a plain-language opening that states what the policy covers and a commitment ("We never sell your data."), then a linked list of about 10 sections; H2 sections phrased as plain questions or topics ("What we collect and why", "What happens when you delete content", "Data retention"), H3 subsections. Has a dedicated "Artificial intelligence" section, relevant to Daylime's AI companion. |
| Linear                    | https://linear.app/privacy                                                               | "Effective date: March 17, 2025" right under the H1; numbered table of contents of 10 entries near the top; three clear heading levels; horizontal rules between major sections; footer cross-links to sibling documents (Privacy, Terms, DPA, AUP).                                                                                                                                                                                                                             |
| Stripe                    | https://stripe.com/privacy                                                               | "Last updated: April 28, 2026" at the top; a short "Defined Terms" block explaining terms before the numbered table of contents; numbered sections with lettered subsections. Shows how to keep a very long policy navigable.                                                                                                                                                                                                                                                    |
| GitHub                    | https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement | "Effective date" at the top; uses a table for cookie categories, which is a good way to present "data type / purpose / retention" instead of prose. Counter-example too: no top-of-page table of contents, so a long document is harder to scan.                                                                                                                                                                                                                                 |
| Day One                   | https://dayoneapp.com/privacy                                                            | Friendly opener ("Howdy! We're Automattic Inc.") and concrete deletion language ("when you close your account we wait for a 5-day recovery window and then permanently delete all of your journal entries"). Counter-example on dating: "last revised" appears only at the bottom.                                                                                                                                                                                               |
| Cultured Code             | https://culturedcode.com/privacy/                                                        | Compact (roughly 1,900 words) with clear H2/H3 structure, but no table of contents, no summary, and "Last modified" only at the bottom; useful as a reminder of what to avoid.                                                                                                                                                                                                                                                                                                   |

### Pattern chosen: single-column prose document with top TOC

Routes: `/daylime/privacy`, `/daylime/terms` (per app, since Play listings link per app), plus studio-level `/privacy` for the website itself if needed.

1. Breadcrumb or eyebrow: "Daylime" (ties the document to the app, useful for the Play listing).
2. H1 "Privacy Policy", then immediately "Last updated: 26 September 2026" in muted text, using a `<time datetime>` element (37signals, Linear, Stripe). Never at the bottom only.
3. A 2 to 4 sentence plain-language summary with one or two firm commitments (37signals). Optionally a short "At a glance" bullet list: what we collect, what the AI companion sends, how to delete.
4. Numbered table of contents as an `<ol>` of anchor links (Linear, Stripe). On wide screens it may sit in a sticky left column via `position: sticky` (CSS only); on narrow screens it stays inline at the top.
5. H2 per section with plain-question titles (37signals), H3 for subsections. Include explicit sections for "Artificial intelligence" and "What happens when you delete your account" (37signals, Day One).
6. Use a table for data categories (GitHub): columns Data, Why, Where stored, How long kept.
7. End with "Contact" (email) and "Changes to this policy", then links to sibling documents (Terms, Delete account) (Linear footer).
8. Headings get `id`s and a visible anchor link on hover/focus for sharing.

---

## 4. Support pages

### References

| Product | URL                                      | What is worth borrowing                                                                                                                                                                                                                                                                                                                             |
| ------- | ---------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Halide  | https://halide.cam/support               | Best fit for a tiny team. Self-service first (FAQ, YouTube, manual), then "Still looking for help? We'd love to answer your questions." with an email flow that asks for device model, app version and OS version, and an honest expectation: "We're a small team of three friends, so please allow a few business days for us to get back to you." |
| Bear    | https://bear.app/faq/                    | FAQ grouped into short, task-named categories ("Get Started", "Note safety", "Import your notes", "Troubleshooting"); closes with one-sentence escalation copy: "Still in trouble? Look for answers on the blog, forum or drop us a line."                                                                                                          |
| Daylio  | https://www.daylio.net/faq/              | Five categories only (Tutorials, Backup and restore, Purchases, Issues, About) with question-shaped titles ("Are my data backed up?", "Forgotten PIN code"). Note: it has no article on deleting an account or data, which is exactly the gap Google Play now requires closing.                                                                     |
| Things  | https://culturedcode.com/things/support/ | Categories ordered by user journey (Get Started, The Basics, Things Cloud, Features, Tips, Troubleshooting); account deletion lives inside the account category ("Things Cloud"), so it is findable from support.                                                                                                                                   |
| Day One | https://dayoneapp.com/support/           | Category list shows article counts per category, and there is a clear fallback to a community forum when guides do not answer the question.                                                                                                                                                                                                         |

### Pattern chosen: FAQ-first page with a contact card

Route: `/daylime/support` (and a small studio `/support` that lists apps and the general email).

1. H1 "Daylime Support" plus one sentence.
2. FAQ grouped under 3 to 5 short headings (Daylio / Bear style), e.g. Getting started, Your data and privacy, The AI companion, Account, Troubleshooting. Each question as a native `<details><summary>` element: expandable with zero JS, and searchable with the browser's find. Question-shaped titles.
3. The Account group links prominently to "Delete your account" (Things puts deletion in the account section; Daylio's omission is the counter-example).
4. Contact card (Halide): email address, a `mailto:` link with a prefilled subject and body template asking for phone model, Android version and app version; one honest line on response time ("zekhoi is a small studio, so please allow a few working days").
5. Community fallback (Day One's forum idea, adapted): "Found a bug? Open an issue on GitHub" since Daylime is open source.

---

## 5. Account deletion pages (Google Play "delete account URL")

### What Google Play requires

Source fetched: https://support.google.com/googleplay/android-developer/answer/13327111 (Play Console Help, "Understanding Google Play's app account deletion requirements"). Observed requirements: the page must reference the app or developer name as it appears on the store listing; the deletion pathway must be prominently featured and easily discoverable; the user must be able to actually request deletion through it (link, email or form); any prerequisite steps (such as cancelling a subscription) must be clearly outlined; retention for security, fraud prevention or regulatory reasons must be disclosed; and the page must work without the user having the app installed.

### References

| Product                          | URL                                                                                | What is worth borrowing                                                                                                                                                                                                                                                                                                                                                                                                      |
| -------------------------------- | ---------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Strava                           | https://support.strava.com/en-us/articles/15401906-delete-your-strava-account      | Separate numbered step lists for Website and Mobile App; offers the data export as an explicit step before deleting; states what is deleted and what is kept, including the unusual retention ("Strava retains a perpetual license on your public Segments and Routes"); bold irreversibility line ("our team **will not** be able to recover the account"); subscription cancellation called out as separate from deletion. |
| Day One                          | https://dayoneapp.com/guides/troubleshooting/how-to-delete-a-day-one-sync-account/ | Journal-specific and closest analogue. Per-platform subsections (Web, iOS, macOS, Android) with exact menu paths; "Export your entries first" warning up front; a stated grace period ("the process takes ~5 days to complete, and you can cancel it at any time during that window") and what is removed afterwards ("including all journal entries and media").                                                            |
| Things (Cultured Code)           | https://culturedcode.com/things/support/articles/2803591/                          | Very clear on server versus device: deletion removes data from Things Cloud servers "but the data will remain _on your devices_"; lists what happens immediately (devices stop syncing); explains the edge case where the user lost both password and email.                                                                                                                                                                 |
| Bearable (health / mood tracker) | https://bearable.app/support/howto/delete-your-account-and-or-your-data/           | Separates two intents: "Delete My Account" versus "Delete My Data" (start over, keep login). Plain export warning ("make sure to export any of the data you think you might need in the future") and a no-app fallback: "contact us at support@bearable.app so that we can delete your account and/or data for you."                                                                                                         |

### Pattern chosen: one-page "delete your account" document with fixed sections

Route: `/daylime/delete-account` (this exact URL goes into Play Console). Same prose layout as the legal pages, but short and step-driven.

1. H1 "Delete your Daylime account". Directly under it: "Daylime by zekhoi" (the developer name exactly as on the Play listing, per the Google requirement) and "Last updated".
2. Two-sentence summary: what deleting does and how long it takes.
3. "Before you delete" callout: export your entries first (Day One, Bearable, Strava), and cancel any subscription through Google Play if applicable (Strava; only if Daylime has one).
4. "Delete in the app": one numbered list with exact menu labels (Day One, Strava). One platform only (Android), so no tabs needed.
5. "Can't open the app?": the no-app pathway Google requires. Email address with a prefilled `mailto:` (subject "Delete my Daylime account", body asking for the account email), what verification will happen, and the time to complete (Bearable fallback, Things edge case).
6. "What gets deleted": bullet list naming concrete data (account profile, mood entries, notes, AI companion conversations, backups).
7. "What we keep, and for how long": bullet list with a retention period per item (Strava, Day One grace period), including anything a third-party AI or backup provider holds, or an explicit "nothing" if that is true.
8. Optional grace-period note and how to cancel (Day One), then the irreversibility line (Strava, Things).
9. If relevant, a "Delete my data but keep my account" option (Bearable).
10. Footer links to Privacy Policy and Support.

---

## Direction

### Typography

- One sans-serif family. Recommendation: Inter (variable, self-hosted via `@fontsource-variable/inter` or a local woff2 with `font-display: swap`; no client JS involved), falling back to `system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`. If zero font downloads is preferred, the system stack alone is a valid choice; decide once and do not mix.
- Type scale: ratio 1.25 (major third) on a 16px base, mapped to Tailwind sizes:
  - 14px: meta, captions, badges, "Last updated" (`text-sm`).
  - 16px: UI text, cards (`text-base`).
  - 18px: long-form body on legal, support and deletion pages (`text-lg` on prose) for comfortable reading.
  - 20px: H3 / card titles (`text-xl`).
  - 24px: H2 (`text-2xl`).
  - 30px: H1 on documents (`text-3xl`).
  - 36 to 48px: app-name hero H1 only, fluid with `clamp(2.25rem, 5vw, 3rem)`.
- Weights: 400 body, 600 headings, 500 for small labels. No bold beyond 600, no italics for emphasis in UI.
- Line height: 1.65 to 1.75 for prose, 1.5 for UI text, 1.15 to 1.25 for headings. Headings get slight negative tracking (`tracking-tight`) at 24px and above.

### Spacing rhythm

- 4px base unit (Tailwind default scale). Use a small set only: 8, 12, 16, 24, 32, 48, 64, 96px.
- Inside components: 8 to 16px (icon to text, label to value). Between related blocks: 24 to 32px. Between page sections: 64px mobile, 96px desktop (`py-16 md:py-24`).
- Prose: paragraph spacing about 1em; space above H2 about 2.5em and below about 0.75em, so headings clearly belong to the text that follows (37signals/Linear-style sectioning).
- Horizontal page gutter: 16px mobile, 24px from `sm`, content centred.

### Content width

- Documents (privacy, terms, support, delete account): text column max about 68ch (`max-w-prose` is 65ch; about 680px at 18px). Optional sticky TOC column to the left on `lg` and up only, total container about 1024px.
- App landing and studio home: container `max-w-5xl` (1024px) for screenshots and grids; hero text itself capped at about 36rem so lines stay short.
- Cards: list layout full container width up to 2 columns; never more than 3 columns.

### Color

- Neutral base: a warm gray (Tailwind `stone`). Warmth reads as paper and fits a journaling app and a small-studio voice better than a cold gray; it also sits comfortably next to lime greens in screenshots.
  - Light: background stone-50, surface white, text stone-900, muted text stone-600, borders stone-200.
  - Dark (via `prefers-color-scheme` with Tailwind's `dark:` media strategy): background stone-950, surface stone-900, text stone-100, muted stone-400, borders stone-800.
- Accent: teal (Tailwind `teal-700` in light mode, `teal-400` in dark mode) for links, focus rings, the status chip and small highlights only.
  - Why not lime: lime belongs to Daylime. If the studio uses it, Daylime loses its identity and every future app or game inherits a green brand. Lime also has poor text contrast on light backgrounds unless it is darkened into olive.
  - Why teal works for every app: it is analogous to lime (next to it on the color wheel), so Daylime pages look harmonious rather than clashing; it is cool and calm, which suits a wellbeing app, but not so tied to one mood that a future game looks wrong next to it; it is clearly distinct from red, amber and green, so it never reads as an error, warning or success state; and it still reads as "link" (close to the blue convention) without being generic default blue.
  - Contrast: teal-700 (#0f766e) on white is about 5.5:1 and on stone-50 is similar, which passes WCAG AA for body text; teal-400 (#2dd4bf) on stone-950 is well above AA. Verify final pairs with a contrast checker when implementing.
- App color stays inside app assets: the app's own color (lime for Daylime) appears only in its icon and screenshots, not as a second UI accent. That keeps the "one neutral plus one accent" rule true on every page.
- Define colors as CSS custom properties (e.g. `--color-accent`) mapped into the Tailwind theme, so the accent can be changed in one place later.

---

## Decisions for this build

These adapt the patterns above to the spec in `docs/build-plan.md`.

- **Home filter.** The spec asks for All / Apps / Games filter tabs. They are CSS-only (radio inputs plus `:has()`) and only render once both kinds exist. Until then the home is a plain list of cards.
- **Open source.** There is no separate flag. An app with a `links.github` URL shows "Open source" in its meta line and gets the open source block.
- **Coming soon.** With no store links, the hero shows a "Coming soon to Google Play" (or App Store) label in the badge slot. `StoreBadges` renders official badges only for links that exist.
- **Badges.** Official files in `src/assets/badges/`: Google Play PNG from play.google.com (it includes transparent padding, which the component compensates for) and the black App Store SVG from developer.apple.com. Apple's badge tool host did not resolve from the build machine, so only the black App Store badge is present. It is used in both color schemes, which Apple's guidelines allow.
- **Placeholder artwork.** The Daylime icon (`src/assets/apps/daylime/icon.png`) is generated by `scripts/placeholder-icon.mjs`. Replace it with the real icon. The OG images are also generated placeholders (see Phase 6).

## Design tokens

Implemented in `src/styles/global.css` as CSS custom properties mapped into Tailwind with `@theme inline`, so utilities like `bg-surface`, `text-muted`, and `text-accent` switch with the system color scheme.

### Color

| Token           | Light               | Dark                | Use                    |
| --------------- | ------------------- | ------------------- | ---------------------- |
| `bg`            | stone-50 `#fafaf9`  | stone-950 `#0c0a09` | Page background        |
| `surface`       | white               | stone-900 `#1c1917` | Cards                  |
| `surface-2`     | stone-100 `#f5f5f4` | stone-800 `#292524` | Chips, callouts, code  |
| `fg`            | stone-900 `#1c1917` | stone-100 `#f5f5f4` | Text                   |
| `muted`         | stone-600 `#57534e` | stone-400 `#a8a29e` | Secondary text, meta   |
| `border`        | stone-200 `#e7e5e4` | stone-800 `#292524` | Dividers, card borders |
| `border-strong` | stone-300 `#d6d3d1` | stone-700 `#44403c` | Hover borders          |
| `accent`        | teal-700 `#0f766e`  | teal-400 `#2dd4bf`  | Links, focus rings     |
| `accent-strong` | teal-800 `#115e59`  | teal-300 `#5eead4`  | Text on `accent-soft`  |
| `accent-soft`   | teal-100 `#ccfbf1`  | teal-950 `#042f2e`  | Status chip, selection |
| `accent-fg`     | white               | stone-950           | Text on solid accent   |

Contrast checks (WCAG AA needs 4.5:1 for body text), computed from the hex values: `fg` on `bg` is 16.7:1 light and 18.1:1 dark, `muted` on `bg` is 7.3:1 and 7.8:1, `muted` on `surface-2` is 7.0:1 and 6.0:1, `accent` on `bg` is 5.2:1 and 10.6:1, `accent-strong` on `accent-soft` is 6.7:1 and 9.8:1.

### Type

- Inter Variable, self-hosted via `@fontsource-variable/inter`, falling back to the system stack.
- Scale (1.25 on 16px): 14 meta, 16 UI, 18 document body, 20 h3, 24 h2, 30 document h1, `clamp(2.25rem, 5vw, 3rem)` app hero h1 (`text-hero`).
- Weights: 400 body, 500 labels, 600 headings.
- Line height: 1.7 for documents, 1.5 for UI, 1.1 to 1.25 for headings with tight tracking at 24px and up.

### Spacing, radius, shadow

- Tailwind's 4px scale, limited to 8, 12, 16, 24, 32, 48, 64, 96px.
- Sections are `py-16 md:py-24`. The page gutter is 20px on mobile and 32px from `sm` up (`container-page`).
- Widths: `max-w-5xl` for home and app pages, 68ch for documents with a sticky table of contents to the left at `lg` and up.
- Radius: `rounded-card` (1rem) for cards and screenshots, `rounded-icon` (22.5%) for app icons.
- Shadow: one soft `shadow-card`, used on card hover in light mode only. Dark mode relies on borders.
