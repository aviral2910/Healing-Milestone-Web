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

      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
        <style>{`
          .sync-card {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            gap: 4rem;
            padding: 3.5rem;
            background: linear-gradient(145deg, #18181b, #09090b);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 32px;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255,255,255,0.05);
            max-width: 860px;
            width: 100%;
          }
          .sync-left {
            flex: 1;
            display: flex;
            flex-direction: column;
          }
          .sync-title-row {
            display: flex;
            align-items: center;
            gap: 16px;
            margin-bottom: 2rem;
          }
          .sync-title {
            font-size: 2.2rem;
            font-weight: 800;
            color: #fff;
            letter-spacing: -0.5px;
            margin: 0;
          }
          .icon-box {
            width: 54px;
            height: 54px;
            border-radius: 16px;
            background: rgba(250, 204, 21, 0.1);
            color: #facc15;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .steps-container {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
          }
          .step-item {
            display: flex;
            gap: 18px;
            align-items: flex-start;
            color: #a1a1aa;
            font-size: 1.05rem;
            line-height: 1.6;
          }
          .step-num {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background: rgba(250, 204, 21, 0.15);
            color: #facc15;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            font-size: 0.95rem;
            flex-shrink: 0;
            margin-top: 2px;
          }
          .sync-right {
            flex: 0 0 auto;
            display: flex;
            flex-direction: column;
            align-items: center;
            background: rgba(255, 255, 255, 0.02);
            padding: 32px;
            border-radius: 28px;
            border: 1px dashed rgba(255, 255, 255, 0.1);
          }
          .qr-container {
            position: relative;
            background: white;
            padding: 16px;
            border-radius: 20px;
            margin-bottom: 1.5rem;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            width: 240px;
            height: 240px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .timer-pill {
            display: flex;
            align-items: center;
            gap: 8px;
            font-weight: 600;
            font-size: 1.05rem;
            background: rgba(0,0,0,0.3);
            padding: 8px 16px;
            border-radius: 20px;
            border: 1px solid rgba(255,255,255,0.05);
          }
          @media (max-width: 800px) {
            .sync-card {
              flex-direction: column;
              padding: 2.5rem 1.5rem;
              gap: 3rem;
            }
            .sync-title-row {
              justify-content: center;
              margin-bottom: 2.5rem;
            }
            .step-item {
              font-size: 1rem;
            }
            .qr-container {
              width: 220px;
              height: 220px;
            }
            .sync-right {
              width: 100%;
              padding: 24px;
            }
          }
        `}</style>

        <div className="sync-card">
          
          {/* Left Side: Title and Steps */}
          <div className="sync-left">
            <div className="sync-title-row">
              <div className="icon-box">
                <MonitorSmartphone size={28} strokeWidth={2.5} />
              </div>
              <h2 className="sync-title">Web Sync</h2>
            </div>
            
            <div className="steps-container">
              <div className="step-item">
                <div className="step-num">1</div>
                <div>Open the <strong style={{ color: '#fff' }}>Healing Milestones</strong> app on your mobile device.</div>
              </div>
              <div className="step-item">
                <div className="step-num">2</div>
                <div>View any Journey, Story, or Snapshot and tap the <strong style={{ color: '#fff' }}>Share</strong> button.</div>
              </div>
              <div className="step-item">
                <div className="step-num">3</div>
                <div>Select <strong style={{ color: '#fff' }}>Share to Web</strong> and point your camera at this screen.</div>
              </div>
            </div>
          </div>

          {/* Right Side: QR Code and Timer */}
          <div className="sync-right">
            <div className="qr-container">
              
              {status === 'loading' && <div style={{ color: '#000', fontWeight: 'bold' }}>Generating...</div>}
              
              {status === 'active' && sessionId && (
                <QRCode value={`https://healingmilestones.in/sync?session=${sessionId}`} size={208} style={{ height: "auto", maxWidth: "100%", width: "100%" }} />
              )}

              {status === 'expired' && (
                <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
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
                <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(250, 204, 21, 0.95)', borderRadius: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <ShieldCheck size={48} color="#000" style={{ marginBottom: '16px' }} />
                  <span style={{ color: '#000', fontWeight: 'bold', fontSize: '1.3rem' }}>Sync Complete!</span>
                </div>
              )}
            </div>

            {status === 'active' && (
              <div className="timer-pill" style={{ color: timeLeft < 60 ? '#ef4444' : '#e4e4e7' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: timeLeft < 60 ? '#ef4444' : 'var(--primary)', boxShadow: `0 0 10px ${timeLeft < 60 ? 'rgba(239, 68, 68, 0.5)' : 'rgba(250, 204, 21, 0.5)'}` }}></div>
                Expires in {formatTime(timeLeft)}
              </div>
            )}
            
            {status === 'expired' && (
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textAlign: 'center', maxWidth: '240px' }}>
                For your security, QR codes expire automatically.
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}
