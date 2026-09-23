import re

with open("src/app/snapshot/[id]/SnapshotTimeline.tsx", "r") as f:
    content = f.read()

# 1. Update the chart area to ReferenceArea
old_area = """<Area type="monotone" dataKey="range" stroke="none" fill="rgba(34, 197, 94, 0.15)" connectNulls activeDot={false} />"""

new_area = """{data.length > 0 && (defaultLow != null || defaultHigh != null) && (
                        <ReferenceArea 
                          y1={defaultLow ?? minVal} 
                          y2={defaultHigh ?? maxVal} 
                          fill="rgba(34, 197, 94, 0.15)" 
                          strokeOpacity={0} 
                        />
                      )}"""
content = content.replace(old_area, new_area)

# 2. Extract defaultLow and defaultHigh so they are accessible
old_logic = """    let defaultLow: number | null = null;
    let defaultHigh: number | null = null;
    const pts = [...trend.dataPoints].sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());"""

new_logic = """  let defaultLow: number | null = null;
  let defaultHigh: number | null = null;

  let data = [];
  if (trend) {
    const pts = [...trend.dataPoints].sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());"""
content = content.replace(old_logic, new_logic)

content = content.replace("""  let data: any[] = [];
  if (trend) {""", "")

# 3. Add custom dot logic and highlight the latest value
old_line = """<Line type="monotone" dataKey="value" stroke={primaryColor} strokeWidth={3} dot={{ fill: 'var(--surface)', stroke: primaryColor, strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />"""
new_line = """<Line type="monotone" dataKey="value" stroke={primaryColor} strokeWidth={3} dot={(props: any) => {
                        const { cx, cy, payload } = props;
                        return (
                          <circle key={`dot-${cx}-${cy}`} cx={cx} cy={cy} r={4} fill="var(--surface)" stroke={payload.isAbnormal ? '#ef4444' : primaryColor} strokeWidth={payload.isAbnormal ? 3 : 2} />
                        );
                      }} activeDot={{ r: 6 }} />"""
content = content.replace(old_line, new_line)

# Highlight latest value in the card header if abnormal
old_header = """                  <span className="font-bold text-lg" style={{ color: primaryColor }}>
                    {biomarker.valueText || biomarker.valueNumeric}
                  </span>"""
new_header = """                  <span className="font-bold text-lg" style={{ color: biomarker.isAbnormal ? '#ef4444' : primaryColor }}>
                    {biomarker.valueText || biomarker.valueNumeric}
                  </span>"""
content = content.replace(old_header, new_header)

with open("src/app/snapshot/[id]/SnapshotTimeline.tsx", "w") as f:
    f.write(content)

print("patched")
