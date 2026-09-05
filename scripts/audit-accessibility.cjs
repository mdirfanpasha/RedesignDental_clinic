const fs = require('fs');
const path = require('path');

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

let totalIssues = 0;

files.forEach(file => {
    const fullPath = path.join(__dirname, '..', file);
    if (!fs.existsSync(fullPath)) return;
    const content = fs.readFileSync(fullPath, 'utf8');

    // 1. Check form inputs without label or aria-label
    const inputMatches = [...content.matchAll(/<(input|select|textarea)([^>]*?)>/gi)];
    const missingInputs = [];

    inputMatches.forEach(match => {
        const fullTag = match[0];
        const typeMatch = fullTag.match(/type=["']([^"']+)["']/i);
        const type = typeMatch ? typeMatch[1].toLowerCase() : 'text';

        if (['hidden', 'submit', 'button', 'reset'].includes(type)) return;

        const hasAria = /aria-label=/i.test(fullTag) || /aria-labelledby=/i.test(fullTag);
        const idMatch = fullTag.match(/id=["']([^"']+)["']/i);
        const id = idMatch ? idMatch[1] : null;

        let hasLabel = false;
        if (id) {
            const labelRegex = new RegExp(`<label[^>]*for=["']${id}["']`, 'i');
            hasLabel = labelRegex.test(content);
        }

        if (!hasAria && !hasLabel) {
            missingInputs.push({ type, id, tag: fullTag.replace(/\s+/g, ' ').substring(0, 100) });
        }
    });

    // 2. Check buttons without text or aria-label
    const buttonMatches = [...content.matchAll(/<button([^>]*?)>([\s\S]*?)<\/button>/gi)];
    const missingButtons = [];

    buttonMatches.forEach(match => {
        const attrs = match[1];
        const innerText = match[2].replace(/<[^>]+>/g, '').trim();
        const hasAria = /aria-label=/i.test(attrs) || /aria-labelledby=/i.test(attrs) || /title=/i.test(attrs);

        if (!hasAria && innerText.length === 0) {
            missingButtons.push({ tag: `<button${attrs}>`.replace(/\s+/g, ' ').substring(0, 100) });
        }
    });

    // 3. Check images without alt
    const imgMatches = [...content.matchAll(/<img([^>]*?)>/gi)];
    const missingImgs = [];

    imgMatches.forEach(match => {
        const tag = match[0];
        if (!/alt=/i.test(tag)) {
            missingImgs.push({ tag: tag.replace(/\s+/g, ' ').substring(0, 100) });
        }
    });

    console.log(`\n=== ${file} ===`);
    console.log(`Missing Input Labels: ${missingInputs.length}`);
    if (missingInputs.length > 0) console.log(missingInputs);
    console.log(`Missing Button Names: ${missingButtons.length}`);
    if (missingButtons.length > 0) console.log(missingButtons);
    console.log(`Missing Image Alts: ${missingImgs.length}`);
    if (missingImgs.length > 0) console.log(missingImgs);

    totalIssues += missingInputs.length + missingButtons.length + missingImgs.length;
});

console.log(`\nTotal Accessibility Issues Found: ${totalIssues}`);
