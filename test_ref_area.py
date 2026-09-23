import re

with open("src/app/snapshot/[id]/SnapshotTimeline.tsx", "r") as f:
    content = f.read()

old_area = """<Area type="stepAfter" dataKey="range" stroke="none" fill="rgba(34, 197, 94, 0.15)" connectNulls />"""
new_area = """{data.length > 0 && data[data.length - 1].range && (
                        <ReferenceArea 
                          y1={data[data.length - 1].range[0]} 
                          y2={data[data.length - 1].range[1]} 
                          fill="rgba(34, 197, 94, 0.15)" 
                          strokeOpacity={0} 
                        />
                      )}"""
content = content.replace(old_area, new_area)

old_import = "import { ComposedChart, LineChart, Line, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, Legend } from 'recharts';"
new_import = "import { ComposedChart, LineChart, Line, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, ReferenceArea, Legend } from 'recharts';"
content = content.replace(old_import, new_import)

with open("src/app/snapshot/[id]/SnapshotTimeline.tsx", "w") as f:
    f.write(content)
