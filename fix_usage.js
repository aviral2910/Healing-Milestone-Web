const fs = require('fs');
const file = 'src/app/snapshot/[id]/SnapshotTimeline.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  'biomarker={b}',
  'biomarker={b}\n                                  date={item.date}'
);

fs.writeFileSync(file, code);
