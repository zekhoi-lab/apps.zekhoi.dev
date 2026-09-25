// Renders 1200x630 Open Graph images with sharp.
//   node scripts/og-image.mjs <slug>   app image from src/content/apps/<slug>/index.md
//   node scripts/og-image.mjs          studio default image
// Text uses the Inter font if fontconfig can find it (for example with
// FONTCONFIG_FILE pointing at a config that includes InterVariable.ttf),
// and falls back to the system sans-serif otherwise.
import { readFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const W = 1200;
const H = 630;
const PAD = 96;
const FONT = "Inter Variable, Inter, sans-serif";

const escape = (text) =>
  text.replace(/[<>&"']/g, (c) => `&#${c.charCodeAt(0)};`);

function wrap(text, maxChars) {
  const lines = [""];
  for (const word of text.split(/\s+/)) {
    const line = lines.at(-1);
    if (line && `${line} ${word}`.length > maxChars) lines.push(word);
    else lines[lines.length - 1] = line ? `${line} ${word}` : word;
  }
  return lines;
}

function frontmatterField(source, field) {
  const match = source.match(new RegExp(`^${field}:\\s*(.+)$`, "m"));
  return match?.[1].trim().replace(/^["']|["']$/g, "");
}

async function render({ title, subtitle, iconPath, out }) {
  const iconSize = 144;
  const titleY = iconPath ? PAD + iconSize + 110 : 300;
  const subtitleLines = wrap(subtitle, 42);
  const subtitleSvg = subtitleLines
    .map(
      (line, i) =>
        `<text x="${PAD}" y="${titleY + 72 + i * 52}" font-family="${FONT}" font-size="40" fill="#57534e">${escape(line)}</text>`,
    )
    .join("");

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
    <rect width="${W}" height="${H}" fill="#fafaf9" />
    <text x="${PAD}" y="${titleY}" font-family="${FONT}" font-weight="600" font-size="80" letter-spacing="-2" fill="#1c1917">${escape(title)}</text>
    ${subtitleSvg}
    <text x="${PAD}" y="${H - 72}" font-family="${FONT}" font-weight="500" font-size="28" fill="#0f766e">apps.zekhoi.dev</text>
  </svg>`;

  const layers = [];
  if (iconPath) {
    const radius = Math.round(iconSize * 0.225);
    const mask = Buffer.from(
      `<svg width="${iconSize}" height="${iconSize}"><rect width="${iconSize}" height="${iconSize}" rx="${radius}" /></svg>`,
    );
    const icon = await sharp(iconPath)
      .resize(iconSize, iconSize)
      .composite([{ input: mask, blend: "dest-in" }])
      .png()
      .toBuffer();
    layers.push({ input: icon, left: PAD, top: PAD });
  }

  await sharp(Buffer.from(svg)).composite(layers).png().toFile(out);
  console.log(`Wrote ${out}`);
}

const slug = process.argv[2];
if (slug) {
  const source = await readFile(`src/content/apps/${slug}/index.md`, "utf8");
  const icon = frontmatterField(source, "icon");
  await render({
    title: frontmatterField(source, "name"),
    subtitle: frontmatterField(source, "tagline"),
    iconPath: icon && path.resolve(`src/content/apps/${slug}`, icon),
    out: `src/assets/apps/${slug}/og.png`,
  });
} else {
  await render({
    title: "Apps and games by zekhoi",
    subtitle: "Downloads, support, and policies for every zekhoi app.",
    out: "src/assets/og-default.png",
  });
}
