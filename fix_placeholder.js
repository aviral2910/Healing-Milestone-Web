const fs = require('fs');
const file = 'src/app/snapshot/[id]/SnapshotTimeline.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  'placeholder="Search symptoms, reports, tags..."',
  'placeholder="Search biomarkers, reports, notes..."'
);

fs.writeFileSync(file, code);
