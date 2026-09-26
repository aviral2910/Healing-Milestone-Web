'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, Clock, Calendar, Trash2, Eye, FileText, Loader2, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { UserBadge } from '@/components/UserBadge';

export default function ConnectDashboard() {
  const { user, profile, loading, needsOnboarding, logout } = useAuth();
  const router = useRouter();
  const [roster, setRoster] = useState<any[]>([]);
  const [fetching, setFetching] = useState(true);
  const [loadingSnapshotId, setLoadingSnapshotId] = useState<string | null>(null);
  
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  const fetchRoster = async (firebaseUser: any, searchQuery = '', pageNum = 1) => {
    try {
      setFetching(true);
      const token = await firebaseUser.getIdToken();
      const params = new URLSearchParams({ page: pageNum.toString(), limit: '20' });
      if (searchQuery.trim()) {
        params.append('search', searchQuery.trim());
      }
      const res = await fetch(`https://healing-milestones-api.onrender.com/api/connect/roster?${params.toString()}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setRoster(data.items || []);
        setTotalPages(data.pages || 1);
        setTotalItems(data.total || 0);
        setPage(data.page || 1);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchRoster(user, search, page);
    }
  }, [user, search, page]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput);
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
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 40px', background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <img src="/icon.png" alt="Logo" style={{ width: '40px', height: '40px', borderRadius: '8px' }} />
          <div>
            <h1 style={{ margin: 0, fontSize: '1.4rem', fontFamily: "'Oswald', sans-serif", color: 'var(--text-primary)' }}>
              HM Connect
            </h1>
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
        <div style={{ marginBottom: '40px' }}>
          <div style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
            Welcome, <strong style={{ color: 'var(--text-primary)', marginLeft: '6px' }}>{profile?.role === 'healthcareProfessional' ? 'Dr. ' : ''}{profile?.displayName || user.displayName}</strong>
            <UserBadge role={profile?.role} isVerified={profile?.isVerified || (profile as any)?.is_verified} size={22} style={{ marginLeft: '8px' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h2 style={{ fontSize: '1.8rem', margin: '0 0 8px 0', fontFamily: "'Oswald', sans-serif" }}>Patient Roster</h2>
              <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Manage and monitor your saved patient health snapshots.</p>
            </div>
          </div>
          
          <div style={{ marginTop: '24px', display: 'flex', gap: '12px' }}>
            <div style={{ position: 'relative', flex: 1, maxWidth: '500px' }}>
              <div style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }}>
                <Search size={18} />
              </div>
              <input
                type="text"
                placeholder="Search by patient name or alias..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px 12px 44px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(255,255,255,0.03)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-primary)',
                  fontSize: '0.95rem',
                  outline: 'none',
                  transition: 'border-color 0.2s ease'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
              />
            </div>
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
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', color: 'var(--text-primary)', marginTop: '4px' }}>
                          <FileText size={14} style={{ color: 'var(--text-secondary)' }} />
                          <span style={{ fontWeight: 400 }}>{snapshotTitle}</span>
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
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '40px', gap: '16px' }}>
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              style={{ padding: '8px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-primary)', cursor: page === 1 ? 'not-allowed' : 'pointer', opacity: page === 1 ? 0.5 : 1, display: 'flex' }}
            >
              <ChevronLeft size={20} />
            </button>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Page <strong style={{ color: 'var(--text-primary)' }}>{page}</strong> of {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              style={{ padding: '8px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-primary)', cursor: page === totalPages ? 'not-allowed' : 'pointer', opacity: page === totalPages ? 0.5 : 1, display: 'flex' }}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
