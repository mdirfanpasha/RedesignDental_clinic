const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const rootDir = process.cwd();

async function optimizeImage(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (!['.jpg', '.jpeg', '.png'].includes(ext)) return;

  const webpPath = filePath.substring(0, filePath.length - ext.length) + '.webp';
  const origStats = fs.statSync(filePath);

  // If webp exists and is recent and smaller, skip re-encoding unless original is very large
  if (fs.existsSync(webpPath)) {
    const webpStats = fs.statSync(webpPath);
    if (webpStats.size < origStats.size && webpStats.size < 500 * 1024) {
      return { original: filePath, webp: webpPath, origSize: origStats.size, webpSize: webpStats.size };
    }
  }

  try {
    const image = sharp(filePath);
    const meta = await image.metadata();

    // Set max dimension if it's absurdly large (e.g. > 2560px)
    let pipeline = image;
    if (meta.width && meta.width > 2560) {
      pipeline = pipeline.resize(2560, null, { withoutEnlargement: true });
    }

    if (ext === '.png') {
      await pipeline
        .webp({ quality: 82, effort: 5 })
        .toFile(webpPath);
    } else {
      await pipeline
        .webp({ quality: 80, effort: 5 })
        .toFile(webpPath);
    }

    const newStats = fs.statSync(webpPath);
    return {
      original: filePath,
      webp: webpPath,
      origSize: origStats.size,
      webpSize: newStats.size,
      width: meta.width,
      height: meta.height
    };
  } catch (err) {
    console.error(`Error optimizing ${filePath}:`, err.message);
    return null;
  }
}

async function scanAndOptimizeDir(dir) {
  const results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      const sub = await scanAndOptimizeDir(fullPath);
      results.push(...sub);
    } else {
      const opt = await optimizeImage(fullPath);
      if (opt) results.push(opt);
    }
  }
  return results;
}

async function main() {
  console.log('--- Starting Image Optimization ---');
  const imgDir = path.join(rootDir, 'assets', 'img');
  const galleryDir = path.join(rootDir, 'gallery_photos');

  const imgResults = await scanAndOptimizeDir(imgDir);
  const galleryResults = await scanAndOptimizeDir(galleryDir);

  const all = [...imgResults, ...galleryResults];
  let totalSaved = 0;
  let totalOrig = 0;
  let totalWebp = 0;

  all.forEach(r => {
    totalOrig += r.origSize;
    totalWebp += r.webpSize;
    totalSaved += (r.origSize - r.webpSize);
  });

  console.log(`Optimized ${all.length} images.`);
  console.log(`Original total size: ${(totalOrig / (1024 * 1024)).toFixed(2)} MB`);
  console.log(`WebP total size: ${(totalWebp / (1024 * 1024)).toFixed(2)} MB`);
  console.log(`Total saved: ${(totalSaved / (1024 * 1024)).toFixed(2)} MB (${((totalSaved / totalOrig) * 100).toFixed(1)}% reduction)`);
}

main().catch(console.error);
