import re

with open('src/app/connect/page.tsx', 'r') as f:
    content = f.read()

# Replace Web Sync
content = content.replace("""<Link href="/web" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', border: '1px solid var(--primary)', color: 'var(--primary)', borderRadius: '8px', textDecoration: 'none', fontWeight: '500', fontSize: '0.9rem' }}>""",
                          """<Link href="/web" className="nav-btn">""")

# Replace Sign Out
content = content.replace("""<button 
            onClick={logout}
            style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-secondary)', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' }}
          >""",
                          """<button 
            onClick={logout}
            className="nav-btn"
          >""")

with open('src/app/connect/page.tsx', 'w') as f:
    f.write(content)
