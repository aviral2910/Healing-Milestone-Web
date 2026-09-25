'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, Clock, Calendar, Trash2, Eye, FileText, Loader2, BadgeCheck } from 'lucide-react';

export default function ConnectDashboard() {
  const { user, profile, loading, needsOnboarding, logout } = useAuth();
  const router = useRouter();
  const [roster, setRoster] = useState<any[]>([]);
  const [fetching, setFetching] = useState(true);
  const [loadingSnapshotId, setLoadingSnapshotId] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      fetchRoster();
    }
  }, [user]);

  const fetchRoster = async () => {
    try {
      setFetching(true);
      const token = await user?.getIdToken();
      const res = await fetch('https://healing-milestones-api.onrender.com/api/connect/roster', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setRoster(data);
      }
    } catch (e) {
      console.error("Failed to fetch roster", e);
    } finally {
      setFetching(false);
    }
  };

  const removePatient = async (rosterId: string) => {
    if (!confirm('Remove this patient from your roster?')) return;
    try {
      const token = await user?.getIdToken();
      const res = await fetch(`https://healing-milestones-api.onrender.com/api/connect/roster/${rosterId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setRoster(r => r.filter(item => item.id !== rosterId));
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (loading || !user || needsOnboarding) {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--background)', color: 'var(--text-primary)', padding: '0' }}>
      {/* Header */}
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 40px', background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <img src="/icon.png" alt="Logo" style={{ width: '40px', height: '40px', borderRadius: '8px' }} />
          <div>
            <h1 style={{ margin: 0, fontSize: '1.4rem', fontFamily: "'Oswald', sans-serif", color: 'var(--primary)' }}>
              HM Connect
            </h1>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center' }}>
              Welcome, {profile?.role === 'healthcareProfessional' ? 'Dr. ' : ''}{profile?.displayName || user.displayName}
              {(profile?.isVerified || (profile as any)?.is_verified) && <BadgeCheck size={16} color="#3b82f6" style={{ marginLeft: '6px' }} />}
            </div>
          </div>
        </div>
        <button 
          onClick={logout}
          style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-secondary)', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' }}
        >
          Sign Out
        </button>
      </header>

      {/* Main Dashboard */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
          <div>
            <h2 style={{ fontSize: '1.8rem', margin: '0 0 8px 0', fontFamily: "'Oswald', sans-serif" }}>Patient Roster</h2>
            <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Manage and monitor your saved patient health snapshots.</p>
          </div>
        </div>

        {fetching ? (
          <div style={{ padding: '60px', textAlign: 'center' }}><div className="spinner" style={{ margin: '0 auto' }}></div></div>
        ) : roster.length === 0 ? (
          <div style={{ background: 'var(--surface)', border: '1px dashed var(--border)', borderRadius: '16px', padding: '60px 24px', textAlign: 'center' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '12px' }}>Your roster is empty</h3>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto 24px auto', lineHeight: '1.5' }}>
              When a patient sends you a Healing Milestones share link, you can save it to your roster for easy access.
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
            {roster.map((item) => {
              const realName = item.mix_view?.author_name || 'Patient';
              const snapshotTitle = item.patient_alias || item.mix_view?.name || 'Untitled Snapshot';
              const initial = realName.charAt(0).toUpperCase();
              return (
                <div 
                  key={item.id} 
                  onClick={() => { setLoadingSnapshotId(item.mix_view_id); router.push(`/snapshot/${item.mix_view_id}`); }}
                  style={{ position: 'relative', background: 'var(--surface)', borderRadius: '16px', border: '1px solid var(--border)', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', transition: 'all 0.2s ease', cursor: 'pointer' }}
                  onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.2)'; }}
                  onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  {/* Card Header */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.15) 0%, rgba(212, 175, 55, 0.02) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', fontWeight: 'bold', fontSize: '1.2rem', border: '1px solid rgba(212, 175, 55, 0.2)' }}>
                        {initial}
                      </div>
                      <div>
                        <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                          {realName}
                        </h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                          <FileText size={14} />
                          {snapshotTitle}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                          <Calendar size={14} />
                          Added {new Date(item.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={(e) => { e.stopPropagation(); removePatient(item.id); }}
                      style={{ background: 'transparent', color: 'var(--text-secondary)', border: 'none', cursor: 'pointer', padding: '8px', borderRadius: '50%', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      onMouseOver={(e) => { e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'; }}
                      onMouseOut={(e) => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.background = 'transparent'; }}
                      title="Remove from roster"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  {/* Metadata Row */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      <Clock size={14} color="var(--primary)" />
                      Valid until: <span style={{ color: 'var(--text-primary)' }}>{item.mix_view ? new Date(item.mix_view.expires_at).toLocaleDateString() : 'Expired'}</span>
                    </div>
                    {item.mix_view?.items && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        <FileText size={14} color="var(--primary)" />
                        Contains {item.mix_view.items.length} records
                      </div>
                    )}
                  </div>

                  {item.notes && <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0 }}>{item.notes}</p>}
                  
                  {loadingSnapshotId === item.mix_view_id && (
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(2px)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '16px', zIndex: 10 }}>
                      <Loader2 size={32} color="var(--primary)" className="animate-spin" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
