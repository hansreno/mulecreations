import sharp from 'sharp';
import { readFileSync, writeFileSync } from 'fs';

let svg = readFileSync('./images/MuleSVG.svg', 'utf8');

// Crop to just the mule (it lives in the lower-left of the 10x10 canvas)
svg = svg.replace(/viewBox="[^"]*"/, 'viewBox="1.2 5.0 2.9 2.9"');

// Thicken strokes so they're visible at favicon sizes
svg = svg.replace(/stroke-width:0\.010000/g, 'stroke-width:0.022000');

// White background, black mule
svg = svg.replace(/(<svg[^>]+>)/, '$1<rect width="100%" height="100%" fill="#ffffff"/>');

writeFileSync('./public/favicon.svg', svg);
console.log('favicon.svg written');

// Render PNG at 256x256
const png256 = await sharp(Buffer.from(svg))
  .resize(256, 256, { fit: 'contain', background: '#ffffff' })
  .png()
  .toBuffer();

writeFileSync('./public/favicon.png', png256);
console.log('favicon.png written (256x256)');
