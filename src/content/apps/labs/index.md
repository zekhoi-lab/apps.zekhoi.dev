---
name: Labs
tagline: Developer tools that run in your browser
description: Labs is a collection of 20 developer utilities, such as a JSON formatter, a JWT debugger, and a regex tester. They run in your browser, with no ads and no tracking.
type: app
platforms: [web]
status: live
icon: ../../../assets/apps/labs/icon.png
ogImage: ../../../assets/apps/labs/og.png
screenshots:
  - ../../../assets/apps/labs/home.webp
  - ../../../assets/apps/labs/json.webp
  - ../../../assets/apps/labs/jwt.webp
  - ../../../assets/apps/labs/regex.webp
features:
  - title: Format and convert
    description: Format JSON and SQL, convert YAML to JSON and back, and encode or decode Base64.
  - title: Generate
    description: Make UUIDs from v4 to v7, random passwords, SHA hashes, QR codes, and cron schedules.
  - title: Inspect and debug
    description: Decode JWTs and verify their signatures, test regular expressions, parse URLs, compare text side by side, and send HTTP requests.
  - title: Everyday helpers
    description: Convert Unix timestamps and colors, work out CIDR blocks, change text case, write markdown with a preview, and compress images.
links:
  web: https://labs.zekhoi.dev
supportEmail: me@zekhoi.dev
hasAccounts: false
faq:
  - question: Is what I paste sent to a server?
    answer: No. The tools do their work in your browser. The one exception is the HTTP Client, which sends the request you write to the address you enter, because that is its job.
  - question: Do I need an account?
    answer: No. Open a tool and use it.
  - question: Does Labs remember anything?
    answer: Three things, all kept in your browser. They are your theme, your recent UUIDs, and your markdown draft. Clearing the site's data in your browser removes them.
  - question: Are there ads or tracking?
    answer: No. Labs has no ads and no analytics.
order: 3
---

Labs is a set of small developer tools with a plain, terminal-style look. Each one does a single job, such as formatting JSON, decoding a JWT, or testing a regular expression.

The tools run in your browser, so there is nothing to install and no account to create.
