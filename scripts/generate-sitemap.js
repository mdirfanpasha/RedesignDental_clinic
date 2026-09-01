import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const domain = 'https://redesign-tau-five.vercel.app';
const urls = [
  '',
  '/about',
  '/services',
  '/doctors',
  '/gallery',
  '/blog',
  '/contact',
  '/booking',
  '/privacy',
  '/terms',
  '/cookies',
  '/licenses'
];

// Add services
const serviceFiles = fs.readdirSync(path.join(rootDir, 'services')).filter(f => f.endsWith('.html'));
serviceFiles.forEach(f => {
  const slug = f.replace('.html', '');
  urls.push(`/services/${slug}`);
});

// Add blogs
const blogFiles = fs.readdirSync(path.join(rootDir, 'blog')).filter(f => f.endsWith('.html'));
blogFiles.forEach(f => {
  const slug = f.replace('.html', '');
  urls.push(`/blog/${slug}`);
});

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${domain}${u}</loc>
    <changefreq>weekly</changefreq>
    <priority>${u === '' ? '1.0' : (u.startsWith('/services') ? '0.8' : '0.6')}</priority>
  </url>`).join('\n')}
</urlset>`;

fs.writeFileSync(path.join(rootDir, 'sitemap.xml'), xml, 'utf-8');
console.log(`✓ Generated sitemap.xml with ${urls.length} URLs for ${domain}`);
