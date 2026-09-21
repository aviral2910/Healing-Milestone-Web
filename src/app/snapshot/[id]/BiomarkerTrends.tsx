'use client';

import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

export default function BiomarkerTrends({ trends }: { trends: any[] }) {
  if (!trends || trends.length === 0) return null;

  return (
    <div style={{ marginTop: '2rem', marginBottom: '2rem' }}>
      <h2 style={{ color: 'var(--text-primary)', marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: 'bold' }}>
        Biomarker Trends
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {trends.map((trend: any, idx: number) => {
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

          // Sort by date ascending for the chart
          data.sort((a: any, b: any) => a.rawDate.getTime() - b.rawDate.getTime());

          const rangeLow = data.find((d: any) => d.rangeLow !== null && d.rangeLow !== undefined)?.rangeLow;
          const rangeHigh = data.find((d: any) => d.rangeHigh !== null && d.rangeHigh !== undefined)?.rangeHigh;

          return (
            <div key={idx} style={{ 
              backgroundColor: 'var(--surface)', 
              borderRadius: '16px', 
              padding: '1.5rem',
              border: '1px solid rgba(255,255,255,0.05)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>{trend.name}</h3>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{trend.unit || ''}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ 
                    fontSize: '1.5rem', 
                    fontWeight: 'bold', 
                    color: data[data.length - 1].isAbnormal ? '#ef4444' : 'var(--primary)' 
                  }}>
                    {data[data.length - 1].value}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Latest</div>
                </div>
              </div>

              <div style={{ height: '180px', width: '100%', marginTop: '1rem' }}>
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
                      itemStyle={{ color: 'var(--primary)', fontWeight: 'bold' }}
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
                      stroke="var(--primary)" 
                      strokeWidth={3}
                      dot={{ fill: 'var(--surface)', stroke: 'var(--primary)', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, fill: 'var(--primary)', stroke: 'var(--surface)', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
