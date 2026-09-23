import re

with open("src/app/snapshot/[id]/BiomarkerTrends.tsx", "r") as f:
    content = f.read()

# Add expanded state
content = content.replace(
    "const latest = data[data.length - 1];",
    "const [expanded, setExpanded] = useState(false);\n          const latest = data[data.length - 1];"
)

# Replace the div opening to include onClick
content = content.replace(
    """<div key={idx} style={{
              backgroundColor: 'var(--surface)', borderRadius: '20px',
              border: `1px solid ${isAbnormal ? 'rgba(239, 68, 68, 0.3)' : 'rgba(234, 179, 8, 0.3)'}`,
              padding: '16px', display: 'flex', flexDirection: 'column',
            }}>""",
    """<div key={idx} onClick={() => setExpanded(!expanded)} style={{
              backgroundColor: 'var(--surface)', borderRadius: '20px',
              border: `1px solid ${isAbnormal ? 'rgba(239, 68, 68, 0.3)' : 'rgba(234, 179, 8, 0.3)'}`,
              padding: '16px', display: 'flex', flexDirection: 'column', cursor: 'pointer'
            }}>"""
)

# Conditionally render the chart
content = content.replace(
    """<div style={{ height: '200px', width: '100%', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>""",
    """{expanded && <div style={{ height: '200px', width: '100%', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>"""
)
content = content.replace(
    """</ResponsiveContainer>\n              </div>""",
    """</ResponsiveContainer>\n              </div>}"""
)

with open("src/app/snapshot/[id]/BiomarkerTrends.tsx", "w") as f:
    f.write(content)
