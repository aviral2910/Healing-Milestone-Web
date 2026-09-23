import re

with open("src/app/snapshot/[id]/SnapshotTimeline.tsx", "r") as f:
    content = f.read()

old_tooltip = "<Tooltip contentStyle={{ backgroundColor: '#1e1e1e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'var(--text-primary)' }} itemStyle={{ color: primaryColor, fontWeight: 'bold' }} />"

new_tooltip = """<Tooltip 
                        contentStyle={{ backgroundColor: '#1e1e1e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'var(--text-primary)' }} 
                        itemStyle={{ color: primaryColor, fontWeight: 'bold' }}
                        labelStyle={{ color: 'var(--text-secondary)', marginBottom: '4px' }}
                        formatter={(value: any, name: any) => {
                          if (name === 'range' && Array.isArray(value)) {
                             return [`${value[0]} - ${value[1]}`, 'Normal Range'];
                          }
                          return [value, 'Result'];
                        }}
                      />"""

content = content.replace(old_tooltip, new_tooltip)

with open("src/app/snapshot/[id]/SnapshotTimeline.tsx", "w") as f:
    f.write(content)
print("tooltip patched")
