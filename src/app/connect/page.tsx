'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, Clock, Calendar, Trash2, Eye, FileText } from 'lucide-react';

export default function ConnectDashboard() {
  const { user, loading, needsOnboarding, logout } = useAuth();
  const router = useRouter();
  const [roster, setRoster] = useState<any[]>([]);
  const [fetching, setFetching] = useState(true);

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
            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Welcome, {user.displayName}
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '24px' }}>
            {roster.map((item) => {
              const patientName = item.patient_alias || item.mix_view?.name || 'Unknown Patient';
              const initial = patientName.charAt(0).toUpperCase();
              return (
                <div key={item.id} style={{ background: 'var(--surface)', borderRadius: '16px', border: '1px solid var(--border)', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', transition: 'transform 0.2s, box-shadow 0.2s' }}>
                  {/* Card Header */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.15) 0%, rgba(212, 175, 55, 0.02) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', fontWeight: 'bold', fontSize: '1.2rem', border: '1px solid rgba(212, 175, 55, 0.2)' }}>
                        {initial}
                      </div>
                      <div>
                        <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                          {patientName}
                        </h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                          <User size={14} />
                          {item.mix_view?.author?.display_name || item.mix_view?.user?.display_name || 'Patient Snapshot'}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                          <Calendar size={14} />
                          Added {new Date(item.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
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

                  <div style={{ flexGrow: 1 }} />
                  
                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                    <button 
                      onClick={() => removePatient(item.id)}
                      style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', background: 'rgba(239, 68, 68, 0.05)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: '500', fontSize: '0.9rem', transition: 'all 0.2s' }}
                      onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'; }}
                      onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.05)'; }}
                    >
                      <Trash2 size={16} /> Remove
                    </button>
                    <Link 
                      href={`/snapshot/${item.mix_view_id}`}
                      style={{ flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', background: 'linear-gradient(135deg, var(--primary) 0%, #b89326 100%)', color: '#000', padding: '10px 16px', borderRadius: '8px', textDecoration: 'none', fontWeight: '600', fontSize: '0.9rem', boxShadow: '0 4px 12px rgba(212, 175, 55, 0.2)' }}
                    >
                      <Eye size={16} strokeWidth={2.5} /> View Snapshot
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
