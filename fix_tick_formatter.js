const fs = require('fs');

function fixFile(file) {
  let code = fs.readFileSync(file, 'utf8');
  
  // Replace existing YAxis definition
  const oldYAxis = `<YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 10 }} domain={[minVal, maxVal]} />`;
  const newYAxis = `<YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 10 }} domain={[minVal, maxVal]} tickFormatter={(val: number) => Number(val).toFixed(1).replace(/\\.0$/, '')} />`;
  
  if (code.includes(oldYAxis)) {
    code = code.replace(oldYAxis, newYAxis);
    fs.writeFileSync(file, code);
    console.log("Fixed " + file);
  } else {
    console.log("Could not find YAxis in " + file);
  }
}

fixFile('src/app/snapshot/[id]/SnapshotTimeline.tsx');
fixFile('src/app/snapshot/[id]/compare/CompareScreen.tsx');
