import re

with open("src/app/snapshot/[id]/SnapshotTimeline.tsx", "r") as f:
    content = f.read()

# Replace the data construction
old_data_block = """    data = trend.dataPoints.map((dp: any) => ({
      rawDate: new Date(dp.date),
      displayDate: new Date(dp.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      value: dp.value,
      isAbnormal: dp.isAbnormal,
      range: (dp.rangeLow != null || dp.rangeHigh != null) ? [dp.rangeLow ?? 0, dp.rangeHigh ?? (dp.rangeLow ? dp.rangeLow * 2 : 100)] : null
    })).sort((a: any, b: any) => a.rawDate.getTime() - b.rawDate.getTime());
  }

  const primaryColor = '#eab308';"""

new_data_block = """    data = trend.dataPoints.map((dp: any) => ({
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
  }

  const primaryColor = '#eab308';"""
content = content.replace(old_data_block, new_data_block)

# Replace YAxis and Area
old_chart = """<YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 10 }} domain={['auto', 'auto']} />"""
new_chart = """<YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 10 }} domain={[minVal, maxVal]} />"""
content = content.replace(old_chart, new_chart)

old_area = """<Area type="monotone" dataKey="range" stroke="none" fill="rgba(255, 255, 255, 0.05)" connectNulls />"""
new_area = """<Area type="stepAfter" dataKey="range" stroke="none" fill="rgba(34, 197, 94, 0.15)" connectNulls />"""
content = content.replace(old_area, new_area)

with open("src/app/snapshot/[id]/SnapshotTimeline.tsx", "w") as f:
    f.write(content)

print("patched")
