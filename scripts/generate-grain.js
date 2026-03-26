// Generate a tileable grain texture as an inline SVG data URI fallback,
// or use sharp/canvas if available. This script creates a simple PNG
// using raw zlib + PNG encoding (no dependencies).

const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

const SIZE = 400;

// Build raw RGBA pixel data
const pixels = Buffer.alloc(SIZE * SIZE * 4);
for (let i = 0; i < SIZE * SIZE; i++) {
  const value = Math.random() > 0.5 ? 0 : 255;
  const alpha = Math.floor(Math.random() * 50) + 5; // fine grain: 5-55 out of 255
  const offset = i * 4;
  pixels[offset] = value;
  pixels[offset + 1] = value;
  pixels[offset + 2] = value;
  pixels[offset + 3] = alpha;
}

// PNG encoding helpers
function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc ^= buf[i];
    for (let j = 0; j < 8; j++) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const typeBytes = Buffer.from(type, "ascii");
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const crcInput = Buffer.concat([typeBytes, data]);
  const crcVal = Buffer.alloc(4);
  crcVal.writeUInt32BE(crc32(crcInput), 0);
  return Buffer.concat([len, typeBytes, data, crcVal]);
}

// IHDR
const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(SIZE, 0);  // width
ihdr.writeUInt32BE(SIZE, 4);  // height
ihdr[8] = 8;   // bit depth
ihdr[9] = 6;   // color type: RGBA
ihdr[10] = 0;  // compression
ihdr[11] = 0;  // filter
ihdr[12] = 0;  // interlace

// Build filtered scanlines (filter type 0 = None for each row)
const rawData = Buffer.alloc(SIZE * (1 + SIZE * 4));
for (let y = 0; y < SIZE; y++) {
  const rowOffset = y * (1 + SIZE * 4);
  rawData[rowOffset] = 0; // filter byte
  pixels.copy(rawData, rowOffset + 1, y * SIZE * 4, (y + 1) * SIZE * 4);
}

const compressed = zlib.deflateSync(rawData, { level: 9 });

// Assemble PNG
const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
const png = Buffer.concat([
  signature,
  chunk("IHDR", ihdr),
  chunk("IDAT", compressed),
  chunk("IEND", Buffer.alloc(0)),
]);

const outPath = path.join(__dirname, "..", "public", "textures", "grain.png");
fs.writeFileSync(outPath, png);
console.log(`Grain texture written to ${outPath} (${png.length} bytes, ${SIZE}x${SIZE})`);
