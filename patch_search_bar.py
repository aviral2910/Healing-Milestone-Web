import re

with open('src/app/connect/page.tsx', 'r') as f:
    content = f.read()

# 1. Add debounce effect to searchInput
debounce_code = """  useEffect(() => {
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
  };"""

content = re.sub(r"  const handleSearch = \(e: React.FormEvent\) => \{\n    e.preventDefault\(\);\n    setPage\(1\);\n    setSearch\(searchInput\);\n  \};\n", debounce_code + "\n", content)

# 2. Update the Search Bar UI
old_form = """          <form onSubmit={handleSearch} style={{ marginTop: '24px', display: 'flex', gap: '12px' }}>
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
          </form>"""

new_form = """          <div style={{ marginTop: '24px', display: 'flex', gap: '12px' }}>
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
          </div>"""

content = content.replace(old_form, new_form)

with open('src/app/connect/page.tsx', 'w') as f:
    f.write(content)
