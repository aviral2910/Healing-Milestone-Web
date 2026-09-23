import re

with open("src/app/snapshot/[id]/SnapshotTimeline.tsx", "r") as f:
    content = f.read()

old_chart = """<LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="displayDate" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 10 }} minTickGap={20} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 10 }} domain={[minVal, maxVal]} />
                <Tooltip 
                        contentStyle={{ backgroundColor: '#1e1e1e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'var(--text-primary)' }} 
                        itemStyle={{ color: primaryColor, fontWeight: 'bold' }}
                        labelStyle={{ color: 'var(--text-secondary)', marginBottom: '4px' }}
                        formatter={(value: any, name: any) => {
                          if (name === 'range' && Array.isArray(value)) {
                             return [`${value[0]} - ${value[1]}`, 'Normal Range'];
                          }
                          return [value, 'Result'];
                        }}
                      />
                <Line type="monotone" dataKey="value" stroke={primaryColor} strokeWidth={3} dot={(props: any) => {
                        const { cx, cy, payload } = props;
                        return (
                          <circle key={`dot-${cx}-${cy}`} cx={cx} cy={cy} r={4} fill="var(--surface)" stroke={payload.isAbnormal ? '#ef4444' : primaryColor} strokeWidth={payload.isAbnormal ? 3 : 2} />
                        );
                      }} activeDot={{ r: 6 }} />
              </LineChart>"""

new_chart = """<ComposedChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="displayDate" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 10 }} minTickGap={20} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 10 }} domain={[minVal, maxVal]} />
                <Tooltip 
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
                              <div className="bg-[#1e1e1e] border border-white/10 rounded-lg p-3 text-sm shadow-xl" style={{ backgroundColor: '#1e1e1e', border: '1px solid rgba(255,255,255,0.1)' }}>
                                <p className="text-[var(--text-secondary)] mb-2 font-medium">{label}</p>
                                <p className="font-bold mb-1" style={{ color: data.isAbnormal ? '#ef4444' : primaryColor }}>
                                  Result: {data.value}
                                </p>
                                {rangeStr && (
                                  <p className="text-[var(--text-secondary)]">
                                    Normal Range: {rangeStr}
                                  </p>
                                )}
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                {data.length > 0 && (defaultLow != null || defaultHigh != null) && (
                  <ReferenceArea 
                    y1={defaultLow ?? minVal} 
                    y2={defaultHigh ?? maxVal} 
                    fill="rgba(34, 197, 94, 0.15)" 
                    strokeOpacity={0} 
                  />
                )}
                <Line type="monotone" dataKey="value" stroke={primaryColor} strokeWidth={3} dot={(props: any) => {
                        const { cx, cy, payload } = props;
                        return (
                          <circle key={`dot-${cx}-${cy}`} cx={cx} cy={cy} r={4} fill="var(--surface)" stroke={payload.isAbnormal ? '#ef4444' : primaryColor} strokeWidth={payload.isAbnormal ? 3 : 2} />
                        );
                      }} activeDot={{ r: 6 }} />
              </ComposedChart>"""

if old_chart in content:
    content = content.replace(old_chart, new_chart)
    with open("src/app/snapshot/[id]/SnapshotTimeline.tsx", "w") as f:
        f.write(content)
    print("Successfully replaced chart!")
else:
    print("FAILED TO FIND OLD CHART BLOCK")

