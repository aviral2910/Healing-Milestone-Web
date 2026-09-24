import re

with open("src/app/snapshot/[id]/SnapshotTimeline.tsx", "r") as f:
    content = f.read()

# 1. Update signature
content = content.replace(
    "function InlineBiomarkerCard({ biomarker, trend, onCompare }: { biomarker: any, trend: any, onCompare: () => void }) {",
    "function InlineBiomarkerCard({ biomarker, date, trend, onCompare }: { biomarker: any, date?: string, trend: any, onCompare: () => void }) {"
)

# 2. Update logic
old_logic = """  let data: any[] = [];
  if (trend) {
    const pts = [...trend.dataPoints].sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    for (let i = pts.length - 1; i >= 0; i--) {"""

new_logic = """  let data: any[] = [];
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
    
    for (let i = pts.length - 1; i >= 0; i--) {"""

content = content.replace(old_logic, new_logic)

# We need to close the `if (pts.length > 0) {` block where `if (trend) {` used to close.
old_close = """        rangeHigh: rHigh
      };
    });
  }"""
new_close = """        rangeHigh: rHigh
      };
    });
  }"""

# Actually, the string replacement is risky. Let's just do it directly.
with open("src/app/snapshot/[id]/SnapshotTimeline.tsx", "w") as f:
    f.write(content)
