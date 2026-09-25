import re

with open('src/app/connect/page.tsx', 'r') as f:
    content = f.read()

# 1. Update imports
if 'Search' not in content:
    content = content.replace("import { User, Clock, Calendar, Trash2, Eye, FileText, Loader2 } from 'lucide-react';", "import { User, Clock, Calendar, Trash2, Eye, FileText, Loader2, Search, ChevronLeft, ChevronRight } from 'lucide-react';")

# 2. Add new state variables
state_vars = """  const [roster, setRoster] = useState<any[]>([]);
  const [fetching, setFetching] = useState(true);
  const [loadingSnapshotId, setLoadingSnapshotId] = useState<string | null>(null);"""

new_state_vars = """  const [roster, setRoster] = useState<any[]>([]);
  const [fetching, setFetching] = useState(true);
  const [loadingSnapshotId, setLoadingSnapshotId] = useState<string | null>(null);
  
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);"""

content = content.replace(state_vars, new_state_vars)

# 3. Update fetch logic
old_fetch = """  const fetchRoster = async (firebaseUser: any) => {
    try {
      const token = await firebaseUser.getIdToken();
      const res = await fetch('https://healing-milestones-api.onrender.com/api/connect/roster', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setRoster(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchRoster(user);
    }
  }, [user]);"""

new_fetch = """  const fetchRoster = async (firebaseUser: any, searchQuery = '', pageNum = 1) => {
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput);
  };
"""

content = content.replace(old_fetch, new_fetch)

# 4. Inject search bar
old_dashboard_header = """          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
              <h2 style={{ fontSize: '1.8rem', margin: '0 0 8px 0', fontFamily: "'Oswald', sans-serif" }}>Patient Roster</h2>
              <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Manage and monitor your saved patient health snapshots.</p>
            </div>
          </div>
        </div>"""

new_dashboard_header = """          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h2 style={{ fontSize: '1.8rem', margin: '0 0 8px 0', fontFamily: "'Oswald', sans-serif" }}>Patient Roster</h2>
              <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Manage and monitor your saved patient health snapshots.</p>
            </div>
          </div>
          
          <form onSubmit={handleSearch} style={{ marginTop: '24px', display: 'flex', gap: '12px' }}>
            <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
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
                  border: '1px solid var(--border)',
                  background: 'var(--surface)',
                  color: 'var(--text-primary)',
                  fontSize: '0.95rem'
                }}
              />
            </div>
            <button 
              type="submit"
              style={{ padding: '12px 24px', borderRadius: '12px', background: 'var(--primary)', color: 'var(--background)', fontWeight: 600, border: 'none', cursor: 'pointer' }}
            >
              Search
            </button>
            {search && (
              <button 
                type="button"
                onClick={() => { setSearchInput(''); setSearch(''); setPage(1); }}
                style={{ padding: '12px 24px', borderRadius: '12px', background: 'transparent', color: 'var(--text-secondary)', border: '1px solid var(--border)', cursor: 'pointer' }}
              >
                Clear
              </button>
            )}
          </form>
        </div>"""

content = content.replace(old_dashboard_header, new_dashboard_header)

# 5. Add Pagination Controls at the bottom
old_main_end = """              );
            })}
          </div>
        )}
      </main>"""

new_main_end = """              );
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
      </main>"""

content = content.replace(old_main_end, new_main_end)

with open('src/app/connect/page.tsx', 'w') as f:
    f.write(content)

