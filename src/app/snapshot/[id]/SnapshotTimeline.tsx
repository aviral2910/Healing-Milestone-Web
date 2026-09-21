'use client';
import { safeUtcDate } from '@/utils/dateUtils';

import { useState, useMemo, useEffect } from 'react';
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
      width: '32px', height: '32px', borderRadius: '8px',
      backgroundColor: 'rgba(255, 255, 255, 0.05)', display: 'flex',
      alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0
    }}>
      {icon}
    </div>
  );
}


const COLORS = ['#eab308', '#3b82f6', '#10b981', '#a855f7', '#ec4899', '#f97316', '#06b6d4'];

function InlineBiomarkerCard({ biomarker, trend, onCompare }: { biomarker: any, trend: any, onCompare: () => void }) {
  const [expanded, setExpanded] = useState(false);

  let data = [];
  if (trend) {
    data = trend.dataPoints.map((dp: any) => ({
      rawDate: new Date(dp.date),
      displayDate: new Date(dp.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      value: dp.value,
      isAbnormal: dp.isAbnormal
    })).sort((a: any, b: any) => a.rawDate.getTime() - b.rawDate.getTime());
  }

  const primaryColor = '#eab308';

  return (
    <div 
      onClick={() => setExpanded(!expanded)} 
      style={{ 
        display: 'flex', flexDirection: 'column', cursor: 'pointer',
        padding: '12px', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '12px',
        border: `1px solid ${biomarker.isAbnormal ? 'rgba(239, 68, 68, 0.3)' : (expanded ? 'var(--primary)' : 'rgba(255,255,255,0.05)')}`,
        boxShadow: expanded ? '0 4px 12px rgba(0,0,0,0.2)' : '0 2px 4px rgba(0,0,0,0.05)',
        transition: 'all 0.2s ease'
      }} 
      className="biomarker-hover-card"
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <BiomarkerIcon name={biomarker.rawName} />
          <span style={{ color: 'var(--text-primary)', fontSize: '0.95rem', fontWeight: 500 }}>{biomarker.rawName}</span>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span style={{ 
            color: biomarker.isAbnormal ? '#ef4444' : 'var(--primary)', 
            fontWeight: 'bold', fontSize: '1.1rem' 
          }}>
            {biomarker.resultType === 'numeric' ? biomarker.valueNumeric : biomarker.valueText}
          </span>
          {biomarker.rawUnit && (
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginLeft: '4px' }}>
              {biomarker.rawUnit}
            </span>
          )}
        </div>
      </div>

      {expanded && trend && data.length > 0 && (
        <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '10px' }}>
            <button 
              onClick={(e) => { e.stopPropagation(); onCompare(); }}
              style={{ 
                background: 'rgba(218, 165, 32, 0.1)', border: '1px solid rgba(218, 165, 32, 0.3)', color: 'var(--primary)', 
                fontSize: '0.8rem', padding: '6px 12px', cursor: 'pointer', borderRadius: '8px',
                display: 'flex', alignItems: 'center', gap: '6px'
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
          <div style={{ height: '200px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="displayDate" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 10 }} minTickGap={20} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 10 }} domain={['auto', 'auto']} />
                <Tooltip contentStyle={{ backgroundColor: '#1e1e1e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'var(--text-primary)' }} itemStyle={{ color: primaryColor, fontWeight: 'bold' }} />
                <Line type="monotone" dataKey="value" stroke={primaryColor} strokeWidth={3} dot={{ fill: 'var(--surface)', stroke: primaryColor, strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
      
      {expanded && !trend && (
        <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.05)', color: 'var(--text-secondary)', fontSize: '0.85rem', textAlign: 'center' }}>
          No historical trend data available for this biomarker.
        </div>
      )}
    </div>
  );
}

export default function SnapshotTimeline({ timeline, expiresAt, biomarkerTrends }: { timeline: any[], expiresAt: string, biomarkerTrends: any[] }) {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [comparing, setComparing] = useState<string[]>([]);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [filter, setFilter] = useState<'all' | 'milestones' | 'medical_records' | 'reports' | 'prescriptions' | 'biomarkers'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  const openLightbox = (url: string, e: React.MouseEvent) => {
    e.preventDefault();
    setSelectedFile(url);
  };

  const closeLightbox = () => {
    setSelectedFile(null);
  };

  // Prevent body scrolling when lightbox is open (fixes mobile background jump/flicker)
  useEffect(() => {
    if (selectedFile) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [selectedFile]);

  // Memoize heavy calculations to prevent re-rendering flicker when opening lightbox
  const { groupedArray, countMilestones, countMedicalRecords, countReports, countPrescriptions } = useMemo(() => {
    // 1. Filter
    const filtered = timeline.filter(item => {
      if (filter === 'milestones' && item.type !== 'milestone') return false;
      if (filter === 'medical_records' && item.type !== 'report') return false;
      if (filter === 'reports' && (item.type !== 'report' || item.category === 'prescription')) return false;
      if (filter === 'prescriptions' && (item.type !== 'report' || item.category !== 'prescription')) return false;
      if (filter === 'biomarkers' && (!item.biomarkers || item.biomarkers.length === 0)) return false;
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const textMatch = item.text?.toLowerCase().includes(query);
        const titleMatch = item.title?.toLowerCase().includes(query);
        const tagMatch = item.tags?.some((t: string) => t.toLowerCase().includes(query));
        const biomarkerMatch = item.biomarkers?.some((b: any) => 
            b.rawName?.toLowerCase().includes(query) || 
            b.valueText?.toLowerCase().includes(query)
        );
        if (!textMatch && !titleMatch && !tagMatch && !biomarkerMatch) return false;
      }
      return true;
    });

    // 2. Sort
    const sorted = [...filtered].sort((a, b) => {
      const dateA = safeUtcDate(a.date || 0).getTime();
      const dateB = safeUtcDate(b.date || 0).getTime();
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });

    // 3. Group
    const grouped: { dateStr: string, items: any[] }[] = [];
    sorted.forEach(item => {
      const dateStr = item.date
        ? new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(safeUtcDate(item.date))
        : 'Unknown Date';
      const lastGroup = grouped[grouped.length - 1];
      if (!lastGroup || lastGroup.dateStr !== dateStr) {
        grouped.push({ dateStr, items: [item] });
      } else {
        lastGroup.items.push(item);
      }
    });

    return {
      groupedArray: grouped,
      countMilestones: timeline.filter(i => i.type === 'milestone').length,
      countMedicalRecords: timeline.filter(i => i.type === 'report').length,
      countReports: timeline.filter(i => i.type === 'report' && i.category !== 'prescription').length,
      countPrescriptions: timeline.filter(i => i.type === 'report' && i.category === 'prescription').length
    };
  }, [timeline, filter, searchQuery, sortOrder]);

  return (
    <div className="milestones-timeline" style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* HEADER CONTROLS (Search, Sort, Filters) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '1.5rem', marginBottom: '0.5rem' }}>
        
        {/* Search & Sort Row */}
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <input 
              type="text" 
              placeholder="Search symptoms, reports, tags..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ 
                width: '100%', padding: '12px 16px', borderRadius: '12px', 
                backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', 
                color: 'var(--text-primary)', fontSize: '0.95rem', outline: 'none',
                transition: 'border-color 0.2s ease'
              }} 
              onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
            />
          </div>
          <button 
            onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
            style={{
              padding: '12px 16px', borderRadius: '12px', cursor: 'pointer',
              backgroundColor: 'rgba(255,255,255,0.03)', color: 'var(--text-primary)',
              border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '500',
              transition: 'all 0.2s ease', whiteSpace: 'nowrap'
            }}
            onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
            onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {sortOrder === 'desc' 
                ? <><path d="M12 5v14M19 12l-7 7-7-7"/></> 
                : <><path d="M12 19V5M5 12l7-7 7 7"/></>}
            </svg>
            {sortOrder === 'desc' ? 'Newest First' : 'Oldest First'}
          </button>
        </div>

        {/* Quick Filters Row */}
        <div className="hide-scrollbar" style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
          <button 
            onClick={() => setFilter('all')}
            style={{
              padding: '8px 16px', borderRadius: '20px', fontWeight: '500', fontSize: '0.9rem', cursor: 'pointer',
              backgroundColor: filter === 'all' ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
              color: filter === 'all' ? '#000' : 'var(--text-primary)',
              border: filter === 'all' ? '1px solid var(--primary)' : '1px solid var(--border)',
              transition: 'all 0.2s', whiteSpace: 'nowrap'
            }}
          >
            All ({timeline.length})
          </button>
          <button 
            onClick={() => setFilter('medical_records')}
            style={{
              padding: '8px 16px', borderRadius: '20px', fontWeight: '500', fontSize: '0.9rem', cursor: 'pointer',
              backgroundColor: filter === 'medical_records' ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
              color: filter === 'medical_records' ? '#000' : 'var(--text-primary)',
              border: filter === 'medical_records' ? '1px solid var(--primary)' : '1px solid var(--border)',
              transition: 'all 0.2s', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '6px'
            }}
          >
            📁 Medical Records ({countMedicalRecords})
          </button>
          <button 
            onClick={() => setFilter('reports')}
            style={{
              padding: '8px 16px', borderRadius: '20px', fontWeight: '500', fontSize: '0.9rem', cursor: 'pointer',
              backgroundColor: filter === 'reports' ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
              color: filter === 'reports' ? '#000' : 'var(--text-primary)',
              border: filter === 'reports' ? '1px solid var(--primary)' : '1px solid var(--border)',
              transition: 'all 0.2s', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '6px'
            }}
          >
            📄 Reports ({countReports})
          </button>
          <button 
            onClick={() => setFilter('prescriptions')}
            style={{
              padding: '8px 16px', borderRadius: '20px', fontWeight: '500', fontSize: '0.9rem', cursor: 'pointer',
              backgroundColor: filter === 'prescriptions' ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
              color: filter === 'prescriptions' ? '#000' : 'var(--text-primary)',
              border: filter === 'prescriptions' ? '1px solid var(--primary)' : '1px solid var(--border)',
              transition: 'all 0.2s', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '6px'
            }}
          >
            💊 Prescriptions ({countPrescriptions})
          </button>
          <button 
            onClick={() => setFilter('biomarkers')}
            style={{
              padding: '8px 16px', borderRadius: '20px', fontWeight: '500', fontSize: '0.9rem', cursor: 'pointer',
              backgroundColor: filter === 'biomarkers' ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
              color: filter === 'biomarkers' ? '#000' : 'var(--text-primary)',
              border: filter === 'biomarkers' ? '1px solid var(--primary)' : '1px solid var(--border)',
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap'
            }}
          >
            🧪 Has Biomarkers
          </button>
          <button 
            onClick={() => setFilter('milestones')}
            style={{
              padding: '8px 16px', borderRadius: '20px', fontWeight: '500', fontSize: '0.9rem', cursor: 'pointer',
              backgroundColor: filter === 'milestones' ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
              color: filter === 'milestones' ? '#000' : 'var(--text-primary)',
              border: filter === 'milestones' ? '1px solid var(--primary)' : '1px solid var(--border)',
              transition: 'all 0.2s', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '6px'
            }}
          >
            📝 Journals ({countMilestones})
          </button>
        </div>

      </div>
      
      {groupedArray.length > 0 ? (
        <div className="timeline-container" style={{ position: 'relative', paddingLeft: '2.5rem' }}>
          
          {groupedArray.map((group, groupIndex) => (
            <div key={group.dateStr} style={{ position: 'relative', paddingBottom: '1.5rem', paddingTop: groupIndex > 0 ? '2rem' : '0' }}>
              
              {/* SUBTLE DIVIDER */}
              {groupIndex > 0 && (
                <div style={{ position: 'absolute', top: '0', left: '-40px', right: '0', height: '1px', backgroundColor: 'rgba(255,255,255,0.06)' }}></div>
              )}

              {/* BROKEN VERTICAL LINE JUST FOR THIS DATE GROUP */}
              <div style={{ position: 'absolute', left: '-29px', top: groupIndex > 0 ? '48px' : '16px', bottom: '0', width: '2px', backgroundColor: 'rgba(255, 255, 255, 0.15)' }}></div>

              {/* DATE HEADER ON TIMELINE */}
              <div style={{ position: 'relative', marginBottom: '1.5rem', display: 'flex', alignItems: 'center' }}>
                <div style={{ 
                  position: 'absolute', left: '-35px', width: '14px', height: '14px', 
                  borderRadius: '50%', backgroundColor: 'var(--background)', border: '2px solid rgba(255,255,255,0.6)', zIndex: 2 
                }}></div>
                <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)', fontWeight: 'bold', letterSpacing: '0.5px' }}>{group.dateStr}</h3>
              </div>

              {group.items.map((item: any) => {
                const itemTimeStr = item.date
                  ? new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit' }).format(safeUtcDate(item.date))
                  : '';
                
                if (item.type === 'milestone') {
                  const tags = item.tags || [];
                  return (
                    <div key={`m-${item.id}`} className="milestone-card" style={{ position: 'relative', marginBottom: '2rem' }}>
                      <div style={{ 
                        position: 'absolute', left: '-35px', top: '24px', width: '12px', height: '12px', 
                        borderRadius: '50%', backgroundColor: 'var(--primary)', boxShadow: '0 0 10px var(--glow)', zIndex: 2
                      }}></div>
                      <div className="interactive-card" style={{ backgroundColor: 'var(--surface)', borderRadius: '16px', padding: '1.5rem', border: '1px solid var(--border)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            {tags.length > 0 ? (
                              tags.map((tag: string, idx: number) => {
                                const t = tag.toLowerCase();
                                let bgColor = 'rgba(250, 204, 21, 0.1)';
                                let textColor = 'var(--primary)';
                                
                                if (['proud', 'hopeful', 'relieved', 'grateful', 'determined'].includes(t)) {
                                  textColor = '#5FA072'; // Sage Green
                                  bgColor = 'rgba(95, 160, 114, 0.1)';
                                } else if (['anxious', 'grieving', 'exhausted', 'frustrated', 'overwhelmed', 'isolated'].includes(t)) {
                                  textColor = '#9B7EBD'; // Muted Purple
                                  bgColor = 'rgba(155, 126, 189, 0.1)';
                                } else if (['neutral', 'reflective', 'waiting'].includes(t)) {
                                  textColor = '#9CA3AF'; // Cool Grey
                                  bgColor = 'rgba(156, 163, 175, 0.1)';
                                }

                                return (
                                  <span key={idx} style={{ 
                                    backgroundColor: bgColor, color: textColor, 
                                    padding: '4px 12px', borderRadius: '16px', fontSize: '0.8rem', fontWeight: '700', letterSpacing: '0.5px' 
                                  }}>
                                    {tag.replace('_', ' ').toUpperCase()}
                                  </span>
                                );
                              })
                            ) : (
                              <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>Journal Update</span>
                            )}
                          </div>
                          <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', whiteSpace: 'nowrap', marginLeft: '12px' }}>{itemTimeStr}</div>
                        </div>
                        {item.mediaUrl && (
                          <div style={{ marginBottom: '1rem', borderRadius: '12px', overflow: 'hidden' }}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img onClick={(e) => openLightbox(item.mediaUrl, e)} src={item.mediaUrl} alt="Media" className="media-hover-card" style={{ width: '100%', height: 'auto', display: 'block', cursor: 'zoom-in' }} />
                          </div>
                        )}
                        {item.text && (
                          <div style={{ color: '#eaeaea', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>{item.text}</div>
                        )}
                      </div>
                    </div>
                  );
                } else if (item.type === 'report') {
                  const files = item.files || [];
                  const imageFiles = files.filter((f: any) => {
                    const u = typeof f === 'string' ? f : f.url;
                    return u?.toLowerCase().match(/\.(jpeg|jpg|gif|png|webp)$/);
                  });
                  const pdfFiles = files.filter((f: any) => {
                    const u = typeof f === 'string' ? f : f.url;
                    return !u?.toLowerCase().match(/\.(jpeg|jpg|gif|png|webp)$/);
                  });

                  const imageGridCols = imageFiles.length === 1 ? '1fr' : '1fr 1fr';
                  const pdfGridCols = pdfFiles.length === 1 ? '1fr' : '1fr 1fr';

                  return (
                    <div key={`r-${item.id}`} className="milestone-card" style={{ position: 'relative', marginBottom: '2rem' }}>
                      {/* DYNAMIC ICON */}
                      <div style={{ 
                        position: 'absolute', left: '-41px', top: '16px', width: '24px', height: '24px', 
                        borderRadius: '50%', backgroundColor: 'var(--primary)', boxShadow: '0 0 10px var(--glow)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2
                      }}>
                        {item.category === 'prescription' ? (
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M10 2v7.31"></path>
                            <path d="M14 9.3V1.99"></path>
                            <path d="M8.5 2h7"></path>
                            <path d="M14 9.3a6.5 6.5 0 1 1-4 0"></path>
                            <path d="M5.52 16h12.96"></path>
                          </svg>
                        ) : (
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                            <line x1="16" y1="13" x2="8" y2="13"></line>
                            <line x1="16" y1="17" x2="8" y2="17"></line>
                            <polyline points="10 9 9 9 8 9"></polyline>
                          </svg>
                        )}
                      </div>

                      <div className="interactive-card" style={{ backgroundColor: 'var(--surface)', borderRadius: '16px', padding: '1.5rem', border: '1px solid var(--border)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                          <div style={{ fontWeight: '600', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'rgba(var(--primary-rgb, 218, 165, 32), 0.15)', padding: '4px 8px', borderRadius: '12px', border: '1px solid rgba(var(--primary-rgb, 218, 165, 32), 0.3)' }}>
                            {item.category === 'prescription' ? (
                              <>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M10 2v7.31"></path>
                                  <path d="M14 9.3V1.99"></path>
                                  <path d="M8.5 2h7"></path>
                                  <path d="M14 9.3a6.5 6.5 0 1 1-4 0"></path>
                                  <path d="M5.52 16h12.96"></path>
                                </svg>
                                <span style={{ fontSize: '0.8rem' }}>Prescription</span>
                              </>
                            ) : (
                              <>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                  <polyline points="14 2 14 8 20 8"></polyline>
                                </svg>
                                <span style={{ fontSize: '0.8rem' }}>Report</span>
                              </>
                            )}
                          </div>
                          <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{itemTimeStr}</div>
                        </div>
                        <h3 style={{ margin: '0 0 1rem 0', color: 'var(--text-primary)', fontSize: '1.1rem' }}>{item.title}</h3>
                        
                        {/* SEPARATE IMAGES GRID */}
                        {imageFiles.length > 0 && (
                          <div style={{ display: 'grid', gridTemplateColumns: imageGridCols, gap: '1rem', marginBottom: pdfFiles.length > 0 ? '1rem' : '0' }}>
                            {imageFiles.map((file: any, index: number) => {
                              const url = typeof file === 'string' ? file : file.url;
                              return (
                                <div 
                                  key={`img-${index}`} 
                                  onClick={(e) => openLightbox(url, e)}
                                  className="media-hover-card"
                                  style={{ 
                                    position: 'relative', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', 
                                    overflow: 'hidden', backgroundColor: 'rgba(0,0,0,0.3)', height: '180px', cursor: 'zoom-in' 
                                  }}
                                >
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img src={url} alt={`Document ${index + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {/* SEPARATE PDFS GRID */}
                        {pdfFiles.length > 0 && (
                          <div style={{ display: 'grid', gridTemplateColumns: pdfGridCols, gap: '1rem' }}>
                            {pdfFiles.map((file: any, index: number) => {
                              const url = typeof file === 'string' ? file : file.url;
                              return (
                                <div 
                                  key={`pdf-${index}`} 
                                  onClick={() => window.open(url, '_blank')}
                                  className="pdf-hover-card"
                                  style={{ 
                                    position: 'relative', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', 
                                    backgroundColor: 'rgba(255,255,255,0.03)', height: '120px', cursor: 'pointer',
                                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
                                  }}
                                >
                                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '12px' }}>
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                    <polyline points="14 2 14 8 20 8"></polyline>
                                    <line x1="16" y1="13" x2="8" y2="13"></line>
                                    <line x1="16" y1="17" x2="8" y2="17"></line>
                                    <polyline points="10 9 9 9 8 9"></polyline>
                                  </svg>
                                  <span style={{ color: 'var(--text-primary)', fontWeight: '500', fontSize: '0.95rem' }}>View PDF Document</span>
                                </div>
                              );
                            })}
                          </div>
                        )}
                        {/* BIOMARKERS LIST */}
                        {item.biomarkers && item.biomarkers.length > 0 && (
                          <div style={{ marginTop: '1.5rem' }}>
                            <h4 style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                              Extracted Biomarkers
                            </h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                              {item.biomarkers.map((b: any, idx: number) => (
                                <InlineBiomarkerCard 
                                  key={idx} 
                                  biomarker={b} 
                                  trend={biomarkerTrends.find(t => t.name === b.rawName)}
                                  onCompare={() => {
                                    setComparing([b.rawName]);
                                    setShowCompareModal(true);
                                  }}
                                />
                              ))}
                            </div>
                          </div>
                        )}


                      </div>
                    </div>
                  );
                }
              })}
            </div>
          ))}
        </div>
      ) : (
        <div className="no-milestones" style={{ color: 'var(--text-secondary)', padding: '2rem 0', textAlign: 'center' }}>
          No timeline items match this search/filter.
        </div>
      )}
      
      <div className="interaction-prompt" style={{ marginTop: '24px', textAlign: 'center', padding: '1.5rem', backgroundColor: 'rgba(239, 68, 68, 0.05)', borderRadius: '16px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
        <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.9rem' }}>
          <strong style={{ color: 'var(--text-primary)' }}>Secure Snapshot</strong><br/>
          This view is read-only and will automatically expire and permanently self-destruct on {expiresAt}.
        </p>
      </div>

      {/* COMPARE MODAL */}
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
                {biomarkerTrends.map(t => (
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
                {(() => {
                  if (comparing.length === 0) {
                    return (
                      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
                        Select biomarkers from the left to compare
                      </div>
                    );
                  }
                  
                  const dataMap: { [date: string]: any } = {};
                  comparing.forEach(tName => {
                    const t = biomarkerTrends.find(x => x.name === tName);
                    if (t) {
                      t.dataPoints.forEach((dp: any) => {
                        const dateStr = new Date(dp.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                        const rawDate = new Date(dp.date).getTime();
                        if (!dataMap[dateStr]) dataMap[dateStr] = { displayDate: dateStr, rawDate };
                        dataMap[dateStr][tName] = dp.value;
                      });
                    }
                  });
                  const compiledCompareData = Object.values(dataMap).sort((a, b) => a.rawDate - b.rawDate);
                  
                  return (
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
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* LIGHTBOX MODAL */}
      {selectedFile && (
        <div 
          onClick={closeLightbox}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999, backgroundColor: 'rgba(0,0,0,0.9)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            padding: '2rem', cursor: 'zoom-out'
          }}
        >
          <div 
            onClick={closeLightbox}
            style={{ position: 'absolute', top: '1rem', right: '2rem', color: 'white', cursor: 'pointer', fontSize: '2.5rem', zIndex: 10000 }}
          >
            &times;
          </div>
          
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img onClick={e => e.stopPropagation()} src={selectedFile} alt="Fullscreen Document" style={{ maxWidth: '100%', maxHeight: '85vh', objectFit: 'contain', cursor: 'default' }} />
        </div>
      )}
    </div>
  );
}
