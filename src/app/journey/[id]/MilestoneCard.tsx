'use client';
import { safeUtcDate } from '@/utils/dateUtils';

import React, { useState, useEffect } from 'react';

export default function MilestoneCard({ milestone }: { milestone: any }) {
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);

  const isClosure = milestone.is_closure;
  const mDateStr = milestone.created_at
    ? new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(safeUtcDate(milestone.created_at))
    : '';

  const handleOpenComments = async () => {
    setShowComments(true);
    setLoadingComments(true);
    try {
      const response = await fetch(`https://healing-milestones-api.onrender.com/api/journeys/milestones/${milestone.id}/comments`);
      if (response.ok) {
        const data = await response.json();
        setComments(data.items || []);
      }
    } catch (e) {
      console.error(e);
    }
    setLoadingComments(false);
  };

  return (
    <>
      <div className="milestone-card" style={{ position: 'relative', marginBottom: '2rem' }}>
        <div style={{ 
          position: 'absolute', 
          left: '-2rem', 
          top: '6px', 
          width: '12px', 
          height: '12px', 
          borderRadius: '50%', 
          backgroundColor: isClosure ? '#22c55e' : 'var(--primary)',
          boxShadow: `0 0 10px ${isClosure ? 'rgba(34,197,94,0.5)' : 'var(--glow)'}`
        }}></div>
        
        <div style={{
          backgroundColor: 'var(--surface)',
          borderRadius: '16px',
          padding: '1.5rem',
          border: '1px solid var(--border)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ fontWeight: '600', color: isClosure ? '#22c55e' : 'var(--text-primary)' }}>
              {isClosure ? 'Journey Completed' : 'Update'}
            </div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              {mDateStr}
            </div>
          </div>
          
          {milestone.media_url && (
            <div style={{ marginBottom: '1rem', borderRadius: '12px', overflow: 'hidden' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={milestone.media_url} alt="Milestone media" style={{ width: '100%', height: 'auto', display: 'block' }} />
            </div>
          )}
          
          {milestone.content && (
            <div style={{ color: '#eaeaea', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
              {milestone.content}
            </div>
          )}
          
          <div style={{ 
            marginTop: '1.5rem', 
            paddingTop: '1rem', 
            borderTop: '1px solid rgba(255,255,255,0.05)',
            display: 'flex',
            gap: '1.5rem',
            color: 'var(--text-secondary)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ fontSize: '1.1rem' }}>❤️</span>
              <span>{milestone.reaction_count || 0}</span>
            </div>
            {milestone.are_comments_enabled && (
              <div 
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}
                onClick={handleOpenComments}
              >
                <span style={{ fontSize: '1.1rem' }}>💬</span>
                <span style={{ color: 'var(--text-primary)' }}>{milestone.comment_count || 0} Comments</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {showComments && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            backdropFilter: 'blur(4px)'
          }}
          onClick={() => setShowComments(false)}
        >
          <div 
            style={{
              backgroundColor: '#1a1a1a',
              width: '100%',
              maxWidth: '600px',
              height: '80vh',
              borderTopLeftRadius: '24px',
              borderTopRightRadius: '24px',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 -10px 40px rgba(0,0,0,0.5)',
              border: '1px solid var(--border)',
              borderBottom: 'none'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Handle bar for bottom sheet look */}
            <div style={{ width: '100%', display: 'flex', justifyContent: 'center', padding: '12px 0' }}>
              <div style={{ width: '40px', height: '4px', backgroundColor: '#333', borderRadius: '4px' }}></div>
            </div>
            
            <div style={{ padding: '0 1.5rem 1rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '600' }}>Comments</h3>
              <button onClick={() => setShowComments(false)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
              {loadingComments ? (
                <div style={{ textAlign: 'center', color: 'var(--text-secondary)', marginTop: '2rem' }}>Loading comments...</div>
              ) : comments.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'var(--text-secondary)', marginTop: '2rem' }}>No comments yet.</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {comments.map((comment) => (
                    <div key={comment.id} style={{ display: 'flex', gap: '1rem' }}>
                      <img 
                        src={comment.user.profilePicture || `https://ui-avatars.com/api/?name=${comment.user.displayName}`} 
                        alt={comment.user.displayName}
                        style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <div>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                          <span style={{ fontWeight: '600', fontSize: '0.95rem' }}>{comment.user.displayName}</span>
                          <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                            {safeUtcDate(comment.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                        <div style={{ marginTop: '0.2rem', color: '#e5e5e5', lineHeight: '1.4', fontSize: '0.95rem' }}>
                          {comment.text}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div style={{ padding: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)', backgroundColor: 'rgba(0,0,0,0.2)' }}>
              <div style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '1rem', fontSize: '0.9rem' }}>
                Join the conversation and offer your support.
              </div>
              <a href="https://healingmilestones.in" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                <button style={{ 
                  width: '100%', 
                  padding: '14px', 
                  backgroundColor: 'var(--primary)', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '12px',
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  cursor: 'pointer'
                }}>
                  Download App to Comment
                </button>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
