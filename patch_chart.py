import re

with open("src/app/snapshot/[id]/SnapshotTimeline.tsx", "r") as f:
    content = f.read()

# Replace imports
old_imports = "import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, Legend } from 'recharts';"
new_imports = "import { ComposedChart, LineChart, Line, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, Legend } from 'recharts';"
content = content.replace(old_imports, new_imports)

# Replace data mapping in InlineBiomarkerCard
old_data_map = """      value: dp.value,
      isAbnormal: dp.isAbnormal
    })).sort((a: any, b: any) => a.rawDate.getTime() - b.rawDate.getTime());"""
new_data_map = """      value: dp.value,
      isAbnormal: dp.isAbnormal,
      range: (dp.rangeLow != null && dp.rangeHigh != null) ? [dp.rangeLow, dp.rangeHigh] : null
    })).sort((a: any, b: any) => a.rawDate.getTime() - b.rawDate.getTime());"""
content = content.replace(old_data_map, new_data_map)

# Replace LineChart with ComposedChart in InlineBiomarkerCard
old_chart = """                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <XAxis dataKey="displayDate" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 10 }} minTickGap={20} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 10 }} domain={['auto', 'auto']} />
                      <Tooltip contentStyle={{ backgroundColor: '#1e1e1e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'var(--text-primary)' }} itemStyle={{ color: primaryColor, fontWeight: 'bold' }} />
                      <Line type="monotone" dataKey="value" stroke={primaryColor} strokeWidth={3} dot={{ fill: 'var(--surface)', stroke: primaryColor, strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>"""
new_chart = """                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <XAxis dataKey="displayDate" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 10 }} minTickGap={20} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 10 }} domain={['auto', 'auto']} />
                      <Tooltip contentStyle={{ backgroundColor: '#1e1e1e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'var(--text-primary)' }} itemStyle={{ color: primaryColor, fontWeight: 'bold' }} />
                      <Area type="monotone" dataKey="range" stroke="none" fill="rgba(255, 255, 255, 0.05)" connectNulls />
                      <Line type="monotone" dataKey="value" stroke={primaryColor} strokeWidth={3} dot={{ fill: 'var(--surface)', stroke: primaryColor, strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
                    </ComposedChart>
                  </ResponsiveContainer>"""
content = content.replace(old_chart, new_chart)

with open("src/app/snapshot/[id]/SnapshotTimeline.tsx", "w") as f:
    f.write(content)

print("patched")
