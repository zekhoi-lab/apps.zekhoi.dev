// Renders the favicon set and web manifest icons into public/.
import { writeFile } from "node:fs/promises";
import sharp from "sharp";

const mark = (size, { rounded = true, inset = 0 } = {}) => {
  const s = 32;
  const scale = (s - inset * 2) / s;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${s} ${s}">
  <rect width="${s}" height="${s}" rx="${rounded ? 7 : 0}" fill="#1c1917" />
  <g transform="translate(${inset} ${inset}) scale(${scale})">
    <path d="M10.5 11h11l-11 10h11" fill="none" stroke="#2dd4bf" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
  </g>
</svg>`;
};

const png = (svg, size) =>
  sharp(Buffer.from(svg)).resize(size, size).png().toBuffer();

// An .ico file can hold a PNG directly: 6-byte header, 16-byte entry, data.
function ico(pngData, size) {
  const header = Buffer.alloc(22);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(1, 4);
  header.writeUInt8(size, 6);
  header.writeUInt8(size, 7);
  header.writeUInt16LE(1, 10);
  header.writeUInt16LE(32, 12);
  header.writeUInt32LE(pngData.length, 14);
  header.writeUInt32LE(22, 18);
  return Buffer.concat([header, pngData]);
}

await writeFile("public/favicon.svg", mark(32));
await writeFile("public/favicon.ico", ico(await png(mark(32), 32), 32));
await writeFile(
  "public/apple-touch-icon.png",
  await png(mark(180, { rounded: false }), 180),
);
await writeFile("public/icon-192.png", await png(mark(192), 192));
await writeFile("public/icon-512.png", await png(mark(512), 512));
await writeFile(
  "public/icon-maskable-512.png",
  await png(mark(512, { rounded: false, inset: 5 }), 512),
);
console.log("Wrote favicon and manifest icons to public/");
