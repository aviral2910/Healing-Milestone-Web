import re

with open("src/app/snapshot/[id]/SnapshotTimeline.tsx", "r") as f:
    content = f.read()

old_logic = """    data = trend.dataPoints.map((dp: any) => ({
      rawDate: new Date(dp.date),
      displayDate: new Date(dp.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      value: dp.value,
      isAbnormal: dp.isAbnormal,
      range: (dp.rangeLow != null || dp.rangeHigh != null) ? [dp.rangeLow ?? 0, dp.rangeHigh ?? (dp.rangeLow ? dp.rangeLow * 2 : 100)] : null
    })).sort((a: any, b: any) => a.rawDate.getTime() - b.rawDate.getTime());
  }

  let minVal = Infinity;
  let maxVal = -Infinity;
  if (data && data.length > 0) {
    data.forEach((d: any) => {
      if (d.value < minVal) minVal = d.value;
      if (d.value > maxVal) maxVal = d.value;
      if (d.range) {
        if (d.range[0] < minVal) minVal = d.range[0];
        if (d.range[1] > maxVal) maxVal = d.range[1];
      }
    });
    if (minVal === Infinity) { minVal = 0; maxVal = 100; }
    const padding = (maxVal - minVal) * 0.1;
    minVal = Math.max(0, minVal - padding);
    maxVal = maxVal + padding;
  }"""

new_logic = """    let defaultLow: number | null = null;
    let defaultHigh: number | null = null;
    const pts = [...trend.dataPoints].sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    for (let i = pts.length - 1; i >= 0; i--) {
      if (pts[i].rangeHigh != null && defaultHigh == null) defaultHigh = pts[i].rangeHigh;
      if (pts[i].rangeLow != null && defaultLow == null) defaultLow = pts[i].rangeLow;
    }

    data = pts.map((dp: any) => {
      const rHigh = dp.rangeHigh ?? defaultHigh ?? dp.value;
      const rLow = dp.rangeLow ?? defaultLow ?? dp.value;
      
      return {
        rawDate: new Date(dp.date),
        displayDate: new Date(dp.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        value: dp.value,
        isAbnormal: dp.isAbnormal,
        range: [rLow, rHigh],
        rangeLow: rLow,
        rangeHigh: rHigh
      };
    });
  }

  let minVal = Infinity;
  let maxVal = -Infinity;
  if (data && data.length > 0) {
    data.forEach((d: any) => {
      if (d.value < minVal) minVal = d.value;
      if (d.value > maxVal) maxVal = d.value;
      if (d.rangeLow < minVal) minVal = d.rangeLow;
      if (d.rangeHigh > maxVal) maxVal = d.rangeHigh;
    });
    if (minVal === Infinity) { minVal = 0; maxVal = 100; }
    const padding = (maxVal - minVal) * 0.2;
    minVal -= padding;
    maxVal += padding;
    if (minVal >= maxVal) {
      minVal -= 10;
      maxVal += 10;
    }
  }"""

content = content.replace(old_logic, new_logic)

old_chart = """<ReferenceArea 
                          y1={data[data.length - 1].range[0]} 
                          y2={data[data.length - 1].range[1]} 
                          fill="rgba(34, 197, 94, 0.15)" 
                          strokeOpacity={0} 
                        />
                      )}
                      <Area type="monotone" dataKey="range" stroke="none" fill="transparent" activeDot={false} />"""

new_chart = """<Area type="monotone" dataKey="range" stroke="none" fill="rgba(34, 197, 94, 0.15)" connectNulls activeDot={false} />"""
content = content.replace(old_chart, new_chart)

old_tooltip = """if (value[0] === 0) {
                               return [`< ${value[1]}`, 'Normal Range'];
                             }
                             return [`${value[0]} - ${value[1]}`, 'Normal Range'];"""
new_tooltip = """return [`${value[0]} - ${value[1]}`, 'Normal Range'];"""
content = content.replace(old_tooltip, new_tooltip)

with open("src/app/snapshot/[id]/SnapshotTimeline.tsx", "w") as f:
    f.write(content)

print("patched final")
