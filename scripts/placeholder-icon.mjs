// Renders a placeholder app icon until real artwork exists.
// Usage: node scripts/placeholder-icon.mjs <slug> <hex color>
import sharp from "sharp";

const [slug, color = "#65a30d"] = process.argv.slice(2);
if (!slug) {
  console.error("Usage: node scripts/placeholder-icon.mjs <slug> <hex color>");
  process.exit(1);
}

const segments = Array.from({ length: 8 }, (_, i) => {
  const angle = (i * Math.PI) / 4;
  const x = 256 + Math.cos(angle) * 150;
  const y = 256 + Math.sin(angle) * 150;
  return `<line x1="256" y1="256" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" />`;
}).join("");

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="112" fill="${color}" />
  <circle cx="256" cy="256" r="164" fill="none" stroke="#ffffff" stroke-width="20" />
  <g stroke="#ffffff" stroke-width="12" stroke-linecap="round" opacity="0.85">${segments}</g>
</svg>`;

const out = `src/assets/apps/${slug}/icon.png`;
await sharp(Buffer.from(svg)).png().toFile(out);
console.log(`Wrote ${out}`);
