'use client';

import { useState } from 'react';

export default function SnapshotTimeline({ timeline, expiresAt }: { timeline: any[], expiresAt: string }) {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<'pdf' | 'image' | null>(null);

  const openLightbox = (url: string, isPdf: boolean, e: React.MouseEvent) => {
    e.preventDefault();
    setSelectedFile(url);
    setSelectedType(isPdf ? 'pdf' : 'image');
  };

  const closeLightbox = () => {
    setSelectedFile(null);
    setSelectedType(null);
  };

  return (
    <div className="milestones-timeline" style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
        <h2 style={{ color: 'var(--text-primary)', margin: 0 }}>
          Snapshot Timeline ({timeline.length})
        </h2>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', backgroundColor: 'rgba(255,255,255,0.05)', padding: '4px 10px', borderRadius: '12px' }}>
          Read Only
        </div>
      </div>
      
      {timeline.length > 0 ? (
        <div className="timeline-container" style={{ position: 'relative', paddingLeft: '2.5rem' }}>
          <div style={{ position: 'absolute', left: '11px', top: '10px', bottom: '0', width: '2px', backgroundColor: 'var(--border)' }}></div>
          
          {timeline.map((item: any) => {
            const itemDateStr = item.date
              ? new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(item.date))
              : '';
            
            if (item.type === 'milestone') {
              return (
                <div key={`m-${item.id}`} className="milestone-card" style={{ position: 'relative', marginBottom: '2rem' }}>
                  <div style={{ 
                    position: 'absolute', left: '-35px', top: '24px', width: '12px', height: '12px', 
                    borderRadius: '50%', backgroundColor: 'var(--primary)', boxShadow: '0 0 10px var(--glow)'
                  }}></div>
                  <div style={{ backgroundColor: 'var(--surface)', borderRadius: '16px', padding: '1.5rem', border: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>Journal Update</div>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{itemDateStr}</div>
                    </div>
                    {item.mediaUrl && (
                      <div style={{ marginBottom: '1rem', borderRadius: '12px', overflow: 'hidden' }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={item.mediaUrl} alt="Media" style={{ width: '100%', height: 'auto', display: 'block' }} />
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
              const gridCols = files.length === 1 ? '1fr' : '1fr 1fr';

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

                  {/* NO THICK BLUE BORDER */}
                  <div style={{ backgroundColor: 'var(--surface)', borderRadius: '16px', padding: '1.5rem', border: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <div style={{ fontWeight: '600', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        Medical Report
                      </div>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{itemDateStr}</div>
                    </div>
                    <h3 style={{ margin: '0 0 1rem 0', color: 'var(--text-primary)', fontSize: '1.1rem' }}>{item.title}</h3>
                    
                    {/* GRID INSTEAD OF CAROUSEL */}
                    <div style={{ display: 'grid', gridTemplateColumns: gridCols, gap: '1rem' }}>
                      {files.map((file: any, index: number) => {
                        const url = typeof file === 'string' ? file : file.url;
                        if (!url) return null;
                        const isPdf = url.toLowerCase().includes('.pdf');
                        const isImage = url.toLowerCase().match(/\.(jpeg|jpg|gif|png|webp)$/) != null;

                        return (
                          <div 
                            key={index} 
                            onClick={(e) => openLightbox(url, isPdf, e)}
                            style={{ 
                              position: 'relative', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', 
                              overflow: 'hidden', backgroundColor: 'rgba(0,0,0,0.3)', height: '180px', cursor: 'pointer' 
                            }}
                          >
                            {isPdf ? (
                              <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
                                <span style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>📄</span>
                                <span style={{ color: 'var(--primary)', fontWeight: '500', fontSize: '0.9rem' }}>View PDF</span>
                              </div>
                            ) : isImage ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={url} alt={`Document ${index + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                              <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666' }}>
                                View Document
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            }
          })}
        </div>
      ) : (
        <div className="no-milestones" style={{ color: 'var(--text-secondary)', padding: '2rem 0' }}>
          No timeline items available in this snapshot.
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
            padding: '2rem'
          }}
        >
          <div 
            onClick={closeLightbox}
            style={{ position: 'absolute', top: '1rem', right: '2rem', color: 'white', cursor: 'pointer', fontSize: '2.5rem', zIndex: 10000 }}
          >
            &times;
          </div>
          
          <div 
            onClick={e => e.stopPropagation()}
            style={{ width: '100%', maxWidth: '1000px', height: '85vh', backgroundColor: selectedType === 'pdf' ? '#fff' : 'transparent', borderRadius: '12px', overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
          >
            {selectedType === 'pdf' ? (
              <iframe src={`${selectedFile}#toolbar=0`} style={{ width: '100%', height: '100%', border: 'none' }} title="PDF Document" />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={selectedFile} alt="Fullscreen Document" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
