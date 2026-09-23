import re

with open("src/app/snapshot/[id]/SnapshotTimeline.tsx", "r") as f:
    content = f.read()

# Add recharts imports
content = content.replace("import { useState, useMemo, useEffect } from 'react';", "import { useState, useMemo, useEffect } from 'react';\nimport { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';")

# Update props
content = content.replace("export default function SnapshotTimeline({ timeline, expiresAt }: { timeline: any[], expiresAt: string }) {", "export default function SnapshotTimeline({ timeline, expiresAt, biomarkerTrends }: { timeline: any[], expiresAt: string, biomarkerTrends: any[] }) {")

# Add state
content = content.replace("const [selectedFile, setSelectedFile] = useState<string | null>(null);", "const [selectedFile, setSelectedFile] = useState<string | null>(null);\n  const [selectedTrendName, setSelectedTrendName] = useState<string | null>(null);")

# Make biomarker row clickable
old_biomarker_row = """                                <div key={idx} style={{ 
                                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                  padding: '12px', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '12px',
                                  border: `1px solid ${b.isAbnormal ? 'rgba(239, 68, 68, 0.3)' : 'rgba(255,255,255,0.05)'}`
                                }}>"""
new_biomarker_row = """                                <div key={idx} onClick={() => setSelectedTrendName(b.rawName)} style={{ 
                                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer',
                                  padding: '12px', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '12px',
                                  border: `1px solid ${b.isAbnormal ? 'rgba(239, 68, 68, 0.3)' : 'rgba(255,255,255,0.05)'}`,
                                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                                }} className="biomarker-hover-card">"""
content = content.replace(old_biomarker_row, new_biomarker_row)

# Add Modal rendering at the end of the file
old_lightbox = """      {/* LIGHTBOX MODAL */}"""
new_lightbox = """      {/* TREND MODAL */}
      {selectedTrendName && biomarkerTrends.find(t => t.name === selectedTrendName) && (
        <div 
          onClick={() => setSelectedTrendName(null)}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999, backgroundColor: 'rgba(0,0,0,0.9)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            padding: '1rem', cursor: 'pointer'
          }}
        >
          <div 
            onClick={e => e.stopPropagation()}
            style={{
              backgroundColor: 'var(--surface)', width: '100%', maxWidth: '800px', height: '60vh',
              borderRadius: '24px', display: 'flex', flexDirection: 'column', overflow: 'hidden',
              border: '1px solid var(--border)', cursor: 'default'
            }}
          >
            <div style={{ padding: '20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <BiomarkerIcon name={selectedTrendName} />
                <h2 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-primary)' }}>{selectedTrendName} History</h2>
              </div>
              <button onClick={() => setSelectedTrendName(null)} style={{ background: 'none', border: 'none', color: 'white', fontSize: '24px', cursor: 'pointer' }}>&times;</button>
            </div>
            <div style={{ flex: 1, padding: '20px', minHeight: '300px' }}>
              {(() => {
                const trend = biomarkerTrends.find(t => t.name === selectedTrendName);
                if (!trend) return null;
                const data = trend.dataPoints.map((dp: any) => ({
                  rawDate: new Date(dp.date),
                  displayDate: new Date(dp.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                  value: dp.value,
                  isAbnormal: dp.isAbnormal
                })).sort((a: any, b: any) => a.rawDate.getTime() - b.rawDate.getTime());
                const primaryColor = '#eab308';
                
                return (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 20, right: 30, left: -20, bottom: 20 }}>
                      <XAxis dataKey="displayDate" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} minTickGap={30} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} domain={['auto', 'auto']} />
                      <Tooltip contentStyle={{ backgroundColor: '#1e1e1e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'var(--text-primary)' }} itemStyle={{ color: primaryColor, fontWeight: 'bold' }} />
                      <Line type="monotone" dataKey="value" stroke={primaryColor} strokeWidth={3} dot={{ fill: 'var(--surface)', stroke: primaryColor, strokeWidth: 2, r: 5 }} activeDot={{ r: 7 }} />
                    </LineChart>
                  </ResponsiveContainer>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* LIGHTBOX MODAL */}"""
content = content.replace(old_lightbox, new_lightbox)

with open("src/app/snapshot/[id]/SnapshotTimeline.tsx", "w") as f:
    f.write(content)
