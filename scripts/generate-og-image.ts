/**
 * Generate default OG image (1200x630) for social sharing
 * Uses brand colors and logo
 */
import sharp from 'sharp';
import path from 'path';

const WIDTH = 1200;
const HEIGHT = 630;

async function generateOgImage() {
  const logoPath = path.resolve('public/icon-512.png');
  const outputPath = path.resolve('public/og-default.jpg');

  // Resize logo to fit nicely
  const logo = await sharp(logoPath)
    .resize(120, 120)
    .toBuffer();

  // Create the OG image with brand gradient background and text overlay
  const svgOverlay = `
    <svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#1c1917;stop-opacity:1" />
          <stop offset="50%" style="stop-color:#0e7490;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#1c1917;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bg)" />
      <!-- Decorative accent line -->
      <rect x="100" y="420" width="80" height="4" rx="2" fill="#d97706" />
      <!-- Site name -->
      <text x="100" y="340" font-family="system-ui, sans-serif" font-size="72" font-weight="bold" fill="#fafaf9">VisitVagad</text>
      <!-- Tagline -->
      <text x="100" y="480" font-family="system-ui, sans-serif" font-size="28" fill="#a8a29e">Discover Rajasthan's Vagad Region</text>
      <text x="100" y="520" font-family="system-ui, sans-serif" font-size="22" fill="#78716c">Banswara · Dungarpur · Tribal Heritage · Eco-Tourism</text>
      <!-- Domain -->
      <text x="100" y="590" font-family="system-ui, sans-serif" font-size="20" fill="#57534e">visitvagad.com</text>
    </svg>
  `;

  await sharp({
    create: {
      width: WIDTH,
      height: HEIGHT,
      channels: 4,
      background: { r: 28, g: 25, b: 23, alpha: 1 },
    },
  })
    .composite([
      { input: Buffer.from(svgOverlay), top: 0, left: 0 },
      { input: logo, top: 80, left: 100 },
    ])
    .jpeg({ quality: 85 })
    .toFile(outputPath);

  console.log(`✅ Generated OG image: ${outputPath} (${WIDTH}x${HEIGHT})`);
}

generateOgImage().catch(console.error);
