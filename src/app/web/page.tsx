'use client';

import { useEffect, useState } from 'react';
import QRCode from 'react-qr-code';
import { useRouter } from 'next/navigation';
import { doc, setDoc, onSnapshot, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { RefreshCw, MonitorSmartphone, ShieldCheck } from 'lucide-react';

const SESSION_DURATION = 300; // 5 minutes

export default function QRSharePage() {
  const router = useRouter();
  const [sessionId, setSessionId] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState(SESSION_DURATION);
  const [status, setStatus] = useState<'loading' | 'active' | 'expired' | 'success'>('loading');

  const generateSession = async () => {
    setStatus('loading');
    const newSessionId = Math.random().toString(36).substring(2, 10).toUpperCase();
    
    try {
      await setDoc(doc(db, 'qr_sessions', newSessionId), {
        status: 'waiting',
        created_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + SESSION_DURATION * 1000).toISOString()
      });
      
      setSessionId(newSessionId);
      setTimeLeft(SESSION_DURATION);
      setStatus('active');
    } catch (err) {
      console.error("Failed to generate session", err);
    }
  };

  useEffect(() => {
    generateSession();
  }, []);

  useEffect(() => {
    if (status !== 'active') return;
    
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setStatus('expired');
          clearInterval(interval);
          // Immediately delete the session from the database to keep it clean
          if (sessionId) {
            deleteDoc(doc(db, 'qr_sessions', sessionId)).catch(console.error);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [status, sessionId]);

  useEffect(() => {
    if (status !== 'active' || !sessionId) return;
    
    const unsubscribe = onSnapshot(doc(db, 'qr_sessions', sessionId), async (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        if (data.status === 'linked') {
          // Support both the new generic format and the legacy view_id format
          const targetId = data.target_id || data.view_id;
          const targetType = data.target_type || 'snapshot'; // default to snapshot
          
          if (targetId) {
            setStatus('success');
            await deleteDoc(doc(db, 'qr_sessions', sessionId));
            
            // Route dynamically based on type
            if (targetType === 'journey') {
              router.push(`/journey/${targetId}`);
            } else if (targetType === 'story') {
              router.push(`/story/${targetId}`);
            } else if (targetType === 'user') {
              router.push(`/user/${targetId}`);
            } else {
              router.push(`/snapshot/${targetId}`);
            }
          }
        }
      }
    });

    return () => unsubscribe();
  }, [sessionId, status, router]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--background)', color: 'var(--text-primary)', fontFamily: 'system-ui, sans-serif' }}>
      
      <div className="banner" style={{ padding: '16px 24px' }}>
        <div className="banner-brand" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img src="/logo.png" alt="Logo" className="banner-logo" style={{ width: '48px', height: '48px', objectFit: 'contain' }} />
          <div className="banner-title" style={{ fontFamily: 'sans-serif', fontWeight: 600, fontSize: '1.25rem', color: '#fff', lineHeight: 1.1 }}>
            <div style={{ letterSpacing: '0.7px' }}>HEALING</div>
            <div style={{ letterSpacing: '0.2px' }}>MILESTONES</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
          <ShieldCheck size={18} />
          <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>Secure Sync</span>
        </div>
      </div>

      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ maxWidth: '850px', width: '100%', backgroundColor: 'var(--surface)', padding: '3rem', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 20px 40px rgba(0,0,0,0.4)', display: 'flex', flexWrap: 'wrap', gap: '3rem', alignItems: 'center', justifyContent: 'space-between' }}>
          
          {/* Left Side: Title and Steps */}
          <div style={{ flex: '1 1 300px', minWidth: '300px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: 'rgba(250, 204, 21, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', color: 'var(--primary)' }}>
              <MonitorSmartphone size={28} />
            </div>

            <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', color: 'var(--text-primary)', fontWeight: 'bold' }}>Web Sync</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: '1.5' }}>
              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#fff', flexShrink: 0 }}>1</div>
                <div>Open the <strong>Healing Milestones</strong> mobile app.</div>
              </div>
              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#fff', flexShrink: 0 }}>2</div>
                <div>View any Journey, Story, or Snapshot and tap <strong>Share</strong>.</div>
              </div>
              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#fff', flexShrink: 0 }}>3</div>
                <div>Select <strong>Share to Web</strong> and point your camera here.</div>
              </div>
            </div>
          </div>

          {/* Right Side: QR Code and Timer */}
          <div style={{ flex: '0 0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '0 auto' }}>
            <div style={{ position: 'relative', width: '260px', height: '260px', backgroundColor: 'white', padding: '16px', borderRadius: '16px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 32px rgba(250, 204, 21, 0.15)' }}>
              
              {status === 'loading' && <div style={{ color: '#000', fontWeight: 'bold' }}>Generating...</div>}
              
              {status === 'active' && sessionId && (
                <QRCode value={`https://healingmilestones.in/sync?session=${sessionId}`} size={228} style={{ height: "auto", maxWidth: "100%", width: "100%" }} />
              )}

              {status === 'expired' && (
                <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                  <span style={{ color: '#ef4444', fontWeight: 'bold', marginBottom: '16px', fontSize: '1.2rem' }}>Code Expired</span>
                  <button 
                    onClick={generateSession}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', backgroundColor: 'var(--primary)', color: '#000', border: 'none', borderRadius: '24px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', transition: 'transform 0.2s' }}
                  >
                    <RefreshCw size={18} />
                    New Code
                  </button>
                </div>
              )}

              {status === 'success' && (
                <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(250, 204, 21, 0.95)', borderRadius: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <ShieldCheck size={48} color="#000" style={{ marginBottom: '16px' }} />
                  <span style={{ color: '#000', fontWeight: 'bold', fontSize: '1.3rem' }}>Sync Complete!</span>
                </div>
              )}
            </div>

            {status === 'active' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: timeLeft < 60 ? '#ef4444' : 'var(--text-secondary)', fontWeight: '600', fontSize: '1.1rem', transition: 'color 0.3s' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: timeLeft < 60 ? '#ef4444' : 'var(--primary)', boxShadow: `0 0 10px ${timeLeft < 60 ? '#ef4444' : 'var(--primary)'}` }}></div>
                Expires in {formatTime(timeLeft)}
              </div>
            )}
            
            {status === 'expired' && (
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', textAlign: 'center', maxWidth: '260px' }}>
                For your security, QR codes expire after 5 minutes.
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}
