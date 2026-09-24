const fs = require('fs');
const file = 'src/app/snapshot/[id]/SnapshotTimeline.tsx';
let code = fs.readFileSync(file, 'utf8');

// 1. Update InlineBiomarkerCard signature
code = code.replace(
  'function InlineBiomarkerCard({ biomarker, trend, onCompare }: { biomarker: any, trend: any, onCompare: () => void }) {',
  'function InlineBiomarkerCard({ biomarker, date, trend, onCompare }: { biomarker: any, date?: string, trend: any, onCompare: () => void }) {'
);

// 2. Update data parsing logic
const oldParsing = `  let data: any[] = [];
  if (trend) {
    const pts = [...trend.dataPoints].sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    for (let i = pts.length - 1; i >= 0; i--) {`;

const newParsing = `  let data: any[] = [];
  let pts = trend && trend.dataPoints ? [...trend.dataPoints] : [];
  
  if (biomarker.resultType === 'numeric' && biomarker.valueNumeric != null && date) {
    const exists = pts.some(p => 
      new Date(p.date).getTime() === new Date(date).getTime() && 
      p.value === biomarker.valueNumeric
    );
    if (!exists) {
      pts.push({
        date: date,
        value: biomarker.valueNumeric,
        isAbnormal: biomarker.isAbnormal,
        rangeLow: null,
        rangeHigh: null
      });
    }
  }

  if (pts.length > 0) {
    pts.sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    for (let i = pts.length - 1; i >= 0; i--) {`;

code = code.replace(oldParsing, newParsing);

// Close the if statement further down
const oldMinMax = `    });
  }

  let minVal = Infinity;`;
const newMinMax = `    });
  }

  let minVal = Infinity;`;

if (code.includes(oldParsing)) {
  fs.writeFileSync(file, code);
  console.log("Graph data logic patched.");
} else {
  console.log("Could not find parsing block");
}
