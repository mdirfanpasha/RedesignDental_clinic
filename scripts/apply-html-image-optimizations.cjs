const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const rootDir = process.cwd();

async function getImageDimensions(relSrc, baseHtmlDir) {
  let cleanSrc = relSrc.split('?')[0].split('#')[0];
  if (cleanSrc.startsWith('/')) cleanSrc = cleanSrc.substring(1);
  const possiblePaths = [
    path.join(rootDir, cleanSrc),
    path.join(baseHtmlDir, cleanSrc)
  ];

  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      try {
        const meta = await sharp(p).metadata();
        return { width: meta.width, height: meta.height, actualPath: p };
      } catch (_) {}
    }
  }
  return null;
}

async function processHtmlFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const baseDir = path.dirname(filePath);
  const isIndex = path.basename(filePath) === 'index.html';

  // 1. Add preload for hero image if index.html
  if (isIndex && !content.includes('rel="preload" as="image" href="assets/img/hero/dr-suhail-redesign-dental.webp"')) {
    const preloadTag = '    <link rel="preload" as="image" href="assets/img/hero/dr-suhail-redesign-dental.webp" fetchpriority="high" />\n';
    content = content.replace(/(<meta content="width=device-width, initial-scale=1" name="viewport" \/>)/i, `$1\n${preloadTag}`);
  }

  // 2. Find all <img> tags
  const imgRegex = /<img\b([^>]*?)>/gi;
  let match;
  const replacements = [];

  while ((match = imgRegex.exec(content)) !== null) {
    const fullTag = match[0];
    const attrs = match[1];

    const srcMatch = attrs.match(/\bsrc\s*=\s*["']([^"']+)["']/i);
    if (!srcMatch) continue;

    const originalSrc = srcMatch[1];
    let newSrc = originalSrc;

    // Check if webp equivalent exists
    const ext = path.extname(originalSrc.split('?')[0]).toLowerCase();
    if (['.jpg', '.jpeg', '.png'].includes(ext)) {
      const webpCandidate = originalSrc.substring(0, originalSrc.length - ext.length) + '.webp';
      let cleanCandidate = webpCandidate;
      if (cleanCandidate.startsWith('/')) cleanCandidate = cleanCandidate.substring(1);
      const absWebp = path.join(rootDir, cleanCandidate);
      if (fs.existsSync(absWebp)) {
        newSrc = webpCandidate;
      }
    }

    // Get dimensions
    const dims = await getImageDimensions(newSrc, baseDir);

    let newAttrs = attrs;

    // Update src
    if (newSrc !== originalSrc) {
      newAttrs = newAttrs.replace(srcMatch[0], `src="${newSrc}"`);
    }

    // Add width and height if missing
    if (dims && dims.width && dims.height) {
      if (!/\bwidth\s*=/i.test(newAttrs)) {
        newAttrs += ` width="${dims.width}"`;
      }
      if (!/\bheight\s*=/i.test(newAttrs)) {
        newAttrs += ` height="${dims.height}"`;
      }
    }

    // Check if hero image
    const isHero = /dr-suhail-redesign-dental/i.test(newSrc) || /home-hero_image/i.test(newAttrs);
    if (isHero && isIndex && /dr-suhail-redesign-dental/i.test(newSrc)) {
      // Ensure eager and high priority
      newAttrs = newAttrs.replace(/\bloading\s*=\s*["'][^"']+["']/i, '');
      newAttrs = newAttrs.replace(/\bfetchpriority\s*=\s*["'][^"']+["']/i, '');
      newAttrs += ' loading="eager" fetchpriority="high" decoding="sync"';
    } else {
      // Other images: ensure lazy and async decoding unless already eager
      if (!/\bloading\s*=/i.test(newAttrs)) {
        newAttrs += ' loading="lazy"';
      }
      if (!/\bdecoding\s*=/i.test(newAttrs)) {
        newAttrs += ' decoding="async"';
      }
    }

    const newTag = `<img ${newAttrs.replace(/\s+/g, ' ').trim()}>`;
    replacements.push({ original: fullTag, updated: newTag });
  }

  // Apply replacements from back to front
  for (const r of replacements) {
    content = content.replace(r.original, r.updated);
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated images in ${path.relative(rootDir, filePath)} (${replacements.length} images processed)`);
}

async function main() {
  const files = [
    'index.html',
    'about.html',
    'services.html',
    'doctors.html',
    'gallery.html',
    'contact.html',
    'booking.html',
    'appointment.html'
  ];

  for (const f of files) {
    const p = path.join(rootDir, f);
    if (fs.existsSync(p)) {
      await processHtmlFile(p);
    }
  }
}

main().catch(console.error);
