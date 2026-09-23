import re

with open("src/app/snapshot/[id]/SnapshotTimeline.tsx", "r") as f:
    content = f.read()

old_tooltip = """<Tooltip 
                        contentStyle={{ backgroundColor: '#1e1e1e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'var(--text-primary)' }} 
                        itemStyle={{ color: primaryColor, fontWeight: 'bold' }}
                        labelStyle={{ color: 'var(--text-secondary)', marginBottom: '4px' }}
                        formatter={(value: any, name: any) => {
                          return [`${value[0]} - ${value[1]}`, 'Normal Range'];
                        }}
                      />"""

new_tooltip = """<Tooltip 
                        content={({ active, payload, label }: any) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            const rLow = data.rangeLow;
                            const rHigh = data.rangeHigh;
                            let rangeStr = "";
                            if (rLow != null && rHigh != null) {
                              if (rLow === data.value && rHigh !== data.value) rangeStr = `< ${rHigh}`;
                              else rangeStr = `${rLow} - ${rHigh}`;
                            } else if (defaultLow != null || defaultHigh != null) {
                              if (defaultLow == null) rangeStr = `< ${defaultHigh}`;
                              else rangeStr = `${defaultLow} - ${defaultHigh}`;
                            }
                            
                            return (
                              <div className="bg-[#1e1e1e] border border-white/10 rounded-lg p-3 text-sm shadow-xl">
                                <p className="text-[var(--text-secondary)] mb-2 font-medium">{label}</p>
                                <p className="font-bold mb-1" style={{ color: data.isAbnormal ? '#ef4444' : primaryColor }}>
                                  Result: {data.value}
                                </p>
                                {rangeStr && (
                                  <p className="text-[var(--text-secondary)]">
                                    Range: {rangeStr}
                                  </p>
                                )}
                              </div>
                            );
                          }
                          return null;
                        }}
                      />"""
content = content.replace(old_tooltip, new_tooltip)

with open("src/app/snapshot/[id]/SnapshotTimeline.tsx", "w") as f:
    f.write(content)

print("tooltip patched")
