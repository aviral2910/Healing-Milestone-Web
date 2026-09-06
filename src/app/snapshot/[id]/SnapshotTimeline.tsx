'use client';

import { useState } from 'react';

export default function SnapshotTimeline({ timeline, expiresAt }: { timeline: any[], expiresAt: string }) {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'milestones' | 'reports'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  const openLightbox = (url: string, e: React.MouseEvent) => {
    e.preventDefault();
    setSelectedFile(url);
  };

  const closeLightbox = () => {
    setSelectedFile(null);
  };

  // 1. Filter the timeline (Type + Search)
  const filteredTimeline = timeline.filter(item => {
    // Type filter
    if (filter === 'milestones' && item.type !== 'milestone') return false;
    if (filter === 'reports' && item.type !== 'report') return false;
    
    // Search filter
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      const textMatch = item.text?.toLowerCase().includes(query);
      const titleMatch = item.title?.toLowerCase().includes(query);
      const tagMatch = item.tags?.some((t: string) => t.toLowerCase().includes(query));
      if (!textMatch && !titleMatch && !tagMatch) return false;
    }
    return true;
  });

  // 2. Sort the timeline
  const sortedTimeline = [...filteredTimeline].sort((a, b) => {
    const dateA = new Date(a.date || 0).getTime();
    const dateB = new Date(b.date || 0).getTime();
    return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
  });

  // 3. Group timeline items by date (Preserving Sort Order)
  const groupedArray: { dateStr: string, items: any[] }[] = [];
  sortedTimeline.forEach(item => {
    const dateStr = item.date
      ? new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(item.date))
      : 'Unknown Date';
      
    const lastGroup = groupedArray[groupedArray.length - 1];
    if (!lastGroup || lastGroup.dateStr !== dateStr) {
      groupedArray.push({ dateStr, items: [item] });
    } else {
      lastGroup.items.push(item);
    }
  });

  const countMilestones = timeline.filter(i => i.type === 'milestone').length;
  const countReports = timeline.filter(i => i.type === 'report').length;

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
            onClick={() => setFilter('reports')}
            style={{
              padding: '8px 16px', borderRadius: '20px', fontWeight: '500', fontSize: '0.9rem', cursor: 'pointer',
              backgroundColor: filter === 'reports' ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
              color: filter === 'reports' ? '#000' : 'var(--text-primary)',
              border: filter === 'reports' ? '1px solid var(--primary)' : '1px solid var(--border)',
              transition: 'all 0.2s', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '6px'
            }}
          >
            📄 Medical Reports ({countReports})
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
                  ? new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit' }).format(new Date(item.date))
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
                      {/* GOLDEN DOCUMENT ICON */}
                      <div style={{ 
                        position: 'absolute', left: '-41px', top: '16px', width: '24px', height: '24px', 
                        borderRadius: '50%', backgroundColor: 'var(--primary)', boxShadow: '0 0 10px var(--glow)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2
                      }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                          <polyline points="14 2 14 8 20 8"></polyline>
                          <line x1="16" y1="13" x2="8" y2="13"></line>
                          <line x1="16" y1="17" x2="8" y2="17"></line>
                          <polyline points="10 9 9 9 8 9"></polyline>
                        </svg>
                      </div>

                      <div className="interactive-card" style={{ backgroundColor: 'var(--surface)', borderRadius: '16px', padding: '1.5rem', border: '1px solid var(--border)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                          <div style={{ fontWeight: '600', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            Medical Report
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
