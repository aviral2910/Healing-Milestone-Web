"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ComposedChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceArea } from 'recharts';

const COLORS = ['#eab308', '#3b82f6', '#10b981', '#a855f7', '#ec4899', '#f97316', '#06b6d4'];

export default function CompareScreen({ viewData, snapshotId }: { viewData: any, snapshotId: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const biomarkerTrends = viewData.biomarkerTrends || [];
  
  const [comparing, setComparing] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  useEffect(() => {
    const base = searchParams.get('base');
    if (base && comparing.length === 0) {
      const actualTrend = biomarkerTrends.find((t: any) => t.name === base || (t.rawNames && t.rawNames.includes(base)));
      if (actualTrend) {
        setComparing([actualTrend.name]);
      } else {
        setComparing([base]);
      }
    }
  }, [searchParams, biomarkerTrends, comparing.length]);

  const filteredTrends = biomarkerTrends.filter((t: any) => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--background)', color: 'var(--text-primary)', display: 'flex', flexDirection: 'column' }}>
      <header style={{ padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: '16px', backgroundColor: '#09090b' }}>
        <button onClick={() => router.push(`/snapshot/${snapshotId}`)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
        </button>
        <div>
          <h1 style={{ fontSize: '1.2rem', margin: 0 }}>Compare Biomarkers</h1>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{viewData.viewName}</div>
        </div>
      </header>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <aside style={{ width: '300px', borderRight: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', backgroundColor: '#121214' }}>
          <div style={{ padding: '16px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <input 
              type="text" 
              placeholder="Search biomarkers..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%', padding: '10px 14px', borderRadius: '8px', 
                backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                color: 'white', outline: 'none'
              }}
            />
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: '10px' }}>
            {filteredTrends.map((t: any) => (
              <div 
                key={t.name}
                onClick={() => {
                  if (comparing.includes(t.name)) {
                    setComparing(comparing.filter(n => n !== t.name));
                  } else {
                    setComparing([...comparing, t.name]);
                  }
                }}
                style={{
                  padding: '12px', cursor: 'pointer', borderRadius: '8px',
                  backgroundColor: comparing.includes(t.name) ? 'rgba(218, 165, 32, 0.15)' : 'transparent',
                  border: `1px solid ${comparing.includes(t.name) ? 'var(--primary)' : 'transparent'}`,
                  display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px'
                }}
              >
                <div style={{ 
                  width: '20px', height: '20px', borderRadius: '6px', 
                  border: `1px solid ${comparing.includes(t.name) ? 'var(--primary)' : 'var(--text-secondary)'}`, 
                  backgroundColor: comparing.includes(t.name) ? 'var(--primary)' : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  {comparing.includes(t.name) && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  )}
                </div>
                <span style={{ fontSize: '0.9rem', flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.name}</span>
              </div>
            ))}
            {filteredTrends.length === 0 && (
              <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-secondary)' }}>No biomarkers found.</div>
            )}
          </div>
        </aside>

        <main style={{ flex: 1, overflowY: 'auto', padding: '24px', backgroundColor: '#09090b' }}>
          {comparing.length === 0 ? (
            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
              Select biomarkers from the left panel to compare them.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '900px', margin: '0 auto' }}>
              {comparing.map((tName, idx) => {
                const trend = biomarkerTrends.find((x: any) => x.name === tName);
                if (!trend || !trend.dataPoints || trend.dataPoints.length === 0) return null;
                
                let defaultLow: number | null = null;
                let defaultHigh: number | null = null;
                const pts = [...trend.dataPoints].sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());
                
                for (let i = pts.length - 1; i >= 0; i--) {
                  if (pts[i].rangeHigh != null && defaultHigh == null) defaultHigh = pts[i].rangeHigh;
                  if (pts[i].rangeLow != null && defaultLow == null) defaultLow = pts[i].rangeLow;
                }

                const data = pts.map((dp: any) => {
                  const rHigh = dp.rangeHigh ?? defaultHigh ?? dp.value;
                  const rLow = dp.rangeLow ?? defaultLow ?? dp.value;
                  return {
                    rawDate: new Date(dp.date),
                    displayDate: new Date(dp.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                    value: dp.value,
                    isAbnormal: dp.isAbnormal,
                    rangeLow: rLow,
                    rangeHigh: rHigh
                  };
                });

                let minVal = Infinity;
                let maxVal = -Infinity;
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
                if (minVal >= maxVal) { minVal -= 10; maxVal += 10; }

                const color = COLORS[idx % COLORS.length];

                return (
                  <div 
                    key={tName} 
                    draggable
                    onDragStart={(e) => {
                      setDraggedItem(tName);
                      e.dataTransfer.effectAllowed = 'move';
                    }}
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.dataTransfer.dropEffect = 'move';
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      if (!draggedItem || draggedItem === tName) return;
                      const newComparing = [...comparing];
                      const draggedIdx = newComparing.indexOf(draggedItem);
                      const targetIdx = newComparing.indexOf(tName);
                      newComparing.splice(draggedIdx, 1);
                      newComparing.splice(targetIdx, 0, draggedItem);
                      setComparing(newComparing);
                      setDraggedItem(null);
                    }}
                    onDragEnd={() => setDraggedItem(null)}
                    style={{ 
                    backgroundColor: draggedItem === tName ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.02)', 
                    border: '1px solid rgba(255,255,255,0.05)', 
                    borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column',
                    cursor: 'grab', opacity: draggedItem === tName ? 0.5 : 1, transition: 'opacity 0.2s'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ cursor: 'grab', color: 'var(--text-secondary)' }}>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="8" y1="6" x2="21" y2="6"></line>
                            <line x1="8" y1="12" x2="21" y2="12"></line>
                            <line x1="8" y1="18" x2="21" y2="18"></line>
                            <line x1="3" y1="6" x2="3.01" y2="6"></line>
                            <line x1="3" y1="12" x2="3.01" y2="12"></line>
                            <line x1="3" y1="18" x2="3.01" y2="18"></line>
                          </svg>
                        </div>
                        <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>{tName}</h3>
                      </div>
                      <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: color }}>
                        {data[data.length - 1].value} {trend.unit}
                      </div>
                    </div>
                    
                    <div style={{ height: '240px', width: '100%' }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <XAxis dataKey="displayDate" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 10 }} minTickGap={20} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 10 }} domain={[minVal, maxVal]} />
                          <Tooltip 
                            content={({ active, payload, label }: any) => {
                              if (active && payload && payload.length) {
                                const d = payload[0].payload;
                                const rLow = d.rangeLow;
                                const rHigh = d.rangeHigh;
                                let rangeStr = "";
                                if (rLow != null && rHigh != null) {
                                  if (rLow === d.value && rHigh !== d.value) rangeStr = `< ${rHigh}`;
                                  else rangeStr = `${rLow} - ${rHigh}`;
                                } else if (defaultLow != null || defaultHigh != null) {
                                  if (defaultLow == null) rangeStr = `< ${defaultHigh}`;
                                  else rangeStr = `${defaultLow} - ${defaultHigh}`;
                                }
                                
                                return (
                                  <div className="bg-[#1e1e1e] border border-white/10 rounded-lg p-3 text-sm shadow-xl" style={{ backgroundColor: '#1e1e1e', border: '1px solid rgba(255,255,255,0.1)' }}>
                                    <p className="text-[var(--text-secondary)] mb-2 font-medium">{label}</p>
                                    <p className="font-bold mb-1" style={{ color: d.isAbnormal ? '#ef4444' : color }}>
                                      Result: {d.value}
                                    </p>
                                    {rangeStr && <p className="text-[var(--text-secondary)]">Normal Range: {rangeStr}</p>}
                                  </div>
                                );
                              }
                              return null;
                            }}
                          />
                          {(defaultLow != null || defaultHigh != null) && (
                            <ReferenceArea 
                              y1={defaultLow ?? minVal} 
                              y2={defaultHigh ?? maxVal} 
                              fill="rgba(34, 197, 94, 0.15)" 
                              strokeOpacity={0} 
                            />
                          )}
                          <Line type="monotone" dataKey="value" stroke={color} strokeWidth={3} dot={(props: any) => {
                            const { cx, cy, payload } = props;
                            return (
                              <circle key={`dot-${cx}-${cy}`} cx={cx} cy={cy} r={4} fill="var(--background)" stroke={payload.isAbnormal ? '#ef4444' : color} strokeWidth={payload.isAbnormal ? 3 : 2} />
                            );
                          }} activeDot={{ r: 6 }} />
                        </ComposedChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
