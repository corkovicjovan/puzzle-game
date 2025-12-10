import sharp from 'sharp';
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, '..', 'public');

const svgBuffer = readFileSync(join(publicDir, 'favicon.svg'));

const sizes = [
  { name: 'pwa-192x192.png', size: 192 },
  { name: 'pwa-512x512.png', size: 512 },
  { name: 'apple-touch-icon.png', size: 180 },
];

async function generateIcons() {
  console.log('Generating PWA icons...');

  for (const { name, size } of sizes) {
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(join(publicDir, name));
    console.log(`  Created ${name}`);
  }

  // Generate favicon.ico (32x32 PNG, browsers accept PNG as .ico)
  await sharp(svgBuffer)
    .resize(32, 32)
    .png()
    .toFile(join(publicDir, 'favicon.ico'));
  console.log('  Created favicon.ico');

  console.log('Done!');
}

generateIcons();
