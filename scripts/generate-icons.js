import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

function crc32(buf) {
  let table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table[i] = c;
  }
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = table[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function makeChunk(type, data) {
  const len = data.length;
  const buf = Buffer.alloc(4 + 4 + len + 4);
  buf.writeUInt32BE(len, 0);
  buf.write(type, 4, 4, 'ascii');
  data.copy(buf, 8);
  const crcBuf = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  buf.writeUInt32BE(crc32(crcBuf), 8 + len);
  return buf;
}

function createPng(width, height, isMaskable = false) {
  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  // IHDR
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // bit depth
  ihdrData[9] = 6; // RGBA
  ihdrData[10] = 0; // compression
  ihdrData[11] = 0; // filter
  ihdrData[12] = 0; // interlace
  const ihdrChunk = makeChunk('IHDR', ihdrData);

  // Generate image pixels: Navy Slate-950 background with warm Amber Gold luxury emblem
  // Slate-950: #020617 -> R:2, G:6, B:23
  // Gold Amber-400: #fbbf24 -> R:251, G:191, B:36
  // Gold Amber-500: #f59e0b -> R:245, G:158, B:11
  const rawRows = [];
  const cx = width / 2;
  const cy = height / 2;
  const radius = isMaskable ? width * 0.38 : width * 0.44;
  const innerRadius = radius * 0.88;

  for (let y = 0; y < height; y++) {
    const row = Buffer.alloc(1 + width * 4);
    row[0] = 0; // Filter byte 0 (None)
    for (let x = 0; x < width; x++) {
      const idx = 1 + x * 4;
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Default background: deep luxury navy slate
      let r = 2;
      let g = 6;
      let b = 23;
      let a = 255;

      // Outer gold circle ring
      if (dist <= radius && dist >= innerRadius) {
        // Gold gradient
        const t = (x + y) / (width + height);
        r = Math.round(245 + t * 10);
        g = Math.round(158 + t * 33);
        b = Math.round(11 + t * 25);
      } else if (dist < innerRadius) {
        // Inner circle dark slate with subtle radial glow
        const innerRatio = dist / innerRadius;
        r = Math.round(15 + (1 - innerRatio) * 25);
        g = Math.round(23 + (1 - innerRatio) * 30);
        b = Math.round(42 + (1 - innerRatio) * 35);

        // Center stylized HA monogram letter shapes
        // Normalized coordinates in [-1, 1] relative to inner circle
        const nx = dx / (innerRadius * 0.65);
        const ny = dy / (innerRadius * 0.65);

        let isLetter = false;

        // 'H' (left side: nx between -0.7 and -0.1, ny between -0.7 and 0.7)
        if (nx >= -0.65 && nx <= -0.45 && Math.abs(ny) <= 0.65) isLetter = true; // Left bar of H
        if (nx >= -0.30 && nx <= -0.10 && Math.abs(ny) <= 0.65) isLetter = true; // Right bar of H
        if (nx >= -0.45 && nx <= -0.10 && Math.abs(ny) <= 0.12) isLetter = true; // Cross bar of H

        // 'A' (right side: nx between 0.1 and 0.65, ny between -0.7 and 0.7)
        // Slanted legs approximation or crisp A
        if (nx >= 0.10 && nx <= 0.30 && Math.abs(ny) <= 0.65) isLetter = true; // Left bar of A
        if (nx >= 0.45 && nx <= 0.65 && Math.abs(ny) <= 0.65) isLetter = true; // Right bar of A
        if (nx >= 0.10 && nx <= 0.65 && ny >= -0.65 && ny <= -0.45) isLetter = true; // Top bar of A
        if (nx >= 0.10 && nx <= 0.65 && Math.abs(ny) <= 0.12) isLetter = true; // Cross bar of A

        // Scissor accent / dot at bottom
        if (Math.abs(dx) <= innerRadius * 0.15 && dy >= innerRadius * 0.45 && dy <= innerRadius * 0.65) {
          isLetter = true;
        }

        if (isLetter) {
          r = 251; // Bright Amber Gold
          g = 191;
          b = 36;
        }
      }

      row[idx] = r;
      row[idx + 1] = g;
      row[idx + 2] = b;
      row[idx + 3] = a;
    }
    rawRows.push(row);
  }

  const rawData = Buffer.concat(rawRows);
  const compressedData = zlib.deflateSync(rawData);
  const idatChunk = makeChunk('IDAT', compressedData);

  // IEND
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([sig, ihdrChunk, idatChunk, iendChunk]);
}

const publicDir = path.resolve(process.cwd(), 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Generate standard PNG icons
fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), createPng(192, 192, false));
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), createPng(512, 512, false));
fs.writeFileSync(path.join(publicDir, 'pwa-maskable-512x512.png'), createPng(512, 512, true));
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), createPng(180, 180, false));
fs.writeFileSync(path.join(publicDir, 'favicon.ico'), createPng(32, 32, false));

// Also generate high-definition icon.svg
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#020617"/>
      <stop offset="100%" stop-color="#0f172a"/>
    </linearGradient>
    <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fbbf24"/>
      <stop offset="50%" stop-color="#f59e0b"/>
      <stop offset="100%" stop-color="#d97706"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="128" fill="url(#bg)"/>
  <circle cx="256" cy="256" r="210" fill="none" stroke="url(#gold)" stroke-width="14" stroke-dasharray="16 10"/>
  <circle cx="256" cy="256" r="190" fill="#020617" stroke="url(#gold)" stroke-width="4"/>
  <!-- Hair Adda Monogram -->
  <text x="256" y="295" font-family="'Outfit', sans-serif" font-size="140" font-weight="900" fill="url(#gold)" text-anchor="middle" letter-spacing="4">HA</text>
  <text x="256" y="360" font-family="'Plus Jakarta Sans', sans-serif" font-size="28" font-weight="700" fill="#94a3b8" text-anchor="middle" letter-spacing="8">HAIR ADDA</text>
  <!-- Stylized Scissors/Crown -->
  <path d="M 226 140 L 256 175 L 286 140 L 276 195 L 236 195 Z" fill="url(#gold)"/>
</svg>`;
fs.writeFileSync(path.join(publicDir, 'icon.svg'), svg, 'utf-8');

console.log('PWA icons successfully generated in /public!');
