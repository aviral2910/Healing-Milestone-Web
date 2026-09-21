'use client';

import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, Legend } from 'recharts';

function BiomarkerIcon({ name }: { name: string }) {
  const n = name.toLowerCase();
  let icon = '🧪';
  if (n.includes('blood') || n.includes('hemoglobin') || n.includes('rbc') || n.includes('wbc')) icon = '🩸';
  else if (n.includes('glucose') || n.includes('sugar') || n.includes('a1c')) icon = '🍬';
  else if (n.includes('heart') || n.includes('pulse') || n.includes('bp') || n.includes('pressure')) icon = '❤️';
  else if (n.includes('weight') || n.includes('bmi')) icon = '⚖️';
  else if (n.includes('lipid') || n.includes('cholesterol') || n.includes('triglyceride')) icon = '🥓';
  else if (n.includes('liver') || n.includes('sgot') || n.includes('sgpt') || n.includes('alt') || n.includes('ast')) icon = '🔬';
  else if (n.includes('kidney') || n.includes('creatinine') || n.includes('urea') || n.includes('egfr')) icon = '💧';
  else if (n.includes('thyroid') || n.includes('tsh') || n.includes('t3') || n.includes('t4')) icon = '🦋';

  return (
    <div style={{
      width: '40px', height: '40px', borderRadius: '12px',
      backgroundColor: 'rgba(255, 255, 255, 0.05)', display: 'flex',
      alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0
    }}>
      {icon}
    </div>
  );
}

const COLORS = ['#eab308', '#3b82f6', '#10b981', '#a855f7', '#ec4899', '#f97316', '#06b6d4'];

function BiomarkerCard({ trend, onCompare }: { trend: any, onCompare: (e: React.MouseEvent) => void }) {
  const [expanded, setExpanded] = useState(false);
  const data = trend.dataPoints.map((dp: any) => ({
    rawDate: new Date(dp.date),
    displayDate: new Date(dp.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    value: dp.value,
    rangeLow: dp.rangeLow,
    rangeHigh: dp.rangeHigh,
    isAbnormal: dp.isAbnormal
  })).sort((a: any, b: any) => a.rawDate.getTime() - b.rawDate.getTime());
  
  const latest = data[data.length - 1];
  const isAbnormal = latest.isAbnormal;
  const primaryColor = '#eab308';
  
  return (
    <div onClick={() => setExpanded(!expanded)} style={{
      backgroundColor: 'var(--surface)', borderRadius: '20px',
      border: `1px solid ${isAbnormal ? 'rgba(239, 68, 68, 0.3)' : 'rgba(234, 179, 8, 0.3)'}`,
      padding: '16px', display: 'flex', flexDirection: 'column', cursor: 'pointer'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 3 }}>
          <BiomarkerIcon name={trend.name} />
          <div>
            <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              {trend.name}
            </h3>
            <button 
              onClick={onCompare}
              style={{ 
                background: 'none', border: 'none', color: 'var(--primary)', 
                fontSize: '0.8rem', padding: '4px 0 0 0', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '4px'
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="20" x2="18" y2="10"></line>
                <line x1="12" y1="20" x2="12" y2="4"></line>
                <line x1="6" y1="20" x2="6" y2="14"></line>
              </svg>
              Compare
            </button>
          </div>
        </div>
        
        <div style={{ flex: 2, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center' }}>
          <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: isAbnormal ? '#ef4444' : primaryColor, lineHeight: '1.2' }}>
            {latest.value}
          </div>
          {trend.unit && <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.6)' }}>{trend.unit}</div>}
        </div>
      </div>

      {expanded && (
        <div style={{ height: '200px', width: '100%', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
           <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="displayDate" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 10 }} minTickGap={20} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 10 }} domain={['auto', 'auto']} />
                <Tooltip contentStyle={{ backgroundColor: '#1e1e1e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'var(--text-primary)' }} itemStyle={{ color: primaryColor, fontWeight: 'bold' }} />
                <Line type="monotone" dataKey="value" stroke={primaryColor} strokeWidth={3} dot={{ fill: 'var(--surface)', stroke: primaryColor, strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

export default function BiomarkerTrends({ trends }: { trends: any[] }) {
  const [comparing, setComparing] = useState<string[]>([]);
  const [showCompareModal, setShowCompareModal] = useState(false);

  if (!trends || trends.length === 0) return null;

  const handleCompareClick = (trendName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setComparing([trendName]);
    setShowCompareModal(true);
  };

  const toggleCompare = (trendName: string) => {
    if (comparing.includes(trendName)) {
      setComparing(comparing.filter(n => n !== trendName));
    } else {
      setComparing([...comparing, trendName]);
    }
  };

  const compiledCompareData = useMemo(() => {
    const dataMap: { [date: string]: any } = {};
    comparing.forEach(tName => {
      const t = trends.find(x => x.name === tName);
      if (t) {
        t.dataPoints.forEach((dp: any) => {
          const dateStr = new Date(dp.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
          const rawDate = new Date(dp.date).getTime();
          if (!dataMap[dateStr]) dataMap[dateStr] = { displayDate: dateStr, rawDate };
          dataMap[dateStr][tName] = dp.value;
        });
      }
    });
    const arr = Object.values(dataMap);
    arr.sort((a, b) => a.rawDate - b.rawDate);
    return arr;
  }, [comparing, trends]);

  return (
    <div style={{ marginTop: '2rem', marginBottom: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ color: 'var(--text-primary)', fontSize: '1.2rem', fontWeight: 'bold', margin: 0 }}>
          Biomarkers & Metrics
        </h2>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {trends.map((trend: any, idx: number) => (
          <BiomarkerCard key={idx} trend={trend} onCompare={(e) => handleCompareClick(trend.name, e)} />
        ))}
      </div>

      {showCompareModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9999, backgroundColor: 'rgba(0,0,0,0.9)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1rem'
        }}>
          <div style={{
            backgroundColor: 'var(--background)', width: '100%', maxWidth: '800px', height: '80vh',
            borderRadius: '24px', display: 'flex', flexDirection: 'column', overflow: 'hidden',
            border: '1px solid var(--border)'
          }}>
            <div style={{ padding: '20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-primary)' }}>Compare Biomarkers</h2>
              <button onClick={() => setShowCompareModal(false)} style={{ background: 'none', border: 'none', color: 'white', fontSize: '24px', cursor: 'pointer' }}>&times;</button>
            </div>
            
            <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
              <div style={{ width: '250px', borderRight: '1px solid var(--border)', overflowY: 'auto', padding: '10px' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '10px', padding: '0 10px', textTransform: 'uppercase' }}>Select to Compare</div>
                {trends.map(t => (
                  <div 
                    key={t.name}
                    onClick={() => toggleCompare(t.name)}
                    style={{
                      padding: '10px', cursor: 'pointer', borderRadius: '8px',
                      backgroundColor: comparing.includes(t.name) ? 'rgba(var(--primary-rgb, 218, 165, 32), 0.15)' : 'transparent',
                      border: `1px solid ${comparing.includes(t.name) ? 'var(--primary)' : 'transparent'}`,
                      display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px'
                    }}
                  >
                    <div style={{ width: '16px', height: '16px', borderRadius: '4px', border: '1px solid var(--text-secondary)', backgroundColor: comparing.includes(t.name) ? 'var(--primary)' : 'transparent' }} />
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)', flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.name}</span>
                  </div>
                ))}
              </div>
              
              <div style={{ flex: 1, padding: '20px', display: 'flex', flexDirection: 'column' }}>
                {comparing.length === 0 ? (
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
                    Select biomarkers from the left to compare
                  </div>
                ) : (
                  <div style={{ flex: 1, minHeight: '300px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={compiledCompareData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                        <XAxis dataKey="displayDate" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} minTickGap={30} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} />
                        <Tooltip contentStyle={{ backgroundColor: '#1e1e1e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'var(--text-primary)' }} />
                        <Legend />
                        {comparing.map((tName, i) => (
                          <Line 
                            key={tName} 
                            type="monotone" 
                            dataKey={tName} 
                            name={tName}
                            stroke={COLORS[i % COLORS.length]} 
                            strokeWidth={3}
                            dot={{ fill: 'var(--surface)', stroke: COLORS[i % COLORS.length], strokeWidth: 2, r: 4 }}
                            activeDot={{ r: 6 }}
                            connectNulls
                          />
                        ))}
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
