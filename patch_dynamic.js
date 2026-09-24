const fs = require('fs');

const files = [
  'src/app/snapshot/[id]/page.tsx',
  'src/app/snapshot/[id]/compare/page.tsx',
  'src/app/story/[id]/page.tsx',
  'src/app/journey/[id]/page.tsx'
];

const dynamicStr = `
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';
`;

for (const file of files) {
  if (fs.existsSync(file)) {
    let code = fs.readFileSync(file, 'utf8');
    if (!code.includes('export const dynamic')) {
      // Insert after imports
      const lastImportIndex = code.lastIndexOf('import ');
      const endOfImport = code.indexOf('\n', lastImportIndex);
      code = code.slice(0, endOfImport + 1) + dynamicStr + code.slice(endOfImport + 1);
      fs.writeFileSync(file, code);
      console.log(`Patched ${file}`);
    }
  }
}
