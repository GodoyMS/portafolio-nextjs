/**
 * Brand asset generator — renders the portfolio logo mark to raster icons.
 *
 * The mark is a flat-top hexagon (hexagonal architecture / ports & adapters)
 * enclosing a monospace shell prompt `>_`. Geometry lives here so the SVG and
 * the rasterized `.ico` / `.png` outputs can never drift apart.
 *
 * Run with `pnpm gen:icons`. Outputs land in `src/app/`.
 */

import { deflateSync } from "node:zlib";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

/* ------------------------------------------------------------------ palette */

const NAVY = "#0a192f";
const NAVY_EDGE = "#1b3352";
const TEAL = "#64ffda";

/* ----------------------------------------------------------------- geometry */

/** Flat-top hexagon vertices on the 32x32 design grid. */
function hexagon(radius, cx = 16, cy = 16) {
  return Array.from({ length: 6 }, (_, i) => {
    const angle = (Math.PI / 3) * i;
    return [cx + radius * Math.cos(angle), cy + radius * Math.sin(angle)];
  });
}

/** Scale a point about the grid centre. */
const s = (x, y, k) => [16 + (x - 16) * k, 16 + (y - 16) * k];

/**
 * The mark at three densities. `tile` is the app-icon lockup, `compact` drops
 * the underscore so the prompt still reads at 16px, `bare` is the inline logo
 * used in the site header (mirrored by `LogoMark`).
 */
function markShapes(variant) {
  if (variant === "compact") {
    return [
      { kind: "stroke", points: hexagon(11.9), closed: true, width: 2.8, color: TEAL, opacity: 0.75 },
      { kind: "stroke", points: [[12.1, 10.9], [17.2, 16], [12.1, 21.1]], width: 3.2, color: TEAL },
    ];
  }

  // `bare` is the inline header lockup: same drawing, scaled up to fill its box.
  const k = variant === "bare" ? 13 / 11.6 : 1;
  return [
    { kind: "stroke", points: hexagon(11.6 * k), closed: true, width: 2.2 * k, color: TEAL, opacity: 0.55 },
    {
      kind: "stroke",
      points: [s(11.6, 11.6, k), s(16, 16, k), s(11.6, 20.4, k)],
      width: 2.7 * k,
      color: TEAL,
    },
    {
      kind: "stroke",
      points: [s(17.7, 21.3, k), s(21.3, 21.3, k)],
      width: 2.7 * k,
      color: TEAL,
    },
  ];
}

/** Full app-icon scene: rounded navy tile + mark. */
function tileScene(variant) {
  return [
    { kind: "roundRectFill", rect: [0, 0, 32, 32], radius: 7.4, color: NAVY },
    { kind: "roundRectStroke", rect: [0.7, 0.7, 30.6, 30.6], radius: 6.8, width: 1.1, color: NAVY_EDGE },
    ...markShapes(variant),
  ];
}

/* ---------------------------------------------------------------- distances */

function sdSegment(px, py, ax, ay, bx, by) {
  const vx = bx - ax;
  const vy = by - ay;
  const wx = px - ax;
  const wy = py - ay;
  const len2 = vx * vx + vy * vy;
  const t = len2 === 0 ? 0 : Math.max(0, Math.min(1, (wx * vx + wy * vy) / len2));
  const dx = wx - t * vx;
  const dy = wy - t * vy;
  return Math.hypot(dx, dy);
}

function sdRoundRect(px, py, [x, y, w, h], r) {
  // Distance to a rounded rectangle; negative inside.
  const cx = Math.abs(px - (x + w / 2)) - (w / 2 - r);
  const cy = Math.abs(py - (y + h / 2)) - (h / 2 - r);
  const outside = Math.hypot(Math.max(cx, 0), Math.max(cy, 0));
  return outside + Math.min(Math.max(cx, cy), 0) - r;
}

/** Signed distance for one shape; negative means covered. */
function shapeDistance(shape, px, py) {
  switch (shape.kind) {
    case "roundRectFill":
      return sdRoundRect(px, py, shape.rect, shape.radius);
    case "roundRectStroke":
      return Math.abs(sdRoundRect(px, py, shape.rect, shape.radius)) - shape.width / 2;
    case "stroke": {
      const pts = shape.points;
      let best = Infinity;
      const last = shape.closed ? pts.length : pts.length - 1;
      for (let i = 0; i < last; i++) {
        const [ax, ay] = pts[i];
        const [bx, by] = pts[(i + 1) % pts.length];
        best = Math.min(best, sdSegment(px, py, ax, ay, bx, by));
      }
      // Round caps and joins fall out of the capsule distance for free.
      return best - shape.width / 2;
    }
    default:
      throw new Error(`Unknown shape: ${shape.kind}`);
  }
}

/* --------------------------------------------------------------- rasterizer */

const hexToRgb = (hex) => [
  parseInt(hex.slice(1, 3), 16),
  parseInt(hex.slice(3, 5), 16),
  parseInt(hex.slice(5, 7), 16),
];

/** Render shapes (32x32 design grid) into a straight-alpha RGBA buffer. */
function rasterize(shapes, size) {
  const px = new Float64Array(size * size * 4); // premultiplied RGBA, 0..1
  const unitsPerPixel = 32 / size;

  for (const shape of shapes) {
    const [r, g, b] = hexToRgb(shape.color);
    const shapeAlpha = shape.opacity ?? 1;

    for (let y = 0; y < size; y++) {
      const uy = (y + 0.5) * unitsPerPixel;
      for (let x = 0; x < size; x++) {
        const ux = (x + 0.5) * unitsPerPixel;
        const d = shapeDistance(shape, ux, uy);
        // Analytic antialiasing: fade the edge across a single device pixel.
        const cov = Math.max(0, Math.min(1, 0.5 - d / unitsPerPixel));
        if (cov <= 0) continue;

        const a = cov * shapeAlpha;
        const i = (y * size + x) * 4;
        px[i] = (r / 255) * a + px[i] * (1 - a);
        px[i + 1] = (g / 255) * a + px[i + 1] * (1 - a);
        px[i + 2] = (b / 255) * a + px[i + 2] * (1 - a);
        px[i + 3] = a + px[i + 3] * (1 - a);
      }
    }
  }

  // Un-premultiply into 8-bit RGBA.
  const out = Buffer.alloc(size * size * 4);
  for (let i = 0; i < size * size; i++) {
    const a = px[i * 4 + 3];
    const j = i * 4;
    if (a > 0) {
      out[j] = Math.round(Math.min(1, px[j] / a) * 255);
      out[j + 1] = Math.round(Math.min(1, px[j + 1] / a) * 255);
      out[j + 2] = Math.round(Math.min(1, px[j + 2] / a) * 255);
    }
    out[j + 3] = Math.round(a * 255);
  }
  return out;
}

/* ------------------------------------------------------------- png encoding */

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, "ascii"), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body) >>> 0);
  return Buffer.concat([len, body, crc]);
}

const CRC_TABLE = (() => {
  const table = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c;
  }
  return table;
})();

function crc32(buf) {
  let c = -1;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return c ^ -1;
}

function encodePng(rgba, size) {
  const stride = size * 4;
  const raw = Buffer.alloc((stride + 1) * size);
  for (let y = 0; y < size; y++) {
    raw[y * (stride + 1)] = 0; // filter: none
    rgba.copy(raw, y * (stride + 1) + 1, y * stride, (y + 1) * stride);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // colour type: RGBA
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

/** ICO container holding PNG-encoded entries (universally supported today). */
function encodeIco(entries) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(entries.length, 4);

  let offset = 6 + entries.length * 16;
  const dir = [];
  for (const { size, png } of entries) {
    const e = Buffer.alloc(16);
    e[0] = size >= 256 ? 0 : size;
    e[1] = size >= 256 ? 0 : size;
    e[2] = 0; // palette
    e[3] = 0;
    e.writeUInt16LE(1, 4); // colour planes
    e.writeUInt16LE(32, 6); // bits per pixel
    e.writeUInt32LE(png.length, 8);
    e.writeUInt32LE(offset, 12);
    dir.push(e);
    offset += png.length;
  }
  return Buffer.concat([header, ...dir, ...entries.map((e) => e.png)]);
}

/* ------------------------------------------------------------- svg emission */

const fmt = (n) => Number(n.toFixed(2)).toString();

function shapeToSvg(shape) {
  const stroke = ` stroke-linecap="round" stroke-linejoin="round" fill="none"`;
  const op = shape.opacity != null ? ` stroke-opacity="${shape.opacity}"` : "";
  switch (shape.kind) {
    case "roundRectFill": {
      const [x, y, w, h] = shape.rect;
      return `<rect x="${fmt(x)}" y="${fmt(y)}" width="${fmt(w)}" height="${fmt(h)}" rx="${fmt(shape.radius)}" fill="${shape.color}"/>`;
    }
    case "roundRectStroke": {
      const [x, y, w, h] = shape.rect;
      return `<rect x="${fmt(x)}" y="${fmt(y)}" width="${fmt(w)}" height="${fmt(h)}" rx="${fmt(shape.radius)}" fill="none" stroke="${shape.color}" stroke-width="${fmt(shape.width)}"/>`;
    }
    case "stroke": {
      const d =
        shape.points.map(([x, y], i) => `${i ? "L" : "M"}${fmt(x)} ${fmt(y)}`).join("") +
        (shape.closed ? "Z" : "");
      return `<path d="${d}" stroke="${shape.color}" stroke-width="${fmt(shape.width)}"${op}${stroke}/>`;
    }
    default:
      throw new Error(`Unknown shape: ${shape.kind}`);
  }
}

function toSvg(shapes, { title }) {
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32" role="img" aria-label="${title}">`,
    `<title>${title}</title>`,
    ...shapes.map(shapeToSvg),
    `</svg>`,
    ``,
  ].join("\n");
}

/* -------------------------------------------------------------------- build */

const write = (relPath, data) => {
  const abs = resolve(ROOT, relPath);
  mkdirSync(dirname(abs), { recursive: true });
  writeFileSync(abs, data);
  console.log(`  ${relPath} (${data.length.toLocaleString()} bytes)`);
};

const png = (shapes, size) => encodePng(rasterize(shapes, size), size);

console.log("Generating brand assets…");

write("src/app/icon.svg", toSvg(tileScene("tile"), { title: "Portfolio logo" }));

write(
  "src/app/favicon.ico",
  encodeIco([
    { size: 16, png: png(tileScene("compact"), 16) },
    { size: 32, png: png(tileScene("tile"), 32) },
    { size: 48, png: png(tileScene("tile"), 48) },
    { size: 64, png: png(tileScene("tile"), 64) },
  ]),
);

write("src/app/apple-icon.png", png(tileScene("tile"), 180));

// Preview sheet for eyeballing the mark during design work (not shipped in <head>).
for (const size of [16, 32, 64, 256]) {
  write(`.preview/icon-${size}.png`, png(tileScene(size <= 20 ? "compact" : "tile"), size));
}
write(".preview/mark-bare.svg", toSvg(markShapes("bare"), { title: "Logo mark" }));

console.log("Done.");
