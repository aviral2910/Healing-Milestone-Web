'use client';

import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

function BiomarkerIcon({ name }: { name: string }) {
  // Simple heuristic for icons, similar to the main app
  const n = name.toLowerCase();
  let icon = '🧪'; // Default test tube
  if (n.includes('blood') || n.includes('hemoglobin') || n.includes('rbc') || n.includes('wbc')) icon = '🩸';
  else if (n.includes('glucose') || n.includes('sugar') || n.includes('a1c')) icon = '🍬';
  else if (n.includes('heart') || n.includes('pulse') || n.includes('bp') || n.includes('pressure')) icon = '❤️';
  else if (n.includes('weight') || n.includes('bmi')) icon = '⚖️';
  else if (n.includes('lipid') || n.includes('cholesterol') || n.includes('triglyceride')) icon = '🥓';
  else if (n.includes('liver') || n.includes('sgot') || n.includes('sgpt') || n.includes('alt') || n.includes('ast')) icon = '🔬'; // Liver
  else if (n.includes('kidney') || n.includes('creatinine') || n.includes('urea') || n.includes('egfr')) icon = '💧';
  else if (n.includes('thyroid') || n.includes('tsh') || n.includes('t3') || n.includes('t4')) icon = '🦋';

  return (
    <div style={{
      width: '40px',
      height: '40px',
      borderRadius: '12px',
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '20px',
      flexShrink: 0
    }}>
      {icon}
    </div>
  );
}

function BiomarkerCard({ trend }: { trend: any }) {
  const [expanded, setExpanded] = useState(false);

  // Format data for Recharts
  const data = trend.dataPoints.map((dp: any) => {
    const date = new Date(dp.date);
    return {
      rawDate: date,
      displayDate: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      value: dp.value,
      rangeLow: dp.rangeLow,
      rangeHigh: dp.rangeHigh,
      isAbnormal: dp.isAbnormal
    };
  });

  data.sort((a: any, b: any) => a.rawDate.getTime() - b.rawDate.getTime());
  const latest = data[data.length - 1];
  const isAbnormal = latest.isAbnormal;

  const rangeLow = data.find((d: any) => d.rangeLow !== null && d.rangeLow !== undefined)?.rangeLow;
  const rangeHigh = data.find((d: any) => d.rangeHigh !== null && d.rangeHigh !== undefined)?.rangeHigh;

  const primaryColor = '#eab308'; // Matches the main app's yellowish primary color for snapshot text

  return (
    <div 
      onClick={() => setExpanded(!expanded)}
      style={{
        backgroundColor: 'var(--surface)',
        borderRadius: '20px',
        border: `1px solid ${isAbnormal ? 'rgba(239, 68, 68, 0.3)' : 'rgba(234, 179, 8, 0.3)'}`,
        boxShadow: isAbnormal ? '0 2px 8px rgba(239, 68, 68, 0.05)' : '0 2px 8px rgba(0, 0, 0, 0.02)',
        padding: '16px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 3 }}>
          <BiomarkerIcon name={trend.name} />
          <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            {trend.name}
          </h3>
        </div>
        
        <div style={{ flex: 2, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center' }}>
          <div style={{ 
            fontSize: '1.25rem', 
            fontWeight: 'bold', 
            color: isAbnormal ? '#ef4444' : primaryColor,
            lineHeight: '1.2'
          }}>
            {latest.value}
          </div>
          {trend.unit && (
            <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.6)' }}>
              {trend.unit}
            </div>
          )}
        </div>
      </div>

      {expanded && (
        <div style={{ height: '200px', width: '100%', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
           <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis 
                  dataKey="displayDate" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'var(--text-secondary)', fontSize: 10 }}
                  minTickGap={20}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'var(--text-secondary)', fontSize: 10 }}
                  domain={['auto', 'auto']}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e1e1e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'var(--text-primary)' }}
                  itemStyle={{ color: primaryColor, fontWeight: 'bold' }}
                  labelStyle={{ color: 'var(--text-secondary)', marginBottom: '4px' }}
                />
                {rangeLow !== undefined && (
                  <ReferenceLine y={rangeLow} stroke="#ef4444" strokeDasharray="3 3" opacity={0.3} />
                )}
                {rangeHigh !== undefined && (
                  <ReferenceLine y={rangeHigh} stroke="#ef4444" strokeDasharray="3 3" opacity={0.3} />
                )}
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke={primaryColor} 
                  strokeWidth={3}
                  dot={{ fill: 'var(--surface)', stroke: primaryColor, strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: primaryColor, stroke: 'var(--surface)', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

export default function BiomarkerTrends({ trends }: { trends: any[] }) {
  if (!trends || trends.length === 0) return null;

  return (
    <div style={{ marginTop: '2rem', marginBottom: '2rem' }}>
      <h2 style={{ color: 'var(--text-primary)', marginBottom: '1.5rem', fontSize: '1.2rem', fontWeight: 'bold' }}>
        Biomarkers & Metrics
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {trends.map((trend: any, idx: number) => (
          <BiomarkerCard key={idx} trend={trend} />
        ))}
      </div>
    </div>
  );
}
