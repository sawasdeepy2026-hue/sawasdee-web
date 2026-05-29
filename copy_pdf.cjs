const fs = require('fs');
const path = require('path');

const desktopDir = 'C:\\Users\\Usuario\\Desktop';
const files = fs.readdirSync(desktopDir);

// Find all PDFs
const pdfs = files.filter(f => f.toLowerCase().endsWith('.pdf'));
console.log('PDFs found on Desktop:');
pdfs.forEach(f => {
  const fullPath = path.join(desktopDir, f);
  console.log(`  - "${f}" (${fs.statSync(fullPath).size} bytes)`);
  console.log(`  - Full path bytes:`, Buffer.from(f).toJSON());
});

// Copy the big PDF (33MB) to our working directory for processing
const bigPdf = pdfs.reduce((largest, f) => {
  const stat = fs.statSync(path.join(desktopDir, f));
  const largestStat = largest ? fs.statSync(path.join(desktopDir, largest)) : null;
  return !largest || stat.size > largestStat.size ? f : largest;
}, null);

if (bigPdf) {
  const src = path.join(desktopDir, bigPdf);
  const dst = path.join(process.cwd(), 'sawasdee_menu.pdf');
  fs.copyFileSync(src, dst);
  console.log('\nCopied to:', dst);
}
